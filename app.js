/**
 * TEMPTEA POS SYSTEM - ENTERPRISE LOGIC ENGINE
 * Integrated Product Image Uploads with Emoji Icon Fallback support.
 */

// ==========================================
// 1. INITIAL DATABASE & STATE MANAGEMENT
// ==========================================

const DEFAULT_PRODUCTS = [
  { id: 101, name: "Matcha Latte", price: 110.00, stock: 48, icon: "🍵", image: "", category: "Milk Tea", addons: ["0% Sugar", "50% Sugar", "Extra Boba"] },
  { id: 102, name: "Classic Pearl Milk Tea", price: 95.00, stock: 30, icon: "🧋", image: "", category: "Milk Tea", addons: ["Egg Pudding", "Grass Jelly"] },
  { id: 103, name: "Mango Fruit Tea", price: 105.00, stock: 22, icon: "🍹", image: "", category: "Fruit Tea", addons: ["Rainbow Jelly", "Nata de Coco"] },
  { id: 104, name: "Classic Beef Burger", price: 85.00, stock: 18, icon: "🍔", image: "", category: "Burgers", addons: ["Extra Cheese", "Add Egg", "Double Patty"] },
  { id: 105, name: "Crispy French Fries", price: 45.00, stock: 40, icon: "🍟", image: "", category: "Snacks", addons: ["BBQ Powder", "Cheese Powder", "Sour Cream"] },
  { id: 106, name: "Tempura Platter", price: 65.00, stock: 15, icon: "🍱", image: "", category: "Snacks", addons: ["Sweet Sauce", "Spicy Dip"] },
  { id: 107, name: "Cheese Foam Topping", price: 20.00, stock: 100, icon: "🧀", image: "", category: "Add-ons", addons: [] }
];

const DEFAULT_RECEIPT_CONFIG = {
  storeName: "TEMPTEA BOUTIQUE",
  address: "Unit 102, Food Plaza, Uptown Branch",
  tin: "TIN: 009-882-114-000",
  footerMsg: "Thank you for choosing TEMPTEA! Please come again."
};

let appState = {
  currentUser: null,
  products: [],
  cart: [],
  sales: [],
  receiptConfig: {},
  activeCategory: "all",
  activeDiscount: { type: "none", percent: 0, fixedAmount: 0, label: "None" },
  uploadedImageBase64: "" // Holds binary image string temporarily before form submit
};

// ==========================================
// 2. STORAGE ENGINE
// ==========================================

const StorageEngine = {
  init() {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (!localStorage.getItem('temptea_products')) {
        localStorage.setItem('temptea_products', JSON.stringify(DEFAULT_PRODUCTS));
      }
      if (!localStorage.getItem('temptea_sales')) {
        const initialSales = [{
          id: "#TRX-882019",
          timestamp: "9/3/2026, 2:30:15 PM",
          customer: "Walk-in Guest",
          type: "Dine-In",
          items: [{ id: 101, name: "Matcha Latte", price: 110, qty: 1, addon: "50% Sugar" }],
          total: 110.00,
          cashPaid: 200.00,
          change: 90.00,
          cashier: "Cashier Demo"
        }];
        localStorage.setItem('temptea_sales', JSON.stringify(initialSales));
      }
      if (!localStorage.getItem('temptea_receipt_cfg')) {
        localStorage.setItem('temptea_receipt_cfg', JSON.stringify(DEFAULT_RECEIPT_CONFIG));
      }

      appState.products = JSON.parse(localStorage.getItem('temptea_products'));
      appState.sales = JSON.parse(localStorage.getItem('temptea_sales'));
      appState.receiptConfig = JSON.parse(localStorage.getItem('temptea_receipt_cfg'));
    } else {
      appState.products = DEFAULT_PRODUCTS;
      appState.receiptConfig = DEFAULT_RECEIPT_CONFIG;
    }
  },

  saveProducts() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('temptea_products', JSON.stringify(appState.products));
    }
  },

  saveSales() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('temptea_sales', JSON.stringify(appState.sales));
    }
  },

  saveReceiptConfig() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('temptea_receipt_cfg', JSON.stringify(appState.receiptConfig));
    }
  },

  resetAll() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.clear();
      location.reload();
    }
  }
};

// ==========================================
// 3. INITIALIZATION & UI ROUTING
// ==========================================

if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    StorageEngine.init();
    setupEventListeners();
    updateReceiptPreview();
  });

  // GLOBAL DELEGATED CLICK HANDLERS (Ensures desktop builds catch all button clicks)
  document.addEventListener('click', (e) => {
    if (e.target.matches('#btn-apply-discount') || e.target.closest('#btn-apply-discount')) {
      e.preventDefault();
      applyDiscountPrompt();
    }
    
    if (e.target.matches('#btn-remove-discount') || e.target.closest('#btn-remove-discount')) {
      e.preventDefault();
      removeDiscount();
    }
  });
}

