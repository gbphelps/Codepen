let canvas = document.getElementById("streams");

let ctx = document.getElementById("streams").getContext("2d");

function rand() {return Math.random()*2-1;}
function lerp(a,b,w) {return (1-w)*a + w*b;}

function lerpVec(a,b,w)
{
  let x=lerp(a.x,b.x,w);
  let y=lerp(a.y,b.y,w);
  return new coord(x,y);
}

function weight(dist){return dist;}
  //{return (Math.sin(3/2*Math.PI+dist*Math.PI)+1)/2;}



function coord(x,y)
{
  this.x = x;
  this.y = y;
}

coord.prototype.magnitude= function(){
  return Math.sqrt(this.x*this.x + this.y*this.y);
}

coord.prototype.dotProduct=function(vector)
  {
    return this.x * vector.x + this.y * vector.y;
  }

coord.prototype.add= function(vector)
  {
    return new coord(this.x+vector.x,this.y+vector.y);
  }

coord.prototype.subtract=function(vector)
  {
    return new coord(this.x-vector.x,this.y-vector.y);
  }

coord.prototype.multiply=function(scalar)
  {
    return new coord(this.x*scalar,this.y*scalar);
  }

 coord.prototype.plot= function(color='white')
  {
    let x = (this.x + 1) * canvas.height/2;
    let y = (1 - this.y) * canvas.width/2;
    ctx.moveTo(x,y);
    ctx.arc(x,y,1,0,Math.PI*2);
    ctx.fillStyle=color;
    ctx.fill();
  }
 
 coord.prototype.lineTo=function(point,color='white')
  {
    let x = (this.x + 1) * canvas.height/2;
    let y = (1 - this.y) * canvas.width/2;
    ctx.beginPath();
    ctx.strokeStyle=color;
    ctx.moveTo(x,y);
    let x2 = (point.x + 1) * canvas.height/2;
    let y2 = (1 - point.y) * canvas.width/2;
    ctx.lineTo(x2,y2);
    ctx.stroke();
  }
 
 coord.prototype.error=function()
  {
    if (this.x >= 1){return true;}
    if (this.x <= -1){return true;}
    if (this.y >= 1){return true;}
    if (this.y <= -1){return true;}
    return false;
  }

  coord.prototype.belowThreshold=function()
  {
    if (Math.abs(this.x)<0.000001 && Math.abs(this.y)<.000001){return true;}
    return false;
  }  
///////////////////////////////////////////////////////



function movingPoint(point,velocity=(new coord(0,rand()*.003)))
{
  this.position = point;
  this.velocity = velocity;
}  

 movingPoint.prototype.fracture = function()
  {
    if (this.velocity.magnitude()>.00) {return this;}
    let vFrac = new coord(rand()*.03,rand()*.03);
    let v1 = this.velocity.add(vFrac);
    let v2 = this.velocity.subtract(vFrac);
    return [
      new movingPoint(this.position,v1),
      new movingPoint(this.position,v2)
    ];
  }


function mesh(numLines,influence)
{
  let noise=[];
  let increments=[];
  
  for (let i=0;i<=numLines;i++){
      let num = -1 + 2 * i/numLines;
      increments.push(num);
      noise[i]=[];
    
      for (let j=0;j<=numLines;j++){
         noise[i][j]=new coord(rand(),rand());
       }
    }
  
  this.increments=increments;
  this.noise=noise;
  
  this.getNoise=function(point){
    let xnode=0;
    let ynode=0;
    
    while (this.increments[xnode]<=point.x){xnode++;}
    while (this.increments[ynode]<=point.y){ynode++;}
   
    //let c = Math.ceil((point.x+1)*numLines/2)*2/numLines-1;
    // document.write(c);
    
    let bottomLeft=
       this.noise[xnode-1][ynode-1];
    
    let bottomRight=
        this.noise[xnode][ynode-1];
    
    let topLeft=
        this.noise[xnode-1][ynode];
    
    let topRight=
        this.noise[xnode][ynode];
    
    let xscale=(point.x-this.increments[xnode-1])*numLines/2;
    let yscale=(point.y-this.increments[ynode-1])*numLines/2;
    
    let bottom=
      lerpVec(bottomLeft,bottomRight,weight(xscale));
    let top=
      lerpVec(topLeft,topRight,weight(xscale));
    return(
      lerpVec(bottom,top,weight(yscale)).multiply(influence)); 
  }
}

