import React from 'react';

type HighlightProps = {
  text: string;
  indices: readonly [number, number][];
};

export function Highlight({ text, indices }: HighlightProps) {
  if (!indices || indices.length === 0) {
    return <span>{text}</span>;
  }

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  indices.forEach(([start, end]) => {
    // Add the text part before the match
    if (start > lastIndex) {
      parts.push(<span key={`unmatched-${lastIndex}`}>{text.substring(lastIndex, start)}</span>);
    }
    // Add the matched part
    parts.push(
      <mark key={`matched-${start}`} className="bg-yellow-200 dark:bg-yellow-500 text-black rounded-sm px-0.5">
        {text.substring(start, end + 1)}
      </mark>
    );
    lastIndex = end + 1;
  });

  // Add the remaining text part after the last match
  if (lastIndex < text.length) {
    parts.push(<span key={`unmatched-${lastIndex}`}>{text.substring(lastIndex)}</span>);
  }

  return <span>{parts}</span>;
}
