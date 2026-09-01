# 🌐 Socially (Quera Socially)

A modern, responsive, and feature-packed social media web application built with **React 19**, **TypeScript**, **Vite**, **Tailwind CSS v4**, **TanStack Query v5**, and **Zustand**.

---

## 📖 Overview

**Socially** is a frontend social networking platform designed for seamless user interaction, real-time feed exploration, community engagement, and profile management. It features optimistic UI updates, persistent dark/light theming, modal-driven workflows, and comprehensive server-state synchronization.

---

## ✨ Features

### 🔐 Authentication & Security
- **User Registration & Login:** Form validation powered by `react-hook-form` with custom email/password rules and password confirmation.
- **Session Management:** Cookie-based session bootstrap via Axios with automatic credential forwarding (`withCredentials: true`).
- **Route Guarding:**
    - `ProtectRoute`: Secures private routes (e.g., Notifications).
    - `GuestOnlyRoute`: Redirects authenticated users away from `/login` and `/register`.

### 📰 Feed & Posts
- **Dual Home Views:**
    - **Guest View:** Public feed with call-to-action cards encouraging registration.
    - **Authenticated View:** Personalized 3-column dashboard featuring mini profile cards, post creator, feed, and recommendations.
- **Post Composer:** Publish rich text posts with image attachments.
- **Media Upload:** Direct image uploads with automatic CDN URL normalization (Uploadcare CDN integration).
- **Post Management:** Inline editing and deletion with dedicated confirmation modals.
- **Optimistic Interactions:** Instant like toggling with counter updates, self-like prevention, and automatic rollback on network failure.

### 💬 Comments System
- View expandable comment threads on any post.
- Create, edit, and delete comments with immediate query cache invalidation.

### 👤 Profile & Social Graph
- **Dynamic Profiles (`/profile/:username`):** View user bios, avatars, location, website links, follower/following counts, and join dates.
- **Profile Tabs:** Toggle between user's **Posts** and **Liked Posts**.
- **Follow System:** Optimistic follow/unfollow toggle updating counts across profile headers, follower lists, and recommendation widgets.
- **Followers & Following Modals:** Modal dialogs displaying user follower and following rosters.
- **Profile Editing:** Modal to update bio, location, website URL, display name, and avatar image.
- **"Who to Follow":** Sidebar recommendation engine suggesting relevant users to connect with.

### 🔍 Search & Discovery
- Global search modal in the navigation bar to find users by username or display name with debounced queries.

### 🔔 Notifications
- Centralized notifications page (`/notifications`) tracking:
    - Post likes
    - Comments and comment previews
    - New followers
- Unread badge counter in the navigation bar with `9+` display cap.
- Batch "Mark as read" mutation.

### 🎨 Theme & UX
- **Theme Switcher:** Dark mode (default) and Light mode powered by CSS variables and persisted in `localStorage` via Zustand.
- **Responsive Layout:** Adaptive desktop 3-column layout, tablet 2-column layout, and mobile drawer navigation.
- **Loading States:** Custom shimmer skeleton loaders for feeds, cards, and notification lists.
- **Toast Notifications:** Feedback messages for success, info, and API errors via `react-hot-toast`.

---

## 🛠️ Tech Stack

