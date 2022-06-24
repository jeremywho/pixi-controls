import * as PIXI from "pixi.js";

export class Button extends PIXI.Sprite {
  constructor(
    up,
    dn,
    data,
    x,
    y,
    w,
    h,
    upHandler,
    dnHandler,
    longPressHandler
  ) {
    super(up);

    this.up = up;
    this.dn = dn;

    this.isToggleButton = false;
    this.isToggled = false;
    this.isEnabled = true;

    this.upHandler = upHandler;
    this.dnHandler = dnHandler;
    this.longPressHandler = longPressHandler;
    this.userData = data;

    this.pointerdown = () => this.onButtonDown();
    this.pointerup = () => this.onButtonUp();
    this.pointerupoutside = () => this.onButtonUpOutside();

    this.interactive = true;
    this.buttonMode = true;
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.isdown = false;
  }

  reset() {
    this.isToggled = false;
    this.isdown = false;
    this.texture = this.up;
  }

  hide() {
    this.visible = false;
    this.isdown = true;
    this.texture = this.up;
  }

  show() {
    this.visible = true;
    this.isdown = false;
  }

  onButtonDown() {
    if (!this.isEnabled) return;
    this.isdown = true;
    this.texture = this.dn;
    if (this.dnHandler) this.dnHandler(this, this.userData);

    if (this.longPressHandler) {
      var that = this;
      this.longPressId = setTimeout(() => {
        this.longPressId = undefined;
        if (that.isEnabled && that.isdown === true) {
          that.onButtonLongPress();
        }
      }, 2000);
    }
  }

  onButtonUp() {
    if (this.longPressId) {
      clearTimeout(this.longPressId);
      this.longPressId = undefined;
    }
    if (!this.isEnabled) return;
    if (!this.isdown) return;

    this.isdown = false;
    if (this.isToggleButton) {
      this.isToggled = !this.isToggled;
      if (this.isToggled) this.texture = this.dn;
      else this.texture = this.up;
    } else this.texture = this.up;

    if (this.upHandler) this.upHandler(this, this.userData);
  }

  onButtonLongPress() {
    if (!this.isEnabled) return;
    if (!this.isdown) return;

    this.isdown = false;
    if (this.isToggleButton) {
      this.isToggled = !this.isToggled;
      if (this.isToggled) this.texture = this.dn;
      else this.texture = this.up;
    } else this.texture = this.up;

    if (this.longPressHandler) this.longPressHandler(this, this.userData);
    else if (this.upHandler) this.upHandler(this, this.userData);
  }

  setToggled(state) {
    this.isToggled = state;
    if (this.isToggled) this.texture = this.dn;
    else this.texture = this.up;
  }

  setEnabled(state) {
    this.isEnabled = state;
  }

  onButtonUpOutside() {
    if (this.longPressId) {
      clearTimeout(this.longPressId);
      this.longPressId = undefined;
    }

    this.isdown = false;
    this.texture = this.up;
  }
}
