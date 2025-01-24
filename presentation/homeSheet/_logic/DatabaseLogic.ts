import { deleteAndRecreateDatabase } from '@/presentation/_infrastructure/DatabaseRepository';

export async function handleDeleteAndRecreateDatabase() {
  try {
    await deleteAndRecreateDatabase();
    console.log('Database deleted and recreated successfully');
  } catch (err) {
    console.error('Error deleting and recreating database:', err);
  }
}
