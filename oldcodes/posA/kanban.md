# My Project Board

## To Do

### New UI for viewing/editing the Organization/Location/Subnet and Netork Models

  - due: 2025-07-09
  - tags: [UI, Core]
  - priority: high
  - workload: Hard
  - defaultExpanded: true
  - steps:
      - [ ] Retrieve data available using APIs
      - [ ] Dropdown to select Organization with button for "New/Edit"
      - [ ] Location/Subnet/Network in treeview. Per-Location Networks are always only one Subnet.
      - [ ] New Location/Subnet/Network Button
      - [ ] Edit Button
    ```md
    Create basic treeview
    ```

### Host List

  - due: 2025-07-14
  - tags: [UI, Core, Phase1]
  - priority: medium
  - workload: Normal
  - defaultExpanded: false
  - steps:
      - [ ] List Organization/Location/Subnet on left side with device counts
      - [ ] Fetch devices for selected level.
      - [ ] Display list in table view
      - [ ] Device Import from CSV
      - [ ] Allow "New Device", "Edit Device"
      - [ ] Add Option to "Merge Devices"
    ```md
    List of Hosts with Interfaces/Addresses
    ```

### Device Discovery (ICMP)

  - due: 2025-07-14
  - tags: [UI, Host Discovery]
  - priority: medium
  - workload: Normal
  - defaultExpanded: false
    ```md
    Simply ping a network and add any IPs that are discovered online as Devices. Used Reverse DNS to name them.
    ```

## Done

## LongTerm Needs

### Allow Composite Keys

  - tags: [Database, Core]
  - priority: low
  - workload: Extreme
  - defaultExpanded: false
  - steps:
      - [ ] Update Model class to store Primary Key as an array in every instance
      - [ ] Update REST APIs to respect multiple columns as the primary key
    ```md
    Table Interactions should allow composite keys to be used.
    ```

