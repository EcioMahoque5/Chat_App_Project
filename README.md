# Chat App

A real-time chat application built with a Flask + Socket.IO backend and a React + Vite + Bootstrap frontend.

## Project Structure

The repository contains two main folders:

### 1. **Server** (Backend)
- **Frameworks/Technologies:** Flask, Socket.IO
- **Folder Contents:**
  - `app/`: Contains the main Flask application logic, including configurations, models, validators, and routes.
    - `__init__.py`: Initializes the Flask app.
    - `config.py`: Configuration settings for the app.
    - `validators.py`: Form validation logic.
    - `models.py`: Database models.
    - `routes.py`: Routes and API endpoints.
  - `venv/`: Virtual environment (not included in the repo).
  - `.env`: Environment file containing sensitive variables.
  - `requirements.txt`: Python dependencies.
  - `run.py`: Entry point for running the Flask server, using the following environment variables:
    - `SECRET_KEY`
    - `JWT_SECRET_KEY`
    - `DATABASE_URL` (MySQL connection string).

### 2. **Client** (Frontend)
- **Frameworks/Technologies:** React, Vite, Bootstrap
- **Folder Contents:**
  - `public/`: Static files.
  - `src/`: React application source code.
    - `components/`: Contains reusable React components.
      - `AxiosInstance.jsx`: Axios configuration for API requests.
      - `ChatSection.jsx`: Main chat interface with WebSocket integration and message display.
      - `LoginPage.jsx`: Login form page with validation and API call for authentication.
      - `Message.jsx`: Individual message component, dynamically styled based on message type.
      - `SignUpPage.jsx`: Signup form page with validation and API call for user registration.
    - `App.jsx`: Main application entry point that defines routes for Login, Signup, and Chat pages.
    - `index.css`: Global styles.
    - `main.jsx`: Application bootstrap file.
  - `.gitignore`: Ignored files for the client.
  - `index.html`: Main HTML template.
  - `package-lock.json`: Dependency lock file.
  - `package.json`: Node.js project metadata.
  - `vite.config.js`: Vite configuration file.

## Features

### Backend Features:
- **WebSocket Support**: Real-time communication using Flask-SocketIO.
- **User Authentication**: Login and signup APIs with JWT tokens for secure access.
- **CRUD APIs**:
  - Create users.
  - Fetch all users.
  - Retrieve messages in a chat room.
- **Database Integration**: MySQL is used as the database.
- **Socket.IO Events**:
  - `message`: Handles real-time messaging, including saving messages to the database.
  - `join`: Allows users to join specific chat rooms.
  - `leave`: Allows users to leave specific chat rooms.

### Frontend Features:
- **Responsive Design**: Built with React and styled using Bootstrap.
- **Real-Time Messaging**: Communicates with the backend WebSocket server for live updates.
- **User Management**: Login and signup functionality with JWT integration.
- **Dynamic Components**:
  - **ChatSection**: Displays chat messages, handles real-time updates via WebSocket, and provides a text input for new messages.
  - **Message**: Dynamically styled based on whether the message is incoming or outgoing.
  - **LoginPage**: Validates user credentials and connects to the chat room.
  - **SignUpPage**: Registers new users with form validation and API integration.

## Requirements

### Backend:
- Python 3.8+
- Flask
- Flask-SocketIO
- Flask-Migrate
- MySQL Database
- Other dependencies listed in `requirements.txt`

### Frontend:
- Node.js 16+
- npm or yarn

## Installation

### Backend (Server):
1. Navigate to the `server/` directory:
   ```bash
   cd server
   ```
2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate   # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file in the `server/` directory and add the following variables:
   ```env
   SECRET_KEY=your_secret_key
   JWT_SECRET_KEY=your_jwt_secret_key
   DATABASE_URL=mysql+pymysql://username:password@host/database_name
   ```
5. Initialize database migrations with Flask-Migrate:
   ```bash
   flask db init
   ```
6. Generate a new migration:
   ```bash
   flask db migrate -m "Initial migration"
   ```
7. Apply the migration to the database:
   ```bash
   flask db upgrade
   ```
8. Start the server:
   ```bash
   python run.py
   ```

### Frontend (Client):
1. Navigate to the `client/` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Running the Application

1. Start the backend server as described above.
2. Start the frontend development server.
3. Open your browser and navigate to the URL displayed by the Vite server (usually `http://localhost:5173`).

## Additional Notes for Developers
- **Axios Configuration**: All API requests are managed using `AxiosInstance.jsx`, which includes a base URL for backend communication.
- **WebSocket Integration**: `ChatSection.jsx` handles WebSocket events (`message`, `join`, `leave`) and updates the UI dynamically.
- **Styling**: The app uses `styled-components` for CSS-in-JS styling, ensuring clean and modular styles for components.

