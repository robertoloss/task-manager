import { db } from './db'; 
import { v4 as uuid } from 'uuid';

export async function initializeProject() {
  
  const existingProject = await db.projects.toArray()

  if (existingProject.length === 0) {
    console.log('No project found. Creating initial project and columns...');
    const projectName = 'My First Project';
    const projectSlug = 'my-first-project';

    const projectId = uuid();
    await db.projects.add({
      id: projectId,
      name: projectName,
      date_created: new Date(),
      date_modified: new Date(),
			date_deleted: 'null',
      slug:projectSlug 
    });

    const columns = [
      { name: 'To Do', position: 1 },
      { name: 'In Progress', position: 2 },
      { name: 'Done', position: 3 }
    ];

    for (const column of columns) {
      await db.columns.add({
        id: uuid(),
        project_id: projectId,
        name: column.name,
        position: column.position,
        date_created: new Date(),
        date_modified: new Date(),
				date_deleted: 'null',
      });
    }

    console.log('Initial project and columns created.');
  } else {
    console.log('Initialization skipped.');
  }
}

