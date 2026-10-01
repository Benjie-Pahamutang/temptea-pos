# Live Production Deployment & Smoke Test Documentation

This document records the production hosting configuration, environment variables, and live smoke test verification for the TEMPTEA POS application.

---

## 1. Live Production Details

* **Live Public URL:** `https://temptea-pos.onrender.com`[cite: 9, 16]
* **Hosting Platform:** Render (Web Service)[cite: 9, 16]
* **Deployment Branch:** `main` (automatic build & deploy on push)[cite: 16]
* **Environment:** `NODE_ENV=production`, `APP_DEBUG=false`[cite: 16]

---

## 2. Production Environment Variable Configuration

| Variable Name | Value / Purpose | Host Secret Status |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Configured on Render Dashboard[cite: 16] |
| `APP_DEBUG` | `false` | Configured on Render Dashboard (Stack traces disabled) |
| `PORT` | Dynamic (`10000`) | Managed automatically by Render[cite: 16] |
| `DATABASE_URL` | MongoDB Atlas Production String | Stored securely in Render Environment Secrets[cite: 10, 16] |
| `ADMIN_SECRET` | 256-bit secure hash key | Stored securely in Render Environment Secrets[cite: 10, 16] |

---

## 3. Live Smoke Test Results (Task 5)

Smoke tests executed directly against the public URL (`https://temptea-pos.onrender.com`)[cite: 16]:

| Test Case | Public Route / Scenario | Action Performed | Live Behavior | Status |
| :--- | :--- | :--- | :--- | :--- |
| **ST-01** | **Happy Path — Create** | Created new item `"Oolong Tea"` ($4.50, Stock: 50) via Admin View | Record created in MongoDB; appended immediately to UI without reload | **PASS**[cite: 16] |
| **ST-02** | **Happy Path — View** | Navigated to POS Catalog View | Catalog loaded live items from production database cleanly | **PASS**[cite: 16] |
| **ST-03** | **Happy Path — Update** | Edited price of `"Oolong Tea"` to $5.00 | Updated value persisted and refreshed live view | **PASS**[cite: 16] |
| **ST-04** | **Happy Path — Delete** | Voided/archived item from catalog | Confirmation modal displayed; item archived from active list | **PASS**[cite: 16] |
| **ST-05** | **Failure Path — 422 Error** | Submitted product form with negative price (`-$3.00`) | App displayed inline red error: *"Price must be a positive number"* (No crash) | **PASS**[cite: 16] |
| **ST-06** | **Failure Path — 404 Route** | Attempted navigation to `/api/products/99999` | Rendered structured 404 empty card; zero stack traces exposed | **PASS**[cite: 10, 16] |