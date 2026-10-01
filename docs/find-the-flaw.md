# AI Code Review & Flaw Audit Log (`find-the-flaw.md`)

This document records the identification, security analysis, and resolution of planted bugs and flaws in AI-generated code snippets for Week 9.

---

## Flaw Analysis Suite

### Snippet 1: Product Express Controller
```javascript
// AI-Generated Snippet
app.post('/api/products', async (req, res) => {
  const product = await Product.create(req.body);
  res.send(product);
});