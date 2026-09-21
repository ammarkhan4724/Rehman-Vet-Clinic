import asyncio
import json
import urllib.request
import websockets

async def execute_search():
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
        
        js_fill = """
        (() => {
            // 1. Find the keywords textarea
            const textarea = document.querySelector('textarea[placeholder*="Enter keywords"]');
            if (!textarea) return { error: 'Textarea not found' };
            
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
            
            // React state setter
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
            nativeInputValueSetter.call(textarea, keywords);
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            textarea.dispatchEvent(new Event('change', { bubbles: true }));
            
            // 2. Click country button
            const countryBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.trim() === 'Germany' || b.innerText.trim() === 'Pakistan');
            const countryName = countryBtn ? countryBtn.innerText.trim() : null;
            if (countryBtn && countryName !== 'Pakistan') {
                countryBtn.click();
            }
            
            return {
                keywordsSet: true,
                currentCountry: countryName,
                textareaValLen: textarea.value.length
            };
        })()
        """
        
        eval_res = await call("Runtime.evaluate", {
            "expression": js_fill,
            "returnByValue": True
        })
        val = eval_res.get('result', {}).get('result', {}).get('value', {})
        print("Fill result:", json.dumps(val, indent=2))
        
        # If country dropdown opened, select Pakistan
        await asyncio.sleep(1)
        js_select_pakistan = """
        (() => {
            // Find input inside modal/dropdown or find element with text Pakistan
            const searchInput = Array.from(document.querySelectorAll('input')).find(i => i.placeholder && i.placeholder.toLowerCase().includes('search'));
            if (searchInput) {
                const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                nativeSetter.call(searchInput, 'Pakistan');
                searchInput.dispatchEvent(new Event('input', { bubbles: true }));
                searchInput.dispatchEvent(new Event('change', { bubbles: true }));
            }
            
            // find Pakistan option
            const allElements = Array.from(document.querySelectorAll('*'));
            const pakEl = allElements.find(el => el.children.length === 0 && el.innerText && el.innerText.trim() === 'Pakistan');
            if (pakEl) {
                pakEl.click();
                return { clickedPakistan: true };
            }
            return { clickedPakistan: false };
        })()
        """
        eval_res2 = await call("Runtime.evaluate", {
            "expression": js_select_pakistan,
            "returnByValue": True
        })
        print("Pakistan select result:", json.dumps(eval_res2.get('result', {}).get('result', {}).get('value', {}), indent=2))

if __name__ == '__main__':
    asyncio.run(execute_search())
