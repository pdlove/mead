var rp = require('request-promise-native');
var cheerio = require('cheerio'); // Basically jQuery for node.js
var initCometClient = require('./cometd-nodejs-client');
var myComet = require('cometd');
var whois = require('node-whois');

//Please note. This library is unsupported.
class MerakiDirect {
    constructor() {
        this.myCookie = '';
        this.isAuthenticated = false;
        this.merakiHost = 'account.meraki.com';
    }
    AuthenticateMeraki_Sync(username, password) {
        return new Promise(
            function (resolve, reject) {
                this.AuthenticateMeraki(username, password,
                    function (success) { resolve(success) })
            }.bind(this));
    }
    async AuthenticateMeraki(username, password, callback) {
        //Set the initial sign in options and call for the login page
        var options = {
            uri: 'https://account.meraki.com/secure/login/dashboard_login',
            resolveWithFullResponse: true, followRedirect: true, followAllRedirects: true,
            headers: {} //We set this up so it's easier to add the cookie later.
        };
        var response = await rp(options);

        //Get the cookie that was given in the response header.
        this.myCookie = response.headers["set-cookie"][0];
        var cookieJar = rp.jar();
        cookieJar.setCookie(this.myCookie, 'https://*.meraki.com');
        //Use Cheerio to make it easier to get the utf8 value and the authenticity_token value
        var $ = cheerio.load(response.body);
        //Build the Post reply for the login.
        options.formData = {
            utf8: $('input[name="utf8"]').val(),
            authenticity_token: $('input[name="authenticity_token"]').val(),
            email: username,
            password: password,
            commit: 'Log in', goto: 'manage'
        };
        options.method = 'POST';
        options.uri = "https://account.meraki.com/secure/login/login"
        options.jar = cookieJar;
        //options.headers.cookie =  this.myCookie; //Add the cookie from earlier. This lets the server know we support cookies.
        response = await rp(options);

        this.myCookie = response.request.headers.cookie;
        this.merakiHost = response.request.host;

        this.mkiconf = ParseMkiconf(response.body);
        //cookiejar for comet
        var CometCookieJar = {};
        CometCookieJar[this.merakiHost] = [this.myCookie];
        // Obtain the CometD APIs. 
        initCometClient.adapt(CometCookieJar);
        // Create the CometD object. 
        var cometd = new myComet.CometD();
        this.cometd = cometd;
        this.cometd.configure({
            url: 'https://' + this.merakiHost + '/cometd'
        });

        //Do the handshake.
        this.cometd.handshake(
            function (h) {
                callback(h.successful);
            });
    }
    AuthenticateMerakiSync(username, password) {
        var that = this;
        return new Promise(function (resolve, reject) {
            that.AuthenticateMeraki(username, password,
                function (data) {
                    resolve(data)
                })
        });
    }
    runMerakiCommand_Node(nodeid, command, callback) {
        this.cometd.subscribe('/node/' + nodeid + '/' + command, function (m) {
            var dataFromServer = m.data;
            // Use dataFromServer. 
        });
        this.cometd.publish("/requests", { node_id: nodeid, type: command });
    }
    stopMerakiCommand_Node(nodeid, command) {
        this.cometd.unsubscribe('/node/' + nodeid + '/' + command);
    }

