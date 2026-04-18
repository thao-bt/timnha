import json
import os
import urllib.parse

with open('place.json', 'r', encoding='utf-8') as f:
    places = json.load(f)

print("=" * 80)
print("DEBUGGING IMAGE PATHS")
print("=" * 80)

# Check a few hotels
for p in places[:5]:
    name = p.get('name', '')
    folder = p.get('folder', '')
    image_1 = p.get('image_1', '')
    
    print(f"\n{name}")
    print(f"  Folder: {folder}")
    print(f"  Image: {image_1}")
    
    # Build URL
    url = f'image/Dữ Liệu Khách Sạn/{folder}/Ảnh/{image_1}'
    encoded_url = urllib.parse.quote(url, safe='/áữỤ')
    
    print(f"  URL: {url}")
    print(f"  Encoded: {encoded_url}")
    
    # Check if file exists
    file_path = url.replace('/', os.sep)
    exists = os.path.exists(file_path)
    print(f"  Exists: {exists}")
    
    if not exists:
        # Try to find the file
        folder_path = f'image{os.sep}Dữ Liệu Khách Sạn{os.sep}{folder}{os.sep}Ảnh'
        if os.path.exists(folder_path):
            files = os.listdir(folder_path)
            print(f"  Files in folder: {files[:3]}...")
        else:
            print(f"  ERROR: Folder path not found: {folder_path}")

print("\n" + "=" * 80)
print("CHECKING PERIDOT HOTEL")
print("=" * 80)

peridot = [p for p in places if 'Peridot' in p.get('name', '')]
if peridot:
    p = peridot[0]
    print(f"\nName: {p.get('name')}")
    print(f"Folder: {p.get('folder')}")
    print(f"image_1: {p.get('image_1')}")
    
    folder = p.get('folder', '')
    image_1 = p.get('image_1', '')
    
    url = f'image/Dữ Liệu Khách Sạn/{folder}/Ảnh/{image_1}'
    print(f"URL: {url}")
    
    # Check folder path
    folder_path = f'image\\Dữ Liệu Khách Sạn\\{folder}\\Ảnh'
    print(f"Looking for folder: {folder_path}")
    if os.path.exists(folder_path):
        print(f"✓ Folder exists")
        files = os.listdir(folder_path)
        print(f"Files in folder ({len(files)}): {files}")
        if image_1 in files:
            print(f"✓ Image file exists: {image_1}")
        else:
            print(f"✗ Image file NOT found: {image_1}")
    else:
        print(f"✗ Folder NOT found")
