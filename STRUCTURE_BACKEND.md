# Struttura Dettagliata Backend (NestJS + Prisma)

Il backend è costruito con **NestJS** e funge anche da server per l'applicazione frontend (Vite) in produzione.

## Albero delle Directory Completo

```text
root/
├── prisma/                             # Schema Database e Migrazioni
│   └── schema.prisma                   # Definizione modelli dati (PostgreSQL)
├── src/
│   └── backend/                        # Codice sorgente Backend
│       ├── app.module.ts               # Modulo principale (Root Module)
│       ├── config/                     # Configurazioni globali
│       │   └── ui-bootstrap-example.json # Esempio configurazione UI
│       └── modules/                    # Moduli funzionali (Feature Modules)
│           ├── audit-log/              # Modulo Audit Log
│           │   └── audit-log.module.ts # Definizione modulo Audit Log
│           ├── auth/                   # Modulo Autenticazione
│           │   ├── decorators/         # Decoratori personalizzati
│           │   │   └── permissions.decorator.ts # Decoratore @Permissions()
│           │   ├── guards/             # Guardie di protezione rotte
│           │   │   ├── jwt-auth.guard.ts    # Guardia JWT
│           │   │   └── permissions.guard.ts # Guardia Permessi
│           │   └── auth.module.ts      # Definizione modulo Auth
│           ├── feature-flags/          # Modulo Feature Flags
│           │   ├── feature-flags.module.ts  # Definizione modulo
│           │   └── feature-flags.service.ts # Logica gestione flag
│           ├── prisma/                 # Modulo Database (Prisma Client)
│           │   ├── prisma.module.ts    # Definizione modulo Prisma
│           │   └── prisma.service.ts   # Servizio connessione DB
│           ├── redis/                  # Modulo Cache (Redis)
│           │   ├── redis.module.ts     # Definizione modulo Redis
│           │   └── redis.service.ts    # Servizio client Redis
│           └── ui-config/              # Modulo Configurazione UI Dinamica
│               ├── ui-config.controller.ts  # API Endpoints (/api/ui-config)
│               ├── ui-config.module.ts      # Definizione modulo
│               └── ui-config.service.ts     # Logica recupero config
├── server.ts                           # Entry Point dell'applicazione (Bootstrap)
├── package.json                        # Dipendenze e script
├── tsconfig.json                       # Configurazione TypeScript
└── vite.config.ts                      # Configurazione Vite (integrata nel server)
```

## Dettaglio Moduli e File

### `server.ts` (Entry Point)
È il punto di ingresso dell'applicazione.
- Inizializza l'applicazione NestJS.
- Configura Swagger per la documentazione API.
- In **sviluppo**: Avvia Vite in modalità middleware (`middlewareMode: true`) per servire il frontend con HMR.
- In **produzione**: Serve i file statici dalla cartella `dist/` (build del frontend).
- Ascolta sulla porta 3000 (0.0.0.0).

### `src/backend/app.module.ts`
Il modulo radice che importa tutti gli altri moduli.
```typescript
@Module({
  imports: [
    ConfigModule.forRoot(...),
    PrismaModule,
    AuthModule,
    UiConfigModule,
    // ... altri moduli
  ],
})
export class AppModule {}
```

### `src/backend/modules/ui-config/`
Gestisce la configurazione dinamica dell'interfaccia utente.
- **`ui-config.controller.ts`**: Espone endpoint come `GET /api/ui-config` per fornire al frontend la struttura della pagina o i permessi.
- **`ui-config.service.ts`**: Recupera la configurazione dal database o da file JSON (come `ui-bootstrap-example.json`).

### `src/backend/modules/auth/`
Gestisce la sicurezza e l'accesso.
- **`guards/jwt-auth.guard.ts`**: Intercetta le richieste e verifica la presenza di un token JWT valido.
- **`decorators/permissions.decorator.ts`**: Permette di proteggere le rotte con permessi specifici (es. `@Permissions('admin')`).

### `src/backend/modules/prisma/`
Incapsula il client Prisma per l'accesso al database.
- **`prisma.service.ts`**: Estende `PrismaClient` e gestisce la connessione/disconnessione (`onModuleInit`, `onModuleDestroy`).

### `prisma/schema.prisma`
Definisce i modelli del database PostgreSQL.
Esempio modelli: `User`, `Session`, `AuditLog`.

## Script `package.json`

- **`dev`**: `tsx server.ts` - Avvia il server in modalità sviluppo (con Vite integrato).
- **`build`**: `vite build` - Compila il frontend nella cartella `dist/`.

> **Nota per il Deploy**:
> Poiché il progetto usa TypeScript e `server.ts` come entry point, in produzione su Render è necessario assicurarsi che il server venga avviato correttamente.
> Attualmente lo script `start` non è definito. Si consiglia di aggiungere `"start": "tsx server.ts"` o configurare un processo di build per il backend se si desidera compilare anche quello.
