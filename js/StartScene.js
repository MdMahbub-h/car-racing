class StartScene extends Phaser.Scene {
  constructor() {
    super({ key: "StartScene" });
  }

  create() {
    // Background
    // this.scene.start("GameScene");

    this.bg = this.add.tileSprite(300, 650, 600, 1300, "bg");

    this.timerBG = this.add
      .image(30, 50, "timer")
      .setOrigin(0, 0)
      .setScale(0.55);
    this.scoreBG = this.add
      .image(570, 50, "score")
      .setOrigin(1, 0)
      .setScale(0.55);

    this.timerText = this.add
      .text(88, 80, "2:00", {
        fontFamily: "Nunito, sans-serif",
        fontStyle: "bold italic",
        fontSize: "25px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    this.scoreText = this.add
      .text(600 - 160, 80, "0", {
        fontFamily: "Nunito, sans-serif",
        fontStyle: "bold italic",
        fontSize: "25px",
        color: "#ffffff",
      })
      .setOrigin(0, 0.5);
    this.add.rectangle(300, 650, 600, 1300, 0x000000).setAlpha(0.4);

    // Player car
    this.player = this.physics.add.sprite(300, 1000, "ic_jazi_car");
    this.player.setCollideWorldBounds(true);
    this.player.setScale(0.5);

    // Play button
    const playButton = this.add
      .image(300, 1100, "startBtn")
      .setInteractive()
      .setOrigin(0.55);
    playButton.on("pointerdown", () => {
      this.scene.start("GameScene");
    });

    // Instructions
    const instructions = this.add.text(
      300,
      700,
      "Use arrow keys\n to move. Avoid\nobstacles and\nReach the finish line!",
      {
        fontFamily: "Nunito, sans-serif",
        fontStyle: "bold italic",
        fontSize: "45px",
        color: "#f9a600ff",
        align: "center",
      }
    );
    instructions.setOrigin(0.5);
  }
}

export default StartScene;
