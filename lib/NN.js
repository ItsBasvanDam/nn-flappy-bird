function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}

function dsigmoid(y) {
    return y * (1 - y);
}

class NeuralNetwork {
    constructor(inputNodes, hiddenNodes, outputNodes) {
        this.inputNodes = inputNodes;
        this.hiddenNodes = hiddenNodes;
        this.outputNodes = outputNodes;

        this.setLearningRate();

        this.weightsIH = new Matrix(this.hiddenNodes, this.inputNodes);
        this.weightsHO = new Matrix(this.outputNodes, this.hiddenNodes);
        this.weightsIH.randomize();
        this.weightsHO.randomize();

        this.biasH = new Matrix(this.hiddenNodes, 1);
        this.biasO = new Matrix(this.outputNodes, 1);
        this.biasH.randomize();
        this.biasO.randomize();
    }

    setLearningRate(rate = 0.1) {
        this.learningRate = rate;
    }

    feedForward(inputArray) {
        // generating the hidden outputs
        let input = Matrix.fromArray(inputArray);
        let hidden = Matrix.dot(this.weightsIH, input);
        hidden.add(this.biasH);
        // activation function
        hidden = hidden.map(sigmoid);

        // generating the output outputs
        let output = Matrix.dot(this.weightsHO, hidden);
        output.add(this.biasO);
        // activation function
        output = output.map(sigmoid);

        // sending back the onedimensional result
        return output.asArray();
    }

    train(inputArray, targetArray) {
        // generating the hidden outputs
        let inputs = Matrix.fromArray(inputArray);
        let hidden = Matrix.dot(this.weightsIH, inputs);
        hidden.add(this.biasH);
        // activation function
        hidden = hidden.map(sigmoid);

        // generating the output outputs
        let outputs = Matrix.dot(this.weightsHO, hidden);
        outputs.add(this.biasO);
        outputs = outputs.map(sigmoid);

        // convert array to Matrix
        let targets = Matrix.fromArray(targetArray);

        // calculate the errors
        // ERRORS = TARGETS - OUTPUTS
        let outputErrors = Matrix.subtract(targets, outputs);

        // calculate gradient
        let gradients = outputs.map(dsigmoid);
        gradients = Matrix.multiply(gradients, outputErrors);
        gradients = gradients.map(v => v * this.learningRate);

        // calculate deltas
        let hiddenT = hidden.transpose();
        let weightHOD = Matrix.dot(gradients, hiddenT);

        // adjust the weights by the deltas
        this.weightsHO.add(weightHOD);
        // adjust the bias by its deltas
        this.biasO.add(gradients);

        // ==== now the hidden layer ====

        // calculate the hidden layer errors
        let wHOT = this.weightsHO.transpose();
        let hiddenErrors = Matrix.dot(wHOT, outputErrors);

        let hiddenGradients = hidden.map(dsigmoid);
        hiddenGradients = Matrix.multiply(hiddenGradients, hiddenErrors);
        hiddenGradients = hiddenGradients.map(v => v * this.learningRate);

        // calculate deltas
        let inputsT = inputs.transpose();
        let weightIHD = Matrix.dot(hiddenGradients, inputsT);

        // adjust the weights by the deltas
        this.weightsIH.add(weightIHD);
        // adjust the bias by its deltas
        this.biasH.add(hiddenGradients);
    }

    copy() {
        const cp = new NeuralNetwork(this.inputNodes, this.hiddenNodes, this.outputNodes);
        cp.setLearningRate(this.learningRate);
        cp.weightsIH = this.weightsIH.copy();
        cp.weightsHO = this.weightsHO.copy();
        cp.biasH = this.biasH.copy();
        cp.biasO = this.biasO.copy();
        return cp;
    }

    mutate(fn) {
        this.weightsIH = this.weightsIH.map(fn);
        this.weightsHO = this.weightsHO.map(fn);
        this.biasH = this.biasH.map(fn);
        this.biasO = this.biasO.map(fn);
    }

    serialize() {
        return JSON.stringify(this);
    }
}