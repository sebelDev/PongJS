import { Object, Vector2, Paddle, PlayerPaddle, BotPaddle, Ball } from "./classes.js"

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

ctx.fillStyle = "black"
ctx.fillRect(0,0,canvas.width,canvas.height)
ctx.fillStyle = "white"

ctx.font = "14px sans-serif";
ctx.fillText("Loading..", 0, 50);

/*
await new Promise((resolve, reject) => {
    setTimeout(resolve, 2000)
})
*/

const allObjects = []

allObjects.push(new PlayerPaddle(new Vector2(32, 128)))
allObjects.push(new BotPaddle(new Vector2(448, 128)))
allObjects.push(new Ball(new Vector2(240, 135), [allObjects[0], allObjects[1]]))

var lastTime = 0
function update(time) {

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    allObjects[2].speed = 100 + (time / 500)

    var deltaTime = (time - lastTime) / 1000

    //ax+cy+e,bx+dy+f
    for (let i = 0; i < allObjects.length; i++) {
        var obj = allObjects[i]
        ctx.setTransform(1, 0, 0, 1, obj.position.x, obj.position.y)
        obj.update(deltaTime)
        obj.draw(deltaTime, ctx)
    }

    lastTime = time
    requestAnimationFrame(update)
}

update(0)