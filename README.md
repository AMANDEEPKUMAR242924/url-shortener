# ShortLink — URL Shortener with Click Analytics

A full-stack URL shortener and real-time click analytics web app built with the MERN stack, featuring Base62 short-code generation, HTTP 302 redirects, and device-level tracking.

## Live Demo
- **Live App:** [View Live Demo](https://url-shortener-weld-omega.vercel.app/)

## Screenshot
[./screenshots/dashboard.png]

## Tech Stack
- **Frontend:** React (Vite), Tailwind CSS, Recharts, Axios, Lucide Icons
- **Backend:** Node.js, Express.js, Crypto (Base62), Mongoose
- **Database:** MongoDB Atlas
- **Deployment:** Vercel (Frontend) & Render (Backend)

## Key Features
- Custom 6-character Base62 short-code generation using Node.js `crypto`
- Fast HTTP `302` redirection with automatic click counting
- User-Agent parsing to track Desktop vs. Mobile clicks
- Interactive Recharts Pie Chart for per-link device analytics
- One-click short URL copy and link management

## Run Locally
1. Clone the repo:
   ```bash
   git clone [https://github.com/AMANDEEPKUMAR242924/url-shortener.git](https://github.com/AMANDEEPKUMAR242924/url-shortener.git)
   2. Backend (`server/`): `npm install` → add `PORT`, `MONGO_URI`, and `BASE_URL` in `.env` → `npm run dev`
3. Frontend (`client/`): `npm install` → `npm run dev`