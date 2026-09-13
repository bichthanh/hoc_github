document.addEventListener('DOMContentLoaded', loadClothes);

const modal = document.getElementById('itemModal');
const form = document.getElementById('itemForm');
const modalTitle = document.getElementById('modalTitle');

// Load items from API
async function loadClothes() {
    try {
        const response = await fetch('api.php?action=read');
        const clothes = await response.json();
        const grid = document.getElementById('clothes-grid');
        grid.innerHTML = '';

        clothes.forEach(item => {
            // Placeholder image if not provided
            const imgUrl = item.image_url || 'https://via.placeholder.com/400x300?text=No+Image';
            
            grid.innerHTML += `
                <div class="card">
                    <img src="${imgUrl}" alt="${item.name}" class="card-img" onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
                    <h3 class="card-title">${item.name}</h3>
                    <div class="card-price">$${parseFloat(item.price).toFixed(2)}</div>
                    <div class="card-desc">${item.description || 'No description available.'}</div>
                    <div style="margin-bottom: 15px; font-size: 0.9rem; color: #94a3b8;">
                        Stock: ${item.stock} items
                    </div>
                    <div class="card-footer">
                        <button class="btn-edit" onclick='editItem(${JSON.stringify(item).replace(/'/g, "&apos;")})'>Edit</button>
                        <button class="btn-danger" onclick="deleteItem(${item.id})">Delete</button>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error('Error loading clothes:', error);
    }
}

// Modal controls
function openModal() {
    form.reset();
    document.getElementById('itemId').value = '';
    modalTitle.textContent = 'Add New Clothing';
    modal.classList.add('active');
}

function closeModal() {
    modal.classList.remove('active');
}

function editItem(item) {
    document.getElementById('itemId').value = item.id;
    document.getElementById('itemName').value = item.name;
    document.getElementById('itemPrice').value = item.price;
    document.getElementById('itemDesc').value = item.description;
    document.getElementById('itemImage').value = item.image_url;
    document.getElementById('itemStock').value = item.stock;
    
    modalTitle.textContent = 'Edit Clothing';
    modal.classList.add('active');
}

// Form Submit (Create / Update)
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('itemId').value;
    const action = id ? 'update' : 'create';
    
    const data = {
        id: id,
        name: document.getElementById('itemName').value,
        price: parseFloat(document.getElementById('itemPrice').value),
        description: document.getElementById('itemDesc').value,
        image_url: document.getElementById('itemImage').value,
        stock: parseInt(document.getElementById('itemStock').value)
    };

    try {
        const response = await fetch(`api.php?action=${action}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        if(result.status === 'success') {
            closeModal();
            loadClothes();
        } else {
            alert('Error saving item: ' + result.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

// Delete item
async function deleteItem(id) {
    if(confirm('Are you sure you want to delete this item?')) {
        try {
            const response = await fetch('api.php?action=delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: id })
            });
            
            const result = await response.json();
            if(result.status === 'success') {
                loadClothes();
            } else {
                alert('Error deleting item: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
}
