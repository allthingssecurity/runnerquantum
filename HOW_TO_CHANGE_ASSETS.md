# How to Modify Game Assets (Step-by-Step)

## 📂 File Locations
- **Code:** `index.html`
- **Images:** `assets/sprites/`

---

## 1. Replacing the Player Character

### Step 1: Get your image
Ensure your sprite sheet is a **PNG with transparency**.
Example: You have `hero_run.png` (500x100px, 5 frames).
- Frame Width: 100px
- Frame Height: 100px

### Step 2: Load it in `preload()`
Open `index.html` and find `class GameScene` -> `preload()`.

```javascript
preload() {
    const ts = Date.now();
    
    // REPLACE THIS BLOCK:
    this.load.spritesheet('run', `assets/sprites/hero_run.png?v=${ts}`, {
        frameWidth: 100,  // Width of ONE frame
        frameHeight: 100  // Height of ONE frame
    });
}
```

### Step 3: Adjust Animation in `create()`
Find `this.anims.create` inside `create()`.

```javascript
this.anims.create({
    key: 'run',
    // Change 'end' to (Total Frames - 1)
    frames: this.anims.generateFrameNumbers('run', { start: 0, end: 4 }),
    frameRate: 12, // Adjust speed if needed
    repeat: -1
});
```

### Step 4: Adjust Hitbox (Optional)
If your new character is smaller/larger, find `this.player.body.setSize` in `create()`.

```javascript
// Width, Height
this.player.body.setSize(50, 80); 
// Offset X, Offset Y (to center the hitbox)
this.player.body.setOffset(25, 10);
```

---

## 2. Using Real Images for Obstacles (Kenney Assets)

Currently, the game **draws** obstacles with code. To use images instead:

### Step 1: Put image in folder
Place `car.png` in `assets/sprites/`.

### Step 2: Load it in `preload()`
```javascript
this.load.image('car', 'assets/sprites/car.png');
```

### Step 3: Update `spawnObstacle()`
Find `spawnObstacle()` and the `switch(type)` statement.

**Replace a case (e.g., 'box') with this:**

```javascript
case 'box':
    // 1. Create the image
    // (0, -height/2) positions it resting on ground
    const img = this.add.image(0, -30, 'car'); 
    
    // 2. Scale it (Kenney assets are usually too big for this game)
    img.setScale(0.5); 
    
    // 3. Add to container
    container.add(img);
    
    // 4. Set Physics Body Size
    hitW = img.displayWidth * 0.8;  // 80% width for forgiveness
    hitH = img.displayHeight * 0.8;
    break;
```

---

## 3. Changing Backgrounds

### Step 1: Load Image
```javascript
this.load.image('city_bg', 'assets/sprites/city_background.jpg');
```

### Step 2: Add to `create()`
Find where `sky` is created. **Replace** the `sky` graphics code with:

```javascript
// Add image at center of screen
const bg = this.add.image(W/2, H/2, 'city_bg');

// Scale to fit screen
bg.setDisplaySize(W, H);

// Send to back
bg.setDepth(-1); 
```

---

## 4. Troubleshooting

*   **"The image is a black box!"**
    *   Did you check the path? Is it definitely in `assets/sprites/`?
    *   Did you use `this.load.image` for a single image and `this.load.spritesheet` for animation?
*   **"The animation looks weird/glitchy!"**
    *   Your `frameWidth` / `frameHeight` math is wrong.
    *   Total Width ÷ Number of Columns = `frameWidth`.
*   **"It's too big!"**
    *   Use `.setScale(0.5)` (50% size) or `.setScale(0.2)` (20% size).
