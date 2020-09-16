import * as BABYLON from 'babylonjs';
import Scene from '../scenes/scene';
import MainScene from '../scenes/main_scene';
import SecondaryScene from '../scenes/secondary_scene';
import * as tsEvents from "ts-events";

export default class Engine{
    private engine: BABYLON.Engine;
    private currentScene: Scene;
    private event: tsEvents.SyncEvent<Scene> = new tsEvents.SyncEvent<Scene>();

    public constructor(canvas: HTMLCanvasElement){
        this.engine = new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true});
        this.currentScene = new SecondaryScene(this.engine, canvas,this.event);

        this.linkEvents();

        this.event.attach((scene: Scene) => {
            if (scene instanceof MainScene) {
                this.currentScene.dispose();
                this.currentScene = new SecondaryScene(this.engine,canvas,this.event);
            }
            else if(Object.is(scene,SecondaryScene)){
                this.currentScene.dispose();
                this.currentScene = new MainScene(this.engine,canvas,this.event);
            }
            
        });
        
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