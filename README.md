# Developer Canvas

Developer Canvas is a web application that merges the functionality of a developer profile platform and a real-time collaborative coding environment. Users can authenticate via GitHub OAuth, create and share profiles with GitHub data, skills, projects, and social links, collaborate in groups on HTML/CSS code, and track contributions and ratings.

## Features

-   **GitHub OAuth**: Login using GitHub for seamless profile integration.
-   **Profile Creation & Sharing**: Build profiles with GitHub data, custom bio, skills, projects, and social links, with shareable URLs and OpenGraph metadata.
-   **Profile Search**: Search for developers by GitHub username, skills, or repository stars.
-   **Group Collaboration**: Create or join groups for real-time HTML/CSS coding using Yjs and CodeMirror.
-   **Real-time Code Editing**: Collaborate on code with live previews and edit history.
-   **Progress Tracking**: Display contributions and peer ratings on user profiles.
-   **Responsive Design**: Mobile-friendly UI with Tailwind CSS and Framer Motion animations.
-   **Analytics**: View platform-wide stats (e.g., total profiles, groups, projects).

## Tech Stack

-   **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Sonner, Lucide React, CodeMirror, Yjs, Socket.IO
-   **Backend**: Node.js, Express, MongoDB, Passport (GitHub OAuth), Yjs, Socket.IO
-   **Database**: MongoDB
-   **Others**: Axios, Validator, Node-cache, JWT, Rate-limit

## Folder Structure

```
developer-canvas/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection setup
│   ├── middleware/
│   │   ├── auth.js            # Authentication middleware
│   │   ├── error.js           # Error handling middleware
│   │   └── validate.js        # Input validation middleware
│   ├── models/
│   │   ├── User.js            # User schema (GitHub ID, group, contributions)
│   │   ├── Group.js           # Group schema (members, code, history)
│   │   └── Profile.js         # Profile schema (GitHub data, projects, links)
│   ├── routes/
│   │   ├── auth.js            # GitHub OAuth routes
│   │   ├── profiles.js        # Profile CRUD routes
│   │   ├── groups.js          # Group management routes
│   │   └── analytics.js       # Platform analytics routes
│   ├── services/
│   │   └── github.js          # GitHub API service
│   ├── sockets/
│   │   └── index.js           # Socket.IO and Yjs for real-time collaboration
│   ├── .env                   # Backend environment variables
│   └── server.js              # Main Express server
├── frontend/
│   ├── src/
│   │   ├── assets/            # Static assets (images, etc.)
│   │   ├── components/
│   │   │   ├── GitHubProfileCard.jsx  # Profile card for search results
│   │   │   ├── RepoCard.jsx           # Repository details card
│   │   │   ├── StatCard.jsx           # Analytics stat card
│   │   │   ├── LoadingSpinner.jsx     # Loading animation
│   │   │   └── CodeEditor.jsx        # Real-time HTML/CSS editor
│   │   ├── context/
│   │   │   └── ApiContext.jsx        # API context for data fetching
│   │   ├── pages/
│   │   │   ├── Home.jsx              # Home page with search and stats
│   │   │   ├── CreateProfile.jsx     # Profile creation form
│   │   │   ├── ProfilePage.jsx       # Detailed profile view
│   │   │   ├── Editor.jsx            # Real-time code editor
│   │   │   └── NotFound.jsx          # 404 page
│   │   ├── store/
│   │   │   └── index.js              # Zustand state management
│   │   ├── App.jsx                   # Main app with routing
│   │   ├── index.css                 # Global Tailwind styles
│   │   └── main.jsx                  # React entry point
│   ├── public/
│   │   └── index.html                # HTML template
│   ├── .env                          # Frontend environment variables
│   ├── package.json                  # Frontend dependencies
│   └── vite.config.js                # Vite configuration
├── README.md                         # Project documentation
└── package.json                      # Backend dependencies

```

## Prerequisites

