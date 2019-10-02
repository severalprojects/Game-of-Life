
var field = document.getElementById('field'); 
var data = document.getElementById('data'); 
var gencounter = document.getElementById('gencounter'); 
var seed = document.getElementById('seed'); 
var cdensity = document.getElementById('cdensity'); 
var uncolonized = document.getElementById('uncolonized'); 
var stability = document.getElementById("isStable"); 
var period = document.getElementById("periodicity"); 
var stab_time = document.getElementById("gentostable"); 
var world_size = document.getElementById("size"); 
var worldcounter = document.getElementById("wc"); 
var timer = null; 


var cellheight = 10; 
var cellwidth = 10; 


var generation = 1; 
var touched = 0; 
var the_period = 0; 
var stab_generation = 0; 
var worlds_created = 0; 
var became_stable = 0; 
 

var rows = Math.floor(field.clientHeight/cellheight); 
var cols = Math.floor(field.clientWidth/cellwidth); 

var density_meter = new jwRLGraph(800, 100, 425, 0, "density_meter", "field"); 

//function assumes input of 2 2D arrays with numeric entries 
function ArrayMatch2D(arrayA, arrayB) {

    if (arrayA.length != arrayB.length) {
        return false; 
    }
    for (row = 0; row < arrayA.length; row++) {
        if (arrayA[row].length != arrayB[row].length) {
            return false; 
        }
        for (col = 0; col < arrayA[row].length; col++) {
            if (arrayA[row][col] != arrayB[row][col]) {
            return false; 
            }
        }
    }
    //if it makes it all the way through the above, they're the same in every entry! 
    return true; 
}

class genBuffer {
    
    constructor(bufferLength) {
        this.items = new Array(); 
        this.BL = bufferLength; 
    }

    addTo(theitem) {
        if (this.items.length < this.BL) {
            this.items.push(theitem) 
        } 

        else {
            this.items.shift(); 
            this.items.push(theitem)

        }

    }
//FUNCTION TO SEE IF WE'VE REACH PERIODICITY. 
    isStable() {
        if (this.items.length < this.BL) {
            return false; 
        }

        for (i = 0; i < this.items.length; i++){
            for(j = i+1; j < this.items.length; j++) {
                if (ArrayMatch2D(this.items[i], this.items[j])) {
                    the_period = j - i; 
                     

                    return true; 
                    
                }
            }
        }

        return false

    }

    reset() {
        for (let i = 0; i < this.items.length; i++) {
            this.items.pop(); 
        }
    }


}


var worldhistory = new genBuffer(4); 


cells = new Array(); 
for(row = 0; row < rows; row++) {
    cells.push(new Array()); 
    for (col = 0; col < cols; col++) {
    // create a variable of type div
    
    let element = document.createElement('div'); 
	// console.log("created div"); 
	// add a class to it
    element.classList.add('cell'); 
    element.setAttribute("style", `width: ${cellwidth}px; height: ${cellheight}px;`); 
    cells[row].push(element); 
    element.setAttribute('myrow', row); 
    element.setAttribute('mycol', col); 
    element.onclick = function() {
        // console.log(`clicked on row ${parseInt(element.getAttribute('myrow'))}, col ${parseInt(element.getAttribute('mycol'))}`); 
    }
    field.appendChild(element); 

    }
}

function seedOscillator(rows, cols) {
    var generation = new Array(); 
    for (row = 0; row < rows; row++) {
        generation.push(new Array()); 

        for (col=0; col < cols; col++) {
        generation[row].push(0)
        }
    }

    generation[10][9] = 1; 
    generation[10][10] = 1;
    generation[10][11] = 1; 
    
    return generation; 
}

function seedLifeRandom(rows, cols) {
    worlds_created +=1; 
    worldcounter.innerHTML = `WORLDS CREATED: ${worlds_created}`; 
    var generation = new Array(); 
    var density = Math.random()*.75;
    density = density.toFixed(3);  
    seed.innerHTML = `SEED DENSITY: ${density} <br><br>`; 
    for (row = 0; row < rows; row++) {
        generation.push(new Array()); 

        for (col=0; col < cols; col++) {
            let x = Math.random(); 
            if (x < density) { //adjust the percentage to increase live cells
                generation[row].push(1); 
            }
            else {
                generation[row].push(0); 
            }

        }
    }
    console.log(field.clientWidth); 
    return generation; 
}
function clearWorld() {
    var blankworld = new Array(); 
    for (row = 0; row < rows; row++) {
        blankworld.push(new Array()); 
        for (col= 0; col < cols; col++) {
            blankworld[row].push(0); 
        }
    }
    return blankworld; 
}

