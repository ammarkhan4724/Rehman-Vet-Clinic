import asyncio
import json
import urllib.request
import websockets

async def check_modal():
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
        
        js_inspect_popup = """
        (() => {
            const popups = Array.from(document.querySelectorAll('[role="dialog"], [role="listbox"], [role="menu"], [class*="portal"], [class*="dropdown"], [class*="menu"], [class*="popover"]')).map(el => ({
                tag: el.tagName,
                role: el.getAttribute('role'),
                className: el.className,
                text: el.innerText.slice(0, 300)
            }));
            
            const inputs = Array.from(document.querySelectorAll('input')).map(i => ({
                placeholder: i.placeholder,
                type: i.type,
                value: i.value,
                className: i.className
            }));
            
            return { popups, inputs };
        })()
        """
        eval_res = await call("Runtime.evaluate", {
            "expression": js_inspect_popup,
            "returnByValue": True
        })
        print(json.dumps(eval_res.get('result', {}).get('result', {}).get('value', {}), indent=2))

if __name__ == '__main__':
    asyncio.run(check_modal())
