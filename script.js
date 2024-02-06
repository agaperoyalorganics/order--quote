// Declare data globally
let data;
function updateTotal() {
    const tableBody = document.getElementById('productTableBody');
    const rows = tableBody.getElementsByTagName('tr');
    let total = 0;

    for (let i = 0; i < rows.length; i++) {
        const priceCell = rows[i].getElementsByTagName('td')[2];
        if (priceCell) {
            const priceValue = parseFloat(priceCell.textContent);
            if (!isNaN(priceValue)) {
                total += priceValue;
            }
        }
    }

    document.getElementById('totalAmount').textContent = total.toFixed(2);
}

// stressfull json starrt here
const jsonUrl = 'product.json';

async function fetchData() {
    try {
        const response = await fetch(jsonUrl);
        data = await response.json(); 

        const dropdown = document.getElementById('productName');
        dropdown.innerHTML = ""; 

        data.forEach(product => {
            const optionElement = document.createElement('option');
            optionElement.textContent = product.name;
            dropdown.appendChild(optionElement);
        });

        document.getElementById('productPrice').value = data[0].price;
        updateStockMessage(); // Call updateStockMessage to initially set the stock message
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Function to update the price when a different product is selected
function updatePrice() {
    const dropdown = document.getElementById('productName');
    const selectedProduct = dropdown.options[dropdown.selectedIndex].text;

    // Find the selected product data in the fetched data
    const selectedProductData = data.find(product => product.name === selectedProduct);

    if (selectedProductData) {
        // Update the price after ensuring the data is available
        document.getElementById('productPrice').value = selectedProductData.price;
        updateStockMessage(selectedProductData.instock); // Call updateStockMessage with instock value
    }
}


// Function to update the stock message based on the instock property
function updateStockMessage(instock) {
    const stockMessage = document.getElementById('stockMessage');
    const borderColor = document.getElementById('invoiceCover');
    if (instock=="false") { // Checks if instock is false
        stockMessage.style.display = 'block';
        borderColor.style.border = '1px solid red'
    } else {
        stockMessage.style.display = 'none';
        borderColor.style.border = '1px solid black'
    }
}


fetchData();






// search model for products
const searchInput = document.createElement('input');
searchInput.type = 'text';
searchInput.style = "width:100px"
searchInput.placeholder = '   Search..';
searchInput.addEventListener('input', filterProducts);

const dropdown = document.getElementById('productName');
dropdown.parentNode.insertBefore(searchInput, dropdown);

function filterProducts() {
  const searchTerm = searchInput.value.toLowerCase();
  
  // Filter data and exclude products with null name
  const filteredData = data.filter(product => product.name && product.name.toLowerCase().includes(searchTerm));

  dropdown.innerHTML = ""; // Clear existing options

  filteredData.forEach(product => {
    const optionElement = document.createElement('option');
    optionElement.textContent = product.name;
    dropdown.appendChild(optionElement);
  });
}
// search model for products



// add product to table
function addProductToTable() {
    const productName = document.getElementById('productName').value;
    const productQuantity = document.getElementById('productQuantity').value;
    const productPrice = document.getElementById('productPrice').value;

    if (productName && productPrice) {
        const tableBody = document.getElementById('productTableBody');
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <th scope="row">${tableBody.children.length + 1}</th>
            <td>${productName}</td>
            <td>${productQuantity}</td>
            <td>${productPrice*productQuantity}</td>

            <td>
                <button type="button" class="btn btn-danger delete-btn"><i class="fa-solid fa-trash"></i></button>
            </td>
        `;
        tableBody.appendChild(newRow);

        document.getElementById('productName').value = '';
        document.getElementById('productQuantity').value = '';
        document.getElementById('productPrice').value = '';

        const deleteButton = newRow.querySelector('.delete-btn');
        deleteButton.addEventListener('click', function () {
            tableBody.removeChild(newRow);
            updateTotal();
        });

        updateTotal();
    }
}
document.getElementById('productForm').addEventListener('submit', function (event) {
    event.preventDefault();
    addProductToTable();
});
// add product to table




// confirming invoce
document.getElementById('generateInvoice').addEventListener('click', function () {
    const totalAmount = document.getElementById('totalAmount').textContent;
    const tableBody = document.getElementById('productTableBody');
    const invoiceTableBody = document.getElementById('invoiceTableBody');
    invoiceTableBody.innerHTML = '';

    for (const row of tableBody.children) {
        const productName = row.getElementsByTagName('td')[0].textContent;
        const productQuantity = row.getElementsByTagName('td')[1].textContent;
        const productPrice = row.getElementsByTagName('td')[2].textContent;

        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${productName}</td>
            <td>${productQuantity}</td>
            <td>${productPrice}</td>
        `;
        invoiceTableBody.appendChild(newRow);
    }

    document.getElementById('invoiceTotal').textContent = totalAmount;

    $('#invoiceModal').modal('show');
});
// confirming invoice




// download pdf invoice

function printInvoice() {
    const invoiceContent = document.querySelector('.modal-header').innerHTML;
    const totalAmount = document.getElementsByClassName('modal-body')[0].innerHTML;

    const pdfContent = `
        <div style="padding: 10px; margin: 0;">
            <p>Please send this PDF to any of our WhatsApp (09126711653, 07025558753) or Instagram @agaperoyalorganics. You will be attended to immediately before any other customer.</p>
            ${invoiceContent}
            ${totalAmount}
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            </p>
        </div>
    `;

    const options = {
        margin: 0,
        padding: 0,
        filename: 'your_quote.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 4 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }, 
        // Adjust this line for custom size and orientation
    };

    html2pdf(pdfContent, options).save();
}

document.getElementById('printButton').addEventListener('click', function () {
    printInvoice();
});
// download pdf invoice




