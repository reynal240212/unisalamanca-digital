"""
UniSalamanca - Agente de Gestión de Horarios
============================================
Automatiza la carga de horarios evitando errores humanos y cruces de materias.

Uso:
    python -m agents.schedule_agent --help
    python -m agents.schedule_agent import --file horarios.xlsx
    python -m agents.schedule_agent validate --file horarios.xlsx
    python -m agents.schedule_agent upload --file horarios.xlsx
"""

import os
import sys
import json
import argparse
from datetime import datetime, time
from dataclasses import dataclass, field
from typing import Optional
from pathlib import Path

try:
    import pandas as pd
except ImportError:
    print("Error: pandas requerido. Ejecuta: pip install pandas openpyxl")
    sys.exit(1)


@dataclass
class BloqueHorario:
    dia: str
    hora_inicio: str
    hora_fin: str
    salon: str = ""

    def overlaps(self, other: "BloqueHorario") -> bool:
        if self.dia != other.dia:
            return False

        def time_to_minutes(t: str) -> int:
            h, m = map(int, t.replace(":", " ").split()[:2])
            return h * 60 + m

        return not (
            time_to_minutes(self.hora_fin) <= time_to_minutes(other.hora_inicio)
            or time_to_minutes(other.hora_fin) <= time_to_minutes(self.hora_inicio)
        )


@dataclass
class Materia:
    codigo: str
    nombre: str
    programa: str
    semestre: int
    creditos: int
    profesor: str
    bloques: list = field(default_factory=list)

    def add_bloque(self, bloque: BloqueHorario):
        self.bloques.append(bloque)


@dataclass
class RegistroHorario:
    estudiante_id: str
    estudiante_nombre: str
    codigo_materia: str
    nombre_materia: str
    programa: str
    semestre: int
    profesor: str
    dia: str
    hora_inicio: str
    hora_fin: str
    salon: str
    periodo: str


@dataclass
class ErrorCruce:
    tipo: str  # 'estudiante', 'aula', 'profesor'
    entidad: str
    materia1: str
    materia2: str
    dia: str
    hora_inicio: str
    hora_fin: str
    mensaje: str


