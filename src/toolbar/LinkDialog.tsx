import React, { useState, useEffect, useRef } from 'react';

interface LinkDialogProps {
  open: boolean;
  initialUrl: string;
  onSubmit: (url: string) => void;
  onRemove: () => void;
  onClose: () => void;
}

export function LinkDialog({ open, initialUrl, onSubmit, onRemove, onClose }: LinkDialogProps) {
  const [url, setUrl] = useState(initialUrl);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setUrl(initialUrl);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open, initialUrl]);

  if (!open) return null;

  return (
    <div className="rte-dialog-overlay" onMouseDown={onClose}>
      <div className="rte-dialog" onMouseDown={(e) => e.stopPropagation()}>
        <div className="rte-dialog-title">Insert Link</div>
        <input
          ref={inputRef}
          className="rte-dialog-input"
          type="url"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && url) {
              onSubmit(url);
            } else if (e.key === 'Escape') {
              onClose();
            }
          }}
        />
        <div className="rte-dialog-actions">
          {initialUrl && (
            <button type="button" className="rte-dialog-btn rte-dialog-btn--danger" onClick={onRemove}>
              Remove
            </button>
          )}
          <button type="button" className="rte-dialog-btn" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="rte-dialog-btn rte-dialog-btn--primary"
            onClick={() => url && onSubmit(url)}
            disabled={!url}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
