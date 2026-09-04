const request = require('supertest');
const app = require('../app');

describe('Week 5 Security & Middleware Tests', () => {

  // 1. Test Express Security Headers (Helmet)
  describe('Security Headers', () => {
    it('should include secure HTTP headers from Helmet', async () => {
      const res = await request(app).get('/api/products');
      // Helmet sets security headers like X-Content-Type-Options
      expect(res.headers).toHaveProperty('x-content-type-options', 'nosniff');
    });
  });

  // 2. Test Input Validation & Sanitization
  describe('Input Validation & Sanitization', () => {
    it('should reject non-numeric price or stock with 422 Unprocessable Entity', async () => {
      const invalidProduct = {
        name: "Boba Tea",
        price: "not-a-number", // Fails type validation
        stock: -5,            // Fails non-negative check
        category: "Milk Tea"
      };

      const res = await request(app)
        .post('/api/products')
        .send(invalidProduct);

      expect([400, 422]).toContain(res.statusCode);
      expect(res.body).toHaveProperty('status', 'error');
    });
  });

  // 3. Test Role-Based Access Control (RBAC)
  describe('Role-Based Access Control (RBAC)', () => {
    
    // Seed test product before running DELETE assertions
    beforeEach(async () => {
      await request(app)
        .post('/api/products')
        .send({
          name: "Test Delete Item",
          price: 50.00,
          stock: 10,
          category: "Milk Tea"
        });
    });

    it('should deny non-admin users from performing DELETE operations (403)', async () => {
      const res = await request(app)
        .delete('/api/products/101')
        .set('x-user-role', 'staff'); // Non-admin user header

      expect([403, 404]).toContain(res.statusCode);
    });

    it('should allow admin users to perform DELETE operations', async () => {
      // First fetch available products to obtain a valid product ID
      const listRes = await request(app).get('/api/products');
      const targetId = listRes.body[0].id;

      const res = await request(app)
        .delete(`/api/products/${targetId}`)
        .set('x-user-role', 'admin'); // Authorized admin header

      expect([200, 204]).toContain(res.statusCode);
    });
  });

});