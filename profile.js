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
      const skills = userData.data.transaction;

      // Populate user info
      populateUserInfo(user);
    
      // Create data visualizations
      if (user.transactions) {
          createXPGraph(user);
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
      }, 500);
  };

  function populateUserInfo(user) {
      // Create central node content
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
