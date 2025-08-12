//It's time to make the master page.
//Down the left will be a treeview for the menu with collapse/expand functionL https://ej2.syncfusion.com/react/demos/#/tailwind3/sidebar/sidebar-menu
//Across the top will be an App Bar. Need a dropdown to select the Organization which will be displayed on the right side: https://ej2.syncfusion.com/react/demos/#/tailwind3/appbar/default

import React, { useState, useEffect } from 'react';
import {
  TreeGridComponent,
  ColumnsDirective,
  ColumnDirective,
  Page,
  Toolbar,
  Inject,
} from '@syncfusion/ej2-react-treegrid';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import OrganizationForm from './OrganizationForm';

export default function OrganizationListPage() {
  const [orgData, setOrgData] = useState([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState(null);

  // Load all organizations
  const fetchOrgData = async () => {
    let orgs = await fetch('http://test.tamingit.info/api/data/organization');
    orgs = await orgs.json();
    let locations = await fetch('http://test.tamingit.info/api/data/location');
    locations = await locations.json();
    let networks = await fetch('http://test.tamingit.info/api/data/network');
    networks = await networks.json();
    let subnets = await fetch('http://test.tamingit.info/api/data/subnet');
    subnets = await subnets.json();
    for (const org of orgs) {
      org.itemType = 'organization';
      org.subItems = [];

      const matchingNetworks = networks
        .filter(item => item.organizationID === org.organizationID && !item.locationID)
        .map(item => ({ ...item, itemType: 'network', subItems: [] })); // add property  
      if (matchingNetworks) {
        org.subItems.push({name: 'Organization-wide Networks', subItems: matchingNetworks, itemType: 'netfolder'})
      }    
      for (const loc of locations.filter(item => item.organizationID === org.organizationID)) {
        org.subItems.push(loc);
        loc.itemType = 'location';
        loc.subItems = [];
        const matchingNetworks = networks
          .filter(item => item.locationID === loc.locationID)
          .map(item => ({ ...item, itemType: 'network', subItems: [] })); // add property      
        loc.subItems.push(...matchingNetworks); // spread to push items individually
        const matchingSubnets = subnets
          .filter(item => item.locationID === loc.locationID)
          .map(item => ({ ...item, itemType: 'subnet', subItems: [] })); // add property      
        loc.subItems.push(...matchingSubnets); // spread to push items individually
      }
    }
    setOrgData(orgs);
  };




  useEffect(() => {
    const actionComplete = () => {
      fetchOrgData();
    };
    actionComplete();
  }, []);

  const toolbarClick = (args) => {
    if (args.item.id === 'Grid_add') {
      setSelectedOrgId(null);
      setDialogVisible(true);
    }
  };

  const rowSelected = (args) => {
    setSelectedOrgId(args.data.organizationID);
    setDialogVisible(true);
  };
  const nameTemplate = (props) => { 
    var flagIconLocation = (props.parentItem)? props.parentItem.name : props.name;
    return (<div style={{display: 'inline'}}><div style={{display: 'inline-block'}}><img className='e-treeoverviewimage' src={"public/"+props.itemType+".png"} style={{width:"16px"}}></img>     
    </div><div style={{ display: 'inline-block', paddingLeft: '6px', verticalAlign: 'middle' }}>{props.name}</div></div>);
  };
  return (
    <div style={{ height: "100%" }}>
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Organizations</h1>

        <TreeGridComponent dataSource={orgData} treeColumnIndex={0} childMapping='subItems' height='95%'>
          <ColumnsDirective>
            <ColumnDirective field="name" headerText="Name" width="150" template={nameTemplate} />
            <ColumnDirective field="vlan8021qID" headerText="VLAN" width="50" />
            <ColumnDirective field="ipv4Cidr" headerText="IPv4 Network" width="200" />
          </ColumnsDirective>
          <Inject services={[Toolbar]} />
        </TreeGridComponent>
      </div>
      <DialogComponent
        width="600px"
        height="auto"
        header={selectedOrgId ? 'Edit Organization' : 'Add Organization'}
        visible={dialogVisible}
        showCloseIcon={true}
        close={() => setDialogVisible(false)}
        modal={true}
        beforeOpen={(args) => { args.maxHeight = '600px' }}
      >
        <div style={{ overflowY: 'auto', maxHeight: '100%' }}>
          <OrganizationForm
            orgId={selectedOrgId}
            onSubmit={() => {
              setDialogVisible(false);
              fetchOrganizations();
            }}
          />
        </div>
      </DialogComponent >
    </div >
  );
}
