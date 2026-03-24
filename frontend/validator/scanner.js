// Sesión de Validador
const token = localStorage.getItem('auth_token');
const userRole = localStorage.getItem('user_role');

if (!token || (userRole !== 'VALIDADOR' && userRole !== 'ADMIN')) {
    alert("Acceso Restringido: Solo para personal de seguridad (Validador)");
    window.location.href = '../student/login.html?role=validador'; 
}

const html5QrCode = new Html5Qrcode("reader");
const overlay = document.getElementById('resultOverlay');

function onScanSuccess(decodedText, decodedResult) {
    // Detener escaneo mientras se muestra el resultado
    html5QrCode.pause();
    verifyQR(decodedText);
}

async function verifyQR(qrToken) {
    try {
        console.log("Verificando token:", qrToken);
        
        // Consulta directa a Supabase
        const { data: credential, error } = await supabaseClient
            .from('credential')
            .select('*, user:user_id(name, program, photo_url)')
            .eq('token', qrToken)
            .single();

        if (error || !credential) {
            console.error("Token no encontrado:", error);
            showResult({ status: 'Denied', reason: 'Código QR no reconocido o falso' });
            return;
        }

        // Verificar expiración
        const now = new Date();
        const expiresAt = new Date(credential.expires_at);
        
        if (now > expiresAt) {
            showResult({ status: 'Denied', reason: 'El código QR ha expirado' });
            return;
        }

        // Registrar el acceso en el log
        await supabaseClient
            .from('accesslog')
            .insert({
                user_id: credential.user_id,
                location: "Entrada Principal",
                status: "Granted"
            });

        // Mostrar éxito
        showResult({
            status: 'Granted',
            student_name: credential.user.name,
            program: credential.user.program,
            photo_url: credential.user.photo_url
        });

    } catch (error) {
        console.error("Error verify:", error);
        showResult({ status: 'Denied', reason: 'Error de comunicación con Supabase' });
    }
}

function showResult(data) {
    const icon = document.getElementById('statusIcon');
    const title = document.getElementById('resultTitle');
    const subtitle = document.getElementById('resultSubtitle');
    const photo = document.getElementById('resultPhoto');

    if (data.status === 'Granted') {
        icon.innerText = "✅";
        icon.className = "status-icon success";
        title.innerText = "Acceso Permitido";
        subtitle.innerText = `${data.student_name}\n${data.program || ''}`;
        if (data.photo_url) {
            photo.src = data.photo_url;
            photo.style.display = 'block';
        }
        // Sonido de exito? (Opcional)
    } else {
        icon.innerText = "❌";
        icon.className = "status-icon error";
        title.innerText = "Acceso Denegado";
        subtitle.innerText = data.reason || "Token inválido";
        photo.style.display = 'none';
    }

    overlay.classList.add('active');
}

function closeOverlay() {
    overlay.classList.remove('active');
    html5QrCode.resume();
}

// Configuración de la cámara
const config = { fps: 10, qrbox: { width: 250, height: 250 } };

html5QrCode.start({ facingMode: "environment" }, config, onScanSuccess)
    .catch(err => {
        console.error("Error al iniciar cámara:", err);
        // Si no hay cámara trasera, intentar con cualquier cámara
        html5QrCode.start({ facingMode: "user" }, config, onScanSuccess);
    });

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.clear();
    window.location.href = '../student/login.html';
});
