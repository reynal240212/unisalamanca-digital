// Admin Settings
// 0. Bloquear Retroceso
history.pushState(null, null, location.href);
window.onpopstate = function () {
    history.go(1);
};

// Verificar Sesión Admin
const token = localStorage.getItem('auth_token');
const userRole = localStorage.getItem('user_role');

if (!token || userRole !== 'ADMIN') {
    window.location.replace('../login.html');
}

// Estado global simple
let allStudents = [];

// Elementos del DOM
const menuItems = {
    students: document.getElementById('menu-students'),
    reports: document.getElementById('menu-reports'),
    settings: document.getElementById('menu-settings')
};

const views = {
    students: document.getElementById('students-view'),
    reports: document.getElementById('reports-view'),
    settings: document.getElementById('settings-view')
};

const modal = document.getElementById('student-modal');
const studentForm = document.getElementById('student-form');
const searchInput = document.getElementById('student-search');

// --- Navegación ---
function switchView(viewName) {
    // Actualizar menú
    Object.values(menuItems).forEach(item => item.classList.remove('active'));
    menuItems[viewName].classList.add('active');

    // Actualizar vistas
    Object.values(views).forEach(view => view.classList.add('hidden'));
    views[viewName].classList.remove('hidden');

    // Cargar datos según la vista
    if (viewName === 'students') fetchStudents();
    if (viewName === 'reports') fetchLogs();
}

menuItems.students.addEventListener('click', () => switchView('students'));
menuItems.reports.addEventListener('click', () => switchView('reports'));
menuItems.settings.addEventListener('click', () => switchView('settings'));

// --- Gestión de Estudiantes ---
async function fetchStudents() {
    try {
        // Consulta directa a Supabase
        const { data: students, error } = await supabaseClient
            .from('user')
            .select('*')
            .eq('role', 'ESTUDIANTE')
            .order('name');

        if (error) throw error;

        allStudents = students;
        renderTable(allStudents);
        updateStats(allStudents);
    } catch (error) {
        console.error('Error al obtener estudiantes:', error);
        showToast('Error al conectar con Supabase', 'error');
    }
}

