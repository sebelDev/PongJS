export class Vector2 {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    set(x, y) {
        this.x = x
        this.y = y
    }
}

export class Object {
    constructor(position) {
        this.position = position
    }

    // Runs each frame
    update(deltaTime) {
        
    }

    // Draws each frame
    draw(deltaTime, ctx) {
    
    }
}

export class Paddle extends Object {

    constructor(position) {
        super(position)
        this.size = new Vector2(2, 16)
    }

    draw(deltaTime, ctx) {
        ctx.fillStyle = "white"
        ctx.fillRect(this.size.x / -2, this.size.y / -2, this.size.x, this.size.y)
    }
}

export class PlayerPaddle extends Paddle {

    constructor(position) {
        super(position)

        var canvas = document.getElementById("canvas")
        document.addEventListener("mousemove", event => {
            this.position.y = event.y - canvas.offsetTop
            this.position.y *= canvas.height / canvas.clientHeight
            this.position.y = Math.round(this.position.y)
        })
    }

}

export class BotPaddle extends Paddle {

    constructor(position) {
        super(position)
        this.time = 0
    }

    update(deltaTime) {
        this.time += deltaTime
        this.position.y = 135 + (Math.sin(this.time) * (135 - this.size.y / 2))
    }

}

export class Ball extends Object {
    constructor(position, paddles) {
        super(position)
        
        this.paddles = paddles

        this.hspeed = 1
        this.vspeed = 1
        this.speed = 150

        this.width = 4
        this.height = 4

        this.hitSnd = new Audio("/assets/audio/hit.wav")
        this.failSnd = new Audio("/assets/audio/fail.wav")
        this.successSnd = new Audio("/assets/audio/success.wav")
    }

    moveAndCollide(dx, dy) {

        var collision = 0

        this.position.x += dx

        var max_x = 480 - (this.width / -2)
        var min_x = 0 + (this.width / 2)

        var inrange = false

        for (let i = 0; i < this.paddles.length; i++) {
            var paddle = this.paddles[i]
            if (this.position.y + this.height / 2 > paddle.position.y - paddle.size.y / 2 && this.position.y - this.height / 2 < paddle.position.y + paddle.size.y / 2) {
                inrange = true
                if (this.position.x > paddle.position.x) {
                    min_x = paddle.position.x
                } else {
                    max_x = paddle.position.x
                }
            }
        }

        if (this.position.x + this.width / 2 >= max_x || this.position.x - this.width / 2 <= min_x) {

            this.hspeed *= -1
            this.position.x = Math.min(Math.max(this.position.x, min_x), max_x)

            if (collision < 0) {
                collision = 1
            }
        }

        this.position.y += dy

        var max_y = 270 - (this.height / -2)
        var min_y = 0 + (this.height / 2)

        /*
        for (let i = 0; i < this.paddles.length; i++) {
            var paddle = this.paddles[i]
            if (this.position.x + this.width / 2 > paddle.position.x - paddle.size.x / 2 && this.position.x - this.width / 2 < paddle.position.x + paddle.size.x / 2) {
                if (this.position.y > paddle.position.y) {
                    min_y = paddle.position.y
                } else {
                    max_y = paddle.position.y
                }
            }
        }
        */

        if (this.position.y + this.height / 2 >= max_y || this.position.y - this.height / 2 <= min_y) {
            this.vspeed *= -1
            this.position.y = Math.min(Math.max(this.position.y, min_y), max_y)
        }

        return collision
    }

    update(deltaTime) {
        var collision = this.moveAndCollide(this.hspeed * this.speed * deltaTime, this.vspeed * this.speed * deltaTime)

        if (collision > 0) {
            this.hitSnd.currentTime = 0
            this.hitSnd.play()
        }

    }

    draw(deltaTime, ctx) {
        ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height)
    }

}