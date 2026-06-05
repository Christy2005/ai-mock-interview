# AI Mock Interview Platform

An AI-powered mock interview platform that helps users practice technical interviews with real-time AI-generated questions, speech-based answering, performance evaluation, and detailed feedback reports.
Live Demo
project link: ai-mock-interview-eybv.vercel.app
---

## Features
Features
* AI-generated interview questions
* Real-time speech-to-text interview mode
* AI-based interview evaluation
* Technical, communication, and confidence scoring
* Question-wise feedback analysis
* Practice mode with AI-generated answers
* Downloadable PDF cheat sheets
* Interactive dashboard with charts
* JWT authentication system
* Interview history tracking
* AI chatbot assistant

### AI Interview Generation

* Generate interview questions dynamically using Google Gemini AI
* Customize:

  * Role
  * Domain
  * Difficulty
  * Duration

### Real-Time Interview Experience

* Timer-based interview sessions
* Speech-to-text answer recording using Web Speech API
* Automatic answer saving
* Smooth multi-question interview flow

### AI Evaluation System

* AI-generated evaluation reports
* Technical score
* Communication score
* Confidence score
* Question-wise analysis
* Final interview feedback

### Practice Mode

* Generate unlimited AI practice questions
* “See Answer” feature using AI-generated model answers
* Toggle answer visibility
* Download practice questions as PDF cheat sheets

### Dashboard Analytics

* Interactive dashboard UI
* Pie chart visualization of interview performance
* Navigation cards for:

  * Start Interview
  * Practice Mode
  * History
  * Reports

### Authentication

* User Registration
* Login with JWT Authentication
* Protected routes
* Logout functionality

### Interview History

* View previously attended interviews
* Access evaluation reports anytime

### AI Chatbot Assistant

* Integrated AI chatbot for interview guidance and assistance
* Helps users with:

  * Interview preparation
  * Technical concepts
  * Practice guidance
  * Career-related doubts

---

# Tech Stack

## Frontend

* React.js
* Vite
* React Router
* CSS
* Recharts
* jsPDF

## Backend

* Node.js
* Express.js

## Database

* PostgreSQL (Neon DB)

## AI Integration

* Google Gemini 2.5 Flash API

## Authentication

* JWT (JSON Web Tokens)

## Other APIs

* Web Speech API (Speech-to-Text)

---

# Project Structure

/client → React Frontend
/server → Express Backend

---

# Installation

## 1. Clone Repository

```bash
git clone <your-github-repo-link>
cd ai-mock-interview
```

---

## 2. Install Frontend Dependencies

```bash
cd client
npm install
```

---

## 3. Install Backend Dependencies

```bash
cd ../server
npm install
```

---

# Environment Variables

Create a `.env` file inside the `server` folder.

```env
PORT=5000

DATABASE_URL=your_postgresql_database_url

JWT_SECRET=your_jwt_secret

GEMINI_API_KEY=your_gemini_api_key
```

---

# Run Project

## Start Backend

```bash
cd server
npm start
```

---

## Start Frontend

```bash
cd client
npm run dev
```

---

# API Routes

## Authentication

* POST `/auth/register`
* POST `/auth/login`

## AI

* POST `/ai/generate-questions`
* POST `/ai/generate-answer`

## Interview

* POST `/interview/create-with-questions`
* GET `/interview/:id`
* POST `/save-answer`

## Evaluation

* POST `/evaluation/:interviewId`
* GET `/evaluation/:interviewId`

---

# Screens Included

* Login Page
  <img width="1920" height="961" alt="Screenshot (499)" src="https://github.com/user-attachments/assets/a20a1c65-8e70-4c65-9163-e17e847b9504" />

* Register Page
  <img width="1920" height="952" alt="Screenshot (500)" src="https://github.com/user-attachments/assets/b92fdd6c-036e-499c-8e17-2a4b66be454e" />

* Dashboard
  <img width="1920" height="960" alt="image" src="https://github.com/user-attachments/assets/4f33c04e-c982-429b-a3d6-ff0e1d6409b1" />

* Interview Setup
  <img width="1920" height="968" alt="image" src="https://github.com/user-attachments/assets/f9c65610-661b-41e0-aa42-36e4a784f5e7" />

* Interview Room
  <img width="1920" height="869" alt="image" src="https://github.com/user-attachments/assets/55ba7e0c-dc5c-4728-ad6e-ce8819054609" />

* Evaluation Report
  <img width="1920" height="962" alt="image" src="https://github.com/user-attachments/assets/db830ea9-049b-4db9-9bcd-04ccbe94c34f" />

* Practice Mode
  <img width="1920" height="952" alt="image" src="https://github.com/user-attachments/assets/add1ce0d-d402-4754-ad6f-92ec0afefe2f" />

* History Page
<img width="1920" height="955" alt="image" src="https://github.com/user-attachments/assets/6192bf95-1c93-4614-982b-376df76f802a" />

* AI chatbot
  <img width="1920" height="946" alt="image" src="https://github.com/user-attachments/assets/52a4bab1-ff84-4148-bb9e-21bffec6dce1" />


---

# Deployment

## Frontend

Hosted on Vercel

## Backend

Hosted on Render

## Database

Hosted on Neon PostgreSQL

---

# Future Improvements

* AI voice interviewer
* Webcam-based emotion analysis
* Leaderboards
* Resume analysis
* Coding interview support
* Company-specific interview preparation
* Admin dashboard
* Performance trend graphs

---

# Learning Outcomes

This project helped in understanding:

* Full Stack Web Development
* REST APIs
* Authentication
* PostgreSQL integration
* AI API integration
* State management in React
* Deployment using Vercel and Render
* Real-world project structuring

---

# Author

Christy Denees

Computer Science Engineering Student

Passionate about Full Stack Development and AI-powered applications.
