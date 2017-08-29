import Marks from '../marks';
import Viewer from '../viewer';
import mediator from '../mediator';
import './style.css';


class Layout {

    constructor(domNode) {
        //@fixme remove `console.log`
        // eslint-disable-next-line
        console.log('"Layout" created');
        this._domNode = domNode;

        document.addEventListener("click", this._changeLayout.bind(this), false);

        // Save data for marks and viewer
        mediator.on('conference:sync', (e) => {
            console.dir(e);
            this.userId = e.userList[e.userList.length - 1].userId;
            console.log(this.userId);
        });
    }

    hide() {
        this._domNode.classList.add('hide');
    }

    show() {
        this._domNode.classList.remove('hide');

        setTimeout(this._createLayout.bind(this), 20);
    }

    _createLayout () {
        this._BORDER = 2;           // width of tapes' lines (%)
        this._MINSIZE = 10;        // min size (%) of tape for deleting
        this._tapes = [];           // store for tapes, lines and cells

        this._createTapeBackground();
        this._createTapeBorder();
        this._createNewTape();

        this._createCellBackground();
        this._createCellBorder();
        this._createNewCell();
    }
    _createTapeBackground () {
        this._domNode.id = 0;

        this._tapes[0] = {
            elem: this._domNode,
            tapesNumber: 0,
            currentTapeId: 0,
            lastTapeId: 0,
            direction: false,
            view: true
        };

        this._tapes[0].ratio = this._tapes[0].elem.offsetWidth / this._tapes[0].elem.offsetHeight;
        this._tapes[0].lineCell = this._BORDER / 2 * this._tapes[0].elem.offsetHeight / 100;
    }
    _createTapeBorder () {
        for (let i = 1; i < 5; i++) {
            const elem = document.createElement('div');
            elem.id = i;

            switch (i - 1) {
                case 0:
                    elem.className = "line top";
                    elem.style.top = -this._BORDER + "%";
                    elem.style.left = -this._BORDER / this._tapes[0].ratio + "%";
                    elem.style.height = this._BORDER + "%";
                    elem.style.width = 100 + 2 * this._BORDER / this._tapes[0].ratio + "%";
                    break;
                case 1:
                    elem.className = "line left";
                    elem.style.left = -this._BORDER / this._tapes[0].ratio + "%";
                    elem.style.width = this._BORDER / this._tapes[0].ratio + "%";
                    break;
                case 2:
                    elem.className = "line bot";
                    elem.style.top = "100%";
                    elem.style.left = -this._BORDER / this._tapes[0].ratio + "%";
                    elem.style.height = this._BORDER + "%";
                    elem.style.width = 100 + 2 * this._BORDER / this._tapes[0].ratio + "%";
                    break;
                case 3:
                    elem.className = "line right";
                    elem.style.left = "100%";
                    elem.style.width = this._BORDER / this._tapes[0].ratio + "%";
                    break;
            }

            this._tapes[i] = {
                elem: elem,
                status: "createTape",
                view: true
            };

            this._tapes[0].elem.appendChild(this._tapes[i].elem);
        }

        this._tapes[0].tapesNumber = 4;
        this._tapes[0].lastTapeId = 4;
    }
    _createNewTape () {
        this._tapes[0].tapesNumber++;
        this._tapes[0].lastTapeId++;
        const id = this._tapes[0].lastTapeId;

        this._tapes[id] = {};
        this._tapes[id].elem = document.createElement('div');
        this._tapes[id].elem.className = "tape";
        this._tapes[id].elem.id = id;
        this._tapes[id].view = true;
        this._tapes[0].currentTapeId = id;

        if (id === 5) {
            this._tapes[id].elem.style.flexBasis = "100%";
            this._tapes[id].lastFlexBasis = 100;
            this._tapes[id].elem.style.order = 500;
            this._tapes[0].elem.appendChild(this._tapes[id].elem);
        } else {
            this._tapes[id].elem.style.flexBasis = "0%";
            this._tapes[id].lastFlexBasis = 0;
        }
    }

