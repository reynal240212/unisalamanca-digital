"""
UniSalamanca - Plantilla de Horarios
====================================

Instrucciones:
1. Copia este archivo y renómbralo con el periodo (ej: horarios_2026-1.xlsx)
2. Completa los datos siguiendo las columnas indicadas
3. Ejecuta la validación: python -m agents.schedule_agent validate --file horarios_2026-1.xlsx

Columnas requeridas:
- estudiante_id: Código único del estudiante (ej: EST001)
- estudiante_nombre: Nombre completo
- codigo_materia: Código de la materia (ej: MAT101)
- nombre_materia: Nombre de la materia
- programa: Programa académico
- semestre: Número de semestre
- profesor: Nombre del profesor
- dia: Día de la clase (Lunes, Martes, Miércoles, Jueves, Viernes)
- hora_inicio: Hora de inicio (formato 24h, ej: 18:00)
- hora_fin: Hora de fin (formato 24h, ej: 19:45)
- salon: Aula o salón
- periodo: Periodo académico (ej: 2026-1)
"""

import pandas as pd
from datetime import time

datos = [
    {
        "estudiante_id": "EST001",
        "estudiante_nombre": "Juan Pérez García",
        "codigo_materia": "MAT101",
        "nombre_materia": "Cálculo I",
        "programa": "Ingeniería de Sistemas",
        "semestre": 1,
        "profesor": "Dr. Carlos López",
        "dia": "Lunes",
        "hora_inicio": "18:00",
        "hora_fin": "19:45",
        "salon": "A101",
        "periodo": "2026-1",
    },
    {
        "estudiante_id": "EST001",
        "estudiante_nombre": "Juan Pérez García",
        "codigo_materia": "MAT101",
        "nombre_materia": "Cálculo I",
        "programa": "Ingeniería de Sistemas",
        "semestre": 1,
        "profesor": "Dr. Carlos López",
        "dia": "Miércoles",
        "hora_inicio": "18:00",
        "hora_fin": "19:45",
        "salon": "A101",
        "periodo": "2026-1",
    },
    {
        "estudiante_id": "EST001",
        "estudiante_nombre": "Juan Pérez García",
        "codigo_materia": "FIS101",
        "nombre_materia": "Física General",
        "programa": "Ingeniería de Sistemas",
        "semestre": 1,
        "profesor": "Dra. María Gómez",
        "dia": "Martes",
        "hora_inicio": "18:00",
        "hora_fin": "19:45",
        "salon": "B202",
        "periodo": "2026-1",
    },
    {
        "estudiante_id": "EST001",
        "estudiante_nombre": "Juan Pérez García",
        "codigo_materia": "FIS101",
        "nombre_materia": "Física General",
        "programa": "Ingeniería de Sistemas",
        "semestre": 1,
        "profesor": "Dra. María Gómez",
        "dia": "Jueves",
        "hora_inicio": "18:00",
        "hora_fin": "19:45",
        "salon": "B202",
        "periodo": "2026-1",
    },
    {
        "estudiante_id": "EST002",
        "estudiante_nombre": "Ana Martínez López",
        "codigo_materia": "MAT101",
        "nombre_materia": "Cálculo I",
        "programa": "Ingeniería de Sistemas",
        "semestre": 1,
        "profesor": "Dr. Carlos López",
        "dia": "Lunes",
        "hora_inicio": "18:00",
        "hora_fin": "19:45",
        "salon": "A101",
        "periodo": "2026-1",
    },
    {
        "estudiante_id": "EST002",
        "estudiante_nombre": "Ana Martínez López",
        "codigo_materia": "PRO101",
        "nombre_materia": "Programación I",
        "programa": "Ingeniería de Sistemas",
        "semestre": 1,
        "profesor": "Ing. Roberto Díaz",
        "dia": "Viernes",
        "hora_inicio": "18:00",
        "hora_fin": "19:45",
        "salon": "LAB01",
        "periodo": "2026-1",
    },
]

if __name__ == "__main__":
    df = pd.DataFrame(datos)
    df.to_excel("plantilla_horarios.xlsx", index=False)
    print("✅ Plantilla creada: plantilla_horarios.xlsx")
