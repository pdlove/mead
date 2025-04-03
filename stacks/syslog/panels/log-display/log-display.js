class LogDisplay {
    parentDOM = null; //This is the DOM where the HTML file was loaded.
    tableDOM = null;
    tableObject = null;

    stack = null;
    model = null;
    submodel = null;
    filter = '';

    async setParameters(parameters) {
        if (!parameters) return;
        this.stack = parameters.stack;
        this.model = parameters.model;
        this.submodel = parameters.submodel || [];
        this.filter = parameters.filter || '';

        //this.panel = parameters.panel;
    }

    async renderDOM(destDOM) {
        if (destDOM) this.parentDOM = destDOM;


        // Add event listeners to the refresh-button and filter-button
        const refreshButton = this.parentDOM.querySelector('#refresh-button');
        const filterButton = this.parentDOM.querySelector('#filter-button');

        if (refreshButton) {
            refreshButton.addEventListener('click', () => this.updateDOM());
        }

        if (filterButton) {
            filterButton.addEventListener('click', () => this.updateDOM());
        }

        const filterField = this.parentDOM.querySelector('#filter-json');
        if (typeof this.filter === 'string') {
            try {
                filterField.value = this.filter;
            } catch (err) {
                filterField.value = JSON.stringify(this.filter);
            }
        }

        this.tableDOM = this.parentDOM.querySelector('#thisTable');

        this.tableObject = await loadClientPackage("system.uiTable", this.tableDOM);
        console.log("Created uiTable");

        this.tableObject.addColumn({ name: "sourceIP", caption: "Source", type: "string" });
        this.tableObject.addColumn({ name: "time", caption: "Log Time", type: "datetime" });
        this.tableObject.addColumn({ name: "severity", caption: "Severity", type: "enum", valueMap: { "0": "Emergency(0)", "1": "Alter(1)", "2": "Critical(2)", "3": "Error(3)", "4": "Warning(4)", "5": "Notice(5)", "6": "Informational(6)", "7": "Debug(7)" } });
        this.tableObject.addColumn({ name: "facility", caption: "Facility", type: "enum", valueMap: { "0": "kernel(0)", "1": "user(1)", "2": "mail(2)", "3": "daemon(3)", "4": "auth(4)", "5": "syslog(5)", "6": "lpr(6)", "7": "news(7)", "8": "uucp(8)", "9": "cron(9)", "10": "authpriv(10)", "11": "clock(11)", "12": "local0(12)", "13": "local1(13)", "14": "local2(14)", "15": "local3(15)", "16": "local4(16)", "17": "local5(17)", "18": "local6(18)", "19": "local7(19)", "20": "local8(20)", "21": "local9(21)", "22": "local10(22)", "23": "local11(23)" } });
        this.tableObject.addColumn({ name: '"logentrymessage.message"', caption: "Message", type: "string" });
        this.tableObject.setSort("sourceIP");
        await this.updateDOM();
    }
    
    async updateDOM() {
        // Get the filter value from the text field with ID 'filter-json'
        const filterField = this.parentDOM.querySelector('#filter-json');
        const filterValue = filterField ? filterField.value : '';

        // Get the page size value from the dropdown with ID 'page-size'
        const pageSizeField = this.parentDOM.querySelector('#page-size');
        const pageSizeValue = pageSizeField ? pageSizeField.value : '1000'; // Default to 1000 if not set
        if (pageSizeValue === 'all') pageSizeValue = -1;

        // Pass the filter value as a parameter to the system/model API call
        let apiUrl = `system/model/${this.stack}/${this.model}`;
        const queryParams = [];
        if (this.submodel.length>0) queryParams.push(`submodel=${JSON.stringify(this.submodel)}`);
        if (filterValue) queryParams.push(`filter=${encodeURIComponent(filterValue)}`);
        if (pageSizeValue) {
            queryParams.push(`pageSize=${pageSizeValue}`);
            queryParams.push(`pageNum=1`);
        }
        if (queryParams.length > 0) apiUrl += `?${queryParams.join('&')}`;
    
        this.data = (await API.getAPIData(apiUrl)).items;

        this.tableObject.setData(this.data);
        this.tableObject.renderDOM(this.tableDOM);
    }
}