# Nginx Config Dashboard

A minimal web dashboard for managing Nginx configuration files.  
Built with Express and SQLite, using secure cookie-based JWT authentication.

## Features

- 🔐 Admin login with JWT (stored in HTTP-only cookies)
- 👤 Two roles: **guest** (read-only) and **admin** (full access)
- 📂 Read, edit, and save Nginx config files
- 🔁 Reload Nginx from the web interface
- 🧩 Create reusable config templates or blocks
- 🛡️ Rate limiting and security headers with Helmet

## Tech Stack

- Express.js
- SQLite (via `sqlite3`)
- JWT (cookie-based auth)
- bcrypt (password hashing)
- express-rate-limit
- helmet

## Usage

1. Install dependencies:

```bash
pnpm install
```

2. Create a .env file:

```env
JWT_SECRET=your_secret_key
COOKIE_NAME=auth_token
PORT=3000
```

3. Start the server:

```bash
node src/server.js
```

4. Access the dashboard at

```sh
http://localhost:3000
```

## Security Notes
 - Tokens are stored in secure, HTTP-only cookies
 - No registration endpoint — only login
 - Only the admin can change the password or manage configs