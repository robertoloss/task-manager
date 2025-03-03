import { db } from "./db";

const DELETE_THRESHOLD = 100;

export default async function cleanupDeletedItems() {
  const deletedProjects = await db.projects
    .where('date_deleted')
    .notEqual('null')
    .toArray();

  if (deletedProjects.length > DELETE_THRESHOLD) {
    await db.projects.bulkDelete(deletedProjects.slice(0, deletedProjects.length - DELETE_THRESHOLD).map(p => p.id));
  }

  const deletedColumns = await db.columns
    .where('date_deleted')
    .notEqual('null')
    .toArray();

  if (deletedColumns.length > DELETE_THRESHOLD) {
    await db.columns.bulkDelete(deletedColumns.slice(0, deletedColumns.length - DELETE_THRESHOLD).map(c => c.id));
  }

  const deletedTasks = await db.tasks
    .where('date_deleted')
    .notEqual('null')
    .toArray();

  if (deletedTasks.length > DELETE_THRESHOLD) {
    await db.tasks.bulkDelete(deletedTasks.slice(0, deletedTasks.length - DELETE_THRESHOLD).map(t => t.id));
  }
}
