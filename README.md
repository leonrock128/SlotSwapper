# 🎯 SlotSwapper — Event Swap Web App

SlotSwapper is a full-stack web application that allows users to **create, view, and swap event slots** with others.  
It includes secure authentication, an interactive marketplace, and responsive UI.

---

## 🚀 Tech Stack

### Frontend
- ⚛️ **React + Vite**
- 🧩 **React Router**
- 🎨 **Tailwind CSS**
- 🔒 **Axios** for API requests
- 💬 **Lucide React** icons

### Backend
- 🟢 **Node.js / Express.js**
- 🧱 **MongoDB + Mongoose**
- 🔑 **JWT Authentication**

---

## 📂 Folder Structure
```
project-root/
│
├── frontend/          # React + Vite app
│ ├── src/
│ │ ├── components/    # Reusable UI components
│ │ ├── context/       # AppContext.js (Global state)
│ │ ├── pages/         # Pages like Login, Register, Marketplace
│ │ ├── utils/         # API helpers (api.js)
│ │ └── main.jsx       # Entry point
│ ├── package.json
│ └── vite.config.js
│
├── backend/           # Express backend
│ ├── controllers/     # Request handlers
│ ├── models/          # MongoDB models
│ ├── routes/          # API routes
│ ├── middleware/      # Auth middleware (JWT)
│ ├── server.js        # Entry point
│ └── .env
│
└── README.md
```

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository
```
git clone https://github.com/your-username/slotswapper.git
cd slotswapper
```
### 2️⃣ Setup Backend
```
cd backend
npm install
```

Create a .env file inside backend/:
```
PORT=5000
MONGO_URI=mongodb+srv://<your_mongodb_uri>
JWT_SECRET=your_jwt_secret_key

```
Run Backend:
```
npm run server
```
### 3️⃣ Setup Frontend
```
cd frontend
npm install
```

Create a .env file inside frontend/:
```
VITE_BACKEND_URL=http://localhost:5000
```
Run Frontend:
```
npm run dev
```

## 🔑 Authentication Flow
- Users can Register and Login
- JWT is stored in localStorage
- Context (AppContext.js) keeps the user logged in even after page refresh
- Unauthorized actions (e.g., creating or swapping events without login) trigger a Login modal popup

## 🧠 Important Files
### ✅ AppContext.js
Handles:
- Login, Register, Logout
- Fetching events and marketplace data
- Requesting and responding to swaps
- Storing token and user info persistently

### ✅ LoginModal.jsx
- Opens automatically when a user tries to perform restricted actions.
- Has background overlay and animation.
- Closes on outside click or successful login.

### ✅ Register.jsx
- Allows users to sign up.
- Password visibility toggle.
- Navigates to dashboard after successful registration.

### 💅 Features
- 🔐 Secure JWT Authentication
- 🔁 Swap Requests and Responses
- 🧾 My Events Dashboard
- 🏪 Marketplace of available events
- 🧭 Active navigation highlighting
- 💻 Fully responsive layout
- 🪟 Login modal with background overlay
- ⚡ Fast setup with Vite + React Context API

### 🧭 Frontend Routes Overview

| Route        | Description                  |
|---------------|------------------------------|
| `/`           | Home / Marketplace           |
| `/login`      | Login Page                   |
| `/register`   | Register Page                |
| `/myevents`   | User’s Events                |
| `/swaps`      | Swap Requests (incoming/outgoing) |

---

### 🧰 Backend API Endpoints

| Method | Endpoint                | Description                |
|---------|--------------------------|-----------------------------|
| POST    | `/api/users/register`    | Register new user           |
| POST    | `/api/users/login`       | Login existing user         |
| GET     | `/api/events/me`         | Fetch user’s events         |
| POST    | `/api/events`            | Create new event            |
| GET     | `/api/events/swappable`  | Fetch swappable events      |
| POST    | `/api/swaps/request`     | Request a swap              |
| POST    | `/api/swaps/:id/respond` | Accept or reject swap       |

### 👩‍💻 Contributing

Pull requests are welcome!
For major updates, open an issue first to discuss what you’d like to change.

### 📜 License

MIT License © 2025 SlotSwapper Team

### 🌐 Live Demo 

https://slotswapper.vercel.app
