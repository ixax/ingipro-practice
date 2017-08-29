import * as d3 from 'd3';
// import mediator from '../mediator';
import './style.css';

class Marks {
    constructor(parent, color) {
        document.addEventListener("keydown", this._onDownShiftPlusCtrl.bind(this), false);
        document.addEventListener("keyup", this._onUpShiftPlusCtrl.bind(this), false);

        this.flag = false;
        this.id = parent.globalId;
        this._color = color;
        this.domMark = d3.select(parent);
        this.svg = this.domMark.append("svg")
        .on("mousedown", this.mousedown.bind(this))
        .style("width", "100%")
        .style("height", "100%");

        this.line = d3.line()
        .x(d => d[0])
        .y(d => d[1])
        .curve(d3.curveLinear);
        // this.metodChangeSVG = this.changeSVG.bind(this);
        // this.metodDrowNewLine = this.drowNewLine.bind(this);
        // this.metodDeleteAll = this.deleteAll.bind(this);
        // mediator.on('layout:change', this.metodChangeSVG);
        // mediator.on('3d:turn', this.metodDeleteAll);
        // mediator.on('3d:zoom', this.metodDeleteAll);
        // mediator.on('3d:pan', this.metodDeleteAll);
        // mediator.on('marks:add', this.metodDrowNewLine);
    }

    // destruct(){
    //     mediator.off('layout:change', this.metodChangeSVG);
    //     mediator.off('3d:turn', this.metodDeleteAll);
    //     mediator.off('3d:zoom', this.metodDeleteAll);
    //     mediator.off('3d:pan', this.metodDeleteAll);
    //     mediator.off('marks:add', this.metodDrowNewLine);
    // }

    _onDownShiftPlusCtrl(e) {
        if (e.shiftKey === true && e.ctrlKey === true)
            this.flag = true;
    }

    _onUpShiftPlusCtrl(e) {
        if (e.shiftKey === true || e.ctrlKey === true) {
            this.flag = false;
        }
    }

    // changeSVG(obj){
    //     if (!this.flag) {
    //         return -1;
    //     }
    //
    //     if (this.id === obj.id) {
    //         this.changeProportions(obj.newWidth, obj.newHeight);
    //     }
    // }
    //
    // changeProportions(width, height) {
    //     this.svg
    //     .style("width", width)
    //     .style("height", height);
    // }

    // deleteAll(obj) {
    //     if (!this.flag) {
    //         return -1;
    //     }
    //     if (this.id === obj.id) {
    //         this.svg.selectAll("path").remove();
    //     }
    // }

    mousedown() {
        if (!this.flag) {
            return -1;
        }

        let data = [];
        this.path = this.svg.append("path");
        this.path
        .attr("stroke", this._color)
        .attr("stroke-width", 4)
        .attr("fill", "none");

        this.svg
        .on("mousemove", () => {
            if (!this.flag) {
                this.svg
                .on("mousemove", null)
                .on("mouseup", null);
                return -1;
            }

            data.push(d3.mouse(this.svg.node()));
            console.log(d3.mouse(this.svg.node()));
            // let coordinate = d3.mouse(this.svg.node());
            // if (coordinate[0] > width - 5 || coordinate[0] <= 5 || coordinate[1] > height - 5 || coordinate[1] <= 5) {
            //     this.path.attr("d", this.line(data));
            //     this.svg.on("mousemove", null).on("mouseup", null);
            //     data = [];
            //     return;
            // }

            this.path.attr("d", this.line(data));
        })
        .on("mouseup", () => {

            // mediator.emit('marks:add', {
            //     id: this.id,
            //     data: data,
            //     otherColor: this._color
            // });

            this.svg.on("mousemove", null);
            data = [];
        });
    }

    // drowNewLine(obj) {
    //     //add handler to yourself
    //
    //     if (this.id === obj.id) {
    //         this.path
    //         .attr("stroke", obj.otherColor)
    //         .attr("d", this.line(obj.data));
    //     }
    // }
}

export default Marks;