class AgenteHorarios:
    DIAS_VALIDOS = [
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
        "Domingo",
    ]
    DIAS_CORTOS = {
        "L": "Lunes",
        "M": "Martes",
        "X": "Miércoles",
        "J": "Jueves",
        "V": "Viernes",
        "S": "Sábado",
        "D": "Domingo",
    }

    def __init__(self, supabase_url: str = None, supabase_key: str = None):
        self.supabase_url = supabase_url or os.getenv("SUPABASE_URL")
        self.supabase_key = supabase_key or os.getenv("SUPABASE_ANON_KEY")
        self.registros: list[RegistroHorario] = []
        self.materias: dict[str, Materia] = {}
        self.errores: list[ErrorCruce] = []

    def cargar_desde_excel(self, filepath: str) -> pd.DataFrame:
        """Carga horarios desde archivo Excel o CSV."""
        print(f"📂 Cargando archivo: {filepath}")

        if filepath.endswith(".csv"):
            df = pd.read_csv(filepath)
        else:
            df = pd.read_excel(filepath)

        print(f"   ✓ {len(df)} registros encontrados")
        return df

    def normalizar_dia(self, dia: str) -> str:
        """Convierte día a formato estándar."""
        dia = str(dia).strip()
        if dia in self.DIAS_VALIDOS:
            return dia
        if dia in self.DIAS_CORTOS:
            return self.DIAS_CORTOS[dia]
        if len(dia) == 1 and dia.upper() in self.DIAS_CORTOS:
            return self.DIAS_CORTOS[dia.upper()]
        return dia

    def normalizar_hora(self, hora) -> str:
        """Convierte hora a formato HH:MM."""
        if pd.isna(hora):
            return ""
        if isinstance(hora, str):
            hora = hora.strip()
            if ":" not in hora:
                return f"{hora}:00"
            return hora
        if isinstance(hora, datetime):
            return hora.strftime("%H:%M")
        return str(hora)

    def parsear_registros(self, df: pd.DataFrame) -> list[RegistroHorario]:
        """Convierte DataFrame a registros estructurados."""
        columnas = df.columns.tolist()
        print(f"\n📋 Columnas detectadas: {columnas}")

        mappings = self._detectar_columnas(columnas)
        print(f"   Mapeo: {mappings}")

        registros = []
        for idx, row in df.iterrows():
            try:
                registro = RegistroHorario(
                    estudiante_id=str(
                        row.get(mappings["estudiante_id"], f"EST{idx + 1:04d}")
                    ),
                    estudiante_nombre=str(
                        row.get(
                            mappings.get("estudiante_nombre", "Nombre"),
                            f"Estudiante {idx + 1}",
                        )
                    ),
                    codigo_materia=str(row.get(mappings["codigo"], idx + 1)).strip(),
                    nombre_materia=str(
                        row.get(mappings["nombre_materia"], f"Materia {idx + 1}")
                    ).strip(),
                    programa=str(
                        row.get(mappings.get("programa", "General"), "General")
                    ).strip(),
                    semestre=int(row.get(mappings.get("semestre", 1), 1)),
                    profesor=str(
                        row.get(mappings.get("profesor", "Sin asignar"), "Sin asignar")
                    ).strip(),
                    dia=self.normalizar_dia(
                        row.get(mappings.get("dia", "Lunes"), "Lunes")
                    ),
                    hora_inicio=self.normalizar_hora(
                        row.get(mappings.get("hora_inicio", "18:00"), "18:00")
                    ),
                    hora_fin=self.normalizar_hora(
                        row.get(mappings.get("hora_fin", "19:45"), "19:45")
                    ),
                    salon=str(row.get(mappings.get("salon", "A101"), "A101")).strip(),
                    periodo=str(
                        row.get(mappings.get("periodo", "2026-1"), "2026-1")
                    ).strip(),
                )
                registros.append(registro)
            except Exception as e:
                print(f"   ⚠ Error en fila {idx + 2}: {e}")

        self.registros = registros
        return registros

    def _detectar_columnas(self, columnas: list) -> dict:
        """Detecta automáticamente las columnas del archivo."""
        mapping = {}
        lower_cols = {c.lower().strip(): c for c in columnas}

        patrones = {
            "estudiante_id": [
                "estudiante_id",
                "id",
                "student_id",
                "codigo estudiante",
            ],
            "estudiante_nombre": [
                "estudiante_nombre",
                "nombre",
                "estudiante",
                "student_name",
                "nombre completo",
            ],
            "codigo": ["codigo_materia", "codigo", "código", "code", "id materia"],
            "nombre_materia": ["nombre_materia", "materia", "subject", "asignatura"],
            "programa": ["programa", "program", "carrera", "facultad"],
            "semestre": ["semestre", "semester", "nivel", "periodo académico"],
            "profesor": ["profesor", "teacher", "docente", "instructor"],
            "dia": ["dia", "día", "day"],
            "hora_inicio": ["hora inicio", "hora_inicio", "start", "inicio"],
            "hora_fin": ["hora fin", "hora_fin", "end", "fin"],
            "salon": ["salon", "salón", "aula", "classroom", "room"],
            "periodo": ["periodo", "period"],
        }

        for key, variants in patrones.items():
            for variant in variants:
                if variant in lower_cols:
                    mapping[key] = lower_cols[variant]
                    break

        if "codigo" not in mapping:
            mapping["codigo"] = columnas[0] if columnas else "Código"
        if "nombre_materia" not in mapping:
            mapping["nombre_materia"] = columnas[1] if len(columnas) > 1 else "Materia"
        if "dia" not in mapping:
            mapping["dia"] = columnas[2] if len(columnas) > 2 else "Día"

        return mapping

    def detectar_cruces_estudiante(self) -> list[ErrorCruce]:
        """Detecta cruces de horarios para el mismo estudiante."""
        print("\n🔍 Detectando cruces de horarios por estudiante...")

        from collections import defaultdict

        por_estudiante = defaultdict(list)

        for reg in self.registros:
            por_estudiante[reg.estudiante_id].append(reg)

        errores = []
        for est_id, registros in por_estudiante.items():
            bloques_por_dia = defaultdict(list)

            for reg in registros:
                bloques_por_dia[reg.dia].append(
                    BloqueHorario(reg.dia, reg.hora_inicio, reg.hora_fin, reg.salon)
                )

            for dia, bloques in bloques_por_dia.items():
                for i, b1 in enumerate(bloques):
                    for b2 in bloques[i + 1 :]:
                        if b1.overlaps(b2):
                            est_nombre = next(
                                (
                                    r.estudiante_nombre
                                    for r in self.registros
                                    if r.estudiante_id == est_id
                                ),
                                est_id,
                            )
                            errores.append(
                                ErrorCruce(
                                    tipo="estudiante",
                                    entidad=est_nombre,
                                    materia1=next(
                                        (
                                            r.nombre_materia
                                            for r in registros
                                            if r.dia == dia
                                            and r.hora_inicio == b1.hora_inicio
                                        ),
                                        "Materia 1",
                                    ),
                                    materia2=next(
                                        (
                                            r.nombre_materia
                                            for r in registros
                                            if r.dia == dia
                                            and r.hora_inicio == b2.hora_inicio
                                        ),
                                        "Materia 2",
                                    ),
                                    dia=dia,
                                    hora_inicio=b1.hora_inicio,
                                    hora_fin=b1.hora_fin,
                                    mensaje=f"Cruce detected: {b1.hora_inicio}-{b1.hora_fin}",
                                )
                            )

        self.errores.extend(errores)
        print(f"   ⚠ {len(errores)} cruces encontrados")
        return errores

    def detectar_cruces_aula(self) -> list[ErrorCruce]:
        """Detecta cruces de horarios en el mismo aula."""
        print("\n🏫 Detectando cruces de horarios por aula...")

        from collections import defaultdict

        por_aula = defaultdict(list)

        for reg in self.registros:
            if reg.salon:
                key = f"{reg.salon}"
                por_aula[key].append(reg)

        errores = []
        for aula, registros in por_aula.items():
            bloques_por_dia = defaultdict(list)

            for reg in registros:
                bloques_por_dia[reg.dia].append(
                    BloqueHorario(reg.dia, reg.hora_inicio, reg.hora_fin, reg.salon)
                )

            for dia, bloques in bloques_por_dia.items():
                for i, b1 in enumerate(bloques):
                    for b2 in bloques[i + 1 :]:
                        if b1.overlaps(b2):
                            errores.append(
                                ErrorCruce(
                                    tipo="aula",
                                    entidad=aula,
                                    materia1=next(
                                        (
                                            r.nombre_materia
                                            for r in registros
                                            if r.dia == dia
                                            and r.hora_inicio == b1.hora_inicio
                                        ),
                                        "Materia 1",
                                    ),
                                    materia2=next(
                                        (
                                            r.nombre_materia
                                            for r in registros
                                            if r.dia == dia
                                            and r.hora_inicio == b2.hora_inicio
                                        ),
                                        "Materia 2",
                                    ),
                                    dia=dia,
                                    hora_inicio=b1.hora_inicio,
                                    hora_fin=b1.hora_fin,
                                    mensaje=f"Aula {aula} ocupada por dos materias",
                                )
                            )

        self.errores.extend(errores)
        print(f"   ⚠ {len(errores)} cruces encontrados")
        return errores

    def detectar_cruces_profesor(self) -> list[ErrorCruce]:
        """Detecta cruces de horarios para el mismo profesor."""
        print("\n👨‍🏫 Detectando cruces de horarios por profesor...")

        from collections import defaultdict

        por_profesor = defaultdict(list)

        for reg in self.registros:
            if reg.profesor and reg.profesor != "Sin asignar":
                por_profesor[reg.profesor].append(reg)

        errores = []
        for profesor, registros in por_profesor.items():
            bloques_por_dia = defaultdict(list)

            for reg in registros:
                bloques_por_dia[reg.dia].append(
                    BloqueHorario(reg.dia, reg.hora_inicio, reg.hora_fin, reg.salon)
                )

            for dia, bloques in bloques_por_dia.items():
                for i, b1 in enumerate(bloques):
                    for b2 in bloques[i + 1 :]:
                        if b1.overlaps(b2):
                            errores.append(
                                ErrorCruce(
                                    tipo="profesor",
                                    entidad=profesor,
                                    materia1=next(
                                        (
                                            r.nombre_materia
                                            for r in registros
                                            if r.dia == dia
                                            and r.hora_inicio == b1.hora_inicio
                                        ),
                                        "Materia 1",
                                    ),
                                    materia2=next(
                                        (
                                            r.nombre_materia
                                            for r in registros
                                            if r.dia == dia
                                            and r.hora_inicio == b2.hora_inicio
                                        ),
                                        "Materia 2",
                                    ),
                                    dia=dia,
                                    hora_inicio=b1.hora_inicio,
                                    hora_fin=b1.hora_fin,
                                    mensaje=f"Profesor {profesor} con dos clases simultáneas",
                                )
                            )

        self.errores.extend(errores)
        print(f"   ⚠ {len(errores)} cruces encontrados")
        return errores

    def validar_todos(self) -> list[ErrorCruce]:
        """Ejecuta todas las validaciones."""
        self.errores = []

        print("\n" + "=" * 60)
        print("🔬 VALIDACIÓN COMPLETA DE HORARIOS")
        print("=" * 60)

        self.detectar_cruces_estudiante()
        self.detectar_cruces_aula()
        self.detectar_cruces_profesor()

        print("\n" + "-" * 60)
        print(f"📊 RESUMEN: {len(self.errores)} errores totales")
        print("-" * 60)

        if self.errores:
            print("\n⚠️  NO SE RECOMIENDA SUBIR DATOS CON ERRORES")
            print("   Corrige los conflictos antes de continuar.")
        else:
            print("\n✅ ¡Sin errores! Los horarios pueden subirse.")

        return self.errores

    def generar_reporte(self, formato: str = "terminal") -> str:
        """Genera un reporte de errores."""
        if not self.errores:
            return "✅ No hay errores que reportar."

        if formato == "json":
            return json.dumps(
                [
                    {
                        "tipo": e.tipo,
                        "entidad": e.entidad,
                        "materia1": e.materia1,
                        "materia2": e.materia2,
                        "dia": e.dia,
                        "hora": f"{e.hora_inicio}-{e.hora_fin}",
                        "mensaje": e.mensaje,
                    }
                    for e in self.errores
                ],
                indent=2,
                ensure_ascii=False,
            )

        elif formato == "csv":
            lines = [
                "Tipo,Entidad,Materia 1,Materia 2,Dia,Hora Inicio,Hora Fin,Detalle"
            ]
            for e in self.errores:
                lines.append(
                    f'{e.tipo},"{e.entidad}","{e.materia1}","{e.materia2}","{e.dia}","{e.hora_inicio}","{e.hora_fin}","{e.mensaje}"'
                )
            return "\n".join(lines)

        else:
            from collections import defaultdict

            lines = []
            por_tipo = defaultdict(list)
            for e in self.errores:
                por_tipo[e.tipo].append(e)

            for tipo, errores in por_tipo.items():
                lines.append(f"\n📌 {tipo.upper()}S ({len(errores)} errores)")
                lines.append("-" * 50)
                for e in errores:
                    lines.append(f"   • {e.entidad}")
                    lines.append(f"     {e.materia1} ↔ {e.materia2}")
                    lines.append(f"     {e.dia} {e.hora_inicio}-{e.hora_fin}")

            return "\n".join(lines)

    def exportar_csv_limpio(self, output_path: str):
        """Exporta los registros a CSV."""
        if not self.registros:
            print("⚠ No hay registros para exportar")
            return

        datos = [
            {
                "estudiante_id": r.estudiante_id,
                "estudiante_nombre": r.estudiante_nombre,
                "codigo_materia": r.codigo_materia,
                "nombre_materia": r.nombre_materia,
                "programa": r.programa,
                "semestre": r.semestre,
                "profesor": r.profesor,
                "dia": r.dia,
                "hora_inicio": r.hora_inicio,
                "hora_fin": r.hora_fin,
                "salon": r.salon,
                "periodo": r.periodo,
            }
            for r in self.registros
        ]

        df = pd.DataFrame(datos)
        df.to_csv(output_path, index=False, encoding="utf-8-sig")
        print(f"✅ CSV limpio exportado: {output_path}")


