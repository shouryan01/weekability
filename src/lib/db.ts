import Database from '@tauri-apps/plugin-sql';

export const db = await Database.load('postgres://postgres@localhost/weekability');