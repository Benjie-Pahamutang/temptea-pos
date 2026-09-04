# Product Backlog & CRUD User Stories

## Record Type 1: Products & Inventory Items (Owner: Benjie Pahamutang - Repo Lead)
* **CREATE:** As an Admin, I want to add a new tea/topping item with stock counts and prices so that it becomes available for ordering.
  * *Acceptance Criteria:* Form validates positive pricing/stock; item appears in POS catalog immediately upon submit.
* **READ (List):** As a Cashier, I want to view a catalog grid of all available drink products so that I can process customer selections.
  * *Acceptance Criteria:* Grid renders product images, prices, and stock indicators. Empty state shows "No Products Found".
* **READ (Detail):** As an Admin, I want to view an individual item's full stock history and recipe parameters so that I can audit inventory usage.
  * *Acceptance Criteria:* Displays item creation date, price history, and current stock levels.
* **UPDATE:** As an Admin, I want to edit product prices and top up stock quantities so that catalog data stays accurate.
  * *Acceptance Criteria:* Price changes save instantly; invalid entries (e.g., negative stock) show error banners.
* **DELETE:** As an Admin, I want to archive an obsolete product line with a confirmation check so that cashiers don't accidentally order discontinued items.
  * *Acceptance Criteria:* System displays a confirmation dialog "Are you sure you want to archive [Item Name]?"; soft-deletes record.

## Record Type 2: Sales Transactions / Orders (Owner: Mekyla Bagaporo - Builder 1)
* **CREATE:** As a Cashier, I want to build a customer order with drink customizations (sweetness, ice, toppings) so that I can calculate total prices.
  * *Acceptance Criteria:* Order summary updates live; receipt generates with unique Order ID upon payment completion.
* **READ (List):** As a Cashier, I want to view a list of open and completed daily orders so that I can track pending fulfillment.
  * *Acceptance Criteria:* List sorts orders by timestamp; empty state shows "No Active Orders for This Shift".
* **READ (Detail):** As a Cashier, I want to click an order to view its full breakdown of item customizations and tax calculations so that I can double-check accuracy.
  * *Acceptance Criteria:* Detail view displays itemized breakdown, payment method, and total breakdown.
* **UPDATE:** As a Cashier, I want to modify active unpaid orders before final payment so that I can adjust customer changes on the fly.
  * *Acceptance Criteria:* Items can be added or removed before payment; totals recalculate in real-time.
* **DELETE:** As an Admin, I want to void an erroneous transaction with mandatory supervisor authorization so that revenue records remain untampered.
  * *Acceptance Criteria:* Prompts for Admin passkey before order voiding; logs reason to audit trail.

## Record Type 3: Customer Loyalty Accounts (Owner: Janila Harina Mino - Builder 2)
* **CREATE:** As a Cashier, I want to register a new customer using their mobile number so that they can earn reward points.
  * *Acceptance Criteria:* Rejects duplicate mobile numbers; creates account with 0 initial points.
* **READ (List):** As a Cashier, I want to search and list loyalty accounts by phone number so that I can apply points quickly during checkout.
  * *Acceptance Criteria:* Instant filter as numbers are typed; empty state displays "No Customer Account Found".
* **READ (Detail):** As a Customer, I want to view my current point balance and redemption history so that I know what free drinks I qualify for.
  * *Acceptance Criteria:* Displays current point balance and chronological redemption log.
* **UPDATE:** As a Cashier, I want to redeem points or update customer contact details so that account data stays current.
  * *Acceptance Criteria:* Points deduct accurately; error state blocks redemption if point balance is insufficient.
* **DELETE:** As an Admin, I want to delete inactive customer profiles upon request with confirmation so that data privacy compliance is maintained.
  * *Acceptance Criteria:* Prompts "Permanently delete customer profile?"; wipes record upon confirmation.

## Record Type 4: User / Cashier Profiles (Owner: Norie Jhon Cepriano - Board Lead & Rome Jean Quistorio - Scribe)
* **CREATE:** As an Admin, I want to create new cashier accounts with PIN codes so that staff can log in to their shifts.
  * *Acceptance Criteria:* Securely stores credentials; enforces minimum 4-digit PIN setup.
* **READ (List):** As an Admin, I want to view all staff profiles and their current online/shift status so that I can manage staff schedules.
  * *Acceptance Criteria:* Lists staff name, role, status (Clocked In / Off Shift).
* **READ (Detail):** As an Admin, I want to open a cashier profile to review shift sales totals so that I can balance drawer cash end-of-day.
  * *Acceptance Criteria:* Renders drawer opening balance, cash collected, and total sales volume.
* **UPDATE:** As a Staff Member, I want to reset my PIN code so that my account remains secure.
  * *Acceptance Criteria:* Requires old PIN entry before approving new PIN.
* **DELETE:** As an Admin, I want to deactivate terminated staff accounts with confirmation so that unauthorized system access is prevented.
  * *Acceptance Criteria:* Deactivates login without deleting historic transaction logs tied to user ID.