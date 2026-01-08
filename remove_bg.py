#!/usr/bin/env python3
"""
Aggressive background removal for sprite sheets
"""
from PIL import Image

def remove_background(input_path, output_path, threshold=230):
    """Remove light background and make truly transparent"""
    
    img = Image.open(input_path).convert('RGBA')
    pixels = img.load()
    width, height = img.size
    
    transparent_count = 0
    
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            
            # Method 1: Very light pixels (near white) - background
            is_very_light = r > threshold and g > threshold and b > threshold
            
            # Method 2: Grayish pixels (similar R, G, B values) with high brightness
            avg = (r + g + b) / 3
            is_gray = abs(r - avg) < 20 and abs(g - avg) < 20 and abs(b - avg) < 20
            is_light_gray = is_gray and avg > 180
            
            # Method 3: Checkered pattern colors (specific gray values)
            is_checker = (
                (150 <= r <= 160 and 150 <= g <= 160 and 150 <= b <= 160) or
                (190 <= r <= 210 and 190 <= g <= 210 and 190 <= b <= 210) or
                (120 <= r <= 135 and 120 <= g <= 135 and 120 <= b <= 135)
            )
            
            if is_very_light or is_light_gray or is_checker:
                pixels[x, y] = (0, 0, 0, 0)
                transparent_count += 1
    
    # Save the result
    img.save(output_path, 'PNG')
    total_pixels = width * height
    print(f"Saved transparent sprite to {output_path}")
    print(f"Dimensions: {width}x{height}")
    print(f"Made {transparent_count} pixels transparent ({100*transparent_count/total_pixels:.1f}%)")
    
    return width, height

if __name__ == "__main__":
    # Process deepak_sprite
    input_file = "deepak_sprite.png"
    output_file = "assets/sprites/deepak_run_clean.png"
    w, h = remove_background(input_file, output_file, threshold=220)
    
    # Calculate frame size
    cols, rows = 4, 2
    frame_w = w // cols
    frame_h = h // rows
    print(f"\nFrame dimensions: {frame_w}x{frame_h} ({cols} cols x {rows} rows)")
