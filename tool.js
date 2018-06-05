class Tool{
    constructor(parent, title, id, size, iconClass, functionality, cursor, support){
        this.title = title;
        this.parent = parent;
        this.id = id;
        this.size = size;
        this.iconClass = iconClass;
        this.curToggle = false;
        this.cursor = cursor;
        this.support = this.setSupport(support);
        this.functionality = functionality;
    }
    icon(){
        //put icon inside tool button
        let icon = document.createElement('i');
        icon.setAttribute('class', this.iconClass + ' icon');
        this.tool.appendChild(icon);
    }
    build(){
        //create tool button
        this.tool = document.createElement('button');
        this.tool.setAttribute('id', this.id);
        this.tool.setAttribute('class', 'tool');
        this.tool.setAttribute('title', this.title);
        this.tool.style.width = this.size.x + 'px';
        this.tool.style.height = this.size.y + 'px';
        this.icon();
        return(this.tool);
    }

    cursorToogle(){
        //cursor type toggle
        if(this.curToggle == true){
            this.curToggle = false;
        } 
        else if(this.curToggle == false){
            this.curToggle = true;
        }
    }
    
    activate(activated){
        //activate/deactivate cursor
        if(activated){
            document.querySelector('canvas').style.cursor = this.cursor;
            this.curToggle = true;
        } 
        else{
            this.curToggle = false;
        }
    }
    setSupport(supObj){
        //add missing default support
        let supports = {
            drag: false,
            isDrawingTool: false,
            hitbox: false,
            mouseReleaseMode: 'create',
            closePath: `${CLOSE}`
        }
      
        for(let key in supports){
            if((key in supObj)){
                supports[key] = supObj[key];
            }
        }
        return supports;
    }
    bindEvents(){
        let thi = this;

        this.on('click', function(){
            if(thi.support.isDrawingTool){
                //Emits message to canvas to turn on this tool's functionality
                events.emit('turnOnMyTool', thi);
            }else{
                thi.functionality.bind(thi.parent.object)();
            }
            //emits message to other tools turn off their functionality
            events.emit('turnOffYourTool', thi.id);

        });
        
        //changes cursor type and functionality based on message
        events.on('turnOnMyTool', function(tool){
            if(tool.id == thi.id){
                thi.activate(true);
            }
        });
       //emits message to every other tool
       events.on('turnOffYourTool', function(id){
            if(id != thi.id){
                thi.activate(false);
            }
        });
    }
    
    on(event, func){
        this.tool.addEventListener(event, func);
    }
    //builds DOM element and appends to parent div
    render(){
        this.build();
        this.bindEvents();
        let ths = this;
        document.querySelector('#'+this.parent.id).appendChild(this.tool);
    }
}
