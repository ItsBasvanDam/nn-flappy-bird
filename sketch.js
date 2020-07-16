const height = 480;
const width = 480;

const POPULATION_SIZE = 750;

let generationCounter = 0;

let birds = [];
let deadBirds = [];
let bestBird;
let pipes = [];

let counter = 0;
let slider;

function reset() {
    if (deadBirds.length !== 0) {
        bestBird = deadBirds.reduce((p, c) => {
            if (c.score > p.score) {
                return c;
            } else {
                return p;
            }
        });
    }
    birds = [];
    pipes = [];
    counter = 0;
    generationCounter++;

    calculateFitness();

    if (generationCounter === 1) {
        // fill this generation with random birds
        for (let i = 0; i < POPULATION_SIZE; i++) {
            birds.push(new Bird());
        }
    } else {
        // a generation has passed, mutate
        for (let i = 0; i < POPULATION_SIZE; i++) {
            birds.push(pickOne(deadBirds));
        }
    }
    pipes.push(new Pipe());

    deadBirds = [];
}

function pickOne(list) {
    let index = 0;
    let r = random(1);

    while (r > 0) {
        r = r - list[index].fitness;
        index++;
    }
    index--;

    let bird = list[index];
    let child = new Bird(bird.brain);
    child.mutate(mutation);
    return child;
}

function calculateFitness() {
    let sum = 0;
    for (let bird of deadBirds) {
        sum += bird.score;
    }
    for (let bird of deadBirds) {
        bird.fitness = bird.score / sum;
    }
}

function setup() {
    createCanvas(width, height);
    slider = createSlider(0, 100, 1);
    let button = createButton('Download best bird\'s brain');
    button.mousePressed(downloadBestBrain);
    reset();
    frameRate(60);
}

function downloadBestBrain() {
    saveJSON(bestBird?.brain.serialize(), 'brain.json');
}

function draw() {
    // logic
    for (let n = 0; n < slider.value(); n++) {
        counter++;
        if (counter % 125 === 0) {
            counter = 0;
            pipes.push(new Pipe());
        }

        for (let bird of birds) {
            bird.think(pipes);
            bird.update();
            if (bird.collides(pipes)) {
                let b = birds.splice(birds.indexOf(bird), 1)[0];
                deadBirds.push(b);
            }
        }

        for (let pipe of pipes) {
            pipe.update();
            if (pipe.isOffscreen()) {
                pipes.splice(pipes.indexOf(pipe), 1);
            }
        }

        if (birds.length === 0) {
            reset();
            return;
        }
    }

    // drawing
    background(0);
    for (let bird of birds) {
        bird.draw();
    }
    for (let pipe of pipes) {
        pipe.draw();
    }
    textAlign(RIGHT);
    textSize(16);
    text(`Generation: ${generationCounter}`, width - 10, 20);
}

function mutation(x) {
    if (random(1) < 0.1) {
        let offset = randomGaussian() * 0.5;
        let newX = x + offset;
        return newX;
    } else {
        return x;
    }
}