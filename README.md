# Customer Portal

A responsive customer portal built with **React, TypeScript, and Vite**, integrated with an ASP.NET Core Web API. The application implements JWT authentication, protected routes, automatic token refresh, user profile management, and responsive UI design.

## Project Overview

This project demonstrates practical frontend development skills, focusing on authentication, authorization, state management, API integration, responsive design, and maintainable code organization.

The frontend communicates with a separate ASP.NET Core Web API responsible for authentication, authorization, data persistence, and backend operations.

## Technology Stack

### Frontend
- React 19
- TypeScript
- Vite
- Material UI (MUI) and MUI Icons
- React Router
- Axios
- ESLint

### Backend
- ASP.NET Core Web API (.NET 10)
- Entity Framework Core
- JWT Authentication
- Refresh Token Rotation

## Features

### Authentication and Authorization
- **JWT authentication** with short-lived access tokens (15 minutes) and refresh tokens (7 days).
- **Automatic token refresh** using Axios interceptors when an API request returns `401 Unauthorized`.
- **Concurrent refresh handling**, allowing simultaneous failed requests to share a single refresh operation.
- **Refresh token rotation and reuse detection**, handled by the backend API.
- **Protected routes** with role-based access control through `ProtectedRoute`.
- **Authentication context** using `AuthProvider` and `useAuth`.
- **Cross-tab authentication synchronization** to keep authentication state consistent across browser tabs.
- **Access denied page** for unauthorized access (`403 Forbidden`).

### Login
- Responsive login interface.
- Show/hide password functionality.
- API error handling for invalid credentials, locked accounts, and unconfirmed email addresses.
- Redirects users to their originally requested page after successful authentication.

### User Profile
- Header user menu displaying the user's avatar, full name, and email.
- Edit profile functionality, including name, phone number, address, and profile photo.
- Immediate header updates after profile changes.
- Change password functionality with validation and confirmation.
- Sign-out from all devices after a successful password change.

### User Interface
- Responsive layout for desktop and mobile devices.
- Material UI components for a consistent user experience.
- Reusable components and centralized API communication through Axios.

## Project Structure

The frontend is organized around the application's main responsibilities:

- **Authentication:** Login, authentication context, and protected routes.
- **API Layer:** Axios configuration, request and response interceptors, and token refresh handling.
- **Layout:** Responsive application layout, header, and user menu.
- **Pages:** Login, access denied, profile editing, and password changing.
- **Shared Components:** Reusable UI components.
- **Types:** TypeScript interfaces and type definitions.
- **Utilities:** Token storage and supporting authentication helpers.

## Getting Started

### Prerequisites

- Node.js
- npm
- A running instance of the ASP.NET Core Web API

### Installation

Clone the repository and navigate to the frontend project directory:

```bash
git clone <your-repository-url>
cd <your-project-directory>
npm install
```

### Environment Configuration

Create a `.env` file in the frontend project root and configure the backend API URL:

```env
VITE_API_URL=https://localhost:44372/api/
```

Replace the example URL with the actual API base URL used by your environment.

### Run the Development Server

```bash
npm run dev
```

Open the local URL displayed by Vite in your terminal.

### Build for Production

```bash
npm run build
```

### Run Linting

```bash
npm run lint
```

## Security Considerations

- Access tokens have a limited lifetime.
- Refresh tokens are rotated by the backend API.
- Refresh token reuse detection can revoke the user's sessions.
- Protected routes improve navigation and user experience, while backend authorization enforces access permissions.
- Token issuance, validation, refresh, and session revocation are enforced by the backend API.

## Project Status

**Completed.**

The customer portal frontend is implemented, including JWT authentication, protected routes, automatic token refresh, profile management, password changes, responsive UI, and API integration.

## License

No license has been specified yet.
