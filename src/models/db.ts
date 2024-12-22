import Dexie, { type EntityTable } from 'dexie';

type Task = {
  id: number;
  title: string;
  date_created: Date;
	deleted: boolean;
}

const db = new Dexie('Task Manager') as Dexie & {
  tasks: EntityTable<Task,'id'>;
};

db.version(1).stores({
  tasks: '++id, title, date_created, deleted' 
});

export type { Task };
export { db };