function lineOfPoints(start,end,n)
{
  let result=[];
  let xinc = (end.x-start.x)/n;
  let yinc = (end.y-start.y)/n;
  for (let i=0;i<=n;i++)
  {
    let x = start.x + i*xinc;
    let y = start.y + i*yinc;
    result.push(new movingPoint(new coord(x,y)));
  }
  return result;
}

function circleOfPoints(center,radius,points,theta0=0)
{
  let theta_inc = (2*Math.PI-theta0)/points;
  let theta=theta0;
  let result = [];
  
  for (let i=0;i<points;i++)
  {
    let x = radius * Math.cos(theta) + center.x;
    let y = radius * Math.sin(theta) + center.y;
    result.push(new movingPoint(new coord(x,y)));
    theta += theta_inc;
  }
  return result;
}

//new radial bias doesn't crash at origin
function radialBias(origin,intensity)
{
  return (point)=>
    {
      let distance = point.subtract(origin);
      let scale = 5 * Math.pow(100,distance.magnitude()*-1);
      return distance.multiply(intensity*scale);
    }
}

function whorl(origin,intensity)
{
  return (point)=>
    {
      let distance = point.subtract(origin);
      distance = new coord(-distance.y,distance.x);
    let scale = 
        10 * Math.pow(100,distance.magnitude()*-1);
      return distance.multiply(intensity*scale);
    }
}





////////////////////////////////////////////
//Initital points///////////////////////////
////////////////////////////////////////////

let start = new coord(-1,-1);
let end = new coord(1,1);
let points1 = 
    circleOfPoints(new coord(-.15,.5),.3,1000);
let points2 = circleOfPoints(new coord(.15,.5),.3,1000);
let points3 = lineOfPoints(start,end,1000);


//let morePoints = lineOfPoints(start,end,30);
//points = points.concat(morePoints);
////////////////////////////////////////////


////////////////////////////////////////////
//HERE'S WHERE YOU ADD NEW VECTOR FIELDS////
////////////////////////////////////////////
let meshes = [];
//meshes.push(new mesh(1,.02));
//meshes.push(new mesh(12,.04));
meshes.push(new mesh(20,.07));
meshes.push(radialBias(new coord(.15,.5),.005));
meshes.push(radialBias(new coord(-.15,.5),.005));
//meshes.push(whorl(new coord(0,0),.07));
////////////////////////////////////////////



function calcNoise(point)
{
  let noise = new coord(0,0);
  meshes.forEach(function(mesh){  
    if(typeof mesh == "object")
      {noise = noise.add(mesh.getNoise(point));}
    else
      {noise = noise.add(mesh(point));}
  })
  return noise;
};


function move(stream,color)
{
  if (stream.position.error()){return false;}
  
  let noise = calcNoise(stream.position).multiply(.3);
  let friction = stream.velocity.multiply(.3);
  let wind = new coord(0,0);
  
  let acceleration = noise.subtract(friction).add(wind).multiply(.5)
  
  if (acceleration.belowThreshold())
    {return false;}
  
  let velocity = 
    stream.velocity.add(acceleration);
  
  let position = stream.position.add(velocity);
  
  
  stream.position.lineTo(position,color.print());
  ctx.lineWidth = velocity.magnitude()*100;
  final = new movingPoint(position,velocity);
  return final.fracture();
}


///////////////////////////////// 
function rgba(r,g,b,a)
{
  this.r=r;
  this.g=g;
  this.b=b;
  this.a=a;
}

 rgba.prototype.print = function()
  {
    return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
  }
  
  rgba.prototype.update = function()
  {
    return new rgba(this.r,this.g,this.b,this.a*.97)
  }
//////////////////////////


function nextFrame(streams,color)
{
  let newStreams = [];
  
  for (let i=0;i<streams.length;i++)
  {   
    let stream = move(streams[i],color);
    if (stream){newStreams = newStreams.concat(stream);}
  }
  return newStreams;
}




///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
function run(color,streams)
{

  let running = setInterval(function()
            {
              if (color.a <.01 || streams.length==0)
                {clearInterval(running);}
              streams = nextFrame(streams,color);
              color = color.update();
            },50);
}

let magenta = new rgba(255,0,0,.3);
let aqua = new rgba(255,0,255,.3);


run(magenta,points1);
run(aqua,points2);