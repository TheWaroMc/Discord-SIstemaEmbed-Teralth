import { useState, useEffect } from 'react';
import { Webhook, Plus, Trash2 } from 'lucide-react';
import { WebhookData } from '../types';

interface WebhookConfigProps {
  webhookData: WebhookData;
  setWebhookData: (data: WebhookData) => void;
}

interface SavedWebhook {
  id: string;
  name: string;
  url: string;
}

export default function WebhookConfig({ webhookData, setWebhookData }: WebhookConfigProps) {
  const [savedWebhooks, setSavedWebhooks] = useState<SavedWebhook[]>([]);
  const [webhookName, setWebhookName] = useState('');
  const [showNewWebhook, setShowNewWebhook] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('webhooks');
    if (stored) {
      try {
        setSavedWebhooks(JSON.parse(stored));
      } catch (e) {
        console.error('Error loading webhooks:', e);
      }
    }
  }, []);

  const saveWebhook = () => {
    if (!webhookData.url || !webhookName.trim()) {
      alert('Por favor completa el nombre y URL');
      return;
    }

    const newWebhook: SavedWebhook = {
      id: Date.now().toString(),
      name: webhookName,
      url: webhookData.url
    };

    const updated = [...savedWebhooks, newWebhook];
    setSavedWebhooks(updated);
    localStorage.setItem('webhooks', JSON.stringify(updated));
    setWebhookName('');
    setShowNewWebhook(false);
  };

  const deleteWebhook = (id: string) => {
    const updated = savedWebhooks.filter(w => w.id !== id);
    setSavedWebhooks(updated);
    localStorage.setItem('webhooks', JSON.stringify(updated));
  };

  const selectWebhook = (url: string) => {
    setWebhookData({ ...webhookData, url });
  };

  return (
    <div className="bg-slate-800 rounded-lg p-3 sm:p-4 shadow-xl">
      <div className="flex items-center gap-2 mb-2 sm:mb-3">
        <Webhook className="text-blue-400" size={18} />
        <h2 className="text-base sm:text-lg font-bold text-white">Webhook</h2>
      </div>

      <div className="space-y-2 sm:space-y-3">
        {savedWebhooks.length > 0 && (
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {savedWebhooks.map((webhook) => (
              <div
                key={webhook.id}
                className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors text-xs ${
                  webhookData.url === webhook.url
                    ? 'bg-blue-600/20 border border-blue-500'
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
                onClick={() => selectWebhook(webhook.url)}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{webhook.name}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteWebhook(webhook.id);
                  }}
                  className="text-red-400 hover:text-red-300 ml-1 flex-shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {!showNewWebhook ? (
          <button
            onClick={() => setShowNewWebhook(true)}
            className="w-full flex items-center justify-center gap-1 bg-slate-700 hover:bg-slate-600 text-white font-medium py-1 px-2 rounded text-xs transition-colors"
          >
            <Plus size={14} />
            Agregar
          </button>
        ) : (
          <div className="space-y-2 bg-slate-700 rounded p-2">
            <input
              type="text"
              value={webhookName}
              onChange={(e) => setWebhookName(e.target.value)}
              className="w-full bg-slate-600 text-white rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nombre"
            />
            <input
              type="text"
              value={webhookData.url}
              onChange={(e) => setWebhookData({ ...webhookData, url: e.target.value })}
              className="w-full bg-slate-600 text-white rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="URL"
            />
            <div className="flex gap-1">
              <button
                onClick={saveWebhook}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-1 rounded text-xs transition-colors"
              >
                Guardar
              </button>
              <button
                onClick={() => {
                  setShowNewWebhook(false);
                  setWebhookName('');
                }}
                className="flex-1 bg-slate-600 hover:bg-slate-500 text-white font-medium py-1 rounded text-xs transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