function setupEventListeners() {
  const pinInput = document.getElementById('pin-input');
  document.querySelectorAll('.pin-key[data-val]').forEach(key => {
    key.addEventListener('click', () => {
      if (pinInput.value.length < 6) pinInput.value += key.dataset.val;
    });
  });

  document.getElementById('clear-pin-btn')?.addEventListener('click', () => pinInput.value = '');
  document.getElementById('pin-backspace')?.addEventListener('click', () => {
    pinInput.value = pinInput.value.slice(0, -1);
  });

  document.getElementById('login-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const pin = pinInput.value;
    if (pin === "1234") {
      loginUser("Cashier Demo", "cashier");
    } else if (pin === "8888") {
      loginUser("Admin Manager", "admin");
    } else {
      showToast("Invalid PIN!", "error");
      pinInput.value = '';
    }
  });

  document.getElementById('btn-logout')?.addEventListener('click', logoutUser);
  document.getElementById('btn-view-cashier')?.addEventListener('click', () => switchTab('cashier-view'));
  document.getElementById('btn-view-admin')?.addEventListener('click', () => switchTab('admin-view'));
  document.getElementById('btn-view-orders')?.addEventListener('click', () => {
    switchTab('orders-view');
    renderOrdersLog();
  });

  document.getElementById('category-bar')?.addEventListener('click', (e) => {
    if (e.target.classList.contains('category-chip')) {
      document.querySelectorAll('.category-chip').forEach(c => c.classList.remove('active'));
      e.target.classList.add('active');
      appState.activeCategory = e.target.dataset.cat;
      renderProductsCatalog();
    }
  });

  document.querySelectorAll('.admin-nav-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.admin-nav-item').forEach(i => i.classList.remove('active'));
      document.querySelectorAll('.admin-section').forEach(s => s.classList.add('hidden-admin-section'));
      
      e.target.classList.add('active');
      const targetSection = document.getElementById(e.target.dataset.tab);
      if (targetSection) targetSection.classList.remove('hidden-admin-section');

      if (e.target.dataset.tab === 'tab-analytics') renderAnalytics();
      if (e.target.dataset.tab === 'tab-inventory') renderInventoryTable();
      if (e.target.dataset.tab === 'tab-products') renderAdminProductsTable();
    });
  });

  document.getElementById('cash-tendered')?.addEventListener('input', calculateChange);
  document.getElementById('btn-clear-cart')?.addEventListener('click', clearCart);
  document.getElementById('btn-print')?.addEventListener('click', processCheckout);

  document.getElementById('btn-export-sales-csv')?.addEventListener('click', exportSalesToCSV);
  document.getElementById('btn-export-sales-excel')?.addEventListener('click', exportSalesToExcel);

  // IMAGE FILE UPLOAD READER
  const imageInput = document.getElementById('prod-image-file');
  if (imageInput) {
    imageInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          appState.uploadedImageBase64 = event.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  document.getElementById('add-product-form')?.addEventListener('submit', handleProductFormSubmit);
  document.getElementById('btn-bulk-restock')?.addEventListener('click', bulkRestock);
  document.getElementById('btn-reset-data')?.addEventListener('click', () => {
    if (confirm("Are you sure? This will wipe all transaction history!")) StorageEngine.resetAll();
  });
}

// ==========================================
// 4. AUTHENTICATION & NAVIGATION
// ==========================================

function loginUser(name, role) {
  appState.currentUser = { name, role };
  document.getElementById('user-display-name').innerText = name;
  document.getElementById('session-badge').innerText = role.toUpperCase() + " MODE";
  document.getElementById('session-badge').className = `badge badge-${role}`;

  document.getElementById('login-view').classList.remove('active-view');
  document.getElementById('login-view').classList.add('hidden');
  document.getElementById('app-wrapper').classList.remove('hidden');

  renderProductsCatalog();
  renderCart();
  showToast(`Welcome back, ${name}!`);
}

function logoutUser() {
  appState.currentUser = null;
  document.getElementById('app-wrapper').classList.add('hidden');
  document.getElementById('login-view').classList.remove('hidden');
  document.getElementById('login-view').classList.add('active-view');
  document.getElementById('pin-input').value = '';
}

