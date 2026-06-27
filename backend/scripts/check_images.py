import re
import urllib.request
import json

with open("seed.js", "r", encoding="utf-8") as f:
    content = f.read()

urls = re.findall(r'image:\s*"(https://images\.unsplash\.com/photo-[^?]+)[^"]*"', content)

for url in urls:
    try:
        photo_id = url.split("photo-")[1]
        html_url = f"https://unsplash.com/photos/{photo_id}"
        req = urllib.request.Request(html_url, headers={'User-Agent': 'Mozilla/5.0'})
        html = urllib.request.urlopen(req).read().decode('utf-8')
        title_match = re.search(r'<title>(.*?)</title>', html)
        print(f"ID: {photo_id} | Title: {title_match.group(1).split('|')[0].strip() if title_match else 'N/A'}")
    except Exception as e:
        print(f"ID: {url.split('photo-')[1]} | Error: {e}")
