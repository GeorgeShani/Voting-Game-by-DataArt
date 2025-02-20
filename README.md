# DailyJokes - The Voting App 🤡
##### Author: George Shanidze
##### Github: [GeorgeShani](https://github.com/GeorgeShani)
## Description:

A fun web application where users can vote on daily jokes using emoji reactions! Built with modern web technologies using React.js and Node.js, this app brings humor and interactivity together. Like Daily news app, but with jokes, some of which are pretty dark 💀💀.

## 📌 Features
#### ✅ Frontend
- **Random Joke Display**: Shows a random joke in a Q&A format.
- **Emoji Voting System**: Users vote on jokes with different emoji reactions.
- **"Next Joke" Button**: Fetches a new joke from the API.
- **Persistent Voting**: Votes are stored in the database, so they remain after refresh!
- **Modern UI**: Styled with a sleek and responsive design.
- **Mobile Responsive**: Works great on all screen sizes!

#### 🛠️ Backend
- **Database Integration**: Stores jokes and votes efficiently using MongoDB.
- **Tracks Votes Per Joke**: Each joke maintains its own voting history.
- **Public API Integration**: Fetches jokes from a reliable [Joke API](https://www.freepublicapis.com/teehee-joke-api).
- **CRUD Operations**: Create, Read, Update, Delete jokes via API.

## 🚀 Tech Stack

| Frontend | Backend |
| --- | --- |
| React.js | Node.js (Express) |
| Tailwind CSS | MongoDB (Mongoose) |
| React Context | User Authentication |
| Framer Motion | CORS Middleware |
| React Query | TeeHee.dev API |

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone git@github.com:GeorgeShani/Voting-Game-by-DataArt.git
cd Voting-Game-by-DataArt
```

### 2️⃣ Replace the placeholders in .env file with actual values
```ini
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
NODE_ENV=development
PORT=5000
```

### 3️⃣ Run build command
```bash
# Installes node modules for both Backend and Frontend
npm run build
```

### 4️⃣ Run the application
```bash
npm run start
```
