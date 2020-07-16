class Matrix {
    /**
     * Algabraïc matrix class.
     * @param {number} rows the amount of rows in the matrix
     * @param {number} cols the amount of columns in the matrix
     * @param {Array} data starting data, matrix fills with
     * zeroes if omitted (optional)
     */
    constructor(rows, cols, data = []) {
        this.rows = rows;
        this.cols = cols;
        this.data = data;

        // initialize as emtpy if no data provided
        if (data === null || data.length === 0) {
            for (let r = 0; r < this.rows; r++) {
                this.data[r] = [];
                for (let c = 0; c < this.cols; c++) {
                    this.data[r][c] = 0;
                }
            }
        } else {
            // check data integrity
            if (data.length !== this.rows || data[0].length !== this.cols) {
                throw new Error('Incorrect data dimensions');
            }
        }
    }

    /**
     * Fills matrix with random floating point values between
     * -1 and 1.
     */
    randomize() {
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                this.data[r][c] = random(-1, 1);
            }
        }
    }

    /**
     * Adds two matrices together.
     * @param {Matrix} m the other matrix
     */
    add(m) {
        Matrix.checkCompatibility(this, m);
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                this.data[r][c] += m.data[r][c];
            }
        }
    }

    /**
     * Generates the transpose of this matrix, returning it
     * as a new matrix.
     */
    transpose() {
        let result = new Matrix(this.cols, this.rows);
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                result.data[c][r] = this.data[r][c];
            }
        }
        return result;
    }

    /**
     * Apply a function to every value in the matrix, returning
     * the resulting matrix.
     * @param {(value: number, x: number, y: number) => void} fn
     * the callback function
     */
    map(fn) {
        let result = new Matrix(this.rows, this.cols);
        for (let r = 0; r < result.rows; r++) {
            for (let c = 0; c < result.cols; c++) {
                result.data[r][c] = fn(this.data[r][c], r, c);
            }
        }
        return result;
    }

    /**
     * Flattens the matrix to a onedimensional array.
     */
    asArray() {
        let arr = [];
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                arr.push(this.data[r][c]);
            }
        }
        return arr;
    }

    /**
     * Prints the matrix to the console as a table.
     */
    print() {
        console.table(this.data);
    }

    /**
     * Returns an exact copy of this Matrix.
     */
    copy() {
        let m = new Matrix(this.rows, this.cols);
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                m.data[r][c] = this.data[r][c];
            }
        }
        return m;
    }

    /**
     * Subtracts the second matrix from the first.
     * @param {Matrix} m1 the matrix to subtract from
     * @param {Matrix} m2 the matrix to subtract m1 by
     */
    static subtract(m1, m2) {
        Matrix.checkCompatibility(m1, m2);
        let result = new Matrix(m1.rows, m1.cols);
        for (let r = 0; r < result.rows; r++) {
            for (let c = 0; c < result.cols; c++) {
                result.data[r][c] = m1.data[r][c] - m2.data[r][c];
            }
        }
        return result;
    }

    /**
     * Calculates the dot product of two matrices, returning
     * the resulting matrix.
     * @param {Matrix} m1 a matrix to multiply with
     * @param {Matrix} m2 a matrix to multiply with
     */
    static dot(m1, m2) {
        if (m1.cols !== m2.rows) {
            throw new Error('Matrices are not dot compatible');
        }
        let result = new Matrix(m1.rows, m2.cols);
        for (let r = 0; r < result.rows; r++) {
            for (let c = 0; c < result.cols; c++) {
                let sum = 0;
                for (let k = 0; k < m1.cols; k++) {
                    sum += m1.data[r][k] * m2.data[k][c];
                }
                result.data[r][c] = sum;
            }
        }
        return result;
    }

    /**
     * Multiplies two matrices together and returns the resulting
     * matrix.
     * @param {Matrix} m the other matrix
     */
    static multiply(m1, m2) {
        Matrix.checkCompatibility(m1, m2);
        let result = new Matrix(m1.rows, m1.cols);
        for (let r = 0; r < m1.rows; r++) {
            for (let c = 0; c < m1.cols; c++) {
                result.data[r][c] = m1.data[r][c] * m2.data[r][c];
            }
        }
        return result;
    }

    /**
     * Initializes a new matrix with the values from the provided
     * array. 
     * @param {Array} arr the array to base the matrix on
     */
    static fromArray(arr) {
        let m = new Matrix(arr.length, 1);
        for (let i = 0; i < arr.length; i++) {
            m.data[i][0] = arr[i];
        }
        return m;
    }

    /**
     * Determines whether the matrices are compatible, based on
     * row- and column-count. Throws an error if matrices are not
     * compatible.
     * @param {Matrix} m1 the first matrix
     * @param {Matrix} m2 the second matrix
     */
    static checkCompatibility(m1, m2) {
        if (m1.rows !== m2.rows || m1.cols !== m2.cols) {
            throw new Error('Matrices are of different dimensions');
        }
    }
}