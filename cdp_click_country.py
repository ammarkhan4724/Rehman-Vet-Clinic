import asyncio
import json
import urllib.request
import websockets

async def click_country():
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
        
        js_click = """
        (() => {
            const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.trim() === 'Germany');
            if (!btn) return { error: 'Germany button not found', buttons: Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim()) };
            
            const rect = btn.getBoundingClientRect();
            
            // Dispatch full mouse sequence
            ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach(evtType => {
                btn.dispatchEvent(new MouseEvent(evtType, {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    clientX: rect.x + rect.width / 2,
                    clientY: rect.y + rect.height / 2
                }));
            });
            
            return { rect, clicked: true };
        })()
        """
        eval_res = await call("Runtime.evaluate", {
            "expression": js_click,
            "returnByValue": True
        })
        print("Click result:", json.dumps(eval_res.get('result', {}).get('result', {}).get('value', {}), indent=2))
        
        await asyncio.sleep(1)
        
        # Check DOM again for new elements
        js_check = """
        (() => {
            const elements = Array.from(document.querySelectorAll('*'));
            const textMatches = elements.filter(e => e.innerText && (e.innerText.includes('Pakistan') || e.innerText.includes('United States'))).map(e => ({
                tag: e.tagName,
                text: e.innerText.slice(0, 100),
                className: e.className
            }));
            return { textMatches: textMatches.slice(0, 10) };
        })()
        """
        eval_res2 = await call("Runtime.evaluate", {
            "expression": js_check,
            "returnByValue": True
        })
        print("Check result:", json.dumps(eval_res2.get('result', {}).get('result', {}).get('value', {}), indent=2))

if __name__ == '__main__':
    asyncio.run(click_country())
