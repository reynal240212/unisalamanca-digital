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
// --- Auxiliares ---
const CAMPUS_COORDS = { lat: 11.0028, lon: -74.8081 };

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Radio de la Tierra en metros
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distancia en metros
}

function getCoordinates() {
    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            resolve("Dispositivo sin GPS");
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const dist = calculateDistance(pos.coords.latitude, pos.coords.longitude, CAMPUS_COORDS.lat, CAMPUS_COORDS.lon);
                if (dist <= 500) {
                    resolve("Sede Principal (Cra 50 #79-155)");
                } else {
                    resolve(`Ubicación Remota (Lat: ${pos.coords.latitude.toFixed(4)}, Lon: ${pos.coords.longitude.toFixed(4)})`);
                }
            },
            (err) => resolve("Ubicación No Autorizada"),
            { timeout: 5000 }
        );
    });
}

async function verifyAccess(qrToken) {
    try {
        console.log("Verificando QR Dinámico:", qrToken);
        
        // 1. Validar Formato y Tiempo (Prevención de Fraude)
        if (!qrToken.startsWith('UNIS|')) {
            showDenied("Código Inválido", "El formato del código QR no es oficial o ha sido alterado.");
            return;
        }

        const parts = qrToken.split('|');
        if (parts.length < 3) {
            showDenied("Código Corrupto", "El código no contiene la información necesaria.");
            return;
        }

        const [prefix, studentId, timeBlock] = parts;
        const currentTimeBlock = Math.floor(Date.now() / 30000);
        
        // Tolerancia de ±1 bloque (60s total) para evitar fallos por desfase de reloj
        if (Math.abs(currentTimeBlock - parseInt(timeBlock)) > 1) {
            showDenied("Código Expirado", "Este código QR ha caducado. Por favor, refresca tu carnet.");
            return;
        }

        // 2. Consulta de Seguridad en Supabase (Verificar Token y Usuario)
        const { data: credential, error } = await supabaseClient
            .from('credential')
            .select('*, student:user!user_id(name, program, photo_url, status)')
            .eq('token', qrToken)
            .single();

        if (error || !credential) {
            showDenied("Token No Registrado", "El código es válido pero no ha sido registrado por el sistema.");
            return;
        }

        // 3. Verificar estado del ESTUDIANTE
        if (credential.student.status !== 'Active') {
            showDenied("Acceso Restringido", `El ESTUDIANTE ${credential.student.name} tiene un estado: ${credential.student.status}`);
            return;
        }

        // 4. Registro y Feedback
        const locationWithCoords = await getCoordinates();
        
        supabaseClient.from('accesslog').insert({
            user_id: credential.user_id,
            location: locationWithCoords,
            status: "Granted"
        }).then();

        showGranted(credential.student);

    } catch (err) {
        console.error(err);
        showDenied("Error de Sistema", "No se pudo completar la validación en este momento.");
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
