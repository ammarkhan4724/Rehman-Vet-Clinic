import asyncio
import json
import urllib.request
import websockets

async def inspect_editor():
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
            const editables = Array.from(document.querySelectorAll('[contenteditable], textarea, input')).map(el => ({
                tag: el.tagName,
                contenteditable: el.getAttribute('contenteditable'),
                className: el.className,
                placeholder: el.placeholder || el.getAttribute('data-placeholder'),
                text: el.innerText
            }));
            
            // Check around the Germany button
            const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.trim() === 'Germany');
            const parent = btn ? btn.closest('form, div[class*="container"], [class*="search"]') : null;
            
            return {
                editables,
                parentTag: parent ? parent.tagName : null,
                parentHTML: parent ? parent.outerHTML.slice(0, 1500) : null
            };
        })()
        """
        eval_res = await call("Runtime.evaluate", {
            "expression": js_code,
            "returnByValue": True
        })
        print(json.dumps(eval_res.get('result', {}).get('result', {}).get('value', {}), indent=2))

if __name__ == '__main__':
    asyncio.run(inspect_editor())
