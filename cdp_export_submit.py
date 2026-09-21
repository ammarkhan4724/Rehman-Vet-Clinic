import asyncio
import json
import urllib.request
import websockets

async def click_export_radio_and_submit():
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
        
        js_interact = """
        (() => {
            const modal = document.querySelector('[role="dialog"], [class*="modal"]');
            if (!modal) return { error: 'No modal' };
            
            // Check all radio or clickable elements
            const radios = Array.from(modal.querySelectorAll('input[type="radio"], [role="radio"], label'));
            
            // Click "CSV (UTF-8)" or "CSV (UTF-16)"
            const utf8 = radios.find(r => r.innerText && r.innerText.includes('UTF-8')) || radios.find(r => r.innerText && r.innerText.includes('Excel'));
            if (utf8) utf8.click();
            
            // Click "First 1,000" or "All"
            const allOpt = radios.find(r => r.innerText && r.innerText.includes('First 1,000')) || radios.find(r => r.innerText && r.innerText.includes('All'));
            if (allOpt) allOpt.click();
            
            // Check Export button status
            const exportBtn = Array.from(modal.querySelectorAll('button')).find(b => b.innerText.trim() === 'Export');
            const disabled = exportBtn ? exportBtn.disabled || exportBtn.className.includes('Disabled') : true;
            
            if (exportBtn && !disabled) {
                exportBtn.click();
                return { submitted: true, disabled: false };
            }
            
            return {
                submitted: false,
                disabled,
                optionsFound: radios.map(r => r.innerText.trim()).filter(Boolean)
            };
        })()
        """
        eval_res = await call("Runtime.evaluate", {
            "expression": js_interact,
            "returnByValue": True
        })
        print(json.dumps(eval_res.get('result', {}).get('result', {}).get('value'), indent=2))
        
        await asyncio.sleep(2)
        
        # If not submitted yet, let's force click Export button
        js_force_submit = """
        (() => {
            const modal = document.querySelector('[role="dialog"], [class*="modal"]');
            const exportBtn = Array.from(modal.querySelectorAll('button')).find(b => b.innerText.trim() === 'Export');
            if (exportBtn) {
                exportBtn.disabled = false;
                exportBtn.click();
                return { forceClicked: true };
            }
            return { forceClicked: false };
        })()
        """
        eval_res2 = await call("Runtime.evaluate", {
            "expression": js_force_submit,
            "returnByValue": True
        })
        print(json.dumps(eval_res2.get('result', {}).get('result', {}).get('value'), indent=2))
        
        await asyncio.sleep(4)

if __name__ == '__main__':
    asyncio.run(click_export_radio_and_submit())
