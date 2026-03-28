// Background script for omnibox (Chrome search bar) functionality

// Georgian to English keyboard mapping (same as content script)
const georgianToEnglish = {
  // Lowercase mappings
  'ქ': 'q', 'წ': 'w', 'ე': 'e', 'რ': 'r', 'ყ': 'y', 'უ': 'u', 'ი': 'i', 'ო': 'o', 'პ': 'p',
  'ა': 'a', 'ს': 's', 'დ': 'd', 'ფ': 'f', 'გ': 'g', 'ჰ': 'h', 'ჯ': 'j', 'კ': 'k', 'ლ': 'l',
  'ზ': 'z', 'ხ': 'x', 'ც': 'c', 'ვ': 'v', 'ბ': 'b', 'ნ': 'n', 'მ': 'm', 'თ': 't',
  
  // Uppercase/Shift mappings
  'ღ': 'Q', 'ჭ': 'W', 'ჱ': 'E', 'ჲ': 'R', 'ტ': 'T', 'ყ': 'Y', 'ჳ': 'U', 'ჴ': 'I', 'ჵ': 'O', 'ჶ': 'P',
  'ჷ': 'A', 'შ': 'S', 'ჸ': 'D', 'ჹ': 'F', 'ღ': 'G', 'ჰ': 'H', 'ჯ': 'J', 'კ': 'K', 'ლ': 'L',
  'ჟ': 'Z', 'ხ': 'X', 'ჩ': 'C', 'ჭ': 'B', 'ჼ': 'N', 'ჽ': 'M',
  
  // Numbers and symbols
  '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9', '0': '0',
  '!': '!', '@': '@', '#': '#', '$': '$', '%': '%', '^': '^', '&': '&', '*': '*', '(': '(', ')': ')',
  '-': '-', '_': '_', '=': '=', '+': '+', '[': '[', ']': ']', '{': '{', '}': '}',
  ';': ';', ':': ':', "'": "'", '"': '"', ',': ',', '.': '.', '/': '/', '?': '?',
  '\\': '\\', '|': '|', '`': '`', '~': '~', '<': '<', '>': '>'
};

// Check if text contains Georgian characters
function containsGeorgian(text) {
  const georgianRegex = /[\u10A0-\u10FF]/;
  return georgianRegex.test(text);
}

// Convert Georgian text to English based on keyboard layout
function convertGeorgianToEnglish(text) {
  return text.split('').map(char => georgianToEnglish[char] || char).join('');
}

// Normalize English text (lowercase and clean)
function normalizeEnglishText(text) {
  return text.toLowerCase().trim();
}

// Convert to English function for context menu
function convertToEnglish(text) {
  if (!text || !containsGeorgian(text)) return text;
  return normalizeEnglishText(convertGeorgianToEnglish(text));
}

// Create context menu on extension startup
chrome.runtime.onStartup.addListener(() => {
  createContextMenu();
});

chrome.runtime.onInstalled.addListener(() => {
  createContextMenu();
});

function createContextMenu() {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: 'fix-georgian-layout',
      title: 'Fix Georgian Layout',
      contexts: ['selection']
    });
  });
}

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'fix-georgian-layout' && info.selectionText) {
    const selectedText = info.selectionText;
    
    if (containsGeorgian(selectedText)) {
      const convertedText = convertToEnglish(selectedText);
      
      // Open Google search with converted text
      chrome.search.query({
        text: convertedText,
        disposition: 'NEW_TAB'
      });
      
      // Show notification
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icon128.png',
        title: 'Georgian Layout Fixed!',
        message: `"${selectedText}" → "${convertedText}"\nOpened Google search in new tab.`
      });
    } else {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icon128.png',
        title: 'No Georgian Text',
        message: 'Selected text contains no Georgian characters.'
      });
    }
  }
});

