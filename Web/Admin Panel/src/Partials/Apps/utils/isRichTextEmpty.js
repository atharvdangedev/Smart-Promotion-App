/**
 * Checks if a string containing HTML is semantically empty.
 * @param html The HTML string from the rich text editor.
 * @returns {boolean} True if the content is effectively empty, false otherwise.
 */
export const isRichTextEmpty = (html) => {
  if (!html) {
    return true;
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const textContent = doc.body.textContent?.trim() ?? "";

  return textContent.length === 0;
};
