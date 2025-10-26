// Custom Voice Assistant with Male Voice
// Configuration
const ASSISTANT_CONFIG = {
    welcomeMessage: "thank you for visiting Prince Soni’s portfolio. I am Jarvis — his personal AI assistant. My purpose is to guide you through his professional journey, skills, and achievements. Please choose an option below to continue.",
    options: [
        {
            id: 1,
            label: "About Prince",
            message: "Prince Soni is a Bachelor of Computer Applications student at Prestige Institute of Management and Research. He is passionate about Artificial Intelligence, Machine Learning, and Full Stack Development. Combining data-driven insights with innovative design, he creates solutions that are both intelligent and impactful."
        },
        {
            id: 2,
            label: "Services",
            message: "Prince provides a range of professional services including AI and Machine Learning Model Development, Data Analysis, Web and App Development, and IT Solutions. His work focuses on intelligent automation, clean user experience, and strong system security."
        },
        {
            id: 3,
            label: "Projects",
            message: "Prince has developed multiple innovative projects such as his AI-integrated Personal Portfolio Website, ALMANET — an Alumni Management System, a Sales Insights Dashboard for data-driven business strategy, and a Prestige Portal Automation Module. Each project showcases his passion for merging technology and intelligence."
        },
        {
            id: 4,
            label: "Certifications",
            message: "Prince is certified in Oracle Analytics Cloud, IBM SQL and Databases, Cisco Cybersecurity, Power BI, React JS, and Full Stack Development. He has also trained in Artificial Intelligence and Machine Learning to strengthen his ability to build smarter systems."
        },
        {
            id: 5,
            label: "Contact",
            message: "To connect with Prince, you can email him at princesoni.it@gmail.com or call +91 9343596430. He is based in Gwalior, India, and open to collaboration, internships, or full-time opportunities in AI-driven software development."
        }
    ]
};


// State Management
let isAssistantActive = false;
let isPlaying = false;
let ringAudio = null;
let isRinging = false;
let isProcessing = false; // Prevent multiple clicks

// Initialize Voice Assistant
function initVoiceAssistant() {
    const button = document.getElementById('vapi-call-button');
    const icon = document.getElementById('vapi-call-icon');
    const text = document.getElementById('vapi-call-text');
    
    if (button) {
        button.addEventListener('click', toggleAssistant);
    }
}

// Toggle Assistant
function toggleAssistant() {
    // Prevent multiple clicks while processing
    if (isProcessing) {
        console.log('⚠️ Already processing, please wait...');
        return;
    }
    
    if (isAssistantActive) {
        closeAssistant();
    } else {
        openAssistant();
    }
}

// Open Assistant
function openAssistant() {
    // Set processing flag
    isProcessing = true;
    
    // Update button state to ringing
    const button = document.getElementById('vapi-call-button');
    const icon = document.getElementById('vapi-call-icon');
    const text = document.getElementById('vapi-call-text');
    
    button.classList.add('ringing');
    text.textContent = 'Calling...';
    
    // Play ring tone
    playRingTone(() => {
        // After ring, activate assistant
        isAssistantActive = true;
        isProcessing = false; // Clear processing flag
        
        button.classList.remove('ringing');
        button.classList.add('active');
        icon.classList.remove('fa-phone');
        icon.classList.add('fa-phone-slash');
        text.textContent = 'End Call';
        
        // Play welcome message
        playWelcomeMessage();
    });
}

// Close Assistant
function closeAssistant() {
    isAssistantActive = false;
    isProcessing = false; // Clear processing flag
    isRinging = false; // Stop any ringing
    
    // Stop any speech
    window.speechSynthesis.cancel();
    
    // Update button state
    const button = document.getElementById('vapi-call-button');
    const icon = document.getElementById('vapi-call-icon');
    const text = document.getElementById('vapi-call-text');
    
    button.classList.remove('active', 'ringing');
    icon.classList.remove('fa-phone-slash');
    icon.classList.add('fa-phone');
    text.textContent = 'Call Assistant';
    
    // Remove toggle menu
    const toggleMenu = document.getElementById('voice-toggle-menu');
    if (toggleMenu) {
        toggleMenu.remove();
    }
}

// Play Ring Tone (Realistic Phone Ring)
function playRingTone(callback) {
    // Stop any previous ring
    if (isRinging) {
        console.log('⚠️ Stopping previous ring...');
        isRinging = false;
    }
    
    isRinging = true;
    console.log('📞 Ring tone playing...');
    
    // Create Audio Context for ring tone
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const duration = 3; // 3 seconds ring
    const ringCount = 3; // 3 rings total = ~9 seconds
    let currentRing = 0;
    
    function playOneRing() {
        if (currentRing >= ringCount || !isRinging) {
            isRinging = false;
            console.log('✅ Ring tone finished');
            if (callback) callback();
            return;
        }
        
        currentRing++;
        
        // Create oscillator for ring sound
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Ring frequency (typical phone ring)
        oscillator.frequency.value = 440; // A4 note
        oscillator.type = 'sine';
        
        // Ring pattern: beep-beep with fade
        const now = audioContext.currentTime;
        
        // First beep
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.3, now + 0.05);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.4);
        
        // Second beep
        gainNode.gain.setValueAtTime(0, now + 0.5);
        gainNode.gain.linearRampToValueAtTime(0.3, now + 0.55);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.9);
        
        oscillator.start(now);
        oscillator.stop(now + 1);
        
        // Wait 2 seconds between rings
        setTimeout(() => playOneRing(), 2000);
    }
    
    playOneRing();
}