    _createCellBackground () {
        const parentId = this._tapes[0].lastTapeId;

        this._tapes[parentId][0] = {};
        this._tapes[parentId][0].elem = document.createElement('div');
        this._tapes[parentId][0].elem.className = "layoutCell";

        this._tapes[parentId][0].elem.id = 0;
        this._tapes[parentId][0].elem.tapeId = parentId;
        this._tapes[parentId][0].cellsNumber = 0;
        this._tapes[parentId][0].currentCellId = 0;
        this._tapes[parentId][0].lastCellId = 0;
        this._tapes[parentId][0].view = true;

        this._tapes[parentId].elem.appendChild(this._tapes[parentId][0].elem);
    }
    _createCellBorder () {
        const parentId = this._tapes[0].lastTapeId;

        for (let i = 1; i < 5; i++) {
            this._tapes[parentId][i] = {};
            this._tapes[parentId][i].elem = document.createElement('div');

            switch (i - 1) {
                case 0:
                    this._tapes[parentId][i].elem.className = "cellLine top";
                    this._tapes[parentId][i].elem.style.top = "0%";
                    this._tapes[parentId][i].elem.style.left = "0%";
                    this._tapes[parentId][i].elem.style.height = this._tapes[0].lineCell + "px";
                    this._tapes[parentId][i].elem.style.width = "100%";
                    break;
                case 1:
                    this._tapes[parentId][i].elem.className = "cellLine left";
                    this._tapes[parentId][i].elem.style.left = "0%";
                    this._tapes[parentId][i].elem.style.width = this._tapes[0].lineCell + "px";
                    break;
                case 2:
                    this._tapes[parentId][i].elem.className = "cellLine bot";
                    this._tapes[parentId][i].elem.style.bottom = "0%";
                    this._tapes[parentId][i].elem.style.left = "0%";
                    this._tapes[parentId][i].elem.style.height = this._tapes[0].lineCell + "px";
                    this._tapes[parentId][i].elem.style.width = "100%";
                    break;
                case 3:
                    this._tapes[parentId][i].elem.className = "cellLine right";
                    this._tapes[parentId][i].elem.style.right = "0%";
                    this._tapes[parentId][i].elem.style.width = this._tapes[0].lineCell + "px";
                    break;
            }
            this._tapes[parentId][i].elem.id = i;
            this._tapes[parentId][i].elem.tapeId = parentId;
            this._tapes[parentId][i].status = "createCell";
            this._tapes[parentId][i].view = true;

            this._tapes[parentId][0].elem.appendChild(this._tapes[parentId][i].elem);
        }

        this._tapes[parentId][0].cellsNumber = 4;
        this._tapes[parentId][0].lastCellId = 4;

    }
    _createNewCell () {
        const parentId = this._tapes[0].currentTapeId;
        this._tapes[parentId][0].cellsNumber++;
        this._tapes[parentId][0].lastCellId++;
        const id = this._tapes[parentId][0].lastCellId;

        this._tapes[parentId][id] = {};
        this._tapes[parentId][id].elem = document.createElement('div');
        this._tapes[parentId][id].elem.className = "cell";
        this._tapes[parentId][id].elem.id = id;
        this._tapes[parentId][id].elem.tapeId = parentId;
        this._tapes[parentId][id].view = true;
        this._tapes[parentId][0].currentCellId = id;

        if (id === 5) {
            this._tapes[parentId][id].elem.style.flexBasis = "100%";
            this._tapes[parentId][id].lastFlexBasis = 100;
            this._tapes[parentId][id].elem.style.order = 500;
            this._tapes[parentId][0].elem.appendChild(this._tapes[parentId][id].elem);
        } else {
            this._tapes[parentId][id].elem.style.flexBasis = "0%";
            this._tapes[parentId][id].lastFlexBasis = 0;
        }
        //this._tapes[parentId][id].marks = new Marks(id, this._tapes[parentId][id].elem, "#000000");

        this._tapes[parentId][id].viewer = new Viewer(this._tapes[parentId][id].elem, this.userId);
    }

    _changeLayout () {
        this._previous = {};
        this._next = {};
        this._external = {};
        this._internal = {};

        document.ondragstart = function () {
            return false;
        };

        // window.onresize = throttle(this.onResize.bind(this), 300);

        document.onmousedown = this._onMouseDown.bind(this);
    }

