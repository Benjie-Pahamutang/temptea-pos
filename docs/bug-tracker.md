# Triaged Bug List & Reproduction Tracker

This document tracks all defects uncovered during Week 10 adversarial testing. Issues are triaged by severity (**P0**, **P1**, **P2**) to be resolved during Week 11 deployment preparation.

---

## Issue Log

### BUG-01: Product Form Allows Negative Price Submission (P0)
* **Severity:** **P0 (Critical — Core Data Integrity)**
* **Assigned Owner:** Benjie Pahamutang
* **Steps to Reproduce:**
  1. Navigate to Admin Product Creation Form.
  2. Enter Product Name: `"Matcha Latte"`, Stock: `10`.
  3. Enter Price: `-15.00`.
  4. Click "Save Product".
* **Expected Outcome:** UI catches negative price and displays inline 422 error "Price must be greater than $0.00".
* **Actual Outcome:** Form submits successfully and creates item with negative pricing in database catalog.
* **Status:** **Triaged for Week 11 Fix**

---

### BUG-02: Double-Clicking Checkout Button Creates Duplicate Orders (P1)
* **Severity:** **P1 (High — Significant Financial Impact)**
* **Assigned Owner:** Mekyla Bagaporo
* **Steps to Reproduce:**
  1. Add items to cart in POS interface.
  2. Rapidly double-click the "Complete Payment" button.
* **Expected Outcome:** Submit button disables on first click; single order transaction processes.
* **Actual Outcome:** Button triggers two asynchronous POST requests, creating duplicate transaction records with identical items.
* **Status:** **Triaged for Week 11 Fix**

---

### BUG-03: Toast Notification Timer Overlaps on Rapid Errors (P2)
* **Severity:** **P2 (Minor — Polish / UI Glitch)**
* **Assigned Owner:** Janila Harina Mino
* **Steps to Reproduce:**
  1. Trigger 3 validation errors in rapid succession on form fields.
* **Expected Outcome:** Toasts stack neatly or update text dynamically.
* **Actual Outcome:** Toast alert flashes rapidly and dismisses prematurely after 1 second.
* **Status:** **Triaged for Week 11 Fix**

# Triaged Bug List & Resolution Log (Week 11 Update)

This document tracks all defects uncovered during Week 10 testing and their official resolutions completed in Week 11 prior to production deployment.

---

## Resolved Bug Log

### BUG-01: Product Form Allows Negative Price Submission (P0)
* **Severity:** **P0 (Critical — Core Data Integrity)**[cite: 15]
* **Assigned Owner:** Benjie Pahamutang
* **Fix Summary:** Added strict server-side validation checks in `productController.js` enforcing `price >= 0` and returning HTTP 422 for negative values. Attached regression test in `tests/unit/productValidation.test.js`.
* **Status:** **RESOLVED**

---

### BUG-02: Double-Clicking Checkout Button Creates Duplicate Orders (P1)
* **Severity:** **P1 (High — Financial Impact)**[cite: 15]
* **Assigned Owner:** Mekyla Bagaporo
* **Fix Summary:** Added UI submit guard setting `button.disabled = true` and toggling pending state spinner on initial submit event. Re-enables button upon receiving response[cite: 6].
* **Status:** **RESOLVED**

---

### BUG-03: Toast Notification Timer Overlaps on Rapid Errors (P2)
* **Severity:** **P2 (Minor — Polish / UI Glitch)**[cite: 15]
* **Assigned Owner:** Janila Harina Mino
* **Fix Summary:** Centralized toast lifecycle management in `feedbackHelper.js` to clear existing active timeout instances before rendering new notifications.
* **Status:** **RESOLVED**

---

## Technical Debt Refactoring (Task 2)
1. **Refactored Fat Controller:** Extracted repeated JSON response formatting helper routines out of API routes into a centralized `responseHandler.js` middleware.
2. **Duplicated Input Sanitization:** Created a shared `sanitizeInput()` utility function reused across both Product and Customer Loyalty creation forms[cite: 16].