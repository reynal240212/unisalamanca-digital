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
let editingStudentId = null;

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
        const photoUrl = student.photo_url || '../img/default-avatar.png';
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div class="student-thumb" onclick="showPhotoModal('${photoUrl}', '${student.name}')" title="Ver foto ampliada">
                    <img src="${photoUrl}" onerror="this.src='../img/default-avatar.png'">
                </div>
            </td>
            <td>
                <div class="student-row-info">
                    <span class="student-name">${student.name}</span>
                    <span class="student-sub">${student.email || 'No email'}</span>
                </div>
            </td>
            <td style="color: var(--text-dim); font-size: 0.9rem;">${student.program}</td>
            <td>
                <span class="badge ${student.study_modality === 'PAT' ? 'warning' : 'active'}">
                    ${student.study_modality || 'Presencial'}
                </span>
            </td>
            <td style="font-family: monospace; font-size: 0.8rem; color: var(--text-dim);">${student.id.split('-')[0]}...</td>
            <td>
                <span class="badge ${student.status.toLowerCase()}">${student.status}</span>
            </td>
            <td>
                <div style="display: flex; gap: 8px;">
                    </select>
                    <button class="btn-edit" onclick="openEditModal('${student.id}')">✏️</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Búsqueda y Filtrado Avanzado
const filterInputs = {
    search: document.getElementById('student-search'),
    modality: document.getElementById('filter-modality'),
    status: document.getElementById('filter-status')
};

function applyFilters() {
    const term = filterInputs.search.value.toLowerCase();
    const mod = filterInputs.modality.value;
    const stat = filterInputs.status.value;

    const filtered = allStudents.filter(s => {
        const matchSearch = s.name.toLowerCase().includes(term) || (s.email && s.email.toLowerCase().includes(term));
        const matchMod = mod === 'all' || s.study_modality === mod;
        const matchStat = stat === 'all' || s.status === stat;
        return matchSearch && matchMod && matchStat;
    });

    renderTable(filtered);
}

Object.values(filterInputs).forEach(input => {
    if (input) input.addEventListener('input', applyFilters);
});

document.getElementById('btn-clear-filters').addEventListener('click', () => {
    filterInputs.search.value = '';
    filterInputs.modality.value = 'all';
    filterInputs.status.value = 'all';
    applyFilters();
});

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
async function fetchLogs(selectedDate = null) {
    try {
        const tbody = document.getElementById('logs-table-body');
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px;">Filtrando datos...</td></tr>';

        let query = supabaseClient
            .from('accesslog')
            .select('*, student:user(name, program)')
            .order('timestamp', { ascending: false });

        // Si hay fecha, filtrar por el rango del día
        if (selectedDate) {
            const start = new Date(selectedDate);
            start.setHours(0,0,0,0);
            const end = new Date(selectedDate);
            end.setHours(23,59,59,999);
            
            query = query
                .gte('timestamp', start.toISOString())
                .lte('timestamp', end.toISOString());
        } else {
            // Por defecto, mostrar los últimos 100
            query = query.limit(100);
        }

        const { data: logs, error } = await query;

        if (error) throw error;

        // Enriquecer logs con modalidad si viene del join
        const enrichedLogs = logs.map(log => ({
            ...log,
            modality: log.student ? log.student.study_modality : 'Presencial'
        }));

        renderLogsTable(enrichedLogs);
        
        // Actualizar dashboard reporte
        if (selectedDate) {
            document.getElementById('day-total').innerText = logs.length;
        } else {
            document.getElementById('day-total').innerText = logs.length + " (Recientes)";
        }

    } catch (error) {
        console.error('Error al obtener logs:', error);
        showToast('Error al cargar reportes', 'error');
    }
}