function switchTab(tabId) {
  document.querySelectorAll('.workspace-tab').forEach(tab => tab.classList.add('hidden-tab'));
  document.getElementById(tabId).classList.remove('hidden-tab');

  document.querySelectorAll('.btn-nav').forEach(btn => btn.classList.remove('active'));
  if (tabId === 'cashier-view') document.getElementById('btn-view-cashier')?.classList.add('active');
  if (tabId === 'admin-view') {
    document.getElementById('btn-view-admin')?.classList.add('active');
    renderAnalytics();
  }
  if (tabId === 'orders-view') document.getElementById('btn-view-orders')?.classList.add('active');
}

// ==========================================
// 5. CASHIER POS CORE LOGIC
// ==========================================

function renderProductsCatalog() {
  const grid = document.getElementById('product-grid');
  if (!grid) return;
  grid.innerHTML = '';

  const filtered = appState.products.filter(p => {
    return appState.activeCategory === 'all' || p.category === appState.activeCategory;
  });

  filtered.forEach(p => {
    const card = document.createElement('div');
    card.className = `product-card ${p.stock <= 0 ? 'out-of-stock' : ''}`;

    const visualElement = p.image 
      ? `<img src="${p.image}" class="product-img-display" alt="${p.name}" />`
      : `<div class="emoji-box">${p.icon || '🍵'}</div>`;

    card.innerHTML = `
      ${visualElement}
      <div class="title">${p.name}</div>
      <div class="price">₱${p.price.toFixed(2)}</div>
      <div class="stock-tag">${p.stock > 0 ? `Stock: ${p.stock}` : 'OUT OF STOCK'}</div>
    `;
    card.addEventListener('click', () => addToCart(p.id));
    grid.appendChild(card);
  });
}

function addToCart(productId) {
  const product = appState.products.find(p => p.id === productId);
  if (!product || product.stock <= 0) return showToast("Item out of stock!", "error");

  const existing = appState.cart.find(ci => ci.id === productId);
  if (existing) {
    if (product.stock <= existing.qty) return showToast("Stock limit reached!", "error");
    existing.qty++;
  } else {
    appState.cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      qty: 1,
      addon: product.addons.length > 0 ? product.addons[0] : 'Standard'
    });
  }

  renderCart();
}

function renderCart() {
  const container = document.getElementById('cart-items');
  if (!container) return;

  if (appState.cart.length === 0) {
    container.innerHTML = `
      <div class="empty-cart-state">
        <div class="empty-icon">🛍️</div>
        <p>Cart is empty</p>
      </div>`;
    updateTotals(0);
    return;
  }

  container.innerHTML = appState.cart.map((item, index) => `
    <div class="cart-item-row">
      <div class="cart-item-info">
        <div class="item-name">${item.name}</div>
        <div class="item-addon">${item.addon}</div>
      </div>
      <div class="cart-item-controls">
        <button class="qty-btn" onclick="updateQty(${index}, -1)">-</button>
        <span>${item.qty}</span>
        <button class="qty-btn" onclick="updateQty(${index}, 1)">+</button>
      </div>
      <div class="cart-item-price">₱${(item.price * item.qty).toFixed(2)}</div>
    </div>
  `).join('');

  const subtotal = appState.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  updateTotals(subtotal);
}

function updateQty(index, delta) {
  const item = appState.cart[index];
  const prod = appState.products.find(p => p.id === item.id);

  if (delta > 0 && prod.stock <= item.qty) {
    return showToast("Cannot exceed available stock!", "error");
  }

  item.qty += delta;
  if (item.qty <= 0) {
    appState.cart.splice(index, 1);
  }
  renderCart();
}

function clearCart() {
  appState.cart = [];
  appState.activeDiscount = { type: "none", percent: 0, fixedAmount: 0, label: "None" };
  if (document.getElementById('discount-label')) document.getElementById('discount-label').innerText = "None";
  if (document.getElementById('cash-tendered')) document.getElementById('cash-tendered').value = '';
  if (document.getElementById('change-due')) document.getElementById('change-due').innerText = "₱0.00";
  renderCart();
}

