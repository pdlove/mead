const { HotspringRoute } = require("hotspring-framework");
const { Sequelize, Op } = require("sequelize");

class syslogDashboardRoutes extends HotspringRoute {
    routeName = 'syslogDashboard';

    defaultAccess = 'admin'; // admin, user, public
    apiRoutes() {
        return [
            { path:'/dashboard/summary', method: "GET", function: this.dashboardSummary.bind(this), isAPI: true },
        ];
    }

    async dashboardSummary(req, res) {
        try {
            //Get the Model
            const logEntryModel = this.hotspring.models['syslog.logentry'];
            const toDate = req.query.to ? new Date(req.query.to) : new Date();
            const fromDate = req.query.from ? new Date(req.query.from) : new Date(toDate); // Clone toDate
            if (!req.query.from) fromDate.setDate(toDate.getDate() - 1); // Default to 1 day
        
            const summary = await logEntryModel.sequelizeObject.findAll({
                attributes: [
                    "sourceID"
                    [Sequelize.fn("COUNT", Sequelize.col("logEntryID")), "total_entries"],
                    [Sequelize.fn("MAX", Sequelize.col("time")), "latest_log_time"],
                    ...Array.from({ length: 8 }, (_, i) => [
                        Sequelize.fn("COUNT", Sequelize.literal(`CASE WHEN severity = ${i} THEN 1 END`)),
                        `severity_${i}_count`
                    ])
                ],
                where: {
                    time: {
                        [Op.between]: [fromDate, toDate]
                    }
                },
                group: ["sourceID"],
                order: [[Sequelize.fn("MAX", Sequelize.col("time")), "DESC"]],
                logging: console.log
            });
        
            res.json(summary);    
            return true;
            
        }
        catch (err) {
            res.status(500).send(err.message);
            return true;
        }
    }
}
module.exports =  syslogDashboardRoutes