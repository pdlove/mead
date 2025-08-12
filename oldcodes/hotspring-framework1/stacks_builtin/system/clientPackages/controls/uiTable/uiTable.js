class uiTable {
    //Functionality
    tableID = "Table1"; //The ID of the table. This is used to identify the table in the DOM.
    maxSelectedRows = 1; //The number of rows a user can select. -1 is unlimited.

    addUndefinedColumns = true;
    allowFilter = false; //Not Yet available
    allowSort = true; //Not Yet available
    allowMultiSort = false; //Not Yet available
    allowColumnReorder = false; //Current WIP
    allowColumnResize = false; //Not Yet available
    allowColumnGrouping = false; //Not Yet available
    allowColumnHide = false; //Not Yet available

    //Events
    async onSelect(sender, rowData, column) {
        return true;
    }

    //Data
    tableRows = null;
    allColumns = {};
    displayColumns = [];
    indexField = "";
    sortColumns = [];
    sortDirections = [];
    #domTableContainer = null;
    #domTable = null;
    #domTHead = null;
    #domTBody = null;
    #dropIndicator = null;
    constructor(options) { }

    async setParameters(parameters) {
        /*Parameters should look like:
    columns:
    */
        if (!parameters) return;

        if (parameters.tableRows) this.setData(parameters.tableRows);
    }
    async renderDOM(destDOM) {
        if (destDOM) this.parentDOM = destDOM;
        if (!this.tableRows) return false;
        this.renderHTML(this.parentDOM);
    }

    addColumn(options, position) {
        if (options instanceof String || typeof options === "string") {
            //Only the name is passed
            options = { name: options };
        }
        this.allColumns[options.name] = new uiTableColumn(options);
        this.allColumns[options.name].parentTable = this;
    }
    setData(options) {
        //options = {dataArray: [], idxField: ''} //idxField is optional. A self-increasing numerical index will be used
        //options = {rowDictionary: {}, idxField: ''} //idxField is optional
        if (Array.isArray(options)) {
            options = { dataArray: options };
            this.tableRows = options.dataArray;
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
        div.innerHTML = "";

        if (this.tableRows.length === 0) div.innerHTML = "No Data to Display";

        //If there aren't any columns defined, get them from the datasource.
        if (Object.keys(this.allColumns).length == 0) {
            for (let test in this.tableRows[0])
                this.addColumn({ name: test, dataValue: '"' + test + '"' });
        }

        //If There aren't any display columns dump all of them into the display.
        if (this.displayColumns.length === 0)
            for (var fieldname in this.allColumns)
                this.displayColumns.push(fieldname);

        this.#domTableContainer = document.createElement("div");
        this.#domTableContainer.classList.add("uiTableDenseDiv");

        this.#domTable = document.createElement("table");
        //this.#domTable.classList.add("uiTable");
        this.#domTable.classList.add("uiTableDense");
        // this.#domTable.classList.add("table-sm");
        // this.#domTable.classList.add("table-bordered");
        this.#domTable.classList.add("table-striped");

        this.#domTableContainer.appendChild(this.#domTable);

        this.#domTHead = document.createElement("thead");
        this.#domTable.appendChild(this.#domTHead);
        var domRow = document.createElement("tr");
        this.#domTHead.appendChild(domRow);
        for (var idx in this.displayColumns) {
            var col = this.allColumns[this.displayColumns[idx]];
            var domCol = document.createElement("th");
            domCol.innerHTML = col.caption;
            domCol.dataset.fieldName = col.name;
            domCol.dataset.sort = 0;
            let fname = domCol.dataset.fieldName;
            domCol.addEventListener("click", this.headerClick.bind(col));

            //drag and drop
            // Check if the drop indicator already exists
            this.#dropIndicator = document.querySelector(".column-drop-indicator");

            if (!this.#dropIndicator) {
                this.#dropIndicator = document.createElement("div");
                this.#dropIndicator.className = "column-drop-indicator";
                document.body.appendChild(this.#dropIndicator);
            }
            this.#dropIndicator.style.display = "none";

            domCol.setAttribute("draggable", true);
            domCol.addEventListener("dragstart", this.dragStart.bind(col));
            domCol.addEventListener("dragover", this.dragOver.bind(col));
            domCol.addEventListener("dragleave", this.dragLeave.bind(col));
            domCol.addEventListener("drop", this.dragDrop.bind(col));
            domCol.addEventListener("dragend", this.dragEnd.bind(col));

            domRow.appendChild(domCol);
            col.domCol = domCol;
        }

        this.#domTBody = document.createElement("tbody");
        this.#domTable.appendChild(this.#domTBody);
        for (var rowIdx = 0; rowIdx < this.tableRows.length; rowIdx += 1) {
            domRow = document.createElement("tr");
            domRow.addEventListener("click", this.rowClick.bind(this));
            this.#domTBody.appendChild(domRow);
            for (var colIdx in this.displayColumns) {
                var col = this.allColumns[this.displayColumns[colIdx]];
                var domData = document.createElement("td");
                domData.innerHTML = col.renderHTML(this.tableRows[rowIdx]);
                domRow.appendChild(domData);
            }
            this.tableRows[rowIdx].domRow = domRow;
        }
        div.appendChild(this.#domTableContainer);
        this.doSort();
        return true;
    }

    dragStart(e) {
        //dragSrcIndex = index;
        e.dataTransfer.effectAllowed = "move";
        const dropIndicator = document.querySelector(".column-drop-indicator")
        dropIndicator.style.display = "block";
         const headerRow = FromDOM.parentElement;

  const fromIndex = Array.from(this.domCol.parentElement.children).indexOf(this.domCol);

        e.dataTransfer.setData("colID", this.name);
        e.dataTransfer.setData("colIdx", fromIndex);
    }

    dragOver(e) {
        e.preventDefault();
        const rect = this.domCol.getBoundingClientRect();
        const isRightHalf = e.clientX - rect.left > rect.width / 2;
        const indicatorLeft = isRightHalf ? rect.right : rect.left;

        const dropIndicator = document.querySelector(".column-drop-indicator")
        dropIndicator.style.left = `${indicatorLeft}px`;
        dropIndicator.style.top = `${rect.top}px`;
        dropIndicator.style.height = `${this.parentTable.offsetHeight}px`;
    }

    dragLeave(e) {
        this.domCol.style.backgroundColor = "";
    }

    dragDrop(e) {
        e.preventDefault();
        const dropIndicator = document.querySelector(".column-drop-indicator")
        dropIndicator.style.display = "none";

        const rect = this.domCol.getBoundingClientRect();
        const isRightHalf = e.clientX - rect.left > rect.width / 2;

        const sourceColumn = e.dataTransfer.getData("colID");
        let dstColName = this.name;
        if (!isRightHalf) {
            if (!this.domCol.previousSibling) {
                dstColName = ''
            } else {
                dstColName = this.domCol.previousSibling.dataset.fieldName;
            }
        }
        console.log("Moving Column", sourceColumn, "to just after ", dstColName);
        moveColumn(sourceColumn, dstColName);
        
          const table = FromDOM.closest('table');
  const headerRow = FromDOM.parentElement;

  const fromIndex = Array.from(headerRow.children).indexOf(FromDOM);
  const afterIndex = Array.from(headerRow.children).indexOf(AfterDOM);

  if (fromIndex === -1 || afterIndex === -1 || fromIndex === afterIndex) return;

        
        
        const rows = table.rows;
        for (let row of rows) {
            const cells = row.cells;
            if (toIndex > fromIndex) {
                row.insertBefore(cells[fromIndex], cells[toIndex].nextSibling);
            } else {
                row.insertBefore(cells[fromIndex], cells[toIndex]);
            }
        }
    }

    dragEnd(e) {
        const dropIndicator = document.querySelector(".column-drop-indicator")
        dropIndicator.style.display = "none";
    }

    headerClick(e) {
        this.parentTable.sortByColumn(this.name, !e.ctrlKey);
        return true;
    }
    rowClick(e) {
        //const index = Array.from(this.parentNode.children).indexOf(this); // Get column index of clicked td
        //const thisColumn = document.querySelector(`table.uiTable thead th:nth-child(${index + 1})`); // Select corresponding th
        if (!this.maxSelectedRows) return false;
        const thisRow = e.target.closest("tr");

        thisRow.classList.toggle("selected");
        console.log("Processing Row Click");
        //Need to make sure the index gets defined.
        return true;
    }
    sortByColumn(colName, singleCol) {
        let sortColIdx = this.sortColumns.indexOf(colName);

        if ((sortColIdx < 0 || this.sortColumns.length > 1) && singleCol) {
            //For singleCol mode, clear the array if it is longer than 1 or if this column isn't in it.
            this.sortColumns = [];
            this.sortDirections = [];
            sortColIdx = -1;
        }

        if (sortColIdx < 0) {
            //If the column doesn't exist then add it with ascending order
            this.sortColumns.push(colName);
            this.sortDirections.push(1);
        } else {
            //The entry exists and we aren't in singleCol mode. Flip the flag
            this.sortDirections[sortColIdx] *= -1;
        }
        this.doSort();
    }

    setSort(inValues) {
        this.sortColumns = [];
        this.sortDirections = [];
        if (typeof inValues == "string") {
            //A string is assumed to be a column name
            this.sortColumns.push(inValues);
            this.sortDirections.push(1);
        } else {
            //Loop through the array
            for (let i = 0; i < inValues.length; i++) {
                if (typeof inValues[i] == "string") {
                    //if the array is strings then it is column names.
                    this.sortColumns.push(inValues[i]);
                    this.sortDirections.push(1);
                } else {
                    //the elements should be arrays of [columnName,sortDirection]
                    this.sortColumns.push(inValues[i][0]);
                    this.sortDirections.push(inValues[i][1]);
                }
            }
        }
    }

    doSort() {
        //Update all visible column Headers with the sorting order.
        for (let thisColName in this.allColumns) {
            let thisCol = this.allColumns[thisColName];
            if (thisCol.domCol != null) {
                let thisColOrder = this.sortColumns.indexOf(thisCol.name);
                if (thisColOrder < 0) {
                    thisCol.domCol.classList.remove("asc");
                    thisCol.domCol.classList.remove("desc");
                } else if (this.sortDirections[thisColOrder] > 0) {
                    thisCol.domCol.classList.add("asc");
                    thisCol.domCol.classList.remove("desc");
                } else {
                    thisCol.domCol.classList.remove("asc");
                    thisCol.domCol.classList.add("desc");
                }
            }
        }

        //Sort the rows
        this.tableRows = this.tableRows.sort((a, b) => {
            for (let i = 0; i < this.sortColumns.length; i++) {
                let sortedcol = this.allColumns[this.sortColumns[i]];
                let sortDirection = this.sortDirections[i];

                var value1 = sortedcol.getData(a);
                var value2 = sortedcol.getData(b);

                if (value1 < value2) return -1 * sortDirection;
                if (value1 > value2) return 1 * sortDirection;
            }
            return 0;
        });
        this.tableRows.forEach((row) => this.#domTBody.appendChild(row.domRow));
    }
}
