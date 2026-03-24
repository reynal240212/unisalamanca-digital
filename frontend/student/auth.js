// Auth logic

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
            // Consulta directa a Supabase (Backend-less)
            const { data: user, error } = await supabaseClient
                .from('user')
                .select('*')
                .eq('email', email)
                .single();

            if (error || !user) {
                showError("Usuario no encontrado o error de red");
                setLoading(false);
                generateCaptcha();
                return;
            }

            // Verificar contraseña usando bcryptjs (localmente en el navegador)
            const passwordMatch = dcodeIO.bcrypt.compareSync(password, user.password_hash);

            if (passwordMatch) {
                // Lógica de Recordarme
                if (rememberMe) {
                    localStorage.setItem('remembered_email', email);
                } else {
                    localStorage.removeItem('remembered_email');
                }

                // Determinar si es un login para validador o estudiante
                const urlParams = new URLSearchParams(window.location.search);
                const requestedRole = urlParams.get('role');

                // En el modo backend-less, usamos una sesión local simple
                localStorage.setItem('auth_token', 'supabase_session_active');

                if (requestedRole === 'validador') {
                    if (user.role !== 'VALIDADOR' && user.role !== 'ADMIN') {
                        showError("Error: Esta cuenta no tiene permisos de validador.");
                        setLoading(false);
                        return;
                    }
                    localStorage.setItem('user_role', user.role);
                    window.location.href = '../validator/index.html';
                } else if (user.role === 'ADMIN') {
                    // Admin login
                    localStorage.setItem('user_role', 'ADMIN');
                    window.location.href = '../admin/index.html';
                } else {
                    // Estudiante
                    localStorage.setItem('student_user', JSON.stringify(user));
                    
                    if (user.must_change_password) {
                        window.location.href = 'change-password.html';
                    } else {
                        window.location.href = 'index.html';
                    }
                }
            } else {
                showError("Credenciales incorrectas");
                setLoading(false);
                generateCaptcha();
            }
        } catch (error) {
            console.error(error);
            showError("Error de comunicación con Supabase");
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
