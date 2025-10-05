// src/utils/textUtils.js

/**
 * Splits text into paragraphs and handles formatting
 * @param {string} text - The text to format
 * @returns {string[]} Array of paragraphs
 */
export const formatTextToParagraphs = (text) => {
  if (!text) return [];

  return text
    .split(/\n\s*\n/) // Split on double newlines
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);
};

/**
 * Truncates text to a specified length with ellipsis
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 200) => {
  if (!text || text.length <= maxLength) return text;

  return text.substr(0, maxLength).trim() + "...";
};

/**
 * Estimates reading time for given text
 * @param {string} text - The text to analyze
 * @param {number} wordsPerMinute - Average reading speed (default: 200 WPM)
 * @returns {number} Estimated reading time in minutes
 */
export const estimateReadingTime = (text, wordsPerMinute = 200) => {
  if (!text) return 0;

  const wordCount = text.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);

  return Math.max(1, minutes); // Minimum 1 minute
};

/**
 * Formats text with proper paragraph breaks and removes extra whitespace
 * @param {string} text - The text to clean
 * @returns {string} Cleaned text
 */
export const cleanText = (text) => {
  if (!text) return "";

  return text
    .replace(/\r\n/g, "\n") // Normalize line endings
    .replace(/\n{3,}/g, "\n\n") // Replace multiple newlines with double
    .replace(/\s+/g, " ") // Replace multiple spaces with single
    .trim();
};

/**
 * Extracts the first sentence from a text
 * @param {string} text - The text to extract from
 * @returns {string} First sentence
 */
export const getFirstSentence = (text) => {
  if (!text) return "";

  const sentences = text.split(/[.!?]+/);
  return sentences[0].trim() + (sentences.length > 1 ? "." : "");
};

/**
 * Formats text for display with proper line breaks
 * @param {string} text - The text to format
 * @returns {string[]} Array of text lines
 */
export const formatTextWithLineBreaks = (text) => {
  if (!text) return [];

  return text.split("\n");
};

/**
 * Extracts character attributes from biography text
 * @param {string} text - The biography text
 * @returns {Object} Object containing parsed attributes and clean description
 */
export const parseCharacterAttributes = (text) => {
  if (!text) return { attributes: [], description: "" };

  const attributes = [];
  const lines = text.split("\n").filter((line) => line.trim());
  let descriptionStart = 0;

  // Common attribute patterns
  const attributePatterns = [
    /^Age[:\s]+(.+)/i,
    /^Birthday[:\s]+(.+)/i,
    /^Height[:\s]+(.+)/i,
    /^Weight[:\s]+(.+)/i,
    /^Blood[:\s]*Type[:\s]+(.+)/i,
    /^Position[:\s]+(.+)/i,
    /^Affiliation[:\s]+(.+)/i,
    /^Occupation[:\s]+(.+)/i,
    /^Rank[:\s]+(.+)/i,
    /^Status[:\s]+(.+)/i,
    /^Devil[:\s]*Fruit[:\s]+(.+)/i,
    /^Bounty[:\s]+(.+)/i,
    /^Nickname[:\s]+(.+)/i,
    /^Origin[:\s]+(.+)/i,
    /^Species[:\s]+(.+)/i,
    /^Gender[:\s]+(.+)/i,
  ];

  // Parse first few lines for attributes
  for (let i = 0; i < Math.min(lines.length, 10); i++) {
    const line = lines[i].trim();
    let matched = false;

    for (const pattern of attributePatterns) {
      const match = line.match(pattern);
      if (match) {
        const key = line.split(":")[0].trim();
        const value = match[1].trim();
        attributes.push({ key, value });
        matched = true;
        descriptionStart = Math.max(descriptionStart, i + 1);
        break;
      }
    }

    // If line doesn't match any pattern and we've found some attributes,
    // this might be the start of the description
    if (!matched && attributes.length > 0 && line.length > 50) {
      descriptionStart = i;
      break;
    }
  }

  // Extract description (everything after attributes)
  const description = lines.slice(descriptionStart).join("\n").trim();

  return { attributes, description };
};
