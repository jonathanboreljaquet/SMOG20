import * as BABYLON from 'babylonjs';
import Scene from './scene';
import axios from 'axios';
import ENV from '../environnement';

// Constants

const SCENE_DEFAULT_BACKCOLOR: BABYLON.Color4 = new BABYLON.Color4(0, 0, 0, 1);

const CAMERA_UPPER_LIMIT: number = Math.PI / 2.2;
const CAMERA_MIN_RADIUS: number = 200;
const CAMERA_MAX_RADIUS: number = 3;
const CAMERA_DEFAULT_ALPHA: number = 0;
const CAMERA_DEFAULT_BETA: number = Math.PI * 70 / 180;
const CAMERA_DEFAULT_RADIUS: number = 7;


export default class FloorsScene extends Scene{
    // Fields
    private camera: BABYLON.ArcRotateCamera;
    private light: BABYLON.HemisphericLight;
    private engine: BABYLON.Engine;

    // Constructor

    public constructor(engine: BABYLON.Engine, canvas: HTMLCanvasElement, building_id: number = 1){
        super(new BABYLON.Scene(engine));

        this.engine = engine;
        engine.displayLoadingUI();

        axios.post(ENV.API_ENDPOINT + 'floors', {
            building_id: building_id
        }).then(response => {
            this.floorsLoaded(response.data);
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
        (this.camera.inputs.attached.pointers as BABYLON.ArcRotateCameraPointersInput).buttons = [0];
        this.camera.upperBetaLimit = CAMERA_UPPER_LIMIT;
        this.camera.lowerRadiusLimit = CAMERA_MAX_RADIUS;
        this.camera.upperRadiusLimit = CAMERA_MIN_RADIUS;

        this.light = new BABYLON.HemisphericLight('floors_scene_main_light', new BABYLON.Vector3(0, 1, 0), this.scene);
    }

    private floorsLoaded(floors: any){
        for(let floor of floors){
            if (floor.index == 0){
                BABYLON.SceneLoader.ImportMesh('', ENV.MESHES_FOLDER + floor.path_plan + '.babylon', '', this.scene, meshes => {
                    meshes[0].position = BABYLON.Vector3.Zero();
                });
            }
        }
    }
}