| Category | Technologies |
| :--- | :--- |
| **Framework & Core** | [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/) |
| **Server State & Cache** | [TanStack React Query v5](https://tanstack.com/query/latest) |
| **Client State Management** | [Zustand](https://github.com/pmndrs/zustand) (with `persist` middleware) |
| **Routing** | [React Router v7](https://reactrouter.com/) |
| **Styling & UI** | [Tailwind CSS v4](https://tailwindcss.com/), `@tailwindcss/vite`, CSS Variables, `clsx`, `tailwind-merge` |
| **Forms & Validation** | [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/) |
| **HTTP Client** | [Axios](https://axios-http.com/) |
| **Icons & Feedback** | [Lucide React](https://lucide.dev/), [React Hot Toast](https://react-hot-toast.com/) |

---

## 📁 Project Structure

```text
src/
├── api/                  # Axios instance, response normalizers & API services
│   ├── authApi.ts        # Login, registration, session, logout
│   ├── axiosInstance.ts  # Base Axios configuration & error interceptors
│   ├── notificationApi.ts# Notification fetching & read status mutations
│   ├── postsApi.ts       # Feed, CRUD operations, likes, comments
│   ├── uploadApi.ts      # Multipart file uploads
│   └── usersApi.ts       # Profiles, follow toggles, recommendations, search
├── components/
│   ├── auth/             # Auth wrapper cards and forms
│   ├── layouts/          # Root Layout, Navbar, ProtectedRoute, GuestOnlyRoute
│   ├── notifications/    # Notification item cards
│   ├── post/             # PostCard, PostComposer, PostSkeleton, Edit/Delete modals
│   ├── profile/          # ProfileHeader, ProfileCardMini, EditProfileModal, WhoToFollow
│   ├── ui/               # Base UI primitives (Avatar, Button, Input, Modal, Feedback, etc.)
│   └── users/            # SearchModal, FollowListModal, UserListItem
├── hooks/                # Custom TanStack Query hooks (useAuth, usePosts, useUsers, etc.)
├── lib/                  # Utilities (cn, timeAgo, resolveImageUrl, formatJoinDate)
├── pages/                # Page components (Profile, Notifications, Login, Register)
├── store/                # Zustand stores (authStore, themeStore)
├── types/                # TypeScript interface and type definitions
├── App.tsx               # Home page controller (LoggedInHome / LoggedOutHome)
├── App.css               # Design tokens, color system, and animation rules
├── main.tsx              # Application entry point with RouterProvider
└── router.tsx            # React Router route configuration
```

---

## 🔌 API Endpoints Reference

The client integrates with backend endpoints configured in `src/api/axiosInstance.ts` (default: `http://localhost:3000`):

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/authentication/register` | Register a new user account |
| `POST` | `/api/authentication/login` | Log in with credentials |
| `GET` | `/api/authentication/session` | Validate current session and get user profile |
| `POST` | `/api/authentication/logout` | End user session |
| `GET` | `/api/posts` | Fetch public / user feed posts |
| `POST` | `/api/posts` | Create a new post |
| `PUT` | `/api/posts/:id` | Update post content or image |
| `DELETE` | `/api/posts/:id` | Delete a post |
| `PATCH` | `/api/posts/:id` | Toggle like status on a post |
| `POST` | `/api/posts/:id/comment` | Add a comment to a post |
| `PUT` | `/api/posts/:postId/comment/:commentId` | Edit a comment |
| `DELETE` | `/api/posts/:postId/comment/:commentId` | Delete a comment |
| `GET` | `/api/users/recommend` | Get recommended accounts to follow |
| `GET` | `/api/users/search?q=:query` | Search users by name or username |
| `GET` | `/api/users/:id` | Fetch user profile by ID |
| `GET` | `/api/users/:username/profile` | Fetch user profile by username |
| `PUT` | `/api/users/:id` | Update user profile data |
| `PATCH` | `/api/users/:id` | Toggle follow status for a user |
| `GET` | `/api/users/:id/posts` | Get posts authored by user |
| `GET` | `/api/users/:id/likes` | Get posts liked by user |
| `GET` | `/api/users/:id/followers` | Get user followers |
| `GET` | `/api/users/:id/followings` | Get user followings |
| `GET` | `/api/notifications` | Get user notification list |
| `PATCH` | `/api/notifications` | Mark notifications as read |
| `POST` | `/api/upload` | Upload image file (multipart/form-data) |

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- **Node.js**: `v18.0.0` or higher
- **npm**, **pnpm**, or **yarn**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/rezabanihabib/quera-socially.git
   cd quera-socially
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure API URL (if required):**
   Update the backend API base URL in `src/api/axiosInstance.ts` or configure an environment variable.

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server with HMR |
| `npm run build` | Compiles TypeScript (`tsc -b`) and bundles for production |
| `npm run preview` | Locally previews the production build |
| `npm run lint` | Runs ESLint across the codebase |

---

## 📄 License

This project is created for educational and community demonstration purposes as part of the Quera frontend program.
