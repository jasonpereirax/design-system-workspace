# Setup Instructions

## Prerequisites

You need to have Node.js installed on your system. If you don't have it:

1. **Download Node.js**: Visit [nodejs.org](https://nodejs.org/) and download the LTS version
2. **Install Node.js**: Run the installer and follow the instructions
3. **Verify installation**: Open a new terminal and run:
   ```bash
   node --version
   npm --version
   ```

## Connect to GitHub

### Option 1: Using GitHub CLI (Recommended)

1. **Install GitHub CLI**:
   ```bash
   brew install gh
   ```

2. **Authenticate**:
   ```bash
   gh auth login
   ```

3. **Create repository and push**:
   ```bash
   cd ~/Desktop/gauge-design-system
   gh repo create gauge-design-system --public --source=. --remote=origin
   git push -u origin main
   ```

### Option 2: Manual Setup

1. **Create a new repository on GitHub**:
   - Go to [github.com/new](https://github.com/new)
   - Name: `gauge-design-system`
   - Description: "A modern design system built with React and TypeScript"
   - Choose Public or Private
   - Don't initialize with README (we already have files)
   - Click "Create repository"

2. **Connect your local repository**:
   ```bash
   cd ~/Desktop/gauge-design-system
   git remote add origin https://github.com/YOUR_USERNAME/gauge-design-system.git
   git push -u origin main
   ```

## Install Dependencies

Once Node.js is installed:

```bash
cd ~/Desktop/gauge-design-system
npm install
```

## Run the Development Server

```bash
npm run dev
```

Then open your browser to the URL shown (usually http://localhost:5173)

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.
