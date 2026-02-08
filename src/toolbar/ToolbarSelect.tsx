import React from 'react';

interface ToolbarSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  title?: string;
}

export function ToolbarSelect({ value, onChange, options, title }: ToolbarSelectProps) {
  return (
    <select
      className="rte-toolbar-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      title={title}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
