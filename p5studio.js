var mode = "create";

//editor itself
class Studio{
   constructor(position, dimensions, loop, clear, color) {
        this.positionX = position.x;
        this.positionY = position.y;
        this.width = dimensions.x;
        this.height = dimensions.y;
        this.loop = loop;
        this.color = color || 255;
        this.clear = clear;
        this.layerPanel = new LayerPanel('layerPanel');
        this.activeTool = null;
        this.currObj = null;
        this.currTool = null;
        this.colorFill = '#eee';
        this.toolSet = [
            //select tool
            {parent: {id: 'toolPanel', object: this}, title: 'select Tool', id: 'selectTool', size: createVector(50, 50), functionality: t, iconClass:'fas fa-mouse-pointer', cursor:'default', support: {isDrawingTool: true}},
            
            //change point tool
            {parent: {id: 'toolPanel', object: this}, title: 'select Tool', id: 'selectTool', size: createVector(50, 50), functionality: t, iconClass:'far fa-hand-pointer', cursor:'default', support: {isDrawingTool: true}},
            
            //draw triangle
            {parent: {id: 'toolPanel', object: this}, title: 'triangle Tool', id: 'triangleTool', size: createVector(50, 50), functionality: t, iconClass: 'fas fa-caret-up', cursor: 'crosshair', support: {isDrawingTool: true}},
           
            //draw square
            {parent: {id: 'toolPanel', object: this}, title: 'square Tool', id: 'squareTool', size: createVector(50, 50), functionality: squareToolCreate, iconClass: 'far fa-square', cursor: 'crosshair', support: {isDrawingTool: true, drag: true}},
            
            //draw polygons
            {parent: {id: 'toolPanel', object: this}, title: 'polygon Tool', id: 'polygonTool', size: createVector(50, 50), functionality: t, iconClass: 'far fa-star', cursor: 'crosshair', support: {isDrawingTool: true}},
           
            //free draw
            {parent: {id: 'toolPanel', object: this}, title: 'pen Tool', id: 'penTool', size: createVector(50, 50), functionality:  penTool, iconClass:'fas fa-pencil-alt', cursor:'crosshair', support: {isDrawingTool: true, mouseReleaseMode: 'edit', closePath: ' '}},
            
            //save draw
            {parent: {id: 'toolPanel', object: this}, title: 'export canvas as image', id: 'saveTool', size: createVector(50, 50), functionality:  saveF, iconClass:'far fa-images', cursor:'default', support: {isDrawingTool: false, mouseReleaseMode: 'edit'}}
        ];
   }

    setPosition(){
        //sets the canvas x and y offset from top and left
        //only used if canvas size < screen size
        let canvasStyle = document.querySelector('canvas').style;
        canvasStyle.position = 'absolute';
        canvasStyle.top = this.positionY + 'px';
        canvasStyle.left = this.positionX + 'px';
    }

    populateToolBar(){
        //creates DOM element for every tool button and puts them in their panels
        this.toolSet.forEach(function(tool){
           let temp = new Tool(tool.parent, tool.title, tool.id, tool.size, tool.iconClass, tool.functionality, tool.cursor, tool.support);
           temp.render();
        });
    }
    populateBar(childDOM, id, parent){
        //not in use
        let panel = this.createElement('div', id, 'sideBar', 200, innerHeight/3, parent);
        document.querySelector(parent).appendChild(panel);
    }
    populateOptionBar(){
        //creates the more button in the layer pannel
        //this function should belong to the layerPanel object instead.
        let ths = this;
        let panel = ths.layerPanel;
        let moreBttn = new Tool({id: ths.layerPanel.id , object: panel}, 'new layer', 'newLayerBttn', createVector(25, 25), 'fas fa-plus', panel.createNewLayer, 'default', {isDrawingTool: false});
        moreBttn.render();
    }
    
    addNewLayer(layer){
        //adds new layer and creates a DOM elem for it
        this.layerPanel.addLayer(layer);
        this.LayerPanel.render();
    }
    //creates any element and appends it to a parent element
    createElement(elem, id, clss, width, height, parent){
        let toolBar = document.createElement(elem);
        toolBar.setAttribute('id', id);
        toolBar.setAttribute('class', clss);
        toolBar.style.width = width+'px';
        toolBar.style.height = height + 'px';
        document.querySelector(parent).appendChild(toolBar);
        return toolBar;
    }

