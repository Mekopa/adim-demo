import React from 'react';
import { Monitor, Sun, Moon, Ship } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const themes = [
  { id: 'system', label: 'Sistemos', icon: Monitor, description: 'Naudojami kompiuterio nustatymai' },
  { id: 'light', label: 'Šviesi', icon: Sun, description: 'Klasikinė šviesi išvaizda' },
  { id: 'dark', label: 'Tamsi', icon: Moon, description: 'Mažiau akinanti išvaizda' },
  { id: 'navy', label: 'Mėlyna', icon: Ship, description: 'Tamsiai mėlyna išvaizda' },
] as const;

export default function SystemSettings() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-1">Spalvų gama</h3>
        <p className="text-text-secondary text-sm mb-4">
          Pasirinkite patogiausią spalvų gamą
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {themes.map((themeOption) => {
            const Icon = themeOption.icon;
            const isSelected = theme === themeOption.id;
            return (
              <button
                key={themeOption.id}
                onClick={() => setTheme(themeOption.id)}
                className={`flex items-start gap-4 p-4 rounded-lg border-2 transition-all ${
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/30 hover:bg-background'
                }`}
                aria-pressed={isSelected}
              >
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary/10 text-primary' : 'bg-background text-text-secondary'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-medium">{themeOption.label}</div>
                  <div className="text-sm text-text-secondary">{themeOption.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}