import React, { createContext, useContext, useState, useEffect } from 'react';
import { WebsiteSettings } from '../types';
import { publicApi } from '../api/services';

interface SettingsContextType {
  settings: WebsiteSettings;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<WebsiteSettings>({
    company_name: 'AVADH Imitation Jewellery',
    phone: '+91 98765 43210',
    whatsapp: '+91 98765 43210',
    email: 'info@avadhjewellery.com',
    address: 'Rajkot, Gujarat, India',
    footer_text: '© 2026 AVADH Imitation Jewellery. All Rights Reserved.',
  });

  const refreshSettings = async () => {
    try {
      const res = await publicApi.getSettings();
      if (res.success && res.data) {
        setSettings(res.data);
      }
    } catch (e) {
      console.error('Failed to load website settings', e);
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
};