function updateTotals(subtotal) {
  const tax = subtotal * 0.12;
  let discountAmount = 0;

  if (appState.activeDiscount.percent > 0) {
    discountAmount = subtotal * (appState.activeDiscount.percent / 100);
  } else if (appState.activeDiscount.fixedAmount > 0) {
    discountAmount = appState.activeDiscount.fixedAmount;
  }

  if (discountAmount > subtotal) discountAmount = subtotal;

  const grandTotal = Math.max(0, subtotal + tax - discountAmount);

  if (document.getElementById('cart-subtotal')) document.getElementById('cart-subtotal').innerText = `₱${subtotal.toFixed(2)}`;
  if (document.getElementById('cart-tax')) document.getElementById('cart-tax').innerText = `₱${tax.toFixed(2)}`;
  if (document.getElementById('cart-discount')) document.getElementById('cart-discount').innerText = `-₱${discountAmount.toFixed(2)}`;
  if (document.getElementById('discount-label')) document.getElementById('discount-label').innerText = appState.activeDiscount.label || "None";
  if (document.getElementById('cart-total')) document.getElementById('cart-total').innerText = `₱${grandTotal.toFixed(2)}`;
  if (document.getElementById('cart-item-count')) document.getElementById('cart-item-count').innerText = `${appState.cart.reduce((a,b)=>a+b.qty,0)} Items`;

  calculateChange();
}

function calculateChange() {
  const totalStr = document.getElementById('cart-total')?.innerText.replace('₱', '') || "0";
  const grandTotal = parseFloat(totalStr) || 0;
  const cashPaid = parseFloat(document.getElementById('cash-tendered')?.value) || 0;
  const change = cashPaid - grandTotal;

  const changeEl = document.getElementById('change-due');
  if (changeEl) {
    if (change >= 0) {
      changeEl.innerText = `₱${change.toFixed(2)}`;
      changeEl.classList.remove('font-red');
      changeEl.classList.add('font-green');
    } else {
      changeEl.innerText = `Insufficient`;
      changeEl.classList.remove('font-green');
      changeEl.classList.add('font-red');
    }
  }
}

function applyDiscountPrompt() {
  const input = prompt(
    "Set Cart Discount:\n\n" +
    "• Enter a percentage (e.g. '10%' or '20%')\n" +
    "• Enter a fixed peso amount (e.g. '50' or '100')\n" +
    "• Or enter preset code: 'SENIOR10' / 'PROMO20'"
  );

  if (!input) return;

  const cleanInput = input.trim();

  if (cleanInput.toUpperCase() === 'SENIOR10') {
    appState.activeDiscount = { type: 'percent', percent: 10, fixedAmount: 0, label: "Senior Citizen (10%)" };
  } else if (cleanInput.toUpperCase() === 'PROMO20') {
    appState.activeDiscount = { type: 'percent', percent: 20, fixedAmount: 0, label: "Promo (20%)" };
  } else if (cleanInput.endsWith('%')) {
    const val = parseFloat(cleanInput.replace('%', ''));
    if (isNaN(val) || val < 0 || val > 100) return showToast("Invalid percentage!", "error");
    appState.activeDiscount = { type: 'percent', percent: val, fixedAmount: 0, label: `${val}% OFF` };
  } else {
    const val = parseFloat(cleanInput);
    if (isNaN(val) || val < 0) return showToast("Invalid discount amount!", "error");
    appState.activeDiscount = { type: 'fixed', percent: 0, fixedAmount: val, label: `₱${val.toFixed(2)} OFF` };
  }

  renderCart();
  showToast("Discount applied successfully!");
}

function removeDiscount() {
  appState.activeDiscount = { type: "none", percent: 0, fixedAmount: 0, label: "None" };
  renderCart();
  showToast("Discount removed");
}

// ==========================================
// 6. CHECKOUT & PRINT ENGINE
// ==========================================

function processCheckout() {
  if (appState.cart.length === 0) return showToast("Cart is empty!", "error");

  const totalStr = document.getElementById('cart-total').innerText.replace('₱', '');
  const grandTotal = parseFloat(totalStr) || 0;
  const cashPaid = parseFloat(document.getElementById('cash-tendered').value) || 0;

  if (cashPaid < grandTotal) return showToast("Tendered cash is less than Grand Total!", "error");

  appState.cart.forEach(cartItem => {
    const prod = appState.products.find(p => p.id === cartItem.id);
    if (prod) prod.stock -= cartItem.qty;
  });
  StorageEngine.saveProducts();

  const orderRef = `#TRX-${Math.floor(100000 + Math.random() * 900000)}`;
  const orderRecord = {
    id: orderRef,
    timestamp: new Date().toLocaleString(),
    customer: document.getElementById('customer-name')?.value || 'Walk-in Guest',
    type: document.getElementById('order-type-select')?.value || 'Dine-In',
    items: [...appState.cart],
    total: grandTotal,
    cashPaid,
    change: cashPaid - grandTotal,
    cashier: appState.currentUser ? appState.currentUser.name : 'System'
  };

  appState.sales.push(orderRecord);
  StorageEngine.saveSales();

  populateNativeReceipt(orderRecord);
  window.print();

  showToast("Order Completed Successfully!", "success");
  clearCart();
  renderProductsCatalog();
}

