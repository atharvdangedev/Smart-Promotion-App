/* eslint-disable react/prop-types */
/* eslint-disable no-useless-escape */
import React, { useRef } from "react";

const parseMessage = (message) => {
  const patterns = [
    { regex: /\*([^\*]+)\*/g, style: "bold" },
    { regex: /_([^_]+)_/g, style: "italic" },
    { regex: /~([^~]+)~/g, style: "strike" },
    { regex: /`([^`]+)`/g, style: "mono" },
  ];

  const replaceRecursive = (text) => {
    for (const { regex, style } of patterns) {
      const match = regex.exec(text);
      if (match) {
        const start = match.index;
        const end = start + match[0].length;
        return [
          ...replaceRecursive(text.slice(0, start)),
          { text: match[1], style },
          ...replaceRecursive(text.slice(end)),
        ];
      }
    }
    return text ? [{ text, style: "plain" }] : [];
  };

  return replaceRecursive(message);
};

const getChunkClassName = (style) => {
  switch (style) {
    case "bold":
      return "wa-bold";
    case "italic":
      return "wa-italic";
    case "strike":
      return "wa-strike";
    case "mono":
      return "wa-mono";
    default:
      return "wa-plain";
  }
};

const styles = `
.wa-editor-wrapper {
  border: 1px solid #ced4da;
  border-radius: 0.375rem;
  overflow: hidden;
}
.wa-editor-wrapper.is-invalid {
  border-color: #dc3545; /* Bootstrap's danger color */
}

.wa-toolbar {
  display: flex;
  gap: 4px;
  padding: 8px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #ced4da;
}
.wa-toolbar button {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  border: 1px solid #ced4da;
  background-color: #fff;
  border-radius: 4px;
  width: 32px;
  height: 32px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: background-color 0.2s;
  font-weight: 500;
}
.wa-toolbar button:hover {
  background-color: #e9ecef;
}

.wa-main-content {
  display: flex;
  min-height: 200px;
}
.wa-input-area, .wa-preview-area {
  flex: 1;
  padding: 12px;
  font-size: 1rem;
  line-height: 1.5;
  font-family: inherit;
}

.wa-input-area {
  width: 100%;
  border: none;
  resize: none;
  border-right: 1px solid #e9ecef;
}
.wa-input-area:focus {
  outline: none;
}

.wa-preview-area {
  background-color: #f8f9fa;
  white-space: pre-wrap; /* Preserves line breaks */
  word-wrap: break-word;
}
.wa-preview-area .placeholder {
    color: #6c757d;
}

.wa-bold { font-weight: bold; }
.wa-italic { font-style: italic; }
.wa-strike { text-decoration: line-through; }
.wa-mono {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
  background-color: #e9ecef;
  padding: 0.1em 0.3em;
  border-radius: 3px;
  font-size: 90%;
}
`;

const WhatsappEditor = React.forwardRef(
  ({ value, onChange, placeholder, className }) => {
    const textareaRef = useRef(null);

    const wrapSelection = (symbol) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const before = value.slice(0, start);
      const selected = value.slice(start, end);
      const after = value.slice(end);

      const newValue = `${before}${symbol}${selected}${symbol}${after}`;
      onChange(newValue);

      // Reposition cursor after wrapping
      const newStart = start + symbol.length;
      const newEnd = end + symbol.length;

      requestAnimationFrame(() => {
        textarea.focus();
        textarea.setSelectionRange(newStart, newEnd);
      });
    };

    const formatted = parseMessage(value || "Nothing to preview");

    return (
      <>
        <style>{styles}</style>
        <div className={`wa-editor-wrapper ${className || ""}`}>
          <div className="wa-toolbar">
            {[
              { label: "B", symbol: "*" },
              { label: "I", symbol: "_" },
              { label: "S", symbol: "~" },
              { label: "<>", symbol: "`" },
            ].map((btn) => (
              <button
                type="button"
                key={btn.symbol}
                onClick={() => wrapSelection(btn.symbol)}
                style={styles.button}
              >
                <b>{btn.label}</b>
              </button>
            ))}
          </div>
          <div className="wa-main-content">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="wa-input-area"
            />

            <div className="wa-preview-area">
              {formatted.length > 0 ? (
                formatted.map((chunk, idx) => (
                  <span key={idx} className={getChunkClassName(chunk.style)}>
                    {chunk.text}
                  </span>
                ))
              ) : (
                <span className="placeholder">Nothing to preview</span>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
);

WhatsappEditor.displayName = "WhatsappEditor";

export default WhatsappEditor;
