import { Scene } from "phaser";
import { PriceFetcher } from "../PriceFetcher";
import { Plane } from "../sprites/Plane";
import { Balloon } from "../sprites/Balloon";
import { Background } from "../Background";

let plane;
let debugText;
let graphics;

let targetPoint = new Phaser.Math.Vector2();
let previousPoint;
let previousPoints = [];
let prevTime;
let timeDiff = 0;

let prices;
let priceData;
let pointsCounter = 0;

let velocityX, velocityY;
let speed;
let targetRotation = 0;

// coeffs to play with
const maxPoints = 10;
let planetGravity = 50;
let delta = 1000;
let bgSpeedX = 0.2;
let bgSpeedY = 0.2;

let defaultPlaneSpeed = 50;


export class MainScene extends Scene
{
    constructor ()
    {
        super("MainScene");
    }

    preload ()
    {

    }

    create() {
        const config = this.game.config;

        this.setupPhysics();

        this.bg = new Background(this);

        plane = this.plane = new Plane(
            this,
            config.width / 2, // x
            config.height / 2, // y
            {
                width: config.height / 20,
                height: config.height / 20,
                depth: 100,
            }
        );
        this.planeGroup.add(plane);

        const cam =  this.cameras.main;
        cam.startFollow(plane, true, 1, 1);

        this.setupEvents()

        prices = new PriceFetcher({emitter: this.emitter});
        prices.connect();

                
        debugText = this.add.text(10, 10, '', { fontSize: '16px', fill: '#ffffff' });
        debugText.setScrollFactor(0);
        graphics = this.add.graphics();

        this.setupInput();
    }

    update() {
        this.bg.update(
            plane.body.deltaX() * bgSpeedX,
            plane.body.deltaY() * bgSpeedY,
        );
        if (previousPoints.length > 0) {

            if (plane.y < targetPoint.y) {
                // no new points - drift up
                plane.setVelocity(0, -(defaultPlaneSpeed));
                plane.angle = 0;
            } else {
                plane.rotateToVelocity();
            }
            
            debugText.setText([
                `Plane Position: (${plane.x.toFixed(2)}, ${plane.y.toFixed(2)})`,
                `Target Point: (${targetPoint.x.toFixed(2)}, ${targetPoint.y.toFixed(2)})`,
                `Velocity: (${plane.body.velocity.x.toFixed(2)}, ${plane.body.velocity.y.toFixed(2)})`,
                `VelocityX, VelocityY: (${velocityX?.toFixed(2)}, ${velocityY?.toFixed(2)})`,
                `Gravity: (${plane.body.gravity.x.toFixed(2)}, ${plane.body.gravity.y.toFixed(2)})`,
                `Speed: ${speed}`,
                `Rotation: ${plane.rotation}`,
                `TimeDiff: ${timeDiff}`,
                `Price ${priceData?.price}` 
            ]);
        }
    }

    setupEvents() {
        let emitter = this.emitter = new Phaser.Events.EventEmitter();
        emitter.on("PRICE", this.priceHandler.bind(this));
        emitter.on("BALLOON", this.handleBallonPlaced.bind(this));        
    }

    setupPhysics() {
        this.planeGroup = this.physics.add.group({   
            runChildUpdate: true,  // Enable obj.update() call 
        });
        this.balloonGroup = this.physics.add.group({   
            runChildUpdate: true,
        });
    }

    setupInput() {
        this.input.on('pointerup', this.addBalloon.bind(this));
    }

    priceHandler(data) {
        if (priceData != undefined && priceData.ts > data.ts) {
            return;
        }
        // if (pointsCounter > 5) {
        //     return;
        // }
        priceData = data;
        pointsCounter += 1;
        let y = timeToYCoordinate(data["ts"]);
        targetPoint.set(data["price"] * 100000, y);
        this.setNewTargetPoint(targetPoint);            
    }

    setNewTargetPoint() {
        if (previousPoints.length == 0) {
            plane.setPosition(targetPoint.x, targetPoint.y);
        }

        var point = this.add.circle(targetPoint.x, targetPoint.y, 10, 0xff0000);

        const duration = delta;
        const distance = Phaser.Math.Distance.Between(plane.x, plane.y, targetPoint.x, targetPoint.y);
        speed = distance / (duration / 1000);

        const angle = Phaser.Math.Angle.Between(plane.x, plane.y, targetPoint.x, targetPoint.y);
        velocityX = Math.cos(angle) * speed;
        velocityY = Math.sin(angle) * speed;
        plane.body.setVelocity(velocityX, velocityY);

        targetRotation = angle;
        
        if (previousPoints.length > 0) {
            let totalGravityX = 0;
            let totalGravityY = 0;

            previousPoints.forEach((point, index) => {
                const influence = 1 - (index / previousPoints.length); // Decreasing influence
                const gravAngle = Phaser.Math.Angle.Between(plane.x, plane.y, point.x, point.y);
                totalGravityX += Math.cos(gravAngle) * influence;
                totalGravityY += Math.sin(gravAngle) * influence;

                graphics.lineStyle(2, 0xff0000, 1);
                graphics.beginPath();
                graphics.moveTo(point.x, point.y);
                graphics.lineTo(plane.x, plane.y);
                graphics.closePath();
                graphics.strokePath();
                
            });
            
            plane.body.setGravity(totalGravityX * planetGravity, 0);
        }

        previousPoints.unshift(targetPoint.clone());

        if (previousPoints.length > maxPoints) {
            previousPoints.pop();
        }
        previousPoint = targetPoint.clone();
    }

    addBalloon(pointer) {
        const obj = new Balloon(this, pointer.worldX, pointer.worldY, {
            "width": plane.displayWidth / 2,
            "height": plane.displayHeight / 2,
            "centerY": plane.y
        });
        this.balloonGroup.add(obj);
        console.log("target coin added", pointer.worldX, pointer.worldY)
    }

    handleBallonPlaced(obj) {
        this.physics.add.collider(
            plane, obj, (plane, balloon) => {
                balloon.destroy();
            }
        );
    }
    

}


function timeToYCoordinate(ts) {
    if (prevTime == undefined || previousPoint == undefined) {
        prevTime = ts;
        return 0;
    }
    timeDiff = (ts - prevTime) / 10;
    let y = timeDiff;
    prevTime = ts;

    return previousPoint.y - y;
}