function renderTable(students) {
    const tbody = document.getElementById('student-table-body');
    tbody.innerHTML = '';

    if (students.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-state">
                    <div style="font-size: 2rem; margin-bottom: 10px;">🔍</div>
                    <p>No se encontraron estudiantes para la búsqueda.</p>
                </td>
            </tr>
        `;
        return;
    }

    students.forEach(student => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div class="student-thumb">
                    <img src="${student.photo_url || '../student/img/default-avatar.png'}" onerror="this.src='../student/img/default-avatar.png'">
                </div>
            </td>
            <td style="font-weight: 600;">${student.name}</td>
            <td style="color: var(--text-dim);">${student.program}</td>
            <td style="font-family: monospace; font-size: 0.8rem;">${student.id.split('-')[0]}...</td>
            <td>
                <span class="badge ${student.status.toLowerCase()}">${student.status}</span>
            </td>
            <td>
                <select class="action-select" onchange="handleStatusChange('${student.id}', this.value, '${student.name}')">
                    <option value="" disabled selected>Acciones</option>
                    <option value="Active">Activar</option>
                    <option value="Suspended">Suspender</option>
                    <option value="Revoked">Revocar</option>
                </select>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Búsqueda en tiempo real
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = allStudents.filter(s => 
            s.name.toLowerCase().includes(term) || 
            s.program.toLowerCase().includes(term)
        );
        renderTable(filtered);
    });
}

async function handleStatusChange(studentId, newStatus, studentName) {
    if (confirm(`¿Estás seguro de cambiar el estado de ${studentName} a ${newStatus}?`)) {
        await updateStatus(studentId, newStatus);
    } else {
        // Reset select (opcional, fetchStudents lo hará de todos modos)
        fetchStudents();
    }
}

async function updateStatus(studentId, newStatus) {
    try {
        const { error } = await supabaseClient
            .from('user')
            .update({ status: newStatus })
            .eq('id', studentId);
        
        if (!error) {
            showToast('Estado actualizado correctamente', 'success');
            fetchStudents();
        } else {
            showToast(`Error: ${error.message}`, 'error');
        }
    } catch (error) {
        console.error('Error al actualizar estado:', error);
        showToast('Error de conexión', 'error');
    }
}

function updateStats(students) {
    document.getElementById('total-students').innerText = students.length;
    document.getElementById('active-students').innerText = students.filter(s => s.status === 'Active').length;
    document.getElementById('suspended-students').innerText = students.filter(s => s.status === 'Suspended').length;
}

// --- Reportes ---
async function fetchLogs() {
    try {
        const { data: logs, error } = await supabaseClient
            .from('accesslog')
            .select('*')
            .order('timestamp', { ascending: false })
            .limit(100);

        if (error) throw error;
        renderLogsTable(logs);
    } catch (error) {
        console.error('Error al obtener logs:', error);
    }
}

function renderLogsTable(logs) {
    const tbody = document.getElementById('logs-table-body');
    tbody.innerHTML = '';

    if (!logs || logs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="empty-state">No hay registros de acceso aún.</td></tr>';
        return;
    }

    logs.forEach(log => {
        const tr = document.createElement('tr');
        const date = new Date(log.timestamp).toLocaleString();
        tr.innerHTML = `
            <td style="font-family: monospace; font-size: 0.8rem;">${log.user_id.split('-')[0]}...</td>
            <td>${date}</td>
            <td>${log.location}</td>
            <td>
                <span class="badge ${log.status === 'Granted' ? 'active' : 'suspended'}">${log.status}</span>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// --- Modal ---
document.getElementById('btn-open-modal').addEventListener('click', () => {
    modal.classList.remove('hidden');
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    document.getElementById('expiry').value = nextYear.toISOString().split('T')[0];
});

document.getElementById('btn-close-modal').addEventListener('click', () => modal.classList.add('hidden'));
document.getElementById('btn-cancel').addEventListener('click', () => modal.classList.add('hidden'));

studentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(studentForm);
    const password = "Salamanca2024"; // Contraseña inicial
    const salt = dcodeIO.bcrypt.genSaltSync(10);
    const password_hash = dcodeIO.bcrypt.hashSync(password, salt);

    const studentData = {
        name: formData.get('name'),
        email: `${formData.get('name').toLowerCase().replace(/\s+/g, '.')}@unisalamanca.edu.co`,
        program: formData.get('program'),
        expiration_date: new Date(formData.get('expiry')).toISOString(),
        status: 'Active',
        role: 'ESTUDIANTE',
        password_hash: password_hash,
        must_change_password: true
    };

    try {
        const { error } = await supabaseClient
            .from('user')
            .insert(studentData);

        if (!error) {
            showToast('Estudiante registrado con éxito', 'success');
            modal.classList.add('hidden');
            studentForm.reset();
            fetchStudents();
        } else {
            showToast(`Error: ${error.message}`, 'error');
        }
    } catch (error) {
        console.error('Error al guardar:', error);
        showToast('Error al guardar el estudiante', 'error');
    }
});

// --- Toast System ---
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = '✅';
    if (type === 'error') icon = '❌';
    if (type === 'warning') icon = '⚠️';

    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <span class="toast-message">${message}</span>
    `;

    container.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Remove after 3s
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// --- Logout ---
const btnLogout = document.getElementById('btn-logout');
if (btnLogout) {
    btnLogout.addEventListener('click', async () => {
        try {
            await supabaseClient.auth.signOut();
        } catch (e) {
            console.error("Error signing out:", e);
        }
        localStorage.clear();
        showToast('Sesión cerrada correctamente', 'warning');
        setTimeout(() => {
            window.location.replace('../login.html');
        }, 1000);
    });
}

// Cargar al inicio
fetchStudents();
