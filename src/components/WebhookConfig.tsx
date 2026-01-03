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
    <div className="bg-slate-800 rounded-lg p-4 sm:p-5 md:p-6 shadow-xl">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <Webhook className="text-blue-400" size={20} sm:size={24} />
        <h2 className="text-lg sm:text-xl font-bold text-white">Webhook</h2>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {savedWebhooks.length > 0 && (
          <div>
            <label className="block text-white font-medium mb-2 text-sm sm:text-base">
              Mis Webhooks
            </label>
            <div className="space-y-2">
              {savedWebhooks.map((webhook) => (
                <div
                  key={webhook.id}
                  className={`flex items-center justify-between p-3 rounded cursor-pointer transition-colors ${
                    webhookData.url === webhook.url
                      ? 'bg-blue-600/20 border border-blue-500'
                      : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                  onClick={() => selectWebhook(webhook.url)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">{webhook.name}</p>
                    <p className="text-slate-400 text-xs truncate">{webhook.url}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteWebhook(webhook.id);
                    }}
                    className="text-red-400 hover:text-red-300 ml-2 flex-shrink-0"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {!showNewWebhook ? (
          <button
            onClick={() => setShowNewWebhook(true)}
            className="w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 px-3 sm:px-4 rounded text-sm sm:text-base transition-colors"
          >
            <Plus size={18} />
            Agregar Webhook
          </button>
        ) : (
          <div className="space-y-3 bg-slate-700 rounded p-3">
            <div>
              <label className="block text-white font-medium mb-1 sm:mb-2 text-sm sm:text-base">
                Nombre del Webhook
              </label>
              <input
                type="text"
                value={webhookName}
                onChange={(e) => setWebhookName(e.target.value)}
                className="w-full bg-slate-600 text-white rounded px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Mi servidor, Anuncios, etc."
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-1 sm:mb-2 text-sm sm:text-base">
                URL del Webhook *
              </label>
              <input
                type="text"
                value={webhookData.url}
                onChange={(e) => setWebhookData({ ...webhookData, url: e.target.value })}
                className="w-full bg-slate-600 text-white rounded px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://discord.com/api/webhooks/..."
              />
              <p className="text-xs text-slate-400 mt-1">
                Obtén tu webhook desde: Configuración del Canal → Integraciones → Webhooks
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={saveWebhook}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded text-sm transition-colors"
              >
                Guardar
              </button>
              <button
                onClick={() => {
                  setShowNewWebhook(false);
                  setWebhookName('');
                }}
                className="flex-1 bg-slate-600 hover:bg-slate-500 text-white font-medium py-2 rounded text-sm transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {savedWebhooks.length === 0 && !showNewWebhook && (
          <p className="text-xs text-slate-400 text-center py-2">
            Agrega tu primer webhook para comenzar
          </p>
        )}
      </div>
    </div>
  );
}
