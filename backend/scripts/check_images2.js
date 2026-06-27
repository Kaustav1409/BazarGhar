const fs = require('fs');
const https = require('https');

const content = fs.readFileSync('seed.js', 'utf8');
const urls = [...content.matchAll(/image:\s*"(https:\/\/images\.unsplash\.com\/photo-[^?]+)[^"]*"/g)].map(m => m[1]);

async function checkUrl(url) {
    const photo_id = url.split("photo-")[1];
    const html_url = `https://unsplash.com/photos/${photo_id}`;
    
    return new Promise((resolve) => {
        https.get(html_url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const titleMatch = data.match(/<title>(.*?)<\/title>/);
                const descMatch = data.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i) || data.match(/<meta\s+property="og:description"\s+content="([^"]+)"/i) || data.match(/<img[^>]+alt="([^"]+)"/i);
                const desc = descMatch ? descMatch[1] : 'N/A';
                console.log(`URL: ${url}`);
                console.log(`Desc: ${desc}`);
                console.log('---');
                resolve();
            });
        }).on('error', (err) => {
            console.log(`Error: ${err.message}`);
            resolve();
        });
    });
}

async function run() {
    for (const url of urls) {
        await checkUrl(url);
    }
}

run();
