# Matara TMA

## Project Overview

Matara TMA is a Telegram Mini App (TMA) that functions as a "tap-to-earn" game. Users can earn in-game currency, referred to as `$MAT`, by actively participating in the game. The primary objective for players is to accumulate `$MAT` through various in-game activities, climb the leaderboards, and potentially qualify for airdrops.

The application is built using a modern web stack, including React, Vite, and Tailwind CSS for the frontend. It utilizes Redux Toolkit for state management and interacts with a backend API for data persistence and game logic. The integration with the TON blockchain is facilitated by the `@tonconnect/ui-react` library, suggesting that wallet connections and transactions are key features.

## Core Features

### 1. Tap-to-Earn Mechanism
The central feature of the game is the "tap-to-earn" mechanic. Users can tap on an element within the app to mine for `$MAT`. The mining process is time-based, with a reset timer that indicates when the next mining session can begin.

### 2. Daily Claims
To encourage daily engagement, the app offers a feature to claim daily rewards. This provides users with a consistent stream of `$MAT` for their participation.

### 3. Ranking System
A comprehensive ranking system is in place to foster competition among players. Users are ranked based on their total `$MAT` earnings. The leaderboard is publicly viewable, and a top position is required to be eligible for community airdrops.

### 4. Referral Program
The application includes a referral program that allows users to invite others to the game. This feature is designed to grow the user base and reward players for their promotional efforts.

### 5. Tasks and Boosts
Users can complete various tasks to earn additional `$MAT`. These tasks may involve social media engagement, in-game achievements, or other promotional activities. Additionally, players can purchase boosts to enhance their earning rate, providing a way to accelerate their progress.

### 6. User Profile and Wallet Integration
The application maintains a user profile that tracks progress, earnings, and other relevant stats. The integration with `@tonconnect/ui-react` suggests that users can connect their TON wallets to the app, which is likely used for managing their `$MAT` and other potential blockchain-related assets.

## Technical Stack

- **Frontend:** React, Vite, Tailwind CSS
- **State Management:** Redux Toolkit
- **API Communication:** Redux Toolkit Query
- **Telegram Integration:** `@twa-dev/sdk`
- **Blockchain Integration:** `@tonconnect/ui-react`

## How to Run the Application

To run the application locally, you will need to have Node.js and yarn installed.

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   ```
2. **Install dependencies:**
   ```bash
   yarn install
   ```
3. **Create a `.env` file** in the root of the project and add the following environment variables:
   ```
   VITE_APP_API_URL=<your-api-url>
   ```
4. **Run the development server:**
   ```bash
   yarn dev
   ```
This will start the application in development mode, and you can access it in your browser at the URL provided by Vite. To test the Telegram Mini App functionality, you will need to use a tool like the Telegram Desktop client's debug mode or a local TMA development environment.
