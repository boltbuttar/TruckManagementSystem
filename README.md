# 🚛 TruckFlow – Truck Management System

A full-stack dispatch management system for tracking trucks, drivers, loads, and quotes in real time.

## 🌐 Live Demo

> **[https://frontend-production-c848.up.railway.app/](https://frontend-production-c848.up.railway.app/)**

---

## 📦 Project Structure

```
TruckManagementSystem/
├── frontend/   # React + Vite frontend
└── backend/    # Node.js + Express REST API
```

---

## ✨ Features

- **Home & Services** – Landing page, service showcase, testimonials
- **Quote System** – 4-step quote request form with instant price calculation
- **Driver Portal** – Driver registration & login
- **Admin Dashboard** – KPI metrics, driver/load/dispatch management
- **Dispatch Tracking** – Real-time load status updates
- **Dark Mode** – Full dark/light mode support
- **Responsive** – Works on mobile, tablet, and desktop

---

## 🚀 Getting Started Locally

### Frontend

```bash
cd frontend
npm install
npm run dev
# Visit http://localhost:5173
```

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
# API at http://localhost:5000
```

**Default admin credentials:**
- Email: `admin@truckflow.com`
- Password: `admin123`

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, React Router 7 |
| Backend | Node.js, Express |
| Auth | JWT (Role-based: Admin / Driver) |
| Styling | CSS Custom Properties, Grid, Flexbox |
| Deployment | Railway |

---

## 📄 Documentation

- [`frontend/README_FRONTEND.md`](frontend/README_FRONTEND.md) – Frontend overview & integration guide
- [`backend/README.md`](backend/README.md) – API endpoints & backend reference

---

## 📄 License

ISC
