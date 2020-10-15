  
import * as BABYLON from 'babylonjs';
import {SyncEvent} from 'ts-events';

export default class Scene {
    protected scene: BABYLON.Scene;
    public onSceneChange: SyncEvent<Scene>;
    public keep: boolean = true;

    public constructor(scene: BABYLON.Scene) {
        this.scene = scene;
        this.onSceneChange = new SyncEvent<Scene>();
    }

    public render(): void{
        this.scene.render();
    }
    public dispose(): void{
        this.scene.dispose();
    }
    public changeScene(newScene: Scene): void{
        this.onSceneChange.post(newScene);
    }
}