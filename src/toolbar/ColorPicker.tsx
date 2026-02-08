import React, { useState, useRef, useEffect } from 'react';

interface ColorPickerProps {
  currentColor: string | null;
  onSelect: (color: string) => void;
  onClear: () => void;
  title: string;
  children: React.ReactNode;
}

const COLORS = [
  '#000000', '#434343', '#666666', '#999999', '#cccccc', '#efefef', '#f3f3f3', '#ffffff',
  '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#9900ff', '#ff00ff',
  '#e6b8af', '#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3', '#d0e0e3', '#c9daf8', '#d9d2e9',
  '#dd7e6b', '#ea9999', '#f9cb9c', '#ffe599', '#b6d7a8', '#a2c4c9', '#a4c2f4', '#b4a7d6',
  '#cc4125', '#e06666', '#f6b26b', '#ffd966', '#93c47d', '#76a5af', '#6d9eeb', '#8e7cc3',
  '#a61c00', '#cc0000', '#e69138', '#f1c232', '#6aa84f', '#45818e', '#3c78d8', '#674ea7',
  '#85200c', '#990000', '#b45f06', '#bf9000', '#38761d', '#134f5c', '#1155cc', '#351c75',
];

export function ColorPicker({ currentColor, onSelect, onClear, title, children }: ColorPickerProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div className="rte-color-picker" ref={containerRef}>
      <button
        type="button"
        className="rte-toolbar-btn"
        onClick={() => setOpen(!open)}
        title={title}
      >
        {children}
        {currentColor && (
          <span
            className="rte-color-indicator"
            style={{ backgroundColor: currentColor }}
          />
        )}
      </button>
      {open && (
        <div className="rte-color-popover">
          <div className="rte-color-grid">
            {COLORS.map((color) => (
              <button
                key={color}
                type="button"
                className="rte-color-swatch"
                style={{ backgroundColor: color }}
                onClick={() => {
                  onSelect(color);
                  setOpen(false);
                }}
                title={color}
              />
            ))}
          </div>
          <button
            type="button"
            className="rte-color-clear"
            onClick={() => {
              onClear();
              setOpen(false);
            }}
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
