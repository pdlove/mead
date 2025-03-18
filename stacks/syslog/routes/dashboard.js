const { HotspringRoute, Op, Sequelize } = require("hotspring-framework");

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
            const logEntryModel = global.hotspring.models['syslog.LogEntry'];
            const toDate = req.query.to ? new Date(req.query.to) : new Date();
            const fromDate = req.query.from ? new Date(req.query.from) : new Date(toDate); // Clone toDate
            if (!req.query.from) fromDate.setDate(toDate.getDate() - 1); // Default to 1 day
        
            const summary = await logEntryModel.sequelizeObject.findAll({
                attributes: [
                    "sourceIP",
                    [Sequelize.fn("COUNT", Sequelize.col("lineID")), "total_entries"],
                    [Sequelize.fn("MAX", Sequelize.col("time")), "latest_log_time"],
                    ...Array.from({ length: 9 }, (_, i) => [
                        Sequelize.fn("COUNT", Sequelize.literal(`CASE WHEN severity = ${i + 1} THEN 1 END`)),
                        `severity_${i + 1}_count`
                    ])
                ],
                where: {
                    time: {
                        [Op.between]: [fromDate, toDate]
                    }
                },
                group: ["sourceIP"],
                order: [[Sequelize.fn("MAX", Sequelize.col("time")), "DESC"]]
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