    _onMouseDown (e) {
        if (e.which !== 1) return;
        let line = {};

        line.elem = e.target.closest(".line");
        if (!line.elem) {
            line.elem = e.target.closest(".internalLine");
        }
        if (line.elem) {
            line = this._tapes[line.elem.id];
        } else {
            line.elem = e.target.closest(".cellLine");
            if (!line.elem) {
                line.elem = e.target.closest(".internalCellLine");
            }
            if (line.elem) {
                line = this._tapes[line.elem.tapeId][line.elem.id];
            } else {
                line.elem = e.target.closest(".cellLine");
                return;
            }
        }

        switch (line.status) {
            case "createTape":
                this._external = line;
                if (!this._tapes[0].direction) {
                    this._setTapesDirection();
                    this._setCellsDirection ();
                    this._closeStatusExternal();
                }

                document.onmousemove = this._throttle(this._onMouseTapes.bind(this), 10);
                document.onmouseup = this._onMouseUp.bind(this);
                break;
            case "resizeTape":
                this._internal = line;
                this._internal.lineShift = this._takeCoordinate(e);

                this._resizeTape ();

                document.onmousemove = this._throttle(this._onMouseTapes.bind(this),10);
                document.onmouseup = this._onMouseUp.bind(this);
                break;
            case "createCell":
                this._external = line;
                this._tapes[0].currentTapeId = this._external.elem.tapeId;
                if (!this._tapes[0].direction) {
                    this._setAllDirection();
                    this._closeStatusExternal();
                }

                document.onmousemove = this._throttle(this._onMouseCells.bind(this),10);
                document.onmouseup = this._onMouseUp.bind(this);
                break;
            case "resizeCell":
                this._internal = line;
                this._tapes[0].currentTapeId = this._internal.elem.tapeId;
                this._internal.lineShift = this._takeCoordinateCell(e);

                this._resizeCell ();

                document.onmousemove = this._throttle(this._onMouseCells.bind(this),10);
                document.onmouseup = this._onMouseUp.bind(this);
                break;
        }
        return false;
    }

    _setAllDirection () {
        const parentId = this._tapes[0].currentTapeId;
        const cellId = this._tapes[parentId][0].currentCellId;

        switch (this._external.elem.className) {
            case "cellLine left":
            case "cellLine right":
                this._tapes[1].nextId = this._tapes[parentId].elem.id;
                this._tapes[3].previousId = this._tapes[parentId].elem.id;

                this._tapes[parentId].nextId = this._tapes[3].elem.id;
                this._tapes[parentId].previousId = this._tapes[1].elem.id;

                this._tapes[0].elem.style.flexDirection = "column";
                this._minSizeTape = this._MINSIZE;

                this._tapes[parentId][2].nextId = this._tapes[parentId][cellId].elem.id;
                this._tapes[parentId][4].previousId = this._tapes[parentId][cellId].elem.id;

                this._tapes[parentId][cellId].nextId = this._tapes[parentId][4].elem.id;
                this._tapes[parentId][cellId].previousId = this._tapes[parentId][2].elem.id;

                this._tapes[parentId][0].elem.style.flexDirection = "row";
                this._minSizeCell = this._MINSIZE / this._tapes[0].ratio / 2;
                break;
            default:
                this._tapes[2].nextId = this._tapes[parentId].elem.id;
                this._tapes[4].previousId = this._tapes[parentId].elem.id;

                this._tapes[parentId].nextId = this._tapes[4].elem.id;
                this._tapes[parentId].previousId = this._tapes[2].elem.id;

                this._tapes[0].elem.style.flexDirection = "row";
                this._minSizeTape = this._MINSIZE / this._tapes[0].ratio;

                this._tapes[parentId][1].nextId = this._tapes[parentId][cellId].elem.id;
                this._tapes[parentId][3].previousId = this._tapes[parentId][cellId].elem.id;

                this._tapes[parentId][cellId].nextId = this._tapes[parentId][3].elem.id;
                this._tapes[parentId][cellId].previousId = this._tapes[parentId][1].elem.id;

                this._tapes[parentId][0].elem.style.flexDirection = "column";
                this._minSizeCell = this._MINSIZE / 2;
        }
    }
    _setTapesDirection () {
        const parentId = this._tapes[0].currentTapeId;

        switch (this._external.elem.className) {
            case "line top":
            case "line bot":
                this._tapes[1].nextId = this._tapes[parentId].elem.id;
                this._tapes[3].previousId = this._tapes[parentId].elem.id;

                this._tapes[parentId].nextId = this._tapes[3].elem.id;
                this._tapes[parentId].previousId = this._tapes[1].elem.id;

                this._tapes[0].elem.style.flexDirection = "column";
                this._minSizeTape = this._MINSIZE;
                break;
            default:
                this._tapes[2].nextId = this._tapes[parentId].elem.id;
                this._tapes[4].previousId = this._tapes[parentId].elem.id;

                this._tapes[parentId].nextId = this._tapes[4].elem.id;
                this._tapes[parentId].previousId = this._tapes[2].elem.id;

                this._tapes[0].elem.style.flexDirection = "row";
                this._minSizeTape = this._MINSIZE / this._tapes[0].ratio;
        }
    }
    _setCellsDirection () {
        const parentId = this._tapes[0].currentTapeId;
        const cellId = this._tapes[parentId][0].currentCellId;

        switch (this._tapes[0].elem.style.flexDirection) {
            case "column":
                this._tapes[parentId][2].nextId = this._tapes[parentId][cellId].elem.id;
                this._tapes[parentId][4].previousId = this._tapes[parentId][cellId].elem.id;

                this._tapes[parentId][cellId].nextId = this._tapes[parentId][4].elem.id;
                this._tapes[parentId][cellId].previousId = this._tapes[parentId][2].elem.id;

                this._tapes[parentId][0].elem.style.flexDirection = "row";
                this._minSizeCell = this._MINSIZE / this._tapes[0].ratio / 2;
                break;
            default:
                this._tapes[parentId][1].nextId = this._tapes[parentId][cellId].elem.id;
                this._tapes[parentId][3].previousId = this._tapes[parentId][cellId].elem.id;

                this._tapes[parentId][cellId].nextId = this._tapes[parentId][3].elem.id;
                this._tapes[parentId][cellId].previousId = this._tapes[parentId][1].elem.id;

                this._tapes[parentId][0].elem.style.flexDirection = "column";
                this._minSizeCell = this._MINSIZE / 2;
        }
    }
    _closeStatusExternal () {
        let cellId, tapeId, parentId;

        if (this._external.status === "createTape") {
            tapeId = parseInt(this._external.elem.id);
            cellId = (parseInt(tapeId) + 1) % 4;
            parentId = this._tapes[0].currentTapeId;
        } else {
            cellId = this._external.elem.id;
            tapeId = (parseInt(cellId) + 1) % 4;
            parentId = this._external.elem.tapeId;
        }

        for (let i = 1; i < 5; i++) {
            if (tapeId % 2 !== i % 2) {
                this._tapes[i].status = "close";
            }
            if (cellId % 2 !== i % 2) {
                this._tapes[parentId][i].status = "close";
            }
        }
    }

