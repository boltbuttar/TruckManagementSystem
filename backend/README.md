# 🚛 TruckFlow Backend API

RESTful API server for TruckFlow Dispatch Management System built with Node.js and Express.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm 8+

### Installation

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev
```

Server runs on: `http://localhost:5000`

---

## 📁 Project Structure

```
backend/
├── server.js              # Entry point
├── package.json           # Dependencies
├── .env.example          # Environment template
├── src/
│   ├── app.js            # Express app configuration
│   ├── controllers/
│   │   └── index.js      # All controllers & business logic (600+ lines)
│   ├── middleware/
│   │   ├── auth.js       # JWT authentication
│   │   └── roleCheck.js  # Role-based access control
│   ├── models/           # Database schemas (MongoDB ready)
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── driver.routes.js
│   │   ├── load.routes.js
│   │   ├── quote.routes.js
│   │   └── dispatch.routes.js
│   └── config/
│       └── db.js         # Database connection
└── .gitignore
```

---

## 🔧 Available Scripts

```bash
# Start development server (with auto-reload)
npm run dev

# Start production server
npm start

# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

---

## 🛣️ API Routes

### Base URL
```
http://localhost:5000/api
```

### Route Groups

| Route | Controllers |
|-------|---|
| `/auth` | Register, Login, GetMe |
| `/drivers` | CRUD operations, availability |
| `/loads` | CRUD operations, assignments, status updates |
| `/quotes` | Calculate, submit, respond |
| `/dispatch` | Tracking, status history |
| `/analytics` | Dashboard metrics, driver stats |
| `/health` | Server health check |

---

## 📝 Complete Endpoint List

### Authentication (3 endpoints)
```
POST   /auth/register    - Register new driver
POST   /auth/login       - Login (get JWT token)
GET    /auth/me          - Get current user (protected)
```

### Drivers (7 endpoints)
```
GET    /drivers                    - List all drivers (paginated)
GET    /drivers/:id                - Get driver by ID
GET    /drivers/available          - Get available drivers
POST   /drivers                    - Create driver (admin only)
PUT    /drivers/:id                - Update driver (admin only)
DELETE /drivers/:id                - Delete driver (admin only)
PATCH  /drivers/:id/availability   - Update availability (admin only)
```

### Loads (8 endpoints)
```
GET    /loads                      - List all loads (paginated)
GET    /loads/:id                  - Get load by ID
GET    /loads/driver/:driverId     - Get driver's loads
POST   /loads                      - Create load
PUT    /loads/:id                  - Update load (admin only)
DELETE /loads/:id                  - Delete load (admin only)
POST   /loads/:id/assign           - Assign driver to load (admin only)
PATCH  /loads/:id/status           - Update load status (admin only)
```

### Quotes (5 endpoints)
```
POST   /quotes/calculate           - Calculate quote price
GET    /quotes                     - List all quotes
POST   /quotes                     - Submit new quote
GET    /quotes/:id                 - Get quote by ID
POST   /quotes/:id/respond         - Respond to quote (admin only)
```

### Dispatch (4 endpoints)
```
GET    /dispatch                   - List all loads for dispatch
GET    /dispatch/:id               - Get dispatch load details
PATCH  /dispatch/:id/step          - Update dispatch step (admin only)
GET    /dispatch/:id/history       - Get status history
```

### Analytics (2 endpoints)
```
GET    /analytics/dashboard        - Get dashboard metrics
GET    /analytics/drivers/:id      - Get driver statistics
```

### Health Check (1 endpoint)
```
GET    /health                     - Server health status
```

---

## 🔐 Authentication

### JWT Token

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token_here>
```

### Token Structure
- Header: `{ alg: "HS256", typ: "JWT" }`
- Payload: `{ id, email, name, role, exp }`
- Signature: Signed with JWT_SECRET

### Token Expiration
- Default: 7 days
- Set in: `backend/src/controllers/index.js`

---

## 👥 Roles & Permissions

### Admin Role
- Can create/update/delete drivers
- Can manage all loads
- Can assign drivers to loads
- Can update load status
- Can respond to quotes
- Can view all analytics

### Driver Role
- Can view own loads
- Can view own profile
- Can see personal earnings
- Can accept available loads

### Public (No Auth)
- Can submit quote requests
- Can calculate quote prices

---

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "id": "D001",
    "name": "John Smith",
    ...
  },
  "total": 10,
  "page": 1,
  "limit": 10
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## 🧪 Testing Endpoints

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@truckflow.com",
    "password": "admin123",
    "role": "admin"
  }'
