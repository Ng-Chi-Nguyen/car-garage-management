# AGENTS.md - Car Garage Management AI Agent Skills & Protocols

> **Comprehensive guide for AI agents working on Car Garage Management System**
> 
> This document consolidates all skills, instructions, and prompts for the OpenCode AI system.
> Based on research from: Domain-Driven Design, Clean Architecture, Hexagonal Architecture, CQRS, Event Sourcing, and industry best practices for Web Development.

---

## Table of Contents

### Part I: Project-Specific Skills (Web App)
1. [garage-arch - Scalable Web Architecture](#1-garage-arch---scalable-web-architecture)
2. [js-ts-godmode - Strict JS/TS Standards](#2-js-ts-godmode---strict-jsts-standards)
3. [mysql-supreme - MySQL Optimization](#3-mysql-supreme---mysql-optimization)
4. [algo-god - Performance & Algorithm Protocol](#4-algo-god---performance--algorithm-protocol)
5. [debug-protocol - Systematic Bug Analysis](#5-debug-protocol---systematic-bug-analysis)
6. [qa-engineer - Quality Assurance Protocol](#6-qa-engineer---quality-assurance-protocol)
7. [sec-ops - Security Operations Protocol](#7-sec-ops---security-operations-protocol)
8. [git-commander - Git Workflow Protocol](#8-git-commander---git-workflow-protocol)
9. [devops-master - Deployment Protocol](#9-devops-master---deployment-protocol)
10. [fullstack-bridge - Web & API Integration](#10-fullstack-bridge---web--api-integration)
11. [market-analyst - Business Analysis](#11-market-analyst---business-analysis)
12. [reverse-engineer - Code Analysis](#12-reverse-engineer---code-analysis)
13. [feature-template - Boilerplate Generator](#13-feature-template---boilerplate-generator)

### Part II: Advanced Architecture Skills
14. [ddd-master - Domain-Driven Design Protocol](#14-ddd-master---domain-driven-design-protocol)
15. [hexagonal-arch - Ports & Adapters Architecture](#15-hexagonal-arch---ports--adapters-architecture)
16. [cqrs-architect - Command Query Responsibility Segregation](#16-cqrs-architect---command-query-responsibility-segregation)
17. [clean-arch - Clean Architecture Protocol](#17-clean-arch---clean-architecture-protocol)

### Part III: Code Quality Skills
18. [code-auditor - Systematic Code Review](#18-code-auditor---systematic-code-review)
19. [refactor-master - Safe Refactoring Protocol](#19-refactor-master---safe-refactoring-protocol)
20. [anti-pattern-hunter - Code Smell Detection](#20-anti-pattern-hunter---code-smell-detection)

### Part IV: UI/UX Skills
21. [ui-architect - Design System Protocol](#21-ui-architect---design-system-protocol)
22. [accessibility-ops - WCAG Compliance Protocol](#22-accessibility-ops---wcag-compliance-protocol)

### Part V: Agent System Reference
23. [Agent Types & Usage Guidelines](#agent-types-opencode-system)

---

# Part I: Project-Specific Skills (Web App)

---

## 1. garage-arch - Scalable Web Architecture

**Trigger:** `/garage-arch`
**Role:** Architect
**Stack:** Node.js (Express), React, MySQL

### The Architecture Standard

When designing or refactoring a feature, you MUST strictly separate concerns.

#### Backend Layer Structure (Node.js)
- **Controllers**: Handle HTTP requests, validation, and response formatting.
- **Services**: Business logic, transactions, and complex operations.
- **Repositories/Models**: Direct database access (SQL queries or ORM).
- **Utils/Helpers**: Shared utility functions.

#### Frontend Layer Structure (React)
- **Components**: UI elements (Atomic Design: Atoms, Molecules, Organisms).
- **Pages/Views**: Route handlers combining components.
- **Services/API**: Axios/Fetch calls to backend.
- **Hooks**: Custom logic reuse.
- **Context/Store**: State management.

### Usage Instruction
Before writing code for a new feature, output the file structure based on this architecture.

---

## 2. js-ts-godmode - Strict JS/TS Standards

**Trigger:** `/js-ts-godmode`
**Level:** Senior
**Language:** JavaScript / TypeScript

### JS/TS God-Mode Standards

You are a JavaScript Purist. Reject any code that violates these rules.

#### 1. Modern Syntax (ES6+)
- Use `const` and `let`. NEVER use `var`.
- Use Arrow Functions for callbacks and short methods.
- Use Destructuring for objects and arrays.
- Use Async/Await instead of raw Promises/Callbacks.

#### 2. React Best Practices
- **Functional Components**: Use functional components with Hooks. Avoid Class components.
- **Hooks Rules**: Only call hooks at the top level.
- **Prop Types**: Use PropTypes (if JS) or Interfaces (if TS) for all components.
- **Clean JSX**: Keep logic out of JSX. Extract to helper functions.

#### 3. Node.js Best Practices
- **Async Handling**: Always handle errors in async functions (`try/catch`).
- **Middleware**: Use middleware for cross-cutting concerns (Auth, Logging).
- **Environment Config**: Use `dotenv` for configuration.

```javascript
// CORRECT
const getUser = async (id) => {
  try {
    const user = await db.findById(id);
    return user;
  } catch (error) {
    logger.error(error);
    throw new Error('User not found');
  }
};

// WRONG
function getUser(id) {
  return db.findById(id).then(user => user).catch(console.error);
}
```

---

## 3. mysql-supreme - MySQL Optimization

**Trigger:** `/mysql-supreme`
**Database:** MySQL

### MySQL Optimization Standards

#### 1. Schema Design
- **Normalization**: Aim for 3NF unless performance dictates denormalization.
- **Indexing**: Index Foreign Keys and columns used in WHERE/JOIN clauses.
- **Data Types**: Use appropriate types (INT vs BIGINT, CHAR vs VARCHAR).

#### 2. Query Optimization
- **Avoid SELECT \***: Select only needed columns.
- **Joins**: Prefer JOINs over subqueries where possible.
- **Transactions**: Use transactions for multi-step operations (e.g., Inventory Update + Invoice Creation).

```sql
-- CORRECT
START TRANSACTION;
INSERT INTO invoices ...;
UPDATE inventory SET quantity = quantity - 1 WHERE id = ...;
COMMIT;
```

---

## 4. algo-god - Performance & Algorithm Protocol

**Trigger:** `/algo-god`
**Level:** Expert

### Performance Protocol

#### 1. Backend Performance
- **Caching**: Use Redis for expensive queries or frequently accessed data.
- **Pagination**: Always paginate large datasets (Cursor-based preferred).
- **Asynchronous Processing**: Offload heavy tasks to background queues.

#### 2. Frontend Performance
- **Memoization**: Use `useMemo` and `useCallback` to prevent unnecessary re-renders.
- **Lazy Loading**: Lazy load routes and heavy components.
- **Virtualization**: Use virtualization for long lists.

---

## 5. debug-protocol - Systematic Bug Analysis

**Trigger:** `/debug-protocol`
**Task:** Debugging

### Deep Debug Protocol

1. **Reproduce**: Can you reproduce the bug consistently?
2. **Isolate**: Which component/layer is causing it? (Frontend? Backend? DB?)
3. **Logs**: Check server logs and browser console.
4. **Fix**: Apply fix and verify.
5. **Regression Test**: Ensure no new bugs were introduced.

---

## 6. qa-engineer - Quality Assurance Protocol

**Trigger:** `/qa-engineer`
**Framework:** Jest, React Testing Library

### QA Protocol

#### 1. Unit Testing
- Test individual functions and components in isolation.
- Mock dependencies (API calls, DB access).

#### 2. Integration Testing
- Test interactions between modules (e.g., API + Database).

#### 3. End-to-End (E2E) Testing
- Test critical user flows (Login -> Create Ticket -> Payment).

---

## 7. sec-ops - Security Operations Protocol

**Trigger:** `/sec-ops`
**Standard:** OWASP Top 10

### Security Protocol

1. **Injection**: Use parameterized queries (Prepared Statements) to prevent SQL Injection.
2. **Authentication**: Use robust Auth (JWT/Session). Hash passwords (bcrypt).
3. **XSS**: Sanitize user input. Use frameworks that auto-escape (React).
4. **CSRF**: Use Anti-CSRF tokens.
5. **Access Control**: Implement Role-Based Access Control (RBAC) (Admin vs Staff).

---

## 8. git-commander - Git Workflow Protocol

**Trigger:** `/git-commander`
**Role:** DevOps

### Git Workflow

1. **Branches**: `main` (prod), `dev` (integration), `feat/feature-name`.
2. **Commits**: Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`).
3. **PRs**: Code review required before merging to `main`.

---

## 9. devops-master - Deployment Protocol

**Trigger:** `/devops-master`
**Stack:** Docker, PM2, Nginx

### Deployment Protocol

1. **Docker**: Containerize the application for consistency.
2. **Environment**: Use `.env` for secrets. Never commit `.env`.
3. **Process Management**: Use PM2 for Node.js production process management.
4. **Reverse Proxy**: Use Nginx for serving static files and proxying API requests.

---

## 10. fullstack-bridge - Web & API Integration

**Trigger:** `/fullstack-bridge`
**Framework:** REST

### Integration Protocol

1. **API Design**: RESTful principles. Standard HTTP methods (GET, POST, PUT, DELETE).
2. **Response Format**: JSON. Consistent structure (`{ success: true, data: ..., error: ... }`).
3. **Error Handling**: proper HTTP status codes (200, 400, 401, 404, 500).

---

## 11. market-analyst - Business Analysis

**Trigger:** `/market-analyst`

### Business Logic Protocol

1. **Requirements**: Understand the specific needs of a Garage (Inventory flow, Service workflow).
2. **Rules**: Adhere to business rules defined in `DESIGN_SPECS.md` (e.g., QĐ1, QĐ2).

---

## 12. reverse-engineer - Code Analysis

**Trigger:** `/reverse-engineer`

### Analysis Protocol

1. **Read**: Understand the existing code flow.
2. **Map**: Create mental or visual map of dependencies.
3. **Refactor**: Identify improvements while maintaining logic.

---

## 13. feature-template - Boilerplate Generator

**Trigger:** `/feature-template`

### Feature Boilerplate

When creating a new feature (e.g., "Supplier Management"):

1. **Backend**:
   - `routes/supplierRoutes.js`
   - `controllers/supplierController.js`
   - `services/supplierService.js`
   - `models/supplierModel.js` (or repository)

2. **Frontend**:
   - `components/Supplier/SupplierList.js`
   - `components/Supplier/SupplierForm.js`
   - `pages/SupplierPage.js`
   - `services/supplierApi.js`

---

# Part II: Advanced Architecture Skills

---

## 14. ddd-master - Domain-Driven Design Protocol

**Trigger:** `/ddd-master`

(Same as original - Universal concept)

---

## 15. hexagonal-arch - Ports & Adapters Architecture

**Trigger:** `/hexagonal-arch`

(Same as original - Universal concept)

---

## 16. cqrs-architect - Command Query Responsibility Segregation

**Trigger:** `/cqrs-architect`

(Same as original - Universal concept)

---

## 17. clean-arch - Clean Architecture Protocol

**Trigger:** `/clean-arch`

(Same as original - Universal concept)

---

# Part III: Code Quality Skills

---

## 18. code-auditor - Systematic Code Review

**Trigger:** `/code-auditor`

(Same as original - Universal concept)

---

## 19. refactor-master - Safe Refactoring Protocol

**Trigger:** `/refactor-master`

(Same as original - Universal concept)

---

## 20. anti-pattern-hunter - Code Smell Detection

**Trigger:** `/anti-pattern-hunter`

(Same as original - Universal concept)

---

# Part IV: UI/UX Skills

---

## 21. ui-architect - Design System Protocol

**Trigger:** `/ui-architect`
**Stack:** React, CSS/Tailwind

### UI Principles

1. **Consistency**: Use a common design language (colors, spacing, typography).
2. **Responsiveness**: Ensure layout works on Mobile and Desktop.
3. **Feedback**: Provide visual feedback for actions (Loading spinners, Toasts for success/error).

---

## 22. accessibility-ops - WCAG Compliance Protocol

**Trigger:** `/accessibility-ops`

(Same as original - Universal concept)

---

# Part V: Agent System Reference

---

## 23. Agent Types & Usage Guidelines

### The Agent Team

| Agent | Model | Role |
|-------|-------|------|
| **Sisyphus** | antigravity-claude-opus-4-5-thinking | Primary Orchestrator |
| **oracle** | github-copilot/gpt-5.2 | Deep Reasoner |
| **librarian** | perplexity/sonar-reasoning-pro | Researcher (Docs/Web) |
| **explore** | github-copilot/grok-code-fast-1 | Scout (Codebase Search) |
| **devops-master** | github-copilot/gpt-5.1-codex | Infrastructure |
| **qa-engineer** | github-copilot/claude-sonnet-4.5 | Reviewer/Tester |
| **frontend-ui-ux-engineer** | antigravity-gemini-3-pro | UI/Frontend Specialist |
| **market-analyst** | antigravity-gemini-3-flash | Business Analyst |
| **document-writer** | antigravity-gemini-3-flash | Scribe |

*(Usage instructions remain similar to original template)*
