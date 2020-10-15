import * as BABYLON from 'babylonjs';
import Scene from './scene';
import FloorsScene from './floors_scene';
import { Vector2, Vector3 } from 'babylonjs';
import { GridMaterial } from "babylonjs-materials";
import ENV from '../environnement';
import ClassroomScene from './classroom_scene';

// Constants

const SCENE_DEFAULT_BACKCOLOR: BABYLON.Color4 = new BABYLON.Color4(0, 0, 0, 1);

const CAMERA_UPPER_LIMIT: number = Math.PI / 2.2;
const CAMERA_MIN_RADIUS: number = 200;
const CAMERA_MAX_RADIUS: number = 20;
const CAMERA_DEFAULT_ALPHA: number = 0;
const CAMERA_DEFAULT_BETA: number = Math.PI / 2.4;
const CAMERA_DEFAULT_RADIUS: number = 40;

export default class BuildingsScene extends Scene {
    // Fields
    private camera: BABYLON.ArcRotateCamera;
    private light: BABYLON.HemisphericLight;

    // Constructor
    public constructor(engine: BABYLON.Engine, canvas: HTMLCanvasElement) {
        super(new BABYLON.Scene(engine));
        this.scene.clearColor = SCENE_DEFAULT_BACKCOLOR;

        this.camera = new BABYLON.ArcRotateCamera(
            "plan_scene_camera",
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

        this.light = new BABYLON.HemisphericLight('plan_scene_light', new BABYLON.Vector3(0, 1, 0), this.scene);

        BABYLON.SceneLoader.ImportMesh("", ENV.MESHES_FOLDER + "cfptrhonetest.babylon", "", this.scene, (meshes)=>  {
            meshes[0].scaling = new Vector3(1,1,1);
            meshes[0].actionManager = new BABYLON.ActionManager(this.scene);
            meshes[0].position =new Vector3(0,1,0);
            meshes[0].actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickUpTrigger, () => {
                this.changeScene(new ClassroomScene(engine, canvas,"test.jpg",this));
            }));
        });
        BABYLON.SceneLoader.ImportMesh("", ENV.MESHES_FOLDER + "cfpthorlogerietest.babylon", "", this.scene, (meshes)=>  {
            meshes[0].scaling = new Vector3(1,1,1);
            meshes[0].actionManager = new BABYLON.ActionManager(this.scene);
            meshes[0].position = new Vector3(0,1,-10);
            meshes[0].actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickUpTrigger, () => {
                this.changeScene(new FloorsScene(engine, canvas));
            }));
        });
        BABYLON.SceneLoader.ImportMesh("", ENV.MESHES_FOLDER + "cfptterniertest.babylon", "", this.scene, (meshes)=>  {
            meshes[0].scaling = new Vector3(1,1,1);
            meshes[0].actionManager = new BABYLON.ActionManager(this.scene);
            meshes[0].position = new Vector3(0,1,10);
            meshes[0].actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickUpTrigger, () => {
                this.changeScene(new FloorsScene(engine, canvas));
            }));
        });
        var material = new GridMaterial("grid", this.scene);
        var ground = BABYLON.Mesh.CreateGround("ground1", 100, 100, 2,this.scene);


        ground.material = material;
    }
}
