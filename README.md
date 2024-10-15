# OurStoryz Core Plugin

This is a WordPress plugin that allows you to manage modal popups based on user choices. The plugin includes both an admin dashboard to configure choices and a frontend interface that displays modals based on those choices. The plugin is built with React and leverages the WordPress REST API.

## Installation

### Prerequisites
Make sure you have Node.js and npm installed. You can download them from [Node.js](https://nodejs.org/).

### Step 1: Install Dependencies

Navigate to the plugin's root directory (`ourstoryz-core`) and run the following commands to install the necessary dependencies:

```bash
# Install dependencies for React and WordPress API Fetch
npm install react react-dom @wordpress/api-fetch@latest

# Install development dependencies for Babel and Webpack
npm install --save-dev @babel/core @babel/preset-env @babel/preset-react babel-loader webpack webpack-cli
