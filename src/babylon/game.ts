import * as BABYLON from "babylonjs"

export default class Game {
  canvas: HTMLCanvasElement;
  container: HTMLElement;
  engine: BABYLON.Engine;
  scene: BABYLON.Scene;
  camera: BABYLON.ArcRotateCamera;
  light: BABYLON.HemisphericLight;
  constructor(id: string) {
    this.container = document.getElementById(id) as HTMLCanvasElement;
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.container.clientWidth;
    this.canvas.height = this.container.clientHeight;
    this.container.appendChild(this.canvas);
    this.engine = new BABYLON.Engine(this.canvas, true);
    this.scene = new BABYLON.Scene(this.engine);
    this.camera = new BABYLON.ArcRotateCamera('mainCamera',-Math.PI/2,1,7.5, new BABYLON.Vector3(0,1,0),this.scene);
    this.camera.attachControl(this.canvas,true);
    this.light = new BABYLON.HemisphericLight('light1',new BABYLON.Vector3(0,1,0),this.scene);
    let sky = BABYLON.MeshBuilder.CreatePlane("sky",{size:100},this.scene);
    sky.position.z = 5;
    let sphere = BABYLON.MeshBuilder.CreateSphere('sphere',
      {segments: 16, diameter: 2}, this.scene);
    sphere.position.y = 1;
    let ground = BABYLON.MeshBuilder.CreateGround('ground',
      {width: 6, height: 6, subdivisions: 2}, this.scene);
    let hexa = BABYLON.MeshBuilder.CreateDisc('hexa1',{tessellation: 6,radius:5},this.scene);
    hexa.actionManager = new BABYLON.ActionManager(this.scene);
    hexa.actionManager.registerAction(
      new BABYLON.SetValueAction({trigger: BABYLON.ActionManager.OnPickUpTrigger,},
        hexa,
        "scaling",
        new BABYLON.Vector3(1.2, 1.2, 1.2)
      ));
    let mat = new BABYLON.StandardMaterial("Black", this.scene);
    mat.diffuseColor = new BABYLON.Color3(0, 0, 0);
    hexa.material = mat;
    hexa.position.z = 2;
  }
  doRender() : void {
    // Run the render loop.
    this.engine.runRenderLoop(() => {
      this.scene.render();
      this.camera.radius += 0.01;
    });

  }
}