    _createTape () {
        this._tapes[0].ratio = this._tapes[0].elem.offsetWidth / this._tapes[0].elem.offsetHeight;
        this._tapes[0].lineCell = this._BORDER / 2 * this._tapes[0].elem.offsetHeight / 100;

        this._createInternalTapeLine ();
        this._createNewTape();

        this._createCellBackground();
        this._createCellBorder();
        this._createNewCell();
        this._setCellsDirection ();
        this._closeStatusExternal();

        this._editConnections ();
    }
    _createCell () {
        this._createInternalCellLine ();
        this._createNewCell ();

        this._editConnections ();
    }

    _createInternalTapeLine () {
        this._tapes[0].tapesNumber++;
        this._tapes[0].lastTapeId++;
        const id = this._tapes[0].lastTapeId;

        this._tapes[id] = {};
        this._tapes[id].elem = document.createElement('div');
        this._tapes[id].elem.className = "internalLine";
        this._tapes[id].status = "resizeTape";
        this._tapes[id].elem.id = id;
        this._tapes[id].view = true;
        if (this._tapes[0].elem.style.flexDirection === "column") {
            this._tapes[id].elem.style.flexBasis = this._BORDER + "%";
            this._tapes[id].lastFlexBasis = this._BORDER;
            this._shift = this._BORDER / 2;
        } else {
            this._tapes[id].elem.style.flexBasis = this._BORDER / this._tapes[0].ratio + "%";
            this._tapes[id].lastFlexBasis = this._BORDER / this._tapes[0].ratio;
            this._shift = this._BORDER / this._tapes[0].ratio / 2;
        }

        this._internal = this._tapes[id];
    }
    _createInternalCellLine () {
        const parentId = this._tapes[0].currentTapeId;
        this._tapes[parentId][0].cellsNumber++;
        this._tapes[parentId][0].lastCellId++;
        const id = this._tapes[parentId][0].lastCellId;

        this._tapes[parentId][id] = {};
        this._tapes[parentId][id].elem = document.createElement('div');

        this._tapes[parentId][id].elem.className = "internalCellLine";
        this._tapes[parentId][id].status = "resizeCell";
        this._tapes[parentId][id].elem.id = id;
        this._tapes[parentId][id].elem.tapeId = parentId;
        this._tapes[parentId][id].view = true;
        if (this._tapes[parentId][0].elem.style.flexDirection === "column") {
            this._tapes[parentId][id].elem.style.flexBasis = this._tapes[0].lineCell + "px";
            this._tapes[parentId][id].lastFlexBasis = this._tapes[0].lineCell / this._tapes[parentId][0].elem.offsetHeight * 100;
            this._shift = this._BORDER / 4;
        } else {
            this._tapes[parentId][id].elem.style.flexBasis = this._tapes[0].lineCell + "px";
            this._tapes[parentId][id].lastFlexBasis = this._tapes[0].lineCell / this._tapes[parentId][0].elem.offsetWidth * 100;
            this._shift = this._BORDER / this._tapes[0].ratio / 4;
        }

        this._internal = this._tapes[parentId][id];
    }

