import g = module('./geometry');
import d = module('./directions');

export interface IPlotter {
    mapToWorld(mapPoint: g.Point, tileWidth: number, tileHeight: number): g.Point;
    worldToMap(worldPoint: g.Point, tileWidth: number, tileHeight: number): g.Point;
    movePoint(point:g.Point, direction:number): g.Point;
}

export class AbstractPlotter {
    private image: HTMLImageElement;
    private context: CanvasRenderingContext2D;
    
    mouseMapLookup: number[];
    
    constructor () {        
        this.image = new Image();        
        this.context = (<HTMLCanvasElement>document.createElement("canvas")).getContext("2d");
        this.mouseMapLookup = [];
    }

    loadMouseMap(src: string, callback: Function) {
        this.image.onload = () => {
            this.onLoad(callback);
        }
        this.image.src = src;
    }
    
    private onLoad(callback: Function): void {
        this.context.drawImage(this.image, 0, 0);
        var imageData = this.context.getImageData(0, 0, this.image.width, this.image.height).data;

        for (var i = 0; i < imageData.length; i += 4) {
            var r = imageData[i];
            var g = imageData[i + 1];
            var b = imageData[i + 2];

            if (r == 255 && b == 255) {
                this.mouseMapLookup.push(d.SOUTHWEST);
            } else if (g == 255 && b == 255) {
                this.mouseMapLookup.push(d.SOUTHEAST);
            } else if (r == 255) {
                this.mouseMapLookup.push(d.NORTHWEST);
            } else if (g == 255) {
                this.mouseMapLookup.push(d.NORTHEAST);
            } else {
                this.mouseMapLookup.push(-1);
            }
        }

        callback();
    }
}

export class StaggeredMapPlotter extends AbstractPlotter {
  mapToWorld(mapPoint: g.Point, tileWidth: number, tileHeight: number): g.Point {
    return new g.Point((mapPoint.x * tileWidth) + ((mapPoint.y % 2) * tileWidth / 2), mapPoint.y * (tileHeight / 2));
  };

      worldToMap(worldPoint: g.Point, tileWidth: number, tileHeight: number): g.Point {
        var coarsePoint: g.Point = this.worldToMapCoarse(worldPoint, tileWidth, tileHeight);        
        var direction = this.mouseMapLookup[(worldPoint.x % tileWidth) + ((worldPoint.y % tileHeight) * tileWidth)];
        return this.movePoint(coarsePoint, direction);
   }

    worldToMapCoarse(worldPoint: g.Point, tileWidth: number, tileHeight: number): g.Point {
        var y: number = Math.floor(worldPoint.y / tileHeight) * 2;
        var x: number = Math.floor(worldPoint.x / tileWidth);
        return new g.Point(x,y);
    }

  movePoint(point: g.Point, direction: number): g.Point {
    
        switch (direction) {
            case d.NORTH :               
                point.y -= 2;
            break;

            case d.NORTHEAST :
                point.x+=(point.y & 1);
                point.y--;
            break;

            case d.EAST :
                point.x ++;
            break;

            case d.SOUTHEAST :
                point.x+=(point.y & 1);
                point.y++;                
            break;

            case d.SOUTH :
                point.y += 2;
            break;

            case d.SOUTHWEST :
                point.x+=((point.y & 1) - 1);
                point.y++;
            break;

            case d.WEST :
                point.x-=2;
            break;

            case d.NORTHWEST :
                point.x+=((point.y & 1) - 1);
                point.y--;
            break;
        }

        return point;
    }
}

export class SlideMapPlotter extends AbstractPlotter {

    mapToWorld(mapPoint: g.Point, tileWidth: number, tileHeight: number): g.Point {
        return new g.Point((mapPoint.x * tileWidth) + (mapPoint.y * tileWidth / 2), mapPoint.y * (tileHeight / 2));
    };

    worldToMap(worldPoint: g.Point, tileWidth: number, tileHeight: number): g.Point {
        var coarsePoint: g.Point = this.worldToMapCoarse(worldPoint, tileWidth, tileHeight);        
        var direction = this.mouseMapLookup[(worldPoint.x % tileWidth) + ((worldPoint.y % tileHeight) * tileWidth)];

        return this.movePoint(coarsePoint, direction);
   }

    worldToMapCoarse(worldPoint: g.Point, tileWidth: number, tileHeight: number): g.Point {
        var y: number = Math.floor(worldPoint.y / (tileHeight)) * 2;
        var x: number = Math.floor(worldPoint.x / tileWidth) - (y / 2);
        return new g.Point(x,y);
    }

    movePoint(point: g.Point, direction: number): g.Point {
        switch (direction) {
            case d.NORTH :
                point.x++;
                point.y -= 2;
            break;

            case d.NORTHEAST :
                point.x++;
                point.y--;
            break;

            case d.EAST :
                point.x++
            break;

            case d.SOUTHEAST :
                point.y++;
            break;

            case d.SOUTH :
                point.x--;
                point.y += 2;
            break;

            case d.SOUTHWEST :
                point.x--;
                point.y++;
            break;

            case d.WEST :
                point.x--;
            break;

            case d.NORTHWEST :
                point.y--;
            break;
        }

        return point;
    }
}

export class DiamondMapPlotter {
  mapToWorld(mapPoint: g.Point, tileWidth: number, tileHeight: number): g.Point {
    return new g.Point((mapPoint.x - mapPoint.y) * tileWidth/2, (mapPoint.x + mapPoint.y) * tileHeight/2);
  }
}