function populateNativeReceipt(order) {
  const cfg = appState.receiptConfig;
  if (document.getElementById('print-store-name')) document.getElementById('print-store-name').innerText = cfg.storeName;
  if (document.getElementById('print-store-address')) document.getElementById('print-store-address').innerText = cfg.address;
  if (document.getElementById('print-store-tin')) document.getElementById('print-store-tin').innerText = cfg.tin;
  if (document.getElementById('print-order-ref')) document.getElementById('print-order-ref').innerText = order.id;
  if (document.getElementById('print-date')) document.getElementById('print-date').innerText = order.timestamp;
  if (document.getElementById('print-cashier')) document.getElementById('print-cashier').innerText = order.cashier;
  if (document.getElementById('print-customer')) document.getElementById('print-customer').innerText = order.customer;
  if (document.getElementById('print-order-type')) document.getElementById('print-order-type').innerText = order.type;

  const itemsList = document.getElementById('print-items-list');
  if (itemsList) {
    itemsList.innerHTML = order.items.map(item => `
      <div class="receipt-line">
        <span>${item.name} (x${item.qty})</span>
        <span>₱${(item.price * item.qty).toFixed(2)}</span>
      </div>
      <div class="receipt-addon-line">+ ${item.addon}</div>
    `).join('');
  }

  if (document.getElementById('print-total')) document.getElementById('print-total').innerText = `₱${order.total.toFixed(2)}`;
  if (document.getElementById('print-cash')) document.getElementById('print-cash').innerText = `₱${order.cashPaid.toFixed(2)}`;
  if (document.getElementById('print-change')) document.getElementById('print-change').innerText = `₱${order.change.toFixed(2)}`;
  if (document.getElementById('print-footer-msg')) document.getElementById('print-footer-msg').innerText = cfg.footerMsg;
}

// ==========================================
// 7. ADMIN DASHBOARD & EXPORT ENGINE
// ==========================================

function renderAnalytics() {
  const todaySales = appState.sales.reduce((sum, s) => sum + s.total, 0);
  const totalOrders = appState.sales.length;
  const avgOrder = totalOrders > 0 ? todaySales / totalOrders : 0;
  const totalStock = appState.products.reduce((sum, p) => sum + p.stock, 0);
  const lowStockCount = appState.products.filter(p => p.stock <= 5).length;

  if (document.getElementById('kpi-today-sales')) document.getElementById('kpi-today-sales').innerText = `₱${todaySales.toFixed(2)}`;
  if (document.getElementById('kpi-today-orders')) document.getElementById('kpi-today-orders').innerText = totalOrders;
  if (document.getElementById('kpi-avg-order')) document.getElementById('kpi-avg-order').innerText = `₱${avgOrder.toFixed(2)}`;
  if (document.getElementById('kpi-total-stock')) document.getElementById('kpi-total-stock').innerText = totalStock;
  if (document.getElementById('kpi-low-stock-alert')) document.getElementById('kpi-low-stock-alert').innerText = `${lowStockCount} items critical low stock`;

  renderSalesChart();
  renderSalesHistoryTable();
}

function renderSalesChart() {
  const container = document.getElementById('sales-bar-chart');
  if (!container) return;
  container.innerHTML = '';

  const hours = ['8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM'];
  hours.forEach(hr => {
    const randomHeight = Math.floor(Math.random() * 80) + 20;
    const group = document.createElement('div');
    group.className = 'chart-bar-group';
    group.innerHTML = `
      <div class="chart-bar" style="height: ${randomHeight}%;"></div>
      <span class="chart-label">${hr}</span>
    `;
    container.appendChild(group);
  });
}

function renderSalesHistoryTable() {
  const tbody = document.getElementById('sales-history-tbody');
  if (!tbody) return;
  if (!appState.sales.length) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;">No sales recorded yet.</td></tr>`;
    return;
  }
  tbody.innerHTML = appState.sales.map(s => `
    <tr>
      <td><strong>${s.id}</strong></td>
      <td>${s.timestamp}</td>
      <td>${s.customer}</td>
      <td>${s.type}</td>
      <td>${s.items.map(i => `${i.name}(${i.qty})`).join(', ')}</td>
      <td class="font-green"><strong>₱${s.total.toFixed(2)}</strong></td>
      <td>${s.cashier}</td>
      <td><button class="btn btn-xs btn-secondary" onclick="reprintOrder('${s.id}')">Print</button></td>
    </tr>
  `).join('');
}

