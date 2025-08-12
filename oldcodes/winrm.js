const http = require('http'); // For HTTP requests
const xml2js = require('xml2js'); // For parsing XML responses

// --- Configuration ---
const targetIp = '172.16.11.8'; // Replace with your Windows machine's IP or hostname
const port = 5985; // Default HTTP port for WinRM
const username = 'Administrator'; // Replace with your Windows username
const password = 'Passw0rd!'; // Replace with your Windows password

// --- WMI Query Details ---
// The Resource URI for enumerating Win32_Service instances
//const resourceUri = 'http://schemas.microsoft.com/wbem/wsman/1/wmi/root/cimv2/Win32_Service';
const resourceUri = 'http://schemas.microsoft.com/wbem/wsman/1/wmi/root/cimv2/Win32_OperatingSystem';
// The WS-Management Action URI for an Enumerate operation
const actionUri = 'http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate';

// --- Build the Basic Authentication Header ---
const authString = Buffer.from(`${username}:${password}`).toString('base64');
const authHeader = `Basic ${authString}`;

// --- Construct the SOAP XML Request Body ---
// This is the XML for a WS-Management Enumerate request
const soapRequestBody = `<s:Envelope
    xmlns:s="http://www.w3.org/2003/05/soap-envelope"
    xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing"
    xmlns:n="http://schemas.xmlsoap.org/ws/2004/09/enumeration"
    xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd"
    xmlns:p="http://schemas.microsoft.com/wbem/wsman/1/wsman.xsd"
    xmlns:b="http://schemas.dmtf.org/wbem/wsman/1/cimbinding.xsd">
    <s:Header>
        <a:To>http://ptest:5985/wsman</a:To>
        <w:ResourceURI s:mustUnderstand="true">http://schemas.microsoft.com/wbem/wsman/1/wmi/root/__NAMESPACE</w:ResourceURI>
        <a:ReplyTo>
            <a:Address s:mustUnderstand="true">http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address>
        </a:ReplyTo>
        <a:Action s:mustUnderstand="true">http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action>
        <w:MaxEnvelopeSize s:mustUnderstand="true">512000</w:MaxEnvelopeSize>
        <a:MessageID>uuid:${require('crypto').randomUUID()}</a:MessageID>
        <w:Locale xml:lang="en-US" s:mustUnderstand="false" />
        <p:DataLocale xml:lang="en-US" s:mustUnderstand="false" />
        <p:SessionId s:mustUnderstand="false">uuid:${require('crypto').randomUUID()}</p:SessionId>
        <p:OperationID s:mustUnderstand="false">uuid:${require('crypto').randomUUID()}</p:OperationID>
        <p:SequenceId s:mustUnderstand="false">1</p:SequenceId>
        <w:OperationTimeout>PT60.000S</w:OperationTimeout>
    </s:Header>
    <s:Body>
        <n:Enumerate>
            <w:OptimizeEnumeration/>
            <w:MaxElements>32000</w:MaxElements>
        </n:Enumerate>
    </s:Body>
</s:Envelope>`;

// --- HTTP Request Options ---
const options = {
    hostname: targetIp,
    port: port,
    path: '/wsman',
    method: 'POST',
    headers: {
        'Content-Type': 'application/soap+xml; charset=UTF-8',
        'Content-Length': Buffer.byteLength(soapRequestBody),
        'SOAPAction': actionUri, // Explicitly include SOAPAction header
        'Authorization': authHeader
    }
};

console.log(`Attempting to connect to WinRM at: http://${targetIp}:${port}/wsman`);
console.log(`Querying WMI class: ${resourceUri}`);
console.log(`Using Basic Authentication.`);

let responseData = '';

const req = http.request(options, (res) => {
    console.log(`Status Code: ${res.statusCode}`);
    console.log(`Headers: ${JSON.stringify(res.headers)}`);

    res.on('data', (chunk) => {
        responseData += chunk;
    });

    res.on('end', () => {
        console.log('\n--- Raw SOAP XML Response ---');
        console.log(responseData);

        // Parse the XML response
        xml2js.parseString(responseData, { explicitArray: false, ignoreAttrs: true, tagNameProcessors: [xml2js.processors.stripPrefix] }, (err, result) => {
            if (err) {
                console.error('\nError parsing XML response:', err);
                return;
            }

            // Check for SOAP Faults (errors)
            if (result.Envelope && result.Envelope.Body && result.Envelope.Body.Fault) {
                const fault = result.Envelope.Body.Fault;
                console.error('\n--- SOAP Fault (Error) ---');
                console.error(`Code: ${fault.Code && fault.Code.Subcode && fault.Code.Subcode.Value}`);
                console.error(`Reason: ${fault.Reason && fault.Reason.Text}`);
                console.error(`Detail: ${fault.Detail && fault.Detail.XMLFault && fault.Detail.XMLFault.WSManFault && fault.Detail.XMLFault.WSManFault.Message}`);
                return;
            }

            // --- Process the Enumerate Response ---
            // The WinRM enumerate response can be in different structures.
            // Look for 'EnumerateResponse' containing 'Items' or 'PullResponse' if more are needed.
            if (result.Envelope && result.Envelope.Body) {
                const body = result.Envelope.Body;

                let services = [];
                let enumerationContext = null;

                // Check for initial enumerate response
                if (body.EnumerateResponse && body.EnumerateResponse.Items) {
                    services = body.EnumerateResponse.Items.Win32_Service || [];
                    if (!Array.isArray(services)) { // Ensure it's an array if only one item
                        services = [services];
                    }
                    enumerationContext = body.EnumerateResponse.EnumerationContext;
                } else if (body.PullResponse && body.PullResponse.Items) {
                     services = body.PullResponse.Items.Win32_Service || [];
                     if (!Array.isArray(services)) {
                         services = [services];
                     }
                     enumerationContext = body.PullResponse.EnumerationContext;
                }


                if (services.length > 0) {
                    console.log('\n--- Parsed List of Services (Win32_Service) ---');
                    services.forEach(service => {
                        console.log(`  Name: ${service.Name || 'N/A'}`);
                        console.log(`    Display Name: ${service.DisplayName || 'N/A'}`);
                        console.log(`    State: ${service.State || 'N/A'}`);
                        console.log(`    Start Mode: ${service.StartMode || 'N/A'}`);
                        console.log('--------------------');
                    });
                    console.log(`\nFound ${services.length} services.`);
                } else {
                    console.log('\nNo services found in the response or unexpected data structure.');
                    console.log('Full parsed body (for debugging):', JSON.stringify(body, null, 2));
                }

                // If an EnumerationContext is returned, it means there are more items to pull
                if (enumerationContext) {
                    console.log('\n--- Enumeration Context Present ---');
                    console.log('More items available. You would typically send a subsequent "Pull" request');
                    console.log(`  EnumerationContext: ${enumerationContext}`);
                    // To get all services, you would implement a loop with `Pull` requests
                    // using this context until no more items or no context is returned.
                    // This is significantly more complex and beyond a simple "get list" example.
                }

            } else {
                console.log('\nUnexpected SOAP body structure or no data.');
                console.log(JSON.stringify(result, null, 2));
            }
        });
    });
});

req.on('error', (e) => {
    console.error(`\nProblem with request: ${e.message}`);
});

// Write data to request body
req.write(soapRequestBody);
req.end();