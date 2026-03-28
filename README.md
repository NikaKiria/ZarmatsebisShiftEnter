# Georgian to English Keyboard Converter

A Chrome Extension that detects when you accidentally type English words using a Georgian keyboard layout and provides instant conversion suggestions.

## Features

- 🔍 **Automatic Detection**: Monitors text input fields and detects Georgian characters
- 🔄 **Smart Conversion**: Maps Georgian characters to their corresponding English keys based on QWERTY layout positions  
- 💡 **Non-intrusive Suggestions**: Shows a clean floating suggestion box instead of auto-replacing
- ⚡ **Debounced Performance**: Uses 200ms debounce to prevent lag during typing
- 🎨 **Beautiful UI**: Ghibli-inspired soft color palette with modern design
- 🌓 **Dark Mode Support**: Automatically adapts to system theme preferences
- 📱 **Mobile Responsive**: Works well on mobile browsers

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

1. **Type normally** in any text input field on websites
2. **Georgian detected?** A suggestion box will appear when Georgian characters are found
3. **Convert instantly** by clicking the "Replace" button in the suggestion box
4. **Dismiss suggestions** by clicking the X button or clicking elsewhere

## File Structure

```
├── manifest.json          # Extension configuration and permissions
├── content.js            # Main logic for detection and conversion
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