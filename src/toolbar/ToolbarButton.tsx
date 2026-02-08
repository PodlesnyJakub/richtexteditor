import React from 'react';
import { classNames } from '../utils/classNames';

interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title?: string;
  children: React.ReactNode;
}

export function ToolbarButton({
  onClick,
  active = false,
  disabled = false,
  title,
  children,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      className={classNames('rte-toolbar-btn', active && 'rte-toolbar-btn--active')}
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      {children}
    </button>
  );
}
