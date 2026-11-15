# KYC Backend API Server

Enterprise REST API service powering the KYC Management, Subscriptions, and Queries operations.

## Directory Structure
```
server/
├── src/
│   ├── data/
│   │   ├── database.js     # Thread-safe database & seeding engine
│   │   └── db.json         # Persistent JSON relational store
│   ├── middleware/
│   │   ├── auth.js         # JWT verification & RBAC authorization
│   │   └── validators.js   # Indian regulatory format validators (Mobile, IFSC, Bank)
│   ├── routes/
│   │   ├── authRoutes.js   # Login, profile, and team availability
│   │   ├── kycRoutes.js    # Ingestion, inspection, approve/reject, reassign
│   │   ├── paymentRoutes.js# Subscription cycles (₹1,000 dual cycles, memberships)
│   │   ├── queryRoutes.js  # Support ticketing, SLA resolution tracking
│   │   └── reportRoutes.js # Real-time dashboard KPI & audit trail aggregations
│   └── index.js            # Express server initialization
├── uploads/                # Secured uploaded document files
├── .env                    # Environment variables
├── package.json
└── README.md
```

## Setup & Running Standalone
```bash
cd server
npm install
npm run dev     # Starts on http://localhost:5000 with hot-reload
```

## API Endpoints Overview
- `POST /api/auth/login` - Authenticate operator
- `GET /api/reports/dashboard` - Executive dashboard KPIs & charts
- `GET /api/kyc` - List KYC applications with search & filters
- `POST /api/kyc` - Ingest new application (auto-assigns to available agent)
- `POST /api/kyc/:id/review` - Approve (auto-transfers to Payments) or Reject (with mandatory reason)
- `POST /api/kyc/:id/reassign` - Team lead reassignment
- `GET /api/payments` - List subscription cycles and transactions
- `POST /api/payments/:id/status` - Mark transaction Paid, Pending, or Failed
- `GET /api/queries` - List tickets and response history
- `POST /api/queries/:id/reply` - Agent response and SLA resolution
- `PATCH /api/auth/team-members/:id/availability` - Toggle active work status

