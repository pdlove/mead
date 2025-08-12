class pageProductDisplay {
    rowsByID = {};
    rootRows = [];
    uiTableDOM = null;
    selectedRowID = null;
    myTable = null; 

    async setParameters(parameters) {
        try {
            if (!parameters) parameters={};
            if (!parameters.apiData) parameters.apiData = await API.getAPIData('pos/productdisplay/categorytree/all');
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        
        try {
            this.rows = {};
            
            for (let product of parameters.apiData) {
                let myrow = new uiTableRow();
                let myParent = this.rowsByID[product.categoryID];
                myrow.rowID = product.productID;
                myrow.rowData = product;
                myrow.rowType = 'Product';
                if (myParent) {
                    myrow.parentRowID = myParent.rowID;
                    myParent.childRowIDs.push(myrow.rowID);
                } else {
                    myrow.parentRowID = null;
                    this.rootRows.push(myrow.rowID);
                }
                this.rowsByID[myrow.rowID]=myrow;
            }
        } catch (error) {
            console.error('Error Building the Dataset:', error);
        }
        this.myTable = new uiTable()
        this.myTable.setData(this.rows);
    }
    async renderDOM(destDOM) {
        destDOM.innerHTML='';
        //this.renderHTML(destDOM);
    }
}

