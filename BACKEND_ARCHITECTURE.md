# Backend-Driven UI Architecture

## 1. Struttura Cartelle (Express.js + TypeScript)

```text
server/
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   └── redis.ts
│   ├── core/
│   │   ├── errors/
│   │   ├── logger/
│   │   └── middlewares/
│   │       ├── auth.middleware.ts
│   │       ├── rbac.middleware.ts
│   │       ├── validate-schema.middleware.ts
│   │       └── audit.middleware.ts
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── roles/
│   │   ├── permissions/
│   │   ├── feature-flags/
│   │   │   ├── feature-flags.controller.ts
│   │   │   ├── feature-flags.service.ts
│   │   │   └── feature-flags.repository.ts
│   │   ├── ui-config/
│   │   │   ├── ui-config.controller.ts
│   │   │   ├── ui-config.service.ts
│   │   │   └── schemas/
│   │   │       └── ui-config.schema.ts
│   │   ├── layout-config/
│   │   ├── menu-config/
│   │   ├── dashboard-config/
│   │   └── tenant-config/
│   ├── shared/
│   │   ├── utils/
│   │   └── types/
│   ├── app.ts
│   └── server.ts
├── package.json
└── tsconfig.json
```

## 2. Schema Database (PostgreSQL)

```sql
-- Tenants
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Users & Roles
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    UNIQUE(tenant_id, name)
);

CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource VARCHAR(100) NOT NULL, -- es: 'users', 'dashboard', 'reports'
    action VARCHAR(50) NOT NULL,    -- es: 'view', 'edit', 'delete', 'manage'
    UNIQUE(resource, action)
);

CREATE TABLE role_permissions (
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id),
    role_id UUID REFERENCES roles(id),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true
);

-- UI & Layout Config
CREATE TABLE ui_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id),
    role_id UUID REFERENCES roles(id),
    theme_config JSONB NOT NULL DEFAULT '{}',
    version VARCHAR(50) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id),
    parent_id UUID REFERENCES menu_items(id),
    label VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    path VARCHAR(255),
    order_index INTEGER NOT NULL DEFAULT 0,
    required_permission UUID REFERENCES permissions(id),
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE layout_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id),
    page_route VARCHAR(255) NOT NULL,
    block_id VARCHAR(100) NOT NULL,
    config JSONB NOT NULL,
    required_permission UUID REFERENCES permissions(id)
);

CREATE TABLE widget_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id),
    name VARCHAR(100) NOT NULL,
    component_type VARCHAR(100) NOT NULL,
    default_config JSONB NOT NULL,
    required_permission UUID REFERENCES permissions(id)
);

-- Feature Flags
CREATE TABLE feature_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id),
    key VARCHAR(100) NOT NULL,
    description TEXT,
    is_enabled BOOLEAN DEFAULT false,
    rollout_percentage INTEGER DEFAULT 100,
    target_roles UUID[] DEFAULT '{}',
    environments VARCHAR[] DEFAULT '{prod,staging,dev}',
    UNIQUE(tenant_id, key)
);

-- Audit Log
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    tenant_id UUID REFERENCES tenants(id),
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(100) NOT NULL,
    old_value JSONB,
    new_value JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## 3. Esempio JSON Configurazione Frontend (`GET /ui/config`)

```json
{
  "version": "1.2.0",
  "theme": {
    "mode": "light",
    "primaryColor": "#4f46e5",
    "borderRadius": "0.5rem"
  },
  "features": {
    "new_dashboard_engine": true,
    "beta_reports": false,
    "export_excel": true
  },
  "permissions": [
    "dashboard:view",
    "reports:view",
    "reports:export",
    "users:manage"
  ],
  "sidebar": [
    {
      "id": "menu-1",
      "label": "Cruscotto",
      "icon": "LayoutDashboard",
      "path": "/",
      "children": []
    },
    {
      "id": "menu-2",
      "label": "Reportistica",
      "icon": "FileText",
      "path": "/reports",
      "children": [
        {
          "id": "menu-2-1",
          "label": "Esportazioni",
          "path": "/reports/export"
        }
      ]
    }
  ],
  "layout": {
    "/": {
      "type": "grid",
      "columns": 12,
      "widgets": [
        {
          "id": "w-1",
          "component": "StatCard",
          "span": 3,
          "props": { "title": "Utenti Attivi", "endpoint": "/api/stats/users" }
        },
        {
          "id": "w-2",
          "component": "RevenueChart",
          "span": 9,
          "props": { "type": "bar", "refreshInterval": 60000 }
        }
      ]
    }
  }
}
```

## 4. Controller & Service Esempio (UI Config)

```typescript
// src/modules/ui-config/ui-config.controller.ts
import { Request, Response, NextFunction } from 'express';
import { UiConfigService } from './ui-config.service';

export class UiConfigController {
  constructor(private uiConfigService: UiConfigService) {}

