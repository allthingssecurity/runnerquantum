# 🎮 GAME ASSET SPECIFICATION TEMPLATE
## Use this template to define any new game you want to build

---

## 1️⃣ GAME INFO

| Field | Your Input |
|-------|------------|
| **Game Name** | _(e.g., "Kejri Runner")_ |
| **Game Type** | `runner` / `platformer` / `top-down` / `puzzle` / `shooter` / `idle` |
| **View** | `side-scroll` / `top-down` / `isometric` |
| **Resolution** | _(e.g., 900x500)_ |
| **Style** | `pixel-art` / `cartoon` / `realistic` / `minimalist` |

---

## 2️⃣ CHARACTERS

### 2a. Player Character

| Field | Specification |
|-------|---------------|
| **Name** | _(e.g., "Modi")_ |
| **Actions Needed** | _(List all: run, jump, slide, idle, attack, die)_ |

**For EACH action, provide:**

```
ACTION: run
├── Image: Single horizontal sprite strip (PNG, transparent background)
├── Dimensions: [Total Width] x [Height] pixels
├── Frame Count: [Number of frames in the strip]
├── Frame Size: [Width ÷ Frame Count] x [Height]
├── Direction: Facing RIGHT
└── Filename: player_run.png

Example:
ACTION: run
├── Image: 1024x682 PNG
├── Frames: 8
├── Frame Size: 128x682
├── Filename: modi_run.png
```

### 2b. Enemy/Rival Characters (Repeat for each)

| Field | Specification |
|-------|---------------|
| **Name** | _(e.g., "Kejri")_ |
| **Behavior** | `chaser` / `patroller` / `jumper` / `shooter` / `static` |
| **Actions Needed** | _(e.g., run, attack)_ |
| **Same format as Player for each action** | |

---

## 3️⃣ BACKGROUNDS

### 3a. Main Background

| Field | Specification |
|-------|---------------|
| **Type** | `static` / `scrolling` / `parallax-layers` |
| **Dimensions** | _(e.g., 1920x600 for wide scrolling BG)_ |
| **Format** | PNG or JPG |
| **Seamless?** | `yes` (left-right edges match) / `no` |

**If PARALLAX (multiple layers):**
```
LAYER 1 (Far - Sky): 1920x300, scroll speed 0.2x
LAYER 2 (Mid - Mountains): 1920x400, scroll speed 0.5x  
LAYER 3 (Near - Trees): 1920x500, scroll speed 0.8x
```

### 3b. Ground/Floor

| Field | Specification |
|-------|---------------|
| **Type** | `tile` (repeating) / `static` |
| **Dimensions** | _(e.g., 64x64 tile, or full width strip)_ |
| **Format** | PNG with transparency if needed |

---

## 4️⃣ OBSTACLES / OBJECTS

**For EACH obstacle type:**

```
OBSTACLE: tractor
├── Image: Single PNG with transparent background
├── Dimensions: [Width] x [Height] pixels
├── Animated?: yes/no (if yes, provide sprite strip like characters)
├── Behavior: static / moving / bouncing / rotating
├── Hitbox: [W] x [H] (can be smaller than image)
├── Spawn Location: ground / air / random
└── Filename: tractor.png
```

**Example List:**
| Name | Size | Animated | Behavior | Hitbox |
|------|------|----------|----------|--------|
| Cone | 50x80 | No | Static | 40x60 |
| Barrel | 60x70 | No | Static | 50x60 |
| Bird | 200x50 (4 frames) | Yes | Flying | 40x30 |

---

## 5️⃣ COLLECTIBLES / POWER-UPS

**For EACH item:**

```
ITEM: coin
├── Image: Sprite strip OR single image
├── Dimensions: 64x64 (if animated: 256x64 with 4 frames)
├── Effect: +10 score
├── Spawn: random in air
└── Filename: coin.png

ITEM: magnet
├── Image: Single PNG
├── Dimensions: 48x48
├── Effect: Attract coins for 5 seconds
├── Spawn: rare, random
└── Filename: powerup_magnet.png
```

