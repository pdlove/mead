import { parseStringPromise } from 'xml2js';
import { Project, Task, Dependency } from './models.js';

/**
 * Imports project data from XML text string.
 * @param {string} xmlString - The raw XML string.
 * @returns {Promise<Project>}
 */
export async function importFromXml(xmlString) {
    const parsed = await parseStringPromise(xmlString, { explicitArray: false });

    // Assuming XML root is something like: <Project>...</Project>
    const xmlProject = parsed.Project;

    // Create the Project
    const project = new Project({
        id: xmlProject.ID,
        name: xmlProject.Name,
        startDate: xmlProject.StartDate,
        finishDate: xmlProject.FinishDate,
        tasks: [],
        dependencies: [],
    });

    const taskMap = new Map(); // id -> Task

    // We need to walk tasks in the order they appear
    const xmlTasks = Array.isArray(xmlProject.Tasks.Task)
        ? xmlProject.Tasks.Task
        : [xmlProject.Tasks.Task];

    let orderCounter = 1;

    for (const xmlTask of xmlTasks) {
        const task = new Task({
            id: xmlTask.ID,
            name: xmlTask.Name,
            startDate: xmlTask.StartDate,
            finishDate: xmlTask.FinishDate,
            duration: xmlTask.Duration,
            percentComplete: xmlTask.PercentComplete,
            parentTask: xmlTask.ParentTaskID || null,
            children: [],
            dependencies: [],
            taskOrder: orderCounter++
        });
        taskMap.set(task.id, task);
        project.tasks.push(task);
    }

    // Populate children arrays based on parentTask field
    for (const task of project.tasks) {
        if (task.parentTask && taskMap.has(task.parentTask)) {
            taskMap.get(task.parentTask).children.push(task.id);
        }
    }

    // Dependencies
    if (xmlProject.Dependencies && xmlProject.Dependencies.Dependency) {
        const xmlDeps = Array.isArray(xmlProject.Dependencies.Dependency)
            ? xmlProject.Dependencies.Dependency
            : [xmlProject.Dependencies.Dependency];

        for (const xmlDep of xmlDeps) {
            const dep = new Dependency({
                id: xmlDep.ID,
                predecessorId: xmlDep.PredecessorID,
                successorId: xmlDep.SuccessorID,
                type: xmlDep.Type
            });

            project.dependencies.push(dep);

            // Add dependency IDs to tasks
            const successorTask = taskMap.get(dep.successorId);
            if (successorTask) {
                successorTask.dependencies.push(dep.id);
            }
        }
    }

    return project;
}
