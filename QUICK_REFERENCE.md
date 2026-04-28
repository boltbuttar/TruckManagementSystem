# ⚡ QUICK REFERENCE CARD

## 🚀 Start Development (30 seconds)

```bash
# Terminal 1: Start Backend
cd backend && npm run dev

# Terminal 2: Start Frontend (in another terminal)
cd frontend && npm run dev

# Open browser
http://localhost:5173
```

---

## 🔑 Login Credentials

**Admin**
- Email: `admin@truckflow.com`
- Password: `admin123`

**Driver**
- Any email / any password (auto-registers)

---

## 📡 API Base URL

```
http://localhost:5000/api
```

---

## 🔗 Main Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/login` | User login |
| GET | `/drivers` | List drivers |
| POST | `/drivers` | Create driver (admin) |
| GET | `/loads` | List loads |
| POST | `/loads` | Create load |
| POST | `/loads/:id/assign` | Assign driver (admin) |
| POST | `/quotes/calculate` | Calculate price |
| GET | `/dispatch` | Real-time tracking |
| GET | `/analytics/dashboard` | Admin dashboard metrics |

---

## ✅ Full Endpoints List

**See:** `API_TESTING_REFERENCE.md` (300+ lines)

30+ endpoints documented with curl examples.

---

## 🛠️ Setup Documentation

**See:** `BACKEND_INTEGRATION_GUIDE.md` (250+ lines)

Complete setup, installation, and integration guide.

---

## 🧪 Test Example

```bash
# Get all drivers
curl http://localhost:5000/api/drivers

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@truckflow.com","password":"admin123","role":"admin"}'
```

---

## 📋 Status

| Component | Status |
|---|---|
| Backend API | ✅ Ready |
| Database | 📊 Mock (ready for MongoDB) |
| Frontend | ✅ Integrated |
| Auth | ✅ JWT Tokens |
| Admin Dashboard | ✅ Live Data |
| Driver Dashboard | ✅ Live Data |
| Public Pages | ✅ Live Data |

---

## 🚨 Troubleshooting

| Issue | Fix |
|---|---|
| Backend won't start | `cd backend && npm install && npm run dev` |
| Port 5000 in use | Kill process: `lsof -i :5000; kill -9 <PID>` |
| CORS error | Check .env has `CLIENT_URL=http://localhost:5173` |
| Login not working | Clear localStorage: `localStorage.clear()` |

---

## 📁 Key Files

```
backend/src/
├── controllers/index.js (600+ lines - ALL business logic)
├── routes/
│   ├── auth.routes.js
│   ├── driver.routes.js
│   ├── load.routes.js
│   ├── quote.routes.js
│   └── dispatch.routes.js
├── middleware/
│   ├── auth.js (JWT validation)
│   └── roleCheck.js (role-based access)
└── app.js (Express setup)

frontend/src/
├── services/api.js (400+ lines - ALL endpoints)
├── context/
│   ├── AuthContext.jsx (login/logout)
│   └── ToastContext.jsx (notifications)
└── pages/
    ├── admin/* (5 admin pages - all connected to API)
    ├── driver/* (4 driver pages - all connected to API)
    └── user/* (4 public pages - quote form connected)
```

---

## 🎯 What Works Now

✅ User registration & login  
✅ Admin can manage drivers  
✅ Admin can manage loads  
✅ Admin can assign drivers  
✅ Admin can track dispatch  
✅ Drivers can view assigned loads  
✅ Drivers can see earnings  
✅ Public can request quotes  
✅ Quote price auto-calculation  
✅ Real-time analytics  
✅ Role-based access control  
✅ Toast notifications  

---

## 🔒 Security Features

✅ JWT token authentication  
✅ Role-based access control  
✅ Protected admin endpoints  
✅ Auto token expiration (7 days)  
✅ Token stored in localStorage  
✅ CORS configured  

---

## 📊 Mock Data

- 1 admin user
- 1 sample driver
- 5 sample loads
- 5 sample quotes
- Ready for MongoDB migration

---

## 🎓 Next Steps

1. **Run servers** → `npm run dev` (both backend & frontend)
2. **Login** → admin@truckflow.com / admin123
3. **Test endpoints** → Use curl examples from API_TESTING_REFERENCE.md
4. **Add MongoDB** → When ready for persistent storage
5. **Deploy** → To production server

---

## 📞 Need Help?

1. Check `BACKEND_INTEGRATION_GUIDE.md` (setup & issues)
2. Check `API_TESTING_REFERENCE.md` (endpoint testing)
3. Check backend terminal logs (shows all requests)
4. Check browser DevTools Network tab (shows API calls)

---

## 🎉 Status

# ✅ BACKEND FULLY INTEGRATED!

Your app is ready to use with real API calls.

**Backend:** http://localhost:5000  
**Frontend:** http://localhost:5173  
**Endpoints:** 30+ endpoints ready to use

**Go build something awesome!** 🚀
