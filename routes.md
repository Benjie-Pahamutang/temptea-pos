# TEMPTEA POS - Routing Table

| HTTP Method | Endpoint / Path | Handler Name | User Story / Description | Owner |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/products` | `getProducts` | Retrieve all tea/beverage items | Benjie |
| `GET` | `/products/:id` | `getProductById` | Retrieve single product details | Benjie |
| `POST` | `/products` | `createProduct` | Add a new menu item | Benjie |
| `PUT` | `/products/:id` | `updateProduct` | Update product details/price | Benjie |
| `DELETE` | `/products/:id` | `deleteProduct` | Remove a product from menu | Benjie |
| `GET` | `/orders` | `getOrders` | Retrieve all customer orders | Mekyla |
| `GET` | `/orders/:id` | `getOrderById` | Retrieve a specific order receipt | Mekyla |
| `POST` | `/orders` | `createOrder` | Place a new POS order | Mekyla |
| `PUT` | `/orders/:id` | `updateOrder` | Update order status or items | Mekyla |
| `DELETE` | `/orders/:id` | `deleteOrder` | Void an active order | Mekyla |
| `GET` | `/customers` | `getCustomers` | List loyalty program members | Janila |
| `GET` | `/customers/:id` | `getCustomerById` | View customer points & profile | Janila |
| `POST` | `/customers` | `createCustomer` | Register a new customer | Janila |
| `PUT` | `/customers/:id` | `updateCustomer` | Update customer details | Janila |
| `DELETE` | `/customers/:id` | `deleteCustomer` | Remove customer profile | Janila |
| `GET` | `/staff` | `getStaff` | View employee list | Norie/Rome |
| `GET` | `/staff/:id` | `getStaffById` | View employee details | Norie/Rome |
| `POST` | `/staff` | `createStaff` | Add new staff member | Norie/Rome |
| `PUT` | `/staff/:id` | `updateStaff` | Update employee role/info | Norie/Rome |
| `DELETE` | `/staff/:id` | `deleteStaff` | Deactivate staff account | Norie/Rome |

---

## Example API Responses (Payload Documentation)

### POST /products
* **Request Method:** `POST`
* **Request URL:** `http://localhost:3000/products`
* **Request Headers:** `Content-Type: application/json`
* **Request Body:**
```json
{
  "name": "Wintermelon Tea"
}