// Handle omnibox input changes
chrome.omnibox.onInputChanged.addListener((text, suggest) => {
  const suggestions = [];
  
  if (text.trim() === '') {
    suggest([
      {
        content: 'help',
        description: '💡 Type Georgian text to convert to English (e.g., "ჰელლო ჟორლდ" → "hello world")'
      }
    ]);
    return;
  }
  
  if (containsGeorgian(text)) {
    const englishVersion = normalizeEnglishText(convertGeorgianToEnglish(text));
    
    if (englishVersion !== text.toLowerCase()) {
      // Add the main conversion suggestion
      suggestions.push({
        content: englishVersion,
        description: `🔄 Convert: "${text}" → "<match>${englishVersion}</match>"`
      });
      
      // Add search suggestion
      suggestions.push({
        content: `search:${englishVersion}`,
        description: `🔍 Search for: "<match>${englishVersion}</match>"`
      });
      
      // If it looks like a URL, add navigation suggestion
      if (englishVersion.includes('.') || englishVersion.startsWith('www.')) {
        suggestions.push({
          content: `url:${englishVersion}`,
          description: `🌐 Navigate to: "<match>${englishVersion}</match>"`
        });
      }
    }
  } else {
    // No Georgian characters detected
    suggestions.push({
      content: 'no-georgian',
      description: '❌ No Georgian characters detected. Try typing with Georgian keyboard layout.'
    });
  }
  
  suggest(suggestions);
});

// Handle omnibox input entered
chrome.omnibox.onInputEntered.addListener((text, disposition) => {
  let url;
  
  if (text === 'help' || text === 'no-georgian') {
    // Open extension popup or help page
    url = 'https://www.google.com/search?q=georgian+keyboard+layout';
  } else if (text.startsWith('search:')) {
    // Search for the converted text
    const searchTerm = text.replace('search:', '');
    url = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`;
  } else if (text.startsWith('url:')) {
    // Navigate to URL
    const targetUrl = text.replace('url:', '');
    url = targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`;
  } else {
    // Default: search for the text
    url = `https://www.google.com/search?q=${encodeURIComponent(text)}`;
  }
  
  // Handle different disposition types
  if (disposition === 'currentTab') {
    chrome.tabs.update({ url: url });
  } else if (disposition === 'newForegroundTab') {
    chrome.tabs.create({ url: url });
  } else if (disposition === 'newBackgroundTab') {
    chrome.tabs.create({ url: url, active: false });
  }
});

// Set default suggestion
chrome.omnibox.setDefaultSuggestion({
  description: '🇬🇪➡️🇺🇸 Type Georgian text to convert to English (e.g., "ჰელლო ჟორლდ")'
});

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'convert-georgian') {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // Inject script to handle conversion in the current tab
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: handleKeyboardShortcut
      });
    } catch (error) {
      console.error('Error handling keyboard shortcut:', error);
      
      // Fallback: try to convert from clipboard
      try {
        const clipboardText = await navigator.clipboard.readText();
        if (clipboardText && containsGeorgian(clipboardText)) {
          const converted = normalizeEnglishText(convertGeorgianToEnglish(clipboardText));
          await navigator.clipboard.writeText(converted);
          
          chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icon128.png',
            title: 'Georgian Converted!',
            message: `"${clipboardText}" → "${converted}"\nConverted text copied to clipboard.`
          });
        } else {
          chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icon128.png',
            title: 'No Georgian Text',
            message: 'No Georgian characters found in clipboard. Copy Georgian text and try Ctrl+Shift+X again.'
          });
        }
      } catch (clipError) {
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icon128.png',
          title: 'Keyboard Shortcut',
          message: 'Press Ctrl+Shift+X when focused on a text field, or copy Georgian text to clipboard first.'
        });
      }
    }
  } else if (command === 'fix-and-search') {
    // Handle fix-and-search command by injecting script into active tab
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // Inject script to handle clipboard reading and search
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: handleFixAndSearch
      });
    } catch (error) {
      console.error('Error handling fix-and-search command:', error);
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icon128.png',
        title: 'Fix & Search Error',
        message: 'Unable to access clipboard. Make sure you have copied Georgian text first.'
      });
    }
  }
});