    _editConnections () {
        const parentId = this._tapes[0].currentTapeId;
        const id = this._tapes[parentId][0].lastCellId;

        switch (this._external.elem.className) {
            case "line top":
            case "line left":
            case "cellLine top":
            case "cellLine left":
                if (this._external.status === "createTape") {
                    this._next = this._tapes[this._external.nextId];
                    this._previous = this._tapes[parentId];
                } else {
                    this._next = this._tapes[parentId][this._external.nextId];
                    this._previous = this._tapes[parentId][id];
                }

                this._internal.lineShift = 0;

                this._internal.elem.style.order = this._next.elem.style.order - 1;
                this._previous.elem.style.order = this._internal.elem.style.order - 1;

                this._previous.nextId = this._internal.elem.id;
                this._previous.previousId = this._external.elem.id;

                this._next.previousId = this._internal.elem.id;
                this._external.nextId = this._previous.elem.id;

                this._internal.nextId = this._next.elem.id;
                this._internal.previousId = this._previous.elem.id;
                break;
            default:
                if (this._external.status === "createTape") {
                    this._previous = this._tapes[this._external.previousId];
                    this._next = this._tapes[parentId];
                } else {
                    this._previous = this._tapes[parentId][this._external.previousId];
                    this._next = this._tapes[parentId][id];
                }

                this._internal.lineShift = 100;

                this._internal.elem.style.order = this._previous.elem.style.order + 1;
                this._next.elem.style.order = this._internal.elem.style.order + 1;

                this._next.nextId = this._external.elem.id;
                this._next.previousId = this._internal.elem.id;

                this._previous.nextId = this._internal.elem.id;
                this._external.previousId = this._next.elem.id;

                this._internal.nextId = this._next.elem.id;
                this._internal.previousId = this._previous.elem.id;
        }

        if (this._external.status === "createTape") {
            this._tapes[0].elem.appendChild(this._internal.elem);
            this._tapes[0].elem.appendChild(this._tapes[parentId].elem);
        } else {
            this._tapes[parentId][0].elem.appendChild(this._internal.elem);
            this._tapes[parentId][0].elem.appendChild(this._tapes[parentId][id].elem);
        }
    }

    _resizeTape () {
        this._next = this._tapes[this._internal.nextId];
        this._previous = this._tapes[this._internal.previousId];
        this._shift = 0;
    }
    _resizeCell () {
        const parentId = this._tapes[0].currentTapeId;

        this._next = this._tapes[parentId][this._internal.nextId];
        this._previous = this._tapes[parentId][this._internal.previousId];
        this._shift = 0;

    }

    _onMouseTapes(e) {

        let coordinate = this._takeCoordinate (e);

        if (!this._isEmpty(this._external)) {
            if (coordinate < this._minSizeTape || coordinate > 100 - this._minSizeTape) {
                return false;
            }
            this._createTape ();
            this._tapes[0].direction = true;
            this._external = {};
        }

        if (!this._internal) return false; // элемент не зажат

        coordinate = this._checkBorder(coordinate);

        this._setNewSizes (coordinate);

        if (parseFloat(this._next.elem.style.flexBasis) < this._minSizeTape / 2) {
            this._deleteNext (e);
            return false;
        }

        if (parseFloat(this._previous.elem.style.flexBasis) < this._minSizeTape / 2) {
            this._deletePrevious (e);
            return false;
        }

        return false;
    }
    _onMouseCells(e) {

        let coordinate = this._takeCoordinateCell (e);

        if (!this._isEmpty(this._external)) {
            if (coordinate < this._minSizeCell || coordinate > 100 - this._minSizeCell) {
                return false;
            }
            this._createCell ();
            this._tapes[0].direction = true;
            this._external = {};
        }

        if (!this._internal) return false; // элемент не зажат

        coordinate = this._checkBorder(coordinate);

        this._setNewSizes (coordinate);

        if (parseFloat(this._next.elem.style.flexBasis) < this._minSizeCell / 2) {
            this._deleteNextCell (e);
            return false;
        }

        if (parseFloat(this._previous.elem.style.flexBasis) < this._minSizeCell / 2) {
            this._deletePreviousCell (e);
            return false;
        }

        return false;
    }

