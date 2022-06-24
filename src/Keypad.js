import * as PIXI from "pixi.js";
import { Button } from "./Button";

const buttonLayout = {
  0: [3, 1],
  1: [0, 0],
  2: [0, 1],
  3: [0, 2],
  4: [1, 0],
  5: [1, 1],
  6: [1, 2],
  7: [2, 0],
  8: [2, 1],
  9: [2, 2],
  back: [0, 3],
  redx: [1, 3],
  enter: [3, 2]
};

export class Keypad extends PIXI.Container {
  constructor(textures, btnHeight = 60, btnWidth = 60, padding = 10) {
    super();

    const borderThickness = 3;
    const inputHeight = btnHeight + padding;

    const buttonContainer = new PIXI.Container();
    for (const btn in buttonLayout) {
      const [row, col] = buttonLayout[btn];
      const x = col * btnWidth + (col + 1) * padding + borderThickness;
      const y = row * btnHeight + ((row + 1) * padding) / 2 + borderThickness;
      const up = textures[`${btn}_up.png`];
      const down = textures[`${btn}_dn.png`];
      const button = new Button(
        up,
        down,
        btn,
        x,
        y,
        btnWidth * (up.frame.width / up.frame.height),
        btnHeight,
        (v) => {
          if (btn >= 0 && btn <= 9 && this.inputText.text.length < 10) {
            this.inputText.text = `${this.inputText.text}${btn}`;
          }

          if (btn === "redx") this.inputText.text = ``;

          if (btn === "back")
            this.inputText.text = this.inputText.text.slice(0, -1);

          if (btn === "enter") {
            if (this.inputText.text.length > 0) {
              console.log(
                `Value entered: ${parseInt(
                  this.inputText.text,
                  10
                )}, MAX_SAFE_INTEGER: ${Number.MAX_SAFE_INTEGER}`
              );
              this.inputText.text = ``;
            }
          }
        },
        () => {}
      );

      buttonContainer.addChild(button);
    }

    console.log(
      `width: ${buttonContainer.width}, height: ${buttonContainer.height}`
    );

    const height = 40;

    const box = new PIXI.Graphics();
    box.beginFill(0x000);
    box.drawRoundedRect(
      0,
      0,
      buttonContainer.width + padding * 2 + borderThickness,
      buttonContainer.height + padding + inputHeight,
      5
    );
    box.alpha = 0.2;
    this.addChild((this.box = box));

    // the linestyle borderWidth will straddle the line, resulting in the overall size to be
    // height + borderWidth. We are doing some math here to draw the border inside the box
    const borderWidth = buttonContainer.width + padding * 2;
    const borderOffset = borderThickness / 2;

    const borderHeight = buttonContainer.height + padding;
    const borderHeightOffset = borderThickness / 2;

    const outline = new PIXI.Graphics();
    outline.lineStyle(borderThickness, 0x171d22);
    outline.drawRoundedRect(
      borderOffset,
      borderHeightOffset,
      borderWidth,
      borderHeight + inputHeight,
      3
    );

    const inputBox = new PIXI.Graphics();
    inputBox.beginFill(0x000);
    inputBox.drawRoundedRect(
      0,
      0,
      buttonContainer.width + padding * 2 + borderThickness,
      inputHeight,
      5
    );
    inputBox.alpha = 0.6;
    this.addChild((this.inputBox = inputBox));

    this.outline = outline;
    this.addChild(this.outline);

    buttonContainer.position.y = inputHeight;
    this.addChild(buttonContainer);

    const inputText = new PIXI.Text("", {
      fontFamily: "Arial",
      fontSize: 48,
      fill: 0xffffff,
      align: "right"
    });

    inputText.anchor.x = 1;
    inputText.x = buttonContainer.width; //padding + borderThickness;
    inputText.y = padding + borderThickness;
    this.addChild((this.inputText = inputText));
  }
}
