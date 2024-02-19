window.onload = function() {
    // Fetch the JSON data from the file
    fetch('location.json')
    .then(response => response.json())
    .then(data => {
        // Get the select element
        const select = document.getElementById('locationArea');
        
        // Iterate over the data and create an option element for each location
        data.forEach(location => {
            const option = document.createElement('option');
            option.text = location.location;
            option.value = location.price; // Set the value to the delivery fee
            select.appendChild(option);
        });

        // Add event listener to update delivery fee when selection changes
        select.addEventListener('change', function() {
            const selectedOption = select.options[select.selectedIndex];
            const deliveryFeeInput = document.getElementById('deliverFee');
            deliveryFeeInput.value = selectedOption.value;
        });
    })
    .catch(error => console.error('Error fetching JSON:', error));
};

