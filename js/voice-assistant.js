// Custom Voice Assistant with Jarvis-like Male Voice
// Configuration
const ASSISTANT_CONFIG = {
    // Set to true to use ElevenLabs API (requires API key)
    // Set to false to use browser's Web Speech API
    useElevenLabs: true,
    elevenLabsApiKey: 'sk_e6f2d89f20df6b88ab0dfc6d1c16d19e0bdb38ec8f681f5d', // Get free key from elevenlabs.io
    elevenLabsVoiceId: 'IRHApOXLvnW57QJPQH2P', // Adam - Deep male voice  ookcfIYgQDpBT5ueX6gr    IRHApOXLvnW57QJPQH2P
    
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

// Speak Text using ElevenLabs API ONLY
async function speakText(text, callback) {
    // Stop any current audio
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }
    
    try {
        await speakWithElevenLabs(text, callback);
    } catch (error) {
        console.error('❌ ElevenLabs API error:', error);
        // Execute callback even on error
        if (isAssistantActive && callback) {
            callback();
        }
    }
}

// Speak with ElevenLabs API (Premium Male Voice)
async function speakWithElevenLabs(text, callback) {
    console.log('🎙️ Using ElevenLabs API for premium male voice...');
    
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${ASSISTANT_CONFIG.elevenLabsVoiceId}`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'audio/mpeg',
                'Content-Type': 'application/json',
                'xi-api-key': ASSISTANT_CONFIG.elevenLabsApiKey
            },
            body: JSON.stringify({
                text: text,
                model_id: 'eleven_monolingual_v1',
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75,
                    style: 0.0,
                    use_speaker_boost: true
                }
            })
        });
        
        if (!response.ok) {
            throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`);
        }
        
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        
        currentAudio = new Audio(audioUrl);
        
        currentAudio.onplay = () => {
            console.log('✅ ElevenLabs voice playing...');
        };
        
        currentAudio.onended = () => {
            console.log('✅ ElevenLabs voice finished.');
            URL.revokeObjectURL(audioUrl);
            currentAudio = null;
            // Only execute callback if assistant is still active
            if (isAssistantActive && callback) {
                callback();
            }
        };
        
        currentAudio.onerror = (error) => {
            console.error('❌ Audio playback error:', error);
            URL.revokeObjectURL(audioUrl);
            currentAudio = null;
            // Only execute callback if assistant is still active
            if (isAssistantActive && callback) {
                callback();
            }
        };
        
        await currentAudio.play();
        
    } catch (error) {
        console.error('❌ ElevenLabs API error:', error);
        throw error; // Re-throw to trigger fallback
    }
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

// Log ElevenLabs status on load
console.log('🎙️ Voice Assistant initialized with ElevenLabs API');
console.log('Voice ID:', ASSISTANT_CONFIG.elevenLabsVoiceId);
console.log('API Key:', ASSISTANT_CONFIG.elevenLabsApiKey ? '✅ Configured' : '❌ Missing');

// Initialize on page load
document.addEventListener('DOMContentLoaded', initVoiceAssistant);

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (currentAudio) {
        currentAudio.pause();
    }
});

// Make functions globally available
window.toggleAssistant = toggleAssistant;
window.closeToggleMenu = closeToggleMenu;
