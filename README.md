# Seguimiento de Tratamiento Médico - MementoMedical

Sistema web de seguimiento de tratamiento médico que implementa el **patrón Memento** para garantizar la inmutabilidad de las prescripciones médicas.

## Patrón Memento

Cada prescripción es un **snapshot inmutable**:
- No existe endpoint PUT/PATCH para modificar prescripciones
- Solo se crean nuevas prescripciones (POST)
- Los cambios generan una nueva prescripción vinculada a la anterior
- Se puede comparar (diff) entre prescripciones vinculadas

## Stack

- **Frontend:** React + TypeScript + TailwindCSS + Vite
- **Backend:** Node.js + Express + TypeScript
- **Base de datos:** MongoDB + Mongoose
- **Auth:** JWT (roles: médico )
- **Validación:** Zod

## Estructura

```
memento/
├── backend/
│   ├── src/
│   │   ├── config/          # DB + env config
│   │   ├── controllers/     # Auth, Paciente, Médico, Prescripción
│   │   ├── middleware/      # Auth JWT + Zod validation
│   │   ├── models/          # Mongoose schemas (Usuario, Paciente, Médico, Prescripción)
│   │   ├── routes/          # Express routes
│   │   ├── validations/     # Zod schemas
│   │   └── app.ts           # Entry point
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios client + services
│   │   ├── components/      # Layout
│   │   ├── context/         # AuthContext
│   │   ├── pages/           # Login, Register, Dashboard, Prescripción, Historial, Comparar
│   │   ├── types/           # TypeScript interfaces
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
└── README.md
```

## Instalación

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

## Ejecución

```bash
# Backend (puerto 4000)
cd backend
npm run dev

# Frontend (puerto 3000)
cd frontend
npm run dev
```

## Variables de entorno (backend/.env)

```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/memento-medical
JWT_SECRET=super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=24h
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Registro (médico o paciente)
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Perfil actual

### Pacientes
- `GET /api/pacientes` - Lista de pacientes (médico)
- `GET /api/pacientes/perfil` - Perfil del paciente autenticado
- `GET /api/pacientes/:id` - Paciente por ID
- `PUT /api/pacientes/:id/alergias` - Actualizar alergias

### Médicos
- `GET /api/medicos` - Lista de médicos
- `GET /api/medicos/perfil` - Perfil del médico autenticado
- `GET /api/medicos/:id` - Médico por ID

### Prescripciones (Memento)
- `POST /api/prescripciones` - Crear prescripción (snapshot inmutable)
- `POST /api/prescripciones/alergia` - Nueva prescripción por alergia/cambio
- `GET /api/prescripciones/historial/:pacienteId` - Historial clínico
- `GET /api/prescripciones/comparar/:id1/:id2` - Comparar (diff) dos prescripciones
- `GET /api/prescripciones/activas/:pacienteId` - Prescripciones activas
- `GET /api/prescripciones/cadena/:id` - Cadena de prescripciones vinculadas
- `GET /api/prescripciones/:id` - Prescripción por ID

## Flujo Principal

1. **Médico** crea prescripción → Snapshot Memento #1 (inmutable)
2. **Paciente** ve su tratamiento activo y próximas tomas
3. Si hay alergia/cambio → **Médico** crea nueva prescripción vinculada → Snapshot Memento #2
4. La prescripción anterior se desactiva (no se borra ni modifica)
5. Se puede comparar la diferencia entre snapshots
