# 🚐 KM Tourist Transport Services OPC - Franchise Database System

**Official Corporate Credentials**:
- **SEC Registration No.**: `20240198058-20`
- **DTI Certificate No.**: `5511875`
- **Official Contact**: `0953 296 6323`
- **Category**: Transportation Service
- **Official Motto & Mission**:
  - *DRIVEN BY SAFETY, DEFINED BY TRUST*
  - *WHERE COMFORT MEET COMPLIANCE*
  - *RIDE SAFE! RIDE LEGAL! RIDE KM!*

A modern, cloud-connected web database system built specifically for **KM Tourist Transport Services OPC** to manage franchise member operators, affiliated van units (Toyota HiAce, Nissan Urvan, etc.), fee payments, and document attachments (LTO OR/CR, LTFRB franchise permits, driver licenses, and vehicle insurance).

---

## 🌟 Key Features

### 1. 👥 Member Operator Information & Editing
- **Full Name**: First Name, Middle Name, Last Name
- **Franchise Code / ID**: Unique identifier (e.g., `KM-2026-001`)
- **Cellphone & Emergency Contacts**: Direct contact number and emergency contact person/phone
- **Residential Address**: Street, Barangay, City, Province
- **Status & Affiliation**: Active, Pending, Inactive, Suspended
- **Full Edit Form**: Update any field anytime with instant database save

### 2. 🚐 Fleet & Van Unit Tracking
- **Name of Unit / Van**: Toyota HiAce GL Grandia, Commuter Deluxe, Nissan NV350 Urvan, Hyundai Starex, etc.
- **Plate Number**: Plate / Conduction sticker tracking
- **Technical Specs**: Model year, color, seating capacity, engine & chassis numbers
- **Franchise Permit Details**: LTFRB Case Number and authorized tourist charter routes

### 3. 💳 Franchise Payments & Accounting
- **Kinds of Payment**:
  - Monthly Franchise Dues
  - Membership Affiliation Fee
  - Annual Franchise Renewal
  - Terminal & Dispatch Fees
  - Passenger Personal Accident Insurance (PPAI / TPL)
  - Surcharges / Penalties
- **Payment Methods**: GCash, Maya, Cash, Bank Transfer (BDO, BPI, Metrobank), Check
- **Payment Tracking**: Reference numbers, coverage period (e.g., "November 2026"), payment dates, and status (Paid / Pending / Overdue)
- **Financial Reporting**: One-click **Export to CSV / Excel**

### 4. 📁 Document Attachments Vault & Expiry Alerts
- **Attach Any Document**:
  - LTO Official Receipt & Certificate of Registration (OR/CR)
  - LTFRB Certificate of Public Convenience (CPC) Franchise Permit
  - Professional Driver's License
  - Comprehensive & Passenger Insurance Policies
  - Government Valid IDs (PhilSys, Passport, UMID)
  - Proof of Payment / Deposit Slips
- **In-Browser Document Viewer**: Preview images and PDFs directly inside the app with full-screen zoom and download
- **Automatic Renewal Tracker**: Proactive banner alert for documents expiring within 45 days (e.g., OR/CR renewals based on plate ending digits)

### 5. 🖨️ Printable Official Member Dossier
- One-click print-ready summary sheet with KM Tourist Franchise header, member details, vehicle specifications, and verified document checklist.

---

## 🚀 Quick Start (Running Locally)

The system is already installed and ready to run on your computer:

```powershell
# In PowerShell:
cd "c:\Users\Admin\Documents\KM DATABASE Sytem"

# Start the application
npm.cmd start
```

Open your browser and navigate to:
👉 **`http://localhost:3000`**

*(You can also open it from your smartphone connected to the same Wi-Fi using your network IP shown in the console, e.g. `http://192.168.86.15:3000`)*

---

## ☁️ Connecting NeonDB (PostgreSQL)

The application features **Dual-Engine Storage**:
- **Default / Offline Mode**: Works immediately with a local store in `data/local-db.json` with pre-loaded sample data.
- **Neon Cloud Mode**: Automatically connects to Neon Serverless PostgreSQL whenever `DATABASE_URL` is provided.

### 3 Easy Steps to Connect Neon:
1. Go to **[https://neon.tech](https://neon.tech)** and create a free account (takes 1 minute, no credit card required).
2. Create a project named `km-tourist-db` and copy your Postgres connection string:
   ```text
   postgresql://username:password@ep-sample-1234.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
3. Open `.env.local` in this project folder and paste:
   ```env
   DATABASE_URL="your_copied_neon_connection_string_here"
   ```
4. In the app, open the **Cloud DB & Deploy** tab (`/settings`) and click **"Verify & Initialize Neon Tables"**, then **"Sync Local Records into NeonDB"**. All tables and records will be set up in Neon automatically!

---

## 🐙 Step-by-Step: Save Source Code to GitHub

If Git is not yet installed on your PC, you can install it in 1 command:
```powershell
winget install --id Git.Git -e --source winget
```

Then create a new repository on **[https://github.com/new](https://github.com/new)** (e.g., named `km-tourist-franchise`), and run:

```powershell
cd "c:\Users\Admin\Documents\KM DATABASE Sytem"

git init
git add .
git commit -m "Initial KM Tourist Franchise database system"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/km-tourist-franchise.git
git push -u origin main
```

---

## 🌐 Deploying to the Web (Access Anywhere from Phone/Laptop)

### Recommended: Vercel (100% Free Forever)
1. Go to **[https://vercel.com](https://vercel.com)** and sign in with your GitHub account.
2. Click **"Add New" → "Project"**.
3. Select your `km-tourist-franchise` repository.
4. Under **Environment Variables**, add:
   - **Name**: `DATABASE_URL`
   - **Value**: Your NeonDB PostgreSQL connection string.
5. Click **"Deploy"**!
6. In ~60 seconds, your friend will have a permanent secure web address (e.g., `https://km-tourist-franchise.vercel.app`) that works from any mobile phone, tablet, or computer anywhere in the world!

---

## 🛠️ Technology Stack
- **Frontend & Backend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Cloud Database**: Neon Serverless PostgreSQL (`@neondatabase/serverless`)
- **Document Handling**: Base64 data streaming with direct PDF and Image preview/download
