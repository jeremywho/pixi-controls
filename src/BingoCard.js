import * as PIXI from "pixi.js";

export const cardDef = {
  CardRatio: 0,
  Header: [
    "0.025, 0.03954877, 0.182, 0.143230349",
    "0.217, 0.03954877, 0.182, 0.143230349",
    "0.408999979, 0.03954877, 0.182, 0.143230349",
    "0.601, 0.03954877, 0.182, 0.143230349",
    "0.793, 0.03954877, 0.182, 0.143230349"
  ],
  CardNum: "0.025, 0.9, 0.5, 0.1",
  AwayCount: "0.475, 0.9, 0.5, 0.1",
  CardNums: [
    "0.025, 0.191567734, 0.182, 0.143230349",
    "0.217000008, 0.191567734, 0.182, 0.143230349",
    "0.409, 0.191567734, 0.182, 0.143230349",
    "0.601, 0.191567734, 0.182, 0.143230349",
    "0.7929999, 0.191567734, 0.182, 0.143230349",
    "0.025, 0.3435867, 0.182, 0.143230349",
    "0.217000008, 0.3435867, 0.182, 0.143230349",
    "0.409, 0.3435867, 0.182, 0.143230349",
    "0.601, 0.3435867, 0.182, 0.143230349",
    "0.7929999, 0.3435867, 0.182, 0.143230349",
    "0.025, 0.495605677, 0.182, 0.143230349",
    "0.217000008, 0.495605677, 0.182, 0.143230349",
    // "0.409, 0.495605677, 0.182, 0.143230349",
    "0.601, 0.495605677, 0.182, 0.143230349",
    "0.7929999, 0.495605677, 0.182, 0.143230349",
    "0.025, 0.6476247, 0.182, 0.143230349",
    "0.217000008, 0.6476247, 0.182, 0.143230349",
    "0.409, 0.6476247, 0.182, 0.143230349",
    "0.601, 0.6476247, 0.182, 0.143230349",
    "0.7929999, 0.6476247, 0.182, 0.143230349",
    "0.025, 0.799643636, 0.182, 0.143230349",
    "0.217000008, 0.799643636, 0.182, 0.143230349",
    "0.409, 0.799643636, 0.182, 0.143230349",
    "0.601, 0.799643636, 0.182, 0.143230349",
    "0.7929999, 0.799643636, 0.182, 0.143230349"
  ]
};

export const cardPerm = [
  24,
  6,
  2,
  25,
  23,
  13,
  4,
  1,
  12,
  9,
  8,
  18,
  16,
  15,
  11,
  14,
  3,
  21,
  19,
  10,
  22,
  20,
  17,
  7,
  5
];

export const header = ["b", "i", "n", "g", "o"];

export const calledNums = [6, 9, 19, 20, 18];

export class BingoCard extends PIXI.Container {
  parseDef(numDef) {
    const values = numDef.split(", ").map((x) => parseFloat(x));
    const x = this.width * values[0];
    const y = this.height * values[1];
    const w = this.width * values[2];
    const h = this.height * values[3];

    return { x, y, w, h };
  }

  createCardItem(numDef, num) {
    const { x, y, w, h } = this.parseDef(numDef);

    const numBg = new PIXI.Graphics();
    numBg.beginFill(0xffffff);
    numBg.drawRect(x, y, w, h);
    numBg.endFill();
    this.addChild(numBg);

    const t = new PIXI.Text(num);
    t.style.fontWeight = "bold";
    t.style.fontSize = 48;
    t.anchor.x = 0.5;
    t.anchor.y = 0.5;
    t.x = x + w / 2;
    t.y = y + h / 2;
    numBg.addChild(t);

    if (calledNums.some((x) => x === num)) {
      const daubTexture = this.daubTextures[`daub29.png`];
      const daub = new PIXI.Sprite(daubTexture);
      daub.width = w;
      daub.height = h;
      daub.anchor.x = 0.5;
      daub.anchor.y = 0.5;
      daub.x = x + w / 2;
      daub.y = y + h / 2;
      daub.alpha = 0.9;
      numBg.addChild(daub);
    }
    return numBg;
  }

  createHeaderItem(numDef, text) {
    const { x, y, w, h } = this.parseDef(numDef);
    const letter = this.textures[`${text.toUpperCase()}.png`];
    const sp = new PIXI.Sprite(letter);
    sp.width = w;
    sp.height = h;
    sp.anchor.x = 0.5;
    sp.anchor.y = 0.5;
    sp.x = x + w / 2;
    sp.y = y + h / 2;
    this.addChild(sp);

    return this;
  }

  createFooterItem(numDef, text, alignRight = false) {
    const { x, y, w, h } = this.parseDef(numDef);

    const t = new PIXI.Text(text);
    t.style.fontWeight = "bold";
    t.style.fontSize = 18;
    const realX = alignRight ? x + w - t.width : x;
    t.x = realX;
    t.y = y + h / 2;
    this.addChild(t);
    return this;
  }

  constructor(width, height, cardNum, awayCount, resources) {
    super();
    this.width = width;
    this.height = height;
    this.textures = resources["letters.json"].textures;
    this.daubTextures = resources["daub.json"].textures;

    const bg = new PIXI.Graphics();
    const bgColor = 0x6495ed;
    bg.beginFill(bgColor);
    bg.drawRoundedRect(0, 0, width, height, 15);
    bg.endFill();
    this.addChild((this.bg = bg));

    cardDef.CardNums.forEach((d, i) => this.createCardItem(d, cardPerm[i]));
    cardDef.Header.forEach((d, i) => this.createHeaderItem(d, header[i]));
    this.createFooterItem(cardDef.CardNum, cardNum);
    this.createFooterItem(cardDef.AwayCount, awayCount, true);
  }
}
