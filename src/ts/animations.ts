import * as BABYLON from 'babylonjs';

let frameRate = 10;

let animationTransitionY = (from: number, to: number)=>{
    let animation = new BABYLON.Animation("animationTransitionY", "position.y", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    animation.setKeys([
        {
            frame: 0,
            value: from
        },
        {
            frame: frameRate,
            value: to
        }
    ]);
    return animation;
}

let animationVisibility = (from: number, to: number) => {
    let animation = new BABYLON.Animation('animationHidden', 'visibility', frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    animation.setKeys([
        {
            frame: 0,
            value: from
        },
        {
            frame: frameRate,
            value: to
        }
    ]);
    return animation;
}



export {animationTransitionY, animationVisibility, frameRate};
