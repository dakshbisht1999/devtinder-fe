# DevTinder — Frontend (`devtinder-fe`)

> Modern developer networking and matchmaking platform built with **React 19**, **Vite**, **Tailwind CSS v4**, **DaisyUI**, and **Redux Toolkit**.

---

## 📌 Overview

**DevTinder** connects software developers looking for peers, collaborators, mentors, or project partners. Inspired by discovery-style swiping, developers can review peer profiles, evaluate skills and bios, send connection requests, and grow their professional tech network.

This repository (`devtinder-fe`) contains the complete Single Page Application (SPA) client. It communicates with the companion backend API repository (`devtinder-be`) via an authenticated REST interface with cookie-based session security.

---

## 🚀 Key Features

- **Developer Discovery & Feed:** Interactive card view to browse peer profiles, view developer skills, and send requests (`Interested` / `Ignore`).
- **Connection Request Engine:** Real-time dashboard to review incoming requests with one-click `Accept` or `Reject` actions.
- **Connections Directory:** Dedicated list of accepted developer matches with quick contact access.
- **Rich Authentication:**
  - Standard Email & Password authentication with input validation.
  - Seamless One-Tap Google OAuth login (`@react-oauth/google`).
  - Seamless session bootstrap on refresh (`AuthBootstrap`) to avoid layout flashes.
  - Secure cookie-based credential handling (`withCredentials: true`).
- **Profile Management:**
  - Live profile preview alongside editing controls.
  - Comprehensive field customization (Name, Age, Gender, Photo URL, About bio, Skills tags).
  - Profile deletion with confirmation modal.
- **Password Recovery & Reset:**
  - In-app authenticated password change.
  - Email-based OTP password recovery workflow powered by AWS SES backend integration.
