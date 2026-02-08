import React, { useState, useEffect, useRef } from 'react';

interface ImageDialogProps {
  open: boolean;
  onSubmit: (src: string) => void;
  onClose: () => void;
}

export function ImageDialog({ open, onSubmit, onClose }: ImageDialogProps) {
  const [url, setUrl] = useState('');
  const [tab, setTab] = useState<'url' | 'upload'>('url');
  const inputRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setUrl('');
      setTab('url');
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onSubmit(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  if (!open) return null;

  return (
    <div className="rte-dialog-overlay" onMouseDown={onClose}>
      <div className="rte-dialog" onMouseDown={(e) => e.stopPropagation()}>
        <div className="rte-dialog-title">Insert Image</div>
        <div className="rte-dialog-tabs">
          <button
            type="button"
            className={`rte-dialog-tab ${tab === 'url' ? 'rte-dialog-tab--active' : ''}`}
            onClick={() => setTab('url')}
          >
            URL
          </button>
          <button
            type="button"
            className={`rte-dialog-tab ${tab === 'upload' ? 'rte-dialog-tab--active' : ''}`}
            onClick={() => setTab('upload')}
          >
            Upload
          </button>
        </div>
        {tab === 'url' ? (
          <>
            <input
              ref={inputRef}
              className="rte-dialog-input"
              type="url"
              placeholder="https://example.com/image.png"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && url) onSubmit(url);
                else if (e.key === 'Escape') onClose();
              }}
            />
            <div className="rte-dialog-actions">
              <button type="button" className="rte-dialog-btn" onClick={onClose}>
                Cancel
              </button>
              <button
                type="button"
                className="rte-dialog-btn rte-dialog-btn--primary"
                onClick={() => url && onSubmit(url)}
                disabled={!url}
              >
                Insert
              </button>
            </div>
          </>
        ) : (
          <>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="rte-dialog-input"
              onChange={handleFile}
            />
            <div className="rte-dialog-actions">
              <button type="button" className="rte-dialog-btn" onClick={onClose}>
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
