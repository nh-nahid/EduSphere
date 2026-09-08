# EduSphere 🏫

> A multi-tenant, role-based School Management SaaS platform featuring WhatsApp-powered parent alerts, automated fee invoicing, and a cross-school super admin network.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express%205-green?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

---

## 📌 Overview

EduSphere is a full-stack, enterprise-grade school management system built on a **multi-tenant SaaS architecture**. Each school operates as an isolated tenant with its own data while a global **super admin** oversees the entire network. The platform handles academics, attendance, fee collection, WhatsApp notifications, and more — all under a single unified dashboard.

---

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication with access and refresh tokens stored in `httpOnly` cookies
- Four hierarchical roles: `super_admin`, `admin`, `teacher`, `student`
- Account deactivation middleware guards blocking inactive users at both login and API layers

### 🏫 Multi-Tenant Architecture
- Every document scoped by `schoolId` via `injectSchool` middleware
- Super admin bypasses tenant filters to access global network metrics
- School tenant registry with plan badges (`basic` / `pro`) and suspend/activate controls

### 📊 Super Admin Dashboard
- Cross-school analytics: total schools, students, teachers, revenue
- Registered school tenant table with status toggle
- System user management with role pills and block/activate controls

### 📚 Academic Management
- **Students** — CRUD, class enrollment, guardian contact info
- **Teachers** — CRUD, subject and class assignments
- **Classes** — section management, student enrollment, subject linking
- **Subjects** — class-level subject catalog
- **Assignments** — file upload support with PDF attachment
- **Submissions** — student uploads, teacher grading and feedback
- **Grades** — exam type tracking (first term, second term, final, unit test), report card generation

### 📋 Attendance
- Daily class attendance marking by teachers (present / absent / late)
- Monthly attendance report with summary statistics
- Student self-view of personal attendance records

### 📢 Notice Board
- Role-targeted announcements (all / teacher / student)
- Admin and teacher publish permissions
- Real-time notification bell in header with recent notice preview

### 💳 Fee & Payment
- Fee records per class with due dates and academic year
- **SSLCommerz** payment gateway integration
- Automated **PDF invoice generation** (PDFKit) on successful payment
- Fire-and-forget parent SMS alert on payment confirmation

### 📱 WhatsApp Notification System (Meta Cloud API)
- Automated alerts on: student absence, grade published, fee paid, notice created, admission confirmed
- 8 quick-dispatch message templates (Absent, Late, Fee Due, Fee Paid, Exam, Holiday, Result, Admission)
- Bangladesh phone number normalization (`01xxx` → `8801xxx`)
- Full delivery status logging to `SmsLog` collection in MongoDB

### 🔍 Global Search & Notifications
- Header omni-search querying students, teachers, and classes in real time
- Notification bell with recent notices dropdown

### 👤 User Profile
- View and edit personal details (name, phone)
- Secure password change form with current password verification

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16 (App Router, Turbopack), TypeScript, Tailwind CSS v4, Shadcn/ui |
| **State & Data** | TanStack Query v5, Axios |
| **Backend** | Node.js, Express 5 |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **Auth** | JWT (access + refresh tokens), bcryptjs, httpOnly cookies |
| **Notifications** | Meta WhatsApp Cloud API |
| **Payments** | SSLCommerz |
| **File Generation** | PDFKit (fee invoices) |
| **File Uploads** | Multer (avatars, assignment documents) |
| **Email** | Nodemailer (SMTP) |
| **OOP Pattern** | Abstract `PaymentGateway` → `SSLCommerzGateway` → `PaymentService` |

---

## 🗂️ Project Structure

```
EduSphere/
├── server/                        # Express 5 REST API
│   ├── controllers/               # 16 route controllers
│   ├── models/                    # 14 Mongoose models
│   ├── routers/                   # 16 Express routers
│   ├── middlewares/
│   │   ├── common/                # checkLogin · requireRole · injectSchool · errorHandler
│   │   ├── users/                 # avatarUpload (Multer)
│   │   └── files/                 # documentUpload (Multer)
│   ├── services/
│   │   └── payment/               # PaymentGateway (abstract) · SSLCommerzGateway · PaymentService
│   ├── utils/                     # jwt · email · sms · generateFeeInvoice
│   ├── emails/templates/          # welcome · resetPassword · feeReceipt · admissionConfirm
│   ├── public/                    # avatars/ · documents/ · invoices/
│   ├── app.js
│   └── server.js
│
└── frontend/                      # Next.js 16 App Router
    ├── app/
    │   ├── (auth)/                # login · forgot-password
    │   ├── (dashboard)/           # 14 protected route groups
    │   └── payment/               # success · fail · cancel callbacks
    ├── features/                  # 13 feature modules (types · api · hooks · components)
    ├── components/
    │   ├── layout/                # Sidebar · Header (search + notifications)
    │   └── shared/                # DataTable · PageHeader · StatsCard · FileUploader
    ├── providers/                 # AuthProvider · QueryProvider
    └── lib/                       # axios · utils
```

---

## 🔑 Demo Credentials

> All demo accounts use the same password: **`Password@123`**

### 🌐 Super Admin *(Global Network Access)*

| Email | Password |
|---|---|
| `superadmin@schoolms.com` | `Password@123` |

---

### 🏫 School Admin

