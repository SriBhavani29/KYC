# KYC Frontend Application

Enterprise dashboard interface built with React, Vite, Tailwind CSS, Lucide icons, and Recharts.

## Directory Structure
```
client/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx              # Header with notifications and "+ Register Entity"
│   │   ├── Sidebar.jsx             # Role switcher, brand banner, and module nav
│   │   ├── KYCDetailModal.jsx      # Inspection desk (zoom, rotate, approve/reject)
│   │   └── RegisterEntityModal.jsx # New applicant registration modal with live validation
│   ├── context/
│   │   └── AuthContext.jsx         # Global user session & persona switcher state
│   ├── pages/
│   │   ├── Dashboard.jsx           # Main executive dashboard with KPIs and Recharts
│   │   ├── KYCVerification.jsx     # KYC verification queue and filter table
│   │   ├── Payments.jsx            # Subscription cycles (Vendors ₹1,000 dual cycles, etc.)
│   │   ├── Queries.jsx             # Ticket messaging desk & SLA timers
│   │   ├── VendorsView.jsx         # Dedicated Vendor persona view & cycle tracking
│   │   ├── GenericPersonaView.jsx  # Reusable persona view (Customer, Agent, Manager, etc.)
│   │   ├── TeamsView.jsx           # Team roster, availability toggles, workload gauge
│   │   ├── ReportsView.jsx         # Exportable summary reports & audit logs
│   │   ├── ProfileView.jsx         # Operator identity & security profile
│   │   └── SettingsView.jsx        # Configurable business rules & validation parameters
│   ├── utils/
│   │   ├── validation.js           # Strict Indian format regex (Mobile, IFSC, Bank)
│   │   └── pdfGenerator.js         # Client-side PDF certificate & invoice generator
│   ├── App.jsx                     # Top-level application router & coordinator
│   ├── index.css                   # Tailwind CSS styling and custom scrollbars
│   └── main.jsx                    # React DOM entry point
├── .env                            # API base URL configuration
├── vite.config.js                  # Vite server & API proxy config
├── package.json
└── README.md
```

## Setup & Running Standalone
```bash
cd client
npm install
npm run dev     # Starts on http://localhost:3000
```
