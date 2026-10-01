# Comprehensive QA Test Matrix (Week 10)

This matrix records the systematic manual QA passes across all 4 record types and app features, testing across 5 scenario categories: Happy Path, Boundary Value, Invalid Payload, Empty State, and Security/Permissions.

---

## 1. Feature × Scenario Test Execution Grid

| Feature / Module | Happy Path | Boundary Value | Invalid Payload | Empty State | Security / Permissions |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Product Catalog (Create)** | **PASS** (Item added) | **PASS** (Price = $0.01) | **FAIL -> BUG-01** (Negative price submitted) | **PASS** (Shows 422 inline) | **PASS** (Admin key required) |
| **Product Catalog (Update)** | **PASS** (Price saved) | **PASS** (Stock = 0) | **PASS** (Rejects string in price) | **PASS** (No field changes) | **PASS** (Admin key required) |
| **POS Order Checkout** | **PASS** (Order completed) | **PASS** (100 items added) | **FAIL -> BUG-02** (Rapid double-click duplicate submit) | **PASS** (Submit disabled when empty) | **PASS** (Cashier session active) |
| **Customer Loyalty Search** | **PASS** (Phone found) | **PASS** (10-digit number) | **PASS** (Special chars stripped) | **PASS** (Displays "No Account Found") | **PASS** (Accessible to staff) |
| **Loyalty Point Redemption** | **PASS** (Points deducted) | **PASS** (Redeem exact balance) | **PASS** (Blocks excess point redeem) | **PASS** (0 balance state) | **PASS** (Cashier session active) |
| **Staff Profile / Shift Setup** | **PASS** (Cashier created) | **PASS** (4-digit PIN setup) | **PASS** (Rejects 2-digit PIN) | **PASS** (Empty field check) | **PASS** (Admin passkey required) |
| **Order Void / Cancellation** | **PASS** (Transaction voided) | **PASS** (Void recent order) | **PASS** (Rejects wrong passkey) | **N/A** | **PASS** (Admin approval prompt) |

---

## 2. Adversarial Breakage Test Suite (Task 4)

| Test ID | Adversarial Vector | Action / Input | Observed Result | Verdict |
| :--- | :--- | :--- | :--- | :--- |
| **ADV-01** | Script Injection | Entered `<script>alert("xss")</script>` in product name | Text properly escaped in DOM; rendered as plain text | **PASS** |
| **ADV-02** | Rapid Double-Click | Double-clicked "Complete Order" rapidly | Triggered double POST request before lock was applied | **FAIL (Logged as BUG-02)** |
| **ADV-03** | Invalid Direct URL | Navigated directly to `/products/999999` | Rendered clean 404 empty state card with retry link | **PASS** |
| **ADV-04** | Offline Disconnect | Disabled network mid-submit | Displayed amber toast "Network Disconnected"; UI retained cart state | **PASS** |
| **ADV-05** | Weird Input | Entered Emoji `🧋🧋` and huge numbers (`99999999`) | Handled gracefully without DB truncation crash | **PASS** |