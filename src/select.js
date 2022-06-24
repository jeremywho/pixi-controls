import * as PIXI from "pixi.js";

export class Select extends PIXI.Container {
  get width() {
    return super.width;
  }

  set width(width) {
    super.width = width;
    console.log(
      "Select: changing width after creation not yet supported. Trying to set width to:",
      width
    );
  }

  get selected() {
    return this._selected;
  }

  set selected(s) {
    this._selected = s;
    if (this.selectedText) this.selectedText.text = this.data.options[s];
    this.data.onChange && this.data.onChange(this._selected);
  }

  onMouseUp() {
    if (this.mouseOutsideMenu && this.menu?.visible === true) {
      this.setMenuVisibility(false);
    }
  }

  setMenuVisibility(isVisible) {
    this.menu.visible = isVisible;

    if (isVisible) {
      window[this.uuid] = () => this.onMouseUp();
      window.addEventListener("mouseup", window[this.uuid]);
    } else {
      window.removeEventListener("mouseup", window[this.uuid]);
    }
  }

  toggleMenu() {
    this.setMenuVisibility(!this.menu.visible);
  }

  createTriangle(triangleWidth) {
    var triangle = new PIXI.Graphics();

    var triangleHeight = triangleWidth,
      triangleHalfway = triangleWidth / 2;

    // draw triangle
    triangle.beginFill(0x000);
    triangle.moveTo(0, 0);
    triangle.lineTo(triangleWidth, 0);
    triangle.lineTo(triangleHalfway, triangleHeight * 0.6);
    triangle.endFill();

    return triangle;
  }

  createSelectOption(key, index) {
    const padding = 10;
    const y = super.height * index + super.height;

    let option = new PIXI.Container();
    option.interactive = true;
    option.buttonMode = true;

    // adding a background layer to conver up anything behind the menu
    // if we don't do this, when mouse over sets alpha, items behind
    // the menu show through.
    const mainBg = new PIXI.Graphics();
    mainBg.beginFill(0x1099bb);
    mainBg.drawRect(0, y, super.width, super.height);
    mainBg.endFill();
    option.addChild(mainBg);

    const main = new PIXI.Graphics();
    main.beginFill(0xf0f0f0);
    main.drawRect(0, y, super.width, super.height);
    main.endFill();

    option.addChild(main);

    const text = new PIXI.Text(this.data.options[key]);
    text.anchor.y = 0.5;
    text.x = padding;
    text.y = y + super.height / 2;
    option.addChild(text);

    option.on("pointerover", () => {
      text.style.fontWeight = "bold";
      main.alpha = 0.85;
    });

    option.on("pointerout", () => {
      text.style.fontWeight = "normal";
      main.alpha = 1.0;
    });

    option.on("pointerup", () => {
      this.selected = key;
      text.style.fontWeight = "normal";
      main.alpha = 1.0;
      this.setMenuVisibility(false);
    });

    return option;
  }

  constructor(width = 350, height = 50, data) {
    super();

    this.uuid = crypto.randomUUID();

    super.width = 350;
    super.height = 50;

    this.leftPadding = 10;

    this.data = data;
    this.interactive = true;
    this.mouseOutsideMenu = true;

    this.pointerover = () => (this.mouseOutsideMenu = false);
    this.pointerout = () => (this.mouseOutsideMenu = true);

    const rectangle = new PIXI.Graphics();
    rectangle.beginFill(0xe6e6e6);
    rectangle.drawRoundedRect(0, 0, width, height, 5);
    rectangle.endFill();

    rectangle.pointerover = () => (this.rectangle.alpha = 0.9);
    rectangle.pointerout = () => (this.rectangle.alpha = 1);
    rectangle.on("pointerup", () => this.toggleMenu());

    rectangle.interactive = true;
    rectangle.buttonMode = true;
    this.rectangle = rectangle;
    this.addChild(this.rectangle);

    const downArrow = this.createTriangle(12);
    downArrow.position.x = super.width - downArrow.width * 2;
    downArrow.position.y = super.height / 2 - downArrow.height / 2;
    this.addChild(downArrow);

    this.selectedText = new PIXI.Text(data.options[data.selected] ?? "");
    this.selectedText.anchor.y = 0.5;
    this.selectedText.y = super.height / 2;
    this.selectedText.x = this.leftPadding;
    this.addChild(this.selectedText);

    const menu = new PIXI.Container();
    menu.visible = false;
    menu.interactive = true;

    let index = 0;
    for (const key in this.data.options) {
      const option = this.createSelectOption(key, index++);
      menu.addChild(option);
    }

    this.menu = menu;
    this.addChild(this.menu);

    this.selected = data.selected ?? "";
  }
}
