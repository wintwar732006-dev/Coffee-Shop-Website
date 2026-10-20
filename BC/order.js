let menuItems = []; 
let cart = []; 
let currentReceipt = null;

fetch('menus.json')
.then(res => res.json())
.then(data => {
    menuItems = data; 
    renderMenu(menuItems); 
})
.catch(err => console.error("Error loading JSON:", err)); 

document.querySelector('.btn-checkout').addEventListener('click', showReceipt);
document.getElementById('receipt-download').addEventListener('click', downloadReceipt);
document.getElementById('receipt-close').addEventListener('click', closeReceipt);
document.getElementById('receipt-done').addEventListener('click', closeReceipt);

document.getElementById('receipt-dialog').addEventListener('click', (event) => {
  if(event.target === event.currentTarget) closeReceipt();
});

function showReceipt() {
  if(cart.length === 0) return;

  const items = cart.map(item => ({ ...item }));
  const total = items.reduce((sum, item) => sum + Number(item.price_mmk) * item.quantity, 0);
  const createdAt = new Date();
  currentReceipt = {
    items,
    total,
    createdAt,
    number: `GB-${createdAt.getTime().toString().slice(-8)}`
  };

  document.getElementById('receipt-number').textContent = `Receipt ${currentReceipt.number}`;
  document.getElementById('receipt-date').textContent = createdAt.toLocaleString();
  document.getElementById('receipt-total').textContent = `${total.toLocaleString()} MMK`;

  const receiptLines = document.getElementById('receipt-lines');
  receiptLines.replaceChildren();
  items.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'receipt-line';

    const name = document.createElement('span');
    name.className = 'receipt-item-name';
    name.textContent = item.item_name;

    const quantity = document.createElement('span');
    quantity.textContent = String(item.quantity);

    const amount = document.createElement('span');
    amount.textContent = `${(Number(item.price_mmk) * item.quantity).toLocaleString()} MMK`;

    row.append(name, quantity, amount);
    receiptLines.append(row);
  });

  document.getElementById('receipt-dialog').showModal();
}

function closeReceipt() {
  const receiptDialog = document.getElementById('receipt-dialog');
  if(receiptDialog.open) receiptDialog.close();
  document.querySelector('.btn-checkout').focus();
}

function downloadReceipt() {
  if(!currentReceipt) return;

  const { items, total } = currentReceipt;

  const pageWidth = 595;
  const pageHeight = 842;
  const left = 48;
  const right = pageWidth - left;
  const pages = [];

  const safeText = (value) => String(value).replace(/[^\x20-\x7E]/g, '?');
  const escapePdfText = (value) => safeText(value)
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
  const addText = (page, text, x, y, size = 11, bold = false) => {
    page.push(`BT /${bold ? 'F2' : 'F1'} ${size} Tf 1 0 0 1 ${x} ${y} Tm (${escapePdfText(text)}) Tj ET`);
  };
  const addRule = (page, y) => page.push(`0.82 G 0.6 w ${left} ${y} m ${right} ${y} l S 0 G`);
  let currentPage;
  let y;

  const startPage = () => {
    currentPage = [];
    pages.push(currentPage);
    addText(currentPage, 'THE GOLDEN BEAN CAFE', left, pageHeight - 52, 18, true);
    addText(currentPage, 'Order receipt', left, pageHeight - 73, 11);
    addText(currentPage, new Date().toLocaleString(), right - 150, pageHeight - 73, 9);
    addRule(currentPage, pageHeight - 88);
    addText(currentPage, 'Item', left, pageHeight - 108, 10, true);
    addText(currentPage, 'Qty', right - 90, pageHeight - 108, 10, true);
    addText(currentPage, 'Amount (MMK)', right - 12, pageHeight - 108, 10, true);
    y = pageHeight - 128;
  };

  startPage();
  items.forEach((item) => {
    const unitPrice = Number(item.price_mmk);
    const lineTotal = unitPrice * item.quantity;
    const itemName = safeText(item.item_name);
    const nameLines = itemName.match(/.{1,48}(?:\s|$)|\S{1,48}/g) || [''];
    const rowHeight = Math.max(nameLines.length * 13, 16);

    if(y - rowHeight < 75) {
      startPage();
    }

    nameLines.forEach((line, lineIndex) => {
      addText(currentPage, line.trim(), left, y - (lineIndex * 13));
    });
    addText(currentPage, String(item.quantity), right - 90, y, 10);
    addText(currentPage, lineTotal.toLocaleString(), right - 12, y, 10);
    y -= rowHeight + 5;
  });

  if(y < 80) {
    startPage();
  }

  addRule(currentPage, y);
  addText(currentPage, 'Total', left, y - 22, 13, true);
  addText(currentPage, `${total.toLocaleString()} MMK`, right - 12, y - 22, 13, true);
  addText(currentPage, 'Thank you for ordering with us!', left, y - 48, 10);

  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    `<< /Type /Pages /Kids [${pages.map((_, index) => `${4 + index * 2} 0 R`).join(' ')}] /Count ${pages.length} >>`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>'
  ];

  pages.forEach((commands, index) => {
    const pageObject = 4 + index * 2;
    const content = commands.join('\n');
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${pageObject + 1} 0 R >>`);
    objects.push(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`);
  });

  let pdfSource = '%PDF-1.4\n';
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(pdfSource.length);
    pdfSource += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = pdfSource.length;
  pdfSource += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdfSource += `${String(offset).padStart(10, '0')} 00000 n \n`;
  });
  pdfSource += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const url = URL.createObjectURL(new Blob([pdfSource], { type: 'application/pdf' }));
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = `golden-bean-receipt-${timestamp}.pdf`;
  downloadLink.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function renderMenu(items){
    const drinks = items.filter(i => 
        i.category.includes('coffee') || i.category.includes('teas') || i.category.includes('drinks')
    ); 
    const pasteries = items.filter(i => 
        i.category.includes('pastry') || i.category.includes('savory') || i.category.includes('bakery')
    ); 

    document.getElementById('drinks-count').textContent = `${drinks.length} Items`; 
    document.getElementById('pasteries-count').textContent = `${pasteries.length} Items`; 

    const drinksList = document.getElementById('drinks-list');
    const pasteriesList = document.getElementById('pasteries-list');
    const drinksScrollTop = drinksList.scrollTop;
    const pasteriesScrollTop = pasteriesList.scrollTop;

    drinksList.innerHTML = drinks.map(createItemCard).join('');
    pasteriesList.innerHTML = pasteries.map(createItemCard).join('');
    drinksList.scrollTop = drinksScrollTop;
    pasteriesList.scrollTop = pasteriesScrollTop;
}

