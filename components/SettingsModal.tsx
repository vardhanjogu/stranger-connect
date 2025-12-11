import React from 'react';
import { Button } from './Button';
import { UserSettings, Theme } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onSave: (newSettings: UserSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSave }) => {
  if (!isOpen) return null;

  const [localSettings, setLocalSettings] = React.useState<UserSettings>(settings);

  const handleThemeSelect = (theme: Theme) => {
    setLocalSettings({ ...localSettings, theme });
  };

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-md shadow-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-foreground">Settings</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* Theme Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-3">Theme</label>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => handleThemeSelect('dark')}
                className={`p-3 rounded-xl border flex items-center gap-2 transition-all ${localSettings.theme === 'dark' ? 'bg-indigo-600/20 border-indigo-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'}`}
              >
                <div className="w-4 h-4 rounded-full bg-slate-900 border border-slate-600"></div>
                Default Dark
              </button>
              <button 
                onClick={() => handleThemeSelect('light')}
                className={`p-3 rounded-xl border flex items-center gap-2 transition-all ${localSettings.theme === 'light' ? 'bg-indigo-100 border-indigo-500 text-indigo-900' : 'bg-slate-100 border-slate-300 text-slate-600 hover:border-slate-400'}`}
              >
                <div className="w-4 h-4 rounded-full bg-white border border-slate-300"></div>
                Light
              </button>
              <button 
                onClick={() => handleThemeSelect('midnight')}
                className={`p-3 rounded-xl border flex items-center gap-2 transition-all ${localSettings.theme === 'midnight' ? 'bg-cyan-900/40 border-cyan-500 text-cyan-100' : 'bg-[#0b1120] border-slate-800 text-slate-400 hover:border-cyan-500/50'}`}
              >
                <div className="w-4 h-4 rounded-full bg-[#0b1120] border border-cyan-700"></div>
                Midnight
              </button>
              <button 
                onClick={() => handleThemeSelect('forest')}
                className={`p-3 rounded-xl border flex items-center gap-2 transition-all ${localSettings.theme === 'forest' ? 'bg-emerald-900/40 border-emerald-500 text-emerald-100' : 'bg-[#052e16] border-green-900 text-slate-400 hover:border-emerald-500/50'}`}
              >
                <div className="w-4 h-4 rounded-full bg-[#052e16] border border-green-700"></div>
                Forest
              </button>
            </div>
          </div>

          {/* Preferences */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-3">Preferences</label>
            <div className="space-y-3">
               <div className="flex items-center justify-between p-3 bg-background/50 rounded-xl border border-border">
                  <span className="text-foreground">Sound Notifications</span>
                  <button 
                    onClick={() => setLocalSettings({...localSettings, notifications: !localSettings.notifications})}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${localSettings.notifications ? 'bg-primary' : 'bg-slate-700'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${localSettings.notifications ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </button>
               </div>

               <div>
                 <label className="text-xs text-slate-500 mb-1 block">Preferred Topic (Optional)</label>
                 <input 
                    type="text" 
                    value={localSettings.topic || ''}
                    onChange={(e) => setLocalSettings({...localSettings, topic: e.target.value})}
                    placeholder="e.g. Movies, Philosophy, Gaming..."
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                 />
                 <p className="text-[10px] text-slate-500 mt-1">We'll try to match you with someone similar, but it's not guaranteed.</p>
               </div>
            </div>
          </div>

        </div>

        <div className="mt-8">
          <Button onClick={handleSave} className="w-full py-3">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};