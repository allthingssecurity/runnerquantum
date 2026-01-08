/**
 * KEJRI RUNNER - Delhi Dash
 * A professional endless runner game built with Phaser 3
 * 
 * Features:
 * - Smooth side-scrolling gameplay
 * - Parallax backgrounds
 * - Multiple obstacle types
 * - Power-ups and coins
 * - Progressive difficulty
 * - High score persistence
 */

// ============================================
// GAME CONFIGURATION
// ============================================
const CONFIG = {
    width: 900,
    height: 500,
    groundY: 400,
    gravity: 1800,

    player: {
        x: 150,
        jumpForce: -650,
        runSpeed: 12,
        slideTime: 600
    },

    speed: {
        initial: 8,
        max: 18,
        increment: 0.003
    },

    spawn: {
        obstacleDelay: 1500,
        coinDelay: 2000,
        powerUpDelay: 15000
    }
};

// ============================================
// BOOT SCENE
// ============================================
class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'Boot' });
    }

    preload() {
        // Set base URL for assets
        this.load.setBaseURL('');
    }

    create() {
        this.scene.start('Preload');
    }
}

// ============================================
// PRELOAD SCENE
// ============================================
class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'Preload' });
    }

    preload() {
        // Progress bar
        this.load.on('progress', (value) => {
            const bar = document.getElementById('loading-bar');
            if (bar) bar.style.width = (value * 100) + '%';
        });

        this.load.on('complete', () => {
            const screen = document.getElementById('loading-screen');
            if (screen) {
                screen.classList.add('hidden');
                setTimeout(() => screen.style.display = 'none', 500);
            }
        });

        // Load all assets
        this.load.image('background', 'assets/backgrounds/city.png');
        this.load.image('road', 'assets/tiles/road.png');
        this.load.image('player', 'assets/sprites/player.png');
        this.load.image('rickshaw', 'assets/sprites/rickshaw.png');
        this.load.image('barrier', 'assets/sprites/barrier.png');
        this.load.image('pothole', 'assets/sprites/pothole.png');
        this.load.image('broom', 'assets/sprites/broom.png');

        // Load spritesheets
        this.load.spritesheet('playerRun', 'assets/sprites/player_run.png', {
            frameWidth: 214,
            frameHeight: 215
        });

        this.load.spritesheet('playerJump', 'assets/sprites/player_jump.png', {
            frameWidth: 162,
            frameHeight: 175
        });

        this.load.spritesheet('coin', 'assets/sprites/coin.png', {
            frameWidth: 80,
            frameHeight: 88
        });
    }

    create() {
        // Create animations
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('playerRun', { start: 0, end: 5 }),
            frameRate: 14,
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('playerJump', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: 0
        });

        this.anims.create({
            key: 'coinSpin',
            frames: this.anims.generateFrameNumbers('coin', { start: 0, end: 5 }),
            frameRate: 12,
            repeat: -1
        });

        this.scene.start('Menu');
    }
}

