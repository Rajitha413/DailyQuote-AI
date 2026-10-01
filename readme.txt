# 🌟 DailyQuoteAI

DailyQuoteAI is a full-stack web application designed to offer real-time, mood-based affirmations and quotes. Rather than delivering static content, the application allows users to log their mood ratings, generates a tailored motivational quote, and securely stores logs to display historical patterns.

---

## 📌 Features

* **Interactive Mood Logging:** Simple UI scale for daily check-ins.
* **Real-time Personalization:** Instant generation of tailored quotes based on the user's current mood.
* **Persistent History Log:** Dynamic retrieval and rendering of previous mood records and received quotes.
* **Full-Stack Architecture:** Node.js and Express backend handling data routes and local storage processing.

---

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3, JavaScript, VS Code Live Server
* **Backend:** Node.js, Express.js
* **Database:** Lightweight local database (SQLite/JSON-based setup)
* **Tools:** VS Code, Git

---

## 📁 Project Structure

```text
DAILYQUOTE.../
├── backend/
│   ├── node_modules/
│   ├── database.js
│   ├── db.sqlite
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
├── database.js
├── index.html
├── script.js
└── style.css

🚀 How to Run the Project
Follow these steps to set up and run the project on your local machine.

Prerequisites
Ensure you have the following installed:
> Node.js (LTS version)
> Visual Studio Code
> VS Code Extension: Live Server

Step-by-Step Installation & Setup :
1. Open the Project
Open VS Code, go to File -> Open Folder..., and select your root project directory (DAILYQUOTE...).

2. Install Backend Dependencies
Navigate into your backend folder via the terminal or open a terminal inside it, then run:

Bash
> npm install

3. Start the Backend Server
In your terminal, navigate to the backend directory and start your server:

Bash
> cd backend
> node server.js
You should see confirmation that your server is running successfully. Keep this terminal open while using the application.

4. Launch the Frontend
In the VS Code File Explorer, right-click on your root index.html file.

Select Open with Live Server.

Your default web browser will open the application interface automatically.