import asyncio
import json
import urllib.request
import websockets

async def run():
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
        
        # Navigate to remove parentTopic constraint and set KD max to 15
        new_url = "https://arx.rankytools.com/keywords-explorer/list/new/06a4c1e04a62496150901d3d052a0ce2/google/pk/ideas/matchingTerms?difficulty=Max-15"
        print("Navigating to:", new_url)
        await call("Page.navigate", {"url": new_url})
        
        # Wait 4 seconds for page load
        await asyncio.sleep(4)
        
        # Check text and rows
        eval_res = await call("Runtime.evaluate", {
            "expression": "document.body.innerText.slice(0, 3000)",
            "returnByValue": True
        })
        text = eval_res.get('result', {}).get('result', {}).get('value', '')
        print("=== UPDATED PAGE TEXT ===")
        print(text[:1500])

if __name__ == '__main__':
    asyncio.run(run())
