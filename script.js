/**
 * Initialize theme from LocalStorage or set default
 */
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

/**
 * Toggle between dark and light theme
 */
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

/**
 * Update theme toggle button icon
 */
function updateThemeIcon(theme) {
    const themeToggleBtn = document.getElementById('themeToggle');
    if (themeToggleBtn) {
        const icon = themeToggleBtn.querySelector('i');
        if (theme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }
}

// ========================================
// FORM VALIDATION UTILITIES
// ========================================

/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate phone number (numeric only)
 */
function isValidPhone(phone) {
    const phoneRegex = /^[0-9+\s()-]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

/**
 * Validate strong password
 * Requirements: Min 8 chars, uppercase, lowercase, number, special character
 */
function isStrongPassword(password) {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
}

/**
 * Calculate password strength
 */
function getPasswordStrength(password) {
    let strength = 0;

    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

    if (strength <= 2) return 'weak';
    if (strength <= 4) return 'medium';
    return 'strong';
}

/**
 * Show alert message
 */
function showAlert(elementId, message, type) {
    const alertElement = document.getElementById(elementId);
    if (!alertElement) return;

    alertElement.className = `alert alert-${type}`;
    alertElement.textContent = message;
    alertElement.classList.remove('d-none');

    // Auto hide after 5 seconds
    setTimeout(() => {
        alertElement.classList.add('d-none');
    }, 5000);
}

// ========================================
// PASSWORD VISIBILITY TOGGLE
// ========================================

/**
 * Toggle password visibility
 */
function setupPasswordToggle(toggleBtnId, passwordFieldId) {
    const toggleBtn = document.getElementById(toggleBtnId);
    const passwordField = document.getElementById(passwordFieldId);

    if (toggleBtn && passwordField) {
        toggleBtn.addEventListener('click', () => {
            const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordField.setAttribute('type', type);

            const icon = toggleBtn.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }
}

// ========================================
// LOGIN FORM HANDLER
// ========================================

function handleLogin(event) {
    event.preventDefault();
    event.stopPropagation();

    const form = event.target;
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    // Validate email
    if (!isValidEmail(email)) {
        document.getElementById('loginEmail').classList.add('is-invalid');
        showAlert('loginAlert', 'Please enter a valid email address.', 'danger');
        return;
    }

    // Validate password
    if (!password) {
        document.getElementById('loginPassword').classList.add('is-invalid');
        showAlert('loginAlert', 'Password is required.', 'danger');
        return;
    }

    // Get user data from LocalStorage
    const userData = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
        showAlert('loginAlert', 'No account found. Please register first.', 'danger');
        return;
    }

    // Verify credentials
    if (userData.email === email && userData.password === password) {
        // Update last login date
        userData.lastLogin = new Date().toLocaleString();
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('isLoggedIn', 'true');

        showAlert('loginAlert', 'Login successful! Redirecting...', 'success');

        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    } else {
        showAlert('loginAlert', 'Invalid email or password.', 'danger');
    }
}

// ========================================
// REGISTER FORM HANDLER
// ========================================

function handleRegister(event) {
    event.preventDefault();
    event.stopPropagation();

    const form = event.target;
    let isValid = true;

    // Get form values
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const country = document.getElementById('country').value;
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;

    // Reset validation states
    form.querySelectorAll('.form-control, .form-select').forEach(field => {
        field.classList.remove('is-invalid', 'is-valid');
    });

    // Validate first name
    if (!firstName) {
        document.getElementById('firstName').classList.add('is-invalid');
        isValid = false;
    } else {
        document.getElementById('firstName').classList.add('is-valid');
    }

    // Validate last name
    if (!lastName) {
        document.getElementById('lastName').classList.add('is-invalid');
        isValid = false;
    } else {
        document.getElementById('lastName').classList.add('is-valid');
    }

    // Validate country
    if (!country) {
        document.getElementById('country').classList.add('is-invalid');
        isValid = false;
    } else {
        document.getElementById('country').classList.add('is-valid');
    }

    // Validate phone
    if (!isValidPhone(phone)) {
        document.getElementById('phone').classList.add('is-invalid');
        isValid = false;
    } else {
        document.getElementById('phone').classList.add('is-valid');
    }

    // Validate email
    if (!isValidEmail(email)) {
        document.getElementById('registerEmail').classList.add('is-invalid');
        isValid = false;
    } else {
        document.getElementById('registerEmail').classList.add('is-valid');
    }

    // Validate password strength
    if (!isStrongPassword(password)) {
        document.getElementById('registerPassword').classList.add('is-invalid');
        isValid = false;
    } else {
        document.getElementById('registerPassword').classList.add('is-valid');
    }

    // Validate confirm password
    if (password !== confirmPassword) {
        document.getElementById('confirmPassword').classList.add('is-invalid');
        isValid = false;
    } else {
        document.getElementById('confirmPassword').classList.add('is-valid');
    }

    // Validate terms agreement
    if (!agreeTerms) {
        document.getElementById('agreeTerms').classList.add('is-invalid');
        isValid = false;
    }

    // If validation fails, show error
    if (!isValid) {
        showAlert('registerAlert', 'Please fill in all fields correctly.', 'danger');
        return;
    }

    // Check if user already exists
    const existingUser = localStorage.getItem('userData');
    if (existingUser) {
        const userData = JSON.parse(existingUser);
        if (userData.email === email) {
            showAlert('registerAlert', 'An account with this email already exists.', 'danger');
            return;
        }
    }

    // Create user data object
    const userData = {
        firstName: firstName,
        lastName: lastName,
        fullName: `${firstName} ${lastName}`,
        country: country,
        phone: phone,
        email: email,
        password: password,
        createdDate: new Date().toLocaleString(),
        lastLogin: new Date().toLocaleString()
    };

    // Save to LocalStorage
    localStorage.setItem('userData', JSON.stringify(userData));

    showAlert('registerAlert', 'Registration successful! Redirecting to login...', 'success');

    // Redirect to login page
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
}

// ========================================
// PASSWORD STRENGTH INDICATOR
// ========================================

function updatePasswordStrength() {
    const password = document.getElementById('registerPassword').value;
    const strengthMeter = document.getElementById('strengthMeter');
    const strengthText = document.getElementById('strengthText');

    if (!password) {
        strengthMeter.style.width = '0';
        strengthMeter.className = 'strength-meter-fill';
        strengthText.textContent = '';
        return;
    }

    const strength = getPasswordStrength(password);

    strengthMeter.className = 'strength-meter-fill';

    if (strength === 'weak') {
        strengthMeter.classList.add('strength-weak');
        strengthText.textContent = 'Weak password';
        strengthText.style.color = '#dc3545';
    } else if (strength === 'medium') {
        strengthMeter.classList.add('strength-medium');
        strengthText.textContent = 'Medium strength';
        strengthText.style.color = '#ffc107';
    } else {
        strengthMeter.classList.add('strength-strong');
        strengthText.textContent = 'Strong password';
        strengthText.style.color = '#28a745';
    }
}

// ========================================
// DASHBOARD DATA LOADER
// ========================================

function loadDashboardData() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    // const dashboardSection = document.querySelector('.dashboard-section');
    const notLoggedSection = document.getElementById('notLoggedSection');

    if (!userData || !isLoggedIn) {
        // User not logged in - show not logged message
        if (dashboardSection) dashboardSection.classList.add('d-none');
        if (notLoggedSection) notLoggedSection.classList.remove('d-none');
        return;
    }

    // User is logged in - display data
    if (dashboardSection) dashboardSection.classList.remove('d-none');
    if (notLoggedSection) notLoggedSection.classList.add('d-none');

    // Populate dashboard with user data
    const elements = {
        userFullName: userData.fullName,
        displayFullName: userData.fullName,
        displayEmail: userData.email,
        displayPhone: userData.phone,
        displayCountry: userData.country,
        displayLastLogin: userData.lastLogin,
        displayCreatedDate: userData.createdDate
    };

    Object.keys(elements).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = elements[id];
        }
    });
}

// ========================================
// LOGOUT HANDLER
// ========================================

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.setItem('isLoggedIn', 'false');
        window.location.href = 'login.html';
    }
}

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme
    initTheme();

    // Setup theme toggle button
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Setup password visibility toggles
    setupPasswordToggle('togglePassword', 'loginPassword');
    setupPasswordToggle('toggleRegPassword', 'registerPassword');
    setupPasswordToggle('toggleConfirmPassword', 'confirmPassword');

    // Login form handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Register form handler
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);

        // Password strength indicator
        const registerPassword = document.getElementById('registerPassword');
        if (registerPassword) {
            registerPassword.addEventListener('input', updatePasswordStrength);
        }
    }

    // Dashboard page
    if (window.location.pathname.includes('dashboard.html')) {
        loadDashboardData();

    }

    // Remove invalid class on input
    document.querySelectorAll('.form-control, .form-select').forEach(field => {
        field.addEventListener('input', function () {
            this.classList.remove('is-invalid');
        });
    });
});

// ========================================
// NAVBAR SCROLL EFFECT (Optional)
// ========================================

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
    }
});
