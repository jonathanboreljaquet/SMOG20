import * as BABYLON from 'babylonjs';
import Scene from './scene';
import BuildingsScene from './buildings_scene';
import ENV from '../environnement';
import * as GUI from 'babylonjs-gui';
import FloorsScene from './floors_scene';
import * as moment from 'moment';
import axios from 'axios';
import * as _ from 'lodash';

// Constants

const SCENE_DEFAULT_BACKCOLOR: BABYLON.Color4 = new BABYLON.Color4(0, 0, 0, 1);

const CAMERA_UPPER_LIMIT: number = Math.PI / 2.2;
const CAMERA_MIN_RADIUS: number = 200;
const CAMERA_MAX_RADIUS: number = 8;
const CAMERA_DEFAULT_ALPHA: number = Math.PI / 1.5;
const CAMERA_DEFAULT_BETA: number = Math.PI / 2.4;
const CAMERA_DEFAULT_RADIUS: number = 10;

export default class ClassroomScene extends Scene{
    // Constants
    private readonly DAYS: Array<string> = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'];
    private readonly NB_LESSONS_PER_DAY: number = 12;

    // Fields
    private camera: BABYLON.ArcRotateCamera;
    private light: BABYLON.HemisphericLight;
    private scheduleButton: HTMLElement;
    private scheduleGrid: HTMLElement;

    // Constructor

    public constructor(engine: BABYLON.Engine, canvas: HTMLCanvasElement,imgName: string,previousScene: FloorsScene,id_classroom:number){
        super(new BABYLON.Scene(engine));
        this.scheduleButton = document.getElementById('schedule_modale_button');
        this.scheduleGrid = document.getElementById('schedule_grid');
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
            this.scheduleButton.style.display = 'none';
            previousScene.keep = true;
            previousScene.attachControl();
            this.changeScene(previousScene);
        });
        advancedTexture.addControl(button);

        var currentDate :any = moment();//now
        var startSchoolYearDate: any = moment('2020-08-24T08:05:00');
        var numberWeek: any = currentDate.diff(startSchoolYearDate, 'weeks')

        this.getSchedule(id_classroom,numberWeek);
        this.scheduleButton.style.display = 'flex';
    }



    getSchedule(classroom_id: number,nbr_week :number): void {
        axios
            .post(ENV.API_ENDPOINT + "schedule", {
                classroom_id: classroom_id,
                nbr_week: nbr_week,
            })
            .then(
                (response) => {
                    // Clear schedule
                    this.scheduleGrid.innerHTML = '';
                    for (let hour = 1; hour <= this.NB_LESSONS_PER_DAY; hour++){
                        let row = document.createElement('tr');
                        this.DAYS.forEach((day, index) => {
                            let cell = document.createElement('td');
                            let hour_key = `h${hour < 10 ? '0' : ''}${hour}`;
                            let lesson = _.find(response.data, foo => {
                                return foo.day === day && foo[hour_key] === 1;
                            });
                            if(lesson != undefined && lesson != null)
                                cell.innerText = lesson.name;
                            row.appendChild(cell);
                        });
                        this.scheduleGrid.appendChild(row);
                    }
                },
                error => {
                    console.error(error);
                }
            );
}
}
