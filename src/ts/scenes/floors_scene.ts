import * as BABYLON from 'babylonjs';
import Scene from './scene';
import MenuBuildings from './buildings_scene';
import axios from 'axios';
import { Axis } from 'babylonjs';
import Helpers from '../libraries/helpers';
import * as GUI from 'babylonjs-gui';

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
    private canvas: HTMLCanvasElement;
    private advancedTexture: GUI.AdvancedDynamicTexture;

    // Constructor

    public constructor(engine: BABYLON.Engine, canvas: HTMLCanvasElement, building_id: number = 1){
        super(new BABYLON.Scene(engine));

        this.engine = engine;
        this.canvas = canvas;
        this.advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI');
        this.initScene();

        this.getFloors(building_id).then(floors => {
            console.log(floors);
        }, error => {
            console.log(error);
            Helpers.displayError(this.advancedTexture, 'Cannot load floors')
        });
    }

    /**
     * @description Add scene basic elements
     * @private
     */
    private initScene(): void{
        this.scene.clearColor = SCENE_DEFAULT_BACKCOLOR;

        this.camera = new BABYLON.ArcRotateCamera(
            'floors_scene_main_camera',
            CAMERA_DEFAULT_ALPHA,
            CAMERA_DEFAULT_BETA,
            CAMERA_DEFAULT_RADIUS,
            BABYLON.Vector3.Zero(),
            this.scene
        );

        this.camera.attachControl(this.canvas, true);
        this.camera.upperBetaLimit = CAMERA_UPPER_LIMIT;
        this.camera.lowerRadiusLimit = CAMERA_MAX_RADIUS;
        this.camera.upperRadiusLimit = CAMERA_MIN_RADIUS;

        this.light = new BABYLON.HemisphericLight('floors_scene_main_light', new BABYLON.Vector3(0, 10, 0), this.scene);
    }

    private getFloors(building_id: number): Promise<any>{
        this.engine.displayLoadingUI();
        return new Promise((resolve, reject) => {
            axios.post(`${API_ENDPOINT}/floors`, {
                building_id: building_id
            }).then(response => {
                resolve(response.data);
            }, error => {
                reject(error);
            }).finally(() => {
                this.engine.hideLoadingUI();
            });
        });
    }
}