    _takeCoordinate (e) {
        if (this._tapes[0].elem.style.flexDirection === "column") {
            return (e.pageY - this._tapes[0].elem.offsetTop) / this._tapes[0].elem.offsetHeight * 100;
        }
        return (e.pageX - this._tapes[0].elem.offsetLeft) / this._tapes[0].elem.offsetWidth * 100;
    }
    _takeCoordinateCell (e) {
        const parentId = this._tapes[0].currentTapeId;

        if (this._tapes[parentId][0].elem.style.flexDirection === "column") {
            return (e.pageY - (this._tapes[parentId][0].elem.offsetTop + this._tapes[0].elem.offsetTop)) / this._tapes[parentId][0].elem.offsetHeight * 100;
        }
        return (e.pageX - (this._tapes[parentId][0].elem.offsetLeft + this._tapes[0].elem.offsetLeft)) / this._tapes[parentId][0].elem.offsetWidth * 100;
    }

    _isEmpty(obj) {
        for (let key in obj) {
            return false;
        }
        return true;
    }
    _checkBorder(coordinate) {
        if (coordinate < 0) {
            return 0;
        }
        if (coordinate > 100) {
            return 100;
        }
        return coordinate;
    }
    _setNewSizes (coordinate) {
        const delta = coordinate - this._internal.lineShift;

        this._previous.elem.style.flexBasis = this._previous.lastFlexBasis + delta - this._shift + "%";
        this._next.elem.style.flexBasis = this._next.lastFlexBasis - delta - this._shift + "%";
    }

    _deleteNext (e) {

        const shiftNext = parseFloat(this._next.elem.style.flexBasis) + this._internal.lastFlexBasis;

        if (!this._tapes[this._next.nextId].nextId) {
            this._deleteBorderNextTape (shiftNext);
            this._tapes[0].tapesNumber-=2;
        } else {
            this._deleteCenterNextTape ();
            this._tapes[0].tapesNumber-=2;
            this._next.lastFlexBasis = parseFloat(this._next.elem.style.flexBasis) + shiftNext;
            this._previous.lastFlexBasis = parseFloat(this._previous.elem.style.flexBasis);

            this._internal.lineShift = this._takeCoordinate(e);
            this._shift = 0;

            this._next.elem.style.flexBasis = this._next.lastFlexBasis + "%";
            this._previous.elem.style.flexBasis = this._previous.lastFlexBasis + "%";
        }
        return false;
    }
    _deleteNextCell (e) {

        const parentId = this._tapes[0].currentTapeId;
        const shiftNext = parseFloat(this._next.elem.style.flexBasis) + this._internal.lastFlexBasis;

        if (!this._tapes[parentId][this._next.nextId].nextId) {
            this._deleteBorderNextCell (shiftNext);
            this._tapes[parentId][0].cellsNumber-=2;
        } else {
            this._deleteCenterNextCell ();
            this._tapes[parentId][0].cellsNumber-=2;

            this._next.lastFlexBasis = parseFloat(this._next.elem.style.flexBasis) + shiftNext;
            this._previous.lastFlexBasis = parseFloat(this._previous.elem.style.flexBasis);

            this._internal.lineShift = this._takeCoordinateCell(e);
            this._shift = 0;

            this._next.elem.style.flexBasis = this._next.lastFlexBasis + "%";
            this._previous.elem.style.flexBasis = this._previous.lastFlexBasis + "%";
        }
        return false;
    }
    _deleteBorderNextTape (shiftNext) {
        this._previous.nextId = this._next.nextId;
        this._tapes[this._next.nextId].previousId = this._previous.elem.id;
        this._previous.elem.style.flexBasis = parseFloat(this._previous.elem.style.flexBasis) + shiftNext + "%";

        this._tapes[0].elem.removeChild(this._tapes[this._internal.elem.id].elem);
        this._tapes[this._internal.elem.id].view = false;
        this._tapes[0].elem.removeChild(this._tapes[this._next.elem.id].elem);
        this._tapes[this._next.elem.id].view = false;
        this._tapes[0].currentTapeId = this._previous.elem.id;
        document.onmousemove = null;
    }
    _deleteBorderNextCell (shiftNext) {
        const parentId = this._tapes[0].currentTapeId;
        this._previous.nextId = this._next.nextId;
        this._tapes[parentId][this._next.nextId].previousId = this._previous.elem.id;
        this._previous.elem.style.flexBasis = parseFloat(this._previous.elem.style.flexBasis) + shiftNext + "%";

        this._tapes[parentId][0].elem.removeChild(this._tapes[parentId][this._internal.elem.id].elem);
        this._tapes[parentId][this._internal.elem.id].view = false;
        this._tapes[parentId][0].elem.removeChild(this._tapes[parentId][this._next.elem.id].elem);
        this._tapes[parentId][this._next.elem.id].view = false;
        this._tapes[parentId][0].currentCellId = this._previous.elem.id;
        document.onmousemove = null;
    }
    _deleteCenterNextTape () {
        this._internal.nextId = this._tapes[this._next.nextId].nextId;
        this._tapes[this._internal.nextId].previousId = this._internal.elem.id;

        this._tapes[0].elem.removeChild(this._tapes[this._next.nextId].elem);
        this._tapes[this._next.nextId].view = false;
        this._tapes[0].elem.removeChild(this._tapes[this._next.elem.id].elem);
        this._tapes[this._next.elem.id].view = false;
        this._next = this._tapes[this._internal.nextId];
    }
    _deleteCenterNextCell () {
        const parentId = this._tapes[0].currentTapeId;
        this._internal.nextId = this._tapes[parentId][this._next.nextId].nextId;
        this._tapes[parentId][this._internal.nextId].previousId = this._internal.elem.id;

        this._tapes[parentId][0].elem.removeChild(this._tapes[parentId][this._next.nextId].elem);
        this._tapes[parentId][this._next.nextId].view = false;
        this._tapes[parentId][0].elem.removeChild(this._tapes[parentId][this._next.elem.id].elem);
        this._tapes[parentId][this._next.elem.id].view = false;
        this._next = this._tapes[parentId][this._internal.nextId];
    }

