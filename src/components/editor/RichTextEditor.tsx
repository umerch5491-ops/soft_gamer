'use client';

import { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import {
  Heading2,
  Heading3,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  RotateCcw,
  RotateCw,
  Eye,
  Edit3,
} from 'lucide-react';
import { MediaPickerModal } from '@/components/admin/MediaPickerModal';
import { ArticleContent } from '@/components/articles/ArticleContent';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[#38BDF8] underline hover:text-[#8B5CF6] transition-colors',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-xl max-w-full h-auto my-4 border border-[#272B3A]',
        },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          'min-h-[360px] p-5 text-[#F8FAFC] text-base leading-relaxed focus:outline-hidden prose prose-invert max-w-none focus:ring-0',
      },
    },
    onUpdate: ({ editor }) => {
      // Return HTML format compatible with rendering
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  if (!editor) {
    return (
      <div className="min-h-[360px] rounded-xl bg-[#111522] border border-[#272B3A] p-5 flex items-center justify-center text-[#A1A1AA] text-sm animate-pulse">
        Initializing Rich Text Editor...
      </div>
    );
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter link URL (e.g. https://...):', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const handleInsertImage = (url: string, altText?: string) => {
    editor.chain().focus().setImage({ src: url, alt: altText || '' }).run();
  };

  // Metrics
  const textContent = editor.getText();
  const wordCount = textContent.trim() ? textContent.trim().split(/\s+/).length : 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="rounded-xl border border-[#272B3A] bg-[#111522] overflow-hidden flex flex-col">
      {/* Top Bar: Tabs & Toolbar */}
      <div className="flex flex-wrap items-center justify-between p-2.5 bg-[#171C2B] border-b border-[#272B3A] gap-2">
        {/* Editor vs Preview Mode Switch */}
        <div className="flex items-center gap-1 bg-[#111522] p-1 rounded-lg border border-[#272B3A]">
          <button
            type="button"
            onClick={() => setActiveTab('editor')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              activeTab === 'editor'
                ? 'bg-[#8B5CF6] text-white shadow-sm'
                : 'text-[#A1A1AA] hover:text-[#F8FAFC]'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Editor</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              activeTab === 'preview'
                ? 'bg-[#8B5CF6] text-white shadow-sm'
                : 'text-[#A1A1AA] hover:text-[#F8FAFC]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Preview</span>
          </button>
        </div>

        {/* Action Controls (Active when Editor is selected) */}
        {activeTab === 'editor' && (
          <div className="flex flex-wrap items-center gap-1">
            {/* Headings */}
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`p-1.5 rounded-md text-xs font-bold transition-colors ${
                editor.isActive('heading', { level: 2 })
                  ? 'bg-[#8B5CF6] text-white'
                  : 'text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-[#111522]'
              }`}
              title="Heading 2"
            >
              <Heading2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={`p-1.5 rounded-md text-xs font-bold transition-colors ${
                editor.isActive('heading', { level: 3 })
                  ? 'bg-[#8B5CF6] text-white'
                  : 'text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-[#111522]'
              }`}
              title="Heading 3"
            >
              <Heading3 className="w-4 h-4" />
            </button>

            <span className="w-px h-5 bg-[#272B3A] mx-1" />

            {/* Bold / Italic */}
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-1.5 rounded-md transition-colors ${
                editor.isActive('bold')
                  ? 'bg-[#8B5CF6] text-white'
                  : 'text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-[#111522]'
              }`}
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-1.5 rounded-md transition-colors ${
                editor.isActive('italic')
                  ? 'bg-[#8B5CF6] text-white'
                  : 'text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-[#111522]'
              }`}
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>

            <span className="w-px h-5 bg-[#272B3A] mx-1" />

            {/* Lists */}
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-1.5 rounded-md transition-colors ${
                editor.isActive('bulletList')
                  ? 'bg-[#8B5CF6] text-white'
                  : 'text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-[#111522]'
              }`}
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-1.5 rounded-md transition-colors ${
                editor.isActive('orderedList')
                  ? 'bg-[#8B5CF6] text-white'
                  : 'text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-[#111522]'
              }`}
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </button>

            {/* Quote */}
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`p-1.5 rounded-md transition-colors ${
                editor.isActive('blockquote')
                  ? 'bg-[#8B5CF6] text-white'
                  : 'text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-[#111522]'
              }`}
              title="Blockquote"
            >
              <Quote className="w-4 h-4" />
            </button>

            <span className="w-px h-5 bg-[#272B3A] mx-1" />

            {/* Link & Media */}
            <button
              type="button"
              onClick={setLink}
              className={`p-1.5 rounded-md transition-colors ${
                editor.isActive('link')
                  ? 'bg-[#8B5CF6] text-white'
                  : 'text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-[#111522]'
              }`}
              title="Insert Link"
            >
              <LinkIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setMediaPickerOpen(true)}
              className="p-1.5 rounded-md text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-[#111522] transition-colors"
              title="Insert Image from Media Library"
            >
              <ImageIcon className="w-4 h-4 text-[#38BDF8]" />
            </button>

            <span className="w-px h-5 bg-[#272B3A] mx-1" />

            {/* Undo / Redo */}
            <button
              type="button"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className="p-1.5 rounded-md text-[#A1A1AA] hover:text-[#F8FAFC] disabled:opacity-30 disabled:hover:bg-transparent"
              title="Undo"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className="p-1.5 rounded-md text-[#A1A1AA] hover:text-[#F8FAFC] disabled:opacity-30 disabled:hover:bg-transparent"
              title="Redo"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Word count & Reading stats */}
        <div className="flex items-center gap-3 text-xs text-[#A1A1AA]">
          <span>{wordCount} words</span>
          <span>•</span>
          <span>~{readTime} min read</span>
        </div>
      </div>

      {/* Editor Body or Preview Body */}
      {activeTab === 'editor' ? (
        <EditorContent editor={editor} />
      ) : (
        <div className="p-6 bg-[#090B12] min-h-[360px] overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            <span className="text-xs uppercase font-bold tracking-wider text-[#8B5CF6] block mb-4">
              [Preview Rendering in Soft Gamer Typography]
            </span>
            <ArticleContent content={editor.getText()} />
          </div>
        </div>
      )}

      {/* Embedded Media Picker */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onSelect={handleInsertImage}
        onClose={() => setMediaPickerOpen(false)}
      />
    </div>
  );
}

