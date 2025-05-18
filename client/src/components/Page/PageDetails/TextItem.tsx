import { Link } from '@tanstack/react-router';
import { ReactNode } from 'react';

interface TextItemProps {
  text: string;
}
function TextItem(props: TextItemProps) {
  const result: ReactNode[] = [];
  const matches = [...props.text.matchAll(/\[\[([a-z0-9]+)\|([a-zA-Z0-9 ]+)\]\]/g)];

  let index = 0;
  matches.forEach((match) => {
    result.push(props.text.substring(index, match.index));
    result.push(<Link to={`/pages/$pageId`} params={{ pageId: match[1] }}>{ match[2] }</Link>);
    index = match.index + match[0].length;
  });

  result.push(props.text.substring(index));

  return result.map((text, index) => <span key={index}>{text}</span>);
}

export default TextItem;