import { Text } from 'react-native';
import React from 'react';

export const renderFormattedText = text => {
  const elements = [];

  const patterns = [
    { regex: /\*([^\*]+)\*/, style: { fontWeight: 'bold' } },
    { regex: /_([^_]+)_/, style: { fontStyle: 'italic' } },
    { regex: /~([^~]+)~/, style: { textDecorationLine: 'line-through' } },
    { regex: /```([\s\S]+?)```/, style: { fontFamily: 'monospace' } },
  ];

  let remaining = text;

  while (remaining.length > 0) {
    let found = false;

    for (let { regex, style } of patterns) {
      const match = remaining.match(regex);
      if (match) {
        const [fullMatch, innerText] = match;
        const before = remaining.slice(0, match.index);
        if (before)
          elements.push(
            <Text key={elements.length} style={{ color: '010101' }}>
              {before}
            </Text>,
          );
        elements.push(
          <Text key={elements.length} style={[{ color: '010101' }, style]}>
            {innerText}
          </Text>,
        );
        remaining = remaining.slice(match.index + fullMatch.length);
        found = true;
        break;
      }
    }

    if (!found) {
      elements.push(
        <Text key={elements.length} style={{ color: '010101' }}>
          {remaining}
        </Text>,
      );
      break;
    }
  }

  return elements;
};
