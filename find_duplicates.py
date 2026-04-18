import json

with open('place.json', 'r', encoding='utf-8') as f:
    places = json.load(f)

# Find duplicates
hotel_names = {}
for p in places:
    name = p.get('name', '')
    if name not in hotel_names:
        hotel_names[name] = []
    hotel_names[name].append(p)

print("DUPLICATE HOTELS:")
print("=" * 80)

for name, entries in sorted(hotel_names.items()):
    if len(entries) > 1:
        print(f"\n{name} (appears {len(entries)} times)")
        for entry in entries:
            print(f"  ID {entry['id']}: {entry['destination']}")
            print(f"    image_1: {entry.get('image_1', 'N/A')}")
            print(f"    folder: {entry.get('folder', 'N/A')}")