- **Modern UI & Responsive Theming:**
  - Built on **Tailwind CSS v4** and **DaisyUI v5**.
  - Automatic system Dark / Light mode detection with real-time OS preference sync.
  - Toast feedback via `react-toastify` for asynchronous actions and errors.
  - Service status announcements (e.g., AWS SES sandbox notice banner).

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Framework & Build** | [React 19](https://react.dev/), [Vite 8](https://vite.dev/) |
| **Styling & Components** | [Tailwind CSS v4](https://tailwindcss.com/), [DaisyUI v5](https://daisyui.com/) |
| **State Management** | [Redux Toolkit](https://redux-toolkit.js.org/) (`@reduxjs/toolkit`), `react-redux` |
| **Routing** | [React Router DOM v7](https://reactrouter.com/) |
| **HTTP Client** | [Axios](https://axios-http.com/) (Custom instance with global interceptors & credentials) |
| **Authentication** | Google OAuth (`@react-oauth/google`), HTTP-only Session Cookies |
| **Notifications** | [React Toastify](https://fkhadra.github.io/react-toastify/) |
| **Deployment & CI/CD** | AWS EC2 (Ubuntu), Nginx, GitHub Actions |

---

## 📁 Project Structure

```text
devtinder-fe/
├── .github/
│   └── workflows/
│       └── deploy-fe.yml          # GitHub Actions automated EC2 deployment
├── public/                       # Static public assets
├── src/
│   ├── assets/                   # Images, logos, SVG icons
│   ├── components/               # UI & Route components
│   │   ├── AuthBootstrap.jsx     # Restores user session on initial application load
│   │   ├── Body.jsx              # App layout wrapper (NavBar, Outlet, Footer)
│   │   ├── Breadcrumb.jsx        # Navigation breadcrumb indicator
│   │   ├── Connections.jsx       # Accepted connections list
│   │   ├── DeleteProfile.jsx     # Profile removal confirmation dialog
│   │   ├── EditProfile.jsx       # Profile editor with live preview card
│   │   ├── EmailServiceNotice.jsx# Banner for AWS SES operational status
│   │   ├── Feed.jsx              # Main card swipe/discovery deck
│   │   ├── Footer.jsx            # Application footer component
│   │   ├── GoogleLoginBtn.jsx    # Google OAuth integration button
│   │   ├── LandingPage.jsx       # Public homepage with marketing copy
│   │   ├── Loader.jsx            # Reusable UI spinner
│   │   ├── Login.jsx             # User login form
│   │   ├── NavBar.jsx            # Dynamic top navigation bar
│   │   ├── Privacy.jsx           # Privacy policy view
│   │   ├── Profile.jsx           # Profile view orchestrator
│   │   ├── Requests.jsx          # Incoming connection requests list
│   │   ├── RequiredModal.jsx     # Mandatory profile field completion prompt
│   │   ├── ResetPassword.jsx     # Authenticated password reset
│   │   ├── ResetPasswordViaOtp.jsx# Unauthenticated forgot-password OTP form
│   │   ├── Signup.jsx            # User registration form
│   │   ├── SwipeUserCard.jsx     # Interactive swipe gesture card
│   │   ├── Terms.jsx             # Terms of service view
│   │   └── UserCard.jsx          # Developer profile presentation card
│   ├── utils/                    # Helper functions, API client & Redux slices
│   │   ├── ageCalc.js            # Age calculation from birthdate
│   │   ├── appStore.js           # Central Redux store configuration
│   │   ├── authSession.js        # Session persistence utilities
│   │   ├── axios.js              # Configured Axios instance with interceptors
│   │   ├── connectionsSlice.js   # Redux slice for user connections
│   │   ├── emailServiceNoticeSlice.js # Redux slice for system notices
│   │   ├── errorHandler.js       # Centralized API error & toast notification handler
│   │   ├── feedSlice.js          # Redux slice for feed cards queue
│   │   ├── getGreeting.js        # Time-of-day greeting generator
│   │   ├── requestsSlice.js      # Redux slice for pending requests
│   │   └── userSlice.js          # Redux slice for authenticated user state
│   ├── auth.js                   # Custom hooks (`useAuthUser`, `useIsLoggedIn`, `useAuthReady`)
│   ├── App.jsx                   # Route hierarchy & theme provider
│   ├── main.jsx                  # Application entry point
│   └── index.css                 # Global styles and Tailwind imports
├── .env                          # Local environment variables
├── eslint.config.js              # ESLint configuration
├── index.html                    # Root HTML document
├── package.json                  # Dependencies and build scripts
└── vite.config.js                # Vite build and plugin setup
```

---

## 🗺️ Application Routing

The application utilizes **React Router v7** with route guards:

| Route | Guard | Component | Description |
|---|---|---|---|
| `/` | Public | `LandingPage` | Welcome screen and introductory value proposition |
| `/login` | `GuestOnlyRoute` | `Login` | Sign-in page (redirects to `/feed` if authenticated) |
| `/signup` | `GuestOnlyRoute` | `Signup` | Account registration (redirects to `/feed` if authenticated) |
| `/resetPasswordOtp` | Public | `ResetPasswordViaOtp` | Forgot password step via email OTP |
| `/feed` | `ProtectedRoute` | `Feed` | Discovery deck for swiping developer profiles |
| `/profile` | `ProtectedRoute` | `Profile` | Developer profile settings & live editing |
| `/connections` | `ProtectedRoute` | `Connections` | All established developer connections |
| `/requests` | `ProtectedRoute` | `Requests` | Pending inbound connection requests |
| `/resetPassword` | `ProtectedRoute` | `ResetPassword` | Authenticated password change |
| `/terms` | Public | `Terms` | Terms of Service |
| `/privacy` | Public | `Privacy` | Privacy Policy |

- **`GuestOnlyRoute`**: Prevents logged-in users from accessing `/login` or `/signup`, redirecting them to `/feed`.
- **`ProtectedRoute`**: Restricts sensitive pages to authenticated users, redirecting unauthorized visitors to `/login`.
- **`AuthBootstrap`**: Runs on page reload to query `/profile/view`. It resolves credentials before rendering protected routes to avoid accidental redirect loops.

---

## 🧠 State Management (Redux Store)

The global store is powered by **Redux Toolkit**:

```text
appStore
├── user                  # Authenticated developer profile & session status
├── feed                  # Queue of candidate developer cards to review
├── connections           # List of confirmed peer connections
├── requests              # List of received connection requests
└── emailServiceNotice    # System broadcast messages (e.g., AWS SES sandbox notice)
```

- When actions like `Interested` or `Ignored` are performed, the user card is immediately dispatched out of the Redux `feed` state.
- Accepting or rejecting a connection request updates the `requests` and `connections` slices synchronously without reloading.

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```bash
# Backend Base API URL (Local development)
VITE_BASE_URL=http://localhost:7777/api/v1

# Google OAuth 2.0 Web Client ID
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

> [!NOTE]
> In production on AWS EC2 behind Nginx reverse proxy, `VITE_BASE_URL` is set to `/api/v1`.

---

## 💻 Local Setup & Development

### 1. Prerequisites
- Node.js (v18.x or v20.x+ recommended)
- Running instance of the backend service (`devtinder-be`)

### 2. Installation
```bash
# Clone the frontend repository
git clone https://github.com/<your-username>/devtinder-fe.git
cd devtinder-fe

# Install dependencies
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

### 4. Code Quality & Build
```bash
# Run ESLint
npm run lint

# Create production build in /dist
npm run build

# Preview production build locally
npm run preview
```

---

## 🌐 Production Deployment (AWS EC2 + Nginx)

### 1. Manual Build & Web Server Setup
On your Ubuntu EC2 instance:

```bash
# Install and enable Nginx
sudo apt update
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx

# Copy compiled files to the Nginx root directory
sudo scp -r dist/* /var/www/html/
```

### 2. Nginx Reverse Proxy Configuration
Edit `/etc/nginx/sites-available/default`:

```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    root /var/www/html;
    index index.html index.htm;

    server_name devtinder.dishantbisht.in;

    # React Front-end Client Routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Node.js Back-end API Proxy
    location /api/ {
        proxy_pass http://localhost:7777;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'keep-alive';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Verify and reload Nginx:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 3. Custom Domain & Free SSL Setup
1. **Domain & DNS**: Add an `A` record pointing `devtinder.dishantbisht.in` to the EC2 Public IP (`DNS Only` mode on Cloudflare to allow Certbot SSL verification).
2. **Install Certbot**:
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   sudo certbot --nginx -d devtinder.dishantbisht.in
   ```

---

## 🔄 CI/CD Pipeline (GitHub Actions)

Frontend deployments are automated using GitHub Actions (`.github/workflows/deploy-fe.yml`).

### Trigger Condition
Pushes to branch `main` with commit messages starting with `deploy:`, `DEPLOY:`, or `Deploy:` trigger the workflow:
```bash
git commit -m "deploy: update profile card and styling"
git push origin main
```

### Pipeline Steps:
1. Checks out repository code.
2. Sets up Node.js runtime (`24.6.0`).
3. Installs clean dependencies with `npm ci`.
4. Builds production bundle injecting GitHub repository secrets (`VITE_BASE_URL`, `VITE_GOOGLE_CLIENT_ID`).
5. Transfers build bundle to EC2 staging location (`/tmp/devtinder-fe-build`) via SSH/SCP (`appleboy/scp-action`).
6. Copies build into `/var/www/html/` and reloads Nginx (`appleboy/ssh-action`).

### Required GitHub Secrets:
- `VITE_BASE_URL`
- `VITE_GOOGLE_CLIENT_ID`
- `EC2_HOST`
- `EC2_USERNAME` (e.g. `ubuntu`)
- `EC2_SSH_KEY` (Private SSH `.pem` key content)

---

## 🔗 Related Repositories

- **Backend Repository (`devtinder-be`):** Node.js, Express, MongoDB, AWS SES, and PM2 process management.
- For complete backend architecture and deployment notes, refer to [devtinder-be](https://github.com/dakshbisht1999/devtinder-be/blob/main/README.md).
