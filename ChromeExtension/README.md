# Chrome Extension with React

A Chrome extension built with React that allows you to analyze web pages and save URLs.

## Features

- **Page Analysis**: Analyze the current page for metadata, headings, and element counts
- **URL Saving**: Save URLs for later reference
- **History Tracking**: View and manage your saved URLs
- **Customizable Settings**: Configure the extension to your preferences

## Installation

### Development Mode

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Build the extension:
   ```
   npm run build
   ```
4. Open Chrome and navigate to `chrome://extensions/`
5. Enable "Developer mode" (toggle in the top-right)
6. Click "Load unpacked"
7. Select the `build` folder from your project

### Production Use

The extension is not yet available on the Chrome Web Store.

## Usage

1. Click the extension icon in your Chrome toolbar
2. The extension popup will show the current URL
3. Use the "Analyze Page" button to get details about the current page
4. Use the "Save URL" button to save the current URL to your history
5. Switch between tabs using the navigation bar at the top:
   - **Home**: Main extension interface
   - **History**: View and manage saved URLs
   - **Settings**: Configure extension settings

## Development

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Available Scripts

- `npm start`: Run in development mode (note: not fully compatible with extension development)
- `npm run build`: Build the extension for Chrome
- `npm test`: Run tests
- `npm run eject`: Eject from Create React App

### Project Structure

- `public/`: Static files including manifest.json and content/background scripts
- `src/`: React source code
  - `components/`: React components
  - `styles/`: CSS files
  - `chrome-api.js`: Utilities for working with Chrome APIs

## License

MIT
