// Get error details from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code') || '404';
const message = urlParams.get('message') || 'Page Not Found';

// Update the error display
document.getElementById('error-code').textContent = code;
document.getElementById('error-message').textContent = message;

// Create orbiting stars to match login page
const orbitingStarsContainer = document.getElementById('orbiting-stars');

// Create orbiting stars
for (let i = 0; i < 100; i++) {
    const star = document.createElement('div');
    star.className = 'orbiting-star';
    
    // Random radius for orbit
    const orbitRadius = 150 + Math.random() * 300;
    star.style.setProperty('--orbit-radius', `${orbitRadius}px`);
    
    // Random orbit duration
    const orbitDuration = 15 + Math.random() * 30;
    star.style.setProperty('--orbit-duration', `${orbitDuration}s`);
    
    // Random opacity based on distance
    const opacity = Math.max(0.1, 1 - (orbitRadius - 150) / 300);
    star.style.setProperty('--star-opacity', opacity);
    
    // Random size for stars
    const size = 2 + Math.random() * 3;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    
    // Random color variation
    const hue = Math.random() > 0.7 ? 180 : 240; // Mostly blue, some cyan
    const lightness = 70 + Math.random() * 30;
    star.style.backgroundColor = `hsl(${hue}, 100%, ${lightness}%)`;
    
    // Random animation delay
    star.style.animationDelay = `${Math.random() * -30}s`;
    
    orbitingStarsContainer.appendChild(star);
}

// Create cursor star effect
document.addEventListener('mousemove', function(e) {
    // Create a star at cursor position
    if (Math.random() > 0.8) { // Only create stars occasionally
        const star = document.createElement
        star.className = 'cursor-star';
        star.style.left = `${e.pageX}px`;
        star.style.top = `${e.pageY}px`;
        
        // Random size
        const size = Math.random() * 3 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        // Random start opacity
        star.style.opacity = Math.random() * 0.5 + 0.5;
        
        document.body.appendChild(star);
        
        // Remove the star after animation completes
        setTimeout(() => {
            if (star && star.parentNode) {
                star.parentNode.removeChild(star);
            }
        }, 1000);
    }
});

// Create floating debris effect
function createSpaceDebris() {
    const debris = document.createElement('div');
    debris.className = 'cursor-star';
    debris.style.position = 'absolute';
    debris.style.left = Math.random() * 100 + 'vw';
    debris.style.top = Math.random() * 100 + 'vh';
    debris.style.width = Math.random() * 4 + 1 + 'px';
    debris.style.height = debris.style.width;
    debris.style.opacity = Math.random() * 0.7 + 0.3;
    debris.style.background = Math.random() > 0.8 ? '#0ef' : 'white';
    debris.style.boxShadow = Math.random() > 0.8 ? '0 0 5px #0ef' : 'none';
    
    // Set animation
    const duration = 15 + Math.random() * 20;
    debris.style.animation = `float ${duration}s linear infinite`;
    
    document.body.appendChild(debris);
    
    // Remove after animation is done
    setTimeout(() => {
        if (debris && debris.parentNode) {
            debris.parentNode.removeChild(debris);
            createSpaceDebris();
        }
    }, duration * 1000);
}

// Create multiple space debris
for (let i = 0; i < 20; i++) {
    setTimeout(() => {
        createSpaceDebris();
    }, i * 300);
}

// Add keyframe for floating animation if it doesn't exist
if (!document.querySelector('style#error-animations')) {
    const style = document.createElement('style');
    style.id = 'error-animations';
    style.textContent = `
        @keyframes float {
            0% { transform: translate(0, 0) rotate(0deg); }
            25% { transform: translate(-20px, 20px) rotate(90deg); }
            50% { transform: translate(-40px, 0) rotate(180deg); }
            75% { transform: translate(-20px, -20px) rotate(270deg); }
            100% { transform: translate(0, -40px) rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}
