"""
Prueba del Agente de Horarios - UniSalamanca
============================================

Este script prueba la detección de cruces de horarios.
"""

import pandas as pd
import sys

sys.path.insert(0, ".")

from agents.schedule_agent import AgenteHorarios


def test_deteccion_cruces():
    """Prueba la detección de cruces."""

    datos = [
        # Estudiante 1 - SIN cruces (debería pasar)
        {
            "estudiante_id": "EST001",
            "estudiante_nombre": "Juan Pérez",
            "codigo_materia": "MAT101",
            "nombre_materia": "Cálculo I",
            "programa": "Ing. Sistemas",
            "semestre": 1,
            "profesor": "Dr. López",
            "dia": "Lunes",
            "hora_inicio": "18:00",
            "hora_fin": "19:45",
            "salon": "A101",
            "periodo": "2026-1",
        },
        {
            "estudiante_id": "EST001",
            "estudiante_nombre": "Juan Pérez",
            "codigo_materia": "FIS101",
            "nombre_materia": "Física I",
            "programa": "Ing. Sistemas",
            "semestre": 1,
            "profesor": "Dra. Gómez",
            "dia": "Martes",
            "hora_inicio": "18:00",
            "hora_fin": "19:45",
            "salon": "B202",
            "periodo": "2026-1",
        },
        # Estudiante 2 - CON CRUCE de estudiante (debería fallar)
        {
            "estudiante_id": "EST002",
            "estudiante_nombre": "Ana García",
            "codigo_materia": "MAT101",
            "nombre_materia": "Cálculo I",
            "programa": "Ing. Sistemas",
            "semestre": 1,
            "profesor": "Dr. López",
            "dia": "Lunes",
            "hora_inicio": "18:00",
            "hora_fin": "19:45",
            "salon": "A101",
            "periodo": "2026-1",
        },
        {
            "estudiante_id": "EST002",
            "estudiante_nombre": "Ana García",
            "codigo_materia": "PRO101",
            "nombre_materia": "Programación I",
            "programa": "Ing. Sistemas",
            "semestre": 1,
            "profesor": "Ing. Díaz",
            "dia": "Lunes",
            "hora_inicio": "18:30",
            "hora_fin": "20:00",  # ¡CRUCE!
            "salon": "LAB01",
            "periodo": "2026-1",
        },
        # Cruce de aula
        {
            "estudiante_id": "EST003",
            "estudiante_nombre": "Carlos Ruiz",
            "codigo_materia": "MAT101",
            "nombre_materia": "Cálculo I",
            "programa": "Ing. Sistemas",
            "semestre": 1,
            "profesor": "Dr. López",
            "dia": "Miércoles",
            "hora_inicio": "18:00",
            "hora_fin": "19:45",
            "salon": "A101",
            "periodo": "2026-1",
        },
        {
            "estudiante_id": "EST004",
            "estudiante_nombre": "María Torres",
            "codigo_materia": "EST101",
            "nombre_materia": "Estadística",
            "programa": "Ing. Sistemas",
            "semestre": 1,
            "profesor": "Dr. Pérez",
            "dia": "Miércoles",
            "hora_inicio": "18:30",
            "hora_fin": "20:00",  # ¡CRUCE EN AULA!
            "salon": "A101",
            "periodo": "2026-1",
        },
        # Cruce de profesor
        {
            "estudiante_id": "EST005",
            "estudiante_nombre": "Pedro Jiménez",
            "codigo_materia": "MAT101",
            "nombre_materia": "Cálculo I",
            "programa": "Ing. Sistemas",
            "semestre": 1,
            "profesor": "Dr. López",
            "dia": "Jueves",
            "hora_inicio": "18:00",
            "hora_fin": "19:45",
            "salon": "C303",
            "periodo": "2026-1",
        },
        {
            "estudiante_id": "EST006",
            "estudiante_nombre": "Laura Díaz",
            "codigo_materia": "MAT201",
            "nombre_materia": "Cálculo II",
            "programa": "Ing. Sistemas",
            "semestre": 2,
            "profesor": "Dr. López",
            "dia": "Jueves",
            "hora_inicio": "18:30",
            "hora_fin": "20:00",  # ¡CRUCE DE PROFESOR!
            "salon": "D404",
            "periodo": "2026-1",
        },
    ]

    df = pd.DataFrame(datos)
    agente = AgenteHorarios()
    agente.parsear_registros(df)

    print("=" * 60)
    print("🧪 PRUEBA DE DETECCIÓN DE CRUCES")
    print("=" * 60)
    print(f"\n📊 {len(agente.registros)} registros cargados\n")

    errores = agente.validar_todos()
    reporte = agente.generar_reporte()
    print(reporte)

    print("\n" + "=" * 60)
    tipos_encontrados = set(e.tipo for e in errores)
    if (
        "estudiante" in tipos_encontrados
        and "aula" in tipos_encontrados
        and "profesor" in tipos_encontrados
    ):
        print("✅ PRUEBA EXITOSA: Se detectaron cruces de todos los tipos")
        print(
            f"   - {len([e for e in errores if e.tipo == 'estudiante'])} cruce(s) de estudiante"
        )
        print(f"   - {len([e for e in errores if e.tipo == 'aula'])} cruce(s) de aula")
        print(
            f"   - {len([e for e in errores if e.tipo == 'profesor'])} cruce(s) de profesor"
        )
        return True
    else:
        print(
            f"❌ PRUEBA FALLIDA: Faltan tipos de cruce. Encontrados: {tipos_encontrados}"
        )
        return False


def test_sin_cruces():
    """Prueba con datos sin cruces."""

    datos = [
        {
            "estudiante_id": "EST001",
            "estudiante_nombre": "Test User",
            "codigo_materia": "MAT101",
            "nombre_materia": "Cálculo I",
            "programa": "Ing.",
            "semestre": 1,
            "profesor": "Prof A",
            "dia": "Lunes",
            "hora_inicio": "18:00",
            "hora_fin": "19:45",
            "salon": "A101",
            "periodo": "2026-1",
        },
        {
            "estudiante_id": "EST001",
            "estudiante_nombre": "Test User",
            "codigo_materia": "MAT101",
            "nombre_materia": "Cálculo I",
            "programa": "Ing.",
            "semestre": 1,
            "profesor": "Prof A",
            "dia": "Miércoles",
            "hora_inicio": "18:00",
            "hora_fin": "19:45",
            "salon": "A101",
            "periodo": "2026-1",
        },
    ]

    df = pd.DataFrame(datos)
    agente = AgenteHorarios()
    agente.parsear_registros(df)
    errores = agente.validar_todos()

    if len(errores) == 0:
        print("✅ Sin cruces: validación correcta")
        return True
    else:
        print(f"❌ Error: se detectaron cruces inexistentes: {errores}")
        return False


if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("TEST 1: Detección de cruces")
    print("=" * 60)
    test1 = test_deteccion_cruces()

    print("\n" + "=" * 60)
    print("TEST 2: Sin cruces")
    print("=" * 60)
    test2 = test_sin_cruces()

    print("\n" + "=" * 60)
    if test1 and test2:
        print("🎉 TODAS LAS PRUEBAS PASARON")
    else:
        print("⚠️  ALGUNAS PRUEBAS FALLARON")
    print("=" * 60)
