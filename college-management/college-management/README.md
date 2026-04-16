# 🎓 College Management System — Admin Panel

A full-featured admin panel built with **Node.js**, **MongoDB**, and **EJS**.

---

## 📁 Project Structure

```
college-management/
├── app.js                  ← Main entry point
├── seed.js                 ← One-time setup script
├── package.json
├── models/
│   ├── Admin.js
│   ├── Student.js
│   ├── Faculty.js
│   ├── Department.js
│   └── Course.js
├── routes/
│   ├── auth.js
│   ├── dashboard.js
│   ├── students.js
│   ├── faculty.js
│   ├── departments.js
│   └── courses.js
├── config/
│   └── auth.js             ← Session middleware
├── views/
│   ├── partials/
│   │   ├── header.ejs
│   │   └── footer.ejs
│   ├── auth/
│   │   ├── login.ejs
│   │   └── register.ejs
│   ├── students/
│   ├── faculty/
│   ├── departments/
│   ├── courses/
│   └── dashboard.ejs
└── public/
    ├── css/style.css
    └── js/main.js
```

---

## ⚙️ Setup Instructions

### Step 1: Prerequisites
- Node.js v16+ installed
- MongoDB Compass installed and running locally
- MongoDB running on `mongodb://127.0.0.1:27017`

### Step 2: Install Dependencies
```bash
cd college-management
npm install
```

### Step 3: Seed the Database (First Time Only)
```bash
node seed.js
```
This creates:
- Admin account: `admin@college.edu` / `admin123`
- Sample departments (CE, ME, Civil, EC)
- Sample courses (B.Tech CE, IT, ME)

### Step 4: Start the Server
```bash
npm start
# or for development with auto-reload:
npm run dev
```

### Step 5: Open in Browser
```
http://localhost:3000
```

---

## 🔐 Default Login
| Field    | Value              |
|----------|--------------------|
| Email    | admin@college.edu  |
| Password | admin123           |

---

## ✨ Features

| Module       | Actions                        |
|--------------|-------------------------------|
| Dashboard    | Stats, recent records          |
| Students     | Add, View, Edit, Delete, Filter|
| Faculty      | Add, View, Edit, Delete, Filter|
| Departments  | Add, Edit, Delete (card view)  |
| Courses      | Add, Edit, Delete              |
| Auth         | Login, Register, Logout        |

---

## 🛠️ Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose)
- **Templating**: EJS
- **Auth**: express-session + bcryptjs
- **UI**: Custom dark theme CSS, Font Awesome icons
