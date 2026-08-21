import { query } from '../config/database';

export class SettingsService {
  static async getAll() {
    const result = await query('SELECT setting_key, setting_value FROM website_settings ORDER BY setting_key');
    const settings: Record<string, string | null> = {};
    result.rows.forEach((r: any) => { settings[r.setting_key] = r.setting_value; });
    return settings;
  }

  static async update(settings: { setting_key: string; setting_value: string | null }[]) {
    for (const s of settings) {
      await query(
        `INSERT INTO website_settings (setting_key, setting_value) VALUES ($1, $2)
         ON CONFLICT (setting_key) DO UPDATE SET setting_value = $2`,
        [s.setting_key, s.setting_value]
      );
    }
    return this.getAll();
  }

  static async get(key: string) {
    const r = await query('SELECT setting_value FROM website_settings WHERE setting_key = $1', [key]);
    return r.rows.length ? r.rows[0].setting_value : null;
  }

  static async set(key: string, value: string) {
    await query(
      `INSERT INTO website_settings (setting_key, setting_value) VALUES ($1, $2)
       ON CONFLICT (setting_key) DO UPDATE SET setting_value = $2`,
      [key, value]
    );
  }
}
