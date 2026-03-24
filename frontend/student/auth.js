const API_BASE_URL = window.location.origin + "/api";

let captchaAnswer = 0;

function generateCaptcha() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operators = ['+', '-', '*'];
    const op = operators[Math.floor(Math.random() * operators.length)];
    
    const puzzleText = document.getElementById('puzzleText');
    if (puzzleText) {
        puzzleText.innerText = `${num1} ${op} ${num2} = ?`;
    }
    
    switch(op) {
        case '+': captchaAnswer = num1 + num2; break;
        case '-': captchaAnswer = num1 - num2; break;
        case '*': captchaAnswer = num1 * num2; break;
    }
}

// Inicializar captcha y cargar email recordado
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('puzzleText')) {
        generateCaptcha();
    }

    // Lógica para Recordarme
    const savedEmail = localStorage.getItem('remembered_email');
    const emailInput = document.getElementById('email');
    const rememberMeCheckbox = document.getElementById('rememberMe');
    
    if (savedEmail && emailInput) {
        emailInput.value = savedEmail;
        if (rememberMeCheckbox) rememberMeCheckbox.checked = true;
    }

    // Lógica para Toggle Password
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('toggleIcon');

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            toggleIcon.innerText = type === 'password' ? '👁️' : '👁️‍🗨️';
        });
    }
});

const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const userAnswer = parseInt(document.getElementById('captchaInput').value);
        const errorMsg = document.getElementById('errorMsg');
        const loginBtn = document.getElementById('loginBtn');
        const rememberMe = document.getElementById('rememberMe')?.checked;
        
        // Reset error message
        errorMsg.style.display = 'none';
        
        if (userAnswer !== captchaAnswer) {
            showError("Respuesta del acertijo incorrecta. Intenta de nuevo.");
            generateCaptcha();
            return;
        }

        // Mostrar estado de carga
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Lógica de Recordarme
                if (rememberMe) {
                    localStorage.setItem('remembered_email', email);
                } else {
                    localStorage.removeItem('remembered_email');
                }

                // Determinar si es un login para validador o estudiante
                const urlParams = new URLSearchParams(window.location.search);
                const requestedRole = urlParams.get('role');

                if (requestedRole === 'validador') {
                    if (data.user.role !== 'VALIDADOR' && data.user.role !== 'ADMIN') {
                        showError("Error: Esta cuenta no tiene permisos de validador.");
                        setLoading(false);
                        return;
                    }
                    localStorage.setItem('auth_token', data.access_token);
                    localStorage.setItem('user_role', data.user.role);
                    window.location.href = '../validator/index.html';
                } else if (data.user.role === 'ADMIN') {
                    // Admin login
                    localStorage.setItem('auth_token', data.access_token);
                    localStorage.setItem('user_role', 'ADMIN');
                    window.location.href = '../admin/index.html';
                } else {
                    // Estudiante
                    localStorage.setItem('auth_token', data.access_token);
                    localStorage.setItem('student_user', JSON.stringify(data.user));
                    
                    if (data.user.must_change_password) {
                        window.location.href = 'change-password.html';
                    } else {
                        window.location.href = 'index.html';
                    }
                }
            } else {
                showError(data.detail || "Error al iniciar sesión");
                setLoading(false);
                generateCaptcha();
            }
        } catch (error) {
            showError("Error de conexión con el servidor");
            setLoading(false);
        }
    });
}

function showError(message) {
    const errorMsg = document.getElementById('errorMsg');
    if (errorMsg) {
        errorMsg.innerText = message;
        errorMsg.style.display = 'block';
        errorMsg.style.animation = 'shake 0.5s';
        setTimeout(() => { errorMsg.style.animation = ''; }, 500);
    }
}

function setLoading(isLoading) {
    const loginBtn = document.getElementById('loginBtn');
    if (!loginBtn) return;
    
    const btnText = loginBtn.querySelector('.btn-text');
    const loader = loginBtn.querySelector('.loader');
    
    if (isLoading) {
        loginBtn.disabled = true;
        btnText.style.opacity = '0';
        loader.classList.remove('hidden');
    } else {
        loginBtn.disabled = false;
        btnText.style.opacity = '1';
        loader.classList.add('hidden');
    }
}
