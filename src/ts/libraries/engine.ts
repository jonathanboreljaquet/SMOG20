import * as BABYLON from "babylonjs";
import Scene from "../scenes/scene";
import MenuBuildings from "../scenes/buildings_scene";
import FloorsScene from "../scenes/floors_scene";
import BuildingsScene from "../scenes/buildings_scene";
import ClassroomScene from "../scenes/classroom_scene";

export default class Engine {
    private engine: BABYLON.Engine;
    private currentScene: Scene;
    private canvas: HTMLCanvasElement;
    private navLinks = [
        {
            id: "btnHome",
            scene: BuildingsScene,
            params: [],
        },
        {
            id: "sidebar_link_floors_scene",
            scene: FloorsScene,
            params: [1],
        },
    ];

    public constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.engine = new BABYLON.Engine(canvas, true, {
            preserveDrawingBuffer: true,
            stencil: true,
        });
        this.currentScene = new ClassroomScene(this.engine, canvas,"test.jpg",this.currentScene);

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
        for (let link of this.navLinks) {
            document.getElementById(link.id).addEventListener("click", () => {
                this.currentScene.changeScene(
                    new link.scene(this.engine, this.canvas, ...link.params)
                );
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
