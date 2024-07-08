document.addEventListener('DOMContentLoaded', () => {
    const xMax = window.innerWidth * 0.95;
    const yMax = window.innerHeight * 0.95;
    const xMin = window.innerWidth * 0.05;
    const yMin = window.innerHeight * 0.05;

    const widthApple = 50;
    const heightApple = 50;

    const apples = Array.from({ length: 5 }, () => new Apple(xMax, yMax, widthApple, heightApple, xMin, yMin));
    const snake = new Snake(xMax, yMax, xMin, yMin);

    requestAnimationFrame(gameLoop);

    function gameLoop() {
        snake.turn(snake.findClosestApple(apples));
        snake.move();

        apples.forEach(apple => {
            apple.turn(apple.findAngleAwayFromSnake(snake));
            apple.move();
            if (Math.hypot(snake.x - apple.x, snake.y - apple.y) < 50) {
                apple.respawn();
            }
        });

        requestAnimationFrame(gameLoop);
    }
});

class Apple {
    constructor(xMax, yMax, width, height, xMin, yMin) {
        this.speed = 2;
        this.xMax = xMax;
        this.yMax = yMax;
        this.xMin = xMin;
        this.yMin = yMin;
        this.width = width;
        this.height = height;
        this._ele_ = document.createElement('div');
        this._ele_.classList.add('apple');
        this._ele_.style.width = `${width}px`;
        this._ele_.style.height = `${height}px`;

        this.respawn();
        document.body.appendChild(this._ele_);
    }

    respawn() {
        this.x = Math.random() * (this.xMax - this.width) + this.xMin;
        this.y = Math.random() * (this.yMax - this.height) + this.yMin;
        this.updatePosition();
    }

    move() {
        let x_new = this.x + this.dx;
        let y_new = this.y + this.dy;

        if (x_new < this.xMin) x_new = this.xMax;
        else if (x_new > this.xMax) x_new = this.xMin;

        if (y_new < this.yMin) y_new = this.yMax;
        else if (y_new > this.yMax) y_new = this.yMin;

        this.x = x_new;
        this.y = y_new;

        this.updatePosition();
    }

    findAngleAwayFromSnake(snake) {
        const xDiff = snake.x - this.x;
        const yDiff = snake.y - this.y;

        const xDiffWrap = snake.x - this.x + (xDiff > 0 ? -this.xMax : this.xMax);
        const yDiffWrap = snake.y - this.y + (yDiff > 0 ? -this.yMax : this.yMax);

        const angle = Math.atan2(
            Math.abs(yDiff) < Math.abs(yDiffWrap) ? yDiff : yDiffWrap,
            Math.abs(xDiff) < Math.abs(xDiffWrap) ? xDiff : xDiffWrap
        );
        return -angle;
    }

    turn(angle) {
        this.dx = this.speed * Math.cos(angle);
        this.dy = this.speed * Math.sin(angle);
    }

    updatePosition() {
        this._ele_.style.transform = `translate(${this.x}px, ${this.y}px)`;
    }
}

class Snake {
    constructor(xMax, yMax, xMin, yMin) {
        this.xMax = xMax;
        this.yMax = yMax;
        this.xMin = xMin;
        this.yMin = yMin;
        this.speed = 5;
        this.dx = 0;
        this.dy = 0;

        this._ele_ = document.createElement('div');
        this._ele_.classList.add('snake_head');
        this.respawn();

        document.body.appendChild(this._ele_);
    }

    respawn() {
        this.x = Math.random() * (this.xMax - 50) + this.xMin;
        this.y = Math.random() * (this.yMax - 50) + this.yMin;
        this.updatePosition();
    }

    updatePosition() {
        this._ele_.style.transform = `translate(${this.x}px, ${this.y}px)`;
    }

    move() {
        let x_new = this.x + this.dx;
        let y_new = this.y + this.dy;

        if (x_new < this.xMin) x_new = this.xMax;
        else if (x_new > this.xMax) x_new = this.xMin;

        if (y_new < this.yMin) y_new = this.yMax;
        else if (y_new > this.yMax) y_new = this.yMin;

        this.x = x_new;
        this.y = y_new;

        this.updatePosition();
    }

    turn(angle) {
        this.dx = this.speed * Math.cos(angle);
        this.dy = this.speed * Math.sin(angle);
    }

    findClosestApple(apples) {
        let closestApple = apples[0];
        let closestDistance = Math.hypot(this.x - closestApple.x, this.y - closestApple.y);

        apples.forEach(apple => {
            const distance = Math.hypot(this.x - apple.x, this.y - apple.y);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestApple = apple;
            }
        });

        const xDiff = closestApple.x - this.x;
        const yDiff = closestApple.y - this.y;

        const xDiffWrap = closestApple.x - this.x + (xDiff > 0 ? -this.xMax : this.xMax);
        const yDiffWrap = closestApple.y - this.y + (yDiff > 0 ? -this.yMax : this.yMax);

        const angle = Math.atan2(
            Math.abs(yDiff) < Math.abs(yDiffWrap) ? yDiff : yDiffWrap,
            Math.abs(xDiff) < Math.abs(xDiffWrap) ? xDiff : xDiffWrap
        );
        return angle;
    }
}
