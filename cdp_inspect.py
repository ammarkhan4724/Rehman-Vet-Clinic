import asyncio
import json
import urllib.request
import websockets

async def inspect():
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
        
        # Get visible text on page
        eval_res = await call("Runtime.evaluate", {
            "expression": "document.body.innerText.slice(0, 2000)",
            "returnByValue": True
        })
        text = eval_res.get('result', {}).get('result', {}).get('value', '')
        print("=== VISIBLE TEXT ON AHREFS PAGE ===")
        print(text)

if __name__ == '__main__':
    asyncio.run(inspect())
