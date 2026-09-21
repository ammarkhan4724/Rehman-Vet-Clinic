import asyncio
import json
import urllib.request
import websockets

async def trigger_export():
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
        await call("Browser.setDownloadBehavior", {
            "behavior": "allow",
            "downloadPath": "d:\\Rehman Vet Clinic"
        })
        
        # Click Export button
        js_click_export = """
        (() => {
            const buttons = Array.from(document.querySelectorAll('button, a'));
            const exportBtn = buttons.find(b => b.innerText.trim() === 'Export');
            if (exportBtn) {
                exportBtn.click();
                return { clickedExport: true };
            }
            return { clickedExport: false };
        })()
        """
        eval_exp = await call("Runtime.evaluate", {
            "expression": js_click_export,
            "returnByValue": True
        })
        print("Export button clicked:", eval_exp.get('result', {}).get('result', {}).get('value'))
        
        await asyncio.sleep(1.5)
        
        # In modal, find Start export button
        js_confirm_export = """
        (() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const startBtn = buttons.find(b => b.innerText.trim().toLowerCase().includes('export') && b.innerText.trim() !== 'Export');
            if (startBtn) {
                startBtn.click();
                return { clickedConfirm: true, text: startBtn.innerText.trim() };
            }
            // If just "Export" inside modal
            const modalBtns = buttons.filter(b => b.closest('[role="dialog"], [class*="modal"]'));
            const confirmBtn = modalBtns.find(b => b.innerText.trim().toLowerCase().includes('export'));
            if (confirmBtn) {
                confirmBtn.click();
                return { clickedConfirm: true, text: confirmBtn.innerText.trim() };
            }
            return { modalButtons: modalBtns.map(b => b.innerText.trim()) };
        })()
        """
        eval_conf = await call("Runtime.evaluate", {
            "expression": js_confirm_export,
            "returnByValue": True
        })
        print("Confirm modal:", eval_conf.get('result', {}).get('result', {}).get('value'))
        
        await asyncio.sleep(3)

if __name__ == '__main__':
    asyncio.run(trigger_export())
