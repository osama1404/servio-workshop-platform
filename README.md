# Servio Workshop Platform
> **Full-stack vehicle maintenance & workshop management system: hydraulic bay conflict-resolution scheduling, digital job cards state machine, and customer telematics history.**

[![CI](https://github.com/osama1404/servio-workshop-platform/actions/workflows/ci.yml/badge.svg)](https://github.com/osama1404/servio-workshop-platform/actions)
[![React](https://img.shields.io/badge/React-18-20232A?style=flat-square&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green?style=flat-square&logo=nodedotjs)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Ready-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

---

## 🚘 Project Overview

Originated from a published Google Play automotive platform graduation project, **Servio** is designed to digitize aftermarket automotive workshops across the GCC. Independent garages frequently suffer from physical bay scheduling bottlenecks, lost paper job cards, and disconnected customer communication.

Servio decouples two core workflows:
1. **Car Owner Lifecycle:** Service booking, transparent quotation approvals, vehicle odometer history, and real-time maintenance status.
2. **Workshop Operations Hub:** Physical lift bay capacity planning, digital job cards with strict state-machine governance, technician labor assignment, and automated 5% VAT invoicing.

---

## 🏛️ System Architecture & Workflow

### 1. Job Card Lifecycle State Machine

```mermaid
stateDiagram-v2
    [*] --> DRAFT: Vehicle Check-In & Odometer Recorded
    DRAFT --> INSPECTION: Technician assigned for diagnostic scan
    INSPECTION --> ESTIMATE_APPROVED: Customer signs off on digital quote
    ESTIMATE_APPROVED --> IN_PROGRESS: Allocated to physical service bay
    IN_PROGRESS --> QA_TESTING: Mechanical labor & parts fitted
    QA_TESTING --> IN_PROGRESS: QA flags issue (Rework)
    QA_TESTING --> COMPLETED: Road test passed & QA approved
    COMPLETED --> INVOICED: Bay released & archived to vehicle history
    INVOICED --> [*]
```

---

### 2. Service Dispatch Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Car Owner
    participant App as Servio Mobile / Web
    participant API as Express API Engine
    participant BayEngine as Bay Scheduler
    participant DB as MongoDB Datastore

    Customer->>App: Book service appointment
    App->>API: POST /api/v1/job-cards (intake faults)
    API->>DB: Save Job Card (Status: DRAFT)
    Note over API,BayEngine: Supervisor schedules bay
    API->>BayEngine: Assign Hydraulic Lift Bay #1
    BayEngine-->>API: Confirm bay allocation (Status: OCCUPIED)
    Note over API: Technician completes service
    API->>API: Advance status to COMPLETED
    API->>BayEngine: Release Bay #1
    BayEngine-->>DB: Bay Status updated to AVAILABLE
    API->>DB: Push service record to vehicle history
    API-->>Customer: Push notification: Vehicle ready for collection
```

---

## 🛠️ Key Capabilities

- **Atomic Bay Conflict Prevention:** Enforces that no two active job cards occupy the same hydraulic lift or diagnostic bay simultaneously.
- **Strict State-Machine Governance:** Prevents accidental or fraudulent status jumps (e.g. prohibits billing a customer before diagnostic inspection and road-test QA are completed).
- **Dynamic Ledger & Tax Engine:** Recalculates line-item labor hours, OEM replacement parts, and 5% UAE VAT in real time.
- **Vehicle Telematics Archive:** Appends completed service records automatically into the car's permanent digital service passport.

---

## 🚀 Quickstart Guide

### Option A: Run via Docker Compose (Recommended)
```bash
# Clone the repository
git clone https://github.com/osama1404/servio-workshop-platform.git
cd servio-workshop-platform

# Spin up MongoDB, API Server, and Web Dashboard
docker compose up -d

# Dashboard will be available at http://localhost:3000
# REST API will be available at http://localhost:5000
```

### Option B: Local Node.js Execution
```bash
# 1. Backend API & Tests
cd backend
npm install
npm run build
npm test
npm start

# 2. Frontend Dashboard
cd ../frontend
npm install
npm run dev
```

---

## 📡 REST API Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/v1/health` | `GET` | Health check and engine uptime status |
| `/api/v1/workshops/:id/bays` | `GET` | Real-time bay occupancy metrics and availability |
| `/api/v1/bays/assign` | `POST` | Assign available service bay to a job card |
| `/api/v1/bays/release` | `POST` | Release service bay back to available pool |
| `/api/v1/job-cards` | `GET` | List active workshop job cards |
| `/api/v1/job-cards/:id/transition` | `POST` | Advance job card status through state machine |
| `/api/v1/job-cards/:id/items` | `POST` | Append billable labor or replacement parts |
| `/api/v1/vehicles/:id/history` | `GET` | Query vehicle service passport and maintenance logs |

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
