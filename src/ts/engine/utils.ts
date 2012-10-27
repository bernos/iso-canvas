

class Logger {
    private logEl: HTMLElement;
    private fpsEl: HTMLElement;
    private renderTimeEl: HTMLElement;
    private renderTimeBuffer: number[];
    
    constructor () {
        this.renderTimeBuffer = [];
    }

    private getLogEl(): HTMLElement {
        if (null == this.logEl) {
            this.logEl = document.createElement("div");
            this.logEl.style.position = "absolute";
            this.logEl.style.width = "320px";
            this.logEl.style.posRight = 10;
            this.logEl.style.posTop = 10;
            this.logEl.style.padding = "10px";
            this.logEl.style.color = "#FFFFFF";
            this.logEl.style.backgroundColor = "#111111";
            this.logEl.style.zIndex = "9999";
            document.body.appendChild(this.logEl);
        }
        return this.logEl;
    }

    private getFpsEl(): HTMLElement {
        if (null == this.fpsEl) {
            this.fpsEl = document.createElement("div");
            this.getLogEl().appendChild(this.fpsEl);
        }
        return this.fpsEl;
    }

    private getRenderTimeEl(): HTMLElement {
        if (null == this.renderTimeEl) {
            this.renderTimeEl = document.createElement("div");
            this.getLogEl().appendChild(this.renderTimeEl);
        }
        return this.renderTimeEl;
    }

    updateFps(fps: number): void {
        this.getFpsEl().innerHTML = "fps: " +  normaliseNumber(fps, 3);
    }

    updateRenderTime(time: number) {
        this.updateFps(1000 / time);
        this.renderTimeBuffer.push(time);

        if (this.renderTimeBuffer.length > 60) {
            

            var t = 0;

            for (var i = 0; i < this.renderTimeBuffer.length; i++) {
                t += this.renderTimeBuffer[i];
            }

            this.getRenderTimeEl().innerHTML = "avg frame time: " + normaliseNumber((t / this.renderTimeBuffer.length), 3);

            this.renderTimeBuffer = [];
        }

        
    }
}

var logger = new Logger();

export function normaliseNumber(num: number, dec: number):number {
    return Math.round(num * Math.pow(10, dec)) / Math.pow(10,dec);
}


export function updateFps(fps) {
    logger.updateFps(fps);
}

export function updateRenderTime(time) {
    logger.updateRenderTime(time);
}