import os
import re

# --- Configuration ---
BASE_DIR = os.path.normpath("/Users/okky_1_2/Library/Mobile Documents/com~apple~CloudDocs/my_obsidian/🌏️okkylife")
IMAGE_SUBDIR = "image/til-2506"
IMAGE_DIR = os.path.join(BASE_DIR, IMAGE_SUBDIR)
EXCLUDE_DIRS = ['Notes', '.obsidian', '.git', 'script']
# Files with basenames (w/o extension) shorter than this will be considered for restoration
RENAME_THRESHOLD = 5 

# --- Helper Functions ---
def find_md_files(root_dir):
    md_files = []
    for root, dirs, files in os.walk(root_dir):
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS and not d.startswith('.')]
        for file in files:
            if file.endswith('.md'):
                md_files.append(os.path.join(root, file))
    return md_files

def get_article_title(md_content):
    # Try to find title in frontmatter
    match = re.search(r"^title:\s*['\"]?([^'\"\n]+)['\"]?", md_content, re.MULTILINE)
    if match:
        return match.group(1).strip()
    return None

def sanitize_filename(name):
    # Removes characters that are invalid for filenames
    return re.sub(r'[\\/:*?"<>|]', '_', name)

# --- Main Processing Function ---
def restore_filenames():
    print("--- Starting Filename Restoration Script ---")
    if not os.path.isdir(IMAGE_DIR):
        print(f"Error: Image directory not found at {IMAGE_DIR}")
        return

    md_files = find_md_files(BASE_DIR)
    image_files = [f for f in os.listdir(IMAGE_DIR) if os.path.isfile(os.path.join(IMAGE_DIR, f)) and not f.startswith('.')]

    # Build a map of which article uses which image
    image_to_article_map = {}
    print("Building map of images to articles...")
    for md_path in md_files:
        try:
            with open(md_path, 'r', encoding='utf-8') as f:
                content = f.read()
            # Find all image links in the content
            linked_images = re.findall(r"!\[\[([^\]]+)\]\]", content)
            for img in linked_images:
                if img in image_files:
                    image_to_article_map[img] = md_path
        except Exception as e:
            print(f"Could not process {md_path}: {e}")

    print(f"{len(image_to_article_map)} image-to-article links found.")
    restored_count = 0

    # Process each image that was likely incorrectly renamed
    for old_filename_with_ext in image_files:
        basename, ext = os.path.splitext(old_filename_with_ext)
        
        # Heuristic: if filename is too short, it was probably a mistake
        if len(basename) < RENAME_THRESHOLD:
            print(f"\nFound potentially corrupted filename: {old_filename_with_ext}")
            if old_filename_with_ext not in image_to_article_map:
                print(f"  - SKIPPING: No article found linking to it.")
                continue

            article_path = image_to_article_map[old_filename_with_ext]
            print(f"  - Linked from article: {os.path.basename(article_path)}")

            try:
                with open(article_path, 'r', encoding='utf-8') as f:
                    article_content = f.read()
                
                article_title = get_article_title(article_content)
                if not article_title:
                    # Fallback to using the markdown filename as the title
                    article_title, _ = os.path.splitext(os.path.basename(article_path))
                    print(f"  - No title in frontmatter, using filename: {article_title}")

                # Create a new, safer filename from the article title
                # We keep the original extension and any numbering like '_1'
                numbering_match = re.search(r'(_\d+)$', basename)
                numbering = numbering_match.group(1) if numbering_match else ''
                
                new_basename = sanitize_filename(article_title)[:50] + numbering
                new_filename_with_ext = new_basename + ext

                if old_filename_with_ext == new_filename_with_ext:
                    print(f"  - SKIPPING: Generated name is the same.")
                    continue

                old_filepath = os.path.join(IMAGE_DIR, old_filename_with_ext)
                new_filepath = os.path.join(IMAGE_DIR, new_filename_with_ext)

                if os.path.exists(new_filepath):
                    print(f"  - SKIPPING: A file named '{new_filename_with_ext}' already exists.")
                    continue

                # 1. Rename file
                os.rename(old_filepath, new_filepath)
                print(f"  - RENAMED file to: {new_filename_with_ext}")

                # 2. Update link in article
                old_link = f"![[{old_filename_with_ext}]]"
                new_link = f"![[{new_filename_with_ext}]]"
                updated_content = article_content.replace(old_link, new_link)
                
                with open(article_path, 'w', encoding='utf-8') as f:
                    f.write(updated_content)
                print(f"  - UPDATED link in article.")
                restored_count += 1

            except Exception as e:
                print(f"  - ERROR restoring file: {e}")

    if restored_count == 0:
        print("\nNo files needed restoration.")
    else:
        print(f"\n--- Finished: {restored_count} file(s) restored. ---")

# --- Run Script ---
if __name__ == "__main__":
    restore_filenames()
