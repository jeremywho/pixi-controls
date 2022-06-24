import * as PIXI from "pixi.js";

export class ListBox extends PIXI.Container {
  addRow(data, rowNum) {
    const headerContainer = new PIXI.Container();
    const columnWidth =
      (this.width - this.borderThickness) / data.columns.length;
    const rowHeight = this.rowHeight;
    const rowY = rowNum * rowHeight;

    console.log(
      `Column width: ${columnWidth}, row: ${rowNum}, this.width: ${this.width}, data.columns.length: ${data.columns.length}`
    );

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
      headerContainer.addChild(col);

      if (i > 0) {
        var line = new PIXI.Graphics();
        line.lineStyle(2, 0xc0c0c0, 1);
        line.moveTo(i * columnWidth, 0);
        line.lineTo(i * columnWidth, rowY + rowHeight);
        headerContainer.addChild(line);
      }
    });

    var sep = new PIXI.Graphics();
    const lineThickness = 2;
    sep.lineStyle(lineThickness, 0xc0c0c0, 1);
    sep.moveTo(lineThickness / 2, rowY + rowHeight);
    sep.lineTo(this.width - lineThickness / 2, rowY + rowHeight);
    headerContainer.addChild(sep);

    this.addChild(headerContainer);
  }

  addHeader(data) {
    return this.addRow(data, 0);
  }

  constructor(width, height, rowHeight, data) {
    super();

    this.data = data;
    this.width = width;
    this.rowHeight = rowHeight;
    this.borderThickness = 3;

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
  }
}
