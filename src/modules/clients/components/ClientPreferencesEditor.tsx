'use client';

import React, { useState } from 'react';
import { Settings, Scissors, Package, Calendar, Clock, AlertTriangle, Save } from 'lucide-react';
import type { ClientPreferences, Service, Product } from '@/types';

interface ClientPreferencesEditorProps {
  preferences: ClientPreferences;
  services: Service[];
  products: Product[];
  onSave: (preferences: ClientPreferences) => void;
}

export const ClientPreferencesEditor: React.FC<ClientPreferencesEditorProps> = ({
  preferences,
  services,
  products,
  onSave,
}) => {
  const [prefs, setPrefs] = useState<ClientPreferences>(preferences);
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (key: keyof ClientPreferences, value: string) => {
    setPrefs((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(prefs);
    setHasChanges(false);
  };

  const days = ['Segunda', 'TerÃ§a', 'Quarta', 'Quinta', 'Sexta', 'SÃ¡bado', 'Domingo'];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-zinc-500 font-bold uppercase flex items-center gap-2">
          <Settings className="w-3 h-3" /> PreferÃªncias do Cliente
        </p>
        {hasChanges && (
          <button
            onClick={handleSave}
            className="flex items-center gap-1 px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold rounded-lg"
          >
            <Save className="w-3 h-3" /> Salvar
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* ServiÃ§o preferido */}
        <div>
          <label className="block text-[10px] text-zinc-500 mb-1 flex items-center gap-1">
            <Scissors className="w-3 h-3" /> ServiÃ§o Preferido
          </label>
          <select
            value={prefs.preferredService || ''}
            onChange={(e) => handleChange('preferredService', e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-amber-500"
          >
            <option value="">-- Selecionar --</option>
            {services.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Produto preferido */}
        <div>
          <label className="block text-[10px] text-zinc-500 mb-1 flex items-center gap-1">
            <Package className="w-3 h-3" /> Produto Preferido
          </label>
          <select
            value={prefs.preferredProduct || ''}
            onChange={(e) => handleChange('preferredProduct', e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-amber-500"
          >
            <option value="">-- Selecionar --</option>
            {products.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Dia preferido */}
        <div>
          <label className="block text-[10px] text-zinc-500 mb-1 flex items-center gap-1">
            <Calendar className="w-3 h-3" /> Dia Preferido
          </label>
          <select
            value={prefs.preferredDay || ''}
            onChange={(e) => handleChange('preferredDay', e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-amber-500"
          >
            <option value="">-- Selecionar --</option>
            {days.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* HorÃ¡rio preferido */}
        <div>
          <label className="block text-[10px] text-zinc-500 mb-1 flex items-center gap-1">
            <Clock className="w-3 h-3" /> HorÃ¡rio Preferido
          </label>
          <select
            value={prefs.preferredTime || ''}
            onChange={(e) => handleChange('preferredTime', e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-amber-500"
          >
            <option value="">-- Selecionar --</option>
            <option value="ManhÃ£ (8h-12h)">ManhÃ£ (8h-12h)</option>
            <option value="Tarde (12h-18h)">Tarde (12h-18h)</option>
            <option value="Noite (18h-21h)">Noite (18h-21h)</option>
          </select>
        </div>
      </div>

      {/* Alergias */}
      <div>
        <label className="block text-[10px] text-zinc-500 mb-1 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3 text-red-500" /> Alergias / RestriÃ§Ãµes
        </label>
        <input
          type="text"
          value={prefs.allergies || ''}
          onChange={(e) => handleChange('allergies', e.target.value)}
          placeholder="Ex: Alergia a parabenos"
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-red-500"
        />
      </div>

      {/* ObservaÃ§Ãµes */}
      <div>
        <label className="block text-[10px] text-zinc-500 mb-1">ObservaÃ§Ãµes</label>
        <textarea
          value={prefs.observations || ''}
          onChange={(e) => handleChange('observations', e.target.value)}
          placeholder="Ex: Gosta de conversar, prefere silÃªncio..."
          rows={2}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-amber-500 resize-none"
        />
      </div>
    </div>
  );
};