function createItemCard(item) {
  const isOutOfStock = item.stock <= 0;
  const tagsHtml = item.tags.map(t => `<span class="tag-badge">${t}</span>`).join('');
  const formattedPrice = Number(item.price_mmk).toLocaleString();

  return `
    <div class="item-card ${isOutOfStock ? 'out-of-stock-card' : ''}">
      <img src="${item.image}" alt="${item.item_name}" class="item-img" />
      
      <div class="item-details">
        <h3 class="item-title">${item.item_name}</h3>
        
        <div class="item-tags">
          ${tagsHtml}
        </div>
        
        <div class="item-footer">
          <!-- Price and + Add stacked on the left -->
          <div class="price-action">
            <span class="item-price">${formattedPrice} MMK</span>
            ${
              !isOutOfStock 
                ? `<button class="btn-add" onclick="addToCart(${item.id})">+ Add</button>` 
                : ''
            }
          </div>

          <!-- Stock aligned to the bottom right -->
          <div class="stock-status">
            ${
              isOutOfStock 
                ? `<span class="out-of-stock-text">Out of Stock</span>` 
                : `Stock: ${item.stock}`
            }
          </div>
        </div>
      </div>
    </div>
  `;
}

// adding items into cart when clicking (+Add)

function addToCart(itemId) {
    const product = menuItems.find(p => p.id == itemId); 
    if(!product) return; 

  if(product.stock <= 0) {
    alert("Can't order over the limit of stock!");
    return;
  }

    const cartItem = cart.find(item => item.id === itemId); 

    if(cartItem){
    cartItem.quantity += 1;
    }
    else{
        cart.push({ ...product, quantity: 1}); 
    }
    product.stock -= 1;
    renderMenu(menuItems);
    renderCart();
}

// rendering cart UI
function renderCart() {
    const emptyCartEl = document.getElementById('empty-cart'); 
    const cartItemsEl = document.getElementById('cart-items'); 
    const cartFooterEl = document.getElementById('cart-footer'); 
    const totalPriceEl = document.getElementById('cart-total-price'); 

    if(cart.length === 0) {
        emptyCartEl.style.display = 'block'; 
        cartItemsEl.innerHTML = ''; 
        cartFooterEl.style.display = 'none'; 
        return; 
    }

    emptyCartEl.style.display = 'none'; 
    cartFooterEl.style.display = 'block'; 

    let total = 0; 

    cartItemsEl.innerHTML = cart.map(item => {
        const itemTotal = Number(item.price_mmk) * item.quantity; 
        total += itemTotal; 

        return `
        <div class="cart-item-row">
        <div class="cart-item-info"> 
        <h4>${item.item_name}</h4> 
        <span>${Number(item.price_mmk).toLocaleString()} MMK</span>
        </div> 
        <div class="cart-qty-controls">
        <button onclick="updateQuantity(${item.id}, -1)">-</button> 
        <span>${item.quantity}</span> 
        <button onclick="updateQuantity(${item.id}, 1)"> + </button> 
        </div> 
        </div> <hr class="hr">
        `; 
    }).join(''); 

    totalPriceEl.textContent = `${total.toLocaleString()} MMK`; 
}

// add or reduce the amount of items in the cart

function updateQuantity(itemId, change){
    const itemIndex = cart.findIndex( i => i.id === itemId); 
    if(itemIndex === -1) return; 

    const originalProduct = menuItems.find(p => p.id === itemId);
    if(!originalProduct) return;

    if(change > 0) {
      if(originalProduct.stock <= 0) {
        alert("You can't buy over the stock limit!");
        return;
      }
      originalProduct.stock -= change;
    } else if(change < 0) {
      originalProduct.stock -= change;
    }

    cart[itemIndex].quantity += change;
// remove from the cart if the quantity is zero 

    if(cart[itemIndex].quantity <= 0){
        cart.splice(itemIndex, 1); 
    }
    renderMenu(menuItems);
    renderCart();
};