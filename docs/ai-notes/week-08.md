# AI Prompt Log & Disclosure — Week 8 (Deliverable 3 Final)

**Student Name:** Benjie Pahamutang  
**Role:** Lead Architect & Developer  
**Phase:** Phase 3 — Interface & View Binding (Week 8 Closeout)

---

## Prompt Log Entries

### Entry 1: Centralized Toast & Alert Feedback Helper
* **Target Artifact:** `public/js/utils/feedbackHelper.js`
* **Prompt Used:** *"Write a reusable JavaScript helper module that displays toast notifications (success, warning, error) with auto-dismissal and handles setting inline input validation states for HTTP 422 errors."*
* **Classification:** **AI-Modified**
* **Refinements Made:** Customized toast styling to match app theme, added explicit DOM cleanup logic to prevent memory leaks, and enforced human-friendly message fallbacks for raw server errors.

### Entry 2: Destructive Action Modal Guard
* **Target Artifact:** `public/js/components/confirmationModal.js`
* **Prompt Used:** *"Create an accessible modal confirmation dialog component that accepts callback functions for destructive delete actions."*
* **Classification:** **AI-Modified**
* **Refinements Made:** Attached keyboard listener (Escape key to cancel) and auto-focused the primary action button for user accessibility.

---

## Summary of Attribution
* **Hand-Written:** `docs/feedback-tests.md` validation execution, network status listener bindings, and final repo submission checks.
* **AI-Modified:** Toast notification component helper, inline 422 form field highlight logic, and modal callback handlers.
* **AI-Generated:** Initial layout structure for skeleton load placeholders.