-   **Node.js**: v16 or higher
-   **MongoDB**: Local or cloud instance (e.g., MongoDB Atlas)
-   **GitHub OAuth App**: Register at [GitHub Developer Settings](https://github.com/settings/developers)
-   **npm**: Included with Node.js

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-repo/developer-canvas.git
cd developer-canvas

```

### 2. Backend Setup

1.  Navigate to the backend directory:
    
    ```bash
    cd backend
    
    ```
    
2.  Install backend dependencies:
    
    ```bash
    npm install
    
    ```
    
3.  Create a `.env` file in `backend/` with the following:
    
    ```
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/developer-canvas
    GITHUB_CLIENT_ID=your_github_client_id
    GITHUB_CLIENT_SECRET=your_github_client_secret
    GITHUB_TOKEN=your_github_personal_access_token
    SESSION_SECRET=your_session_secret
    JWT_SECRET=your_jwt_secret
    FRONTEND_URL=http://localhost:3000
    ALLOWED_ORIGINS=http://localhost:3000
    
    ```
    
    -   Obtain `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` from your GitHub OAuth app.
    -   Generate a `GITHUB_TOKEN` from [GitHub Personal Access Tokens](https://github.com/settings/tokens).
    -   Use secure random strings for `SESSION_SECRET` and `JWT_SECRET`.
4.  Start the backend server:
    
    ```bash
    npm start
    
    ```
    

### 3. Frontend Setup

1.  Navigate to the frontend directory:
    
    ```bash
    cd frontend
    
    ```
    
2.  Install frontend dependencies:
    
    ```bash
    npm install
    
    ```
    
3.  Create a `.env` file in `frontend/` with the following:
    
    ```
    VITE_API_BASE=http://localhost:5000/api
    VITE_SOCKET_URL=http://localhost:5000
    
    ```
    
4.  Start the frontend development server:
    
    ```bash
    npm run dev
    
    ```
    

### 4. MongoDB Setup

-   Install MongoDB locally or use a cloud service like MongoDB Atlas.
-   Ensure the `MONGO_URI` in `backend/.env` points to your MongoDB instance.
-   Start MongoDB locally:
    
    ```bash
    mongod
    
    ```
    

### 5. Running the Application

-   Ensure MongoDB is running.
-   Start the backend server (`npm start` in `backend/`).
-   Start the frontend server (`npm run dev` in `frontend/`).
-   Open `http://localhost:3000` in your browser.

### 6. npm Commands

-   **Backend**:
    
    ```bash
    cd backend
    npm install              # Install dependencies
    npm start               # Start server
    npm run dev             # Start with nodemon (if configured)
    
    ```
    
-   **Frontend**:
    
    ```bash
    cd frontend
    npm install              # Install dependencies
    npm run dev             # Start development server
    npm run build           # Build for production
    npm run preview         # Preview production build
    
    ```

## How to Use the Application

1.  **Login**: Click "Login with GitHub" to authenticate via OAuth.
2.  **Create Profile**:
    -   Navigate to `/create`.
    -   Fill in the multi-step form (GitHub username, bio, skills, projects, social links, theme).
    -   Submit to create a shareable profile.
3.  **Search Profiles**:
    -   On the home page, search by GitHub username, skills, or minimum stars.
    -   View profile cards and click to see detailed profiles.
4.  **Collaborate**:
    -   Create or join a group from the home page.
    -   Access the editor (`/editor`) to collaborate on HTML/CSS in real-time.
    -   View live previews and edit history.
    -   Rate group members (1-5 stars).
5.  **View Profiles**:
    -   Visit `/profile/:username` to see detailed profiles, including GitHub repos, group membership, contributions, and ratings.
6.  **Analytics**:
    -   View platform stats (total profiles, projects, groups) on the home page.

## Troubleshooting

-   **MongoDB Connection**: Ensure MongoDB is running and `MONGO_URI` is correct.
-   **GitHub OAuth**: Verify `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, and callback URL in GitHub OAuth app settings.
-   **CORS Issues**: Check `ALLOWED_ORIGINS` and `FRONTEND_URL` in `backend/.env`.
-   **Real-time Issues**: Ensure `VITE_SOCKET_URL` matches backend URL and ports are open.
-   **Rate Limits**: GitHub API limits may cause errors; use a valid `GITHUB_TOKEN`.

## Contributing

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/YourFeature`).
3.  Commit changes (`git commit -m 'Add YourFeature'`).
4.  Push to the branch (`git push origin feature/YourFeature`).
5.  Open a Pull Request.

## License

MIT License. See `LICENSE` for details.