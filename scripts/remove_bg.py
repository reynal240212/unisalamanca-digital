from rembg import remove
from PIL import Image
import os

images_dir = r"C:\Users\INVESTIGACION 181\Downloads\ProyectoUnisalamanca\public\images"

# Todas las imágenes de Salmi que necesitan fondo removido
salmi_images = [
    "salmi-estudiante.png",
    "salmi-egresado.png",
    "salmi-profesor.png",
    "salmi-admin.png",
    "salmi-secretaria.png",
    "salmi-cartera.png",
    "salmi-admisiones.png",
    "salmi-bienestar.png",
    "salmi-director.png",
    "salmi-validador.png",
]

for filename in salmi_images:
    path = os.path.join(images_dir, filename)
    if not os.path.exists(path):
        print(f"Saltando {filename} (no existe)")
        continue
    
    print(f"Procesando {filename}...")
    with open(path, "rb") as f:
        data = f.read()
    
    result = remove(data)
    
    # Guardar sobreescribiendo el original
    with open(path, "wb") as f:
        f.write(result)
    
    print(f"  OK: Fondo removido: {filename}")

print("\n¡Listo! Todas las imágenes procesadas.")