function seedReplicator(emptyworld) {
    let cX = 20; 
    let cY = 20; 

    emptyworld[21][21] = 1; 
    emptyworld[19][19] = 1;

    emptyworld[20][22] = 1;

    emptyworld[18][20] = 1;


    // emptyworld[cX+1][cY+2] = 1; 
    // emptyworld[cX+1][cY-2] = 1;

    // emptyworld[cX+1][cY+2] = 1; 
    // emptyworld[cX+2][cY-2] = 1;

    // emptyworld[cX][cY+2] = 1; 
    // emptyworld[cX][cY-2] = 1;

    // emptyworld[cX-1][cY-2] = 1;
    // emptyworld[cX-2][cY-2] = 1;

    // emptyworld[cX+1][cY-2] = 1;
    // emptyworld[cX+2][cY-2] = 1;




  

    // emptyworld[cX+2][cY+2] = 1; 
    // emptyworld[cX-2][cY-2] = 1;

    // emptyworld[cX+2][cY] = 1; 
    // emptyworld[cX+2][cY-1] = 1;

    // emptyworld[cX-2][cY] = 1; 
    // emptyworld[cX-2][cY+1] = 1;

    return emptyworld; 

}


function seedPulsar(emptyworld) {
    let cX = Math.floor(emptyworld.length / 2); 
    let cY = Math.floor(emptyworld[0].length/2); 

            for (n=1; n < 4; n++) {
                emptyworld[cX+n][cY] = 1;
                emptyworld[cX][cY+n] = 1; 
                emptyworld[cX+n][cY+5] = 1;
                emptyworld[cX+5][cY+n] = 1; 

                emptyworld[cX-n-2][cY-2] = 1;
                emptyworld[cX-2][cY-(n+2)] = 1; 
                emptyworld[cX-n-2][cY-5-2] = 1;
                emptyworld[cX-5-2][cY-n-2] = 1; 

                emptyworld[cX+n][cY-2] = 1;
                emptyworld[cX][cY-(n+2)] = 1; 
                emptyworld[cX+n][cY-5-2] = 1;
                emptyworld[cX+5][cY-n-2] = 1; 

                emptyworld[cX-n-2][cY] = 1;
                emptyworld[cX-2][cY+n] = 1; 
                emptyworld[cX-n-2][cY+5] = 1;
                emptyworld[cX-5-2][cY+n] = 1; 



                // emptyworld[cX+n][cY-1] = 1;
                // emptyworld[cX][cY-n-1] = 1; 
                // emptyworld[cX+n][cY-6] = 1;
                // emptyworld[cX+5][cY] = 1; 


            }
            // for (n=3; n < 6; n++) {
            //     emptyworld[cX-n][cY] = 1;
            //     emptyworld[cX-n][cY-5] = 1;
            //     emptyworld[cX][cY-n] = 1; 
            //     emptyworld[cX-5][cY-n] = 1; 
                
            //     // emptyworld[cX+(n+5)][cY] = 1; 
            //     // emptyworld[cX][cY+(n+5)] = 1; 
            // }


    return emptyworld; 
 
}


function renderGeneration(update, rows, cols) {
    var UC = 0; 
    for (row = 0; row < rows; row++) {
        for (col=0; col < cols; col++) {
            if (update[row][col] == 0) {
                if (cells[row][col].classList.contains("virgincolor")) {
                    UC +=1; 
                }

                if (cells[row][col].classList.contains("livecolor")) {
                    cells[row][col].classList = "cell touchedcolor"; 
                   
                }

                if (cells[row][col].classList.contains("touchedcolor")) {
                    cells[row][col].classList = "cell touchedcolor"; 
                    
                }

                else {
                cells[row][col].classList = "cell virgincolor"; 
                }
            }
            else { 
                cells[row][col].classList = "cell touchedcolor livecolor"; 
                // console.log(`this row, col alive: ${row}, ${col}`)
            }

        }
    }
    let cdense = getDensity(current).toFixed(3);
    cdensity.innerHTML = `CURRENT DENSITY: ${cdense}`;
    if (density_meter.isVisible) {
    density_meter.addData(cdense, (became_stable > 0)); //THIS IS THE DENSITY METER
    }
    let ru = UC/(rows*cols); 
    uncolonized.innerHTML =`UNTOUCHED: ${ru.toFixed(5)}<br><br>`; 

}

