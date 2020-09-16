  
import * as BABYLON from 'babylonjs';

export default class Scene {
    protected scene: BABYLON.Scene;

    public constructor(scene: BABYLON.Scene) {
        this.scene = scene;
    }

    public render(): void{
        this.scene.render();
    }
    public dispose(): void{
        this.scene.dispose();
    }
}