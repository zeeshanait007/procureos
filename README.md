# ProcureOS - The Intelligent Procurement Operating System

ProcureOS is an enterprise SaaS platform designed to manage the end-to-end procurement lifecycle. It features AI-assisted requirement drafting, automated market benchmarking, intelligent cost estimation, and a robust Role-Based Access Control (RBAC) governance engine with strict Approval Gates.

## Tech Stack
* **Framework:** Next.js (App Router)
* **Styling:** Tailwind CSS + shadcn/ui
* **Database:** Supabase PostgreSQL (via Prisma ORM)
* **Authentication:** Supabase Auth
* **Storage:** Supabase S3 Storage
* **AI Engine:** Google Gemini API
* **Language:** TypeScript

---

## Getting Started

Follow these step-by-step instructions to get the application up and running on your local machine.

### Prerequisites
* **Node.js**: You must have Node.js version **20.9.0 or higher** installed. (Check via `node -v`).
* **Git**: To clone the repository.

### 1. Clone the Repository
```bash
git clone https://github.com/zeeshanait007/procureos.git
cd procureos
```

### 2. Install Dependencies
Run the following command to install all required NPM packages:
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file at the root of the project and add the following variables:

```env
# Database Configuration (Get these from Supabase -> Settings -> Database -> Connection String -> IPv4 Pooler)
DATABASE_URL="postgresql://postgres.[ref]:[pwd]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres.[ref]:[pwd]@aws-0-[region].pooler.supabase.com:5432/postgres"

# Supabase Auth Configuration (Get these from Supabase -> Settings -> API)
NEXT_PUBLIC_SUPABASE_URL="https://[ref].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_anon_key"

# Supabase S3 Storage Configuration (Get these from Supabase -> Storage -> Settings)
SUPABASE_S3_ACCESS_KEY="your_s3_access_key"
SUPABASE_S3_SECRET_KEY="your_s3_secret_key"
SUPABASE_S3_REGION="your_region"
SUPABASE_S3_ENDPOINT="https://[ref].storage.supabase.co/storage/v1/s3"

# Google Gemini API (Required for AI Copilot features)
GEMINI_API_KEY="your_google_gemini_api_key_here"
```
*(Note: You can get a free Gemini API key from Google AI Studio).*

### 4. Initialize Database & Seed Data
The application uses Prisma ORM connected to Supabase PostgreSQL.

Run the following commands in order:
```bash
# Push the schema to the database (generates Prisma client automatically)
npx prisma db push --accept-data-loss

# Seed the database with initial Roles, Organizations, and dummy Procurement Cases
npx prisma db seed
```

### 5. Start the Development Server
Finally, start the local development server:
```bash
npm run dev
```

The application will now be running at [http://localhost:3000](http://localhost:3000).

---

## Authentication & Role-Based Access Control (RBAC)

ProcureOS implements strict role-based access for the Approval Gates and features full Supabase Authentication. 

### How to test the Application
Since the application uses real Supabase Auth, you must create a new account to test it:
1. Go to the Login page and click **"Register here"**.
2. Enter a valid email address and a secure password.
3. Select your desired **Role** (e.g., Platform Owner, Procurement Head, Finance Authority).
4. Click "Create Account" and you will be logged in immediately.

*Note: The automatic `prisma db seed` script populates the database with the core Application Roles and Organizations required for registration.*
