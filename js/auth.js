/**
 * Authentication JavaScript for Patient Medicine & Appointment Tracking System
 * Handles login and registration functionality
 */

document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');
  
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const alertContainer = document.getElementById('alertContainer');

      if (!validation.isValidEmail(email)) {
        validation.showError(document.getElementById('email'), 'Please enter a valid email address');
        return;
      }
      
      // Validate password is not empty
      if (validation.isEmpty(password)) {
        validation.showError(document.getElementById('password'), 'Password cannot be empty');
        return;
      }
      
      // Check if user exists in localStorage
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        // Save logged in user
        localStorage.setItem('user', JSON.stringify(user));
        
        // Show success message
        showAlert('Login successful! Redirecting...', 'success', alertContainer);
        
        // Redirect to appointments page after 2 seconds
        setTimeout(() => {
          window.location.href = 'appointments.html';
        }, 2000);
      } else {
        // Show error message
        showAlert('Invalid email or password. Please try again.', 'error', alertContainer);
      }
    });
    
    // Clear errors on input change
    const inputs = loginForm.querySelectorAll('.form-control');
    inputs.forEach(input => {
      input.addEventListener('input', function() {
        validation.removeError(this);
      });
    });
  }
  
  // Registration Form
  const registerForm = document.getElementById('registerForm');
  
  if (registerForm) {
    // Password strength indicator
    const passwordInput = document.getElementById('password');
    const strengthBar = document.querySelector('.password-strength-bar');
    const strengthText = document.querySelector('.password-strength-text');
    
    if (passwordInput && strengthBar && strengthText) {
      passwordInput.addEventListener('input', function() {
        const password = this.value;
        let strength = 0;
        
        // Length check
        if (password.length >= 8) strength += 1;
        
        // Complexity checks
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        
        // Update UI based on strength
        strengthBar.className = 'password-strength-bar';
        switch(strength) {
          case 0:
          case 1:
            strengthBar.classList.add('strength-weak');
            strengthText.textContent = 'Weak';
            strengthText.style.color = 'var(--error-color)';
            break;
          case 2:
          case 3:
            strengthBar.classList.add('strength-medium');
            strengthText.textContent = 'Medium';
            strengthText.style.color = 'var(--warning-color)';
            break;
          case 4:
            strengthBar.classList.add('strength-strong');
            strengthText.textContent = 'Strong';
            strengthText.style.color = 'var(--success-color)';
            break;
        }
      });
    }
    
    // Form submission
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      const age = document.getElementById('age').value;
      const genderOptions = document.getElementsByName('gender');
      const phone = document.getElementById('phone').value;
      const alertContainer = document.getElementById('alertContainer');
      
      let gender = '';
      for (let i = 0; i < genderOptions.length; i++) {
        if (genderOptions[i].checked) {
          gender = genderOptions[i].value;
          break;
        }
      }
      
      // Validate name
      if (validation.isEmpty(name)) {
        validation.showError(document.getElementById('name'), 'Name cannot be empty');
        return;
      }
      
      // Validate email
      if (!validation.isValidEmail(email)) {
        validation.showError(document.getElementById('email'), 'Please enter a valid email address');
        return;
      }
      
      // Validate password
      if (!validation.isStrongPassword(password)) {
        validation.showError(document.getElementById('password'), 'Password must be at least 8 characters with at least one uppercase letter, one lowercase letter, and one number');
        return;
      }
      
      // Validate confirm password
      if (!validation.doValuesMatch(password, confirmPassword)) {
        validation.showError(document.getElementById('confirmPassword'), 'Passwords do not match');
        return;
      }
      
      // Validate age
      if (isNaN(age) || parseInt(age) <= 0) {
        validation.showError(document.getElementById('age'), 'Please enter a valid age');
        return;
      }
      
      // Validate gender
      if (gender === '') {
        // Since we can't add error to radio buttons the same way, alert the user
        showAlert('Please select a gender', 'error', alertContainer);
        return;
      }
      
      // Validate phone
      if (!validation.isValidPhone(phone)) {
        validation.showError(document.getElementById('phone'), 'Please enter a valid 10-digit phone number');
        return;
      }
      
      // Check if user already exists
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const userExists = users.some(user => user.email === email);
      
      if (userExists) {
        validation.showError(document.getElementById('email'), 'Email already registered');
        return;
      }
      
      // Create new user object
      const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        age: parseInt(age),
        gender,
        phone,
        registeredOn: new Date().toISOString()
      };
      
      // Save user to localStorage
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Show success message
      showAlert('Registration successful! Redirecting to login...', 'success', alertContainer);

      setTimeout(() => {
        window.location.href = 'login.html';
      }, 2000);
    });

    const inputs = registerForm.querySelectorAll('.form-control');
    inputs.forEach(input => {
      input.addEventListener('input', function() {
        validation.removeError(this);
      });
    });
  }
});