import * as BABYLON from 'babylonjs';
import Scene from './scene';
import BuildingsScene from './buildings_scene';
import ENV from '../environnement';
import * as GUI from 'babylonjs-gui';
import FloorsScene from './floors_scene';

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

    public constructor(engine: BABYLON.Engine, canvas: HTMLCanvasElement,imgName: string,previousScene: FloorsScene){
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
    }

    // Methods
    // ...
}
