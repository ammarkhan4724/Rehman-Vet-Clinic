import asyncio
import json
import urllib.request
import websockets

async def check_search_page():
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
        
        # Navigate to Keywords Explorer landing page
        target_url = "https://arx.rankytools.com/keywords-explorer"
        print("Navigating to:", target_url)
        await call("Page.navigate", {"url": target_url})
        await asyncio.sleep(3)
        
        js_find_input = """
        (() => {
            const textareas = Array.from(document.querySelectorAll('textarea')).map(t => ({
                tag: 'textarea',
                placeholder: t.placeholder,
                className: t.className,
                id: t.id
            }));
            const inputs = Array.from(document.querySelectorAll('input')).map(i => ({
                tag: 'input',
                type: i.type,
                placeholder: i.placeholder,
                className: i.className,
                id: i.id
            }));
            return { textareas, inputs: inputs.filter(i => i.type !== 'hidden') };
        })()
        """
        eval_res = await call("Runtime.evaluate", {
            "expression": js_find_input,
            "returnByValue": True
        })
        print(json.dumps(eval_res.get('result', {}).get('result', {}).get('value', {}), indent=2))

if __name__ == '__main__':
    asyncio.run(check_search_page())
