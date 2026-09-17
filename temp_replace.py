import os

files = [
    'src/App.tsx', 
    'src/components/WhatsAppFloatingButton.tsx', 
    'generate_all_pages.py', 
    'build_seo_pages.py', 
    'build_full_pages.py', 
    'index.html', 
    'blog/parvovirus-treatment-cost-survival-pakistan.html'
]

for f in files:
    if os.path.exists(f):
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
        
        # Replace Full name first, then short name
        content = content.replace('Dr. Rehman Ahmed', 'Dr. Saif Ur Rehman')
        content = content.replace('Dr. Rehman', 'Dr. Saif')
        
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
            
print("Replacement completed.")
