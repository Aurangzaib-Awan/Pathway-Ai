# Pathway-AI

## Goal
A full-stack web application designed to provide personalized career recommendations based on user profiles and personality assessments.

## Stack
- **Frontend:** Vanilla HTML, CSS, JavaScript
- **Backend:** Node.js, Express, MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **Database:** MongoDB Atlas

## Key Features
- **User Authentication:** Secure signup, login, and session management using JWT
- **Public Access Pages:** Personality Test and Career Path Explorer are accessible without authentication
- **Protected Routes:** Dashboard and user profile pages require valid JWT

## Dynamic UI
- Responsive dashboard displaying user progress and recommendations
- Support for dark/light themes

## API Integration
Dedicated `api.js` in the frontend to handle HTTP requests (`fetch`) to backend endpoints (`/api/auth/login`, `/api/auth/signup`).

## Basic Workflow
1. **User Access:** Public pages (e.g., Personality Test) are available to all users
2. **Authentication:** Users sign up or log in to access protected features (e.g., Dashboard)
3. **Data Flow:** Frontend communicates with backend via API calls, storing user data in MongoDB
4. **UI Updates:** Dynamic content (e.g., recommendations) is rendered based on user input and backend responses

## Conclusion
Pathway-AI is a functional MVP that effectively bridges user input with career recommendations. The project features a clean separation of frontend and backend logic, selective authentication for public/private pages, and a responsive interface. Future enhancements include deeper AI-driven recommendations and an admin dashboard for user management.

**Status:** Operational (Testing Phase)
