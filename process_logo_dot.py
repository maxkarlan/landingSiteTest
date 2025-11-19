from PIL import Image, ImageDraw

def remove_center_dot(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    width, height = img.size
    
    # The dot is roughly in the center-bottom. 
    # Based on the image, it's a circle in the palm.
    # We'll define a bounding box for the dot and clear it.
    # Approximate center of the dot: 50% x, 65% y?
    # Let's try to just mask it out with a circle.
    
    # Create a mask
    mask = Image.new('L', (width, height), 255)
    draw = ImageDraw.Draw(mask)
    
    # Define the dot area to erase (Transparent)
    # Adjust these coordinates based on the visual inspection of the logo
    # Assuming 500x500 image roughly
    # Center X ~ 250, Center Y ~ 300?
    # Radius ~ 40?
    
    # Since I can't see the exact pixel coords, I'll use a heuristic:
    # The dot is a distinct island of pixels. 
    # But simpler: Just erase the center area.
    
    # Let's try a circular erase in the "palm" area.
    # Center of image is (width/2, height/2).
    # The dot is slightly below center.
    
    cx, cy = width / 2, height * 0.65 # Approx position of dot in palm
    radius = width * 0.12 # Approx size
    
    # Draw a black circle on the white mask (black = transparent in alpha channel logic usually, but here we use it to clear)
    # Actually, let's just manipulate pixel data directly or use composite.
    
    # Create a transparent circle
    for x in range(width):
        for y in range(height):
            # Check distance from estimated dot center
            if (x - cx)**2 + (y - cy)**2 < radius**2:
                img.putpixel((x, y), (0, 0, 0, 0)) # Make transparent
                
    img.save(output_path, "PNG")
    print(f"Saved hand-only image to {output_path}")

if __name__ == "__main__":
    remove_center_dot(
        "/Users/maxwellkarlan/Desktop/AntigravityAgentMang/public/assets/logo-symbol-transparent.png",
        "/Users/maxwellkarlan/Desktop/AntigravityAgentMang/public/assets/logo-hand.png"
    )
