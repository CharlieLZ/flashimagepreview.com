// Flash Image Preview - Main JavaScript

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeImagePreview();
    initializeGameIframe();
    initializeAnimations();
    initializeFormHandlers();
});

// Image Preview Functionality
function initializeImagePreview() {
    const imageInputs = document.querySelectorAll('input[type="file"][accept*="image"]');
    
    imageInputs.forEach(input => {
        input.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                previewImage(file, this);
            }
        });
    });
}

function previewImage(file, inputElement) {
    const reader = new FileReader();
    reader.onload = function(e) {
        // Create preview container if it doesn't exist
        let previewContainer = inputElement.nextElementSibling;
        if (!previewContainer || !previewContainer.classList.contains('image-preview')) {
            previewContainer = document.createElement('div');
            previewContainer.className = 'image-preview';
            inputElement.parentNode.insertBefore(previewContainer, inputElement.nextSibling);
        }
        
        // Create image element
        const img = document.createElement('img');
        img.src = e.target.result;
        img.style.cssText = `
            max-width: 100%;
            max-height: 300px;
            border-radius: 10px;
            margin-top: 1rem;
            box-shadow: 0 5px 15px rgba(139, 92, 246, 0.2);
        `;
        
        previewContainer.innerHTML = '';
        previewContainer.appendChild(img);
        
        // Add image info
        const info = document.createElement('div');
        info.className = 'image-info';
        info.innerHTML = `
            <p><strong>File:</strong> ${file.name}</p>
            <p><strong>Size:</strong> ${(file.size / 1024).toFixed(2)} KB</p>
            <p><strong>Type:</strong> ${file.type}</p>
        `;
        info.style.cssText = `
            margin-top: 0.5rem;
            font-size: 0.9rem;
            color: var(--text-secondary);
        `;
        previewContainer.appendChild(info);
    };
    reader.readAsDataURL(file);
}

// Game Iframe Initialization
function initializeGameIframe() {
    const gameContainer = document.getElementById('game-container');
    if (!gameContainer) return;

    // Create game iframe with flash image preview game
    const iframe = document.createElement('iframe');
    iframe.className = 'game-iframe';
    iframe.src = 'data:text/html,<!DOCTYPE html><html><head><title>Flash Image Preview Game</title><style>body{margin:0;padding:20px;font-family:Arial,sans-serif;background:linear-gradient(135deg,#8b5cf6,#a855f7);color:white;text-align:center;}canvas{border:3px solid white;border-radius:10px;background:white;}</style></head><body><h2>🎮 Interactive Image Memory Game</h2><canvas id="gameCanvas" width="600" height="400"></canvas><div style="margin-top:20px;"><button onclick="startGame()" style="padding:10px 20px;font-size:16px;background:white;color:#8b5cf6;border:none;border-radius:5px;cursor:pointer;">Start New Game</button> <button onclick="uploadImage()" style="padding:10px 20px;font-size:16px;background:rgba(255,255,255,0.2);color:white;border:2px solid white;border-radius:5px;cursor:pointer;">Upload Image</button></div><input type="file" id="imageUpload" accept="image/*" style="display:none;"><script>const canvas=document.getElementById("gameCanvas");const ctx=canvas.getContext("2d");let gameImages=[];let currentLevel=1;let score=0;let gameRunning=false;function startGame(){gameRunning=true;score=0;currentLevel=1;generateRandomImages();drawGame();}function generateRandomImages(){gameImages=[];const colors=["#ff6b6b","#4ecdc4","#45b7d1","#96ceb4","#feca57","#ff9ff3","#54a0ff"];for(let i=0;i<6;i++){gameImages.push({x:Math.random()*500+50,y:Math.random()*300+50,color:colors[Math.floor(Math.random()*colors.length)],size:30+Math.random()*20,visible:true});}}function drawGame(){ctx.clearRect(0,0,canvas.width,canvas.height);ctx.fillStyle="#f8f9fa";ctx.fillRect(0,0,canvas.width,canvas.height);if(!gameRunning){ctx.fillStyle="#8b5cf6";ctx.font="24px Arial";ctx.textAlign="center";ctx.fillText("🖼️ Flash Image Preview Game",300,200);ctx.font="16px Arial";ctx.fillText("Click Start New Game to begin!",300,240);return;}gameImages.forEach(img=>{if(img.visible){ctx.fillStyle=img.color;ctx.beginPath();ctx.arc(img.x,img.y,img.size,0,2*Math.PI);ctx.fill();ctx.fillStyle="white";ctx.font="12px Arial";ctx.textAlign="center";ctx.fillText("🖼️",img.x,img.y+4);}});ctx.fillStyle="#333";ctx.font="18px Arial";ctx.textAlign="left";ctx.fillText("Score: "+score,10,30);ctx.fillText("Level: "+currentLevel,10,55);}function uploadImage(){document.getElementById("imageUpload").click();}document.getElementById("imageUpload").addEventListener("change",function(e){const file=e.target.files[0];if(file){const reader=new FileReader();reader.onload=function(event){const img=new Image();img.onload=function(){ctx.drawImage(img,canvas.width-150,10,140,100);};img.src=event.target.result;};reader.readAsDataURL(file);}});canvas.addEventListener("click",function(e){if(!gameRunning)return;const rect=canvas.getBoundingClientRect();const x=e.clientX-rect.left;const y=e.clientY-rect.top;gameImages.forEach(img=>{if(img.visible&&Math.sqrt((x-img.x)**2+(y-img.y)**2)<img.size){img.visible=false;score+=10;if(gameImages.every(img=>!img.visible)){currentLevel++;generateRandomImages();}}});drawGame();});drawGame();</script></body></html>';
    iframe.allowFullscreen = true;
    iframe.style.width = '100%';
    iframe.style.height = '600px';
    iframe.style.border = '3px solid var(--primary)';
    iframe.style.borderRadius = '15px';
    
    gameContainer.appendChild(iframe);
}

