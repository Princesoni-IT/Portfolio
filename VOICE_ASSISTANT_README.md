# Custom Voice Assistant - Documentation

## Overview
यह एक custom voice assistant है जो Web Speech API का उपयोग करता है। यह **Jarvis-like male voice** के साथ काम करता है। जब user "Call Assistant" button पर click करता है, तो एक professional English welcome message play होता है और फिर एक toggle menu दिखाई देता है।

### Voice Features
- **Male Voice**: Deep, professional male voice (Jarvis-style)
- **Language**: English (en-IN)
- **Pitch**: 0.8 (Lower for deeper voice)
- **Rate**: 0.95 (Slightly faster for AI assistant feel)
- **Auto-selection**: Automatically selects best available male voice from browser

## Features

### 1. **Welcome Message**
- जब user button पर click करता है, AI assistant एक professional English welcome message बोलता है
- Message: "Good day! I am Prince's AI Assistant. Welcome to his portfolio. Please select an option from the menu to learn more."
- Voice: Deep male voice (Jarvis-style)

### 2. **Toggle Menu**
Welcome message के बाद, एक beautiful animated menu दिखाई देता है जिसमें 5 options हैं:
- **About Prince** - Prince के बारे में जानकारी
- **Services** - Prince की services
- **Projects** - Prince के projects
- **Contact** - Contact information
- **Certifications** - Prince की certifications

### 3. **Voice Responses**
जब user किसी option को select करता है:
- Selected option की information voice में play होती है
- Message complete होने के बाद menu फिर से दिखाई देता है
- User कितनी भी बार options select कर सकता है

### 4. **End Call**
- User कभी भी "End Call" button पर click करके assistant को बंद कर सकता है
- सभी audio और menu automatically बंद हो जाते हैं

## How It Works

### Button States
1. **Inactive State**: 
   - Icon: Phone icon (📞)
   - Text: "Call Assistant"
   - Color: Red gradient

2. **Active State**:
   - Icon: Phone slash icon (📵)
   - Text: "End Call"
   - Color: Darker red
   - Pulsing animation

### User Flow
```
User clicks button 
    ↓
Welcome message plays (Hindi)
    ↓
Toggle menu appears
    ↓
User selects an option
    ↓
Voice message plays
    ↓
Menu reappears
    ↓
User can select another option or end call
```

## Customization

### Changing Messages
Messages को customize करने के लिए `js/voice-assistant.js` file में `ASSISTANT_CONFIG` object को edit करें:

```javascript
const ASSISTANT_CONFIG = {
    welcomeMessage: "Your custom welcome message",
    options: [
        {
            id: 1,
            label: "Option Name",
            message: "Message to speak when selected"
        }
        // Add more options...
    ]
};
```

### Changing Voice Settings
Voice settings customize करने के लिए `speakText` function में parameters modify करें:

```javascript
utterance.lang = 'en-IN'; // English India (current)
utterance.pitch = 0.8;    // 0.8 = deeper voice, 1.0 = normal
utterance.rate = 0.95;    // 0.95 = slightly faster, 1.0 = normal

// For different accents:
// 'en-US' - American English
// 'en-GB' - British English
// 'en-AU' - Australian English
```

### Selecting Specific Voice
Code automatically selects best male voice, but you can customize the priority list:

```javascript
const preferredVoices = [
    'Google UK English Male',  // British accent
    'Microsoft David',         // Windows voice
    'Microsoft Mark',          // Windows voice
    'Google US English Male',  // American accent
    'Alex',                    // Mac voice
    'Daniel'                   // Mac voice
];
```

### Styling
Toggle menu की styling `css/vapi-call-button.css` में customize की जा सकती है:
- Colors
- Animations
- Sizes
- Positions

## Browser Compatibility
- ✅ Chrome/Edge (Best support)
- ✅ Firefox
- ✅ Safari
- ⚠️ Mobile browsers (Limited voice support)

## Technical Details

### Technologies Used
1. **Web Speech API** - Text-to-speech के लिए
2. **Vanilla JavaScript** - No external dependencies
3. **CSS3 Animations** - Smooth transitions और effects
4. **Font Awesome Icons** - Beautiful icons

### Files
- `js/voice-assistant.js` - Main JavaScript logic
- `css/vapi-call-button.css` - Styling और animations
- `index.html` - HTML structure

## Troubleshooting

### Checking Available Voices
Browser console (F12) में automatically available voices की list show hoti hai:
```
=== Available Voices ===
Total voices: 50

--- Male/Preferred Voices ---
12: Google UK English Male (en-GB)
25: Microsoft David Desktop (en-US)

--- All English Voices ---
...
```

Console में "Using voice: [Voice Name]" message se pata chalega ki kaunsa voice use ho raha hai.

### Voice not playing?
- Browser में audio permissions check करें
- Volume check करें
- Different browser try करें (Chrome recommended)
- Console check करें ki kaunsa voice select hua hai

### Menu not showing?
- Browser console में errors check करें
- JavaScript file properly load हो रही है verify करें

### Male voice not sounding deep enough?
- `utterance.pitch` को 0.7 या 0.6 तक कम करें (deeper voice)
- Different browser try करें - Chrome usually has better voices
- Console में check करें ki kaunsa voice select hua hai

## Future Enhancements
- ElevenLabs API integration for better voice quality
- More language options
- Voice recognition (user can speak)
- Chat history
- Customizable themes

## Support
Issues या questions के लिए contact करें:
- Email: princesoni.it@gmail.com
- Phone: +91 9343596430

---
**Created by Prince Soni**
**Last Updated: 2025**
