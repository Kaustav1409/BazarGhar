const fs = require('fs');
const https = require('https');

const content = fs.readFileSync('seed.js', 'utf8');
const urls = [...content.matchAll(/image:\s*"(https:\/\/images\.unsplash\.com\/photo-[^?]+)[^"]*"/g)].map(m => m[1]);

async function checkUrl(url) {
    const photo_id = url.split("photo-")[1];
    const html_url = `https://unsplash.com/photos/${photo_id}`;
    
    return new Promise((resolve) => {
        https.get(html_url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const match = data.match(/<title>(.*?)<\/title>/);
                const title = match ? match[1].split('|')[0].trim() : 'N/A';
                console.log(`ID: ${photo_id} | Title: ${title}`);
                resolve();
            });
        }).on('error', (err) => {
            console.log(`ID: ${photo_id} | Error: ${err.message}`);
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