// Animations
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all feature cards and tool cards
    document.querySelectorAll('.feature-card, .tool-card, .section').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Form Handlers
function initializeFormHandlers() {
    // Contact form handler
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showMessage('Thank you for your message! We\'ll get back to you soon.', 'success');
            contactForm.reset();
        });
    }

    // Newsletter signup handler
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showMessage('Successfully subscribed to our newsletter!', 'success');
            newsletterForm.reset();
        });
    }
}

// Utility Functions
function showMessage(message, type = 'info') {
    const messageContainer = document.createElement('div');
    messageContainer.className = `message message-${type}`;
    messageContainer.textContent = message;
    messageContainer.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        z-index: 1000;
        opacity: 0;
        transform: translateX(100px);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(messageContainer);
    
    // Animate in
    requestAnimationFrame(() => {
        messageContainer.style.opacity = '1';
        messageContainer.style.transform = 'translateX(0)';
    });
    
    // Remove after 5 seconds
    setTimeout(() => {
        messageContainer.style.opacity = '0';
        messageContainer.style.transform = 'translateX(100px)';
        setTimeout(() => {
            document.body.removeChild(messageContainer);
        }, 300);
    }, 5000);
}

// Image Processing Functions
function processImage(file, options = {}) {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = function() {
            // Set canvas dimensions
            canvas.width = options.width || img.width;
            canvas.height = options.height || img.height;
            
            // Draw and process image
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            // Apply filters if specified
            if (options.brightness) {
                ctx.filter = `brightness(${options.brightness}%)`;
            }
            if (options.contrast) {
                ctx.filter += ` contrast(${options.contrast}%)`;
            }
            
            // Convert to blob
            canvas.toBlob(resolve, options.format || 'image/png', options.quality || 0.9);
        };
        
        img.onerror = reject;
        
        const reader = new FileReader();
        reader.onload = e => img.src = e.target.result;
        reader.readAsDataURL(file);
    });
}

// Export functions for global access
window.FlashImagePreview = {
    processImage,
    showMessage,
    previewImage
};