// Play Welcome Message
function playWelcomeMessage() {
    // Use Web Speech API for welcome message
    speakText(ASSISTANT_CONFIG.welcomeMessage, () => {
        // Show toggle menu after welcome message
        showToggleMenu();
    });
}

// Speak Text using Web Speech API
function speakText(text, callback) {
    // Stop any current speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 0.8;
    utterance.volume = 1;
    
    // Get available voices and select best male voice
    const voices = window.speechSynthesis.getVoices();
    
    // Priority order for male voices
    const preferredVoices = [
        'Google UK English Male',
        'Microsoft David',
        'Microsoft Mark',
        'Google US English Male',
        'Alex',
        'Daniel',
        'Male'
    ];
    
    // Try to find preferred male voice
    let selectedVoice = null;
    for (let preferred of preferredVoices) {
        selectedVoice = voices.find(voice => voice.name.includes(preferred));
        if (selectedVoice) break;
    }
    
    // Fallback to any male voice
    if (!selectedVoice) {
        selectedVoice = voices.find(voice => 
            voice.name.toLowerCase().includes('male')
        );
    }
    
    // Final fallback to first English voice
    if (!selectedVoice) {
        selectedVoice = voices.find(voice => voice.lang.includes('en'));
    }
    
    if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log('Using voice:', selectedVoice.name);
    }
    
    utterance.onend = () => {
        if (isAssistantActive && callback) {
            callback();
        }
    };
    
    utterance.onerror = (error) => {
        console.error('Speech synthesis error:', error);
        if (isAssistantActive && callback) {
            callback();
        }
    };
    
    window.speechSynthesis.speak(utterance);
}

// Show Toggle Menu
function showToggleMenu() {
    // Only show menu if assistant is still active
    if (!isAssistantActive) {
        return;
    }
    
    // Remove existing menu if any
    const existingMenu = document.getElementById('voice-toggle-menu');
    if (existingMenu) {
        existingMenu.remove();
    }
    
    // Create toggle menu
    const menu = document.createElement('div');
    menu.id = 'voice-toggle-menu';
    menu.className = 'voice-toggle-menu';
    
    // Create menu header
    const header = document.createElement('div');
    header.className = 'toggle-menu-header';
    header.innerHTML = `
        <h3>Choose an Option</h3>
        <button class="close-menu-btn" onclick="closeToggleMenu()">
            <i class="fas fa-times"></i>
        </button>
    `;
    menu.appendChild(header);
    
    // Create menu options
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'toggle-menu-options';
    
    ASSISTANT_CONFIG.options.forEach((option, index) => {
        const optionBtn = document.createElement('button');
        optionBtn.className = 'toggle-option-btn';
        optionBtn.innerHTML = `
            <i class="fas fa-${getIconForOption(index)}"></i>
            <span>${option.label}</span>
        `;
        optionBtn.onclick = () => selectOption(option);
        optionsContainer.appendChild(optionBtn);
    });
    
    menu.appendChild(optionsContainer);
    
    // Add to body
    document.body.appendChild(menu);
    
    // Animate in
    setTimeout(() => {
        menu.classList.add('show');
    }, 10);
}

// Get Icon for Option
function getIconForOption(index) {
    const icons = ['user', 'briefcase', 'code', 'envelope', 'certificate'];
    return icons[index] || 'info-circle';
}

// Close Toggle Menu
function closeToggleMenu() {
    const menu = document.getElementById('voice-toggle-menu');
    if (menu) {
        menu.classList.remove('show');
        setTimeout(() => {
            menu.remove();
        }, 300);
    }
}

// Select Option
function selectOption(option) {
    // Close menu
    closeToggleMenu();
    
    // Play option message
    speakText(option.message, () => {
        // Show menu again after message
        setTimeout(() => {
            if (isAssistantActive) {
                showToggleMenu();
            }
        }, 500);
    });
}

// Log Voice Assistant status on load
console.log('🎙️ Voice Assistant initialized with Browser Voice');
console.log('✅ FREE unlimited voice - No API needed');

// Initialize on page load
document.addEventListener('DOMContentLoaded', initVoiceAssistant);

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    window.speechSynthesis.cancel();
});

// Make functions globally available
window.toggleAssistant = toggleAssistant;
window.closeToggleMenu = closeToggleMenu;
