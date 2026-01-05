import { useState } from 'react';
import { FileText, Plus, X, Bold, Italic, Underline, Strikethrough } from 'lucide-react';
import { EmbedData, EmbedField } from '../types';

interface EmbedEditorProps {
  embedData: EmbedData;
  setEmbedData: (data: EmbedData) => void;
}

export default function EmbedEditor({ embedData, setEmbedData }: EmbedEditorProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [descriptionRef, setDescriptionRef] = useState<HTMLTextAreaElement | null>(null);

  const applyFormatting = (before: string, after: string) => {
    if (!descriptionRef) return;

    const start = descriptionRef.selectionStart;
    const end = descriptionRef.selectionEnd;
    const text = embedData.description;
    const selectedText = text.substring(start, end) || 'texto';

    const newText = text.substring(0, start) + before + selectedText + after + text.substring(end);
    setEmbedData({ ...embedData, description: newText });

    setTimeout(() => {
      if (descriptionRef) {
        descriptionRef.selectionStart = start + before.length;
        descriptionRef.selectionEnd = start + before.length + selectedText.length;
        descriptionRef.focus();
      }
    }, 0);
  };

  const colorPresets = [
    { name: 'Verde', hex: '#00b894' },
    { name: 'Rojo', hex: '#d63031' },
    { name: 'Amarillo', hex: '#fdcb6e' },
    { name: 'Azul', hex: '#0984e3' },
    { name: 'Púrpura', hex: '#6c5ce7' },
    { name: 'Rosa', hex: '#e84393' }
  ];

  const addField = () => {
    setEmbedData({
      ...embedData,
      fields: [...embedData.fields, { name: '', value: '', inline: false }]
    });
  };

  const removeField = (index: number) => {
    setEmbedData({
      ...embedData,
      fields: embedData.fields.filter((_, i) => i !== index)
    });
  };

  const updateField = (index: number, field: EmbedField) => {
    const newFields = [...embedData.fields];
    newFields[index] = field;
    setEmbedData({ ...embedData, fields: newFields });
  };

  return (
    <div className="bg-slate-800 rounded-lg p-4 sm:p-5 md:p-6 shadow-xl">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <FileText className="text-blue-400" size={20} sm:size={24} />
        <h2 className="text-lg sm:text-xl font-bold text-white">Editor de Embed</h2>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div>
          <label className="block text-white font-medium mb-1 sm:mb-2 text-sm sm:text-base">
            Título
          </label>
          <input
            type="text"
            value={embedData.title}
            onChange={(e) => setEmbedData({ ...embedData, title: e.target.value })}
            className="w-full bg-slate-700 text-white rounded px-3 sm:px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Título del embed"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-white font-medium text-sm sm:text-base">
              Descripción
            </label>
            <div className="flex gap-1">
              <button
                onClick={() => applyFormatting('**', '**')}
                className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded text-xs"
                title="Negrita"
              >
                <Bold size={16} />
              </button>
              <button
                onClick={() => applyFormatting('*', '*')}
                className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded text-xs"
                title="Cursiva"
              >
                <Italic size={16} />
              </button>
              <button
                onClick={() => applyFormatting('__', '__')}
                className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded text-xs"
                title="Subrayado"
              >
                <Underline size={16} />
              </button>
              <button
                onClick={() => applyFormatting('~~', '~~')}
                className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded text-xs"
                title="Tachado"
              >
                <Strikethrough size={16} />
              </button>
            </div>
          </div>
          <textarea
            ref={setDescriptionRef}
            value={embedData.description}
            onChange={(e) => setEmbedData({ ...embedData, description: e.target.value })}
            className="w-full bg-slate-700 text-white rounded px-3 sm:px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Descripción del embed (soporta markdown)"
          />
        </div>

        <div>
          <label className="block text-white font-medium mb-2 text-sm sm:text-base">
            Color del Borde
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
            {colorPresets.map((color) => (
              <button
                key={color.hex}
                onClick={() => setEmbedData({ ...embedData, color: color.hex })}
                className={`h-10 rounded border-2 transition-all ${
                  embedData.color === color.hex
                    ? 'border-white scale-110'
                    : 'border-transparent hover:border-slate-400'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="color"
              value={embedData.color}
              onChange={(e) => setEmbedData({ ...embedData, color: e.target.value })}
              className="h-10 w-16 sm:w-20 bg-slate-700 rounded cursor-pointer flex-shrink-0"
            />
            <input
              type="text"
              value={embedData.color}
              onChange={(e) => setEmbedData({ ...embedData, color: e.target.value })}
              className="flex-1 bg-slate-700 text-white rounded px-3 sm:px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="#5865F2"
            />
          </div>
        </div>

        <div>
          <label className="block text-white font-medium mb-1 sm:mb-2 text-sm sm:text-base">
            URL de Imagen Grande
          </label>
          <input
            type="text"
            value={embedData.image}
            onChange={(e) => setEmbedData({ ...embedData, image: e.target.value })}
            className="w-full bg-slate-700 text-white rounded px-3 sm:px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://..."
          />
        </div>

        <div className="border-t border-slate-700 pt-3 sm:pt-4">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-white font-medium text-sm sm:text-base">
                Campos (Fields)
              </label>
              <button
                onClick={addField}
                className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm"
              >
                <Plus size={14} sm:size={16} />
                Campo
              </button>
            </div>

            {embedData.fields.map((field, index) => (
              <div key={index} className="bg-slate-700 rounded p-3 mb-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white text-sm">Campo {index + 1}</span>
                  <button
                    onClick={() => removeField(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <X size={18} />
                  </button>
                </div>
                <input
                  type="text"
                  value={field.name}
                  onChange={(e) => updateField(index, { ...field, name: e.target.value })}
                  className="w-full bg-slate-600 text-white rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nombre del campo"
                />
                <textarea
                  value={field.value}
                  onChange={(e) => updateField(index, { ...field, value: e.target.value })}
                  className="w-full bg-slate-600 text-white rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="Valor del campo"
                />
                <label className="flex items-center gap-2 text-white cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={field.inline}
                    onChange={(e) => updateField(index, { ...field, inline: e.target.checked })}
                    className="w-4 h-4"
                  />
                  En línea
                </label>
              </div>
            ))}
          </div>

        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-blue-400 hover:text-blue-300 text-xs sm:text-sm font-medium mt-3"
        >
          {showAdvanced ? '- Opciones avanzadas' : '+ Opciones avanzadas'}
        </button>

        {showAdvanced && (
          <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4 border-t border-slate-700">

            <div>
              <label className="block text-white font-medium mb-1 sm:mb-2 text-sm sm:text-base">
                Texto del Footer
              </label>
              <input
                type="text"
                value={embedData.footer.text}
                onChange={(e) => setEmbedData({
                  ...embedData,
                  footer: { ...embedData.footer, text: e.target.value }
                })}
                className="w-full bg-slate-700 text-white rounded px-3 sm:px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Texto del footer"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-1 sm:mb-2 text-sm sm:text-base">
                URL del Icono del Footer
              </label>
              <input
                type="text"
                value={embedData.footer.iconUrl}
                onChange={(e) => setEmbedData({
                  ...embedData,
                  footer: { ...embedData.footer, iconUrl: e.target.value }
                })}
                className="w-full bg-slate-700 text-white rounded px-3 sm:px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://..."
              />
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
