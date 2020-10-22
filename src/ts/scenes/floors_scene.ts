import * as BABYLON from 'babylonjs';
import Scene from './scene';
import ClassroomScene from './classroom_scene';
import axios from 'axios';
import ENV from '../environnement';
import Helpers from '../libraries/helpers';
import * as GUI from 'babylonjs-gui';
import * as ANIMATIONS from '../animations';
import * as _ from 'lodash';

// Constants

const SCENE_DEFAULT_BACKCOLOR: BABYLON.Color4 = new BABYLON.Color4(0, 0, 0, 1);

const CAMERA_UPPER_LIMIT: number = Math.PI / 2.2;
const CAMERA_MIN_RADIUS: number = 30;
const CAMERA_MAX_RADIUS: number = 3;
const CAMERA_DEFAULT_ALPHA: number = 0;
const CAMERA_DEFAULT_BETA: number = Math.PI * 70 / 180;
const CAMERA_DEFAULT_RADIUS: number = 5;

const LABEL_TEXT_COLOR = 'white';
const LABEL_FONT_SIZE = '15px';
const LABEL_BACKGROUND_COLOR = 'black';
const LABEL_HEIGHT = '25px';
const LABEL_WIDTH = '50px';
const LABEL_CORNER_RADIUS = 5;
const LABEL_THICKNESS = 1;
const LABEL_LINK_OFFSET_Y = -50;
const LABEL_Z_INDEX = -1;

const BUTTON_UP_WIDTH = 1;
const BUTTON_UP_HEIGHT = '60px';
const BUTTON_UP_TEXT_COLOR = 'white';
const BUTTON_UP_FONT_SIZE = 70;

const CURRENT_FLOOR_LABEL_DEFAULT_TEXT = '0';
const CURRENT_FLOOR_LABEL_TEXT_COLOR = 'white';
const CURRENT_FLOOR_LABEL_HEIGHT = '60px';
const CURRENT_FLOOR_lABEL_FONT_SIZE = 35;

const BUTTON_DOWN_WIDTH = 1;
const BUTTON_DOWN_HEIGHT = '60px';
const BUTTON_DOWN_TEXT_COLOR = 'white';
const BUTTON_DOWN_FONT_SIZE = 70;

