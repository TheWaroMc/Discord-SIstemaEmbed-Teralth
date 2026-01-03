import { useState } from 'react';
import { Clock, Copy, Check } from 'lucide-react';

export default function HammertimeSection() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('12:00');
  const [format, setFormat] = useState('f');
  const [copied, setCopied] = useState(false);

  const formats = [
    { value: 't', label: 'Hora corta', example: '16:20' },
    { value: 'T', label: 'Hora larga', example: '16:20:30' },
    { value: 'd', label: 'Fecha corta', example: '20/04/2021' },
    { value: 'D', label: 'Fecha larga', example: '20 de abril de 2021' },
    { value: 'f', label: 'Fecha y hora corta', example: '20 de abril de 2021 16:20' },
    { value: 'F', label: 'Fecha y hora larga', example: 'martes, 20 de abril de 2021 16:20' },
    { value: 'R', label: 'Relativo', example: 'hace 2 meses' }
  ];

  const generateTimestamp = () => {
    if (!date) return '';
    const datetime = new Date(`${date}T${time}`);
    const timestamp = Math.floor(datetime.getTime() / 1000);
    return `<t:${timestamp}:${format}>`;
  };

  const copyToClipboard = () => {
    const timestamp = generateTimestamp();
    if (timestamp) {
      navigator.clipboard.writeText(timestamp);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const timestamp = generateTimestamp();

  return (
    <div className="bg-slate-800 rounded-lg p-4 sm:p-5 md:p-6 shadow-xl">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <Clock className="text-blue-400" size={20} sm:size={24} />
        <h2 className="text-lg sm:text-xl font-bold text-white">Hammertime - Timestamps</h2>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <p className="text-slate-300 text-xs sm:text-sm">
          Genera timestamps dinámicos que se ajustan automáticamente a la zona horaria de cada usuario.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-white font-medium mb-1 sm:mb-2 text-sm sm:text-base">
              Fecha
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-700 text-white rounded px-3 sm:px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-1 sm:mb-2 text-sm sm:text-base">
              Hora
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full bg-slate-700 text-white rounded px-3 sm:px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-white font-medium mb-1 sm:mb-2 text-sm sm:text-base">
            Formato
          </label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="w-full bg-slate-700 text-white rounded px-3 sm:px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {formats.map((fmt) => (
              <option key={fmt.value} value={fmt.value}>
                {fmt.label} - {fmt.example}
              </option>
            ))}
          </select>
        </div>

        {timestamp && (
          <div>
            <label className="block text-white font-medium mb-1 sm:mb-2 text-sm sm:text-base">
              Código Generado
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={timestamp}
                readOnly
                className="flex-1 bg-slate-700 text-white rounded px-3 sm:px-4 py-2 focus:outline-none font-mono text-xs sm:text-sm"
              />
              <button
                onClick={copyToClipboard}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 sm:px-4 py-2 rounded flex items-center justify-center gap-2 text-sm transition-colors flex-shrink-0"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
                {copied ? 'Copiado' : 'Copiar'}
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-1 sm:mt-2">
              Pega este código en la descripción o campos del embed
            </p>
          </div>
        )}

        <div className="bg-slate-700 rounded p-3 sm:p-4">
          <p className="text-xs sm:text-xs text-slate-300">
            <strong>Tip:</strong> Los timestamps de Discord se muestran automáticamente en la zona horaria local de cada usuario.
            Perfecto para eventos, recordatorios o fechas importantes.
          </p>
        </div>
      </div>
    </div>
  );
}
