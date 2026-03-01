# Struttura Dettagliata Frontend (React + Vite)

Questa struttura è progettata per applicazioni React moderne, scalabili e facili da mantenere.

## Albero delle Directory Completo

```text
frontend-root/
├── public/                     # Asset statici (favicon, robots.txt)
│   ├── favicon.ico             # Icona del sito
│   └── manifest.json           # Configurazione PWA
├── src/
│   ├── assets/                 # Immagini e Font (importabili)
│   │   ├── images/             # logo.png, hero.jpg
│   │   ├── icons/              # custom-icon.svg
│   │   └── fonts/              # Inter-Regular.woff2
│   ├── components/             # Componenti UI (Presentational)
│   │   ├── common/             # Componenti base riutilizzabili
│   │   │   ├── Button.tsx      # Pulsante standard
│   │   │   ├── Input.tsx       # Campo input
│   │   │   ├── Modal.tsx       # Finestra modale
│   │   │   └── Spinner.tsx     # Indicatore caricamento
│   │   ├── layout/             # Struttura della pagina
│   │   │   ├── Header.tsx      # Barra navigazione
│   │   │   ├── Sidebar.tsx     # Menu laterale
│   │   │   └── Footer.tsx      # Piè di pagina
│   │   └── features/           # Componenti specifici per funzionalità
│   │       ├── auth/           # Login/Register Form
│   │       ├── dashboard/      # Widget Dashboard
│   │       └── profile/        # Card Profilo Utente
│   ├── context/                # Gestione Stato Globale (Context API)
│   │   ├── AuthContext.tsx     # Stato Autenticazione (User, Token)
│   │   ├── ThemeContext.tsx    # Stato Tema (Light/Dark)
│   │   └── ToastContext.tsx    # Notifiche globali
│   ├── hooks/                  # Custom Hooks (Logica riutilizzabile)
│   │   ├── useAuth.ts          # Accesso rapido AuthContext
│   │   ├── useFetch.ts         # Wrapper per chiamate API
│   │   ├── useLocalStorage.ts  # Persistenza dati locale
│   │   └── useDebounce.ts      # Ritardo input ricerca
│   ├── lib/                    # Librerie esterne configurate
│   │   ├── axios.ts            # Istanza Axios con Interceptor
│   │   └── utils.ts            # Helper (cn per Tailwind)
│   ├── pages/                  # Pagine dell'applicazione (Routing)
│   │   ├── Home.tsx            # Landing Page
│   │   ├── Login.tsx           # Pagina Login
│   │   ├── Dashboard.tsx       # Pagina Dashboard (Protetta)
│   │   └── NotFound.tsx        # Pagina 404
│   ├── services/               # Chiamate API Backend (Business Logic)
│   │   ├── api.ts              # Configurazione base API
│   │   ├── authService.ts      # login(), register(), logout()
│   │   └── userService.ts      # getUser(), updateUser()
│   ├── types/                  # Definizioni TypeScript (Interfacce)
│   │   ├── user.ts             # Interface User
│   │   ├── api.ts              # Interface ApiResponse
│   │   └── auth.ts             # Interface LoginCredentials
│   ├── utils/                  # Funzioni di utilità pure
│   │   ├── formatDate.ts       # Formattazione date (date-fns)
│   │   └── validation.ts       # Validazione form (Zod/Yup)
│   ├── App.tsx                 # Componente Root (Routing & Providers)
│   ├── main.tsx                # Entry Point (ReactDOM.createRoot)
│   └── index.css               # Stili Globali (Tailwind @import)
├── .env                        # Variabili d'ambiente (NON committare)
├── .env.example                # Template variabili (da committare)
├── .gitignore                  # File ignorati da Git
├── index.html                  # Entry Point HTML (Vite)
├── package.json                # Dipendenze e script
├── tsconfig.json               # Configurazione TypeScript
└── vite.config.ts              # Configurazione Vite (Proxy, Alias)
```

## Dettaglio File Chiave

### `src/services/api.ts` (Configurazione Axios)
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // URL Backend da .env
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor per aggiungere Token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### `src/context/AuthContext.tsx` (Gestione Stato Utente)
```typescript
import { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/user';
import { login as loginApi } from '../services/authService';

interface AuthContextType {
  user: User | null;
  login: (creds: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // ... logica login/logout

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

### `src/pages/Dashboard.tsx` (Pagina Protetta)
```typescript
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Benvenuto, {user.name}</h1>
      {/* Contenuto Dashboard */}
    </div>
  );
}
```
