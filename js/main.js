/**
 * Main JavaScript file for Patient Medicine & Appointment Tracking System
 * Handles navigation, theme, and common functionality across all pages
 */

const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });
}

document.addEventListener('click', (e) => {
  if (menuToggle && navLinks.classList.contains('active') && !e.target.closest('.nav')) {
    menuToggle.classList.remove('active');
    navLinks.classList.remove('active');
  }
});

const validation = {
  /**
   * Check if an email is valid
   * @param {string} email - The email to validate
   * @return {boolean} - True if valid, false otherwise
   */
  isValidEmail: function(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  },

  /**
   * Check if a field is empty
   * @param {string} value - The value to check
   * @return {boolean} - True if empty, false otherwise
   */
  isEmpty: function(value) {
    return value.trim() === '';
  },

  /**
   * Check if a password is strong enough
   * @param {string} password - The password to validate
   * @return {boolean} - True if strong enough, false otherwise
   */
  isStrongPassword: function(password) {
    // At least 8 characters, with at least one number, one uppercase, and one lowercase letter
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return re.test(password);
  },

  /**
   * Check if two values match
   * @param {string} value1 - First value
   * @param {string} value2 - Second value
   * @return {boolean} - True if matching, false otherwise
   */
  doValuesMatch: function(value1, value2) {
    return value1 === value2;
  },

  /**
   * Check if a phone number is valid
   * @param {string} phone - The phone number to validate
   * @return {boolean} - True if valid, false otherwise
   */
  isValidPhone: function(phone) {
    // Simple validation for phone numbers, can be adjusted based on country format
    const re = /^\d{10}$/;
    return re.test(phone.replace(/\D/g, ''));
  },

  /**
   * Show an error message for a form field
   * @param {HTMLElement} input - The input element
   * @param {string} message - The error message
   */
  showError: function(input, message) {
    const formGroup = input.parentElement;
    const errorElement = formGroup.querySelector('.error-message') || document.createElement('div');
    
    input.classList.add('error');
    
    if (!formGroup.querySelector('.error-message')) {
      errorElement.className = 'error-message';
      formGroup.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
  },

  /**
   * Remove error message from a form field
   * @param {HTMLElement} input - The input element
   */
  removeError: function(input) {
    const formGroup = input.parentElement;
    const errorElement = formGroup.querySelector('.error-message');
    
    input.classList.remove('error');
    
    if (errorElement) {
      errorElement.textContent = '';
    }
  }
};

// Show alert message
function showAlert(message, type, container) {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type} animate-fadeIn`;
  alertDiv.textContent = message;
  
  // Insert at the beginning of container
  container.insertBefore(alertDiv, container.firstChild);
  
  // Remove alert after 5 seconds
  setTimeout(() => {
    alertDiv.style.opacity = '0';
    setTimeout(() => {
      alertDiv.remove();
    }, 300);
  }, 5000);
}

// Check if user is logged in
function isLoggedIn() {
  return localStorage.getItem('user') !== null;
}

// Update UI based on login status
function updateUIByLoginStatus() {
  const loginBtn = document.querySelector('.btn-login');
  const registerBtn = document.querySelector('.btn-register');
  
  if (isLoggedIn()) {
    if (loginBtn) loginBtn.textContent = 'Logout';
    if (registerBtn) registerBtn.style.display = 'none';
    
    // Add user info to navbar if logged in
    const user = JSON.parse(localStorage.getItem('user'));
    const navLinks = document.getElementById('navLinks');
    
    if (navLinks && !document.querySelector('.user-info')) {
      const userInfoLi = document.createElement('li');
      userInfoLi.className = 'user-info';
      userInfoLi.innerHTML = `<span>Welcome, ${user.name}</span>`;
      navLinks.insertBefore(userInfoLi, loginBtn.parentElement);
    }
  } else {
    if (loginBtn) loginBtn.textContent = 'Login';
    if (registerBtn) registerBtn.style.display = 'inline-block';
    
    // Remove user info if present
    const userInfo = document.querySelector('.user-info');
    if (userInfo) userInfo.remove();
  }
  
  // Update login button functionality
  if (loginBtn) {
    loginBtn.addEventListener('click', function(e) {
      if (isLoggedIn()) {
        e.preventDefault();
        localStorage.removeItem('user');
        window.location.href = 'index.html';
      }
    });
  }
}

// Initialize function that runs on every page load
function init() {
  updateUIByLoginStatus();
  
  // Check if path requires authentication
  const protectedPaths = ['/appointments.html', '/prescriptions.html'];
  const currentPath = window.location.pathname;
  
  if (protectedPaths.some(path => currentPath.includes(path)) && !isLoggedIn()) {
    window.location.href = 'login.html';
  }
}

document.addEventListener('DOMContentLoaded', init);

window.validation = validation;
window.showAlert = showAlert;
window.isLoggedIn = isLoggedIn;