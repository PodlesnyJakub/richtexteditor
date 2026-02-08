import React from 'react';
import { usePreviewPagination } from './usePreviewPagination';
import { PAGE_FORMATS } from '../constants';
import { classNames } from '../utils/classNames';
import type { PreviewModeProps } from '../types';

export function PreviewMode({ content, pageFormat = 'a4', className }: PreviewModeProps) {
  const pages = usePreviewPagination(content, pageFormat);
  const dims = PAGE_FORMATS[pageFormat];

  return (
    <div className={classNames('rte-preview', className)}>
      {pages.map((page, index) => (
        <div key={index} className="rte-preview__page-wrapper">
          <div
            className="rte-preview__page"
            style={{
              width: dims.width,
              minHeight: dims.height,
              paddingTop: dims.margin.top,
              paddingBottom: dims.margin.bottom,
              paddingLeft: dims.margin.left,
              paddingRight: dims.margin.right,
            }}
            dangerouslySetInnerHTML={{ __html: page.html }}
          />
          <div className="rte-preview__page-number">
            {index + 1} / {pages.length}
          </div>
        </div>
      ))}
    </div>
  );
}