    set(){
      //called in the setup function
      //creates the canvas itself, the panels, the tools.
      //renders (create DOM elen) for necessary js objects
        
      let ths = this;
      this.canvas = createCanvas(innerWidth-100, innerHeight-4);
      this.setPosition();
      if(!this.loop) noLoop();
      if(!this.clear) background(this.color);
        
      /*TOOL PANEL*/
      this.createElement('div', 'toolPanel', 'sidebar', 100, (innerHeight-4), 'main');        
      //put tool buttons inside tool bar
      this.populateToolBar();
        
      /*RIGHT PANEL*/
      this.rightSideBar = this.createElement('div', 'controlPanel', 'sidebar right', 200, (innerHeight-4), 'main');
        
      /*LAYER PANEL*/
      let layerDiv = ths.createElement('div', 'lp', '', 195, (innerHeight/3), '#controlPanel');
      let layerPanel = ths.createElement('ul', ths.layerPanel.id, 'sidebar right innerPanel', 195, (innerHeight/3), '#lp')
      this.layerPanel.setDOM(layerPanel);
        
      /*Script Panel*/
      let scriptDiv = ths.createElement('div', 'sp', '', 190, (innerHeight/3), '#controlPanel');
      this.scriptArea = ths.createElement('textarea', 'scriptPanel', 'innerPanel scriptArea', 180, (innerHeight/3), '#sp');
       
        
      /*Color TOOL*/
      let colorDiv = ths.createElement('div', 'cp', '', 190, (innerHeight/3), '#toolPanel');
      this.colorFillDOM = ths.createElement('input', 'colorFill', 'innerPanel', 100, 50, '#cp');
        
        
      this.bindEventsToCanvas();
    
      //LAYER NUMBER 0
      this.populateOptionBar();
      this.layerPanel.createNewLayer();
    }
    
    //connects every vertex and renders every object of every open/displayed layer
    render(){
        let ths = this;
        if(this.clear) clear(); else background(255);
        this.layerPanel.layers.forEach(function(layer){
           if(layer.display){
            
               layer.content.forEach(function(object){
                   beginShape();
                   
                   fill(object.color());
                   for(let point of object.vertices){
                        vertex(point[0], point[1]);
                   }
                   
                   endShape(ths.currTool.support.closePath);
                   
                   ths.updateScript(object);
               });
               
               
            }
        })
    }
    updateScript(obj){
        
        let script = document.querySelector('#scriptPanel');
        
        if(script.value.length < 1){
            let setup = '';
            let before = '';
            let draw = '';
            let html = 
                `${before} \n \n function setup(){\n \t ${setup} \n} \n \n function draw(){\n \t ${draw} \n}`;
            script.value = html;
        }else{
            let before = `var shape = [\n`;
            for(let vert of obj.vertices){
                before += `[${vert}], \n`;
            }
            before += '];';
            let setUp = 'createCanvas(720, 400)';
            let draw = `for (let i = 0; i < ${obj.vertices.length}; i++) { \n\t beginShape() \n\t vertex(shape[i])  \n\t endShape(CLOSE) \n\t}`;
            let html = 
                `${before} \n \n function setup(){\n \t ${setUp} \n} \n \n function draw(){\n \t ${draw} \n }`;
            script.value = html;
        }
    }
    rewriteScript(script, value){
        let value = value;
    }
    addToScript(script, obj){
         
         let text = `${obj}`
         document.querySelector('#scriptPanel').value += text;
    }
    setCurrObj(c){
        this.currObj = c;
    }
    bindEventsToCanvas(){
        
        let ths = this;

        this.canvas.mousePressed(function(event){
            ths.execute(event);
        });
        this.canvas.mouseReleased(function(event){
            if(ths.currTool.support.mouseReleaseMode == 'create'){
                ths.currObj = null;
                events.emit('mode', 'create');
                redraw();
                
            }else if(ths.currTool.support.mouseReleaseMode == 'edit'){
                //ths.currObj = null;
                redraw();
            }
        });
        this.canvas.mouseMoved(function(event){
         let topObjs = ths.layerPanel.layers[ths.layerPanel.layers.length-1].content;
          let topObj = topObjs[topObjs.length-1];
          
          //console.log(topObj);
        })
        
        events.on('turnOnMyTool', function(tool){
            /******* assigns tool functionality to canvas */
             ths.currTool = tool;
        });
        events.on('dragged', function(e){
            if(ths.currTool.support.drag){
                ths.execute(e)
            }
           
        })
        events.on('mode', function(newMode){
            mode = newMode;
        })
        this.colorFillDOM.addEventListener('keyup', function (event){
            if (event.which === 13) {
                ths.colorFill = ths.colorFillDOM.value;
                ths.colorFillDOM.style.backgroundColor = ths.colorFillDOM.value;
            }
        })
    }
    execute(event){
        if(this.currTool != null){
           let ths = this;
           ths.currObj = this.currTool.functionality(this, event);
        }
    }
    changeMode(newMode){
        mode = newMode;
        console.log('mode changed to ', mode);
    }

}

