# Asynchronous Feedback & Error Handling Matrix

This document defines the user feedback states, HTTP error mappings, and human-readable UI notifications for all asynchronous operations in the TEMPTEA POS application.

---

## 1. Global Feedback Rules & UI States

| State | Visual Behavior | Trigger / Condition |
| :--- | :--- | :--- |
| **Loading** | Disables trigger buttons, displays inline spinner or skeleton UI, sets cursor to `wait`. | Fired immediately upon initiating any `async` controller action or fetch request. |
| **Success** | Shows green toast banner (auto-dismisses after 3s), resets form inputs, updates DOM views asynchronously without full reload. | Fired upon receiving 200 OK or 201 Created status. |
| **Validation Error (422)** | Highlights invalid inputs with red borders, displays inline error text beneath inputs. | Server returns HTTP 422 with input field error details. |
| **Not Found (404)** | Displays clean empty-state card with recovery button (e.g., "Return to Catalog"). | Requested resource ID does not exist. |
| **Server Error (500)** | Displays global alert banner with human-friendly message; hides raw stack traces/status codes. | Server throws uncaught exception or DB connection failure. |
| **Network Failure** | Displays persistent amber status banner ("Network Connection Lost. Reconnecting..."). | Client offline or server unreachable (fetch rejection). |

---

## 2. Feature-Specific Error & Feedback Mapping

### Record Type 1: Products & Inventory (Benjie Pahamutang - Lead)
* **Create/Update Product:**
  * *422 Unprocessable:* "Price and stock quantity must be positive numbers."
  * *404 Not Found:* "The selected product could no longer be found in the catalog."
  * *500 / Network:* "Unable to save product changes right now. Please verify your connection and try again."

### Record Type 2: Sales Transactions / Orders (Mekyla Bagaporo)
* **Checkout / Order Submission:**
  * *422 Unprocessable:* "Please select at least one item before submitting an order."
  * *404 Not Found:* "One or more selected items are no longer available in stock."
  * *500 / Network:* "Transaction processing failed. No payment was charged. Please retry."

### Record Type 3: Customer Loyalty Accounts (Janila Harina Mino)
* **Loyalty Search & Point Redemption:**
  * *422 Unprocessable:* "Insufficient point balance for this reward redemption."
  * *404 Not Found:* "No customer account registered with that mobile number."
  * *500 / Network:* "Loyalty system is temporarily unreachable."

### Record Type 4: User Profiles & Shifts (Norie Jhon Cepriano & Rome Jean Quistorio)
* **Authentication & PIN Reset:**
  * *422 Unprocessable:* "PIN must be at least 4 digits." / "Current PIN entered is incorrect."
  * *404 Not Found:* "Staff profile not found."
  * *500 / Network:* "Authentication service unavailable."