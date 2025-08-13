'use strict';


class discovery_MerakiCloud {
    constructor(config) {
        config = { apiKey: '7bd3192187fde05823c58cdd20be5fed17683ea6', clientFetch: 168, clientUsage: 1, airMarshallFetch: 24 };
        this.MerakiCloud = {};
        this._config=config;
    }
    _APIGet(url, callback) {
        if (!this._config||!this._config.apiKey) {
            return; //Maybe throw a not configured error?
        }
        var options = { uri: url, headers: { "X-Cisco-Meraki-API-Key": this._config.apiKey }, json:true }
        return requestWeb(options);
    }
    async _APIGetSync(url) {
        var response = null;
        try {
            response = await this._APIGet(url);
        }
        catch (e) {
            console.log("Error with Web Call. URL: "+url+" \nError: "+e);
            return undefined;
        }
        return response;
    }
    async GetOrganizations(includeSubOjects, callback) {
        //Get the Organizations - https://dashboard.meraki.com/api/v0/organizations
        var myOrganizations = [];
        myOrganizations = await this._APIGetSync('https://dashboard.meraki.com/api/v0/organizations');
        if (includeSubOjects)
            for (var i=0;i<myOrganizations.length;i++) {
                var organizationID = myOrganizations[i].id;
                myOrganizations[i]._networks = await this._APIGetSync('https://dashboard.meraki.com/api/v0/organizations/'+organizationID+'/networks');
                myOrganizations[i]._administrators = await this._APIGetSync('https://dashboard.meraki.com/api/v0/organizations/'+organizationID+'/admins');
                myOrganizations[i]._3rdPartyVPN = await this._APIGetSync('https://dashboard.meraki.com/api/v0/organizations/'+organizationID+'/thirdPartyVPNPeers');
                myOrganizations[i]._snmp = await this._APIGetSync('https://dashboard.meraki.com/api/v0/organizations/'+organizationID+'/snmp');
                myOrganizations[i]._inventory = await this._APIGetSync('https://dashboard.meraki.com/api/v0/organizations/'+organizationID+'/inventory');
                myOrganizations[i]._license = await this._APIGetSync('https://dashboard.meraki.com/api/v0/organizations/'+organizationID+'/licenseState');
                //Populate the Nework Sub Information
                for (var j=0;j<myOrganizations[i]._networks.length;j++) {
                    console.log("Fetching Network Information for: "+myOrganizations[i]._networks[j].name)
                    var networkID = myOrganizations[i]._networks[j].id;
                    var networkType = myOrganizations[i]._networks[j].type;
                    if (networkType==='systems manager') {
                        myOrganizations[i]._networks[j]._systemsManagerDevices = await this._APIGetSync('https://dashboard.meraki.com/api/v0/networks/'+networkID+'/sm/devices');
                    } else {
                        myOrganizations[i]._networks[j]._devices = await this._APIGetSync('https://dashboard.meraki.com/api/v0/networks/'+networkID+'/devices');
                        myOrganizations[i]._networks[j]._staticRoutes = await this._APIGetSync('https://dashboard.meraki.com/api/v0/networks/'+networkID+'/staticRoutes');
                        myOrganizations[i]._networks[j]._vlans = await this._APIGetSync('https://dashboard.meraki.com/api/v0/networks/'+networkID+'/vlans');
                        if ((networkType==='appliance')||(networkType==='combined')) 
                            myOrganizations[i]._networks[j]._VPNSettings = await this._APIGetSync('https://dashboard.meraki.com/api/v0/networks/'+networkID+'/siteToSiteVpn');
                        if ((networkType==='wireless')||(networkType==='combined')) {
                            myOrganizations[i]._networks[j]._SSIDs = await this._APIGetSync('https://dashboard.meraki.com/api/v0/networks/'+networkID+'/ssids');
                            myOrganizations[i]._networks[j]._airMarshallResults = await this._APIGetSync('https://dashboard.meraki.com/api/v0/networks/'+networkID+'/airMarshal?timespan='+(this._config.airMarshallFetch*60*60));
                        }
                        for (var k=0;k<myOrganizations[i]._networks[j]._devices.length;k++) {
                            var serialNumber = myOrganizations[i]._networks[j]._devices[k].serial;
                            myOrganizations[i]._networks[j]._devices[k]._uplinks = await this._APIGetSync('https://dashboard.meraki.com/api/v0/networks/'+networkID+'/devices/'+serialNumber+'/uplink');
                            myOrganizations[i]._networks[j]._devices[k]._clients = await this._APIGetSync('https://dashboard.meraki.com/api/v0/devices/'+serialNumber+'/clients?timespan='+(this._config.clientFetch*60*60));
                            if (myOrganizations[i]._networks[j]._devices[k].model.startsWith('MS'))
                                myOrganizations[i]._networks[j]._devices[k]._ports = await this._APIGetSync('https://dashboard.meraki.com/api/v0/devices/'+serialNumber+'/switchPorts');
                        }
                    }
                }

            }
        callback(myOrganizations);
    }
}

module.exports.discovery_MerakiCloud=discovery_MerakiCloud