function exportSalesToCSV() {
  if (!appState.sales.length) return showToast("No sales data available to export!", "error");

  const headers = ["Order ID", "Timestamp", "Customer", "Type", "Items Summary", "Total Amount (PHP)", "Cash Tendered", "Change Due", "Cashier"];
  const rows = appState.sales.map(s => [
    `"${s.id}"`,
    `"${s.timestamp}"`,
    `"${s.customer}"`,
    `"${s.type}"`,
    `"${s.items.map(i => `${i.name} x${i.qty}`).join(' | ')}"`,
    s.total.toFixed(2),
    s.cashPaid.toFixed(2),
    s.change.toFixed(2),
    `"${s.cashier}"`
  ]);

  const csvContent = "data:text/csv;charset=utf-8," 
    + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `TEMPTEA_Sales_Report_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast("CSV Sales Report Downloaded!", "success");
}

function exportSalesToExcel() {
  if (!appState.sales.length) return showToast("No sales data available to export!", "error");

  let xmlString = `<?xml version="1.0"?>
  <?mso-application progid="Excel.Sheet"?>
  <Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
            xmlns:o="urn:schemas-microsoft-com:office:office"
            xmlns:x="urn:schemas-microsoft-com:office:excel"
            xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
    <Worksheet ss:Name="Sales Report">
      <Table>
        <Row>
          <Cell><Data ss:Type="String">Order ID</Data></Cell>
          <Cell><Data ss:Type="String">Timestamp</Data></Cell>
          <Cell><Data ss:Type="String">Customer</Data></Cell>
          <Cell><Data ss:Type="String">Order Type</Data></Cell>
          <Cell><Data ss:Type="String">Items Purchased</Data></Cell>
          <Cell><Data ss:Type="String">Total Amount (₱)</Data></Cell>
          <Cell><Data ss:Type="String">Cash Received (₱)</Data></Cell>
          <Cell><Data ss:Type="String">Change (₱)</Data></Cell>
          <Cell><Data ss:Type="String">Cashier</Data></Cell>
        </Row>`;

  appState.sales.forEach(s => {
    const itemsSummary = s.items.map(i => `${i.name} (${i.qty})`).join(', ');
    xmlString += `
        <Row>
          <Cell><Data ss:Type="String">${s.id}</Data></Cell>
          <Cell><Data ss:Type="String">${s.timestamp}</Data></Cell>
          <Cell><Data ss:Type="String">${s.customer}</Data></Cell>
          <Cell><Data ss:Type="String">${s.type}</Data></Cell>
          <Cell><Data ss:Type="String">${itemsSummary}</Data></Cell>
          <Cell><Data ss:Type="Number">${s.total}</Data></Cell>
          <Cell><Data ss:Type="Number">${s.cashPaid}</Data></Cell>
          <Cell><Data ss:Type="Number">${s.change}</Data></Cell>
          <Cell><Data ss:Type="String">${s.cashier}</Data></Cell>
        </Row>`;
  });

  xmlString += `
      </Table>
    </Worksheet>
  </Workbook>`;

  const blob = new Blob([xmlString], { type: 'application/vnd.ms-excel' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `TEMPTEA_Database_${new Date().toISOString().slice(0, 10)}.xls`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast("Excel Database Downloaded!", "success");
}

// ==========================================
// 8. INVENTORY & PRODUCT MANAGEMENT
// ==========================================

function renderInventoryTable() {
  const tbody = document.getElementById('inventory-tbody');
  if (!tbody) return;
  tbody.innerHTML = appState.products.map(p => `
    <tr>
      <td><code>SKU-${p.id}</code></td>
      <td>
        ${p.image ? `<img src="${p.image}" class="table-thumb" />` : p.icon} 
        <strong>${p.name}</strong>
      </td>
      <td>${p.category}</td>
      <td><strong>${p.stock}</strong></td>
      <td><span class="badge ${p.stock > 10 ? 'badge-cashier' : 'badge-admin'}">${p.stock > 10 ? 'HEALTHY' : 'LOW STOCK'}</span></td>
      <td>
        <button class="btn btn-xs btn-secondary" onclick="adjustStock(${p.id}, -5)">-5</button>
        <button class="btn btn-xs btn-secondary" onclick="adjustStock(${p.id}, 5)">+5</button>
        <button class="btn btn-xs btn-secondary" onclick="adjustStock(${p.id}, 20)">+20</button>
      </td>
      <td><button class="btn btn-xs btn-danger-outline" onclick="deleteProduct(${p.id})">Remove</button></td>
    </tr>
  `).join('');
}

function adjustStock(productId, amount) {
  const prod = appState.products.find(p => p.id === productId);
  if (prod) {
    prod.stock = Math.max(0, prod.stock + amount);
    StorageEngine.saveProducts();
    renderInventoryTable();
    renderProductsCatalog();
  }
}

function bulkRestock() {
  appState.products.forEach(p => p.stock += 10);
  StorageEngine.saveProducts();
  renderInventoryTable();
  renderProductsCatalog();
  showToast("Restocked +10 units to all items!");
}

function renderAdminProductsTable() {
  const tbody = document.getElementById('admin-product-tbody');
  if (!tbody) return;
  tbody.innerHTML = appState.products.map(p => `
    <tr>
      <td>
        ${p.image ? `<img src="${p.image}" class="table-thumb" />` : p.icon} 
        ${p.name}
      </td>
      <td>${p.category}</td>
      <td>₱${p.price.toFixed(2)}</td>
      <td>
        <button class="btn btn-xs btn-secondary" onclick="editProduct(${p.id})">Edit</button>
      </td>
    </tr>
  `).join('');
}

function handleProductFormSubmit(e) {
  e.preventDefault();
  const editId = document.getElementById('edit-product-id').value;
  const name = document.getElementById('prod-name').value;
  const price = parseFloat(document.getElementById('prod-price').value);
  const stock = parseInt(document.getElementById('prod-stock').value);
  const category = document.getElementById('prod-category').value;
  const icon = document.getElementById('prod-icon').value || '🍹';
  const addonsRaw = document.getElementById('prod-addons').value;
  const addons = addonsRaw ? addonsRaw.split(',').map(a => a.trim()) : [];

  if (editId) {
    const prod = appState.products.find(p => p.id === parseInt(editId));
    if (prod) {
      prod.name = name;
      prod.price = price;
      prod.stock = stock;
      prod.category = category;
      prod.icon = icon;
      prod.addons = addons;
      if (appState.uploadedImageBase64) prod.image = appState.uploadedImageBase64;
    }
  } else {
    const newProd = {
      id: Date.now(),
      name, 
      price, 
      stock, 
      category, 
      icon, 
      image: appState.uploadedImageBase64,
      addons
    };
    appState.products.push(newProd);
  }

  StorageEngine.saveProducts();
  e.target.reset();
  appState.uploadedImageBase64 = "";
  document.getElementById('edit-product-id').value = '';
  renderAdminProductsTable();
  renderProductsCatalog();
  showToast("Product saved successfully!");
}

function editProduct(id) {
  const prod = appState.products.find(p => p.id === id);
  if (!prod) return;

  document.getElementById('edit-product-id').value = prod.id;
  document.getElementById('prod-name').value = prod.name;
  document.getElementById('prod-price').value = prod.price;
  document.getElementById('prod-stock').value = prod.stock;
  document.getElementById('prod-category').value = prod.category;
  document.getElementById('prod-icon').value = prod.icon;
  document.getElementById('prod-addons').value = prod.addons.join(', ');

  showToast(`Editing ${prod.name}`);
}

function deleteProduct(id) {
  if (confirm("Delete this product permanently?")) {
    appState.products = appState.products.filter(p => p.id !== id);
    StorageEngine.saveProducts();
    renderInventoryTable();
    renderAdminProductsTable();
    renderProductsCatalog();
  }
}

// ==========================================
// 9. RECEIPT & SYSTEM UTILITIES
// ==========================================

function updateReceiptPreview() {
  const cfg = appState.receiptConfig;
  if (document.getElementById('prev-store-name')) document.getElementById('prev-store-name').innerText = cfg.storeName;
  if (document.getElementById('prev-store-address')) document.getElementById('prev-store-address').innerText = cfg.address;
  if (document.getElementById('prev-store-tin')) document.getElementById('prev-store-tin').innerText = cfg.tin;
  if (document.getElementById('prev-footer-msg')) document.getElementById('prev-footer-msg').innerText = cfg.footerMsg;
}

if (typeof window !== 'undefined') {
  document.getElementById('receipt-config-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    appState.receiptConfig = {
      storeName: document.getElementById('cfg-store-name').value,
      address: document.getElementById('cfg-store-address').value,
      tin: document.getElementById('cfg-store-tin').value,
      footerMsg: document.getElementById('cfg-footer-msg').value
    };
    StorageEngine.saveReceiptConfig();
    updateReceiptPreview();
    showToast("Receipt Template Updated!");
  });
}

function renderOrdersLog() {
  const tbody = document.getElementById('orders-log-tbody');
  if (!tbody) return;
  tbody.innerHTML = appState.sales.map(s => `
    <tr>
      <td><strong>${s.id}</strong></td>
      <td>${s.timestamp}</td>
      <td>${s.customer}</td>
      <td>${s.type}</td>
      <td>${s.items.map(i => `${i.name} (x${i.qty})`).join(', ')}</td>
      <td>₱${s.total.toFixed(2)}</td>
      <td>₱${s.cashPaid.toFixed(2)}</td>
      <td>₱${s.change.toFixed(2)}</td>
      <td><button class="btn btn-xs btn-secondary" onclick="reprintOrder('${s.id}')">Receipt</button></td>
    </tr>
  `).join('');
}

function reprintOrder(orderId) {
  const order = appState.sales.find(s => s.id === orderId);
  if (order) {
    populateNativeReceipt(order);
    window.print();
  }
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerText = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// ==========================================
// 10. WEEK 3: RESTFUL API STUB HANDLERS
// ==========================================

// If executing in Node.js server context, register HTTP routes
if (typeof require !== 'undefined' && typeof process !== 'undefined') {
  try {
    const express = require('express');
    const app = express();
    const PORT = process.env.PORT || 3002;

    app.use(express.json());

    // PRODUCTS STUBS
    app.get('/products', (req, res) => {
      res.status(200).json({ status: 200, data: appState.products, error: null });
    });

    app.get('/products/:id', (req, res) => {
      const { id } = req.params;
      res.status(200).json({ status: 200, data: { message: "getProductById stub", id }, error: null });
    });

    app.post('/products', (req, res) => {
      res.status(201).json({ status: 201, data: { message: "createProduct stub", received: req.body }, error: null });
    });

    app.put('/products/:id', (req, res) => {
      const { id } = req.params;
      res.status(200).json({ status: 200, data: { message: "updateProduct stub", id, updated: req.body }, error: null });
    });

    app.delete('/products/:id', (req, res) => {
      const { id } = req.params;
      res.status(200).json({ status: 200, data: { message: "deleteProduct stub", id }, error: null });
    });

    // ORDERS STUBS
    app.get('/orders', (req, res) => {
      res.status(200).json({ status: 200, data: appState.sales, error: null });
    });

    app.get('/orders/:id', (req, res) => {
      const { id } = req.params;
      res.status(200).json({ status: 200, data: { message: "getOrderById stub", id }, error: null });
    });

    app.post('/orders', (req, res) => {
      res.status(201).json({ status: 201, data: { message: "createOrder stub", received: req.body }, error: null });
    });

    app.put('/orders/:id', (req, res) => {
      const { id } = req.params;
      res.status(200).json({ status: 200, data: { message: "updateOrder stub", id, updated: req.body }, error: null });
    });

    app.delete('/orders/:id', (req, res) => {
      const { id } = req.params;
      res.status(200).json({ status: 200, data: { message: "deleteOrder stub", id }, error: null });
    });

    // CUSTOMERS STUBS (Assigned to Janila)
    app.get('/customers', (req, res) => {
      res.status(200).json({ status: 200, data: [], error: null });
    });

    app.get('/customers/:id', (req, res) => {
      const { id } = req.params;
      res.status(200).json({ status: 200, data: { message: "getCustomerById stub", id }, error: null });
    });

    app.post('/customers', (req, res) => {
      res.status(201).json({ status: 201, data: { message: "createCustomer stub", received: req.body }, error: null });
    });

    app.put('/customers/:id', (req, res) => {
      const { id } = req.params;
      res.status(200).json({ status: 200, data: { message: "updateCustomer stub", id, updated: req.body }, error: null });
    });

    app.delete('/customers/:id', (req, res) => {
      const { id } = req.params;
      res.status(200).json({ status: 200, data: { message: "deleteCustomer stub", id }, error: null });
    });

    // STAFF STUBS (Assigned to Norie & Rome)
    app.get('/staff', (req, res) => {
      res.status(200).json({ status: 200, data: [], error: null });
    });

    app.get('/staff/:id', (req, res) => {
      const { id } = req.params;
      res.status(200).json({ status: 200, data: { message: "getStaffById stub", id }, error: null });
    });

    app.post('/staff', (req, res) => {
      res.status(201).json({ status: 201, data: { message: "createStaff stub", received: req.body }, error: null });
    });

    app.put('/staff/:id', (req, res) => {
      const { id } = req.params;
      res.status(200).json({ status: 200, data: { message: "updateStaff stub", id, updated: req.body }, error: null });
    });

    app.delete('/staff/:id', (req, res) => {
      const { id } = req.params;
      res.status(200).json({ status: 200, data: { message: "deleteStaff stub", id }, error: null });
    });

    if (require.main === module) {
      app.listen(PORT, () => {
        console.log(`TEMPTEA POS API Server running on port ${PORT}`);
      });
    }
  } catch (err) {
    // Client browser context, Express server setup ignored
  }
}