# Context Menu Guide

The extension adds a convenient **"Fix Georgian Layout"** option to your right-click context menu for instant text conversion and Google search.

## How to Use

### Basic Usage
1. **Select Georgian text** anywhere on any webpage
2. **Right-click** on the selected text  
3. **Click "Fix Georgian Layout"** from the context menu
4. **Google search opens** in a new tab with the converted English text

### What Happens
- Text gets converted using keyboard layout mapping
- Automatic Google search opens in new tab
- Notification shows before/after conversion
- Original selection remains unchanged on the page

## Examples

### Search Intent
```
Select: "რა არის რეაქტ ჯავასქრიპტი"
Right-click → Fix Georgian Layout
Result: Google search for "what is react javascript"
```

### Website Search
```
Select: "ფეისბუღ ლოგინ"
Right-click → Fix Georgian Layout  
Result: Google search for "facebook login"
```

### Technical Terms
```
Select: "ღრომე დეველოპერ ტოლს"  
Right-click → Fix Georgian Layout
Result: Google search for "chrome developer tools"
```

## Context Menu Behavior

### When Available
- ✅ Appears only when text is selected
- ✅ Works on any webpage
- ✅ Detects Georgian characters automatically
- ✅ Shows helpful notification with conversion

### Smart Detection
- Only appears when Georgian text is selected
- Gracefully handles mixed language text
- Provides feedback if no Georgian characters found
- Works with partial selections and long paragraphs

## Perfect For

- **Quick research**: Convert and search Georgian terms instantly
- **Technical searches**: Hardware, software, programming terms  
- **Shopping**: Product names, brands, specifications
- **Learning**: Educational terms, concepts, definitions
- **Troubleshooting**: Error messages, technical issues

## Alternative Methods

If context menu isn't convenient:
- **Keyboard shortcut**: Ctrl+Shift+F (copy text first)
- **Chrome address bar**: Type "geo " + text
- **Lamp icon**: Click when typing in input fields

## Technical Details

### Search Integration
- Uses Chrome's native `chrome.search.query` API
- Opens in new tab (doesn't disrupt current page)
- Preserves search history and preferences
- Works with default search engine settings

### Privacy & Security
- No data sent to extension servers
- Conversion happens locally
- Only opens standard Google search
- Respects Chrome's security sandbox

The context menu provides the fastest way to research Georgian text you encounter while browsing! 🔍