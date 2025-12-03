import DOMPurify from "dompurify";

export const createMarkup = (html) => {
  return {
    __html: DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        "p",
        "br",
        "b",
        "i",
        "em",
        "strong",
        "u",
        "a",
        "ul",
        "ol",
        "li",
        "span",
        "blockquote",
        "img",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
      ],
      ALLOWED_ATTR: ["href", "target", "rel", "src", "alt", "style"],
      ALLOW_DATA_ATTR: false,
    }),
  };
};
