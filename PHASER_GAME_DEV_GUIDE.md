# 🚀 The Ultimate Phaser Game Dev Guide
## From Raw Assets to Polished Game

This guide encapsulates the "Secret Sauce" developed during the creation of *Kejri Runner*. Use this for any future Arcade, Platformer, or Endless Runner game.

---

## Phase 1: Asset Strategy (The "Make or Break" Step)

### 1.1 Sourcing Assets
*   **Kenney.nl**: The gold standard.
    *   *Rule:* Check the **Perspective**.
    *   *Side-Scroller?* Use "Platformer Pack" or "Toon Characters".
    *   *Top-Down?* Use "Racing Pack" or "RPG Base".
*   **AI Generation (Midjourney/DALL-E)**:
    *   *Prompt:* "2D pixel art sprite sheet of [character] running, side view, white background, grid layout, 4 frames"
    *   *Warning:* AI images are **JPEGs** (no transparency) even if they look like PNGs.

### 1.2 The "Fake Transparency" Fix
AI generators often create a "checkered background" that is actually part of the image. **You must remove this.**

**The Magic Python Script (Save as `clean_assets.py`):**
```python
from PIL import Image
from collections import deque

def clean_sprite(input_path, output_path):
    img = Image.open(input_path).convert('RGBA')
    pixels = img.load()
    width, height = img.size
    visited = set()
    
    # Flood fill from all 4 corners to find background
    queue = deque([(0,0), (width-1,0), (0,height-1), (width-1,height-1)])
    
    while queue:
        x, y = queue.popleft()
        if (x,y) in visited or x<0 or x>=width or y<0 or y>=height: continue
        visited.add((x,y))
        
        r,g,b,a = pixels[x,y]
        # If pixel is whitish/grayish (background color)
        if r > 200 and g > 200 and b > 200: 
            pixels[x,y] = (0,0,0,0) # Make transparent
            # Add neighbors
            queue.extend([(x+1,y), (x-1,y), (x,y+1), (x,y-1)])

    img.save(output_path)
    print(f"Cleaned: {output_path}")

# Usage
clean_sprite('raw_character.jpg', 'character_clean.png')
```

### 1.3 The "No Asset" Strategy (Phaser Graphics)
If you can't find a good sprite for a simple object (box, barrier, coin), **DRAW IT IN CODE**.
*   **Pros:** Infinite resolution, perfect hitboxes, 0kb file size.
*   **How:**
    ```javascript
    const g = this.add.graphics();
    g.fillStyle(0xff0000); // Red
    g.fillRect(0, 0, 50, 50); // Box
    ```

---

## Phase 2: The Golden Code Template

Use this structure for every game. It handles the common headaches (caching, scaling, audio).

### `index.html` Structure
```html
<!DOCTYPE html>
<html>
<head>
    <script src="https://cdn.jsdelivr.net/npm/phaser@3.60.0/dist/phaser.min.js"></script>
    <style> body { margin: 0; background: #111; display: flex; justify-content: center; } </style>
</head>
<body>
<div id="game"></div>
<script>
const CONFIG = {
    width: 800,
    height: 450,
    gravity: 1000,
    debug: false // Set to true to see hitboxes!
};

class MainScene extends Phaser.Scene {
    // 1. PRELOAD: Load assets with cache-busting
    preload() {
        const v = Date.now(); // Force browser to reload images
        this.load.spritesheet('player', `player.png?v=${v}`, { 
            frameWidth: 64, frameHeight: 64 
        });
    }

    // 2. CREATE: Setup world
    create() {
        // A. Inputs
        this.keys = this.input.keyboard.createCursorKeys();
        
        // B. Sounds (Web Audio API - No files needed!)
        this.initSound();
        
        // C. Player
        this.player = this.physics.add.sprite(100, 300, 'player');
        this.player.setCollideWorldBounds(true);
        
        // D. Groups
        this.obstacles = this.physics.add.group();
        
        // E. Colliders
        this.physics.add.collider(this.player, this.obstacles, this.hitObstacle, null, this);
        
        // F. Spawner
        this.time.addEvent({ delay: 2000, callback: this.spawn, loop: true, callbackScope: this });
    }

    // 3. UPDATE: Game Loop
    update() {
        // Movement
        if (this.keys.space.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-500);
            this.playSound('jump');
        }
        
        // Cleanup off-screen objects
        this.obstacles.children.each(obs => {
            if (obs.x < -100) obs.destroy();
        });
    }

    spawn() {
        // Draw obstacle with code instead of loading image
        const obs = this.add.rectangle(900, 400, 40, 40, 0xff0000);
        this.physics.add.existing(obs);
        this.obstacles.add(obs);
        obs.body.setVelocityX(-300);
    }
    
    initSound() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    playSound(type) {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        // ... configure sound ...
        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
    }
}

new Phaser.Game({
    type: Phaser.AUTO,
    width: CONFIG.width,
    height: CONFIG.height,
    parent: 'game',
    physics: { default: 'arcade', arcade: { gravity: { y: CONFIG.gravity }, debug: CONFIG.debug } },
    scene: MainScene
});
</script>
</body>
</html>
```

---

## Phase 3: Pro Tips & "Gotchas"

### 1. Hitboxes are Liars
*   **Problem:** Sprites often have empty space around them.
*   **Fix:** Manually set the body size smaller than the sprite.
    ```javascript
    // Player is 64x64, but hitbox is 30x50
    this.player.body.setSize(30, 50);
    this.player.body.setOffset(17, 14); // Center it
    ```

### 2. The "Tunneling" Effect
*   **Problem:** At high speeds, player passes *through* obstacles without dying.
*   **Fix:** Use `processCallback` in overlap for a double-check.
    ```javascript
    this.physics.add.overlap(player, obstacle, hitCallback, (p, o) => {
        // Manual check: Are they actually touching?
        return Phaser.Geom.Intersects.RectangleToRectangle(p.getBounds(), o.getBounds());
    }, this);
    ```

### 3. Mobile Support
*   **Problem:** Keyboard events don't work on phones.
*   **Fix:** Add touch listeners.
    ```javascript
    this.input.on('pointerdown', () => this.jump());
    ```

### 4. Difficulty Scaling
*   **Strategy:** Don't just make it faster.
    1.  **Speed:** Increase by 0.1 every 5 seconds.
    2.  **Gap:** Decrease spawn delay (2000ms -> 1500ms).
    3.  **Pattern:** Spawn double obstacles or flying enemies.

---

## Phase 4: Polish (The "Juice")

A game feels "cheap" without these:

1.  **Screenshake:** `this.cameras.main.shake(200, 0.01);` on hit.
2.  **Flash:** `this.cameras.main.flash(200);` on hit or level up.
3.  **Particles:** Add a particle emitter behind the player when running.
4.  **Floating Text:** When collecting coins, tween text upwards and fade it out.

---

*Generated by Antigravity for the Kejri Runner Project*
