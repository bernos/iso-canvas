define(["require", "exports"], function(require, exports) {
    var Logger = (function () {
        function Logger() {
            this.renderTimeBuffer = [];
        }
        Logger.prototype.getLogEl = function () {
            if(null == this.logEl) {
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
        };
        Logger.prototype.getFpsEl = function () {
            if(null == this.fpsEl) {
                this.fpsEl = document.createElement("div");
                this.getLogEl().appendChild(this.fpsEl);
            }
            return this.fpsEl;
        };
        Logger.prototype.getRenderTimeEl = function () {
            if(null == this.renderTimeEl) {
                this.renderTimeEl = document.createElement("div");
                this.getLogEl().appendChild(this.renderTimeEl);
            }
            return this.renderTimeEl;
        };
        Logger.prototype.updateFps = function (fps) {
            this.getFpsEl().innerHTML = "fps: " + normaliseNumber(fps, 3);
        };
        Logger.prototype.updateRenderTime = function (time) {
            this.updateFps(1000 / time);
            this.renderTimeBuffer.push(time);
            if(this.renderTimeBuffer.length > 60) {
                var t = 0;
                for(var i = 0; i < this.renderTimeBuffer.length; i++) {
                    t += this.renderTimeBuffer[i];
                }
                this.getRenderTimeEl().innerHTML = "avg frame time: " + normaliseNumber((t / this.renderTimeBuffer.length), 3);
                this.renderTimeBuffer = [];
            }
        };
        return Logger;
    })();    
    var logger = new Logger();
    function normaliseNumber(num, dec) {
        return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
    }
    exports.normaliseNumber = normaliseNumber;
    function updateFps(fps) {
        logger.updateFps(fps);
    }
    exports.updateFps = updateFps;
    function updateRenderTime(time) {
        logger.updateRenderTime(time);
    }
    exports.updateRenderTime = updateRenderTime;
})

