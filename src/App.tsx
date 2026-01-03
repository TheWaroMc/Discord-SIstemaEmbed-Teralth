import { useState } from 'react';
import { Send } from 'lucide-react';
import EmbedEditor from './components/EmbedEditor';
import EmbedPreview from './components/EmbedPreview';
import WebhookConfig from './components/WebhookConfig';
import ButtonGenerator from './components/ButtonGenerator';
import HammertimeSection from './components/HammertimeSection';
import SavedEmbeds from './components/SavedEmbeds';
import RolesManager from './components/RolesManager';
import { EmbedData, WebhookData, ButtonData } from './types';

function App() {
  const [webhookData, setWebhookData] = useState<WebhookData>({
    url: '',
    username: '',
    avatarUrl: ''
  });

  const [embedData, setEmbedData] = useState<EmbedData>({
    title: '',
    description: '',
    color: '#5865F2',
    footer: { text: '', iconUrl: '' },
    thumbnail: '',
    image: '',
    author: { name: '', iconUrl: '', url: '' },
    fields: [],
    timestamp: false
  });

  const [buttons, setButtons] = useState<ButtonData[]>([]);
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const sendToDiscord = async () => {
    if (!webhookData.url) {
      setError('Por favor ingresa la URL del webhook');
      return;
    }

    setSending(true);
    setError('');
    setSuccess('');

    try {
      const payload: any = {
        content: content || undefined,
        username: webhookData.username || undefined,
        avatar_url: webhookData.avatarUrl || undefined,
      };

      const embed: any = {};

      if (embedData.title) embed.title = embedData.title;
      if (embedData.description) embed.description = embedData.description;
      if (embedData.color) {
        embed.color = parseInt(embedData.color.replace('#', ''), 16);
      }
      if (embedData.footer.text) {
        embed.footer = {
          text: embedData.footer.text,
          icon_url: embedData.footer.iconUrl || undefined
        };
      }
      if (embedData.thumbnail) embed.thumbnail = { url: embedData.thumbnail };
      if (embedData.image) embed.image = { url: embedData.image };
      if (embedData.author.name) {
        embed.author = {
          name: embedData.author.name,
          icon_url: embedData.author.iconUrl || undefined,
          url: embedData.author.url || undefined
        };
      }
      if (embedData.fields.length > 0) {
        embed.fields = embedData.fields.filter(f => f.name && f.value);
      }
      if (embedData.timestamp) {
        embed.timestamp = new Date().toISOString();
      }

      if (Object.keys(embed).length > 0) {
        payload.embeds = [embed];
      }

      if (buttons.length > 0) {
        payload.components = [{
          type: 1,
          components: buttons.map(btn => ({
            type: 2,
            style: btn.style,
            label: btn.label,
            url: btn.url || undefined,
            custom_id: btn.customId || undefined
          }))
        }];
      }

      const response = await fetch(webhookData.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      setSuccess('¡Mensaje enviado exitosamente a Discord!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Error al enviar el mensaje. Verifica tu webhook URL.');
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        <header className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">
            Discord Embed Generator
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-400">
            Crea embeds personalizados para Discord con vista previa en tiempo real
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <WebhookConfig
              webhookData={webhookData}
              setWebhookData={setWebhookData}
            />

            <div className="bg-slate-800 rounded-lg p-4 sm:p-5 md:p-6 shadow-xl">
              <label className="block text-white font-medium mb-2 text-sm sm:text-base">
                Mensaje de Texto
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-slate-700 text-white rounded px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Escribe un mensaje (opcional)..."
              />
              <p className="text-xs text-slate-400 mt-2">
                Soporta markdown: **negrita**, *cursiva*, __subrayado__, ~~tachado~~
              </p>
            </div>

            <EmbedEditor
              embedData={embedData}
              setEmbedData={setEmbedData}
            />

            <ButtonGenerator
              buttons={buttons}
              setButtons={setButtons}
            />

            <HammertimeSection />

            <SavedEmbeds embedData={embedData} setEmbedData={setEmbedData} />

            <RolesManager />

            <div className="bg-slate-800 rounded-lg p-4 sm:p-5 md:p-6 shadow-xl">
              <button
                onClick={sendToDiscord}
                disabled={sending || !webhookData.url}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 text-sm sm:text-base rounded-lg flex items-center justify-center gap-2 transition-all"
              >
                <Send size={18} sm:size={20} />
                {sending ? 'Enviando...' : 'Enviar a Discord'}
              </button>

              {error && (
                <div className="mt-4 bg-red-500/10 border border-red-500 text-red-400 rounded-lg p-3 text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="mt-4 bg-green-500/10 border border-green-500 text-green-400 rounded-lg p-3 text-sm">
                  {success}
                </div>
              )}
            </div>
          </div>

          <div className="lg:sticky lg:top-8 h-fit">
            <EmbedPreview
              embedData={embedData}
              content={content}
              buttons={buttons}
              webhookData={webhookData}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
