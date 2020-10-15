import "../scss/style.scss";
import Engine from "./libraries/engine";
import axios from "axios";
import ENV from "./environnement";

let canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
let engine = new Engine(canvas);
getFloors(1);
getSchedule(2);
function getFloors(building_id: number): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        axios
            .post(ENV.API_ENDPOINT + "buildings", {
                building_id: building_id,
            })
            .then(
                (response) => {
                    resolve(response.data);
                    console.log(response);
                    let html = "";
                    for (let index = 0; index < response.data.length; index++) {
                        html +=
                            '<a class="dropdown-item" href = "#" > ' +
                            response.data[index].name +
                            " </a>";
                    }
                    document.getElementById("link_batiment").innerHTML = html;
                },
                (error) => {
                    reject(error);
                }
            )
            .finally();
    });
}

function getSchedule(classroom_id: number): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        axios
            .post(ENV.API_ENDPOINT + "schedule", {
                classroom_id: classroom_id,
            })
            .then(
                (response) => {
                    resolve(response.data);
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
                (error) => {
                    reject(error);
                }
            )
            .finally();
    });
}
