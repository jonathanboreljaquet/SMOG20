import * as BABYLON from "babylonjs";
import * as GUI from 'babylonjs-gui';

export default class Helpers{
    public static displayError(advancedTexture: GUI.AdvancedDynamicTexture, message: string): void{
        let title: GUI.TextBlock = new GUI.TextBlock();
        title.text = 'Error:';
        title.color = 'white';
        title.fontSize = '20px';
        title.height = '25px';

        let text: GUI.TextBlock = new GUI.TextBlock();
        text.text = message;
        text.color = 'white';
        text.fontSize = '14px';
        text.height = '20px';

        let panel: GUI.StackPanel = new GUI.StackPanel();
        panel.width = '400px';
        panel.height = '50px';
        panel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        panel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        panel.background = 'red';
        panel.addControl(title);
        panel.addControl(text);

        advancedTexture.addControl(panel);
    }
}
