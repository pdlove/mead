import User from "./models/user.js";
import Organization from "./models/organization.js";
import Location from "./models/location.js";
import Subnet from "./models/subnet.js";
import Network from "./models/network.js";
export default function addToCarpenter(carpenter) {
    carpenter.AddModel(Organization);
    carpenter.AddModel(User);
    carpenter.AddModel(Location);
    carpenter.AddModel(Subnet);
    carpenter.AddModel(Network);
}
