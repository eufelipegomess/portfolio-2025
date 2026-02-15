import React, { useEffect, useRef, useState } from 'react';
import { Bold, Italic, Underline, Heading1, Heading2, Type } from 'lucide-react';

interface RichTextEditorProps {
  initialContent: string;
  onChange: (content: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ initialContent, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState(initialContent);

  // Sync initial content only once on mount to avoid cursor jumping
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== initialContent) {
      editorRef.current.innerHTML = initialContent;
    }
  }, []);

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setContent(html);
      onChange(html);
    }
  };

  const execCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
        editorRef.current.focus();
    }
    handleInput();
  };

  return (
    <div className="w-full border border-gray-200 rounded-[4px] bg-white overflow-hidden flex flex-col transition-all focus-within:border-[#8C6EB7] focus-within:ring-1 focus-within:ring-[#8C6EB7]/30">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-gray-100 bg-gray-50/50">
        <ToolbarButton onClick={() => execCommand('formatBlock', '<h2>')} title="Título Principal">
            <Heading1 size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand('formatBlock', '<h3>')} title="Subtítulo">
            <Heading2 size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand('formatBlock', '<p>')} title="Parágrafo">
            <Type size={16} />
        </ToolbarButton>
        
        <div className="w-px h-4 bg-gray-300 mx-2"></div>

        <ToolbarButton onClick={() => execCommand('bold')} title="Negrito">
            <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand('italic')} title="Itálico">
            <Italic size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand('underline')} title="Sublinhado">
            <Underline size={16} />
        </ToolbarButton>
      </div>

      {/* Editor Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="rte-content w-full p-4 min-h-[120px] outline-none text-[#312E35] leading-relaxed"
        style={{
            minHeight: '150px'
        }}
      />
      <style>{`
        .rte-content:empty:before {
            content: 'Comece a escrever aqui...';
            color: #ccc;
            pointer-events: none;
        }
      `}</style>
    </div>
  );
};

const ToolbarButton: React.FC<{ onClick: () => void; children: React.ReactNode; title?: string }> = ({ onClick, children, title }) => (
    <button 
        type="button"
        onClick={(e) => { e.preventDefault(); onClick(); }}
        className="p-2 text-gray-500 hover:text-[#312E35] hover:bg-gray-200 rounded-[2px] transition-colors"
        title={title}
    >
        {children}
    </button>
);

export default RichTextEditor;