import { Plus, X, MousePointerClick } from 'lucide-react';
import { ButtonData } from '../types';

interface ButtonGeneratorProps {
  buttons: ButtonData[];
  setButtons: (buttons: ButtonData[]) => void;
}

export default function ButtonGenerator({ buttons, setButtons }: ButtonGeneratorProps) {
  const addCustomButton = () => {
    if (buttons.length >= 5) {
      alert('Máximo 5 botones permitidos');
      return;
    }
    setButtons([
      ...buttons,
      { label: 'Nuevo Botón', style: 5, url: 'https://example.com' }
    ]);
  };

  const addPresetButton = (preset: 'positive' | 'rebalance' | 'disabled') => {
    if (buttons.length >= 5) {
      alert('Máximo 5 botones permitidos');
      return;
    }

    const presets = {
      positive: {
        label: 'Actualización Positiva',
        style: 3,
        url: 'https://example.com/positive'
      },
      rebalance: {
        label: 'Actualización De Rebalanceo',
        style: 1,
        url: 'https://example.com/rebalance'
      },
      disabled: {
        label: 'Actualización Desactivada',
        style: 4,
        url: 'https://example.com/disabled'
      }
    };

    setButtons([...buttons, presets[preset]]);
  };

  const removeButton = (index: number) => {
    setButtons(buttons.filter((_, i) => i !== index));
  };

  const updateButton = (index: number, button: ButtonData) => {
    const newButtons = [...buttons];
    newButtons[index] = button;
    setButtons(newButtons);
  };

  const styleNames = {
    1: 'Azul (Primary)',
    2: 'Gris (Secondary)',
    3: 'Verde (Success)',
    4: 'Rojo (Danger)',
    5: 'Link (Gris)'
  };

  return (
    <div className="bg-slate-800 rounded-lg p-4 sm:p-5 md:p-6 shadow-xl">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <MousePointerClick className="text-blue-400" size={20} sm:size={24} />
        <h2 className="text-lg sm:text-xl font-bold text-white">Botones</h2>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <button
          onClick={addCustomButton}
          className="w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 px-3 sm:px-4 rounded text-sm sm:text-base transition-colors"
        >
          <Plus size={18} />
          Agregar Botón
        </button>

        {buttons.length > 0 && (
          <div className="space-y-3 pt-3 sm:pt-4 border-t border-slate-700">
            {buttons.map((button, index) => (
              <div key={index} className="bg-slate-700 rounded p-3 sm:p-4">
                <div className="flex justify-between items-center mb-2 sm:mb-3">
                  <span className="text-white font-medium text-xs sm:text-sm">Botón {index + 1}</span>
                  <button
                    onClick={() => removeButton(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    value={button.label}
                    onChange={(e) => updateButton(index, { ...button, label: e.target.value })}
                    className="w-full bg-slate-600 text-white rounded px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Texto del botón"
                  />

                  <select
                    value={button.style}
                    onChange={(e) => updateButton(index, { ...button, style: Number(e.target.value) })}
                    className="w-full bg-slate-600 text-white rounded px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={1}>Azul (Primary)</option>
                    <option value={2}>Gris (Secondary)</option>
                    <option value={3}>Verde (Success)</option>
                    <option value={4}>Rojo (Danger)</option>
                    <option value={5}>Link (Gris)</option>
                  </select>

                  <input
                    type="text"
                    value={button.url || ''}
                    onChange={(e) => updateButton(index, { ...button, url: e.target.value })}
                    className="w-full bg-slate-600 text-white rounded px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="URL del botón (https://...)"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-slate-400">
          Puedes agregar hasta 5 botones. Los botones son clickeables y redirigen a URLs.
        </p>
      </div>
    </div>
  );
}
