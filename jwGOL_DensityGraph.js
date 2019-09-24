class jwRLGraph { 

    constructor(width, height, the_top, the_left, unique_id, parent_container) {
               //first 4 arguments used for dimensions/position of scatter plot

        this.width = width; //width of div containing scatter
        this.height = height; //height of div containing scatter
        this.top = the_top; 
        this.left = the_left; 

        this.isVisible = 1; 
        
        this.barWidth = 4; //point dimension will be 5x5
        
        this.container = document.createElement("div"); 
        console.log(this.container); 
        this.container.id =  unique_id; 
        console.log(this.container.id); 
        this.container.className = "rlgraph"; 
        this.container.setAttribute('style',`width: 100%; height: ${this.height}; top: ${this.top}px; left: ${this.left}px; visibility: visible;`); 
        
        
        //buffer length determines how many values to store until line graph starts 
        //"scrolling"
        this.bufferLength = Math.floor(window.innerWidth/this.barWidth); 
        this.data = new Array();  //store data values
        this.bars = new Array();  //store nodes representing data values. 

        this.parent = document.getElementById(parent_container); 
        this.parent.appendChild(this.container); 

    this.toggleVisible = this.toggleVisible.bind(this); 

    this.addData = this.addData.bind(this); 
    }


    //currently expects normalized data in range (0.0 to 1.0) 
    addData(theDatum, isStable) {
       
            var newbar = document.createElement("div");
            let barheight = Math.cbrt(theDatum)*(this.height); //calculates height of bar as percentage of graph height
            //adjust this math here if you're data is not normalized.... 

            let bartop = this.height-barheight; 
            let barleft = this.barWidth*this.data.length; 


            newbar.setAttribute('style', `position: absolute; top: ${bartop}px; left: ${barleft}px; height: ${barheight}; width: ${this.barWidth};`); 
            
            if (isStable) {
                newbar.classList = "RLG_sbar";
            } 

            else {
                newbar.classList = "RLG_ubar";
            }
            // newbar.onmouseover = "background = #000000"
            //this.bars.push(newbar); 
            if (this.data.length < this.bufferLength) {
            
                this.container.appendChild(newbar); 
                
                this.bars.push(newbar)
                this.data.push(theDatum); 
            }

            else { //remove the first data point, add the new datapoint, and shift the graph over. 
                
                //grab the first bar/node and shift array down
                var to_discard = this.bars.shift(); 
                
                //shift data array down
                this.data.shift(); 
                this.container.removeChild(to_discard); 

                this.container.appendChild(newbar); 
                this.bars.push(newbar); 
                this.data.push(theDatum); 
                for (i = 0; i < this.data.length; i++ ) {
                    this.bars[i].style.left = i*(this.barWidth); 
                }
            }
    }   

    
    toggleVisible() {
        // var thegraph = document.getElementById(this.container.id)
        if (this.isVisible == 0) {
            this.isVisible = 1; 
            this.container.style.visibility = "visible"; 
            console.log(this.container); 
            console.log('showing data')  ; 

        }

        else {
            this.isVisible = 0; 
            this.container.style.visibility = "hidden";  
            console.log('hiding data')  ; 

        }
    }




}