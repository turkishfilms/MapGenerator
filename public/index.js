/**
 * TODO: Make grid 
 * TODO: places "Seeds"
 * TODO: grow seeds
 * TODO: 
 * TODO: 
 * 
 * 
 * 
 * 
 */
const CELLSIZE = 15,
    EMPTYVAL = { num: 0, mute: 1 }
let width, height, grid, newGrid, verb = false

function setup() {
    width = windowWidth
    height = windowHeight
    createCanvas(width, height)
    background(0)
    const starting = 100
    grid = ranGrid(genGrid(width,
        height, CELLSIZE, { num: 0, mute: starting }), [{ num: 0, mute: starting },
        { num: 1, mute: starting }, { num: 2, mute: starting }, { num: 3, mute: starting }
    ])
    frameRate(60)
}

function keyPressed() {
    if (key == " ") showGrid(grid)
    if (key == "n") updateGrid(grid)
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
    mixedGrid.forEach((column, x) => {
        column.forEach((cell, y) => {
            mixedGrid[x][y] = vals[floor(random() / ranThresh)]
        })
    })
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

const showGrid = (grid) => {
    // background(0)
    grid.forEach((column, x) => {
        column.forEach((cell, y) => {
            correctColor(cell.num)
            rect(x * CELLSIZE, y * CELLSIZE, CELLSIZE, CELLSIZE)
        })
    })
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
            if (grid[x][y].mute>0) updateCell(grid, x, y)
        })
    })
}

function draw() {
    background(0)
    // console.log("::::::::::::")
    updateGrid(grid)
    showGrid(grid)
    // noLoop()
}