import './style.css';
import mediator from '../mediator';

class Viewer {
    constructor(domElement, userId) {
        console.log('"Viewer" created');
        //Bind context
        this.createDragAndDropZone = this.createDragAndDropZone.bind(this);
        this.create3dScene = this.create3dScene.bind(this);
        this.animationLoop = this.animationLoop.bind(this);
        this._userId = userId;

        //Create drag&drop zone
        this.createDragAndDropZone(domElement);

        //Create 3d scene
        this.create3dScene();

        //Add event on various controls changes
        this._controls.addEventListener('change', this.renderPhone.bind(this));
        this.animationLoop();
        this._loader = new THREE.OBJLoader();

        mediator.on('viewer:addModel', this._uploadModel.bind(this));
        mediator.on('viewer:change', this._refreshCamera.bind(this));
    }

    _refreshCamera(newCamera) {
        //console.dir(e);
        if (newCamera.userId !== this._userId) {
            this._camera.position.set(newCamera.cameraPos.x, newCamera.cameraPos.y, newCamera.cameraPos.z);
            this._camera.quaternion.set(newCamera.cameraQua._x, newCamera.cameraQua._y, newCamera.cameraQua._z);
            this._camera.rotation.set(newCamera.cameraRot._x, newCamera.cameraRot._y, newCamera.cameraRot._z);
            this._camera.up.set(newCamera.cameraUp.x, newCamera.cameraUp.y, newCamera.cameraUp.z);
        }
    }

    _uploadModel(model) {
        if (model.userId !== this._userId) {
            this._loader.load(model.url, this.loadObj.bind(this));
        }
    }

    create3dScene() {
        this._scene = new THREE.Scene();
        this._camera = new THREE.PerspectiveCamera(10, this._viewZone.offsetWidth / this._viewZone.offsetHeight, 1, 1000);
        this._camera.position.set(10, 10, 10);
        this._camera.lookAt(this._scene.position);

        this._renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
        });
        this._renderer.setPixelRatio(window.devicePixelRatio);
        this._renderer.setSize(this._viewZone.offsetWidth, this._viewZone.offsetHeight);

        console.log(this._viewZone);
        this._viewZone.appendChild(this._renderer.domElement);

        /////////////////////////////////////////
        // Trackball Controller
        /////////////////////////////////////////
        //this.controls = new TrackballControls( this.camera, this.renderBox );
        this._controls = new THREE.TrackballControls(this._camera, this._renderer.domElement);
        this._controls.rotateSpeed = 5.0;
        this._controls.zoomSpeed = 3.2;
        this._controls.panSpeed = 0.8;
        this._controls.noZoom = false;
        this._controls.noPan = true;
        this._controls.staticMoving = false;
        this._controls.dynamicDampingFactor = 0.2;

        /////////////////////////////////////////
        // Lighting
        /////////////////////////////////////////

        const light_color = '#FAFAFA',
            ambientLight = new THREE.AmbientLight('#EEEEEE'),
            hemiLight = new THREE.HemisphereLight(light_color, light_color, 0),
            light = new THREE.PointLight(light_color, 1, 60);

        hemiLight.position.set(0, 50, 0);
        light.position.set(0, 20, 10);

        this._scene.add(ambientLight);
        this._scene.add(hemiLight);
        this._scene.add(light);

        this._axisHelper = new THREE.AxisHelper(1.25);
        this._scene.add(this._axisHelper);
    }

    createDragAndDropZone(dom) {
        this._viewZone = dom;
        this._viewZone.addEventListener('dragover', this.handleDragOver.bind(this), false);
        this._viewZone.addEventListener('drop', this.handleFileSelect.bind(this), false);
    }

    handleDragOver(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'copy';
    }

    handleFileSelect(evt) {
        evt.stopPropagation();
        evt.preventDefault();

        const file = evt.dataTransfer.files[0]; //Just for 1 file, if you want drag > 1 files, you should use const file = evt.dataTransfer.files and use for() through files

        const reader = new FileReader();
        reader.onload = (model => {
            this._loader.load(model.target.result, this.loadObj.bind(this));
            mediator.emit('viewer:addModel', {url: model.target.result, userId: this._userId});
        });
        reader.readAsDataURL(file);

    }

    renderPhone() {
        mediator.emit('viewer:change', {
            cameraPos: this._camera.position,
            cameraQua: this._camera.quaternion,
            cameraRot: this._camera.rotation,
            cameraUp: this._camera.up, userId: this._userId
        });
        this._renderer.render(this._scene, this._camera);
    }

    animationLoop() {
        requestAnimationFrame(this.animationLoop);
        this._controls.update();
    }

    loadObj(object) {
        this._dae = object;
        this._scene.add(this._dae);
        this.renderPhone();
    }
}

export default Viewer;
