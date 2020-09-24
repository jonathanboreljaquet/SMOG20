import * as BABYLON from 'babylonjs';
import Scene from '../scenes/scene';
import MenuBuildings from '../scenes/menu_buildings';

export default class Engine{
    private engine: BABYLON.Engine;
    private currentScene: Scene;

    public constructor(canvas: HTMLCanvasElement){
        this.engine = new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true});
        this.currentScene = new MenuBuildings(this.engine, canvas);

        this.linkEvents();

        this.engine.runRenderLoop(() => {
            this.currentScene.render();
        });
    }
    

    private linkEvents(): void{
        window.addEventListener('resize', () => {
            this.engine.resize();
        });
        this.currentScene.onSceneChange.attach(item => this.changeScene(item));
    }
    
    private changeScene(newScene: Scene): void{
        let oldScene = this.currentScene;
        oldScene.onSceneChange.detach();
        newScene.onSceneChange.attach(item => this.changeScene(item));
        this.currentScene = newScene;
        oldScene.dispose();
    }
}