  async getFullConfig(req: Request, res: Response, next: NextFunction) {
    try {
      const { tenantId, roleId, id: userId } = req.user;
      const clientVersion = req.headers['x-client-version'] as string;

      const config = await this.uiConfigService.buildConfigForUser({
        tenantId,
        roleId,
        userId,
        clientVersion,
        environment: process.env.NODE_ENV
      });

      res.json(config);
    } catch (error) {
      next(error);
    }
  }

  async updateLayout(req: Request, res: Response, next: NextFunction) {
    try {
      const { tenantId, id: userId } = req.user;
      const { layoutId } = req.params;
      const layoutData = req.body;

      const updated = await this.uiConfigService.updateLayout(tenantId, layoutId, layoutData, userId);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  }
}

// src/modules/ui-config/ui-config.service.ts
import Redis from 'ioredis';
import { db } from '../../config/database';

export class UiConfigService {
  private redis = new Redis(process.env.REDIS_URL);

  async buildConfigForUser(params: { tenantId: string, roleId: string, userId: string, clientVersion: string, environment: string }) {
    const cacheKey = \`ui-config:\${params.tenantId}:\${params.roleId}:\${params.clientVersion}\`;
    const cached = await this.redis.get(cacheKey);
    
    if (cached) return JSON.parse(cached);

    const [theme, features, permissions, sidebar, layout] = await Promise.all([
      this.getTheme(params.tenantId, params.roleId),
      this.getFeatureFlags(params.tenantId, params.roleId, params.userId, params.environment),
      this.getPermissions(params.roleId),
      this.getSidebar(params.tenantId, params.roleId),
      this.getLayout(params.tenantId, params.roleId)
    ]);

    const config = { version: params.clientVersion, theme, features, permissions, sidebar, layout };
    
    await this.redis.set(cacheKey, JSON.stringify(config), 'EX', 3600); // Cache 1h
    return config;
  }

  // ... implementazioni query DB
}
```

## 5. Middleware di Validazione & Audit

```typescript
// src/core/middlewares/validate-schema.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';

export const validate = (schema: AnyZodObject) => 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
  };

// src/core/middlewares/audit.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { db } from '../../config/database';

export const auditLog = (resource: string) => 
  (req: Request, res: Response, next: NextFunction) => {
    const originalSend = res.json;
    res.json = function (body) {
      if (res.statusCode >= 200 && res.statusCode < 300 && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
        db.query(
          \`INSERT INTO audit_logs (user_id, tenant_id, action, resource, new_value) VALUES ($1, $2, $3, $4, $5)\`,
          [req.user.id, req.user.tenantId, req.method, resource, JSON.stringify(req.body)]
        ).catch(console.error);
      }
      return originalSend.call(this, body);
    };
    next();
  };
```

## 6. Sistema RBAC (Role-Based Access Control)

```typescript
// src/core/middlewares/rbac.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { db } from '../../config/database';

export const requirePermission = (resource: string, action: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { roleId } = req.user;
      
      const { rows } = await db.query(\`
        SELECT 1 FROM role_permissions rp
        JOIN permissions p ON rp.permission_id = p.id
        WHERE rp.role_id = $1 AND p.resource = $2 AND p.action = $3
      \`, [roleId, resource, action]);

      if (rows.length === 0) {
        return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// Utilizzo nelle routes:
// router.patch('/layout/:id', requirePermission('ui_layout', 'edit'), auditLog('ui_layout'), validate(LayoutSchema), controller.updateLayout);
```

## 7. Sistema Feature Flag

```typescript
// src/modules/feature-flags/feature-flags.service.ts
import crypto from 'crypto';

export class FeatureFlagService {
  async getFlagsForUser(tenantId: string, roleId: string, userId: string, environment: string) {
    const { rows: flags } = await db.query(\`
      SELECT key, is_enabled, rollout_percentage, target_roles, environments 
      FROM feature_flags 
      WHERE tenant_id = $1
    \`, [tenantId]);

    const activeFlags: Record<string, boolean> = {};

    for (const flag of flags) {
      // 1. Check Environment
      if (!flag.environments.includes(environment)) {
        activeFlags[flag.key] = false;
        continue;
      }

      // 2. Check Global Toggle
      if (!flag.is_enabled) {
        activeFlags[flag.key] = false;
        continue;
      }

      // 3. Check Role Targeting
      if (flag.target_roles.length > 0 && !flag.target_roles.includes(roleId)) {
        activeFlags[flag.key] = false;
        continue;
      }

      // 4. Check Rollout Percentage (Sticky per user via hash)
      if (flag.rollout_percentage < 100) {
        const hash = crypto.createHash('md5').update(\`\${flag.key}-\${userId}\`).digest('hex');
        const userBucket = parseInt(hash.substring(0, 4), 16) % 100;
        activeFlags[flag.key] = userBucket < flag.rollout_percentage;
      } else {
        activeFlags[flag.key] = true;
      }
    }

    return activeFlags;
  }
}
```