```

### Protected Request (with token)
```bash
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  http://localhost:5000/api/drivers
```

**See:** `API_TESTING_REFERENCE.md` for 50+ examples

---

## 📊 Database

### Current: Mock In-Memory
- Data stored in arrays
- Lost on server restart
- Perfect for development & testing
- Ready for production migration

### Data Models
```javascript
// Users
{ id, name, email, password, phone, role, createdAt }

// Drivers
{ id, name, email, phone, cdl, state, available, rating, totalLoads, earnings }

// Loads
{ id, origin, destination, weight, cargoType, status, driverId, rate, createdAt }

// Quotes
{ id, pickup, delivery, weight, cargoType, status, contactInfo, price, createdAt }

// Requests
{ id, type, status, data, createdAt }
```

### Future: MongoDB
When ready to persist data:
1. Create MongoDB Atlas account
2. Get connection string
3. Update `.env` with `MONGODB_URI`
4. Models in `src/models/` are ready to use
5. Uncomment `connectDB()` in server.js

---

## 🔄 Pagination

List endpoints support pagination:

```
GET /api/drivers?page=1&limit=10
```

Parameters:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

Response includes:
```json
{
  "total": 45,
  "page": 1,
  "limit": 10,
  "pages": 5,
  "data": [...]
}
```

---

## 🔍 Filtering & Search

List endpoints support filtering:

```
GET /api/drivers?status=Active&search=john
GET /api/loads?status=Pending&search=chicago
GET /api/quotes?status=Pending
```

---

## 🚨 Error Handling

### Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

### Error Response
```json
{
  "success": false,
  "message": "Detailed error message"
}
```

---

## ⚙️ Environment Variables

Create `.env` file:

```env
# Server
PORT=5000
NODE_ENV=development

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173

# JWT Secret (change in production!)
JWT_SECRET=your-super-secret-key-change-in-production-12345

# Database (optional, for MongoDB)
MONGODB_URI=mongodb://localhost:27017/truckflow
```

---

## 🔒 Security

- JWT authentication for protected endpoints
- Role-based access control (RBAC)
- CORS configured for frontend
- Environment variables for sensitive data
- Password validation on registration
- Token expiration (7 days)

### Production Checklist
- [ ] Change `JWT_SECRET` to strong random value
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS
- [ ] Set up MongoDB
- [ ] Add rate limiting
- [ ] Add input validation
- [ ] Add request logging
- [ ] Set up error monitoring
- [ ] Configure firewall rules
- [ ] Use environment variables for all secrets

---

## 📝 Mock Data

Default test data included:

**Admin User**
- Email: `admin@truckflow.com`
- Password: `admin123`

**Sample Driver**
- ID: D001
- Name: John Smith
- Status: Active
- Rating: 4.8

**Sample Loads**
- 5 loads with various statuses
- Different origins/destinations
- Sample prices and weights

**Sample Quotes**
- 5 quote requests
- Various statuses

---

## 🧩 Integration

The backend is pre-integrated with frontend at `frontend/src/services/api.js`:

Frontend automatically calls:
- All CRUD endpoints
- Authentication endpoints
- Analytics endpoints
- Quote endpoints

No additional setup needed - just run both servers!

---

## 🐛 Troubleshooting

| Issue | Solution |
|---|---|
| Port 5000 in use | Change PORT in .env or kill process |
| Module not found | Run `npm install` |
| Cannot find token | Check JWT_SECRET in .env matches |
| CORS error | Check CLIENT_URL in .env |
| Nodemon not working | Install globally: `npm install -g nodemon` |

---

## 📚 Documentation

- **BACKEND_INTEGRATION_GUIDE.md** - Full integration guide
- **API_TESTING_REFERENCE.md** - Testing examples
- **QUICK_REFERENCE.md** - Quick reference card
- **INTEGRATION_STATUS.md** - Integration status
- **Frontend API Service** - `frontend/src/services/api.js`

---

## 🚀 Deployment

### Heroku
```bash
heroku create truckflow-api
git push heroku main
```

### AWS
```bash
# Use Elastic Beanstalk or EC2
# Configure security groups for port 5000
```

### Docker
```bash
docker build -t truckflow-api .
docker run -p 5000:5000 truckflow-api
```

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review API_TESTING_REFERENCE.md
3. Check backend terminal logs
4. Check browser Network tab
5. Clear cache and restart servers

---

## 📄 License

ISC

---

## 👥 Team

TruckFlow Development Team

---

**Status: ✅ Ready to Use**

```bash
npm run dev
# 🚛 TruckFlow API running on http://localhost:5000
```

Happy coding! 🎉