def main():
    parser = argparse.ArgumentParser(
        description="Agente de Gestión de Horarios - UniSalamanca",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Ejemplos:
  python -m agents.schedule_agent import --file horarios.xlsx
  python -m agents.schedule_agent validate --file horarios.xlsx
  python -m agents.schedule_agent export --file horarios.xlsx --output limpio.csv
        """,
    )

    subparsers = parser.add_subparsers(dest="comando", help="Comandos disponibles")

    # Comando import
    imp_parser = subparsers.add_parser("import", help="Importar y mostrar datos")
    imp_parser.add_argument("--file", "-f", required=True, help="Archivo Excel o CSV")
    imp_parser.add_argument(
        "--sheet", "-s", default=0, help="Hoja de Excel (índice o nombre)"
    )

    # Comando validate
    val_parser = subparsers.add_parser(
        "validate", help="Validar horarios y detectar cruces"
    )
    val_parser.add_argument("--file", "-f", required=True, help="Archivo Excel o CSV")
    val_parser.add_argument(
        "--report",
        "-r",
        choices=["terminal", "json", "csv"],
        default="terminal",
        help="Formato del reporte",
    )
    val_parser.add_argument("--output", "-o", help="Guardar reporte en archivo")

    # Comando export
    exp_parser = subparsers.add_parser("export", help="Exportar datos limpios")
    exp_parser.add_argument("--file", "-f", required=True, help="Archivo Excel o CSV")
    exp_parser.add_argument(
        "--output", "-o", required=True, help="Archivo de salida CSV"
    )

    args = parser.parse_args()

    if not args.comando:
        parser.print_help()
        return

    agente = AgenteHorarios()

    if args.comando == "import":
        df = agente.cargar_desde_excel(args.file)
        agente.parsear_registros(df)
        print(f"\n📋 Primeros 5 registros:")
        for r in agente.registros[:5]:
            print(
                f"   {r.estudiante_nombre}: {r.nombre_materia} ({r.dia} {r.hora_inicio}-{r.hora_fin})"
            )

    elif args.comando == "validate":
        df = agente.cargar_desde_excel(args.file)
        agente.parsear_registros(df)
        agente.validar_todos()

        reporte = agente.generar_reporte(args.report)

        if args.output:
            with open(args.output, "w", encoding="utf-8") as f:
                f.write(reporte)
            print(f"\n📄 Reporte guardado: {args.output}")
        else:
            print(reporte)

        sys.exit(0 if len(agente.errores) == 0 else 1)

    elif args.comando == "export":
        df = agente.cargar_desde_excel(args.file)
        agente.parsear_registros(df)
        agente.exportar_csv_limpio(args.output)


if __name__ == "__main__":
    main()
