import { Plus, X, MousePointerClick, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { ButtonData } from '../types';

interface ButtonGeneratorProps {
  buttons: ButtonData[];
  setButtons: (buttons: ButtonData[]) => void;
}

export default function ButtonGenerator({ buttons, setButtons }: ButtonGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
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
    <div className="bg-slate-800 rounded-lg p-3 sm:p-4 shadow-xl">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 px-3 rounded text-sm transition-colors"
      >
        <div className="flex items-center gap-2">
          <MousePointerClick size={18} />
          <span>Botones {buttons.length > 0 && `(${buttons.length})`}</span>
        </div>
        <ChevronDown size={18} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="mt-2 space-y-2 sm:space-y-3">
          <button
            onClick={addCustomButton}
            className="w-full flex items-center justify-center gap-1 bg-slate-700 hover:bg-slate-600 text-white font-medium py-1 px-2 rounded text-xs sm:text-sm transition-colors"
          >
            <Plus size={14} />
            Agregar
          </button>

          {buttons.map((button, index) => (
            <div key={index} className="bg-slate-700 rounded p-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-white font-medium text-xs">Botón {index + 1}</span>
                <button
                  onClick={() => removeButton(index)}
                  className="text-red-400 hover:text-red-300"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="space-y-1">
                <input
                  type="text"
                  value={button.label}
                  onChange={(e) => updateButton(index, { ...button, label: e.target.value })}
                  className="w-full bg-slate-600 text-white rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Texto"
                />
                <select
                  value={button.style}
                  onChange={(e) => updateButton(index, { ...button, style: Number(e.target.value) })}
                  className="w-full bg-slate-600 text-white rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={1}>Azul</option>
                  <option value={3}>Verde</option>
                  <option value={4}>Rojo</option>
                </select>
                <input
                  type="text"
                  value={button.url || ''}
                  onChange={(e) => updateButton(index, { ...button, url: e.target.value })}
                  className="w-full bg-slate-600 text-white rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="URL"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
