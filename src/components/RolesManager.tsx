import { useState, useEffect } from 'react';
import { Users, Plus, Trash2, Copy, Check } from 'lucide-react';

interface Role {
  id: string;
  name: string;
  format: string;
}

export default function RolesManager() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [roleName, setRoleName] = useState('');
  const [roleFormat, setRoleFormat] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('roles');
    if (stored) {
      try {
        setRoles(JSON.parse(stored));
      } catch (e) {
        console.error('Error loading roles:', e);
      }
    }
  }, []);

  const addRole = () => {
    if (!roleName.trim() || !roleFormat.trim()) {
      alert('Por favor completa nombre y formato');
      return;
    }

    const newRole: Role = {
      id: Date.now().toString(),
      name: roleName,
      format: roleFormat
    };

    const updated = [...roles, newRole];
    setRoles(updated);
    localStorage.setItem('roles', JSON.stringify(updated));
    setRoleName('');
    setRoleFormat('');
    setShowNew(false);
  };

  const deleteRole = (id: string) => {
    const updated = roles.filter(r => r.id !== id);
    setRoles(updated);
    localStorage.setItem('roles', JSON.stringify(updated));
  };

  const copyFormat = (format: string) => {
    navigator.clipboard.writeText(format);
    setCopied(format);
    setTimeout(() => setCopied(null), 2000);
  };

  const roleFormatExamples = [
    { name: 'Mención', example: '<@&ROLE_ID>' },
    { name: 'Texto personalizado', example: '@Nombre del Rol' }
  ];

  return (
    <div className="bg-slate-800 rounded-lg p-3 sm:p-4 shadow-xl">
      <div className="flex items-center gap-2 mb-2 sm:mb-3">
        <Users className="text-blue-400" size={18} />
        <h2 className="text-base sm:text-lg font-bold text-white">Roles</h2>
      </div>

      <div className="space-y-2 sm:space-y-3">
        {roles.length > 0 && (
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {roles.map((role) => (
              <div
                key={role.id}
                className="flex items-center justify-between p-2 rounded bg-slate-700 text-xs"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{role.name}</p>
                </div>
                <div className="flex gap-1 ml-1 flex-shrink-0">
                  <button
                    onClick={() => copyFormat(role.format)}
                    className="bg-slate-600 hover:bg-slate-500 text-white p-1 rounded"
                    title="Copiar"
                  >
                    {copied === role.format ? <Check size={12} /> : <Copy size={12} />}
                  </button>
                  <button
                    onClick={() => deleteRole(role.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!showNew ? (
          <button
            onClick={() => setShowNew(true)}
            className="w-full flex items-center justify-center gap-1 bg-slate-700 hover:bg-slate-600 text-white font-medium py-1 px-2 rounded text-xs transition-colors"
          >
            <Plus size={14} />
            Agregar
          </button>
        ) : (
          <div className="space-y-1 bg-slate-700 rounded p-2">
            <input
              type="text"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="w-full bg-slate-600 text-white rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nombre"
            />
            <input
              type="text"
              value={roleFormat}
              onChange={(e) => setRoleFormat(e.target.value)}
              className="w-full bg-slate-600 text-white rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Formato"
            />
            <div className="flex gap-1">
              <button
                onClick={addRole}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-1 rounded text-xs transition-colors"
              >
                Guardar
              </button>
              <button
                onClick={() => {
                  setShowNew(false);
                  setRoleName('');
                  setRoleFormat('');
                }}
                className="flex-1 bg-slate-600 hover:bg-slate-500 text-white font-medium py-1 rounded text-xs transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {roles.length === 0 && !showNew && (
          <p className="text-xs text-slate-400 text-center py-2">
            Guarda formatos de roles para usar rápidamente
          </p>
        )}
      </div>
    </div>
  );
}
