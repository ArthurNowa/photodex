import json
import os
from pathlib import Path
import posixpath

DATA_DIR = Path("../data")
IMAGES_DIR = Path("../images")
INDEX_FILE = DATA_DIR / "index.json"
LATEST_FILE = DATA_DIR / "latest-photo.json"

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}

DATA_LIST = dict()

MISSING_DATA = set()
DATA_TO_COMPLETE = set()


def extract_date(file_name):
    raw_date = file_name[:8]
    return f"{raw_date[:4]}-{raw_date[4:6]}-{raw_date[6:8]}"


def extract_animal_id_from_photo_filename(file_name):
    stem = Path(file_name).stem
    parts = stem.split("_")
    if len(parts) < 2:
        return None
        
    animal_words = parts[1].split("-")
    if animal_words[-1].isdigit():
        animal_words = animal_words[:-1]
    return "-".join(animal_words)


def extract_filename_from_path(path):
    return path.split("/")[-1]


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

        animal_id = extract_animal_id_from_photo_filename(file_name)
        
        # write photo path in json if not the case yet
        directory = os.path.split(photo)[0]
        category = directory.split(os.sep)[-1]
        check_photos_in_json(animal_id, category, photo.name)

        if latest_photo is None or file_name > latest_photo["fileName"]:
            animal_id = extract_animal_id_from_photo_filename(file_name)
            category = photo.parent.name
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



def check_photos_in_json (animal_id, category_dir, photo_id):
    assert type(animal_id) == str, "/!\\ Erreur avec l'animal_id pour la photo {}".format(photo_id)
    
    json_filename = animal_id + ".json"
    # Check if associated json file exists
    if json_filename not in DATA_LIST.keys():
        MISSING_DATA.add(json_filename)
        return

    # check if the photo is already registered, otherwise write it
    if not photo_id in DATA_LIST[json_filename]:
        file_data = None
        datafile = DATA_DIR.joinpath(category_dir, json_filename)
        with open(datafile, "r", encoding="utf-8-sig") as f:
            file_data = json.load(f)
            photo_path = str(IMAGES_DIR).replace(os.sep, "/") + "/" + category_dir + "/" + photo_id
            # Removing "../" from path
            photo_path = photo_path[3:]
            place = input("La photo :\n{}\nva être ajoutée au fichier :\n{}\n --> indiquer le lieu de la photo (ou appuyer sur 'entrée' pour compléter plus tard) :\n> ".format(photo_id, photo_path))
            if place == "":
                place = "TBD"
                DATA_TO_COMPLETE.add(datafile)
            photos = file_data["photos"] + [{"fichier": photo_path, "lieu": place}]
            photos.sort(key=lambda photo : photo["fichier"], reverse=True)
            file_data["photos"] = photos
        
        if file_data != None:
            with open(datafile, "w", encoding="utf-8-sig") as f:
                json.dump(file_data, f, ensure_ascii=False, indent=2)




## Register existing data files and associated photos
def register_data(filename, category_dir):
    registered_photos = []
    datafile = DATA_DIR.joinpath(category_dir, filename)
    with open(datafile, "r", encoding="utf-8-sig") as f:
        file_data = json.load(f)
        for photo_data in file_data["photos"]:
            photo = extract_filename_from_path(photo_data["fichier"])
            registered_photos += [photo]
    DATA_LIST[filename] = registered_photos
            
    
    

def generate_json_list():
    index = []

    for category_dir in sorted(DATA_DIR.iterdir()):
        if not category_dir.is_dir():
            continue

        json_files = []

        for file in sorted(category_dir.glob("*.json")):
            filename = file.name
            if filename == "index.json":
                continue
            # Register existing data files and associated photos
            register_data(filename, category_dir)

            json_files.append({
                "name": filename
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
    
    if len(MISSING_DATA) > 0:
        print("\n#######################################################")
        print("Les fichiers json suivants n'ont pas encore été créés :")
        print(MISSING_DATA)
        print()
    
    if len(DATA_TO_COMPLETE) > 0:
        print("###################################################################################")
        print("Les fichiers json suivants ont besoin d'être complétés (lieux de photo manquants) :")
        print(DATA_TO_COMPLETE)
        print()