    //The following functions are very specific implementations
    async getMerakiNetworks() {
        var myResponse = await makeAPICall(this.merakiHost, '/n/' + this.mkiconf.ng_eid + '/manage/organization/org_json', this.myCookie);
        var orgLayout = JSON.parse(myResponse.body);
        var finalOrgLayout = {};
        for (var locationID in orgLayout.locales) {
            finalOrgLayout[locationID] = orgLayout.locales[locationID];
            finalOrgLayout[locationID].merakiNetworks = {}
            for (var i = 0; i < finalOrgLayout[locationID].ngs.length; i++) {
                var networkID = finalOrgLayout[locationID].ngs[i];
                finalOrgLayout[locationID].merakiNetworks[networkID] = orgLayout.networks[networkID];
            }
        }
        return finalOrgLayout;
    }
    async getMerakiNetworkNodes(networkEID) {
        var replyNetworkNodes = await makeAPICall(this.merakiHost, '/n/' + networkEID + '/manage/nodes/json', this.myCookie);
        var strNetworkNodes = replyNetworkNodes.body;
        if (strNetworkNodes[0] === '(') strNetworkNodes = strNetworkNodes.slice(1, strNetworkNodes.length - 1);
        var objNetworkNodes = JSON.parse(strNetworkNodes);
        return objNetworkNodes.nodes;
    }
    async getMerakiNetworkClients(networkEID) {
        var replyNetworkClients = await makeAPICall(this.merakiHost, '/n/' + networkEID + '/manage/usage/client_list_json', this.myCookie);
        var strNetworkClients = replyNetworkClients.body;
        var objNetworkClients = JSON.parse(strNetworkClients);
        var clientList = {};
        for (var i=0;i<objNetworkClients.clients.length;i++) {
            var merakiClient = objNetworkClients.clients[i];
            var newClient = {};
            for (var j=0;j<merakiClient.length;j++) {
                newClient[objNetworkClients.fields[j]]=merakiClient[j];
            }
            var firstOfMAC = newClient['mac'].slice(0,8);
            newClient.manufacturer=objNetworkClients.ouis[firstOfMAC];
            clientList[newClient['mac']]=newClient;
        }
        return clientList;
    }

    async getMerakiNodeARPTable(nodeID, deviceType) {
        var that = this;
        var devType = deviceType[0] + deviceType[1];
        var test = await new Promise((resolve, reject) => {
            var mySubscription = that.cometd.subscribe('/node/' + nodeID + '/' + devType + 'ArpTable', function (m) {
                resolve(m.data);
                that.cometd.unsubscribe(mySubscription);
            });
            that.cometd.publish("/requests", { node_id: nodeID, type: devType + 'ArpTable' });
        })
        var decodedMACTable = {};
        var i = 0;
        if (test.wan1_entries) {
            for (i = 0; i < test.wan1_entries.length; i++) {
                var myEntry = test.wan1_entries[i];
                decodedMACTable[myEntry.mac] = {
                    Source: 'WAN1',
                    vlan: myEntry.vlan,
                    age: myEntry.age,
                    mac: myEntry.mac,
                    ip: myEntry.ip
                };
            }
        }
        if (test.wan2_entries) {
            for (i = 0; i < test.wan2_entries.length; i++) {
                var myEntry = test.wan2_entries[i];
                decodedMACTable[myEntry.mac] = {
                    Source: 'WAN2',
                    vlan: myEntry.vlan,
                    age: myEntry.age,
                    mac: myEntry.mac,
                    ip: myEntry.ip
                };
            }
        }
        if (test.entries) {
            for (i = 0; i < test.entries.length; i++) {
                var myEntry = test.entries[i];
                decodedMACTable[myEntry.mac] = {
                    Source: 'VLAN' + myEntry.vlan,
                    vlan: myEntry.vlan,
                    age: myEntry.age,
                    mac: myEntry.mac,
                    ip: myEntry.ip
                };
            }
        }
        return decodedMACTable;
    }

