class EndScene extends Phaser.Scene {
  constructor() {
    super({ key: "EndScene" });
  }

  init(data) {
    this.won = data.won;
    this.score = data.score;
    this.finishTime = data.time;
  }

  create() {
    // Background
    this.bg = this.add.tileSprite(300, 650, 600, 1300, "bg");

    this.timerBG = this.add
      .image(30, 50, "timer")
      .setOrigin(0, 0)
      .setScale(0.55);
    this.scoreBG = this.add
      .image(570, 50, "score")
      .setOrigin(1, 0)
      .setScale(0.55);

    const minutes = Math.floor(this.finishTime / 60);
    const seconds = this.finishTime % 60;

    this.timerText = this.add
      .text(88, 80, `${minutes}:${seconds.toString().padStart(2, "0")}`, {
        fontFamily: "Nunito, sans-serif",
        fontStyle: "bold italic",
        fontSize: "25px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    this.scoreText = this.add
      .text(600 - 160, 80, this.score, {
        fontFamily: "Nunito, sans-serif",
        fontStyle: "bold italic",
        fontSize: "25px",
        color: "#ffffff",
      })
      .setOrigin(0, 0.5);
    // Player car
    this.player = this.physics.add.sprite(300, 1000, "ic_jazi_car");
    this.player.setCollideWorldBounds(true);
    this.player.setScale(0.75);
    this.add.rectangle(300, 650, 600, 1300, 0x000000).setAlpha(0.7);

    let wonText = `YOU FAIL !\n\nTOTAL POINTS\n\n${this.score}`;
    if (this.won) {
      wonText = `YOU WIN!!!\n\nTOTAL POINTS\n\n${
        this.score
      }\n\nREMAINING TIME\n\n${minutes}:${seconds.toString().padStart(2, "0")}`;
    }
    let LastText = this.add.text(300, 450, `${wonText}`, {
      fontFamily: "Nunito, sans-serif",
      fontStyle: "bold italic",
      fontSize: "45px",
      color: "#f9a600ff",
      align: "center",
    });
    LastText.setOrigin(0.5);

    let playAgainText = this.add.text(300, 1000, `PLAY AGAIN`, {
      fontFamily: "Nunito, sans-serif",
      fontStyle: "bold italic",
      fontSize: "35px",
      color: "#f9a600ff",
      align: "center",
    });
    playAgainText.setOrigin(0.5);

    const playButton = this.add
      .image(300, 1100, "startBtn")
      .setInteractive()
      .setOrigin(0.5);
    playButton.on("pointerdown", () => {
      this.scene.start("GameScene");
    });
  }
}

export default EndScene;
