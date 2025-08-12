xid = 0; //Semi-unique
packetType =0;
isRequest = false;

useBroadcast = false;
hwAddress = '';
hwType = 0; //Part of Client Identifier

serverAddress = '';
relayAddress = ''; //If relayed
relayHops = 0;

clientIdentifier = '';


if (op==1) isRequest = true;

ciaddr	4	Client IP address (if known)
yiaddr	4	"Your" IP address (offered by server)
siaddr	4	Server IP address

otherOptions = {};

class dhcpLease

clientName = '';
domainName = '';

clientAddress = '';
hwAddress = '';
hwType = 0;

leaseType = ''; //Dynamic, Reserved, Static

serverAddress = ''; //Which server received the request. A Client will have the Server in the request. The server will store the relay.
relayHops = 0; // This is stored because, if you have no relays, it should always be 0. 

options = {};