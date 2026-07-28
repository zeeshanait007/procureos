# ProcureOS - The Intelligent Procurement Operating System

ProcureOS is an enterprise SaaS platform designed to manage the end-to-end procurement lifecycle. It features AI-assisted requirement drafting, automated market benchmarking, intelligent cost estimation, and a robust Role-Based Access Control (RBAC) governance engine with strict Approval Gates.

## Tech Stack
* **Framework:** Next.js (App Router)
* **Styling:** Tailwind CSS + shadcn/ui
* **Database:** SQLite (via Prisma ORM)
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
You need to create a `.env` file at the root of the project. 

1. Create a file named `.env` in the root folder.
2. Add the following variables to it:

```env
# Database Configuration
DATABASE_URL="file:./dev.db"

# Google Gemini API (Required for AI Copilot features)
GEMINI_API_KEY="your_google_gemini_api_key_here"

# Supabase (Optional/If configured)
NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"
```
*(Note: You can get a free Gemini API key from Google AI Studio).*

### 4. Initialize Database & Seed Data
The application uses Prisma ORM with a local SQLite database. You need to generate the Prisma client, push the schema, and seed the database with the initial roles, users, and dummy procurement cases.

Run the following commands in order:
```bash
# Generate the Prisma client
npx prisma generate

# Push the schema to the database
npx prisma db push

# Seed the database with initial dummy data
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

ProcureOS implements strict role-based access for the Approval Gates. When you open the application, you will be prompted to log in. 

Because this is a prototype, **passwords are not strictly validated**, but the **email address must exist** in the database to log in and assume the correct role.

### Demo Accounts to Test
You can use any of the following emails (with any random password like `1234`) to test the different approval flows:

* `admin@acme.com` - **Platform Owner** (Super Admin with universal access)
* `alice@acme.com` - **Business Head** (Can approve Gate 1)
* `bob@acme.com` - **Finance Authority** (Can approve Gates 2 & 5)
* `charlie@acme.com` - **Procurement Head** (Can approve Gates 3 & 6)
* `diana@acme.com` - **CIO / Technical Committee** (Can approve Gate 4)

*(You can also use the `/signup` page to create a custom user and assign a specific role for testing).*