function renderLogsTable(logs) {
    const tbody = document.getElementById('logs-table-body');
    tbody.innerHTML = '';

    if (!logs || logs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No hay registros para este criterio.</td></tr>';
        return;
    }

    logs.forEach(log => {
        const tr = document.createElement('tr');
        const dateObj = new Date(log.timestamp);
        const dateStr = dateObj.toLocaleDateString();
        const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const studentName = log.student ? log.student.name : 'Unknown';
        const studentProgram = log.student ? log.student.program : 'N/A';
        const modality = log.student ? (log.student.study_modality || 'Presencial') : 'N/A';

        tr.innerHTML = `
            <td>
                <div class="student-row-info">
                    <span class="student-name">${studentName}</span>
                    <span class="student-sub">${studentProgram}</span>
                </div>
            </td>
            <td>
                <span class="badge ${modality === 'PAT' ? 'warning' : 'active'}">${modality}</span>
            </td>
            <td>
                <div style="font-weight: 600;">${dateStr}</div>
                <div style="font-size: 0.75rem; color: var(--text-dim);">${timeStr}</div>
            </td>
            <td style="font-size: 0.9rem;">${log.location}</td>
            <td>
                <span class="badge ${log.status === 'Granted' ? 'active' : 'suspended'}">${log.status}</span>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// --- Carga Masiva (Excel/CSV) ---
const btnBulkUpload = document.getElementById('btn-bulk-upload');
const bulkUploadInput = document.getElementById('bulk-upload-input');

if (btnBulkUpload && bulkUploadInput) {
    btnBulkUpload.addEventListener('click', () => bulkUploadInput.click());
    bulkUploadInput.addEventListener('change', handleFileSelect);
}

async function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const students = XLSX.utils.sheet_to_json(firstSheet);

            if (students.length === 0) {
                showToast('El archivo está vacío', 'error');
                return;
            }

            if (confirm(`Se han encontrado ${students.length} estudiantes. ¿Confirmas la carga masiva?`)) {
                await processBulkStudents(students);
            }
        } catch (error) {
            console.error('Error al procesar archivo:', error);
            showToast('Error al leer el archivo Excel', 'error');
        }
        bulkUploadInput.value = ''; // Limpiar input
    };
    reader.readAsArrayBuffer(file);
}

async function processBulkStudents(studentList) {
    showToast('Procesando carga masiva...', 'warning');
    
    // Configuración inicial
    const password = "Salamanca2024"; 
    const salt = dcodeIO.bcrypt.genSaltSync(10);
    const password_hash = dcodeIO.bcrypt.hashSync(password, salt);
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    // Mapeo de datos (Ajustar según encabezados del Excel)
    // Se espera: Nombre, Codigo, Programa, Modalidad
    const batch = studentList.map(s => ({
        id: s.Codigo ? s.Codigo.toString() : undefined, 
        name: s.Nombre || 'Sin Nombre',
        email: s.Email || `${(s.Nombre || 'user').toLowerCase().replace(/\s+/g, '.')}@unisalamanca.edu.co`,
        program: s.Programa || 'Sin Programa',
        study_modality: s.Modalidad || 'Presencial',
        status: 'Active',
        role: 'ESTUDIANTE',
        password_hash: password_hash,
        must_change_password: true,
        expiration_date: expiryDate.toISOString()
    }));

    try {
        const { error } = await supabaseClient
            .from('user')
            .upsert(batch, { onConflict: 'id' });

        if (!error) {
            showToast(`¡Éxito! ${batch.length} estudiantes procesados`, 'success');
            fetchStudents();
        } else {
            showToast(`Error: ${error.message}`, 'error');
        }
    } catch (error) {
        console.error('Error en carga masiva:', error);
        showToast('Error de conexión con la base de datos', 'error');
    }
}

// Filtro de fecha
const filterDateInput = document.getElementById('filter-date');
if (filterDateInput) {
    // Poner fecha de hoy por defecto
    const hoy = new Date().toISOString().split('T')[0];
    filterDateInput.value = hoy;

    filterDateInput.addEventListener('change', (e) => {
        fetchLogs(e.target.value);
    });
}

// --- Modal ---
document.getElementById('btn-open-modal').addEventListener('click', () => {
    editingStudentId = null;
    document.getElementById('modal-title').innerText = "Registrar Nuevo Estudiante";
    studentForm.reset();
    modal.classList.remove('hidden');
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    document.getElementById('expiry').value = nextYear.toISOString().split('T')[0];
});

function openEditModal(studentId) {
    console.log("Abriendo modal para ID:", studentId);
    const student = allStudents.find(s => s.id === studentId);
    if (!student) {
        console.error("Estudiante no encontrado");
        return;
    }

    editingStudentId = studentId;
    document.getElementById('modal-title').innerText = "Editar Estudiante";
    
    // Llenar formulario
    document.getElementById('name').value = student.name || '';
    document.getElementById('email').value = student.email || '';
    document.getElementById('program').value = student.program || '';
    document.getElementById('modality').value = student.study_modality || 'Presencial';
    
    // Check para evitar el error del null en split()
    if (student.expiration_date) {
        document.getElementById('expiry').value = student.expiration_date.split('T')[0];
    } else {
        document.getElementById('expiry').value = '';
    }

    modal.classList.remove('hidden');
}

window.openEditModal = openEditModal;

document.getElementById('btn-close-modal').addEventListener('click', () => modal.classList.add('hidden'));
document.getElementById('btn-cancel').addEventListener('click', () => modal.classList.add('hidden'));

studentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(studentForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const program = formData.get('program');
    const modality = formData.get('modality');
    const expiry = formData.get('expiry');

    if (editingStudentId) {
        // MODO EDICION
        try {
            const { error } = await supabaseClient
                .from('user')
                .update({
                    name: name,
                    email: email,
                    program: program,
                    study_modality: modality,
                    expiration_date: new Date(expiry).toISOString()
                })
                .eq('id', editingStudentId);

            if (!error) {
                showToast('Estudiante actualizado con éxito', 'success');
                modal.classList.add('hidden');
                fetchStudents();
            } else {
                showToast(`Error: ${error.message}`, 'error');
            }
        } catch (error) {
            console.error('Error al editar:', error);
            showToast('Error al conectar con la base de datos', 'error');
        }
    } else {
        // MODO REGISTRO
        const password = "Salamanca2024"; // Contraseña inicial
        const salt = dcodeIO.bcrypt.genSaltSync(10);
        const password_hash = dcodeIO.bcrypt.hashSync(password, salt);

        const studentData = {
            name: name,
            email: email,
            program: program,
            study_modality: modality,
            expiration_date: new Date(expiry).toISOString(),
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
// --- Zoom de Foto ---
function showPhotoModal(url, name) {
    const photoModal = document.getElementById('photo-modal');
    const zoomImg = document.getElementById('zoom-img');
    
    if (!photoModal || !zoomImg) return;

    zoomImg.src = url;
    photoModal.classList.remove('hidden');
    // Prevenir scroll del body
    document.body.style.overflow = 'hidden';
}

function closePhotoModal() {
    const photoModal = document.getElementById('photo-modal');
    if (photoModal) {
        photoModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

// Cerrar modal con la tecla Esc
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closePhotoModal();
        if (!modal.classList.contains('hidden')) closeModal();
    }
});
