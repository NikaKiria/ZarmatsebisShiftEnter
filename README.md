# Georgian to English Keyboard Converter

A Chrome Extension that detects when you accidentally type English words using a Georgian keyboard layout and provides instant conversion suggestions.

## Features

- 🔍 **Automatic Detection**: Monitors text input fields and detects Georgian characters
- 🔄 **Smart Conversion**: Maps Georgian characters to their corresponding English keys based on QWERTY layout positions  
- 💡 **Subtle Lamp Indicator**: Shows a gentle glowing lamp 💡 icon when Georgian text is detected
- 🖱️ **Click-to-Convert**: Click the lamp icon to see the full English suggestion 
- 🔍 **Context Menu**: Right-click selected Georgian text → "Fix Georgian Layout" → Google search
- ⌨️ **Keyboard Shortcuts**: Ctrl+Shift+X (convert) and Ctrl+Shift+F (fix & search) for instant conversion
- 🔍 **Chrome Search Bar**: Use "geo" keyword in Chrome address bar for instant conversion
- ⚡ **Debounced Performance**: Uses 200ms debounce to prevent lag during typing
- 🎨 **Beautiful UI**: Ghibli-inspired soft color palette with modern design
- 🌓 **Dark Mode Support**: Automatically adapts to system theme preferences
- 📱 **Mobile Responsive**: Click interaction works well on mobile browsers
- 😌 **Non-intrusive**: Respects users who intentionally want to write in Georgian

## How It Works

The extension maps Georgian keyboard characters to their English equivalents based on key positions:

```
Georgian: ქ წ ე რ ტ ყ უ ი ო პ ა ს დ ფ გ ჰ ჯ კ ლ ზ ხ ც ვ ბ ნ მ  
English:  q w e r t y u i o p a s d f g h j k l z x c v b n m
```

### Example Conversions
- `სჰე მადე დეცისიონ` → `she made decision`
- `ჰელლო ჟორლდ` → `hello world`
- `ეჰის ის ა ეესე` → `this is a test`
- **Context menu**: Select text → Right-click → "Fix Georgian Layout" → Google search
- **Keyboard shortcuts**: Ctrl+Shift+X (convert) or Ctrl+Shift+F (search)
- **Chrome search bar**: `geo ჰელლო ჟორლდ` → Search for "hello world"

## Installation

### Method 1: Developer Mode (Recommended for testing)

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in the top right)
4. Click "Load unpacked" and select the extension folder
5. The extension icon will appear in your Chrome toolbar

### Method 2: Chrome Web Store (When published)
1. Visit the Chrome Web Store
2. Search for "Georgian to English Keyboard Converter"
3. Click "Add to Chrome"

## Usage

### On Webpages
1. **Type normally** in any text input field on websites
2. **Lamp appears** 💡 A subtle glowing lamp icon appears when Georgian characters are detected  
3. **Click to convert** Click the lamp icon to see the English suggestion
4. **Convert instantly** Click the "Replace" button to convert, or dismiss with the X button

### Context Menu (Right-Click)
1. **Select Georgian text** anywhere on a webpage
2. **Right-click** to open context menu
3. **Click "Fix Georgian Layout"** from the menu
4. **Google search opens** in new tab with converted English text

### Keyboard Shortcuts (Recommended)
1. **Focus or select** Georgian text anywhere (text fields, selected text, or copy to clipboard)
2. **Press Ctrl+Shift+X** (Cmd+Shift+X on Mac) for conversion
3. **Press Ctrl+Shift+F** (Cmd+Shift+F on Mac) for fix & search from clipboard
4. **Instant conversion** Text gets converted immediately with notifications
5. **Works everywhere** Including Chrome address bar via clipboard

### In Chrome Search Bar  
1. **Type keyword** Type "geo" followed by a space in Chrome's address bar
2. **Add Georgian text** Type your Georgian text (e.g., "geo ჰელლო ჟორლდ")
3. **Select suggestion** Choose from the conversion suggestions that appear
4. **Search or navigate** Press Enter to search or navigate with the converted English text

## File Structure

```
├── manifest.json          # Extension configuration and permissions
├── content.js            # Main logic for webpage detection and conversion
├── background.js         # Chrome search bar (omnibox), context menu, and keyboard shortcuts
├── styles.css            # Modern styling with Ghibli-inspired colors
├── popup.html            # Extension popup interface
└── README.md            # This file
```

## Technical Details

### Keyboard Mapping
The conversion is based on the standard Georgian QWERTY keyboard layout, mapping each Georgian character to its corresponding English key position rather than phonetic similarity.

### Performance Optimizations
- **Debounced Input**: 200ms delay prevents excessive processing
- **Smart Detection**: Only processes text containing Georgian characters
- **Efficient DOM**: Minimal DOM manipulation for better performance
- **Memory Management**: Automatic cleanup of suggestion boxes

### Browser Compatibility
- ✅ Chrome (Manifest V3)
- ✅ Edge (Chromium-based)
- ⚠️ Firefox (requires Manifest V2 adaptation)
- ⚠️ Safari (requires different approach)

## Permissions

The extension requires minimal permissions:
- `activeTab`: To access content on the currently active tab
- `scripting`: To inject the content script for text detection
- `storage`: To store user preferences (future feature)
- `notifications`: To show conversion notifications for keyboard shortcuts
- `clipboardRead/Write`: To handle clipboard text conversion
- `contextMenus`: To provide right-click context menu functionality
- `search`: To open Google search with converted text
- `omnibox`: To provide Chrome search bar functionality with "geo" keyword

## Privacy

This extension:
- ✅ Works entirely locally (no data sent to servers)
- ✅ Only processes text you type
- ✅ Does not store or transmit any personal information
- ✅ Does not track user behavior

## Development

### Local Development
1. Make changes to the source files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Reload the page you're testing on

### Adding New Features
- Modify `content.js` for new detection logic
- Update `styles.css` for UI changes
- Adjust `manifest.json` for new permissions

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Known Issues

- Some dynamically loaded content may require page refresh
- Very fast typing might occasionally miss Georgian characters
- Complex text fields (rich text editors) may need special handling

## Future Enhancements

- [ ] Support for other Georgian keyboard layouts
- [ ] Custom word dictionaries
- [ ] Undo functionality
- [ ] Keyboard shortcuts
- [ ] Statistics and usage tracking
- [ ] Support for other similar language pairs

## License

MIT License - see LICENSE file for details

## Support

If you encounter any issues or have feature requests, please open an issue on GitHub.