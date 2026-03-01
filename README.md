# Enterprise Backend-Driven UI Architecture

## 1. Folder Structure
```text
/src
  /backend
    /common
      /decorators
      /guards
      /interceptors
      /middleware
      /schemas
    /modules
      /auth
      /users
      /roles
      /permissions
      /tenants
      /ui-config
      /menu-config
      /layout-config
      /dashboard-config
      /feature-flags
      /dynamic-forms
      /workflow-config
      /audit-log
      /admin-panel
      /redis
      /prisma
    app.module.ts
  /admin
    AdminPanel.tsx
    SortableItem.tsx
    LayoutEditor.tsx
    FormBuilder.tsx
  /components
    DynamicForm.tsx
    DynamicLayout.tsx
  /context
    BootstrapContext.tsx
/prisma
  schema.prisma
server.ts
```

## 2. Key Features
- **Backend-Driven UI**: The entire frontend layout, sidebar, and forms are controlled via `/api/ui/bootstrap`.
- **Config Versioning**: Every change creates a new version. Versions can be published to different environments (dev, staging, prod).
- **RBAC**: Granular permission system integrated with UI visibility and API access.
- **Feature Flags**: Deterministic rollout system with Redis caching.
- **Audit Logging**: Every administrative action is tracked with old/new value snapshots.
- **Dynamic Forms**: JSON-schema based form generation with conditional logic.

## 3. Production Readiness
- **Redis Caching**: Bootstrap config and feature flags are cached with TTL.
- **Schema Validation**: Ajv validates UI configurations before they are saved or published.
- **Transaction Support**: Publishing config is an atomic operation.
- **Security**: JWT-based authentication with RBAC guards.
