// import sanitizeHtml from "sanitize-html";

// export const sanitizeString = (dirtyHtml) => {
//   return sanitizeHtml(dirtyHtml, {
//     allowedTags: [
//       "p", "br", "b", "i", "em", "strong", "u", "a",
//       "ul", "ol", "li", "span", "blockquote", "img",
//       "h1", "h2", "h3", "h4", "h5", "h6"
//     ],
//     allowedAttributes: {
//       a: ["href", "target", "rel"],
//       img: ["src", "alt"],
//     },
//     allowedSchemes: ["http", "https"],
//   });
// };

import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import RenderHTML from 'react-native-render-html';
import sanitizeHtml from 'sanitize-html';

export default function SanitizedHtml({ htmlString }) {
  const { width } = useWindowDimensions();

  const cleanHtml = sanitizeHtml(htmlString, {
    allowedTags: [
      'p',
      'br',
      'b',
      'i',
      'em',
      'strong',
      'u',
      'a',
      'ul',
      'ol',
      'li',
      'span',
      'blockquote',
      'img',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
    ],
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
      img: ['src', 'alt'],
    },
    allowedSchemes: ['http', 'https'],
  });

  return (
    <View>
      <RenderHTML
        contentWidth={width}
        source={{ html: cleanHtml }}
        tagsStyles={{
          p: { marginBottom: 8, fontSize: 16, color: 'black' },
          b: { fontWeight: 'bold', color: 'black' },
          i: { fontStyle: 'italic', color: 'black' },
          u: { textDecorationLine: 'underline' },
        }}
        baseStyle={{ color: 'black'}}
      />
    </View>
  );
}
