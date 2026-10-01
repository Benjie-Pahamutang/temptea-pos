# Team Retrospective — TEMPTEA POS Project

This document records our team's blameless retrospective across the entire 12-week development lifecycle for Deliverable 4.

---

## 1. What Went Well

* **Modular MVC Architecture:** Establishing clear controller-service-route boundaries in Phase 2 made wiring Phase 3 views straightforward and scalable.
* **Rigorous Error & Feedback Matrix:** Establishing standard HTTP error handlers (422 validation, 404 missing states, 500 server alerts) early prevented blank screens and silent failures in production.
* **AI Tooling Efficiency:** Utilizing AI for rapid layout scaffolding and test case generation accelerated progress while keeping control through manual review and prompt logging.
* **Git Workflow & Branch Protection:** Enforcing peer-reviewed PRs and atomic commits kept `main` clean and buildable.

---

## 2. What Didn't Go Well & Friction Points

* **Path & Case Sensitivity:** Early bugs stemmed from Windows vs. Linux case-sensitivity issues with image paths (`docs/image/` vs lower/uppercase extensions), which broke static asset rendering on remote hosts.
* **Asynchronous Double-Submit Race Conditions:** Initial checkout button logic lacked immediate UI locking, allowing duplicate order creation during fast double-clicks (triaged as BUG-02 in Week 10).
* **Initial Environment Variable Drift:** Hardcoded local connection strings required refactoring during Week 11 deployment configuration to enforce security.

---

## 3. Key Lessons & Future Improvements

1. **Environment First:** Always abstract configuration variables (`process.env`) from Day 1 rather than refactoring before deployment.
2. **UI Defensive Locking:** Always set `button.disabled = true` immediately upon event trigger for any asynchronous mutating call (`POST`, `PUT`, `DELETE`).
3. **Automated Cross-Platform Linting:** Implement CI checks for file-path casing to catch case-sensitivity bugs prior to hosting.