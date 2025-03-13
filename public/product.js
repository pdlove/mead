


document.addEventListener('DOMContentLoaded', async function() {
    const productTableBody = document.querySelector('#productTable tbody');
    const productModal = document.getElementById('productModal');
    const closeModal = document.querySelector('.close');

    closeModal.addEventListener('click', () => {
        productModal.style.display = 'none';
    });

    window.onclick = function(event) {
        if (event.target == productModal) {
            productModal.style.display = 'none';
        }
    };

    

    function renderCategoryTree(tbody, categoryTree, products, level = 0) {
        categoryTree.forEach(category => {
            const categoryRow = document.createElement('tr');
            categoryRow.classList.add('category-row');
            categoryRow.dataset.categoryId = category.categoryID;

            const categoryNameCell = document.createElement('td');
            categoryNameCell.textContent = '—'.repeat(level) + ' ' + category.name;

            const categoryActionCell = document.createElement('td');
            const newProductLink = document.createElement('span');
            newProductLink.classList.add('new-product');
            newProductLink.textContent = 'New Product';
            newProductLink.addEventListener('click', () => openProductModal(category.categoryID));

            categoryActionCell.appendChild(newProductLink);
            categoryRow.appendChild(categoryNameCell);
            categoryRow.appendChild(categoryActionCell);
            tbody.appendChild(categoryRow);

            const categoryProducts = products.filter(product => product.categoryID === category.categoryID);
            categoryProducts.forEach(product => renderProductRow(tbody, product, level + 1));

            if (category.children) {
                renderCategoryTree(tbody, category.children, products, level + 1);
            }
        });
    }

    function renderProductRow(tbody, product, level) {
        const productRow = document.createElement('tr');
        productRow.classList.add('product-row');

        const productNameCell = document.createElement('td');
        productNameCell.textContent = '—'.repeat(level) + ' ' + product.name;

        const productActionCell = document.createElement('td');
        const editIcon = document.createElement('span');
        editIcon.classList.add('edit-icon');
        editIcon.textContent = '✏️';
        editIcon.addEventListener('click', () => openProductModal(product.categoryID, product));

        productActionCell.appendChild(editIcon);
        productRow.appendChild(productNameCell);
        productRow.appendChild(productActionCell);
        tbody.appendChild(productRow);
    }

    function openProductModal(categoryID, product = null) {
        const modalTitle = document.getElementById('modalTitle');
        const productForm = document.getElementById('productForm');

        if (product) {
            modalTitle.textContent = 'Edit Product';
            productForm.productID.value = product.productID;
            productForm.name.value = product.name;
            productForm.size.value = product.size;
            productForm.modifier.value = product.modifier;
            productForm.basePrice.value = product.BasePrice;
            productForm.lastCost.value = product.LastCost;
        } else {
            modalTitle.textContent = 'Add New Product';
            productForm.reset();
        }

        productForm.categoryID.value = categoryID;
        productModal.style.display = 'block';
    }

    productForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(productForm);
        const productID = formData.get('productID');
        const categoryID = formData.get('categoryID');

        const productData = {
            name: formData.get('name'),
            size: formData.get('size'),
            modifier: formData.get('modifier'),
            BasePrice: formData.get('BasePrice'),
            LastCost: formData.get('LastCost'),
            categoryID: categoryID,
        };

        try {
            let response;
            if (productID) {
                response = await fetch(`/api/pos/products/${productID}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData)
                });
            } else {
                response = await fetch('/api/pos/products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData)
                });
            }

            if (response.ok) {
                alert('Product saved successfully');
                productModal.style.display = 'none';
                fetchCategoriesAndProducts();
            } else {
                alert('Failed to save product');
            }
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Error saving product');
        }
    });

    let myPage = new Page_Products();
    myPage.setParameters();
    myPage.renderDOM(document.getElementById("productTable"));
});