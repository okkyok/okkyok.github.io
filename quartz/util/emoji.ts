const U200D = String.fromCharCode(8205)
const UFE0Fg = /\uFE0F/g

// Flag emoji utilities are used in the exported functions
import './emojiFlags';

/**
 * Gets the Unicode code point for a character
 */
export function getIconCode(char: string): string {
  // Check if the character is a flag emoji (2 regional indicators)
  if (char.length === 2 && char.charCodeAt(0) >= 0x1F1E6 && char.charCodeAt(0) <= 0x1F1FF &&
      char.charCodeAt(1) >= 0x1F1E6 && char.charCodeAt(1) <= 0x1F1FF) {
    const code1 = (char.charCodeAt(0) - 0x1F1E6 + 0x41).toString(16).toUpperCase();
    const code2 = (char.charCodeAt(1) - 0x1F1E6 + 0x41).toString(16).toUpperCase();
    return `${code1}-${code2}`;
  }
  
  return toCodePoint(char.indexOf(U200D) < 0 ? char.replace(UFE0Fg, "") : char)
}

/**
 * Converts a string to its Unicode code points
 */
function toCodePoint(unicodeSurrogates: string): string {
  const r: string[] = [];
  let c = 0,
    p = 0,
    i = 0;

  while (i < unicodeSurrogates.length) {
    c = unicodeSurrogates.charCodeAt(i++);
    if (p) {
      r.push((65536 + ((p - 55296) << 10) + (c - 56320)).toString(16));
      p = 0;
    } else if (55296 <= c && c <= 56319) {
      p = c;
    } else {
      r.push(c.toString(16));
    }
  }
  return r.join("-");
}

type EmojiMap = {
  codePointToName: Record<string, string>;
  nameToBase64: Record<string, string>;
};

let emojimap: EmojiMap | undefined = undefined;

/**
 * Loads emoji data from emojimap.json and merges with flag emoji data
 */
export async function loadEmoji(code: string): Promise<string> {
  if (!emojimap) {
    // Load the base emoji map
    const data = await import("./emojimap.json");
    emojimap = data;
  }

  // Check if the code is a flag emoji (format: "1F1EF-1F1F5" for 🇯🇵)
  const flagMatch = code.match(/^([0-9A-Fa-f]+)-([0-9A-Fa-f]+)$/);
  if (flagMatch) {
    const [, part1, part2] = flagMatch;
    // Check if this is a valid regional indicator pair
    if (isRegionalIndicator(part1) && isRegionalIndicator(part2)) {
      const countryCode = getCountryCode(part1, part2);
      if (countryCode) {
        // In a real implementation, you would return the actual base64-encoded image
        // The flag name is constructed but not used directly here
        return `data:image/png;base64,FLAG_${countryCode.toUpperCase()}_IMAGE_DATA`;
      }
    }
  }

  // Handle regular emoji
  const name = emojimap.codePointToName[`U+${code.toUpperCase()}`];
  if (!name) {
    // Log the error but don't throw, to avoid crashing the build
    console.warn(`codepoint ${code} not found in map`);
    return '';
  }

  const b64 = emojimap.nameToBase64[name];
  if (!b64) {
    console.warn(`name ${name} not found in map`);
    return '';
  }

  return b64;
}

/**
 * Checks if a code point is a regional indicator symbol
 */
function isRegionalIndicator(codePoint: string): boolean {
  const code = parseInt(codePoint, 16);
  return code >= 0x1F1E6 && code <= 0x1F1FF;
}

/**
 * Gets the country code from regional indicator code points
 */
function getCountryCode(part1: string, part2: string): string | null {
  const code1 = String.fromCharCode(parseInt(part1, 16) - 0x1F1E6 + 0x41);
  const code2 = String.fromCharCode(parseInt(part2, 16) - 0x1F1E6 + 0x41);
  
  // Check if this is a valid ISO 3166-1 alpha-2 country code
  const countryCode = (code1 + code2).toLowerCase();
  
  // In a real implementation, you would check against a list of valid country codes
  // For now, we'll just return the code if both characters are letters
  if (/^[a-z]{2}$/.test(countryCode)) {
    return countryCode;
  }
  
  return null;
}

/**
 * Gets a flag emoji by country code (e.g., 'jp' for Japan)
 */
export { getFlagEmoji } from './emojiFlags';
