import { CarpenterModel, DataTypes } from "../../carpenter/CarpenterModel.js";
import CarpenterModelRelationship from "../../carpenter/CarpenterModelRelationship.js";

export class ClusterServices extends CarpenterModel {
    static sequelizeDefinition = {
        TaskId: { type: DataTypes.UUID, primaryKey: true, allowNull: false, },
        TaskColor: { type: DataTypes.STRING, allowNull: true, }, //Color to mark the task
        Category: { type: DataTypes.STRING, allowNull: true, }, //Primary Category/Tag. Used for templating Comments field and filtering
        Title: { type: DataTypes.STRING, allowNull: true, },
        Summary: { type: DataTypes.STRING, allowNull: true, },
        Comments: { type: DataTypes.TEXT, allowNull: true, },

        EstimatedStartOn: { type: DataTypes.DATE, allowNull: true, }, //Estimated Start Date
        EstimatedTimeTotal: { type: DataTypes.INTEGER, allowNull: true, }, //Estimated Total Time in Minutes
        EstimatedCompleteOn: { type: DataTypes.DATE, allowNull: true, }, //The item SHOULD be completed by this date/time
        MustCompleteOn: { type: DataTypes.DATE, allowNull: true, }, //The item MUST be completed by this date/time

        EstimatedCostTotal: { type: DataTypes.DECIMAL, allowNull: true, }, //Estimated Dollar Total

        TrackTimeSpent: { type: DataTypes.TINYINT, allowNull: true, }, //Time in Minutes (Sum from TaskTimeTrack table)

        ActualStartOn: { type: DataTypes.DATE, allowNull: true, },
        ActualTimeSpent: { type: DataTypes.INTEGER, allowNull: true, },
        ActualCost: { type: DataTypes.DECIMAL, allowNull: true, },
        ActualCompleteOn: { type: DataTypes.DATE, allowNull: true, },

        EstimatedTimeRemaining: { type: DataTypes.INTEGER, allowNull: true, },
        EstimatedCostRemaining: { type: DataTypes.DECIMAL, allowNull: true, },
        PercentComplete: { type: DataTypes.DECIMAL, allowNull: true, },
        CalculatePercent: { type: DataTypes.BOOLEAN, allowNull: true, }, 

        AssignedBy: { type: DataTypes.UUID, allowNull: true, }, //Links to the User Table
        AssignedTo: { type: DataTypes.UUID, allowNull: true, }, //Links to the User Table
        AssignedOn: { type: DataTypes.DATE, allowNull: true, },

        ExternalID: { type: DataTypes.STRING, allowNull: true, },
        FileLink: { type: DataTypes.STRING, allowNull: true, },
        Flag: { type: DataTypes.INTEGER, allowNull: true, },
        Icon: { type: DataTypes.STRING, allowNull: true, },
        Position: { type: DataTypes.INTEGER, allowNull: true, },
        Priority: { type: DataTypes.INTEGER, allowNull: true, },
        Recurrance: { type: DataTypes.TEXT, allowNull: true, }, //JSON Definition
        Reminder: { type: DataTypes.TEXT, allowNull: true, }, //JSON Definition
        Risk: { type: DataTypes.INTEGER, allowNull: true, },

        Status: { type: DataTypes.UUID, allowNull: true, }, //User-Configurable Status List

        CalculateFromSubTask: { type: DataTypes.BOOLEAN, allowNull: true, },

        //Tags (Multi-to-Multi)

        CreatedBy: { type: DataTypes.UUID, allowNull: false, }, //Links to the User Table
        CreatedOn: { type: DataTypes.DATE, allowNull: false, },
        LastModifiedBy: { type: DataTypes.UUID, allowNull: false, }, //Links to the User Table
        LastModifiedOn: { type: DataTypes.DATE, allowNull: false, },

        ParentTaskID: { type: DataTypes.UUID, allowNull: true, }, //Links to a parent task if not root.
        //Dependencies (Multi-to-Multi)
    }
}