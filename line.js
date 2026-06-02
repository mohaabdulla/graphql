
function createConstellationLines() {
    // Clear any existing lines first
    document.querySelectorAll('.constellation-line').forEach(line => line.remove());
    
    // Check window size - only draw lines for desktop view
    if (window.innerWidth <= 1200) {
        return; // Don't draw lines in mobile layout
    }
    
    const container = document.querySelector('.constellation-container');
    const centralNode = document.querySelector('.central-node');
    const nodes = document.querySelectorAll('.constellation-node:not(.central-node)');
    
    // Connect central node to all other nodes
    nodes.forEach(node => {
        drawLine(centralNode, node, container);
    });
    
    // Connect nodes in a circle (if there are enough nodes)
    if (nodes.length > 2) {
        for (let i = 0; i < nodes.length; i++) {
            const nextIndex = (i + 1) % nodes.length;
            drawLine(nodes[i], nodes[nextIndex], container);
        }
    }
}

function drawLine(fromNode, toNode, container) {
    // Skip if nodes are not visible or not in the DOM
    if (!fromNode || !toNode || !fromNode.offsetParent || !toNode.offsetParent) {
        return;
    }
    
    const line = document.createElement('div');
    line.className = 'constellation-line';
    container.appendChild(line);
    
    // Get positions relative to the container
    const containerRect = container.getBoundingClientRect();
    const fromRect = fromNode.getBoundingClientRect();
    const toRect = toNode.getBoundingClientRect();
    
    // Calculate the coordinates for each node's center
    const fromX = fromRect.left + fromRect.width/2 - containerRect.left;
    const fromY = fromRect.top + fromRect.height/2 - containerRect.top;
    const toX = toRect.left + toRect.width/2 - containerRect.left;
    const toY = toRect.top + toRect.height/2 - containerRect.top;
    
    // Calculate the distance and angle between nodes
    const dx = toX - fromX;
    const dy = toY - fromY;
    const distance = Math.sqrt(dx*dx + dy*dy);
    const angle = Math.atan2(dy, dx);
    
    // Position and rotate the line (add 3D depth)
    line.style.width = `${distance}px`;
    line.style.left = `${fromX}px`;
    line.style.top = `${fromY}px`;
    line.style.transform = `rotate(${angle}rad) translateZ(25px)`;
}

// Update constellation lines when window is resized
window.addEventListener('resize', () => {
    // Use debounce to avoid too many calculations during resize
    clearTimeout(window.resizeTimer);
    window.resizeTimer = setTimeout(() => {
        createConstellationLines();
    }, 250);
});

  function animateNodes() {
      const nodes = document.querySelectorAll('.constellation-node');
    
      nodes.forEach((node, index) => {
          // Set a unique depth and animation duration for each node
          const depth = 20 + Math.random() * 30; // Random depth between 20px and 50px
          node.style.setProperty('--depth', `${depth}px`);
          node.style.animation = `float ${3 + index * 0.5}s ease-in-out infinite alternate`;
      });
  }

  // Add these keyframes to your CSS
  document.head.insertAdjacentHTML('beforeend', `
      <style>
          @keyframes float {
              0% { transform: translateZ(var(--depth, 50px)) translateY(0px); }
              100% { transform: translateZ(var(--depth, 50px)) translateY(-15px); }
          }
        
          .central-node {
              animation: pulse 4s infinite alternate, float 5s ease-in-out infinite alternate !important;
          }
        
          @keyframes pulse {
              0% { box-shadow: 0 0 20px rgba(14, 239, 255, 0.3); }
              100% { box-shadow: 0 0 60px rgba(14, 239, 255, 0.8); }
          }
      </style>
  `);