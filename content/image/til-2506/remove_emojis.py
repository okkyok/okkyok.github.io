import os
import re
import sys

# --- Configuration ---
BASE_DIR = os.path.normpath("/Users/okky_1_2/Library/Mobile Documents/com~apple~CloudDocs/my_obsidian/🌏️okkylife")
IMAGE_SUBDIR = "image/til-2506"
IMAGE_DIR = os.path.join(BASE_DIR, IMAGE_SUBDIR)
EXCLUDE_DIRS = ['Notes', '.obsidian', '.git', 'script']

# --- Emoji Removal Function ---
def remove_emojis(text):
    # More specific regex to remove only emojis, not other symbols or characters.
    # This pattern is safer for filenames containing Japanese.
    try:
        # Use the emoji library if available for the most accurate detection
        import emoji
        return ''.join(c for c in text if c not in emoji.EMOJI_DATA)
    except ImportError:
        # Fallback to a safer regex if emoji library is not installed
        print("Warning: 'emoji' library not found. Using regex fallback. To install: pip install emoji")
        emoji_pattern = re.compile(
            "["
            "\U0001F600-\U0001F64F"  # emoticons
            "\U0001F300-\U0001F5FF"  # symbols & pictographs
            "\U0001F680-\U0001F6FF"  # transport & map symbols
            "\U0001F1E0-\U0001F1FF"  # flags (iOS)
            "\u2600-\u26FF"
            "\u2700-\u27BF"
            "\U0001F900-\U0001F9FF"  # Supplemental Symbols and Pictographs
            "]+", flags=re.UNICODE)
        return emoji_pattern.sub(r'', text)
    return emoji_pattern.sub(r'', text)

# --- Main Processing Function ---
def process_files():
    print("--- Starting Emoji Removal Script ---")
    if not os.path.isdir(IMAGE_DIR):
        print(f"Error: Image directory not found at {IMAGE_DIR}")
        return

    # 1. Find all markdown files
    md_files = []
    for root, dirs, files in os.walk(BASE_DIR):
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS and not d.startswith('.')]
        for file in files:
            if file.endswith('.md'):
                md_files.append(os.path.join(root, file))
    print(f"Found {len(md_files)} markdown files to check.")

    # 2. Process each image file
    renamed_count = 0
    for old_filename_with_ext in os.listdir(IMAGE_DIR):
        if old_filename_with_ext.startswith('.'):
            continue

        old_filename, ext = os.path.splitext(old_filename_with_ext)
        new_filename = remove_emojis(old_filename)

        if old_filename != new_filename:
            new_filename_with_ext = new_filename + ext
            old_filepath = os.path.join(IMAGE_DIR, old_filename_with_ext)
            new_filepath = os.path.join(IMAGE_DIR, new_filename_with_ext)

            # Safety check for existing file
            if os.path.exists(new_filepath):
                print(f"SKIPPING: Target file '{new_filename_with_ext}' already exists.")
                continue

            # Rename the image file
            os.rename(old_filepath, new_filepath)
            print(f"RENAMED: '{old_filename_with_ext}' -> '{new_filename_with_ext}'")
            renamed_count += 1

            # 3. Update links in markdown files
            for md_path in md_files:
                try:
                    with open(md_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    # Use both original and URL-encoded names for searching
                    old_link_pattern_obsidian = f"![[{old_filename_with_ext}]]"
                    new_link_pattern_obsidian = f"![[{new_filename_with_ext}]]"

                    if old_link_pattern_obsidian in content:
                        content = content.replace(old_link_pattern_obsidian, new_link_pattern_obsidian)
                        with open(md_path, 'w', encoding='utf-8') as f:
                            f.write(content)
                        print(f"  - UPDATED link in: {os.path.basename(md_path)}")

                except Exception as e:
                    print(f"  - ERROR processing {os.path.basename(md_path)}: {e}")

    if renamed_count == 0:
        print("\nNo files with emojis in their names were found.")
    else:
        print(f"\n--- Finished: {renamed_count} file(s) renamed and links updated. ---")

# --- Run Script ---
if __name__ == "__main__":
    process_files()
