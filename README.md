# Chrome Extension: Automated Actions and Data Management

This Chrome Extension automates actions like opening specific links, simulating button clicks, and downloading user data in CSV format. The extension leverages `chrome.runtime`, `chrome.tabs`, and `chrome.storage` APIs to interact with web pages dynamically.

## Features

### 1. Automated Link Opening
- Automatically identifies and opens links containing `/ilan/` in new tabs.
- Opens tabs at intervals of 15 seconds to avoid overwhelming the browser.

### 2. Button Click Simulation
- Locates and clicks a specific button (`#numaraAl`) on a web page after it loads.
- Executes custom scripts in the context of the web page to interact with DOM elements.

### 3. Data Extraction and Download
- Extracts user data (e.g., username and phone number) from specific web page elements.
- Saves the extracted data locally using `chrome.storage.local`.
- Provides a downloadable CSV file containing the collected user data.

## Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/sahibinden_bot_chrome_extension.git
   cd sahibinden_bot_chrome_extension
   ```

2. **Load the Extension**
   - Open Chrome and navigate to `chrome://extensions/`.
   - Enable "Developer mode" in the top-right corner.
   - Click "Load unpacked" and select the project folder.

3. **Grant Necessary Permissions**
   Ensure the `manifest.json` includes appropriate permissions for:
   - `tabs`
   - `storage`
   - `scripting`

## How to Use

### Open Links Automatically
1. Navigate to a webpage containing links.
2. Click the "Open Links" button in the extension popup.
3. The extension will open all `/ilan/` links found on the page in new tabs, one every 15 seconds.

### Download User Data
1. Extract user data by clicking the "Download Data" button in the popup.
2. Data will be saved as `users_data.csv` and downloaded to your local machine.

### Automate Button Clicks
1. Ensure the target webpage has a button with the ID `#numaraAl`.
2. The extension will automatically click the button when the tab finishes loading.

## Customization

### Modify Link-Opening Interval
Edit the `setInterval` function in the script:
```javascript
const intervalId = setInterval(() => {
    // Open links logic
}, 15000);  // Change 15000 to your desired interval in milliseconds.
```

### Change Button Behavior
Update the script executed in the target tab:
```javascript
chrome.scripting.executeScript({
    target: { tabId: tabId },
    func: function() {
        const customButton = document.getElementById('yourCustomButton');
        if (customButton) {
            customButton.click();
        }
    }
});
```

## File Structure

```
project-folder/
├── manifest.json        // Configuration for the Chrome Extension
├── background.js        // Background scripts to manage runtime events
├── content.js           // Content scripts for DOM interaction
├── popup.html           // HTML for the extension popup
├── popup.js             // Logic for the extension popup
└── styles.css           // Styling for the extension popup
```

## Permissions
The following permissions are required in the `manifest.json` file:
```json
{
  "permissions": [
    "storage",
    "tabs",
    "scripting",
    "activeTab"
  ]
}
```

## License
This project is licensed under the MIT License. See the LICENSE file for details.
