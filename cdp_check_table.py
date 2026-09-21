import asyncio
import json
import urllib.request
import websockets

async def check_table():
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
        
        # Wait a bit
        await asyncio.sleep(3)
        
        js_code = """
        (() => {
            // Find keyword table rows
            const rows = Array.from(document.querySelectorAll('tbody tr'));
            const data = rows.map(r => {
                const cells = Array.from(r.querySelectorAll('td'));
                return cells.map(c => c.innerText.trim());
            });
            
            // Also check total keyword count header if present
            const headers = Array.from(document.querySelectorAll('h1, h2, h3, [class*="total"], [class*="count"]')).map(e => e.innerText.trim());
            
            return {
                rowCount: rows.length,
                headers: headers.filter(h => h.length > 0 && h.length < 50),
                first10Rows: data.slice(0, 15)
            };
        })()
        """
        eval_res = await call("Runtime.evaluate", {
            "expression": js_code,
            "returnByValue": True
        })
        val = eval_res.get('result', {}).get('result', {}).get('value', {})
        print(json.dumps(val, indent=2))

if __name__ == '__main__':
    asyncio.run(check_table())