    _deletePrevious (e) {

        const shiftPrevious = parseFloat(this._previous.elem.style.flexBasis) + this._internal.lastFlexBasis;

        if (!this._tapes[this._previous.previousId].previousId) {
            this._deleteBorderPreviousTape (shiftPrevious);
            this._tapes[0].tapesNumber-=2;
        } else {
            this._deleteCenterPreviousTape ();
            this._tapes[0].tapesNumber-=2;
            this._next.lastFlexBasis = parseFloat(this._next.elem.style.flexBasis);
            this._previous.lastFlexBasis = parseFloat(this._previous.elem.style.flexBasis) + shiftPrevious;

            this._internal.lineShift = this._takeCoordinate(e);
            this._shift = 0;

            this._next.elem.style.flexBasis = this._next.lastFlexBasis + "%";
            this._previous.elem.style.flexBasis = this._previous.lastFlexBasis + "%";
        }
        return false;
    }
    _deletePreviousCell (e) {

        const parentId = this._tapes[0].currentTapeId;
        const shiftPrevious = parseFloat(this._previous.elem.style.flexBasis) + this._internal.lastFlexBasis;

        if (!this._tapes[parentId][this._previous.previousId].previousId) {
            this._deleteBorderPreviousCell (shiftPrevious);
            this._tapes[parentId][0].cellsNumber-=2;
        } else {
            this._deleteCenterPreviousCell ();
            this._tapes[parentId][0].cellsNumber-=2;

            this._next.lastFlexBasis = parseFloat(this._next.elem.style.flexBasis);
            this._previous.lastFlexBasis = parseFloat(this._previous.elem.style.flexBasis) + shiftPrevious;

            this._internal.lineShift = this._takeCoordinateCell(e);
            this._shift = 0;

            this._next.elem.style.flexBasis = this._next.lastFlexBasis + "%";
            this._previous.elem.style.flexBasis = this._previous.lastFlexBasis + "%";
        }
        return false;
    }
    _deleteBorderPreviousTape (shiftPrevious) {
        this._next.previousId = this._previous.previousId;
        this._tapes[this._previous.previousId].nextId = this._next.elem.id;
        this._next.elem.style.flexBasis = parseFloat(this._next.elem.style.flexBasis) + shiftPrevious + "%";

        this._tapes[0].elem.removeChild(this._tapes[this._internal.elem.id].elem);
        this._tapes[this._internal.elem.id].view = false;
        this._tapes[0].elem.removeChild(this._tapes[this._previous.elem.id].elem);
        this._tapes[this._previous.elem.id].view = false;
        this._tapes[0].currentTapeId = this._next.elem.id;
        document.onmousemove = null;
    }
    _deleteBorderPreviousCell (shiftPrevious) {
        const parentId = this._tapes[0].currentTapeId;
        this._next.previousId = this._previous.previousId;
        this._tapes[parentId][this._previous.previousId].nextId = this._next.elem.id;
        this._next.elem.style.flexBasis = parseFloat(this._next.elem.style.flexBasis) + shiftPrevious + "%";

        this._tapes[parentId][0].elem.removeChild(this._tapes[parentId][this._internal.elem.id].elem);
        this._tapes[parentId][this._internal.elem.id].view = false;
        this._tapes[parentId][0].elem.removeChild(this._tapes[parentId][this._previous.elem.id].elem);
        this._tapes[parentId][this._previous.elem.id].view = false;
        this._tapes[parentId][0].currentCellId = this._next.elem.id;
        document.onmousemove = null;
    }
    _deleteCenterPreviousTape () {
        this._internal.previousId = this._tapes[this._previous.previousId].previousId;
        this._tapes[this._internal.previousId].nextId = this._internal.elem.id;

        this._tapes[0].elem.removeChild(this._tapes[this._previous.previousId].elem);
        this._tapes[this._previous.previousId].view = false;
        this._tapes[0].elem.removeChild(this._tapes[this._previous.elem.id].elem);
        this._tapes[this._previous.elem.id].view = false;
        this._previous = this._tapes[this._internal.previousId];
    }
    _deleteCenterPreviousCell () {
        const parentId = this._tapes[0].currentTapeId;
        this._internal.previousId = this._tapes[parentId][this._previous.previousId].previousId;
        this._tapes[parentId][this._internal.previousId].nextId = this._internal.elem.id;

        this._tapes[parentId][0].elem.removeChild(this._tapes[parentId][this._previous.previousId].elem);
        this._tapes[parentId][this._previous.previousId].view = false;
        this._tapes[parentId][0].elem.removeChild(this._tapes[parentId][this._previous.elem.id].elem);
        this._tapes[parentId][this._previous.elem.id].view = false;

        this._previous = this._tapes[parentId][this._internal.previousId];
    }