const PANEL_WIDTH = '60px';
const PANEL_HEIGHT = '180px';
const PANEL_HORIZONTAL_ALIGNMENT = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
const PANEL_VERTICAL_ALIGNMENT = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;

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
            // Sort floor by index
            this.floors = _.orderBy(this.floors, ['index'], ['desc']);
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
        console.log(this.floors);
        let promises = [];
        this.floors.forEach((floor, index) => {
            promises.push(new Promise<any>((resolve, reject) => {
                BABYLON.SceneLoader.ImportMesh('', ENV.MESHES_FOLDER + floor.path_plan + '.babylon', '', this.scene, meshes => {
                    // Link meshes to parent
                    for(let i = 1; i< meshes.length; i++){
                        meshes[i].parent = meshes[0];
                    }
                    floor.meshes = meshes;
                    floor.labels = [];
                    // Add classrooms label
                    for(let classroom of floor.classrooms){
                        let anchor: BABYLON.AbstractMesh = new BABYLON.AbstractMesh('anchor', this.scene);

                        let text = new GUI.TextBlock();
                        text.text = classroom.name;
                        text.color = LABEL_TEXT_COLOR;
                        text.fontSize = LABEL_FONT_SIZE;

                        let label = new GUI.Button('label');
                        label.background = LABEL_BACKGROUND_COLOR;
                        label.color = LABEL_TEXT_COLOR;
                        label.height = LABEL_HEIGHT;
                        label.width = LABEL_WIDTH;
                        label.cornerRadius = LABEL_CORNER_RADIUS;
                        label.thickness = LABEL_THICKNESS;
                        label.linkOffsetY = LABEL_LINK_OFFSET_Y;
                        label.zIndex = LABEL_Z_INDEX;
                        label.addControl(text);
                        this.advancedTexture.addControl(label);
                        label.linkWithMesh(anchor);
                        label.onPointerClickObservable.add(() => {
                            if(label.isVisible)
                               this.changeScene(new ClassroomScene(this.engine, this.canvas, classroom.path_image, this));
                        });

                        anchor.position.x = classroom.location_x;
                        anchor.position.z = classroom.location_z;
                        anchor.parent = meshes[0];
                        floor.meshes.push(anchor);
                        floor.labels.push(label);
                    }
                    // Set inital floor state
                    if (floor.index == 0){
                        this.currentFloorIndex = index;
                    }
                    else{
                        for(let mesh of meshes){
                            mesh.visibility = 0;
                        }
                        for (let label of floor.labels){
                            label.isVisible = false;
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

    /**
     * @description Display another floor
     * @param newFloor
     * @private
     */
    private changeFloor(newFloor: number): void{
        if(newFloor > this.floors.length - 1)
            newFloor = this.floors.length - 1;
        else if(newFloor < 0)
            newFloor = 0;
        if(newFloor == this.currentFloorIndex)
            return;

        this.scene.beginDirectAnimation(this.floors[this.currentFloorIndex].meshes[0], [newFloor > this.currentFloorIndex ? ANIMATIONS.animationTransitionY(0, 10) : ANIMATIONS.animationTransitionY(0, -10)], 0, ANIMATIONS.frameRate, false);
        for(let mesh of this.floors[this.currentFloorIndex].meshes)
            this.scene.beginDirectAnimation(mesh, [ANIMATIONS.animationVisibility(1, 0)], 0, ANIMATIONS.frameRate, false);
        for(let label of this.floors[this.currentFloorIndex].labels)
            label.isVisible = false;
        this.scene.beginDirectAnimation(this.floors[newFloor].meshes[0], [newFloor > this.currentFloorIndex ? ANIMATIONS.animationTransitionY(-10, 0) : ANIMATIONS.animationTransitionY(10, 0)], 0, ANIMATIONS.frameRate, false);
        for(let mesh of this.floors[newFloor].meshes)
            this.scene.beginDirectAnimation(mesh, [ANIMATIONS.animationVisibility(0, 1)], 0, ANIMATIONS.frameRate, false);
        for(let label of this.floors[newFloor].labels)
            label.isVisible = true;

        this.currentFloorIndex = newFloor;
        this.labelCurrentFloor.text = this.floors[this.currentFloorIndex].index.toString();


    }

    /**
     * @description Add GUI to scene
     * @private
     */
    private addUi(): void{
        let buttonUp: GUI.Button = GUI.Button.CreateSimpleButton('buttonUp', '🔼');
        buttonUp.width = BUTTON_UP_WIDTH;
        buttonUp.height = BUTTON_UP_HEIGHT;
        buttonUp.color = BUTTON_UP_TEXT_COLOR;
        buttonUp.fontSize = BUTTON_UP_FONT_SIZE;

        buttonUp.onPointerClickObservable.add(state => {
            this.changeFloor(this.currentFloorIndex - 1);
        });

        let text: GUI.TextBlock = new GUI.TextBlock();
        text.text = CURRENT_FLOOR_LABEL_DEFAULT_TEXT;
        text.color = CURRENT_FLOOR_LABEL_TEXT_COLOR;
        text.height = CURRENT_FLOOR_LABEL_HEIGHT;
        text.fontSize = CURRENT_FLOOR_lABEL_FONT_SIZE;

        let buttonDown: GUI.Button = GUI.Button.CreateSimpleButton('buttonDown', '🔽');
        buttonDown.width = BUTTON_DOWN_WIDTH;
        buttonDown.height = BUTTON_DOWN_HEIGHT;
        buttonDown.color = BUTTON_DOWN_TEXT_COLOR;
        buttonDown.fontSize = BUTTON_DOWN_FONT_SIZE;

        buttonDown.onPointerClickObservable.add(state => {
           this.changeFloor(this.currentFloorIndex + 1);
        });

        let panel: GUI.StackPanel = new GUI.StackPanel();
        panel.width = PANEL_WIDTH;
        panel.height = PANEL_HEIGHT;
        panel.horizontalAlignment = PANEL_HORIZONTAL_ALIGNMENT;
        panel.verticalAlignment = PANEL_VERTICAL_ALIGNMENT;

        this.labelCurrentFloor = text;
        panel.addControl(buttonUp);
        panel.addControl(text);
        panel.addControl(buttonDown);

        this.advancedTexture.addControl(panel);
    }
}
