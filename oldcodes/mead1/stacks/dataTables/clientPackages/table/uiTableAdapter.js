class uiTableAdapter {
    //Functionality
    allowFilter = false; //Not Yet available
    addUndefinedColumns = true;
    maxSelectedRows = 1; //The number of rows a user can select. -1 is unlimited.
    maxSortCols = 1; //The Number of columns a user can sort by. -1 is unlimited.
    
    //Events
    async onSelect(sender, rowData, column) {
        return true;
    }

    //Data
    tableRows=null;
    allColumns={};
    displayColumns=[];
    indexField="";
    sortColumns=[];
    sortDirections=[];
    #domTable = null;

    constructor(options) {
    
    }

    async setParameters(parameters) {
/*Parameters should look like:
columns:
*/
        if (!parameters) return;
        
        if (parameters.tableRows)
            this.setData(parameters.tableRows);
    }
    async renderDOM(destDOM) {
        if (destDOM) this.parentDOM=destDOM;
        if (!this.tableRows) return false; 
        this.renderHTML(this.parentDOM);
    }

    addColumn(options, position) {
        if (options instanceof String || typeof options === "string") {
            //Only the name is passed
            options = {name: options};
        }   
        this.allColumns[options.name] = new uiTableColumn(options);     
    }
    setData(options) {
        //options = {dataArray: [], idxField: ''} //idxField is optional. A self-increasing numerical index will be used
        //options = {rowDictionary: {}, idxField: ''} //idxField is optional
        if (Array.isArray(options)) {
            options={ dataArray: options }
            this.tableRows=options.dataArray;
        }
    }
    
    addUpdateData(newData) {
        //This will add or update data
    }
    removeData(idx) {
        //value of the indexField to remove.
    }
    syncData(inArray) {
        //This will accept an array of rows.
        //New data will be added or updated

    }

    renderHTML(div) {
        let columns = [];
        //If there aren't any columns defined, get them from the datasource.
        if (Object.keys(this.allColumns).length==0) {
            for (let test in this.tableRows[0])
                this.addColumn({name: test, dataValue: '"'+test+'"'});
        }

        //Convert the uiTable column objects to something usable here.
        
        for (var idx in this.allColumns) {
            var col = this.allColumns[idx]
            columns.push({ data: col.name, label: col.displayColumns });
        }


        this.#domTable = document.createElement("table");
        div.appendChild(this.#domTable);
        new DataTable(this.#domTable, { data: this.tableRows, columns});        
        return true;
    }

    setSort(inValues) {
    }

    doSort() {
    }
}
