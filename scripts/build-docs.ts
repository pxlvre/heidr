#!/usr/bin/env bun
import { execSync } from 'child_process';
import { writeFileSync, mkdirSync, readFileSync, cpSync } from 'fs';

console.log('📚 Building documentation...');

console.log('  → Generating CLI commands...');
execSync('bun run scripts/generate-cli-docs.ts', { stdio: 'inherit' });

const commandsMd = readFileSync('docs-cli/COMMANDS.md', 'utf-8');
const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>heidr - EVM Blockchain CLI Documentation</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        :root {
            --bg-color: #ffffff;
            --text-color: #24292e;
            --text-secondary: #586069;
            --border-color: #eaecef;
            --code-bg: #f6f8fa;
            --link-color: #0366d6;
            --header-border: #0366d6;
        }
        
        @media (prefers-color-scheme: dark) {
            :root {
                --bg-color: #0d1117;
                --text-color: #c9d1d9;
                --text-secondary: #8b949e;
                --border-color: #30363d;
                --code-bg: #161b22;
                --link-color: #58a6ff;
                --header-border: #58a6ff;
            }
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: var(--text-color);
            max-width: 1000px;
            margin: 0 auto;
            padding: 2rem;
            background: var(--bg-color);
        }
        
        .logo-light { display: block; }
        .logo-dark { display: none; }
        
        @media (prefers-color-scheme: dark) {
            .logo-light { display: none; }
            .logo-dark { display: block; }
        }
        
        h1 { color: var(--link-color); margin: 2rem 0 1rem; font-size: 2.5rem; }
        h2 { color: var(--link-color); margin: 2rem 0 1rem; padding-bottom: 0.3rem; border-bottom: 2px solid var(--border-color); }
        h3 { color: var(--text-color); margin: 1.5rem 0 1rem; }
        code {
            background: var(--code-bg);
            padding: 0.2em 0.4em;
            border-radius: 3px;
            font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
            font-size: 85%;
            color: var(--text-color);
        }
        pre {
            background: var(--code-bg);
            padding: 16px;
            border-radius: 6px;
            overflow: auto;
            margin: 1rem 0;
        }
        pre code { background: none; padding: 0; }
        ul { margin: 1rem 0; padding-left: 2rem; }
        li { margin: 0.5rem 0; }
        hr { border: 0; border-top: 1px solid var(--border-color); margin: 2rem 0; }
        .header {
            text-align: center;
            padding: 2rem 0;
            border-bottom: 2px solid var(--header-border);
            margin-bottom: 2rem;
        }
        .header img { 
            width: 120px; 
            height: auto; 
            margin: 0 auto 1rem;
            display: block;
        }
        .header h1 { margin: 0; }
        .header p { color: var(--text-secondary); margin-top: 0.5rem; }
        .nav {
            background: var(--code-bg);
            padding: 1rem;
            border-radius: 6px;
            margin: 2rem 0;
            text-align: center;
        }
        .nav a {
            color: var(--link-color);
            text-decoration: none;
            margin: 0 1rem;
            font-weight: 600;
        }
        .nav a:hover { text-decoration: underline; }
        strong { color: var(--text-color); }
        a { color: var(--link-color); }
    </style>
</head>
<body>
    <div class="header">
        <h1>heidr</h1>
        <p>EVM Blockchain CLI Tool - Command Reference</p>
    </div>
    
    <div class="nav">
        <a href="https://github.com/pxlvre/heidr">GitHub</a>
        <a href="https://hub.docker.com/r/pxlvre/heidr">Docker Hub</a>
        <a href="https://www.npmjs.com/package/heidr">npm</a>
        <a href="https://aur.archlinux.org/packages/heidr">AUR</a>
        <a href="./typedocs/index.html">TypeDocs →</a>
    </div>

${commandsMd
  .replace(/```bash/g, '<pre><code class="language-bash">')
  .replace(/```/g, '</code></pre>')
  .split('\n')
  .map((line) => {
    if (line.startsWith('# ')) return `<h1>${line.slice(2)}</h1>`;
    if (line.startsWith('## ')) return `<h2>${line.slice(3)}</h2>`;
    if (line.startsWith('### ')) return `<h3>${line.slice(4)}</h3>`;
    if (line.startsWith('- ')) return `<li>${line.slice(2)}</li>`;
    if (line === '---') return '<hr>';
    if (line.includes('**') && line.includes(':**')) {
      return line.replace(/\*\*(.*?):\*\*/g, '<strong>$1:</strong>');
    }
    if (line.trim() === '') return '<br>';
    return `<p>${line}</p>`;
  })
  .join('\n')}

    <hr>
    <p style="text-align: center; color: var(--text-secondary); margin-top: 3rem;">
        Made with ⚡️ by <a href="https://github.com/pxlvre" style="color: var(--link-color);">pxlvre</a>
    </p>
</body>
</html>`;

mkdirSync('docs', { recursive: true });
writeFileSync('docs/index.html', html);
writeFileSync('docs/.nojekyll', '');

console.log('  → Generating API reference...');
execSync('bunx typedoc', { stdio: 'inherit' });

console.log('  → Copying assets...');
try {
  cpSync('public', 'docs/public', { recursive: true });
} catch {
  // Ignore if public directory doesn't exist
}

console.log('✅ Documentation built successfully!');
console.log('   📄 Main: docs/index.html');
console.log('   📚 TypeDocs: docs/typedocs/index.html');
