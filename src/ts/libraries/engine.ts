import * as BABYLON from "babylonjs";
import Scene from "../scenes/scene";
import MenuBuildings from "../scenes/buildings_scene";
import FloorsScene from "../scenes/floors_scene";
import BuildingsScene from "../scenes/buildings_scene";

export default class Engine {
    private engine: BABYLON.Engine;
    private currentScene: Scene;
    private canvas: HTMLCanvasElement;
    private navLinks = [
        {
            id: 'btnHome',
            scene: BuildingsScene
        },
        {
            id: 'sidebar_link_floors_scene',
            scene: FloorsScene
        }
    ];

    public constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.engine = new BABYLON.Engine(canvas, true, {
            preserveDrawingBuffer: true,
            stencil: true,
        });
        this.currentScene = new MenuBuildings(this.engine, canvas);

        this.linkEvents();

        this.engine.runRenderLoop(() => {
            this.currentScene.render();
        });
    }

    private linkEvents(): void {
        window.addEventListener("resize", () => {
            this.engine.resize();
        });
        this.currentScene.onSceneChange.attach((item) =>
            this.changeScene(item)
        );
        for(let link of this.navLinks){
            document.getElementById(link.id).addEventListener("click", () => {
                this.currentScene.changeScene(new link.scene(this.engine, this.canvas));
            });
        }
    }

    private changeScene(newScene: Scene): void {
        let oldScene = this.currentScene;
        oldScene.onSceneChange.detach();
        newScene.onSceneChange.attach((item) => this.changeScene(item));
        this.currentScene = newScene;
        oldScene.dispose();
    }
}
