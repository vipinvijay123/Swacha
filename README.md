# Swachhta & Green Standard Compliance Monitoring Dashboard

A modern, full-stack MERN (MongoDB, Express, React, Node.js) compliance monitoring and management web application built for inspecting, scoring, and tracking cleanliness, sanitation, waste management, water conservation, energy efficiency, green environment practices, and sustainability across institutions, government offices, public facilities, and commercial campuses.

![Swachhta Compliance Dashboard](https://img.shields.io/badge/Swachhta%20%26%20Green-Compliance%20v1.0-10B981?style=for-the-badge)
![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge)

---

## 🌟 Key Features

### 1. Role-Based Access Control (RBAC) & Authentication
* **Admin**: Manage users, facilities, compliance standards, view all audits, analytics, violations, corrective actions, and generate printable reports.
* **Inspector**: Conduct live inspections with dynamic checklist scoring, upload evidence photos, log violations, and add remarks.
* **Facility Manager**: Monitor assigned facility compliance score, review inspection reports, track violations, and submit corrective actions with proof images.

### 2. Main Command Center Dashboard
* **6 Live KPI Cards**: Total Facilities, Inspections Completed, Average Compliance Score, Critical Violations, Pending Corrective Actions, Fully Compliant Facilities (&ge;90%).
* **Circular Score Gauge**: SVG visual gauge representing overall system cleanliness index.
* **Interactive Charts**: Compliance Trend line chart, Category Performance bar chart, Facility Compliance comparison chart, and Recent Completed Inspections table.

### 3. Compliance Scoring System (0–100%)
* **Scoring Categories**:
  - `Cleanliness & Hygiene`
  - `Waste Management` (Wet/Dry/E-Waste/Composting)
  - `Water Management` (Rainwater harvesting, Leakages, Filtration)
  - `Energy Management` (LEDs, Solar PV, Star-rated HVAC)
  - `Green Environment` (&gt;30% green cover, Plastic ban, Tree plantation)
  - `Sanitation` (STP, Drainage, Incinerators)
  - `Awareness & Sustainability` (Swachhta workshops, Eco-policy displays)
* **Automatic Live Score Calculation**:
  - Compliant = 2 Points
  - Partially Compliant = 1 Point
  - Non-Compliant = 0 Points
  - Not Applicable = Excluded from total max points
  - Score % = `(Obtained Points / Max Points) * 100` (computed dynamically; non-editable).
* **Score Classifications**:
  - `90% – 100%`: Excellent Compliance
  - `75% – 89%`: Good Compliance
  - `50% – 74%`: Needs Improvement
  - `Below 50%`: Poor Compliance (Non-Compliant)

### 4. Facility Management & Detailed Profile
* Grid and Table views with instant search, status filters, and facility type filters.
* Detailed facility profile tabs: **Overview**, **Inspections**, **Violations**, **Corrective Actions**, and **Category Scores**.

### 5. Inspection Module & Photo Evidence Upload
* Conduct routine, surprise, follow-up, or special inspections.
* Category-grouped checklist with real-time score updates.
* Multer-powered photo upload gallery with lightbox preview.
* Auto-flag violations option when Non-Compliant items are marked.

### 6. Violations & Corrective Action Tracking Workflow
* Severity levels: `Low`, `Medium`, `High`, `Critical`.
* Status tracking: `Pending`, `In Progress`, `Submitted`, `Under Review`, `Completed`, `Overdue`.
* **Automatic Overdue Tracking**: Actions are automatically flagged as `Overdue` when target date passes without completion.
* Proof upload for facility managers submitting corrective actions.

### 7. Interactive Analytics & Printable Reports
* **6 Recharts Visualizations**:
  1. Compliance Score Trend (Line chart)
  2. Category Performance (Horizontal bar chart)
  3. Facility Score Comparison (Vertical bar chart)
  4. Violation Severity Distribution (Donut chart)
  5. Corrective Action Statuses (Donut chart)
  6. Monthly Inspection Volume (Bar chart)
* **Official Report Generator**: Printable inspection reports complete with government header formatting and signature sections.

---

## 🛠️ Technology Stack

### Frontend
* **Core**: React 18, Vite
* **Routing**: React Router DOM v6
* **Styling**: Tailwind CSS with custom environmental green design system
* **Charts**: Recharts
* **Icons**: Lucide React
* **HTTP Client**: Axios

### Backend
* **Runtime**: Node.js & Express.js
* **Database**: MongoDB & Mongoose ORM (Supports local MongoDB and automatic `mongodb-memory-server` fallback)
* **Authentication**: JWT & bcryptjs
* **File Storage**: Multer for image evidence uploads

---

## 📁 Project Architecture

```
swachhta-green-compliance/
├── server/
│   ├── config/          # Database connection with MongoMemoryServer fallback
│   ├── controllers/     # Auth, Facility, Inspection, Violation, Action, Standard, Analytics, Report, User, Notification
│   ├── models/          # User, Facility, ComplianceStandard, Inspection, Violation, CorrectiveAction, Notification
│   ├── middleware/      # Auth JWT, Role RBAC, Multer file upload, Error handler
│   ├── routes/          # API REST endpoints
│   ├── utils/           # Score calculator & auto-seed utility
│   ├── uploads/         # Static photo evidence storage
│   ├── .env             # Environment variables
│   ├── seed.js          # Standalone seed script
│   └── server.js        # Express backend server entry point
└── client/
    ├── src/
    │   ├── components/  # Sidebar, Navbar, KPICard, CircularGauge, EvidenceGallery, Modal
    │   ├── context/     # AuthContext
    │   ├── layouts/     # MainLayout, AuthLayout
    │   ├── pages/       # Login, Dashboard, Facilities, FacilityDetails, Inspections, NewInspection, InspectionDetails, Standards, Violations, CorrectiveActions, Reports, Analytics, Users, Settings
    │   ├── services/    # Axios API service modules
    │   ├── utils/       # Score & status formatters
    │   ├── App.jsx      # Protected router setup
    │   ├── main.jsx     # Vite entry point
    │   └── index.css    # Tailwind & custom CSS variables
    ├── index.html
    ├── vite.config.js
    └── tailwind.config.js
```

---

## 🔑 Demo Credentials

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Admin** | `admin@swachhta.gov.in` | `password123` | Full System Control & User Management |
| **Inspector** | `inspector@swachhta.gov.in` | `password123` | Conduct Inspections & Log Violations |
| **Facility Manager** | `manager@swachhta.gov.in` | `password123` | View Facility Score & Submit Corrective Actions |

*(Note: On the login page, click any of the 3 role quick-selector preset buttons for one-click auto-fill).*

---

## ⚡ Quick Start & Setup Instructions

### Prerequisites
* **Node.js**: v18.0 or higher
* **npm**: v9.0 or higher

### Installation

1. **Clone or open project directory**:
   ```bash
   cd d:\Swacha
   ```

2. **Install Backend Dependencies**:
   ```bash
   cd server
   npm install
   ```

3. **Install Frontend Dependencies**:
   ```bash
   cd ../client
   npm install
   ```

### Running the Application

1. **Start the Backend Server**:
   ```bash
   cd server
   npm run dev
   ```
   *The server runs on `http://localhost:5000/`. It connects to MongoDB or launches an in-memory database automatically, auto-seeding demo data if empty.*

2. **Start the Frontend Client**:
   ```bash
   cd client
   npm run dev
   ```
   *Open `http://localhost:3000/` or `http://localhost:3001/` in your web browser.*

3. **Database Seeding (Optional Manual Run)**:
   ```bash
   cd server
   npm run seed
   ```

---

## 📡 REST API Endpoint Reference

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Authenticate user & receive JWT
- `GET /api/auth/me` - Fetch profile of logged-in user

### Facilities
- `GET /api/facilities` - List facilities with search & status filters
- `GET /api/facilities/:id` - Get facility profile with category breakdown, audits & violations
- `POST /api/facilities` - Create new facility (Admin only)
- `PUT /api/facilities/:id` - Update facility details
- `DELETE /api/facilities/:id` - Delete facility record (Admin only)

### Inspections
- `GET /api/inspections` - List inspection audit logs
- `GET /api/inspections/:id` - Get detailed inspection report
- `POST /api/inspections` - Submit new audit with auto-scoring & photo evidence uploads
- `DELETE /api/inspections/:id` - Delete inspection record (Admin only)

### Compliance Standards
- `GET /api/standards` - Get standards list across the 7 categories
- `POST /api/standards` - Create standard criterion (Admin only)
- `PUT /api/standards/:id` - Update standard criterion
- `DELETE /api/standards/:id` - Delete standard criterion

### Violations & Corrective Actions
- `GET /api/violations` - List violations with severity & status filters
- `POST /api/violations` - Log new violation
- `GET /api/corrective-actions` - List corrective action tasks (auto-checks overdue status)
- `PUT /api/corrective-actions/:id` - Submit proof photos & update action status

### Analytics & Reports
- `GET /api/analytics/dashboard` - Get complete analytics metrics and Recharts datasets
- `GET /api/reports/inspection/:id` - Generate official printable report payload
