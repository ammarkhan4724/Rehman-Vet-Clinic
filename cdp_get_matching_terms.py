import asyncio
import json
import urllib.request
import websockets

async def get_matching_terms():
    res = urllib.request.urlopen('http://127.0.0.1:9222/json')
    pages = [p for p in json.loads(res.read().decode()) if p.get('type') == 'page']
    ahrefs_page = [p for p in pages if 'rankytools' in p.get('url', '')][0]
    ws_url = ahrefs_page['webSocketDebuggerUrl']
    
    async with websockets.connect(ws_url) as ws:
        msg_id = 1
        async def call(method, params=None):
            nonlocal msg_id
            msg_id += 1
            cur_id = msg_id
            payload = {"id": cur_id, "method": method}
            if params:
                payload["params"] = params
            await ws.send(json.dumps(payload))
            while True:
                resp = await ws.recv()
                data = json.loads(resp)
                if data.get('id') == cur_id:
                    return data

        await call("Page.enable")
        await call("Runtime.enable")
        
        matching_url = "https://arx.rankytools.com/keywords-explorer/list/new/2b9a324546be3079cd4a2d95ceb14046/google/pk/ideas/matchingTerms"
        print("Navigating to:", matching_url)
        await call("Page.navigate", {"url": matching_url})
        await asyncio.sleep(5)
        
        # Scrape all table rows
        js_scrape = """
        (() => {
            const rows = Array.from(document.querySelectorAll('tbody tr'));
            const data = rows.map(r => {
                const cells = Array.from(r.querySelectorAll('td'));
                return cells.map(c => c.innerText.trim()).filter(t => t.length > 0);
            }).filter(r => r.length > 0);
            
            // Check total count on page
            const text = document.body.innerText;
            const match = text.match(/([0-9,]+)\\s+keywords/i);
            
            return {
                totalKeywordsFound: match ? match[1] : null,
                rowsCount: data.length,
                allRows: data
            };
        })()
        """
        eval_res = await call("Runtime.evaluate", {
            "expression": js_scrape,
            "returnByValue": True
        })
        val = eval_res.get('result', {}).get('result', {}).get('value', {})
        print("Keywords count:", val.get('totalKeywordsFound'))
        print("Rows extracted:", val.get('rowsCount'))
        with open("ahrefs_live_matching_terms.json", "w", encoding="utf-8") as f:
            json.dump(val, f, indent=2)
        print("Saved to ahrefs_live_matching_terms.json")

if __name__ == '__main__':
    asyncio.run(get_matching_terms())
