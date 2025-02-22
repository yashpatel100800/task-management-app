# 📝 Task Management App

## 🚀 Project Overview
This project is a **Task Management App** where users can:
- **Sign up and log in** using JWT authentication.
- **Create, update, and delete tasks**.
- **Assign tasks** to other registered users.
- **Filter tasks** by status (TODO, IN_PROGRESS, DONE).
- Use **Zod** for input validation.
- Use **React Hooks** for state management.
- Use **Recoil** for global state management.
- Implement **Middleware** for authentication.
- Style with **Tailwind CSS** for modern and responsive design.

---

## 🏗️ **Tech Stack**
### 🔹 Backend:
- **Node.js + Express** – Server and API development.
- **Prisma ORM** – Database interactions.
- **PostgreSQL** – Relational database.
- **JWT Authentication** – Secure user login.
- **Zod Validation** – Request and response validation.
- **Middleware** – Protecting routes.

### 🔹 Frontend:
- **React + TypeScript** – Frontend development.
- **React Hooks** – Handling UI logic.
- **Recoil** – Global state management.
- **Tailwind CSS** – Modern and responsive styling.

---

## 📂 **Project Structure**
```
/task-management-app
│── backend/
│   ├── prisma/            # Prisma schema
│   ├── src/
│   │   ├── controllers/   # API logic
│   │   ├── middlewares/   # Authentication middleware
│   │   ├── models/        # Prisma models
│   │   ├── routes/        # Express routes
│   │   ├── server.ts      # Main backend entry point
│── frontend/
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Pages (Login, Dashboard, Tasks)
│   │   ├── recoil/        # Global state management
│   │   ├── hooks/         # Custom React Hooks
│   │   ├── App.tsx        # Main React App
│   ├── tailwind.config.js # Tailwind Configuration
│── .env                   # Environment variables
│── README.md              # Project Documentation
```

---

## 🔑 **Setup Instructions**

### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/yashpatel100800/task-management-app.git
cd task-management-app
```

### **2️⃣ Backend Setup**
#### **Install dependencies**
```sh
cd backend
npm install
```

#### **Set up environment variables (`.env`)**
```
DATABASE_URL=postgresql://user:password@localhost:5432/taskdb
JWT_SECRET=your_secret_key
PORT=5000
```

#### **Run Prisma migrations**
```sh
npx prisma migrate dev --name init
```

#### **Start the backend server**
```sh
npm run dev
```

---

### **3️⃣ Frontend Setup**
#### **Install dependencies**
```sh
cd frontend
npm install
```

#### **Set up Tailwind CSS**
1. Install Tailwind CSS via npm:
    ```sh
    npm install -D tailwindcss postcss autoprefixer
    npx tailwindcss init -p
    ```
2. Configure `tailwind.config.js`:
    ```js
    module.exports = {
      purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
      darkMode: false, // or 'media' or 'class'
      theme: {
        extend: {},
      },
      variants: {
        extend: {},
      },
      plugins: [],
    }
    ```
3. Add Tailwind directives to your CSS:
    ```css
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    ```

#### **Start the React app**
```sh
npm run dev
```

---

## 🔍 **API Endpoints**
| Method | Endpoint          | Description                         | Auth Required |
|--------|------------------|-------------------------------------|--------------|
| POST   | `/api/auth/signup`  | Register a new user                | ❌ No        |
| POST   | `/api/auth/login`   | User login, returns JWT token      | ❌ No        |
| GET    | `/api/tasks`       | Fetch all tasks                    | ✅ Yes       |
| POST   | `/api/tasks`       | Create a new task                  | ✅ Yes       |
| PUT    | `/api/tasks/:id`   | Update task status or assignment   | ✅ Yes       |
| DELETE | `/api/tasks/:id`   | Delete a task                      | ✅ Yes       |

---

## 📚 **Concepts Practiced**
- **Prisma ORM:** Database modeling, queries, and migrations.
- **Zod Validation:** Ensuring type-safe data validation.
- **JWT Authentication:** Secure login and protected API routes.
- **React + TypeScript:** Strongly typed UI development.
- **React Hooks:** State and lifecycle management.
- **React Recoil:** Global state management.
- **Middleware:** Securing routes and handling authentication.
- **Tailwind CSS:** Fast and responsive styling.

---

## 🛠️ **Future Improvements**
- Implement task **due dates and deadlines**.
- Add **real-time notifications** for task updates.
- Implement **role-based access control (RBAC)**.
- Improve **UI/UX** with better design.

---

## 📌 **Author**
👨‍💻 **Yash**  
📧 **Contact@yashpatel.site**  
🔗 [GitHub](https://github.com/yourusername)  
🔗 [LinkedIn](https://linkedin.com/in/yourprofile)

---

## 🎯 **Final Notes**
This project is designed to practice **full-stack development** with a focus on **modern web technologies**. Complete all features, test functionality, and experiment with enhancements.

🚀 Happy Coding! 🎯
# README.md

# 📝 Task Management App

## 🚀 Project Overview
This project is a **Task Management App** where users can:
- **Sign up and log in** using JWT authentication.
- **Create, update, and delete tasks**.
- **Assign tasks** to other registered users.
- **Filter tasks** by status (TODO, IN_PROGRESS, DONE).
- Use **Zod** for input validation.
- Use **React Hooks** for state management.
- Use **Recoil** for global state management.
- Implement **Middleware** for authentication.
- Style with **Tailwind CSS**.

---

## 🏗️ **Tech Stack**
### 🔹 Backend:
- **Node.js + Express** – Server and API development.
- **Prisma ORM** – Database interactions.
- **PostgreSQL** – Relational database.
- **JWT Authentication** – Secure user login.
- **Zod Validation** – Request and response validation.
- **Middleware** – Protecting routes.

### 🔹 Frontend:
- **React + TypeScript** – Frontend development.
- **React Hooks** – Handling UI logic.
- **Recoil** – Global state management.
- **Tailwind CSS** – Styling.

---

## 📂 **Project Structure**
```
/task-management-app
│── backend/
│   ├── prisma/            # Prisma schema
│   ├── src/
│   │   ├── controllers/   # API logic
│   │   ├── middlewares/   # Authentication middleware
│   │   ├── models/        # Prisma models
│   │   ├── routes/        # Express routes
│   │   ├── server.ts      # Main backend entry point
│── frontend/
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Pages (Login, Dashboard, Tasks)
│   │   ├── recoil/        # Global state management
│   │   ├── hooks/         # Custom React Hooks
│   │   ├── App.tsx        # Main React App
│   ├── tailwind.config.js # Tailwind Configuration
│── .env                   # Environment variables
│── README.md              # Project Documentation
```

---

## 🔑 **Setup Instructions**

### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/yashpatel100800/task-management-app.git
cd task-management-app
```

