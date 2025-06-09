import { flagEmojiMap } from './flags';

/**
 * Generates the code point to name mapping for flag emojis
 */
export function generateFlagCodePointToName(): Record<string, string> {
  const result: Record<string, string> = {};
  
  Object.values(flagEmojiMap).forEach(flag => {
    const codePoint1 = `U+${flag.unicode[0]}`;
    const codePoint2 = `U+${flag.unicode[1]}`;
    const flagName = `flag_${flag.code}`;
    
    // Add both code points with the same flag name
    result[codePoint1] = flagName;
    result[codePoint2] = flagName;
  });
  
  return result;
}

/**
 * Generates the name to base64 mapping for flag emojis
 * Note: This is a placeholder. In a real implementation, you would need to provide
 * the actual base64-encoded image data for each flag.
 */
export function generateFlagNameToBase64(): Record<string, string> {
  const result: Record<string, string> = {};
  
  Object.values(flagEmojiMap).forEach(flag => {
    const flagName = `flag_${flag.code}`;
    // Placeholder for the actual base64-encoded image data
    // In a real implementation, you would load the actual flag images
    result[flagName] = `data:image/png;base64,FLAG_${flag.code.toUpperCase()}_IMAGE_DATA`;
  });
  
  return result;
}

/**
 * Merges the flag emoji mappings with the existing emoji map
 */
export function mergeWithEmojiMap(
  existingMap: { codePointToName: Record<string, string>; nameToBase64: Record<string, string> }
): { codePointToName: Record<string, string>; nameToBase64: Record<string, string> } {
  const flagCodePointToName = generateFlagCodePointToName();
  const flagNameToBase64 = generateFlagNameToBase64();
  
  return {
    codePointToName: {
      ...existingMap.codePointToName,
      ...flagCodePointToName,
    },
    nameToBase64: {
      ...existingMap.nameToBase64,
      ...flagNameToBase64,
    },
  };
}

/**
 * Gets a flag emoji by country code
 */
export function getFlagEmoji(countryCode: string): string | undefined {
  const flag = flagEmojiMap[countryCode.toLowerCase()];
  if (!flag) return undefined;
  
  // Convert Unicode code points to actual characters
  return String.fromCodePoint(
    parseInt(flag.unicode[0], 16),
    parseInt(flag.unicode[1], 16)
  );
}
