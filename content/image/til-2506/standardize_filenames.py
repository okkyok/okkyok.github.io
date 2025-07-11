import os
import re
import collections

# --- Configuration ---
BASE_DIR = os.path.normpath("/Users/okky_1_2/Library/Mobile Documents/com~apple~CloudDocs/my_obsidian/🌏️okkylife")
IMAGE_SUBDIR = "image/til-2506"
IMAGE_DIR = os.path.join(BASE_DIR, IMAGE_SUBDIR)
EXCLUDE_DIRS = ['Notes', '.obsidian', '.git', 'script']
FILENAME_LENGTH = 15

# --- Helper Functions ---
def remove_emojis(text):
    # This regex should cover most emojis, including ones previously missed.
    emoji_pattern = re.compile(
        "["
        "\U0001F600-\U0001F64F"  # emoticons
        "\U0001F300-\U0001F5FF"  # symbols & pictographs
        "\U0001F680-\U0001F6FF"  # transport & map symbols
        "\U0001F1E0-\U0001F1FF"  # flags (iOS)
        "\u2600-\u26FF"
        "\u2700-\u27BF"
        "\U0001F900-\U0001F9FF"  # Supplemental Symbols and Pictographs
        "\ufe0f"  # Variation Selector
        "]+", flags=re.UNICODE)
    return emoji_pattern.sub(r'', text)

def find_md_files(root_dir):
    md_files = []
    for root, dirs, files in os.walk(root_dir):
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS and not d.startswith('.')]
        for file in files:
            if file.endswith('.md'):
                md_files.append(os.path.join(root, file))
    return md_files

def get_article_title(md_content):
    match = re.search(r"^title:\s*['\"]?([^'\"\n]+)['\"]?", md_content, re.MULTILINE)
    if match:
        return match.group(1).strip()
    return None

def sanitize_filename_part(name):
    # Removes characters that are invalid for filenames from the title part
    return re.sub(r'[\\/:*?"<>|]', '_', name).strip()

# --- Main Processing Function ---
def standardize_filenames():
    print(f"--- Starting Filename Standardization (First {FILENAME_LENGTH} chars of title) ---")
    if not os.path.isdir(IMAGE_DIR):
        print(f"ERROR: Image directory not found at {IMAGE_DIR}")
        return

    md_files = find_md_files(BASE_DIR)
    image_files = [f for f in os.listdir(IMAGE_DIR) if os.path.isfile(os.path.join(IMAGE_DIR, f)) and not f.startswith('.')]

    # 1. Build a map of which article uses which image
    image_to_article_map = {}
    print("Building map of images to articles...")
    for md_path in md_files:
        try:
            with open(md_path, 'r', encoding='utf-8') as f:
                content = f.read()
            linked_images = re.findall(r"!\[\[([^\]]+)\]\]", content)
            for img in linked_images:
                if img in image_files:
                    # One image can be in multiple articles, we take the first one found
                    if img not in image_to_article_map:
                         image_to_article_map[img] = md_path
        except Exception as e:
            print(f"Could not process {md_path}: {e}")

    # 2. Process images and rename if they don't match the standard
    processed_count = 0
    renamed_count = 0
    orphaned_images = []
    # This counter tracks the sequence number for each new filename prefix
    new_filename_counters = collections.defaultdict(int)

    # We sort to process _1, _2, etc. in order
    for old_filename_with_ext in sorted(image_files):
        processed_count += 1
        if old_filename_with_ext not in image_to_article_map:
            orphaned_images.append(old_filename_with_ext)
            continue

        article_path = image_to_article_map[old_filename_with_ext]
        try:
            with open(article_path, 'r', encoding='utf-8') as f:
                article_content = f.read()
            
            article_title = get_article_title(article_content)
            if not article_title:
                article_title, _ = os.path.splitext(os.path.basename(article_path))

            # Generate the standard filename prefix
            clean_title = remove_emojis(article_title)
            sanitized_title = sanitize_filename_part(clean_title)
            new_prefix = sanitized_title[:FILENAME_LENGTH]

            # Determine the new filename with sequence number
            new_filename_counters[new_prefix] += 1
            sequence_num = new_filename_counters[new_prefix]
            _, ext = os.path.splitext(old_filename_with_ext)
            new_filename_with_ext = f"{new_prefix}_{sequence_num}{ext}"

            if old_filename_with_ext != new_filename_with_ext:
                old_filepath = os.path.join(IMAGE_DIR, old_filename_with_ext)
                new_filepath = os.path.join(IMAGE_DIR, new_filename_with_ext)

                if os.path.exists(new_filepath):
                    print(f"SKIPPING rename of '{old_filename_with_ext}': target '{new_filename_with_ext}' already exists.")
                    # If the target exists, we assume it's a previously renamed file.
                    # We need to update the link content to point to the existing correct file.
                    # This handles cases where script is run multiple times.
                else:
                    os.rename(old_filepath, new_filepath)
                    print(f"RENAMED: '{old_filename_with_ext}' -> '{new_filename_with_ext}'")
                    renamed_count += 1

                # Update link in the article
                old_link = f"![[{old_filename_with_ext}]]"
                new_link = f"![[{new_filename_with_ext}]]"
                if old_link in article_content:
                    updated_content = article_content.replace(old_link, new_link)
                    with open(article_path, 'w', encoding='utf-8') as f:
                        f.write(updated_content)
                    print(f"  - UPDATED link in: {os.path.basename(article_path)}")

        except Exception as e:
            print(f"ERROR processing '{old_filename_with_ext}': {e}")

    print(f"\n--- Standardization Complete ---")
    print(f"Processed: {processed_count} images")
    print(f"Renamed:   {renamed_count} images")
    if orphaned_images:
        print(f"Orphaned:  {len(orphaned_images)} images (not found in any article)")
        # for orphan in orphaned_images:
        #     print(f"  - {orphan}")

# --- Run Script ---
if __name__ == "__main__":
    standardize_filenames()
