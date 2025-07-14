/**
 * Mapping of ISO 3166-1 alpha-2 country codes to their corresponding flag emoji Unicode code points.
 * The keys are lowercase country codes (e.g., 'us', 'jp', 'gb').
 * The values are arrays of two Unicode code points representing the regional indicator symbols.
 *
 * Example: 'jp' => ['1F1EF', '1F1F5'] (🇯🇵)
 */

export type FlagCode = string // ISO 3166-1 alpha-2 country code
export type UnicodeCodePoint = string // 4-5 digit hex code (e.g., '1F1EF')

// Type for flag emoji data
export interface FlagEmojiData {
  code: FlagCode
  name: string
  unicode: [UnicodeCodePoint, UnicodeCodePoint]
}

// Helper function to create flag emoji from country code
const flag = (
  code: FlagCode,
  name: string,
  part1: UnicodeCodePoint,
  part2: UnicodeCodePoint,
): FlagEmojiData => ({
  code,
  name,
  unicode: [part1, part2],
})

// List of flag emoji data - starting with A-C countries
const flagData: FlagEmojiData[] = [
  // A
  flag("ad", "Andorra", "1F1E6", "1F1E9"),
  flag("ae", "United Arab Emirates", "1F1E6", "1F1EA"),
  flag("af", "Afghanistan", "1F1E6", "1F1EB"),
  flag("ag", "Antigua and Barbuda", "1F1E6", "1F1EC"),
  flag("ai", "Anguilla", "1F1E6", "1F1EE"),
  flag("al", "Albania", "1F1E6", "1F1F1"),
  flag("am", "Armenia", "1F1E6", "1F1F2"),
  flag("ao", "Angola", "1F1E6", "1F1F4"),
  flag("ar", "Argentina", "1F1E6", "1F1F7"),
  flag("at", "Austria", "1F1E6", "1F1F9"),
  flag("au", "Australia", "1F1E6", "1F1FA"),
  flag("az", "Azerbaijan", "1F1E6", "1F1FF"),

  // B
  flag("ba", "Bosnia and Herzegovina", "1F1E7", "1F1E6"),
  flag("bb", "Barbados", "1F1E7", "1F1E7"),
  flag("bd", "Bangladesh", "1F1E7", "1F1E9"),
  flag("be", "Belgium", "1F1E7", "1F1EA"),
  flag("bf", "Burkina Faso", "1F1E7", "1F1EB"),
  flag("bg", "Bulgaria", "1F1E7", "1F1EC"),
  flag("bh", "Bahrain", "1F1E7", "1F1ED"),
  flag("bi", "Burundi", "1F1E7", "1F1EE"),
  flag("bj", "Benin", "1F1E7", "1F1EF"),
  flag("bn", "Brunei", "1F1E7", "1F1F3"),
  flag("bo", "Bolivia", "1F1E7", "1F1F4"),
  flag("br", "Brazil", "1F1E7", "1F1F7"),
  flag("bs", "Bahamas", "1F1E7", "1F1F8"),
  flag("bt", "Bhutan", "1F1E7", "1F1F9"),
  flag("bw", "Botswana", "1F1E7", "1F1FC"),
  flag("by", "Belarus", "1F1E7", "1F1FE"),
  flag("bz", "Belize", "1F1E7", "1F1FF"),

  // C
  flag("ca", "Canada", "1F1E8", "1F1E6"),
  flag("cd", "DR Congo", "1F1E8", "1F1E9"),
  flag("cf", "Central African Republic", "1F1E8", "1F1EB"),
  flag("cg", "Congo", "1F1E8", "1F1EC"),
  flag("ch", "Switzerland", "1F1E8", "1F1ED"),
  flag("ci", "Côte d'Ivoire", "1F1E8", "1F1EE"),
  flag("cl", "Chile", "1F1E8", "1F1F1"),
  flag("cm", "Cameroon", "1F1E8", "1F1F2"),
  flag("cn", "China", "1F1E8", "1F1F3"),
  flag("co", "Colombia", "1F1E8", "1F1F4"),
  flag("cr", "Costa Rica", "1F1E8", "1F1F7"),
  flag("cu", "Cuba", "1F1E8", "1F1FA"),
  flag("cv", "Cape Verde", "1F1E8", "1F1FB"),
  flag("cy", "Cyprus", "1F1E8", "1F1FE"),
  flag("cz", "Czechia", "1F1E8", "1F1FF"),
]

// Create a map from country code to flag emoji data
export const flagEmojiMap: Record<FlagCode, FlagEmojiData> = flagData.reduce(
  (acc, flag) => {
    acc[flag.code] = flag
    return acc
  },
  {} as Record<FlagCode, FlagEmojiData>,
)

// Function to get flag emoji from country code
export function getFlagEmoji(countryCode: FlagCode): string | undefined {
  const flag = flagEmojiMap[countryCode.toLowerCase()]
  if (!flag) return undefined

  // Convert Unicode code points to actual characters
  return String.fromCodePoint(parseInt(flag.unicode[0], 16), parseInt(flag.unicode[1], 16))
}

// Function to get all flag emojis
export function getAllFlagEmojis(): Record<string, string> {
  return Object.keys(flagEmojiMap).reduce(
    (acc, code) => {
      const emoji = getFlagEmoji(code)
      if (emoji) {
        acc[code] = emoji
      }
      return acc
    },
    {} as Record<string, string>,
  )
}