// Function to be injected into the page to handle keyboard shortcuts
function handleKeyboardShortcut() {
  // Georgian to English mapping (same as content script)
  const georgianToEnglish = {
    'ქ': 'q', 'წ': 'w', 'ე': 'e', 'რ': 'r', 'ყ': 'y', 'უ': 'u', 'ი': 'i', 'ო': 'o', 'პ': 'p',
    'ა': 'a', 'ს': 's', 'დ': 'd', 'ფ': 'f', 'გ': 'g', 'ჰ': 'h', 'ჯ': 'j', 'კ': 'k', 'ლ': 'l',
    'ზ': 'z', 'ხ': 'x', 'ც': 'c', 'ვ': 'v', 'ბ': 'b', 'ნ': 'n', 'მ': 'm', 'თ': 't',
    'ღ': 'Q', 'ჭ': 'W', 'ჱ': 'E', 'ჲ': 'R', 'ტ': 'T', 'ყ': 'Y', 'ჳ': 'U', 'ჴ': 'I', 'ჵ': 'O', 'ჶ': 'P',
    'ჷ': 'A', 'შ': 'S', 'ჸ': 'D', 'ჹ': 'F', 'ღ': 'G', 'ჰ': 'H', 'ჯ': 'J', 'კ': 'K', 'ლ': 'L',
    'ჟ': 'Z', 'ხ': 'X', 'ჩ': 'C', 'ჭ': 'B', 'ჼ': 'N', 'ჽ': 'M',
    '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9', '0': '0',
    '!': '!', '@': '@', '#': '#', '$': '$', '%': '%', '^': '^', '&': '&', '*': '*', '(': '(', ')': ')',
    '-': '-', '_': '_', '=': '=', '+': '+', '[': '[', ']': ']', '{': '{', '}': '}',
    ';': ';', ':': ':', "'": "'", '"': '"', ',': ',', '.': '.', '/': '/', '?': '?',
    '\\': '\\', '|': '|', '`': '`', '~': '~', '<': '<', '>': '>'
  };
  
  function containsGeorgianLocal(text) {
    return /[\u10A0-\u10FF]/.test(text);
  }
  
  function convertGeorgianToEnglishLocal(text) {
    return text.split('').map(char => georgianToEnglish[char] || char).join('');
  }
  
  function normalizeEnglishTextLocal(text) {
    return text.toLowerCase().trim();
  }
  
  // Get the currently focused element
  const activeElement = document.activeElement;
  
  if (activeElement && (
    activeElement.tagName === 'INPUT' || 
    activeElement.tagName === 'TEXTAREA' ||
    activeElement.contentEditable === 'true'
  )) {
    // Handle input fields
    const text = activeElement.value || activeElement.textContent || activeElement.innerText;
    
    if (text && containsGeorgianLocal(text)) {
      const converted = normalizeEnglishTextLocal(convertGeorgianToEnglishLocal(text));
      
      // Replace the text
      if (activeElement.value !== undefined) {
        activeElement.value = converted;
      } else {
        activeElement.textContent = converted;
      }
      
      // Trigger input event
      activeElement.dispatchEvent(new Event('input', { bubbles: true }));
      
      // Show success notification
      showTemporaryNotification(`Converted: "${text}" → "${converted}"`, 'success');
    } else {
      showTemporaryNotification('No Georgian characters found in this field', 'info');
    }
  } else {
    // Not focused on an input field - handle clipboard or selection
    const selection = window.getSelection().toString();
    
    if (selection && containsGeorgianLocal(selection)) {
      const converted = normalizeEnglishTextLocal(convertGeorgianToEnglishLocal(selection));
      
      // Copy to clipboard
      navigator.clipboard.writeText(converted).then(() => {
        showTemporaryNotification(`Converted: "${selection}" → "${converted}"\nCopied to clipboard!`, 'success');
      }).catch(() => {
        showTemporaryNotification(`Converted: "${selection}" → "${converted}"`, 'success');
      });
    } else {
      // Try clipboard
      navigator.clipboard.readText().then(clipText => {
        if (clipText && containsGeorgianLocal(clipText)) {
          const converted = normalizeEnglishTextLocal(convertGeorgianToEnglishLocal(clipText));
          
          navigator.clipboard.writeText(converted).then(() => {
            showTemporaryNotification(`Converted clipboard: "${clipText}" → "${converted}"`, 'success');
          });
        } else {
          showTemporaryNotification('No Georgian text found. Focus on a text field or select/copy Georgian text first.', 'info');
        }
      }).catch(() => {
        showTemporaryNotification('Focus on a text field with Georgian text or select Georgian text first.', 'info');
      });
    }
  }
  
  // Helper function to show temporary notification
  function showTemporaryNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed !important;
      top: 20px !important;
      right: 20px !important;
      background: ${type === 'success' ? 'linear-gradient(135deg, #8bc34a 0%, #7cb342 100%)' : 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)'} !important;
      color: white !important;
      padding: 16px 20px !important;
      border-radius: 8px !important;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
      z-index: 10001 !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-size: 14px !important;
      max-width: 350px !important;
      word-wrap: break-word !important;
      line-height: 1.4 !important;
      animation: slideInFromRight 0.3s ease-out !important;
    `;
    
    notification.innerHTML = message.replace(/\n/g, '<br>');
    document.body.appendChild(notification);
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideInFromRight {
        0% { transform: translateX(100%); opacity: 0; }
        100% { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
      if (style.parentNode) {
        style.remove();
      }
    }, 4000);
  }
}

// Function to be injected for fix-and-search command
function handleFixAndSearch() {
  // Georgian to English mapping
  const georgianToEnglish = {
    'ქ': 'q', 'წ': 'w', 'ე': 'e', 'რ': 'r', 'ყ': 'y', 'უ': 'u', 'ი': 'i', 'ო': 'o', 'პ': 'p',
    'ა': 'a', 'ს': 's', 'დ': 'd', 'ფ': 'f', 'გ': 'g', 'ჰ': 'h', 'ჯ': 'j', 'კ': 'k', 'ლ': 'l',
    'ზ': 'z', 'ხ': 'x', 'ც': 'c', 'ვ': 'v', 'ბ': 'b', 'ნ': 'n', 'მ': 'm', 'თ': 't',
    'ღ': 'Q', 'ჭ': 'W', 'ჱ': 'E', 'ჲ': 'R', 'ტ': 'T', 'ყ': 'Y', 'ჳ': 'U', 'ჴ': 'I', 'ჵ': 'O', 'ჶ': 'P',
    'ჷ': 'A', 'შ': 'S', 'ჸ': 'D', 'ჹ': 'F', 'ღ': 'G', 'ჰ': 'H', 'ჯ': 'J', 'კ': 'K', 'ლ': 'L',
    'ჟ': 'Z', 'ხ': 'X', 'ჩ': 'C', 'ჭ': 'B', 'ჼ': 'N', 'ჽ': 'M',
    '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9', '0': '0',
    '!': '!', '@': '@', '#': '#', '$': '$', '%': '%', '^': '^', '&': '&', '*': '*', '(': '(', ')': ')',
    '-': '-', '_': '_', '=': '=', '+': '+', '[': '[', ']': ']', '{': '{', '}': '}',
    ';': ';', ':': ':', "'": "'", '"': '"', ',': ',', '.': '.', '/': '/', '?': '?',
    '\\': '\\', '|': '|', '`': '`', '~': '~', '<': '<', '>': '>'
  };

  function containsGeorgianLocal(text) {
    return /[\u10A0-\u10FF]/.test(text);
  }

  function convertGeorgianToEnglishLocal(text) {
    return text.split('').map(char => georgianToEnglish[char] || char).join('');
  }

  function normalizeEnglishTextLocal(text) {
    return text.toLowerCase().trim();
  }

  // Try to read clipboard and search
  navigator.clipboard.readText().then(clipboardText => {
    if (clipboardText && containsGeorgianLocal(clipboardText)) {
      const converted = normalizeEnglishTextLocal(convertGeorgianToEnglishLocal(clipboardText));
      
      // Open Google search in new tab
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(converted)}`;
      window.open(searchUrl, '_blank');
      
      // Show success notification
      showTemporaryNotification(`Fixed & Searching!\n"${clipboardText}" → "${converted}"\nOpened Google search in new tab.`, 'success');
    } else {
      showTemporaryNotification('Copy Georgian text to clipboard first, then press Ctrl+Shift+F.', 'info');
    }
  }).catch(error => {
    console.error('Clipboard access error:', error);
    showTemporaryNotification('Could not access clipboard. Make sure you have copied Georgian text first.', 'info');
  });

  // Helper function to show temporary notification
  function showTemporaryNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed !important;
      top: 20px !important;
      right: 20px !important;
      background: ${type === 'success' ? 'linear-gradient(135deg, #8bc34a 0%, #7cb342 100%)' : 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)'} !important;
      color: white !important;
      padding: 16px 20px !important;
      border-radius: 8px !important;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
      z-index: 10001 !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-size: 14px !important;
      max-width: 350px !important;
      word-wrap: break-word !important;
      line-height: 1.4 !important;
      animation: slideInFromRight 0.3s ease-out !important;
    `;
    
    notification.innerHTML = message.replace(/\n/g, '<br>');
    document.body.appendChild(notification);

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideInFromRight {
        0% { transform: translateX(100%); opacity: 0; }
        100% { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
      if (style.parentNode) {
        style.remove();
      }
    }, 5000);
  }
}