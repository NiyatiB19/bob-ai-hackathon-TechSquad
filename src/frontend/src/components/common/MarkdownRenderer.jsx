import React from 'react';

/**
 * Safely parses inline markdown tokens (**bold**, *italic*, `code`) into React elements.
 */
export function renderInlineMarkdown(text) {
  if (typeof text !== 'string') return text;

  const parts = [];
  let lastIndex = 0;
  const regex = new RegExp(/(\*\*.*?\*\*|\*.*?\*|`[^`]+`)/g);
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      const content = token.slice(2, -2);
      parts.push(
        <strong key={match.index} className="font-extrabold text-slate-900">
          {content}
        </strong>
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      const content = token.slice(1, -1);
      parts.push(
        <code key={match.index} className="bg-slate-200/80 px-1 py-0.5 rounded font-mono text-[11px] text-slate-800">
          {content}
        </code>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      const content = token.slice(1, -1);
      parts.push(
        <em key={match.index} className="italic">
          {content}
        </em>
      );
    } else {
      parts.push(token);
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

/**
 * Enterprise MarkdownRenderer component for rendering IBM Bob AI Assistant responses safely.
 */
export default function MarkdownRenderer({ content, className = '' }) {
  if (!content) return null;

  const lines = String(content).split('\n');
  const blocks = [];
  let currentList = null;

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    const bulletMatch = trimmed.match(/^[-*]\s+(.*)$/);
    const numberMatch = trimmed.match(/^\d+\.\s+(.*)$/);
    const headingMatch = trimmed.match(/^(#{1,3})\s+(.*)$/);

    if (bulletMatch) {
      if (!currentList || currentList.type !== 'ul') {
        if (currentList) blocks.push(currentList);
        currentList = { type: 'ul', items: [], key: `ul_${idx}` };
      }
      currentList.items.push(bulletMatch[1]);
    } else if (numberMatch) {
      if (!currentList || currentList.type !== 'ol') {
        if (currentList) blocks.push(currentList);
        currentList = { type: 'ol', items: [], key: `ol_${idx}` };
      }
      currentList.items.push(numberMatch[1]);
    } else {
      if (currentList) {
        blocks.push(currentList);
        currentList = null;
      }

      if (headingMatch) {
        blocks.push({
          type: 'heading',
          level: headingMatch[1].length,
          text: headingMatch[2],
          key: `h_${idx}`
        });
      } else if (trimmed.length > 0) {
        blocks.push({
          type: 'p',
          text: line,
          key: `p_${idx}`
        });
      } else {
        blocks.push({
          type: 'spacer',
          key: `space_${idx}`
        });
      }
    }
  });

  if (currentList) {
    blocks.push(currentList);
  }

  return (
    <div className={`space-y-1.5 ${className}`}>
      {blocks.map((block) => {
        if (block.type === 'ul') {
          return (
            <ul key={block.key} className="list-disc list-outside ml-4 space-y-1 my-1">
              {block.items.map((item, i) => (
                <li key={i} className="leading-relaxed">
                  {renderInlineMarkdown(item)}
                </li>
              ))}
            </ul>
          );
        }
        if (block.type === 'ol') {
          return (
            <ol key={block.key} className="list-decimal list-outside ml-4 space-y-1 my-1">
              {block.items.map((item, i) => (
                <li key={i} className="leading-relaxed">
                  {renderInlineMarkdown(item)}
                </li>
              ))}
            </ol>
          );
        }
        if (block.type === 'heading') {
          return (
            <h4 key={block.key} className="font-extrabold text-sm text-slate-900 mt-2 mb-1 font-heading">
              {renderInlineMarkdown(block.text)}
            </h4>
          );
        }
        if (block.type === 'p') {
          return (
            <p key={block.key} className="leading-relaxed my-0.5">
              {renderInlineMarkdown(block.text)}
            </p>
          );
        }
        return <div key={block.key} className="h-1" />;
      })}
    </div>
  );
}
