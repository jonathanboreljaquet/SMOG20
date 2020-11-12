import * as BABYLON from 'babylonjs';
import Scene from './scene';
import BuildingsScene from './buildings_scene';
import ENV from '../environnement';
import * as GUI from 'babylonjs-gui';
import FloorsScene from './floors_scene';
import * as moment from 'moment';
import axios from 'axios';

// Constants

const SCENE_DEFAULT_BACKCOLOR: BABYLON.Color4 = new BABYLON.Color4(0, 0, 0, 1);

const CAMERA_UPPER_LIMIT: number = Math.PI / 2.2;
const CAMERA_MIN_RADIUS: number = 200;
const CAMERA_MAX_RADIUS: number = 8;
const CAMERA_DEFAULT_ALPHA: number = Math.PI / 1.5;
const CAMERA_DEFAULT_BETA: number = Math.PI / 2.4;
const CAMERA_DEFAULT_RADIUS: number = 10;

export default class ClassroomScene extends Scene{
    // Fields
    private camera: BABYLON.ArcRotateCamera;
    private light: BABYLON.HemisphericLight;

    // Constructor

    public constructor(engine: BABYLON.Engine, canvas: HTMLCanvasElement,imgName: string,previousScene: FloorsScene,id_classroom:number){
        super(new BABYLON.Scene(engine));
        this.scene.clearColor = SCENE_DEFAULT_BACKCOLOR;
        this.camera = new BABYLON.ArcRotateCamera(
            'plan_scene_camera',
            CAMERA_DEFAULT_ALPHA,
            CAMERA_DEFAULT_BETA,
            CAMERA_DEFAULT_RADIUS,
            BABYLON.Vector3.Zero(),
            this.scene
        );
        this.camera.attachControl(canvas, true);
        this.camera.upperBetaLimit = CAMERA_UPPER_LIMIT;
        this.camera.lowerRadiusLimit = CAMERA_MAX_RADIUS;
        this.camera.upperRadiusLimit = CAMERA_MIN_RADIUS;
        //Reverses the direction of rotation of the camera and decreases the speed
        this.camera.angularSensibilityY *=-7;
        this.camera.angularSensibilityX *=-7;

        this.light = new BABYLON.HemisphericLight('plan_scene_light', new BABYLON.Vector3(0, 1, 0), this.scene);

        let dome = new BABYLON.PhotoDome(
            "classroom",
            ENV.IMAGE_FOLDER+imgName,
            {
                resolution : 32,
                size: 1000
            },
            this.scene
        );
        dome.imageMode= BABYLON.PhotoDome.MODE_MONOSCOPIC;

        var advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        var button = GUI.Button.CreateSimpleButton(
            "button_go_back",
            "Return"
          );
        button.height = "40px";
        button.color = "white";
        button.background = "black";
        button.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        button.onPointerDownObservable.add(() => {
            previousScene.keep = true;
            previousScene.attachControl();
            this.changeScene(previousScene);
        });
        advancedTexture.addControl(button);

        var currentDate :any = moment();//now
        var startSchoolYearDate: any = moment('2020-08-24T08:05:00');
        var numberWeek: any = currentDate.diff(startSchoolYearDate, 'weeks')
        
        this.getSchedule(id_classroom,numberWeek);
    }
    
    

    getSchedule(classroom_id: number,nbr_week :number): void {
        axios
            .post(ENV.API_ENDPOINT + "schedule", {
                classroom_id: classroom_id,
                nbr_week: nbr_week,
            })
            .then(
                (response) => {
                    var days: Array<string>;
                    var coursLundi: Array<string>;
                    var coursMardi: Array<string>;
                    var coursMercredi: Array<string>;
                    var coursJeudi: Array<string>;
                    var coursVendredi: Array<string>;
                    var schedule: Array<Number>;

                    days = ['Lundi','Mardi','Mercredi','Jeudi','Vendredi'];

                    coursLundi = ["<td></td>","<td></td>","<td></td>","<td></td>","<td></td>","<td></td>","<td></td>","<td></td>","<td></td>","<td></td>","<td></td>","<td></td>"];
                    coursMardi = ["<td></td>","<td></td>","<td></td>","<td></td>","<td></td>","<td></td>","<td></td>","<td></td>","<td></td>","<td></td>","<td></td>","<td></td>"];
                    coursMercredi = ["<td></td>","<td></td>","<td></td>","<td></td>","<td></td>","<td></td>","<td></td>","<td></td>","<td></td>","<td></td>","<td></td>","<td></td>"];
                    coursJeudi = ["<td></td>","<td></td>","<td></td>","<td></td>","<td></td>","<td></td>","<td></td>","<td></td>","<td></td>","<td></td>","<td></td>","<td></td>"];
                    coursVendredi = ["<td></td>","<td></td>","<td></td>","<td></td>","<td></td>","<td></td>","<td></td>","<td></td>","<td></td>","<td></td>","<td></td>","<td></td>"];

                    let html = "<table><tr><th>Lundi</th><th>Mardi</th><th>Mercredi</th><th>Jeudi</th><th>Vendredi</th></tr>"; 
                    days.forEach(day => {
                        response.data.forEach(data => {
                            schedule = [data.h01,data.h02,data.h03,data.h04,data.h05,data.h06,data.h07,data.h08,data.h09,data.h10,data.h11,data.h12];
                           switch (data.day) {
                               case "lundi":
                                   for (let index = 0; index < schedule.length; index++) {
                                       if (schedule[index] == 1) {
                                           coursLundi[index]= "<td>" + data.name + "</td>";
                                       } 
                                   }
                                   break;
                                   case "mardi":
                                    for (let index = 0; index < schedule.length; index++) {
                                        if (schedule[index] == 1) {
                                            coursMardi[index]= "<td>" + data.name + "</td>";
                                        } 
                                    }
                                    break;
                                    case "mercredi":
                                        for (let index = 0; index < schedule.length; index++) {
                                            if (schedule[index] == 1) {
                                                coursMercredi[index]= "<td>" + data.name + "</td>";
                                            } 
                                        }
                                   break;
                                   case "jeudi":
                                    for (let index = 0; index < schedule.length; index++) {
                                        if (schedule[index] == 1) {
                                            coursJeudi[index]= "<td>" + data.name + "</td>";
                                        } 
                                    }
                                   break;
                                   case "vendredi":
                                    for (let index = 0; index < schedule.length; index++) {
                                        if (schedule[index] == 1) {
                                            coursVendredi[index]= "<td>" + data.name + "</td>";
                                        } 
                                    }
                                   break;
                           
                               default:
                                   break;
                           }
                        });
                    });
                    for (let index = 0; index < 12; index++) {
                        html+="<tr><td>H"+index+"</td>";
                        html+=coursLundi[index]
                        html+=coursMardi[index]
                        html+=coursMercredi[index]
                        html+=coursJeudi[index]
                        html+=coursVendredi[index]
                        html+="</tr>";           
                    }
                    html+="</table>";
                    console.log(response);
                    document.getElementById("Schedule_ul").innerHTML = html;
                },
                error => {
                    console.error(error);
                }
            );
}
}
