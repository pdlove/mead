SELECT "logentry".* 
	FROM "syslog"."logentries" AS "logentry"  
	LEFT JOIN "syslog"."logentrymessages" AS "logentrymessages" ON "logentry"."batchID" = "logentrymessages"."logentryBatchID";
	WHERE "logentry"."time" BETWEEN '2025-03-25 16:39:00.000 +00:00' AND '2025-03-26 16:39:00.000 +00:00' AND "logentry"."sourceIP" = '172.17.200.17' AND "logentry"."severity" = 2
(SELECT "logentry"."batchID", "logentry"."lineID", "logentry"."sourceIP", "logentry"."facility", "logentry"."severity", "logentry"."time", "logentry"."state", "logentry"."createdAt", "logentry"."updatedAt" 

 LIMIT '1000' OFFSET 0) AS "logentry" 
LEFT OUTER JOIN "syslog"."logentrymessages" AS "logentrymessages" ON "logentry"."batchID" = "logentrymessages"."logentryBatchID";



Thing to record about DVR Servers:
	VI Logins
	Camera Online/Offline
	Camera Count
	Network Throughput
	Disk Availability
	File Age in Video Storage


sourceIP = '10.17.1.113' AND severity = 3 AND time BETWEEN '2025-03-26T09:06' AND '2025-03-27T09:07'	





https://code.jquery.com/jquery-3.6.0.min.js
https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js
https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css



<div class="container mt-5">
  <div class="dropdown">
    <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
      Select Items
    </button>
    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
      <li><input type="checkbox" class="dropdown-item checkbox-item" id="emergency"> Emergency</li>
      <li><input type="checkbox" class="dropdown-item checkbox-item" id="alert"> Alert</li>
      <li><input type="checkbox" class="dropdown-item checkbox-item" id="critical"> Critical</li>
      <li><input type="checkbox" class="dropdown-item checkbox-item" id="error"> Error</li>
      <li><input type="checkbox" class="dropdown-item checkbox-item" id="warning"> Warning</li>
    </ul>
  </div>

  <div class="mt-3">
    <input type="text" class="form-control" id="selectedItems" disabled placeholder="Selected items will appear here...">
  </div>
</div>




  $(document).ready(function () {
    // Track the selected items
    const selectedItems = [];

    // Update the input field with selected items
    function updateSelectedItems() {
      $('#selectedItems').val(selectedItems.join(', '));
    }

    // Handle checkbox click events
    $('.checkbox-item').on('change', function () {
      const itemLabel = $(this).parent().text().trim();

      if ($(this).prop('checked')) {
        selectedItems.push(itemLabel);
      } else {
        const index = selectedItems.indexOf(itemLabel);
        if (index !== -1) {
          selectedItems.splice(index, 1);
        }
      }

      updateSelectedItems();
    });

    // Update checkboxes based on selected items in the input field
    $('#dropdownMenuButton').on('click', function () {
      $('.checkbox-item').each(function () {
        const itemLabel = $(this).parent().text().trim();
        if (selectedItems.includes(itemLabel)) {
          $(this).prop('checked', true);
        } else {
          $(this).prop('checked', false);
        }
      });
    });
  });
  
  
  
  .dropdown-menu {
      max-height: 200px;
      overflow-y: auto;
    }