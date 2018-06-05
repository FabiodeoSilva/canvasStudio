class Layer{
    constructor(id, index, name, parentId){
        this.id = id;
        this.title = name || 'untitled';
        this.display = true;
        this.index = index;
        this.content = [];
        this.lockStatus = true;
        this.parentID = parentId;
        this.topObj = null;

    }
    changeName(name){
        this.title = name;
    }
    hide(){
        this.display = false;
        redraw();
    }
    setTopObject(){
        let ths = this;
        if(this.content.length >= 0){
           this.topObj = this.content[ths.content.length-1];
        }
        
    }
    show(){
        this.display = true;
        redraw();
    }
    open(){
        this.lockStatus = true;
    }
    close(){
        this.lockStatus = false;
    }
    addPathObject(pathObject){
        this.content.push(pathObject);
        this.setTopObject();
    }
    getObjectIndex(id){
        this.content.forEach(function(obj){
            if(obj.id == id) return obj.index;
        })
    }
    lockToggle(){
        if(this.lockStatus){
            this.close();
            this.lock.tool.setAttribute('class', 'activeTool');
            this.lock.tool.children[0].classList.remove('fa-lock-open');
            this.lock.tool.children[0].setAttribute('class','layerTools fas fa-lock');
        }else if(this.lockStatus == false){
            this.open();
            this.lock.tool.classList.remove('activeTool');
            this.lock.tool.children[0].classList.remove('fa-lock');
            this.lock.tool.children[0].setAttribute('class','layerTools fas fa-lock-open');
        }
    }
    
    eyeToggle(){
        if(this.display){
            this.hide();
            this.eye.tool.setAttribute('class', 'activeTool');
            this.eye.tool.children[0].classList.remove('fa-eye');
            this.eye.tool.children[0].setAttribute('class','layerTools far fa-eye-slash');
        }else if(this.display == false){
            this.show();
            this.eye.tool.classList.remove('activeTool');
            this.eye.tool.children[0].classList.remove('fa-eye-slash');
            this.eye.tool.children[0].setAttribute('class','layerTools far fa-eye');
        }
    }
    renderLayerOptions(){
        let ths = this;

        this.eye = new Tool({id: ths.id, object: ths}, 'show', 'show'+ths.id, createVector(25, 25), 'far fa-eye layerTools', ths.eyeToggle, 'default', {isDrawingTool: false});
        
        this.lock = new Tool({id: ths.id , object: ths}, 'lock', 'lock'+ths.id, createVector(25, 25), 'fas fa-lock-open layerTools', ths.lockToggle, 'default', {isDrawingTool: false});

        ths.eye.render();
        ths.lock.render();

        
    }
    renderLayer(parentId){
        let ths = this;
        this.layerDOM = document.createElement('li');
        this.layerDOM.setAttribute('id', ths.id);
        this.layerDOM.setAttribute('class', 'layers');
        this.layerDOM.style.width = '190px';
        this.layerDOM.style.height = '50px';
        let title = document.createElement('input');
        title.type = 'text';
        title.style.width = '64px';
        title.style.backgroundColor = 'transparent';
        title.style.color = 'white';
        title.style.border = 'none';
        document.querySelector(parentId).append(this.layerDOM);
        this.renderLayerOptions();
        title.value = this.title;
        this.layerDOM.appendChild(title);
        this.bindEvents();
        
        return this.layerDOM;
    }
    bindEvents(){
        let ths = this;
        this.layerDOM.addEventListener('click', function(e){
            events.emit('setCurrentLayer', ths);
            events.emit('unselectLayer', ths);
        });
        events.on('tl', function(){
            //ths.lock.removeAttribute('class', 'activeTool');
        })
        events.on('unselectLayer', function(layer){
            if(ths != layer){
                ths.layerDOM.style.backgroundColor = '#777';
            }
        })
    }
    
}

class LayerPanel{
    constructor(id){
        this.id = id;
        this.layers = [];
        this.currentLayer = null;
    }
    addLayer(layerObject){
        this.layers.push(layerObject);
        redraw();
    }
    createNewLayer(){
        //console.log(this);
        let ths = this;
        let layers = this.layers;
        let layer = new Layer('layer'+ths.layers.length, ths.layers.length, 'layer '+ths.layers.length, ths.id);
        this.addLayer(layer);
        this.currentLayer = layer;
        layer.renderLayer('#'+ths.id);
        events.emit('newLayer', layer);
        this.bindEvents();
    }
    removeLayer(layerIndex){
        this.layers.splice(layerIndex, 1);
    }
    update(parentPanel, layer){
        parentPanel.prependChild(layer);
    }
    bindEvents(){
        let ths = this;
        events.on('setCurrentLayer', function(layer){
            ths.currentLayer = layer;
            ths.currentLayer.layerDOM.style.backgroundColor = '#aaa';
        });
    }
    setDOM(elem){
        this.layerPanelDOM = elem;
    }

    setCurrentLayer(id){
        let ths = this;
        this.layers.forEach(function(layer){
           if(layer.id == id){
              ths.currentLayer = layer;
           } 
        });
    }
}