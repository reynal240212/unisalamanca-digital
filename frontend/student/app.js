// Configuración
const API_BASE_URL = window.location.origin;

// Verificar Sesión
const token = localStorage.getItem('auth_token');
const user = JSON.parse(localStorage.getItem('student_user'));

if (!token || !user) {
    window.location.href = 'login.html';
}

if (user && user.must_change_password) {
    window.location.href = 'change-password.html';
}

// Variables de Onboarding
let stream = null;
const onboardingModal = document.getElementById('onboarding');
const cameraStream = document.getElementById('camera-stream');
const photoCanvas = document.getElementById('photo-canvas');
const captureControls = document.getElementById('capture-controls');
const confirmControls = document.getElementById('confirm-controls');
const uploadBtn = document.getElementById('upload-btn');
const photoUpload = document.getElementById('photo-upload');

let STUDENT_ID = user ? user.id : ''; 

const qrcodeElement = document.getElementById('qrcode');
const qrcode = new QRCode(qrcodeElement, {
    text: "placeholder",
    width: 150,
    height: 150,
    colorDark: "#0f172a",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
});

async function init() {
    // Mostrar info básica de inmediato desde localStorage
    if (user) {
        updateStudentInfo(user);
    }

    // Verificar si el usuario necesita onboarding (foto)
    if (!user.photo_url) {
        showOnboarding();
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/students/${STUDENT_ID}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            const studentData = await response.json();
            updateStudentInfo(studentData);
            refreshQR();
        } else {
            localStorage.clear();
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error('Error al inicializar:', error);
    }
}

// --- Lógica de Onboarding (Foto) ---

async function showOnboarding() {
    onboardingModal.classList.add('active');
    try {
        stream = await navigator.mediaDevices.getUserMedia({ 
            video: { width: 400, height: 400, facingMode: "user" } 
        });
        cameraStream.srcObject = stream;
    } catch (err) {
        console.error("Error acceso cámara:", err);
        alert("Se requiere acceso a la cámara para activar tu credencial.");
    }
}

document.getElementById('take-photo-btn').onclick = () => {
    const context = photoCanvas.getContext('2d');
    // Mirror effect for capture
    context.setTransform(1, 0, 0, 1, 0, 0); // Reset any previous transform
    context.translate(400, 0);
    context.scale(-1, 1);
    context.drawImage(cameraStream, 0, 0, 400, 400);
    
    switchToConfirm();
};

uploadBtn.onclick = () => {
    photoUpload.click();
};

photoUpload.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            const context = photoCanvas.getContext('2d');
            context.setTransform(1, 0, 0, 1, 0, 0); // Reset
            context.clearRect(0, 0, 400, 400);
            
            // Calculate aspect ratio to cover 400x400 (center crop)
            const scale = Math.max(400 / img.width, 400 / img.height);
            const x = (400 / 2) - (img.width / 2) * scale;
            const y = (400 / 2) - (img.height / 2) * scale;
            
            context.drawImage(img, x, y, img.width * scale, img.height * scale);
            switchToConfirm();
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
};

function switchToConfirm() {
    cameraStream.classList.add('hidden');
    photoCanvas.style.display = 'block';
    captureControls.classList.add('hidden');
    confirmControls.classList.remove('hidden');
    
    // Stop camera if photo is selected/taken
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
}

document.getElementById('retake-btn').onclick = () => {
    photoCanvas.style.display = 'none';
    captureControls.classList.remove('hidden');
    confirmControls.classList.add('hidden');
    photoUpload.value = ''; // Reset file input
    
    // Restart camera
    showOnboarding();
    cameraStream.classList.remove('hidden');
};

document.getElementById('save-photo-btn').onclick = async () => {
    const imageData = photoCanvas.toDataURL('image/jpeg', 0.8);
    
    try {
        const btn = document.getElementById('save-photo-btn');
        btn.innerText = "Guardando...";
        btn.disabled = true;

        const response = await fetch(`${API_BASE_URL}/students/${STUDENT_ID}/upload-photo`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(imageData)
        });

        if (response.status === 401) {
            alert("Tu sesión expiró. Vuelve a iniciar sesión.");
            localStorage.clear();
            window.location.href = 'login.html';
            return;
        }

        if (response.ok) {
            const data = await response.json();
            
            // Actualizar usuario local
            user.photo_url = data.photo_url;
            localStorage.setItem('student_user', JSON.stringify(user));
            
            // Cerrar stream y modal
            if (stream) stream.getTracks().forEach(track => track.stop());
            onboardingModal.classList.remove('active');
            
            // Reiniciar app
            init();
        } else {
            alert("Error al subir la foto. Inténtalo de nuevo.");
            btn.innerText = "Guardar y Activar";
            btn.disabled = false;
        }
    } catch (err) {
        console.error("Error al guardar foto:", err);
    }
};

function updateStudentInfo(student) {
    document.getElementById('student-name').innerText = student.name;
    document.getElementById('student-program').innerText = student.program || 'N/A';
    document.getElementById('student-uuid').innerText = student.id.split('-')[0].toUpperCase();
    document.getElementById('student-expiry').innerText = student.expiration_date ? new Date(student.expiration_date).toLocaleDateString() : 'Indefinida';
    if (student.photo_url) {
        document.getElementById('student-photo').src = student.photo_url;
    }
}

async function refreshQR() {
    if (!STUDENT_ID) return;

    try {
        console.log('Actualizando QR...');
        const response = await fetch(`${API_BASE_URL}/students/${STUDENT_ID}/qrcode`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) {
            const error = await response.json();
            console.error(`Error: ${error.detail}`);
            return;
        }

        const data = await response.json();
        
        // Actualizar el QR con el nuevo token dinámico
        qrcode.clear();
        qrcode.makeCode(data.qr_token);

        startProgressBar(120); // 2 minutos
    } catch (error) {
        console.error('Error al refrescar QR:', error);
    }
}

let timerInterval;
function startProgressBar(seconds) {
    if (timerInterval) clearInterval(timerInterval);
    
    const progressBar = document.getElementById('refresh-progress');
    let timeLeft = seconds;

    timerInterval = setInterval(() => {
        const percent = (timeLeft / seconds) * 100;
        progressBar.style.width = `${percent}%`;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            refreshQR(); // Auto refrescar
        }
        
        timeLeft--;
    }, 1000);
}

// Boton de Logout
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        if (stream) stream.getTracks().forEach(track => track.stop());
        localStorage.clear();
        window.location.href = 'login.html';
    });
}

// Iniciar
init();
