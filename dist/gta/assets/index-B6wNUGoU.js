(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const s of n)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function e(n){const s={};return n.integrity&&(s.integrity=n.integrity),n.referrerPolicy&&(s.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?s.credentials="include":n.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(n){if(n.ep)return;n.ep=!0;const s=e(n);fetch(n.href,s)}})();/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const ka="170",af=0,hc=1,of=2,Xh=1,qh=2,nn=3,Pn=0,oi=1,Ve=2,on=0,Wn=1,Ps=2,uc=3,fc=4,lf=5,Gn=100,cf=101,hf=102,uf=103,ff=104,df=200,pf=201,mf=202,gf=203,Oo=204,Bo=205,xf=206,vf=207,yf=208,Mf=209,bf=210,wf=211,Sf=212,Tf=213,_f=214,Ho=0,Go=1,Vo=2,zs=3,Wo=4,Xo=5,qo=6,Yo=7,Yh=0,Ef=1,Af=2,An=0,Zh=1,Kh=2,jh=3,Il=4,Cf=5,Qh=6,Jh=7,$h=300,Ds=301,Ls=302,Sa=303,Zo=304,Na=306,Is=1e3,Tn=1001,mr=1002,ze=1003,Rf=1004,Pr=1005,Oe=1006,Xa=1007,_n=1008,cn=1009,tu=1010,eu=1011,gr=1012,Ul=1013,Hi=1014,Ii=1015,ai=1016,kl=1017,Nl=1018,Xn=1020,iu=35902,nu=1021,su=1022,Ge=1023,ru=1024,au=1025,Cn=1026,qn=1027,Fa=1028,Fl=1029,ou=1030,Ol=1031,Bl=1033,xa=33776,va=33777,ya=33778,Ma=33779,Ko=35840,jo=35841,Qo=35842,Jo=35843,$o=36196,tl=37492,el=37496,il=37808,nl=37809,sl=37810,rl=37811,al=37812,ol=37813,ll=37814,cl=37815,hl=37816,ul=37817,fl=37818,dl=37819,pl=37820,ml=37821,ba=36492,gl=36494,xl=36495,lu=36283,vl=36284,yl=36285,Ml=36286,Pf=3200,zf=3201,cu=0,Df=1,sn="",ri="srgb",Os="srgb-linear",Oa="linear",ve="srgb",$n=7680,dc=519,Lf=512,If=513,Uf=514,hu=515,kf=516,Nf=517,Ff=518,Of=519,pc=35044,mc="300 es",rn=2e3,Ta=2001;class Bs{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const i=this._listeners;return i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const n=this._listeners[t];if(n!==void 0){const s=n.indexOf(e);s!==-1&&n.splice(s,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const i=this._listeners[t.type];if(i!==void 0){t.target=this;const n=i.slice(0);for(let s=0,a=n.length;s<a;s++)n[s].call(this,t);t.target=null}}}const $e=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],qa=Math.PI/180,_a=180/Math.PI;function Hs(){const r=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return($e[r&255]+$e[r>>8&255]+$e[r>>16&255]+$e[r>>24&255]+"-"+$e[t&255]+$e[t>>8&255]+"-"+$e[t>>16&15|64]+$e[t>>24&255]+"-"+$e[e&63|128]+$e[e>>8&255]+"-"+$e[e>>16&255]+$e[e>>24&255]+$e[i&255]+$e[i>>8&255]+$e[i>>16&255]+$e[i>>24&255]).toLowerCase()}function Qe(r,t,e){return Math.max(t,Math.min(e,r))}function Bf(r,t){return(r%t+t)%t}function Ya(r,t,e){return(1-e)*r+e*t}function qs(r,t){switch(t.constructor){case Float32Array:return r;case Uint32Array:return r/4294967295;case Uint16Array:return r/65535;case Uint8Array:return r/255;case Int32Array:return Math.max(r/2147483647,-1);case Int16Array:return Math.max(r/32767,-1);case Int8Array:return Math.max(r/127,-1);default:throw new Error("Invalid component type.")}}function ci(r,t){switch(t.constructor){case Float32Array:return r;case Uint32Array:return Math.round(r*4294967295);case Uint16Array:return Math.round(r*65535);case Uint8Array:return Math.round(r*255);case Int32Array:return Math.round(r*2147483647);case Int16Array:return Math.round(r*32767);case Int8Array:return Math.round(r*127);default:throw new Error("Invalid component type.")}}class ot{constructor(t=0,e=0){ot.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,n=t.elements;return this.x=n[0]*e+n[3]*i+n[6],this.y=n[1]*e+n[4]*i+n[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(Qe(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),n=Math.sin(e),s=this.x-t.x,a=this.y-t.y;return this.x=s*i-a*n+t.x,this.y=s*n+a*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class ee{constructor(t,e,i,n,s,a,o,l,c){ee.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,n,s,a,o,l,c)}set(t,e,i,n,s,a,o,l,c){const h=this.elements;return h[0]=t,h[1]=n,h[2]=o,h[3]=e,h[4]=s,h[5]=l,h[6]=i,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,n=e.elements,s=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],h=i[4],f=i[7],u=i[2],d=i[5],m=i[8],v=n[0],g=n[3],p=n[6],M=n[1],w=n[4],x=n[7],y=n[2],b=n[5],_=n[8];return s[0]=a*v+o*M+l*y,s[3]=a*g+o*w+l*b,s[6]=a*p+o*x+l*_,s[1]=c*v+h*M+f*y,s[4]=c*g+h*w+f*b,s[7]=c*p+h*x+f*_,s[2]=u*v+d*M+m*y,s[5]=u*g+d*w+m*b,s[8]=u*p+d*x+m*_,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],n=t[2],s=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8];return e*a*h-e*o*c-i*s*h+i*o*l+n*s*c-n*a*l}invert(){const t=this.elements,e=t[0],i=t[1],n=t[2],s=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],f=h*a-o*c,u=o*l-h*s,d=c*s-a*l,m=e*f+i*u+n*d;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/m;return t[0]=f*v,t[1]=(n*c-h*i)*v,t[2]=(o*i-n*a)*v,t[3]=u*v,t[4]=(h*e-n*l)*v,t[5]=(n*s-o*e)*v,t[6]=d*v,t[7]=(i*l-c*e)*v,t[8]=(a*e-i*s)*v,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,n,s,a,o){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*a+c*o)+a+t,-n*c,n*l,-n*(-c*a+l*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(Za.makeScale(t,e)),this}rotate(t){return this.premultiply(Za.makeRotation(-t)),this}translate(t,e){return this.premultiply(Za.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let n=0;n<9;n++)if(e[n]!==i[n])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Za=new ee;function uu(r){for(let t=r.length-1;t>=0;--t)if(r[t]>=65535)return!0;return!1}function Ea(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function Hf(){const r=Ea("canvas");return r.style.display="block",r}const gc={};function ar(r){r in gc||(gc[r]=!0,console.warn(r))}function Gf(r,t,e){return new Promise(function(i,n){function s(){switch(r.clientWaitSync(t,r.SYNC_FLUSH_COMMANDS_BIT,0)){case r.WAIT_FAILED:n();break;case r.TIMEOUT_EXPIRED:setTimeout(s,e);break;default:i()}}setTimeout(s,e)})}function Vf(r){const t=r.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function Wf(r){const t=r.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const ce={enabled:!0,workingColorSpace:Os,spaces:{},convert:function(r,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===ve&&(r.r=ln(r.r),r.g=ln(r.g),r.b=ln(r.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(r.applyMatrix3(this.spaces[t].toXYZ),r.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===ve&&(r.r=_s(r.r),r.g=_s(r.g),r.b=_s(r.b))),r},fromWorkingColorSpace:function(r,t){return this.convert(r,this.workingColorSpace,t)},toWorkingColorSpace:function(r,t){return this.convert(r,t,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===sn?Oa:this.spaces[r].transfer},getLuminanceCoefficients:function(r,t=this.workingColorSpace){return r.fromArray(this.spaces[t].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,t,e){return r.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace}};function ln(r){return r<.04045?r*.0773993808:Math.pow(r*.9478672986+.0521327014,2.4)}function _s(r){return r<.0031308?r*12.92:1.055*Math.pow(r,.41666)-.055}const xc=[.64,.33,.3,.6,.15,.06],vc=[.2126,.7152,.0722],yc=[.3127,.329],Mc=new ee().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),bc=new ee().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);ce.define({[Os]:{primaries:xc,whitePoint:yc,transfer:Oa,toXYZ:Mc,fromXYZ:bc,luminanceCoefficients:vc,workingColorSpaceConfig:{unpackColorSpace:ri},outputColorSpaceConfig:{drawingBufferColorSpace:ri}},[ri]:{primaries:xc,whitePoint:yc,transfer:ve,toXYZ:Mc,fromXYZ:bc,luminanceCoefficients:vc,outputColorSpaceConfig:{drawingBufferColorSpace:ri}}});let ts;class Xf{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{ts===void 0&&(ts=Ea("canvas")),ts.width=t.width,ts.height=t.height;const i=ts.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),e=ts}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Ea("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const n=i.getImageData(0,0,t.width,t.height),s=n.data;for(let a=0;a<s.length;a++)s[a]=ln(s[a]/255)*255;return i.putImageData(n,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(ln(e[i]/255)*255):e[i]=ln(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let qf=0;class fu{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:qf++}),this.uuid=Hs(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},n=this.data;if(n!==null){let s;if(Array.isArray(n)){s=[];for(let a=0,o=n.length;a<o;a++)n[a].isDataTexture?s.push(Ka(n[a].image)):s.push(Ka(n[a]))}else s=Ka(n);i.url=s}return e||(t.images[this.uuid]=i),i}}function Ka(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?Xf.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Yf=0;class ii extends Bs{constructor(t=ii.DEFAULT_IMAGE,e=ii.DEFAULT_MAPPING,i=Tn,n=Tn,s=Oe,a=_n,o=Ge,l=cn,c=ii.DEFAULT_ANISOTROPY,h=sn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Yf++}),this.uuid=Hs(),this.name="",this.source=new fu(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=n,this.magFilter=s,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new ot(0,0),this.repeat=new ot(1,1),this.center=new ot(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ee,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==$h)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Is:t.x=t.x-Math.floor(t.x);break;case Tn:t.x=t.x<0?0:1;break;case mr:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Is:t.y=t.y-Math.floor(t.y);break;case Tn:t.y=t.y<0?0:1;break;case mr:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}ii.DEFAULT_IMAGE=null;ii.DEFAULT_MAPPING=$h;ii.DEFAULT_ANISOTROPY=1;class Me{constructor(t=0,e=0,i=0,n=1){Me.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=n}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,n){return this.x=t,this.y=e,this.z=i,this.w=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,n=this.z,s=this.w,a=t.elements;return this.x=a[0]*e+a[4]*i+a[8]*n+a[12]*s,this.y=a[1]*e+a[5]*i+a[9]*n+a[13]*s,this.z=a[2]*e+a[6]*i+a[10]*n+a[14]*s,this.w=a[3]*e+a[7]*i+a[11]*n+a[15]*s,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,n,s;const l=t.elements,c=l[0],h=l[4],f=l[8],u=l[1],d=l[5],m=l[9],v=l[2],g=l[6],p=l[10];if(Math.abs(h-u)<.01&&Math.abs(f-v)<.01&&Math.abs(m-g)<.01){if(Math.abs(h+u)<.1&&Math.abs(f+v)<.1&&Math.abs(m+g)<.1&&Math.abs(c+d+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const w=(c+1)/2,x=(d+1)/2,y=(p+1)/2,b=(h+u)/4,_=(f+v)/4,E=(m+g)/4;return w>x&&w>y?w<.01?(i=0,n=.707106781,s=.707106781):(i=Math.sqrt(w),n=b/i,s=_/i):x>y?x<.01?(i=.707106781,n=0,s=.707106781):(n=Math.sqrt(x),i=b/n,s=E/n):y<.01?(i=.707106781,n=.707106781,s=0):(s=Math.sqrt(y),i=_/s,n=E/s),this.set(i,n,s,e),this}let M=Math.sqrt((g-m)*(g-m)+(f-v)*(f-v)+(u-h)*(u-h));return Math.abs(M)<.001&&(M=1),this.x=(g-m)/M,this.y=(f-v)/M,this.z=(u-h)/M,this.w=Math.acos((c+d+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Zf extends Bs{constructor(t=1,e=1,i={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new Me(0,0,t,e),this.scissorTest=!1,this.viewport=new Me(0,0,t,e);const n={width:t,height:e,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Oe,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const s=new ii(n,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);s.flipY=!1,s.generateMipmaps=i.generateMipmaps,s.internalFormat=i.internalFormat,this.textures=[];const a=i.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let n=0,s=this.textures.length;n<s;n++)this.textures[n].image.width=t,this.textures[n].image.height=e,this.textures[n].image.depth=i;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let i=0,n=t.textures.length;i<n;i++)this.textures[i]=t.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new fu(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Be extends Zf{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class du extends ii{constructor(t=null,e=1,i=1,n=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:n},this.magFilter=ze,this.minFilter=ze,this.wrapR=Tn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Kf extends ii{constructor(t=null,e=1,i=1,n=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:n},this.magFilter=ze,this.minFilter=ze,this.wrapR=Tn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Sr{constructor(t=0,e=0,i=0,n=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=n}static slerpFlat(t,e,i,n,s,a,o){let l=i[n+0],c=i[n+1],h=i[n+2],f=i[n+3];const u=s[a+0],d=s[a+1],m=s[a+2],v=s[a+3];if(o===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=f;return}if(o===1){t[e+0]=u,t[e+1]=d,t[e+2]=m,t[e+3]=v;return}if(f!==v||l!==u||c!==d||h!==m){let g=1-o;const p=l*u+c*d+h*m+f*v,M=p>=0?1:-1,w=1-p*p;if(w>Number.EPSILON){const y=Math.sqrt(w),b=Math.atan2(y,p*M);g=Math.sin(g*b)/y,o=Math.sin(o*b)/y}const x=o*M;if(l=l*g+u*x,c=c*g+d*x,h=h*g+m*x,f=f*g+v*x,g===1-o){const y=1/Math.sqrt(l*l+c*c+h*h+f*f);l*=y,c*=y,h*=y,f*=y}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=f}static multiplyQuaternionsFlat(t,e,i,n,s,a){const o=i[n],l=i[n+1],c=i[n+2],h=i[n+3],f=s[a],u=s[a+1],d=s[a+2],m=s[a+3];return t[e]=o*m+h*f+l*d-c*u,t[e+1]=l*m+h*u+c*f-o*d,t[e+2]=c*m+h*d+o*u-l*f,t[e+3]=h*m-o*f-l*u-c*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,n){return this._x=t,this._y=e,this._z=i,this._w=n,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,n=t._y,s=t._z,a=t._order,o=Math.cos,l=Math.sin,c=o(i/2),h=o(n/2),f=o(s/2),u=l(i/2),d=l(n/2),m=l(s/2);switch(a){case"XYZ":this._x=u*h*f+c*d*m,this._y=c*d*f-u*h*m,this._z=c*h*m+u*d*f,this._w=c*h*f-u*d*m;break;case"YXZ":this._x=u*h*f+c*d*m,this._y=c*d*f-u*h*m,this._z=c*h*m-u*d*f,this._w=c*h*f+u*d*m;break;case"ZXY":this._x=u*h*f-c*d*m,this._y=c*d*f+u*h*m,this._z=c*h*m+u*d*f,this._w=c*h*f-u*d*m;break;case"ZYX":this._x=u*h*f-c*d*m,this._y=c*d*f+u*h*m,this._z=c*h*m-u*d*f,this._w=c*h*f+u*d*m;break;case"YZX":this._x=u*h*f+c*d*m,this._y=c*d*f+u*h*m,this._z=c*h*m-u*d*f,this._w=c*h*f-u*d*m;break;case"XZY":this._x=u*h*f-c*d*m,this._y=c*d*f-u*h*m,this._z=c*h*m+u*d*f,this._w=c*h*f+u*d*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,n=Math.sin(i);return this._x=t.x*n,this._y=t.y*n,this._z=t.z*n,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],n=e[4],s=e[8],a=e[1],o=e[5],l=e[9],c=e[2],h=e[6],f=e[10],u=i+o+f;if(u>0){const d=.5/Math.sqrt(u+1);this._w=.25/d,this._x=(h-l)*d,this._y=(s-c)*d,this._z=(a-n)*d}else if(i>o&&i>f){const d=2*Math.sqrt(1+i-o-f);this._w=(h-l)/d,this._x=.25*d,this._y=(n+a)/d,this._z=(s+c)/d}else if(o>f){const d=2*Math.sqrt(1+o-i-f);this._w=(s-c)/d,this._x=(n+a)/d,this._y=.25*d,this._z=(l+h)/d}else{const d=2*Math.sqrt(1+f-i-o);this._w=(a-n)/d,this._x=(s+c)/d,this._y=(l+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<Number.EPSILON?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Qe(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const n=Math.min(1,e/i);return this.slerp(t,n),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,n=t._y,s=t._z,a=t._w,o=e._x,l=e._y,c=e._z,h=e._w;return this._x=i*h+a*o+n*c-s*l,this._y=n*h+a*l+s*o-i*c,this._z=s*h+a*c+i*l-n*o,this._w=a*h-i*o-n*l-s*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const i=this._x,n=this._y,s=this._z,a=this._w;let o=a*t._w+i*t._x+n*t._y+s*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=i,this._y=n,this._z=s,this;const l=1-o*o;if(l<=Number.EPSILON){const d=1-e;return this._w=d*a+e*this._w,this._x=d*i+e*this._x,this._y=d*n+e*this._y,this._z=d*s+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,o),f=Math.sin((1-e)*h)/c,u=Math.sin(e*h)/c;return this._w=a*f+this._w*u,this._x=i*f+this._x*u,this._y=n*f+this._y*u,this._z=s*f+this._z*u,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),n=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(n*Math.sin(t),n*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class z{constructor(t=0,e=0,i=0){z.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(wc.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(wc.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,n=this.z,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6]*n,this.y=s[1]*e+s[4]*i+s[7]*n,this.z=s[2]*e+s[5]*i+s[8]*n,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,n=this.z,s=t.elements,a=1/(s[3]*e+s[7]*i+s[11]*n+s[15]);return this.x=(s[0]*e+s[4]*i+s[8]*n+s[12])*a,this.y=(s[1]*e+s[5]*i+s[9]*n+s[13])*a,this.z=(s[2]*e+s[6]*i+s[10]*n+s[14])*a,this}applyQuaternion(t){const e=this.x,i=this.y,n=this.z,s=t.x,a=t.y,o=t.z,l=t.w,c=2*(a*n-o*i),h=2*(o*e-s*n),f=2*(s*i-a*e);return this.x=e+l*c+a*f-o*h,this.y=i+l*h+o*c-s*f,this.z=n+l*f+s*h-a*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,n=this.z,s=t.elements;return this.x=s[0]*e+s[4]*i+s[8]*n,this.y=s[1]*e+s[5]*i+s[9]*n,this.z=s[2]*e+s[6]*i+s[10]*n,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,n=t.y,s=t.z,a=e.x,o=e.y,l=e.z;return this.x=n*l-s*o,this.y=s*a-i*l,this.z=i*o-n*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return ja.copy(this).projectOnVector(t),this.sub(ja)}reflect(t){return this.sub(ja.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(Qe(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,n=this.z-t.z;return e*e+i*i+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const n=Math.sin(e)*t;return this.x=n*Math.sin(i),this.y=Math.cos(e)*t,this.z=n*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),n=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=n,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const ja=new z,wc=new Sr;class zn{constructor(t=new z(1/0,1/0,1/0),e=new z(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(Ai.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(Ai.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=Ai.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const s=i.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,Ai):Ai.fromBufferAttribute(s,a),Ai.applyMatrix4(t.matrixWorld),this.expandByPoint(Ai);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),zr.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),zr.copy(i.boundingBox)),zr.applyMatrix4(t.matrixWorld),this.union(zr)}const n=t.children;for(let s=0,a=n.length;s<a;s++)this.expandByObject(n[s],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Ai),Ai.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Ys),Dr.subVectors(this.max,Ys),es.subVectors(t.a,Ys),is.subVectors(t.b,Ys),ns.subVectors(t.c,Ys),dn.subVectors(is,es),pn.subVectors(ns,is),Ln.subVectors(es,ns);let e=[0,-dn.z,dn.y,0,-pn.z,pn.y,0,-Ln.z,Ln.y,dn.z,0,-dn.x,pn.z,0,-pn.x,Ln.z,0,-Ln.x,-dn.y,dn.x,0,-pn.y,pn.x,0,-Ln.y,Ln.x,0];return!Qa(e,es,is,ns,Dr)||(e=[1,0,0,0,1,0,0,0,1],!Qa(e,es,is,ns,Dr))?!1:(Lr.crossVectors(dn,pn),e=[Lr.x,Lr.y,Lr.z],Qa(e,es,is,ns,Dr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Ai).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Ai).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Zi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Zi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Zi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Zi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Zi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Zi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Zi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Zi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Zi),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Zi=[new z,new z,new z,new z,new z,new z,new z,new z],Ai=new z,zr=new zn,es=new z,is=new z,ns=new z,dn=new z,pn=new z,Ln=new z,Ys=new z,Dr=new z,Lr=new z,In=new z;function Qa(r,t,e,i,n){for(let s=0,a=r.length-3;s<=a;s+=3){In.fromArray(r,s);const o=n.x*Math.abs(In.x)+n.y*Math.abs(In.y)+n.z*Math.abs(In.z),l=t.dot(In),c=e.dot(In),h=i.dot(In);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const jf=new zn,Zs=new z,Ja=new z;class hn{constructor(t=new z,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):jf.setFromPoints(t).getCenter(i);let n=0;for(let s=0,a=t.length;s<a;s++)n=Math.max(n,i.distanceToSquared(t[s]));return this.radius=Math.sqrt(n),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Zs.subVectors(t,this.center);const e=Zs.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),n=(i-this.radius)*.5;this.center.addScaledVector(Zs,n/i),this.radius+=n}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Ja.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Zs.copy(t.center).add(Ja)),this.expandByPoint(Zs.copy(t.center).sub(Ja))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Ki=new z,$a=new z,Ir=new z,mn=new z,to=new z,Ur=new z,eo=new z;class Tr{constructor(t=new z,e=new z(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Ki)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Ki.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Ki.copy(this.origin).addScaledVector(this.direction,e),Ki.distanceToSquared(t))}distanceSqToSegment(t,e,i,n){$a.copy(t).add(e).multiplyScalar(.5),Ir.copy(e).sub(t).normalize(),mn.copy(this.origin).sub($a);const s=t.distanceTo(e)*.5,a=-this.direction.dot(Ir),o=mn.dot(this.direction),l=-mn.dot(Ir),c=mn.lengthSq(),h=Math.abs(1-a*a);let f,u,d,m;if(h>0)if(f=a*l-o,u=a*o-l,m=s*h,f>=0)if(u>=-m)if(u<=m){const v=1/h;f*=v,u*=v,d=f*(f+a*u+2*o)+u*(a*f+u+2*l)+c}else u=s,f=Math.max(0,-(a*u+o)),d=-f*f+u*(u+2*l)+c;else u=-s,f=Math.max(0,-(a*u+o)),d=-f*f+u*(u+2*l)+c;else u<=-m?(f=Math.max(0,-(-a*s+o)),u=f>0?-s:Math.min(Math.max(-s,-l),s),d=-f*f+u*(u+2*l)+c):u<=m?(f=0,u=Math.min(Math.max(-s,-l),s),d=u*(u+2*l)+c):(f=Math.max(0,-(a*s+o)),u=f>0?s:Math.min(Math.max(-s,-l),s),d=-f*f+u*(u+2*l)+c);else u=a>0?-s:s,f=Math.max(0,-(a*u+o)),d=-f*f+u*(u+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,f),n&&n.copy($a).addScaledVector(Ir,u),d}intersectSphere(t,e){Ki.subVectors(t.center,this.origin);const i=Ki.dot(this.direction),n=Ki.dot(Ki)-i*i,s=t.radius*t.radius;if(n>s)return null;const a=Math.sqrt(s-n),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,n,s,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,u=this.origin;return c>=0?(i=(t.min.x-u.x)*c,n=(t.max.x-u.x)*c):(i=(t.max.x-u.x)*c,n=(t.min.x-u.x)*c),h>=0?(s=(t.min.y-u.y)*h,a=(t.max.y-u.y)*h):(s=(t.max.y-u.y)*h,a=(t.min.y-u.y)*h),i>a||s>n||((s>i||isNaN(i))&&(i=s),(a<n||isNaN(n))&&(n=a),f>=0?(o=(t.min.z-u.z)*f,l=(t.max.z-u.z)*f):(o=(t.max.z-u.z)*f,l=(t.min.z-u.z)*f),i>l||o>n)||((o>i||i!==i)&&(i=o),(l<n||n!==n)&&(n=l),n<0)?null:this.at(i>=0?i:n,e)}intersectsBox(t){return this.intersectBox(t,Ki)!==null}intersectTriangle(t,e,i,n,s){to.subVectors(e,t),Ur.subVectors(i,t),eo.crossVectors(to,Ur);let a=this.direction.dot(eo),o;if(a>0){if(n)return null;o=1}else if(a<0)o=-1,a=-a;else return null;mn.subVectors(this.origin,t);const l=o*this.direction.dot(Ur.crossVectors(mn,Ur));if(l<0)return null;const c=o*this.direction.dot(to.cross(mn));if(c<0||l+c>a)return null;const h=-o*mn.dot(eo);return h<0?null:this.at(h/a,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class qt{constructor(t,e,i,n,s,a,o,l,c,h,f,u,d,m,v,g){qt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,n,s,a,o,l,c,h,f,u,d,m,v,g)}set(t,e,i,n,s,a,o,l,c,h,f,u,d,m,v,g){const p=this.elements;return p[0]=t,p[4]=e,p[8]=i,p[12]=n,p[1]=s,p[5]=a,p[9]=o,p[13]=l,p[2]=c,p[6]=h,p[10]=f,p[14]=u,p[3]=d,p[7]=m,p[11]=v,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new qt().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,i=t.elements,n=1/ss.setFromMatrixColumn(t,0).length(),s=1/ss.setFromMatrixColumn(t,1).length(),a=1/ss.setFromMatrixColumn(t,2).length();return e[0]=i[0]*n,e[1]=i[1]*n,e[2]=i[2]*n,e[3]=0,e[4]=i[4]*s,e[5]=i[5]*s,e[6]=i[6]*s,e[7]=0,e[8]=i[8]*a,e[9]=i[9]*a,e[10]=i[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,n=t.y,s=t.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(n),c=Math.sin(n),h=Math.cos(s),f=Math.sin(s);if(t.order==="XYZ"){const u=a*h,d=a*f,m=o*h,v=o*f;e[0]=l*h,e[4]=-l*f,e[8]=c,e[1]=d+m*c,e[5]=u-v*c,e[9]=-o*l,e[2]=v-u*c,e[6]=m+d*c,e[10]=a*l}else if(t.order==="YXZ"){const u=l*h,d=l*f,m=c*h,v=c*f;e[0]=u+v*o,e[4]=m*o-d,e[8]=a*c,e[1]=a*f,e[5]=a*h,e[9]=-o,e[2]=d*o-m,e[6]=v+u*o,e[10]=a*l}else if(t.order==="ZXY"){const u=l*h,d=l*f,m=c*h,v=c*f;e[0]=u-v*o,e[4]=-a*f,e[8]=m+d*o,e[1]=d+m*o,e[5]=a*h,e[9]=v-u*o,e[2]=-a*c,e[6]=o,e[10]=a*l}else if(t.order==="ZYX"){const u=a*h,d=a*f,m=o*h,v=o*f;e[0]=l*h,e[4]=m*c-d,e[8]=u*c+v,e[1]=l*f,e[5]=v*c+u,e[9]=d*c-m,e[2]=-c,e[6]=o*l,e[10]=a*l}else if(t.order==="YZX"){const u=a*l,d=a*c,m=o*l,v=o*c;e[0]=l*h,e[4]=v-u*f,e[8]=m*f+d,e[1]=f,e[5]=a*h,e[9]=-o*h,e[2]=-c*h,e[6]=d*f+m,e[10]=u-v*f}else if(t.order==="XZY"){const u=a*l,d=a*c,m=o*l,v=o*c;e[0]=l*h,e[4]=-f,e[8]=c*h,e[1]=u*f+v,e[5]=a*h,e[9]=d*f-m,e[2]=m*f-d,e[6]=o*h,e[10]=v*f+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Qf,t,Jf)}lookAt(t,e,i){const n=this.elements;return mi.subVectors(t,e),mi.lengthSq()===0&&(mi.z=1),mi.normalize(),gn.crossVectors(i,mi),gn.lengthSq()===0&&(Math.abs(i.z)===1?mi.x+=1e-4:mi.z+=1e-4,mi.normalize(),gn.crossVectors(i,mi)),gn.normalize(),kr.crossVectors(mi,gn),n[0]=gn.x,n[4]=kr.x,n[8]=mi.x,n[1]=gn.y,n[5]=kr.y,n[9]=mi.y,n[2]=gn.z,n[6]=kr.z,n[10]=mi.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,n=e.elements,s=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],h=i[1],f=i[5],u=i[9],d=i[13],m=i[2],v=i[6],g=i[10],p=i[14],M=i[3],w=i[7],x=i[11],y=i[15],b=n[0],_=n[4],E=n[8],T=n[12],S=n[1],R=n[5],I=n[9],L=n[13],B=n[2],W=n[6],U=n[10],q=n[14],V=n[3],rt=n[7],et=n[11],mt=n[15];return s[0]=a*b+o*S+l*B+c*V,s[4]=a*_+o*R+l*W+c*rt,s[8]=a*E+o*I+l*U+c*et,s[12]=a*T+o*L+l*q+c*mt,s[1]=h*b+f*S+u*B+d*V,s[5]=h*_+f*R+u*W+d*rt,s[9]=h*E+f*I+u*U+d*et,s[13]=h*T+f*L+u*q+d*mt,s[2]=m*b+v*S+g*B+p*V,s[6]=m*_+v*R+g*W+p*rt,s[10]=m*E+v*I+g*U+p*et,s[14]=m*T+v*L+g*q+p*mt,s[3]=M*b+w*S+x*B+y*V,s[7]=M*_+w*R+x*W+y*rt,s[11]=M*E+w*I+x*U+y*et,s[15]=M*T+w*L+x*q+y*mt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],n=t[8],s=t[12],a=t[1],o=t[5],l=t[9],c=t[13],h=t[2],f=t[6],u=t[10],d=t[14],m=t[3],v=t[7],g=t[11],p=t[15];return m*(+s*l*f-n*c*f-s*o*u+i*c*u+n*o*d-i*l*d)+v*(+e*l*d-e*c*u+s*a*u-n*a*d+n*c*h-s*l*h)+g*(+e*c*f-e*o*d-s*a*f+i*a*d+s*o*h-i*c*h)+p*(-n*o*h-e*l*f+e*o*u+n*a*f-i*a*u+i*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const n=this.elements;return t.isVector3?(n[12]=t.x,n[13]=t.y,n[14]=t.z):(n[12]=t,n[13]=e,n[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],n=t[2],s=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],f=t[9],u=t[10],d=t[11],m=t[12],v=t[13],g=t[14],p=t[15],M=f*g*c-v*u*c+v*l*d-o*g*d-f*l*p+o*u*p,w=m*u*c-h*g*c-m*l*d+a*g*d+h*l*p-a*u*p,x=h*v*c-m*f*c+m*o*d-a*v*d-h*o*p+a*f*p,y=m*f*l-h*v*l-m*o*u+a*v*u+h*o*g-a*f*g,b=e*M+i*w+n*x+s*y;if(b===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const _=1/b;return t[0]=M*_,t[1]=(v*u*s-f*g*s-v*n*d+i*g*d+f*n*p-i*u*p)*_,t[2]=(o*g*s-v*l*s+v*n*c-i*g*c-o*n*p+i*l*p)*_,t[3]=(f*l*s-o*u*s-f*n*c+i*u*c+o*n*d-i*l*d)*_,t[4]=w*_,t[5]=(h*g*s-m*u*s+m*n*d-e*g*d-h*n*p+e*u*p)*_,t[6]=(m*l*s-a*g*s-m*n*c+e*g*c+a*n*p-e*l*p)*_,t[7]=(a*u*s-h*l*s+h*n*c-e*u*c-a*n*d+e*l*d)*_,t[8]=x*_,t[9]=(m*f*s-h*v*s-m*i*d+e*v*d+h*i*p-e*f*p)*_,t[10]=(a*v*s-m*o*s+m*i*c-e*v*c-a*i*p+e*o*p)*_,t[11]=(h*o*s-a*f*s-h*i*c+e*f*c+a*i*d-e*o*d)*_,t[12]=y*_,t[13]=(h*v*n-m*f*n+m*i*u-e*v*u-h*i*g+e*f*g)*_,t[14]=(m*o*n-a*v*n-m*i*l+e*v*l+a*i*g-e*o*g)*_,t[15]=(a*f*n-h*o*n+h*i*l-e*f*l-a*i*u+e*o*u)*_,this}scale(t){const e=this.elements,i=t.x,n=t.y,s=t.z;return e[0]*=i,e[4]*=n,e[8]*=s,e[1]*=i,e[5]*=n,e[9]*=s,e[2]*=i,e[6]*=n,e[10]*=s,e[3]*=i,e[7]*=n,e[11]*=s,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],n=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,n))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),n=Math.sin(e),s=1-i,a=t.x,o=t.y,l=t.z,c=s*a,h=s*o;return this.set(c*a+i,c*o-n*l,c*l+n*o,0,c*o+n*l,h*o+i,h*l-n*a,0,c*l-n*o,h*l+n*a,s*l*l+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,n,s,a){return this.set(1,i,s,0,t,1,a,0,e,n,1,0,0,0,0,1),this}compose(t,e,i){const n=this.elements,s=e._x,a=e._y,o=e._z,l=e._w,c=s+s,h=a+a,f=o+o,u=s*c,d=s*h,m=s*f,v=a*h,g=a*f,p=o*f,M=l*c,w=l*h,x=l*f,y=i.x,b=i.y,_=i.z;return n[0]=(1-(v+p))*y,n[1]=(d+x)*y,n[2]=(m-w)*y,n[3]=0,n[4]=(d-x)*b,n[5]=(1-(u+p))*b,n[6]=(g+M)*b,n[7]=0,n[8]=(m+w)*_,n[9]=(g-M)*_,n[10]=(1-(u+v))*_,n[11]=0,n[12]=t.x,n[13]=t.y,n[14]=t.z,n[15]=1,this}decompose(t,e,i){const n=this.elements;let s=ss.set(n[0],n[1],n[2]).length();const a=ss.set(n[4],n[5],n[6]).length(),o=ss.set(n[8],n[9],n[10]).length();this.determinant()<0&&(s=-s),t.x=n[12],t.y=n[13],t.z=n[14],Ci.copy(this);const c=1/s,h=1/a,f=1/o;return Ci.elements[0]*=c,Ci.elements[1]*=c,Ci.elements[2]*=c,Ci.elements[4]*=h,Ci.elements[5]*=h,Ci.elements[6]*=h,Ci.elements[8]*=f,Ci.elements[9]*=f,Ci.elements[10]*=f,e.setFromRotationMatrix(Ci),i.x=s,i.y=a,i.z=o,this}makePerspective(t,e,i,n,s,a,o=rn){const l=this.elements,c=2*s/(e-t),h=2*s/(i-n),f=(e+t)/(e-t),u=(i+n)/(i-n);let d,m;if(o===rn)d=-(a+s)/(a-s),m=-2*a*s/(a-s);else if(o===Ta)d=-a/(a-s),m=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=h,l[9]=u,l[13]=0,l[2]=0,l[6]=0,l[10]=d,l[14]=m,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,i,n,s,a,o=rn){const l=this.elements,c=1/(e-t),h=1/(i-n),f=1/(a-s),u=(e+t)*c,d=(i+n)*h;let m,v;if(o===rn)m=(a+s)*f,v=-2*f;else if(o===Ta)m=s*f,v=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-u,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-d,l[2]=0,l[6]=0,l[10]=v,l[14]=-m,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let n=0;n<16;n++)if(e[n]!==i[n])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const ss=new z,Ci=new qt,Qf=new z(0,0,0),Jf=new z(1,1,1),gn=new z,kr=new z,mi=new z,Sc=new qt,Tc=new Sr;class Vi{constructor(t=0,e=0,i=0,n=Vi.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=n}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,n=this._order){return this._x=t,this._y=e,this._z=i,this._order=n,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const n=t.elements,s=n[0],a=n[4],o=n[8],l=n[1],c=n[5],h=n[9],f=n[2],u=n[6],d=n[10];switch(e){case"XYZ":this._y=Math.asin(Qe(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Qe(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,s),this._z=0);break;case"ZXY":this._x=Math.asin(Qe(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-f,d),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-Qe(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(u,d),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Qe(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-f,s)):(this._x=0,this._y=Math.atan2(o,d));break;case"XZY":this._z=Math.asin(-Qe(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-h,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return Sc.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Sc,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Tc.setFromEuler(this),this.setFromQuaternion(Tc,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Vi.DEFAULT_ORDER="XYZ";class pu{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let $f=0;const _c=new z,rs=new Sr,ji=new qt,Nr=new z,Ks=new z,td=new z,ed=new Sr,Ec=new z(1,0,0),Ac=new z(0,1,0),Cc=new z(0,0,1),Rc={type:"added"},id={type:"removed"},as={type:"childadded",child:null},io={type:"childremoved",child:null};class pe extends Bs{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:$f++}),this.uuid=Hs(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=pe.DEFAULT_UP.clone();const t=new z,e=new Vi,i=new Sr,n=new z(1,1,1);function s(){i.setFromEuler(e,!1)}function a(){e.setFromQuaternion(i,void 0,!1)}e._onChange(s),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:n},modelViewMatrix:{value:new qt},normalMatrix:{value:new ee}}),this.matrix=new qt,this.matrixWorld=new qt,this.matrixAutoUpdate=pe.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=pe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new pu,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return rs.setFromAxisAngle(t,e),this.quaternion.multiply(rs),this}rotateOnWorldAxis(t,e){return rs.setFromAxisAngle(t,e),this.quaternion.premultiply(rs),this}rotateX(t){return this.rotateOnAxis(Ec,t)}rotateY(t){return this.rotateOnAxis(Ac,t)}rotateZ(t){return this.rotateOnAxis(Cc,t)}translateOnAxis(t,e){return _c.copy(t).applyQuaternion(this.quaternion),this.position.add(_c.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Ec,t)}translateY(t){return this.translateOnAxis(Ac,t)}translateZ(t){return this.translateOnAxis(Cc,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(ji.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?Nr.copy(t):Nr.set(t,e,i);const n=this.parent;this.updateWorldMatrix(!0,!1),Ks.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ji.lookAt(Ks,Nr,this.up):ji.lookAt(Nr,Ks,this.up),this.quaternion.setFromRotationMatrix(ji),n&&(ji.extractRotation(n.matrixWorld),rs.setFromRotationMatrix(ji),this.quaternion.premultiply(rs.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Rc),as.child=t,this.dispatchEvent(as),as.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(id),io.child=t,this.dispatchEvent(io),io.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),ji.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),ji.multiply(t.parent.matrixWorld)),t.applyMatrix4(ji),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Rc),as.child=t,this.dispatchEvent(as),as.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,n=this.children.length;i<n;i++){const a=this.children[i].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const n=this.children;for(let s=0,a=n.length;s<a;s++)n[s].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ks,t,td),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ks,ed,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,n=e.length;i<n;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,n=e.length;i<n;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,n=e.length;i<n;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const n=this.children;for(let s=0,a=n.length;s<a;s++)n[s].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const n={};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.castShadow===!0&&(n.castShadow=!0),this.receiveShadow===!0&&(n.receiveShadow=!0),this.visible===!1&&(n.visible=!1),this.frustumCulled===!1&&(n.frustumCulled=!1),this.renderOrder!==0&&(n.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(n.userData=this.userData),n.layers=this.layers.mask,n.matrix=this.matrix.toArray(),n.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(n.matrixAutoUpdate=!1),this.isInstancedMesh&&(n.type="InstancedMesh",n.count=this.count,n.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(n.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(n.type="BatchedMesh",n.perObjectFrustumCulled=this.perObjectFrustumCulled,n.sortObjects=this.sortObjects,n.drawRanges=this._drawRanges,n.reservedRanges=this._reservedRanges,n.visibility=this._visibility,n.active=this._active,n.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),n.maxInstanceCount=this._maxInstanceCount,n.maxVertexCount=this._maxVertexCount,n.maxIndexCount=this._maxIndexCount,n.geometryInitialized=this._geometryInitialized,n.geometryCount=this._geometryCount,n.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(n.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(n.boundingSphere={center:n.boundingSphere.center.toArray(),radius:n.boundingSphere.radius}),this.boundingBox!==null&&(n.boundingBox={min:n.boundingBox.min.toArray(),max:n.boundingBox.max.toArray()}));function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?n.background=this.background.toJSON():this.background.isTexture&&(n.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(n.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){n.geometry=s(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const f=l[c];s(t.shapes,f)}else s(t.shapes,l)}}if(this.isSkinnedMesh&&(n.bindMode=this.bindMode,n.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),n.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(s(t.materials,this.material[l]));n.material=o}else n.material=s(t.materials,this.material);if(this.children.length>0){n.children=[];for(let o=0;o<this.children.length;o++)n.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){n.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];n.animations.push(s(t.animations,l))}}if(e){const o=a(t.geometries),l=a(t.materials),c=a(t.textures),h=a(t.images),f=a(t.shapes),u=a(t.skeletons),d=a(t.animations),m=a(t.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),f.length>0&&(i.shapes=f),u.length>0&&(i.skeletons=u),d.length>0&&(i.animations=d),m.length>0&&(i.nodes=m)}return i.object=n,i;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const n=t.children[i];this.add(n.clone())}return this}}pe.DEFAULT_UP=new z(0,1,0);pe.DEFAULT_MATRIX_AUTO_UPDATE=!0;pe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Ri=new z,Qi=new z,no=new z,Ji=new z,os=new z,ls=new z,Pc=new z,so=new z,ro=new z,ao=new z,oo=new Me,lo=new Me,co=new Me;class Li{constructor(t=new z,e=new z,i=new z){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,n){n.subVectors(i,e),Ri.subVectors(t,e),n.cross(Ri);const s=n.lengthSq();return s>0?n.multiplyScalar(1/Math.sqrt(s)):n.set(0,0,0)}static getBarycoord(t,e,i,n,s){Ri.subVectors(n,e),Qi.subVectors(i,e),no.subVectors(t,e);const a=Ri.dot(Ri),o=Ri.dot(Qi),l=Ri.dot(no),c=Qi.dot(Qi),h=Qi.dot(no),f=a*c-o*o;if(f===0)return s.set(0,0,0),null;const u=1/f,d=(c*l-o*h)*u,m=(a*h-o*l)*u;return s.set(1-d-m,m,d)}static containsPoint(t,e,i,n){return this.getBarycoord(t,e,i,n,Ji)===null?!1:Ji.x>=0&&Ji.y>=0&&Ji.x+Ji.y<=1}static getInterpolation(t,e,i,n,s,a,o,l){return this.getBarycoord(t,e,i,n,Ji)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Ji.x),l.addScaledVector(a,Ji.y),l.addScaledVector(o,Ji.z),l)}static getInterpolatedAttribute(t,e,i,n,s,a){return oo.setScalar(0),lo.setScalar(0),co.setScalar(0),oo.fromBufferAttribute(t,e),lo.fromBufferAttribute(t,i),co.fromBufferAttribute(t,n),a.setScalar(0),a.addScaledVector(oo,s.x),a.addScaledVector(lo,s.y),a.addScaledVector(co,s.z),a}static isFrontFacing(t,e,i,n){return Ri.subVectors(i,e),Qi.subVectors(t,e),Ri.cross(Qi).dot(n)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,n){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[n]),this}setFromAttributeAndIndices(t,e,i,n){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,n),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Ri.subVectors(this.c,this.b),Qi.subVectors(this.a,this.b),Ri.cross(Qi).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Li.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Li.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,n,s){return Li.getInterpolation(t,this.a,this.b,this.c,e,i,n,s)}containsPoint(t){return Li.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Li.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,n=this.b,s=this.c;let a,o;os.subVectors(n,i),ls.subVectors(s,i),so.subVectors(t,i);const l=os.dot(so),c=ls.dot(so);if(l<=0&&c<=0)return e.copy(i);ro.subVectors(t,n);const h=os.dot(ro),f=ls.dot(ro);if(h>=0&&f<=h)return e.copy(n);const u=l*f-h*c;if(u<=0&&l>=0&&h<=0)return a=l/(l-h),e.copy(i).addScaledVector(os,a);ao.subVectors(t,s);const d=os.dot(ao),m=ls.dot(ao);if(m>=0&&d<=m)return e.copy(s);const v=d*c-l*m;if(v<=0&&c>=0&&m<=0)return o=c/(c-m),e.copy(i).addScaledVector(ls,o);const g=h*m-d*f;if(g<=0&&f-h>=0&&d-m>=0)return Pc.subVectors(s,n),o=(f-h)/(f-h+(d-m)),e.copy(n).addScaledVector(Pc,o);const p=1/(g+v+u);return a=v*p,o=u*p,e.copy(i).addScaledVector(os,a).addScaledVector(ls,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const mu={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},xn={h:0,s:0,l:0},Fr={h:0,s:0,l:0};function ho(r,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?r+(t-r)*6*e:e<1/2?t:e<2/3?r+(t-r)*6*(2/3-e):r}class G{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const n=t;n&&n.isColor?this.copy(n):typeof n=="number"?this.setHex(n):typeof n=="string"&&this.setStyle(n)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=ri){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ce.toWorkingColorSpace(this,e),this}setRGB(t,e,i,n=ce.workingColorSpace){return this.r=t,this.g=e,this.b=i,ce.toWorkingColorSpace(this,n),this}setHSL(t,e,i,n=ce.workingColorSpace){if(t=Bf(t,1),e=Qe(e,0,1),i=Qe(i,0,1),e===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+e):i+e-i*e,a=2*i-s;this.r=ho(a,s,t+1/3),this.g=ho(a,s,t),this.b=ho(a,s,t-1/3)}return ce.toWorkingColorSpace(this,n),this}setStyle(t,e=ri){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let n;if(n=/^(\w+)\(([^\)]*)\)/.exec(t)){let s;const a=n[1],o=n[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(n=/^\#([A-Fa-f\d]+)$/.exec(t)){const s=n[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(s,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=ri){const i=mu[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=ln(t.r),this.g=ln(t.g),this.b=ln(t.b),this}copyLinearToSRGB(t){return this.r=_s(t.r),this.g=_s(t.g),this.b=_s(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=ri){return ce.fromWorkingColorSpace(ti.copy(this),t),Math.round(Qe(ti.r*255,0,255))*65536+Math.round(Qe(ti.g*255,0,255))*256+Math.round(Qe(ti.b*255,0,255))}getHexString(t=ri){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ce.workingColorSpace){ce.fromWorkingColorSpace(ti.copy(this),e);const i=ti.r,n=ti.g,s=ti.b,a=Math.max(i,n,s),o=Math.min(i,n,s);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const f=a-o;switch(c=h<=.5?f/(a+o):f/(2-a-o),a){case i:l=(n-s)/f+(n<s?6:0);break;case n:l=(s-i)/f+2;break;case s:l=(i-n)/f+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=ce.workingColorSpace){return ce.fromWorkingColorSpace(ti.copy(this),e),t.r=ti.r,t.g=ti.g,t.b=ti.b,t}getStyle(t=ri){ce.fromWorkingColorSpace(ti.copy(this),t);const e=ti.r,i=ti.g,n=ti.b;return t!==ri?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${n.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(n*255)})`}offsetHSL(t,e,i){return this.getHSL(xn),this.setHSL(xn.h+t,xn.s+e,xn.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(xn),t.getHSL(Fr);const i=Ya(xn.h,Fr.h,e),n=Ya(xn.s,Fr.s,e),s=Ya(xn.l,Fr.l,e);return this.setHSL(i,n,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,n=this.b,s=t.elements;return this.r=s[0]*e+s[3]*i+s[6]*n,this.g=s[1]*e+s[4]*i+s[7]*n,this.b=s[2]*e+s[5]*i+s[8]*n,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const ti=new G;G.NAMES=mu;let nd=0;class Kn extends Bs{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:nd++}),this.uuid=Hs(),this.name="",this.blending=Wn,this.side=Pn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Oo,this.blendDst=Bo,this.blendEquation=Gn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new G(0,0,0),this.blendAlpha=0,this.depthFunc=zs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=dc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=$n,this.stencilZFail=$n,this.stencilZPass=$n,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const n=this[e];if(n===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}n&&n.isColor?n.set(i):n&&n.isVector3&&i&&i.isVector3?n.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Wn&&(i.blending=this.blending),this.side!==Pn&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Oo&&(i.blendSrc=this.blendSrc),this.blendDst!==Bo&&(i.blendDst=this.blendDst),this.blendEquation!==Gn&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==zs&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==dc&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==$n&&(i.stencilFail=this.stencilFail),this.stencilZFail!==$n&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==$n&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function n(s){const a=[];for(const o in s){const l=s[o];delete l.metadata,a.push(l)}return a}if(e){const s=n(t.textures),a=n(t.images);s.length>0&&(i.textures=s),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const n=e.length;i=new Array(n);for(let s=0;s!==n;++s)i[s]=e[s].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class re extends Kn{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new G(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Vi,this.combine=Yh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const ke=new z,Or=new ot;class Le{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=pc,this.updateRanges=[],this.gpuType=Ii,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let n=0,s=this.itemSize;n<s;n++)this.array[t+n]=e.array[i+n];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)Or.fromBufferAttribute(this,e),Or.applyMatrix3(t),this.setXY(e,Or.x,Or.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)ke.fromBufferAttribute(this,e),ke.applyMatrix3(t),this.setXYZ(e,ke.x,ke.y,ke.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)ke.fromBufferAttribute(this,e),ke.applyMatrix4(t),this.setXYZ(e,ke.x,ke.y,ke.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)ke.fromBufferAttribute(this,e),ke.applyNormalMatrix(t),this.setXYZ(e,ke.x,ke.y,ke.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)ke.fromBufferAttribute(this,e),ke.transformDirection(t),this.setXYZ(e,ke.x,ke.y,ke.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=qs(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=ci(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=qs(e,this.array)),e}setX(t,e){return this.normalized&&(e=ci(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=qs(e,this.array)),e}setY(t,e){return this.normalized&&(e=ci(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=qs(e,this.array)),e}setZ(t,e){return this.normalized&&(e=ci(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=qs(e,this.array)),e}setW(t,e){return this.normalized&&(e=ci(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=ci(e,this.array),i=ci(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,n){return t*=this.itemSize,this.normalized&&(e=ci(e,this.array),i=ci(i,this.array),n=ci(n,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=n,this}setXYZW(t,e,i,n,s){return t*=this.itemSize,this.normalized&&(e=ci(e,this.array),i=ci(i,this.array),n=ci(n,this.array),s=ci(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=n,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==pc&&(t.usage=this.usage),t}}class gu extends Le{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class xu extends Le{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class Qt extends Le{constructor(t,e,i){super(new Float32Array(t),e,i)}}let sd=0;const yi=new qt,uo=new pe,cs=new z,gi=new zn,js=new zn,je=new z;class we extends Bs{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:sd++}),this.uuid=Hs(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(uu(t)?xu:gu)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new ee().getNormalMatrix(t);i.applyNormalMatrix(s),i.needsUpdate=!0}const n=this.attributes.tangent;return n!==void 0&&(n.transformDirection(t),n.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return yi.makeRotationFromQuaternion(t),this.applyMatrix4(yi),this}rotateX(t){return yi.makeRotationX(t),this.applyMatrix4(yi),this}rotateY(t){return yi.makeRotationY(t),this.applyMatrix4(yi),this}rotateZ(t){return yi.makeRotationZ(t),this.applyMatrix4(yi),this}translate(t,e,i){return yi.makeTranslation(t,e,i),this.applyMatrix4(yi),this}scale(t,e,i){return yi.makeScale(t,e,i),this.applyMatrix4(yi),this}lookAt(t){return uo.lookAt(t),uo.updateMatrix(),this.applyMatrix4(uo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(cs).negate(),this.translate(cs.x,cs.y,cs.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const i=[];for(let n=0,s=t.length;n<s;n++){const a=t[n];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Qt(i,3))}else{for(let i=0,n=e.count;i<n;i++){const s=t[i];e.setXYZ(i,s.x,s.y,s.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new zn);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new z(-1/0,-1/0,-1/0),new z(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,n=e.length;i<n;i++){const s=e[i];gi.setFromBufferAttribute(s),this.morphTargetsRelative?(je.addVectors(this.boundingBox.min,gi.min),this.boundingBox.expandByPoint(je),je.addVectors(this.boundingBox.max,gi.max),this.boundingBox.expandByPoint(je)):(this.boundingBox.expandByPoint(gi.min),this.boundingBox.expandByPoint(gi.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new hn);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new z,1/0);return}if(t){const i=this.boundingSphere.center;if(gi.setFromBufferAttribute(t),e)for(let s=0,a=e.length;s<a;s++){const o=e[s];js.setFromBufferAttribute(o),this.morphTargetsRelative?(je.addVectors(gi.min,js.min),gi.expandByPoint(je),je.addVectors(gi.max,js.max),gi.expandByPoint(je)):(gi.expandByPoint(js.min),gi.expandByPoint(js.max))}gi.getCenter(i);let n=0;for(let s=0,a=t.count;s<a;s++)je.fromBufferAttribute(t,s),n=Math.max(n,i.distanceToSquared(je));if(e)for(let s=0,a=e.length;s<a;s++){const o=e[s],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)je.fromBufferAttribute(o,c),l&&(cs.fromBufferAttribute(t,c),je.add(cs)),n=Math.max(n,i.distanceToSquared(je))}this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,n=e.normal,s=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Le(new Float32Array(4*i.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let E=0;E<i.count;E++)o[E]=new z,l[E]=new z;const c=new z,h=new z,f=new z,u=new ot,d=new ot,m=new ot,v=new z,g=new z;function p(E,T,S){c.fromBufferAttribute(i,E),h.fromBufferAttribute(i,T),f.fromBufferAttribute(i,S),u.fromBufferAttribute(s,E),d.fromBufferAttribute(s,T),m.fromBufferAttribute(s,S),h.sub(c),f.sub(c),d.sub(u),m.sub(u);const R=1/(d.x*m.y-m.x*d.y);isFinite(R)&&(v.copy(h).multiplyScalar(m.y).addScaledVector(f,-d.y).multiplyScalar(R),g.copy(f).multiplyScalar(d.x).addScaledVector(h,-m.x).multiplyScalar(R),o[E].add(v),o[T].add(v),o[S].add(v),l[E].add(g),l[T].add(g),l[S].add(g))}let M=this.groups;M.length===0&&(M=[{start:0,count:t.count}]);for(let E=0,T=M.length;E<T;++E){const S=M[E],R=S.start,I=S.count;for(let L=R,B=R+I;L<B;L+=3)p(t.getX(L+0),t.getX(L+1),t.getX(L+2))}const w=new z,x=new z,y=new z,b=new z;function _(E){y.fromBufferAttribute(n,E),b.copy(y);const T=o[E];w.copy(T),w.sub(y.multiplyScalar(y.dot(T))).normalize(),x.crossVectors(b,T);const R=x.dot(l[E])<0?-1:1;a.setXYZW(E,w.x,w.y,w.z,R)}for(let E=0,T=M.length;E<T;++E){const S=M[E],R=S.start,I=S.count;for(let L=R,B=R+I;L<B;L+=3)_(t.getX(L+0)),_(t.getX(L+1)),_(t.getX(L+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Le(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let u=0,d=i.count;u<d;u++)i.setXYZ(u,0,0,0);const n=new z,s=new z,a=new z,o=new z,l=new z,c=new z,h=new z,f=new z;if(t)for(let u=0,d=t.count;u<d;u+=3){const m=t.getX(u+0),v=t.getX(u+1),g=t.getX(u+2);n.fromBufferAttribute(e,m),s.fromBufferAttribute(e,v),a.fromBufferAttribute(e,g),h.subVectors(a,s),f.subVectors(n,s),h.cross(f),o.fromBufferAttribute(i,m),l.fromBufferAttribute(i,v),c.fromBufferAttribute(i,g),o.add(h),l.add(h),c.add(h),i.setXYZ(m,o.x,o.y,o.z),i.setXYZ(v,l.x,l.y,l.z),i.setXYZ(g,c.x,c.y,c.z)}else for(let u=0,d=e.count;u<d;u+=3)n.fromBufferAttribute(e,u+0),s.fromBufferAttribute(e,u+1),a.fromBufferAttribute(e,u+2),h.subVectors(a,s),f.subVectors(n,s),h.cross(f),i.setXYZ(u+0,h.x,h.y,h.z),i.setXYZ(u+1,h.x,h.y,h.z),i.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)je.fromBufferAttribute(t,e),je.normalize(),t.setXYZ(e,je.x,je.y,je.z)}toNonIndexed(){function t(o,l){const c=o.array,h=o.itemSize,f=o.normalized,u=new c.constructor(l.length*h);let d=0,m=0;for(let v=0,g=l.length;v<g;v++){o.isInterleavedBufferAttribute?d=l[v]*o.data.stride+o.offset:d=l[v]*h;for(let p=0;p<h;p++)u[m++]=c[d++]}return new Le(u,h,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new we,i=this.index.array,n=this.attributes;for(const o in n){const l=n[o],c=t(l,i);e.setAttribute(o,c)}const s=this.morphAttributes;for(const o in s){const l=[],c=s[o];for(let h=0,f=c.length;h<f;h++){const u=c[h],d=t(u,i);l.push(d)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const l in i){const c=i[l];t.data.attributes[l]=c.toJSON(t.data)}const n={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let f=0,u=c.length;f<u;f++){const d=c[f];h.push(d.toJSON(t.data))}h.length>0&&(n[l]=h,s=!0)}s&&(t.data.morphAttributes=n,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone(e));const n=t.attributes;for(const c in n){const h=n[c];this.setAttribute(c,h.clone(e))}const s=t.morphAttributes;for(const c in s){const h=[],f=s[c];for(let u=0,d=f.length;u<d;u++)h.push(f[u].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let c=0,h=a.length;c<h;c++){const f=a[c];this.addGroup(f.start,f.count,f.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const zc=new qt,Un=new Tr,Br=new hn,Dc=new z,Hr=new z,Gr=new z,Vr=new z,fo=new z,Wr=new z,Lc=new z,Xr=new z;class N extends pe{constructor(t=new we,e=new re){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const n=e[i[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=n.length;s<a;s++){const o=n[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(t,e){const i=this.geometry,n=i.attributes.position,s=i.morphAttributes.position,a=i.morphTargetsRelative;e.fromBufferAttribute(n,t);const o=this.morphTargetInfluences;if(s&&o){Wr.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const h=o[l],f=s[l];h!==0&&(fo.fromBufferAttribute(f,t),a?Wr.addScaledVector(fo,h):Wr.addScaledVector(fo.sub(e),h))}e.add(Wr)}return e}raycast(t,e){const i=this.geometry,n=this.material,s=this.matrixWorld;n!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Br.copy(i.boundingSphere),Br.applyMatrix4(s),Un.copy(t.ray).recast(t.near),!(Br.containsPoint(Un.origin)===!1&&(Un.intersectSphere(Br,Dc)===null||Un.origin.distanceToSquared(Dc)>(t.far-t.near)**2))&&(zc.copy(s).invert(),Un.copy(t.ray).applyMatrix4(zc),!(i.boundingBox!==null&&Un.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,Un)))}_computeIntersections(t,e,i){let n;const s=this.geometry,a=this.material,o=s.index,l=s.attributes.position,c=s.attributes.uv,h=s.attributes.uv1,f=s.attributes.normal,u=s.groups,d=s.drawRange;if(o!==null)if(Array.isArray(a))for(let m=0,v=u.length;m<v;m++){const g=u[m],p=a[g.materialIndex],M=Math.max(g.start,d.start),w=Math.min(o.count,Math.min(g.start+g.count,d.start+d.count));for(let x=M,y=w;x<y;x+=3){const b=o.getX(x),_=o.getX(x+1),E=o.getX(x+2);n=qr(this,p,t,i,c,h,f,b,_,E),n&&(n.faceIndex=Math.floor(x/3),n.face.materialIndex=g.materialIndex,e.push(n))}}else{const m=Math.max(0,d.start),v=Math.min(o.count,d.start+d.count);for(let g=m,p=v;g<p;g+=3){const M=o.getX(g),w=o.getX(g+1),x=o.getX(g+2);n=qr(this,a,t,i,c,h,f,M,w,x),n&&(n.faceIndex=Math.floor(g/3),e.push(n))}}else if(l!==void 0)if(Array.isArray(a))for(let m=0,v=u.length;m<v;m++){const g=u[m],p=a[g.materialIndex],M=Math.max(g.start,d.start),w=Math.min(l.count,Math.min(g.start+g.count,d.start+d.count));for(let x=M,y=w;x<y;x+=3){const b=x,_=x+1,E=x+2;n=qr(this,p,t,i,c,h,f,b,_,E),n&&(n.faceIndex=Math.floor(x/3),n.face.materialIndex=g.materialIndex,e.push(n))}}else{const m=Math.max(0,d.start),v=Math.min(l.count,d.start+d.count);for(let g=m,p=v;g<p;g+=3){const M=g,w=g+1,x=g+2;n=qr(this,a,t,i,c,h,f,M,w,x),n&&(n.faceIndex=Math.floor(g/3),e.push(n))}}}}function rd(r,t,e,i,n,s,a,o){let l;if(t.side===oi?l=i.intersectTriangle(a,s,n,!0,o):l=i.intersectTriangle(n,s,a,t.side===Pn,o),l===null)return null;Xr.copy(o),Xr.applyMatrix4(r.matrixWorld);const c=e.ray.origin.distanceTo(Xr);return c<e.near||c>e.far?null:{distance:c,point:Xr.clone(),object:r}}function qr(r,t,e,i,n,s,a,o,l,c){r.getVertexPosition(o,Hr),r.getVertexPosition(l,Gr),r.getVertexPosition(c,Vr);const h=rd(r,t,e,i,Hr,Gr,Vr,Lc);if(h){const f=new z;Li.getBarycoord(Lc,Hr,Gr,Vr,f),n&&(h.uv=Li.getInterpolatedAttribute(n,o,l,c,f,new ot)),s&&(h.uv1=Li.getInterpolatedAttribute(s,o,l,c,f,new ot)),a&&(h.normal=Li.getInterpolatedAttribute(a,o,l,c,f,new z),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const u={a:o,b:l,c,normal:new z,materialIndex:0};Li.getNormal(Hr,Gr,Vr,u.normal),h.face=u,h.barycoord=f}return h}class _t extends we{constructor(t=1,e=1,i=1,n=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:n,heightSegments:s,depthSegments:a};const o=this;n=Math.floor(n),s=Math.floor(s),a=Math.floor(a);const l=[],c=[],h=[],f=[];let u=0,d=0;m("z","y","x",-1,-1,i,e,t,a,s,0),m("z","y","x",1,-1,i,e,-t,a,s,1),m("x","z","y",1,1,t,i,e,n,a,2),m("x","z","y",1,-1,t,i,-e,n,a,3),m("x","y","z",1,-1,t,e,i,n,s,4),m("x","y","z",-1,-1,t,e,-i,n,s,5),this.setIndex(l),this.setAttribute("position",new Qt(c,3)),this.setAttribute("normal",new Qt(h,3)),this.setAttribute("uv",new Qt(f,2));function m(v,g,p,M,w,x,y,b,_,E,T){const S=x/_,R=y/E,I=x/2,L=y/2,B=b/2,W=_+1,U=E+1;let q=0,V=0;const rt=new z;for(let et=0;et<U;et++){const mt=et*R-L;for(let Ct=0;Ct<W;Ct++){const Z=Ct*S-I;rt[v]=Z*M,rt[g]=mt*w,rt[p]=B,c.push(rt.x,rt.y,rt.z),rt[v]=0,rt[g]=0,rt[p]=b>0?1:-1,h.push(rt.x,rt.y,rt.z),f.push(Ct/_),f.push(1-et/E),q+=1}}for(let et=0;et<E;et++)for(let mt=0;mt<_;mt++){const Ct=u+mt+W*et,Z=u+mt+W*(et+1),k=u+(mt+1)+W*(et+1),Q=u+(mt+1)+W*et;l.push(Ct,Z,Q),l.push(Z,k,Q),V+=6}o.addGroup(d,V,T),d+=V,u+=q}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new _t(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Us(r){const t={};for(const e in r){t[e]={};for(const i in r[e]){const n=r[e][i];n&&(n.isColor||n.isMatrix3||n.isMatrix4||n.isVector2||n.isVector3||n.isVector4||n.isTexture||n.isQuaternion)?n.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=n.clone():Array.isArray(n)?t[e][i]=n.slice():t[e][i]=n}}return t}function si(r){const t={};for(let e=0;e<r.length;e++){const i=Us(r[e]);for(const n in i)t[n]=i[n]}return t}function ad(r){const t=[];for(let e=0;e<r.length;e++)t.push(r[e].clone());return t}function vu(r){const t=r.getRenderTarget();return t===null?r.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:ce.workingColorSpace}const xr={clone:Us,merge:si};var od=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ld=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ye extends Kn{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=od,this.fragmentShader=ld,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Us(t.uniforms),this.uniformsGroups=ad(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const n in this.uniforms){const a=this.uniforms[n].value;a&&a.isTexture?e.uniforms[n]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[n]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[n]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[n]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[n]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[n]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[n]={type:"m4",value:a.toArray()}:e.uniforms[n]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const n in this.extensions)this.extensions[n]===!0&&(i[n]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}}class yu extends pe{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new qt,this.projectionMatrix=new qt,this.projectionMatrixInverse=new qt,this.coordinateSystem=rn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const vn=new z,Ic=new ot,Uc=new ot;class fi extends yu{constructor(t=50,e=1,i=.1,n=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=n,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=_a*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(qa*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return _a*2*Math.atan(Math.tan(qa*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){vn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(vn.x,vn.y).multiplyScalar(-t/vn.z),vn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(vn.x,vn.y).multiplyScalar(-t/vn.z)}getViewSize(t,e){return this.getViewBounds(t,Ic,Uc),e.subVectors(Uc,Ic)}setViewOffset(t,e,i,n,s,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=n,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(qa*.5*this.fov)/this.zoom,i=2*e,n=this.aspect*i,s=-.5*n;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;s+=a.offsetX*n/l,e-=a.offsetY*i/c,n*=a.width/l,i*=a.height/c}const o=this.filmOffset;o!==0&&(s+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+n,e,e-i,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const hs=-90,us=1;class cd extends pe{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const n=new fi(hs,us,t,e);n.layers=this.layers,this.add(n);const s=new fi(hs,us,t,e);s.layers=this.layers,this.add(s);const a=new fi(hs,us,t,e);a.layers=this.layers,this.add(a);const o=new fi(hs,us,t,e);o.layers=this.layers,this.add(o);const l=new fi(hs,us,t,e);l.layers=this.layers,this.add(l);const c=new fi(hs,us,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,n,s,a,o,l]=e;for(const c of e)this.remove(c);if(t===rn)i.up.set(0,1,0),i.lookAt(1,0,0),n.up.set(0,1,0),n.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Ta)i.up.set(0,-1,0),i.lookAt(-1,0,0),n.up.set(0,-1,0),n.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:n}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,l,c,h]=this.children,f=t.getRenderTarget(),u=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),m=t.xr.enabled;t.xr.enabled=!1;const v=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,n),t.render(e,s),t.setRenderTarget(i,1,n),t.render(e,a),t.setRenderTarget(i,2,n),t.render(e,o),t.setRenderTarget(i,3,n),t.render(e,l),t.setRenderTarget(i,4,n),t.render(e,c),i.texture.generateMipmaps=v,t.setRenderTarget(i,5,n),t.render(e,h),t.setRenderTarget(f,u,d),t.xr.enabled=m,i.texture.needsPMREMUpdate=!0}}class Mu extends ii{constructor(t,e,i,n,s,a,o,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:Ds,super(t,e,i,n,s,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class hd extends Be{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},n=[i,i,i,i,i,i];this.texture=new Mu(n,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:Oe}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},n=new _t(5,5,5),s=new ye({name:"CubemapFromEquirect",uniforms:Us(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:oi,blending:on});s.uniforms.tEquirect.value=e;const a=new N(n,s),o=e.minFilter;return e.minFilter===_n&&(e.minFilter=Oe),new cd(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e,i,n){const s=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,i,n);t.setRenderTarget(s)}}const po=new z,ud=new z,fd=new ee;class Bn{constructor(t=new z(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,n){return this.normal.set(t,e,i),this.constant=n,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const n=po.subVectors(i,e).cross(ud.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(n,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const i=t.delta(po),n=this.normal.dot(i);if(n===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const s=-(t.start.dot(this.normal)+this.constant)/n;return s<0||s>1?null:e.copy(t.start).addScaledVector(i,s)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||fd.getNormalMatrix(t),n=this.coplanarPoint(po).applyMatrix4(t),s=this.normal.applyMatrix3(i).normalize();return this.constant=-n.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const kn=new hn,Yr=new z;class Hl{constructor(t=new Bn,e=new Bn,i=new Bn,n=new Bn,s=new Bn,a=new Bn){this.planes=[t,e,i,n,s,a]}set(t,e,i,n,s,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(i),o[3].copy(n),o[4].copy(s),o[5].copy(a),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=rn){const i=this.planes,n=t.elements,s=n[0],a=n[1],o=n[2],l=n[3],c=n[4],h=n[5],f=n[6],u=n[7],d=n[8],m=n[9],v=n[10],g=n[11],p=n[12],M=n[13],w=n[14],x=n[15];if(i[0].setComponents(l-s,u-c,g-d,x-p).normalize(),i[1].setComponents(l+s,u+c,g+d,x+p).normalize(),i[2].setComponents(l+a,u+h,g+m,x+M).normalize(),i[3].setComponents(l-a,u-h,g-m,x-M).normalize(),i[4].setComponents(l-o,u-f,g-v,x-w).normalize(),e===rn)i[5].setComponents(l+o,u+f,g+v,x+w).normalize();else if(e===Ta)i[5].setComponents(o,f,v,w).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),kn.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),kn.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(kn)}intersectsSprite(t){return kn.center.set(0,0,0),kn.radius=.7071067811865476,kn.applyMatrix4(t.matrixWorld),this.intersectsSphere(kn)}intersectsSphere(t){const e=this.planes,i=t.center,n=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(i)<n)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const n=e[i];if(Yr.x=n.normal.x>0?t.max.x:t.min.x,Yr.y=n.normal.y>0?t.max.y:t.min.y,Yr.z=n.normal.z>0?t.max.z:t.min.z,n.distanceToPoint(Yr)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function bu(){let r=null,t=!1,e=null,i=null;function n(s,a){e(s,a),i=r.requestAnimationFrame(n)}return{start:function(){t!==!0&&e!==null&&(i=r.requestAnimationFrame(n),t=!0)},stop:function(){r.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){r=s}}}function dd(r){const t=new WeakMap;function e(o,l){const c=o.array,h=o.usage,f=c.byteLength,u=r.createBuffer();r.bindBuffer(l,u),r.bufferData(l,c,h),o.onUploadCallback();let d;if(c instanceof Float32Array)d=r.FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?d=r.HALF_FLOAT:d=r.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=r.SHORT;else if(c instanceof Uint32Array)d=r.UNSIGNED_INT;else if(c instanceof Int32Array)d=r.INT;else if(c instanceof Int8Array)d=r.BYTE;else if(c instanceof Uint8Array)d=r.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=r.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:f}}function i(o,l,c){const h=l.array,f=l.updateRanges;if(r.bindBuffer(c,o),f.length===0)r.bufferSubData(c,0,h);else{f.sort((d,m)=>d.start-m.start);let u=0;for(let d=1;d<f.length;d++){const m=f[u],v=f[d];v.start<=m.start+m.count+1?m.count=Math.max(m.count,v.start+v.count-m.start):(++u,f[u]=v)}f.length=u+1;for(let d=0,m=f.length;d<m;d++){const v=f[d];r.bufferSubData(c,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function n(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=t.get(o);l&&(r.deleteBuffer(l.buffer),t.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=t.get(o);if(c===void 0)t.set(o,e(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:n,remove:s,update:a}}class ui extends we{constructor(t=1,e=1,i=1,n=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:n};const s=t/2,a=e/2,o=Math.floor(i),l=Math.floor(n),c=o+1,h=l+1,f=t/o,u=e/l,d=[],m=[],v=[],g=[];for(let p=0;p<h;p++){const M=p*u-a;for(let w=0;w<c;w++){const x=w*f-s;m.push(x,-M,0),v.push(0,0,1),g.push(w/o),g.push(1-p/l)}}for(let p=0;p<l;p++)for(let M=0;M<o;M++){const w=M+c*p,x=M+c*(p+1),y=M+1+c*(p+1),b=M+1+c*p;d.push(w,x,b),d.push(x,y,b)}this.setIndex(d),this.setAttribute("position",new Qt(m,3)),this.setAttribute("normal",new Qt(v,3)),this.setAttribute("uv",new Qt(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ui(t.width,t.height,t.widthSegments,t.heightSegments)}}var pd=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,md=`#ifdef USE_ALPHAHASH
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
#endif`,gd=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,xd=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,vd=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,yd=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Md=`#ifdef USE_AOMAP
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
#endif`,bd=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,wd=`#ifdef USE_BATCHING
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
#endif`,Sd=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Td=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,_d=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Ed=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Ad=`#ifdef USE_IRIDESCENCE
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
#endif`,Cd=`#ifdef USE_BUMPMAP
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
#endif`,Rd=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Pd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,zd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Dd=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Ld=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Id=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Ud=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,kd=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Nd=`#define PI 3.141592653589793
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
} // validated`,Fd=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Od=`vec3 transformedNormal = objectNormal;
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
#endif`,Bd=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Hd=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Gd=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Vd=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Wd="gl_FragColor = linearToOutputTexel( gl_FragColor );",Xd=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,qd=`#ifdef USE_ENVMAP
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
#endif`,Yd=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Zd=`#ifdef USE_ENVMAP
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
#endif`,Kd=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,jd=`#ifdef USE_ENVMAP
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
#endif`,Qd=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Jd=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,$d=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,t0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,e0=`#ifdef USE_GRADIENTMAP
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
}`,i0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,n0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,s0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,r0=`uniform bool receiveShadow;
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
#endif`,a0=`#ifdef USE_ENVMAP
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
#endif`,o0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,l0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,c0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,h0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,u0=`PhysicalMaterial material;
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
#endif`,f0=`struct PhysicalMaterial {
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
}`,d0=`
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
#endif`,p0=`#if defined( RE_IndirectDiffuse )
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
#endif`,m0=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,g0=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,x0=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,v0=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,y0=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,M0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,b0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,w0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,S0=`#if defined( USE_POINTS_UV )
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
#endif`,T0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,_0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,E0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,A0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,C0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,R0=`#ifdef USE_MORPHTARGETS
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
#endif`,P0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,z0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,D0=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,L0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,I0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,U0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,k0=`#ifdef USE_NORMALMAP
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
#endif`,N0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,F0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,O0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,B0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,H0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,G0=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,V0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,W0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,X0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,q0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Y0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Z0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,K0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,j0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Q0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,J0=`float getShadowMask() {
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
}`,$0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,tp=`#ifdef USE_SKINNING
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
#endif`,ep=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,ip=`#ifdef USE_SKINNING
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
#endif`,np=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,sp=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,rp=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,ap=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,op=`#ifdef USE_TRANSMISSION
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
#endif`,lp=`#ifdef USE_TRANSMISSION
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
#endif`,cp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,hp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,up=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,fp=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const dp=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,pp=`uniform sampler2D t2D;
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
}`,mp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,gp=`#ifdef ENVMAP_TYPE_CUBE
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
}`,xp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,vp=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,yp=`#include <common>
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
}`,Mp=`#if DEPTH_PACKING == 3200
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
}`,bp=`#define DISTANCE
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
}`,wp=`#define DISTANCE
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
}`,Sp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Tp=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,_p=`uniform float scale;
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
}`,Ep=`uniform vec3 diffuse;
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
}`,Ap=`#include <common>
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
}`,Cp=`uniform vec3 diffuse;
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
}`,Rp=`#define LAMBERT
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
}`,Pp=`#define LAMBERT
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
}`,zp=`#define MATCAP
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
}`,Dp=`#define MATCAP
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
}`,Lp=`#define NORMAL
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
}`,Ip=`#define NORMAL
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
}`,Up=`#define PHONG
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
}`,kp=`#define PHONG
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
}`,Np=`#define STANDARD
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
}`,Fp=`#define STANDARD
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
}`,Op=`#define TOON
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
}`,Bp=`#define TOON
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
}`,Hp=`uniform float size;
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
}`,Gp=`uniform vec3 diffuse;
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
}`,Vp=`#include <common>
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
}`,Wp=`uniform vec3 color;
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
}`,Xp=`uniform float rotation;
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
}`,qp=`uniform vec3 diffuse;
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
}`,ne={alphahash_fragment:pd,alphahash_pars_fragment:md,alphamap_fragment:gd,alphamap_pars_fragment:xd,alphatest_fragment:vd,alphatest_pars_fragment:yd,aomap_fragment:Md,aomap_pars_fragment:bd,batching_pars_vertex:wd,batching_vertex:Sd,begin_vertex:Td,beginnormal_vertex:_d,bsdfs:Ed,iridescence_fragment:Ad,bumpmap_pars_fragment:Cd,clipping_planes_fragment:Rd,clipping_planes_pars_fragment:Pd,clipping_planes_pars_vertex:zd,clipping_planes_vertex:Dd,color_fragment:Ld,color_pars_fragment:Id,color_pars_vertex:Ud,color_vertex:kd,common:Nd,cube_uv_reflection_fragment:Fd,defaultnormal_vertex:Od,displacementmap_pars_vertex:Bd,displacementmap_vertex:Hd,emissivemap_fragment:Gd,emissivemap_pars_fragment:Vd,colorspace_fragment:Wd,colorspace_pars_fragment:Xd,envmap_fragment:qd,envmap_common_pars_fragment:Yd,envmap_pars_fragment:Zd,envmap_pars_vertex:Kd,envmap_physical_pars_fragment:a0,envmap_vertex:jd,fog_vertex:Qd,fog_pars_vertex:Jd,fog_fragment:$d,fog_pars_fragment:t0,gradientmap_pars_fragment:e0,lightmap_pars_fragment:i0,lights_lambert_fragment:n0,lights_lambert_pars_fragment:s0,lights_pars_begin:r0,lights_toon_fragment:o0,lights_toon_pars_fragment:l0,lights_phong_fragment:c0,lights_phong_pars_fragment:h0,lights_physical_fragment:u0,lights_physical_pars_fragment:f0,lights_fragment_begin:d0,lights_fragment_maps:p0,lights_fragment_end:m0,logdepthbuf_fragment:g0,logdepthbuf_pars_fragment:x0,logdepthbuf_pars_vertex:v0,logdepthbuf_vertex:y0,map_fragment:M0,map_pars_fragment:b0,map_particle_fragment:w0,map_particle_pars_fragment:S0,metalnessmap_fragment:T0,metalnessmap_pars_fragment:_0,morphinstance_vertex:E0,morphcolor_vertex:A0,morphnormal_vertex:C0,morphtarget_pars_vertex:R0,morphtarget_vertex:P0,normal_fragment_begin:z0,normal_fragment_maps:D0,normal_pars_fragment:L0,normal_pars_vertex:I0,normal_vertex:U0,normalmap_pars_fragment:k0,clearcoat_normal_fragment_begin:N0,clearcoat_normal_fragment_maps:F0,clearcoat_pars_fragment:O0,iridescence_pars_fragment:B0,opaque_fragment:H0,packing:G0,premultiplied_alpha_fragment:V0,project_vertex:W0,dithering_fragment:X0,dithering_pars_fragment:q0,roughnessmap_fragment:Y0,roughnessmap_pars_fragment:Z0,shadowmap_pars_fragment:K0,shadowmap_pars_vertex:j0,shadowmap_vertex:Q0,shadowmask_pars_fragment:J0,skinbase_vertex:$0,skinning_pars_vertex:tp,skinning_vertex:ep,skinnormal_vertex:ip,specularmap_fragment:np,specularmap_pars_fragment:sp,tonemapping_fragment:rp,tonemapping_pars_fragment:ap,transmission_fragment:op,transmission_pars_fragment:lp,uv_pars_fragment:cp,uv_pars_vertex:hp,uv_vertex:up,worldpos_vertex:fp,background_vert:dp,background_frag:pp,backgroundCube_vert:mp,backgroundCube_frag:gp,cube_vert:xp,cube_frag:vp,depth_vert:yp,depth_frag:Mp,distanceRGBA_vert:bp,distanceRGBA_frag:wp,equirect_vert:Sp,equirect_frag:Tp,linedashed_vert:_p,linedashed_frag:Ep,meshbasic_vert:Ap,meshbasic_frag:Cp,meshlambert_vert:Rp,meshlambert_frag:Pp,meshmatcap_vert:zp,meshmatcap_frag:Dp,meshnormal_vert:Lp,meshnormal_frag:Ip,meshphong_vert:Up,meshphong_frag:kp,meshphysical_vert:Np,meshphysical_frag:Fp,meshtoon_vert:Op,meshtoon_frag:Bp,points_vert:Hp,points_frag:Gp,shadow_vert:Vp,shadow_frag:Wp,sprite_vert:Xp,sprite_frag:qp},xt={common:{diffuse:{value:new G(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ee},alphaMap:{value:null},alphaMapTransform:{value:new ee},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ee}},envmap:{envMap:{value:null},envMapRotation:{value:new ee},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ee}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ee}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ee},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ee},normalScale:{value:new ot(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ee},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ee}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ee}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ee}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new G(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new G(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ee},alphaTest:{value:0},uvTransform:{value:new ee}},sprite:{diffuse:{value:new G(16777215)},opacity:{value:1},center:{value:new ot(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ee},alphaMap:{value:null},alphaMapTransform:{value:new ee},alphaTest:{value:0}}},Fi={basic:{uniforms:si([xt.common,xt.specularmap,xt.envmap,xt.aomap,xt.lightmap,xt.fog]),vertexShader:ne.meshbasic_vert,fragmentShader:ne.meshbasic_frag},lambert:{uniforms:si([xt.common,xt.specularmap,xt.envmap,xt.aomap,xt.lightmap,xt.emissivemap,xt.bumpmap,xt.normalmap,xt.displacementmap,xt.fog,xt.lights,{emissive:{value:new G(0)}}]),vertexShader:ne.meshlambert_vert,fragmentShader:ne.meshlambert_frag},phong:{uniforms:si([xt.common,xt.specularmap,xt.envmap,xt.aomap,xt.lightmap,xt.emissivemap,xt.bumpmap,xt.normalmap,xt.displacementmap,xt.fog,xt.lights,{emissive:{value:new G(0)},specular:{value:new G(1118481)},shininess:{value:30}}]),vertexShader:ne.meshphong_vert,fragmentShader:ne.meshphong_frag},standard:{uniforms:si([xt.common,xt.envmap,xt.aomap,xt.lightmap,xt.emissivemap,xt.bumpmap,xt.normalmap,xt.displacementmap,xt.roughnessmap,xt.metalnessmap,xt.fog,xt.lights,{emissive:{value:new G(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ne.meshphysical_vert,fragmentShader:ne.meshphysical_frag},toon:{uniforms:si([xt.common,xt.aomap,xt.lightmap,xt.emissivemap,xt.bumpmap,xt.normalmap,xt.displacementmap,xt.gradientmap,xt.fog,xt.lights,{emissive:{value:new G(0)}}]),vertexShader:ne.meshtoon_vert,fragmentShader:ne.meshtoon_frag},matcap:{uniforms:si([xt.common,xt.bumpmap,xt.normalmap,xt.displacementmap,xt.fog,{matcap:{value:null}}]),vertexShader:ne.meshmatcap_vert,fragmentShader:ne.meshmatcap_frag},points:{uniforms:si([xt.points,xt.fog]),vertexShader:ne.points_vert,fragmentShader:ne.points_frag},dashed:{uniforms:si([xt.common,xt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ne.linedashed_vert,fragmentShader:ne.linedashed_frag},depth:{uniforms:si([xt.common,xt.displacementmap]),vertexShader:ne.depth_vert,fragmentShader:ne.depth_frag},normal:{uniforms:si([xt.common,xt.bumpmap,xt.normalmap,xt.displacementmap,{opacity:{value:1}}]),vertexShader:ne.meshnormal_vert,fragmentShader:ne.meshnormal_frag},sprite:{uniforms:si([xt.sprite,xt.fog]),vertexShader:ne.sprite_vert,fragmentShader:ne.sprite_frag},background:{uniforms:{uvTransform:{value:new ee},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ne.background_vert,fragmentShader:ne.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ee}},vertexShader:ne.backgroundCube_vert,fragmentShader:ne.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ne.cube_vert,fragmentShader:ne.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ne.equirect_vert,fragmentShader:ne.equirect_frag},distanceRGBA:{uniforms:si([xt.common,xt.displacementmap,{referencePosition:{value:new z},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ne.distanceRGBA_vert,fragmentShader:ne.distanceRGBA_frag},shadow:{uniforms:si([xt.lights,xt.fog,{color:{value:new G(0)},opacity:{value:1}}]),vertexShader:ne.shadow_vert,fragmentShader:ne.shadow_frag}};Fi.physical={uniforms:si([Fi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ee},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ee},clearcoatNormalScale:{value:new ot(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ee},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ee},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ee},sheen:{value:0},sheenColor:{value:new G(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ee},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ee},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ee},transmissionSamplerSize:{value:new ot},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ee},attenuationDistance:{value:0},attenuationColor:{value:new G(0)},specularColor:{value:new G(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ee},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ee},anisotropyVector:{value:new ot},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ee}}]),vertexShader:ne.meshphysical_vert,fragmentShader:ne.meshphysical_frag};const Zr={r:0,b:0,g:0},Nn=new Vi,Yp=new qt;function Zp(r,t,e,i,n,s,a){const o=new G(0);let l=s===!0?0:1,c,h,f=null,u=0,d=null;function m(M){let w=M.isScene===!0?M.background:null;return w&&w.isTexture&&(w=(M.backgroundBlurriness>0?e:t).get(w)),w}function v(M){let w=!1;const x=m(M);x===null?p(o,l):x&&x.isColor&&(p(x,1),w=!0);const y=r.xr.getEnvironmentBlendMode();y==="additive"?i.buffers.color.setClear(0,0,0,1,a):y==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(r.autoClear||w)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil))}function g(M,w){const x=m(w);x&&(x.isCubeTexture||x.mapping===Na)?(h===void 0&&(h=new N(new _t(1,1,1),new ye({name:"BackgroundCubeMaterial",uniforms:Us(Fi.backgroundCube.uniforms),vertexShader:Fi.backgroundCube.vertexShader,fragmentShader:Fi.backgroundCube.fragmentShader,side:oi,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(y,b,_){this.matrixWorld.copyPosition(_.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(h)),Nn.copy(w.backgroundRotation),Nn.x*=-1,Nn.y*=-1,Nn.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(Nn.y*=-1,Nn.z*=-1),h.material.uniforms.envMap.value=x,h.material.uniforms.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=w.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Yp.makeRotationFromEuler(Nn)),h.material.toneMapped=ce.getTransfer(x.colorSpace)!==ve,(f!==x||u!==x.version||d!==r.toneMapping)&&(h.material.needsUpdate=!0,f=x,u=x.version,d=r.toneMapping),h.layers.enableAll(),M.unshift(h,h.geometry,h.material,0,0,null)):x&&x.isTexture&&(c===void 0&&(c=new N(new ui(2,2),new ye({name:"BackgroundMaterial",uniforms:Us(Fi.background.uniforms),vertexShader:Fi.background.vertexShader,fragmentShader:Fi.background.fragmentShader,side:Pn,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(c)),c.material.uniforms.t2D.value=x,c.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,c.material.toneMapped=ce.getTransfer(x.colorSpace)!==ve,x.matrixAutoUpdate===!0&&x.updateMatrix(),c.material.uniforms.uvTransform.value.copy(x.matrix),(f!==x||u!==x.version||d!==r.toneMapping)&&(c.material.needsUpdate=!0,f=x,u=x.version,d=r.toneMapping),c.layers.enableAll(),M.unshift(c,c.geometry,c.material,0,0,null))}function p(M,w){M.getRGB(Zr,vu(r)),i.buffers.color.setClear(Zr.r,Zr.g,Zr.b,w,a)}return{getClearColor:function(){return o},setClearColor:function(M,w=1){o.set(M),l=w,p(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(M){l=M,p(o,l)},render:v,addToRenderList:g}}function Kp(r,t){const e=r.getParameter(r.MAX_VERTEX_ATTRIBS),i={},n=u(null);let s=n,a=!1;function o(S,R,I,L,B){let W=!1;const U=f(L,I,R);s!==U&&(s=U,c(s.object)),W=d(S,L,I,B),W&&m(S,L,I,B),B!==null&&t.update(B,r.ELEMENT_ARRAY_BUFFER),(W||a)&&(a=!1,x(S,R,I,L),B!==null&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,t.get(B).buffer))}function l(){return r.createVertexArray()}function c(S){return r.bindVertexArray(S)}function h(S){return r.deleteVertexArray(S)}function f(S,R,I){const L=I.wireframe===!0;let B=i[S.id];B===void 0&&(B={},i[S.id]=B);let W=B[R.id];W===void 0&&(W={},B[R.id]=W);let U=W[L];return U===void 0&&(U=u(l()),W[L]=U),U}function u(S){const R=[],I=[],L=[];for(let B=0;B<e;B++)R[B]=0,I[B]=0,L[B]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:R,enabledAttributes:I,attributeDivisors:L,object:S,attributes:{},index:null}}function d(S,R,I,L){const B=s.attributes,W=R.attributes;let U=0;const q=I.getAttributes();for(const V in q)if(q[V].location>=0){const et=B[V];let mt=W[V];if(mt===void 0&&(V==="instanceMatrix"&&S.instanceMatrix&&(mt=S.instanceMatrix),V==="instanceColor"&&S.instanceColor&&(mt=S.instanceColor)),et===void 0||et.attribute!==mt||mt&&et.data!==mt.data)return!0;U++}return s.attributesNum!==U||s.index!==L}function m(S,R,I,L){const B={},W=R.attributes;let U=0;const q=I.getAttributes();for(const V in q)if(q[V].location>=0){let et=W[V];et===void 0&&(V==="instanceMatrix"&&S.instanceMatrix&&(et=S.instanceMatrix),V==="instanceColor"&&S.instanceColor&&(et=S.instanceColor));const mt={};mt.attribute=et,et&&et.data&&(mt.data=et.data),B[V]=mt,U++}s.attributes=B,s.attributesNum=U,s.index=L}function v(){const S=s.newAttributes;for(let R=0,I=S.length;R<I;R++)S[R]=0}function g(S){p(S,0)}function p(S,R){const I=s.newAttributes,L=s.enabledAttributes,B=s.attributeDivisors;I[S]=1,L[S]===0&&(r.enableVertexAttribArray(S),L[S]=1),B[S]!==R&&(r.vertexAttribDivisor(S,R),B[S]=R)}function M(){const S=s.newAttributes,R=s.enabledAttributes;for(let I=0,L=R.length;I<L;I++)R[I]!==S[I]&&(r.disableVertexAttribArray(I),R[I]=0)}function w(S,R,I,L,B,W,U){U===!0?r.vertexAttribIPointer(S,R,I,B,W):r.vertexAttribPointer(S,R,I,L,B,W)}function x(S,R,I,L){v();const B=L.attributes,W=I.getAttributes(),U=R.defaultAttributeValues;for(const q in W){const V=W[q];if(V.location>=0){let rt=B[q];if(rt===void 0&&(q==="instanceMatrix"&&S.instanceMatrix&&(rt=S.instanceMatrix),q==="instanceColor"&&S.instanceColor&&(rt=S.instanceColor)),rt!==void 0){const et=rt.normalized,mt=rt.itemSize,Ct=t.get(rt);if(Ct===void 0)continue;const Z=Ct.buffer,k=Ct.type,Q=Ct.bytesPerElement,st=k===r.INT||k===r.UNSIGNED_INT||rt.gpuType===Ul;if(rt.isInterleavedBufferAttribute){const $=rt.data,ut=$.stride,Rt=rt.offset;if($.isInstancedInterleavedBuffer){for(let Pt=0;Pt<V.locationSize;Pt++)p(V.location+Pt,$.meshPerAttribute);S.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=$.meshPerAttribute*$.count)}else for(let Pt=0;Pt<V.locationSize;Pt++)g(V.location+Pt);r.bindBuffer(r.ARRAY_BUFFER,Z);for(let Pt=0;Pt<V.locationSize;Pt++)w(V.location+Pt,mt/V.locationSize,k,et,ut*Q,(Rt+mt/V.locationSize*Pt)*Q,st)}else{if(rt.isInstancedBufferAttribute){for(let $=0;$<V.locationSize;$++)p(V.location+$,rt.meshPerAttribute);S.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=rt.meshPerAttribute*rt.count)}else for(let $=0;$<V.locationSize;$++)g(V.location+$);r.bindBuffer(r.ARRAY_BUFFER,Z);for(let $=0;$<V.locationSize;$++)w(V.location+$,mt/V.locationSize,k,et,mt*Q,mt/V.locationSize*$*Q,st)}}else if(U!==void 0){const et=U[q];if(et!==void 0)switch(et.length){case 2:r.vertexAttrib2fv(V.location,et);break;case 3:r.vertexAttrib3fv(V.location,et);break;case 4:r.vertexAttrib4fv(V.location,et);break;default:r.vertexAttrib1fv(V.location,et)}}}}M()}function y(){E();for(const S in i){const R=i[S];for(const I in R){const L=R[I];for(const B in L)h(L[B].object),delete L[B];delete R[I]}delete i[S]}}function b(S){if(i[S.id]===void 0)return;const R=i[S.id];for(const I in R){const L=R[I];for(const B in L)h(L[B].object),delete L[B];delete R[I]}delete i[S.id]}function _(S){for(const R in i){const I=i[R];if(I[S.id]===void 0)continue;const L=I[S.id];for(const B in L)h(L[B].object),delete L[B];delete I[S.id]}}function E(){T(),a=!0,s!==n&&(s=n,c(s.object))}function T(){n.geometry=null,n.program=null,n.wireframe=!1}return{setup:o,reset:E,resetDefaultState:T,dispose:y,releaseStatesOfGeometry:b,releaseStatesOfProgram:_,initAttributes:v,enableAttribute:g,disableUnusedAttributes:M}}function jp(r,t,e){let i;function n(c){i=c}function s(c,h){r.drawArrays(i,c,h),e.update(h,i,1)}function a(c,h,f){f!==0&&(r.drawArraysInstanced(i,c,h,f),e.update(h,i,f))}function o(c,h,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,h,0,f);let d=0;for(let m=0;m<f;m++)d+=h[m];e.update(d,i,1)}function l(c,h,f,u){if(f===0)return;const d=t.get("WEBGL_multi_draw");if(d===null)for(let m=0;m<c.length;m++)a(c[m],h[m],u[m]);else{d.multiDrawArraysInstancedWEBGL(i,c,0,h,0,u,0,f);let m=0;for(let v=0;v<f;v++)m+=h[v]*u[v];e.update(m,i,1)}}this.setMode=n,this.render=s,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function Qp(r,t,e,i){let n;function s(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){const _=t.get("EXT_texture_filter_anisotropic");n=r.getParameter(_.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function a(_){return!(_!==Ge&&i.convert(_)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(_){const E=_===ai&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(_!==cn&&i.convert(_)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_TYPE)&&_!==Ii&&!E)}function l(_){if(_==="highp"){if(r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.HIGH_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision>0)return"highp";_="mediump"}return _==="mediump"&&r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.MEDIUM_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const f=e.logarithmicDepthBuffer===!0,u=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),d=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),m=r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=r.getParameter(r.MAX_TEXTURE_SIZE),g=r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE),p=r.getParameter(r.MAX_VERTEX_ATTRIBS),M=r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS),w=r.getParameter(r.MAX_VARYING_VECTORS),x=r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS),y=m>0,b=r.getParameter(r.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:f,reverseDepthBuffer:u,maxTextures:d,maxVertexTextures:m,maxTextureSize:v,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:M,maxVaryings:w,maxFragmentUniforms:x,vertexTextures:y,maxSamples:b}}function Jp(r){const t=this;let e=null,i=0,n=!1,s=!1;const a=new Bn,o=new ee,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,u){const d=f.length!==0||u||i!==0||n;return n=u,i=f.length,d},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(f,u){e=h(f,u,0)},this.setState=function(f,u,d){const m=f.clippingPlanes,v=f.clipIntersection,g=f.clipShadows,p=r.get(f);if(!n||m===null||m.length===0||s&&!g)s?h(null):c();else{const M=s?0:i,w=M*4;let x=p.clippingState||null;l.value=x,x=h(m,u,w,d);for(let y=0;y!==w;++y)x[y]=e[y];p.clippingState=x,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=M}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function h(f,u,d,m){const v=f!==null?f.length:0;let g=null;if(v!==0){if(g=l.value,m!==!0||g===null){const p=d+v*4,M=u.matrixWorldInverse;o.getNormalMatrix(M),(g===null||g.length<p)&&(g=new Float32Array(p));for(let w=0,x=d;w!==v;++w,x+=4)a.copy(f[w]).applyMatrix4(M,o),a.normal.toArray(g,x),g[x+3]=a.constant}l.value=g,l.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,g}}function $p(r){let t=new WeakMap;function e(a,o){return o===Sa?a.mapping=Ds:o===Zo&&(a.mapping=Ls),a}function i(a){if(a&&a.isTexture){const o=a.mapping;if(o===Sa||o===Zo)if(t.has(a)){const l=t.get(a).texture;return e(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new hd(l.height);return c.fromEquirectangularTexture(r,a),t.set(a,c),a.addEventListener("dispose",n),e(c.texture,a.mapping)}else return null}}return a}function n(a){const o=a.target;o.removeEventListener("dispose",n);const l=t.get(o);l!==void 0&&(t.delete(o),l.dispose())}function s(){t=new WeakMap}return{get:i,dispose:s}}class Ba extends yu{constructor(t=-1,e=1,i=1,n=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=n,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,n,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=n,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,n=(this.top+this.bottom)/2;let s=i-t,a=i+t,o=n+e,l=n-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,a=s+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const bs=4,kc=[.125,.215,.35,.446,.526,.582],Vn=20,mo=new Ba,Nc=new G;let go=null,xo=0,vo=0,yo=!1;const Hn=(1+Math.sqrt(5))/2,fs=1/Hn,Fc=[new z(-Hn,fs,0),new z(Hn,fs,0),new z(-fs,0,Hn),new z(fs,0,Hn),new z(0,Hn,-fs),new z(0,Hn,fs),new z(-1,1,-1),new z(1,1,-1),new z(-1,1,1),new z(1,1,1)];class bl{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,n=100){go=this._renderer.getRenderTarget(),xo=this._renderer.getActiveCubeFace(),vo=this._renderer.getActiveMipmapLevel(),yo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(t,i,n,s),e>0&&this._blur(s,0,0,e),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Hc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Bc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(go,xo,vo),this._renderer.xr.enabled=yo,t.scissorTest=!1,Kr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Ds||t.mapping===Ls?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),go=this._renderer.getRenderTarget(),xo=this._renderer.getActiveCubeFace(),vo=this._renderer.getActiveMipmapLevel(),yo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:Oe,minFilter:Oe,generateMipmaps:!1,type:ai,format:Ge,colorSpace:Os,depthBuffer:!1},n=Oc(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Oc(t,e,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=tm(s)),this._blurMaterial=em(s,t,e)}return n}_compileMaterial(t){const e=new N(this._lodPlanes[0],t);this._renderer.compile(e,mo)}_sceneToCubeUV(t,e,i,n){const o=new fi(90,1,e,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,f=h.autoClear,u=h.toneMapping;h.getClearColor(Nc),h.toneMapping=An,h.autoClear=!1;const d=new re({name:"PMREM.Background",side:oi,depthWrite:!1,depthTest:!1}),m=new N(new _t,d);let v=!1;const g=t.background;g?g.isColor&&(d.color.copy(g),t.background=null,v=!0):(d.color.copy(Nc),v=!0);for(let p=0;p<6;p++){const M=p%3;M===0?(o.up.set(0,l[p],0),o.lookAt(c[p],0,0)):M===1?(o.up.set(0,0,l[p]),o.lookAt(0,c[p],0)):(o.up.set(0,l[p],0),o.lookAt(0,0,c[p]));const w=this._cubeSize;Kr(n,M*w,p>2?w:0,w,w),h.setRenderTarget(n),v&&h.render(m,o),h.render(t,o)}m.geometry.dispose(),m.material.dispose(),h.toneMapping=u,h.autoClear=f,t.background=g}_textureToCubeUV(t,e){const i=this._renderer,n=t.mapping===Ds||t.mapping===Ls;n?(this._cubemapMaterial===null&&(this._cubemapMaterial=Hc()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Bc());const s=n?this._cubemapMaterial:this._equirectMaterial,a=new N(this._lodPlanes[0],s),o=s.uniforms;o.envMap.value=t;const l=this._cubeSize;Kr(e,0,0,3*l,2*l),i.setRenderTarget(e),i.render(a,mo)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;const n=this._lodPlanes.length;for(let s=1;s<n;s++){const a=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=Fc[(n-s-1)%Fc.length];this._blur(t,s-1,s,a,o)}e.autoClear=i}_blur(t,e,i,n,s){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,i,n,"latitudinal",s),this._halfBlur(a,t,i,i,n,"longitudinal",s)}_halfBlur(t,e,i,n,s,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,f=new N(this._lodPlanes[n],c),u=c.uniforms,d=this._sizeLods[i]-1,m=isFinite(s)?Math.PI/(2*d):2*Math.PI/(2*Vn-1),v=s/m,g=isFinite(s)?1+Math.floor(h*v):Vn;g>Vn&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${Vn}`);const p=[];let M=0;for(let _=0;_<Vn;++_){const E=_/v,T=Math.exp(-E*E/2);p.push(T),_===0?M+=T:_<g&&(M+=2*T)}for(let _=0;_<p.length;_++)p[_]=p[_]/M;u.envMap.value=t.texture,u.samples.value=g,u.weights.value=p,u.latitudinal.value=a==="latitudinal",o&&(u.poleAxis.value=o);const{_lodMax:w}=this;u.dTheta.value=m,u.mipInt.value=w-i;const x=this._sizeLods[n],y=3*x*(n>w-bs?n-w+bs:0),b=4*(this._cubeSize-x);Kr(e,y,b,3*x,2*x),l.setRenderTarget(e),l.render(f,mo)}}function tm(r){const t=[],e=[],i=[];let n=r;const s=r-bs+1+kc.length;for(let a=0;a<s;a++){const o=Math.pow(2,n);e.push(o);let l=1/o;a>r-bs?l=kc[a-r+bs-1]:a===0&&(l=0),i.push(l);const c=1/(o-2),h=-c,f=1+c,u=[h,h,f,h,f,f,h,h,f,f,h,f],d=6,m=6,v=3,g=2,p=1,M=new Float32Array(v*m*d),w=new Float32Array(g*m*d),x=new Float32Array(p*m*d);for(let b=0;b<d;b++){const _=b%3*2/3-1,E=b>2?0:-1,T=[_,E,0,_+2/3,E,0,_+2/3,E+1,0,_,E,0,_+2/3,E+1,0,_,E+1,0];M.set(T,v*m*b),w.set(u,g*m*b);const S=[b,b,b,b,b,b];x.set(S,p*m*b)}const y=new we;y.setAttribute("position",new Le(M,v)),y.setAttribute("uv",new Le(w,g)),y.setAttribute("faceIndex",new Le(x,p)),t.push(y),n>bs&&n--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function Oc(r,t,e){const i=new Be(r,t,e);return i.texture.mapping=Na,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Kr(r,t,e,i,n){r.viewport.set(t,e,i,n),r.scissor.set(t,e,i,n)}function em(r,t,e){const i=new Float32Array(Vn),n=new z(0,1,0);return new ye({name:"SphericalGaussianBlur",defines:{n:Vn,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:n}},vertexShader:Gl(),fragmentShader:`

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
		`,blending:on,depthTest:!1,depthWrite:!1})}function Bc(){return new ye({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Gl(),fragmentShader:`

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
		`,blending:on,depthTest:!1,depthWrite:!1})}function Hc(){return new ye({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Gl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:on,depthTest:!1,depthWrite:!1})}function Gl(){return`

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
	`}function im(r){let t=new WeakMap,e=null;function i(o){if(o&&o.isTexture){const l=o.mapping,c=l===Sa||l===Zo,h=l===Ds||l===Ls;if(c||h){let f=t.get(o);const u=f!==void 0?f.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==u)return e===null&&(e=new bl(r)),f=c?e.fromEquirectangular(o,f):e.fromCubemap(o,f),f.texture.pmremVersion=o.pmremVersion,t.set(o,f),f.texture;if(f!==void 0)return f.texture;{const d=o.image;return c&&d&&d.height>0||h&&d&&n(d)?(e===null&&(e=new bl(r)),f=c?e.fromEquirectangular(o):e.fromCubemap(o),f.texture.pmremVersion=o.pmremVersion,t.set(o,f),o.addEventListener("dispose",s),f.texture):null}}}return o}function n(o){let l=0;const c=6;for(let h=0;h<c;h++)o[h]!==void 0&&l++;return l===c}function s(o){const l=o.target;l.removeEventListener("dispose",s);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:a}}function nm(r){const t={};function e(i){if(t[i]!==void 0)return t[i];let n;switch(i){case"WEBGL_depth_texture":n=r.getExtension("WEBGL_depth_texture")||r.getExtension("MOZ_WEBGL_depth_texture")||r.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":n=r.getExtension("EXT_texture_filter_anisotropic")||r.getExtension("MOZ_EXT_texture_filter_anisotropic")||r.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":n=r.getExtension("WEBGL_compressed_texture_s3tc")||r.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":n=r.getExtension("WEBGL_compressed_texture_pvrtc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:n=r.getExtension(i)}return t[i]=n,n}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){const n=e(i);return n===null&&ar("THREE.WebGLRenderer: "+i+" extension not supported."),n}}}function sm(r,t,e,i){const n={},s=new WeakMap;function a(f){const u=f.target;u.index!==null&&t.remove(u.index);for(const m in u.attributes)t.remove(u.attributes[m]);for(const m in u.morphAttributes){const v=u.morphAttributes[m];for(let g=0,p=v.length;g<p;g++)t.remove(v[g])}u.removeEventListener("dispose",a),delete n[u.id];const d=s.get(u);d&&(t.remove(d),s.delete(u)),i.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,e.memory.geometries--}function o(f,u){return n[u.id]===!0||(u.addEventListener("dispose",a),n[u.id]=!0,e.memory.geometries++),u}function l(f){const u=f.attributes;for(const m in u)t.update(u[m],r.ARRAY_BUFFER);const d=f.morphAttributes;for(const m in d){const v=d[m];for(let g=0,p=v.length;g<p;g++)t.update(v[g],r.ARRAY_BUFFER)}}function c(f){const u=[],d=f.index,m=f.attributes.position;let v=0;if(d!==null){const M=d.array;v=d.version;for(let w=0,x=M.length;w<x;w+=3){const y=M[w+0],b=M[w+1],_=M[w+2];u.push(y,b,b,_,_,y)}}else if(m!==void 0){const M=m.array;v=m.version;for(let w=0,x=M.length/3-1;w<x;w+=3){const y=w+0,b=w+1,_=w+2;u.push(y,b,b,_,_,y)}}else return;const g=new(uu(u)?xu:gu)(u,1);g.version=v;const p=s.get(f);p&&t.remove(p),s.set(f,g)}function h(f){const u=s.get(f);if(u){const d=f.index;d!==null&&u.version<d.version&&c(f)}else c(f);return s.get(f)}return{get:o,update:l,getWireframeAttribute:h}}function rm(r,t,e){let i;function n(u){i=u}let s,a;function o(u){s=u.type,a=u.bytesPerElement}function l(u,d){r.drawElements(i,d,s,u*a),e.update(d,i,1)}function c(u,d,m){m!==0&&(r.drawElementsInstanced(i,d,s,u*a,m),e.update(d,i,m))}function h(u,d,m){if(m===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,d,0,s,u,0,m);let g=0;for(let p=0;p<m;p++)g+=d[p];e.update(g,i,1)}function f(u,d,m,v){if(m===0)return;const g=t.get("WEBGL_multi_draw");if(g===null)for(let p=0;p<u.length;p++)c(u[p]/a,d[p],v[p]);else{g.multiDrawElementsInstancedWEBGL(i,d,0,s,u,0,v,0,m);let p=0;for(let M=0;M<m;M++)p+=d[M]*v[M];e.update(p,i,1)}}this.setMode=n,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=f}function am(r){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,a,o){switch(e.calls++,a){case r.TRIANGLES:e.triangles+=o*(s/3);break;case r.LINES:e.lines+=o*(s/2);break;case r.LINE_STRIP:e.lines+=o*(s-1);break;case r.LINE_LOOP:e.lines+=o*s;break;case r.POINTS:e.points+=o*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function n(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:n,update:i}}function om(r,t,e){const i=new WeakMap,n=new Me;function s(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=h!==void 0?h.length:0;let u=i.get(o);if(u===void 0||u.count!==f){let S=function(){E.dispose(),i.delete(o),o.removeEventListener("dispose",S)};var d=S;u!==void 0&&u.texture.dispose();const m=o.morphAttributes.position!==void 0,v=o.morphAttributes.normal!==void 0,g=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],M=o.morphAttributes.normal||[],w=o.morphAttributes.color||[];let x=0;m===!0&&(x=1),v===!0&&(x=2),g===!0&&(x=3);let y=o.attributes.position.count*x,b=1;y>t.maxTextureSize&&(b=Math.ceil(y/t.maxTextureSize),y=t.maxTextureSize);const _=new Float32Array(y*b*4*f),E=new du(_,y,b,f);E.type=Ii,E.needsUpdate=!0;const T=x*4;for(let R=0;R<f;R++){const I=p[R],L=M[R],B=w[R],W=y*b*4*R;for(let U=0;U<I.count;U++){const q=U*T;m===!0&&(n.fromBufferAttribute(I,U),_[W+q+0]=n.x,_[W+q+1]=n.y,_[W+q+2]=n.z,_[W+q+3]=0),v===!0&&(n.fromBufferAttribute(L,U),_[W+q+4]=n.x,_[W+q+5]=n.y,_[W+q+6]=n.z,_[W+q+7]=0),g===!0&&(n.fromBufferAttribute(B,U),_[W+q+8]=n.x,_[W+q+9]=n.y,_[W+q+10]=n.z,_[W+q+11]=B.itemSize===4?n.w:1)}}u={count:f,texture:E,size:new ot(y,b)},i.set(o,u),o.addEventListener("dispose",S)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(r,"morphTexture",a.morphTexture,e);else{let m=0;for(let g=0;g<c.length;g++)m+=c[g];const v=o.morphTargetsRelative?1:1-m;l.getUniforms().setValue(r,"morphTargetBaseInfluence",v),l.getUniforms().setValue(r,"morphTargetInfluences",c)}l.getUniforms().setValue(r,"morphTargetsTexture",u.texture,e),l.getUniforms().setValue(r,"morphTargetsTextureSize",u.size)}return{update:s}}function lm(r,t,e,i){let n=new WeakMap;function s(l){const c=i.render.frame,h=l.geometry,f=t.get(l,h);if(n.get(f)!==c&&(t.update(f),n.set(f,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),n.get(l)!==c&&(e.update(l.instanceMatrix,r.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,r.ARRAY_BUFFER),n.set(l,c))),l.isSkinnedMesh){const u=l.skeleton;n.get(u)!==c&&(u.update(),n.set(u,c))}return f}function a(){n=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:s,dispose:a}}class lr extends ii{constructor(t,e,i,n,s,a,o,l,c,h=Cn){if(h!==Cn&&h!==qn)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&h===Cn&&(i=Hi),i===void 0&&h===qn&&(i=Xn),super(null,n,s,a,o,l,h,i,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=o!==void 0?o:ze,this.minFilter=l!==void 0?l:ze,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const wu=new ii,Gc=new lr(1,1),Su=new du,Tu=new Kf,_u=new Mu,Vc=[],Wc=[],Xc=new Float32Array(16),qc=new Float32Array(9),Yc=new Float32Array(4);function Gs(r,t,e){const i=r[0];if(i<=0||i>0)return r;const n=t*e;let s=Vc[n];if(s===void 0&&(s=new Float32Array(n),Vc[n]=s),t!==0){i.toArray(s,0);for(let a=1,o=0;a!==t;++a)o+=e,r[a].toArray(s,o)}return s}function qe(r,t){if(r.length!==t.length)return!1;for(let e=0,i=r.length;e<i;e++)if(r[e]!==t[e])return!1;return!0}function Ye(r,t){for(let e=0,i=t.length;e<i;e++)r[e]=t[e]}function Ha(r,t){let e=Wc[t];e===void 0&&(e=new Int32Array(t),Wc[t]=e);for(let i=0;i!==t;++i)e[i]=r.allocateTextureUnit();return e}function cm(r,t){const e=this.cache;e[0]!==t&&(r.uniform1f(this.addr,t),e[0]=t)}function hm(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(r.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(qe(e,t))return;r.uniform2fv(this.addr,t),Ye(e,t)}}function um(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(r.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(r.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(qe(e,t))return;r.uniform3fv(this.addr,t),Ye(e,t)}}function fm(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(r.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(qe(e,t))return;r.uniform4fv(this.addr,t),Ye(e,t)}}function dm(r,t){const e=this.cache,i=t.elements;if(i===void 0){if(qe(e,t))return;r.uniformMatrix2fv(this.addr,!1,t),Ye(e,t)}else{if(qe(e,i))return;Yc.set(i),r.uniformMatrix2fv(this.addr,!1,Yc),Ye(e,i)}}function pm(r,t){const e=this.cache,i=t.elements;if(i===void 0){if(qe(e,t))return;r.uniformMatrix3fv(this.addr,!1,t),Ye(e,t)}else{if(qe(e,i))return;qc.set(i),r.uniformMatrix3fv(this.addr,!1,qc),Ye(e,i)}}function mm(r,t){const e=this.cache,i=t.elements;if(i===void 0){if(qe(e,t))return;r.uniformMatrix4fv(this.addr,!1,t),Ye(e,t)}else{if(qe(e,i))return;Xc.set(i),r.uniformMatrix4fv(this.addr,!1,Xc),Ye(e,i)}}function gm(r,t){const e=this.cache;e[0]!==t&&(r.uniform1i(this.addr,t),e[0]=t)}function xm(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(r.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(qe(e,t))return;r.uniform2iv(this.addr,t),Ye(e,t)}}function vm(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(r.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(qe(e,t))return;r.uniform3iv(this.addr,t),Ye(e,t)}}function ym(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(r.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(qe(e,t))return;r.uniform4iv(this.addr,t),Ye(e,t)}}function Mm(r,t){const e=this.cache;e[0]!==t&&(r.uniform1ui(this.addr,t),e[0]=t)}function bm(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(r.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(qe(e,t))return;r.uniform2uiv(this.addr,t),Ye(e,t)}}function wm(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(r.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(qe(e,t))return;r.uniform3uiv(this.addr,t),Ye(e,t)}}function Sm(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(r.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(qe(e,t))return;r.uniform4uiv(this.addr,t),Ye(e,t)}}function Tm(r,t,e){const i=this.cache,n=e.allocateTextureUnit();i[0]!==n&&(r.uniform1i(this.addr,n),i[0]=n);let s;this.type===r.SAMPLER_2D_SHADOW?(Gc.compareFunction=hu,s=Gc):s=wu,e.setTexture2D(t||s,n)}function _m(r,t,e){const i=this.cache,n=e.allocateTextureUnit();i[0]!==n&&(r.uniform1i(this.addr,n),i[0]=n),e.setTexture3D(t||Tu,n)}function Em(r,t,e){const i=this.cache,n=e.allocateTextureUnit();i[0]!==n&&(r.uniform1i(this.addr,n),i[0]=n),e.setTextureCube(t||_u,n)}function Am(r,t,e){const i=this.cache,n=e.allocateTextureUnit();i[0]!==n&&(r.uniform1i(this.addr,n),i[0]=n),e.setTexture2DArray(t||Su,n)}function Cm(r){switch(r){case 5126:return cm;case 35664:return hm;case 35665:return um;case 35666:return fm;case 35674:return dm;case 35675:return pm;case 35676:return mm;case 5124:case 35670:return gm;case 35667:case 35671:return xm;case 35668:case 35672:return vm;case 35669:case 35673:return ym;case 5125:return Mm;case 36294:return bm;case 36295:return wm;case 36296:return Sm;case 35678:case 36198:case 36298:case 36306:case 35682:return Tm;case 35679:case 36299:case 36307:return _m;case 35680:case 36300:case 36308:case 36293:return Em;case 36289:case 36303:case 36311:case 36292:return Am}}function Rm(r,t){r.uniform1fv(this.addr,t)}function Pm(r,t){const e=Gs(t,this.size,2);r.uniform2fv(this.addr,e)}function zm(r,t){const e=Gs(t,this.size,3);r.uniform3fv(this.addr,e)}function Dm(r,t){const e=Gs(t,this.size,4);r.uniform4fv(this.addr,e)}function Lm(r,t){const e=Gs(t,this.size,4);r.uniformMatrix2fv(this.addr,!1,e)}function Im(r,t){const e=Gs(t,this.size,9);r.uniformMatrix3fv(this.addr,!1,e)}function Um(r,t){const e=Gs(t,this.size,16);r.uniformMatrix4fv(this.addr,!1,e)}function km(r,t){r.uniform1iv(this.addr,t)}function Nm(r,t){r.uniform2iv(this.addr,t)}function Fm(r,t){r.uniform3iv(this.addr,t)}function Om(r,t){r.uniform4iv(this.addr,t)}function Bm(r,t){r.uniform1uiv(this.addr,t)}function Hm(r,t){r.uniform2uiv(this.addr,t)}function Gm(r,t){r.uniform3uiv(this.addr,t)}function Vm(r,t){r.uniform4uiv(this.addr,t)}function Wm(r,t,e){const i=this.cache,n=t.length,s=Ha(e,n);qe(i,s)||(r.uniform1iv(this.addr,s),Ye(i,s));for(let a=0;a!==n;++a)e.setTexture2D(t[a]||wu,s[a])}function Xm(r,t,e){const i=this.cache,n=t.length,s=Ha(e,n);qe(i,s)||(r.uniform1iv(this.addr,s),Ye(i,s));for(let a=0;a!==n;++a)e.setTexture3D(t[a]||Tu,s[a])}function qm(r,t,e){const i=this.cache,n=t.length,s=Ha(e,n);qe(i,s)||(r.uniform1iv(this.addr,s),Ye(i,s));for(let a=0;a!==n;++a)e.setTextureCube(t[a]||_u,s[a])}function Ym(r,t,e){const i=this.cache,n=t.length,s=Ha(e,n);qe(i,s)||(r.uniform1iv(this.addr,s),Ye(i,s));for(let a=0;a!==n;++a)e.setTexture2DArray(t[a]||Su,s[a])}function Zm(r){switch(r){case 5126:return Rm;case 35664:return Pm;case 35665:return zm;case 35666:return Dm;case 35674:return Lm;case 35675:return Im;case 35676:return Um;case 5124:case 35670:return km;case 35667:case 35671:return Nm;case 35668:case 35672:return Fm;case 35669:case 35673:return Om;case 5125:return Bm;case 36294:return Hm;case 36295:return Gm;case 36296:return Vm;case 35678:case 36198:case 36298:case 36306:case 35682:return Wm;case 35679:case 36299:case 36307:return Xm;case 35680:case 36300:case 36308:case 36293:return qm;case 36289:case 36303:case 36311:case 36292:return Ym}}class Km{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=Cm(e.type)}}class jm{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Zm(e.type)}}class Qm{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const n=this.seq;for(let s=0,a=n.length;s!==a;++s){const o=n[s];o.setValue(t,e[o.id],i)}}}const Mo=/(\w+)(\])?(\[|\.)?/g;function Zc(r,t){r.seq.push(t),r.map[t.id]=t}function Jm(r,t,e){const i=r.name,n=i.length;for(Mo.lastIndex=0;;){const s=Mo.exec(i),a=Mo.lastIndex;let o=s[1];const l=s[2]==="]",c=s[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===n){Zc(e,c===void 0?new Km(o,r,t):new jm(o,r,t));break}else{let f=e.map[o];f===void 0&&(f=new Qm(o),Zc(e,f)),e=f}}}class wa{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let n=0;n<i;++n){const s=t.getActiveUniform(e,n),a=t.getUniformLocation(e,s.name);Jm(s,a,this)}}setValue(t,e,i,n){const s=this.map[e];s!==void 0&&s.setValue(t,i,n)}setOptional(t,e,i){const n=e[i];n!==void 0&&this.setValue(t,i,n)}static upload(t,e,i,n){for(let s=0,a=e.length;s!==a;++s){const o=e[s],l=i[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,n)}}static seqWithValue(t,e){const i=[];for(let n=0,s=t.length;n!==s;++n){const a=t[n];a.id in e&&i.push(a)}return i}}function Kc(r,t,e){const i=r.createShader(t);return r.shaderSource(i,e),r.compileShader(i),i}const $m=37297;let tg=0;function eg(r,t){const e=r.split(`
`),i=[],n=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let a=n;a<s;a++){const o=a+1;i.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return i.join(`
`)}const jc=new ee;function ig(r){ce._getMatrix(jc,ce.workingColorSpace,r);const t=`mat3( ${jc.elements.map(e=>e.toFixed(4))} )`;switch(ce.getTransfer(r)){case Oa:return[t,"LinearTransferOETF"];case ve:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",r),[t,"LinearTransferOETF"]}}function Qc(r,t,e){const i=r.getShaderParameter(t,r.COMPILE_STATUS),n=r.getShaderInfoLog(t).trim();if(i&&n==="")return"";const s=/ERROR: 0:(\d+)/.exec(n);if(s){const a=parseInt(s[1]);return e.toUpperCase()+`

`+n+`

`+eg(r.getShaderSource(t),a)}else return n}function ng(r,t){const e=ig(t);return[`vec4 ${r}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function sg(r,t){let e;switch(t){case Zh:e="Linear";break;case Kh:e="Reinhard";break;case jh:e="Cineon";break;case Il:e="ACESFilmic";break;case Qh:e="AgX";break;case Jh:e="Neutral";break;case Cf:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+r+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const jr=new z;function rg(){ce.getLuminanceCoefficients(jr);const r=jr.x.toFixed(4),t=jr.y.toFixed(4),e=jr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${r}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function ag(r){return[r.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",r.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(or).join(`
`)}function og(r){const t=[];for(const e in r){const i=r[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function lg(r,t){const e={},i=r.getProgramParameter(t,r.ACTIVE_ATTRIBUTES);for(let n=0;n<i;n++){const s=r.getActiveAttrib(t,n),a=s.name;let o=1;s.type===r.FLOAT_MAT2&&(o=2),s.type===r.FLOAT_MAT3&&(o=3),s.type===r.FLOAT_MAT4&&(o=4),e[a]={type:s.type,location:r.getAttribLocation(t,a),locationSize:o}}return e}function or(r){return r!==""}function Jc(r,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return r.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function $c(r,t){return r.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const cg=/^[ \t]*#include +<([\w\d./]+)>/gm;function wl(r){return r.replace(cg,ug)}const hg=new Map;function ug(r,t){let e=ne[t];if(e===void 0){const i=hg.get(t);if(i!==void 0)e=ne[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return wl(e)}const fg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function th(r){return r.replace(fg,dg)}function dg(r,t,e,i){let n="";for(let s=parseInt(t);s<parseInt(e);s++)n+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return n}function eh(r){let t=`precision ${r.precision} float;
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
#define LOW_PRECISION`),t}function pg(r){let t="SHADOWMAP_TYPE_BASIC";return r.shadowMapType===Xh?t="SHADOWMAP_TYPE_PCF":r.shadowMapType===qh?t="SHADOWMAP_TYPE_PCF_SOFT":r.shadowMapType===nn&&(t="SHADOWMAP_TYPE_VSM"),t}function mg(r){let t="ENVMAP_TYPE_CUBE";if(r.envMap)switch(r.envMapMode){case Ds:case Ls:t="ENVMAP_TYPE_CUBE";break;case Na:t="ENVMAP_TYPE_CUBE_UV";break}return t}function gg(r){let t="ENVMAP_MODE_REFLECTION";if(r.envMap)switch(r.envMapMode){case Ls:t="ENVMAP_MODE_REFRACTION";break}return t}function xg(r){let t="ENVMAP_BLENDING_NONE";if(r.envMap)switch(r.combine){case Yh:t="ENVMAP_BLENDING_MULTIPLY";break;case Ef:t="ENVMAP_BLENDING_MIX";break;case Af:t="ENVMAP_BLENDING_ADD";break}return t}function vg(r){const t=r.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:i,maxMip:e}}function yg(r,t,e,i){const n=r.getContext(),s=e.defines;let a=e.vertexShader,o=e.fragmentShader;const l=pg(e),c=mg(e),h=gg(e),f=xg(e),u=vg(e),d=ag(e),m=og(s),v=n.createProgram();let g,p,M=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(or).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(or).join(`
`),p.length>0&&(p+=`
`)):(g=[eh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(or).join(`
`),p=[eh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+f:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==An?"#define TONE_MAPPING":"",e.toneMapping!==An?ne.tonemapping_pars_fragment:"",e.toneMapping!==An?sg("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",ne.colorspace_pars_fragment,ng("linearToOutputTexel",e.outputColorSpace),rg(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(or).join(`
`)),a=wl(a),a=Jc(a,e),a=$c(a,e),o=wl(o),o=Jc(o,e),o=$c(o,e),a=th(a),o=th(o),e.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,g=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",e.glslVersion===mc?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===mc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const w=M+g+a,x=M+p+o,y=Kc(n,n.VERTEX_SHADER,w),b=Kc(n,n.FRAGMENT_SHADER,x);n.attachShader(v,y),n.attachShader(v,b),e.index0AttributeName!==void 0?n.bindAttribLocation(v,0,e.index0AttributeName):e.morphTargets===!0&&n.bindAttribLocation(v,0,"position"),n.linkProgram(v);function _(R){if(r.debug.checkShaderErrors){const I=n.getProgramInfoLog(v).trim(),L=n.getShaderInfoLog(y).trim(),B=n.getShaderInfoLog(b).trim();let W=!0,U=!0;if(n.getProgramParameter(v,n.LINK_STATUS)===!1)if(W=!1,typeof r.debug.onShaderError=="function")r.debug.onShaderError(n,v,y,b);else{const q=Qc(n,y,"vertex"),V=Qc(n,b,"fragment");console.error("THREE.WebGLProgram: Shader Error "+n.getError()+" - VALIDATE_STATUS "+n.getProgramParameter(v,n.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+I+`
`+q+`
`+V)}else I!==""?console.warn("THREE.WebGLProgram: Program Info Log:",I):(L===""||B==="")&&(U=!1);U&&(R.diagnostics={runnable:W,programLog:I,vertexShader:{log:L,prefix:g},fragmentShader:{log:B,prefix:p}})}n.deleteShader(y),n.deleteShader(b),E=new wa(n,v),T=lg(n,v)}let E;this.getUniforms=function(){return E===void 0&&_(this),E};let T;this.getAttributes=function(){return T===void 0&&_(this),T};let S=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return S===!1&&(S=n.getProgramParameter(v,$m)),S},this.destroy=function(){i.releaseStatesOfProgram(this),n.deleteProgram(v),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=tg++,this.cacheKey=t,this.usedTimes=1,this.program=v,this.vertexShader=y,this.fragmentShader=b,this}let Mg=0;class bg{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,i=t.fragmentShader,n=this._getShaderStage(e),s=this._getShaderStage(i),a=this._getShaderCacheForMaterial(t);return a.has(n)===!1&&(a.add(n),n.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new wg(t),e.set(t,i)),i}}class wg{constructor(t){this.id=Mg++,this.code=t,this.usedTimes=0}}function Sg(r,t,e,i,n,s,a){const o=new pu,l=new bg,c=new Set,h=[],f=n.logarithmicDepthBuffer,u=n.vertexTextures;let d=n.precision;const m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(T){return c.add(T),T===0?"uv":`uv${T}`}function g(T,S,R,I,L){const B=I.fog,W=L.geometry,U=T.isMeshStandardMaterial?I.environment:null,q=(T.isMeshStandardMaterial?e:t).get(T.envMap||U),V=q&&q.mapping===Na?q.image.height:null,rt=m[T.type];T.precision!==null&&(d=n.getMaxPrecision(T.precision),d!==T.precision&&console.warn("THREE.WebGLProgram.getParameters:",T.precision,"not supported, using",d,"instead."));const et=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,mt=et!==void 0?et.length:0;let Ct=0;W.morphAttributes.position!==void 0&&(Ct=1),W.morphAttributes.normal!==void 0&&(Ct=2),W.morphAttributes.color!==void 0&&(Ct=3);let Z,k,Q,st;if(rt){const xe=Fi[rt];Z=xe.vertexShader,k=xe.fragmentShader}else Z=T.vertexShader,k=T.fragmentShader,l.update(T),Q=l.getVertexShaderID(T),st=l.getFragmentShaderID(T);const $=r.getRenderTarget(),ut=r.state.buffers.depth.getReversed(),Rt=L.isInstancedMesh===!0,Pt=L.isBatchedMesh===!0,Vt=!!T.map,X=!!T.matcap,J=!!q,D=!!T.aoMap,It=!!T.lightMap,ct=!!T.bumpMap,bt=!!T.normalMap,ft=!!T.displacementMap,Bt=!!T.emissiveMap,gt=!!T.metalnessMap,P=!!T.roughnessMap,A=T.anisotropy>0,Y=T.clearcoat>0,it=T.dispersion>0,lt=T.iridescence>0,nt=T.sheen>0,Ut=T.transmission>0,Mt=A&&!!T.anisotropyMap,At=Y&&!!T.clearcoatMap,ae=Y&&!!T.clearcoatNormalMap,ht=Y&&!!T.clearcoatRoughnessMap,zt=lt&&!!T.iridescenceMap,Wt=lt&&!!T.iridescenceThicknessMap,Zt=nt&&!!T.sheenColorMap,Dt=nt&&!!T.sheenRoughnessMap,oe=!!T.specularMap,ie=!!T.specularColorMap,Se=!!T.specularIntensityMap,F=Ut&&!!T.transmissionMap,wt=Ut&&!!T.thicknessMap,tt=!!T.gradientMap,at=!!T.alphaMap,Et=T.alphaTest>0,St=!!T.alphaHash,Jt=!!T.extensions;let Ie=An;T.toneMapped&&($===null||$.isXRRenderTarget===!0)&&(Ie=r.toneMapping);const Je={shaderID:rt,shaderType:T.type,shaderName:T.name,vertexShader:Z,fragmentShader:k,defines:T.defines,customVertexShaderID:Q,customFragmentShaderID:st,isRawShaderMaterial:T.isRawShaderMaterial===!0,glslVersion:T.glslVersion,precision:d,batching:Pt,batchingColor:Pt&&L._colorsTexture!==null,instancing:Rt,instancingColor:Rt&&L.instanceColor!==null,instancingMorph:Rt&&L.morphTexture!==null,supportsVertexTextures:u,outputColorSpace:$===null?r.outputColorSpace:$.isXRRenderTarget===!0?$.texture.colorSpace:Os,alphaToCoverage:!!T.alphaToCoverage,map:Vt,matcap:X,envMap:J,envMapMode:J&&q.mapping,envMapCubeUVHeight:V,aoMap:D,lightMap:It,bumpMap:ct,normalMap:bt,displacementMap:u&&ft,emissiveMap:Bt,normalMapObjectSpace:bt&&T.normalMapType===Df,normalMapTangentSpace:bt&&T.normalMapType===cu,metalnessMap:gt,roughnessMap:P,anisotropy:A,anisotropyMap:Mt,clearcoat:Y,clearcoatMap:At,clearcoatNormalMap:ae,clearcoatRoughnessMap:ht,dispersion:it,iridescence:lt,iridescenceMap:zt,iridescenceThicknessMap:Wt,sheen:nt,sheenColorMap:Zt,sheenRoughnessMap:Dt,specularMap:oe,specularColorMap:ie,specularIntensityMap:Se,transmission:Ut,transmissionMap:F,thicknessMap:wt,gradientMap:tt,opaque:T.transparent===!1&&T.blending===Wn&&T.alphaToCoverage===!1,alphaMap:at,alphaTest:Et,alphaHash:St,combine:T.combine,mapUv:Vt&&v(T.map.channel),aoMapUv:D&&v(T.aoMap.channel),lightMapUv:It&&v(T.lightMap.channel),bumpMapUv:ct&&v(T.bumpMap.channel),normalMapUv:bt&&v(T.normalMap.channel),displacementMapUv:ft&&v(T.displacementMap.channel),emissiveMapUv:Bt&&v(T.emissiveMap.channel),metalnessMapUv:gt&&v(T.metalnessMap.channel),roughnessMapUv:P&&v(T.roughnessMap.channel),anisotropyMapUv:Mt&&v(T.anisotropyMap.channel),clearcoatMapUv:At&&v(T.clearcoatMap.channel),clearcoatNormalMapUv:ae&&v(T.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ht&&v(T.clearcoatRoughnessMap.channel),iridescenceMapUv:zt&&v(T.iridescenceMap.channel),iridescenceThicknessMapUv:Wt&&v(T.iridescenceThicknessMap.channel),sheenColorMapUv:Zt&&v(T.sheenColorMap.channel),sheenRoughnessMapUv:Dt&&v(T.sheenRoughnessMap.channel),specularMapUv:oe&&v(T.specularMap.channel),specularColorMapUv:ie&&v(T.specularColorMap.channel),specularIntensityMapUv:Se&&v(T.specularIntensityMap.channel),transmissionMapUv:F&&v(T.transmissionMap.channel),thicknessMapUv:wt&&v(T.thicknessMap.channel),alphaMapUv:at&&v(T.alphaMap.channel),vertexTangents:!!W.attributes.tangent&&(bt||A),vertexColors:T.vertexColors,vertexAlphas:T.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,pointsUvs:L.isPoints===!0&&!!W.attributes.uv&&(Vt||at),fog:!!B,useFog:T.fog===!0,fogExp2:!!B&&B.isFogExp2,flatShading:T.flatShading===!0,sizeAttenuation:T.sizeAttenuation===!0,logarithmicDepthBuffer:f,reverseDepthBuffer:ut,skinning:L.isSkinnedMesh===!0,morphTargets:W.morphAttributes.position!==void 0,morphNormals:W.morphAttributes.normal!==void 0,morphColors:W.morphAttributes.color!==void 0,morphTargetsCount:mt,morphTextureStride:Ct,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:T.dithering,shadowMapEnabled:r.shadowMap.enabled&&R.length>0,shadowMapType:r.shadowMap.type,toneMapping:Ie,decodeVideoTexture:Vt&&T.map.isVideoTexture===!0&&ce.getTransfer(T.map.colorSpace)===ve,decodeVideoTextureEmissive:Bt&&T.emissiveMap.isVideoTexture===!0&&ce.getTransfer(T.emissiveMap.colorSpace)===ve,premultipliedAlpha:T.premultipliedAlpha,doubleSided:T.side===Ve,flipSided:T.side===oi,useDepthPacking:T.depthPacking>=0,depthPacking:T.depthPacking||0,index0AttributeName:T.index0AttributeName,extensionClipCullDistance:Jt&&T.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Jt&&T.extensions.multiDraw===!0||Pt)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:T.customProgramCacheKey()};return Je.vertexUv1s=c.has(1),Je.vertexUv2s=c.has(2),Je.vertexUv3s=c.has(3),c.clear(),Je}function p(T){const S=[];if(T.shaderID?S.push(T.shaderID):(S.push(T.customVertexShaderID),S.push(T.customFragmentShaderID)),T.defines!==void 0)for(const R in T.defines)S.push(R),S.push(T.defines[R]);return T.isRawShaderMaterial===!1&&(M(S,T),w(S,T),S.push(r.outputColorSpace)),S.push(T.customProgramCacheKey),S.join()}function M(T,S){T.push(S.precision),T.push(S.outputColorSpace),T.push(S.envMapMode),T.push(S.envMapCubeUVHeight),T.push(S.mapUv),T.push(S.alphaMapUv),T.push(S.lightMapUv),T.push(S.aoMapUv),T.push(S.bumpMapUv),T.push(S.normalMapUv),T.push(S.displacementMapUv),T.push(S.emissiveMapUv),T.push(S.metalnessMapUv),T.push(S.roughnessMapUv),T.push(S.anisotropyMapUv),T.push(S.clearcoatMapUv),T.push(S.clearcoatNormalMapUv),T.push(S.clearcoatRoughnessMapUv),T.push(S.iridescenceMapUv),T.push(S.iridescenceThicknessMapUv),T.push(S.sheenColorMapUv),T.push(S.sheenRoughnessMapUv),T.push(S.specularMapUv),T.push(S.specularColorMapUv),T.push(S.specularIntensityMapUv),T.push(S.transmissionMapUv),T.push(S.thicknessMapUv),T.push(S.combine),T.push(S.fogExp2),T.push(S.sizeAttenuation),T.push(S.morphTargetsCount),T.push(S.morphAttributeCount),T.push(S.numDirLights),T.push(S.numPointLights),T.push(S.numSpotLights),T.push(S.numSpotLightMaps),T.push(S.numHemiLights),T.push(S.numRectAreaLights),T.push(S.numDirLightShadows),T.push(S.numPointLightShadows),T.push(S.numSpotLightShadows),T.push(S.numSpotLightShadowsWithMaps),T.push(S.numLightProbes),T.push(S.shadowMapType),T.push(S.toneMapping),T.push(S.numClippingPlanes),T.push(S.numClipIntersection),T.push(S.depthPacking)}function w(T,S){o.disableAll(),S.supportsVertexTextures&&o.enable(0),S.instancing&&o.enable(1),S.instancingColor&&o.enable(2),S.instancingMorph&&o.enable(3),S.matcap&&o.enable(4),S.envMap&&o.enable(5),S.normalMapObjectSpace&&o.enable(6),S.normalMapTangentSpace&&o.enable(7),S.clearcoat&&o.enable(8),S.iridescence&&o.enable(9),S.alphaTest&&o.enable(10),S.vertexColors&&o.enable(11),S.vertexAlphas&&o.enable(12),S.vertexUv1s&&o.enable(13),S.vertexUv2s&&o.enable(14),S.vertexUv3s&&o.enable(15),S.vertexTangents&&o.enable(16),S.anisotropy&&o.enable(17),S.alphaHash&&o.enable(18),S.batching&&o.enable(19),S.dispersion&&o.enable(20),S.batchingColor&&o.enable(21),T.push(o.mask),o.disableAll(),S.fog&&o.enable(0),S.useFog&&o.enable(1),S.flatShading&&o.enable(2),S.logarithmicDepthBuffer&&o.enable(3),S.reverseDepthBuffer&&o.enable(4),S.skinning&&o.enable(5),S.morphTargets&&o.enable(6),S.morphNormals&&o.enable(7),S.morphColors&&o.enable(8),S.premultipliedAlpha&&o.enable(9),S.shadowMapEnabled&&o.enable(10),S.doubleSided&&o.enable(11),S.flipSided&&o.enable(12),S.useDepthPacking&&o.enable(13),S.dithering&&o.enable(14),S.transmission&&o.enable(15),S.sheen&&o.enable(16),S.opaque&&o.enable(17),S.pointsUvs&&o.enable(18),S.decodeVideoTexture&&o.enable(19),S.decodeVideoTextureEmissive&&o.enable(20),S.alphaToCoverage&&o.enable(21),T.push(o.mask)}function x(T){const S=m[T.type];let R;if(S){const I=Fi[S];R=xr.clone(I.uniforms)}else R=T.uniforms;return R}function y(T,S){let R;for(let I=0,L=h.length;I<L;I++){const B=h[I];if(B.cacheKey===S){R=B,++R.usedTimes;break}}return R===void 0&&(R=new yg(r,S,T,s),h.push(R)),R}function b(T){if(--T.usedTimes===0){const S=h.indexOf(T);h[S]=h[h.length-1],h.pop(),T.destroy()}}function _(T){l.remove(T)}function E(){l.dispose()}return{getParameters:g,getProgramCacheKey:p,getUniforms:x,acquireProgram:y,releaseProgram:b,releaseShaderCache:_,programs:h,dispose:E}}function Tg(){let r=new WeakMap;function t(a){return r.has(a)}function e(a){let o=r.get(a);return o===void 0&&(o={},r.set(a,o)),o}function i(a){r.delete(a)}function n(a,o,l){r.get(a)[o]=l}function s(){r=new WeakMap}return{has:t,get:e,remove:i,update:n,dispose:s}}function _g(r,t){return r.groupOrder!==t.groupOrder?r.groupOrder-t.groupOrder:r.renderOrder!==t.renderOrder?r.renderOrder-t.renderOrder:r.material.id!==t.material.id?r.material.id-t.material.id:r.z!==t.z?r.z-t.z:r.id-t.id}function ih(r,t){return r.groupOrder!==t.groupOrder?r.groupOrder-t.groupOrder:r.renderOrder!==t.renderOrder?r.renderOrder-t.renderOrder:r.z!==t.z?t.z-r.z:r.id-t.id}function nh(){const r=[];let t=0;const e=[],i=[],n=[];function s(){t=0,e.length=0,i.length=0,n.length=0}function a(f,u,d,m,v,g){let p=r[t];return p===void 0?(p={id:f.id,object:f,geometry:u,material:d,groupOrder:m,renderOrder:f.renderOrder,z:v,group:g},r[t]=p):(p.id=f.id,p.object=f,p.geometry=u,p.material=d,p.groupOrder=m,p.renderOrder=f.renderOrder,p.z=v,p.group=g),t++,p}function o(f,u,d,m,v,g){const p=a(f,u,d,m,v,g);d.transmission>0?i.push(p):d.transparent===!0?n.push(p):e.push(p)}function l(f,u,d,m,v,g){const p=a(f,u,d,m,v,g);d.transmission>0?i.unshift(p):d.transparent===!0?n.unshift(p):e.unshift(p)}function c(f,u){e.length>1&&e.sort(f||_g),i.length>1&&i.sort(u||ih),n.length>1&&n.sort(u||ih)}function h(){for(let f=t,u=r.length;f<u;f++){const d=r[f];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:e,transmissive:i,transparent:n,init:s,push:o,unshift:l,finish:h,sort:c}}function Eg(){let r=new WeakMap;function t(i,n){const s=r.get(i);let a;return s===void 0?(a=new nh,r.set(i,[a])):n>=s.length?(a=new nh,s.push(a)):a=s[n],a}function e(){r=new WeakMap}return{get:t,dispose:e}}function Ag(){const r={};return{get:function(t){if(r[t.id]!==void 0)return r[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new z,color:new G};break;case"SpotLight":e={position:new z,direction:new z,color:new G,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new z,color:new G,distance:0,decay:0};break;case"HemisphereLight":e={direction:new z,skyColor:new G,groundColor:new G};break;case"RectAreaLight":e={color:new G,position:new z,halfWidth:new z,halfHeight:new z};break}return r[t.id]=e,e}}}function Cg(){const r={};return{get:function(t){if(r[t.id]!==void 0)return r[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ot};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ot};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ot,shadowCameraNear:1,shadowCameraFar:1e3};break}return r[t.id]=e,e}}}let Rg=0;function Pg(r,t){return(t.castShadow?2:0)-(r.castShadow?2:0)+(t.map?1:0)-(r.map?1:0)}function zg(r){const t=new Ag,e=Cg(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new z);const n=new z,s=new qt,a=new qt;function o(c){let h=0,f=0,u=0;for(let T=0;T<9;T++)i.probe[T].set(0,0,0);let d=0,m=0,v=0,g=0,p=0,M=0,w=0,x=0,y=0,b=0,_=0;c.sort(Pg);for(let T=0,S=c.length;T<S;T++){const R=c[T],I=R.color,L=R.intensity,B=R.distance,W=R.shadow&&R.shadow.map?R.shadow.map.texture:null;if(R.isAmbientLight)h+=I.r*L,f+=I.g*L,u+=I.b*L;else if(R.isLightProbe){for(let U=0;U<9;U++)i.probe[U].addScaledVector(R.sh.coefficients[U],L);_++}else if(R.isDirectionalLight){const U=t.get(R);if(U.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){const q=R.shadow,V=e.get(R);V.shadowIntensity=q.intensity,V.shadowBias=q.bias,V.shadowNormalBias=q.normalBias,V.shadowRadius=q.radius,V.shadowMapSize=q.mapSize,i.directionalShadow[d]=V,i.directionalShadowMap[d]=W,i.directionalShadowMatrix[d]=R.shadow.matrix,M++}i.directional[d]=U,d++}else if(R.isSpotLight){const U=t.get(R);U.position.setFromMatrixPosition(R.matrixWorld),U.color.copy(I).multiplyScalar(L),U.distance=B,U.coneCos=Math.cos(R.angle),U.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),U.decay=R.decay,i.spot[v]=U;const q=R.shadow;if(R.map&&(i.spotLightMap[y]=R.map,y++,q.updateMatrices(R),R.castShadow&&b++),i.spotLightMatrix[v]=q.matrix,R.castShadow){const V=e.get(R);V.shadowIntensity=q.intensity,V.shadowBias=q.bias,V.shadowNormalBias=q.normalBias,V.shadowRadius=q.radius,V.shadowMapSize=q.mapSize,i.spotShadow[v]=V,i.spotShadowMap[v]=W,x++}v++}else if(R.isRectAreaLight){const U=t.get(R);U.color.copy(I).multiplyScalar(L),U.halfWidth.set(R.width*.5,0,0),U.halfHeight.set(0,R.height*.5,0),i.rectArea[g]=U,g++}else if(R.isPointLight){const U=t.get(R);if(U.color.copy(R.color).multiplyScalar(R.intensity),U.distance=R.distance,U.decay=R.decay,R.castShadow){const q=R.shadow,V=e.get(R);V.shadowIntensity=q.intensity,V.shadowBias=q.bias,V.shadowNormalBias=q.normalBias,V.shadowRadius=q.radius,V.shadowMapSize=q.mapSize,V.shadowCameraNear=q.camera.near,V.shadowCameraFar=q.camera.far,i.pointShadow[m]=V,i.pointShadowMap[m]=W,i.pointShadowMatrix[m]=R.shadow.matrix,w++}i.point[m]=U,m++}else if(R.isHemisphereLight){const U=t.get(R);U.skyColor.copy(R.color).multiplyScalar(L),U.groundColor.copy(R.groundColor).multiplyScalar(L),i.hemi[p]=U,p++}}g>0&&(r.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=xt.LTC_FLOAT_1,i.rectAreaLTC2=xt.LTC_FLOAT_2):(i.rectAreaLTC1=xt.LTC_HALF_1,i.rectAreaLTC2=xt.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=f,i.ambient[2]=u;const E=i.hash;(E.directionalLength!==d||E.pointLength!==m||E.spotLength!==v||E.rectAreaLength!==g||E.hemiLength!==p||E.numDirectionalShadows!==M||E.numPointShadows!==w||E.numSpotShadows!==x||E.numSpotMaps!==y||E.numLightProbes!==_)&&(i.directional.length=d,i.spot.length=v,i.rectArea.length=g,i.point.length=m,i.hemi.length=p,i.directionalShadow.length=M,i.directionalShadowMap.length=M,i.pointShadow.length=w,i.pointShadowMap.length=w,i.spotShadow.length=x,i.spotShadowMap.length=x,i.directionalShadowMatrix.length=M,i.pointShadowMatrix.length=w,i.spotLightMatrix.length=x+y-b,i.spotLightMap.length=y,i.numSpotLightShadowsWithMaps=b,i.numLightProbes=_,E.directionalLength=d,E.pointLength=m,E.spotLength=v,E.rectAreaLength=g,E.hemiLength=p,E.numDirectionalShadows=M,E.numPointShadows=w,E.numSpotShadows=x,E.numSpotMaps=y,E.numLightProbes=_,i.version=Rg++)}function l(c,h){let f=0,u=0,d=0,m=0,v=0;const g=h.matrixWorldInverse;for(let p=0,M=c.length;p<M;p++){const w=c[p];if(w.isDirectionalLight){const x=i.directional[f];x.direction.setFromMatrixPosition(w.matrixWorld),n.setFromMatrixPosition(w.target.matrixWorld),x.direction.sub(n),x.direction.transformDirection(g),f++}else if(w.isSpotLight){const x=i.spot[d];x.position.setFromMatrixPosition(w.matrixWorld),x.position.applyMatrix4(g),x.direction.setFromMatrixPosition(w.matrixWorld),n.setFromMatrixPosition(w.target.matrixWorld),x.direction.sub(n),x.direction.transformDirection(g),d++}else if(w.isRectAreaLight){const x=i.rectArea[m];x.position.setFromMatrixPosition(w.matrixWorld),x.position.applyMatrix4(g),a.identity(),s.copy(w.matrixWorld),s.premultiply(g),a.extractRotation(s),x.halfWidth.set(w.width*.5,0,0),x.halfHeight.set(0,w.height*.5,0),x.halfWidth.applyMatrix4(a),x.halfHeight.applyMatrix4(a),m++}else if(w.isPointLight){const x=i.point[u];x.position.setFromMatrixPosition(w.matrixWorld),x.position.applyMatrix4(g),u++}else if(w.isHemisphereLight){const x=i.hemi[v];x.direction.setFromMatrixPosition(w.matrixWorld),x.direction.transformDirection(g),v++}}}return{setup:o,setupView:l,state:i}}function sh(r){const t=new zg(r),e=[],i=[];function n(h){c.camera=h,e.length=0,i.length=0}function s(h){e.push(h)}function a(h){i.push(h)}function o(){t.setup(e)}function l(h){t.setupView(e,h)}const c={lightsArray:e,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:n,state:c,setupLights:o,setupLightsView:l,pushLight:s,pushShadow:a}}function Dg(r){let t=new WeakMap;function e(n,s=0){const a=t.get(n);let o;return a===void 0?(o=new sh(r),t.set(n,[o])):s>=a.length?(o=new sh(r),a.push(o)):o=a[s],o}function i(){t=new WeakMap}return{get:e,dispose:i}}class Lg extends Kn{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=Pf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Ig extends Kn{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const Ug=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,kg=`uniform sampler2D shadow_pass;
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
}`;function Ng(r,t,e){let i=new Hl;const n=new ot,s=new ot,a=new Me,o=new Lg({depthPacking:zf}),l=new Ig,c={},h=e.maxTextureSize,f={[Pn]:oi,[oi]:Pn,[Ve]:Ve},u=new ye({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ot},radius:{value:4}},vertexShader:Ug,fragmentShader:kg}),d=u.clone();d.defines.HORIZONTAL_PASS=1;const m=new we;m.setAttribute("position",new Le(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new N(m,u),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Xh;let p=this.type;this.render=function(b,_,E){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||b.length===0)return;const T=r.getRenderTarget(),S=r.getActiveCubeFace(),R=r.getActiveMipmapLevel(),I=r.state;I.setBlending(on),I.buffers.color.setClear(1,1,1,1),I.buffers.depth.setTest(!0),I.setScissorTest(!1);const L=p!==nn&&this.type===nn,B=p===nn&&this.type!==nn;for(let W=0,U=b.length;W<U;W++){const q=b[W],V=q.shadow;if(V===void 0){console.warn("THREE.WebGLShadowMap:",q,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;n.copy(V.mapSize);const rt=V.getFrameExtents();if(n.multiply(rt),s.copy(V.mapSize),(n.x>h||n.y>h)&&(n.x>h&&(s.x=Math.floor(h/rt.x),n.x=s.x*rt.x,V.mapSize.x=s.x),n.y>h&&(s.y=Math.floor(h/rt.y),n.y=s.y*rt.y,V.mapSize.y=s.y)),V.map===null||L===!0||B===!0){const mt=this.type!==nn?{minFilter:ze,magFilter:ze}:{};V.map!==null&&V.map.dispose(),V.map=new Be(n.x,n.y,mt),V.map.texture.name=q.name+".shadowMap",V.camera.updateProjectionMatrix()}r.setRenderTarget(V.map),r.clear();const et=V.getViewportCount();for(let mt=0;mt<et;mt++){const Ct=V.getViewport(mt);a.set(s.x*Ct.x,s.y*Ct.y,s.x*Ct.z,s.y*Ct.w),I.viewport(a),V.updateMatrices(q,mt),i=V.getFrustum(),x(_,E,V.camera,q,this.type)}V.isPointLightShadow!==!0&&this.type===nn&&M(V,E),V.needsUpdate=!1}p=this.type,g.needsUpdate=!1,r.setRenderTarget(T,S,R)};function M(b,_){const E=t.update(v);u.defines.VSM_SAMPLES!==b.blurSamples&&(u.defines.VSM_SAMPLES=b.blurSamples,d.defines.VSM_SAMPLES=b.blurSamples,u.needsUpdate=!0,d.needsUpdate=!0),b.mapPass===null&&(b.mapPass=new Be(n.x,n.y)),u.uniforms.shadow_pass.value=b.map.texture,u.uniforms.resolution.value=b.mapSize,u.uniforms.radius.value=b.radius,r.setRenderTarget(b.mapPass),r.clear(),r.renderBufferDirect(_,null,E,u,v,null),d.uniforms.shadow_pass.value=b.mapPass.texture,d.uniforms.resolution.value=b.mapSize,d.uniforms.radius.value=b.radius,r.setRenderTarget(b.map),r.clear(),r.renderBufferDirect(_,null,E,d,v,null)}function w(b,_,E,T){let S=null;const R=E.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(R!==void 0)S=R;else if(S=E.isPointLight===!0?l:o,r.localClippingEnabled&&_.clipShadows===!0&&Array.isArray(_.clippingPlanes)&&_.clippingPlanes.length!==0||_.displacementMap&&_.displacementScale!==0||_.alphaMap&&_.alphaTest>0||_.map&&_.alphaTest>0){const I=S.uuid,L=_.uuid;let B=c[I];B===void 0&&(B={},c[I]=B);let W=B[L];W===void 0&&(W=S.clone(),B[L]=W,_.addEventListener("dispose",y)),S=W}if(S.visible=_.visible,S.wireframe=_.wireframe,T===nn?S.side=_.shadowSide!==null?_.shadowSide:_.side:S.side=_.shadowSide!==null?_.shadowSide:f[_.side],S.alphaMap=_.alphaMap,S.alphaTest=_.alphaTest,S.map=_.map,S.clipShadows=_.clipShadows,S.clippingPlanes=_.clippingPlanes,S.clipIntersection=_.clipIntersection,S.displacementMap=_.displacementMap,S.displacementScale=_.displacementScale,S.displacementBias=_.displacementBias,S.wireframeLinewidth=_.wireframeLinewidth,S.linewidth=_.linewidth,E.isPointLight===!0&&S.isMeshDistanceMaterial===!0){const I=r.properties.get(S);I.light=E}return S}function x(b,_,E,T,S){if(b.visible===!1)return;if(b.layers.test(_.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&S===nn)&&(!b.frustumCulled||i.intersectsObject(b))){b.modelViewMatrix.multiplyMatrices(E.matrixWorldInverse,b.matrixWorld);const L=t.update(b),B=b.material;if(Array.isArray(B)){const W=L.groups;for(let U=0,q=W.length;U<q;U++){const V=W[U],rt=B[V.materialIndex];if(rt&&rt.visible){const et=w(b,rt,T,S);b.onBeforeShadow(r,b,_,E,L,et,V),r.renderBufferDirect(E,null,L,et,b,V),b.onAfterShadow(r,b,_,E,L,et,V)}}}else if(B.visible){const W=w(b,B,T,S);b.onBeforeShadow(r,b,_,E,L,W,null),r.renderBufferDirect(E,null,L,W,b,null),b.onAfterShadow(r,b,_,E,L,W,null)}}const I=b.children;for(let L=0,B=I.length;L<B;L++)x(I[L],_,E,T,S)}function y(b){b.target.removeEventListener("dispose",y);for(const E in c){const T=c[E],S=b.target.uuid;S in T&&(T[S].dispose(),delete T[S])}}}const Fg={[Ho]:Go,[Vo]:qo,[Wo]:Yo,[zs]:Xo,[Go]:Ho,[qo]:Vo,[Yo]:Wo,[Xo]:zs};function Og(r,t){function e(){let F=!1;const wt=new Me;let tt=null;const at=new Me(0,0,0,0);return{setMask:function(Et){tt!==Et&&!F&&(r.colorMask(Et,Et,Et,Et),tt=Et)},setLocked:function(Et){F=Et},setClear:function(Et,St,Jt,Ie,Je){Je===!0&&(Et*=Ie,St*=Ie,Jt*=Ie),wt.set(Et,St,Jt,Ie),at.equals(wt)===!1&&(r.clearColor(Et,St,Jt,Ie),at.copy(wt))},reset:function(){F=!1,tt=null,at.set(-1,0,0,0)}}}function i(){let F=!1,wt=!1,tt=null,at=null,Et=null;return{setReversed:function(St){if(wt!==St){const Jt=t.get("EXT_clip_control");wt?Jt.clipControlEXT(Jt.LOWER_LEFT_EXT,Jt.ZERO_TO_ONE_EXT):Jt.clipControlEXT(Jt.LOWER_LEFT_EXT,Jt.NEGATIVE_ONE_TO_ONE_EXT);const Ie=Et;Et=null,this.setClear(Ie)}wt=St},getReversed:function(){return wt},setTest:function(St){St?$(r.DEPTH_TEST):ut(r.DEPTH_TEST)},setMask:function(St){tt!==St&&!F&&(r.depthMask(St),tt=St)},setFunc:function(St){if(wt&&(St=Fg[St]),at!==St){switch(St){case Ho:r.depthFunc(r.NEVER);break;case Go:r.depthFunc(r.ALWAYS);break;case Vo:r.depthFunc(r.LESS);break;case zs:r.depthFunc(r.LEQUAL);break;case Wo:r.depthFunc(r.EQUAL);break;case Xo:r.depthFunc(r.GEQUAL);break;case qo:r.depthFunc(r.GREATER);break;case Yo:r.depthFunc(r.NOTEQUAL);break;default:r.depthFunc(r.LEQUAL)}at=St}},setLocked:function(St){F=St},setClear:function(St){Et!==St&&(wt&&(St=1-St),r.clearDepth(St),Et=St)},reset:function(){F=!1,tt=null,at=null,Et=null,wt=!1}}}function n(){let F=!1,wt=null,tt=null,at=null,Et=null,St=null,Jt=null,Ie=null,Je=null;return{setTest:function(xe){F||(xe?$(r.STENCIL_TEST):ut(r.STENCIL_TEST))},setMask:function(xe){wt!==xe&&!F&&(r.stencilMask(xe),wt=xe)},setFunc:function(xe,_i,qi){(tt!==xe||at!==_i||Et!==qi)&&(r.stencilFunc(xe,_i,qi),tt=xe,at=_i,Et=qi)},setOp:function(xe,_i,qi){(St!==xe||Jt!==_i||Ie!==qi)&&(r.stencilOp(xe,_i,qi),St=xe,Jt=_i,Ie=qi)},setLocked:function(xe){F=xe},setClear:function(xe){Je!==xe&&(r.clearStencil(xe),Je=xe)},reset:function(){F=!1,wt=null,tt=null,at=null,Et=null,St=null,Jt=null,Ie=null,Je=null}}}const s=new e,a=new i,o=new n,l=new WeakMap,c=new WeakMap;let h={},f={},u=new WeakMap,d=[],m=null,v=!1,g=null,p=null,M=null,w=null,x=null,y=null,b=null,_=new G(0,0,0),E=0,T=!1,S=null,R=null,I=null,L=null,B=null;const W=r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let U=!1,q=0;const V=r.getParameter(r.VERSION);V.indexOf("WebGL")!==-1?(q=parseFloat(/^WebGL (\d)/.exec(V)[1]),U=q>=1):V.indexOf("OpenGL ES")!==-1&&(q=parseFloat(/^OpenGL ES (\d)/.exec(V)[1]),U=q>=2);let rt=null,et={};const mt=r.getParameter(r.SCISSOR_BOX),Ct=r.getParameter(r.VIEWPORT),Z=new Me().fromArray(mt),k=new Me().fromArray(Ct);function Q(F,wt,tt,at){const Et=new Uint8Array(4),St=r.createTexture();r.bindTexture(F,St),r.texParameteri(F,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(F,r.TEXTURE_MAG_FILTER,r.NEAREST);for(let Jt=0;Jt<tt;Jt++)F===r.TEXTURE_3D||F===r.TEXTURE_2D_ARRAY?r.texImage3D(wt,0,r.RGBA,1,1,at,0,r.RGBA,r.UNSIGNED_BYTE,Et):r.texImage2D(wt+Jt,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,Et);return St}const st={};st[r.TEXTURE_2D]=Q(r.TEXTURE_2D,r.TEXTURE_2D,1),st[r.TEXTURE_CUBE_MAP]=Q(r.TEXTURE_CUBE_MAP,r.TEXTURE_CUBE_MAP_POSITIVE_X,6),st[r.TEXTURE_2D_ARRAY]=Q(r.TEXTURE_2D_ARRAY,r.TEXTURE_2D_ARRAY,1,1),st[r.TEXTURE_3D]=Q(r.TEXTURE_3D,r.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),o.setClear(0),$(r.DEPTH_TEST),a.setFunc(zs),ct(!1),bt(hc),$(r.CULL_FACE),D(on);function $(F){h[F]!==!0&&(r.enable(F),h[F]=!0)}function ut(F){h[F]!==!1&&(r.disable(F),h[F]=!1)}function Rt(F,wt){return f[F]!==wt?(r.bindFramebuffer(F,wt),f[F]=wt,F===r.DRAW_FRAMEBUFFER&&(f[r.FRAMEBUFFER]=wt),F===r.FRAMEBUFFER&&(f[r.DRAW_FRAMEBUFFER]=wt),!0):!1}function Pt(F,wt){let tt=d,at=!1;if(F){tt=u.get(wt),tt===void 0&&(tt=[],u.set(wt,tt));const Et=F.textures;if(tt.length!==Et.length||tt[0]!==r.COLOR_ATTACHMENT0){for(let St=0,Jt=Et.length;St<Jt;St++)tt[St]=r.COLOR_ATTACHMENT0+St;tt.length=Et.length,at=!0}}else tt[0]!==r.BACK&&(tt[0]=r.BACK,at=!0);at&&r.drawBuffers(tt)}function Vt(F){return m!==F?(r.useProgram(F),m=F,!0):!1}const X={[Gn]:r.FUNC_ADD,[cf]:r.FUNC_SUBTRACT,[hf]:r.FUNC_REVERSE_SUBTRACT};X[uf]=r.MIN,X[ff]=r.MAX;const J={[df]:r.ZERO,[pf]:r.ONE,[mf]:r.SRC_COLOR,[Oo]:r.SRC_ALPHA,[bf]:r.SRC_ALPHA_SATURATE,[yf]:r.DST_COLOR,[xf]:r.DST_ALPHA,[gf]:r.ONE_MINUS_SRC_COLOR,[Bo]:r.ONE_MINUS_SRC_ALPHA,[Mf]:r.ONE_MINUS_DST_COLOR,[vf]:r.ONE_MINUS_DST_ALPHA,[wf]:r.CONSTANT_COLOR,[Sf]:r.ONE_MINUS_CONSTANT_COLOR,[Tf]:r.CONSTANT_ALPHA,[_f]:r.ONE_MINUS_CONSTANT_ALPHA};function D(F,wt,tt,at,Et,St,Jt,Ie,Je,xe){if(F===on){v===!0&&(ut(r.BLEND),v=!1);return}if(v===!1&&($(r.BLEND),v=!0),F!==lf){if(F!==g||xe!==T){if((p!==Gn||x!==Gn)&&(r.blendEquation(r.FUNC_ADD),p=Gn,x=Gn),xe)switch(F){case Wn:r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case Ps:r.blendFunc(r.ONE,r.ONE);break;case uc:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case fc:r.blendFuncSeparate(r.ZERO,r.SRC_COLOR,r.ZERO,r.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}else switch(F){case Wn:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case Ps:r.blendFunc(r.SRC_ALPHA,r.ONE);break;case uc:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case fc:r.blendFunc(r.ZERO,r.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}M=null,w=null,y=null,b=null,_.set(0,0,0),E=0,g=F,T=xe}return}Et=Et||wt,St=St||tt,Jt=Jt||at,(wt!==p||Et!==x)&&(r.blendEquationSeparate(X[wt],X[Et]),p=wt,x=Et),(tt!==M||at!==w||St!==y||Jt!==b)&&(r.blendFuncSeparate(J[tt],J[at],J[St],J[Jt]),M=tt,w=at,y=St,b=Jt),(Ie.equals(_)===!1||Je!==E)&&(r.blendColor(Ie.r,Ie.g,Ie.b,Je),_.copy(Ie),E=Je),g=F,T=!1}function It(F,wt){F.side===Ve?ut(r.CULL_FACE):$(r.CULL_FACE);let tt=F.side===oi;wt&&(tt=!tt),ct(tt),F.blending===Wn&&F.transparent===!1?D(on):D(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),a.setFunc(F.depthFunc),a.setTest(F.depthTest),a.setMask(F.depthWrite),s.setMask(F.colorWrite);const at=F.stencilWrite;o.setTest(at),at&&(o.setMask(F.stencilWriteMask),o.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),o.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),Bt(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?$(r.SAMPLE_ALPHA_TO_COVERAGE):ut(r.SAMPLE_ALPHA_TO_COVERAGE)}function ct(F){S!==F&&(F?r.frontFace(r.CW):r.frontFace(r.CCW),S=F)}function bt(F){F!==af?($(r.CULL_FACE),F!==R&&(F===hc?r.cullFace(r.BACK):F===of?r.cullFace(r.FRONT):r.cullFace(r.FRONT_AND_BACK))):ut(r.CULL_FACE),R=F}function ft(F){F!==I&&(U&&r.lineWidth(F),I=F)}function Bt(F,wt,tt){F?($(r.POLYGON_OFFSET_FILL),(L!==wt||B!==tt)&&(r.polygonOffset(wt,tt),L=wt,B=tt)):ut(r.POLYGON_OFFSET_FILL)}function gt(F){F?$(r.SCISSOR_TEST):ut(r.SCISSOR_TEST)}function P(F){F===void 0&&(F=r.TEXTURE0+W-1),rt!==F&&(r.activeTexture(F),rt=F)}function A(F,wt,tt){tt===void 0&&(rt===null?tt=r.TEXTURE0+W-1:tt=rt);let at=et[tt];at===void 0&&(at={type:void 0,texture:void 0},et[tt]=at),(at.type!==F||at.texture!==wt)&&(rt!==tt&&(r.activeTexture(tt),rt=tt),r.bindTexture(F,wt||st[F]),at.type=F,at.texture=wt)}function Y(){const F=et[rt];F!==void 0&&F.type!==void 0&&(r.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function it(){try{r.compressedTexImage2D.apply(r,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function lt(){try{r.compressedTexImage3D.apply(r,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function nt(){try{r.texSubImage2D.apply(r,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Ut(){try{r.texSubImage3D.apply(r,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Mt(){try{r.compressedTexSubImage2D.apply(r,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function At(){try{r.compressedTexSubImage3D.apply(r,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function ae(){try{r.texStorage2D.apply(r,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function ht(){try{r.texStorage3D.apply(r,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function zt(){try{r.texImage2D.apply(r,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Wt(){try{r.texImage3D.apply(r,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Zt(F){Z.equals(F)===!1&&(r.scissor(F.x,F.y,F.z,F.w),Z.copy(F))}function Dt(F){k.equals(F)===!1&&(r.viewport(F.x,F.y,F.z,F.w),k.copy(F))}function oe(F,wt){let tt=c.get(wt);tt===void 0&&(tt=new WeakMap,c.set(wt,tt));let at=tt.get(F);at===void 0&&(at=r.getUniformBlockIndex(wt,F.name),tt.set(F,at))}function ie(F,wt){const at=c.get(wt).get(F);l.get(wt)!==at&&(r.uniformBlockBinding(wt,at,F.__bindingPointIndex),l.set(wt,at))}function Se(){r.disable(r.BLEND),r.disable(r.CULL_FACE),r.disable(r.DEPTH_TEST),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SCISSOR_TEST),r.disable(r.STENCIL_TEST),r.disable(r.SAMPLE_ALPHA_TO_COVERAGE),r.blendEquation(r.FUNC_ADD),r.blendFunc(r.ONE,r.ZERO),r.blendFuncSeparate(r.ONE,r.ZERO,r.ONE,r.ZERO),r.blendColor(0,0,0,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(r.LESS),a.setReversed(!1),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(r.ALWAYS,0,4294967295),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),r.clearStencil(0),r.cullFace(r.BACK),r.frontFace(r.CCW),r.polygonOffset(0,0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),r.bindFramebuffer(r.READ_FRAMEBUFFER,null),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),h={},rt=null,et={},f={},u=new WeakMap,d=[],m=null,v=!1,g=null,p=null,M=null,w=null,x=null,y=null,b=null,_=new G(0,0,0),E=0,T=!1,S=null,R=null,I=null,L=null,B=null,Z.set(0,0,r.canvas.width,r.canvas.height),k.set(0,0,r.canvas.width,r.canvas.height),s.reset(),a.reset(),o.reset()}return{buffers:{color:s,depth:a,stencil:o},enable:$,disable:ut,bindFramebuffer:Rt,drawBuffers:Pt,useProgram:Vt,setBlending:D,setMaterial:It,setFlipSided:ct,setCullFace:bt,setLineWidth:ft,setPolygonOffset:Bt,setScissorTest:gt,activeTexture:P,bindTexture:A,unbindTexture:Y,compressedTexImage2D:it,compressedTexImage3D:lt,texImage2D:zt,texImage3D:Wt,updateUBOMapping:oe,uniformBlockBinding:ie,texStorage2D:ae,texStorage3D:ht,texSubImage2D:nt,texSubImage3D:Ut,compressedTexSubImage2D:Mt,compressedTexSubImage3D:At,scissor:Zt,viewport:Dt,reset:Se}}function rh(r,t,e,i){const n=Bg(i);switch(e){case nu:return r*t;case ru:return r*t;case au:return r*t*2;case Fa:return r*t/n.components*n.byteLength;case Fl:return r*t/n.components*n.byteLength;case ou:return r*t*2/n.components*n.byteLength;case Ol:return r*t*2/n.components*n.byteLength;case su:return r*t*3/n.components*n.byteLength;case Ge:return r*t*4/n.components*n.byteLength;case Bl:return r*t*4/n.components*n.byteLength;case xa:case va:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*8;case ya:case Ma:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*16;case jo:case Jo:return Math.max(r,16)*Math.max(t,8)/4;case Ko:case Qo:return Math.max(r,8)*Math.max(t,8)/2;case $o:case tl:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*8;case el:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*16;case il:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*16;case nl:return Math.floor((r+4)/5)*Math.floor((t+3)/4)*16;case sl:return Math.floor((r+4)/5)*Math.floor((t+4)/5)*16;case rl:return Math.floor((r+5)/6)*Math.floor((t+4)/5)*16;case al:return Math.floor((r+5)/6)*Math.floor((t+5)/6)*16;case ol:return Math.floor((r+7)/8)*Math.floor((t+4)/5)*16;case ll:return Math.floor((r+7)/8)*Math.floor((t+5)/6)*16;case cl:return Math.floor((r+7)/8)*Math.floor((t+7)/8)*16;case hl:return Math.floor((r+9)/10)*Math.floor((t+4)/5)*16;case ul:return Math.floor((r+9)/10)*Math.floor((t+5)/6)*16;case fl:return Math.floor((r+9)/10)*Math.floor((t+7)/8)*16;case dl:return Math.floor((r+9)/10)*Math.floor((t+9)/10)*16;case pl:return Math.floor((r+11)/12)*Math.floor((t+9)/10)*16;case ml:return Math.floor((r+11)/12)*Math.floor((t+11)/12)*16;case ba:case gl:case xl:return Math.ceil(r/4)*Math.ceil(t/4)*16;case lu:case vl:return Math.ceil(r/4)*Math.ceil(t/4)*8;case yl:case Ml:return Math.ceil(r/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Bg(r){switch(r){case cn:case tu:return{byteLength:1,components:1};case gr:case eu:case ai:return{byteLength:2,components:1};case kl:case Nl:return{byteLength:2,components:4};case Hi:case Ul:case Ii:return{byteLength:4,components:1};case iu:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${r}.`)}function Hg(r,t,e,i,n,s,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ot,h=new WeakMap;let f;const u=new WeakMap;let d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(P,A){return d?new OffscreenCanvas(P,A):Ea("canvas")}function v(P,A,Y){let it=1;const lt=gt(P);if((lt.width>Y||lt.height>Y)&&(it=Y/Math.max(lt.width,lt.height)),it<1)if(typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&P instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&P instanceof ImageBitmap||typeof VideoFrame<"u"&&P instanceof VideoFrame){const nt=Math.floor(it*lt.width),Ut=Math.floor(it*lt.height);f===void 0&&(f=m(nt,Ut));const Mt=A?m(nt,Ut):f;return Mt.width=nt,Mt.height=Ut,Mt.getContext("2d").drawImage(P,0,0,nt,Ut),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+lt.width+"x"+lt.height+") to ("+nt+"x"+Ut+")."),Mt}else return"data"in P&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+lt.width+"x"+lt.height+")."),P;return P}function g(P){return P.generateMipmaps}function p(P){r.generateMipmap(P)}function M(P){return P.isWebGLCubeRenderTarget?r.TEXTURE_CUBE_MAP:P.isWebGL3DRenderTarget?r.TEXTURE_3D:P.isWebGLArrayRenderTarget||P.isCompressedArrayTexture?r.TEXTURE_2D_ARRAY:r.TEXTURE_2D}function w(P,A,Y,it,lt=!1){if(P!==null){if(r[P]!==void 0)return r[P];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let nt=A;if(A===r.RED&&(Y===r.FLOAT&&(nt=r.R32F),Y===r.HALF_FLOAT&&(nt=r.R16F),Y===r.UNSIGNED_BYTE&&(nt=r.R8)),A===r.RED_INTEGER&&(Y===r.UNSIGNED_BYTE&&(nt=r.R8UI),Y===r.UNSIGNED_SHORT&&(nt=r.R16UI),Y===r.UNSIGNED_INT&&(nt=r.R32UI),Y===r.BYTE&&(nt=r.R8I),Y===r.SHORT&&(nt=r.R16I),Y===r.INT&&(nt=r.R32I)),A===r.RG&&(Y===r.FLOAT&&(nt=r.RG32F),Y===r.HALF_FLOAT&&(nt=r.RG16F),Y===r.UNSIGNED_BYTE&&(nt=r.RG8)),A===r.RG_INTEGER&&(Y===r.UNSIGNED_BYTE&&(nt=r.RG8UI),Y===r.UNSIGNED_SHORT&&(nt=r.RG16UI),Y===r.UNSIGNED_INT&&(nt=r.RG32UI),Y===r.BYTE&&(nt=r.RG8I),Y===r.SHORT&&(nt=r.RG16I),Y===r.INT&&(nt=r.RG32I)),A===r.RGB_INTEGER&&(Y===r.UNSIGNED_BYTE&&(nt=r.RGB8UI),Y===r.UNSIGNED_SHORT&&(nt=r.RGB16UI),Y===r.UNSIGNED_INT&&(nt=r.RGB32UI),Y===r.BYTE&&(nt=r.RGB8I),Y===r.SHORT&&(nt=r.RGB16I),Y===r.INT&&(nt=r.RGB32I)),A===r.RGBA_INTEGER&&(Y===r.UNSIGNED_BYTE&&(nt=r.RGBA8UI),Y===r.UNSIGNED_SHORT&&(nt=r.RGBA16UI),Y===r.UNSIGNED_INT&&(nt=r.RGBA32UI),Y===r.BYTE&&(nt=r.RGBA8I),Y===r.SHORT&&(nt=r.RGBA16I),Y===r.INT&&(nt=r.RGBA32I)),A===r.RGB&&Y===r.UNSIGNED_INT_5_9_9_9_REV&&(nt=r.RGB9_E5),A===r.RGBA){const Ut=lt?Oa:ce.getTransfer(it);Y===r.FLOAT&&(nt=r.RGBA32F),Y===r.HALF_FLOAT&&(nt=r.RGBA16F),Y===r.UNSIGNED_BYTE&&(nt=Ut===ve?r.SRGB8_ALPHA8:r.RGBA8),Y===r.UNSIGNED_SHORT_4_4_4_4&&(nt=r.RGBA4),Y===r.UNSIGNED_SHORT_5_5_5_1&&(nt=r.RGB5_A1)}return(nt===r.R16F||nt===r.R32F||nt===r.RG16F||nt===r.RG32F||nt===r.RGBA16F||nt===r.RGBA32F)&&t.get("EXT_color_buffer_float"),nt}function x(P,A){let Y;return P?A===null||A===Hi||A===Xn?Y=r.DEPTH24_STENCIL8:A===Ii?Y=r.DEPTH32F_STENCIL8:A===gr&&(Y=r.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):A===null||A===Hi||A===Xn?Y=r.DEPTH_COMPONENT24:A===Ii?Y=r.DEPTH_COMPONENT32F:A===gr&&(Y=r.DEPTH_COMPONENT16),Y}function y(P,A){return g(P)===!0||P.isFramebufferTexture&&P.minFilter!==ze&&P.minFilter!==Oe?Math.log2(Math.max(A.width,A.height))+1:P.mipmaps!==void 0&&P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?A.mipmaps.length:1}function b(P){const A=P.target;A.removeEventListener("dispose",b),E(A),A.isVideoTexture&&h.delete(A)}function _(P){const A=P.target;A.removeEventListener("dispose",_),S(A)}function E(P){const A=i.get(P);if(A.__webglInit===void 0)return;const Y=P.source,it=u.get(Y);if(it){const lt=it[A.__cacheKey];lt.usedTimes--,lt.usedTimes===0&&T(P),Object.keys(it).length===0&&u.delete(Y)}i.remove(P)}function T(P){const A=i.get(P);r.deleteTexture(A.__webglTexture);const Y=P.source,it=u.get(Y);delete it[A.__cacheKey],a.memory.textures--}function S(P){const A=i.get(P);if(P.depthTexture&&(P.depthTexture.dispose(),i.remove(P.depthTexture)),P.isWebGLCubeRenderTarget)for(let it=0;it<6;it++){if(Array.isArray(A.__webglFramebuffer[it]))for(let lt=0;lt<A.__webglFramebuffer[it].length;lt++)r.deleteFramebuffer(A.__webglFramebuffer[it][lt]);else r.deleteFramebuffer(A.__webglFramebuffer[it]);A.__webglDepthbuffer&&r.deleteRenderbuffer(A.__webglDepthbuffer[it])}else{if(Array.isArray(A.__webglFramebuffer))for(let it=0;it<A.__webglFramebuffer.length;it++)r.deleteFramebuffer(A.__webglFramebuffer[it]);else r.deleteFramebuffer(A.__webglFramebuffer);if(A.__webglDepthbuffer&&r.deleteRenderbuffer(A.__webglDepthbuffer),A.__webglMultisampledFramebuffer&&r.deleteFramebuffer(A.__webglMultisampledFramebuffer),A.__webglColorRenderbuffer)for(let it=0;it<A.__webglColorRenderbuffer.length;it++)A.__webglColorRenderbuffer[it]&&r.deleteRenderbuffer(A.__webglColorRenderbuffer[it]);A.__webglDepthRenderbuffer&&r.deleteRenderbuffer(A.__webglDepthRenderbuffer)}const Y=P.textures;for(let it=0,lt=Y.length;it<lt;it++){const nt=i.get(Y[it]);nt.__webglTexture&&(r.deleteTexture(nt.__webglTexture),a.memory.textures--),i.remove(Y[it])}i.remove(P)}let R=0;function I(){R=0}function L(){const P=R;return P>=n.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+P+" texture units while this GPU supports only "+n.maxTextures),R+=1,P}function B(P){const A=[];return A.push(P.wrapS),A.push(P.wrapT),A.push(P.wrapR||0),A.push(P.magFilter),A.push(P.minFilter),A.push(P.anisotropy),A.push(P.internalFormat),A.push(P.format),A.push(P.type),A.push(P.generateMipmaps),A.push(P.premultiplyAlpha),A.push(P.flipY),A.push(P.unpackAlignment),A.push(P.colorSpace),A.join()}function W(P,A){const Y=i.get(P);if(P.isVideoTexture&&ft(P),P.isRenderTargetTexture===!1&&P.version>0&&Y.__version!==P.version){const it=P.image;if(it===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(it.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{k(Y,P,A);return}}e.bindTexture(r.TEXTURE_2D,Y.__webglTexture,r.TEXTURE0+A)}function U(P,A){const Y=i.get(P);if(P.version>0&&Y.__version!==P.version){k(Y,P,A);return}e.bindTexture(r.TEXTURE_2D_ARRAY,Y.__webglTexture,r.TEXTURE0+A)}function q(P,A){const Y=i.get(P);if(P.version>0&&Y.__version!==P.version){k(Y,P,A);return}e.bindTexture(r.TEXTURE_3D,Y.__webglTexture,r.TEXTURE0+A)}function V(P,A){const Y=i.get(P);if(P.version>0&&Y.__version!==P.version){Q(Y,P,A);return}e.bindTexture(r.TEXTURE_CUBE_MAP,Y.__webglTexture,r.TEXTURE0+A)}const rt={[Is]:r.REPEAT,[Tn]:r.CLAMP_TO_EDGE,[mr]:r.MIRRORED_REPEAT},et={[ze]:r.NEAREST,[Rf]:r.NEAREST_MIPMAP_NEAREST,[Pr]:r.NEAREST_MIPMAP_LINEAR,[Oe]:r.LINEAR,[Xa]:r.LINEAR_MIPMAP_NEAREST,[_n]:r.LINEAR_MIPMAP_LINEAR},mt={[Lf]:r.NEVER,[Of]:r.ALWAYS,[If]:r.LESS,[hu]:r.LEQUAL,[Uf]:r.EQUAL,[Ff]:r.GEQUAL,[kf]:r.GREATER,[Nf]:r.NOTEQUAL};function Ct(P,A){if(A.type===Ii&&t.has("OES_texture_float_linear")===!1&&(A.magFilter===Oe||A.magFilter===Xa||A.magFilter===Pr||A.magFilter===_n||A.minFilter===Oe||A.minFilter===Xa||A.minFilter===Pr||A.minFilter===_n)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),r.texParameteri(P,r.TEXTURE_WRAP_S,rt[A.wrapS]),r.texParameteri(P,r.TEXTURE_WRAP_T,rt[A.wrapT]),(P===r.TEXTURE_3D||P===r.TEXTURE_2D_ARRAY)&&r.texParameteri(P,r.TEXTURE_WRAP_R,rt[A.wrapR]),r.texParameteri(P,r.TEXTURE_MAG_FILTER,et[A.magFilter]),r.texParameteri(P,r.TEXTURE_MIN_FILTER,et[A.minFilter]),A.compareFunction&&(r.texParameteri(P,r.TEXTURE_COMPARE_MODE,r.COMPARE_REF_TO_TEXTURE),r.texParameteri(P,r.TEXTURE_COMPARE_FUNC,mt[A.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(A.magFilter===ze||A.minFilter!==Pr&&A.minFilter!==_n||A.type===Ii&&t.has("OES_texture_float_linear")===!1)return;if(A.anisotropy>1||i.get(A).__currentAnisotropy){const Y=t.get("EXT_texture_filter_anisotropic");r.texParameterf(P,Y.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(A.anisotropy,n.getMaxAnisotropy())),i.get(A).__currentAnisotropy=A.anisotropy}}}function Z(P,A){let Y=!1;P.__webglInit===void 0&&(P.__webglInit=!0,A.addEventListener("dispose",b));const it=A.source;let lt=u.get(it);lt===void 0&&(lt={},u.set(it,lt));const nt=B(A);if(nt!==P.__cacheKey){lt[nt]===void 0&&(lt[nt]={texture:r.createTexture(),usedTimes:0},a.memory.textures++,Y=!0),lt[nt].usedTimes++;const Ut=lt[P.__cacheKey];Ut!==void 0&&(lt[P.__cacheKey].usedTimes--,Ut.usedTimes===0&&T(A)),P.__cacheKey=nt,P.__webglTexture=lt[nt].texture}return Y}function k(P,A,Y){let it=r.TEXTURE_2D;(A.isDataArrayTexture||A.isCompressedArrayTexture)&&(it=r.TEXTURE_2D_ARRAY),A.isData3DTexture&&(it=r.TEXTURE_3D);const lt=Z(P,A),nt=A.source;e.bindTexture(it,P.__webglTexture,r.TEXTURE0+Y);const Ut=i.get(nt);if(nt.version!==Ut.__version||lt===!0){e.activeTexture(r.TEXTURE0+Y);const Mt=ce.getPrimaries(ce.workingColorSpace),At=A.colorSpace===sn?null:ce.getPrimaries(A.colorSpace),ae=A.colorSpace===sn||Mt===At?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,A.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,A.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,ae);let ht=v(A.image,!1,n.maxTextureSize);ht=Bt(A,ht);const zt=s.convert(A.format,A.colorSpace),Wt=s.convert(A.type);let Zt=w(A.internalFormat,zt,Wt,A.colorSpace,A.isVideoTexture);Ct(it,A);let Dt;const oe=A.mipmaps,ie=A.isVideoTexture!==!0,Se=Ut.__version===void 0||lt===!0,F=nt.dataReady,wt=y(A,ht);if(A.isDepthTexture)Zt=x(A.format===qn,A.type),Se&&(ie?e.texStorage2D(r.TEXTURE_2D,1,Zt,ht.width,ht.height):e.texImage2D(r.TEXTURE_2D,0,Zt,ht.width,ht.height,0,zt,Wt,null));else if(A.isDataTexture)if(oe.length>0){ie&&Se&&e.texStorage2D(r.TEXTURE_2D,wt,Zt,oe[0].width,oe[0].height);for(let tt=0,at=oe.length;tt<at;tt++)Dt=oe[tt],ie?F&&e.texSubImage2D(r.TEXTURE_2D,tt,0,0,Dt.width,Dt.height,zt,Wt,Dt.data):e.texImage2D(r.TEXTURE_2D,tt,Zt,Dt.width,Dt.height,0,zt,Wt,Dt.data);A.generateMipmaps=!1}else ie?(Se&&e.texStorage2D(r.TEXTURE_2D,wt,Zt,ht.width,ht.height),F&&e.texSubImage2D(r.TEXTURE_2D,0,0,0,ht.width,ht.height,zt,Wt,ht.data)):e.texImage2D(r.TEXTURE_2D,0,Zt,ht.width,ht.height,0,zt,Wt,ht.data);else if(A.isCompressedTexture)if(A.isCompressedArrayTexture){ie&&Se&&e.texStorage3D(r.TEXTURE_2D_ARRAY,wt,Zt,oe[0].width,oe[0].height,ht.depth);for(let tt=0,at=oe.length;tt<at;tt++)if(Dt=oe[tt],A.format!==Ge)if(zt!==null)if(ie){if(F)if(A.layerUpdates.size>0){const Et=rh(Dt.width,Dt.height,A.format,A.type);for(const St of A.layerUpdates){const Jt=Dt.data.subarray(St*Et/Dt.data.BYTES_PER_ELEMENT,(St+1)*Et/Dt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,tt,0,0,St,Dt.width,Dt.height,1,zt,Jt)}A.clearLayerUpdates()}else e.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,tt,0,0,0,Dt.width,Dt.height,ht.depth,zt,Dt.data)}else e.compressedTexImage3D(r.TEXTURE_2D_ARRAY,tt,Zt,Dt.width,Dt.height,ht.depth,0,Dt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else ie?F&&e.texSubImage3D(r.TEXTURE_2D_ARRAY,tt,0,0,0,Dt.width,Dt.height,ht.depth,zt,Wt,Dt.data):e.texImage3D(r.TEXTURE_2D_ARRAY,tt,Zt,Dt.width,Dt.height,ht.depth,0,zt,Wt,Dt.data)}else{ie&&Se&&e.texStorage2D(r.TEXTURE_2D,wt,Zt,oe[0].width,oe[0].height);for(let tt=0,at=oe.length;tt<at;tt++)Dt=oe[tt],A.format!==Ge?zt!==null?ie?F&&e.compressedTexSubImage2D(r.TEXTURE_2D,tt,0,0,Dt.width,Dt.height,zt,Dt.data):e.compressedTexImage2D(r.TEXTURE_2D,tt,Zt,Dt.width,Dt.height,0,Dt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ie?F&&e.texSubImage2D(r.TEXTURE_2D,tt,0,0,Dt.width,Dt.height,zt,Wt,Dt.data):e.texImage2D(r.TEXTURE_2D,tt,Zt,Dt.width,Dt.height,0,zt,Wt,Dt.data)}else if(A.isDataArrayTexture)if(ie){if(Se&&e.texStorage3D(r.TEXTURE_2D_ARRAY,wt,Zt,ht.width,ht.height,ht.depth),F)if(A.layerUpdates.size>0){const tt=rh(ht.width,ht.height,A.format,A.type);for(const at of A.layerUpdates){const Et=ht.data.subarray(at*tt/ht.data.BYTES_PER_ELEMENT,(at+1)*tt/ht.data.BYTES_PER_ELEMENT);e.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,at,ht.width,ht.height,1,zt,Wt,Et)}A.clearLayerUpdates()}else e.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,0,ht.width,ht.height,ht.depth,zt,Wt,ht.data)}else e.texImage3D(r.TEXTURE_2D_ARRAY,0,Zt,ht.width,ht.height,ht.depth,0,zt,Wt,ht.data);else if(A.isData3DTexture)ie?(Se&&e.texStorage3D(r.TEXTURE_3D,wt,Zt,ht.width,ht.height,ht.depth),F&&e.texSubImage3D(r.TEXTURE_3D,0,0,0,0,ht.width,ht.height,ht.depth,zt,Wt,ht.data)):e.texImage3D(r.TEXTURE_3D,0,Zt,ht.width,ht.height,ht.depth,0,zt,Wt,ht.data);else if(A.isFramebufferTexture){if(Se)if(ie)e.texStorage2D(r.TEXTURE_2D,wt,Zt,ht.width,ht.height);else{let tt=ht.width,at=ht.height;for(let Et=0;Et<wt;Et++)e.texImage2D(r.TEXTURE_2D,Et,Zt,tt,at,0,zt,Wt,null),tt>>=1,at>>=1}}else if(oe.length>0){if(ie&&Se){const tt=gt(oe[0]);e.texStorage2D(r.TEXTURE_2D,wt,Zt,tt.width,tt.height)}for(let tt=0,at=oe.length;tt<at;tt++)Dt=oe[tt],ie?F&&e.texSubImage2D(r.TEXTURE_2D,tt,0,0,zt,Wt,Dt):e.texImage2D(r.TEXTURE_2D,tt,Zt,zt,Wt,Dt);A.generateMipmaps=!1}else if(ie){if(Se){const tt=gt(ht);e.texStorage2D(r.TEXTURE_2D,wt,Zt,tt.width,tt.height)}F&&e.texSubImage2D(r.TEXTURE_2D,0,0,0,zt,Wt,ht)}else e.texImage2D(r.TEXTURE_2D,0,Zt,zt,Wt,ht);g(A)&&p(it),Ut.__version=nt.version,A.onUpdate&&A.onUpdate(A)}P.__version=A.version}function Q(P,A,Y){if(A.image.length!==6)return;const it=Z(P,A),lt=A.source;e.bindTexture(r.TEXTURE_CUBE_MAP,P.__webglTexture,r.TEXTURE0+Y);const nt=i.get(lt);if(lt.version!==nt.__version||it===!0){e.activeTexture(r.TEXTURE0+Y);const Ut=ce.getPrimaries(ce.workingColorSpace),Mt=A.colorSpace===sn?null:ce.getPrimaries(A.colorSpace),At=A.colorSpace===sn||Ut===Mt?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,A.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,A.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,At);const ae=A.isCompressedTexture||A.image[0].isCompressedTexture,ht=A.image[0]&&A.image[0].isDataTexture,zt=[];for(let at=0;at<6;at++)!ae&&!ht?zt[at]=v(A.image[at],!0,n.maxCubemapSize):zt[at]=ht?A.image[at].image:A.image[at],zt[at]=Bt(A,zt[at]);const Wt=zt[0],Zt=s.convert(A.format,A.colorSpace),Dt=s.convert(A.type),oe=w(A.internalFormat,Zt,Dt,A.colorSpace),ie=A.isVideoTexture!==!0,Se=nt.__version===void 0||it===!0,F=lt.dataReady;let wt=y(A,Wt);Ct(r.TEXTURE_CUBE_MAP,A);let tt;if(ae){ie&&Se&&e.texStorage2D(r.TEXTURE_CUBE_MAP,wt,oe,Wt.width,Wt.height);for(let at=0;at<6;at++){tt=zt[at].mipmaps;for(let Et=0;Et<tt.length;Et++){const St=tt[Et];A.format!==Ge?Zt!==null?ie?F&&e.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+at,Et,0,0,St.width,St.height,Zt,St.data):e.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+at,Et,oe,St.width,St.height,0,St.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):ie?F&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+at,Et,0,0,St.width,St.height,Zt,Dt,St.data):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+at,Et,oe,St.width,St.height,0,Zt,Dt,St.data)}}}else{if(tt=A.mipmaps,ie&&Se){tt.length>0&&wt++;const at=gt(zt[0]);e.texStorage2D(r.TEXTURE_CUBE_MAP,wt,oe,at.width,at.height)}for(let at=0;at<6;at++)if(ht){ie?F&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,0,0,zt[at].width,zt[at].height,Zt,Dt,zt[at].data):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,oe,zt[at].width,zt[at].height,0,Zt,Dt,zt[at].data);for(let Et=0;Et<tt.length;Et++){const Jt=tt[Et].image[at].image;ie?F&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+at,Et+1,0,0,Jt.width,Jt.height,Zt,Dt,Jt.data):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+at,Et+1,oe,Jt.width,Jt.height,0,Zt,Dt,Jt.data)}}else{ie?F&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,0,0,Zt,Dt,zt[at]):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,oe,Zt,Dt,zt[at]);for(let Et=0;Et<tt.length;Et++){const St=tt[Et];ie?F&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+at,Et+1,0,0,Zt,Dt,St.image[at]):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+at,Et+1,oe,Zt,Dt,St.image[at])}}}g(A)&&p(r.TEXTURE_CUBE_MAP),nt.__version=lt.version,A.onUpdate&&A.onUpdate(A)}P.__version=A.version}function st(P,A,Y,it,lt,nt){const Ut=s.convert(Y.format,Y.colorSpace),Mt=s.convert(Y.type),At=w(Y.internalFormat,Ut,Mt,Y.colorSpace),ae=i.get(A),ht=i.get(Y);if(ht.__renderTarget=A,!ae.__hasExternalTextures){const zt=Math.max(1,A.width>>nt),Wt=Math.max(1,A.height>>nt);lt===r.TEXTURE_3D||lt===r.TEXTURE_2D_ARRAY?e.texImage3D(lt,nt,At,zt,Wt,A.depth,0,Ut,Mt,null):e.texImage2D(lt,nt,At,zt,Wt,0,Ut,Mt,null)}e.bindFramebuffer(r.FRAMEBUFFER,P),bt(A)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,it,lt,ht.__webglTexture,0,ct(A)):(lt===r.TEXTURE_2D||lt>=r.TEXTURE_CUBE_MAP_POSITIVE_X&&lt<=r.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&r.framebufferTexture2D(r.FRAMEBUFFER,it,lt,ht.__webglTexture,nt),e.bindFramebuffer(r.FRAMEBUFFER,null)}function $(P,A,Y){if(r.bindRenderbuffer(r.RENDERBUFFER,P),A.depthBuffer){const it=A.depthTexture,lt=it&&it.isDepthTexture?it.type:null,nt=x(A.stencilBuffer,lt),Ut=A.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,Mt=ct(A);bt(A)?o.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,Mt,nt,A.width,A.height):Y?r.renderbufferStorageMultisample(r.RENDERBUFFER,Mt,nt,A.width,A.height):r.renderbufferStorage(r.RENDERBUFFER,nt,A.width,A.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,Ut,r.RENDERBUFFER,P)}else{const it=A.textures;for(let lt=0;lt<it.length;lt++){const nt=it[lt],Ut=s.convert(nt.format,nt.colorSpace),Mt=s.convert(nt.type),At=w(nt.internalFormat,Ut,Mt,nt.colorSpace),ae=ct(A);Y&&bt(A)===!1?r.renderbufferStorageMultisample(r.RENDERBUFFER,ae,At,A.width,A.height):bt(A)?o.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,ae,At,A.width,A.height):r.renderbufferStorage(r.RENDERBUFFER,At,A.width,A.height)}}r.bindRenderbuffer(r.RENDERBUFFER,null)}function ut(P,A){if(A&&A.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(r.FRAMEBUFFER,P),!(A.depthTexture&&A.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const it=i.get(A.depthTexture);it.__renderTarget=A,(!it.__webglTexture||A.depthTexture.image.width!==A.width||A.depthTexture.image.height!==A.height)&&(A.depthTexture.image.width=A.width,A.depthTexture.image.height=A.height,A.depthTexture.needsUpdate=!0),W(A.depthTexture,0);const lt=it.__webglTexture,nt=ct(A);if(A.depthTexture.format===Cn)bt(A)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,lt,0,nt):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,lt,0);else if(A.depthTexture.format===qn)bt(A)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,lt,0,nt):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,lt,0);else throw new Error("Unknown depthTexture format")}function Rt(P){const A=i.get(P),Y=P.isWebGLCubeRenderTarget===!0;if(A.__boundDepthTexture!==P.depthTexture){const it=P.depthTexture;if(A.__depthDisposeCallback&&A.__depthDisposeCallback(),it){const lt=()=>{delete A.__boundDepthTexture,delete A.__depthDisposeCallback,it.removeEventListener("dispose",lt)};it.addEventListener("dispose",lt),A.__depthDisposeCallback=lt}A.__boundDepthTexture=it}if(P.depthTexture&&!A.__autoAllocateDepthBuffer){if(Y)throw new Error("target.depthTexture not supported in Cube render targets");ut(A.__webglFramebuffer,P)}else if(Y){A.__webglDepthbuffer=[];for(let it=0;it<6;it++)if(e.bindFramebuffer(r.FRAMEBUFFER,A.__webglFramebuffer[it]),A.__webglDepthbuffer[it]===void 0)A.__webglDepthbuffer[it]=r.createRenderbuffer(),$(A.__webglDepthbuffer[it],P,!1);else{const lt=P.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,nt=A.__webglDepthbuffer[it];r.bindRenderbuffer(r.RENDERBUFFER,nt),r.framebufferRenderbuffer(r.FRAMEBUFFER,lt,r.RENDERBUFFER,nt)}}else if(e.bindFramebuffer(r.FRAMEBUFFER,A.__webglFramebuffer),A.__webglDepthbuffer===void 0)A.__webglDepthbuffer=r.createRenderbuffer(),$(A.__webglDepthbuffer,P,!1);else{const it=P.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,lt=A.__webglDepthbuffer;r.bindRenderbuffer(r.RENDERBUFFER,lt),r.framebufferRenderbuffer(r.FRAMEBUFFER,it,r.RENDERBUFFER,lt)}e.bindFramebuffer(r.FRAMEBUFFER,null)}function Pt(P,A,Y){const it=i.get(P);A!==void 0&&st(it.__webglFramebuffer,P,P.texture,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,0),Y!==void 0&&Rt(P)}function Vt(P){const A=P.texture,Y=i.get(P),it=i.get(A);P.addEventListener("dispose",_);const lt=P.textures,nt=P.isWebGLCubeRenderTarget===!0,Ut=lt.length>1;if(Ut||(it.__webglTexture===void 0&&(it.__webglTexture=r.createTexture()),it.__version=A.version,a.memory.textures++),nt){Y.__webglFramebuffer=[];for(let Mt=0;Mt<6;Mt++)if(A.mipmaps&&A.mipmaps.length>0){Y.__webglFramebuffer[Mt]=[];for(let At=0;At<A.mipmaps.length;At++)Y.__webglFramebuffer[Mt][At]=r.createFramebuffer()}else Y.__webglFramebuffer[Mt]=r.createFramebuffer()}else{if(A.mipmaps&&A.mipmaps.length>0){Y.__webglFramebuffer=[];for(let Mt=0;Mt<A.mipmaps.length;Mt++)Y.__webglFramebuffer[Mt]=r.createFramebuffer()}else Y.__webglFramebuffer=r.createFramebuffer();if(Ut)for(let Mt=0,At=lt.length;Mt<At;Mt++){const ae=i.get(lt[Mt]);ae.__webglTexture===void 0&&(ae.__webglTexture=r.createTexture(),a.memory.textures++)}if(P.samples>0&&bt(P)===!1){Y.__webglMultisampledFramebuffer=r.createFramebuffer(),Y.__webglColorRenderbuffer=[],e.bindFramebuffer(r.FRAMEBUFFER,Y.__webglMultisampledFramebuffer);for(let Mt=0;Mt<lt.length;Mt++){const At=lt[Mt];Y.__webglColorRenderbuffer[Mt]=r.createRenderbuffer(),r.bindRenderbuffer(r.RENDERBUFFER,Y.__webglColorRenderbuffer[Mt]);const ae=s.convert(At.format,At.colorSpace),ht=s.convert(At.type),zt=w(At.internalFormat,ae,ht,At.colorSpace,P.isXRRenderTarget===!0),Wt=ct(P);r.renderbufferStorageMultisample(r.RENDERBUFFER,Wt,zt,P.width,P.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+Mt,r.RENDERBUFFER,Y.__webglColorRenderbuffer[Mt])}r.bindRenderbuffer(r.RENDERBUFFER,null),P.depthBuffer&&(Y.__webglDepthRenderbuffer=r.createRenderbuffer(),$(Y.__webglDepthRenderbuffer,P,!0)),e.bindFramebuffer(r.FRAMEBUFFER,null)}}if(nt){e.bindTexture(r.TEXTURE_CUBE_MAP,it.__webglTexture),Ct(r.TEXTURE_CUBE_MAP,A);for(let Mt=0;Mt<6;Mt++)if(A.mipmaps&&A.mipmaps.length>0)for(let At=0;At<A.mipmaps.length;At++)st(Y.__webglFramebuffer[Mt][At],P,A,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+Mt,At);else st(Y.__webglFramebuffer[Mt],P,A,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+Mt,0);g(A)&&p(r.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Ut){for(let Mt=0,At=lt.length;Mt<At;Mt++){const ae=lt[Mt],ht=i.get(ae);e.bindTexture(r.TEXTURE_2D,ht.__webglTexture),Ct(r.TEXTURE_2D,ae),st(Y.__webglFramebuffer,P,ae,r.COLOR_ATTACHMENT0+Mt,r.TEXTURE_2D,0),g(ae)&&p(r.TEXTURE_2D)}e.unbindTexture()}else{let Mt=r.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(Mt=P.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),e.bindTexture(Mt,it.__webglTexture),Ct(Mt,A),A.mipmaps&&A.mipmaps.length>0)for(let At=0;At<A.mipmaps.length;At++)st(Y.__webglFramebuffer[At],P,A,r.COLOR_ATTACHMENT0,Mt,At);else st(Y.__webglFramebuffer,P,A,r.COLOR_ATTACHMENT0,Mt,0);g(A)&&p(Mt),e.unbindTexture()}P.depthBuffer&&Rt(P)}function X(P){const A=P.textures;for(let Y=0,it=A.length;Y<it;Y++){const lt=A[Y];if(g(lt)){const nt=M(P),Ut=i.get(lt).__webglTexture;e.bindTexture(nt,Ut),p(nt),e.unbindTexture()}}}const J=[],D=[];function It(P){if(P.samples>0){if(bt(P)===!1){const A=P.textures,Y=P.width,it=P.height;let lt=r.COLOR_BUFFER_BIT;const nt=P.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,Ut=i.get(P),Mt=A.length>1;if(Mt)for(let At=0;At<A.length;At++)e.bindFramebuffer(r.FRAMEBUFFER,Ut.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+At,r.RENDERBUFFER,null),e.bindFramebuffer(r.FRAMEBUFFER,Ut.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+At,r.TEXTURE_2D,null,0);e.bindFramebuffer(r.READ_FRAMEBUFFER,Ut.__webglMultisampledFramebuffer),e.bindFramebuffer(r.DRAW_FRAMEBUFFER,Ut.__webglFramebuffer);for(let At=0;At<A.length;At++){if(P.resolveDepthBuffer&&(P.depthBuffer&&(lt|=r.DEPTH_BUFFER_BIT),P.stencilBuffer&&P.resolveStencilBuffer&&(lt|=r.STENCIL_BUFFER_BIT)),Mt){r.framebufferRenderbuffer(r.READ_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,Ut.__webglColorRenderbuffer[At]);const ae=i.get(A[At]).__webglTexture;r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,ae,0)}r.blitFramebuffer(0,0,Y,it,0,0,Y,it,lt,r.NEAREST),l===!0&&(J.length=0,D.length=0,J.push(r.COLOR_ATTACHMENT0+At),P.depthBuffer&&P.resolveDepthBuffer===!1&&(J.push(nt),D.push(nt),r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,D)),r.invalidateFramebuffer(r.READ_FRAMEBUFFER,J))}if(e.bindFramebuffer(r.READ_FRAMEBUFFER,null),e.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),Mt)for(let At=0;At<A.length;At++){e.bindFramebuffer(r.FRAMEBUFFER,Ut.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+At,r.RENDERBUFFER,Ut.__webglColorRenderbuffer[At]);const ae=i.get(A[At]).__webglTexture;e.bindFramebuffer(r.FRAMEBUFFER,Ut.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+At,r.TEXTURE_2D,ae,0)}e.bindFramebuffer(r.DRAW_FRAMEBUFFER,Ut.__webglMultisampledFramebuffer)}else if(P.depthBuffer&&P.resolveDepthBuffer===!1&&l){const A=P.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,[A])}}}function ct(P){return Math.min(n.maxSamples,P.samples)}function bt(P){const A=i.get(P);return P.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&A.__useRenderToTexture!==!1}function ft(P){const A=a.render.frame;h.get(P)!==A&&(h.set(P,A),P.update())}function Bt(P,A){const Y=P.colorSpace,it=P.format,lt=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||Y!==Os&&Y!==sn&&(ce.getTransfer(Y)===ve?(it!==Ge||lt!==cn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",Y)),A}function gt(P){return typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement?(c.width=P.naturalWidth||P.width,c.height=P.naturalHeight||P.height):typeof VideoFrame<"u"&&P instanceof VideoFrame?(c.width=P.displayWidth,c.height=P.displayHeight):(c.width=P.width,c.height=P.height),c}this.allocateTextureUnit=L,this.resetTextureUnits=I,this.setTexture2D=W,this.setTexture2DArray=U,this.setTexture3D=q,this.setTextureCube=V,this.rebindTextures=Pt,this.setupRenderTarget=Vt,this.updateRenderTargetMipmap=X,this.updateMultisampleRenderTarget=It,this.setupDepthRenderbuffer=Rt,this.setupFrameBufferTexture=st,this.useMultisampledRTT=bt}function Gg(r,t){function e(i,n=sn){let s;const a=ce.getTransfer(n);if(i===cn)return r.UNSIGNED_BYTE;if(i===kl)return r.UNSIGNED_SHORT_4_4_4_4;if(i===Nl)return r.UNSIGNED_SHORT_5_5_5_1;if(i===iu)return r.UNSIGNED_INT_5_9_9_9_REV;if(i===tu)return r.BYTE;if(i===eu)return r.SHORT;if(i===gr)return r.UNSIGNED_SHORT;if(i===Ul)return r.INT;if(i===Hi)return r.UNSIGNED_INT;if(i===Ii)return r.FLOAT;if(i===ai)return r.HALF_FLOAT;if(i===nu)return r.ALPHA;if(i===su)return r.RGB;if(i===Ge)return r.RGBA;if(i===ru)return r.LUMINANCE;if(i===au)return r.LUMINANCE_ALPHA;if(i===Cn)return r.DEPTH_COMPONENT;if(i===qn)return r.DEPTH_STENCIL;if(i===Fa)return r.RED;if(i===Fl)return r.RED_INTEGER;if(i===ou)return r.RG;if(i===Ol)return r.RG_INTEGER;if(i===Bl)return r.RGBA_INTEGER;if(i===xa||i===va||i===ya||i===Ma)if(a===ve)if(s=t.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===xa)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===va)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===ya)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Ma)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=t.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===xa)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===va)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===ya)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Ma)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Ko||i===jo||i===Qo||i===Jo)if(s=t.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===Ko)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===jo)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Qo)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Jo)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===$o||i===tl||i===el)if(s=t.get("WEBGL_compressed_texture_etc"),s!==null){if(i===$o||i===tl)return a===ve?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===el)return a===ve?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===il||i===nl||i===sl||i===rl||i===al||i===ol||i===ll||i===cl||i===hl||i===ul||i===fl||i===dl||i===pl||i===ml)if(s=t.get("WEBGL_compressed_texture_astc"),s!==null){if(i===il)return a===ve?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===nl)return a===ve?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===sl)return a===ve?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===rl)return a===ve?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===al)return a===ve?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===ol)return a===ve?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===ll)return a===ve?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===cl)return a===ve?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===hl)return a===ve?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===ul)return a===ve?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===fl)return a===ve?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===dl)return a===ve?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===pl)return a===ve?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===ml)return a===ve?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===ba||i===gl||i===xl)if(s=t.get("EXT_texture_compression_bptc"),s!==null){if(i===ba)return a===ve?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===gl)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===xl)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===lu||i===vl||i===yl||i===Ml)if(s=t.get("EXT_texture_compression_rgtc"),s!==null){if(i===ba)return s.COMPRESSED_RED_RGTC1_EXT;if(i===vl)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===yl)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Ml)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Xn?r.UNSIGNED_INT_24_8:r[i]!==void 0?r[i]:null}return{convert:e}}class Vg extends fi{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class be extends pe{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Wg={type:"move"};class bo{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new be,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new be,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new z,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new z),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new be,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new z,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new z),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let n=null,s=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){a=!0;for(const v of t.hand.values()){const g=e.getJointPose(v,i),p=this._getHandJoint(c,v);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}const h=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],u=h.position.distanceTo(f.position),d=.02,m=.005;c.inputState.pinching&&u>d+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&u<=d-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(n=e.getPose(t.targetRaySpace,i),n===null&&s!==null&&(n=s),n!==null&&(o.matrix.fromArray(n.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,n.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(n.linearVelocity)):o.hasLinearVelocity=!1,n.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(n.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Wg)))}return o!==null&&(o.visible=n!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new be;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}const Xg=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,qg=`
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

}`;class Yg{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,i){if(this.texture===null){const n=new ii,s=t.properties.get(n);s.__webglTexture=e.texture,(e.depthNear!=i.depthNear||e.depthFar!=i.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,i=new ye({vertexShader:Xg,fragmentShader:qg,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new N(new ui(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Zg extends Bs{constructor(t,e){super();const i=this;let n=null,s=1,a=null,o="local-floor",l=1,c=null,h=null,f=null,u=null,d=null,m=null;const v=new Yg,g=e.getContextAttributes();let p=null,M=null;const w=[],x=[],y=new ot;let b=null;const _=new fi;_.viewport=new Me;const E=new fi;E.viewport=new Me;const T=[_,E],S=new Vg;let R=null,I=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(k){let Q=w[k];return Q===void 0&&(Q=new bo,w[k]=Q),Q.getTargetRaySpace()},this.getControllerGrip=function(k){let Q=w[k];return Q===void 0&&(Q=new bo,w[k]=Q),Q.getGripSpace()},this.getHand=function(k){let Q=w[k];return Q===void 0&&(Q=new bo,w[k]=Q),Q.getHandSpace()};function L(k){const Q=x.indexOf(k.inputSource);if(Q===-1)return;const st=w[Q];st!==void 0&&(st.update(k.inputSource,k.frame,c||a),st.dispatchEvent({type:k.type,data:k.inputSource}))}function B(){n.removeEventListener("select",L),n.removeEventListener("selectstart",L),n.removeEventListener("selectend",L),n.removeEventListener("squeeze",L),n.removeEventListener("squeezestart",L),n.removeEventListener("squeezeend",L),n.removeEventListener("end",B),n.removeEventListener("inputsourceschange",W);for(let k=0;k<w.length;k++){const Q=x[k];Q!==null&&(x[k]=null,w[k].disconnect(Q))}R=null,I=null,v.reset(),t.setRenderTarget(p),d=null,u=null,f=null,n=null,M=null,Z.stop(),i.isPresenting=!1,t.setPixelRatio(b),t.setSize(y.width,y.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(k){s=k,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(k){o=k,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(k){c=k},this.getBaseLayer=function(){return u!==null?u:d},this.getBinding=function(){return f},this.getFrame=function(){return m},this.getSession=function(){return n},this.setSession=async function(k){if(n=k,n!==null){if(p=t.getRenderTarget(),n.addEventListener("select",L),n.addEventListener("selectstart",L),n.addEventListener("selectend",L),n.addEventListener("squeeze",L),n.addEventListener("squeezestart",L),n.addEventListener("squeezeend",L),n.addEventListener("end",B),n.addEventListener("inputsourceschange",W),g.xrCompatible!==!0&&await e.makeXRCompatible(),b=t.getPixelRatio(),t.getSize(y),n.renderState.layers===void 0){const Q={antialias:g.antialias,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:s};d=new XRWebGLLayer(n,e,Q),n.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),M=new Be(d.framebufferWidth,d.framebufferHeight,{format:Ge,type:cn,colorSpace:t.outputColorSpace,stencilBuffer:g.stencil})}else{let Q=null,st=null,$=null;g.depth&&($=g.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,Q=g.stencil?qn:Cn,st=g.stencil?Xn:Hi);const ut={colorFormat:e.RGBA8,depthFormat:$,scaleFactor:s};f=new XRWebGLBinding(n,e),u=f.createProjectionLayer(ut),n.updateRenderState({layers:[u]}),t.setPixelRatio(1),t.setSize(u.textureWidth,u.textureHeight,!1),M=new Be(u.textureWidth,u.textureHeight,{format:Ge,type:cn,depthTexture:new lr(u.textureWidth,u.textureHeight,st,void 0,void 0,void 0,void 0,void 0,void 0,Q),stencilBuffer:g.stencil,colorSpace:t.outputColorSpace,samples:g.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await n.requestReferenceSpace(o),Z.setContext(n),Z.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(n!==null)return n.environmentBlendMode},this.getDepthTexture=function(){return v.getDepthTexture()};function W(k){for(let Q=0;Q<k.removed.length;Q++){const st=k.removed[Q],$=x.indexOf(st);$>=0&&(x[$]=null,w[$].disconnect(st))}for(let Q=0;Q<k.added.length;Q++){const st=k.added[Q];let $=x.indexOf(st);if($===-1){for(let Rt=0;Rt<w.length;Rt++)if(Rt>=x.length){x.push(st),$=Rt;break}else if(x[Rt]===null){x[Rt]=st,$=Rt;break}if($===-1)break}const ut=w[$];ut&&ut.connect(st)}}const U=new z,q=new z;function V(k,Q,st){U.setFromMatrixPosition(Q.matrixWorld),q.setFromMatrixPosition(st.matrixWorld);const $=U.distanceTo(q),ut=Q.projectionMatrix.elements,Rt=st.projectionMatrix.elements,Pt=ut[14]/(ut[10]-1),Vt=ut[14]/(ut[10]+1),X=(ut[9]+1)/ut[5],J=(ut[9]-1)/ut[5],D=(ut[8]-1)/ut[0],It=(Rt[8]+1)/Rt[0],ct=Pt*D,bt=Pt*It,ft=$/(-D+It),Bt=ft*-D;if(Q.matrixWorld.decompose(k.position,k.quaternion,k.scale),k.translateX(Bt),k.translateZ(ft),k.matrixWorld.compose(k.position,k.quaternion,k.scale),k.matrixWorldInverse.copy(k.matrixWorld).invert(),ut[10]===-1)k.projectionMatrix.copy(Q.projectionMatrix),k.projectionMatrixInverse.copy(Q.projectionMatrixInverse);else{const gt=Pt+ft,P=Vt+ft,A=ct-Bt,Y=bt+($-Bt),it=X*Vt/P*gt,lt=J*Vt/P*gt;k.projectionMatrix.makePerspective(A,Y,it,lt,gt,P),k.projectionMatrixInverse.copy(k.projectionMatrix).invert()}}function rt(k,Q){Q===null?k.matrixWorld.copy(k.matrix):k.matrixWorld.multiplyMatrices(Q.matrixWorld,k.matrix),k.matrixWorldInverse.copy(k.matrixWorld).invert()}this.updateCamera=function(k){if(n===null)return;let Q=k.near,st=k.far;v.texture!==null&&(v.depthNear>0&&(Q=v.depthNear),v.depthFar>0&&(st=v.depthFar)),S.near=E.near=_.near=Q,S.far=E.far=_.far=st,(R!==S.near||I!==S.far)&&(n.updateRenderState({depthNear:S.near,depthFar:S.far}),R=S.near,I=S.far),_.layers.mask=k.layers.mask|2,E.layers.mask=k.layers.mask|4,S.layers.mask=_.layers.mask|E.layers.mask;const $=k.parent,ut=S.cameras;rt(S,$);for(let Rt=0;Rt<ut.length;Rt++)rt(ut[Rt],$);ut.length===2?V(S,_,E):S.projectionMatrix.copy(_.projectionMatrix),et(k,S,$)};function et(k,Q,st){st===null?k.matrix.copy(Q.matrixWorld):(k.matrix.copy(st.matrixWorld),k.matrix.invert(),k.matrix.multiply(Q.matrixWorld)),k.matrix.decompose(k.position,k.quaternion,k.scale),k.updateMatrixWorld(!0),k.projectionMatrix.copy(Q.projectionMatrix),k.projectionMatrixInverse.copy(Q.projectionMatrixInverse),k.isPerspectiveCamera&&(k.fov=_a*2*Math.atan(1/k.projectionMatrix.elements[5]),k.zoom=1)}this.getCamera=function(){return S},this.getFoveation=function(){if(!(u===null&&d===null))return l},this.setFoveation=function(k){l=k,u!==null&&(u.fixedFoveation=k),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=k)},this.hasDepthSensing=function(){return v.texture!==null},this.getDepthSensingMesh=function(){return v.getMesh(S)};let mt=null;function Ct(k,Q){if(h=Q.getViewerPose(c||a),m=Q,h!==null){const st=h.views;d!==null&&(t.setRenderTargetFramebuffer(M,d.framebuffer),t.setRenderTarget(M));let $=!1;st.length!==S.cameras.length&&(S.cameras.length=0,$=!0);for(let Rt=0;Rt<st.length;Rt++){const Pt=st[Rt];let Vt=null;if(d!==null)Vt=d.getViewport(Pt);else{const J=f.getViewSubImage(u,Pt);Vt=J.viewport,Rt===0&&(t.setRenderTargetTextures(M,J.colorTexture,u.ignoreDepthValues?void 0:J.depthStencilTexture),t.setRenderTarget(M))}let X=T[Rt];X===void 0&&(X=new fi,X.layers.enable(Rt),X.viewport=new Me,T[Rt]=X),X.matrix.fromArray(Pt.transform.matrix),X.matrix.decompose(X.position,X.quaternion,X.scale),X.projectionMatrix.fromArray(Pt.projectionMatrix),X.projectionMatrixInverse.copy(X.projectionMatrix).invert(),X.viewport.set(Vt.x,Vt.y,Vt.width,Vt.height),Rt===0&&(S.matrix.copy(X.matrix),S.matrix.decompose(S.position,S.quaternion,S.scale)),$===!0&&S.cameras.push(X)}const ut=n.enabledFeatures;if(ut&&ut.includes("depth-sensing")){const Rt=f.getDepthInformation(st[0]);Rt&&Rt.isValid&&Rt.texture&&v.init(t,Rt,n.renderState)}}for(let st=0;st<w.length;st++){const $=x[st],ut=w[st];$!==null&&ut!==void 0&&ut.update($,Q,c||a)}mt&&mt(k,Q),Q.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:Q}),m=null}const Z=new bu;Z.setAnimationLoop(Ct),this.setAnimationLoop=function(k){mt=k},this.dispose=function(){}}}const Fn=new Vi,Kg=new qt;function jg(r,t){function e(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function i(g,p){p.color.getRGB(g.fogColor.value,vu(r)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function n(g,p,M,w,x){p.isMeshBasicMaterial||p.isMeshLambertMaterial?s(g,p):p.isMeshToonMaterial?(s(g,p),f(g,p)):p.isMeshPhongMaterial?(s(g,p),h(g,p)):p.isMeshStandardMaterial?(s(g,p),u(g,p),p.isMeshPhysicalMaterial&&d(g,p,x)):p.isMeshMatcapMaterial?(s(g,p),m(g,p)):p.isMeshDepthMaterial?s(g,p):p.isMeshDistanceMaterial?(s(g,p),v(g,p)):p.isMeshNormalMaterial?s(g,p):p.isLineBasicMaterial?(a(g,p),p.isLineDashedMaterial&&o(g,p)):p.isPointsMaterial?l(g,p,M,w):p.isSpriteMaterial?c(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,e(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===oi&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,e(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===oi&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,e(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,e(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);const M=t.get(p),w=M.envMap,x=M.envMapRotation;w&&(g.envMap.value=w,Fn.copy(x),Fn.x*=-1,Fn.y*=-1,Fn.z*=-1,w.isCubeTexture&&w.isRenderTargetTexture===!1&&(Fn.y*=-1,Fn.z*=-1),g.envMapRotation.value.setFromMatrix4(Kg.makeRotationFromEuler(Fn)),g.flipEnvMap.value=w.isCubeTexture&&w.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,g.aoMapTransform))}function a(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform))}function o(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function l(g,p,M,w){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*M,g.scale.value=w*.5,p.map&&(g.map.value=p.map,e(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function c(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function h(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function f(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function u(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function d(g,p,M){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===oi&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=M.texture,g.transmissionSamplerSize.value.set(M.width,M.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function v(g,p){const M=t.get(p).light;g.referencePosition.value.setFromMatrixPosition(M.matrixWorld),g.nearDistance.value=M.shadow.camera.near,g.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:n}}function Qg(r,t,e,i){let n={},s={},a=[];const o=r.getParameter(r.MAX_UNIFORM_BUFFER_BINDINGS);function l(M,w){const x=w.program;i.uniformBlockBinding(M,x)}function c(M,w){let x=n[M.id];x===void 0&&(m(M),x=h(M),n[M.id]=x,M.addEventListener("dispose",g));const y=w.program;i.updateUBOMapping(M,y);const b=t.render.frame;s[M.id]!==b&&(u(M),s[M.id]=b)}function h(M){const w=f();M.__bindingPointIndex=w;const x=r.createBuffer(),y=M.__size,b=M.usage;return r.bindBuffer(r.UNIFORM_BUFFER,x),r.bufferData(r.UNIFORM_BUFFER,y,b),r.bindBuffer(r.UNIFORM_BUFFER,null),r.bindBufferBase(r.UNIFORM_BUFFER,w,x),x}function f(){for(let M=0;M<o;M++)if(a.indexOf(M)===-1)return a.push(M),M;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(M){const w=n[M.id],x=M.uniforms,y=M.__cache;r.bindBuffer(r.UNIFORM_BUFFER,w);for(let b=0,_=x.length;b<_;b++){const E=Array.isArray(x[b])?x[b]:[x[b]];for(let T=0,S=E.length;T<S;T++){const R=E[T];if(d(R,b,T,y)===!0){const I=R.__offset,L=Array.isArray(R.value)?R.value:[R.value];let B=0;for(let W=0;W<L.length;W++){const U=L[W],q=v(U);typeof U=="number"||typeof U=="boolean"?(R.__data[0]=U,r.bufferSubData(r.UNIFORM_BUFFER,I+B,R.__data)):U.isMatrix3?(R.__data[0]=U.elements[0],R.__data[1]=U.elements[1],R.__data[2]=U.elements[2],R.__data[3]=0,R.__data[4]=U.elements[3],R.__data[5]=U.elements[4],R.__data[6]=U.elements[5],R.__data[7]=0,R.__data[8]=U.elements[6],R.__data[9]=U.elements[7],R.__data[10]=U.elements[8],R.__data[11]=0):(U.toArray(R.__data,B),B+=q.storage/Float32Array.BYTES_PER_ELEMENT)}r.bufferSubData(r.UNIFORM_BUFFER,I,R.__data)}}}r.bindBuffer(r.UNIFORM_BUFFER,null)}function d(M,w,x,y){const b=M.value,_=w+"_"+x;if(y[_]===void 0)return typeof b=="number"||typeof b=="boolean"?y[_]=b:y[_]=b.clone(),!0;{const E=y[_];if(typeof b=="number"||typeof b=="boolean"){if(E!==b)return y[_]=b,!0}else if(E.equals(b)===!1)return E.copy(b),!0}return!1}function m(M){const w=M.uniforms;let x=0;const y=16;for(let _=0,E=w.length;_<E;_++){const T=Array.isArray(w[_])?w[_]:[w[_]];for(let S=0,R=T.length;S<R;S++){const I=T[S],L=Array.isArray(I.value)?I.value:[I.value];for(let B=0,W=L.length;B<W;B++){const U=L[B],q=v(U),V=x%y,rt=V%q.boundary,et=V+rt;x+=rt,et!==0&&y-et<q.storage&&(x+=y-et),I.__data=new Float32Array(q.storage/Float32Array.BYTES_PER_ELEMENT),I.__offset=x,x+=q.storage}}}const b=x%y;return b>0&&(x+=y-b),M.__size=x,M.__cache={},this}function v(M){const w={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(w.boundary=4,w.storage=4):M.isVector2?(w.boundary=8,w.storage=8):M.isVector3||M.isColor?(w.boundary=16,w.storage=12):M.isVector4?(w.boundary=16,w.storage=16):M.isMatrix3?(w.boundary=48,w.storage=48):M.isMatrix4?(w.boundary=64,w.storage=64):M.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",M),w}function g(M){const w=M.target;w.removeEventListener("dispose",g);const x=a.indexOf(w.__bindingPointIndex);a.splice(x,1),r.deleteBuffer(n[w.id]),delete n[w.id],delete s[w.id]}function p(){for(const M in n)r.deleteBuffer(n[M]);a=[],n={},s={}}return{bind:l,update:c,dispose:p}}class Jg{constructor(t={}){const{canvas:e=Hf(),context:i=null,depth:n=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1,reverseDepthBuffer:u=!1}=t;this.isWebGLRenderer=!0;let d;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=i.getContextAttributes().alpha}else d=a;const m=new Uint32Array(4),v=new Int32Array(4);let g=null,p=null;const M=[],w=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=ri,this.toneMapping=An,this.toneMappingExposure=1;const x=this;let y=!1,b=0,_=0,E=null,T=-1,S=null;const R=new Me,I=new Me;let L=null;const B=new G(0);let W=0,U=e.width,q=e.height,V=1,rt=null,et=null;const mt=new Me(0,0,U,q),Ct=new Me(0,0,U,q);let Z=!1;const k=new Hl;let Q=!1,st=!1;const $=new qt,ut=new qt,Rt=new z,Pt=new Me,Vt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let X=!1;function J(){return E===null?V:1}let D=i;function It(C,O){return e.getContext(C,O)}try{const C={alpha:!0,depth:n,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${ka}`),e.addEventListener("webglcontextlost",at,!1),e.addEventListener("webglcontextrestored",Et,!1),e.addEventListener("webglcontextcreationerror",St,!1),D===null){const O="webgl2";if(D=It(O,C),D===null)throw It(O)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(C){throw console.error("THREE.WebGLRenderer: "+C.message),C}let ct,bt,ft,Bt,gt,P,A,Y,it,lt,nt,Ut,Mt,At,ae,ht,zt,Wt,Zt,Dt,oe,ie,Se,F;function wt(){ct=new nm(D),ct.init(),ie=new Gg(D,ct),bt=new Qp(D,ct,t,ie),ft=new Og(D,ct),bt.reverseDepthBuffer&&u&&ft.buffers.depth.setReversed(!0),Bt=new am(D),gt=new Tg,P=new Hg(D,ct,ft,gt,bt,ie,Bt),A=new $p(x),Y=new im(x),it=new dd(D),Se=new Kp(D,it),lt=new sm(D,it,Bt,Se),nt=new lm(D,lt,it,Bt),Zt=new om(D,bt,P),ht=new Jp(gt),Ut=new Sg(x,A,Y,ct,bt,Se,ht),Mt=new jg(x,gt),At=new Eg,ae=new Dg(ct),Wt=new Zp(x,A,Y,ft,nt,d,l),zt=new Ng(x,nt,bt),F=new Qg(D,Bt,bt,ft),Dt=new jp(D,ct,Bt),oe=new rm(D,ct,Bt),Bt.programs=Ut.programs,x.capabilities=bt,x.extensions=ct,x.properties=gt,x.renderLists=At,x.shadowMap=zt,x.state=ft,x.info=Bt}wt();const tt=new Zg(x,D);this.xr=tt,this.getContext=function(){return D},this.getContextAttributes=function(){return D.getContextAttributes()},this.forceContextLoss=function(){const C=ct.get("WEBGL_lose_context");C&&C.loseContext()},this.forceContextRestore=function(){const C=ct.get("WEBGL_lose_context");C&&C.restoreContext()},this.getPixelRatio=function(){return V},this.setPixelRatio=function(C){C!==void 0&&(V=C,this.setSize(U,q,!1))},this.getSize=function(C){return C.set(U,q)},this.setSize=function(C,O,K=!0){if(tt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}U=C,q=O,e.width=Math.floor(C*V),e.height=Math.floor(O*V),K===!0&&(e.style.width=C+"px",e.style.height=O+"px"),this.setViewport(0,0,C,O)},this.getDrawingBufferSize=function(C){return C.set(U*V,q*V).floor()},this.setDrawingBufferSize=function(C,O,K){U=C,q=O,V=K,e.width=Math.floor(C*K),e.height=Math.floor(O*K),this.setViewport(0,0,C,O)},this.getCurrentViewport=function(C){return C.copy(R)},this.getViewport=function(C){return C.copy(mt)},this.setViewport=function(C,O,K,j){C.isVector4?mt.set(C.x,C.y,C.z,C.w):mt.set(C,O,K,j),ft.viewport(R.copy(mt).multiplyScalar(V).round())},this.getScissor=function(C){return C.copy(Ct)},this.setScissor=function(C,O,K,j){C.isVector4?Ct.set(C.x,C.y,C.z,C.w):Ct.set(C,O,K,j),ft.scissor(I.copy(Ct).multiplyScalar(V).round())},this.getScissorTest=function(){return Z},this.setScissorTest=function(C){ft.setScissorTest(Z=C)},this.setOpaqueSort=function(C){rt=C},this.setTransparentSort=function(C){et=C},this.getClearColor=function(C){return C.copy(Wt.getClearColor())},this.setClearColor=function(){Wt.setClearColor.apply(Wt,arguments)},this.getClearAlpha=function(){return Wt.getClearAlpha()},this.setClearAlpha=function(){Wt.setClearAlpha.apply(Wt,arguments)},this.clear=function(C=!0,O=!0,K=!0){let j=0;if(C){let H=!1;if(E!==null){const dt=E.texture.format;H=dt===Bl||dt===Ol||dt===Fl}if(H){const dt=E.texture.type,Tt=dt===cn||dt===Hi||dt===gr||dt===Xn||dt===kl||dt===Nl,kt=Wt.getClearColor(),Nt=Wt.getClearAlpha(),Kt=kt.r,$t=kt.g,Ft=kt.b;Tt?(m[0]=Kt,m[1]=$t,m[2]=Ft,m[3]=Nt,D.clearBufferuiv(D.COLOR,0,m)):(v[0]=Kt,v[1]=$t,v[2]=Ft,v[3]=Nt,D.clearBufferiv(D.COLOR,0,v))}else j|=D.COLOR_BUFFER_BIT}O&&(j|=D.DEPTH_BUFFER_BIT),K&&(j|=D.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),D.clear(j)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",at,!1),e.removeEventListener("webglcontextrestored",Et,!1),e.removeEventListener("webglcontextcreationerror",St,!1),At.dispose(),ae.dispose(),gt.dispose(),A.dispose(),Y.dispose(),nt.dispose(),Se.dispose(),F.dispose(),Ut.dispose(),tt.dispose(),tt.removeEventListener("sessionstart",ic),tt.removeEventListener("sessionend",nc),Dn.stop()};function at(C){C.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),y=!0}function Et(){console.log("THREE.WebGLRenderer: Context Restored."),y=!1;const C=Bt.autoReset,O=zt.enabled,K=zt.autoUpdate,j=zt.needsUpdate,H=zt.type;wt(),Bt.autoReset=C,zt.enabled=O,zt.autoUpdate=K,zt.needsUpdate=j,zt.type=H}function St(C){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",C.statusMessage)}function Jt(C){const O=C.target;O.removeEventListener("dispose",Jt),Ie(O)}function Ie(C){Je(C),gt.remove(C)}function Je(C){const O=gt.get(C).programs;O!==void 0&&(O.forEach(function(K){Ut.releaseProgram(K)}),C.isShaderMaterial&&Ut.releaseShaderCache(C))}this.renderBufferDirect=function(C,O,K,j,H,dt){O===null&&(O=Vt);const Tt=H.isMesh&&H.matrixWorld.determinant()<0,kt=nf(C,O,K,j,H);ft.setMaterial(j,Tt);let Nt=K.index,Kt=1;if(j.wireframe===!0){if(Nt=lt.getWireframeAttribute(K),Nt===void 0)return;Kt=2}const $t=K.drawRange,Ft=K.attributes.position;let ue=$t.start*Kt,Te=($t.start+$t.count)*Kt;dt!==null&&(ue=Math.max(ue,dt.start*Kt),Te=Math.min(Te,(dt.start+dt.count)*Kt)),Nt!==null?(ue=Math.max(ue,0),Te=Math.min(Te,Nt.count)):Ft!=null&&(ue=Math.max(ue,0),Te=Math.min(Te,Ft.count));const _e=Te-ue;if(_e<0||_e===1/0)return;Se.setup(H,j,kt,K,Nt);let li,me=Dt;if(Nt!==null&&(li=it.get(Nt),me=oe,me.setIndex(li)),H.isMesh)j.wireframe===!0?(ft.setLineWidth(j.wireframeLinewidth*J()),me.setMode(D.LINES)):me.setMode(D.TRIANGLES);else if(H.isLine){let Ot=j.linewidth;Ot===void 0&&(Ot=1),ft.setLineWidth(Ot*J()),H.isLineSegments?me.setMode(D.LINES):H.isLineLoop?me.setMode(D.LINE_LOOP):me.setMode(D.LINE_STRIP)}else H.isPoints?me.setMode(D.POINTS):H.isSprite&&me.setMode(D.TRIANGLES);if(H.isBatchedMesh)if(H._multiDrawInstances!==null)me.renderMultiDrawInstances(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount,H._multiDrawInstances);else if(ct.get("WEBGL_multi_draw"))me.renderMultiDraw(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount);else{const Ot=H._multiDrawStarts,Yi=H._multiDrawCounts,ge=H._multiDrawCount,Ei=Nt?it.get(Nt).bytesPerElement:1,Jn=gt.get(j).currentProgram.getUniforms();for(let pi=0;pi<ge;pi++)Jn.setValue(D,"_gl_DrawID",pi),me.render(Ot[pi]/Ei,Yi[pi])}else if(H.isInstancedMesh)me.renderInstances(ue,_e,H.count);else if(K.isInstancedBufferGeometry){const Ot=K._maxInstanceCount!==void 0?K._maxInstanceCount:1/0,Yi=Math.min(K.instanceCount,Ot);me.renderInstances(ue,_e,Yi)}else me.render(ue,_e)};function xe(C,O,K){C.transparent===!0&&C.side===Ve&&C.forceSinglePass===!1?(C.side=oi,C.needsUpdate=!0,Rr(C,O,K),C.side=Pn,C.needsUpdate=!0,Rr(C,O,K),C.side=Ve):Rr(C,O,K)}this.compile=function(C,O,K=null){K===null&&(K=C),p=ae.get(K),p.init(O),w.push(p),K.traverseVisible(function(H){H.isLight&&H.layers.test(O.layers)&&(p.pushLight(H),H.castShadow&&p.pushShadow(H))}),C!==K&&C.traverseVisible(function(H){H.isLight&&H.layers.test(O.layers)&&(p.pushLight(H),H.castShadow&&p.pushShadow(H))}),p.setupLights();const j=new Set;return C.traverse(function(H){if(!(H.isMesh||H.isPoints||H.isLine||H.isSprite))return;const dt=H.material;if(dt)if(Array.isArray(dt))for(let Tt=0;Tt<dt.length;Tt++){const kt=dt[Tt];xe(kt,K,H),j.add(kt)}else xe(dt,K,H),j.add(dt)}),w.pop(),p=null,j},this.compileAsync=function(C,O,K=null){const j=this.compile(C,O,K);return new Promise(H=>{function dt(){if(j.forEach(function(Tt){gt.get(Tt).currentProgram.isReady()&&j.delete(Tt)}),j.size===0){H(C);return}setTimeout(dt,10)}ct.get("KHR_parallel_shader_compile")!==null?dt():setTimeout(dt,10)})};let _i=null;function qi(C){_i&&_i(C)}function ic(){Dn.stop()}function nc(){Dn.start()}const Dn=new bu;Dn.setAnimationLoop(qi),typeof self<"u"&&Dn.setContext(self),this.setAnimationLoop=function(C){_i=C,tt.setAnimationLoop(C),C===null?Dn.stop():Dn.start()},tt.addEventListener("sessionstart",ic),tt.addEventListener("sessionend",nc),this.render=function(C,O){if(O!==void 0&&O.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(y===!0)return;if(C.matrixWorldAutoUpdate===!0&&C.updateMatrixWorld(),O.parent===null&&O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),tt.enabled===!0&&tt.isPresenting===!0&&(tt.cameraAutoUpdate===!0&&tt.updateCamera(O),O=tt.getCamera()),C.isScene===!0&&C.onBeforeRender(x,C,O,E),p=ae.get(C,w.length),p.init(O),w.push(p),ut.multiplyMatrices(O.projectionMatrix,O.matrixWorldInverse),k.setFromProjectionMatrix(ut),st=this.localClippingEnabled,Q=ht.init(this.clippingPlanes,st),g=At.get(C,M.length),g.init(),M.push(g),tt.enabled===!0&&tt.isPresenting===!0){const dt=x.xr.getDepthSensingMesh();dt!==null&&Wa(dt,O,-1/0,x.sortObjects)}Wa(C,O,0,x.sortObjects),g.finish(),x.sortObjects===!0&&g.sort(rt,et),X=tt.enabled===!1||tt.isPresenting===!1||tt.hasDepthSensing()===!1,X&&Wt.addToRenderList(g,C),this.info.render.frame++,Q===!0&&ht.beginShadows();const K=p.state.shadowsArray;zt.render(K,C,O),Q===!0&&ht.endShadows(),this.info.autoReset===!0&&this.info.reset();const j=g.opaque,H=g.transmissive;if(p.setupLights(),O.isArrayCamera){const dt=O.cameras;if(H.length>0)for(let Tt=0,kt=dt.length;Tt<kt;Tt++){const Nt=dt[Tt];rc(j,H,C,Nt)}X&&Wt.render(C);for(let Tt=0,kt=dt.length;Tt<kt;Tt++){const Nt=dt[Tt];sc(g,C,Nt,Nt.viewport)}}else H.length>0&&rc(j,H,C,O),X&&Wt.render(C),sc(g,C,O);E!==null&&(P.updateMultisampleRenderTarget(E),P.updateRenderTargetMipmap(E)),C.isScene===!0&&C.onAfterRender(x,C,O),Se.resetDefaultState(),T=-1,S=null,w.pop(),w.length>0?(p=w[w.length-1],Q===!0&&ht.setGlobalState(x.clippingPlanes,p.state.camera)):p=null,M.pop(),M.length>0?g=M[M.length-1]:g=null};function Wa(C,O,K,j){if(C.visible===!1)return;if(C.layers.test(O.layers)){if(C.isGroup)K=C.renderOrder;else if(C.isLOD)C.autoUpdate===!0&&C.update(O);else if(C.isLight)p.pushLight(C),C.castShadow&&p.pushShadow(C);else if(C.isSprite){if(!C.frustumCulled||k.intersectsSprite(C)){j&&Pt.setFromMatrixPosition(C.matrixWorld).applyMatrix4(ut);const Tt=nt.update(C),kt=C.material;kt.visible&&g.push(C,Tt,kt,K,Pt.z,null)}}else if((C.isMesh||C.isLine||C.isPoints)&&(!C.frustumCulled||k.intersectsObject(C))){const Tt=nt.update(C),kt=C.material;if(j&&(C.boundingSphere!==void 0?(C.boundingSphere===null&&C.computeBoundingSphere(),Pt.copy(C.boundingSphere.center)):(Tt.boundingSphere===null&&Tt.computeBoundingSphere(),Pt.copy(Tt.boundingSphere.center)),Pt.applyMatrix4(C.matrixWorld).applyMatrix4(ut)),Array.isArray(kt)){const Nt=Tt.groups;for(let Kt=0,$t=Nt.length;Kt<$t;Kt++){const Ft=Nt[Kt],ue=kt[Ft.materialIndex];ue&&ue.visible&&g.push(C,Tt,ue,K,Pt.z,Ft)}}else kt.visible&&g.push(C,Tt,kt,K,Pt.z,null)}}const dt=C.children;for(let Tt=0,kt=dt.length;Tt<kt;Tt++)Wa(dt[Tt],O,K,j)}function sc(C,O,K,j){const H=C.opaque,dt=C.transmissive,Tt=C.transparent;p.setupLightsView(K),Q===!0&&ht.setGlobalState(x.clippingPlanes,K),j&&ft.viewport(R.copy(j)),H.length>0&&Cr(H,O,K),dt.length>0&&Cr(dt,O,K),Tt.length>0&&Cr(Tt,O,K),ft.buffers.depth.setTest(!0),ft.buffers.depth.setMask(!0),ft.buffers.color.setMask(!0),ft.setPolygonOffset(!1)}function rc(C,O,K,j){if((K.isScene===!0?K.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[j.id]===void 0&&(p.state.transmissionRenderTarget[j.id]=new Be(1,1,{generateMipmaps:!0,type:ct.has("EXT_color_buffer_half_float")||ct.has("EXT_color_buffer_float")?ai:cn,minFilter:_n,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ce.workingColorSpace}));const dt=p.state.transmissionRenderTarget[j.id],Tt=j.viewport||R;dt.setSize(Tt.z,Tt.w);const kt=x.getRenderTarget();x.setRenderTarget(dt),x.getClearColor(B),W=x.getClearAlpha(),W<1&&x.setClearColor(16777215,.5),x.clear(),X&&Wt.render(K);const Nt=x.toneMapping;x.toneMapping=An;const Kt=j.viewport;if(j.viewport!==void 0&&(j.viewport=void 0),p.setupLightsView(j),Q===!0&&ht.setGlobalState(x.clippingPlanes,j),Cr(C,K,j),P.updateMultisampleRenderTarget(dt),P.updateRenderTargetMipmap(dt),ct.has("WEBGL_multisampled_render_to_texture")===!1){let $t=!1;for(let Ft=0,ue=O.length;Ft<ue;Ft++){const Te=O[Ft],_e=Te.object,li=Te.geometry,me=Te.material,Ot=Te.group;if(me.side===Ve&&_e.layers.test(j.layers)){const Yi=me.side;me.side=oi,me.needsUpdate=!0,ac(_e,K,j,li,me,Ot),me.side=Yi,me.needsUpdate=!0,$t=!0}}$t===!0&&(P.updateMultisampleRenderTarget(dt),P.updateRenderTargetMipmap(dt))}x.setRenderTarget(kt),x.setClearColor(B,W),Kt!==void 0&&(j.viewport=Kt),x.toneMapping=Nt}function Cr(C,O,K){const j=O.isScene===!0?O.overrideMaterial:null;for(let H=0,dt=C.length;H<dt;H++){const Tt=C[H],kt=Tt.object,Nt=Tt.geometry,Kt=j===null?Tt.material:j,$t=Tt.group;kt.layers.test(K.layers)&&ac(kt,O,K,Nt,Kt,$t)}}function ac(C,O,K,j,H,dt){C.onBeforeRender(x,O,K,j,H,dt),C.modelViewMatrix.multiplyMatrices(K.matrixWorldInverse,C.matrixWorld),C.normalMatrix.getNormalMatrix(C.modelViewMatrix),H.onBeforeRender(x,O,K,j,C,dt),H.transparent===!0&&H.side===Ve&&H.forceSinglePass===!1?(H.side=oi,H.needsUpdate=!0,x.renderBufferDirect(K,O,j,H,C,dt),H.side=Pn,H.needsUpdate=!0,x.renderBufferDirect(K,O,j,H,C,dt),H.side=Ve):x.renderBufferDirect(K,O,j,H,C,dt),C.onAfterRender(x,O,K,j,H,dt)}function Rr(C,O,K){O.isScene!==!0&&(O=Vt);const j=gt.get(C),H=p.state.lights,dt=p.state.shadowsArray,Tt=H.state.version,kt=Ut.getParameters(C,H.state,dt,O,K),Nt=Ut.getProgramCacheKey(kt);let Kt=j.programs;j.environment=C.isMeshStandardMaterial?O.environment:null,j.fog=O.fog,j.envMap=(C.isMeshStandardMaterial?Y:A).get(C.envMap||j.environment),j.envMapRotation=j.environment!==null&&C.envMap===null?O.environmentRotation:C.envMapRotation,Kt===void 0&&(C.addEventListener("dispose",Jt),Kt=new Map,j.programs=Kt);let $t=Kt.get(Nt);if($t!==void 0){if(j.currentProgram===$t&&j.lightsStateVersion===Tt)return lc(C,kt),$t}else kt.uniforms=Ut.getUniforms(C),C.onBeforeCompile(kt,x),$t=Ut.acquireProgram(kt,Nt),Kt.set(Nt,$t),j.uniforms=kt.uniforms;const Ft=j.uniforms;return(!C.isShaderMaterial&&!C.isRawShaderMaterial||C.clipping===!0)&&(Ft.clippingPlanes=ht.uniform),lc(C,kt),j.needsLights=rf(C),j.lightsStateVersion=Tt,j.needsLights&&(Ft.ambientLightColor.value=H.state.ambient,Ft.lightProbe.value=H.state.probe,Ft.directionalLights.value=H.state.directional,Ft.directionalLightShadows.value=H.state.directionalShadow,Ft.spotLights.value=H.state.spot,Ft.spotLightShadows.value=H.state.spotShadow,Ft.rectAreaLights.value=H.state.rectArea,Ft.ltc_1.value=H.state.rectAreaLTC1,Ft.ltc_2.value=H.state.rectAreaLTC2,Ft.pointLights.value=H.state.point,Ft.pointLightShadows.value=H.state.pointShadow,Ft.hemisphereLights.value=H.state.hemi,Ft.directionalShadowMap.value=H.state.directionalShadowMap,Ft.directionalShadowMatrix.value=H.state.directionalShadowMatrix,Ft.spotShadowMap.value=H.state.spotShadowMap,Ft.spotLightMatrix.value=H.state.spotLightMatrix,Ft.spotLightMap.value=H.state.spotLightMap,Ft.pointShadowMap.value=H.state.pointShadowMap,Ft.pointShadowMatrix.value=H.state.pointShadowMatrix),j.currentProgram=$t,j.uniformsList=null,$t}function oc(C){if(C.uniformsList===null){const O=C.currentProgram.getUniforms();C.uniformsList=wa.seqWithValue(O.seq,C.uniforms)}return C.uniformsList}function lc(C,O){const K=gt.get(C);K.outputColorSpace=O.outputColorSpace,K.batching=O.batching,K.batchingColor=O.batchingColor,K.instancing=O.instancing,K.instancingColor=O.instancingColor,K.instancingMorph=O.instancingMorph,K.skinning=O.skinning,K.morphTargets=O.morphTargets,K.morphNormals=O.morphNormals,K.morphColors=O.morphColors,K.morphTargetsCount=O.morphTargetsCount,K.numClippingPlanes=O.numClippingPlanes,K.numIntersection=O.numClipIntersection,K.vertexAlphas=O.vertexAlphas,K.vertexTangents=O.vertexTangents,K.toneMapping=O.toneMapping}function nf(C,O,K,j,H){O.isScene!==!0&&(O=Vt),P.resetTextureUnits();const dt=O.fog,Tt=j.isMeshStandardMaterial?O.environment:null,kt=E===null?x.outputColorSpace:E.isXRRenderTarget===!0?E.texture.colorSpace:Os,Nt=(j.isMeshStandardMaterial?Y:A).get(j.envMap||Tt),Kt=j.vertexColors===!0&&!!K.attributes.color&&K.attributes.color.itemSize===4,$t=!!K.attributes.tangent&&(!!j.normalMap||j.anisotropy>0),Ft=!!K.morphAttributes.position,ue=!!K.morphAttributes.normal,Te=!!K.morphAttributes.color;let _e=An;j.toneMapped&&(E===null||E.isXRRenderTarget===!0)&&(_e=x.toneMapping);const li=K.morphAttributes.position||K.morphAttributes.normal||K.morphAttributes.color,me=li!==void 0?li.length:0,Ot=gt.get(j),Yi=p.state.lights;if(Q===!0&&(st===!0||C!==S)){const vi=C===S&&j.id===T;ht.setState(j,C,vi)}let ge=!1;j.version===Ot.__version?(Ot.needsLights&&Ot.lightsStateVersion!==Yi.state.version||Ot.outputColorSpace!==kt||H.isBatchedMesh&&Ot.batching===!1||!H.isBatchedMesh&&Ot.batching===!0||H.isBatchedMesh&&Ot.batchingColor===!0&&H.colorTexture===null||H.isBatchedMesh&&Ot.batchingColor===!1&&H.colorTexture!==null||H.isInstancedMesh&&Ot.instancing===!1||!H.isInstancedMesh&&Ot.instancing===!0||H.isSkinnedMesh&&Ot.skinning===!1||!H.isSkinnedMesh&&Ot.skinning===!0||H.isInstancedMesh&&Ot.instancingColor===!0&&H.instanceColor===null||H.isInstancedMesh&&Ot.instancingColor===!1&&H.instanceColor!==null||H.isInstancedMesh&&Ot.instancingMorph===!0&&H.morphTexture===null||H.isInstancedMesh&&Ot.instancingMorph===!1&&H.morphTexture!==null||Ot.envMap!==Nt||j.fog===!0&&Ot.fog!==dt||Ot.numClippingPlanes!==void 0&&(Ot.numClippingPlanes!==ht.numPlanes||Ot.numIntersection!==ht.numIntersection)||Ot.vertexAlphas!==Kt||Ot.vertexTangents!==$t||Ot.morphTargets!==Ft||Ot.morphNormals!==ue||Ot.morphColors!==Te||Ot.toneMapping!==_e||Ot.morphTargetsCount!==me)&&(ge=!0):(ge=!0,Ot.__version=j.version);let Ei=Ot.currentProgram;ge===!0&&(Ei=Rr(j,O,H));let Jn=!1,pi=!1,Ws=!1;const Ee=Ei.getUniforms(),Ui=Ot.uniforms;if(ft.useProgram(Ei.program)&&(Jn=!0,pi=!0,Ws=!0),j.id!==T&&(T=j.id,pi=!0),Jn||S!==C){ft.buffers.depth.getReversed()?($.copy(C.projectionMatrix),Vf($),Wf($),Ee.setValue(D,"projectionMatrix",$)):Ee.setValue(D,"projectionMatrix",C.projectionMatrix),Ee.setValue(D,"viewMatrix",C.matrixWorldInverse);const un=Ee.map.cameraPosition;un!==void 0&&un.setValue(D,Rt.setFromMatrixPosition(C.matrixWorld)),bt.logarithmicDepthBuffer&&Ee.setValue(D,"logDepthBufFC",2/(Math.log(C.far+1)/Math.LN2)),(j.isMeshPhongMaterial||j.isMeshToonMaterial||j.isMeshLambertMaterial||j.isMeshBasicMaterial||j.isMeshStandardMaterial||j.isShaderMaterial)&&Ee.setValue(D,"isOrthographic",C.isOrthographicCamera===!0),S!==C&&(S=C,pi=!0,Ws=!0)}if(H.isSkinnedMesh){Ee.setOptional(D,H,"bindMatrix"),Ee.setOptional(D,H,"bindMatrixInverse");const vi=H.skeleton;vi&&(vi.boneTexture===null&&vi.computeBoneTexture(),Ee.setValue(D,"boneTexture",vi.boneTexture,P))}H.isBatchedMesh&&(Ee.setOptional(D,H,"batchingTexture"),Ee.setValue(D,"batchingTexture",H._matricesTexture,P),Ee.setOptional(D,H,"batchingIdTexture"),Ee.setValue(D,"batchingIdTexture",H._indirectTexture,P),Ee.setOptional(D,H,"batchingColorTexture"),H._colorsTexture!==null&&Ee.setValue(D,"batchingColorTexture",H._colorsTexture,P));const Xs=K.morphAttributes;if((Xs.position!==void 0||Xs.normal!==void 0||Xs.color!==void 0)&&Zt.update(H,K,Ei),(pi||Ot.receiveShadow!==H.receiveShadow)&&(Ot.receiveShadow=H.receiveShadow,Ee.setValue(D,"receiveShadow",H.receiveShadow)),j.isMeshGouraudMaterial&&j.envMap!==null&&(Ui.envMap.value=Nt,Ui.flipEnvMap.value=Nt.isCubeTexture&&Nt.isRenderTargetTexture===!1?-1:1),j.isMeshStandardMaterial&&j.envMap===null&&O.environment!==null&&(Ui.envMapIntensity.value=O.environmentIntensity),pi&&(Ee.setValue(D,"toneMappingExposure",x.toneMappingExposure),Ot.needsLights&&sf(Ui,Ws),dt&&j.fog===!0&&Mt.refreshFogUniforms(Ui,dt),Mt.refreshMaterialUniforms(Ui,j,V,q,p.state.transmissionRenderTarget[C.id]),wa.upload(D,oc(Ot),Ui,P)),j.isShaderMaterial&&j.uniformsNeedUpdate===!0&&(wa.upload(D,oc(Ot),Ui,P),j.uniformsNeedUpdate=!1),j.isSpriteMaterial&&Ee.setValue(D,"center",H.center),Ee.setValue(D,"modelViewMatrix",H.modelViewMatrix),Ee.setValue(D,"normalMatrix",H.normalMatrix),Ee.setValue(D,"modelMatrix",H.matrixWorld),j.isShaderMaterial||j.isRawShaderMaterial){const vi=j.uniformsGroups;for(let un=0,fn=vi.length;un<fn;un++){const cc=vi[un];F.update(cc,Ei),F.bind(cc,Ei)}}return Ei}function sf(C,O){C.ambientLightColor.needsUpdate=O,C.lightProbe.needsUpdate=O,C.directionalLights.needsUpdate=O,C.directionalLightShadows.needsUpdate=O,C.pointLights.needsUpdate=O,C.pointLightShadows.needsUpdate=O,C.spotLights.needsUpdate=O,C.spotLightShadows.needsUpdate=O,C.rectAreaLights.needsUpdate=O,C.hemisphereLights.needsUpdate=O}function rf(C){return C.isMeshLambertMaterial||C.isMeshToonMaterial||C.isMeshPhongMaterial||C.isMeshStandardMaterial||C.isShadowMaterial||C.isShaderMaterial&&C.lights===!0}this.getActiveCubeFace=function(){return b},this.getActiveMipmapLevel=function(){return _},this.getRenderTarget=function(){return E},this.setRenderTargetTextures=function(C,O,K){gt.get(C.texture).__webglTexture=O,gt.get(C.depthTexture).__webglTexture=K;const j=gt.get(C);j.__hasExternalTextures=!0,j.__autoAllocateDepthBuffer=K===void 0,j.__autoAllocateDepthBuffer||ct.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),j.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(C,O){const K=gt.get(C);K.__webglFramebuffer=O,K.__useDefaultFramebuffer=O===void 0},this.setRenderTarget=function(C,O=0,K=0){E=C,b=O,_=K;let j=!0,H=null,dt=!1,Tt=!1;if(C){const Nt=gt.get(C);if(Nt.__useDefaultFramebuffer!==void 0)ft.bindFramebuffer(D.FRAMEBUFFER,null),j=!1;else if(Nt.__webglFramebuffer===void 0)P.setupRenderTarget(C);else if(Nt.__hasExternalTextures)P.rebindTextures(C,gt.get(C.texture).__webglTexture,gt.get(C.depthTexture).__webglTexture);else if(C.depthBuffer){const Ft=C.depthTexture;if(Nt.__boundDepthTexture!==Ft){if(Ft!==null&&gt.has(Ft)&&(C.width!==Ft.image.width||C.height!==Ft.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");P.setupDepthRenderbuffer(C)}}const Kt=C.texture;(Kt.isData3DTexture||Kt.isDataArrayTexture||Kt.isCompressedArrayTexture)&&(Tt=!0);const $t=gt.get(C).__webglFramebuffer;C.isWebGLCubeRenderTarget?(Array.isArray($t[O])?H=$t[O][K]:H=$t[O],dt=!0):C.samples>0&&P.useMultisampledRTT(C)===!1?H=gt.get(C).__webglMultisampledFramebuffer:Array.isArray($t)?H=$t[K]:H=$t,R.copy(C.viewport),I.copy(C.scissor),L=C.scissorTest}else R.copy(mt).multiplyScalar(V).floor(),I.copy(Ct).multiplyScalar(V).floor(),L=Z;if(ft.bindFramebuffer(D.FRAMEBUFFER,H)&&j&&ft.drawBuffers(C,H),ft.viewport(R),ft.scissor(I),ft.setScissorTest(L),dt){const Nt=gt.get(C.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_CUBE_MAP_POSITIVE_X+O,Nt.__webglTexture,K)}else if(Tt){const Nt=gt.get(C.texture),Kt=O||0;D.framebufferTextureLayer(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,Nt.__webglTexture,K||0,Kt)}T=-1},this.readRenderTargetPixels=function(C,O,K,j,H,dt,Tt){if(!(C&&C.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let kt=gt.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&Tt!==void 0&&(kt=kt[Tt]),kt){ft.bindFramebuffer(D.FRAMEBUFFER,kt);try{const Nt=C.texture,Kt=Nt.format,$t=Nt.type;if(!bt.textureFormatReadable(Kt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!bt.textureTypeReadable($t)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}O>=0&&O<=C.width-j&&K>=0&&K<=C.height-H&&D.readPixels(O,K,j,H,ie.convert(Kt),ie.convert($t),dt)}finally{const Nt=E!==null?gt.get(E).__webglFramebuffer:null;ft.bindFramebuffer(D.FRAMEBUFFER,Nt)}}},this.readRenderTargetPixelsAsync=async function(C,O,K,j,H,dt,Tt){if(!(C&&C.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let kt=gt.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&Tt!==void 0&&(kt=kt[Tt]),kt){const Nt=C.texture,Kt=Nt.format,$t=Nt.type;if(!bt.textureFormatReadable(Kt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!bt.textureTypeReadable($t))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(O>=0&&O<=C.width-j&&K>=0&&K<=C.height-H){ft.bindFramebuffer(D.FRAMEBUFFER,kt);const Ft=D.createBuffer();D.bindBuffer(D.PIXEL_PACK_BUFFER,Ft),D.bufferData(D.PIXEL_PACK_BUFFER,dt.byteLength,D.STREAM_READ),D.readPixels(O,K,j,H,ie.convert(Kt),ie.convert($t),0);const ue=E!==null?gt.get(E).__webglFramebuffer:null;ft.bindFramebuffer(D.FRAMEBUFFER,ue);const Te=D.fenceSync(D.SYNC_GPU_COMMANDS_COMPLETE,0);return D.flush(),await Gf(D,Te,4),D.bindBuffer(D.PIXEL_PACK_BUFFER,Ft),D.getBufferSubData(D.PIXEL_PACK_BUFFER,0,dt),D.deleteBuffer(Ft),D.deleteSync(Te),dt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(C,O=null,K=0){C.isTexture!==!0&&(ar("WebGLRenderer: copyFramebufferToTexture function signature has changed."),O=arguments[0]||null,C=arguments[1]);const j=Math.pow(2,-K),H=Math.floor(C.image.width*j),dt=Math.floor(C.image.height*j),Tt=O!==null?O.x:0,kt=O!==null?O.y:0;P.setTexture2D(C,0),D.copyTexSubImage2D(D.TEXTURE_2D,K,0,0,Tt,kt,H,dt),ft.unbindTexture()},this.copyTextureToTexture=function(C,O,K=null,j=null,H=0){C.isTexture!==!0&&(ar("WebGLRenderer: copyTextureToTexture function signature has changed."),j=arguments[0]||null,C=arguments[1],O=arguments[2],H=arguments[3]||0,K=null);let dt,Tt,kt,Nt,Kt,$t,Ft,ue,Te;const _e=C.isCompressedTexture?C.mipmaps[H]:C.image;K!==null?(dt=K.max.x-K.min.x,Tt=K.max.y-K.min.y,kt=K.isBox3?K.max.z-K.min.z:1,Nt=K.min.x,Kt=K.min.y,$t=K.isBox3?K.min.z:0):(dt=_e.width,Tt=_e.height,kt=_e.depth||1,Nt=0,Kt=0,$t=0),j!==null?(Ft=j.x,ue=j.y,Te=j.z):(Ft=0,ue=0,Te=0);const li=ie.convert(O.format),me=ie.convert(O.type);let Ot;O.isData3DTexture?(P.setTexture3D(O,0),Ot=D.TEXTURE_3D):O.isDataArrayTexture||O.isCompressedArrayTexture?(P.setTexture2DArray(O,0),Ot=D.TEXTURE_2D_ARRAY):(P.setTexture2D(O,0),Ot=D.TEXTURE_2D),D.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,O.flipY),D.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,O.premultiplyAlpha),D.pixelStorei(D.UNPACK_ALIGNMENT,O.unpackAlignment);const Yi=D.getParameter(D.UNPACK_ROW_LENGTH),ge=D.getParameter(D.UNPACK_IMAGE_HEIGHT),Ei=D.getParameter(D.UNPACK_SKIP_PIXELS),Jn=D.getParameter(D.UNPACK_SKIP_ROWS),pi=D.getParameter(D.UNPACK_SKIP_IMAGES);D.pixelStorei(D.UNPACK_ROW_LENGTH,_e.width),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,_e.height),D.pixelStorei(D.UNPACK_SKIP_PIXELS,Nt),D.pixelStorei(D.UNPACK_SKIP_ROWS,Kt),D.pixelStorei(D.UNPACK_SKIP_IMAGES,$t);const Ws=C.isDataArrayTexture||C.isData3DTexture,Ee=O.isDataArrayTexture||O.isData3DTexture;if(C.isRenderTargetTexture||C.isDepthTexture){const Ui=gt.get(C),Xs=gt.get(O),vi=gt.get(Ui.__renderTarget),un=gt.get(Xs.__renderTarget);ft.bindFramebuffer(D.READ_FRAMEBUFFER,vi.__webglFramebuffer),ft.bindFramebuffer(D.DRAW_FRAMEBUFFER,un.__webglFramebuffer);for(let fn=0;fn<kt;fn++)Ws&&D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,gt.get(C).__webglTexture,H,$t+fn),C.isDepthTexture?(Ee&&D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,gt.get(O).__webglTexture,H,Te+fn),D.blitFramebuffer(Nt,Kt,dt,Tt,Ft,ue,dt,Tt,D.DEPTH_BUFFER_BIT,D.NEAREST)):Ee?D.copyTexSubImage3D(Ot,H,Ft,ue,Te+fn,Nt,Kt,dt,Tt):D.copyTexSubImage2D(Ot,H,Ft,ue,Te+fn,Nt,Kt,dt,Tt);ft.bindFramebuffer(D.READ_FRAMEBUFFER,null),ft.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else Ee?C.isDataTexture||C.isData3DTexture?D.texSubImage3D(Ot,H,Ft,ue,Te,dt,Tt,kt,li,me,_e.data):O.isCompressedArrayTexture?D.compressedTexSubImage3D(Ot,H,Ft,ue,Te,dt,Tt,kt,li,_e.data):D.texSubImage3D(Ot,H,Ft,ue,Te,dt,Tt,kt,li,me,_e):C.isDataTexture?D.texSubImage2D(D.TEXTURE_2D,H,Ft,ue,dt,Tt,li,me,_e.data):C.isCompressedTexture?D.compressedTexSubImage2D(D.TEXTURE_2D,H,Ft,ue,_e.width,_e.height,li,_e.data):D.texSubImage2D(D.TEXTURE_2D,H,Ft,ue,dt,Tt,li,me,_e);D.pixelStorei(D.UNPACK_ROW_LENGTH,Yi),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,ge),D.pixelStorei(D.UNPACK_SKIP_PIXELS,Ei),D.pixelStorei(D.UNPACK_SKIP_ROWS,Jn),D.pixelStorei(D.UNPACK_SKIP_IMAGES,pi),H===0&&O.generateMipmaps&&D.generateMipmap(Ot),ft.unbindTexture()},this.copyTextureToTexture3D=function(C,O,K=null,j=null,H=0){return C.isTexture!==!0&&(ar("WebGLRenderer: copyTextureToTexture3D function signature has changed."),K=arguments[0]||null,j=arguments[1]||null,C=arguments[2],O=arguments[3],H=arguments[4]||0),ar('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(C,O,K,j,H)},this.initRenderTarget=function(C){gt.get(C).__webglFramebuffer===void 0&&P.setupRenderTarget(C)},this.initTexture=function(C){C.isCubeTexture?P.setTextureCube(C,0):C.isData3DTexture?P.setTexture3D(C,0):C.isDataArrayTexture||C.isCompressedArrayTexture?P.setTexture2DArray(C,0):P.setTexture2D(C,0),ft.unbindTexture()},this.resetState=function(){b=0,_=0,E=null,ft.reset(),Se.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return rn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=ce._getDrawingBufferColorSpace(t),e.unpackColorSpace=ce._getUnpackColorSpace()}}class Vl{constructor(t,e=1,i=1e3){this.isFog=!0,this.name="",this.color=new G(t),this.near=e,this.far=i}clone(){return new Vl(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class $g extends pe{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Vi,this.environmentIntensity=1,this.environmentRotation=new Vi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class Eu extends ii{constructor(t=null,e=1,i=1,n,s,a,o,l,c=ze,h=ze,f,u){super(null,a,o,l,c,h,n,s,f,u),this.isDataTexture=!0,this.image={data:t,width:e,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ah extends Le{constructor(t,e,i,n=1){super(t,e,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=n}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const ds=new qt,oh=new qt,Qr=[],lh=new zn,tx=new qt,Qs=new N,Js=new hn;class Mi extends N{constructor(t,e,i){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new ah(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let n=0;n<i;n++)this.setMatrixAt(n,tx)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new zn),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,ds),lh.copy(t.boundingBox).applyMatrix4(ds),this.boundingBox.union(lh)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new hn),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,ds),Js.copy(t.boundingSphere).applyMatrix4(ds),this.boundingSphere.union(Js)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const i=e.morphTargetInfluences,n=this.morphTexture.source.data.data,s=i.length+1,a=t*s+1;for(let o=0;o<i.length;o++)i[o]=n[a+o]}raycast(t,e){const i=this.matrixWorld,n=this.count;if(Qs.geometry=this.geometry,Qs.material=this.material,Qs.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Js.copy(this.boundingSphere),Js.applyMatrix4(i),t.ray.intersectsSphere(Js)!==!1))for(let s=0;s<n;s++){this.getMatrixAt(s,ds),oh.multiplyMatrices(i,ds),Qs.matrixWorld=oh,Qs.raycast(t,Qr);for(let a=0,o=Qr.length;a<o;a++){const l=Qr[a];l.instanceId=s,l.object=this,e.push(l)}Qr.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new ah(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){const i=e.morphTargetInfluences,n=i.length+1;this.morphTexture===null&&(this.morphTexture=new Eu(new Float32Array(n*this.count),n,this.count,Fa,Ii));const s=this.morphTexture.source.data.data;let a=0;for(let c=0;c<i.length;c++)a+=i[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=n*t;s[l]=o,s.set(i,l+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}class Au extends Kn{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new G(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const Aa=new z,Ca=new z,ch=new qt,$s=new Tr,Jr=new hn,wo=new z,hh=new z;class ex extends pe{constructor(t=new we,e=new Au){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[0];for(let n=1,s=e.count;n<s;n++)Aa.fromBufferAttribute(e,n-1),Ca.fromBufferAttribute(e,n),i[n]=i[n-1],i[n]+=Aa.distanceTo(Ca);t.setAttribute("lineDistance",new Qt(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const i=this.geometry,n=this.matrixWorld,s=t.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Jr.copy(i.boundingSphere),Jr.applyMatrix4(n),Jr.radius+=s,t.ray.intersectsSphere(Jr)===!1)return;ch.copy(n).invert(),$s.copy(t.ray).applyMatrix4(ch);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,h=i.index,u=i.attributes.position;if(h!==null){const d=Math.max(0,a.start),m=Math.min(h.count,a.start+a.count);for(let v=d,g=m-1;v<g;v+=c){const p=h.getX(v),M=h.getX(v+1),w=$r(this,t,$s,l,p,M);w&&e.push(w)}if(this.isLineLoop){const v=h.getX(m-1),g=h.getX(d),p=$r(this,t,$s,l,v,g);p&&e.push(p)}}else{const d=Math.max(0,a.start),m=Math.min(u.count,a.start+a.count);for(let v=d,g=m-1;v<g;v+=c){const p=$r(this,t,$s,l,v,v+1);p&&e.push(p)}if(this.isLineLoop){const v=$r(this,t,$s,l,m-1,d);v&&e.push(v)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const n=e[i[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=n.length;s<a;s++){const o=n[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function $r(r,t,e,i,n,s){const a=r.geometry.attributes.position;if(Aa.fromBufferAttribute(a,n),Ca.fromBufferAttribute(a,s),e.distanceSqToSegment(Aa,Ca,wo,hh)>i)return;wo.applyMatrix4(r.matrixWorld);const l=t.ray.origin.distanceTo(wo);if(!(l<t.near||l>t.far))return{distance:l,point:hh.clone().applyMatrix4(r.matrixWorld),index:n,face:null,faceIndex:null,barycoord:null,object:r}}const uh=new z,fh=new z;class ix extends ex{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[];for(let n=0,s=e.count;n<s;n+=2)uh.fromBufferAttribute(e,n),fh.fromBufferAttribute(e,n+1),i[n]=n===0?0:i[n-1],i[n+1]=i[n]+uh.distanceTo(fh);t.setAttribute("lineDistance",new Qt(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Ra extends Kn{static get type(){return"PointsMaterial"}constructor(t){super(),this.isPointsMaterial=!0,this.color=new G(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const dh=new qt,Sl=new Tr,ta=new hn,ea=new z;class Pa extends pe{constructor(t=new we,e=new Ra){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const i=this.geometry,n=this.matrixWorld,s=t.params.Points.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),ta.copy(i.boundingSphere),ta.applyMatrix4(n),ta.radius+=s,t.ray.intersectsSphere(ta)===!1)return;dh.copy(n).invert(),Sl.copy(t.ray).applyMatrix4(dh);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=i.index,f=i.attributes.position;if(c!==null){const u=Math.max(0,a.start),d=Math.min(c.count,a.start+a.count);for(let m=u,v=d;m<v;m++){const g=c.getX(m);ea.fromBufferAttribute(f,g),ph(ea,g,l,n,t,e,this)}}else{const u=Math.max(0,a.start),d=Math.min(f.count,a.start+a.count);for(let m=u,v=d;m<v;m++)ea.fromBufferAttribute(f,m),ph(ea,m,l,n,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const n=e[i[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=n.length;s<a;s++){const o=n[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function ph(r,t,e,i,n,s,a){const o=Sl.distanceSqToPoint(r);if(o<e){const l=new z;Sl.closestPointToPoint(r,l),l.applyMatrix4(i);const c=n.ray.origin.distanceTo(l);if(c<n.near||c>n.far)return;s.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:a})}}class vr extends ii{constructor(t,e,i,n,s,a,o,l,c){super(t,e,i,n,s,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Wi{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const i=this.getUtoTmapping(t);return this.getPoint(i,e)}getPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return e}getSpacedPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPointAt(i/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let i,n=this.getPoint(0),s=0;e.push(0);for(let a=1;a<=t;a++)i=this.getPoint(a/t),s+=i.distanceTo(n),e.push(s),n=i;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const i=this.getLengths();let n=0;const s=i.length;let a;e?a=e:a=t*i[s-1];let o=0,l=s-1,c;for(;o<=l;)if(n=Math.floor(o+(l-o)/2),c=i[n]-a,c<0)o=n+1;else if(c>0)l=n-1;else{l=n;break}if(n=l,i[n]===a)return n/(s-1);const h=i[n],u=i[n+1]-h,d=(a-h)/u;return(n+d)/(s-1)}getTangent(t,e){let n=t-1e-4,s=t+1e-4;n<0&&(n=0),s>1&&(s=1);const a=this.getPoint(n),o=this.getPoint(s),l=e||(a.isVector2?new ot:new z);return l.copy(o).sub(a).normalize(),l}getTangentAt(t,e){const i=this.getUtoTmapping(t);return this.getTangent(i,e)}computeFrenetFrames(t,e){const i=new z,n=[],s=[],a=[],o=new z,l=new qt;for(let d=0;d<=t;d++){const m=d/t;n[d]=this.getTangentAt(m,new z)}s[0]=new z,a[0]=new z;let c=Number.MAX_VALUE;const h=Math.abs(n[0].x),f=Math.abs(n[0].y),u=Math.abs(n[0].z);h<=c&&(c=h,i.set(1,0,0)),f<=c&&(c=f,i.set(0,1,0)),u<=c&&i.set(0,0,1),o.crossVectors(n[0],i).normalize(),s[0].crossVectors(n[0],o),a[0].crossVectors(n[0],s[0]);for(let d=1;d<=t;d++){if(s[d]=s[d-1].clone(),a[d]=a[d-1].clone(),o.crossVectors(n[d-1],n[d]),o.length()>Number.EPSILON){o.normalize();const m=Math.acos(Qe(n[d-1].dot(n[d]),-1,1));s[d].applyMatrix4(l.makeRotationAxis(o,m))}a[d].crossVectors(n[d],s[d])}if(e===!0){let d=Math.acos(Qe(s[0].dot(s[t]),-1,1));d/=t,n[0].dot(o.crossVectors(s[0],s[t]))>0&&(d=-d);for(let m=1;m<=t;m++)s[m].applyMatrix4(l.makeRotationAxis(n[m],d*m)),a[m].crossVectors(n[m],s[m])}return{tangents:n,normals:s,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class Wl extends Wi{constructor(t=0,e=0,i=1,n=1,s=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=i,this.yRadius=n,this.aStartAngle=s,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(t,e=new ot){const i=e,n=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const a=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=n;for(;s>n;)s-=n;s<Number.EPSILON&&(a?s=0:s=n),this.aClockwise===!0&&!a&&(s===n?s=-n:s=s-n);const o=this.aStartAngle+t*s;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),f=Math.sin(this.aRotation),u=l-this.aX,d=c-this.aY;l=u*h-d*f+this.aX,c=u*f+d*h+this.aY}return i.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class nx extends Wl{constructor(t,e,i,n,s,a){super(t,e,i,i,n,s,a),this.isArcCurve=!0,this.type="ArcCurve"}}function Xl(){let r=0,t=0,e=0,i=0;function n(s,a,o,l){r=s,t=o,e=-3*s+3*a-2*o-l,i=2*s-2*a+o+l}return{initCatmullRom:function(s,a,o,l,c){n(a,o,c*(o-s),c*(l-a))},initNonuniformCatmullRom:function(s,a,o,l,c,h,f){let u=(a-s)/c-(o-s)/(c+h)+(o-a)/h,d=(o-a)/h-(l-a)/(h+f)+(l-o)/f;u*=h,d*=h,n(a,o,u,d)},calc:function(s){const a=s*s,o=a*s;return r+t*s+e*a+i*o}}}const ia=new z,So=new Xl,To=new Xl,_o=new Xl;class sx extends Wi{constructor(t=[],e=!1,i="centripetal",n=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=i,this.tension=n}getPoint(t,e=new z){const i=e,n=this.points,s=n.length,a=(s-(this.closed?0:1))*t;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/s)+1)*s:l===0&&o===s-1&&(o=s-2,l=1);let c,h;this.closed||o>0?c=n[(o-1)%s]:(ia.subVectors(n[0],n[1]).add(n[0]),c=ia);const f=n[o%s],u=n[(o+1)%s];if(this.closed||o+2<s?h=n[(o+2)%s]:(ia.subVectors(n[s-1],n[s-2]).add(n[s-1]),h=ia),this.curveType==="centripetal"||this.curveType==="chordal"){const d=this.curveType==="chordal"?.5:.25;let m=Math.pow(c.distanceToSquared(f),d),v=Math.pow(f.distanceToSquared(u),d),g=Math.pow(u.distanceToSquared(h),d);v<1e-4&&(v=1),m<1e-4&&(m=v),g<1e-4&&(g=v),So.initNonuniformCatmullRom(c.x,f.x,u.x,h.x,m,v,g),To.initNonuniformCatmullRom(c.y,f.y,u.y,h.y,m,v,g),_o.initNonuniformCatmullRom(c.z,f.z,u.z,h.z,m,v,g)}else this.curveType==="catmullrom"&&(So.initCatmullRom(c.x,f.x,u.x,h.x,this.tension),To.initCatmullRom(c.y,f.y,u.y,h.y,this.tension),_o.initCatmullRom(c.z,f.z,u.z,h.z,this.tension));return i.set(So.calc(l),To.calc(l),_o.calc(l)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const n=t.points[e];this.points.push(n.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const n=this.points[e];t.points.push(n.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const n=t.points[e];this.points.push(new z().fromArray(n))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function mh(r,t,e,i,n){const s=(i-t)*.5,a=(n-e)*.5,o=r*r,l=r*o;return(2*e-2*i+s+a)*l+(-3*e+3*i-2*s-a)*o+s*r+e}function rx(r,t){const e=1-r;return e*e*t}function ax(r,t){return 2*(1-r)*r*t}function ox(r,t){return r*r*t}function cr(r,t,e,i){return rx(r,t)+ax(r,e)+ox(r,i)}function lx(r,t){const e=1-r;return e*e*e*t}function cx(r,t){const e=1-r;return 3*e*e*r*t}function hx(r,t){return 3*(1-r)*r*r*t}function ux(r,t){return r*r*r*t}function hr(r,t,e,i,n){return lx(r,t)+cx(r,e)+hx(r,i)+ux(r,n)}class Cu extends Wi{constructor(t=new ot,e=new ot,i=new ot,n=new ot){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=i,this.v3=n}getPoint(t,e=new ot){const i=e,n=this.v0,s=this.v1,a=this.v2,o=this.v3;return i.set(hr(t,n.x,s.x,a.x,o.x),hr(t,n.y,s.y,a.y,o.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class fx extends Wi{constructor(t=new z,e=new z,i=new z,n=new z){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=i,this.v3=n}getPoint(t,e=new z){const i=e,n=this.v0,s=this.v1,a=this.v2,o=this.v3;return i.set(hr(t,n.x,s.x,a.x,o.x),hr(t,n.y,s.y,a.y,o.y),hr(t,n.z,s.z,a.z,o.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Ru extends Wi{constructor(t=new ot,e=new ot){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new ot){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new ot){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class dx extends Wi{constructor(t=new z,e=new z){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new z){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new z){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Pu extends Wi{constructor(t=new ot,e=new ot,i=new ot){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new ot){const i=e,n=this.v0,s=this.v1,a=this.v2;return i.set(cr(t,n.x,s.x,a.x),cr(t,n.y,s.y,a.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class px extends Wi{constructor(t=new z,e=new z,i=new z){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new z){const i=e,n=this.v0,s=this.v1,a=this.v2;return i.set(cr(t,n.x,s.x,a.x),cr(t,n.y,s.y,a.y),cr(t,n.z,s.z,a.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class zu extends Wi{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new ot){const i=e,n=this.points,s=(n.length-1)*t,a=Math.floor(s),o=s-a,l=n[a===0?a:a-1],c=n[a],h=n[a>n.length-2?n.length-1:a+1],f=n[a>n.length-3?n.length-1:a+2];return i.set(mh(o,l.x,c.x,h.x,f.x),mh(o,l.y,c.y,h.y,f.y)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const n=t.points[e];this.points.push(n.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const n=this.points[e];t.points.push(n.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const n=t.points[e];this.points.push(new ot().fromArray(n))}return this}}var Tl=Object.freeze({__proto__:null,ArcCurve:nx,CatmullRomCurve3:sx,CubicBezierCurve:Cu,CubicBezierCurve3:fx,EllipseCurve:Wl,LineCurve:Ru,LineCurve3:dx,QuadraticBezierCurve:Pu,QuadraticBezierCurve3:px,SplineCurve:zu});class mx extends Wi{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const i=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Tl[i](e,t))}return this}getPoint(t,e){const i=t*this.getLength(),n=this.getCurveLengths();let s=0;for(;s<n.length;){if(n[s]>=i){const a=n[s]-i,o=this.curves[s],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,e)}s++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let i=0,n=this.curves.length;i<n;i++)e+=this.curves[i].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let i;for(let n=0,s=this.curves;n<s.length;n++){const a=s[n],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,l=a.getPoints(o);for(let c=0;c<l.length;c++){const h=l[c];i&&i.equals(h)||(e.push(h),i=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const n=t.curves[e];this.curves.push(n.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,i=this.curves.length;e<i;e++){const n=this.curves[e];t.curves.push(n.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const n=t.curves[e];this.curves.push(new Tl[n.type]().fromJSON(n))}return this}}class _l extends mx{constructor(t){super(),this.type="Path",this.currentPoint=new ot,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,i=t.length;e<i;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const i=new Ru(this.currentPoint.clone(),new ot(t,e));return this.curves.push(i),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,i,n){const s=new Pu(this.currentPoint.clone(),new ot(t,e),new ot(i,n));return this.curves.push(s),this.currentPoint.set(i,n),this}bezierCurveTo(t,e,i,n,s,a){const o=new Cu(this.currentPoint.clone(),new ot(t,e),new ot(i,n),new ot(s,a));return this.curves.push(o),this.currentPoint.set(s,a),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),i=new zu(e);return this.curves.push(i),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,i,n,s,a){const o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+o,e+l,i,n,s,a),this}absarc(t,e,i,n,s,a){return this.absellipse(t,e,i,i,n,s,a),this}ellipse(t,e,i,n,s,a,o,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,i,n,s,a,o,l),this}absellipse(t,e,i,n,s,a,o,l){const c=new Wl(t,e,i,n,s,a,o,l);if(this.curves.length>0){const f=c.getPoint(0);f.equals(this.currentPoint)||this.lineTo(f.x,f.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class ql extends we{constructor(t=[new ot(0,-.5),new ot(.5,0),new ot(0,.5)],e=12,i=0,n=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:i,phiLength:n},e=Math.floor(e),n=Qe(n,0,Math.PI*2);const s=[],a=[],o=[],l=[],c=[],h=1/e,f=new z,u=new ot,d=new z,m=new z,v=new z;let g=0,p=0;for(let M=0;M<=t.length-1;M++)switch(M){case 0:g=t[M+1].x-t[M].x,p=t[M+1].y-t[M].y,d.x=p*1,d.y=-g,d.z=p*0,v.copy(d),d.normalize(),l.push(d.x,d.y,d.z);break;case t.length-1:l.push(v.x,v.y,v.z);break;default:g=t[M+1].x-t[M].x,p=t[M+1].y-t[M].y,d.x=p*1,d.y=-g,d.z=p*0,m.copy(d),d.x+=v.x,d.y+=v.y,d.z+=v.z,d.normalize(),l.push(d.x,d.y,d.z),v.copy(m)}for(let M=0;M<=e;M++){const w=i+M*h*n,x=Math.sin(w),y=Math.cos(w);for(let b=0;b<=t.length-1;b++){f.x=t[b].x*x,f.y=t[b].y,f.z=t[b].x*y,a.push(f.x,f.y,f.z),u.x=M/e,u.y=b/(t.length-1),o.push(u.x,u.y);const _=l[3*b+0]*x,E=l[3*b+1],T=l[3*b+0]*y;c.push(_,E,T)}}for(let M=0;M<e;M++)for(let w=0;w<t.length-1;w++){const x=w+M*t.length,y=x,b=x+t.length,_=x+t.length+1,E=x+1;s.push(y,b,E),s.push(_,E,b)}this.setIndex(s),this.setAttribute("position",new Qt(a,3)),this.setAttribute("uv",new Qt(o,2)),this.setAttribute("normal",new Qt(c,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ql(t.points,t.segments,t.phiStart,t.phiLength)}}class Yl extends ql{constructor(t=1,e=1,i=4,n=8){const s=new _l;s.absarc(0,-e/2,t,Math.PI*1.5,0),s.absarc(0,e/2,t,0,Math.PI*.5),super(s.getPoints(i),n),this.type="CapsuleGeometry",this.parameters={radius:t,length:e,capSegments:i,radialSegments:n}}static fromJSON(t){return new Yl(t.radius,t.length,t.capSegments,t.radialSegments)}}class za extends we{constructor(t=1,e=32,i=0,n=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:i,thetaLength:n},e=Math.max(3,e);const s=[],a=[],o=[],l=[],c=new z,h=new ot;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let f=0,u=3;f<=e;f++,u+=3){const d=i+f/e*n;c.x=t*Math.cos(d),c.y=t*Math.sin(d),a.push(c.x,c.y,c.z),o.push(0,0,1),h.x=(a[u]/t+1)/2,h.y=(a[u+1]/t+1)/2,l.push(h.x,h.y)}for(let f=1;f<=e;f++)s.push(f,f+1,0);this.setIndex(s),this.setAttribute("position",new Qt(a,3)),this.setAttribute("normal",new Qt(o,3)),this.setAttribute("uv",new Qt(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new za(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class jt extends we{constructor(t=1,e=1,i=1,n=32,s=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:n,heightSegments:s,openEnded:a,thetaStart:o,thetaLength:l};const c=this;n=Math.floor(n),s=Math.floor(s);const h=[],f=[],u=[],d=[];let m=0;const v=[],g=i/2;let p=0;M(),a===!1&&(t>0&&w(!0),e>0&&w(!1)),this.setIndex(h),this.setAttribute("position",new Qt(f,3)),this.setAttribute("normal",new Qt(u,3)),this.setAttribute("uv",new Qt(d,2));function M(){const x=new z,y=new z;let b=0;const _=(e-t)/i;for(let E=0;E<=s;E++){const T=[],S=E/s,R=S*(e-t)+t;for(let I=0;I<=n;I++){const L=I/n,B=L*l+o,W=Math.sin(B),U=Math.cos(B);y.x=R*W,y.y=-S*i+g,y.z=R*U,f.push(y.x,y.y,y.z),x.set(W,_,U).normalize(),u.push(x.x,x.y,x.z),d.push(L,1-S),T.push(m++)}v.push(T)}for(let E=0;E<n;E++)for(let T=0;T<s;T++){const S=v[T][E],R=v[T+1][E],I=v[T+1][E+1],L=v[T][E+1];(t>0||T!==0)&&(h.push(S,R,L),b+=3),(e>0||T!==s-1)&&(h.push(R,I,L),b+=3)}c.addGroup(p,b,0),p+=b}function w(x){const y=m,b=new ot,_=new z;let E=0;const T=x===!0?t:e,S=x===!0?1:-1;for(let I=1;I<=n;I++)f.push(0,g*S,0),u.push(0,S,0),d.push(.5,.5),m++;const R=m;for(let I=0;I<=n;I++){const B=I/n*l+o,W=Math.cos(B),U=Math.sin(B);_.x=T*U,_.y=g*S,_.z=T*W,f.push(_.x,_.y,_.z),u.push(0,S,0),b.x=W*.5+.5,b.y=U*.5*S+.5,d.push(b.x,b.y),m++}for(let I=0;I<n;I++){const L=y+I,B=R+I;x===!0?h.push(B,B+1,L):h.push(B+1,B,L),E+=3}c.addGroup(p,E,x===!0?1:2),p+=E}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new jt(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Vs extends jt{constructor(t=1,e=1,i=32,n=1,s=!1,a=0,o=Math.PI*2){super(0,t,e,i,n,s,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:i,heightSegments:n,openEnded:s,thetaStart:a,thetaLength:o}}static fromJSON(t){return new Vs(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Zl extends we{constructor(t=[],e=[],i=1,n=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:i,detail:n};const s=[],a=[];o(n),c(i),h(),this.setAttribute("position",new Qt(s,3)),this.setAttribute("normal",new Qt(s.slice(),3)),this.setAttribute("uv",new Qt(a,2)),n===0?this.computeVertexNormals():this.normalizeNormals();function o(M){const w=new z,x=new z,y=new z;for(let b=0;b<e.length;b+=3)d(e[b+0],w),d(e[b+1],x),d(e[b+2],y),l(w,x,y,M)}function l(M,w,x,y){const b=y+1,_=[];for(let E=0;E<=b;E++){_[E]=[];const T=M.clone().lerp(x,E/b),S=w.clone().lerp(x,E/b),R=b-E;for(let I=0;I<=R;I++)I===0&&E===b?_[E][I]=T:_[E][I]=T.clone().lerp(S,I/R)}for(let E=0;E<b;E++)for(let T=0;T<2*(b-E)-1;T++){const S=Math.floor(T/2);T%2===0?(u(_[E][S+1]),u(_[E+1][S]),u(_[E][S])):(u(_[E][S+1]),u(_[E+1][S+1]),u(_[E+1][S]))}}function c(M){const w=new z;for(let x=0;x<s.length;x+=3)w.x=s[x+0],w.y=s[x+1],w.z=s[x+2],w.normalize().multiplyScalar(M),s[x+0]=w.x,s[x+1]=w.y,s[x+2]=w.z}function h(){const M=new z;for(let w=0;w<s.length;w+=3){M.x=s[w+0],M.y=s[w+1],M.z=s[w+2];const x=g(M)/2/Math.PI+.5,y=p(M)/Math.PI+.5;a.push(x,1-y)}m(),f()}function f(){for(let M=0;M<a.length;M+=6){const w=a[M+0],x=a[M+2],y=a[M+4],b=Math.max(w,x,y),_=Math.min(w,x,y);b>.9&&_<.1&&(w<.2&&(a[M+0]+=1),x<.2&&(a[M+2]+=1),y<.2&&(a[M+4]+=1))}}function u(M){s.push(M.x,M.y,M.z)}function d(M,w){const x=M*3;w.x=t[x+0],w.y=t[x+1],w.z=t[x+2]}function m(){const M=new z,w=new z,x=new z,y=new z,b=new ot,_=new ot,E=new ot;for(let T=0,S=0;T<s.length;T+=9,S+=6){M.set(s[T+0],s[T+1],s[T+2]),w.set(s[T+3],s[T+4],s[T+5]),x.set(s[T+6],s[T+7],s[T+8]),b.set(a[S+0],a[S+1]),_.set(a[S+2],a[S+3]),E.set(a[S+4],a[S+5]),y.copy(M).add(w).add(x).divideScalar(3);const R=g(y);v(b,S+0,M,R),v(_,S+2,w,R),v(E,S+4,x,R)}}function v(M,w,x,y){y<0&&M.x===1&&(a[w]=M.x-1),x.x===0&&x.z===0&&(a[w]=y/2/Math.PI+.5)}function g(M){return Math.atan2(M.z,-M.x)}function p(M){return Math.atan2(-M.y,Math.sqrt(M.x*M.x+M.z*M.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Zl(t.vertices,t.indices,t.radius,t.details)}}class Du extends _l{constructor(t){super(t),this.uuid=Hs(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let i=0,n=this.holes.length;i<n;i++)e[i]=this.holes[i].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const n=t.holes[e];this.holes.push(n.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,i=this.holes.length;e<i;e++){const n=this.holes[e];t.holes.push(n.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const n=t.holes[e];this.holes.push(new _l().fromJSON(n))}return this}}const gx={triangulate:function(r,t,e=2){const i=t&&t.length,n=i?t[0]*e:r.length;let s=Lu(r,0,n,e,!0);const a=[];if(!s||s.next===s.prev)return a;let o,l,c,h,f,u,d;if(i&&(s=bx(r,t,s,e)),r.length>80*e){o=c=r[0],l=h=r[1];for(let m=e;m<n;m+=e)f=r[m],u=r[m+1],f<o&&(o=f),u<l&&(l=u),f>c&&(c=f),u>h&&(h=u);d=Math.max(c-o,h-l),d=d!==0?32767/d:0}return yr(s,a,e,o,l,d,0),a}};function Lu(r,t,e,i,n){let s,a;if(n===Dx(r,t,e,i)>0)for(s=t;s<e;s+=i)a=gh(s,r[s],r[s+1],a);else for(s=e-i;s>=t;s-=i)a=gh(s,r[s],r[s+1],a);return a&&Ga(a,a.next)&&(br(a),a=a.next),a}function Yn(r,t){if(!r)return r;t||(t=r);let e=r,i;do if(i=!1,!e.steiner&&(Ga(e,e.next)||De(e.prev,e,e.next)===0)){if(br(e),e=t=e.prev,e===e.next)break;i=!0}else e=e.next;while(i||e!==t);return t}function yr(r,t,e,i,n,s,a){if(!r)return;!a&&s&&Ex(r,i,n,s);let o=r,l,c;for(;r.prev!==r.next;){if(l=r.prev,c=r.next,s?vx(r,i,n,s):xx(r)){t.push(l.i/e|0),t.push(r.i/e|0),t.push(c.i/e|0),br(r),r=c.next,o=c.next;continue}if(r=c,r===o){a?a===1?(r=yx(Yn(r),t,e),yr(r,t,e,i,n,s,2)):a===2&&Mx(r,t,e,i,n,s):yr(Yn(r),t,e,i,n,s,1);break}}}function xx(r){const t=r.prev,e=r,i=r.next;if(De(t,e,i)>=0)return!1;const n=t.x,s=e.x,a=i.x,o=t.y,l=e.y,c=i.y,h=n<s?n<a?n:a:s<a?s:a,f=o<l?o<c?o:c:l<c?l:c,u=n>s?n>a?n:a:s>a?s:a,d=o>l?o>c?o:c:l>c?l:c;let m=i.next;for(;m!==t;){if(m.x>=h&&m.x<=u&&m.y>=f&&m.y<=d&&ws(n,o,s,l,a,c,m.x,m.y)&&De(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function vx(r,t,e,i){const n=r.prev,s=r,a=r.next;if(De(n,s,a)>=0)return!1;const o=n.x,l=s.x,c=a.x,h=n.y,f=s.y,u=a.y,d=o<l?o<c?o:c:l<c?l:c,m=h<f?h<u?h:u:f<u?f:u,v=o>l?o>c?o:c:l>c?l:c,g=h>f?h>u?h:u:f>u?f:u,p=El(d,m,t,e,i),M=El(v,g,t,e,i);let w=r.prevZ,x=r.nextZ;for(;w&&w.z>=p&&x&&x.z<=M;){if(w.x>=d&&w.x<=v&&w.y>=m&&w.y<=g&&w!==n&&w!==a&&ws(o,h,l,f,c,u,w.x,w.y)&&De(w.prev,w,w.next)>=0||(w=w.prevZ,x.x>=d&&x.x<=v&&x.y>=m&&x.y<=g&&x!==n&&x!==a&&ws(o,h,l,f,c,u,x.x,x.y)&&De(x.prev,x,x.next)>=0))return!1;x=x.nextZ}for(;w&&w.z>=p;){if(w.x>=d&&w.x<=v&&w.y>=m&&w.y<=g&&w!==n&&w!==a&&ws(o,h,l,f,c,u,w.x,w.y)&&De(w.prev,w,w.next)>=0)return!1;w=w.prevZ}for(;x&&x.z<=M;){if(x.x>=d&&x.x<=v&&x.y>=m&&x.y<=g&&x!==n&&x!==a&&ws(o,h,l,f,c,u,x.x,x.y)&&De(x.prev,x,x.next)>=0)return!1;x=x.nextZ}return!0}function yx(r,t,e){let i=r;do{const n=i.prev,s=i.next.next;!Ga(n,s)&&Iu(n,i,i.next,s)&&Mr(n,s)&&Mr(s,n)&&(t.push(n.i/e|0),t.push(i.i/e|0),t.push(s.i/e|0),br(i),br(i.next),i=r=s),i=i.next}while(i!==r);return Yn(i)}function Mx(r,t,e,i,n,s){let a=r;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&Rx(a,o)){let l=Uu(a,o);a=Yn(a,a.next),l=Yn(l,l.next),yr(a,t,e,i,n,s,0),yr(l,t,e,i,n,s,0);return}o=o.next}a=a.next}while(a!==r)}function bx(r,t,e,i){const n=[];let s,a,o,l,c;for(s=0,a=t.length;s<a;s++)o=t[s]*i,l=s<a-1?t[s+1]*i:r.length,c=Lu(r,o,l,i,!1),c===c.next&&(c.steiner=!0),n.push(Cx(c));for(n.sort(wx),s=0;s<n.length;s++)e=Sx(n[s],e);return e}function wx(r,t){return r.x-t.x}function Sx(r,t){const e=Tx(r,t);if(!e)return t;const i=Uu(e,r);return Yn(i,i.next),Yn(e,e.next)}function Tx(r,t){let e=t,i=-1/0,n;const s=r.x,a=r.y;do{if(a<=e.y&&a>=e.next.y&&e.next.y!==e.y){const u=e.x+(a-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(u<=s&&u>i&&(i=u,n=e.x<e.next.x?e:e.next,u===s))return n}e=e.next}while(e!==t);if(!n)return null;const o=n,l=n.x,c=n.y;let h=1/0,f;e=n;do s>=e.x&&e.x>=l&&s!==e.x&&ws(a<c?s:i,a,l,c,a<c?i:s,a,e.x,e.y)&&(f=Math.abs(a-e.y)/(s-e.x),Mr(e,r)&&(f<h||f===h&&(e.x>n.x||e.x===n.x&&_x(n,e)))&&(n=e,h=f)),e=e.next;while(e!==o);return n}function _x(r,t){return De(r.prev,r,t.prev)<0&&De(t.next,r,r.next)<0}function Ex(r,t,e,i){let n=r;do n.z===0&&(n.z=El(n.x,n.y,t,e,i)),n.prevZ=n.prev,n.nextZ=n.next,n=n.next;while(n!==r);n.prevZ.nextZ=null,n.prevZ=null,Ax(n)}function Ax(r){let t,e,i,n,s,a,o,l,c=1;do{for(e=r,r=null,s=null,a=0;e;){for(a++,i=e,o=0,t=0;t<c&&(o++,i=i.nextZ,!!i);t++);for(l=c;o>0||l>0&&i;)o!==0&&(l===0||!i||e.z<=i.z)?(n=e,e=e.nextZ,o--):(n=i,i=i.nextZ,l--),s?s.nextZ=n:r=n,n.prevZ=s,s=n;e=i}s.nextZ=null,c*=2}while(a>1);return r}function El(r,t,e,i,n){return r=(r-e)*n|0,t=(t-i)*n|0,r=(r|r<<8)&16711935,r=(r|r<<4)&252645135,r=(r|r<<2)&858993459,r=(r|r<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,r|t<<1}function Cx(r){let t=r,e=r;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==r);return e}function ws(r,t,e,i,n,s,a,o){return(n-a)*(t-o)>=(r-a)*(s-o)&&(r-a)*(i-o)>=(e-a)*(t-o)&&(e-a)*(s-o)>=(n-a)*(i-o)}function Rx(r,t){return r.next.i!==t.i&&r.prev.i!==t.i&&!Px(r,t)&&(Mr(r,t)&&Mr(t,r)&&zx(r,t)&&(De(r.prev,r,t.prev)||De(r,t.prev,t))||Ga(r,t)&&De(r.prev,r,r.next)>0&&De(t.prev,t,t.next)>0)}function De(r,t,e){return(t.y-r.y)*(e.x-t.x)-(t.x-r.x)*(e.y-t.y)}function Ga(r,t){return r.x===t.x&&r.y===t.y}function Iu(r,t,e,i){const n=sa(De(r,t,e)),s=sa(De(r,t,i)),a=sa(De(e,i,r)),o=sa(De(e,i,t));return!!(n!==s&&a!==o||n===0&&na(r,e,t)||s===0&&na(r,i,t)||a===0&&na(e,r,i)||o===0&&na(e,t,i))}function na(r,t,e){return t.x<=Math.max(r.x,e.x)&&t.x>=Math.min(r.x,e.x)&&t.y<=Math.max(r.y,e.y)&&t.y>=Math.min(r.y,e.y)}function sa(r){return r>0?1:r<0?-1:0}function Px(r,t){let e=r;do{if(e.i!==r.i&&e.next.i!==r.i&&e.i!==t.i&&e.next.i!==t.i&&Iu(e,e.next,r,t))return!0;e=e.next}while(e!==r);return!1}function Mr(r,t){return De(r.prev,r,r.next)<0?De(r,t,r.next)>=0&&De(r,r.prev,t)>=0:De(r,t,r.prev)<0||De(r,r.next,t)<0}function zx(r,t){let e=r,i=!1;const n=(r.x+t.x)/2,s=(r.y+t.y)/2;do e.y>s!=e.next.y>s&&e.next.y!==e.y&&n<(e.next.x-e.x)*(s-e.y)/(e.next.y-e.y)+e.x&&(i=!i),e=e.next;while(e!==r);return i}function Uu(r,t){const e=new Al(r.i,r.x,r.y),i=new Al(t.i,t.x,t.y),n=r.next,s=t.prev;return r.next=t,t.prev=r,e.next=n,n.prev=e,i.next=e,e.prev=i,s.next=i,i.prev=s,i}function gh(r,t,e,i){const n=new Al(r,t,e);return i?(n.next=i.next,n.prev=i,i.next.prev=n,i.next=n):(n.prev=n,n.next=n),n}function br(r){r.next.prev=r.prev,r.prev.next=r.next,r.prevZ&&(r.prevZ.nextZ=r.nextZ),r.nextZ&&(r.nextZ.prevZ=r.prevZ)}function Al(r,t,e){this.i=r,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function Dx(r,t,e,i){let n=0;for(let s=t,a=e-i;s<e;s+=i)n+=(r[a]-r[s])*(r[s+1]+r[a+1]),a=s;return n}class ur{static area(t){const e=t.length;let i=0;for(let n=e-1,s=0;s<e;n=s++)i+=t[n].x*t[s].y-t[s].x*t[n].y;return i*.5}static isClockWise(t){return ur.area(t)<0}static triangulateShape(t,e){const i=[],n=[],s=[];xh(t),vh(i,t);let a=t.length;e.forEach(xh);for(let l=0;l<e.length;l++)n.push(a),a+=e[l].length,vh(i,e[l]);const o=gx.triangulate(i,n);for(let l=0;l<o.length;l+=3)s.push(o.slice(l,l+3));return s}}function xh(r){const t=r.length;t>2&&r[t-1].equals(r[0])&&r.pop()}function vh(r,t){for(let e=0;e<t.length;e++)r.push(t[e].x),r.push(t[e].y)}class Kl extends we{constructor(t=new Du([new ot(.5,.5),new ot(-.5,.5),new ot(-.5,-.5),new ot(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const i=this,n=[],s=[];for(let o=0,l=t.length;o<l;o++){const c=t[o];a(c)}this.setAttribute("position",new Qt(n,3)),this.setAttribute("uv",new Qt(s,2)),this.computeVertexNormals();function a(o){const l=[],c=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,f=e.depth!==void 0?e.depth:1;let u=e.bevelEnabled!==void 0?e.bevelEnabled:!0,d=e.bevelThickness!==void 0?e.bevelThickness:.2,m=e.bevelSize!==void 0?e.bevelSize:d-.1,v=e.bevelOffset!==void 0?e.bevelOffset:0,g=e.bevelSegments!==void 0?e.bevelSegments:3;const p=e.extrudePath,M=e.UVGenerator!==void 0?e.UVGenerator:Lx;let w,x=!1,y,b,_,E;p&&(w=p.getSpacedPoints(h),x=!0,u=!1,y=p.computeFrenetFrames(h,!1),b=new z,_=new z,E=new z),u||(g=0,d=0,m=0,v=0);const T=o.extractPoints(c);let S=T.shape;const R=T.holes;if(!ur.isClockWise(S)){S=S.reverse();for(let X=0,J=R.length;X<J;X++){const D=R[X];ur.isClockWise(D)&&(R[X]=D.reverse())}}const L=ur.triangulateShape(S,R),B=S;for(let X=0,J=R.length;X<J;X++){const D=R[X];S=S.concat(D)}function W(X,J,D){return J||console.error("THREE.ExtrudeGeometry: vec does not exist"),X.clone().addScaledVector(J,D)}const U=S.length,q=L.length;function V(X,J,D){let It,ct,bt;const ft=X.x-J.x,Bt=X.y-J.y,gt=D.x-X.x,P=D.y-X.y,A=ft*ft+Bt*Bt,Y=ft*P-Bt*gt;if(Math.abs(Y)>Number.EPSILON){const it=Math.sqrt(A),lt=Math.sqrt(gt*gt+P*P),nt=J.x-Bt/it,Ut=J.y+ft/it,Mt=D.x-P/lt,At=D.y+gt/lt,ae=((Mt-nt)*P-(At-Ut)*gt)/(ft*P-Bt*gt);It=nt+ft*ae-X.x,ct=Ut+Bt*ae-X.y;const ht=It*It+ct*ct;if(ht<=2)return new ot(It,ct);bt=Math.sqrt(ht/2)}else{let it=!1;ft>Number.EPSILON?gt>Number.EPSILON&&(it=!0):ft<-Number.EPSILON?gt<-Number.EPSILON&&(it=!0):Math.sign(Bt)===Math.sign(P)&&(it=!0),it?(It=-Bt,ct=ft,bt=Math.sqrt(A)):(It=ft,ct=Bt,bt=Math.sqrt(A/2))}return new ot(It/bt,ct/bt)}const rt=[];for(let X=0,J=B.length,D=J-1,It=X+1;X<J;X++,D++,It++)D===J&&(D=0),It===J&&(It=0),rt[X]=V(B[X],B[D],B[It]);const et=[];let mt,Ct=rt.concat();for(let X=0,J=R.length;X<J;X++){const D=R[X];mt=[];for(let It=0,ct=D.length,bt=ct-1,ft=It+1;It<ct;It++,bt++,ft++)bt===ct&&(bt=0),ft===ct&&(ft=0),mt[It]=V(D[It],D[bt],D[ft]);et.push(mt),Ct=Ct.concat(mt)}for(let X=0;X<g;X++){const J=X/g,D=d*Math.cos(J*Math.PI/2),It=m*Math.sin(J*Math.PI/2)+v;for(let ct=0,bt=B.length;ct<bt;ct++){const ft=W(B[ct],rt[ct],It);$(ft.x,ft.y,-D)}for(let ct=0,bt=R.length;ct<bt;ct++){const ft=R[ct];mt=et[ct];for(let Bt=0,gt=ft.length;Bt<gt;Bt++){const P=W(ft[Bt],mt[Bt],It);$(P.x,P.y,-D)}}}const Z=m+v;for(let X=0;X<U;X++){const J=u?W(S[X],Ct[X],Z):S[X];x?(_.copy(y.normals[0]).multiplyScalar(J.x),b.copy(y.binormals[0]).multiplyScalar(J.y),E.copy(w[0]).add(_).add(b),$(E.x,E.y,E.z)):$(J.x,J.y,0)}for(let X=1;X<=h;X++)for(let J=0;J<U;J++){const D=u?W(S[J],Ct[J],Z):S[J];x?(_.copy(y.normals[X]).multiplyScalar(D.x),b.copy(y.binormals[X]).multiplyScalar(D.y),E.copy(w[X]).add(_).add(b),$(E.x,E.y,E.z)):$(D.x,D.y,f/h*X)}for(let X=g-1;X>=0;X--){const J=X/g,D=d*Math.cos(J*Math.PI/2),It=m*Math.sin(J*Math.PI/2)+v;for(let ct=0,bt=B.length;ct<bt;ct++){const ft=W(B[ct],rt[ct],It);$(ft.x,ft.y,f+D)}for(let ct=0,bt=R.length;ct<bt;ct++){const ft=R[ct];mt=et[ct];for(let Bt=0,gt=ft.length;Bt<gt;Bt++){const P=W(ft[Bt],mt[Bt],It);x?$(P.x,P.y+w[h-1].y,w[h-1].x+D):$(P.x,P.y,f+D)}}}k(),Q();function k(){const X=n.length/3;if(u){let J=0,D=U*J;for(let It=0;It<q;It++){const ct=L[It];ut(ct[2]+D,ct[1]+D,ct[0]+D)}J=h+g*2,D=U*J;for(let It=0;It<q;It++){const ct=L[It];ut(ct[0]+D,ct[1]+D,ct[2]+D)}}else{for(let J=0;J<q;J++){const D=L[J];ut(D[2],D[1],D[0])}for(let J=0;J<q;J++){const D=L[J];ut(D[0]+U*h,D[1]+U*h,D[2]+U*h)}}i.addGroup(X,n.length/3-X,0)}function Q(){const X=n.length/3;let J=0;st(B,J),J+=B.length;for(let D=0,It=R.length;D<It;D++){const ct=R[D];st(ct,J),J+=ct.length}i.addGroup(X,n.length/3-X,1)}function st(X,J){let D=X.length;for(;--D>=0;){const It=D;let ct=D-1;ct<0&&(ct=X.length-1);for(let bt=0,ft=h+g*2;bt<ft;bt++){const Bt=U*bt,gt=U*(bt+1),P=J+It+Bt,A=J+ct+Bt,Y=J+ct+gt,it=J+It+gt;Rt(P,A,Y,it)}}}function $(X,J,D){l.push(X),l.push(J),l.push(D)}function ut(X,J,D){Pt(X),Pt(J),Pt(D);const It=n.length/3,ct=M.generateTopUV(i,n,It-3,It-2,It-1);Vt(ct[0]),Vt(ct[1]),Vt(ct[2])}function Rt(X,J,D,It){Pt(X),Pt(J),Pt(It),Pt(J),Pt(D),Pt(It);const ct=n.length/3,bt=M.generateSideWallUV(i,n,ct-6,ct-3,ct-2,ct-1);Vt(bt[0]),Vt(bt[1]),Vt(bt[3]),Vt(bt[1]),Vt(bt[2]),Vt(bt[3])}function Pt(X){n.push(l[X*3+0]),n.push(l[X*3+1]),n.push(l[X*3+2])}function Vt(X){s.push(X.x),s.push(X.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,i=this.parameters.options;return Ix(e,i,t)}static fromJSON(t,e){const i=[];for(let s=0,a=t.shapes.length;s<a;s++){const o=e[t.shapes[s]];i.push(o)}const n=t.options.extrudePath;return n!==void 0&&(t.options.extrudePath=new Tl[n.type]().fromJSON(n)),new Kl(i,t.options)}}const Lx={generateTopUV:function(r,t,e,i,n){const s=t[e*3],a=t[e*3+1],o=t[i*3],l=t[i*3+1],c=t[n*3],h=t[n*3+1];return[new ot(s,a),new ot(o,l),new ot(c,h)]},generateSideWallUV:function(r,t,e,i,n,s){const a=t[e*3],o=t[e*3+1],l=t[e*3+2],c=t[i*3],h=t[i*3+1],f=t[i*3+2],u=t[n*3],d=t[n*3+1],m=t[n*3+2],v=t[s*3],g=t[s*3+1],p=t[s*3+2];return Math.abs(o-h)<Math.abs(a-c)?[new ot(a,1-l),new ot(c,1-f),new ot(u,1-m),new ot(v,1-p)]:[new ot(o,1-l),new ot(h,1-f),new ot(d,1-m),new ot(g,1-p)]}};function Ix(r,t,e){if(e.shapes=[],Array.isArray(r))for(let i=0,n=r.length;i<n;i++){const s=r[i];e.shapes.push(s.uuid)}else e.shapes.push(r.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class Ss extends Zl{constructor(t=1,e=0){const i=(1+Math.sqrt(5))/2,n=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],s=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(n,s,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Ss(t.radius,t.detail)}}class _r extends we{constructor(t=.5,e=1,i=32,n=1,s=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:i,phiSegments:n,thetaStart:s,thetaLength:a},i=Math.max(3,i),n=Math.max(1,n);const o=[],l=[],c=[],h=[];let f=t;const u=(e-t)/n,d=new z,m=new ot;for(let v=0;v<=n;v++){for(let g=0;g<=i;g++){const p=s+g/i*a;d.x=f*Math.cos(p),d.y=f*Math.sin(p),l.push(d.x,d.y,d.z),c.push(0,0,1),m.x=(d.x/e+1)/2,m.y=(d.y/e+1)/2,h.push(m.x,m.y)}f+=u}for(let v=0;v<n;v++){const g=v*(i+1);for(let p=0;p<i;p++){const M=p+g,w=M,x=M+i+1,y=M+i+2,b=M+1;o.push(w,x,b),o.push(x,y,b)}}this.setIndex(o),this.setAttribute("position",new Qt(l,3)),this.setAttribute("normal",new Qt(c,3)),this.setAttribute("uv",new Qt(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new _r(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class Oi extends we{constructor(t=1,e=32,i=16,n=0,s=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:i,phiStart:n,phiLength:s,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),i=Math.max(2,Math.floor(i));const l=Math.min(a+o,Math.PI);let c=0;const h=[],f=new z,u=new z,d=[],m=[],v=[],g=[];for(let p=0;p<=i;p++){const M=[],w=p/i;let x=0;p===0&&a===0?x=.5/e:p===i&&l===Math.PI&&(x=-.5/e);for(let y=0;y<=e;y++){const b=y/e;f.x=-t*Math.cos(n+b*s)*Math.sin(a+w*o),f.y=t*Math.cos(a+w*o),f.z=t*Math.sin(n+b*s)*Math.sin(a+w*o),m.push(f.x,f.y,f.z),u.copy(f).normalize(),v.push(u.x,u.y,u.z),g.push(b+x,1-w),M.push(c++)}h.push(M)}for(let p=0;p<i;p++)for(let M=0;M<e;M++){const w=h[p][M+1],x=h[p][M],y=h[p+1][M],b=h[p+1][M+1];(p!==0||a>0)&&d.push(w,x,b),(p!==i-1||l<Math.PI)&&d.push(x,y,b)}this.setIndex(d),this.setAttribute("position",new Qt(m,3)),this.setAttribute("normal",new Qt(v,3)),this.setAttribute("uv",new Qt(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Oi(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class Ts extends we{constructor(t=1,e=.4,i=12,n=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:n,arc:s},i=Math.floor(i),n=Math.floor(n);const a=[],o=[],l=[],c=[],h=new z,f=new z,u=new z;for(let d=0;d<=i;d++)for(let m=0;m<=n;m++){const v=m/n*s,g=d/i*Math.PI*2;f.x=(t+e*Math.cos(g))*Math.cos(v),f.y=(t+e*Math.cos(g))*Math.sin(v),f.z=e*Math.sin(g),o.push(f.x,f.y,f.z),h.x=t*Math.cos(v),h.y=t*Math.sin(v),u.subVectors(f,h).normalize(),l.push(u.x,u.y,u.z),c.push(m/n),c.push(d/i)}for(let d=1;d<=i;d++)for(let m=1;m<=n;m++){const v=(n+1)*d+m-1,g=(n+1)*(d-1)+m-1,p=(n+1)*(d-1)+m,M=(n+1)*d+m;a.push(v,g,M),a.push(g,p,M)}this.setIndex(a),this.setAttribute("position",new Qt(o,3)),this.setAttribute("normal",new Qt(l,3)),this.setAttribute("uv",new Qt(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ts(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class Ux extends ye{static get type(){return"RawShaderMaterial"}constructor(t){super(t),this.isRawShaderMaterial=!0}}class pt extends Kn{static get type(){return"MeshStandardMaterial"}constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new G(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new G(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=cu,this.normalScale=new ot(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Vi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Va extends pe{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new G(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class kx extends Va{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(pe.DEFAULT_UP),this.updateMatrix(),this.groundColor=new G(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Eo=new qt,yh=new z,Mh=new z;class jl{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ot(512,512),this.map=null,this.mapPass=null,this.matrix=new qt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Hl,this._frameExtents=new ot(1,1),this._viewportCount=1,this._viewports=[new Me(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,i=this.matrix;yh.setFromMatrixPosition(t.matrixWorld),e.position.copy(yh),Mh.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Mh),e.updateMatrixWorld(),Eo.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Eo),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Eo)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class Nx extends jl{constructor(){super(new fi(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(t){const e=this.camera,i=_a*2*t.angle*this.focus,n=this.mapSize.width/this.mapSize.height,s=t.distance||e.far;(i!==e.fov||n!==e.aspect||s!==e.far)&&(e.fov=i,e.aspect=n,e.far=s,e.updateProjectionMatrix()),super.updateMatrices(t)}copy(t){return super.copy(t),this.focus=t.focus,this}}class Fx extends Va{constructor(t,e,i=0,n=Math.PI/3,s=0,a=2){super(t,e),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(pe.DEFAULT_UP),this.updateMatrix(),this.target=new pe,this.distance=i,this.angle=n,this.penumbra=s,this.decay=a,this.map=null,this.shadow=new Nx}get power(){return this.intensity*Math.PI}set power(t){this.intensity=t/Math.PI}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.angle=t.angle,this.penumbra=t.penumbra,this.decay=t.decay,this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const bh=new qt,tr=new z,Ao=new z;class Ox extends jl{constructor(){super(new fi(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new ot(4,2),this._viewportCount=6,this._viewports=[new Me(2,1,1,1),new Me(0,1,1,1),new Me(3,1,1,1),new Me(1,1,1,1),new Me(3,0,1,1),new Me(1,0,1,1)],this._cubeDirections=[new z(1,0,0),new z(-1,0,0),new z(0,0,1),new z(0,0,-1),new z(0,1,0),new z(0,-1,0)],this._cubeUps=[new z(0,1,0),new z(0,1,0),new z(0,1,0),new z(0,1,0),new z(0,0,1),new z(0,0,-1)]}updateMatrices(t,e=0){const i=this.camera,n=this.matrix,s=t.distance||i.far;s!==i.far&&(i.far=s,i.updateProjectionMatrix()),tr.setFromMatrixPosition(t.matrixWorld),i.position.copy(tr),Ao.copy(i.position),Ao.add(this._cubeDirections[e]),i.up.copy(this._cubeUps[e]),i.lookAt(Ao),i.updateMatrixWorld(),n.makeTranslation(-tr.x,-tr.y,-tr.z),bh.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(bh)}}class wr extends Va{constructor(t,e,i=0,n=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=n,this.shadow=new Ox}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class Bx extends jl{constructor(){super(new Ba(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class wh extends Va{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(pe.DEFAULT_UP),this.updateMatrix(),this.target=new pe,this.shadow=new Bx}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class Hx{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=Sh(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=Sh();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}function Sh(){return performance.now()}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:ka}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=ka);const ku={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class jn{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const Gx=new Ba(-1,1,1,-1,0,1);class Vx extends we{constructor(){super(),this.setAttribute("position",new Qt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Qt([0,2,0,0,2,0],2))}}const Wx=new Vx;class Ql{constructor(t){this._mesh=new N(Wx,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,Gx)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}}class Cl extends jn{constructor(t,e){super(),this.textureID=e!==void 0?e:"tDiffuse",t instanceof ye?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=xr.clone(t.uniforms),this.material=new ye({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this.fsQuad=new Ql(this.material)}render(t,e,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=i.texture),this.fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class Th extends jn{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,i){const n=t.getContext(),s=t.state;s.buffers.color.setMask(!1),s.buffers.depth.setMask(!1),s.buffers.color.setLocked(!0),s.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),s.buffers.stencil.setTest(!0),s.buffers.stencil.setOp(n.REPLACE,n.REPLACE,n.REPLACE),s.buffers.stencil.setFunc(n.ALWAYS,a,4294967295),s.buffers.stencil.setClear(o),s.buffers.stencil.setLocked(!0),t.setRenderTarget(i),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),s.buffers.color.setLocked(!1),s.buffers.depth.setLocked(!1),s.buffers.color.setMask(!0),s.buffers.depth.setMask(!0),s.buffers.stencil.setLocked(!1),s.buffers.stencil.setFunc(n.EQUAL,1,4294967295),s.buffers.stencil.setOp(n.KEEP,n.KEEP,n.KEEP),s.buffers.stencil.setLocked(!0)}}class Xx extends jn{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}}class qx{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){const i=t.getSize(new ot);this._width=i.width,this._height=i.height,e=new Be(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:ai}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Cl(ku),this.copyPass.material.blending=on,this.clock=new Hx}swapBuffers(){const t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){const e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){t===void 0&&(t=this.clock.getDelta());const e=this.renderer.getRenderTarget();let i=!1;for(let n=0,s=this.passes.length;n<s;n++){const a=this.passes[n];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(n),a.render(this.renderer,this.writeBuffer,this.readBuffer,t,i),a.needsSwap){if(i){const o=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),l.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}Th!==void 0&&(a instanceof Th?i=!0:a instanceof Xx&&(i=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){const e=this.renderer.getSize(new ot);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;const i=this._width*this._pixelRatio,n=this._height*this._pixelRatio;this.renderTarget1.setSize(i,n),this.renderTarget2.setSize(i,n);for(let s=0;s<this.passes.length;s++)this.passes[s].setSize(i,n)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class Yx extends jn{constructor(t,e,i=null,n=null,s=null){super(),this.scene=t,this.camera=e,this.overrideMaterial=i,this.clearColor=n,this.clearAlpha=s,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new G}render(t,e,i){const n=t.autoClear;t.autoClear=!1;let s,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor,t.getClearAlpha())),this.clearAlpha!==null&&(s=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:i),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(s),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),t.autoClear=n}}const Zx={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new G(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class ks extends jn{constructor(t,e,i,n){super(),this.strength=e!==void 0?e:1,this.radius=i,this.threshold=n,this.resolution=t!==void 0?new ot(t.x,t.y):new ot(256,256),this.clearColor=new G(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let s=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new Be(s,a,{type:ai}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let f=0;f<this.nMips;f++){const u=new Be(s,a,{type:ai});u.texture.name="UnrealBloomPass.h"+f,u.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(u);const d=new Be(s,a,{type:ai});d.texture.name="UnrealBloomPass.v"+f,d.texture.generateMipmaps=!1,this.renderTargetsVertical.push(d),s=Math.round(s/2),a=Math.round(a/2)}const o=Zx;this.highPassUniforms=xr.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=n,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new ye({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];const l=[3,5,7,9,11];s=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let f=0;f<this.nMips;f++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(l[f])),this.separableBlurMaterials[f].uniforms.invSize.value=new ot(1/s,1/a),s=Math.round(s/2),a=Math.round(a/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=e,this.compositeMaterial.uniforms.bloomRadius.value=.1;const c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new z(1,1,1),new z(1,1,1),new z(1,1,1),new z(1,1,1),new z(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;const h=ku;this.copyUniforms=xr.clone(h.uniforms),this.blendMaterial=new ye({uniforms:this.copyUniforms,vertexShader:h.vertexShader,fragmentShader:h.fragmentShader,blending:Ps,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new G,this.oldClearAlpha=1,this.basic=new re,this.fsQuad=new Ql(null)}dispose(){for(let t=0;t<this.renderTargetsHorizontal.length;t++)this.renderTargetsHorizontal[t].dispose();for(let t=0;t<this.renderTargetsVertical.length;t++)this.renderTargetsVertical[t].dispose();this.renderTargetBright.dispose();for(let t=0;t<this.separableBlurMaterials.length;t++)this.separableBlurMaterials[t].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(t,e){let i=Math.round(t/2),n=Math.round(e/2);this.renderTargetBright.setSize(i,n);for(let s=0;s<this.nMips;s++)this.renderTargetsHorizontal[s].setSize(i,n),this.renderTargetsVertical[s].setSize(i,n),this.separableBlurMaterials[s].uniforms.invSize.value=new ot(1/i,1/n),i=Math.round(i/2),n=Math.round(n/2)}render(t,e,i,n,s){t.getClearColor(this._oldClearColor),this.oldClearAlpha=t.getClearAlpha();const a=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),s&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=i.texture,t.setRenderTarget(null),t.clear(),this.fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=i.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this.fsQuad.render(t);let o=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this.fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[l].uniforms.direction.value=ks.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[l]),t.clear(),this.fsQuad.render(t),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=ks.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[l]),t.clear(),this.fsQuad.render(t),o=this.renderTargetsVertical[l];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this.fsQuad.render(t),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,s&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(i),this.fsQuad.render(t)),t.setClearColor(this._oldClearColor,this.oldClearAlpha),t.autoClear=a}getSeperableBlurMaterial(t){const e=[];for(let i=0;i<t;i++)e.push(.39894*Math.exp(-.5*i*i/(t*t))/t);return new ye({defines:{KERNEL_RADIUS:t},uniforms:{colorTexture:{value:null},invSize:{value:new ot(.5,.5)},direction:{value:new ot(.5,.5)},gaussianCoefficients:{value:e}},vertexShader:`varying vec2 vUv;
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
				}`})}getCompositeMaterial(t){return new ye({defines:{NUM_MIPS:t},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
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
				}`})}}ks.BlurDirectionX=new ot(1,0);ks.BlurDirectionY=new ot(0,1);const Kx={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class jx extends jn{constructor(){super();const t=Kx;this.uniforms=xr.clone(t.uniforms),this.material=new Ux({name:t.name,uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader}),this.fsQuad=new Ql(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,e,i){this.uniforms.tDiffuse.value=i.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},ce.getTransfer(this._outputColorSpace)===ve&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Zh?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Kh?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===jh?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Il?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Qh?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Jh&&(this.material.defines.NEUTRAL_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}function ki(r,t=!1){const e=r[0].index!==null,i=new Set(Object.keys(r[0].attributes)),n=new Set(Object.keys(r[0].morphAttributes)),s={},a={},o=r[0].morphTargetsRelative,l=new we;let c=0;for(let h=0;h<r.length;++h){const f=r[h];let u=0;if(e!==(f.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const d in f.attributes){if(!i.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+d+'" attribute exists among all geometries, or in none of them.'),null;s[d]===void 0&&(s[d]=[]),s[d].push(f.attributes[d]),u++}if(u!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(o!==f.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const d in f.morphAttributes){if(!n.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;a[d]===void 0&&(a[d]=[]),a[d].push(f.morphAttributes[d])}if(t){let d;if(e)d=f.index.count;else if(f.attributes.position!==void 0)d=f.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,d,h),c+=d}}if(e){let h=0;const f=[];for(let u=0;u<r.length;++u){const d=r[u].index;for(let m=0;m<d.count;++m)f.push(d.getX(m)+h);h+=r[u].attributes.position.count}l.setIndex(f)}for(const h in s){const f=_h(s[h]);if(!f)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,f)}for(const h in a){const f=a[h][0].length;if(f===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let u=0;u<f;++u){const d=[];for(let v=0;v<a[h].length;++v)d.push(a[h][v][u]);const m=_h(d);if(!m)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(m)}}return l}function _h(r){let t,e,i,n=-1,s=0;for(let c=0;c<r.length;++c){const h=r[c];if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=h.normalized),i!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(n===-1&&(n=h.gpuType),n!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;s+=h.count*e}const a=new t(s),o=new Le(a,e,i);let l=0;for(let c=0;c<r.length;++c){const h=r[c];if(h.isInterleavedBufferAttribute){const f=l/e;for(let u=0,d=h.count;u<d;u++)for(let m=0;m<e;m++){const v=h.getComponent(u,m);o.setComponent(u+f,m,v)}}else a.set(h.array,l);l+=h.count*e}return n!==void 0&&(o.gpuType=n),o}const Xe={BLOCKS:26,BLOCK:60,ROAD:20,ASPHALT:14,LANE:3.5,CURB:.15,ISLAND_MARGIN:70,BEACH:30,WORLD_R:1200};Xe.PITCH=Xe.BLOCK+Xe.ROAD;Xe.HALF=Xe.BLOCKS*Xe.PITCH/2;Xe.LAND=Xe.HALF+Xe.ISLAND_MARGIN;Xe.WATER=Xe.LAND+Xe.BEACH;const Ne={WALK:3.2,RUN:7.5,SPRINT:10.5,ACCEL:30,JUMP:6.5,GRAVITY:22,RADIUS:.4,MAX_HEALTH:100,SWIM:2.5,STAMINA_DRAIN:.22,STAMINA_REGEN:.18,EXHAUST_TIME:5},er={MAX:5,DECAY_TIME:[0,25,40,60,90,120],COPS_PER_LEVEL:[0,1,2,4,6,8],COP_SIGHT:70},Eh={LENGTH:480,START:.36},Ah={forward:["KeyW","ArrowUp"],back:["KeyS","ArrowDown"],left:["KeyA","ArrowLeft"],right:["KeyD","ArrowRight"],sprint:["ShiftLeft","ShiftRight"],jump:["Space"],handbrake:["Space"],enter:["KeyF"],interact:["KeyE"],ao:["KeyO"],horn:["KeyH"],camera:["KeyC"],map:["KeyM"],pause:["Escape","KeyP"],radio:["KeyR"],skiptime:["KeyT"],nextWeapon:["KeyQ"],help:["F1"],upscale:["KeyU"]};function di(r=1337){let t=r>>>0;const e=()=>{t|=0,t=t+1831565813|0;let i=Math.imul(t^t>>>15,1|t);return i=i+Math.imul(i^i>>>7,61|i)^i,((i^i>>>14)>>>0)/4294967296};return e.range=(i,n)=>i+(n-i)*e(),e.int=(i,n)=>Math.floor(e.range(i,n+1)),e.pick=i=>i[Math.floor(e()*i.length)],e.chance=i=>e()<i,e}const vt=(r=0,t=1)=>r+Math.random()*(t-r),We=r=>r[Math.floor(Math.random()*r.length)],Yt=(r,t,e)=>r<t?t:r>e?e:r,Ht=(r,t,e)=>r+(t-r)*e,se=(r,t,e,i)=>Ht(r,t,1-Math.exp(-e*i)),ra=(r,t,e)=>{const i=Yt((e-r)/(t-r),0,1);return i*i*(3-2*i)},Es=Math.PI*2;function Nu(r,t,e){let i=((t-r+Math.PI)%Es+Es)%Es-Math.PI;return r+i*e}function Gi(r,t,e,i){return Nu(r,t,1-Math.exp(-e*i))}function Ns(r){return((r+Math.PI)%Es+Es)%Es-Math.PI}function yt(r,t,e,i){const n=r-e,s=t-i;return Math.hypot(n,s)}new z;new z;new z;function As(r){return"$"+Math.max(0,Math.floor(r)).toLocaleString("en-US")}function Qx(r){const t=Math.floor(r*24),e=Math.floor((r*24-t)*60);return`${String(t).padStart(2,"0")}:${String(e).padStart(2,"0")}`}class Jx{constructor(t=24){this.cell=t,this.map=new Map,this.items=[]}key(t,e){return t*73856093^e*19349663}add(t){this.items.push(t);const e=this.cell;for(let i=Math.floor(t.minX/e);i<=Math.floor(t.maxX/e);i++)for(let n=Math.floor(t.minZ/e);n<=Math.floor(t.maxZ/e);n++){const s=this.key(i,n);let a=this.map.get(s);a||(a=[],this.map.set(s,a)),a.push(t)}}query(t,e,i,n,s=[]){s.length=0;const a=this.cell;for(let o=Math.floor(t/a);o<=Math.floor(e/a);o++)for(let l=Math.floor(i/a);l<=Math.floor(n/a);l++){const c=this.map.get(this.key(o,l));if(c)for(const h of c)!h.disabled&&h.maxX>=t&&h.minX<=e&&h.maxZ>=i&&h.minZ<=n&&!s.includes(h)&&s.push(h)}return s}}const Fs=[];function Da(r,t,e,i=1/0,n=0){let s=null;r.query(t.x-e,t.x+e,t.z-e,t.z+e,Fs);for(let a=0;a<3;a++){let o=!1;for(const l of Fs){if(l.minY!==void 0&&(n>l.maxY||n+1.6<l.minY))continue;const c=Math.max(l.minX,Math.min(t.x,l.maxX)),h=Math.max(l.minZ,Math.min(t.z,l.maxZ));let f=t.x-c,u=t.z-h,d=f*f+u*u;if(!(d>=e*e))if(s=l,o=!0,d<1e-8){const m=t.x-l.minX,v=l.maxX-t.x,g=t.z-l.minZ,p=l.maxZ-t.z,M=Math.min(m,v,g,p);M===m?t.x=l.minX-e:M===v?t.x=l.maxX+e:M===g?t.z=l.minZ-e:t.z=l.maxZ+e}else{const m=Math.sqrt(d),v=e-m;t.x+=f/m*v,t.z+=u/m*v}}if(!o)break}return s}function La(r,t,e,i,n,s,a){const o=t+i*s,l=e+n*s;r.query(Math.min(t,o),Math.max(t,o),Math.min(e,l),Math.max(e,l),Fs);let c=1/0,h=null;for(const f of Fs){let u=0,d=s;if(Math.abs(i)<1e-9){if(t<f.minX||t>f.maxX)continue}else{let m=(f.minX-t)/i,v=(f.maxX-t)/i;m>v&&([m,v]=[v,m]),u=Math.max(u,m),d=Math.min(d,v)}if(Math.abs(n)<1e-9){if(e<f.minZ||e>f.maxZ)continue}else{let m=(f.minZ-e)/n,v=(f.maxZ-e)/n;m>v&&([m,v]=[v,m]),u=Math.max(u,m),d=Math.min(d,v)}d>=u&&u<c&&(!a||a(f,u))&&(c=u,h=f)}return{t:c,box:h}}const Co=[];function Ch(r,t,e,i){const n=Math.cos(t.heading),s=Math.sin(t.heading),a=s,o=n,l=n,c=-s;Co.length=0;for(const[u,d]of[[1,1],[1,-1],[-1,1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1],[.5,1],[.5,-1],[-.5,1],[-.5,-1]])Co.push([t.x+a*e*u+l*i*d,t.z+o*e*u+c*i*d]);const h=Math.hypot(e,i);r.query(t.x-h,t.x+h,t.z-h,t.z+h,Fs);let f=null;for(const u of Fs)if(!(u.minY!==void 0&&u.minY>1)&&!(t.y!==void 0&&u.maxY!==void 0&&u.maxY<=t.y+.6))for(const[d,m]of Co){if(d<u.minX||d>u.maxX||m<u.minZ||m>u.maxZ)continue;const v=d-u.minX,g=u.maxX-d,p=m-u.minZ,M=u.maxZ-m,w=Math.min(v,g,p,M);let x=0,y=0;w===v?x=-1:w===g?x=1:w===p?y=-1:y=1,(!f||w>f.depth)&&(f={nx:x,nz:y,depth:w,box:u})}return f&&(t.x+=f.nx*(f.depth+.02),t.z+=f.nz*(f.depth+.02)),f}function Ze(r,t){const e=document.createElement("canvas");return e.width=r,e.height=t,e}function Ke(r,t=!0,e=!0){const i=new vr(r);return i.wrapS=i.wrapT=t?Is:Tn,i.anisotropy=8,e&&(i.colorSpace=ri),i.generateMipmaps=!0,i.minFilter=_n,i}function Xi(r,t,e,i,n){const s=r.getImageData(0,0,t,e),a=s.data;for(let o=0;o<a.length;o+=4){const l=(n()-.5)*i;a[o]+=l,a[o+1]+=l,a[o+2]+=l}r.putImageData(s,0,0)}function $x(r,t){const e=di(t),i=256,n=4,s=4,a=Ze(i,i),o=a.getContext("2d"),l=Ze(i,i),c=l.getContext("2d");c.fillStyle="#000",c.fillRect(0,0,i,i);const h=i/n,f=i/s,u={glass:{wall:["#44556a","#3c4d60","#4d6076"],win:["#7fa6c8","#6d94b8","#93b6d4"],frame:"#1a2430",wx:.06,wy:.06,ww:.88,wh:.88},concrete:{wall:["#8a8378","#9a9388","#7d776d"],win:["#2b3440","#22303d","#334252"],frame:"#4a463f",wx:.22,wy:.24,ww:.56,wh:.5},brick:{wall:["#7a4a3a","#8a5545","#6e4234"],win:["#1f2a33","#2a3540","#1b252e"],frame:"#d8d0c0",wx:.25,wy:.2,ww:.5,wh:.55},tower:{wall:["#c9cdd3","#bcc1c8","#d3d7dc"],win:["#354a5e","#2e4356","#41576c"],frame:"#2a2f36",wx:.12,wy:.14,ww:.76,wh:.66},house:{wall:["#d9c6a5","#c8b08b","#e2d3b8"],win:["#243241","#2c3c4c","#1e2b38"],frame:"#f2efe8",wx:.3,wy:.28,ww:.4,wh:.44},industrial:{wall:["#6d7378","#767c81","#62686d"],win:["#3a4650","#31404a","#42505a"],frame:"#40464b",wx:.15,wy:.4,ww:.7,wh:.25},deco:{wall:["#f2d8d8","#d8ecf2","#f6ecc8","#e8d5e8"],win:["#20303e","#1c2c38","#2a3c48"],frame:"#f8f8f2",wx:.08,wy:.3,ww:.84,wh:.4},brownstone:{wall:["#5a3226","#4e2c22","#63402e"],win:["#1c2733","#222f3c","#182230"],frame:"#cfc4ae",wx:.3,wy:.12,ww:.4,wh:.72}},d=u[r]||u.concrete;o.fillStyle=d.wall[0],o.fillRect(0,0,i,i);for(let m=0;m<400;m++)o.fillStyle=e.pick(d.wall),o.globalAlpha=.25,o.fillRect(e()*i,e()*i,e()*30,e()*8);if(o.globalAlpha=1,r==="brick"){o.strokeStyle="rgba(0,0,0,0.25)",o.lineWidth=1;for(let m=0;m<i;m+=6)o.beginPath(),o.moveTo(0,m),o.lineTo(i,m),o.stroke();for(let m=0;m<i;m+=6)for(let v=m/6%2*8;v<i;v+=16)o.beginPath(),o.moveTo(v,m),o.lineTo(v,m+6),o.stroke()}if(r==="glass"||r==="tower"){o.fillStyle="rgba(0,0,0,0.35)";for(let m=0;m<s;m++)o.fillRect(0,m*f,i,3)}for(let m=0;m<s;m++)for(let v=0;v<n;v++){const g=v*h+d.wx*h,p=m*f+d.wy*f,M=d.ww*h,w=d.wh*f;o.fillStyle=d.frame,o.fillRect(g-2,p-2,M+4,w+4);const x=o.createLinearGradient(g,p,g+M,p+w),y=e.pick(d.win);if(x.addColorStop(0,y),x.addColorStop(1,"#0d141b"),o.fillStyle=x,o.fillRect(g,p,M,w),o.fillStyle="rgba(255,255,255,0.10)",o.fillRect(g+M*.1,p,M*.18,w),r!=="glass"&&(o.fillStyle=d.frame,o.fillRect(g+M/2-1,p,2,w),o.fillRect(g,p+w/2-1,M,2)),e()<.45){const b=e.pick(["#ffd9a0","#ffe7c2","#d8e6ff","#fff2d6","#ffcf80"]);c.fillStyle=b,c.globalAlpha=.35+e()*.45,c.fillRect(g,p,M,w),c.globalAlpha=1,e()<.4&&(c.fillStyle="#000",c.globalAlpha=.6,c.fillRect(g+M/2,p,M/2,w),c.globalAlpha=1)}}return Xi(o,i,i,18,e),{map:Ke(a),emissiveMap:Ke(l)}}function t1(){const t=Ze(256,256),e=t.getContext("2d");e.fillStyle="#33363b",e.fillRect(0,0,256,256);for(let i=0;i<1500;i++)e.fillStyle=`rgba(${Math.random()<.5?0:255},${Math.random()<.5?0:255},${Math.random()<.5?0:255},0.05)`,e.fillRect(Math.random()*256,Math.random()*256,2,2);return e.strokeStyle="#d6b23a",e.lineWidth=10,e.beginPath(),e.arc(256/2,256/2,256/2-16,0,Math.PI*2),e.stroke(),e.fillStyle="#e8e8e2",e.font=`bold ${256*.52}px Arial, sans-serif`,e.textAlign="center",e.textBaseline="middle",e.fillText("H",256/2,256/2+256*.03),Ke(t)}const e1=[{bg:"#0d1b2a",fg:"#2df0ff",text:"VICE",sub:"NEON NIGHTS"},{bg:"#141414",fg:"#ffd24a",text:"LIBERTY",sub:"BIG APPLE AUTO"},{bg:"#3a1420",fg:"#ff7eb6",text:"FABLE",sub:"SUNSET STRIP"},{bg:"#0a2a1a",fg:"#7dff9a",text:"BURGER SHOT",sub:"GO LARGE"},{bg:"#1a1a2a",fg:"#ff6a2d",text:"AMMU-NATION",sub:"PROTECT YOURSELF"}];function Rh(r=1){const t=di(r),e=t.pick(e1),i=512,n=256,s=Ze(i,n),a=s.getContext("2d");return a.fillStyle=e.bg,a.fillRect(0,0,i,n),a.strokeStyle=e.fg,a.lineWidth=6,a.strokeRect(10,10,i-20,n-20),a.fillStyle=e.fg,a.textAlign="center",a.font="bold 84px Impact, Arial Narrow, sans-serif",a.shadowColor=e.fg,a.shadowBlur=24,a.fillText(e.text,i/2,n/2+10),a.shadowBlur=0,a.font="bold 34px Arial, sans-serif",a.fillText(e.sub,i/2,n-44),Xi(a,i,n,12,t),Ke(s)}function i1(r){const t=di(r),e=128,i=Ze(e,e),n=i.getContext("2d");n.fillStyle="#4b4a48",n.fillRect(0,0,e,e);for(let s=0;s<300;s++)n.fillStyle=`rgba(${t()<.5?0:255},${t()<.5?0:255},${t()<.5?0:255},0.05)`,n.fillRect(t()*e,t()*e,t()*12,t()*12);return Xi(n,e,e,24,t),Ke(i)}function n1(r=7){const t=di(r),e=512,i=512,n=Ze(e,i),s=n.getContext("2d"),a=Ze(e,i),o=a.getContext("2d");s.fillStyle="#33363b",s.fillRect(0,0,e,i),o.fillStyle="#f0f0f0",o.fillRect(0,0,e,i);const l=e/14;for(let c=0;c<3;c++){const h=t()*e*.7,f=t()*i*.8,u=60+t()*120,d=40+t()*90;s.fillStyle="rgba(34,36,40,0.9)",s.fillRect(h,f,u,d),s.strokeStyle="#17181a",s.lineWidth=3,s.strokeRect(h,f,u,d),o.fillStyle="#e2e2e2",o.fillRect(h,f,u,d)}for(const c of[1.75,5.25,8.75,12.25])for(let h=0;h<5;h++){const f=t()*i,u=12+t()*26,d=s.createRadialGradient(c*l,f,0,c*l,f,u);d.addColorStop(0,"rgba(12,13,15,0.4)"),d.addColorStop(1,"rgba(0,0,0,0)"),s.fillStyle=d,s.fillRect(c*l-u,f-u,u*2,u*2);const m=o.createRadialGradient(c*l,f,0,c*l,f,u);m.addColorStop(0,"rgba(70,70,70,0.85)"),m.addColorStop(1,"rgba(0,0,0,0)"),o.fillStyle=m,o.fillRect(c*l-u,f-u,u*2,u*2)}s.fillStyle="rgba(214,178,58,0.88)",s.fillRect(e/2-l*.25,0,l*.12,i),s.fillRect(e/2+l*.13,0,l*.12,i),o.fillStyle="#a8a8a8",o.fillRect(e/2-l*.25,0,l*.12,i),o.fillRect(e/2+l*.13,0,l*.12,i),s.fillStyle="rgba(217,217,210,0.85)";for(const c of[3.5,10.5])for(let h=0;h<i;h+=i/2)s.fillRect(c*l-l*.06,h+i*.1,l*.12,i*.28);for(const c of[3.5,10.5])for(let h=0;h<i;h+=i/2)o.fillRect(c*l-l*.06,h+i*.1,l*.12,i*.28);o.fillStyle="rgba(168,168,168,1)",s.fillStyle="rgba(230,230,220,0.75)",s.fillRect(l*.2,0,l*.1,i),s.fillRect(e-l*.3,0,l*.1,i);for(let c=0;c<9e3;c++){const h=t.chance(.5);s.fillStyle=h?"rgba(255,255,255,0.05)":"rgba(0,0,0,0.09)",s.fillRect(t()*e,t()*i,1+t()*2,1+t()*2)}for(let c=0;c<500;c++)s.fillStyle="rgba(200,200,195,0.16)",s.fillRect(t()*e,t()*i,2,2);s.strokeStyle="#17181a",s.lineWidth=1.5;for(let c=0;c<3;c++){let h=t()*e,f=t()*i;s.beginPath(),s.moveTo(h,f);for(let u=0;u<26;u++)h+=(t()-.5)*26,f+=t()*18,s.lineTo(h,f);s.stroke()}for(let c=0;c<2;c++){const h=t()*i;s.strokeStyle="rgba(20,20,22,0.8)",s.lineWidth=3,s.beginPath();for(let f=0;f<=e;f+=16)s.lineTo(f,h+Math.sin(f*.03+c*2)*5);s.stroke()}s.fillStyle="rgba(0,0,0,0.10)";for(const c of[1.1,2.5,4.6,6,8,9.4,11.5,12.9])s.fillRect(c*l-l*.25,0,l*.5,i);return Xi(s,e,i,12,t),{map:Ke(n),roughnessMap:Ke(a,!0,!1)}}function s1(r=8){const t=di(r),e=256,i=Ze(e,e),n=i.getContext("2d"),s=Ze(e,e),a=s.getContext("2d");n.fillStyle="#2d2f33",n.fillRect(0,0,e,e),a.fillStyle="#f0f0f0",a.fillRect(0,0,e,e);for(let o=0;o<3e3;o++)n.fillStyle=t.chance(.5)?"rgba(255,255,255,0.05)":"rgba(0,0,0,0.09)",n.fillRect(t()*e,t()*e,1+t()*2,1+t()*2);for(let o=0;o<4;o++){const l=t()*e,c=t()*e,h=10+t()*22,f=n.createRadialGradient(l,c,0,l,c,h);f.addColorStop(0,"rgba(12,13,15,0.45)"),f.addColorStop(1,"rgba(0,0,0,0)"),n.fillStyle=f,n.fillRect(l-h,c-h,h*2,h*2);const u=a.createRadialGradient(l,c,0,l,c,h);u.addColorStop(0,"rgba(70,70,70,0.85)"),u.addColorStop(1,"rgba(0,0,0,0)"),a.fillStyle=u,a.fillRect(l-h,c-h,h*2,h*2)}return Xi(n,e,e,12,t),{map:Ke(i),roughnessMap:Ke(s,!0,!1)}}function r1(){const t=Ze(256,256),e=t.getContext("2d");e.clearRect(0,0,256,256),e.fillStyle="rgba(235,235,225,0.85)";for(let n=8;n<256;n+=32)e.fillRect(n,0,18,256);return Ke(t,!1)}function a1(r=9){const t=di(r),e=256,i=Ze(e,e),n=i.getContext("2d");n.fillStyle="#a8a49c",n.fillRect(0,0,e,e),n.strokeStyle="rgba(0,0,0,0.28)",n.lineWidth=3;for(let s=0;s<=2;s++)n.beginPath(),n.moveTo(s*e/2,0),n.lineTo(s*e/2,e),n.stroke(),n.beginPath(),n.moveTo(0,s*e/2),n.lineTo(e,s*e/2),n.stroke();for(let s=0;s<2e3;s++)n.fillStyle=`rgba(0,0,0,${t()*.08})`,n.fillRect(t()*e,t()*e,2,2);return Xi(n,e,e,16,t),Ke(i)}function Ph(r=10){const t=di(r),e=256,i=Ze(e,e),n=i.getContext("2d");n.fillStyle="#2e4a1e",n.fillRect(0,0,e,e);for(let a=0;a<10;a++){const o=t()*e,l=t()*e,c=24+t()*60,h=n.createRadialGradient(o,l,0,o,l,c);h.addColorStop(0,t.pick(["#3a5c24","#476e2a","#557f3222","#6b8a2f22"])),h.addColorStop(1,"rgba(0,0,0,0)"),n.fillStyle=h,n.fillRect(o-c,l-c,c*2,c*2)}const s=["#4f8a2e","#5f9a38","#6fa544","#7fb04e","#8fbf58","#3f7326","#a8b04c"];n.lineWidth=1;for(let a=0;a<12e3;a++){const o=t()*e,l=t()*e,c=4+t()*9,h=(t()-.5)*2.2+(t.chance(.5)?.5:-.5);n.strokeStyle=t.chance(.07)?"#b0a852":t.pick(s),n.globalAlpha=.55+t()*.45,n.beginPath(),n.moveTo(o,l),n.lineTo(o+Math.sin(h)*c,l-Math.cos(h)*c),n.stroke()}n.globalAlpha=1;for(let a=0;a<420;a++){const o=t()*e,l=t()*e;n.fillStyle=t.pick(["#5da244","#6cb04e","#54963c"]);for(let c=0;c<3;c++){const h=t()*6.28;n.beginPath(),n.arc(o+Math.cos(h)*2.2,l+Math.sin(h)*2.2,1.6+t(),0,6.29),n.fill()}}return Xi(n,e,e,10,t),Ke(i)}function o1(r=22){const t=di(r),e=512,i=Ze(e,e),n=i.getContext("2d");n.fillStyle="#8a6f4b",n.fillRect(0,0,e,e);for(let s=0;s<14;s++){const a=t()*e,o=t()*e,l=40+t()*110,c=n.createRadialGradient(a,o,0,a,o,l);c.addColorStop(0,t.pick(["#93765a44","#7d624044","#9a7d5544","#6e563c44"])),c.addColorStop(1,"rgba(0,0,0,0)"),n.fillStyle=c,n.fillRect(a-l,o-l,l*2,l*2)}for(let s=0;s<16e3;s++)n.fillStyle=t.chance(.5)?"rgba(60,45,28,0.25)":"rgba(210,185,140,0.22)",n.fillRect(t()*e,t()*e,1+t()*2,1+t()*2);for(let s=0;s<260;s++){const a=t()*e,o=t()*e,l=1.5+t()*t()*5,c=t.pick(["#cfc4b2","#bfb49e","#8f8574","#6e6558","#3c352c","#e2d9c8"]);n.fillStyle="rgba(30,22,14,0.55)",n.beginPath(),n.ellipse(a+l*.3,o+l*.45,l,l*.8,0,0,6.29),n.fill(),n.fillStyle=c,n.beginPath(),n.ellipse(a,o,l,l*.85,t()*3,0,6.29),n.fill(),n.fillStyle="rgba(255,250,235,0.5)",n.beginPath(),n.ellipse(a-l*.25,o-l*.3,l*.4,l*.3,0,0,6.29),n.fill()}n.lineWidth=1.4;for(let s=0;s<46;s++){const a=t()*e,o=t()*e,l=t()*6.28,c=6+t()*22;n.strokeStyle=t.chance(.3)?"#c2a95e":t.pick(["#4a3826","#5d4a30","#3a2c1e"]),n.globalAlpha=.8,n.beginPath(),n.moveTo(a,o),n.lineTo(a+Math.cos(l)*c,o+Math.sin(l)*c),n.stroke()}return n.globalAlpha=1,Xi(n,e,e,12,t),Ke(i)}function l1(r=21){const t=di(r),e=256,i=Ze(e,e),n=i.getContext("2d");n.fillStyle="#d4d4d4",n.fillRect(0,0,e,e);for(let a=0;a<10;a++){const o=t()*e,l=t()*e,c=20+t()*60,h=n.createRadialGradient(o,l,0,o,l,c);h.addColorStop(0,t.chance(.5)?"rgba(190,190,190,0.35)":"rgba(232,232,232,0.35)"),h.addColorStop(1,"rgba(0,0,0,0)"),n.fillStyle=h,n.fillRect(o-c,l-c,c*2,c*2)}for(let a=0;a<12e3;a++){const o=150+(t()*90|0);n.fillStyle=`rgb(${o},${o},${o})`,n.fillRect(t()*e,t()*e,1,1)}Xi(n,e,e,8,t);const s=Ke(i);return s.repeat.set(160,160),s}function zh(r=11){const t=di(r),e=512,i=Ze(e,e),n=i.getContext("2d");n.fillStyle="#dfc083",n.fillRect(0,0,e,e);for(let s=0;s<16;s++){const a=t()*e,o=t()*e,l=50+t()*130,c=n.createRadialGradient(a,o,0,a,o,l);c.addColorStop(0,t.pick(["#d4af7233","#ecd09633","#c9a46833","#f2ddab33"])),c.addColorStop(1,"rgba(0,0,0,0)"),n.fillStyle=c,n.fillRect(a-l,o-l,l*2,l*2)}for(let s=0;s<15e3;s++)n.fillStyle=t.pick(["rgba(255,244,220,0.5)","rgba(190,150,100,0.45)","rgba(255,255,255,0.4)","rgba(160,125,80,0.4)"]),n.fillRect(t()*e,t()*e,1,1+t()*1.5);for(let s=0;s<90;s++){const a=t()*e,o=t()*e,l=1+t()*2.4;n.fillStyle="rgba(150,115,75,0.5)",n.beginPath(),n.ellipse(a+.8,o+1,l,l*.7,0,0,6.29),n.fill(),n.fillStyle=t.pick(["#f4e8d2","#e8d6b4","#fff6e4"]),n.beginPath(),n.ellipse(a,o,l,l*.7,t()*3,0,6.29),n.fill()}return Xi(n,e,e,8,t),Ke(i)}function c1(r=31){const e=Ze(256,256),i=e.getContext("2d"),n=di(r),s=[];for(let h=0;h<7;h++)s.push({fx:1+(n()*5|0),fy:1+(n()*5|0),amp:.5+n()*.8,ph:n()*6.28});const a=i.createImageData(256,256),o=a.data,l=Math.PI*2;for(let h=0;h<256;h++)for(let f=0;f<256;f++){let u=0,d=0;for(const g of s){const p=l*(g.fx*f+g.fy*h)/256+g.ph,M=Math.cos(p)*g.amp;u+=M*g.fx,d+=M*g.fy}const m=1/Math.hypot(u*.35,d*.35,1),v=(h*256+f)*4;o[v]=(-u*.35*m*.5+.5)*255,o[v+1]=(-d*.35*m*.5+.5)*255,o[v+2]=m*255,o[v+3]=255}i.putImageData(a,0,0);const c=Ke(e,!0,!1);return c.wrapS=c.wrapT=mr,c}function h1(r=33){const e=Ze(256,256),i=e.getContext("2d"),n=di(r),s=[n()*6.28,n()*6.28,n()*6.28],a=i.createImageData(256,256),o=a.data,l=Math.PI*2;for(let h=0;h<256;h++)for(let f=0;f<256;f++){const u=Math.sin(l*(3*f+2*h)/256+s[0]),d=Math.sin(l*(-2*f+4*h)/256+s[1]),m=Math.sin(l*(5*f-3*h)/256+s[2]),v=Math.pow(Math.abs(u*d*.6+d*m*.4),.35),g=Math.max(0,Math.min(1,v))*255,p=(h*256+f)*4;o[p]=g,o[p+1]=g,o[p+2]=g,o[p+3]=255}i.putImageData(a,0,0);const c=Ke(e,!0,!1);return c.wrapS=c.wrapT=mr,c}function Rl(){const t=Ze(64,64),e=t.getContext("2d"),i=e.createRadialGradient(64/2,64/2,0,64/2,64/2,64/2);return i.addColorStop(0,"rgba(255,255,255,1)"),i.addColorStop(.4,"rgba(255,255,255,0.6)"),i.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=i,e.fillRect(0,0,64,64),Ke(t,!1,!1)}function u1(){const t=Ze(64,64),e=t.getContext("2d"),i=e.createRadialGradient(64/2,64/2,0,64/2,64/2,64/2);return i.addColorStop(0,"rgba(255,255,255,0.9)"),i.addColorStop(.5,"rgba(255,255,255,0.35)"),i.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=i,e.fillRect(0,0,64,64),Ke(t,!1,!1)}const{PITCH:Lt,ASPHALT:xi,LANE:Dh,CURB:bi,BLOCKS:le,HALF:Xt}=Xe,Re=xi/2,yn=Xe.ROAD/2,Ro=10.5,f1=r=>Dh/2+Dh*r,Jl={regions:[{id:"santos",label:"Santos",x0:15,z0:15,nx:9,nz:9},{id:"ferro",label:"Ferro",x0:1,z0:8,nx:7,nz:7},{id:"venturas",label:"Venturas",x0:16,z0:1,nx:7,nz:6},{id:"carson",label:"Bone County",x0:10,z0:3,nx:2,nz:2}],bridges:[{axis:"x",c:-240,from:-500,to:-220,red:!1},{axis:"x",c:320,from:-500,to:-90,red:!0},{axis:"z",c:160,from:-100,to:170,red:!1},{axis:"z",c:-80,from:-100,to:170,red:!1},{axis:"z",c:240,from:-100,to:170,red:!1}],tunnels:[{axis:"x",c:640,from:-955,to:-310},{axis:"z",c:-800,from:310,to:890}],highV:[{k:15,m0:9,m1:24},{k:16,m0:2,m1:14},{k:12,m0:9,m1:14},{k:11,m0:2,m1:16},{k:3,m0:13,m1:17},{k:8,m0:13,m1:21}],highH:[{j:10,m0:7,m1:12},{j:17,m0:2,m1:15},{j:18,m0:2,m1:15},{j:4,m0:1,m1:10},{j:21,m0:9,m1:15}],parks:[[16,17],[21,19],[3,12],[17,4]],lots:[[17,20],[20,22],[5,9],[20,4]],water:{oceanX:1e3,oceanZ:1060,ellipses:[[-320,-160,70,300],[-300,380,180,180],[1e3,350,110,200]],rivers:[{min:-63,max:-17,x0:-300,x1:1150}],channels:[]},cone:{x:-760,z:640,r:270,h:135},bumps:[{x0:-980,x1:-380,z0:-420,z1:180,amp:1.8},{x0:-340,x1:260,z0:-980,z1:-380,amp:1.1}],hills:[{cx:520,cz:40,rx:360,rz:110,amp:9},{cx:-100,cz:420,rx:240,rz:130,amp:7},{cx:-480,cz:480,rx:170,rz:130,amp:6},{cx:-500,cz:-720,rx:190,rz:100,amp:5},{cx:-700,cz:-100,rx:200,rz:160,amp:8},{cx:-500,cz:50,rx:150,rz:120,amp:6},{cx:-80,cz:10,rx:260,rz:260,amp:2.5},{cx:-430,cz:720,rx:100,rz:80,amp:4},{cx:-640,cz:360,rx:110,rz:90,amp:5},{cx:-550,cz:-800,rx:95,rz:80,amp:13,mesa:!0},{cx:-400,cz:-600,rx:70,rz:60,amp:9,mesa:!0},{cx:0,cz:-700,rx:110,rz:95,amp:14,mesa:!0},{cx:-180,cz:-880,rx:80,rz:70,amp:10,mesa:!0}],rolling:{amp:.9,fx:.021,fz:.017},regionCarveSkip:["ferro"],carves:[{x0:-340,x1:260,z0:-980,z1:-380,f:30}],labels:[["Downtown",500,500],["Eastside",770,500],["Santa Maria Beach",500,930],["Los Santos Airport",280,770],["Ocean Docks",845,440],["Financial",-680,-250],["Easter Basin",-445,0],["The Strip",430,-720],["Venturas Airport",705,-885],["Bone County",-40,-690],["Tierra Robada",-500,-720],["Sunset Hills",520,40],["Red County",-150,60],["Mount Chiliad",-760,640],["Shady Creeks",-680,480]]},d1={regions:[{id:"shoreside",label:"Shoreside",x0:2,z0:10,nx:6,nz:10},{id:"kingsland",label:"Kingsland",x0:10,z0:9,nx:6,nz:11},{id:"harborton",label:"Harborton",x0:18,z0:10,nx:6,nz:10}],bridges:[{axis:"x",c:80,from:-400,to:-240,red:!1},{axis:"x",c:160,from:240,to:400,red:!1,susp:!0},{axis:"z",c:-80,from:-810,to:-630,red:!1}],tunnels:[],highV:[{k:5,m0:10,m1:19},{k:12,m0:9,m1:19},{k:20,m0:10,m1:19}],highH:[{j:14,m0:2,m1:23},{j:15,m0:10,m1:23},{j:4,m0:2,m1:16}],parks:[[10,17],[4,12],[19,12]],lots:[[15,18],[6,17],[18,18]],water:{oceanX:1e3,oceanZ:1060,ellipses:[[950,320,130,200],[-80,-720,150,90]],rivers:[],channels:[{min:-400,max:-240,zMin:-320},{min:240,max:400,zMin:-320}]},cone:null,bumps:[{x0:-560,x1:320,z0:-980,z1:-420,amp:3}],hills:[{cx:-120,cz:-700,rx:280,rz:170,amp:9},{cx:-650,cz:-100,rx:220,rz:180,amp:8},{cx:-500,cz:250,rx:180,rz:150,amp:6}],rolling:{amp:.5,fx:.019,fz:.023},regionCarveSkip:["shoreside"],carves:[{x0:-260,x1:110,z0:-700,z1:-560,f:20}],labels:[["Downtown",-40,200],["Kings Park",-520,360],["Arena",120,-160],["Francis Airport",-720,280],["Garden Suburbs",-640,-40],["The Docks",700,200],["Projects",480,-160],["Old Town",560,200],["Sandy Beach",760,440],["Dam Hills",-80,-700]]},p1={regions:[{id:"mainland",label:"Mainland",x0:3,z0:5,nx:7,nz:13},{id:"starfish",label:"Starfish",x0:12,z0:13,nx:2,nz:2},{id:"prawn",label:"Prawn",x0:12,z0:9,nx:3,nz:2},{id:"beach",label:"Beach",x0:17,z0:5,nx:5,nz:13}],bridges:[{axis:"x",c:-320,from:-260,to:340,red:!1},{axis:"x",c:-80,from:-260,to:340,red:!1},{axis:"x",c:80,from:-260,to:340,red:!1},{axis:"x",c:240,from:-260,to:340,red:!1,susp:!0}],tunnels:[],highV:[{k:6,m0:5,m1:18},{k:19,m0:5,m1:18},{k:12,m0:9,m1:14},{k:14,m0:9,m1:14}],highH:[{j:9,m0:3,m1:21},{j:12,m0:3,m1:21},{j:14,m0:3,m1:21},{j:16,m0:3,m1:21}],parks:[[6,8],[18,8],[12,13]],lots:[[5,15],[19,15],[7,7]],water:{oceanX:1e3,oceanZ:1060,ellipses:[],rivers:[],channels:[{min:-240,max:320,zMin:-640}],islands:[{x0:-100,x1:100,z0:-10,z1:170},{x0:-100,x1:180,z0:-330,z1:-150}]},cone:null,bumps:[],hills:[{cx:600,cz:-100,rx:60,rz:300,amp:1.2}],rolling:{amp:.25,fx:.03,fz:.025},regionCarveSkip:["beach"],carves:[{x0:590,x1:610,z0:370,z1:390,f:15},{x0:295,x1:385,z0:325,z1:340,f:15}],labels:[["Downtown",-480,-80],["Vice Airport",-640,240],["The Docks",-480,320],["Ocean Beach",480,200],["Ocean Drive",400,40],["Star Island",0,80],["Prawn Island",40,-240],["North Beach",480,-480],["South Beach",480,320],["Suburbs",-560,-480]]},m1={fable:Jl,liberty:d1,vice:p1};let Ce=Jl,Ae="fable",fr=null,$l=[];function g1(r,t){fr=r?{v:r,h:t}:null}function x1(r){$l=r||[]}const Lh=new Set(["airport","docks","stadium","beach","lot"]);let Cs=Ce.regions,Rs=Ce.bridges,En=Ce.tunnels,Fu=Ce.highV,Ou=Ce.highH,Bu=Ce.parks,Hu=Ce.lots;function v1(r){Ae=r,Ce=m1[r]||Jl,Cs=Ce.regions,Rs=Ce.bridges,En=Ce.tunnels,Fu=Ce.highV,Ou=Ce.highH,Bu=Ce.parks,Hu=Ce.lots,fr=null,$l=[]}const $i=13,Ni=6.5,Pe=3;function y1(r,t){return Cs.find(e=>r>=e.x0&&r<e.x0+e.nx&&t>=e.z0&&t<e.z0+e.nz)||null}function M1(){const r=[],t=[];for(let s=0;s<=le;s++)r.push(new Array(le).fill(!1)),t.push(new Array(le).fill(!1));const e=(s,a)=>y1(s,a)&&!de(-Xt+(s+.5)*Lt,-Xt+(a+.5)*Lt),i=(s,a)=>de(s,a)||Di(s,a)>4;for(let s=0;s<=le;s++)for(let a=0;a<le;a++){const o=-Xt+s*Lt,l=-Xt+(a+.5)*Lt;!i(o,l)&&(e(s-1,a)||e(s,a)||s%3===0)&&(r[s][a]=!0);const c=-Xt+(a+.5)*Lt,h=-Xt+s*Lt;!i(c,h)&&(e(a,s-1)||e(a,s)||s%3===0)&&(t[s][a]=!0)}for(const s of Fu)for(let a=s.m0;a<=s.m1&&a<le;a++){const o=-Xt+s.k*Lt,l=-Xt+(a+.5)*Lt;i(o,l)||(r[s.k][a]=!0)}for(const s of Ou)for(let a=s.m0;a<=s.m1&&a<le;a++){const o=-Xt+(a+.5)*Lt,l=-Xt+s.j*Lt;i(o,l)||(t[s.j][a]=!0)}const n=s=>{for(const a of s)if(a.axis==="x"){const o=Math.round((a.c+Xt)/Lt);if(o>=0&&o<=le)for(let l=0;l<le;l++){const c=-Xt+(l+.5)*Lt;c>=a.from-1&&c<=a.to+1&&(t[o][l]=!0)}}else{const o=Math.round((a.c+Xt)/Lt);if(o>=0&&o<=le)for(let l=0;l<le;l++){const c=-Xt+(l+.5)*Lt;c>=a.from-1&&c<=a.to+1&&(r[o][l]=!0)}}};return n(Rs),n(En),{roadV:r,roadH:t}}const b1=(r,t,e,i,n,s)=>((r-e)/n)**2+((t-i)/s)**2<1;function de(r,t){const e=Ce.water;if(e.islands){for(const i of e.islands)if(r>=i.x0&&r<=i.x1&&t>=i.z0&&t<=i.z1)return!1}if((Math.abs(r)/e.oceanX)**4+(Math.abs(t)/e.oceanZ)**4>1)return!0;for(const[i,n,s,a]of e.ellipses)if(b1(r,t,i,n,s,a))return!0;for(const i of e.rivers)if(t>i.min&&t<i.max&&r>i.x0&&r<i.x1)return!0;for(const i of e.channels)if(r>i.min&&r<i.max&&t>i.zMin)return!0;return!1}function Di(r,t){for(const n of En)if(n.axis==="x"){if(Math.abs(t-n.c)<=22&&r>=n.from-10&&r<=n.to+10)return 0}else if(Math.abs(r-n.c)<=22&&t>=n.from-10&&t<=n.to+10)return 0;const e=Ce.cone;if(!e)return 0;const i=Math.hypot(r-e.x,t-e.z);return i>=e.r?0:e.h*Math.pow(Math.cos(i/e.r*Math.PI/2),1.4)}function ni(r,t){const e=Di(r,t);if(e>6)return e;const i=e+T1(r,t);if(i===0)return 0;let n;if(fr){n=30;const a=Math.round((r+Xt)/Lt);if(a>=0&&a<=le){const l=Math.max(0,Math.min(le-1,Math.floor((t+Xt)/Lt)));fr.v[a][l]&&(n=Math.min(n,Math.abs(r-(-Xt+a*Lt))))}const o=Math.round((t+Xt)/Lt);if(o>=0&&o<=le){const l=Math.max(0,Math.min(le-1,Math.floor((r+Xt)/Lt)));fr.h[o][l]&&(n=Math.min(n,Math.abs(t-(-Xt+o*Lt))))}}else{const a=((r+Xt)%Lt+Lt)%Lt,o=((t+Xt)%Lt+Lt)%Lt;n=Math.min(Math.min(a,Lt-a),Math.min(o,Lt-o))}const s=Math.min(1,Math.max(0,(n-9)/12));return i*s*s*(3-2*s)}function Ia(r,t,e){const i=Math.min(1,Math.max(0,(e-r)/(t-r)));return i*i*(3-2*i)}function w1(r,t,e,i,n,s){const a=(r-e)/n,o=(t-i)/s,l=a*a+o*o;return l>=4?0:Math.exp(-l*1.6)}function aa(r,t,e,i){const n=Math.min(r-(e.x0-i),e.x1+i-r),s=Math.min(t-(e.z0-i),e.z1+i-t);if(n<=0||s<=0)return 0;const a=Math.min(n,i)/i,o=Math.min(s,i)/i;return Math.min(a*a*(3-2*a),o*o*(3-2*o))}function S1(r,t,e,i,n,s){const a=n-e,o=s-i,l=a*a+o*o;let c=l?((r-e)*a+(t-i)*o)/l:0;return c=Math.min(1,Math.max(0,c)),Math.hypot(r-(e+a*c),t-(i+o*c))}function T1(r,t){let e=0,i=0;for(const c of Ce.hills)if(c.mesa){const h=Math.hypot((r-c.cx)/c.rx,(t-c.cz)/c.rz);h<1&&(i+=c.amp*(1-Ia(.45,1,h)))}else e+=c.amp*w1(r,t,c.cx,c.cz,c.rx,c.rz);const n=Ce.rolling;n&&(e+=n.amp*Math.sin(r*n.fx+1.7)*Math.cos(t*n.fz+.4)+n.amp*.5*Math.sin(r*n.fx*2.7+.5)*Math.sin(t*n.fz*3.1+2.1));for(const c of Ce.bumps)r>c.x0&&r<c.x1&&t>c.z0&&t<c.z1&&(e+=c.amp*Math.sin(r*.011+1.3)*Math.cos(t*.013));if(e===0&&i===0)return 0;let s=0;const a=Ce.regionCarveSkip||[];for(const c of Cs){if(a.includes(c.id))continue;const h={x0:-Xt+c.x0*Lt,x1:-Xt+(c.x0+c.nx)*Lt,z0:-Xt+c.z0*Lt,z1:-Xt+(c.z0+c.nz)*Lt};s=Math.max(s,aa(r,t,h,18))}for(const c of Ce.carves)s=Math.max(s,aa(r,t,c,c.f??25));for(const c of $l)s=Math.max(s,aa(r,t,c,15));for(const c of En){const h=c.axis==="x"?{x0:c.from-10,x1:c.to+10,z0:c.c-30,z1:c.c+30}:{x0:c.c-30,x1:c.c+30,z0:c.from-10,z1:c.to+10};s=Math.max(s,aa(r,t,h,20))}for(const c of Rs){const h=c.axis==="x"?c.from:c.c,f=c.axis==="x"?c.c:c.from,u=c.axis==="x"?c.to:c.c,d=c.axis==="x"?c.c:c.to;s=Math.max(s,1-Ia(24,40,S1(r,t,h,f,u,d)))}if(e*=1-s,e===0&&i===0||de(r,t))return 0;const o=24;if(de(r+o,t)||de(r-o,t)||de(r,t+o)||de(r,t-o))return e*.3+i;const l=48;return de(r+l,t)||de(r-l,t)||de(r,t+l)||de(r,t-l)?e*.7+i:e+i}class Pi{constructor(){this.pos=[],this.nrm=[],this.uv=[],this.col=[],this.idx=[],this.n=0}quad(t,e,i,n,s,a,o,l,c){for(const f of[t,e,i,n])this.pos.push(f[0],f[1],f[2]),this.nrm.push(s,a,o),this.col.push(c.r,c.g,c.b);for(const f of l)this.uv.push(f[0],f[1]);const h=this.n;this.idx.push(h,h+1,h+2,h,h+2,h+3),this.n+=4}boxSides(t,e,i,n,s,a,o,l=3){const c=n-t,h=s-e,f=a-i,u=(d,m)=>[[0,0],[d/l,0],[d/l,m/l],[0,m/l]];this.quad([t,e,a],[n,e,a],[n,s,a],[t,s,a],0,0,1,u(c,h),o),this.quad([n,e,i],[t,e,i],[t,s,i],[n,s,i],0,0,-1,u(c,h),o),this.quad([n,e,a],[n,e,i],[n,s,i],[n,s,a],1,0,0,u(f,h),o),this.quad([t,e,i],[t,e,a],[t,s,a],[t,s,i],-1,0,0,u(f,h),o)}boxTop(t,e,i,n,s,a,o=4){const l=n-t,c=s-i;this.quad([t,e,s],[n,e,s],[n,e,i],[t,e,i],0,1,0,[[0,0],[l/o,0],[l/o,c/o],[0,c/o]],a)}box(t,e,i,n,s,a,o,l=3){this.boxSides(t,e,i,n,s,a,o,l),this.boxTop(t,s,i,n,a,o,l)}build(){if(this.n===0)return null;const t=new we;return t.setAttribute("position",new Qt(this.pos,3)),t.setAttribute("normal",new Qt(this.nrm,3)),t.setAttribute("uv",new Qt(this.uv,2)),t.setAttribute("color",new Qt(this.col,3)),t.setIndex(this.idx),t}}class Ih{constructor(t,e="fable"){v1(e),this.mapId=e,this.scene=t,this.rng=di(20260901),this.hash=new Jx(24),this.roadCoords=[];for(let i=0;i<=le;i++)this.roadCoords.push(-Xt+i*Lt);this.blocks=[],this.blockMap=new Map,this.lamps=[],this.trees=[],this.parkedSpots=[],this.lightHeads=[],this.airports=[],this.group=new be,t.add(this.group),this.buildLayout(),this.buildMask(),this.buildGround(),this.buildRoads(),this.buildBlocks(),this.buildCountryside(),this.buildProps(),this.buildWater()}dispose(){this.scene.remove(this.group),this.group.traverse(t=>{t.geometry&&!t.geometry.userData.shared&&t.geometry.dispose();const e=Array.isArray(t.material)?t.material:[t.material];for(const i of e)if(!(!i||i.userData.shared)){for(const n in i)i[n]?.isTexture&&i[n].dispose();i.dispose()}})}regionAt(t,e){return Cs.find(i=>t>=i.x0&&t<i.x0+i.nx&&e>=i.z0&&e<i.z0+i.nz)||null}blockType(t,e){if(Bu.some(([a,o])=>a===t&&o===e))return"park";if(Hu.some(([a,o])=>a===t&&o===e))return"lot";const i=this.regionAt(t,e);if(!i)return null;const n=t-i.x0,s=e-i.z0;return i.id==="santos"?n<=2&&s>=6?"airport":n>=7&&s>=2&&s<=4?"docks":n===5&&s===1?"stadium":n>=3&&n<=5&&s>=3&&s<=5?"downtown":s===8?"beach":n>=7||s>=7?"residential":"commercial":i.id==="ferro"?n>=5&&s>=4?"docks":n>=2&&n<=4&&s>=1&&s<=3?"downtown":s>=5?"industrial":n<=1||s===0?"residential":"commercial":i.id==="venturas"?n>=5&&s<=1?"airport":n===3?"strip":n<=1||s>=4?"residential":"commercial":i.id==="shoreside"?n<=1&&s>=6&&s<=7?"airport":n===0&&s>=7?"beach":s<=3?"residential":s<=5?"commercial":"residential":i.id==="kingsland"?n>=1&&n<=3&&s>=4&&s<=7?"downtown":n===4&&s===1?"stadium":n===0||n>=4||s===3||s===8?"commercial":"residential":i.id==="harborton"?n>=4&&s>=2&&s<=6?"docks":n===5&&s>=7?"beach":n<=2&&s<=1||s===9?"residential":n<=3&&s>=2?"commercial":"residential":i.id==="mainland"?n<=1&&s>=10?"airport":n>=4&&s>=11?"docks":n>=2&&n<=4&&s>=4&&s<=6?"downtown":s<=1||n>=5||s>=11?"residential":"commercial":i.id==="beach"?n===4?"beach":n===3?"strip":s<=1||s>=11?"residential":"commercial":i.id==="starfish"||i.id==="prawn"?"residential":"desert"}districtOf(t,e){const i=this.regionAt(t,e);if(!i){const o=-Xt+(t+.5)*Lt,l=-Xt+(e+.5)*Lt;return Ae==="liberty"?o>-560&&o<320&&l>-980&&l<-420?"Dam Hills":"Outskirts":Di(o,l)>8?"Mount Chiliad":o>-700&&o<-300&&l>-820&&l<-620?"Tierra Robada":o>180&&o<920&&l>-80&&l<160?"Sunset Hills":o>-340&&o<260&&l>-980&&l<-380?"Bone County":o>-340&&o<180&&l>-340&&l<180?"Red County":o>-900&&o<-460&&l>300&&l<660?"Shady Creeks":l>140&&l<660?"Flint County":"Outskirts"}const n=t-i.x0,s=e-i.z0,a=this.blockType(t,e);return i.id==="santos"?a==="downtown"?"Downtown":a==="airport"?"Los Santos Airport":a==="docks"?"Ocean Docks":a==="stadium"?"Arena":a==="beach"?"Santa Maria Beach":n>=7?"Eastside":"Midtown":i.id==="ferro"?a==="downtown"?"Financial":a==="docks"?"Easter Basin":a==="industrial"?"Ironworks":"Hillside":i.id==="venturas"?a==="strip"?"The Strip":a==="airport"?"Venturas Airport":"Suburbs":i.id==="shoreside"?a==="airport"?"Francis Airport":a==="beach"?"Sandy Beach":n<=1&&s<=3?"Garden Suburbs":"Shoreside":i.id==="kingsland"?a==="downtown"?"Downtown":a==="park"?"Kings Park":a==="stadium"?"Arena":"Midtown":i.id==="harborton"?a==="docks"?"The Docks":a==="beach"?"Sandy Beach":n<=2&&s<=1?"Projects":"Old Town":i.id==="mainland"?a==="downtown"?"Downtown":a==="airport"?"Vice Airport":a==="docks"?"The Docks":n<=1&&s<=1?"Suburbs":"Midtown":i.id==="beach"?a==="beach"?"Ocean Beach":a==="strip"?"Ocean Drive":s<=1?"North Beach":s>=10?"South Beach":"Washington":i.id==="starfish"?"Star Island":i.id==="prawn"?"Prawn Island":"Carson Town"}districtName(t,e){if(de(t,e))return"The Ocean";const i=Math.floor((t+Xt)/Lt),n=Math.floor((e+Xt)/Lt);return i<0||n<0||i>=le||n>=le?"Outskirts":this.districtOf(i,n)}buildLayout(){const{roadV:t,roadH:e}=M1();this.roadV=t,this.roadH=e,g1(this.roadV,this.roadH);for(const i of Cs)for(let n=0;n<i.nx;n++)for(let s=0;s<i.nz;s++){const a=i.x0+n,o=i.z0+s,l=-Xt+(a+.5)*Lt,c=-Xt+(o+.5)*Lt;if(de(l,c))continue;const h=this.blockType(a,o),f=this.roadCoords[a]+yn,u=this.roadCoords[a+1]-yn,d=this.roadCoords[o]+yn,m=this.roadCoords[o+1]-yn,v={i:a,j:o,x0:f,x1:u,z0:d,z1:m,type:h,cx:(f+u)/2,cz:(d+m)/2,district:this.districtOf(a,o),region:i.id,hoodGang:i.id==="santos"&&n>=7||i.id==="harborton"&&a-i.x0<=2&&o-i.z0<=1,hBase:0};Lh.has(h)||(v.hBase=Math.max(0,ni(l,c))),this.blocks.push(v),this.blockMap.set(a+","+o,v)}x1(this.blocks.filter(i=>Lh.has(i.type)).map(i=>({x0:i.x0-3,x1:i.x1+3,z0:i.z0-3,z1:i.z1+3}))),this.junctions=[];for(let i=0;i<=le;i++)for(let n=0;n<=le;n++){const s=this.roadCoords[i],a=this.roadCoords[n];de(s,a)&&this.onBridge(s,a)<=0||(this.hasRoadSeg(i,n,1,0)||this.hasRoadSeg(i,n,-1,0)||this.hasRoadSeg(i,n,0,1)||this.hasRoadSeg(i,n,0,-1))&&this.junctions.push({ix:i,iz:n})}}hasRoadSeg(t,e,i,n){if(i!==0){const a=Math.min(t,t+i);return e<0||e>le||a<0||a>=le?!1:this.roadH[e][a]}const s=Math.min(e,e+n);return t<0||t>le||s<0||s>=le?!1:this.roadV[t][s]}randomJunction(){return this.junctions[Math.random()*this.junctions.length|0]}randomJunctionNear(t,e,i,n){let s=null,a=1/0;for(let o=0;o<40;o++){const l=this.junctions[Math.random()*this.junctions.length|0],c=this.roadCoords[l.ix],h=this.roadCoords[l.iz],f=Math.hypot(c-t,h-e);if(f>=i&&f<=n)return l;const u=f<i?i-f:f-n;u<a&&(a=u,s=l)}return s}blockAt(t,e){const i=Math.floor((t+Xt)/Lt),n=Math.floor((e+Xt)/Lt),s=this.blockMap.get(i+","+n);return s&&t>=s.x0-yn&&t<=s.x1+yn&&e>=s.z0-yn&&e<=s.z1+yn?s:null}onBridge(t,e){for(const i of Rs){if(i.axis==="x"){if(Math.abs(e-i.c)>Re||t<i.from||t>i.to)continue;return Pe*Math.min(1,Math.min(t-i.from,i.to-t)/20)}if(!(Math.abs(t-i.c)>Re||e<i.from||e>i.to))return Pe*Math.min(1,Math.min(e-i.from,i.to-e)/20)}return 0}inTunnel(t,e){for(const i of En)if(i.axis==="x"){if(Math.abs(e-i.c)<=$i&&t>=i.from&&t<=i.to)return!0}else if(Math.abs(t-i.c)<=$i&&e>=i.from&&e<=i.to)return!0;return!1}groundHeight(t,e){const i=Math.abs(t),n=Math.abs(e);if(Math.max(i,n)>2500)return 0;const a=this.onBridge(t,e);if(a>0)return a;if(this.inTunnel(t,e))return 0;if(de(t,e))return-1.5;if(this.onRoad(t,e))return ni(t,e);const o=this.blockAt(t,e);return o?o.hBase+bi:ni(t,e)}isWater(t,e){const i=Math.max(Math.abs(t),Math.abs(e));return de(t,e)&&this.onBridge(t,e)<=0&&i<2500}surfaceHeight(t,e,i){const n=this.groundHeight(t,e);if(i===void 0||i<n+.5)return n;let s=-1/0;const a=this.hash.query(t,t,e,e,this._surfQ||(this._surfQ=[]));for(const o of a)o.disabled||o.kind!=="building"&&o.kind!=="prop"||o.maxY===void 0||o.maxY>=900||o.maxY<=n||t<o.minX||t>o.maxX||e<o.minZ||e>o.maxZ||o.maxY<=i+.5&&o.maxY>s&&(s=o.maxY);return s===-1/0?n:Math.max(n,s)}onRoad(t,e){if(this.onBridge(t,e)>0)return!0;const i=Math.abs(t),n=Math.abs(e);if(i>Xt+Re||n>Xt+Re)return!1;const s=((t+Xt)%Lt+Lt)%Lt,a=((e+Xt)%Lt+Lt)%Lt,o=Math.round((t+Xt)/Lt),l=Math.round((e+Xt)/Lt);if(s<=Re||s>=Lt-Re){const c=Math.max(0,Math.min(le-1,Math.floor((e+Xt)/Lt)));if(o>=0&&o<=le&&this.roadV[o][c])return!0}if(a<=Re||a>=Lt-Re){const c=Math.max(0,Math.min(le-1,Math.floor((t+Xt)/Lt)));if(l>=0&&l<=le&&this.roadH[l][c])return!0}return!1}lightState(t,e,i,n){const a=((t*7+e*3)%4+4)%4*4,o=(n+a)%16,l=o<8,c=l?o:o-8;return(i==="z"?l:!l)?c>6?"yellow":"green":"red"}lanePoint(t,e,i,n,s,a){const o=this.roadCoords[t],l=this.roadCoords[e],c=-n,h=i,f=f1(s);return{x:o+i*a+c*f,z:l+n*a+h*f}}buildMask(){const i=new Float32Array(65536);for(let s=0;s<256;s++)for(let a=0;a<256;a++){const o=s/255*2*1250-1250,l=a/255*2*1250-1250;i[a*256+s]=de(o,l)?0:1}const n=new Float32Array(i);for(let s=0;s<2;s++){const a=s===0?i:n;for(let o=1;o<255;o++)for(let l=1;l<255;l++){let c=0;for(let h=-1;h<=1;h++)for(let f=-1;f<=1;f++)c+=a[(l+f)*256+o+h];n[l*256+o]=c/9}}this.maskField=n,this.maskN=256,this.maskExt=1250}buildGround(){const t=this.group;{const f=new ui(2500,2500,256,256);f.rotateX(-Math.PI/2);const u=f.attributes.position,d=new Float32Array(u.count);for(let x=0;x<u.count;x++){const y=u.getX(x),b=u.getZ(x);let _,E=0;de(y,b)?(_=-1.2,E=-1):(E=ni(y,b),_=Math.max(-.02,E)-.06),u.setY(x,_),d[x]=E}const m=new Float32Array(u.count*3),v=new G,g=new G(7037529),p=(x,y,b,_,E,T)=>x>=b&&x<=E&&y>=_&&y<=T,M=(x,y)=>{for(const b of Cs)if(x>=-Xt+b.x0*Lt&&x<=-Xt+(b.x0+b.nx)*Lt&&y>=-Xt+b.z0*Lt&&y<=-Xt+(b.z0+b.nz)*Lt)return b.id;return null};for(let x=0;x<u.count;x++){const y=u.getX(x),b=u.getZ(x),_=d[x];if(_<-.5)v.setHex(2510938);else{const S=M(y,b);Ae==="fable"?p(y,b,-340,-980,260,-380)?v.setHex(13215850):p(y,b,-340,-340,180,180)?v.setHex(Math.floor(y/125)+Math.floor(b/120)&1?10133580:6130236):p(y,b,-920,300,-440,660)?v.setHex(4025138):p(y,b,140,880,900,985)?v.setHex(14272143):S==="santos"?v.setHex(7830898):S==="ferro"?v.setHex(8028020):S==="venturas"||S==="carson"?v.setHex(9078136):v.setHex(7307090):Ae==="liberty"?p(y,b,-560,-980,320,-420)?v.setHex(7832154):S==="shoreside"?v.setHex(8028020):S==="kingsland"?v.setHex(7830898):S==="harborton"?v.setHex(7699058):v.setHex(7307090):y>540?v.setHex(14272143):S?v.setHex(8028020):v.setHex(7309906);const R=x%257,I=x/257|0,L=d[I*257+Math.max(0,R-1)],B=d[I*257+Math.min(256,R+1)],W=d[Math.max(0,I-1)*257+R],U=d[Math.min(256,I+1)*257+R],q=(Math.abs(B-L)+Math.abs(U-W))/(2*9.765625),V=Math.max(Ia(4.5,9,_),Ia(.45,.8,q));V>0&&v.lerp(g,Math.min(1,V))}const E=Math.sin(y*12.9898+b*78.233)*43758.55,T=1+(E-Math.floor(E)-.5)*.09;m[x*3]=v.r*T,m[x*3+1]=v.g*T,m[x*3+2]=v.b*T}f.setAttribute("color",new Le(m,3)),f.computeVertexNormals();const w=new N(f,new pt({map:l1(),vertexColors:!0,roughness:1}));w.receiveShadow=!0,t.add(w)}const e=o1(),i=zh(),n=Ph(13),s=(o,l,c,h,f,u=-.03,d=null,m=8)=>{let v;if(d){const p=d.clone();p.repeat.set(Math.max(1,(c-o)/m),Math.max(1,(h-l)/m)),p.needsUpdate=!0,v=new pt({map:p,color:f,roughness:1})}else v=new pt({color:f,roughness:1});const g=new N(new ui(c-o,h-l),v);g.rotation.x=-Math.PI/2,g.position.set((o+c)/2,u,(l+h)/2),g.receiveShadow=!0,t.add(g)};Ae==="fable"&&(s(-340,-980,260,-380,16777215,-.04,e),s(-340,-340,180,180,16777215,-.04,e),s(-920,300,-440,660,10467472,-.04,n),s(140,140,900,900,7830898,-.045),s(-980,-420,-380,180,8028020,-.045),s(220,-980,740,-420,9078136,-.045),s(140,880,900,985,16777215,-.035,i)),Ae==="liberty"&&(s(-900,-180,-420,500,8028020,-.045),s(-260,-340,180,500,7830898,-.045),s(380,-180,820,500,7699058,-.045),s(-560,-980,320,-420,16777215,-.04,e)),Ae==="vice"&&(s(-820,-660,-220,420,8028020,-.045),s(220,-660,640,420,8291192,-.045),s(-110,-20,110,180,8028020,-.045),s(-110,-340,190,-140,8028020,-.045),s(560,-660,660,420,16777215,-.035,i));const a=new N(new ui(6e3,6e3),new pt({color:2510938,roughness:1}));if(a.rotation.x=-Math.PI/2,a.position.y=-3,t.add(a),Ce.cone){const c=new ui(760,760,150,150);c.rotateX(-Math.PI/2);const h=c.attributes.position,f=new Float32Array(h.count*3),u=new G(7037529),d=new G(15265522),m=new G(5077556),v=new G,g=Ce.cone;for(let M=0;M<h.count;M++){const w=h.getX(M)+g.x,x=h.getZ(M)+g.z,y=Di(w,x);h.setY(M,Math.max(-.15,y-.1));const b=Math.max(Math.abs(Di(w+4,x)-Di(w-4,x)),Math.abs(Di(w,x+4)-Di(w,x-4)))/8;y>85&&b<1.2?v.copy(d):y>4||b>.55?v.copy(u).offsetHSL(0,0,(w*13+x*7)%10/500):v.copy(m),f[M*3]=v.r,f[M*3+1]=v.g,f[M*3+2]=v.b}c.setAttribute("color",new Le(f,3)),c.computeVertexNormals();const p=new N(c,new pt({vertexColors:!0,roughness:1,flatShading:!0}));p.position.set(g.x,0,g.z),p.castShadow=!0,p.receiveShadow=!0,t.add(p)}Ae==="fable"&&(this.addCollider(-950,450,-816,624,"mountain",60),this.addCollider(-950,656,-816,830,"mountain",60),this.addCollider(-784,450,-570,624,"mountain",60),this.addCollider(-784,656,-570,830,"mountain",60),this.addCollider(-955,640+14.5,-820,640+16.5,"building",8),this.addCollider(-780,640+14.5,-310,640+16.5,"building",8),this.addCollider(-955,640-16.5,-820,640-14.5,"building",8),this.addCollider(-780,640-16.5,-310,640-14.5,"building",8),this.addCollider(-800+14.5,310,-800+16.5,620,"building",8),this.addCollider(-800+14.5,660,-800+16.5,890,"building",8),this.addCollider(-800-16.5,310,-800-14.5,620,"building",8),this.addCollider(-800-16.5,660,-800-14.5,890,"building",8))}buildRoads(){const t=this.group,e=n1(),i=new pt({map:e.map,roughnessMap:e.roughnessMap,roughness:1,metalness:0}),n=s1(),s=new pt({map:n.map,roughnessMap:n.roughnessMap,roughness:1}),a=r1(),o=new pt({map:a,transparent:!0,roughness:.9,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2}),l=[],c=[],h=[],f=Lt-xi,u=(y,b)=>de(y,b)&&this.onBridge(y,b)>0;for(let y=0;y<=le;y++)for(let b=0;b<le;b++){if(this.roadV[y][b]){const _=this.roadCoords[y],E=this.roadCoords[b]+Lt/2;if(!u(_,E)){let T=new ui(xi,f);T.rotateX(-Math.PI/2);const S=T.attributes.uv;for(let R=0;R<S.count;R++)S.setY(R,S.getY(R)*f/14);T.translate(_,0,E),l.push(T)}}if(this.roadH[y][b]){const _=this.roadCoords[b]+Lt/2,E=this.roadCoords[y];if(!u(_,E)){let T=new ui(xi,f);T.rotateX(-Math.PI/2),T.rotateY(Math.PI/2);const S=T.attributes.uv;for(let R=0;R<S.count;R++)S.setY(R,S.getY(R)*f/14);T.translate(_,0,E),l.push(T)}}}new Set(this.junctions.map(y=>y.ix+","+y.iz));for(const{ix:y,iz:b}of this.junctions){const _=this.roadCoords[y],E=this.roadCoords[b];if(!de(_,E)){const T=new ui(xi,xi);T.rotateX(-Math.PI/2),T.translate(_,0,E),c.push(T)}for(const[T,S]of[[1,0],[-1,0],[0,1],[0,-1]]){if(!this.hasRoadSeg(y,b,T,S))continue;const R=new ui(xi,3);R.rotateX(-Math.PI/2),T!==0&&R.rotateY(Math.PI/2),R.translate(_+T*(Re+1.5),.005,E+S*(Re+1.5)),h.push(R)}}const d=new N(ki(l),i);d.receiveShadow=!0,d.position.y=0,t.add(d);const m=new N(ki(c),s);m.receiveShadow=!0,t.add(m);const v=new N(ki(h),o);v.position.y=.01,t.add(v);for(const y of Rs){const b=y.to-y.from,_=new pt({color:y.red?9054752:4869458,roughness:.9}),E=new N(new _t(y.axis==="x"?b:xi,.6,y.axis==="x"?xi:b),_);E.position.set(y.axis==="x"?(y.from+y.to)/2:y.c,Pe-.3,y.axis==="x"?y.c:(y.from+y.to)/2),E.castShadow=!0,E.receiveShadow=!0,t.add(E);const T=new pt({color:3356219,roughness:.95}),S=new N(new _t(y.axis==="x"?b:xi-.6,.08,y.axis==="x"?xi-.6:b),T);S.position.set(E.position.x,Pe-.035,E.position.z),S.receiveShadow=!0,t.add(S);const R=new re({color:16119280});for(let q=6;q<b-3;q+=9){const V=new N(new _t(y.axis==="x"?3:.3,.05,y.axis==="x"?.3:3),R);y.axis==="x"?V.position.set(y.from+q,Pe+.04,y.c):V.position.set(y.c,Pe+.04,y.from+q),t.add(V)}const I=new pt({color:y.red?12597547:9080724,roughness:.6,metalness:.4}),L=b+40,B=(y.from+y.to)/2;for(const q of[-1,1]){const V=new N(new _t(y.axis==="x"?L:.3,1.1,y.axis==="x"?.3:L),I);if(y.axis==="x"){const rt=(et,mt,Ct,Z)=>{const k=Math.hypot(mt-et,Z-Ct),Q=new N(new _t(k,.28,.28),I);Q.position.set((et+mt)/2,(Ct+Z)/2+.55,y.c+q*(Re-.2)),Q.rotation.z=Math.atan2(Z-Ct,mt-et),Q.castShadow=!0,t.add(Q);const st=(ut,Rt)=>{const Pt=new N(new _t(.25,1.1,.25),I);Pt.position.set(ut,Rt,y.c+q*(Re-.2)),t.add(Pt)},$=Math.max(2,Math.round(k/10));for(let ut=0;ut<=$;ut++){const Rt=ut/$;st(et+(mt-et)*Rt,Ct+(Z-Ct)*Rt)}};rt(y.from-20,y.from,0,Pe),rt(y.from,y.to,Pe,Pe),rt(y.to,y.to+20,Pe,0),V.visible=!1}else V.position.set(y.c+q*(Re-.2),Pe+.55,B),V.castShadow=!0,t.add(V)}if(y.axis!=="x")for(const q of[-1,1]){const V=(rt,et,mt,Ct)=>{const Z=Math.hypot(et-rt,Ct-mt),k=new N(new _t(.28,.28,Z),I);k.position.set(y.c+q*(Re-.2),(mt+Ct)/2+.55,(rt+et)/2),k.rotation.x=-Math.atan2(Ct-mt,et-rt),k.castShadow=!0,t.add(k)};V(y.from-20,y.from,0,Pe),V(y.to,y.to+20,Pe,0)}for(let q=20;q<b-10;q+=40){const V=new N(new jt(1.2,1.5,Pe+3,8),_);V.position.set(y.axis==="x"?y.from+q:y.c,(Pe-3)/2-.5,y.axis==="x"?y.c:y.from+q),t.add(V)}const W=Math.hypot(20,Pe),U=Math.atan2(Pe,20);for(const q of[0,1]){const V=q===0?-1:1,rt=new N(new _t(y.axis==="x"?W:xi,.6,y.axis==="x"?xi:W),_);y.axis==="x"?(rt.position.set((q===0?y.from:y.to)+V*10,Pe/2-.3,y.c),rt.rotation.z=(q===0?1:-1)*U):(rt.position.set(y.c,Pe/2-.3,(q===0?y.from:y.to)+V*10),rt.rotation.x=(q===0?-1:1)*U),rt.receiveShadow=!0,t.add(rt)}for(const q of[-1,1])y.axis==="x"?this.addCollider(y.from-20,y.c+q*(Re-.2)-.2,y.to+20,y.c+q*(Re-.2)+.2,"prop",Pe+1.5):this.addCollider(y.c+q*(Re-.2)-.2,y.from-20,y.c+q*(Re-.2)+.2,y.to+20,"prop",Pe+1.5);if(y.susp){const q=y.axis==="x",V=(y.from+y.to)/2,rt=y.from+b*.3,et=y.from+b*.7,mt=new pt({color:11546672,roughness:.6}),Ct=new pt({color:2236962,roughness:.5,metalness:.6});for(const Z of[rt,et])for(const k of[-1,1]){const Q=q?Z:y.c+k*(Re+1.2),st=q?y.c+k*(Re+1.2):Z,$=new N(new _t(1.4,26,1.4),mt);$.position.set(Q,13,st),$.castShadow=!0,t.add($);const ut=new N(new _t(2.2,1.2,2.2),mt);ut.position.set(Q,26.5,st),t.add(ut)}for(const Z of[-1,1]){const k=Z*(Re+1.2),Q=q?[[y.from-10,4,y.c+k],[rt,26,y.c+k],[V,12,y.c+k],[et,26,y.c+k],[y.to+10,4,y.c+k]]:[[y.c+k,4,y.from-10],[y.c+k,26,rt],[y.c+k,12,V],[y.c+k,26,et],[y.c+k,4,y.to+10]];for(let st=0;st<Q.length-1;st++){const $=Q[st],ut=Q[st+1],Rt=Math.hypot(ut[0]-$[0],ut[1]-$[1],ut[2]-$[2]),Pt=new N(new _t(.22,.22,Rt),Ct);Pt.position.set(($[0]+ut[0])/2,($[1]+ut[1])/2,($[2]+ut[2])/2),Pt.lookAt(ut[0],ut[1],ut[2]),t.add(Pt)}for(let st=14;st<b-6;st+=14){const $=new N(new _t(.14,8,.14),Ct);q?$.position.set(y.from+st,Pe+4,y.c+k):$.position.set(y.c+k,Pe+4,y.from+st),t.add($)}}}}const g=a1();g.repeat.set(1,1);const p=new pt({map:g,roughness:.95,vertexColors:!0}),M=new Pi,w=new G(1,1,1);for(const y of this.blocks){const b=y.x0-3,_=y.x1+3,E=y.z0-3,T=y.z1+3;M.box(b,y.hBase-2,E,_,y.hBase+bi,T,w,2)}const x=new N(M.build(),p);x.receiveShadow=!0,x.castShadow=!1,t.add(x),this.buildTunnels()}buildTunnels(){const t=this.group,e=new pt({color:9080726,roughness:.9,side:Ve}),i=new pt({color:2829875,roughness:.95}),n=new pt({color:14201856,roughness:.5,metalness:.3}),s=(a,o)=>Di(a,o)>6;for(const a of En){const o=a.axis==="x",l=a.to-a.from,c=(a.from+a.to)/2,h=g=>o?[c+g,a.c]:[a.c,c+g],f=[];for(let g=-l/2+10;g<l/2;g+=20){const[p,M]=h(g);s(p,M)&&f.push(g)}const u=new jt($i+1.5,$i+1.5,20.5,14,1,!0,0,Math.PI);u.rotateZ(Math.PI/2),u.rotateY(Math.PI/2);for(const g of f){const[p,M]=h(g),w=new N(u,e);o&&w.rotation.set(0,Math.PI/2,0),w.position.set(p,0,M),w.receiveShadow=!0,t.add(w);const x=new N(new _t(o?20.5:($i+2)*2,.8,o?($i+2)*2:20.5),i);x.position.set(p,Ni+.4,M),t.add(x)}this.tunnelLamps||=[];const d=new re({color:16773824,toneMapped:!1}),m=new _t(1.2,.15,.4);if(f.length){const g=new Mi(m,d,f.length),p=new pe;f.forEach((y,b)=>{const[_,E]=h(y);p.position.set(_,Ni-.3,E),p.updateMatrix(),g.setMatrixAt(b,p.matrix)}),t.add(g),this.tunnelLamps.push(g);const M=[];for(const y of f){const[b,_]=h(y);M.push(b,Ni-.5,_)}const w=new we;w.setAttribute("position",new Qt(M,3));const x=new Ra({map:Rl(),color:16771504,size:7,transparent:!0,opacity:.85,depthWrite:!1,blending:Ps});t.add(new Pa(w,x))}const v=[];if(f.length){let g=f[0];for(let p=1;p<=f.length;p++)(p===f.length||f[p]>f[p-1]+21)&&(v.push([g-10,f[p-1]+10]),p<f.length&&(g=f[p]))}for(const[g,p]of v)for(const M of[g,p]){const[w,x]=h(M),y=new N(new _t(o?2.5:($i+4)*2,Ni+3.5,o?($i+4)*2:2.5),new pt({color:12172996,roughness:.8}));y.position.set(w,(Ni+3.5)/2-.5,x),y.castShadow=!0,t.add(y);const b=new N(new ui(($i+1)*2-4,Ni+1),new re({color:329482})),_=M===g?-1:1;o?(b.position.set(w+_*1.3,(Ni+1)/2,x),b.rotation.y=_>0?-Math.PI/2:Math.PI/2):(b.position.set(w,(Ni+1)/2,x+_*1.3),b.rotation.y=_>0?Math.PI:0),t.add(b);const E=new N(new _t(o?1:10,1,o?10:1),new pt({color:1118481,emissive:16757504,emissiveIntensity:1.2}));o?E.position.set(w+_*1.6,Ni+1.6,x):E.position.set(w,Ni+1.6,x+_*1.6),t.add(E);for(const T of[-1,1]){const S=new N(new _t(o?24:.35,.9,o?.35:24),n);o?S.position.set(w+_*12,.9,x+T*(Re+.6)):S.position.set(w+T*(Re+.6),.9,x+_*12),S.castShadow=!0,t.add(S)}}}}addCollider(t,e,i,n,s="building",a=999){const o={minX:t,maxX:i,minZ:e,maxZ:n,kind:s,minY:0,maxY:a};return this.hash.add(o),o}buildPark(t,e){const i=this.rng,n=t.hBase+bi,s=new G(1,1,1);e.box(t.x0,n,t.z0,t.x1,n+.05,t.z1,s,6);for(let h=0;h<22;h++){const f=i.range(t.x0+3,t.x1-3),u=i.range(t.z0+3,t.z1-3);Math.hypot(f-t.cx,u-t.cz)<9||this.trees.push({x:f,z:u,s:i.range(.9,1.6)})}const a=new be;a.position.set(t.cx,n,t.cz);const o=new N(new jt(5,5.4,.9,24),new pt({color:12564650,roughness:.8}));o.position.y=.45,o.castShadow=!0,a.add(o);const l=new N(new jt(4.6,4.6,.2,24),new pt({color:3842264,roughness:.1,metalness:.2,transparent:!0,opacity:.85}));l.position.y=.85,a.add(l);const c=new N(new jt(.6,1.2,3,12),o.material);c.position.y=1.8,c.castShadow=!0,a.add(c),this.group.add(a),this.addCollider(t.cx-5.2,t.cz-5.2,t.cx+5.2,t.cz+5.2,"prop",n+1),(this.fountains||=[]).push(a)}buildParkingLot(t){const e=this.rng,i=t.hBase+bi,n=new pt({color:3816512,roughness:.95}),s=new N(new _t(t.x1-t.x0,.06,t.z1-t.z0),n);s.position.set(t.cx,i+.03,t.cz),s.receiveShadow=!0,this.group.add(s);const a=new Pi,o=new G(.9,.9,.85);for(let c=0;c<2;c++){const h=t.z0+14+c*24;for(let f=0;f<8;f++){const u=t.x0+6+f*6.5;a.boxTop(u-.08,i+.07,h-5,u+.08,h+5,o,1),f<7&&e.chance(.55)&&this.parkedSpots.push({x:u+3.25,z:h,heading:c===0?Math.PI:0})}}const l=a.build();l&&this.group.add(new N(l,new re({vertexColors:!0}))),this.lamps.push({x:t.cx,z:t.z0+26,rot:0},{x:t.x0+8,z:t.z0+26,rot:0},{x:t.x1-8,z:t.z0+26,rot:0})}buildCountryside(){const t=this.rng,e=new Pi;if(Ae==="liberty")this.countryLiberty(e,t);else if(Ae==="vice")this.countryVice(e,t);else{const n=[new G(6130236),new G(10133580),new G(5077556),new G(9075260)];for(let l=0;l<4;l++)for(let c=0;c<4;c++){const h=-320+l*125,f=h+121,u=-320+c*120,d=u+116;if(u>-70&&d<-10)continue;const m=n[(l+c)%4],v=5;for(let g=0;g<v;g++)for(let p=0;p<v;p++){const M=h+(f-h)*g/v,w=h+(f-h)*(g+1)/v,x=u+(d-u)*p/v,y=u+(d-u)*(p+1)/v;if(this.onRoad((M+w)/2,(x+y)/2))continue;const b=(ni(M,x)+ni(w,x)+ni(M,y)+ni(w,y))/4+.02;e.boxTop(M,b,x,w,y,m,14)}}const s=new G(7031339),a=(l,c,h,f)=>{const u=h-l,d=f-c,m=Math.hypot(u,d),v=Math.floor(m/6);for(let g=0;g<=v;g++){const p=l+u*g/v,M=c+d*g/v,w=ni(p,M);e.box(p-.12,w,M-.12,p+.12,w+1.1,M+.12,s)}};a(-320,-320,180,-320),a(-320,180,180,180),a(-320,-320,-320,180),a(180,-320,180,180);const o=(l,c,h=0)=>{const f=ni(l,c),u=new G(10498088),d=new G(15790320);e.box(l-9,f,c-6,l+9,f+6,c+6,u),e.box(l-9.4,f+6,c-6.4,l+9.4,f+6.5,c+6.4,d),e.box(l-1.2,f,c+5.8,l+1.2,f+4.2,c+6.3,new G(3811866)),this.addCollider(l-9,c-6,l+9,c+6,"building",f+7)};o(-190,-190),o(-40,60),o(60,-260);for(const[l,c]of[[-210,-190],[-22,60]]){const h=ni(l,c),f=new N(new jt(3,3,12,12),new pt({color:12172996,roughness:.4,metalness:.6}));f.position.set(l,h+6,c),f.castShadow=!0,this.group.add(f);const u=new N(new Oi(3,12,6,0,Math.PI*2,0,Math.PI/2),f.material);u.position.set(l,h+12,c),this.group.add(u),this.addCollider(l-3,c-3,l+3,c+3,"prop",h+15)}{const h=ni(-140,-120),f=new N(new jt(.5,1.4,16,8),new pt({color:9080724,roughness:.6,metalness:.5}));f.position.set(-140,h+8,-120),f.castShadow=!0,this.group.add(f);const u=new be;u.position.set(-140,h+15,-120+1.2);for(let d=0;d<4;d++){const m=new N(new _t(.5,5,.08),f.material);m.position.y=2.5;const v=new be;v.rotation.z=d*Math.PI/2,v.add(m),u.add(v)}this.group.add(u),(this.spinners||=[]).push(u),this.addCollider(-140-1.5,-120-1.5,-140+1.5,-120+1.5,"prop",h+16)}for(const[l,c]of[[-500,350],[-620,340]]){const h=ni(l,c);e.box(l-5,h,c-4,l+5,h+3.4,c+4,new G(6111287)),e.box(l-5.4,h+3.4,c-4.4,l+5.4,h+4.6,c+4.4,new G(3812900)),this.addCollider(l-5,c-4,l+5,c+4,"building",h+5)}for(const[l,c]of[[-160,-700],[-120,-580]])e.box(l-4,0,c-3,l+4,3,c+3,new G(11573874)),this.addCollider(l-4,c-3,l+4,c+3,"building",3.5);{const l=[{x0:-320,z0:-320,x1:160,z1:-80},{x0:-320,z0:0,x1:160,z1:160},{x0:-300,z0:-960,x1:220,z1:-420}],c=[];let h=0;for(;c.length<16&&h++<400;){const f=l[t.range(0,l.length)|0],u=t.range(f.x0,f.x1),d=t.range(f.z0,f.z1);if(de(u,d)||Di(u,d)>3||this.onRoad(u,d)||this.blockAt(u,d)||d>-75&&d<-5&&u>-320&&u<1150||ni(u,d)>1||c.some(g=>Math.hypot(g[0]-u,g[1]-d)<90))continue;let m=!1;for(let g=-8;g<=8&&!m;g+=4)for(let p=-8;p<=8&&!m;p+=4)this.onRoad(u+g,d+p)&&(m=!0);if(m)continue;c.push([u,d]);const v=t.chance(.5);if(t.chance(.55)){const g=new G(t.pick([13617336,11055272,14205072,10135736,12624016])),p=11,M=3.4,w=.7,x=3.6;if(v){e.box(u-p/2,w,d-M/2,u+p/2,x,d+M/2,g),e.box(u-p/2,x,d-M/2,u+p/2,x+.25,d+M/2,new G(9080724)),e.box(u-p/2,w+1.1,d-M/2-.06,u+p/2,w+1.7,d-M/2+.02,new G(7031338));for(const y of[-3,3])for(const b of[-1,1])e.box(u+y-.9,.1,d+b*(M/2-.3)-.35,u+y+.9,1,d+b*(M/2-.3)+.35,new G(1710618));e.box(u+p/2,.5,d-.15,u+p/2+2.2,.8,d+.15,new G(4869458)),e.box(u-1,0,d+M/2,u+1,.7,d+M/2+1.4,new G(8028037)),e.box(u-3,w+1.4,d+M/2-.02,u-1,w+2.6,d+M/2+.06,new G(1715260)),e.box(u+2,w+1.4,d+M/2-.02,u+4,w+2.6,d+M/2+.06,new G(1715260)),this.addCollider(u-p/2,d-M/2,u+p/2,d+M/2,"building",x)}else{e.box(u-M/2,w,d-p/2,u+M/2,x,d+p/2,g),e.box(u-M/2,x,d-p/2,u+M/2,x+.25,d+p/2,new G(9080724)),e.box(u-M/2-.06,w+1.1,d-p/2,u-M/2+.02,w+1.7,d+p/2,new G(7031338));for(const y of[-3,3])for(const b of[-1,1])e.box(u+b*(M/2-.3)-.35,.1,d+y-.9,u+b*(M/2-.3)+.35,1,d+y+.9,new G(1710618));e.box(u-.15,.5,d+p/2,u+.15,.8,d+p/2+2.2,new G(4869458)),e.box(u+M/2,0,d-1,u+M/2+1.4,.7,d+1,new G(8028037)),this.addCollider(u-M/2,d-p/2,u+M/2,d+p/2,"building",x)}}else{const g=new G(t.pick([9076586,8022618,10127986,7037529])),p=7,M=6,w=t.range(3.6,4.6);e.box(u-p/2,0,d-M/2,u+p/2,w,d+M/2,g),e.box(u-p/2-.4,w,d-M/2-.4,u+p/2+.4,w+.5,d+M/2+.4,new G(4865843)),e.box(u-1.5,1,d+M/2-.05,u+1.5,2.6,d+M/2+.08,new G(6122098));const x=v?p/2:-p/2-2.4;for(const _ of[-1,1])e.box(u+x+(v?2.2:0)-.12,0,d+_*1.4-.12,u+x+(v?2.2:0)+.12,2.6,d+_*1.4+.12,new G(6113846));v?e.box(u+p/2-.2,2.5,d-1.8,u+p/2+2.6,2.8,d+1.8,new G(7035464)):e.box(u-p/2-2.6,2.5,d-1.8,u-p/2+.2,2.8,d+1.8,new G(7035464)),v?this.addCollider(u+p/2-.2,d-1.8,u+p/2+2.6,d+1.8,"prop",2.8):this.addCollider(u-p/2-2.6,d-1.8,u-p/2+.2,d+1.8,"prop",2.8);const y=u+(v?-p/2-3:p/2+3),b=d+M/2+2;e.box(y-.8,0,b-.8,y+.8,.5,b+.8,new G(1710618)),e.box(y-.6,.5,b-.6,y+.6,.9,b+.6,new G(2368548)),e.box(y+1.6,0,b-.5,y+2.4,1.1,b+.5,new G(9058858)),this.addCollider(u-p/2,d-M/2,u+p/2,d+M/2,"building",w+.5),this.addCollider(y-1,b-1,y+2.5,b+1,"prop",1.2)}}}}const i=e.build();if(i){const n=new N(i,new pt({vertexColors:!0,roughness:1}));n.castShadow=!0,n.receiveShadow=!0,this.group.add(n)}{const n=new Pi,s=new G(2899536),a=new G(9058858),o=Ae==="fable"?960:Ae==="liberty"?935:40,l=Ae==="fable"?350:Ae==="liberty"?320:300;n.box(o-55,-1,l-9,o+55,3,l+9,s),n.box(o+40,3,l-6,o+55,8,l+6,a),n.box(o-55,3,l-4,o-38,12,l+4,new G(15263978));for(let h=0;h<6;h++)n.box(o-30+h*11,3,l-7,o-22+h*11,8,l+7,new G([12597547,2719929,15965202,2600544][h%4]));const c=new N(n.build(),new pt({vertexColors:!0,roughness:.8}));c.castShadow=!0,this.group.add(c)}if(Ae==="liberty")this.libertyScatter(t);else if(Ae==="vice")this.viceScatter(t);else{for(let n=0;n<130;n++){const s=t.range(-320,260),a=t.range(-980,-380);de(s,a)||this.onRoad(s,a)||(t.chance(.45)?this.rocks||=[]:this.cacti||=[]).push({x:s,z:a,s:t.range(.7,1.6)})}for(let n=0;n<60;n++){const s=t.range(0,6.28),a=t.range(180,265),o=-760+Math.cos(s)*a,l=640+Math.sin(s)*a;this.inTunnel(o,l)||Math.abs(l-640)<20||Math.abs(o+800)<20||this.onRoad(o,l)||(this.rocks||=[]).push({x:o,z:l,s:t.range(1.2,2.6)})}for(let n=0;n<700;n++){const s=t.range(-920,-440),a=t.range(300,660);de(s,a)||Di(s,a)>10||this.onRoad(s,a)||Math.abs(a-640)<24&&s>-975&&s<-290||Math.abs(s+800)<24&&a>290&&a<900||(this.forestTrees||=[]).push({x:s,z:a,s:t.range(.9,1.7)})}for(let n=0;n<120;n++){const s=t.range(0,6.28),a=t.range(120,200),o=-760+Math.cos(s)*a,l=640+Math.sin(s)*a;this.inTunnel(o,l)||Math.abs(l-640)<20||Math.abs(o+800)<20||this.onRoad(o,l)||this.trees.push({x:o,z:l,s:t.range(.8,1.3)})}for(let n=0;n<120;n++){const s=t.range(-340,200),a=t.range(-340,200);de(s,a)||this.onRoad(s,a)||this.blockAt(s,a)||this.trees.push({x:s,z:a,s:t.range(.8,1.4)})}}}countryVice(t,e){const i=new G(8028037),n=new G(4869458);t.box(300,-.5,330,380,.4,336,i);for(let o=0;o<=60;o+=12)t.box(300+o-.5,-2,333,300+o+.5,.4,335,n);const s=600,a=380;t.box(s-3,0,a-3,s+3,22,a+3,new G(15790320)),t.box(s-3.5,22,a-3.5,s+3.5,24,a+3.5,new G(12597547)),this.addCollider(s-3,a-3,s+3,a+3,"building",24)}viceScatter(t){for(let e=0;e<160;e++){const i=t.range(420,620),n=t.range(-620,400);de(i,n)||this.onRoad(i,n)||this.blockAt(i,n)||this.trees.push({x:i,z:n,s:t.range(.9,1.5),palm:!0})}for(let e=0;e<260;e++){const i=t.range(-850,650),n=t.range(-650,430);de(i,n)||this.onRoad(i,n)||this.blockAt(i,n)||this.trees.push({x:i,z:n,s:t.range(.8,1.3),palm:t.chance(.65)})}}countryLiberty(t,e){const i=new G(10133670),n=new G(4869458);t.box(-210,-2,-628,-100,26,-614,i),t.box(-60,-2,-628,60,26,-614,i),t.box(-210,26,-628,-100,27.5,-614,n),t.box(-60,26,-628,60,27.5,-614,n);for(let s=-190;s<=40;s+=23)s>-110&&s<-50||t.box(s-1,-2,-621,s+1,12,-619,n);t.box(-96,-2,-640,-64,4,-608,new G(7040885)),this.addCollider(-210,-628,-100,-614,"building",28),this.addCollider(-60,-628,60,-614,"building",28),this.addCollider(-96,-640,-64,-608,"building",5),t.box(30,-.5,-700,70,.4,-694,new G(8028037));for(let s=0;s<=40;s+=10)t.box(30+s-.5,-2,-697,30+s+.5,.4,-693,n)}libertyScatter(t){for(let e=0;e<90;e++){const i=t.range(-560,320),n=t.range(-980,-420);de(i,n)||this.onRoad(i,n)||(t.chance(.5)?this.rocks||=[]:this.trees).push({x:i,z:n,s:t.range(.8,1.6)})}for(let e=0;e<260;e++){const i=t.range(-560,320),n=t.range(-980,-420);de(i,n)||this.onRoad(i,n)||Math.abs(i)<60&&Math.abs(n+700)<130||(this.forestTrees||=[]).push({x:i,z:n,s:t.range(.9,1.7)})}for(let e=0;e<60;e++){const i=t.range(-900,900),n=t.range(-100,500);de(i,n)||this.onRoad(i,n)||this.blockAt(i,n)||this.trees.push({x:i,z:n,s:t.range(.8,1.3)})}}buildBlocks(){const t=this.rng,e=["glass","concrete","brick","tower","house","industrial","deco","brownstone"],i={};for(const x of e)i[x]=new Pi;const n=new Pi,s=new Pi,a=new Pi,o=new Pi,l=new Pi,c=new G(.55,.55,.55),h=[16723349,3010815,16769325,8257325,16738861,11873791].map(x=>new G(x)),f=Ae==="vice"?.68:Ae==="liberty"?.28:.45,u=Ae==="vice"?["deco","deco","concrete","tower"]:Ae==="liberty"?["brownstone","brick","brick","concrete","tower"]:["concrete","brick","brick","tower"],d=(x,y,b,_,E,T,S,R=bi)=>{const I=new G(S);i[T].boxSides(x,R,y,b,R+E,_,I,3),n.boxTop(x,R+E,y,b,_,c.clone().multiplyScalar(t.range(.7,1.2)),4);const L=.5;a.box(x,R+E,y,b,R+E+.8,y+L,I),a.box(x,R+E,_-L,b,R+E+.8,_,I),a.box(x,R+E,y,x+L,R+E+.8,_,I),a.box(b-L,R+E,y,b,R+E+.8,_,I);const B=t.int(0,3);for(let W=0;W<B;W++){const U=t.range(1.5,4),q=t.range(1.5,4),V=t.range(1,3),rt=t.range(x+1.5,b-1.5-U),et=t.range(y+1.5,_-1.5-q);rt<x+1||et<y+1||a.box(rt,R+E,et,rt+U,R+E+V,et+q,new G(7831430))}if(E>60&&t.chance(.6)){const W=(x+b)/2,U=(y+_)/2;a.box(W-.3,R+E,U-.3,W+.3,R+E+t.range(6,16),U+.3,new G(10066329))}if(T!=="house"&&T!=="industrial"&&E>10&&t.chance(f)){const W=t.pick(h),U=R+t.range(4,Math.min(E-2,12)),q=t.int(0,3);q===0?s.box(x+1,U,_,b-1,U+1.2,_+.2,W):q===1?s.box(x+1,U,y-.2,b-1,U+1.2,y,W):q===2?s.box(b,U,y+1,b+.2,U+1.2,_-1,W):s.box(x-.2,U,y+1,x,U+1.2,_-1,W)}this.addCollider(x,y,b,_,"building",R+E)};for(const x of this.blocks){const y=x.x1-x.x0,b=x.hBase+bi;if(x.type==="park"){this.buildPark(x,o);continue}if(x.type==="lot"){this.buildParkingLot(x);continue}if(x.type==="airport"){this.buildAirport(x,d,a,s);continue}if(x.type==="docks"){this.buildDocks(x,d,a);continue}if(x.type==="stadium"){this.buildStadium(x,a);continue}if(x.type==="beach"){this.buildBeach(x,l);continue}if(x.type==="downtown"){const _=x.region==="santos"?[70,140]:x.region==="kingsland"?[60,120]:x.region==="mainland"?[55,110]:x.region==="ferro"?[30,70]:[25,60],E=t.int(1,3);if(E===1){const T=t.range(4,8),S=t.range(..._),R=t.pick(["glass","tower","glass"]),I=t.pick([16777215,14674160,13162208,15261904]);d(x.x0+T,x.z0+T,x.x1-T,x.z1-T,S*.55,R,I,b);const L=T+t.range(4,8);d(x.x0+L,x.z0+L,x.x1-L,x.z1-L,S*.85,R,I,b);const B=L+t.range(4,7);d(x.x0+B,x.z0+B,x.x1-B,x.z1-B,S,R,I,b)}else{const T=y/2;for(let S=0;S<2;S++)for(let R=0;R<2;R++){if(E===2&&S!==R)continue;const I=x.x0+S*T+2,L=x.z0+R*T+2,B=I+T-4,W=L+T-4,U=t.range(_[0]*.5,_[1]);d(I,L,B,W,U,t.pick(["glass","tower","concrete"]),t.pick([16777215,14148590,15327955,12569043]),b)}}}else if(x.type==="strip"){const E=y/2;for(let T=0;T<2;T++)for(let S=0;S<2;S++){const R=t.range(12,30);d(x.x0+T*E+1.5,x.z0+S*E+1.5,x.x0+(T+1)*E-1.5,x.z0+(S+1)*E-1.5,R,t.pick(["glass","concrete","tower"]),t.pick([16777215,15787734,16771529]),b);const I=t.pick(h),L=x.x0+(T+.5)*E,B=x.z0+(S+.5)*E;s.box(L-.6,b,B-.6,L+.6,b+t.range(14,24),B+.6,I),this.addCollider(L-.7,B-.7,L+.7,B+.7,"prop",b+24)}for(let T=0;T<4;T++)this.trees.push({x:x.x0+6+T*14,z:x.z1-4,s:1.1,palm:!0})}else if(x.type==="commercial"){const _=t.pick([2,3]),E=y/_;for(let T=0;T<_;T++)for(let S=0;S<_;S++){if(t.chance(.12)){this.trees.push({x:x.x0+(T+.5)*E,z:x.z0+(S+.5)*E,s:t.range(.8,1.2)});continue}const R=t.range(.6,2),I=t.range(9,36),L=x.x0+T*E+R,B=x.z0+S*E+R,W=x.x0+(T+1)*E-R,U=x.z0+(S+1)*E-R;if(d(L,B,W,U,I,t.pick(u),t.pick([16777215,15787734,14209736,15132394,15980992]),b),t.chance(.75)){const q=t.pick(h),V=new G(1582127);a.box(L+1,b+.6,U-.08,W-1,b+2.8,U+.06,V),a.box(L+.5,b+3.1,U-.1,W-.5,b+3.3,U+1.3,new G(t.pick([9054752,1722986,2779706,6109722]))),s.box(L+1,b+3.6,U-.05,W-1,b+4.5,U+.12,q)}}}else if(x.type==="residential"){const E=y/3;for(let T=0;T<3;T++)for(let S=0;S<3;S++){const R=x.x0+(T+.5)*E,I=x.z0+(S+.5)*E;if(t.chance(.2)){this.trees.push({x:R,z:I,s:t.range(.9,1.4)});continue}if(Ae==="liberty"&&t.chance(.55)){const L=t.range(6,8),B=t.range(10,15);d(R-L,I-6,R+L,I+6,B,"brownstone",t.pick([16777215,15787734,14866632]),b)}else{const L=t.range(5,8),B=t.range(5,8),W=t.range(5,9);d(R-L,I-B,R+L,I+B,W,"house",t.pick([16777215,16771529,14282976,16242390,14739199,16774320]),b)}t.chance(.7)&&this.trees.push({x:R+t.range(-9,9),z:I+(t.chance(.5)?9.2:-9.2),s:t.range(.7,1.1)})}}else if(x.type==="industrial")if(t.chance(.5))d(x.x0+2,x.z0+2,x.cx-2,x.z1-2,t.range(8,14),"industrial",t.pick([16777215,13687004,13221806]),b),d(x.cx+2,x.z0+2,x.x1-2,x.z1-2,t.range(8,14),"industrial",t.pick([16777215,13687004,13221806]),b);else{d(x.x0+3,x.z0+3,x.x1-3,x.cz-3,t.range(10,16),"industrial",t.pick([16777215,13687004]),b);for(let S=0;S<6;S++){const R=t.range(x.x0+6,x.x1-6),I=t.range(x.cz+4,x.z1-4),L=new G(t.pick([12597547,2719929,15965202,2600544,9323693]));a.box(R-3,b,I-1.2,R+3,b+2.6,I+1.2,L),this.addCollider(R-3,I-1.2,R+3,I+1.2,"prop",2.6)}const E=x.x1-8,T=x.cz+10;a.box(E-1.2,b,T-1.2,E+1.2,b+30,T+1.2,new G(7039851)),this.addCollider(E-1.2,T-1.2,E+1.2,T+1.2,"prop",30)}else if(x.type==="desert"){d(x.x0+4,x.z0+4,x.x1-4,x.z0+16,t.range(5,7),"concrete",t.pick([16771529,15980992,15132394]),b);const _=t.pick(h);s.box(x.cx-.5,b,x.z0+2,x.cx+.5,b+12,x.z0+3,_),this.addCollider(x.cx-.6,x.z0+1.9,x.cx+.6,x.z0+3.1,"prop",b+12),a.box(x.x0+8,b+4.5,x.cz,x.x0+28,b+5.2,x.cz+14,new G(14211288));for(const[E,T]of[[0,0],[8,0],[0,7],[8,7]])a.box(x.x0+9+E,b,x.cz+1+T,x.x0+10+E,b+4.5,x.cz+2+T,new G(9080724));for(const E of[12,18])a.box(x.x0+E,b,x.cz+6,x.x0+E+1.2,b+1.4,x.cz+7,new G(12597547)),this.addCollider(x.x0+E,x.cz+6,x.x0+E+1.2,x.cz+7,"prop",b+1.4)}}const m=i1(3);for(const x of e){const y=i[x].build();if(!y)continue;const{map:b,emissiveMap:_}=$x(x,100+e.indexOf(x)),E=new pt({map:b,emissiveMap:_,emissive:16777215,emissiveIntensity:0,vertexColors:!0,roughness:x==="glass"?.35:.85,metalness:x==="glass"?.5:0}),T=new N(y,E);T.castShadow=!0,T.receiveShadow=!0,this.group.add(T),(this.facadeMats||=[]).push(E)}const v=n.build();if(v){const x=new N(v,new pt({map:m,vertexColors:!0,roughness:1}));x.receiveShadow=!0,this.group.add(x)}const g=a.build();if(g){const x=new N(g,new pt({vertexColors:!0,roughness:.9}));x.castShadow=!0,x.receiveShadow=!0,this.group.add(x)}const p=s.build();if(p){this.neonMat=new re({vertexColors:!0,toneMapped:!1});const x=new N(p,this.neonMat);this.group.add(x)}const M=o.build();if(M){const x=Ph(12),y=new N(M,new pt({map:x,vertexColors:!0,roughness:1}));y.receiveShadow=!0,this.group.add(y)}const w=l.build();if(w){const x=zh(14),y=new N(w,new pt({map:x,vertexColors:!0,roughness:1}));y.receiveShadow=!0,this.group.add(y)}}buildAirport(t,e,i,n){const s=t.hBase+bi,a=new G(1,1,1),o=t.x1-t.x0,l=o<t.z1-t.z0;i.box(t.x0,s-.05,t.z0,t.x1,s+.05,t.z1,new G(3816512));const c=10,h=l?t.cx-o/4:t.cx,f=l?t.cz:t.cz-o/4,u=Math.min(o,t.z1-t.z0)-8;l?i.box(h-c/2,s+.05,t.z0+4,h+c/2,s+.12,t.z1-4,new G(2829617)):i.box(t.x0+4,s+.05,f-c/2,t.x1-4,s+.12,f+c/2,new G(2829617));for(let g=-u/2+4;g<u/2-2;g+=8)l?i.box(h-.25,s+.12,t.cz+g-1.5,h+.25,s+.16,t.cz+g+1.5,a):i.box(t.cx+g-1.5,s+.12,f-.25,t.cx+g+1.5,s+.16,f+.25,a);if(l){e(t.x0+4,t.z0+4,t.x0+16,t.z0+26,9,"concrete",15263978,s);for(const g of[t.z0+36,t.z0+52])i.box(t.x0+3,s,g,t.x0+17,s+7,g+12,new G(10133670)),this.addCollider(t.x0+3,g,t.x0+17,g+12,"building",s+7);i.box(t.x1-8,s,t.cz-3,t.x1-4,s+22,t.cz+1,new G(9080724)),i.box(t.x1-9,s+22,t.cz-4,t.x1-3,s+25,t.cz+2,new G(1715260)),this.addCollider(t.x1-9,t.cz-4,t.x1-3,t.cz+2,"building",s+25)}else{e(t.x0+4,t.z0+4,t.x0+26,t.z0+16,9,"concrete",15263978,s);for(const g of[t.x0+36,t.x0+52])i.box(g,s,t.z0+3,g+12,s+7,t.z0+17,new G(10133670)),this.addCollider(g,t.z0+3,g+12,t.z0+17,"building",s+7);i.box(t.cx-3,s,t.z1-8,t.cx+1,s+22,t.z1-4,new G(9080724)),i.box(t.cx-4,s+22,t.z1-9,t.cx+2,s+25,t.z1-3,new G(1715260)),this.addCollider(t.cx-4,t.z1-9,t.cx+2,t.z1-3,"building",s+25)}const d=l?t.x1-14:t.cx-10,m=l?t.cz+6:t.z1-16;this.buildPlane(d,m,l?Math.PI/2:0,i,s),this.buildPlane(d+(l?-8:10),m+(l?14:-8),l?Math.PI/2:.2,i,s);const v=l?{x:t.x0+10,z:t.z0+27.5}:{x:t.x0+27.5,z:t.z0+10};if(n&&(l?n.box(v.x-3,s+4.5,v.z-.4,v.x+3,s+5.7,v.z+.4,new G(3010815)):n.box(v.x-.4,s+4.5,v.z-3,v.x+3,s+5.7,v.z+.4,new G(3010815))),l?(i.box(v.x-3.2,s,v.z-.6,v.x+3.2,s+4.4,v.z+.6,new G(1715260)),this.addCollider(v.x-3.2,v.z-.6,v.x+3.2,v.z+.6,"building",s+4.4)):(i.box(v.x-.6,s,v.z-3.2,v.x+.6,s+4.4,v.z+3.2,new G(1715260)),this.addCollider(v.x-.6,v.z-3.2,v.x+.6,v.z+3.2,"building",s+4.4)),this._airportRegions||(this._airportRegions=new Set),!this._airportRegions.has(t.region)){this._airportRegions.add(t.region),this.airports.push({x:v.x+(l?0:2.2),z:v.z+(l?2.2:0),name:t.district});const g=l?{x:t.x1-14,z:t.z1-12}:{x:t.x1-14,z:t.z0+14},p=new N(new za(5.5,24),new pt({map:t1(),roughness:.9}));p.rotation.x=-Math.PI/2,p.position.set(g.x,s+.1,g.z),p.receiveShadow=!0,this.group.add(p),t.helipad=g}}buildPlane(t,e,i,n,s){const a=new be;a.position.set(t,s,e),a.rotation.y=i;const o=new pt({color:15263978,roughness:.4,metalness:.3}),l=new pt({color:12597547,roughness:.5}),c=new N(new jt(1.1,.9,14,10),o);c.rotation.x=Math.PI/2,c.position.y=1.6,c.castShadow=!0,a.add(c);const h=new N(new Oi(1.1,10,8),o);h.position.set(0,1.6,7),a.add(h);const f=new N(new _t(20,.25,2.6),o);f.position.set(0,1.4,.5),f.castShadow=!0,a.add(f);const u=new N(new _t(7,.2,1.6),o);u.position.set(0,2.2,-6.4),a.add(u);const d=new N(new _t(.25,3,2),l);d.position.set(0,3.4,-6.4),a.add(d);for(const m of[-1,1]){const v=new N(new jt(.55,.55,2.4,8),l);v.rotation.x=Math.PI/2,v.position.set(m*4.5,.9,.8),a.add(v)}this.group.add(a),this.addCollider(t-8,e-8,t+8,e+8,"prop",s+4)}buildDocks(t,e,i){const n=this.rng,s=t.hBase+bi;i.box(t.x0,s-.05,t.z0,t.x1,s+.05,t.z1,new G(7040885)),e(t.x0+3,t.z0+3,t.x0+22,t.z0+15,10,"industrial",13687004,s);for(let a=0;a<8;a++){const o=n.range(t.x0+8,t.x1-8),l=n.range(t.z0+22,t.z1-6),c=new G(n.pick([12597547,2719929,15965202,2600544,9323693,8359053])),h=n.chance(.4)?5.2:2.6;i.box(o-3,s,l-1.2,o+3,s+h,l+1.2,c),this.addCollider(o-3,l-1.2,o+3,l+1.2,"prop",s+h)}for(const a of[t.z0+30,t.z1-12]){const o=t.x1-10,l=new G(15105570);i.box(o-1,s,a-1,o+1,s+18,a+1,l),i.box(o-8,s+16,a-1,o+8,s+18,a+1,l),i.box(o+6,s+8,a-.5,o+8,s+16,a+.5,l),this.addCollider(o-1.2,a-1.2,o+1.2,a+1.2,"prop",s+18)}if(t.x1+30>880){i.box(t.x1-4,s-.5,t.cz-6,t.x1+46,s+.4,t.cz+6,new G(8028037));for(let a=0;a<=40;a+=10)for(const o of[-5,5])i.box(t.x1+a-.5,-2,t.cz+o-.5,t.x1+a+.5,s,t.cz+o+.5,new G(4869458))}}buildStadium(t,e){const i=t.hBase+bi,n=new N(new jt(27,29,12,24,1,!0),new pt({color:9080724,roughness:.8,side:Ve}));n.position.set(t.cx,i+6,t.cz),n.castShadow=!0,this.group.add(n);const s=new N(new za(25,24),new pt({color:4164142,roughness:1}));s.rotation.x=-Math.PI/2,s.position.set(t.cx,i+.1,t.cz),s.receiveShadow=!0,this.group.add(s);for(const[a,o]of[[-1,-1],[1,-1],[-1,1],[1,1]])e.box(t.cx+a*30-.5,i,t.cz+o*30-.5,t.cx+a*30+.5,i+20,t.cz+o*30+.5,new G(3882820)),e.box(t.cx+a*30-2,i+20,t.cz+o*30-1,t.cx+a*30+2,i+22,t.cz+o*30+1,new G(16774880));this.addCollider(t.cx-29,t.cz-29,t.cx+29,t.cz+29,"building",i+12)}buildBeach(t,e){const i=this.rng,n=t.hBase+bi;e.box(t.x0,n-.02,t.z0,t.x1,n+.06,t.z1,new G(.95,.88,.68),6);for(let h=0;h<6;h++)this.trees.push({x:i.range(t.x0+4,t.x1-4),z:i.range(t.z0+4,t.z1-4),s:i.range(1,1.5),palm:!0});const s=t.cx,a=t.cz,o=new G(7031339),l=new Pi;for(const[h,f]of[[-1,-1],[1,-1],[-1,1],[1,1]])l.box(s+h*1.4-.15,n,a+f*1.4-.15,s+h*1.4+.15,n+3,a+f*1.4+.15,o);l.box(s-1.8,n+3,a-1.8,s+1.8,n+4.6,a+1.8,new G(3920383)),l.box(s-2.1,n+4.6,a-2.1,s+2.1,n+4.9,a+2.1,new G(16053492));const c=new N(l.build(),new pt({vertexColors:!0,roughness:.9}));c.castShadow=!0,this.group.add(c),this.addCollider(s-1.9,a-1.9,s+1.9,a+1.9,"prop",n+5)}buildProps(){const t=this.rng;for(let e=0;e<=le;e++)for(let i=0;i<le;i++){if(this.roadV[e][i])for(let n=12;n<Lt-12;n+=22){const s=this.roadCoords[i]+n,a=this.roadCoords[e];this.lamps.push({x:a-8.6,z:s,rot:-Math.PI/2},{x:a+8.6,z:s,rot:Math.PI/2})}if(this.roadH[e][i])for(let n=12;n<Lt-12;n+=22)this.lamps.push({x:this.roadCoords[i]+n,z:this.roadCoords[e]-8.6,rot:Math.PI},{x:this.roadCoords[i]+n,z:this.roadCoords[e]+8.6,rot:0})}for(const{ix:e,iz:i}of this.junctions)for(const[n,s]of[[0,1],[0,-1],[1,0],[-1,0]]){if(!this.hasRoadSeg(e,i,n,s))continue;const a=this.roadCoords[e],o=this.roadCoords[i],l=-s,c=n,h=a+n*8.3+l*8.3,f=o+s*8.3+c*8.3;this.lightHeads.push({x:h,z:f,dx:n,dz:s,ix:e,iz:i,axis:s!==0?"z":"x"})}for(let e=0;e<500&&this.trees.filter(i=>i.palm).length<130;e++){const i=t.range(-1050,1050),n=t.range(-1050,1050);if(de(i,n)||this.onRoad(i,n)||this.blockAt(i,n))continue;let s=!1;for(const[a,o]of[[50,0],[-50,0],[0,50],[0,-50]])if(de(i+a,n+o)){s=!0;break}s&&this.trees.push({x:i,z:n,s:t.range(.9,1.5),palm:!0})}this.buildLampMeshes(),this.buildTreeMeshes(),this.buildRockMeshes(),this.buildTrafficLightMeshes(),this.buildStreetClutter(),this.buildBillboards()}buildBillboards(){const t=this.rng,e=new pt({color:2237995,roughness:.7}),i=Ae==="vice"?[1,1,4,1,5]:Ae==="liberty"?[2,2,5,3,2]:[3,4,5,1,3];let n=0,s=0;for(;n<8&&s++<120;){const{ix:a,iz:o}=this.junctions[Math.random()*this.junctions.length|0],l=this.roadCoords[a],c=this.roadCoords[o],h=l+t.range(-1,1)*16,f=c+t.range(-1,1)*16;if(de(h,f)||this.onRoad(h,f)||this.blockAt(h,f)||this.hash.query(h-4,h+4,f-4,f+4,[]).length)continue;const u=this.groundHeight(h,f),d=new N(new _t(7,3.5,.3),[e,e,e,e,new re({map:Rh(i[n%i.length])}),new re({map:Rh(i[(n+2)%i.length])})]);d.position.set(h,u+5.5,f),d.rotation.y=t.range(0,6.28),d.castShadow=!0,this.group.add(d);for(const m of[-2.2,2.2]){const v=new N(new _t(.35,5.5,.35),e);v.position.set(h+Math.cos(d.rotation.y)*m,u+2.6,f-Math.sin(d.rotation.y)*m),v.rotation.y=d.rotation.y,this.group.add(v)}this.addCollider(h-3.5,f-3.5,h+3.5,f+3.5,"prop",u+7),n++}}buildLampMeshes(){const t=this.lamps.length,e=new pe,i=new jt(.09,.13,7,8);i.translate(0,3.5,0);const n=new _t(.12,.12,2.2);n.translate(0,6.9,1);const s=new _t(.5,.18,.9);s.translate(0,6.85,2);const a=new pt({color:3882820,roughness:.6,metalness:.6});this.lampHeadMat=new pt({color:16777215,emissive:16769712,emissiveIntensity:0});const o=new Mi(ki([i,n]),a,t);o.castShadow=!0;const l=new Mi(s,this.lampHeadMat,t),c=[];this.lamps.forEach((f,u)=>{const d=this.groundHeight(f.x,f.z);e.position.set(f.x,d,f.z),e.rotation.set(0,f.rot,0),e.updateMatrix(),o.setMatrixAt(u,e.matrix),l.setMatrixAt(u,e.matrix),c.push(f.x+Math.sin(f.rot)*2,d+6.7,f.z+Math.cos(f.rot)*2),this.addCollider(f.x-.15,f.z-.15,f.x+.15,f.z+.15,"pole",7)}),this.group.add(o,l);const h=new we;h.setAttribute("position",new Qt(c,3)),this.lampGlowMat=new Ra({map:Rl(),color:16767392,size:6,transparent:!0,opacity:0,depthWrite:!1,blending:Ps,sizeAttenuation:!0}),this.lampGlow=new Pa(h,this.lampGlowMat),this.group.add(this.lampGlow),this.lampPositions=c}buildTreeMeshes(){const t=new pe,e=[...this.trees.filter(g=>!g.palm),...this.forestTrees||[]],i=this.trees.filter(g=>g.palm),n=new jt(.18,.3,2.6,7);n.translate(0,1.3,0);const s=ki([new Ss(1.9,1).translate(0,3.6,0),new Ss(1.4,1).translate(1,4.4,.4),new Ss(1.3,1).translate(-.9,4.3,-.5)]),a=new pt({color:5914410,roughness:1}),o=new pt({color:4160046,roughness:1,flatShading:!0}),l=new Mi(n,a,e.length),c=new Mi(s,o,e.length);l.castShadow=!0,c.castShadow=!0,c.receiveShadow=!0;const h=new G;e.forEach((g,p)=>{const M=this.groundHeight(g.x,g.z);t.position.set(g.x,M,g.z),t.rotation.set(0,this.rng()*6.28,0),t.scale.setScalar(g.s),t.updateMatrix(),l.setMatrixAt(p,t.matrix),c.setMatrixAt(p,t.matrix),c.setColorAt(p,h.setHSL(.26+this.rng()*.08,.5,.3+this.rng()*.15)),this.addCollider(g.x-.35,g.z-.35,g.x+.35,g.z+.35,"tree",M+3)}),this.group.add(l,c);const f=new jt(.14,.24,6,7);f.translate(0,3,0),f.rotateZ(.12);const u=[];for(let g=0;g<7;g++){const p=new Vs(.5,3.2,4);p.scale(1,1,.25),p.translate(0,1.4,0),p.rotateX(-1.9),p.rotateY(g/7*6.28),p.translate(.7,6,0),u.push(p)}const d=ki(u),m=new Mi(f,new pt({color:9071173,roughness:1}),i.length),v=new Mi(d,new pt({color:4034362,roughness:1,side:Ve}),i.length);m.castShadow=!0,v.castShadow=!0,i.forEach((g,p)=>{const M=this.groundHeight(g.x,g.z);t.position.set(g.x,M,g.z),t.rotation.set(0,this.rng()*6.28,0),t.scale.setScalar(g.s),t.updateMatrix(),m.setMatrixAt(p,t.matrix),v.setMatrixAt(p,t.matrix),this.addCollider(g.x-.3,g.z-.3,g.x+.3,g.z+.3,"tree",M+6)}),this.group.add(m,v)}buildRockMeshes(){const t=new pe,e=this.rocks||[],i=this.cacti||[];if(e.length){const n=new Ss(1.2,0),s=new Mi(n,new pt({color:9076594,roughness:1,flatShading:!0}),e.length);s.castShadow=!0,e.forEach((a,o)=>{const l=this.groundHeight(a.x,a.z);t.position.set(a.x,l,a.z),t.rotation.set(0,this.rng()*6.28,0),t.scale.set(a.s,a.s*.7,a.s),t.updateMatrix(),s.setMatrixAt(o,t.matrix),this.addCollider(a.x-.8,a.z-.8,a.x+.8,a.z+.8,"prop",l+1.5)}),this.group.add(s)}if(i.length){const n=ki([new jt(.35,.4,3.2,8).translate(0,1.6,0),new jt(.22,.24,1.4,7).translate(.55,1.9,0),new jt(.22,.24,1.1,7).translate(-.5,1.4,0)]),s=new Mi(n,new pt({color:4028980,roughness:1}),i.length);s.castShadow=!0,i.forEach((a,o)=>{const l=this.groundHeight(a.x,a.z);t.position.set(a.x,l,a.z),t.rotation.set(0,this.rng()*6.28,0),t.scale.setScalar(a.s),t.updateMatrix(),s.setMatrixAt(o,t.matrix),this.addCollider(a.x-.4,a.z-.4,a.x+.4,a.z+.4,"prop",l+3)}),this.group.add(s)}}buildTrafficLightMeshes(){const t=this.lightHeads,e=new pe,i=new jt(.1,.12,5.5,8);i.translate(0,2.75,0);const n=new _t(.4,1.1,.4);n.translate(0,4.6,0);const s=new pt({color:3093302,roughness:.7,metalness:.5}),a=new Mi(ki([i,n]),s,t.length),o=new Oi(.12,8,8);this.bulbs=new Mi(o,new re({toneMapped:!1}),t.length*3),t.forEach((l,c)=>{const h=this.groundHeight(l.x,l.z)+.15;e.position.set(l.x,h,l.z),e.rotation.set(0,0,0),e.updateMatrix(),a.setMatrixAt(c,e.matrix);for(let f=0;f<3;f++)e.position.set(l.x-l.dx*.22,h+4.95-f*.33,l.z-l.dz*.22),e.updateMatrix(),this.bulbs.setMatrixAt(c*3+f,e.matrix),this.bulbs.setColorAt(c*3+f,new G(2236962));this.addCollider(l.x-.15,l.z-.15,l.x+.15,l.z+.15,"pole",5)}),this.group.add(a,this.bulbs),this._bulbColors={red:new G(2.5,.15,.1),yellow:new G(2.5,1.8,.2),green:new G(.2,2.5,.6),off:new G(.08,.08,.08)}}buildStreetClutter(){const t=this.rng,e=new pe,i=[];for(const o of this.blocks)if(!(o.type==="park"||o.type==="lot"||o.type==="airport"||o.type==="stadium"||o.type==="beach"))for(let l=0;l<4;l++){const c=t.int(0,3),h=t.range(.1,.9),f=t.pick(["hydrant","bin","bench","bin"]);let u,d,m;c===0?(u=o.x0+h*(o.x1-o.x0),d=o.z0-1.6,m=Math.PI):c===1?(u=o.x0+h*(o.x1-o.x0),d=o.z1+1.6,m=0):c===2?(u=o.x0-1.6,d=o.z0+h*(o.z1-o.z0),m=-Math.PI/2):(u=o.x1+1.6,d=o.z0+h*(o.z1-o.z0),m=Math.PI/2),i.push({kind:f,x:u,z:d,rot:m})}const n=(o,l,c)=>{const h=i.filter(u=>u.kind===o);if(!h.length)return;const f=new Mi(l,c,h.length);f.castShadow=!0,h.forEach((u,d)=>{const m=this.blockAt(u.x,u.z),v=m?m.hBase+bi:bi;e.position.set(u.x,v,u.z),e.rotation.set(0,u.rot,0),e.updateMatrix(),f.setMatrixAt(d,e.matrix),this.addCollider(u.x-.4,u.z-.4,u.x+.4,u.z+.4,"prop",v+1)}),this.group.add(f)},s=ki([new jt(.16,.2,.8,8).translate(0,.4,0),new Oi(.18,8,8).translate(0,.85,0),new _t(.5,.12,.14).translate(0,.55,0)]);n("hydrant",s,new pt({color:14169130,roughness:.5,metalness:.3})),n("bin",new jt(.35,.3,1,10).translate(0,.5,0),new pt({color:3104058,roughness:.8}));const a=ki([new _t(1.8,.08,.5).translate(0,.45,0),new _t(1.8,.45,.08).translate(0,.72,-.22),new _t(.08,.45,.5).translate(-.8,.22,0),new _t(.08,.45,.5).translate(.8,.22,0)]);n("bench",a,new pt({color:7031339,roughness:.9}))}buildWater(){const t=this.maskN,e=new Uint8Array(t*t*4);for(let l=0;l<t*t;l++){const c=Math.max(0,Math.min(1,this.maskField[l]))*255;e[l*4]=c,e[l*4+1]=c,e[l*4+2]=c,e[l*4+3]=255}const i=document.createElement("canvas");i.width=i.height=t,i.getContext("2d").putImageData(new ImageData(new Uint8ClampedArray(e.buffer),t,t),0,0);const n=new vr(i),s=Ae==="vice"?{deep:409724,shallow:1364192}:Ae==="liberty"?{deep:667196,shallow:2783884}:{deep:471164,shallow:1023968};this.waterUniforms={uTime:{value:0},uSunDir:{value:new z(0,1,0)},uDeep:{value:new G(s.deep)},uShallow:{value:new G(s.shallow)},uSky:{value:new G(10474751)},uFogColor:{value:new G(3021)},uFogNear:{value:200},uFogFar:{value:900},uNight:{value:0},uMask:{value:n},uNormalMap:{value:c1()},uCaustic:{value:h1()}};const a=new ye({uniforms:this.waterUniforms,transparent:!0,vertexShader:`uniform float uTime; varying vec3 vWorld; varying vec2 vMaskUv; varying float vCrest;
        void main(){ vec3 p = position;
          float w1 = sin(p.x*0.11+uTime*1.6)*0.12 + sin(p.z*0.13-uTime*1.2)*0.10 + sin((p.x+p.z)*0.07+uTime*0.8)*0.14;
          float w2 = sin(p.x*0.31-uTime*2.2)*0.03 + sin(p.z*0.27+uTime*1.9)*0.03;
          p.y += w1 + w2; vCrest = clamp((w1+w2)*2.2+0.5, 0.0, 1.0);
          vec4 wp = modelMatrix*vec4(p,1.0); vWorld = wp.xyz; vMaskUv = (wp.xz + 1250.0) / 2500.0; gl_Position = projectionMatrix*viewMatrix*wp; }`,fragmentShader:`uniform float uTime; uniform vec3 uSunDir, uDeep, uShallow, uSky, uFogColor; uniform float uFogNear, uFogFar, uNight; uniform sampler2D uMask, uNormalMap, uCaustic; varying vec3 vWorld; varying vec2 vMaskUv; varying float vCrest;
        void main(){ float m = texture2D(uMask, vMaskUv).r;
          // layered ripple normals: broad swell + tight chop, both scrolling
          float e = 0.6;
          vec2 p = vWorld.xz;
          float h0 = sin(p.x*0.35+uTime*2.0)*0.5 + sin(p.y*0.42-uTime*1.7)*0.5 + sin((p.x+p.y)*0.16+uTime*1.1)*0.8 + sin(p.x*0.9-uTime*2.6)*0.18 + sin(p.y*0.8+uTime*2.2)*0.18;
          float hx = sin((p.x+e)*0.35+uTime*2.0)*0.5 + sin(((p.x+e)+p.y)*0.16+uTime*1.1)*0.8 + sin((p.x+e)*0.9-uTime*2.6)*0.18;
          float hz = sin(p.x*0.35+uTime*2.0)*0.5 + sin((p.y+e)*0.42-uTime*1.7)*0.5 + sin((p.x+(p.y+e))*0.16+uTime*1.1)*0.8 + sin((p.y+e)*0.8+uTime*2.2)*0.18;
          vec3 n = normalize(vec3((h0-hx)*1.4, 1.0, (h0-hz)*1.4));
          // photo-style ripple detail: two scrolling normal samples break the
          // sun into crawling sparkle instead of smooth analytic bands
          vec3 nd1 = texture2D(uNormalMap, p * 0.010 + vec2(uTime * 0.008, uTime * 0.005)).rgb * 2.0 - 1.0;
          vec3 nd2 = texture2D(uNormalMap, p * 0.029 - vec2(uTime * 0.011, -uTime * 0.007)).rgb * 2.0 - 1.0;
          n = normalize(n + vec3(nd1.x + nd2.x, 0.0, nd1.y + nd2.y) * 0.38);
          vec3 v = normalize(cameraPosition - vWorld);
          float fres = pow(1.0 - max(dot(n, v), 0.0), 2.0);
          vec3 base = mix(uDeep, uShallow, smoothstep(0.0, 0.55, m));
          // crest lightening so wave tops read bright blue
          base = mix(base, vec3(0.25, 0.65, 1.0), vCrest*0.3);
          vec3 col = mix(base, uSky, fres*0.55);
          // sun mirror: tight hot core + narrow glitter + pinpoint sparkle from detail normals
          vec3 h = normalize(uSunDir + v);
          float spec = pow(max(dot(n,h),0.0), 320.0) * 2.2 * (1.0-uNight*0.8);
          float glitter = pow(max(dot(n,h),0.0), 90.0) * 0.3 * (1.0-uNight*0.8) * (0.4+0.6*vCrest);
          float sparkle = pow(max(dot(n,h),0.0), 900.0) * 1.6 * (1.0-uNight*0.8);
          col += vec3(1.0,0.96,0.88)*(spec+glitter) + vec3(1.0)*sparkle;
          // shallow caustic web: two counter-scrolled samples interfere and crawl
          float ca1 = texture2D(uCaustic, p * 0.020 + vec2(uTime * 0.010, uTime * 0.013)).r;
          float ca2 = texture2D(uCaustic, p * 0.016 - vec2(uTime * 0.012, uTime * 0.008)).r;
          float web = pow(clamp((1.0 - ca1) * (1.0 - ca2) * 2.4, 0.0, 1.0), 2.0);
          float shBand = smoothstep(0.30, 0.48, m) * (1.0 - smoothstep(0.55, 0.75, m));
          col += uShallow * web * shBand * 0.55 * (1.0 - uNight);
          float foam = smoothstep(0.32, 0.48, m) * (1.0 - smoothstep(0.48, 0.64, m)) * (0.5+0.5*sin((vWorld.x+vWorld.z)*0.25 - uTime*2.0)); col = mix(col, vec3(0.95), foam*0.6);
          col *= mix(1.0, 0.25, uNight);
          float fog = smoothstep(uFogNear, uFogFar, length(cameraPosition - vWorld)); col = mix(col, uFogColor, fog);
          gl_FragColor = vec4(col, 0.95); }`}),o=new ui(5e3,5e3,120,120);o.rotateX(-Math.PI/2),this.water=new N(o,a),this.water.position.y=-.7,this.water.renderOrder=-1,this.group.add(this.water)}mapLabels(){return Ce.labels}makeMinimap(t=1024){const i=f=>(f+1250)*(t/2500),n=document.createElement("canvas");n.width=n.height=t;const s=n.getContext("2d");s.fillStyle="#16323e",s.fillRect(0,0,t,t);const a=(f,u,d,m,v)=>{s.fillStyle=v,s.fillRect(i(f),i(u),i(d)-i(f),i(m)-i(u))};a(-1250,-1250,1250,1250,"#7fa66a"),a(-340,-980,260,-380,"#c9a86a"),a(-340,-340,180,180,"#5d8a3c"),a(-920,300,-440,660,"#3d6b32");{const u=document.createElement("canvas");u.width=u.height=128;const d=u.getContext("2d"),m=d.createImageData(128,128);for(let v=0;v<128;v++)for(let g=0;g<128;g++){const p=v/127*2*1250-1250,M=g/127*2*1250-1250,w=ni(p,M),x=(g*128+v)*4;let y=0,b=0,_=0,E=0;w>9?(y=232,b=232,_=226,E=140):w>5?(y=138,b=106,_=74,E=128):w>2?(y=176,b=154,_=106,E=115):w>.4&&(y=138,b=154,_=90,E=90),m.data[x]=y,m.data[x+1]=b,m.data[x+2]=_,m.data[x+3]=E}d.putImageData(m,0,0),s.imageSmoothingEnabled=!0,s.drawImage(u,0,0,t,t)}const o=this.maskN,l=s.createImageData(o,o);for(let f=0;f<o*o;f++){const u=this.maskField[f]>.45?255:0;l.data[f*4+3]=u,l.data[f*4]=u,l.data[f*4+1]=u,l.data[f*4+2]=u}const c=document.createElement("canvas");c.width=c.height=o,c.getContext("2d").putImageData(l,0,0),s.save(),s.globalCompositeOperation="destination-in",s.imageSmoothingEnabled=!0,s.drawImage(c,0,0,t,t),s.restore();const h=t/2500;s.fillStyle="#cfcac0";for(const f of this.blocks)s.fillRect(i(f.x0),i(f.z0),(f.x1-f.x0)*h,(f.z1-f.z0)*h);s.strokeStyle="#e9e6dd",s.lineWidth=Math.max(1,14*h),s.beginPath();for(let f=0;f<=le;f++)for(let u=0;u<le;u++)this.roadV[f][u]&&(s.moveTo(i(this.roadCoords[f]),i(this.roadCoords[u])),s.lineTo(i(this.roadCoords[f]),i(this.roadCoords[u+1]))),this.roadH[f][u]&&(s.moveTo(i(this.roadCoords[u]),i(this.roadCoords[f])),s.lineTo(i(this.roadCoords[u+1]),i(this.roadCoords[f])));s.stroke(),s.strokeStyle="#c0392b",s.lineWidth=Math.max(2,16*h),s.beginPath();for(const f of Rs)f.axis==="x"?(s.moveTo(i(f.from),i(f.c)),s.lineTo(i(f.to),i(f.c))):(s.moveTo(i(f.c),i(f.from)),s.lineTo(i(f.c),i(f.to)));if(s.stroke(),En.length){s.strokeStyle="#7a2a20",s.lineWidth=Math.max(2,12*h),s.setLineDash([6,4]),s.beginPath();for(const f of En)f.axis==="x"?(s.moveTo(i(f.from),i(f.c)),s.lineTo(i(f.to),i(f.c))):(s.moveTo(i(f.c),i(f.from)),s.lineTo(i(f.c),i(f.to)));s.stroke(),s.setLineDash([])}return n}update(t,e,i,n){if(this.waterUniforms.uTime.value=e,n&&(this.waterUniforms.uSunDir.value.copy(n.sunDir),this.waterUniforms.uFogColor.value.copy(n.fogColor),this.waterUniforms.uNight.value=i,this.waterUniforms.uSky.value.copy(n.skyColor)),this.facadeMats)for(const s of this.facadeMats)s.emissiveIntensity=i*.75;if(this.lampHeadMat.emissiveIntensity=i*3,this.lampGlowMat.opacity=i*.7,this.neonMat&&(this.neonMat.opacity=1),this.fountains)for(const s of this.fountains)s.children[1].rotation.y+=t*.3;if(this.spinners)for(const s of this.spinners)s.rotation.z+=t*1.5;if(this._bulbT=(this._bulbT||0)+t,this._bulbT>.2){this._bulbT=0;const s=this._bulbColors;this.lightHeads.forEach((a,o)=>{const l=this.lightState(a.ix,a.iz,a.axis,e);this.bulbs.setColorAt(o*3,l==="red"?s.red:s.off),this.bulbs.setColorAt(o*3+1,l==="yellow"?s.yellow:s.off),this.bulbs.setColorAt(o*3+2,l==="green"?s.green:s.off)}),this.bulbs.instanceColor.needsUpdate=!0}}}class _1{constructor(t,e){this.scene=t,this.renderer=e,this.sun=new wh(16777215,3),this.sun.castShadow=!0;const i=this.sun.shadow;i.mapSize.set(2048,2048),i.camera.near=1,i.camera.far=400,i.camera.left=-90,i.camera.right=90,i.camera.top=90,i.camera.bottom=-90,i.bias=-8e-4,i.normalBias=.6,this.sunTarget=new pe,t.add(this.sunTarget),this.sun.target=this.sunTarget,t.add(this.sun),this.hemi=new kx(12572415,5917242,1.1),t.add(this.hemi),this.moon=new wh(9414358,0),t.add(this.moon),this.fog=new Vl(12571622,200,900),t.fog=this.fog,this.sunDir=new z(0,1,0),this.fogColor=new G,this.skyColor=new G,this.night=0,this.vibeId="fable",this.vibes={fable:{top:new G(0,0,0),horizon:new G(0,0,0),fogNear:1,fogFar:1,exposure:1,sun:[1,1,1]},liberty:{top:new G(-.04,-.02,.03),horizon:new G(-.1,-.06,.02),fogNear:1.15,fogFar:.9,exposure:.96,sun:[.9,.95,1.05]},vice:{top:new G(.02,.05,.06),horizon:new G(.06,.1,.06),fogNear:1.1,fogFar:1.1,exposure:1.08,sun:[1.05,.98,.92]}},this._vibeTmp=new G,this.uniforms={uTop:{value:new G},uHorizon:{value:new G},uSunDir:{value:new z},uSunColor:{value:new G},uNight:{value:0},uMoonDir:{value:new z}};const n=new ye({uniforms:this.uniforms,side:oi,depthWrite:!1,fog:!1,vertexShader:"varying vec3 vDir; void main(){ vDir = normalize(position); vec4 p = projectionMatrix*modelViewMatrix*vec4(position,1.0); gl_Position = p.xyww; }",fragmentShader:`uniform vec3 uTop,uHorizon,uSunDir,uSunColor,uMoonDir; uniform float uNight; varying vec3 vDir;
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
          gl_FragColor = vec4(col, 1.0); }`});this.dome=new N(new Oi(2500,32,16),n),this.dome.frustumCulled=!1,t.add(this.dome);const s=new we,a=[],o=[];for(let h=0;h<70;h++){const f=Math.random()*6.28,u=500+Math.random()*1400;a.push(Math.cos(f)*u,320+Math.random()*120,Math.sin(f)*u),o.push(90+Math.random()*160)}s.setAttribute("position",new Qt(a,3)),s.setAttribute("size",new Qt(o,1));const l=document.createElement("canvas");l.width=256,l.height=256;const c=l.getContext("2d");for(let h=0;h<26;h++){const f=40+Math.random()*176,u=100+Math.random()*56,d=14+Math.random()*34,m=c.createRadialGradient(f,u,0,f,u,d);m.addColorStop(0,"rgba(255,255,255,0.35)"),m.addColorStop(.6,"rgba(255,255,255,0.12)"),m.addColorStop(1,"rgba(255,255,255,0)"),c.fillStyle=m,c.fillRect(0,0,256,256)}this.cloudMat=new Ra({map:new vr(l),size:420,transparent:!0,opacity:.85,depthWrite:!1,sizeAttenuation:!0,color:16777215,fog:!1}),this.clouds=new Pa(s,this.cloudMat),t.add(this.clouds),this.buildImageBasedLight(t,e)}buildImageBasedLight(t,e){const s=document.createElement("canvas");s.width=128,s.height=64;const a=s.getContext("2d"),o=a.createLinearGradient(0,0,0,64*.52);o.addColorStop(0,"#3a6ea8"),o.addColorStop(.7,"#9fc3e8"),o.addColorStop(1,"#dfe9f2"),a.fillStyle=o,a.fillRect(0,0,128,64*.52);const l=a.createLinearGradient(0,64*.52,0,64);l.addColorStop(0,"#6a6255"),l.addColorStop(1,"#23211c"),a.fillStyle=l,a.fillRect(0,64*.52,128,64*.48);const c=a.createRadialGradient(128*.62,64*.2,0,128*.62,64*.2,16);c.addColorStop(0,"rgba(255,252,240,1)"),c.addColorStop(.25,"rgba(255,244,220,0.8)"),c.addColorStop(1,"rgba(255,244,220,0)"),a.fillStyle=c,a.fillRect(0,0,128,64*.52);const h=new vr(s);h.mapping=Sa,h.colorSpace=ri;const f=new bl(e);t.environment=f.fromEquirectangular(h).texture,t.environmentIntensity=.4,h.dispose(),f.dispose()}setVibe(t){this.vibeId=this.vibes[t]?t:"fable"}update(t,e){const i=(t-.25)*Math.PI*2,n=Math.sin(i),s=Math.cos(i);this.sunDir.set(s*.7,n,-.4+s*.2).normalize();const a=this.night=1-ra(-.18,.1,n),o=1-ra(0,.35,Math.abs(n)),l=ra(-.1,.25,n),c=new G().setRGB(Ht(.02,.22,l),Ht(.03,.45,l),Ht(.08,.85,l));c.lerp(new G(.35,.28,.5),o*.5*(1-a));const h=new G().setRGB(Ht(.05,.75,l),Ht(.06,.82,l),Ht(.12,.92,l));h.lerp(new G(1,.55,.25),o*.85*(1-a*.7));const f=new G().setRGB(1,Ht(.45,.95,l),Ht(.2,.85,l)),u=this.vibes[this.vibeId]||this.vibes.fable;return c.add(this._vibeTmp.copy(u.top).multiplyScalar(l)),h.add(this._vibeTmp.copy(u.horizon).multiplyScalar(l)),f.setRGB(Yt(f.r*u.sun[0],0,1.2),Yt(f.g*u.sun[1],0,1.2),Yt(f.b*u.sun[2],0,1.2)),this.uniforms.uTop.value.copy(c),this.uniforms.uHorizon.value.copy(h),this.uniforms.uSunDir.value.copy(this.sunDir),this.uniforms.uSunColor.value.copy(f).multiplyScalar(n>-.05?1:0),this.uniforms.uNight.value=a,this.uniforms.uMoonDir.value.copy(this.sunDir).negate(),this.sun.color.copy(f),this.sun.intensity=3.2*ra(-.02,.2,n),this.sun.position.copy(this.sunDir).multiplyScalar(180).add(e),this.sunTarget.position.copy(e),this.moon.intensity=.8*a,this.moon.position.copy(this.sunDir).multiplyScalar(-150).add(e),this.moon.target=this.sunTarget,this.hemi.color.copy(c).lerp(new G(.9,.95,1),.4*l),this.hemi.groundColor.setRGB(.35,.3,.25).multiplyScalar(Ht(.45,1,l)),this.hemi.intensity=Ht(.55,1.25,l),this.fogColor.copy(h).lerp(c,.35),this.fog.color.copy(this.fogColor),this.fog.near=Ht(120,220,l)*u.fogNear,this.fog.far=Ht(600,950,l)*u.fogFar,this.skyColor.copy(c),this.cloudMat.color.copy(new G(1,1,1).lerp(new G(.15,.15,.25),a)).lerp(new G(1,.6,.4),o*.6*(1-a)),this.cloudMat.opacity=.9,this.renderer.toneMappingExposure=Ht(.9,1.15,l)*u.exposure,a}}class Uh{constructor(t,e,i){this.max=e,this.n=0,this.pos=new Float32Array(e*3),this.vel=new Float32Array(e*3),this.life=new Float32Array(e),this.maxLife=new Float32Array(e),this.size=new Float32Array(e),this.col=new Float32Array(e*3),this.alpha=new Float32Array(e),this.grow=new Float32Array(e),this.drag=new Float32Array(e),this.grav=new Float32Array(e);const n=this.geo=new we;n.setAttribute("position",new Le(this.pos,3)),n.setAttribute("aSize",new Le(this.size,1)),n.setAttribute("aColor",new Le(this.col,3)),n.setAttribute("aAlpha",new Le(this.alpha,1)),n.setDrawRange(0,0),this.points=new Pa(n,i),this.points.frustumCulled=!1,t.add(this.points)}emit(t,e,i,n,s,a,o,l,c,h,f,u=0,d=0,m=0){let v;this.n<this.max?v=this.n++:v=Math.floor(Math.random()*this.max),this.pos[v*3]=t,this.pos[v*3+1]=e,this.pos[v*3+2]=i,this.vel[v*3]=n,this.vel[v*3+1]=s,this.vel[v*3+2]=a,this.life[v]=o,this.maxLife[v]=o,this.size[v]=l,this.col[v*3]=c,this.col[v*3+1]=h,this.col[v*3+2]=f,this.alpha[v]=1,this.grow[v]=u,this.drag[v]=d,this.grav[v]=m}update(t){let e=0;for(let i=0;i<this.n;i++){if(this.life[i]<=0)continue;if(this.life[i]-=t,this.life[i]<=0){this.alpha[i]=0;continue}const n=Math.exp(-this.drag[i]*t);this.vel[i*3]*=n,this.vel[i*3+2]*=n,this.vel[i*3+1]=this.vel[i*3+1]*n+this.grav[i]*t,this.pos[i*3]+=this.vel[i*3]*t,this.pos[i*3+1]+=this.vel[i*3+1]*t,this.pos[i*3+2]+=this.vel[i*3+2]*t,this.size[i]+=this.grow[i]*t;const s=this.life[i]/this.maxLife[i];this.alpha[i]=s<.5?s*2:1,e++}e===0&&(this.n=0),this.geo.setDrawRange(0,this.n),this.geo.attributes.position.needsUpdate=!0,this.geo.attributes.aSize.needsUpdate=!0,this.geo.attributes.aColor.needsUpdate=!0,this.geo.attributes.aAlpha.needsUpdate=!0}}function kh(r,t){return new ye({uniforms:{uMap:{value:r}},transparent:!0,depthWrite:!1,blending:t?Ps:Wn,vertexShader:`attribute float aSize; attribute vec3 aColor; attribute float aAlpha; varying vec3 vC; varying float vA;
      void main(){ vC = aColor; vA = aAlpha; vec4 mv = modelViewMatrix*vec4(position,1.0); gl_PointSize = aSize * 300.0 / -mv.z; gl_Position = projectionMatrix*mv; }`,fragmentShader:"uniform sampler2D uMap; varying vec3 vC; varying float vA; void main(){ vec4 t = texture2D(uMap, gl_PointCoord); gl_FragColor = vec4(vC, t.a*vA); if (gl_FragColor.a < 0.01) discard; }"})}class E1{constructor(t){this.scene=t,this.fire=new Uh(t,1500,kh(Rl(),!0)),this.smoke=new Uh(t,1500,kh(u1(),!1)),this.fire.points.renderOrder=10,this.smoke.points.renderOrder=9,this.tracerGeo=new we,this.tracerPos=new Float32Array(384),this.tracerGeo.setAttribute("position",new Le(this.tracerPos,3)),this.tracers=new ix(this.tracerGeo,new Au({color:16771488,transparent:!0,opacity:.9,toneMapped:!1})),this.tracers.frustumCulled=!1,t.add(this.tracers),this.tracerLife=new Float32Array(64),this.tracerN=0,this.flashes=[],this.lights=[],this.flashMat=new re({color:16765056,transparent:!0,opacity:.9,toneMapped:!1,depthWrite:!1}),this.flashGeo=new Oi(1,12,8),this.ringGeo=new _r(.6,1,32),this.ringMat=new re({color:16777215,transparent:!0,opacity:.6,side:Ve,depthWrite:!1}),this.skidMax=600,this.skidPos=new Float32Array(this.skidMax*4*3),this.skidAlpha=new Float32Array(this.skidMax*4);const e=[];for(let i=0;i<this.skidMax;i++)e.push(i*4,i*4+1,i*4+2,i*4,i*4+2,i*4+3);this.skidGeo=new we,this.skidGeo.setAttribute("position",new Le(this.skidPos,3)),this.skidGeo.setAttribute("aAlpha",new Le(this.skidAlpha,1)),this.skidGeo.setIndex(e),this.skidGeo.setDrawRange(0,0),this.skidMesh=new N(this.skidGeo,new ye({transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-4,vertexShader:"attribute float aAlpha; varying float vA; void main(){ vA = aAlpha; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }",fragmentShader:"varying float vA; void main(){ gl_FragColor = vec4(0.05,0.05,0.05, vA*0.55); }"})),this.skidMesh.frustumCulled=!1,t.add(this.skidMesh),this.skidI=0,this.skidCount=0,this.muzzleLight=new wr(16760928,0,12,2),t.add(this.muzzleLight),this.lightPool=[];for(let i=0;i<3;i++){const n=new wr(16752704,0,60,1.5);n.position.set(0,-100,0),t.add(n),this.lightPool.push(n)}this.dust=0}addTracer(t,e){const i=this.tracerN%64;this.tracerN++,this.tracerPos.set([t.x,t.y,t.z,e.x,e.y,e.z],i*6),this.tracerLife[i]=.06}muzzle(t,e){this.muzzleLight.position.copy(t),this.muzzleLight.intensity=40;for(let i=0;i<6;i++)this.fire.emit(t.x,t.y,t.z,e.x*6+vt(-2,2),vt(-1,2),e.z*6+vt(-2,2),.08,.5,1,.8,.3,4,8,0)}sparks(t,e,i,n=8,s=[1,.8,.4]){for(let a=0;a<n;a++)this.fire.emit(t,e,i,vt(-4,4),vt(1,5),vt(-4,4),vt(.2,.5),.12,...s,0,1,-12)}blood(t,e,i,n=10){for(let s=0;s<n;s++)this.smoke.emit(t,e,i,vt(-2,2),vt(.5,3),vt(-2,2),vt(.3,.6),.25,.5,.02,.02,.3,3,-9)}puff(t,e,i,n=6,s=.6){for(let a=0;a<n;a++)this.smoke.emit(t,e,i,vt(-1.5,1.5),vt(.5,2),vt(-1.5,1.5),vt(.4,.9),s,.6,.6,.6,1.2,2,.5)}carSmoke(t,e){Math.random()<e&&this.smoke.emit(t.x+vt(-.3,.3),t.y,t.z+vt(-.3,.3),vt(-.5,.5),vt(1,2.2),vt(-.5,.5),vt(1.2,2.2),.7,.25,.25,.25,1.6,1.5,.3)}carFire(t){this.fire.emit(t.x+vt(-.4,.4),t.y,t.z+vt(-.4,.4),vt(-.4,.4),vt(1.5,3.5),vt(-.4,.4),vt(.3,.7),.9,1,vt(.3,.6),.05,.5,2,1),Math.random()<.5&&this.smoke.emit(t.x,t.y+.5,t.z,vt(-.5,.5),vt(2,3),vt(-.5,.5),vt(1.5,3),1,.08,.08,.08,2.2,1.2,.4)}explosion(t,e,i,n=1){for(let l=0;l<90;l++){const c=vt(0,6.28),h=vt(2,14)*n;this.fire.emit(t,e+.5,i,Math.cos(c)*h,vt(2,12)*n,Math.sin(c)*h,vt(.4,1.1),vt(.8,2)*n,1,vt(.35,.7),.1,1.5,3,-4)}for(let l=0;l<60;l++){const c=vt(0,6.28),h=vt(1,6)*n;this.smoke.emit(t,e+1,i,Math.cos(c)*h,vt(3,9)*n,Math.sin(c)*h,vt(1.5,3.5),vt(1.5,3)*n,.1,.1,.1,3,1.5,.8)}this.sparks(t,e+1,i,40,[1,.9,.5]);const s=new N(this.flashGeo,this.flashMat.clone());s.position.set(t,e+1,i),s.scale.setScalar(.5),this.scene.add(s),this.flashes.push({m:s,t:0,life:.45,scale:6*n});const a=new N(this.ringGeo,this.ringMat.clone());a.position.set(t,e+.3,i),a.rotation.x=-Math.PI/2,this.scene.add(a),this.flashes.push({m:a,t:0,life:.6,scale:18*n,ring:!0});const o=this.lightPool.reduce((l,c)=>l.intensity<=c.intensity?l:c);o.position.set(t,e+2,i),o.intensity=400*n,o.distance=60*n,this.lights.some(l=>l.l===o)||this.lights.push({l:o,t:0,life:.9})}skid(t,e,i,n,s,a,o){const l=this.skidI;this.skidI=(this.skidI+1)%this.skidMax,this.skidCount=Math.min(this.skidCount+1,this.skidMax);const c=-s*a/2,h=n*a/2,f=n*.25,u=s*.25;this.skidPos.set([t-c-f,i,e-h-u,t+c-f,i,e+h-u,t+c+f,i,e+h+u,t-c+f,i,e-h+u],l*12),this.skidAlpha.fill(o,l*4,l*4+4),this.skidGeo.setDrawRange(0,this.skidCount*6),this.skidGeo.attributes.position.needsUpdate=!0,this.skidGeo.attributes.aAlpha.needsUpdate=!0}update(t){this.fire.update(t),this.smoke.update(t);for(let e=0;e<64;e++)this.tracerLife[e]>0&&(this.tracerLife[e]-=t,this.tracerLife[e]<=0&&this.tracerPos.fill(0,e*6,e*6+6));this.tracerGeo.attributes.position.needsUpdate=!0,this.muzzleLight.intensity*=Math.exp(-30*t);for(let e=this.flashes.length-1;e>=0;e--){const i=this.flashes[e];i.t+=t;const n=i.t/i.life;i.m.scale.setScalar(.5+i.scale*(i.ring?n:Math.sqrt(n))),i.m.material.opacity=(1-n)*(i.ring?.5:.9),n>=1&&(this.scene.remove(i.m),i.m.material.dispose(),this.flashes.splice(e,1))}for(let e=this.lights.length-1;e>=0;e--){const i=this.lights[e];i.t+=t,i.l.intensity*=Math.exp(-6*t),i.t>i.life&&(i.l.intensity=0,this.lights.splice(e,1))}}}class A1{constructor(){this.ctx=null,this.ready=!1,this.radioStation=0,this.sirenVoices=[]}init(){if(this.ctx)return;const t=this.ctx=new(window.AudioContext||window.webkitAudioContext);this.master=t.createGain(),this.master.gain.value=.6,this.master.connect(t.destination),this.sfx=t.createGain(),this.sfx.connect(this.master),this.musicBus=t.createGain(),this.musicBus.gain.value=0,this.musicBus.connect(this.master);const e=t.sampleRate*2,i=t.createBuffer(1,e,t.sampleRate),n=i.getChannelData(0);for(let s=0;s<e;s++)n[s]=Math.random()*2-1;this.noiseBuf=i,this.buildEngine(),this.buildAmbience(),this.buildSiren(),this.buildRadio(),this.ready=!0}resume(){this.ctx&&this.ctx.state==="suspended"&&this.ctx.resume()}buildEngine(){const t=this.ctx;this.engGain=t.createGain(),this.engGain.gain.value=0,this.engFilter=t.createBiquadFilter(),this.engFilter.type="lowpass",this.engFilter.frequency.value=600,this.engFilter.Q.value=2,this.engFilter.connect(this.engGain),this.engGain.connect(this.sfx),this.osc1=t.createOscillator(),this.osc1.type="sawtooth",this.osc2=t.createOscillator(),this.osc2.type="square";const e=t.createGain();e.gain.value=.35,this.osc1.connect(this.engFilter),this.osc2.connect(e),e.connect(this.engFilter),this.osc1.start(),this.osc2.start(),this.roadSrc=t.createBufferSource(),this.roadSrc.buffer=this.noiseBuf,this.roadSrc.loop=!0;const i=t.createBiquadFilter();i.type="lowpass",i.frequency.value=400,this.roadGain=t.createGain(),this.roadGain.gain.value=0,this.roadSrc.connect(i),i.connect(this.roadGain),this.roadGain.connect(this.sfx),this.roadSrc.start(),this.skidSrc=t.createBufferSource(),this.skidSrc.buffer=this.noiseBuf,this.skidSrc.loop=!0;const n=t.createBiquadFilter();n.type="bandpass",n.frequency.value=1800,n.Q.value=3,this.skidGain=t.createGain(),this.skidGain.gain.value=0,this.skidSrc.connect(n),n.connect(this.skidGain),this.skidGain.connect(this.sfx),this.skidSrc.start()}setEngine(t,e,i,n,s){if(!this.ready)return;const a=this.ctx.currentTime,o=t?.1+i*.12+n*.05:0;this.engGain.gain.setTargetAtTime(o,a,.08);const l=45+e*190;this.osc1.frequency.setTargetAtTime(l,a,.05),this.osc2.frequency.setTargetAtTime(l*.5+1.5,a,.05),this.engFilter.frequency.setTargetAtTime(400+e*1800+i*600,a,.08),this.roadGain.gain.setTargetAtTime(t?n*.25:0,a,.1),this.skidGain.gain.setTargetAtTime(t?s*.35:0,a,.05)}buildAmbience(){const t=this.ctx,e=t.createBufferSource();e.buffer=this.noiseBuf,e.loop=!0;const i=t.createBiquadFilter();i.type="lowpass",i.frequency.value=220;const n=t.createGain();n.gain.value=.05,e.connect(i),i.connect(n),n.connect(this.sfx),e.start(),this.ambGain=n}buildSiren(){const t=this.ctx;this.sirenGain=t.createGain(),this.sirenGain.gain.value=0,this.sirenGain.connect(this.sfx),this.sirenOsc=t.createOscillator(),this.sirenOsc.type="triangle",this.sirenOsc.frequency.value=700;const e=t.createGain();e.gain.value=.4,this.sirenOsc.connect(e),e.connect(this.sirenGain),this.sirenOsc.start(),this.sirenPhase=0}setSiren(t,e){if(!this.ready)return;const i=this.ctx.currentTime;if(this.sirenGain.gain.setTargetAtTime(t*.25,i,.1),t>.001){this.sirenPhase+=e*1.4;const n=620+280*(.5+.5*Math.sin(this.sirenPhase*Math.PI*2));this.sirenOsc.frequency.setTargetAtTime(n,i,.03)}}noiseBurst(t,e,i,n,s="bandpass",a=t){if(!this.ready||!this.ctx)return;const o=this.ctx,l=o.currentTime,c=o.createBufferSource();c.buffer=this.noiseBuf,c.playbackRate.value=1;const h=o.createBiquadFilter();h.type=s,h.frequency.value=e,h.Q.value=i;const f=o.createGain();f.gain.setValueAtTime(n,l),f.gain.exponentialRampToValueAtTime(.001,l+a),c.connect(h),h.connect(f),f.connect(this.sfx),c.start(l,Math.random()),c.stop(l+t+.05)}tone(t,e,i,n="sine",s=null){if(!this.ready||!this.ctx)return;const a=this.ctx,o=a.currentTime,l=a.createOscillator();l.type=n,l.frequency.setValueAtTime(t,o),s&&l.frequency.exponentialRampToValueAtTime(s,o+e);const c=a.createGain();c.gain.setValueAtTime(i,o),c.gain.exponentialRampToValueAtTime(.001,o+e),l.connect(c),c.connect(this.sfx),l.start(o),l.stop(o+e+.05)}gunshot(t="pistol"){this.ready&&(t==="shotgun"?(this.noiseBurst(.35,500,.7,.9,"lowpass",.3),this.noiseBurst(.15,2500,1,.5),this.tone(90,.2,.6,"sine",40)):t==="uzi"?(this.noiseBurst(.08,1800,1.2,.5),this.tone(220,.06,.35,"square",80)):t==="rifle"?(this.noiseBurst(.18,1200,1,.7),this.tone(140,.12,.5,"sine",50)):(this.noiseBurst(.12,1400,1,.6),this.tone(180,.09,.45,"sine",60)))}explosion(){this.ready&&(this.noiseBurst(1.4,180,.5,1.2,"lowpass",1.2),this.tone(60,.9,.9,"sine",25),this.noiseBurst(.4,3e3,.8,.3))}crash(t){if(!this.ready)return;const e=Yt(t/15,.15,1);this.noiseBurst(.25,300+e*600,.8,.35+.6*e,"lowpass",.25),this.tone(120,.15,.4*e,"triangle",50),e>.5&&this.noiseBurst(.3,4e3,2,.2*e)}thud(){this.ready&&(this.noiseBurst(.12,200,1,.5,"lowpass"),this.tone(80,.12,.4,"sine",40))}punch(){this.ready&&(this.noiseBurst(.08,900,1.5,.4),this.tone(150,.08,.3,"triangle",60))}pickup(){this.ready&&(this.tone(880,.08,.25,"square"),setTimeout(()=>this.ready&&this.tone(1320,.12,.25,"square"),70))}cash(){this.ready&&(this.tone(1200,.06,.2,"square"),setTimeout(()=>this.ready&&this.tone(1600,.06,.2,"square"),60),setTimeout(()=>this.ready&&this.tone(2e3,.1,.2,"square"),120))}horn(t){if(!this.ready)return;const e=this.ctx;if(t&&!this.hornOsc){const i=e.createGain();i.gain.value=.12;const n=e.createOscillator();n.type="square",n.frequency.value=420;const s=e.createOscillator();s.type="square",s.frequency.value=520;const a=e.createBiquadFilter();a.frequency.value=1500,n.connect(a),s.connect(a),a.connect(i),i.connect(this.sfx),n.start(),s.start(),this.hornOsc=[n,s]}!t&&this.hornOsc&&(this.hornOsc.forEach(i=>i.stop()),this.hornOsc=null)}ui(){this.ready&&this.tone(600,.05,.15,"square")}missionPassed(){this.ready&&[0,.12,.24,.42].forEach((t,e)=>setTimeout(()=>this.ready&&this.tone([523,659,784,1047][e],.35,.25,"triangle"),t*1e3))}wasted(){this.ready&&(this.tone(220,1.6,.35,"sawtooth",55),this.noiseBurst(1,200,.5,.3,"lowpass",1))}stars(){this.ready&&this.tone(300,.15,.25,"square",600)}buildRadio(){this.stations=[{name:"Neon FM",bpm:112,style:"synthwave"},{name:"Bounce 105",bpm:92,style:"hiphop"},{name:"Vibe Radio",bpm:124,style:"house"},{name:"Radio Off",bpm:0,style:"off"}],this.radioStation=0,this.step=0,this.nextNoteT=0,this.radioOn=!1,this.scales={synthwave:[0,3,7,10,12,15,19],hiphop:[0,2,3,7,8,12],house:[0,4,7,11,12,14,16]},this.seed=1,this.bar=0}setRadio(t){this.ready&&(this.radioOn=t,this.musicBus.gain.setTargetAtTime(t&&this.stations[this.radioStation].style!=="off"?.55:0,this.ctx.currentTime,.2))}nextStation(){return this.radioStation=(this.radioStation+1)%this.stations.length,this.step=0,this.setRadio(this.radioOn),this.stations[this.radioStation].name}rnd(){return this.seed=this.seed*16807%2147483647,this.seed/2147483647}note(t,e,i,n,s,a=this.musicBus,o=0){const l=this.ctx,c=l.createOscillator();c.type=s,c.frequency.setValueAtTime(t,e);const h=l.createGain();if(h.gain.setValueAtTime(1e-4,e),h.gain.exponentialRampToValueAtTime(n,e+.01),h.gain.exponentialRampToValueAtTime(1e-4,e+i),o){const f=l.createBiquadFilter();f.type="lowpass",f.frequency.setValueAtTime(o,e),f.frequency.exponentialRampToValueAtTime(200,e+i),c.connect(f),f.connect(h)}else c.connect(h);h.connect(a),c.start(e),c.stop(e+i+.02)}drum(t,e){const i=this.ctx;if(t==="kick"){const n=i.createOscillator();n.frequency.setValueAtTime(150,e),n.frequency.exponentialRampToValueAtTime(40,e+.12);const s=i.createGain();s.gain.setValueAtTime(.9,e),s.gain.exponentialRampToValueAtTime(.001,e+.25),n.connect(s),s.connect(this.musicBus),n.start(e),n.stop(e+.3)}else{const n=i.createBufferSource();n.buffer=this.noiseBuf;const s=i.createBiquadFilter();s.type=t==="hat"?"highpass":"bandpass",s.frequency.value=t==="hat"?7e3:1800;const a=i.createGain(),o=t==="hat"?.04:.18;a.gain.setValueAtTime(t==="hat"?.2:.5,e),a.gain.exponentialRampToValueAtTime(.001,e+o),n.connect(s),s.connect(a),a.connect(this.musicBus),n.start(e,Math.random()),n.stop(e+o+.02)}}updateRadio(){if(!this.ready||!this.radioOn)return;const t=this.stations[this.radioStation];if(t.style==="off")return;const e=this.ctx,i=60/t.bpm/4;for(this.nextNoteT<e.currentTime&&(this.nextNoteT=e.currentTime+.05);this.nextNoteT<e.currentTime+.25;){const n=this.step%16,s=this.nextNoteT,a=this.scales[t.style],o=55*Math.pow(2,[0,0,5,3][Math.floor(this.step/64)%4]/12),l=Math.floor(this.step/16)%4,c=o*Math.pow(2,[0,3,5,7][l]/12);if(t.style==="synthwave"){if(n%4===0&&this.drum("kick",s),(n===4||n===12)&&this.drum("snare",s),n%2===1&&this.drum("hat",s),this.note(c*Math.pow(2,a[[0,2,4,6][n%4]]/12)*2,s,i*.9,.12,"sawtooth",this.musicBus,2500),n%8===0&&this.note(c/1,s,i*7,.25,"square",this.musicBus,400),n===0&&l%2===0)for(const h of[0,2,4])this.note(c*2*Math.pow(2,a[h]/12),s,i*14,.06,"triangle")}else t.style==="hiphop"?((n===0||n===7||n===10)&&this.drum("kick",s),(n===4||n===12)&&this.drum("snare",s),n%2===0&&this.drum("hat",s),(n===0||n===6||n===11)&&this.note(c,s,i*3,.35,"sine"),this.rnd()<.35&&this.note(c*4*Math.pow(2,a[Math.floor(this.rnd()*a.length)]/12),s,i*2,.07,"triangle",this.musicBus,1800)):(n%4===0&&this.drum("kick",s),n%4===2&&this.drum("hat",s),(n===4||n===12)&&this.drum("snare",s),n%4===2&&this.note(c*2,s,i*1.5,.22,"sawtooth",this.musicBus,900),n%2===0&&this.note(c*4*Math.pow(2,a[(n/2+l)%a.length]/12),s,i*.8,.07,"square",this.musicBus,3e3));this.step++,this.nextNoteT+=i}}}const C1=.16,oa=.25;function la(r,t=C1){if(Math.abs(r)<t)return 0;const e=(Math.abs(r)-t)/(1-t);return Math.sign(r)*Math.min(1,e)}class R1{constructor(t){this.keys=new Set,this.pressed=new Set,this.mouse={dx:0,dy:0,left:!1,right:!1,leftPressed:!1,wheel:0},this.locked=!1,this.canvas=t,window.addEventListener("keydown",e=>{e.repeat||(this.keys.add(e.code),this.pressed.add(e.code),["Space","Tab","F1"].includes(e.code)&&e.preventDefault())}),window.addEventListener("keyup",e=>this.keys.delete(e.code)),window.addEventListener("blur",()=>{this.keys.clear(),this.mouse.left=this.mouse.right=!1}),document.addEventListener("mousemove",e=>{this.locked&&(this.mouse.dx+=e.movementX,this.mouse.dy+=e.movementY)}),document.addEventListener("mousedown",e=>{this.locked&&(e.button===0&&(this.mouse.left=!0,this.mouse.leftPressed=!0),e.button===2&&(this.mouse.right=!0))}),document.addEventListener("mouseup",e=>{e.button===0&&(this.mouse.left=!1),e.button===2&&(this.mouse.right=!1)}),document.addEventListener("wheel",e=>{this.locked&&(this.mouse.wheel+=Math.sign(e.deltaY))},{passive:!0}),document.addEventListener("contextmenu",e=>e.preventDefault()),document.addEventListener("pointerlockchange",()=>{this.locked=document.pointerLockElement===t,this.onLockChange?.(this.locked)}),this.padHeld=new Set,this.padPressed=new Set,this.pad={connected:!1,id:"",lx:0,ly:0,rx:0,ry:0,lt:0,rt:0},this._gpPrev=[],this._gpIndex=-1,window.addEventListener("gamepadconnected",e=>{this._gpIndex=e.gamepad.index,this.onPadChange?.(!0,e.gamepad.id)}),window.addEventListener("gamepaddisconnected",()=>{this._gpIndex=-1,this.padHeld.clear(),this.pad={connected:!1,id:"",lx:0,ly:0,rx:0,ry:0,lt:0,rt:0},this.onPadChange?.(!1,"")})}lock(){try{this.canvas.requestPointerLock?.()?.catch?.(()=>{})}catch{}}get gamepadConnected(){return this.pad.connected}get gamepadId(){return this.pad.id}pollGamepad(){this.padPressed.clear();let t=null;try{const d=navigator.getGamepads?navigator.getGamepads():[];this._gpIndex>=0&&d&&d[this._gpIndex]?.connected?t=d[this._gpIndex]:d&&(t=Array.from(d).find(m=>m&&m.connected)||null)}catch{t=null}if(!t){this.pad.connected&&(this.padHeld.clear(),this.pad={connected:!1,id:"",lx:0,ly:0,rx:0,ry:0,lt:0,rt:0},this.onPadChange?.(!1,"")),this._gpPrev=[];return}const e=this.pad.connected,i=d=>t.buttons[d]?.pressed||!1,n=d=>t.buttons[d]?.value||0,s=Math.max(n(6),i(6)?1:0),a=Math.max(n(7),i(7)?1:0),o=la(t.axes[0]||0),l=la(t.axes[1]||0),c=la(t.axes[2]||0),h=la(t.axes[3]||0);this.pad={connected:!0,id:t.id||"",lx:o,ly:l,rx:c,ry:h,lt:s,rt:a,raw:t},e||this.onPadChange?.(!0,this.pad.id),this.mouse.dx+=c*26,this.mouse.dy+=h*20,Math.abs(c)<.01&&Math.abs(h)<.01&&(i(14)&&(this.mouse.dx-=12),i(15)&&(this.mouse.dx+=12));const f=(d,m)=>{const v=this.padHeld.has(d);m&&!v?(this.padHeld.add(d),this.padPressed.add(d)):!m&&v&&this.padHeld.delete(d)},u=(d,m)=>(m&&!this.padHeld.has(d+":e")?(this.padHeld.add(d+":e"),this.padPressed.add(d)):m||this.padHeld.delete(d+":e"),m);f("jump",i(0)),f("sprint",i(1)||i(10)),f("interact",i(2)),f("enter",i(3)),f("aim",s>oa||i(4)),f("fire",a>oa),f("firePressed",u("fireEdge",a>oa)),f("driveby",i(5)),f("drivebyPressed",u("drivebyEdge",i(5))),f("nextWeapon",i(5)),f("prevWeapon",i(4)),f("horn",i(15)||i(2)),f("radio",i(14)),f("camera",i(11)),f("handbrake",i(0)),f("map",i(8)),f("pause",i(9)),f("help",!1),f("skiptime",!1),f("ao",!1),f("dUp",i(12)),f("dDown",i(13)),this._gpPrev=t.buttons.map(d=>d.pressed)}rumble(t=.6,e=.4,i=120){try{const s=this.pad.raw?.vibrationActuator;return s?.playEffect?(s.playEffect("dual-rumble",{strongMagnitude:t,weakMagnitude:e,duration:i}).catch?.(()=>{}),!0):!1}catch{return!1}}down(t){if(this.padHeld.has(t))return!0;if(t==="forward"&&this.pad.rt>oa)return!1;const e=Ah[t];return e?e.some(i=>this.keys.has(i)):!1}hit(t){if(this.padPressed.has(t))return!0;const e=Ah[t];return e?e.some(i=>this.pressed.has(i)):!1}hitCode(t){return this.pressed.has(t)}axis(t,e){const i=(this.down(e)?1:0)-(this.down(t)?1:0);return t==="left"&&e==="right"&&this.pad.lx!==0?i!==0?i:this.pad.lx:t==="back"&&e==="forward"&&this.pad.ly!==0?i!==0?i:-this.pad.ly:i}footMove(){const t=this.axis("left","right"),e=this.axis("back","forward");if(this.pad.lx!==0||this.pad.ly!==0){const i=Math.abs(t)>.01&&this.pad.lx===0?t:Math.abs(this.pad.lx)>Math.abs(t)?this.pad.lx:t,n=Math.abs(e)>.01&&this.pad.ly===0?e:Math.abs(-this.pad.ly)>Math.abs(e)?-this.pad.ly:e;return{x:i,y:n,mag:Math.min(1,Math.hypot(i,n))}}return{x:t,y:e,mag:Math.min(1,Math.hypot(t,e))}}drive(){const t=this.down("forward")?1:0,e=this.down("back")?1:0,i=Math.max(t,this.pad.rt),n=Math.max(e,this.pad.lt);let s=-this.axis("left","right");return{throttle:i,brake:n,steer:s}}get firing(){return this.mouse.left||this.padHeld.has("fire")||this.padHeld.has("driveby")}get firingPressed(){return this.mouse.leftPressed||this.padPressed.has("firePressed")||this.padPressed.has("fire")||this.padPressed.has("drivebyPressed")||this.padPressed.has("driveby")}get vehicleFiring(){return this.mouse.left||this.padHeld.has("driveby")}get vehicleFiringPressed(){return this.mouse.leftPressed||this.padPressed.has("drivebyPressed")||this.padPressed.has("driveby")}get aiming(){return this.mouse.right||this.padHeld.has("aim")}endFrame(){this.pressed.clear(),this.padPressed.clear(),this.mouse.dx=0,this.mouse.dy=0,this.mouse.leftPressed=!1,this.mouse.wheel=0}}class P1{constructor(t,e){this.cam=t,this.city=e,this.yaw=0,this.pitch=.18,this.userYaw=0,this.idleT=0,this.pos=new z,this.look=new z,this.shake=0,this.shakeV=new z,this.fov=62,this.mode="foot",this.curDist=4,this.recoil=0,this._target=new z,this._desired=new z}addShake(t){this.shake=Math.min(1.5,this.shake+t)}update(t,e,i,n,s,a,o,l=.0022){this.mode=a;const c=e.mouse.dx*l,h=e.mouse.dy*l;Math.abs(c)+Math.abs(h)>0?this.idleT=0:this.idleT+=t,this.yaw-=c,this.pitch=Yt(this.pitch+h,-.35,.9);let u,d,m,v=0;if(a==="car"||a==="air"){const B=Math.min(1,s/30),W=Ns(Nu(n,o,B*.6)+Math.PI);this.idleT>1.2&&(this.yaw=Gi(this.yaw,W,3.5+B*3,t)),this.idleT>1.2&&(this.pitch=se(this.pitch,.16+B*.06,2,t)),u=6.2+B*2.2,d=1.9+B*.5,m=62+B*16}else a==="aim"?(u=2.4,d=1.45,m=50,v=1.05):(u=4.2,d=1.6,m=62,s>1&&this.idleT>1.6&&(this.yaw=Gi(this.yaw,n+Math.PI,.8,t)));this.fov=se(this.fov,m,4,t),this.curDist=se(this.curDist,u,a==="aim"?14:5,t);const g=Math.sin(this.yaw),p=Math.cos(this.yaw),M=p,w=-g,x=this._target.set(i.x+M*v,i.y+d,i.z+w*v),y=Math.sin(this.pitch),b=Math.cos(this.pitch),_=this._desired.set(x.x+g*b*this.curDist,x.y+y*this.curDist,x.z+p*b*this.curDist),E=_.x-x.x,T=_.z-x.z,S=Math.hypot(E,T);if(S>.01){const B=La(this.city.hash,x.x,x.z,E/S,T/S,S+.3,W=>W.kind==="building"&&(W.maxY??999)>Math.min(_.y,x.y)-.5);if(B.t<S+.3&&B.box){const W=Math.max(.12,(B.t-.4)/S);_.set(x.x+E*W,x.y+(_.y-x.y)*W,x.z+T*W)}}const R=this.city.groundHeight(_.x,_.z)+.35;_.y<R&&(_.y=R);const I=a==="car"||a==="air"?12:18;this.pos.x=se(this.pos.x,_.x,I,t),this.pos.y=se(this.pos.y,_.y,I,t),this.pos.z=se(this.pos.z,_.z,I,t),this.look.x=se(this.look.x,x.x,25,t),this.look.y=se(this.look.y,x.y,25,t),this.look.z=se(this.look.z,x.z,25,t),this.shake=Math.max(0,this.shake-t*2.2),this.recoil=se(this.recoil,0,12,t);const L=this.shake*this.shake*.35;this.shakeV.set((Math.random()-.5)*L,(Math.random()-.5)*L,(Math.random()-.5)*L),this.cam.position.copy(this.pos).add(this.shakeV),this.cam.lookAt(this.look.x+this.shakeV.x*.5,this.look.y+this.recoil*.4,this.look.z+this.shakeV.z*.5),(a==="car"||a==="air")&&this.cam.rotateZ(Yt(-this._roll||0,-.05,.05)),Math.abs(this.cam.fov-this.fov)>.05&&(this.cam.fov=this.fov,this.cam.updateProjectionMatrix())}snapBehind(t){this.yaw=t+Math.PI,this.idleT=5}forward(t){return t.set(-Math.sin(this.yaw),0,-Math.cos(this.yaw)),t}}const ir=new z;function wi(r,t,e,i,n,s){const a=2*Math.PI*n/4,o=Math.max(s-2*n,0),l=Math.PI/4;ir.copy(t),ir[i]=0,ir.normalize();const c=.5*a/(a+o),h=1-ir.angleTo(r)/l;return Math.sign(ir[e])===1?h*c:o/(a+o)+c+c*(1-h)}class tc extends _t{constructor(t=1,e=1,i=1,n=2,s=.1){if(n=n*2+1,s=Math.min(t/2,e/2,i/2,s),super(1,1,1,n,n,n),n===1)return;const a=this.toNonIndexed();this.index=null,this.attributes.position=a.attributes.position,this.attributes.normal=a.attributes.normal,this.attributes.uv=a.attributes.uv;const o=new z,l=new z,c=new z(t,e,i).divideScalar(2).subScalar(s),h=this.attributes.position.array,f=this.attributes.normal.array,u=this.attributes.uv.array,d=h.length/6,m=new z,v=.5/n;for(let g=0,p=0;g<h.length;g+=3,p+=2)switch(o.fromArray(h,g),l.copy(o),l.x-=Math.sign(l.x)*v,l.y-=Math.sign(l.y)*v,l.z-=Math.sign(l.z)*v,l.normalize(),h[g+0]=c.x*Math.sign(o.x)+l.x*s,h[g+1]=c.y*Math.sign(o.y)+l.y*s,h[g+2]=c.z*Math.sign(o.z)+l.z*s,f[g+0]=l.x,f[g+1]=l.y,f[g+2]=l.z,Math.floor(g/d)){case 0:m.set(1,0,0),u[p+0]=wi(m,l,"z","y",s,i),u[p+1]=1-wi(m,l,"y","z",s,e);break;case 1:m.set(-1,0,0),u[p+0]=1-wi(m,l,"z","y",s,i),u[p+1]=1-wi(m,l,"y","z",s,e);break;case 2:m.set(0,1,0),u[p+0]=1-wi(m,l,"x","z",s,t),u[p+1]=wi(m,l,"z","x",s,i);break;case 3:m.set(0,-1,0),u[p+0]=1-wi(m,l,"x","z",s,t),u[p+1]=1-wi(m,l,"z","x",s,i);break;case 4:m.set(0,0,1),u[p+0]=1-wi(m,l,"x","y",s,t),u[p+1]=1-wi(m,l,"y","x",s,e);break;case 5:m.set(0,0,-1),u[p+0]=wi(m,l,"x","y",s,t),u[p+1]=1-wi(m,l,"y","x",s,e);break}}}const Po=new Map;function fe(r,t=.85){const e=r+"_"+t;return Po.has(e)||Po.set(e,new pt({color:r,roughness:t})),Po.get(e)}const Si=new Map;function Mn(r,t,e){const i=r+","+t+","+e;if(!Si.has(i)){const n=new tc(r,t,e,2,Math.min(r,t,e)*.3);n.userData.shared=!0,Si.set(i,n)}return Si.get(i)}function On(r){const t="s"+r;if(!Si.has(t)){const e=new Oi(r,14,11);e.userData.shared=!0,Si.set(t,e)}return Si.get(t)}function Nh(r,t){const e="c"+r.toFixed(3)+","+t.toFixed(3);if(!Si.has(e)){const i=new Yl(r,Math.max(.04,t-2*r),4,12);i.userData.shared=!0,Si.set(e,i)}return Si.get(e)}function zo(r,t,e){const i=`t${r.toFixed(3)},${t.toFixed(3)},${e.toFixed(3)}`;if(!Si.has(i)){const n=new jt(r,t,e,14);n.userData.shared=!0,Si.set(i,n)}return Si.get(i)}const z1=[15845797,14264439,11631179,8014634,15185807,5978657],Fh=[15158332,3447003,15844367,3066993,10181046,15528177,1752220,15105570,3426654,16744118],D1=[2899536,3426654,8359053,2042422,6111287,3033722],L1=[2825490,1118481,7031339,14266991,9079434,10506797],I1=7226666,U1=855309,k1=16053492,N1=3100559,Oh={slim:{torsoW:.42,torsoH:.6,hipW:.38,armW:.12,legW:.145,head:.25,h:.97},avg:{torsoW:.46,torsoH:.62,hipW:.42,armW:.13,legW:.16,head:.26,h:1},athletic:{torsoW:.5,torsoH:.64,hipW:.42,armW:.145,legW:.175,head:.26,h:1.02},heavy:{torsoW:.55,torsoH:.6,hipW:.5,armW:.15,legW:.19,head:.28,h:.98}},F1=["fade","fade","flat","afro","bald","cap","beanie","long"];class Pl{constructor(t={}){const e=t.kind||"ped",i=t.female??(e==="ped"&&Math.random()<.32),n=X=>X[Math.random()*X.length|0];let s=t.skin??n(z1),a=t.shirt??n(Fh),o=t.pants??n(D1),l=t.hair??n(L1),c=t.build??(Math.random()<.2?"slim":Math.random()<.75?"avg":"heavy"),h=t.hairStyle??n(F1);i&&(h==="fade"||h==="bald")&&(h="long");let f=!1,u=null,d=!1,m=null,v=null,g=!1;if(e==="cop"&&(a=2046611,o=1317939,h="cap",c=t.build??"athletic"),e==="gang"&&(a=t.shirt??1776411,o=t.pants??2763306,h=t.hairStyle??"bandana"),e==="clerk"&&(o=2236962,h="cap"),e==="suit"&&(a=t.shirt??2303534,o=t.pants??1776931,h=t.hairStyle??"flat",c=t.build??"avg",v=t.tie??9050650),e==="hick"&&(a=t.shirt??9058858,o=t.pants??3821418,h=t.hairStyle??"cap",c=t.build??(Math.random()<.5?"avg":"heavy")),e==="homeless"&&(a=t.shirt??4867128,o=t.pants??3025444,h="beanie",m=3815994,c=t.build??"slim",g=!0),e==="player"&&(s=t.skin??I1,a=t.shirt??k1,o=t.pants??N1,l=t.hair??U1,h="fade",c=t.build??"athletic",f=!0),e==="ped"&&!i){const X=Math.random();X<.22?u=2830134:X<.32&&(u=6109722),!u&&Math.random()<.25&&(d=!0)}e==="ped"&&i&&Math.random()<.4&&(d=!0),h==="beanie"&&(m=n(Fh)),this.kind=e,this.female=i;const p=Oh[c]||Oh.avg,M=p.torsoW-(i?.04:0),w=p.hipW+(i?.04:0),x=p.armW-(i?.015:0),y=p.legW,b=p.head;this.group=new be;const _=this.group,E=this.body=new be;_.add(E);const T=fe(s),S=fe(a),R=fe(o),I=fe(l,.6),L=fe(16119285,.9),B=fe(1315860,.5),W=fe(13938487,.35),U=(X,J,D,It,ct,bt,ft,Bt)=>{const gt=new N(Mn(J,D,It),ct);return gt.position.set(bt,ft,Bt),gt.castShadow=!0,X.add(gt),gt},q=M*.34,V=this.torso=new N(zo(M*.58,M*.44,p.torsoH),S);if(V.scale.z=.6,V.position.y=1.29,V.castShadow=!0,E.add(V),i)for(const X of[-1,1]){const J=new N(On(.075),S);J.position.set(X*.1,1.42,.13),J.castShadow=!0,E.add(J)}e==="player"&&(U(E,.2,.025,.02,W,0,1.52,q+.015),U(E,.05,.06,.02,W,0,1.47,q+.018));const rt=new N(zo(w*.55,w*.48,.2),R);rt.scale.z=.62,rt.position.y=.9,rt.castShadow=!0,E.add(rt),e==="cop"&&(U(E,w+.03,.07,.29,B,0,1,0),U(E,.06,.07,.02,W,-M/2+.1,1.45,q+.008)),e==="suit"&&(U(E,.16,.4,.02,L,0,1.42,q+.008),U(E,.07,.34,.025,fe(v??9050650,.6),0,1.4,q+.014));const et=this.headG=new be;et.position.y=1.62,E.add(et);const mt=b*.52,Ct=new N(On(mt),T);Ct.scale.set(1,1.12,.95),Ct.position.y=.2,Ct.castShadow=!0,et.add(Ct);const Z=b*.44;U(et,.045,.09,.06,T,-b/2+.005,.2,0),U(et,.045,.09,.06,T,b/2-.005,.2,0),U(et,b*.72,.05,.015,L,0,.235,Z+.008),U(et,.032,.032,.012,B,-.05,.232,Z+.015),U(et,.032,.032,.012,B,.05,.232,Z+.015),U(et,.05,.07,.045,T,0,.165,Z+.018),i?U(et,.09,.022,.012,fe(9059146,.7),0,.1,Z+.01):U(et,.1,.018,.012,fe(3810071,.9),0,.1,Z+.01),(e==="player"||!i&&e!=="cop"&&Math.random()<.35)&&U(et,.11,.055,.02,I,0,.055,Z+.008);const Q=new N(zo(.075,.085,.12),T);Q.position.y=0,et.add(Q);const st=I;if(h==="fade"||e==="player")U(et,b+.03,.07,b+.03,st,0,.375,0),U(et,.03,.12,b-.02,st,-b/2+.01,.28,0),U(et,.03,.12,b-.02,st,b/2-.01,.28,0),U(et,b-.02,.12,.03,st,0,.28,-b/2+.01);else if(h==="flat")U(et,b+.04,.09,b+.04,st,0,.38,0);else if(h==="afro"){const X=new N(On(b*.85),st);X.position.y=.37,X.scale.set(1,.95,1),X.castShadow=!0,et.add(X)}else if(h==="cap"||e==="cop"){const X=e==="cop"?fe(989754):e==="clerk"?fe(a,.8):st,J=new N(On(b*.56),X);J.scale.set(1,.62,1),J.position.y=.36,J.castShadow=!0,et.add(J),U(et,b-.02,.03,.16,e==="cop"?fe(659234):B,0,.335,.2)}else if(h==="beanie"){const X=fe(m??l,.9),J=new N(On(b*.58),X);J.scale.set(1,.72,1),J.position.y=.36,J.castShadow=!0,et.add(J),U(et,b+.05,.06,b+.05,X,0,.31,0)}else if(h==="long")U(et,b+.03,.08,b+.03,st,0,.375,0),U(et,b-.03,.42,.08,st,0,.08,-b/2-.005),U(et,.04,.3,.1,st,-b/2+.005,.14,0),U(et,.04,.3,.1,st,b/2-.005,.14,0);else if(h==="bandana"){const X=fe(t.gangColor??9323693,.9),J=new N(On(b*.55),X);J.scale.set(1,.6,1),J.position.y=.345,et.add(J),U(et,.08,.08,.07,X,0,.33,-b/2-.02)}if(e==="hick"&&U(et,.14,.09,.03,I,0,.045,Z+.008),(e==="homeless"||g)&&U(E,M*.5,.1,.03,B,M*.2,1.05,q-.02),e==="player"){const X=new N(Mn(.24,.05,.04),fe(1118481,.2));X.position.set(0,.24,.14),et.add(X)}if(e==="clerk"){const X=new N(Mn(.4,.5,.05),L);X.position.set(0,-.35,q+.02),et.add(X)}const $=(X,J,D,It,ct)=>{const bt=new be,ft=new N(Nh(X/2,J*ct),D);ft.position.y=-J*ct/2,ft.castShadow=!0,bt.add(ft);const Bt=new be;Bt.position.y=-J*ct,bt.add(Bt);const gt=new N(Nh(X*.45,J*(1-ct)),It);return gt.position.y=-J*(1-ct)/2,gt.castShadow=!0,Bt.add(gt),bt.lowerG=Bt,bt},ut=f?T:u?fe(u,.9):S,Rt=u?fe(u,.9):T;this.armL=$(x,.66,ut,Rt,.5),this.armL.position.set(-(M/2+.07),1.56,0),E.add(this.armL),this.armR=$(x,.66,ut,Rt,.5),this.armR.position.set(M/2+.07,1.56,0),E.add(this.armR);for(const X of[this.armL,this.armR]){const J=new N(On(.068),T);J.position.set(0,-.36,.01),J.castShadow=!0,X.lowerG.add(J)}if(e==="suit"){const X=new N(Mn(.09,.24,.32),fe(3811866,.6));X.position.set(0,-.5,.02),X.castShadow=!0,this.armL.lowerG.add(X);const J=new N(Mn(.03,.06,.12),B);J.position.set(0,-.37,.02),this.armL.lowerG.add(J)}e==="player"&&(U(this.armL,x+.014,.1,x+.014,fe(1842204,.9),0,-.14,0),U(this.armL.lowerG,x*.9+.02,.05,x*.9+.02,fe(12632256,.3),0,-.26,0));const Pt=d?T:R;if(this.legL=$(y,.9,R,Pt,.5),this.legL.position.set(-.12,.88,0),E.add(this.legL),this.legR=$(y,.9,R,Pt,.5),this.legR.position.set(.12,.88,0),E.add(this.legR),d&&(U(this.legL.lowerG,y*.92,.09,y*.92,L,0,-.33,0),U(this.legR.lowerG,y*.92,.09,y*.92,L,0,-.33,0)),e==="player"||c==="heavy"){const X=e==="player"?fe(2375790,.9):R;U(this.legL.lowerG,y+.03,.08,y+.03,X,0,-.38,0),U(this.legR.lowerG,y+.03,.08,y+.03,X,0,-.38,0)}const Vt=e==="player"||Math.random()<.3?L:fe(1710618,.5);for(const X of[this.legL,this.legR]){const J=new N(Mn(y+.01,.1,.29),Vt);J.position.set(0,-.42,.06),J.castShadow=!0,X.lowerG.add(J);const D=new N(Mn(y+.02,.035,.3),B);D.position.set(0,-.475,.06),X.lowerG.add(D)}E.scale.setScalar(p.h),this.hand=new be,this.hand.position.y=-.3,this.armR.lowerG.add(this.hand),this.gun=new be,this.hand.add(this.gun),this.gun.visible=!1,this.gun.rotation.x=Math.PI/2,this.muzzle=new pe,this.gun.add(this.muzzle),this.gunKey=null,this.setWeapon(t.weapon||"pistol"),this.phase=Math.random()*6.28,this.lean=0,this.bob=0,this.deadT=0,this.state={move:0,run:0,aiming:!1,sitting:!1,dead:!1,punch:0,airborne:!1,swim:!1,panic:!1,weaponLong:!1,hasWeapon:!1,aimPitch:0,firePose:0}}dispose(){const t=new Set;this.group.traverse(e=>{e.geometry&&!t.has(e.geometry)&&(t.add(e.geometry),e.geometry.userData.shared||e.geometry.dispose())}),this.group.parent?.remove(this.group)}setWeapon(t){if(t===this.gunKey)return;for(this.gunKey=t;this.gun.children.length>1;){const f=this.gun.children[this.gun.children.length-1];this.gun.remove(f),f.traverse?.(u=>{u.geometry&&!u.geometry.userData.shared&&u.geometry.dispose()})}const e=fe(1711135,.35),i=new pt({color:4870232,roughness:.3,metalness:.85}),n=fe(7031339,.7),s=fe(4938286,.7),a=(f,u,d,m,v,g=0,p=0,M=0)=>{const w=new N(f,u);return w.position.set(d,m,v),w.rotation.set(g,p,M),w.castShadow=!0,this.gun.add(w),w},o=(f,u,d)=>Mn(f,u,d),l=(f,u,d=f)=>{const m=new jt(f,d,u,10);return m.rotateX(Math.PI/2),m};let c=.25;t==="pistol"?(a(o(.045,.07,.22),e,0,.03,.1),a(l(.012,.07),i,0,.03,.24),a(o(.04,.13,.055),fe(2763306,.5),0,-.05,0,.2),a(o(.03,.02,.06),e,0,-.02,.07),c=.28):t==="uzi"?(a(o(.06,.09,.3),e,0,.02,.12),a(o(.035,.18,.05),i,0,-.1,.03),a(l(.014,.12),i,0,.03,.32),a(o(.04,.12,.05),fe(2763306,.5),0,-.06,-.04,.2),a(o(.03,.03,.22),i,0,.04,-.14),c=.38):t==="shotgun"?(a(l(.017,.72),i,0,.04,.42),a(l(.014,.5),i,0,.005,.4),a(o(.05,.05,.16),n,0,0,.32),a(o(.05,.08,.22),e,0,.02,.06),a(o(.045,.09,.3),n,0,-.04,-.2,-.12),c=.8):t==="rifle"?(a(l(.013,.62),i,0,.045,.5),a(o(.05,.09,.32),e,0,.02,.1),a(o(.035,.16,.06),e,0,-.09,.14,.25),a(o(.04,.05,.22),e,0,0,.32),a(o(.045,.08,.28),e,0,-.02,-.22,-.1),a(l(.02,.16),i,0,.1,.08),a(o(.04,.12,.05),fe(2763306,.5),0,-.06,-.03,.2),c=.82):t==="rpg"?(a(l(.045,.9),s,0,.06,.2),a(l(.05,.22,.02),fe(9058858,.5),0,.06,.76),a(l(.06,.1,.045),s,0,.06,-.3),a(o(.04,.12,.05),fe(2763306,.5),0,-.05,.05,.2),a(o(.04,.1,.05),fe(2763306,.5),0,-.04,.3,.2),c=.9):c=.2;const h=t==="pistol"?1.7:t==="uzi"?1.5:1.3;this.muzzle.position.set(0,.04*h,c*h);for(const f of this.gun.children)f!==this.muzzle&&(f.scale.setScalar(h),f.position.multiplyScalar(h))}animate(t,e=this.state){const{move:i,run:n}=e,s=6+n*6;i>.05&&!e.sitting&&(this.phase+=t*s*(.5+i*.5));const a=e.sitting?0:Ht(.35,.95,n)*i,o=Math.sin(this.phase),l=Math.cos(this.phase),c=1-Math.exp(-14*t),h=(u,d,m=0,v=0)=>{u.rotation.x=Ht(u.rotation.x,d,c),u.rotation.y=Ht(u.rotation.y,m,c),u.rotation.z=Ht(u.rotation.z,v,c)};if(this.gun.visible=e.hasWeapon&&!e.dead,e.dead){this.deadT+=t;const u=Yt(this.deadT*2.2,0,1),d=1-(1-u)*(1-u);this.body.rotation.x=Ht(this.body.rotation.x,-Math.PI/2*(this.deadDir??1),d*.3+.05),this.body.position.y=Ht(this.body.position.y,.15,.2),h(this.armL,-.4,0,-1.2),h(this.armR,.5,0,1),h(this.legL,.1,0,.3),h(this.legR,-.2,0,-.2),this.legL.lowerG.rotation.x=.4;return}if(this.body.rotation.x=Ht(this.body.rotation.x,0,c),this.body.position.y=Ht(this.body.position.y,0,c),e.exhausted){this.phase+=t*7;const u=Math.sin(this.phase)*.06;this.body.rotation.x=Ht(this.body.rotation.x,.85+u,c),this.body.position.y=Ht(this.body.position.y,-.42,c),h(this.legL,-.25,0,.06),h(this.legR,-.25,0,-.06),this.legL.lowerG.rotation.x=Ht(this.legL.lowerG.rotation.x,.45,c),this.legR.lowerG.rotation.x=Ht(this.legR.lowerG.rotation.x,.45,c),h(this.armL,-.75,0,.15),h(this.armR,-.75,0,-.15),this.armL.lowerG.rotation.x=Ht(this.armL.lowerG.rotation.x,-.5,c),this.armR.lowerG.rotation.x=Ht(this.armR.lowerG.rotation.x,-.5,c),h(this.headG,.55+u*.5,0,0),this.torso.rotation.x=0,this.torso.rotation.y=Ht(this.torso.rotation.y,0,c);return}if(e.sleeping){this.phase+=t*1.6;const u=Math.sin(this.phase)*.03;this.body.rotation.x=Ht(this.body.rotation.x,-Math.PI/2+.08,c),this.body.position.y=Ht(this.body.position.y,.14,c),h(this.legL,0,0,.05),h(this.legR,0,0,-.05),this.legL.lowerG.rotation.x=Ht(this.legL.lowerG.rotation.x,.05,c),this.legR.lowerG.rotation.x=Ht(this.legR.lowerG.rotation.x,.05,c),h(this.armL,.1,0,.35),h(this.armR,.1,0,-.35),this.armL.lowerG.rotation.x=Ht(this.armL.lowerG.rotation.x,-.15,c),this.armR.lowerG.rotation.x=Ht(this.armR.lowerG.rotation.x,-.15,c),this.torso.rotation.x=u,this.torso.rotation.y=Ht(this.torso.rotation.y,0,c),h(this.headG,.3,.3,0);return}if(e.sitting){h(this.legL,-1.45,0,.05),h(this.legR,-1.45,0,-.05),this.legL.lowerG.rotation.x=Ht(this.legL.lowerG.rotation.x,1.3,c),this.legR.lowerG.rotation.x=Ht(this.legR.lowerG.rotation.x,1.3,c),h(this.armL,-1,0,.35),h(this.armR,-1,0,-.35),this.armL.lowerG.rotation.x=Ht(this.armL.lowerG.rotation.x,-.6,c),this.armR.lowerG.rotation.x=Ht(this.armR.lowerG.rotation.x,-.6,c),this.torso.rotation.x=0,this.body.position.y=-1,h(this.headG,0,0,0);return}if(e.swim){this.phase+=t*5;const u=this.phase;h(this.armL,-Math.PI+Math.sin(u)*1.2,0,.4),h(this.armR,-Math.PI+Math.sin(u+Math.PI)*1.2,0,-.4),h(this.legL,Math.sin(u*2)*.4,0,0),h(this.legR,-Math.sin(u*2)*.4,0,0),this.body.rotation.x=Ht(this.body.rotation.x,1.35,c),this.body.position.y=-.6;return}h(this.legL,o*a,0,0),h(this.legR,-o*a,0,0),this.legL.lowerG.rotation.x=Ht(this.legL.lowerG.rotation.x,Math.max(0,-l)*a*1.2,c),this.legR.lowerG.rotation.x=Ht(this.legR.lowerG.rotation.x,Math.max(0,l)*a*1.2,c),e.airborne&&(h(this.legL,-.5,0,.1),h(this.legR,.3,0,-.1),this.legL.lowerG.rotation.x=1);const f=(e.aiming||e.firePose>0)&&e.hasWeapon;if(f){const u=e.aimPitch||0;e.weaponLong?(h(this.armR,-Math.PI/2-u,0,-.42),h(this.armL,-Math.PI/2-u+.12,0,.55),this.armL.lowerG.rotation.x=Ht(this.armL.lowerG.rotation.x,-.55,c),this.armR.lowerG.rotation.x=Ht(this.armR.lowerG.rotation.x,0,c)):(h(this.armR,-Math.PI/2-u,0,-.38),h(this.armL,-Math.PI/2-u+.2,0,.6),this.armL.lowerG.rotation.x=Ht(this.armL.lowerG.rotation.x,-.5,c),this.armR.lowerG.rotation.x=Ht(this.armR.lowerG.rotation.x,0,c)),this.gun.rotation.x=Math.PI/2,this.gun.rotation.y=0,this.gun.position.set(0,.03,.02),this.torso.rotation.y=Ht(this.torso.rotation.y,-.35,c)}else if(e.punch>0){const u=e.punch;h(this.armR,-1.4-Math.sin(u*Math.PI)*.6,.2,-.1),this.armR.lowerG.rotation.x=-.4+Math.sin(u*Math.PI)*.4,h(this.armL,-.9,-.3,.3),this.armL.lowerG.rotation.x=-1.3}else{const u=a*.9,d=e.panic?1:0;h(this.armL,-o*u-d*2.4,0,.12+d*.6),h(this.armR,o*u-d*2.4,0,-.12-d*.6),this.armL.lowerG.rotation.x=Ht(this.armL.lowerG.rotation.x,-.3-n*.9,c),this.armR.lowerG.rotation.x=Ht(this.armR.lowerG.rotation.x,-.3-n*.9-(e.hasWeapon?.5:0),c),this.gun.rotation.x=Math.PI/2,this.gun.position.set(0,0,.02),this.torso.rotation.y=Ht(this.torso.rotation.y,0,c)}this.torso.rotation.x=0,this.body.rotation.x=Ht(this.body.rotation.x,n*.18*i+(e.airborne?.15:0),c),this.body.position.y=Math.abs(l)*a*.08,h(this.headG,f?-.05-(e.aimPitch||0)*.5:.05-n*.1,f?.15:0,0)}}const Bi={fist:{name:"Fists",damage:14,rate:.42,range:1.7,melee:!0,icon:"✊"},pistol:{name:"Pistol",damage:26,rate:.26,spread:.012,range:90,clip:34,sound:"pistol",icon:"🔫",recoil:.35},uzi:{name:"Uzi",damage:13,rate:.07,spread:.04,range:60,auto:!0,clip:90,sound:"uzi",icon:"🔫",recoil:.18},shotgun:{name:"Shotgun",damage:11,pellets:9,rate:.85,spread:.075,range:32,clip:24,sound:"shotgun",icon:"🔫",long:!0,recoil:.9},rifle:{name:"Rifle",damage:60,rate:.55,spread:.004,range:200,clip:30,sound:"rifle",icon:"🔫",long:!0,recoil:.6},rpg:{name:"RPG",damage:0,rate:1.4,spread:0,range:150,clip:3,sound:"rifle",icon:"🚀",long:!0,recoil:1.2,projectile:!0}},ca=["fist","pistol","uzi","shotgun","rifle","rpg"],nr=new z,ei=new z,tn=new z,Do=new qt,Lo=new z,Bh=new z,ha=new Tr,Io=new zn,en=new hn;function Zn(r,t,e,i,n){let s={t:i,type:"none",entity:null};const a=Math.hypot(e.x,e.z);if(a>1e-4){const c=La(r.city.hash,t.x,t.z,e.x/a,e.z/a,i*a,(h,f)=>{const u=t.y+e.y*(f/a);return u>=(h.minY??0)&&u<=(h.maxY??1/0)});if(c.box){const h=c.t/a;h<s.t&&(s={t:h,type:"world",entity:c.box})}}if(e.y<-1e-4){const c=-(t.y-.02)/e.y;c>0&&c<s.t&&(s={t:c,type:"ground",entity:null})}ha.set(t,e);for(const c of r.vehicles){if(c===n?.vehicle)continue;const h=c.x-t.x,f=c.z-t.z;if(Math.hypot(h,f)-c.halfL>s.t)continue;if(Do.copy(c.group.matrixWorld).invert(),Lo.copy(t).applyMatrix4(Do),Bh.copy(e).transformDirection(Do),Io.min.set(-c.halfW,.2,-c.halfL),Io.max.set(c.halfW,c.type.profile.reduce((v,g)=>Math.max(v,g[1]),0),c.halfL),new Tr(Lo,Bh).intersectBox(Io,tn)){const v=tn.distanceTo(Lo);v<s.t&&(s={t:v,type:"vehicle",entity:c})}}const o=r.peds,l=n===r.player?o:[...o,r.player];for(const c of l){if(c===n||c.dead||c.vehicle)continue;if(en.center.set(c.x,c.y+.9,c.z),en.radius=.45,ha.intersectSphere(en,tn)){const u=tn.distanceTo(t);u<s.t&&(s={t:u,type:"ped",entity:c})}if(en.center.set(c.x,c.y+1.72,c.z),en.radius=.2,ha.intersectSphere(en,tn)){const u=tn.distanceTo(t);u<=s.t+.05&&(s={t:u,type:"ped",entity:c,head:!0})}}for(const c of r.barrels){if(c.dead)continue;if(en.center.set(c.x,c.y+.55,c.z),en.radius=.55,ha.intersectSphere(en,tn)){const f=tn.distanceTo(t);f<s.t&&(s={t:f,type:"barrel",entity:c})}}return s.point=tn.copy(t).addScaledVector(e,s.t).clone(),s}function O1(r,t,e,i,n){const s=Bi[e],a=r.effects;if(s.projectile){r.projectiles.launch(i,n,t),a.muzzle(i,n),r.audio.gunshot("shotgun"),r.noise(i.x,i.z,60,t);return}const o=s.pellets||1;let l=!1,c=!1,h=!1;for(let f=0;f<o;f++){ei.copy(n),ei.x+=(Math.random()-.5)*s.spread*2,ei.y+=(Math.random()-.5)*s.spread*2,ei.z+=(Math.random()-.5)*s.spread*2,ei.normalize();const u=Zn(r,i,ei,s.range,t);if(a.addTracer(i,u.point),u.type==="ped"){const d=!u.entity.dead;u.entity.hurt(u.head?s.damage*2.5:s.damage,t,ei),a.blood(u.point.x,u.point.y,u.point.z,u.head?12:6),l=!0,u.head&&(c=!0),d&&u.entity.dead&&(h=!0)}else u.type==="vehicle"?(u.entity.damage(s.damage*.45,"bullet",t),a.sparks(u.point.x,u.point.y,u.point.z,5),u.entity.control==="ai"&&u.entity.ai&&(u.entity.ai.scared=6),l=!0):u.type==="barrel"?(u.entity.hurt(s.damage,t),a.sparks(u.point.x,u.point.y,u.point.z,6),l=!0):(u.type==="world"||u.type==="ground")&&a.puff(u.point.x,u.point.y,u.point.z,3,.35)}a.muzzle(i,n),r.audio.gunshot(s.sound),r.noise(i.x,i.z,45,t),t===r.player&&l&&r.hud.hitmarker(h?"kill":c?"head":"hit")}function B1(r,t,e,i,n,s,a,o){const l=r.effects;nr.set(e,i,n),ei.set(s.x-e,s.y+1-i,s.z-n).normalize();const c=Zn(r,nr,ei,70,t);if(!(c.type==="ped"&&c.entity===s)&&!(c.type==="vehicle"&&c.entity===s.vehicle))return!1;Math.random()>a&&(ei.x+=(Math.random()-.5)*.16,ei.y+=(Math.random()-.5)*.06,ei.z+=(Math.random()-.5)*.16,ei.normalize());const h=Zn(r,nr,ei,70,t);return l.addTracer(nr,h.point),l.muzzle(nr,ei),Math.hypot(e-r.player.x,n-r.player.z)<90&&r.audio.gunshot("pistol"),h.type==="ped"?(h.entity===r.player?r.player.takeDamage(o,t):h.entity.hurt(o,t,ei),l.blood(h.point.x,h.point.y,h.point.z,4)):h.type==="vehicle"?(h.entity.damage(3,"bullet",t),l.sparks(h.point.x,h.point.y,h.point.z,4),h.entity===r.player.vehicle&&r.player.takeDamage(o*.4,t,"impact")):h.type==="barrel"&&h.entity.hurt(20,t),!0}const Gu=new jt(.07,.09,.7,8);Gu.rotateX(Math.PI/2);const H1=new pt({color:5597999,roughness:.6,metalness:.3});class G1{constructor(t){this.game=t,this.list=[]}launch(t,e,i){const n=new N(Gu,H1);n.position.copy(t),n.lookAt(t.clone().add(e)),this.game.scene.add(n);const s=new wr(16752704,15,12,2);n.add(s),this.list.push({m:n,pos:t.clone(),dir:e.clone().normalize(),speed:55,life:5,shooter:i})}update(t){const e=this.game;for(let i=this.list.length-1;i>=0;i--){const n=this.list[i];n.life-=t;const s=n.speed*t,a=Zn(e,n.pos,n.dir,s+.3,n.shooter),o=a.type!=="none"&&a.t<=s+.3;if(o||n.life<=0){const l=o?a.point:n.pos;e.effects.explosion(l.x,l.y-.5,l.z,1.1),e.audio.explosion(),e.explodeAt(l.x,l.y,l.z,9,n.shooter),e.rig.addShake(Math.max(0,1-Math.hypot(l.x-e.player.x,l.z-e.player.z)/40)),n.shooter===e.player&&e.crime("explosion",l.x,l.z),e.scene.remove(n.m),this.list.splice(i,1);continue}n.pos.addScaledVector(n.dir,s),n.m.position.copy(n.pos),e.effects.smoke.emit(n.pos.x,n.pos.y,n.pos.z,0,.5,0,.9,.5,.75,.75,.75,1.5,1,.2),e.effects.fire.emit(n.pos.x,n.pos.y,n.pos.z,-n.dir.x*3,0,-n.dir.z*3,.15,.5,1,.6,.2,0,2,0)}}}const Hh={ped:["Nice weather for a heist.","Do I know you?","This city's gone to hell.","Keep walking, pal.","You look like trouble.","Have you seen my car? Red sedan. Big dent.","The burgers at Burger Shot are 40% meat now!","I'm late for a thing. A very important thing.","Ammu-Nation's got a sale on. Not that I'd know.","Watch the road, cabs here drive like maniacs.","Downtown's beautiful at night, if you like sirens.","Is that a gun or are you just happy to see me?","Don't get me started on the traffic lights."],cop:["Move along, citizen.","Nothing to see here.","Keep your nose clean.","I've got my eye on you.","Stay out of trouble."],gang:["You lost, tourist?","This is our block.","Keep steppin'.","You got a problem?","Eastside runs this."],clerk:["Welcome in! Press E at the counter to shop.","Take a look around.","Cash only, friend."],suit:["Do you have an appointment?","I'm late for a meeting.","Stocks are up. Mostly.","This suit cost more than your car.","Excuse me, important call."],hick:["Howdy.","Nice truck, ain'a?","You ain't from around here.","Fishin's good down by the river.","My cousin's got a car just like that. Sans wheels."],homeless:["Spare change?","Buddy... can you spare a dollar?","Zzz... five more minutes...","The pigeons understand me.","I used to have a house. And a boat. Mostly a boat."],player:["Hey.","What's up?","Sup.","Nice day.","Yeah, yeah.","Sure.","Alright then."]},Vu=new Set(["Downtown","Financial","The Strip","Midtown","Arena","Ocean Docks","Easter Basin","Ocean Drive","Washington"]),Wu=new Set(["Red County","Flint County","Bone County","Outskirts","Shady Creeks","Mount Chiliad","Los Santos Airport","Venturas Airport","Carson Town","Dam Hills","Francis Airport","Vice Airport"]);function dr(r,t,e){const i=r.districtName(t,e);return Vu.has(i)?"dense":Wu.has(i)?"rural":"mid"}function V1(r){const t=r.district||"",e=Math.random();return Vu.has(t)?t==="Downtown"||t==="Financial"||t==="The Strip"?e<.34?"suit":e<.52?"homeless":e<.6&&r.hoodGang?"gang":"ped":e<.16?"suit":e<.3?"homeless":"ped":Wu.has(t)?e<.68?"hick":"ped":r.hoodGang&&e<.35||(t==="Eastside"||t==="Suburbs"||t==="Projects"||t==="Old Town")&&e<.18?"gang":"ped"}new z;function Xu(r,t,e){for(const i of t){if(i===r.vehicle||i.type?.fly&&(i.y||0)>3)continue;const n=r.x-i.x,s=r.z-i.z;if(n*n+s*s>(i.halfL+1.2)**2)continue;const a=Math.sin(i.heading),o=Math.cos(i.heading),l=n*a+s*o,c=n*o-s*a,h=i.halfL+r.radius,f=i.halfW+r.radius;if(Math.abs(l)>h||Math.abs(c)>f||r.y>1.6)continue;const u=h-Math.abs(l),d=f-Math.abs(c);let m,v;if(d<u){const p=Math.sign(c)||1;m=o*p,v=-a*p,r.x+=m*d,r.z+=v*d}else{const p=Math.sign(l)||1;m=a*p,v=o*p,r.x+=m*u,r.z+=v*u}const g=-(i.vx*m+i.vz*v);g>2.5&&e(i,g,m,v)}}let W1=0;class Rn{constructor(t,e,i,n={}){this.game=t,this.id=W1++,this.kind=n.kind||"ped",this.char=new Pl({kind:this.kind,...n,weapon:n.weapon||(this.kind==="cop"||this.kind==="gang","pistol")}),this.x=e,this.z=i,this.y=t.city.groundHeight(e,i),this.heading=vt(0,6.28),this.radius=.38,this.vx=0,this.vz=0,this.vy=0,this.health=this.kind==="cop"?65:60,this.dead=!1,this.downT=0,this.deadT=0,this.knocked=!1,this.state="walk",this.panicT=0,this.fleeDir=0,this.waitT=0,this.vehicle=null,this.speed=0,this.walkSpeed=vt(1.2,2),this.runSpeed=vt(5.2,6.4),this.target=null,this.nav=null,this.money=Math.random()<.5?Math.floor(vt(5,60)):0,this.kind==="suit"&&(this.walkSpeed=vt(1.6,2.2)),this.kind==="hick"&&(this.walkSpeed=vt(1,1.6)),this.kind==="homeless"&&(this.walkSpeed=vt(.5,.9),this.wobT=vt(0,6.28),!n.awake&&Math.random()<.45&&(this.state="sleep",this.speed=0)),this.mission=null,this.important=!1,this.hitCooldown=0,this.weapon=n.weapon||null,this.shootT=0,this.arrestT=0,this.stuckT=0,this.hostile=!1,this.talkT=0,this.gangColor=n.gangColor,this.kind==="gang"&&(this.weapon="pistol",this.health=70),t.scene.add(this.char.group),this.syncMesh(),(this.kind==="ped"||this.kind==="gang")&&this.pickNav()}get pos(){return{x:this.x,y:this.y,z:this.z}}syncMesh(){this.char.group.position.set(this.x,this.y,this.z),this.char.group.rotation.y=this.heading}pickNav(){const t=this.game.city;let e=null,i=1/0;for(const o of t.blocks){const l=Math.hypot(o.cx-this.x,o.cz-this.z);l<i&&(i=l,e=o)}if(!e||i>150){this.rural=!0,this.target={x:this.x+vt(-30,30),z:this.z+vt(-30,30)},this.nav={block:e,corner:0,dir:1};return}this.rural=!1;const n=this.blockCorners(e);let s=0,a=1/0;n.forEach((o,l)=>{const c=Math.hypot(o.x-this.x,o.z-this.z);c<a&&(a=c,s=l)}),this.nav={block:e,corner:s,dir:Math.random()<.5?1:-1},this.target=n[s]}blockCorners(t){return[{x:t.x0-1.5,z:t.z0-1.5},{x:t.x1+1.5,z:t.z0-1.5},{x:t.x1+1.5,z:t.z1+1.5},{x:t.x0-1.5,z:t.z1+1.5}]}nextNavTarget(){if(this.rural){this.target={x:this.x+vt(-40,40),z:this.z+vt(-40,40)},Math.random()<.2&&(this.waitT=vt(1,4));return}const t=this.game.city,e=this.nav,i=e.block;if(Math.random()<.35){const n=e.corner,s=n===1||n===2?1:-1,a=n>=2?1:-1,o=[],l=t.blocks.find(h=>h.i===i.i+s&&h.j===i.j);l&&o.push({b:l,c:[1,0,3,2][n]});const c=t.blocks.find(h=>h.i===i.i&&h.j===i.j+a);if(c&&o.push({b:c,c:[3,2,1,0][n]}),o.length){const h=We(o);e.block=h.b,e.corner=h.c,this.target=this.blockCorners(h.b)[h.c],this.crossing=!0;return}}this.crossing=!1,e.corner=(e.corner+e.dir+4)%4,this.target=this.blockCorners(i)[e.corner],Math.random()<.15&&(this.waitT=vt(1,4))}talk(t){if(this.dead||this.vehicle)return null;this.state==="sleep"&&this.wake(),this.talkT=3,this.heading=Math.atan2(t.x-this.x,t.z-this.z),this.speed=0;const e=We(Hh[this.kind]||Hh.ped);return this.game.hud.speak(this,e,3e3),e}panic(t,e,i=6){if(!(this.dead||this.kind==="cop"||this.kind==="clerk"||this.vehicle)){if(this.state==="sleep"&&this.wake(),this.kind==="gang"){this.hostile=!0,this.hostileT=25;return}this.state="flee",this.panicT=Math.max(this.panicT,i),this.fleeDir=Math.atan2(this.x-t,this.z-e)+vt(-.6,.6)}}wake(){this.state==="sleep"&&(this.state="walk",this.char.state.sleeping=!1,this.pickNav())}hurt(t,e,i){this.dead||(this.health-=t,this.lastAttacker=e,this.health<=0?this.die(e,i):(this.panic(e?.x??this.x,e?.z??this.z,8),this.kind==="cop"&&this.game.police.onCopHurt(this,e),this.kind==="gang"&&this.game.pedsMgr.alertGang(this)))}knock(t,e,i,n){this.dead||(this.vx=t,this.vz=e,this.vy=3.5,this.knocked=!0,this.downT=1.8,this.char.state.dead=!0,this.char.deadT=0,this.char.deadDir=Math.random()<.5?1:-1,this.health-=i,this.game.audio.thud(),this.game.effects.blood(this.x,this.y+.8,this.z,5),this.health<=0?this.die(n):this.panicT=8)}die(t,e){this.dead||(this.dead=!0,this.deadT=0,this.state="dead",this.char.state.dead=!0,this.char.deadT=0,this.char.deadDir=Math.random()<.5?1:-1,e&&(this.vx=e.x*2,this.vz=e.z*2),this.game.onPedKilled(this,t))}update(t){const e=this.game,i=e.city,n=this.char.state;if(this.hitCooldown=Math.max(0,this.hitCooldown-t),this.vehicle){this.syncSeat();return}if(this.dead||this.knocked){this.vy-=22*t,this.y+=this.vy*t;const u=i.groundHeight(this.x,this.z);this.y<u&&(this.y=u,this.vy=0,this.vx*=.6,this.vz*=.6),this.x+=this.vx*t,this.z+=this.vz*t,this.vx*=Math.exp(-3*t),this.vz*=Math.exp(-3*t),Da(i.hash,this,this.radius,2,this.y),this.dead?this.deadT+=t:(this.downT-=t,this.downT<=0&&(this.knocked=!1,n.dead=!1,this.state="flee",this.panicT=6,this.fleeDir=vt(0,6.28))),this.char.animate(t),this.syncMesh();return}if(this.talkT>0)this.talkT-=t,this.speed=0;else if(this.state==="sleep"){this.speed=0,n.sleeping=!0;const u=e.player,d=u.vehicle;(yt(this.x,this.z,u.x,u.z)<5||d&&yt(this.x,this.z,d.x,d.z)<8&&d.absSpeed>8||u.aiming&&u.currentWeapon!=="fist"&&yt(this.x,this.z,u.x,u.z)<14)&&(this.wake(),this.panic(u.x,u.z,5))}else this.kind==="cop"?e.police.updateCop(this,t):this.kind==="clerk"?this.speed=0:this.kind==="gang"&&this.hostile?this.gangBrain(t):this.civilianBrain(t);let s=0,a=0;const o=this.speed;o>0&&(s=Math.sin(this.heading)*o,a=Math.cos(this.heading)*o);const l=this.x,c=this.z;this.x+=s*t,this.z+=a*t,Da(i.hash,this,this.radius,2,this.y),Xu(this,e.vehicles,(u,d,m,v)=>{if(this.hitCooldown>0)return;this.hitCooldown=.5;const g=d*(d>8?6:3);this.knock(u.vx*.9+m*2,u.vz*.9+v*2,g,u.driver||u),u.lastPedHit={ped:this,impact:d},u.control==="player"&&!this.dead&&e.crime("hit_ped",this.x,this.z),u.driver===e.player&&e.rig.addShake(.25)});const h=Math.hypot(this.x-l,this.z-c);o>.5&&h<o*t*.3?(this.stuckT+=t,this.stuckT>.8&&(this.stuckT=0,this.state==="flee"?this.fleeDir+=vt(1.5,3):this.pickNav())):this.stuckT=0,this.game.city.isWater(this.x,this.z)&&(this.fleeDir=Math.atan2(-this.x,-this.z),this.heading=this.fleeDir),this.y=se(this.y,i.groundHeight(this.x,this.z),20,t);const f=this.speed>.1?1:0;n.move=se(n.move,f,10,t),n.run=se(n.run,this.speed>3?1:0,8,t),n.panic=this.state==="flee"&&this.kind!=="cop",n.hasWeapon=!!this.weapon&&(this.kind!=="gang"||this.hostile),n.aiming=this.aiming,n.weaponLong=!1,this.char.animate(t),this.syncMesh()}gangBrain(t){const e=this.game,i=e.player,n=yt(this.x,this.z,i.x,i.z);if(this.hostileT-=t,this.hostileT<=0||i.dead||n>90){this.hostile=!1,this.aiming=!1,this.pickNav();return}const s=Math.atan2(i.x-this.x,i.z-this.z);this.heading=Gi(this.heading,s,10,t),this.aiming=n<35,this.speed=n>14?this.runSpeed:n>8?2:0,this.shootT-=t,n<35&&this.shootT<=0&&(this.shootT=vt(1.3,2.2),B1(e,this,this.x,this.y+1.35,this.z,i,Yt(.45-n/90,.12,.45),5))}civilianBrain(t){const e=this.game,i=e.player,n=i.vehicle;if(n&&yt(this.x,this.z,n.x,n.z)<7&&n.absSpeed>7&&this.state!=="flee"&&this.panic(n.x,n.z,4),i.aiming&&i.currentWeapon!=="fist"&&yt(this.x,this.z,i.x,i.z)<14&&this.state!=="flee"&&this.panic(i.x,i.z,5),this.state==="flee"){if(this.panicT-=t,this.panicT<=0){this.state="walk",this.pickNav();return}this.heading=Gi(this.heading,this.fleeDir,8,t),this.speed=this.runSpeed;return}if(this.waitT>0){this.waitT-=t,this.speed=0;return}this.target||this.pickNav();const s=this.target.x-this.x,a=this.target.z-this.z,o=Math.hypot(s,a);if(o<1){this.nextNavTarget();return}if(this.crossing&&o>3){for(const c of e.vehicles)if(c.absSpeed>2&&yt(c.x,c.z,this.target.x,this.target.z)<14&&yt(c.x,c.z,this.x,this.z)<12){this.speed=0;return}}let l=Math.atan2(s,a);if(this.kind==="homeless"&&this.state==="walk"&&(this.wobT=(this.wobT||0)+t*2.2,l+=Math.sin(this.wobT)*.4,Math.random()<t*.25)){this.waitT=vt(1.5,3.5);return}this.heading=Gi(this.heading,l,6,t),this.speed=Math.abs(Ns(l-this.heading))<1?this.walkSpeed:this.walkSpeed*.4}enterVehicle(t){this.vehicle=t,t.driver=this,this.char.state.sitting=!0,this.char.state.dead=!1,t.seat.add(this.char.group),this.char.group.position.set(0,0,0),this.char.group.rotation.set(0,0,0)}exitVehicle(){const t=this.vehicle;if(!t)return;this.vehicle=null,t.driver===this&&(t.driver=null),this.game.scene.add(this.char.group),this.char.state.sitting=!1;const e=Math.sin(t.heading),i=Math.cos(t.heading);this.x=t.x+i*(t.halfW+.8),this.z=t.z-e*(t.halfW+.8),this.y=this.game.city.groundHeight(this.x,this.z),this.heading=t.heading-Math.PI/2,this.syncMesh()}syncSeat(){const t=this.vehicle;this.x=t.x,this.z=t.z,this.y=t.y,this.heading=t.heading,this.char.animate(.016)}dispose(){this.char.dispose()}}class X1{constructor(t){this.game=t,this.peds=t.peds,this.spawnT=0,this.maxPeds=55}update(t){const e=this.game,i=e.player;e.rig;const n=dr(e.city,i.x,i.z);this.maxPeds=n==="dense"?70:n==="rural"?18:45,this.spawnT-=t,this.spawnT<=0&&(this.spawnT=.25,this.peds.filter(a=>(a.kind==="ped"||a.kind==="suit"||a.kind==="hick"||a.kind==="homeless")&&!a.dead).length<this.maxPeds&&this.spawnOne());for(let s=this.peds.length-1;s>=0;s--){const a=this.peds[s];a.update(t);const o=yt(a.x,a.z,i.x,i.z);(a.dead&&a.deadT>25||o>230&&!a.important)&&!a.vehicle&&a.kind!=="cop"&&(a.dispose(),this.peds.splice(s,1))}}spawnOne(){const t=this.game,e=t.city,i=t.player,n=t.rig.forward(new z);if(dr(e,i.x,i.z)==="rural"&&Math.random()<.6){for(let s=0;s<14;s++){const a=e.randomJunctionNear(i.x,i.z,40,320);if(!a)continue;const{ix:o,iz:l}=a,c=[[0,1],[0,-1],[1,0],[-1,0]].filter(([M,w])=>e.hasRoadSeg(o,l,M,w));if(!c.length)continue;const[h,f]=We(c),u=e.lanePoint(o,l,h,f,0,vt(20,60)),d=u.x+vt(-9,9),m=u.z+vt(-9,9);if(e.isWater(d,m)||e.onRoad(d,m))continue;const v=yt(d,m,i.x,i.z);if(v<40||v>320||((d-i.x)*n.x+(m-i.z)*n.z)/v>.35&&v<90)continue;const p=new Rn(t,d,m,{kind:Math.random()<.7?"hick":"ped"});return this.peds.push(p),p}return null}for(let s=0;s<6;s++){const a=We(e.blocks),o=[{x:a.x0-1.5,z:a.z0-1.5},{x:a.x1+1.5,z:a.z0-1.5},{x:a.x1+1.5,z:a.z1+1.5},{x:a.x0-1.5,z:a.z1+1.5}],l=We(o),c=Math.random(),h=We(o),f=l.x+(h.x-l.x)*c,u=l.z+(h.z-l.z)*c,d=yt(f,u,i.x,i.z);if(d<45||d>170||((f-i.x)*n.x+(u-i.z)*n.z)/d>.35&&d<90)continue;const v=V1(a),g=v==="gang"?{kind:v,gangColor:9323693}:{kind:v},p=new Rn(t,f,u,g);return this.peds.push(p),p}return null}alertGang(t){for(const e of this.peds)e.kind==="gang"&&!e.dead&&yt(e.x,e.z,t.x,t.z)<40&&(e.hostile=!0,e.hostileT=25)}spawnDriver(t){const e=Math.sin(t.heading),i=Math.cos(t.heading),n=new Rn(this.game,t.x+i*(t.halfW+.9),t.z-e*(t.halfW+.9));return n.heading=t.heading-Math.PI/2,n.vx=i*2.5,n.vz=-e*2.5,n.syncMesh(),this.peds.push(n),n}panicAround(t,e,i,n=6){for(const s of this.peds)yt(s.x,s.z,t,e)<i&&s.panic(t,e,n)}}const Uo=new z,ua=new z,fa=new z,sr=new z;class q1{constructor(t){this.game=t,this.kind="player",this.char=new Pl({kind:"player"}),t.scene.add(this.char.group),this.x=0,this.y=0,this.z=0,this.heading=0,this.vy=0,this.onGround=!0,this.radius=Ne.RADIUS,this.vx=0,this.vz=0,this.speed=0,this.moveX=0,this.moveZ=0,this.health=Ne.MAX_HEALTH,this.armor=0,this.money=250,this.dead=!1,this.deadT=0,this.busted=!1,this.vehicle=null,this.aiming=!1,this.fireT=0,this.punchT=0,this.knockT=0,this.enterT=0,this.wantedVehicle=null,this.ammo={pistol:60},this.currentWeapon="pistol",this.weaponSwitchT=0,this.stamina=1,this.exhaustT=0,this.lastCrimeT=0,this.swimming=!1,this.invulnT=0,this.respawnT=0,this.damageFlash=0,this.stats={kills:0,carsStolen:0,missions:0},this.talkT=0}get pos(){return{x:this.x,y:this.y,z:this.z}}get absSpeed(){return this.vehicle?this.vehicle.absSpeed:Math.hypot(this.vx,this.vz)}has(t){return t==="fist"||(this.ammo[t]??0)>0}giveWeapon(t,e){this.ammo[t]=(this.ammo[t]||0)+e,(this.currentWeapon==="fist"||this.currentWeapon===t)&&(this.currentWeapon=t)}cycleWeapon(t){const e=ca.filter(n=>this.has(n));let i=e.indexOf(this.currentWeapon);i<0&&(i=0),i=(i+t+e.length)%e.length,this.currentWeapon=e[i],this.weaponSwitchT=2,this.game.audio.ui()}setPosition(t,e,i=0){this.x=t,this.z=e,this.y=this.game.city.groundHeight(t,e),this.heading=i,this.vx=this.vz=0,this.syncMesh()}syncMesh(){this.vehicle||(this.char.group.position.set(this.x,this.y,this.z),this.char.group.rotation.y=this.heading)}takeDamage(t,e,i="bullet"){if(!(this.dead||this.invulnT>0)){if(this.armor>0){const n=Math.min(this.armor,t*.7);this.armor-=n,t-=n}this.health-=t,this.damageFlash=1,this.sinceHurt=0,this.game.rig.addShake(.2+Math.min(.5,t/40)),this.game.input.rumble?.(.7,.5,150),i==="bullet"&&this.game.effects.blood(this.x,this.y+1,this.z,4),this.health<=0&&this.die()}}knock(t,e,i){this.dead||(this.vx=t,this.vz=e,this.vy=4,this.knockT=1.6,this.char.state.dead=!0,this.char.deadT=0,this.char.deadDir=1,this.game.audio.thud(),this.takeDamage(i,null,"impact"))}die(){this.dead||(this.dead=!0,this.deadT=0,this.char.state.dead=!0,this.char.deadT=0,this.aiming=!1,this.vehicle&&this.exitVehicle(!0),this.game.onPlayerWasted())}arrest(){this.dead||this.busted||(this.busted=!0,this.deadT=0,this.vehicle&&this.exitVehicle(!0),this.game.onPlayerBusted())}respawn(t,e,i){this.dead=!1,this.busted=!1,this.knockT=0,this.char.state.dead=!1,this.char.deadT=0,this.health=Ne.MAX_HEALTH,this.invulnT=2,this.stamina=1,this.exhaustT=0,this.setPosition(t,e,i),this.game.rig.snapBehind(i)}update(t){const e=this.game,i=e.input;if(this.invulnT=Math.max(0,this.invulnT-t),this.damageFlash=Math.max(0,this.damageFlash-t*2),this.weaponSwitchT=Math.max(0,this.weaponSwitchT-t),this.sinceHurt=(this.sinceHurt||0)+t,!this.dead&&this.sinceHurt>5&&this.health<50&&(this.health=Math.min(50,this.health+4*t)),this.dead||this.busted){this.deadT+=t,this.updateBody(t,!0);return}if(!(e.travel.menu||e.stores.shopOpen)){i.mouse.wheel!==0&&this.cycleWeapon(i.mouse.wheel>0?1:-1),(i.hit("nextWeapon")||i.hit("dUp"))&&this.cycleWeapon(1),(i.hit("prevWeapon")||i.hit("dDown"))&&this.cycleWeapon(-1);for(let s=0;s<ca.length;s++)i.hitCode("Digit"+(s+1))&&this.has(ca[s])&&(this.currentWeapon=ca[s],this.weaponSwitchT=2)}this.fireT=Math.max(0,this.fireT-t),this.vehicle?this.updateInVehicle(t):this.updateOnFoot(t)}updateOnFoot(t){const e=this.game,i=e.input,n=e.city,s=this.char.state;if(this.enterT>0){this.enterT-=t,this.enterT<=0&&this.wantedVehicle&&this.finishEnter(),this.updateBody(t,!1,0);return}if(i.hit("enter")&&!e.travel.menu&&!e.stores.shopOpen){const S=this.nearestVehicle(4.5);S&&this.beginEnter(S)}if(i.hit("interact")&&!e.stores.shopOpen&&!e.travel.menu){const S=this.nearestPed(2.6);S&&S.talk(this)&&(this.talkT=3,setTimeout(()=>{this.dead||e.hud.speak(this,["Hey.","What's up?","Sup.","Sure.","Alright then.","Yeah, yeah."][Math.floor(Math.random()*6)],2e3)},1200))}if(this.knockT>0){this.knockT-=t,this.updateBody(t,!0),this.knockT<=0&&(s.dead=!1);return}const a=e.rig.forward(Uo),o=-a.z,l=a.x,c=i.footMove?i.footMove():{x:i.axis("left","right"),y:i.axis("back","forward")},h=c.x,f=c.y;let u=a.x*f+o*h,d=a.z*f+l*h,m=Math.hypot(u,d);m>1&&(u/=m,d/=m),(e.travel.menu||e.stores.shopOpen)&&(u=d=m=0);const v=this.aiming;this.aiming=(i.aiming??i.mouse.right)&&this.currentWeapon!=="fist",this.aiming?this.aimAssist(t,!v):e.aimTarget=null,this.firePoseT=Math.max(0,(this.firePoseT||0)-t),this.char.setWeapon(this.currentWeapon),this.swimming=n.isWater(this.x,this.z);const g=i.down("sprint")&&!this.aiming&&!this.swimming&&m>.1&&this.onGround;this.exhaustT>0?(this.exhaustT-=t,this.stamina=Math.min(1,this.stamina+t*.12),this.exhaustT<=0&&(this.exhaustT=0,this.stamina=Math.max(this.stamina,.35))):g?(this.stamina-=Ne.STAMINA_DRAIN*t,this.stamina<=0&&(this.stamina=0,this.exhaustT=Ne.EXHAUST_TIME,e.hud.notify("Out of breath! Catch your breath…",2500),e.audio.tone?.(160,.5,.25,"sawtooth",90))):this.stamina=Math.min(1,this.stamina+Ne.STAMINA_REGEN*t);const p=this.exhaustT>0,M=g&&!p;p&&(this._pantT=(this._pantT||0)-t,this._pantT<=0&&(this._pantT=1,e.audio.noiseBurst?.(.35,700,.8,.22)));const w=Math.min(1,c.mag??m),x=this.swimming?Ne.SWIM:this.aiming?Ne.WALK*1.3:p?Ne.WALK*.55:M?Ne.SPRINT:Ne.RUN*(.45+.55*w),y=u*x,b=d*x,_=this.onGround?Ne.ACCEL:8;this.vx=se(this.vx,y,_/3,t),this.vz=se(this.vz,b,_/3,t),this.aiming||this.firePoseT>0?this.heading=Gi(this.heading,Math.atan2(a.x,a.z),20,t):m>.1&&(this.heading=Gi(this.heading,Math.atan2(u,d),12,t));const E=n.surfaceHeight(this.x,this.z,this.y);if(this.swimming?(this.y=se(this.y,-1.1,6,t),this.onGround=!0,this.vy=0):(this.onGround&&i.hit("jump")&&!e.travel.menu&&!e.stores.shopOpen&&(this.vy=Ne.JUMP,this.onGround=!1),this.vy-=Ne.GRAVITY*t,this.y+=this.vy*t,this.y<=E?(this.y=E,this.vy=0,this.onGround=!0):this.onGround=!1),this.x+=this.vx*t,this.z+=this.vz*t,Da(n.hash,this,this.radius,2,this.y),Xu(this,e.vehicles,(S,R,I,L)=>{this.knockT<=0&&this.invulnT<=0&&(this.knock(S.vx*.9+I*2,S.vz*.9+L*2,R*3),S.driver?.kind==="cop"&&e.police.noteRam())}),!e.stores.interior){const S=Xe.WORLD_R;this.x=Yt(this.x,-S,S),this.z=Yt(this.z,-S,S)}this.updateCombat(t,a);const T=Math.hypot(this.vx,this.vz);s.move=se(s.move,Yt(T/Ne.WALK,0,1),12,t),s.run=se(s.run,Yt((T-Ne.WALK)/(Ne.SPRINT-Ne.WALK),0,1),8,t),s.aiming=this.aiming,s.firePose=this.firePoseT,s.aimPitch=-e.rig.pitch+.05,s.airborne=!this.onGround&&!this.swimming,s.swim=this.swimming,s.hasWeapon=this.currentWeapon!=="fist",s.weaponLong=!!Bi[this.currentWeapon].long,s.sitting=!1,s.exhausted=p,s.sprinting=M&&T>Ne.RUN,this.punchT=Math.max(0,this.punchT-t*3),s.punch=this.punchT,this.char.animate(t),this.syncMesh(),this.speed=T}updateCombat(t,e){const i=this.game,n=i.input,s=Bi[this.currentWeapon];if(i.travel.menu||i.stores.shopOpen)return;const a=this.vehicle?n.vehicleFiring??n.mouse.left:n.firing??n.mouse.left,o=this.vehicle?n.vehicleFiringPressed??n.mouse.leftPressed:n.firingPressed??n.mouse.leftPressed;if(!(s.auto?a:o)||this.fireT>0)return;if(s.melee){this.fireT=s.rate,this.punchT=1,i.audio.punch();for(const f of[...i.peds]){if(f.dead||yt(f.x,f.z,this.x,this.z)>2)continue;const d=Math.atan2(f.x-this.x,f.z-this.z);if(!(Math.abs(Ns(d-this.heading))>1)){f.hurt(s.damage,this,fa.set(Math.sin(this.heading),0,Math.cos(this.heading))),f.vx=Math.sin(this.heading)*3,f.vz=Math.cos(this.heading)*3,i.effects.blood(f.x,f.y+1.2,f.z,3),i.crime("assault",this.x,this.z);break}}return}if((this.ammo[this.currentWeapon]||0)<=0){this.currentWeapon="fist";return}this.fireT=s.rate,this.ammo[this.currentWeapon]--;const c=i.camera;fa.set(0,0,-1).applyQuaternion(c.quaternion);const h=Zn(i,c.position,fa,s.range+10,this);!this.vehicle&&!this.aiming&&(this.firePoseT=.7),this.vehicle||(this.char.state.aimPitch=-i.rig.pitch+.05,this.char.state.firePose=1,this.char.animate(.05)),this.char.group.updateMatrixWorld(!0),this.char.muzzle.getWorldPosition(ua),this.vehicle&&ua.set(this.x+Math.sin(this.heading)*.3,this.y+1.2,this.z+Math.cos(this.heading)*.3),sr.copy(h.point).sub(ua),sr.length()<1.5&&sr.copy(fa),sr.normalize(),O1(i,this,this.currentWeapon,ua.clone(),sr),i.rig.recoil+=s.recoil*.06,i.rig.addShake(s.recoil*.15),i.input.rumble?.(Math.min(1,.25+s.recoil*.25),.2,90),i.crime("gunfire",this.x,this.z),this.ammo[this.currentWeapon]<=0&&setTimeout(()=>{this.ammo[this.currentWeapon]<=0&&(this.currentWeapon="fist")},300)}updateBody(t,e,i){const n=this.game.city;if(e){this.vy-=Ne.GRAVITY*t,this.y+=this.vy*t;const s=n.surfaceHeight(this.x,this.z,this.y);this.y<s&&(this.y=s,this.vy=0,this.vx*=.5,this.vz*=.5),this.x+=this.vx*t,this.z+=this.vz*t,this.vx*=Math.exp(-3*t),this.vz*=Math.exp(-3*t),Da(n.hash,this,this.radius,2,this.y)}this.char.animate(t),this.syncMesh()}nearestPed(t){let e=null,i=t;for(const n of this.game.peds){if(n.dead||n.vehicle)continue;const s=yt(n.x,n.z,this.x,this.z);s<i&&(i=s,e=n)}return e}aimAssist(t,e){const i=this.game,n=i.rig,s=n.forward(Uo);let a=null,o=e?.94:.985;for(const m of i.peds){if(m.dead||m.vehicle)continue;const v=m.x-this.x,g=m.z-this.z,p=Math.hypot(v,g);if(p<1.5||p>45)continue;const w=(v*s.x+g*s.z)/p-p*8e-4;w>o&&(o=w,a=m)}if(i.aimTarget=a,!a)return;const l=Math.atan2(-(a.x-n.pos.x),-(a.z-n.pos.z)),c=a.y+1.1-n.pos.y,h=Math.hypot(a.x-n.pos.x,a.z-n.pos.z),f=-Math.atan2(c,h),u=Math.abs(i.input.mouse.dx)+Math.abs(i.input.mouse.dy)>2,d=e?40:u?1.5:6;n.yaw=Gi(n.yaw,l,d,t),n.pitch=Ht(n.pitch,Yt(f,-.35,.9),1-Math.exp(-d*t))}setOutfit(t,e){const i=this.char,n=!!this.vehicle;this.char=new Pl({kind:"player",shirt:t,pants:e,weapon:i.gunKey}),this.char.state=i.state,this.char.phase=i.phase,i.dispose(),(n?this.vehicle.seat:this.game.scene).add(this.char.group),n||this.syncMesh()}nearestVehicle(t){let e=null,i=t;for(const n of this.game.vehicles){const s=yt(n.x,n.z,this.x,this.z)-n.halfW;s<i&&!n.destroyed&&(i=s,e=n)}return e}beginEnter(t){if(this.wantedVehicle=t,this.enterT=.45,this.aiming=!1,this.heading=Math.atan2(t.x-this.x,t.z-this.z),t.driver&&t.driver!==this){const e=t.driver;e.exitVehicle(),e.panic(this.x,this.z,8),e.kind==="cop"&&this.game.police.onCopHurt(e,this),this.game.crime("carjack",t.x,t.z),this.stats.carsStolen++,this.enterT=.8}else(t.control==="ai"||t.control==="cop")&&(this.game.traffic.release(t),t.control="none",t.throttle=0,t.brake=1,this.game.pedsMgr.spawnDriver(t).panic(this.x,this.z,8),this.game.crime("carjack",t.x,t.z),this.stats.carsStolen++,this.enterT=.8)}finishEnter(){const t=this.wantedVehicle;this.wantedVehicle=null,!(!t||t.destroyed)&&(this.game.traffic.release(t),this.game.police.release(t),this.vehicle=t,t.driver=this,t.control="player",t.isParked=!1,t.abandoned=!1,t.seat.add(this.char.group),this.char.group.position.set(0,0,0),this.char.group.rotation.set(0,0,0),this.char.state.sitting=!0,this.char.state.aiming=!1,this.char.state.hasWeapon=!1,this.game.rig.snapBehind(t.heading),this.game.audio.setRadio(!0),this.game.onEnterVehicle(t))}exitVehicle(t=!1){const e=this.vehicle;if(!e)return;const i=e.absSpeed>9;this.vehicle=null,e.driver=null,e.control="none",e.throttle=0,e.brake=i?0:.3,e.steerInput=0,e.handbrake=!1,e.setLights(!1),e.sirenOn=!1,i||(e.vx=e.vz=0,e.angVel=0,e.type.fly||(e.vy=0)),e.abandoned=!0,this.invulnT=Math.max(this.invulnT,.6),this.game.scene.add(this.char.group),this.char.state.sitting=!1;const n=Math.sin(e.heading),s=Math.cos(e.heading);this.x=e.x+s*(e.halfW+.9),this.z=e.z-n*(e.halfW+.9);const a=this.game.city.surfaceHeight(this.x,this.z,e.y),o=e.type.fly&&e.y>a+2.5;this.y=o?e.y:a,this.vy=o?Math.min(0,e.vy||0):0,this.onGround=!o,this.heading=e.heading,i&&!t&&this.knock(e.vx*.5,e.vz*.5,e.absSpeed*1.2),this.game.audio.setRadio(!1),this.game.onExitVehicle(e),this.syncMesh()}updateInVehicle(t){const e=this.game,i=e.input,n=this.vehicle;if(n.destroyed){this.takeDamage(200,null,"explosion");return}if(i.hit("enter")){this.exitVehicle();return}const s=i.drive?i.drive():{throttle:i.down("forward")?1:0,brake:i.down("back")?1:0,steer:-i.axis("left","right")};n.throttle=s.throttle,n.brake=s.brake,n.steerInput=s.steer,n.handbrake=i.down("handbrake"),i.hit("horn")&&e.audio.horn(!0),i.down("horn")||e.audio.horn(!1),i.hit("radio")&&e.notify("📻 "+e.audio.nextStation(),1800),n.setLights(e.night>.35),(n.type.cop||n.type.ems)&&(n.sirenOn=!0),this.aiming=!1;const a=e.rig.forward(Uo);this.currentWeapon!=="fist"&&!Bi[this.currentWeapon].long&&(this.char.state.hasWeapon=i.vehicleFiring??i.mouse.left,this.updateCombat(t,a)),this.x=n.x,this.z=n.z,this.y=n.y,this.heading=n.heading,this.vx=n.vx,this.vz=n.vz,this.speed=n.absSpeed,this.char.state.sitting=!0,this.char.animate(t)}}const an={sedan:{len:4.5,wid:1.85,mass:1300,maxSpeed:38,accel:9,brake:22,grip:7.5,steer:.55,wheelR:.34,cls:"sedan",colors:[12597547,2719929,15528177,2899536,8359053,2600544,9323693,15965202,1710618,13849600],profile:[[-2.25,.3],[-2.25,.78],[-1.85,.84],[-1.35,.86],[-.85,1.36],[.55,1.4],[1.25,.96],[2.05,.86],[2.25,.55],[2.25,.3]],cabin:[[-1.35,.86],[-.85,1.36],[.55,1.4],[1.25,.96]]},executive:{base:"sedan",len:4.9,maxSpeed:41,accel:9.5,mass:1550,cls:"sedan",colors:[1710618,2899536,15528177,6111287,727610],profile:[[-2.45,.3],[-2.45,.78],[-2,.84],[-1.4,.86],[-.9,1.34],[.7,1.38],[1.5,.94],[2.25,.84],[2.45,.55],[2.45,.3]],cabin:[[-1.4,.86],[-.9,1.34],[.7,1.38],[1.5,.94]]},reverie:{len:4.4,wid:1.9,mass:1350,maxSpeed:44,accel:11,brake:24,grip:8.2,steer:.53,wheelR:.33,cls:"coupe",colors:[16723245,1118481,15528177,2719929,9323693,15965202],profile:[[-2.2,.32],[-2.2,.72],[-1.8,.8],[-1,.84],[-.4,1.28],[.5,1.3],[1.2,.9],[2,.8],[2.2,.5],[2.2,.32]],cabin:[[-1,.84],[-.4,1.28],[.5,1.3],[1.2,.9]]},seraph:{base:"reverie",len:4.6,maxSpeed:47,accel:12,mass:1450,cls:"coupe",colors:[727610,6111287,12632256,1710618,7997962],profile:[[-2.3,.3],[-2.3,.7],[-1.9,.78],[-1.1,.82],[-.5,1.24],[.6,1.26],[1.4,.88],[2.1,.78],[2.3,.48],[2.3,.3]],cabin:[[-1.1,.82],[-.5,1.24],[.6,1.26],[1.4,.88]]},sports:{len:4.4,wid:1.95,mass:1200,maxSpeed:52,accel:14,brake:26,grip:9.5,steer:.5,wheelR:.33,cls:"sports",colors:[16723245,16766464,49919,16777215,1118481,16742912,10181046],profile:[[-2.2,.3],[-2.2,.72],[-1.7,.8],[-1.1,.82],[-.5,1.15],[.6,1.18],[1.3,.8],[2.1,.66],[2.2,.45],[2.2,.3]],cabin:[[-1.1,.82],[-.5,1.15],[.6,1.18],[1.3,.8]]},kestrel:{base:"sports",len:4.35,maxSpeed:54,accel:14.5,cls:"sports",colors:[49919,16742912,1118481,15528177,3066993],profile:[[-2.17,.28],[-2.17,.66],[-1.6,.76],[-1,.8],[-.3,1.1],[.7,1.12],[1.35,.78],[2.05,.62],[2.17,.42],[2.17,.28]],cabin:[[-1,.8],[-.3,1.1],[.7,1.12],[1.35,.78]]},vortex:{len:4.5,wid:2,mass:1150,maxSpeed:60,accel:17,brake:28,grip:10.5,steer:.46,wheelR:.32,cls:"super",colors:[16766464,16723245,1118481,49919,16742912],profile:[[-2.25,.26],[-2.25,.6],[-1.7,.68],[-.9,.72],[-.2,1.02],[.5,1.04],[1.2,.72],[2,.6],[2.25,.4],[2.25,.26]],cabin:[[-.9,.72],[-.2,1.02],[.5,1.04],[1.2,.72]]},scalpel:{base:"vortex",len:4.45,maxSpeed:62,accel:18,mass:1100,grip:11,cls:"super",colors:[1118481,9323693,15528177,16723245,727610],profile:[[-2.22,.24],[-2.22,.55],[-1.5,.62],[-.6,.68],[0,.98],[.6,1],[1.1,.7],[1.9,.58],[2.22,.36],[2.22,.24]],cabin:[[-.6,.68],[0,.98],[.6,1],[1.1,.7]]},stiletto:{base:"vortex",len:4.3,maxSpeed:55,accel:15,mass:1250,cls:"super",colors:[7997962,12632256,6111287,1710618,727610],profile:[[-2.15,.3],[-2.15,.62],[-1.7,.7],[-.9,.74],[-.3,1.05],[.4,1.06],[1,.74],[1.9,.62],[2.15,.42],[2.15,.3]],cabin:[[-.9,.74],[-.3,1.05],[.4,1.06],[1,.74]]},solair:{base:"sports",cls:"cabrio",open:!0,maxSpeed:50,colors:[16766464,16777215,16723245,49919,16742912],profile:[[-2.2,.3],[-2.2,.7],[-1.7,.78],[-1.1,.8],[-.5,.92],[.6,.94],[1.3,.8],[2.1,.66],[2.2,.45],[2.2,.3]],cabin:[[-1.1,.8],[-.5,.92],[.6,.94],[1.3,.8]]},bella:{base:"seraph",cls:"cabrio",open:!0,maxSpeed:42,accel:10,colors:[7997962,15528177,6111287,727610,3033722],profile:[[-2.3,.3],[-2.3,.68],[-1.9,.76],[-1.1,.8],[-.5,.9],[.6,.92],[1.4,.86],[2.1,.76],[2.3,.46],[2.3,.3]],cabin:[[-1.1,.8],[-.5,.9],[.6,.92],[1.4,.86]]},bruiser:{len:4.6,wid:1.95,mass:1500,maxSpeed:46,accel:13,brake:22,grip:7.8,steer:.52,wheelR:.35,cls:"muscle",colors:[1710618,7997962,727610,6111287,2829099,16742912],profile:[[-2.3,.3],[-2.3,.8],[-1.9,.9],[-1.3,.92],[-.7,1.32],[.5,1.34],[1.1,.98],[2,.9],[2.3,.6],[2.3,.3]],cabin:[[-1.3,.92],[-.7,1.32],[.5,1.34],[1.1,.98]]},howler:{base:"bruiser",len:4.5,maxSpeed:48,accel:14,cls:"muscle",colors:[16766464,1118481,3066993,12597547,15528177],profile:[[-2.25,.3],[-2.25,.82],[-1.8,.92],[-1.2,.94],[-.6,1.3],[.5,1.32],[1,.96],[1.95,.88],[2.25,.58],[2.25,.3]],cabin:[[-1.2,.94],[-.6,1.3],[.5,1.32],[1,.96]]},razor:{base:"bruiser",len:4.4,maxSpeed:44,accel:12,mass:1400,cls:"muscle",colors:[2899536,9079434,1710618,7997962,727610],profile:[[-2.2,.32],[-2.2,.78],[-1.8,.88],[-1.2,.9],[-.6,1.28],[.4,1.3],[1,.94],[1.9,.86],[2.2,.56],[2.2,.32]],cabin:[[-1.2,.9],[-.6,1.28],[.4,1.3],[1,.94]]},luz:{len:4.7,wid:1.9,mass:1450,maxSpeed:40,accel:10,brake:21,grip:7.2,steer:.55,wheelR:.33,cls:"lowrider",colors:[9323693,2600544,12597547,2719929,15844367,15528177],profile:[[-2.35,.26],[-2.35,.72],[-1.9,.8],[-1.2,.84],[-.6,1.28],[.6,1.3],[1.3,.9],[2.05,.82],[2.35,.52],[2.35,.26]],cabin:[[-1.2,.84],[-.6,1.28],[.6,1.3],[1.3,.9]]},majestic:{base:"luz",len:4.6,maxSpeed:42,accel:10.5,cls:"lowrider",colors:[1710618,6111287,727610,7997962,2829099],profile:[[-2.3,.26],[-2.3,.74],[-1.85,.82],[-1.15,.86],[-.55,1.26],[.55,1.28],[1.25,.88],[2,.8],[2.3,.5],[2.3,.26]],cabin:[[-1.15,.86],[-.55,1.26],[.55,1.28],[1.25,.88]]},regal:{len:4.8,wid:1.9,mass:1500,maxSpeed:36,accel:8,brake:19,grip:6.8,steer:.55,wheelR:.36,cls:"classic",colors:[6111287,3033722,1710618,7997962,15528177,7162945],profile:[[-2.4,.32],[-2.4,.7],[-2,.82],[-1.3,.86],[-.7,1.3],[.5,1.32],[1.2,.92],[2,.84],[2.4,.55],[2.4,.32]],cabin:[[-1.3,.86],[-.7,1.3],[.5,1.32],[1.2,.92]]},suv:{len:4.8,wid:2,mass:2e3,maxSpeed:34,accel:8,brake:20,grip:6.5,steer:.5,wheelR:.4,cls:"suv",colors:[2899536,1710618,15528177,7162945,5597999,8359053],profile:[[-2.4,.4],[-2.4,1.1],[-2.3,1.85],[-2,1.9],[1,1.9],[1.5,1.2],[2.3,1.1],[2.4,.6],[2.4,.4]],cabin:[[-2.3,1.1],[-2.25,1.82],[1,1.82],[1.45,1.2]]},monarch:{base:"suv",len:5,maxSpeed:37,accel:9,mass:2200,cls:"suv",colors:[1710618,15528177,727610,6111287,12632256],profile:[[-2.5,.4],[-2.5,1.15],[-2.4,1.92],[-2,1.97],[1.1,1.97],[1.6,1.25],[2.4,1.15],[2.5,.6],[2.5,.4]],cabin:[[-2.4,1.15],[-2.35,1.9],[1.1,1.9],[1.55,1.25]]},golem:{base:"suv",len:4.9,maxSpeed:33,accel:8.5,grip:7,wheelR:.46,cls:"offroad",colors:[5597999,7162945,8359053,12597547,1710618],profile:[[-2.45,.5],[-2.45,1.2],[-2.35,1.95],[-2,2],[1,2],[1.5,1.3],[2.35,1.2],[2.45,.7],[2.45,.5]],cabin:[[-2.35,1.2],[-2.3,1.92],[1,1.92],[1.45,1.3]]},dune:{len:5.1,wid:2,mass:1900,maxSpeed:35,accel:9,brake:19,grip:7,steer:.52,wheelR:.46,cls:"offroad",colors:[12597547,15965202,2600544,15528177,2899536],profile:[[-2.55,.5],[-2.55,1.2],[-.4,1.2],[-.4,1.9],[.8,1.9],[1.4,1.25],[2.45,1.15],[2.55,.65],[2.55,.5]],cabin:[[-.35,1.25],[-.35,1.83],[.8,1.83],[1.35,1.3]]},pickup:{len:5.2,wid:2,mass:1900,maxSpeed:36,accel:8.5,brake:20,grip:6.5,steer:.5,wheelR:.4,cls:"pickup",colors:[12597547,2899536,15528177,7162945,8359053],profile:[[-2.6,.45],[-2.6,1.15],[-.3,1.15],[-.3,1.85],[.9,1.85],[1.5,1.2],[2.5,1.1],[2.6,.6],[2.6,.45]],cabin:[[-.25,1.2],[-.25,1.78],[.9,1.78],[1.45,1.2]]},van:{len:5,wid:2,mass:2200,maxSpeed:30,accel:6,brake:18,grip:6,steer:.45,wheelR:.38,cls:"van",colors:[15528177,12436423,2719929,12597547,15844367],profile:[[-2.5,.4],[-2.5,2.1],[.9,2.1],[1.6,1.25],[2.4,1.15],[2.5,.6],[2.5,.4]],cabin:[[.7,1.3],[.9,2],[.95,2],[1.55,1.3]]},carrier:{base:"van",len:5.4,maxSpeed:28,accel:5.5,mass:2500,cls:"van",colors:[15528177,8359053,2899536,9323693,2600544],profile:[[-2.7,.4],[-2.7,2.2],[.8,2.2],[1.5,1.3],[2.5,1.2],[2.7,.6],[2.7,.4]],cabin:[[.6,1.35],[.8,2.1],[.85,2.1],[1.45,1.35]]},hauler:{len:7.5,wid:2.4,mass:6e3,maxSpeed:28,accel:4,brake:16,grip:5.5,steer:.4,wheelR:.45,cls:"truck",colors:[12597547,2719929,15528177,1710618,2600544],profile:[[-3.75,.5],[-3.75,2.6],[-.5,2.6],[-.5,1.1],[1.3,1.1],[1.6,2.3],[2.9,2.3],[3.5,1.2],[3.75,.6],[3.75,.5]],cabin:[[1.6,1.15],[1.7,2.2],[2.85,2.2],[3.4,1.2]]},refuse:{base:"hauler",len:7,maxSpeed:26,cls:"service",colors:[2600544,15528177,8359053],profile:[[-3.5,.5],[-3.5,2.5],[-.6,2.5],[-.6,1.1],[1.2,1.1],[1.5,2.2],[2.8,2.2],[3.3,1.2],[3.5,.6],[3.5,.5]],cabin:[[1.5,1.15],[1.6,2.1],[2.75,2.1],[3.2,1.2]]},hook:{base:"hauler",len:6.8,maxSpeed:30,accel:5,cls:"service",colors:[15965202,1710618,12597547],profile:[[-3.4,.5],[-3.4,1],[-.8,1],[-.8,1.1],[1.2,1.1],[1.5,2.2],[2.7,2.2],[3.2,1.2],[3.4,.6],[3.4,.5]],cabin:[[1.5,1.15],[1.6,2.1],[2.65,2.1],[3.1,1.2]]},coach:{len:9,wid:2.5,mass:8e3,maxSpeed:30,accel:4,brake:15,grip:5,steer:.38,wheelR:.45,cls:"bus",colors:[2719929,15528177,2600544,15965202,9323693],profile:[[-4.5,.5],[-4.5,2.4],[-4.2,2.7],[3.6,2.7],[4.3,1.6],[4.5,.6],[4.5,.5]],cabin:[[-4.2,1.2],[-4.1,2.55],[3.5,2.55],[4.1,1.3]]},taxi:{base:"sedan",colors:[16106776],maxSpeed:40,cls:"sedan",taxi:!0},cabbie:{base:"van",colors:[16106776],maxSpeed:32,cls:"van",taxi:!0,profile:[[-2.5,.4],[-2.5,2.1],[.9,2.1],[1.6,1.25],[2.4,1.15],[2.5,.6],[2.5,.4]],cabin:[[.7,1.3],[.9,2],[.95,2],[1.55,1.3]]},police:{base:"sedan",colors:[16053492],maxSpeed:50,accel:13.5,grip:9,mass:1500,cls:"sedan",cop:!0},interceptor:{base:"sports",colors:[727610],maxSpeed:56,accel:15,grip:10,mass:1300,cls:"sports",cop:!0},warden:{base:"suv",colors:[1710618],maxSpeed:42,accel:10,grip:7.5,mass:2100,cls:"suv",cop:!0},pulse:{base:"van",colors:[16777215],maxSpeed:38,accel:8,cls:"van",ems:"amb",profile:[[-2.5,.4],[-2.5,2.2],[.9,2.2],[1.6,1.3],[2.4,1.2],[2.5,.6],[2.5,.4]],cabin:[[.7,1.35],[.9,2.1],[.95,2.1],[1.55,1.35]]},inferno:{base:"hauler",len:7.2,colors:[12597547],maxSpeed:34,accel:6,cls:"truck",ems:"fire",profile:[[-3.6,.5],[-3.6,2.4],[-.6,2.4],[-.6,1.1],[1.3,1.1],[1.6,2.2],[2.8,2.2],[3.4,1.2],[3.6,.6],[3.6,.5]],cabin:[[1.6,1.15],[1.7,2.1],[2.75,2.1],[3.3,1.2]]},forklift:{len:2.6,wid:1.4,mass:1800,maxSpeed:12,accel:5,brake:14,grip:8,steer:.7,wheelR:.28,cls:"utility",colors:[15965202,12597547,2719929],profile:[[-1.3,.3],[-1.3,1.3],[-.4,1.9],[.5,1.9],[1.3,.9],[1.3,.3]],cabin:[[-.4,1.3],[-.3,1.85],[.4,1.85],[.5,1.3]]},tug:{len:3,wid:1.6,mass:2e3,maxSpeed:16,accel:6,brake:16,grip:8,steer:.65,wheelR:.3,cls:"utility",colors:[15528177,16106776,2719929],profile:[[-1.5,.3],[-1.5,1],[-.8,1.5],[.6,1.5],[1.5,.8],[1.5,.3]],cabin:[[-.8,1],[-.7,1.45],[.5,1.45],[.6,1]]},limo:{base:"executive",len:6.4,maxSpeed:42,accel:8.5,mass:1900,cls:"sedan",colors:[1118481,15528177,2899536],profile:[[-3.2,.3],[-3.2,.78],[-2.75,.84],[-1.9,.86],[-1.4,1.34],[1.2,1.38],[2,.94],[3,.84],[3.2,.55],[3.2,.3]],cabin:[[-1.9,.86],[-1.4,1.34],[1.2,1.38],[2,.94]]},icecream:{base:"van",len:4.6,maxSpeed:28,accel:5.5,mass:2e3,cls:"van",colors:[16777215,16758485,8382463],profile:[[-2.3,.4],[-2.3,2],[.8,2],[1.5,1.25],[2.2,1.15],[2.3,.6],[2.3,.4]],cabin:[[.6,1.3],[.8,1.9],[.85,1.9],[1.45,1.3]]},securicar:{base:"van",len:5,maxSpeed:33,accel:6.5,mass:3e3,cls:"van",colors:[3046735,1710618,8359053],profile:[[-2.5,.4],[-2.5,2.1],[.9,2.1],[1.6,1.25],[2.4,1.15],[2.5,.6],[2.5,.4]],cabin:[[.7,1.3],[.9,2],[.95,2],[1.55,1.3]]},mower:{len:1.8,wid:1.2,mass:400,maxSpeed:9,accel:4,brake:10,grip:7,steer:.75,wheelR:.24,cls:"utility",colors:[2600544,12597547,15965202],profile:[[-.9,.25],[-.9,.8],[-.3,1.1],[.5,1.1],[.9,.6],[.9,.25]],cabin:[[-.3,.8],[-.25,1.05],[.4,1.05],[.45,.8]]},heli:{len:5.2,wid:1.9,mass:1200,maxSpeed:42,accel:11,brake:10,grip:4,steer:.9,wheelR:.3,cls:"heli",fly:"heli",colors:[12597547,2719929,1118481,15528177,2600544],profile:[[-2.6,.8],[-2.6,1.4],[-1.6,1.8],[.4,2],[2,1.6],[2.6,1],[2.6,.8]],cabin:[[-1.6,1.4],[-1.4,1.75],[.2,1.95],[.4,1.4]]},hunter:{base:"heli",colors:[2046611],maxSpeed:48,accel:13,mass:1400,cls:"heli",fly:"heli",cop:!0},dodo:{len:6.2,wid:2.2,mass:1100,maxSpeed:55,accel:10,brake:12,grip:5,steer:.5,wheelR:.3,cls:"plane",fly:"plane",colors:[15528177,12597547,2719929,15965202],profile:[[-3.1,.5],[-3.1,1.1],[-1,1.3],[1,1.5],[2.6,1],[3.1,.6],[3.1,.5]],cabin:[[-1,1.1],[-.8,1.45],[.8,1.5],[1,1.1]]},shamal:{len:11,wid:2.8,mass:9e3,maxSpeed:62,accel:7,brake:10,grip:4,steer:.35,wheelR:.4,cls:"plane",fly:"plane",colors:[15528177,12436423],profile:[[-5.5,.8],[-5.5,1.6],[-2,1.9],[2,2.1],[4.5,1.5],[5.5,.9],[5.5,.8]],cabin:[[-2,1.6],[-1.8,1.85],[2,2],[2.2,1.5]]}};for(const r in an){const t=an[r];t.base?an[r]={...an[t.base],...t,name:r}:t.name=r}const qu=new pt({color:1715260,roughness:.1,metalness:.8,transparent:!0,opacity:.55}),zl=new pt({color:1381653,roughness:.95}),Yu=new pt({color:11449530,roughness:.35,metalness:.9}),Gt=new pt({color:1842978,roughness:.5,metalness:.4}),Ue=new pt({color:14147043,roughness:.15,metalness:1}),Dl=new pt({color:16751130,emissive:16747520,emissiveIntensity:.7,roughness:.3}),ys=new pt({color:15921902,roughness:.6}),Sn=new pt({color:858150,roughness:.08,metalness:.9}),Ms=new pt({color:2303531,roughness:.9}),Zu=new pt({color:13144410,roughness:.8}),Ku=new pt({color:16758485,roughness:.6}),Ti=new Map;function hi(r,t){if(!Ti.has(r)){const e=t();e.userData.shared=!0,Ti.set(r,e)}return Ti.get(r)}const ju=()=>hi("box1",()=>new tc(1,1,1,2,.1)),ps=(r,t,e=12)=>hi(`cylx_${r}_${t}`,()=>{const i=new jt(r,r,t,e);return i.rotateX(Math.PI/2),i});function Fe(r,t,e,i=.03){const n=`rb${r},${t},${e},${i}`;if(!Ti.has(n)){const s=new tc(r,t,e,2,Math.min(i,Math.min(r,t,e)*.4));s.userData.shared=!0,Ti.set(n,s)}return Ti.get(n)}for(const r of[qu,zl,Yu,Gt,Ue,Dl,ys,Sn,Ms,Zu,Ku,ju()])r.userData.shared=!0;function Gh(r,t,e,i,n){const s=r.name+t+i;if(Ti.has(s))return Ti.get(s);const a=new Du;e.forEach((l,c)=>c===0?a.moveTo(l[0],l[1]):a.lineTo(l[0],l[1]));const o=new Kl(a,{depth:i,bevelEnabled:n,bevelThickness:.08,bevelSize:.08,bevelSegments:3,curveSegments:3});return o.rotateY(-Math.PI/2),o.translate(i/2,0,0),o.computeVertexNormals(),o.userData.shared=!0,Ti.set(s,o),o}let Y1=0;class Z1{constructor(t,e){const i=this.type=an[t]||an.sedan;this.id=Y1++,this.typeName=i.name,this.color=e??We(i.colors),this.x=0,this.z=0,this.y=0,this.heading=0,this.vx=0,this.vz=0,this.vy=0,this.angVel=0,this.steer=0,this.throttle=0,this.brake=0,this.handbrake=!1,this.steerInput=0,this.health=100,this.destroyed=!1,this.onFire=!1,this.fireT=0,this.smokeT=0,this.driver=null,this.control="none",this.halfL=i.len/2,this.halfW=i.wid/2,this.wheelSpin=0,this.lastImpact=0,this.braking=!1,this.hornT=0,this.airT=0,this.sirenOn=!1,this.lightsOn=!1,this.owner=null,this.isParked=!1,this.stuckT=0,this.buildMesh()}buildMesh(){const t=this.type,e=this.group=new be;e.userData.vehicle=this;const i=this.body=new be;e.add(i),this.paint=new pt({color:this.color,roughness:.25,metalness:.6});const n=new N(Gh(t,"body",t.profile,t.wid,!0),this.paint);n.castShadow=!0,n.receiveShadow=!0,i.add(n);const s=[...t.cabin,[t.cabin[t.cabin.length-1][0],t.cabin[0][1]]];if(!t.open){const Z=new N(Gh(t,"cabin",s,t.wid+.04,!1),qu);Z.position.y=.005,i.add(Z)}const a=ju(),o=(Z,k,Q,st,$,ut,Rt,Pt=0,Vt=0,X=0)=>{const J=new N(a,Z);return J.scale.set(k,Q,st),J.position.set($,ut,Rt),J.rotation.set(Pt,Vt,X),J.castShadow=!0,i.add(J),J},l=t.cabin.map(Z=>Z[0]),c=t.cabin.map(Z=>Z[1]),h=Math.max(...l),f=Math.min(...l),u=(h+f)/2,d=h-f,m=Math.max(...c),v=Math.min(...c),g=(t.cabin[0][0]+t.cabin[t.cabin.length-1][0])/2-.2,p=.3+(t.cabin[0][1]-.86),M=(v+m)/2+.02,w=t.wid/2+.028,x=(Z,k,Q,st)=>({L:Math.hypot(Z-Q,k-st)+.08,rx:Math.atan2(Z-Q,k-st),z:(Z+Q)/2,y:(k+st)/2}),y=x(l[2],c[2],l[3],c[3]),b=x(l[1],c[1],l[0],c[0]);o(Sn,t.wid*.8,y.L,.03,0,y.y,y.z,y.rx),o(Sn,t.wid*.78,b.L,.03,0,b.y,b.z,b.rx);for(const Z of[-1,1])o(Gt,.07,y.L+.06,.07,Z*t.wid*.42,y.y,y.z,y.rx),o(Sn,.02,.3,d*.22,Z*w,M,u+d*.135),o(Sn,.02,.3,d*.22,Z*w,M,u-d*.135),o(Gt,.05,.34,.07,Z*w,M,u),t.cls==="bus"&&(o(Gt,.05,.5,.07,Z*w,M+.1,u+d*.3),o(Gt,.05,.5,.07,Z*w,M+.1,u-d*.3));o(Gt,t.wid*.86,.07,.09,0,c[2]-.02,l[2]+.02),t.open?o(Gt,t.wid*.8,.16,.5,0,v+.12,u-d*.28):!["pickup","truck","bus","van","service"].includes(t.cls)&&!t.ems&&o(Sn,t.wid*.44,.02,Math.min(.95,d*.4),0,m+.008,u+d*.08);const _=new N(Fe(t.wid+.06,.05,.08,.02),Gt);_.position.set(0,t.cabin[0][1]+.02,t.cabin[0][0]+.02),i.add(_);const E=(t.cabin[1][0]+t.cabin[2][0])/2,T=new N(Fe(t.wid+.06,Math.max(.1,t.cabin[1][1]-t.cabin[0][1]-.05),.08,.02),Gt);T.position.set(0,(t.cabin[1][1]+t.cabin[0][1])/2,E),i.add(T);for(const Z of[-1,1])o(Ue,.03,.035,.13,Z*(t.wid/2+.012),.95,g+.62),o(Ue,.03,.035,.13,Z*(t.wid/2+.012),.95,g-.62),o(Gt,.02,.09,t.len*.62,Z*(t.wid/2+.008),.55,0);const S=new N(Fe(t.wid*.98,.22,.12,.06),Gt);S.position.set(0,.42,t.len/2+.02),i.add(S);const R=S.clone();R.position.z=-t.len/2-.02,i.add(R);const I=new N(Fe(t.wid*.45,.16,.06,.02),Gt);I.position.set(0,.68,t.len/2+.03),i.add(I),o(Ue,t.wid*.4,.025,.02,0,.71,t.len/2+.065),o(Ue,t.wid*.4,.025,.02,0,.64,t.len/2+.065),o(ys,.34,.1,.02,0,.42,t.len/2+.085),o(ys,.34,.1,.02,0,.42,-t.len/2-.085),this.headMat=new pt({color:16774880,emissive:16773836,emissiveIntensity:.3,roughness:.2}),this.tailMat=new pt({color:9109504,emissive:16719888,emissiveIntensity:.4,roughness:.3});const L=t.profile[t.profile.length-3][1]+.05,B=t.profile[1][1]-.1;for(const Z of[-1,1]){const k=new N(Fe(.42,.16,.08,.05),this.headMat);k.position.set(Z*(t.wid/2-.32),L,t.len/2+.02),i.add(k),o(Dl,.12,.1,.06,Z*(t.wid/2-.1),L,t.len/2+.02);const Q=new N(Fe(.4,.14,.08,.05),this.tailMat);Q.position.set(Z*(t.wid/2-.3),B,-t.len/2-.02),i.add(Q);const st=new N(Fe(.1,.1,.18,.03),this.paint);st.position.set(Z*(t.wid/2+.08),t.cabin[0][1]+.1,t.cabin[t.cabin.length-1][0]-.1),i.add(st)}o(this.tailMat,t.wid*.7,.09,.05,0,B,-t.len/2-.03);for(const Z of[-1,1]){const k=new N(ps(.035,.18),Ue);k.position.set(Z*.32,.24,-t.len/2-.06),i.add(k)}const W=new N(hi("antenna",()=>new jt(.008,.012,.5,6)),Gt);W.position.set(t.wid/2-.25,m+.25,-t.len/2+.7),i.add(W),this.headY=L,o(Ms,.5,.14,.5,.38,p-.02,g),o(Ms,.5,.14,.5,-.38,p-.02,g),o(Ms,.5,.55,.16,.38,p+.3,g-.3),o(Ms,.5,.55,.16,-.38,p+.3,g-.3),o(Ms,t.wid-.5,.18,.4,0,p+.28,g+.95);const U=new N(hi("swheel",()=>new Ts(.16,.025,8,18)),Gt);U.position.set(.38,p+.42,g+.55),U.rotation.x=-.45,i.add(U),this.wheels=[];const q="wheel"+t.wheelR;if(!Ti.has(q)){const Z=new jt(t.wheelR,t.wheelR,.26,24);Z.rotateZ(Math.PI/2),Z.userData.shared=!0;const k=new jt(t.wheelR*.6,t.wheelR*.6,.27,12);k.rotateZ(Math.PI/2),k.userData.shared=!0,Ti.set(q,[Z,k])}const[V,rt]=Ti.get(q),et=hi("hub"+t.wheelR,()=>{const Z=new jt(t.wheelR*.22,t.wheelR*.22,.29,8);return Z.rotateZ(Math.PI/2),Z}),mt=hi("lip"+t.wheelR,()=>{const Z=new Ts(t.wheelR*.6,.028,8,20);return Z.rotateY(Math.PI/2),Z}),Ct=t.len*.32;if(t.cls!=="heli")for(const[Z,k]of[[-1,1],[1,1],[-1,-1],[1,-1]]){const Q=new be;Q.position.set(Z*(t.wid/2-.12),t.wheelR,k*Ct),e.add(Q);const st=new N(V,zl);st.castShadow=!0,Q.add(st);const $=new N(rt,Yu);Q.add($);const ut=new N(et,Gt);$.add(ut);const Rt=new N(mt,Ue);if($.add(Rt),t.cls==="classic"||t.cls==="lowrider"){const Pt=hi("ww"+t.wheelR,()=>{const Vt=new Ts(t.wheelR*.72,.035,8,20);return Vt.rotateY(Math.PI/2),Vt});for(const Vt of[-.1,.1]){const X=new N(Pt,ys);X.position.x=Vt,$.add(X)}}this.wheels.push({pivot:Q,mesh:st,rim:$,front:k>0}),o(Gt,.14,.16,.9,Z*(t.wid/2-.02),t.wheelR+.3,k*Ct)}if(this.wheelbase=Ct*2,t.cls==="sports"||t.cls==="super"){const Z=t.cls==="super"?1:1.12;o(Gt,.07,.2,.07,-(t.wid/2-.3),Z-.12,-t.len/2+.35),o(Gt,.07,.2,.07,t.wid/2-.3,Z-.12,-t.len/2+.35),o(t.cls==="super"?Gt:this.paint,t.wid*.88,.06,.35,0,Z,-t.len/2+.35)}if(t.cls==="muscle"){o(this.paint,.5,.12,.5,0,t.profile[t.profile.length-2][1]+.06,t.len*.28),o(Gt,.06,.06,.3,0,t.profile[t.profile.length-2][1]+.13,t.len*.28);for(const Z of[-1,1]){const k=new N(ps(.045,t.len*.5),Ue);k.position.set(Z*(t.wid/2+.02),.28,0),i.add(k)}o(this.paint,t.wid*.9,.07,.25,0,t.profile[1][1]+.08,-t.len/2+.2)}if(t.cls==="lowrider"){o(Ue,t.wid*.9,.05,.05,0,.5,t.len/2+.06);for(const Z of[-1,1]){const k=new N(hi("antenna",()=>new jt(.008,.012,.5,6)),Ue);k.position.set(Z*(t.wid/2-.15),m+.3,f+.2),i.add(k)}}if(t.cls==="classic"){for(const Z of[-1,1])o(Ue,.02,.06,t.len*.7,Z*(t.wid/2+.01),.62,0);o(Ue,t.wid*.9,.05,.05,0,.52,t.len/2+.06)}if((t.cls==="suv"||t.cls==="van"||t.cls==="offroad")&&(o(Gt,.06,.06,t.len*.5,-(t.wid/2-.4),m+.04,0),o(Gt,.06,.06,t.len*.5,t.wid/2-.4,m+.04,0)),t.cls==="offroad"){o(Gt,t.wid*.7,.09,.09,0,.7,t.len/2+.12),o(Gt,.09,.5,.09,-t.wid*.28,.7,t.len/2+.12),o(Gt,.09,.5,.09,t.wid*.28,.7,t.len/2+.12);const Z=new N(hi("spare",()=>new jt(.34,.34,.2,16)),zl);Z.position.set(0,m+.22,u-d*.2),i.add(Z)}if((t.cls==="pickup"||t.name==="dune")&&(o(Gt,t.wid-.5,.05,t.len*.3,0,t.profile[2][1]+.03,-t.len*.26),o(Ue,.2,.03,.03,0,t.profile[1][1]+.05,-t.len/2-.03)),t.cls==="truck"&&!t.ems)for(let Z=0;Z<4;Z++)o(Gt,t.wid+.04,2,.08,0,1.55,-t.len/2+.6+Z*(t.len*.16));if(t.name==="hook"&&(o(Gt,t.wid-.4,.1,t.len*.42,0,1.02,-t.len*.2),o(Ue,.08,.5,.5,0,.7,-t.len/2+.1)),t.cop){const Z=(t.cabin[1][0]+t.cabin[2][0])/2,k=new N(Fe(1.1,.14,.3,.05),Gt);k.position.set(0,t.cabin[1][1]+.07,Z),i.add(k),this.sirenR=new re({color:16719904,toneMapped:!1}),this.sirenB=new re({color:2121983,toneMapped:!1});const Q=new N(Fe(.45,.14,.28,.05),this.sirenR);Q.position.set(-.3,t.cabin[1][1]+.16,Z),i.add(Q);const st=new N(Fe(.45,.14,.28,.05),this.sirenB);st.position.set(.3,t.cabin[1][1]+.16,Z),i.add(st),this.sirenY=t.cabin[1][1]+.6;const $=new N(Fe(t.wid+.02,.35,t.len*.6,.05),new pt({color:727610,roughness:.3,metalness:.5}));$.position.set(0,.62,0),i.add($),o(Gt,t.wid*.62,.09,.09,0,.55,t.len/2+.14),o(Gt,.09,.5,.09,-t.wid*.25,.55,t.len/2+.14),o(Gt,.09,.5,.09,t.wid*.25,.55,t.len/2+.14);const ut=new N(ps(.035,.14),Ue);ut.position.set(t.wid/2+.05,t.cabin[0][1]+.35,h-.1),i.add(ut),t.name==="police"&&o(Sn,t.wid*.5,.3,.02,0,.78,t.len/2+.02)}if(t.taxi){const Z=new N(Fe(.7,.22,.3,.06),new pt({color:16777215,emissive:16770688,emissiveIntensity:.6}));Z.position.set(0,t.cabin[1][1]+.11,(t.cabin[1][0]+t.cabin[2][0])/2),i.add(Z);const k=new N(Fe(t.wid+.02,.18,t.len*.7,.04),new pt({color:1118481,roughness:.4}));k.position.set(0,.7,0),i.add(k)}if(t.ems==="amb"){const Z=new pt({color:12597547,roughness:.4});Z.userData.shared=!0,o(Z,t.wid+.03,.4,t.len*.7,0,.9,-.3),o(ys,.5,.5,.03,t.wid/2+.02,1.4,-.6),o(Z,.34,.12,.04,t.wid/2+.02,1.4,-.6),o(Z,.12,.34,.04,t.wid/2+.02,1.4,-.6);const k=new N(Fe(1,.12,.26,.05),Gt);k.position.set(0,m+.05,u+.5),i.add(k),this.sirenR=new re({color:16719904,toneMapped:!1}),this.sirenB=new re({color:16719904,toneMapped:!1});const Q=new N(Fe(.4,.12,.24,.05),this.sirenR);Q.position.set(-.28,m+.13,u+.5),i.add(Q);const st=new N(Fe(.4,.12,.24,.05),this.sirenB);st.position.set(.28,m+.13,u+.5),i.add(st),this.sirenY=m+.6}if(t.ems==="fire"){for(let $=0;$<5;$++)o(Ue,.6,.05,.05,0,m+.08,-2.2+$*.85);const Z=new pt({color:12436423,roughness:.3,metalness:.7});Z.userData.shared=!0,o(Z,.03,.9,t.len*.4,t.wid/2+.01,1.3,-1.2),o(Z,.03,.9,t.len*.4,-(t.wid/2+.01),1.3,-1.2);const k=new N(Fe(1,.12,.26,.05),Gt);k.position.set(0,m+.05,h-.3),i.add(k),this.sirenR=new re({color:16719904,toneMapped:!1}),this.sirenB=new re({color:16719904,toneMapped:!1});const Q=new N(Fe(.4,.12,.24,.05),this.sirenR);Q.position.set(-.28,m+.13,h-.3),i.add(Q);const st=new N(Fe(.4,.12,.24,.05),this.sirenB);st.position.set(.28,m+.13,h-.3),i.add(st),this.sirenY=m+.6}if(t.cls==="heli"){const Z=t.len*.55,k=new N(ps(.09,Z,8),this.paint);k.position.set(0,m+.05,-t.len/2-Z/2+.4),i.add(k),o(Gt,.08,1.1,.5,0,m+.5,-t.len/2-Z+.4);const Q=new be;Q.position.set(.12,m+.6,-t.len/2-Z+.4),i.add(Q);const st=new N(Fe(.06,1.1,.12,.02),Gt);Q.add(st),this.tailRotor=Q,o(Gt,.16,.5,.16,0,m+.25,u);const $=new be;$.position.set(0,m+.55,u),i.add($);const ut=hi("heliblade",()=>new _t(t.len*1.35,.05,.28)),Rt=new N(ut,Gt);Rt.castShadow=!0,$.add(Rt);const Pt=new N(ut,Gt);Pt.rotation.y=Math.PI/2,$.add(Pt),this.rotor=$;for(const Vt of[-1,1]){const X=new N(ps(.05,t.len*.7,8),Ue);X.rotation.y=Math.PI/2,X.position.set(Vt*(t.wid/2-.25),.18,0),i.add(X),o(Gt,.08,.5,.08,Vt*(t.wid/2-.25),.45,t.len*.2),o(Gt,.08,.5,.08,Vt*(t.wid/2-.25),.45,-t.len*.2)}if(t.cop){o(ys,t.wid+.03,.3,t.len*.4,0,.85,.3);const Vt=new N(hi("swheel",()=>new Ts(.16,.025,8,18)),Ue);Vt.position.set(.5,.7,t.len/2-.3),i.add(Vt),this.sirenR=new re({color:16719904,toneMapped:!1}),this.sirenB=new re({color:2121983,toneMapped:!1}),this.sirenY=m+.8}}if(t.cls==="plane"){const Z=t.len>8;o(this.paint,t.wid*(Z?5.2:3.4),.09,Z?1.5:1.1,0,m-.1,u+(Z?.4:.2)),o(this.paint,t.wid*1.1,.08,.8,0,m+(Z?.9:.5),-t.len/2+.6),o(this.paint,.09,Z?1.6:1.1,.9,0,m+(Z?1.4:.9),-t.len/2+.6);const k=new be;k.position.set(0,m-.35,t.len/2+.15),i.add(k);const Q=hi("propblade",()=>new _t(.16,2,.06)),st=new N(Q,Gt);k.add(st);const $=new N(Q,Gt);if($.rotation.z=Math.PI/2,k.add($),this.rotor=k,this.propAxis="z",Z)for(const ut of[-1,1]){const Rt=new N(ps(.32,1.8,10),this.paint);Rt.position.set(ut*t.wid*1.4,m-.35,u+.4),i.add(Rt)}}if(t.cls==="utility"){if(t.name==="forklift"){for(const Z of[-1,1])o(Gt,.1,1.6,.1,Z*.5,1.1,t.len/2-.1);o(Gt,1.1,.1,.1,0,1.9,t.len/2-.1);for(const Z of[-1,1])o(Ue,.12,.08,1.1,Z*.28,.35,t.len/2+.45);for(const Z of[-1,1])for(const k of[-1,1])o(Gt,.08,1,.08,Z*.55,1.9,k*.5);o(Gt,1.2,.08,1.1,0,2.4,0)}if(t.name==="tug"&&(o(Ue,.08,.08,.7,0,.35,-t.len/2-.3),o(Dl,.12,.12,.12,0,1.65,0)),t.name==="icecream"){o(Sn,t.wid*.7,.6,.06,t.wid/2+.01,1.4,-.3);const Z=new N(hi("icecone",()=>new Vs(.3,.7,10)),Zu);Z.position.set(0,m+.75,-.3),i.add(Z);const k=new N(hi("icescoop",()=>new Oi(.32,10,8)),Ku);k.position.set(0,m+1.2,-.3),i.add(k)}t.name==="securicar"&&(o(Gt,t.wid+.04,.5,t.len*.8,0,.75,-.2),o(Gt,.6,.1,.6,0,m+.05,-.2)),t.name==="mower"&&(o(Gt,1,.18,1.2,0,.3,0),o(Gt,.5,.5,.08,0,.7,-.55),o(Ue,.05,.7,.05,-.3,.9,-.75),o(Ue,.05,.7,.05,.3,.9,-.75))}this.seat=new pe,this.seat.position.set(.38,.3+(t.cabin[0][1]-.86),(t.cabin[0][0]+t.cabin[t.cabin.length-1][0])/2-.2),i.add(this.seat),this.hood=new pe,this.hood.position.set(0,L+.1,t.len/2-.8),i.add(this.hood)}get speed(){const t=Math.sin(this.heading),e=Math.cos(this.heading);return this.vx*t+this.vz*e}get absSpeed(){return Math.hypot(this.vx,this.vz)}setPosition(t,e,i){this.x=t,this.z=e,this.heading=i,this.vx=this.vz=0,this.angVel=0,this.syncMesh()}syncMesh(){this.group.position.set(this.x,this.y,this.z),this.group.rotation.y=this.heading}update(t,e){const i=this.type;this.destroyed&&(this.throttle=0,this.brake=0,this.steerInput=0);const n=Math.sin(this.heading),s=Math.cos(this.heading),a=n,o=s,l=s,c=-n;let h=this.vx*a+this.vz*o,f=this.vx*l+this.vz*c;const u=Math.abs(h)/i.maxSpeed;if(i.fly){this.stepFlight(t,e,i,h,f);return}if(this.throttle>0){const T=i.accel*this.throttle*Math.max(.15,1-u*u);h+=T*t}this.braking=!1,this.brake>0&&(h>.6?(h-=i.brake*this.brake*t,this.braking=!0,h<0&&(h=0)):h>-i.maxSpeed*.35&&(h-=i.accel*.6*this.brake*t)),this.handbrake&&Math.abs(h)>.2&&(h-=Math.sign(h)*6*t,this.braking=!0),h-=h*(.04+.0015*Math.abs(h))*t,this.throttle===0&&this.brake===0&&(h-=Math.sign(h)*Math.min(Math.abs(h),1.2*t)),this.destroyed&&(h-=Math.sign(h)*Math.min(Math.abs(h),4*t));const d=i.grip*(this.handbrake?.22:1),m=Math.min(1,Math.abs(f)/9),v=d*(1-m*.55);f*=Math.exp(-v*t);const g=1/(1+Math.pow(Math.abs(h)/16,1.5)),p=this.steerInput*i.steer*(.35+.65*g);this.steer=se(this.steer,p,10,t);let M=h/this.wheelbase*Math.tan(this.steer)*.85;this.handbrake&&(M*=1.55),M=Yt(M,-2.6,2.6),this.angVel=se(this.angVel,M,8,t),this.heading+=this.angVel*t;const w=Math.sin(this.heading),x=Math.cos(this.heading);this.vx=w*h+x*f,this.vz=x*h-w*f,this.x+=this.vx*t,this.z+=this.vz*t;const y=e.ground(this.x,this.z);this.y>y+.05?(this.vy-=22*t,this.y+=this.vy*t,this.airT+=t,this.y<y&&(this.y=y,this.vy<-6&&this.damage(-this.vy*1.5,"fall"),this.vy=0)):(this.y=se(this.y,y,12,t),this.vy=0,this.airT=0),!this.destroyed&&e.onRoad&&e.onRoad(this.x,this.z)&&this.vy<=1&&this.airT<.25&&Math.abs(this.y-y)<.9&&(this.y=y,this.vy=0,this.airT=0),e.isWater(this.x,this.z)?(this.waterT=(this.waterT||0)+t,this.vx*=.96,this.vz*=.96,this.waterT>1.5&&!this.destroyed&&this.kill("drown")):this.waterT=0;const b=Ch(e.hash,this,this.halfL,this.halfW);if(this.lastHit=null,b){const T=this.vx*b.nx+this.vz*b.nz;if(T<0){this.vx-=(1+.25)*T*b.nx,this.vz-=(1+.25)*T*b.nz;const R=-T;R>3&&(this.damage(R*1.6,"crash"),this.lastHit={impact:R,nx:b.nx,nz:b.nz,box:b.box}),this.vx*=.92,this.vz*=.92,this.angVel+=(Math.random()-.5)*R*.05}}this.onFire&&!this.destroyed&&(this.fireT+=t,this.fireT>3.5&&this.explode(e)),this.wheelSpin+=h*t/i.wheelR;for(const T of this.wheels)T.pivot.rotation.y=T.front?this.steer:0,T.mesh.rotation.x=this.wheelSpin,T.rim.rotation.x=this.wheelSpin;const _=(f-(this._pvr||0))/Math.max(t,.001);this._pvr=f;const E=(h-(this._pvf||0))/Math.max(t,.001);if(this._pvf=h,this.body.rotation.z=se(this.body.rotation.z,Yt(-this.angVel*Math.abs(h)*.006+_*.002,-.08,.08),6,t),this.body.rotation.x=se(this.body.rotation.x,Yt(-E*.004,-.05,.05),6,t),this.tailMat.emissiveIntensity=this.braking?3:this.lightsOn?1:.3,this.headMat.emissiveIntensity=this.lightsOn?3:.3,(this.type.cop||this.type.ems)&&this.sirenOn){const T=performance.now()/180%2<1;this.sirenR.color.setHex(T?16719904:3145728),this.sirenB.color.setHex(T?1048624:2121983),this.sirenPhase=T}else this.sirenR&&(this.sirenR.color.setHex(8392720),this.sirenB.color.setHex(1056896));this.syncMesh()}stepFlight(t,e,i,n,s){Math.sin(this.heading),Math.cos(this.heading);const o=e.surface?e.surface(this.x,this.z,this.y):e.ground(this.x,this.z);if(i.fly==="heli"){this.steer=se(this.steer,this.steerInput*1.4,8,t),this.heading+=this.steer*t;const h=this.throttle>0?9*this.throttle:0,f=this.brake>0?-8*this.brake:0;this.vy=se(this.vy,h+f,4,t);const u=this.throttle*i.maxSpeed*.85;n=se(n,u,1.6,t),s*=Math.exp(-3*t),this.handbrake&&(n*=Math.exp(-4*t),s*=Math.exp(-4*t));const d=Math.sin(this.heading),m=Math.cos(this.heading);this.vx=d*n+m*s,this.vz=m*n-d*s,this.x+=this.vx*t,this.z+=this.vz*t,this.y+=this.vy*t;const v=Math.max(o+.5,e.isWater(this.x,this.z)?.4:-1/0);this.y<v&&(this.y=v,this.vy<-7&&this.damage(-this.vy*1.2,"crash"),this.vy=Math.max(0,this.vy)),this.airT=this.y>o+1?this.airT+t:0,this.body.rotation.x=se(this.body.rotation.x,Yt(-n*.008,-.2,.12),5,t),this.body.rotation.z=se(this.body.rotation.z,Yt(this.steer*.25,-.3,.3),5,t)}else if(this.airborne||this.y>o+.6){this.airborne=!0,n=se(n,this.throttle*i.maxSpeed,.5,t),this.brake>0&&(n=Math.max(12,n-14*this.brake*t)),s*=Math.exp(-2*t),this.steer=se(this.steer,this.steerInput,6,t),this.heading+=this.steer*(.35+Math.abs(n)/55)*t;const f=i.maxSpeed*.4;let u=Yt((n-f)*.5,-10,10);this.handbrake&&(u+=8,n-=6*t),this.vy=se(this.vy,u,2.5,t);const d=Math.sin(this.heading),m=Math.cos(this.heading);this.vx=d*n+m*s,this.vz=m*n-d*s,this.x+=this.vx*t,this.z+=this.vz*t,this.y+=this.vy*t,this.y<=o+.3&&this.vy<=0&&(this.y=o+.3,this.vy<-9&&this.damage(-this.vy*1.6,"crash"),this.vy=0,this.airborne=!1),this.airT+=t,this.body.rotation.x=se(this.body.rotation.x,Yt(-this.vy*.03,-.35,.35),4,t),this.body.rotation.z=se(this.body.rotation.z,Yt(-this.steer*.5,-.6,.6),4,t)}else{const f=i.accel*1.6*this.throttle*Math.max(.15,1-Math.abs(n)/i.maxSpeed);n+=f*t,this.brake>0&&n>0&&(n=Math.max(0,n-i.brake*this.brake*t)),n-=n*.04*t,s*=Math.exp(-i.grip*t),this.steer=se(this.steer,this.steerInput*i.steer,10,t),this.heading+=n/this.wheelbase*Math.tan(this.steer)*.85*t;const u=Math.sin(this.heading),d=Math.cos(this.heading);this.vx=u*n+d*s,this.vz=d*n-u*s,this.x+=this.vx*t,this.z+=this.vz*t,this.y=o,this.vy=0,this.airT=0,n>i.maxSpeed*.46&&this.throttle>.3&&(this.airborne=!0,this.vy=4)}e.isWater(this.x,this.z)&&this.y<.2?(this.waterT=(this.waterT||0)+t,this.vx*=.96,this.vz*=.96,this.waterT>1.2&&!this.destroyed&&this.kill("drown")):this.waterT=0;const l=Ch(e.hash,this,this.halfL,this.halfW);if(this.lastHit=null,l){const h=this.vx*l.nx+this.vz*l.nz;if(h<0){this.vx-=(1+.25)*h*l.nx,this.vz-=(1+.25)*h*l.nz;const u=-h;u>3&&(this.damage(u*1.6,"crash"),this.lastHit={impact:u,nx:l.nx,nz:l.nz,box:l.box}),this.vx*=.92,this.vz*=.92,i.fly==="plane"&&this.airborne&&u>6&&(this.vy=Math.min(this.vy,-4))}}this.onFire&&!this.destroyed&&(this.fireT+=t,this.fireT>3.5&&this.explode(e));const c=6+this.throttle*30;if(this.rotor&&(this.propAxis==="z"?this.rotor.rotation.z+=c*t:this.rotor.rotation.y+=c*t),this.tailRotor&&(this.tailRotor.rotation.x+=c*1.4*t),this.tailMat.emissiveIntensity=this.braking?3:this.lightsOn?1:.3,this.headMat.emissiveIntensity=this.lightsOn?3:.3,(this.type.cop||this.type.ems)&&this.sirenOn){const h=performance.now()/180%2<1;this.sirenR.color.setHex(h?16719904:3145728),this.sirenB.color.setHex(h?1048624:2121983),this.sirenPhase=h}else this.sirenR&&(this.sirenR.color.setHex(8392720),this.sirenB.color.setHex(1056896));this.syncMesh()}setLights(t){this.lightsOn=t}damage(t,e,i=null){if(this.destroyed)return;const n=!!(i&&(i.kind==="player"||i.control==="player"||i.driver?.kind==="player"||i.byPlayer||i.lastDamage?.byPlayer));this.health-=t,this.lastDamage={amount:t,cause:e,t:performance.now(),byPlayer:n||this.lastDamage?.byPlayer&&performance.now()-this.lastDamage.t<4e3},this.onDamaged?.(t,e),this.health<25&&!this.onFire&&(this.onFire=!0,this.fireT=0),this.health<=-40&&this.explode(this.world)}kill(t){this.destroyed||(this.destroyed=!0,this.onFire=!1,this.paint.color.setHex(1710618),this.paint.roughness=.95,this.paint.metalness=.1,this.headMat.emissiveIntensity=0,this.tailMat.emissiveIntensity=0,this.setLights(!1),this.sirenOn=!1,this.onDestroyed?.(t))}explode(t){this.destroyed||(this.kill("explode"),this.vy=6,this.y+=.1,this.angVel+=(Math.random()-.5)*3,this.onExploded?.())}dispose(){this.group.parent?.remove(this.group);const t=new Set,e=new Set;this.group.traverse(i=>{i.geometry&&t.add(i.geometry);const n=Array.isArray(i.material)?i.material:[i.material];for(const s of n)s&&e.add(s)});for(const i of t)i.userData.shared||i.dispose();for(const i of e)i.userData.shared||i.dispose()}}const da={x:0,z:0},pa={x:0,z:0};function K1(r,t){if(Math.abs((r.y||0)-(t.y||0))>3)return 0;const e=r.x-t.x,i=r.z-t.z,n=r.halfL+t.halfL;if(e*e+i*i>n*n)return 0;let s=0;const a=Math.sin(r.heading),o=Math.cos(r.heading),l=Math.sin(t.heading),c=Math.cos(t.heading),h=r.halfL-r.halfW,f=t.halfL-t.halfW,u=r.halfW+.05,d=t.halfW+.05;for(const m of[-1,0,1])for(const v of[-1,0,1]){da.x=r.x+a*h*m,da.z=r.z+o*h*m,pa.x=t.x+l*f*v,pa.z=t.z+c*f*v;const g=da.x-pa.x,p=da.z-pa.z,M=g*g+p*p,w=u+d;if(M>=w*w||M<1e-6)continue;const x=Math.sqrt(M),y=g/x,b=p/x,_=w-x,E=r.type.mass,T=t.type.mass,S=E+T;r.x+=y*_*(T/S),r.z+=b*_*(T/S),t.x-=y*_*(E/S),t.z-=b*_*(E/S);const R=r.vx-t.vx,I=r.vz-t.vz,L=R*y+I*b;if(L<0){const B=-1.35*L/(1/E+1/T);r.vx+=B/E*y,r.vz+=B/E*b,t.vx-=B/T*y,t.vz-=B/T*b,r.angVel+=m*.35*L*-.15*(y*o-b*a)*(T/S),t.angVel+=v*.35*L*.15*(y*c-b*l)*(E/S);const W=-L;s=Math.max(s,W),W>2.5&&(r.damage(W*1.2*(T/S)*2,"car",t),t.damage(W*1.2*(E/S)*2,"car",r),r.lastCarHit={other:t,impact:W},t.lastCarHit={other:r,impact:W})}}return s}const{BLOCKS:zi,PITCH:bn,HALF:ms}=Xe,j1=["sedan","sedan","sedan","executive","reverie","sports","seraph","kestrel","vortex","bruiser","razor","luz","regal","suv","monarch","golem","dune","pickup","van","carrier","hauler","coach","solair","bella","majestic","howler","cabbie","taxi","taxi","refuse","hook","limo","icecream","securicar"],Q1=["sedan","sedan","executive","executive","reverie","seraph","sports","kestrel","suv","monarch","taxi","taxi","cabbie","vortex","solair","bella","carrier","coach","limo","limo","securicar"],J1=["sedan","sedan","reverie","sports","bruiser","razor","luz","majestic","regal","suv","pickup","van","taxi","howler","seraph","monarch","icecream"],$1=["pickup","pickup","van","dune","golem","sedan","regal","luz","carrier","hauler","razor","bruiser"],tv=r=>!!an[r]?.taxi;class ev{constructor(t){this.game=t,this.cars=[],this.max=34,this.spawnT=0}spawnParked(){const t=this.game;for(const e of t.city.parkedSpots){const i=t.addVehicle(We(j1.filter(n=>!tv(n))),e.x,e.z,e.heading);i.isParked=!0,i.control="none"}}newRoute(t,e={}){const n=this.game.city.roadCoords,s=Yt(Math.round((t.x+ms)/bn),0,zi),a=Yt(Math.round((t.z+ms)/bn),0,zi),o=Math.abs(t.x-n[s]),l=Math.abs(t.z-n[a]),c=t.ai,h=e.dirHint,f=t.ai={lane:Math.random()<.5?0:1,path:[],pi:0,scared:0,honkT:0,stuckT:0,reverseT:0,laneT:0,cruise:["super","sports"].includes(t.type.cls)?16:["muscle","coupe"].includes(t.type.cls)?14:vt(11,14)};c?.aggressive&&(f.aggressive=!0,f.goal=c.goal,f.cruise=c.cruise,f.scared=c.scared),Object.assign(f,e);const u=Math.sin(t.heading),d=Math.cos(t.heading);return o<l?(f.dx=0,f.dz=h?h.dz:d>=0?1:-1,f.ix=s,f.iz=f.dz>0?Math.ceil((t.z+ms)/bn-.01):Math.floor((t.z+ms)/bn+.01),f.iz=Yt(f.iz,0,zi),(f.dz>0&&f.iz===a&&t.z>n[a]||f.dz<0&&f.iz===a&&t.z<n[a])&&(f.iz+=f.dz),f.iz=Yt(f.iz,0,zi)):(f.dz=0,f.dx=h?h.dx:u>=0?1:-1,f.iz=a,f.ix=f.dx>0?Math.ceil((t.x+ms)/bn-.01):Math.floor((t.x+ms)/bn+.01),f.ix=Yt(f.ix,0,zi)),(f.ix<0||f.ix>zi||f.iz<0||f.iz>zi||f.dx!==0&&f.ix+f.dx<-1)&&(f.dx*=-1,f.dz*=-1),this.extendPath(t),f}placeOnLane(t,e){const i=this.game.city.lanePoint(e.ix,e.iz,e.dx,e.dz,e.lane,-Ro-6);t.setPosition(i.x,i.z,Math.atan2(e.dx,e.dz))}extendPath(t){const e=this.game.city,i=t.ai,{ix:n,iz:s,dx:a,dz:o,lane:l}=i,c=e.lanePoint(n,s,a,o,l,-Ro);c.stop=!0,c.ix=n,c.iz=s,c.axis=o!==0?"z":"x",c.dx=a,c.dz=o,i.path.push(c);const h=[],f={dx:a,dz:o},u={dx:-o,dz:a},d={dx:o,dz:-a};for(const[g,p]of[[f,3],[u,1],[d,1]]){const M=n+g.dx,w=s+g.dz;if(M>=0&&M<=zi&&w>=0&&w<=zi&&e.hasRoadSeg(n,s,g.dx,g.dz))for(let x=0;x<p;x++)h.push(g)}let m=h.length?We(h):{dx:-a,dz:-o};if(i.goal){const g=[f,u,d].filter(p=>{const M=n+p.dx,w=s+p.dz;return M>=0&&M<=zi&&w>=0&&w<=zi&&e.hasRoadSeg(n,s,p.dx,p.dz)});if(g.length){let p=1/0;for(const M of g){const w=e.roadCoords[n+M.dx],x=e.roadCoords[s+M.dz],y=Math.hypot(w-i.goal.x,x-i.goal.z)+Math.random()*6;y<p&&(p=y,m=M)}}}const v=e.lanePoint(n,s,m.dx,m.dz,l,Ro);if(m.dx===a&&m.dz===o)v.speed=i.cruise,i.path.push(v);else if(m.dx===-a&&m.dz===-o){const g=e.lanePoint(n,s,a,o,l,0);g.speed=4,i.path.push(g),v.speed=5,i.path.push(v)}else{const g=(v.x-c.x)*a+(v.z-c.z)*o,p=c.x+a*g,M=c.z+o*g,w=m.dx===d.dx&&m.dz===d.dz;for(const x of[.3,.55,.8,1]){const y=1-x,b={x:y*y*c.x+2*y*x*p+x*x*v.x,z:y*y*c.z+2*y*x*M+x*x*v.z,speed:w?5:7};i.path.push(b)}}i.ix=n+m.dx,i.iz=s+m.dz,i.dx=m.dx,i.dz=m.dz,i.path[i.path.length-1].turnEnd=!0}spawnOne(){const t=this.game,e=t.city,i=t.player,n=t.rig.forward(new z),s=dr(e,i.x,i.z)==="rural",a=s?10:6,o=s?420:210;for(let l=0;l<a;l++){const c=s?e.randomJunction():e.randomJunctionNear(i.x,i.z,70,o);if(!c)continue;const{ix:h,iz:f}=c,u=[[0,1],[0,-1],[1,0],[-1,0]].filter(([b,_])=>e.hasRoadSeg(h,f,b,_));if(!u.length)continue;const[d,m]=We(u),v=Math.random()<.5?0:1,g=e.lanePoint(h,f,d,m,v,vt(14,bn-14)),p=yt(g.x,g.z,i.x,i.z);if(p<70||p>o||((g.x-i.x)*n.x+(g.z-i.z)*n.z)/p>.3&&p<140||t.vehicles.some(b=>yt(b.x,b.z,g.x,g.z)<14))continue;const w=dr(e,g.x,g.z),x=w==="dense"?Q1:w==="rural"?$1:J1,y=t.addVehicle(We(x),g.x,g.z,Math.atan2(d,m));return this.adopt(y),y}}adopt(t){t.control="ai",t.isParked=!1,this.newRoute(t),this.cars.includes(t)||this.cars.push(t)}release(t){const e=this.cars.indexOf(t);e>=0&&this.cars.splice(e,1),t.ai=null}update(t){const e=this.game,i=e.player,n=dr(e.city,i.x,i.z),s=n==="dense"?34:n==="rural"?10:22,a=n==="dense"?.3:n==="rural"?.9:.5;this.spawnT-=t,this.spawnT<=0&&(this.spawnT=a,this.cars.length<Math.min(this.max,s)&&this.spawnOne());for(let o=this.cars.length-1;o>=0;o--){const l=this.cars[o],c=yt(l.x,l.z,i.x,i.z);if(c>280||l.destroyed&&c>90){this.cars.splice(o,1),e.removeVehicle(l);continue}if(l.destroyed){l.throttle=0,l.brake=1;continue}this.drive(l,t)}}drive(t,e){const i=this.game,n=i.city,s=t.ai;if(!s)return;const a=t.speed,o=Math.sin(t.heading),l=Math.cos(t.heading);if(s.scared=Math.max(0,s.scared-e),s.honkT=Math.max(0,s.honkT-e),s.laneT=Math.max(0,(s.laneT||0)-e),s.reverseT>0){s.reverseT-=e,t.throttle=0,t.brake=1,t.steerInput=s.reverseSteer,s.reverseT<=0&&this.newRoute(t);return}for(;s.path.length<8;)this.extendPath(t);let c=s.path[s.pi];const h=x=>(t.x-x.x)*o+(t.z-x.z)*l>-.5||yt(t.x,t.z,x.x,x.z)<2.2;for(;s.pi<s.path.length-1&&h(c);)s.pi++,c=s.path[s.pi];s.pi>3&&(s.path.splice(0,s.pi),s.pi=0,c=s.path[0]);const f=yt(t.x,t.z,c.x,c.z),u=Math.abs((c.x-t.x)*l-(c.z-t.z)*o),d=(c.x-t.x)*o+(c.z-t.z)*l;if(f>bn*1.6||f>6&&u>9||d<-4&&f>6){this.newRoute(t);return}let m=c;const v=4+Math.abs(a)*.35;for(let x=s.pi;x<s.path.length&&(m=s.path[x],!(yt(t.x,t.z,m.x,m.z)>v));x++);const g=Math.atan2(m.x-t.x,m.z-t.z),p=Ns(g-t.heading);t.steerInput=Yt(p*2.2,-1,1);let M=s.scared>0?24:s.cruise;for(let x=s.pi;x<Math.min(s.path.length,s.pi+5);x++){const y=s.path[x];if(y.speed!==void 0){const b=yt(t.x,t.z,y.x,y.z),_=y.speed*(s.aggressive?1.8:1);M=Math.min(M,Math.max(_,Math.sqrt(_*_+2*(s.aggressive?10:6)*Math.max(0,b-2))))}}Math.abs(p)>.5&&(M=Math.min(M,s.aggressive?9:5));for(let x=s.pi;x<Math.min(s.path.length,s.pi+3);x++){const y=s.path[x];if(!y.stop)continue;const b=(y.x-t.x)*o+(y.z-t.z)*l;if(b<-1)continue;const _=n.lightState(y.ix,y.iz,y.axis,i.time);if(s.scared>0||s.aggressive)break;if(_==="red"||_==="yellow"&&b>6){const E=Math.sqrt(10*Math.max(0,b-1.5));M=Math.min(M,b<1.5?0:E)}break}let w=!1;for(const x of i.vehicles){if(x===t)continue;const y=x.x-t.x,b=x.z-t.z;if(y*y+b*b>1600)continue;const _=y*o+b*l,E=y*l-b*o,T=(s.aggressive?3:6)+Math.abs(a)*(s.aggressive?.7:1.3);if(!(s.aggressive&&x.control==="player")&&_>0&&_<T+x.halfL&&Math.abs(E)<2.6){const S=_-x.halfL-t.halfL,R=x.vx*o+x.vz*l,I=S<(s.aggressive?1:2.5)?0:Math.min(Math.max(0,R)+Math.sqrt(2*(s.aggressive?12:5)*Math.max(0,S-2.5)),M);if(s.aggressive&&s.laneT<=0&&S>3&&R<a-2&&!s.path.slice(s.pi,s.pi+3).some(L=>L.stop&&yt(t.x,t.z,L.x,L.z)<22)){this.newRoute(t,{lane:1-s.lane,laneT:3});return}M=Math.min(M,I),S<4&&x.control==="player"&&Math.abs(a)<1&&s.honkT<=0&&Math.random()<.02&&(w=!0)}}for(const x of i.peds){if(x.dead&&x.deadT>2)continue;const y=x.x-t.x,b=x.z-t.z;if(y*y+b*b>900)continue;const _=y*o+b*l,E=y*l-b*o;_>0&&_<5+Math.abs(a)*1.2&&Math.abs(E)<t.halfW+.8&&(M=Math.min(M,_<4?0:Math.sqrt(12*(_-3))),s.honkT<=0&&(w=!0))}if(!s.aggressive&&i.player.vehicle==null&&yt(i.player.x,i.player.z,t.x,t.z)<30){const x=i.player.x-t.x,y=i.player.z-t.z,b=x*o+y*l,_=x*l-y*o;b>0&&b<6+Math.abs(a)*1.2&&Math.abs(_)<t.halfW+.8&&(M=Math.min(M,b<4?0:Math.sqrt(12*(b-3))),s.honkT<=0&&(w=!0))}w&&(s.honkT=vt(2,5),i.hornAt(t)),a<M-.4?(t.throttle=Yt((M-a)/4,.3,1),t.brake=0):a>M+.4?(t.throttle=0,t.brake=Yt((a-M)/4,.25,1)):(t.throttle=.15,t.brake=0),t.handbrake=!1,t.throttle>.3&&Math.abs(a)<.4&&M>2?(s.stuckT+=e,s.stuckT>2.5&&(s.stuckT=0,s.reverseT=1.3,s.reverseSteer=Math.random()<.5?-1:1)):s.stuckT=Math.max(0,s.stuckT-e),t.setLights(i.night>.35)}}const{PITCH:iv}=Xe,nv={hit_ped:.34,kill_ped:.8,assault:.2,gunfire:.34,carjack:.5,attack_cop:1,kill_cop:1.5,destroy_vehicle:.8,explosion:1,hit_cop_car:.5},sv=new z,rr=new z,wn=new z;class rv{constructor(t){this.game=t,this.level=0,this.heat=0,this.seenT=0,this.cops=[],this.copCars=[],this.spawnT=0,this.flashT=0,this.lastCrimeT=-99,this.cleared=!0,this.heli=null}crime(t,e,i){const n=this.game,s=nv[t]??.3,a={gunfire:.4,hit_ped:.5,carjack:.6,assault:.5}[t]??1;if(!(this.level>0||this.copNear(e,i,80)||Math.random()<a))return;this.heat=Math.min(er.MAX+.99,this.heat+s),this.seenT=0,this.lastCrimeT=n.time;const l=Math.min(er.MAX,Math.floor(this.heat));l>this.level&&(this.level=l,this.flashT=1.5,n.audio.stars(),n.hud.flashStars())}copNear(t,e,i){return this.cops.some(n=>!n.dead&&yt(n.x,n.z,t,e)<i)}clear(){this.level=0,this.heat=0,this.seenT=0}noteRam(){this.crime("hit_cop_car",this.game.player.x,this.game.player.z)}onCopHurt(t,e){(e===this.game.player||e?.driver===this.game.player)&&this.crime("attack_cop",t.x,t.z)}onCopKilled(t,e){(e===this.game.player||e?.driver===this.game.player)&&this.crime("kill_cop",t.x,t.z)}release(t){const e=this.copCars.indexOf(t);e>=0&&this.copCars.splice(e,1),t.sirenOn=!1}update(t){const e=this.game,i=e.player;this.flashT=Math.max(0,this.flashT-t),this.level>0&&(this.cops.some(a=>!a.dead&&yt(a.x,a.z,i.x,i.z)<er.COP_SIGHT)?this.seenT=0:this.seenT+=t,this.seenT>er.DECAY_TIME[this.level]&&(this.level--,this.heat=this.level,this.seenT=0,this.level===0&&e.notify("You lost the cops",2500)));const n=er.COPS_PER_LEVEL[this.level];this.spawnT-=t,this.copCars.length<n&&this.spawnT<=0&&(this.spawnT=this.copCars.length===0?.5:vt(2,5)/Math.max(1,this.level*.6),this.spawnCopCar());for(let s=this.copCars.length-1;s>=0;s--){const a=this.copCars[s],o=yt(a.x,a.z,i.x,i.z);if(a===this.heli){a.destroyed&&(this.copCars.splice(s,1),this.removeCopOf(a),this.game.removeVehicle(a),this.heli=null);continue}const l=this.copCars.length>n;if(a.destroyed&&o>60||o>260||l&&o>120||this.level===0&&o>90){this.copCars.splice(s,1),this.removeCopOf(a),e.removeVehicle(a);continue}if(!a.destroyed){if(this.level===0){a.throttle=0,a.brake=.5,a.handbrake=!1,a.sirenOn=!1,a.setLights(!1);continue}a.driver&&a.driver.kind==="cop"?this.driveCopCar(a,t):(a.throttle=0,a.brake=.5,a.sirenOn=!1)}}if(this.level>=3&&!i.dead)(!this.heli||this.heli.destroyed)&&this.spawnHeli(),this.heli&&!this.heli.destroyed&&(this.driveHeli(t),this.seenT=0);else if(this.heli){const s=this.heli;this.heli=null;const a=this.copCars.indexOf(s);a>=0&&this.copCars.splice(a,1),s.destroyed||this.game.removeVehicle(s)}for(let s=this.cops.length-1;s>=0;s--){const a=this.cops[s],o=yt(a.x,a.z,i.x,i.z);if(a.dead&&a.deadT>20||!a.vehicle&&o>200||this.level===0&&!a.vehicle&&o>80){this.cops.splice(s,1);const l=e.peds.indexOf(a);l>=0&&e.peds.splice(l,1),a.dispose()}}}removeCopOf(t){for(const e of this.cops)e.vehicle===t&&(e.vehicle=null)}spawnHeli(){const t=this.game,e=t.player,i=t.addVehicle("hunter",e.x-40,e.z-40,.8);i.y=Math.max(t.city.groundHeight(i.x,i.z),0)+42,i.vy=0,i.control="cop",i.sirenOn=!0,this.copCars.push(i),this.heli=i}driveHeli(t){const e=this.game,i=e.player,n=this.heli;if(!n||n.destroyed)return;n.sirenOn=!0,n.setLights(e.night>.35);const s=i.x+(i.vx||0)*1.2-12,a=i.z+(i.vz||0)*1.2-12,o=s-n.x,l=a-n.z,c=Math.hypot(o,l),h=Math.atan2(o,l);n.steerInput=Yt(Ns(h-n.heading)*2,-1,1);const f=Math.max(e.city.groundHeight(n.x,n.z),0),u=Math.max(f+34,(i.y||0)+30);n.throttle=n.y<u-3?1:c>14?.55:0,n.brake=n.y>u+4?.9:0,n.handbrake=!1}spawnCopCar(){const t=this.game,e=t.city,i=t.player,n=t.rig.forward(sv);for(let s=0;s<10;s++){const{ix:a,iz:o}=e.randomJunction(),l=[[0,1],[0,-1],[1,0],[-1,0]].filter(([M,w])=>e.hasRoadSeg(a,o,M,w));if(!l.length)continue;const[c,h]=We(l),f=e.lanePoint(a,o,c,h,0,vt(14,iv-14)),u=yt(f.x,f.z,i.x,i.z);if(u<60||u>150||((f.x-i.x)*n.x+(f.z-i.z)*n.z)/u>.5&&u<80||t.vehicles.some(M=>yt(M.x,M.z,f.x,f.z)<12))continue;const m=this.wanted??1,v=m>=4&&Math.random()<.4?"interceptor":m>=2&&Math.random()<.25?"warden":"police",g=t.addVehicle(v,f.x,f.z,Math.atan2(c,h));g.control="cop",g.sirenOn=!0,g.avoid={t:0,side:1},t.traffic.newRoute(g,{aggressive:!0,cruise:40,goal:{x:i.x,z:i.z}});const p=new Rn(t,f.x,f.z,{kind:"cop",weapon:"pistol"});return p.important=!0,t.peds.push(p),this.cops.push(p),p.enterVehicle(g),p.car=g,this.copCars.push(g),g}}driveCopCar(t,e){const i=this.game,n=i.player,s=i.city,a=t.driver,o=n.x+n.vx*.6,l=n.z+n.vz*.6,c=yt(t.x,t.z,n.x,n.z);Math.sin(t.heading),Math.cos(t.heading);const h=t.speed;t.sirenOn=!0,t.setLights(i.night>.35);const f=n.x-t.x,u=n.z-t.z,d=c<1?null:La(s.hash,t.x,t.z,f/c,u/c,c).box,m=!d||d.kind!=="building";if(!(c<70&&m)){t.ai||i.traffic.newRoute(t,{aggressive:!0,cruise:40,goal:{x:n.x,z:n.z}}),t.ai.goal={x:n.x,z:n.z},t.ai.aggressive=!0,t.ai.cruise=40,t.ai.scared=0,i.traffic.drive(t,e),t.setLights(i.night>.35),this.level>=3&&n.vehicle&&c<26&&!n.dead&&(a.shootT-=e,a.shootT<=0&&(a.shootT=2.2,this.copShoot(a,t.x,t.y+1.2,t.z,.25)));return}if(t.ai=null,t.avoid.reverseT>0){t.avoid.reverseT-=e,t.throttle=0,t.brake=1,t.steerInput=t.avoid.side,t.handbrake=!1,t.avoid.reverseT<=0&&(t.avoid.stuck=0);return}let g=Math.atan2(o-t.x,l-t.z);const p=9+Math.abs(h)*.7,M=[[0,1],[.45,.7],[-.45,.7]];let w=[0,0,0];if(M.forEach(([b,_],E)=>{const T=t.heading+b,S=La(s.hash,t.x,t.z,Math.sin(T),Math.cos(T),p*_);S.box&&S.box.kind==="building"&&(w[E]=1-S.t/(p*_))}),w[0]>.1||w[1]>.4||w[2]>.4){const b=(w[2]-w[1])*1.2+(w[0]>.1?t.avoid.side*.8:0);g=t.heading+b}const x=Ns(g-t.heading);t.steerInput=Yt(x*2,-1,1);let y=n.vehicle?40:Math.min(30,c*.8);Math.abs(x)>1.2&&(y=Math.min(y,6)),w[0]>.5&&(y=Math.min(y,4)),!n.vehicle&&c<9&&(y=0),h<y-.5?(t.throttle=1,t.brake=0):h>y+.5?(t.throttle=0,t.brake=1):(t.throttle=.2,t.brake=0),t.handbrake=Math.abs(x)>1.4&&Math.abs(h)>8,t.throttle>.5&&Math.abs(h)<.5?(t.avoid.stuck=(t.avoid.stuck||0)+e,t.avoid.stuck>1.5&&(t.avoid.reverseT=1.2,t.avoid.side=Math.random()<.5?-1:1)):t.avoid.stuck=0,t.lastCarHit&&t.lastCarHit.other===n.vehicle&&t.lastCarHit.impact>4&&(t.lastCarHit=null,i.rig.addShake(.3)),!n.vehicle&&c<12&&Math.abs(h)<3&&!n.dead&&(a.exitVehicle(),a.car=t,a.aiming=!0),this.level>=3&&n.vehicle&&c<26&&!n.dead&&(a.shootT-=e,a.shootT<=0&&(a.shootT=1.6,this.copShoot(a,t.x,t.y+1.2,t.z,.3)))}updateCop(t,e){const i=this.game,n=i.player,s=yt(t.x,t.z,n.x,n.z);if(t.shootT-=e,n.dead||n.busted||this.level===0){t.speed=0,t.aiming=!1,this.maybeReturnToCar(t,e);return}if(n.vehicle&&s>30&&t.car&&!t.car.destroyed&&!t.car.driver&&yt(t.car.x,t.car.z,t.x,t.z)<60){this.walkToCar(t,e);return}const a=Math.atan2(n.x-t.x,n.z-t.z);if(t.heading=Gi(t.heading,a,10,e),t.aiming=this.level>=2&&s<32,s>2?t.speed=t.aiming&&s<10?3.2:6.6:t.speed=0,!n.vehicle&&s<2&&n.absSpeed<3?(t.arrestT+=e,t.arrestT>.9&&n.arrest()):t.arrestT=Math.max(0,t.arrestT-e),this.level>=2&&s<32&&t.shootT<=0){const o=Yt(.6-s/55,.15,.6);t.shootT=Math.max(1,2-this.level*.15),this.copShoot(t,t.x,t.y+1.35,t.z,o)}}walkToCar(t,e){const i=t.car,n=Math.atan2(i.x-t.x,i.z-t.z);t.heading=Gi(t.heading,n,10,e),t.aiming=!1;const s=yt(t.x,t.z,i.x,i.z);t.speed=s>i.halfW+1.5?6.6:0,s<=i.halfW+1.6&&(t.enterVehicle(i),i.control="cop",this.copCars.includes(i)||this.copCars.push(i))}maybeReturnToCar(t,e){t.car&&!t.car.destroyed&&!t.car.driver&&yt(t.car.x,t.car.z,t.x,t.z)<60&&this.walkToCar(t,e)}copShoot(t,e,i,n,s){const a=this.game,o=a.player,l=a.effects;rr.set(e,i,n),wn.set(o.x-e,o.y+1-i,o.z-n).normalize();const c=Zn(a,rr,wn,60,t);if(c.type!=="ped"&&c.type!=="vehicle"&&c.type!=="none")return;Math.random()>s&&(wn.x+=vt(-.08,.08),wn.y+=vt(-.04,.04),wn.z+=vt(-.08,.08));const f=Zn(a,rr,wn,60,t);l.addTracer(rr,f.point),l.muzzle(rr,wn),a.audio.gunshot("pistol"),f.type==="ped"&&f.entity===o?o.takeDamage(4+this.level,t):f.type==="ped"?f.entity.hurt(12,t,wn):f.type==="vehicle"&&(f.entity.damage(4,"bullet",t),l.sparks(f.point.x,f.point.y,f.point.z,4),f.entity===o.vehicle&&o.takeDamage(2,t,"impact"))}}const gs={health:new pt({color:16728128,emissive:16719904,emissiveIntensity:1.2,roughness:.3}),armor:new pt({color:4231423,emissive:2117887,emissiveIntensity:1.2,roughness:.3}),money:new pt({color:4259696,emissive:2146368,emissiveIntensity:1,roughness:.4}),weapon:new pt({color:14540253,emissive:16777215,emissiveIntensity:.5,roughness:.3,metalness:.6})};function av(r){const t=new be;if(r==="health")t.add(new N(new _t(.6,.2,.2),gs.health),new N(new _t(.2,.6,.2),gs.health));else if(r==="armor"){const e=new N(new jt(.32,.18,.6,6),gs.armor);e.rotation.x=Math.PI/2,t.add(e)}else if(r==="money")for(let e=0;e<3;e++){const i=new N(new _t(.5,.08,.26),gs.money);i.position.y=e*.09,i.rotation.y=e*.3,t.add(i)}else{const e=new N(new _t(.1,.16,Bi[r]?.long?.9:.45),gs.weapon);t.add(e);const i=new N(new _t(.1,.22,.1),gs.weapon);i.position.set(0,-.15,.08),t.add(i)}return t}const Qu=new _r(.55,.75,24);Qu.rotateX(-Math.PI/2);const ov={health:new re({color:16732240,transparent:!0,opacity:.6,depthWrite:!1}),armor:new re({color:5279999,transparent:!0,opacity:.6,depthWrite:!1}),money:new re({color:5308288,transparent:!0,opacity:.6,depthWrite:!1}),weapon:new re({color:16777215,transparent:!0,opacity:.5,depthWrite:!1})};class lv{constructor(t){this.game=t,this.items=[],this.rng=di(777),this.seed()}clearAll(){for(const t of this.items)this.destroy(t);this.items.length=0}seed(){const e=this.game.city,i=["health","health","health","armor","armor","money","money","money","money","pistol","pistol","uzi","uzi","shotgun","shotgun","rifle"],n=new Set;for(let s=0;s<44;s++){const a=this.rng.pick(e.blocks);if(n.has(a)&&this.rng()<.6)continue;n.add(a);const o=[[a.x0-1.5,a.z0-1.5],[a.x1+1.5,a.z0-1.5],[a.x1+1.5,a.z1+1.5],[a.x0-1.5,a.z1+1.5]],l=this.rng.pick(o),c=this.rng.range(.15,.85),h=this.rng.pick(o),f=l[0]+(h[0]-l[0])*c,u=l[1]+(h[1]-l[1])*c,d=this.rng.pick(i);this.add(d,f,u,!1)}}add(t,e,i,n=!1,s){const a=this.game,o=Bi[t]?"weapon":t,l=av(t),c=a.city.groundHeight(e,i);l.position.set(e,c+.9,i),a.scene.add(l);const h=new N(Qu,ov[o]);h.position.set(e,c+.03,i),a.scene.add(h);const f={type:t,cat:o,x:e,z:i,y:c,mesh:l,ring:h,active:!0,respawnT:0,temp:n,life:n?40:1/0,amount:s??(t==="money"?Math.floor(this.rng.range(40,250)):0),phase:Math.random()*6.28};return this.items.push(f),f}update(t){const e=this.game,i=e.player,n=e.time;for(let s=this.items.length-1;s>=0;s--){const a=this.items[s];if(a.temp&&(a.life-=t,a.life<=0)){this.destroy(a),this.items.splice(s,1);continue}if(!a.active){a.respawnT-=t,a.respawnT<=0&&(a.active=!0,a.mesh.visible=a.ring.visible=!0);continue}a.mesh.rotation.y=n*1.5+a.phase,a.mesh.position.y=a.y+.9+Math.sin(n*2+a.phase)*.12,a.ring.scale.setScalar(1+Math.sin(n*3+a.phase)*.08);const o=i.vehicle?i.vehicle.halfW+.6:1.3;!i.dead&&yt(i.x,i.z,a.x,a.z)<o&&(a.cat==="money"||!i.vehicle)&&this.collect(a,s)}}destroy(t){this.game.scene.remove(t.mesh,t.ring),t.mesh.traverse(e=>e.geometry?.dispose())}collect(t,e){const i=this.game,n=i.player;if(t.cat==="health"){if(n.health>=100)return;n.health=100,i.audio.pickup(),i.notify("Health restored",1500)}else if(t.cat==="armor"){if(n.armor>=100)return;n.armor=100,i.audio.pickup(),i.notify("Armor",1500)}else t.cat==="money"?(n.money+=t.amount,i.audio.cash(),i.hud.moneyPop(t.amount)):(n.giveWeapon(t.type,Bi[t.type].clip),i.audio.pickup(),i.notify(`${Bi[t.type].name} +${Bi[t.type].clip}`,1500));t.temp?(this.destroy(t),this.items.splice(e,1)):(t.active=!1,t.respawnT=75,t.mesh.visible=t.ring.visible=!1)}}const pr={fable:{id:"fable",name:"Fable City",welcome:"Welcome to Fable City. Press F1 for controls.",spawn:{block:[16,20],ax:"x0",dx:12,az:"z1",dz:1.6,carDx:13,carDz:5.2},hospital:{block:[16,19]},missions:[{type:"race",name:"Street Race",color:16765514,block:[19,2],ax:"x1",dx:5,az:"z0",dz:-5,desc:"Hit every checkpoint before the clock runs out."},{type:"taxi",name:"Taxi Fares",color:16765514,block:[19,18],ax:"x0",dx:30,az:"z0",dz:-5,desc:"Ferry passengers across town. Fast and smooth pays."},{type:"contract",name:"The Contract",color:16732240,block:[18,18],ax:"x0",dx:-5,az:"z0",dz:-5,desc:"A rival needs to disappear. Find them before they vanish."},{type:"hotwheels",name:"Hot Wheels",color:5294335,block:[21,3],ax:"x0",dx:-5,az:"z1",dz:5,desc:"Boost the marked car and bring it back to the chop shop."},{type:"vigilante",name:"Vigilante",color:6982911,block:[4,11],ax:"x0",dx:-5,az:"z0",dz:-5,desc:"Take a cruiser and run down the fleeing suspects."}],stores:[{id:"ammu",name:"AMMU-NATION",color:"#ff8c1a",hex:16747546,block:[17,18],side:"S",kind:"gun",greet:["Welcome to Ammu-Nation. Protect yourself, friend.","Second amendment special today. What'll it be?"]},{id:"ammu2",name:"AMMU-NATION",color:"#ff8c1a",hex:16747546,block:[5,10],side:"W",kind:"gun",greet:["Guns, ammo, body armor. No questions asked."]},{id:"burger",name:"BURGER SHOT",color:"#ff3b7a",hex:16726906,block:[19,21],side:"N",kind:"food",greet:["Welcome to Burger Shot! Would you like to go large?","Hey! Our burgers are 40% real meat now!"]},{id:"burger2",name:"BURGER SHOT",color:"#ff3b7a",hex:16726906,block:[18,2],side:"E",kind:"food",greet:["Fresh off the grill. Mostly."]},{id:"cloth",name:"THREADS",color:"#3bd1ff",hex:3920383,block:[19,3],side:"S",kind:"clothes",greet:["Looking sharp is a lifestyle. Pick an outfit.","You've got the walk, now get the look."]},{id:"spray",name:"PAY 'N' SPRAY",color:"#2bff88",hex:2883464,block:[21,20],side:"E",kind:"spray"}]},liberty:{id:"liberty",name:"Liberty City",welcome:"Welcome to Liberty City. Press F1 for controls.",spawn:{block:[12,17],ax:"x0",dx:12,az:"z1",dz:1.6,carDx:13,carDz:5.2},hospital:{block:[12,18]},missions:[{type:"race",name:"Street Race",color:16765514,block:[19,15],ax:"x1",dx:5,az:"z0",dz:-5,desc:"Hit every checkpoint before the clock runs out."},{type:"taxi",name:"Taxi Fares",color:16765514,block:[12,17],ax:"x0",dx:30,az:"z0",dz:-5,desc:"Ferry passengers across town. Fast and smooth pays."},{type:"contract",name:"The Contract",color:16732240,block:[19,11],ax:"x0",dx:-5,az:"z0",dz:-5,desc:"A rival needs to disappear. Find them before they vanish."},{type:"hotwheels",name:"Hot Wheels",color:5294335,block:[4,15],ax:"x0",dx:-5,az:"z1",dz:5,desc:"Boost the marked car and bring it back to the chop shop."},{type:"vigilante",name:"Vigilante",color:6982911,block:[11,18],ax:"x0",dx:-5,az:"z0",dz:-5,desc:"Take a cruiser and run down the fleeing suspects."}],stores:[{id:"ammu",name:"AMMU-NATION",color:"#ff8c1a",hex:16747546,block:[12,14],side:"S",kind:"gun",greet:["Welcome to Ammu-Nation. Protect yourself, friend.","Second amendment special today. What'll it be?"]},{id:"ammu2",name:"AMMU-NATION",color:"#ff8c1a",hex:16747546,block:[20,15],side:"W",kind:"gun",greet:["Guns, ammo, body armor. No questions asked."]},{id:"burger",name:"BURGER SHOT",color:"#ff3b7a",hex:16726906,block:[13,17],side:"N",kind:"food",greet:["Welcome to Burger Shot! Would you like to go large?","Hey! Our burgers are 40% real meat now!"]},{id:"burger2",name:"BURGER SHOT",color:"#ff3b7a",hex:16726906,block:[5,14],side:"E",kind:"food",greet:["Fresh off the grill. Mostly."]},{id:"cloth",name:"THREADS",color:"#3bd1ff",hex:3920383,block:[10,12],side:"S",kind:"clothes",greet:["Looking sharp is a lifestyle. Pick an outfit.","You've got the walk, now get the look."]},{id:"spray",name:"PAY 'N' SPRAY",color:"#2bff88",hex:2883464,block:[21,16],side:"E",kind:"spray"}]},vice:{id:"vice",name:"Vice City",welcome:"Welcome to Vice City. Press F1 for controls.",spawn:{block:[18,13],ax:"x0",dx:12,az:"z1",dz:1.6,carDx:13,carDz:5.2},hospital:{block:[18,12]},missions:[{type:"race",name:"Street Race",color:16765514,block:[18,6],ax:"x1",dx:5,az:"z0",dz:-5,desc:"Hit every checkpoint before the clock runs out."},{type:"taxi",name:"Taxi Fares",color:16765514,block:[6,12],ax:"x0",dx:30,az:"z0",dz:-5,desc:"Ferry passengers across town. Fast and smooth pays."},{type:"contract",name:"The Contract",color:16732240,block:[18,10],ax:"x0",dx:-5,az:"z0",dz:-5,desc:"A rival needs to disappear. Find them before they vanish."},{type:"hotwheels",name:"Hot Wheels",color:5294335,block:[5,8],ax:"x0",dx:-5,az:"z1",dz:5,desc:"Boost the marked car and bring it back to the chop shop."},{type:"vigilante",name:"Vigilante",color:6982911,block:[7,14],ax:"x0",dx:-5,az:"z0",dz:-5,desc:"Take a cruiser and run down the fleeing suspects."}],stores:[{id:"ammu",name:"AMMU-NATION",color:"#ff8c1a",hex:16747546,block:[6,10],side:"S",kind:"gun",greet:["Welcome to Ammu-Nation. Protect yourself, friend.","Second amendment special today. What'll it be?"]},{id:"ammu2",name:"AMMU-NATION",color:"#ff8c1a",hex:16747546,block:[18,9],side:"W",kind:"gun",greet:["Guns, ammo, body armor. No questions asked."]},{id:"burger",name:"BURGER SHOT",color:"#ff3b7a",hex:16726906,block:[18,14],side:"N",kind:"food",greet:["Welcome to Burger Shot! Would you like to go large?","Hey! Our burgers are 40% real meat now!"]},{id:"burger2",name:"BURGER SHOT",color:"#ff3b7a",hex:16726906,block:[5,6],side:"E",kind:"food",greet:["Fresh off the grill. Mostly."]},{id:"cloth",name:"THREADS",color:"#3bd1ff",hex:3920383,block:[19,8],side:"S",kind:"clothes",greet:["Looking sharp is a lifestyle. Pick an outfit.","You've got the walk, now get the look."]},{id:"spray",name:"PAY 'N' SPRAY",color:"#2bff88",hex:2883464,block:[8,15],side:"E",kind:"spray"}]}},cv=new jt(2.2,2.2,3,32,1,!0),Vh={transparent:!0,opacity:.35,side:Ve,depthWrite:!1,toneMapped:!1},hv=new jt(4,4,6,32,1,!0);function uv(r,t){const e=r.blocks.find(s=>s.i===t.block[0]&&s.j===t.block[1]),i=t.ax==="x0"?e.x0:t.ax==="x1"?e.x1:(e.x0+e.x1)/2,n=t.az==="z0"?e.z0:t.az==="z1"?e.z1:(e.z0+e.z1)/2;return{x:i+t.dx,z:n+t.dz}}class fv{constructor(t){this.game=t,this.active=null,this.markers=[],this.cooldown=0,this.completed=0,this.cruiser=null,this.cpMesh=new N(hv,new re({color:16765514,...Vh})),this.cpMesh.visible=!1,t.scene.add(this.cpMesh),this.targetMarker=new N(new Vs(.4,.8,4),new re({color:16728128,toneMapped:!1})),this.targetMarker.rotation.x=Math.PI,this.targetMarker.visible=!1,t.scene.add(this.targetMarker),this.buildForMap()}buildForMap(){const t=this.game,e=t.city,i=pr[t.mapId].missions.map(s=>({...s,...uv(e,s)}));for(const s of i){const a=new N(cv,new re({color:s.color,...Vh}));a.position.set(s.x,e.groundHeight(s.x,s.z)+1.5,s.z),t.scene.add(a),this.markers.push({...s,mesh:a})}const n=t.addVehicle("police",i[4].x+12,i[4].z+6,Math.PI/2);n.control="none",n.isParked=!0,this.cruiser=n}disposeForMap(){const t=this.game;for(const e of this.markers)t.scene.remove(e.mesh),e.mesh.material.dispose();this.markers.length=0,this.cruiser&&(t.removeVehicle(this.cruiser),this.cruiser=null),this.cpMesh.visible=!1,this.targetMarker.visible=!1}blips(){const t=[];if(!this.active)for(const e of this.markers)t.push({x:e.x,z:e.z,color:"#"+e.color.toString(16).padStart(6,"0"),kind:"mission",size:7,label:e.name[0],name:e.name});if(this.active?.blips){const e=this.active.blips();e.length&&(e[0].guide=!0),t.push(...e)}return t}update(t){const e=this.game,i=e.player,n=e.time;for(const s of this.markers)s.mesh.material.opacity=.25+.15*Math.sin(n*3),s.mesh.rotation.y=n*.5,s.mesh.visible=!this.active;if(this.cooldown=Math.max(0,this.cooldown-t),this.active){if(i.dead||i.busted){this.fail(i.dead?"You died":"You got busted");return}this.active.update(t);return}if(!(this.cooldown>0)){for(const s of this.markers){const a=yt(i.x,i.z,s.x,s.z)<2.6&&!i.vehicle;if(yt(i.x,i.z,s.x,s.z)<12&&!i.vehicle&&e.hud.setHint(`${s.name} — ${s.desc}`),a){this.start(s);break}}!this.markers.some(s=>yt(i.x,i.z,s.x,s.z)<12)&&!i.vehicle&&e.hud.setHint("")}}start(t){const e=this.game;e.hud.setHint(""),e.hud.showBanner(t.name.toUpperCase(),t.desc,"#"+t.color.toString(16).padStart(6,"0"),3500),e.audio.ui();const i={race:dv,taxi:pv,contract:mv,hotwheels:gv,vigilante:xv};this.active=new i[t.type](e,this,t)}pass(t,e=""){const i=this.game;this.active?.cleanup(),this.active=null,this.cooldown=4,this.completed++,i.player.stats.missions++,i.player.money+=t,i.hud.moneyPop(t),i.hud.showBanner("MISSION PASSED!",`${As(t)} ${e}`,"#ffd24a",5e3),i.audio.missionPassed(),i.hud.setObjective(null),i.hud.setTimer(null)}fail(t){const e=this.game;this.active?.cleanup(),this.active=null,this.cooldown=4,e.hud.showBanner("MISSION FAILED",t,"#ff5050",4e3),e.hud.setObjective(null),e.hud.setTimer(null),e.audio.wasted()}}class Er{constructor(t,e,i){this.g=t,this.mgr=e,this.def=i,this.timer=null}tick(t){return this.timer!=null&&(this.timer-=t,this.g.hud.setTimer(this.timer),this.timer<=0)?(this.mgr.fail("Out of time"),!1):!0}cleanup(){this.g.hud.setHint("")}}function ec(r,t,e,i,n){const s=r.city;for(let a=0;a<40;a++){const{ix:o,iz:l}=s.randomJunction(),c=[[0,1],[0,-1],[1,0],[-1,0]].filter(([m,v])=>s.hasRoadSeg(o,l,m,v));if(!c.length)continue;const[h,f]=We(c),u=s.lanePoint(o,l,h,f,1,vt(16,Xe.PITCH-16));u.heading=Math.atan2(h,f);const d=yt(u.x,u.z,t,e);if(d>=i&&d<=n)return u}return{x:0,z:0,heading:0}}function Ll(r,t,e,i,n){const s=r.city;for(let a=0;a<40;a++){const o=We(s.blocks),l=Math.floor(Math.random()*4),c=vt(.1,.9),h=l===0?{x:o.x0+c*(o.x1-o.x0),z:o.z0-1.5}:l===1?{x:o.x0+c*(o.x1-o.x0),z:o.z1+1.5}:l===2?{x:o.x0-1.5,z:o.z0+c*(o.z1-o.z0)}:{x:o.x1+1.5,z:o.z0+c*(o.z1-o.z0)},f=yt(h.x,h.z,t,e);if(f>=i&&f<=n)return h}return{x:0,z:0}}class dv extends Er{constructor(t,e,i){super(t,e,i),this.cps=[];let n=i.x,s=i.z;for(let a=0;a<7;a++){const o=ec(t,n,s,90,170);this.cps.push(o),n=o.x,s=o.z}this.i=0,this.timer=100,this.state=t.player.vehicle?"go":"car",this.showCp()}showCp(){const t=this.cps[this.i];this.mgr.cpMesh.visible=!0,this.mgr.cpMesh.position.set(t.x,this.g.city.groundHeight(t.x,t.z)+3,t.z),this.g.hud.setObjective(`Checkpoint ${this.i+1} / ${this.cps.length}`)}blips(){const t=this.cps[this.i];return[{x:t.x,z:t.z,color:"#ffd24a",kind:"checkpoint",size:7}]}update(t){if(!this.tick(t))return;const e=this.g.player;if(!e.vehicle){this.g.hud.setObjective("Get in a vehicle!");return}this.g.hud.setObjective(`Checkpoint ${this.i+1} / ${this.cps.length}`);const i=this.cps[this.i];if(this.mgr.cpMesh.rotation.y+=t,yt(e.x,e.z,i.x,i.z)<4.5){if(this.g.audio.pickup(),this.i++,this.timer+=4,this.i>=this.cps.length){const n=Math.floor(this.timer*20);this.mgr.pass(1500+n,`(+${As(n)} time bonus)`);return}this.showCp()}}cleanup(){super.cleanup(),this.mgr.cpMesh.visible=!1}}class pv extends Er{constructor(t,e,i){super(t,e,i),this.fares=0,this.total=0,this.state="pickup",this.spawnPassenger(),this.timer=null}spawnPassenger(){const t=this.g.player,e=Ll(this.g,t.x,t.z,60,140);this.pass=new Rn(this.g,e.x,e.z),this.pass.important=!0,this.pass.waitT=1e9,this.pass.heading=Math.random()*6.28,this.g.peds.push(this.pass),this.state="pickup",this.g.hud.setObjective("Pick up the passenger"),this.g.hud.setTimer(null),this.timer=null}blips(){return this.state==="pickup"?[{x:this.pass.x,z:this.pass.z,color:"#ffd24a",kind:"target",size:6}]:[{x:this.dest.x,z:this.dest.z,color:"#ffd24a",kind:"checkpoint",size:7}]}update(t){const e=this.g.player;if(this.tick(t)){if(!e.vehicle){this.g.hud.setObjective(this.state==="pickup"?"Get a vehicle and pick up the passenger":"Get back in a vehicle!"),this.state==="drive"&&this.pass.vehicle;return}if(this.state==="pickup"){if(this.pass.dead){this.mgr.fail("Your passenger died");return}this.g.hud.setObjective("Pick up the passenger"),yt(e.x,e.z,this.pass.x,this.pass.z)<6&&e.vehicle.absSpeed<1.5&&(this.pass.enterVehicle(e.vehicle),e.vehicle.driver=e,this.pass.char.group.position.set(-.76,0,0),this.pass.vehicle=e.vehicle,this.pass.isPassenger=!0,this.dest=Ll(this.g,e.x,e.z,120,260),this.state="drive",this.timer=25+yt(e.x,e.z,this.dest.x,this.dest.z)/9,this.mgr.cpMesh.visible=!0,this.mgr.cpMesh.position.set(this.dest.x,this.g.city.groundHeight(this.dest.x,this.dest.z)+3,this.dest.z),this.g.audio.ui())}else{if(this.g.hud.setObjective(`Drop the passenger at the marker (fare ${this.fares+1}/3)`),this.mgr.cpMesh.rotation.y+=t,this.pass.vehicle!==e.vehicle){this.mgr.fail("You lost your passenger");return}if(yt(e.x,e.z,this.dest.x,this.dest.z)<6&&e.vehicle.absSpeed<1.5){const i=Math.floor(200+this.timer*12);if(this.total+=i,this.g.player.money+=i,this.g.hud.moneyPop(i),this.g.audio.cash(),this.pass.exitVehicle(),this.pass.vehicle=null,this.pass.important=!1,this.pass.waitT=0,this.pass.pickNav(),this.fares++,this.mgr.cpMesh.visible=!1,this.fares>=3){this.mgr.pass(800,`(fares ${As(this.total)})`);return}this.spawnPassenger()}}}}cleanup(){super.cleanup(),this.mgr.cpMesh.visible=!1,this.pass&&(this.pass.important=!1,this.pass.vehicle&&this.pass.exitVehicle(),this.pass.waitT=0,this.pass.dead||this.pass.pickNav())}}class mv extends Er{constructor(t,e,i){super(t,e,i);const n=t.player,s=Ll(t,n.x,n.z,150,300);this.target=new Rn(t,s.x,s.z,{shirt:1118481,pants:1118481}),this.target.important=!0,this.target.health=140,this.target.runSpeed=6.8,t.peds.push(this.target),this.timer=150,t.hud.setObjective("Find and eliminate the target"),this.esc=0}blips(){return[{x:this.target.x,z:this.target.z,color:"#ff5050",kind:"target",size:6}]}update(t){if(!this.tick(t))return;const e=this.g.player,i=this.target,n=yt(e.x,e.z,i.x,i.z);if(this.mgr.targetMarker.visible=!i.dead,this.mgr.targetMarker.position.set(i.x,i.y+2.5+Math.sin(this.g.time*4)*.15,i.z),this.mgr.targetMarker.rotation.y+=t*2,!i.dead&&n<30&&i.panic(e.x,e.z,3),i.dead){this.mgr.pass(2500);return}this.g.hud.setObjective(n<40?"Take the target down!":"Find the target (red blip)")}cleanup(){super.cleanup(),this.mgr.targetMarker.visible=!1,this.target&&(this.target.important=!1)}}class gv extends Er{constructor(t,e,i){super(t,e,i);const n=ec(t,i.x,i.z,200,420);this.car=t.addVehicle(We(["sports","kestrel","vortex","bruiser","scalpel"]),n.x,n.z,n.heading),this.car.control="none",this.car.isParked=!0,this.car.mission=this,this.drop={x:i.x+14,z:i.z+14},this.state="find",this.timer=180,this.startHealth=100,this.mgr.cpMesh.visible=!1,t.hud.setObjective("Steal the marked car")}blips(){return this.state==="find"?[{x:this.car.x,z:this.car.z,color:"#50c8ff",kind:"car",size:6}]:[{x:this.drop.x,z:this.drop.z,color:"#50c8ff",kind:"checkpoint",size:7}]}update(t){if(!this.tick(t))return;const e=this.g.player;if(this.car.destroyed){this.mgr.fail("The car was destroyed");return}if(this.state==="find")e.vehicle===this.car&&(this.state="deliver",this.g.hud.setObjective("Deliver the car to the chop shop"),this.mgr.cpMesh.visible=!0,this.mgr.cpMesh.position.set(this.drop.x,this.g.city.groundHeight(this.drop.x,this.drop.z)+3,this.drop.z),this.g.police.crime("carjack",e.x,e.z));else if(this.mgr.cpMesh.rotation.y+=t,e.vehicle!==this.car?this.g.hud.setObjective("Get back in the marked car!"):this.g.hud.setObjective("Deliver the car to the chop shop"),e.vehicle===this.car&&yt(e.x,e.z,this.drop.x,this.drop.z)<6&&this.car.absSpeed<1.5){const i=Yt(this.car.health/100,0,1),n=Math.floor(1e3+2e3*i);e.exitVehicle(!0),this.g.removeVehicle(this.car),this.car=null,this.mgr.pass(n,`(condition ${Math.round(i*100)}%)`)}}cleanup(){super.cleanup(),this.mgr.cpMesh.visible=!1,this.car&&this.g.player.vehicle!==this.car?this.g.removeVehicle(this.car):this.car&&(this.car.mission=null)}}class xv extends Er{constructor(t,e,i){super(t,e,i),this.wave=0,this.timer=null,this.suspect=null,this.nextWave()}nextWave(){const t=this.g,e=t.player;this.wave++;const i=ec(t,e.x,e.z,120,220),n=t.addVehicle(We(["sedan","sports","pickup","bruiser","reverie","luz"]),i.x,i.z,i.heading);t.traffic.adopt(n),n.ai.scared=1e9,n.ai.cruise=22+this.wave*2;const s=new Rn(t,i.x,i.z,{shirt:2236962});s.important=!0,t.peds.push(s),s.enterVehicle(n),s.health=40,this.suspect=n,this.driver=s,this.timer=90,t.hud.setObjective(`Wave ${this.wave}/3 — stop the suspect vehicle`),t.hud.setTimer(this.timer)}blips(){return this.suspect?[{x:this.suspect.x,z:this.suspect.z,color:"#ff5050",kind:"car",size:6}]:[]}update(t){if(!this.tick(t))return;const e=this.g,i=e.player,n=this.suspect;if(!i.vehicle||!i.vehicle.type.cop?e.hud.setObjective("Get in a police cruiser!"):e.hud.setObjective(`Wave ${this.wave}/3 — stop the suspect vehicle`),n.ai&&(n.ai.scared=1e9),!!i.vehicle?.type.cop&&(n.destroyed||this.driver.dead||n.health<30&&n.absSpeed<2&&yt(i.x,i.z,n.x,n.z)<15)){!this.driver.dead&&this.driver.vehicle&&(this.driver.exitVehicle(),this.driver.panic(i.x,i.z,10));const o=600*this.wave;if(i.money+=o,e.hud.moneyPop(o),e.audio.cash(),this.driver.important=!1,n.mission&&(n.mission=null),this.wave>=3){this.mgr.pass(1500,"(vigilante bonus)");return}this.nextWave()}}cleanup(){super.cleanup(),this.driver&&(this.driver.important=!1)}}const ma=new z,te=(r,t,e,i)=>{const n=document.createElement(r);return t&&(n.className=t),i!==void 0&&(n.innerHTML=i),(e||document.body).appendChild(n),n};class vv{constructor(t){this.game=t;const e=this.root=te("div","hud"),i=te("div","hud-tr",e);this.money=te("div","money",i,"$0"),this.moneyDelta=te("div","money-delta",i,""),this.stars=te("div","stars",i,"");for(let o=0;o<5;o++)te("span","star",this.stars,"★");this.weapon=te("div","weapon",i,""),this.weaponIcon=te("div","wicon",this.weapon,""),this.weaponText=te("div","wtext",this.weapon,""),this.clock=te("div","clock",i,"00:00");const n=te("div","hud-bl",e);this.mapWrap=te("div","minimap",n),this.mapCanvas=te("canvas","",this.mapWrap),this.mapCanvas.width=220,this.mapCanvas.height=220,this.mctx=this.mapCanvas.getContext("2d"),this.bars=te("div","bars",n),this.healthBar=te("div","bar health",this.bars),this.healthFill=te("div","fill",this.healthBar),this.armorBar=te("div","bar armor",this.bars),this.armorFill=te("div","fill",this.armorBar),this.stamBar=te("div","bar stamina",this.bars),this.stamFill=te("div","fill",this.stamBar);const s=te("div","hud-br",e);this.area=te("div","area",s,""),this.speed=te("div","speed",s,""),this.crosshair=te("div","crosshair",e),this.crosshair.style.display="none",this.objective=te("div","objective",e,""),this.timer=te("div","timer",e,""),this.notice=te("div","notice",e,""),this.banner=te("div","banner",e,""),this.bannerSub=te("div","banner-sub",e,""),this.hint=te("div","hint",e,""),this.vignette=te("div","vignette",e),this.damage=te("div","damage",e),this.bigMap=te("div","bigmap",e);const a=te("div","map-row",this.bigMap);this.bigCanvas=te("canvas","",a),this.bigCanvas.width=700,this.bigCanvas.height=700,this.bctx=this.bigCanvas.getContext("2d"),this.mapPanel=te("div","map-panel",a,""),this.bigMap.style.display="none",this.mapOpen=!1,this.mapT=0,this.help=te("div","help",e,`<h2>CONTROLS</h2>
      <div><b>WASD</b> move &nbsp; <b>Shift</b> sprint (watch the yellow stamina bar — run dry and you'll pant for 5 s) &nbsp; <b>Space</b> jump / handbrake &nbsp; <b>Mouse</b> look</div>
      <div><b>F</b> enter / exit vehicle (steals occupied cars — incl. helicopters & planes) &nbsp; <b>LMB</b> fire / punch &nbsp; <b>RMB</b> aim</div>
      <div>🚁 <b>Heli</b>: <b>W</b> climb + forward · <b>S</b> descend · <b>A/D</b> yaw · <b>Space</b> hover brake &nbsp; ✈ <b>Plane</b>: <b>W</b> throttle · <b>S</b> slow down · <b>Space</b> pull up · <b>A/D</b> bank & turn (take off from runways or long roads)</div>
      <div><b>1-6</b> / <b>Q</b> / <b>wheel</b> weapons &nbsp; <b>E</b> talk to people / shop &nbsp; <b>H</b> horn &nbsp; <b>R</b> radio &nbsp; <b>M</b> map &nbsp; <b>T</b> skip time &nbsp; <b>O</b> / <b>U</b> graphics shortcuts (full quality settings in the pause menu) &nbsp; <b>F1</b> this help</div>
      <div><b>Gamepad (XInput)</b>: left stick move/steer · right stick look · <b>RT</b> fire on foot / gas in car · <b>LT</b> aim on foot / brake in car · <b>RB</b> drive-by fire in car · <b>A</b> jump/handbrake / confirm in menus · <b>B</b>/L3 sprint / B opens & closes airport & shop lists · <b>X</b> talk/horn · <b>Y</b> enter/exit · <b>D-pad</b> choose in lists · <b>LB/RB</b> weapons · <b>View</b> map · <b>Menu</b> pause · <b>R3</b> reset camera</div>
      <div class="dim">Walk into the glowing markers to start missions. Walk through store doors to shop: <span style="color:#ff8c1a">Ammu-Nation</span> <span style="color:#ff3b7a">Burger Shot</span> <span style="color:#3bd1ff">Threads</span> — drive into <span style="color:#2bff88">Pay 'n' Spray</span> to repair and lose the cops.</div>
      <div class="dim">✈ Walk into the glowing <span style="color:#2df0ff">TERMINAL</span> ring at any airport and press <b>E</b> to pick a flight between Fable City, Liberty City and Vice City — $100 a ticket, on foot only.</div>
      <div class="dim">Pickups: <span style="color:#ff5050">health</span> <span style="color:#5090ff">armor</span> <span style="color:#50ff80">cash</span> <span>weapons</span>. Hold RMB to lock on; headshots do 2.5x. Red barrels explode.</div>`),this.help.style.display="none",this.hit=te("div","hitmarker",e,""),this.shop=te("div","shop",e,""),this.shop.style.display="none",this.bubbleLayer=te("div","bubbles",e),this.bubbles=[],this.hitT=0,this.noticeT=0,this.bannerT=0,this.areaT=0,this.lastArea="",this.starFlash=0,this.moneyShown=0,this.deltaT=0,this.deltaSum=0,this.blips=[],this.buildMapImage(),this.damageA=0}buildMapImage(){const t=this.game.city,e=1250;this.mapR=e;const i=this.mapS=1024,n=i/(e*2),s=t.makeMinimap(i),a=s.getContext("2d"),o=l=>(l+e)*n;for(const l of t.hash.items)l.kind==="building"&&(a.fillStyle="rgba(120,116,110,0.85)",a.fillRect(o(l.minX),o(l.minZ),(l.maxX-l.minX)*n,(l.maxZ-l.minZ)*n));this.mapImg=s,this.mapPx=n}notify(t,e=2500){this.notice.textContent=t,this.notice.style.opacity=1,this.noticeT=e/1e3}showBanner(t,e="",i="#ffd24a",n=4e3){this.banner.textContent=t,this.banner.style.color=i,this.bannerSub.textContent=e,this.banner.style.opacity=1,this.bannerSub.style.opacity=1,this.bannerT=n/1e3}setObjective(t,e=!1){e&&this.game.missions.active||(this.objectiveText=t||"",this.objective.textContent=this.objectiveText,this.objective.style.opacity=t?1:0)}setDistance(t){this.objectiveText&&(this.objective.textContent=`${this.objectiveText}  ·  ${Math.round(t)} m`)}setTimer(t){if(t==null){this.timer.style.opacity=0;return}this.timer.style.opacity=1;const e=Math.max(0,Math.ceil(t));this.timer.textContent=`${Math.floor(e/60)}:${String(e%60).padStart(2,"0")}`,this.timer.style.color=e<10?"#ff5050":"#fff"}setHint(t){this.hint.textContent=t||"",this.hint.style.opacity=t?1:0}flashStars(){this.starFlash=1.5}moneyPop(t){this.deltaSum+=t,this.deltaT=2,this.moneyDelta.textContent=(this.deltaSum>=0?"+":"-")+As(Math.abs(this.deltaSum)),this.moneyDelta.style.color=this.deltaSum>=0?"#7dff9a":"#ff6a6a",this.moneyDelta.style.opacity=1}toggleHelp(){this.help.style.display=this.help.style.display==="none"?"block":"none"}hitmarker(t){this.hit.className="hitmarker show "+t,this.hitT=.25,t==="kill"?this.game.audio.tone(900,.08,.15,"square"):t==="head"?this.game.audio.tone(1400,.06,.15,"square"):this.game.audio.tone(700,.04,.1,"square")}showShop(t,e,i,n=-1){this.shop.style.display="block",this.shop.style.borderColor=i,this.shop.innerHTML=`<h2 style="color:${i}">${t}</h2>`+e.map((s,a)=>`<div class="row${a===n?" sel":""}"><span class="key">${a+1}</span><span class="name">${s.name}</span><span class="price">${s.price?As(s.price):"free"}</span></div>`).join("")+'<div class="dim">1-9 / D-pad + A to buy · E / B to leave</div>'}hideShop(){this.shop.style.display="none"}speak(t,e,i=2500){for(let s=this.bubbles.length-1;s>=0;s--)this.bubbles[s].ent===t&&(this.bubbles[s].e.remove(),this.bubbles.splice(s,1));const n=te("div","bubble",this.bubbleLayer,e);this.bubbles.push({ent:t,e:n,t:i/1e3})}updateBubbles(t){const e=this.game.camera;for(let i=this.bubbles.length-1;i>=0;i--){const n=this.bubbles[i];if(n.t-=t,n.t<=0||n.ent.dead){n.e.remove(),this.bubbles.splice(i,1);continue}const s=n.ent;ma.set(s.x,s.y+(s.vehicle?1.9:2.15),s.z).project(e);const a=ma.z>1,o=(ma.x*.5+.5)*innerWidth,l=(-ma.y*.5+.5)*innerHeight;n.e.style.display=a?"none":"block",n.e.style.left=o+"px",n.e.style.top=l+"px",n.e.style.opacity=Math.min(1,n.t*3)}}toggleMap(){this.mapOpen=!this.mapOpen,this.bigMap.style.display=this.mapOpen?"flex":"none",this.mapOpen&&(this.buildMapPanel(),this.drawBigMap())}buildMapPanel(){const t=this.game,e=t.player,i=(o,l)=>Math.round(Math.hypot(o-e.x,l-e.z))+" m",n=t.missions.markers.map(o=>`<div class="row"><span class="dot" style="background:#${o.color.toString(16).padStart(6,"0")}">${o.name[0]}</span><span class="name">${o.name}</span><span class="dist">${i(o.x,o.z)}</span></div><div class="desc">${o.desc}</div>`).join(""),s=t.stores.stores.map(o=>`<div class="row"><span class="dot" style="background:${o.color}">${o.kind==="gun"?"A":o.kind==="food"?"B":o.kind==="clothes"?"T":"S"}</span><span class="name">${o.name}</span><span class="dist">${i(o.doorX,o.doorZ)}</span></div>`).join(""),a=t.missions.active?`<div class="active">Current: ${this.objectiveText||"mission in progress"}</div>`:"";this.mapPanel.innerHTML=`<h2>THINGS TO DO</h2>${a}<div class="sub">Missions — walk into the marker</div>${n}<div class="sub">Shops — walk through the door</div>${s}
      <div class="sub">Legend</div>
      <div class="legend"><span><i style="background:#fff"></i> you</span><span><i style="background:#ffd24a"></i> mission / checkpoint</span><span><i style="background:#ff5050"></i> target</span><span><i style="background:#4d7cff"></i> police</span><span><i style="background:#50c8ff"></i> marked car</span><span><i style="background:#ff5050;border-radius:0"></i> health <i style="background:#5090ff;border-radius:0"></i> armor <i style="background:#50ff80;border-radius:0"></i> cash</span></div>
      <div class="dim">The world is paused while the map is open. The floating arrow above you points at your objective. Press M to close.</div>`}update(t){const e=this.game,i=e.player,n=e.police;this.moneyShown=Math.abs(i.money-this.moneyShown)<1?i.money:se(this.moneyShown,i.money,6,t),this.money.textContent=As(this.moneyShown),this.deltaT>0&&(this.deltaT-=t,this.deltaT<=0&&(this.moneyDelta.style.opacity=0,this.deltaSum=0)),this.starFlash=Math.max(0,this.starFlash-t);const s=this.starFlash>0&&Math.floor(this.starFlash*8)%2===0;this.stars.childNodes.forEach((c,h)=>{c.className="star"+(h<n.level?" on":"")+(s&&h<n.level?" flash":"")}),this.stars.style.opacity=n.level>0?1:.25;const a=Bi[i.currentWeapon];this.weaponIcon.textContent=a.icon,this.weaponText.textContent=a.melee?a.name:`${a.name}  ${i.ammo[i.currentWeapon]||0}`,this.clock.textContent=Qx(e.dayFrac),this.healthFill.style.width=Yt(i.health,0,100)+"%",this.armorFill.style.width=Yt(i.armor,0,100)+"%",this.armorBar.style.opacity=i.armor>0?1:.25,this.healthFill.style.background=i.health>35?"#4caf50":"#e53935";const o=i.exhaustT>0;this.stamFill.style.width=Yt((i.stamina??1)*100,0,100)+"%",this.stamFill.style.background=o?Math.floor(e.time*6)%2?"#ff4040":"#ffb300":"#ffd24a",this.stamBar.style.opacity=!i.vehicle&&(o||(i.stamina??1)<.999)?1:.35,i.vehicle?(this.speed.textContent=Math.round(i.vehicle.absSpeed*3.6)+" km/h",this.speed.style.opacity=1):this.speed.style.opacity=0;const l=e.stores.interior?e.stores.interior.name:e.city.districtName(i.x,i.z);l!==this.lastArea&&(this.lastArea=l,this.area.textContent=l,this.areaT=4),this.areaT>0&&(this.areaT-=t,this.area.style.opacity=Math.min(1,this.areaT)),this.crosshair.style.display=(i.aiming||i.firePoseT>0||i.vehicle&&((e.input.vehicleFiring??e.input.firing)||e.input.aiming))&&!i.dead?"block":"none",this.crosshair.className="crosshair"+(e.aimTarget?" locked":""),this.hitT>0&&(this.hitT-=t,this.hitT<=0&&(this.hit.className="hitmarker")),this.updateBubbles(t),this.noticeT>0&&(this.noticeT-=t,this.noticeT<=0&&(this.notice.style.opacity=0)),this.bannerT>0&&(this.bannerT-=t,this.bannerT<=0&&(this.banner.style.opacity=0,this.bannerSub.style.opacity=0)),this.damageA=se(this.damageA,i.damageFlash*.6+(i.health<30?.25:0),8,t),this.damage.style.opacity=this.damageA,this.drawMinimap(),this.mapOpen&&(this.mapT+=t,this.mapT>.25&&(this.mapT=0,this.drawBigMap()))}drawMinimap(){const t=this.game,e=t.player,i=this.mctx,n=220,s=n/2,a=e.vehicle?1.4:2;i.clearRect(0,0,n,n),i.save(),i.beginPath(),i.arc(s,s,s-4,0,6.28),i.clip();const o=t.rig.yaw,l=-Math.sin(o),c=-Math.cos(o),h=-Math.PI/2-Math.atan2(c,l);i.translate(s,s+20),i.rotate(h),i.scale(a/this.mapPx,a/this.mapPx),i.translate(-(e.x+this.mapR)*this.mapPx,-(e.z+this.mapR)*this.mapPx),i.drawImage(this.mapImg,0,0),i.restore(),i.save(),i.beginPath(),i.arc(s,s,s-4,0,6.28),i.clip(),i.translate(s,s+20),i.rotate(h);const f=v=>{let g=(v.x-e.x)*a,p=(v.z-e.z)*a;const M=Math.hypot(g,p),w=s-14;let x=!1;M>w&&(g*=w/M,p*=w/M,x=!0),i.save(),i.translate(g,p),i.rotate(-h),i.fillStyle=v.color,i.strokeStyle="rgba(0,0,0,0.7)",i.lineWidth=1.5;const y=v.size||6;v.kind==="cop"?(i.beginPath(),i.arc(0,0,y*.7,0,6.28),i.fill(),i.stroke()):v.kind==="store"?(i.beginPath(),i.arc(0,0,y,0,6.28),i.fill(),i.stroke(),i.fillStyle="#000",i.font="bold 9px sans-serif",i.textAlign="center",i.fillText(v.label,0,3.5)):v.kind==="mission"?(i.beginPath(),i.moveTo(0,-y-1),i.lineTo(y+1,0),i.lineTo(0,y+1),i.lineTo(-y-1,0),i.closePath(),i.fill(),i.stroke(),i.fillStyle="#000",i.font="bold 9px sans-serif",i.textAlign="center",i.fillText(v.label,0,3.5)):v.kind==="car"?(i.beginPath(),i.rect(-y*.6,-y*.6,y*1.2,y*1.2),i.fill(),i.stroke()):(i.beginPath(),i.moveTo(0,-y),i.lineTo(y,0),i.lineTo(0,y),i.lineTo(-y,0),i.closePath(),i.fill(),i.stroke()),x&&(i.globalAlpha=.9),i.restore()};for(const v of this.blips)f(v);i.restore(),i.save(),i.translate(s,s+20);const u=e.heading,d=Math.sin(u),m=Math.cos(u);i.rotate(h+Math.atan2(d,-m)),i.fillStyle="#fff",i.strokeStyle="#000",i.lineWidth=1.5,i.beginPath(),i.moveTo(0,-9),i.lineTo(6,7),i.lineTo(0,4),i.lineTo(-6,7),i.closePath(),i.fill(),i.stroke(),i.restore(),i.save(),i.translate(s,s+20),i.rotate(h),i.translate(0,-94),i.rotate(-h),i.fillStyle="#fff",i.font="bold 11px sans-serif",i.textAlign="center",i.fillText("N",0,4),i.restore()}drawBigMap(){const t=this.game,e=t.player,i=this.bctx,n=700,s=this.mapR,a=n/(s*2);if(!this.bigBase){const h=document.createElement("canvas");h.width=h.height=n,h.getContext("2d").drawImage(this.mapImg,0,0,n,n),this.bigBase=h}i.clearRect(0,0,n,n),i.drawImage(this.bigBase,0,0);const o=(h,f)=>[(h+s)*a,(f+s)*a];for(const h of this.blips){const[f,u]=o(h.x,h.z);i.fillStyle=h.color,i.strokeStyle="#000",i.lineWidth=1.5;const d=h.kind==="store"||h.kind==="mission"?8:h.kind==="pickup"?3:5;i.beginPath(),i.arc(f,u,d,0,6.28),i.fill(),i.stroke(),h.label&&(i.fillStyle="#000",i.font="bold 10px sans-serif",i.textAlign="center",i.fillText(h.label,f,u+3.5)),h.name&&(i.fillStyle="#fff",i.strokeStyle="rgba(0,0,0,0.8)",i.lineWidth=3,i.font="bold 11px sans-serif",i.strokeText(h.name,f,u-11),i.fillText(h.name,f,u-11)),h.guide&&(i.strokeStyle="#ffd24a",i.lineWidth=2,i.beginPath(),i.arc(f,u,13+Math.sin(this.game.time*6)*2,0,6.28),i.stroke())}for(const h of this.game.stores.stores){const[f,u]=o(h.doorX,h.doorZ);i.fillStyle=h.color,i.strokeStyle="#000",i.lineWidth=1.5,i.beginPath(),i.arc(f,u,8,0,6.28),i.fill(),i.stroke(),i.fillStyle="#000",i.font="bold 10px sans-serif",i.textAlign="center",i.fillText(h.kind==="gun"?"A":h.kind==="food"?"B":h.kind==="clothes"?"T":"S",f,u+3.5)}for(const[h,f,u]of[["Hospital",this.game.hospital,"#ff7070"],["Police",this.game.station,"#7fa0ff"]]){const[d,m]=o(f.x,f.z);i.fillStyle=u,i.strokeStyle="#000",i.beginPath(),i.rect(d-6,m-6,12,12),i.fill(),i.stroke(),i.fillStyle="#fff",i.strokeStyle="rgba(0,0,0,0.8)",i.lineWidth=3,i.font="bold 11px sans-serif",i.textAlign="center",i.strokeText(h,d,m-10),i.fillText(h,d,m-10)}const[l,c]=o(e.x,e.z);i.save(),i.translate(l,c),i.rotate(Math.atan2(Math.sin(e.heading),-Math.cos(e.heading))),i.fillStyle="#fff",i.strokeStyle="#000",i.beginPath(),i.moveTo(0,-9),i.lineTo(6,7),i.lineTo(0,4),i.lineTo(-6,7),i.closePath(),i.fill(),i.stroke(),i.restore(),i.fillStyle="#fff",i.font="bold 14px sans-serif",i.textAlign="center";for(const[h,f,u]of this.game.city.mapLabels()){const[d,m]=o(f,u);i.strokeStyle="rgba(0,0,0,0.8)",i.lineWidth=3,i.strokeText(h,d,m),i.fillText(h,d,m)}}}const ga=3e3,he=(r,t=.8,e={})=>new pt({color:r,roughness:t,...e});function ko(r,t){const e=document.createElement("canvas");e.width=512,e.height=128;const i=e.getContext("2d");i.fillStyle="#111",i.fillRect(0,0,512,128),i.fillStyle=t,i.fillRect(6,6,500,116),i.fillStyle="#111",i.fillRect(12,12,488,104),i.font="bold 64px Impact, Arial Narrow, sans-serif",i.textAlign="center",i.textBaseline="middle",i.fillStyle=t,i.shadowColor=t,i.shadowBlur=18,i.fillText(r,256,66);const n=new vr(e);return n.colorSpace=ri,n}const No=[{name:"Street",shirt:16053492,pants:3100559,price:0},{name:"Blackout",shirt:1381653,pants:1052688,price:200},{name:"Tourist",shirt:16740259,pants:14271631,price:150},{name:"Vice",shirt:8382463,pants:16316664,price:300},{name:"Suit",shirt:3817290,pants:2895928,price:500},{name:"Hi-Vis",shirt:16757504,pants:2829099,price:120},{name:"Track",shirt:3066993,pants:1999945,price:180}];class yv{constructor(t){this.game=t,this.stores=[],this.interior=null,this.shopOpen=null,this.sel=0,this.fadeT=0,this.cooldown=0,this.interiors={},this.roomLights=[];for(let e=0;e<3;e++){const i=new wr(16773596,0,16,1.6);i.position.set(0,-100,0),t.scene.add(i),this.roomLights.push(i)}this.buildForMap()}buildForMap(){pr[this.game.mapId].stores.forEach((e,i)=>this.buildStore(e,i))}disposeExteriors(){for(const t of this.stores)this.game.scene.remove(t.ext),t.ext.traverse(e=>{e.geometry&&!e.geometry.userData.shared&&e.geometry.dispose();const i=Array.isArray(e.material)?e.material:[e.material];for(const n of i)if(n){for(const s in n)n[s]?.isTexture&&n[s].dispose();n.dispose?.()}});this.stores.length=0}buildStore(t,e){const i=this.game,n=i.city,s=n.blocks.find(g=>g.i===t.block[0]&&g.j===t.block[1]);let a,o,l;const c=.5;t.side==="S"?(a=s.x0+(s.x1-s.x0)*c,o=s.z1+.2,l=0):t.side==="N"?(a=s.x0+(s.x1-s.x0)*c,o=s.z0-.2,l=Math.PI):t.side==="E"?(a=s.x1+.2,o=s.z0+(s.z1-s.z0)*c,l=Math.PI/2):(a=s.x0-.2,o=s.z0+(s.z1-s.z0)*c,l=-Math.PI/2);const h={...t,x:a,z:o,rot:l,index:e},f=Math.sin(l),u=Math.cos(l);h.doorX=a+f*1.6,h.doorZ=o+u*1.6;const d=h.ext=new be;i.scene.add(d);const m=new be;if(m.position.set(a,s.hBase+Xe.CURB,o),m.rotation.y=l,d.add(m),t.kind!=="spray"){const g=new N(new _t(8,1.6,.3),[he(1118481),he(1118481),he(1118481),he(1118481),new re({map:ko(t.name,t.color),toneMapped:!1}),he(1118481)]);g.position.set(0,4.2,.35),m.add(g);const p=new N(new _t(8.4,.12,1.8),he(t.hex,.9));p.position.set(0,3.3,1),p.castShadow=!0,m.add(p);const M=new N(new _t(2.2,3,.15),he(858918,.2,{metalness:.7}));M.position.set(0,1.5,.12),m.add(M);const w=new N(new _t(2.6,3.2,.1),he(14540253,.5));w.position.set(0,1.6,.06),m.add(w);for(const y of[-3,3]){const b=new N(new _t(3.4,2.2,.12),he(1716036,.15,{metalness:.8}));b.position.set(y,1.7,.12),m.add(b)}const x=this.interiors[t.id];x?(h.int=x.int,h.clerk=x.clerk,x.clerk.store=h,this.addInteriorColliders(h)):(this.buildInterior(h),this.interiors[t.id]={int:h.int,clerk:h.clerk})}else{const g=new be;g.position.set(a+f*7,s.hBase,o+u*7),g.rotation.y=l,d.add(g);const p=new N(new _t(8,1.6,.3),[he(1118481),he(1118481),he(1118481),he(1118481),new re({map:ko(t.name,t.color),toneMapped:!1}),he(1118481)]);p.position.set(0,4.2,.35),m.add(p);const M=new N(new _t(9,.3,8),he(5593952));M.position.set(0,4.3,0),M.castShadow=!0,g.add(M);for(const w of[-4.4,4.4]){const x=new N(new _t(.3,4.3,.3),he(5593952));x.position.set(w,2.15,-3.7),g.add(x);const y=x.clone();y.position.z=3.7,g.add(y)}h.doorX=g.position.x,h.doorZ=g.position.z}const v=new N(new jt(t.kind==="spray"?3.2:1.1,t.kind==="spray"?3.2:1.1,t.kind==="spray"?2:1.2,24,1,!0),new re({color:t.hex,transparent:!0,opacity:.35,side:Ve,depthWrite:!1,toneMapped:!1}));v.position.set(h.doorX,n.groundHeight(h.doorX,h.doorZ)+.7,h.doorZ),d.add(v),h.ring=v,this.stores.push(h)}addInteriorColliders(t){const e=this.game,i=ga,n=ga+t.index*120,s=16,a=12,o=4,l=[[0,o/2,-a/2,s,o,.3],[0,o/2,a/2,s,o,.3],[-s/2,o/2,0,.3,o,a],[s/2,o/2,0,.3,o,a]];for(const[c,h,f,u,d,m]of l)e.city.addCollider(i+c-u/2,n+f-m/2,i+c+u/2,n+f+m/2,"building",o);if(e.city.addCollider(i-3.5,n-a/2+2,i+3.5,n-a/2+3.2,"prop",1.2),t.kind==="food")for(const[c,h]of[[-4.5,1],[4.5,1],[-4.5,4],[4.5,4]])e.city.addCollider(i+c-.8,n+h-.8,i+c+.8,n+h+.8,"prop",1);else if(t.kind==="clothes")for(let c=0;c<8;c++){const h=c<4?-s/2+1.2:s/2-1.2,f=-3+c%4*2.2;e.city.addCollider(i+h-.3,n+f-1,i+h+.3,n+f+1,"prop",2)}}buildInterior(t){const e=this.game,i=ga,n=ga+t.index*120,s=16,a=12,o=4;t.int={x:i,z:n,spawnX:i,spawnZ:n+a/2-2,exitX:i,exitZ:n+a/2-1.2,counterX:i,counterZ:n-a/2+4.6};const l=new be;l.position.set(i,0,n),e.scene.add(l);const c=he(t.kind==="food"?14207400:t.kind==="gun"?3948356:15262424,.8),h=new N(new _t(s,.2,a),c);h.position.y=-.1,h.receiveShadow=!0,l.add(h);const f=he(t.kind==="food"?15918792:t.kind==="gun"?9056047:16250871,.9),u=[[0,o/2,-a/2,s,o,.3],[0,o/2,a/2,s,o,.3],[-s/2,o/2,0,.3,o,a],[s/2,o/2,0,.3,o,a]];for(const[x,y,b,_,E,T]of u){const S=new N(new _t(_,E,T),f);S.position.set(x,y,b),S.receiveShadow=!0,l.add(S),e.city.addCollider(i+x-_/2,n+b-T/2,i+x+_/2,n+b+T/2,"building",o)}const d=new N(new _t(s,.3,a),he(14540253));d.position.y=o,d.castShadow=!0,l.add(d);const m=new N(new _t(2.2,3,.2),he(858918,.2,{metalness:.7}));m.position.set(0,1.5,a/2-.25),l.add(m);for(const[x,y]of[[-4,-2],[4,-2],[0,3]]){const b=new N(new _t(1.2,.1,.4),new re({color:16774880}));b.position.set(x,o-.2,y),l.add(b)}t.int.lights=[[-4,o-.4,-2],[4,o-.4,-2],[0,o-.4,3]];const v=new N(new _t(7,1.1,1.2),he(t.kind==="food"?12597547:2829099,.5));v.position.set(0,.55,-a/2+2.6),v.castShadow=!0,l.add(v);const g=new N(new _t(7.2,.08,1.4),he(15658734,.2,{metalness:.5}));if(g.position.set(0,1.12,-a/2+2.6),l.add(g),e.city.addCollider(i-3.5,n-a/2+2,i+3.5,n-a/2+3.2,"prop",1.2),t.kind==="gun"){for(let _=0;_<6;_++){const E=new N(new _t(.1,.5,1.4),he(1118481,.3,{metalness:.6}));E.position.set(-s/2+.3,1.6+_%3*.7,-3+Math.floor(_/3)*3),l.add(E)}for(let _=0;_<6;_++){const E=new N(new _t(.1,.5,1.4),he(1118481,.3,{metalness:.6}));E.position.set(s/2-.3,1.6+_%3*.7,-3+Math.floor(_/3)*3),l.add(E)}const x=new N(new _t(1.2,1.8,.05),he(16053492));x.position.set(0,2.2,-a/2+.2),l.add(x);const y=new N(new _r(.15,.5,24),new re({color:16719904,side:Ve}));y.position.set(0,2.3,-a/2+.24),l.add(y);const b=new N(new _t(6.8,.6,1),he(8956620,.1,{transparent:!0,opacity:.35}));b.position.set(0,1.45,-a/2+2.6),l.add(b)}else if(t.kind==="food"){for(const[b,_]of[[-4.5,1],[4.5,1],[-4.5,4],[4.5,4]]){const E=new N(new jt(.8,.8,.08,16),he(16448250,.4));E.position.set(b,.8,_),l.add(E);const T=new N(new jt(.08,.2,.8,8),he(8947848));T.position.set(b,.4,_),l.add(T);for(const S of[0,Math.PI]){const R=new N(new _t(.5,.5,.5),he(12597547));R.position.set(b+Math.cos(S)*1.3,.25,_+Math.sin(S)*1.3),l.add(R)}e.city.addCollider(i+b-.8,n+_-.8,i+b+.8,n+_+.8,"prop",1)}const x=new N(new _t(5,1.2,.05),new re({map:ko("BURGERS • FRIES • SODA","#ffd24a"),toneMapped:!1}));x.position.set(0,3,-a/2+.2),l.add(x);const y=new N(new _t(3,1.4,1),he(12568009,.3,{metalness:.8}));y.position.set(-3,.7,-a/2+.8),l.add(y)}else{for(let y=0;y<8;y++){const b=y<4?-s/2+1.2:s/2-1.2,_=-3+y%4*2.2,E=new N(new _t(.06,.06,1.8),he(11184810,.3,{metalness:.8}));E.position.set(b,1.7,_),l.add(E);for(let T=0;T<4;T++){const S=new N(new _t(.06,.7,.35),he(No[(y+T)%No.length].shirt,.9));S.position.set(b,1.3,_-.7+T*.45),l.add(S)}e.city.addCollider(i+b-.3,n+_-1,i+b+.3,n+_+1,"prop",2)}const x=new N(new _t(2.4,3,.05),he(12376302,.05,{metalness:1}));x.position.set(4,1.8,-a/2+.2),l.add(x)}const p=new Rn(e,i,n-a/2+1.4,{kind:"clerk",shirt:t.kind==="food"?16726906:t.kind==="gun"?3815994:3920383,pants:2236962});p.heading=0,p.waitT=1e12,p.important=!0,p.state="idle",p.store=t,p.syncMesh(),e.peds.push(p),t.clerk=p;const M=new N(new jt(.9,.9,1.2,24,1,!0),new re({color:16765514,transparent:!0,opacity:.3,side:Ve,depthWrite:!1}));M.position.set(t.int.exitX,.6,t.int.exitZ),e.scene.add(M);const w=new N(new jt(.9,.9,1.2,24,1,!0),new re({color:t.hex,transparent:!0,opacity:.3,side:Ve,depthWrite:!1}));w.position.set(t.int.counterX,.6,t.int.counterZ),e.scene.add(w)}items(t){const e=this.game.player;return t.kind==="gun"?[{name:"Pistol ammo (34)",price:150,buy:()=>e.giveWeapon("pistol",34)},{name:"Uzi + 90 rounds",price:600,buy:()=>e.giveWeapon("uzi",90)},{name:"Shotgun + 24 shells",price:800,buy:()=>e.giveWeapon("shotgun",24)},{name:"Rifle + 30 rounds",price:1200,buy:()=>e.giveWeapon("rifle",30)},{name:"RPG + 3 rockets",price:2500,buy:()=>e.giveWeapon("rpg",3)},{name:"Body armor",price:250,buy:()=>{e.armor=100}}]:t.kind==="food"?[{name:"Soda (+10 hp)",price:3,buy:()=>{e.health=Math.min(100,e.health+10)}},{name:"Burger (+40 hp)",price:12,buy:()=>{e.health=Math.min(100,e.health+40)}},{name:"Double Meal (+100 hp)",price:25,buy:()=>{e.health=100}}]:No.map(i=>({name:`${i.name} outfit`,price:i.price,buy:()=>e.setOutfit(i.shirt,i.pants)}))}openShop(t){const e=this.game;this.shopOpen=t,this.sel=0,this.renderShop(),t.clerk&&t.greet&&e.hud.speak(t.clerk,We(t.greet),3500)}closeShop(){this.shopOpen=null,this.sel=0,this.game.hud.hideShop()}renderShop(){const t=this.shopOpen;t&&this.game.hud.showShop(t.name,this.items(t),t.color,this.sel)}buy(t){const e=this.shopOpen;if(!e)return;const i=this.items(e)[t];if(!i)return;const n=this.game.player;if(n.money<i.price){this.game.hud.notify("You can't afford that",1500),this.game.hud.speak(e.clerk,"No cash, no goods, pal.",2e3);return}n.money-=i.price,i.price>0&&this.game.hud.moneyPop(-i.price),i.buy(),this.game.audio.cash(),this.game.hud.notify(`Bought ${i.name}`,1500),this.game.hud.speak(e.clerk,We(["Pleasure doing business.","Come again!","Good choice."]),2e3)}enter(t){const e=this.game,i=e.player;this.interior=t,this.cooldown=1.2,this.fadeT=.5,this.roomLights.forEach((n,s)=>{const[a,o,l]=t.int.lights[s];n.position.set(t.int.x+a,o,t.int.z+l),n.intensity=18}),i.setPosition(t.int.spawnX,t.int.spawnZ,Math.PI),e.rig.snapBehind(Math.PI),e.rig.pos.set(i.x,2,i.z+4),e.audio.ui(),e.hud.notify(`${t.name}`,2e3)}exit(){const t=this.game,e=t.player,i=this.interior;this.interior=null,this.cooldown=1.2,this.fadeT=.5,this.closeShop();for(const n of this.roomLights)n.intensity=0;e.setPosition(i.doorX+Math.sin(i.rot)*1.5,i.doorZ+Math.cos(i.rot)*1.5,i.rot),t.rig.snapBehind(i.rot),t.rig.pos.set(e.x-Math.sin(i.rot)*4,2,e.z-Math.cos(i.rot)*4),t.audio.ui()}update(t){const e=this.game,i=e.player,n=e.input,s=e.time;this.cooldown=Math.max(0,this.cooldown-t),this.fadeT=Math.max(0,this.fadeT-t);for(const a of this.stores)a.ring.material.opacity=.25+.12*Math.sin(s*3+a.index);if(i.dead||i.busted){this.shopOpen&&this.closeShop();return}if(this.shopOpen){const a=this.items(this.shopOpen).length;for(let o=0;o<9;o++)n.hitCode("Digit"+(o+1))&&this.buy(o);n.hit("dUp")?(this.sel=(this.sel+a-1)%a,this.renderShop(),e.audio.tone(600,.05,.08,"square")):n.hit("dDown")?(this.sel=(this.sel+1)%a,this.renderShop(),e.audio.tone(600,.05,.08,"square")):n.hit("jump")||n.hitCode("Enter")?this.buy(this.sel):(n.hit("interact")||n.hit("sprint")||n.hitCode("Escape")||yt(i.x,i.z,this.shopOpen.int.counterX,this.shopOpen.int.counterZ)>3.5)&&this.closeShop();return}if(this.interior){const a=this.interior;if(this.cooldown<=0&&yt(i.x,i.z,a.int.exitX,a.int.exitZ)<1.4){this.exit();return}yt(i.x,i.z,a.int.counterX,a.int.counterZ)<2.2&&(e.hud.setHint(n.gamepadConnected?"X / B to shop":"Press E to shop"),(n.hit("interact")||n.hit("sprint"))&&this.openShop(a));return}if(!(this.cooldown>0))for(const a of this.stores){if(a.kind==="spray"){if(i.vehicle&&yt(i.x,i.z,a.doorX,a.doorZ)<3.5&&i.vehicle.absSpeed<1.5){if(i.money<100){e.hud.notify("Pay 'n' Spray costs $100",1500),this.cooldown=3;continue}i.money-=100,e.hud.moneyPop(-100);const o=i.vehicle;o.health=100,o.onFire=!1,o.fireT=0,o.paint.color.setHex(We(o.type.colors)),e.police.clear(),e.hud.notify("Resprayed. The cops lost your trail.",3e3),e.audio.cash(),this.cooldown=4,this.fadeT=.6}continue}if(!i.vehicle&&yt(i.x,i.z,a.doorX,a.doorZ)<1.5){this.enter(a);return}}}}const xs=100;class Mv{constructor(t){this.game=t,this.rings=[],this.flying=null,this.menu=null,this.sel=0,this.buildRings(),this.menuEl=document.createElement("div"),this.menuEl.className="travel-menu",this.menuEl.style.display="none",document.body.appendChild(this.menuEl)}destsOf(t){return["fable","liberty","vice"].filter(e=>e!==t)}cityName(t){return t==="fable"?"Fable City":t==="liberty"?"Liberty City":"Vice City"}buildRings(){const t=this.game;for(const e of t.city.airports){const i=new N(new jt(1.6,1.6,2.4,24,1,!0),new re({color:3010815,transparent:!0,opacity:.35,side:Ve,depthWrite:!1,toneMapped:!1}));i.position.set(e.x,t.city.groundHeight(e.x,e.z)+1.2,e.z),t.scene.add(i),this.rings.push({ring:i,x:e.x,z:e.z})}}disposeRings(){for(const t of this.rings)this.game.scene.remove(t.ring),t.ring.geometry.dispose(),t.ring.material.dispose();this.rings.length=0,this.closeMenu()}openMenu(){const t=this.game;this.menu=this.destsOf(t.mapId),this.sel=0,this.renderMenu()}renderMenu(){const t=this.game,e=t.input.gamepadConnected;this.menuEl.innerHTML='<h2 style="color:#2df0ff">✈ DEPARTURES</h2>'+this.menu.map((i,n)=>`<div class="row${n===this.sel?" sel":""}"><span class="key">${n+1}</span><span class="name">Fly to ${this.cityName(i)}</span><span class="price">$${xs}</span></div>`).join("")+`<div class="dim">${e?"D-pad choose · A fly · B stay":`Press 1-${this.menu.length} or ↑↓ + Enter to fly · E or Esc to stay`}</div>`,this.menuEl.style.display="block"}closeMenu(){this.menu=null,this.sel=0,this.menuEl&&(this.menuEl.style.display="none")}update(t){const e=this.game,i=e.player,n=e.input;for(const s of this.rings)s.ring.material.opacity=.25+.12*Math.sin(e.time*3+s.x);if(this.flying){const s=this.flying,a=e.grade.uniforms;return s.phase==="out"?(a.uFade.value=Math.min(1,a.uFade.value+t/1.1),a.uFade.value>=1&&(e.flyTo(s.dest),s.phase="in")):(a.uFade.value=Math.max(0,a.uFade.value-t/1.1),a.uFade.value<=0&&(this.flying=null,e.hud.bannerT=0,e.hud.banner.style.opacity=0,e.hud.bannerSub.style.opacity=0,e.hud.notify(`Welcome to ${this.cityName(e.mapId)}`,4e3))),!0}if(this.menu){for(let s=0;s<this.menu.length;s++)if(n.hitCode("Digit"+(s+1)))return this.tryFly(this.menu[s]),!1;if(n.hit("dUp")||n.hitCode("ArrowUp"))this.sel=(this.sel+this.menu.length-1)%this.menu.length,this.renderMenu(),e.audio.tone(600,.05,.08,"square");else if(n.hit("dDown")||n.hitCode("ArrowDown"))this.sel=(this.sel+1)%this.menu.length,this.renderMenu(),e.audio.tone(600,.05,.08,"square");else{if(n.hit("jump")||n.hitCode("Enter"))return this.tryFly(this.menu[this.sel]),!1;(n.hit("interact")||n.hit("sprint")||n.hitCode("Escape"))&&this.closeMenu()}return!1}if(i.dead||i.busted||i.vehicle||e.missions.active||e.stores.interior||e.stores.shopOpen)return!1;for(const s of this.rings)if(yt(i.x,i.z,s.x,s.z)<2.4)return e.hud.setHint(`Fly to ${this.menuPreview(e)} — $${xs} (${n.gamepadConnected?"X / B":"E"})`),(n.hit("interact")||n.hit("sprint"))&&this.openMenu(),!1;return!1}menuPreview(t){return this.destsOf(t.mapId).map(e=>this.cityName(e)).join(" or ")}tryFly(t){const e=this.game,i=e.player;if(t=t||this.destsOf(e.mapId)[0],i.money<xs){e.hud.notify(`A ticket costs $${xs}`,2e3),this.closeMenu();return}i.money-=xs,e.hud.moneyPop(-xs),this.closeMenu(),this.flying={dest:t,phase:"out"},e.hud.showBanner("✈ NOW BOARDING",`Flight to ${this.cityName(t)}…`,"#2df0ff",2500),e.audio.ui()}}const Ar=new we;Ar.setAttribute("position",new Le(new Float32Array([-1,-1,3,-1,-1,3]),2));Ar.setAttribute("uv",new Le(new Float32Array([0,0,2,0,0,2]),2));Ar.boundingSphere=new hn;Ar.computeBoundingSphere=function(){};const bv=new Ba;class vs{constructor(t){this._mesh=new N(Ar,t),this._mesh.frustumCulled=!1}render(t){t.render(this._mesh,bv)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}dispose(){this._mesh.material.dispose(),this._mesh.geometry.dispose()}}const wv={uniforms:{sceneDiffuse:{value:null},sceneDepth:{value:null},sceneNormal:{value:null},projMat:{value:new qt},viewMat:{value:new qt},projViewMat:{value:new qt},projectionMatrixInv:{value:new qt},viewMatrixInv:{value:new qt},cameraPos:{value:new z},resolution:{value:new ot},biasAdjustment:{value:new ot},time:{value:0},samples:{value:[]},bluenoise:{value:null},distanceFalloff:{value:1},radius:{value:5},near:{value:.1},far:{value:1e3},logDepth:{value:!1},ortho:{value:!1},screenSpaceRadius:{value:!1},frame:{value:0}},depthWrite:!1,depthTest:!1,vertexShader:`
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
}`},Sv={uniforms:{sceneDiffuse:{value:null},sceneDepth:{value:null},tDiffuse:{value:null},transparencyDWFalse:{value:null},transparencyDWTrue:{value:null},transparencyDWTrueDepth:{value:null},transparencyAware:{value:!1},projMat:{value:new qt},viewMat:{value:new qt},projectionMatrixInv:{value:new qt},viewMatrixInv:{value:new qt},cameraPos:{value:new z},resolution:{value:new ot},color:{value:new z(0,0,0)},blueNoise:{value:null},downsampledDepth:{value:null},time:{value:0},intensity:{value:10},renderMode:{value:0},gammaCorrection:{value:!1},logDepth:{value:!1},ortho:{value:!1},near:{value:.1},far:{value:1e3},screenSpaceRadius:{value:!1},radius:{value:0},distanceFalloff:{value:1},fog:{value:!1},fogExp:{value:!1},fogDensity:{value:0},fogNear:{value:1/0},fogFar:{value:1/0},colorMultiply:{value:!0},aoTones:{value:0}},depthWrite:!1,depthTest:!1,vertexShader:`
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
    `},Tv={uniforms:{sceneDiffuse:{value:null},sceneDepth:{value:null},tDiffuse:{value:null},projMat:{value:new qt},viewMat:{value:new qt},projectionMatrixInv:{value:new qt},viewMatrixInv:{value:new qt},cameraPos:{value:new z},resolution:{value:new ot},time:{value:0},r:{value:5},blueNoise:{value:null},radius:{value:12},worldRadius:{value:5},index:{value:0},poissonDisk:{value:[]},distanceFalloff:{value:1},near:{value:.1},far:{value:1e3},logDepth:{value:!1},screenSpaceRadius:{value:!1}},depthWrite:!1,depthTest:!1,vertexShader:`
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
    `},_v={uniforms:{sceneDepth:{value:null},resolution:{value:new ot},near:{value:.1},far:{value:1e3},viewMatrixInv:{value:new qt},projectionMatrixInv:{value:new qt},logDepth:{value:!1},ortho:{value:!1}},depthWrite:!1,depthTest:!1,vertexShader:`
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
    }`};var Ju="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";const Ev=parseInt(ka.replace(/\D+/g,"")),Av=Ev>=162?class extends Be{constructor(r=1,t=1,e=1,i={}){super(r,t,{...i,count:e}),this.isWebGLMultipleRenderTargets=!0}get texture(){return this.textures}}:class extends Be{constructor(r=1,t=1,e=1,i={}){super(r,t,i),this.isWebGLMultipleRenderTargets=!0;const n=this.texture;this.texture=[];for(let s=0;s<e;s++)this.texture[s]=n.clone(),this.texture[s].isRenderTargetTexture=!0}setSize(r,t,e=1){if(this.width!==r||this.height!==t||this.depth!==e){this.width=r,this.height=t,this.depth=e;for(let i=0,n=this.texture.length;i<n;i++)this.texture[i].image.width=r,this.texture[i].image.height=t,this.texture[i].image.depth=e;this.dispose()}this.viewport.set(0,0,r,t),this.scissor.set(0,0,r,t)}copy(r){this.dispose(),this.width=r.width,this.height=r.height,this.depth=r.depth,this.scissor.copy(r.scissor),this.scissorTest=r.scissorTest,this.viewport.copy(r.viewport),this.depthBuffer=r.depthBuffer,this.stencilBuffer=r.stencilBuffer,r.depthTexture!==null&&(this.depthTexture=r.depthTexture.clone()),this.texture.length=0;for(let t=0,e=r.texture.length;t<e;t++)this.texture[t]=r.texture[t].clone(),this.texture[t].isRenderTargetTexture=!0;return this}};Uint8Array.from(atob(Ju),r=>r.charCodeAt(0));const Cv=Uint8Array.from(atob(Ju),r=>r.charCodeAt(0));function $u(r,t,e){if(t.getQueryParameter(r,t.QUERY_RESULT_AVAILABLE)){const s=t.getQueryParameter(r,t.QUERY_RESULT)/1e6;e.lastTime=e.lastTime===0?s:e.timeRollingAverage*e.lastTime+(1-e.timeRollingAverage)*s}else setTimeout(()=>{$u(r,t,e)},1)}class Rv extends jn{constructor(t,e,i=512,n=512){super(),this.width=i,this.height=n,this.clear=!0,this.camera=e,this.scene=t,this.configuration=new Proxy({aoSamples:16,aoRadius:5,aoTones:0,denoiseSamples:8,denoiseRadius:12,distanceFalloff:1,intensity:5,denoiseIterations:2,renderMode:0,biasOffset:0,biasMultiplier:0,color:new G(0,0,0),gammaCorrection:!0,logarithmicDepthBuffer:!1,screenSpaceRadius:!1,halfRes:!1,depthAwareUpsampling:!0,autoRenderBeauty:!0,colorMultiply:!0,transparencyAware:!1,stencil:!1,accumulate:!1},{set:(s,a,o)=>{const l=s[a];return s[a]=o,o.equals?o.equals(l)||this.firstFrame():l!==o&&this.firstFrame(),a==="aoSamples"&&l!==o&&this.configureAOPass(this.configuration.logarithmicDepthBuffer,this.camera.isOrthographicCamera),a==="denoiseSamples"&&l!==o&&this.configureDenoisePass(this.configuration.logarithmicDepthBuffer,this.camera.isOrthographicCamera),a==="halfRes"&&l!==o&&(this.configureAOPass(this.configuration.logarithmicDepthBuffer,this.camera.isOrthographicCamera),this.configureHalfResTargets(),this.configureEffectCompositer(this.configuration.logarithmicDepthBuffer,this.camera.isOrthographicCamera),this.setSize(this.width,this.height)),a==="depthAwareUpsampling"&&l!==o&&this.configureEffectCompositer(this.configuration.logarithmicDepthBuffer,this.camera.isOrthographicCamera),a==="transparencyAware"&&l!==o&&(this.autoDetectTransparency=!1,this.configureTransparencyTarget()),a==="stencil"&&l!==o&&(this.beautyRenderTarget.dispose(),this.beautyRenderTarget=new Be(this.width,this.height,{minFilter:Oe,magFilter:ze,type:ai,format:Ge,stencilBuffer:o}),this.beautyRenderTarget.depthTexture=new lr(this.width,this.height,o?Xn:Hi),this.beautyRenderTarget.depthTexture.format=o?qn:Cn),!0}}),this.samples=[],this.samplesDenoise=[],this.autoDetectTransparency=!0,this.frame=0,this.lastViewMatrix=new qt,this.lastProjectionMatrix=new qt,this.beautyRenderTarget=new Be(this.width,this.height,{minFilter:Oe,magFilter:ze,type:ai,format:Ge,stencilBuffer:!1}),this.beautyRenderTarget.depthTexture=new lr(this.width,this.height,Hi),this.beautyRenderTarget.depthTexture.format=Cn,this.configureEffectCompositer(this.configuration.logarithmicDepthBuffer,this.camera.isOrthographicCamera),this.configureSampleDependentPasses(),this.configureHalfResTargets(),this.detectTransparency(),this.configureTransparencyTarget(),this.writeTargetInternal=new Be(this.width,this.height,{minFilter:Oe,magFilter:Oe,depthBuffer:!1,format:Ge}),this.readTargetInternal=new Be(this.width,this.height,{minFilter:Oe,magFilter:Oe,depthBuffer:!1,format:Ge}),this.accumulationRenderTarget=new Be(this.width,this.height,{minFilter:Oe,magFilter:Oe,depthBuffer:!1,format:Ge,type:ai,stencilBuffer:!1,depthBuffer:!1,alpha:!0}),this.bluenoise=new Eu(Cv,128,128),this.accumulationQuad=new vs(new ye({uniforms:{frame:{value:0},tDiffuse:{value:null}},transparent:!0,opacity:1,vertexShader:`
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
                `})),this.bluenoise.colorSpace=sn,this.bluenoise.wrapS=Is,this.bluenoise.wrapT=Is,this.bluenoise.minFilter=ze,this.bluenoise.magFilter=ze,this.bluenoise.needsUpdate=!0,this.lastTime=0,this.timeRollingAverage=.99,this._r=new ot,this._c=new G}configureHalfResTargets(){this.firstFrame(),this.configuration.halfRes?(this.depthDownsampleTarget=new Av(this.width/2,this.height/2,2),this.depthDownsampleTarget.textures[0].format=Fa,this.depthDownsampleTarget.textures[0].type=Ii,this.depthDownsampleTarget.textures[0].minFilter=ze,this.depthDownsampleTarget.textures[0].magFilter=ze,this.depthDownsampleTarget.textures[0].depthBuffer=!1,this.depthDownsampleTarget.textures[1].format=Ge,this.depthDownsampleTarget.textures[1].type=ai,this.depthDownsampleTarget.textures[1].minFilter=ze,this.depthDownsampleTarget.textures[1].magFilter=ze,this.depthDownsampleTarget.textures[1].depthBuffer=!1,this.depthDownsampleQuad=new vs(new ye(_v))):(this.depthDownsampleTarget&&(this.depthDownsampleTarget.dispose(),this.depthDownsampleTarget=null),this.depthDownsampleQuad&&(this.depthDownsampleQuad.dispose(),this.depthDownsampleQuad=null))}detectTransparency(){if(this.autoDetectTransparency){let t=!1;this.scene.traverse(e=>{e.material&&e.material.transparent&&(t=!0)}),this.configuration.transparencyAware=t}}configureTransparencyTarget(){this.configuration.transparencyAware?(this.transparencyRenderTargetDWFalse=new Be(this.width,this.height,{minFilter:Oe,magFilter:ze,type:ai,format:Ge}),this.transparencyRenderTargetDWTrue=new Be(this.width,this.height,{minFilter:Oe,magFilter:ze,type:ai,format:Ge}),this.transparencyRenderTargetDWTrue.depthTexture=new lr(this.width,this.height,Hi),this.depthCopyPass=new vs(new ye({uniforms:{depthTexture:{value:this.beautyRenderTarget.depthTexture}},vertexShader:`
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
            `}))):(this.transparencyRenderTargetDWFalse&&(this.transparencyRenderTargetDWFalse.dispose(),this.transparencyRenderTargetDWFalse=null),this.transparencyRenderTargetDWTrue&&(this.transparencyRenderTargetDWTrue.dispose(),this.transparencyRenderTargetDWTrue=null),this.depthCopyPass&&(this.depthCopyPass.dispose(),this.depthCopyPass=null))}renderTransparency(t){const e=this.scene.background,i=t.getClearColor(new G),n=t.getClearAlpha(),s=new Map,a=t.autoClearDepth;this.scene.traverse(o=>{s.set(o,o.visible)}),this.scene.background=null,t.autoClearDepth=!1,t.setClearColor(new G(0,0,0),0),this.depthCopyPass.material.uniforms.depthTexture.value=this.beautyRenderTarget.depthTexture,t.setRenderTarget(this.transparencyRenderTargetDWFalse),this.scene.traverse(o=>{o.material&&(o.visible=s.get(o)&&(o.material.transparent&&!o.material.depthWrite&&!o.userData.treatAsOpaque||!!o.userData.cannotReceiveAO))}),t.clear(!0,!0,!0),this.depthCopyPass.render(t),t.render(this.scene,this.camera),t.setRenderTarget(this.transparencyRenderTargetDWTrue),this.scene.traverse(o=>{o.material&&(o.visible=s.get(o)&&o.material.transparent&&o.material.depthWrite&&!o.userData.treatAsOpaque)}),t.clear(!0,!0,!0),this.depthCopyPass.render(t),t.render(this.scene,this.camera),this.scene.traverse(o=>{o.visible=s.get(o)}),t.setClearColor(i,n),this.scene.background=e,t.autoClearDepth=a}configureSampleDependentPasses(){this.firstFrame(),this.configureAOPass(this.configuration.logarithmicDepthBuffer,this.camera.isOrthographicCamera),this.configureDenoisePass(this.configuration.logarithmicDepthBuffer,this.camera.isOrthographicCamera)}configureAOPass(t=!1,e=!1){this.firstFrame(),this.samples=this.generateHemisphereSamples(this.configuration.aoSamples);const i={...wv};i.fragmentShader=i.fragmentShader.replace("16",this.configuration.aoSamples).replace("16.0",this.configuration.aoSamples+".0"),t&&(i.fragmentShader=`#define LOGDEPTH
`+i.fragmentShader),e&&(i.fragmentShader=`#define ORTHO
`+i.fragmentShader),this.configuration.halfRes&&(i.fragmentShader=`#define HALFRES
`+i.fragmentShader),this.effectShaderQuad?(this.effectShaderQuad.material.dispose(),this.effectShaderQuad.material=new ye(i)):this.effectShaderQuad=new vs(new ye(i))}configureDenoisePass(t=!1,e=!1){this.firstFrame(),this.samplesDenoise=this.generateDenoiseSamples(this.configuration.denoiseSamples,11);const i={...Tv};i.fragmentShader=i.fragmentShader.replace("16",this.configuration.denoiseSamples),t&&(i.fragmentShader=`#define LOGDEPTH
`+i.fragmentShader),e&&(i.fragmentShader=`#define ORTHO
`+i.fragmentShader),this.poissonBlurQuad?(this.poissonBlurQuad.material.dispose(),this.poissonBlurQuad.material=new ye(i)):this.poissonBlurQuad=new vs(new ye(i))}configureEffectCompositer(t=!1,e=!1){this.firstFrame();const i={...Sv};t&&(i.fragmentShader=`#define LOGDEPTH
`+i.fragmentShader),e&&(i.fragmentShader=`#define ORTHO
`+i.fragmentShader),this.configuration.halfRes&&this.configuration.depthAwareUpsampling&&(i.fragmentShader=`#define HALFRES
`+i.fragmentShader),this.effectCompositerQuad?(this.effectCompositerQuad.material.dispose(),this.effectCompositerQuad.material=new ye(i)):this.effectCompositerQuad=new vs(new ye(i))}generateHemisphereSamples(t){const e=[];for(let i=0;i<t;i++){const n=2.399963*i;let s=Math.sqrt(i+.5)/Math.sqrt(t);const a=s*Math.cos(n),o=s*Math.sin(n),l=Math.sqrt(1-(a*a+o*o));e.push(new z(a,o,l))}return e}generateDenoiseSamples(t,e){const i=2*Math.PI*e/t,n=1/t,s=n,a=[];let o=n,l=0;for(let c=0;c<t;c++)a.push(new ot(Math.cos(l),Math.sin(l)).multiplyScalar(Math.pow(o,.75))),o+=s,l+=i;return a}setSize(t,e){this.firstFrame(),this.width=t,this.height=e;const i=this.configuration.halfRes?.5:1;this.beautyRenderTarget.setSize(t,e),this.writeTargetInternal.setSize(t*i,e*i),this.readTargetInternal.setSize(t*i,e*i),this.accumulationRenderTarget.setSize(t*i,e*i),this.configuration.halfRes&&this.depthDownsampleTarget.setSize(t*i,e*i),this.configuration.transparencyAware&&(this.transparencyRenderTargetDWFalse.setSize(t,e),this.transparencyRenderTargetDWTrue.setSize(t,e))}firstFrame(){this.needsFrame=!0}render(t,e,i,n,s){t.capabilities.logarithmicDepthBuffer!==this.configuration.logarithmicDepthBuffer&&(this.configuration.logarithmicDepthBuffer=t.capabilities.logarithmicDepthBuffer,this.configureAOPass(this.configuration.logarithmicDepthBuffer,this.camera.isOrthographicCamera),this.configureDenoisePass(this.configuration.logarithmicDepthBuffer,this.camera.isOrthographicCamera),this.configureEffectCompositer(this.configuration.logarithmicDepthBuffer,this.camera.isOrthographicCamera)),this.detectTransparency(),this.camera.updateMatrixWorld(),this.lastViewMatrix.equals(this.camera.matrixWorldInverse)&&this.lastProjectionMatrix.equals(this.camera.projectionMatrix)&&this.configuration.accumulate&&!this.needsFrame?this.frame++:(this.configuration.accumulate&&(t.setRenderTarget(this.accumulationRenderTarget),t.clear(!0,!0,!0)),this.frame=0,this.needsFrame=!1),this.lastViewMatrix.copy(this.camera.matrixWorldInverse),this.lastProjectionMatrix.copy(this.camera.projectionMatrix);let a,o,l;this.debugMode&&(a=t.getContext(),o=a.getExtension("EXT_disjoint_timer_query_webgl2"),o===null&&(console.error("EXT_disjoint_timer_query_webgl2 not available, disabling debug mode."),this.debugMode=!1)),this.configuration.autoRenderBeauty&&(t.setRenderTarget(this.beautyRenderTarget),t.render(this.scene,this.camera),this.configuration.transparencyAware&&this.renderTransparency(t)),this.debugMode&&(l=a.createQuery(),a.beginQuery(o.TIME_ELAPSED_EXT,l));const c=t.xr.enabled;t.xr.enabled=!1,this._r.set(this.width,this.height);let h=this.configuration.aoRadius;if(this.configuration.halfRes&&this.configuration.screenSpaceRadius&&(h*=.5),this.frame<1024/this.configuration.aoSamples){this.configuration.halfRes&&(t.setRenderTarget(this.depthDownsampleTarget),this.depthDownsampleQuad.material.uniforms.sceneDepth.value=this.beautyRenderTarget.depthTexture,this.depthDownsampleQuad.material.uniforms.resolution.value=this._r,this.depthDownsampleQuad.material.uniforms.near.value=this.camera.near,this.depthDownsampleQuad.material.uniforms.far.value=this.camera.far,this.depthDownsampleQuad.material.uniforms.projectionMatrixInv.value=this.camera.projectionMatrixInverse,this.depthDownsampleQuad.material.uniforms.viewMatrixInv.value=this.camera.matrixWorld,this.depthDownsampleQuad.material.uniforms.logDepth.value=this.configuration.logarithmicDepthBuffer,this.depthDownsampleQuad.material.uniforms.ortho.value=this.camera.isOrthographicCamera,this.depthDownsampleQuad.render(t)),this.effectShaderQuad.material.uniforms.sceneDiffuse.value=this.beautyRenderTarget.texture,this.effectShaderQuad.material.uniforms.sceneDepth.value=this.configuration.halfRes?this.depthDownsampleTarget.textures[0]:this.beautyRenderTarget.depthTexture,this.effectShaderQuad.material.uniforms.sceneNormal.value=this.configuration.halfRes?this.depthDownsampleTarget.textures[1]:null,this.effectShaderQuad.material.uniforms.projMat.value=this.camera.projectionMatrix,this.effectShaderQuad.material.uniforms.viewMat.value=this.camera.matrixWorldInverse,this.effectShaderQuad.material.uniforms.projViewMat.value=this.camera.projectionMatrix.clone().multiply(this.camera.matrixWorldInverse.clone()),this.effectShaderQuad.material.uniforms.projectionMatrixInv.value=this.camera.projectionMatrixInverse,this.effectShaderQuad.material.uniforms.viewMatrixInv.value=this.camera.matrixWorld,this.effectShaderQuad.material.uniforms.cameraPos.value=this.camera.getWorldPosition(new z),this.effectShaderQuad.material.uniforms.biasAdjustment.value=new ot(this.configuration.biasOffset,this.configuration.biasMultiplier),this.effectShaderQuad.material.uniforms.resolution.value=this.configuration.halfRes?this._r.clone().multiplyScalar(.5).floor():this._r,this.effectShaderQuad.material.uniforms.time.value=performance.now()/1e3,this.effectShaderQuad.material.uniforms.samples.value=this.samples,this.effectShaderQuad.material.uniforms.bluenoise.value=this.bluenoise,this.effectShaderQuad.material.uniforms.radius.value=h,this.effectShaderQuad.material.uniforms.distanceFalloff.value=this.configuration.distanceFalloff,this.effectShaderQuad.material.uniforms.near.value=this.camera.near,this.effectShaderQuad.material.uniforms.far.value=this.camera.far,this.effectShaderQuad.material.uniforms.logDepth.value=t.capabilities.logarithmicDepthBuffer,this.effectShaderQuad.material.uniforms.ortho.value=this.camera.isOrthographicCamera,this.effectShaderQuad.material.uniforms.screenSpaceRadius.value=this.configuration.screenSpaceRadius,this.effectShaderQuad.material.uniforms.frame.value=this.frame,t.setRenderTarget(this.writeTargetInternal),this.effectShaderQuad.render(t);for(let u=0;u<this.configuration.denoiseIterations;u++)[this.writeTargetInternal,this.readTargetInternal]=[this.readTargetInternal,this.writeTargetInternal],this.poissonBlurQuad.material.uniforms.tDiffuse.value=this.readTargetInternal.texture,this.poissonBlurQuad.material.uniforms.sceneDepth.value=this.configuration.halfRes?this.depthDownsampleTarget.textures[0]:this.beautyRenderTarget.depthTexture,this.poissonBlurQuad.material.uniforms.projMat.value=this.camera.projectionMatrix,this.poissonBlurQuad.material.uniforms.viewMat.value=this.camera.matrixWorldInverse,this.poissonBlurQuad.material.uniforms.projectionMatrixInv.value=this.camera.projectionMatrixInverse,this.poissonBlurQuad.material.uniforms.viewMatrixInv.value=this.camera.matrixWorld,this.poissonBlurQuad.material.uniforms.cameraPos.value=this.camera.getWorldPosition(new z),this.poissonBlurQuad.material.uniforms.resolution.value=this.configuration.halfRes?this._r.clone().multiplyScalar(.5).floor():this._r,this.poissonBlurQuad.material.uniforms.time.value=performance.now()/1e3,this.poissonBlurQuad.material.uniforms.blueNoise.value=this.bluenoise,this.poissonBlurQuad.material.uniforms.radius.value=this.configuration.denoiseRadius*(this.configuration.halfRes?.5:1),this.poissonBlurQuad.material.uniforms.worldRadius.value=h,this.poissonBlurQuad.material.uniforms.distanceFalloff.value=this.configuration.distanceFalloff,this.poissonBlurQuad.material.uniforms.index.value=u,this.poissonBlurQuad.material.uniforms.poissonDisk.value=this.samplesDenoise,this.poissonBlurQuad.material.uniforms.near.value=this.camera.near,this.poissonBlurQuad.material.uniforms.far.value=this.camera.far,this.poissonBlurQuad.material.uniforms.logDepth.value=t.capabilities.logarithmicDepthBuffer,this.poissonBlurQuad.material.uniforms.screenSpaceRadius.value=this.configuration.screenSpaceRadius,t.setRenderTarget(this.writeTargetInternal),this.poissonBlurQuad.render(t);t.setRenderTarget(this.accumulationRenderTarget);const f=t.autoClear;t.autoClear=!1,this.accumulationQuad.material.uniforms.tDiffuse.value=this.writeTargetInternal.texture,this.accumulationQuad.material.uniforms.frame.value=this.frame,this.accumulationQuad.render(t),t.autoClear=f}this.configuration.transparencyAware&&(this.effectCompositerQuad.material.uniforms.transparencyDWFalse.value=this.transparencyRenderTargetDWFalse.texture,this.effectCompositerQuad.material.uniforms.transparencyDWTrue.value=this.transparencyRenderTargetDWTrue.texture,this.effectCompositerQuad.material.uniforms.transparencyDWTrueDepth.value=this.transparencyRenderTargetDWTrue.depthTexture,this.effectCompositerQuad.material.uniforms.transparencyAware.value=!0),this.effectCompositerQuad.material.uniforms.sceneDiffuse.value=this.beautyRenderTarget.texture,this.effectCompositerQuad.material.uniforms.sceneDepth.value=this.beautyRenderTarget.depthTexture,this.effectCompositerQuad.material.uniforms.aoTones.value=this.configuration.aoTones,this.effectCompositerQuad.material.uniforms.near.value=this.camera.near,this.effectCompositerQuad.material.uniforms.far.value=this.camera.far,this.effectCompositerQuad.material.uniforms.projectionMatrixInv.value=this.camera.projectionMatrixInverse,this.effectCompositerQuad.material.uniforms.viewMatrixInv.value=this.camera.matrixWorld,this.effectCompositerQuad.material.uniforms.logDepth.value=t.capabilities.logarithmicDepthBuffer,this.effectCompositerQuad.material.uniforms.ortho.value=this.camera.isOrthographicCamera,this.effectCompositerQuad.material.uniforms.downsampledDepth.value=this.configuration.halfRes?this.depthDownsampleTarget.textures[0]:this.beautyRenderTarget.depthTexture,this.effectCompositerQuad.material.uniforms.resolution.value=this._r,this.effectCompositerQuad.material.uniforms.blueNoise.value=this.bluenoise,this.effectCompositerQuad.material.uniforms.intensity.value=this.configuration.intensity,this.effectCompositerQuad.material.uniforms.renderMode.value=this.configuration.renderMode,this.effectCompositerQuad.material.uniforms.screenSpaceRadius.value=this.configuration.screenSpaceRadius,this.effectCompositerQuad.material.uniforms.radius.value=h,this.effectCompositerQuad.material.uniforms.distanceFalloff.value=this.configuration.distanceFalloff,this.effectCompositerQuad.material.uniforms.gammaCorrection.value=this.configuration.gammaCorrection,this.effectCompositerQuad.material.uniforms.tDiffuse.value=this.accumulationRenderTarget.texture,this.effectCompositerQuad.material.uniforms.color.value=this._c.copy(this.configuration.color).convertSRGBToLinear(),this.effectCompositerQuad.material.uniforms.colorMultiply.value=this.configuration.colorMultiply,this.effectCompositerQuad.material.uniforms.cameraPos.value=this.camera.getWorldPosition(new z),this.effectCompositerQuad.material.uniforms.fog.value=!!this.scene.fog,this.scene.fog&&(this.scene.fog.isFog?(this.effectCompositerQuad.material.uniforms.fogExp.value=!1,this.effectCompositerQuad.material.uniforms.fogNear.value=this.scene.fog.near,this.effectCompositerQuad.material.uniforms.fogFar.value=this.scene.fog.far):this.scene.fog.isFogExp2?(this.effectCompositerQuad.material.uniforms.fogExp.value=!0,this.effectCompositerQuad.material.uniforms.fogDensity.value=this.scene.fog.density):console.error(`Unsupported fog type ${this.scene.fog.constructor.name} in SSAOPass.`)),t.setRenderTarget(this.renderToScreen?null:e),this.effectCompositerQuad.render(t),this.debugMode&&(a.endQuery(o.TIME_ELAPSED_EXT),$u(l,a,this)),t.xr.enabled=c}enableDebugMode(){this.debugMode=!0}disableDebugMode(){this.debugMode=!1}setDisplayMode(t){this.configuration.renderMode=["Combined","AO","No AO","Split","Split AO"].indexOf(t)}setQualityMode(t){t==="Performance"?(this.configuration.aoSamples=8,this.configuration.denoiseSamples=4,this.configuration.denoiseRadius=12):t==="Low"?(this.configuration.aoSamples=16,this.configuration.denoiseSamples=4,this.configuration.denoiseRadius=12):t==="Medium"?(this.configuration.aoSamples=16,this.configuration.denoiseSamples=8,this.configuration.denoiseRadius=12):t==="High"?(this.configuration.aoSamples=64,this.configuration.denoiseSamples=8,this.configuration.denoiseRadius=6):t==="Ultra"&&(this.configuration.aoSamples=64,this.configuration.denoiseSamples=16,this.configuration.denoiseRadius=6)}}const Pv={uniforms:{tDiffuse:{value:null},uDesat:{value:0},uVignette:{value:.35},uRed:{value:0},uFade:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }",fragmentShader:`uniform sampler2D tDiffuse; uniform float uDesat, uVignette, uRed, uFade; varying vec2 vUv;
    void main(){ vec4 c = texture2D(tDiffuse, vUv); float l = dot(c.rgb, vec3(0.299,0.587,0.114)); c.rgb = mix(c.rgb, vec3(l), uDesat);
      vec2 q = vUv - 0.5; float v = 1.0 - smoothstep(0.35, 0.95, length(q) * 1.15) * uVignette; c.rgb *= v;
      c.rgb = mix(c.rgb, vec3(0.6, 0.02, 0.02), uRed * smoothstep(0.2, 0.8, length(q)));
      c.rgb *= 1.0 - uFade; gl_FragColor = c; }`},zv={uniforms:{tDiffuse:{value:null},uTexel:{value:new ot(1/1280,1/720)},uSharp:{value:.35}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }",fragmentShader:`uniform sampler2D tDiffuse; uniform vec2 uTexel; uniform float uSharp; varying vec2 vUv;
    void main(){
      vec3 c = texture2D(tDiffuse, vUv).rgb;
      vec3 n = texture2D(tDiffuse, vUv + vec2(uTexel.x, 0.0)).rgb;
      vec3 s = texture2D(tDiffuse, vUv - vec2(uTexel.x, 0.0)).rgb;
      vec3 e = texture2D(tDiffuse, vUv + vec2(0.0, uTexel.y)).rgb;
      vec3 w = texture2D(tDiffuse, vUv - vec2(0.0, uTexel.y)).rgb;
      vec3 mn = min(min(n, s), min(e, w)), mx = max(max(n, s), max(e, w));
      float contrast = clamp(length(mx - mn) * 4.0, 0.0, 1.0);
      vec3 avg = (n + s + e + w) * 0.25;
      vec3 sharp = clamp(c + (c - avg) * 2.0, 0.0, 8.0);
      gl_FragColor = vec4(mix(c, sharp, uSharp * contrast), 1.0);
    }`},Fo=[{id:"off",label:"Off (native)",scale:1,sharp:0},{id:"quality",label:"Quality",scale:.67,sharp:.35},{id:"balanced",label:"Balanced",scale:.59,sharp:.45},{id:"performance",label:"Performance",scale:.5,sharp:.55}];class Dv{constructor(t,e){this.renderer=t,this.canvas=e,this.scene=new $g,this.camera=new fi(62,innerWidth/innerHeight,.3,3e3),this.input=new R1(e),this.time=0,this.dayFrac=Eh.START,this.night=0,this.paused=!0,this.slowmo=1,this.vehicles=[],this.peds=[],this.mapId="fable",this.city=new Ih(this.scene,this.mapId),this.world={hash:this.city.hash,ground:(n,s)=>this.city.groundHeight(n,s),surface:(n,s,a)=>this.city.surfaceHeight(n,s,a),isWater:(n,s)=>this.city.isWater(n,s),onRoad:(n,s)=>this.city.onRoad(n,s)},this.env=new _1(this.scene,t),this.env.setVibe(this.mapId),this.effects=new E1(this.scene),this.audio=new A1,this.rig=new P1(this.camera,this.city),this.player=new q1(this),this.hud=new vv(this),this.traffic=new ev(this),this.police=new rv(this),this.pedsMgr=new X1(this),this.pickups=new lv(this),this.missions=new fv(this),this.barrels=[],this.projectiles=new G1(this),this.aimTarget=null,this.stores=new yv(this),this.travel=new Mv(this),this.buildBarrels(),this.headlights=[];for(let n=0;n<2;n++){const s=new Fx(16773584,0,45,.55,.5,1.2);s.position.set(0,-100,0),this.scene.add(s,s.target),this.headlights.push(s)}this.sirenLights=[];for(let n=0;n<2;n++){const s=new wr(16724016,0,18,1.5);s.position.set(0,-100,0),this.scene.add(s),this.sirenLights.push(s)}const i=new Vs(.22,.7,4);i.rotateX(Math.PI/2),this.guideArrow=new N(i,new re({color:16765514,toneMapped:!1,transparent:!0,opacity:.9})),this.guideArrow.visible=!1,this.scene.add(this.guideArrow),this.guide=null,this.traffic.spawnParked(),this.spawnSpecialVehicles(),this.placeAtSpawn(),this.hospital=this.mapHospital(),this.station={x:this.missions.markers[4].x-6,z:this.missions.markers[4].z,h:0},this.setupPost(),this.respawnT=0,this.wastedT=0,this.fade=0,addEventListener("resize",()=>this.resize()),this.hud.notify(pr[this.mapId].welcome,5e3),this.input.onPadChange=(n,s)=>{this.hud.notify(n?`🎮 Gamepad connected${s?": "+s.slice(0,32):""} — left stick moves, right stick looks, RT/LT fire+aim / gas+brake`:"🎮 Gamepad disconnected",4e3),n&&this.input.rumble(.5,.5,150)}}setupPost(){const t=this.renderer,e=new ot;t.getSize(e),this.basePR=t.getPixelRatio(),this.composer=new qx(t);const i=t.getPixelRatio();this.renderPass=new Yx(this.scene,this.camera),this.renderPass.enabled=!1,this.composer.addPass(this.renderPass),this.ao=new Rv(this.scene,this.camera,e.x*i,e.y*i),this.aoLevels=[{aoRadius:0,distanceFalloff:.5,intensity:0,aoSamples:8,denoiseSamples:4,denoiseRadius:12,halfRes:!0,gammaCorrection:!1,screenSpaceRadius:!1},{aoRadius:1.6,distanceFalloff:.6,intensity:4,aoSamples:12,denoiseSamples:6,denoiseRadius:12,halfRes:!0,gammaCorrection:!1,screenSpaceRadius:!1},{aoRadius:2.4,distanceFalloff:.5,intensity:7,aoSamples:16,denoiseSamples:8,denoiseRadius:12,halfRes:!0,gammaCorrection:!1,screenSpaceRadius:!1}],this.aoLevel=2,this.aoEnabled=!0,Object.assign(this.ao.configuration,this.aoLevels[this.aoLevel]),this.composer.addPass(this.ao),this.bloom=new ks(new ot(e.x,e.y),.45,.6,.92),this.composer.addPass(this.bloom),this.sharpen=new Cl(zv),this.composer.addPass(this.sharpen),this.grade=new Cl(Pv),this.composer.addPass(this.grade),this.composer.addPass(new jx),this.upscaleIdx=0,this.applyUpscale()}resize(){this.camera.aspect=innerWidth/innerHeight,this.camera.updateProjectionMatrix(),this.renderer.setSize(innerWidth,innerHeight),this.applyUpscale()}setAOLevel(t){this.aoLevel=t,this.aoEnabled=t>0,this.ao.enabled=t>0,this.renderPass.enabled=t===0,t>0&&Object.assign(this.ao.configuration,this.aoLevels[t])}setAO(t){this.setAOLevel(t?1:0)}cycleAO(){this.setAOLevel((this.aoLevel+1)%3),this.hud.notify("Ambient occlusion "+["off","balanced","high"][this.aoLevel],1200)}applyUpscale(){const t=Fo[this.upscaleIdx];this.composer.setPixelRatio(this.basePR*t.scale),this.composer.setSize(innerWidth,innerHeight);const e=new ot;this.renderer.getSize(e);const i=Math.max(1,Math.floor(e.x*this.basePR*t.scale)),n=Math.max(1,Math.floor(e.y*this.basePR*t.scale));this.sharpen.uniforms.uTexel.value.set(1/i,1/n),this.sharpen.uniforms.uSharp.value=t.sharp,this.sharpen.enabled=t.sharp>0}cycleUpscale(){this.upscaleIdx=(this.upscaleIdx+1)%Fo.length,this.applyUpscale();const t=Fo[this.upscaleIdx];this.hud.notify(`Upscaler: ${t.label} (renders at ${Math.round(t.scale*100)}%)`,1500)}buildBarrels(){const t=this.city.rng,e=new jt(.42,.42,1.1,12),i=new pt({color:12597547,roughness:.5,metalness:.4}),n=new jt(.43,.43,.08,12),s=new pt({color:15658734,roughness:.5}),a=[];for(const o of this.city.blocks)if(o.type==="industrial")for(let l=0;l<4;l++)a.push([t.range(o.x0+3,o.x1-3),t.range(o.z0+3,o.z1-3)]);else if(o.type==="lot")for(let l=0;l<3;l++)a.push([t.range(o.x0+2,o.x1-2),t.range(o.z1-8,o.z1-2)]);else t.chance(.25)&&a.push([t.chance(.5)?o.x0-1.5:o.x1+1.5,t.range(o.z0+2,o.z1-2)]);for(const[o,l]of a){if(this.city.hash.query(o-.6,o+.6,l-.6,l+.6,[]).some(m=>m.kind==="building"))continue;const c=new N(e,i),h=this.city.groundHeight(o,l);c.position.set(o,h+.55,l),c.castShadow=!0,this.scene.add(c);const f=new N(n,s);f.position.y=.2,c.add(f);const u=f.clone();u.position.y=-.2,c.add(u);const d={x:o,y:h,z:l,mesh:c,health:30,dead:!1,hurt:(m,v)=>{d.dead||(d.health-=m,v&&(d.lastSource=v),d.health<=0&&this.explodeBarrel(d))}};d.collider=this.city.addCollider(o-.42,l-.42,o+.42,l+.42,"prop",1.1),this.barrels.push(d)}}explodeBarrel(t){if(t.dead)return;t.dead=!0,this.scene.remove(t.mesh),t.collider.disabled=!0,this.effects.explosion(t.x,t.y,t.z,.8),this.audio.explosion(),this.rig.addShake(Yt(1.2-yt(t.x,t.z,this.player.x,this.player.z)/35,0,1));const e=t.lastSource||t;t.byPlayer=e.kind==="player",setTimeout(()=>this.explodeAt(t.x,t.y,t.z,7,t.byPlayer?this.player:t),0);for(const i of this.barrels)i!==t&&!i.dead&&yt(i.x,i.z,t.x,t.z)<8&&(i.lastSource=t.lastSource);this.pedsMgr.panicAround(t.x,t.z,40,6)}spawnSpecialVehicles(){const t=this.city,e=(l,c,h,f,u,d,m=72)=>{if(t.isWater(c,h))return null;const v=an[l]||an.sedan,g=Math.max(v.len,v.wid)/2+1,p=(_,E)=>{for(let T=8;T<=m;T+=4){const S=_+Math.sin(f)*T,R=E+Math.cos(f)*T;if(t.isWater(S,R)||t.hash.query(S-3,S+3,R-3,R+3,[]).some(I=>I.kind==="building"||I.kind==="prop"||I.kind==="tree"||I.kind==="pole"))return!1}return!0};let M=c,w=h,x=!1;const y=(_,E)=>!this.vehicles.some(T=>{const S=T.type||{};return Math.hypot(T.x-_,T.z-E)<Math.max(S.len||4,S.wid||2)/2+Math.max(v.len,v.wid)/2+3});for(const[_,E]of[[0,0],[8,0],[-8,0],[0,8],[0,-8],[16,0],[-16,0],[0,16],[0,-16],[24,0],[-24,0]]){const T=c+_,S=h+E;if(t.isWater(T,S))continue;if(!t.hash.query(T-g,T+g,S-g,S+g,[]).some(I=>I.kind==="building"||I.kind==="prop"||I.kind==="tree"||I.kind==="pole")&&y(T,S)&&(!d||p(T,S))){M=T,w=S,x=!0;break}}if(!x)return null;const b=this.addVehicle(l,M,w,f,u);return b.isParked=!0,b.control="none",b};for(const l of t.blocks.filter(c=>c.type==="airport"&&c.helipad))e("heli",l.helipad.x,l.helipad.z,.6);for(const l of t._airportRegions||[]){const c=t.blocks.find(f=>f.type==="airport"&&f.region===l);if(!c)continue;const h=(f,u,d,m)=>{for(const v of[0,Math.PI/2,Math.PI,-Math.PI/2,.6,-.6,2.2,-2.2])if(e(f,u,d,v,void 0,!0,m))return!0;return!1};h("dodo",c.x0+35,c.cz+5,60)||h("dodo",c.cx,c.cz,60),h("shamal",c.x0+30,c.cz-10,50)||h("shamal",c.cx,c.cz,50),e("tug",c.cx+8,c.cz+16,2.2)}let i=0,n=0,s=0,a=0,o=0;for(const l of t.blocks)(l.type==="docks"||l.type==="industrial")&&i<3&&e("forklift",l.cx+6,l.cz-4,1.2)&&i++,l.type==="park"&&n<2&&e("mower",l.cx+5,l.cz+5,2.4)&&n++,l.type==="beach"&&s<2&&e("icecream",l.cx-6,l.cz,.3)&&s++,l.type==="downtown"&&a<1&&e("limo",l.x1-8,l.cz,Math.PI/2)&&a++,l.type==="commercial"&&o<1&&e("securicar",l.cx,l.cz+8,0)&&o++}findClearSpot(t,e){const i=this.city;let n=null,s=-1;for(let a=t.x0+4;a<=t.x1-4;a+=5)for(let o=t.z0+4;o<=t.z1-4;o+=5){if(i.isWater(a,o)||i.hash.query(a-e,a+e,o-e,o+e,[]).some(c=>c.kind==="building"||c.kind==="prop")||this.vehicles.some(c=>Math.hypot(c.x-a,c.z-o)<12))continue;const l=Math.min(a-t.x0,t.x1-a,o-t.z0,t.z1-o);l>s&&(s=l,n={x:a,z:o})}return n}mapBlock(t,e){return this.city.blocks.find(i=>i.i===t&&i.j===e)}placeAtSpawn(t=!0){const e=pr[this.mapId].spawn,i=this.mapBlock(e.block[0],e.block[1]);if(this.player.setPosition(i.x0+e.dx,i.z1+e.dz,Math.PI),t){const n=this.addVehicle("sedan",i.x0+e.carDx,i.z1+e.carDz,Math.PI/2,12597547);n.isParked=!0}this.rig.snapBehind(this.player.heading),this.rig.pos.set(this.player.x,3,this.player.z+6)}mapHospital(){const t=pr[this.mapId].hospital.block,e=this.mapBlock(t[0],t[1]);return{x:e.x1+1.5,z:e.cz,h:Math.PI/2}}flyTo(t){const e=this.player;if(e.vehicle){const n=e.vehicle;e.exitVehicle(!0),this.removeVehicle(n)}this.police.clear();for(const n of[...this.police.copCars])this.removeVehicle(n);this.police.heli=null;for(let n=this.police.cops.length-1;n>=0;n--){const s=this.police.cops[n],a=this.peds.indexOf(s);a>=0&&this.peds.splice(a,1),s.dispose()}this.police.cops.length=0;for(const n of[...this.vehicles])this.removeVehicle(n);for(const n of[...this.peds]){if(n.store)continue;const s=this.peds.indexOf(n);s>=0&&this.peds.splice(s,1),n.dispose()}for(const n of this.barrels)this.scene.remove(n.mesh);this.barrels.length=0,this.pickups.clearAll();for(const n of this.projectiles.list)this.scene.remove(n.m);this.projectiles.list.length=0,this.missions.disposeForMap(),this.stores.disposeExteriors(),this.stores.interior=null,this.stores.shopOpen=null,this.travel.disposeRings(),this.city.dispose(),this.mapId=t,this.city=new Ih(this.scene,t),this.env.setVibe(t),this.world={hash:this.city.hash,ground:(n,s)=>this.city.groundHeight(n,s),surface:(n,s,a)=>this.city.surfaceHeight(n,s,a),isWater:(n,s)=>this.city.isWater(n,s),onRoad:(n,s)=>this.city.onRoad(n,s)},this.rig.city=this.city,this.missions.buildForMap(),this.stores.buildForMap(),this.travel.buildRings(),this.traffic.spawnParked(),this.spawnSpecialVehicles(),this.buildBarrels(),this.pickups.seed();const i=this.city.airports[0];e.setPosition(i.x,i.z+5,0),e.stamina=1,e.exhaustT=0,e.aiming=!1,this.rig.snapBehind(e.heading),this.rig.pos.set(e.x,3,e.z+6),this.hospital=this.mapHospital(),this.station={x:this.missions.markers[4].x-6,z:this.missions.markers[4].z,h:0},this.hud.buildMapImage(),this.hud.bigBase=null,this.hud.setObjective(null),this.hud.setTimer(null),this.guideArrow.visible=!1}addVehicle(t,e,i,n,s){const a=new Z1(t,s);return a.world=this.world,a.setPosition(e,i,n),a.y=this.city.groundHeight(e,i),a.syncMesh(),this.scene.add(a.group),this.vehicles.push(a),a.onExploded=()=>this.onVehicleExploded(a),a.onDamaged=(o,l)=>{a.driver===this.player&&l!=="bullet"&&this.rig.addShake(Math.min(.8,o/30))},a.onDestroyed=o=>{o!=="explode"&&a.lastDamage?.byPlayer&&a.control!=="player"&&this.police.crime("destroy_vehicle",a.x,a.z)},a}removeVehicle(t){const e=this.vehicles.indexOf(t);if(e>=0&&this.vehicles.splice(e,1),t.driver&&t.driver!==this.player){const i=t.driver;i.vehicle=null;const n=this.peds.indexOf(i);n>=0&&this.peds.splice(n,1);const s=this.police.cops.indexOf(i);s>=0&&this.police.cops.splice(s,1),i.dispose()}this.traffic.release(t),this.police.release(t),t.dispose()}crime(t,e,i){this.police.crime(t,e,i),this.player.lastCrimeT=this.time}notify(t,e){this.hud.notify(t,e)}noise(t,e,i,n){(n===this.player||n?.kind==="player")&&this.pedsMgr.panicAround(t,e,i,6)}hornAt(t){yt(t.x,t.z,this.player.x,this.player.z)<60&&this.audio.ready&&this.audio.tone(380+Math.random()*80,.35,.08,"square")}onPedKilled(t,e){const i=e===this.player||e?.driver===this.player||e?.kind==="player";t.kind==="cop"?(this.police.onCopKilled(t,e),i&&this.player.stats.kills++):i&&(this.crime("kill_ped",t.x,t.z),this.player.stats.kills++),t.money>0&&Math.random()<.7&&this.pickups.add("money",t.x+(Math.random()-.5),t.z+(Math.random()-.5),!0,t.money),this.pedsMgr.panicAround(t.x,t.z,25,7)}onVehicleExploded(t){this.effects.explosion(t.x,t.y,t.z,t.type.mass>1800?1.3:1),this.audio.explosion();const e=yt(t.x,t.z,this.player.x,this.player.z);this.rig.addShake(Yt(1.5-e/40,0,1.2)),this.explodeAt(t.x,t.y,t.z,9,t),this.pedsMgr.panicAround(t.x,t.z,60,8),t.lastDamage?.byPlayer&&t.control!=="player"&&this.crime("explosion",t.x,t.z)}explodeAt(t,e,i,n,s,a=!1){for(const l of this.barrels)l!==s&&!l.dead&&yt(l.x,l.z,t,i)<n+1&&setTimeout(()=>this.explodeBarrel(l),120+Math.random()*250);for(const l of this.peds){const c=yt(l.x,l.z,t,i);c<n&&!l.dead&&l.knock((l.x-t)/(c+.1)*8,(l.z-i)/(c+.1)*8,200,s)}const o=yt(this.player.x,this.player.z,t,i);o<n&&(this.player.vehicle?this.player.vehicle.damage(60*(1-o/n),"explosion",s):this.player.knock((this.player.x-t)/(o+.1)*7,(this.player.z-i)/(o+.1)*7,110*(1-o/(n*1.1))));for(const l of this.vehicles){if(l===s)continue;const c=yt(l.x,l.z,t,i);c<n+2&&(l.damage(70*(1-c/(n+2)),"explosion",s),l.vy+=3*(1-c/(n+2)),l.vx+=(l.x-t)/(c+.1)*4,l.vz+=(l.z-i)/(c+.1)*4)}}onEnterVehicle(t){this.hud.notify(t.type.cop?"Police vehicle — press R for radio":`${t.typeName[0].toUpperCase()+t.typeName.slice(1)} — press R for radio, H for horn`,2200)}onExitVehicle(t){}onPlayerWasted(){this.hud.showBanner("WASTED","","#ff4040",5e3),this.audio.wasted(),this.respawnT=5,this.respawnKind="hospital",this.audio.setRadio(!1)}onPlayerBusted(){this.hud.showBanner("BUSTED","","#6a8cff",5e3),this.audio.wasted(),this.respawnT=5,this.respawnKind="station",this.audio.setRadio(!1)}doRespawn(){const t=this.player;this.stores.interior&&(this.stores.interior=null,this.stores.closeShop(),this.stores.cooldown=1.2);const e=Math.floor(t.money*.1);if(t.money-=e,e>0&&this.hud.moneyPop(-e),this.respawnKind==="station")for(const n in t.ammo)t.ammo[n]=Math.floor(t.ammo[n]/2);const i=this.respawnKind==="station"?this.station:this.hospital;t.respawn(i.x,i.z,i.h),t.armor=0,this.police.clear();for(const n of[...this.police.copCars])this.police.copCars.splice(0),this.removeVehicle(n);for(let n=this.police.cops.length-1;n>=0;n--){const s=this.police.cops[n],a=this.peds.indexOf(s);a>=0&&this.peds.splice(a,1),s.dispose()}this.police.cops.length=0,this.hud.notify(this.respawnKind==="station"?"Released from custody. Half your ammo was confiscated.":"Discharged from hospital.",4e3)}update(t){const e=Math.min(t,.03333333333333333)*this.slowmo,i=this.input,n=this.player;if(i.pollGamepad(),i.hit("help")&&this.hud.toggleHelp(),i.hit("map")&&this.hud.toggleMap(),this.hud.mapOpen){this.hud.update(e),i.endFrame();return}i.hit("skiptime")&&(this.dayFrac=(this.dayFrac+.1)%1,this.hud.notify("Time skipped",1e3)),i.hitCode("KeyR")&&!n.vehicle&&this.audio.ready,this.time+=e,this.dayFrac=(this.dayFrac+e/Eh.LENGTH)%1,this.night=this.env.update(this.dayFrac,new z(n.x,0,n.z)),this.city.update(e,this.time,this.night,this.env),this.respawnT>0&&(this.respawnT-=e,this.respawnT<=0&&this.doRespawn()),n.update(e),this.traffic.update(e),this.police.update(e),this.pedsMgr.update(e);for(const u of this.vehicles)if(!(u.isParked&&!u.driver&&u.absSpeed<.01&&!u.lastCarHit&&!u.onFire)&&(u.update(e,this.world),u.lastHit&&u.lastHit.impact>3)){const d=yt(u.x,u.z,n.x,n.z);d<80&&this.audio.crash(u.lastHit.impact*Yt(1-d/80,.2,1)),this.effects.sparks(u.x+u.lastHit.nx*-u.halfL*.5,u.y+.5,u.z+u.lastHit.nz*-u.halfL*.5,6),u.driver===n&&(this.rig.addShake(Math.min(1,u.lastHit.impact/12)),i.rumble(Math.min(1,u.lastHit.impact/14),.4,130))}for(let u=0;u<this.vehicles.length;u++)for(let d=u+1;d<this.vehicles.length;d++){const m=this.vehicles[u],v=this.vehicles[d];if(m.isParked&&v.isParked)continue;const g=K1(m,v);if(g>2.5){const p=yt(m.x,m.z,n.x,n.z);p<80&&this.audio.crash(g*Yt(1-p/80,.2,1)),this.effects.sparks((m.x+v.x)/2,.6,(m.z+v.z)/2,8),m.isParked&&(m.isParked=!1),v.isParked&&(v.isParked=!1);const M=n.vehicle;if(M===m||M===v){const w=M===m?v:m;this.rig.addShake(Math.min(1,g/10)),i.rumble(Math.min(1,g/12),.4,120),w.type.cop&&w.control==="cop"&&this.police.noteRam(),w.ai&&(w.ai.scared=Math.max(w.ai.scared,4))}m.ai&&!m.ai.scared&&(m.ai.honkT=0)}}const s=new z;for(const u of this.vehicles){if(yt(u.x,u.z,n.x,n.z)>140)continue;(u.health<55||u.destroyed)&&(u.hood.getWorldPosition(s),this.effects.carSmoke(s,u.destroyed?.35:Yt((55-u.health)/40,.1,.9))),u.onFire&&(u.hood.getWorldPosition(s),this.effects.carFire(s)),u.destroyed&&Math.random()<.3&&this.effects.carFire(u.group.position.clone().add(new z((Math.random()-.5)*2,.6,(Math.random()-.5)*3)));const m=Math.sin(u.heading),v=Math.cos(u.heading),g=u.vx*v-u.vz*m,p=u.absSpeed,M=Math.abs(g)>3.5&&p>4||u.handbrake&&p>5||u.braking&&p>14&&u.brake>.8;if(u.skidLevel=se(u.skidLevel||0,M?1:0,10,e),M&&this.city.onRoad(u.x,u.z)){const w=u.wheelbase/2,x=u.vx/p,y=u.vz/p;for(const b of[-1,1]){const _=u.x-m*w+v*b*(u.halfW-.15),E=u.z-v*w-m*b*(u.halfW-.15);this.effects.skid(_,E,u.y+.02,x,y,.25,Yt(Math.abs(g)/8+(u.handbrake?.4:0),.3,.9))}Math.random()<.5&&this.effects.puff(u.x-m*w,u.y+.2,u.z-v*w,1,.8)}}if(this.pickups.update(e),this.missions.update(e),this.stores.update(e),this.projectiles.update(e),this.travel.update(e)){i.endFrame();return}if((this._gcT=(this._gcT||0)+e)>2){this._gcT=0;for(let u=this.vehicles.length-1;u>=0;u--){const d=this.vehicles[u];!d.driver&&!d.mission&&d!==n.vehicle&&(d.abandoned||d.destroyed&&d.control==="none")&&yt(d.x,d.z,n.x,n.z)>180&&this.removeVehicle(d)}}this.effects.update(e),i.hit("ao")&&this.cycleAO(),i.hit("upscale")&&this.cycleUpscale();const a=n.vehicle?n.vehicle.type.fly?"air":"car":n.aiming?"aim":"foot";i.hit("camera")&&this.rig.snapBehind(n.heading);const o=n.vehicle?{x:n.vehicle.x,y:n.vehicle.y+.3,z:n.vehicle.z}:{x:n.x,y:n.y,z:n.z},l=n.vehicle&&n.vehicle.absSpeed>1?Math.atan2(n.vehicle.vx,n.vehicle.vz):n.heading,c=n.vehicle?n.vehicle.speed<-1?n.vehicle.heading:l:n.heading;this.rig.update(e,i,o,n.heading,n.absSpeed,a,c);const h=n.dead||n.busted;this.grade.uniforms.uDesat.value=se(this.grade.uniforms.uDesat.value,h?.85:0,3,e),this.grade.uniforms.uRed.value=se(this.grade.uniforms.uRed.value,n.damageFlash*.5+(n.health<25&&!h?.18:0),8,e),this.grade.uniforms.uFade.value=se(this.grade.uniforms.uFade.value,this.respawnT>0&&this.respawnT<1.2?1:0,6,e),this.bloom.strength=.35+this.night*.35;const f=this.missions.blips();for(const u of this.police.copCars)u.destroyed||f.push({x:u.x,z:u.z,color:"#4d7cff",kind:"cop",size:6});for(const u of this.police.cops)!u.vehicle&&!u.dead&&f.push({x:u.x,z:u.z,color:"#4d7cff",kind:"cop",size:5});for(const u of this.pickups.items)u.active&&yt(u.x,u.z,n.x,n.z)<90&&f.push({x:u.x,z:u.z,color:u.cat==="health"?"#ff5050":u.cat==="armor"?"#5090ff":u.cat==="money"?"#50ff80":"#ffffff",kind:"pickup",size:3});for(const u of this.stores.stores)f.push({x:u.doorX,z:u.doorZ,color:u.color,kind:"store",size:7,label:u.kind==="gun"?"A":u.kind==="food"?"B":u.kind==="clothes"?"T":"S"});for(const u of this.peds)u.kind==="gang"&&u.hostile&&!u.dead&&f.push({x:u.x,z:u.z,color:"#ff3030",kind:"cop",size:5});if(this.hud.blips=f,this.updateGuide(e,f),this.updateVehicleLights(),!n.vehicle&&!n.dead&&!this.missions.active&&!this.stores.interior){const u=n.nearestVehicle(4.5),d=n.nearestPed(2.6),m=i.gamepadConnected;u?this.hud.setHint(u.driver&&u.driver!==n?m?"Press Y to jack the car":"Press F to jack the car":m?"Press Y to enter":"Press F to enter"):d&&n.talkT<=0?this.hud.setHint(m?"Press X to talk":"Press E to talk"):this.missions.markers.some(v=>yt(n.x,n.z,v.x,v.z)<12)||this.hud.setHint("")}else n.vehicle&&this.hud.setHint("");n.talkT=Math.max(0,n.talkT-e),this.hud.update(e),this.updateAudio(e),i.endFrame()}updateGuide(t,e){const i=this.player;let n=null,s=null;if(this.missions.active)n=e.find(l=>l.guide)||null;else if(!this.stores.interior){let l=1/0;for(const c of this.missions.markers){const h=yt(c.x,c.z,i.x,i.z);h<l&&(l=h,n=c)}n&&(s=`Nearest mission: ${n.name} · ${Math.round(l)} m — walk into the yellow marker (M for map)`)}if(this.guide=n,s!==null&&!this.missions.active&&this.hud.setObjective(s,!0),!n||i.dead){this.guideArrow.visible=!1;return}const a=yt(n.x,n.z,i.x,i.z);this.guideArrow.visible=a>6;const o=(i.vehicle?i.vehicle.y+2.6:i.y+3.1)+Math.sin(this.time*4)*.12;this.guideArrow.position.set(i.x,o,i.z),this.guideArrow.lookAt(n.x,o,n.z),this.guideArrow.rotation.z+=this.time*2,this.missions.active&&this.hud.setDistance(a)}updateVehicleLights(){const t=this.player,e=t.vehicle,i=e&&e.lightsOn&&!e.destroyed;this.headlights.forEach((s,a)=>{if(!i){s.intensity=0;return}const o=Math.sin(e.heading),l=Math.cos(e.heading),c=a===0?-1:1,h=l*c*(e.halfW-.35),f=-o*c*(e.halfW-.35);s.position.set(e.x+o*e.halfL+h,e.y+e.headY,e.z+l*e.halfL+f),s.target.position.set(e.x+o*(e.halfL+14)+h*2,e.y-.3,e.z+l*(e.halfL+14)+f*2),s.intensity=60});const n=this.police.copCars.filter(s=>s.sirenOn&&!s.destroyed).sort((s,a)=>yt(s.x,s.z,t.x,t.z)-yt(a.x,a.z,t.x,t.z));this.sirenLights.forEach((s,a)=>{const o=n[a];if(!o){s.intensity=0;return}s.position.set(o.x,o.y+(o.sirenY||1.8),o.z),s.color.setHex(o.sirenPhase?16724016:3170559),s.intensity=25})}updateAudio(t){const e=this.audio,i=this.player;if(!e.ready)return;const n=i.vehicle;if(n&&!n.destroyed){const a=Yt(n.absSpeed/n.type.maxSpeed,0,1),o=Math.min(4,Math.floor(a*5)),l=Yt((a*5-o)*.7+.2+n.throttle*.15,0,1);e.setEngine(!0,l,n.throttle,a,n.skidLevel||0)}else e.setEngine(!1,0,0,0,0);let s=0;for(const a of this.police.copCars)a.sirenOn&&(s=Math.max(s,Yt(1-yt(a.x,a.z,i.x,i.z)/130,0,1)));e.setSiren(s,t),e.updateRadio()}render(){this.composer.render()}}class Lv{constructor(t){this.game=t,this.started=!1,this.returnTo="main";const e=this.root=document.createElement("div");e.id="menu",e.innerHTML=`
      <div class="menu-panel" data-screen="main">
        <h1>FABLE CITY</h1>
        <div class="menu-sub">FABLE CITY &nbsp;·&nbsp; LIBERTY CITY &nbsp;·&nbsp; VICE CITY</div>
        <button data-act="start">START GAME</button>
        <button data-act="settings">SETTINGS</button>
        <button data-act="controls">CONTROLS</button>
        <div class="menu-foot">WASD move · F enter car · F1 help in game</div>
      </div>
      <div class="menu-panel" data-screen="pause" style="display:none">
        <h1>PAUSED</h1>
        <div class="menu-sub">take a break, criminal</div>
        <button data-act="resume">RESUME</button>
        <button data-act="settings">SETTINGS</button>
        <button data-act="quit">QUIT TO MAIN MENU</button>
      </div>
      <div class="menu-panel" data-screen="settings" style="display:none">
        <h1>SETTINGS</h1>
        <div class="menu-sub">quality — starts at max, never changes itself</div>
        <div class="set-row"><span>AMBIENT OCCLUSION</span><div class="seg" id="seg-ao"></div></div>
        <div class="set-row"><span>UPSCALER</span><div class="seg" id="seg-up"></div></div>
        <div class="set-note">Upscaler renders below native resolution and reconstructs with sharpening. Off = native (sharpest).</div>
        <button data-act="back">BACK</button>
      </div>
      <div class="menu-panel" data-screen="controls" style="display:none">
        <h1>CONTROLS</h1>
        <div class="menu-sub">full list under F1 in game</div>
        <div class="controls-list">
          <div><b>WASD</b> move · <b>Shift</b> sprint · <b>Space</b> jump / handbrake · <b>Mouse</b> look</div>
          <div><b>F</b> enter / exit vehicle · <b>LMB</b> fire · <b>RMB</b> aim · <b>1-6 / Q</b> weapons</div>
          <div><b>E</b> talk / shop · <b>H</b> horn · <b>R</b> radio · <b>M</b> map · <b>T</b> skip time</div>
          <div><b>O</b> ambient occlusion · <b>U</b> upscaler · <b>Esc</b> pause</div>
          <div>🚁 <b>Heli</b>: W climb · S descend · A/D yaw · Space hover brake</div>
          <div>✈ <b>Plane</b>: W throttle · S slow · Space pull up · A/D bank</div>
        </div>
        <button data-act="back">BACK</button>
      </div>`,document.body.appendChild(e),e.addEventListener("click",i=>{const n=i.target.closest("button");n&&this.onAction(n.dataset.act,n)}),this.buildSegments(),this.show("main")}buildSegments(){const t=this.root.querySelector("#seg-ao");["Off","Balanced","High"].forEach((i,n)=>{const s=document.createElement("button");s.textContent=i,s.dataset.i=n,s.addEventListener("click",a=>{a.stopPropagation(),this.game.setAOLevel(n),this.refreshSegments()}),t.appendChild(s)});const e=this.root.querySelector("#seg-up");["Off","Quality","Balanced","Performance"].forEach((i,n)=>{const s=document.createElement("button");s.textContent=i,s.dataset.i=n,s.addEventListener("click",a=>{a.stopPropagation(),this.game.upscaleIdx=n,this.game.applyUpscale(),this.refreshSegments()}),e.appendChild(s)})}refreshSegments(){const t=(e,i)=>this.root.querySelectorAll(e+" button").forEach(n=>n.classList.toggle("on",+n.dataset.i===i));t("#seg-ao",this.game.aoLevel),t("#seg-up",this.game.upscaleIdx)}show(t){this.root.style.display="flex",this.root.querySelectorAll(".menu-panel").forEach(e=>e.style.display=e.dataset.screen===t?"flex":"none"),(t==="main"||t==="pause")&&(this.returnTo=t),t==="settings"&&this.refreshSegments()}hide(){this.root.style.display="none"}onAction(t){t==="start"?(this.started=!0,this.game.input.lock()):t==="resume"?this.game.input.lock():t==="quit"?(this.started=!1,this.show("main")):t==="settings"?this.show("settings"):t==="controls"?this.show("controls"):t==="back"&&this.show(this.returnTo)}onLockChange(t){this.game.paused=!t,t?this.hide():this.started?this.show("pause"):this.show("main")}}const tf=document.getElementById("game"),Qn=new Jg({canvas:tf,antialias:!0,powerPreference:"high-performance"});Qn.setPixelRatio(Math.min(devicePixelRatio,1.5));Qn.setSize(innerWidth,innerHeight);Qn.shadowMap.enabled=!0;Qn.shadowMap.type=qh;Qn.toneMapping=Il;Qn.toneMappingExposure=1;const He=new Dv(Qn,tf);window.game=He;const Ua=new Lv(He);He.menu=Ua;He.input.onLockChange=r=>Ua.onLockChange(r);window.step=(r,t=[],e={})=>{for(let i=0;i<r;i++){for(const n of t)He.input.keys.add(n),i===0&&He.input.pressed.add(n);Object.assign(He.input.mouse,e),He.update(1/60)}He.input.keys.clear(),He.render()};He.resize();const Iv=location.search.includes("debug");Iv&&(Ua.started=!0,Ua.hide(),He.paused=!1,He.input.locked=!0);function ef(r){requestAnimationFrame(ef);const t=Math.min(.1,(r-Wh)/1e3);Wh=r,He.paused?He.env.update(He.dayFrac,new z(He.player.x,0,He.player.z)):He.update(t),He.render()}let Wh=performance.now();requestAnimationFrame(ef);
