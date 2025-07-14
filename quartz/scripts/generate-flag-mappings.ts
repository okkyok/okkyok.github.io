import { writeFileSync, readFileSync } from "fs"
import path, { join } from "path"
import { fileURLToPath } from "url"
import { flagEmojiMap } from "../util/flags.js"

// Get the current directory path in ES module
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Path to the emojimap.json file
const EMOJI_MAP_PATH = join(__dirname, "../util/emojimap.json")

// Load the existing emoji map
const emojiMap = JSON.parse(readFileSync(EMOJI_MAP_PATH, "utf-8"))

// Generate code point to name mappings for flag emojis
const flagCodePointToName: Record<string, string> = {}
const flagNameToBase64: Record<string, string> = {}

Object.entries(flagEmojiMap).forEach(([code, flag]) => {
  const flagName = `flag_${code.toLowerCase()}`
  const [cp1, cp2] = flag.unicode

  // Add code point to name mappings for both regional indicators
  flagCodePointToName[`U+${cp1}`] = flagName
  flagCodePointToName[`U+${cp2}`] = flagName

  // Add placeholder for the flag image
  // In a real implementation, you would provide the actual base64-encoded image data
  flagNameToBase64[flagName] = `data:image/png;base64,FLAG_${code.toUpperCase()}_IMAGE_PLACEHOLDER`
})

// Merge with existing mappings
const updatedEmojiMap = {
  ...emojiMap,
  codePointToName: {
    ...emojiMap.codePointToName,
    ...flagCodePointToName,
  },
  nameToBase64: {
    ...emojiMap.nameToBase64,
    ...flagNameToBase64,
  },
}

// Write the updated emoji map back to the file
writeFileSync(
  EMOJI_MAP_PATH,
  JSON.stringify(updatedEmojiMap, null, 2) + "\n", // Add newline at the end
  "utf-8",
)

console.log(`Added ${Object.keys(flagEmojiMap).length} flag emoji mappings to emojimap.json`)
