# UI Component Architecture & Mapping

This document outlines the reusable UI components used to construct the views for the TEMPTEA POS system, mapped directly to screen assignments and backlog items.

---

## 1. Reusable Components

| Component Name | File / Selector | Description & Responsibilities |
| :--- | :--- | :--- |
| **Navbar & Header** | `<header class="app-header">` | Global navigation bar showing app title, cashier PIN profile status, and clock out button. |
| **Product Card Grid / Row** | `.product-card`, `.product-row` | Displays drink item image, price, stock level indicator, and quick-add button. |
| **Order Cart Item* | `.cart-item` | Single item row in the checkout drawer with quantity controls (+/-), customization tags (sweetness, ice, toppings), and remove button. |
| **Form Group & Input* | `.form-group` | Labeled input wrapper supporting validation error states, help text, and inline 422 error highlighting. |
| **Status Badge* | `.badge` | Color-coded status indicator for inventory levels (*In Stock*, *Low Stock*, *Out of Stock*) and cashier shift status (*Clocked In*, *Off Shift*). |
| **Modal Dialog* | `.modal-overlay` | Reusable popup container for destructive action confirmations (e.g., Void Order, Deactivate Staff, Delete Product). |
| **Feedback Banner / Alert** | `.alert-banner` | Toast/Banner message container for success notifications, 404 missing states, and 500 server error notices. |
| **Skeleton Loader / Spinner** | `.loading-spinner`, `.skeleton-card` | Placeholder UI displayed while asynchronous controllers fetch or process data. |

---

## 2. Screen-to-Component Mapping

### Screen 1: User Authentication / PIN Entry
* **Assigned Owner:** Benjie Pahamutang (Lead Developer)
* **Components Used:**
  * App Header (minimal state)
  * Form Group & PIN Pad Input Buttons
  * Feedback Banner (Invalid PIN alert / rate-limit state)
  * Skeleton Loader (authenticating state)

### Screen 2: POS Ordering Interface
* **Assigned Owner:** Mekyla Bagaporo
* **Components Used:**
  * Navbar & Header
  * Product Card Grid
  * Order Cart Item List
  * Status Badge (stock indicator)
  * Feedback Banner (Empty cart alert)

### Screen 3: Dashboard Analytics & Sales Metrics
* **Assigned Owner:** Benjie Pahamutang
* **Components Used:**
  * Navbar & Header
  * Metrics Card Grid
  * Status Badge
  * Skeleton Loader (chart/metrics loading state)

### Screen 4: Product Catalog Management
* **Assigned Owner:** Benjie Pahamutang
* **Components Used:**
  * Navbar & Header
  * Product Row List Table
  * Status Badge (inventory alerts)
  * Feedback Banner (Empty catalog state)
  * Modal Dialog (Archive confirmation)

### Screen 5: Product Creation & Form Validation
* **Assigned Owner:** Benjie Pahamutang
* **Components Used:**
  * Navbar & Header
  * Form Group & Input (with 422 validation binding)
  * Feedback Banner (Success / Validation error)

### Screen 6: Receipt Generation & Printing
* **Assigned Owner:** Mekyla Bagaporo
* **Components Used:**
  * Navbar & Header
  * Order Cart Item Summary
  * Modal Dialog (Print preview)

### Screen 7: Security Alert & Role Access Control
* **Assigned Owner:** Rome Jean Quistorio
* **Components Used:**
  * Navbar & Header
  * Modal Dialog (Admin Passkey Prompt)
  * Feedback Banner (Access Denied / 403 error)

### Screen 8: Transaction & Order History Logs
* **Assigned Owner:** Janila Harina Mino & Norie Jhon Cepriano
* **Components Used:**
  * Navbar & Header
  * Order Row Table
  * Status Badge (Paid, Voided, Refunded)
  * Skeleton Loader (Log fetch state)
