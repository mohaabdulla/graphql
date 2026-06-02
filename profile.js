function logout() {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('userData');
    window.location.href = 'index.html';
}
 
   function displayUserInfo(user) {
      document.getElementById('username-display').textContent = user.login;
      document.getElementById('email-display').textContent = user.email;
      document.getElementById('firstName-display').textContent = user.firstName || 'Not provided';
      document.getElementById('lastName-display').textContent = user.lastName || 'Not provided';
      document.getElementById('country-display').textContent = user.campus || 'Not provided';  
      document.getElementById('gender-display').textContent = user.attrs.genders || 'Not provided';
      document.getElementById('cpr-display').textContent = user.attrs.CPRnumber || 'Not provided';
      document.getElementById('phone-display').textContent = user.attrs.PhoneNumber || 'Not provided';
      document.getElementById('birth-display').textContent = formatDate(user.attrs.dateOfBirth) || 'Not provided';
      document.getElementById('qualification-display').textContent = user.attrs.qualification || 'Not provided';
      document.getElementById('degree-display').textContent = user.attrs.Degree || 'Not provided';
      document.getElementById('campus-display').textContent = user.campus || 'Not provided';
  }
  // Check for valid login and redirect if needed
  window.onload = function() {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (!userData || !userData.data) {
          window.location.href = 'index.html';
          return;
      }

      const user = userData.data.user[0];
      const skills = userData.data.skillTransactions;
      const xpTransactions = userData.data.xpTransactions;

      // Populate user info
      populateUserInfo(user);
    
      // Create data visualizations
      if (xpTransactions && xpTransactions.length > 0) {
          createXPGraph(xpTransactions);
      }
    
      if (user.totalUp !== undefined && user.totalDown !== undefined) {
          createAuditRatioGraph({
              totalUp: user.totalUp,
              totalDown: user.totalDown
          });
      }

      if (skills && skills.length > 0) {
          createRadarChart(skills);
      }
    
      // Create constellation effect
      setTimeout(() => {
          createConstellationLines();
          animateNodes();
          init3DDashboard();
      }, 500);
  };

  function populateUserInfo(user) {
      // Central Content
      const centralContent = document.querySelector('.user-info-content');
      centralContent.innerHTML = `
          <div class="info-item">
              <span class="info-label">Username:</span>
              <span>${user.login}</span>
          </div>
          <div class="info-item">
              <span class="info-label">Email:</span>
              <span>${user.email}</span>
          </div>
          <div class="info-item">
              <span class="info-label">Campus:</span>
              <span>${user.campus || 'Not provided'}</span>
          </div>
          <div class="info-item">
              <span class="info-label">Audit Bonus:</span>
              <span style="color:#0ef">+ ${(user.totalUpBonus / 1000000).toFixed(2)} MB</span>
          </div>
      `;
    
      // Create personal info node content
      const personalContent = document.querySelector('.personal-content');
      personalContent.innerHTML = `
          <div class="info-item">
              <span class="info-label">Full Name:</span>
              <span>${user.firstName || 'Not provided'} ${user.lastName || ''}</span>
          </div>
          <div class="info-item">
              <span class="info-label">Gender:</span>
              <span>${user.attrs?.genders || 'Not provided'}</span>
          </div>
          <div class="info-item">
              <span class="info-label">Birth Date:</span>
              <span>${formatDate(user.attrs?.dateOfBirth) || 'Not provided'}</span>
          </div>
          <div class="info-item">
              <span class="info-label">Phone:</span>
              <span>${user.attrs?.PhoneNumber || 'Not provided'}</span>
          </div>
          <div class="info-item">
              <span class="info-label">Qualification:</span>
              <span>${user.attrs?.qualification || 'Not provided'}</span>
          </div>
      `;
      
      // Populate progress node
      const userData = JSON.parse(localStorage.getItem('userData'));
      const progresses = userData.data.latestProgresses || [];
      const progressContent = document.querySelector('.progress-content');
      
      if (progresses.length > 0) {
          let progressHTML = '';
          // Show top 5 progresses
          progresses.slice(0, 5).forEach(prog => {
              const objName = prog.object ? prog.object.name : prog.path.split('/').pop();
              const isPass = prog.isDone ? '<span style="color:#0ef">Passed</span>' : '<span style="color:orange">In Progress</span>';
              progressHTML += `
                  <div class="info-item" style="flex-direction: column; align-items: flex-start; gap: 5px;">
                      <div style="width: 100%; display: flex; justify-content: space-between;">
                          <span class="info-label" style="font-size: 0.95rem;">${objName}</span>
                          <span style="font-size: 0.85rem;">Grade: ${prog.grade.toFixed(2)}</span>
                      </div>
                      <div style="width: 100%; display: flex; justify-content: space-between; font-size: 0.85rem;">
                          <span>${formatDate(prog.createdAt)}</span>
                          <span>${isPass}</span>
                      </div>
                  </div>
              `;
          });
          progressContent.innerHTML = progressHTML;
      } else {
          progressContent.innerHTML = '<div class="info-item"><span>No progress data available.</span></div>';
      }
      
      // Populate Level Node
      const levelTransactions = userData.data.levelTransactions || [];
      const levelContent = document.querySelector('.level-content');
      if (levelTransactions.length > 0) {
          const maxLevel = Math.max(...levelTransactions.map(t => t.amount));
          levelContent.innerHTML = `
              <div style="font-size: 5rem; font-weight: bold; color: #0ef; text-shadow: 0 0 20px rgba(0, 238, 255, 0.8);">
                  ${maxLevel}
              </div>
              <div style="color: #ccc; margin-top: 10px;">Highest Level Achieved</div>
          `;
      } else {
          levelContent.innerHTML = '<div class="info-item"><span>No level data available.</span></div>';
      }

      // Populate Records Node
      const recordsContent = document.querySelector('.records-content');
      const records = user.records || [];
      if (records.length > 0) {
          let recordsHTML = '';
          records.slice(0, 5).forEach(record => {
              const recordType = record.type ? record.type.label : 'Activity';
              recordsHTML += `
                  <div class="info-item" style="flex-direction: column; align-items: flex-start; gap: 5px;">
                      <div style="width: 100%; display: flex; justify-content: space-between;">
                          <span class="info-label" style="font-size: 0.95rem;">${recordType}</span>
                          <span style="font-size: 0.8rem; color: #ccc;">${formatDate(record.createdAt)}</span>
                      </div>
                      <div style="font-size: 0.85rem; line-height: 1.4;">${record.message || 'No details'}</div>
                  </div>
              `;
          });
          recordsContent.innerHTML = recordsHTML;
      } else {
          recordsContent.innerHTML = '<div class="info-item"><span>No recent activity.</span></div>';
      }

      // Populate Badges Node (Roles, Labels, Campuses)
      const badgesContent = document.querySelector('.badges-content');
      let badgesHTML = '';
      
      const roles = user.roles || [];
      roles.forEach(role => {
          badgesHTML += `<span style="background: rgba(255, 51, 51, 0.2); border: 1px solid #ff3333; color: #ff3333; padding: 4px 10px; border-radius: 12px; font-size: 0.8rem;">Role: ${role.slug}</span>`;
      });
      
      const labels = user.labels || [];
      labels.forEach(label => {
          badgesHTML += `<span style="background: rgba(0, 238, 255, 0.2); border: 1px solid #0ef; color: #0ef; padding: 4px 10px; border-radius: 12px; font-size: 0.8rem;">${label.labelName}</span>`;
      });

      const campuses = userData.data.campuses || [];
      if (campuses.length > 0) {
          badgesHTML += `<span style="background: rgba(200, 200, 200, 0.2); border: 1px solid #ccc; color: #ccc; padding: 4px 10px; border-radius: 12px; font-size: 0.8rem;">${campuses.length} Campuses Available</span>`;
      }

      if (badgesHTML) {
          badgesContent.innerHTML = badgesHTML;
      } else {
          badgesContent.innerHTML = '<div class="info-item"><span>No badges found.</span></div>';
      }
  }


  function logout() {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('userData');
      window.location.href = 'index.html';
  }

  function formatDate(dateString) {
      if (!dateString) return 'Not provided';
      return new Date(dateString).toISOString().split('T')[0];
  }

  // Handle window resize to redraw constellation
  window.addEventListener('resize', () => {
      // Clear existing lines
      document.querySelectorAll('.constellation-line').forEach(line => line.remove());
      // Redraw lines
      setTimeout(createConstellationLines, 100);
  });

