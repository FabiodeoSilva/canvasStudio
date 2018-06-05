//Factory Function for path objects
const PathObject = (layerPanel, event) => {
    const id = layerPanel.currentLayer.content.length,
          index = layerPanel.currentLayer.content.length;

    let initialMousePos = {x: event.offsetX, y: event.offsetY};
    
    let length = 0,
        height = 0,
        center = 0,
        colr,
        topObj = false,
        vertices = [],
        untouched = false;
    
    function getId(){
        return id;
    }
    function setColor(clr){
        colr = clr;
    }
    function setVertices(points){
        //only accepts vertices or arrays of vertices
        /*points.isArray? vertices.concat(points) : */
        vertices.push(points);
    }
    function findDimensions(){
        if(vertices.length > 0 ){
            let maxL;
            let maxH;
            vertices.forEach(function(vertex){
                if(vertices.indexOf(vertex) === 0){
                  maxL = vertex[0];
                  maxH = vertex[1];
                } 
                else if(maxL <= vertex[0]){
                   maxL = vertex[0];
                   maxH = vertex[1];
                } 
            });
            height = Math.floor(maxH - initialMousePos.y);
            length = Math.floor(maxL - initialMousePos.x);
        }
    }

    function getcurrentMousePos(){
       /* setInterval(function(){
                console.log('hello');
        }, 1000); */
    }

    function hitbox(x, y){
        //right to center
        let left = initialMousePos.x,
        //left to center
        right = left + length;
        
        //up to center
        let top = initialMousePos.y,
        //down to center
        bottom = top + height;
        
       
        if((x>left && x < right) && (y>top && y<bottom)){
            return true;
        }else{
            return false;
        }
    }
    
    function listen(layerPanel){
        let topLayer;
       /* setInterval(function(){
            //topLayer = layerPanel.layers[layerPanel.layers.length-1];
           // topObj = topLayer.topObj;
            //console.log('heart', mouseX, mouseY);
            let layerOpen = layerPanel.currentLayer.display && layerPanel.currentLayer.lockStatus;
            
            if(layerOpen && hitbox(mouseX, mouseY)){
               // event.emit();
                console.log('touch', id);
            }
        }, 1000)*/

    }
    function update(layerPanel){
        findDimensions();
        listen(layerPanel);
    }
    function build(layerPanel){
        findDimensions();
        listen(layerPanel);
        
    }
    build(layerPanel);
    
    function setTopObject(){
        topObj = true;
    }
    function isTouched(){
        return untouched;
    }
    function setTouch(){
        untouched = false;
    }
    function setColor(c){
        colr = c;
    }
    function getColor(){
        return colr;
    }
    return {
        id: id,
        index: index,
        length: function(){return length},
        height:  function(){return height},
        origin: initialMousePos,
        setVetices: (v) => {setVertices(v)},
        vertices: vertices,
        setColor: function(c){setColor(c)},
        color: function(){return getColor()},
        untouched: function(){return isTouched()},
        touch: function(){setTouch()},
        hit: function(){console.log(hitbox(mouseX, mouseY))},
        trash: () => {vertices = []},
        setLength: (len) => {length = len},
        console: (prop) => console.log(prop),
        update: function(){update();}
    }
}


