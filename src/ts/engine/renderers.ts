//<reference path="../lib.d.ts"/>

import g = module("./geometry");
import t = module("./tiles");

export interface Renderer {
    clear(): Renderer;
    renderTile(tile:any, screenPoint:g.Point): Renderer;
}

export class CanvasRenderer {
    public context: CanvasRenderingContext2D;
    private canvas: any;

    constructor (el: any) {
        this.canvas = el;
        this.context = this.canvas.getContext("2d");
    }

    clear(): Renderer {        
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
        return this;
    }



    renderTile(tile:t.Tile, screenPoint:g.Point, label:string=""): Renderer {

        this.context.drawImage(tile.srcImage,
          tile.srcRect.x,
          tile.srcRect.y,
          tile.srcRect.width,
          tile.srcRect.height - 0,
          screenPoint.x,
          screenPoint.y,
          tile.srcRect.width,
          tile.srcRect.height - 0
        );
        
        //var tm:TextMetrics = this.context.measureText(label);
        //this.context.fillText(label, screenPoint.x + ((tile.srcRect.width - tm.width) / 2), screenPoint.y + ((tile.srcRect.height + 6) / 2));
        
        
        return this;
    }
}