// Call after charts are rendered  window.addEventListener('load', createConstellationLines);

function init3DDashboard() {
    const container = document.querySelector('.constellation-container');
    if (!container) return;
    
    // Create a subtle parallax float instead of bending the whole screen
    document.addEventListener('mousemove', (e) => {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 60;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 60;
        
        container.style.transform = `translateX(${xAxis}px) translateY(${yAxis}px)`;
    });

    // Reset position when mouse leaves
    document.addEventListener('mouseleave', () => {
        container.style.transform = `translateX(0px) translateY(0px)`;
    });
}

function initCardTilt() {
    const nodes = document.querySelectorAll('.constellation-node');
    
    nodes.forEach(node => {
        // Prepend glare and background element to each node dynamically
        const cardBg = document.createElement('div');
        cardBg.className = 'card-bg';
        node.insertBefore(cardBg, node.firstChild);

        const glare = document.createElement('div');
        glare.className = 'glare';
        node.insertBefore(glare, node.firstChild);

        node.addEventListener('mousemove', (e) => {
            const rect = node.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Max 15 degrees tilt
            const rotateX = ((y - centerY) / centerY) * -15; 
            const rotateY = ((x - centerX) / centerX) * 15;
            
            // Retrieve current depth from CSS variable
            const depth = node.style.getPropertyValue('--depth') || '20px';
            
            // Temporarily pause CSS float animation to allow instant tracking
            node.style.animationPlayState = 'paused';
            node.style.transition = 'none';
            node.style.transform = `translateZ(calc(${depth} + 30px)) scale(1.04) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            
            // Update glare
            glare.style.opacity = '1';
            glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.2) 0%, transparent 60%)`;
        });

        node.addEventListener('mouseleave', () => {
            // Resume float animation and CSS transitions
            node.style.animationPlayState = 'running';
            node.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            // Removing the inline transform allows the CSS base/hover state to take over smoothly
            node.style.transform = '';
            
            glare.style.opacity = '0';
        });
    });
}

// Initialize card tilt effects
window.addEventListener('load', initCardTilt);

function initMagneticButtons() {
    const magneticElements = document.querySelectorAll('.logout-button');
    
    magneticElements.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transition = 'transform 0.1s ease-out';
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            btn.style.transform = 'translate(0px, 0px)';
        });
    });
}

window.addEventListener('DOMContentLoaded', initMagneticButtons);
