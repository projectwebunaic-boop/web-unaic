"use client";

import { useState, useEffect } from 'react';

export type CursorType = "normal" | "large" | "xlarge";

export const useCursor = () => {
  const [cursorType, setCursorType] = useState<CursorType>("normal");

  useEffect(() => {
    // Remove all cursor classes first
    document.body.classList.remove("cursor-normal", "cursor-large", "cursor-xlarge");

    // Add the current cursor class
    document.body.classList.add(`cursor-${cursorType}`);

    // Cleanup function to remove cursor class when component unmounts
    return () => {
      document.body.classList.remove("cursor-normal", "cursor-large", "cursor-xlarge");
    };
  }, [cursorType]);

  const setCursor = (type: CursorType) => {
    setCursorType(type);
  };

  return {
    cursorType,
    setCursor,
    setNormalCursor: () => setCursor("normal"),
    setLargeCursor: () => setCursor("large"),
    setXLargeCursor: () => setCursor("xlarge"),
  };
};
