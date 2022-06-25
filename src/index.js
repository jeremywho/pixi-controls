import * as PIXI from "pixi.js";
// import { BingoCard } from "./BingoCard";
// import { Select } from "./select.js";
// import { CheckBox } from "./checkbox.js";
import { ListBox } from "./ListBox.js";

// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container.
const app = new PIXI.Application({
  backgroundColor: 0x1099bb,
  antialias: true
});

// The application will create a canvas element for you that you
// can then insert into the DOM.
document.body.appendChild(app.view);

// const landscapeTexture = PIXI.Texture.fromImage('src/bg.png');
let img = new PIXI.Sprite.from("src/bg.png");
app.stage.addChild(img);

/////////////////////////////////////////////////////
// BingoCard DEMO
/////////////////////////////////////////////////////
const loader = new PIXI.Loader("src");
loader.pre((resource, next) => {
  resource.crossOrigin = "anonymous";
  next();
});

loader
  .add("letters.json")
  .add("daub.json")
  .add("loginbuttons.json")
  .load((loader, resources) => {
    // const bingoCard = new BingoCard(450, 450, 3, `${2} Away`, resources);
    // app.stage.addChild(bingoCard);
    // bingoCard.position.set(50, 30);
  });

/////////////////////////////////////////////////////
// Checkbox DEMO
/////////////////////////////////////////////////////
// const cb = new CheckBox("Something", false, (v) => {
//   // console.log(`Checkbox changed, isChecked: ${v}`);
// });
// cb.position.set(10, 120);
// app.stage.addChild(cb);

/////////////////////////////////////////////////////
// Selectbox DEMO
/////////////////////////////////////////////////////
// var select = new Select(350, 50, {
//   options: {
//     test1: "I'm a select box!",
//     test2: "Test 2",
//     test3: "Test 3",
//     test4: "Test 4",
//     test5: "Test 5"
//   },
//   selected: "test2",
//   onChange: (selected) => {
//     // console.log("Selection Changed: ", selected);
//   }
// });

// select.position.set(10, 20);
// app.stage.addChild(select);

/////////////////////////////////////////////////////
// KEYPAD DEMO
/////////////////////////////////////////////////////
// const loader = new PIXI.Loader("src");
// loader.pre((resource, next) => {
//   resource.crossOrigin = "anonymous";
//   next();
// });

// loader.add("loginbuttons.json").load((loader, resources) => {
//   const keypad = new Keypad(resources["loginbuttons.json"].textures);
//   keypad.position.x = 500;
//   keypad.position.y = 20;
//   app.stage.addChild(keypad);
// });

/////////////////////////////////////////////////////
// Scrollable Listbox DEMO
/////////////////////////////////////////////////////
const lb = new ListBox(470, 300, 40, {
  columns: ["Card", "Valid", "Allowed", "Prize"]
});

lb.position.x = 10;
lb.position.y = 200;

app.stage.addChild(lb);

const rows = [
  { id: "row_one", columns: ["One", "Yes", "No", "Status"] },
  { id: "row_two", columns: ["Two", "Yes", "No", "Thingy"] },
  { id: "row_three", columns: ["3", "Yes", "No", ""] },
  { id: "row_four", columns: ["Four", "Yes", "No", "Some"] },
  { id: "row_five", columns: ["Five", "Yes", "No", ""] },
  { id: "row_six", columns: ["Six", "Yes", "No", "6"] },
  { id: "row_seven", columns: ["Seven", "Yes", "No", "7"] },
  { id: "row_eight", columns: ["Eight", "Yes", "No", "8"] },
  { id: "row_nine", columns: ["Five", "Yes", "No", ""] },
  { id: "row_ten", columns: ["Six", "Yes", "No", "6"] },
  { id: "eleven", columns: ["Seven", "Yes", "No", "7"] },
  { id: "row_12", columns: ["Eight", "Yes", "No", "8"] }
];

for (const c of rows) {
  lb.addRow(c);
}

// TODO:
// make header stay when scrolling
// add checkbox to listbox row
// get selected rows from  listbox table

// TODO: bingo board:
