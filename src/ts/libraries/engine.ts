import * as BABYLON from 'babylonjs';
import Scene from '../scenes/scene';
import MainScene from '../scenes/main_scene';

export default class Engine{
    private engine: BABYLON.Engine;
    private currentScene: Scene;

    public constructor(canvas: HTMLCanvasElement){
        this.engine = new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true});
        this.currentScene = new MainScene(this.engine, canvas);

        this.linkEvents();

        this.engine.runRenderLoop(() => {
            this.currentScene.render();
        });
    }

    private linkEvents(): void{
        window.addEventListener('resize', () => {
            this.engine.resize();
        });
    }
}