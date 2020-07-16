class Bird {
    constructor(brain = null) {
        this.x = width / 5;
        this.y = height / 2;
        this.r = 10;
        this.dy = 0;

        this.score = 0;
        this.fitness = 0;
        if (brain) {
            this.brain = brain.copy();
        } else {
            this.brain = new NeuralNetwork(4, 4, 1);
        }
    }

    think(pipes) {
        let inputs = [];
        // current Y position
        inputs[0] = this.y / height;
        
        let nextPipe = pipes.reduce((prev, curr) => {
            if (curr.x > prev.x && this.x > prev.x + prev.w) {
            // if (prev.x + prev.w < curr.x && prev.x > this.x) {
                return curr;
            } else {
                return prev;
            }
        });
        // horizontal distance to next pipe
        inputs[1] = nextPipe.x / width;
        // vertical distance to next top pipe
        inputs[2] = nextPipe.top / height;
        // vertical distance to next bottom pipe
        inputs[3] = nextPipe.bottom / height;

        let output = this.brain.feedForward(inputs)[0];

        if (output > 0.5) {
            this.jump();
        }
    }

    jump() {
        this.dy = -4.0;
    }

    collides(pipes) {
        let collision = false;
        for (let pipe of pipes) {
            if (pipe.collides(this)) {
                collision = true;
            }
        }
        return collision || (this.y + this.r * 2 >= height) || (this.y < 0);
    }

    update() {
        this.score++;
        this.y += this.dy;
        this.dy += 0.2;
    }

    draw() {
        stroke(255);
        fill(255, 30);
        ellipseMode(CORNER);
        ellipse(this.x, this.y, 2 * this.r);
    }

    mutate(fn) {
        this.brain.mutate(fn);
    }
}