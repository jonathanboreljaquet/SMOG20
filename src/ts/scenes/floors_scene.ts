import * as BABYLON from 'babylonjs';
import Scene from './scene';
import axios from 'axios';
import ENV from '../environnement';
import Helpers from '../libraries/helpers';
import * as GUI from 'babylonjs-gui';
import * as ANIMATIONS from '../animations';

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
    private canvas: HTMLCanvasElement;
    private advancedTexture: GUI.AdvancedDynamicTexture;
    private currentFloorIndex: number;
    private floors: any;
    private labelCurrentFloor: GUI.TextBlock;

    // Constructor

    public constructor(engine: BABYLON.Engine, canvas: HTMLCanvasElement, building_id: number = 1){
        super(new BABYLON.Scene(engine));

        this.engine = engine;
        this.canvas = canvas;
        this.advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI');
        this.currentFloorIndex = 0;
        this.initScene();
        this.addUi();

        this.getFloors(building_id).then(floors => {
            this.floors = floors;
            this.floorsLoaded();
        }, error => {
            console.log(error);
            Helpers.displayError(this.advancedTexture, 'Cannot load floors');
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
        (this.camera.inputs.attached.pointers as BABYLON.ArcRotateCameraPointersInput).buttons = [0];
        this.camera.upperBetaLimit = CAMERA_UPPER_LIMIT;
        this.camera.lowerRadiusLimit = CAMERA_MAX_RADIUS;
        this.camera.upperRadiusLimit = CAMERA_MIN_RADIUS;

        this.light = new BABYLON.HemisphericLight('floors_scene_main_light', new BABYLON.Vector3(0, 1, 0), this.scene);
    }

    /**
     * @description Get floors from backend
     * @param building_id
     * @private
     */
    private getFloors(building_id: number): Promise<any>{
        this.engine.displayLoadingUI();
        return new Promise<any>((resolve, reject) => {
            axios.post(ENV.API_ENDPOINT + 'floors', {
                building_id: building_id
            }).then(response => {
                resolve(response.data);
            }, error => {
                reject(error);
            });
        });
    }

    /**
     * @description Add floors to scene
     * @param floors
     * @private
     */
    private floorsLoaded(){
        let promises = [];
        this.floors.forEach((floor, index) => {
            promises.push(new Promise<any>((resolve, reject) => {
                BABYLON.SceneLoader.ImportMesh('', ENV.MESHES_FOLDER + floor.path_plan + '.babylon', '', this.scene, meshes => {
                    for(let i = 1; i< meshes.length; i++){
                        meshes[i].parent = meshes[0];
                    }
                    floor.meshes = meshes;
                    if (floor.index == 0){
                        this.currentFloorIndex = index;
                    }
                    else{
                        for(let mesh of meshes){
                            mesh.visibility = 0;
                        }
                    }
                    resolve();
                });
            }))
        });
        // Mesh loaded
        Promise.all(promises).then(value => {
            this.labelCurrentFloor.text = this.floors[this.currentFloorIndex].index.toString();
            this.engine.hideLoadingUI();
        });
    }

    private changeFloor(newFloor: number): void{
        if(newFloor > this.floors.length - 1)
            newFloor = this.floors.length - 1;
        else if(newFloor < 0)
            newFloor = 0;
        if(newFloor == this.currentFloorIndex)
            return;

        this.scene.beginDirectAnimation(this.floors[this.currentFloorIndex].meshes[0], [newFloor > this.currentFloorIndex ? ANIMATIONS.animationTransitionY(0, 10) : ANIMATIONS.animationTransitionY(0, -10)], 0, ANIMATIONS.frameRate, false);
        for(let mesh of this.floors[this.currentFloorIndex].meshes){
            this.scene.beginDirectAnimation(mesh, [ANIMATIONS.animationVisibility(1, 0)], 0, ANIMATIONS.frameRate, false);
        }
        this.scene.beginDirectAnimation(this.floors[newFloor].meshes[0], [newFloor > this.currentFloorIndex ? ANIMATIONS.animationTransitionY(-10, 0) : ANIMATIONS.animationTransitionY(10, 0)], 0, ANIMATIONS.frameRate, false);
        for(let mesh of this.floors[newFloor].meshes){
            this.scene.beginDirectAnimation(mesh, [ANIMATIONS.animationVisibility(0, 1)], 0, ANIMATIONS.frameRate, false);
        }

        this.currentFloorIndex = newFloor;
        this.labelCurrentFloor.text = this.floors[this.currentFloorIndex].index.toString();


    }

    private addUi(): void{
        let buttonUp: GUI.Button = GUI.Button.CreateSimpleButton('buttonUp', '🔼');
        buttonUp.width = 1;
        buttonUp.height = '60px';
        buttonUp.color = 'white';
        buttonUp.fontSize = 70;

        buttonUp.onPointerClickObservable.add(state => {
            this.changeFloor(this.currentFloorIndex - 1);
        });

        let text: GUI.TextBlock = new GUI.TextBlock();
        text.text = '0';
        text.color = 'white';
        text.height = '60px';
        text.fontSize = 35;

        let buttonDown: GUI.Button = GUI.Button.CreateSimpleButton('buttonDown', '🔽');
        buttonDown.width = 1;
        buttonDown.height = '60px';
        buttonDown.color = 'white';
        buttonDown.fontSize = 70;

        buttonDown.onPointerClickObservable.add(state => {
           this.changeFloor(this.currentFloorIndex + 1);
        });

        let panel: GUI.StackPanel = new GUI.StackPanel();
        panel.width = '60px';
        panel.height = '180px';
        panel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        panel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;

        this.labelCurrentFloor = text;
        panel.addControl(buttonUp);
        panel.addControl(text);
        panel.addControl(buttonDown);

        this.advancedTexture.addControl(panel);
    }
}
