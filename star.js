
const starsContainer = document.querySelector('.stars');
for (let i = 0; i < 200; i++) {
  const star = document.createElement('div');
  const randomX = Math.random() * 2 - 1;
  const randomY = Math.random() * 2 - 1;
  star.style.top = `${Math.random() * 100}%`;
  star.style.left = `${Math.random() * 100}%`;
  star.style.setProperty('--x', randomX.toFixed(2));
  star.style.setProperty('--y', randomY.toFixed(2));
  star.style.animationDuration = `${Math.random() * 5 + 3}s`;
  starsContainer.appendChild(star);
}


const orbitStars = document.querySelector('.orbit-stars');
for (let i = 0; i < 40; i++) {
  const orbitStar = document.createElement('div');
  orbitStars.appendChild(orbitStar);
}


function showLogin() {
  document.querySelector('.welcome-container').style.display = 'none';
  document.querySelector('.login').style.display = 'block';
}

// Add this to the bottom of star.js to create cursor star trails
document.addEventListener('mousemove', function(e) {
  // Create a star at cursor position
  if (Math.random() > 0.8) { // Only create stars occasionally
    const star = document.createElement('div');
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

// Add this to star.js
function enhanceStarsForLogin() {
    // Create a concentrated circle of stars behind the login form
    const loginForm = document.querySelector('.form-sign-in');
    if (!loginForm) return;
    
    const loginStarsContainer = document.createElement('div');
    loginStarsContainer.className = 'login-stars-focus';
    document.body.appendChild(loginStarsContainer);
    
    // Style for the concentrated stars
    const style = document.createElement('style');
    style.textContent = `
        .login-stars-focus {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        }
        
        .login-stars-focus div {
            position: absolute;
            background-color: #0ef;
            border-radius: 50%;
            filter: blur(1px);
            animation: pulse-star 3s infinite alternate;
        }
        
        @keyframes pulse-star {
            0%, 100% { opacity: var(--base-opacity, 0.7); }
            50% { opacity: var(--pulse-opacity, 0.3); }
        }
    `;
    document.head.appendChild(style);
    
    // Create pulsing stars focused around the center
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        
        // Calculate distance from center (more stars in the middle)
        const distance = Math.random() * 0.7 + 0.1; // 0.1 to 0.8
        const angle = Math.random() * Math.PI * 2;
        
        // Center coordinates with slight offset
        const centerX = 0.5 + (Math.random() * 0.1 - 0.05);
        const centerY = 0.5 + (Math.random() * 0.1 - 0.05);
        
        // Position based on polar coordinates from center
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        
        // Size and opacity based on distance from center
        const size = (1 - distance)
    };
  }

  // Create the black hole effect for the login page
function createBlackHoleEffect() {

  
  // Create black hole container
  const blackHoleContainer = document.createElement('div');
  blackHoleContainer.className = 'black-hole-container';
  document.body.appendChild(blackHoleContainer);
  
  // Create event horizon glow
  const eventHorizon = document.createElement('div');
  eventHorizon.className = 'event-horizon';
  blackHoleContainer.appendChild(eventHorizon);
  
  // Create accretion disk
  const accretionDisk = document.createElement('div');
  accretionDisk.className = 'accretion-disk';
  blackHoleContainer.appendChild(accretionDisk);
  
  // Create the black hole
  const blackHole = document.createElement('div');
  blackHole.className = 'black-hole';
  blackHoleContainer.appendChild(blackHole);
  
  // Create container for orbiting stars
  const orbitingStarsContainer = document.createElement('div');
  orbitingStarsContainer.className = 'orbiting-stars';
  blackHoleContainer.appendChild(orbitingStarsContainer);
  
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
  
  // Add swirling effect to background stars
  const existingStars = document.querySelectorAll('.stars div');
  existingStars.forEach(star => {
    // Adjust existing stars to create a galactic swirl effect
    const distanceFromCenter = {
      x: Math.abs(parseInt(star.style.left) - 50) / 100,
      y: Math.abs(parseInt(star.style.top) - 50) / 100
    };
    
    const distance = Math.sqrt(distanceFromCenter.x * distanceFromCenter.x + distanceFromCenter.y * distanceFromCenter.y);
    
    // Add swirl animation based on distance from center
    if (distance < 0.5) {
      star.style.animation = `twinkle 5s infinite, orbit ${20 + distance * 40}s linear infinite`;
    }
  });
}

// Initialize black hole effect when page loads
window.addEventListener('load', function() {
  createBlackHoleEffect();
});
