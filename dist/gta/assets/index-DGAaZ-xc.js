(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const s of n)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function e(n){const s={};return n.integrity&&(s.integrity=n.integrity),n.referrerPolicy&&(s.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?s.credentials="include":n.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(n){if(n.ep)return;n.ep=!0;const s=e(n);fetch(n.href,s)}})();/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const pa="170",Iu=0,Wl=1,Uu=2,_h=1,Th=2,qi=3,vn=0,$e=1,Ve=2,Qi=0,Un=1,$s=2,Xl=3,ql=4,Nu=5,Ln=100,Fu=101,ku=102,Ou=103,Bu=104,Hu=200,Gu=201,Vu=202,Wu=203,Mo=204,So=205,Xu=206,qu=207,Yu=208,Zu=209,Ku=210,ju=211,Qu=212,Ju=213,$u=214,wo=0,bo=1,_o=2,xs=3,To=4,Eo=5,Ao=6,Co=7,Eh=0,tf=1,ef=2,mn=0,Ah=1,Ch=2,Rh=3,dl=4,nf=5,Ph=6,Dh=7,Lh=300,vs=301,ys=302,Ro=303,Po=304,ma=306,Ms=1e3,dn=1001,Do=1002,Te=1003,sf=1004,pr=1005,Le=1006,_a=1007,pn=1008,$i=1009,zh=1010,Ih=1011,tr=1012,pl=1013,Di=1014,_i=1015,Je=1016,ml=1017,gl=1018,Fn=1020,Uh=35902,Nh=1021,Fh=1022,Ue=1023,kh=1024,Oh=1025,gn=1026,kn=1027,ga=1028,xl=1029,Bh=1030,vl=1031,yl=1033,ta=33776,ea=33777,ia=33778,na=33779,Lo=35840,zo=35841,Io=35842,Uo=35843,No=36196,Fo=37492,ko=37496,Oo=37808,Bo=37809,Ho=37810,Go=37811,Vo=37812,Wo=37813,Xo=37814,qo=37815,Yo=37816,Zo=37817,Ko=37818,jo=37819,Qo=37820,Jo=37821,sa=36492,$o=36494,tl=36495,Hh=36283,el=36284,il=36285,nl=36286,rf=3200,af=3201,Gh=0,of=1,Zi="",ii="srgb",_s="srgb-linear",xa="linear",xe="srgb",Xn=7680,Yl=519,lf=512,cf=513,hf=514,Vh=515,uf=516,ff=517,df=518,pf=519,Zl=35044,Kl="300 es",Ki=2e3,oa=2001;class Ts{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const i=this._listeners;return i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const n=this._listeners[t];if(n!==void 0){const s=n.indexOf(e);s!==-1&&n.splice(s,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const i=this._listeners[t.type];if(i!==void 0){t.target=this;const n=i.slice(0);for(let s=0,a=n.length;s<a;s++)n[s].call(this,t);t.target=null}}}const Xe=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Ta=Math.PI/180,la=180/Math.PI;function Es(){const r=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Xe[r&255]+Xe[r>>8&255]+Xe[r>>16&255]+Xe[r>>24&255]+"-"+Xe[t&255]+Xe[t>>8&255]+"-"+Xe[t>>16&15|64]+Xe[t>>24&255]+"-"+Xe[e&63|128]+Xe[e>>8&255]+"-"+Xe[e>>16&255]+Xe[e>>24&255]+Xe[i&255]+Xe[i>>8&255]+Xe[i>>16&255]+Xe[i>>24&255]).toLowerCase()}function Ge(r,t,e){return Math.max(t,Math.min(e,r))}function mf(r,t){return(r%t+t)%t}function Ea(r,t,e){return(1-e)*r+e*t}function Ds(r,t){switch(t.constructor){case Float32Array:return r;case Uint32Array:return r/4294967295;case Uint16Array:return r/65535;case Uint8Array:return r/255;case Int32Array:return Math.max(r/2147483647,-1);case Int16Array:return Math.max(r/32767,-1);case Int8Array:return Math.max(r/127,-1);default:throw new Error("Invalid component type.")}}function ei(r,t){switch(t.constructor){case Float32Array:return r;case Uint32Array:return Math.round(r*4294967295);case Uint16Array:return Math.round(r*65535);case Uint8Array:return Math.round(r*255);case Int32Array:return Math.round(r*2147483647);case Int16Array:return Math.round(r*32767);case Int8Array:return Math.round(r*127);default:throw new Error("Invalid component type.")}}class it{constructor(t=0,e=0){it.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,n=t.elements;return this.x=n[0]*e+n[3]*i+n[6],this.y=n[1]*e+n[4]*i+n[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(Ge(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),n=Math.sin(e),s=this.x-t.x,a=this.y-t.y;return this.x=s*i-a*n+t.x,this.y=s*n+a*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Kt{constructor(t,e,i,n,s,a,o,l,c){Kt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,n,s,a,o,l,c)}set(t,e,i,n,s,a,o,l,c){const h=this.elements;return h[0]=t,h[1]=n,h[2]=o,h[3]=e,h[4]=s,h[5]=l,h[6]=i,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,n=e.elements,s=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],h=i[4],u=i[7],f=i[2],d=i[5],g=i[8],x=n[0],p=n[3],m=n[6],y=n[1],M=n[4],v=n[7],b=n[2],_=n[5],T=n[8];return s[0]=a*x+o*y+l*b,s[3]=a*p+o*M+l*_,s[6]=a*m+o*v+l*T,s[1]=c*x+h*y+u*b,s[4]=c*p+h*M+u*_,s[7]=c*m+h*v+u*T,s[2]=f*x+d*y+g*b,s[5]=f*p+d*M+g*_,s[8]=f*m+d*v+g*T,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],n=t[2],s=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8];return e*a*h-e*o*c-i*s*h+i*o*l+n*s*c-n*a*l}invert(){const t=this.elements,e=t[0],i=t[1],n=t[2],s=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],u=h*a-o*c,f=o*l-h*s,d=c*s-a*l,g=e*u+i*f+n*d;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/g;return t[0]=u*x,t[1]=(n*c-h*i)*x,t[2]=(o*i-n*a)*x,t[3]=f*x,t[4]=(h*e-n*l)*x,t[5]=(n*s-o*e)*x,t[6]=d*x,t[7]=(i*l-c*e)*x,t[8]=(a*e-i*s)*x,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,n,s,a,o){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*a+c*o)+a+t,-n*c,n*l,-n*(-c*a+l*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(Aa.makeScale(t,e)),this}rotate(t){return this.premultiply(Aa.makeRotation(-t)),this}translate(t,e){return this.premultiply(Aa.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let n=0;n<9;n++)if(e[n]!==i[n])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Aa=new Kt;function Wh(r){for(let t=r.length-1;t>=0;--t)if(r[t]>=65535)return!0;return!1}function ca(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function gf(){const r=ca("canvas");return r.style.display="block",r}const jl={};function Xs(r){r in jl||(jl[r]=!0,console.warn(r))}function xf(r,t,e){return new Promise(function(i,n){function s(){switch(r.clientWaitSync(t,r.SYNC_FLUSH_COMMANDS_BIT,0)){case r.WAIT_FAILED:n();break;case r.TIMEOUT_EXPIRED:setTimeout(s,e);break;default:i()}}setTimeout(s,e)})}function vf(r){const t=r.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function yf(r){const t=r.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const re={enabled:!0,workingColorSpace:_s,spaces:{},convert:function(r,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===xe&&(r.r=Ji(r.r),r.g=Ji(r.g),r.b=Ji(r.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(r.applyMatrix3(this.spaces[t].toXYZ),r.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===xe&&(r.r=ps(r.r),r.g=ps(r.g),r.b=ps(r.b))),r},fromWorkingColorSpace:function(r,t){return this.convert(r,this.workingColorSpace,t)},toWorkingColorSpace:function(r,t){return this.convert(r,t,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===Zi?xa:this.spaces[r].transfer},getLuminanceCoefficients:function(r,t=this.workingColorSpace){return r.fromArray(this.spaces[t].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,t,e){return r.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace}};function Ji(r){return r<.04045?r*.0773993808:Math.pow(r*.9478672986+.0521327014,2.4)}function ps(r){return r<.0031308?r*12.92:1.055*Math.pow(r,.41666)-.055}const Ql=[.64,.33,.3,.6,.15,.06],Jl=[.2126,.7152,.0722],$l=[.3127,.329],tc=new Kt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),ec=new Kt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);re.define({[_s]:{primaries:Ql,whitePoint:$l,transfer:xa,toXYZ:tc,fromXYZ:ec,luminanceCoefficients:Jl,workingColorSpaceConfig:{unpackColorSpace:ii},outputColorSpaceConfig:{drawingBufferColorSpace:ii}},[ii]:{primaries:Ql,whitePoint:$l,transfer:xe,toXYZ:tc,fromXYZ:ec,luminanceCoefficients:Jl,outputColorSpaceConfig:{drawingBufferColorSpace:ii}}});let qn;class Mf{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{qn===void 0&&(qn=ca("canvas")),qn.width=t.width,qn.height=t.height;const i=qn.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),e=qn}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=ca("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const n=i.getImageData(0,0,t.width,t.height),s=n.data;for(let a=0;a<s.length;a++)s[a]=Ji(s[a]/255)*255;return i.putImageData(n,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(Ji(e[i]/255)*255):e[i]=Ji(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Sf=0;class Xh{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Sf++}),this.uuid=Es(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},n=this.data;if(n!==null){let s;if(Array.isArray(n)){s=[];for(let a=0,o=n.length;a<o;a++)n[a].isDataTexture?s.push(Ca(n[a].image)):s.push(Ca(n[a]))}else s=Ca(n);i.url=s}return e||(t.images[this.uuid]=i),i}}function Ca(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?Mf.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let wf=0;class Ze extends Ts{constructor(t=Ze.DEFAULT_IMAGE,e=Ze.DEFAULT_MAPPING,i=dn,n=dn,s=Le,a=pn,o=Ue,l=$i,c=Ze.DEFAULT_ANISOTROPY,h=Zi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:wf++}),this.uuid=Es(),this.name="",this.source=new Xh(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=n,this.magFilter=s,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new it(0,0),this.repeat=new it(1,1),this.center=new it(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Kt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Lh)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Ms:t.x=t.x-Math.floor(t.x);break;case dn:t.x=t.x<0?0:1;break;case Do:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Ms:t.y=t.y-Math.floor(t.y);break;case dn:t.y=t.y<0?0:1;break;case Do:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Ze.DEFAULT_IMAGE=null;Ze.DEFAULT_MAPPING=Lh;Ze.DEFAULT_ANISOTROPY=1;class ye{constructor(t=0,e=0,i=0,n=1){ye.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=n}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,n){return this.x=t,this.y=e,this.z=i,this.w=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,n=this.z,s=this.w,a=t.elements;return this.x=a[0]*e+a[4]*i+a[8]*n+a[12]*s,this.y=a[1]*e+a[5]*i+a[9]*n+a[13]*s,this.z=a[2]*e+a[6]*i+a[10]*n+a[14]*s,this.w=a[3]*e+a[7]*i+a[11]*n+a[15]*s,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,n,s;const l=t.elements,c=l[0],h=l[4],u=l[8],f=l[1],d=l[5],g=l[9],x=l[2],p=l[6],m=l[10];if(Math.abs(h-f)<.01&&Math.abs(u-x)<.01&&Math.abs(g-p)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+x)<.1&&Math.abs(g+p)<.1&&Math.abs(c+d+m-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const M=(c+1)/2,v=(d+1)/2,b=(m+1)/2,_=(h+f)/4,T=(u+x)/4,C=(g+p)/4;return M>v&&M>b?M<.01?(i=0,n=.707106781,s=.707106781):(i=Math.sqrt(M),n=_/i,s=T/i):v>b?v<.01?(i=.707106781,n=0,s=.707106781):(n=Math.sqrt(v),i=_/n,s=C/n):b<.01?(i=.707106781,n=.707106781,s=0):(s=Math.sqrt(b),i=T/s,n=C/s),this.set(i,n,s,e),this}let y=Math.sqrt((p-g)*(p-g)+(u-x)*(u-x)+(f-h)*(f-h));return Math.abs(y)<.001&&(y=1),this.x=(p-g)/y,this.y=(u-x)/y,this.z=(f-h)/y,this.w=Math.acos((c+d+m-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class bf extends Ts{constructor(t=1,e=1,i={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new ye(0,0,t,e),this.scissorTest=!1,this.viewport=new ye(0,0,t,e);const n={width:t,height:e,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Le,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const s=new Ze(n,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);s.flipY=!1,s.generateMipmaps=i.generateMipmaps,s.internalFormat=i.internalFormat,this.textures=[];const a=i.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let n=0,s=this.textures.length;n<s;n++)this.textures[n].image.width=t,this.textures[n].image.height=e,this.textures[n].image.depth=i;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let i=0,n=t.textures.length;i<n;i++)this.textures[i]=t.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Xh(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ze extends bf{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class qh extends Ze{constructor(t=null,e=1,i=1,n=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:n},this.magFilter=Te,this.minFilter=Te,this.wrapR=dn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class _f extends Ze{constructor(t=null,e=1,i=1,n=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:n},this.magFilter=Te,this.minFilter=Te,this.wrapR=dn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ar{constructor(t=0,e=0,i=0,n=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=n}static slerpFlat(t,e,i,n,s,a,o){let l=i[n+0],c=i[n+1],h=i[n+2],u=i[n+3];const f=s[a+0],d=s[a+1],g=s[a+2],x=s[a+3];if(o===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u;return}if(o===1){t[e+0]=f,t[e+1]=d,t[e+2]=g,t[e+3]=x;return}if(u!==x||l!==f||c!==d||h!==g){let p=1-o;const m=l*f+c*d+h*g+u*x,y=m>=0?1:-1,M=1-m*m;if(M>Number.EPSILON){const b=Math.sqrt(M),_=Math.atan2(b,m*y);p=Math.sin(p*_)/b,o=Math.sin(o*_)/b}const v=o*y;if(l=l*p+f*v,c=c*p+d*v,h=h*p+g*v,u=u*p+x*v,p===1-o){const b=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=b,c*=b,h*=b,u*=b}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,i,n,s,a){const o=i[n],l=i[n+1],c=i[n+2],h=i[n+3],u=s[a],f=s[a+1],d=s[a+2],g=s[a+3];return t[e]=o*g+h*u+l*d-c*f,t[e+1]=l*g+h*f+c*u-o*d,t[e+2]=c*g+h*d+o*f-l*u,t[e+3]=h*g-o*u-l*f-c*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,n){return this._x=t,this._y=e,this._z=i,this._w=n,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,n=t._y,s=t._z,a=t._order,o=Math.cos,l=Math.sin,c=o(i/2),h=o(n/2),u=o(s/2),f=l(i/2),d=l(n/2),g=l(s/2);switch(a){case"XYZ":this._x=f*h*u+c*d*g,this._y=c*d*u-f*h*g,this._z=c*h*g+f*d*u,this._w=c*h*u-f*d*g;break;case"YXZ":this._x=f*h*u+c*d*g,this._y=c*d*u-f*h*g,this._z=c*h*g-f*d*u,this._w=c*h*u+f*d*g;break;case"ZXY":this._x=f*h*u-c*d*g,this._y=c*d*u+f*h*g,this._z=c*h*g+f*d*u,this._w=c*h*u-f*d*g;break;case"ZYX":this._x=f*h*u-c*d*g,this._y=c*d*u+f*h*g,this._z=c*h*g-f*d*u,this._w=c*h*u+f*d*g;break;case"YZX":this._x=f*h*u+c*d*g,this._y=c*d*u+f*h*g,this._z=c*h*g-f*d*u,this._w=c*h*u-f*d*g;break;case"XZY":this._x=f*h*u-c*d*g,this._y=c*d*u-f*h*g,this._z=c*h*g+f*d*u,this._w=c*h*u+f*d*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,n=Math.sin(i);return this._x=t.x*n,this._y=t.y*n,this._z=t.z*n,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],n=e[4],s=e[8],a=e[1],o=e[5],l=e[9],c=e[2],h=e[6],u=e[10],f=i+o+u;if(f>0){const d=.5/Math.sqrt(f+1);this._w=.25/d,this._x=(h-l)*d,this._y=(s-c)*d,this._z=(a-n)*d}else if(i>o&&i>u){const d=2*Math.sqrt(1+i-o-u);this._w=(h-l)/d,this._x=.25*d,this._y=(n+a)/d,this._z=(s+c)/d}else if(o>u){const d=2*Math.sqrt(1+o-i-u);this._w=(s-c)/d,this._x=(n+a)/d,this._y=.25*d,this._z=(l+h)/d}else{const d=2*Math.sqrt(1+u-i-o);this._w=(a-n)/d,this._x=(s+c)/d,this._y=(l+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<Number.EPSILON?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Ge(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const n=Math.min(1,e/i);return this.slerp(t,n),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,n=t._y,s=t._z,a=t._w,o=e._x,l=e._y,c=e._z,h=e._w;return this._x=i*h+a*o+n*c-s*l,this._y=n*h+a*l+s*o-i*c,this._z=s*h+a*c+i*l-n*o,this._w=a*h-i*o-n*l-s*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const i=this._x,n=this._y,s=this._z,a=this._w;let o=a*t._w+i*t._x+n*t._y+s*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=i,this._y=n,this._z=s,this;const l=1-o*o;if(l<=Number.EPSILON){const d=1-e;return this._w=d*a+e*this._w,this._x=d*i+e*this._x,this._y=d*n+e*this._y,this._z=d*s+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,o),u=Math.sin((1-e)*h)/c,f=Math.sin(e*h)/c;return this._w=a*u+this._w*f,this._x=i*u+this._x*f,this._y=n*u+this._y*f,this._z=s*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),n=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(n*Math.sin(t),n*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class D{constructor(t=0,e=0,i=0){D.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(ic.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(ic.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,n=this.z,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6]*n,this.y=s[1]*e+s[4]*i+s[7]*n,this.z=s[2]*e+s[5]*i+s[8]*n,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,n=this.z,s=t.elements,a=1/(s[3]*e+s[7]*i+s[11]*n+s[15]);return this.x=(s[0]*e+s[4]*i+s[8]*n+s[12])*a,this.y=(s[1]*e+s[5]*i+s[9]*n+s[13])*a,this.z=(s[2]*e+s[6]*i+s[10]*n+s[14])*a,this}applyQuaternion(t){const e=this.x,i=this.y,n=this.z,s=t.x,a=t.y,o=t.z,l=t.w,c=2*(a*n-o*i),h=2*(o*e-s*n),u=2*(s*i-a*e);return this.x=e+l*c+a*u-o*h,this.y=i+l*h+o*c-s*u,this.z=n+l*u+s*h-a*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,n=this.z,s=t.elements;return this.x=s[0]*e+s[4]*i+s[8]*n,this.y=s[1]*e+s[5]*i+s[9]*n,this.z=s[2]*e+s[6]*i+s[10]*n,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,n=t.y,s=t.z,a=e.x,o=e.y,l=e.z;return this.x=n*l-s*o,this.y=s*a-i*l,this.z=i*o-n*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return Ra.copy(this).projectOnVector(t),this.sub(Ra)}reflect(t){return this.sub(Ra.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(Ge(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,n=this.z-t.z;return e*e+i*i+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const n=Math.sin(e)*t;return this.x=n*Math.sin(i),this.y=Math.cos(e)*t,this.z=n*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),n=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=n,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Ra=new D,ic=new ar;class yn{constructor(t=new D(1/0,1/0,1/0),e=new D(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(gi.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(gi.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=gi.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const s=i.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,gi):gi.fromBufferAttribute(s,a),gi.applyMatrix4(t.matrixWorld),this.expandByPoint(gi);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),mr.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),mr.copy(i.boundingBox)),mr.applyMatrix4(t.matrixWorld),this.union(mr)}const n=t.children;for(let s=0,a=n.length;s<a;s++)this.expandByObject(n[s],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,gi),gi.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Ls),gr.subVectors(this.max,Ls),Yn.subVectors(t.a,Ls),Zn.subVectors(t.b,Ls),Kn.subVectors(t.c,Ls),sn.subVectors(Zn,Yn),rn.subVectors(Kn,Zn),wn.subVectors(Yn,Kn);let e=[0,-sn.z,sn.y,0,-rn.z,rn.y,0,-wn.z,wn.y,sn.z,0,-sn.x,rn.z,0,-rn.x,wn.z,0,-wn.x,-sn.y,sn.x,0,-rn.y,rn.x,0,-wn.y,wn.x,0];return!Pa(e,Yn,Zn,Kn,gr)||(e=[1,0,0,0,1,0,0,0,1],!Pa(e,Yn,Zn,Kn,gr))?!1:(xr.crossVectors(sn,rn),e=[xr.x,xr.y,xr.z],Pa(e,Yn,Zn,Kn,gr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,gi).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(gi).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Oi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Oi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Oi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Oi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Oi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Oi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Oi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Oi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Oi),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Oi=[new D,new D,new D,new D,new D,new D,new D,new D],gi=new D,mr=new yn,Yn=new D,Zn=new D,Kn=new D,sn=new D,rn=new D,wn=new D,Ls=new D,gr=new D,xr=new D,bn=new D;function Pa(r,t,e,i,n){for(let s=0,a=r.length-3;s<=a;s+=3){bn.fromArray(r,s);const o=n.x*Math.abs(bn.x)+n.y*Math.abs(bn.y)+n.z*Math.abs(bn.z),l=t.dot(bn),c=e.dot(bn),h=i.dot(bn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const Tf=new yn,zs=new D,Da=new D;class tn{constructor(t=new D,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):Tf.setFromPoints(t).getCenter(i);let n=0;for(let s=0,a=t.length;s<a;s++)n=Math.max(n,i.distanceToSquared(t[s]));return this.radius=Math.sqrt(n),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;zs.subVectors(t,this.center);const e=zs.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),n=(i-this.radius)*.5;this.center.addScaledVector(zs,n/i),this.radius+=n}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Da.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(zs.copy(t.center).add(Da)),this.expandByPoint(zs.copy(t.center).sub(Da))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Bi=new D,La=new D,vr=new D,an=new D,za=new D,yr=new D,Ia=new D;class or{constructor(t=new D,e=new D(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Bi)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Bi.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Bi.copy(this.origin).addScaledVector(this.direction,e),Bi.distanceToSquared(t))}distanceSqToSegment(t,e,i,n){La.copy(t).add(e).multiplyScalar(.5),vr.copy(e).sub(t).normalize(),an.copy(this.origin).sub(La);const s=t.distanceTo(e)*.5,a=-this.direction.dot(vr),o=an.dot(this.direction),l=-an.dot(vr),c=an.lengthSq(),h=Math.abs(1-a*a);let u,f,d,g;if(h>0)if(u=a*l-o,f=a*o-l,g=s*h,u>=0)if(f>=-g)if(f<=g){const x=1/h;u*=x,f*=x,d=u*(u+a*f+2*o)+f*(a*u+f+2*l)+c}else f=s,u=Math.max(0,-(a*f+o)),d=-u*u+f*(f+2*l)+c;else f=-s,u=Math.max(0,-(a*f+o)),d=-u*u+f*(f+2*l)+c;else f<=-g?(u=Math.max(0,-(-a*s+o)),f=u>0?-s:Math.min(Math.max(-s,-l),s),d=-u*u+f*(f+2*l)+c):f<=g?(u=0,f=Math.min(Math.max(-s,-l),s),d=f*(f+2*l)+c):(u=Math.max(0,-(a*s+o)),f=u>0?s:Math.min(Math.max(-s,-l),s),d=-u*u+f*(f+2*l)+c);else f=a>0?-s:s,u=Math.max(0,-(a*f+o)),d=-u*u+f*(f+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,u),n&&n.copy(La).addScaledVector(vr,f),d}intersectSphere(t,e){Bi.subVectors(t.center,this.origin);const i=Bi.dot(this.direction),n=Bi.dot(Bi)-i*i,s=t.radius*t.radius;if(n>s)return null;const a=Math.sqrt(s-n),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,n,s,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return c>=0?(i=(t.min.x-f.x)*c,n=(t.max.x-f.x)*c):(i=(t.max.x-f.x)*c,n=(t.min.x-f.x)*c),h>=0?(s=(t.min.y-f.y)*h,a=(t.max.y-f.y)*h):(s=(t.max.y-f.y)*h,a=(t.min.y-f.y)*h),i>a||s>n||((s>i||isNaN(i))&&(i=s),(a<n||isNaN(n))&&(n=a),u>=0?(o=(t.min.z-f.z)*u,l=(t.max.z-f.z)*u):(o=(t.max.z-f.z)*u,l=(t.min.z-f.z)*u),i>l||o>n)||((o>i||i!==i)&&(i=o),(l<n||n!==n)&&(n=l),n<0)?null:this.at(i>=0?i:n,e)}intersectsBox(t){return this.intersectBox(t,Bi)!==null}intersectTriangle(t,e,i,n,s){za.subVectors(e,t),yr.subVectors(i,t),Ia.crossVectors(za,yr);let a=this.direction.dot(Ia),o;if(a>0){if(n)return null;o=1}else if(a<0)o=-1,a=-a;else return null;an.subVectors(this.origin,t);const l=o*this.direction.dot(yr.crossVectors(an,yr));if(l<0)return null;const c=o*this.direction.dot(za.cross(an));if(c<0||l+c>a)return null;const h=-o*an.dot(Ia);return h<0?null:this.at(h/a,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Vt{constructor(t,e,i,n,s,a,o,l,c,h,u,f,d,g,x,p){Vt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,n,s,a,o,l,c,h,u,f,d,g,x,p)}set(t,e,i,n,s,a,o,l,c,h,u,f,d,g,x,p){const m=this.elements;return m[0]=t,m[4]=e,m[8]=i,m[12]=n,m[1]=s,m[5]=a,m[9]=o,m[13]=l,m[2]=c,m[6]=h,m[10]=u,m[14]=f,m[3]=d,m[7]=g,m[11]=x,m[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Vt().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,i=t.elements,n=1/jn.setFromMatrixColumn(t,0).length(),s=1/jn.setFromMatrixColumn(t,1).length(),a=1/jn.setFromMatrixColumn(t,2).length();return e[0]=i[0]*n,e[1]=i[1]*n,e[2]=i[2]*n,e[3]=0,e[4]=i[4]*s,e[5]=i[5]*s,e[6]=i[6]*s,e[7]=0,e[8]=i[8]*a,e[9]=i[9]*a,e[10]=i[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,n=t.y,s=t.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(n),c=Math.sin(n),h=Math.cos(s),u=Math.sin(s);if(t.order==="XYZ"){const f=a*h,d=a*u,g=o*h,x=o*u;e[0]=l*h,e[4]=-l*u,e[8]=c,e[1]=d+g*c,e[5]=f-x*c,e[9]=-o*l,e[2]=x-f*c,e[6]=g+d*c,e[10]=a*l}else if(t.order==="YXZ"){const f=l*h,d=l*u,g=c*h,x=c*u;e[0]=f+x*o,e[4]=g*o-d,e[8]=a*c,e[1]=a*u,e[5]=a*h,e[9]=-o,e[2]=d*o-g,e[6]=x+f*o,e[10]=a*l}else if(t.order==="ZXY"){const f=l*h,d=l*u,g=c*h,x=c*u;e[0]=f-x*o,e[4]=-a*u,e[8]=g+d*o,e[1]=d+g*o,e[5]=a*h,e[9]=x-f*o,e[2]=-a*c,e[6]=o,e[10]=a*l}else if(t.order==="ZYX"){const f=a*h,d=a*u,g=o*h,x=o*u;e[0]=l*h,e[4]=g*c-d,e[8]=f*c+x,e[1]=l*u,e[5]=x*c+f,e[9]=d*c-g,e[2]=-c,e[6]=o*l,e[10]=a*l}else if(t.order==="YZX"){const f=a*l,d=a*c,g=o*l,x=o*c;e[0]=l*h,e[4]=x-f*u,e[8]=g*u+d,e[1]=u,e[5]=a*h,e[9]=-o*h,e[2]=-c*h,e[6]=d*u+g,e[10]=f-x*u}else if(t.order==="XZY"){const f=a*l,d=a*c,g=o*l,x=o*c;e[0]=l*h,e[4]=-u,e[8]=c*h,e[1]=f*u+x,e[5]=a*h,e[9]=d*u-g,e[2]=g*u-d,e[6]=o*h,e[10]=x*u+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Ef,t,Af)}lookAt(t,e,i){const n=this.elements;return ri.subVectors(t,e),ri.lengthSq()===0&&(ri.z=1),ri.normalize(),on.crossVectors(i,ri),on.lengthSq()===0&&(Math.abs(i.z)===1?ri.x+=1e-4:ri.z+=1e-4,ri.normalize(),on.crossVectors(i,ri)),on.normalize(),Mr.crossVectors(ri,on),n[0]=on.x,n[4]=Mr.x,n[8]=ri.x,n[1]=on.y,n[5]=Mr.y,n[9]=ri.y,n[2]=on.z,n[6]=Mr.z,n[10]=ri.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,n=e.elements,s=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],h=i[1],u=i[5],f=i[9],d=i[13],g=i[2],x=i[6],p=i[10],m=i[14],y=i[3],M=i[7],v=i[11],b=i[15],_=n[0],T=n[4],C=n[8],w=n[12],S=n[1],P=n[5],z=n[9],I=n[13],U=n[2],X=n[6],q=n[10],$=n[14],B=n[3],ft=n[7],dt=n[11],xt=n[15];return s[0]=a*_+o*S+l*U+c*B,s[4]=a*T+o*P+l*X+c*ft,s[8]=a*C+o*z+l*q+c*dt,s[12]=a*w+o*I+l*$+c*xt,s[1]=h*_+u*S+f*U+d*B,s[5]=h*T+u*P+f*X+d*ft,s[9]=h*C+u*z+f*q+d*dt,s[13]=h*w+u*I+f*$+d*xt,s[2]=g*_+x*S+p*U+m*B,s[6]=g*T+x*P+p*X+m*ft,s[10]=g*C+x*z+p*q+m*dt,s[14]=g*w+x*I+p*$+m*xt,s[3]=y*_+M*S+v*U+b*B,s[7]=y*T+M*P+v*X+b*ft,s[11]=y*C+M*z+v*q+b*dt,s[15]=y*w+M*I+v*$+b*xt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],n=t[8],s=t[12],a=t[1],o=t[5],l=t[9],c=t[13],h=t[2],u=t[6],f=t[10],d=t[14],g=t[3],x=t[7],p=t[11],m=t[15];return g*(+s*l*u-n*c*u-s*o*f+i*c*f+n*o*d-i*l*d)+x*(+e*l*d-e*c*f+s*a*f-n*a*d+n*c*h-s*l*h)+p*(+e*c*u-e*o*d-s*a*u+i*a*d+s*o*h-i*c*h)+m*(-n*o*h-e*l*u+e*o*f+n*a*u-i*a*f+i*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const n=this.elements;return t.isVector3?(n[12]=t.x,n[13]=t.y,n[14]=t.z):(n[12]=t,n[13]=e,n[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],n=t[2],s=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],u=t[9],f=t[10],d=t[11],g=t[12],x=t[13],p=t[14],m=t[15],y=u*p*c-x*f*c+x*l*d-o*p*d-u*l*m+o*f*m,M=g*f*c-h*p*c-g*l*d+a*p*d+h*l*m-a*f*m,v=h*x*c-g*u*c+g*o*d-a*x*d-h*o*m+a*u*m,b=g*u*l-h*x*l-g*o*f+a*x*f+h*o*p-a*u*p,_=e*y+i*M+n*v+s*b;if(_===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const T=1/_;return t[0]=y*T,t[1]=(x*f*s-u*p*s-x*n*d+i*p*d+u*n*m-i*f*m)*T,t[2]=(o*p*s-x*l*s+x*n*c-i*p*c-o*n*m+i*l*m)*T,t[3]=(u*l*s-o*f*s-u*n*c+i*f*c+o*n*d-i*l*d)*T,t[4]=M*T,t[5]=(h*p*s-g*f*s+g*n*d-e*p*d-h*n*m+e*f*m)*T,t[6]=(g*l*s-a*p*s-g*n*c+e*p*c+a*n*m-e*l*m)*T,t[7]=(a*f*s-h*l*s+h*n*c-e*f*c-a*n*d+e*l*d)*T,t[8]=v*T,t[9]=(g*u*s-h*x*s-g*i*d+e*x*d+h*i*m-e*u*m)*T,t[10]=(a*x*s-g*o*s+g*i*c-e*x*c-a*i*m+e*o*m)*T,t[11]=(h*o*s-a*u*s-h*i*c+e*u*c+a*i*d-e*o*d)*T,t[12]=b*T,t[13]=(h*x*n-g*u*n+g*i*f-e*x*f-h*i*p+e*u*p)*T,t[14]=(g*o*n-a*x*n-g*i*l+e*x*l+a*i*p-e*o*p)*T,t[15]=(a*u*n-h*o*n+h*i*l-e*u*l-a*i*f+e*o*f)*T,this}scale(t){const e=this.elements,i=t.x,n=t.y,s=t.z;return e[0]*=i,e[4]*=n,e[8]*=s,e[1]*=i,e[5]*=n,e[9]*=s,e[2]*=i,e[6]*=n,e[10]*=s,e[3]*=i,e[7]*=n,e[11]*=s,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],n=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,n))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),n=Math.sin(e),s=1-i,a=t.x,o=t.y,l=t.z,c=s*a,h=s*o;return this.set(c*a+i,c*o-n*l,c*l+n*o,0,c*o+n*l,h*o+i,h*l-n*a,0,c*l-n*o,h*l+n*a,s*l*l+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,n,s,a){return this.set(1,i,s,0,t,1,a,0,e,n,1,0,0,0,0,1),this}compose(t,e,i){const n=this.elements,s=e._x,a=e._y,o=e._z,l=e._w,c=s+s,h=a+a,u=o+o,f=s*c,d=s*h,g=s*u,x=a*h,p=a*u,m=o*u,y=l*c,M=l*h,v=l*u,b=i.x,_=i.y,T=i.z;return n[0]=(1-(x+m))*b,n[1]=(d+v)*b,n[2]=(g-M)*b,n[3]=0,n[4]=(d-v)*_,n[5]=(1-(f+m))*_,n[6]=(p+y)*_,n[7]=0,n[8]=(g+M)*T,n[9]=(p-y)*T,n[10]=(1-(f+x))*T,n[11]=0,n[12]=t.x,n[13]=t.y,n[14]=t.z,n[15]=1,this}decompose(t,e,i){const n=this.elements;let s=jn.set(n[0],n[1],n[2]).length();const a=jn.set(n[4],n[5],n[6]).length(),o=jn.set(n[8],n[9],n[10]).length();this.determinant()<0&&(s=-s),t.x=n[12],t.y=n[13],t.z=n[14],xi.copy(this);const c=1/s,h=1/a,u=1/o;return xi.elements[0]*=c,xi.elements[1]*=c,xi.elements[2]*=c,xi.elements[4]*=h,xi.elements[5]*=h,xi.elements[6]*=h,xi.elements[8]*=u,xi.elements[9]*=u,xi.elements[10]*=u,e.setFromRotationMatrix(xi),i.x=s,i.y=a,i.z=o,this}makePerspective(t,e,i,n,s,a,o=Ki){const l=this.elements,c=2*s/(e-t),h=2*s/(i-n),u=(e+t)/(e-t),f=(i+n)/(i-n);let d,g;if(o===Ki)d=-(a+s)/(a-s),g=-2*a*s/(a-s);else if(o===oa)d=-a/(a-s),g=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=h,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=d,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,i,n,s,a,o=Ki){const l=this.elements,c=1/(e-t),h=1/(i-n),u=1/(a-s),f=(e+t)*c,d=(i+n)*h;let g,x;if(o===Ki)g=(a+s)*u,x=-2*u;else if(o===oa)g=s*u,x=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-f,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-d,l[2]=0,l[6]=0,l[10]=x,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let n=0;n<16;n++)if(e[n]!==i[n])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const jn=new D,xi=new Vt,Ef=new D(0,0,0),Af=new D(1,1,1),on=new D,Mr=new D,ri=new D,nc=new Vt,sc=new ar;class zi{constructor(t=0,e=0,i=0,n=zi.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=n}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,n=this._order){return this._x=t,this._y=e,this._z=i,this._order=n,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const n=t.elements,s=n[0],a=n[4],o=n[8],l=n[1],c=n[5],h=n[9],u=n[2],f=n[6],d=n[10];switch(e){case"XYZ":this._y=Math.asin(Ge(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ge(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin(Ge(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,d),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-Ge(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,d),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Ge(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(o,d));break;case"XZY":this._z=Math.asin(-Ge(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-h,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return nc.makeRotationFromQuaternion(t),this.setFromRotationMatrix(nc,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return sc.setFromEuler(this),this.setFromQuaternion(sc,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}zi.DEFAULT_ORDER="XYZ";class Yh{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Cf=0;const rc=new D,Qn=new ar,Hi=new Vt,Sr=new D,Is=new D,Rf=new D,Pf=new ar,ac=new D(1,0,0),oc=new D(0,1,0),lc=new D(0,0,1),cc={type:"added"},Df={type:"removed"},Jn={type:"childadded",child:null},Ua={type:"childremoved",child:null};class me extends Ts{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Cf++}),this.uuid=Es(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=me.DEFAULT_UP.clone();const t=new D,e=new zi,i=new ar,n=new D(1,1,1);function s(){i.setFromEuler(e,!1)}function a(){e.setFromQuaternion(i,void 0,!1)}e._onChange(s),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:n},modelViewMatrix:{value:new Vt},normalMatrix:{value:new Kt}}),this.matrix=new Vt,this.matrixWorld=new Vt,this.matrixAutoUpdate=me.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=me.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Yh,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Qn.setFromAxisAngle(t,e),this.quaternion.multiply(Qn),this}rotateOnWorldAxis(t,e){return Qn.setFromAxisAngle(t,e),this.quaternion.premultiply(Qn),this}rotateX(t){return this.rotateOnAxis(ac,t)}rotateY(t){return this.rotateOnAxis(oc,t)}rotateZ(t){return this.rotateOnAxis(lc,t)}translateOnAxis(t,e){return rc.copy(t).applyQuaternion(this.quaternion),this.position.add(rc.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(ac,t)}translateY(t){return this.translateOnAxis(oc,t)}translateZ(t){return this.translateOnAxis(lc,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Hi.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?Sr.copy(t):Sr.set(t,e,i);const n=this.parent;this.updateWorldMatrix(!0,!1),Is.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Hi.lookAt(Is,Sr,this.up):Hi.lookAt(Sr,Is,this.up),this.quaternion.setFromRotationMatrix(Hi),n&&(Hi.extractRotation(n.matrixWorld),Qn.setFromRotationMatrix(Hi),this.quaternion.premultiply(Qn.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(cc),Jn.child=t,this.dispatchEvent(Jn),Jn.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Df),Ua.child=t,this.dispatchEvent(Ua),Ua.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Hi.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Hi.multiply(t.parent.matrixWorld)),t.applyMatrix4(Hi),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(cc),Jn.child=t,this.dispatchEvent(Jn),Jn.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,n=this.children.length;i<n;i++){const a=this.children[i].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const n=this.children;for(let s=0,a=n.length;s<a;s++)n[s].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Is,t,Rf),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Is,Pf,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,n=e.length;i<n;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,n=e.length;i<n;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,n=e.length;i<n;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const n=this.children;for(let s=0,a=n.length;s<a;s++)n[s].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const n={};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.castShadow===!0&&(n.castShadow=!0),this.receiveShadow===!0&&(n.receiveShadow=!0),this.visible===!1&&(n.visible=!1),this.frustumCulled===!1&&(n.frustumCulled=!1),this.renderOrder!==0&&(n.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(n.userData=this.userData),n.layers=this.layers.mask,n.matrix=this.matrix.toArray(),n.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(n.matrixAutoUpdate=!1),this.isInstancedMesh&&(n.type="InstancedMesh",n.count=this.count,n.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(n.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(n.type="BatchedMesh",n.perObjectFrustumCulled=this.perObjectFrustumCulled,n.sortObjects=this.sortObjects,n.drawRanges=this._drawRanges,n.reservedRanges=this._reservedRanges,n.visibility=this._visibility,n.active=this._active,n.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),n.maxInstanceCount=this._maxInstanceCount,n.maxVertexCount=this._maxVertexCount,n.maxIndexCount=this._maxIndexCount,n.geometryInitialized=this._geometryInitialized,n.geometryCount=this._geometryCount,n.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(n.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(n.boundingSphere={center:n.boundingSphere.center.toArray(),radius:n.boundingSphere.radius}),this.boundingBox!==null&&(n.boundingBox={min:n.boundingBox.min.toArray(),max:n.boundingBox.max.toArray()}));function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?n.background=this.background.toJSON():this.background.isTexture&&(n.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(n.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){n.geometry=s(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];s(t.shapes,u)}else s(t.shapes,l)}}if(this.isSkinnedMesh&&(n.bindMode=this.bindMode,n.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),n.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(s(t.materials,this.material[l]));n.material=o}else n.material=s(t.materials,this.material);if(this.children.length>0){n.children=[];for(let o=0;o<this.children.length;o++)n.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){n.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];n.animations.push(s(t.animations,l))}}if(e){const o=a(t.geometries),l=a(t.materials),c=a(t.textures),h=a(t.images),u=a(t.shapes),f=a(t.skeletons),d=a(t.animations),g=a(t.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),u.length>0&&(i.shapes=u),f.length>0&&(i.skeletons=f),d.length>0&&(i.animations=d),g.length>0&&(i.nodes=g)}return i.object=n,i;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const n=t.children[i];this.add(n.clone())}return this}}me.DEFAULT_UP=new D(0,1,0);me.DEFAULT_MATRIX_AUTO_UPDATE=!0;me.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const vi=new D,Gi=new D,Na=new D,Vi=new D,$n=new D,ts=new D,hc=new D,Fa=new D,ka=new D,Oa=new D,Ba=new ye,Ha=new ye,Ga=new ye;class bi{constructor(t=new D,e=new D,i=new D){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,n){n.subVectors(i,e),vi.subVectors(t,e),n.cross(vi);const s=n.lengthSq();return s>0?n.multiplyScalar(1/Math.sqrt(s)):n.set(0,0,0)}static getBarycoord(t,e,i,n,s){vi.subVectors(n,e),Gi.subVectors(i,e),Na.subVectors(t,e);const a=vi.dot(vi),o=vi.dot(Gi),l=vi.dot(Na),c=Gi.dot(Gi),h=Gi.dot(Na),u=a*c-o*o;if(u===0)return s.set(0,0,0),null;const f=1/u,d=(c*l-o*h)*f,g=(a*h-o*l)*f;return s.set(1-d-g,g,d)}static containsPoint(t,e,i,n){return this.getBarycoord(t,e,i,n,Vi)===null?!1:Vi.x>=0&&Vi.y>=0&&Vi.x+Vi.y<=1}static getInterpolation(t,e,i,n,s,a,o,l){return this.getBarycoord(t,e,i,n,Vi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Vi.x),l.addScaledVector(a,Vi.y),l.addScaledVector(o,Vi.z),l)}static getInterpolatedAttribute(t,e,i,n,s,a){return Ba.setScalar(0),Ha.setScalar(0),Ga.setScalar(0),Ba.fromBufferAttribute(t,e),Ha.fromBufferAttribute(t,i),Ga.fromBufferAttribute(t,n),a.setScalar(0),a.addScaledVector(Ba,s.x),a.addScaledVector(Ha,s.y),a.addScaledVector(Ga,s.z),a}static isFrontFacing(t,e,i,n){return vi.subVectors(i,e),Gi.subVectors(t,e),vi.cross(Gi).dot(n)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,n){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[n]),this}setFromAttributeAndIndices(t,e,i,n){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,n),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return vi.subVectors(this.c,this.b),Gi.subVectors(this.a,this.b),vi.cross(Gi).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return bi.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return bi.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,n,s){return bi.getInterpolation(t,this.a,this.b,this.c,e,i,n,s)}containsPoint(t){return bi.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return bi.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,n=this.b,s=this.c;let a,o;$n.subVectors(n,i),ts.subVectors(s,i),Fa.subVectors(t,i);const l=$n.dot(Fa),c=ts.dot(Fa);if(l<=0&&c<=0)return e.copy(i);ka.subVectors(t,n);const h=$n.dot(ka),u=ts.dot(ka);if(h>=0&&u<=h)return e.copy(n);const f=l*u-h*c;if(f<=0&&l>=0&&h<=0)return a=l/(l-h),e.copy(i).addScaledVector($n,a);Oa.subVectors(t,s);const d=$n.dot(Oa),g=ts.dot(Oa);if(g>=0&&d<=g)return e.copy(s);const x=d*c-l*g;if(x<=0&&c>=0&&g<=0)return o=c/(c-g),e.copy(i).addScaledVector(ts,o);const p=h*g-d*u;if(p<=0&&u-h>=0&&d-g>=0)return hc.subVectors(s,n),o=(u-h)/(u-h+(d-g)),e.copy(n).addScaledVector(hc,o);const m=1/(p+x+f);return a=x*m,o=f*m,e.copy(i).addScaledVector($n,a).addScaledVector(ts,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Zh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ln={h:0,s:0,l:0},wr={h:0,s:0,l:0};function Va(r,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?r+(t-r)*6*e:e<1/2?t:e<2/3?r+(t-r)*6*(2/3-e):r}class j{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const n=t;n&&n.isColor?this.copy(n):typeof n=="number"?this.setHex(n):typeof n=="string"&&this.setStyle(n)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=ii){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,re.toWorkingColorSpace(this,e),this}setRGB(t,e,i,n=re.workingColorSpace){return this.r=t,this.g=e,this.b=i,re.toWorkingColorSpace(this,n),this}setHSL(t,e,i,n=re.workingColorSpace){if(t=mf(t,1),e=Ge(e,0,1),i=Ge(i,0,1),e===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+e):i+e-i*e,a=2*i-s;this.r=Va(a,s,t+1/3),this.g=Va(a,s,t),this.b=Va(a,s,t-1/3)}return re.toWorkingColorSpace(this,n),this}setStyle(t,e=ii){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let n;if(n=/^(\w+)\(([^\)]*)\)/.exec(t)){let s;const a=n[1],o=n[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(n=/^\#([A-Fa-f\d]+)$/.exec(t)){const s=n[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(s,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=ii){const i=Zh[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Ji(t.r),this.g=Ji(t.g),this.b=Ji(t.b),this}copyLinearToSRGB(t){return this.r=ps(t.r),this.g=ps(t.g),this.b=ps(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=ii){return re.fromWorkingColorSpace(qe.copy(this),t),Math.round(Ge(qe.r*255,0,255))*65536+Math.round(Ge(qe.g*255,0,255))*256+Math.round(Ge(qe.b*255,0,255))}getHexString(t=ii){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=re.workingColorSpace){re.fromWorkingColorSpace(qe.copy(this),e);const i=qe.r,n=qe.g,s=qe.b,a=Math.max(i,n,s),o=Math.min(i,n,s);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const u=a-o;switch(c=h<=.5?u/(a+o):u/(2-a-o),a){case i:l=(n-s)/u+(n<s?6:0);break;case n:l=(s-i)/u+2;break;case s:l=(i-n)/u+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=re.workingColorSpace){return re.fromWorkingColorSpace(qe.copy(this),e),t.r=qe.r,t.g=qe.g,t.b=qe.b,t}getStyle(t=ii){re.fromWorkingColorSpace(qe.copy(this),t);const e=qe.r,i=qe.g,n=qe.b;return t!==ii?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${n.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(n*255)})`}offsetHSL(t,e,i){return this.getHSL(ln),this.setHSL(ln.h+t,ln.s+e,ln.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(ln),t.getHSL(wr);const i=Ea(ln.h,wr.h,e),n=Ea(ln.s,wr.s,e),s=Ea(ln.l,wr.l,e);return this.setHSL(i,n,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,n=this.b,s=t.elements;return this.r=s[0]*e+s[3]*i+s[6]*n,this.g=s[1]*e+s[4]*i+s[7]*n,this.b=s[2]*e+s[5]*i+s[8]*n,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const qe=new j;j.NAMES=Zh;let Lf=0;class Hn extends Ts{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Lf++}),this.uuid=Es(),this.name="",this.blending=Un,this.side=vn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Mo,this.blendDst=So,this.blendEquation=Ln,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new j(0,0,0),this.blendAlpha=0,this.depthFunc=xs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Yl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Xn,this.stencilZFail=Xn,this.stencilZPass=Xn,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const n=this[e];if(n===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}n&&n.isColor?n.set(i):n&&n.isVector3&&i&&i.isVector3?n.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Un&&(i.blending=this.blending),this.side!==vn&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Mo&&(i.blendSrc=this.blendSrc),this.blendDst!==So&&(i.blendDst=this.blendDst),this.blendEquation!==Ln&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==xs&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Yl&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Xn&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Xn&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Xn&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function n(s){const a=[];for(const o in s){const l=s[o];delete l.metadata,a.push(l)}return a}if(e){const s=n(t.textures),a=n(t.images);s.length>0&&(i.textures=s),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const n=e.length;i=new Array(n);for(let s=0;s!==n;++s)i[s]=e[s].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class pe extends Hn{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new j(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new zi,this.combine=Eh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const De=new D,br=new it;class Pe{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=Zl,this.updateRanges=[],this.gpuType=_i,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let n=0,s=this.itemSize;n<s;n++)this.array[t+n]=e.array[i+n];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)br.fromBufferAttribute(this,e),br.applyMatrix3(t),this.setXY(e,br.x,br.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)De.fromBufferAttribute(this,e),De.applyMatrix3(t),this.setXYZ(e,De.x,De.y,De.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)De.fromBufferAttribute(this,e),De.applyMatrix4(t),this.setXYZ(e,De.x,De.y,De.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)De.fromBufferAttribute(this,e),De.applyNormalMatrix(t),this.setXYZ(e,De.x,De.y,De.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)De.fromBufferAttribute(this,e),De.transformDirection(t),this.setXYZ(e,De.x,De.y,De.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=Ds(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=ei(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Ds(e,this.array)),e}setX(t,e){return this.normalized&&(e=ei(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Ds(e,this.array)),e}setY(t,e){return this.normalized&&(e=ei(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Ds(e,this.array)),e}setZ(t,e){return this.normalized&&(e=ei(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Ds(e,this.array)),e}setW(t,e){return this.normalized&&(e=ei(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=ei(e,this.array),i=ei(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,n){return t*=this.itemSize,this.normalized&&(e=ei(e,this.array),i=ei(i,this.array),n=ei(n,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=n,this}setXYZW(t,e,i,n,s){return t*=this.itemSize,this.normalized&&(e=ei(e,this.array),i=ei(i,this.array),n=ei(n,this.array),s=ei(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=n,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Zl&&(t.usage=this.usage),t}}class Kh extends Pe{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class jh extends Pe{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class jt extends Pe{constructor(t,e,i){super(new Float32Array(t),e,i)}}let zf=0;const li=new Vt,Wa=new me,es=new D,ai=new yn,Us=new yn,Oe=new D;class we extends Ts{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:zf++}),this.uuid=Es(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Wh(t)?jh:Kh)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new Kt().getNormalMatrix(t);i.applyNormalMatrix(s),i.needsUpdate=!0}const n=this.attributes.tangent;return n!==void 0&&(n.transformDirection(t),n.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return li.makeRotationFromQuaternion(t),this.applyMatrix4(li),this}rotateX(t){return li.makeRotationX(t),this.applyMatrix4(li),this}rotateY(t){return li.makeRotationY(t),this.applyMatrix4(li),this}rotateZ(t){return li.makeRotationZ(t),this.applyMatrix4(li),this}translate(t,e,i){return li.makeTranslation(t,e,i),this.applyMatrix4(li),this}scale(t,e,i){return li.makeScale(t,e,i),this.applyMatrix4(li),this}lookAt(t){return Wa.lookAt(t),Wa.updateMatrix(),this.applyMatrix4(Wa.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(es).negate(),this.translate(es.x,es.y,es.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const i=[];for(let n=0,s=t.length;n<s;n++){const a=t[n];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new jt(i,3))}else{for(let i=0,n=e.count;i<n;i++){const s=t[i];e.setXYZ(i,s.x,s.y,s.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new yn);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new D(-1/0,-1/0,-1/0),new D(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,n=e.length;i<n;i++){const s=e[i];ai.setFromBufferAttribute(s),this.morphTargetsRelative?(Oe.addVectors(this.boundingBox.min,ai.min),this.boundingBox.expandByPoint(Oe),Oe.addVectors(this.boundingBox.max,ai.max),this.boundingBox.expandByPoint(Oe)):(this.boundingBox.expandByPoint(ai.min),this.boundingBox.expandByPoint(ai.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new tn);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new D,1/0);return}if(t){const i=this.boundingSphere.center;if(ai.setFromBufferAttribute(t),e)for(let s=0,a=e.length;s<a;s++){const o=e[s];Us.setFromBufferAttribute(o),this.morphTargetsRelative?(Oe.addVectors(ai.min,Us.min),ai.expandByPoint(Oe),Oe.addVectors(ai.max,Us.max),ai.expandByPoint(Oe)):(ai.expandByPoint(Us.min),ai.expandByPoint(Us.max))}ai.getCenter(i);let n=0;for(let s=0,a=t.count;s<a;s++)Oe.fromBufferAttribute(t,s),n=Math.max(n,i.distanceToSquared(Oe));if(e)for(let s=0,a=e.length;s<a;s++){const o=e[s],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Oe.fromBufferAttribute(o,c),l&&(es.fromBufferAttribute(t,c),Oe.add(es)),n=Math.max(n,i.distanceToSquared(Oe))}this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,n=e.normal,s=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Pe(new Float32Array(4*i.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let C=0;C<i.count;C++)o[C]=new D,l[C]=new D;const c=new D,h=new D,u=new D,f=new it,d=new it,g=new it,x=new D,p=new D;function m(C,w,S){c.fromBufferAttribute(i,C),h.fromBufferAttribute(i,w),u.fromBufferAttribute(i,S),f.fromBufferAttribute(s,C),d.fromBufferAttribute(s,w),g.fromBufferAttribute(s,S),h.sub(c),u.sub(c),d.sub(f),g.sub(f);const P=1/(d.x*g.y-g.x*d.y);isFinite(P)&&(x.copy(h).multiplyScalar(g.y).addScaledVector(u,-d.y).multiplyScalar(P),p.copy(u).multiplyScalar(d.x).addScaledVector(h,-g.x).multiplyScalar(P),o[C].add(x),o[w].add(x),o[S].add(x),l[C].add(p),l[w].add(p),l[S].add(p))}let y=this.groups;y.length===0&&(y=[{start:0,count:t.count}]);for(let C=0,w=y.length;C<w;++C){const S=y[C],P=S.start,z=S.count;for(let I=P,U=P+z;I<U;I+=3)m(t.getX(I+0),t.getX(I+1),t.getX(I+2))}const M=new D,v=new D,b=new D,_=new D;function T(C){b.fromBufferAttribute(n,C),_.copy(b);const w=o[C];M.copy(w),M.sub(b.multiplyScalar(b.dot(w))).normalize(),v.crossVectors(_,w);const P=v.dot(l[C])<0?-1:1;a.setXYZW(C,M.x,M.y,M.z,P)}for(let C=0,w=y.length;C<w;++C){const S=y[C],P=S.start,z=S.count;for(let I=P,U=P+z;I<U;I+=3)T(t.getX(I+0)),T(t.getX(I+1)),T(t.getX(I+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Pe(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let f=0,d=i.count;f<d;f++)i.setXYZ(f,0,0,0);const n=new D,s=new D,a=new D,o=new D,l=new D,c=new D,h=new D,u=new D;if(t)for(let f=0,d=t.count;f<d;f+=3){const g=t.getX(f+0),x=t.getX(f+1),p=t.getX(f+2);n.fromBufferAttribute(e,g),s.fromBufferAttribute(e,x),a.fromBufferAttribute(e,p),h.subVectors(a,s),u.subVectors(n,s),h.cross(u),o.fromBufferAttribute(i,g),l.fromBufferAttribute(i,x),c.fromBufferAttribute(i,p),o.add(h),l.add(h),c.add(h),i.setXYZ(g,o.x,o.y,o.z),i.setXYZ(x,l.x,l.y,l.z),i.setXYZ(p,c.x,c.y,c.z)}else for(let f=0,d=e.count;f<d;f+=3)n.fromBufferAttribute(e,f+0),s.fromBufferAttribute(e,f+1),a.fromBufferAttribute(e,f+2),h.subVectors(a,s),u.subVectors(n,s),h.cross(u),i.setXYZ(f+0,h.x,h.y,h.z),i.setXYZ(f+1,h.x,h.y,h.z),i.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)Oe.fromBufferAttribute(t,e),Oe.normalize(),t.setXYZ(e,Oe.x,Oe.y,Oe.z)}toNonIndexed(){function t(o,l){const c=o.array,h=o.itemSize,u=o.normalized,f=new c.constructor(l.length*h);let d=0,g=0;for(let x=0,p=l.length;x<p;x++){o.isInterleavedBufferAttribute?d=l[x]*o.data.stride+o.offset:d=l[x]*h;for(let m=0;m<h;m++)f[g++]=c[d++]}return new Pe(f,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new we,i=this.index.array,n=this.attributes;for(const o in n){const l=n[o],c=t(l,i);e.setAttribute(o,c)}const s=this.morphAttributes;for(const o in s){const l=[],c=s[o];for(let h=0,u=c.length;h<u;h++){const f=c[h],d=t(f,i);l.push(d)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const l in i){const c=i[l];t.data.attributes[l]=c.toJSON(t.data)}const n={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,f=c.length;u<f;u++){const d=c[u];h.push(d.toJSON(t.data))}h.length>0&&(n[l]=h,s=!0)}s&&(t.data.morphAttributes=n,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone(e));const n=t.attributes;for(const c in n){const h=n[c];this.setAttribute(c,h.clone(e))}const s=t.morphAttributes;for(const c in s){const h=[],u=s[c];for(let f=0,d=u.length;f<d;f++)h.push(u[f].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let c=0,h=a.length;c<h;c++){const u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const uc=new Vt,_n=new or,_r=new tn,fc=new D,Tr=new D,Er=new D,Ar=new D,Xa=new D,Cr=new D,dc=new D,Rr=new D;class G extends me{constructor(t=new we,e=new pe){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const n=e[i[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=n.length;s<a;s++){const o=n[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(t,e){const i=this.geometry,n=i.attributes.position,s=i.morphAttributes.position,a=i.morphTargetsRelative;e.fromBufferAttribute(n,t);const o=this.morphTargetInfluences;if(s&&o){Cr.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const h=o[l],u=s[l];h!==0&&(Xa.fromBufferAttribute(u,t),a?Cr.addScaledVector(Xa,h):Cr.addScaledVector(Xa.sub(e),h))}e.add(Cr)}return e}raycast(t,e){const i=this.geometry,n=this.material,s=this.matrixWorld;n!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),_r.copy(i.boundingSphere),_r.applyMatrix4(s),_n.copy(t.ray).recast(t.near),!(_r.containsPoint(_n.origin)===!1&&(_n.intersectSphere(_r,fc)===null||_n.origin.distanceToSquared(fc)>(t.far-t.near)**2))&&(uc.copy(s).invert(),_n.copy(t.ray).applyMatrix4(uc),!(i.boundingBox!==null&&_n.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,_n)))}_computeIntersections(t,e,i){let n;const s=this.geometry,a=this.material,o=s.index,l=s.attributes.position,c=s.attributes.uv,h=s.attributes.uv1,u=s.attributes.normal,f=s.groups,d=s.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,x=f.length;g<x;g++){const p=f[g],m=a[p.materialIndex],y=Math.max(p.start,d.start),M=Math.min(o.count,Math.min(p.start+p.count,d.start+d.count));for(let v=y,b=M;v<b;v+=3){const _=o.getX(v),T=o.getX(v+1),C=o.getX(v+2);n=Pr(this,m,t,i,c,h,u,_,T,C),n&&(n.faceIndex=Math.floor(v/3),n.face.materialIndex=p.materialIndex,e.push(n))}}else{const g=Math.max(0,d.start),x=Math.min(o.count,d.start+d.count);for(let p=g,m=x;p<m;p+=3){const y=o.getX(p),M=o.getX(p+1),v=o.getX(p+2);n=Pr(this,a,t,i,c,h,u,y,M,v),n&&(n.faceIndex=Math.floor(p/3),e.push(n))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,x=f.length;g<x;g++){const p=f[g],m=a[p.materialIndex],y=Math.max(p.start,d.start),M=Math.min(l.count,Math.min(p.start+p.count,d.start+d.count));for(let v=y,b=M;v<b;v+=3){const _=v,T=v+1,C=v+2;n=Pr(this,m,t,i,c,h,u,_,T,C),n&&(n.faceIndex=Math.floor(v/3),n.face.materialIndex=p.materialIndex,e.push(n))}}else{const g=Math.max(0,d.start),x=Math.min(l.count,d.start+d.count);for(let p=g,m=x;p<m;p+=3){const y=p,M=p+1,v=p+2;n=Pr(this,a,t,i,c,h,u,y,M,v),n&&(n.faceIndex=Math.floor(p/3),e.push(n))}}}}function If(r,t,e,i,n,s,a,o){let l;if(t.side===$e?l=i.intersectTriangle(a,s,n,!0,o):l=i.intersectTriangle(n,s,a,t.side===vn,o),l===null)return null;Rr.copy(o),Rr.applyMatrix4(r.matrixWorld);const c=e.ray.origin.distanceTo(Rr);return c<e.near||c>e.far?null:{distance:c,point:Rr.clone(),object:r}}function Pr(r,t,e,i,n,s,a,o,l,c){r.getVertexPosition(o,Tr),r.getVertexPosition(l,Er),r.getVertexPosition(c,Ar);const h=If(r,t,e,i,Tr,Er,Ar,dc);if(h){const u=new D;bi.getBarycoord(dc,Tr,Er,Ar,u),n&&(h.uv=bi.getInterpolatedAttribute(n,o,l,c,u,new it)),s&&(h.uv1=bi.getInterpolatedAttribute(s,o,l,c,u,new it)),a&&(h.normal=bi.getInterpolatedAttribute(a,o,l,c,u,new D),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const f={a:o,b:l,c,normal:new D,materialIndex:0};bi.getNormal(Tr,Er,Ar,f.normal),h.face=f,h.barycoord=u}return h}class Ft extends we{constructor(t=1,e=1,i=1,n=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:n,heightSegments:s,depthSegments:a};const o=this;n=Math.floor(n),s=Math.floor(s),a=Math.floor(a);const l=[],c=[],h=[],u=[];let f=0,d=0;g("z","y","x",-1,-1,i,e,t,a,s,0),g("z","y","x",1,-1,i,e,-t,a,s,1),g("x","z","y",1,1,t,i,e,n,a,2),g("x","z","y",1,-1,t,i,-e,n,a,3),g("x","y","z",1,-1,t,e,i,n,s,4),g("x","y","z",-1,-1,t,e,-i,n,s,5),this.setIndex(l),this.setAttribute("position",new jt(c,3)),this.setAttribute("normal",new jt(h,3)),this.setAttribute("uv",new jt(u,2));function g(x,p,m,y,M,v,b,_,T,C,w){const S=v/T,P=b/C,z=v/2,I=b/2,U=_/2,X=T+1,q=C+1;let $=0,B=0;const ft=new D;for(let dt=0;dt<q;dt++){const xt=dt*P-I;for(let Gt=0;Gt<X;Gt++){const tt=Gt*S-z;ft[x]=tt*y,ft[p]=xt*M,ft[m]=U,c.push(ft.x,ft.y,ft.z),ft[x]=0,ft[p]=0,ft[m]=_>0?1:-1,h.push(ft.x,ft.y,ft.z),u.push(Gt/T),u.push(1-dt/C),$+=1}}for(let dt=0;dt<C;dt++)for(let xt=0;xt<T;xt++){const Gt=f+xt+X*dt,tt=f+xt+X*(dt+1),O=f+(xt+1)+X*(dt+1),J=f+(xt+1)+X*dt;l.push(Gt,tt,J),l.push(tt,O,J),B+=6}o.addGroup(d,B,w),d+=B,f+=$}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ft(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Ss(r){const t={};for(const e in r){t[e]={};for(const i in r[e]){const n=r[e][i];n&&(n.isColor||n.isMatrix3||n.isMatrix4||n.isVector2||n.isVector3||n.isVector4||n.isTexture||n.isQuaternion)?n.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=n.clone():Array.isArray(n)?t[e][i]=n.slice():t[e][i]=n}}return t}function Qe(r){const t={};for(let e=0;e<r.length;e++){const i=Ss(r[e]);for(const n in i)t[n]=i[n]}return t}function Uf(r){const t=[];for(let e=0;e<r.length;e++)t.push(r[e].clone());return t}function Qh(r){const t=r.getRenderTarget();return t===null?r.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:re.workingColorSpace}const er={clone:Ss,merge:Qe};var Nf=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Ff=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ve extends Hn{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Nf,this.fragmentShader=Ff,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Ss(t.uniforms),this.uniformsGroups=Uf(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const n in this.uniforms){const a=this.uniforms[n].value;a&&a.isTexture?e.uniforms[n]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[n]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[n]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[n]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[n]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[n]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[n]={type:"m4",value:a.toArray()}:e.uniforms[n]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const n in this.extensions)this.extensions[n]===!0&&(i[n]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}}class Jh extends me{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Vt,this.projectionMatrix=new Vt,this.projectionMatrixInverse=new Vt,this.coordinateSystem=Ki}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const cn=new D,pc=new it,mc=new it;class ni extends Jh{constructor(t=50,e=1,i=.1,n=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=n,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=la*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Ta*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return la*2*Math.atan(Math.tan(Ta*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){cn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(cn.x,cn.y).multiplyScalar(-t/cn.z),cn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(cn.x,cn.y).multiplyScalar(-t/cn.z)}getViewSize(t,e){return this.getViewBounds(t,pc,mc),e.subVectors(mc,pc)}setViewOffset(t,e,i,n,s,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=n,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Ta*.5*this.fov)/this.zoom,i=2*e,n=this.aspect*i,s=-.5*n;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;s+=a.offsetX*n/l,e-=a.offsetY*i/c,n*=a.width/l,i*=a.height/c}const o=this.filmOffset;o!==0&&(s+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+n,e,e-i,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const is=-90,ns=1;class kf extends me{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const n=new ni(is,ns,t,e);n.layers=this.layers,this.add(n);const s=new ni(is,ns,t,e);s.layers=this.layers,this.add(s);const a=new ni(is,ns,t,e);a.layers=this.layers,this.add(a);const o=new ni(is,ns,t,e);o.layers=this.layers,this.add(o);const l=new ni(is,ns,t,e);l.layers=this.layers,this.add(l);const c=new ni(is,ns,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,n,s,a,o,l]=e;for(const c of e)this.remove(c);if(t===Ki)i.up.set(0,1,0),i.lookAt(1,0,0),n.up.set(0,1,0),n.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===oa)i.up.set(0,-1,0),i.lookAt(-1,0,0),n.up.set(0,-1,0),n.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:n}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,l,c,h]=this.children,u=t.getRenderTarget(),f=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const x=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,n),t.render(e,s),t.setRenderTarget(i,1,n),t.render(e,a),t.setRenderTarget(i,2,n),t.render(e,o),t.setRenderTarget(i,3,n),t.render(e,l),t.setRenderTarget(i,4,n),t.render(e,c),i.texture.generateMipmaps=x,t.setRenderTarget(i,5,n),t.render(e,h),t.setRenderTarget(u,f,d),t.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class $h extends Ze{constructor(t,e,i,n,s,a,o,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:vs,super(t,e,i,n,s,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Of extends ze{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},n=[i,i,i,i,i,i];this.texture=new $h(n,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:Le}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},n=new Ft(5,5,5),s=new ve({name:"CubemapFromEquirect",uniforms:Ss(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:$e,blending:Qi});s.uniforms.tEquirect.value=e;const a=new G(n,s),o=e.minFilter;return e.minFilter===pn&&(e.minFilter=Le),new kf(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e,i,n){const s=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,i,n);t.setRenderTarget(s)}}const qa=new D,Bf=new D,Hf=new Kt;class Rn{constructor(t=new D(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,n){return this.normal.set(t,e,i),this.constant=n,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const n=qa.subVectors(i,e).cross(Bf.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(n,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const i=t.delta(qa),n=this.normal.dot(i);if(n===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const s=-(t.start.dot(this.normal)+this.constant)/n;return s<0||s>1?null:e.copy(t.start).addScaledVector(i,s)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||Hf.getNormalMatrix(t),n=this.coplanarPoint(qa).applyMatrix4(t),s=this.normal.applyMatrix3(i).normalize();return this.constant=-n.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Tn=new tn,Dr=new D;class Ml{constructor(t=new Rn,e=new Rn,i=new Rn,n=new Rn,s=new Rn,a=new Rn){this.planes=[t,e,i,n,s,a]}set(t,e,i,n,s,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(i),o[3].copy(n),o[4].copy(s),o[5].copy(a),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=Ki){const i=this.planes,n=t.elements,s=n[0],a=n[1],o=n[2],l=n[3],c=n[4],h=n[5],u=n[6],f=n[7],d=n[8],g=n[9],x=n[10],p=n[11],m=n[12],y=n[13],M=n[14],v=n[15];if(i[0].setComponents(l-s,f-c,p-d,v-m).normalize(),i[1].setComponents(l+s,f+c,p+d,v+m).normalize(),i[2].setComponents(l+a,f+h,p+g,v+y).normalize(),i[3].setComponents(l-a,f-h,p-g,v-y).normalize(),i[4].setComponents(l-o,f-u,p-x,v-M).normalize(),e===Ki)i[5].setComponents(l+o,f+u,p+x,v+M).normalize();else if(e===oa)i[5].setComponents(o,u,x,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Tn.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Tn.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Tn)}intersectsSprite(t){return Tn.center.set(0,0,0),Tn.radius=.7071067811865476,Tn.applyMatrix4(t.matrixWorld),this.intersectsSphere(Tn)}intersectsSphere(t){const e=this.planes,i=t.center,n=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(i)<n)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const n=e[i];if(Dr.x=n.normal.x>0?t.max.x:t.min.x,Dr.y=n.normal.y>0?t.max.y:t.min.y,Dr.z=n.normal.z>0?t.max.z:t.min.z,n.distanceToPoint(Dr)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function tu(){let r=null,t=!1,e=null,i=null;function n(s,a){e(s,a),i=r.requestAnimationFrame(n)}return{start:function(){t!==!0&&e!==null&&(i=r.requestAnimationFrame(n),t=!0)},stop:function(){r.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){r=s}}}function Gf(r){const t=new WeakMap;function e(o,l){const c=o.array,h=o.usage,u=c.byteLength,f=r.createBuffer();r.bindBuffer(l,f),r.bufferData(l,c,h),o.onUploadCallback();let d;if(c instanceof Float32Array)d=r.FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?d=r.HALF_FLOAT:d=r.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=r.SHORT;else if(c instanceof Uint32Array)d=r.UNSIGNED_INT;else if(c instanceof Int32Array)d=r.INT;else if(c instanceof Int8Array)d=r.BYTE;else if(c instanceof Uint8Array)d=r.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=r.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function i(o,l,c){const h=l.array,u=l.updateRanges;if(r.bindBuffer(c,o),u.length===0)r.bufferSubData(c,0,h);else{u.sort((d,g)=>d.start-g.start);let f=0;for(let d=1;d<u.length;d++){const g=u[f],x=u[d];x.start<=g.start+g.count+1?g.count=Math.max(g.count,x.start+x.count-g.start):(++f,u[f]=x)}u.length=f+1;for(let d=0,g=u.length;d<g;d++){const x=u[d];r.bufferSubData(c,x.start*h.BYTES_PER_ELEMENT,h,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function n(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=t.get(o);l&&(r.deleteBuffer(l.buffer),t.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=t.get(o);if(c===void 0)t.set(o,e(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:n,remove:s,update:a}}class ui extends we{constructor(t=1,e=1,i=1,n=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:n};const s=t/2,a=e/2,o=Math.floor(i),l=Math.floor(n),c=o+1,h=l+1,u=t/o,f=e/l,d=[],g=[],x=[],p=[];for(let m=0;m<h;m++){const y=m*f-a;for(let M=0;M<c;M++){const v=M*u-s;g.push(v,-y,0),x.push(0,0,1),p.push(M/o),p.push(1-m/l)}}for(let m=0;m<l;m++)for(let y=0;y<o;y++){const M=y+c*m,v=y+c*(m+1),b=y+1+c*(m+1),_=y+1+c*m;d.push(M,v,_),d.push(v,b,_)}this.setIndex(d),this.setAttribute("position",new jt(g,3)),this.setAttribute("normal",new jt(x,3)),this.setAttribute("uv",new jt(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ui(t.width,t.height,t.widthSegments,t.heightSegments)}}var Vf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Wf=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Xf=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,qf=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Yf=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Zf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Kf=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,jf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Qf=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Jf=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,$f=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,td=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,ed=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,id=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,nd=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,sd=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,rd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,ad=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,od=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,ld=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,cd=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,hd=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,ud=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,fd=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,dd=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,pd=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,md=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,gd=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,xd=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,vd=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,yd="gl_FragColor = linearToOutputTexel( gl_FragColor );",Md=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Sd=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,wd=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,bd=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,_d=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Td=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Ed=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Ad=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Cd=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Rd=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Pd=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Dd=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Ld=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,zd=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Id=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Ud=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Nd=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Fd=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,kd=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Od=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Bd=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Hd=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Gd=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Vd=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Wd=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Xd=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,qd=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Yd=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Zd=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Kd=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,jd=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Qd=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Jd=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,$d=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,tp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,ep=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,ip=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,np=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,sp=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,rp=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ap=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,op=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,lp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,cp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,hp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,up=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,fp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,dp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,pp=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,mp=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,gp=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,xp=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,vp=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,yp=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Mp=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Sp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,wp=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,bp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,_p=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Tp=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Ep=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Ap=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Cp=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Rp=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Pp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Dp=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Lp=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,zp=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Ip=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Up=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Np=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Fp=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,kp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Op=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Bp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Hp=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Gp=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Vp=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Wp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Xp=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,qp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Yp=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Zp=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Kp=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,jp=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Qp=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Jp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,$p=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,t0=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,e0=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,i0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,n0=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,s0=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,r0=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,a0=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,o0=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,l0=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,c0=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,h0=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,u0=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,f0=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,d0=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,p0=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,m0=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,g0=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,x0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,v0=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,y0=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,M0=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,S0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,$t={alphahash_fragment:Vf,alphahash_pars_fragment:Wf,alphamap_fragment:Xf,alphamap_pars_fragment:qf,alphatest_fragment:Yf,alphatest_pars_fragment:Zf,aomap_fragment:Kf,aomap_pars_fragment:jf,batching_pars_vertex:Qf,batching_vertex:Jf,begin_vertex:$f,beginnormal_vertex:td,bsdfs:ed,iridescence_fragment:id,bumpmap_pars_fragment:nd,clipping_planes_fragment:sd,clipping_planes_pars_fragment:rd,clipping_planes_pars_vertex:ad,clipping_planes_vertex:od,color_fragment:ld,color_pars_fragment:cd,color_pars_vertex:hd,color_vertex:ud,common:fd,cube_uv_reflection_fragment:dd,defaultnormal_vertex:pd,displacementmap_pars_vertex:md,displacementmap_vertex:gd,emissivemap_fragment:xd,emissivemap_pars_fragment:vd,colorspace_fragment:yd,colorspace_pars_fragment:Md,envmap_fragment:Sd,envmap_common_pars_fragment:wd,envmap_pars_fragment:bd,envmap_pars_vertex:_d,envmap_physical_pars_fragment:Ud,envmap_vertex:Td,fog_vertex:Ed,fog_pars_vertex:Ad,fog_fragment:Cd,fog_pars_fragment:Rd,gradientmap_pars_fragment:Pd,lightmap_pars_fragment:Dd,lights_lambert_fragment:Ld,lights_lambert_pars_fragment:zd,lights_pars_begin:Id,lights_toon_fragment:Nd,lights_toon_pars_fragment:Fd,lights_phong_fragment:kd,lights_phong_pars_fragment:Od,lights_physical_fragment:Bd,lights_physical_pars_fragment:Hd,lights_fragment_begin:Gd,lights_fragment_maps:Vd,lights_fragment_end:Wd,logdepthbuf_fragment:Xd,logdepthbuf_pars_fragment:qd,logdepthbuf_pars_vertex:Yd,logdepthbuf_vertex:Zd,map_fragment:Kd,map_pars_fragment:jd,map_particle_fragment:Qd,map_particle_pars_fragment:Jd,metalnessmap_fragment:$d,metalnessmap_pars_fragment:tp,morphinstance_vertex:ep,morphcolor_vertex:ip,morphnormal_vertex:np,morphtarget_pars_vertex:sp,morphtarget_vertex:rp,normal_fragment_begin:ap,normal_fragment_maps:op,normal_pars_fragment:lp,normal_pars_vertex:cp,normal_vertex:hp,normalmap_pars_fragment:up,clearcoat_normal_fragment_begin:fp,clearcoat_normal_fragment_maps:dp,clearcoat_pars_fragment:pp,iridescence_pars_fragment:mp,opaque_fragment:gp,packing:xp,premultiplied_alpha_fragment:vp,project_vertex:yp,dithering_fragment:Mp,dithering_pars_fragment:Sp,roughnessmap_fragment:wp,roughnessmap_pars_fragment:bp,shadowmap_pars_fragment:_p,shadowmap_pars_vertex:Tp,shadowmap_vertex:Ep,shadowmask_pars_fragment:Ap,skinbase_vertex:Cp,skinning_pars_vertex:Rp,skinning_vertex:Pp,skinnormal_vertex:Dp,specularmap_fragment:Lp,specularmap_pars_fragment:zp,tonemapping_fragment:Ip,tonemapping_pars_fragment:Up,transmission_fragment:Np,transmission_pars_fragment:Fp,uv_pars_fragment:kp,uv_pars_vertex:Op,uv_vertex:Bp,worldpos_vertex:Hp,background_vert:Gp,background_frag:Vp,backgroundCube_vert:Wp,backgroundCube_frag:Xp,cube_vert:qp,cube_frag:Yp,depth_vert:Zp,depth_frag:Kp,distanceRGBA_vert:jp,distanceRGBA_frag:Qp,equirect_vert:Jp,equirect_frag:$p,linedashed_vert:t0,linedashed_frag:e0,meshbasic_vert:i0,meshbasic_frag:n0,meshlambert_vert:s0,meshlambert_frag:r0,meshmatcap_vert:a0,meshmatcap_frag:o0,meshnormal_vert:l0,meshnormal_frag:c0,meshphong_vert:h0,meshphong_frag:u0,meshphysical_vert:f0,meshphysical_frag:d0,meshtoon_vert:p0,meshtoon_frag:m0,points_vert:g0,points_frag:x0,shadow_vert:v0,shadow_frag:y0,sprite_vert:M0,sprite_frag:S0},pt={common:{diffuse:{value:new j(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Kt},alphaMap:{value:null},alphaMapTransform:{value:new Kt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Kt}},envmap:{envMap:{value:null},envMapRotation:{value:new Kt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Kt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Kt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Kt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Kt},normalScale:{value:new it(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Kt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Kt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Kt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Kt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new j(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new j(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Kt},alphaTest:{value:0},uvTransform:{value:new Kt}},sprite:{diffuse:{value:new j(16777215)},opacity:{value:1},center:{value:new it(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Kt},alphaMap:{value:null},alphaMapTransform:{value:new Kt},alphaTest:{value:0}}},Ri={basic:{uniforms:Qe([pt.common,pt.specularmap,pt.envmap,pt.aomap,pt.lightmap,pt.fog]),vertexShader:$t.meshbasic_vert,fragmentShader:$t.meshbasic_frag},lambert:{uniforms:Qe([pt.common,pt.specularmap,pt.envmap,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.fog,pt.lights,{emissive:{value:new j(0)}}]),vertexShader:$t.meshlambert_vert,fragmentShader:$t.meshlambert_frag},phong:{uniforms:Qe([pt.common,pt.specularmap,pt.envmap,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.fog,pt.lights,{emissive:{value:new j(0)},specular:{value:new j(1118481)},shininess:{value:30}}]),vertexShader:$t.meshphong_vert,fragmentShader:$t.meshphong_frag},standard:{uniforms:Qe([pt.common,pt.envmap,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.roughnessmap,pt.metalnessmap,pt.fog,pt.lights,{emissive:{value:new j(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:$t.meshphysical_vert,fragmentShader:$t.meshphysical_frag},toon:{uniforms:Qe([pt.common,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.gradientmap,pt.fog,pt.lights,{emissive:{value:new j(0)}}]),vertexShader:$t.meshtoon_vert,fragmentShader:$t.meshtoon_frag},matcap:{uniforms:Qe([pt.common,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.fog,{matcap:{value:null}}]),vertexShader:$t.meshmatcap_vert,fragmentShader:$t.meshmatcap_frag},points:{uniforms:Qe([pt.points,pt.fog]),vertexShader:$t.points_vert,fragmentShader:$t.points_frag},dashed:{uniforms:Qe([pt.common,pt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:$t.linedashed_vert,fragmentShader:$t.linedashed_frag},depth:{uniforms:Qe([pt.common,pt.displacementmap]),vertexShader:$t.depth_vert,fragmentShader:$t.depth_frag},normal:{uniforms:Qe([pt.common,pt.bumpmap,pt.normalmap,pt.displacementmap,{opacity:{value:1}}]),vertexShader:$t.meshnormal_vert,fragmentShader:$t.meshnormal_frag},sprite:{uniforms:Qe([pt.sprite,pt.fog]),vertexShader:$t.sprite_vert,fragmentShader:$t.sprite_frag},background:{uniforms:{uvTransform:{value:new Kt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:$t.background_vert,fragmentShader:$t.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Kt}},vertexShader:$t.backgroundCube_vert,fragmentShader:$t.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:$t.cube_vert,fragmentShader:$t.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:$t.equirect_vert,fragmentShader:$t.equirect_frag},distanceRGBA:{uniforms:Qe([pt.common,pt.displacementmap,{referencePosition:{value:new D},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:$t.distanceRGBA_vert,fragmentShader:$t.distanceRGBA_frag},shadow:{uniforms:Qe([pt.lights,pt.fog,{color:{value:new j(0)},opacity:{value:1}}]),vertexShader:$t.shadow_vert,fragmentShader:$t.shadow_frag}};Ri.physical={uniforms:Qe([Ri.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Kt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Kt},clearcoatNormalScale:{value:new it(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Kt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Kt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Kt},sheen:{value:0},sheenColor:{value:new j(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Kt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Kt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Kt},transmissionSamplerSize:{value:new it},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Kt},attenuationDistance:{value:0},attenuationColor:{value:new j(0)},specularColor:{value:new j(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Kt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Kt},anisotropyVector:{value:new it},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Kt}}]),vertexShader:$t.meshphysical_vert,fragmentShader:$t.meshphysical_frag};const Lr={r:0,b:0,g:0},En=new zi,w0=new Vt;function b0(r,t,e,i,n,s,a){const o=new j(0);let l=s===!0?0:1,c,h,u=null,f=0,d=null;function g(y){let M=y.isScene===!0?y.background:null;return M&&M.isTexture&&(M=(y.backgroundBlurriness>0?e:t).get(M)),M}function x(y){let M=!1;const v=g(y);v===null?m(o,l):v&&v.isColor&&(m(v,1),M=!0);const b=r.xr.getEnvironmentBlendMode();b==="additive"?i.buffers.color.setClear(0,0,0,1,a):b==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(r.autoClear||M)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil))}function p(y,M){const v=g(M);v&&(v.isCubeTexture||v.mapping===ma)?(h===void 0&&(h=new G(new Ft(1,1,1),new ve({name:"BackgroundCubeMaterial",uniforms:Ss(Ri.backgroundCube.uniforms),vertexShader:Ri.backgroundCube.vertexShader,fragmentShader:Ri.backgroundCube.fragmentShader,side:$e,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(b,_,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(h)),En.copy(M.backgroundRotation),En.x*=-1,En.y*=-1,En.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(En.y*=-1,En.z*=-1),h.material.uniforms.envMap.value=v,h.material.uniforms.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(w0.makeRotationFromEuler(En)),h.material.toneMapped=re.getTransfer(v.colorSpace)!==xe,(u!==v||f!==v.version||d!==r.toneMapping)&&(h.material.needsUpdate=!0,u=v,f=v.version,d=r.toneMapping),h.layers.enableAll(),y.unshift(h,h.geometry,h.material,0,0,null)):v&&v.isTexture&&(c===void 0&&(c=new G(new ui(2,2),new ve({name:"BackgroundMaterial",uniforms:Ss(Ri.background.uniforms),vertexShader:Ri.background.vertexShader,fragmentShader:Ri.background.fragmentShader,side:vn,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(c)),c.material.uniforms.t2D.value=v,c.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,c.material.toneMapped=re.getTransfer(v.colorSpace)!==xe,v.matrixAutoUpdate===!0&&v.updateMatrix(),c.material.uniforms.uvTransform.value.copy(v.matrix),(u!==v||f!==v.version||d!==r.toneMapping)&&(c.material.needsUpdate=!0,u=v,f=v.version,d=r.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null))}function m(y,M){y.getRGB(Lr,Qh(r)),i.buffers.color.setClear(Lr.r,Lr.g,Lr.b,M,a)}return{getClearColor:function(){return o},setClearColor:function(y,M=1){o.set(y),l=M,m(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(y){l=y,m(o,l)},render:x,addToRenderList:p}}function _0(r,t){const e=r.getParameter(r.MAX_VERTEX_ATTRIBS),i={},n=f(null);let s=n,a=!1;function o(S,P,z,I,U){let X=!1;const q=u(I,z,P);s!==q&&(s=q,c(s.object)),X=d(S,I,z,U),X&&g(S,I,z,U),U!==null&&t.update(U,r.ELEMENT_ARRAY_BUFFER),(X||a)&&(a=!1,v(S,P,z,I),U!==null&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,t.get(U).buffer))}function l(){return r.createVertexArray()}function c(S){return r.bindVertexArray(S)}function h(S){return r.deleteVertexArray(S)}function u(S,P,z){const I=z.wireframe===!0;let U=i[S.id];U===void 0&&(U={},i[S.id]=U);let X=U[P.id];X===void 0&&(X={},U[P.id]=X);let q=X[I];return q===void 0&&(q=f(l()),X[I]=q),q}function f(S){const P=[],z=[],I=[];for(let U=0;U<e;U++)P[U]=0,z[U]=0,I[U]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:z,attributeDivisors:I,object:S,attributes:{},index:null}}function d(S,P,z,I){const U=s.attributes,X=P.attributes;let q=0;const $=z.getAttributes();for(const B in $)if($[B].location>=0){const dt=U[B];let xt=X[B];if(xt===void 0&&(B==="instanceMatrix"&&S.instanceMatrix&&(xt=S.instanceMatrix),B==="instanceColor"&&S.instanceColor&&(xt=S.instanceColor)),dt===void 0||dt.attribute!==xt||xt&&dt.data!==xt.data)return!0;q++}return s.attributesNum!==q||s.index!==I}function g(S,P,z,I){const U={},X=P.attributes;let q=0;const $=z.getAttributes();for(const B in $)if($[B].location>=0){let dt=X[B];dt===void 0&&(B==="instanceMatrix"&&S.instanceMatrix&&(dt=S.instanceMatrix),B==="instanceColor"&&S.instanceColor&&(dt=S.instanceColor));const xt={};xt.attribute=dt,dt&&dt.data&&(xt.data=dt.data),U[B]=xt,q++}s.attributes=U,s.attributesNum=q,s.index=I}function x(){const S=s.newAttributes;for(let P=0,z=S.length;P<z;P++)S[P]=0}function p(S){m(S,0)}function m(S,P){const z=s.newAttributes,I=s.enabledAttributes,U=s.attributeDivisors;z[S]=1,I[S]===0&&(r.enableVertexAttribArray(S),I[S]=1),U[S]!==P&&(r.vertexAttribDivisor(S,P),U[S]=P)}function y(){const S=s.newAttributes,P=s.enabledAttributes;for(let z=0,I=P.length;z<I;z++)P[z]!==S[z]&&(r.disableVertexAttribArray(z),P[z]=0)}function M(S,P,z,I,U,X,q){q===!0?r.vertexAttribIPointer(S,P,z,U,X):r.vertexAttribPointer(S,P,z,I,U,X)}function v(S,P,z,I){x();const U=I.attributes,X=z.getAttributes(),q=P.defaultAttributeValues;for(const $ in X){const B=X[$];if(B.location>=0){let ft=U[$];if(ft===void 0&&($==="instanceMatrix"&&S.instanceMatrix&&(ft=S.instanceMatrix),$==="instanceColor"&&S.instanceColor&&(ft=S.instanceColor)),ft!==void 0){const dt=ft.normalized,xt=ft.itemSize,Gt=t.get(ft);if(Gt===void 0)continue;const tt=Gt.buffer,O=Gt.type,J=Gt.bytesPerElement,ht=O===r.INT||O===r.UNSIGNED_INT||ft.gpuType===pl;if(ft.isInterleavedBufferAttribute){const st=ft.data,Pt=st.stride,kt=ft.offset;if(st.isInstancedInterleavedBuffer){for(let ot=0;ot<B.locationSize;ot++)m(B.location+ot,st.meshPerAttribute);S.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=st.meshPerAttribute*st.count)}else for(let ot=0;ot<B.locationSize;ot++)p(B.location+ot);r.bindBuffer(r.ARRAY_BUFFER,tt);for(let ot=0;ot<B.locationSize;ot++)M(B.location+ot,xt/B.locationSize,O,dt,Pt*J,(kt+xt/B.locationSize*ot)*J,ht)}else{if(ft.isInstancedBufferAttribute){for(let st=0;st<B.locationSize;st++)m(B.location+st,ft.meshPerAttribute);S.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=ft.meshPerAttribute*ft.count)}else for(let st=0;st<B.locationSize;st++)p(B.location+st);r.bindBuffer(r.ARRAY_BUFFER,tt);for(let st=0;st<B.locationSize;st++)M(B.location+st,xt/B.locationSize,O,dt,xt*J,xt/B.locationSize*st*J,ht)}}else if(q!==void 0){const dt=q[$];if(dt!==void 0)switch(dt.length){case 2:r.vertexAttrib2fv(B.location,dt);break;case 3:r.vertexAttrib3fv(B.location,dt);break;case 4:r.vertexAttrib4fv(B.location,dt);break;default:r.vertexAttrib1fv(B.location,dt)}}}}y()}function b(){C();for(const S in i){const P=i[S];for(const z in P){const I=P[z];for(const U in I)h(I[U].object),delete I[U];delete P[z]}delete i[S]}}function _(S){if(i[S.id]===void 0)return;const P=i[S.id];for(const z in P){const I=P[z];for(const U in I)h(I[U].object),delete I[U];delete P[z]}delete i[S.id]}function T(S){for(const P in i){const z=i[P];if(z[S.id]===void 0)continue;const I=z[S.id];for(const U in I)h(I[U].object),delete I[U];delete z[S.id]}}function C(){w(),a=!0,s!==n&&(s=n,c(s.object))}function w(){n.geometry=null,n.program=null,n.wireframe=!1}return{setup:o,reset:C,resetDefaultState:w,dispose:b,releaseStatesOfGeometry:_,releaseStatesOfProgram:T,initAttributes:x,enableAttribute:p,disableUnusedAttributes:y}}function T0(r,t,e){let i;function n(c){i=c}function s(c,h){r.drawArrays(i,c,h),e.update(h,i,1)}function a(c,h,u){u!==0&&(r.drawArraysInstanced(i,c,h,u),e.update(h,i,u))}function o(c,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,h,0,u);let d=0;for(let g=0;g<u;g++)d+=h[g];e.update(d,i,1)}function l(c,h,u,f){if(u===0)return;const d=t.get("WEBGL_multi_draw");if(d===null)for(let g=0;g<c.length;g++)a(c[g],h[g],f[g]);else{d.multiDrawArraysInstancedWEBGL(i,c,0,h,0,f,0,u);let g=0;for(let x=0;x<u;x++)g+=h[x]*f[x];e.update(g,i,1)}}this.setMode=n,this.render=s,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function E0(r,t,e,i){let n;function s(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){const T=t.get("EXT_texture_filter_anisotropic");n=r.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function a(T){return!(T!==Ue&&i.convert(T)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(T){const C=T===Je&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(T!==$i&&i.convert(T)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_TYPE)&&T!==_i&&!C)}function l(T){if(T==="highp"){if(r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.HIGH_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.MEDIUM_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const u=e.logarithmicDepthBuffer===!0,f=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),d=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),g=r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=r.getParameter(r.MAX_TEXTURE_SIZE),p=r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE),m=r.getParameter(r.MAX_VERTEX_ATTRIBS),y=r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS),M=r.getParameter(r.MAX_VARYING_VECTORS),v=r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS),b=g>0,_=r.getParameter(r.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:u,reverseDepthBuffer:f,maxTextures:d,maxVertexTextures:g,maxTextureSize:x,maxCubemapSize:p,maxAttributes:m,maxVertexUniforms:y,maxVaryings:M,maxFragmentUniforms:v,vertexTextures:b,maxSamples:_}}function A0(r){const t=this;let e=null,i=0,n=!1,s=!1;const a=new Rn,o=new Kt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const d=u.length!==0||f||i!==0||n;return n=f,i=u.length,d},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(u,f){e=h(u,f,0)},this.setState=function(u,f,d){const g=u.clippingPlanes,x=u.clipIntersection,p=u.clipShadows,m=r.get(u);if(!n||g===null||g.length===0||s&&!p)s?h(null):c();else{const y=s?0:i,M=y*4;let v=m.clippingState||null;l.value=v,v=h(g,f,M,d);for(let b=0;b!==M;++b)v[b]=e[b];m.clippingState=v,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=y}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function h(u,f,d,g){const x=u!==null?u.length:0;let p=null;if(x!==0){if(p=l.value,g!==!0||p===null){const m=d+x*4,y=f.matrixWorldInverse;o.getNormalMatrix(y),(p===null||p.length<m)&&(p=new Float32Array(m));for(let M=0,v=d;M!==x;++M,v+=4)a.copy(u[M]).applyMatrix4(y,o),a.normal.toArray(p,v),p[v+3]=a.constant}l.value=p,l.needsUpdate=!0}return t.numPlanes=x,t.numIntersection=0,p}}function C0(r){let t=new WeakMap;function e(a,o){return o===Ro?a.mapping=vs:o===Po&&(a.mapping=ys),a}function i(a){if(a&&a.isTexture){const o=a.mapping;if(o===Ro||o===Po)if(t.has(a)){const l=t.get(a).texture;return e(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new Of(l.height);return c.fromEquirectangularTexture(r,a),t.set(a,c),a.addEventListener("dispose",n),e(c.texture,a.mapping)}else return null}}return a}function n(a){const o=a.target;o.removeEventListener("dispose",n);const l=t.get(o);l!==void 0&&(t.delete(o),l.dispose())}function s(){t=new WeakMap}return{get:i,dispose:s}}class va extends Jh{constructor(t=-1,e=1,i=1,n=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=n,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,n,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=n,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,n=(this.top+this.bottom)/2;let s=i-t,a=i+t,o=n+e,l=n-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,a=s+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const us=4,gc=[.125,.215,.35,.446,.526,.582],zn=20,Ya=new va,xc=new j;let Za=null,Ka=0,ja=0,Qa=!1;const Pn=(1+Math.sqrt(5))/2,ss=1/Pn,vc=[new D(-Pn,ss,0),new D(Pn,ss,0),new D(-ss,0,Pn),new D(ss,0,Pn),new D(0,Pn,-ss),new D(0,Pn,ss),new D(-1,1,-1),new D(1,1,-1),new D(-1,1,1),new D(1,1,1)];class yc{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,n=100){Za=this._renderer.getRenderTarget(),Ka=this._renderer.getActiveCubeFace(),ja=this._renderer.getActiveMipmapLevel(),Qa=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(t,i,n,s),e>0&&this._blur(s,0,0,e),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=wc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Sc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Za,Ka,ja),this._renderer.xr.enabled=Qa,t.scissorTest=!1,zr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===vs||t.mapping===ys?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Za=this._renderer.getRenderTarget(),Ka=this._renderer.getActiveCubeFace(),ja=this._renderer.getActiveMipmapLevel(),Qa=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:Le,minFilter:Le,generateMipmaps:!1,type:Je,format:Ue,colorSpace:_s,depthBuffer:!1},n=Mc(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Mc(t,e,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=R0(s)),this._blurMaterial=P0(s,t,e)}return n}_compileMaterial(t){const e=new G(this._lodPlanes[0],t);this._renderer.compile(e,Ya)}_sceneToCubeUV(t,e,i,n){const o=new ni(90,1,e,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,f=h.toneMapping;h.getClearColor(xc),h.toneMapping=mn,h.autoClear=!1;const d=new pe({name:"PMREM.Background",side:$e,depthWrite:!1,depthTest:!1}),g=new G(new Ft,d);let x=!1;const p=t.background;p?p.isColor&&(d.color.copy(p),t.background=null,x=!0):(d.color.copy(xc),x=!0);for(let m=0;m<6;m++){const y=m%3;y===0?(o.up.set(0,l[m],0),o.lookAt(c[m],0,0)):y===1?(o.up.set(0,0,l[m]),o.lookAt(0,c[m],0)):(o.up.set(0,l[m],0),o.lookAt(0,0,c[m]));const M=this._cubeSize;zr(n,y*M,m>2?M:0,M,M),h.setRenderTarget(n),x&&h.render(g,o),h.render(t,o)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=f,h.autoClear=u,t.background=p}_textureToCubeUV(t,e){const i=this._renderer,n=t.mapping===vs||t.mapping===ys;n?(this._cubemapMaterial===null&&(this._cubemapMaterial=wc()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Sc());const s=n?this._cubemapMaterial:this._equirectMaterial,a=new G(this._lodPlanes[0],s),o=s.uniforms;o.envMap.value=t;const l=this._cubeSize;zr(e,0,0,3*l,2*l),i.setRenderTarget(e),i.render(a,Ya)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;const n=this._lodPlanes.length;for(let s=1;s<n;s++){const a=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=vc[(n-s-1)%vc.length];this._blur(t,s-1,s,a,o)}e.autoClear=i}_blur(t,e,i,n,s){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,i,n,"latitudinal",s),this._halfBlur(a,t,i,i,n,"longitudinal",s)}_halfBlur(t,e,i,n,s,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new G(this._lodPlanes[n],c),f=c.uniforms,d=this._sizeLods[i]-1,g=isFinite(s)?Math.PI/(2*d):2*Math.PI/(2*zn-1),x=s/g,p=isFinite(s)?1+Math.floor(h*x):zn;p>zn&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${zn}`);const m=[];let y=0;for(let T=0;T<zn;++T){const C=T/x,w=Math.exp(-C*C/2);m.push(w),T===0?y+=w:T<p&&(y+=2*w)}for(let T=0;T<m.length;T++)m[T]=m[T]/y;f.envMap.value=t.texture,f.samples.value=p,f.weights.value=m,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);const{_lodMax:M}=this;f.dTheta.value=g,f.mipInt.value=M-i;const v=this._sizeLods[n],b=3*v*(n>M-us?n-M+us:0),_=4*(this._cubeSize-v);zr(e,b,_,3*v,2*v),l.setRenderTarget(e),l.render(u,Ya)}}function R0(r){const t=[],e=[],i=[];let n=r;const s=r-us+1+gc.length;for(let a=0;a<s;a++){const o=Math.pow(2,n);e.push(o);let l=1/o;a>r-us?l=gc[a-r+us-1]:a===0&&(l=0),i.push(l);const c=1/(o-2),h=-c,u=1+c,f=[h,h,u,h,u,u,h,h,u,u,h,u],d=6,g=6,x=3,p=2,m=1,y=new Float32Array(x*g*d),M=new Float32Array(p*g*d),v=new Float32Array(m*g*d);for(let _=0;_<d;_++){const T=_%3*2/3-1,C=_>2?0:-1,w=[T,C,0,T+2/3,C,0,T+2/3,C+1,0,T,C,0,T+2/3,C+1,0,T,C+1,0];y.set(w,x*g*_),M.set(f,p*g*_);const S=[_,_,_,_,_,_];v.set(S,m*g*_)}const b=new we;b.setAttribute("position",new Pe(y,x)),b.setAttribute("uv",new Pe(M,p)),b.setAttribute("faceIndex",new Pe(v,m)),t.push(b),n>us&&n--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function Mc(r,t,e){const i=new ze(r,t,e);return i.texture.mapping=ma,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function zr(r,t,e,i,n){r.viewport.set(t,e,i,n),r.scissor.set(t,e,i,n)}function P0(r,t,e){const i=new Float32Array(zn),n=new D(0,1,0);return new ve({name:"SphericalGaussianBlur",defines:{n:zn,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:n}},vertexShader:Sl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Qi,depthTest:!1,depthWrite:!1})}function Sc(){return new ve({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Sl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Qi,depthTest:!1,depthWrite:!1})}function wc(){return new ve({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Sl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Qi,depthTest:!1,depthWrite:!1})}function Sl(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function D0(r){let t=new WeakMap,e=null;function i(o){if(o&&o.isTexture){const l=o.mapping,c=l===Ro||l===Po,h=l===vs||l===ys;if(c||h){let u=t.get(o);const f=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==f)return e===null&&(e=new yc(r)),u=c?e.fromEquirectangular(o,u):e.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),u.texture;if(u!==void 0)return u.texture;{const d=o.image;return c&&d&&d.height>0||h&&d&&n(d)?(e===null&&(e=new yc(r)),u=c?e.fromEquirectangular(o):e.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),o.addEventListener("dispose",s),u.texture):null}}}return o}function n(o){let l=0;const c=6;for(let h=0;h<c;h++)o[h]!==void 0&&l++;return l===c}function s(o){const l=o.target;l.removeEventListener("dispose",s);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:a}}function L0(r){const t={};function e(i){if(t[i]!==void 0)return t[i];let n;switch(i){case"WEBGL_depth_texture":n=r.getExtension("WEBGL_depth_texture")||r.getExtension("MOZ_WEBGL_depth_texture")||r.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":n=r.getExtension("EXT_texture_filter_anisotropic")||r.getExtension("MOZ_EXT_texture_filter_anisotropic")||r.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":n=r.getExtension("WEBGL_compressed_texture_s3tc")||r.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":n=r.getExtension("WEBGL_compressed_texture_pvrtc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:n=r.getExtension(i)}return t[i]=n,n}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){const n=e(i);return n===null&&Xs("THREE.WebGLRenderer: "+i+" extension not supported."),n}}}function z0(r,t,e,i){const n={},s=new WeakMap;function a(u){const f=u.target;f.index!==null&&t.remove(f.index);for(const g in f.attributes)t.remove(f.attributes[g]);for(const g in f.morphAttributes){const x=f.morphAttributes[g];for(let p=0,m=x.length;p<m;p++)t.remove(x[p])}f.removeEventListener("dispose",a),delete n[f.id];const d=s.get(f);d&&(t.remove(d),s.delete(f)),i.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,e.memory.geometries--}function o(u,f){return n[f.id]===!0||(f.addEventListener("dispose",a),n[f.id]=!0,e.memory.geometries++),f}function l(u){const f=u.attributes;for(const g in f)t.update(f[g],r.ARRAY_BUFFER);const d=u.morphAttributes;for(const g in d){const x=d[g];for(let p=0,m=x.length;p<m;p++)t.update(x[p],r.ARRAY_BUFFER)}}function c(u){const f=[],d=u.index,g=u.attributes.position;let x=0;if(d!==null){const y=d.array;x=d.version;for(let M=0,v=y.length;M<v;M+=3){const b=y[M+0],_=y[M+1],T=y[M+2];f.push(b,_,_,T,T,b)}}else if(g!==void 0){const y=g.array;x=g.version;for(let M=0,v=y.length/3-1;M<v;M+=3){const b=M+0,_=M+1,T=M+2;f.push(b,_,_,T,T,b)}}else return;const p=new(Wh(f)?jh:Kh)(f,1);p.version=x;const m=s.get(u);m&&t.remove(m),s.set(u,p)}function h(u){const f=s.get(u);if(f){const d=u.index;d!==null&&f.version<d.version&&c(u)}else c(u);return s.get(u)}return{get:o,update:l,getWireframeAttribute:h}}function I0(r,t,e){let i;function n(f){i=f}let s,a;function o(f){s=f.type,a=f.bytesPerElement}function l(f,d){r.drawElements(i,d,s,f*a),e.update(d,i,1)}function c(f,d,g){g!==0&&(r.drawElementsInstanced(i,d,s,f*a,g),e.update(d,i,g))}function h(f,d,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,d,0,s,f,0,g);let p=0;for(let m=0;m<g;m++)p+=d[m];e.update(p,i,1)}function u(f,d,g,x){if(g===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let m=0;m<f.length;m++)c(f[m]/a,d[m],x[m]);else{p.multiDrawElementsInstancedWEBGL(i,d,0,s,f,0,x,0,g);let m=0;for(let y=0;y<g;y++)m+=d[y]*x[y];e.update(m,i,1)}}this.setMode=n,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function U0(r){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,a,o){switch(e.calls++,a){case r.TRIANGLES:e.triangles+=o*(s/3);break;case r.LINES:e.lines+=o*(s/2);break;case r.LINE_STRIP:e.lines+=o*(s-1);break;case r.LINE_LOOP:e.lines+=o*s;break;case r.POINTS:e.points+=o*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function n(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:n,update:i}}function N0(r,t,e){const i=new WeakMap,n=new ye;function s(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0;let f=i.get(o);if(f===void 0||f.count!==u){let S=function(){C.dispose(),i.delete(o),o.removeEventListener("dispose",S)};var d=S;f!==void 0&&f.texture.dispose();const g=o.morphAttributes.position!==void 0,x=o.morphAttributes.normal!==void 0,p=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],y=o.morphAttributes.normal||[],M=o.morphAttributes.color||[];let v=0;g===!0&&(v=1),x===!0&&(v=2),p===!0&&(v=3);let b=o.attributes.position.count*v,_=1;b>t.maxTextureSize&&(_=Math.ceil(b/t.maxTextureSize),b=t.maxTextureSize);const T=new Float32Array(b*_*4*u),C=new qh(T,b,_,u);C.type=_i,C.needsUpdate=!0;const w=v*4;for(let P=0;P<u;P++){const z=m[P],I=y[P],U=M[P],X=b*_*4*P;for(let q=0;q<z.count;q++){const $=q*w;g===!0&&(n.fromBufferAttribute(z,q),T[X+$+0]=n.x,T[X+$+1]=n.y,T[X+$+2]=n.z,T[X+$+3]=0),x===!0&&(n.fromBufferAttribute(I,q),T[X+$+4]=n.x,T[X+$+5]=n.y,T[X+$+6]=n.z,T[X+$+7]=0),p===!0&&(n.fromBufferAttribute(U,q),T[X+$+8]=n.x,T[X+$+9]=n.y,T[X+$+10]=n.z,T[X+$+11]=U.itemSize===4?n.w:1)}}f={count:u,texture:C,size:new it(b,_)},i.set(o,f),o.addEventListener("dispose",S)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(r,"morphTexture",a.morphTexture,e);else{let g=0;for(let p=0;p<c.length;p++)g+=c[p];const x=o.morphTargetsRelative?1:1-g;l.getUniforms().setValue(r,"morphTargetBaseInfluence",x),l.getUniforms().setValue(r,"morphTargetInfluences",c)}l.getUniforms().setValue(r,"morphTargetsTexture",f.texture,e),l.getUniforms().setValue(r,"morphTargetsTextureSize",f.size)}return{update:s}}function F0(r,t,e,i){let n=new WeakMap;function s(l){const c=i.render.frame,h=l.geometry,u=t.get(l,h);if(n.get(u)!==c&&(t.update(u),n.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),n.get(l)!==c&&(e.update(l.instanceMatrix,r.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,r.ARRAY_BUFFER),n.set(l,c))),l.isSkinnedMesh){const f=l.skeleton;n.get(f)!==c&&(f.update(),n.set(f,c))}return u}function a(){n=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:s,dispose:a}}class Zs extends Ze{constructor(t,e,i,n,s,a,o,l,c,h=gn){if(h!==gn&&h!==kn)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&h===gn&&(i=Di),i===void 0&&h===kn&&(i=Fn),super(null,n,s,a,o,l,h,i,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=o!==void 0?o:Te,this.minFilter=l!==void 0?l:Te,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const eu=new Ze,bc=new Zs(1,1),iu=new qh,nu=new _f,su=new $h,_c=[],Tc=[],Ec=new Float32Array(16),Ac=new Float32Array(9),Cc=new Float32Array(4);function As(r,t,e){const i=r[0];if(i<=0||i>0)return r;const n=t*e;let s=_c[n];if(s===void 0&&(s=new Float32Array(n),_c[n]=s),t!==0){i.toArray(s,0);for(let a=1,o=0;a!==t;++a)o+=e,r[a].toArray(s,o)}return s}function Fe(r,t){if(r.length!==t.length)return!1;for(let e=0,i=r.length;e<i;e++)if(r[e]!==t[e])return!1;return!0}function ke(r,t){for(let e=0,i=t.length;e<i;e++)r[e]=t[e]}function ya(r,t){let e=Tc[t];e===void 0&&(e=new Int32Array(t),Tc[t]=e);for(let i=0;i!==t;++i)e[i]=r.allocateTextureUnit();return e}function k0(r,t){const e=this.cache;e[0]!==t&&(r.uniform1f(this.addr,t),e[0]=t)}function O0(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(r.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Fe(e,t))return;r.uniform2fv(this.addr,t),ke(e,t)}}function B0(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(r.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(r.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Fe(e,t))return;r.uniform3fv(this.addr,t),ke(e,t)}}function H0(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(r.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Fe(e,t))return;r.uniform4fv(this.addr,t),ke(e,t)}}function G0(r,t){const e=this.cache,i=t.elements;if(i===void 0){if(Fe(e,t))return;r.uniformMatrix2fv(this.addr,!1,t),ke(e,t)}else{if(Fe(e,i))return;Cc.set(i),r.uniformMatrix2fv(this.addr,!1,Cc),ke(e,i)}}function V0(r,t){const e=this.cache,i=t.elements;if(i===void 0){if(Fe(e,t))return;r.uniformMatrix3fv(this.addr,!1,t),ke(e,t)}else{if(Fe(e,i))return;Ac.set(i),r.uniformMatrix3fv(this.addr,!1,Ac),ke(e,i)}}function W0(r,t){const e=this.cache,i=t.elements;if(i===void 0){if(Fe(e,t))return;r.uniformMatrix4fv(this.addr,!1,t),ke(e,t)}else{if(Fe(e,i))return;Ec.set(i),r.uniformMatrix4fv(this.addr,!1,Ec),ke(e,i)}}function X0(r,t){const e=this.cache;e[0]!==t&&(r.uniform1i(this.addr,t),e[0]=t)}function q0(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(r.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Fe(e,t))return;r.uniform2iv(this.addr,t),ke(e,t)}}function Y0(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(r.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Fe(e,t))return;r.uniform3iv(this.addr,t),ke(e,t)}}function Z0(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(r.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Fe(e,t))return;r.uniform4iv(this.addr,t),ke(e,t)}}function K0(r,t){const e=this.cache;e[0]!==t&&(r.uniform1ui(this.addr,t),e[0]=t)}function j0(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(r.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Fe(e,t))return;r.uniform2uiv(this.addr,t),ke(e,t)}}function Q0(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(r.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Fe(e,t))return;r.uniform3uiv(this.addr,t),ke(e,t)}}function J0(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(r.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Fe(e,t))return;r.uniform4uiv(this.addr,t),ke(e,t)}}function $0(r,t,e){const i=this.cache,n=e.allocateTextureUnit();i[0]!==n&&(r.uniform1i(this.addr,n),i[0]=n);let s;this.type===r.SAMPLER_2D_SHADOW?(bc.compareFunction=Vh,s=bc):s=eu,e.setTexture2D(t||s,n)}function tm(r,t,e){const i=this.cache,n=e.allocateTextureUnit();i[0]!==n&&(r.uniform1i(this.addr,n),i[0]=n),e.setTexture3D(t||nu,n)}function em(r,t,e){const i=this.cache,n=e.allocateTextureUnit();i[0]!==n&&(r.uniform1i(this.addr,n),i[0]=n),e.setTextureCube(t||su,n)}function im(r,t,e){const i=this.cache,n=e.allocateTextureUnit();i[0]!==n&&(r.uniform1i(this.addr,n),i[0]=n),e.setTexture2DArray(t||iu,n)}function nm(r){switch(r){case 5126:return k0;case 35664:return O0;case 35665:return B0;case 35666:return H0;case 35674:return G0;case 35675:return V0;case 35676:return W0;case 5124:case 35670:return X0;case 35667:case 35671:return q0;case 35668:case 35672:return Y0;case 35669:case 35673:return Z0;case 5125:return K0;case 36294:return j0;case 36295:return Q0;case 36296:return J0;case 35678:case 36198:case 36298:case 36306:case 35682:return $0;case 35679:case 36299:case 36307:return tm;case 35680:case 36300:case 36308:case 36293:return em;case 36289:case 36303:case 36311:case 36292:return im}}function sm(r,t){r.uniform1fv(this.addr,t)}function rm(r,t){const e=As(t,this.size,2);r.uniform2fv(this.addr,e)}function am(r,t){const e=As(t,this.size,3);r.uniform3fv(this.addr,e)}function om(r,t){const e=As(t,this.size,4);r.uniform4fv(this.addr,e)}function lm(r,t){const e=As(t,this.size,4);r.uniformMatrix2fv(this.addr,!1,e)}function cm(r,t){const e=As(t,this.size,9);r.uniformMatrix3fv(this.addr,!1,e)}function hm(r,t){const e=As(t,this.size,16);r.uniformMatrix4fv(this.addr,!1,e)}function um(r,t){r.uniform1iv(this.addr,t)}function fm(r,t){r.uniform2iv(this.addr,t)}function dm(r,t){r.uniform3iv(this.addr,t)}function pm(r,t){r.uniform4iv(this.addr,t)}function mm(r,t){r.uniform1uiv(this.addr,t)}function gm(r,t){r.uniform2uiv(this.addr,t)}function xm(r,t){r.uniform3uiv(this.addr,t)}function vm(r,t){r.uniform4uiv(this.addr,t)}function ym(r,t,e){const i=this.cache,n=t.length,s=ya(e,n);Fe(i,s)||(r.uniform1iv(this.addr,s),ke(i,s));for(let a=0;a!==n;++a)e.setTexture2D(t[a]||eu,s[a])}function Mm(r,t,e){const i=this.cache,n=t.length,s=ya(e,n);Fe(i,s)||(r.uniform1iv(this.addr,s),ke(i,s));for(let a=0;a!==n;++a)e.setTexture3D(t[a]||nu,s[a])}function Sm(r,t,e){const i=this.cache,n=t.length,s=ya(e,n);Fe(i,s)||(r.uniform1iv(this.addr,s),ke(i,s));for(let a=0;a!==n;++a)e.setTextureCube(t[a]||su,s[a])}function wm(r,t,e){const i=this.cache,n=t.length,s=ya(e,n);Fe(i,s)||(r.uniform1iv(this.addr,s),ke(i,s));for(let a=0;a!==n;++a)e.setTexture2DArray(t[a]||iu,s[a])}function bm(r){switch(r){case 5126:return sm;case 35664:return rm;case 35665:return am;case 35666:return om;case 35674:return lm;case 35675:return cm;case 35676:return hm;case 5124:case 35670:return um;case 35667:case 35671:return fm;case 35668:case 35672:return dm;case 35669:case 35673:return pm;case 5125:return mm;case 36294:return gm;case 36295:return xm;case 36296:return vm;case 35678:case 36198:case 36298:case 36306:case 35682:return ym;case 35679:case 36299:case 36307:return Mm;case 35680:case 36300:case 36308:case 36293:return Sm;case 36289:case 36303:case 36311:case 36292:return wm}}class _m{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=nm(e.type)}}class Tm{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=bm(e.type)}}class Em{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const n=this.seq;for(let s=0,a=n.length;s!==a;++s){const o=n[s];o.setValue(t,e[o.id],i)}}}const Ja=/(\w+)(\])?(\[|\.)?/g;function Rc(r,t){r.seq.push(t),r.map[t.id]=t}function Am(r,t,e){const i=r.name,n=i.length;for(Ja.lastIndex=0;;){const s=Ja.exec(i),a=Ja.lastIndex;let o=s[1];const l=s[2]==="]",c=s[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===n){Rc(e,c===void 0?new _m(o,r,t):new Tm(o,r,t));break}else{let u=e.map[o];u===void 0&&(u=new Em(o),Rc(e,u)),e=u}}}class ra{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let n=0;n<i;++n){const s=t.getActiveUniform(e,n),a=t.getUniformLocation(e,s.name);Am(s,a,this)}}setValue(t,e,i,n){const s=this.map[e];s!==void 0&&s.setValue(t,i,n)}setOptional(t,e,i){const n=e[i];n!==void 0&&this.setValue(t,i,n)}static upload(t,e,i,n){for(let s=0,a=e.length;s!==a;++s){const o=e[s],l=i[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,n)}}static seqWithValue(t,e){const i=[];for(let n=0,s=t.length;n!==s;++n){const a=t[n];a.id in e&&i.push(a)}return i}}function Pc(r,t,e){const i=r.createShader(t);return r.shaderSource(i,e),r.compileShader(i),i}const Cm=37297;let Rm=0;function Pm(r,t){const e=r.split(`
`),i=[],n=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let a=n;a<s;a++){const o=a+1;i.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return i.join(`
`)}const Dc=new Kt;function Dm(r){re._getMatrix(Dc,re.workingColorSpace,r);const t=`mat3( ${Dc.elements.map(e=>e.toFixed(4))} )`;switch(re.getTransfer(r)){case xa:return[t,"LinearTransferOETF"];case xe:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",r),[t,"LinearTransferOETF"]}}function Lc(r,t,e){const i=r.getShaderParameter(t,r.COMPILE_STATUS),n=r.getShaderInfoLog(t).trim();if(i&&n==="")return"";const s=/ERROR: 0:(\d+)/.exec(n);if(s){const a=parseInt(s[1]);return e.toUpperCase()+`

`+n+`

`+Pm(r.getShaderSource(t),a)}else return n}function Lm(r,t){const e=Dm(t);return[`vec4 ${r}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function zm(r,t){let e;switch(t){case Ah:e="Linear";break;case Ch:e="Reinhard";break;case Rh:e="Cineon";break;case dl:e="ACESFilmic";break;case Ph:e="AgX";break;case Dh:e="Neutral";break;case nf:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+r+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Ir=new D;function Im(){re.getLuminanceCoefficients(Ir);const r=Ir.x.toFixed(4),t=Ir.y.toFixed(4),e=Ir.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${r}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Um(r){return[r.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",r.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(qs).join(`
`)}function Nm(r){const t=[];for(const e in r){const i=r[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function Fm(r,t){const e={},i=r.getProgramParameter(t,r.ACTIVE_ATTRIBUTES);for(let n=0;n<i;n++){const s=r.getActiveAttrib(t,n),a=s.name;let o=1;s.type===r.FLOAT_MAT2&&(o=2),s.type===r.FLOAT_MAT3&&(o=3),s.type===r.FLOAT_MAT4&&(o=4),e[a]={type:s.type,location:r.getAttribLocation(t,a),locationSize:o}}return e}function qs(r){return r!==""}function zc(r,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return r.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Ic(r,t){return r.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const km=/^[ \t]*#include +<([\w\d./]+)>/gm;function sl(r){return r.replace(km,Bm)}const Om=new Map;function Bm(r,t){let e=$t[t];if(e===void 0){const i=Om.get(t);if(i!==void 0)e=$t[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return sl(e)}const Hm=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Uc(r){return r.replace(Hm,Gm)}function Gm(r,t,e,i){let n="";for(let s=parseInt(t);s<parseInt(e);s++)n+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return n}function Nc(r){let t=`precision ${r.precision} float;
	precision ${r.precision} int;
	precision ${r.precision} sampler2D;
	precision ${r.precision} samplerCube;
	precision ${r.precision} sampler3D;
	precision ${r.precision} sampler2DArray;
	precision ${r.precision} sampler2DShadow;
	precision ${r.precision} samplerCubeShadow;
	precision ${r.precision} sampler2DArrayShadow;
	precision ${r.precision} isampler2D;
	precision ${r.precision} isampler3D;
	precision ${r.precision} isamplerCube;
	precision ${r.precision} isampler2DArray;
	precision ${r.precision} usampler2D;
	precision ${r.precision} usampler3D;
	precision ${r.precision} usamplerCube;
	precision ${r.precision} usampler2DArray;
	`;return r.precision==="highp"?t+=`
#define HIGH_PRECISION`:r.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:r.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function Vm(r){let t="SHADOWMAP_TYPE_BASIC";return r.shadowMapType===_h?t="SHADOWMAP_TYPE_PCF":r.shadowMapType===Th?t="SHADOWMAP_TYPE_PCF_SOFT":r.shadowMapType===qi&&(t="SHADOWMAP_TYPE_VSM"),t}function Wm(r){let t="ENVMAP_TYPE_CUBE";if(r.envMap)switch(r.envMapMode){case vs:case ys:t="ENVMAP_TYPE_CUBE";break;case ma:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Xm(r){let t="ENVMAP_MODE_REFLECTION";if(r.envMap)switch(r.envMapMode){case ys:t="ENVMAP_MODE_REFRACTION";break}return t}function qm(r){let t="ENVMAP_BLENDING_NONE";if(r.envMap)switch(r.combine){case Eh:t="ENVMAP_BLENDING_MULTIPLY";break;case tf:t="ENVMAP_BLENDING_MIX";break;case ef:t="ENVMAP_BLENDING_ADD";break}return t}function Ym(r){const t=r.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:i,maxMip:e}}function Zm(r,t,e,i){const n=r.getContext(),s=e.defines;let a=e.vertexShader,o=e.fragmentShader;const l=Vm(e),c=Wm(e),h=Xm(e),u=qm(e),f=Ym(e),d=Um(e),g=Nm(s),x=n.createProgram();let p,m,y=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(qs).join(`
`),p.length>0&&(p+=`
`),m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(qs).join(`
`),m.length>0&&(m+=`
`)):(p=[Nc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(qs).join(`
`),m=[Nc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==mn?"#define TONE_MAPPING":"",e.toneMapping!==mn?$t.tonemapping_pars_fragment:"",e.toneMapping!==mn?zm("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",$t.colorspace_pars_fragment,Lm("linearToOutputTexel",e.outputColorSpace),Im(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(qs).join(`
`)),a=sl(a),a=zc(a,e),a=Ic(a,e),o=sl(o),o=zc(o,e),o=Ic(o,e),a=Uc(a),o=Uc(o),e.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,p=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,m=["#define varying in",e.glslVersion===Kl?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Kl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const M=y+p+a,v=y+m+o,b=Pc(n,n.VERTEX_SHADER,M),_=Pc(n,n.FRAGMENT_SHADER,v);n.attachShader(x,b),n.attachShader(x,_),e.index0AttributeName!==void 0?n.bindAttribLocation(x,0,e.index0AttributeName):e.morphTargets===!0&&n.bindAttribLocation(x,0,"position"),n.linkProgram(x);function T(P){if(r.debug.checkShaderErrors){const z=n.getProgramInfoLog(x).trim(),I=n.getShaderInfoLog(b).trim(),U=n.getShaderInfoLog(_).trim();let X=!0,q=!0;if(n.getProgramParameter(x,n.LINK_STATUS)===!1)if(X=!1,typeof r.debug.onShaderError=="function")r.debug.onShaderError(n,x,b,_);else{const $=Lc(n,b,"vertex"),B=Lc(n,_,"fragment");console.error("THREE.WebGLProgram: Shader Error "+n.getError()+" - VALIDATE_STATUS "+n.getProgramParameter(x,n.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+z+`
`+$+`
`+B)}else z!==""?console.warn("THREE.WebGLProgram: Program Info Log:",z):(I===""||U==="")&&(q=!1);q&&(P.diagnostics={runnable:X,programLog:z,vertexShader:{log:I,prefix:p},fragmentShader:{log:U,prefix:m}})}n.deleteShader(b),n.deleteShader(_),C=new ra(n,x),w=Fm(n,x)}let C;this.getUniforms=function(){return C===void 0&&T(this),C};let w;this.getAttributes=function(){return w===void 0&&T(this),w};let S=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return S===!1&&(S=n.getProgramParameter(x,Cm)),S},this.destroy=function(){i.releaseStatesOfProgram(this),n.deleteProgram(x),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Rm++,this.cacheKey=t,this.usedTimes=1,this.program=x,this.vertexShader=b,this.fragmentShader=_,this}let Km=0;class jm{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,i=t.fragmentShader,n=this._getShaderStage(e),s=this._getShaderStage(i),a=this._getShaderCacheForMaterial(t);return a.has(n)===!1&&(a.add(n),n.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new Qm(t),e.set(t,i)),i}}class Qm{constructor(t){this.id=Km++,this.code=t,this.usedTimes=0}}function Jm(r,t,e,i,n,s,a){const o=new Yh,l=new jm,c=new Set,h=[],u=n.logarithmicDepthBuffer,f=n.vertexTextures;let d=n.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(w){return c.add(w),w===0?"uv":`uv${w}`}function p(w,S,P,z,I){const U=z.fog,X=I.geometry,q=w.isMeshStandardMaterial?z.environment:null,$=(w.isMeshStandardMaterial?e:t).get(w.envMap||q),B=$&&$.mapping===ma?$.image.height:null,ft=g[w.type];w.precision!==null&&(d=n.getMaxPrecision(w.precision),d!==w.precision&&console.warn("THREE.WebGLProgram.getParameters:",w.precision,"not supported, using",d,"instead."));const dt=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,xt=dt!==void 0?dt.length:0;let Gt=0;X.morphAttributes.position!==void 0&&(Gt=1),X.morphAttributes.normal!==void 0&&(Gt=2),X.morphAttributes.color!==void 0&&(Gt=3);let tt,O,J,ht;if(ft){const ge=Ri[ft];tt=ge.vertexShader,O=ge.fragmentShader}else tt=w.vertexShader,O=w.fragmentShader,l.update(w),J=l.getVertexShaderID(w),ht=l.getFragmentShaderID(w);const st=r.getRenderTarget(),Pt=r.state.buffers.depth.getReversed(),kt=I.isInstancedMesh===!0,ot=I.isBatchedMesh===!0,mt=!!w.map,Z=!!w.matcap,at=!!$,L=!!w.aoMap,At=!!w.lightMap,rt=!!w.bumpMap,vt=!!w.normalMap,ct=!!w.displacementMap,Ot=!!w.emissiveMap,_t=!!w.metalnessMap,R=!!w.roughnessMap,E=w.anisotropy>0,H=w.clearcoat>0,K=w.dispersion>0,nt=w.iridescence>0,Q=w.sheen>0,Lt=w.transmission>0,gt=E&&!!w.anisotropyMap,Tt=H&&!!w.clearcoatMap,ee=H&&!!w.clearcoatNormalMap,lt=H&&!!w.clearcoatRoughnessMap,Ct=nt&&!!w.iridescenceMap,Bt=nt&&!!w.iridescenceThicknessMap,Wt=Q&&!!w.sheenColorMap,Rt=Q&&!!w.sheenRoughnessMap,ne=!!w.specularMap,Qt=!!w.specularColorMap,Me=!!w.specularIntensityMap,N=Lt&&!!w.transmissionMap,yt=Lt&&!!w.thicknessMap,Y=!!w.gradientMap,et=!!w.alphaMap,wt=w.alphaTest>0,Mt=!!w.alphaHash,qt=!!w.extensions;let Re=mn;w.toneMapped&&(st===null||st.isXRRenderTarget===!0)&&(Re=r.toneMapping);const We={shaderID:ft,shaderType:w.type,shaderName:w.name,vertexShader:tt,fragmentShader:O,defines:w.defines,customVertexShaderID:J,customFragmentShaderID:ht,isRawShaderMaterial:w.isRawShaderMaterial===!0,glslVersion:w.glslVersion,precision:d,batching:ot,batchingColor:ot&&I._colorsTexture!==null,instancing:kt,instancingColor:kt&&I.instanceColor!==null,instancingMorph:kt&&I.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:st===null?r.outputColorSpace:st.isXRRenderTarget===!0?st.texture.colorSpace:_s,alphaToCoverage:!!w.alphaToCoverage,map:mt,matcap:Z,envMap:at,envMapMode:at&&$.mapping,envMapCubeUVHeight:B,aoMap:L,lightMap:At,bumpMap:rt,normalMap:vt,displacementMap:f&&ct,emissiveMap:Ot,normalMapObjectSpace:vt&&w.normalMapType===of,normalMapTangentSpace:vt&&w.normalMapType===Gh,metalnessMap:_t,roughnessMap:R,anisotropy:E,anisotropyMap:gt,clearcoat:H,clearcoatMap:Tt,clearcoatNormalMap:ee,clearcoatRoughnessMap:lt,dispersion:K,iridescence:nt,iridescenceMap:Ct,iridescenceThicknessMap:Bt,sheen:Q,sheenColorMap:Wt,sheenRoughnessMap:Rt,specularMap:ne,specularColorMap:Qt,specularIntensityMap:Me,transmission:Lt,transmissionMap:N,thicknessMap:yt,gradientMap:Y,opaque:w.transparent===!1&&w.blending===Un&&w.alphaToCoverage===!1,alphaMap:et,alphaTest:wt,alphaHash:Mt,combine:w.combine,mapUv:mt&&x(w.map.channel),aoMapUv:L&&x(w.aoMap.channel),lightMapUv:At&&x(w.lightMap.channel),bumpMapUv:rt&&x(w.bumpMap.channel),normalMapUv:vt&&x(w.normalMap.channel),displacementMapUv:ct&&x(w.displacementMap.channel),emissiveMapUv:Ot&&x(w.emissiveMap.channel),metalnessMapUv:_t&&x(w.metalnessMap.channel),roughnessMapUv:R&&x(w.roughnessMap.channel),anisotropyMapUv:gt&&x(w.anisotropyMap.channel),clearcoatMapUv:Tt&&x(w.clearcoatMap.channel),clearcoatNormalMapUv:ee&&x(w.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:lt&&x(w.clearcoatRoughnessMap.channel),iridescenceMapUv:Ct&&x(w.iridescenceMap.channel),iridescenceThicknessMapUv:Bt&&x(w.iridescenceThicknessMap.channel),sheenColorMapUv:Wt&&x(w.sheenColorMap.channel),sheenRoughnessMapUv:Rt&&x(w.sheenRoughnessMap.channel),specularMapUv:ne&&x(w.specularMap.channel),specularColorMapUv:Qt&&x(w.specularColorMap.channel),specularIntensityMapUv:Me&&x(w.specularIntensityMap.channel),transmissionMapUv:N&&x(w.transmissionMap.channel),thicknessMapUv:yt&&x(w.thicknessMap.channel),alphaMapUv:et&&x(w.alphaMap.channel),vertexTangents:!!X.attributes.tangent&&(vt||E),vertexColors:w.vertexColors,vertexAlphas:w.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,pointsUvs:I.isPoints===!0&&!!X.attributes.uv&&(mt||et),fog:!!U,useFog:w.fog===!0,fogExp2:!!U&&U.isFogExp2,flatShading:w.flatShading===!0,sizeAttenuation:w.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:Pt,skinning:I.isSkinnedMesh===!0,morphTargets:X.morphAttributes.position!==void 0,morphNormals:X.morphAttributes.normal!==void 0,morphColors:X.morphAttributes.color!==void 0,morphTargetsCount:xt,morphTextureStride:Gt,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:w.dithering,shadowMapEnabled:r.shadowMap.enabled&&P.length>0,shadowMapType:r.shadowMap.type,toneMapping:Re,decodeVideoTexture:mt&&w.map.isVideoTexture===!0&&re.getTransfer(w.map.colorSpace)===xe,decodeVideoTextureEmissive:Ot&&w.emissiveMap.isVideoTexture===!0&&re.getTransfer(w.emissiveMap.colorSpace)===xe,premultipliedAlpha:w.premultipliedAlpha,doubleSided:w.side===Ve,flipSided:w.side===$e,useDepthPacking:w.depthPacking>=0,depthPacking:w.depthPacking||0,index0AttributeName:w.index0AttributeName,extensionClipCullDistance:qt&&w.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(qt&&w.extensions.multiDraw===!0||ot)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:w.customProgramCacheKey()};return We.vertexUv1s=c.has(1),We.vertexUv2s=c.has(2),We.vertexUv3s=c.has(3),c.clear(),We}function m(w){const S=[];if(w.shaderID?S.push(w.shaderID):(S.push(w.customVertexShaderID),S.push(w.customFragmentShaderID)),w.defines!==void 0)for(const P in w.defines)S.push(P),S.push(w.defines[P]);return w.isRawShaderMaterial===!1&&(y(S,w),M(S,w),S.push(r.outputColorSpace)),S.push(w.customProgramCacheKey),S.join()}function y(w,S){w.push(S.precision),w.push(S.outputColorSpace),w.push(S.envMapMode),w.push(S.envMapCubeUVHeight),w.push(S.mapUv),w.push(S.alphaMapUv),w.push(S.lightMapUv),w.push(S.aoMapUv),w.push(S.bumpMapUv),w.push(S.normalMapUv),w.push(S.displacementMapUv),w.push(S.emissiveMapUv),w.push(S.metalnessMapUv),w.push(S.roughnessMapUv),w.push(S.anisotropyMapUv),w.push(S.clearcoatMapUv),w.push(S.clearcoatNormalMapUv),w.push(S.clearcoatRoughnessMapUv),w.push(S.iridescenceMapUv),w.push(S.iridescenceThicknessMapUv),w.push(S.sheenColorMapUv),w.push(S.sheenRoughnessMapUv),w.push(S.specularMapUv),w.push(S.specularColorMapUv),w.push(S.specularIntensityMapUv),w.push(S.transmissionMapUv),w.push(S.thicknessMapUv),w.push(S.combine),w.push(S.fogExp2),w.push(S.sizeAttenuation),w.push(S.morphTargetsCount),w.push(S.morphAttributeCount),w.push(S.numDirLights),w.push(S.numPointLights),w.push(S.numSpotLights),w.push(S.numSpotLightMaps),w.push(S.numHemiLights),w.push(S.numRectAreaLights),w.push(S.numDirLightShadows),w.push(S.numPointLightShadows),w.push(S.numSpotLightShadows),w.push(S.numSpotLightShadowsWithMaps),w.push(S.numLightProbes),w.push(S.shadowMapType),w.push(S.toneMapping),w.push(S.numClippingPlanes),w.push(S.numClipIntersection),w.push(S.depthPacking)}function M(w,S){o.disableAll(),S.supportsVertexTextures&&o.enable(0),S.instancing&&o.enable(1),S.instancingColor&&o.enable(2),S.instancingMorph&&o.enable(3),S.matcap&&o.enable(4),S.envMap&&o.enable(5),S.normalMapObjectSpace&&o.enable(6),S.normalMapTangentSpace&&o.enable(7),S.clearcoat&&o.enable(8),S.iridescence&&o.enable(9),S.alphaTest&&o.enable(10),S.vertexColors&&o.enable(11),S.vertexAlphas&&o.enable(12),S.vertexUv1s&&o.enable(13),S.vertexUv2s&&o.enable(14),S.vertexUv3s&&o.enable(15),S.vertexTangents&&o.enable(16),S.anisotropy&&o.enable(17),S.alphaHash&&o.enable(18),S.batching&&o.enable(19),S.dispersion&&o.enable(20),S.batchingColor&&o.enable(21),w.push(o.mask),o.disableAll(),S.fog&&o.enable(0),S.useFog&&o.enable(1),S.flatShading&&o.enable(2),S.logarithmicDepthBuffer&&o.enable(3),S.reverseDepthBuffer&&o.enable(4),S.skinning&&o.enable(5),S.morphTargets&&o.enable(6),S.morphNormals&&o.enable(7),S.morphColors&&o.enable(8),S.premultipliedAlpha&&o.enable(9),S.shadowMapEnabled&&o.enable(10),S.doubleSided&&o.enable(11),S.flipSided&&o.enable(12),S.useDepthPacking&&o.enable(13),S.dithering&&o.enable(14),S.transmission&&o.enable(15),S.sheen&&o.enable(16),S.opaque&&o.enable(17),S.pointsUvs&&o.enable(18),S.decodeVideoTexture&&o.enable(19),S.decodeVideoTextureEmissive&&o.enable(20),S.alphaToCoverage&&o.enable(21),w.push(o.mask)}function v(w){const S=g[w.type];let P;if(S){const z=Ri[S];P=er.clone(z.uniforms)}else P=w.uniforms;return P}function b(w,S){let P;for(let z=0,I=h.length;z<I;z++){const U=h[z];if(U.cacheKey===S){P=U,++P.usedTimes;break}}return P===void 0&&(P=new Zm(r,S,w,s),h.push(P)),P}function _(w){if(--w.usedTimes===0){const S=h.indexOf(w);h[S]=h[h.length-1],h.pop(),w.destroy()}}function T(w){l.remove(w)}function C(){l.dispose()}return{getParameters:p,getProgramCacheKey:m,getUniforms:v,acquireProgram:b,releaseProgram:_,releaseShaderCache:T,programs:h,dispose:C}}function $m(){let r=new WeakMap;function t(a){return r.has(a)}function e(a){let o=r.get(a);return o===void 0&&(o={},r.set(a,o)),o}function i(a){r.delete(a)}function n(a,o,l){r.get(a)[o]=l}function s(){r=new WeakMap}return{has:t,get:e,remove:i,update:n,dispose:s}}function tg(r,t){return r.groupOrder!==t.groupOrder?r.groupOrder-t.groupOrder:r.renderOrder!==t.renderOrder?r.renderOrder-t.renderOrder:r.material.id!==t.material.id?r.material.id-t.material.id:r.z!==t.z?r.z-t.z:r.id-t.id}function Fc(r,t){return r.groupOrder!==t.groupOrder?r.groupOrder-t.groupOrder:r.renderOrder!==t.renderOrder?r.renderOrder-t.renderOrder:r.z!==t.z?t.z-r.z:r.id-t.id}function kc(){const r=[];let t=0;const e=[],i=[],n=[];function s(){t=0,e.length=0,i.length=0,n.length=0}function a(u,f,d,g,x,p){let m=r[t];return m===void 0?(m={id:u.id,object:u,geometry:f,material:d,groupOrder:g,renderOrder:u.renderOrder,z:x,group:p},r[t]=m):(m.id=u.id,m.object=u,m.geometry=f,m.material=d,m.groupOrder=g,m.renderOrder=u.renderOrder,m.z=x,m.group=p),t++,m}function o(u,f,d,g,x,p){const m=a(u,f,d,g,x,p);d.transmission>0?i.push(m):d.transparent===!0?n.push(m):e.push(m)}function l(u,f,d,g,x,p){const m=a(u,f,d,g,x,p);d.transmission>0?i.unshift(m):d.transparent===!0?n.unshift(m):e.unshift(m)}function c(u,f){e.length>1&&e.sort(u||tg),i.length>1&&i.sort(f||Fc),n.length>1&&n.sort(f||Fc)}function h(){for(let u=t,f=r.length;u<f;u++){const d=r[u];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:e,transmissive:i,transparent:n,init:s,push:o,unshift:l,finish:h,sort:c}}function eg(){let r=new WeakMap;function t(i,n){const s=r.get(i);let a;return s===void 0?(a=new kc,r.set(i,[a])):n>=s.length?(a=new kc,s.push(a)):a=s[n],a}function e(){r=new WeakMap}return{get:t,dispose:e}}function ig(){const r={};return{get:function(t){if(r[t.id]!==void 0)return r[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new D,color:new j};break;case"SpotLight":e={position:new D,direction:new D,color:new j,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new D,color:new j,distance:0,decay:0};break;case"HemisphereLight":e={direction:new D,skyColor:new j,groundColor:new j};break;case"RectAreaLight":e={color:new j,position:new D,halfWidth:new D,halfHeight:new D};break}return r[t.id]=e,e}}}function ng(){const r={};return{get:function(t){if(r[t.id]!==void 0)return r[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new it};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new it};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new it,shadowCameraNear:1,shadowCameraFar:1e3};break}return r[t.id]=e,e}}}let sg=0;function rg(r,t){return(t.castShadow?2:0)-(r.castShadow?2:0)+(t.map?1:0)-(r.map?1:0)}function ag(r){const t=new ig,e=ng(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new D);const n=new D,s=new Vt,a=new Vt;function o(c){let h=0,u=0,f=0;for(let w=0;w<9;w++)i.probe[w].set(0,0,0);let d=0,g=0,x=0,p=0,m=0,y=0,M=0,v=0,b=0,_=0,T=0;c.sort(rg);for(let w=0,S=c.length;w<S;w++){const P=c[w],z=P.color,I=P.intensity,U=P.distance,X=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)h+=z.r*I,u+=z.g*I,f+=z.b*I;else if(P.isLightProbe){for(let q=0;q<9;q++)i.probe[q].addScaledVector(P.sh.coefficients[q],I);T++}else if(P.isDirectionalLight){const q=t.get(P);if(q.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const $=P.shadow,B=e.get(P);B.shadowIntensity=$.intensity,B.shadowBias=$.bias,B.shadowNormalBias=$.normalBias,B.shadowRadius=$.radius,B.shadowMapSize=$.mapSize,i.directionalShadow[d]=B,i.directionalShadowMap[d]=X,i.directionalShadowMatrix[d]=P.shadow.matrix,y++}i.directional[d]=q,d++}else if(P.isSpotLight){const q=t.get(P);q.position.setFromMatrixPosition(P.matrixWorld),q.color.copy(z).multiplyScalar(I),q.distance=U,q.coneCos=Math.cos(P.angle),q.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),q.decay=P.decay,i.spot[x]=q;const $=P.shadow;if(P.map&&(i.spotLightMap[b]=P.map,b++,$.updateMatrices(P),P.castShadow&&_++),i.spotLightMatrix[x]=$.matrix,P.castShadow){const B=e.get(P);B.shadowIntensity=$.intensity,B.shadowBias=$.bias,B.shadowNormalBias=$.normalBias,B.shadowRadius=$.radius,B.shadowMapSize=$.mapSize,i.spotShadow[x]=B,i.spotShadowMap[x]=X,v++}x++}else if(P.isRectAreaLight){const q=t.get(P);q.color.copy(z).multiplyScalar(I),q.halfWidth.set(P.width*.5,0,0),q.halfHeight.set(0,P.height*.5,0),i.rectArea[p]=q,p++}else if(P.isPointLight){const q=t.get(P);if(q.color.copy(P.color).multiplyScalar(P.intensity),q.distance=P.distance,q.decay=P.decay,P.castShadow){const $=P.shadow,B=e.get(P);B.shadowIntensity=$.intensity,B.shadowBias=$.bias,B.shadowNormalBias=$.normalBias,B.shadowRadius=$.radius,B.shadowMapSize=$.mapSize,B.shadowCameraNear=$.camera.near,B.shadowCameraFar=$.camera.far,i.pointShadow[g]=B,i.pointShadowMap[g]=X,i.pointShadowMatrix[g]=P.shadow.matrix,M++}i.point[g]=q,g++}else if(P.isHemisphereLight){const q=t.get(P);q.skyColor.copy(P.color).multiplyScalar(I),q.groundColor.copy(P.groundColor).multiplyScalar(I),i.hemi[m]=q,m++}}p>0&&(r.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=pt.LTC_FLOAT_1,i.rectAreaLTC2=pt.LTC_FLOAT_2):(i.rectAreaLTC1=pt.LTC_HALF_1,i.rectAreaLTC2=pt.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=u,i.ambient[2]=f;const C=i.hash;(C.directionalLength!==d||C.pointLength!==g||C.spotLength!==x||C.rectAreaLength!==p||C.hemiLength!==m||C.numDirectionalShadows!==y||C.numPointShadows!==M||C.numSpotShadows!==v||C.numSpotMaps!==b||C.numLightProbes!==T)&&(i.directional.length=d,i.spot.length=x,i.rectArea.length=p,i.point.length=g,i.hemi.length=m,i.directionalShadow.length=y,i.directionalShadowMap.length=y,i.pointShadow.length=M,i.pointShadowMap.length=M,i.spotShadow.length=v,i.spotShadowMap.length=v,i.directionalShadowMatrix.length=y,i.pointShadowMatrix.length=M,i.spotLightMatrix.length=v+b-_,i.spotLightMap.length=b,i.numSpotLightShadowsWithMaps=_,i.numLightProbes=T,C.directionalLength=d,C.pointLength=g,C.spotLength=x,C.rectAreaLength=p,C.hemiLength=m,C.numDirectionalShadows=y,C.numPointShadows=M,C.numSpotShadows=v,C.numSpotMaps=b,C.numLightProbes=T,i.version=sg++)}function l(c,h){let u=0,f=0,d=0,g=0,x=0;const p=h.matrixWorldInverse;for(let m=0,y=c.length;m<y;m++){const M=c[m];if(M.isDirectionalLight){const v=i.directional[u];v.direction.setFromMatrixPosition(M.matrixWorld),n.setFromMatrixPosition(M.target.matrixWorld),v.direction.sub(n),v.direction.transformDirection(p),u++}else if(M.isSpotLight){const v=i.spot[d];v.position.setFromMatrixPosition(M.matrixWorld),v.position.applyMatrix4(p),v.direction.setFromMatrixPosition(M.matrixWorld),n.setFromMatrixPosition(M.target.matrixWorld),v.direction.sub(n),v.direction.transformDirection(p),d++}else if(M.isRectAreaLight){const v=i.rectArea[g];v.position.setFromMatrixPosition(M.matrixWorld),v.position.applyMatrix4(p),a.identity(),s.copy(M.matrixWorld),s.premultiply(p),a.extractRotation(s),v.halfWidth.set(M.width*.5,0,0),v.halfHeight.set(0,M.height*.5,0),v.halfWidth.applyMatrix4(a),v.halfHeight.applyMatrix4(a),g++}else if(M.isPointLight){const v=i.point[f];v.position.setFromMatrixPosition(M.matrixWorld),v.position.applyMatrix4(p),f++}else if(M.isHemisphereLight){const v=i.hemi[x];v.direction.setFromMatrixPosition(M.matrixWorld),v.direction.transformDirection(p),x++}}}return{setup:o,setupView:l,state:i}}function Oc(r){const t=new ag(r),e=[],i=[];function n(h){c.camera=h,e.length=0,i.length=0}function s(h){e.push(h)}function a(h){i.push(h)}function o(){t.setup(e)}function l(h){t.setupView(e,h)}const c={lightsArray:e,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:n,state:c,setupLights:o,setupLightsView:l,pushLight:s,pushShadow:a}}function og(r){let t=new WeakMap;function e(n,s=0){const a=t.get(n);let o;return a===void 0?(o=new Oc(r),t.set(n,[o])):s>=a.length?(o=new Oc(r),a.push(o)):o=a[s],o}function i(){t=new WeakMap}return{get:e,dispose:i}}class lg extends Hn{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=rf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class cg extends Hn{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const hg=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,ug=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function fg(r,t,e){let i=new Ml;const n=new it,s=new it,a=new ye,o=new lg({depthPacking:af}),l=new cg,c={},h=e.maxTextureSize,u={[vn]:$e,[$e]:vn,[Ve]:Ve},f=new ve({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new it},radius:{value:4}},vertexShader:hg,fragmentShader:ug}),d=f.clone();d.defines.HORIZONTAL_PASS=1;const g=new we;g.setAttribute("position",new Pe(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new G(g,f),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=_h;let m=this.type;this.render=function(_,T,C){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||_.length===0)return;const w=r.getRenderTarget(),S=r.getActiveCubeFace(),P=r.getActiveMipmapLevel(),z=r.state;z.setBlending(Qi),z.buffers.color.setClear(1,1,1,1),z.buffers.depth.setTest(!0),z.setScissorTest(!1);const I=m!==qi&&this.type===qi,U=m===qi&&this.type!==qi;for(let X=0,q=_.length;X<q;X++){const $=_[X],B=$.shadow;if(B===void 0){console.warn("THREE.WebGLShadowMap:",$,"has no shadow.");continue}if(B.autoUpdate===!1&&B.needsUpdate===!1)continue;n.copy(B.mapSize);const ft=B.getFrameExtents();if(n.multiply(ft),s.copy(B.mapSize),(n.x>h||n.y>h)&&(n.x>h&&(s.x=Math.floor(h/ft.x),n.x=s.x*ft.x,B.mapSize.x=s.x),n.y>h&&(s.y=Math.floor(h/ft.y),n.y=s.y*ft.y,B.mapSize.y=s.y)),B.map===null||I===!0||U===!0){const xt=this.type!==qi?{minFilter:Te,magFilter:Te}:{};B.map!==null&&B.map.dispose(),B.map=new ze(n.x,n.y,xt),B.map.texture.name=$.name+".shadowMap",B.camera.updateProjectionMatrix()}r.setRenderTarget(B.map),r.clear();const dt=B.getViewportCount();for(let xt=0;xt<dt;xt++){const Gt=B.getViewport(xt);a.set(s.x*Gt.x,s.y*Gt.y,s.x*Gt.z,s.y*Gt.w),z.viewport(a),B.updateMatrices($,xt),i=B.getFrustum(),v(T,C,B.camera,$,this.type)}B.isPointLightShadow!==!0&&this.type===qi&&y(B,C),B.needsUpdate=!1}m=this.type,p.needsUpdate=!1,r.setRenderTarget(w,S,P)};function y(_,T){const C=t.update(x);f.defines.VSM_SAMPLES!==_.blurSamples&&(f.defines.VSM_SAMPLES=_.blurSamples,d.defines.VSM_SAMPLES=_.blurSamples,f.needsUpdate=!0,d.needsUpdate=!0),_.mapPass===null&&(_.mapPass=new ze(n.x,n.y)),f.uniforms.shadow_pass.value=_.map.texture,f.uniforms.resolution.value=_.mapSize,f.uniforms.radius.value=_.radius,r.setRenderTarget(_.mapPass),r.clear(),r.renderBufferDirect(T,null,C,f,x,null),d.uniforms.shadow_pass.value=_.mapPass.texture,d.uniforms.resolution.value=_.mapSize,d.uniforms.radius.value=_.radius,r.setRenderTarget(_.map),r.clear(),r.renderBufferDirect(T,null,C,d,x,null)}function M(_,T,C,w){let S=null;const P=C.isPointLight===!0?_.customDistanceMaterial:_.customDepthMaterial;if(P!==void 0)S=P;else if(S=C.isPointLight===!0?l:o,r.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0){const z=S.uuid,I=T.uuid;let U=c[z];U===void 0&&(U={},c[z]=U);let X=U[I];X===void 0&&(X=S.clone(),U[I]=X,T.addEventListener("dispose",b)),S=X}if(S.visible=T.visible,S.wireframe=T.wireframe,w===qi?S.side=T.shadowSide!==null?T.shadowSide:T.side:S.side=T.shadowSide!==null?T.shadowSide:u[T.side],S.alphaMap=T.alphaMap,S.alphaTest=T.alphaTest,S.map=T.map,S.clipShadows=T.clipShadows,S.clippingPlanes=T.clippingPlanes,S.clipIntersection=T.clipIntersection,S.displacementMap=T.displacementMap,S.displacementScale=T.displacementScale,S.displacementBias=T.displacementBias,S.wireframeLinewidth=T.wireframeLinewidth,S.linewidth=T.linewidth,C.isPointLight===!0&&S.isMeshDistanceMaterial===!0){const z=r.properties.get(S);z.light=C}return S}function v(_,T,C,w,S){if(_.visible===!1)return;if(_.layers.test(T.layers)&&(_.isMesh||_.isLine||_.isPoints)&&(_.castShadow||_.receiveShadow&&S===qi)&&(!_.frustumCulled||i.intersectsObject(_))){_.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,_.matrixWorld);const I=t.update(_),U=_.material;if(Array.isArray(U)){const X=I.groups;for(let q=0,$=X.length;q<$;q++){const B=X[q],ft=U[B.materialIndex];if(ft&&ft.visible){const dt=M(_,ft,w,S);_.onBeforeShadow(r,_,T,C,I,dt,B),r.renderBufferDirect(C,null,I,dt,_,B),_.onAfterShadow(r,_,T,C,I,dt,B)}}}else if(U.visible){const X=M(_,U,w,S);_.onBeforeShadow(r,_,T,C,I,X,null),r.renderBufferDirect(C,null,I,X,_,null),_.onAfterShadow(r,_,T,C,I,X,null)}}const z=_.children;for(let I=0,U=z.length;I<U;I++)v(z[I],T,C,w,S)}function b(_){_.target.removeEventListener("dispose",b);for(const C in c){const w=c[C],S=_.target.uuid;S in w&&(w[S].dispose(),delete w[S])}}}const dg={[wo]:bo,[_o]:Ao,[To]:Co,[xs]:Eo,[bo]:wo,[Ao]:_o,[Co]:To,[Eo]:xs};function pg(r,t){function e(){let N=!1;const yt=new ye;let Y=null;const et=new ye(0,0,0,0);return{setMask:function(wt){Y!==wt&&!N&&(r.colorMask(wt,wt,wt,wt),Y=wt)},setLocked:function(wt){N=wt},setClear:function(wt,Mt,qt,Re,We){We===!0&&(wt*=Re,Mt*=Re,qt*=Re),yt.set(wt,Mt,qt,Re),et.equals(yt)===!1&&(r.clearColor(wt,Mt,qt,Re),et.copy(yt))},reset:function(){N=!1,Y=null,et.set(-1,0,0,0)}}}function i(){let N=!1,yt=!1,Y=null,et=null,wt=null;return{setReversed:function(Mt){if(yt!==Mt){const qt=t.get("EXT_clip_control");yt?qt.clipControlEXT(qt.LOWER_LEFT_EXT,qt.ZERO_TO_ONE_EXT):qt.clipControlEXT(qt.LOWER_LEFT_EXT,qt.NEGATIVE_ONE_TO_ONE_EXT);const Re=wt;wt=null,this.setClear(Re)}yt=Mt},getReversed:function(){return yt},setTest:function(Mt){Mt?st(r.DEPTH_TEST):Pt(r.DEPTH_TEST)},setMask:function(Mt){Y!==Mt&&!N&&(r.depthMask(Mt),Y=Mt)},setFunc:function(Mt){if(yt&&(Mt=dg[Mt]),et!==Mt){switch(Mt){case wo:r.depthFunc(r.NEVER);break;case bo:r.depthFunc(r.ALWAYS);break;case _o:r.depthFunc(r.LESS);break;case xs:r.depthFunc(r.LEQUAL);break;case To:r.depthFunc(r.EQUAL);break;case Eo:r.depthFunc(r.GEQUAL);break;case Ao:r.depthFunc(r.GREATER);break;case Co:r.depthFunc(r.NOTEQUAL);break;default:r.depthFunc(r.LEQUAL)}et=Mt}},setLocked:function(Mt){N=Mt},setClear:function(Mt){wt!==Mt&&(yt&&(Mt=1-Mt),r.clearDepth(Mt),wt=Mt)},reset:function(){N=!1,Y=null,et=null,wt=null,yt=!1}}}function n(){let N=!1,yt=null,Y=null,et=null,wt=null,Mt=null,qt=null,Re=null,We=null;return{setTest:function(ge){N||(ge?st(r.STENCIL_TEST):Pt(r.STENCIL_TEST))},setMask:function(ge){yt!==ge&&!N&&(r.stencilMask(ge),yt=ge)},setFunc:function(ge,pi,Fi){(Y!==ge||et!==pi||wt!==Fi)&&(r.stencilFunc(ge,pi,Fi),Y=ge,et=pi,wt=Fi)},setOp:function(ge,pi,Fi){(Mt!==ge||qt!==pi||Re!==Fi)&&(r.stencilOp(ge,pi,Fi),Mt=ge,qt=pi,Re=Fi)},setLocked:function(ge){N=ge},setClear:function(ge){We!==ge&&(r.clearStencil(ge),We=ge)},reset:function(){N=!1,yt=null,Y=null,et=null,wt=null,Mt=null,qt=null,Re=null,We=null}}}const s=new e,a=new i,o=new n,l=new WeakMap,c=new WeakMap;let h={},u={},f=new WeakMap,d=[],g=null,x=!1,p=null,m=null,y=null,M=null,v=null,b=null,_=null,T=new j(0,0,0),C=0,w=!1,S=null,P=null,z=null,I=null,U=null;const X=r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let q=!1,$=0;const B=r.getParameter(r.VERSION);B.indexOf("WebGL")!==-1?($=parseFloat(/^WebGL (\d)/.exec(B)[1]),q=$>=1):B.indexOf("OpenGL ES")!==-1&&($=parseFloat(/^OpenGL ES (\d)/.exec(B)[1]),q=$>=2);let ft=null,dt={};const xt=r.getParameter(r.SCISSOR_BOX),Gt=r.getParameter(r.VIEWPORT),tt=new ye().fromArray(xt),O=new ye().fromArray(Gt);function J(N,yt,Y,et){const wt=new Uint8Array(4),Mt=r.createTexture();r.bindTexture(N,Mt),r.texParameteri(N,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(N,r.TEXTURE_MAG_FILTER,r.NEAREST);for(let qt=0;qt<Y;qt++)N===r.TEXTURE_3D||N===r.TEXTURE_2D_ARRAY?r.texImage3D(yt,0,r.RGBA,1,1,et,0,r.RGBA,r.UNSIGNED_BYTE,wt):r.texImage2D(yt+qt,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,wt);return Mt}const ht={};ht[r.TEXTURE_2D]=J(r.TEXTURE_2D,r.TEXTURE_2D,1),ht[r.TEXTURE_CUBE_MAP]=J(r.TEXTURE_CUBE_MAP,r.TEXTURE_CUBE_MAP_POSITIVE_X,6),ht[r.TEXTURE_2D_ARRAY]=J(r.TEXTURE_2D_ARRAY,r.TEXTURE_2D_ARRAY,1,1),ht[r.TEXTURE_3D]=J(r.TEXTURE_3D,r.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),o.setClear(0),st(r.DEPTH_TEST),a.setFunc(xs),rt(!1),vt(Wl),st(r.CULL_FACE),L(Qi);function st(N){h[N]!==!0&&(r.enable(N),h[N]=!0)}function Pt(N){h[N]!==!1&&(r.disable(N),h[N]=!1)}function kt(N,yt){return u[N]!==yt?(r.bindFramebuffer(N,yt),u[N]=yt,N===r.DRAW_FRAMEBUFFER&&(u[r.FRAMEBUFFER]=yt),N===r.FRAMEBUFFER&&(u[r.DRAW_FRAMEBUFFER]=yt),!0):!1}function ot(N,yt){let Y=d,et=!1;if(N){Y=f.get(yt),Y===void 0&&(Y=[],f.set(yt,Y));const wt=N.textures;if(Y.length!==wt.length||Y[0]!==r.COLOR_ATTACHMENT0){for(let Mt=0,qt=wt.length;Mt<qt;Mt++)Y[Mt]=r.COLOR_ATTACHMENT0+Mt;Y.length=wt.length,et=!0}}else Y[0]!==r.BACK&&(Y[0]=r.BACK,et=!0);et&&r.drawBuffers(Y)}function mt(N){return g!==N?(r.useProgram(N),g=N,!0):!1}const Z={[Ln]:r.FUNC_ADD,[Fu]:r.FUNC_SUBTRACT,[ku]:r.FUNC_REVERSE_SUBTRACT};Z[Ou]=r.MIN,Z[Bu]=r.MAX;const at={[Hu]:r.ZERO,[Gu]:r.ONE,[Vu]:r.SRC_COLOR,[Mo]:r.SRC_ALPHA,[Ku]:r.SRC_ALPHA_SATURATE,[Yu]:r.DST_COLOR,[Xu]:r.DST_ALPHA,[Wu]:r.ONE_MINUS_SRC_COLOR,[So]:r.ONE_MINUS_SRC_ALPHA,[Zu]:r.ONE_MINUS_DST_COLOR,[qu]:r.ONE_MINUS_DST_ALPHA,[ju]:r.CONSTANT_COLOR,[Qu]:r.ONE_MINUS_CONSTANT_COLOR,[Ju]:r.CONSTANT_ALPHA,[$u]:r.ONE_MINUS_CONSTANT_ALPHA};function L(N,yt,Y,et,wt,Mt,qt,Re,We,ge){if(N===Qi){x===!0&&(Pt(r.BLEND),x=!1);return}if(x===!1&&(st(r.BLEND),x=!0),N!==Nu){if(N!==p||ge!==w){if((m!==Ln||v!==Ln)&&(r.blendEquation(r.FUNC_ADD),m=Ln,v=Ln),ge)switch(N){case Un:r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case $s:r.blendFunc(r.ONE,r.ONE);break;case Xl:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case ql:r.blendFuncSeparate(r.ZERO,r.SRC_COLOR,r.ZERO,r.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}else switch(N){case Un:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case $s:r.blendFunc(r.SRC_ALPHA,r.ONE);break;case Xl:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case ql:r.blendFunc(r.ZERO,r.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}y=null,M=null,b=null,_=null,T.set(0,0,0),C=0,p=N,w=ge}return}wt=wt||yt,Mt=Mt||Y,qt=qt||et,(yt!==m||wt!==v)&&(r.blendEquationSeparate(Z[yt],Z[wt]),m=yt,v=wt),(Y!==y||et!==M||Mt!==b||qt!==_)&&(r.blendFuncSeparate(at[Y],at[et],at[Mt],at[qt]),y=Y,M=et,b=Mt,_=qt),(Re.equals(T)===!1||We!==C)&&(r.blendColor(Re.r,Re.g,Re.b,We),T.copy(Re),C=We),p=N,w=!1}function At(N,yt){N.side===Ve?Pt(r.CULL_FACE):st(r.CULL_FACE);let Y=N.side===$e;yt&&(Y=!Y),rt(Y),N.blending===Un&&N.transparent===!1?L(Qi):L(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),a.setFunc(N.depthFunc),a.setTest(N.depthTest),a.setMask(N.depthWrite),s.setMask(N.colorWrite);const et=N.stencilWrite;o.setTest(et),et&&(o.setMask(N.stencilWriteMask),o.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),o.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),Ot(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?st(r.SAMPLE_ALPHA_TO_COVERAGE):Pt(r.SAMPLE_ALPHA_TO_COVERAGE)}function rt(N){S!==N&&(N?r.frontFace(r.CW):r.frontFace(r.CCW),S=N)}function vt(N){N!==Iu?(st(r.CULL_FACE),N!==P&&(N===Wl?r.cullFace(r.BACK):N===Uu?r.cullFace(r.FRONT):r.cullFace(r.FRONT_AND_BACK))):Pt(r.CULL_FACE),P=N}function ct(N){N!==z&&(q&&r.lineWidth(N),z=N)}function Ot(N,yt,Y){N?(st(r.POLYGON_OFFSET_FILL),(I!==yt||U!==Y)&&(r.polygonOffset(yt,Y),I=yt,U=Y)):Pt(r.POLYGON_OFFSET_FILL)}function _t(N){N?st(r.SCISSOR_TEST):Pt(r.SCISSOR_TEST)}function R(N){N===void 0&&(N=r.TEXTURE0+X-1),ft!==N&&(r.activeTexture(N),ft=N)}function E(N,yt,Y){Y===void 0&&(ft===null?Y=r.TEXTURE0+X-1:Y=ft);let et=dt[Y];et===void 0&&(et={type:void 0,texture:void 0},dt[Y]=et),(et.type!==N||et.texture!==yt)&&(ft!==Y&&(r.activeTexture(Y),ft=Y),r.bindTexture(N,yt||ht[N]),et.type=N,et.texture=yt)}function H(){const N=dt[ft];N!==void 0&&N.type!==void 0&&(r.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function K(){try{r.compressedTexImage2D.apply(r,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function nt(){try{r.compressedTexImage3D.apply(r,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Q(){try{r.texSubImage2D.apply(r,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Lt(){try{r.texSubImage3D.apply(r,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function gt(){try{r.compressedTexSubImage2D.apply(r,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Tt(){try{r.compressedTexSubImage3D.apply(r,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ee(){try{r.texStorage2D.apply(r,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function lt(){try{r.texStorage3D.apply(r,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ct(){try{r.texImage2D.apply(r,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Bt(){try{r.texImage3D.apply(r,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Wt(N){tt.equals(N)===!1&&(r.scissor(N.x,N.y,N.z,N.w),tt.copy(N))}function Rt(N){O.equals(N)===!1&&(r.viewport(N.x,N.y,N.z,N.w),O.copy(N))}function ne(N,yt){let Y=c.get(yt);Y===void 0&&(Y=new WeakMap,c.set(yt,Y));let et=Y.get(N);et===void 0&&(et=r.getUniformBlockIndex(yt,N.name),Y.set(N,et))}function Qt(N,yt){const et=c.get(yt).get(N);l.get(yt)!==et&&(r.uniformBlockBinding(yt,et,N.__bindingPointIndex),l.set(yt,et))}function Me(){r.disable(r.BLEND),r.disable(r.CULL_FACE),r.disable(r.DEPTH_TEST),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SCISSOR_TEST),r.disable(r.STENCIL_TEST),r.disable(r.SAMPLE_ALPHA_TO_COVERAGE),r.blendEquation(r.FUNC_ADD),r.blendFunc(r.ONE,r.ZERO),r.blendFuncSeparate(r.ONE,r.ZERO,r.ONE,r.ZERO),r.blendColor(0,0,0,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(r.LESS),a.setReversed(!1),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(r.ALWAYS,0,4294967295),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),r.clearStencil(0),r.cullFace(r.BACK),r.frontFace(r.CCW),r.polygonOffset(0,0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),r.bindFramebuffer(r.READ_FRAMEBUFFER,null),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),h={},ft=null,dt={},u={},f=new WeakMap,d=[],g=null,x=!1,p=null,m=null,y=null,M=null,v=null,b=null,_=null,T=new j(0,0,0),C=0,w=!1,S=null,P=null,z=null,I=null,U=null,tt.set(0,0,r.canvas.width,r.canvas.height),O.set(0,0,r.canvas.width,r.canvas.height),s.reset(),a.reset(),o.reset()}return{buffers:{color:s,depth:a,stencil:o},enable:st,disable:Pt,bindFramebuffer:kt,drawBuffers:ot,useProgram:mt,setBlending:L,setMaterial:At,setFlipSided:rt,setCullFace:vt,setLineWidth:ct,setPolygonOffset:Ot,setScissorTest:_t,activeTexture:R,bindTexture:E,unbindTexture:H,compressedTexImage2D:K,compressedTexImage3D:nt,texImage2D:Ct,texImage3D:Bt,updateUBOMapping:ne,uniformBlockBinding:Qt,texStorage2D:ee,texStorage3D:lt,texSubImage2D:Q,texSubImage3D:Lt,compressedTexSubImage2D:gt,compressedTexSubImage3D:Tt,scissor:Wt,viewport:Rt,reset:Me}}function Bc(r,t,e,i){const n=mg(i);switch(e){case Nh:return r*t;case kh:return r*t;case Oh:return r*t*2;case ga:return r*t/n.components*n.byteLength;case xl:return r*t/n.components*n.byteLength;case Bh:return r*t*2/n.components*n.byteLength;case vl:return r*t*2/n.components*n.byteLength;case Fh:return r*t*3/n.components*n.byteLength;case Ue:return r*t*4/n.components*n.byteLength;case yl:return r*t*4/n.components*n.byteLength;case ta:case ea:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*8;case ia:case na:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*16;case zo:case Uo:return Math.max(r,16)*Math.max(t,8)/4;case Lo:case Io:return Math.max(r,8)*Math.max(t,8)/2;case No:case Fo:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*8;case ko:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*16;case Oo:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*16;case Bo:return Math.floor((r+4)/5)*Math.floor((t+3)/4)*16;case Ho:return Math.floor((r+4)/5)*Math.floor((t+4)/5)*16;case Go:return Math.floor((r+5)/6)*Math.floor((t+4)/5)*16;case Vo:return Math.floor((r+5)/6)*Math.floor((t+5)/6)*16;case Wo:return Math.floor((r+7)/8)*Math.floor((t+4)/5)*16;case Xo:return Math.floor((r+7)/8)*Math.floor((t+5)/6)*16;case qo:return Math.floor((r+7)/8)*Math.floor((t+7)/8)*16;case Yo:return Math.floor((r+9)/10)*Math.floor((t+4)/5)*16;case Zo:return Math.floor((r+9)/10)*Math.floor((t+5)/6)*16;case Ko:return Math.floor((r+9)/10)*Math.floor((t+7)/8)*16;case jo:return Math.floor((r+9)/10)*Math.floor((t+9)/10)*16;case Qo:return Math.floor((r+11)/12)*Math.floor((t+9)/10)*16;case Jo:return Math.floor((r+11)/12)*Math.floor((t+11)/12)*16;case sa:case $o:case tl:return Math.ceil(r/4)*Math.ceil(t/4)*16;case Hh:case el:return Math.ceil(r/4)*Math.ceil(t/4)*8;case il:case nl:return Math.ceil(r/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function mg(r){switch(r){case $i:case zh:return{byteLength:1,components:1};case tr:case Ih:case Je:return{byteLength:2,components:1};case ml:case gl:return{byteLength:2,components:4};case Di:case pl:case _i:return{byteLength:4,components:1};case Uh:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${r}.`)}function gg(r,t,e,i,n,s,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new it,h=new WeakMap;let u;const f=new WeakMap;let d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(R,E){return d?new OffscreenCanvas(R,E):ca("canvas")}function x(R,E,H){let K=1;const nt=_t(R);if((nt.width>H||nt.height>H)&&(K=H/Math.max(nt.width,nt.height)),K<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){const Q=Math.floor(K*nt.width),Lt=Math.floor(K*nt.height);u===void 0&&(u=g(Q,Lt));const gt=E?g(Q,Lt):u;return gt.width=Q,gt.height=Lt,gt.getContext("2d").drawImage(R,0,0,Q,Lt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+nt.width+"x"+nt.height+") to ("+Q+"x"+Lt+")."),gt}else return"data"in R&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+nt.width+"x"+nt.height+")."),R;return R}function p(R){return R.generateMipmaps}function m(R){r.generateMipmap(R)}function y(R){return R.isWebGLCubeRenderTarget?r.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?r.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?r.TEXTURE_2D_ARRAY:r.TEXTURE_2D}function M(R,E,H,K,nt=!1){if(R!==null){if(r[R]!==void 0)return r[R];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let Q=E;if(E===r.RED&&(H===r.FLOAT&&(Q=r.R32F),H===r.HALF_FLOAT&&(Q=r.R16F),H===r.UNSIGNED_BYTE&&(Q=r.R8)),E===r.RED_INTEGER&&(H===r.UNSIGNED_BYTE&&(Q=r.R8UI),H===r.UNSIGNED_SHORT&&(Q=r.R16UI),H===r.UNSIGNED_INT&&(Q=r.R32UI),H===r.BYTE&&(Q=r.R8I),H===r.SHORT&&(Q=r.R16I),H===r.INT&&(Q=r.R32I)),E===r.RG&&(H===r.FLOAT&&(Q=r.RG32F),H===r.HALF_FLOAT&&(Q=r.RG16F),H===r.UNSIGNED_BYTE&&(Q=r.RG8)),E===r.RG_INTEGER&&(H===r.UNSIGNED_BYTE&&(Q=r.RG8UI),H===r.UNSIGNED_SHORT&&(Q=r.RG16UI),H===r.UNSIGNED_INT&&(Q=r.RG32UI),H===r.BYTE&&(Q=r.RG8I),H===r.SHORT&&(Q=r.RG16I),H===r.INT&&(Q=r.RG32I)),E===r.RGB_INTEGER&&(H===r.UNSIGNED_BYTE&&(Q=r.RGB8UI),H===r.UNSIGNED_SHORT&&(Q=r.RGB16UI),H===r.UNSIGNED_INT&&(Q=r.RGB32UI),H===r.BYTE&&(Q=r.RGB8I),H===r.SHORT&&(Q=r.RGB16I),H===r.INT&&(Q=r.RGB32I)),E===r.RGBA_INTEGER&&(H===r.UNSIGNED_BYTE&&(Q=r.RGBA8UI),H===r.UNSIGNED_SHORT&&(Q=r.RGBA16UI),H===r.UNSIGNED_INT&&(Q=r.RGBA32UI),H===r.BYTE&&(Q=r.RGBA8I),H===r.SHORT&&(Q=r.RGBA16I),H===r.INT&&(Q=r.RGBA32I)),E===r.RGB&&H===r.UNSIGNED_INT_5_9_9_9_REV&&(Q=r.RGB9_E5),E===r.RGBA){const Lt=nt?xa:re.getTransfer(K);H===r.FLOAT&&(Q=r.RGBA32F),H===r.HALF_FLOAT&&(Q=r.RGBA16F),H===r.UNSIGNED_BYTE&&(Q=Lt===xe?r.SRGB8_ALPHA8:r.RGBA8),H===r.UNSIGNED_SHORT_4_4_4_4&&(Q=r.RGBA4),H===r.UNSIGNED_SHORT_5_5_5_1&&(Q=r.RGB5_A1)}return(Q===r.R16F||Q===r.R32F||Q===r.RG16F||Q===r.RG32F||Q===r.RGBA16F||Q===r.RGBA32F)&&t.get("EXT_color_buffer_float"),Q}function v(R,E){let H;return R?E===null||E===Di||E===Fn?H=r.DEPTH24_STENCIL8:E===_i?H=r.DEPTH32F_STENCIL8:E===tr&&(H=r.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):E===null||E===Di||E===Fn?H=r.DEPTH_COMPONENT24:E===_i?H=r.DEPTH_COMPONENT32F:E===tr&&(H=r.DEPTH_COMPONENT16),H}function b(R,E){return p(R)===!0||R.isFramebufferTexture&&R.minFilter!==Te&&R.minFilter!==Le?Math.log2(Math.max(E.width,E.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?E.mipmaps.length:1}function _(R){const E=R.target;E.removeEventListener("dispose",_),C(E),E.isVideoTexture&&h.delete(E)}function T(R){const E=R.target;E.removeEventListener("dispose",T),S(E)}function C(R){const E=i.get(R);if(E.__webglInit===void 0)return;const H=R.source,K=f.get(H);if(K){const nt=K[E.__cacheKey];nt.usedTimes--,nt.usedTimes===0&&w(R),Object.keys(K).length===0&&f.delete(H)}i.remove(R)}function w(R){const E=i.get(R);r.deleteTexture(E.__webglTexture);const H=R.source,K=f.get(H);delete K[E.__cacheKey],a.memory.textures--}function S(R){const E=i.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),i.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let K=0;K<6;K++){if(Array.isArray(E.__webglFramebuffer[K]))for(let nt=0;nt<E.__webglFramebuffer[K].length;nt++)r.deleteFramebuffer(E.__webglFramebuffer[K][nt]);else r.deleteFramebuffer(E.__webglFramebuffer[K]);E.__webglDepthbuffer&&r.deleteRenderbuffer(E.__webglDepthbuffer[K])}else{if(Array.isArray(E.__webglFramebuffer))for(let K=0;K<E.__webglFramebuffer.length;K++)r.deleteFramebuffer(E.__webglFramebuffer[K]);else r.deleteFramebuffer(E.__webglFramebuffer);if(E.__webglDepthbuffer&&r.deleteRenderbuffer(E.__webglDepthbuffer),E.__webglMultisampledFramebuffer&&r.deleteFramebuffer(E.__webglMultisampledFramebuffer),E.__webglColorRenderbuffer)for(let K=0;K<E.__webglColorRenderbuffer.length;K++)E.__webglColorRenderbuffer[K]&&r.deleteRenderbuffer(E.__webglColorRenderbuffer[K]);E.__webglDepthRenderbuffer&&r.deleteRenderbuffer(E.__webglDepthRenderbuffer)}const H=R.textures;for(let K=0,nt=H.length;K<nt;K++){const Q=i.get(H[K]);Q.__webglTexture&&(r.deleteTexture(Q.__webglTexture),a.memory.textures--),i.remove(H[K])}i.remove(R)}let P=0;function z(){P=0}function I(){const R=P;return R>=n.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+n.maxTextures),P+=1,R}function U(R){const E=[];return E.push(R.wrapS),E.push(R.wrapT),E.push(R.wrapR||0),E.push(R.magFilter),E.push(R.minFilter),E.push(R.anisotropy),E.push(R.internalFormat),E.push(R.format),E.push(R.type),E.push(R.generateMipmaps),E.push(R.premultiplyAlpha),E.push(R.flipY),E.push(R.unpackAlignment),E.push(R.colorSpace),E.join()}function X(R,E){const H=i.get(R);if(R.isVideoTexture&&ct(R),R.isRenderTargetTexture===!1&&R.version>0&&H.__version!==R.version){const K=R.image;if(K===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(K.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{O(H,R,E);return}}e.bindTexture(r.TEXTURE_2D,H.__webglTexture,r.TEXTURE0+E)}function q(R,E){const H=i.get(R);if(R.version>0&&H.__version!==R.version){O(H,R,E);return}e.bindTexture(r.TEXTURE_2D_ARRAY,H.__webglTexture,r.TEXTURE0+E)}function $(R,E){const H=i.get(R);if(R.version>0&&H.__version!==R.version){O(H,R,E);return}e.bindTexture(r.TEXTURE_3D,H.__webglTexture,r.TEXTURE0+E)}function B(R,E){const H=i.get(R);if(R.version>0&&H.__version!==R.version){J(H,R,E);return}e.bindTexture(r.TEXTURE_CUBE_MAP,H.__webglTexture,r.TEXTURE0+E)}const ft={[Ms]:r.REPEAT,[dn]:r.CLAMP_TO_EDGE,[Do]:r.MIRRORED_REPEAT},dt={[Te]:r.NEAREST,[sf]:r.NEAREST_MIPMAP_NEAREST,[pr]:r.NEAREST_MIPMAP_LINEAR,[Le]:r.LINEAR,[_a]:r.LINEAR_MIPMAP_NEAREST,[pn]:r.LINEAR_MIPMAP_LINEAR},xt={[lf]:r.NEVER,[pf]:r.ALWAYS,[cf]:r.LESS,[Vh]:r.LEQUAL,[hf]:r.EQUAL,[df]:r.GEQUAL,[uf]:r.GREATER,[ff]:r.NOTEQUAL};function Gt(R,E){if(E.type===_i&&t.has("OES_texture_float_linear")===!1&&(E.magFilter===Le||E.magFilter===_a||E.magFilter===pr||E.magFilter===pn||E.minFilter===Le||E.minFilter===_a||E.minFilter===pr||E.minFilter===pn)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),r.texParameteri(R,r.TEXTURE_WRAP_S,ft[E.wrapS]),r.texParameteri(R,r.TEXTURE_WRAP_T,ft[E.wrapT]),(R===r.TEXTURE_3D||R===r.TEXTURE_2D_ARRAY)&&r.texParameteri(R,r.TEXTURE_WRAP_R,ft[E.wrapR]),r.texParameteri(R,r.TEXTURE_MAG_FILTER,dt[E.magFilter]),r.texParameteri(R,r.TEXTURE_MIN_FILTER,dt[E.minFilter]),E.compareFunction&&(r.texParameteri(R,r.TEXTURE_COMPARE_MODE,r.COMPARE_REF_TO_TEXTURE),r.texParameteri(R,r.TEXTURE_COMPARE_FUNC,xt[E.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(E.magFilter===Te||E.minFilter!==pr&&E.minFilter!==pn||E.type===_i&&t.has("OES_texture_float_linear")===!1)return;if(E.anisotropy>1||i.get(E).__currentAnisotropy){const H=t.get("EXT_texture_filter_anisotropic");r.texParameterf(R,H.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(E.anisotropy,n.getMaxAnisotropy())),i.get(E).__currentAnisotropy=E.anisotropy}}}function tt(R,E){let H=!1;R.__webglInit===void 0&&(R.__webglInit=!0,E.addEventListener("dispose",_));const K=E.source;let nt=f.get(K);nt===void 0&&(nt={},f.set(K,nt));const Q=U(E);if(Q!==R.__cacheKey){nt[Q]===void 0&&(nt[Q]={texture:r.createTexture(),usedTimes:0},a.memory.textures++,H=!0),nt[Q].usedTimes++;const Lt=nt[R.__cacheKey];Lt!==void 0&&(nt[R.__cacheKey].usedTimes--,Lt.usedTimes===0&&w(E)),R.__cacheKey=Q,R.__webglTexture=nt[Q].texture}return H}function O(R,E,H){let K=r.TEXTURE_2D;(E.isDataArrayTexture||E.isCompressedArrayTexture)&&(K=r.TEXTURE_2D_ARRAY),E.isData3DTexture&&(K=r.TEXTURE_3D);const nt=tt(R,E),Q=E.source;e.bindTexture(K,R.__webglTexture,r.TEXTURE0+H);const Lt=i.get(Q);if(Q.version!==Lt.__version||nt===!0){e.activeTexture(r.TEXTURE0+H);const gt=re.getPrimaries(re.workingColorSpace),Tt=E.colorSpace===Zi?null:re.getPrimaries(E.colorSpace),ee=E.colorSpace===Zi||gt===Tt?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,E.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,E.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,ee);let lt=x(E.image,!1,n.maxTextureSize);lt=Ot(E,lt);const Ct=s.convert(E.format,E.colorSpace),Bt=s.convert(E.type);let Wt=M(E.internalFormat,Ct,Bt,E.colorSpace,E.isVideoTexture);Gt(K,E);let Rt;const ne=E.mipmaps,Qt=E.isVideoTexture!==!0,Me=Lt.__version===void 0||nt===!0,N=Q.dataReady,yt=b(E,lt);if(E.isDepthTexture)Wt=v(E.format===kn,E.type),Me&&(Qt?e.texStorage2D(r.TEXTURE_2D,1,Wt,lt.width,lt.height):e.texImage2D(r.TEXTURE_2D,0,Wt,lt.width,lt.height,0,Ct,Bt,null));else if(E.isDataTexture)if(ne.length>0){Qt&&Me&&e.texStorage2D(r.TEXTURE_2D,yt,Wt,ne[0].width,ne[0].height);for(let Y=0,et=ne.length;Y<et;Y++)Rt=ne[Y],Qt?N&&e.texSubImage2D(r.TEXTURE_2D,Y,0,0,Rt.width,Rt.height,Ct,Bt,Rt.data):e.texImage2D(r.TEXTURE_2D,Y,Wt,Rt.width,Rt.height,0,Ct,Bt,Rt.data);E.generateMipmaps=!1}else Qt?(Me&&e.texStorage2D(r.TEXTURE_2D,yt,Wt,lt.width,lt.height),N&&e.texSubImage2D(r.TEXTURE_2D,0,0,0,lt.width,lt.height,Ct,Bt,lt.data)):e.texImage2D(r.TEXTURE_2D,0,Wt,lt.width,lt.height,0,Ct,Bt,lt.data);else if(E.isCompressedTexture)if(E.isCompressedArrayTexture){Qt&&Me&&e.texStorage3D(r.TEXTURE_2D_ARRAY,yt,Wt,ne[0].width,ne[0].height,lt.depth);for(let Y=0,et=ne.length;Y<et;Y++)if(Rt=ne[Y],E.format!==Ue)if(Ct!==null)if(Qt){if(N)if(E.layerUpdates.size>0){const wt=Bc(Rt.width,Rt.height,E.format,E.type);for(const Mt of E.layerUpdates){const qt=Rt.data.subarray(Mt*wt/Rt.data.BYTES_PER_ELEMENT,(Mt+1)*wt/Rt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,Y,0,0,Mt,Rt.width,Rt.height,1,Ct,qt)}E.clearLayerUpdates()}else e.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,Y,0,0,0,Rt.width,Rt.height,lt.depth,Ct,Rt.data)}else e.compressedTexImage3D(r.TEXTURE_2D_ARRAY,Y,Wt,Rt.width,Rt.height,lt.depth,0,Rt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Qt?N&&e.texSubImage3D(r.TEXTURE_2D_ARRAY,Y,0,0,0,Rt.width,Rt.height,lt.depth,Ct,Bt,Rt.data):e.texImage3D(r.TEXTURE_2D_ARRAY,Y,Wt,Rt.width,Rt.height,lt.depth,0,Ct,Bt,Rt.data)}else{Qt&&Me&&e.texStorage2D(r.TEXTURE_2D,yt,Wt,ne[0].width,ne[0].height);for(let Y=0,et=ne.length;Y<et;Y++)Rt=ne[Y],E.format!==Ue?Ct!==null?Qt?N&&e.compressedTexSubImage2D(r.TEXTURE_2D,Y,0,0,Rt.width,Rt.height,Ct,Rt.data):e.compressedTexImage2D(r.TEXTURE_2D,Y,Wt,Rt.width,Rt.height,0,Rt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Qt?N&&e.texSubImage2D(r.TEXTURE_2D,Y,0,0,Rt.width,Rt.height,Ct,Bt,Rt.data):e.texImage2D(r.TEXTURE_2D,Y,Wt,Rt.width,Rt.height,0,Ct,Bt,Rt.data)}else if(E.isDataArrayTexture)if(Qt){if(Me&&e.texStorage3D(r.TEXTURE_2D_ARRAY,yt,Wt,lt.width,lt.height,lt.depth),N)if(E.layerUpdates.size>0){const Y=Bc(lt.width,lt.height,E.format,E.type);for(const et of E.layerUpdates){const wt=lt.data.subarray(et*Y/lt.data.BYTES_PER_ELEMENT,(et+1)*Y/lt.data.BYTES_PER_ELEMENT);e.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,et,lt.width,lt.height,1,Ct,Bt,wt)}E.clearLayerUpdates()}else e.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,0,lt.width,lt.height,lt.depth,Ct,Bt,lt.data)}else e.texImage3D(r.TEXTURE_2D_ARRAY,0,Wt,lt.width,lt.height,lt.depth,0,Ct,Bt,lt.data);else if(E.isData3DTexture)Qt?(Me&&e.texStorage3D(r.TEXTURE_3D,yt,Wt,lt.width,lt.height,lt.depth),N&&e.texSubImage3D(r.TEXTURE_3D,0,0,0,0,lt.width,lt.height,lt.depth,Ct,Bt,lt.data)):e.texImage3D(r.TEXTURE_3D,0,Wt,lt.width,lt.height,lt.depth,0,Ct,Bt,lt.data);else if(E.isFramebufferTexture){if(Me)if(Qt)e.texStorage2D(r.TEXTURE_2D,yt,Wt,lt.width,lt.height);else{let Y=lt.width,et=lt.height;for(let wt=0;wt<yt;wt++)e.texImage2D(r.TEXTURE_2D,wt,Wt,Y,et,0,Ct,Bt,null),Y>>=1,et>>=1}}else if(ne.length>0){if(Qt&&Me){const Y=_t(ne[0]);e.texStorage2D(r.TEXTURE_2D,yt,Wt,Y.width,Y.height)}for(let Y=0,et=ne.length;Y<et;Y++)Rt=ne[Y],Qt?N&&e.texSubImage2D(r.TEXTURE_2D,Y,0,0,Ct,Bt,Rt):e.texImage2D(r.TEXTURE_2D,Y,Wt,Ct,Bt,Rt);E.generateMipmaps=!1}else if(Qt){if(Me){const Y=_t(lt);e.texStorage2D(r.TEXTURE_2D,yt,Wt,Y.width,Y.height)}N&&e.texSubImage2D(r.TEXTURE_2D,0,0,0,Ct,Bt,lt)}else e.texImage2D(r.TEXTURE_2D,0,Wt,Ct,Bt,lt);p(E)&&m(K),Lt.__version=Q.version,E.onUpdate&&E.onUpdate(E)}R.__version=E.version}function J(R,E,H){if(E.image.length!==6)return;const K=tt(R,E),nt=E.source;e.bindTexture(r.TEXTURE_CUBE_MAP,R.__webglTexture,r.TEXTURE0+H);const Q=i.get(nt);if(nt.version!==Q.__version||K===!0){e.activeTexture(r.TEXTURE0+H);const Lt=re.getPrimaries(re.workingColorSpace),gt=E.colorSpace===Zi?null:re.getPrimaries(E.colorSpace),Tt=E.colorSpace===Zi||Lt===gt?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,E.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,E.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,Tt);const ee=E.isCompressedTexture||E.image[0].isCompressedTexture,lt=E.image[0]&&E.image[0].isDataTexture,Ct=[];for(let et=0;et<6;et++)!ee&&!lt?Ct[et]=x(E.image[et],!0,n.maxCubemapSize):Ct[et]=lt?E.image[et].image:E.image[et],Ct[et]=Ot(E,Ct[et]);const Bt=Ct[0],Wt=s.convert(E.format,E.colorSpace),Rt=s.convert(E.type),ne=M(E.internalFormat,Wt,Rt,E.colorSpace),Qt=E.isVideoTexture!==!0,Me=Q.__version===void 0||K===!0,N=nt.dataReady;let yt=b(E,Bt);Gt(r.TEXTURE_CUBE_MAP,E);let Y;if(ee){Qt&&Me&&e.texStorage2D(r.TEXTURE_CUBE_MAP,yt,ne,Bt.width,Bt.height);for(let et=0;et<6;et++){Y=Ct[et].mipmaps;for(let wt=0;wt<Y.length;wt++){const Mt=Y[wt];E.format!==Ue?Wt!==null?Qt?N&&e.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+et,wt,0,0,Mt.width,Mt.height,Wt,Mt.data):e.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+et,wt,ne,Mt.width,Mt.height,0,Mt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Qt?N&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+et,wt,0,0,Mt.width,Mt.height,Wt,Rt,Mt.data):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+et,wt,ne,Mt.width,Mt.height,0,Wt,Rt,Mt.data)}}}else{if(Y=E.mipmaps,Qt&&Me){Y.length>0&&yt++;const et=_t(Ct[0]);e.texStorage2D(r.TEXTURE_CUBE_MAP,yt,ne,et.width,et.height)}for(let et=0;et<6;et++)if(lt){Qt?N&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,0,0,Ct[et].width,Ct[et].height,Wt,Rt,Ct[et].data):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,ne,Ct[et].width,Ct[et].height,0,Wt,Rt,Ct[et].data);for(let wt=0;wt<Y.length;wt++){const qt=Y[wt].image[et].image;Qt?N&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+et,wt+1,0,0,qt.width,qt.height,Wt,Rt,qt.data):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+et,wt+1,ne,qt.width,qt.height,0,Wt,Rt,qt.data)}}else{Qt?N&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,0,0,Wt,Rt,Ct[et]):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,ne,Wt,Rt,Ct[et]);for(let wt=0;wt<Y.length;wt++){const Mt=Y[wt];Qt?N&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+et,wt+1,0,0,Wt,Rt,Mt.image[et]):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+et,wt+1,ne,Wt,Rt,Mt.image[et])}}}p(E)&&m(r.TEXTURE_CUBE_MAP),Q.__version=nt.version,E.onUpdate&&E.onUpdate(E)}R.__version=E.version}function ht(R,E,H,K,nt,Q){const Lt=s.convert(H.format,H.colorSpace),gt=s.convert(H.type),Tt=M(H.internalFormat,Lt,gt,H.colorSpace),ee=i.get(E),lt=i.get(H);if(lt.__renderTarget=E,!ee.__hasExternalTextures){const Ct=Math.max(1,E.width>>Q),Bt=Math.max(1,E.height>>Q);nt===r.TEXTURE_3D||nt===r.TEXTURE_2D_ARRAY?e.texImage3D(nt,Q,Tt,Ct,Bt,E.depth,0,Lt,gt,null):e.texImage2D(nt,Q,Tt,Ct,Bt,0,Lt,gt,null)}e.bindFramebuffer(r.FRAMEBUFFER,R),vt(E)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,K,nt,lt.__webglTexture,0,rt(E)):(nt===r.TEXTURE_2D||nt>=r.TEXTURE_CUBE_MAP_POSITIVE_X&&nt<=r.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&r.framebufferTexture2D(r.FRAMEBUFFER,K,nt,lt.__webglTexture,Q),e.bindFramebuffer(r.FRAMEBUFFER,null)}function st(R,E,H){if(r.bindRenderbuffer(r.RENDERBUFFER,R),E.depthBuffer){const K=E.depthTexture,nt=K&&K.isDepthTexture?K.type:null,Q=v(E.stencilBuffer,nt),Lt=E.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,gt=rt(E);vt(E)?o.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,gt,Q,E.width,E.height):H?r.renderbufferStorageMultisample(r.RENDERBUFFER,gt,Q,E.width,E.height):r.renderbufferStorage(r.RENDERBUFFER,Q,E.width,E.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,Lt,r.RENDERBUFFER,R)}else{const K=E.textures;for(let nt=0;nt<K.length;nt++){const Q=K[nt],Lt=s.convert(Q.format,Q.colorSpace),gt=s.convert(Q.type),Tt=M(Q.internalFormat,Lt,gt,Q.colorSpace),ee=rt(E);H&&vt(E)===!1?r.renderbufferStorageMultisample(r.RENDERBUFFER,ee,Tt,E.width,E.height):vt(E)?o.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,ee,Tt,E.width,E.height):r.renderbufferStorage(r.RENDERBUFFER,Tt,E.width,E.height)}}r.bindRenderbuffer(r.RENDERBUFFER,null)}function Pt(R,E){if(E&&E.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(r.FRAMEBUFFER,R),!(E.depthTexture&&E.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const K=i.get(E.depthTexture);K.__renderTarget=E,(!K.__webglTexture||E.depthTexture.image.width!==E.width||E.depthTexture.image.height!==E.height)&&(E.depthTexture.image.width=E.width,E.depthTexture.image.height=E.height,E.depthTexture.needsUpdate=!0),X(E.depthTexture,0);const nt=K.__webglTexture,Q=rt(E);if(E.depthTexture.format===gn)vt(E)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,nt,0,Q):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,nt,0);else if(E.depthTexture.format===kn)vt(E)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,nt,0,Q):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,nt,0);else throw new Error("Unknown depthTexture format")}function kt(R){const E=i.get(R),H=R.isWebGLCubeRenderTarget===!0;if(E.__boundDepthTexture!==R.depthTexture){const K=R.depthTexture;if(E.__depthDisposeCallback&&E.__depthDisposeCallback(),K){const nt=()=>{delete E.__boundDepthTexture,delete E.__depthDisposeCallback,K.removeEventListener("dispose",nt)};K.addEventListener("dispose",nt),E.__depthDisposeCallback=nt}E.__boundDepthTexture=K}if(R.depthTexture&&!E.__autoAllocateDepthBuffer){if(H)throw new Error("target.depthTexture not supported in Cube render targets");Pt(E.__webglFramebuffer,R)}else if(H){E.__webglDepthbuffer=[];for(let K=0;K<6;K++)if(e.bindFramebuffer(r.FRAMEBUFFER,E.__webglFramebuffer[K]),E.__webglDepthbuffer[K]===void 0)E.__webglDepthbuffer[K]=r.createRenderbuffer(),st(E.__webglDepthbuffer[K],R,!1);else{const nt=R.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,Q=E.__webglDepthbuffer[K];r.bindRenderbuffer(r.RENDERBUFFER,Q),r.framebufferRenderbuffer(r.FRAMEBUFFER,nt,r.RENDERBUFFER,Q)}}else if(e.bindFramebuffer(r.FRAMEBUFFER,E.__webglFramebuffer),E.__webglDepthbuffer===void 0)E.__webglDepthbuffer=r.createRenderbuffer(),st(E.__webglDepthbuffer,R,!1);else{const K=R.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,nt=E.__webglDepthbuffer;r.bindRenderbuffer(r.RENDERBUFFER,nt),r.framebufferRenderbuffer(r.FRAMEBUFFER,K,r.RENDERBUFFER,nt)}e.bindFramebuffer(r.FRAMEBUFFER,null)}function ot(R,E,H){const K=i.get(R);E!==void 0&&ht(K.__webglFramebuffer,R,R.texture,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,0),H!==void 0&&kt(R)}function mt(R){const E=R.texture,H=i.get(R),K=i.get(E);R.addEventListener("dispose",T);const nt=R.textures,Q=R.isWebGLCubeRenderTarget===!0,Lt=nt.length>1;if(Lt||(K.__webglTexture===void 0&&(K.__webglTexture=r.createTexture()),K.__version=E.version,a.memory.textures++),Q){H.__webglFramebuffer=[];for(let gt=0;gt<6;gt++)if(E.mipmaps&&E.mipmaps.length>0){H.__webglFramebuffer[gt]=[];for(let Tt=0;Tt<E.mipmaps.length;Tt++)H.__webglFramebuffer[gt][Tt]=r.createFramebuffer()}else H.__webglFramebuffer[gt]=r.createFramebuffer()}else{if(E.mipmaps&&E.mipmaps.length>0){H.__webglFramebuffer=[];for(let gt=0;gt<E.mipmaps.length;gt++)H.__webglFramebuffer[gt]=r.createFramebuffer()}else H.__webglFramebuffer=r.createFramebuffer();if(Lt)for(let gt=0,Tt=nt.length;gt<Tt;gt++){const ee=i.get(nt[gt]);ee.__webglTexture===void 0&&(ee.__webglTexture=r.createTexture(),a.memory.textures++)}if(R.samples>0&&vt(R)===!1){H.__webglMultisampledFramebuffer=r.createFramebuffer(),H.__webglColorRenderbuffer=[],e.bindFramebuffer(r.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let gt=0;gt<nt.length;gt++){const Tt=nt[gt];H.__webglColorRenderbuffer[gt]=r.createRenderbuffer(),r.bindRenderbuffer(r.RENDERBUFFER,H.__webglColorRenderbuffer[gt]);const ee=s.convert(Tt.format,Tt.colorSpace),lt=s.convert(Tt.type),Ct=M(Tt.internalFormat,ee,lt,Tt.colorSpace,R.isXRRenderTarget===!0),Bt=rt(R);r.renderbufferStorageMultisample(r.RENDERBUFFER,Bt,Ct,R.width,R.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+gt,r.RENDERBUFFER,H.__webglColorRenderbuffer[gt])}r.bindRenderbuffer(r.RENDERBUFFER,null),R.depthBuffer&&(H.__webglDepthRenderbuffer=r.createRenderbuffer(),st(H.__webglDepthRenderbuffer,R,!0)),e.bindFramebuffer(r.FRAMEBUFFER,null)}}if(Q){e.bindTexture(r.TEXTURE_CUBE_MAP,K.__webglTexture),Gt(r.TEXTURE_CUBE_MAP,E);for(let gt=0;gt<6;gt++)if(E.mipmaps&&E.mipmaps.length>0)for(let Tt=0;Tt<E.mipmaps.length;Tt++)ht(H.__webglFramebuffer[gt][Tt],R,E,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+gt,Tt);else ht(H.__webglFramebuffer[gt],R,E,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+gt,0);p(E)&&m(r.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Lt){for(let gt=0,Tt=nt.length;gt<Tt;gt++){const ee=nt[gt],lt=i.get(ee);e.bindTexture(r.TEXTURE_2D,lt.__webglTexture),Gt(r.TEXTURE_2D,ee),ht(H.__webglFramebuffer,R,ee,r.COLOR_ATTACHMENT0+gt,r.TEXTURE_2D,0),p(ee)&&m(r.TEXTURE_2D)}e.unbindTexture()}else{let gt=r.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(gt=R.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),e.bindTexture(gt,K.__webglTexture),Gt(gt,E),E.mipmaps&&E.mipmaps.length>0)for(let Tt=0;Tt<E.mipmaps.length;Tt++)ht(H.__webglFramebuffer[Tt],R,E,r.COLOR_ATTACHMENT0,gt,Tt);else ht(H.__webglFramebuffer,R,E,r.COLOR_ATTACHMENT0,gt,0);p(E)&&m(gt),e.unbindTexture()}R.depthBuffer&&kt(R)}function Z(R){const E=R.textures;for(let H=0,K=E.length;H<K;H++){const nt=E[H];if(p(nt)){const Q=y(R),Lt=i.get(nt).__webglTexture;e.bindTexture(Q,Lt),m(Q),e.unbindTexture()}}}const at=[],L=[];function At(R){if(R.samples>0){if(vt(R)===!1){const E=R.textures,H=R.width,K=R.height;let nt=r.COLOR_BUFFER_BIT;const Q=R.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,Lt=i.get(R),gt=E.length>1;if(gt)for(let Tt=0;Tt<E.length;Tt++)e.bindFramebuffer(r.FRAMEBUFFER,Lt.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+Tt,r.RENDERBUFFER,null),e.bindFramebuffer(r.FRAMEBUFFER,Lt.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+Tt,r.TEXTURE_2D,null,0);e.bindFramebuffer(r.READ_FRAMEBUFFER,Lt.__webglMultisampledFramebuffer),e.bindFramebuffer(r.DRAW_FRAMEBUFFER,Lt.__webglFramebuffer);for(let Tt=0;Tt<E.length;Tt++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(nt|=r.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(nt|=r.STENCIL_BUFFER_BIT)),gt){r.framebufferRenderbuffer(r.READ_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,Lt.__webglColorRenderbuffer[Tt]);const ee=i.get(E[Tt]).__webglTexture;r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,ee,0)}r.blitFramebuffer(0,0,H,K,0,0,H,K,nt,r.NEAREST),l===!0&&(at.length=0,L.length=0,at.push(r.COLOR_ATTACHMENT0+Tt),R.depthBuffer&&R.resolveDepthBuffer===!1&&(at.push(Q),L.push(Q),r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,L)),r.invalidateFramebuffer(r.READ_FRAMEBUFFER,at))}if(e.bindFramebuffer(r.READ_FRAMEBUFFER,null),e.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),gt)for(let Tt=0;Tt<E.length;Tt++){e.bindFramebuffer(r.FRAMEBUFFER,Lt.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+Tt,r.RENDERBUFFER,Lt.__webglColorRenderbuffer[Tt]);const ee=i.get(E[Tt]).__webglTexture;e.bindFramebuffer(r.FRAMEBUFFER,Lt.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+Tt,r.TEXTURE_2D,ee,0)}e.bindFramebuffer(r.DRAW_FRAMEBUFFER,Lt.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&l){const E=R.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,[E])}}}function rt(R){return Math.min(n.maxSamples,R.samples)}function vt(R){const E=i.get(R);return R.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&E.__useRenderToTexture!==!1}function ct(R){const E=a.render.frame;h.get(R)!==E&&(h.set(R,E),R.update())}function Ot(R,E){const H=R.colorSpace,K=R.format,nt=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||H!==_s&&H!==Zi&&(re.getTransfer(H)===xe?(K!==Ue||nt!==$i)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",H)),E}function _t(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(c.width=R.naturalWidth||R.width,c.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(c.width=R.displayWidth,c.height=R.displayHeight):(c.width=R.width,c.height=R.height),c}this.allocateTextureUnit=I,this.resetTextureUnits=z,this.setTexture2D=X,this.setTexture2DArray=q,this.setTexture3D=$,this.setTextureCube=B,this.rebindTextures=ot,this.setupRenderTarget=mt,this.updateRenderTargetMipmap=Z,this.updateMultisampleRenderTarget=At,this.setupDepthRenderbuffer=kt,this.setupFrameBufferTexture=ht,this.useMultisampledRTT=vt}function xg(r,t){function e(i,n=Zi){let s;const a=re.getTransfer(n);if(i===$i)return r.UNSIGNED_BYTE;if(i===ml)return r.UNSIGNED_SHORT_4_4_4_4;if(i===gl)return r.UNSIGNED_SHORT_5_5_5_1;if(i===Uh)return r.UNSIGNED_INT_5_9_9_9_REV;if(i===zh)return r.BYTE;if(i===Ih)return r.SHORT;if(i===tr)return r.UNSIGNED_SHORT;if(i===pl)return r.INT;if(i===Di)return r.UNSIGNED_INT;if(i===_i)return r.FLOAT;if(i===Je)return r.HALF_FLOAT;if(i===Nh)return r.ALPHA;if(i===Fh)return r.RGB;if(i===Ue)return r.RGBA;if(i===kh)return r.LUMINANCE;if(i===Oh)return r.LUMINANCE_ALPHA;if(i===gn)return r.DEPTH_COMPONENT;if(i===kn)return r.DEPTH_STENCIL;if(i===ga)return r.RED;if(i===xl)return r.RED_INTEGER;if(i===Bh)return r.RG;if(i===vl)return r.RG_INTEGER;if(i===yl)return r.RGBA_INTEGER;if(i===ta||i===ea||i===ia||i===na)if(a===xe)if(s=t.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===ta)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===ea)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===ia)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===na)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=t.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===ta)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===ea)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===ia)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===na)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Lo||i===zo||i===Io||i===Uo)if(s=t.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===Lo)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===zo)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Io)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Uo)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===No||i===Fo||i===ko)if(s=t.get("WEBGL_compressed_texture_etc"),s!==null){if(i===No||i===Fo)return a===xe?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===ko)return a===xe?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Oo||i===Bo||i===Ho||i===Go||i===Vo||i===Wo||i===Xo||i===qo||i===Yo||i===Zo||i===Ko||i===jo||i===Qo||i===Jo)if(s=t.get("WEBGL_compressed_texture_astc"),s!==null){if(i===Oo)return a===xe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Bo)return a===xe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Ho)return a===xe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Go)return a===xe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Vo)return a===xe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Wo)return a===xe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Xo)return a===xe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===qo)return a===xe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Yo)return a===xe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Zo)return a===xe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Ko)return a===xe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===jo)return a===xe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Qo)return a===xe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Jo)return a===xe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===sa||i===$o||i===tl)if(s=t.get("EXT_texture_compression_bptc"),s!==null){if(i===sa)return a===xe?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===$o)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===tl)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Hh||i===el||i===il||i===nl)if(s=t.get("EXT_texture_compression_rgtc"),s!==null){if(i===sa)return s.COMPRESSED_RED_RGTC1_EXT;if(i===el)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===il)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===nl)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Fn?r.UNSIGNED_INT_24_8:r[i]!==void 0?r[i]:null}return{convert:e}}class vg extends ni{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class Ee extends me{constructor(){super(),this.isGroup=!0,this.type="Group"}}const yg={type:"move"};class $a{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ee,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ee,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new D,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new D),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ee,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new D,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new D),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let n=null,s=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){a=!0;for(const x of t.hand.values()){const p=e.getJointPose(x,i),m=this._getHandJoint(c,x);p!==null&&(m.matrix.fromArray(p.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=p.radius),m.visible=p!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],f=h.position.distanceTo(u.position),d=.02,g=.005;c.inputState.pinching&&f>d+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&f<=d-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(n=e.getPose(t.targetRaySpace,i),n===null&&s!==null&&(n=s),n!==null&&(o.matrix.fromArray(n.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,n.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(n.linearVelocity)):o.hasLinearVelocity=!1,n.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(n.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(yg)))}return o!==null&&(o.visible=n!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new Ee;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}const Mg=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Sg=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class wg{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,i){if(this.texture===null){const n=new Ze,s=t.properties.get(n);s.__webglTexture=e.texture,(e.depthNear!=i.depthNear||e.depthFar!=i.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,i=new ve({vertexShader:Mg,fragmentShader:Sg,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new G(new ui(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class bg extends Ts{constructor(t,e){super();const i=this;let n=null,s=1,a=null,o="local-floor",l=1,c=null,h=null,u=null,f=null,d=null,g=null;const x=new wg,p=e.getContextAttributes();let m=null,y=null;const M=[],v=[],b=new it;let _=null;const T=new ni;T.viewport=new ye;const C=new ni;C.viewport=new ye;const w=[T,C],S=new vg;let P=null,z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(O){let J=M[O];return J===void 0&&(J=new $a,M[O]=J),J.getTargetRaySpace()},this.getControllerGrip=function(O){let J=M[O];return J===void 0&&(J=new $a,M[O]=J),J.getGripSpace()},this.getHand=function(O){let J=M[O];return J===void 0&&(J=new $a,M[O]=J),J.getHandSpace()};function I(O){const J=v.indexOf(O.inputSource);if(J===-1)return;const ht=M[J];ht!==void 0&&(ht.update(O.inputSource,O.frame,c||a),ht.dispatchEvent({type:O.type,data:O.inputSource}))}function U(){n.removeEventListener("select",I),n.removeEventListener("selectstart",I),n.removeEventListener("selectend",I),n.removeEventListener("squeeze",I),n.removeEventListener("squeezestart",I),n.removeEventListener("squeezeend",I),n.removeEventListener("end",U),n.removeEventListener("inputsourceschange",X);for(let O=0;O<M.length;O++){const J=v[O];J!==null&&(v[O]=null,M[O].disconnect(J))}P=null,z=null,x.reset(),t.setRenderTarget(m),d=null,f=null,u=null,n=null,y=null,tt.stop(),i.isPresenting=!1,t.setPixelRatio(_),t.setSize(b.width,b.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(O){s=O,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(O){o=O,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(O){c=O},this.getBaseLayer=function(){return f!==null?f:d},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return n},this.setSession=async function(O){if(n=O,n!==null){if(m=t.getRenderTarget(),n.addEventListener("select",I),n.addEventListener("selectstart",I),n.addEventListener("selectend",I),n.addEventListener("squeeze",I),n.addEventListener("squeezestart",I),n.addEventListener("squeezeend",I),n.addEventListener("end",U),n.addEventListener("inputsourceschange",X),p.xrCompatible!==!0&&await e.makeXRCompatible(),_=t.getPixelRatio(),t.getSize(b),n.renderState.layers===void 0){const J={antialias:p.antialias,alpha:!0,depth:p.depth,stencil:p.stencil,framebufferScaleFactor:s};d=new XRWebGLLayer(n,e,J),n.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),y=new ze(d.framebufferWidth,d.framebufferHeight,{format:Ue,type:$i,colorSpace:t.outputColorSpace,stencilBuffer:p.stencil})}else{let J=null,ht=null,st=null;p.depth&&(st=p.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,J=p.stencil?kn:gn,ht=p.stencil?Fn:Di);const Pt={colorFormat:e.RGBA8,depthFormat:st,scaleFactor:s};u=new XRWebGLBinding(n,e),f=u.createProjectionLayer(Pt),n.updateRenderState({layers:[f]}),t.setPixelRatio(1),t.setSize(f.textureWidth,f.textureHeight,!1),y=new ze(f.textureWidth,f.textureHeight,{format:Ue,type:$i,depthTexture:new Zs(f.textureWidth,f.textureHeight,ht,void 0,void 0,void 0,void 0,void 0,void 0,J),stencilBuffer:p.stencil,colorSpace:t.outputColorSpace,samples:p.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await n.requestReferenceSpace(o),tt.setContext(n),tt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(n!==null)return n.environmentBlendMode},this.getDepthTexture=function(){return x.getDepthTexture()};function X(O){for(let J=0;J<O.removed.length;J++){const ht=O.removed[J],st=v.indexOf(ht);st>=0&&(v[st]=null,M[st].disconnect(ht))}for(let J=0;J<O.added.length;J++){const ht=O.added[J];let st=v.indexOf(ht);if(st===-1){for(let kt=0;kt<M.length;kt++)if(kt>=v.length){v.push(ht),st=kt;break}else if(v[kt]===null){v[kt]=ht,st=kt;break}if(st===-1)break}const Pt=M[st];Pt&&Pt.connect(ht)}}const q=new D,$=new D;function B(O,J,ht){q.setFromMatrixPosition(J.matrixWorld),$.setFromMatrixPosition(ht.matrixWorld);const st=q.distanceTo($),Pt=J.projectionMatrix.elements,kt=ht.projectionMatrix.elements,ot=Pt[14]/(Pt[10]-1),mt=Pt[14]/(Pt[10]+1),Z=(Pt[9]+1)/Pt[5],at=(Pt[9]-1)/Pt[5],L=(Pt[8]-1)/Pt[0],At=(kt[8]+1)/kt[0],rt=ot*L,vt=ot*At,ct=st/(-L+At),Ot=ct*-L;if(J.matrixWorld.decompose(O.position,O.quaternion,O.scale),O.translateX(Ot),O.translateZ(ct),O.matrixWorld.compose(O.position,O.quaternion,O.scale),O.matrixWorldInverse.copy(O.matrixWorld).invert(),Pt[10]===-1)O.projectionMatrix.copy(J.projectionMatrix),O.projectionMatrixInverse.copy(J.projectionMatrixInverse);else{const _t=ot+ct,R=mt+ct,E=rt-Ot,H=vt+(st-Ot),K=Z*mt/R*_t,nt=at*mt/R*_t;O.projectionMatrix.makePerspective(E,H,K,nt,_t,R),O.projectionMatrixInverse.copy(O.projectionMatrix).invert()}}function ft(O,J){J===null?O.matrixWorld.copy(O.matrix):O.matrixWorld.multiplyMatrices(J.matrixWorld,O.matrix),O.matrixWorldInverse.copy(O.matrixWorld).invert()}this.updateCamera=function(O){if(n===null)return;let J=O.near,ht=O.far;x.texture!==null&&(x.depthNear>0&&(J=x.depthNear),x.depthFar>0&&(ht=x.depthFar)),S.near=C.near=T.near=J,S.far=C.far=T.far=ht,(P!==S.near||z!==S.far)&&(n.updateRenderState({depthNear:S.near,depthFar:S.far}),P=S.near,z=S.far),T.layers.mask=O.layers.mask|2,C.layers.mask=O.layers.mask|4,S.layers.mask=T.layers.mask|C.layers.mask;const st=O.parent,Pt=S.cameras;ft(S,st);for(let kt=0;kt<Pt.length;kt++)ft(Pt[kt],st);Pt.length===2?B(S,T,C):S.projectionMatrix.copy(T.projectionMatrix),dt(O,S,st)};function dt(O,J,ht){ht===null?O.matrix.copy(J.matrixWorld):(O.matrix.copy(ht.matrixWorld),O.matrix.invert(),O.matrix.multiply(J.matrixWorld)),O.matrix.decompose(O.position,O.quaternion,O.scale),O.updateMatrixWorld(!0),O.projectionMatrix.copy(J.projectionMatrix),O.projectionMatrixInverse.copy(J.projectionMatrixInverse),O.isPerspectiveCamera&&(O.fov=la*2*Math.atan(1/O.projectionMatrix.elements[5]),O.zoom=1)}this.getCamera=function(){return S},this.getFoveation=function(){if(!(f===null&&d===null))return l},this.setFoveation=function(O){l=O,f!==null&&(f.fixedFoveation=O),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=O)},this.hasDepthSensing=function(){return x.texture!==null},this.getDepthSensingMesh=function(){return x.getMesh(S)};let xt=null;function Gt(O,J){if(h=J.getViewerPose(c||a),g=J,h!==null){const ht=h.views;d!==null&&(t.setRenderTargetFramebuffer(y,d.framebuffer),t.setRenderTarget(y));let st=!1;ht.length!==S.cameras.length&&(S.cameras.length=0,st=!0);for(let kt=0;kt<ht.length;kt++){const ot=ht[kt];let mt=null;if(d!==null)mt=d.getViewport(ot);else{const at=u.getViewSubImage(f,ot);mt=at.viewport,kt===0&&(t.setRenderTargetTextures(y,at.colorTexture,f.ignoreDepthValues?void 0:at.depthStencilTexture),t.setRenderTarget(y))}let Z=w[kt];Z===void 0&&(Z=new ni,Z.layers.enable(kt),Z.viewport=new ye,w[kt]=Z),Z.matrix.fromArray(ot.transform.matrix),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.projectionMatrix.fromArray(ot.projectionMatrix),Z.projectionMatrixInverse.copy(Z.projectionMatrix).invert(),Z.viewport.set(mt.x,mt.y,mt.width,mt.height),kt===0&&(S.matrix.copy(Z.matrix),S.matrix.decompose(S.position,S.quaternion,S.scale)),st===!0&&S.cameras.push(Z)}const Pt=n.enabledFeatures;if(Pt&&Pt.includes("depth-sensing")){const kt=u.getDepthInformation(ht[0]);kt&&kt.isValid&&kt.texture&&x.init(t,kt,n.renderState)}}for(let ht=0;ht<M.length;ht++){const st=v[ht],Pt=M[ht];st!==null&&Pt!==void 0&&Pt.update(st,J,c||a)}xt&&xt(O,J),J.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:J}),g=null}const tt=new tu;tt.setAnimationLoop(Gt),this.setAnimationLoop=function(O){xt=O},this.dispose=function(){}}}const An=new zi,_g=new Vt;function Tg(r,t){function e(p,m){p.matrixAutoUpdate===!0&&p.updateMatrix(),m.value.copy(p.matrix)}function i(p,m){m.color.getRGB(p.fogColor.value,Qh(r)),m.isFog?(p.fogNear.value=m.near,p.fogFar.value=m.far):m.isFogExp2&&(p.fogDensity.value=m.density)}function n(p,m,y,M,v){m.isMeshBasicMaterial||m.isMeshLambertMaterial?s(p,m):m.isMeshToonMaterial?(s(p,m),u(p,m)):m.isMeshPhongMaterial?(s(p,m),h(p,m)):m.isMeshStandardMaterial?(s(p,m),f(p,m),m.isMeshPhysicalMaterial&&d(p,m,v)):m.isMeshMatcapMaterial?(s(p,m),g(p,m)):m.isMeshDepthMaterial?s(p,m):m.isMeshDistanceMaterial?(s(p,m),x(p,m)):m.isMeshNormalMaterial?s(p,m):m.isLineBasicMaterial?(a(p,m),m.isLineDashedMaterial&&o(p,m)):m.isPointsMaterial?l(p,m,y,M):m.isSpriteMaterial?c(p,m):m.isShadowMaterial?(p.color.value.copy(m.color),p.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function s(p,m){p.opacity.value=m.opacity,m.color&&p.diffuse.value.copy(m.color),m.emissive&&p.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(p.map.value=m.map,e(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,e(m.alphaMap,p.alphaMapTransform)),m.bumpMap&&(p.bumpMap.value=m.bumpMap,e(m.bumpMap,p.bumpMapTransform),p.bumpScale.value=m.bumpScale,m.side===$e&&(p.bumpScale.value*=-1)),m.normalMap&&(p.normalMap.value=m.normalMap,e(m.normalMap,p.normalMapTransform),p.normalScale.value.copy(m.normalScale),m.side===$e&&p.normalScale.value.negate()),m.displacementMap&&(p.displacementMap.value=m.displacementMap,e(m.displacementMap,p.displacementMapTransform),p.displacementScale.value=m.displacementScale,p.displacementBias.value=m.displacementBias),m.emissiveMap&&(p.emissiveMap.value=m.emissiveMap,e(m.emissiveMap,p.emissiveMapTransform)),m.specularMap&&(p.specularMap.value=m.specularMap,e(m.specularMap,p.specularMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest);const y=t.get(m),M=y.envMap,v=y.envMapRotation;M&&(p.envMap.value=M,An.copy(v),An.x*=-1,An.y*=-1,An.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(An.y*=-1,An.z*=-1),p.envMapRotation.value.setFromMatrix4(_g.makeRotationFromEuler(An)),p.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=m.reflectivity,p.ior.value=m.ior,p.refractionRatio.value=m.refractionRatio),m.lightMap&&(p.lightMap.value=m.lightMap,p.lightMapIntensity.value=m.lightMapIntensity,e(m.lightMap,p.lightMapTransform)),m.aoMap&&(p.aoMap.value=m.aoMap,p.aoMapIntensity.value=m.aoMapIntensity,e(m.aoMap,p.aoMapTransform))}function a(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,m.map&&(p.map.value=m.map,e(m.map,p.mapTransform))}function o(p,m){p.dashSize.value=m.dashSize,p.totalSize.value=m.dashSize+m.gapSize,p.scale.value=m.scale}function l(p,m,y,M){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.size.value=m.size*y,p.scale.value=M*.5,m.map&&(p.map.value=m.map,e(m.map,p.uvTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,e(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function c(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.rotation.value=m.rotation,m.map&&(p.map.value=m.map,e(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,e(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function h(p,m){p.specular.value.copy(m.specular),p.shininess.value=Math.max(m.shininess,1e-4)}function u(p,m){m.gradientMap&&(p.gradientMap.value=m.gradientMap)}function f(p,m){p.metalness.value=m.metalness,m.metalnessMap&&(p.metalnessMap.value=m.metalnessMap,e(m.metalnessMap,p.metalnessMapTransform)),p.roughness.value=m.roughness,m.roughnessMap&&(p.roughnessMap.value=m.roughnessMap,e(m.roughnessMap,p.roughnessMapTransform)),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)}function d(p,m,y){p.ior.value=m.ior,m.sheen>0&&(p.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),p.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(p.sheenColorMap.value=m.sheenColorMap,e(m.sheenColorMap,p.sheenColorMapTransform)),m.sheenRoughnessMap&&(p.sheenRoughnessMap.value=m.sheenRoughnessMap,e(m.sheenRoughnessMap,p.sheenRoughnessMapTransform))),m.clearcoat>0&&(p.clearcoat.value=m.clearcoat,p.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(p.clearcoatMap.value=m.clearcoatMap,e(m.clearcoatMap,p.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,e(m.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(p.clearcoatNormalMap.value=m.clearcoatNormalMap,e(m.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===$e&&p.clearcoatNormalScale.value.negate())),m.dispersion>0&&(p.dispersion.value=m.dispersion),m.iridescence>0&&(p.iridescence.value=m.iridescence,p.iridescenceIOR.value=m.iridescenceIOR,p.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(p.iridescenceMap.value=m.iridescenceMap,e(m.iridescenceMap,p.iridescenceMapTransform)),m.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=m.iridescenceThicknessMap,e(m.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),m.transmission>0&&(p.transmission.value=m.transmission,p.transmissionSamplerMap.value=y.texture,p.transmissionSamplerSize.value.set(y.width,y.height),m.transmissionMap&&(p.transmissionMap.value=m.transmissionMap,e(m.transmissionMap,p.transmissionMapTransform)),p.thickness.value=m.thickness,m.thicknessMap&&(p.thicknessMap.value=m.thicknessMap,e(m.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=m.attenuationDistance,p.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(p.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(p.anisotropyMap.value=m.anisotropyMap,e(m.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=m.specularIntensity,p.specularColor.value.copy(m.specularColor),m.specularColorMap&&(p.specularColorMap.value=m.specularColorMap,e(m.specularColorMap,p.specularColorMapTransform)),m.specularIntensityMap&&(p.specularIntensityMap.value=m.specularIntensityMap,e(m.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,m){m.matcap&&(p.matcap.value=m.matcap)}function x(p,m){const y=t.get(m).light;p.referencePosition.value.setFromMatrixPosition(y.matrixWorld),p.nearDistance.value=y.shadow.camera.near,p.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:n}}function Eg(r,t,e,i){let n={},s={},a=[];const o=r.getParameter(r.MAX_UNIFORM_BUFFER_BINDINGS);function l(y,M){const v=M.program;i.uniformBlockBinding(y,v)}function c(y,M){let v=n[y.id];v===void 0&&(g(y),v=h(y),n[y.id]=v,y.addEventListener("dispose",p));const b=M.program;i.updateUBOMapping(y,b);const _=t.render.frame;s[y.id]!==_&&(f(y),s[y.id]=_)}function h(y){const M=u();y.__bindingPointIndex=M;const v=r.createBuffer(),b=y.__size,_=y.usage;return r.bindBuffer(r.UNIFORM_BUFFER,v),r.bufferData(r.UNIFORM_BUFFER,b,_),r.bindBuffer(r.UNIFORM_BUFFER,null),r.bindBufferBase(r.UNIFORM_BUFFER,M,v),v}function u(){for(let y=0;y<o;y++)if(a.indexOf(y)===-1)return a.push(y),y;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(y){const M=n[y.id],v=y.uniforms,b=y.__cache;r.bindBuffer(r.UNIFORM_BUFFER,M);for(let _=0,T=v.length;_<T;_++){const C=Array.isArray(v[_])?v[_]:[v[_]];for(let w=0,S=C.length;w<S;w++){const P=C[w];if(d(P,_,w,b)===!0){const z=P.__offset,I=Array.isArray(P.value)?P.value:[P.value];let U=0;for(let X=0;X<I.length;X++){const q=I[X],$=x(q);typeof q=="number"||typeof q=="boolean"?(P.__data[0]=q,r.bufferSubData(r.UNIFORM_BUFFER,z+U,P.__data)):q.isMatrix3?(P.__data[0]=q.elements[0],P.__data[1]=q.elements[1],P.__data[2]=q.elements[2],P.__data[3]=0,P.__data[4]=q.elements[3],P.__data[5]=q.elements[4],P.__data[6]=q.elements[5],P.__data[7]=0,P.__data[8]=q.elements[6],P.__data[9]=q.elements[7],P.__data[10]=q.elements[8],P.__data[11]=0):(q.toArray(P.__data,U),U+=$.storage/Float32Array.BYTES_PER_ELEMENT)}r.bufferSubData(r.UNIFORM_BUFFER,z,P.__data)}}}r.bindBuffer(r.UNIFORM_BUFFER,null)}function d(y,M,v,b){const _=y.value,T=M+"_"+v;if(b[T]===void 0)return typeof _=="number"||typeof _=="boolean"?b[T]=_:b[T]=_.clone(),!0;{const C=b[T];if(typeof _=="number"||typeof _=="boolean"){if(C!==_)return b[T]=_,!0}else if(C.equals(_)===!1)return C.copy(_),!0}return!1}function g(y){const M=y.uniforms;let v=0;const b=16;for(let T=0,C=M.length;T<C;T++){const w=Array.isArray(M[T])?M[T]:[M[T]];for(let S=0,P=w.length;S<P;S++){const z=w[S],I=Array.isArray(z.value)?z.value:[z.value];for(let U=0,X=I.length;U<X;U++){const q=I[U],$=x(q),B=v%b,ft=B%$.boundary,dt=B+ft;v+=ft,dt!==0&&b-dt<$.storage&&(v+=b-dt),z.__data=new Float32Array($.storage/Float32Array.BYTES_PER_ELEMENT),z.__offset=v,v+=$.storage}}}const _=v%b;return _>0&&(v+=b-_),y.__size=v,y.__cache={},this}function x(y){const M={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(M.boundary=4,M.storage=4):y.isVector2?(M.boundary=8,M.storage=8):y.isVector3||y.isColor?(M.boundary=16,M.storage=12):y.isVector4?(M.boundary=16,M.storage=16):y.isMatrix3?(M.boundary=48,M.storage=48):y.isMatrix4?(M.boundary=64,M.storage=64):y.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",y),M}function p(y){const M=y.target;M.removeEventListener("dispose",p);const v=a.indexOf(M.__bindingPointIndex);a.splice(v,1),r.deleteBuffer(n[M.id]),delete n[M.id],delete s[M.id]}function m(){for(const y in n)r.deleteBuffer(n[y]);a=[],n={},s={}}return{bind:l,update:c,dispose:m}}class Ag{constructor(t={}){const{canvas:e=gf(),context:i=null,depth:n=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:f=!1}=t;this.isWebGLRenderer=!0;let d;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=i.getContextAttributes().alpha}else d=a;const g=new Uint32Array(4),x=new Int32Array(4);let p=null,m=null;const y=[],M=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=ii,this.toneMapping=mn,this.toneMappingExposure=1;const v=this;let b=!1,_=0,T=0,C=null,w=-1,S=null;const P=new ye,z=new ye;let I=null;const U=new j(0);let X=0,q=e.width,$=e.height,B=1,ft=null,dt=null;const xt=new ye(0,0,q,$),Gt=new ye(0,0,q,$);let tt=!1;const O=new Ml;let J=!1,ht=!1;const st=new Vt,Pt=new Vt,kt=new D,ot=new ye,mt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Z=!1;function at(){return C===null?B:1}let L=i;function At(A,F){return e.getContext(A,F)}try{const A={alpha:!0,depth:n,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${pa}`),e.addEventListener("webglcontextlost",et,!1),e.addEventListener("webglcontextrestored",wt,!1),e.addEventListener("webglcontextcreationerror",Mt,!1),L===null){const F="webgl2";if(L=At(F,A),L===null)throw At(F)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(A){throw console.error("THREE.WebGLRenderer: "+A.message),A}let rt,vt,ct,Ot,_t,R,E,H,K,nt,Q,Lt,gt,Tt,ee,lt,Ct,Bt,Wt,Rt,ne,Qt,Me,N;function yt(){rt=new L0(L),rt.init(),Qt=new xg(L,rt),vt=new E0(L,rt,t,Qt),ct=new pg(L,rt),vt.reverseDepthBuffer&&f&&ct.buffers.depth.setReversed(!0),Ot=new U0(L),_t=new $m,R=new gg(L,rt,ct,_t,vt,Qt,Ot),E=new C0(v),H=new D0(v),K=new Gf(L),Me=new _0(L,K),nt=new z0(L,K,Ot,Me),Q=new F0(L,nt,K,Ot),Wt=new N0(L,vt,R),lt=new A0(_t),Lt=new Jm(v,E,H,rt,vt,Me,lt),gt=new Tg(v,_t),Tt=new eg,ee=new og(rt),Bt=new b0(v,E,H,ct,Q,d,l),Ct=new fg(v,Q,vt),N=new Eg(L,Ot,vt,ct),Rt=new T0(L,rt,Ot),ne=new I0(L,rt,Ot),Ot.programs=Lt.programs,v.capabilities=vt,v.extensions=rt,v.properties=_t,v.renderLists=Tt,v.shadowMap=Ct,v.state=ct,v.info=Ot}yt();const Y=new bg(v,L);this.xr=Y,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){const A=rt.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){const A=rt.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return B},this.setPixelRatio=function(A){A!==void 0&&(B=A,this.setSize(q,$,!1))},this.getSize=function(A){return A.set(q,$)},this.setSize=function(A,F,V=!0){if(Y.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}q=A,$=F,e.width=Math.floor(A*B),e.height=Math.floor(F*B),V===!0&&(e.style.width=A+"px",e.style.height=F+"px"),this.setViewport(0,0,A,F)},this.getDrawingBufferSize=function(A){return A.set(q*B,$*B).floor()},this.setDrawingBufferSize=function(A,F,V){q=A,$=F,B=V,e.width=Math.floor(A*V),e.height=Math.floor(F*V),this.setViewport(0,0,A,F)},this.getCurrentViewport=function(A){return A.copy(P)},this.getViewport=function(A){return A.copy(xt)},this.setViewport=function(A,F,V,W){A.isVector4?xt.set(A.x,A.y,A.z,A.w):xt.set(A,F,V,W),ct.viewport(P.copy(xt).multiplyScalar(B).round())},this.getScissor=function(A){return A.copy(Gt)},this.setScissor=function(A,F,V,W){A.isVector4?Gt.set(A.x,A.y,A.z,A.w):Gt.set(A,F,V,W),ct.scissor(z.copy(Gt).multiplyScalar(B).round())},this.getScissorTest=function(){return tt},this.setScissorTest=function(A){ct.setScissorTest(tt=A)},this.setOpaqueSort=function(A){ft=A},this.setTransparentSort=function(A){dt=A},this.getClearColor=function(A){return A.copy(Bt.getClearColor())},this.setClearColor=function(){Bt.setClearColor.apply(Bt,arguments)},this.getClearAlpha=function(){return Bt.getClearAlpha()},this.setClearAlpha=function(){Bt.setClearAlpha.apply(Bt,arguments)},this.clear=function(A=!0,F=!0,V=!0){let W=0;if(A){let k=!1;if(C!==null){const ut=C.texture.format;k=ut===yl||ut===vl||ut===xl}if(k){const ut=C.texture.type,St=ut===$i||ut===Di||ut===tr||ut===Fn||ut===ml||ut===gl,zt=Bt.getClearColor(),It=Bt.getClearAlpha(),Xt=zt.r,Yt=zt.g,Ut=zt.b;St?(g[0]=Xt,g[1]=Yt,g[2]=Ut,g[3]=It,L.clearBufferuiv(L.COLOR,0,g)):(x[0]=Xt,x[1]=Yt,x[2]=Ut,x[3]=It,L.clearBufferiv(L.COLOR,0,x))}else W|=L.COLOR_BUFFER_BIT}F&&(W|=L.DEPTH_BUFFER_BIT),V&&(W|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),L.clear(W)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",et,!1),e.removeEventListener("webglcontextrestored",wt,!1),e.removeEventListener("webglcontextcreationerror",Mt,!1),Tt.dispose(),ee.dispose(),_t.dispose(),E.dispose(),H.dispose(),Q.dispose(),Me.dispose(),N.dispose(),Lt.dispose(),Y.dispose(),Y.removeEventListener("sessionstart",Nl),Y.removeEventListener("sessionend",Fl),Sn.stop()};function et(A){A.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),b=!0}function wt(){console.log("THREE.WebGLRenderer: Context Restored."),b=!1;const A=Ot.autoReset,F=Ct.enabled,V=Ct.autoUpdate,W=Ct.needsUpdate,k=Ct.type;yt(),Ot.autoReset=A,Ct.enabled=F,Ct.autoUpdate=V,Ct.needsUpdate=W,Ct.type=k}function Mt(A){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function qt(A){const F=A.target;F.removeEventListener("dispose",qt),Re(F)}function Re(A){We(A),_t.remove(A)}function We(A){const F=_t.get(A).programs;F!==void 0&&(F.forEach(function(V){Lt.releaseProgram(V)}),A.isShaderMaterial&&Lt.releaseShaderCache(A))}this.renderBufferDirect=function(A,F,V,W,k,ut){F===null&&(F=mt);const St=k.isMesh&&k.matrixWorld.determinant()<0,zt=Du(A,F,V,W,k);ct.setMaterial(W,St);let It=V.index,Xt=1;if(W.wireframe===!0){if(It=nt.getWireframeAttribute(V),It===void 0)return;Xt=2}const Yt=V.drawRange,Ut=V.attributes.position;let le=Yt.start*Xt,Se=(Yt.start+Yt.count)*Xt;ut!==null&&(le=Math.max(le,ut.start*Xt),Se=Math.min(Se,(ut.start+ut.count)*Xt)),It!==null?(le=Math.max(le,0),Se=Math.min(Se,It.count)):Ut!=null&&(le=Math.max(le,0),Se=Math.min(Se,Ut.count));const be=Se-le;if(be<0||be===1/0)return;Me.setup(k,W,zt,V,It);let ti,ce=Rt;if(It!==null&&(ti=K.get(It),ce=ne,ce.setIndex(ti)),k.isMesh)W.wireframe===!0?(ct.setLineWidth(W.wireframeLinewidth*at()),ce.setMode(L.LINES)):ce.setMode(L.TRIANGLES);else if(k.isLine){let Nt=W.linewidth;Nt===void 0&&(Nt=1),ct.setLineWidth(Nt*at()),k.isLineSegments?ce.setMode(L.LINES):k.isLineLoop?ce.setMode(L.LINE_LOOP):ce.setMode(L.LINE_STRIP)}else k.isPoints?ce.setMode(L.POINTS):k.isSprite&&ce.setMode(L.TRIANGLES);if(k.isBatchedMesh)if(k._multiDrawInstances!==null)ce.renderMultiDrawInstances(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount,k._multiDrawInstances);else if(rt.get("WEBGL_multi_draw"))ce.renderMultiDraw(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount);else{const Nt=k._multiDrawStarts,ki=k._multiDrawCounts,he=k._multiDrawCount,mi=It?K.get(It).bytesPerElement:1,Wn=_t.get(W).currentProgram.getUniforms();for(let si=0;si<he;si++)Wn.setValue(L,"_gl_DrawID",si),ce.render(Nt[si]/mi,ki[si])}else if(k.isInstancedMesh)ce.renderInstances(le,be,k.count);else if(V.isInstancedBufferGeometry){const Nt=V._maxInstanceCount!==void 0?V._maxInstanceCount:1/0,ki=Math.min(V.instanceCount,Nt);ce.renderInstances(le,be,ki)}else ce.render(le,be)};function ge(A,F,V){A.transparent===!0&&A.side===Ve&&A.forceSinglePass===!1?(A.side=$e,A.needsUpdate=!0,dr(A,F,V),A.side=vn,A.needsUpdate=!0,dr(A,F,V),A.side=Ve):dr(A,F,V)}this.compile=function(A,F,V=null){V===null&&(V=A),m=ee.get(V),m.init(F),M.push(m),V.traverseVisible(function(k){k.isLight&&k.layers.test(F.layers)&&(m.pushLight(k),k.castShadow&&m.pushShadow(k))}),A!==V&&A.traverseVisible(function(k){k.isLight&&k.layers.test(F.layers)&&(m.pushLight(k),k.castShadow&&m.pushShadow(k))}),m.setupLights();const W=new Set;return A.traverse(function(k){if(!(k.isMesh||k.isPoints||k.isLine||k.isSprite))return;const ut=k.material;if(ut)if(Array.isArray(ut))for(let St=0;St<ut.length;St++){const zt=ut[St];ge(zt,V,k),W.add(zt)}else ge(ut,V,k),W.add(ut)}),M.pop(),m=null,W},this.compileAsync=function(A,F,V=null){const W=this.compile(A,F,V);return new Promise(k=>{function ut(){if(W.forEach(function(St){_t.get(St).currentProgram.isReady()&&W.delete(St)}),W.size===0){k(A);return}setTimeout(ut,10)}rt.get("KHR_parallel_shader_compile")!==null?ut():setTimeout(ut,10)})};let pi=null;function Fi(A){pi&&pi(A)}function Nl(){Sn.stop()}function Fl(){Sn.start()}const Sn=new tu;Sn.setAnimationLoop(Fi),typeof self<"u"&&Sn.setContext(self),this.setAnimationLoop=function(A){pi=A,Y.setAnimationLoop(A),A===null?Sn.stop():Sn.start()},Y.addEventListener("sessionstart",Nl),Y.addEventListener("sessionend",Fl),this.render=function(A,F){if(F!==void 0&&F.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(b===!0)return;if(A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),Y.enabled===!0&&Y.isPresenting===!0&&(Y.cameraAutoUpdate===!0&&Y.updateCamera(F),F=Y.getCamera()),A.isScene===!0&&A.onBeforeRender(v,A,F,C),m=ee.get(A,M.length),m.init(F),M.push(m),Pt.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),O.setFromProjectionMatrix(Pt),ht=this.localClippingEnabled,J=lt.init(this.clippingPlanes,ht),p=Tt.get(A,y.length),p.init(),y.push(p),Y.enabled===!0&&Y.isPresenting===!0){const ut=v.xr.getDepthSensingMesh();ut!==null&&ba(ut,F,-1/0,v.sortObjects)}ba(A,F,0,v.sortObjects),p.finish(),v.sortObjects===!0&&p.sort(ft,dt),Z=Y.enabled===!1||Y.isPresenting===!1||Y.hasDepthSensing()===!1,Z&&Bt.addToRenderList(p,A),this.info.render.frame++,J===!0&&lt.beginShadows();const V=m.state.shadowsArray;Ct.render(V,A,F),J===!0&&lt.endShadows(),this.info.autoReset===!0&&this.info.reset();const W=p.opaque,k=p.transmissive;if(m.setupLights(),F.isArrayCamera){const ut=F.cameras;if(k.length>0)for(let St=0,zt=ut.length;St<zt;St++){const It=ut[St];Ol(W,k,A,It)}Z&&Bt.render(A);for(let St=0,zt=ut.length;St<zt;St++){const It=ut[St];kl(p,A,It,It.viewport)}}else k.length>0&&Ol(W,k,A,F),Z&&Bt.render(A),kl(p,A,F);C!==null&&(R.updateMultisampleRenderTarget(C),R.updateRenderTargetMipmap(C)),A.isScene===!0&&A.onAfterRender(v,A,F),Me.resetDefaultState(),w=-1,S=null,M.pop(),M.length>0?(m=M[M.length-1],J===!0&&lt.setGlobalState(v.clippingPlanes,m.state.camera)):m=null,y.pop(),y.length>0?p=y[y.length-1]:p=null};function ba(A,F,V,W){if(A.visible===!1)return;if(A.layers.test(F.layers)){if(A.isGroup)V=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(F);else if(A.isLight)m.pushLight(A),A.castShadow&&m.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||O.intersectsSprite(A)){W&&ot.setFromMatrixPosition(A.matrixWorld).applyMatrix4(Pt);const St=Q.update(A),zt=A.material;zt.visible&&p.push(A,St,zt,V,ot.z,null)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||O.intersectsObject(A))){const St=Q.update(A),zt=A.material;if(W&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),ot.copy(A.boundingSphere.center)):(St.boundingSphere===null&&St.computeBoundingSphere(),ot.copy(St.boundingSphere.center)),ot.applyMatrix4(A.matrixWorld).applyMatrix4(Pt)),Array.isArray(zt)){const It=St.groups;for(let Xt=0,Yt=It.length;Xt<Yt;Xt++){const Ut=It[Xt],le=zt[Ut.materialIndex];le&&le.visible&&p.push(A,St,le,V,ot.z,Ut)}}else zt.visible&&p.push(A,St,zt,V,ot.z,null)}}const ut=A.children;for(let St=0,zt=ut.length;St<zt;St++)ba(ut[St],F,V,W)}function kl(A,F,V,W){const k=A.opaque,ut=A.transmissive,St=A.transparent;m.setupLightsView(V),J===!0&&lt.setGlobalState(v.clippingPlanes,V),W&&ct.viewport(P.copy(W)),k.length>0&&fr(k,F,V),ut.length>0&&fr(ut,F,V),St.length>0&&fr(St,F,V),ct.buffers.depth.setTest(!0),ct.buffers.depth.setMask(!0),ct.buffers.color.setMask(!0),ct.setPolygonOffset(!1)}function Ol(A,F,V,W){if((V.isScene===!0?V.overrideMaterial:null)!==null)return;m.state.transmissionRenderTarget[W.id]===void 0&&(m.state.transmissionRenderTarget[W.id]=new ze(1,1,{generateMipmaps:!0,type:rt.has("EXT_color_buffer_half_float")||rt.has("EXT_color_buffer_float")?Je:$i,minFilter:pn,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:re.workingColorSpace}));const ut=m.state.transmissionRenderTarget[W.id],St=W.viewport||P;ut.setSize(St.z,St.w);const zt=v.getRenderTarget();v.setRenderTarget(ut),v.getClearColor(U),X=v.getClearAlpha(),X<1&&v.setClearColor(16777215,.5),v.clear(),Z&&Bt.render(V);const It=v.toneMapping;v.toneMapping=mn;const Xt=W.viewport;if(W.viewport!==void 0&&(W.viewport=void 0),m.setupLightsView(W),J===!0&&lt.setGlobalState(v.clippingPlanes,W),fr(A,V,W),R.updateMultisampleRenderTarget(ut),R.updateRenderTargetMipmap(ut),rt.has("WEBGL_multisampled_render_to_texture")===!1){let Yt=!1;for(let Ut=0,le=F.length;Ut<le;Ut++){const Se=F[Ut],be=Se.object,ti=Se.geometry,ce=Se.material,Nt=Se.group;if(ce.side===Ve&&be.layers.test(W.layers)){const ki=ce.side;ce.side=$e,ce.needsUpdate=!0,Bl(be,V,W,ti,ce,Nt),ce.side=ki,ce.needsUpdate=!0,Yt=!0}}Yt===!0&&(R.updateMultisampleRenderTarget(ut),R.updateRenderTargetMipmap(ut))}v.setRenderTarget(zt),v.setClearColor(U,X),Xt!==void 0&&(W.viewport=Xt),v.toneMapping=It}function fr(A,F,V){const W=F.isScene===!0?F.overrideMaterial:null;for(let k=0,ut=A.length;k<ut;k++){const St=A[k],zt=St.object,It=St.geometry,Xt=W===null?St.material:W,Yt=St.group;zt.layers.test(V.layers)&&Bl(zt,F,V,It,Xt,Yt)}}function Bl(A,F,V,W,k,ut){A.onBeforeRender(v,F,V,W,k,ut),A.modelViewMatrix.multiplyMatrices(V.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),k.onBeforeRender(v,F,V,W,A,ut),k.transparent===!0&&k.side===Ve&&k.forceSinglePass===!1?(k.side=$e,k.needsUpdate=!0,v.renderBufferDirect(V,F,W,k,A,ut),k.side=vn,k.needsUpdate=!0,v.renderBufferDirect(V,F,W,k,A,ut),k.side=Ve):v.renderBufferDirect(V,F,W,k,A,ut),A.onAfterRender(v,F,V,W,k,ut)}function dr(A,F,V){F.isScene!==!0&&(F=mt);const W=_t.get(A),k=m.state.lights,ut=m.state.shadowsArray,St=k.state.version,zt=Lt.getParameters(A,k.state,ut,F,V),It=Lt.getProgramCacheKey(zt);let Xt=W.programs;W.environment=A.isMeshStandardMaterial?F.environment:null,W.fog=F.fog,W.envMap=(A.isMeshStandardMaterial?H:E).get(A.envMap||W.environment),W.envMapRotation=W.environment!==null&&A.envMap===null?F.environmentRotation:A.envMapRotation,Xt===void 0&&(A.addEventListener("dispose",qt),Xt=new Map,W.programs=Xt);let Yt=Xt.get(It);if(Yt!==void 0){if(W.currentProgram===Yt&&W.lightsStateVersion===St)return Gl(A,zt),Yt}else zt.uniforms=Lt.getUniforms(A),A.onBeforeCompile(zt,v),Yt=Lt.acquireProgram(zt,It),Xt.set(It,Yt),W.uniforms=zt.uniforms;const Ut=W.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(Ut.clippingPlanes=lt.uniform),Gl(A,zt),W.needsLights=zu(A),W.lightsStateVersion=St,W.needsLights&&(Ut.ambientLightColor.value=k.state.ambient,Ut.lightProbe.value=k.state.probe,Ut.directionalLights.value=k.state.directional,Ut.directionalLightShadows.value=k.state.directionalShadow,Ut.spotLights.value=k.state.spot,Ut.spotLightShadows.value=k.state.spotShadow,Ut.rectAreaLights.value=k.state.rectArea,Ut.ltc_1.value=k.state.rectAreaLTC1,Ut.ltc_2.value=k.state.rectAreaLTC2,Ut.pointLights.value=k.state.point,Ut.pointLightShadows.value=k.state.pointShadow,Ut.hemisphereLights.value=k.state.hemi,Ut.directionalShadowMap.value=k.state.directionalShadowMap,Ut.directionalShadowMatrix.value=k.state.directionalShadowMatrix,Ut.spotShadowMap.value=k.state.spotShadowMap,Ut.spotLightMatrix.value=k.state.spotLightMatrix,Ut.spotLightMap.value=k.state.spotLightMap,Ut.pointShadowMap.value=k.state.pointShadowMap,Ut.pointShadowMatrix.value=k.state.pointShadowMatrix),W.currentProgram=Yt,W.uniformsList=null,Yt}function Hl(A){if(A.uniformsList===null){const F=A.currentProgram.getUniforms();A.uniformsList=ra.seqWithValue(F.seq,A.uniforms)}return A.uniformsList}function Gl(A,F){const V=_t.get(A);V.outputColorSpace=F.outputColorSpace,V.batching=F.batching,V.batchingColor=F.batchingColor,V.instancing=F.instancing,V.instancingColor=F.instancingColor,V.instancingMorph=F.instancingMorph,V.skinning=F.skinning,V.morphTargets=F.morphTargets,V.morphNormals=F.morphNormals,V.morphColors=F.morphColors,V.morphTargetsCount=F.morphTargetsCount,V.numClippingPlanes=F.numClippingPlanes,V.numIntersection=F.numClipIntersection,V.vertexAlphas=F.vertexAlphas,V.vertexTangents=F.vertexTangents,V.toneMapping=F.toneMapping}function Du(A,F,V,W,k){F.isScene!==!0&&(F=mt),R.resetTextureUnits();const ut=F.fog,St=W.isMeshStandardMaterial?F.environment:null,zt=C===null?v.outputColorSpace:C.isXRRenderTarget===!0?C.texture.colorSpace:_s,It=(W.isMeshStandardMaterial?H:E).get(W.envMap||St),Xt=W.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,Yt=!!V.attributes.tangent&&(!!W.normalMap||W.anisotropy>0),Ut=!!V.morphAttributes.position,le=!!V.morphAttributes.normal,Se=!!V.morphAttributes.color;let be=mn;W.toneMapped&&(C===null||C.isXRRenderTarget===!0)&&(be=v.toneMapping);const ti=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,ce=ti!==void 0?ti.length:0,Nt=_t.get(W),ki=m.state.lights;if(J===!0&&(ht===!0||A!==S)){const oi=A===S&&W.id===w;lt.setState(W,A,oi)}let he=!1;W.version===Nt.__version?(Nt.needsLights&&Nt.lightsStateVersion!==ki.state.version||Nt.outputColorSpace!==zt||k.isBatchedMesh&&Nt.batching===!1||!k.isBatchedMesh&&Nt.batching===!0||k.isBatchedMesh&&Nt.batchingColor===!0&&k.colorTexture===null||k.isBatchedMesh&&Nt.batchingColor===!1&&k.colorTexture!==null||k.isInstancedMesh&&Nt.instancing===!1||!k.isInstancedMesh&&Nt.instancing===!0||k.isSkinnedMesh&&Nt.skinning===!1||!k.isSkinnedMesh&&Nt.skinning===!0||k.isInstancedMesh&&Nt.instancingColor===!0&&k.instanceColor===null||k.isInstancedMesh&&Nt.instancingColor===!1&&k.instanceColor!==null||k.isInstancedMesh&&Nt.instancingMorph===!0&&k.morphTexture===null||k.isInstancedMesh&&Nt.instancingMorph===!1&&k.morphTexture!==null||Nt.envMap!==It||W.fog===!0&&Nt.fog!==ut||Nt.numClippingPlanes!==void 0&&(Nt.numClippingPlanes!==lt.numPlanes||Nt.numIntersection!==lt.numIntersection)||Nt.vertexAlphas!==Xt||Nt.vertexTangents!==Yt||Nt.morphTargets!==Ut||Nt.morphNormals!==le||Nt.morphColors!==Se||Nt.toneMapping!==be||Nt.morphTargetsCount!==ce)&&(he=!0):(he=!0,Nt.__version=W.version);let mi=Nt.currentProgram;he===!0&&(mi=dr(W,F,k));let Wn=!1,si=!1,Rs=!1;const _e=mi.getUniforms(),Ti=Nt.uniforms;if(ct.useProgram(mi.program)&&(Wn=!0,si=!0,Rs=!0),W.id!==w&&(w=W.id,si=!0),Wn||S!==A){ct.buffers.depth.getReversed()?(st.copy(A.projectionMatrix),vf(st),yf(st),_e.setValue(L,"projectionMatrix",st)):_e.setValue(L,"projectionMatrix",A.projectionMatrix),_e.setValue(L,"viewMatrix",A.matrixWorldInverse);const en=_e.map.cameraPosition;en!==void 0&&en.setValue(L,kt.setFromMatrixPosition(A.matrixWorld)),vt.logarithmicDepthBuffer&&_e.setValue(L,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(W.isMeshPhongMaterial||W.isMeshToonMaterial||W.isMeshLambertMaterial||W.isMeshBasicMaterial||W.isMeshStandardMaterial||W.isShaderMaterial)&&_e.setValue(L,"isOrthographic",A.isOrthographicCamera===!0),S!==A&&(S=A,si=!0,Rs=!0)}if(k.isSkinnedMesh){_e.setOptional(L,k,"bindMatrix"),_e.setOptional(L,k,"bindMatrixInverse");const oi=k.skeleton;oi&&(oi.boneTexture===null&&oi.computeBoneTexture(),_e.setValue(L,"boneTexture",oi.boneTexture,R))}k.isBatchedMesh&&(_e.setOptional(L,k,"batchingTexture"),_e.setValue(L,"batchingTexture",k._matricesTexture,R),_e.setOptional(L,k,"batchingIdTexture"),_e.setValue(L,"batchingIdTexture",k._indirectTexture,R),_e.setOptional(L,k,"batchingColorTexture"),k._colorsTexture!==null&&_e.setValue(L,"batchingColorTexture",k._colorsTexture,R));const Ps=V.morphAttributes;if((Ps.position!==void 0||Ps.normal!==void 0||Ps.color!==void 0)&&Wt.update(k,V,mi),(si||Nt.receiveShadow!==k.receiveShadow)&&(Nt.receiveShadow=k.receiveShadow,_e.setValue(L,"receiveShadow",k.receiveShadow)),W.isMeshGouraudMaterial&&W.envMap!==null&&(Ti.envMap.value=It,Ti.flipEnvMap.value=It.isCubeTexture&&It.isRenderTargetTexture===!1?-1:1),W.isMeshStandardMaterial&&W.envMap===null&&F.environment!==null&&(Ti.envMapIntensity.value=F.environmentIntensity),si&&(_e.setValue(L,"toneMappingExposure",v.toneMappingExposure),Nt.needsLights&&Lu(Ti,Rs),ut&&W.fog===!0&&gt.refreshFogUniforms(Ti,ut),gt.refreshMaterialUniforms(Ti,W,B,$,m.state.transmissionRenderTarget[A.id]),ra.upload(L,Hl(Nt),Ti,R)),W.isShaderMaterial&&W.uniformsNeedUpdate===!0&&(ra.upload(L,Hl(Nt),Ti,R),W.uniformsNeedUpdate=!1),W.isSpriteMaterial&&_e.setValue(L,"center",k.center),_e.setValue(L,"modelViewMatrix",k.modelViewMatrix),_e.setValue(L,"normalMatrix",k.normalMatrix),_e.setValue(L,"modelMatrix",k.matrixWorld),W.isShaderMaterial||W.isRawShaderMaterial){const oi=W.uniformsGroups;for(let en=0,nn=oi.length;en<nn;en++){const Vl=oi[en];N.update(Vl,mi),N.bind(Vl,mi)}}return mi}function Lu(A,F){A.ambientLightColor.needsUpdate=F,A.lightProbe.needsUpdate=F,A.directionalLights.needsUpdate=F,A.directionalLightShadows.needsUpdate=F,A.pointLights.needsUpdate=F,A.pointLightShadows.needsUpdate=F,A.spotLights.needsUpdate=F,A.spotLightShadows.needsUpdate=F,A.rectAreaLights.needsUpdate=F,A.hemisphereLights.needsUpdate=F}function zu(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return _},this.getActiveMipmapLevel=function(){return T},this.getRenderTarget=function(){return C},this.setRenderTargetTextures=function(A,F,V){_t.get(A.texture).__webglTexture=F,_t.get(A.depthTexture).__webglTexture=V;const W=_t.get(A);W.__hasExternalTextures=!0,W.__autoAllocateDepthBuffer=V===void 0,W.__autoAllocateDepthBuffer||rt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),W.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(A,F){const V=_t.get(A);V.__webglFramebuffer=F,V.__useDefaultFramebuffer=F===void 0},this.setRenderTarget=function(A,F=0,V=0){C=A,_=F,T=V;let W=!0,k=null,ut=!1,St=!1;if(A){const It=_t.get(A);if(It.__useDefaultFramebuffer!==void 0)ct.bindFramebuffer(L.FRAMEBUFFER,null),W=!1;else if(It.__webglFramebuffer===void 0)R.setupRenderTarget(A);else if(It.__hasExternalTextures)R.rebindTextures(A,_t.get(A.texture).__webglTexture,_t.get(A.depthTexture).__webglTexture);else if(A.depthBuffer){const Ut=A.depthTexture;if(It.__boundDepthTexture!==Ut){if(Ut!==null&&_t.has(Ut)&&(A.width!==Ut.image.width||A.height!==Ut.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");R.setupDepthRenderbuffer(A)}}const Xt=A.texture;(Xt.isData3DTexture||Xt.isDataArrayTexture||Xt.isCompressedArrayTexture)&&(St=!0);const Yt=_t.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(Yt[F])?k=Yt[F][V]:k=Yt[F],ut=!0):A.samples>0&&R.useMultisampledRTT(A)===!1?k=_t.get(A).__webglMultisampledFramebuffer:Array.isArray(Yt)?k=Yt[V]:k=Yt,P.copy(A.viewport),z.copy(A.scissor),I=A.scissorTest}else P.copy(xt).multiplyScalar(B).floor(),z.copy(Gt).multiplyScalar(B).floor(),I=tt;if(ct.bindFramebuffer(L.FRAMEBUFFER,k)&&W&&ct.drawBuffers(A,k),ct.viewport(P),ct.scissor(z),ct.setScissorTest(I),ut){const It=_t.get(A.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+F,It.__webglTexture,V)}else if(St){const It=_t.get(A.texture),Xt=F||0;L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,It.__webglTexture,V||0,Xt)}w=-1},this.readRenderTargetPixels=function(A,F,V,W,k,ut,St){if(!(A&&A.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let zt=_t.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&St!==void 0&&(zt=zt[St]),zt){ct.bindFramebuffer(L.FRAMEBUFFER,zt);try{const It=A.texture,Xt=It.format,Yt=It.type;if(!vt.textureFormatReadable(Xt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!vt.textureTypeReadable(Yt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=A.width-W&&V>=0&&V<=A.height-k&&L.readPixels(F,V,W,k,Qt.convert(Xt),Qt.convert(Yt),ut)}finally{const It=C!==null?_t.get(C).__webglFramebuffer:null;ct.bindFramebuffer(L.FRAMEBUFFER,It)}}},this.readRenderTargetPixelsAsync=async function(A,F,V,W,k,ut,St){if(!(A&&A.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let zt=_t.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&St!==void 0&&(zt=zt[St]),zt){const It=A.texture,Xt=It.format,Yt=It.type;if(!vt.textureFormatReadable(Xt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!vt.textureTypeReadable(Yt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(F>=0&&F<=A.width-W&&V>=0&&V<=A.height-k){ct.bindFramebuffer(L.FRAMEBUFFER,zt);const Ut=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,Ut),L.bufferData(L.PIXEL_PACK_BUFFER,ut.byteLength,L.STREAM_READ),L.readPixels(F,V,W,k,Qt.convert(Xt),Qt.convert(Yt),0);const le=C!==null?_t.get(C).__webglFramebuffer:null;ct.bindFramebuffer(L.FRAMEBUFFER,le);const Se=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);return L.flush(),await xf(L,Se,4),L.bindBuffer(L.PIXEL_PACK_BUFFER,Ut),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,ut),L.deleteBuffer(Ut),L.deleteSync(Se),ut}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(A,F=null,V=0){A.isTexture!==!0&&(Xs("WebGLRenderer: copyFramebufferToTexture function signature has changed."),F=arguments[0]||null,A=arguments[1]);const W=Math.pow(2,-V),k=Math.floor(A.image.width*W),ut=Math.floor(A.image.height*W),St=F!==null?F.x:0,zt=F!==null?F.y:0;R.setTexture2D(A,0),L.copyTexSubImage2D(L.TEXTURE_2D,V,0,0,St,zt,k,ut),ct.unbindTexture()},this.copyTextureToTexture=function(A,F,V=null,W=null,k=0){A.isTexture!==!0&&(Xs("WebGLRenderer: copyTextureToTexture function signature has changed."),W=arguments[0]||null,A=arguments[1],F=arguments[2],k=arguments[3]||0,V=null);let ut,St,zt,It,Xt,Yt,Ut,le,Se;const be=A.isCompressedTexture?A.mipmaps[k]:A.image;V!==null?(ut=V.max.x-V.min.x,St=V.max.y-V.min.y,zt=V.isBox3?V.max.z-V.min.z:1,It=V.min.x,Xt=V.min.y,Yt=V.isBox3?V.min.z:0):(ut=be.width,St=be.height,zt=be.depth||1,It=0,Xt=0,Yt=0),W!==null?(Ut=W.x,le=W.y,Se=W.z):(Ut=0,le=0,Se=0);const ti=Qt.convert(F.format),ce=Qt.convert(F.type);let Nt;F.isData3DTexture?(R.setTexture3D(F,0),Nt=L.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?(R.setTexture2DArray(F,0),Nt=L.TEXTURE_2D_ARRAY):(R.setTexture2D(F,0),Nt=L.TEXTURE_2D),L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,F.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,F.unpackAlignment);const ki=L.getParameter(L.UNPACK_ROW_LENGTH),he=L.getParameter(L.UNPACK_IMAGE_HEIGHT),mi=L.getParameter(L.UNPACK_SKIP_PIXELS),Wn=L.getParameter(L.UNPACK_SKIP_ROWS),si=L.getParameter(L.UNPACK_SKIP_IMAGES);L.pixelStorei(L.UNPACK_ROW_LENGTH,be.width),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,be.height),L.pixelStorei(L.UNPACK_SKIP_PIXELS,It),L.pixelStorei(L.UNPACK_SKIP_ROWS,Xt),L.pixelStorei(L.UNPACK_SKIP_IMAGES,Yt);const Rs=A.isDataArrayTexture||A.isData3DTexture,_e=F.isDataArrayTexture||F.isData3DTexture;if(A.isRenderTargetTexture||A.isDepthTexture){const Ti=_t.get(A),Ps=_t.get(F),oi=_t.get(Ti.__renderTarget),en=_t.get(Ps.__renderTarget);ct.bindFramebuffer(L.READ_FRAMEBUFFER,oi.__webglFramebuffer),ct.bindFramebuffer(L.DRAW_FRAMEBUFFER,en.__webglFramebuffer);for(let nn=0;nn<zt;nn++)Rs&&L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,_t.get(A).__webglTexture,k,Yt+nn),A.isDepthTexture?(_e&&L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,_t.get(F).__webglTexture,k,Se+nn),L.blitFramebuffer(It,Xt,ut,St,Ut,le,ut,St,L.DEPTH_BUFFER_BIT,L.NEAREST)):_e?L.copyTexSubImage3D(Nt,k,Ut,le,Se+nn,It,Xt,ut,St):L.copyTexSubImage2D(Nt,k,Ut,le,Se+nn,It,Xt,ut,St);ct.bindFramebuffer(L.READ_FRAMEBUFFER,null),ct.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else _e?A.isDataTexture||A.isData3DTexture?L.texSubImage3D(Nt,k,Ut,le,Se,ut,St,zt,ti,ce,be.data):F.isCompressedArrayTexture?L.compressedTexSubImage3D(Nt,k,Ut,le,Se,ut,St,zt,ti,be.data):L.texSubImage3D(Nt,k,Ut,le,Se,ut,St,zt,ti,ce,be):A.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,k,Ut,le,ut,St,ti,ce,be.data):A.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,k,Ut,le,be.width,be.height,ti,be.data):L.texSubImage2D(L.TEXTURE_2D,k,Ut,le,ut,St,ti,ce,be);L.pixelStorei(L.UNPACK_ROW_LENGTH,ki),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,he),L.pixelStorei(L.UNPACK_SKIP_PIXELS,mi),L.pixelStorei(L.UNPACK_SKIP_ROWS,Wn),L.pixelStorei(L.UNPACK_SKIP_IMAGES,si),k===0&&F.generateMipmaps&&L.generateMipmap(Nt),ct.unbindTexture()},this.copyTextureToTexture3D=function(A,F,V=null,W=null,k=0){return A.isTexture!==!0&&(Xs("WebGLRenderer: copyTextureToTexture3D function signature has changed."),V=arguments[0]||null,W=arguments[1]||null,A=arguments[2],F=arguments[3],k=arguments[4]||0),Xs('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(A,F,V,W,k)},this.initRenderTarget=function(A){_t.get(A).__webglFramebuffer===void 0&&R.setupRenderTarget(A)},this.initTexture=function(A){A.isCubeTexture?R.setTextureCube(A,0):A.isData3DTexture?R.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?R.setTexture2DArray(A,0):R.setTexture2D(A,0),ct.unbindTexture()},this.resetState=function(){_=0,T=0,C=null,ct.reset(),Me.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ki}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=re._getDrawingBufferColorSpace(t),e.unpackColorSpace=re._getUnpackColorSpace()}}class wl{constructor(t,e=1,i=1e3){this.isFog=!0,this.name="",this.color=new j(t),this.near=e,this.far=i}clone(){return new wl(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class Cg extends me{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new zi,this.environmentIntensity=1,this.environmentRotation=new zi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class ru extends Ze{constructor(t=null,e=1,i=1,n,s,a,o,l,c=Te,h=Te,u,f){super(null,a,o,l,c,h,n,s,u,f),this.isDataTexture=!0,this.image={data:t,width:e,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Hc extends Pe{constructor(t,e,i,n=1){super(t,e,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=n}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const rs=new Vt,Gc=new Vt,Ur=[],Vc=new yn,Rg=new Vt,Ns=new G,Fs=new tn;class yi extends G{constructor(t,e,i){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Hc(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let n=0;n<i;n++)this.setMatrixAt(n,Rg)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new yn),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,rs),Vc.copy(t.boundingBox).applyMatrix4(rs),this.boundingBox.union(Vc)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new tn),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,rs),Fs.copy(t.boundingSphere).applyMatrix4(rs),this.boundingSphere.union(Fs)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const i=e.morphTargetInfluences,n=this.morphTexture.source.data.data,s=i.length+1,a=t*s+1;for(let o=0;o<i.length;o++)i[o]=n[a+o]}raycast(t,e){const i=this.matrixWorld,n=this.count;if(Ns.geometry=this.geometry,Ns.material=this.material,Ns.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Fs.copy(this.boundingSphere),Fs.applyMatrix4(i),t.ray.intersectsSphere(Fs)!==!1))for(let s=0;s<n;s++){this.getMatrixAt(s,rs),Gc.multiplyMatrices(i,rs),Ns.matrixWorld=Gc,Ns.raycast(t,Ur);for(let a=0,o=Ur.length;a<o;a++){const l=Ur[a];l.instanceId=s,l.object=this,e.push(l)}Ur.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new Hc(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){const i=e.morphTargetInfluences,n=i.length+1;this.morphTexture===null&&(this.morphTexture=new ru(new Float32Array(n*this.count),n,this.count,ga,_i));const s=this.morphTexture.source.data.data;let a=0;for(let c=0;c<i.length;c++)a+=i[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=n*t;s[l]=o,s.set(i,l+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}class au extends Hn{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new j(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const ha=new D,ua=new D,Wc=new Vt,ks=new or,Nr=new tn,to=new D,Xc=new D;class Pg extends me{constructor(t=new we,e=new au){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[0];for(let n=1,s=e.count;n<s;n++)ha.fromBufferAttribute(e,n-1),ua.fromBufferAttribute(e,n),i[n]=i[n-1],i[n]+=ha.distanceTo(ua);t.setAttribute("lineDistance",new jt(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const i=this.geometry,n=this.matrixWorld,s=t.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Nr.copy(i.boundingSphere),Nr.applyMatrix4(n),Nr.radius+=s,t.ray.intersectsSphere(Nr)===!1)return;Wc.copy(n).invert(),ks.copy(t.ray).applyMatrix4(Wc);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,h=i.index,f=i.attributes.position;if(h!==null){const d=Math.max(0,a.start),g=Math.min(h.count,a.start+a.count);for(let x=d,p=g-1;x<p;x+=c){const m=h.getX(x),y=h.getX(x+1),M=Fr(this,t,ks,l,m,y);M&&e.push(M)}if(this.isLineLoop){const x=h.getX(g-1),p=h.getX(d),m=Fr(this,t,ks,l,x,p);m&&e.push(m)}}else{const d=Math.max(0,a.start),g=Math.min(f.count,a.start+a.count);for(let x=d,p=g-1;x<p;x+=c){const m=Fr(this,t,ks,l,x,x+1);m&&e.push(m)}if(this.isLineLoop){const x=Fr(this,t,ks,l,g-1,d);x&&e.push(x)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const n=e[i[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=n.length;s<a;s++){const o=n[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function Fr(r,t,e,i,n,s){const a=r.geometry.attributes.position;if(ha.fromBufferAttribute(a,n),ua.fromBufferAttribute(a,s),e.distanceSqToSegment(ha,ua,to,Xc)>i)return;to.applyMatrix4(r.matrixWorld);const l=t.ray.origin.distanceTo(to);if(!(l<t.near||l>t.far))return{distance:l,point:Xc.clone().applyMatrix4(r.matrixWorld),index:n,face:null,faceIndex:null,barycoord:null,object:r}}const qc=new D,Yc=new D;class Dg extends Pg{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[];for(let n=0,s=e.count;n<s;n+=2)qc.fromBufferAttribute(e,n),Yc.fromBufferAttribute(e,n+1),i[n]=n===0?0:i[n-1],i[n+1]=i[n]+qc.distanceTo(Yc);t.setAttribute("lineDistance",new jt(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class bl extends Hn{static get type(){return"PointsMaterial"}constructor(t){super(),this.isPointsMaterial=!0,this.color=new j(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const Zc=new Vt,rl=new or,kr=new tn,Or=new D;class _l extends me{constructor(t=new we,e=new bl){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const i=this.geometry,n=this.matrixWorld,s=t.params.Points.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),kr.copy(i.boundingSphere),kr.applyMatrix4(n),kr.radius+=s,t.ray.intersectsSphere(kr)===!1)return;Zc.copy(n).invert(),rl.copy(t.ray).applyMatrix4(Zc);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=i.index,u=i.attributes.position;if(c!==null){const f=Math.max(0,a.start),d=Math.min(c.count,a.start+a.count);for(let g=f,x=d;g<x;g++){const p=c.getX(g);Or.fromBufferAttribute(u,p),Kc(Or,p,l,n,t,e,this)}}else{const f=Math.max(0,a.start),d=Math.min(u.count,a.start+a.count);for(let g=f,x=d;g<x;g++)Or.fromBufferAttribute(u,g),Kc(Or,g,l,n,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const n=e[i[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=n.length;s<a;s++){const o=n[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function Kc(r,t,e,i,n,s,a){const o=rl.distanceSqToPoint(r);if(o<e){const l=new D;rl.closestPointToPoint(r,l),l.applyMatrix4(i);const c=n.ray.origin.distanceTo(l);if(c<n.near||c>n.far)return;s.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:a})}}class Ma extends Ze{constructor(t,e,i,n,s,a,o,l,c){super(t,e,i,n,s,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Ni{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const i=this.getUtoTmapping(t);return this.getPoint(i,e)}getPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return e}getSpacedPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPointAt(i/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let i,n=this.getPoint(0),s=0;e.push(0);for(let a=1;a<=t;a++)i=this.getPoint(a/t),s+=i.distanceTo(n),e.push(s),n=i;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const i=this.getLengths();let n=0;const s=i.length;let a;e?a=e:a=t*i[s-1];let o=0,l=s-1,c;for(;o<=l;)if(n=Math.floor(o+(l-o)/2),c=i[n]-a,c<0)o=n+1;else if(c>0)l=n-1;else{l=n;break}if(n=l,i[n]===a)return n/(s-1);const h=i[n],f=i[n+1]-h,d=(a-h)/f;return(n+d)/(s-1)}getTangent(t,e){let n=t-1e-4,s=t+1e-4;n<0&&(n=0),s>1&&(s=1);const a=this.getPoint(n),o=this.getPoint(s),l=e||(a.isVector2?new it:new D);return l.copy(o).sub(a).normalize(),l}getTangentAt(t,e){const i=this.getUtoTmapping(t);return this.getTangent(i,e)}computeFrenetFrames(t,e){const i=new D,n=[],s=[],a=[],o=new D,l=new Vt;for(let d=0;d<=t;d++){const g=d/t;n[d]=this.getTangentAt(g,new D)}s[0]=new D,a[0]=new D;let c=Number.MAX_VALUE;const h=Math.abs(n[0].x),u=Math.abs(n[0].y),f=Math.abs(n[0].z);h<=c&&(c=h,i.set(1,0,0)),u<=c&&(c=u,i.set(0,1,0)),f<=c&&i.set(0,0,1),o.crossVectors(n[0],i).normalize(),s[0].crossVectors(n[0],o),a[0].crossVectors(n[0],s[0]);for(let d=1;d<=t;d++){if(s[d]=s[d-1].clone(),a[d]=a[d-1].clone(),o.crossVectors(n[d-1],n[d]),o.length()>Number.EPSILON){o.normalize();const g=Math.acos(Ge(n[d-1].dot(n[d]),-1,1));s[d].applyMatrix4(l.makeRotationAxis(o,g))}a[d].crossVectors(n[d],s[d])}if(e===!0){let d=Math.acos(Ge(s[0].dot(s[t]),-1,1));d/=t,n[0].dot(o.crossVectors(s[0],s[t]))>0&&(d=-d);for(let g=1;g<=t;g++)s[g].applyMatrix4(l.makeRotationAxis(n[g],d*g)),a[g].crossVectors(n[g],s[g])}return{tangents:n,normals:s,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class Tl extends Ni{constructor(t=0,e=0,i=1,n=1,s=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=i,this.yRadius=n,this.aStartAngle=s,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(t,e=new it){const i=e,n=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const a=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=n;for(;s>n;)s-=n;s<Number.EPSILON&&(a?s=0:s=n),this.aClockwise===!0&&!a&&(s===n?s=-n:s=s-n);const o=this.aStartAngle+t*s;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),f=l-this.aX,d=c-this.aY;l=f*h-d*u+this.aX,c=f*u+d*h+this.aY}return i.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class Lg extends Tl{constructor(t,e,i,n,s,a){super(t,e,i,i,n,s,a),this.isArcCurve=!0,this.type="ArcCurve"}}function El(){let r=0,t=0,e=0,i=0;function n(s,a,o,l){r=s,t=o,e=-3*s+3*a-2*o-l,i=2*s-2*a+o+l}return{initCatmullRom:function(s,a,o,l,c){n(a,o,c*(o-s),c*(l-a))},initNonuniformCatmullRom:function(s,a,o,l,c,h,u){let f=(a-s)/c-(o-s)/(c+h)+(o-a)/h,d=(o-a)/h-(l-a)/(h+u)+(l-o)/u;f*=h,d*=h,n(a,o,f,d)},calc:function(s){const a=s*s,o=a*s;return r+t*s+e*a+i*o}}}const Br=new D,eo=new El,io=new El,no=new El;class zg extends Ni{constructor(t=[],e=!1,i="centripetal",n=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=i,this.tension=n}getPoint(t,e=new D){const i=e,n=this.points,s=n.length,a=(s-(this.closed?0:1))*t;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/s)+1)*s:l===0&&o===s-1&&(o=s-2,l=1);let c,h;this.closed||o>0?c=n[(o-1)%s]:(Br.subVectors(n[0],n[1]).add(n[0]),c=Br);const u=n[o%s],f=n[(o+1)%s];if(this.closed||o+2<s?h=n[(o+2)%s]:(Br.subVectors(n[s-1],n[s-2]).add(n[s-1]),h=Br),this.curveType==="centripetal"||this.curveType==="chordal"){const d=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(u),d),x=Math.pow(u.distanceToSquared(f),d),p=Math.pow(f.distanceToSquared(h),d);x<1e-4&&(x=1),g<1e-4&&(g=x),p<1e-4&&(p=x),eo.initNonuniformCatmullRom(c.x,u.x,f.x,h.x,g,x,p),io.initNonuniformCatmullRom(c.y,u.y,f.y,h.y,g,x,p),no.initNonuniformCatmullRom(c.z,u.z,f.z,h.z,g,x,p)}else this.curveType==="catmullrom"&&(eo.initCatmullRom(c.x,u.x,f.x,h.x,this.tension),io.initCatmullRom(c.y,u.y,f.y,h.y,this.tension),no.initCatmullRom(c.z,u.z,f.z,h.z,this.tension));return i.set(eo.calc(l),io.calc(l),no.calc(l)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const n=t.points[e];this.points.push(n.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const n=this.points[e];t.points.push(n.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const n=t.points[e];this.points.push(new D().fromArray(n))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function jc(r,t,e,i,n){const s=(i-t)*.5,a=(n-e)*.5,o=r*r,l=r*o;return(2*e-2*i+s+a)*l+(-3*e+3*i-2*s-a)*o+s*r+e}function Ig(r,t){const e=1-r;return e*e*t}function Ug(r,t){return 2*(1-r)*r*t}function Ng(r,t){return r*r*t}function Ks(r,t,e,i){return Ig(r,t)+Ug(r,e)+Ng(r,i)}function Fg(r,t){const e=1-r;return e*e*e*t}function kg(r,t){const e=1-r;return 3*e*e*r*t}function Og(r,t){return 3*(1-r)*r*r*t}function Bg(r,t){return r*r*r*t}function js(r,t,e,i,n){return Fg(r,t)+kg(r,e)+Og(r,i)+Bg(r,n)}class ou extends Ni{constructor(t=new it,e=new it,i=new it,n=new it){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=i,this.v3=n}getPoint(t,e=new it){const i=e,n=this.v0,s=this.v1,a=this.v2,o=this.v3;return i.set(js(t,n.x,s.x,a.x,o.x),js(t,n.y,s.y,a.y,o.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Hg extends Ni{constructor(t=new D,e=new D,i=new D,n=new D){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=i,this.v3=n}getPoint(t,e=new D){const i=e,n=this.v0,s=this.v1,a=this.v2,o=this.v3;return i.set(js(t,n.x,s.x,a.x,o.x),js(t,n.y,s.y,a.y,o.y),js(t,n.z,s.z,a.z,o.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class lu extends Ni{constructor(t=new it,e=new it){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new it){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new it){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Gg extends Ni{constructor(t=new D,e=new D){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new D){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new D){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class cu extends Ni{constructor(t=new it,e=new it,i=new it){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new it){const i=e,n=this.v0,s=this.v1,a=this.v2;return i.set(Ks(t,n.x,s.x,a.x),Ks(t,n.y,s.y,a.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Vg extends Ni{constructor(t=new D,e=new D,i=new D){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new D){const i=e,n=this.v0,s=this.v1,a=this.v2;return i.set(Ks(t,n.x,s.x,a.x),Ks(t,n.y,s.y,a.y),Ks(t,n.z,s.z,a.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class hu extends Ni{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new it){const i=e,n=this.points,s=(n.length-1)*t,a=Math.floor(s),o=s-a,l=n[a===0?a:a-1],c=n[a],h=n[a>n.length-2?n.length-1:a+1],u=n[a>n.length-3?n.length-1:a+2];return i.set(jc(o,l.x,c.x,h.x,u.x),jc(o,l.y,c.y,h.y,u.y)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const n=t.points[e];this.points.push(n.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const n=this.points[e];t.points.push(n.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const n=t.points[e];this.points.push(new it().fromArray(n))}return this}}var al=Object.freeze({__proto__:null,ArcCurve:Lg,CatmullRomCurve3:zg,CubicBezierCurve:ou,CubicBezierCurve3:Hg,EllipseCurve:Tl,LineCurve:lu,LineCurve3:Gg,QuadraticBezierCurve:cu,QuadraticBezierCurve3:Vg,SplineCurve:hu});class Wg extends Ni{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const i=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new al[i](e,t))}return this}getPoint(t,e){const i=t*this.getLength(),n=this.getCurveLengths();let s=0;for(;s<n.length;){if(n[s]>=i){const a=n[s]-i,o=this.curves[s],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,e)}s++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let i=0,n=this.curves.length;i<n;i++)e+=this.curves[i].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let i;for(let n=0,s=this.curves;n<s.length;n++){const a=s[n],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,l=a.getPoints(o);for(let c=0;c<l.length;c++){const h=l[c];i&&i.equals(h)||(e.push(h),i=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const n=t.curves[e];this.curves.push(n.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,i=this.curves.length;e<i;e++){const n=this.curves[e];t.curves.push(n.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const n=t.curves[e];this.curves.push(new al[n.type]().fromJSON(n))}return this}}class ol extends Wg{constructor(t){super(),this.type="Path",this.currentPoint=new it,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,i=t.length;e<i;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const i=new lu(this.currentPoint.clone(),new it(t,e));return this.curves.push(i),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,i,n){const s=new cu(this.currentPoint.clone(),new it(t,e),new it(i,n));return this.curves.push(s),this.currentPoint.set(i,n),this}bezierCurveTo(t,e,i,n,s,a){const o=new ou(this.currentPoint.clone(),new it(t,e),new it(i,n),new it(s,a));return this.curves.push(o),this.currentPoint.set(s,a),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),i=new hu(e);return this.curves.push(i),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,i,n,s,a){const o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+o,e+l,i,n,s,a),this}absarc(t,e,i,n,s,a){return this.absellipse(t,e,i,i,n,s,a),this}ellipse(t,e,i,n,s,a,o,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,i,n,s,a,o,l),this}absellipse(t,e,i,n,s,a,o,l){const c=new Tl(t,e,i,n,s,a,o,l);if(this.curves.length>0){const u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class Al extends we{constructor(t=[new it(0,-.5),new it(.5,0),new it(0,.5)],e=12,i=0,n=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:i,phiLength:n},e=Math.floor(e),n=Ge(n,0,Math.PI*2);const s=[],a=[],o=[],l=[],c=[],h=1/e,u=new D,f=new it,d=new D,g=new D,x=new D;let p=0,m=0;for(let y=0;y<=t.length-1;y++)switch(y){case 0:p=t[y+1].x-t[y].x,m=t[y+1].y-t[y].y,d.x=m*1,d.y=-p,d.z=m*0,x.copy(d),d.normalize(),l.push(d.x,d.y,d.z);break;case t.length-1:l.push(x.x,x.y,x.z);break;default:p=t[y+1].x-t[y].x,m=t[y+1].y-t[y].y,d.x=m*1,d.y=-p,d.z=m*0,g.copy(d),d.x+=x.x,d.y+=x.y,d.z+=x.z,d.normalize(),l.push(d.x,d.y,d.z),x.copy(g)}for(let y=0;y<=e;y++){const M=i+y*h*n,v=Math.sin(M),b=Math.cos(M);for(let _=0;_<=t.length-1;_++){u.x=t[_].x*v,u.y=t[_].y,u.z=t[_].x*b,a.push(u.x,u.y,u.z),f.x=y/e,f.y=_/(t.length-1),o.push(f.x,f.y);const T=l[3*_+0]*v,C=l[3*_+1],w=l[3*_+0]*b;c.push(T,C,w)}}for(let y=0;y<e;y++)for(let M=0;M<t.length-1;M++){const v=M+y*t.length,b=v,_=v+t.length,T=v+t.length+1,C=v+1;s.push(b,_,C),s.push(T,C,_)}this.setIndex(s),this.setAttribute("position",new jt(a,3)),this.setAttribute("uv",new jt(o,2)),this.setAttribute("normal",new jt(c,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Al(t.points,t.segments,t.phiStart,t.phiLength)}}class Cl extends Al{constructor(t=1,e=1,i=4,n=8){const s=new ol;s.absarc(0,-e/2,t,Math.PI*1.5,0),s.absarc(0,e/2,t,0,Math.PI*.5),super(s.getPoints(i),n),this.type="CapsuleGeometry",this.parameters={radius:t,length:e,capSegments:i,radialSegments:n}}static fromJSON(t){return new Cl(t.radius,t.length,t.capSegments,t.radialSegments)}}class Rl extends we{constructor(t=1,e=32,i=0,n=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:i,thetaLength:n},e=Math.max(3,e);const s=[],a=[],o=[],l=[],c=new D,h=new it;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let u=0,f=3;u<=e;u++,f+=3){const d=i+u/e*n;c.x=t*Math.cos(d),c.y=t*Math.sin(d),a.push(c.x,c.y,c.z),o.push(0,0,1),h.x=(a[f]/t+1)/2,h.y=(a[f+1]/t+1)/2,l.push(h.x,h.y)}for(let u=1;u<=e;u++)s.push(u,u+1,0);this.setIndex(s),this.setAttribute("position",new jt(a,3)),this.setAttribute("normal",new jt(o,3)),this.setAttribute("uv",new jt(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Rl(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class Zt extends we{constructor(t=1,e=1,i=1,n=32,s=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:n,heightSegments:s,openEnded:a,thetaStart:o,thetaLength:l};const c=this;n=Math.floor(n),s=Math.floor(s);const h=[],u=[],f=[],d=[];let g=0;const x=[],p=i/2;let m=0;y(),a===!1&&(t>0&&M(!0),e>0&&M(!1)),this.setIndex(h),this.setAttribute("position",new jt(u,3)),this.setAttribute("normal",new jt(f,3)),this.setAttribute("uv",new jt(d,2));function y(){const v=new D,b=new D;let _=0;const T=(e-t)/i;for(let C=0;C<=s;C++){const w=[],S=C/s,P=S*(e-t)+t;for(let z=0;z<=n;z++){const I=z/n,U=I*l+o,X=Math.sin(U),q=Math.cos(U);b.x=P*X,b.y=-S*i+p,b.z=P*q,u.push(b.x,b.y,b.z),v.set(X,T,q).normalize(),f.push(v.x,v.y,v.z),d.push(I,1-S),w.push(g++)}x.push(w)}for(let C=0;C<n;C++)for(let w=0;w<s;w++){const S=x[w][C],P=x[w+1][C],z=x[w+1][C+1],I=x[w][C+1];(t>0||w!==0)&&(h.push(S,P,I),_+=3),(e>0||w!==s-1)&&(h.push(P,z,I),_+=3)}c.addGroup(m,_,0),m+=_}function M(v){const b=g,_=new it,T=new D;let C=0;const w=v===!0?t:e,S=v===!0?1:-1;for(let z=1;z<=n;z++)u.push(0,p*S,0),f.push(0,S,0),d.push(.5,.5),g++;const P=g;for(let z=0;z<=n;z++){const U=z/n*l+o,X=Math.cos(U),q=Math.sin(U);T.x=w*q,T.y=p*S,T.z=w*X,u.push(T.x,T.y,T.z),f.push(0,S,0),_.x=X*.5+.5,_.y=q*.5*S+.5,d.push(_.x,_.y),g++}for(let z=0;z<n;z++){const I=b+z,U=P+z;v===!0?h.push(U,U+1,I):h.push(U+1,U,I),C+=3}c.addGroup(m,C,v===!0?1:2),m+=C}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Zt(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Nn extends Zt{constructor(t=1,e=1,i=32,n=1,s=!1,a=0,o=Math.PI*2){super(0,t,e,i,n,s,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:i,heightSegments:n,openEnded:s,thetaStart:a,thetaLength:o}}static fromJSON(t){return new Nn(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Pl extends we{constructor(t=[],e=[],i=1,n=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:i,detail:n};const s=[],a=[];o(n),c(i),h(),this.setAttribute("position",new jt(s,3)),this.setAttribute("normal",new jt(s.slice(),3)),this.setAttribute("uv",new jt(a,2)),n===0?this.computeVertexNormals():this.normalizeNormals();function o(y){const M=new D,v=new D,b=new D;for(let _=0;_<e.length;_+=3)d(e[_+0],M),d(e[_+1],v),d(e[_+2],b),l(M,v,b,y)}function l(y,M,v,b){const _=b+1,T=[];for(let C=0;C<=_;C++){T[C]=[];const w=y.clone().lerp(v,C/_),S=M.clone().lerp(v,C/_),P=_-C;for(let z=0;z<=P;z++)z===0&&C===_?T[C][z]=w:T[C][z]=w.clone().lerp(S,z/P)}for(let C=0;C<_;C++)for(let w=0;w<2*(_-C)-1;w++){const S=Math.floor(w/2);w%2===0?(f(T[C][S+1]),f(T[C+1][S]),f(T[C][S])):(f(T[C][S+1]),f(T[C+1][S+1]),f(T[C+1][S]))}}function c(y){const M=new D;for(let v=0;v<s.length;v+=3)M.x=s[v+0],M.y=s[v+1],M.z=s[v+2],M.normalize().multiplyScalar(y),s[v+0]=M.x,s[v+1]=M.y,s[v+2]=M.z}function h(){const y=new D;for(let M=0;M<s.length;M+=3){y.x=s[M+0],y.y=s[M+1],y.z=s[M+2];const v=p(y)/2/Math.PI+.5,b=m(y)/Math.PI+.5;a.push(v,1-b)}g(),u()}function u(){for(let y=0;y<a.length;y+=6){const M=a[y+0],v=a[y+2],b=a[y+4],_=Math.max(M,v,b),T=Math.min(M,v,b);_>.9&&T<.1&&(M<.2&&(a[y+0]+=1),v<.2&&(a[y+2]+=1),b<.2&&(a[y+4]+=1))}}function f(y){s.push(y.x,y.y,y.z)}function d(y,M){const v=y*3;M.x=t[v+0],M.y=t[v+1],M.z=t[v+2]}function g(){const y=new D,M=new D,v=new D,b=new D,_=new it,T=new it,C=new it;for(let w=0,S=0;w<s.length;w+=9,S+=6){y.set(s[w+0],s[w+1],s[w+2]),M.set(s[w+3],s[w+4],s[w+5]),v.set(s[w+6],s[w+7],s[w+8]),_.set(a[S+0],a[S+1]),T.set(a[S+2],a[S+3]),C.set(a[S+4],a[S+5]),b.copy(y).add(M).add(v).divideScalar(3);const P=p(b);x(_,S+0,y,P),x(T,S+2,M,P),x(C,S+4,v,P)}}function x(y,M,v,b){b<0&&y.x===1&&(a[M]=y.x-1),v.x===0&&v.z===0&&(a[M]=b/2/Math.PI+.5)}function p(y){return Math.atan2(y.z,-y.x)}function m(y){return Math.atan2(-y.y,Math.sqrt(y.x*y.x+y.z*y.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Pl(t.vertices,t.indices,t.radius,t.details)}}class uu extends ol{constructor(t){super(t),this.uuid=Es(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let i=0,n=this.holes.length;i<n;i++)e[i]=this.holes[i].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const n=t.holes[e];this.holes.push(n.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,i=this.holes.length;e<i;e++){const n=this.holes[e];t.holes.push(n.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const n=t.holes[e];this.holes.push(new ol().fromJSON(n))}return this}}const Xg={triangulate:function(r,t,e=2){const i=t&&t.length,n=i?t[0]*e:r.length;let s=fu(r,0,n,e,!0);const a=[];if(!s||s.next===s.prev)return a;let o,l,c,h,u,f,d;if(i&&(s=jg(r,t,s,e)),r.length>80*e){o=c=r[0],l=h=r[1];for(let g=e;g<n;g+=e)u=r[g],f=r[g+1],u<o&&(o=u),f<l&&(l=f),u>c&&(c=u),f>h&&(h=f);d=Math.max(c-o,h-l),d=d!==0?32767/d:0}return ir(s,a,e,o,l,d,0),a}};function fu(r,t,e,i,n){let s,a;if(n===ox(r,t,e,i)>0)for(s=t;s<e;s+=i)a=Qc(s,r[s],r[s+1],a);else for(s=e-i;s>=t;s-=i)a=Qc(s,r[s],r[s+1],a);return a&&Sa(a,a.next)&&(sr(a),a=a.next),a}function On(r,t){if(!r)return r;t||(t=r);let e=r,i;do if(i=!1,!e.steiner&&(Sa(e,e.next)||Ce(e.prev,e,e.next)===0)){if(sr(e),e=t=e.prev,e===e.next)break;i=!0}else e=e.next;while(i||e!==t);return t}function ir(r,t,e,i,n,s,a){if(!r)return;!a&&s&&ex(r,i,n,s);let o=r,l,c;for(;r.prev!==r.next;){if(l=r.prev,c=r.next,s?Yg(r,i,n,s):qg(r)){t.push(l.i/e|0),t.push(r.i/e|0),t.push(c.i/e|0),sr(r),r=c.next,o=c.next;continue}if(r=c,r===o){a?a===1?(r=Zg(On(r),t,e),ir(r,t,e,i,n,s,2)):a===2&&Kg(r,t,e,i,n,s):ir(On(r),t,e,i,n,s,1);break}}}function qg(r){const t=r.prev,e=r,i=r.next;if(Ce(t,e,i)>=0)return!1;const n=t.x,s=e.x,a=i.x,o=t.y,l=e.y,c=i.y,h=n<s?n<a?n:a:s<a?s:a,u=o<l?o<c?o:c:l<c?l:c,f=n>s?n>a?n:a:s>a?s:a,d=o>l?o>c?o:c:l>c?l:c;let g=i.next;for(;g!==t;){if(g.x>=h&&g.x<=f&&g.y>=u&&g.y<=d&&fs(n,o,s,l,a,c,g.x,g.y)&&Ce(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function Yg(r,t,e,i){const n=r.prev,s=r,a=r.next;if(Ce(n,s,a)>=0)return!1;const o=n.x,l=s.x,c=a.x,h=n.y,u=s.y,f=a.y,d=o<l?o<c?o:c:l<c?l:c,g=h<u?h<f?h:f:u<f?u:f,x=o>l?o>c?o:c:l>c?l:c,p=h>u?h>f?h:f:u>f?u:f,m=ll(d,g,t,e,i),y=ll(x,p,t,e,i);let M=r.prevZ,v=r.nextZ;for(;M&&M.z>=m&&v&&v.z<=y;){if(M.x>=d&&M.x<=x&&M.y>=g&&M.y<=p&&M!==n&&M!==a&&fs(o,h,l,u,c,f,M.x,M.y)&&Ce(M.prev,M,M.next)>=0||(M=M.prevZ,v.x>=d&&v.x<=x&&v.y>=g&&v.y<=p&&v!==n&&v!==a&&fs(o,h,l,u,c,f,v.x,v.y)&&Ce(v.prev,v,v.next)>=0))return!1;v=v.nextZ}for(;M&&M.z>=m;){if(M.x>=d&&M.x<=x&&M.y>=g&&M.y<=p&&M!==n&&M!==a&&fs(o,h,l,u,c,f,M.x,M.y)&&Ce(M.prev,M,M.next)>=0)return!1;M=M.prevZ}for(;v&&v.z<=y;){if(v.x>=d&&v.x<=x&&v.y>=g&&v.y<=p&&v!==n&&v!==a&&fs(o,h,l,u,c,f,v.x,v.y)&&Ce(v.prev,v,v.next)>=0)return!1;v=v.nextZ}return!0}function Zg(r,t,e){let i=r;do{const n=i.prev,s=i.next.next;!Sa(n,s)&&du(n,i,i.next,s)&&nr(n,s)&&nr(s,n)&&(t.push(n.i/e|0),t.push(i.i/e|0),t.push(s.i/e|0),sr(i),sr(i.next),i=r=s),i=i.next}while(i!==r);return On(i)}function Kg(r,t,e,i,n,s){let a=r;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&sx(a,o)){let l=pu(a,o);a=On(a,a.next),l=On(l,l.next),ir(a,t,e,i,n,s,0),ir(l,t,e,i,n,s,0);return}o=o.next}a=a.next}while(a!==r)}function jg(r,t,e,i){const n=[];let s,a,o,l,c;for(s=0,a=t.length;s<a;s++)o=t[s]*i,l=s<a-1?t[s+1]*i:r.length,c=fu(r,o,l,i,!1),c===c.next&&(c.steiner=!0),n.push(nx(c));for(n.sort(Qg),s=0;s<n.length;s++)e=Jg(n[s],e);return e}function Qg(r,t){return r.x-t.x}function Jg(r,t){const e=$g(r,t);if(!e)return t;const i=pu(e,r);return On(i,i.next),On(e,e.next)}function $g(r,t){let e=t,i=-1/0,n;const s=r.x,a=r.y;do{if(a<=e.y&&a>=e.next.y&&e.next.y!==e.y){const f=e.x+(a-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(f<=s&&f>i&&(i=f,n=e.x<e.next.x?e:e.next,f===s))return n}e=e.next}while(e!==t);if(!n)return null;const o=n,l=n.x,c=n.y;let h=1/0,u;e=n;do s>=e.x&&e.x>=l&&s!==e.x&&fs(a<c?s:i,a,l,c,a<c?i:s,a,e.x,e.y)&&(u=Math.abs(a-e.y)/(s-e.x),nr(e,r)&&(u<h||u===h&&(e.x>n.x||e.x===n.x&&tx(n,e)))&&(n=e,h=u)),e=e.next;while(e!==o);return n}function tx(r,t){return Ce(r.prev,r,t.prev)<0&&Ce(t.next,r,r.next)<0}function ex(r,t,e,i){let n=r;do n.z===0&&(n.z=ll(n.x,n.y,t,e,i)),n.prevZ=n.prev,n.nextZ=n.next,n=n.next;while(n!==r);n.prevZ.nextZ=null,n.prevZ=null,ix(n)}function ix(r){let t,e,i,n,s,a,o,l,c=1;do{for(e=r,r=null,s=null,a=0;e;){for(a++,i=e,o=0,t=0;t<c&&(o++,i=i.nextZ,!!i);t++);for(l=c;o>0||l>0&&i;)o!==0&&(l===0||!i||e.z<=i.z)?(n=e,e=e.nextZ,o--):(n=i,i=i.nextZ,l--),s?s.nextZ=n:r=n,n.prevZ=s,s=n;e=i}s.nextZ=null,c*=2}while(a>1);return r}function ll(r,t,e,i,n){return r=(r-e)*n|0,t=(t-i)*n|0,r=(r|r<<8)&16711935,r=(r|r<<4)&252645135,r=(r|r<<2)&858993459,r=(r|r<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,r|t<<1}function nx(r){let t=r,e=r;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==r);return e}function fs(r,t,e,i,n,s,a,o){return(n-a)*(t-o)>=(r-a)*(s-o)&&(r-a)*(i-o)>=(e-a)*(t-o)&&(e-a)*(s-o)>=(n-a)*(i-o)}function sx(r,t){return r.next.i!==t.i&&r.prev.i!==t.i&&!rx(r,t)&&(nr(r,t)&&nr(t,r)&&ax(r,t)&&(Ce(r.prev,r,t.prev)||Ce(r,t.prev,t))||Sa(r,t)&&Ce(r.prev,r,r.next)>0&&Ce(t.prev,t,t.next)>0)}function Ce(r,t,e){return(t.y-r.y)*(e.x-t.x)-(t.x-r.x)*(e.y-t.y)}function Sa(r,t){return r.x===t.x&&r.y===t.y}function du(r,t,e,i){const n=Gr(Ce(r,t,e)),s=Gr(Ce(r,t,i)),a=Gr(Ce(e,i,r)),o=Gr(Ce(e,i,t));return!!(n!==s&&a!==o||n===0&&Hr(r,e,t)||s===0&&Hr(r,i,t)||a===0&&Hr(e,r,i)||o===0&&Hr(e,t,i))}function Hr(r,t,e){return t.x<=Math.max(r.x,e.x)&&t.x>=Math.min(r.x,e.x)&&t.y<=Math.max(r.y,e.y)&&t.y>=Math.min(r.y,e.y)}function Gr(r){return r>0?1:r<0?-1:0}function rx(r,t){let e=r;do{if(e.i!==r.i&&e.next.i!==r.i&&e.i!==t.i&&e.next.i!==t.i&&du(e,e.next,r,t))return!0;e=e.next}while(e!==r);return!1}function nr(r,t){return Ce(r.prev,r,r.next)<0?Ce(r,t,r.next)>=0&&Ce(r,r.prev,t)>=0:Ce(r,t,r.prev)<0||Ce(r,r.next,t)<0}function ax(r,t){let e=r,i=!1;const n=(r.x+t.x)/2,s=(r.y+t.y)/2;do e.y>s!=e.next.y>s&&e.next.y!==e.y&&n<(e.next.x-e.x)*(s-e.y)/(e.next.y-e.y)+e.x&&(i=!i),e=e.next;while(e!==r);return i}function pu(r,t){const e=new cl(r.i,r.x,r.y),i=new cl(t.i,t.x,t.y),n=r.next,s=t.prev;return r.next=t,t.prev=r,e.next=n,n.prev=e,i.next=e,e.prev=i,s.next=i,i.prev=s,i}function Qc(r,t,e,i){const n=new cl(r,t,e);return i?(n.next=i.next,n.prev=i,i.next.prev=n,i.next=n):(n.prev=n,n.next=n),n}function sr(r){r.next.prev=r.prev,r.prev.next=r.next,r.prevZ&&(r.prevZ.nextZ=r.nextZ),r.nextZ&&(r.nextZ.prevZ=r.prevZ)}function cl(r,t,e){this.i=r,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function ox(r,t,e,i){let n=0;for(let s=t,a=e-i;s<e;s+=i)n+=(r[a]-r[s])*(r[s+1]+r[a+1]),a=s;return n}class Qs{static area(t){const e=t.length;let i=0;for(let n=e-1,s=0;s<e;n=s++)i+=t[n].x*t[s].y-t[s].x*t[n].y;return i*.5}static isClockWise(t){return Qs.area(t)<0}static triangulateShape(t,e){const i=[],n=[],s=[];Jc(t),$c(i,t);let a=t.length;e.forEach(Jc);for(let l=0;l<e.length;l++)n.push(a),a+=e[l].length,$c(i,e[l]);const o=Xg.triangulate(i,n);for(let l=0;l<o.length;l+=3)s.push(o.slice(l,l+3));return s}}function Jc(r){const t=r.length;t>2&&r[t-1].equals(r[0])&&r.pop()}function $c(r,t){for(let e=0;e<t.length;e++)r.push(t[e].x),r.push(t[e].y)}class Dl extends we{constructor(t=new uu([new it(.5,.5),new it(-.5,.5),new it(-.5,-.5),new it(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const i=this,n=[],s=[];for(let o=0,l=t.length;o<l;o++){const c=t[o];a(c)}this.setAttribute("position",new jt(n,3)),this.setAttribute("uv",new jt(s,2)),this.computeVertexNormals();function a(o){const l=[],c=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,u=e.depth!==void 0?e.depth:1;let f=e.bevelEnabled!==void 0?e.bevelEnabled:!0,d=e.bevelThickness!==void 0?e.bevelThickness:.2,g=e.bevelSize!==void 0?e.bevelSize:d-.1,x=e.bevelOffset!==void 0?e.bevelOffset:0,p=e.bevelSegments!==void 0?e.bevelSegments:3;const m=e.extrudePath,y=e.UVGenerator!==void 0?e.UVGenerator:lx;let M,v=!1,b,_,T,C;m&&(M=m.getSpacedPoints(h),v=!0,f=!1,b=m.computeFrenetFrames(h,!1),_=new D,T=new D,C=new D),f||(p=0,d=0,g=0,x=0);const w=o.extractPoints(c);let S=w.shape;const P=w.holes;if(!Qs.isClockWise(S)){S=S.reverse();for(let Z=0,at=P.length;Z<at;Z++){const L=P[Z];Qs.isClockWise(L)&&(P[Z]=L.reverse())}}const I=Qs.triangulateShape(S,P),U=S;for(let Z=0,at=P.length;Z<at;Z++){const L=P[Z];S=S.concat(L)}function X(Z,at,L){return at||console.error("THREE.ExtrudeGeometry: vec does not exist"),Z.clone().addScaledVector(at,L)}const q=S.length,$=I.length;function B(Z,at,L){let At,rt,vt;const ct=Z.x-at.x,Ot=Z.y-at.y,_t=L.x-Z.x,R=L.y-Z.y,E=ct*ct+Ot*Ot,H=ct*R-Ot*_t;if(Math.abs(H)>Number.EPSILON){const K=Math.sqrt(E),nt=Math.sqrt(_t*_t+R*R),Q=at.x-Ot/K,Lt=at.y+ct/K,gt=L.x-R/nt,Tt=L.y+_t/nt,ee=((gt-Q)*R-(Tt-Lt)*_t)/(ct*R-Ot*_t);At=Q+ct*ee-Z.x,rt=Lt+Ot*ee-Z.y;const lt=At*At+rt*rt;if(lt<=2)return new it(At,rt);vt=Math.sqrt(lt/2)}else{let K=!1;ct>Number.EPSILON?_t>Number.EPSILON&&(K=!0):ct<-Number.EPSILON?_t<-Number.EPSILON&&(K=!0):Math.sign(Ot)===Math.sign(R)&&(K=!0),K?(At=-Ot,rt=ct,vt=Math.sqrt(E)):(At=ct,rt=Ot,vt=Math.sqrt(E/2))}return new it(At/vt,rt/vt)}const ft=[];for(let Z=0,at=U.length,L=at-1,At=Z+1;Z<at;Z++,L++,At++)L===at&&(L=0),At===at&&(At=0),ft[Z]=B(U[Z],U[L],U[At]);const dt=[];let xt,Gt=ft.concat();for(let Z=0,at=P.length;Z<at;Z++){const L=P[Z];xt=[];for(let At=0,rt=L.length,vt=rt-1,ct=At+1;At<rt;At++,vt++,ct++)vt===rt&&(vt=0),ct===rt&&(ct=0),xt[At]=B(L[At],L[vt],L[ct]);dt.push(xt),Gt=Gt.concat(xt)}for(let Z=0;Z<p;Z++){const at=Z/p,L=d*Math.cos(at*Math.PI/2),At=g*Math.sin(at*Math.PI/2)+x;for(let rt=0,vt=U.length;rt<vt;rt++){const ct=X(U[rt],ft[rt],At);st(ct.x,ct.y,-L)}for(let rt=0,vt=P.length;rt<vt;rt++){const ct=P[rt];xt=dt[rt];for(let Ot=0,_t=ct.length;Ot<_t;Ot++){const R=X(ct[Ot],xt[Ot],At);st(R.x,R.y,-L)}}}const tt=g+x;for(let Z=0;Z<q;Z++){const at=f?X(S[Z],Gt[Z],tt):S[Z];v?(T.copy(b.normals[0]).multiplyScalar(at.x),_.copy(b.binormals[0]).multiplyScalar(at.y),C.copy(M[0]).add(T).add(_),st(C.x,C.y,C.z)):st(at.x,at.y,0)}for(let Z=1;Z<=h;Z++)for(let at=0;at<q;at++){const L=f?X(S[at],Gt[at],tt):S[at];v?(T.copy(b.normals[Z]).multiplyScalar(L.x),_.copy(b.binormals[Z]).multiplyScalar(L.y),C.copy(M[Z]).add(T).add(_),st(C.x,C.y,C.z)):st(L.x,L.y,u/h*Z)}for(let Z=p-1;Z>=0;Z--){const at=Z/p,L=d*Math.cos(at*Math.PI/2),At=g*Math.sin(at*Math.PI/2)+x;for(let rt=0,vt=U.length;rt<vt;rt++){const ct=X(U[rt],ft[rt],At);st(ct.x,ct.y,u+L)}for(let rt=0,vt=P.length;rt<vt;rt++){const ct=P[rt];xt=dt[rt];for(let Ot=0,_t=ct.length;Ot<_t;Ot++){const R=X(ct[Ot],xt[Ot],At);v?st(R.x,R.y+M[h-1].y,M[h-1].x+L):st(R.x,R.y,u+L)}}}O(),J();function O(){const Z=n.length/3;if(f){let at=0,L=q*at;for(let At=0;At<$;At++){const rt=I[At];Pt(rt[2]+L,rt[1]+L,rt[0]+L)}at=h+p*2,L=q*at;for(let At=0;At<$;At++){const rt=I[At];Pt(rt[0]+L,rt[1]+L,rt[2]+L)}}else{for(let at=0;at<$;at++){const L=I[at];Pt(L[2],L[1],L[0])}for(let at=0;at<$;at++){const L=I[at];Pt(L[0]+q*h,L[1]+q*h,L[2]+q*h)}}i.addGroup(Z,n.length/3-Z,0)}function J(){const Z=n.length/3;let at=0;ht(U,at),at+=U.length;for(let L=0,At=P.length;L<At;L++){const rt=P[L];ht(rt,at),at+=rt.length}i.addGroup(Z,n.length/3-Z,1)}function ht(Z,at){let L=Z.length;for(;--L>=0;){const At=L;let rt=L-1;rt<0&&(rt=Z.length-1);for(let vt=0,ct=h+p*2;vt<ct;vt++){const Ot=q*vt,_t=q*(vt+1),R=at+At+Ot,E=at+rt+Ot,H=at+rt+_t,K=at+At+_t;kt(R,E,H,K)}}}function st(Z,at,L){l.push(Z),l.push(at),l.push(L)}function Pt(Z,at,L){ot(Z),ot(at),ot(L);const At=n.length/3,rt=y.generateTopUV(i,n,At-3,At-2,At-1);mt(rt[0]),mt(rt[1]),mt(rt[2])}function kt(Z,at,L,At){ot(Z),ot(at),ot(At),ot(at),ot(L),ot(At);const rt=n.length/3,vt=y.generateSideWallUV(i,n,rt-6,rt-3,rt-2,rt-1);mt(vt[0]),mt(vt[1]),mt(vt[3]),mt(vt[1]),mt(vt[2]),mt(vt[3])}function ot(Z){n.push(l[Z*3+0]),n.push(l[Z*3+1]),n.push(l[Z*3+2])}function mt(Z){s.push(Z.x),s.push(Z.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,i=this.parameters.options;return cx(e,i,t)}static fromJSON(t,e){const i=[];for(let s=0,a=t.shapes.length;s<a;s++){const o=e[t.shapes[s]];i.push(o)}const n=t.options.extrudePath;return n!==void 0&&(t.options.extrudePath=new al[n.type]().fromJSON(n)),new Dl(i,t.options)}}const lx={generateTopUV:function(r,t,e,i,n){const s=t[e*3],a=t[e*3+1],o=t[i*3],l=t[i*3+1],c=t[n*3],h=t[n*3+1];return[new it(s,a),new it(o,l),new it(c,h)]},generateSideWallUV:function(r,t,e,i,n,s){const a=t[e*3],o=t[e*3+1],l=t[e*3+2],c=t[i*3],h=t[i*3+1],u=t[i*3+2],f=t[n*3],d=t[n*3+1],g=t[n*3+2],x=t[s*3],p=t[s*3+1],m=t[s*3+2];return Math.abs(o-h)<Math.abs(a-c)?[new it(a,1-l),new it(c,1-u),new it(f,1-g),new it(x,1-m)]:[new it(o,1-l),new it(h,1-u),new it(d,1-g),new it(p,1-m)]}};function cx(r,t,e){if(e.shapes=[],Array.isArray(r))for(let i=0,n=r.length;i<n;i++){const s=r[i];e.shapes.push(s.uuid)}else e.shapes.push(r.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class ds extends Pl{constructor(t=1,e=0){const i=(1+Math.sqrt(5))/2,n=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],s=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(n,s,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new ds(t.radius,t.detail)}}class lr extends we{constructor(t=.5,e=1,i=32,n=1,s=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:i,phiSegments:n,thetaStart:s,thetaLength:a},i=Math.max(3,i),n=Math.max(1,n);const o=[],l=[],c=[],h=[];let u=t;const f=(e-t)/n,d=new D,g=new it;for(let x=0;x<=n;x++){for(let p=0;p<=i;p++){const m=s+p/i*a;d.x=u*Math.cos(m),d.y=u*Math.sin(m),l.push(d.x,d.y,d.z),c.push(0,0,1),g.x=(d.x/e+1)/2,g.y=(d.y/e+1)/2,h.push(g.x,g.y)}u+=f}for(let x=0;x<n;x++){const p=x*(i+1);for(let m=0;m<i;m++){const y=m+p,M=y,v=y+i+1,b=y+i+2,_=y+1;o.push(M,v,_),o.push(v,b,_)}}this.setIndex(o),this.setAttribute("position",new jt(l,3)),this.setAttribute("normal",new jt(c,3)),this.setAttribute("uv",new jt(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new lr(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class ji extends we{constructor(t=1,e=32,i=16,n=0,s=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:i,phiStart:n,phiLength:s,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),i=Math.max(2,Math.floor(i));const l=Math.min(a+o,Math.PI);let c=0;const h=[],u=new D,f=new D,d=[],g=[],x=[],p=[];for(let m=0;m<=i;m++){const y=[],M=m/i;let v=0;m===0&&a===0?v=.5/e:m===i&&l===Math.PI&&(v=-.5/e);for(let b=0;b<=e;b++){const _=b/e;u.x=-t*Math.cos(n+_*s)*Math.sin(a+M*o),u.y=t*Math.cos(a+M*o),u.z=t*Math.sin(n+_*s)*Math.sin(a+M*o),g.push(u.x,u.y,u.z),f.copy(u).normalize(),x.push(f.x,f.y,f.z),p.push(_+v,1-M),y.push(c++)}h.push(y)}for(let m=0;m<i;m++)for(let y=0;y<e;y++){const M=h[m][y+1],v=h[m][y],b=h[m+1][y],_=h[m+1][y+1];(m!==0||a>0)&&d.push(M,v,_),(m!==i-1||l<Math.PI)&&d.push(v,b,_)}this.setIndex(d),this.setAttribute("position",new jt(g,3)),this.setAttribute("normal",new jt(x,3)),this.setAttribute("uv",new jt(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ji(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class Js extends we{constructor(t=1,e=.4,i=12,n=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:n,arc:s},i=Math.floor(i),n=Math.floor(n);const a=[],o=[],l=[],c=[],h=new D,u=new D,f=new D;for(let d=0;d<=i;d++)for(let g=0;g<=n;g++){const x=g/n*s,p=d/i*Math.PI*2;u.x=(t+e*Math.cos(p))*Math.cos(x),u.y=(t+e*Math.cos(p))*Math.sin(x),u.z=e*Math.sin(p),o.push(u.x,u.y,u.z),h.x=t*Math.cos(x),h.y=t*Math.sin(x),f.subVectors(u,h).normalize(),l.push(f.x,f.y,f.z),c.push(g/n),c.push(d/i)}for(let d=1;d<=i;d++)for(let g=1;g<=n;g++){const x=(n+1)*d+g-1,p=(n+1)*(d-1)+g-1,m=(n+1)*(d-1)+g,y=(n+1)*d+g;a.push(x,p,y),a.push(p,m,y)}this.setIndex(a),this.setAttribute("position",new jt(o,3)),this.setAttribute("normal",new jt(l,3)),this.setAttribute("uv",new jt(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Js(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class hx extends ve{static get type(){return"RawShaderMaterial"}constructor(t){super(t),this.isRawShaderMaterial=!0}}class Et extends Hn{static get type(){return"MeshStandardMaterial"}constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new j(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new j(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Gh,this.normalScale=new it(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new zi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class wa extends me{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new j(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class ux extends wa{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(me.DEFAULT_UP),this.updateMatrix(),this.groundColor=new j(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const so=new Vt,th=new D,eh=new D;class Ll{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new it(512,512),this.map=null,this.mapPass=null,this.matrix=new Vt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ml,this._frameExtents=new it(1,1),this._viewportCount=1,this._viewports=[new ye(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,i=this.matrix;th.setFromMatrixPosition(t.matrixWorld),e.position.copy(th),eh.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(eh),e.updateMatrixWorld(),so.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(so),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(so)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class fx extends Ll{constructor(){super(new ni(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(t){const e=this.camera,i=la*2*t.angle*this.focus,n=this.mapSize.width/this.mapSize.height,s=t.distance||e.far;(i!==e.fov||n!==e.aspect||s!==e.far)&&(e.fov=i,e.aspect=n,e.far=s,e.updateProjectionMatrix()),super.updateMatrices(t)}copy(t){return super.copy(t),this.focus=t.focus,this}}class dx extends wa{constructor(t,e,i=0,n=Math.PI/3,s=0,a=2){super(t,e),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(me.DEFAULT_UP),this.updateMatrix(),this.target=new me,this.distance=i,this.angle=n,this.penumbra=s,this.decay=a,this.map=null,this.shadow=new fx}get power(){return this.intensity*Math.PI}set power(t){this.intensity=t/Math.PI}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.angle=t.angle,this.penumbra=t.penumbra,this.decay=t.decay,this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const ih=new Vt,Os=new D,ro=new D;class px extends Ll{constructor(){super(new ni(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new it(4,2),this._viewportCount=6,this._viewports=[new ye(2,1,1,1),new ye(0,1,1,1),new ye(3,1,1,1),new ye(1,1,1,1),new ye(3,0,1,1),new ye(1,0,1,1)],this._cubeDirections=[new D(1,0,0),new D(-1,0,0),new D(0,0,1),new D(0,0,-1),new D(0,1,0),new D(0,-1,0)],this._cubeUps=[new D(0,1,0),new D(0,1,0),new D(0,1,0),new D(0,1,0),new D(0,0,1),new D(0,0,-1)]}updateMatrices(t,e=0){const i=this.camera,n=this.matrix,s=t.distance||i.far;s!==i.far&&(i.far=s,i.updateProjectionMatrix()),Os.setFromMatrixPosition(t.matrixWorld),i.position.copy(Os),ro.copy(i.position),ro.add(this._cubeDirections[e]),i.up.copy(this._cubeUps[e]),i.lookAt(ro),i.updateMatrixWorld(),n.makeTranslation(-Os.x,-Os.y,-Os.z),ih.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ih)}}class rr extends wa{constructor(t,e,i=0,n=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=n,this.shadow=new px}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class mx extends Ll{constructor(){super(new va(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class nh extends wa{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(me.DEFAULT_UP),this.updateMatrix(),this.target=new me,this.shadow=new mx}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class gx{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=sh(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=sh();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}function sh(){return performance.now()}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:pa}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=pa);const mu={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class Gn{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const xx=new va(-1,1,1,-1,0,1);class vx extends we{constructor(){super(),this.setAttribute("position",new jt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new jt([0,2,0,0,2,0],2))}}const yx=new vx;class zl{constructor(t){this._mesh=new G(yx,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,xx)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}}class gu extends Gn{constructor(t,e){super(),this.textureID=e!==void 0?e:"tDiffuse",t instanceof ve?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=er.clone(t.uniforms),this.material=new ve({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this.fsQuad=new zl(this.material)}render(t,e,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=i.texture),this.fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class rh extends Gn{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,i){const n=t.getContext(),s=t.state;s.buffers.color.setMask(!1),s.buffers.depth.setMask(!1),s.buffers.color.setLocked(!0),s.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),s.buffers.stencil.setTest(!0),s.buffers.stencil.setOp(n.REPLACE,n.REPLACE,n.REPLACE),s.buffers.stencil.setFunc(n.ALWAYS,a,4294967295),s.buffers.stencil.setClear(o),s.buffers.stencil.setLocked(!0),t.setRenderTarget(i),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),s.buffers.color.setLocked(!1),s.buffers.depth.setLocked(!1),s.buffers.color.setMask(!0),s.buffers.depth.setMask(!0),s.buffers.stencil.setLocked(!1),s.buffers.stencil.setFunc(n.EQUAL,1,4294967295),s.buffers.stencil.setOp(n.KEEP,n.KEEP,n.KEEP),s.buffers.stencil.setLocked(!0)}}class Mx extends Gn{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}}class Sx{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){const i=t.getSize(new it);this._width=i.width,this._height=i.height,e=new ze(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Je}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new gu(mu),this.copyPass.material.blending=Qi,this.clock=new gx}swapBuffers(){const t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){const e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){t===void 0&&(t=this.clock.getDelta());const e=this.renderer.getRenderTarget();let i=!1;for(let n=0,s=this.passes.length;n<s;n++){const a=this.passes[n];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(n),a.render(this.renderer,this.writeBuffer,this.readBuffer,t,i),a.needsSwap){if(i){const o=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),l.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}rh!==void 0&&(a instanceof rh?i=!0:a instanceof Mx&&(i=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){const e=this.renderer.getSize(new it);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;const i=this._width*this._pixelRatio,n=this._height*this._pixelRatio;this.renderTarget1.setSize(i,n),this.renderTarget2.setSize(i,n);for(let s=0;s<this.passes.length;s++)this.passes[s].setSize(i,n)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class wx extends Gn{constructor(t,e,i=null,n=null,s=null){super(),this.scene=t,this.camera=e,this.overrideMaterial=i,this.clearColor=n,this.clearAlpha=s,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new j}render(t,e,i){const n=t.autoClear;t.autoClear=!1;let s,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor,t.getClearAlpha())),this.clearAlpha!==null&&(s=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:i),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(s),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),t.autoClear=n}}const bx={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new j(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class ws extends Gn{constructor(t,e,i,n){super(),this.strength=e!==void 0?e:1,this.radius=i,this.threshold=n,this.resolution=t!==void 0?new it(t.x,t.y):new it(256,256),this.clearColor=new j(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let s=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new ze(s,a,{type:Je}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let u=0;u<this.nMips;u++){const f=new ze(s,a,{type:Je});f.texture.name="UnrealBloomPass.h"+u,f.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(f);const d=new ze(s,a,{type:Je});d.texture.name="UnrealBloomPass.v"+u,d.texture.generateMipmaps=!1,this.renderTargetsVertical.push(d),s=Math.round(s/2),a=Math.round(a/2)}const o=bx;this.highPassUniforms=er.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=n,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new ve({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];const l=[3,5,7,9,11];s=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let u=0;u<this.nMips;u++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(l[u])),this.separableBlurMaterials[u].uniforms.invSize.value=new it(1/s,1/a),s=Math.round(s/2),a=Math.round(a/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=e,this.compositeMaterial.uniforms.bloomRadius.value=.1;const c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new D(1,1,1),new D(1,1,1),new D(1,1,1),new D(1,1,1),new D(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;const h=mu;this.copyUniforms=er.clone(h.uniforms),this.blendMaterial=new ve({uniforms:this.copyUniforms,vertexShader:h.vertexShader,fragmentShader:h.fragmentShader,blending:$s,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new j,this.oldClearAlpha=1,this.basic=new pe,this.fsQuad=new zl(null)}dispose(){for(let t=0;t<this.renderTargetsHorizontal.length;t++)this.renderTargetsHorizontal[t].dispose();for(let t=0;t<this.renderTargetsVertical.length;t++)this.renderTargetsVertical[t].dispose();this.renderTargetBright.dispose();for(let t=0;t<this.separableBlurMaterials.length;t++)this.separableBlurMaterials[t].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(t,e){let i=Math.round(t/2),n=Math.round(e/2);this.renderTargetBright.setSize(i,n);for(let s=0;s<this.nMips;s++)this.renderTargetsHorizontal[s].setSize(i,n),this.renderTargetsVertical[s].setSize(i,n),this.separableBlurMaterials[s].uniforms.invSize.value=new it(1/i,1/n),i=Math.round(i/2),n=Math.round(n/2)}render(t,e,i,n,s){t.getClearColor(this._oldClearColor),this.oldClearAlpha=t.getClearAlpha();const a=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),s&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=i.texture,t.setRenderTarget(null),t.clear(),this.fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=i.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this.fsQuad.render(t);let o=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this.fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[l].uniforms.direction.value=ws.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[l]),t.clear(),this.fsQuad.render(t),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=ws.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[l]),t.clear(),this.fsQuad.render(t),o=this.renderTargetsVertical[l];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this.fsQuad.render(t),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,s&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(i),this.fsQuad.render(t)),t.setClearColor(this._oldClearColor,this.oldClearAlpha),t.autoClear=a}getSeperableBlurMaterial(t){const e=[];for(let i=0;i<t;i++)e.push(.39894*Math.exp(-.5*i*i/(t*t))/t);return new ve({defines:{KERNEL_RADIUS:t},uniforms:{colorTexture:{value:null},invSize:{value:new it(.5,.5)},direction:{value:new it(.5,.5)},gaussianCoefficients:{value:e}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}getCompositeMaterial(t){return new ve({defines:{NUM_MIPS:t},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}}ws.BlurDirectionX=new it(1,0);ws.BlurDirectionY=new it(0,1);const _x={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`
	
		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};class Tx extends Gn{constructor(){super();const t=_x;this.uniforms=er.clone(t.uniforms),this.material=new hx({name:t.name,uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader}),this.fsQuad=new zl(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,e,i){this.uniforms.tDiffuse.value=i.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},re.getTransfer(this._outputColorSpace)===xe&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Ah?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Ch?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===Rh?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===dl?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Ph?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Dh&&(this.material.defines.NEUTRAL_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}function Ei(r,t=!1){const e=r[0].index!==null,i=new Set(Object.keys(r[0].attributes)),n=new Set(Object.keys(r[0].morphAttributes)),s={},a={},o=r[0].morphTargetsRelative,l=new we;let c=0;for(let h=0;h<r.length;++h){const u=r[h];let f=0;if(e!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const d in u.attributes){if(!i.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+d+'" attribute exists among all geometries, or in none of them.'),null;s[d]===void 0&&(s[d]=[]),s[d].push(u.attributes[d]),f++}if(f!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(o!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const d in u.morphAttributes){if(!n.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;a[d]===void 0&&(a[d]=[]),a[d].push(u.morphAttributes[d])}if(t){let d;if(e)d=u.index.count;else if(u.attributes.position!==void 0)d=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,d,h),c+=d}}if(e){let h=0;const u=[];for(let f=0;f<r.length;++f){const d=r[f].index;for(let g=0;g<d.count;++g)u.push(d.getX(g)+h);h+=r[f].attributes.position.count}l.setIndex(u)}for(const h in s){const u=ah(s[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,u)}for(const h in a){const u=a[h][0].length;if(u===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let f=0;f<u;++f){const d=[];for(let x=0;x<a[h].length;++x)d.push(a[h][x][f]);const g=ah(d);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(g)}}return l}function ah(r){let t,e,i,n=-1,s=0;for(let c=0;c<r.length;++c){const h=r[c];if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=h.normalized),i!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(n===-1&&(n=h.gpuType),n!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;s+=h.count*e}const a=new t(s),o=new Pe(a,e,i);let l=0;for(let c=0;c<r.length;++c){const h=r[c];if(h.isInterleavedBufferAttribute){const u=l/e;for(let f=0,d=h.count;f<d;f++)for(let g=0;g<e;g++){const x=h.getComponent(f,g);o.setComponent(f+u,g,x)}}else a.set(h.array,l);l+=h.count*e}return n!==void 0&&(o.gpuType=n),o}const Ne={BLOCKS:26,BLOCK:60,ROAD:20,ASPHALT:14,LANE:3.5,CURB:.15,ISLAND_MARGIN:70,BEACH:30,WORLD_R:1200};Ne.PITCH=Ne.BLOCK+Ne.ROAD;Ne.HALF=Ne.BLOCKS*Ne.PITCH/2;Ne.LAND=Ne.HALF+Ne.ISLAND_MARGIN;Ne.WATER=Ne.LAND+Ne.BEACH;const Ke={WALK:3.2,RUN:7.5,SPRINT:10.5,ACCEL:30,JUMP:6.5,GRAVITY:22,RADIUS:.4,MAX_HEALTH:100,SWIM:2.5},Bs={MAX:5,DECAY_TIME:[0,25,40,60,90,120],COPS_PER_LEVEL:[0,1,2,4,6,8],COP_SIGHT:70},oh={LENGTH:480,START:.36},lh={forward:["KeyW","ArrowUp"],back:["KeyS","ArrowDown"],left:["KeyA","ArrowLeft"],right:["KeyD","ArrowRight"],sprint:["ShiftLeft","ShiftRight"],jump:["Space"],handbrake:["Space"],enter:["KeyF"],interact:["KeyE"],ao:["KeyO"],horn:["KeyH"],camera:["KeyC"],map:["KeyM"],pause:["Escape","KeyP"],radio:["KeyR"],skiptime:["KeyT"],nextWeapon:["KeyQ"],help:["F1"]};function Mn(r=1337){let t=r>>>0;const e=()=>{t|=0,t=t+1831565813|0;let i=Math.imul(t^t>>>15,1|t);return i=i+Math.imul(i^i>>>7,61|i)^i,((i^i>>>14)>>>0)/4294967296};return e.range=(i,n)=>i+(n-i)*e(),e.int=(i,n)=>Math.floor(e.range(i,n+1)),e.pick=i=>i[Math.floor(e()*i.length)],e.chance=i=>e()<i,e}const Dt=(r=0,t=1)=>r+Math.random()*(t-r),He=r=>r[Math.floor(Math.random()*r.length)],ie=(r,t,e)=>r<t?t:r>e?e:r,te=(r,t,e)=>r+(t-r)*e,de=(r,t,e,i)=>te(r,t,1-Math.exp(-e*i)),Vr=(r,t,e)=>{const i=ie((e-r)/(t-r),0,1);return i*i*(3-2*i)},ms=Math.PI*2;function xu(r,t,e){let i=((t-r+Math.PI)%ms+ms)%ms-Math.PI;return r+i*e}function Li(r,t,e,i){return xu(r,t,1-Math.exp(-e*i))}function cr(r){return((r+Math.PI)%ms+ms)%ms-Math.PI}function bt(r,t,e,i){const n=r-e,s=t-i;return Math.hypot(n,s)}new D;new D;new D;function gs(r){return"$"+Math.max(0,Math.floor(r)).toLocaleString("en-US")}function Ex(r){const t=Math.floor(r*24),e=Math.floor((r*24-t)*60);return`${String(t).padStart(2,"0")}:${String(e).padStart(2,"0")}`}class Ax{constructor(t=24){this.cell=t,this.map=new Map,this.items=[]}key(t,e){return t*73856093^e*19349663}add(t){this.items.push(t);const e=this.cell;for(let i=Math.floor(t.minX/e);i<=Math.floor(t.maxX/e);i++)for(let n=Math.floor(t.minZ/e);n<=Math.floor(t.maxZ/e);n++){const s=this.key(i,n);let a=this.map.get(s);a||(a=[],this.map.set(s,a)),a.push(t)}}query(t,e,i,n,s=[]){s.length=0;const a=this.cell;for(let o=Math.floor(t/a);o<=Math.floor(e/a);o++)for(let l=Math.floor(i/a);l<=Math.floor(n/a);l++){const c=this.map.get(this.key(o,l));if(c)for(const h of c)!h.disabled&&h.maxX>=t&&h.minX<=e&&h.maxZ>=i&&h.minZ<=n&&!s.includes(h)&&s.push(h)}return s}}const bs=[];function fa(r,t,e,i=1/0,n=0){let s=null;r.query(t.x-e,t.x+e,t.z-e,t.z+e,bs);for(let a=0;a<3;a++){let o=!1;for(const l of bs){if(l.minY!==void 0&&(n>l.maxY||n+1.6<l.minY))continue;const c=Math.max(l.minX,Math.min(t.x,l.maxX)),h=Math.max(l.minZ,Math.min(t.z,l.maxZ));let u=t.x-c,f=t.z-h,d=u*u+f*f;if(!(d>=e*e))if(s=l,o=!0,d<1e-8){const g=t.x-l.minX,x=l.maxX-t.x,p=t.z-l.minZ,m=l.maxZ-t.z,y=Math.min(g,x,p,m);y===g?t.x=l.minX-e:y===x?t.x=l.maxX+e:y===p?t.z=l.minZ-e:t.z=l.maxZ+e}else{const g=Math.sqrt(d),x=e-g;t.x+=u/g*x,t.z+=f/g*x}}if(!o)break}return s}function da(r,t,e,i,n,s,a){const o=t+i*s,l=e+n*s;r.query(Math.min(t,o),Math.max(t,o),Math.min(e,l),Math.max(e,l),bs);let c=1/0,h=null;for(const u of bs){let f=0,d=s;if(Math.abs(i)<1e-9){if(t<u.minX||t>u.maxX)continue}else{let g=(u.minX-t)/i,x=(u.maxX-t)/i;g>x&&([g,x]=[x,g]),f=Math.max(f,g),d=Math.min(d,x)}if(Math.abs(n)<1e-9){if(e<u.minZ||e>u.maxZ)continue}else{let g=(u.minZ-e)/n,x=(u.maxZ-e)/n;g>x&&([g,x]=[x,g]),f=Math.max(f,g),d=Math.min(d,x)}d>=f&&f<c&&(!a||a(u,f))&&(c=f,h=u)}return{t:c,box:h}}const ao=[];function Cx(r,t,e,i){const n=Math.cos(t.heading),s=Math.sin(t.heading),a=s,o=n,l=n,c=-s;ao.length=0;for(const[f,d]of[[1,1],[1,-1],[-1,1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1],[.5,1],[.5,-1],[-.5,1],[-.5,-1]])ao.push([t.x+a*e*f+l*i*d,t.z+o*e*f+c*i*d]);const h=Math.hypot(e,i);r.query(t.x-h,t.x+h,t.z-h,t.z+h,bs);let u=null;for(const f of bs)if(!(f.minY!==void 0&&f.minY>1))for(const[d,g]of ao){if(d<f.minX||d>f.maxX||g<f.minZ||g>f.maxZ)continue;const x=d-f.minX,p=f.maxX-d,m=g-f.minZ,y=f.maxZ-g,M=Math.min(x,p,m,y);let v=0,b=0;M===x?v=-1:M===p?v=1:M===m?b=-1:b=1,(!u||M>u.depth)&&(u={nx:v,nz:b,depth:M,box:f})}return u&&(t.x+=u.nx*(u.depth+.02),t.z+=u.nz*(u.depth+.02)),u}function Ii(r,t){const e=document.createElement("canvas");return e.width=r,e.height=t,e}function Ui(r,t=!0,e=!0){const i=new Ma(r);return i.wrapS=i.wrapT=t?Ms:dn,i.anisotropy=8,e&&(i.colorSpace=ii),i.generateMipmaps=!0,i.minFilter=pn,i}function Cs(r,t,e,i,n){const s=r.getImageData(0,0,t,e),a=s.data;for(let o=0;o<a.length;o+=4){const l=(n()-.5)*i;a[o]+=l,a[o+1]+=l,a[o+2]+=l}r.putImageData(s,0,0)}function Rx(r,t){const e=Mn(t),i=256,n=4,s=4,a=Ii(i,i),o=a.getContext("2d"),l=Ii(i,i),c=l.getContext("2d");c.fillStyle="#000",c.fillRect(0,0,i,i);const h=i/n,u=i/s,f={glass:{wall:["#44556a","#3c4d60","#4d6076"],win:["#7fa6c8","#6d94b8","#93b6d4"],frame:"#1a2430",wx:.06,wy:.06,ww:.88,wh:.88},concrete:{wall:["#8a8378","#9a9388","#7d776d"],win:["#2b3440","#22303d","#334252"],frame:"#4a463f",wx:.22,wy:.24,ww:.56,wh:.5},brick:{wall:["#7a4a3a","#8a5545","#6e4234"],win:["#1f2a33","#2a3540","#1b252e"],frame:"#d8d0c0",wx:.25,wy:.2,ww:.5,wh:.55},tower:{wall:["#c9cdd3","#bcc1c8","#d3d7dc"],win:["#354a5e","#2e4356","#41576c"],frame:"#2a2f36",wx:.12,wy:.14,ww:.76,wh:.66},house:{wall:["#d9c6a5","#c8b08b","#e2d3b8"],win:["#243241","#2c3c4c","#1e2b38"],frame:"#f2efe8",wx:.3,wy:.28,ww:.4,wh:.44},industrial:{wall:["#6d7378","#767c81","#62686d"],win:["#3a4650","#31404a","#42505a"],frame:"#40464b",wx:.15,wy:.4,ww:.7,wh:.25}},d=f[r]||f.concrete;o.fillStyle=d.wall[0],o.fillRect(0,0,i,i);for(let g=0;g<400;g++)o.fillStyle=e.pick(d.wall),o.globalAlpha=.25,o.fillRect(e()*i,e()*i,e()*30,e()*8);if(o.globalAlpha=1,r==="brick"){o.strokeStyle="rgba(0,0,0,0.25)",o.lineWidth=1;for(let g=0;g<i;g+=6)o.beginPath(),o.moveTo(0,g),o.lineTo(i,g),o.stroke();for(let g=0;g<i;g+=6)for(let x=g/6%2*8;x<i;x+=16)o.beginPath(),o.moveTo(x,g),o.lineTo(x,g+6),o.stroke()}if(r==="glass"||r==="tower"){o.fillStyle="rgba(0,0,0,0.35)";for(let g=0;g<s;g++)o.fillRect(0,g*u,i,3)}for(let g=0;g<s;g++)for(let x=0;x<n;x++){const p=x*h+d.wx*h,m=g*u+d.wy*u,y=d.ww*h,M=d.wh*u;o.fillStyle=d.frame,o.fillRect(p-2,m-2,y+4,M+4);const v=o.createLinearGradient(p,m,p+y,m+M),b=e.pick(d.win);if(v.addColorStop(0,b),v.addColorStop(1,"#0d141b"),o.fillStyle=v,o.fillRect(p,m,y,M),o.fillStyle="rgba(255,255,255,0.10)",o.fillRect(p+y*.1,m,y*.18,M),r!=="glass"&&(o.fillStyle=d.frame,o.fillRect(p+y/2-1,m,2,M),o.fillRect(p,m+M/2-1,y,2)),e()<.45){const _=e.pick(["#ffd9a0","#ffe7c2","#d8e6ff","#fff2d6","#ffcf80"]);c.fillStyle=_,c.globalAlpha=.35+e()*.45,c.fillRect(p,m,y,M),c.globalAlpha=1,e()<.4&&(c.fillStyle="#000",c.globalAlpha=.6,c.fillRect(p+y/2,m,y/2,M),c.globalAlpha=1)}}return Cs(o,i,i,18,e),{map:Ui(a),emissiveMap:Ui(l)}}function Px(r){const t=Mn(r),e=128,i=Ii(e,e),n=i.getContext("2d");n.fillStyle="#4b4a48",n.fillRect(0,0,e,e);for(let s=0;s<300;s++)n.fillStyle=`rgba(${t()<.5?0:255},${t()<.5?0:255},${t()<.5?0:255},0.05)`,n.fillRect(t()*e,t()*e,t()*12,t()*12);return Cs(n,e,e,24,t),Ui(i)}function Dx(r=7){const t=Mn(r),e=512,i=512,n=Ii(e,i),s=n.getContext("2d");s.fillStyle="#2d2f33",s.fillRect(0,0,e,i);for(let o=0;o<6e3;o++)s.fillStyle=`rgba(${t()<.5?0:255},${t()<.5?0:255},${t()<.5?0:255},0.06)`,s.fillRect(t()*e,t()*i,2,2);const a=e/14;s.fillStyle="#d6b23a",s.fillRect(e/2-a*.25,0,a*.12,i),s.fillRect(e/2+a*.13,0,a*.12,i),s.fillStyle="#d9d9d2";for(const o of[3.5,10.5])for(let l=0;l<i;l+=i/2)s.fillRect(o*a-a*.06,l+i*.1,a*.12,i*.28);s.fillStyle="rgba(230,230,220,0.8)",s.fillRect(a*.2,0,a*.1,i),s.fillRect(e-a*.3,0,a*.1,i),s.fillStyle="rgba(0,0,0,0.12)";for(const o of[1.1,2.5,4.6,6,8,9.4,11.5,12.9])s.fillRect(o*a-a*.25,0,a*.5,i);return Cs(s,e,i,14,t),Ui(n)}function Lx(r=8){const t=Mn(r),e=256,i=Ii(e,e),n=i.getContext("2d");n.fillStyle="#2d2f33",n.fillRect(0,0,e,e);for(let s=0;s<2500;s++)n.fillStyle=`rgba(${t()<.5?0:255},${t()<.5?0:255},${t()<.5?0:255},0.06)`,n.fillRect(t()*e,t()*e,2,2);return Cs(n,e,e,14,t),Ui(i)}function zx(){const t=Ii(256,256),e=t.getContext("2d");e.clearRect(0,0,256,256),e.fillStyle="rgba(235,235,225,0.85)";for(let n=8;n<256;n+=32)e.fillRect(n,0,18,256);return Ui(t,!1)}function Ix(r=9){const t=Mn(r),e=256,i=Ii(e,e),n=i.getContext("2d");n.fillStyle="#a8a49c",n.fillRect(0,0,e,e),n.strokeStyle="rgba(0,0,0,0.28)",n.lineWidth=3;for(let s=0;s<=2;s++)n.beginPath(),n.moveTo(s*e/2,0),n.lineTo(s*e/2,e),n.stroke(),n.beginPath(),n.moveTo(0,s*e/2),n.lineTo(e,s*e/2),n.stroke();for(let s=0;s<2e3;s++)n.fillStyle=`rgba(0,0,0,${t()*.08})`,n.fillRect(t()*e,t()*e,2,2);return Cs(n,e,e,16,t),Ui(i)}function Ux(r=10){const t=Mn(r),e=256,i=Ii(e,e),n=i.getContext("2d");n.fillStyle="#4f7a34",n.fillRect(0,0,e,e);for(let s=0;s<6e3;s++)n.fillStyle=t.pick(["#5c8a3c","#476e2e","#67963f","#3f6529"]),n.fillRect(t()*e,t()*e,2+t()*3,1+t()*2);return Cs(n,e,e,12,t),Ui(i)}function vu(){const t=Ii(64,64),e=t.getContext("2d"),i=e.createRadialGradient(64/2,64/2,0,64/2,64/2,64/2);return i.addColorStop(0,"rgba(255,255,255,1)"),i.addColorStop(.4,"rgba(255,255,255,0.6)"),i.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=i,e.fillRect(0,0,64,64),Ui(t,!1,!1)}function Nx(){const t=Ii(64,64),e=t.getContext("2d"),i=e.createRadialGradient(64/2,64/2,0,64/2,64/2,64/2);return i.addColorStop(0,"rgba(255,255,255,0.9)"),i.addColorStop(.5,"rgba(255,255,255,0.35)"),i.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=i,e.fillRect(0,0,64,64),Ui(t,!1,!1)}const{PITCH:Ht,ASPHALT:wi,LANE:ch,CURB:Mi,BLOCKS:ue,HALF:oe}=Ne,ci=wi/2,hn=Ne.ROAD/2,oo=10.5,Fx=r=>ch/2+ch*r,hh=[{id:"santos",label:"Santos",x0:15,z0:15,nx:9,nz:9},{id:"ferro",label:"Ferro",x0:1,z0:8,nx:7,nz:7},{id:"venturas",label:"Venturas",x0:16,z0:1,nx:7,nz:6},{id:"carson",label:"Bone County",x0:10,z0:3,nx:2,nz:2}],Wr=[{axis:"x",c:-240,from:-480,to:-240,red:!1},{axis:"x",c:320,from:-480,to:-120,red:!0},{axis:"z",c:160,from:-90,to:10,red:!1},{axis:"z",c:-80,from:-90,to:10,red:!1},{axis:"z",c:240,from:-90,to:10,red:!1}],Ai=3,kx=[{k:15,m0:9,m1:24},{k:16,m0:2,m1:14},{k:12,m0:9,m1:14}],Ox=[{j:10,m0:7,m1:12},{j:17,m0:2,m1:15},{j:18,m0:2,m1:15},{j:4,m0:1,m1:10}],lo=(r,t,e,i,n,s)=>((r-e)/n)**2+((t-i)/s)**2<1;function je(r,t){return!!((Math.abs(r)/1e3)**4+(Math.abs(t)/1060)**4>1||lo(r,t,-320,-160,70,300)||lo(r,t,-300,380,180,180)||lo(r,t,1e3,350,110,200)||t>-63&&t<-17&&r>-300&&r<1150)}function aa(r,t){const e=Math.hypot(r+760,t-640);return e>=270?0:135*Math.pow(Math.cos(e/270*Math.PI/2),1.4)}function uh(r,t){const e=aa(r,t);if(e>6)return e;let i=e;if(r>-980&&r<-380&&t>-420&&t<180&&(i+=1.8+1.5*Math.sin(r*.011+1.3)*Math.cos(t*.013)),r>-340&&r<260&&t>-980&&t<-380&&(i+=1.1*Math.sin(r*.021+1)*Math.sin(t*.023+2)),i===0)return 0;const n=((r+oe)%Ht+Ht)%Ht,s=((t+oe)%Ht+Ht)%Ht,a=Math.min(Math.min(n,Ht-n),Math.min(s,Ht-s)),o=Math.min(1,Math.max(0,(a-9)/12));return i*o*o*(3-2*o)}class Ci{constructor(){this.pos=[],this.nrm=[],this.uv=[],this.col=[],this.idx=[],this.n=0}quad(t,e,i,n,s,a,o,l,c){for(const u of[t,e,i,n])this.pos.push(u[0],u[1],u[2]),this.nrm.push(s,a,o),this.col.push(c.r,c.g,c.b);for(const u of l)this.uv.push(u[0],u[1]);const h=this.n;this.idx.push(h,h+1,h+2,h,h+2,h+3),this.n+=4}boxSides(t,e,i,n,s,a,o,l=3){const c=n-t,h=s-e,u=a-i,f=(d,g)=>[[0,0],[d/l,0],[d/l,g/l],[0,g/l]];this.quad([t,e,a],[n,e,a],[n,s,a],[t,s,a],0,0,1,f(c,h),o),this.quad([n,e,i],[t,e,i],[t,s,i],[n,s,i],0,0,-1,f(c,h),o),this.quad([n,e,a],[n,e,i],[n,s,i],[n,s,a],1,0,0,f(u,h),o),this.quad([t,e,i],[t,e,a],[t,s,a],[t,s,i],-1,0,0,f(u,h),o)}boxTop(t,e,i,n,s,a,o=4){const l=n-t,c=s-i;this.quad([t,e,s],[n,e,s],[n,e,i],[t,e,i],0,1,0,[[0,0],[l/o,0],[l/o,c/o],[0,c/o]],a)}box(t,e,i,n,s,a,o,l=3){this.boxSides(t,e,i,n,s,a,o,l),this.boxTop(t,s,i,n,a,o,l)}build(){if(this.n===0)return null;const t=new we;return t.setAttribute("position",new jt(this.pos,3)),t.setAttribute("normal",new jt(this.nrm,3)),t.setAttribute("uv",new jt(this.uv,2)),t.setAttribute("color",new jt(this.col,3)),t.setIndex(this.idx),t}}const Bx=[[16,17],[21,19],[3,12],[17,4]],Hx=[[17,20],[20,22],[5,9],[20,4]];class Gx{constructor(t){this.scene=t,this.rng=Mn(20260901),this.hash=new Ax(24),this.roadCoords=[];for(let e=0;e<=ue;e++)this.roadCoords.push(-oe+e*Ht);this.blocks=[],this.blockMap=new Map,this.lamps=[],this.trees=[],this.parkedSpots=[],this.lightHeads=[],this.group=new Ee,t.add(this.group),this.buildLayout(),this.buildMask(),this.buildGround(),this.buildRoads(),this.buildBlocks(),this.buildCountryside(),this.buildProps(),this.buildWater()}regionAt(t,e){return hh.find(i=>t>=i.x0&&t<i.x0+i.nx&&e>=i.z0&&e<i.z0+i.nz)||null}blockType(t,e){if(Bx.some(([a,o])=>a===t&&o===e))return"park";if(Hx.some(([a,o])=>a===t&&o===e))return"lot";const i=this.regionAt(t,e);if(!i)return null;const n=t-i.x0,s=e-i.z0;return i.id==="santos"?n<=2&&s>=6?"airport":n>=7&&s>=2&&s<=4?"docks":n===5&&s===1?"stadium":n>=3&&n<=5&&s>=3&&s<=5?"downtown":s===8?"beach":n>=7||s>=7?"residential":"commercial":i.id==="ferro"?n>=5&&s>=4?"docks":n>=2&&n<=4&&s>=1&&s<=3?"downtown":s>=5?"industrial":n<=1||s===0?"residential":"commercial":i.id==="venturas"?n>=5&&s<=1?"airport":n===3?"strip":n<=1||s>=4?"residential":"commercial":"desert"}districtOf(t,e){const i=this.regionAt(t,e);if(!i){const a=-oe+(t+.5)*Ht,o=-oe+(e+.5)*Ht;return aa(a,o)>8?"Mount Chiliad":a>-340&&a<260&&o>-980&&o<-380?"Bone County":a>-340&&a<180&&o>-340&&o<180?"Red County":a>-900&&a<-460&&o>300&&o<660?"Shady Creeks":o>140&&o<660?"Flint County":"Outskirts"}const n=t-i.x0;e-i.z0;const s=this.blockType(t,e);return i.id==="santos"?s==="downtown"?"Downtown":s==="airport"?"Los Santos Airport":s==="docks"?"Ocean Docks":s==="stadium"?"Arena":s==="beach"?"Santa Maria Beach":n>=7?"Eastside":"Midtown":i.id==="ferro"?s==="downtown"?"Financial":s==="docks"?"Easter Basin":s==="industrial"?"Ironworks":"Hillside":i.id==="venturas"?s==="strip"?"The Strip":s==="airport"?"Venturas Airport":"Suburbs":"Carson Town"}districtName(t,e){if(je(t,e))return"The Ocean";const i=Math.floor((t+oe)/Ht),n=Math.floor((e+oe)/Ht);return i<0||n<0||i>=ue||n>=ue?"Outskirts":this.districtOf(i,n)}buildLayout(){this.roadV=[],this.roadH=[];for(let i=0;i<=ue;i++)this.roadV.push(new Array(ue).fill(!1)),this.roadH.push(new Array(ue).fill(!1));const t=(i,n)=>this.regionAt(i,n)&&!je(-oe+(i+.5)*Ht,-oe+(n+.5)*Ht),e=(i,n)=>je(i,n)||aa(i,n)>4;for(let i=0;i<=ue;i++)for(let n=0;n<ue;n++){const s=-oe+i*Ht,a=-oe+(n+.5)*Ht;!e(s,a)&&(t(i-1,n)||t(i,n)||i%3===0)&&(this.roadV[i][n]=!0);const o=-oe+(n+.5)*Ht,l=-oe+i*Ht;!e(o,l)&&(t(n,i-1)||t(n,i)||i%3===0)&&(this.roadH[i][n]=!0)}for(const i of kx)for(let n=i.m0;n<=i.m1&&n<ue;n++){const s=-oe+i.k*Ht,a=-oe+(n+.5)*Ht;e(s,a)||(this.roadV[i.k][n]=!0)}for(const i of Ox)for(let n=i.m0;n<=i.m1&&n<ue;n++){const s=-oe+(n+.5)*Ht,a=-oe+i.j*Ht;e(s,a)||(this.roadH[i.j][n]=!0)}for(const i of Wr)if(i.axis==="x"){const n=Math.round((i.c+oe)/Ht);if(n>=0&&n<=ue)for(let s=0;s<ue;s++){const a=-oe+(s+.5)*Ht;a>=i.from-1&&a<=i.to+1&&(this.roadH[n][s]=!0)}}else{const n=Math.round((i.c+oe)/Ht);if(n>=0&&n<=ue)for(let s=0;s<ue;s++){const a=-oe+(s+.5)*Ht;a>=i.from-1&&a<=i.to+1&&(this.roadV[n][s]=!0)}}for(const i of hh)for(let n=0;n<i.nx;n++)for(let s=0;s<i.nz;s++){const a=i.x0+n,o=i.z0+s,l=-oe+(a+.5)*Ht,c=-oe+(o+.5)*Ht;if(je(l,c))continue;const h=this.blockType(a,o),u=this.roadCoords[a]+hn,f=this.roadCoords[a+1]-hn,d=this.roadCoords[o]+hn,g=this.roadCoords[o+1]-hn,x={i:a,j:o,x0:u,x1:f,z0:d,z1:g,type:h,cx:(u+f)/2,cz:(d+g)/2,district:this.districtOf(a,o),region:i.id,hoodGang:i.id==="santos"&&n>=7,hBase:0};i.id==="ferro"&&(x.hBase=Math.max(0,uh(l,c))),this.blocks.push(x),this.blockMap.set(a+","+o,x)}this.junctions=[];for(let i=0;i<=ue;i++)for(let n=0;n<=ue;n++){const s=this.roadCoords[i],a=this.roadCoords[n];je(s,a)&&this.onBridge(s,a)<=0||(this.hasRoadSeg(i,n,1,0)||this.hasRoadSeg(i,n,-1,0)||this.hasRoadSeg(i,n,0,1)||this.hasRoadSeg(i,n,0,-1))&&this.junctions.push({ix:i,iz:n})}}hasRoadSeg(t,e,i,n){if(i!==0){const a=Math.min(t,t+i);return e<0||e>ue||a<0||a>=ue?!1:this.roadH[e][a]}const s=Math.min(e,e+n);return t<0||t>ue||s<0||s>=ue?!1:this.roadV[t][s]}randomJunction(){return this.junctions[Math.random()*this.junctions.length|0]}blockAt(t,e){const i=Math.floor((t+oe)/Ht),n=Math.floor((e+oe)/Ht),s=this.blockMap.get(i+","+n);return s&&t>=s.x0-hn&&t<=s.x1+hn&&e>=s.z0-hn&&e<=s.z1+hn?s:null}onBridge(t,e){for(const i of Wr){if(i.axis==="x"){if(Math.abs(e-i.c)>ci||t<i.from||t>i.to)continue;return Ai*Math.min(1,Math.min(t-i.from,i.to-t)/20)}if(!(Math.abs(t-i.c)>ci||e<i.from||e>i.to))return Ai*Math.min(1,Math.min(e-i.from,i.to-e)/20)}return 0}groundHeight(t,e){const i=Math.abs(t),n=Math.abs(e);if(Math.max(i,n)>2500)return 0;const a=this.onBridge(t,e);if(a>0)return a;if(je(t,e))return-1.5;const o=this.blockAt(t,e);return o?o.hBase+Mi:uh(t,e)}isWater(t,e){const i=Math.max(Math.abs(t),Math.abs(e));return je(t,e)&&this.onBridge(t,e)<=0&&i<2500}onRoad(t,e){if(this.onBridge(t,e)>0)return!0;const i=Math.abs(t),n=Math.abs(e);if(i>oe+ci||n>oe+ci)return!1;const s=((t+oe)%Ht+Ht)%Ht,a=((e+oe)%Ht+Ht)%Ht,o=Math.round((t+oe)/Ht),l=Math.round((e+oe)/Ht);if(s<=ci||s>=Ht-ci){const c=Math.max(0,Math.min(ue-1,Math.floor((e+oe)/Ht)));if(o>=0&&o<=ue&&this.roadV[o][c])return!0}if(a<=ci||a>=Ht-ci){const c=Math.max(0,Math.min(ue-1,Math.floor((t+oe)/Ht)));if(l>=0&&l<=ue&&this.roadH[l][c])return!0}return!1}lightState(t,e,i,n){const a=((t*7+e*3)%4+4)%4*4,o=(n+a)%16,l=o<8,c=l?o:o-8;return(i==="z"?l:!l)?c>6?"yellow":"green":"red"}lanePoint(t,e,i,n,s,a){const o=this.roadCoords[t],l=this.roadCoords[e],c=-n,h=i,u=Fx(s);return{x:o+i*a+c*u,z:l+n*a+h*u}}buildMask(){const i=new Float32Array(65536);for(let s=0;s<256;s++)for(let a=0;a<256;a++){const o=s/255*2*1250-1250,l=a/255*2*1250-1250;i[a*256+s]=je(o,l)?0:1}const n=new Float32Array(i);for(let s=0;s<2;s++){const a=s===0?i:n;for(let o=1;o<255;o++)for(let l=1;l<255;l++){let c=0;for(let h=-1;h<=1;h++)for(let u=-1;u<=1;u++)c+=a[(l+u)*256+o+h];n[l*256+o]=c/9}}this.maskField=n,this.maskN=256,this.maskExt=1250}buildGround(){const t=this.group,e=new G(new ui(2600,2600),new Et({color:7307090,roughness:1}));e.rotation.x=-Math.PI/2,e.position.y=-.06,e.receiveShadow=!0,t.add(e);const i=(l,c,h,u,f,d=-.03)=>{const g=new G(new ui(h-l,u-c),new Et({color:f,roughness:1}));g.rotation.x=-Math.PI/2,g.position.set((l+h)/2,d,(c+u)/2),g.receiveShadow=!0,t.add(g)};i(-340,-980,260,-380,13215850,-.04),i(-340,-340,180,180,6130236,-.04),i(-920,300,-440,660,4025138,-.04),i(140,140,900,900,7830898,-.045),i(-980,-420,-380,180,8028020,-.045),i(220,-980,740,-420,9078136,-.045),i(140,880,900,985,14272143,-.035);const n=new G(new ui(6e3,6e3),new Et({color:2510938,roughness:1}));n.rotation.x=-Math.PI/2,n.position.y=-3,t.add(n);const s=new Et({color:7037529,roughness:1,flatShading:!0}),a=new G(new Nn(270,135,28,6),s);a.position.set(-760,135/2-2,640),a.castShadow=!0,a.receiveShadow=!0,t.add(a);const o=new G(new Nn(95,48,28,1),new Et({color:15265522,roughness:.9,flatShading:!0}));o.position.set(-760,109,640),t.add(o),this.addCollider(-950,450,-570,830,"mountain",40)}buildRoads(){const t=this.group,e=Dx(),i=new Et({map:e,roughness:.95,metalness:0}),n=Lx(),s=new Et({map:n,roughness:.95}),a=zx(),o=new Et({map:a,transparent:!0,roughness:.9,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2}),l=[],c=[],h=[],u=Ht-wi,f=(b,_)=>je(b,_)&&this.onBridge(b,_)>0;for(let b=0;b<=ue;b++)for(let _=0;_<ue;_++){if(this.roadV[b][_]){const T=this.roadCoords[b],C=this.roadCoords[_]+Ht/2;if(!f(T,C)){let w=new ui(wi,u);w.rotateX(-Math.PI/2);const S=w.attributes.uv;for(let P=0;P<S.count;P++)S.setY(P,S.getY(P)*u/14);w.translate(T,0,C),l.push(w)}}if(this.roadH[b][_]){const T=this.roadCoords[_]+Ht/2,C=this.roadCoords[b];if(!f(T,C)){let w=new ui(wi,u);w.rotateX(-Math.PI/2),w.rotateY(Math.PI/2);const S=w.attributes.uv;for(let P=0;P<S.count;P++)S.setY(P,S.getY(P)*u/14);w.translate(T,0,C),l.push(w)}}}new Set(this.junctions.map(b=>b.ix+","+b.iz));for(const{ix:b,iz:_}of this.junctions){const T=this.roadCoords[b],C=this.roadCoords[_];if(!je(T,C)){const w=new ui(wi,wi);w.rotateX(-Math.PI/2),w.translate(T,0,C),c.push(w)}for(const[w,S]of[[1,0],[-1,0],[0,1],[0,-1]]){if(!this.hasRoadSeg(b,_,w,S))continue;const P=new ui(wi,3);P.rotateX(-Math.PI/2),w!==0&&P.rotateY(Math.PI/2),P.translate(T+w*(ci+1.5),.005,C+S*(ci+1.5)),h.push(P)}}const d=new G(Ei(l),i);d.receiveShadow=!0,d.position.y=0,t.add(d);const g=new G(Ei(c),s);g.receiveShadow=!0,t.add(g);const x=new G(Ei(h),o);x.position.y=.01,t.add(x);for(const b of Wr){const _=(b.axis==="x",b.to-b.from),T=new Et({color:b.red?9054752:4869458,roughness:.9}),C=new G(new Ft(b.axis==="x"?_:wi,.6,b.axis==="x"?wi:_),T);C.position.set(b.axis==="x"?(b.from+b.to)/2:b.c,Ai-.3,b.axis==="x"?b.c:(b.from+b.to)/2),C.castShadow=!0,C.receiveShadow=!0,t.add(C);const w=new Et({color:b.red?12597547:9080724,roughness:.6,metalness:.4});for(const z of[-1,1]){const I=new G(new Ft(b.axis==="x"?_:.3,1.1,b.axis==="x"?.3:1.1),w);I.position.set(b.axis==="x"?(b.from+b.to)/2:b.c+z*(ci-.2),Ai+.55,b.axis==="x"?b.c+z*(ci-.2):(b.from+b.to)/2),I.castShadow=!0,t.add(I)}for(let z=20;z<_-10;z+=40){const I=new G(new Zt(1.2,1.5,Ai+3,8),T);I.position.set(b.axis==="x"?b.from+z:b.c,(Ai-3)/2-.5,b.axis==="x"?b.c:b.from+z),t.add(I)}const S=Math.hypot(20,Ai),P=Math.atan2(Ai,20);for(const z of[0,1]){const I=z===0?-1:1,U=new G(new Ft(b.axis==="x"?S:wi,.6,b.axis==="x"?wi:S),T);b.axis==="x"?(U.position.set((z===0?b.from:b.to)+I*10,Ai/2-.3,b.c),U.rotation.z=(z===0?1:-1)*P):(U.position.set(b.c,Ai/2-.3,(z===0?b.from:b.to)+I*10),U.rotation.x=(z===0?-1:1)*P),U.receiveShadow=!0,t.add(U)}}const p=Ix();p.repeat.set(1,1);const m=new Et({map:p,roughness:.95,vertexColors:!0}),y=new Ci,M=new j(1,1,1);for(const b of this.blocks){const _=b.x0-3,T=b.x1+3,C=b.z0-3,w=b.z1+3;y.box(_,b.hBase-2,C,T,b.hBase+Mi,w,M,2)}const v=new G(y.build(),m);v.receiveShadow=!0,v.castShadow=!1,t.add(v)}addCollider(t,e,i,n,s="building",a=999){const o={minX:t,maxX:i,minZ:e,maxZ:n,kind:s,minY:0,maxY:a};return this.hash.add(o),o}buildPark(t,e){const i=this.rng,n=t.hBase+Mi,s=new j(1,1,1);e.box(t.x0,n,t.z0,t.x1,n+.05,t.z1,s,6);for(let h=0;h<22;h++){const u=i.range(t.x0+3,t.x1-3),f=i.range(t.z0+3,t.z1-3);Math.hypot(u-t.cx,f-t.cz)<9||this.trees.push({x:u,z:f,s:i.range(.9,1.6)})}const a=new Ee;a.position.set(t.cx,n,t.cz);const o=new G(new Zt(5,5.4,.9,24),new Et({color:12564650,roughness:.8}));o.position.y=.45,o.castShadow=!0,a.add(o);const l=new G(new Zt(4.6,4.6,.2,24),new Et({color:3842264,roughness:.1,metalness:.2,transparent:!0,opacity:.85}));l.position.y=.85,a.add(l);const c=new G(new Zt(.6,1.2,3,12),o.material);c.position.y=1.8,c.castShadow=!0,a.add(c),this.group.add(a),this.addCollider(t.cx-5.2,t.cz-5.2,t.cx+5.2,t.cz+5.2,"prop",n+1),(this.fountains||=[]).push(a)}buildParkingLot(t){const e=this.rng,i=t.hBase+Mi,n=new Et({color:3816512,roughness:.95}),s=new G(new Ft(t.x1-t.x0,.06,t.z1-t.z0),n);s.position.set(t.cx,i+.03,t.cz),s.receiveShadow=!0,this.group.add(s);const a=new Ci,o=new j(.9,.9,.85);for(let c=0;c<2;c++){const h=t.z0+14+c*24;for(let u=0;u<8;u++){const f=t.x0+6+u*6.5;a.boxTop(f-.08,i+.07,h-5,f+.08,h+5,o,1),u<7&&e.chance(.55)&&this.parkedSpots.push({x:f+3.25,z:h,heading:c===0?Math.PI:0})}}const l=a.build();l&&this.group.add(new G(l,new pe({vertexColors:!0}))),this.lamps.push({x:t.cx,z:t.z0+26,rot:0},{x:t.x0+8,z:t.z0+26,rot:0},{x:t.x1-8,z:t.z0+26,rot:0})}buildCountryside(){const t=this.rng,e=new Ci,i=[new j(6130236),new j(10133580),new j(5077556),new j(9075260)];for(let l=0;l<4;l++)for(let c=0;c<4;c++){const h=-320+l*125,u=h+121,f=-320+c*120,d=f+116;f>-70&&d<-10||e.boxTop(h,0,f,u,d,i[(l+c)%4],14)}const n=new j(7031339),s=(l,c,h,u)=>{const f=h-l,d=u-c,g=Math.hypot(f,d),x=Math.floor(g/6);for(let p=0;p<=x;p++){const m=l+f*p/x,y=c+d*p/x;e.box(m-.12,0,y-.12,m+.12,1.1,y+.12,n)}};s(-320,-320,180,-320),s(-320,180,180,180),s(-320,-320,-320,180),s(180,-320,180,180);const a=(l,c,h=0)=>{const u=new j(10498088),f=new j(15790320);e.box(l-9,0,c-6,l+9,6,c+6,u),e.box(l-9.4,6,c-6.4,l+9.4,6.5,c+6.4,f),e.box(l-1.2,0,c+5.8,l+1.2,4.2,c+6.3,new j(3811866)),this.addCollider(l-9,c-6,l+9,c+6,"building",7)};a(-190,-190),a(-40,60),a(60,-260);for(const[l,c]of[[-210,-190],[-22,60]]){const h=new G(new Zt(3,3,12,12),new Et({color:12172996,roughness:.4,metalness:.6}));h.position.set(l,6,c),h.castShadow=!0,this.group.add(h);const u=new G(new ji(3,12,6,0,Math.PI*2,0,Math.PI/2),h.material);u.position.set(l,12,c),this.group.add(u),this.addCollider(l-3,c-3,l+3,c+3,"prop",15)}{const h=new G(new Zt(.5,1.4,16,8),new Et({color:9080724,roughness:.6,metalness:.5}));h.position.set(-140,8,-120),h.castShadow=!0,this.group.add(h);const u=new Ee;u.position.set(-140,15,-120+1.2);for(let f=0;f<4;f++){const d=new G(new Ft(.5,5,.08),h.material);d.position.y=2.5;const g=new Ee;g.rotation.z=f*Math.PI/2,g.add(d),u.add(g)}this.group.add(u),(this.spinners||=[]).push(u),this.addCollider(-140-1.5,-120-1.5,-140+1.5,-120+1.5,"prop",16)}for(const[l,c]of[[-700,420],[-560,560]])e.box(l-5,0,c-4,l+5,3.4,c+4,new j(6111287)),e.box(l-5.4,3.4,c-4.4,l+5.4,4.6,c+4.4,new j(3812900)),this.addCollider(l-5,c-4,l+5,c+4,"building",5);for(const[l,c]of[[-160,-700],[-120,-580]])e.box(l-4,0,c-3,l+4,3,c+3,new j(11573874)),this.addCollider(l-4,c-3,l+4,c+3,"building",3.5);const o=e.build();if(o){const l=new G(o,new Et({vertexColors:!0,roughness:1}));l.castShadow=!0,l.receiveShadow=!0,this.group.add(l)}{const l=new Ci,c=new j(2899536),h=new j(9058858),u=960,f=350;l.box(u-55,-1,f-9,u+55,3,f+9,c),l.box(u+40,3,f-6,u+55,8,f+6,h),l.box(u-55,3,f-4,u-38,12,f+4,new j(15263978));for(let g=0;g<6;g++)l.box(u-30+g*11,3,f-7,u-22+g*11,8,f+7,new j([12597547,2719929,15965202,2600544][g%4]));const d=new G(l.build(),new Et({vertexColors:!0,roughness:.8}));d.castShadow=!0,this.group.add(d)}for(let l=0;l<130;l++){const c=t.range(-320,260),h=t.range(-980,-380);je(c,h)||this.onRoad(c,h)||(t.chance(.45)?this.rocks||=[]:this.cacti||=[]).push({x:c,z:h,s:t.range(.7,1.6)})}for(let l=0;l<60;l++){const c=t.range(0,6.28),h=t.range(180,265),u=-760+Math.cos(c)*h,f=640+Math.sin(c)*h;(this.rocks||=[]).push({x:u,z:f,s:t.range(1.2,2.6)})}for(let l=0;l<700;l++){const c=t.range(-920,-440),h=t.range(300,660);je(c,h)||aa(c,h)>10||this.onRoad(c,h)||(this.forestTrees||=[]).push({x:c,z:h,s:t.range(.9,1.7)})}for(let l=0;l<120;l++){const c=t.range(0,6.28),h=t.range(120,200),u=-760+Math.cos(c)*h,f=640+Math.sin(c)*h;this.trees.push({x:u,z:f,s:t.range(.8,1.3)})}for(let l=0;l<120;l++){const c=t.range(-340,200),h=t.range(-340,200);je(c,h)||this.onRoad(c,h)||this.blockAt(c,h)||this.trees.push({x:c,z:h,s:t.range(.8,1.4)})}}buildBlocks(){const t=this.rng,e=["glass","concrete","brick","tower","house","industrial"],i={};for(const p of e)i[p]=new Ci;const n=new Ci,s=new Ci,a=new Ci,o=new Ci,l=new j(.55,.55,.55),c=[16723349,3010815,16769325,8257325,16738861,11873791].map(p=>new j(p)),h=(p,m,y,M,v,b,_,T=Mi)=>{const C=new j(_);i[b].boxSides(p,T,m,y,T+v,M,C,3),n.boxTop(p,T+v,m,y,M,l.clone().multiplyScalar(t.range(.7,1.2)),4);const w=.5;a.box(p,T+v,m,y,T+v+.8,m+w,C),a.box(p,T+v,M-w,y,T+v+.8,M,C),a.box(p,T+v,m,p+w,T+v+.8,M,C),a.box(y-w,T+v,m,y,T+v+.8,M,C);const S=t.int(0,3);for(let P=0;P<S;P++){const z=t.range(1.5,4),I=t.range(1.5,4),U=t.range(1,3),X=t.range(p+1.5,y-1.5-z),q=t.range(m+1.5,M-1.5-I);X<p+1||q<m+1||a.box(X,T+v,q,X+z,T+v+U,q+I,new j(7831430))}if(v>60&&t.chance(.6)){const P=(p+y)/2,z=(m+M)/2;a.box(P-.3,T+v,z-.3,P+.3,T+v+t.range(6,16),z+.3,new j(10066329))}if(b!=="house"&&b!=="industrial"&&v>10&&t.chance(.45)){const P=t.pick(c),z=T+t.range(4,Math.min(v-2,12)),I=t.int(0,3);I===0?s.box(p+1,z,M,y-1,z+1.2,M+.2,P):I===1?s.box(p+1,z,m-.2,y-1,z+1.2,m,P):I===2?s.box(y,z,m+1,y+.2,z+1.2,M-1,P):s.box(p-.2,z,m+1,p,z+1.2,M-1,P)}this.addCollider(p,m,y,M,"building",T+v)};for(const p of this.blocks){const m=p.x1-p.x0,y=p.hBase+Mi;if(p.type==="park"){this.buildPark(p,o);continue}if(p.type==="lot"){this.buildParkingLot(p);continue}if(p.type==="airport"){this.buildAirport(p,h,a);continue}if(p.type==="docks"){this.buildDocks(p,h,a);continue}if(p.type==="stadium"){this.buildStadium(p,a);continue}if(p.type==="beach"){this.buildBeach(p,o);continue}if(p.type==="downtown"){const M=p.region==="santos"?[70,140]:p.region==="ferro"?[30,70]:[25,60],v=t.int(1,3);if(v===1){const b=t.range(4,8),_=t.range(...M),T=t.pick(["glass","tower","glass"]),C=t.pick([16777215,14674160,13162208,15261904]);h(p.x0+b,p.z0+b,p.x1-b,p.z1-b,_*.55,T,C,y);const w=b+t.range(4,8);h(p.x0+w,p.z0+w,p.x1-w,p.z1-w,_*.85,T,C,y);const S=w+t.range(4,7);h(p.x0+S,p.z0+S,p.x1-S,p.z1-S,_,T,C,y)}else{const b=m/2;for(let _=0;_<2;_++)for(let T=0;T<2;T++){if(v===2&&_!==T)continue;const C=p.x0+_*b+2,w=p.z0+T*b+2,S=C+b-4,P=w+b-4,z=t.range(M[0]*.5,M[1]);h(C,w,S,P,z,t.pick(["glass","tower","concrete"]),t.pick([16777215,14148590,15327955,12569043]),y)}}}else if(p.type==="strip"){const v=m/2;for(let b=0;b<2;b++)for(let _=0;_<2;_++){const T=t.range(12,30);h(p.x0+b*v+1.5,p.z0+_*v+1.5,p.x0+(b+1)*v-1.5,p.z0+(_+1)*v-1.5,T,t.pick(["glass","concrete","tower"]),t.pick([16777215,15787734,16771529]),y);const C=t.pick(c),w=p.x0+(b+.5)*v,S=p.z0+(_+.5)*v;s.box(w-.6,y,S-.6,w+.6,y+t.range(14,24),S+.6,C),this.addCollider(w-.7,S-.7,w+.7,S+.7,"prop",y+24)}for(let b=0;b<4;b++)this.trees.push({x:p.x0+6+b*14,z:p.z1-4,s:1.1,palm:!0})}else if(p.type==="commercial"){const M=t.pick([2,3]),v=m/M;for(let b=0;b<M;b++)for(let _=0;_<M;_++){if(t.chance(.12)){this.trees.push({x:p.x0+(b+.5)*v,z:p.z0+(_+.5)*v,s:t.range(.8,1.2)});continue}const T=t.range(.6,2),C=t.range(9,36);h(p.x0+b*v+T,p.z0+_*v+T,p.x0+(b+1)*v-T,p.z0+(_+1)*v-T,C,t.pick(["concrete","brick","brick","tower"]),t.pick([16777215,15787734,14209736,15132394,15980992]),y)}}else if(p.type==="residential"){const v=m/3;for(let b=0;b<3;b++)for(let _=0;_<3;_++){const T=p.x0+(b+.5)*v,C=p.z0+(_+.5)*v;if(t.chance(.2)){this.trees.push({x:T,z:C,s:t.range(.9,1.4)});continue}const w=t.range(5,8),S=t.range(5,8),P=t.range(5,9);h(T-w,C-S,T+w,C+S,P,"house",t.pick([16777215,16771529,14282976,16242390,14739199,16774320]),y),t.chance(.7)&&this.trees.push({x:T+t.range(-9,9),z:C+(t.chance(.5)?9.2:-9.2),s:t.range(.7,1.1)})}}else if(p.type==="industrial")if(t.chance(.5))h(p.x0+2,p.z0+2,p.cx-2,p.z1-2,t.range(8,14),"industrial",t.pick([16777215,13687004,13221806]),y),h(p.cx+2,p.z0+2,p.x1-2,p.z1-2,t.range(8,14),"industrial",t.pick([16777215,13687004,13221806]),y);else{h(p.x0+3,p.z0+3,p.x1-3,p.cz-3,t.range(10,16),"industrial",t.pick([16777215,13687004]),y);for(let _=0;_<6;_++){const T=t.range(p.x0+6,p.x1-6),C=t.range(p.cz+4,p.z1-4),w=new j(t.pick([12597547,2719929,15965202,2600544,9323693]));a.box(T-3,y,C-1.2,T+3,y+2.6,C+1.2,w),this.addCollider(T-3,C-1.2,T+3,C+1.2,"prop",2.6)}const v=p.x1-8,b=p.cz+10;a.box(v-1.2,y,b-1.2,v+1.2,y+30,b+1.2,new j(7039851)),this.addCollider(v-1.2,b-1.2,v+1.2,b+1.2,"prop",30)}else if(p.type==="desert"){h(p.x0+4,p.z0+4,p.x1-4,p.z0+16,t.range(5,7),"concrete",t.pick([16771529,15980992,15132394]),y);const M=t.pick(c);s.box(p.cx-.5,y,p.z0+2,p.cx+.5,y+12,p.z0+3,M),this.addCollider(p.cx-.6,p.z0+1.9,p.cx+.6,p.z0+3.1,"prop",y+12),a.box(p.x0+8,y+4.5,p.cz,p.x0+28,y+5.2,p.cz+14,new j(14211288));for(const[v,b]of[[0,0],[8,0],[0,7],[8,7]])a.box(p.x0+9+v,y,p.cz+1+b,p.x0+10+v,y+4.5,p.cz+2+b,new j(9080724));for(const v of[12,18])a.box(p.x0+v,y,p.cz+6,p.x0+v+1.2,y+1.4,p.cz+7,new j(12597547)),this.addCollider(p.x0+v,p.cz+6,p.x0+v+1.2,p.cz+7,"prop",y+1.4)}}const u=Px(3);for(const p of e){const m=i[p].build();if(!m)continue;const{map:y,emissiveMap:M}=Rx(p,100+e.indexOf(p)),v=new Et({map:y,emissiveMap:M,emissive:16777215,emissiveIntensity:0,vertexColors:!0,roughness:p==="glass"?.35:.85,metalness:p==="glass"?.5:0}),b=new G(m,v);b.castShadow=!0,b.receiveShadow=!0,this.group.add(b),(this.facadeMats||=[]).push(v)}const f=n.build();if(f){const p=new G(f,new Et({map:u,vertexColors:!0,roughness:1}));p.receiveShadow=!0,this.group.add(p)}const d=a.build();if(d){const p=new G(d,new Et({vertexColors:!0,roughness:.9}));p.castShadow=!0,p.receiveShadow=!0,this.group.add(p)}const g=s.build();if(g){this.neonMat=new pe({vertexColors:!0,toneMapped:!1});const p=new G(g,this.neonMat);this.group.add(p)}const x=o.build();if(x){const p=Ux(12),m=new G(x,new Et({map:p,vertexColors:!0,roughness:1}));m.receiveShadow=!0,this.group.add(m)}}buildAirport(t,e,i){const n=t.hBase+Mi,s=new j(1,1,1),a=t.x1-t.x0,o=a<t.z1-t.z0;i.box(t.x0,n-.05,t.z0,t.x1,n+.05,t.z1,new j(3816512));const l=10,c=o?t.cx-a/4:t.cx,h=o?t.cz:t.cz-a/4,u=Math.min(a,t.z1-t.z0)-8;o?i.box(c-l/2,n+.05,t.z0+4,c+l/2,n+.12,t.z1-4,new j(2829617)):i.box(t.x0+4,n+.05,h-l/2,t.x1-4,n+.12,h+l/2,new j(2829617));for(let g=-u/2+4;g<u/2-2;g+=8)o?i.box(c-.25,n+.12,t.cz+g-1.5,c+.25,n+.16,t.cz+g+1.5,s):i.box(t.cx+g-1.5,n+.12,h-.25,t.cx+g+1.5,n+.16,h+.25,s);if(o){e(t.x0+4,t.z0+4,t.x0+16,t.z0+26,9,"concrete",15263978,n);for(const g of[t.z0+36,t.z0+52])i.box(t.x0+3,n,g,t.x0+17,n+7,g+12,new j(10133670)),this.addCollider(t.x0+3,g,t.x0+17,g+12,"building",n+7);i.box(t.x1-8,n,t.cz-3,t.x1-4,n+22,t.cz+1,new j(9080724)),i.box(t.x1-9,n+22,t.cz-4,t.x1-3,n+25,t.cz+2,new j(1715260)),this.addCollider(t.x1-9,t.cz-4,t.x1-3,t.cz+2,"building",n+25)}else{e(t.x0+4,t.z0+4,t.x0+26,t.z0+16,9,"concrete",15263978,n);for(const g of[t.x0+36,t.x0+52])i.box(g,n,t.z0+3,g+12,n+7,t.z0+17,new j(10133670)),this.addCollider(g,t.z0+3,g+12,t.z0+17,"building",n+7);i.box(t.cx-3,n,t.z1-8,t.cx+1,n+22,t.z1-4,new j(9080724)),i.box(t.cx-4,n+22,t.z1-9,t.cx+2,n+25,t.z1-3,new j(1715260)),this.addCollider(t.cx-4,t.z1-9,t.cx+2,t.z1-3,"building",n+25)}const f=o?t.x1-14:t.cx-10,d=o?t.cz+6:t.z1-16;this.buildPlane(f,d,o?Math.PI/2:0,i,n),this.buildPlane(f+(o?-8:10),d+(o?14:-8),o?Math.PI/2:.2,i,n)}buildPlane(t,e,i,n,s){const a=new Ee;a.position.set(t,s,e),a.rotation.y=i;const o=new Et({color:15263978,roughness:.4,metalness:.3}),l=new Et({color:12597547,roughness:.5}),c=new G(new Zt(1.1,.9,14,10),o);c.rotation.x=Math.PI/2,c.position.y=1.6,c.castShadow=!0,a.add(c);const h=new G(new ji(1.1,10,8),o);h.position.set(0,1.6,7),a.add(h);const u=new G(new Ft(20,.25,2.6),o);u.position.set(0,1.4,.5),u.castShadow=!0,a.add(u);const f=new G(new Ft(7,.2,1.6),o);f.position.set(0,2.2,-6.4),a.add(f);const d=new G(new Ft(.25,3,2),l);d.position.set(0,3.4,-6.4),a.add(d);for(const g of[-1,1]){const x=new G(new Zt(.55,.55,2.4,8),l);x.rotation.x=Math.PI/2,x.position.set(g*4.5,.9,.8),a.add(x)}this.group.add(a),this.addCollider(t-8,e-8,t+8,e+8,"prop",s+4)}buildDocks(t,e,i){const n=this.rng,s=t.hBase+Mi;i.box(t.x0,s-.05,t.z0,t.x1,s+.05,t.z1,new j(7040885)),e(t.x0+3,t.z0+3,t.x0+22,t.z0+15,10,"industrial",13687004,s);for(let a=0;a<8;a++){const o=n.range(t.x0+8,t.x1-8),l=n.range(t.z0+22,t.z1-6),c=new j(n.pick([12597547,2719929,15965202,2600544,9323693,8359053])),h=n.chance(.4)?5.2:2.6;i.box(o-3,s,l-1.2,o+3,s+h,l+1.2,c),this.addCollider(o-3,l-1.2,o+3,l+1.2,"prop",s+h)}for(const a of[t.z0+30,t.z1-12]){const o=t.x1-10,l=new j(15105570);i.box(o-1,s,a-1,o+1,s+18,a+1,l),i.box(o-8,s+16,a-1,o+8,s+18,a+1,l),i.box(o+6,s+8,a-.5,o+8,s+16,a+.5,l),this.addCollider(o-1.2,a-1.2,o+1.2,a+1.2,"prop",s+18)}if(t.x1+30>880){i.box(t.x1-4,s-.5,t.cz-6,t.x1+46,s+.4,t.cz+6,new j(8028037));for(let a=0;a<=40;a+=10)for(const o of[-5,5])i.box(t.x1+a-.5,-2,t.cz+o-.5,t.x1+a+.5,s,t.cz+o+.5,new j(4869458))}}buildStadium(t,e){const i=t.hBase+Mi,n=new G(new Zt(27,29,12,24,1,!0),new Et({color:9080724,roughness:.8,side:Ve}));n.position.set(t.cx,i+6,t.cz),n.castShadow=!0,this.group.add(n);const s=new G(new Rl(25,24),new Et({color:4164142,roughness:1}));s.rotation.x=-Math.PI/2,s.position.set(t.cx,i+.1,t.cz),s.receiveShadow=!0,this.group.add(s);for(const[a,o]of[[-1,-1],[1,-1],[-1,1],[1,1]])e.box(t.cx+a*30-.5,i,t.cz+o*30-.5,t.cx+a*30+.5,i+20,t.cz+o*30+.5,new j(3882820)),e.box(t.cx+a*30-2,i+20,t.cz+o*30-1,t.cx+a*30+2,i+22,t.cz+o*30+1,new j(16774880));this.addCollider(t.cx-29,t.cz-29,t.cx+29,t.cz+29,"building",i+12)}buildBeach(t,e){const i=this.rng,n=t.hBase+Mi;e.box(t.x0,n-.02,t.z0,t.x1,n+.06,t.z1,new j(.85,.78,.55),6);for(let h=0;h<6;h++)this.trees.push({x:i.range(t.x0+4,t.x1-4),z:i.range(t.z0+4,t.z1-4),s:i.range(1,1.5),palm:!0});const s=t.cx,a=t.cz,o=new j(7031339),l=new Ci;for(const[h,u]of[[-1,-1],[1,-1],[-1,1],[1,1]])l.box(s+h*1.4-.15,n,a+u*1.4-.15,s+h*1.4+.15,n+3,a+u*1.4+.15,o);l.box(s-1.8,n+3,a-1.8,s+1.8,n+4.6,a+1.8,new j(3920383)),l.box(s-2.1,n+4.6,a-2.1,s+2.1,n+4.9,a+2.1,new j(16053492));const c=new G(l.build(),new Et({vertexColors:!0,roughness:.9}));c.castShadow=!0,this.group.add(c),this.addCollider(s-1.9,a-1.9,s+1.9,a+1.9,"prop",n+5)}buildProps(){const t=this.rng;for(let e=0;e<=ue;e++)for(let i=0;i<ue;i++){if(this.roadV[e][i])for(let n=12;n<Ht-12;n+=22){const s=this.roadCoords[i]+n,a=this.roadCoords[e];this.lamps.push({x:a-8.6,z:s,rot:-Math.PI/2},{x:a+8.6,z:s,rot:Math.PI/2})}if(this.roadH[e][i])for(let n=12;n<Ht-12;n+=22)this.lamps.push({x:this.roadCoords[i]+n,z:this.roadCoords[e]-8.6,rot:Math.PI},{x:this.roadCoords[i]+n,z:this.roadCoords[e]+8.6,rot:0})}for(const{ix:e,iz:i}of this.junctions)for(const[n,s]of[[0,1],[0,-1],[1,0],[-1,0]]){if(!this.hasRoadSeg(e,i,n,s))continue;const a=this.roadCoords[e],o=this.roadCoords[i],l=-s,c=n,h=a+n*8.3+l*8.3,u=o+s*8.3+c*8.3;this.lightHeads.push({x:h,z:u,dx:n,dz:s,ix:e,iz:i,axis:s!==0?"z":"x"})}for(let e=0;e<500&&this.trees.filter(i=>i.palm).length<130;e++){const i=t.range(-1050,1050),n=t.range(-1050,1050);if(je(i,n)||this.onRoad(i,n)||this.blockAt(i,n))continue;let s=!1;for(const[a,o]of[[50,0],[-50,0],[0,50],[0,-50]])if(je(i+a,n+o)){s=!0;break}s&&this.trees.push({x:i,z:n,s:t.range(.9,1.5),palm:!0})}this.buildLampMeshes(),this.buildTreeMeshes(),this.buildRockMeshes(),this.buildTrafficLightMeshes(),this.buildStreetClutter()}buildLampMeshes(){const t=this.lamps.length,e=new me,i=new Zt(.09,.13,7,8);i.translate(0,3.5,0);const n=new Ft(.12,.12,2.2);n.translate(0,6.9,1);const s=new Ft(.5,.18,.9);s.translate(0,6.85,2);const a=new Et({color:3882820,roughness:.6,metalness:.6});this.lampHeadMat=new Et({color:16777215,emissive:16769712,emissiveIntensity:0});const o=new yi(Ei([i,n]),a,t);o.castShadow=!0;const l=new yi(s,this.lampHeadMat,t),c=[];this.lamps.forEach((u,f)=>{const d=this.groundHeight(u.x,u.z);e.position.set(u.x,d,u.z),e.rotation.set(0,u.rot,0),e.updateMatrix(),o.setMatrixAt(f,e.matrix),l.setMatrixAt(f,e.matrix),c.push(u.x+Math.sin(u.rot)*2,d+6.7,u.z+Math.cos(u.rot)*2),this.addCollider(u.x-.15,u.z-.15,u.x+.15,u.z+.15,"pole",7)}),this.group.add(o,l);const h=new we;h.setAttribute("position",new jt(c,3)),this.lampGlowMat=new bl({map:vu(),color:16767392,size:6,transparent:!0,opacity:0,depthWrite:!1,blending:$s,sizeAttenuation:!0}),this.lampGlow=new _l(h,this.lampGlowMat),this.group.add(this.lampGlow),this.lampPositions=c}buildTreeMeshes(){const t=new me,e=[...this.trees.filter(p=>!p.palm),...this.forestTrees||[]],i=this.trees.filter(p=>p.palm),n=new Zt(.18,.3,2.6,7);n.translate(0,1.3,0);const s=Ei([new ds(1.9,1).translate(0,3.6,0),new ds(1.4,1).translate(1,4.4,.4),new ds(1.3,1).translate(-.9,4.3,-.5)]),a=new Et({color:5914410,roughness:1}),o=new Et({color:4160046,roughness:1,flatShading:!0}),l=new yi(n,a,e.length),c=new yi(s,o,e.length);l.castShadow=!0,c.castShadow=!0,c.receiveShadow=!0;const h=new j;e.forEach((p,m)=>{const y=this.groundHeight(p.x,p.z);t.position.set(p.x,y,p.z),t.rotation.set(0,this.rng()*6.28,0),t.scale.setScalar(p.s),t.updateMatrix(),l.setMatrixAt(m,t.matrix),c.setMatrixAt(m,t.matrix),c.setColorAt(m,h.setHSL(.26+this.rng()*.08,.5,.3+this.rng()*.15)),this.addCollider(p.x-.35,p.z-.35,p.x+.35,p.z+.35,"tree",3)}),this.group.add(l,c);const u=new Zt(.14,.24,6,7);u.translate(0,3,0),u.rotateZ(.12);const f=[];for(let p=0;p<7;p++){const m=new Nn(.5,3.2,4);m.scale(1,1,.25),m.translate(0,1.4,0),m.rotateX(-1.9),m.rotateY(p/7*6.28),m.translate(.7,6,0),f.push(m)}const d=Ei(f),g=new yi(u,new Et({color:9071173,roughness:1}),i.length),x=new yi(d,new Et({color:4034362,roughness:1,side:Ve}),i.length);g.castShadow=!0,x.castShadow=!0,i.forEach((p,m)=>{const y=this.groundHeight(p.x,p.z);t.position.set(p.x,y,p.z),t.rotation.set(0,this.rng()*6.28,0),t.scale.setScalar(p.s),t.updateMatrix(),g.setMatrixAt(m,t.matrix),x.setMatrixAt(m,t.matrix),this.addCollider(p.x-.3,p.z-.3,p.x+.3,p.z+.3,"tree",6)}),this.group.add(g,x)}buildRockMeshes(){const t=new me,e=this.rocks||[],i=this.cacti||[];if(e.length){const n=new ds(1.2,0),s=new yi(n,new Et({color:9076594,roughness:1,flatShading:!0}),e.length);s.castShadow=!0,e.forEach((a,o)=>{t.position.set(a.x,this.groundHeight(a.x,a.z),a.z),t.rotation.set(0,this.rng()*6.28,0),t.scale.set(a.s,a.s*.7,a.s),t.updateMatrix(),s.setMatrixAt(o,t.matrix),this.addCollider(a.x-.8,a.z-.8,a.x+.8,a.z+.8,"prop",1.5)}),this.group.add(s)}if(i.length){const n=Ei([new Zt(.35,.4,3.2,8).translate(0,1.6,0),new Zt(.22,.24,1.4,7).translate(.55,1.9,0),new Zt(.22,.24,1.1,7).translate(-.5,1.4,0)]),s=new yi(n,new Et({color:4028980,roughness:1}),i.length);s.castShadow=!0,i.forEach((a,o)=>{t.position.set(a.x,this.groundHeight(a.x,a.z),a.z),t.rotation.set(0,this.rng()*6.28,0),t.scale.setScalar(a.s),t.updateMatrix(),s.setMatrixAt(o,t.matrix),this.addCollider(a.x-.4,a.z-.4,a.x+.4,a.z+.4,"prop",3)}),this.group.add(s)}}buildTrafficLightMeshes(){const t=this.lightHeads,e=new me,i=new Zt(.1,.12,5.5,8);i.translate(0,2.75,0);const n=new Ft(.4,1.1,.4);n.translate(0,4.6,0);const s=new Et({color:3093302,roughness:.7,metalness:.5}),a=new yi(Ei([i,n]),s,t.length),o=new ji(.12,8,8);this.bulbs=new yi(o,new pe({toneMapped:!1}),t.length*3),t.forEach((l,c)=>{const h=this.groundHeight(l.x,l.z)+.15;e.position.set(l.x,h,l.z),e.rotation.set(0,0,0),e.updateMatrix(),a.setMatrixAt(c,e.matrix);for(let u=0;u<3;u++)e.position.set(l.x-l.dx*.22,h+4.95-u*.33,l.z-l.dz*.22),e.updateMatrix(),this.bulbs.setMatrixAt(c*3+u,e.matrix),this.bulbs.setColorAt(c*3+u,new j(2236962));this.addCollider(l.x-.15,l.z-.15,l.x+.15,l.z+.15,"pole",5)}),this.group.add(a,this.bulbs),this._bulbColors={red:new j(2.5,.15,.1),yellow:new j(2.5,1.8,.2),green:new j(.2,2.5,.6),off:new j(.08,.08,.08)}}buildStreetClutter(){const t=this.rng,e=new me,i=[];for(const o of this.blocks)if(!(o.type==="park"||o.type==="lot"||o.type==="airport"||o.type==="stadium"||o.type==="beach"))for(let l=0;l<4;l++){const c=t.int(0,3),h=t.range(.1,.9),u=t.pick(["hydrant","bin","bench","bin"]);let f,d,g;c===0?(f=o.x0+h*(o.x1-o.x0),d=o.z0-1.6,g=Math.PI):c===1?(f=o.x0+h*(o.x1-o.x0),d=o.z1+1.6,g=0):c===2?(f=o.x0-1.6,d=o.z0+h*(o.z1-o.z0),g=-Math.PI/2):(f=o.x1+1.6,d=o.z0+h*(o.z1-o.z0),g=Math.PI/2),i.push({kind:u,x:f,z:d,rot:g})}const n=(o,l,c)=>{const h=i.filter(f=>f.kind===o);if(!h.length)return;const u=new yi(l,c,h.length);u.castShadow=!0,h.forEach((f,d)=>{e.position.set(f.x,Mi,f.z),e.rotation.set(0,f.rot,0),e.updateMatrix(),u.setMatrixAt(d,e.matrix),this.addCollider(f.x-.4,f.z-.4,f.x+.4,f.z+.4,"prop",1)}),this.group.add(u)},s=Ei([new Zt(.16,.2,.8,8).translate(0,.4,0),new ji(.18,8,8).translate(0,.85,0),new Ft(.5,.12,.14).translate(0,.55,0)]);n("hydrant",s,new Et({color:14169130,roughness:.5,metalness:.3})),n("bin",new Zt(.35,.3,1,10).translate(0,.5,0),new Et({color:3104058,roughness:.8}));const a=Ei([new Ft(1.8,.08,.5).translate(0,.45,0),new Ft(1.8,.45,.08).translate(0,.72,-.22),new Ft(.08,.45,.5).translate(-.8,.22,0),new Ft(.08,.45,.5).translate(.8,.22,0)]);n("bench",a,new Et({color:7031339,roughness:.9}))}buildWater(){const t=this.maskN,e=new Uint8Array(t*t*4);for(let o=0;o<t*t;o++){const l=Math.max(0,Math.min(1,this.maskField[o]))*255;e[o*4]=l,e[o*4+1]=l,e[o*4+2]=l,e[o*4+3]=255}const i=document.createElement("canvas");i.width=i.height=t,i.getContext("2d").putImageData(new ImageData(new Uint8ClampedArray(e.buffer),t,t),0,0);const n=new Ma(i);this.waterUniforms={uTime:{value:0},uSunDir:{value:new D(0,1,0)},uDeep:{value:new j(736604)},uShallow:{value:new j(3122116)},uSky:{value:new j(8894176)},uFogColor:{value:new j(3021)},uFogNear:{value:200},uFogFar:{value:900},uNight:{value:0},uMask:{value:n}};const s=new ve({uniforms:this.waterUniforms,transparent:!0,vertexShader:`uniform float uTime; varying vec3 vWorld; varying vec2 vMaskUv;
        void main(){ vec3 p = position; float w = sin(p.x*0.08+uTime*1.2)*0.25 + sin(p.z*0.11-uTime*0.9)*0.2 + sin((p.x+p.z)*0.05+uTime*0.6)*0.3; p.y += w;
          vec4 wp = modelMatrix*vec4(p,1.0); vWorld = wp.xyz; vMaskUv = (wp.xz + 1250.0) / 2500.0; gl_Position = projectionMatrix*viewMatrix*wp; }`,fragmentShader:`uniform float uTime; uniform vec3 uSunDir, uDeep, uShallow, uSky, uFogColor; uniform float uFogNear, uFogFar, uNight; uniform sampler2D uMask; varying vec3 vWorld; varying vec2 vMaskUv;
        void main(){ float m = texture2D(uMask, vMaskUv).r;
          vec3 n = normalize(vec3(cos(vWorld.x*0.3+uTime*2.0)*0.08 + cos(vWorld.z*0.7-uTime*1.3)*0.05, 1.0, sin(vWorld.z*0.35+uTime*1.7)*0.08));
          vec3 v = normalize(cameraPosition - vWorld); float fres = pow(1.0 - max(dot(n, v), 0.0), 3.0);
          vec3 base = mix(uDeep, uShallow, smoothstep(0.0, 0.55, m)); vec3 col = mix(base, uSky, fres*0.7);
          vec3 h = normalize(uSunDir + v); float spec = pow(max(dot(n,h),0.0), 180.0) * (1.0-uNight*0.8); col += vec3(1.0,0.95,0.85)*spec*1.5;
          float foam = smoothstep(0.32, 0.48, m) * (1.0 - smoothstep(0.48, 0.64, m)) * (0.5+0.5*sin((vWorld.x+vWorld.z)*0.25 - uTime*2.0)); col = mix(col, vec3(0.9), foam*0.6);
          col *= mix(1.0, 0.18, uNight);
          float fog = smoothstep(uFogNear, uFogFar, length(cameraPosition - vWorld)); col = mix(col, uFogColor, fog);
          gl_FragColor = vec4(col, 0.92); }`}),a=new ui(5e3,5e3,120,120);a.rotateX(-Math.PI/2),this.water=new G(a,s),this.water.position.y=-.7,this.water.renderOrder=-1,this.group.add(this.water)}makeMinimap(t=1024){const i=u=>(u+1250)*(t/2500),n=document.createElement("canvas");n.width=n.height=t;const s=n.getContext("2d");s.fillStyle="#16323e",s.fillRect(0,0,t,t);const a=(u,f,d,g,x)=>{s.fillStyle=x,s.fillRect(i(u),i(f),i(d)-i(u),i(g)-i(f))};a(-1250,-1250,1250,1250,"#7fa66a"),a(-340,-980,260,-380,"#c9a86a"),a(-340,-340,180,180,"#5d8a3c"),a(-920,300,-440,660,"#3d6b32");const o=this.maskN,l=s.createImageData(o,o);for(let u=0;u<o*o;u++){const f=this.maskField[u]>.45?255:0;l.data[u*4+3]=f,l.data[u*4]=f,l.data[u*4+1]=f,l.data[u*4+2]=f}const c=document.createElement("canvas");c.width=c.height=o,c.getContext("2d").putImageData(l,0,0),s.save(),s.globalCompositeOperation="destination-in",s.imageSmoothingEnabled=!0,s.drawImage(c,0,0,t,t),s.restore();const h=t/2500;s.fillStyle="#cfcac0";for(const u of this.blocks)s.fillRect(i(u.x0),i(u.z0),(u.x1-u.x0)*h,(u.z1-u.z0)*h);s.strokeStyle="#e9e6dd",s.lineWidth=Math.max(1,14*h),s.beginPath();for(let u=0;u<=ue;u++)for(let f=0;f<ue;f++)this.roadV[u][f]&&(s.moveTo(i(this.roadCoords[u]),i(this.roadCoords[f])),s.lineTo(i(this.roadCoords[u]),i(this.roadCoords[f+1]))),this.roadH[u][f]&&(s.moveTo(i(this.roadCoords[f]),i(this.roadCoords[u])),s.lineTo(i(this.roadCoords[f+1]),i(this.roadCoords[u])));s.stroke(),s.strokeStyle="#c0392b",s.lineWidth=Math.max(2,16*h),s.beginPath();for(const u of Wr)u.axis==="x"?(s.moveTo(i(u.from),i(u.c)),s.lineTo(i(u.to),i(u.c))):(s.moveTo(i(u.c),i(u.from)),s.lineTo(i(u.c),i(u.to)));return s.stroke(),n}update(t,e,i,n){if(this.waterUniforms.uTime.value=e,n&&(this.waterUniforms.uSunDir.value.copy(n.sunDir),this.waterUniforms.uFogColor.value.copy(n.fogColor),this.waterUniforms.uNight.value=i,this.waterUniforms.uSky.value.copy(n.skyColor)),this.facadeMats)for(const s of this.facadeMats)s.emissiveIntensity=i*.75;if(this.lampHeadMat.emissiveIntensity=i*3,this.lampGlowMat.opacity=i*.7,this.neonMat&&(this.neonMat.opacity=1),this.fountains)for(const s of this.fountains)s.children[1].rotation.y+=t*.3;if(this.spinners)for(const s of this.spinners)s.rotation.z+=t*1.5;if(this._bulbT=(this._bulbT||0)+t,this._bulbT>.2){this._bulbT=0;const s=this._bulbColors;this.lightHeads.forEach((a,o)=>{const l=this.lightState(a.ix,a.iz,a.axis,e);this.bulbs.setColorAt(o*3,l==="red"?s.red:s.off),this.bulbs.setColorAt(o*3+1,l==="yellow"?s.yellow:s.off),this.bulbs.setColorAt(o*3+2,l==="green"?s.green:s.off)}),this.bulbs.instanceColor.needsUpdate=!0}}}class Vx{constructor(t,e){this.scene=t,this.renderer=e,this.sun=new nh(16777215,3),this.sun.castShadow=!0;const i=this.sun.shadow;i.mapSize.set(2048,2048),i.camera.near=1,i.camera.far=400,i.camera.left=-90,i.camera.right=90,i.camera.top=90,i.camera.bottom=-90,i.bias=-8e-4,i.normalBias=.6,this.sunTarget=new me,t.add(this.sunTarget),this.sun.target=this.sunTarget,t.add(this.sun),this.hemi=new ux(12572415,5917242,1.1),t.add(this.hemi),this.moon=new nh(9414358,0),t.add(this.moon),this.fog=new wl(12571622,200,900),t.fog=this.fog,this.sunDir=new D(0,1,0),this.fogColor=new j,this.skyColor=new j,this.night=0,this.uniforms={uTop:{value:new j},uHorizon:{value:new j},uSunDir:{value:new D},uSunColor:{value:new j},uNight:{value:0},uMoonDir:{value:new D}};const n=new ve({uniforms:this.uniforms,side:$e,depthWrite:!1,fog:!1,vertexShader:"varying vec3 vDir; void main(){ vDir = normalize(position); vec4 p = projectionMatrix*modelViewMatrix*vec4(position,1.0); gl_Position = p.xyww; }",fragmentShader:`uniform vec3 uTop,uHorizon,uSunDir,uSunColor,uMoonDir; uniform float uNight; varying vec3 vDir;
        float hash(vec3 p){ return fract(sin(dot(p, vec3(12.9898,78.233,45.164)))*43758.5453); }
        void main(){ vec3 d = normalize(vDir); float h = clamp(d.y, 0.0, 1.0);
          vec3 col = mix(uHorizon, uTop, pow(h, 0.55));
          float sd = max(dot(d, uSunDir), 0.0);
          col += uSunColor * (pow(sd, 6.0)*0.25 + pow(sd, 350.0)*3.0) ;
          // sun disc
          col += uSunColor * smoothstep(0.9993, 0.9996, sd) * 8.0;
          // moon
          float md = max(dot(d, uMoonDir), 0.0); col += vec3(0.8,0.85,1.0) * (smoothstep(0.9990, 0.9994, md) * 2.0 + pow(md, 60.0)*0.15) * uNight;
          // stars
          vec3 cell = floor(d * 160.0); float st = hash(cell); float star = step(0.995, st) * (0.5 + 0.5*sin(st*100.0)) * uNight * smoothstep(0.0, 0.2, d.y);
          col += vec3(star);
          gl_FragColor = vec4(col, 1.0); }`});this.dome=new G(new ji(2500,32,16),n),this.dome.frustumCulled=!1,t.add(this.dome);const s=new we,a=[],o=[];for(let h=0;h<70;h++){const u=Math.random()*6.28,f=500+Math.random()*1400;a.push(Math.cos(u)*f,320+Math.random()*120,Math.sin(u)*f),o.push(90+Math.random()*160)}s.setAttribute("position",new jt(a,3)),s.setAttribute("size",new jt(o,1));const l=document.createElement("canvas");l.width=256,l.height=256;const c=l.getContext("2d");for(let h=0;h<26;h++){const u=40+Math.random()*176,f=100+Math.random()*56,d=14+Math.random()*34,g=c.createRadialGradient(u,f,0,u,f,d);g.addColorStop(0,"rgba(255,255,255,0.35)"),g.addColorStop(.6,"rgba(255,255,255,0.12)"),g.addColorStop(1,"rgba(255,255,255,0)"),c.fillStyle=g,c.fillRect(0,0,256,256)}this.cloudMat=new bl({map:new Ma(l),size:420,transparent:!0,opacity:.85,depthWrite:!1,sizeAttenuation:!0,color:16777215,fog:!1}),this.clouds=new _l(s,this.cloudMat),t.add(this.clouds)}update(t,e){const i=(t-.25)*Math.PI*2,n=Math.sin(i),s=Math.cos(i);this.sunDir.set(s*.7,n,-.4+s*.2).normalize();const a=this.night=1-Vr(-.18,.1,n),o=1-Vr(0,.35,Math.abs(n)),l=Vr(-.1,.25,n),c=new j().setRGB(te(.02,.22,l),te(.03,.45,l),te(.08,.85,l));c.lerp(new j(.35,.28,.5),o*.5*(1-a));const h=new j().setRGB(te(.05,.75,l),te(.06,.82,l),te(.12,.92,l));h.lerp(new j(1,.55,.25),o*.85*(1-a*.7));const u=new j().setRGB(1,te(.45,.95,l),te(.2,.85,l));return this.uniforms.uTop.value.copy(c),this.uniforms.uHorizon.value.copy(h),this.uniforms.uSunDir.value.copy(this.sunDir),this.uniforms.uSunColor.value.copy(u).multiplyScalar(n>-.05?1:0),this.uniforms.uNight.value=a,this.uniforms.uMoonDir.value.copy(this.sunDir).negate(),this.sun.color.copy(u),this.sun.intensity=3.2*Vr(-.02,.2,n),this.sun.position.copy(this.sunDir).multiplyScalar(180).add(e),this.sunTarget.position.copy(e),this.moon.intensity=.8*a,this.moon.position.copy(this.sunDir).multiplyScalar(-150).add(e),this.moon.target=this.sunTarget,this.hemi.color.copy(c).lerp(new j(.9,.95,1),.4*l),this.hemi.groundColor.setRGB(.35,.3,.25).multiplyScalar(te(.45,1,l)),this.hemi.intensity=te(.55,1.25,l),this.fogColor.copy(h).lerp(c,.35),this.fog.color.copy(this.fogColor),this.fog.near=te(120,220,l),this.fog.far=te(600,950,l),this.skyColor.copy(c),this.cloudMat.color.copy(new j(1,1,1).lerp(new j(.15,.15,.25),a)).lerp(new j(1,.6,.4),o*.6*(1-a)),this.cloudMat.opacity=.9,this.renderer.toneMappingExposure=te(.9,1.15,l),a}}class fh{constructor(t,e,i){this.max=e,this.n=0,this.pos=new Float32Array(e*3),this.vel=new Float32Array(e*3),this.life=new Float32Array(e),this.maxLife=new Float32Array(e),this.size=new Float32Array(e),this.col=new Float32Array(e*3),this.alpha=new Float32Array(e),this.grow=new Float32Array(e),this.drag=new Float32Array(e),this.grav=new Float32Array(e);const n=this.geo=new we;n.setAttribute("position",new Pe(this.pos,3)),n.setAttribute("aSize",new Pe(this.size,1)),n.setAttribute("aColor",new Pe(this.col,3)),n.setAttribute("aAlpha",new Pe(this.alpha,1)),n.setDrawRange(0,0),this.points=new _l(n,i),this.points.frustumCulled=!1,t.add(this.points)}emit(t,e,i,n,s,a,o,l,c,h,u,f=0,d=0,g=0){let x;this.n<this.max?x=this.n++:x=Math.floor(Math.random()*this.max),this.pos[x*3]=t,this.pos[x*3+1]=e,this.pos[x*3+2]=i,this.vel[x*3]=n,this.vel[x*3+1]=s,this.vel[x*3+2]=a,this.life[x]=o,this.maxLife[x]=o,this.size[x]=l,this.col[x*3]=c,this.col[x*3+1]=h,this.col[x*3+2]=u,this.alpha[x]=1,this.grow[x]=f,this.drag[x]=d,this.grav[x]=g}update(t){let e=0;for(let i=0;i<this.n;i++){if(this.life[i]<=0)continue;if(this.life[i]-=t,this.life[i]<=0){this.alpha[i]=0;continue}const n=Math.exp(-this.drag[i]*t);this.vel[i*3]*=n,this.vel[i*3+2]*=n,this.vel[i*3+1]=this.vel[i*3+1]*n+this.grav[i]*t,this.pos[i*3]+=this.vel[i*3]*t,this.pos[i*3+1]+=this.vel[i*3+1]*t,this.pos[i*3+2]+=this.vel[i*3+2]*t,this.size[i]+=this.grow[i]*t;const s=this.life[i]/this.maxLife[i];this.alpha[i]=s<.5?s*2:1,e++}e===0&&(this.n=0),this.geo.setDrawRange(0,this.n),this.geo.attributes.position.needsUpdate=!0,this.geo.attributes.aSize.needsUpdate=!0,this.geo.attributes.aColor.needsUpdate=!0,this.geo.attributes.aAlpha.needsUpdate=!0}}function dh(r,t){return new ve({uniforms:{uMap:{value:r}},transparent:!0,depthWrite:!1,blending:t?$s:Un,vertexShader:`attribute float aSize; attribute vec3 aColor; attribute float aAlpha; varying vec3 vC; varying float vA;
      void main(){ vC = aColor; vA = aAlpha; vec4 mv = modelViewMatrix*vec4(position,1.0); gl_PointSize = aSize * 300.0 / -mv.z; gl_Position = projectionMatrix*mv; }`,fragmentShader:"uniform sampler2D uMap; varying vec3 vC; varying float vA; void main(){ vec4 t = texture2D(uMap, gl_PointCoord); gl_FragColor = vec4(vC, t.a*vA); if (gl_FragColor.a < 0.01) discard; }"})}class Wx{constructor(t){this.scene=t,this.fire=new fh(t,1500,dh(vu(),!0)),this.smoke=new fh(t,1500,dh(Nx(),!1)),this.fire.points.renderOrder=10,this.smoke.points.renderOrder=9,this.tracerGeo=new we,this.tracerPos=new Float32Array(384),this.tracerGeo.setAttribute("position",new Pe(this.tracerPos,3)),this.tracers=new Dg(this.tracerGeo,new au({color:16771488,transparent:!0,opacity:.9,toneMapped:!1})),this.tracers.frustumCulled=!1,t.add(this.tracers),this.tracerLife=new Float32Array(64),this.tracerN=0,this.flashes=[],this.lights=[],this.flashMat=new pe({color:16765056,transparent:!0,opacity:.9,toneMapped:!1,depthWrite:!1}),this.flashGeo=new ji(1,12,8),this.ringGeo=new lr(.6,1,32),this.ringMat=new pe({color:16777215,transparent:!0,opacity:.6,side:Ve,depthWrite:!1}),this.skidMax=600,this.skidPos=new Float32Array(this.skidMax*4*3),this.skidAlpha=new Float32Array(this.skidMax*4);const e=[];for(let i=0;i<this.skidMax;i++)e.push(i*4,i*4+1,i*4+2,i*4,i*4+2,i*4+3);this.skidGeo=new we,this.skidGeo.setAttribute("position",new Pe(this.skidPos,3)),this.skidGeo.setAttribute("aAlpha",new Pe(this.skidAlpha,1)),this.skidGeo.setIndex(e),this.skidGeo.setDrawRange(0,0),this.skidMesh=new G(this.skidGeo,new ve({transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-4,vertexShader:"attribute float aAlpha; varying float vA; void main(){ vA = aAlpha; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }",fragmentShader:"varying float vA; void main(){ gl_FragColor = vec4(0.05,0.05,0.05, vA*0.55); }"})),this.skidMesh.frustumCulled=!1,t.add(this.skidMesh),this.skidI=0,this.skidCount=0,this.muzzleLight=new rr(16760928,0,12,2),t.add(this.muzzleLight),this.lightPool=[];for(let i=0;i<3;i++){const n=new rr(16752704,0,60,1.5);n.position.set(0,-100,0),t.add(n),this.lightPool.push(n)}this.dust=0}addTracer(t,e){const i=this.tracerN%64;this.tracerN++,this.tracerPos.set([t.x,t.y,t.z,e.x,e.y,e.z],i*6),this.tracerLife[i]=.06}muzzle(t,e){this.muzzleLight.position.copy(t),this.muzzleLight.intensity=40;for(let i=0;i<6;i++)this.fire.emit(t.x,t.y,t.z,e.x*6+Dt(-2,2),Dt(-1,2),e.z*6+Dt(-2,2),.08,.5,1,.8,.3,4,8,0)}sparks(t,e,i,n=8,s=[1,.8,.4]){for(let a=0;a<n;a++)this.fire.emit(t,e,i,Dt(-4,4),Dt(1,5),Dt(-4,4),Dt(.2,.5),.12,...s,0,1,-12)}blood(t,e,i,n=10){for(let s=0;s<n;s++)this.smoke.emit(t,e,i,Dt(-2,2),Dt(.5,3),Dt(-2,2),Dt(.3,.6),.25,.5,.02,.02,.3,3,-9)}puff(t,e,i,n=6,s=.6){for(let a=0;a<n;a++)this.smoke.emit(t,e,i,Dt(-1.5,1.5),Dt(.5,2),Dt(-1.5,1.5),Dt(.4,.9),s,.6,.6,.6,1.2,2,.5)}carSmoke(t,e){Math.random()<e&&this.smoke.emit(t.x+Dt(-.3,.3),t.y,t.z+Dt(-.3,.3),Dt(-.5,.5),Dt(1,2.2),Dt(-.5,.5),Dt(1.2,2.2),.7,.25,.25,.25,1.6,1.5,.3)}carFire(t){this.fire.emit(t.x+Dt(-.4,.4),t.y,t.z+Dt(-.4,.4),Dt(-.4,.4),Dt(1.5,3.5),Dt(-.4,.4),Dt(.3,.7),.9,1,Dt(.3,.6),.05,.5,2,1),Math.random()<.5&&this.smoke.emit(t.x,t.y+.5,t.z,Dt(-.5,.5),Dt(2,3),Dt(-.5,.5),Dt(1.5,3),1,.08,.08,.08,2.2,1.2,.4)}explosion(t,e,i,n=1){for(let l=0;l<90;l++){const c=Dt(0,6.28),h=Dt(2,14)*n;this.fire.emit(t,e+.5,i,Math.cos(c)*h,Dt(2,12)*n,Math.sin(c)*h,Dt(.4,1.1),Dt(.8,2)*n,1,Dt(.35,.7),.1,1.5,3,-4)}for(let l=0;l<60;l++){const c=Dt(0,6.28),h=Dt(1,6)*n;this.smoke.emit(t,e+1,i,Math.cos(c)*h,Dt(3,9)*n,Math.sin(c)*h,Dt(1.5,3.5),Dt(1.5,3)*n,.1,.1,.1,3,1.5,.8)}this.sparks(t,e+1,i,40,[1,.9,.5]);const s=new G(this.flashGeo,this.flashMat.clone());s.position.set(t,e+1,i),s.scale.setScalar(.5),this.scene.add(s),this.flashes.push({m:s,t:0,life:.45,scale:6*n});const a=new G(this.ringGeo,this.ringMat.clone());a.position.set(t,e+.3,i),a.rotation.x=-Math.PI/2,this.scene.add(a),this.flashes.push({m:a,t:0,life:.6,scale:18*n,ring:!0});const o=this.lightPool.reduce((l,c)=>l.intensity<=c.intensity?l:c);o.position.set(t,e+2,i),o.intensity=400*n,o.distance=60*n,this.lights.some(l=>l.l===o)||this.lights.push({l:o,t:0,life:.9})}skid(t,e,i,n,s,a,o){const l=this.skidI;this.skidI=(this.skidI+1)%this.skidMax,this.skidCount=Math.min(this.skidCount+1,this.skidMax);const c=-s*a/2,h=n*a/2,u=n*.25,f=s*.25;this.skidPos.set([t-c-u,i,e-h-f,t+c-u,i,e+h-f,t+c+u,i,e+h+f,t-c+u,i,e-h+f],l*12),this.skidAlpha.fill(o,l*4,l*4+4),this.skidGeo.setDrawRange(0,this.skidCount*6),this.skidGeo.attributes.position.needsUpdate=!0,this.skidGeo.attributes.aAlpha.needsUpdate=!0}update(t){this.fire.update(t),this.smoke.update(t);for(let e=0;e<64;e++)this.tracerLife[e]>0&&(this.tracerLife[e]-=t,this.tracerLife[e]<=0&&this.tracerPos.fill(0,e*6,e*6+6));this.tracerGeo.attributes.position.needsUpdate=!0,this.muzzleLight.intensity*=Math.exp(-30*t);for(let e=this.flashes.length-1;e>=0;e--){const i=this.flashes[e];i.t+=t;const n=i.t/i.life;i.m.scale.setScalar(.5+i.scale*(i.ring?n:Math.sqrt(n))),i.m.material.opacity=(1-n)*(i.ring?.5:.9),n>=1&&(this.scene.remove(i.m),i.m.material.dispose(),this.flashes.splice(e,1))}for(let e=this.lights.length-1;e>=0;e--){const i=this.lights[e];i.t+=t,i.l.intensity*=Math.exp(-6*t),i.t>i.life&&(i.l.intensity=0,this.lights.splice(e,1))}}}class Xx{constructor(){this.ctx=null,this.ready=!1,this.radioStation=0,this.sirenVoices=[]}init(){if(this.ctx)return;const t=this.ctx=new(window.AudioContext||window.webkitAudioContext);this.master=t.createGain(),this.master.gain.value=.6,this.master.connect(t.destination),this.sfx=t.createGain(),this.sfx.connect(this.master),this.musicBus=t.createGain(),this.musicBus.gain.value=0,this.musicBus.connect(this.master);const e=t.sampleRate*2,i=t.createBuffer(1,e,t.sampleRate),n=i.getChannelData(0);for(let s=0;s<e;s++)n[s]=Math.random()*2-1;this.noiseBuf=i,this.buildEngine(),this.buildAmbience(),this.buildSiren(),this.buildRadio(),this.ready=!0}resume(){this.ctx&&this.ctx.state==="suspended"&&this.ctx.resume()}buildEngine(){const t=this.ctx;this.engGain=t.createGain(),this.engGain.gain.value=0,this.engFilter=t.createBiquadFilter(),this.engFilter.type="lowpass",this.engFilter.frequency.value=600,this.engFilter.Q.value=2,this.engFilter.connect(this.engGain),this.engGain.connect(this.sfx),this.osc1=t.createOscillator(),this.osc1.type="sawtooth",this.osc2=t.createOscillator(),this.osc2.type="square";const e=t.createGain();e.gain.value=.35,this.osc1.connect(this.engFilter),this.osc2.connect(e),e.connect(this.engFilter),this.osc1.start(),this.osc2.start(),this.roadSrc=t.createBufferSource(),this.roadSrc.buffer=this.noiseBuf,this.roadSrc.loop=!0;const i=t.createBiquadFilter();i.type="lowpass",i.frequency.value=400,this.roadGain=t.createGain(),this.roadGain.gain.value=0,this.roadSrc.connect(i),i.connect(this.roadGain),this.roadGain.connect(this.sfx),this.roadSrc.start(),this.skidSrc=t.createBufferSource(),this.skidSrc.buffer=this.noiseBuf,this.skidSrc.loop=!0;const n=t.createBiquadFilter();n.type="bandpass",n.frequency.value=1800,n.Q.value=3,this.skidGain=t.createGain(),this.skidGain.gain.value=0,this.skidSrc.connect(n),n.connect(this.skidGain),this.skidGain.connect(this.sfx),this.skidSrc.start()}setEngine(t,e,i,n,s){if(!this.ready)return;const a=this.ctx.currentTime,o=t?.1+i*.12+n*.05:0;this.engGain.gain.setTargetAtTime(o,a,.08);const l=45+e*190;this.osc1.frequency.setTargetAtTime(l,a,.05),this.osc2.frequency.setTargetAtTime(l*.5+1.5,a,.05),this.engFilter.frequency.setTargetAtTime(400+e*1800+i*600,a,.08),this.roadGain.gain.setTargetAtTime(t?n*.25:0,a,.1),this.skidGain.gain.setTargetAtTime(t?s*.35:0,a,.05)}buildAmbience(){const t=this.ctx,e=t.createBufferSource();e.buffer=this.noiseBuf,e.loop=!0;const i=t.createBiquadFilter();i.type="lowpass",i.frequency.value=220;const n=t.createGain();n.gain.value=.05,e.connect(i),i.connect(n),n.connect(this.sfx),e.start(),this.ambGain=n}buildSiren(){const t=this.ctx;this.sirenGain=t.createGain(),this.sirenGain.gain.value=0,this.sirenGain.connect(this.sfx),this.sirenOsc=t.createOscillator(),this.sirenOsc.type="triangle",this.sirenOsc.frequency.value=700;const e=t.createGain();e.gain.value=.4,this.sirenOsc.connect(e),e.connect(this.sirenGain),this.sirenOsc.start(),this.sirenPhase=0}setSiren(t,e){if(!this.ready)return;const i=this.ctx.currentTime;if(this.sirenGain.gain.setTargetAtTime(t*.25,i,.1),t>.001){this.sirenPhase+=e*1.4;const n=620+280*(.5+.5*Math.sin(this.sirenPhase*Math.PI*2));this.sirenOsc.frequency.setTargetAtTime(n,i,.03)}}noiseBurst(t,e,i,n,s="bandpass",a=t){const o=this.ctx,l=o.currentTime,c=o.createBufferSource();c.buffer=this.noiseBuf,c.playbackRate.value=1;const h=o.createBiquadFilter();h.type=s,h.frequency.value=e,h.Q.value=i;const u=o.createGain();u.gain.setValueAtTime(n,l),u.gain.exponentialRampToValueAtTime(.001,l+a),c.connect(h),h.connect(u),u.connect(this.sfx),c.start(l,Math.random()),c.stop(l+t+.05)}tone(t,e,i,n="sine",s=null){const a=this.ctx,o=a.currentTime,l=a.createOscillator();l.type=n,l.frequency.setValueAtTime(t,o),s&&l.frequency.exponentialRampToValueAtTime(s,o+e);const c=a.createGain();c.gain.setValueAtTime(i,o),c.gain.exponentialRampToValueAtTime(.001,o+e),l.connect(c),c.connect(this.sfx),l.start(o),l.stop(o+e+.05)}gunshot(t="pistol"){this.ready&&(t==="shotgun"?(this.noiseBurst(.35,500,.7,.9,"lowpass",.3),this.noiseBurst(.15,2500,1,.5),this.tone(90,.2,.6,"sine",40)):t==="uzi"?(this.noiseBurst(.08,1800,1.2,.5),this.tone(220,.06,.35,"square",80)):t==="rifle"?(this.noiseBurst(.18,1200,1,.7),this.tone(140,.12,.5,"sine",50)):(this.noiseBurst(.12,1400,1,.6),this.tone(180,.09,.45,"sine",60)))}explosion(){this.ready&&(this.noiseBurst(1.4,180,.5,1.2,"lowpass",1.2),this.tone(60,.9,.9,"sine",25),this.noiseBurst(.4,3e3,.8,.3))}crash(t){if(!this.ready)return;const e=ie(t/15,.15,1);this.noiseBurst(.25,300+e*600,.8,.35+.6*e,"lowpass",.25),this.tone(120,.15,.4*e,"triangle",50),e>.5&&this.noiseBurst(.3,4e3,2,.2*e)}thud(){this.ready&&(this.noiseBurst(.12,200,1,.5,"lowpass"),this.tone(80,.12,.4,"sine",40))}punch(){this.ready&&(this.noiseBurst(.08,900,1.5,.4),this.tone(150,.08,.3,"triangle",60))}pickup(){this.ready&&(this.tone(880,.08,.25,"square"),setTimeout(()=>this.ready&&this.tone(1320,.12,.25,"square"),70))}cash(){this.ready&&(this.tone(1200,.06,.2,"square"),setTimeout(()=>this.ready&&this.tone(1600,.06,.2,"square"),60),setTimeout(()=>this.ready&&this.tone(2e3,.1,.2,"square"),120))}horn(t){if(!this.ready)return;const e=this.ctx;if(t&&!this.hornOsc){const i=e.createGain();i.gain.value=.12;const n=e.createOscillator();n.type="square",n.frequency.value=420;const s=e.createOscillator();s.type="square",s.frequency.value=520;const a=e.createBiquadFilter();a.frequency.value=1500,n.connect(a),s.connect(a),a.connect(i),i.connect(this.sfx),n.start(),s.start(),this.hornOsc=[n,s]}!t&&this.hornOsc&&(this.hornOsc.forEach(i=>i.stop()),this.hornOsc=null)}ui(){this.ready&&this.tone(600,.05,.15,"square")}missionPassed(){this.ready&&[0,.12,.24,.42].forEach((t,e)=>setTimeout(()=>this.ready&&this.tone([523,659,784,1047][e],.35,.25,"triangle"),t*1e3))}wasted(){this.ready&&(this.tone(220,1.6,.35,"sawtooth",55),this.noiseBurst(1,200,.5,.3,"lowpass",1))}stars(){this.ready&&this.tone(300,.15,.25,"square",600)}buildRadio(){this.stations=[{name:"Neon FM",bpm:112,style:"synthwave"},{name:"Bounce 105",bpm:92,style:"hiphop"},{name:"Vibe Radio",bpm:124,style:"house"},{name:"Radio Off",bpm:0,style:"off"}],this.radioStation=0,this.step=0,this.nextNoteT=0,this.radioOn=!1,this.scales={synthwave:[0,3,7,10,12,15,19],hiphop:[0,2,3,7,8,12],house:[0,4,7,11,12,14,16]},this.seed=1,this.bar=0}setRadio(t){this.ready&&(this.radioOn=t,this.musicBus.gain.setTargetAtTime(t&&this.stations[this.radioStation].style!=="off"?.55:0,this.ctx.currentTime,.2))}nextStation(){return this.radioStation=(this.radioStation+1)%this.stations.length,this.step=0,this.setRadio(this.radioOn),this.stations[this.radioStation].name}rnd(){return this.seed=this.seed*16807%2147483647,this.seed/2147483647}note(t,e,i,n,s,a=this.musicBus,o=0){const l=this.ctx,c=l.createOscillator();c.type=s,c.frequency.setValueAtTime(t,e);const h=l.createGain();if(h.gain.setValueAtTime(1e-4,e),h.gain.exponentialRampToValueAtTime(n,e+.01),h.gain.exponentialRampToValueAtTime(1e-4,e+i),o){const u=l.createBiquadFilter();u.type="lowpass",u.frequency.setValueAtTime(o,e),u.frequency.exponentialRampToValueAtTime(200,e+i),c.connect(u),u.connect(h)}else c.connect(h);h.connect(a),c.start(e),c.stop(e+i+.02)}drum(t,e){const i=this.ctx;if(t==="kick"){const n=i.createOscillator();n.frequency.setValueAtTime(150,e),n.frequency.exponentialRampToValueAtTime(40,e+.12);const s=i.createGain();s.gain.setValueAtTime(.9,e),s.gain.exponentialRampToValueAtTime(.001,e+.25),n.connect(s),s.connect(this.musicBus),n.start(e),n.stop(e+.3)}else{const n=i.createBufferSource();n.buffer=this.noiseBuf;const s=i.createBiquadFilter();s.type=t==="hat"?"highpass":"bandpass",s.frequency.value=t==="hat"?7e3:1800;const a=i.createGain(),o=t==="hat"?.04:.18;a.gain.setValueAtTime(t==="hat"?.2:.5,e),a.gain.exponentialRampToValueAtTime(.001,e+o),n.connect(s),s.connect(a),a.connect(this.musicBus),n.start(e,Math.random()),n.stop(e+o+.02)}}updateRadio(){if(!this.ready||!this.radioOn)return;const t=this.stations[this.radioStation];if(t.style==="off")return;const e=this.ctx,i=60/t.bpm/4;for(this.nextNoteT<e.currentTime&&(this.nextNoteT=e.currentTime+.05);this.nextNoteT<e.currentTime+.25;){const n=this.step%16,s=this.nextNoteT,a=this.scales[t.style],o=55*Math.pow(2,[0,0,5,3][Math.floor(this.step/64)%4]/12),l=Math.floor(this.step/16)%4,c=o*Math.pow(2,[0,3,5,7][l]/12);if(t.style==="synthwave"){if(n%4===0&&this.drum("kick",s),(n===4||n===12)&&this.drum("snare",s),n%2===1&&this.drum("hat",s),this.note(c*Math.pow(2,a[[0,2,4,6][n%4]]/12)*2,s,i*.9,.12,"sawtooth",this.musicBus,2500),n%8===0&&this.note(c/1,s,i*7,.25,"square",this.musicBus,400),n===0&&l%2===0)for(const h of[0,2,4])this.note(c*2*Math.pow(2,a[h]/12),s,i*14,.06,"triangle")}else t.style==="hiphop"?((n===0||n===7||n===10)&&this.drum("kick",s),(n===4||n===12)&&this.drum("snare",s),n%2===0&&this.drum("hat",s),(n===0||n===6||n===11)&&this.note(c,s,i*3,.35,"sine"),this.rnd()<.35&&this.note(c*4*Math.pow(2,a[Math.floor(this.rnd()*a.length)]/12),s,i*2,.07,"triangle",this.musicBus,1800)):(n%4===0&&this.drum("kick",s),n%4===2&&this.drum("hat",s),(n===4||n===12)&&this.drum("snare",s),n%4===2&&this.note(c*2,s,i*1.5,.22,"sawtooth",this.musicBus,900),n%2===0&&this.note(c*4*Math.pow(2,a[(n/2+l)%a.length]/12),s,i*.8,.07,"square",this.musicBus,3e3));this.step++,this.nextNoteT+=i}}}const qx=.16,Xr=.25;function qr(r,t=qx){if(Math.abs(r)<t)return 0;const e=(Math.abs(r)-t)/(1-t);return Math.sign(r)*Math.min(1,e)}class Yx{constructor(t){this.keys=new Set,this.pressed=new Set,this.mouse={dx:0,dy:0,left:!1,right:!1,leftPressed:!1,wheel:0},this.locked=!1,this.canvas=t,window.addEventListener("keydown",e=>{e.repeat||(this.keys.add(e.code),this.pressed.add(e.code),["Space","Tab","F1"].includes(e.code)&&e.preventDefault())}),window.addEventListener("keyup",e=>this.keys.delete(e.code)),window.addEventListener("blur",()=>{this.keys.clear(),this.mouse.left=this.mouse.right=!1}),document.addEventListener("mousemove",e=>{this.locked&&(this.mouse.dx+=e.movementX,this.mouse.dy+=e.movementY)}),document.addEventListener("mousedown",e=>{this.locked&&(e.button===0&&(this.mouse.left=!0,this.mouse.leftPressed=!0),e.button===2&&(this.mouse.right=!0))}),document.addEventListener("mouseup",e=>{e.button===0&&(this.mouse.left=!1),e.button===2&&(this.mouse.right=!1)}),document.addEventListener("wheel",e=>{this.locked&&(this.mouse.wheel+=Math.sign(e.deltaY))},{passive:!0}),document.addEventListener("contextmenu",e=>e.preventDefault()),document.addEventListener("pointerlockchange",()=>{this.locked=document.pointerLockElement===t,this.onLockChange?.(this.locked)}),this.padHeld=new Set,this.padPressed=new Set,this.pad={connected:!1,id:"",lx:0,ly:0,rx:0,ry:0,lt:0,rt:0},this._gpPrev=[],this._gpIndex=-1,window.addEventListener("gamepadconnected",e=>{this._gpIndex=e.gamepad.index,this.onPadChange?.(!0,e.gamepad.id)}),window.addEventListener("gamepaddisconnected",()=>{this._gpIndex=-1,this.padHeld.clear(),this.pad={connected:!1,id:"",lx:0,ly:0,rx:0,ry:0,lt:0,rt:0},this.onPadChange?.(!1,"")})}lock(){this.canvas.requestPointerLock?.()}get gamepadConnected(){return this.pad.connected}get gamepadId(){return this.pad.id}pollGamepad(){this.padPressed.clear();let t=null;try{const d=navigator.getGamepads?navigator.getGamepads():[];this._gpIndex>=0&&d&&d[this._gpIndex]?.connected?t=d[this._gpIndex]:d&&(t=Array.from(d).find(g=>g&&g.connected)||null)}catch{t=null}if(!t){this.pad.connected&&(this.padHeld.clear(),this.pad={connected:!1,id:"",lx:0,ly:0,rx:0,ry:0,lt:0,rt:0},this.onPadChange?.(!1,"")),this._gpPrev=[];return}const e=this.pad.connected,i=d=>t.buttons[d]?.pressed||!1,n=d=>t.buttons[d]?.value||0,s=Math.max(n(6),i(6)?1:0),a=Math.max(n(7),i(7)?1:0),o=qr(t.axes[0]||0),l=qr(t.axes[1]||0),c=qr(t.axes[2]||0),h=qr(t.axes[3]||0);this.pad={connected:!0,id:t.id||"",lx:o,ly:l,rx:c,ry:h,lt:s,rt:a,raw:t},e||this.onPadChange?.(!0,this.pad.id),this.mouse.dx+=c*26,this.mouse.dy+=h*20,Math.abs(c)<.01&&Math.abs(h)<.01&&(i(14)&&(this.mouse.dx-=12),i(15)&&(this.mouse.dx+=12));const u=(d,g)=>{const x=this.padHeld.has(d);g&&!x?(this.padHeld.add(d),this.padPressed.add(d)):!g&&x&&this.padHeld.delete(d)},f=(d,g)=>(g&&!this.padHeld.has(d+":e")?(this.padHeld.add(d+":e"),this.padPressed.add(d)):g||this.padHeld.delete(d+":e"),g);u("jump",i(0)),u("sprint",i(1)||i(10)),u("interact",i(2)),u("enter",i(3)),u("aim",s>Xr||i(4)),u("fire",a>Xr),u("firePressed",f("fireEdge",a>Xr)),u("driveby",i(5)),u("drivebyPressed",f("drivebyEdge",i(5))),u("nextWeapon",i(5)),u("prevWeapon",i(4)),u("horn",i(15)||i(2)),u("radio",i(14)),u("camera",i(11)),u("handbrake",i(0)),u("map",i(8)),u("pause",i(9)),u("help",!1),u("skiptime",!1),u("ao",!1),u("dUp",i(12)),u("dDown",i(13)),this._gpPrev=t.buttons.map(d=>d.pressed)}rumble(t=.6,e=.4,i=120){try{const s=this.pad.raw?.vibrationActuator;return s?.playEffect?(s.playEffect("dual-rumble",{strongMagnitude:t,weakMagnitude:e,duration:i}).catch?.(()=>{}),!0):!1}catch{return!1}}down(t){if(this.padHeld.has(t))return!0;if(t==="forward"&&this.pad.rt>Xr)return!1;const e=lh[t];return e?e.some(i=>this.keys.has(i)):!1}hit(t){if(this.padPressed.has(t))return!0;const e=lh[t];return e?e.some(i=>this.pressed.has(i)):!1}hitCode(t){return this.pressed.has(t)}axis(t,e){const i=(this.down(e)?1:0)-(this.down(t)?1:0);return t==="left"&&e==="right"&&this.pad.lx!==0?i!==0?i:this.pad.lx:t==="back"&&e==="forward"&&this.pad.ly!==0?i!==0?i:-this.pad.ly:i}footMove(){const t=this.axis("left","right"),e=this.axis("back","forward");if(this.pad.lx!==0||this.pad.ly!==0){const i=Math.abs(t)>.01&&this.pad.lx===0?t:Math.abs(this.pad.lx)>Math.abs(t)?this.pad.lx:t,n=Math.abs(e)>.01&&this.pad.ly===0?e:Math.abs(-this.pad.ly)>Math.abs(e)?-this.pad.ly:e;return{x:i,y:n,mag:Math.min(1,Math.hypot(i,n))}}return{x:t,y:e,mag:Math.min(1,Math.hypot(t,e))}}drive(){const t=this.down("forward")?1:0,e=this.down("back")?1:0,i=Math.max(t,this.pad.rt),n=Math.max(e,this.pad.lt);let s=-this.axis("left","right");return{throttle:i,brake:n,steer:s}}get firing(){return this.mouse.left||this.padHeld.has("fire")||this.padHeld.has("driveby")}get firingPressed(){return this.mouse.leftPressed||this.padPressed.has("firePressed")||this.padPressed.has("fire")||this.padPressed.has("drivebyPressed")||this.padPressed.has("driveby")}get vehicleFiring(){return this.mouse.left||this.padHeld.has("driveby")}get vehicleFiringPressed(){return this.mouse.leftPressed||this.padPressed.has("drivebyPressed")||this.padPressed.has("driveby")}get aiming(){return this.mouse.right||this.padHeld.has("aim")}endFrame(){this.pressed.clear(),this.padPressed.clear(),this.mouse.dx=0,this.mouse.dy=0,this.mouse.leftPressed=!1,this.mouse.wheel=0}}class Zx{constructor(t,e){this.cam=t,this.city=e,this.yaw=0,this.pitch=.18,this.userYaw=0,this.idleT=0,this.pos=new D,this.look=new D,this.shake=0,this.shakeV=new D,this.fov=62,this.mode="foot",this.curDist=4,this.recoil=0,this._target=new D,this._desired=new D}addShake(t){this.shake=Math.min(1.5,this.shake+t)}update(t,e,i,n,s,a,o,l=.0022){this.mode=a;const c=e.mouse.dx*l,h=e.mouse.dy*l;Math.abs(c)+Math.abs(h)>0?this.idleT=0:this.idleT+=t,this.yaw-=c,this.pitch=ie(this.pitch+h,-.35,.9);let f,d,g,x=0;if(a==="car"){const U=Math.min(1,s/30),X=cr(xu(n,o,U*.6)+Math.PI);this.idleT>1.2&&(this.yaw=Li(this.yaw,X,3.5+U*3,t)),this.idleT>1.2&&(this.pitch=de(this.pitch,.16+U*.06,2,t)),f=6.2+U*2.2,d=1.9+U*.5,g=62+U*16}else a==="aim"?(f=2.4,d=1.45,g=50,x=1.05):(f=4.2,d=1.6,g=62,s>1&&this.idleT>1.6&&(this.yaw=Li(this.yaw,n+Math.PI,.8,t)));this.fov=de(this.fov,g,4,t),this.curDist=de(this.curDist,f,a==="aim"?14:5,t);const p=Math.sin(this.yaw),m=Math.cos(this.yaw),y=m,M=-p,v=this._target.set(i.x+y*x,i.y+d,i.z+M*x),b=Math.sin(this.pitch),_=Math.cos(this.pitch),T=this._desired.set(v.x+p*_*this.curDist,v.y+b*this.curDist,v.z+m*_*this.curDist),C=T.x-v.x,w=T.z-v.z,S=Math.hypot(C,w);if(S>.01){const U=da(this.city.hash,v.x,v.z,C/S,w/S,S+.3,X=>X.kind==="building"&&(X.maxY??999)>Math.min(T.y,v.y)-.5);if(U.t<S+.3&&U.box){const X=Math.max(.12,(U.t-.4)/S);T.set(v.x+C*X,v.y+(T.y-v.y)*X,v.z+w*X)}}const P=this.city.groundHeight(T.x,T.z)+.35;T.y<P&&(T.y=P);const z=a==="car"?12:18;this.pos.x=de(this.pos.x,T.x,z,t),this.pos.y=de(this.pos.y,T.y,z,t),this.pos.z=de(this.pos.z,T.z,z,t),this.look.x=de(this.look.x,v.x,25,t),this.look.y=de(this.look.y,v.y,25,t),this.look.z=de(this.look.z,v.z,25,t),this.shake=Math.max(0,this.shake-t*2.2),this.recoil=de(this.recoil,0,12,t);const I=this.shake*this.shake*.35;this.shakeV.set((Math.random()-.5)*I,(Math.random()-.5)*I,(Math.random()-.5)*I),this.cam.position.copy(this.pos).add(this.shakeV),this.cam.lookAt(this.look.x+this.shakeV.x*.5,this.look.y+this.recoil*.4,this.look.z+this.shakeV.z*.5),a==="car"&&this.cam.rotateZ(ie(-this._roll||0,-.05,.05)),Math.abs(this.cam.fov-this.fov)>.05&&(this.cam.fov=this.fov,this.cam.updateProjectionMatrix())}snapBehind(t){this.yaw=t+Math.PI,this.idleT=5}forward(t){return t.set(-Math.sin(this.yaw),0,-Math.cos(this.yaw)),t}}const Hs=new D;function hi(r,t,e,i,n,s){const a=2*Math.PI*n/4,o=Math.max(s-2*n,0),l=Math.PI/4;Hs.copy(t),Hs[i]=0,Hs.normalize();const c=.5*a/(a+o),h=1-Hs.angleTo(r)/l;return Math.sign(Hs[e])===1?h*c:o/(a+o)+c+c*(1-h)}class Il extends Ft{constructor(t=1,e=1,i=1,n=2,s=.1){if(n=n*2+1,s=Math.min(t/2,e/2,i/2,s),super(1,1,1,n,n,n),n===1)return;const a=this.toNonIndexed();this.index=null,this.attributes.position=a.attributes.position,this.attributes.normal=a.attributes.normal,this.attributes.uv=a.attributes.uv;const o=new D,l=new D,c=new D(t,e,i).divideScalar(2).subScalar(s),h=this.attributes.position.array,u=this.attributes.normal.array,f=this.attributes.uv.array,d=h.length/6,g=new D,x=.5/n;for(let p=0,m=0;p<h.length;p+=3,m+=2)switch(o.fromArray(h,p),l.copy(o),l.x-=Math.sign(l.x)*x,l.y-=Math.sign(l.y)*x,l.z-=Math.sign(l.z)*x,l.normalize(),h[p+0]=c.x*Math.sign(o.x)+l.x*s,h[p+1]=c.y*Math.sign(o.y)+l.y*s,h[p+2]=c.z*Math.sign(o.z)+l.z*s,u[p+0]=l.x,u[p+1]=l.y,u[p+2]=l.z,Math.floor(p/d)){case 0:g.set(1,0,0),f[m+0]=hi(g,l,"z","y",s,i),f[m+1]=1-hi(g,l,"y","z",s,e);break;case 1:g.set(-1,0,0),f[m+0]=1-hi(g,l,"z","y",s,i),f[m+1]=1-hi(g,l,"y","z",s,e);break;case 2:g.set(0,1,0),f[m+0]=1-hi(g,l,"x","z",s,t),f[m+1]=hi(g,l,"z","x",s,i);break;case 3:g.set(0,-1,0),f[m+0]=1-hi(g,l,"x","z",s,t),f[m+1]=1-hi(g,l,"z","x",s,i);break;case 4:g.set(0,0,1),f[m+0]=1-hi(g,l,"x","y",s,t),f[m+1]=1-hi(g,l,"y","x",s,e);break;case 5:g.set(0,0,-1),f[m+0]=hi(g,l,"x","y",s,t),f[m+1]=1-hi(g,l,"y","x",s,e);break}}}const co=new Map;function fe(r,t=.85){const e=r+"_"+t;return co.has(e)||co.set(e,new Et({color:r,roughness:t})),co.get(e)}const fi=new Map;function as(r,t,e){const i=r+","+t+","+e;if(!fi.has(i)){const n=new Il(r,t,e,2,Math.min(r,t,e)*.3);n.userData.shared=!0,fi.set(i,n)}return fi.get(i)}function Cn(r){const t="s"+r;if(!fi.has(t)){const e=new ji(r,14,11);e.userData.shared=!0,fi.set(t,e)}return fi.get(t)}function ph(r,t){const e="c"+r.toFixed(3)+","+t.toFixed(3);if(!fi.has(e)){const i=new Cl(r,Math.max(.04,t-2*r),4,12);i.userData.shared=!0,fi.set(e,i)}return fi.get(e)}function ho(r,t,e){const i=`t${r.toFixed(3)},${t.toFixed(3)},${e.toFixed(3)}`;if(!fi.has(i)){const n=new Zt(r,t,e,14);n.userData.shared=!0,fi.set(i,n)}return fi.get(i)}const Kx=[15845797,14264439,11631179,8014634,15185807,5978657],mh=[15158332,3447003,15844367,3066993,10181046,15528177,1752220,15105570,3426654,16744118],jx=[2899536,3426654,8359053,2042422,6111287,3033722],Qx=[2825490,1118481,7031339,14266991,9079434,10506797],Jx=7226666,$x=855309,tv=16053492,ev=3100559,gh={slim:{torsoW:.42,torsoH:.6,hipW:.38,armW:.12,legW:.145,head:.25,h:.97},avg:{torsoW:.46,torsoH:.62,hipW:.42,armW:.13,legW:.16,head:.26,h:1},athletic:{torsoW:.5,torsoH:.64,hipW:.42,armW:.145,legW:.175,head:.26,h:1.02},heavy:{torsoW:.55,torsoH:.6,hipW:.5,armW:.15,legW:.19,head:.28,h:.98}},iv=["fade","fade","flat","afro","bald","cap","beanie","long"];class hl{constructor(t={}){const e=t.kind||"ped",i=t.female??(e==="ped"&&Math.random()<.32),n=ot=>ot[Math.random()*ot.length|0];let s=t.skin??n(Kx),a=t.shirt??n(mh),o=t.pants??n(jx),l=t.hair??n(Qx),c=t.build??(Math.random()<.2?"slim":Math.random()<.75?"avg":"heavy"),h=t.hairStyle??n(iv);i&&(h==="fade"||h==="bald")&&(h="long");let u=!1,f=null,d=!1,g=null;if(e==="cop"&&(a=2046611,o=1317939,h="cap",c=t.build??"athletic"),e==="gang"&&(a=t.shirt??1776411,o=t.pants??2763306,h=t.hairStyle??"bandana"),e==="clerk"&&(o=2236962,h="cap"),e==="player"&&(s=t.skin??Jx,a=t.shirt??tv,o=t.pants??ev,l=t.hair??$x,h="fade",c=t.build??"athletic",u=!0),e==="ped"&&!i){const ot=Math.random();ot<.22?f=2830134:ot<.32&&(f=6109722),!f&&Math.random()<.25&&(d=!0)}e==="ped"&&i&&Math.random()<.4&&(d=!0),h==="beanie"&&(g=n(mh)),this.kind=e,this.female=i;const x=gh[c]||gh.avg,p=x.torsoW-(i?.04:0),m=x.hipW+(i?.04:0),y=x.armW-(i?.015:0),M=x.legW,v=x.head;this.group=new Ee;const b=this.group,_=this.body=new Ee;b.add(_);const T=fe(s),C=fe(a),w=fe(o),S=fe(l,.6),P=fe(16119285,.9),z=fe(1315860,.5),I=fe(13938487,.35),U=(ot,mt,Z,at,L,At,rt,vt)=>{const ct=new G(as(mt,Z,at),L);return ct.position.set(At,rt,vt),ct.castShadow=!0,ot.add(ct),ct},X=p*.34,q=this.torso=new G(ho(p*.58,p*.44,x.torsoH),C);if(q.scale.z=.6,q.position.y=1.29,q.castShadow=!0,_.add(q),i)for(const ot of[-1,1]){const mt=new G(Cn(.075),C);mt.position.set(ot*.1,1.42,.13),mt.castShadow=!0,_.add(mt)}e==="player"&&(U(_,.2,.025,.02,I,0,1.52,X+.015),U(_,.05,.06,.02,I,0,1.47,X+.018));const $=new G(ho(m*.55,m*.48,.2),w);$.scale.z=.62,$.position.y=.9,$.castShadow=!0,_.add($),e==="cop"&&(U(_,m+.03,.07,.29,z,0,1,0),U(_,.06,.07,.02,I,-p/2+.1,1.45,X+.008));const B=this.headG=new Ee;B.position.y=1.62,_.add(B);const ft=v*.52,dt=new G(Cn(ft),T);dt.scale.set(1,1.12,.95),dt.position.y=.2,dt.castShadow=!0,B.add(dt);const xt=v*.44;U(B,.045,.09,.06,T,-v/2+.005,.2,0),U(B,.045,.09,.06,T,v/2-.005,.2,0),U(B,v*.72,.05,.015,P,0,.235,xt+.008),U(B,.032,.032,.012,z,-.05,.232,xt+.015),U(B,.032,.032,.012,z,.05,.232,xt+.015),U(B,.05,.07,.045,T,0,.165,xt+.018),i?U(B,.09,.022,.012,fe(9059146,.7),0,.1,xt+.01):U(B,.1,.018,.012,fe(3810071,.9),0,.1,xt+.01),(e==="player"||!i&&e!=="cop"&&Math.random()<.35)&&U(B,.11,.055,.02,S,0,.055,xt+.008);const tt=new G(ho(.075,.085,.12),T);tt.position.y=0,B.add(tt);const O=S;if(h==="fade"||e==="player")U(B,v+.03,.07,v+.03,O,0,.375,0),U(B,.03,.12,v-.02,O,-v/2+.01,.28,0),U(B,.03,.12,v-.02,O,v/2-.01,.28,0),U(B,v-.02,.12,.03,O,0,.28,-v/2+.01);else if(h==="flat")U(B,v+.04,.09,v+.04,O,0,.38,0);else if(h==="afro"){const ot=new G(Cn(v*.85),O);ot.position.y=.37,ot.scale.set(1,.95,1),ot.castShadow=!0,B.add(ot)}else if(h==="cap"||e==="cop"){const ot=e==="cop"?fe(989754):e==="clerk"?fe(a,.8):O,mt=new G(Cn(v*.56),ot);mt.scale.set(1,.62,1),mt.position.y=.36,mt.castShadow=!0,B.add(mt),U(B,v-.02,.03,.16,e==="cop"?fe(659234):z,0,.335,.2)}else if(h==="beanie"){const ot=fe(g??l,.9),mt=new G(Cn(v*.58),ot);mt.scale.set(1,.72,1),mt.position.y=.36,mt.castShadow=!0,B.add(mt),U(B,v+.05,.06,v+.05,ot,0,.31,0)}else if(h==="long")U(B,v+.03,.08,v+.03,O,0,.375,0),U(B,v-.03,.42,.08,O,0,.08,-v/2-.005),U(B,.04,.3,.1,O,-v/2+.005,.14,0),U(B,.04,.3,.1,O,v/2-.005,.14,0);else if(h==="bandana"){const ot=fe(t.gangColor??9323693,.9),mt=new G(Cn(v*.55),ot);mt.scale.set(1,.6,1),mt.position.y=.345,B.add(mt),U(B,.08,.08,.07,ot,0,.33,-v/2-.02)}if(e==="player"){const ot=new G(as(.24,.05,.04),fe(1118481,.2));ot.position.set(0,.24,.14),B.add(ot)}if(e==="clerk"){const ot=new G(as(.4,.5,.05),P);ot.position.set(0,-.35,X+.02),B.add(ot)}const J=(ot,mt,Z,at,L)=>{const At=new Ee,rt=new G(ph(ot/2,mt*L),Z);rt.position.y=-mt*L/2,rt.castShadow=!0,At.add(rt);const vt=new Ee;vt.position.y=-mt*L,At.add(vt);const ct=new G(ph(ot*.45,mt*(1-L)),at);return ct.position.y=-mt*(1-L)/2,ct.castShadow=!0,vt.add(ct),At.lowerG=vt,At},ht=u?T:f?fe(f,.9):C,st=f?fe(f,.9):T;this.armL=J(y,.66,ht,st,.5),this.armL.position.set(-(p/2+.07),1.56,0),_.add(this.armL),this.armR=J(y,.66,ht,st,.5),this.armR.position.set(p/2+.07,1.56,0),_.add(this.armR);for(const ot of[this.armL,this.armR]){const mt=new G(Cn(.068),T);mt.position.set(0,-.36,.01),mt.castShadow=!0,ot.lowerG.add(mt)}e==="player"&&(U(this.armL,y+.014,.1,y+.014,fe(1842204,.9),0,-.14,0),U(this.armL.lowerG,y*.9+.02,.05,y*.9+.02,fe(12632256,.3),0,-.26,0));const Pt=d?T:w;if(this.legL=J(M,.9,w,Pt,.5),this.legL.position.set(-.12,.88,0),_.add(this.legL),this.legR=J(M,.9,w,Pt,.5),this.legR.position.set(.12,.88,0),_.add(this.legR),d&&(U(this.legL.lowerG,M*.92,.09,M*.92,P,0,-.33,0),U(this.legR.lowerG,M*.92,.09,M*.92,P,0,-.33,0)),e==="player"||c==="heavy"){const ot=e==="player"?fe(2375790,.9):w;U(this.legL.lowerG,M+.03,.08,M+.03,ot,0,-.38,0),U(this.legR.lowerG,M+.03,.08,M+.03,ot,0,-.38,0)}const kt=e==="player"||Math.random()<.3?P:fe(1710618,.5);for(const ot of[this.legL,this.legR]){const mt=new G(as(M+.01,.1,.29),kt);mt.position.set(0,-.42,.06),mt.castShadow=!0,ot.lowerG.add(mt);const Z=new G(as(M+.02,.035,.3),z);Z.position.set(0,-.475,.06),ot.lowerG.add(Z)}_.scale.setScalar(x.h),this.hand=new Ee,this.hand.position.y=-.3,this.armR.lowerG.add(this.hand),this.gun=new Ee,this.hand.add(this.gun),this.gun.visible=!1,this.gun.rotation.x=Math.PI/2,this.muzzle=new me,this.gun.add(this.muzzle),this.gunKey=null,this.setWeapon(t.weapon||"pistol"),this.phase=Math.random()*6.28,this.lean=0,this.bob=0,this.deadT=0,this.state={move:0,run:0,aiming:!1,sitting:!1,dead:!1,punch:0,airborne:!1,swim:!1,panic:!1,weaponLong:!1,hasWeapon:!1,aimPitch:0,firePose:0}}dispose(){const t=new Set;this.group.traverse(e=>{e.geometry&&!t.has(e.geometry)&&(t.add(e.geometry),e.geometry.userData.shared||e.geometry.dispose())}),this.group.parent?.remove(this.group)}setWeapon(t){if(t===this.gunKey)return;for(this.gunKey=t;this.gun.children.length>1;){const u=this.gun.children[this.gun.children.length-1];this.gun.remove(u),u.traverse?.(f=>{f.geometry&&!f.geometry.userData.shared&&f.geometry.dispose()})}const e=fe(1711135,.35),i=new Et({color:4870232,roughness:.3,metalness:.85}),n=fe(7031339,.7),s=fe(4938286,.7),a=(u,f,d,g,x,p=0,m=0,y=0)=>{const M=new G(u,f);return M.position.set(d,g,x),M.rotation.set(p,m,y),M.castShadow=!0,this.gun.add(M),M},o=(u,f,d)=>as(u,f,d),l=(u,f,d=u)=>{const g=new Zt(u,d,f,10);return g.rotateX(Math.PI/2),g};let c=.25;t==="pistol"?(a(o(.045,.07,.22),e,0,.03,.1),a(l(.012,.07),i,0,.03,.24),a(o(.04,.13,.055),fe(2763306,.5),0,-.05,0,.2),a(o(.03,.02,.06),e,0,-.02,.07),c=.28):t==="uzi"?(a(o(.06,.09,.3),e,0,.02,.12),a(o(.035,.18,.05),i,0,-.1,.03),a(l(.014,.12),i,0,.03,.32),a(o(.04,.12,.05),fe(2763306,.5),0,-.06,-.04,.2),a(o(.03,.03,.22),i,0,.04,-.14),c=.38):t==="shotgun"?(a(l(.017,.72),i,0,.04,.42),a(l(.014,.5),i,0,.005,.4),a(o(.05,.05,.16),n,0,0,.32),a(o(.05,.08,.22),e,0,.02,.06),a(o(.045,.09,.3),n,0,-.04,-.2,-.12),c=.8):t==="rifle"?(a(l(.013,.62),i,0,.045,.5),a(o(.05,.09,.32),e,0,.02,.1),a(o(.035,.16,.06),e,0,-.09,.14,.25),a(o(.04,.05,.22),e,0,0,.32),a(o(.045,.08,.28),e,0,-.02,-.22,-.1),a(l(.02,.16),i,0,.1,.08),a(o(.04,.12,.05),fe(2763306,.5),0,-.06,-.03,.2),c=.82):t==="rpg"?(a(l(.045,.9),s,0,.06,.2),a(l(.05,.22,.02),fe(9058858,.5),0,.06,.76),a(l(.06,.1,.045),s,0,.06,-.3),a(o(.04,.12,.05),fe(2763306,.5),0,-.05,.05,.2),a(o(.04,.1,.05),fe(2763306,.5),0,-.04,.3,.2),c=.9):c=.2;const h=t==="pistol"?1.7:t==="uzi"?1.5:1.3;this.muzzle.position.set(0,.04*h,c*h);for(const u of this.gun.children)u!==this.muzzle&&(u.scale.setScalar(h),u.position.multiplyScalar(h))}animate(t,e=this.state){const{move:i,run:n}=e,s=6+n*6;i>.05&&!e.sitting&&(this.phase+=t*s*(.5+i*.5));const a=e.sitting?0:te(.35,.95,n)*i,o=Math.sin(this.phase),l=Math.cos(this.phase),c=1-Math.exp(-14*t),h=(f,d,g=0,x=0)=>{f.rotation.x=te(f.rotation.x,d,c),f.rotation.y=te(f.rotation.y,g,c),f.rotation.z=te(f.rotation.z,x,c)};if(this.gun.visible=e.hasWeapon&&!e.dead,e.dead){this.deadT+=t;const f=ie(this.deadT*2.2,0,1),d=1-(1-f)*(1-f);this.body.rotation.x=te(this.body.rotation.x,-Math.PI/2*(this.deadDir??1),d*.3+.05),this.body.position.y=te(this.body.position.y,.15,.2),h(this.armL,-.4,0,-1.2),h(this.armR,.5,0,1),h(this.legL,.1,0,.3),h(this.legR,-.2,0,-.2),this.legL.lowerG.rotation.x=.4;return}if(this.body.rotation.x=te(this.body.rotation.x,0,c),this.body.position.y=te(this.body.position.y,0,c),e.sitting){h(this.legL,-1.45,0,.05),h(this.legR,-1.45,0,-.05),this.legL.lowerG.rotation.x=te(this.legL.lowerG.rotation.x,1.3,c),this.legR.lowerG.rotation.x=te(this.legR.lowerG.rotation.x,1.3,c),h(this.armL,-1,0,.35),h(this.armR,-1,0,-.35),this.armL.lowerG.rotation.x=te(this.armL.lowerG.rotation.x,-.6,c),this.armR.lowerG.rotation.x=te(this.armR.lowerG.rotation.x,-.6,c),this.torso.rotation.x=0,this.body.position.y=-1,h(this.headG,0,0,0);return}if(e.swim){this.phase+=t*5;const f=this.phase;h(this.armL,-Math.PI+Math.sin(f)*1.2,0,.4),h(this.armR,-Math.PI+Math.sin(f+Math.PI)*1.2,0,-.4),h(this.legL,Math.sin(f*2)*.4,0,0),h(this.legR,-Math.sin(f*2)*.4,0,0),this.body.rotation.x=te(this.body.rotation.x,1.35,c),this.body.position.y=-.6;return}h(this.legL,o*a,0,0),h(this.legR,-o*a,0,0),this.legL.lowerG.rotation.x=te(this.legL.lowerG.rotation.x,Math.max(0,-l)*a*1.2,c),this.legR.lowerG.rotation.x=te(this.legR.lowerG.rotation.x,Math.max(0,l)*a*1.2,c),e.airborne&&(h(this.legL,-.5,0,.1),h(this.legR,.3,0,-.1),this.legL.lowerG.rotation.x=1);const u=(e.aiming||e.firePose>0)&&e.hasWeapon;if(u){const f=e.aimPitch||0;e.weaponLong?(h(this.armR,-Math.PI/2-f,0,-.42),h(this.armL,-Math.PI/2-f+.12,0,.55),this.armL.lowerG.rotation.x=te(this.armL.lowerG.rotation.x,-.55,c),this.armR.lowerG.rotation.x=te(this.armR.lowerG.rotation.x,0,c)):(h(this.armR,-Math.PI/2-f,0,-.38),h(this.armL,-Math.PI/2-f+.2,0,.6),this.armL.lowerG.rotation.x=te(this.armL.lowerG.rotation.x,-.5,c),this.armR.lowerG.rotation.x=te(this.armR.lowerG.rotation.x,0,c)),this.gun.rotation.x=Math.PI/2,this.gun.rotation.y=0,this.gun.position.set(0,.03,.02),this.torso.rotation.y=te(this.torso.rotation.y,-.35,c)}else if(e.punch>0){const f=e.punch;h(this.armR,-1.4-Math.sin(f*Math.PI)*.6,.2,-.1),this.armR.lowerG.rotation.x=-.4+Math.sin(f*Math.PI)*.4,h(this.armL,-.9,-.3,.3),this.armL.lowerG.rotation.x=-1.3}else{const f=a*.9,d=e.panic?1:0;h(this.armL,-o*f-d*2.4,0,.12+d*.6),h(this.armR,o*f-d*2.4,0,-.12-d*.6),this.armL.lowerG.rotation.x=te(this.armL.lowerG.rotation.x,-.3-n*.9,c),this.armR.lowerG.rotation.x=te(this.armR.lowerG.rotation.x,-.3-n*.9-(e.hasWeapon?.5:0),c),this.gun.rotation.x=Math.PI/2,this.gun.position.set(0,0,.02),this.torso.rotation.y=te(this.torso.rotation.y,0,c)}this.torso.rotation.x=0,this.body.rotation.x=te(this.body.rotation.x,n*.18*i+(e.airborne?.15:0),c),this.body.position.y=Math.abs(l)*a*.08,h(this.headG,u?-.05-(e.aimPitch||0)*.5:.05-n*.1,u?.15:0,0)}}const Pi={fist:{name:"Fists",damage:14,rate:.42,range:1.7,melee:!0,icon:"✊"},pistol:{name:"Pistol",damage:26,rate:.26,spread:.012,range:90,clip:34,sound:"pistol",icon:"🔫",recoil:.35},uzi:{name:"Uzi",damage:13,rate:.07,spread:.04,range:60,auto:!0,clip:90,sound:"uzi",icon:"🔫",recoil:.18},shotgun:{name:"Shotgun",damage:11,pellets:9,rate:.85,spread:.075,range:32,clip:24,sound:"shotgun",icon:"🔫",long:!0,recoil:.9},rifle:{name:"Rifle",damage:60,rate:.55,spread:.004,range:200,clip:30,sound:"rifle",icon:"🔫",long:!0,recoil:.6},rpg:{name:"RPG",damage:0,rate:1.4,spread:0,range:150,clip:3,sound:"rifle",icon:"🚀",long:!0,recoil:1.2,projectile:!0}},Yr=["fist","pistol","uzi","shotgun","rifle","rpg"],Gs=new D,Ye=new D,Wi=new D,uo=new Vt,fo=new D,xh=new D,Zr=new or,po=new yn,Xi=new tn;function Bn(r,t,e,i,n){let s={t:i,type:"none",entity:null};const a=Math.hypot(e.x,e.z);if(a>1e-4){const c=da(r.city.hash,t.x,t.z,e.x/a,e.z/a,i*a,(h,u)=>{const f=t.y+e.y*(u/a);return f>=(h.minY??0)&&f<=(h.maxY??1/0)});if(c.box){const h=c.t/a;h<s.t&&(s={t:h,type:"world",entity:c.box})}}if(e.y<-1e-4){const c=-(t.y-.02)/e.y;c>0&&c<s.t&&(s={t:c,type:"ground",entity:null})}Zr.set(t,e);for(const c of r.vehicles){if(c===n?.vehicle)continue;const h=c.x-t.x,u=c.z-t.z;if(Math.hypot(h,u)-c.halfL>s.t)continue;if(uo.copy(c.group.matrixWorld).invert(),fo.copy(t).applyMatrix4(uo),xh.copy(e).transformDirection(uo),po.min.set(-c.halfW,.2,-c.halfL),po.max.set(c.halfW,c.type.profile.reduce((x,p)=>Math.max(x,p[1]),0),c.halfL),new or(fo,xh).intersectBox(po,Wi)){const x=Wi.distanceTo(fo);x<s.t&&(s={t:x,type:"vehicle",entity:c})}}const o=r.peds,l=n===r.player?o:[...o,r.player];for(const c of l){if(c===n||c.dead||c.vehicle)continue;if(Xi.center.set(c.x,c.y+.9,c.z),Xi.radius=.45,Zr.intersectSphere(Xi,Wi)){const f=Wi.distanceTo(t);f<s.t&&(s={t:f,type:"ped",entity:c})}if(Xi.center.set(c.x,c.y+1.72,c.z),Xi.radius=.2,Zr.intersectSphere(Xi,Wi)){const f=Wi.distanceTo(t);f<=s.t+.05&&(s={t:f,type:"ped",entity:c,head:!0})}}for(const c of r.barrels){if(c.dead)continue;if(Xi.center.set(c.x,c.y+.55,c.z),Xi.radius=.55,Zr.intersectSphere(Xi,Wi)){const u=Wi.distanceTo(t);u<s.t&&(s={t:u,type:"barrel",entity:c})}}return s.point=Wi.copy(t).addScaledVector(e,s.t).clone(),s}function nv(r,t,e,i,n){const s=Pi[e],a=r.effects;if(s.projectile){r.projectiles.launch(i,n,t),a.muzzle(i,n),r.audio.gunshot("shotgun"),r.noise(i.x,i.z,60,t);return}const o=s.pellets||1;let l=!1,c=!1,h=!1;for(let u=0;u<o;u++){Ye.copy(n),Ye.x+=(Math.random()-.5)*s.spread*2,Ye.y+=(Math.random()-.5)*s.spread*2,Ye.z+=(Math.random()-.5)*s.spread*2,Ye.normalize();const f=Bn(r,i,Ye,s.range,t);if(a.addTracer(i,f.point),f.type==="ped"){const d=!f.entity.dead;f.entity.hurt(f.head?s.damage*2.5:s.damage,t,Ye),a.blood(f.point.x,f.point.y,f.point.z,f.head?12:6),l=!0,f.head&&(c=!0),d&&f.entity.dead&&(h=!0)}else f.type==="vehicle"?(f.entity.damage(s.damage*.45,"bullet",t),a.sparks(f.point.x,f.point.y,f.point.z,5),f.entity.control==="ai"&&f.entity.ai&&(f.entity.ai.scared=6),l=!0):f.type==="barrel"?(f.entity.hurt(s.damage,t),a.sparks(f.point.x,f.point.y,f.point.z,6),l=!0):(f.type==="world"||f.type==="ground")&&a.puff(f.point.x,f.point.y,f.point.z,3,.35)}a.muzzle(i,n),r.audio.gunshot(s.sound),r.noise(i.x,i.z,45,t),t===r.player&&l&&r.hud.hitmarker(h?"kill":c?"head":"hit")}function sv(r,t,e,i,n,s,a,o){const l=r.effects;Gs.set(e,i,n),Ye.set(s.x-e,s.y+1-i,s.z-n).normalize();const c=Bn(r,Gs,Ye,70,t);if(!(c.type==="ped"&&c.entity===s)&&!(c.type==="vehicle"&&c.entity===s.vehicle))return!1;Math.random()>a&&(Ye.x+=(Math.random()-.5)*.16,Ye.y+=(Math.random()-.5)*.06,Ye.z+=(Math.random()-.5)*.16,Ye.normalize());const h=Bn(r,Gs,Ye,70,t);return l.addTracer(Gs,h.point),l.muzzle(Gs,Ye),Math.hypot(e-r.player.x,n-r.player.z)<90&&r.audio.gunshot("pistol"),h.type==="ped"?(h.entity===r.player?r.player.takeDamage(o,t):h.entity.hurt(o,t,Ye),l.blood(h.point.x,h.point.y,h.point.z,4)):h.type==="vehicle"?(h.entity.damage(3,"bullet",t),l.sparks(h.point.x,h.point.y,h.point.z,4),h.entity===r.player.vehicle&&r.player.takeDamage(o*.4,t,"impact")):h.type==="barrel"&&h.entity.hurt(20,t),!0}const yu=new Zt(.07,.09,.7,8);yu.rotateX(Math.PI/2);const rv=new Et({color:5597999,roughness:.6,metalness:.3});class av{constructor(t){this.game=t,this.list=[]}launch(t,e,i){const n=new G(yu,rv);n.position.copy(t),n.lookAt(t.clone().add(e)),this.game.scene.add(n);const s=new rr(16752704,15,12,2);n.add(s),this.list.push({m:n,pos:t.clone(),dir:e.clone().normalize(),speed:55,life:5,shooter:i})}update(t){const e=this.game;for(let i=this.list.length-1;i>=0;i--){const n=this.list[i];n.life-=t;const s=n.speed*t,a=Bn(e,n.pos,n.dir,s+.3,n.shooter),o=a.type!=="none"&&a.t<=s+.3;if(o||n.life<=0){const l=o?a.point:n.pos;e.effects.explosion(l.x,l.y-.5,l.z,1.1),e.audio.explosion(),e.explodeAt(l.x,l.y,l.z,9,n.shooter),e.rig.addShake(Math.max(0,1-Math.hypot(l.x-e.player.x,l.z-e.player.z)/40)),n.shooter===e.player&&e.crime("explosion",l.x,l.z),e.scene.remove(n.m),this.list.splice(i,1);continue}n.pos.addScaledVector(n.dir,s),n.m.position.copy(n.pos),e.effects.smoke.emit(n.pos.x,n.pos.y,n.pos.z,0,.5,0,.9,.5,.75,.75,.75,1.5,1,.2),e.effects.fire.emit(n.pos.x,n.pos.y,n.pos.z,-n.dir.x*3,0,-n.dir.z*3,.15,.5,1,.6,.2,0,2,0)}}}const vh={ped:["Nice weather for a heist.","Do I know you?","This city's gone to hell.","Keep walking, pal.","You look like trouble.","Have you seen my car? Red sedan. Big dent.","The burgers at Burger Shot are 40% meat now!","I'm late for a thing. A very important thing.","Ammu-Nation's got a sale on. Not that I'd know.","Watch the road, cabs here drive like maniacs.","Downtown's beautiful at night, if you like sirens.","Is that a gun or are you just happy to see me?","Don't get me started on the traffic lights."],cop:["Move along, citizen.","Nothing to see here.","Keep your nose clean.","I've got my eye on you.","Stay out of trouble."],gang:["You lost, tourist?","This is our block.","Keep steppin'.","You got a problem?","Eastside runs this."],clerk:["Welcome in! Press E at the counter to shop.","Take a look around.","Cash only, friend."],player:["Hey.","What's up?","Sup.","Nice day.","Yeah, yeah.","Sure.","Alright then."]};new D;function Mu(r,t,e){for(const i of t){if(i===r.vehicle)continue;const n=r.x-i.x,s=r.z-i.z;if(n*n+s*s>(i.halfL+1.2)**2)continue;const a=Math.sin(i.heading),o=Math.cos(i.heading),l=n*a+s*o,c=n*o-s*a,h=i.halfL+r.radius,u=i.halfW+r.radius;if(Math.abs(l)>h||Math.abs(c)>u||r.y>1.6)continue;const f=h-Math.abs(l),d=u-Math.abs(c);let g,x;if(d<f){const m=Math.sign(c)||1;g=o*m,x=-a*m,r.x+=g*d,r.z+=x*d}else{const m=Math.sign(l)||1;g=a*m,x=o*m,r.x+=g*f,r.z+=x*f}const p=-(i.vx*g+i.vz*x);p>2.5&&e(i,p,g,x)}}let ov=0;class xn{constructor(t,e,i,n={}){this.game=t,this.id=ov++,this.kind=n.kind||"ped",this.char=new hl({kind:this.kind,...n,weapon:n.weapon||(this.kind==="cop"||this.kind==="gang","pistol")}),this.x=e,this.z=i,this.y=t.city.groundHeight(e,i),this.heading=Dt(0,6.28),this.radius=.38,this.vx=0,this.vz=0,this.vy=0,this.health=this.kind==="cop"?65:60,this.dead=!1,this.downT=0,this.deadT=0,this.knocked=!1,this.state="walk",this.panicT=0,this.fleeDir=0,this.waitT=0,this.vehicle=null,this.speed=0,this.walkSpeed=Dt(1.2,2),this.runSpeed=Dt(5.2,6.4),this.target=null,this.nav=null,this.money=Math.random()<.5?Math.floor(Dt(5,60)):0,this.mission=null,this.important=!1,this.hitCooldown=0,this.weapon=n.weapon||null,this.shootT=0,this.arrestT=0,this.stuckT=0,this.hostile=!1,this.talkT=0,this.gangColor=n.gangColor,this.kind==="gang"&&(this.weapon="pistol",this.health=70),t.scene.add(this.char.group),this.syncMesh(),(this.kind==="ped"||this.kind==="gang")&&this.pickNav()}get pos(){return{x:this.x,y:this.y,z:this.z}}syncMesh(){this.char.group.position.set(this.x,this.y,this.z),this.char.group.rotation.y=this.heading}pickNav(){const t=this.game.city;let e=null,i=1/0;for(const o of t.blocks){const l=Math.hypot(o.cx-this.x,o.cz-this.z);l<i&&(i=l,e=o)}const n=this.blockCorners(e);let s=0,a=1/0;n.forEach((o,l)=>{const c=Math.hypot(o.x-this.x,o.z-this.z);c<a&&(a=c,s=l)}),this.nav={block:e,corner:s,dir:Math.random()<.5?1:-1},this.target=n[s]}blockCorners(t){return[{x:t.x0-1.5,z:t.z0-1.5},{x:t.x1+1.5,z:t.z0-1.5},{x:t.x1+1.5,z:t.z1+1.5},{x:t.x0-1.5,z:t.z1+1.5}]}nextNavTarget(){const t=this.game.city,e=this.nav,i=e.block;if(Math.random()<.35){const n=e.corner,s=n===1||n===2?1:-1,a=n>=2?1:-1,o=[],l=t.blocks.find(h=>h.i===i.i+s&&h.j===i.j);l&&o.push({b:l,c:[1,0,3,2][n]});const c=t.blocks.find(h=>h.i===i.i&&h.j===i.j+a);if(c&&o.push({b:c,c:[3,2,1,0][n]}),o.length){const h=He(o);e.block=h.b,e.corner=h.c,this.target=this.blockCorners(h.b)[h.c],this.crossing=!0;return}}this.crossing=!1,e.corner=(e.corner+e.dir+4)%4,this.target=this.blockCorners(i)[e.corner],Math.random()<.15&&(this.waitT=Dt(1,4))}talk(t){if(this.dead||this.vehicle)return null;this.talkT=3,this.heading=Math.atan2(t.x-this.x,t.z-this.z),this.speed=0;const e=He(vh[this.kind]||vh.ped);return this.game.hud.speak(this,e,3e3),e}panic(t,e,i=6){if(!(this.dead||this.kind==="cop"||this.kind==="clerk"||this.vehicle)){if(this.kind==="gang"){this.hostile=!0,this.hostileT=25;return}this.state="flee",this.panicT=Math.max(this.panicT,i),this.fleeDir=Math.atan2(this.x-t,this.z-e)+Dt(-.6,.6)}}hurt(t,e,i){this.dead||(this.health-=t,this.lastAttacker=e,this.health<=0?this.die(e,i):(this.panic(e?.x??this.x,e?.z??this.z,8),this.kind==="cop"&&this.game.police.onCopHurt(this,e),this.kind==="gang"&&this.game.pedsMgr.alertGang(this)))}knock(t,e,i,n){this.dead||(this.vx=t,this.vz=e,this.vy=3.5,this.knocked=!0,this.downT=1.8,this.char.state.dead=!0,this.char.deadT=0,this.char.deadDir=Math.random()<.5?1:-1,this.health-=i,this.game.audio.thud(),this.game.effects.blood(this.x,this.y+.8,this.z,5),this.health<=0?this.die(n):this.panicT=8)}die(t,e){this.dead||(this.dead=!0,this.deadT=0,this.state="dead",this.char.state.dead=!0,this.char.deadT=0,this.char.deadDir=Math.random()<.5?1:-1,e&&(this.vx=e.x*2,this.vz=e.z*2),this.game.onPedKilled(this,t))}update(t){const e=this.game,i=e.city,n=this.char.state;if(this.hitCooldown=Math.max(0,this.hitCooldown-t),this.vehicle){this.syncSeat();return}if(this.dead||this.knocked){this.vy-=22*t,this.y+=this.vy*t;const f=i.groundHeight(this.x,this.z);this.y<f&&(this.y=f,this.vy=0,this.vx*=.6,this.vz*=.6),this.x+=this.vx*t,this.z+=this.vz*t,this.vx*=Math.exp(-3*t),this.vz*=Math.exp(-3*t),fa(i.hash,this,this.radius,2,this.y),this.dead?this.deadT+=t:(this.downT-=t,this.downT<=0&&(this.knocked=!1,n.dead=!1,this.state="flee",this.panicT=6,this.fleeDir=Dt(0,6.28))),this.char.animate(t),this.syncMesh();return}this.talkT>0?(this.talkT-=t,this.speed=0):this.kind==="cop"?e.police.updateCop(this,t):this.kind==="clerk"?this.speed=0:this.kind==="gang"&&this.hostile?this.gangBrain(t):this.civilianBrain(t);let s=0,a=0;const o=this.speed;o>0&&(s=Math.sin(this.heading)*o,a=Math.cos(this.heading)*o);const l=this.x,c=this.z;this.x+=s*t,this.z+=a*t,fa(i.hash,this,this.radius,2,this.y),Mu(this,e.vehicles,(f,d,g,x)=>{if(this.hitCooldown>0)return;this.hitCooldown=.5;const p=d*(d>8?6:3);this.knock(f.vx*.9+g*2,f.vz*.9+x*2,p,f.driver||f),f.lastPedHit={ped:this,impact:d},f.control==="player"&&!this.dead&&e.crime("hit_ped",this.x,this.z),f.driver===e.player&&e.rig.addShake(.25)});const h=Math.hypot(this.x-l,this.z-c);o>.5&&h<o*t*.3?(this.stuckT+=t,this.stuckT>.8&&(this.stuckT=0,this.state==="flee"?this.fleeDir+=Dt(1.5,3):this.pickNav())):this.stuckT=0,this.game.city.isWater(this.x,this.z)&&(this.fleeDir=Math.atan2(-this.x,-this.z),this.heading=this.fleeDir),this.y=de(this.y,i.groundHeight(this.x,this.z),20,t);const u=this.speed>.1?1:0;n.move=de(n.move,u,10,t),n.run=de(n.run,this.speed>3?1:0,8,t),n.panic=this.state==="flee"&&this.kind!=="cop",n.hasWeapon=!!this.weapon&&(this.kind!=="gang"||this.hostile),n.aiming=this.aiming,n.weaponLong=!1,this.char.animate(t),this.syncMesh()}gangBrain(t){const e=this.game,i=e.player,n=bt(this.x,this.z,i.x,i.z);if(this.hostileT-=t,this.hostileT<=0||i.dead||n>90){this.hostile=!1,this.aiming=!1,this.pickNav();return}const s=Math.atan2(i.x-this.x,i.z-this.z);this.heading=Li(this.heading,s,10,t),this.aiming=n<35,this.speed=n>14?this.runSpeed:n>8?2:0,this.shootT-=t,n<35&&this.shootT<=0&&(this.shootT=Dt(1.3,2.2),sv(e,this,this.x,this.y+1.35,this.z,i,ie(.45-n/90,.12,.45),5))}civilianBrain(t){const e=this.game,i=e.player,n=i.vehicle;if(n&&bt(this.x,this.z,n.x,n.z)<7&&n.absSpeed>7&&this.state!=="flee"&&this.panic(n.x,n.z,4),i.aiming&&i.currentWeapon!=="fist"&&bt(this.x,this.z,i.x,i.z)<14&&this.state!=="flee"&&this.panic(i.x,i.z,5),this.state==="flee"){if(this.panicT-=t,this.panicT<=0){this.state="walk",this.pickNav();return}this.heading=Li(this.heading,this.fleeDir,8,t),this.speed=this.runSpeed;return}if(this.waitT>0){this.waitT-=t,this.speed=0;return}this.target||this.pickNav();const s=this.target.x-this.x,a=this.target.z-this.z,o=Math.hypot(s,a);if(o<1){this.nextNavTarget();return}if(this.crossing&&o>3){for(const c of e.vehicles)if(c.absSpeed>2&&bt(c.x,c.z,this.target.x,this.target.z)<14&&bt(c.x,c.z,this.x,this.z)<12){this.speed=0;return}}const l=Math.atan2(s,a);this.heading=Li(this.heading,l,6,t),this.speed=Math.abs(cr(l-this.heading))<1?this.walkSpeed:this.walkSpeed*.4}enterVehicle(t){this.vehicle=t,t.driver=this,this.char.state.sitting=!0,this.char.state.dead=!1,t.seat.add(this.char.group),this.char.group.position.set(0,0,0),this.char.group.rotation.set(0,0,0)}exitVehicle(){const t=this.vehicle;if(!t)return;this.vehicle=null,t.driver===this&&(t.driver=null),this.game.scene.add(this.char.group),this.char.state.sitting=!1;const e=Math.sin(t.heading),i=Math.cos(t.heading);this.x=t.x+i*(t.halfW+.8),this.z=t.z-e*(t.halfW+.8),this.y=this.game.city.groundHeight(this.x,this.z),this.heading=t.heading-Math.PI/2,this.syncMesh()}syncSeat(){const t=this.vehicle;this.x=t.x,this.z=t.z,this.y=t.y,this.heading=t.heading,this.char.animate(.016)}dispose(){this.char.dispose()}}class lv{constructor(t){this.game=t,this.peds=t.peds,this.spawnT=0,this.maxPeds=55}update(t){const e=this.game,i=e.player;e.rig,this.spawnT-=t,this.spawnT<=0&&(this.spawnT=.25,this.peds.filter(s=>s.kind==="ped"&&!s.dead).length<this.maxPeds&&this.spawnOne());for(let n=this.peds.length-1;n>=0;n--){const s=this.peds[n];s.update(t);const a=bt(s.x,s.z,i.x,i.z);(s.dead&&s.deadT>25||a>230&&!s.important)&&!s.vehicle&&s.kind!=="cop"&&(s.dispose(),this.peds.splice(n,1))}}spawnOne(){const t=this.game,e=t.city,i=t.player,n=t.rig.forward(new D);for(let s=0;s<6;s++){const a=He(e.blocks),o=[{x:a.x0-1.5,z:a.z0-1.5},{x:a.x1+1.5,z:a.z0-1.5},{x:a.x1+1.5,z:a.z1+1.5},{x:a.x0-1.5,z:a.z1+1.5}],l=He(o),c=Math.random(),h=He(o),u=l.x+(h.x-l.x)*c,f=l.z+(h.z-l.z)*c,d=bt(u,f,i.x,i.z);if(d<45||d>170||((u-i.x)*n.x+(f-i.z)*n.z)/d>.35&&d<90)continue;const p=a.hoodGang&&a.type!=="park"&&Math.random()<.35?new xn(t,u,f,{kind:"gang",gangColor:9323693}):new xn(t,u,f);return this.peds.push(p),p}return null}alertGang(t){for(const e of this.peds)e.kind==="gang"&&!e.dead&&bt(e.x,e.z,t.x,t.z)<40&&(e.hostile=!0,e.hostileT=25)}spawnDriver(t){const e=Math.sin(t.heading),i=Math.cos(t.heading),n=new xn(this.game,t.x+i*(t.halfW+.9),t.z-e*(t.halfW+.9));return n.heading=t.heading-Math.PI/2,n.vx=i*2.5,n.vz=-e*2.5,n.syncMesh(),this.peds.push(n),n}panicAround(t,e,i,n=6){for(const s of this.peds)bt(s.x,s.z,t,e)<i&&s.panic(t,e,n)}}const mo=new D,Kr=new D,jr=new D,Vs=new D;class cv{constructor(t){this.game=t,this.kind="player",this.char=new hl({kind:"player"}),t.scene.add(this.char.group),this.x=0,this.y=0,this.z=0,this.heading=0,this.vy=0,this.onGround=!0,this.radius=Ke.RADIUS,this.vx=0,this.vz=0,this.speed=0,this.moveX=0,this.moveZ=0,this.health=Ke.MAX_HEALTH,this.armor=0,this.money=250,this.dead=!1,this.deadT=0,this.busted=!1,this.vehicle=null,this.aiming=!1,this.fireT=0,this.punchT=0,this.knockT=0,this.enterT=0,this.wantedVehicle=null,this.ammo={pistol:60},this.currentWeapon="pistol",this.weaponSwitchT=0,this.lastCrimeT=0,this.swimming=!1,this.invulnT=0,this.respawnT=0,this.damageFlash=0,this.stats={kills:0,carsStolen:0,missions:0},this.talkT=0}get pos(){return{x:this.x,y:this.y,z:this.z}}get absSpeed(){return this.vehicle?this.vehicle.absSpeed:Math.hypot(this.vx,this.vz)}has(t){return t==="fist"||(this.ammo[t]??0)>0}giveWeapon(t,e){this.ammo[t]=(this.ammo[t]||0)+e,(this.currentWeapon==="fist"||this.currentWeapon===t)&&(this.currentWeapon=t)}cycleWeapon(t){const e=Yr.filter(n=>this.has(n));let i=e.indexOf(this.currentWeapon);i<0&&(i=0),i=(i+t+e.length)%e.length,this.currentWeapon=e[i],this.weaponSwitchT=2,this.game.audio.ui()}setPosition(t,e,i=0){this.x=t,this.z=e,this.y=this.game.city.groundHeight(t,e),this.heading=i,this.vx=this.vz=0,this.syncMesh()}syncMesh(){this.vehicle||(this.char.group.position.set(this.x,this.y,this.z),this.char.group.rotation.y=this.heading)}takeDamage(t,e,i="bullet"){if(!(this.dead||this.invulnT>0)){if(this.armor>0){const n=Math.min(this.armor,t*.7);this.armor-=n,t-=n}this.health-=t,this.damageFlash=1,this.sinceHurt=0,this.game.rig.addShake(.2+Math.min(.5,t/40)),this.game.input.rumble?.(.7,.5,150),i==="bullet"&&this.game.effects.blood(this.x,this.y+1,this.z,4),this.health<=0&&this.die()}}knock(t,e,i){this.dead||(this.vx=t,this.vz=e,this.vy=4,this.knockT=1.6,this.char.state.dead=!0,this.char.deadT=0,this.char.deadDir=1,this.game.audio.thud(),this.takeDamage(i,null,"impact"))}die(){this.dead||(this.dead=!0,this.deadT=0,this.char.state.dead=!0,this.char.deadT=0,this.aiming=!1,this.vehicle&&this.exitVehicle(!0),this.game.onPlayerWasted())}arrest(){this.dead||this.busted||(this.busted=!0,this.deadT=0,this.vehicle&&this.exitVehicle(!0),this.game.onPlayerBusted())}respawn(t,e,i){this.dead=!1,this.busted=!1,this.knockT=0,this.char.state.dead=!1,this.char.deadT=0,this.health=Ke.MAX_HEALTH,this.invulnT=2,this.setPosition(t,e,i),this.game.rig.snapBehind(i)}update(t){const e=this.game,i=e.input;if(this.invulnT=Math.max(0,this.invulnT-t),this.damageFlash=Math.max(0,this.damageFlash-t*2),this.weaponSwitchT=Math.max(0,this.weaponSwitchT-t),this.sinceHurt=(this.sinceHurt||0)+t,!this.dead&&this.sinceHurt>5&&this.health<50&&(this.health=Math.min(50,this.health+4*t)),this.dead||this.busted){this.deadT+=t,this.updateBody(t,!0);return}if(i.mouse.wheel!==0&&this.cycleWeapon(i.mouse.wheel>0?1:-1),(i.hit("nextWeapon")||i.hit("dUp"))&&this.cycleWeapon(1),(i.hit("prevWeapon")||i.hit("dDown"))&&this.cycleWeapon(-1),!e.stores.shopOpen)for(let n=0;n<Yr.length;n++)i.hitCode("Digit"+(n+1))&&this.has(Yr[n])&&(this.currentWeapon=Yr[n],this.weaponSwitchT=2);this.fireT=Math.max(0,this.fireT-t),this.vehicle?this.updateInVehicle(t):this.updateOnFoot(t)}updateOnFoot(t){const e=this.game,i=e.input,n=e.city,s=this.char.state;if(this.enterT>0){this.enterT-=t,this.enterT<=0&&this.wantedVehicle&&this.finishEnter(),this.updateBody(t,!1,0);return}if(i.hit("enter")){const C=this.nearestVehicle(4.5);C&&this.beginEnter(C)}if(i.hit("interact")&&!e.stores.shopOpen){const C=this.nearestPed(2.6);C&&C.talk(this)&&(this.talkT=3,setTimeout(()=>{this.dead||e.hud.speak(this,["Hey.","What's up?","Sup.","Sure.","Alright then.","Yeah, yeah."][Math.floor(Math.random()*6)],2e3)},1200))}if(this.knockT>0){this.knockT-=t,this.updateBody(t,!0),this.knockT<=0&&(s.dead=!1);return}const a=e.rig.forward(mo),o=-a.z,l=a.x,c=i.footMove?i.footMove():{x:i.axis("left","right"),y:i.axis("back","forward")},h=c.x,u=c.y;let f=a.x*u+o*h,d=a.z*u+l*h;const g=Math.hypot(f,d);g>1&&(f/=g,d/=g);const x=this.aiming;this.aiming=(i.aiming??i.mouse.right)&&this.currentWeapon!=="fist",this.aiming?this.aimAssist(t,!x):e.aimTarget=null,this.firePoseT=Math.max(0,(this.firePoseT||0)-t),this.char.setWeapon(this.currentWeapon),this.swimming=n.isWater(this.x,this.z);const p=i.down("sprint")&&!this.aiming&&!this.swimming,m=Math.min(1,c.mag??g),y=this.swimming?Ke.SWIM:this.aiming?Ke.WALK*1.3:p?Ke.SPRINT:Ke.RUN*(.45+.55*m),M=f*y,v=d*y,b=this.onGround?Ke.ACCEL:8;this.vx=de(this.vx,M,b/3,t),this.vz=de(this.vz,v,b/3,t),this.aiming||this.firePoseT>0?this.heading=Li(this.heading,Math.atan2(a.x,a.z),20,t):g>.1&&(this.heading=Li(this.heading,Math.atan2(f,d),12,t));const _=n.groundHeight(this.x,this.z);if(this.swimming?(this.y=de(this.y,-1.1,6,t),this.onGround=!0,this.vy=0):(this.onGround&&i.hit("jump")&&(this.vy=Ke.JUMP,this.onGround=!1),this.vy-=Ke.GRAVITY*t,this.y+=this.vy*t,this.y<=_?(this.y=_,this.vy=0,this.onGround=!0):this.onGround=!1),this.x+=this.vx*t,this.z+=this.vz*t,fa(n.hash,this,this.radius,2,this.y),Mu(this,e.vehicles,(C,w,S,P)=>{this.knockT<=0&&this.invulnT<=0&&(this.knock(C.vx*.9+S*2,C.vz*.9+P*2,w*3),C.driver?.kind==="cop"&&e.police.noteRam())}),!e.stores.interior){const C=Ne.WORLD_R;this.x=ie(this.x,-C,C),this.z=ie(this.z,-C,C)}this.updateCombat(t,a);const T=Math.hypot(this.vx,this.vz);s.move=de(s.move,ie(T/Ke.WALK,0,1),12,t),s.run=de(s.run,ie((T-Ke.WALK)/(Ke.SPRINT-Ke.WALK),0,1),8,t),s.aiming=this.aiming,s.firePose=this.firePoseT,s.aimPitch=-e.rig.pitch+.05,s.airborne=!this.onGround&&!this.swimming,s.swim=this.swimming,s.hasWeapon=this.currentWeapon!=="fist",s.weaponLong=!!Pi[this.currentWeapon].long,s.sitting=!1,this.punchT=Math.max(0,this.punchT-t*3),s.punch=this.punchT,this.char.animate(t),this.syncMesh(),this.speed=T}updateCombat(t,e){const i=this.game,n=i.input,s=Pi[this.currentWeapon],a=this.vehicle?n.vehicleFiring??n.mouse.left:n.firing??n.mouse.left,o=this.vehicle?n.vehicleFiringPressed??n.mouse.leftPressed:n.firingPressed??n.mouse.leftPressed;if(!(s.auto?a:o)||this.fireT>0)return;if(s.melee){this.fireT=s.rate,this.punchT=1,i.audio.punch();for(const u of[...i.peds]){if(u.dead||bt(u.x,u.z,this.x,this.z)>2)continue;const d=Math.atan2(u.x-this.x,u.z-this.z);if(!(Math.abs(cr(d-this.heading))>1)){u.hurt(s.damage,this,jr.set(Math.sin(this.heading),0,Math.cos(this.heading))),u.vx=Math.sin(this.heading)*3,u.vz=Math.cos(this.heading)*3,i.effects.blood(u.x,u.y+1.2,u.z,3),i.crime("assault",this.x,this.z);break}}return}if((this.ammo[this.currentWeapon]||0)<=0){this.currentWeapon="fist";return}this.fireT=s.rate,this.ammo[this.currentWeapon]--;const c=i.camera;jr.set(0,0,-1).applyQuaternion(c.quaternion);const h=Bn(i,c.position,jr,s.range+10,this);!this.vehicle&&!this.aiming&&(this.firePoseT=.7),this.vehicle||(this.char.state.aimPitch=-i.rig.pitch+.05,this.char.state.firePose=1,this.char.animate(.05)),this.char.group.updateMatrixWorld(!0),this.char.muzzle.getWorldPosition(Kr),this.vehicle&&Kr.set(this.x+Math.sin(this.heading)*.3,this.y+1.2,this.z+Math.cos(this.heading)*.3),Vs.copy(h.point).sub(Kr),Vs.length()<1.5&&Vs.copy(jr),Vs.normalize(),nv(i,this,this.currentWeapon,Kr.clone(),Vs),i.rig.recoil+=s.recoil*.06,i.rig.addShake(s.recoil*.15),i.input.rumble?.(Math.min(1,.25+s.recoil*.25),.2,90),i.crime("gunfire",this.x,this.z),this.ammo[this.currentWeapon]<=0&&setTimeout(()=>{this.ammo[this.currentWeapon]<=0&&(this.currentWeapon="fist")},300)}updateBody(t,e,i){const n=this.game.city;if(e){this.vy-=Ke.GRAVITY*t,this.y+=this.vy*t;const s=n.groundHeight(this.x,this.z);this.y<s&&(this.y=s,this.vy=0,this.vx*=.5,this.vz*=.5),this.x+=this.vx*t,this.z+=this.vz*t,this.vx*=Math.exp(-3*t),this.vz*=Math.exp(-3*t),fa(n.hash,this,this.radius,2,this.y)}this.char.animate(t),this.syncMesh()}nearestPed(t){let e=null,i=t;for(const n of this.game.peds){if(n.dead||n.vehicle)continue;const s=bt(n.x,n.z,this.x,this.z);s<i&&(i=s,e=n)}return e}aimAssist(t,e){const i=this.game,n=i.rig,s=n.forward(mo);let a=null,o=e?.94:.985;for(const g of i.peds){if(g.dead||g.vehicle)continue;const x=g.x-this.x,p=g.z-this.z,m=Math.hypot(x,p);if(m<1.5||m>45)continue;const M=(x*s.x+p*s.z)/m-m*8e-4;M>o&&(o=M,a=g)}if(i.aimTarget=a,!a)return;const l=Math.atan2(-(a.x-n.pos.x),-(a.z-n.pos.z)),c=a.y+1.1-n.pos.y,h=Math.hypot(a.x-n.pos.x,a.z-n.pos.z),u=-Math.atan2(c,h),f=Math.abs(i.input.mouse.dx)+Math.abs(i.input.mouse.dy)>2,d=e?40:f?1.5:6;n.yaw=Li(n.yaw,l,d,t),n.pitch=te(n.pitch,ie(u,-.35,.9),1-Math.exp(-d*t))}setOutfit(t,e){const i=this.char,n=!!this.vehicle;this.char=new hl({kind:"player",shirt:t,pants:e,weapon:i.gunKey}),this.char.state=i.state,this.char.phase=i.phase,i.dispose(),(n?this.vehicle.seat:this.game.scene).add(this.char.group),n||this.syncMesh()}nearestVehicle(t){let e=null,i=t;for(const n of this.game.vehicles){const s=bt(n.x,n.z,this.x,this.z)-n.halfW;s<i&&!n.destroyed&&(i=s,e=n)}return e}beginEnter(t){if(this.wantedVehicle=t,this.enterT=.45,this.aiming=!1,this.heading=Math.atan2(t.x-this.x,t.z-this.z),t.driver&&t.driver!==this){const e=t.driver;e.exitVehicle(),e.panic(this.x,this.z,8),e.kind==="cop"&&this.game.police.onCopHurt(e,this),this.game.crime("carjack",t.x,t.z),this.stats.carsStolen++,this.enterT=.8}else(t.control==="ai"||t.control==="cop")&&(this.game.traffic.release(t),t.control="none",t.throttle=0,t.brake=1,this.game.pedsMgr.spawnDriver(t).panic(this.x,this.z,8),this.game.crime("carjack",t.x,t.z),this.stats.carsStolen++,this.enterT=.8)}finishEnter(){const t=this.wantedVehicle;this.wantedVehicle=null,!(!t||t.destroyed)&&(this.game.traffic.release(t),this.game.police.release(t),this.vehicle=t,t.driver=this,t.control="player",t.isParked=!1,t.abandoned=!1,t.seat.add(this.char.group),this.char.group.position.set(0,0,0),this.char.group.rotation.set(0,0,0),this.char.state.sitting=!0,this.char.state.aiming=!1,this.char.state.hasWeapon=!1,this.game.rig.snapBehind(t.heading),this.game.audio.setRadio(!0),this.game.onEnterVehicle(t))}exitVehicle(t=!1){const e=this.vehicle;if(!e)return;const i=e.absSpeed>9;this.vehicle=null,e.driver=null,e.control="none",e.throttle=0,e.brake=i?0:.3,e.steerInput=0,e.handbrake=!1,e.setLights(!1),e.sirenOn=!1,i||(e.vx=e.vz=0,e.angVel=0),e.abandoned=!0,this.invulnT=Math.max(this.invulnT,.6),this.game.scene.add(this.char.group),this.char.state.sitting=!1;const n=Math.sin(e.heading),s=Math.cos(e.heading);this.x=e.x+s*(e.halfW+.9),this.z=e.z-n*(e.halfW+.9),this.y=this.game.city.groundHeight(this.x,this.z),this.heading=e.heading,i&&!t&&this.knock(e.vx*.5,e.vz*.5,e.absSpeed*1.2),this.game.audio.setRadio(!1),this.game.onExitVehicle(e),this.syncMesh()}updateInVehicle(t){const e=this.game,i=e.input,n=this.vehicle;if(n.destroyed){this.takeDamage(200,null,"explosion");return}if(i.hit("enter")){this.exitVehicle();return}const s=i.drive?i.drive():{throttle:i.down("forward")?1:0,brake:i.down("back")?1:0,steer:-i.axis("left","right")};n.throttle=s.throttle,n.brake=s.brake,n.steerInput=s.steer,n.handbrake=i.down("handbrake"),i.hit("horn")&&e.audio.horn(!0),i.down("horn")||e.audio.horn(!1),i.hit("radio")&&e.notify("📻 "+e.audio.nextStation(),1800),n.setLights(e.night>.35),(n.type.cop||n.type.ems)&&(n.sirenOn=!0),this.aiming=!1;const a=e.rig.forward(mo);this.currentWeapon!=="fist"&&!Pi[this.currentWeapon].long&&(this.char.state.hasWeapon=i.vehicleFiring??i.mouse.left,this.updateCombat(t,a)),this.x=n.x,this.z=n.z,this.y=n.y,this.heading=n.heading,this.vx=n.vx,this.vz=n.vz,this.speed=n.absSpeed,this.char.state.sitting=!0,this.char.animate(t)}}const In={sedan:{len:4.5,wid:1.85,mass:1300,maxSpeed:38,accel:9,brake:22,grip:7.5,steer:.55,wheelR:.34,cls:"sedan",colors:[12597547,2719929,15528177,2899536,8359053,2600544,9323693,15965202,1710618,13849600],profile:[[-2.25,.3],[-2.25,.78],[-1.85,.84],[-1.35,.86],[-.85,1.36],[.55,1.4],[1.25,.96],[2.05,.86],[2.25,.55],[2.25,.3]],cabin:[[-1.35,.86],[-.85,1.36],[.55,1.4],[1.25,.96]]},executive:{base:"sedan",len:4.9,maxSpeed:41,accel:9.5,mass:1550,cls:"sedan",colors:[1710618,2899536,15528177,6111287,727610],profile:[[-2.45,.3],[-2.45,.78],[-2,.84],[-1.4,.86],[-.9,1.34],[.7,1.38],[1.5,.94],[2.25,.84],[2.45,.55],[2.45,.3]],cabin:[[-1.4,.86],[-.9,1.34],[.7,1.38],[1.5,.94]]},reverie:{len:4.4,wid:1.9,mass:1350,maxSpeed:44,accel:11,brake:24,grip:8.2,steer:.53,wheelR:.33,cls:"coupe",colors:[16723245,1118481,15528177,2719929,9323693,15965202],profile:[[-2.2,.32],[-2.2,.72],[-1.8,.8],[-1,.84],[-.4,1.28],[.5,1.3],[1.2,.9],[2,.8],[2.2,.5],[2.2,.32]],cabin:[[-1,.84],[-.4,1.28],[.5,1.3],[1.2,.9]]},seraph:{base:"reverie",len:4.6,maxSpeed:47,accel:12,mass:1450,cls:"coupe",colors:[727610,6111287,12632256,1710618,7997962],profile:[[-2.3,.3],[-2.3,.7],[-1.9,.78],[-1.1,.82],[-.5,1.24],[.6,1.26],[1.4,.88],[2.1,.78],[2.3,.48],[2.3,.3]],cabin:[[-1.1,.82],[-.5,1.24],[.6,1.26],[1.4,.88]]},sports:{len:4.4,wid:1.95,mass:1200,maxSpeed:52,accel:14,brake:26,grip:9.5,steer:.5,wheelR:.33,cls:"sports",colors:[16723245,16766464,49919,16777215,1118481,16742912,10181046],profile:[[-2.2,.3],[-2.2,.72],[-1.7,.8],[-1.1,.82],[-.5,1.15],[.6,1.18],[1.3,.8],[2.1,.66],[2.2,.45],[2.2,.3]],cabin:[[-1.1,.82],[-.5,1.15],[.6,1.18],[1.3,.8]]},kestrel:{base:"sports",len:4.35,maxSpeed:54,accel:14.5,cls:"sports",colors:[49919,16742912,1118481,15528177,3066993],profile:[[-2.17,.28],[-2.17,.66],[-1.6,.76],[-1,.8],[-.3,1.1],[.7,1.12],[1.35,.78],[2.05,.62],[2.17,.42],[2.17,.28]],cabin:[[-1,.8],[-.3,1.1],[.7,1.12],[1.35,.78]]},vortex:{len:4.5,wid:2,mass:1150,maxSpeed:60,accel:17,brake:28,grip:10.5,steer:.46,wheelR:.32,cls:"super",colors:[16766464,16723245,1118481,49919,16742912],profile:[[-2.25,.26],[-2.25,.6],[-1.7,.68],[-.9,.72],[-.2,1.02],[.5,1.04],[1.2,.72],[2,.6],[2.25,.4],[2.25,.26]],cabin:[[-.9,.72],[-.2,1.02],[.5,1.04],[1.2,.72]]},scalpel:{base:"vortex",len:4.45,maxSpeed:62,accel:18,mass:1100,grip:11,cls:"super",colors:[1118481,9323693,15528177,16723245,727610],profile:[[-2.22,.24],[-2.22,.55],[-1.5,.62],[-.6,.68],[0,.98],[.6,1],[1.1,.7],[1.9,.58],[2.22,.36],[2.22,.24]],cabin:[[-.6,.68],[0,.98],[.6,1],[1.1,.7]]},stiletto:{base:"vortex",len:4.3,maxSpeed:55,accel:15,mass:1250,cls:"super",colors:[7997962,12632256,6111287,1710618,727610],profile:[[-2.15,.3],[-2.15,.62],[-1.7,.7],[-.9,.74],[-.3,1.05],[.4,1.06],[1,.74],[1.9,.62],[2.15,.42],[2.15,.3]],cabin:[[-.9,.74],[-.3,1.05],[.4,1.06],[1,.74]]},solair:{base:"sports",cls:"cabrio",open:!0,maxSpeed:50,colors:[16766464,16777215,16723245,49919,16742912],profile:[[-2.2,.3],[-2.2,.7],[-1.7,.78],[-1.1,.8],[-.5,.92],[.6,.94],[1.3,.8],[2.1,.66],[2.2,.45],[2.2,.3]],cabin:[[-1.1,.8],[-.5,.92],[.6,.94],[1.3,.8]]},bella:{base:"seraph",cls:"cabrio",open:!0,maxSpeed:42,accel:10,colors:[7997962,15528177,6111287,727610,3033722],profile:[[-2.3,.3],[-2.3,.68],[-1.9,.76],[-1.1,.8],[-.5,.9],[.6,.92],[1.4,.86],[2.1,.76],[2.3,.46],[2.3,.3]],cabin:[[-1.1,.8],[-.5,.9],[.6,.92],[1.4,.86]]},bruiser:{len:4.6,wid:1.95,mass:1500,maxSpeed:46,accel:13,brake:22,grip:7.8,steer:.52,wheelR:.35,cls:"muscle",colors:[1710618,7997962,727610,6111287,2829099,16742912],profile:[[-2.3,.3],[-2.3,.8],[-1.9,.9],[-1.3,.92],[-.7,1.32],[.5,1.34],[1.1,.98],[2,.9],[2.3,.6],[2.3,.3]],cabin:[[-1.3,.92],[-.7,1.32],[.5,1.34],[1.1,.98]]},howler:{base:"bruiser",len:4.5,maxSpeed:48,accel:14,cls:"muscle",colors:[16766464,1118481,3066993,12597547,15528177],profile:[[-2.25,.3],[-2.25,.82],[-1.8,.92],[-1.2,.94],[-.6,1.3],[.5,1.32],[1,.96],[1.95,.88],[2.25,.58],[2.25,.3]],cabin:[[-1.2,.94],[-.6,1.3],[.5,1.32],[1,.96]]},razor:{base:"bruiser",len:4.4,maxSpeed:44,accel:12,mass:1400,cls:"muscle",colors:[2899536,9079434,1710618,7997962,727610],profile:[[-2.2,.32],[-2.2,.78],[-1.8,.88],[-1.2,.9],[-.6,1.28],[.4,1.3],[1,.94],[1.9,.86],[2.2,.56],[2.2,.32]],cabin:[[-1.2,.9],[-.6,1.28],[.4,1.3],[1,.94]]},luz:{len:4.7,wid:1.9,mass:1450,maxSpeed:40,accel:10,brake:21,grip:7.2,steer:.55,wheelR:.33,cls:"lowrider",colors:[9323693,2600544,12597547,2719929,15844367,15528177],profile:[[-2.35,.26],[-2.35,.72],[-1.9,.8],[-1.2,.84],[-.6,1.28],[.6,1.3],[1.3,.9],[2.05,.82],[2.35,.52],[2.35,.26]],cabin:[[-1.2,.84],[-.6,1.28],[.6,1.3],[1.3,.9]]},majestic:{base:"luz",len:4.6,maxSpeed:42,accel:10.5,cls:"lowrider",colors:[1710618,6111287,727610,7997962,2829099],profile:[[-2.3,.26],[-2.3,.74],[-1.85,.82],[-1.15,.86],[-.55,1.26],[.55,1.28],[1.25,.88],[2,.8],[2.3,.5],[2.3,.26]],cabin:[[-1.15,.86],[-.55,1.26],[.55,1.28],[1.25,.88]]},regal:{len:4.8,wid:1.9,mass:1500,maxSpeed:36,accel:8,brake:19,grip:6.8,steer:.55,wheelR:.36,cls:"classic",colors:[6111287,3033722,1710618,7997962,15528177,7162945],profile:[[-2.4,.32],[-2.4,.7],[-2,.82],[-1.3,.86],[-.7,1.3],[.5,1.32],[1.2,.92],[2,.84],[2.4,.55],[2.4,.32]],cabin:[[-1.3,.86],[-.7,1.3],[.5,1.32],[1.2,.92]]},suv:{len:4.8,wid:2,mass:2e3,maxSpeed:34,accel:8,brake:20,grip:6.5,steer:.5,wheelR:.4,cls:"suv",colors:[2899536,1710618,15528177,7162945,5597999,8359053],profile:[[-2.4,.4],[-2.4,1.1],[-2.3,1.85],[-2,1.9],[1,1.9],[1.5,1.2],[2.3,1.1],[2.4,.6],[2.4,.4]],cabin:[[-2.3,1.1],[-2.25,1.82],[1,1.82],[1.45,1.2]]},monarch:{base:"suv",len:5,maxSpeed:37,accel:9,mass:2200,cls:"suv",colors:[1710618,15528177,727610,6111287,12632256],profile:[[-2.5,.4],[-2.5,1.15],[-2.4,1.92],[-2,1.97],[1.1,1.97],[1.6,1.25],[2.4,1.15],[2.5,.6],[2.5,.4]],cabin:[[-2.4,1.15],[-2.35,1.9],[1.1,1.9],[1.55,1.25]]},golem:{base:"suv",len:4.9,maxSpeed:33,accel:8.5,grip:7,wheelR:.46,cls:"offroad",colors:[5597999,7162945,8359053,12597547,1710618],profile:[[-2.45,.5],[-2.45,1.2],[-2.35,1.95],[-2,2],[1,2],[1.5,1.3],[2.35,1.2],[2.45,.7],[2.45,.5]],cabin:[[-2.35,1.2],[-2.3,1.92],[1,1.92],[1.45,1.3]]},dune:{len:5.1,wid:2,mass:1900,maxSpeed:35,accel:9,brake:19,grip:7,steer:.52,wheelR:.46,cls:"offroad",colors:[12597547,15965202,2600544,15528177,2899536],profile:[[-2.55,.5],[-2.55,1.2],[-.4,1.2],[-.4,1.9],[.8,1.9],[1.4,1.25],[2.45,1.15],[2.55,.65],[2.55,.5]],cabin:[[-.35,1.25],[-.35,1.83],[.8,1.83],[1.35,1.3]]},pickup:{len:5.2,wid:2,mass:1900,maxSpeed:36,accel:8.5,brake:20,grip:6.5,steer:.5,wheelR:.4,cls:"pickup",colors:[12597547,2899536,15528177,7162945,8359053],profile:[[-2.6,.45],[-2.6,1.15],[-.3,1.15],[-.3,1.85],[.9,1.85],[1.5,1.2],[2.5,1.1],[2.6,.6],[2.6,.45]],cabin:[[-.25,1.2],[-.25,1.78],[.9,1.78],[1.45,1.2]]},van:{len:5,wid:2,mass:2200,maxSpeed:30,accel:6,brake:18,grip:6,steer:.45,wheelR:.38,cls:"van",colors:[15528177,12436423,2719929,12597547,15844367],profile:[[-2.5,.4],[-2.5,2.1],[.9,2.1],[1.6,1.25],[2.4,1.15],[2.5,.6],[2.5,.4]],cabin:[[.7,1.3],[.9,2],[.95,2],[1.55,1.3]]},carrier:{base:"van",len:5.4,maxSpeed:28,accel:5.5,mass:2500,cls:"van",colors:[15528177,8359053,2899536,9323693,2600544],profile:[[-2.7,.4],[-2.7,2.2],[.8,2.2],[1.5,1.3],[2.5,1.2],[2.7,.6],[2.7,.4]],cabin:[[.6,1.35],[.8,2.1],[.85,2.1],[1.45,1.35]]},hauler:{len:7.5,wid:2.4,mass:6e3,maxSpeed:28,accel:4,brake:16,grip:5.5,steer:.4,wheelR:.45,cls:"truck",colors:[12597547,2719929,15528177,1710618,2600544],profile:[[-3.75,.5],[-3.75,2.6],[-.5,2.6],[-.5,1.1],[1.3,1.1],[1.6,2.3],[2.9,2.3],[3.5,1.2],[3.75,.6],[3.75,.5]],cabin:[[1.6,1.15],[1.7,2.2],[2.85,2.2],[3.4,1.2]]},refuse:{base:"hauler",len:7,maxSpeed:26,cls:"service",colors:[2600544,15528177,8359053],profile:[[-3.5,.5],[-3.5,2.5],[-.6,2.5],[-.6,1.1],[1.2,1.1],[1.5,2.2],[2.8,2.2],[3.3,1.2],[3.5,.6],[3.5,.5]],cabin:[[1.5,1.15],[1.6,2.1],[2.75,2.1],[3.2,1.2]]},hook:{base:"hauler",len:6.8,maxSpeed:30,accel:5,cls:"service",colors:[15965202,1710618,12597547],profile:[[-3.4,.5],[-3.4,1],[-.8,1],[-.8,1.1],[1.2,1.1],[1.5,2.2],[2.7,2.2],[3.2,1.2],[3.4,.6],[3.4,.5]],cabin:[[1.5,1.15],[1.6,2.1],[2.65,2.1],[3.1,1.2]]},coach:{len:9,wid:2.5,mass:8e3,maxSpeed:30,accel:4,brake:15,grip:5,steer:.38,wheelR:.45,cls:"bus",colors:[2719929,15528177,2600544,15965202,9323693],profile:[[-4.5,.5],[-4.5,2.4],[-4.2,2.7],[3.6,2.7],[4.3,1.6],[4.5,.6],[4.5,.5]],cabin:[[-4.2,1.2],[-4.1,2.55],[3.5,2.55],[4.1,1.3]]},taxi:{base:"sedan",colors:[16106776],maxSpeed:40,cls:"sedan",taxi:!0},cabbie:{base:"van",colors:[16106776],maxSpeed:32,cls:"van",taxi:!0,profile:[[-2.5,.4],[-2.5,2.1],[.9,2.1],[1.6,1.25],[2.4,1.15],[2.5,.6],[2.5,.4]],cabin:[[.7,1.3],[.9,2],[.95,2],[1.55,1.3]]},police:{base:"sedan",colors:[16053492],maxSpeed:50,accel:13.5,grip:9,mass:1500,cls:"sedan",cop:!0},interceptor:{base:"sports",colors:[727610],maxSpeed:56,accel:15,grip:10,mass:1300,cls:"sports",cop:!0},warden:{base:"suv",colors:[1710618],maxSpeed:42,accel:10,grip:7.5,mass:2100,cls:"suv",cop:!0},pulse:{base:"van",colors:[16777215],maxSpeed:38,accel:8,cls:"van",ems:"amb",profile:[[-2.5,.4],[-2.5,2.2],[.9,2.2],[1.6,1.3],[2.4,1.2],[2.5,.6],[2.5,.4]],cabin:[[.7,1.35],[.9,2.1],[.95,2.1],[1.55,1.35]]},inferno:{base:"hauler",len:7.2,colors:[12597547],maxSpeed:34,accel:6,cls:"truck",ems:"fire",profile:[[-3.6,.5],[-3.6,2.4],[-.6,2.4],[-.6,1.1],[1.3,1.1],[1.6,2.2],[2.8,2.2],[3.4,1.2],[3.6,.6],[3.6,.5]],cabin:[[1.6,1.15],[1.7,2.1],[2.75,2.1],[3.3,1.2]]}};for(const r in In){const t=In[r];t.base?In[r]={...In[t.base],...t,name:r}:t.name=r}const Su=new Et({color:1715260,roughness:.1,metalness:.8,transparent:!0,opacity:.55}),ul=new Et({color:1381653,roughness:.95}),wu=new Et({color:11449530,roughness:.35,metalness:.9}),se=new Et({color:1842978,roughness:.5,metalness:.4}),Be=new Et({color:14147043,roughness:.15,metalness:1}),bu=new Et({color:16751130,emissive:16747520,emissiveIntensity:.7,roughness:.3}),Ys=new Et({color:15921902,roughness:.6}),Dn=new Et({color:858150,roughness:.08,metalness:.9}),hs=new Et({color:2303531,roughness:.9}),di=new Map;function Yi(r,t){if(!di.has(r)){const e=t();e.userData.shared=!0,di.set(r,e)}return di.get(r)}const _u=()=>Yi("box1",()=>new Il(1,1,1,2,.1)),go=(r,t,e=12)=>Yi(`cylx_${r}_${t}`,()=>{const i=new Zt(r,r,t,e);return i.rotateX(Math.PI/2),i});function Ie(r,t,e,i=.03){const n=`rb${r},${t},${e},${i}`;if(!di.has(n)){const s=new Il(r,t,e,2,Math.min(i,Math.min(r,t,e)*.4));s.userData.shared=!0,di.set(n,s)}return di.get(n)}for(const r of[Su,ul,wu,se,Be,bu,Ys,Dn,hs,_u()])r.userData.shared=!0;function yh(r,t,e,i,n){const s=r.name+t+i;if(di.has(s))return di.get(s);const a=new uu;e.forEach((l,c)=>c===0?a.moveTo(l[0],l[1]):a.lineTo(l[0],l[1]));const o=new Dl(a,{depth:i,bevelEnabled:n,bevelThickness:.08,bevelSize:.08,bevelSegments:3,curveSegments:3});return o.rotateY(-Math.PI/2),o.translate(i/2,0,0),o.computeVertexNormals(),o.userData.shared=!0,di.set(s,o),o}let hv=0;class uv{constructor(t,e){const i=this.type=In[t]||In.sedan;this.id=hv++,this.typeName=i.name,this.color=e??He(i.colors),this.x=0,this.z=0,this.y=0,this.heading=0,this.vx=0,this.vz=0,this.vy=0,this.angVel=0,this.steer=0,this.throttle=0,this.brake=0,this.handbrake=!1,this.steerInput=0,this.health=100,this.destroyed=!1,this.onFire=!1,this.fireT=0,this.smokeT=0,this.driver=null,this.control="none",this.halfL=i.len/2,this.halfW=i.wid/2,this.wheelSpin=0,this.lastImpact=0,this.braking=!1,this.hornT=0,this.airT=0,this.sirenOn=!1,this.lightsOn=!1,this.owner=null,this.isParked=!1,this.stuckT=0,this.buildMesh()}buildMesh(){const t=this.type,e=this.group=new Ee;e.userData.vehicle=this;const i=this.body=new Ee;e.add(i),this.paint=new Et({color:this.color,roughness:.25,metalness:.6});const n=new G(yh(t,"body",t.profile,t.wid,!0),this.paint);n.castShadow=!0,n.receiveShadow=!0,i.add(n);const s=[...t.cabin,[t.cabin[t.cabin.length-1][0],t.cabin[0][1]]];if(!t.open){const tt=new G(yh(t,"cabin",s,t.wid+.04,!1),Su);tt.position.y=.005,i.add(tt)}const a=_u(),o=(tt,O,J,ht,st,Pt,kt,ot=0,mt=0,Z=0)=>{const at=new G(a,tt);return at.scale.set(O,J,ht),at.position.set(st,Pt,kt),at.rotation.set(ot,mt,Z),at.castShadow=!0,i.add(at),at},l=t.cabin.map(tt=>tt[0]),c=t.cabin.map(tt=>tt[1]),h=Math.max(...l),u=Math.min(...l),f=(h+u)/2,d=h-u,g=Math.max(...c),x=Math.min(...c),p=(t.cabin[0][0]+t.cabin[t.cabin.length-1][0])/2-.2,m=.3+(t.cabin[0][1]-.86),y=(x+g)/2+.02,M=t.wid/2+.028,v=(tt,O,J,ht)=>({L:Math.hypot(tt-J,O-ht)+.08,rx:Math.atan2(tt-J,O-ht),z:(tt+J)/2,y:(O+ht)/2}),b=v(l[2],c[2],l[3],c[3]),_=v(l[1],c[1],l[0],c[0]);o(Dn,t.wid*.8,b.L,.03,0,b.y,b.z,b.rx),o(Dn,t.wid*.78,_.L,.03,0,_.y,_.z,_.rx);for(const tt of[-1,1])o(se,.07,b.L+.06,.07,tt*t.wid*.42,b.y,b.z,b.rx),o(Dn,.02,.3,d*.22,tt*M,y,f+d*.135),o(Dn,.02,.3,d*.22,tt*M,y,f-d*.135),o(se,.05,.34,.07,tt*M,y,f),t.cls==="bus"&&(o(se,.05,.5,.07,tt*M,y+.1,f+d*.3),o(se,.05,.5,.07,tt*M,y+.1,f-d*.3));o(se,t.wid*.86,.07,.09,0,c[2]-.02,l[2]+.02),t.open?o(se,t.wid*.8,.16,.5,0,x+.12,f-d*.28):!["pickup","truck","bus","van","service"].includes(t.cls)&&!t.ems&&o(Dn,t.wid*.44,.02,Math.min(.95,d*.4),0,g+.008,f+d*.08);const T=new G(Ie(t.wid+.06,.05,.08,.02),se);T.position.set(0,t.cabin[0][1]+.02,t.cabin[0][0]+.02),i.add(T);const C=(t.cabin[1][0]+t.cabin[2][0])/2,w=new G(Ie(t.wid+.06,Math.max(.1,t.cabin[1][1]-t.cabin[0][1]-.05),.08,.02),se);w.position.set(0,(t.cabin[1][1]+t.cabin[0][1])/2,C),i.add(w);for(const tt of[-1,1])o(Be,.03,.035,.13,tt*(t.wid/2+.012),.95,p+.62),o(Be,.03,.035,.13,tt*(t.wid/2+.012),.95,p-.62),o(se,.02,.09,t.len*.62,tt*(t.wid/2+.008),.55,0);const S=new G(Ie(t.wid*.98,.22,.12,.06),se);S.position.set(0,.42,t.len/2+.02),i.add(S);const P=S.clone();P.position.z=-t.len/2-.02,i.add(P);const z=new G(Ie(t.wid*.45,.16,.06,.02),se);z.position.set(0,.68,t.len/2+.03),i.add(z),o(Be,t.wid*.4,.025,.02,0,.71,t.len/2+.065),o(Be,t.wid*.4,.025,.02,0,.64,t.len/2+.065),o(Ys,.34,.1,.02,0,.42,t.len/2+.085),o(Ys,.34,.1,.02,0,.42,-t.len/2-.085),this.headMat=new Et({color:16774880,emissive:16773836,emissiveIntensity:.3,roughness:.2}),this.tailMat=new Et({color:9109504,emissive:16719888,emissiveIntensity:.4,roughness:.3});const I=t.profile[t.profile.length-3][1]+.05,U=t.profile[1][1]-.1;for(const tt of[-1,1]){const O=new G(Ie(.42,.16,.08,.05),this.headMat);O.position.set(tt*(t.wid/2-.32),I,t.len/2+.02),i.add(O),o(bu,.12,.1,.06,tt*(t.wid/2-.1),I,t.len/2+.02);const J=new G(Ie(.4,.14,.08,.05),this.tailMat);J.position.set(tt*(t.wid/2-.3),U,-t.len/2-.02),i.add(J);const ht=new G(Ie(.1,.1,.18,.03),this.paint);ht.position.set(tt*(t.wid/2+.08),t.cabin[0][1]+.1,t.cabin[t.cabin.length-1][0]-.1),i.add(ht)}o(this.tailMat,t.wid*.7,.09,.05,0,U,-t.len/2-.03);for(const tt of[-1,1]){const O=new G(go(.035,.18),Be);O.position.set(tt*.32,.24,-t.len/2-.06),i.add(O)}const X=new G(Yi("antenna",()=>new Zt(.008,.012,.5,6)),se);X.position.set(t.wid/2-.25,g+.25,-t.len/2+.7),i.add(X),this.headY=I,o(hs,.5,.14,.5,.38,m-.02,p),o(hs,.5,.14,.5,-.38,m-.02,p),o(hs,.5,.55,.16,.38,m+.3,p-.3),o(hs,.5,.55,.16,-.38,m+.3,p-.3),o(hs,t.wid-.5,.18,.4,0,m+.28,p+.95);const q=new G(Yi("swheel",()=>new Js(.16,.025,8,18)),se);q.position.set(.38,m+.42,p+.55),q.rotation.x=-.45,i.add(q),this.wheels=[];const $="wheel"+t.wheelR;if(!di.has($)){const tt=new Zt(t.wheelR,t.wheelR,.26,24);tt.rotateZ(Math.PI/2),tt.userData.shared=!0;const O=new Zt(t.wheelR*.6,t.wheelR*.6,.27,12);O.rotateZ(Math.PI/2),O.userData.shared=!0,di.set($,[tt,O])}const[B,ft]=di.get($),dt=Yi("hub"+t.wheelR,()=>{const tt=new Zt(t.wheelR*.22,t.wheelR*.22,.29,8);return tt.rotateZ(Math.PI/2),tt}),xt=Yi("lip"+t.wheelR,()=>{const tt=new Js(t.wheelR*.6,.028,8,20);return tt.rotateY(Math.PI/2),tt}),Gt=t.len*.32;for(const[tt,O]of[[-1,1],[1,1],[-1,-1],[1,-1]]){const J=new Ee;J.position.set(tt*(t.wid/2-.12),t.wheelR,O*Gt),e.add(J);const ht=new G(B,ul);ht.castShadow=!0,J.add(ht);const st=new G(ft,wu);J.add(st);const Pt=new G(dt,se);st.add(Pt);const kt=new G(xt,Be);if(st.add(kt),t.cls==="classic"||t.cls==="lowrider"){const ot=Yi("ww"+t.wheelR,()=>{const mt=new Js(t.wheelR*.72,.035,8,20);return mt.rotateY(Math.PI/2),mt});for(const mt of[-.1,.1]){const Z=new G(ot,Ys);Z.position.x=mt,st.add(Z)}}this.wheels.push({pivot:J,mesh:ht,rim:st,front:O>0}),o(se,.14,.16,.9,tt*(t.wid/2-.02),t.wheelR+.3,O*Gt)}if(this.wheelbase=Gt*2,t.cls==="sports"||t.cls==="super"){const tt=t.cls==="super"?1:1.12;o(se,.07,.2,.07,-(t.wid/2-.3),tt-.12,-t.len/2+.35),o(se,.07,.2,.07,t.wid/2-.3,tt-.12,-t.len/2+.35),o(t.cls==="super"?se:this.paint,t.wid*.88,.06,.35,0,tt,-t.len/2+.35)}if(t.cls==="muscle"){o(this.paint,.5,.12,.5,0,t.profile[t.profile.length-2][1]+.06,t.len*.28),o(se,.06,.06,.3,0,t.profile[t.profile.length-2][1]+.13,t.len*.28);for(const tt of[-1,1]){const O=new G(go(.045,t.len*.5),Be);O.position.set(tt*(t.wid/2+.02),.28,0),i.add(O)}o(this.paint,t.wid*.9,.07,.25,0,t.profile[1][1]+.08,-t.len/2+.2)}if(t.cls==="lowrider"){o(Be,t.wid*.9,.05,.05,0,.5,t.len/2+.06);for(const tt of[-1,1]){const O=new G(Yi("antenna",()=>new Zt(.008,.012,.5,6)),Be);O.position.set(tt*(t.wid/2-.15),g+.3,u+.2),i.add(O)}}if(t.cls==="classic"){for(const tt of[-1,1])o(Be,.02,.06,t.len*.7,tt*(t.wid/2+.01),.62,0);o(Be,t.wid*.9,.05,.05,0,.52,t.len/2+.06)}if((t.cls==="suv"||t.cls==="van"||t.cls==="offroad")&&(o(se,.06,.06,t.len*.5,-(t.wid/2-.4),g+.04,0),o(se,.06,.06,t.len*.5,t.wid/2-.4,g+.04,0)),t.cls==="offroad"){o(se,t.wid*.7,.09,.09,0,.7,t.len/2+.12),o(se,.09,.5,.09,-t.wid*.28,.7,t.len/2+.12),o(se,.09,.5,.09,t.wid*.28,.7,t.len/2+.12);const tt=new G(Yi("spare",()=>new Zt(.34,.34,.2,16)),ul);tt.position.set(0,g+.22,f-d*.2),i.add(tt)}if((t.cls==="pickup"||t.name==="dune")&&(o(se,t.wid-.5,.05,t.len*.3,0,t.profile[2][1]+.03,-t.len*.26),o(Be,.2,.03,.03,0,t.profile[1][1]+.05,-t.len/2-.03)),t.cls==="truck"&&!t.ems)for(let tt=0;tt<4;tt++)o(se,t.wid+.04,2,.08,0,1.55,-t.len/2+.6+tt*(t.len*.16));if(t.name==="hook"&&(o(se,t.wid-.4,.1,t.len*.42,0,1.02,-t.len*.2),o(Be,.08,.5,.5,0,.7,-t.len/2+.1)),t.cop){const tt=(t.cabin[1][0]+t.cabin[2][0])/2,O=new G(Ie(1.1,.14,.3,.05),se);O.position.set(0,t.cabin[1][1]+.07,tt),i.add(O),this.sirenR=new pe({color:16719904,toneMapped:!1}),this.sirenB=new pe({color:2121983,toneMapped:!1});const J=new G(Ie(.45,.14,.28,.05),this.sirenR);J.position.set(-.3,t.cabin[1][1]+.16,tt),i.add(J);const ht=new G(Ie(.45,.14,.28,.05),this.sirenB);ht.position.set(.3,t.cabin[1][1]+.16,tt),i.add(ht),this.sirenY=t.cabin[1][1]+.6;const st=new G(Ie(t.wid+.02,.35,t.len*.6,.05),new Et({color:727610,roughness:.3,metalness:.5}));st.position.set(0,.62,0),i.add(st),o(se,t.wid*.62,.09,.09,0,.55,t.len/2+.14),o(se,.09,.5,.09,-t.wid*.25,.55,t.len/2+.14),o(se,.09,.5,.09,t.wid*.25,.55,t.len/2+.14);const Pt=new G(go(.035,.14),Be);Pt.position.set(t.wid/2+.05,t.cabin[0][1]+.35,h-.1),i.add(Pt),t.name==="police"&&o(Dn,t.wid*.5,.3,.02,0,.78,t.len/2+.02)}if(t.taxi){const tt=new G(Ie(.7,.22,.3,.06),new Et({color:16777215,emissive:16770688,emissiveIntensity:.6}));tt.position.set(0,t.cabin[1][1]+.11,(t.cabin[1][0]+t.cabin[2][0])/2),i.add(tt);const O=new G(Ie(t.wid+.02,.18,t.len*.7,.04),new Et({color:1118481,roughness:.4}));O.position.set(0,.7,0),i.add(O)}if(t.ems==="amb"){const tt=new Et({color:12597547,roughness:.4});tt.userData.shared=!0,o(tt,t.wid+.03,.4,t.len*.7,0,.9,-.3),o(Ys,.5,.5,.03,t.wid/2+.02,1.4,-.6),o(tt,.34,.12,.04,t.wid/2+.02,1.4,-.6),o(tt,.12,.34,.04,t.wid/2+.02,1.4,-.6);const O=new G(Ie(1,.12,.26,.05),se);O.position.set(0,g+.05,f+.5),i.add(O),this.sirenR=new pe({color:16719904,toneMapped:!1}),this.sirenB=new pe({color:16719904,toneMapped:!1});const J=new G(Ie(.4,.12,.24,.05),this.sirenR);J.position.set(-.28,g+.13,f+.5),i.add(J);const ht=new G(Ie(.4,.12,.24,.05),this.sirenB);ht.position.set(.28,g+.13,f+.5),i.add(ht),this.sirenY=g+.6}if(t.ems==="fire"){o(Be,.08,.08,t.len*.5,-.3,g+.08,-.5),o(Be,.08,.08,t.len*.5,.3,g+.08,-.5);for(let st=0;st<5;st++)o(Be,.6,.05,.05,0,g+.08,-2.2+st*.85);const tt=new Et({color:12436423,roughness:.3,metalness:.7});tt.userData.shared=!0,o(tt,.03,.9,t.len*.4,t.wid/2+.01,1.3,-1.2),o(tt,.03,.9,t.len*.4,-(t.wid/2+.01),1.3,-1.2);const O=new G(Ie(1,.12,.26,.05),se);O.position.set(0,g+.05,h-.3),i.add(O),this.sirenR=new pe({color:16719904,toneMapped:!1}),this.sirenB=new pe({color:16719904,toneMapped:!1});const J=new G(Ie(.4,.12,.24,.05),this.sirenR);J.position.set(-.28,g+.13,h-.3),i.add(J);const ht=new G(Ie(.4,.12,.24,.05),this.sirenB);ht.position.set(.28,g+.13,h-.3),i.add(ht),this.sirenY=g+.6}this.seat=new me,this.seat.position.set(.38,.3+(t.cabin[0][1]-.86),(t.cabin[0][0]+t.cabin[t.cabin.length-1][0])/2-.2),i.add(this.seat),this.hood=new me,this.hood.position.set(0,I+.1,t.len/2-.8),i.add(this.hood)}get speed(){const t=Math.sin(this.heading),e=Math.cos(this.heading);return this.vx*t+this.vz*e}get absSpeed(){return Math.hypot(this.vx,this.vz)}setPosition(t,e,i){this.x=t,this.z=e,this.heading=i,this.vx=this.vz=0,this.angVel=0,this.syncMesh()}syncMesh(){this.group.position.set(this.x,this.y,this.z),this.group.rotation.y=this.heading}update(t,e){const i=this.type;this.destroyed&&(this.throttle=0,this.brake=0,this.steerInput=0);const n=Math.sin(this.heading),s=Math.cos(this.heading),a=n,o=s,l=s,c=-n;let h=this.vx*a+this.vz*o,u=this.vx*l+this.vz*c;const f=Math.abs(h)/i.maxSpeed;if(this.throttle>0){const w=i.accel*this.throttle*Math.max(.15,1-f*f);h+=w*t}this.braking=!1,this.brake>0&&(h>.6?(h-=i.brake*this.brake*t,this.braking=!0,h<0&&(h=0)):h>-i.maxSpeed*.35&&(h-=i.accel*.6*this.brake*t)),this.handbrake&&Math.abs(h)>.2&&(h-=Math.sign(h)*6*t,this.braking=!0),h-=h*(.04+.0015*Math.abs(h))*t,this.throttle===0&&this.brake===0&&(h-=Math.sign(h)*Math.min(Math.abs(h),1.2*t)),this.destroyed&&(h-=Math.sign(h)*Math.min(Math.abs(h),4*t));const d=i.grip*(this.handbrake?.22:1),g=Math.min(1,Math.abs(u)/9),x=d*(1-g*.55);u*=Math.exp(-x*t);const p=1/(1+Math.pow(Math.abs(h)/16,1.5)),m=this.steerInput*i.steer*(.35+.65*p);this.steer=de(this.steer,m,10,t);let y=h/this.wheelbase*Math.tan(this.steer)*.85;this.handbrake&&(y*=1.55),y=ie(y,-2.6,2.6),this.angVel=de(this.angVel,y,8,t),this.heading+=this.angVel*t;const M=Math.sin(this.heading),v=Math.cos(this.heading);this.vx=M*h+v*u,this.vz=v*h-M*u,this.x+=this.vx*t,this.z+=this.vz*t;const b=e.ground(this.x,this.z);this.y>b+.05?(this.vy-=22*t,this.y+=this.vy*t,this.airT+=t,this.y<b&&(this.y=b,this.vy<-6&&this.damage(-this.vy*1.5,"fall"),this.vy=0)):(this.y=de(this.y,b,12,t),this.vy=0,this.airT=0),e.isWater(this.x,this.z)?(this.waterT=(this.waterT||0)+t,this.vx*=.96,this.vz*=.96,this.waterT>1.5&&!this.destroyed&&this.kill("drown")):this.waterT=0;const _=Cx(e.hash,this,this.halfL,this.halfW);if(this.lastHit=null,_){const w=this.vx*_.nx+this.vz*_.nz;if(w<0){this.vx-=(1+.25)*w*_.nx,this.vz-=(1+.25)*w*_.nz;const P=-w;P>3&&(this.damage(P*1.6,"crash"),this.lastHit={impact:P,nx:_.nx,nz:_.nz,box:_.box}),this.vx*=.92,this.vz*=.92,this.angVel+=(Math.random()-.5)*P*.05}}this.onFire&&!this.destroyed&&(this.fireT+=t,this.fireT>3.5&&this.explode(e)),this.wheelSpin+=h*t/i.wheelR;for(const w of this.wheels)w.pivot.rotation.y=w.front?this.steer:0,w.mesh.rotation.x=this.wheelSpin,w.rim.rotation.x=this.wheelSpin;const T=(u-(this._pvr||0))/Math.max(t,.001);this._pvr=u;const C=(h-(this._pvf||0))/Math.max(t,.001);if(this._pvf=h,this.body.rotation.z=de(this.body.rotation.z,ie(-this.angVel*Math.abs(h)*.006+T*.002,-.08,.08),6,t),this.body.rotation.x=de(this.body.rotation.x,ie(-C*.004,-.05,.05),6,t),this.tailMat.emissiveIntensity=this.braking?3:this.lightsOn?1:.3,this.headMat.emissiveIntensity=this.lightsOn?3:.3,(this.type.cop||this.type.ems)&&this.sirenOn){const w=performance.now()/180%2<1;this.sirenR.color.setHex(w?16719904:3145728),this.sirenB.color.setHex(w?1048624:2121983),this.sirenPhase=w}else this.sirenR&&(this.sirenR.color.setHex(8392720),this.sirenB.color.setHex(1056896));this.syncMesh()}setLights(t){this.lightsOn=t}damage(t,e,i=null){if(this.destroyed)return;const n=!!(i&&(i.kind==="player"||i.control==="player"||i.driver?.kind==="player"||i.byPlayer||i.lastDamage?.byPlayer));this.health-=t,this.lastDamage={amount:t,cause:e,t:performance.now(),byPlayer:n||this.lastDamage?.byPlayer&&performance.now()-this.lastDamage.t<4e3},this.onDamaged?.(t,e),this.health<25&&!this.onFire&&(this.onFire=!0,this.fireT=0),this.health<=-40&&this.explode(this.world)}kill(t){this.destroyed||(this.destroyed=!0,this.onFire=!1,this.paint.color.setHex(1710618),this.paint.roughness=.95,this.paint.metalness=.1,this.headMat.emissiveIntensity=0,this.tailMat.emissiveIntensity=0,this.setLights(!1),this.sirenOn=!1,this.onDestroyed?.(t))}explode(t){this.destroyed||(this.kill("explode"),this.vy=6,this.y+=.1,this.angVel+=(Math.random()-.5)*3,this.onExploded?.())}dispose(){this.group.parent?.remove(this.group);const t=new Set,e=new Set;this.group.traverse(i=>{i.geometry&&t.add(i.geometry);const n=Array.isArray(i.material)?i.material:[i.material];for(const s of n)s&&e.add(s)});for(const i of t)i.userData.shared||i.dispose();for(const i of e)i.userData.shared||i.dispose()}}const Qr={x:0,z:0},Jr={x:0,z:0};function fv(r,t){const e=r.x-t.x,i=r.z-t.z,n=r.halfL+t.halfL;if(e*e+i*i>n*n)return 0;let s=0;const a=Math.sin(r.heading),o=Math.cos(r.heading),l=Math.sin(t.heading),c=Math.cos(t.heading),h=r.halfL-r.halfW,u=t.halfL-t.halfW,f=r.halfW+.05,d=t.halfW+.05;for(const g of[-1,0,1])for(const x of[-1,0,1]){Qr.x=r.x+a*h*g,Qr.z=r.z+o*h*g,Jr.x=t.x+l*u*x,Jr.z=t.z+c*u*x;const p=Qr.x-Jr.x,m=Qr.z-Jr.z,y=p*p+m*m,M=f+d;if(y>=M*M||y<1e-6)continue;const v=Math.sqrt(y),b=p/v,_=m/v,T=M-v,C=r.type.mass,w=t.type.mass,S=C+w;r.x+=b*T*(w/S),r.z+=_*T*(w/S),t.x-=b*T*(C/S),t.z-=_*T*(C/S);const P=r.vx-t.vx,z=r.vz-t.vz,I=P*b+z*_;if(I<0){const U=-1.35*I/(1/C+1/w);r.vx+=U/C*b,r.vz+=U/C*_,t.vx-=U/w*b,t.vz-=U/w*_,r.angVel+=g*.35*I*-.15*(b*o-_*a)*(w/S),t.angVel+=x*.35*I*.15*(b*c-_*l)*(C/S);const X=-I;s=Math.max(s,X),X>2.5&&(r.damage(X*1.2*(w/S)*2,"car",t),t.damage(X*1.2*(C/S)*2,"car",r),r.lastCarHit={other:t,impact:X},t.lastCarHit={other:r,impact:X})}}return s}const{BLOCKS:Si,PITCH:un,HALF:os}=Ne,Mh=["sedan","sedan","sedan","executive","reverie","sports","seraph","kestrel","vortex","bruiser","razor","luz","regal","suv","monarch","golem","dune","pickup","van","carrier","hauler","coach","solair","bella","majestic","howler","cabbie","taxi","taxi","refuse","hook"],dv=r=>!!In[r]?.taxi;class pv{constructor(t){this.game=t,this.cars=[],this.max=34,this.spawnT=0}spawnParked(){const t=this.game;for(const e of t.city.parkedSpots){const i=t.addVehicle(He(Mh.filter(n=>!dv(n))),e.x,e.z,e.heading);i.isParked=!0,i.control="none"}}newRoute(t,e={}){const n=this.game.city.roadCoords,s=ie(Math.round((t.x+os)/un),0,Si),a=ie(Math.round((t.z+os)/un),0,Si),o=Math.abs(t.x-n[s]),l=Math.abs(t.z-n[a]),c=t.ai,h=e.dirHint,u=t.ai={lane:Math.random()<.5?0:1,path:[],pi:0,scared:0,honkT:0,stuckT:0,reverseT:0,laneT:0,cruise:["super","sports"].includes(t.type.cls)?16:["muscle","coupe"].includes(t.type.cls)?14:Dt(11,14)};c?.aggressive&&(u.aggressive=!0,u.goal=c.goal,u.cruise=c.cruise,u.scared=c.scared),Object.assign(u,e);const f=Math.sin(t.heading),d=Math.cos(t.heading);return o<l?(u.dx=0,u.dz=h?h.dz:d>=0?1:-1,u.ix=s,u.iz=u.dz>0?Math.ceil((t.z+os)/un-.01):Math.floor((t.z+os)/un+.01),u.iz=ie(u.iz,0,Si),(u.dz>0&&u.iz===a&&t.z>n[a]||u.dz<0&&u.iz===a&&t.z<n[a])&&(u.iz+=u.dz),u.iz=ie(u.iz,0,Si)):(u.dz=0,u.dx=h?h.dx:f>=0?1:-1,u.iz=a,u.ix=u.dx>0?Math.ceil((t.x+os)/un-.01):Math.floor((t.x+os)/un+.01),u.ix=ie(u.ix,0,Si)),(u.ix<0||u.ix>Si||u.iz<0||u.iz>Si||u.dx!==0&&u.ix+u.dx<-1)&&(u.dx*=-1,u.dz*=-1),this.extendPath(t),u}placeOnLane(t,e){const i=this.game.city.lanePoint(e.ix,e.iz,e.dx,e.dz,e.lane,-oo-6);t.setPosition(i.x,i.z,Math.atan2(e.dx,e.dz))}extendPath(t){const e=this.game.city,i=t.ai,{ix:n,iz:s,dx:a,dz:o,lane:l}=i,c=e.lanePoint(n,s,a,o,l,-oo);c.stop=!0,c.ix=n,c.iz=s,c.axis=o!==0?"z":"x",c.dx=a,c.dz=o,i.path.push(c);const h=[],u={dx:a,dz:o},f={dx:-o,dz:a},d={dx:o,dz:-a};for(const[p,m]of[[u,3],[f,1],[d,1]]){const y=n+p.dx,M=s+p.dz;if(y>=0&&y<=Si&&M>=0&&M<=Si&&e.hasRoadSeg(n,s,p.dx,p.dz))for(let v=0;v<m;v++)h.push(p)}let g=h.length?He(h):{dx:-a,dz:-o};if(i.goal){const p=[u,f,d].filter(m=>{const y=n+m.dx,M=s+m.dz;return y>=0&&y<=Si&&M>=0&&M<=Si&&e.hasRoadSeg(n,s,m.dx,m.dz)});if(p.length){let m=1/0;for(const y of p){const M=e.roadCoords[n+y.dx],v=e.roadCoords[s+y.dz],b=Math.hypot(M-i.goal.x,v-i.goal.z)+Math.random()*6;b<m&&(m=b,g=y)}}}const x=e.lanePoint(n,s,g.dx,g.dz,l,oo);if(g.dx===a&&g.dz===o)x.speed=i.cruise,i.path.push(x);else if(g.dx===-a&&g.dz===-o){const p=e.lanePoint(n,s,a,o,l,0);p.speed=4,i.path.push(p),x.speed=5,i.path.push(x)}else{const p=(x.x-c.x)*a+(x.z-c.z)*o,m=c.x+a*p,y=c.z+o*p,M=g.dx===d.dx&&g.dz===d.dz;for(const v of[.3,.55,.8,1]){const b=1-v,_={x:b*b*c.x+2*b*v*m+v*v*x.x,z:b*b*c.z+2*b*v*y+v*v*x.z,speed:M?5:7};i.path.push(_)}}i.ix=n+g.dx,i.iz=s+g.dz,i.dx=g.dx,i.dz=g.dz,i.path[i.path.length-1].turnEnd=!0}spawnOne(){const t=this.game,e=t.city,i=t.player,n=t.rig.forward(new D);for(let s=0;s<8;s++){const{ix:a,iz:o}=e.randomJunction(),l=[[0,1],[0,-1],[1,0],[-1,0]].filter(([p,m])=>e.hasRoadSeg(a,o,p,m));if(!l.length)continue;const[c,h]=He(l),u=Math.random()<.5?0:1,f=e.lanePoint(a,o,c,h,u,Dt(14,un-14)),d=bt(f.x,f.z,i.x,i.z);if(d<70||d>210||((f.x-i.x)*n.x+(f.z-i.z)*n.z)/d>.3&&d<140||t.vehicles.some(p=>bt(p.x,p.z,f.x,f.z)<14))continue;const x=t.addVehicle(He(Mh),f.x,f.z,Math.atan2(c,h));return this.adopt(x),x}}adopt(t){t.control="ai",t.isParked=!1,this.newRoute(t),this.cars.includes(t)||this.cars.push(t)}release(t){const e=this.cars.indexOf(t);e>=0&&this.cars.splice(e,1),t.ai=null}update(t){const e=this.game,i=e.player;this.spawnT-=t,this.spawnT<=0&&(this.spawnT=.4,this.cars.length<this.max&&this.spawnOne());for(let n=this.cars.length-1;n>=0;n--){const s=this.cars[n],a=bt(s.x,s.z,i.x,i.z);if(a>280||s.destroyed&&a>90){this.cars.splice(n,1),e.removeVehicle(s);continue}if(s.destroyed){s.throttle=0,s.brake=1;continue}this.drive(s,t)}}drive(t,e){const i=this.game,n=i.city,s=t.ai;if(!s)return;const a=t.speed,o=Math.sin(t.heading),l=Math.cos(t.heading);if(s.scared=Math.max(0,s.scared-e),s.honkT=Math.max(0,s.honkT-e),s.laneT=Math.max(0,(s.laneT||0)-e),s.reverseT>0){s.reverseT-=e,t.throttle=0,t.brake=1,t.steerInput=s.reverseSteer,s.reverseT<=0&&this.newRoute(t);return}for(;s.path.length<8;)this.extendPath(t);let c=s.path[s.pi];const h=v=>(t.x-v.x)*o+(t.z-v.z)*l>-.5||bt(t.x,t.z,v.x,v.z)<2.2;for(;s.pi<s.path.length-1&&h(c);)s.pi++,c=s.path[s.pi];s.pi>3&&(s.path.splice(0,s.pi),s.pi=0,c=s.path[0]);const u=bt(t.x,t.z,c.x,c.z),f=Math.abs((c.x-t.x)*l-(c.z-t.z)*o),d=(c.x-t.x)*o+(c.z-t.z)*l;if(u>un*1.6||u>6&&f>9||d<-4&&u>6){this.newRoute(t);return}let g=c;const x=4+Math.abs(a)*.35;for(let v=s.pi;v<s.path.length&&(g=s.path[v],!(bt(t.x,t.z,g.x,g.z)>x));v++);const p=Math.atan2(g.x-t.x,g.z-t.z),m=cr(p-t.heading);t.steerInput=ie(m*2.2,-1,1);let y=s.scared>0?24:s.cruise;for(let v=s.pi;v<Math.min(s.path.length,s.pi+5);v++){const b=s.path[v];if(b.speed!==void 0){const _=bt(t.x,t.z,b.x,b.z),T=b.speed*(s.aggressive?1.8:1);y=Math.min(y,Math.max(T,Math.sqrt(T*T+2*(s.aggressive?10:6)*Math.max(0,_-2))))}}Math.abs(m)>.5&&(y=Math.min(y,s.aggressive?9:5));for(let v=s.pi;v<Math.min(s.path.length,s.pi+3);v++){const b=s.path[v];if(!b.stop)continue;const _=(b.x-t.x)*o+(b.z-t.z)*l;if(_<-1)continue;const T=n.lightState(b.ix,b.iz,b.axis,i.time);if(s.scared>0||s.aggressive)break;if(T==="red"||T==="yellow"&&_>6){const C=Math.sqrt(10*Math.max(0,_-1.5));y=Math.min(y,_<1.5?0:C)}break}let M=!1;for(const v of i.vehicles){if(v===t)continue;const b=v.x-t.x,_=v.z-t.z;if(b*b+_*_>1600)continue;const T=b*o+_*l,C=b*l-_*o,w=(s.aggressive?3:6)+Math.abs(a)*(s.aggressive?.7:1.3);if(!(s.aggressive&&v.control==="player")&&T>0&&T<w+v.halfL&&Math.abs(C)<2.6){const S=T-v.halfL-t.halfL,P=v.vx*o+v.vz*l,z=S<(s.aggressive?1:2.5)?0:Math.min(Math.max(0,P)+Math.sqrt(2*(s.aggressive?12:5)*Math.max(0,S-2.5)),y);if(s.aggressive&&s.laneT<=0&&S>3&&P<a-2&&!s.path.slice(s.pi,s.pi+3).some(I=>I.stop&&bt(t.x,t.z,I.x,I.z)<22)){this.newRoute(t,{lane:1-s.lane,laneT:3});return}y=Math.min(y,z),S<4&&v.control==="player"&&Math.abs(a)<1&&s.honkT<=0&&Math.random()<.02&&(M=!0)}}for(const v of i.peds){if(v.dead&&v.deadT>2)continue;const b=v.x-t.x,_=v.z-t.z;if(b*b+_*_>900)continue;const T=b*o+_*l,C=b*l-_*o;T>0&&T<5+Math.abs(a)*1.2&&Math.abs(C)<t.halfW+.8&&(y=Math.min(y,T<4?0:Math.sqrt(12*(T-3))),s.honkT<=0&&(M=!0))}if(!s.aggressive&&i.player.vehicle==null&&bt(i.player.x,i.player.z,t.x,t.z)<30){const v=i.player.x-t.x,b=i.player.z-t.z,_=v*o+b*l,T=v*l-b*o;_>0&&_<6+Math.abs(a)*1.2&&Math.abs(T)<t.halfW+.8&&(y=Math.min(y,_<4?0:Math.sqrt(12*(_-3))),s.honkT<=0&&(M=!0))}M&&(s.honkT=Dt(2,5),i.hornAt(t)),a<y-.4?(t.throttle=ie((y-a)/4,.3,1),t.brake=0):a>y+.4?(t.throttle=0,t.brake=ie((a-y)/4,.25,1)):(t.throttle=.15,t.brake=0),t.handbrake=!1,t.throttle>.3&&Math.abs(a)<.4&&y>2?(s.stuckT+=e,s.stuckT>2.5&&(s.stuckT=0,s.reverseT=1.3,s.reverseSteer=Math.random()<.5?-1:1)):s.stuckT=Math.max(0,s.stuckT-e),t.setLights(i.night>.35)}}const{PITCH:mv}=Ne,gv={hit_ped:.34,kill_ped:.8,assault:.2,gunfire:.34,carjack:.5,attack_cop:1,kill_cop:1.5,destroy_vehicle:.8,explosion:1,hit_cop_car:.5},xv=new D,Ws=new D,fn=new D;class vv{constructor(t){this.game=t,this.level=0,this.heat=0,this.seenT=0,this.cops=[],this.copCars=[],this.spawnT=0,this.flashT=0,this.lastCrimeT=-99,this.cleared=!0}crime(t,e,i){const n=this.game,s=gv[t]??.3,a={gunfire:.4,hit_ped:.5,carjack:.6,assault:.5}[t]??1;if(!(this.level>0||this.copNear(e,i,80)||Math.random()<a))return;this.heat=Math.min(Bs.MAX+.99,this.heat+s),this.seenT=0,this.lastCrimeT=n.time;const l=Math.min(Bs.MAX,Math.floor(this.heat));l>this.level&&(this.level=l,this.flashT=1.5,n.audio.stars(),n.hud.flashStars())}copNear(t,e,i){return this.cops.some(n=>!n.dead&&bt(n.x,n.z,t,e)<i)}clear(){this.level=0,this.heat=0,this.seenT=0}noteRam(){this.crime("hit_cop_car",this.game.player.x,this.game.player.z)}onCopHurt(t,e){(e===this.game.player||e?.driver===this.game.player)&&this.crime("attack_cop",t.x,t.z)}onCopKilled(t,e){(e===this.game.player||e?.driver===this.game.player)&&this.crime("kill_cop",t.x,t.z)}release(t){const e=this.copCars.indexOf(t);e>=0&&this.copCars.splice(e,1),t.sirenOn=!1}update(t){const e=this.game,i=e.player;this.flashT=Math.max(0,this.flashT-t),this.level>0&&(this.cops.some(a=>!a.dead&&bt(a.x,a.z,i.x,i.z)<Bs.COP_SIGHT)?this.seenT=0:this.seenT+=t,this.seenT>Bs.DECAY_TIME[this.level]&&(this.level--,this.heat=this.level,this.seenT=0,this.level===0&&e.notify("You lost the cops",2500)));const n=Bs.COPS_PER_LEVEL[this.level];this.spawnT-=t,this.copCars.length<n&&this.spawnT<=0&&(this.spawnT=this.copCars.length===0?.5:Dt(2,5)/Math.max(1,this.level*.6),this.spawnCopCar());for(let s=this.copCars.length-1;s>=0;s--){const a=this.copCars[s],o=bt(a.x,a.z,i.x,i.z),l=this.copCars.length>n;if(a.destroyed&&o>60||o>260||l&&o>120||this.level===0&&o>90){this.copCars.splice(s,1),this.removeCopOf(a),e.removeVehicle(a);continue}if(!a.destroyed){if(this.level===0){a.throttle=0,a.brake=.5,a.handbrake=!1,a.sirenOn=!1,a.setLights(!1);continue}a.driver&&a.driver.kind==="cop"?this.driveCopCar(a,t):(a.throttle=0,a.brake=.5,a.sirenOn=!1)}}for(let s=this.cops.length-1;s>=0;s--){const a=this.cops[s],o=bt(a.x,a.z,i.x,i.z);if(a.dead&&a.deadT>20||!a.vehicle&&o>200||this.level===0&&!a.vehicle&&o>80){this.cops.splice(s,1);const l=e.peds.indexOf(a);l>=0&&e.peds.splice(l,1),a.dispose()}}}removeCopOf(t){for(const e of this.cops)e.vehicle===t&&(e.vehicle=null)}spawnCopCar(){const t=this.game,e=t.city,i=t.player,n=t.rig.forward(xv);for(let s=0;s<10;s++){const{ix:a,iz:o}=e.randomJunction(),l=[[0,1],[0,-1],[1,0],[-1,0]].filter(([y,M])=>e.hasRoadSeg(a,o,y,M));if(!l.length)continue;const[c,h]=He(l),u=e.lanePoint(a,o,c,h,0,Dt(14,mv-14)),f=bt(u.x,u.z,i.x,i.z);if(f<60||f>150||((u.x-i.x)*n.x+(u.z-i.z)*n.z)/f>.5&&f<80||t.vehicles.some(y=>bt(y.x,y.z,u.x,u.z)<12))continue;const g=this.wanted??1,x=g>=4&&Math.random()<.4?"interceptor":g>=2&&Math.random()<.25?"warden":"police",p=t.addVehicle(x,u.x,u.z,Math.atan2(c,h));p.control="cop",p.sirenOn=!0,p.avoid={t:0,side:1},t.traffic.newRoute(p,{aggressive:!0,cruise:40,goal:{x:i.x,z:i.z}});const m=new xn(t,u.x,u.z,{kind:"cop",weapon:"pistol"});return m.important=!0,t.peds.push(m),this.cops.push(m),m.enterVehicle(p),m.car=p,this.copCars.push(p),p}}driveCopCar(t,e){const i=this.game,n=i.player,s=i.city,a=t.driver,o=n.x+n.vx*.6,l=n.z+n.vz*.6,c=bt(t.x,t.z,n.x,n.z);Math.sin(t.heading),Math.cos(t.heading);const h=t.speed;t.sirenOn=!0,t.setLights(i.night>.35);const u=n.x-t.x,f=n.z-t.z,d=c<1?null:da(s.hash,t.x,t.z,u/c,f/c,c).box,g=!d||d.kind!=="building";if(!(c<70&&g)){t.ai||i.traffic.newRoute(t,{aggressive:!0,cruise:40,goal:{x:n.x,z:n.z}}),t.ai.goal={x:n.x,z:n.z},t.ai.aggressive=!0,t.ai.cruise=40,t.ai.scared=0,i.traffic.drive(t,e),t.setLights(i.night>.35),this.level>=3&&n.vehicle&&c<26&&!n.dead&&(a.shootT-=e,a.shootT<=0&&(a.shootT=2.2,this.copShoot(a,t.x,t.y+1.2,t.z,.25)));return}if(t.ai=null,t.avoid.reverseT>0){t.avoid.reverseT-=e,t.throttle=0,t.brake=1,t.steerInput=t.avoid.side,t.handbrake=!1,t.avoid.reverseT<=0&&(t.avoid.stuck=0);return}let p=Math.atan2(o-t.x,l-t.z);const m=9+Math.abs(h)*.7,y=[[0,1],[.45,.7],[-.45,.7]];let M=[0,0,0];if(y.forEach(([_,T],C)=>{const w=t.heading+_,S=da(s.hash,t.x,t.z,Math.sin(w),Math.cos(w),m*T);S.box&&S.box.kind==="building"&&(M[C]=1-S.t/(m*T))}),M[0]>.1||M[1]>.4||M[2]>.4){const _=(M[2]-M[1])*1.2+(M[0]>.1?t.avoid.side*.8:0);p=t.heading+_}const v=cr(p-t.heading);t.steerInput=ie(v*2,-1,1);let b=n.vehicle?40:Math.min(30,c*.8);Math.abs(v)>1.2&&(b=Math.min(b,6)),M[0]>.5&&(b=Math.min(b,4)),!n.vehicle&&c<9&&(b=0),h<b-.5?(t.throttle=1,t.brake=0):h>b+.5?(t.throttle=0,t.brake=1):(t.throttle=.2,t.brake=0),t.handbrake=Math.abs(v)>1.4&&Math.abs(h)>8,t.throttle>.5&&Math.abs(h)<.5?(t.avoid.stuck=(t.avoid.stuck||0)+e,t.avoid.stuck>1.5&&(t.avoid.reverseT=1.2,t.avoid.side=Math.random()<.5?-1:1)):t.avoid.stuck=0,t.lastCarHit&&t.lastCarHit.other===n.vehicle&&t.lastCarHit.impact>4&&(t.lastCarHit=null,i.rig.addShake(.3)),!n.vehicle&&c<12&&Math.abs(h)<3&&!n.dead&&(a.exitVehicle(),a.car=t,a.aiming=!0),this.level>=3&&n.vehicle&&c<26&&!n.dead&&(a.shootT-=e,a.shootT<=0&&(a.shootT=1.6,this.copShoot(a,t.x,t.y+1.2,t.z,.3)))}updateCop(t,e){const i=this.game,n=i.player,s=bt(t.x,t.z,n.x,n.z);if(t.shootT-=e,n.dead||n.busted||this.level===0){t.speed=0,t.aiming=!1,this.maybeReturnToCar(t,e);return}if(n.vehicle&&s>30&&t.car&&!t.car.destroyed&&!t.car.driver&&bt(t.car.x,t.car.z,t.x,t.z)<60){this.walkToCar(t,e);return}const a=Math.atan2(n.x-t.x,n.z-t.z);if(t.heading=Li(t.heading,a,10,e),t.aiming=this.level>=2&&s<32,s>2?t.speed=t.aiming&&s<10?3.2:6.6:t.speed=0,!n.vehicle&&s<2&&n.absSpeed<3?(t.arrestT+=e,t.arrestT>.9&&n.arrest()):t.arrestT=Math.max(0,t.arrestT-e),this.level>=2&&s<32&&t.shootT<=0){const o=ie(.6-s/55,.15,.6);t.shootT=Math.max(1,2-this.level*.15),this.copShoot(t,t.x,t.y+1.35,t.z,o)}}walkToCar(t,e){const i=t.car,n=Math.atan2(i.x-t.x,i.z-t.z);t.heading=Li(t.heading,n,10,e),t.aiming=!1;const s=bt(t.x,t.z,i.x,i.z);t.speed=s>i.halfW+1.5?6.6:0,s<=i.halfW+1.6&&(t.enterVehicle(i),i.control="cop",this.copCars.includes(i)||this.copCars.push(i))}maybeReturnToCar(t,e){t.car&&!t.car.destroyed&&!t.car.driver&&bt(t.car.x,t.car.z,t.x,t.z)<60&&this.walkToCar(t,e)}copShoot(t,e,i,n,s){const a=this.game,o=a.player,l=a.effects;Ws.set(e,i,n),fn.set(o.x-e,o.y+1-i,o.z-n).normalize();const c=Bn(a,Ws,fn,60,t);if(c.type!=="ped"&&c.type!=="vehicle"&&c.type!=="none")return;Math.random()>s&&(fn.x+=Dt(-.08,.08),fn.y+=Dt(-.04,.04),fn.z+=Dt(-.08,.08));const u=Bn(a,Ws,fn,60,t);l.addTracer(Ws,u.point),l.muzzle(Ws,fn),a.audio.gunshot("pistol"),u.type==="ped"&&u.entity===o?o.takeDamage(4+this.level,t):u.type==="ped"?u.entity.hurt(12,t,fn):u.type==="vehicle"&&(u.entity.damage(4,"bullet",t),l.sparks(u.point.x,u.point.y,u.point.z,4),u.entity===o.vehicle&&o.takeDamage(2,t,"impact"))}}const ls={health:new Et({color:16728128,emissive:16719904,emissiveIntensity:1.2,roughness:.3}),armor:new Et({color:4231423,emissive:2117887,emissiveIntensity:1.2,roughness:.3}),money:new Et({color:4259696,emissive:2146368,emissiveIntensity:1,roughness:.4}),weapon:new Et({color:14540253,emissive:16777215,emissiveIntensity:.5,roughness:.3,metalness:.6})};function yv(r){const t=new Ee;if(r==="health")t.add(new G(new Ft(.6,.2,.2),ls.health),new G(new Ft(.2,.6,.2),ls.health));else if(r==="armor"){const e=new G(new Zt(.32,.18,.6,6),ls.armor);e.rotation.x=Math.PI/2,t.add(e)}else if(r==="money")for(let e=0;e<3;e++){const i=new G(new Ft(.5,.08,.26),ls.money);i.position.y=e*.09,i.rotation.y=e*.3,t.add(i)}else{const e=new G(new Ft(.1,.16,Pi[r]?.long?.9:.45),ls.weapon);t.add(e);const i=new G(new Ft(.1,.22,.1),ls.weapon);i.position.set(0,-.15,.08),t.add(i)}return t}const Tu=new lr(.55,.75,24);Tu.rotateX(-Math.PI/2);const Mv={health:new pe({color:16732240,transparent:!0,opacity:.6,depthWrite:!1}),armor:new pe({color:5279999,transparent:!0,opacity:.6,depthWrite:!1}),money:new pe({color:5308288,transparent:!0,opacity:.6,depthWrite:!1}),weapon:new pe({color:16777215,transparent:!0,opacity:.5,depthWrite:!1})};class Sv{constructor(t){this.game=t,this.items=[],this.rng=Mn(777);const e=t.city,i=["health","health","health","armor","armor","money","money","money","money","pistol","pistol","uzi","uzi","shotgun","shotgun","rifle"],n=new Set;for(let s=0;s<44;s++){const a=this.rng.pick(e.blocks);if(n.has(a)&&this.rng()<.6)continue;n.add(a);const o=[[a.x0-1.5,a.z0-1.5],[a.x1+1.5,a.z0-1.5],[a.x1+1.5,a.z1+1.5],[a.x0-1.5,a.z1+1.5]],l=this.rng.pick(o),c=this.rng.range(.15,.85),h=this.rng.pick(o),u=l[0]+(h[0]-l[0])*c,f=l[1]+(h[1]-l[1])*c,d=this.rng.pick(i);this.add(d,u,f,!1)}}add(t,e,i,n=!1,s){const a=this.game,o=Pi[t]?"weapon":t,l=yv(t),c=a.city.groundHeight(e,i);l.position.set(e,c+.9,i),a.scene.add(l);const h=new G(Tu,Mv[o]);h.position.set(e,c+.03,i),a.scene.add(h);const u={type:t,cat:o,x:e,z:i,y:c,mesh:l,ring:h,active:!0,respawnT:0,temp:n,life:n?40:1/0,amount:s??(t==="money"?Math.floor(this.rng.range(40,250)):0),phase:Math.random()*6.28};return this.items.push(u),u}update(t){const e=this.game,i=e.player,n=e.time;for(let s=this.items.length-1;s>=0;s--){const a=this.items[s];if(a.temp&&(a.life-=t,a.life<=0)){this.destroy(a),this.items.splice(s,1);continue}if(!a.active){a.respawnT-=t,a.respawnT<=0&&(a.active=!0,a.mesh.visible=a.ring.visible=!0);continue}a.mesh.rotation.y=n*1.5+a.phase,a.mesh.position.y=a.y+.9+Math.sin(n*2+a.phase)*.12,a.ring.scale.setScalar(1+Math.sin(n*3+a.phase)*.08);const o=i.vehicle?i.vehicle.halfW+.6:1.3;!i.dead&&bt(i.x,i.z,a.x,a.z)<o&&(a.cat==="money"||!i.vehicle)&&this.collect(a,s)}}destroy(t){this.game.scene.remove(t.mesh,t.ring),t.mesh.traverse(e=>e.geometry?.dispose())}collect(t,e){const i=this.game,n=i.player;if(t.cat==="health"){if(n.health>=100)return;n.health=100,i.audio.pickup(),i.notify("Health restored",1500)}else if(t.cat==="armor"){if(n.armor>=100)return;n.armor=100,i.audio.pickup(),i.notify("Armor",1500)}else t.cat==="money"?(n.money+=t.amount,i.audio.cash(),i.hud.moneyPop(t.amount)):(n.giveWeapon(t.type,Pi[t.type].clip),i.audio.pickup(),i.notify(`${Pi[t.type].name} +${Pi[t.type].clip}`,1500));t.temp?(this.destroy(t),this.items.splice(e,1)):(t.active=!1,t.respawnT=75,t.mesh.visible=t.ring.visible=!1)}}const wv=new Zt(2.2,2.2,3,32,1,!0),Sh={transparent:!0,opacity:.35,side:Ve,depthWrite:!1,toneMapped:!1},bv=new Zt(4,4,6,32,1,!0);class _v{constructor(t){this.game=t,this.active=null,this.markers=[],this.cooldown=0,this.completed=0;const e=t.city,i=(a,o)=>e.blocks.find(l=>l.i===a&&l.j===o),n=[{type:"race",name:"Street Race",color:16765514,x:i(19,2).x1+5,z:i(19,2).z0-5,desc:"Hit every checkpoint before the clock runs out."},{type:"taxi",name:"Taxi Fares",color:16765514,x:i(19,18).x0+30,z:i(19,18).z0-5,desc:"Ferry passengers across town. Fast and smooth pays."},{type:"contract",name:"The Contract",color:16732240,x:i(18,18).x0-5,z:i(18,18).z0-5,desc:"A rival needs to disappear. Find them before they vanish."},{type:"hotwheels",name:"Hot Wheels",color:5294335,x:i(21,3).x0-5,z:i(21,3).z1+5,desc:"Boost the marked car and bring it back to the chop shop."},{type:"vigilante",name:"Vigilante",color:6982911,x:i(4,11).x0-5,z:i(4,11).z0-5,desc:"Take a cruiser and run down the fleeing suspects."}];for(const a of n){const o=new G(wv,new pe({color:a.color,...Sh}));o.position.set(a.x,e.groundHeight(a.x,a.z)+1.5,a.z),t.scene.add(o),this.markers.push({...a,mesh:o})}this.cpMesh=new G(bv,new pe({color:16765514,...Sh})),this.cpMesh.visible=!1,t.scene.add(this.cpMesh),this.targetMarker=new G(new Nn(.4,.8,4),new pe({color:16728128,toneMapped:!1})),this.targetMarker.rotation.x=Math.PI,this.targetMarker.visible=!1,t.scene.add(this.targetMarker);const s=t.addVehicle("police",n[4].x+12,n[4].z+6,Math.PI/2);s.control="none",s.isParked=!0}blips(){const t=[];if(!this.active)for(const e of this.markers)t.push({x:e.x,z:e.z,color:"#"+e.color.toString(16).padStart(6,"0"),kind:"mission",size:7,label:e.name[0],name:e.name});if(this.active?.blips){const e=this.active.blips();e.length&&(e[0].guide=!0),t.push(...e)}return t}update(t){const e=this.game,i=e.player,n=e.time;for(const s of this.markers)s.mesh.material.opacity=.25+.15*Math.sin(n*3),s.mesh.rotation.y=n*.5,s.mesh.visible=!this.active;if(this.cooldown=Math.max(0,this.cooldown-t),this.active){if(i.dead||i.busted){this.fail(i.dead?"You died":"You got busted");return}this.active.update(t);return}if(!(this.cooldown>0)){for(const s of this.markers){const a=bt(i.x,i.z,s.x,s.z)<2.6&&!i.vehicle;if(bt(i.x,i.z,s.x,s.z)<12&&!i.vehicle&&e.hud.setHint(`${s.name} — ${s.desc}`),a){this.start(s);break}}!this.markers.some(s=>bt(i.x,i.z,s.x,s.z)<12)&&!i.vehicle&&e.hud.setHint("")}}start(t){const e=this.game;e.hud.setHint(""),e.hud.showBanner(t.name.toUpperCase(),t.desc,"#"+t.color.toString(16).padStart(6,"0"),3500),e.audio.ui();const i={race:Tv,taxi:Ev,contract:Av,hotwheels:Cv,vigilante:Rv};this.active=new i[t.type](e,this,t)}pass(t,e=""){const i=this.game;this.active?.cleanup(),this.active=null,this.cooldown=4,this.completed++,i.player.stats.missions++,i.player.money+=t,i.hud.moneyPop(t),i.hud.showBanner("MISSION PASSED!",`${gs(t)} ${e}`,"#ffd24a",5e3),i.audio.missionPassed(),i.hud.setObjective(null),i.hud.setTimer(null)}fail(t){const e=this.game;this.active?.cleanup(),this.active=null,this.cooldown=4,e.hud.showBanner("MISSION FAILED",t,"#ff5050",4e3),e.hud.setObjective(null),e.hud.setTimer(null),e.audio.wasted()}}class hr{constructor(t,e,i){this.g=t,this.mgr=e,this.def=i,this.timer=null}tick(t){return this.timer!=null&&(this.timer-=t,this.g.hud.setTimer(this.timer),this.timer<=0)?(this.mgr.fail("Out of time"),!1):!0}cleanup(){this.g.hud.setHint("")}}function Ul(r,t,e,i,n){const s=r.city;for(let a=0;a<40;a++){const{ix:o,iz:l}=s.randomJunction(),c=[[0,1],[0,-1],[1,0],[-1,0]].filter(([g,x])=>s.hasRoadSeg(o,l,g,x));if(!c.length)continue;const[h,u]=He(c),f=s.lanePoint(o,l,h,u,1,Dt(16,Ne.PITCH-16));f.heading=Math.atan2(h,u);const d=bt(f.x,f.z,t,e);if(d>=i&&d<=n)return f}return{x:0,z:0,heading:0}}function fl(r,t,e,i,n){const s=r.city;for(let a=0;a<40;a++){const o=He(s.blocks),l=Math.floor(Math.random()*4),c=Dt(.1,.9),h=l===0?{x:o.x0+c*(o.x1-o.x0),z:o.z0-1.5}:l===1?{x:o.x0+c*(o.x1-o.x0),z:o.z1+1.5}:l===2?{x:o.x0-1.5,z:o.z0+c*(o.z1-o.z0)}:{x:o.x1+1.5,z:o.z0+c*(o.z1-o.z0)},u=bt(h.x,h.z,t,e);if(u>=i&&u<=n)return h}return{x:0,z:0}}class Tv extends hr{constructor(t,e,i){super(t,e,i),this.cps=[];let n=i.x,s=i.z;for(let a=0;a<7;a++){const o=Ul(t,n,s,90,170);this.cps.push(o),n=o.x,s=o.z}this.i=0,this.timer=100,this.state=t.player.vehicle?"go":"car",this.showCp()}showCp(){const t=this.cps[this.i];this.mgr.cpMesh.visible=!0,this.mgr.cpMesh.position.set(t.x,this.g.city.groundHeight(t.x,t.z)+3,t.z),this.g.hud.setObjective(`Checkpoint ${this.i+1} / ${this.cps.length}`)}blips(){const t=this.cps[this.i];return[{x:t.x,z:t.z,color:"#ffd24a",kind:"checkpoint",size:7}]}update(t){if(!this.tick(t))return;const e=this.g.player;if(!e.vehicle){this.g.hud.setObjective("Get in a vehicle!");return}this.g.hud.setObjective(`Checkpoint ${this.i+1} / ${this.cps.length}`);const i=this.cps[this.i];if(this.mgr.cpMesh.rotation.y+=t,bt(e.x,e.z,i.x,i.z)<4.5){if(this.g.audio.pickup(),this.i++,this.timer+=4,this.i>=this.cps.length){const n=Math.floor(this.timer*20);this.mgr.pass(1500+n,`(+${gs(n)} time bonus)`);return}this.showCp()}}cleanup(){super.cleanup(),this.mgr.cpMesh.visible=!1}}class Ev extends hr{constructor(t,e,i){super(t,e,i),this.fares=0,this.total=0,this.state="pickup",this.spawnPassenger(),this.timer=null}spawnPassenger(){const t=this.g.player,e=fl(this.g,t.x,t.z,60,140);this.pass=new xn(this.g,e.x,e.z),this.pass.important=!0,this.pass.waitT=1e9,this.pass.heading=Math.random()*6.28,this.g.peds.push(this.pass),this.state="pickup",this.g.hud.setObjective("Pick up the passenger"),this.g.hud.setTimer(null),this.timer=null}blips(){return this.state==="pickup"?[{x:this.pass.x,z:this.pass.z,color:"#ffd24a",kind:"target",size:6}]:[{x:this.dest.x,z:this.dest.z,color:"#ffd24a",kind:"checkpoint",size:7}]}update(t){const e=this.g.player;if(this.tick(t)){if(!e.vehicle){this.g.hud.setObjective(this.state==="pickup"?"Get a vehicle and pick up the passenger":"Get back in a vehicle!"),this.state==="drive"&&this.pass.vehicle;return}if(this.state==="pickup"){if(this.pass.dead){this.mgr.fail("Your passenger died");return}this.g.hud.setObjective("Pick up the passenger"),bt(e.x,e.z,this.pass.x,this.pass.z)<6&&e.vehicle.absSpeed<1.5&&(this.pass.enterVehicle(e.vehicle),e.vehicle.driver=e,this.pass.char.group.position.set(-.76,0,0),this.pass.vehicle=e.vehicle,this.pass.isPassenger=!0,this.dest=fl(this.g,e.x,e.z,120,260),this.state="drive",this.timer=25+bt(e.x,e.z,this.dest.x,this.dest.z)/9,this.mgr.cpMesh.visible=!0,this.mgr.cpMesh.position.set(this.dest.x,this.g.city.groundHeight(this.dest.x,this.dest.z)+3,this.dest.z),this.g.audio.ui())}else{if(this.g.hud.setObjective(`Drop the passenger at the marker (fare ${this.fares+1}/3)`),this.mgr.cpMesh.rotation.y+=t,this.pass.vehicle!==e.vehicle){this.mgr.fail("You lost your passenger");return}if(bt(e.x,e.z,this.dest.x,this.dest.z)<6&&e.vehicle.absSpeed<1.5){const i=Math.floor(200+this.timer*12);if(this.total+=i,this.g.player.money+=i,this.g.hud.moneyPop(i),this.g.audio.cash(),this.pass.exitVehicle(),this.pass.vehicle=null,this.pass.important=!1,this.pass.waitT=0,this.pass.pickNav(),this.fares++,this.mgr.cpMesh.visible=!1,this.fares>=3){this.mgr.pass(800,`(fares ${gs(this.total)})`);return}this.spawnPassenger()}}}}cleanup(){super.cleanup(),this.mgr.cpMesh.visible=!1,this.pass&&(this.pass.important=!1,this.pass.vehicle&&this.pass.exitVehicle(),this.pass.waitT=0,this.pass.dead||this.pass.pickNav())}}class Av extends hr{constructor(t,e,i){super(t,e,i);const n=t.player,s=fl(t,n.x,n.z,150,300);this.target=new xn(t,s.x,s.z,{shirt:1118481,pants:1118481}),this.target.important=!0,this.target.health=140,this.target.runSpeed=6.8,t.peds.push(this.target),this.timer=150,t.hud.setObjective("Find and eliminate the target"),this.esc=0}blips(){return[{x:this.target.x,z:this.target.z,color:"#ff5050",kind:"target",size:6}]}update(t){if(!this.tick(t))return;const e=this.g.player,i=this.target,n=bt(e.x,e.z,i.x,i.z);if(this.mgr.targetMarker.visible=!i.dead,this.mgr.targetMarker.position.set(i.x,i.y+2.5+Math.sin(this.g.time*4)*.15,i.z),this.mgr.targetMarker.rotation.y+=t*2,!i.dead&&n<30&&i.panic(e.x,e.z,3),i.dead){this.mgr.pass(2500);return}this.g.hud.setObjective(n<40?"Take the target down!":"Find the target (red blip)")}cleanup(){super.cleanup(),this.mgr.targetMarker.visible=!1,this.target&&(this.target.important=!1)}}class Cv extends hr{constructor(t,e,i){super(t,e,i);const n=Ul(t,i.x,i.z,200,420);this.car=t.addVehicle(He(["sports","kestrel","vortex","bruiser","scalpel"]),n.x,n.z,n.heading),this.car.control="none",this.car.isParked=!0,this.car.mission=this,this.drop={x:i.x+14,z:i.z+14},this.state="find",this.timer=180,this.startHealth=100,this.mgr.cpMesh.visible=!1,t.hud.setObjective("Steal the marked car")}blips(){return this.state==="find"?[{x:this.car.x,z:this.car.z,color:"#50c8ff",kind:"car",size:6}]:[{x:this.drop.x,z:this.drop.z,color:"#50c8ff",kind:"checkpoint",size:7}]}update(t){if(!this.tick(t))return;const e=this.g.player;if(this.car.destroyed){this.mgr.fail("The car was destroyed");return}if(this.state==="find")e.vehicle===this.car&&(this.state="deliver",this.g.hud.setObjective("Deliver the car to the chop shop"),this.mgr.cpMesh.visible=!0,this.mgr.cpMesh.position.set(this.drop.x,this.g.city.groundHeight(this.drop.x,this.drop.z)+3,this.drop.z),this.g.police.crime("carjack",e.x,e.z));else if(this.mgr.cpMesh.rotation.y+=t,e.vehicle!==this.car?this.g.hud.setObjective("Get back in the marked car!"):this.g.hud.setObjective("Deliver the car to the chop shop"),e.vehicle===this.car&&bt(e.x,e.z,this.drop.x,this.drop.z)<6&&this.car.absSpeed<1.5){const i=ie(this.car.health/100,0,1),n=Math.floor(1e3+2e3*i);e.exitVehicle(!0),this.g.removeVehicle(this.car),this.car=null,this.mgr.pass(n,`(condition ${Math.round(i*100)}%)`)}}cleanup(){super.cleanup(),this.mgr.cpMesh.visible=!1,this.car&&this.g.player.vehicle!==this.car?this.g.removeVehicle(this.car):this.car&&(this.car.mission=null)}}class Rv extends hr{constructor(t,e,i){super(t,e,i),this.wave=0,this.timer=null,this.suspect=null,this.nextWave()}nextWave(){const t=this.g,e=t.player;this.wave++;const i=Ul(t,e.x,e.z,120,220),n=t.addVehicle(He(["sedan","sports","pickup","bruiser","reverie","luz"]),i.x,i.z,i.heading);t.traffic.adopt(n),n.ai.scared=1e9,n.ai.cruise=22+this.wave*2;const s=new xn(t,i.x,i.z,{shirt:2236962});s.important=!0,t.peds.push(s),s.enterVehicle(n),s.health=40,this.suspect=n,this.driver=s,this.timer=90,t.hud.setObjective(`Wave ${this.wave}/3 — stop the suspect vehicle`),t.hud.setTimer(this.timer)}blips(){return this.suspect?[{x:this.suspect.x,z:this.suspect.z,color:"#ff5050",kind:"car",size:6}]:[]}update(t){if(!this.tick(t))return;const e=this.g,i=e.player,n=this.suspect;if(!i.vehicle||!i.vehicle.type.cop?e.hud.setObjective("Get in a police cruiser!"):e.hud.setObjective(`Wave ${this.wave}/3 — stop the suspect vehicle`),n.ai&&(n.ai.scared=1e9),!!i.vehicle?.type.cop&&(n.destroyed||this.driver.dead||n.health<30&&n.absSpeed<2&&bt(i.x,i.z,n.x,n.z)<15)){!this.driver.dead&&this.driver.vehicle&&(this.driver.exitVehicle(),this.driver.panic(i.x,i.z,10));const o=600*this.wave;if(i.money+=o,e.hud.moneyPop(o),e.audio.cash(),this.driver.important=!1,n.mission&&(n.mission=null),this.wave>=3){this.mgr.pass(1500,"(vigilante bonus)");return}this.nextWave()}}cleanup(){super.cleanup(),this.driver&&(this.driver.important=!1)}}const $r=new D,Jt=(r,t,e,i)=>{const n=document.createElement(r);return t&&(n.className=t),i!==void 0&&(n.innerHTML=i),(e||document.body).appendChild(n),n};class Pv{constructor(t){this.game=t;const e=this.root=Jt("div","hud"),i=Jt("div","hud-tr",e);this.money=Jt("div","money",i,"$0"),this.moneyDelta=Jt("div","money-delta",i,""),this.stars=Jt("div","stars",i,"");for(let o=0;o<5;o++)Jt("span","star",this.stars,"★");this.weapon=Jt("div","weapon",i,""),this.weaponIcon=Jt("div","wicon",this.weapon,""),this.weaponText=Jt("div","wtext",this.weapon,""),this.clock=Jt("div","clock",i,"00:00");const n=Jt("div","hud-bl",e);this.mapWrap=Jt("div","minimap",n),this.mapCanvas=Jt("canvas","",this.mapWrap),this.mapCanvas.width=220,this.mapCanvas.height=220,this.mctx=this.mapCanvas.getContext("2d"),this.bars=Jt("div","bars",n),this.healthBar=Jt("div","bar health",this.bars),this.healthFill=Jt("div","fill",this.healthBar),this.armorBar=Jt("div","bar armor",this.bars),this.armorFill=Jt("div","fill",this.armorBar);const s=Jt("div","hud-br",e);this.area=Jt("div","area",s,""),this.speed=Jt("div","speed",s,""),this.crosshair=Jt("div","crosshair",e),this.crosshair.style.display="none",this.objective=Jt("div","objective",e,""),this.timer=Jt("div","timer",e,""),this.notice=Jt("div","notice",e,""),this.banner=Jt("div","banner",e,""),this.bannerSub=Jt("div","banner-sub",e,""),this.hint=Jt("div","hint",e,""),this.vignette=Jt("div","vignette",e),this.damage=Jt("div","damage",e),this.bigMap=Jt("div","bigmap",e);const a=Jt("div","map-row",this.bigMap);this.bigCanvas=Jt("canvas","",a),this.bigCanvas.width=700,this.bigCanvas.height=700,this.bctx=this.bigCanvas.getContext("2d"),this.mapPanel=Jt("div","map-panel",a,""),this.bigMap.style.display="none",this.mapOpen=!1,this.mapT=0,this.help=Jt("div","help",e,`<h2>CONTROLS</h2>
      <div><b>WASD</b> move &nbsp; <b>Shift</b> sprint &nbsp; <b>Space</b> jump / handbrake &nbsp; <b>Mouse</b> look</div>
      <div><b>F</b> enter / exit vehicle (steals occupied cars) &nbsp; <b>LMB</b> fire / punch &nbsp; <b>RMB</b> aim</div>
      <div><b>1-6</b> / <b>Q</b> / <b>wheel</b> weapons &nbsp; <b>E</b> talk to people / shop &nbsp; <b>H</b> horn &nbsp; <b>R</b> radio &nbsp; <b>M</b> map &nbsp; <b>T</b> skip time &nbsp; <b>O</b> ambient occlusion &nbsp; <b>F1</b> this help</div>
      <div><b>Gamepad (XInput)</b>: left stick move/steer · right stick look · <b>RT</b> fire on foot / gas in car · <b>LT</b> aim on foot / brake in car · <b>RB</b> drive-by fire in car · <b>A</b> jump/handbrake · <b>B</b>/L3 sprint · <b>X</b> talk/horn · <b>Y</b> enter/exit · <b>LB/RB</b> weapons · <b>View</b> map · <b>Menu</b> pause · <b>R3</b> reset camera</div>
      <div class="dim">Walk into the glowing markers to start missions. Walk through store doors to shop: <span style="color:#ff8c1a">Ammu-Nation</span> <span style="color:#ff3b7a">Burger Shot</span> <span style="color:#3bd1ff">Threads</span> — drive into <span style="color:#2bff88">Pay 'n' Spray</span> to repair and lose the cops.</div>
      <div class="dim">Pickups: <span style="color:#ff5050">health</span> <span style="color:#5090ff">armor</span> <span style="color:#50ff80">cash</span> <span>weapons</span>. Hold RMB to lock on; headshots do 2.5x. Red barrels explode.</div>`),this.help.style.display="none",this.controls=Jt("div","controls-bar",e,""),this.controlsMode="",this.hit=Jt("div","hitmarker",e,""),this.shop=Jt("div","shop",e,""),this.shop.style.display="none",this.bubbleLayer=Jt("div","bubbles",e),this.bubbles=[],this.hitT=0,this.noticeT=0,this.bannerT=0,this.areaT=0,this.lastArea="",this.starFlash=0,this.moneyShown=0,this.deltaT=0,this.deltaSum=0,this.blips=[],this.buildMapImage(),this.damageA=0}buildMapImage(){const t=this.game.city,e=1250;this.mapR=e;const i=this.mapS=1024,n=i/(e*2),s=t.makeMinimap(i),a=s.getContext("2d"),o=l=>(l+e)*n;for(const l of t.hash.items)l.kind==="building"&&(a.fillStyle="rgba(120,116,110,0.85)",a.fillRect(o(l.minX),o(l.minZ),(l.maxX-l.minX)*n,(l.maxZ-l.minZ)*n));this.mapImg=s,this.mapPx=n}notify(t,e=2500){this.notice.textContent=t,this.notice.style.opacity=1,this.noticeT=e/1e3}showBanner(t,e="",i="#ffd24a",n=4e3){this.banner.textContent=t,this.banner.style.color=i,this.bannerSub.textContent=e,this.banner.style.opacity=1,this.bannerSub.style.opacity=1,this.bannerT=n/1e3}setObjective(t,e=!1){e&&this.game.missions.active||(this.objectiveText=t||"",this.objective.textContent=this.objectiveText,this.objective.style.opacity=t?1:0)}setDistance(t){this.objectiveText&&(this.objective.textContent=`${this.objectiveText}  ·  ${Math.round(t)} m`)}updateControls(){const t=this.game,e=t.player,i=t.stores.shopOpen?"shop":e.vehicle?"car":"foot";if(i===this.controlsMode)return;this.controlsMode=i;const n=(s,a)=>`<span class="kc"><b>${s}</b>${a}</span>`;this.controls.innerHTML=i==="car"?n("W / S","gas / brake")+n("A / D","steer")+n("Space","handbrake")+n("LMB","drive-by")+n("F","get out")+n("R","radio")+n("H","horn")+n("M","map"):i==="shop"?n("1-9","buy")+n("E / Esc","leave"):n("WASD","move")+n("Shift","run")+n("Space","jump")+n("RMB","aim")+n("LMB","fire")+n("Q / 1-6","weapon")+n("F","enter car")+n("E","talk / shop")+n("M","map")+n("F1","help")}setTimer(t){if(t==null){this.timer.style.opacity=0;return}this.timer.style.opacity=1;const e=Math.max(0,Math.ceil(t));this.timer.textContent=`${Math.floor(e/60)}:${String(e%60).padStart(2,"0")}`,this.timer.style.color=e<10?"#ff5050":"#fff"}setHint(t){this.hint.textContent=t||"",this.hint.style.opacity=t?1:0}flashStars(){this.starFlash=1.5}moneyPop(t){this.deltaSum+=t,this.deltaT=2,this.moneyDelta.textContent=(this.deltaSum>=0?"+":"-")+gs(Math.abs(this.deltaSum)),this.moneyDelta.style.color=this.deltaSum>=0?"#7dff9a":"#ff6a6a",this.moneyDelta.style.opacity=1}toggleHelp(){this.help.style.display=this.help.style.display==="none"?"block":"none"}hitmarker(t){this.hit.className="hitmarker show "+t,this.hitT=.25,t==="kill"?this.game.audio.tone(900,.08,.15,"square"):t==="head"?this.game.audio.tone(1400,.06,.15,"square"):this.game.audio.tone(700,.04,.1,"square")}showShop(t,e,i){this.shop.style.display="block",this.shop.style.borderColor=i,this.shop.innerHTML=`<h2 style="color:${i}">${t}</h2>`+e.map((n,s)=>`<div class="row"><span class="key">${s+1}</span><span class="name">${n.name}</span><span class="price">${n.price?gs(n.price):"free"}</span></div>`).join("")+'<div class="dim">Press a number to buy · E or Esc to leave</div>'}hideShop(){this.shop.style.display="none"}speak(t,e,i=2500){for(let s=this.bubbles.length-1;s>=0;s--)this.bubbles[s].ent===t&&(this.bubbles[s].e.remove(),this.bubbles.splice(s,1));const n=Jt("div","bubble",this.bubbleLayer,e);this.bubbles.push({ent:t,e:n,t:i/1e3})}updateBubbles(t){const e=this.game.camera;for(let i=this.bubbles.length-1;i>=0;i--){const n=this.bubbles[i];if(n.t-=t,n.t<=0||n.ent.dead){n.e.remove(),this.bubbles.splice(i,1);continue}const s=n.ent;$r.set(s.x,s.y+(s.vehicle?1.9:2.15),s.z).project(e);const a=$r.z>1,o=($r.x*.5+.5)*innerWidth,l=(-$r.y*.5+.5)*innerHeight;n.e.style.display=a?"none":"block",n.e.style.left=o+"px",n.e.style.top=l+"px",n.e.style.opacity=Math.min(1,n.t*3)}}toggleMap(){this.mapOpen=!this.mapOpen,this.bigMap.style.display=this.mapOpen?"flex":"none",this.mapOpen&&(this.buildMapPanel(),this.drawBigMap())}buildMapPanel(){const t=this.game,e=t.player,i=(o,l)=>Math.round(Math.hypot(o-e.x,l-e.z))+" m",n=t.missions.markers.map(o=>`<div class="row"><span class="dot" style="background:#${o.color.toString(16).padStart(6,"0")}">${o.name[0]}</span><span class="name">${o.name}</span><span class="dist">${i(o.x,o.z)}</span></div><div class="desc">${o.desc}</div>`).join(""),s=t.stores.stores.map(o=>`<div class="row"><span class="dot" style="background:${o.color}">${o.kind==="gun"?"A":o.kind==="food"?"B":o.kind==="clothes"?"T":"S"}</span><span class="name">${o.name}</span><span class="dist">${i(o.doorX,o.doorZ)}</span></div>`).join(""),a=t.missions.active?`<div class="active">Current: ${this.objectiveText||"mission in progress"}</div>`:"";this.mapPanel.innerHTML=`<h2>THINGS TO DO</h2>${a}<div class="sub">Missions — walk into the marker</div>${n}<div class="sub">Shops — walk through the door</div>${s}
      <div class="sub">Legend</div>
      <div class="legend"><span><i style="background:#fff"></i> you</span><span><i style="background:#ffd24a"></i> mission / checkpoint</span><span><i style="background:#ff5050"></i> target</span><span><i style="background:#4d7cff"></i> police</span><span><i style="background:#50c8ff"></i> marked car</span><span><i style="background:#ff5050;border-radius:0"></i> health <i style="background:#5090ff;border-radius:0"></i> armor <i style="background:#50ff80;border-radius:0"></i> cash</span></div>
      <div class="dim">The world is paused while the map is open. The floating arrow above you points at your objective. Press M to close.</div>`}update(t){const e=this.game,i=e.player,n=e.police;this.moneyShown=Math.abs(i.money-this.moneyShown)<1?i.money:de(this.moneyShown,i.money,6,t),this.money.textContent=gs(this.moneyShown),this.deltaT>0&&(this.deltaT-=t,this.deltaT<=0&&(this.moneyDelta.style.opacity=0,this.deltaSum=0)),this.starFlash=Math.max(0,this.starFlash-t);const s=this.starFlash>0&&Math.floor(this.starFlash*8)%2===0;this.stars.childNodes.forEach((l,c)=>{l.className="star"+(c<n.level?" on":"")+(s&&c<n.level?" flash":"")}),this.stars.style.opacity=n.level>0?1:.25;const a=Pi[i.currentWeapon];this.weaponIcon.textContent=a.icon,this.weaponText.textContent=a.melee?a.name:`${a.name}  ${i.ammo[i.currentWeapon]||0}`,this.clock.textContent=Ex(e.dayFrac),this.healthFill.style.width=ie(i.health,0,100)+"%",this.armorFill.style.width=ie(i.armor,0,100)+"%",this.armorBar.style.opacity=i.armor>0?1:.25,this.healthFill.style.background=i.health>35?"#4caf50":"#e53935",i.vehicle?(this.speed.textContent=Math.round(i.vehicle.absSpeed*3.6)+" km/h",this.speed.style.opacity=1):this.speed.style.opacity=0;const o=e.stores.interior?e.stores.interior.name:e.city.districtName(i.x,i.z);o!==this.lastArea&&(this.lastArea=o,this.area.textContent=o,this.areaT=4),this.areaT>0&&(this.areaT-=t,this.area.style.opacity=Math.min(1,this.areaT)),this.crosshair.style.display=(i.aiming||i.firePoseT>0||i.vehicle&&((e.input.vehicleFiring??e.input.firing)||e.input.aiming))&&!i.dead?"block":"none",this.crosshair.className="crosshair"+(e.aimTarget?" locked":""),this.hitT>0&&(this.hitT-=t,this.hitT<=0&&(this.hit.className="hitmarker")),this.updateBubbles(t),this.noticeT>0&&(this.noticeT-=t,this.noticeT<=0&&(this.notice.style.opacity=0)),this.bannerT>0&&(this.bannerT-=t,this.bannerT<=0&&(this.banner.style.opacity=0,this.bannerSub.style.opacity=0)),this.damageA=de(this.damageA,i.damageFlash*.6+(i.health<30?.25:0),8,t),this.damage.style.opacity=this.damageA,this.updateControls(),this.drawMinimap(),this.mapOpen&&(this.mapT+=t,this.mapT>.25&&(this.mapT=0,this.drawBigMap()))}drawMinimap(){const t=this.game,e=t.player,i=this.mctx,n=220,s=n/2,a=e.vehicle?1.4:2;i.clearRect(0,0,n,n),i.save(),i.beginPath(),i.arc(s,s,s-4,0,6.28),i.clip();const o=t.rig.yaw,l=-Math.sin(o),c=-Math.cos(o),h=-Math.PI/2-Math.atan2(c,l);i.translate(s,s+20),i.rotate(h),i.scale(a/this.mapPx,a/this.mapPx),i.translate(-(e.x+this.mapR)*this.mapPx,-(e.z+this.mapR)*this.mapPx),i.drawImage(this.mapImg,0,0),i.restore(),i.save(),i.beginPath(),i.arc(s,s,s-4,0,6.28),i.clip(),i.translate(s,s+20),i.rotate(h);const u=x=>{let p=(x.x-e.x)*a,m=(x.z-e.z)*a;const y=Math.hypot(p,m),M=s-14;let v=!1;y>M&&(p*=M/y,m*=M/y,v=!0),i.save(),i.translate(p,m),i.rotate(-h),i.fillStyle=x.color,i.strokeStyle="rgba(0,0,0,0.7)",i.lineWidth=1.5;const b=x.size||6;x.kind==="cop"?(i.beginPath(),i.arc(0,0,b*.7,0,6.28),i.fill(),i.stroke()):x.kind==="store"?(i.beginPath(),i.arc(0,0,b,0,6.28),i.fill(),i.stroke(),i.fillStyle="#000",i.font="bold 9px sans-serif",i.textAlign="center",i.fillText(x.label,0,3.5)):x.kind==="mission"?(i.beginPath(),i.moveTo(0,-b-1),i.lineTo(b+1,0),i.lineTo(0,b+1),i.lineTo(-b-1,0),i.closePath(),i.fill(),i.stroke(),i.fillStyle="#000",i.font="bold 9px sans-serif",i.textAlign="center",i.fillText(x.label,0,3.5)):x.kind==="car"?(i.beginPath(),i.rect(-b*.6,-b*.6,b*1.2,b*1.2),i.fill(),i.stroke()):(i.beginPath(),i.moveTo(0,-b),i.lineTo(b,0),i.lineTo(0,b),i.lineTo(-b,0),i.closePath(),i.fill(),i.stroke()),v&&(i.globalAlpha=.9),i.restore()};for(const x of this.blips)u(x);i.restore(),i.save(),i.translate(s,s+20);const f=e.heading,d=Math.sin(f),g=Math.cos(f);i.rotate(h+Math.atan2(d,-g)),i.fillStyle="#fff",i.strokeStyle="#000",i.lineWidth=1.5,i.beginPath(),i.moveTo(0,-9),i.lineTo(6,7),i.lineTo(0,4),i.lineTo(-6,7),i.closePath(),i.fill(),i.stroke(),i.restore(),i.save(),i.translate(s,s+20),i.rotate(h),i.translate(0,-94),i.rotate(-h),i.fillStyle="#fff",i.font="bold 11px sans-serif",i.textAlign="center",i.fillText("N",0,4),i.restore()}drawBigMap(){const t=this.game,e=t.player,i=this.bctx,n=700,s=this.mapR,a=n/(s*2);if(!this.bigBase){const u=document.createElement("canvas");u.width=u.height=n,u.getContext("2d").drawImage(this.mapImg,0,0,n,n),this.bigBase=u}i.clearRect(0,0,n,n),i.drawImage(this.bigBase,0,0);const o=(u,f)=>[(u+s)*a,(f+s)*a];for(const u of this.blips){const[f,d]=o(u.x,u.z);i.fillStyle=u.color,i.strokeStyle="#000",i.lineWidth=1.5;const g=u.kind==="store"||u.kind==="mission"?8:u.kind==="pickup"?3:5;i.beginPath(),i.arc(f,d,g,0,6.28),i.fill(),i.stroke(),u.label&&(i.fillStyle="#000",i.font="bold 10px sans-serif",i.textAlign="center",i.fillText(u.label,f,d+3.5)),u.name&&(i.fillStyle="#fff",i.strokeStyle="rgba(0,0,0,0.8)",i.lineWidth=3,i.font="bold 11px sans-serif",i.strokeText(u.name,f,d-11),i.fillText(u.name,f,d-11)),u.guide&&(i.strokeStyle="#ffd24a",i.lineWidth=2,i.beginPath(),i.arc(f,d,13+Math.sin(this.game.time*6)*2,0,6.28),i.stroke())}for(const u of this.game.stores.stores){const[f,d]=o(u.doorX,u.doorZ);i.fillStyle=u.color,i.strokeStyle="#000",i.lineWidth=1.5,i.beginPath(),i.arc(f,d,8,0,6.28),i.fill(),i.stroke(),i.fillStyle="#000",i.font="bold 10px sans-serif",i.textAlign="center",i.fillText(u.kind==="gun"?"A":u.kind==="food"?"B":u.kind==="clothes"?"T":"S",f,d+3.5)}for(const[u,f,d]of[["Hospital",this.game.hospital,"#ff7070"],["Police",this.game.station,"#7fa0ff"]]){const[g,x]=o(f.x,f.z);i.fillStyle=d,i.strokeStyle="#000",i.beginPath(),i.rect(g-6,x-6,12,12),i.fill(),i.stroke(),i.fillStyle="#fff",i.strokeStyle="rgba(0,0,0,0.8)",i.lineWidth=3,i.font="bold 11px sans-serif",i.textAlign="center",i.strokeText(u,g,x-10),i.fillText(u,g,x-10)}const[l,c]=o(e.x,e.z);i.save(),i.translate(l,c),i.rotate(Math.atan2(Math.sin(e.heading),-Math.cos(e.heading))),i.fillStyle="#fff",i.strokeStyle="#000",i.beginPath(),i.moveTo(0,-9),i.lineTo(6,7),i.lineTo(0,4),i.lineTo(-6,7),i.closePath(),i.fill(),i.stroke(),i.restore(),i.fillStyle="#fff",i.font="bold 14px sans-serif",i.textAlign="center";const h=[["Downtown",500,500],["Eastside",770,500],["Santa Maria Beach",500,930],["Los Santos Airport",280,770],["Ocean Docks",845,440],["Financial",-680,-250],["Easter Basin",-445,0],["The Strip",430,-720],["Venturas Airport",705,-885],["Bone County",-40,-690],["Red County",-150,60],["Mount Chiliad",-760,640],["Shady Creeks",-680,480]];for(const[u,f,d]of h){const[g,x]=o(f,d);i.strokeStyle="rgba(0,0,0,0.8)",i.lineWidth=3,i.strokeText(u,g,x),i.fillText(u,g,x)}}}const wh=3e3,ae=(r,t=.8,e={})=>new Et({color:r,roughness:t,...e});function xo(r,t){const e=document.createElement("canvas");e.width=512,e.height=128;const i=e.getContext("2d");i.fillStyle="#111",i.fillRect(0,0,512,128),i.fillStyle=t,i.fillRect(6,6,500,116),i.fillStyle="#111",i.fillRect(12,12,488,104),i.font="bold 64px Impact, Arial Narrow, sans-serif",i.textAlign="center",i.textBaseline="middle",i.fillStyle=t,i.shadowColor=t,i.shadowBlur=18,i.fillText(r,256,66);const n=new Ma(e);return n.colorSpace=ii,n}const vo=[{name:"Street",shirt:16053492,pants:3100559,price:0},{name:"Blackout",shirt:1381653,pants:1052688,price:200},{name:"Tourist",shirt:16740259,pants:14271631,price:150},{name:"Vice",shirt:8382463,pants:16316664,price:300},{name:"Suit",shirt:3817290,pants:2895928,price:500},{name:"Hi-Vis",shirt:16757504,pants:2829099,price:120},{name:"Track",shirt:3066993,pants:1999945,price:180}];class Dv{constructor(t){this.game=t,this.stores=[],this.interior=null,this.shopOpen=null,this.fadeT=0,this.cooldown=0,this.roomLights=[];for(let s=0;s<3;s++){const a=new rr(16773596,0,16,1.6);a.position.set(0,-100,0),t.scene.add(a),this.roomLights.push(a)}const e=t.city,i=(s,a)=>e.blocks.find(o=>o.i===s&&o.j===a);[{id:"ammu",name:"AMMU-NATION",color:"#ff8c1a",hex:16747546,block:i(17,18),side:"S",kind:"gun",greet:["Welcome to Ammu-Nation. Protect yourself, friend.","Second amendment special today. What'll it be?"]},{id:"ammu2",name:"AMMU-NATION",color:"#ff8c1a",hex:16747546,block:i(5,10),side:"W",kind:"gun",greet:["Guns, ammo, body armor. No questions asked."]},{id:"burger",name:"BURGER SHOT",color:"#ff3b7a",hex:16726906,block:i(19,21),side:"N",kind:"food",greet:["Welcome to Burger Shot! Would you like to go large?","Hey! Our burgers are 40% real meat now!"]},{id:"burger2",name:"BURGER SHOT",color:"#ff3b7a",hex:16726906,block:i(18,2),side:"E",kind:"food",greet:["Fresh off the grill. Mostly."]},{id:"cloth",name:"THREADS",color:"#3bd1ff",hex:3920383,block:i(19,3),side:"S",kind:"clothes",greet:["Looking sharp is a lifestyle. Pick an outfit.","You've got the walk, now get the look."]},{id:"spray",name:"PAY 'N' SPRAY",color:"#2bff88",hex:2883464,block:i(21,20),side:"E",kind:"spray"}].forEach((s,a)=>this.buildStore(s,a))}buildStore(t,e){const i=this.game,n=i.city,s=t.block;let a,o,l;const c=.5;t.side==="S"?(a=s.x0+(s.x1-s.x0)*c,o=s.z1+.2,l=0):t.side==="N"?(a=s.x0+(s.x1-s.x0)*c,o=s.z0-.2,l=Math.PI):t.side==="E"?(a=s.x1+.2,o=s.z0+(s.z1-s.z0)*c,l=Math.PI/2):(a=s.x0-.2,o=s.z0+(s.z1-s.z0)*c,l=-Math.PI/2);const h={...t,x:a,z:o,rot:l,index:e},u=Math.sin(l),f=Math.cos(l);h.doorX=a+u*1.6,h.doorZ=o+f*1.6;const d=new Ee;if(d.position.set(a,Ne.CURB,o),d.rotation.y=l,i.scene.add(d),t.kind!=="spray"){const x=new G(new Ft(8,1.6,.3),[ae(1118481),ae(1118481),ae(1118481),ae(1118481),new pe({map:xo(t.name,t.color),toneMapped:!1}),ae(1118481)]);x.position.set(0,4.2,.35),d.add(x);const p=new G(new Ft(8.4,.12,1.8),ae(t.hex,.9));p.position.set(0,3.3,1),p.castShadow=!0,d.add(p);const m=new G(new Ft(2.2,3,.15),ae(858918,.2,{metalness:.7}));m.position.set(0,1.5,.12),d.add(m);const y=new G(new Ft(2.6,3.2,.1),ae(14540253,.5));y.position.set(0,1.6,.06),d.add(y);for(const M of[-3,3]){const v=new G(new Ft(3.4,2.2,.12),ae(1716036,.15,{metalness:.8}));v.position.set(M,1.7,.12),d.add(v)}this.buildInterior(h)}else{const x=new Ee;x.position.set(a+u*7,0,o+f*7),x.rotation.y=l,i.scene.add(x);const p=new G(new Ft(8,1.6,.3),[ae(1118481),ae(1118481),ae(1118481),ae(1118481),new pe({map:xo(t.name,t.color),toneMapped:!1}),ae(1118481)]);p.position.set(0,4.2,.35),d.add(p);const m=new G(new Ft(9,.3,8),ae(5593952));m.position.set(0,4.3,0),m.castShadow=!0,x.add(m);for(const y of[-4.4,4.4]){const M=new G(new Ft(.3,4.3,.3),ae(5593952));M.position.set(y,2.15,-3.7),x.add(M);const v=M.clone();v.position.z=3.7,x.add(v)}h.doorX=x.position.x,h.doorZ=x.position.z}const g=new G(new Zt(t.kind==="spray"?3.2:1.1,t.kind==="spray"?3.2:1.1,t.kind==="spray"?2:1.2,24,1,!0),new pe({color:t.hex,transparent:!0,opacity:.35,side:Ve,depthWrite:!1,toneMapped:!1}));g.position.set(h.doorX,n.groundHeight(h.doorX,h.doorZ)+.7,h.doorZ),i.scene.add(g),h.ring=g,this.stores.push(h)}buildInterior(t){const e=this.game,i=wh,n=wh+t.index*120,s=16,a=12,o=4;t.int={x:i,z:n,spawnX:i,spawnZ:n+a/2-2,exitX:i,exitZ:n+a/2-1.2,counterX:i,counterZ:n-a/2+4.6};const l=new Ee;l.position.set(i,0,n),e.scene.add(l);const c=ae(t.kind==="food"?14207400:t.kind==="gun"?3948356:15262424,.8),h=new G(new Ft(s,.2,a),c);h.position.y=-.1,h.receiveShadow=!0,l.add(h);const u=ae(t.kind==="food"?15918792:t.kind==="gun"?9056047:16250871,.9),f=[[0,o/2,-a/2,s,o,.3],[0,o/2,a/2,s,o,.3],[-s/2,o/2,0,.3,o,a],[s/2,o/2,0,.3,o,a]];for(const[v,b,_,T,C,w]of f){const S=new G(new Ft(T,C,w),u);S.position.set(v,b,_),S.receiveShadow=!0,l.add(S),e.city.addCollider(i+v-T/2,n+_-w/2,i+v+T/2,n+_+w/2,"building",o)}const d=new G(new Ft(s,.3,a),ae(14540253));d.position.y=o,d.castShadow=!0,l.add(d);const g=new G(new Ft(2.2,3,.2),ae(858918,.2,{metalness:.7}));g.position.set(0,1.5,a/2-.25),l.add(g);for(const[v,b]of[[-4,-2],[4,-2],[0,3]]){const _=new G(new Ft(1.2,.1,.4),new pe({color:16774880}));_.position.set(v,o-.2,b),l.add(_)}t.int.lights=[[-4,o-.4,-2],[4,o-.4,-2],[0,o-.4,3]];const x=new G(new Ft(7,1.1,1.2),ae(t.kind==="food"?12597547:2829099,.5));x.position.set(0,.55,-a/2+2.6),x.castShadow=!0,l.add(x);const p=new G(new Ft(7.2,.08,1.4),ae(15658734,.2,{metalness:.5}));if(p.position.set(0,1.12,-a/2+2.6),l.add(p),e.city.addCollider(i-3.5,n-a/2+2,i+3.5,n-a/2+3.2,"prop",1.2),t.kind==="gun"){for(let T=0;T<6;T++){const C=new G(new Ft(.1,.5,1.4),ae(1118481,.3,{metalness:.6}));C.position.set(-s/2+.3,1.6+T%3*.7,-3+Math.floor(T/3)*3),l.add(C)}for(let T=0;T<6;T++){const C=new G(new Ft(.1,.5,1.4),ae(1118481,.3,{metalness:.6}));C.position.set(s/2-.3,1.6+T%3*.7,-3+Math.floor(T/3)*3),l.add(C)}const v=new G(new Ft(1.2,1.8,.05),ae(16053492));v.position.set(0,2.2,-a/2+.2),l.add(v);const b=new G(new lr(.15,.5,24),new pe({color:16719904,side:Ve}));b.position.set(0,2.3,-a/2+.24),l.add(b);const _=new G(new Ft(6.8,.6,1),ae(8956620,.1,{transparent:!0,opacity:.35}));_.position.set(0,1.45,-a/2+2.6),l.add(_)}else if(t.kind==="food"){for(const[_,T]of[[-4.5,1],[4.5,1],[-4.5,4],[4.5,4]]){const C=new G(new Zt(.8,.8,.08,16),ae(16448250,.4));C.position.set(_,.8,T),l.add(C);const w=new G(new Zt(.08,.2,.8,8),ae(8947848));w.position.set(_,.4,T),l.add(w);for(const S of[0,Math.PI]){const P=new G(new Ft(.5,.5,.5),ae(12597547));P.position.set(_+Math.cos(S)*1.3,.25,T+Math.sin(S)*1.3),l.add(P)}e.city.addCollider(i+_-.8,n+T-.8,i+_+.8,n+T+.8,"prop",1)}const v=new G(new Ft(5,1.2,.05),new pe({map:xo("BURGERS • FRIES • SODA","#ffd24a"),toneMapped:!1}));v.position.set(0,3,-a/2+.2),l.add(v);const b=new G(new Ft(3,1.4,1),ae(12568009,.3,{metalness:.8}));b.position.set(-3,.7,-a/2+.8),l.add(b)}else{for(let b=0;b<8;b++){const _=b<4?-s/2+1.2:s/2-1.2,T=-3+b%4*2.2,C=new G(new Ft(.06,.06,1.8),ae(11184810,.3,{metalness:.8}));C.position.set(_,1.7,T),l.add(C);for(let w=0;w<4;w++){const S=new G(new Ft(.06,.7,.35),ae(vo[(b+w)%vo.length].shirt,.9));S.position.set(_,1.3,T-.7+w*.45),l.add(S)}e.city.addCollider(i+_-.3,n+T-1,i+_+.3,n+T+1,"prop",2)}const v=new G(new Ft(2.4,3,.05),ae(12376302,.05,{metalness:1}));v.position.set(4,1.8,-a/2+.2),l.add(v)}const m=new xn(e,i,n-a/2+1.4,{kind:"clerk",shirt:t.kind==="food"?16726906:t.kind==="gun"?3815994:3920383,pants:2236962});m.heading=0,m.waitT=1e12,m.important=!0,m.state="idle",m.store=t,m.syncMesh(),e.peds.push(m),t.clerk=m;const y=new G(new Zt(.9,.9,1.2,24,1,!0),new pe({color:16765514,transparent:!0,opacity:.3,side:Ve,depthWrite:!1}));y.position.set(t.int.exitX,.6,t.int.exitZ),e.scene.add(y);const M=new G(new Zt(.9,.9,1.2,24,1,!0),new pe({color:t.hex,transparent:!0,opacity:.3,side:Ve,depthWrite:!1}));M.position.set(t.int.counterX,.6,t.int.counterZ),e.scene.add(M)}items(t){const e=this.game.player;return t.kind==="gun"?[{name:"Pistol ammo (34)",price:150,buy:()=>e.giveWeapon("pistol",34)},{name:"Uzi + 90 rounds",price:600,buy:()=>e.giveWeapon("uzi",90)},{name:"Shotgun + 24 shells",price:800,buy:()=>e.giveWeapon("shotgun",24)},{name:"Rifle + 30 rounds",price:1200,buy:()=>e.giveWeapon("rifle",30)},{name:"RPG + 3 rockets",price:2500,buy:()=>e.giveWeapon("rpg",3)},{name:"Body armor",price:250,buy:()=>{e.armor=100}}]:t.kind==="food"?[{name:"Soda (+10 hp)",price:3,buy:()=>{e.health=Math.min(100,e.health+10)}},{name:"Burger (+40 hp)",price:12,buy:()=>{e.health=Math.min(100,e.health+40)}},{name:"Double Meal (+100 hp)",price:25,buy:()=>{e.health=100}}]:vo.map(i=>({name:`${i.name} outfit`,price:i.price,buy:()=>e.setOutfit(i.shirt,i.pants)}))}openShop(t){const e=this.game;this.shopOpen=t,e.hud.showShop(t.name,this.items(t),t.color),t.clerk&&t.greet&&e.hud.speak(t.clerk,He(t.greet),3500)}closeShop(){this.shopOpen=null,this.game.hud.hideShop()}buy(t){const e=this.shopOpen;if(!e)return;const i=this.items(e)[t];if(!i)return;const n=this.game.player;if(n.money<i.price){this.game.hud.notify("You can't afford that",1500),this.game.hud.speak(e.clerk,"No cash, no goods, pal.",2e3);return}n.money-=i.price,i.price>0&&this.game.hud.moneyPop(-i.price),i.buy(),this.game.audio.cash(),this.game.hud.notify(`Bought ${i.name}`,1500),this.game.hud.speak(e.clerk,He(["Pleasure doing business.","Come again!","Good choice."]),2e3)}enter(t){const e=this.game,i=e.player;this.interior=t,this.cooldown=1.2,this.fadeT=.5,this.roomLights.forEach((n,s)=>{const[a,o,l]=t.int.lights[s];n.position.set(t.int.x+a,o,t.int.z+l),n.intensity=18}),i.setPosition(t.int.spawnX,t.int.spawnZ,Math.PI),e.rig.snapBehind(Math.PI),e.rig.pos.set(i.x,2,i.z+4),e.audio.ui(),e.hud.notify(`${t.name}`,2e3)}exit(){const t=this.game,e=t.player,i=this.interior;this.interior=null,this.cooldown=1.2,this.fadeT=.5,this.closeShop();for(const n of this.roomLights)n.intensity=0;e.setPosition(i.doorX+Math.sin(i.rot)*1.5,i.doorZ+Math.cos(i.rot)*1.5,i.rot),t.rig.snapBehind(i.rot),t.rig.pos.set(e.x-Math.sin(i.rot)*4,2,e.z-Math.cos(i.rot)*4),t.audio.ui()}update(t){const e=this.game,i=e.player,n=e.input,s=e.time;this.cooldown=Math.max(0,this.cooldown-t),this.fadeT=Math.max(0,this.fadeT-t);for(const a of this.stores)a.ring.material.opacity=.25+.12*Math.sin(s*3+a.index);if(i.dead||i.busted){this.shopOpen&&this.closeShop();return}if(this.shopOpen){for(let a=0;a<9;a++)n.hitCode("Digit"+(a+1))&&this.buy(a);(n.hit("interact")||n.hitCode("Escape")||bt(i.x,i.z,this.shopOpen.int.counterX,this.shopOpen.int.counterZ)>3.5)&&this.closeShop();return}if(this.interior){const a=this.interior;if(this.cooldown<=0&&bt(i.x,i.z,a.int.exitX,a.int.exitZ)<1.4){this.exit();return}bt(i.x,i.z,a.int.counterX,a.int.counterZ)<2.2&&(e.hud.setHint("Press E to shop"),n.hit("interact")&&this.openShop(a));return}if(!(this.cooldown>0))for(const a of this.stores){if(a.kind==="spray"){if(i.vehicle&&bt(i.x,i.z,a.doorX,a.doorZ)<3.5&&i.vehicle.absSpeed<1.5){if(i.money<100){e.hud.notify("Pay 'n' Spray costs $100",1500),this.cooldown=3;continue}i.money-=100,e.hud.moneyPop(-100);const o=i.vehicle;o.health=100,o.onFire=!1,o.fireT=0,o.paint.color.setHex(He(o.type.colors)),e.police.clear(),e.hud.notify("Resprayed. The cops lost your trail.",3e3),e.audio.cash(),this.cooldown=4,this.fadeT=.6}continue}if(!i.vehicle&&bt(i.x,i.z,a.doorX,a.doorZ)<1.5){this.enter(a);return}}}}const ur=new we;ur.setAttribute("position",new Pe(new Float32Array([-1,-1,3,-1,-1,3]),2));ur.setAttribute("uv",new Pe(new Float32Array([0,0,2,0,0,2]),2));ur.boundingSphere=new tn;ur.computeBoundingSphere=function(){};const Lv=new va;class cs{constructor(t){this._mesh=new G(ur,t),this._mesh.frustumCulled=!1}render(t){t.render(this._mesh,Lv)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}dispose(){this._mesh.material.dispose(),this._mesh.geometry.dispose()}}const zv={uniforms:{sceneDiffuse:{value:null},sceneDepth:{value:null},sceneNormal:{value:null},projMat:{value:new Vt},viewMat:{value:new Vt},projViewMat:{value:new Vt},projectionMatrixInv:{value:new Vt},viewMatrixInv:{value:new Vt},cameraPos:{value:new D},resolution:{value:new it},biasAdjustment:{value:new it},time:{value:0},samples:{value:[]},bluenoise:{value:null},distanceFalloff:{value:1},radius:{value:5},near:{value:.1},far:{value:1e3},logDepth:{value:!1},ortho:{value:!1},screenSpaceRadius:{value:!1},frame:{value:0}},depthWrite:!1,depthTest:!1,vertexShader:`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1);
}`,fragmentShader:`
    #define SAMPLES 16
    #define FSAMPLES 16.0
uniform sampler2D sceneDiffuse;
uniform highp sampler2D sceneNormal;
uniform highp sampler2D sceneDepth;
uniform mat4 projectionMatrixInv;
uniform mat4 viewMatrixInv;
uniform mat4 projMat;
uniform mat4 viewMat;
uniform mat4 projViewMat;
uniform vec3 cameraPos;
uniform vec2 resolution;
uniform vec2 biasAdjustment;
uniform float time;
uniform vec3[SAMPLES] samples;
uniform float radius;
uniform float distanceFalloff;
uniform float near;
uniform float far;
uniform float frame;
uniform bool logDepth;
uniform bool ortho;
uniform bool screenSpaceRadius;
uniform sampler2D bluenoise;
    varying vec2 vUv;
    highp float linearize_depth(highp float d, highp float zNear,highp float zFar)
    {
        return (zFar * zNear) / (zFar - d * (zFar - zNear));
    }
    highp float linearize_depth_ortho(highp float d, highp float nearZ, highp float farZ) {
      return nearZ + (farZ - nearZ) * d;
    }
    highp float linearize_depth_log(highp float d, highp float nearZ,highp float farZ) {
      float depth = pow(2.0, d * log2(farZ + 1.0)) - 1.0;
      float a = farZ / (farZ - nearZ);
      float b = farZ * nearZ / (nearZ - farZ);
      float linDepth = a + b / depth;
      /*return ortho ? linearize_depth_ortho(
        linDepth,
        nearZ,
        farZ
      ) :linearize_depth(linDepth, nearZ, farZ);*/
       #ifdef ORTHO

       return linearize_depth_ortho(d, nearZ, farZ);

        #else
        return linearize_depth(linDepth, nearZ, farZ);
        #endif
    }

    vec3 getWorldPosLog(vec3 posS) {
      vec2 uv = posS.xy;
      float z = posS.z;
      float nearZ =near;
      float farZ = far;
      float depth = pow(2.0, z * log2(farZ + 1.0)) - 1.0;
      float a = farZ / (farZ - nearZ);
      float b = farZ * nearZ / (nearZ - farZ);
      float linDepth = a + b / depth;
      vec4 clipVec = vec4(uv, linDepth, 1.0) * 2.0 - 1.0;
      vec4 wpos = projectionMatrixInv * clipVec;
      return wpos.xyz / wpos.w;
    }
    vec3 getWorldPos(float depth, vec2 coord) {
      #ifdef LOGDEPTH
        #ifndef ORTHO
          return getWorldPosLog(vec3(coord, depth));
        #endif
      #endif
      float z = depth * 2.0 - 1.0;
      vec4 clipSpacePosition = vec4(coord * 2.0 - 1.0, z, 1.0);
      vec4 viewSpacePosition = projectionMatrixInv * clipSpacePosition;
      // Perspective division
     vec4 worldSpacePosition = viewSpacePosition;
     worldSpacePosition.xyz /= worldSpacePosition.w;
      return worldSpacePosition.xyz;
  }

  vec3 computeNormal(vec3 worldPos, vec2 vUv) {
    ivec2 p = ivec2(vUv * resolution);
    float c0 = texelFetch(sceneDepth, p, 0).x;
    float l2 = texelFetch(sceneDepth, p - ivec2(2, 0), 0).x;
    float l1 = texelFetch(sceneDepth, p - ivec2(1, 0), 0).x;
    float r1 = texelFetch(sceneDepth, p + ivec2(1, 0), 0).x;
    float r2 = texelFetch(sceneDepth, p + ivec2(2, 0), 0).x;
    float b2 = texelFetch(sceneDepth, p - ivec2(0, 2), 0).x;
    float b1 = texelFetch(sceneDepth, p - ivec2(0, 1), 0).x;
    float t1 = texelFetch(sceneDepth, p + ivec2(0, 1), 0).x;
    float t2 = texelFetch(sceneDepth, p + ivec2(0, 2), 0).x;

    float dl = abs((2.0 * l1 - l2) - c0);
    float dr = abs((2.0 * r1 - r2) - c0);
    float db = abs((2.0 * b1 - b2) - c0);
    float dt = abs((2.0 * t1 - t2) - c0);

    vec3 ce = getWorldPos(c0, vUv).xyz;

    vec3 dpdx = (dl < dr) ? ce - getWorldPos(l1, (vUv - vec2(1.0 / resolution.x, 0.0))).xyz
                          : -ce + getWorldPos(r1, (vUv + vec2(1.0 / resolution.x, 0.0))).xyz;
    vec3 dpdy = (db < dt) ? ce - getWorldPos(b1, (vUv - vec2(0.0, 1.0 / resolution.y))).xyz
                          : -ce + getWorldPos(t1, (vUv + vec2(0.0, 1.0 / resolution.y))).xyz;

    return normalize(cross(dpdx, dpdy));
}

mat3 makeRotationZ(float theta) {
	float c = cos(theta);
	float s = sin(theta);
	return mat3(c, - s, 0,
			s,  c, 0,
			0,  0, 1);
  }

void main() {
      vec4 diffuse = texture2D(sceneDiffuse, vUv);
      float depth = texture2D(sceneDepth, vUv).x;
      if (depth == 1.0) {
        gl_FragColor = vec4(vec3(1.0), 1.0);
        return;
      }
      vec3 worldPos = getWorldPos(depth, vUv);
      #ifdef HALFRES
        vec3 normal = texture2D(sceneNormal, vUv).rgb;
      #else
        vec3 normal = computeNormal(worldPos, vUv);
      #endif
      vec4 noise = texture2D(bluenoise, gl_FragCoord.xy / 128.0);
      vec2 harmoniousNumbers = vec2(
        1.618033988749895,
        1.324717957244746
      );
      noise.rg += harmoniousNumbers * frame;
      noise.rg = fract(noise.rg);
        vec3 helperVec = vec3(0.0, 1.0, 0.0);
        if (dot(helperVec, normal) > 0.99) {
          helperVec = vec3(1.0, 0.0, 0.0);
        }
        vec3 tangent = normalize(cross(helperVec, normal));
        vec3 bitangent = cross(normal, tangent);
        mediump mat3 tbn = mat3(tangent, bitangent, normal) *  makeRotationZ( noise.r * 3.1415962 * 2.0) ;

      mediump float occluded = 0.0;
      mediump float totalWeight = 0.0;
      float radiusToUse = screenSpaceRadius ? distance(
        worldPos,
        getWorldPos(depth, vUv +
          vec2(radius, 0.0) / resolution)
      ) : radius;
      float distanceFalloffToUse =screenSpaceRadius ?
          radiusToUse * distanceFalloff
      : radiusToUse * distanceFalloff * 0.2;
      float bias = (min(
        0.1,
        distanceFalloffToUse * 0.1
      ) / near) * fwidth(distance(worldPos, cameraPos)) / radiusToUse;
      bias = biasAdjustment.x + biasAdjustment.y * bias;
      mediump float offsetMove = noise.g;
      mediump float offsetMoveInv = 1.0 / FSAMPLES;
      float farTimesNear = far * near;
      float farMinusNear = far - near;
      
      for(int i = 0; i < SAMPLES; i++) {
        mediump vec3 sampleDirection = tbn * samples[i];

        float moveAmt = fract(offsetMove);
        offsetMove += offsetMoveInv;
        vec3 samplePos = worldPos + radiusToUse * moveAmt * sampleDirection;
        vec4 offset = projMat * vec4(samplePos, 1.0);
        offset.xyz /= offset.w;
        offset.xyz = offset.xyz * 0.5 + 0.5;
        
        if (all(greaterThan(offset.xyz * (1.0 - offset.xyz), vec3(0.0)))) {
          float sampleDepth = textureLod(sceneDepth, offset.xy, 0.0).x;

          /*#ifdef LOGDEPTH
          float distSample = linearize_depth_log(sampleDepth, near, far);
      #else
          #ifdef ORTHO
              float distSample = near + farMinusNear * sampleDepth;
          #else
              float distSample = (farTimesNear) / (far - sampleDepth * farMinusNear);
          #endif
      #endif*/
      #ifdef ORTHO
          float distSample = near + sampleDepth * farMinusNear;
      #else
          #ifdef LOGDEPTH
              float distSample = linearize_depth_log(sampleDepth, near, far);
          #else
              float distSample = (farTimesNear) / (far - sampleDepth * farMinusNear);
          #endif
      #endif
      
      #ifdef ORTHO
          float distWorld = near + offset.z * farMinusNear;
      #else
          float distWorld = (farTimesNear) / (far - offset.z * farMinusNear);
      #endif
          
          mediump float rangeCheck = smoothstep(0.0, 1.0, distanceFalloffToUse / (abs(distSample - distWorld)));
          vec2 diff = gl_FragCoord.xy - floor(offset.xy * resolution);
          occluded += rangeCheck * float(distSample != distWorld) * float(sampleDepth != depth) * step(distSample + bias, distWorld) * step(
            1.0,
            dot(diff, diff)
          );
          
          totalWeight ++;
        }
      }
      float occ = clamp(1.0 - occluded / (totalWeight == 0.0 ? 1.0 : totalWeight), 0.0, 1.0);
      gl_FragColor = vec4(occ, 0.5 + 0.5 * normal);
}`},Iv={uniforms:{sceneDiffuse:{value:null},sceneDepth:{value:null},tDiffuse:{value:null},transparencyDWFalse:{value:null},transparencyDWTrue:{value:null},transparencyDWTrueDepth:{value:null},transparencyAware:{value:!1},projMat:{value:new Vt},viewMat:{value:new Vt},projectionMatrixInv:{value:new Vt},viewMatrixInv:{value:new Vt},cameraPos:{value:new D},resolution:{value:new it},color:{value:new D(0,0,0)},blueNoise:{value:null},downsampledDepth:{value:null},time:{value:0},intensity:{value:10},renderMode:{value:0},gammaCorrection:{value:!1},logDepth:{value:!1},ortho:{value:!1},near:{value:.1},far:{value:1e3},screenSpaceRadius:{value:!1},radius:{value:0},distanceFalloff:{value:1},fog:{value:!1},fogExp:{value:!1},fogDensity:{value:0},fogNear:{value:1/0},fogFar:{value:1/0},colorMultiply:{value:!0},aoTones:{value:0}},depthWrite:!1,depthTest:!1,vertexShader:`
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = vec4(position, 1);
		}`,fragmentShader:`
		uniform sampler2D sceneDiffuse;
    uniform highp sampler2D sceneDepth;
    uniform highp sampler2D downsampledDepth;
    uniform highp sampler2D transparencyDWFalse;
    uniform highp sampler2D transparencyDWTrue;
    uniform highp sampler2D transparencyDWTrueDepth;
    uniform sampler2D tDiffuse;
    uniform sampler2D blueNoise;
    uniform vec2 resolution;
    uniform vec3 color;
    uniform mat4 projectionMatrixInv;
    uniform mat4 viewMatrixInv;
    uniform float intensity;
    uniform float renderMode;
    uniform float near;
    uniform float far;
    uniform float aoTones;
    uniform bool gammaCorrection;
    uniform bool logDepth;
    uniform bool ortho;
    uniform bool screenSpaceRadius;
    uniform bool fog;
    uniform bool fogExp;
    uniform bool colorMultiply;
    uniform bool transparencyAware;
    uniform float fogDensity;
    uniform float fogNear;
    uniform float fogFar;
    uniform float radius;
    uniform float distanceFalloff;
    uniform vec3 cameraPos;
    varying vec2 vUv;
    highp float linearize_depth(highp float d, highp float zNear,highp float zFar)
    {
        return (zFar * zNear) / (zFar - d * (zFar - zNear));
    }
    highp float linearize_depth_ortho(highp float d, highp float nearZ, highp float farZ) {
      return nearZ + (farZ - nearZ) * d;
    }
    highp float linearize_depth_log(highp float d, highp float nearZ,highp float farZ) {
      float depth = pow(2.0, d * log2(farZ + 1.0)) - 1.0;
      float a = farZ / (farZ - nearZ);
      float b = farZ * nearZ / (nearZ - farZ);
      float linDepth = a + b / depth;
      return ortho ? linearize_depth_ortho(
        linDepth,
        nearZ,
        farZ
      ) :linearize_depth(linDepth, nearZ, farZ);
    }
    vec3 getWorldPosLog(vec3 posS) {
        vec2 uv = posS.xy;
        float z = posS.z;
        float nearZ =near;
        float farZ = far;
        float depth = pow(2.0, z * log2(farZ + 1.0)) - 1.0;
        float a = farZ / (farZ - nearZ);
        float b = farZ * nearZ / (nearZ - farZ);
        float linDepth = a + b / depth;
        vec4 clipVec = vec4(uv, linDepth, 1.0) * 2.0 - 1.0;
        vec4 wpos = projectionMatrixInv * clipVec;
        return wpos.xyz / wpos.w;
      }
      vec3 getWorldPos(float depth, vec2 coord) {
       // if (logDepth) {
        #ifdef LOGDEPTH
          #ifndef ORTHO
            return getWorldPosLog(vec3(coord, depth));
          #endif
        #endif
      //  }
        float z = depth * 2.0 - 1.0;
        vec4 clipSpacePosition = vec4(coord * 2.0 - 1.0, z, 1.0);
        vec4 viewSpacePosition = projectionMatrixInv * clipSpacePosition;
        // Perspective division
       vec4 worldSpacePosition = viewSpacePosition;
       worldSpacePosition.xyz /= worldSpacePosition.w;
        return worldSpacePosition.xyz;
    }
  
    vec3 computeNormal(vec3 worldPos, vec2 vUv) {
      ivec2 p = ivec2(vUv * resolution);
      float c0 = texelFetch(sceneDepth, p, 0).x;
      float l2 = texelFetch(sceneDepth, p - ivec2(2, 0), 0).x;
      float l1 = texelFetch(sceneDepth, p - ivec2(1, 0), 0).x;
      float r1 = texelFetch(sceneDepth, p + ivec2(1, 0), 0).x;
      float r2 = texelFetch(sceneDepth, p + ivec2(2, 0), 0).x;
      float b2 = texelFetch(sceneDepth, p - ivec2(0, 2), 0).x;
      float b1 = texelFetch(sceneDepth, p - ivec2(0, 1), 0).x;
      float t1 = texelFetch(sceneDepth, p + ivec2(0, 1), 0).x;
      float t2 = texelFetch(sceneDepth, p + ivec2(0, 2), 0).x;
  
      float dl = abs((2.0 * l1 - l2) - c0);
      float dr = abs((2.0 * r1 - r2) - c0);
      float db = abs((2.0 * b1 - b2) - c0);
      float dt = abs((2.0 * t1 - t2) - c0);
  
      vec3 ce = getWorldPos(c0, vUv).xyz;
  
      vec3 dpdx = (dl < dr) ? ce - getWorldPos(l1, (vUv - vec2(1.0 / resolution.x, 0.0))).xyz
                            : -ce + getWorldPos(r1, (vUv + vec2(1.0 / resolution.x, 0.0))).xyz;
      vec3 dpdy = (db < dt) ? ce - getWorldPos(b1, (vUv - vec2(0.0, 1.0 / resolution.y))).xyz
                            : -ce + getWorldPos(t1, (vUv + vec2(0.0, 1.0 / resolution.y))).xyz;
  
      return normalize(cross(dpdx, dpdy));
  }

    #include <common>
    #include <dithering_pars_fragment>
    void main() {
        //vec4 texel = texture2D(tDiffuse, vUv);//vec3(0.0);
        vec4 sceneTexel = texture2D(sceneDiffuse, vUv);
        float depth = texture2D(
            sceneDepth,
            vUv
        ).x;
        #ifdef HALFRES 
        vec4 texel;
        if (depth == 1.0) {
            texel = vec4(0.0, 0.0, 0.0, 1.0);
        } else {
        vec3 worldPos = getWorldPos(depth, vUv);
        vec3 normal = computeNormal(getWorldPos(depth, vUv), vUv);
       // vec4 texel = texture2D(tDiffuse, vUv);
       // Find closest depth;
       float totalWeight = 0.0;
       float radiusToUse = screenSpaceRadius ? distance(
        worldPos,
        getWorldPos(depth, vUv +
          vec2(radius, 0.0) / resolution)
      ) : radius;
      float distanceFalloffToUse =screenSpaceRadius ?
          radiusToUse * distanceFalloff
      : distanceFalloff;
        for(float x = -1.0; x <= 1.0; x++) {
            for(float y = -1.0; y <= 1.0; y++) {
                vec2 offset = vec2(x, y);
                ivec2 p = ivec2(
                    (vUv * resolution * 0.5) + offset
                );
                vec2 pUv = vec2(p) / (resolution * 0.5);
                float sampleDepth = texelFetch(downsampledDepth,p, 0).x;
                vec4 sampleInfo = texelFetch(tDiffuse, p, 0);
                vec3 normalSample = sampleInfo.gba * 2.0 - 1.0;
                vec3 worldPosSample = getWorldPos(sampleDepth, pUv);
                float tangentPlaneDist = abs(dot(worldPosSample - worldPos, normal));
                float rangeCheck = exp(-1.0 * tangentPlaneDist * (1.0 / distanceFalloffToUse)) * max(dot(normal, normalSample), 0.0);
                float weight = rangeCheck;
                totalWeight += weight;
                texel += sampleInfo * weight;
            }
        }
        if (totalWeight == 0.0) {
            texel = texture2D(tDiffuse, vUv);
        } else {
            texel /= totalWeight;
        }
    }
        #else
        vec4 texel = texture2D(tDiffuse, vUv);
        #endif

        #ifdef LOGDEPTH
        texel.r = clamp(texel.r, 0.0, 1.0);
        if (texel.r == 0.0) {
          texel.r = 1.0;
        }
        #endif
     
        float finalAo = pow(texel.r, intensity);
        if (aoTones > 0.0) {
            finalAo = ceil(finalAo * aoTones) / aoTones;
        }
        float fogFactor;
        float fogDepth = distance(
            cameraPos,
            getWorldPos(depth, vUv)
        );
        if (fog) {
            if (fogExp) {
                fogFactor = 1.0 - exp( - fogDensity * fogDensity * fogDepth * fogDepth );
            } else {
                fogFactor = smoothstep( fogNear, fogFar, fogDepth );
            }
        }
        if (transparencyAware) {
            float transparencyDWOff = texture2D(transparencyDWFalse, vUv).a;
            float transparencyDWOn = texture2D(transparencyDWTrue, vUv).a;
            float adjustmentFactorOff = transparencyDWOff;
            float adjustmentFactorOn = (1.0 - transparencyDWOn) * (
                texture2D(transparencyDWTrueDepth, vUv).r == texture2D(sceneDepth, vUv).r ? 1.0 : 0.0
            );
            float adjustmentFactor = max(adjustmentFactorOff, adjustmentFactorOn);
            finalAo = mix(finalAo, 1.0, adjustmentFactor);
        }
        finalAo = mix(finalAo, 1.0, fogFactor);
        vec3 aoApplied = color * mix(vec3(1.0), sceneTexel.rgb, float(colorMultiply));
        if (renderMode == 0.0) {
            gl_FragColor = vec4( mix(sceneTexel.rgb, aoApplied, 1.0 - finalAo), sceneTexel.a);
        } else if (renderMode == 1.0) {
            gl_FragColor = vec4( mix(vec3(1.0), aoApplied, 1.0 - finalAo), sceneTexel.a);
        } else if (renderMode == 2.0) {
            gl_FragColor = vec4( sceneTexel.rgb, sceneTexel.a);
        } else if (renderMode == 3.0) {
            if (vUv.x < 0.5) {
                gl_FragColor = vec4( sceneTexel.rgb, sceneTexel.a);
            } else if (abs(vUv.x - 0.5) < 1.0 / resolution.x) {
                gl_FragColor = vec4(1.0);
            } else {
                gl_FragColor = vec4( mix(sceneTexel.rgb, aoApplied, 1.0 - finalAo), sceneTexel.a);
            }
        } else if (renderMode == 4.0) {
            if (vUv.x < 0.5) {
                gl_FragColor = vec4( sceneTexel.rgb, sceneTexel.a);
            } else if (abs(vUv.x - 0.5) < 1.0 / resolution.x) {
                gl_FragColor = vec4(1.0);
            } else {
                gl_FragColor = vec4( mix(vec3(1.0), aoApplied, 1.0 - finalAo), sceneTexel.a);
            }
        }
        #include <dithering_fragment>
        if (gammaCorrection) {
            gl_FragColor = sRGBTransferOETF(gl_FragColor);
        }
    }
    `},Uv={uniforms:{sceneDiffuse:{value:null},sceneDepth:{value:null},tDiffuse:{value:null},projMat:{value:new Vt},viewMat:{value:new Vt},projectionMatrixInv:{value:new Vt},viewMatrixInv:{value:new Vt},cameraPos:{value:new D},resolution:{value:new it},time:{value:0},r:{value:5},blueNoise:{value:null},radius:{value:12},worldRadius:{value:5},index:{value:0},poissonDisk:{value:[]},distanceFalloff:{value:1},near:{value:.1},far:{value:1e3},logDepth:{value:!1},screenSpaceRadius:{value:!1}},depthWrite:!1,depthTest:!1,vertexShader:`
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = vec4(position, 1.0);
		}`,fragmentShader:`
		uniform sampler2D sceneDiffuse;
    uniform highp sampler2D sceneDepth;
    uniform sampler2D tDiffuse;
    uniform sampler2D blueNoise;
    uniform mat4 projectionMatrixInv;
    uniform mat4 viewMatrixInv;
    uniform vec2 resolution;
    uniform float r;
    uniform float radius;
     uniform float worldRadius;
    uniform float index;
     uniform float near;
     uniform float far;
     uniform float distanceFalloff;
     uniform bool logDepth;
     uniform bool screenSpaceRadius;
    varying vec2 vUv;

    highp float linearize_depth(highp float d, highp float zNear,highp float zFar)
    {
        highp float z_n = 2.0 * d - 1.0;
        return 2.0 * zNear * zFar / (zFar + zNear - z_n * (zFar - zNear));
    }
    highp float linearize_depth_log(highp float d, highp float nearZ,highp float farZ) {
     float depth = pow(2.0, d * log2(farZ + 1.0)) - 1.0;
     float a = farZ / (farZ - nearZ);
     float b = farZ * nearZ / (nearZ - farZ);
     float linDepth = a + b / depth;
     return linearize_depth(linDepth, nearZ, farZ);
   }
   highp float linearize_depth_ortho(highp float d, highp float nearZ, highp float farZ) {
     return nearZ + (farZ - nearZ) * d;
   }
   vec3 getWorldPosLog(vec3 posS) {
     vec2 uv = posS.xy;
     float z = posS.z;
     float nearZ =near;
     float farZ = far;
     float depth = pow(2.0, z * log2(farZ + 1.0)) - 1.0;
     float a = farZ / (farZ - nearZ);
     float b = farZ * nearZ / (nearZ - farZ);
     float linDepth = a + b / depth;
     vec4 clipVec = vec4(uv, linDepth, 1.0) * 2.0 - 1.0;
     vec4 wpos = projectionMatrixInv * clipVec;
     return wpos.xyz / wpos.w;
   }
    vec3 getWorldPos(float depth, vec2 coord) {
     #ifdef LOGDEPTH
      #ifndef ORTHO
          return getWorldPosLog(vec3(coord, depth));
      #endif
     #endif
        
        float z = depth * 2.0 - 1.0;
        vec4 clipSpacePosition = vec4(coord * 2.0 - 1.0, z, 1.0);
        vec4 viewSpacePosition = projectionMatrixInv * clipSpacePosition;
        // Perspective division
       vec4 worldSpacePosition = viewSpacePosition;
       worldSpacePosition.xyz /= worldSpacePosition.w;
        return worldSpacePosition.xyz;
    }
    #include <common>
    #define NUM_SAMPLES 16
    uniform vec2 poissonDisk[NUM_SAMPLES];
    void main() {
        const float pi = 3.14159;
        vec2 texelSize = vec2(1.0 / resolution.x, 1.0 / resolution.y);
        vec2 uv = vUv;
        vec4 data = texture2D(tDiffuse, vUv);
        float occlusion = data.r;
        float baseOcc = data.r;
        vec3 normal = data.gba * 2.0 - 1.0;
        float count = 1.0;
        float d = texture2D(sceneDepth, vUv).x;
        if (d == 1.0) {
          gl_FragColor = data;
          return;
        }
        vec3 worldPos = getWorldPos(d, vUv);
        float size = radius;
        float angle;
        if (index == 0.0) {
             angle = texture2D(blueNoise, gl_FragCoord.xy / 128.0).w * PI2;
        } else if (index == 1.0) {
             angle = texture2D(blueNoise, gl_FragCoord.xy / 128.0).z * PI2;
        } else if (index == 2.0) {
             angle = texture2D(blueNoise, gl_FragCoord.xy / 128.0).y * PI2;
        } else {
             angle = texture2D(blueNoise, gl_FragCoord.xy / 128.0).x * PI2;
        }

        mat2 rotationMatrix = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
        float radiusToUse = screenSpaceRadius ? distance(
          worldPos,
          getWorldPos(d, vUv +
            vec2(worldRadius, 0.0) / resolution)
        ) : worldRadius;
        float distanceFalloffToUse =screenSpaceRadius ?
        radiusToUse * distanceFalloff
    : radiusToUse * distanceFalloff * 0.2;

        float invDistance = (1.0 / distanceFalloffToUse);
        for(int i = 0; i < NUM_SAMPLES; i++) {
            vec2 offset = (rotationMatrix * poissonDisk[i]) * texelSize * size;
            vec4 dataSample = texture2D(tDiffuse, uv + offset);
            float occSample = dataSample.r;
            vec3 normalSample = dataSample.gba * 2.0 - 1.0;
            float dSample = texture2D(sceneDepth, uv + offset).x;
            vec3 worldPosSample = getWorldPos(dSample, uv + offset);
            float tangentPlaneDist = abs(dot(worldPosSample - worldPos, normal));
            float rangeCheck = float(dSample != 1.0) * exp(-1.0 * tangentPlaneDist * invDistance ) * max(dot(normal, normalSample), 0.0);
            occlusion += occSample * rangeCheck;
            count += rangeCheck;
        }
        if (count > 0.0) {
          occlusion /= count;
        }
        #ifdef LOGDEPTH
          occlusion = clamp(occlusion, 0.0, 1.0);
          if (occlusion == 0.0) {
            occlusion = 1.0;
          }
        #endif
        gl_FragColor = vec4(occlusion, 0.5 + 0.5 * normal);
    }
    `},Nv={uniforms:{sceneDepth:{value:null},resolution:{value:new it},near:{value:.1},far:{value:1e3},viewMatrixInv:{value:new Vt},projectionMatrixInv:{value:new Vt},logDepth:{value:!1},ortho:{value:!1}},depthWrite:!1,depthTest:!1,vertexShader:`
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = vec4(position, 1);
    }`,fragmentShader:`
    uniform highp sampler2D sceneDepth;
    uniform vec2 resolution;
    uniform float near;
    uniform float far;
    uniform bool logDepth;
    uniform bool ortho;
    uniform mat4 viewMatrixInv;
    uniform mat4 projectionMatrixInv;
    varying vec2 vUv;
    layout(location = 1) out vec4 gNormal;
    vec3 getWorldPosLog(vec3 posS) {
        vec2 uv = posS.xy;
        float z = posS.z;
        float nearZ =near;
        float farZ = far;
        float depth = pow(2.0, z * log2(farZ + 1.0)) - 1.0;
        float a = farZ / (farZ - nearZ);
        float b = farZ * nearZ / (nearZ - farZ);
        float linDepth = a + b / depth;
        vec4 clipVec = vec4(uv, linDepth, 1.0) * 2.0 - 1.0;
        vec4 wpos = projectionMatrixInv * clipVec;
        return wpos.xyz / wpos.w;
      }
      vec3 getWorldPos(float depth, vec2 coord) {
        if (logDepth && !ortho) {
          return getWorldPosLog(vec3(coord, depth));
        }
        float z = depth * 2.0 - 1.0;
        vec4 clipSpacePosition = vec4(coord * 2.0 - 1.0, z, 1.0);
        vec4 viewSpacePosition = projectionMatrixInv * clipSpacePosition;
        // Perspective division
       vec4 worldSpacePosition = viewSpacePosition;
       worldSpacePosition.xyz /= worldSpacePosition.w;
        return worldSpacePosition.xyz;
    }
  
    vec3 computeNormal(vec3 worldPos, vec2 vUv) {
      ivec2 p = ivec2(vUv * resolution);
      float c0 = texelFetch(sceneDepth, p, 0).x;
      float l2 = texelFetch(sceneDepth, p - ivec2(2, 0), 0).x;
      float l1 = texelFetch(sceneDepth, p - ivec2(1, 0), 0).x;
      float r1 = texelFetch(sceneDepth, p + ivec2(1, 0), 0).x;
      float r2 = texelFetch(sceneDepth, p + ivec2(2, 0), 0).x;
      float b2 = texelFetch(sceneDepth, p - ivec2(0, 2), 0).x;
      float b1 = texelFetch(sceneDepth, p - ivec2(0, 1), 0).x;
      float t1 = texelFetch(sceneDepth, p + ivec2(0, 1), 0).x;
      float t2 = texelFetch(sceneDepth, p + ivec2(0, 2), 0).x;
  
      float dl = abs((2.0 * l1 - l2) - c0);
      float dr = abs((2.0 * r1 - r2) - c0);
      float db = abs((2.0 * b1 - b2) - c0);
      float dt = abs((2.0 * t1 - t2) - c0);
  
      vec3 ce = getWorldPos(c0, vUv).xyz;
  
      vec3 dpdx = (dl < dr) ? ce - getWorldPos(l1, (vUv - vec2(1.0 / resolution.x, 0.0))).xyz
                            : -ce + getWorldPos(r1, (vUv + vec2(1.0 / resolution.x, 0.0))).xyz;
      vec3 dpdy = (db < dt) ? ce - getWorldPos(b1, (vUv - vec2(0.0, 1.0 / resolution.y))).xyz
                            : -ce + getWorldPos(t1, (vUv + vec2(0.0, 1.0 / resolution.y))).xyz;
  
      return normalize(cross(dpdx, dpdy));
  }
    void main() {
        vec2 uv = vUv - vec2(0.5) / resolution;
        vec2 pixelSize = vec2(1.0) / resolution;
        highp vec2[4] uvSamples;
        uvSamples[0] = uv;
        uvSamples[1] = uv + vec2(pixelSize.x, 0.0);
        uvSamples[2] = uv + vec2(0.0, pixelSize.y);
        uvSamples[3] = uv + pixelSize;
        float depth00 = texture2D(sceneDepth, uvSamples[0]).r;
        float depth10 = texture2D(sceneDepth, uvSamples[1]).r;
        float depth01 = texture2D(sceneDepth, uvSamples[2]).r;
        float depth11 = texture2D(sceneDepth, uvSamples[3]).r;
        float minDepth = min(min(depth00, depth10), min(depth01, depth11));
        float maxDepth = max(max(depth00, depth10), max(depth01, depth11));
        float targetDepth = minDepth;
        // Checkerboard pattern to avoid artifacts
        if (mod(gl_FragCoord.x + gl_FragCoord.y, 2.0) > 0.5) { 
            targetDepth = maxDepth;
        }
        int chosenIndex = 0;
        float[4] samples;
        samples[0] = depth00;
        samples[1] = depth10;
        samples[2] = depth01;
        samples[3] = depth11;
        for(int i = 0; i < 4; ++i) {
            if (samples[i] == targetDepth) {
                chosenIndex = i;
                break;
            }
        }
        gl_FragColor = vec4(samples[chosenIndex], 0.0, 0.0, 1.0);
        gNormal = vec4(computeNormal(
            getWorldPos(samples[chosenIndex], uvSamples[chosenIndex]), uvSamples[chosenIndex]
        ), 0.0);
    }`};var Eu="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";const Fv=parseInt(pa.replace(/\D+/g,"")),kv=Fv>=162?class extends ze{constructor(r=1,t=1,e=1,i={}){super(r,t,{...i,count:e}),this.isWebGLMultipleRenderTargets=!0}get texture(){return this.textures}}:class extends ze{constructor(r=1,t=1,e=1,i={}){super(r,t,i),this.isWebGLMultipleRenderTargets=!0;const n=this.texture;this.texture=[];for(let s=0;s<e;s++)this.texture[s]=n.clone(),this.texture[s].isRenderTargetTexture=!0}setSize(r,t,e=1){if(this.width!==r||this.height!==t||this.depth!==e){this.width=r,this.height=t,this.depth=e;for(let i=0,n=this.texture.length;i<n;i++)this.texture[i].image.width=r,this.texture[i].image.height=t,this.texture[i].image.depth=e;this.dispose()}this.viewport.set(0,0,r,t),this.scissor.set(0,0,r,t)}copy(r){this.dispose(),this.width=r.width,this.height=r.height,this.depth=r.depth,this.scissor.copy(r.scissor),this.scissorTest=r.scissorTest,this.viewport.copy(r.viewport),this.depthBuffer=r.depthBuffer,this.stencilBuffer=r.stencilBuffer,r.depthTexture!==null&&(this.depthTexture=r.depthTexture.clone()),this.texture.length=0;for(let t=0,e=r.texture.length;t<e;t++)this.texture[t]=r.texture[t].clone(),this.texture[t].isRenderTargetTexture=!0;return this}};Uint8Array.from(atob(Eu),r=>r.charCodeAt(0));const Ov=Uint8Array.from(atob(Eu),r=>r.charCodeAt(0));function Au(r,t,e){if(t.getQueryParameter(r,t.QUERY_RESULT_AVAILABLE)){const s=t.getQueryParameter(r,t.QUERY_RESULT)/1e6;e.lastTime=e.lastTime===0?s:e.timeRollingAverage*e.lastTime+(1-e.timeRollingAverage)*s}else setTimeout(()=>{Au(r,t,e)},1)}class Bv extends Gn{constructor(t,e,i=512,n=512){super(),this.width=i,this.height=n,this.clear=!0,this.camera=e,this.scene=t,this.configuration=new Proxy({aoSamples:16,aoRadius:5,aoTones:0,denoiseSamples:8,denoiseRadius:12,distanceFalloff:1,intensity:5,denoiseIterations:2,renderMode:0,biasOffset:0,biasMultiplier:0,color:new j(0,0,0),gammaCorrection:!0,logarithmicDepthBuffer:!1,screenSpaceRadius:!1,halfRes:!1,depthAwareUpsampling:!0,autoRenderBeauty:!0,colorMultiply:!0,transparencyAware:!1,stencil:!1,accumulate:!1},{set:(s,a,o)=>{const l=s[a];return s[a]=o,o.equals?o.equals(l)||this.firstFrame():l!==o&&this.firstFrame(),a==="aoSamples"&&l!==o&&this.configureAOPass(this.configuration.logarithmicDepthBuffer,this.camera.isOrthographicCamera),a==="denoiseSamples"&&l!==o&&this.configureDenoisePass(this.configuration.logarithmicDepthBuffer,this.camera.isOrthographicCamera),a==="halfRes"&&l!==o&&(this.configureAOPass(this.configuration.logarithmicDepthBuffer,this.camera.isOrthographicCamera),this.configureHalfResTargets(),this.configureEffectCompositer(this.configuration.logarithmicDepthBuffer,this.camera.isOrthographicCamera),this.setSize(this.width,this.height)),a==="depthAwareUpsampling"&&l!==o&&this.configureEffectCompositer(this.configuration.logarithmicDepthBuffer,this.camera.isOrthographicCamera),a==="transparencyAware"&&l!==o&&(this.autoDetectTransparency=!1,this.configureTransparencyTarget()),a==="stencil"&&l!==o&&(this.beautyRenderTarget.dispose(),this.beautyRenderTarget=new ze(this.width,this.height,{minFilter:Le,magFilter:Te,type:Je,format:Ue,stencilBuffer:o}),this.beautyRenderTarget.depthTexture=new Zs(this.width,this.height,o?Fn:Di),this.beautyRenderTarget.depthTexture.format=o?kn:gn),!0}}),this.samples=[],this.samplesDenoise=[],this.autoDetectTransparency=!0,this.frame=0,this.lastViewMatrix=new Vt,this.lastProjectionMatrix=new Vt,this.beautyRenderTarget=new ze(this.width,this.height,{minFilter:Le,magFilter:Te,type:Je,format:Ue,stencilBuffer:!1}),this.beautyRenderTarget.depthTexture=new Zs(this.width,this.height,Di),this.beautyRenderTarget.depthTexture.format=gn,this.configureEffectCompositer(this.configuration.logarithmicDepthBuffer,this.camera.isOrthographicCamera),this.configureSampleDependentPasses(),this.configureHalfResTargets(),this.detectTransparency(),this.configureTransparencyTarget(),this.writeTargetInternal=new ze(this.width,this.height,{minFilter:Le,magFilter:Le,depthBuffer:!1,format:Ue}),this.readTargetInternal=new ze(this.width,this.height,{minFilter:Le,magFilter:Le,depthBuffer:!1,format:Ue}),this.accumulationRenderTarget=new ze(this.width,this.height,{minFilter:Le,magFilter:Le,depthBuffer:!1,format:Ue,type:Je,stencilBuffer:!1,depthBuffer:!1,alpha:!0}),this.bluenoise=new ru(Ov,128,128),this.accumulationQuad=new cs(new ve({uniforms:{frame:{value:0},tDiffuse:{value:null}},transparent:!0,opacity:1,vertexShader:`
             varying vec2 vUv;
             void main() {
                 vUv = uv;
                 gl_Position = vec4(position, 1);
             }`,fragmentShader:`
             uniform sampler2D tDiffuse;
             uniform float frame;
                varying vec2 vUv;
                void main() {
                    vec4 color = texture2D(tDiffuse, vUv);
                    gl_FragColor = vec4(color.rgb, 1.0 / (frame + 1.0));
                }
                `})),this.bluenoise.colorSpace=Zi,this.bluenoise.wrapS=Ms,this.bluenoise.wrapT=Ms,this.bluenoise.minFilter=Te,this.bluenoise.magFilter=Te,this.bluenoise.needsUpdate=!0,this.lastTime=0,this.timeRollingAverage=.99,this._r=new it,this._c=new j}configureHalfResTargets(){this.firstFrame(),this.configuration.halfRes?(this.depthDownsampleTarget=new kv(this.width/2,this.height/2,2),this.depthDownsampleTarget.textures[0].format=ga,this.depthDownsampleTarget.textures[0].type=_i,this.depthDownsampleTarget.textures[0].minFilter=Te,this.depthDownsampleTarget.textures[0].magFilter=Te,this.depthDownsampleTarget.textures[0].depthBuffer=!1,this.depthDownsampleTarget.textures[1].format=Ue,this.depthDownsampleTarget.textures[1].type=Je,this.depthDownsampleTarget.textures[1].minFilter=Te,this.depthDownsampleTarget.textures[1].magFilter=Te,this.depthDownsampleTarget.textures[1].depthBuffer=!1,this.depthDownsampleQuad=new cs(new ve(Nv))):(this.depthDownsampleTarget&&(this.depthDownsampleTarget.dispose(),this.depthDownsampleTarget=null),this.depthDownsampleQuad&&(this.depthDownsampleQuad.dispose(),this.depthDownsampleQuad=null))}detectTransparency(){if(this.autoDetectTransparency){let t=!1;this.scene.traverse(e=>{e.material&&e.material.transparent&&(t=!0)}),this.configuration.transparencyAware=t}}configureTransparencyTarget(){this.configuration.transparencyAware?(this.transparencyRenderTargetDWFalse=new ze(this.width,this.height,{minFilter:Le,magFilter:Te,type:Je,format:Ue}),this.transparencyRenderTargetDWTrue=new ze(this.width,this.height,{minFilter:Le,magFilter:Te,type:Je,format:Ue}),this.transparencyRenderTargetDWTrue.depthTexture=new Zs(this.width,this.height,Di),this.depthCopyPass=new cs(new ve({uniforms:{depthTexture:{value:this.beautyRenderTarget.depthTexture}},vertexShader:`
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = vec4(position, 1);
            }`,fragmentShader:`
            uniform sampler2D depthTexture;
            varying vec2 vUv;
            void main() {
               gl_FragDepth = texture2D(depthTexture, vUv).r + 0.00001;
               gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
            }
            `}))):(this.transparencyRenderTargetDWFalse&&(this.transparencyRenderTargetDWFalse.dispose(),this.transparencyRenderTargetDWFalse=null),this.transparencyRenderTargetDWTrue&&(this.transparencyRenderTargetDWTrue.dispose(),this.transparencyRenderTargetDWTrue=null),this.depthCopyPass&&(this.depthCopyPass.dispose(),this.depthCopyPass=null))}renderTransparency(t){const e=this.scene.background,i=t.getClearColor(new j),n=t.getClearAlpha(),s=new Map,a=t.autoClearDepth;this.scene.traverse(o=>{s.set(o,o.visible)}),this.scene.background=null,t.autoClearDepth=!1,t.setClearColor(new j(0,0,0),0),this.depthCopyPass.material.uniforms.depthTexture.value=this.beautyRenderTarget.depthTexture,t.setRenderTarget(this.transparencyRenderTargetDWFalse),this.scene.traverse(o=>{o.material&&(o.visible=s.get(o)&&(o.material.transparent&&!o.material.depthWrite&&!o.userData.treatAsOpaque||!!o.userData.cannotReceiveAO))}),t.clear(!0,!0,!0),this.depthCopyPass.render(t),t.render(this.scene,this.camera),t.setRenderTarget(this.transparencyRenderTargetDWTrue),this.scene.traverse(o=>{o.material&&(o.visible=s.get(o)&&o.material.transparent&&o.material.depthWrite&&!o.userData.treatAsOpaque)}),t.clear(!0,!0,!0),this.depthCopyPass.render(t),t.render(this.scene,this.camera),this.scene.traverse(o=>{o.visible=s.get(o)}),t.setClearColor(i,n),this.scene.background=e,t.autoClearDepth=a}configureSampleDependentPasses(){this.firstFrame(),this.configureAOPass(this.configuration.logarithmicDepthBuffer,this.camera.isOrthographicCamera),this.configureDenoisePass(this.configuration.logarithmicDepthBuffer,this.camera.isOrthographicCamera)}configureAOPass(t=!1,e=!1){this.firstFrame(),this.samples=this.generateHemisphereSamples(this.configuration.aoSamples);const i={...zv};i.fragmentShader=i.fragmentShader.replace("16",this.configuration.aoSamples).replace("16.0",this.configuration.aoSamples+".0"),t&&(i.fragmentShader=`#define LOGDEPTH
`+i.fragmentShader),e&&(i.fragmentShader=`#define ORTHO
`+i.fragmentShader),this.configuration.halfRes&&(i.fragmentShader=`#define HALFRES
`+i.fragmentShader),this.effectShaderQuad?(this.effectShaderQuad.material.dispose(),this.effectShaderQuad.material=new ve(i)):this.effectShaderQuad=new cs(new ve(i))}configureDenoisePass(t=!1,e=!1){this.firstFrame(),this.samplesDenoise=this.generateDenoiseSamples(this.configuration.denoiseSamples,11);const i={...Uv};i.fragmentShader=i.fragmentShader.replace("16",this.configuration.denoiseSamples),t&&(i.fragmentShader=`#define LOGDEPTH
`+i.fragmentShader),e&&(i.fragmentShader=`#define ORTHO
`+i.fragmentShader),this.poissonBlurQuad?(this.poissonBlurQuad.material.dispose(),this.poissonBlurQuad.material=new ve(i)):this.poissonBlurQuad=new cs(new ve(i))}configureEffectCompositer(t=!1,e=!1){this.firstFrame();const i={...Iv};t&&(i.fragmentShader=`#define LOGDEPTH
`+i.fragmentShader),e&&(i.fragmentShader=`#define ORTHO
`+i.fragmentShader),this.configuration.halfRes&&this.configuration.depthAwareUpsampling&&(i.fragmentShader=`#define HALFRES
`+i.fragmentShader),this.effectCompositerQuad?(this.effectCompositerQuad.material.dispose(),this.effectCompositerQuad.material=new ve(i)):this.effectCompositerQuad=new cs(new ve(i))}generateHemisphereSamples(t){const e=[];for(let i=0;i<t;i++){const n=2.399963*i;let s=Math.sqrt(i+.5)/Math.sqrt(t);const a=s*Math.cos(n),o=s*Math.sin(n),l=Math.sqrt(1-(a*a+o*o));e.push(new D(a,o,l))}return e}generateDenoiseSamples(t,e){const i=2*Math.PI*e/t,n=1/t,s=n,a=[];let o=n,l=0;for(let c=0;c<t;c++)a.push(new it(Math.cos(l),Math.sin(l)).multiplyScalar(Math.pow(o,.75))),o+=s,l+=i;return a}setSize(t,e){this.firstFrame(),this.width=t,this.height=e;const i=this.configuration.halfRes?.5:1;this.beautyRenderTarget.setSize(t,e),this.writeTargetInternal.setSize(t*i,e*i),this.readTargetInternal.setSize(t*i,e*i),this.accumulationRenderTarget.setSize(t*i,e*i),this.configuration.halfRes&&this.depthDownsampleTarget.setSize(t*i,e*i),this.configuration.transparencyAware&&(this.transparencyRenderTargetDWFalse.setSize(t,e),this.transparencyRenderTargetDWTrue.setSize(t,e))}firstFrame(){this.needsFrame=!0}render(t,e,i,n,s){t.capabilities.logarithmicDepthBuffer!==this.configuration.logarithmicDepthBuffer&&(this.configuration.logarithmicDepthBuffer=t.capabilities.logarithmicDepthBuffer,this.configureAOPass(this.configuration.logarithmicDepthBuffer,this.camera.isOrthographicCamera),this.configureDenoisePass(this.configuration.logarithmicDepthBuffer,this.camera.isOrthographicCamera),this.configureEffectCompositer(this.configuration.logarithmicDepthBuffer,this.camera.isOrthographicCamera)),this.detectTransparency(),this.camera.updateMatrixWorld(),this.lastViewMatrix.equals(this.camera.matrixWorldInverse)&&this.lastProjectionMatrix.equals(this.camera.projectionMatrix)&&this.configuration.accumulate&&!this.needsFrame?this.frame++:(this.configuration.accumulate&&(t.setRenderTarget(this.accumulationRenderTarget),t.clear(!0,!0,!0)),this.frame=0,this.needsFrame=!1),this.lastViewMatrix.copy(this.camera.matrixWorldInverse),this.lastProjectionMatrix.copy(this.camera.projectionMatrix);let a,o,l;this.debugMode&&(a=t.getContext(),o=a.getExtension("EXT_disjoint_timer_query_webgl2"),o===null&&(console.error("EXT_disjoint_timer_query_webgl2 not available, disabling debug mode."),this.debugMode=!1)),this.configuration.autoRenderBeauty&&(t.setRenderTarget(this.beautyRenderTarget),t.render(this.scene,this.camera),this.configuration.transparencyAware&&this.renderTransparency(t)),this.debugMode&&(l=a.createQuery(),a.beginQuery(o.TIME_ELAPSED_EXT,l));const c=t.xr.enabled;t.xr.enabled=!1,this._r.set(this.width,this.height);let h=this.configuration.aoRadius;if(this.configuration.halfRes&&this.configuration.screenSpaceRadius&&(h*=.5),this.frame<1024/this.configuration.aoSamples){this.configuration.halfRes&&(t.setRenderTarget(this.depthDownsampleTarget),this.depthDownsampleQuad.material.uniforms.sceneDepth.value=this.beautyRenderTarget.depthTexture,this.depthDownsampleQuad.material.uniforms.resolution.value=this._r,this.depthDownsampleQuad.material.uniforms.near.value=this.camera.near,this.depthDownsampleQuad.material.uniforms.far.value=this.camera.far,this.depthDownsampleQuad.material.uniforms.projectionMatrixInv.value=this.camera.projectionMatrixInverse,this.depthDownsampleQuad.material.uniforms.viewMatrixInv.value=this.camera.matrixWorld,this.depthDownsampleQuad.material.uniforms.logDepth.value=this.configuration.logarithmicDepthBuffer,this.depthDownsampleQuad.material.uniforms.ortho.value=this.camera.isOrthographicCamera,this.depthDownsampleQuad.render(t)),this.effectShaderQuad.material.uniforms.sceneDiffuse.value=this.beautyRenderTarget.texture,this.effectShaderQuad.material.uniforms.sceneDepth.value=this.configuration.halfRes?this.depthDownsampleTarget.textures[0]:this.beautyRenderTarget.depthTexture,this.effectShaderQuad.material.uniforms.sceneNormal.value=this.configuration.halfRes?this.depthDownsampleTarget.textures[1]:null,this.effectShaderQuad.material.uniforms.projMat.value=this.camera.projectionMatrix,this.effectShaderQuad.material.uniforms.viewMat.value=this.camera.matrixWorldInverse,this.effectShaderQuad.material.uniforms.projViewMat.value=this.camera.projectionMatrix.clone().multiply(this.camera.matrixWorldInverse.clone()),this.effectShaderQuad.material.uniforms.projectionMatrixInv.value=this.camera.projectionMatrixInverse,this.effectShaderQuad.material.uniforms.viewMatrixInv.value=this.camera.matrixWorld,this.effectShaderQuad.material.uniforms.cameraPos.value=this.camera.getWorldPosition(new D),this.effectShaderQuad.material.uniforms.biasAdjustment.value=new it(this.configuration.biasOffset,this.configuration.biasMultiplier),this.effectShaderQuad.material.uniforms.resolution.value=this.configuration.halfRes?this._r.clone().multiplyScalar(.5).floor():this._r,this.effectShaderQuad.material.uniforms.time.value=performance.now()/1e3,this.effectShaderQuad.material.uniforms.samples.value=this.samples,this.effectShaderQuad.material.uniforms.bluenoise.value=this.bluenoise,this.effectShaderQuad.material.uniforms.radius.value=h,this.effectShaderQuad.material.uniforms.distanceFalloff.value=this.configuration.distanceFalloff,this.effectShaderQuad.material.uniforms.near.value=this.camera.near,this.effectShaderQuad.material.uniforms.far.value=this.camera.far,this.effectShaderQuad.material.uniforms.logDepth.value=t.capabilities.logarithmicDepthBuffer,this.effectShaderQuad.material.uniforms.ortho.value=this.camera.isOrthographicCamera,this.effectShaderQuad.material.uniforms.screenSpaceRadius.value=this.configuration.screenSpaceRadius,this.effectShaderQuad.material.uniforms.frame.value=this.frame,t.setRenderTarget(this.writeTargetInternal),this.effectShaderQuad.render(t);for(let f=0;f<this.configuration.denoiseIterations;f++)[this.writeTargetInternal,this.readTargetInternal]=[this.readTargetInternal,this.writeTargetInternal],this.poissonBlurQuad.material.uniforms.tDiffuse.value=this.readTargetInternal.texture,this.poissonBlurQuad.material.uniforms.sceneDepth.value=this.configuration.halfRes?this.depthDownsampleTarget.textures[0]:this.beautyRenderTarget.depthTexture,this.poissonBlurQuad.material.uniforms.projMat.value=this.camera.projectionMatrix,this.poissonBlurQuad.material.uniforms.viewMat.value=this.camera.matrixWorldInverse,this.poissonBlurQuad.material.uniforms.projectionMatrixInv.value=this.camera.projectionMatrixInverse,this.poissonBlurQuad.material.uniforms.viewMatrixInv.value=this.camera.matrixWorld,this.poissonBlurQuad.material.uniforms.cameraPos.value=this.camera.getWorldPosition(new D),this.poissonBlurQuad.material.uniforms.resolution.value=this.configuration.halfRes?this._r.clone().multiplyScalar(.5).floor():this._r,this.poissonBlurQuad.material.uniforms.time.value=performance.now()/1e3,this.poissonBlurQuad.material.uniforms.blueNoise.value=this.bluenoise,this.poissonBlurQuad.material.uniforms.radius.value=this.configuration.denoiseRadius*(this.configuration.halfRes?.5:1),this.poissonBlurQuad.material.uniforms.worldRadius.value=h,this.poissonBlurQuad.material.uniforms.distanceFalloff.value=this.configuration.distanceFalloff,this.poissonBlurQuad.material.uniforms.index.value=f,this.poissonBlurQuad.material.uniforms.poissonDisk.value=this.samplesDenoise,this.poissonBlurQuad.material.uniforms.near.value=this.camera.near,this.poissonBlurQuad.material.uniforms.far.value=this.camera.far,this.poissonBlurQuad.material.uniforms.logDepth.value=t.capabilities.logarithmicDepthBuffer,this.poissonBlurQuad.material.uniforms.screenSpaceRadius.value=this.configuration.screenSpaceRadius,t.setRenderTarget(this.writeTargetInternal),this.poissonBlurQuad.render(t);t.setRenderTarget(this.accumulationRenderTarget);const u=t.autoClear;t.autoClear=!1,this.accumulationQuad.material.uniforms.tDiffuse.value=this.writeTargetInternal.texture,this.accumulationQuad.material.uniforms.frame.value=this.frame,this.accumulationQuad.render(t),t.autoClear=u}this.configuration.transparencyAware&&(this.effectCompositerQuad.material.uniforms.transparencyDWFalse.value=this.transparencyRenderTargetDWFalse.texture,this.effectCompositerQuad.material.uniforms.transparencyDWTrue.value=this.transparencyRenderTargetDWTrue.texture,this.effectCompositerQuad.material.uniforms.transparencyDWTrueDepth.value=this.transparencyRenderTargetDWTrue.depthTexture,this.effectCompositerQuad.material.uniforms.transparencyAware.value=!0),this.effectCompositerQuad.material.uniforms.sceneDiffuse.value=this.beautyRenderTarget.texture,this.effectCompositerQuad.material.uniforms.sceneDepth.value=this.beautyRenderTarget.depthTexture,this.effectCompositerQuad.material.uniforms.aoTones.value=this.configuration.aoTones,this.effectCompositerQuad.material.uniforms.near.value=this.camera.near,this.effectCompositerQuad.material.uniforms.far.value=this.camera.far,this.effectCompositerQuad.material.uniforms.projectionMatrixInv.value=this.camera.projectionMatrixInverse,this.effectCompositerQuad.material.uniforms.viewMatrixInv.value=this.camera.matrixWorld,this.effectCompositerQuad.material.uniforms.logDepth.value=t.capabilities.logarithmicDepthBuffer,this.effectCompositerQuad.material.uniforms.ortho.value=this.camera.isOrthographicCamera,this.effectCompositerQuad.material.uniforms.downsampledDepth.value=this.configuration.halfRes?this.depthDownsampleTarget.textures[0]:this.beautyRenderTarget.depthTexture,this.effectCompositerQuad.material.uniforms.resolution.value=this._r,this.effectCompositerQuad.material.uniforms.blueNoise.value=this.bluenoise,this.effectCompositerQuad.material.uniforms.intensity.value=this.configuration.intensity,this.effectCompositerQuad.material.uniforms.renderMode.value=this.configuration.renderMode,this.effectCompositerQuad.material.uniforms.screenSpaceRadius.value=this.configuration.screenSpaceRadius,this.effectCompositerQuad.material.uniforms.radius.value=h,this.effectCompositerQuad.material.uniforms.distanceFalloff.value=this.configuration.distanceFalloff,this.effectCompositerQuad.material.uniforms.gammaCorrection.value=this.configuration.gammaCorrection,this.effectCompositerQuad.material.uniforms.tDiffuse.value=this.accumulationRenderTarget.texture,this.effectCompositerQuad.material.uniforms.color.value=this._c.copy(this.configuration.color).convertSRGBToLinear(),this.effectCompositerQuad.material.uniforms.colorMultiply.value=this.configuration.colorMultiply,this.effectCompositerQuad.material.uniforms.cameraPos.value=this.camera.getWorldPosition(new D),this.effectCompositerQuad.material.uniforms.fog.value=!!this.scene.fog,this.scene.fog&&(this.scene.fog.isFog?(this.effectCompositerQuad.material.uniforms.fogExp.value=!1,this.effectCompositerQuad.material.uniforms.fogNear.value=this.scene.fog.near,this.effectCompositerQuad.material.uniforms.fogFar.value=this.scene.fog.far):this.scene.fog.isFogExp2?(this.effectCompositerQuad.material.uniforms.fogExp.value=!0,this.effectCompositerQuad.material.uniforms.fogDensity.value=this.scene.fog.density):console.error(`Unsupported fog type ${this.scene.fog.constructor.name} in SSAOPass.`)),t.setRenderTarget(this.renderToScreen?null:e),this.effectCompositerQuad.render(t),this.debugMode&&(a.endQuery(o.TIME_ELAPSED_EXT),Au(l,a,this)),t.xr.enabled=c}enableDebugMode(){this.debugMode=!0}disableDebugMode(){this.debugMode=!1}setDisplayMode(t){this.configuration.renderMode=["Combined","AO","No AO","Split","Split AO"].indexOf(t)}setQualityMode(t){t==="Performance"?(this.configuration.aoSamples=8,this.configuration.denoiseSamples=4,this.configuration.denoiseRadius=12):t==="Low"?(this.configuration.aoSamples=16,this.configuration.denoiseSamples=4,this.configuration.denoiseRadius=12):t==="Medium"?(this.configuration.aoSamples=16,this.configuration.denoiseSamples=8,this.configuration.denoiseRadius=12):t==="High"?(this.configuration.aoSamples=64,this.configuration.denoiseSamples=8,this.configuration.denoiseRadius=6):t==="Ultra"&&(this.configuration.aoSamples=64,this.configuration.denoiseSamples=16,this.configuration.denoiseRadius=6)}}const Hv={uniforms:{tDiffuse:{value:null},uDesat:{value:0},uVignette:{value:.35},uRed:{value:0},uFade:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }",fragmentShader:`uniform sampler2D tDiffuse; uniform float uDesat, uVignette, uRed, uFade; varying vec2 vUv;
    void main(){ vec4 c = texture2D(tDiffuse, vUv); float l = dot(c.rgb, vec3(0.299,0.587,0.114)); c.rgb = mix(c.rgb, vec3(l), uDesat);
      vec2 q = vUv - 0.5; float v = 1.0 - smoothstep(0.35, 0.95, length(q) * 1.15) * uVignette; c.rgb *= v;
      c.rgb = mix(c.rgb, vec3(0.6, 0.02, 0.02), uRed * smoothstep(0.2, 0.8, length(q)));
      c.rgb *= 1.0 - uFade; gl_FragColor = c; }`};class Gv{constructor(t,e){this.renderer=t,this.canvas=e,this.scene=new Cg,this.camera=new ni(62,innerWidth/innerHeight,.3,3e3),this.input=new Yx(e),this.time=0,this.dayFrac=oh.START,this.night=0,this.paused=!0,this.slowmo=1,this.vehicles=[],this.peds=[],this.city=new Gx(this.scene),this.world={hash:this.city.hash,ground:(a,o)=>this.city.groundHeight(a,o),isWater:(a,o)=>this.city.isWater(a,o)},this.env=new Vx(this.scene,t),this.effects=new Wx(this.scene),this.audio=new Xx,this.rig=new Zx(this.camera,this.city),this.player=new cv(this),this.hud=new Pv(this),this.traffic=new pv(this),this.police=new vv(this),this.pedsMgr=new lv(this),this.pickups=new Sv(this),this.missions=new _v(this),this.barrels=[],this.projectiles=new av(this),this.aimTarget=null,this.stores=new Dv(this),this.buildBarrels(),this.headlights=[];for(let a=0;a<2;a++){const o=new dx(16773584,0,45,.55,.5,1.2);o.position.set(0,-100,0),this.scene.add(o,o.target),this.headlights.push(o)}this.sirenLights=[];for(let a=0;a<2;a++){const o=new rr(16724016,0,18,1.5);o.position.set(0,-100,0),this.scene.add(o),this.sirenLights.push(o)}const i=new Nn(.22,.7,4);i.rotateX(Math.PI/2),this.guideArrow=new G(i,new pe({color:16765514,toneMapped:!1,transparent:!0,opacity:.9})),this.guideArrow.visible=!1,this.scene.add(this.guideArrow),this.guide=null,this.traffic.spawnParked();const n=this.city.blocks.find(a=>a.i===16&&a.j===20);this.player.setPosition(n.x0+12,n.z1+1.6,Math.PI);const s=this.addVehicle("sedan",n.x0+13,n.z1+5.2,Math.PI/2,12597547);s.isParked=!0,this.rig.snapBehind(this.player.heading),this.rig.pos.set(this.player.x,3,this.player.z+6),this.hospital={x:this.city.blocks.find(a=>a.i===16&&a.j===19).x1+1.5,z:this.city.blocks.find(a=>a.i===16&&a.j===19).cz,h:Math.PI/2},this.station={x:this.missions.markers[4].x-6,z:this.missions.markers[4].z,h:0},this.setupPost(),this.respawnT=0,this.wastedT=0,this.fade=0,addEventListener("resize",()=>this.resize()),this.hud.notify("Welcome to Fable City. Press F1 for controls.",5e3),this.input.onPadChange=(a,o)=>{this.hud.notify(a?`🎮 Gamepad connected${o?": "+o.slice(0,32):""} — left stick moves, right stick looks, RT/LT fire+aim / gas+brake`:"🎮 Gamepad disconnected",4e3),a&&this.input.rumble(.5,.5,150)}}setupPost(){const t=this.renderer,e=new it;t.getSize(e),this.composer=new Sx(t);const i=t.getPixelRatio();this.renderPass=new wx(this.scene,this.camera),this.renderPass.enabled=!1,this.composer.addPass(this.renderPass),this.ao=new Bv(this.scene,this.camera,e.x*i,e.y*i),Object.assign(this.ao.configuration,{aoRadius:2,distanceFalloff:.5,intensity:6,aoSamples:12,denoiseSamples:6,denoiseRadius:12,halfRes:!0,gammaCorrection:!1,screenSpaceRadius:!1}),this.composer.addPass(this.ao),this.aoEnabled=!0,this.frameMs=8,this.bloom=new ws(new it(e.x,e.y),.45,.6,.92),this.composer.addPass(this.bloom),this.grade=new gu(Hv),this.composer.addPass(this.grade),this.composer.addPass(new Tx)}resize(){this.camera.aspect=innerWidth/innerHeight,this.camera.updateProjectionMatrix(),this.renderer.setSize(innerWidth,innerHeight),this.composer.setSize(innerWidth,innerHeight)}setAO(t){this.aoEnabled=t,this.ao.enabled=t,this.renderPass.enabled=!t}buildBarrels(){const t=this.city.rng,e=new Zt(.42,.42,1.1,12),i=new Et({color:12597547,roughness:.5,metalness:.4}),n=new Zt(.43,.43,.08,12),s=new Et({color:15658734,roughness:.5}),a=[];for(const o of this.city.blocks)if(o.type==="industrial")for(let l=0;l<4;l++)a.push([t.range(o.x0+3,o.x1-3),t.range(o.z0+3,o.z1-3)]);else if(o.type==="lot")for(let l=0;l<3;l++)a.push([t.range(o.x0+2,o.x1-2),t.range(o.z1-8,o.z1-2)]);else t.chance(.25)&&a.push([t.chance(.5)?o.x0-1.5:o.x1+1.5,t.range(o.z0+2,o.z1-2)]);for(const[o,l]of a){if(this.city.hash.query(o-.6,o+.6,l-.6,l+.6,[]).some(g=>g.kind==="building"))continue;const c=new G(e,i),h=this.city.groundHeight(o,l);c.position.set(o,h+.55,l),c.castShadow=!0,this.scene.add(c);const u=new G(n,s);u.position.y=.2,c.add(u);const f=u.clone();f.position.y=-.2,c.add(f);const d={x:o,y:h,z:l,mesh:c,health:30,dead:!1,hurt:(g,x)=>{d.dead||(d.health-=g,x&&(d.lastSource=x),d.health<=0&&this.explodeBarrel(d))}};d.collider=this.city.addCollider(o-.42,l-.42,o+.42,l+.42,"prop",1.1),this.barrels.push(d)}}explodeBarrel(t){if(t.dead)return;t.dead=!0,this.scene.remove(t.mesh),t.collider.disabled=!0,this.effects.explosion(t.x,t.y,t.z,.8),this.audio.explosion(),this.rig.addShake(ie(1.2-bt(t.x,t.z,this.player.x,this.player.z)/35,0,1));const e=t.lastSource||t;t.byPlayer=e.kind==="player",setTimeout(()=>this.explodeAt(t.x,t.y,t.z,7,t.byPlayer?this.player:t),0);for(const i of this.barrels)i!==t&&!i.dead&&bt(i.x,i.z,t.x,t.z)<8&&(i.lastSource=t.lastSource);this.pedsMgr.panicAround(t.x,t.z,40,6)}addVehicle(t,e,i,n,s){const a=new uv(t,s);return a.world=this.world,a.setPosition(e,i,n),a.y=this.city.groundHeight(e,i),a.syncMesh(),this.scene.add(a.group),this.vehicles.push(a),a.onExploded=()=>this.onVehicleExploded(a),a.onDamaged=(o,l)=>{a.driver===this.player&&l!=="bullet"&&this.rig.addShake(Math.min(.8,o/30))},a.onDestroyed=o=>{o!=="explode"&&a.lastDamage?.byPlayer&&a.control!=="player"&&this.police.crime("destroy_vehicle",a.x,a.z)},a}removeVehicle(t){const e=this.vehicles.indexOf(t);if(e>=0&&this.vehicles.splice(e,1),t.driver&&t.driver!==this.player){const i=t.driver;i.vehicle=null;const n=this.peds.indexOf(i);n>=0&&this.peds.splice(n,1);const s=this.police.cops.indexOf(i);s>=0&&this.police.cops.splice(s,1),i.dispose()}this.traffic.release(t),this.police.release(t),t.dispose()}crime(t,e,i){this.police.crime(t,e,i),this.player.lastCrimeT=this.time}notify(t,e){this.hud.notify(t,e)}noise(t,e,i,n){(n===this.player||n?.kind==="player")&&this.pedsMgr.panicAround(t,e,i,6)}hornAt(t){bt(t.x,t.z,this.player.x,this.player.z)<60&&this.audio.ready&&this.audio.tone(380+Math.random()*80,.35,.08,"square")}onPedKilled(t,e){const i=e===this.player||e?.driver===this.player||e?.kind==="player";t.kind==="cop"?(this.police.onCopKilled(t,e),i&&this.player.stats.kills++):i&&(this.crime("kill_ped",t.x,t.z),this.player.stats.kills++),t.money>0&&Math.random()<.7&&this.pickups.add("money",t.x+(Math.random()-.5),t.z+(Math.random()-.5),!0,t.money),this.pedsMgr.panicAround(t.x,t.z,25,7)}onVehicleExploded(t){this.effects.explosion(t.x,t.y,t.z,t.type.mass>1800?1.3:1),this.audio.explosion();const e=bt(t.x,t.z,this.player.x,this.player.z);this.rig.addShake(ie(1.5-e/40,0,1.2)),this.explodeAt(t.x,t.y,t.z,9,t),this.pedsMgr.panicAround(t.x,t.z,60,8),t.lastDamage?.byPlayer&&t.control!=="player"&&this.crime("explosion",t.x,t.z)}explodeAt(t,e,i,n,s,a=!1){for(const l of this.barrels)l!==s&&!l.dead&&bt(l.x,l.z,t,i)<n+1&&setTimeout(()=>this.explodeBarrel(l),120+Math.random()*250);for(const l of this.peds){const c=bt(l.x,l.z,t,i);c<n&&!l.dead&&l.knock((l.x-t)/(c+.1)*8,(l.z-i)/(c+.1)*8,200,s)}const o=bt(this.player.x,this.player.z,t,i);o<n&&(this.player.vehicle?this.player.vehicle.damage(60*(1-o/n),"explosion",s):this.player.knock((this.player.x-t)/(o+.1)*7,(this.player.z-i)/(o+.1)*7,110*(1-o/(n*1.1))));for(const l of this.vehicles){if(l===s)continue;const c=bt(l.x,l.z,t,i);c<n+2&&(l.damage(70*(1-c/(n+2)),"explosion",s),l.vy+=3*(1-c/(n+2)),l.vx+=(l.x-t)/(c+.1)*4,l.vz+=(l.z-i)/(c+.1)*4)}}onEnterVehicle(t){this.hud.notify(t.type.cop?"Police vehicle — press R for radio":`${t.typeName[0].toUpperCase()+t.typeName.slice(1)} — press R for radio, H for horn`,2200)}onExitVehicle(t){}onPlayerWasted(){this.hud.showBanner("WASTED","","#ff4040",5e3),this.audio.wasted(),this.respawnT=5,this.respawnKind="hospital",this.audio.setRadio(!1)}onPlayerBusted(){this.hud.showBanner("BUSTED","","#6a8cff",5e3),this.audio.wasted(),this.respawnT=5,this.respawnKind="station",this.audio.setRadio(!1)}doRespawn(){const t=this.player;this.stores.interior&&(this.stores.interior=null,this.stores.closeShop(),this.stores.cooldown=1.2);const e=Math.floor(t.money*.1);if(t.money-=e,e>0&&this.hud.moneyPop(-e),this.respawnKind==="station")for(const n in t.ammo)t.ammo[n]=Math.floor(t.ammo[n]/2);const i=this.respawnKind==="station"?this.station:this.hospital;t.respawn(i.x,i.z,i.h),t.armor=0,this.police.clear();for(const n of[...this.police.copCars])this.police.copCars.splice(0),this.removeVehicle(n);for(let n=this.police.cops.length-1;n>=0;n--){const s=this.police.cops[n],a=this.peds.indexOf(s);a>=0&&this.peds.splice(a,1),s.dispose()}this.police.cops.length=0,this.hud.notify(this.respawnKind==="station"?"Released from custody. Half your ammo was confiscated.":"Discharged from hospital.",4e3)}update(t){const e=Math.min(t,.03333333333333333)*this.slowmo,i=this.input,n=this.player;if(i.pollGamepad(),i.hit("help")&&this.hud.toggleHelp(),i.hit("map")&&this.hud.toggleMap(),this.hud.mapOpen){this.hud.update(e),i.endFrame();return}i.hit("skiptime")&&(this.dayFrac=(this.dayFrac+.1)%1,this.hud.notify("Time skipped",1e3)),i.hitCode("KeyR")&&!n.vehicle&&this.audio.ready,this.time+=e,this.dayFrac=(this.dayFrac+e/oh.LENGTH)%1,this.night=this.env.update(this.dayFrac,new D(n.x,0,n.z)),this.city.update(e,this.time,this.night,this.env),this.respawnT>0&&(this.respawnT-=e,this.respawnT<=0&&this.doRespawn()),n.update(e),this.traffic.update(e),this.police.update(e),this.pedsMgr.update(e);for(const f of this.vehicles)if(!(f.isParked&&!f.driver&&f.absSpeed<.01&&!f.lastCarHit&&!f.onFire)&&(f.update(e,this.world),f.lastHit&&f.lastHit.impact>3)){const d=bt(f.x,f.z,n.x,n.z);d<80&&this.audio.crash(f.lastHit.impact*ie(1-d/80,.2,1)),this.effects.sparks(f.x+f.lastHit.nx*-f.halfL*.5,f.y+.5,f.z+f.lastHit.nz*-f.halfL*.5,6),f.driver===n&&(this.rig.addShake(Math.min(1,f.lastHit.impact/12)),i.rumble(Math.min(1,f.lastHit.impact/14),.4,130))}for(let f=0;f<this.vehicles.length;f++)for(let d=f+1;d<this.vehicles.length;d++){const g=this.vehicles[f],x=this.vehicles[d];if(g.isParked&&x.isParked)continue;const p=fv(g,x);if(p>2.5){const m=bt(g.x,g.z,n.x,n.z);m<80&&this.audio.crash(p*ie(1-m/80,.2,1)),this.effects.sparks((g.x+x.x)/2,.6,(g.z+x.z)/2,8),g.isParked&&(g.isParked=!1),x.isParked&&(x.isParked=!1);const y=n.vehicle;if(y===g||y===x){const M=y===g?x:g;this.rig.addShake(Math.min(1,p/10)),i.rumble(Math.min(1,p/12),.4,120),M.type.cop&&M.control==="cop"&&this.police.noteRam(),M.ai&&(M.ai.scared=Math.max(M.ai.scared,4))}g.ai&&!g.ai.scared&&(g.ai.honkT=0)}}const s=new D;for(const f of this.vehicles){if(bt(f.x,f.z,n.x,n.z)>140)continue;(f.health<55||f.destroyed)&&(f.hood.getWorldPosition(s),this.effects.carSmoke(s,f.destroyed?.35:ie((55-f.health)/40,.1,.9))),f.onFire&&(f.hood.getWorldPosition(s),this.effects.carFire(s)),f.destroyed&&Math.random()<.3&&this.effects.carFire(f.group.position.clone().add(new D((Math.random()-.5)*2,.6,(Math.random()-.5)*3)));const g=Math.sin(f.heading),x=Math.cos(f.heading),p=f.vx*x-f.vz*g,m=f.absSpeed,y=Math.abs(p)>3.5&&m>4||f.handbrake&&m>5||f.braking&&m>14&&f.brake>.8;if(f.skidLevel=de(f.skidLevel||0,y?1:0,10,e),y&&this.city.onRoad(f.x,f.z)){const M=f.wheelbase/2,v=f.vx/m,b=f.vz/m;for(const _ of[-1,1]){const T=f.x-g*M+x*_*(f.halfW-.15),C=f.z-x*M-g*_*(f.halfW-.15);this.effects.skid(T,C,f.y+.02,v,b,.25,ie(Math.abs(p)/8+(f.handbrake?.4:0),.3,.9))}Math.random()<.5&&this.effects.puff(f.x-g*M,f.y+.2,f.z-x*M,1,.8)}}if(this.pickups.update(e),this.missions.update(e),this.stores.update(e),this.projectiles.update(e),(this._gcT=(this._gcT||0)+e)>2){this._gcT=0;for(let f=this.vehicles.length-1;f>=0;f--){const d=this.vehicles[f];!d.driver&&!d.mission&&d!==n.vehicle&&(d.abandoned||d.destroyed&&d.control==="none")&&bt(d.x,d.z,n.x,n.z)>180&&this.removeVehicle(d)}}this.effects.update(e),i.hit("ao")&&(this.setAO(!this.aoEnabled),this.hud.notify("Ambient occlusion "+(this.aoEnabled?"on":"off"),1200));const a=n.vehicle?"car":n.aiming?"aim":"foot";i.hit("camera")&&this.rig.snapBehind(n.heading);const o=n.vehicle?{x:n.vehicle.x,y:n.vehicle.y+.3,z:n.vehicle.z}:{x:n.x,y:n.y,z:n.z},l=n.vehicle&&n.vehicle.absSpeed>1?Math.atan2(n.vehicle.vx,n.vehicle.vz):n.heading,c=n.vehicle?n.vehicle.speed<-1?n.vehicle.heading:l:n.heading;this.rig.update(e,i,o,n.heading,n.absSpeed,a,c);const h=n.dead||n.busted;this.grade.uniforms.uDesat.value=de(this.grade.uniforms.uDesat.value,h?.85:0,3,e),this.grade.uniforms.uRed.value=de(this.grade.uniforms.uRed.value,n.damageFlash*.5+(n.health<25&&!h?.18:0),8,e),this.grade.uniforms.uFade.value=de(this.grade.uniforms.uFade.value,this.respawnT>0&&this.respawnT<1.2?1:0,6,e),this.bloom.strength=.35+this.night*.35;const u=this.missions.blips();for(const f of this.police.copCars)f.destroyed||u.push({x:f.x,z:f.z,color:"#4d7cff",kind:"cop",size:6});for(const f of this.police.cops)!f.vehicle&&!f.dead&&u.push({x:f.x,z:f.z,color:"#4d7cff",kind:"cop",size:5});for(const f of this.pickups.items)f.active&&bt(f.x,f.z,n.x,n.z)<90&&u.push({x:f.x,z:f.z,color:f.cat==="health"?"#ff5050":f.cat==="armor"?"#5090ff":f.cat==="money"?"#50ff80":"#ffffff",kind:"pickup",size:3});for(const f of this.stores.stores)u.push({x:f.doorX,z:f.doorZ,color:f.color,kind:"store",size:7,label:f.kind==="gun"?"A":f.kind==="food"?"B":f.kind==="clothes"?"T":"S"});for(const f of this.peds)f.kind==="gang"&&f.hostile&&!f.dead&&u.push({x:f.x,z:f.z,color:"#ff3030",kind:"cop",size:5});if(this.hud.blips=u,this.updateGuide(e,u),this.updateVehicleLights(),!n.vehicle&&!n.dead&&!this.missions.active&&!this.stores.interior){const f=n.nearestVehicle(4.5),d=n.nearestPed(2.6),g=i.gamepadConnected;f?this.hud.setHint(f.driver&&f.driver!==n?g?"Press Y to jack the car":"Press F to jack the car":g?"Press Y to enter":"Press F to enter"):d&&n.talkT<=0?this.hud.setHint(g?"Press X to talk":"Press E to talk"):this.missions.markers.some(x=>bt(n.x,n.z,x.x,x.z)<12)||this.hud.setHint("")}else n.vehicle&&this.hud.setHint("");n.talkT=Math.max(0,n.talkT-e),this.frameMs=de(this.frameMs,t*1e3,1,e),this.aoEnabled&&this.frameMs>30&&this.time>5&&!this._aoWarned&&(this._aoWarned=!0,this.setAO(!1),this.hud.notify("Ambient occlusion disabled for performance (O to re-enable)",3e3)),this.hud.update(e),this.updateAudio(e),i.endFrame()}updateGuide(t,e){const i=this.player;let n=null,s=null;if(this.missions.active)n=e.find(l=>l.guide)||null;else if(!this.stores.interior){let l=1/0;for(const c of this.missions.markers){const h=bt(c.x,c.z,i.x,i.z);h<l&&(l=h,n=c)}n&&(s=`Nearest mission: ${n.name} · ${Math.round(l)} m — walk into the yellow marker (M for map)`)}if(this.guide=n,s!==null&&!this.missions.active&&this.hud.setObjective(s,!0),!n||i.dead){this.guideArrow.visible=!1;return}const a=bt(n.x,n.z,i.x,i.z);this.guideArrow.visible=a>6;const o=(i.vehicle?i.vehicle.y+2.6:i.y+3.1)+Math.sin(this.time*4)*.12;this.guideArrow.position.set(i.x,o,i.z),this.guideArrow.lookAt(n.x,o,n.z),this.guideArrow.rotation.z+=this.time*2,this.missions.active&&this.hud.setDistance(a)}updateVehicleLights(){const t=this.player,e=t.vehicle,i=e&&e.lightsOn&&!e.destroyed;this.headlights.forEach((s,a)=>{if(!i){s.intensity=0;return}const o=Math.sin(e.heading),l=Math.cos(e.heading),c=a===0?-1:1,h=l*c*(e.halfW-.35),u=-o*c*(e.halfW-.35);s.position.set(e.x+o*e.halfL+h,e.y+e.headY,e.z+l*e.halfL+u),s.target.position.set(e.x+o*(e.halfL+14)+h*2,e.y-.3,e.z+l*(e.halfL+14)+u*2),s.intensity=60});const n=this.police.copCars.filter(s=>s.sirenOn&&!s.destroyed).sort((s,a)=>bt(s.x,s.z,t.x,t.z)-bt(a.x,a.z,t.x,t.z));this.sirenLights.forEach((s,a)=>{const o=n[a];if(!o){s.intensity=0;return}s.position.set(o.x,o.y+(o.sirenY||1.8),o.z),s.color.setHex(o.sirenPhase?16724016:3170559),s.intensity=25})}updateAudio(t){const e=this.audio,i=this.player;if(!e.ready)return;const n=i.vehicle;if(n&&!n.destroyed){const a=ie(n.absSpeed/n.type.maxSpeed,0,1),o=Math.min(4,Math.floor(a*5)),l=ie((a*5-o)*.7+.2+n.throttle*.15,0,1);e.setEngine(!0,l,n.throttle,a,n.skidLevel||0)}else e.setEngine(!1,0,0,0,0);let s=0;for(const a of this.police.copCars)a.sirenOn&&(s=Math.max(s,ie(1-bt(a.x,a.z,i.x,i.z)/130,0,1)));e.setSiren(s,t),e.updateRadio()}render(){this.composer.render()}}const Cu=document.getElementById("game"),Vn=new Ag({canvas:Cu,antialias:!0,powerPreference:"high-performance"});Vn.setPixelRatio(Math.min(devicePixelRatio,1.5));Vn.setSize(innerWidth,innerHeight);Vn.shadowMap.enabled=!0;Vn.shadowMap.type=Th;Vn.toneMapping=dl;Vn.toneMappingExposure=1;const Ru=document.getElementById("overlay"),Vv=document.getElementById("overlay-title"),Wv=document.getElementById("overlay-sub"),Ae=new Gv(Vn,Cu);window.game=Ae;window.step=(r,t=[],e={})=>{for(let i=0;i<r;i++){for(const n of t)Ae.input.keys.add(n),i===0&&Ae.input.pressed.add(n);Object.assign(Ae.input.mouse,e),Ae.update(1/60)}Ae.input.keys.clear(),Ae.render()};Ae.resize();let yo=!1;const Xv=location.search.includes("debug");function qv(){if(Ae.audio.init(),Ae.audio.resume(),Xv){Ae.input.locked=!0,Ae.input.onLockChange(!0);return}Ae.input.lock()}Ru.addEventListener("click",qv);Ae.input.onLockChange=r=>{Ae.paused=!r,Ru.style.display=r?"none":"flex",r||(Vv.textContent=yo?"PAUSED":"FABLE CITY",Wv.textContent="Click to "+(yo?"resume":"play")),r&&(yo=!0,Ae.audio.resume())};let bh=performance.now();function Pu(r){requestAnimationFrame(Pu);const t=Math.min(.1,(r-bh)/1e3);bh=r,Ae.paused?Ae.env.update(Ae.dayFrac,new D(Ae.player.x,0,Ae.player.z)):Ae.update(t),Ae.render()}requestAnimationFrame(Pu);
