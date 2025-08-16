# Sahara 2025 - Donation Platform

A modern donation platform built with React + TypeScript (frontend) and Node.js + Express (backend), integrated with Razorpay for secure payments and PostgreSQL for data storage.

## 🚀 Features

- **Modern Frontend**: React 18 + TypeScript + Vite
- **Secure Payments**: Razorpay integration with server-side verification
- **Real-time Dashboard**: Payment tracking and analytics
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS
- **Database Integration**: PostgreSQL with Neon DB
- **Security**: Turnstile CAPTCHA protection
- **Access Control**: Admin dashboard with authentication

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**

## 🛠️ Project Structure

```
sahara-25/                    # Frontend (React + TypeScript)
├── src/
│   ├── components/          # React components
│   ├── data/               # Type definitions and data
│   └── lib/                # Utility functions
├── public/                 # Static assets
└── .env                   # Frontend environment variables

sahara-25-backend/           # Backend (Node.js + Express)
├── routes/                 # API route handlers
├── index.js               # Server entry point
└── .env                   # Backend environment variables
```

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Xplorica-FIEM/sahara-25.git
cd sahara-25
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd ../sahara-25-backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

**Configure Backend Environment** (`.env`):
```env
RAZORPAY_KEY_ID="your_razorpay_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
TURNSTILE_SITE_KEY="your_turnstile_site_key"
TURNSTILE_SECRET_KEY="your_turnstile_secret_key"
PGHOST="your_postgres_host"
PGDATABASE="your_database_name"
PGUSER="your_database_user"
PGPASSWORD="your_database_password"
DB_URI="your_complete_database_connection_string"
```

```bash
# Start backend server
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd sahara-25

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

**Configure Frontend Environment** (`.env`):
```env
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
VITE_API_BASE_URL=http://localhost:5000
VITE_TURNSTILE_SITE_KEY="your_turnstile_site_key"
VITE_RAZORPAY_BUTTON_ID="your_razorpay_button_id"
VITE_DASHBOARD_ACCESS_KEY=your_dashboard_access_key
```

```bash
# Start frontend development server
npm run dev
```

Frontend will run on `http://localhost:5173`

## 🔑 Required API Keys

### Razorpay Setup
1. Create account at [Razorpay](https://razorpay.com/)
2. Get your **Key ID** and **Key Secret** from Dashboard
3. Add them to both frontend and backend `.env` files

### Turnstile Setup (Cloudflare CAPTCHA)
1. Create account at [Cloudflare](https://www.cloudflare.com/)
2. Go to Turnstile section and create a new site
3. Get **Site Key** and **Secret Key**
4. Add them to respective `.env` files

### Database Setup (Neon PostgreSQL)
1. Create account at [Neon](https://neon.tech/)
2. Create a new database
3. Get connection details and add to backend `.env`

## 🎯 Usage

### Making Donations
1. Visit `http://localhost:5173`
2. Select donation amount
3. Fill donor details
4. Complete payment via Razorpay

### Admin Dashboard
1. Visit `http://localhost:5173/dashboard`
2. Enter access key (configured in `.env`)
3. View payment analytics and transaction history

## 📊 Dashboard Features

- **Payment Statistics**: Total transactions, success/failure rates
- **Transaction Table**: Detailed payment history with filters
- **Amount Sorting**: Low to high, high to low
- **Status Filtering**: All, Successful, Failed, Pending
- **Export Data**: Download transaction reports

## 🔧 Development

### Available Scripts

**Frontend:**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

**Backend:**
```bash
npm run dev          # Start development server
npm start            # Start production server
```

### Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- React Router (navigation)

**Backend:**
- Node.js + Express
- Razorpay SDK
- Neon PostgreSQL
- Cloudflare Turnstile

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Upload dist/ folder to hosting platform
```

### Backend (Railway/Heroku)
```bash
# Ensure all environment variables are set
npm start
```

## 🔒 Security

- **API Keys**: Never commit real keys to Git
- **Environment Files**: Use `.env.example` templates
- **CAPTCHA**: Turnstile prevents spam submissions
- **Payment Verification**: Server-side validation
- **Access Control**: Protected admin dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Contact: [Your Contact Information]

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Made with ❤️ by Xplorica Team**
