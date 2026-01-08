# 🎮 Phaser Game Asset Guide
## Best Practices for Arcade & Platformer Games

---

## 📌 Key Lessons Learned

### 1. **Asset Perspective Must Match Game Type**

| Game Type | Asset Perspective | Example Assets |
|-----------|------------------|----------------|
| **Side-Scroller / Platformer** | Side view (profile) | Character running left/right, obstacles from the side |
| **Top-Down / Racing** | Top-down (bird's eye) | Kenney Racing Pack, cars from above |
| **Isometric** | 45° angle | City builders, strategy games |

❌ **WRONG**: Using Kenney Racing Pack (top-down) in a side-scroller
✅ **RIGHT**: Use side-view assets or draw with Phaser Graphics

---

## 🖼️ Sprite Sheets - The Right Way

### Format Requirements:
```
┌──────────────────────────────────────────────────┐
│  Frame 1  │  Frame 2  │  Frame 3  │  Frame 4    │  ← Single row OR
├──────────────────────────────────────────────────┤
│  Frame 5  │  Frame 6  │  Frame 7  │  Frame 8    │  ← Multiple rows
└──────────────────────────────────────────────────┘

- All frames MUST be the same size
- Frames arranged in a grid (rows × columns)
- NO gaps between frames
- Transparent background (PNG format!)
```

### Phaser Loading:
```javascript
// Calculate: totalWidth / columns = frameWidth
// Calculate: totalHeight / rows = frameHeight
this.load.spritesheet('player', 'player.png', {
    frameWidth: 64,   // Width of ONE frame
    frameHeight: 64   // Height of ONE frame
});

// Create animation
this.anims.create({
    key: 'run',
    frames: this.anims.generateFrameNumbers('player', { start: 0, end: 7 }),
    frameRate: 12,
    repeat: -1
});
```

---

## 🎨 Image Format Best Practices

### ✅ USE PNG for:
- Characters with animation
- Objects that need transparency
- UI elements
- Anything that overlays the background

### ✅ USE JPG for:
- Large backgrounds (file size matters)
- Photos/realistic textures
- Images without transparency

### ❌ NEVER:
- Use JPEG for sprites (no transparency support!)
- Use AI-generated images directly (often saved as JPEG with fake transparency)
- Use images larger than needed (scale down first)

---

## 🔧 Fixing AI-Generated Image Backgrounds

AI image generators like DALL-E, Midjourney, Imagen often:
1. Generate PNG-looking images but save as **JPEG**
2. Show a "checkered" transparency pattern but it's **actual pixels**

### Solution: Python Background Removal Script

```python
from PIL import Image
from collections import deque

def remove_background(input_path, output_path):
    """Flood-fill remove gray/checkered backgrounds"""
    img = Image.open(input_path).convert('RGBA')
    pixels = img.load()
    width, height = img.size
    
    visited = set()
    to_remove = set()
    
    def is_background(r, g, b):
        """Detect grayish background pixels"""
        max_diff = max(abs(r-g), abs(g-b), abs(r-b))
        avg = (r + g + b) / 3
        return max_diff < 35 and avg > 120
    
    def flood_fill(start_x, start_y):
        queue = deque([(start_x, start_y)])
        while queue:
            x, y = queue.popleft()
            if (x, y) in visited or x < 0 or x >= width or y < 0 or y >= height:
                continue
            visited.add((x, y))
            r, g, b, a = pixels[x, y]
            if is_background(r, g, b):
                to_remove.add((x, y))
                queue.extend([(x+1,y), (x-1,y), (x,y+1), (x,y-1)])
    
    # Start from all edges
    for x in range(width):
        flood_fill(x, 0)
        flood_fill(x, height-1)
    for y in range(height):
        flood_fill(0, y)
        flood_fill(width-1, y)
    
    # Remove pixels
    for x, y in to_remove:
        pixels[x, y] = (0, 0, 0, 0)
    
    img.save(output_path, 'PNG')
    print(f"Removed {len(to_remove)} background pixels")

# Usage
remove_background('input.png', 'output_clean.png')
```

---

## 📐 Recommended Asset Sizes

### For 900×500 game canvas:

| Asset Type | Recommended Size | Notes |
|------------|-----------------|-------|
| Player sprite | 64-128px tall | ~15-20% of screen height |
| Ground obstacles | 40-80px tall | Jumpable height |
| Tall obstacles | 80-120px tall | Must slide under |
| Coins/collectibles | 24-40px | Easy to see, not too big |
| Background tiles | 128×128px | Seamless tiling |
| Parallax backgrounds | 1920×500px | 2× game width for scrolling |

---

## 🎯 Drawing Obstacles with Phaser Graphics

When you don't have proper sprites, **draw them with code!**

```javascript
// Traffic Cone
const cone = this.add.graphics();
cone.fillStyle(0xff6600);
cone.beginPath();
cone.moveTo(0, -45);      // Top point
cone.lineTo(18, -5);      // Bottom right
cone.lineTo(-18, -5);     // Bottom left
cone.closePath();
cone.fillPath();
// White stripes
cone.lineStyle(4, 0xffffff);
cone.lineBetween(-10, -20, 10, -20);

// Barrier
const barrier = this.add.graphics();
barrier.fillStyle(0xcc0000);
barrier.fillRect(-25, -50, 50, 50);
barrier.fillStyle(0xffffff);
barrier.fillRect(-25, -50, 50, 10);  // White stripes

// Auto-rickshaw
const rick = this.add.graphics();
rick.fillStyle(0x2ecc71);  // Green body
rick.fillRoundedRect(-30, -55, 55, 35, 5);
rick.fillStyle(0xf1c40f);  // Yellow roof
rick.fillRoundedRect(-28, -70, 50, 18, 5);
rick.fillStyle(0x333333);  // Wheels
rick.fillCircle(-20, -10, 12);
rick.fillCircle(18, -10, 12);
```

### Advantages of Graphics-drawn obstacles:
- ✅ Always perfect transparency
- ✅ Scales without pixelation
- ✅ No file loading issues
- ✅ Easy to modify colors/sizes
- ✅ Small file size (it's just code!)

---

## 🔄 Browser Caching Issues

When updating assets, browsers often serve old cached versions.

### Solution 1: Cache-busting URL
```javascript
const timestamp = Date.now();
this.load.image('player', `player.png?v=${timestamp}`);
```

### Solution 2: Hard Refresh
- **Mac**: `Cmd + Shift + R`
- **Windows**: `Ctrl + Shift + R`
- **Or**: DevTools → Right-click Refresh → "Empty Cache and Hard Reload"

---

## 📦 Recommended Free Asset Sources

### Side-View / Platformer:
- **Kenney.nl** - "Platformer Pack", "Pixel Platformer"
- **OpenGameArt.org** - Search "platformer sprites"
- **itch.io** - Free game assets section

### Do NOT use for side-scrollers:
- Kenney Racing Pack (top-down)
- Kenney City Kit (top-down)
- Any "top-down RPG" packs

---

## 📝 Pre-Flight Checklist

Before starting a new Phaser game:

- [ ] **Perspective**: Do all assets match my game's perspective?
- [ ] **Format**: Are sprites PNG with actual transparency?
- [ ] **Size**: Are sprite sheets grid-aligned with known frame dimensions?
- [ ] **Scale**: Will assets look good at intended game resolution?
- [ ] **Animation**: Do I have all needed animation states (idle, run, jump, etc.)?
- [ ] **Test**: Load one asset first to verify it works before adding more

---

## 🚀 Quick Start Template

```javascript
class GameScene extends Phaser.Scene {
    preload() {
        // With cache-busting for development
        const v = Date.now();
        this.load.spritesheet('player', `player.png?v=${v}`, {
            frameWidth: 64,
            frameHeight: 64
        });
    }
    
    create() {
        // Create animations
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 7 }),
            frameRate: 12,
            repeat: -1
        });
        
        // Create player
        this.player = this.physics.add.sprite(100, 300, 'player');
        this.player.play('run');
        
        // Draw obstacles with graphics (no images needed!)
        const obstacle = this.add.graphics();
        obstacle.fillStyle(0xff0000);
        obstacle.fillRect(0, 0, 40, 60);
    }
}
```

---

## 💡 Pro Tips

1. **Start simple** - Get basic shapes working before adding fancy sprites
2. **Test frequently** - Check the browser console for loading errors
3. **Use debug mode** - `arcade: { debug: true }` shows hitboxes
4. **Verify file types** - Use `file image.png` command to check actual format
5. **Keep originals** - Always keep unprocessed source images

---

Created for the Kejri Runner project - January 2026
