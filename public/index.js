/**
 * TODO: Make grid 
 * TODO: places "Seeds"
 * TODO: grow seeds
 * TODO: 
 * TODO: 
 * ----
 * 
 */
const CELLSIZE = 25,
    EMPTYVAL = { num: 0, mute: 1 }

let width,
    height,
    grid,
    newGrid,
    verb = false,
    something,
    pd,
    borderMap,
    borderMapSize,
    distList


function setup() {
    noStroke()
    width = windowWidth
    height = windowHeight
    // width = 100
    // height = 100
    createCanvas(width, height)
    background(0)
    pd = pixelDensity(1)._pixelDensity
    distList = island2()
    console.log("Showed")
}


/**Creates an island2
 *@function 
 * @desc males an isalnd in the pixels array
 * @param { Number } inc -Increment value for perlin noise, affects "smoothness"
 * @param { Number } fallOff -The "steepness" of the border map boundary
 * @param { Array[2] } center -Coords of island's center 
 * @param { Number } seed -seed for noise()
 * @param { Number } squareness -How sqaure the border is
 * 
 * @desc creates an array of length pixels.length/4 of values between 1 and 0. 1 in the center and tapering off radially to 0 by factor fallOff
 * @issue if user can pick focus how do I algotihmically find the max Dist ( always in a corner: so do a quadrant check and pick "opposite quadrants corner") 
 */

const island2 = (inc = 0.1, fallOff = 3, center = { x: (width / 2), y: (height / 2) }, seed = random(100), squareness = 0) => {
    console.log("updating pixels")
    const maxDist = dist(0, 0, center.x, center.y)
    let yoff = 0;
    noiseSeed(seed)
    loadPixels();
    for (let y = 0; y < height; y++) {
        let xoff = 0;
        for (let x = 0; x < width; x++) {
            const distToC = dist(x, y, center.x, center.y)
            const maskVal = map(distToC, 0, maxDist, 1, 0) ** fallOff
            const index = (x + y * width) * 4
            const r = noise(xoff, yoff) * maskVal
            pixels[index + 0] = r * 255;
            pixels[index + 1] = r * 255;
            pixels[index + 2] = r * 255;
            pixels[index + 3] = 255;
            xoff += inc;
        }
        yoff += inc;
    }
    updatePixels();
    console.log("updated pixels")
}

function touchStarted() {}

function keyPressed() {
    if(key == " ") island2()
}

const gridBasedIsalnd = () => {
    /**Creates a 2d array
     * @function
     * @param { Number } w - width of grid area in pixels
     * @param { Number } h - height of grid area in pixels
     * @param { Number } cellSize - height and width of each cell
     * @param { any } val - the backgorund value for the grid
     * @returns { Array } a 2d array
     */
    const genGrid = (w, h, cellSize, val) => {
        const grid = []
        const columns = floor(w / cellSize)
        const rows = floor(h / cellSize)
        for (let i = 0; i < columns; i++) {
            let column = []
            for (let j = 0; j < rows; j++) {
                column.push(val)
            }
            grid.push(column)
        }
        return grid
    }

    /**Randomizes a grid with items from arr 
     * @function
     * @param { Array } grid - 2d array 
     * @param { Array } vals - Choices for the randomization
     * @returns { Array } - 2d array 
     */
    const ranGrid = (grid, vals) => {
        const ranThresh = 1 / vals.length
        const mixedGrid = grid.slice()
        if (ranThresh != 1) {
            mixedGrid.forEach((column, x) => {
                column.forEach((cell, y) => {
                    mixedGrid[x][y] = vals[floor(random() / ranThresh)]
                })
            })
        } else {
            mixedGrid.forEach((column, x) => {
                column.forEach((cell, y) => {
                    mixedGrid[x][y] = random()
                })
            })
        }
        return mixedGrid
    }

    /** Selects color for cell
     * @function
     * @param { Number } number - The value in a cell
     * @returns { Array } - Array[3] [r,g,b]
     */
    const correctColor = (number) => {
        /**
         * 0 is empty
         * 1 is land
         * 2 is water
         * 3 is beach
         */
        switch (number) {
            case 0:
                fill(50)
                break;
            case 1:
                fill(150, 100, 30)
                break;
            case 3:
                fill(250, 200, 30)
                break;
            case 2:
                fill(0, 25, 180)
                break;
        }
    }

    const showGrid = (grid, real) => {
        // background(0)
        if (real) {
            grid.forEach((column, x) => {
                column.forEach((cell, y) => {
                    correctColor(cell.num)
                    rect(x * CELLSIZE, y * CELLSIZE, CELLSIZE, CELLSIZE)
                })
            })
        } else {
            grid.forEach((column, x) => {
                column.forEach((cell, y) => {
                    fill(cell * 255)

                    rect(x * CELLSIZE, y * CELLSIZE, CELLSIZE, CELLSIZE)
                })
            })
        }
    }

    const getNeighbors = (grid, x, y) => {
        const neighbors = []
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                if (x == 0 || x == grid.length - 1 || y == 0 || y == grid[0].length - 1) neighbors.push({ num: -1, mute: 0 })
                else {
                    const val = grid[x + i][y + j]
                    if (verb) console.log("x,", x, "y", y, i, j, val)
                    neighbors.push(val)
                }
            }
        }
        return neighbors
    }

    const updateCell = (grid, x, y) => {
        if (verb) console.log("starting update of", x, y)
        //how tho lol
        const neighbors = getNeighbors(grid, x, y)
        let counts = [0, 0, 0]
        if (verb) console.log("the neighbors of", x, y, "are", neighbors)
        neighbors.forEach(neighbor => {
            if (verb) console.log("this neighbor is", neighbor, )
            if (neighbor.num != -1 && neighbor.num != 0) counts[neighbor.num]++
        })
        const prize = { num: 1 + counts.indexOf(Math.max(...counts)), mute: max(grid[x][y].mute--, 0) }
        grid[x][y] = prize
    }

    const updateGrid = () => {
        // console.log("hi")
        grid.forEach((column, x) => {
            column.forEach((cell, y) => {
                if (grid[x][y].mute > 0) updateCell(grid, x, y)
            })
        })
    }
}

function draw() {
    // background(0)
    // noiseSeed(frameCount / 1000)
    // noiseMapStuff({ x: 0.02 })
}