import * as BABYLON from 'babylonjs';
import Scene from './scene';
import MenuBuildings from './buildings_scene';
import axios from 'axios';
import { Axis } from 'babylonjs';

// Constants

const SCENE_DEFAULT_BACKCOLOR: BABYLON.Color4 = new BABYLON.Color4(0, 0, 0, 1);

const CAMERA_UPPER_LIMIT: number = Math.PI / 2.2;
const CAMERA_MIN_RADIUS: number = 200;
const CAMERA_MAX_RADIUS: number = 8;
const CAMERA_DEFAULT_ALPHA: number = Math.PI / 1.5;
const CAMERA_DEFAULT_BETA: number = Math.PI / 2.4;
const CAMERA_DEFAULT_RADIUS: number = 10;
const API_ENDPOINT = 'smog20.test/api';


export default class FloorsScene extends Scene{
    // Fields
    private camera: BABYLON.ArcRotateCamera;
    private light: BABYLON.HemisphericLight;
    private engine: BABYLON.Engine;

    // Constructor

    public constructor(engine: BABYLON.Engine, canvas: HTMLCanvasElement, building_name: string = 'Rhone'){
        super(new BABYLON.Scene(engine));

        this.engine = engine;
        engine.displayLoadingUI();

        // Send request
        axios.post(`${API_ENDPOINT}/floors`, {
            building_name: building_name
        }).then(response => {
            console.log(response);
        }, error => {
            console.error(error);
        }).finally(() => {
            engine.hideLoadingUI();
        });

        this.scene.clearColor = SCENE_DEFAULT_BACKCOLOR;

        this.camera = new BABYLON.ArcRotateCamera(
            'floors_scene_main_camera',
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

        this.light = new BABYLON.HemisphericLight('floors_scene_main_light', new BABYLON.Vector3(0, 1, 0), this.scene);
    }
}