function mouseDragged(e){
    if(mode === 'edit'){
        events.emit('dragged', e);
    }
}

function createPathObject(layerPanel, event){
        let shape = PathObject(layerPanel, event);
        console.log(shape);
        layerPanel.currentLayer.addPathObject(shape);
        return shape;
}

function squareToolCreate(studio, eCreation){
   // console.log(layer);
    let layerPanel = studio.layerPanel;
    if(layerPanel.currentLayer.display && layerPanel.currentLayer.lockStatus){
         let currObj = studio.currObj;
        if(mode === 'create'){
            let npoints = 4;
            let radius = 1;
            //let angle = TWO_PI / npoints;
            let shape = createPathObject(layerPanel, eCreation);
            shape.setColor(studio.colorFill);
            for (var a = 1; a <= 7; a += 2) {
                let angle = (PI*a)/4;
                let sx = floor(eCreation.offsetX + cos(a) * radius);
                let sy = floor(eCreation.offsetY + sin(a) * radius);
                shape.setVetices([sx, sy]);
            }
            events.emit('mode', 'edit');
            return shape;
        }
        if(mode === 'edit'){
            return squareToolEdit(studio);
        }
    }
}

function squareToolEdit(studio){
    let currObj = studio.currObj;
    let x = mouseX - currObj.origin.x;
    let y = mouseY - currObj.origin.y;
    
    currObj.vertices[1] = [currObj.origin.x + x, currObj.origin.y]
    currObj.vertices[2] = [currObj.origin.x + x, currObj.origin.y + y]
    currObj.vertices[3] = [currObj.origin.x, currObj.origin.y + y]
    background(studio.color);
    currObj.update(studio.layerPanel);
    redraw();
    return currObj;
}


function t(){
    
}

function penTool(studio, eCreation){
    let layerPanel = studio.layerPanel;
    
    if(layerPanel.currentLayer.display && layerPanel.currentLayer.lock){
        if(mode == 'create' && studio.currObj == null){
            
            let newObj = createPathObject(layerPanel, eCreation);
            newObj.setVetices([mouseX, mouseY]);
            newObj.setColor(studio.colorFill);
            studio.setCurrObj(newObj);
            redraw();
           events.emit('mode', 'edit');
        } else if(mode == 'edit'){
            let currObj = layerPanel.currentLayer.content[layerPanel.currentLayer.content.length-1];
            let endX = currObj.vertices[0][0];
            let endY = currObj.vertices[0][1];
           if((endX-10 < mouseX && endX+10 >= mouseX)  && (endY-10 < mouseY && endY+10 >= mouseY)){
                events.emit('mode', 'create');
                studio.currObj = null;
                studio.currTool.support.closePath = `${CLOSE}`;
           }
            else
              layerPanel.currentLayer.content[layerPanel.currentLayer.content.length-1].setVetices([mouseX, mouseY]);
              layerPanel.currentLayer.content[layerPanel.currentLayer.content.length-1].update(studio.layerPanel);
        }

    }
}
function saveF(studio, eCreation){
    //console.log('pic');
    saveFrames("out", "png", 1, 25, function(data){
        console.log(data);
    });
}



