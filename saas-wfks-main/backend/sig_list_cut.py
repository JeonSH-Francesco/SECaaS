import json

def classify_and_save(data):
    classifications = {
        "sql_injection": {"start": "SQL-00009", "end": "SQL-00426"},
        "xss": {"start": "XSS-00057", "end": "XSS-00267"},
        "upload": {"start": "UPL-00001", "end": "UPL-00097"},
        "download": {"start": "DNL-00001", "end": "DNL-00024"},
        "directory_listing": {"start": "DIL-00001", "end": "DIL-00002"},
        "url_regex": {"start": "URL-00001", "end": "URL-00063"},
        "shellcode": {"start": "SHD-00014", "end": "SHD-00203"},
        "access_control": {"start": "ACC-00001", "end": "ACC-00219"}
    }


    for classification, values in classifications.items():
        start, end = values["start"], values["end"]
        classified_data = []

        for entry in data:
            sig_id = entry["sig_id"]
            poc_example = entry["poc_example"]
            origin_sig_id = entry["origin_sig_id"]

            if start <= sig_id <= end:
                classified_data.append({"sig_id": origin_sig_id, "poc_example": poc_example})

            # Save the combined_data to a file with utf-8 encoding
            with open(f"./json/sig_list/{classification}.json", "w", encoding="utf-8") as file:
                json.dump(classified_data, file, indent=2, ensure_ascii=False)

if __name__ == "__main__":
    with open("./json/sig_list.json", "r", encoding="utf-8") as file:
        data = json.load(file)
    classify_and_save(data)
