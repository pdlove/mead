class MEADConfig {
    parentDOM = null; //This is the DOM where the HTML file was loaded.
    tableDOM = null;
    tableObject = null;

    vlans = {};
    locations = {};
    networks = {};


    async setParameters(parameters) {
        if (!parameters) return;
        this.stack = parameters.stack;
        this.model = parameters.model;
        //this.panel = parameters.panel;
    }

    async loadScreen() {
        var myTable = new uiTable();

    }

    async fetchData() {
        // Pass the filter value as a parameter to the system/model API call
        try {
            const [vlans, locations, networks] = await Promise.all([
                API.getAPIData('meadcore/vlan'),
                API.getAPIData('meadcore/location'),
                API.getAPIData('meadcore/network')
            ]);
            this.vlans = vlans;
            this.locations = locations;
            this.networks = networks;
        } catch (error) {
            console.error('Error fetching config data:', error);
        }
    }

    async renderDOM(destDOM) {
        if (destDOM) this.parentDOM = destDOM;

        this.domTblVLANs = this.parentDOM.querySelector('#tblVLANs');        
        this.objTblVLANs = await loadClientPackage("system.uiTable", this.domTblVLANs);
        await this.refreshData();        
    }
    
    async refreshData() {
        await this.fetchData();

        this.objTblVLANs.setData(this.vlans);
        this.objTblVLANs.renderDOM(this.domTblVLANs);


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
