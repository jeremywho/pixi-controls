import * as PIXI from "pixi.js";

export class CheckBox extends PIXI.Container {
  get value() {
    return this._value;
  }

  set value(v) {
    this._value = v;
    this.check.visible = this._value;
    this.onChanged(this._value);
  }

  constructor(name, isChecked, onChanged) {
    super();

    this._value = isChecked;
    this.onChanged = onChanged;

    const borderThickness = 3;
    const height = 40;

    const box = new PIXI.Graphics();
    box.beginFill(0xe6e6e6);
    box.drawRoundedRect(0, 0, height, height, 5);
    this.addChild((this.box = box));

    // the linestyle borderWidth will straddle the line, resulting in the overall size to be
    // height + borderWidth. We are doing some math here to draw the border inside the box
    const borderWidth = height - borderThickness;
    const borderOffset = borderThickness / 2;

    const outline = new PIXI.Graphics();
    outline.lineStyle(borderThickness, 0xc0c0c0);
    outline.drawRoundedRect(
      borderOffset,
      borderOffset,
      borderWidth,
      borderWidth,
      3
    );

    this.addChild((this.outline = outline));

    const label = new PIXI.Text(name);
    label.anchor.y = 0.5;
    label.x = height + 20;
    label.y = this.height / 2;
    this.addChild(label);

    const check = new PIXI.Text("✓");
    check.style.fontWeight = "bold";
    check.anchor.x = 0.5;
    check.anchor.y = 0.5;
    check.x = this.height / 2;
    check.y = this.height / 2;
    check.visible = isChecked;
    this.addChild((this.check = check));

    this.pointerup = () => (this.value = !this.value);
    this.pointerover = () => (this.box.alpha = this.outline.alpha = 0.8);
    this.pointerout = () => (this.box.alpha = this.outline.alpha = 1);

    this.interactive = true;
    this.buttonMode = true;
  }
}
