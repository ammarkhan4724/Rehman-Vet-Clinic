import asyncio
import json
import urllib.request
import websockets

async def find_elements():
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
        
        js_find = """
        (() => {
            const allElements = Array.from(document.querySelectorAll('*'));
            const inputs = Array.from(document.querySelectorAll('input, textarea, [contenteditable="true"]')).map(el => ({
                tag: el.tagName,
                type: el.type,
                placeholder: el.placeholder,
                className: el.className,
                id: el.id
            }));
            
            const buttons = Array.from(document.querySelectorAll('button, a')).map(el => ({
                tag: el.tagName,
                text: el.innerText.trim(),
                className: el.className,
                id: el.id
            })).filter(b => b.text.length > 0 && b.text.length < 40);
            
            return { inputs, buttons: buttons.slice(0, 30) };
        })()
        """
        eval_res = await call("Runtime.evaluate", {
            "expression": js_find,
            "returnByValue": True
        })
        print(json.dumps(eval_res.get('result', {}).get('result', {}).get('value', {}), indent=2))

if __name__ == '__main__':
    asyncio.run(find_elements())
