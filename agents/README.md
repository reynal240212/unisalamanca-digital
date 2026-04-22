# Agentes Python - UniSalamanca Digital

Automatizaciones para la gestión académica del proyecto.

## Requisitos

```bash
pip install pandas openpyxl
```

## Agente de Horarios (`schedule_agent.py`)

Automatiza la carga y validación de horarios académicos, detectando cruces de:
- **Estudiantes** - Un alumno con dos materias al mismo tiempo
- **Aulas** - Dos materias en el mismo salón simultáneamente
- **Profesores** - Un docente con dos clases al mismo tiempo

### Uso

**1. Crear plantilla de horarios:**
```bash
python agents/plantilla_horarios.py
```

**2. Importar y visualizar datos:**
```bash
python -m agents.schedule_agent import --file horarios.xlsx
```

**3. Validar horarios (detectar cruces):**
```bash
python -m agents.schedule_agent validate --file horarios.xlsx
```

**4. Generar reporte de errores:**
```bash
python -m agents.schedule_agent validate --file horarios.xlsx --report json --output errores.json
```

### Formato del archivo Excel/CSV

| Columna | Descripción | Ejemplo |
|---------|-------------|---------|
| estudiante_id | Código único del estudiante | EST001 |
| estudiante_nombre | Nombre completo | Juan Pérez |
| codigo_materia | Código de la materia | MAT101 |
| nombre_materia | Nombre de la materia | Cálculo I |
| programa | Programa académico | Ingeniería |
| semestre | Número de semestre | 1 |
| profesor | Nombre del profesor | Dr. Carlos |
| dia | Día de clase | Lunes |
| hora_inicio | Hora inicio (HH:MM) | 18:00 |
| hora_fin | Hora fin (HH:MM) | 19:45 |
| salon | Aula o salón | A101 |
| periodo | Periodo académico | 2026-1 |

### Ejemplo de integración

```python
from agents import AgenteHorarios

agente = AgenteHorarios()

# Cargar datos
df = pd.read_excel('horarios.xlsx')
agente.parsear_registros(df)

# Validar
errores = agente.validar_todos()

if not errores:
    # Subir a Supabase
    print("✅ Datos válidos para subir")
else:
    # Generar reporte
    reporte = agente.generar_reporte('json')
```

## Próximos agentes

- [ ] `student_agent.py` - Importación masiva de estudiantes
- [ ] `attendance_agent.py` - Automatización de asistencia
- [ ] `report_agent.py` - Generación de reportes académicos
