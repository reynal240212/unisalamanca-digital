from PIL import Image
import os

def remove_white(input_path, output_path):
    img = Image.open(input_path)
    img = img.convert("RGBA")
    datas = img.getdata()

    new_data = []
    # Tolerance for off-white pixels
    tolerance = 240
    for item in datas:
        # Check if the pixel is close to white (255, 255, 255)
        if item[0] > tolerance and item[1] > tolerance and item[2] > tolerance:
            new_data.append((255, 255, 255, 0)) # Alpha = 0
        else:
            new_data.append(item)

    img.putdata(new_data)
    img.save(output_path, "PNG")
    print(f"Successfully saved transparent image to {output_path}")

input_img = r"C:\Users\reyna\.gemini\antigravity\brain\41d9a090-2160-464f-a41d-48c96264c6a5\salmi_premium_v2_white_bg_1774657616992.png"
output_img = r"c:\Users\reyna\Desktop\unisalamanca-digital\public\images\salmi-premium-v2.png"

if os.path.exists(input_img):
    remove_white(input_img, output_img)
    # Copy to the final name used in components
    import shutil
    shutil.copy(output_img, r"c:\Users\reyna\Desktop\unisalamanca-digital\public\images\salmi-premium.png")
else:
    print(f"Error: {input_img} not found")
