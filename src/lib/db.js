import Dexie, { Table } from 'dexie';

export const db = new Dexie('RangePilotDB');
db.version(1).stores({
  users: 'id, email, &username',
  assets: '++id, &name, created_date',
  analysisLogs: '++id, asset_id, created_date',
  settings: '&key'
});

export async function initDB() {
  try {
    // Check if DB is accessible
    const userCount = await db.users.count();
    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    return false;
  }
}
