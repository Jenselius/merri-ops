// Static Language Loading System for Merri Strategy & Ops
// This version loads translations from JSON files for GitHub Pages compatibility

let translations = {};
let currentLanguage = 'en';

// Load language files statically
async function loadLanguageFiles() {
    try {
        // Load English translations
        const enResponse = await fetch('./lang/en.json');
        const enData = await enResponse.json();
        
        // Load German translations  
        const deResponse = await fetch('./lang/de.json');
        const deData = await deResponse.json();
        
        translations = {
            en: enData,
            de: deData
        };
        
        // Initialize the page with saved language preference
        const savedLanguage = localStorage.getItem('preferred-language') || 'en';
        setLanguage(savedLanguage);
        
    } catch (error) {
        console.error('Error loading language files:', error);
        // Fallback to English if loading fails
        setLanguage('en');
    }
}

// Set language and update all translatable elements
function setLanguage(lang) {
    if (!translations[lang]) {
        console.warn(`Language ${lang} not available, falling back to English`);
        lang = 'en';
    }
    
    currentLanguage = lang;
    localStorage.setItem('preferred-language', lang);
    
    // Update language buttons
    document.querySelectorAll('.language-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.trim().toLowerCase() === lang) {
            btn.classList.add('active');
        }
    });
    
    // Update all translatable elements
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
}

// Language switching functionality
function switchLanguage(lang) {
    setLanguage(lang);
}

// Email form functionality - OLD VERSION (keeping for backward compatibility)
function toggleEmailForm() {
    const form = document.getElementById('email-form');
    const button = document.querySelector('[onclick="toggleEmailForm()"]');
    
    if (form && form.style.display === 'none' || form.style.display === '') {
        form.style.display = 'block';
        const buttonText = currentLanguage === 'de' ? 'Formular schließen' : 'Close Form';
        button.textContent = buttonText;
    } else if (form) {
        form.style.display = 'none';
        const buttonText = currentLanguage === 'de' ? 'E-Mail hinterlegen' : 'Access Strategic Resources';
        button.textContent = buttonText;
    }
}

function submitEmailForm() {
    const email = document.getElementById('email-input').value;
    const messageDiv = document.getElementById('form-message');
    
    if (!email || !email.includes('@')) {
        const errorMsg = currentLanguage === 'de' ? 
            'Bitte geben Sie eine gültige E-Mail-Adresse ein.' : 
            'Please enter a valid email address.';
        messageDiv.textContent = errorMsg;
        messageDiv.className = 'mt-2 text-red-400 text-sm';
        return;
    }
    
    // Simulate form submission
    const successMsg = currentLanguage === 'de' ? 
        'Vielen Dank! Sie erhalten in Kürze Zugang zu den Ressourcen.' : 
        'Thank you! You will receive access to the resources shortly.';
    messageDiv.textContent = successMsg;
    messageDiv.className = 'mt-2 text-green-400 text-sm';
    
    // Hide form after success
    setTimeout(() => {
        document.getElementById('email-form').style.display = 'none';
        const button = document.querySelector('[onclick="toggleEmailForm()"]');
        const buttonText = currentLanguage === 'de' ? 'E-Mail hinterlegen' : 'Access Strategic Resources';
        button.textContent = buttonText;
    }, 2000);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load language files and initialize
    loadLanguageFiles();
    
    // Set up language button event listeners
    document.querySelectorAll('.language-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.textContent.trim().toLowerCase();
            switchLanguage(lang);
        });
    });
    
    // NEW: Email Form Handler for Resources Section - Shows Download Links
    const resourcesForm = document.getElementById('resourcesForm');
    const thankYouSection = document.getElementById('thankYouSection');
    
    if (resourcesForm && thankYouSection) {
        console.log('✅ Resources form found - adding event listener');
        
        resourcesForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent form submission
            
            console.log('📧 Resources form submitted');
            
            // Get the email input value
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            console.log('Email:', email);
            
            // Basic email validation
            if (email && email.includes('@')) {
                console.log('✅ Email valid - showing download links');
                
                // Hide the form
                resourcesForm.style.display = 'none';
                
                // Show the thank you section with download links
                thankYouSection.classList.remove('hidden');
                thankYouSection.style.display = 'block';
                
                // Optional: Log to console for tracking
                console.log('Email submitted:', email);
                
                // Scroll to the download links
                thankYouSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                console.log('❌ Invalid email');
                alert('Please enter a valid email address.');
            }
        });
    } else {
        console.log('ℹ️ Resources form not found on this page (normal for resource pages)');
    }
});

// Calendly integration - UPDATED URL
function openCalendly() {
    window.open('https://calendly.com/giulia-merri-ops/30min', '_blank');
}

// Make functions globally available
window.switchLanguage = switchLanguage;
window.toggleEmailForm = toggleEmailForm;
window.submitEmailForm = submitEmailForm;
window.openCalendly = openCalendly;
