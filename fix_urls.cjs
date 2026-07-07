const fs = require('fs');
const path = require('path');

const files = [
  'src/components/sections/ProjectsSection.tsx',
  'src/components/admin/AdminProjects.tsx',
  'src/components/sections/ContactSection.tsx',
  'src/components/admin/AdminCV.tsx',
  'src/components/admin/AdminProfile.tsx',
  'src/components/admin/AdminMessages.tsx'
];

files.forEach(f => {
  const p = path.join(__dirname, f);
  if (!fs.existsSync(p)) return;
  let content = fs.readFileSync(p, 'utf8');
  
  // Replace the broken fetch calls that start with `${import... with `\ў${import...
  // using a regular expression that matches fetch(${import
  content = content.replace(/fetch\(\$\{import\.meta\.env\.VITE_API_URL/g, 'fetch(`\${import.meta.env.VITE_API_URL');
  
  // Fix the trailing single quotes that should be backticks
  content = content.replace(/\/api\/projects', \{/g, '/api/projects\`, {');
  content = content.replace(/\/api\/upload', \{/g, '/api/upload\`, {');
  content = content.replace(/\/api\/cv', \{/g, '/api/cv\`, {');
  content = content.replace(/\/api\/profiles', \{/g, '/api/profiles\`, {');
  content = content.replace(/\/api\/messages', \{/g, '/api/messages\`, {');
  
  fs.writeFileSync(p, content);
  console.log('Fixed', f);
});
