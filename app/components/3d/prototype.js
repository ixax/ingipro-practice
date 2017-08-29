'use strict';

import mediator from '../mediator';

class Module3d {

    constructor(id,elem) {

        this.elem = elem;
        this.id = id;
        this.width = elem.clientWidth;
        this.height = elem.clientHeight;

        this.pause = false;

        this.activeKeyboard = false;

        this.textureLoad = false;
        this.objectLoad = false;

        // связываем контекст
        this.animate = this.animate.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
        this.destructor = this.destructor.bind(this);
        this.loadModel = this.loadModel.bind(this);
        this.loadObject = this.loadObject.bind(this);
        this.loadImage = this.loadImage.bind(this);
        this.handler = this.handler.bind(this);
        this.throttle = this.throttle.bind(this);
        this.handleFileSelect = this.handleFileSelect.bind(this);
        this._sendMove = this._sendMove.bind(this);

        this.init(); // создать сцену, камеру, рендер, освещение и loader
        this.createElements(); // создать drop_zone и canvas
        this.setEvents(); // установить события
        this.animate(); // бесконечный цикл перерисовки

    }

    createElements() {

        const div = document.createElement('div');
        div.id = `drop_zone${ this.id}`;
        div.setAttribute('style',`position:absolute;width:${this.width }px;height:${ this.height }px;`);
        this.elem.appendChild(div);

        let container = document.createElement('div');
        container.innerHTML = '';
        container.id = `container${ this.id}`;
        container.setAttribute('style',`position:absolute;`); // ?
        container.appendChild(this.renderer.domElement); // <canvas width="1243" height="920" style="width: 995px; height: 736px;"></canvas> внутрь div id = container
        this.elem.appendChild(container);

    }

    setEvents() {

        const dropZone = document.getElementById(`drop_zone${ this.id}`);
        dropZone.addEventListener('dragover', this.handleDragOver, false);
        dropZone.addEventListener('drop', this.handleFileSelect, false);

        document.addEventListener('keydown', this.handler);
        document.addEventListener('keyup', this.handler);
        document.getElementById(`drop_zone${ this.id}`).onmouseout = this.handler;
        document.getElementById(`drop_zone${ this.id}`).onmouseover = this.handler;

        //window.addEventListener('resize', this.onWindowResize, false);

        mediator.on('model:getMove', this._getMove.bind(this));
    }

    init() {

        this.scene = new THREE.Scene();
        let textureCube = new THREE.CubeTextureLoader()
            .setPath('https://threejs.org/examples/textures/cube/pisa/')
            .load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']);
        this.scene.background = textureCube;

        this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 3000);
        this.camera.position.set(100,0,1000);

        this.controls = new THREE.TrackballControls(this.camera); // , this.renderer.domElement
        this.controls.rotateSpeed = 2.0;
        this.controls.zoomSpeed = 0.3;
        this.controls.panSpeed = 0.2; // right  mouse
        this.controls.enabled = false;

