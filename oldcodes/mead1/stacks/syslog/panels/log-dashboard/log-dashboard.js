class LogDashboard {
    parentDOM = null; //This is the DOM where the HTML file was loaded.
    tableDOM = null;
    tableObject = null;

    stack = null;
    model = null;

    async setParameters(parameters) {
        if (!parameters) return;
        this.stack = parameters.stack;
        this.model = parameters.model;
        //this.panel = parameters.panel;
    }

    async loadScreen() {
        var myTable = new uiTable();

    }
    async renderDOM(destDOM) {
        if (destDOM) this.parentDOM = destDOM;

        // Set default date range to the last 24 hours in local time
        const now = new Date();
        const toDateTime = toISOLocal(now).slice(0, 16); // Current date/time in 'YYYY-MM-DDTHH:mm' format
        const fromDateTime = toISOLocal(new Date(now.getTime() - 24 * 60 * 60 * 1000)).slice(0, 16); // 24 hours ago
    
        document.getElementById('to-datetime').value = toDateTime;
        document.getElementById('from-datetime').value = fromDateTime;


        // Add event listeners to the refresh-button and filter-button
        const refreshButton = this.parentDOM.querySelector('#refresh-button');
        if (refreshButton) {
            refreshButton.addEventListener('click', () => this.updateDOM());
        }




        this.tableDOM = this.parentDOM.querySelector('#thisTable');
        console.log("Created uiTable");
        this.tableObject = await loadClientPackage("system.uiTable", this.tableDOM);
        this.tableObject.addColumn({ name: "sourceIP", caption: "Source", type: "string" });
        this.tableObject.addColumn({ name: "total_entries", caption: "Log Count", type: "integer", renderer: this.renderSyslogAllLink });
        this.tableObject.addColumn({ name: "latest_log_datetime", dataValue: "latest_log_time", caption: "Last Log", type: "datetime" });
        this.tableObject.addColumn({ name: "severity_0_count", caption: "Emergency", type: "integer", renderer: this.renderSyslogSeverityLink });
        this.tableObject.addColumn({ name: "severity_1_count", caption: "Alert", type: "integer", renderer: this.renderSyslogSeverityLink });
        this.tableObject.addColumn({ name: "severity_2_count", caption: "Critical", type: "integer", renderer: this.renderSyslogSeverityLink });
        this.tableObject.addColumn({ name: "severity_3_count", caption: "Error", type: "integer", renderer: this.renderSyslogSeverityLink });
        this.tableObject.addColumn({ name: "severity_4_count", caption: "Warning", type: "integer", renderer: this.renderSyslogSeverityLink });
        this.tableObject.addColumn({ name: "severity_5_count", caption: "Notice", type: "integer", renderer: this.renderSyslogSeverityLink });
        this.tableObject.addColumn({ name: "severity_6_count", caption: "Informational", type: "integer", renderer: this.renderSyslogSeverityLink });
        this.tableObject.addColumn({ name: "severity_7_count", caption: "Debug", type: "integer", renderer: this.renderSyslogSeverityLink });
        this.tableObject.setSort("sourceIP");
        await this.updateDOM();
    }


    renderSyslogSeverityLink(row, column, dataType, rawValue) { 
        //return this.defaultRenderer(row, column, dataType, rawValue) 
        const sourceIP = row.sourceIP;
        const fromDate = document.getElementById('from-datetime').value;
        const toDate = document.getElementById('to-datetime').value;
        const severity = column[0][9]; // Extract the severity level from the column name like "severity_0_count"
        const displayValue = this.defaultRenderer(row, column, dataType, rawValue);
        return `<a onclick="LogDashboard.displayLogEntries('${sourceIP}', '${fromDate}', '${toDate}', ${severity});">${displayValue}</a>`;
    };

    static async displayLogEntries(IP, fromDate, toDate, severity) {
        let filter = "sourceIP = '"+IP+"' AND severity = "+severity+" AND time BETWEEN '"+fromDate+"' AND '"+toDate+"'";
        await loadClientPackage("syslog.log-display", document.getElementById("content"), {"stack":"syslog","model":"logentry", "submodel": ["syslog.logentrymessage"] ,"filter": filter});     
    }

    async updateDOM() {
        // Get the "From" and "To" datetime values from the input fields
        const fromDateTimeField = this.parentDOM.querySelector('#from-datetime');
        const toDateTimeField = this.parentDOM.querySelector('#to-datetime');

        const fromDateTime = fromDateTimeField ? fromDateTimeField.value : null;
        const toDateTime = toDateTimeField ? toDateTimeField.value : null;


        // Pass the filter value as a parameter to the system/model API call
        let apiUrl = `syslog/dashboard/summary`;
        const queryParams = [];
        if (fromDateTime) queryParams.push(`from=${encodeURIComponent(fromDateTime)}`);
        if (toDateTime) queryParams.push(`to=${encodeURIComponent(toDateTime)}`);
        if (queryParams.length > 0) apiUrl += `?${queryParams.join('&')}`;
    
        this.data = (await API.getAPIData(apiUrl));

        this.tableObject.setData(this.data);
        this.tableObject.renderDOM(this.tableDOM);
    }
}
function toISOLocal(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
  
    const timezoneOffsetMinutes = date.getTimezoneOffset();
    const timezoneOffsetHours = String(Math.floor(Math.abs(timezoneOffsetMinutes) / 60)).padStart(2, '0');
    const timezoneOffsetMins = String(Math.abs(timezoneOffsetMinutes) % 60).padStart(2, '0');
    const timezoneSign = timezoneOffsetMinutes > 0 ? '-' : '+';
  
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${timezoneSign}${timezoneOffsetHours}:${timezoneOffsetMins}`;
  }
