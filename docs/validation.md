# Validation Matrix & Break-It Test Log

## Field Validation Matrix

| Endpoint | Method | Field | Validation Rule | Error Response Code | Error Payload Example |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/api/products` | `POST` | `name` | String, Required, Non-empty | `422 Unprocessable Entity` | `{"status":"error","error":"Invalid name"}` |
| `/api/products` | `POST` | `price` | Numeric, Positive (`> 0`) | `422 Unprocessable Entity` | `{"status":"error","error":"Price must be a positive number"}` |
| `/api/products` | `POST` | `stock` | Integer, Non-negative (`>= 0`) | `422 Unprocessable Entity` | `{"status":"error","error":"Stock must be a non-negative integer"}` |
| `/api/products/:id`| `DELETE` | `x-user-role`| Admin role required | `403 Forbidden` | `{"status":"error","error":"Admin access required"}` |

---

## Break-It Test Log

| Test Case | Payload / Condition Sent | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **String Price** | `{"price": "not-a-number"}` | Rejection with `422` | Rejected with `422` | **PASS** |
| **Negative Stock** | `{"stock": -5}` | Rejection with `422` | Rejected with `422` | **PASS** |
| **Missing Name** | `{"price": 10.0, "stock": 5}` | Rejection with `422` | Rejected with `422` | **PASS** |
| **Non-Admin Delete** | `DELETE /api/products/1` with `x-user-role: staff` | Rejection with `403` | Rejected with `403` | **PASS** |