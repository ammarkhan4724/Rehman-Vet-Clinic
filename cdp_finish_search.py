import asyncio
import json
import urllib.request
import websockets

async def finish_search():
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
        
        # 1. Click Pakistan button
        js_click_pak = """
        (() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const pakBtn = buttons.find(b => b.innerText.trim() === 'Pakistan');
            if (pakBtn) {
                pakBtn.click();
                return { clickedPakistan: true };
            }
            return { clickedPakistan: false };
        })()
        """
        eval_pak = await call("Runtime.evaluate", {
            "expression": js_click_pak,
            "returnByValue": True
        })
        print("Pakistan click:", json.dumps(eval_pak.get('result', {}).get('result', {}).get('value', {}), indent=2))
        await asyncio.sleep(1)
        
        # 2. Re-verify keywords in textarea
        js_ensure_keywords = """
        (() => {
            const textarea = document.querySelector('textarea[placeholder*="Enter keywords"]');
            if (textarea && textarea.value.trim().length === 0) {
                const keywords = [
                    'animal doctor lahore',
                    'veterinary doctor lahore',
                    'vet in lahore',
                    'pets clinic lahore',
                    'animal hospital lahore',
                    'cat doctor lahore',
                    'dog doctor lahore',
                    'pet doctor lahore',
                    'veterinary clinic lahore',
                    'dog vaccination lahore',
                    'cat neutering lahore',
                    'emergency vet lahore',
                    'home visit vet lahore',
                    'animal doctor',
                    'veterinary doctor'
                ].join('\\n');
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
                nativeInputValueSetter.call(textarea, keywords);
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                textarea.dispatchEvent(new Event('change', { bubbles: true }));
            }
            return {
                textareaValLen: textarea ? textarea.value.length : 0
            };
        })()
        """
        eval_kw = await call("Runtime.evaluate", {
            "expression": js_ensure_keywords,
            "returnByValue": True
        })
        print("Keywords verified:", json.dumps(eval_kw.get('result', {}).get('result', {}).get('value', {}), indent=2))
        await asyncio.sleep(0.5)
        
        # 3. Click Search button
        js_click_search = """
        (() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const searchBtn = buttons.find(b => b.innerText.trim() === 'Search');
            if (searchBtn) {
                const rect = searchBtn.getBoundingClientRect();
                ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach(evtType => {
                    searchBtn.dispatchEvent(new MouseEvent(evtType, {
                        bubbles: true,
                        cancelable: true,
                        view: window,
                        clientX: rect.x + rect.width / 2,
                        clientY: rect.y + rect.height / 2
                    }));
                });
                return { clickedSearch: true };
            }
            return { clickedSearch: false };
        })()
        """
        eval_search = await call("Runtime.evaluate", {
            "expression": js_click_search,
            "returnByValue": True
        })
        print("Search click:", json.dumps(eval_search.get('result', {}).get('result', {}).get('value', {}), indent=2))
        
        # Wait 6 seconds for navigation and results load
        await asyncio.sleep(6)
        
        # Check current URL and page status
        eval_status = await call("Runtime.evaluate", {
            "expression": "({url: window.location.href, text: document.body.innerText.slice(0, 1500)})",
            "returnByValue": True
        })
        print("After search status:", json.dumps(eval_status.get('result', {}).get('result', {}).get('value', {}), indent=2))

if __name__ == '__main__':
    asyncio.run(finish_search())
