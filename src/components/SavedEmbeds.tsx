import { useState, useEffect } from 'react';
import { Save, Trash2, Download, Plus } from 'lucide-react';
import { EmbedData } from '../types';

interface SavedEmbed {
  id: string;
  name: string;
  data: EmbedData;
  createdAt: string;
}

interface SavedEmbedsProps {
  embedData: EmbedData;
  setEmbedData: (data: EmbedData) => void;
}

export default function SavedEmbeds({ embedData, setEmbedData }: SavedEmbedsProps) {
  const [savedEmbeds, setSavedEmbeds] = useState<SavedEmbed[]>([]);
  const [embedName, setEmbedName] = useState('');
  const [showSave, setShowSave] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('saved_embeds');
    if (stored) {
      try {
        setSavedEmbeds(JSON.parse(stored));
      } catch (e) {
        console.error('Error loading embeds:', e);
      }
    }
  }, []);

  const saveEmbed = () => {
    if (!embedName.trim()) {
      alert('Por favor ingresa un nombre para el embed');
      return;
    }

    const newEmbed: SavedEmbed = {
      id: Date.now().toString(),
      name: embedName,
      data: embedData,
      createdAt: new Date().toLocaleDateString('es')
    };

    const updated = [...savedEmbeds, newEmbed];
    setSavedEmbeds(updated);
    localStorage.setItem('saved_embeds', JSON.stringify(updated));
    setEmbedName('');
    setShowSave(false);
  };

  const loadEmbed = (embed: SavedEmbed) => {
    setEmbedData(embed.data);
  };

  const deleteEmbed = (id: string) => {
    const updated = savedEmbeds.filter(e => e.id !== id);
    setSavedEmbeds(updated);
    localStorage.setItem('saved_embeds', JSON.stringify(updated));
  };

  return (
    <div className="bg-slate-800 rounded-lg p-4 sm:p-5 md:p-6 shadow-xl">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <Download className="text-blue-400" size={20} sm:size={24} />
        <h2 className="text-lg sm:text-xl font-bold text-white">Embeds Guardados</h2>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {savedEmbeds.length > 0 && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {savedEmbeds.map((embed) => (
              <div
                key={embed.id}
                className="flex items-center justify-between p-3 rounded bg-slate-700 hover:bg-slate-600 transition-colors"
              >
                <div
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => loadEmbed(embed)}
                >
                  <p className="text-white font-medium text-sm truncate">{embed.name}</p>
                  <p className="text-slate-400 text-xs">{embed.createdAt}</p>
                </div>
                <button
                  onClick={() => deleteEmbed(embed.id)}
                  className="text-red-400 hover:text-red-300 ml-2 flex-shrink-0"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}

        {!showSave ? (
          <button
            onClick={() => setShowSave(true)}
            className="w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 px-3 sm:px-4 rounded text-sm sm:text-base transition-colors"
          >
            <Save size={18} />
            Guardar Embed Actual
          </button>
        ) : (
          <div className="space-y-2 bg-slate-700 rounded p-3">
            <input
              type="text"
              value={embedName}
              onChange={(e) => setEmbedName(e.target.value)}
              className="w-full bg-slate-600 text-white rounded px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nombre del embed"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={saveEmbed}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded text-sm transition-colors"
              >
                Guardar
              </button>
              <button
                onClick={() => {
                  setShowSave(false);
                  setEmbedName('');
                }}
                className="flex-1 bg-slate-600 hover:bg-slate-500 text-white font-medium py-2 rounded text-sm transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {savedEmbeds.length === 0 && !showSave && (
          <p className="text-xs text-slate-400 text-center py-2">
            Guarda tus embeds favoritos para reutilizarlos
          </p>
        )}
      </div>
    </div>
  );
}
