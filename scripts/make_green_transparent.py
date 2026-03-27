from PIL import Image
import os
import sys

def make_green_transparent(input_path, output_path):
    img = Image.open(input_path)
    img = img.convert("RGBA")
    datas = img.getdata()

    newData = []
    # Targeted yellowish-green based on analysis: (131, 211, 34)
    for item in datas:
        r, g, b, a = item
        # If green is the dominant color and significantly higher than R and B.
        if g > r + 30 and g > b + 30:
            newData.append((255, 255, 255, 0)) # Transparent
        else:
            newData.append(item)

    img.putdata(newData)
    img.save(output_path, "PNG")
    print(f"File saved with calibrated transparency: {output_path}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python make_green_transparent.py <input> <output>")
    else:
        make_green_transparent(sys.argv[1], sys.argv[2])
