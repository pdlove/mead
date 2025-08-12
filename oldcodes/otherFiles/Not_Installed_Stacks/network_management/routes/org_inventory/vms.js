const express = require('express');
const Router = express.Router();
const db = require('../../models');

// Get all VMs
Router.get('/', async (req, res) => {
    res.status(200).json(HyperVData);    
  });
  
  // Get a VLAN by ID
  Router.get('/:id', async (req, res) => {
    let myVal = HyperVData.find(val => (val.vm_name==req.params.id));
    if (myVal) {
        res.status(200).json(myVal);
    } else {
        res.status(404).json({ error: 'VLAN not found' });
    }
  });


  var HyperVData = [
    {
        "host_name":  "CORP-UCS-NODE-1",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "corp-ansible-1",
        "vm_id":  "91b2b7bc-3198-42e4-928f-5960cd8b07e8",
        "firmware_type":  null,
        "vm_notes":  "",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\NonRedundant\\corp-ansible-1",
        "host_location_config":  "C:\\ClusterStorage\\NonRedundant\\corp-ansible-1",
        "host_location_snapshot":  "C:\\ClusterStorage\\NonRedundant\\corp-ansible-1",
        "host_location_smartpaging":  "C:\\ClusterStorage\\NonRedundant\\corp-ansible-1",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  4,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  8,
                       "mem_dynamic":  false,
                       "mem_min_gb":  0,
                       "mem_max_gb":  1024,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "UEFI",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "Save",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "ubuntu ubuntu EFI Network EFI SCSI Device EFI SCSI Device",
                             "pause_after_failure":  false,
                             "secure":  true,
                             "secure_template":  "MicrosoftUEFICertificateAuthority",
                             "preferred_network_protocol":  "IPv4",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\NonRedundant\\corp-ansible-1\\virtual hard disks\\corp-ansible-1-os.vhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  21,
                                                                  "disk_size_gb":  50,
                                                                  "block_size_mb":  16
                                                              },
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\NonRedundant\\corp-ansible-1\\virtual hard disks\\corp-ansible-1-config.vhdx",
                                                                  "controller_location":  1,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  16,
                                                                  "block_size_mb":  32
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "Network Adapter",
                                     "adapter_id":  "Microsoft:91B2B7BC-3198-42E4-928F-5960CD8B07E8\\2687A9AB-386E-4C43-B0D9-752D368D1E1B",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D016539",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Access",
                                     "vlanid_untagged":  23
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-1",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "corp-api-vm-1",
        "vm_id":  "5d0ba2b7-25ee-4568-9b36-a5f088a0274f",
        "firmware_type":  null,
        "vm_notes":  "#CLUSTER-INVARIANT#:{34202489-bc6a-44fb-8182-8682894e9029}",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-api-vm-1",
        "host_location_config":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-api-vm-1",
        "host_location_snapshot":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-api-vm-1",
        "host_location_smartpaging":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-api-vm-1",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  4,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  16,
                       "mem_dynamic":  false,
                       "mem_min_gb":  0,
                       "mem_max_gb":  1024,
                       "mem_buffer_pct":  20,
                       "mem_priority":  100,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "UEFI",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "Save",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "ubuntu EFI Network EFI SCSI Device",
                             "pause_after_failure":  false,
                             "secure":  false,
                             "secure_template":  "MicrosoftWindows",
                             "preferred_network_protocol":  "IPv4",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-api-vm-1\\Virtual Hard Disks\\corp-api-vm-1_disk_1_EBDADE90-CC02-454C-9C35-7988E0A8BF0F.avhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Differencing",
                                                                  "drive_id":  "Differencing",
                                                                  "parent_path":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-api-vm-1\\Virtual Hard Disks\\corp-api-vm-1_disk_1_5D2618DC-3B79-44C5-A716-C403A22E52A5.avhdx",
                                                                  "file_size_gb":  4,
                                                                  "disk_size_gb":  200,
                                                                  "block_size_mb":  2
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "corp-api-vm-1",
                                     "adapter_id":  "Microsoft:5D0BA2B7-25EE-4568-9B36-A5F088A0274F\\BBA1C46C-5F72-4EEF-AA8F-15C2B10F9941",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D01660A",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Access",
                                     "vlanid_untagged":  0
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-1",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "corp-bkpibm-01",
        "vm_id":  "37004352-a8d7-46f6-a4f5-a6b5a12dcac7",
        "firmware_type":  null,
        "vm_notes":  "#CLUSTER-INVARIANT#:{ead1bf8d-6e1e-42c4-bd84-8eba954b8528}",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\NonRedundant\\corp-bkpibm-01",
        "host_location_config":  "C:\\ClusterStorage\\NonRedundant\\corp-bkpibm-01",
        "host_location_snapshot":  "C:\\ClusterStorage\\NonRedundant\\corp-bkpibm-01",
        "host_location_smartpaging":  "C:\\ClusterStorage\\NonRedundant\\corp-bkpibm-01",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  24,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  8,
                       "mem_dynamic":  false,
                       "mem_min_gb":  0,
                       "mem_max_gb":  1024,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "UEFI",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "Save",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "Windows Boot Manager EFI SCSI Device EFI Network",
                             "pause_after_failure":  false,
                             "secure":  true,
                             "secure_template":  "MicrosoftWindows",
                             "preferred_network_protocol":  "IPv4",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "",
                                                                  "drive_type":  "DvdDrive",
                                                                  "path":  "",
                                                                  "controller_location":  1,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  null,
                                                                  "file_subtype":  null,
                                                                  "drive_id":  null,
                                                                  "parent_path":  null,
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  0,
                                                                  "block_size_mb":  0
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "Network Adapter",
                                     "adapter_id":  "Microsoft:37004352-A8D7-46F6-A4F5-A6B5A12DCAC7\\B949BD1F-DF7C-4311-A271-24DDF7123627",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D016718",
                                     "vmmq_enabled":  true,
                                     "vrss_enabled":  true,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Access",
                                     "vlanid_untagged":  17
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-1",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "corp-dhcp-vm-1",
        "vm_id":  "12a7d259-1fed-48a5-95c4-6229146b3c03",
        "firmware_type":  null,
        "vm_notes":  "Windows Server 2022 Datacenter Edition - Base VM for generating server template. Do not delete. Only turned on to update the existing template. May be shut down if it is impeding business critical tasks.#CLUSTER-INVARIANT#:{7d1054ba-8cb8-40a6-a037-8d62fff83e09}",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\Redundant1\\corp-dhcp-vm-1",
        "host_location_config":  "C:\\ClusterStorage\\Redundant1\\corp-dhcp-vm-1",
        "host_location_snapshot":  "C:\\ClusterStorage\\Redundant1\\corp-dhcp-vm-1",
        "host_location_smartpaging":  "C:\\ClusterStorage\\Redundant1\\corp-dhcp-vm-1",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  2,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  4,
                       "mem_dynamic":  true,
                       "mem_min_gb":  2,
                       "mem_max_gb":  8,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "UEFI",
                             "start_action":  "Nothing",
                             "start_delay":  15,
                             "stop_action":  "Save",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "Windows Boot Manager EFI SCSI Device EFI Network EFI SCSI Device",
                             "pause_after_failure":  false,
                             "secure":  true,
                             "secure_template":  "MicrosoftWindows",
                             "preferred_network_protocol":  "IPv4",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\Redundant1\\corp-dhcp-vm-1\\Virtual Hard Disks\\_template_winsvr_2022_disk_1.vhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  51,
                                                                  "disk_size_gb":  60,
                                                                  "block_size_mb":  2
                                                              },
                                                              {
                                                                  "resource_pool":  "",
                                                                  "drive_type":  "DvdDrive",
                                                                  "path":  "",
                                                                  "controller_location":  1,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  null,
                                                                  "file_subtype":  null,
                                                                  "drive_id":  null,
                                                                  "parent_path":  null,
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  0,
                                                                  "block_size_mb":  0
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "_template_winsvr_2022",
                                     "adapter_id":  "Microsoft:12A7D259-1FED-48A5-95C4-6229146B3C03\\96268F93-76ED-4F78-AAC7-57AC477DD155",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D016595",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Access",
                                     "vlanid_untagged":  0
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-1",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "corp-dns1",
        "vm_id":  "ed019040-a219-477d-a1ea-766bece2f306",
        "firmware_type":  null,
        "vm_notes":  "#CLUSTER-INVARIANT#:{7b6d9013-8fa0-4e80-9263-9e0e17c736c4}",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\Redundant1\\corp-dns1",
        "host_location_config":  "C:\\ClusterStorage\\Redundant1\\corp-dns1",
        "host_location_snapshot":  "C:\\ClusterStorage\\Redundant1\\corp-dns1",
        "host_location_smartpaging":  "C:\\ClusterStorage\\Redundant1\\corp-dns1",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  2,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  1,
                       "mem_dynamic":  false,
                       "mem_min_gb":  0,
                       "mem_max_gb":  1024,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "BIOS",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "Save",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "CD IDE LegacyNetworkAdapter Floppy",
                             "pause_after_failure":  false,
                             "secure":  false,
                             "secure_template":  "None",
                             "preferred_network_protocol":  "N/A",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "c:\\ClusterStorage\\Redundant1\\corp-dns1\\Virtual Hard Disks\\forwarder-va.vhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  4,
                                                                  "disk_size_gb":  6,
                                                                  "block_size_mb":  32
                                                              },
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "c:\\ClusterStorage\\Redundant1\\corp-dns1\\Virtual Hard Disks\\dynamic.vhdx",
                                                                  "controller_location":  1,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Fixed",
                                                                  "drive_id":  "Fixed",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  0,
                                                                  "block_size_mb":  0
                                                              }
                                                          ],
                                                "ControllerType":  "VMIdeController",
                                                "ControllerNumber":  0
                                            },
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "",
                                                                  "drive_type":  "DvdDrive",
                                                                  "path":  "",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  null,
                                                                  "file_subtype":  null,
                                                                  "drive_id":  null,
                                                                  "parent_path":  null,
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  0,
                                                                  "block_size_mb":  0
                                                              }
                                                          ],
                                                "ControllerType":  "VMIdeController",
                                                "ControllerNumber":  1
                                            },
                                            {
                                                "Disks":  [

                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "Network Adapter",
                                     "adapter_id":  "Microsoft:ED019040-A219-477D-A1EA-766BECE2F306\\E549E1AD-66B8-4AE7-B462-783B0D19059B",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D01666A",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Access",
                                     "vlanid_untagged":  39
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-1",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "corp-ha-vm-1",
        "vm_id":  "2fdfb6c7-ec1c-40e6-8d12-f8bb6611d169",
        "firmware_type":  null,
        "vm_notes":  "#CLUSTER-INVARIANT#:{d140c46d-33b4-47c0-9ae6-2bcc759cbf46}",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\Redundant1\\corp-ha-vm-1",
        "host_location_config":  "C:\\ClusterStorage\\Redundant1\\corp-ha-vm-1",
        "host_location_snapshot":  "C:\\ClusterStorage\\Redundant1\\corp-ha-vm-1",
        "host_location_smartpaging":  "C:\\ClusterStorage\\Redundant1\\corp-ha-vm-1",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  2,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  4,
                       "mem_dynamic":  true,
                       "mem_min_gb":  2,
                       "mem_max_gb":  6,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "UEFI",
                             "start_action":  "Nothing",
                             "start_delay":  5,
                             "stop_action":  "ShutDown",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "ubuntu EFI SCSI Device EFI Network EFI SCSI Device",
                             "pause_after_failure":  false,
                             "secure":  false,
                             "secure_template":  "MicrosoftWindows",
                             "preferred_network_protocol":  "IPv4",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\Redundant1\\corp-ha-vm-1\\Virtual Hard Disks\\corp-ha-vm-1_disk_1a.vhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  20,
                                                                  "disk_size_gb":  60,
                                                                  "block_size_mb":  2
                                                              },
                                                              {
                                                                  "resource_pool":  "",
                                                                  "drive_type":  "DvdDrive",
                                                                  "path":  "",
                                                                  "controller_location":  1,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  null,
                                                                  "file_subtype":  null,
                                                                  "drive_id":  null,
                                                                  "parent_path":  null,
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  0,
                                                                  "block_size_mb":  0
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "corp-pf-ha-vm-1",
                                     "adapter_id":  "Microsoft:2FDFB6C7-EC1C-40E6-8D12-F8BB6611D169\\D648B539-1ABC-4DCA-9803-9B1571E27039",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D01666B",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  false,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Access",
                                     "vlanid_untagged":  0
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-1",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "corp-ipplan-vm-1",
        "vm_id":  "719e3606-f204-4084-b39b-7ed3a09fd484",
        "firmware_type":  null,
        "vm_notes":  "",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "c:\\ClusterStorage\\NonRedundant\\corp-ipplan-vm-1",
        "host_location_config":  "c:\\ClusterStorage\\NonRedundant\\corp-ipplan-vm-1",
        "host_location_snapshot":  "c:\\ClusterStorage\\NonRedundant\\corp-ipplan-vm-1",
        "host_location_smartpaging":  "c:\\ClusterStorage\\NonRedundant\\corp-ipplan-vm-1",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  4,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  4,
                       "mem_dynamic":  false,
                       "mem_min_gb":  0,
                       "mem_max_gb":  1024,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "UEFI",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "Save",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "ubuntu EFI SCSI Device EFI Network EFI SCSI Device",
                             "pause_after_failure":  false,
                             "secure":  true,
                             "secure_template":  "MicrosoftUEFICertificateAuthority",
                             "preferred_network_protocol":  "IPv4",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "c:\\ClusterStorage\\NonRedundant\\corp-ipplan-vm-1\\Virtual Hard Disks\\corp-ipplan-vm-1_AC6FDD6D-043E-43B2-869E-25AAD3AC5502.avhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Differencing",
                                                                  "drive_id":  "Differencing",
                                                                  "parent_path":  "c:\\ClusterStorage\\NonRedundant\\corp-ipplan-vm-1\\Virtual Hard Disks\\corp-ipplan-vm-1.vhdx",
                                                                  "file_size_gb":  9,
                                                                  "disk_size_gb":  127,
                                                                  "block_size_mb":  2
                                                              },
                                                              {
                                                                  "resource_pool":  "",
                                                                  "drive_type":  "DvdDrive",
                                                                  "path":  "",
                                                                  "controller_location":  1,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  null,
                                                                  "file_subtype":  null,
                                                                  "drive_id":  null,
                                                                  "parent_path":  null,
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  0,
                                                                  "block_size_mb":  0
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "Network Adapter",
                                     "adapter_id":  "Microsoft:719E3606-F204-4084-B39B-7ED3A09FD484\\0ADD086A-2688-41E3-A095-F2A8EB913B2D",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D016538",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Access",
                                     "vlanid_untagged":  39
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-1",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "corp-jmp-ra-1",
        "vm_id":  "b2c53694-60b6-4ded-8e44-e31c891803ef",
        "firmware_type":  null,
        "vm_notes":  "#CLUSTER-INVARIANT#:{a6bb722c-ea70-4fcf-be66-3ccaea6c0205}",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\NonRedundant\\corp-jmp-ra-1",
        "host_location_config":  "C:\\ClusterStorage\\NonRedundant\\corp-jmp-ra-1",
        "host_location_snapshot":  "C:\\ClusterStorage\\NonRedundant\\corp-jmp-ra-1",
        "host_location_smartpaging":  "C:\\ClusterStorage\\NonRedundant\\corp-jmp-ra-1",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  4,
                    "allow_virtualization":  true,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  8,
                       "mem_dynamic":  false,
                       "mem_min_gb":  0,
                       "mem_max_gb":  1024,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "UEFI",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "Save",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "Windows Boot Manager EFI SCSI Device EFI Network EFI SCSI Device",
                             "pause_after_failure":  false,
                             "secure":  true,
                             "secure_template":  "MicrosoftWindows",
                             "preferred_network_protocol":  "IPv4",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "",
                                                                  "drive_type":  "DvdDrive",
                                                                  "path":  "",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  null,
                                                                  "file_subtype":  null,
                                                                  "drive_id":  null,
                                                                  "parent_path":  null,
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  0,
                                                                  "block_size_mb":  0
                                                              },
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\NonRedundant\\corp-jmp-ra-1\\corp-jmp-ra-1-os.vhdx",
                                                                  "controller_location":  1,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  134,
                                                                  "disk_size_gb":  175,
                                                                  "block_size_mb":  32
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "Network Adapter",
                                     "adapter_id":  "Microsoft:B2C53694-60B6-4DED-8E44-E31C891803EF\\7370656A-B10B-4BF8-A1C7-91B384E4A996",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  false,
                                     "mac_address":  "0010FA002321",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  false,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Access",
                                     "vlanid_untagged":  23
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-1",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "corp-josh-sv-01",
        "vm_id":  "39b7bc27-137b-4b71-8b71-293ccdaf318f",
        "firmware_type":  null,
        "vm_notes":  "Josh Jump Server#CLUSTER-INVARIANT#:{8673e333-0e9d-41b9-b481-02e8b0073a0e}",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-josh-sv-01",
        "host_location_config":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-josh-sv-01",
        "host_location_snapshot":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-josh-sv-01",
        "host_location_smartpaging":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-josh-sv-01",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  4,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  8,
                       "mem_dynamic":  true,
                       "mem_min_gb":  4,
                       "mem_max_gb":  16,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "UEFI",
                             "start_action":  "Nothing",
                             "start_delay":  5,
                             "stop_action":  "ShutDown",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "Windows Boot Manager EFI SCSI Device EFI Network EFI SCSI Device EFI SCSI Device",
                             "pause_after_failure":  false,
                             "secure":  true,
                             "secure_template":  "MicrosoftWindows",
                             "preferred_network_protocol":  "IPv4",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "c:\\ClusterStorage\\CriticalNonRedundant\\corp-josh-sv-01\\Virtual Hard Disks\\corp-josh-jsv-01_disk_1.vhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  182,
                                                                  "disk_size_gb":  200,
                                                                  "block_size_mb":  2
                                                              },
                                                              {
                                                                  "resource_pool":  "",
                                                                  "drive_type":  "DvdDrive",
                                                                  "path":  "",
                                                                  "controller_location":  1,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  null,
                                                                  "file_subtype":  null,
                                                                  "drive_id":  null,
                                                                  "parent_path":  null,
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  0,
                                                                  "block_size_mb":  0
                                                              },
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-josh-sv-01\\virtual hard disks\\250GB.vhdx",
                                                                  "controller_location":  2,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  237,
                                                                  "disk_size_gb":  250,
                                                                  "block_size_mb":  32
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "corp-josh-jsv-01",
                                     "adapter_id":  "Microsoft:39B7BC27-137B-4B71-8B71-293CCDAF318F\\7E3AD8EF-42F4-4AB1-9558-93942D2D5722",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D016593",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  true,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Access",
                                     "vlanid_untagged":  23
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-1",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "corp-logs-vm-1",
        "vm_id":  "af295d16-4760-4a14-ba82-cfb12b68a69d",
        "firmware_type":  null,
        "vm_notes":  "#CLUSTER-INVARIANT#:{b6fdcab1-1a37-402f-bb3d-ded1f929f88d}",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\Redundant1\\corp-logs-vm-1",
        "host_location_config":  "C:\\ClusterStorage\\Redundant1\\corp-logs-vm-1",
        "host_location_snapshot":  "C:\\ClusterStorage\\Redundant1\\corp-logs-vm-1",
        "host_location_smartpaging":  "C:\\ClusterStorage\\Redundant1\\corp-logs-vm-1",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  12,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  8,
                       "mem_dynamic":  false,
                       "mem_min_gb":  0,
                       "mem_max_gb":  1024,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "UEFI",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "Save",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "Windows Boot Manager EFI SCSI Device EFI Network EFI SCSI Device EFI SCSI Device",
                             "pause_after_failure":  false,
                             "secure":  true,
                             "secure_template":  "MicrosoftWindows",
                             "preferred_network_protocol":  "IPv4",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "c:\\ClusterStorage\\Redundant1\\corp-logs-vm-1\\Virtual Hard Disks\\corp-logs-vm-1.vhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  16,
                                                                  "disk_size_gb":  150,
                                                                  "block_size_mb":  32
                                                              },
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "c:\\ClusterStorage\\Redundant1\\corp-logs-vm-1\\Virtual Hard Disks\\Corp-logs-vm-1-Data.vhdx",
                                                                  "controller_location":  1,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  200,
                                                                  "block_size_mb":  32
                                                              },
                                                              {
                                                                  "resource_pool":  "",
                                                                  "drive_type":  "DvdDrive",
                                                                  "path":  "",
                                                                  "controller_location":  2,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  null,
                                                                  "file_subtype":  null,
                                                                  "drive_id":  null,
                                                                  "parent_path":  null,
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  0,
                                                                  "block_size_mb":  0
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "Network Adapter",
                                     "adapter_id":  "Microsoft:AF295D16-4760-4A14-BA82-CFB12B68A69D\\7B08687B-6817-4407-9AB1-C2D7639DBF63",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D016704",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Access",
                                     "vlanid_untagged":  39
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-1",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "corp-metric-1",
        "vm_id":  "98474c88-a06c-4eea-a9db-53de986605e8",
        "firmware_type":  null,
        "vm_notes":  "",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\Redundant1\\corp-metric-1",
        "host_location_config":  "C:\\ClusterStorage\\Redundant1\\corp-metric-1",
        "host_location_snapshot":  "C:\\ClusterStorage\\Redundant1\\corp-metric-1",
        "host_location_smartpaging":  "C:\\ClusterStorage\\Redundant1\\corp-metric-1",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  4,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  8,
                       "mem_dynamic":  false,
                       "mem_min_gb":  0,
                       "mem_max_gb":  1024,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "UEFI",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "Save",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "ubuntu EFI SCSI Device EFI Network EFI SCSI Device",
                             "pause_after_failure":  false,
                             "secure":  true,
                             "secure_template":  "MicrosoftUEFICertificateAuthority",
                             "preferred_network_protocol":  "IPv4",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\Redundant1\\corp-metric-1\\Virtual Hard Disks\\corp-metric-1-os.vhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  25,
                                                                  "disk_size_gb":  50,
                                                                  "block_size_mb":  16
                                                              },
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\Redundant1\\corp-metric-1\\Virtual Hard Disks\\corp-metric-1-config.vhdx",
                                                                  "controller_location":  1,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  1,
                                                                  "block_size_mb":  32
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "corp-metric-1 - DMZ",
                                     "adapter_id":  "Microsoft:98474C88-A06C-4EEA-A9DB-53DE986605E8\\539C5FD9-805C-4CAC-A5A3-838805138119",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D016581",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  false,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Access",
                                     "vlanid_untagged":  17
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-1",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "corp-netdb-1",
        "vm_id":  "118d10ae-a94a-400a-a5a7-2985c19e9685",
        "firmware_type":  null,
        "vm_notes":  "",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\Redundant1\\corp-netdb-1",
        "host_location_config":  "C:\\ClusterStorage\\Redundant1\\corp-netdb-1",
        "host_location_snapshot":  "C:\\ClusterStorage\\Redundant1\\corp-netdb-1",
        "host_location_smartpaging":  "C:\\ClusterStorage\\Redundant1\\corp-netdb-1",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  8,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  17,
                       "mem_dynamic":  false,
                       "mem_min_gb":  0,
                       "mem_max_gb":  1024,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "UEFI",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "Save",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "debian EFI SCSI Device ubuntu EFI Network EFI SCSI Device",
                             "pause_after_failure":  false,
                             "secure":  true,
                             "secure_template":  "MicrosoftUEFICertificateAuthority",
                             "preferred_network_protocol":  "IPv4",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\Redundant1\\corp-netdb-1\\Virtual Hard Disks\\corp-netdb-1.vhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  38,
                                                                  "disk_size_gb":  127,
                                                                  "block_size_mb":  32
                                                              },
                                                              {
                                                                  "resource_pool":  "",
                                                                  "drive_type":  "DvdDrive",
                                                                  "path":  "",
                                                                  "controller_location":  1,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  null,
                                                                  "file_subtype":  null,
                                                                  "drive_id":  null,
                                                                  "parent_path":  null,
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  0,
                                                                  "block_size_mb":  0
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "Network Adapter",
                                     "adapter_id":  "Microsoft:118D10AE-A94A-400A-A5A7-2985C19E9685\\AB0F8EBD-EFAB-4079-A049-E13ACBF3A794",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D016542",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  true,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Access",
                                     "vlanid_untagged":  17
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-1",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "corp-nps-vm-1",
        "vm_id":  "2a12843b-a9f1-4e8b-b0b2-26d13c2689f4",
        "firmware_type":  null,
        "vm_notes":  "#CLUSTER-INVARIANT#:{44c26f72-2f41-41d1-81cd-fc09b83500a1}",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-nps-vm-1",
        "host_location_config":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-nps-vm-1",
        "host_location_snapshot":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-nps-vm-1",
        "host_location_smartpaging":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-nps-vm-1",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  2,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  4,
                       "mem_dynamic":  true,
                       "mem_min_gb":  2,
                       "mem_max_gb":  8,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "UEFI",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "Save",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "Windows Boot Manager EFI SCSI Device EFI SCSI Device EFI Network",
                             "pause_after_failure":  false,
                             "secure":  true,
                             "secure_template":  "MicrosoftWindows",
                             "preferred_network_protocol":  "IPv4",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-nps-vm-1\\Virtual Hard Disks\\_template_winsvr_2022_disk_1.vhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  52,
                                                                  "disk_size_gb":  60,
                                                                  "block_size_mb":  2
                                                              },
                                                              {
                                                                  "resource_pool":  "",
                                                                  "drive_type":  "DvdDrive",
                                                                  "path":  "",
                                                                  "controller_location":  1,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  null,
                                                                  "file_subtype":  null,
                                                                  "drive_id":  null,
                                                                  "parent_path":  null,
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  0,
                                                                  "block_size_mb":  0
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "corp-nps-vm-1",
                                     "adapter_id":  "Microsoft:2A12843B-A9F1-4E8B-B0B2-26D13C2689F4\\EE7B5CF7-2258-46AA-AF41-929032908783",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D016597",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Access",
                                     "vlanid_untagged":  0
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-1",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "corp-paul-sv-1",
        "vm_id":  "bfa77b7f-e97e-48c2-9305-7c96c5095e03",
        "firmware_type":  null,
        "vm_notes":  "#CLUSTER-INVARIANT#:{15b6e321-146e-48c8-8d2d-1335f659bb95}",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-paul-sv-1",
        "host_location_config":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-paul-sv-1",
        "host_location_snapshot":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-paul-sv-1",
        "host_location_smartpaging":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-paul-sv-1",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  2,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  8,
                       "mem_dynamic":  true,
                       "mem_min_gb":  4,
                       "mem_max_gb":  8,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "UEFI",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "Save",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "Ubuntu EFI SCSI Device Windows Boot Manager EFI SCSI Device EFI Network EFI Network",
                             "pause_after_failure":  false,
                             "secure":  true,
                             "secure_template":  "MicrosoftUEFICertificateAuthority",
                             "preferred_network_protocol":  "IPv4",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "c:\\ClusterStorage\\CriticalNonRedundant\\corp-paul-sv-1\\Virtual Hard Disks\\corp-paul-sv-01_disk_1.vhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  106,
                                                                  "disk_size_gb":  200,
                                                                  "block_size_mb":  2
                                                              },
                                                              {
                                                                  "resource_pool":  "",
                                                                  "drive_type":  "DvdDrive",
                                                                  "path":  "",
                                                                  "controller_location":  1,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  null,
                                                                  "file_subtype":  null,
                                                                  "drive_id":  null,
                                                                  "parent_path":  null,
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  0,
                                                                  "block_size_mb":  0
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "Network Adapter",
                                     "adapter_id":  "Microsoft:BFA77B7F-E97E-48C2-9305-7C96C5095E03\\7045D9CC-E9ED-4C33-B2D9-AD0591743BDB",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  false,
                                     "mac_address":  "00155D016722",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Access",
                                     "vlanid_untagged":  23
                                 },
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "Network Adapter",
                                     "adapter_id":  "Microsoft:BFA77B7F-E97E-48C2-9305-7C96C5095E03\\A77B1BA7-A041-4462-9E12-4D958F4415A1",
                                     "resource_pool":  "Primordial",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D01658B",
                                     "vmmq_enabled":  true,
                                     "vrss_enabled":  true,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Access",
                                     "vlanid_untagged":  17
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-1",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "corp-pkica-vm-1",
        "vm_id":  "b6443317-14bc-4412-ad9d-08f74690ccb5",
        "firmware_type":  null,
        "vm_notes":  "Enterprise Subordinate Certificate Authority#CLUSTER-INVARIANT#:{9e1c1f18-adc3-4d5b-9cd5-72ca2ce00171}",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\Redundant1\\corp-pkica-vm-1",
        "host_location_config":  "C:\\ClusterStorage\\Redundant1\\corp-pkica-vm-1",
        "host_location_snapshot":  "C:\\ClusterStorage\\Redundant1\\corp-pkica-vm-1",
        "host_location_smartpaging":  "C:\\ClusterStorage\\Redundant1\\corp-pkica-vm-1",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  2,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  4,
                       "mem_dynamic":  true,
                       "mem_min_gb":  2,
                       "mem_max_gb":  4,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "UEFI",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "ShutDown",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "Windows Boot Manager EFI SCSI Device EFI SCSI Device EFI Network",
                             "pause_after_failure":  false,
                             "secure":  true,
                             "secure_template":  "MicrosoftWindows",
                             "preferred_network_protocol":  "IPv4",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\Redundant1\\corp-pkica-vm-1\\Virtual Hard Disks\\corp-pkica-vm-1_disk_1_716965BA-D72B-4160-A076-89F6F35D2482.avhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Differencing",
                                                                  "drive_id":  "Differencing",
                                                                  "parent_path":  "C:\\ClusterStorage\\Redundant1\\corp-pkica-vm-1\\Virtual Hard Disks\\corp-pkica-vm-1_disk_1.vhdx",
                                                                  "file_size_gb":  45,
                                                                  "disk_size_gb":  60,
                                                                  "block_size_mb":  2
                                                              },
                                                              {
                                                                  "resource_pool":  "",
                                                                  "drive_type":  "DvdDrive",
                                                                  "path":  "",
                                                                  "controller_location":  1,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  null,
                                                                  "file_subtype":  null,
                                                                  "drive_id":  null,
                                                                  "parent_path":  null,
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  0,
                                                                  "block_size_mb":  0
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "corp-pkica-vm-1",
                                     "adapter_id":  "Microsoft:B6443317-14BC-4412-AD9D-08F74690CCB5\\594BBFE3-AA91-4878-A454-E9DEEFCA9E92",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D016596",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Access",
                                     "vlanid_untagged":  0
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-1",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "corp-pkior-vm-1",
        "vm_id":  "e4e5df81-a9cf-4a51-861e-07fbf1366741",
        "firmware_type":  null,
        "vm_notes":  "DO NOT TURN ON! Offline Root Certificate Authority#CLUSTER-INVARIANT#:{e0678418-47e8-4e6d-b062-d07640e01782}",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-pkior-vm-1",
        "host_location_config":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-pkior-vm-1",
        "host_location_snapshot":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-pkior-vm-1",
        "host_location_smartpaging":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-pkior-vm-1",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  2,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  4,
                       "mem_dynamic":  true,
                       "mem_min_gb":  2,
                       "mem_max_gb":  4,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "UEFI",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "ShutDown",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "Windows Boot Manager EFI SCSI Device EFI SCSI Device EFI Network",
                             "pause_after_failure":  false,
                             "secure":  false,
                             "secure_template":  "MicrosoftWindows",
                             "preferred_network_protocol":  "IPv4",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-pkior-vm-1\\Virtual Hard Disks\\corp-pkior-vm-1_disk_1.vhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  52,
                                                                  "disk_size_gb":  60,
                                                                  "block_size_mb":  2
                                                              },
                                                              {
                                                                  "resource_pool":  "",
                                                                  "drive_type":  "DvdDrive",
                                                                  "path":  "",
                                                                  "controller_location":  1,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  null,
                                                                  "file_subtype":  null,
                                                                  "drive_id":  null,
                                                                  "parent_path":  null,
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  0,
                                                                  "block_size_mb":  0
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "corp-pkior-vm-1",
                                     "adapter_id":  "Microsoft:E4E5DF81-A9CF-4A51-861E-07FBF1366741\\933C2EA2-24E3-46ED-9C09-F4FD75F610FC",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D01659B",
                                     "vmmq_enabled":  true,
                                     "vrss_enabled":  true,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Access",
                                     "vlanid_untagged":  0
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-1",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "corp-pkiw-vm-1",
        "vm_id":  "400d7ef2-142c-42e9-a11e-731188ac91b6",
        "firmware_type":  null,
        "vm_notes":  "Certificate Web Services, OCSP Responder#CLUSTER-INVARIANT#:{39f1bd65-a02a-4f86-a98c-868ec7e6a450}",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\Redundant1\\corp-pkiw-vm-1",
        "host_location_config":  "C:\\ClusterStorage\\Redundant1\\corp-pkiw-vm-1",
        "host_location_snapshot":  "C:\\ClusterStorage\\Redundant1\\corp-pkiw-vm-1",
        "host_location_smartpaging":  "C:\\ClusterStorage\\Redundant1\\corp-pkiw-vm-1",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  2,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  4,
                       "mem_dynamic":  true,
                       "mem_min_gb":  2,
                       "mem_max_gb":  4,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "UEFI",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "ShutDown",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "Windows Boot Manager EFI SCSI Device EFI Network EFI SCSI Device",
                             "pause_after_failure":  false,
                             "secure":  true,
                             "secure_template":  "MicrosoftWindows",
                             "preferred_network_protocol":  "IPv4",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\Redundant1\\corp-pkiw-vm-1\\Virtual Hard Disks\\corp-pkiw-vm-1_disk_1.vhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  51,
                                                                  "disk_size_gb":  60,
                                                                  "block_size_mb":  2
                                                              },
                                                              {
                                                                  "resource_pool":  "",
                                                                  "drive_type":  "DvdDrive",
                                                                  "path":  "",
                                                                  "controller_location":  1,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  null,
                                                                  "file_subtype":  null,
                                                                  "drive_id":  null,
                                                                  "parent_path":  null,
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  0,
                                                                  "block_size_mb":  0
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "corp-pkiw-vm-1",
                                     "adapter_id":  "Microsoft:400D7EF2-142C-42E9-A11E-731188AC91B6\\034C7EE0-FE8A-412E-8371-DCB7A0C1987D",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D01659A",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Access",
                                     "vlanid_untagged":  0
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-1",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "corp-plj-bx-1",
        "vm_id":  "943beb2f-9ac0-4dfa-8b61-1b65f76375cb",
        "firmware_type":  null,
        "vm_notes":  "",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "c:\\ClusterStorage\\NonRedundant\\corp-plj-bx-1\\corp-plj-bx-1",
        "host_location_config":  "c:\\ClusterStorage\\NonRedundant\\corp-plj-bx-1\\corp-plj-bx-1",
        "host_location_snapshot":  "c:\\ClusterStorage\\NonRedundant\\corp-plj-bx-1\\corp-plj-bx-1",
        "host_location_smartpaging":  "c:\\ClusterStorage\\NonRedundant\\corp-plj-bx-1\\corp-plj-bx-1",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  4,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  8,
                       "mem_dynamic":  false,
                       "mem_min_gb":  0,
                       "mem_max_gb":  1024,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "UEFI",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "Save",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "Windows Boot Manager EFI Network EFI SCSI Device",
                             "pause_after_failure":  false,
                             "secure":  true,
                             "secure_template":  "MicrosoftWindows",
                             "preferred_network_protocol":  "IPv4",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "c:\\ClusterStorage\\NonRedundant\\corp-plj-bx-1\\corp-plj-bx-1-os.vhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  119,
                                                                  "disk_size_gb":  120,
                                                                  "block_size_mb":  32
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [
                                                           1,
                                                           2,
                                                           3,
                                                           4,
                                                           5,
                                                           6,
                                                           7,
                                                           8,
                                                           9,
                                                           10,
                                                           11,
                                                           12,
                                                           13,
                                                           14,
                                                           15,
                                                           16,
                                                           17,
                                                           18,
                                                           19,
                                                           20,
                                                           21,
                                                           22,
                                                           23,
                                                           24,
                                                           25,
                                                           26,
                                                           27,
                                                           28,
                                                           29,
                                                           30,
                                                           31,
                                                           32,
                                                           33,
                                                           34,
                                                           35,
                                                           36,
                                                           37,
                                                           38,
                                                           39,
                                                           40,
                                                           41,
                                                           42,
                                                           43,
                                                           44,
                                                           45,
                                                           46,
                                                           47,
                                                           48,
                                                           49,
                                                           50,
                                                           51,
                                                           52,
                                                           53,
                                                           54,
                                                           55,
                                                           56,
                                                           57,
                                                           58,
                                                           59,
                                                           60,
                                                           61,
                                                           62,
                                                           63,
                                                           64,
                                                           65,
                                                           66,
                                                           67,
                                                           68,
                                                           69,
                                                           70,
                                                           71,
                                                           72,
                                                           73,
                                                           74,
                                                           75,
                                                           76,
                                                           77,
                                                           78,
                                                           79,
                                                           80,
                                                           81,
                                                           82,
                                                           83,
                                                           84,
                                                           85,
                                                           86,
                                                           87,
                                                           88,
                                                           89,
                                                           90,
                                                           91,
                                                           92,
                                                           93,
                                                           94,
                                                           95,
                                                           96,
                                                           97,
                                                           98,
                                                           99,
                                                           100
                                                       ],
                                     "name":  "Network Adapter",
                                     "adapter_id":  "Microsoft:943BEB2F-9AC0-4DFA-8B61-1B65F76375CB\\B4229628-8328-4D7B-A98B-209C412BEA96",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D016594",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  false,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  false,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Trunk",
                                     "vlanid_untagged":  0
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-1",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "corp-plw-bx-1",
        "vm_id":  "2fad0214-0a72-4c57-9242-5ed9cd1be612",
        "firmware_type":  null,
        "vm_notes":  "",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "c:\\ClusterStorage\\NonRedundant\\corp-plw-bx-1\\corp-plw-bx-1",
        "host_location_config":  "c:\\ClusterStorage\\NonRedundant\\corp-plw-bx-1\\corp-plw-bx-1",
        "host_location_snapshot":  "c:\\ClusterStorage\\NonRedundant\\corp-plw-bx-1\\corp-plw-bx-1",
        "host_location_smartpaging":  "c:\\ClusterStorage\\NonRedundant\\corp-plw-bx-1\\corp-plw-bx-1",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  4,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  8,
                       "mem_dynamic":  false,
                       "mem_min_gb":  0,
                       "mem_max_gb":  1024,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "UEFI",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "Save",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "Windows Boot Manager EFI SCSI Device Ubuntu EFI SCSI Device EFI Network",
                             "pause_after_failure":  false,
                             "secure":  true,
                             "secure_template":  "MicrosoftWindows",
                             "preferred_network_protocol":  "IPv4",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "c:\\ClusterStorage\\NonRedundant\\corp-plw-bx-1\\corp-plw-bx-1-os.vhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  54,
                                                                  "disk_size_gb":  120,
                                                                  "block_size_mb":  32
                                                              },
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "DvdDrive",
                                                                  "path":  "C:\\ClusterStorage\\SupportFiles\\ISOs\\SW_DVD9_Win_Server_STD_CORE_2022_2108.23_64Bit_English_DC_STD_MLF_X23-50413.ISO",
                                                                  "controller_location":  1,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  null,
                                                                  "file_subtype":  null,
                                                                  "drive_id":  null,
                                                                  "parent_path":  null,
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  0,
                                                                  "block_size_mb":  0
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "Network Adapter",
                                     "adapter_id":  "Microsoft:2FAD0214-0A72-4C57-9242-5ED9CD1BE612\\5F9CC56E-4E14-4BB7-9DC9-2588B886FEEC",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D01658D",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Untagged",
                                     "vlanid_untagged":  0
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-1",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "corp-print-vm-1",
        "vm_id":  "c1262eee-c8bb-40aa-98d8-c9403ee4250e",
        "firmware_type":  null,
        "vm_notes":  "#CLUSTER-INVARIANT#:{34bb29d3-d220-468e-b880-bd371261824a}",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-print-vm-1",
        "host_location_config":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-print-vm-1",
        "host_location_snapshot":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-print-vm-1",
        "host_location_smartpaging":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-print-vm-1",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  2,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  8,
                       "mem_dynamic":  true,
                       "mem_min_gb":  5,
                       "mem_max_gb":  1024,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "UEFI",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "Save",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "Windows Boot Manager EFI SCSI Device EFI Network EFI SCSI Device",
                             "pause_after_failure":  false,
                             "secure":  true,
                             "secure_template":  "MicrosoftWindows",
                             "preferred_network_protocol":  "IPv4",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-print-vm-1\\Virtual Hard Disks\\corp-print-vm-1_0A807B2A-D4C0-410F-999D-0B7EF83B4125.avhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Differencing",
                                                                  "drive_id":  "Differencing",
                                                                  "parent_path":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-print-vm-1\\Virtual Hard Disks\\corp-print-vm-1.vhdx",
                                                                  "file_size_gb":  95,
                                                                  "disk_size_gb":  150,
                                                                  "block_size_mb":  2
                                                              },
                                                              {
                                                                  "resource_pool":  "",
                                                                  "drive_type":  "DvdDrive",
                                                                  "path":  "",
                                                                  "controller_location":  1,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  null,
                                                                  "file_subtype":  null,
                                                                  "drive_id":  null,
                                                                  "parent_path":  null,
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  0,
                                                                  "block_size_mb":  0
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "Network Adapter",
                                     "adapter_id":  "Microsoft:C1262EEE-C8BB-40AA-98D8-C9403EE4250E\\202BE8A4-0B1E-4392-B8E5-16E02F2F004D",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D016599",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Untagged",
                                     "vlanid_untagged":  0
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-1",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "corp-qb-vm-1",
        "vm_id":  "348c11fc-924e-449b-9d44-81dcbdb7e902",
        "firmware_type":  null,
        "vm_notes":  "Quickbooks Server#CLUSTER-INVARIANT#:{c43a6c9e-4e6f-4473-9dfa-5a7c18527a69}",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-qb-vm-1",
        "host_location_config":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-qb-vm-1",
        "host_location_snapshot":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-qb-vm-1",
        "host_location_smartpaging":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-qb-vm-1",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  2,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  4,
                       "mem_dynamic":  true,
                       "mem_min_gb":  2,
                       "mem_max_gb":  8,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "UEFI",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "Save",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "Windows Boot Manager EFI SCSI Device EFI SCSI Device EFI Network EFI SCSI Device EFI SCSI Device",
                             "pause_after_failure":  false,
                             "secure":  true,
                             "secure_template":  "MicrosoftWindows",
                             "preferred_network_protocol":  "IPv4",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-qb-vm-1\\Virtual Hard Disks\\_template_winsvr_2022_disk_1_A71A8FCB-2C03-4CBF-98F2-E1FB97185995.avhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Differencing",
                                                                  "drive_id":  "Differencing",
                                                                  "parent_path":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-qb-vm-1\\Virtual Hard Disks\\_template_winsvr_2022_disk_1.vhdx",
                                                                  "file_size_gb":  44,
                                                                  "disk_size_gb":  60,
                                                                  "block_size_mb":  2
                                                              },
                                                              {
                                                                  "resource_pool":  "",
                                                                  "drive_type":  "DvdDrive",
                                                                  "path":  "",
                                                                  "controller_location":  1,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  null,
                                                                  "file_subtype":  null,
                                                                  "drive_id":  null,
                                                                  "parent_path":  null,
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  0,
                                                                  "block_size_mb":  0
                                                              },
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-qb-vm-1\\Virtual Hard Disks\\corp-qb-vm-1_disk_2_60515F86-E633-4AA8-832D-49DA026EC2B8.avhdx",
                                                                  "controller_location":  2,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Differencing",
                                                                  "drive_id":  "Differencing",
                                                                  "parent_path":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-qb-vm-1\\Virtual Hard Disks\\corp-qb-vm-1_disk_2.vhdx",
                                                                  "file_size_gb":  29,
                                                                  "disk_size_gb":  60,
                                                                  "block_size_mb":  2
                                                              },
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-qb-vm-1\\Virtual Hard Disks\\corp-qb-vm-1_disk_3_E102DFD0-9484-48C4-A3CD-E2AB2085D1BC.avhdx",
                                                                  "controller_location":  3,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Differencing",
                                                                  "drive_id":  "Differencing",
                                                                  "parent_path":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-qb-vm-1\\Virtual Hard Disks\\corp-qb-vm-1_disk_3.vhdx",
                                                                  "file_size_gb":  1,
                                                                  "disk_size_gb":  30,
                                                                  "block_size_mb":  2
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "_template_winsvr_2022",
                                     "adapter_id":  "Microsoft:348C11FC-924E-449B-9D44-81DCBDB7E902\\96268F93-76ED-4F78-AAC7-57AC477DD155",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D016598",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Access",
                                     "vlanid_untagged":  0
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-1",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "corp-rauth-vm-1.bwirauth.com",
        "vm_id":  "6f65e004-f1e7-4fcc-841f-5a855a96d7c9",
        "firmware_type":  null,
        "vm_notes":  "Domain Controller/RADIUS server for BWIRAUTH#CLUSTER-INVARIANT#:{c8de1c51-0b99-48f8-9be5-105be6d7964d}",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\Redundant1\\corp-rauth-vm-1.bwirauth.com",
        "host_location_config":  "C:\\ClusterStorage\\Redundant1\\corp-rauth-vm-1.bwirauth.com",
        "host_location_snapshot":  "C:\\ClusterStorage\\Redundant1\\corp-rauth-vm-1.bwirauth.com",
        "host_location_smartpaging":  "C:\\ClusterStorage\\Redundant1\\corp-rauth-vm-1.bwirauth.com",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  2,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  4,
                       "mem_dynamic":  true,
                       "mem_min_gb":  4,
                       "mem_max_gb":  6,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "UEFI",
                             "start_action":  "Nothing",
                             "start_delay":  10,
                             "stop_action":  "ShutDown",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "Windows Boot Manager EFI SCSI Device EFI SCSI Device EFI Network EFI SCSI Device EFI Network",
                             "pause_after_failure":  false,
                             "secure":  true,
                             "secure_template":  "MicrosoftWindows",
                             "preferred_network_protocol":  "IPv4",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\Redundant1\\corp-rauth-vm-1.bwirauth.com\\Virtual Hard Disks\\_template_winsvr_2022_disk_1.vhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  55,
                                                                  "disk_size_gb":  60,
                                                                  "block_size_mb":  2
                                                              },
                                                              {
                                                                  "resource_pool":  "",
                                                                  "drive_type":  "DvdDrive",
                                                                  "path":  "",
                                                                  "controller_location":  1,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  null,
                                                                  "file_subtype":  null,
                                                                  "drive_id":  null,
                                                                  "parent_path":  null,
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  0,
                                                                  "block_size_mb":  0
                                                              },
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\Redundant1\\corp-rauth-vm-1.bwirauth.com\\Virtual Hard Disks\\corp-rauth-vm-1.bwirauth.com_disk_1.vhdx",
                                                                  "controller_location":  2,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  13,
                                                                  "disk_size_gb":  60,
                                                                  "block_size_mb":  2
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "corp-rauth-vm-1.bwirauth.com",
                                     "adapter_id":  "Microsoft:6F65E004-F1E7-4FCC-841F-5A855A96D7C9\\14E4D294-98F9-4733-AD70-18F46A8C71D9",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D01658E",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Access",
                                     "vlanid_untagged":  0
                                 },
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "Network Adapter",
                                     "adapter_id":  "Microsoft:6F65E004-F1E7-4FCC-841F-5A855A96D7C9\\16FFC545-51E8-412B-B671-708C74E5F5AD",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D01658F",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Access",
                                     "vlanid_untagged":  17
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-1",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "corp-scangun1",
        "vm_id":  "ef7d95e2-7dae-4077-9180-c95f46fdceea",
        "firmware_type":  null,
        "vm_notes":  "",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "c:\\ClusterStorage\\Redundant1\\corp-scangun1",
        "host_location_config":  "c:\\ClusterStorage\\Redundant1\\corp-scangun1",
        "host_location_snapshot":  "c:\\ClusterStorage\\Redundant1\\corp-scangun1",
        "host_location_smartpaging":  "c:\\ClusterStorage\\Redundant1\\corp-scangun1",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  1,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  4,
                       "mem_dynamic":  false,
                       "mem_min_gb":  0,
                       "mem_max_gb":  1024,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "UEFI",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "Save",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "Windows Boot Manager EFI SCSI Device EFI Network EFI SCSI Device",
                             "pause_after_failure":  false,
                             "secure":  true,
                             "secure_template":  "MicrosoftWindows",
                             "preferred_network_protocol":  "IPv4",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "c:\\ClusterStorage\\Redundant1\\corp-scangun1\\Virtual Hard Disks\\corp-scangun1_2EEECD0B-3A32-4DD5-A82D-9F36BC63FB25.avhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Differencing",
                                                                  "drive_id":  "Differencing",
                                                                  "parent_path":  "c:\\ClusterStorage\\Redundant1\\corp-scangun1\\Virtual Hard Disks\\corp-scangun1.vhdx",
                                                                  "file_size_gb":  56,
                                                                  "disk_size_gb":  127,
                                                                  "block_size_mb":  2
                                                              },
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "DvdDrive",
                                                                  "path":  "C:\\ClusterStorage\\SupportFiles\\sw_dvd9_win_server_std_core_2022_2108.27_64bit_english_dc_std_mlf_x23-64869.iso",
                                                                  "controller_location":  1,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  null,
                                                                  "file_subtype":  null,
                                                                  "drive_id":  null,
                                                                  "parent_path":  null,
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  0,
                                                                  "block_size_mb":  0
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "Network Adapter",
                                     "adapter_id":  "Microsoft:EF7D95E2-7DAE-4077-9180-C95F46FDCEEA\\3B7577C4-7B88-4FC5-9C73-10C6224995A0",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D01659C",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Access",
                                     "vlanid_untagged":  39
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-1",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "corp-smtprelay-1",
        "vm_id":  "b8455bf6-d7d9-4df4-9548-7ddb9cd4c189",
        "firmware_type":  null,
        "vm_notes":  "#CLUSTER-INVARIANT#:{35cd02cf-7327-4eff-adf3-edd414929112}",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\Redundant1\\corp-smtprelay-1",
        "host_location_config":  "C:\\ClusterStorage\\Redundant1\\corp-smtprelay-1",
        "host_location_snapshot":  "C:\\ClusterStorage\\Redundant1\\corp-smtprelay-1",
        "host_location_smartpaging":  "C:\\ClusterStorage\\Redundant1\\corp-smtprelay-1",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  4,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  4,
                       "mem_dynamic":  false,
                       "mem_min_gb":  0,
                       "mem_max_gb":  1024,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "UEFI",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "Save",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "ubuntu EFI Network EFI SCSI Device EFI Network",
                             "pause_after_failure":  false,
                             "secure":  true,
                             "secure_template":  "MicrosoftUEFICertificateAuthority",
                             "preferred_network_protocol":  "IPv4",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\Redundant1\\corp-smtprelay-1\\Virtual Hard Disks\\corp-smtprelay-1.vhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  32,
                                                                  "disk_size_gb":  127,
                                                                  "block_size_mb":  32
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "Network Adapter",
                                     "adapter_id":  "Microsoft:B8455BF6-D7D9-4DF4-9548-7DDB9CD4C189\\9C8F4BA8-0098-43A6-A7D0-784B8F1DC509",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D016666",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Access",
                                     "vlanid_untagged":  39
                                 },
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "Network Adapter",
                                     "adapter_id":  "Microsoft:B8455BF6-D7D9-4DF4-9548-7DDB9CD4C189\\5D95A459-F59E-4EA8-BD8D-0BD491CB5DB9",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D01659F",
                                     "vmmq_enabled":  true,
                                     "vrss_enabled":  true,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Untagged",
                                     "vlanid_untagged":  0
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-1",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "corp-sql-vm-1",
        "vm_id":  "3781c171-b934-4aa2-913e-bb95d8db3808",
        "firmware_type":  null,
        "vm_notes":  "SQL Server 2019 Standard - replaces corp-sql-vm#CLUSTER-INVARIANT#:{45c1c10d-586e-421c-ab08-23a02d73b1bb}",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-sql-vm-1",
        "host_location_config":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-sql-vm-1",
        "host_location_snapshot":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-sql-vm-1",
        "host_location_smartpaging":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-sql-vm-1",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  6,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  128,
                       "mem_dynamic":  false,
                       "mem_min_gb":  2,
                       "mem_max_gb":  128,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "UEFI",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "Save",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "Windows Boot Manager EFI Network EFI SCSI Device EFI SCSI Device EFI SCSI Device EFI SCSI Device",
                             "pause_after_failure":  false,
                             "secure":  true,
                             "secure_template":  "MicrosoftWindows",
                             "preferred_network_protocol":  "IPv4",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-sql-vm-1\\Virtual Hard Disks\\corp-sql-vm-1_disk_1_6063401B-696C-4D63-98E1-EA70D91EA25C.avhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Differencing",
                                                                  "drive_id":  "Differencing",
                                                                  "parent_path":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-sql-vm-1\\Virtual Hard Disks\\corp-sql-vm-1_disk_1.vhdx",
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  250,
                                                                  "block_size_mb":  2
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            },
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-sql-vm-1\\Virtual Hard Disks\\corp-sql-vm-1_disk_data_1_0CF02235-C702-407B-8B81-BA10696CA943.avhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Differencing",
                                                                  "drive_id":  "Differencing",
                                                                  "parent_path":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-sql-vm-1\\Virtual Hard Disks\\corp-sql-vm-1_disk_data_1.vhdx",
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  750,
                                                                  "block_size_mb":  2
                                                              },
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-sql-vm-1\\Virtual Hard Disks\\corp-sql-vm-1_disk_logs_1_065B5791-0A07-4125-A92B-200CC9B74030.avhdx",
                                                                  "controller_location":  1,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Differencing",
                                                                  "drive_id":  "Differencing",
                                                                  "parent_path":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-sql-vm-1\\Virtual Hard Disks\\corp-sql-vm-1_disk_logs_1.vhdx",
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  512,
                                                                  "block_size_mb":  2
                                                              },
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-sql-vm-1\\Virtual Hard Disks\\corp-sql-vm-1_disk_backups_1_276FFA35-93AA-4675-8666-DAD4C4A161DB.avhdx",
                                                                  "controller_location":  2,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Differencing",
                                                                  "drive_id":  "Differencing",
                                                                  "parent_path":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-sql-vm-1\\Virtual Hard Disks\\corp-sql-vm-1_disk_backups_1.vhdx",
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  300,
                                                                  "block_size_mb":  2
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  1
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "_template_winsvr_2022",
                                     "adapter_id":  "Microsoft:3781C171-B934-4AA2-913E-BB95D8DB3808\\96268F93-76ED-4F78-AAC7-57AC477DD155",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D016592",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Access",
                                     "vlanid_untagged":  0
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-1",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "corp-vertexdb-1",
        "vm_id":  "6b7b8682-5ca1-481f-8d71-1c5e5bf2e8d4",
        "firmware_type":  null,
        "vm_notes":  "",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\Redundant1\\corp-vertexdb-1",
        "host_location_config":  "C:\\ClusterStorage\\Redundant1\\corp-vertexdb-1",
        "host_location_snapshot":  "C:\\ClusterStorage\\Redundant1\\corp-vertexdb-1",
        "host_location_smartpaging":  "C:\\ClusterStorage\\Redundant1\\corp-vertexdb-1",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  8,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  16,
                       "mem_dynamic":  false,
                       "mem_min_gb":  0,
                       "mem_max_gb":  1024,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "UEFI",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "Save",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "ubuntu EFI SCSI Device EFI Network EFI SCSI Device",
                             "pause_after_failure":  false,
                             "secure":  true,
                             "secure_template":  "MicrosoftUEFICertificateAuthority",
                             "preferred_network_protocol":  "IPv4",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\Redundant1\\corp-vertexdb-1\\Virtual Hard Disks\\corp-vertexdb-1-os_F3FCCD85-9AD1-42F8-90EC-01BF346F77EB.avhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Differencing",
                                                                  "drive_id":  "Differencing",
                                                                  "parent_path":  "C:\\ClusterStorage\\Redundant1\\corp-vertexdb-1\\Virtual Hard Disks\\corp-vertexdb-1-os_C08043E8-3C1D-41D5-8C86-A04E29EADAC9.avhdx",
                                                                  "file_size_gb":  9,
                                                                  "disk_size_gb":  50,
                                                                  "block_size_mb":  2
                                                              },
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\Redundant1\\corp-vertexdb-1\\Virtual Hard Disks\\corp-vertexdb-1-config_3ED58F24-2D39-49CD-8BFF-C0EC541EF11A.avhdx",
                                                                  "controller_location":  1,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Differencing",
                                                                  "drive_id":  "Differencing",
                                                                  "parent_path":  "C:\\ClusterStorage\\Redundant1\\corp-vertexdb-1\\Virtual Hard Disks\\corp-vertexdb-1-config_93F423BC-0EC7-4931-A39C-7FF2B9162C64.avhdx",
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  1,
                                                                  "block_size_mb":  2
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "corp-vertexdb-1 - DMZ",
                                     "adapter_id":  "Microsoft:6B7B8682-5CA1-481F-8D71-1C5E5BF2E8D4\\57727D6A-7EEE-41C2-8A0A-9DF37142B42C",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D01657F",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  false,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Access",
                                     "vlanid_untagged":  39
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-1",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "corp-vertexwa-1",
        "vm_id":  "41926f46-e59d-4151-a328-74fc03264e54",
        "firmware_type":  null,
        "vm_notes":  "",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\Redundant1\\corp-vertexwa-1",
        "host_location_config":  "C:\\ClusterStorage\\Redundant1\\corp-vertexwa-1",
        "host_location_snapshot":  "C:\\ClusterStorage\\Redundant1\\corp-vertexwa-1",
        "host_location_smartpaging":  "C:\\ClusterStorage\\Redundant1\\corp-vertexwa-1",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  8,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  16,
                       "mem_dynamic":  false,
                       "mem_min_gb":  0,
                       "mem_max_gb":  1024,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "UEFI",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "Save",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "ubuntu EFI SCSI Device EFI Network EFI SCSI Device",
                             "pause_after_failure":  false,
                             "secure":  true,
                             "secure_template":  "MicrosoftUEFICertificateAuthority",
                             "preferred_network_protocol":  "IPv4",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\Redundant1\\corp-vertexwa-1\\Virtual Hard Disks\\corp-vertexwa-1-os_EA0E4F5A-02A3-4DFD-95FB-733F020B1D51.avhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Differencing",
                                                                  "drive_id":  "Differencing",
                                                                  "parent_path":  "C:\\ClusterStorage\\Redundant1\\corp-vertexwa-1\\Virtual Hard Disks\\corp-vertexwa-1-os.vhdx",
                                                                  "file_size_gb":  9,
                                                                  "disk_size_gb":  50,
                                                                  "block_size_mb":  2
                                                              },
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\Redundant1\\corp-vertexwa-1\\Virtual Hard Disks\\corp-vertexwa-1-config_22D7D0DA-8DC4-4A31-A09E-F5003B3F635A.avhdx",
                                                                  "controller_location":  1,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Differencing",
                                                                  "drive_id":  "Differencing",
                                                                  "parent_path":  "C:\\ClusterStorage\\Redundant1\\corp-vertexwa-1\\Virtual Hard Disks\\corp-vertexwa-1-config.vhdx",
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  1,
                                                                  "block_size_mb":  2
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "corp-vertexwa-1 - DMZ",
                                     "adapter_id":  "Microsoft:41926F46-E59D-4151-A328-74FC03264E54\\A0F32F42-A966-4F7A-8CF4-3423ECE9EAB9",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D01657D",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  false,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Access",
                                     "vlanid_untagged":  39
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-1",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "corp-vpn-vm-1",
        "vm_id":  "00f87925-172c-4bc4-8041-85b510544ea0",
        "firmware_type":  null,
        "vm_notes":  "Open VPN 1#CLUSTER-INVARIANT#:{eafac920-eeeb-4456-9d57-be41774f7415}",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\Volume4\\VPN",
        "host_location_config":  "C:\\ClusterStorage\\Volume4\\VPN",
        "host_location_snapshot":  "C:\\ClusterStorage\\Volume4\\VPN",
        "host_location_smartpaging":  "C:\\ClusterStorage\\Volume4\\VPN",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  4,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  4,
                       "mem_dynamic":  false,
                       "mem_min_gb":  0,
                       "mem_max_gb":  1024,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "UEFI",
                             "start_action":  "Nothing",
                             "start_delay":  30,
                             "stop_action":  "Save",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "ubuntu EFI SCSI Device EFI SCSI Device EFI Network",
                             "pause_after_failure":  false,
                             "secure":  false,
                             "secure_template":  "MicrosoftWindows",
                             "preferred_network_protocol":  "IPv4",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\Volume4\\VPN\\corp-vpn-vm-1_disk_1.vhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  16,
                                                                  "disk_size_gb":  40,
                                                                  "block_size_mb":  2
                                                              },
                                                              {
                                                                  "resource_pool":  "",
                                                                  "drive_type":  "DvdDrive",
                                                                  "path":  "",
                                                                  "controller_location":  1,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  null,
                                                                  "file_subtype":  null,
                                                                  "drive_id":  null,
                                                                  "parent_path":  null,
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  0,
                                                                  "block_size_mb":  0
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "corp-vpn-vm-1",
                                     "adapter_id":  "Microsoft:00F87925-172C-4BC4-8041-85B510544EA0\\85BDD814-B702-496F-A3DF-B72BC403EE45",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D01655C",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Access",
                                     "vlanid_untagged":  0
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-1",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "dc",
        "vm_id":  "fe1a53b6-be8b-400d-8108-3844c96e27c4",
        "firmware_type":  null,
        "vm_notes":  "#CLUSTER-INVARIANT#:{72dcc482-0e74-47ca-8415-160a7d513275}",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\Redundant1\\dc",
        "host_location_config":  "C:\\ClusterStorage\\Redundant1\\dc",
        "host_location_snapshot":  "C:\\ClusterStorage\\Redundant1\\dc",
        "host_location_smartpaging":  "C:\\ClusterStorage\\Redundant1\\dc",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  4,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  8,
                       "mem_dynamic":  false,
                       "mem_min_gb":  0,
                       "mem_max_gb":  1024,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "UEFI",
                             "start_action":  "Nothing",
                             "start_delay":  5,
                             "stop_action":  "Save",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "Windows Boot Manager EFI SCSI Device EFI Network EFI Network",
                             "pause_after_failure":  false,
                             "secure":  true,
                             "secure_template":  "MicrosoftWindows",
                             "preferred_network_protocol":  "IPv4",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\Redundant1\\dc\\Virtual Hard Disks\\DC_Disk_DC1.vhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  95,
                                                                  "disk_size_gb":  120,
                                                                  "block_size_mb":  32
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "Network Adapter",
                                     "adapter_id":  "Microsoft:FE1A53B6-BE8B-400D-8108-3844C96E27C4\\C0AD470F-A797-4A24-83E8-3EEAA60639D3",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D016590",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Untagged",
                                     "vlanid_untagged":  0
                                 },
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "Network Adapter",
                                     "adapter_id":  "Microsoft:FE1A53B6-BE8B-400D-8108-3844C96E27C4\\918A25A0-83B8-4ADD-8F88-D79601EA670B",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D016591",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Access",
                                     "vlanid_untagged":  39
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-1",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "dev-webpl-1",
        "vm_id":  "05e9db40-30de-40fd-82a9-9cfcff9f2ece",
        "firmware_type":  null,
        "vm_notes":  "",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\NonRedundant\\dev-webpl-1",
        "host_location_config":  "C:\\ClusterStorage\\NonRedundant\\dev-webpl-1",
        "host_location_snapshot":  "C:\\ClusterStorage\\NonRedundant\\dev-webpl-1",
        "host_location_smartpaging":  "C:\\ClusterStorage\\NonRedundant\\dev-webpl-1",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  8,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  4,
                       "mem_dynamic":  false,
                       "mem_min_gb":  0,
                       "mem_max_gb":  1024,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "UEFI",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "Save",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "ubuntu EFI SCSI Device EFI Network EFI SCSI Device",
                             "pause_after_failure":  false,
                             "secure":  true,
                             "secure_template":  "MicrosoftUEFICertificateAuthority",
                             "preferred_network_protocol":  "IPv4",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\NonRedundant\\dev-webpl-1\\Virtual Hard Disks\\dev-webpl-1-os.vhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  26,
                                                                  "disk_size_gb":  75,
                                                                  "block_size_mb":  16
                                                              },
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\NonRedundant\\dev-webpl-1\\Virtual Hard Disks\\dev-webpl-1-config.vhdx",
                                                                  "controller_location":  1,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  1,
                                                                  "block_size_mb":  32
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "dev-webpl-1 - DMZ",
                                     "adapter_id":  "Microsoft:05E9DB40-30DE-40FD-82A9-9CFCFF9F2ECE\\41B52406-13AD-4249-BDC3-C3307B1A0F5E",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D016583",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  false,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Access",
                                     "vlanid_untagged":  153
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-1",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "DFS1",
        "vm_id":  "96483692-b506-4e56-a051-bdb2a9dad3c7",
        "firmware_type":  null,
        "vm_notes":  "#CLUSTER-INVARIANT#:{53050dfa-6511-4334-a85e-211386f46d0f}",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\CriticalNonRedundant\\DFS1",
        "host_location_config":  "C:\\ClusterStorage\\CriticalNonRedundant\\DFS1",
        "host_location_snapshot":  "C:\\ClusterStorage\\CriticalNonRedundant\\DFS1",
        "host_location_smartpaging":  "C:\\ClusterStorage\\CriticalNonRedundant\\DFS1",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  4,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  16,
                       "mem_dynamic":  true,
                       "mem_min_gb":  8,
                       "mem_max_gb":  16,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "UEFI",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "Save",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "Windows Boot Manager EFI Network EFI SCSI Device EFI SCSI Device EFI SCSI Device EFI Network",
                             "pause_after_failure":  false,
                             "secure":  true,
                             "secure_template":  "MicrosoftWindows",
                             "preferred_network_protocol":  "IPv4",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\CriticalNonRedundant\\DFS1\\Virtual Hard Disks\\DFS2_A19396DF-EF0B-45CB-BB05-E942B2B8A561.avhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Differencing",
                                                                  "drive_id":  "Differencing",
                                                                  "parent_path":  "C:\\ClusterStorage\\CriticalNonRedundant\\DFS1\\Virtual Hard Disks\\DFS2.vhdx",
                                                                  "file_size_gb":  63,
                                                                  "disk_size_gb":  127,
                                                                  "block_size_mb":  2
                                                              },
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\CriticalNonRedundant\\DFS1\\Virtual Hard Disks\\DFS1_3E99DA7C-C7BE-48FC-B826-780CB67C4EEC.avhdx",
                                                                  "controller_location":  2,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Differencing",
                                                                  "drive_id":  "Differencing",
                                                                  "parent_path":  "C:\\ClusterStorage\\CriticalNonRedundant\\DFS1\\Virtual Hard Disks\\DFS1.vhdx",
                                                                  "file_size_gb":  173,
                                                                  "disk_size_gb":  1024,
                                                                  "block_size_mb":  2
                                                              },
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\CriticalNonRedundant\\DFS1\\Virtual Hard Disks\\DFS1_3_89F723FC-EEFC-43CB-B693-A450992757EF.avhdx",
                                                                  "controller_location":  3,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Differencing",
                                                                  "drive_id":  "Differencing",
                                                                  "parent_path":  "C:\\ClusterStorage\\CriticalNonRedundant\\DFS1\\Virtual Hard Disks\\DFS1_3.vhdx",
                                                                  "file_size_gb":  360,
                                                                  "disk_size_gb":  2048,
                                                                  "block_size_mb":  2
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            },
                                            {
                                                "Disks":  [

                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  1
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "Network Adapter",
                                     "adapter_id":  "Microsoft:96483692-B506-4E56-A051-BDB2A9DAD3C7\\89921F91-F32C-472B-A290-6D5F33583B88",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D01659D",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Untagged",
                                     "vlanid_untagged":  0
                                 },
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "Network Adapter",
                                     "adapter_id":  "Microsoft:96483692-B506-4E56-A051-BDB2A9DAD3C7\\BFF5E7E3-B372-46A2-BF00-8B0B297CF427",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D01659E",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Access",
                                     "vlanid_untagged":  8
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-1",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "ruckus-vsz-1",
        "vm_id":  "91f929b3-11be-465e-a3b1-1d33b6eafe3a",
        "firmware_type":  null,
        "vm_notes":  "#CLUSTER-INVARIANT#:{f3400e6b-0699-4be9-a353-779fc4a6c268}",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\Redundant1\\ruckus-vsz-1",
        "host_location_config":  "C:\\ClusterStorage\\Redundant1\\ruckus-vsz-1",
        "host_location_snapshot":  "C:\\ClusterStorage\\Redundant1\\ruckus-vsz-1",
        "host_location_smartpaging":  "C:\\ClusterStorage\\Redundant1\\ruckus-vsz-1",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  4,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  16,
                       "mem_dynamic":  false,
                       "mem_min_gb":  0,
                       "mem_max_gb":  1024,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "BIOS",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "Save",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "CD IDE LegacyNetworkAdapter Floppy",
                             "pause_after_failure":  false,
                             "secure":  false,
                             "secure_template":  "None",
                             "preferred_network_protocol":  "N/A",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "c:\\ClusterStorage\\Redundant1\\ruckus-vsz-1\\Virtual Hard Disks\\vscg_7EE14E6E-4820-40A8-A0DA-F6F3439BDB52.avhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Differencing",
                                                                  "drive_id":  "Differencing",
                                                                  "parent_path":  "c:\\ClusterStorage\\Redundant1\\ruckus-vsz-1\\Virtual Hard Disks\\vscg.vhdx",
                                                                  "file_size_gb":  14,
                                                                  "disk_size_gb":  40,
                                                                  "block_size_mb":  2
                                                              }
                                                          ],
                                                "ControllerType":  "VMIdeController",
                                                "ControllerNumber":  0
                                            },
                                            {
                                                "Disks":  [

                                                          ],
                                                "ControllerType":  "VMIdeController",
                                                "ControllerNumber":  1
                                            },
                                            {
                                                "Disks":  [

                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "Network Adapter",
                                     "adapter_id":  "Microsoft:91F929B3-11BE-465E-A3B1-1D33B6EAFE3A\\8D06D8F7-53C8-4608-89E6-F4DF31831336",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  false,
                                     "mac_address":  "00155D012189",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  false,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Access",
                                     "vlanid_untagged":  17
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-1",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "test-dc-vm-1",
        "vm_id":  "6b1fe069-b468-40e9-a954-1127e3713523",
        "firmware_type":  null,
        "vm_notes":  "",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\Redundant2\\test-dc-vm-1",
        "host_location_config":  "C:\\ClusterStorage\\Redundant2\\test-dc-vm-1",
        "host_location_snapshot":  "C:\\ClusterStorage\\Redundant2\\test-dc-vm-1",
        "host_location_smartpaging":  "C:\\ClusterStorage\\Redundant2\\test-dc-vm-1",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  1,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  8,
                       "mem_dynamic":  true,
                       "mem_min_gb":  0,
                       "mem_max_gb":  1024,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "UEFI",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "Save",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "Windows Boot Manager EFI SCSI Device EFI SCSI Device EFI Network",
                             "pause_after_failure":  false,
                             "secure":  true,
                             "secure_template":  "MicrosoftWindows",
                             "preferred_network_protocol":  "IPv4",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\Redundant2\\test-dc-vm-1\\virtual hard disks\\windows2022_upd202402.vhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  13,
                                                                  "disk_size_gb":  90,
                                                                  "block_size_mb":  32
                                                              },
                                                              {
                                                                  "resource_pool":  "",
                                                                  "drive_type":  "DvdDrive",
                                                                  "path":  "",
                                                                  "controller_location":  1,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  null,
                                                                  "file_subtype":  null,
                                                                  "drive_id":  null,
                                                                  "parent_path":  null,
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  0,
                                                                  "block_size_mb":  0
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "Network Adapter",
                                     "adapter_id":  "Microsoft:6B1FE069-B468-40E9-A954-1127E3713523\\72599ECD-94D0-41D4-BB61-3746DF6CCC56",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D016543",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Access",
                                     "vlanid_untagged":  99
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-1",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "test-wkst-vm-1",
        "vm_id":  "163bb91c-fd99-41c0-9fe0-f682c95b2728",
        "firmware_type":  null,
        "vm_notes":  "",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\Redundant2\\test-wkst-vm-1",
        "host_location_config":  "C:\\ClusterStorage\\Redundant2\\test-wkst-vm-1",
        "host_location_snapshot":  "C:\\ClusterStorage\\Redundant2\\test-wkst-vm-1",
        "host_location_smartpaging":  "C:\\ClusterStorage\\Redundant2\\test-wkst-vm-1",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  4,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  4,
                       "mem_dynamic":  false,
                       "mem_min_gb":  0,
                       "mem_max_gb":  1024,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "UEFI",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "Save",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "Windows Boot Manager EFI SCSI Device EFI SCSI Device",
                             "pause_after_failure":  false,
                             "secure":  true,
                             "secure_template":  "MicrosoftWindows",
                             "preferred_network_protocol":  "IPv4",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\Redundant2\\test-wkst-vm-1\\virtual hard disks\\windows2022_upd202402.vhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  11,
                                                                  "disk_size_gb":  90,
                                                                  "block_size_mb":  32
                                                              },
                                                              {
                                                                  "resource_pool":  "",
                                                                  "drive_type":  "DvdDrive",
                                                                  "path":  "",
                                                                  "controller_location":  1,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  null,
                                                                  "file_subtype":  null,
                                                                  "drive_id":  null,
                                                                  "parent_path":  null,
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  0,
                                                                  "block_size_mb":  0
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "Network Adapter",
                                     "adapter_id":  "Microsoft:163BB91C-FD99-41C0-9FE0-F682C95B2728\\5B5293A8-E665-4341-8F46-2FD827600AB8",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D016587",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Access",
                                     "vlanid_untagged":  99
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-2",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "corp-cloudgw2",
        "vm_id":  "3c374eb1-4c7c-42a0-9331-ee501d4925b4",
        "firmware_type":  null,
        "vm_notes":  "",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\Redundant2\\corp-cloudgw2",
        "host_location_config":  "C:\\ClusterStorage\\Redundant2\\corp-cloudgw2",
        "host_location_snapshot":  "C:\\ClusterStorage\\Redundant2\\corp-cloudgw2",
        "host_location_smartpaging":  "C:\\ClusterStorage\\Redundant2\\corp-cloudgw2",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  6,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  4,
                       "mem_dynamic":  false,
                       "mem_min_gb":  0,
                       "mem_max_gb":  1024,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "UEFI",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "Save",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "Windows Boot Manager EFI SCSI Device EFI Network EFI SCSI Device",
                             "pause_after_failure":  false,
                             "secure":  true,
                             "secure_template":  "MicrosoftWindows",
                             "preferred_network_protocol":  "IPv4",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\Redundant2\\corp-cloudgw2\\Virtual Hard Disks\\corp-cloudgw2.vhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  53,
                                                                  "disk_size_gb":  127,
                                                                  "block_size_mb":  32
                                                              },
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "DvdDrive",
                                                                  "path":  "C:\\ClusterStorage\\SupportFiles\\isos\\sw_dvd9_win_server_std_core_2022_2108.23_64bit_english_dc_std_mlf_x23-50413.iso",
                                                                  "controller_location":  1,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  null,
                                                                  "file_subtype":  null,
                                                                  "drive_id":  null,
                                                                  "parent_path":  null,
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  0,
                                                                  "block_size_mb":  0
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "Network Adapter",
                                     "adapter_id":  "Microsoft:3C374EB1-4C7C-42A0-9331-EE501D4925B4\\31473DAA-6F54-4D81-92FC-46AA38596F39",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D016671",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Access",
                                     "vlanid_untagged":  39
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-2",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "corp-david-sv-2",
        "vm_id":  "74f9244f-934b-446e-b6ab-9586d2975eb6",
        "firmware_type":  null,
        "vm_notes":  "Jump server template - Windows 11#CLUSTER-INVARIANT#:{492be73d-8bbd-473c-a9bc-891fadeaf3c9}",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-david-sv-2",
        "host_location_config":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-david-sv-2",
        "host_location_snapshot":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-david-sv-2",
        "host_location_smartpaging":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-david-sv-2",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  4,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  4,
                       "mem_dynamic":  true,
                       "mem_min_gb":  4,
                       "mem_max_gb":  8,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "UEFI",
                             "start_action":  "Nothing",
                             "start_delay":  10,
                             "stop_action":  "Save",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "Windows Boot Manager EFI SCSI Device EFI SCSI Device EFI Network",
                             "pause_after_failure":  false,
                             "secure":  true,
                             "secure_template":  "MicrosoftWindows",
                             "preferred_network_protocol":  "IPv4",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "c:\\ClusterStorage\\CriticalNonRedundant\\corp-david-sv-2\\Virtual Hard Disks\\corp-jump-sv-01_disk_1.vhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  165,
                                                                  "disk_size_gb":  200,
                                                                  "block_size_mb":  2
                                                              },
                                                              {
                                                                  "resource_pool":  "",
                                                                  "drive_type":  "DvdDrive",
                                                                  "path":  "",
                                                                  "controller_location":  1,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  null,
                                                                  "file_subtype":  null,
                                                                  "drive_id":  null,
                                                                  "parent_path":  null,
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  0,
                                                                  "block_size_mb":  0
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "corp-jump-sv-01",
                                     "adapter_id":  "Microsoft:74F9244F-934B-446E-B6AB-9586D2975EB6\\02E3B764-1780-4004-8F29-AD8DBEC40C2C",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D01662A",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  true,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Access",
                                     "vlanid_untagged":  23
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-2",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "corp-dns2",
        "vm_id":  "5b6b88cb-ae3e-4fa2-8e26-88f6c000580e",
        "firmware_type":  null,
        "vm_notes":  "#CLUSTER-INVARIANT#:{ce8a2b63-cad5-40ea-b68a-26c41c873356}",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\Redundant2\\corp-dns2",
        "host_location_config":  "C:\\ClusterStorage\\Redundant2\\corp-dns2",
        "host_location_snapshot":  "C:\\ClusterStorage\\Redundant2\\corp-dns2",
        "host_location_smartpaging":  "C:\\ClusterStorage\\Redundant2\\corp-dns2",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  2,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  1,
                       "mem_dynamic":  false,
                       "mem_min_gb":  0,
                       "mem_max_gb":  1024,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "BIOS",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "Save",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "CD IDE LegacyNetworkAdapter Floppy",
                             "pause_after_failure":  false,
                             "secure":  false,
                             "secure_template":  "None",
                             "preferred_network_protocol":  "N/A",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "c:\\ClusterStorage\\Redundant2\\corp-dns2\\Virtual Hard Disks\\forwarder-va.vhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  4,
                                                                  "disk_size_gb":  6,
                                                                  "block_size_mb":  32
                                                              },
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "c:\\ClusterStorage\\Redundant2\\corp-dns2\\Virtual Hard Disks\\dynamic.vhdx",
                                                                  "controller_location":  1,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Fixed",
                                                                  "drive_id":  "Fixed",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  0,
                                                                  "block_size_mb":  0
                                                              }
                                                          ],
                                                "ControllerType":  "VMIdeController",
                                                "ControllerNumber":  0
                                            },
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "",
                                                                  "drive_type":  "DvdDrive",
                                                                  "path":  "",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  null,
                                                                  "file_subtype":  null,
                                                                  "drive_id":  null,
                                                                  "parent_path":  null,
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  0,
                                                                  "block_size_mb":  0
                                                              }
                                                          ],
                                                "ControllerType":  "VMIdeController",
                                                "ControllerNumber":  1
                                            },
                                            {
                                                "Disks":  [

                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "Network Adapter",
                                     "adapter_id":  "Microsoft:5B6B88CB-AE3E-4FA2-8E26-88F6C000580E\\C9758872-D799-45F3-82F2-31EE60F74819",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D016669",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Access",
                                     "vlanid_untagged":  39
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-2",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "corp-ha-vm-2",
        "vm_id":  "01431c57-f9e3-4b70-8844-f4a4f9cfe3de",
        "firmware_type":  null,
        "vm_notes":  "#CLUSTER-INVARIANT#:{ca180ff0-3d45-4d72-aace-84932db99ca4}",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\Redundant2\\corp-ha-vm-2",
        "host_location_config":  "C:\\ClusterStorage\\Redundant2\\corp-ha-vm-2",
        "host_location_snapshot":  "C:\\ClusterStorage\\Redundant2\\corp-ha-vm-2",
        "host_location_smartpaging":  "C:\\ClusterStorage\\Redundant2\\corp-ha-vm-2",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  2,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  4,
                       "mem_dynamic":  true,
                       "mem_min_gb":  2,
                       "mem_max_gb":  6,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "UEFI",
                             "start_action":  "Nothing",
                             "start_delay":  5,
                             "stop_action":  "ShutDown",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "ubuntu EFI SCSI Device EFI SCSI Device EFI Network",
                             "pause_after_failure":  false,
                             "secure":  false,
                             "secure_template":  "MicrosoftWindows",
                             "preferred_network_protocol":  "IPv4",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\Redundant2\\corp-ha-vm-2\\Virtual Hard Disks\\corp-pf-ha-vm-1_disk_1.vhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  24,
                                                                  "disk_size_gb":  60,
                                                                  "block_size_mb":  2
                                                              },
                                                              {
                                                                  "resource_pool":  "",
                                                                  "drive_type":  "DvdDrive",
                                                                  "path":  "",
                                                                  "controller_location":  1,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  null,
                                                                  "file_subtype":  null,
                                                                  "drive_id":  null,
                                                                  "parent_path":  null,
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  0,
                                                                  "block_size_mb":  0
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "corp-pf-ha-vm-1",
                                     "adapter_id":  "Microsoft:01431C57-F9E3-4B70-8844-F4A4F9CFE3DE\\D648B539-1ABC-4DCA-9803-9B1571E27039",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D016628",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  false,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Access",
                                     "vlanid_untagged":  0
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-2",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "corp-jmpl-pc",
        "vm_id":  "7b109cdc-efec-4db7-b433-c493e43c3f7e",
        "firmware_type":  null,
        "vm_notes":  "",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\Redundant1\\corp-jmpl-pc",
        "host_location_config":  "C:\\ClusterStorage\\Redundant1\\corp-jmpl-pc",
        "host_location_snapshot":  "C:\\ClusterStorage\\Redundant1\\corp-jmpl-pc",
        "host_location_smartpaging":  "C:\\ClusterStorage\\Redundant1\\corp-jmpl-pc",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  4,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  4,
                       "mem_dynamic":  false,
                       "mem_min_gb":  0,
                       "mem_max_gb":  1024,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "UEFI",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "Save",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "Ubuntu EFI SCSI Device EFI Network EFI SCSI Device",
                             "pause_after_failure":  false,
                             "secure":  true,
                             "secure_template":  "MicrosoftUEFICertificateAuthority",
                             "preferred_network_protocol":  "IPv4",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\Redundant1\\corp-jmpl-pc\\Virtual Hard Disks\\corp-jmpl-pc-os.vhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  17,
                                                                  "disk_size_gb":  50,
                                                                  "block_size_mb":  16
                                                              },
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\Redundant1\\corp-jmpl-pc\\Virtual Hard Disks\\corp-jmpl-pc-config.vhdx",
                                                                  "controller_location":  1,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  1,
                                                                  "block_size_mb":  32
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "corp-jmpl-pc - DMZ",
                                     "adapter_id":  "Microsoft:7B109CDC-EFEC-4DB7-B433-C493E43C3F7E\\B8C90190-518C-4D6E-8A56-E87FFB1F6517",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D01655A",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  false,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Access",
                                     "vlanid_untagged":  23
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-2",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "corp-logs-vm-2",
        "vm_id":  "e2234de2-bb1e-4459-934e-6185a9630c2a",
        "firmware_type":  null,
        "vm_notes":  "#CLUSTER-INVARIANT#:{bbba7c4a-bf48-458e-bd5f-4d924997eb9e}",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\Redundant2\\corp-logs-vm-2",
        "host_location_config":  "C:\\ClusterStorage\\Redundant2\\corp-logs-vm-2",
        "host_location_snapshot":  "C:\\ClusterStorage\\Redundant2\\corp-logs-vm-2",
        "host_location_smartpaging":  "C:\\ClusterStorage\\Redundant2\\corp-logs-vm-2",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  4,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  8,
                       "mem_dynamic":  true,
                       "mem_min_gb":  6,
                       "mem_max_gb":  8,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "UEFI",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "Save",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "ubuntu EFI SCSI Device EFI Network EFI SCSI Device EFI SCSI Device",
                             "pause_after_failure":  false,
                             "secure":  false,
                             "secure_template":  "OpenSourceShieldedVM",
                             "preferred_network_protocol":  "IPv4",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\Redundant2\\corp-logs-vm-2\\Virtual Hard Disks\\corp-logs-vm_disk_1_203F1A88-38E8-40B5-A966-AE9890379161.avhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Differencing",
                                                                  "drive_id":  "Differencing",
                                                                  "parent_path":  "C:\\ClusterStorage\\Redundant2\\corp-logs-vm-2\\Virtual Hard Disks\\corp-logs-vm_disk_1.vhdx",
                                                                  "file_size_gb":  20,
                                                                  "disk_size_gb":  80,
                                                                  "block_size_mb":  2
                                                              },
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\Redundant2\\corp-logs-vm-2\\Virtual Hard Disks\\corp-logs-vm_disk_2_5B827A61-778B-4269-96E6-56B61053D2FB.avhdx",
                                                                  "controller_location":  2,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Differencing",
                                                                  "drive_id":  "Differencing",
                                                                  "parent_path":  "C:\\ClusterStorage\\Redundant2\\corp-logs-vm-2\\Virtual Hard Disks\\corp-logs-vm_disk_2.vhdx",
                                                                  "file_size_gb":  5,
                                                                  "disk_size_gb":  200,
                                                                  "block_size_mb":  2
                                                              },
                                                              {
                                                                  "resource_pool":  "",
                                                                  "drive_type":  "DvdDrive",
                                                                  "path":  "",
                                                                  "controller_location":  4,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  null,
                                                                  "file_subtype":  null,
                                                                  "drive_id":  null,
                                                                  "parent_path":  null,
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  0,
                                                                  "block_size_mb":  0
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "corp-logs-vm",
                                     "adapter_id":  "Microsoft:E2234DE2-BB1E-4459-934E-6185A9630C2A\\4D658F8E-1E40-4450-9D02-0F14FA0E75F7",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D016614",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Access",
                                     "vlanid_untagged":  0
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-2",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "corp-pkica-vm-2",
        "vm_id":  "9b64abb8-59c1-49cd-8975-d2edef07f018",
        "firmware_type":  null,
        "vm_notes":  "Enterprise Subordinate Certificate Authority#CLUSTER-INVARIANT#:{83960748-d429-43f4-9f1c-ba2fb2ef3376}",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\Redundant2\\corp-pkica-vm-2",
        "host_location_config":  "C:\\ClusterStorage\\Redundant2\\corp-pkica-vm-2",
        "host_location_snapshot":  "C:\\ClusterStorage\\Redundant2\\corp-pkica-vm-2",
        "host_location_smartpaging":  "C:\\ClusterStorage\\Redundant2\\corp-pkica-vm-2",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  2,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  4,
                       "mem_dynamic":  true,
                       "mem_min_gb":  2,
                       "mem_max_gb":  4,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "UEFI",
                             "start_action":  "Nothing",
                             "start_delay":  10,
                             "stop_action":  "ShutDown",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "Windows Boot Manager EFI SCSI Device EFI Network",
                             "pause_after_failure":  false,
                             "secure":  true,
                             "secure_template":  "MicrosoftWindows",
                             "preferred_network_protocol":  "IPv4",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\Redundant2\\corp-pkica-vm-2\\Virtual Hard Disks\\corp-pkica-vm-1_disk_1.vhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  53,
                                                                  "disk_size_gb":  60,
                                                                  "block_size_mb":  2
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "corp-pkica-vm-1",
                                     "adapter_id":  "Microsoft:9B64ABB8-59C1-49CD-8975-D2EDEF07F018\\594BBFE3-AA91-4878-A454-E9DEEFCA9E92",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D016640",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Access",
                                     "vlanid_untagged":  0
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-2",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "corp-pkiw-vm-2",
        "vm_id":  "9e4ee202-dcb9-48cf-a407-396529838ab5",
        "firmware_type":  null,
        "vm_notes":  "Certificate Web Services, OCSP Responder#CLUSTER-INVARIANT#:{adf00830-1f70-4a0b-91d5-332544d09eef}",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\Redundant2\\corp-pkiw-vm-2",
        "host_location_config":  "C:\\ClusterStorage\\Redundant2\\corp-pkiw-vm-2",
        "host_location_snapshot":  "C:\\ClusterStorage\\Redundant2\\corp-pkiw-vm-2",
        "host_location_smartpaging":  "C:\\ClusterStorage\\Redundant2\\corp-pkiw-vm-2",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  2,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  4,
                       "mem_dynamic":  true,
                       "mem_min_gb":  2,
                       "mem_max_gb":  4,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "UEFI",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "Save",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "Windows Boot Manager EFI SCSI Device EFI Network EFI SCSI Device",
                             "pause_after_failure":  false,
                             "secure":  true,
                             "secure_template":  "MicrosoftWindows",
                             "preferred_network_protocol":  "IPv4",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "c:\\ClusterStorage\\Redundant2\\corp-pkiw-vm-2\\Virtual Hard Disks\\corp-pkiw-vm-2_disk_1.vhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  50,
                                                                  "disk_size_gb":  60,
                                                                  "block_size_mb":  2
                                                              },
                                                              {
                                                                  "resource_pool":  "",
                                                                  "drive_type":  "DvdDrive",
                                                                  "path":  "",
                                                                  "controller_location":  1,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  null,
                                                                  "file_subtype":  null,
                                                                  "drive_id":  null,
                                                                  "parent_path":  null,
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  0,
                                                                  "block_size_mb":  0
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "corp-pkiw-vm-2",
                                     "adapter_id":  "Microsoft:9E4EE202-DCB9-48CF-A407-396529838AB5\\890D7C59-68BE-484C-A79A-C6EE5C8405A1",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D016641",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Access",
                                     "vlanid_untagged":  0
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-2",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "corp-plj-bx-2",
        "vm_id":  "fb79e144-644f-4ffc-82f1-0c689607ca53",
        "firmware_type":  null,
        "vm_notes":  "",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "c:\\ClusterStorage\\NonRedundant\\corp-plj-bx-2\\corp-plj-bx-2",
        "host_location_config":  "c:\\ClusterStorage\\NonRedundant\\corp-plj-bx-2\\corp-plj-bx-2",
        "host_location_snapshot":  "c:\\ClusterStorage\\NonRedundant\\corp-plj-bx-2\\corp-plj-bx-2",
        "host_location_smartpaging":  "c:\\ClusterStorage\\NonRedundant\\corp-plj-bx-2\\corp-plj-bx-2",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  4,
                    "allow_virtualization":  true,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  8,
                       "mem_dynamic":  false,
                       "mem_min_gb":  0,
                       "mem_max_gb":  1024,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "UEFI",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "Save",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "Windows Boot Manager EFI Network EFI SCSI Device EFI Network",
                             "pause_after_failure":  false,
                             "secure":  true,
                             "secure_template":  "MicrosoftWindows",
                             "preferred_network_protocol":  "IPv4",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "c:\\ClusterStorage\\NonRedundant\\corp-plj-bx-2\\corp-plj-bx-2-os.vhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  76,
                                                                  "disk_size_gb":  120,
                                                                  "block_size_mb":  32
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "Network Adapter",
                                     "adapter_id":  "Microsoft:FB79E144-644F-4FFC-82F1-0C689607CA53\\E50F3A8C-B400-4275-B1E4-49A37262FD33",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D016673",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  true,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Access",
                                     "vlanid_untagged":  23
                                 },
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "Network Adapter",
                                     "adapter_id":  "Microsoft:FB79E144-644F-4FFC-82F1-0C689607CA53\\884BB962-6D73-4894-B9CB-91D8F16E18A2",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D016674",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  true,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Access",
                                     "vlanid_untagged":  17
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-2",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "corp-rauth-vm-2.bwirauth.com",
        "vm_id":  "705f564d-0579-4a4b-b2fb-dfa5b977afba",
        "firmware_type":  null,
        "vm_notes":  "Domain Controller/RADIUS server for BWIRAUTH#CLUSTER-INVARIANT#:{6de1ca30-03c4-412a-8e9b-fc9485094577}",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\Redundant2\\corp-rauth-vm-2.bwirauth.com",
        "host_location_config":  "C:\\ClusterStorage\\Redundant2\\corp-rauth-vm-2.bwirauth.com",
        "host_location_snapshot":  "C:\\ClusterStorage\\Redundant2\\corp-rauth-vm-2.bwirauth.com",
        "host_location_smartpaging":  "C:\\ClusterStorage\\Redundant2\\corp-rauth-vm-2.bwirauth.com",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  2,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  4,
                       "mem_dynamic":  true,
                       "mem_min_gb":  4,
                       "mem_max_gb":  6,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "UEFI",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "ShutDown",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "Windows Boot Manager EFI SCSI Device EFI SCSI Device EFI Network EFI SCSI Device EFI Network",
                             "pause_after_failure":  false,
                             "secure":  true,
                             "secure_template":  "MicrosoftWindows",
                             "preferred_network_protocol":  "IPv4",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\Redundant2\\corp-rauth-vm-2.bwirauth.com\\Virtual Hard Disks\\corp-rauth-vm-2.bwirauth.com_os.vhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  67,
                                                                  "disk_size_gb":  127,
                                                                  "block_size_mb":  32
                                                              },
                                                              {
                                                                  "resource_pool":  "",
                                                                  "drive_type":  "DvdDrive",
                                                                  "path":  "",
                                                                  "controller_location":  1,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  null,
                                                                  "file_subtype":  null,
                                                                  "drive_id":  null,
                                                                  "parent_path":  null,
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  0,
                                                                  "block_size_mb":  0
                                                              },
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "c:\\ClusterStorage\\Redundant2\\corp-rauth-vm-2.bwirauth.com\\Virtual Hard Disks\\corp-rauth-vm-2.bwirauth.com_disk_1.vhdx",
                                                                  "controller_location":  2,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  2,
                                                                  "disk_size_gb":  60,
                                                                  "block_size_mb":  2
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "corp-rauth-vm-2_OldNetwork",
                                     "adapter_id":  "Microsoft:705F564D-0579-4A4B-B2FB-DFA5B977AFBA\\C10AC6AF-30B3-4D92-AC55-F21FA8AF00BD",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D016642",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Access",
                                     "vlanid_untagged":  0
                                 },
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "corp-rauth-vm-2_ManagementNetwork",
                                     "adapter_id":  "Microsoft:705F564D-0579-4A4B-B2FB-DFA5B977AFBA\\CE21FA8B-8A56-4983-AAEF-5A248C7C9D3E",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D016643",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Access",
                                     "vlanid_untagged":  17
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-2",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "corp-scangun2",
        "vm_id":  "c5d32520-5ca7-4de8-a1de-a95eda0155f1",
        "firmware_type":  null,
        "vm_notes":  "",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "c:\\ClusterStorage\\Redundant2\\corp-scangun2",
        "host_location_config":  "c:\\ClusterStorage\\Redundant2\\corp-scangun2",
        "host_location_snapshot":  "c:\\ClusterStorage\\Redundant2\\corp-scangun2",
        "host_location_smartpaging":  "c:\\ClusterStorage\\Redundant2\\corp-scangun2",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  1,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  4,
                       "mem_dynamic":  false,
                       "mem_min_gb":  0,
                       "mem_max_gb":  1024,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "UEFI",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "Save",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "Windows Boot Manager EFI SCSI Device EFI Network EFI SCSI Device",
                             "pause_after_failure":  false,
                             "secure":  true,
                             "secure_template":  "MicrosoftWindows",
                             "preferred_network_protocol":  "IPv4",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "c:\\ClusterStorage\\Redundant2\\corp-scangun2\\Virtual Hard Disks\\corp-scangun2.vhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  61,
                                                                  "disk_size_gb":  127,
                                                                  "block_size_mb":  32
                                                              },
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "DvdDrive",
                                                                  "path":  "c:\\ClusterStorage\\SupportFiles\\SW_DVD9_Win_Server_STD_CORE_2022_2108.27_64Bit_English_DC_STD_MLF_X23-64869.ISO",
                                                                  "controller_location":  1,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  null,
                                                                  "file_subtype":  null,
                                                                  "drive_id":  null,
                                                                  "parent_path":  null,
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  0,
                                                                  "block_size_mb":  0
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "Network Adapter",
                                     "adapter_id":  "Microsoft:C5D32520-5CA7-4DE8-A1DE-A95EDA0155F1\\B1B1A4CD-FCC4-4F40-9608-8483D5F5CE13",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D016675",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Access",
                                     "vlanid_untagged":  39
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-2",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "corp-vertexdb-2",
        "vm_id":  "9876f5a1-5992-4803-9bd1-41e8e10db827",
        "firmware_type":  null,
        "vm_notes":  "",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\Redundant2\\corp-vertexdb-2",
        "host_location_config":  "C:\\ClusterStorage\\Redundant2\\corp-vertexdb-2",
        "host_location_snapshot":  "C:\\ClusterStorage\\Redundant2\\corp-vertexdb-2",
        "host_location_smartpaging":  "C:\\ClusterStorage\\Redundant2\\corp-vertexdb-2",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  8,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  16,
                       "mem_dynamic":  false,
                       "mem_min_gb":  0,
                       "mem_max_gb":  1024,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "UEFI",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "Save",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "ubuntu EFI SCSI Device EFI Network EFI SCSI Device",
                             "pause_after_failure":  false,
                             "secure":  true,
                             "secure_template":  "MicrosoftUEFICertificateAuthority",
                             "preferred_network_protocol":  "IPv4",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\Redundant2\\corp-vertexdb-2\\Virtual Hard Disks\\corp-vertexdb-2-os_878D5DC7-00B9-4FA0-BA60-E554CCEA45E2.avhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Differencing",
                                                                  "drive_id":  "Differencing",
                                                                  "parent_path":  "C:\\ClusterStorage\\Redundant2\\corp-vertexdb-2\\Virtual Hard Disks\\corp-vertexdb-2-os_A410EC54-2831-4D19-9C58-E422D571B801.avhdx",
                                                                  "file_size_gb":  8,
                                                                  "disk_size_gb":  50,
                                                                  "block_size_mb":  2
                                                              },
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\Redundant2\\corp-vertexdb-2\\Virtual Hard Disks\\corp-vertexdb-2-config_3650F852-1D1B-4552-A1A2-048923A87AB7.avhdx",
                                                                  "controller_location":  1,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Differencing",
                                                                  "drive_id":  "Differencing",
                                                                  "parent_path":  "C:\\ClusterStorage\\Redundant2\\corp-vertexdb-2\\Virtual Hard Disks\\corp-vertexdb-2-config_69BAFBCB-FF6D-4714-BCFB-3AB99C110D8B.avhdx",
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  1,
                                                                  "block_size_mb":  2
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "corp-vertexdb-2 - DMZ",
                                     "adapter_id":  "Microsoft:9876F5A1-5992-4803-9BD1-41E8E10DB827\\177A25CD-5A98-44D1-8001-BB7FC0F59903",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D016665",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  false,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Access",
                                     "vlanid_untagged":  39
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-2",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "corp-vertexwa-2",
        "vm_id":  "39b67c56-5040-4cc4-8f80-e640d1799b27",
        "firmware_type":  null,
        "vm_notes":  "",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\Redundant2\\corp-vertexwa-2",
        "host_location_config":  "C:\\ClusterStorage\\Redundant2\\corp-vertexwa-2",
        "host_location_snapshot":  "C:\\ClusterStorage\\Redundant2\\corp-vertexwa-2",
        "host_location_smartpaging":  "C:\\ClusterStorage\\Redundant2\\corp-vertexwa-2",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  8,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  16,
                       "mem_dynamic":  false,
                       "mem_min_gb":  0,
                       "mem_max_gb":  1024,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "UEFI",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "Save",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "ubuntu EFI SCSI Device EFI Network EFI SCSI Device",
                             "pause_after_failure":  false,
                             "secure":  true,
                             "secure_template":  "MicrosoftUEFICertificateAuthority",
                             "preferred_network_protocol":  "IPv4",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\Redundant2\\corp-vertexwa-2\\Virtual Hard Disks\\corp-vertexwa-2-os_98EF4D34-A71E-49D9-89B3-9E12E2E2A53A.avhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Differencing",
                                                                  "drive_id":  "Differencing",
                                                                  "parent_path":  "C:\\ClusterStorage\\Redundant2\\corp-vertexwa-2\\Virtual Hard Disks\\corp-vertexwa-2-os.vhdx",
                                                                  "file_size_gb":  12,
                                                                  "disk_size_gb":  50,
                                                                  "block_size_mb":  2
                                                              },
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\Redundant2\\corp-vertexwa-2\\Virtual Hard Disks\\corp-vertexwa-2-config_F1FD3987-C2D3-4AD1-91E9-971C14720232.avhdx",
                                                                  "controller_location":  1,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Differencing",
                                                                  "drive_id":  "Differencing",
                                                                  "parent_path":  "C:\\ClusterStorage\\Redundant2\\corp-vertexwa-2\\Virtual Hard Disks\\corp-vertexwa-2-config.vhdx",
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  1,
                                                                  "block_size_mb":  2
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "corp-vertexwa-2 - DMZ",
                                     "adapter_id":  "Microsoft:39B67C56-5040-4CC4-8F80-E640D1799B27\\C9633C2A-EC14-4083-924C-39B72566F21E",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D016664",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  false,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Access",
                                     "vlanid_untagged":  39
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-2",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "corp-web-vm-2",
        "vm_id":  "a7e2ceed-61e6-4654-984b-7ff6c575bf55",
        "firmware_type":  null,
        "vm_notes":  "#CLUSTER-INVARIANT#:{43bc547b-9ed7-43b2-b9c7-a144682db77e}",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-web-vm-2",
        "host_location_config":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-web-vm-2",
        "host_location_snapshot":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-web-vm-2",
        "host_location_smartpaging":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-web-vm-2",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  4,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  200,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  16,
                       "mem_dynamic":  false,
                       "mem_min_gb":  0,
                       "mem_max_gb":  1024,
                       "mem_buffer_pct":  20,
                       "mem_priority":  100,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "UEFI",
                             "start_action":  "Nothing",
                             "start_delay":  15,
                             "stop_action":  "ShutDown",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "ubuntu EFI SCSI Device EFI SCSI Device EFI Network",
                             "pause_after_failure":  false,
                             "secure":  false,
                             "secure_template":  "MicrosoftWindows",
                             "preferred_network_protocol":  "IPv4",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-web-vm-2\\Virtual Hard Disks\\corp-web-vm-2_disk_1.vhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  59,
                                                                  "disk_size_gb":  120,
                                                                  "block_size_mb":  2
                                                              },
                                                              {
                                                                  "resource_pool":  "",
                                                                  "drive_type":  "DvdDrive",
                                                                  "path":  "",
                                                                  "controller_location":  1,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  null,
                                                                  "file_subtype":  null,
                                                                  "drive_id":  null,
                                                                  "parent_path":  null,
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  0,
                                                                  "block_size_mb":  0
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "corp-web-vm-2",
                                     "adapter_id":  "Microsoft:A7E2CEED-61E6-4654-984B-7FF6C575BF55\\CCE5EE90-C7B8-443F-9BB9-519F9A073C0D",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D016629",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  true,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Access",
                                     "vlanid_untagged":  0
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-2",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "DC2",
        "vm_id":  "0a6ba792-e66c-477d-869a-067af359af1f",
        "firmware_type":  null,
        "vm_notes":  "#CLUSTER-INVARIANT#:{a4a953fb-c400-4763-973f-47ce5b35c71f}",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\Redundant2\\DC2",
        "host_location_config":  "C:\\ClusterStorage\\Redundant2\\DC2",
        "host_location_snapshot":  "C:\\ClusterStorage\\Redundant2\\DC2",
        "host_location_smartpaging":  "C:\\ClusterStorage\\Redundant2\\DC2",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  4,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  8,
                       "mem_dynamic":  true,
                       "mem_min_gb":  4,
                       "mem_max_gb":  8,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "UEFI",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "ShutDown",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "Windows Boot Manager EFI SCSI Device EFI SCSI Device EFI Network EFI Network",
                             "pause_after_failure":  false,
                             "secure":  true,
                             "secure_template":  "MicrosoftWindows",
                             "preferred_network_protocol":  "IPv4",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\Redundant2\\DC2\\Virtual Hard Disks\\DC2.vhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  110,
                                                                  "disk_size_gb":  120,
                                                                  "block_size_mb":  32
                                                              },
                                                              {
                                                                  "resource_pool":  "",
                                                                  "drive_type":  "DvdDrive",
                                                                  "path":  "",
                                                                  "controller_location":  1,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  null,
                                                                  "file_subtype":  null,
                                                                  "drive_id":  null,
                                                                  "parent_path":  null,
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  0,
                                                                  "block_size_mb":  0
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "Network Adapter",
                                     "adapter_id":  "Microsoft:0A6BA792-E66C-477D-869A-067AF359AF1F\\BA31E9A3-FC2C-4E86-804D-22209990552A",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D01660E",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Access",
                                     "vlanid_untagged":  39
                                 },
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "Network Adapter",
                                     "adapter_id":  "Microsoft:0A6BA792-E66C-477D-869A-067AF359AF1F\\0DF9D610-A249-46DF-B739-C4D7CEFB920E",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D01660F",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Untagged",
                                     "vlanid_untagged":  0
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-2",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "dev-webpl-2",
        "vm_id":  "bdace920-616d-4c65-816d-844b02d8fd97",
        "firmware_type":  null,
        "vm_notes":  "",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\NonRedundant\\dev-webpl-2",
        "host_location_config":  "C:\\ClusterStorage\\NonRedundant\\dev-webpl-2",
        "host_location_snapshot":  "C:\\ClusterStorage\\NonRedundant\\dev-webpl-2",
        "host_location_smartpaging":  "C:\\ClusterStorage\\NonRedundant\\dev-webpl-2",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  8,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  4,
                       "mem_dynamic":  false,
                       "mem_min_gb":  0,
                       "mem_max_gb":  1024,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "UEFI",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "Save",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "ubuntu EFI SCSI Device EFI Network EFI SCSI Device",
                             "pause_after_failure":  false,
                             "secure":  true,
                             "secure_template":  "MicrosoftUEFICertificateAuthority",
                             "preferred_network_protocol":  "IPv4",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\NonRedundant\\dev-webpl-2\\Virtual Hard Disks\\dev-webpl-2-os.vhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  25,
                                                                  "disk_size_gb":  75,
                                                                  "block_size_mb":  16
                                                              },
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\NonRedundant\\dev-webpl-2\\Virtual Hard Disks\\dev-webpl-2-config.vhdx",
                                                                  "controller_location":  1,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  1,
                                                                  "block_size_mb":  32
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "dev-webpl-2 - DMZ",
                                     "adapter_id":  "Microsoft:BDACE920-616D-4C65-816D-844B02D8FD97\\C3EA4515-9F7B-4815-BB4E-4FEFDF5973C4",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D016668",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  false,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Access",
                                     "vlanid_untagged":  153
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-3",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "BWI_SQL",
        "vm_id":  "47cb731f-3b01-4093-a6bf-26e74440022b",
        "firmware_type":  null,
        "vm_notes":  "#CLUSTER-INVARIANT#:{7a2338fc-7b10-4839-9d3c-922d1a01545f}",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\CriticalNonRedundant\\BWI_SQL",
        "host_location_config":  "C:\\ClusterStorage\\CriticalNonRedundant\\BWI_SQL",
        "host_location_snapshot":  "C:\\ClusterStorage\\CriticalNonRedundant\\BWI_SQL",
        "host_location_smartpaging":  "C:\\ClusterStorage\\CriticalNonRedundant\\BWI_SQL",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  4,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  17,
                       "mem_dynamic":  false,
                       "mem_min_gb":  17,
                       "mem_max_gb":  48,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "BIOS",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "Save",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "CD IDE LegacyNetworkAdapter Floppy",
                             "pause_after_failure":  false,
                             "secure":  false,
                             "secure_template":  "None",
                             "preferred_network_protocol":  "N/A",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "c:\\ClusterStorage\\CriticalNonRedundant\\BWI_SQL\\Virtual Hard Disks\\bwi_sql_4(1).vhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  116,
                                                                  "disk_size_gb":  120,
                                                                  "block_size_mb":  32
                                                              }
                                                          ],
                                                "ControllerType":  "VMIdeController",
                                                "ControllerNumber":  0
                                            },
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "",
                                                                  "drive_type":  "DvdDrive",
                                                                  "path":  "",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  null,
                                                                  "file_subtype":  null,
                                                                  "drive_id":  null,
                                                                  "parent_path":  null,
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  0,
                                                                  "block_size_mb":  0
                                                              }
                                                          ],
                                                "ControllerType":  "VMIdeController",
                                                "ControllerNumber":  1
                                            },
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "c:\\ClusterStorage\\CriticalNonRedundant\\BWI_SQL\\Virtual Hard Disks\\bwi_sql.vhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  186,
                                                                  "disk_size_gb":  350,
                                                                  "block_size_mb":  32
                                                              },
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "c:\\ClusterStorage\\CriticalNonRedundant\\BWI_SQL\\Virtual Hard Disks\\BWI_SQL_2.vhdx",
                                                                  "controller_location":  1,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  106,
                                                                  "disk_size_gb":  150,
                                                                  "block_size_mb":  32
                                                              },
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "c:\\ClusterStorage\\CriticalNonRedundant\\BWI_SQL\\Virtual Hard Disks\\BWI_SQL_6.vhdx",
                                                                  "controller_location":  4,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  269,
                                                                  "disk_size_gb":  350,
                                                                  "block_size_mb":  32
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "BWI_SQL-OldNetwork",
                                     "adapter_id":  "Microsoft:47CB731F-3B01-4093-A6BF-26E74440022B\\27F243F5-C4EA-4C94-883E-851BF360E90F",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  false,
                                     "mac_address":  "0050569838A9",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Untagged",
                                     "vlanid_untagged":  0
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-3",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "corp-bigfix-vm",
        "vm_id":  "a2ca1289-3aaa-4ed0-8023-b31e59d0eab0",
        "firmware_type":  null,
        "vm_notes":  "#CLUSTER-INVARIANT#:{8b0cb74c-5f60-4bfd-9dc8-38af6ad487e9}",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-bigfix-vm",
        "host_location_config":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-bigfix-vm",
        "host_location_snapshot":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-bigfix-vm",
        "host_location_smartpaging":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-bigfix-vm",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  6,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  12,
                       "mem_dynamic":  true,
                       "mem_min_gb":  4,
                       "mem_max_gb":  12,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "UEFI",
                             "start_action":  "Nothing",
                             "start_delay":  10,
                             "stop_action":  "ShutDown",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "EFI SCSI Device Windows Boot Manager EFI SCSI Device EFI Network EFI SCSI Device",
                             "pause_after_failure":  false,
                             "secure":  false,
                             "secure_template":  "MicrosoftWindows",
                             "preferred_network_protocol":  "IPv4",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-bigfix-vm\\Virtual Hard Disks\\_template_winsvr_2022_disk_1.vhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  60,
                                                                  "disk_size_gb":  120,
                                                                  "block_size_mb":  2
                                                              },
                                                              {
                                                                  "resource_pool":  "",
                                                                  "drive_type":  "DvdDrive",
                                                                  "path":  "",
                                                                  "controller_location":  1,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  null,
                                                                  "file_subtype":  null,
                                                                  "drive_id":  null,
                                                                  "parent_path":  null,
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  0,
                                                                  "block_size_mb":  0
                                                              },
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-bigfix-vm\\Virtual Hard Disks\\corp-bigfix-vm_disk_1.vhdx",
                                                                  "controller_location":  2,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  176,
                                                                  "disk_size_gb":  250,
                                                                  "block_size_mb":  2
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "corp-bigfix-vm",
                                     "adapter_id":  "Microsoft:A2CA1289-3AAA-4ED0-8023-B31E59D0EAB0\\63CA29EB-0A20-4DA7-B818-A973D9534BD1",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D016672",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Access",
                                     "vlanid_untagged":  0
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-3",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "corp-cloudgw1",
        "vm_id":  "7127bd10-819a-4b1d-823d-d4551600ac43",
        "firmware_type":  null,
        "vm_notes":  "",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "c:\\ClusterStorage\\Redundant1\\corp-cloudgw1",
        "host_location_config":  "c:\\ClusterStorage\\Redundant1\\corp-cloudgw1",
        "host_location_snapshot":  "c:\\ClusterStorage\\Redundant1\\corp-cloudgw1",
        "host_location_smartpaging":  "c:\\ClusterStorage\\Redundant1\\corp-cloudgw1",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  6,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  4,
                       "mem_dynamic":  false,
                       "mem_min_gb":  0,
                       "mem_max_gb":  1024,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "UEFI",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "Save",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "Windows Boot Manager EFI SCSI Device EFI Network EFI SCSI Device",
                             "pause_after_failure":  false,
                             "secure":  true,
                             "secure_template":  "MicrosoftWindows",
                             "preferred_network_protocol":  "IPv4",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "c:\\ClusterStorage\\Redundant1\\corp-cloudgw1\\Virtual Hard Disks\\corp-cloudgw1.vhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  53,
                                                                  "disk_size_gb":  127,
                                                                  "block_size_mb":  32
                                                              },
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "DvdDrive",
                                                                  "path":  "C:\\ClusterStorage\\SupportFiles\\isos\\sw_dvd9_win_server_std_core_2022_2108.23_64bit_english_dc_std_mlf_x23-50413.iso",
                                                                  "controller_location":  1,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  null,
                                                                  "file_subtype":  null,
                                                                  "drive_id":  null,
                                                                  "parent_path":  null,
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  0,
                                                                  "block_size_mb":  0
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "Network Adapter",
                                     "adapter_id":  "Microsoft:7127BD10-819A-4B1D-823D-D4551600AC43\\29FE194D-0A95-4F12-8912-91153A098924",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D01673B",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Access",
                                     "vlanid_untagged":  39
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-3",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "corp-drops-vm",
        "vm_id":  "b25b6610-caa3-4d40-8924-0ecd91b93397",
        "firmware_type":  null,
        "vm_notes":  "ARCad Drops Server used by Dev Team#CLUSTER-INVARIANT#:{c13131ab-c294-4a64-9ea5-fc789aec9cbb}",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\NonRedundant\\corp-drops-vm",
        "host_location_config":  "C:\\ClusterStorage\\NonRedundant\\corp-drops-vm",
        "host_location_snapshot":  "C:\\ClusterStorage\\NonRedundant\\corp-drops-vm",
        "host_location_smartpaging":  "C:\\ClusterStorage\\NonRedundant\\corp-drops-vm",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  4,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  8,
                       "mem_dynamic":  false,
                       "mem_min_gb":  8,
                       "mem_max_gb":  8,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "BIOS",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "Save",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "CD IDE LegacyNetworkAdapter Floppy",
                             "pause_after_failure":  false,
                             "secure":  false,
                             "secure_template":  "None",
                             "preferred_network_protocol":  "N/A",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "c:\\ClusterStorage\\NonRedundant\\corp-drops-vm\\Virtual Hard Disks\\DROPS.vhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  115,
                                                                  "disk_size_gb":  250,
                                                                  "block_size_mb":  32
                                                              }
                                                          ],
                                                "ControllerType":  "VMIdeController",
                                                "ControllerNumber":  0
                                            },
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "",
                                                                  "drive_type":  "DvdDrive",
                                                                  "path":  "",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  null,
                                                                  "file_subtype":  null,
                                                                  "drive_id":  null,
                                                                  "parent_path":  null,
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  0,
                                                                  "block_size_mb":  0
                                                              }
                                                          ],
                                                "ControllerType":  "VMIdeController",
                                                "ControllerNumber":  1
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "Network Adapter",
                                     "adapter_id":  "Microsoft:B25B6610-CAA3-4D40-8924-0ECD91B93397\\85E79405-0DDF-405D-ADCA-2ECD8D6462E5",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  false,
                                     "mac_address":  "000C29864F66",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Untagged",
                                     "vlanid_untagged":  0
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-3",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "corp-livenx-vm",
        "vm_id":  "54655f44-77c7-42b2-9749-db7d6880220c",
        "firmware_type":  null,
        "vm_notes":  "VM hosting LiveAction LiveNX#CLUSTER-INVARIANT#:{1d7fe195-f502-4af2-931f-bc60dbd44980}",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\NonRedundant\\corp-livenx-vm",
        "host_location_config":  "C:\\ClusterStorage\\NonRedundant\\corp-livenx-vm",
        "host_location_snapshot":  "C:\\ClusterStorage\\NonRedundant\\corp-livenx-vm",
        "host_location_smartpaging":  "C:\\ClusterStorage\\NonRedundant\\corp-livenx-vm",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  8,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  16,
                       "mem_dynamic":  true,
                       "mem_min_gb":  12,
                       "mem_max_gb":  16,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "BIOS",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "Save",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "CD IDE LegacyNetworkAdapter Floppy",
                             "pause_after_failure":  false,
                             "secure":  false,
                             "secure_template":  "None",
                             "preferred_network_protocol":  "N/A",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\NonRedundant\\corp-livenx-vm\\Virtual Hard Disks\\livenx-os.vhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  15,
                                                                  "disk_size_gb":  20,
                                                                  "block_size_mb":  32
                                                              },
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\NonRedundant\\corp-livenx-vm\\Virtual Hard Disks\\corp-livenx-vm_disk_1.vhdx",
                                                                  "controller_location":  1,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  492,
                                                                  "disk_size_gb":  1000,
                                                                  "block_size_mb":  2
                                                              }
                                                          ],
                                                "ControllerType":  "VMIdeController",
                                                "ControllerNumber":  0
                                            },
                                            {
                                                "Disks":  [

                                                          ],
                                                "ControllerType":  "VMIdeController",
                                                "ControllerNumber":  1
                                            },
                                            {
                                                "Disks":  [

                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "corp-livenx-vm",
                                     "adapter_id":  "Microsoft:54655F44-77C7-42B2-9749-DB7D6880220C\\1B93949F-4EA0-4E99-A5E3-9CE6A59F3BF8",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D016713",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Access",
                                     "vlanid_untagged":  0
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-3",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "corp-netbox-vm",
        "vm_id":  "6a291040-76f2-4485-9763-1953f1d1b04b",
        "firmware_type":  null,
        "vm_notes":  "#CLUSTER-INVARIANT#:{2cae198a-6f58-495e-bd9e-5da2b92be63b}",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\NonRedundant\\corp-netbox-vm",
        "host_location_config":  "C:\\ClusterStorage\\NonRedundant\\corp-netbox-vm",
        "host_location_snapshot":  "C:\\ClusterStorage\\NonRedundant\\corp-netbox-vm",
        "host_location_smartpaging":  "C:\\ClusterStorage\\NonRedundant\\corp-netbox-vm",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  2,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  8,
                       "mem_dynamic":  false,
                       "mem_min_gb":  8,
                       "mem_max_gb":  1024,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "UEFI",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "ShutDown",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "ubuntu EFI SCSI Device EFI SCSI Device EFI Network",
                             "pause_after_failure":  false,
                             "secure":  false,
                             "secure_template":  "MicrosoftWindows",
                             "preferred_network_protocol":  "IPv4",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\NonRedundant\\corp-netbox-vm\\Virtual Hard Disks\\corp-netbox-vm_disk_1.vhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  20,
                                                                  "disk_size_gb":  120,
                                                                  "block_size_mb":  2
                                                              },
                                                              {
                                                                  "resource_pool":  "",
                                                                  "drive_type":  "DvdDrive",
                                                                  "path":  "",
                                                                  "controller_location":  1,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  null,
                                                                  "file_subtype":  null,
                                                                  "drive_id":  null,
                                                                  "parent_path":  null,
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  0,
                                                                  "block_size_mb":  0
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "corp-netbox-vm",
                                     "adapter_id":  "Microsoft:6A291040-76F2-4485-9763-1953F1D1B04B\\75DC23D2-EEBB-4F18-99D5-4DF50FD32EF0",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D016714",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Untagged",
                                     "vlanid_untagged":  0
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-3",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "corp-netmanage",
        "vm_id":  "a18fb6ba-9494-407a-a921-8a123a4e077e",
        "firmware_type":  null,
        "vm_notes":  "",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "c:\\ClusterStorage\\NonRedundant\\corp-netmanage",
        "host_location_config":  "c:\\ClusterStorage\\NonRedundant\\corp-netmanage",
        "host_location_snapshot":  "c:\\ClusterStorage\\NonRedundant\\corp-netmanage",
        "host_location_smartpaging":  "c:\\ClusterStorage\\NonRedundant\\corp-netmanage",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  4,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  16,
                       "mem_dynamic":  false,
                       "mem_min_gb":  0,
                       "mem_max_gb":  1024,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "UEFI",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "Save",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "Ubuntu EFI SCSI Device debian EFI Network EFI SCSI Device",
                             "pause_after_failure":  false,
                             "secure":  true,
                             "secure_template":  "MicrosoftUEFICertificateAuthority",
                             "preferred_network_protocol":  "IPv4",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "c:\\ClusterStorage\\NonRedundant\\corp-netmanage\\Virtual Hard Disks\\corp-netmanage.vhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  28,
                                                                  "disk_size_gb":  256,
                                                                  "block_size_mb":  32
                                                              },
                                                              {
                                                                  "resource_pool":  "",
                                                                  "drive_type":  "DvdDrive",
                                                                  "path":  "",
                                                                  "controller_location":  1,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  null,
                                                                  "file_subtype":  null,
                                                                  "drive_id":  null,
                                                                  "parent_path":  null,
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  0,
                                                                  "block_size_mb":  0
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "Network Adapter",
                                     "adapter_id":  "Microsoft:A18FB6BA-9494-407A-A921-8A123A4E077E\\435B8146-7322-4E32-A058-92DFA77232D8",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D01673C",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  true,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Access",
                                     "vlanid_untagged":  17
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-3",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "corp-redis-vm-4",
        "vm_id":  "e52818e4-1a9a-4449-9f4c-0f95ff494845",
        "firmware_type":  null,
        "vm_notes":  "#CLUSTER-INVARIANT#:{da12ee9e-3df0-48d4-88b4-a5b772fa59bf}",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-redis-vm-4",
        "host_location_config":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-redis-vm-4",
        "host_location_snapshot":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-redis-vm-4",
        "host_location_smartpaging":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-redis-vm-4",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  2,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  6,
                       "mem_dynamic":  true,
                       "mem_min_gb":  4,
                       "mem_max_gb":  8,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "UEFI",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "Save",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "ubuntu EFI SCSI Device EFI SCSI Device EFI Network",
                             "pause_after_failure":  false,
                             "secure":  false,
                             "secure_template":  "MicrosoftWindows",
                             "preferred_network_protocol":  "IPv4",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-redis-vm-4\\Virtual Hard Disks\\corp-redis-vm-4_disk_1.vhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  29,
                                                                  "disk_size_gb":  60,
                                                                  "block_size_mb":  2
                                                              },
                                                              {
                                                                  "resource_pool":  "",
                                                                  "drive_type":  "DvdDrive",
                                                                  "path":  "",
                                                                  "controller_location":  1,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  null,
                                                                  "file_subtype":  null,
                                                                  "drive_id":  null,
                                                                  "parent_path":  null,
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  0,
                                                                  "block_size_mb":  0
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "corp-redis-vm-4",
                                     "adapter_id":  "Microsoft:E52818E4-1A9A-4449-9F4C-0F95FF494845\\61E7291A-E81F-48F4-90FF-592BAC455FD4",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D01660B",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Access",
                                     "vlanid_untagged":  0
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-3",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "corp-vertex-vm",
        "vm_id":  "43d34759-3fb2-45ca-b1be-63f5295cf9d5",
        "firmware_type":  null,
        "vm_notes":  "#CLUSTER-INVARIANT#:{09f4c1be-34a4-41c1-a29f-79bfe8a59935}",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-vertex-vm",
        "host_location_config":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-vertex-vm",
        "host_location_snapshot":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-vertex-vm",
        "host_location_smartpaging":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-vertex-vm",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  1,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  16,
                       "mem_dynamic":  false,
                       "mem_min_gb":  16,
                       "mem_max_gb":  1024,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "BIOS",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "ShutDown",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "CD IDE LegacyNetworkAdapter Floppy",
                             "pause_after_failure":  false,
                             "secure":  false,
                             "secure_template":  "None",
                             "preferred_network_protocol":  "N/A",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\CriticalNonRedundant\\corp-vertex-vm\\Virtual Hard Disks\\VERTEX9.vhd",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHD",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  222,
                                                                  "disk_size_gb":  250,
                                                                  "block_size_mb":  2
                                                              }
                                                          ],
                                                "ControllerType":  "VMIdeController",
                                                "ControllerNumber":  0
                                            },
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "",
                                                                  "drive_type":  "DvdDrive",
                                                                  "path":  "",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  null,
                                                                  "file_subtype":  null,
                                                                  "drive_id":  null,
                                                                  "parent_path":  null,
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  0,
                                                                  "block_size_mb":  0
                                                              }
                                                          ],
                                                "ControllerType":  "VMIdeController",
                                                "ControllerNumber":  1
                                            },
                                            {
                                                "Disks":  [

                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "VERTEX9",
                                     "adapter_id":  "Microsoft:43D34759-3FB2-45CA-B1BE-63F5295CF9D5\\1307E4A9-9589-4A0C-A2DB-F1D20C089B69",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  false,
                                     "mac_address":  "00155D01214D",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Untagged",
                                     "vlanid_untagged":  0
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-3",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "CPROXY",
        "vm_id":  "9a61cc86-de44-49d0-a4f4-ee67bc86eb9f",
        "firmware_type":  null,
        "vm_notes":  "#CLUSTER-INVARIANT#:{9e351607-36a5-43a0-a89f-97fbfe774428}",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\CriticalNonRedundant\\CPROXY",
        "host_location_config":  "C:\\ClusterStorage\\CriticalNonRedundant\\CPROXY",
        "host_location_snapshot":  "C:\\ClusterStorage\\CriticalNonRedundant\\CPROXY",
        "host_location_smartpaging":  "C:\\ClusterStorage\\CriticalNonRedundant\\CPROXY",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  1,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  4,
                       "mem_dynamic":  false,
                       "mem_min_gb":  4,
                       "mem_max_gb":  4,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "BIOS",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "Save",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "CD IDE LegacyNetworkAdapter Floppy",
                             "pause_after_failure":  false,
                             "secure":  false,
                             "secure_template":  "None",
                             "preferred_network_protocol":  "N/A",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\CriticalNonRedundant\\CPROXY\\Virtual Hard Disks\\CPROXY.vhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  80,
                                                                  "disk_size_gb":  80,
                                                                  "block_size_mb":  32
                                                              }
                                                          ],
                                                "ControllerType":  "VMIdeController",
                                                "ControllerNumber":  0
                                            },
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "",
                                                                  "drive_type":  "DvdDrive",
                                                                  "path":  "",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  null,
                                                                  "file_subtype":  null,
                                                                  "drive_id":  null,
                                                                  "parent_path":  null,
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  0,
                                                                  "block_size_mb":  0
                                                              }
                                                          ],
                                                "ControllerType":  "VMIdeController",
                                                "ControllerNumber":  1
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "Network Adapter",
                                     "adapter_id":  "Microsoft:9A61CC86-DE44-49D0-A4F4-EE67BC86EB9F\\A5F11E34-FA44-4196-8CBE-DA78373F34A6",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  false,
                                     "mac_address":  "005056982139",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Untagged",
                                     "vlanid_untagged":  0
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-3",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "FAX",
        "vm_id":  "45e74d7f-eb5d-48a8-b888-424a88a8d13b",
        "firmware_type":  null,
        "vm_notes":  "#CLUSTER-INVARIANT#:{b5909689-5656-4dce-918e-2e321d42fea1}",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\CriticalNonRedundant\\FAX",
        "host_location_config":  "C:\\ClusterStorage\\CriticalNonRedundant\\FAX",
        "host_location_snapshot":  "C:\\ClusterStorage\\CriticalNonRedundant\\FAX",
        "host_location_smartpaging":  "C:\\ClusterStorage\\CriticalNonRedundant\\FAX",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  1,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  4,
                       "mem_dynamic":  false,
                       "mem_min_gb":  4,
                       "mem_max_gb":  4,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "BIOS",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "Save",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "CD IDE LegacyNetworkAdapter Floppy",
                             "pause_after_failure":  false,
                             "secure":  false,
                             "secure_template":  "None",
                             "preferred_network_protocol":  "N/A",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\CriticalNonRedundant\\FAX\\Virtual Hard Disks\\FAX.vhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  104,
                                                                  "disk_size_gb":  120,
                                                                  "block_size_mb":  32
                                                              }
                                                          ],
                                                "ControllerType":  "VMIdeController",
                                                "ControllerNumber":  0
                                            },
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "",
                                                                  "drive_type":  "DvdDrive",
                                                                  "path":  "",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  null,
                                                                  "file_subtype":  null,
                                                                  "drive_id":  null,
                                                                  "parent_path":  null,
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  0,
                                                                  "block_size_mb":  0
                                                              }
                                                          ],
                                                "ControllerType":  "VMIdeController",
                                                "ControllerNumber":  1
                                            },
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\CriticalNonRedundant\\FAX\\Virtual Hard Disks\\FAX_1.vhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  250,
                                                                  "block_size_mb":  32
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "Network Adapter",
                                     "adapter_id":  "Microsoft:45E74D7F-EB5D-48A8-B888-424A88A8D13B\\092C38C3-CAC3-404A-990F-3BDE4BF91951",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  false,
                                     "mac_address":  "0050569879F4",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Untagged",
                                     "vlanid_untagged":  0
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-3",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "IPPLAN",
        "vm_id":  "3d7dd5cc-64b4-43fc-b439-a3fecdf24721",
        "firmware_type":  null,
        "vm_notes":  "#CLUSTER-INVARIANT#:{b083c293-da13-401c-ac56-b4365d9200ab}",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\NonRedundant\\ipplan",
        "host_location_config":  "C:\\ClusterStorage\\NonRedundant\\ipplan",
        "host_location_snapshot":  "C:\\ClusterStorage\\NonRedundant\\ipplan",
        "host_location_smartpaging":  "C:\\ClusterStorage\\NonRedundant\\ipplan",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  1,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  4,
                       "mem_dynamic":  false,
                       "mem_min_gb":  4,
                       "mem_max_gb":  4,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "BIOS",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "Save",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "CD IDE LegacyNetworkAdapter Floppy",
                             "pause_after_failure":  false,
                             "secure":  false,
                             "secure_template":  "None",
                             "preferred_network_protocol":  "N/A",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\NonRedundant\\IPPLAN\\Virtual Hard Disks\\IPPLAN_DAC878B2-5227-4C7D-BCB1-01411402FC65.avhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Differencing",
                                                                  "drive_id":  "Differencing",
                                                                  "parent_path":  "C:\\ClusterStorage\\NonRedundant\\IPPLAN\\Virtual Hard Disks\\IPPLAN.vhdx",
                                                                  "file_size_gb":  10,
                                                                  "disk_size_gb":  120,
                                                                  "block_size_mb":  2
                                                              }
                                                          ],
                                                "ControllerType":  "VMIdeController",
                                                "ControllerNumber":  0
                                            },
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "",
                                                                  "drive_type":  "DvdDrive",
                                                                  "path":  "",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  null,
                                                                  "file_subtype":  null,
                                                                  "drive_id":  null,
                                                                  "parent_path":  null,
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  0,
                                                                  "block_size_mb":  0
                                                              }
                                                          ],
                                                "ControllerType":  "VMIdeController",
                                                "ControllerNumber":  1
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "Network Adapter",
                                     "adapter_id":  "Microsoft:3D7DD5CC-64B4-43FC-B439-A3FECDF24721\\D1B6F514-FF9F-4728-8F12-77762B8CC680",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  false,
                                     "mac_address":  "0050569804C2",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Access",
                                     "vlanid_untagged":  0
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-3",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "KMS",
        "vm_id":  "bb3d196c-332c-4a7a-8f10-bbd53ab1073d",
        "firmware_type":  null,
        "vm_notes":  "#CLUSTER-INVARIANT#:{d633eac3-aff0-420e-b191-b8a3631e7691}",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\NonRedundant\\kms",
        "host_location_config":  "C:\\ClusterStorage\\NonRedundant\\kms",
        "host_location_snapshot":  "C:\\ClusterStorage\\NonRedundant\\kms",
        "host_location_smartpaging":  "C:\\ClusterStorage\\NonRedundant\\kms",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  2,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  4,
                       "mem_dynamic":  false,
                       "mem_min_gb":  4,
                       "mem_max_gb":  4,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "BIOS",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "Save",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "CD IDE LegacyNetworkAdapter Floppy",
                             "pause_after_failure":  false,
                             "secure":  false,
                             "secure_template":  "None",
                             "preferred_network_protocol":  "N/A",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\NonRedundant\\KMS\\Virtual Hard Disks\\KMS.vhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  39,
                                                                  "disk_size_gb":  40,
                                                                  "block_size_mb":  32
                                                              }
                                                          ],
                                                "ControllerType":  "VMIdeController",
                                                "ControllerNumber":  0
                                            },
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "",
                                                                  "drive_type":  "DvdDrive",
                                                                  "path":  "",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  null,
                                                                  "file_subtype":  null,
                                                                  "drive_id":  null,
                                                                  "parent_path":  null,
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  0,
                                                                  "block_size_mb":  0
                                                              }
                                                          ],
                                                "ControllerType":  "VMIdeController",
                                                "ControllerNumber":  1
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "Network Adapter",
                                     "adapter_id":  "Microsoft:BB3D196C-332C-4A7A-8F10-BBD53AB1073D\\5DF28859-E5A0-4108-9815-DCC3C9AB6179",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  false,
                                     "mac_address":  "005056980AEC",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Untagged",
                                     "vlanid_untagged":  0
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-3",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "KOFAX",
        "vm_id":  "e614866a-4d18-4ff8-9c62-1de089b6de31",
        "firmware_type":  null,
        "vm_notes":  "#CLUSTER-INVARIANT#:{1dcd5319-f0e4-4265-8d4c-0db2bbfa1f08}",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\CriticalNonRedundant\\KOFAX",
        "host_location_config":  "C:\\ClusterStorage\\CriticalNonRedundant\\KOFAX",
        "host_location_snapshot":  "C:\\ClusterStorage\\CriticalNonRedundant\\KOFAX",
        "host_location_smartpaging":  "C:\\ClusterStorage\\CriticalNonRedundant\\KOFAX",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  2,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  8,
                       "mem_dynamic":  false,
                       "mem_min_gb":  8,
                       "mem_max_gb":  8,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "BIOS",
                             "start_action":  "Nothing",
                             "start_delay":  20,
                             "stop_action":  "Save",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "CD IDE LegacyNetworkAdapter Floppy",
                             "pause_after_failure":  false,
                             "secure":  false,
                             "secure_template":  "None",
                             "preferred_network_protocol":  "N/A",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\CriticalNonRedundant\\KOFAX\\Virtual Hard Disks\\KOFAX.vhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  195,
                                                                  "disk_size_gb":  240,
                                                                  "block_size_mb":  32
                                                              }
                                                          ],
                                                "ControllerType":  "VMIdeController",
                                                "ControllerNumber":  0
                                            },
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "",
                                                                  "drive_type":  "DvdDrive",
                                                                  "path":  "",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  null,
                                                                  "file_subtype":  null,
                                                                  "drive_id":  null,
                                                                  "parent_path":  null,
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  0,
                                                                  "block_size_mb":  0
                                                              }
                                                          ],
                                                "ControllerType":  "VMIdeController",
                                                "ControllerNumber":  1
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "Network Adapter",
                                     "adapter_id":  "Microsoft:E614866A-4D18-4FF8-9C62-1DE089B6DE31\\3248792F-D95D-4385-BE4A-59F4A2C4EB6E",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  false,
                                     "mac_address":  "00505698B4D6",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Untagged",
                                     "vlanid_untagged":  0
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-3",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "KOFAXDEV",
        "vm_id":  "f84d1208-b7c4-4f04-bc7e-98015e348cb2",
        "firmware_type":  null,
        "vm_notes":  "#CLUSTER-INVARIANT#:{84748de3-5ecd-40fc-a280-ddda068f9216}",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\NonRedundant\\KOFAXDEV",
        "host_location_config":  "C:\\ClusterStorage\\NonRedundant\\KOFAXDEV",
        "host_location_snapshot":  "C:\\ClusterStorage\\NonRedundant\\KOFAXDEV",
        "host_location_smartpaging":  "C:\\ClusterStorage\\NonRedundant\\KOFAXDEV",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  2,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  8,
                       "mem_dynamic":  false,
                       "mem_min_gb":  8,
                       "mem_max_gb":  8,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "UEFI",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "Save",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "Windows Boot Manager EFI SCSI Device EFI Network EFI SCSI Device",
                             "pause_after_failure":  false,
                             "secure":  true,
                             "secure_template":  "MicrosoftWindows",
                             "preferred_network_protocol":  "IPv4",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "c:\\ClusterStorage\\NonRedundant\\KOFAXDEV\\Virtual Hard Disks\\KOFAXDEV.vhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  139,
                                                                  "disk_size_gb":  240,
                                                                  "block_size_mb":  32
                                                              },
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "DvdDrive",
                                                                  "path":  "C:\\ClusterStorage\\SupportFiles\\sw_dvd9_win_server_std_core_2022_2108.27_64bit_english_dc_std_mlf_x23-64869.iso",
                                                                  "controller_location":  1,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  null,
                                                                  "file_subtype":  null,
                                                                  "drive_id":  null,
                                                                  "parent_path":  null,
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  0,
                                                                  "block_size_mb":  0
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "Network Adapter",
                                     "adapter_id":  "Microsoft:F84D1208-B7C4-4F04-BC7E-98015E348CB2\\4A8BD4EE-2D29-43E7-9F65-A0797FDEA003",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  false,
                                     "mac_address":  "00505698492C",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Untagged",
                                     "vlanid_untagged":  0
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-3",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "LMS",
        "vm_id":  "69803d99-98ef-4e55-b932-0909a4d104ef",
        "firmware_type":  null,
        "vm_notes":  "#CLUSTER-INVARIANT#:{41ec0ab9-87e6-44f7-91f5-11db5a5470e0}",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\NonRedundant\\LMS",
        "host_location_config":  "C:\\ClusterStorage\\NonRedundant\\LMS",
        "host_location_snapshot":  "C:\\ClusterStorage\\NonRedundant\\LMS",
        "host_location_smartpaging":  "C:\\ClusterStorage\\NonRedundant\\LMS",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  4,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  8,
                       "mem_dynamic":  false,
                       "mem_min_gb":  8,
                       "mem_max_gb":  8,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "BIOS",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "Save",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "CD IDE LegacyNetworkAdapter Floppy",
                             "pause_after_failure":  false,
                             "secure":  false,
                             "secure_template":  "None",
                             "preferred_network_protocol":  "N/A",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\NonRedundant\\LMS\\Virtual Hard Disks\\LMS_0D5F8F6D-2A3B-44F0-849E-F70CCB8DAFC8.avhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Differencing",
                                                                  "drive_id":  "Differencing",
                                                                  "parent_path":  "C:\\ClusterStorage\\NonRedundant\\LMS\\Virtual Hard Disks\\LMS_10BAEE08-0A70-408A-8F0B-BAACB366E295.avhdx",
                                                                  "file_size_gb":  22,
                                                                  "disk_size_gb":  240,
                                                                  "block_size_mb":  2
                                                              }
                                                          ],
                                                "ControllerType":  "VMIdeController",
                                                "ControllerNumber":  0
                                            },
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "",
                                                                  "drive_type":  "DvdDrive",
                                                                  "path":  "",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  null,
                                                                  "file_subtype":  null,
                                                                  "drive_id":  null,
                                                                  "parent_path":  null,
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  0,
                                                                  "block_size_mb":  0
                                                              }
                                                          ],
                                                "ControllerType":  "VMIdeController",
                                                "ControllerNumber":  1
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "Network Adapter",
                                     "adapter_id":  "Microsoft:69803D99-98EF-4E55-B932-0909A4D104EF\\C32CE3E6-24EE-4F91-AECD-BB3EB8FA0717",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  false,
                                     "mac_address":  "00155D011F52",
                                     "vmmq_enabled":  true,
                                     "vrss_enabled":  true,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Untagged",
                                     "vlanid_untagged":  0
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-3",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "lms2",
        "vm_id":  "6489bb3e-8e34-4406-80db-35edb01b7b35",
        "firmware_type":  null,
        "vm_notes":  "#CLUSTER-INVARIANT#:{78701c08-6b59-4e2d-b806-59536732b502}",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\NonRedundant\\lms2",
        "host_location_config":  "C:\\ClusterStorage\\NonRedundant\\lms2",
        "host_location_snapshot":  "C:\\ClusterStorage\\NonRedundant\\lms2",
        "host_location_smartpaging":  "C:\\ClusterStorage\\NonRedundant\\lms2",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  4,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  8,
                       "mem_dynamic":  true,
                       "mem_min_gb":  2,
                       "mem_max_gb":  16,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "UEFI",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "Save",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "ubuntu EFI SCSI Device EFI SCSI Device EFI Network",
                             "pause_after_failure":  false,
                             "secure":  false,
                             "secure_template":  "MicrosoftWindows",
                             "preferred_network_protocol":  "IPv4",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "c:\\ClusterStorage\\NonRedundant\\lms2\\Virtual Hard Disks\\lms2_disk_1_247A642D-8D53-4446-B24A-2B712CB68185.avhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Differencing",
                                                                  "drive_id":  "Differencing",
                                                                  "parent_path":  "C:\\ClusterStorage\\NonRedundant\\lms2\\Virtual Hard Disks\\lms2_disk_1_2F3F589B-23EF-46F5-B83F-5696C7A01155.avhdx",
                                                                  "file_size_gb":  15,
                                                                  "disk_size_gb":  250,
                                                                  "block_size_mb":  2
                                                              },
                                                              {
                                                                  "resource_pool":  "",
                                                                  "drive_type":  "DvdDrive",
                                                                  "path":  "",
                                                                  "controller_location":  1,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  null,
                                                                  "file_subtype":  null,
                                                                  "drive_id":  null,
                                                                  "parent_path":  null,
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  0,
                                                                  "block_size_mb":  0
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "lms2",
                                     "adapter_id":  "Microsoft:6489BB3E-8E34-4406-80DB-35EDB01B7B35\\A5A569C4-516B-4A03-BA67-98922583BC01",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D0120A2",
                                     "vmmq_enabled":  true,
                                     "vrss_enabled":  true,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Access",
                                     "vlanid_untagged":  0
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-3",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "lms3",
        "vm_id":  "90204278-96af-41d7-8995-39fe72974325",
        "firmware_type":  null,
        "vm_notes":  "#CLUSTER-INVARIANT#:{992fe8f2-a680-4a39-95bd-fa2718ace756}",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\CriticalNonRedundant\\lms3",
        "host_location_config":  "C:\\ClusterStorage\\CriticalNonRedundant\\lms3",
        "host_location_snapshot":  "C:\\ClusterStorage\\CriticalNonRedundant\\lms3",
        "host_location_smartpaging":  "C:\\ClusterStorage\\CriticalNonRedundant\\lms3",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  4,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  8,
                       "mem_dynamic":  true,
                       "mem_min_gb":  2,
                       "mem_max_gb":  16,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "UEFI",
                             "start_action":  "Nothing",
                             "start_delay":  10,
                             "stop_action":  "ShutDown",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "ubuntu EFI Network EFI SCSI Device",
                             "pause_after_failure":  false,
                             "secure":  false,
                             "secure_template":  "MicrosoftWindows",
                             "preferred_network_protocol":  "IPv4",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\CriticalNonRedundant\\lms3\\Virtual Hard Disks\\lms3_disk_1_AC0EAF85-F585-4419-9F02-1611AAA5C3D0.avhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Differencing",
                                                                  "drive_id":  "Differencing",
                                                                  "parent_path":  "C:\\ClusterStorage\\CriticalNonRedundant\\lms3\\Virtual Hard Disks\\lms3_disk_1_738F0D38-3530-4475-95C9-E7AB73965300.avhdx",
                                                                  "file_size_gb":  49,
                                                                  "disk_size_gb":  250,
                                                                  "block_size_mb":  2
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "lms3",
                                     "adapter_id":  "Microsoft:90204278-96AF-41D7-8995-39FE72974325\\8D874250-A1CB-4A2F-85C2-506827BEFDBB",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D016625",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Access",
                                     "vlanid_untagged":  0
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-3",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "LOGS",
        "vm_id":  "09e779a8-2f2b-4a0e-9e19-32b6f51f11d3",
        "firmware_type":  null,
        "vm_notes":  "#CLUSTER-INVARIANT#:{255496e7-6c91-4269-a649-ede99f169ad4}",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\NonRedundant\\LOGS",
        "host_location_config":  "C:\\ClusterStorage\\NonRedundant\\LOGS",
        "host_location_snapshot":  "C:\\ClusterStorage\\NonRedundant\\LOGS",
        "host_location_smartpaging":  "C:\\ClusterStorage\\NonRedundant\\LOGS",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  2,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  8,
                       "mem_dynamic":  false,
                       "mem_min_gb":  8,
                       "mem_max_gb":  8,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "UEFI",
                             "start_action":  "Nothing",
                             "start_delay":  10,
                             "stop_action":  "Save",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "Windows Boot Manager EFI SCSI Device EFI SCSI Device EFI Network EFI SCSI Device",
                             "pause_after_failure":  false,
                             "secure":  true,
                             "secure_template":  "MicrosoftWindows",
                             "preferred_network_protocol":  "IPv4",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "c:\\ClusterStorage\\NonRedundant\\LOGS\\Virtual Hard Disks\\LOGS_2.vhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  111,
                                                                  "disk_size_gb":  120,
                                                                  "block_size_mb":  32
                                                              },
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "c:\\ClusterStorage\\NonRedundant\\LOGS\\Virtual Hard Disks\\LOGS_1.vhdx",
                                                                  "controller_location":  1,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  120,
                                                                  "disk_size_gb":  120,
                                                                  "block_size_mb":  32
                                                              },
                                                              {
                                                                  "resource_pool":  "",
                                                                  "drive_type":  "DvdDrive",
                                                                  "path":  "",
                                                                  "controller_location":  2,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  null,
                                                                  "file_subtype":  null,
                                                                  "drive_id":  null,
                                                                  "parent_path":  null,
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  0,
                                                                  "block_size_mb":  0
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "Network Adapter",
                                     "adapter_id":  "Microsoft:09E779A8-2F2B-4A0E-9E19-32B6F51F11D3\\F538DEE6-1109-40DC-B2A9-9B2B1A089425",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  false,
                                     "mac_address":  "00505698FF84",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Untagged",
                                     "vlanid_untagged":  0
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-3",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "NDS",
        "vm_id":  "6d4fee79-0daa-4516-8b0d-31ff316836b0",
        "firmware_type":  null,
        "vm_notes":  "#CLUSTER-INVARIANT#:{7421731f-d999-4381-a1da-36677439783f}",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\CriticalNonRedundant\\NDS",
        "host_location_config":  "C:\\ClusterStorage\\CriticalNonRedundant\\NDS",
        "host_location_snapshot":  "C:\\ClusterStorage\\CriticalNonRedundant\\NDS",
        "host_location_smartpaging":  "C:\\ClusterStorage\\CriticalNonRedundant\\NDS",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  2,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  8,
                       "mem_dynamic":  false,
                       "mem_min_gb":  8,
                       "mem_max_gb":  8,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "BIOS",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "Save",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "CD IDE LegacyNetworkAdapter Floppy",
                             "pause_after_failure":  false,
                             "secure":  false,
                             "secure_template":  "None",
                             "preferred_network_protocol":  "N/A",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "c:\\ClusterStorage\\CriticalNonRedundant\\NDS\\Virtual Hard Disks\\NDS.vhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  104,
                                                                  "disk_size_gb":  160,
                                                                  "block_size_mb":  32
                                                              }
                                                          ],
                                                "ControllerType":  "VMIdeController",
                                                "ControllerNumber":  0
                                            },
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "",
                                                                  "drive_type":  "DvdDrive",
                                                                  "path":  "",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  null,
                                                                  "file_subtype":  null,
                                                                  "drive_id":  null,
                                                                  "parent_path":  null,
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  0,
                                                                  "block_size_mb":  0
                                                              }
                                                          ],
                                                "ControllerType":  "VMIdeController",
                                                "ControllerNumber":  1
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "Network Adapter",
                                     "adapter_id":  "Microsoft:6D4FEE79-0DAA-4516-8B0D-31FF316836B0\\41005331-4215-41C6-B1EB-2E1AE7BC2DC0",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  false,
                                     "mac_address":  "0050569832EF",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Untagged",
                                     "vlanid_untagged":  0
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-3",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "ORDERPROC",
        "vm_id":  "00722503-5249-4c5c-b43c-663c182f926e",
        "firmware_type":  null,
        "vm_notes":  "#CLUSTER-INVARIANT#:{bcd0ac9a-c417-4745-bd0b-ee9cb9602015}",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\CriticalNonRedundant\\ORDERPROC",
        "host_location_config":  "C:\\ClusterStorage\\CriticalNonRedundant\\ORDERPROC",
        "host_location_snapshot":  "C:\\ClusterStorage\\CriticalNonRedundant\\ORDERPROC",
        "host_location_smartpaging":  "C:\\ClusterStorage\\CriticalNonRedundant\\ORDERPROC",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  1,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  4,
                       "mem_dynamic":  false,
                       "mem_min_gb":  4,
                       "mem_max_gb":  4,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "BIOS",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "Save",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "CD IDE LegacyNetworkAdapter Floppy",
                             "pause_after_failure":  false,
                             "secure":  false,
                             "secure_template":  "None",
                             "preferred_network_protocol":  "N/A",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\CriticalNonRedundant\\ORDERPROC\\Virtual Hard Disks\\ORDERPROC.vhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  120,
                                                                  "disk_size_gb":  120,
                                                                  "block_size_mb":  32
                                                              }
                                                          ],
                                                "ControllerType":  "VMIdeController",
                                                "ControllerNumber":  0
                                            },
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "",
                                                                  "drive_type":  "DvdDrive",
                                                                  "path":  "",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  null,
                                                                  "file_subtype":  null,
                                                                  "drive_id":  null,
                                                                  "parent_path":  null,
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  0,
                                                                  "block_size_mb":  0
                                                              }
                                                          ],
                                                "ControllerType":  "VMIdeController",
                                                "ControllerNumber":  1
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "Network Adapter",
                                     "adapter_id":  "Microsoft:00722503-5249-4C5C-B43C-663C182F926E\\B0F45DD4-F41B-450D-8C84-4C9827798032",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  false,
                                     "mac_address":  "005056989811",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Untagged",
                                     "vlanid_untagged":  0
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-3",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "paul-vlan-test",
        "vm_id":  "2243d0df-c6a1-41c8-8376-4e05a2453621",
        "firmware_type":  null,
        "vm_notes":  "#CLUSTER-INVARIANT#:{bb6f3f57-cc15-4688-a0ae-7c9154222585}",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\NonRedundant\\paul-vlan-test",
        "host_location_config":  "C:\\ClusterStorage\\NonRedundant\\paul-vlan-test",
        "host_location_snapshot":  "C:\\ClusterStorage\\NonRedundant\\paul-vlan-test",
        "host_location_smartpaging":  "C:\\ClusterStorage\\NonRedundant\\paul-vlan-test",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  12,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  4,
                       "mem_dynamic":  false,
                       "mem_min_gb":  0,
                       "mem_max_gb":  1024,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "UEFI",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "Save",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "Windows Boot Manager EFI Network EFI SCSI Device",
                             "pause_after_failure":  false,
                             "secure":  true,
                             "secure_template":  "MicrosoftWindows",
                             "preferred_network_protocol":  "IPv4",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "c:\\ClusterStorage\\NonRedundant\\paul-vlan-test\\Virtual Hard Disks\\paul-vlan-test.vhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  12,
                                                                  "disk_size_gb":  127,
                                                                  "block_size_mb":  32
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "Network Adapter",
                                     "adapter_id":  "Microsoft:2243D0DF-C6A1-41C8-8376-4E05A2453621\\0D7C8295-A2AA-42E4-BE4D-490732D83218",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D011FA9",
                                     "vmmq_enabled":  true,
                                     "vrss_enabled":  true,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Access",
                                     "vlanid_untagged":  39
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-3",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "test-netmon",
        "vm_id":  "2f0d2124-0b09-4edc-b7e1-6cac47c45011",
        "firmware_type":  null,
        "vm_notes":  "",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\Redundant2\\test-netmon",
        "host_location_config":  "C:\\ClusterStorage\\Redundant2\\test-netmon",
        "host_location_snapshot":  "C:\\ClusterStorage\\Redundant2\\test-netmon",
        "host_location_smartpaging":  "C:\\ClusterStorage\\Redundant2\\test-netmon",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  1,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  2,
                       "mem_dynamic":  false,
                       "mem_min_gb":  0,
                       "mem_max_gb":  1024,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "UEFI",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "Save",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "Windows Boot Manager EFI SCSI Device EFI Network EFI Network",
                             "pause_after_failure":  false,
                             "secure":  true,
                             "secure_template":  "MicrosoftWindows",
                             "preferred_network_protocol":  "IPv4",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\Redundant2\\test-netmon-1\\windows2022_upd202402.vhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  19,
                                                                  "disk_size_gb":  20,
                                                                  "block_size_mb":  32
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "Test Network",
                                     "adapter_id":  "Microsoft:2F0D2124-0B09-4EDC-B7E1-6CAC47C45011\\EC0A5CC5-8DD0-4AD6-8024-3FB2F525BCAA",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D016588",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  false,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Access",
                                     "vlanid_untagged":  99
                                 },
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "Management Network",
                                     "adapter_id":  "Microsoft:2F0D2124-0B09-4EDC-B7E1-6CAC47C45011\\51F28645-66A1-4037-83A4-44CC1FB9EE45",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D016589",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  false,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Access",
                                     "vlanid_untagged":  17
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-3",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "VMM",
        "vm_id":  "e118da24-fa9b-4ea8-9e45-d00800ba0829",
        "firmware_type":  null,
        "vm_notes":  "#CLUSTER-INVARIANT#:{6eaf984e-cc38-4865-aafc-872004da68b2}",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\NonRedundant\\VMM",
        "host_location_config":  "C:\\ClusterStorage\\NonRedundant\\VMM",
        "host_location_snapshot":  "C:\\ClusterStorage\\NonRedundant\\VMM",
        "host_location_smartpaging":  "C:\\ClusterStorage\\NonRedundant\\VMM",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  24,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  8,
                       "mem_dynamic":  false,
                       "mem_min_gb":  0,
                       "mem_max_gb":  1024,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "BIOS",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "Save",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "CD IDE LegacyNetworkAdapter Floppy",
                             "pause_after_failure":  false,
                             "secure":  false,
                             "secure_template":  "None",
                             "preferred_network_protocol":  "N/A",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\NonRedundant\\VMM\\Virtual Hard Disks\\VMM.vhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  194,
                                                                  "disk_size_gb":  256,
                                                                  "block_size_mb":  32
                                                              }
                                                          ],
                                                "ControllerType":  "VMIdeController",
                                                "ControllerNumber":  0
                                            },
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "",
                                                                  "drive_type":  "DvdDrive",
                                                                  "path":  "",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  null,
                                                                  "file_subtype":  null,
                                                                  "drive_id":  null,
                                                                  "parent_path":  null,
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  0,
                                                                  "block_size_mb":  0
                                                              }
                                                          ],
                                                "ControllerType":  "VMIdeController",
                                                "ControllerNumber":  1
                                            },
                                            {
                                                "Disks":  [

                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "Network Adapter",
                                     "adapter_id":  "Microsoft:E118DA24-FA9B-4EA8-9E45-D00800BA0829\\1E6F0164-E4E0-4ED9-ACE1-24BED72DA1B9",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D016738",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Untagged",
                                     "vlanid_untagged":  0
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-3",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "WDS",
        "vm_id":  "58bf5bc3-7520-4552-bab9-185257394076",
        "firmware_type":  null,
        "vm_notes":  "#CLUSTER-INVARIANT#:{90ac5003-fb66-4711-95db-5333d0268889}",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\NonRedundant\\wds",
        "host_location_config":  "C:\\ClusterStorage\\NonRedundant\\wds",
        "host_location_snapshot":  "C:\\ClusterStorage\\NonRedundant\\wds",
        "host_location_smartpaging":  "C:\\ClusterStorage\\NonRedundant\\wds",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  2,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  8,
                       "mem_dynamic":  false,
                       "mem_min_gb":  4,
                       "mem_max_gb":  8,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "BIOS",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "Save",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "CD IDE LegacyNetworkAdapter Floppy",
                             "pause_after_failure":  false,
                             "secure":  false,
                             "secure_template":  "None",
                             "preferred_network_protocol":  "N/A",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\NonRedundant\\WDS\\Virtual Hard Disks\\WDS.vhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  207,
                                                                  "disk_size_gb":  250,
                                                                  "block_size_mb":  32
                                                              }
                                                          ],
                                                "ControllerType":  "VMIdeController",
                                                "ControllerNumber":  0
                                            },
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "",
                                                                  "drive_type":  "DvdDrive",
                                                                  "path":  "",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  null,
                                                                  "file_subtype":  null,
                                                                  "drive_id":  null,
                                                                  "parent_path":  null,
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  0,
                                                                  "block_size_mb":  0
                                                              }
                                                          ],
                                                "ControllerType":  "VMIdeController",
                                                "ControllerNumber":  1
                                            },
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\NonRedundant\\WDS\\Virtual Hard Disks\\WDS_1.vhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  246,
                                                                  "disk_size_gb":  250,
                                                                  "block_size_mb":  32
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "Network Adapter",
                                     "adapter_id":  "Microsoft:58BF5BC3-7520-4552-BAB9-185257394076\\4EFDC101-7DC2-4A5C-9364-2132A6113DCD",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  false,
                                     "mac_address":  "005056989C93",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Untagged",
                                     "vlanid_untagged":  0
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-3",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "WEB",
        "vm_id":  "9ba00981-1137-4e29-902e-f6c946f37021",
        "firmware_type":  null,
        "vm_notes":  "#CLUSTER-INVARIANT#:{d9c4b3a4-608b-4df8-95a1-c8e26acfa264}",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\CriticalNonRedundant\\WEB",
        "host_location_config":  "C:\\ClusterStorage\\CriticalNonRedundant\\WEB",
        "host_location_snapshot":  "C:\\ClusterStorage\\CriticalNonRedundant\\WEB",
        "host_location_smartpaging":  "C:\\ClusterStorage\\CriticalNonRedundant\\WEB",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  4,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  4,
                       "mem_dynamic":  false,
                       "mem_min_gb":  0,
                       "mem_max_gb":  1024,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "BIOS",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "TurnOff",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "CD IDE LegacyNetworkAdapter Floppy",
                             "pause_after_failure":  false,
                             "secure":  false,
                             "secure_template":  "None",
                             "preferred_network_protocol":  "N/A",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\CriticalNonRedundant\\WEB\\Virtual Hard Disks\\WEB_6378537F-ADA3-4150-B46A-96C8FE90A3A2.avhd",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHD",
                                                                  "file_subtype":  "Differencing",
                                                                  "drive_id":  "Differencing",
                                                                  "parent_path":  "C:\\ClusterStorage\\CriticalNonRedundant\\WEB\\Virtual Hard Disks\\WEB_F201DB83-DA61-43AC-8E4E-C23EB78D5134.avhd",
                                                                  "file_size_gb":  50,
                                                                  "disk_size_gb":  80,
                                                                  "block_size_mb":  2
                                                              },
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\CriticalNonRedundant\\WEB\\Virtual Hard Disks\\WEB_1_1EC02B41-BD5C-47FA-B783-F97DB5D6A09B.avhd",
                                                                  "controller_location":  1,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHD",
                                                                  "file_subtype":  "Differencing",
                                                                  "drive_id":  "Differencing",
                                                                  "parent_path":  "C:\\ClusterStorage\\CriticalNonRedundant\\WEB\\Virtual Hard Disks\\WEB_1_96B0717B-A223-4A93-89DC-E5EEBE867FBE.avhd",
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  120,
                                                                  "block_size_mb":  2
                                                              }
                                                          ],
                                                "ControllerType":  "VMIdeController",
                                                "ControllerNumber":  0
                                            },
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\CriticalNonRedundant\\WEB\\Virtual Hard Disks\\WEB_2_CAF8F445-C76D-48CC-86AE-DD8B8B34F30D.avhd",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHD",
                                                                  "file_subtype":  "Differencing",
                                                                  "drive_id":  "Differencing",
                                                                  "parent_path":  "C:\\ClusterStorage\\CriticalNonRedundant\\WEB\\Virtual Hard Disks\\WEB_2_5A42CA9E-4B42-43D3-A2E1-38F8A50312B5.avhd",
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  14,
                                                                  "block_size_mb":  2
                                                              },
                                                              {
                                                                  "resource_pool":  "",
                                                                  "drive_type":  "DvdDrive",
                                                                  "path":  "",
                                                                  "controller_location":  1,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  null,
                                                                  "file_subtype":  null,
                                                                  "drive_id":  null,
                                                                  "parent_path":  null,
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  0,
                                                                  "block_size_mb":  0
                                                              }
                                                          ],
                                                "ControllerType":  "VMIdeController",
                                                "ControllerNumber":  1
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "P2V network adapter",
                                     "adapter_id":  "Microsoft:9BA00981-1137-4E29-902E-F6C946F37021\\AFDA8F15-44A4-49D7-8DC0-B966792F0D0A",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  true,
                                     "mac_address":  "00155D016626",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Untagged",
                                     "vlanid_untagged":  0
                                 }
                             ]
    },
    {
        "host_name":  "CORP-UCS-NODE-3",
        "host_cluster_name":  "CORP-UCS-CLU-1",
        "vm_name":  "WHATSUP",
        "vm_id":  "92cc1818-a9f8-4009-b625-cf28f566eae7",
        "firmware_type":  null,
        "vm_notes":  "#CLUSTER-INVARIANT#:{1ee3d533-6392-4cb0-be41-ae165fe40abc}",
        "vm_console_lock_on_disconnect":  false,
        "vm_guestcontrolled_cachetypes":  false,
        "host_location_general":  "C:\\ClusterStorage\\CriticalNonRedundant\\WHATSUP",
        "host_location_config":  "C:\\ClusterStorage\\CriticalNonRedundant\\WHATSUP",
        "host_location_snapshot":  "C:\\ClusterStorage\\CriticalNonRedundant\\WHATSUP",
        "host_location_smartpaging":  "C:\\ClusterStorage\\CriticalNonRedundant\\WHATSUP",
        "host_location_disk":  "",
        "cpu":  {
                    "core_count":  4,
                    "allow_virtualization":  false,
                    "compatability_migration":  false,
                    "compatability_older_os":  false,
                    "enable_resource_protection":  false,
                    "perfmon_pmu":  false,
                    "perfmon_lbr":  false,
                    "perfmon_pebs":  false,
                    "perfmon_ipt":  false,
                    "numa_node_cores":  24,
                    "numa_node_sockets":  1,
                    "threads_per_core":  0,
                    "qos_max":  100,
                    "qos_min":  0,
                    "qos_weight":  100,
                    "resource_pool":  "Primordial",
                    "brand_string":  ""
                },
        "dda":  {
                    "low_memorymapped_iospace":  134217728,
                    "high_memorymapped_iobaseaddress":  68182605824,
                    "high_memorymapped_iospace":  536870912
                },
        "memory":  {
                       "mem_starting_gb":  12,
                       "mem_dynamic":  false,
                       "mem_min_gb":  12,
                       "mem_max_gb":  12,
                       "mem_buffer_pct":  20,
                       "mem_priority":  50,
                       "resource_pool":  "Primordial",
                       "mem_numa_bytes":  256800
                   },
        "bootSettings":  {
                             "firmware_type":  "BIOS",
                             "start_action":  "Nothing",
                             "start_delay":  0,
                             "stop_action":  "Save",
                             "critical_error_action":  "Pause",
                             "critical_error_timeout":  30,
                             "order":  "CD IDE LegacyNetworkAdapter Floppy",
                             "pause_after_failure":  false,
                             "secure":  false,
                             "secure_template":  "None",
                             "preferred_network_protocol":  "N/A",
                             "numlock_status":  false
                         },
        "storage":  {
                        "controllers":  [
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\CriticalNonRedundant\\WHATSUP\\Virtual Hard Disks\\WHATSUP_4.vhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  115,
                                                                  "disk_size_gb":  120,
                                                                  "block_size_mb":  32
                                                              }
                                                          ],
                                                "ControllerType":  "VMIdeController",
                                                "ControllerNumber":  0
                                            },
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "",
                                                                  "drive_type":  "DvdDrive",
                                                                  "path":  "",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  null,
                                                                  "file_subtype":  null,
                                                                  "drive_id":  null,
                                                                  "parent_path":  null,
                                                                  "file_size_gb":  0,
                                                                  "disk_size_gb":  0,
                                                                  "block_size_mb":  0
                                                              }
                                                          ],
                                                "ControllerType":  "VMIdeController",
                                                "ControllerNumber":  1
                                            },
                                            {
                                                "Disks":  [
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\CriticalNonRedundant\\WHATSUP\\Virtual Hard Disks\\WHATSUP_3.vhdx",
                                                                  "controller_location":  0,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  88,
                                                                  "disk_size_gb":  160,
                                                                  "block_size_mb":  32
                                                              },
                                                              {
                                                                  "resource_pool":  "Primordial",
                                                                  "drive_type":  "HardDiskDrive",
                                                                  "path":  "C:\\ClusterStorage\\CriticalNonRedundant\\WHATSUP\\Virtual Hard Disks\\WHATSUP.vhdx",
                                                                  "controller_location":  1,
                                                                  "qos_min_iops":  0,
                                                                  "qos_max_iops":  0,
                                                                  "support_persistant_reservations":  false,
                                                                  "file_format":  "VHDX",
                                                                  "file_subtype":  "Dynamic",
                                                                  "drive_id":  "Dynamic",
                                                                  "parent_path":  "",
                                                                  "file_size_gb":  3,
                                                                  "disk_size_gb":  20,
                                                                  "block_size_mb":  32
                                                              }
                                                          ],
                                                "ControllerType":  "VMScsiController",
                                                "ControllerNumber":  0
                                            }
                                        ],
                        "thread_count_per_channel":  "Automatic",
                        "virtual_processors_per_channel":  0,
                        "disable_interrupt_batching":  false
                    },
        "network_adapters":  [
                                 {
                                     "vlanid_tagged":  [

                                                       ],
                                     "name":  "Network Adapter",
                                     "adapter_id":  "Microsoft:92CC1818-A9F8-4009-B625-CF28F566EAE7\\FC0CA693-A5EC-41A0-AAD6-DE2E2C9AD506",
                                     "resource_pool":  "",
                                     "dynamic_mac_address":  false,
                                     "mac_address":  "005056982C77",
                                     "vmmq_enabled":  false,
                                     "vrss_enabled":  false,
                                     "qos_min_bandwidth":  0,
                                     "qos_max_bandwidth":  0,
                                     "allow_teaming":  true,
                                     "device_naming":  true,
                                     "dhcp_guard":  true,
                                     "ieee_priority_tag":  true,
                                     "mac_address_spoofing":  true,
                                     "qos_min_bandwidth_weight":  0,
                                     "replication_test_pool":  "",
                                     "replication_test_switch":  "",
                                     "vlan_mode":  "Untagged",
                                     "vlanid_untagged":  0
                                 }
                             ]
    }
];

module.exports = Router;
