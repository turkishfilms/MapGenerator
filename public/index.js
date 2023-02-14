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
const CELLSIZE = 30,
    EMPTYVAL = 0
let width, height, grid, newGrid

function setup() {
    width = windowWidth
    height = windowHeight
    createCanvas(width, height)
    background(0)
    grid = genGrid(width, height, CELLSIZE, EMPTYVAL)
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
    for (let i = 0; i < w; i++) {
        let column = []
        for (let j = 0; j < h; j++) {
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
const ranGrid = (grid, vals)=>{
    const ranThresh = 1/vals.length
    const mixedGrid = grid.slice()
mixedGrid.forEach()

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
    switch(number){
        case 0:{
         fill(50)
        }
        case 1:{
         fill(150,100,30)
        }
        case 2:{
         fill(0,25,180)
        }
        case 3:{
         fill(250,200,30)
        }
    }
}

function draw() {
    background(0)
    grid.forEach((column, x) => {
        column.forEach((cell, y) => {
            correctColor(cell)
            rect(x * CELLSIZE, y * CELLSIZE, CELLSIZE)
        })
    })
}