### **2️⃣ Backend Setup**
#### **Install dependencies**
```sh
cd backend
npm install
```

#### **Set up environment variables (`.env`)**
```
DATABASE_URL=postgresql://user:password@localhost:5432/taskdb
JWT_SECRET=your_secret_key
PORT=5000
```

#### **Run Prisma migrations**
```sh
npx prisma migrate dev --name init
```

#### **Start the backend server**
```sh
npm run dev
```

---

### **3️⃣ Frontend Setup**
#### **Install dependencies**
```sh
cd frontend
npm install
```

#### **Start the React app**
```sh
npm run dev
```

---

## 🔍 **API Endpoints**
| Method | Endpoint          | Description                         | Auth Required |
|--------|------------------|-------------------------------------|--------------|
| POST   | `/api/auth/signup`  | Register a new user                | ❌ No        |
| POST   | `/api/auth/login`   | User login, returns JWT token      | ❌ No        |
| GET    | `/api/tasks`       | Fetch all tasks                    | ✅ Yes       |
| POST   | `/api/tasks`       | Create a new task                  | ✅ Yes       |
| PUT    | `/api/tasks/:id`   | Update task status or assignment   | ✅ Yes       |
| DELETE | `/api/tasks/:id`   | Delete a task                      | ✅ Yes       |

---

## 📚 **Concepts Practiced**
- **Prisma ORM:** Database modeling, queries, and migrations.
- **Zod Validation:** Ensuring type-safe data validation.
- **JWT Authentication:** Secure login and protected API routes.
- **React + TypeScript:** Strongly typed UI development.
- **React Hooks:** State and lifecycle management.
- **React Recoil:** Global state management.
- **Middleware:** Securing routes and handling authentication.
- **Tailwind CSS:** Fast and responsive styling.

---

## 🛠️ **Future Improvements**
- Implement task **due dates and deadlines**.
- Add **real-time notifications** for task updates.
- Implement **role-based access control (RBAC)**.
- Improve **UI/UX** with better design.

---

## 📌 **Author**
👨‍💻 **Yash**  
📧 **Contact@yashpatel.site**  
🔗 [GitHub](https://github.com/yourusername)  
🔗 [LinkedIn](https://linkedin.com/in/yourprofile)

---

## 🎯 **Final Notes**
This project is designed to practice **full-stack development** with a focus on **modern web technologies**. Complete all features, test functionality, and experiment with enhancements.

🚀 Happy Coding! 🎯