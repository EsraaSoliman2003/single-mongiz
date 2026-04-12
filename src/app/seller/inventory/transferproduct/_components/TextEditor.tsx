"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/rtk/store';
import { setField } from '@/rtk/slices/ui/ProductSlice';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List, ListOrdered, Heading2 } from 'lucide-react';

export default function Description() {
    const t = useTranslations('addProduct');
    const dispatch = useDispatch();
    const description = useSelector((state: RootState) => state.productDraft.description);

    const editor = useEditor({
        extensions: [StarterKit],
        content: description,
        onUpdate: ({ editor }) => {
            dispatch(setField({ key: 'description', value: editor.getHTML() }));
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4',
            },
        },
        immediatelyRender: false, // ← Fixes SSR hydration error
    });

    if (!editor) {
        return null;
    }

    return (
        <section className="bg-white p-6 lg:p-8 w-full border border-gray-200">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200">
                <h3 className="text-2xl font-bold text-main bg-clip-text text-transparent">
                    {t('description.title') || 'Description'}
                </h3>
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap gap-1 mb-2 p-2 border border-gray-200 bg-gray-50">
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
                >
                    <Bold className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
                >
                    <Italic className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}`}
                >
                    <Heading2 className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
                >
                    <List className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}
                >
                    <ListOrdered className="w-4 h-4" />
                </button>
            </div>

            {/* Editor */}
            <EditorContent editor={editor} className="border border-gray-300" />
        </section>
    );
}