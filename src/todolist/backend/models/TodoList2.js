import { CarpenterModel, DataTypes } from "../../../carpenter/CarpenterModel.js";
import CarpenterModelRelationship from "../../../carpenter/CarpenterModelRelationship.js";

import { DataTypes } from "sequelize";
import { CarpenterModel, CarpenterModelRelationship } from "./CarpenterModelBase.js";

// 1. TodoList Model
export class TodoList extends CarpenterModel {
    static sequelizeDefinition = {
        todoListId: { type: DataTypes.UUID, primaryKey: true, allowNull: false },
        projectName: { type: DataTypes.STRING, allowNull: false },
        earliestDueDate: { type: DataTypes.STRING, allowNull: true },
        lastMod: { type: DataTypes.STRING, allowNull: true },
        lastModString: { type: DataTypes.STRING, allowNull: true },
        filename: { type: DataTypes.STRING, allowNull: true },
        nextUniqueId: { type: DataTypes.STRING, allowNull: true },
        fileVersion: { type: DataTypes.STRING, allowNull: true },
        appVer: { type: DataTypes.STRING, allowNull: true },
        fileFormat: { type: DataTypes.STRING, allowNull: true }
    };

    static sequelizeConnections = [
        // TodoList has many Tasks
        new CarpenterModelRelationship({
            connectionType: "1M",
            parentModelName: "TodoList",
            required: true,
            childParentKey: "todoListId",
            childModelName: "Task"
        })
    ];
}

// 2. Task Model
export class Task extends CarpenterModel {
    static sequelizeDefinition = {
        taskId: { type: DataTypes.UUID, primaryKey: true, allowNull: false },
        taskOrder: { type: DataTypes.INTEGER, allowNull: false },
        todoListId: { type: DataTypes.UUID, allowNull: false },
        parentTask: { type: DataTypes.UUID, allowNull: true },
        title: { type: DataTypes.STRING, allowNull: false },
        commentstype: { type: DataTypes.STRING, allowNull: true },
        comments: { type: DataTypes.TEXT, allowNull: true },
        status: { type: DataTypes.JSON, allowNull: true }, // array of statuses
        iconindex: { type: DataTypes.STRING, allowNull: true },
        priority: { type: DataTypes.STRING, allowNull: true },
        risk: { type: DataTypes.STRING, allowNull: true },
        timeestimate: { type: DataTypes.STRING, allowNull: true },
        timeestunits: { type: DataTypes.STRING, allowNull: true },
        timespent: { type: DataTypes.STRING, allowNull: true },
        timespentunits: { type: DataTypes.STRING, allowNull: true },
        percentdone: { type: DataTypes.STRING, allowNull: true },
        duedate: { type: DataTypes.STRING, allowNull: true },
        duedatestring: { type: DataTypes.STRING, allowNull: true },
        startdate: { type: DataTypes.STRING, allowNull: true },
        startdatestring: { type: DataTypes.STRING, allowNull: true },
        creationdate: { type: DataTypes.STRING, allowNull: true },
        creationdatestring: { type: DataTypes.STRING, allowNull: true },
        lastmod: { type: DataTypes.STRING, allowNull: true },
        lastmodstring: { type: DataTypes.STRING, allowNull: true },
        lastmodby: { type: DataTypes.STRING, allowNull: true },
        color: { type: DataTypes.STRING, allowNull: true },
        webcolor: { type: DataTypes.STRING, allowNull: true },
        textcolor: { type: DataTypes.STRING, allowNull: true },
        textwebcolor: { type: DataTypes.STRING, allowNull: true },
        prioritycolor: { type: DataTypes.STRING, allowNull: true },
        prioritywebcolor: { type: DataTypes.STRING, allowNull: true },
        pos: { type: DataTypes.STRING, allowNull: true },
        posstring: { type: DataTypes.STRING, allowNull: true },
        calctimeestimate: { type: DataTypes.STRING, allowNull: true },
        calctimeestunits: { type: DataTypes.STRING, allowNull: true },
        calctimespent: { type: DataTypes.STRING, allowNull: true },
        calctimespentunits: { type: DataTypes.STRING, allowNull: true },
        calctimeremaining: { type: DataTypes.STRING, allowNull: true },
        calctimeremainingunits: { type: DataTypes.STRING, allowNull: true },
        subtasksdone: { type: DataTypes.STRING, allowNull: true },
        recurrence: { type: DataTypes.JSON, allowNull: true },
        children: { type: DataTypes.JSON, allowNull: true }
    };

    static sequelizeConnections = [
        // Task belongs to TodoList
        new CarpenterModelRelationship({
            connectionType: "M1",
            parentModelName: "TodoList",
            required: true,
            parentParentKey: "todoListId",
            childModelName: "Task",
            childParentKey: "todoListId"
        }),
        // Task belongs to parent task
        new CarpenterModelRelationship({
            connectionType: "M1",
            parentModelName: "Task",
            required: false,
            parentParentKey: "taskId",
            childModelName: "Task",
            childParentKey: "parentTask"
        }),
        // Task has many Categories, Tags, People, FileRefs, Metadata
        new CarpenterModelRelationship({
            connectionType: "1M",
            parentModelName: "Task",
            required: false,
            childParentKey: "taskId",
            childModelName: "TaskCategory"
        }),
        new CarpenterModelRelationship({
            connectionType: "1M",
            parentModelName: "Task",
            required: false,
            childParentKey: "taskId",
            childModelName: "TaskTag"
        }),
        new CarpenterModelRelationship({
            connectionType: "1M",
            parentModelName: "Task",
            required: false,
            childParentKey: "taskId",
            childModelName: "TaskPerson"
        }),
        new CarpenterModelRelationship({
            connectionType: "1M",
            parentModelName: "Task",
            required: false,
            childParentKey: "taskId",
            childModelName: "TaskFileRef"
        }),
        new CarpenterModelRelationship({
            connectionType: "1M",
            parentModelName: "Task",
            required: false,
            childParentKey: "taskId",
            childModelName: "TaskMetadata"
        })
    ];
}

// 3. Supporting Models
export class TaskCategory extends CarpenterModel {
    static sequelizeDefinition = {
        id: { type: DataTypes.UUID, primaryKey: true, allowNull: false },
        taskId: { type: DataTypes.UUID, allowNull: false },
        name: { type: DataTypes.STRING, allowNull: false }
    };
}

export class TaskTag extends CarpenterModel {
    static sequelizeDefinition = {
        id: { type: DataTypes.UUID, primaryKey: true, allowNull: false },
        taskId: { type: DataTypes.UUID, allowNull: false },
        name: { type: DataTypes.STRING, allowNull: false }
    };
}

export class TaskPerson extends CarpenterModel {
    static sequelizeDefinition = {
        id: { type: DataTypes.UUID, primaryKey: true, allowNull: false },
        taskId: { type: DataTypes.UUID, allowNull: false },
        name: { type: DataTypes.STRING, allowNull: false }
    };
}

export class TaskFileRef extends CarpenterModel {
    static sequelizeDefinition = {
        id: { type: DataTypes.UUID, primaryKey: true, allowNull: false },
        taskId: { type: DataTypes.UUID, allowNull: false },
        path: { type: DataTypes.STRING, allowNull: false }
    };
}

export class TaskMetadata extends CarpenterModel {
    static sequelizeDefinition = {
        id: { type: DataTypes.UUID, primaryKey: true, allowNull: false },
        taskId: { type: DataTypes.UUID, allowNull: false },
        key: { type: DataTypes.STRING, allowNull: false },
        value: { type: DataTypes.STRING, allowNull: true }
    };
}
