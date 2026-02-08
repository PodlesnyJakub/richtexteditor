// Components
export { RichTextEditor } from './editor/RichTextEditor';
export { PreviewMode } from './preview/PreviewMode';

// Types
export type {
  RichTextEditorProps,
  RichTextEditorRef,
  PreviewModeProps,
  PageFormat,
  PageDimensions,
} from './types';

// Constants
export { PAGE_FORMATS, PAGE_GAP } from './constants';

// PDF utilities
export { exportPdf } from './pdf/exportPdf';
export { printPdf } from './pdf/printPdf';

// Styles — users import via '@jpo/richtext-editor/styles.css'
import './styles/editor.css';
import './styles/toolbar.css';
import './styles/pagination.css';
import './styles/preview.css';
import './styles/print.css';
