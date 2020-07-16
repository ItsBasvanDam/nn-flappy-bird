class Pipe {
    constructor() {
        this.x = width;
        this.y = 0;
        this.gap = 70;
        this.top = random(height / 15, 3 / 4 * height);
        this.bottom = height - (this.top + this.gap);
        this.w = 50;
        this.dx = -2;
    }

    collides(bird) {
        // top pipe
        /*
         * [x,0]   --- [x+w,0]
         *   |            |
         * [x,top] --- [x+w,top]
         */
        let rh1 = this.top;
        let rw1 = this.w;
        let rx1 = this.x + rw1 / 2;
        let ry1 = rh1 / 2;

        // bottom pipe
        /*
         * [x,height-bottom] --- [x+w,height-bottom]
         *     |                         |
         * [x,height]        --- [x+w,height]
         */
        let rh2 = this.bottom;
        let rw2 = this.w;
        let rx2 = this.x + rw2 / 2;
        let ry2 = height - rh2 / 2;

        return this.collidesWithRect(rx1, ry1, rw1, rh1, bird) ||
            this.collidesWithRect(rx2, ry2, rw2, rh2, bird);
    }

    /**
     * Determines whether a rectangle intersects with a bird.
     * @see https://www.gamedevelopment.blog/collision-detection-circles-rectangles-and-polygons/
     * @param rx the x position of the center of the rect
     * @param ry the y position of the center of the rect
     * @param rw the width of the rect
     * @param rh the height of the rect
     * @param bird the bird object
     */
    collidesWithRect(rx, ry, rw, rh, bird) {
        // the bird is a circle with centered [x,y] and radius r
        let distX = abs(bird.x + bird.r - rx);
        let distY = abs(bird.y + bird.r - ry);
        if (distX > (rw / 2 + bird.r)) { return false; }
        if (distY > (rh / 2 + bird.r)) { return false; }
        if (distX <= (rw / 2)) { return true; }
        if (distY <= (rh / 2)) { return true; }
        let bd = (distX - rw / 2) ^ 2 + (distY - rw / 2) ^ 2;

        return (bd <= (bird.r ^ 2));
    }

    update() {
        this.x += this.dx;
    }

    isOffscreen() {
        return this.x + this.w < 0;
    }

    draw() {
        stroke(255);
        fill(255, 50);
        rectMode(CORNER);
        rect(this.x, -1, this.w, this.top);
        rect(this.x, height - this.bottom + 1, this.w, this.bottom);
    }
}