        this.scene.add(this.camera);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio); // улучшение качества изображения
        this.renderer.setSize(this.width, this.height);
        this.renderer.shadowMap.enabled = true;

        let light = new THREE.AmbientLight(0xffffff);
        this.scene.add(light);

        let manager = new THREE.LoadingManager();
        manager.onProgress = function (item, loaded, total) {
            console.log(loaded, total);
        };

        this.onProgress = function (xhr) {
            if (xhr.lengthComputable) {
                let percentComplete = xhr.loaded / xhr.total * 100;
                console.log(`${Math.round(percentComplete, 2) }% downloaded`);
            }
        };

        this.onError = function (xhr) {
        };

        // model
        this.loaderObj = new THREE.OBJLoader(manager); // ObjectLoader

        this.texture = new THREE.Texture();
        this.loaderImage = new THREE.ImageLoader(manager);

    }

    destructor() {

        // events
        const dropZone = document.getElementById(`drop_zone${ this.id}`);
        dropZone.removeEventListener('dragover', this.handleDragOver, false);
        dropZone.removeEventListener('drop', this.handleFileSelect, false);

        window.removeEventListener('resize', this.onWindowResize, false);

        document.removeEventListener('keydown', this.handler);
        document.removeEventListener('keyup', this.handler);

        document.getElementById(`drop_zone${ this.id}`).onmouseout = null;
        document.getElementById(`drop_zone${ this.id}`).onmouseover = null;

        //elements
        let div = document.getElementById(`container${ this.id}`);
        document.getElementsByTagName('body')[0].removeChild(div);

        div = document.getElementById(`drop_zone${ this.id}`);
        document.getElementsByTagName('body')[0].removeChild(div);

        // variables
        this.pause = true;

        this.id = null;
        this.width = null;
        this.height = null;
        this.x = null;
        this.y = null;

        this.scene = null;
        this.camera = null;
        this.controls = null;
        this.renderer = null;
        this.loader = null;
        this.object = null;

        // нужно ли очищать контекст в функциях?

    }

    onWindowResize() {

        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.width, this.height);
        this.controls.handleResize();

    }

    loadObject(target) {

        this.loaderObj.load(target, (object) => {
            object.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.material.map = this.texture;
                }
            });
            this.object = object;
            this.object.position.x = 0;
            this.object.position.y = 0;
            this.object.position.z = 0;
            this.camera.lookAt(object);
            this.scene.add(object);

        }, this.onProgress, this.onError);

    }

    loadImage(target) {

        this.loaderImage.load(target, (image) => {

            this.texture.image = image;
            this.texture.needsUpdate = true;

        });
    }

    loadModel(files) {

        if (this.object !== 'undefined') {
            this.deleteModel();
           // this.objectLoad = false;
           // this.textureLoad = false;
        }

        for (let i = 0, f; f = files[i]; i++) {

            let reader = new FileReader();
            reader.readAsDataURL(f);

            reader.onload = ((theFile) => {
                return (e) => {

                    const index = theFile.name.indexOf(".") + 1;
                    const format = theFile.name.slice(index);

                    if (format === 'obj') {                  // если пользователь загрузил объект

                        this.objectLoad = true;             // сделать пометку об этом

                        if (this.textureLoad == true) {     // если текстура уже загружена, загружаем объект

                            this.loadObject(e.target.result);

                        } else {                            // текстура еще не загружена, запоминаем объект

                            this.file = e;

                        }

                    } else if (format === 'jpg' || format === 'png') {          // если пользователь загрузил картинку

                        this.loadImage(e.target.result);    // загружаем её
                        this.textureLoad = true;            // сделать пометку об этом

                        if (this.objectLoad === true) { // если модель уже загружена
                            this.loadObject(this.file.target.result);
                        }

                    }

                };
            })(f);

        }

    }

    deleteModel() {
        this.scene.remove(this.object);
    }

    handler(event) {

        if (event.type == 'mouseover') {
            this.activeKeyboard = true;
        }

        if (event.type == 'mouseout') {
            this.activeKeyboard = false;
        }

        if (event.keyCode == 17) { // ctrl
            if (event.type == 'keydown' && this.activeKeyboard == true) {

                this.controls.enabled = true;

            } else if (event.type == 'keyup' || this.activeKeyboard == false) {

                this.controls.enabled = false;

            }
        }

    }

    animate() {

        if (this.pause) {return;}

        requestAnimationFrame(this.animate);
        this.controls.update();
        this.render();

        this._sendMove();
    }

    render() {

        this.renderer.render(this.scene, this.camera);

    }

    throttle(func, ms) {

        let isThrottled = false,
            savedArgs,
            savedThis;

        function wrapper() {

            if (isThrottled) { // (2)
                savedArgs = arguments;
                savedThis = this;
                return;
            }

            func.apply(this, arguments); // (1)

            isThrottled = true;

            setTimeout(() => {
                isThrottled = false; // (3)
                if (savedArgs) {
                    wrapper.apply(savedThis, savedArgs);
                    savedArgs = savedThis = null;
                }
            }, ms);
        }

        return wrapper;
    }

    handleFileSelect(evt) {

        evt.stopPropagation();
        evt.preventDefault();

        const files = evt.dataTransfer.files; // FileList object.

        this.loadModel(files);

    }

    handleDragOver(evt) {

        // файл находится над drop_zone
        evt.stopPropagation(); // не открывать файл
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.

    }

    _sendMove() {

        const payload = {};
        payload.cameraX = this.camera.position.x;
        payload.cameraY = this.camera.position.y;
        payload.cameraZ = this.camera.position.z;

        payload.rotationX = this.camera.rotation.x;
        payload.rotationY = this.camera.rotation.y;
        payload.rotationZ = this.camera.rotation.z;

        payload.quaternionX = this.camera.quaternion.x;
        payload.quaternionY = this.camera.quaternion.y;
        payload.quaternionZ = this.camera.quaternion.z;

        payload.upX = this.camera.up.x;
        payload.upY = this.camera.up.Y;
        payload.upZ = this.camera.up.Z;

        mediator.emit('model:getMove', payload);

    }

    _getMove(payload) {

        this.camera.position.x = payload.cameraX;
        this.camera.position.y = payload.cameraY;
        this.camera.position.z = payload.cameraZ;

        this.camera.rotation.x = payload.rotationX;
        this.camera.rotation.y = payload.rotationY;
        this.camera.rotation.z = payload.rotationZ;

        this.camera.quaternion.x = payload.quaternionX;
        this.camera.quaternion.y = payload.quaternionY;
        this.camera.quaternion.z = payload.quaternionZ;

        this.camera.up.x = payload.upX;
        this.camera.up.Y = payload.upY;
        this.camera.up.Z = payload.upZ;
    }
}

export default Module3d;

// 1) как по-другому остановить requestAnimationFrame
// 2) при не ппадании в drop_zone открывается файл. пофиксить
// 3) колесо не должно работать когда ctrl нажат вне окна
