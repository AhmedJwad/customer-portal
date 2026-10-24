# Customer Portal

A responsive customer portal built with React, TypeScript, and Vite. The frontend talks to an ASP.NET Core Web API and implements a complete JWT authentication flow with refresh token rotation.

## Project Overview

This project is a practical demonstration of frontend development skills, focusing on a clean user interface, responsive design, authentication, protected routes, state management, and API integration.

## Technology Stack

- React 19 + TypeScript
- Vite
- Material UI (MUI) and MUI Icons
- React Router
- Axios
- ESLint

Backend (separate repository/project): ASP.NET Core Web API (.NET 10), EF Core, JWT.

## Features

### Implemented

- **JWT authentication** with a short-lived access token (15 minutes) and a long-lived refresh token (7 days)
- **Automatic token refresh**: an Axios interceptor catches `401` responses, requests a new token pair once, and retries the original request. Concurrent requests share a single refresh call
- **Refresh token rotation and reuse detection** (handled by the API): a reused token revokes all of the user's sessions
- **Protected routes** with role-based access (`ProtectedRoute`)
- **Auth context** (`AuthProvider` / `useAuth`) that reads the user from the JWT and stays in sync across tabs
- **Login page**: responsive, show/hide password, API error messages (wrong credentials, locked account, unconfirmed email), and return to the originally requested page
- **Access denied (403) page**
- **Header user menu**: avatar, full name, email, Edit profile, Change password, and Logout
- **Edit profile**: update name, phone, address,  and photo; the header updates immediately
- **Change password**: validation, confirmation, and sign-out from all devices on success
- **Responsive admin layout** for desktop and mobile

### Planned

- Forgot password and reset password pages
- Register new user and email confirmation
-  customer management screens
- Light/dark theme and language switch

## Project Structure
