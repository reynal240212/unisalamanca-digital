// Configuración
// 0. Bloquear Retroceso (Prevenir volver al login tras entrar)
history.pushState(null, null, location.href);
window.onpopstate = function () {
    history.go(1);
};

// Verificar Sesión
const token = localStorage.getItem('auth_token');
const user = JSON.parse(localStorage.getItem('student_user'));

if (!token || !user) {
    window.location.replace('../login.html');
}

if (user && user.must_change_password) {
    window.location.replace('change-password.html');
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
// The initial QRCode object is no longer needed as it will be regenerated in refreshQR
// const qrcode = new QRCode(qrcodeElement, {
//     text: "placeholder",
//     width: 150,
//     height: 150,
//     colorDark: "#0f172a",
//     colorLight: "#ffffff",
//     correctLevel: QRCode.CorrectLevel.H
// });

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
        // Consulta directa a Supabase
        const { data: studentData, error } = await supabaseClient
            .from('user')
            .select('*')
            .eq('id', STUDENT_ID)
            .single();

        if (studentData && !error) {
            updateStudentInfo(studentData);
            // Actualizar el cache local
            localStorage.setItem('student_user', JSON.stringify(studentData));
            refreshQR();
        } else {
            console.error("Error al obtener datos:", error);
            // Si el usuario no existe o hay error crítico, re-loguear
            if (error && error.code === 'PGRST116') { // Not found
                localStorage.clear();
                window.location.replace('../login.html');
            }
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
    const privacyCheck = document.getElementById('privacy-check');
    if (!privacyCheck.checked) {
        alert("Debes aceptar la Política de Tratamiento de Datos (Ley 1581) para activar tu credencial.");
        return;
    }

    const imageData = photoCanvas.toDataURL('image/jpeg', 0.8);
    
    try {
        const btn = document.getElementById('save-photo-btn');
        btn.innerText = "Guardando...";
        btn.disabled = true;

        // Convertir base64 a Blob para subir a Supabase Storage
        const blob = await fetch(imageData).then(res => res.blob());
        const fileName = `${STUDENT_ID}/${Date.now()}.jpg`;

        // Subir a Supabase Storage
        const { data: uploadData, error: uploadError } = await supabaseClient.storage
            .from('student-photos')
            .upload(fileName, blob, { contentType: 'image/jpeg' });

        if (uploadError) {
            console.error("Error upload:", uploadError);
            alert("Error al subir la foto.");
            btn.innerText = "Guardar y Activar";
            btn.disabled = false;
            return;
        }

        // Obtener URL pública
        const { data: { publicUrl } } = supabaseClient.storage
            .from('student-photos')
            .getPublicUrl(fileName);

        // Actualizar perfil del usuario en la base de datos
        const { error: updateError } = await supabaseClient
            .from('user')
            .update({ photo_url: publicUrl })
            .eq('id', STUDENT_ID);

        if (!updateError) {
            // Actualizar usuario local
            user.photo_url = publicUrl;
            localStorage.setItem('student_user', JSON.stringify(user));
            
            // Cerrar stream y modal
            if (stream) stream.getTracks().forEach(track => track.stop());
            onboardingModal.classList.remove('active');
            
            // Reiniciar app
            init();
        } else {
            console.error("Error update DB:", updateError);
            alert("Error al actualizar perfil.");
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
        console.log('🔄 Actualizando QR Dinámico...');
        
        // Generar un token único con bloque de tiempo (cada 30s)
        const timeBlock = Math.floor(Date.now() / 30000);
        const qrContent = `UNIS|${STUDENT_ID}|${timeBlock}`;
        
        // Registrar el token en la tabla credential (Backend-less validation)
        const { error } = await supabaseClient
            .from('credential')
            .upsert({ 
                user_id: STUDENT_ID, 
                token: qrContent,
                expires_at: new Date(Date.now() + 65000).toISOString() // Válido por ~1 min
            }, { onConflict: 'user_id' });

        if (error) {
            console.error("❌ Error al registrar credential:", error);
            if (error.message) console.error("Mensaje:", error.message);
        }
        
        // Generar el QR usando una API robusta de imagen (Evita problemas de librería JS/Canvas)
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrContent)}&bgcolor=ffffff&color=0f172a&qzone=2`;
        
        console.log('✅ Generando nuevo QR URL:', qrUrl);
        
        // Actualizar el contenedor con una imagen simple
        qrcodeElement.innerHTML = `<img src="${qrUrl}" alt="QR Code" style="width: 150px; height: 150px; display: block; border-radius: 8px;">`;

        startProgressBar(30); // Rotación cada 30 segundos
    } catch (error) {
        console.error('❌ Error general en refreshQR:', error);
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
    logoutBtn.addEventListener('click', async () => {
        if (stream) stream.getTracks().forEach(track => track.stop());
        try {
            await supabaseClient.auth.signOut();
        } catch (e) {
            console.error("Error signing out:", e);
        }
        localStorage.clear();
        window.location.replace('../login.html');
    });
}

// Iniciar
init();