    _onMouseUp () {

        if (this._tapes[0].tapesNumber === 5) {
            const parentId = this._tapes[0].currentTapeId;
            if (this._tapes[parentId][0].cellsNumber === 5) {
                this._resetDirection ();
            }
        }
        if(!this._isEmpty(this._next)){
            this._next.lastFlexBasis = parseFloat(this._next.elem.style.flexBasis);
        }
        if(!this._isEmpty(this._previous)) {
            this._previous.lastFlexBasis = parseFloat(this._previous.elem.style.flexBasis);
        }

        this._next = {};
        this._previous = {};
        this._external = {};
        this._internal = {};

        document.onmousemove = null;
        document.onmouseup = null;
    }

    _resetDirection () {
        const parentId = this._tapes[0].currentTapeId;
        for (let i = 1; i < 5; i++) {
            this._tapes[i].status = "createTape";
            this._tapes[parentId][i].status = "createCell";
        }

        this._tapes[0].direction = false;
    }

    // _onResize() {
    // }

    _throttle(func, ms) {

        let isThrottled = false,
            savedArgs,
            savedThis;

        function wrapper() {

            if (isThrottled) {
                savedArgs = arguments;
                savedThis = this;
                return;
            }

            func.apply(this, arguments);

            isThrottled = true;

            setTimeout(function() {
                isThrottled = false;
                if (savedArgs) {
                    wrapper.apply(savedThis, savedArgs);
                    savedArgs = savedThis = null;
                }
            }, ms);
        }

        return wrapper;
    }

    // _restoreLayout() {
    //     const this._tapes = this._this._tapes;
    //
    //     document.body.appendChild(this._tapes[0].elem);
    //
    //     for (let i = 1; i < this._tapes[0].lastTapeId; i++) {
    //         if (this._tapes[i].view) {
    //             this._tapes[0].elem.appendChild(this._tapes[i].elem);
    //             this._tapes[i].elem.appendChild(this._tapes[i][0].elem);
    //
    //             for (let j = 1; i < this._tapes[i][0].lastCellId; j++) {
    //                 if (this._tapes[i][j].view) {
    //                     this._tapes[i][0].elem.appendChild(this._tapes[i][j].elem);
    //                 }
    //             }
    //         }
    //     }
    //
    // }

}

export default Layout;
