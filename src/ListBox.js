import * as PIXI from "pixi.js";

export class ListBox extends PIXI.Container {
  drawRow(data, rowNum) {
    const rowContainer = new PIXI.Container();
    rowContainer.interactive = true;
    rowContainer.buttonMode = true;
    rowContainer.selected = false;

    const columnWidth =
      (this.width - this.borderThickness) / data.columns.length;
    const rowHeight = this.rowHeight;
    const rowY = rowNum * rowHeight;

    console.log(
      `Column width: ${columnWidth}, row: ${rowNum}, this.width: ${this.width}, data.columns.length: ${data.columns.length}`
    );

    const rowBlueBg = new PIXI.Graphics();
    rowBlueBg.beginFill(0x3498db);
    rowBlueBg.drawRect(
      this.borderThickness,
      rowY,
      this.width - this.borderThickness * 2,
      this.rowHeight
    );
    rowBlueBg.endFill();
    rowContainer.addChild((this.rowBlueBg = rowBlueBg));

    const rowWhiteBg = new PIXI.Graphics();
    rowWhiteBg.beginFill(0xe6e6e6);
    rowWhiteBg.drawRect(
      this.borderThickness,
      rowY,
      this.width - this.borderThickness * 2,
      this.rowHeight
    );
    rowWhiteBg.endFill();
    rowContainer.addChild((this.rowWhiteBg = rowWhiteBg));

    rowContainer.pointerover = () => {
      if (this.selected.has(data.id)) return;
      rowWhiteBg.alpha = 0.8;
    };

    rowContainer.pointerout = () => {
      if (this.selected.has(data.id)) return;
      rowWhiteBg.alpha = 1;
    };

    rowContainer.click = () => {
      if (this.selected.has(data.id)) {
        rowWhiteBg.alpha = 0.8;
        this.selected.delete(data.id);
      } else {
        rowWhiteBg.alpha = 0.5;
        this.selected.set(data.id, true);
      }
    };

    data.columns.forEach((name, i) => {
      const col = new PIXI.Container();
      col.width = columnWidth;
      col.height = rowHeight;
      col.x = i * columnWidth;
      col.y = rowY;

      const colText = new PIXI.Text(name);
      colText.anchor.x = 0.5;
      colText.anchor.y = 0.5;
      colText.x = columnWidth / 2;
      colText.y = rowHeight / 2;

      col.addChild(colText);
      rowContainer.addChild(col);

      if (i > 0) {
        var line = new PIXI.Graphics();
        line.lineStyle(2, 0xc0c0c0, 1);
        line.moveTo(i * columnWidth, rowHeight);
        line.lineTo(i * columnWidth, rowY + rowHeight);
        rowContainer.addChild(line);
      }
    });

    var sep = new PIXI.Graphics();
    const lineThickness = 2;
    sep.lineStyle(lineThickness, 0xc0c0c0, 1);
    sep.moveTo(lineThickness / 2, rowY + rowHeight);
    sep.lineTo(this.width - lineThickness / 2, rowY + rowHeight);
    rowContainer.addChild(sep);

    this.rowsContainer.addChild(rowContainer);
  }

  addRow(data) {
    const rowNum = this.rows.length + 1;
    this.rows.push(data);
    this.drawRow(data, rowNum);
    this.startingInnerBottom =
      (this.rowHeight + this.borderThickness - 1) * this.rows.length +
      this.rowsContainer.y +
      this.y;
  }

  addHeader(data) {
    const headerContainer = new PIXI.Container();
    const headerBg = new PIXI.Graphics();
    headerBg.beginFill(0xd1d1d1);
    headerBg.drawRect(
      this.borderThickness,
      this.borderThickness,
      this.width - this.borderThickness * 2,
      this.rowHeight - this.borderThickness
    );
    headerBg.endFill();
    this.addChild(headerBg);

    const columnWidth =
      (this.width - this.borderThickness) / data.columns.length;
    const rowHeight = this.rowHeight;

    data.columns.forEach((name, i) => {
      const col = new PIXI.Container();
      col.width = columnWidth;
      col.height = rowHeight;
      col.x = i * columnWidth;
      col.y = 0;

      const colText = new PIXI.Text(name);
      colText.anchor.x = 0.5;
      colText.anchor.y = 0.5;
      colText.x = columnWidth / 2;
      colText.y = rowHeight / 2;

      col.addChild(colText);
      headerContainer.addChild(col);

      if (i > 0) {
        var line = new PIXI.Graphics();
        line.lineStyle(2, 0xc0c0c0, 1);
        line.moveTo(i * columnWidth, 0);
        line.lineTo(i * columnWidth, rowHeight);
        headerContainer.addChild(line);
      }
    });

    var sep = new PIXI.Graphics();
    const lineThickness = 2;
    sep.lineStyle(lineThickness, 0xc0c0c0, 1);
    sep.moveTo(lineThickness / 2, rowHeight);
    sep.lineTo(this.width - lineThickness / 2, rowHeight);
    headerContainer.addChild(sep);

    this.addChild(headerContainer);
  }

  constructor(width, height, rowHeight, data) {
    super();

    this.data = data;
    this.width = width;
    this.rowHeight = rowHeight;
    this.borderThickness = 3;
    this.rows = [];
    this.selected = new Map();

    const box = new PIXI.Graphics();
    box.beginFill(0xe6e6e6);
    box.drawRoundedRect(0, 0, width, height, 5);
    this.addChild((this.box = box));

    // the linestyle borderWidth will straddle the line, resulting in the overall size to be
    // height + borderWidth. We are doing some math here to draw the border inside the box
    const borderWidth = width - this.borderThickness;
    const borderHeight = height - this.borderThickness;
    const borderOffset = this.borderThickness / 2;

    const outline = new PIXI.Graphics();
    outline.lineStyle(this.borderThickness, 0xc0c0c0);
    outline.drawRoundedRect(
      borderOffset,
      borderOffset,
      borderWidth,
      borderHeight,
      3
    );
    this.addChild((this.outline = outline));

    this.addHeader(this.data);

    var mask = new PIXI.Graphics();
    mask.beginFill();
    mask.drawRect(
      this.borderThickness,
      rowHeight + borderOffset,
      width - this.borderThickness * 2,
      height - rowHeight - this.borderThickness * 2 + borderOffset
    );
    mask.endFill();

    var maskContainer = new PIXI.Container();
    maskContainer.mask = mask;
    maskContainer.interactive = true;
    maskContainer.addChild(mask);

    var rowsContainer = new PIXI.Container();
    maskContainer.addChild((this.rowsContainer = rowsContainer));

    const wheelEventHandler = (e) => {
      e.preventDefault();

      const delta = -e.deltaY / 5;
      if (delta > 0) {
        if (this.rowsContainer.y + delta >= 0) {
          this.rowsContainer.y = 0;
        } else {
          this.rowsContainer.y += delta;
        }
        return;
      }

      const proposedInnerBottom =
        (rowHeight + borderOffset) * this.rows.length +
        this.rowsContainer.y +
        this.y +
        delta;

      const outerBottom = this.rowsContainer.height;
      if (proposedInnerBottom >= outerBottom) {
        this.rowsContainer.y = proposedInnerBottom - this.startingInnerBottom;
      } else {
        this.rowsContainer.y = outerBottom - this.startingInnerBottom;
      }
    };

    maskContainer.pointerover = () =>
      window.addEventListener("wheel", wheelEventHandler, { passive: false });
    maskContainer.pointerout = () =>
      window.removeEventListener("wheel", wheelEventHandler);

    this.addChild(maskContainer);
  }
}
