// Custom Voice Assistant with Jarvis-like Male Voice
// Configuration
const ASSISTANT_CONFIG = {
    welcomeMessage: "Good day! I am Prince AI Assistant. Welcome to his portfolio. Please select an option from the menu to learn more.",
    options: [
        {
            id: 1,
            label: "About Prince",
            message: "Prince Soni is a Bachelor of Computer Applications student at Prestige Institute of Management and Research. He specializes in Data Analytics, Full Stack Development, and Cybersecurity. He has earned multiple certifications in Python, C, and SQL programming."
        },
        {
            id: 2,
            label: "Services",
            message: "Prince offers the following services: Data Analysis, Web Development, Mobile App Development, UI and UX Design, Security Analysis, and IT Solutions and Training. He creates modern, responsive, and secure web applications."
        },
        {
            id: 3,
            label: "Projects",
            message: "Prince has developed several notable projects including a Portfolio Website, ALMANET Alumni Database Management System, Sales Insights Dashboard, and Prestige Portal Module Development. All projects are available on GitHub for review."
        },
        {
            id: 4,
            label: "Contact",
            message: "You can reach Prince at the following: Email: princesoni dot it at gmail dot com. Phone: plus 91 9343596430. Location: Gwalior, India. He is always open to new opportunities and collaborations."
        },
        {
            id: 5,
            label: "Certifications",
            message: "Prince holds multiple professional certifications including Oracle Analytics Cloud Professional, IBM SQL and Relational Databases, C Programming from SWAYAM, Cisco Introduction to Cybersecurity, Power BI Workshop, React JS, and Full Stack Development. He believes in continuous learning and skill enhancement."
        }
    ]
};

// State Management
let isAssistantActive = false;
let isPlaying = false;
let currentAudio = null;

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
    if (isAssistantActive) {
        closeAssistant();
    } else {
        openAssistant();
    }
}

// Open Assistant
function openAssistant() {
    isAssistantActive = true;
    
    // Update button state
    const button = document.getElementById('vapi-call-button');
    const icon = document.getElementById('vapi-call-icon');
    const text = document.getElementById('vapi-call-text');
    
    button.classList.add('active');
    icon.classList.remove('fa-phone');
    icon.classList.add('fa-phone-slash');
    text.textContent = 'End Call';
    
    // Play welcome message
    playWelcomeMessage();
}

