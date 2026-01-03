import { EmbedData, ButtonData, WebhookData } from '../types';

interface EmbedPreviewProps {
  embedData: EmbedData;
  content: string;
  buttons: ButtonData[];
  webhookData: WebhookData;
}

export default function EmbedPreview({ embedData, content, buttons, webhookData }: EmbedPreviewProps) {
  const formatMarkdown = (text: string) => {
    if (!text) return null;

    let formatted = text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/__(.+?)__/g, '<u>$1</u>')
      .replace(/~~(.+?)~~/g, '<del>$1</del>')
      .replace(/\n/g, '<br/>');

    return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
  };

  const getButtonStyle = (style: number) => {
    const styles: Record<number, string> = {
      1: 'bg-blue-600 hover:bg-blue-700 text-white',
      2: 'bg-gray-600 hover:bg-gray-700 text-white',
      3: 'bg-green-600 hover:bg-green-700 text-white',
      4: 'bg-red-600 hover:bg-red-700 text-white',
      5: 'bg-transparent hover:bg-gray-700/50 text-blue-400 border border-gray-600'
    };
    return styles[style] || styles[1];
  };

  const hasContent = content || embedData.title || embedData.description || embedData.image || embedData.thumbnail;

  return (
    <div className="bg-slate-800 rounded-lg p-4 sm:p-5 md:p-6 shadow-xl">
      <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Vista Previa</h2>

      <div className="bg-slate-900 rounded p-3 sm:p-4 font-['Whitney','Helvetica_Neue','Helvetica','Arial',sans-serif] text-sm sm:text-base">
        {!hasContent ? (
          <div className="text-slate-500 text-center py-6 sm:py-8 text-xs sm:text-sm">
            Comienza a llenar los campos para ver la vista previa
          </div>
        ) : (
          <>
            <div className="flex items-start gap-2 sm:gap-3 mb-2">
              {webhookData.avatarUrl ? (
                <img
                  src={webhookData.avatarUrl}
                  alt="Bot Avatar"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0"
                  onError={(e) => {
                    e.currentTarget.src = 'https://cdn.discordapp.com/embed/avatars/0.png';
                  }}
                />
              ) : (
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0">
                  {webhookData.username ? webhookData.username[0].toUpperCase() : 'B'}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1">
                  <span className="text-white font-semibold text-xs sm:text-sm">
                    {webhookData.username || 'Webhook'}
                  </span>
                  <span className="bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded flex-shrink-0">
                    BOT
                  </span>
                  <span className="text-slate-500 text-xs hidden sm:inline">
                    hoy a las {new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {content && (
                  <div className="text-slate-200 text-xs sm:text-sm mb-2 break-words">
                    {formatMarkdown(content)}
                  </div>
                )}

                {(embedData.title || embedData.description || embedData.image || embedData.thumbnail || embedData.fields.length > 0) && (
                  <div
                    className="rounded overflow-hidden mt-2"
                    style={{
                      borderLeft: `4px solid ${embedData.color}`,
                      backgroundColor: '#2b2d31'
                    }}
                  >
                    <div className="p-4">
                      <div className="flex justify-between">
                        <div className="flex-1">
                          {embedData.author.name && (
                            <div className="flex items-center gap-2 mb-2">
                              {embedData.author.iconUrl && (
                                <img
                                  src={embedData.author.iconUrl}
                                  alt="Author"
                                  className="w-6 h-6 rounded-full"
                                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                              )}
                              <span className="text-white text-sm font-semibold">
                                {embedData.author.name}
                              </span>
                            </div>
                          )}

                          {embedData.title && (
                            <div className="text-white font-semibold mb-2">
                              {formatMarkdown(embedData.title)}
                            </div>
                          )}

                          {embedData.description && (
                            <div className="text-slate-300 text-sm mb-2">
                              {formatMarkdown(embedData.description)}
                            </div>
                          )}

                          {embedData.fields.length > 0 && (
                            <div className="grid gap-2 mt-2">
                              {embedData.fields.map((field, index) => (
                                field.name && field.value && (
                                  <div
                                    key={index}
                                    className={field.inline ? 'inline-block w-1/2 pr-2' : 'block'}
                                  >
                                    <div className="text-white text-sm font-semibold mb-1">
                                      {formatMarkdown(field.name)}
                                    </div>
                                    <div className="text-slate-300 text-sm">
                                      {formatMarkdown(field.value)}
                                    </div>
                                  </div>
                                )
                              ))}
                            </div>
                          )}

                          {embedData.image && (
                            <img
                              src={embedData.image}
                              alt="Embed"
                              className="mt-4 rounded max-w-full"
                              style={{ maxHeight: '300px' }}
                              onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                          )}
                        </div>

                        {embedData.thumbnail && (
                          <img
                            src={embedData.thumbnail}
                            alt="Thumbnail"
                            className="ml-4 rounded w-20 h-20 object-cover flex-shrink-0"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        )}
                      </div>

                      {(embedData.footer.text || embedData.timestamp) && (
                        <div className="flex items-center gap-2 mt-4 pt-2 border-t border-slate-700">
                          {embedData.footer.iconUrl && (
                            <img
                              src={embedData.footer.iconUrl}
                              alt="Footer"
                              className="w-5 h-5 rounded-full"
                              onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                          )}
                          <span className="text-slate-400 text-xs">
                            {embedData.footer.text}
                            {embedData.footer.text && embedData.timestamp && ' • '}
                            {embedData.timestamp && new Date().toLocaleString('es', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {buttons.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {buttons.map((button, index) => (
                      <button
                        key={index}
                        className={`${getButtonStyle(button.style)} px-4 py-2 rounded text-sm font-medium transition-colors cursor-pointer`}
                      >
                        {button.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="mt-4 bg-blue-900/20 border border-blue-500/30 rounded p-3">
        <p className="text-blue-300 text-xs">
          Esta es una vista previa aproximada. La apariencia final puede variar ligeramente en Discord.
        </p>
      </div>
    </div>
  );
}
