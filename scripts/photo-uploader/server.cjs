/*
CommonJS version of the photo uploader server.
Use this when the repository `package.json` contains "type": "module".
Run with: `node server.cjs`
*/

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3001;
const ROOT = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, '..', 'src', 'content', 'photo');
const INDEX_HTML = path.join(__dirname, 'public', 'index.html');

function slugify(str){
  return str
    .toString()
    .normalize('NFKD')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
    .toLowerCase();
}

function makeFrontmatter({title, description, pubDate, heroImage}){
  // normalize pubDate into `Mon DD YYYY` (e.g. Dec 03 2025)
  function parseInputDate(input){
    if(!input) return null;
    // Accept formats: YYYY.MM.DD, YYYY-MM-DD, YYYY/MM/DD, YYYYMMDD
    const isoLike = input.trim().replace(/\./g, '-').replace(/\//g, '-');
    // If already like 'Dec 03 2025' try Date parse
    const tryDate = new Date(isoLike);
    if(!isNaN(tryDate.getTime())) return tryDate;
    // Try manual parse for YYYY-MM-DD or YYYYMMDD
    const m = isoLike.match(/^(\d{4})-?(\d{2})-?(\d{2})$/);
    if(m){
      const [_, y, mo, d] = m; return new Date(`${y}-${mo}-${d}`);
    }
    return tryDate; // may be invalid
  }

  function formatFrontmatterDate(input){
    const d = parseInputDate(input);
    if(!d || isNaN(d.getTime())) return input || '';
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const dd = String(d.getDate()).padStart(2,'0');
    return `${months[d.getMonth()]} ${dd} ${d.getFullYear()}`;
  }

  const normalizedPub = formatFrontmatterDate(pubDate);
  return ['---',
    `title: '${title.replace(/'/g, "\\'")}'`,
    `description: '${(description||'').replace(/'/g, "\\'")}'`,
    `pubDate: '${normalizedPub}'`,
    `heroImage: '${heroImage}'`,
    '---\n'].join('\n');
}

function formatMonthYear(pubDate){
  try{
    const d = new Date(pubDate);
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    return `${months[d.getMonth()]} ${d.getFullYear()}`;
  }catch(e){ return pubDate; }
}

function makeBody(images, pubDate, title){
  const monthYear = formatMonthYear(pubDate);
  // try to derive a short location from title (fallback: title)
  const location = title || '';

  let html = '<div style="max-width: 800px; margin: 0 auto; padding: 60px 20px; font-family: sans-serif;">\n';
  html += `  <div style="text-align:center; margin-bottom:100px;">\n`;
  html += `    <h2 style="display:inline-flex; align-items:center; gap:14px; background:#0f1724; color:#ffffff; padding:10px 18px; border-radius:6px; font-family: 'Atkinson', sans-serif; font-size:14px; text-transform:uppercase; letter-spacing:2px; font-weight:700; margin:0;">\n`;
  html += `      <span style="opacity:0.9;">${monthYear}</span>\n`;
  html += `      <span style="display:inline-block; font-size:12px; transform:translateY(0); opacity:0.95;">▸</span>\n`;
  html += `      <span style="opacity:0.9;">${location}</span>\n`;
  html += '    </h2>\n';
  html += '  </div>\n\n';

  html += '  <div style="position: relative; overflow: hidden;">\n';

  // exact repeating pattern to better match your example
  const pattern = [
    {w:85, ml:null, mr:null, z:7, delay:0},
    {w:80, ml:'12%', mr:null, z:6, delay:0.1},
    {w:83, ml:null, mr:'8%', z:5, delay:0.2},
    {w:78, ml:'15%', mr:null, z:4, delay:0.3},
    {w:81, ml:null, mr:'10%', z:3, delay:0.4},
    {w:84, ml:'7%', mr:null, z:2, delay:0.5},
    {w:82, ml:null, mr:'13%', z:1, delay:0.6}
  ];

  for(let i=0;i<images.length;i++){
    const img = images[i];
    const p = pattern[i % pattern.length];
    const w = p.w;
    const ml = p.ml ? `margin-left: ${p.ml};` : (i%2===0 ? '' : 'margin: -3px auto 0;');
    const mr = p.mr ? `margin-right: ${p.mr};` : '';
    const z = Math.max(1, 7 - i);
    const delay = (i*0.1).toFixed(1);
    html += `    <div style="position: relative; width: ${w}%; ${ml} ${mr} border-radius: 8px; box-shadow: 0 6px 16px rgba(0,0,0,0.12); overflow: hidden; cursor: pointer; z-index: ${z}; transition: all 0.6s ease-out ${delay}s;">\n`;
    html += `      <img\n        src="${img}"\n        style="width: 100%; height: auto; display: block;"\n        loading="lazy"\n      />\n`;
    html += '    </div>\n\n';
  }

  html += '  </div>\n\n  <div style="height: 100px;"></div>\n\n';
  html += '</div>\n';
  return html;
}

function mdxTemplate(data){
  const front = makeFrontmatter(data);
  const body = makeBody(data.images || [], data.pubDate || '', data.title || '');
  const extras = `\n  <style>{` + "`" + `\n
    /* 1. 30px大浮动幅度，滚动时视觉明显 */\n    @keyframes scrollFloatDown {\n      0% { transform: translateY(0); }\n      100% { transform: translateY(30px); }\n    }\n    @keyframes scrollFloatUp {\n      0% { transform: translateY(30px); }\n      100% { transform: translateY(0); }\n    }\n\n    /* 2. 滚动方向触发动画，静止时暂停 */\n    body.scrolling-down [style*="z-index: 7"],\n    body.scrolling-down [style*="z-index: 6"],\n    body.scrolling-down [style*="z-index: 5"],\n    body.scrolling-down [style*="z-index: 4"],\n    body.scrolling-down [style*="z-index: 3"],\n    body.scrolling-down [style*="z-index: 2"],\n    body.scrolling-down [style*="z-index: 1"] {\n      animation: scrollFloatDown 0.6s ease-out forwards;\n    }\n    body.scrolling-up [style*="z-index: 7"],\n    body.scrolling-up [style*="z-index: 6"],\n    body.scrolling-up [style*="z-index: 5"],\n    body.scrolling-up [style*="z-index: 4"],\n    body.scrolling-up [style*="z-index: 3"],\n    body.scrolling-up [style*="z-index: 2"],\n    body.scrolling-up [style*="z-index: 1"] {\n      animation: scrollFloatUp 0.6s ease-out forwards;\n    }\n    [style*="z-index: 7"],\n    [style*="z-index: 6"],\n    [style*="z-index: 5"],\n    [style*="z-index: 4"],\n    [style*="z-index: 3"],\n    [style*="z-index: 2"],\n    [style*="z-index: 1"] {\n      animation-play-state: paused;\n    }\n\n    /* 3. 鼠标悬浮放大+加深阴影，增强交互 */\n    [style*="z-index: 7"]:hover,\n    [style*="z-index: 6"]:hover,\n    [style*="z-index: 5"]:hover,\n    [style*="z-index: 4"]:hover,\n    [style*="z-index: 3"]:hover,\n    [style*="z-index: 2"]:hover,\n    [style*="z-index: 1"]:hover {\n      transform: scale(1.03) !important;\n      box-shadow: 0 15px 30px rgba(0,0,0,0.2) !important;\n      z-index: 20 !important; /* 悬浮时置顶，避免被其他图遮挡 */\n    }\n\n    /* 4. 全域隐藏滚动条，兼容所有浏览器 */\n    ::-webkit-scrollbar {\n      display: none !important;\n      width: 0 !important;\n      height: 0 !important;\n    }\n    body, html {\n      scrollbar-width: none !important;\n      -ms-overflow-style: none !important;\n      overflow: -moz-scrollbars-none !important;\n    }\n    div[style*="overflow: hidden"] {\n      scrollbar-width: none !important;\n      -ms-overflow-style: none !important;\n    }\n    div[style*="overflow: hidden"]::-webkit-scrollbar {\n      display: none !important;\n    }\n  ` + "`" + `}</style>\n\n  <script>{` + "`" + `\n    let lastScrollY = window.scrollY;\n    window.addEventListener('scroll', () => {\n      const currentScrollY = window.scrollY;\n      document.body.classList.toggle('scrolling-down', currentScrollY > lastScrollY);\n      document.body.classList.toggle('scrolling-up', currentScrollY < lastScrollY);\n      lastScrollY = currentScrollY;\n    });\n  ` + "`" + `}</script>\n`;

  return front + '\n\n' + body + extras;
}

function ensureDir(dir){
  if(!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

ensureDir(CONTENT_DIR);

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  if(req.method === 'GET'){
    if(parsed.pathname === '/' || parsed.pathname === '/index.html'){
      fs.readFile(INDEX_HTML, 'utf8', (err, data)=>{
        if(err){ res.writeHead(500); res.end('index not found'); return; }
        res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
        res.end(data);
      });
      return;
    }
    if(parsed.pathname.startsWith('/public/')){
      const p = path.join(__dirname, parsed.pathname.replace('/public/', ''));
      fs.readFile(p, (err, data)=>{
        if(err){ res.writeHead(404); res.end('not found'); return; }
        res.writeHead(200);
        res.end(data);
      });
      return;
    }
    res.writeHead(404); res.end('Not Found');
    return;
  }

  if(req.method === 'POST' && parsed.pathname === '/create'){
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', ()=>{
      try{
        const payload = JSON.parse(body);
        const title = payload.title || 'untitled';
        const description = payload.description || '';
        const pubDate = payload.pubDate || new Date().toISOString().split('T')[0];
        const heroImage = payload.heroImage || (payload.images && payload.images[0]) || '';
        const images = payload.images || [];

        const mdx = mdxTemplate({ title, description, pubDate, heroImage, images });

        let filename = slugify(title || 'post');
        if(!filename) filename = 'post';
        let filepath = path.join(CONTENT_DIR, filename + '.mdx');
        let i = 1;
        while(fs.existsSync(filepath)){
          filepath = path.join(CONTENT_DIR, `${filename}-${i}.mdx`);
          i++;
        }
        fs.writeFileSync(filepath, mdx, 'utf8');
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end(JSON.stringify({ ok: true, path: filepath }));
      }catch(e){
        console.error(e);
        res.writeHead(400);
        res.end(JSON.stringify({ ok:false, error: e.message }));
      }
    });
    return;
  }

  res.writeHead(405); res.end('Method not allowed');
});

server.listen(PORT, ()=>{
  console.log(`Photo uploader running at http://localhost:${PORT}/`);
  console.log(`MDX files will be written to ${CONTENT_DIR}`);
});
