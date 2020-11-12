import "../scss/style.scss";
import Engine from "./libraries/engine";
import axios from "axios";
import ENV from "./environnement";
import "@fortawesome/fontawesome-free/js/all.js";
import * as moment from "moment";
import { int } from "babylonjs";

let canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
let engine = new Engine(canvas);

getBuildings();
getSchedule(9,11);
function getBuildings(): void {
    
        axios
            .post(ENV.API_ENDPOINT + "buildings")
            .then(
                response => {
                    console.log(response);
                    let dropdown = document.getElementById("link_batiment");
                    dropdown.innerHTML = '';
                    for (let building of response.data) {
                        let link = document.createElement('a');
                        link.classList.add('dropdown-item');
                        link.innerText = building.name;
                        link.addEventListener('click', () => {
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
function getSchedule(classroom_id: number,nbr_week :number): void {
    axios
        .post(ENV.API_ENDPOINT + "schedule", {
            classroom_id: classroom_id,
            nbr_week: nbr_week,
        })
        .then(
            (response) => {
                console.log(response);
                let html = "";
                for (let index = 0; index < response.data.length; index++) {
                    html +=
                        '<li> ' +
                        response.data[index].day +
                        " </li>";
                }
                document.getElementById("Schedule_ul").innerHTML = html;
            },
            error => {
                console.error(error);
            }
        );
}




