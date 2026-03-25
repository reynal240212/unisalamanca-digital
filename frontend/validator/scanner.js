// Sesión de Validador
// 0. Bloquear Retroceso
history.pushState(null, null, location.href);
window.onpopstate = function () {
    history.go(1);
};
const token = localStorage.getItem('auth_token');
const userRole = localStorage.getItem('user_role');

// Protección de Ruta
if (!token || (userRole !== 'VALIDADOR' && userRole !== 'ADMIN')) {
    localStorage.clear();
    window.location.replace('../login.html?role=validador'); 
}

// Configuración de UI
const html5QrCode = new Html5Qrcode("reader");
const resultPanel = document.getElementById('resultPanel');
const statusBadge = document.getElementById('statusBadge');
const avatarContainer = document.getElementById('avatarContainer');
const studentPhoto = document.getElementById('studentPhoto');
const resultTitle = document.getElementById('resultTitle');
const resultDetails = document.getElementById('resultDetails');

const config = { fps: 15, qrbox: { width: 300, height: 300 } };

function onScanSuccess(decodedText) {
    // Feedback táctil si es posible
    if (window.navigator.vibrate) window.navigator.vibrate(50);
    
    html5QrCode.pause();
    verifyAccess(decodedText);
}

async function verifyAccess(qrToken) {
    try {
        console.log("Verificando:", qrToken);
        
        // 1. Consulta atómica a Supabase (con Join para perfil)
        const { data: credential, error } = await supabaseClient
            .from('credential')
            .select('*, student:user!user_id(name, program, photo_url, status)')
            .eq('token', qrToken)
            .single();

        if (error || !credential) {
            showDenied("Código Inválido", "El código QR no existe o es fraudulento.");
            return;
        }

        // 2. Verificar expiración temporal
        const now = new Date();
        if (now > new Date(credential.expires_at)) {
            showDenied("Código Expirado", "El tiempo de validez del código ha terminado. El estudiante debe generar uno nuevo.");
            return;
        }

        // 3. Verificar estado del estudiante
        if (credential.student.status !== 'Active') {
            showDenied("Acceso Restringido", `El estudiante ${credential.student.name} tiene un estado: ${credential.student.status}`);
            return;
        }

        // 4. Registrar éxito en AccessLog (Async)
        supabaseClient.from('accesslog').insert({
            user_id: credential.user_id,
            location: "Acceso Digital",
            status: "Granted"
        }).then();

        // 5. Mostrar Éxito
        showGranted(credential.student);

    } catch (err) {
        console.error(err);
        showDenied("Error de Red", "No se pudo conectar con el servidor de validación.");
    }
}

function showGranted(student) {
    statusBadge.innerText = "✅";
    statusBadge.className = "status-badge granted";
    resultTitle.innerText = "Acceso Permitido";
    resultTitle.style.color = "#10b981";
    resultDetails.innerText = `${student.name.toUpperCase()}\n${student.program || 'Programa N/A'}`;
    
    if (student.photo_url) {
        studentPhoto.src = student.photo_url;
        avatarContainer.style.display = 'block';
    } else {
        avatarContainer.style.display = 'none';
    }

    resultPanel.classList.add('active');
}

function showDenied(title, reason) {
    statusBadge.innerText = "❌";
    statusBadge.className = "status-badge denied";
    resultTitle.innerText = title;
    resultTitle.style.color = "#ef4444";
    resultDetails.innerText = reason;
    avatarContainer.style.display = 'none';
    
    resultPanel.classList.add('active');
}

function closeOverlay() {
    resultPanel.classList.remove('active');
    setTimeout(() => {
        html5QrCode.resume();
    }, 400);
}

// Iniciar Cámara
html5QrCode.start({ facingMode: "environment" }, config, onScanSuccess)
    .catch(err => {
        console.error("No se pudo iniciar cámara trasera:", err);
        // Fallback a cualquier cámara
        html5QrCode.start({ facingMode: "user" }, config, onScanSuccess);
    });

// Logout
document.getElementById('logoutBtn').addEventListener('click', async () => {
    try {
        await supabaseClient.auth.signOut();
    } catch (e) {
        console.error("Error signing out:", e);
    }
    html5QrCode.stop().then(() => {
        localStorage.clear();
        window.location.replace('../login.html');
    });
});