// ============================================
// MENU SCENE
// ============================================
class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'Menu' });
    }

    create() {
        const { width, height } = this.cameras.main;

        // Scrolling background
        this.bg1 = this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.bg2 = this.add.image(this.bg1.width, 0, 'background').setOrigin(0, 0);
        this.bg1.setDisplaySize(width, height * 0.7);
        this.bg2.setDisplaySize(width, height * 0.7);

        // Ground
        const ground = this.add.graphics();
        ground.fillGradientStyle(0x4a4a4a, 0x4a4a4a, 0x2a2a2a, 0x2a2a2a);
        ground.fillRect(0, CONFIG.groundY - 20, width, height - CONFIG.groundY + 40);

        // Road markings
        this.roadLines = [];
        for (let i = 0; i < 12; i++) {
            const line = this.add.rectangle(i * 100, CONFIG.groundY + 40, 50, 8, 0xffcc00);
            this.roadLines.push(line);
        }

        // Animated player preview
        this.player = this.add.sprite(width / 2, CONFIG.groundY - 5, 'playerRun');
        this.player.setOrigin(0.5, 1);
        this.player.setScale(0.6);
        this.player.play('run');

        // Title overlay
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.4);
        overlay.fillRect(0, 0, width, height);

        // Title
        const titleY = 100;
        this.add.text(width / 2, titleY, 'KEJRI RUNNER', {
            fontFamily: '"Press Start 2P"',
            fontSize: '36px',
            color: '#ff9933',
            stroke: '#000',
            strokeThickness: 6
        }).setOrigin(0.5);

        this.add.text(width / 2, titleY + 50, 'DELHI DASH', {
            fontFamily: '"Press Start 2P"',
            fontSize: '18px',
            color: '#138808'
        }).setOrigin(0.5);

        // High score
        const highScore = localStorage.getItem('kejriHighScore') || 0;
        this.add.text(width / 2, titleY + 100, `🏆 HIGH SCORE: ${highScore}`, {
            fontFamily: 'Poppins',
            fontSize: '20px',
            color: '#ffd700',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Play button
        const playBtn = this.createButton(width / 2, height - 150, 'PLAY', 0x138808, () => {
            this.cameras.main.fadeOut(400);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('Game');
            });
        });

        // How to play text
        this.add.text(width / 2, height - 70, 'Press SPACE to Jump  |  ↓ to Slide', {
            fontFamily: 'Poppins',
            fontSize: '14px',
            color: 'rgba(255,255,255,0.7)'
        }).setOrigin(0.5);

        this.add.text(width / 2, height - 45, 'Avoid obstacles • Collect rupees • Get power-ups!', {
            fontFamily: 'Poppins',
            fontSize: '12px',
            color: 'rgba(255,255,255,0.5)'
        }).setOrigin(0.5);

        // Input
        this.input.keyboard.once('keydown-SPACE', () => {
            this.cameras.main.fadeOut(400);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('Game');
            });
        });

        this.input.once('pointerdown', () => {
            this.cameras.main.fadeOut(400);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('Game');
            });
        });
    }

    createButton(x, y, text, color, callback) {
        const btn = this.add.container(x, y);

        const shadow = this.add.graphics();
        shadow.fillStyle(0x000000, 0.3);
        shadow.fillRoundedRect(-85, -27, 170, 54, 12);

        const bg = this.add.graphics();
        bg.fillStyle(color);
        bg.fillRoundedRect(-80, -25, 160, 50, 10);
        bg.lineStyle(3, 0xffffff, 0.3);
        bg.strokeRoundedRect(-80, -25, 160, 50, 10);

        const label = this.add.text(0, 0, text, {
            fontFamily: '"Press Start 2P"',
            fontSize: '20px',
            color: '#ffffff'
        }).setOrigin(0.5);

        btn.add([shadow, bg, label]);
        btn.setSize(160, 50);
        btn.setInteractive({ useHandCursor: true });

        btn.on('pointerover', () => btn.setScale(1.08));
        btn.on('pointerout', () => btn.setScale(1));
        btn.on('pointerdown', callback);

        // Pulse animation
        this.tweens.add({
            targets: btn,
            scale: 1.05,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        return btn;
    }

    update() {
        // Scroll road lines
        this.roadLines.forEach(line => {
            line.x -= 6;
            if (line.x < -60) line.x = 1100;
        });
    }
}

// ============================================
// MAIN GAME SCENE
// ============================================
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'Game' });
    }

    init() {
        this.score = 0;
        this.coins = 0;
        this.distance = 0;
        this.gameSpeed = CONFIG.speed.initial;
        this.isGameOver = false;
        this.isJumping = false;
        this.isSliding = false;
        this.hasShield = false;
        this.shieldTime = 0;
    }

    create() {
        const { width, height } = this.cameras.main;
        this.cameras.main.fadeIn(500);

        // ---- BACKGROUND LAYERS ----
        // Sky gradient
        const sky = this.add.graphics();
        sky.fillGradientStyle(0x87ceeb, 0x87ceeb, 0x4a90a4, 0x4a90a4);
        sky.fillRect(0, 0, width, height);

        // Parallax city background (2 copies for seamless scroll)
        this.bg1 = this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.bg2 = this.add.image(this.bg1.displayWidth, 0, 'background').setOrigin(0, 0);

        const bgScale = (height * 0.65) / this.bg1.height;
        this.bg1.setScale(bgScale);
        this.bg2.setScale(bgScale);

        // Ground
        const ground = this.add.graphics();
        ground.fillStyle(0x3d3d3d);
        ground.fillRect(0, CONFIG.groundY - 30, width, height - CONFIG.groundY + 50);

        // Road surface
        this.road1 = this.add.tileSprite(0, CONFIG.groundY + 30, width * 2, 100, 'road');
        this.road1.setOrigin(0, 0.5);

        // Road edge lines
        const roadEdge = this.add.graphics();
        roadEdge.fillStyle(0xffffff);
        roadEdge.fillRect(0, CONFIG.groundY - 20, width, 4);
        roadEdge.fillRect(0, CONFIG.groundY + 80, width, 4);

        // Scrolling road markings
        this.roadMarks = [];
        for (let i = 0; i < 15; i++) {
            const mark = this.add.rectangle(i * 80, CONFIG.groundY + 30, 40, 6, 0xffcc00);
            this.roadMarks.push(mark);
        }

        // Ground platform (invisible physics body)
        this.ground = this.add.rectangle(width / 2, CONFIG.groundY + 10, width * 2, 20, 0x000000, 0);
        this.physics.add.existing(this.ground, true);

        // ---- PLAYER ----
        this.player = this.physics.add.sprite(CONFIG.player.x, CONFIG.groundY - 10, 'playerRun');
        this.player.setOrigin(0.5, 1);
        this.player.setScale(0.45);
        this.player.body.setGravityY(CONFIG.gravity);
        this.player.body.setSize(60, 180);
        this.player.body.setOffset(80, 30);
        this.player.setCollideWorldBounds(true);
        this.player.setDepth(100);
        this.player.play('run');

        // Player shadow
        this.playerShadow = this.add.ellipse(CONFIG.player.x, CONFIG.groundY + 5, 60, 20, 0x000000, 0.3);

        // Player collision with ground
        this.physics.add.collider(this.player, this.ground);

        // ---- GROUPS ----
        this.obstacles = this.physics.add.group();
        this.coinGroup = this.physics.add.group();
        this.powerUps = this.physics.add.group();

        // ---- COLLISIONS ----
        this.physics.add.overlap(this.player, this.obstacles, this.hitObstacle, null, this);
        this.physics.add.overlap(this.player, this.coinGroup, this.collectCoin, null, this);
        this.physics.add.overlap(this.player, this.powerUps, this.collectPowerUp, null, this);

        // ---- UI ----
        this.createUI();

        // ---- CONTROLS ----
        this.setupControls();

        // ---- TIMERS ----
        this.obstacleTimer = this.time.addEvent({
            delay: CONFIG.spawn.obstacleDelay,
            callback: this.spawnObstacle,
            callbackScope: this,
            loop: true
        });

        this.coinTimer = this.time.addEvent({
            delay: CONFIG.spawn.coinDelay,
            callback: this.spawnCoins,
            callbackScope: this,
            loop: true
        });

        this.powerUpTimer = this.time.addEvent({
            delay: CONFIG.spawn.powerUpDelay,
            callback: this.spawnPowerUp,
            callbackScope: this,
            loop: true
        });

        // Initial spawn
        this.time.delayedCall(1000, () => this.spawnCoins());
    }

    createUI() {
        const { width } = this.cameras.main;

        // UI Panel
        const panel = this.add.graphics();
        panel.fillStyle(0x000000, 0.6);
        panel.fillRoundedRect(10, 10, 220, 95, 12);
        panel.setDepth(200);

        // Score
        this.add.text(25, 20, '⭐ SCORE', {
            fontFamily: 'Poppins',
            fontSize: '11px',
            color: 'rgba(255,255,255,0.7)'
        }).setDepth(200);

        this.scoreText = this.add.text(25, 35, '0', {
            fontFamily: '"Press Start 2P"',
            fontSize: '18px',
            color: '#ffd700'
        }).setDepth(200);

        // Coins
        this.add.text(25, 60, '₹ RUPEES', {
            fontFamily: 'Poppins',
            fontSize: '11px',
            color: 'rgba(255,255,255,0.7)'
        }).setDepth(200);

        this.coinsText = this.add.text(25, 75, '0', {
            fontFamily: '"Press Start 2P"',
            fontSize: '14px',
            color: '#ffffff'
        }).setDepth(200);

        // Distance
        this.distanceText = this.add.text(140, 35, '0m', {
            fontFamily: '"Press Start 2P"',
            fontSize: '12px',
            color: '#87ceeb'
        }).setDepth(200);

        this.add.text(140, 20, '📏 DISTANCE', {
            fontFamily: 'Poppins',
            fontSize: '11px',
            color: 'rgba(255,255,255,0.7)'
        }).setDepth(200);

        // Speed indicator
        const speedPanel = this.add.graphics();
        speedPanel.fillStyle(0x000000, 0.6);
        speedPanel.fillRoundedRect(width - 100, 10, 90, 40, 8);
        speedPanel.setDepth(200);

        this.add.text(width - 90, 15, 'SPEED', {
            fontFamily: 'Poppins',
            fontSize: '10px',
            color: 'rgba(255,255,255,0.6)'
        }).setDepth(200);

        this.speedText = this.add.text(width - 90, 28, '1.0x', {
            fontFamily: '"Press Start 2P"',
            fontSize: '12px',
            color: '#ff6b6b'
        }).setDepth(200);

        // Shield indicator (hidden by default)
        this.shieldIndicator = this.add.container(width / 2, 30);
        const shieldBg = this.add.graphics();
        shieldBg.fillStyle(0x00ff00, 0.3);
        shieldBg.fillRoundedRect(-60, -15, 120, 30, 8);
        const shieldText = this.add.text(0, 0, '🛡️ SHIELD ACTIVE', {
            fontFamily: 'Poppins',
            fontSize: '12px',
            color: '#00ff00',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.shieldIndicator.add([shieldBg, shieldText]);
        this.shieldIndicator.setDepth(200);
        this.shieldIndicator.setVisible(false);
    }

    setupControls() {
        // Keyboard
        this.input.keyboard.on('keydown-SPACE', () => this.jump());
        this.input.keyboard.on('keydown-UP', () => this.jump());
        this.input.keyboard.on('keydown-DOWN', () => this.slide());

        // Touch controls
        const jumpBtn = document.getElementById('btn-jump');
        const slideBtn = document.getElementById('btn-slide');

        if (jumpBtn) {
            jumpBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.jump();
            });
        }

        if (slideBtn) {
            slideBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.slide();
            });
        }

        // Tap/swipe on game canvas
        this.input.on('pointerdown', (pointer) => {
            this.touchStart = { x: pointer.x, y: pointer.y, time: Date.now() };
        });

        this.input.on('pointerup', (pointer) => {
            if (!this.touchStart) return;

            const dx = pointer.x - this.touchStart.x;
            const dy = pointer.y - this.touchStart.y;
            const dt = Date.now() - this.touchStart.time;

            if (dt < 300 && Math.abs(dy) > Math.abs(dx)) {
                if (dy < -30) this.jump();
                else if (dy > 30) this.slide();
            } else if (dt < 200) {
                this.jump(); // Tap to jump
            }
        });
    }

    jump() {
        if (this.isGameOver) return;
        if (this.player.body.touching.down && !this.isJumping) {
            this.isJumping = true;
            this.player.body.setVelocityY(CONFIG.player.jumpForce);
            this.player.play('jump');

            // Jump particles
            this.createDustParticles();
        }
    }

    slide() {
        if (this.isGameOver || this.isSliding || !this.player.body.touching.down) return;

        this.isSliding = true;
        this.player.setScale(0.45, 0.25);
        this.player.body.setSize(60, 80);
        this.player.body.setOffset(80, 130);

        this.time.delayedCall(CONFIG.player.slideTime, () => {
            if (!this.isGameOver) {
                this.isSliding = false;
                this.player.setScale(0.45, 0.45);
                this.player.body.setSize(60, 180);
                this.player.body.setOffset(80, 30);
            }
        });
    }

    createDustParticles() {
        for (let i = 0; i < 5; i++) {
            const dust = this.add.circle(
                this.player.x + Phaser.Math.Between(-20, 20),
                CONFIG.groundY - 5,
                Phaser.Math.Between(3, 6),
                0xcccccc,
                0.6
            );

            this.tweens.add({
                targets: dust,
                x: dust.x - Phaser.Math.Between(20, 50),
                y: dust.y + Phaser.Math.Between(-10, 10),
                alpha: 0,
                scale: 0.3,
                duration: 400,
                onComplete: () => dust.destroy()
            });
        }
    }

    spawnObstacle() {
        if (this.isGameOver) return;

        const { width } = this.cameras.main;
        const types = ['rickshaw', 'barrier', 'pothole'];
        const type = Phaser.Math.RND.pick(types);

        let obstacle;
        let yPos = CONFIG.groundY;
        let scale = 0.6;

        switch (type) {
            case 'rickshaw':
                yPos = CONFIG.groundY - 10;
                scale = 0.7;
                break;
            case 'barrier':
                yPos = CONFIG.groundY - 5;
                scale = 0.5;
                break;
            case 'pothole':
                yPos = CONFIG.groundY + 5;
                scale = 0.4;
                break;
        }

        obstacle = this.obstacles.create(width + 100, yPos, type);
        obstacle.setOrigin(0.5, 1);
        obstacle.setScale(scale);
        obstacle.body.setAllowGravity(false);
        obstacle.body.setVelocityX(-this.gameSpeed * 50);
        obstacle.setDepth(50);
        obstacle.obstacleType = type;

        // Set hitbox based on type
        if (type === 'rickshaw') {
            obstacle.body.setSize(obstacle.width * 0.8, obstacle.height * 0.7);
        } else if (type === 'barrier') {
            obstacle.body.setSize(obstacle.width * 0.9, obstacle.height * 0.6);
        } else {
            obstacle.body.setSize(obstacle.width * 0.6, obstacle.height * 0.3);
        }

        // Randomly spawn double obstacles at higher speeds
        if (this.gameSpeed > 10 && Math.random() < 0.25) {
            this.time.delayedCall(800, () => {
                if (!this.isGameOver) this.spawnObstacle();
            });
        }
    }

    spawnCoins() {
        if (this.isGameOver) return;

        const { width } = this.cameras.main;
        const count = Phaser.Math.Between(3, 7);
        const pattern = Phaser.Math.RND.pick(['line', 'arc', 'high']);

        for (let i = 0; i < count; i++) {
            let x = width + 100 + (i * 50);
            let y = CONFIG.groundY - 60;

            if (pattern === 'arc') {
                y = CONFIG.groundY - 60 - Math.sin((i / count) * Math.PI) * 80;
            } else if (pattern === 'high') {
                y = CONFIG.groundY - 150;
            }

            const coin = this.coinGroup.create(x, y, 'coin');
            coin.setScale(0.35);
            coin.body.setAllowGravity(false);
            coin.body.setVelocityX(-this.gameSpeed * 50);
            coin.body.setCircle(35, 5, 10);
            coin.play('coinSpin');
            coin.setDepth(40);
        }
    }

    spawnPowerUp() {
        if (this.isGameOver) return;

        const { width } = this.cameras.main;
        const powerUp = this.powerUps.create(width + 100, CONFIG.groundY - 100, 'broom');
        powerUp.setScale(0.5);
        powerUp.body.setAllowGravity(false);
        powerUp.body.setVelocityX(-this.gameSpeed * 50);
        powerUp.setDepth(45);

        // Floating animation
        this.tweens.add({
            targets: powerUp,
            y: powerUp.y - 20,
            duration: 500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Glow effect
        powerUp.setTint(0xffff00);
    }

    collectCoin(player, coin) {
        // Score popup
        const popup = this.add.text(coin.x, coin.y, '+₹10', {
            fontFamily: '"Press Start 2P"',
            fontSize: '14px',
            color: '#ffd700',
            stroke: '#000',
            strokeThickness: 2
        }).setOrigin(0.5).setDepth(300);

        this.tweens.add({
            targets: popup,
            y: popup.y - 50,
            alpha: 0,
            scale: 1.5,
            duration: 600,
            onComplete: () => popup.destroy()
        });

        this.coins++;
        this.score += 10;
        coin.destroy();

        this.coinsText.setText(this.coins.toString());
        this.scoreText.setText(this.score.toString());
    }

    collectPowerUp(player, powerUp) {
        // Activate shield
        this.hasShield = true;
        this.shieldTime = 5000;
        this.shieldIndicator.setVisible(true);

        // Visual effect on player
        this.player.setTint(0x00ff00);

        // Popup
        const popup = this.add.text(powerUp.x, powerUp.y, 'SHIELD!', {
            fontFamily: '"Press Start 2P"',
            fontSize: '16px',
            color: '#00ff00',
            stroke: '#000',
            strokeThickness: 3
        }).setOrigin(0.5).setDepth(300);

        this.tweens.add({
            targets: popup,
            y: popup.y - 60,
            alpha: 0,
            scale: 1.5,
            duration: 800,
            onComplete: () => popup.destroy()
        });

        this.score += 50;
        this.scoreText.setText(this.score.toString());

        powerUp.destroy();
    }

    hitObstacle(player, obstacle) {
        if (this.isGameOver) return;

        // Check if sliding over pothole
        if (this.isSliding && obstacle.obstacleType === 'pothole') {
            return; // Jump over or slide through potholes
        }

        // Shield protection
        if (this.hasShield) {
            this.hasShield = false;
            this.shieldIndicator.setVisible(false);
            this.player.clearTint();

            // Destroy the obstacle with effect
            this.cameras.main.flash(200, 0, 255, 0);
            obstacle.destroy();
            return;
        }

        this.gameOver();
    }

    gameOver() {
        this.isGameOver = true;

        // Stop timers
        this.obstacleTimer.remove();
        this.coinTimer.remove();
        this.powerUpTimer.remove();

        // Stop player
        this.player.body.setVelocity(0, 0);
        this.player.body.setAllowGravity(false);
        this.player.stop();
        this.player.setTint(0xff0000);

        // Camera effects
        this.cameras.main.shake(400, 0.03);
        this.cameras.main.flash(300, 255, 0, 0);

        // Save high score
        const highScore = parseInt(localStorage.getItem('kejriHighScore') || 0);
        const isNewHighScore = this.score > highScore;
        if (isNewHighScore) {
            localStorage.setItem('kejriHighScore', this.score);
        }

        // Transition to game over
        this.time.delayedCall(1200, () => {
            this.scene.start('GameOver', {
                score: this.score,
                coins: this.coins,
                distance: Math.floor(this.distance),
                isNewHighScore: isNewHighScore
            });
        });
    }

    update(time, delta) {
        if (this.isGameOver) return;

        // Increase speed
        if (this.gameSpeed < CONFIG.speed.max) {
            this.gameSpeed += CONFIG.speed.increment;
        }

        // Update distance and score
        this.distance += this.gameSpeed * 0.02;
        this.score += Math.floor(this.gameSpeed * 0.05);

        // Update UI
        this.scoreText.setText(this.score.toString());
        this.distanceText.setText(Math.floor(this.distance) + 'm');
        this.speedText.setText((this.gameSpeed / CONFIG.speed.initial).toFixed(1) + 'x');

        // Shield timer
        if (this.hasShield) {
            this.shieldTime -= delta;
            if (this.shieldTime <= 0) {
                this.hasShield = false;
                this.shieldIndicator.setVisible(false);
                this.player.clearTint();
            }
        }

        // Check if player landed
        if (this.player.body.touching.down) {
            if (this.isJumping) {
                this.isJumping = false;
                if (!this.isSliding) {
                    this.player.play('run');
                }
                this.createDustParticles();
            }
        }

        // Parallax background scrolling
        const bgSpeed = this.gameSpeed * 0.3;
        this.bg1.x -= bgSpeed;
        this.bg2.x -= bgSpeed;

        if (this.bg1.x + this.bg1.displayWidth < 0) {
            this.bg1.x = this.bg2.x + this.bg2.displayWidth;
        }
        if (this.bg2.x + this.bg2.displayWidth < 0) {
            this.bg2.x = this.bg1.x + this.bg1.displayWidth;
        }

        // Scroll road markings
        this.roadMarks.forEach(mark => {
            mark.x -= this.gameSpeed;
            if (mark.x < -50) mark.x += 1200;
        });

        // Update road tile
        this.road1.tilePositionX += this.gameSpeed;

        // Update player shadow
        this.playerShadow.x = this.player.x;
        this.playerShadow.setScale(1, 0.3 + (Math.abs(this.player.y - CONFIG.groundY) / 500));

        // Update obstacle velocities
        this.obstacles.getChildren().forEach(obs => {
            obs.body.setVelocityX(-this.gameSpeed * 50);
            if (obs.x < -100) obs.destroy();
        });

        // Update coin velocities
        this.coinGroup.getChildren().forEach(coin => {
            coin.body.setVelocityX(-this.gameSpeed * 50);
            if (coin.x < -50) coin.destroy();
        });

        // Update power-up velocities
        this.powerUps.getChildren().forEach(pu => {
            pu.body.setVelocityX(-this.gameSpeed * 50);
            if (pu.x < -50) pu.destroy();
        });
    }
}

// ============================================
// GAME OVER SCENE
// ============================================
class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOver' });
    }

    init(data) {
        this.finalScore = data.score || 0;
        this.coinsCollected = data.coins || 0;
        this.distanceTraveled = data.distance || 0;
        this.isNewHighScore = data.isNewHighScore || false;
    }

    create() {
        const { width, height } = this.cameras.main;
        this.cameras.main.fadeIn(500);

        // Dark overlay
        const overlay = this.add.graphics();
        overlay.fillGradientStyle(0x1a1a2e, 0x1a1a2e, 0x302b63, 0x302b63);
        overlay.fillRect(0, 0, width, height);

        // Game Over title
        const title = this.add.text(width / 2, 70, 'GAME OVER', {
            fontFamily: '"Press Start 2P"',
            fontSize: '40px',
            color: '#ff6b6b',
            stroke: '#000',
            strokeThickness: 6
        }).setOrigin(0.5);

        this.tweens.add({
            targets: title,
            scale: 1.05,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // New high score banner
        if (this.isNewHighScore) {
            const banner = this.add.text(width / 2, 120, '🏆 NEW HIGH SCORE! 🏆', {
                fontFamily: '"Press Start 2P"',
                fontSize: '16px',
                color: '#ffd700'
            }).setOrigin(0.5);

            this.tweens.add({
                targets: banner,
                alpha: 0.5,
                duration: 400,
                yoyo: true,
                repeat: -1
            });
        }

        // Stats panel
        this.createStatsPanel(width / 2, height / 2);

        // Buttons
        this.createButton(width / 2 - 110, height - 100, 'RETRY', 0x138808, () => {
            this.scene.start('Game');
        });

        this.createButton(width / 2 + 110, height - 100, 'MENU', 0xff9933, () => {
            this.scene.start('Menu');
        });

        // Quick restart
        this.input.keyboard.once('keydown-SPACE', () => this.scene.start('Game'));

        this.add.text(width / 2, height - 40, 'Press SPACE to play again', {
            fontFamily: 'Poppins',
            fontSize: '12px',
            color: 'rgba(255,255,255,0.5)'
        }).setOrigin(0.5);
    }

    createStatsPanel(x, y) {
        const panelWidth = 320;
        const panelHeight = 180;

        // Panel
        const panel = this.add.graphics();
        panel.fillStyle(0x1a1a2e, 0.95);
        panel.fillRoundedRect(x - panelWidth / 2, y - panelHeight / 2, panelWidth, panelHeight, 16);
        panel.lineStyle(3, 0xff9933, 0.6);
        panel.strokeRoundedRect(x - panelWidth / 2, y - panelHeight / 2, panelWidth, panelHeight, 16);

        const stats = [
            { label: 'SCORE', value: this.finalScore, color: '#ffd700', icon: '⭐' },
            { label: 'RUPEES', value: '₹' + this.coinsCollected, color: '#ffffff', icon: '💰' },
            { label: 'DISTANCE', value: this.distanceTraveled + 'm', color: '#87ceeb', icon: '📏' }
        ];

        stats.forEach((stat, i) => {
            const yPos = y - 60 + (i * 55);

            // Icon and label
            this.add.text(x - 130, yPos - 5, stat.icon + ' ' + stat.label, {
                fontFamily: 'Poppins',
                fontSize: '14px',
                color: 'rgba(255,255,255,0.6)'
            });

            // Animated value
            const valueText = this.add.text(x + 100, yPos - 5, '0', {
                fontFamily: '"Press Start 2P"',
                fontSize: '18px',
                color: stat.color
            }).setOrigin(1, 0);

            // Animate counting up
            const finalVal = parseInt(stat.value) || 0;
            this.tweens.addCounter({
                from: 0,
                to: finalVal,
                duration: 1200,
                delay: i * 150,
                ease: 'Power2',
                onUpdate: (tween) => {
                    const val = Math.floor(tween.getValue());
                    if (stat.label === 'RUPEES') {
                        valueText.setText('₹' + val);
                    } else if (stat.label === 'DISTANCE') {
                        valueText.setText(val + 'm');
                    } else {
                        valueText.setText(val.toString());
                    }
                }
            });
        });
    }

    createButton(x, y, text, color, callback) {
        const btn = this.add.container(x, y);

        const bg = this.add.graphics();
        bg.fillStyle(color);
        bg.fillRoundedRect(-75, -22, 150, 44, 10);
        bg.lineStyle(2, 0xffffff, 0.2);
        bg.strokeRoundedRect(-75, -22, 150, 44, 10);

        const label = this.add.text(0, 0, text, {
            fontFamily: '"Press Start 2P"',
            fontSize: '14px',
            color: '#ffffff'
        }).setOrigin(0.5);

        btn.add([bg, label]);
        btn.setSize(150, 44);
        btn.setInteractive({ useHandCursor: true });

        btn.on('pointerover', () => btn.setScale(1.1));
        btn.on('pointerout', () => btn.setScale(1));
        btn.on('pointerdown', () => {
            this.cameras.main.fadeOut(300);
            this.cameras.main.once('camerafadeoutcomplete', callback);
        });

        // Entrance animation
        btn.setAlpha(0);
        btn.y += 30;
        this.tweens.add({
            targets: btn,
            alpha: 1,
            y: y,
            duration: 500,
            delay: 600,
            ease: 'Back.easeOut'
        });

        return btn;
    }
}

// ============================================
// INITIALIZE GAME
// ============================================
window.addEventListener('DOMContentLoaded', () => {
    const game = new Phaser.Game({
        type: Phaser.AUTO,
        width: CONFIG.width,
        height: CONFIG.height,
        parent: 'game-canvas',
        backgroundColor: '#1a1a2e',
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 },
                debug: false
            }
        },
        scene: [BootScene, PreloadScene, MenuScene, GameScene, GameOverScene],
        render: {
            pixelArt: false,
            antialias: true
        },
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH
        }
    });

    // Prevent spacebar scrolling
    window.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && e.target === document.body) {
            e.preventDefault();
        }
    });
});
