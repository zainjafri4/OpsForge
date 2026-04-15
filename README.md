<div align="center">

# ⚙️ OpsForge

### Forge Your Cloud, DevOps & SRE Interview Skills

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)]()
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)]()
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)]()
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)]()
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)]()
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)]()

**500+ real interview questions · 12 topics · Easy / Medium / Hard · AWS focused**

🎯 **No signup required to practice!** Take tests instantly and see your results.

[Try It Now](https://opsforge.vercel.app/test) · [Browse Topics](https://opsforge.vercel.app/topics) · [View Demo](https://opsforge.vercel.app)

---

> Built by **[Zain Raza Jafri](https://linkedin.com/in/zainjafri4)**  
> 🐙 [GitHub](https://github.com/zainjafri4) · 💼 [LinkedIn](https://linkedin.com/in/zainjafri4)

</div>

---

## 🆕 What's New

| Feature | Description |
|---------|-------------|
| 🆓 **Guest Mode** | Practice without signing up - take tests and see results instantly |
| ⏱️ **Timed Practice** | Race against the clock with configurable time limits |
| 🎯 **Mock Interview Mode** | 45-minute simulation with all topics at hard difficulty |
| 🃏 **Flashcard Mode** | Flip-card UI for stress-free review |
| 🔖 **Question Bookmarking** | Save difficult questions for later review |
| 📊 **Weak Topic Detection** | AI-powered analysis of your performance gaps |
| 🏗️ **Custom Test Builder** | Pick specific topics and question counts |

---

## ✨ Features

### For Everyone (No Login Required)
| Feature | Description |
|---------|-------------|
| 🧪 **Practice Tests** | Take 20-question tests from any topic instantly |
| 📚 **Topic Browser** | Explore all 12 topics with question counts |
| 🎯 **Mixed or Focused** | General mixed tests or topic-specific practice |
| 📝 **Instant Results** | See your score and review wrong answers |
| 🃏 **Flashcards** | Review questions without test pressure |

### For Registered Users
| Feature | Description |
|---------|-------------|
| 📊 **Progress Tracking** | Track performance across all topics and difficulties |
| 📈 **Score History** | Visualize your improvement over time |
| 🔖 **Bookmarks** | Save questions to review later |
| 🎯 **Weak Topic Analysis** | See which areas need more practice |
| 🏆 **Streak Tracking** | Maintain daily practice streaks |

### Practice Modes
| Mode | Description |
|------|-------------|
| 📖 **Practice** | No timer - learn at your own pace |
| ⏱️ **Timed** | 10/15/20/30 minute options with countdown |
| 🎯 **Mock Interview** | 45 min, all topics, hard difficulty only |

---

## 🛠 Tech Stack

<table>
<tr>
<td valign="top" width="50%">

### Backend
- **NestJS** — Modular Node.js framework
- **Prisma** — Type-safe PostgreSQL ORM
- **JWT** — Access + Refresh token auth
- **Swagger** — Auto-generated API docs
- **bcrypt** — Secure password hashing
- **Helmet + CORS** — Security middleware

</td>
<td valign="top" width="50%">

### Frontend
- **Next.js 14** — App Router
- **Tailwind CSS** — Utility-first styling
- **shadcn/ui** — Beautiful components
- **Zustand** — State management
- **TanStack Query** — Server state
- **Framer Motion** — Animations

</td>
</tr>
</table>

---

## 🗂️ Topics Covered

| # | Topic | Icon | Questions | Difficulty |
|---|-------|------|-----------|------------|
| 1 | Linux & Shell | 🐧 | 20+ | Easy / Medium / Hard |
| 2 | Networking | 🌐 | 20+ | Easy / Medium / Hard |
| 3 | AWS Core | ☁️ | 25+ | Easy / Medium / Hard |
| 4 | AWS Advanced | ⚡ | 20+ | Easy / Medium / Hard |
| 5 | Docker | 🐳 | 25+ | Easy / Medium / Hard |
| 6 | Kubernetes | ☸️ | 25+ | Easy / Medium / Hard |
| 7 | CI/CD | 🔄 | 20+ | Easy / Medium / Hard |
| 8 | Terraform / IaC | 🏗️ | 20+ | Easy / Medium / Hard |
| 9 | Observability | 📡 | 20+ | Easy / Medium / Hard |
| 10 | SRE Practices | 🔧 | 20+ | Easy / Medium / Hard |
| 11 | Security | 🔒 | 20+ | Easy / Medium / Hard |
| 12 | FinOps | 💰 | 15+ | Easy / Medium / Hard |

---

## 🚀 Quick Start

### Try Without Installing

Visit [opsforge.vercel.app/test](https://opsforge.vercel.app/test) and start practicing immediately!

### Local Development

```bash
# Clone the repo
git clone https://github.com/zainjafri4/OpsForge.git
cd OpsForge

# Start PostgreSQL with Docker
docker-compose up -d

# Backend setup
cd apps/backend
cp .env.example .env
npm install
npx prisma db push
npx prisma db seed

# Frontend setup
cd ../frontend
cp .env.example .env.local
npm install

# Run both (in separate terminals)
cd apps/backend && npm run start:dev
cd apps/frontend && npm run dev
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:3001 |
| Swagger Docs | http://localhost:3001/api/docs |

---

## 🔑 Environment Variables

### Backend `.env`
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/opsforge"
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

## 📁 Project Structure

```
OpsForge/
├── apps/
│   ├── backend/              # NestJS API
│   │   ├── src/
│   │   │   ├── auth/         # JWT authentication
│   │   │   ├── bookmarks/    # Question bookmarking
│   │   │   ├── progress/     # User progress & analytics
│   │   │   ├── results/      # Test results & review
│   │   │   ├── tests/        # Test session management
│   │   │   └── topics/       # Topic & question management
│   │   └── prisma/
│   │       └── seed-data/    # 500+ interview questions
│   └── frontend/             # Next.js 14 App
│       ├── app/
│       │   ├── dashboard/    # Authenticated user pages
│       │   ├── flashcards/   # Flashcard mode
│       │   ├── test/         # Public test flow
│       │   └── topics/       # Public topic browser
│       ├── components/       # Reusable UI
│       ├── hooks/            # Custom React hooks
│       └── store/            # Zustand state
├── docker-compose.yml
└── README.md
```

---

## 🎯 Feature Comparison

| Feature | Guest | Registered |
|---------|:-----:|:----------:|
| Take practice tests | ✅ | ✅ |
| View results | ✅ | ✅ |
| Timed mode | ✅ | ✅ |
| Mock interview mode | ✅ | ✅ |
| Flashcards | ✅ | ✅ |
| Browse topics | ✅ | ✅ |
| Progress tracking | ❌ | ✅ |
| Score history | ❌ | ✅ |
| Bookmark questions | ❌ | ✅ |
| Weak topic analysis | ❌ | ✅ |
| Dashboard | ❌ | ✅ |

---

## 🚀 Deployment

### Vercel (Recommended)

1. **Database**: Create a PostgreSQL database on [Neon](https://neon.tech) or [Supabase](https://supabase.com)

2. **Backend**:
   - Import repository to Vercel
   - Set root directory: `apps/backend`
   - Add environment variables
   - Deploy

3. **Frontend**:
   - Create new Vercel project
   - Set root directory: `apps/frontend`
   - Add `NEXT_PUBLIC_API_URL` pointing to backend
   - Deploy

4. **Initialize Database**:
   ```bash
   cd apps/backend
   npx prisma db push
   npx prisma db seed
   ```

---

## 🤝 Contributing

Contributions are welcome! Areas for contribution:

- 📝 Add quality interview questions
- 🌍 Internationalization (i18n)
- 🧪 Unit and E2E tests
- 📱 Mobile app (React Native)
- 🎮 Gamification features

### How to Contribute

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is open source under the [MIT License](LICENSE).

---

<div align="center">

## 👤 Author

**Zain Raza Jafri**  
Cloud & DevOps Engineer

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/zainjafri4)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/zainjafri4)

---

**⭐ If this helped your interview prep, star the repo!**

---

Made with ❤️ for the DevOps community

</div>
