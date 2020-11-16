import "../scss/style.scss";
import Engine from "./libraries/engine";
import axios from "axios";
import ENV from "./environnement";
import "@fortawesome/fontawesome-free/js/all.js";
import * as moment from "moment";
import { int } from "babylonjs";
import './libraries/schedule';

let canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
let engine = new Engine(canvas);

getBuildings();
function getBuildings(): void {

        axios
            .post(ENV.API_ENDPOINT + "buildings")
            .then(
                response => {
                    let dropdown = document.getElementById("link_batiment");
                    dropdown.innerHTML = '';
                    for (let building of response.data) {
                        let link = document.createElement('a');
                        link.classList.add('dropdown-item');
                        link.innerText = building.name;
                        link.addEventListener('click', () => {
                            document.getElementById('schedule_modale_button').style.display = 'none';
                            engine.loadBuilding(building.id);
                        });
                        dropdown.appendChild(link);
                    }
                },
                error => {
                    console.error(error);
                }
            );
}



