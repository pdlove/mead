const { HotspringRoute } = require("hotspring-framework");
const { Sequelize, Op } = require("sequelize");

class pcapInterfaceRoutes extends HotspringRoute {
    routeName = 'pcapInterfaces';

    defaultAccess = 'admin'; // admin, user, public
    apiRoutes() {
        return [
            { path: '/pcap/interfaces', method: "GET", function: this.pcapInterfaces.bind(this), isAPI: true },
        ];
    }

    async pcapInterfaces(req, res) {
        try {
            //Use cap to get network adapters and addresses assigned to them
            const cap = require('cap');
            const devices = cap.deviceList();
            const summary = devices.map(device => ({
                name: device.name,
                description: device.description,
                addresses: device.addresses.map(addr => addr.address)
            }));
            res.json(summary);
            return true;

        }
        catch (err) {
            res.status(500).send(err.message);
            return true;
        }
    }
}
module.exports = pcapInterfaceRoutes