import { useEffect, useRef, useState } from "react";

export default function CustomCursorEditor({ text, cursorPosition, selection, fontSize, editorScrollTop }) {
  const cursorRef = useRef(null);
  const [cursorStyle, setCursorStyle] = useState({});
  
  // Smooth position update using requestAnimationFrame
  useEffect(() => {
    let frame;
    const updateCursor = () => {
      const lineHeight = fontSize * 1.5; // adjust for your editor line height
      const charWidth = getCharWidth(" ", fontSize); // dynamically measured
      
      const targetLeft = 16 + (cursorPosition.col - 1) * charWidth;
      const targetTop = (cursorPosition.line - 1) * lineHeight + 18 - editorScrollTop;

      setCursorStyle({
        transform: `translate(${targetLeft}px, ${targetTop}px)`,
        height: `${fontSize * 1.2}px`,
        opacity: selection.start === selection.end ? 1 : 0,
      });

      frame = requestAnimationFrame(updateCursor);
    };

    frame = requestAnimationFrame(updateCursor);
    return () => cancelAnimationFrame(frame);
  }, [cursorPosition, selection, fontSize, editorScrollTop]);

  return (
    <div className="relative">
      {/* Editor content here */}
      
      {/* Custom Cursor */}
      <div
        ref={cursorRef}
        className="absolute w-[2px] bg-white animate-pulse pointer-events-none transition-transform duration-75 ease-out"
        style={cursorStyle}
      />
    </div>
  );
}

// --- Utility: measure character width precisely ---
function getCharWidth(char, fontSize) {
  const canvas = getCharWidth.canvas || (getCharWidth.canvas = document.createElement("canvas"));
  const ctx = canvas.getContext("2d");
  ctx.font = `${fontSize}px monospace`;
  return ctx.measureText(char).width;
}