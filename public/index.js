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
    // width = windowWidth
    // height = windowHeight
    width = 100
    height = 100
    createCanvas(width, height)
    background(0)
    pd = pixelDensity(1)._pixelDensity
    borderMapSize = height * pd * width * pd * 4

    const starting = 100

    const CELLLIST = [{ num: 0, mute: starting },
        { num: 1, mute: starting }, { num: 2, mute: starting }, { num: 3, mute: starting }
    ]

    const FIRST = CELLLIST[0]
    
    loadPixels()
    let { bm, dis } = borderNoise(5)
    borderMap = bm
    distList = dis
    // something = ranshiff(0.001)
    const borderM = Array(pixels.length).fill(1)
    // combine(something, borderM)
    distList = rs2(0.01, borderM)
    console.log("Showed")
}

/**
pixels long
noise long
border long





 */


const combine = (noise, mask) => {
    loadPixels();
    for (let y = 0; y < height * pd; y++) {
        for (let x = 0; x < width * pd; x++) {
            const maskIndex = (x + y * width * pd);
            const noiseIndex = maskIndex * 4;
            const val = noise[noiseIndex] //* mask[maskIndex]
            pixels[noiseIndex + 0] = val;
            pixels[noiseIndex + 1] = val;
            pixels[noiseIndex + 2] = val;
            pixels[noiseIndex + 3] = 255;
        }
    }
    updatePixels();
}

const rs2 = (inc, mask, seed = 35) => {
    const got = []
    let yoff = 0;
    noiseSeed(seed)
    loadPixels();
    for (let y = 0; y < height; y++) {
        let xoff = 0;
        for (let x = 0; x < width; x++) {
            let index = (x + y * width) * 4;
            // let r = random(255);
            let r = noise(xoff, yoff) * 255 *mask[index];
            pixels[index + 0] = r;
            pixels[index + 1] = r;
            pixels[index + 2] = r;
            pixels[index + 3] = 255;
            got.push(r)
            xoff += inc;
        }
        yoff += inc;
    }

    updatePixels();
    return got
}
const ranshiff = (inc) => {
    loadPixels()
    const noise_ = []
    let yoff = 0
    let xoff = 0
    let y_ = 0
    let x_ = 0
    for (let i = 0; i < borderMapSize; i += 4) { //long
        const woah = noise(xoff, yoff)
        noise_.push(woah)
        pixels[i + 0] = woah * 255
        pixels[i + 1] = woah * 255
        pixels[i + 2] = woah * 255
        pixels[i + 3] = 255
        const x = i % (width * pd)
        const y = floor(i / (width * pd))

        if (x > x_) xoff += inc
        else xoff = 0
        if (y > y_) yoff += inc
        y_ = y
        x_ = x
    }
    console.log("randoming currently")
    updatePixels()
    return noise_
}

/**
 * Creates an array mask
 * @function
 * @param { Number } squareness 
 * @param { Number } fallOff
 * @desc creates an array of length pixels.length/4 of values between 1 and 0. 1 in the center and tapering off radially to 0 by factor fallOff
 * @issue if user can pick focus how do I algotihmically find the max Dist ( always in a corner: so do a quadrant check and pick "opposite quadrants corner") 
 */
const danshiff = (inc) => {
    let yoff = 0;
    loadPixels();
    for (let y = 0; y < height; y++) {
        let xoff = 0;
        for (let x = 0; x < width; x++) {
            let index = (x + y * width) * 4;
            // let r = random(255);
            let r = noise(xoff, yoff) * 255;
            pixels[index + 0] = r;
            pixels[index + 1] = r;
            pixels[index + 2] = r;
            pixels[index + 3] = 255;

            xoff += inc;
        }
        yoff += inc;
    }
    updatePixels();
    // let me = []
    // for (let i = 0; i < pixels.length; i++) me.push(pixels[i])
    // return me
}



const duder = (mask) => {
    loadPixels();
    for (let y = 0; y < height * pd; y++) {
        for (let x = 0; x < width * pd; x++) {
            let indexo = (x + y * width);
            let index = indexo * 4;
            let r = mask[indexo] * 255;
            pixels[index + 0] = r;
            pixels[index + 1] = r;
            pixels[index + 2] = r;
            pixels[index + 3] = 255;
        }
    }
    updatePixels();
}

const borderNoise = (fallOff, squareness) => {
    const borderMap = []
    const dist_ = []
    const focus = { //const for now, Parameterize this later
        x: width * pd / 2,
        y: height * pd / 2
    }
    const maxDist = dist(0, 0, width * pd * 2, height * pd * 2)
    console.log("dist", maxDist)
    for (let i = 0; i < borderMapSize; i++) {
        const x = i % (width * pd)
        const y = floor(i / (width * pd))
        const distToFocus = dist(x, y, focus.x, focus.y)
        dist_.push(distToFocus)
        const maskVal = map(fallOff * distToFocus, 0, maxDist, 1, 0)
        borderMap.push(maskVal)
    }
    console.log("bordermaskers be bordermaskin")
    return { bm: borderMap, dis: dist_ }
}

const noiseMapStuff = (config) => {
    /**IN GENERAL HERES THE PLAN
     * TODO: GEnerate "Smooth" Noise (height map) perlin/pixels
     *  TODO: Generate border "noise" (border/isldn mask)
     *  TODO: color everything
     */

    const smoothNoise = (smoothness) => {

    }


    const coloring = (input) => {
        heightValToColor(input)
    }

    const heightValToColor = (heightVal) => {
        stroke(255 * heightVal)
    }
    const loseerville = () => {
        const n = 1
        for (let i = 0; i < height / n; i++) {
            for (let j = 0; j < width / n; j++) {
                coloring(noise((i + config.x) * (j + config.y)))
                point(j + width / n, i + height / n)
            }
        }
    }
    const thething = danshiff(config.x)
    return thething
}

function touchStarted() {
    background(0)
    noiseSeed(mouseX)
    noiseMapStuff({ x: 0.02, y: mouseY })
}

function keyPressed() {
    if (key == "n") updateGrid(grid)
    if (key == " ") showGrid(grid)
    if (key == "p") {
        background(0)
        noiseMapStuff({ x: (1 / mouseX) * 0.01, y: 1 / mouseY })
        console.log("nope")
    }
    if (key == "m")
        for (let i = 0; i < 100; i++) {
            updateGrid(grid)
            showGrid(grid)
        }

}

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

function draw() {
    // background(0)
    // noiseSeed(frameCount / 1000)
    // noiseMapStuff({ x: 0.02 })
}