// Close Assistant
function closeAssistant() {
    isAssistantActive = false;
    
    // IMMEDIATELY stop speech synthesis
    window.speechSynthesis.cancel();
    
    // Stop any playing audio
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }
    
    // Update button state
    const button = document.getElementById('vapi-call-button');
    const icon = document.getElementById('vapi-call-icon');
    const text = document.getElementById('vapi-call-text');
    
    button.classList.remove('active');
    icon.classList.remove('fa-phone-slash');
    icon.classList.add('fa-phone');
    text.textContent = 'Call Assistant';
    
    // Remove toggle menu
    const toggleMenu = document.getElementById('voice-toggle-menu');
    if (toggleMenu) {
        toggleMenu.remove();
    }
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
    utterance.lang = 'en-US'; // English US - better male voice availability
    utterance.rate = 0.9; // Slightly slower for deeper effect
    utterance.pitch = 0.5; // VERY low pitch for male voice (0.5 = deepest)
    utterance.volume = 1;
    
    // Get available voices and select best male voice
    const voices = window.speechSynthesis.getVoices();
    
    // Priority order for Jarvis-like male voices (Desktop + Mobile)
    const preferredVoices = [
        'Google UK English Male',
        'Microsoft David',
        'Microsoft Mark',
        'Google US English Male',
        'Alex',
        'Daniel',
        'Male',
        'en-us-x-sfg#male',  // Google mobile voice
        'en-gb-x-gba#male',  // Google mobile voice
        'en-in-x-end#male'   // Google mobile voice India
    ];
    
    // Try to find preferred male voice
    let selectedVoice = null;
    for (let preferred of preferredVoices) {
        selectedVoice = voices.find(voice => 
            voice.name.includes(preferred) || 
            voice.voiceURI.includes(preferred)
        );
        if (selectedVoice) break;
    }
    
    // If no preferred voice found, find any male voice (check name and URI)
    if (!selectedVoice) {
        selectedVoice = voices.find(voice => 
            (voice.name.toLowerCase().includes('male') ||
            voice.voiceURI.toLowerCase().includes('male')) &&
            !voice.name.toLowerCase().includes('female') &&
            !voice.voiceURI.toLowerCase().includes('female')
        );
    }
    
    // Try to find English voice that's NOT female (strict filtering)
    if (!selectedVoice) {
        const femaleKeywords = ['female', 'woman', 'girl', 'samantha', 'victoria', 'karen', 'moira', 'tessa', 'fiona'];
        selectedVoice = voices.find(voice => {
            const name = voice.name.toLowerCase();
            const uri = voice.voiceURI.toLowerCase();
            const isFemale = femaleKeywords.some(keyword => name.includes(keyword) || uri.includes(keyword));
            return voice.lang.includes('en') && !isFemale;
        });
    }
    
    // Fallback to first English voice (even if female, pitch will make it deeper)
    if (!selectedVoice) {
        selectedVoice = voices.find(voice => voice.lang.includes('en'));
    }
    
    // Final fallback to first available voice
    if (!selectedVoice && voices.length > 0) {
        selectedVoice = voices[0];
    }
    
    if (selectedVoice) {
        utterance.voice = selectedVoice;
        const isFemale = selectedVoice.name.toLowerCase().includes('female') || 
                        selectedVoice.voiceURI.toLowerCase().includes('female');
        
        console.log('🎙️ Using voice:', selectedVoice.name);
        console.log('   Voice URI:', selectedVoice.voiceURI);
        console.log('   Language:', selectedVoice.lang);
        console.log('   Local:', selectedVoice.localService);
        console.log('   Pitch:', utterance.pitch, '(0.5 = deepest male voice)');
        
        if (isFemale) {
            console.warn('⚠️ Female voice detected! Using very low pitch (0.5) to make it sound deeper.');
        } else {
            console.log('✅ Male or neutral voice selected!');
        }
    }
    
    utterance.onend = () => {
        // Only execute callback if assistant is still active
        if (isAssistantActive && callback) {
            callback();
        }
    };
    
    utterance.onerror = (error) => {
        console.error('Speech synthesis error:', error);
        // Only execute callback if assistant is still active
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

// Load voices when available
if (typeof speechSynthesis !== 'undefined') {
    speechSynthesis.onvoiceschanged = () => {
        const voices = speechSynthesis.getVoices();
        console.log('=== Available Voices ===');
        console.log('Total voices:', voices.length);
        
        // Log male voices
        console.log('\n--- Male/Preferred Voices ---');
        voices.forEach((voice, index) => {
            if (voice.name.toLowerCase().includes('male') || 
                voice.voiceURI.toLowerCase().includes('male') ||
                voice.name.includes('David') || 
                voice.name.includes('Mark') ||
                voice.name.includes('Daniel') ||
                voice.name.includes('Alex')) {
                console.log(`${index}: ${voice.name} | URI: ${voice.voiceURI} (${voice.lang})`);
            }
        });
        
        // Log all English voices
        console.log('\n--- All English Voices ---');
        voices.forEach((voice, index) => {
            if (voice.lang.includes('en')) {
                console.log(`${index}: ${voice.name} | URI: ${voice.voiceURI} (${voice.lang})`);
            }
        });
    };
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initVoiceAssistant);

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (currentAudio) {
        currentAudio.pause();
    }
    window.speechSynthesis.cancel();
});

// Make functions globally available
window.toggleAssistant = toggleAssistant;
window.closeToggleMenu = closeToggleMenu;