---

## 6️⃣ UI ELEMENTS (Optional)

| Element | Specification |
|---------|---------------|
| Health Icon | 32x32 heart PNG |
| Coin Icon | 24x24 coin PNG |
| Buttons | Start, Pause, Retry (with hover states) |
| Font | Google Font name or custom |

---

## 7️⃣ AUDIO (Optional)

| Sound | Description |
|-------|-------------|
| Jump | Short "boing" sound |
| Collect | Coin pickup chime |
| Hit | Damage/collision sound |
| Music | Background loop |

---

## 📁 FILE NAMING CONVENTION

```
assets/
├── sprites/
│   ├── player_run.png      # Player run animation (horizontal strip)
│   ├── player_jump.png     # Player jump animation
│   ├── enemy_walk.png      # Enemy animation
│   ├── coin.png            # Coin (animated or static)
│   └── powerup_*.png       # Power-ups
├── backgrounds/
│   ├── bg_layer1_sky.png   # Parallax layer 1
│   ├── bg_layer2_city.png  # Parallax layer 2
│   └── ground_tile.png     # Ground
├── obstacles/
│   ├── cone.png
│   ├── barrel.png
│   └── tractor.png
└── ui/
    ├── heart.png
    └── button_start.png
```

---

## ✅ IMAGE REQUIREMENTS CHECKLIST

Before uploading any image, ensure:

- [ ] **PNG format** (for transparency) or JPG (for backgrounds)
- [ ] **Transparent background** on all sprites (characters, obstacles)
- [ ] **No white/gray boxes** around sprites
- [ ] **Consistent art style** across all assets
- [ ] **Sprite sheets are HORIZONTAL** (frames side-by-side)
- [ ] **All frames same size** in sprite sheets
- [ ] **Character faces RIGHT** by default
- [ ] **Power of 2 dimensions preferred** (64, 128, 256, 512, 1024)

---

## 🔧 PROCESSING I WILL DO

When you give me assets, I will:

1. **Clean backgrounds** - Remove any remaining white/gray pixels
2. **Extract frames** - If you give a messy sheet, I'll slice it
3. **Resize if needed** - Scale to fit game resolution
4. **Validate dimensions** - Ensure frame sizes are correct
5. **Integrate into game** - Load in Phaser with correct settings

---

## 📝 EXAMPLE: Kejri Runner Specification

```yaml
GAME:
  name: Kejri Runner
  type: runner
  view: side-scroll
  resolution: 900x500
  style: pixel-art

PLAYER:
  name: Kejri
  actions:
    - run: 1024x682, 8 frames, facing right
    - jump: 512x682, 4 frames
    - slide: 512x341, 4 frames

ENEMIES:
  - name: Rival (Modi)
    behavior: jumper
    actions:
      - hop: 600x600, 2 frames (up/down poses)

BACKGROUNDS:
  - layer1_sky: 1920x200, static, seamless
  - layer2_buildings: 1920x400, scroll 0.5x, seamless
  - ground: 1920x100, tile

OBSTACLES:
  - cone: 50x80, static
  - barrier: 100x60, static
  - rickshaw: 150x100, static
  - dog: 200x80, animated 4 frames, running

COLLECTIBLES:
  - coin: 64x64, animated 6 frames, +10 score
  - magnet: 48x48, static, attract coins 5s
  - shield: 48x48, static, invincible 3s

UI:
  - heart: 32x32
  - coin_icon: 24x24
  - font: Press Start 2P
```

---

## 🚀 HOW TO USE THIS TEMPLATE

1. **Copy this template**
2. **Fill in your game details**
3. **Generate assets using AI** (DALL-E, Midjourney, etc.) with these specs
4. **Upload assets here** with filenames matching the convention
5. **I will process and integrate** them into a working game

---

**Questions?** Just ask! The more structured your input, the faster and better the game!
