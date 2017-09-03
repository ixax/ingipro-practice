import * as d3 from 'd3';
import mediator from '../mediator';
import './style.css';

class Marks {
    constructor(user, parent) {
        document.addEventListener('keydown', this._onDownShiftPlusCtrl.bind(this), false);
        document.addEventListener('keyup', this._onUpShiftPlusCtrl.bind(this), false);

        this._globalId = parent.globalId;

        this._user = user;
        this._flag = false;
        this._countLines = 0;
        this._color = this._user.color;
        this._parent = parent.elem;
        this._domMark = d3.select(parent.elem);
        //parent.elem.onmouseout = () => console.log('out');
        this.myHeight = this._parent.clientHeight;
        this.myWidth = this._parent.clientWidth;
        this.svg = this._domMark.append('svg')
            .on('mousedown', this.mousedown.bind(this))
            .style('width', '100%')
            .style('height', '100%')
            .style('background-color', 'transparent');
        this.lines = [];
        this.line = d3.line()
            .x(d => d[0])
            .y(d => d[1])
            .curve(d3.curveLinear);

        mediator.on('mark:sync', this._drawSVG.bind(this));
        mediator.on('mark:change', this._handleSVG.bind(this));
        mediator.on('camera:change', this._deletePath.bind(this));
        mediator.on('layout:change', this._deleteNeedPath.bind(this));
    }

    _onDownShiftPlusCtrl(e) {
        if (e.shiftKey === true && e.ctrlKey === true) {
            this._flag = true;
        }
    }

    _onUpShiftPlusCtrl(e) {
        if (e.shiftKey === true || e.ctrlKey === true) {
            this._flag = false;
        }
    }

    _drawSVG(obj){
        const payload = obj[this._globalId];
        console.log(this._globalId, payload, 'check');
        this._restoreSVG(payload);
    }
    _deleteNeedPath(obj) {
        if (this.myHeight !== this._parent.clientHeight || this.myWidth !== this._parent.clientWidth) {
            this.svg.selectAll('path').remove();
            this.myHeight = this._parent.clientHeight;
            this.myWidth = this._parent.clientWidth;
        }
    }

    _deletePath(obj) {
        if (this._globalId === obj.globalId) {
            this.svg.selectAll('path').remove();
        }
    }

    mousedown() {
        if (!this._flag) {
            return -1;
        }

        let data = [];
        this.path = this.svg.append('path');
        this.path
            .attr('stroke', this._color)
            .attr('stroke-width', 4)
            .attr('fill', 'none')
            .attr('position', 'relative');


        this.svg
            .on('mousemove', () => {
                if (!this._flag) {
                    this.svg
                        .on('mousemove', null)
                        .on('mouseup', null);
                    return -1;
                }

                data.push(d3.mouse(this.svg.node()));
                this.path.attr('d', this.line(data));
            })
            .on('mouseup', () => {
                this.svg.on('mousemove', null);

                this.lines[this.lines.length] = {
                    data: data,
                    color: this._color,
                };

                setTimeout(this._serializeSVG.bind(this), 20);
                data = [];
                return data;
            });
    }

    _serializeSVG() {
        const payload = {
            userId: this._user.userId,
            globalId: this._globalId,
            lines: this.lines,
        };
        //console.log(payload);
        mediator.emit('mark:change', payload);
    }

    _handleSVG(payload) {
        //console.log(payload);
        if (payload.userId !== this._user.userId && payload.globalId === this._globalId) {
            this._restoreSVG.bind(this)(payload);
        }
    }

    _isEmpty(obj) {
        for (let key in obj) {
            return false;
        }
        return true;
    }

    _restoreSVG(payload) {
        this.path = this.svg.append('path');
        this.path
            .attr('stroke-width', 4)
            .attr('fill', 'none')
            .attr('position', 'relative');

        this.lines = payload.lines;
        console.log(this.lines);
        //this.svg.select('path').selectAll('d').remove();

        this.lines.forEach(val => {
            this.path
                .attr('stroke', 'black')
                .attr('d', this.line(val.data));
        });
    }
}

export default Marks;
