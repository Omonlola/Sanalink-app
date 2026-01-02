# Sanalink Deployment Guide (Free Tier)

This guide explains how to deploy Sanalink for free using:
- **MongoDB Atlas** (Database)
- **Render** (Server)
- **Vercel** (Client)

## 1. Database Setup (MongoDB Atlas)
1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  Create an account and sign in.
3.  Create a **new cluster** (select the FREE tier, usually M0 Sandbox).
4.  In "Network Access", allow access from **Anywhere** (0.0.0.0/0).
5.  In "Database Access", create a user (e.g., `sanalink_admin`) and password.
6.  Click **Connect** -> **Drivers** (Node.js) -> Copy the connection string.
    - It looks like: `mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority`
    - Replace `<password>` with your actual password.

## 2. Server Deployment (Render)
1.  Push your code to GitHub (you already did this).
2.  Go to [Render](https://render.com) and sign up.
3.  Click **New +** -> **Web Service**.
4.  Connect your GitHub repository `Sanalink-app`.
5.  Configuration:
    - **Root Directory**: `server`
    - **Runtime**: Node
    - **Build Command**: `npm install`
    - **Start Command**: `node index.js`
6.  **Advanced** -> **Environment Variables**:
    - Key: `MONGODB_URI`
    - Value: (Paste your connection string from step 1)
7.  Click **Create Web Service**.
8.  Wait for it to deploy. Copy the **Service URL** (e.g., `https://sanalink-server.onrender.com`).

## 3. Client Deployment (Vercel)
1.  Go to [Vercel](https://vercel.com) and sign up.
2.  Click **Add New** -> **Project**.
3.  Import `Sanalink-app` from GitHub.
4.  **Framework Preset**: Vite.
5.  **Root Directory**: Edit this -> select `client`.
6.  Environment Variables:
    - Vercel builds the code *frozen*. You must hardcode the API URL in the code or use Vercel env vars properly.
    - **Important**: Currently `AuthContext.jsx` points to `http://localhost:3000/api`. You **MUST** change this before deploying, or use an environment variable.
7.  Click **Deploy**.

## 4. Final Configuration
In your local code or directly in GitHub (using the web editor):
1.  Open `client/src/context/AuthContext.jsx`.
2.  Change:
    ```javascript
    baseURL: 'http://localhost:3000/api'
    ```
    to:
    ```javascript
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
    ```
3.  In Vercel **Project Settings** -> **Environment Variables**:
    - Key: `VITE_API_URL`
    - Value: `https://sanalink-server.onrender.com/api` (Your Render URL + /api)
4.  Redeploy Vercel.
