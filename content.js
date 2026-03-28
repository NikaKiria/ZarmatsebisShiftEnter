// Georgian to English keyboard mapping based on QWERTY key positions
const georgianToEnglish = {
  // Lowercase mappings
  'ქ': 'q', 'წ': 'w', 'ე': 'e', 'რ': 'r', 'ყ': 'y', 'უ': 'u', 'ი': 'i', 'ო': 'o', 'პ': 'p',
  'ა': 'a', 'ს': 's', 'დ': 'd', 'ფ': 'f', 'გ': 'g', 'ჰ': 'h', 'ჯ': 'j', 'კ': 'k', 'ლ': 'l',
  'ზ': 'z', 'ხ': 'x', 'ც': 'c', 'ვ': 'v', 'ბ': 'b', 'ნ': 'n', 'მ': 'm',  'თ': 't',
  
  // Uppercase/Shift mappings
  'ღ': 'Q', 'ჭ': 'W', 'ჱ': 'E', 'ჲ': 'R', 'ტ': 'T', 'ყ': 'Y', 'ჳ': 'U', 'ჴ': 'I', 'ჵ': 'O', 'ჶ': 'P',
  'ჷ': 'A', 'შ': 'S', 'ჸ': 'D', 'ჹ': 'F', 'ღ': 'G', 'ჰ': 'H', 'ჯ': 'J', 'კ': 'K', 'ლ': 'L',
  'ჟ': 'Z', 'ხ': 'X', 'ჩ': 'C', 'ჭ': 'B', 'ჼ': 'N', 'ჽ': 'M',
  
  // Numbers and symbols (common ones)
  '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9', '0': '0',
  '!': '!', '@': '@', '#': '#', '$': '$', '%': '%', '^': '^', '&': '&', '*': '*', '(': '(', ')': ')',
  '-': '-', '_': '_', '=': '=', '+': '+', '[': '[', ']': ']', '{': '{', '}': '}',
  ';': ';', ':': ':', "'": "'", '"': '"', ',': ',', '.': '.', '/': '/', '?': '?',
  '\\': '\\', '|': '|', '`': '`', '~': '~', '<': '<', '>': '>'
};

// Debounce function to avoid lag
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Check if text contains Georgian characters
function containsGeorgian(text) {
  const georgianRegex = /[\u10A0-\u10FF]/;
  return georgianRegex.test(text);
}

// Convert Georgian text to English based on keyboard layout
function convertGeorgianToEnglish(text) {
  return text.split('').map(char => georgianToEnglish[char] || char).join('');
}

// Create lamp icon
function createLampIcon(originalText, suggestedText, inputElement) {
  // Remove any existing lamp or suggestion box
  removeLampIcon();
  removeSuggestionBox();
  
  const lampIcon = document.createElement('div');
  lampIcon.id = 'georgian-lamp-icon';
  lampIcon.innerHTML = '💡';
  lampIcon.title = 'Click to see English suggestion';
  
  // Position the lamp icon
  const rect = inputElement.getBoundingClientRect();
  lampIcon.style.position = 'fixed';
  lampIcon.style.top = `${rect.top + window.scrollY - 5}px`;
  lampIcon.style.left = `${rect.right + window.scrollX + 5}px`;
  lampIcon.style.zIndex = '10000';
  
  document.body.appendChild(lampIcon);
  
  // Store data for later use
  lampIcon.dataset.original = originalText;
  lampIcon.dataset.suggested = suggestedText;
  lampIcon.inputElement = inputElement;
  
  // Click event to show full suggestion
  lampIcon.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    createSuggestionBox(originalText, suggestedText, inputElement);
    removeLampIcon();
  });
  
  // Auto-dismiss after 8 seconds
  setTimeout(() => {
    removeLampIcon();
  }, 8000);
}

// Remove lamp icon
function removeLampIcon() {
  const existingLamp = document.getElementById('georgian-lamp-icon');
  if (existingLamp) {
    existingLamp.remove();
  }
}

// Create suggestion box
function createSuggestionBox(originalText, suggestedText, inputElement) {
  // Remove any existing suggestion box
  removeSuggestionBox();
  
  const suggestionBox = document.createElement('div');
  suggestionBox.id = 'georgian-suggestion-box';
  suggestionBox.innerHTML = `
    <div class="georgian-suggestion-content">
      <span class="georgian-suggestion-text">Did you mean: <strong>${suggestedText}</strong>?</span>
      <button class="georgian-replace-btn" data-original="${originalText}" data-suggested="${suggestedText}">Replace</button>
      <button class="georgian-dismiss-btn">✕</button>
    </div>
  `;
  
  // Position the suggestion box
  const rect = inputElement.getBoundingClientRect();
  suggestionBox.style.position = 'fixed';
  suggestionBox.style.top = `${rect.bottom + window.scrollY + 5}px`;
  suggestionBox.style.left = `${rect.left + window.scrollX}px`;
  suggestionBox.style.zIndex = '10000';
  
  document.body.appendChild(suggestionBox);
  
  // Store reference to the input element
  suggestionBox.inputElement = inputElement;
  
  // Add event listeners for buttons
  const replaceBtn = suggestionBox.querySelector('.georgian-replace-btn');
  const dismissBtn = suggestionBox.querySelector('.georgian-dismiss-btn');
  
  replaceBtn.addEventListener('click', () => {
    const originalText = replaceBtn.getAttribute('data-original');
    const suggestedText = replaceBtn.getAttribute('data-suggested');
    
    // Replace text in input
    const currentValue = inputElement.value;
    const newValue = currentValue.replace(originalText, suggestedText);
    inputElement.value = newValue;
    
    // Trigger input event to notify any listeners
    inputElement.dispatchEvent(new Event('input', { bubbles: true }));
    
    removeSuggestionBox();
  });
  
  dismissBtn.addEventListener('click', () => {
    removeSuggestionBox();
  });
  
  // Auto-dismiss after 10 seconds
  setTimeout(() => {
    removeSuggestionBox();
  }, 10000);
}

