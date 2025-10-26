class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  create() {
    // Score
    this.score = 0;
    this.timer = 0;
    this.finishTime = 2 * 60;
    this.playerSpeed = 115;

    // this.scene.start("EndScene", {
    //   won: false,
    //   score: this.score,
    //   time: this.finishTime,
    // });

    // Background
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

    const minutes = Math.floor(this.finishTime / 60);
    const seconds = this.finishTime % 60;

    this.timerText = this.add
      .text(88, 80, `${minutes}:${seconds.toString().padStart(2, "0")}`, {
        fontFamily: "Nunito, sans-serif",
        fontStyle: "bold italic",
        fontSize: "25px",
        color: "#ffffff",
      })
      .setOrigin(0.5)
      .setDepth(10);

    // 🔁 update every second
    this.time.addEvent({
      delay: 1000, // 1 second
      callback: () => {
        if (this.finishTime > 0) {
          this.finishTime--;

          const minutes = Math.floor(this.finishTime / 60);
          const seconds = this.finishTime % 60;

          this.timerText.setText(
            `${minutes}:${seconds.toString().padStart(2, "0")}`
          );
        } else {
          // ⏰ time’s up
          this.time.removeAllEvents();
          console.log("Time over!");

          this.scene.start("EndScene", {
            won: false,
            score: this.score,
            time: this.finishTime,
          });
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
    this.player.setScale(0.6).setDepth(5);

    // Obstacles group
    this.obstacles = this.physics.add.group();
    this.trophy = this.physics.add.group();
    this.coins = this.physics.add.group();
    this.finishLine = this.physics.add.group();

    // Overlaps
    this.physics.add.overlap(
      this.player,
      this.obstacles,
      this.hitObstacle,
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.trophy,
      this.hitTrophy,
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.coins,
      this.hitCoins,
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.finishLine,
      this.hitFinishLine,
      null,
      this
    );

    // Input
    this.cursors = this.input.keyboard.createCursorKeys();

    // Timer for spawning obstacles
    this.time.addEvent({
      delay: 3500,
      callback: this.spawnObstacle,
      callbackScope: this,
      loop: true,
    });
  }

  update() {
    // Move background down
    this.bg.tilePositionY -= 2;

    // Player movement
    if (this.cursors.left.isDown && this.player.x > 120) {
      this.player.setVelocityX(-200);
    } else if (this.cursors.right.isDown && this.player.x < 480) {
      this.player.setVelocityX(200);
    } else {
      this.player.setVelocityX(0);
    }

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-200);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(200);
    } else {
      this.player.setVelocityY(0);
    }
  }

  spawnObstacle() {
    const lene = [140, 250, 350, 460];
    const x = Phaser.Utils.Array.GetRandom(lene);

    if (this.finishTime < 13) {
      this.finised = true;
    }

    if (!this.finised) {
      if (Phaser.Math.Between(1, 10) <= 3) {
        if (Phaser.Math.Between(1, 3) <= 1) {
          const obstacleKey = "ic_trophy";
          const obstacle = this.trophy.create(x, -100, obstacleKey);
          obstacle.setVelocityY(this.playerSpeed); // Slower than background speed (2)
          obstacle.setScale(1);
        } else {
          const obstacleKey = "ic_icon";
          const obstacle = this.coins.create(x, -100, obstacleKey);
          obstacle.setVelocityY(this.playerSpeed); // Slower than background speed (2)
          obstacle.setScale(0.5);
        }
      } else {
        const obstacleKey = "ic_blocker_" + Phaser.Math.Between(1, 5);
        const obstacle = this.obstacles.create(x, -100, obstacleKey);
        obstacle.setVelocityY(50); // Slower than background speed (2)
        obstacle.setScale(1);
      }
    } else {
      const obstacleKey = "ic_finish_line";
      const obstacle = this.finishLine.create(350, -100, obstacleKey);
      obstacle.setVelocityY(50); // Slower than background speed (2)
      obstacle.setScale(1);
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

  hitFinishLine(player, obstacle) {
    this.time.removeAllEvents();
    this.scene.start("EndScene", {
      won: true,
      score: this.score,
      time: this.finishTime,
    });
  }
}

export default GameScene;
