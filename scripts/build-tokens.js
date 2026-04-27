const fs = require('fs');
const path = require('path');

const tokensPath = path.join(__dirname, '../design-tokens.json');
const outputPath = path.join(__dirname, '../app/styles/generated-tokens.css');

const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf-8'));

let rootVars = '';
let themeVars = '';

// Helper to write color vars
function processColors(obj, prefix = '') {
  for (const [key, value] of Object.entries(obj)) {
    const varName = prefix ? `${prefix}-${key}` : key;
    if (typeof value === 'object') {
      processColors(value, varName);
    } else {
      const finalName = varName.replace('-DEFAULT', '');
      rootVars += `  --${finalName}: ${value};\n`;
      // Use the actual value in the @theme block to avoid resolution issues for utility classes
      themeVars += `  --color-${finalName}: ${value};\n`;
    }
  }
}

processColors(tokens.colors);

// Fonts
for (const [key, value] of Object.entries(tokens.fonts)) {
  rootVars += `  --font-${key}: ${value};\n`;
  themeVars += `  --font-${key}: ${value};\n`;
}

// Radii
for (const [key, value] of Object.entries(tokens.radii)) {
  const finalName = key === 'DEFAULT' ? '--radius' : `--radius-${key}`;
  rootVars += `  ${finalName}: ${value};\n`;
  themeVars += `  ${finalName}: ${value};\n`;
}

// Shadows
for (const [key, value] of Object.entries(tokens.shadows)) {
  themeVars += `  --shadow-${key}: ${value};\n`;
}

const cssContent = `/* 
  THIS FILE IS AUTO-GENERATED. DO NOT EDIT MANUALLY.
  Source of truth: design-tokens.json 
*/

@theme {
${themeVars}}

:root {
${rootVars}}
`;

fs.writeFileSync(outputPath, cssContent, 'utf-8');
console.log('✅ Tokens successfully compiled to generated-tokens.css');
