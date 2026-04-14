<div align="center">

# 🔨 OpsForge

### Forge Your Cloud, DevOps & SRE Interview Skills

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)]()
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)]()
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)]()
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)]()
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)]()
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)]()

**300+ real interview questions · 12 topics · Easy / Medium / Hard · AWS focused**

---

> Built with ❤️ by **[Zain Raza Jafri](https://linkedin.com/in/zainjafri4)**  
> 🐙 [github.com/zainjafri4](https://github.com/zainjafri4) · 💼 [linkedin.com/in/zainjafri4](https://linkedin.com/in/zainjafri4)

</div>

---

## 📖 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Topics Covered](#️-topics-covered)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Key Features](#-key-features-in-detail)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📚 **Structured Learning** | 12 topics with Easy, Medium, Hard theory + scenario content |
| 🧪 **Randomized Tests** | 20-question tests with fully randomized questions and option order |
| 🔍 **Wrong Answer Review** | Detailed explanations for every wrong answer after submission |
| 📊 **Progress Tracking** | Per-topic progress tracking across all difficulty levels |
| 🔐 **JWT Auth** | Secure access + refresh token flow with bcrypt password hashing |
| 🌓 **Dark Mode** | Full dark/light mode support with system preference detection |
| 📱 **Responsive** | Mobile-first design, works on all screen sizes |
| ⚡ **Real-time Timer** | Countdown timer on quizzes with auto-submit |
| 🏆 **Score History** | Track your improvement over time with trend charts |

---

## 🛠 Tech Stack

### Backend
- **NestJS** — Modular Node.js framework with TypeScript
- **Prisma** — Type-safe ORM with PostgreSQL
- **JWT** — Access (15m) + Refresh (7d) token strategy
- **Swagger** — Auto-generated API docs at `/api/docs`
- **bcrypt** — Password hashing with salt rounds = 12
- **Helmet + Throttler** — Security middleware

### Frontend
- **Next.js 14** — App Router with Server Components
- **Tailwind CSS + shadcn/ui** — Utility-first styling
- **Zustand** — Lightweight global state management
- **TanStack Query** — Server state with caching
- **Framer Motion** — Smooth animations
- **Recharts** — Progress visualization

---

## 🗂️ Topics Covered

| # | Topic | Easy | Medium | Hard |
|---|-------|------|--------|------|
| 1 | 🐧 Linux & Shell | ✅ | ✅ | ✅ |
| 2 | 🌐 Networking | ✅ | ✅ | ✅ |
| 3 | ☁️ AWS Core (EC2, S3, VPC, IAM) | ✅ | ✅ | ✅ |
| 4 | ⚡ AWS Advanced (Lambda, EKS, RDS) | ✅ | ✅ | ✅ |
| 5 | 🐳 Docker | ✅ | ✅ | ✅ |
| 6 | ☸️ Kubernetes | ✅ | ✅ | ✅ |
| 7 | 🔄 CI/CD | ✅ | ✅ | ✅ |
| 8 | 🏗️ Terraform / IaC | ✅ | ✅ | ✅ |
| 9 | 📡 Observability | ✅ | ✅ | ✅ |
| 10 | 🔧 SRE Practices | ✅ | ✅ | ✅ |
| 11 | 🔒 Security | ✅ | ✅ | ✅ |
| 12 | 💰 FinOps | ✅ | ✅ | ✅ |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 15+ (or Docker)
- npm or pnpm

### Installation

```bash
# Clone the repo
git clone https://github.com/zainjafri4/devops-interview-forge.git
cd devops-interview-forge

# Start PostgreSQL with Docker (recommended)
docker-compose up -d

# Backend setup
cd apps/backend
cp .env.example .env
npm install
npx prisma migrate dev --name init
npx prisma db seed      # Seeds 300+ questions

# Frontend setup
cd ../frontend
cp .env.example .env.local
npm install

# Run both
# Terminal 1 (backend):
cd apps/backend && npm run start:dev
# Terminal 2 (frontend):
cd apps/frontend && npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.
Backend runs on [http://localhost:3001](http://localhost:3001).

---

## 🔑 Environment Variables

### Backend `.env`
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/devops_forge"
JWT_SECRET="your-super-secret-jwt-key-minimum-32-chars"
JWT_REFRESH_SECRET="your-refresh-secret-minimum-32-chars"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
PORT=3001
FRONTEND_URL="http://localhost:3000"
```

### Frontend `.env.local`
```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

---

## 📡 API Documentation

Once the backend is running, visit: `http://localhost:3001/api/docs`

Swagger UI with all endpoints fully documented including request/response schemas.

---

## 📁 Project Structure

```
devops-interview-forge/
├── apps/
│   ├── backend/          # NestJS API
│   │   ├── src/
│   │   │   ├── auth/     # JWT auth with refresh tokens
│   │   │   ├── users/    # User profile management
│   │   │   ├── topics/   # Topic browsing
│   │   │   ├── questions/# Question retrieval
│   │   │   ├── tests/    # Test session management
│   │   │   ├── results/  # Result retrieval and review
│   │   │   └── progress/ # User progress tracking
│   │   └── prisma/
│   │       ├── schema.prisma
│   │       └── seed.ts   # 300+ interview questions
│   └── frontend/         # Next.js 14 App
│       ├── app/          # App Router pages
│       ├── components/   # Reusable UI components
│       ├── store/        # Zustand state
│       ├── hooks/        # Custom React hooks
│       └── lib/          # Utilities and API client
├── docker-compose.yml
└── README.md
```

---

## 🎯 Key Features in Detail

### 🔐 Authentication & Security
- **JWT Strategy**: Access tokens (15 min) + Refresh tokens (7 days)
- **bcrypt Hashing**: Password security with salt rounds = 12
- **Helmet Middleware**: Secure HTTP headers
- **Rate Limiting**: Throttling on auth endpoints (5 req/min)
- **CORS**: Configured for frontend origin only

### 🎨 User Experience
- **Dark Mode**: System preference detection with manual toggle
- **Responsive Design**: Mobile-first with bottom navigation
- **Full-Screen Quiz**: Distraction-free testing environment
- **Smooth Animations**: Page transitions, hover effects, score reveals
- **Real-time Feedback**: Progress bars, timers, and live statistics

### 📊 Progress Tracking
- **Per-Topic Progress**: Track performance by difficulty level
- **Score Trends**: Visualize improvement with line charts
- **Detailed Reviews**: Learn from mistakes with comprehensive explanations
- **Test History**: Review all past attempts with full breakdown

### 🔄 Randomization
- **Fisher-Yates Algorithm**: Questions shuffled for every test
- **Option Shuffling**: Answer order randomized to prevent memorization
- **Fair Testing**: Every attempt is unique and unpredictable

---

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive deployment instructions to Vercel (both frontend and backend).

Quick summary:
1. Set up PostgreSQL database (Supabase, Neon, or Railway)
2. Deploy backend to Vercel with environment variables
3. Run migrations: `npx prisma migrate deploy`
4. Seed database: `npx prisma db seed`
5. Deploy frontend to Vercel with `NEXT_PUBLIC_API_URL`

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Areas for Contribution
- 📝 Add more interview questions (maintain quality standard)
- 🌍 Internationalization (i18n)
- 📈 Additional chart types (radar charts for skill mapping)
- 🎮 Gamification features (badges, streaks, leaderboards)
- 🧪 Unit and E2E tests

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Author

**Zain Raza Jafri**  
Cloud & DevOps Engineer

- 🐙 GitHub: [@zainjafri4](https://github.com/zainjafri4)
- 💼 LinkedIn: [zainjafri4](https://linkedin.com/in/zainjafri4)

---

<div align="center">

## ⭐ Star History

**If this helped your interview prep, leave a ⭐ on the repo!**

---

### 📧 Contact & Support

Found a bug? Have a feature request? Open an issue on GitHub!

For general inquiries: [LinkedIn](https://linkedin.com/in/zainjafri4)

---

**Made with ❤️ and lots of ☕ by the DevOps community**

</div>
