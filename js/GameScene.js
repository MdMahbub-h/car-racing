class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }
  init(data) {
    this.playerSpeed = data.speed;
  }
  create() {
    this.score = 0;
    this.timer = 0;
    this.finishTime = 2 * 60;
    // this.playerSpeed = 2;

    this.bgAudio = this.sound.add("bgaudio", { loop: true, volume: 0.5 });

    this.bgAudio.play();

    this.finishLineTime = this.finishTime - 15;
    this.directionInput = this.add
      .rectangle(0, 0, 600, 1300, 0x000000)
      .setOrigin(0)
      .setAlpha(0.4)
      .setInteractive();
    this.bg = this.add.tileSprite(300, 650, 600, 1300, "bg");
    this.timerBG = this.add
      .image(30, 50, "timer")
      .setOrigin(0, 0)
      .setScale(0.55)
      .setDepth(10);
    this.scoreBG = this.add
      .image(570, 50, "score")
      .setOrigin(1, 0)
      .setScale(0.55)
      .setDepth(10);
    this.timerText = this.add
      .text(88, 80, `0`, {
        fontFamily: "Nunito, sans-serif",
        fontStyle: "bold italic",
        fontSize: "25px",
        color: "#ffffff",
      })
      .setOrigin(0.5)
      .setDepth(10);
    this.updateTime(0);
    // 🔁 update every second
    this.time.addEvent({
      delay: 1000, // 1 second
      callback: () => {
        if (this.finishTime > 0) {
          this.finishLineTime--;
          this.updateTime(-1);
        } else {
          // ⏰ time’s up
          this.time.removeAllEvents();
          console.log("Time over!");

          this.loseSound = this.sound.add("lose-sound", { volume: 1 });
          setTimeout(() => {
            this.scene.start("EndScene", {
              won: false,
              score: this.score,
              time: this.finishTime,
            });
          }, 500);
        }
      },
      loop: true,
    });

    this.scoreText = this.add
      .text(600 - 160, 80, "0", {
        fontFamily: "Nunito, sans-serif",
        fontStyle: "bold italic",
        fontSize: "25px",
        color: "#ffffff",
      })
      .setOrigin(0, 0.5)
      .setDepth(10);

    // Player car
    this.player = this.physics.add.sprite(300, 1000, "ic_jazi_car"); //140 250 350 460
    this.player.setCollideWorldBounds(true);
    this.player.setScale(0.75).setDepth(5).setOrigin(0.5, 0);

    // --- Define all groups and overlap callbacks ---
    const overlapItems = [
      { key: "obstacles", callback: this.hitObstacle },
      { key: "trophy", callback: this.hitTrophy },
      { key: "bonusTime", callback: this.hitbonusTime },
      { key: "coins", callback: this.hitCoins },
      { key: "finishLine", callback: this.hitFinishLine },
    ];

    // --- Create groups dynamically ---
    overlapItems.forEach(({ key }) => {
      this[key] = this.physics.add.group();
    });

    // --- Add overlaps dynamically ---
    overlapItems.forEach(({ key, callback }) => {
      this.physics.add.overlap(this.player, this[key], callback, null, this);
    });

    // Input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.moveDir = { left: false, right: false, upDown: 0 };

    // --- Pointer down/up for each area ---
    this.directionInput.on("pointerdown", (pointer) => {
      if (pointer.x > this.player.x + 50) {
        this.moveDir.right = true;
      } else if (pointer.x < this.player.x - 50) {
        this.moveDir.left = true;
      } else if (pointer.y < this.player.y) {
        this.moveDir.upDown = -1; // pressed above -> move up
      } else if (pointer.y > this.player.y + 120) {
        this.moveDir.upDown = 1; // pressed below -> move down
      }
    });
    this.directionInput.on("pointerup", () => {
      this.moveDir = { left: false, right: false, upDown: 0 };
    });
    this.input.on("pointerupoutside", () => {
      this.moveDir = { left: false, right: false, upDown: 0 };
    });

    // Timer for spawning obstacles
    this.time.addEvent({
      delay: 3200 / this.playerSpeed,
      callback: this.spawnObstacle,
      callbackScope: this,
      loop: true,
    });
  }
  updateTime(add) {
    this.finishTime = this.finishTime + add;
    this.timerText.setText(
      `${Math.floor(this.finishTime / 60)}:${(this.finishTime % 60)
        .toString()
        .padStart(2, "0")}`
    );
  }
  updateScore(add) {
    this.score = this.score + add;
    this.scoreText.setText(this.score);
  }

  update() {
    this.bg.tilePositionY -= 2 * this.playerSpeed;

    let vx = 0;
    let vy = 0;

    // Keyboard OR touch controls
    if ((this.cursors.left.isDown || this.moveDir.left) && this.player.x > 130)
      vx = -200 * (1 + 0.5 * (this.playerSpeed - 1));
    else if (
      (this.cursors.right.isDown || this.moveDir.right) &&
      this.player.x < 470
    )
      vx = 200 * (1 + 0.5 * (this.playerSpeed - 1));

    if (this.cursors.up.isDown || this.moveDir.upDown === -1)
      vy = -200 * (1 + 0.5 * (this.playerSpeed - 1));
    else if (this.cursors.down.isDown || this.moveDir.upDown === 1)
      vy = 200 * (1 + 0.5 * (this.playerSpeed - 1));

    this.player.setVelocity(vx, vy);
  }

  spawnObstacle() {
    const lene = [140, 250, 350, 460];
    const x = Phaser.Utils.Array.GetRandom(lene);

    if (this.finishLineTime <= 0) {
      this.finised = true;
    }

    if (!this.finised) {
      if (Phaser.Math.Between(1, 10) <= 3) {
        if (Phaser.Math.Between(1, 3) <= 1) {
          if (Phaser.Math.Between(1, 2) <= 1) {
            const obstacleKey = "ic_clock";
            const obstacle = this.bonusTime.create(x, -100, obstacleKey);
            obstacle.setVelocityY(this.playerSpeed * 115); // Slower than background speed (2)
            obstacle.setScale(0.6);
          } else {
            const obstacleKey = "ic_trophy";
            const obstacle = this.trophy.create(x, -100, obstacleKey);
            obstacle.setVelocityY(this.playerSpeed * 115); // Slower than background speed (2)
            obstacle.setScale(1);
          }
        } else {
          const obstacleKey = "ic_icon";
          const obstacle = this.coins.create(x, -100, obstacleKey);
          obstacle.setVelocityY(this.playerSpeed * 115); // Slower than background speed (2)
          obstacle.setScale(0.5);
        }
      } else {
        const obstacleKey = "ic_blocker_" + Phaser.Math.Between(1, 5);
        const obstacle = this.obstacles.create(x, -100, obstacleKey);
        obstacle.setVelocityY(this.playerSpeed * 50); // Slower than background speed (2)
        obstacle.setScale(1.4);
        obstacle.setDepth(3);
      }
    } else {
      const obstacleKey = "ic_finish_line";
      const obstacle = this.finishLine.create(350, -100, obstacleKey);
      obstacle.setVelocityY(this.playerSpeed * 115); // Slower than background speed (2)
      obstacle.setScale(1);
      obstacle.setDepth(6);
      obstacle.setOrigin(0.5, 1);
    }
  }

  hitObstacle(player, obstacle) {
    obstacle.disableBody(true, true);
    this.finishTime -= 10;
    if (this.finishTime < 0) {
      this.finishTime = 0;
    }
    const minutes = Math.floor(this.finishTime / 60);
    const seconds = this.finishTime % 60;
    this.timerText.setText(`${minutes}:${seconds.toString().padStart(2, "0")}`);
  }

  hitCoins(player, obstacle) {
    obstacle.disableBody(true, true);
    this.score += 10;
    this.scoreText.setText(this.score);
  }
  hitTrophy(player, obstacle) {
    obstacle.disableBody(true, true);
    this.score += 50;
    this.scoreText.setText(this.score);
  }
  hitbonusTime(player, obstacle) {
    obstacle.disableBody(true, true);
    this.finishTime += 20;
    const minutes = Math.floor(this.finishTime / 60);
    const seconds = this.finishTime % 60;
    this.timerText.setText(`${minutes}:${seconds.toString().padStart(2, "0")}`);
  }
  hitFinishLine(player, obstacle) {
    this.time.removeAllEvents();
    this.bgAudio.stop();

    this.congratsSound = this.sound.add("congrats", { volume: 1 });
    this.congratsSound.play();
    setTimeout(() => {
      this.scene.start("EndScene", {
        won: true,
        score: this.score,
        time: this.finishTime,
      });
    }, 500);
  }
}

export default GameScene;
