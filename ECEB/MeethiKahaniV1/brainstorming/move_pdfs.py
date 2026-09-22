import os
import shutil

base_dir = r"d:\Pillai-Notes\SEM5\ECEB\MeethiKahaniV1"
pdf_dir = os.path.join(base_dir, "PDFs")

os.makedirs(pdf_dir, exist_ok=True)

# List of all directories to search for PDFs
dirs_to_check = [
    base_dir,
    os.path.join(base_dir, "brainstorming"),
    os.path.join(base_dir, "testing")
]

moved_files = []

for d in dirs_to_check:
    if os.path.exists(d):
        for item in os.listdir(d):
            if item.lower().endswith(".pdf"):
                src_path = os.path.join(d, item)
                dst_path = os.path.join(pdf_dir, item)
                shutil.copy2(src_path, dst_path)
                moved_files.append(item)

print(f"Successfully copied/moved all PDFs to: {pdf_dir}")
print("Moved files:", list(set(moved_files)))
