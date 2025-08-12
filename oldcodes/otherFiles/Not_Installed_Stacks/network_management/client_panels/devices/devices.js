document.getElementById('deviceForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = {
        name: document.getElementById('name').value,
        location: document.getElementById('location').value,
        managementIP: document.getElementById('managementIP').value,
        managementVLAN: document.getElementById('managementVLAN').value,
        managementMAC: document.getElementById('managementMAC').value,
        lastPollTime: document.getElementById('lastPollTime').value,
        lastPerformancePollTime: document.getElementById('lastPerformancePollTime').value,
        pollingMethod: document.getElementById('pollingMethod').value,
        snmpCommunity: document.getElementById('snmpCommunity').value,
        snmpVersion: document.getElementById('snmpVersion').value,
        snmpLastFullWalk: document.getElementById('snmpLastFullWalk').value,
        addedByUser: document.getElementById('addedByUser').value
    };

    // Example to send data to a backend API (you need to implement the backend)
    fetch('/api/devices', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        alert('Device added successfully!');
        console.log('Success:', data);
    })
    .catch((error) => {
        alert('Error adding device.');
        console.error('Error:', error);
    });
});