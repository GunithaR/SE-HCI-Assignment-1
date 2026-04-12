import re

with open('/Users/gunitha/.gemini/antigravity/brain/3ca3777b-4c86-4c33-ad56-a651bc0b9ff9/.system_generated/steps/548/output.txt', 'r') as f:
    text = f.read()

# Extract from 'const imgHomePageImage' to the end of Homepage
match = re.search(r'(const img[^\n]*.*)SUPER CRITICAL', text, re.DOTALL)
if match:
    code = 'import { Link } from "react-router-dom";\n' + match.group(1).strip()
    
    # Replace any internal Link/a tags or routing
    code = code.replace('export default function Homepage()', 'export default function Home()')
    
    with open('src/pages/Home.jsx', 'w') as out:
        out.write(code)
    print("Successfully created Home.jsx")
else:
    print("Could not find the React code in output.txt")
