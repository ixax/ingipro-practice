import Marks from '../marks';
import Module3d from '../3d/prototype.js';
import mediator from '../mediator';
// import Viewer from '../viewer';
import './style.css';


class Layout {

    constructor(domNode) {
        //@fixme remove `console.log`
        // eslint-disable-next-line
        console.log('"Layout" created');
        this._domNode = domNode;

        document.addEventListener("click", this._changeLayout.bind(this), false);
        // mediator.on('layout:change', this._handleLayout.bind(this));
        mediator.on('conference:sync', this._getUser.bind(this));
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
        this._MARGIN = 25;
        this._LINE_SIZE = 10;
        this._CHAT_SIZE = 250;
        this._MINSIZE = 10;         // min size (%) of tape for creating
                                    // min size/2 (%) of tape for deleting
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
            cellsNumber: 0,
        };

        this._tapes[0].elem.style.margin = this._MARGIN + "px";
        this._addForLines = 2 * this._LINE_SIZE / this._tapes[0].elem.clientWidth * 100;
    }
    _createTapeBorder () {
        for (let i = 1; i < 5; i++) {
            const elem = document.createElement('div');
            elem.id = i;

            switch (i - 1) {
                case 0:
                    elem.className = "external line tapeLine top";
                    elem.style.top = - this._LINE_SIZE + "px";
                    elem.style.left = - this._LINE_SIZE + "px";
                    elem.style.height = this._LINE_SIZE + "px";
                    elem.style.width = 100 + this._addForLines + "%";
                    break;
                case 1:
                    elem.className = "external line tapeLine left";
                    elem.style.left = - this._LINE_SIZE + "px";
                    elem.style.width = this._LINE_SIZE + "px";
                    break;
                case 2:
                    elem.className = "external line tapeLine bot";
                    elem.style.top = "100%";
                    elem.style.left = - this._LINE_SIZE + "px";
                    elem.style.height = this._LINE_SIZE + "px";
                    elem.style.width = 100 + this._addForLines + "%";
                    break;
                case 3:
                    elem.className = "external line tapeLine right";
                    elem.style.left = "100%";
                    elem.style.width = this._LINE_SIZE + "px";
                    break;
            }

            this._tapes[i] = {
                elem: elem,
                status: "createTape",
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

        this._tapes[parentId][0] = {
            cellsNumber: 0,
            currentCellId: 0,
            lastCellId: 0,
        };

        this._tapes[parentId][0].elem = document.createElement('div');
        this._tapes[parentId][0].elem.className = "layoutCell";

        this._tapes[parentId][0].elem.id = 0;
        this._tapes[parentId][0].elem.tapeId = parentId;

        this._tapes[parentId].elem.appendChild(this._tapes[parentId][0].elem);
    }
    _createCellBorder () {
        const parentId = this._tapes[0].lastTapeId;

        for (let i = 1; i < 5; i++) {
            const elem = document.createElement('div');
            elem.id = i;

            switch (i - 1) {
                case 0:
                    elem.className = "external line cellLine top";
                    elem.style.top = "0%";
                    elem.style.left = "0%";
                    elem.style.height = this._LINE_SIZE + "px";
                    elem.style.width = "100%";
                    break;
                case 1:
                    elem.className = "external line cellLine left";
                    elem.style.left = "0%";
                    elem.style.width = this._LINE_SIZE + "px";
                    break;
                case 2:
                    elem.className = "external line cellLine bot";
                    elem.style.bottom = "0%";
                    elem.style.left = "0%";
                    elem.style.height = this._LINE_SIZE + "px";
                    elem.style.width = "100%";
                    break;
                case 3:
                    elem.className = "external line cellLine right";
                    elem.style.right = "0%";
                    elem.style.width = this._LINE_SIZE + "px";
                    break;
            }

            this._tapes[parentId][i] = {
                elem: elem,
                status: "createCell",
            };
            this._tapes[parentId][i].elem.tapeId = parentId;

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

        this._tapes[parentId][0].currentCellId = id;
        this._tapes[parentId][id].globalId = ++this._tapes[0].cellsNumber;

        if (id === 5) {
            this._tapes[parentId][id].elem.style.flexBasis = "100%";
            this._tapes[parentId][id].lastFlexBasis = 100;
            this._tapes[parentId][id].elem.style.order = 500;
            this._tapes[parentId][0].elem.appendChild(this._tapes[parentId][id].elem);
        } else {
            this._tapes[parentId][id].elem.style.flexBasis = "0%";
            this._tapes[parentId][id].lastFlexBasis = 0;
        }

        // this._marks = new Marks(this._user, this._tapes[parentId][id]);
        // this._tapes[parentId][id].svg = this._marks.svg;

        this.model = new Module3d(this._user.userId, this._tapes[parentId][id].elem);
        this._tapes[parentId][id].model = this.model;
        console.log("create new");
    }

    _changeLayout () {
        this._previous = {};
        this._next = {};
        this._external = {};
        this._internal = {};

        document.ondragstart = function () {
            return false;
        };

        window.onresize = this._throttle(this._onResize.bind(this), 100);

        document.onmousedown = this._onMouseDown.bind(this);
    }

    _onMouseDown (e) {
        if (e.which !== 1) return;
        let line = {};

        line.elem = e.target.closest(".tapeLine");
        if (!line.elem) {
            line.elem = e.target.closest(".cellLine");
            if (line.elem) {
                line = this._tapes[line.elem.tapeId][line.elem.id];
            } else {
                return;
            }
        } else {
            line = this._tapes[line.elem.id];
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
            case "external line cellLine left":
            case "external line cellLine right":
                this._tapes[1].nextId = this._tapes[parentId].elem.id;
                this._tapes[3].previousId = this._tapes[parentId].elem.id;

                this._tapes[parentId].nextId = this._tapes[3].elem.id;
                this._tapes[parentId].previousId = this._tapes[1].elem.id;

                this._tapes[0].elem.style.flexDirection = "column";

                this._tapes[parentId][2].nextId = this._tapes[parentId][cellId].elem.id;
                this._tapes[parentId][4].previousId = this._tapes[parentId][cellId].elem.id;

                this._tapes[parentId][cellId].nextId = this._tapes[parentId][4].elem.id;
                this._tapes[parentId][cellId].previousId = this._tapes[parentId][2].elem.id;

                this._tapes[parentId][0].elem.style.flexDirection = "row";
                break;
            default:
                this._tapes[2].nextId = this._tapes[parentId].elem.id;
                this._tapes[4].previousId = this._tapes[parentId].elem.id;

                this._tapes[parentId].nextId = this._tapes[4].elem.id;
                this._tapes[parentId].previousId = this._tapes[2].elem.id;

                this._tapes[0].elem.style.flexDirection = "row";

                this._tapes[parentId][1].nextId = this._tapes[parentId][cellId].elem.id;
                this._tapes[parentId][3].previousId = this._tapes[parentId][cellId].elem.id;

                this._tapes[parentId][cellId].nextId = this._tapes[parentId][3].elem.id;
                this._tapes[parentId][cellId].previousId = this._tapes[parentId][1].elem.id;

                this._tapes[parentId][0].elem.style.flexDirection = "column";
        }
    }
    _setTapesDirection () {
        const parentId = this._tapes[0].currentTapeId;

        switch (this._external.elem.className) {
            case "external line tapeLine top":
            case "external line tapeLine bot":
                this._tapes[1].nextId = this._tapes[parentId].elem.id;
                this._tapes[3].previousId = this._tapes[parentId].elem.id;

                this._tapes[parentId].nextId = this._tapes[3].elem.id;
                this._tapes[parentId].previousId = this._tapes[1].elem.id;

                this._tapes[0].elem.style.flexDirection = "column";
                break;
            default:
                this._tapes[2].nextId = this._tapes[parentId].elem.id;
                this._tapes[4].previousId = this._tapes[parentId].elem.id;

                this._tapes[parentId].nextId = this._tapes[4].elem.id;
                this._tapes[parentId].previousId = this._tapes[2].elem.id;

                this._tapes[0].elem.style.flexDirection = "row";
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
                break;
            default:
                this._tapes[parentId][1].nextId = this._tapes[parentId][cellId].elem.id;
                this._tapes[parentId][3].previousId = this._tapes[parentId][cellId].elem.id;

                this._tapes[parentId][cellId].nextId = this._tapes[parentId][3].elem.id;
                this._tapes[parentId][cellId].previousId = this._tapes[parentId][1].elem.id;

                this._tapes[parentId][0].elem.style.flexDirection = "column";
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
        this._tapes[id].elem.className = "line tapeLine";
        this._tapes[id].status = "resizeTape";
        this._tapes[id].elem.id = id;

        if (this._tapes[0].elem.style.flexDirection === "column") {

            this._tapes[id].elem.style.flexBasis = this._LINE_SIZE + "px";
            this._tapes[id].lastFlexBasis = this._LINE_SIZE / this._tapes[0].elem.clientHeight * 100;
            this._shift = this._tapes[id].lastFlexBasis / 2;
        } else {
            this._tapes[id].elem.style.flexBasis = this._LINE_SIZE + "px";
            this._tapes[id].lastFlexBasis = this._LINE_SIZE / this._tapes[0].elem.clientWidth * 100;
            this._shift = this._tapes[id].lastFlexBasis / 2;
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
        this._tapes[parentId][id].elem.className = "line cellLine";
        this._tapes[parentId][id].status = "resizeCell";
        this._tapes[parentId][id].elem.id = id;
        this._tapes[parentId][id].elem.tapeId = parentId;

        if (this._tapes[parentId][0].elem.style.flexDirection === "column") {
            this._tapes[parentId][id].elem.style.flexBasis = this._LINE_SIZE + "px";
            this._tapes[parentId][id].lastFlexBasis = this._LINE_SIZE / this._tapes[parentId][0].elem.clientHeight * 100;
            this._shift = this._tapes[parentId][id].lastFlexBasis / 2;
        } else {
            this._tapes[parentId][id].elem.style.flexBasis = this._LINE_SIZE + "px";
            this._tapes[parentId][id].lastFlexBasis = this._LINE_SIZE / this._tapes[parentId][0].elem.clientWidth * 100;
            this._shift = this._tapes[parentId][id].lastFlexBasis / 2;
        }

        this._internal = this._tapes[parentId][id];
    }

    _editConnections () {
        const parentId = this._tapes[0].currentTapeId;
        const id = this._tapes[parentId][0].lastCellId;

        switch (this._external.elem.className) {
            case "external line tapeLine top":
            case "external line tapeLine left":
            case "external line cellLine top":
            case "external line cellLine left":
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
            if (coordinate < this._MINSIZE || coordinate > 100 - this._MINSIZE) {
                return false;
            }
            this._createTape ();
            this._tapes[0].direction = true;
            this._external = {};
        }

        if (this._isEmpty(this._internal)) return false;

        coordinate = this._checkBorder(coordinate);

        this._setNewSizes.bind(this)(coordinate);

        if (parseFloat(this._next.elem.style.flexBasis) < this._MINSIZE / 2) {
            this._deleteNext (e);
            return false;
        }

        if (parseFloat(this._previous.elem.style.flexBasis) < this._MINSIZE / 2) {
            this._deletePrevious (e);
            return false;
        }

        return false;
    }
    _onMouseCells(e) {

        let coordinate = this._takeCoordinateCell (e);

        if (!this._isEmpty(this._external)) {
            if (coordinate < this._MINSIZE || coordinate > 100 - this._MINSIZE) {
                return false;
            }
            this._createCell ();
            this._tapes[0].direction = true;
            this._external = {};
        }

        if (this._isEmpty(this._internal)) return false;

        coordinate = this._checkBorder(coordinate);

        this._setNewSizes.bind(this)(coordinate);

        if (parseFloat(this._next.elem.style.flexBasis) < this._MINSIZE / 2) {
            this._deleteNextCell (e);
            return;
        }

        if (parseFloat(this._previous.elem.style.flexBasis) < this._MINSIZE / 2) {
            this._deletePreviousCell (e);
            return;
        }

        return;
    }

    _takeCoordinate (e) {
        if (this._tapes[0].elem.style.flexDirection === "column") {
            return (e.pageY - this._MARGIN - this._tapes[0].elem.clientTop) / this._tapes[0].elem.clientHeight * 100;
        }
        return (e.pageX - this._MARGIN - this._CHAT_SIZE - this._tapes[0].elem.clientLeft) / this._tapes[0].elem.clientWidth * 100;
    }
    _takeCoordinateCell (e) {
        const parentId = this._tapes[0].currentTapeId;

        if (this._tapes[parentId][0].elem.style.flexDirection === "column") {
            return (e.pageY - this._MARGIN - (this._tapes[parentId][0].elem.clientTop + this._tapes[0].elem.clientTop)) / this._tapes[parentId][0].elem.clientHeight * 100;
        }
        return (e.pageX - this._MARGIN - this._CHAT_SIZE - (this._tapes[parentId][0].elem.clientLeft + this._tapes[0].elem.clientLeft)) / this._tapes[parentId][0].elem.clientWidth * 100;
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
    }
    _deleteBorderNextTape (shiftNext) {
        this._previous.nextId = this._next.nextId;
        this._tapes[this._next.nextId].previousId = this._previous.elem.id;
        this._previous.elem.style.flexBasis = parseFloat(this._previous.elem.style.flexBasis) + shiftNext + "%";

        this._tapes[0].elem.removeChild(this._tapes[this._internal.elem.id].elem);
        this._tapes[0].elem.removeChild(this._tapes[this._next.elem.id].elem);
        delete this._tapes[this._internal.elem.id];
        delete this._tapes[this._next.elem.id];

        this._tapes[0].currentTapeId = this._previous.elem.id;
        document.onmousemove = null;
    }
    _deleteBorderNextCell (shiftNext) {
        const parentId = this._tapes[0].currentTapeId;
        this._previous.nextId = this._next.nextId;
        this._tapes[parentId][this._next.nextId].previousId = this._previous.elem.id;
        this._previous.elem.style.flexBasis = parseFloat(this._previous.elem.style.flexBasis) + shiftNext + "%";

        this._tapes[parentId][0].elem.removeChild(this._tapes[parentId][this._internal.elem.id].elem);
        this._tapes[parentId][0].elem.removeChild(this._tapes[parentId][this._next.elem.id].elem);
        delete this._tapes[parentId][this._internal.elem.id];
        delete this._tapes[parentId][this._next.elem.id];

        this._tapes[parentId][0].currentCellId = this._previous.elem.id;
        document.onmousemove = null;
    }
    _deleteCenterNextTape () {
        this._internal.nextId = this._tapes[this._next.nextId].nextId;
        this._tapes[this._internal.nextId].previousId = this._internal.elem.id;

        this._tapes[0].elem.removeChild(this._tapes[this._next.nextId].elem);
        this._tapes[0].elem.removeChild(this._tapes[this._next.elem.id].elem);
        delete this._tapes[this._next.nextId];
        delete this._tapes[this._next.elem.id];

        this._next = this._tapes[this._internal.nextId];
    }
    _deleteCenterNextCell () {
        const parentId = this._tapes[0].currentTapeId;
        this._internal.nextId = this._tapes[parentId][this._next.nextId].nextId;
        this._tapes[parentId][this._internal.nextId].previousId = this._internal.elem.id;

        this._tapes[parentId][0].elem.removeChild(this._tapes[parentId][this._next.nextId].elem);
        this._tapes[parentId][0].elem.removeChild(this._tapes[parentId][this._next.elem.id].elem);
        delete this._tapes[parentId][this._next.nextId];
        delete this._tapes[parentId][this._next.elem.id];

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
    }
    _deleteBorderPreviousTape (shiftPrevious) {
        this._next.previousId = this._previous.previousId;
        this._tapes[this._previous.previousId].nextId = this._next.elem.id;
        this._next.elem.style.flexBasis = parseFloat(this._next.elem.style.flexBasis) + shiftPrevious + "%";

        this._tapes[0].elem.removeChild(this._tapes[this._internal.elem.id].elem);
        this._tapes[0].elem.removeChild(this._tapes[this._previous.elem.id].elem);
        delete this._tapes[this._internal.elem.id];
        delete this._tapes[this._previous.elem.id];

        this._tapes[0].currentTapeId = this._next.elem.id;
        document.onmousemove = null;
    }
    _deleteBorderPreviousCell (shiftPrevious) {
        const parentId = this._tapes[0].currentTapeId;
        this._next.previousId = this._previous.previousId;
        this._tapes[parentId][this._previous.previousId].nextId = this._next.elem.id;
        this._next.elem.style.flexBasis = parseFloat(this._next.elem.style.flexBasis) + shiftPrevious + "%";

        this._tapes[parentId][0].elem.removeChild(this._tapes[parentId][this._internal.elem.id].elem);
        this._tapes[parentId][0].elem.removeChild(this._tapes[parentId][this._previous.elem.id].elem);
        delete this._tapes[parentId][this._internal.elem.id];
        delete this._tapes[parentId][this._previous.elem.id];

        this._tapes[parentId][0].currentCellId = this._next.elem.id;
        document.onmousemove = null;
    }
    _deleteCenterPreviousTape () {
        this._internal.previousId = this._tapes[this._previous.previousId].previousId;
        this._tapes[this._internal.previousId].nextId = this._internal.elem.id;

        this._tapes[0].elem.removeChild(this._tapes[this._previous.previousId].elem);
        this._tapes[0].elem.removeChild(this._tapes[this._previous.elem.id].elem);
        delete this._tapes[this._previous.previousId];
        delete this._tapes[this._previous.elem.id];

        this._previous = this._tapes[this._internal.previousId];
    }
    _deleteCenterPreviousCell () {
        const parentId = this._tapes[0].currentTapeId;
        this._internal.previousId = this._tapes[parentId][this._previous.previousId].previousId;
        this._tapes[parentId][this._internal.previousId].nextId = this._internal.elem.id;

        this._tapes[parentId][0].elem.removeChild(this._tapes[parentId][this._previous.previousId].elem);
        this._tapes[parentId][0].elem.removeChild(this._tapes[parentId][this._previous.elem.id].elem);
        delete this._tapes[parentId][this._previous.previousId];
        delete this._tapes[parentId][this._previous.elem.id];
        this._previous = this._tapes[parentId][this._internal.previousId];
    }

    _onMouseUp () {
        document.onmousemove = null;
        document.onmouseup = null;

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

        // setTimeout( this._serializeLayout.bind(this), 20);

        this._next = {};
        this._previous = {};
        this._external = {};
        this._internal = {};
    }

    _resetDirection () {
        const parentId = this._tapes[0].currentTapeId;
        for (let i = 1; i < 5; i++) {
            this._tapes[i].status = "createTape";
            this._tapes[parentId][i].status = "createCell";
        }

        this._tapes[0].direction = false;
    }

    _onResize() {
        this._addForLines = 2 * 10/this._tapes[0].elem.clientWidth * 100;

        this._tapes[1].elem.style.width = 100 + this._addForLines + "%";
        this._tapes[3].elem.style.width = 100 + this._addForLines + "%"

        this.model.onWindowResize();
    }

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

    _getUser (payload) {
        this._user = {
            userId: payload.userList[payload.userList.length-1].userId,
            name: payload.userList[payload.userList.length-1].name,
            color: payload.userList[payload.userList.length-1].color,
        };
    }

    _serializeLayout () {
        const copy = [];

        for (let i = 0; i < this._tapes.length; i++) {
            if (!this._isEmpty(this._tapes[i])) {
                copy[i] = {};
                for (let parentKey in this._tapes[i]) {
                    if (isNaN(parentKey)) {
                        if (parentKey !== "elem") {
                            copy[i][parentKey] = this._tapes[i][parentKey];
                        } else {
                            copy[i].elem = {};
                            copy[i].elem.id = this._tapes[i].elem.id;
                            if (i === 0) {
                                copy[i].elem.flexDirection = this._tapes[i].elem.style.flexDirection;
                            }
                            if (i > 4) {
                                copy[i].elem.flexBasis = this._tapes[i].elem.style.flexBasis;
                                copy[i].elem.order = this._tapes[i].elem.style.order;
                            }
                        }
                    } else {
                        copy[i][parentKey] = {};
                        for (let key in this._tapes[i][parentKey]) {
                            if (key !== "elem") {
                                // if (key === "svg") {
                                //         copy[i][parentKey].svg = this._tapes[i][parentKey].svg.data;
                                // } else {
                                    copy[i][parentKey][key] = this._tapes[i][parentKey][key];
                                // }
                            } else {
                                copy[i][parentKey].elem = {};
                                copy[i][parentKey].elem.id = this._tapes[i][parentKey].elem.id;
                                copy[i][parentKey].elem.tapeId = this._tapes[i][parentKey].elem.tapeId;
                                if (parentKey === "0") {
                                    copy[i][parentKey].elem.flexDirection = this._tapes[i][parentKey].elem.style.flexDirection;
                                }
                                if (parentKey > 4) {
                                    copy[i][parentKey].elem.flexBasis = this._tapes[i][parentKey].elem.style.flexBasis;
                                    copy[i][parentKey].elem.order = this._tapes[i][parentKey].elem.style.order;
                                }
                            }
                        }
                    }
                }
            }
        }

        const payload = {
            userId: this._user.userId,
            layout: copy,
        };
        mediator.emit('layout:change', payload);
    }

    _handleLayout (payload) {
        if (payload.userId !== this._user.userId && payload.layout) {
            this._restoreLayout.bind(this)(payload);
        }
    }

    _restoreLayout (payload) {
        const copy2 = [];

        for (let i = 0; i < payload.layout.length; i++) {
            if (!this._isEmpty(payload.layout[i])) {
                copy2[i] = {};
                for (let parentKey in payload.layout[i]) {
                    if (isNaN(parentKey)) {
                        if (parentKey !== "elem") {
                            copy2[i][parentKey] = payload.layout[i][parentKey];
                        } else {
                            if (i > 4) {
                                copy2[i].elem = document.createElement('div');
                                if (i % 2) {
                                    copy2[i].elem.className = "tape";
                                    this._createCellBackground();
                                    this._createCellBorder();
                                    this._createNewCell();
                                } else {
                                    copy2[i].elem.className = "line tapeLine";
                                }
                            } else {
                                copy2[i].elem = this._tapes[i].elem;
                            }
                            copy2[i].elem.id = payload.layout[i].elem.id;
                            if (i === 0) {
                                copy2[i].elem.style.flexDirection = payload.layout[i].elem.flexDirection;
                            }
                            if (i > 4) {
                                copy2[i].elem.style.flexBasis = payload.layout[i].elem.flexBasis;
                                copy2[i].elem.style.order = payload.layout[i].elem.order;
                            }
                        }
                    } else {
                        copy2[i][parentKey] = {};
                        for (let key in payload.layout[i][parentKey]) {
                            if (key !== "elem") {
                                // if (key === "svg") {
                                //         copy[i][parentKey].svg = this._tapes[i][parentKey].svg.data;
                                // } else {
                                copy2[i][parentKey][key] = payload.layout[i][parentKey][key];
                                // }
                            } else {
                                if (i > 4) {
                                    copy2[i][parentKey].elem = document.createElement('div');
                                    if (i % 2) {
                                        copy2[i][parentKey].elem.className = "cell";
                                    } else {
                                        copy2[i][parentKey].elem.className = "line cellLine";
                                    }
                                } else {
                                    copy2[i].elem = this._tapes[i][parentKey].elem;
                                }
                                copy2[i][parentKey].elem.id = payload.layout[i][parentKey].elem.id;
                                copy2[i][parentKey].elem.tapeId = payload.layout[i][parentKey].elem.tapeId;
                                if (parentKey === "0") {
                                    copy2[i][parentKey].elem.style.flexDirection = payload.layout[i][parentKey].elem.flexDirection;
                                }
                                if (parentKey > 4) {
                                    copy2[i][parentKey].elem.style.flexBasis = payload.layout[i][parentKey].elem.flexBasis;
                                    copy2[i][parentKey].elem.style.order = payload.layout[i][parentKey].elem.order;
                                }
                            }
                        }
                    }
                }
            }
        }

        console.log(this._tapes);
        console.log(copy2);
        console.log(payload.layout);
    }
}

export default Layout;
