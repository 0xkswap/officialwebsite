function rand(min,max){return min+Math.floor(Math.random()*(max-min)+1)}
function square(x){return x*x}
const G=450
class Bubble{constructor(options){this.center=options.center
this.originSize=options.size
this.size=options.size
this.gravityCenter=options.gravityCenter
this.value=options.value||''
this.key=options.key
this.label=options.label||options.key
this.fontSize=options.fontSize||16
this.target=options.gravityCenter
this.m=Math.PI*square(this.size)*1
this.vx=(this.target.x-this.center.x)/G
this.vy=(this.target.y-this.center.y)/G
this.lastDistance=this.distance()
this.selected=false
this.pendingTarget=null
this.ax=0
this.ay=0
this.speed=0
this.attenuating=false
this.index=0
this.mouseEntered=false}
setIndex(i){this.index=i}
setValue(value){this.value=value}
setLabel(label){this.label=label}
reset(target){this.target=target
this.vx=(this.target.x-this.center.x)/G
this.vy=(this.target.y-this.center.y)/G
this.lastDistance=this.distance()}
setSelection(selected){this.selected=selected
if(!selected){this.target=this.gravityCenter
this.pendingTarget=null}}
onMouseEnter(){if(!this.mouseEntered){this.mouseEntered=true}}
onMouseLeave(){if(this.mouseEntered){this.mouseEntered=false}}
move(ms){this.vx+=this.ax*ms
this.vy+=this.ay*ms
this.speed=Math.sqrt(square(this.vx)+square(this.vy))
const dx=this.vx*ms
const dy=this.vy*ms
this.center.x+=dx
this.center.y+=dy
const scaleFactor=1.03
const maxScale=1.15
if(this.mouseEntered){if(this.size*scaleFactor<=this.originSize*1.15){this.size*=scaleFactor}}else if(this.size>this.originSize){this.size/=scaleFactor
if(this.size<this.originSize){this.size=this.originSize}}
const currentDist=this.distance()
if(currentDist>this.lastDistance){this.vx*=0.5
this.vy*=0.5
this.ax=0
this.ay=0}else{}
this.lastDistance=currentDist}
checkSpeed(){if(this.speed<0.01){this.vx=(this.target.x-this.center.x)/G/5
this.vy=(this.target.y-this.center.y)/G/5
return true}
return false}
distance(){const dx=this.target.x-this.center.x
const dy=this.target.y-this.center.y
return Math.sqrt(square(dx)+square(dy))}
draw(ctx){const{x,y}=this.center
if(this.mouseEntered){const gradient=ctx.createRadialGradient(x,y,this.size,x+this.size,y+this.size,this.size)
gradient.addColorStop(0,'#0C91FF')
gradient.addColorStop(1,'#8665FA')
ctx.fillStyle=gradient}else{ctx.fillStyle='white'}
ctx.strokeStyle='#87CEFA'
ctx.lineWidth=0.5
ctx.shadowBlur=50
ctx.shadowOffsetX=0
ctx.shadowOffsetY=0
ctx.shadowColor='rgba(15, 90, 251, 0.2)'
ctx.beginPath()
ctx.arc(x,y,this.size,0,Math.PI*2,true)
ctx.closePath()
ctx.stroke()
ctx.fill()
if(this.value&&this.label){ctx.font=`bold ${this.fontSize*2}px Poppins-Regular`
ctx.fillStyle=this.mouseEntered?'#FFF':'#23252B'
const valueMetrics=ctx.measureText(this.value)
ctx.fillText(this.value,x-valueMetrics.width/2,y-4)
ctx.font=`400 ${this.fontSize}px Poppins-Regular`
ctx.fillStyle=this.mouseEntered?'#FFF':'#454F6E'
const labelMetrics=ctx.measureText(this.label)
ctx.fillText(this.label,x-labelMetrics.width/2,y+20)}}
isCollided(other){const dx=this.center.x-other.center.x
const dy=this.center.y-other.center.y
return square(dx)+square(dy)<=square(this.size+other.size)}}
class Scene{constructor(options){options=options||{}
this.canvas=options.canvas
this.ctx=this.canvas.getContext('2d')
this.objects=[]
this.objectMap=new Map()
this.timer=null
this.fps=options.fps||30
this.resize()}
get width(){return this.canvas.width}
get height(){return this.canvas.height}
getBubble(label){return this.objectMap.get(label)}
init(objects){this.objects=objects
this.objectMap.clear()
for(const o of objects){if(o.key){this.objectMap.set(o.key,o)}}
this.canvas.onmousedown=(e)=>{const{clientX,clientY}=e
for(let i=0;i<this.objects.length;i++){const o=this.objects[i]
if(square(o.center.x-clientX)+square(o.center.y-clientY)<square(o.size)){o.setSelection(true)
this.objects[i]=this.objects[0]
this.objects[0]=o
break}}}
this.canvas.onmousemove=(e)=>{let hasSelected=false
for(const o of this.objects){if(o.selected){hasSelected=true
o.pendingTarget={x:e.clientX,y:e.clientY}}}
if(!hasSelected){const{clientX,clientY}=e
for(const o of this.objects){if(square(o.center.x-clientX)+square(o.center.y-clientY)<square(o.size)){o.onMouseEnter()}else{o.onMouseLeave()}}}}
this.canvas.onmouseup=()=>{for(const o of this.objects){if(o.selected){o.setSelection(false)}}}}
start(){if(this.timer)clearInterval(this.timer)
this.timer=setInterval(this.frame.bind(this),1000/this.fps)
setInterval(()=>{this.objects.forEach((o)=>{if(o.pendingTarget)o.reset(o.pendingTarget)})},50)}
frame(){this.compute()
this.updateObjectIndex()
this.draw()}
compute(){this.objects.forEach((o)=>o.checkSpeed())
this.objects.sort((l,r)=>{if(l.selected)return-1
if(r.selected)return 1
return r.speed-l.speed})
for(let i=0;i<this.objects.length;i++){const oi=this.objects[i]
oi.move(1000/this.fps)
for(let j=i+1;j<this.objects.length;j++){const oj=this.objects[j]
if(oj.isCollided(oi)){const sx=oj.center.x-oi.center.x
const sy=oj.center.y-oi.center.y
const sz=Math.sqrt(square(sx)+square(sy))
let s0=Math.acos(sx/sz)
if(sy!==0){s0*=sy/Math.abs(sy)}
let alx=oi.center.x
let aly=oi.center.y
let blx=oj.center.x
let bly=oj.center.y
const dn=sz
const dc=oi.size+oj.size
if(dn<dc-0.1){const de=dc-dn
const dx=de*Math.cos(s0)
const dy=de*Math.sin(s0)
blx+=dx
bly+=dy}
oi.center.x=alx
oi.center.y=aly
oj.center.x=blx
oj.center.y=bly
if(j>i+1){this.objects[j]=this.objects[i+1]
this.objects[i+1]=oj}}}}}
updateObjectIndex(){this.objects.forEach((o,index)=>o.setIndex(index))}
draw(){this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
for(const o of this.objects){o.draw(this.ctx)}}
drawLogo(){const ctx=this.ctx
const calcX=(i)=>((i%4)+1)*300
const calcY=(i)=>(Math.floor(i/4)+1)*300-150
ctx.beginPath()
ctx.moveTo(calcX(1),calcY(1))
ctx.lineTo(calcX(9),calcY(9))
ctx.moveTo(calcX(5),calcY(5))
ctx.lineTo(calcX(2),calcY(2))
ctx.moveTo(calcX(5),calcY(5))
ctx.lineTo(calcX(10),calcY(10))
ctx.closePath()
ctx.strokeStyle='blue'
ctx.lineWidth=0.5
ctx.stroke()
ctx.fill()}
resize(){this.canvas.width=document.documentElement.clientWidth-5
this.canvas.height=document.documentElement.clientHeight-5}}
window.rand=rand
window.Bubble=Bubble
window.Scene=Scene