import asyncio
import json
import urllib.request
import websockets

async def scrape_full_table():
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
        
        js_code = """
        (() => {
            const table = document.querySelector('table');
            if (!table) return { error: 'No table found' };
            
            // Get table headers
            const ths = Array.from(table.querySelectorAll('th')).map(th => th.innerText.trim()).filter(Boolean);
            
            // Get all rows
            const rows = Array.from(table.querySelectorAll('tbody tr'));
            const extracted = [];
            
            rows.forEach(r => {
                const cells = Array.from(r.querySelectorAll('td'));
                if (cells.length < 5) return;
                
                // Let's find keyword link or text
                const kwEl = r.querySelector('a[href*="keywords-explorer"], [class*="keyword"]');
                const kwText = kwEl ? kwEl.innerText.trim() : (cells[2] ? cells[2].innerText.trim() : '');
                
                // Extract all non-empty text from cells
                const cellTexts = cells.map(c => c.innerText.trim());
                
                extracted.push({
                    rawCells: cellTexts
                });
            });
            
            return {
                headers: ths,
                totalExtracted: extracted.length,
                rows: extracted
            };
        })()
        """
        eval_res = await call("Runtime.evaluate", {
            "expression": js_code,
            "returnByValue": True
        })
        val = eval_res.get('result', {}).get('result', {}).get('value', {})
        print("Total rows extracted:", val.get('totalExtracted'))
        with open("ahrefs_live_scraped_table.json", "w", encoding="utf-8") as f:
            json.dump(val, f, indent=2)
        print("Saved to ahrefs_live_scraped_table.json")

if __name__ == '__main__':
    asyncio.run(scrape_full_table())
