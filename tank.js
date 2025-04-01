class Tank { constructor(scene, x, y, texture, playerName) { this.scene = scene; this.sprite = scene.physics.add.sprite(x, y, texture); this.sprite.setCollideWorldBounds(true); this.speed = 100; this.bullets = scene.physics.add.group(); this.explosionEffect = scene.add.particles('explosion'); this.nameTag = scene.add.text(x, y - 30, playerName, { fontSize: '12px', fill: '#fff' }); }

update(cursors) {
    this.sprite.setVelocity(0);
    if (cursors.left.isDown) this.sprite.setAngle(this.sprite.angle - 3);
    if (cursors.right.isDown) this.sprite.setAngle(this.sprite.angle + 3);
    if (cursors.up.isDown) {
        this.scene.physics.velocityFromRotation(
            Phaser.Math.DegToRad(this.sprite.angle),
            this.speed,
            this.sprite.body.velocity
        );
    }
    this.nameTag.setPosition(this.sprite.x, this.sprite.y - 30);
}

shoot() {
    let bullet = this.bullets.create(this.sprite.x, this.sprite.y, 'bullet');
    this.scene.physics.velocityFromRotation(
        Phaser.Math.DegToRad(this.sprite.angle),
        300,
        bullet.body.velocity
    );
    this.scene.time.delayedCall(2000, () => bullet.destroy());
}

explode() {
    this.explosionEffect.createEmitter({
        x: this.sprite.x,
        y: this.sprite.y,
        speed: 200,
        scale: { start: 1, end: 0 },
        lifespan: 500,
    });
    this.sprite.destroy();
    this.nameTag.destroy();
}

}

class GameScene extends Phaser.Scene { constructor() { super({ key: 'GameScene' }); }

preload() {
    this.load.image('tank', 'tank.png');
    this.load.image('bullet', 'bullet.png');
    this.load.image('explosion', 'explosion.png');
}

create() {
    this.tank = new Tank(this, 400, 300, 'tank', 'Player 1');
    this.cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.on('keydown-SPACE', () => this.tank.shoot());
}

update() {
    this.tank.update(this.cursors);
}

}

const config = { type: Phaser.AUTO, width: 800, height: 600, physics: { default: 'arcade', arcade: { debug: false } }, scene: GameScene, };

const game = new Phaser.Game(config);