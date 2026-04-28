# 🧪 API TESTING REFERENCE

Quick reference for testing all backend endpoints.

---

## 1️⃣ START SERVERS

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

---

## 2️⃣ TEST ENDPOINTS (curl examples)

### Authentication

**Register Driver**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Driver",
    "email": "john@driver.com",
    "password": "password123",
    "phone": "(555) 123-4567",
    "cdl": "DL123456",
    "state": "CA"
  }'
```

**Login**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@truckflow.com",
    "password": "admin123",
    "role": "admin"
  }'
```

**Get Current User** (copy TOKEN from login response)
```bash
curl -H "Authorization: Bearer TOKEN_HERE" \
  http://localhost:5000/api/auth/me
```

---

### Drivers

**Get All Drivers**
```bash
curl http://localhost:5000/api/drivers
```

**With Pagination & Filters**
```bash
curl "http://localhost:5000/api/drivers?page=1&limit=5&status=Active&search=john"
```

**Get Single Driver**
```bash
curl http://localhost:5000/api/drivers/D001
```

**Get Available Drivers**
```bash
curl http://localhost:5000/api/drivers/available
```

**Create Driver** (requires admin token)
```bash
curl -X POST http://localhost:5000/api/drivers \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Driver",
    "email": "jane@driver.com",
    "phone": "(555) 987-6543",
    "cdl": "DL654321",
    "state": "NY",
    "truckMake": "Volvo",
    "truckModel": "VNL",
    "truckYear": 2021
  }'
```

**Update Driver**
```bash
curl -X PUT http://localhost:5000/api/drivers/D001 \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith Updated",
    "phone": "(555) 555-5555"
  }'
```

**Update Availability**
```bash
curl -X PATCH http://localhost:5000/api/drivers/D001/availability \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "available": false }'
```

**Delete Driver** (requires admin token)
```bash
curl -X DELETE http://localhost:5000/api/drivers/D001 \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

### Loads

**Get All Loads**
```bash
curl http://localhost:5000/api/loads
```

**With Filters**
```bash
curl "http://localhost:5000/api/loads?page=1&limit=10&status=Pending&search=chicago"
```

**Get Single Load**
```bash
curl http://localhost:5000/api/loads/L001
```

**Get Driver's Loads**
```bash
curl http://localhost:5000/api/loads/driver/D001
```

**Create Load**
```bash
curl -X POST http://localhost:5000/api/loads \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "origin": { "city": "Los Angeles", "state": "CA" },
    "destination": { "city": "San Francisco", "state": "CA" },
    "weight": 5000,
    "cargoType": "Electronics",
    "rate": 500,
    "specialInstructions": "Handle with care"
  }'
```

**Update Load**
```bash
curl -X PUT http://localhost:5000/api/loads/L001 \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "weight": 6000,
    "rate": 600
  }'
```

**Assign Driver to Load**
```bash
curl -X POST http://localhost:5000/api/loads/L001/assign \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "driverId": "D001" }'
```

**Update Load Status**
```bash
curl -X PATCH http://localhost:5000/api/loads/L001/status \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "status": "In Transit" }'
```

**Delete Load**
```bash
curl -X DELETE http://localhost:5000/api/loads/L001 \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

### Quotes

**Calculate Quote**
```bash
curl -X POST http://localhost:5000/api/quotes/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "pickup": { "city": "New York", "state": "NY" },
    "delivery": { "city": "Boston", "state": "MA" },
    "weight": 10000,
    "cargoType": "Machinery"
  }'
```

**Get All Quotes**
```bash
curl http://localhost:5000/api/quotes
```

**Get Single Quote**
```bash
curl http://localhost:5000/api/quotes/Q001
```

**Submit Quote**
```bash
curl -X POST http://localhost:5000/api/quotes \
  -H "Content-Type: application/json" \
  -d '{
    "pickup": { "city": "NYC", "state": "NY" },
    "delivery": { "city": "Boston", "state": "MA" },
    "weight": 10000,
    "cargoType": "Electronics",
    "contactName": "John Doe",
    "contactEmail": "john@company.com",
    "contactPhone": "(555) 123-4567",
    "company": "ABC Shipping"
  }'
```

**Respond to Quote** (admin only)
```bash
curl -X POST http://localhost:5000/api/quotes/Q001/respond \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Accepted",
    "message": "We accept your quote"
  }'
```

---

### Dispatch

**Get All Dispatch**
```bash
curl http://localhost:5000/api/dispatch
```

**Get Single Dispatch**
```bash
curl http://localhost:5000/api/dispatch/L001
```

**Get Status History**
```bash
curl http://localhost:5000/api/dispatch/L001/history
```

**Update Dispatch Step** (progress status)
```bash
curl -X PATCH http://localhost:5000/api/dispatch/L001/step \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "step": 3 }'
```

Status progression:
1. Order Placed
2. Driver Assigned
3. Pickup Confirmed
4. In Transit
5. Out for Delivery
6. Delivered

---

### Analytics

**Get Dashboard Analytics**
```bash
curl http://localhost:5000/api/analytics/dashboard
```

**Get Driver Statistics**
```bash
curl http://localhost:5000/api/analytics/drivers/D001
```

---

### Health Check

```bash
curl http://localhost:5000/api/health
```

Response:
```json
{ "status": "OK", "timestamp": "2024-01-15T10:30:00.000Z" }
```

---

## 3️⃣ TESTING FROM FRONTEND UI

### Admin Flow
1. Go to `http://localhost:5173/login`
2. Enter: `admin@truckflow.com` / `admin123`
3. Select role: **Admin**
4. Click "Sign In"
5. You're at `/admin/dashboard` with real backend data!

### Driver Flow
1. Go to `http://localhost:5173/login`
2. Use any email/password (will auto-create)
3. Select role: **Driver**
4. Click "Sign In"
5. You're at `/driver/dashboard` with real backend data!

### Quote Flow (Public)
1. Go to `http://localhost:5173/get-quote`
2. Fill in quote form
3. Click "Get Quote"
4. Price calculates from backend formula
5. Submit to get quote ID

---

## 4️⃣ DEBUGGING TIPS

### See All Backend Requests
Watch the backend terminal - every request shows:
```
🔵 GET /api/drivers (200)
🔵 POST /api/loads (201)
🔴 DELETE /api/drivers/D999 (404)
```

### Check Token
Decode JWT token at: https://jwt.io/
Paste your token to see claims inside.

### Network Tab
1. Open browser DevTools (F12)
2. Go to Network tab
3. Perform any action
4. See API calls and responses

### Clear Cache
```javascript
// In browser console
localStorage.clear()
location.reload()
```

### Check Response Format
All responses should look like:
```json
{
  "success": true,
  "message": "...",
  "data": { /* ... */ }
}
```

---

## ✅ SUCCESS CHECKLIST

- [ ] Backend server starts without errors
- [ ] Can GET /health successfully
- [ ] Can login and receive token
- [ ] Can retrieve drivers list
- [ ] Can create new load
- [ ] Can assign driver to load
- [ ] Can update load status
- [ ] Can calculate quote
- [ ] Frontend dashboard shows backend data
- [ ] No CORS errors in browser console

---

## 🚨 TROUBLESHOOTING

| Issue | Solution |
|-------|----------|
| 404 on any endpoint | Check backend server is running on port 5000 |
| CORS error | Check .env CLIENT_URL = http://localhost:5173 |
| Token invalid | Clear localStorage and login again |
| Port 5000 in use | Kill process: `lsof -i :5000; kill -9 <PID>` |
| No response | Check backend server logs for errors |

---

Good luck! 🚀
