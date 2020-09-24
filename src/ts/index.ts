import "../scss/style.scss";
import Engine from "./libraries/engine";
import "bootstrap";

let canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
let engine = new Engine(canvas);
