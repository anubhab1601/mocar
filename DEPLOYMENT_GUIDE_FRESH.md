# Fresh Deployment Guide

Since we are starting fresh, follow these steps exactly to deploy your Full Stack App.

## Phase 1: GitHub (Source Code)

1.  Go to **GitHub.com** and sign in.
2.  Create a **New Repository**.
3.  Name it: `mocar-final` (or whatever you prefer, but `mocar-final` helps distinguish it).
4.  **Do NOT** check "Add README", "Add .gitignore", or "Add license". Keep it empty.
5.  Copy the URL of this new repository (e.g., `https://github.com/anubhab1601/mocar-final.git`).

## Phase 2: Backend (Render.com)

1.  Go to **Render Dashboard**.
2.  Click **New +** -> **Web Service**.
3.  Connect your new GitHub repo (`mocar-final`).
4.  **Settings**:
    *   **Name**: `mocar-backend`
    *   **Root Directory**: `backend` (CRITICAL!)
    *   **Runtime**: `Node`
    *   **Build Command**: `npm install`
    *   **Start Command**: `node server.js`
5.  **Environment Variables** (Add these):
    *   `ADMIN_USER`: `Admin`
    *   `ADMIN_PASS`: (Your Password)
    *   `ADMIN_EMAIL`: (Your Email)
    *   `SMTP_USER`: (Your Gmail)
    *   `SMTP_PASS`: (Your App Password)
6.  Click **Create Web Service**.
7.  **Wait** for it to go Live.
8.  **Copy** your new Backend URL (e.g., `https://mocar-backend-xyz.onrender.com`).

## Phase 3: Frontend (Vercel)

1.  Go to **Vercel Dashboard**.
2.  Click **Add New...** -> **Project**.
3.  Import `mocar-final`.
4.  **Framework Preset**: Next.js (Default).
5.  **Root Directory**: Click "Edit" and select `frontend`.
6.  **Environment Variables**:
    *   Key: `NEXT_PUBLIC_API_BASE`
    *   Value: `https://mocar-backend-xyz.onrender.com/api`
    *(Paste your Render URL from Phase 2 and add `/api` at the end)*
7.  Click **Deploy**.

## Phase 4: Final Connection

1.  Once Vercel is done, copy your new **Frontend URL** (e.g., `https://mocar-final.vercel.app`).
2.  Go back to **Render Dashboard** -> `mocar-backend` -> **Environment**.
3.  Add/Update:
    *   `FRONTEND_URL`: `https://mocar-final.vercel.app`
4.  **Save Changes** (Render will restart).

**Done!** Your app is now fully connected and fresh.
