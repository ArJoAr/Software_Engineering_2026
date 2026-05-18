# University/Student App (Expo React Native)

This repository contains a mobile application built with React Native and Expo. It provides a comprehensive set of features for students, such as a virtual student ID, event tracking, calendar, and quick access to essential tools.

## Tech Stack

*   **Framework:** React Native with Expo
*   **Routing:** Expo Router (File-based routing)
*   **Language:** TypeScript
*   **Authentication & Backend:** Supabase
*   **Icons:** Lucide React Native & Expo Vector Icons
*   **Navigation:** React Navigation (under the hood of Expo Router)

## Repository Structure

The project follows a standard modern Expo Router structure, organizing code by routes, components, contexts, and utilities.

### 📁 `/app`
This is the core of the application where all the screens and navigation routes live, powered by Expo Router.
*   `_layout.tsx`: The root layout file. It sets up the main navigation stack and wraps the app with the `AuthProvider`.
*   `index.tsx`: The entry point that handles routing the user to either the login screen or the main app tabs based on their authentication status.
*   `login.tsx`: The authentication screen.
*   `(tabs)/`: Contains the screens for the main bottom tab navigation.
*   `profile.tsx`: User profile management.
*   `student-id.tsx`: A virtual digital student ID card screen.
*   `calendar.tsx`: A calendar view for tracking schedules and events.
*   `events.tsx`: A centralized screen for viewing upcoming events.
*   `event/[id].tsx`: Dynamic route for viewing the details of a specific event.

### 📁 `/components`
Reusable UI components that are shared across multiple screens to maintain consistency and reduce code duplication.
*   `EventCard.tsx`: Displays event summaries.
*   `NotificationCard.tsx`: Used for displaying alerts or notifications.
*   `QuickAccessCard.tsx`: A component for quick navigation to frequently used features.

### 📁 `/context`
React Context providers for managing global application state.
*   `AuthContext.tsx`: Manages user authentication state, login/logout functions, and session persistence.

### 📁 `/constants`
Static values and configuration used throughout the app.
*   `colors.ts`: Defines the application's color palette for consistent theming.
*   `mockData.ts`: Contains dummy data used for development and UI testing before connecting to a live backend.

### 📁 `/hooks`
Custom React hooks to encapsulate complex logic.
*   `useFrameworkReady.ts`: A hook used to signal when the framework/app is fully mounted and ready.

### 📁 `/types`
TypeScript type definitions and interfaces.
*   `index.ts`: Centralizes the shared types, ensuring type safety across components and API responses.

## Getting Started

1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Start the development server:**
    ```bash
    npm run dev
    ```
3.  **Run on a device or emulator:**
    *   Press `a` to run on an Android emulator.
    *   Press `i` to run on an iOS simulator (macOS only).
    *   Scan the QR code with the Expo Go app on your physical device.

## Scripts

*   `npm run dev`: Starts the Expo development server.
*   `npm run build:web`: Exports the app for the web platform.
*   `npm run lint`: Runs the Expo linter to catch code quality issues.
*   `npm run typecheck`: Runs TypeScript type checking.
