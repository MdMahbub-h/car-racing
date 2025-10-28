class StartScene extends Phaser.Scene {
  constructor() {
    super({ key: "StartScene" });
  }

  create() {
    console.log("start");
    // Background
    this.speed = 1;
    // this.scene.start("GameScene");

    this.bg = this.add.tileSprite(300, 650, 600, 1300, "bg");

    this.timerBG = this.add
      .image(30, 150, "timer")
      .setOrigin(0, 0)
      .setScale(0.55);
    this.scoreBG = this.add
      .image(570, 150, "score")
      .setOrigin(1, 0)
      .setScale(0.55);

    this.timerText = this.add
      .text(88, 180, "2:00", {
        fontFamily: "MyGameFont",
        fontSize: "25px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.scoreText = this.add
      .text(600 - 160, 180, "0", {
        fontFamily: "MyGameFont",
        fontSize: "25px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0, 0.5);
    // this.add.rectangle(300, 650, 600, 1300, 0x000000).setAlpha(0.4);

    // const title = this.add.text(300, 300, "RACING CAR", {
    //   fontFamily: "Nunito, sans-serif",
    //   fontStyle: "bold italic",
    //   fontSize: "60px",
    //   color: "#ffffffff",
    //   align: "center",
    // });
    // title.setOrigin(0.5);

    // const speedText = this.add.text(300, 900, "SPEED", {
    //   fontFamily: "Nunito, sans-serif",
    //   fontStyle: "bold italic",
    //   fontSize: "50px",
    //   color: "#ffffffff",
    //   align: "center",
    // });
    // speedText.setOrigin(0.5);

    // this.speedTexts = [];

    // for (let i = 0; i < 3; i++) {
    //   let speedText = this.add
    //     .text(200 + 100 * i, 1000, `${i + 2}X`, {
    //       fontFamily: "Nunito, sans-serif",
    //       fontStyle: "bold italic",
    //       fontSize: "40px",
    //       color: "#ffffffff",
    //       align: "center",
    //     })
    //     .setOrigin(0.5)
    //     .setInteractive({ useHandCursor: true })
    //     .on("pointerdown", () => {
    //       this.speed = i + 2;

    //       // Reset all colors to white
    //       this.speedTexts.forEach((t) => t.setColor("#ffffffff"));

    //       // Highlight selected one
    //       speedText.setColor("#f9a600ff");
    //     });

    //   this.speedTexts.push(speedText);
    // }

    // // Instructions
    // const instructions = this.add.text(
    //   300,
    //   500,
    //   "Use arrow keys\n to move. Avoid\nobstacles and\nReach the finish line!",
    //   {
    //     fontFamily: "Nunito, sans-serif",
    //     fontStyle: "bold italic",
    //     fontSize: "45px",
    //     color: "#f9a600ff",
    //     align: "center",
    //   }
    // );
    // instructions.setOrigin(0.5);

    // Player car
    this.player = this.physics.add.sprite(250, 950, "ic_jazi_car");
    this.player.setCollideWorldBounds(true);
    this.player.setScale(0.9).setOrigin(0.5, 0);

    // Play button
    const playButton = this.add
      .image(300, 1150, "startBtn")
      .setInteractive({ useHandCursor: true })
      .setOrigin(0.5)
      .setScale(0.5);

    // Add interactive behavior
    playButton.on("pointerdown", () => {
      // Add a scale bounce tween for press feedback
      this.tweens.add({
        targets: playButton,
        scale: 0.45,
        duration: 100,
        ease: "Power1",
        yoyo: true,
        onComplete: () => {
          console.log("1");
          this.scene.start("GameScene");
        },
      });
    });

    const fx = playButton.postFX.addShine(0.3, 0.1, 0.2);

    // Optional: hover effect for desktop
    playButton.on("pointerover", () => {
      this.tweens.add({
        targets: playButton,
        scale: 0.52,
        duration: 120,
        ease: "Power2",
      });
    });

    playButton.on("pointerout", () => {
      this.tweens.add({
        targets: playButton,
        scale: 0.5,
        duration: 120,
        ease: "Power2",
      });
    });
  }
}

export default StartScene;