// Remove suggestion box
function removeSuggestionBox() {
  const existingBox = document.getElementById('georgian-suggestion-box');
  if (existingBox) {
    existingBox.remove();
  }
}

// Remove both lamp and suggestion box
function removeAllGeorgianElements() {
  removeLampIcon();
  removeSuggestionBox();
}

// Handle input events
function handleInput(event) {
  const inputElement = event.target;
  const text = inputElement.value;
  
  // Check if text contains Georgian characters
  if (text && containsGeorgian(text)) {
    const englishVersion = convertGeorgianToEnglish(text);
    
    // Only show lamp icon if the conversion results in different text
    // and if the English version seems like actual English words
    if (englishVersion !== text && isLikelyEnglish(englishVersion)) {
      createLampIcon(text, englishVersion, inputElement);
    }
  } else {
    // Remove all Georgian elements if no Georgian characters
    removeAllGeorgianElements();
  }
}

// Simple heuristic to check if converted text looks like English
function isLikelyEnglish(text) {
  // Check if it contains common English patterns
  const englishPatterns = /\b(the|and|or|but|in|on|at|to|for|of|with|by|from|up|about|into|through|during|before|after|above|below|between|among|under|over|within|without|against|across|beyond|beside|beneath|throughout|underneath|inside|outside|around|toward|towards|upon|onto|off|down|out|away|back|here|there|where|when|why|how|what|who|which|whose|this|that|these|those|some|any|all|both|each|every|other|another|such|same|different|new|old|first|last|next|previous|good|bad|big|small|long|short|high|low|right|wrong|true|false|yes|no|can|could|will|would|should|must|may|might|shall|do|does|did|have|has|had|is|am|are|was|were|be|been|being|get|got|give|gave|take|took|make|made|come|came|go|went|see|saw|know|knew|think|thought|say|said|tell|told|ask|asked|work|worked|play|played|run|ran|walk|walked|look|looked|feel|felt|seem|seemed|become|became|leave|left|find|found|keep|kept|let|put|set|help|helped|show|showed|try|tried|call|called|move|moved|live|lived|believe|believed|hold|held|bring|brought|happen|happened|write|wrote|provide|provided|sit|sat|stand|stood|lose|lost|pay|paid|meet|met|include|included|continue|continued|set|follow|followed|stop|stopped|create|created|speak|spoke|read|read|allow|allowed|add|added|spend|spent|grow|grew|open|opened|walk|walked|win|won|offer|offered|remember|remembered|love|loved|consider|considered|appear|appeared|buy|bought|wait|waited|serve|served|die|died|send|sent|expect|expected|build|built|stay|stayed|fall|fell|cut|cut|reach|reached|kill|killed|remain|remained|suggest|suggested|raise|raised|pass|passed|sell|sold|require|required|report|reported|decide|decided|pull|pulled)/i;
  
  // Clean text and check for patterns
  const cleanText = text.toLowerCase().replace(/[^\w\s]/g, ' ');
  return englishPatterns.test(cleanText) || cleanText.length > 3;
}

// Debounced input handler
const debouncedHandleInput = debounce(handleInput, 200);

// Initialize the extension
function init() {
  // Add event listeners to input fields
  document.addEventListener('input', (event) => {
    if (event.target.matches('input[type="text"], textarea, input[type="search"], input[type="email"], input[type="url"], [contenteditable="true"]')) {
      debouncedHandleInput(event);
    }
  });
  
  // Handle dynamically added elements
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const inputs = node.querySelectorAll('input[type="text"], textarea, input[type="search"], input[type="email"], input[type="url"], [contenteditable="true"]');
          inputs.forEach(() => {
            // Event delegation is already set up above, so no need to add individual listeners
          });
        }
      });
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Remove Georgian elements when clicking elsewhere
  document.addEventListener('click', (event) => {
    const suggestionBox = document.getElementById('georgian-suggestion-box');
    const lampIcon = document.getElementById('georgian-lamp-icon');
    
    if (suggestionBox && !suggestionBox.contains(event.target)) {
      removeSuggestionBox();
    }
    
    if (lampIcon && !lampIcon.contains(event.target) && event.target !== lampIcon) {
      removeLampIcon();
    }
  });
  
  // Remove Georgian elements when scrolling
  window.addEventListener('scroll', () => {
    removeAllGeorgianElements();
  });
  
  // Remove Georgian elements when window is resized
  window.addEventListener('resize', () => {
    removeAllGeorgianElements();
  });
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}