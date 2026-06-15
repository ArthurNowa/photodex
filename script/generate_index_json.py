import json
from pathlib import Path

DATA_DIR = Path("data")
OUTPUT_FILE = DATA_DIR / "index.json"

def main():
    index = []

    for category_dir in sorted(DATA_DIR.iterdir()):
        if not category_dir.is_dir():
            continue

        json_files = []

        for file in sorted(category_dir.glob("*.json")):
            if file.name == "index.json":
                continue

            json_files.append({
                "name": file.name
            })

        if json_files:
            index.append({
                "type": category_dir.name,
                "data": json_files
            })

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(index, f, ensure_ascii=False, indent=2)

    print(f"Index généré : {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