    async getMerakiNodeTraceRoute(nodeID, DestIP, WANID) { //WanID is 1 or 2.
        var pid = Math.floor(Math.random() * (2000 - 100 + 1)) + 100;
        var that = this;
        var test = await new Promise((resolve, reject) => {
            var receivedData = [];
            var mySubscription = that.cometd.subscribe('/node/' + nodeID + '/CommandStream/'+pid, function (m) {
                if (m.data.chunk!==undefined) receivedData.push(m.data.chunk);
                if (m.data.completed) {
                    that.cometd.unsubscribe(mySubscription);
                    resolve(receivedData)
                }
            });
            that.cometd.publish("/requests", { node_id: nodeID, type: 'CommandStream', pid: pid, broker: "CommandStream", command: "traceroute", host: DestIP, interface: "wired"+WANID });
        });
        var tracertOutput={};
        var ipInfo={};
        for (var i=1;i<test.length;i++) {
            test[i] = test[i].trim();
            while (test[i].indexOf('  ')>0) test[i] = test[i].replace('  ',' ');
            var myLines = test[i].split('\n');
            for (var j=0;j<myLines.length;j++) {
                var splitLine = myLines[j].split(' ');
                var traceHop = { hopID: splitLine[0] };
                traceHop.firstHost = splitLine[1];
                traceHop.firstIP = splitLine[2]
                if (traceHop.firstIP.startsWith('(')) traceHop.firstIP = traceHop.firstIP.slice(1,traceHop.firstIP.length-1);
                traceHop.packets=[];
                var k = 1;
                var msTotal=0;
                var tracePacket = {}

                var host=traceHop.firstHost;
                var ip=traceHop.firstIP;
                
                while ((k+1)<splitLine.length) {
                    if (splitLine[k+1]!=='ms') {
                        host = splitLine[k];
                        ip = splitLine[k+1];
                        if (ip.startsWith('(')) ip = ip.slice(1,ip.length-1);
                        k+=2;
                    } 
                    if (!ipInfo[ip]) {
                        ipInfo[ip] = {}//await new Promise((resolve, reject) => { whois.lookup(ip, function(err, data) { resolve(data); }) });
                    }
                    msTotal+=splitLine[k];
                    traceHop.packets.push({ host: host, ip: ip, ms: splitLine[k], ipInfo: ipInfo[ip] })
                    k+=2;
                    traceHop.avgMS = msTotal/traceHop.length;
                }
                tracertOutput[traceHop.hopID]=traceHop;
            }
        }
        return tracertOutput;
        
    }
    async getMerakiNetworkConfiguration(networkEID) {
        var replyNetworkConfig = await makeAPICall(this.merakiHost, '/n/' + networkEID + '/manage/configure/router_settings', this.myCookie);
        var strNetworkConfig = replyNetworkConfig.body;
        var startChar = strNetworkConfig.indexOf('csui.init')+10;
        var endChar=strNetworkConfig.indexOf('"subtab"')-1;
        var jsonNetworkConfig = strNetworkConfig.slice(startChar, endChar)+' "subtab": "" }';
        var objNetworkConfig=JSON.parse(jsonNetworkConfig);
        return objNetworkConfig.config;
    }
}

async function makeAPICall(host, url, cookie) {
    var cookieJar = rp.jar();
    cookieJar.setCookie(cookie, 'https://' + host);
    var options = {
        uri: 'https://' + host + url,
        resolveWithFullResponse: true, followRedirect: true, followAllRedirects: true, jar: cookieJar
    };
    return await rp(options);
}
function ParseMkiconf(inHTML) {
    Mkiconf = {};
    var window = { Mkiconf: {} }; //prep the window variable so this will execute properly
    var startChar = inHTML.indexOf('Mkiconf = window.Mkiconf');
    var endChar = inHTML.indexOf('</script>', startChar) - 1;
    var mkistr = inHTML.slice(startChar, endChar);
    eval(mkistr);
    return Mkiconf;
}

var myCookies = [];
var cookieJar;
async function AuthenticateMeraki(username, password) {
    // Create the CometD object. 
    var cometd = new lib.CometD();


    // Configure the CometD object. 
    cometd.configure({
        url: 'https://' + response.request.host + '/cometd', logLevel: "debug"
    });

    // Handshake with the server. 
    cometd.handshake(function (h) {
        if (h.successful) {
            // Subscribe to receive messages from the server. 
            cometd.subscribe('/node/8765988/MXArpTable', function (m) {
                var dataFromServer = m.data;
                // Use dataFromServer. 
            });
            cometd.publish("/requests", { node_id: "8765988", type: "MXArpTable" });
        }
    });

}


module.exports.MerakiDirect = MerakiDirect;