| Email | Password | School |
|---|---|---|
| `admin@greenvalley.edu.bd` | `Password@123` | Green Valley Academy (Pro) |
| `admin@sunrise.edu.bd` | `Password@123` | Sunrise International School (Basic) |

---

### 🧑‍🏫 Teacher

| Email | Password | School |
|---|---|---|
| `kamal@greenvalley.edu.bd` | `Password@123` | Green Valley Academy |
| `fatema@greenvalley.edu.bd` | `Password@123` | Green Valley Academy |
| `arif@sunrise.edu.bd` | `Password@123` | Sunrise International School |
| `sadia@sunrise.edu.bd` | `Password@123` | Sunrise International School |

---

### 🎓 Student

| Email | Password | School |
|---|---|---|
| `abir@student.gv.bd` | `Password@123` | Green Valley Academy |
| `riya@student.gv.bd` | `Password@123` | Green Valley Academy |
| `rafiq@student.sr.bd` | `Password@123` | Sunrise International School |
| `lamia@student.sr.bd` | `Password@123` | Sunrise International School |

---

## ⚙️ Getting Started

### Prerequisites
- Node.js `v18+`
- MongoDB Atlas account (or local MongoDB)
- Meta Developer account (for WhatsApp API)
- pnpm `v8+` (for frontend)

---

### 1. Clone the Repository

```bash
git clone https://github.com/nh-nahid/EduSphere.git
cd EduSphere
```

---

### 2. Backend Setup

```bash
cd server
npm install
cp .env.example .env
```

Fill in your `.env` values:

```env
PORT=5000
MONGO_CONNECTION_STRING=mongodb+srv://<user>:<password>@cluster.mongodb.net/edusphere

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
COOKIE_SECRET=your_cookie_secret

FRONTEND_URL=http://localhost:3000

# WhatsApp Cloud API
WHATSAPP_TOKEN=your_meta_whatsapp_token
WHATSAPP_PHONE_ID=your_phone_number_id

# SSLCommerz (Payment Gateway)
SSL_STORE_ID=your_store_id
SSL_STORE_PASSWORD=your_store_password
SSL_IS_LIVE=false

# SMTP (Email)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
```

Start the backend:

```bash
node server.js
# API will be running at http://localhost:5000
```

---

### 3. Frontend Setup

```bash
cd frontend
pnpm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

Start the frontend:

```bash
pnpm dev
# App will be running at http://localhost:3000
```

---

## 🔌 API Reference

All routes are prefixed with `/api/v1`

| Resource | Path | Key Operations |
|---|---|---|
| 🔐 Auth | `/auth` | register · login · logout · refresh-token · forgot-password · reset-password · me |
| 👥 Users | `/users` | profile · update · change-password · avatar-upload |
| 🏫 Schools | `/schools` | create · list · update · toggle-status *(super_admin)* |
| 🎓 Students | `/students` | CRUD · my-profile · filter-by-class |
| 🧑‍🏫 Teachers | `/teachers` | CRUD |
| 🏛️ Classes | `/classes` | CRUD · enroll-students · assign-teacher |
| 📚 Subjects | `/subjects` | CRUD |
| 📋 Attendance | `/attendance` | mark · by-class · my-attendance · monthly-summary |
| 📊 Grades | `/grades` | record · by-student · report-card |
| 📝 Assignments | `/assignments` | CRUD · file-upload |
| 📤 Submissions | `/submissions` | submit · grade · by-assignment · my-submissions |
| 📢 Notices | `/notices` | create · list *(role-filtered)* · delete |
| 💳 Fees | `/fees` | create · list · by-student |
| 💰 Payments | `/payment` | initiate · success · fail · cancel · download-invoice |
| 📱 SMS/WhatsApp | `/sms` | logs · manual-send |
| 📊 Admin | `/admin` | stats · monthly-fees · top-performers · users · toggle-user |

---

## 👤 Roles & Permissions

| Module | super_admin | admin | teacher | student |
|---|---|---|---|---|
| Schools | ✅ Full | ❌ | ❌ | ❌ |
| Students | ✅ | ✅ | 👁️ Read | 👁️ Own Profile |
| Teachers | ✅ | ✅ | 👁️ Read | ❌ |
| Attendance | ✅ | ✅ | ✅ Mark | 👁️ Own |
| Grades | ✅ | ✅ | ✅ Record | 👁️ Own |
| Assignments | ✅ | ✅ | ✅ Create | ✅ Submit |
| Notices | ✅ | ✅ | ✅ Create | 👁️ View |
| Fees | ✅ | ✅ | ❌ | 👁️ Own + Pay |
| WhatsApp Logs | ✅ | ✅ | ❌ | ❌ |
| Admin Dashboard | ✅ | ✅ | ❌ | ❌ |

---

## 🏗️ OOP Architecture — Payment Gateway

The payment system is built using **Abstraction**, **Inheritance**, and **Dependency Injection**:

```
PaymentGateway (Abstract Base Class)
    └── SSLCommerzGateway (Concrete Implementation)
            └── injected into → PaymentService (Business Logic Orchestrator)
```

This design makes it trivial to plug in a new gateway (e.g., bKash, Nagad, Stripe) by simply extending `PaymentGateway` — without modifying any business logic.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🤝 Author

**Nahid** — [GitHub](https://github.com/nh-nahid)
