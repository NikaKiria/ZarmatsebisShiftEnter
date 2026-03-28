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