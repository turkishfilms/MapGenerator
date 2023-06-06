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

const pickColorByHeight = (h, thresh, x) => {

    const cols = [
        { name: "WaterBlue", color: { red: 20, green: 60, blue: 200 }, factor: 0 },
        { name: "BeachTan", color: { red: 120, green: 180, blue: 30 }, factor: 1 },
        { name: "ForestGreen", color: { red: 0, green: 255, blue: 12 }, factor: 2 },
        { name: "RockGrey", color: { red: 100, green: 100, blue: 100 }, factor: 3 },
        { name: "SnowWhite", color: { red: 255, green: 255, blue: 255 }, factor: 4 },
        { name: "BrightPurple", color: { red: 200, green: 60, blue: 200 }, factor: 5 },
    ]
    console.log(x)
    for (i in cols) {
        if (cols[i].factor == floor(h / thresh)) return cols[i].color
    }
}

/**Creates an island2
 *@function 
 * @desc males an isalnd in the pixels array
 * @param { Number } inc -Increment value for perlin noise, affects "smoothness"
 * @param { Number } fallOff -The "steepness" of the border map boundary
 * @param { Array[2] } center -Coords of island's center 
 * @param { Number } seed -seed for noise()
 * @param { Number } _squareness -How sqaure the border is
 * 
 * @desc creates an array of length pixels.length/4 of values between 1 and 0. 1 in the center and tapering off radially to 0 by factor fallOff
 * @issue if user can pick focus how do I algotihmically find the max Dist ( always in a corner: so do a quadrant check and pick "opposite quadrants corner") 
 */
const islandC = (options) => {
    const {
        inc = 0.1,
        fallOff = 3,
        center = {
            x: (width / 2),
            y: (height / 2)
        },
        seed = random(100),
        _squareness = 0
    } = options

    console.log("updating pixels")

    const sss = []
    const maxDist = dist(0, 0, center.x, center.y)
    let yoff = 0;
    noiseSeed(seed)

    for (let y = 0; y < height; y++) {
        let xoff = 0;
        for (let x = 0; x < width; x++) {
            const distToCenter = dist(x, y, center.x, center.y)
            const maskVal = map(distToCenter, 0, maxDist, 1, 0) ** fallOff
            const r = noise(xoff, yoff) * maskVal
            sss.push(r)
            xoff += inc;
        }
        yoff += inc;
    }

    loadPixels();
    const sorted = sss.sort((a, b) => a - b)
    const min = sorted[0]
    const max = sorted[sorted.length - 1]
    const thresh = (max - min) / 5
    console.log(thresh)
    let ind = 0
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const index = (x + y * width) * 4
            const color = pickColorByHeight(sss[ind], thresh, x)
            pixels[index + 0] = color.red;
            pixels[index + 1] = color.green;
            pixels[index + 2] = color.blue;
            pixels[index + 3] = 255;
            ind++
        }
    }
    updatePixels();

    console.log("updated pixels")
    return sss
}

/**Creates an island2
 *@function 
 * @desc males an isalnd in the pixels array
 * @param { Number } inc -Increment value for perlin noise, affects "smoothness"
 * @param { Number } fallOff -The "steepness" of the border map boundary
 * @param { Array[2] } center -Coords of island's center 
 * @param { Number } seed -seed for noise()
 * @param { Number } _squareness -How sqaure the border is
 * 
 * @desc creates an array of length pixels.length/4 of values between 1 and 0. 1 in the center and tapering off radially to 0 by factor fallOff
 * @issue if user can pick focus how do I algotihmically find the max Dist ( always in a corner: so do a quadrant check and pick "opposite quadrants corner") 
 */

const island2 = (options) => {
    const {
        inc = 0.1,
        fallOff = 3,
        center = {
            x: (width / 2),
            y: (height / 2)
        },
        seed = random(100),
        _squareness = 0
    } = options

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

function touchStarted() { }

function keyPressed() {
    if (key == " ") island2()
    if (key == "c") islandC()
    if (key == "lf") decreaseSize()
    if (key == "rf") increaseSize()
    if (key == "ua") sharpenNoise()
    if (key == "da") smoothenNoise()
}



function draw() {
    // background(0)
    // noiseSeed(frameCount / 1000)
    // noiseMapStuff({ x: 0.02 })
}