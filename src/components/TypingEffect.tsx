import React, { useEffect, useState, isValidElement, cloneElement } from 'react';
import type { ReactNode, ReactElement } from 'react';

interface TypingEffectProps {
  children: ReactNode;
  speed?: number;
  onComplete?: () => void;
  instant?: boolean;
}

const TypingEffect: React.FC<TypingEffectProps> = ({
  children,
  speed = 100,
  onComplete,
  instant = false,
}) => {
  const [displayedChars, setDisplayedChars] = useState(0);
  const [fullText, setFullText] = useState('');

  useEffect(() => {
    const extractText = (node: ReactNode): string => {
      if (typeof node === 'string') return node;
      if (Array.isArray(node)) return node.map(extractText).join('');
      if (isValidElement(node)) return extractText(node.props.children);
      return '';
    };

    setFullText(extractText(children));
  }, [children]);

  useEffect(() => {
    if (!fullText || instant) return; 

    let index = 0;
    const interval = setInterval(() => {
      setDisplayedChars((prev) => prev + 1);
      index++;
      if (index >= fullText.length) {
        clearInterval(interval);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [fullText, speed, onComplete, instant]);

  const getTextLength = (node: ReactNode): number => {
    if (typeof node === 'string') return node.length;
    if (Array.isArray(node)) return node.reduce((sum, child) => sum + getTextLength(child), 0);
    if (isValidElement(node)) return getTextLength(node.props.children);
    return 0;
  };

  const maskText = (node: ReactNode, remaining: number): ReactNode => {
    if (remaining <= 0) return null;

    if (typeof node === 'string') {
      return node.slice(0, remaining);
    }

    if (Array.isArray(node)) {
      const result: ReactNode[] = [];
      for (const child of node) {
        if (remaining <= 0) break;
        const textLen = getTextLength(child);
        result.push(maskText(child, remaining));
        remaining -= textLen;
      }
      return result;
    }

    if (isValidElement(node)) {
      const masked = maskText(node.props.children, remaining);
      return cloneElement(node as ReactElement, {
        children: masked,
      });
    }

    return null;
  };

  if (instant) {
    return <>{children}</>;
  }

  return <>{maskText(children, displayedChars)}</>;
};

export default TypingEffect;
