const fs = require('fs');
const path = require('path');

const seedDir = path.join(__dirname, 'apps', 'backend', 'prisma', 'seed-data');
const files = fs.readdirSync(seedDir).filter(f => f.endsWith('.ts'));

console.log(`Fixing ${files.length} seed files - removing backslash escapes...\n`);

files.forEach(file => {
  const filePath = path.join(seedDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  const originalLength = content.length;
  
  // Simply remove all backslashes before quotes
  // This is safe because TypeScript string literals don't need escapes for ' inside ' strings
  content = content.replace(/\\'/g, "'");
  content = content.replace(/\\"/g, '"');
  
  const fixed = originalLength !== content.length;
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`${fixed ? '✅ FIXED' : '⚠️  NO CHANGE'}: ${file}`);
});

console.log('\n✅ Seed files processed!');
