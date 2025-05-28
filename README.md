# 🎬 Movie Recommender App

A full-stack web application that recommends movies based on a user's input using a machine learning model. The app provides detailed movie information like genre, IMDb rating, plot, and posters using the OMDb API.

## 🔍 Features

- ✅ Input a movie name and get 10 personalized recommendations
- 🧠 Machine Learning model trained on movie similarity data
- 🎨 Responsive React.js frontend with poster previews
- 🌐 OMDb API integration for fetching movie metadata
- 🔐 Secure API key handling via `.env` file
- ⚙️ Node.js + Express backend with Python model execution

## 🚀 Getting Started

### Prerequisites

- Node.js and npm
- Python 3
- `create-react-app`
- OMDb API key (get one at [http://www.omdbapi.com/apikey.aspx](http://www.omdbapi.com/apikey.aspx))

### Backend Setup

```bash
cd backend
npm install
# (Optional) Create a virtual environment and install Python requirements
node server.js