function updateCell(currentBoard, r, c, rows, cols) {
    //GAME OF LIFE RULES CALCULATED HERE
    liveneighbors = 0; 
    for (i = -1; i < 2; i++) {
        for (j = -1; j < 2; j++) {
            // console.log(i, j)
            if (!((j == 0) && (i == 0))) {
                if ((r == 10) && (c == 9)) {
                // console.log(`looking at neighbor`); 
                // console.log(i, j); 
               
                }
                rneighbor = (r+i) % rows; 
                if (rneighbor < 0) {
                    rneighbor += rows; 
                }
                cneighbor = (c+j) % cols; 
                if (cneighbor < 0) {
                    cneighbor += cols; 
                }
                // console.log(((r+i)%rows), ((c+j)%cols))
                liveneighbors += currentBoard[rneighbor][cneighbor]; 
                if ((r == 10) && (c == 9)) {
                // console.log(`value is ${currentBoard[rneighbor][cneighbor]}`)
                }
            }
        }
    }
    if (currentBoard[r][c] == 1) {
        // console.log(`cell ${r}, ${c} has ${liveneighbors} live neighbors`); 
        if (liveneighbors < 2 || liveneighbors > 3) {
            return 0; 
        } 

        if (liveneighbors ==2 || liveneighbors ==3 ) {
            return 1; 
        }
    }
    else if (currentBoard[r][c] == 0 && liveneighbors == 3) {
        return 1; 
    }

    else {
        return 0; 
    }

    

}

function nextGeneration(currentGen, rows, cols) {
    var newGen = new Array(); 
    
    for (row = 0; row < rows; row++) {
        newGen.push(new Array()); 
        for (col = 0; col < cols; col++) {
            newGen[row][col] = updateCell(currentGen, row, col, rows, cols); 
        }
    }
    return newGen; 


}

function getDensity(currentGeneration, thecells) {
    // let cells = currentGeneration.length * currentGeneration[0].length; 
    let numcells = rows*cols; 
    let lives = 0; 
    let colonized = 0; 
    for (row = 0; row < rows; row++) { 
        for (col = 0; col < cols; col++) {
            lives+=currentGeneration[row][col]
        }
        // if ((cells[row][col].classList = "livecolor")) {
        //     colonized+=1; 
        // }
    }

    return lives/numcells; 
    
}

current = seedLifeRandom(rows, cols); 
var newworld = clearWorld();
// current = seedPulsar(newworld);
// current = seedReplicator(newworld); 
console.log(newworld); 
renderGeneration(current, rows, cols); 

worldhistory.addTo(current); 

window.setInterval( function(){
    current = nextGeneration(current, rows, cols);
    worldhistory.addTo(current);  
    renderGeneration(current, rows, cols); 
    generation += 1; 
    world_size.innerHTML = `WORLD SIZE: ${rows*cols} <br><br>`; 
    gencounter.innerHTML = `GENERATION: ${generation}`; 
    // cdensity.innerHTML = `CURRENT DENSITY: ${getDensity(current).toFixed(3)}`; 
    if (worldhistory.isStable()) {
        if (became_stable == 0) {
            became_stable = 1;            
            timer = setTimeout(function(){worldhistory.reset();reseed();}, 10000);  
           
        }
        
        stability.classList = "stable"; 
        stability.innerHTML = "STABLE: YES"; 
        
    }
    else {
        stability.classList = "notstable"; 
        stability.innerHTML = "STABLE: NO"; 

    }

    if (the_period > 0 ) {
        period.innerHTML = `PERIOD: ${the_period}`; 
        if (stab_generation == 0) {
            // setInterval(function(){alert("stable now")},3000);           
            stab_time.innerHTML = `STABILE AFTER GENERATION: ${generation}`;
            stab_generation = generation;  
        }
        //setInterval(function(){reseed()},3000)
        //the_period = 0; 

    }



  }, 100);



function refresh() {
    current = nextGeneration(current.slice(0), rows, cols); 
    renderGeneration(current, rows, cols); 
}

function reseed() {
    
    // var rows = Math.floor(field.clientHeight/cellheight); 
    // var cols = Math.floor(field.clientWidth/cellwidth); 
   
    worldhistory.reset(); 
    generation = 0; 
    the_period = 0; 
    stab_generation = 0; 
    stab_time.innerHTML = ""; 
    period.innerHTML = "";
    became_stable = 0; 
    current = seedLifeRandom(rows, cols);
    if (timer) {
        clearTimeout(timer); 
    }
    
    
     
    //current = clearWorld(); 
    repairWorld();
    //current = seedPulsar(clearWorld()); 
    
}

function reshapeWorld() {
    location.reload(); 

}

function repairWorld() {
    for (row = 0; row < rows; row++) {
        for (col = 0; col < cols; col++) {
            cells[row][col].classList ="cell virgincolor"; 
        }
    }
}



window.addEventListener("keyup", keyCodes); 

var timeoutId;
window.onresize = function(){
  
    window.clearTimeout(timeoutId);
  //call the function after half second
  timeoutId = window.setTimeout(reshapeWorld, 200);
}

function keyCodes(event) {
    var x = event.keyCode;
    // console.log(`key pressed: ${x}`); 

    if (x == 68) {
        density_meter.toggleVisible(); 
    }
  }