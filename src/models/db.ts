import Dexie, { type Table } from 'dexie';

export type Project = {
  id: string;
  name: string;
  date_created: Date;
  date_modified: Date;
  date_deleted: Date | 'null';
  slug: string;
};

export type Column = {
  id: string;
  project_id: string; 
	name: string;
  position: number;
  date_created: Date;
  date_modified: Date;
  date_deleted: Date | 'null';
};

export type Task = {
  id: string;
  column_id: string;
	title: string;
  position: number;
  description?: string;
  date_created: Date;
  date_modified: Date;
  date_deleted: Date | 'null';
};

export type ChangeLog = {
  id: string;
  table: string;
  record_id: string;
	change_type: 'create' | 'update' | 'delete';
  date_modified: Date;
};

export const db = new Dexie('Task Manager') as Dexie & {
  projects: Table<Project, string>;
  columns: Table<Column, string>;
  tasks: Table<Task, string>;
  change_log: Table<ChangeLog, string>;
};

db.version(2).stores({
  projects: 'id, name, date_created, date_modified, date_deleted',
  columns: 'id, project_id, name, position, date_created, date_modified, date_deleted',
  tasks: 'id, column_id, title, position, date_created, date_modified, date_deleted',
  change_log: 'id, table, record_id, change_type, date_modified'
});


