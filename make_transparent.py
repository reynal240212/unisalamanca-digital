from PIL import Image
import os

def remove_background(input_path, output_path):
    img = Image.open(input_path)
    img = img.convert("RGBA")
    datas = img.getdata()

    new_data = []
    # Using a small tolerance for dark pixels that might not be pure #000
    tolerance = 10 
    for item in datas:
        # Check if the pixel is close to black (0,0,0)
        if item[0] < tolerance and item[1] < tolerance and item[2] < tolerance:
            new_data.append((0, 0, 0, 0)) # Alpha = 0
        else:
            new_data.append(item)

    img.putdata(new_data)
    img.save(output_path, "PNG")
    print(f"Successfully saved transparent image to {output_path}")

input_img = r"c:\Users\reyna\Desktop\unisalamanca-digital\public\images\salmi-negro.png"
output_img = r"c:\Users\reyna\Desktop\unisalamanca-digital\public\images\salmi-limpio.png"

if os.path.exists(input_img):
    remove_background(input_img, output_img)
else:
    print(f"Error: {input_img} not found")
