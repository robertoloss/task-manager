import { db } from './db'; 
import { v4 as uuid } from 'uuid';

export async function initializeProject() {
  const projectName = 'My First Project';
  
  const existingProject = await db.projects.where('name').equals(projectName).first();

  if (!existingProject) {
    console.log('Project not found. Creating initial project and columns...');

    const projectId = uuid();
    await db.projects.add({
      id: projectId,
      name: projectName,
      date_created: new Date(),
      date_modified: new Date(),
			date_deleted: null,
    });

    // Create the columns
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
				date_deleted: null,
      });
    }

    console.log('Initial project and columns created.');
  } else {
    console.log('Project already exists. Skipping initialization.');
  }
}

