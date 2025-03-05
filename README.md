# GraphQL Profile Visualization

A visually stunning web application built to display user data from the Reboot01 platform using GraphQL. This project features interactive data visualizations using D3.js, a space-themed UI, and secure authentication.

## 🌌 Overview

This application provides a cosmic-themed interface to visualize student data fetched via GraphQL queries from the Reboot01 learning platform. The data visualizations include XP progression, audit ratios, and skills distribution represented through beautiful, interactive graphs.

## ✨ Features

- **Secure Authentication**: JWT-based login system with Basic Auth
- **Interactive Data Visualizations**:
  - XP Progress Line Chart
  - Audit Ratio Donut Chart
  - Skills Distribution Radar Chart
- **Space-Themed UI**:
  - Black hole animation
  - Orbital star effects
  - Constellation-style layout
  - Cursor star trails
- **Responsive Design**: Adapts to different screen sizes
- **Comprehensive Error Handling**: Custom 404 and 500 error pages

## 🚀 Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/graphql-visualizer.git
   cd graphql-visualizer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. Access the application:
   ```
   http://localhost:8080
   ```

## 📊 Data Visualization

### XP Progress
Visualizes your XP accumulation over time with an animated line chart, showing your progress through your learning journey.

### Audit Ratio
Displays the ratio between audits done and received, helping you track your audit exchange balance.

### Skills Distribution
Showcases your proficiency across various programming domains using a radar chart, highlighting your strengths and growth areas.

## 🔧 Technical Stack

- **Frontend**:
  - HTML5, CSS3, JavaScript
  - D3.js for data visualization
  - Custom animations and effects
- **Backend**:
  - Node.js
  - Express.js
- **Data**:
  - GraphQL for data fetching
  - JWT for authentication
- **Design**:
  - Space-themed UI/UX
  - Responsive layout

## 📁 File Structure

```
├── index.html          # Welcome page
├── profile.html        # User profile page with visualizations
├── error.html          # Error page template
├── style.css           # Main stylesheet
├── error.css           # Error page styling
├── main.js             # Express server
├── login.js            # Authentication handling
├── profile.js          # Profile page logic
├── star.js             # Space background effects
├── line.js             # Constellation line effects
├── xpgraph.js          # XP visualization
├── audit.js            # Audit ratio visualization
└── skills.js           # Skills radar chart
```

## 🔐 Authentication

This application uses JWT authentication with the Reboot01 API. Users must provide valid credentials to access their data. The authentication flow:

1. User enters username and password
2. Credentials are encoded and sent to the API
3. Upon successful authentication, a JWT token is returned
4. This token is used for subsequent GraphQL queries

## 🌟 Usage

1. Visit the welcome page
2. Click "TRY MY GRAPHQL" to access the login screen
3. Enter your Reboot01 credentials
4. Explore your personalized data visualizations
5. Navigate between different visualization nodes to see various aspects of your progress

## ⚠️ Error Handling

The application includes comprehensive error handling:
- Missing files trigger appropriate error responses
- Invalid routes show a 404 error page
- Server errors display a 500 error page
- Authentication failures show a user-friendly error message

## 👨‍💻 About the Author

Developed by Mohamed Redha as a demonstration of GraphQL, data visualization, and frontend design skills.

## 📄 License

This project is intended for educational purposes. All rights reserved.
