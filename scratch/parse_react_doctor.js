const fs = require('fs');
const path = require('path');

const reportPath = path.join(__dirname, '..', 'react-doctor-report.json');
if (!fs.existsSync(reportPath)) {
  console.error("Report file does not exist at:", reportPath);
  process.exit(1);
}

const buf = fs.readFileSync(reportPath);
let content;
if (buf[0] === 0xff && buf[1] === 0xfe) {
  content = buf.toString('utf16le');
} else {
  content = buf.toString('utf8');
}

if (content.charCodeAt(0) === 0xfeff) {
  content = content.slice(1);
}

const data = JSON.parse(content);
const diagnostics = data.diagnostics || [];

const rulesToTrace = [
  "js-tosorted-immutable",
  "nextjs-no-a-element"
];

rulesToTrace.forEach(ruleName => {
  const matches = diagnostics.filter(d => d.rule === ruleName);
  console.log(`\n=== Matches for ${ruleName} (${matches.length}) ===`);
  matches.forEach((d, idx) => {
    console.log(`${idx + 1}. ${d.filePath}:${d.line}:${d.column}`);
    console.log(`   Message: ${d.message}`);
  });
});
