import os

base_dir = r"d:\Pillai-Notes\SEM5\ECEB\MeethiKahaniV1"
pdf_dir = os.path.join(base_dir, "PDFs")

dirs_to_clean = [
    base_dir,
    os.path.join(base_dir, "brainstorming"),
    os.path.join(base_dir, "testing")
]

deleted_files = []

for d in dirs_to_clean:
    if os.path.exists(d):
        for item in os.listdir(d):
            full_path = os.path.join(d, item)
            # Make sure we don't delete files inside the PDFs folder itself
            if os.path.isfile(full_path) and item.lower().endswith(".pdf"):
                os.remove(full_path)
                deleted_files.append(full_path)

print(f"Successfully cleaned up {len(deleted_files)} duplicate PDF files outside of PDFs directory.")
for f in deleted_files:
    print(f"Deleted: {f}")
