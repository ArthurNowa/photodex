import json
from pathlib import Path

DATA_DIR = Path("../data")
IMAGES_DIR = Path("../images")
INDEX_FILE = DATA_DIR / "index.json"
LATEST_FILE = DATA_DIR / "latest-photo.json"

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}


def extract_date(file_name):
    raw_date = file_name[:8]
    return f"{raw_date[:4]}-{raw_date[4:6]}-{raw_date[6:8]}"


def extract_animal_id(file_name):
    stem = Path(file_name).stem
    parts = stem.split("_", 1)
    if len(parts) < 2:
        return None
    animal_words = parts[1].split("-")
    if animal_words[-1].isdigit():
        animal_words = animal_words[:-1]
    return "-".join(animal_words)
    

def extract_animal_name(animal_id, category):
    path = Path(DATA_DIR / category / animal_id)
    


def find_last_photo():
    latest_photo = None
    
    for photo in IMAGES_DIR.rglob("*"):
        # ignore folders
        if not photo.is_file():
            continue

        # ignore files that aren't images
        if photo.suffix.lower() not in IMAGE_EXTENSIONS:
            continue

        file_name = photo.name

        # ignore photos without date format title
        if len(file_name) < 9 or not file_name[:8].isdigit():
            continue

        if latest_photo is None or file_name > latest_photo["fileName"]:
            animal_id = extract_animal_id(file_name)
            category = photo.parent.name
            #animal_name = extract_animal_name(animal_id, category)
            animal_name = animal_id
            
            
            latest_photo = {
                "animalId": animal_id,
                "category": category,
                "photo": photo.as_posix(),
                "fileName": file_name,
                "date": extract_date(file_name),
                "jsonfile": "data/" + category + "/" + animal_id + ".json"
            }

    if latest_photo is None:
        latest_photo = {}

    LATEST_FILE.parent.mkdir(parents=True, exist_ok=True)

    with open(LATEST_FILE, "w", encoding="utf-8") as f:
        json.dump(latest_photo, f, ensure_ascii=False, indent=2)

    print(f"Dernière photo générée : {LATEST_FILE}")


def generate_json_list():
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

    with open(INDEX_FILE, "w", encoding="utf-8") as f:
        json.dump(index, f, ensure_ascii=False, indent=2)

    print(f"Index généré : {INDEX_FILE}")




if __name__ == "__main__":
    generate_json_list()
    find_last_photo()
