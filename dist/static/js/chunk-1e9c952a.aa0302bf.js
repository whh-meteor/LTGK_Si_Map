(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-1e9c952a"],{"06c5":function(t,i,e){"use strict";e.d(i,"a",(function(){return s}));e("a630"),e("fb6a"),e("b0c0"),e("d3b7"),e("ac1f"),e("00b4"),e("25f0"),e("3ca3");var n=e("6b75");function s(t,i){if(t){if("string"==typeof t)return Object(n["a"])(t,i);var e={}.toString.call(t).slice(8,-1);return"Object"===e&&t.constructor&&(e=t.constructor.name),"Map"===e||"Set"===e?Array.from(t):"Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)?Object(n["a"])(t,i):void 0}}},"6b75":function(t,i,e){"use strict";function n(t,i){(null==i||i>t.length)&&(i=t.length);for(var e=0,n=Array(i);e<i;e++)n[e]=t[e];return n}e.d(i,"a",(function(){return n}))},"8ea0":function(t,i,e){"use strict";e.d(i,"a",(function(){return v}));const n=11102230246251565e-32,s=134217729,l=(3+8*n)*n;function h(t,i,e,n,s){let l,h,r,o,a=i[0],c=n[0],u=0,f=0;c>a===c>-a?(l=a,a=i[++u]):(l=c,c=n[++f]);let _=0;if(u<t&&f<e){c>a===c>-a?(h=a+l,r=l-(h-a),a=i[++u]):(h=c+l,r=l-(h-c),c=n[++f]),l=h,0!==r&&(s[_++]=r);while(u<t&&f<e)c>a===c>-a?(h=l+a,o=h-l,r=l-(h-o)+(a-o),a=i[++u]):(h=l+c,o=h-l,r=l-(h-o)+(c-o),c=n[++f]),l=h,0!==r&&(s[_++]=r)}while(u<t)h=l+a,o=h-l,r=l-(h-o)+(a-o),a=i[++u],l=h,0!==r&&(s[_++]=r);while(f<e)h=l+c,o=h-l,r=l-(h-o)+(c-o),c=n[++f],l=h,0!==r&&(s[_++]=r);return 0===l&&0!==_||(s[_++]=l),_}function r(t,i){let e=i[0];for(let n=1;n<t;n++)e+=i[n];return e}function o(t){return new Float64Array(t)}const a=(3+16*n)*n,c=(2+12*n)*n,u=(9+64*n)*n*n,f=o(4),_=o(8),g=o(12),d=o(16),y=o(4);function m(t,i,e,n,o,a,m){let x,w,p,v,b,A,T,M,k,S,$,P,I,U,z,F,j,K;const L=t-o,H=e-o,E=i-a,O=n-a;U=L*O,A=s*L,T=A-(A-L),M=L-T,A=s*O,k=A-(A-O),S=O-k,z=M*S-(U-T*k-M*k-T*S),F=E*H,A=s*E,T=A-(A-E),M=E-T,A=s*H,k=A-(A-H),S=H-k,j=M*S-(F-T*k-M*k-T*S),$=z-j,b=z-$,f[0]=z-($+b)+(b-j),P=U+$,b=P-U,I=U-(P-b)+($-b),$=I-F,b=I-$,f[1]=I-($+b)+(b-F),K=P+$,b=K-P,f[2]=P-(K-b)+($-b),f[3]=K;let C=r(4,f),J=c*m;if(C>=J||-C>=J)return C;if(b=t-L,x=t-(L+b)+(b-o),b=e-H,p=e-(H+b)+(b-o),b=i-E,w=i-(E+b)+(b-a),b=n-O,v=n-(O+b)+(b-a),0===x&&0===w&&0===p&&0===v)return C;if(J=u*m+l*Math.abs(C),C+=L*v+O*x-(E*p+H*w),C>=J||-C>=J)return C;U=x*O,A=s*x,T=A-(A-x),M=x-T,A=s*O,k=A-(A-O),S=O-k,z=M*S-(U-T*k-M*k-T*S),F=w*H,A=s*w,T=A-(A-w),M=w-T,A=s*H,k=A-(A-H),S=H-k,j=M*S-(F-T*k-M*k-T*S),$=z-j,b=z-$,y[0]=z-($+b)+(b-j),P=U+$,b=P-U,I=U-(P-b)+($-b),$=I-F,b=I-$,y[1]=I-($+b)+(b-F),K=P+$,b=K-P,y[2]=P-(K-b)+($-b),y[3]=K;const N=h(4,f,4,y,_);U=L*v,A=s*L,T=A-(A-L),M=L-T,A=s*v,k=A-(A-v),S=v-k,z=M*S-(U-T*k-M*k-T*S),F=E*p,A=s*E,T=A-(A-E),M=E-T,A=s*p,k=A-(A-p),S=p-k,j=M*S-(F-T*k-M*k-T*S),$=z-j,b=z-$,y[0]=z-($+b)+(b-j),P=U+$,b=P-U,I=U-(P-b)+($-b),$=I-F,b=I-$,y[1]=I-($+b)+(b-F),K=P+$,b=K-P,y[2]=P-(K-b)+($-b),y[3]=K;const Z=h(N,_,4,y,g);U=x*v,A=s*x,T=A-(A-x),M=x-T,A=s*v,k=A-(A-v),S=v-k,z=M*S-(U-T*k-M*k-T*S),F=w*p,A=s*w,T=A-(A-w),M=w-T,A=s*p,k=A-(A-p),S=p-k,j=M*S-(F-T*k-M*k-T*S),$=z-j,b=z-$,y[0]=z-($+b)+(b-j),P=U+$,b=P-U,I=U-(P-b)+($-b),$=I-F,b=I-$,y[1]=I-($+b)+(b-F),K=P+$,b=K-P,y[2]=P-(K-b)+($-b),y[3]=K;const q=h(Z,g,4,y,d);return d[q-1]}function x(t,i,e,n,s,l){const h=(i-l)*(e-s),r=(t-s)*(n-l),o=h-r,c=Math.abs(h+r);return Math.abs(o)>=a*c?o:-m(t,i,e,n,s,l,c)}o(4),o(4),o(4),o(4),o(4),o(4),o(4),o(4),o(4),o(8),o(8),o(8),o(4),o(8),o(8),o(8),o(12);o(192),o(192);o(4),o(4),o(4),o(4),o(4),o(4),o(4),o(4),o(8),o(8),o(8),o(8),o(8),o(8),o(8),o(8),o(8),o(4),o(4),o(4),o(8),o(16),o(16),o(16),o(32),o(32),o(48),o(64);o(1152),o(1152);o(4),o(4),o(4),o(4),o(4),o(4),o(4),o(4),o(4),o(4),o(24),o(24),o(24),o(24),o(24),o(24),o(24),o(24),o(24),o(24),o(1152),o(1152),o(1152),o(1152),o(1152),o(2304),o(2304),o(3456),o(5760),o(8),o(8),o(8),o(16),o(24),o(48),o(48),o(96),o(192),o(384),o(384),o(384),o(768);o(96),o(96),o(96),o(1152);const w=Math.pow(2,-52),p=new Uint32Array(512);class v{static from(t,i=P,e=I){const n=t.length,s=new Float64Array(2*n);for(let l=0;l<n;l++){const n=t[l];s[2*l]=i(n),s[2*l+1]=e(n)}return new v(s)}constructor(t){const i=t.length>>1;if(i>0&&"number"!==typeof t[0])throw new Error("Expected coords to contain numbers.");this.coords=t;const e=Math.max(2*i-5,0);this._triangles=new Uint32Array(3*e),this._halfedges=new Int32Array(3*e),this._hashSize=Math.ceil(Math.sqrt(i)),this._hullPrev=new Uint32Array(i),this._hullNext=new Uint32Array(i),this._hullTri=new Uint32Array(i),this._hullHash=new Int32Array(this._hashSize),this._ids=new Uint32Array(i),this._dists=new Float64Array(i),this.update()}update(){const{coords:t,_hullPrev:i,_hullNext:e,_hullTri:n,_hullHash:s}=this,l=t.length>>1;let h=1/0,r=1/0,o=-1/0,a=-1/0;for(let x=0;x<l;x++){const i=t[2*x],e=t[2*x+1];i<h&&(h=i),e<r&&(r=e),i>o&&(o=i),e>a&&(a=e),this._ids[x]=x}const c=(h+o)/2,u=(r+a)/2;let f,_,g;for(let x=0,w=1/0;x<l;x++){const i=A(c,u,t[2*x],t[2*x+1]);i<w&&(f=x,w=i)}const d=t[2*f],y=t[2*f+1];for(let x=0,w=1/0;x<l;x++){if(x===f)continue;const i=A(d,y,t[2*x],t[2*x+1]);i<w&&i>0&&(_=x,w=i)}let m=t[2*_],p=t[2*_+1],v=1/0;for(let x=0;x<l;x++){if(x===f||x===_)continue;const i=M(d,y,m,p,t[2*x],t[2*x+1]);i<v&&(g=x,v=i)}let b=t[2*g],T=t[2*g+1];if(v===1/0){for(let n=0;n<l;n++)this._dists[n]=t[2*n]-t[0]||t[2*n+1]-t[1];S(this._ids,this._dists,0,l-1);const i=new Uint32Array(l);let e=0;for(let t=0,n=-1/0;t<l;t++){const s=this._ids[t],l=this._dists[s];l>n&&(i[e++]=s,n=l)}return this.hull=i.subarray(0,e),this.triangles=new Uint32Array(0),void(this.halfedges=new Uint32Array(0))}if(x(d,y,m,p,b,T)<0){const t=_,i=m,e=p;_=g,m=b,p=T,g=t,b=i,T=e}const $=k(d,y,m,p,b,T);this._cx=$.x,this._cy=$.y;for(let x=0;x<l;x++)this._dists[x]=A(t[2*x],t[2*x+1],$.x,$.y);S(this._ids,this._dists,0,l-1),this._hullStart=f;let P=3;e[f]=i[g]=_,e[_]=i[f]=g,e[g]=i[_]=f,n[f]=0,n[_]=1,n[g]=2,s.fill(-1),s[this._hashKey(d,y)]=f,s[this._hashKey(m,p)]=_,s[this._hashKey(b,T)]=g,this.trianglesLen=0,this._addTriangle(f,_,g,-1,-1,-1);for(let A,M,k=0;k<this._ids.length;k++){const l=this._ids[k],h=t[2*l],r=t[2*l+1];if(k>0&&Math.abs(h-A)<=w&&Math.abs(r-M)<=w)continue;if(A=h,M=r,l===f||l===_||l===g)continue;let o=0;for(let t=0,i=this._hashKey(h,r);t<this._hashSize;t++)if(o=s[(i+t)%this._hashSize],-1!==o&&o!==e[o])break;o=i[o];let a,c=o;while(a=e[c],x(h,r,t[2*c],t[2*c+1],t[2*a],t[2*a+1])>=0)if(c=a,c===o){c=-1;break}if(-1===c)continue;let u=this._addTriangle(c,l,e[c],-1,-1,n[c]);n[l]=this._legalize(u+2),n[c]=u,P++;let d=e[c];while(a=e[d],x(h,r,t[2*d],t[2*d+1],t[2*a],t[2*a+1])<0)u=this._addTriangle(d,l,a,n[l],-1,n[d]),n[l]=this._legalize(u+2),e[d]=d,P--,d=a;if(c===o)while(a=i[c],x(h,r,t[2*a],t[2*a+1],t[2*c],t[2*c+1])<0)u=this._addTriangle(a,l,c,-1,n[c],n[a]),this._legalize(u+2),n[a]=u,e[c]=c,P--,c=a;this._hullStart=i[l]=c,e[c]=i[d]=l,e[l]=d,s[this._hashKey(h,r)]=l,s[this._hashKey(t[2*c],t[2*c+1])]=c}this.hull=new Uint32Array(P);for(let x=0,w=this._hullStart;x<P;x++)this.hull[x]=w,w=e[w];this.triangles=this._triangles.subarray(0,this.trianglesLen),this.halfedges=this._halfedges.subarray(0,this.trianglesLen)}_hashKey(t,i){return Math.floor(b(t-this._cx,i-this._cy)*this._hashSize)%this._hashSize}_legalize(t){const{_triangles:i,_halfedges:e,coords:n}=this;let s=0,l=0;while(1){const h=e[t],r=t-t%3;if(l=r+(t+2)%3,-1===h){if(0===s)break;t=p[--s];continue}const o=h-h%3,a=r+(t+1)%3,c=o+(h+2)%3,u=i[l],f=i[t],_=i[a],g=i[c],d=T(n[2*u],n[2*u+1],n[2*f],n[2*f+1],n[2*_],n[2*_+1],n[2*g],n[2*g+1]);if(d){i[t]=g,i[h]=u;const n=e[c];if(-1===n){let i=this._hullStart;do{if(this._hullTri[i]===c){this._hullTri[i]=t;break}i=this._hullPrev[i]}while(i!==this._hullStart)}this._link(t,n),this._link(h,e[l]),this._link(l,c);const r=o+(h+1)%3;s<p.length&&(p[s++]=r)}else{if(0===s)break;t=p[--s]}}return l}_link(t,i){this._halfedges[t]=i,-1!==i&&(this._halfedges[i]=t)}_addTriangle(t,i,e,n,s,l){const h=this.trianglesLen;return this._triangles[h]=t,this._triangles[h+1]=i,this._triangles[h+2]=e,this._link(h,n),this._link(h+1,s),this._link(h+2,l),this.trianglesLen+=3,h}}function b(t,i){const e=t/(Math.abs(t)+Math.abs(i));return(i>0?3-e:1+e)/4}function A(t,i,e,n){const s=t-e,l=i-n;return s*s+l*l}function T(t,i,e,n,s,l,h,r){const o=t-h,a=i-r,c=e-h,u=n-r,f=s-h,_=l-r,g=o*o+a*a,d=c*c+u*u,y=f*f+_*_;return o*(u*y-d*_)-a*(c*y-d*f)+g*(c*_-u*f)<0}function M(t,i,e,n,s,l){const h=e-t,r=n-i,o=s-t,a=l-i,c=h*h+r*r,u=o*o+a*a,f=.5/(h*a-r*o),_=(a*c-r*u)*f,g=(h*u-o*c)*f;return _*_+g*g}function k(t,i,e,n,s,l){const h=e-t,r=n-i,o=s-t,a=l-i,c=h*h+r*r,u=o*o+a*a,f=.5/(h*a-r*o),_=t+(a*c-r*u)*f,g=i+(h*u-o*c)*f;return{x:_,y:g}}function S(t,i,e,n){if(n-e<=20)for(let s=e+1;s<=n;s++){const n=t[s],l=i[n];let h=s-1;while(h>=e&&i[t[h]]>l)t[h+1]=t[h--];t[h+1]=n}else{const s=e+n>>1;let l=e+1,h=n;$(t,s,l),i[t[e]]>i[t[n]]&&$(t,e,n),i[t[l]]>i[t[n]]&&$(t,l,n),i[t[e]]>i[t[l]]&&$(t,e,l);const r=t[l],o=i[r];while(1){do{l++}while(i[t[l]]<o);do{h--}while(i[t[h]]>o);if(h<l)break;$(t,l,h)}t[e+1]=t[h],t[h]=r,n-l+1>=h-e?(S(t,i,l,n),S(t,i,e,h-1)):(S(t,i,e,h-1),S(t,i,l,n))}}function $(t,i,e){const n=t[i];t[i]=t[e],t[e]=n}function P(t){return t[0]}function I(t){return t[1]}},e097:function(t,i,e){"use strict";e.d(i,"a",(function(){return g}));var n=e("8ea0");const s=1e-6;class l{constructor(){this._x0=this._y0=this._x1=this._y1=null,this._=""}moveTo(t,i){this._+=`M${this._x0=this._x1=+t},${this._y0=this._y1=+i}`}closePath(){null!==this._x1&&(this._x1=this._x0,this._y1=this._y0,this._+="Z")}lineTo(t,i){this._+=`L${this._x1=+t},${this._y1=+i}`}arc(t,i,e){t=+t,i=+i,e=+e;const n=t+e,l=i;if(e<0)throw new Error("negative radius");null===this._x1?this._+=`M${n},${l}`:(Math.abs(this._x1-n)>s||Math.abs(this._y1-l)>s)&&(this._+="L"+n+","+l),e&&(this._+=`A${e},${e},0,1,1,${t-e},${i}A${e},${e},0,1,1,${this._x1=n},${this._y1=l}`)}rect(t,i,e,n){this._+=`M${this._x0=this._x1=+t},${this._y0=this._y1=+i}h${+e}v${+n}h${-e}Z`}value(){return this._||null}}class h{constructor(){this._=[]}moveTo(t,i){this._.push([t,i])}closePath(){this._.push(this._[0].slice())}lineTo(t,i){this._.push([t,i])}value(){return this._.length?this._:null}}class r{constructor(t,[i,e,n,s]=[0,0,960,500]){if(!((n=+n)>=(i=+i))||!((s=+s)>=(e=+e)))throw new Error("invalid bounds");this.delaunay=t,this._circumcenters=new Float64Array(2*t.points.length),this.vectors=new Float64Array(2*t.points.length),this.xmax=n,this.xmin=i,this.ymax=s,this.ymin=e,this._init()}update(){return this.delaunay.update(),this._init(),this}_init(){const{delaunay:{points:t,hull:i,triangles:e},vectors:n}=this;let s,l;const h=this.circumcenters=this._circumcenters.subarray(0,e.length/3*2);for(let g,d,y=0,m=0,x=e.length;y<x;y+=3,m+=2){const n=2*e[y],r=2*e[y+1],o=2*e[y+2],a=t[n],c=t[n+1],u=t[r],f=t[r+1],_=t[o],x=t[o+1],w=u-a,p=f-c,v=_-a,b=x-c,A=2*(w*b-p*v);if(Math.abs(A)<1e-9){if(void 0===s){s=l=0;for(const e of i)s+=t[2*e],l+=t[2*e+1];s/=i.length,l/=i.length}const e=1e9*Math.sign((s-a)*b-(l-c)*v);g=(a+_)/2-e*b,d=(c+x)/2+e*v}else{const t=1/A,i=w*w+p*p,e=v*v+b*b;g=a+(b*i-p*e)*t,d=c+(w*e-v*i)*t}h[m]=g,h[m+1]=d}let r,o,a,c=i[i.length-1],u=4*c,f=t[2*c],_=t[2*c+1];n.fill(0);for(let g=0;g<i.length;++g)c=i[g],r=u,o=f,a=_,u=4*c,f=t[2*c],_=t[2*c+1],n[r+2]=n[u]=a-_,n[r+3]=n[u+1]=f-o}render(t){const i=null==t?t=new l:void 0,{delaunay:{halfedges:e,inedges:n,hull:s},circumcenters:h,vectors:r}=this;if(s.length<=1)return null;for(let l=0,c=e.length;l<c;++l){const i=e[l];if(i<l)continue;const n=2*Math.floor(l/3),s=2*Math.floor(i/3),r=h[n],o=h[n+1],a=h[s],c=h[s+1];this._renderSegment(r,o,a,c,t)}let o,a=s[s.length-1];for(let l=0;l<s.length;++l){o=a,a=s[l];const i=2*Math.floor(n[a]/3),e=h[i],c=h[i+1],u=4*o,f=this._project(e,c,r[u+2],r[u+3]);f&&this._renderSegment(e,c,f[0],f[1],t)}return i&&i.value()}renderBounds(t){const i=null==t?t=new l:void 0;return t.rect(this.xmin,this.ymin,this.xmax-this.xmin,this.ymax-this.ymin),i&&i.value()}renderCell(t,i){const e=null==i?i=new l:void 0,n=this._clip(t);if(null===n||!n.length)return;i.moveTo(n[0],n[1]);let s=n.length;while(n[0]===n[s-2]&&n[1]===n[s-1]&&s>1)s-=2;for(let l=2;l<s;l+=2)n[l]===n[l-2]&&n[l+1]===n[l-1]||i.lineTo(n[l],n[l+1]);return i.closePath(),e&&e.value()}*cellPolygons(){const{delaunay:{points:t}}=this;for(let i=0,e=t.length/2;i<e;++i){const t=this.cellPolygon(i);t&&(t.index=i,yield t)}}cellPolygon(t){const i=new h;return this.renderCell(t,i),i.value()}_renderSegment(t,i,e,n,s){let l;const h=this._regioncode(t,i),r=this._regioncode(e,n);0===h&&0===r?(s.moveTo(t,i),s.lineTo(e,n)):(l=this._clipSegment(t,i,e,n,h,r))&&(s.moveTo(l[0],l[1]),s.lineTo(l[2],l[3]))}contains(t,i,e){return i=+i,i===i&&(e=+e,e===e)&&this.delaunay._step(t,i,e)===t}*neighbors(t){const i=this._clip(t);if(i)for(const e of this.delaunay.neighbors(t)){const t=this._clip(e);if(t)t:for(let n=0,s=i.length;n<s;n+=2)for(let l=0,h=t.length;l<h;l+=2)if(i[n]===t[l]&&i[n+1]===t[l+1]&&i[(n+2)%s]===t[(l+h-2)%h]&&i[(n+3)%s]===t[(l+h-1)%h]){yield e;break t}}}_cell(t){const{circumcenters:i,delaunay:{inedges:e,halfedges:n,triangles:s}}=this,l=e[t];if(-1===l)return null;const h=[];let r=l;do{const e=Math.floor(r/3);if(h.push(i[2*e],i[2*e+1]),r=r%3===2?r-2:r+1,s[r]!==t)break;r=n[r]}while(r!==l&&-1!==r);return h}_clip(t){if(0===t&&1===this.delaunay.hull.length)return[this.xmax,this.ymin,this.xmax,this.ymax,this.xmin,this.ymax,this.xmin,this.ymin];const i=this._cell(t);if(null===i)return null;const{vectors:e}=this,n=4*t;return this._simplify(e[n]||e[n+1]?this._clipInfinite(t,i,e[n],e[n+1],e[n+2],e[n+3]):this._clipFinite(t,i))}_clipFinite(t,i){const e=i.length;let n,s,l,h,r=null,o=i[e-2],a=i[e-1],c=this._regioncode(o,a),u=0;for(let f=0;f<e;f+=2)if(n=o,s=a,o=i[f],a=i[f+1],l=c,c=this._regioncode(o,a),0===l&&0===c)h=u,u=0,r?r.push(o,a):r=[o,a];else{let i,e,f,_,g;if(0===l){if(null===(i=this._clipSegment(n,s,o,a,l,c)))continue;[e,f,_,g]=i}else{if(null===(i=this._clipSegment(o,a,n,s,c,l)))continue;[_,g,e,f]=i,h=u,u=this._edgecode(e,f),h&&u&&this._edge(t,h,u,r,r.length),r?r.push(e,f):r=[e,f]}h=u,u=this._edgecode(_,g),h&&u&&this._edge(t,h,u,r,r.length),r?r.push(_,g):r=[_,g]}if(r)h=u,u=this._edgecode(r[0],r[1]),h&&u&&this._edge(t,h,u,r,r.length);else if(this.contains(t,(this.xmin+this.xmax)/2,(this.ymin+this.ymax)/2))return[this.xmax,this.ymin,this.xmax,this.ymax,this.xmin,this.ymax,this.xmin,this.ymin];return r}_clipSegment(t,i,e,n,s,l){const h=s<l;h&&([t,i,e,n,s,l]=[e,n,t,i,l,s]);while(1){if(0===s&&0===l)return h?[e,n,t,i]:[t,i,e,n];if(s&l)return null;let r,o,a=s||l;8&a?(r=t+(e-t)*(this.ymax-i)/(n-i),o=this.ymax):4&a?(r=t+(e-t)*(this.ymin-i)/(n-i),o=this.ymin):2&a?(o=i+(n-i)*(this.xmax-t)/(e-t),r=this.xmax):(o=i+(n-i)*(this.xmin-t)/(e-t),r=this.xmin),s?(t=r,i=o,s=this._regioncode(t,i)):(e=r,n=o,l=this._regioncode(e,n))}}_clipInfinite(t,i,e,n,s,l){let h,r=Array.from(i);if((h=this._project(r[0],r[1],e,n))&&r.unshift(h[0],h[1]),(h=this._project(r[r.length-2],r[r.length-1],s,l))&&r.push(h[0],h[1]),r=this._clipFinite(t,r))for(let o,a=0,c=r.length,u=this._edgecode(r[c-2],r[c-1]);a<c;a+=2)o=u,u=this._edgecode(r[a],r[a+1]),o&&u&&(a=this._edge(t,o,u,r,a),c=r.length);else this.contains(t,(this.xmin+this.xmax)/2,(this.ymin+this.ymax)/2)&&(r=[this.xmin,this.ymin,this.xmax,this.ymin,this.xmax,this.ymax,this.xmin,this.ymax]);return r}_edge(t,i,e,n,s){while(i!==e){let e,l;switch(i){case 5:i=4;continue;case 4:i=6,e=this.xmax,l=this.ymin;break;case 6:i=2;continue;case 2:i=10,e=this.xmax,l=this.ymax;break;case 10:i=8;continue;case 8:i=9,e=this.xmin,l=this.ymax;break;case 9:i=1;continue;case 1:i=5,e=this.xmin,l=this.ymin;break}n[s]===e&&n[s+1]===l||!this.contains(t,e,l)||(n.splice(s,0,e,l),s+=2)}return s}_project(t,i,e,n){let s,l,h,r=1/0;if(n<0){if(i<=this.ymin)return null;(s=(this.ymin-i)/n)<r&&(h=this.ymin,l=t+(r=s)*e)}else if(n>0){if(i>=this.ymax)return null;(s=(this.ymax-i)/n)<r&&(h=this.ymax,l=t+(r=s)*e)}if(e>0){if(t>=this.xmax)return null;(s=(this.xmax-t)/e)<r&&(l=this.xmax,h=i+(r=s)*n)}else if(e<0){if(t<=this.xmin)return null;(s=(this.xmin-t)/e)<r&&(l=this.xmin,h=i+(r=s)*n)}return[l,h]}_edgecode(t,i){return(t===this.xmin?1:t===this.xmax?2:0)|(i===this.ymin?4:i===this.ymax?8:0)}_regioncode(t,i){return(t<this.xmin?1:t>this.xmax?2:0)|(i<this.ymin?4:i>this.ymax?8:0)}_simplify(t){if(t&&t.length>4){for(let i=0;i<t.length;i+=2){const e=(i+2)%t.length,n=(i+4)%t.length;(t[i]===t[e]&&t[e]===t[n]||t[i+1]===t[e+1]&&t[e+1]===t[n+1])&&(t.splice(e,2),i-=2)}t.length||(t=null)}return t}}const o=2*Math.PI,a=Math.pow;function c(t){return t[0]}function u(t){return t[1]}function f(t){const{triangles:i,coords:e}=t;for(let n=0;n<i.length;n+=3){const t=2*i[n],s=2*i[n+1],l=2*i[n+2],h=(e[l]-e[t])*(e[s+1]-e[t+1])-(e[s]-e[t])*(e[l+1]-e[t+1]);if(h>1e-10)return!1}return!0}function _(t,i,e){return[t+Math.sin(t+i)*e,i+Math.cos(t-i)*e]}class g{static from(t,i=c,e=u,n){return new g("length"in t?d(t,i,e,n):Float64Array.from(y(t,i,e,n)))}constructor(t){this._delaunator=new n["a"](t),this.inedges=new Int32Array(t.length/2),this._hullIndex=new Int32Array(t.length/2),this.points=this._delaunator.coords,this._init()}update(){return this._delaunator.update(),this._init(),this}_init(){const t=this._delaunator,i=this.points;if(t.hull&&t.hull.length>2&&f(t)){this.collinear=Int32Array.from({length:i.length/2},(t,i)=>i).sort((t,e)=>i[2*t]-i[2*e]||i[2*t+1]-i[2*e+1]);const t=this.collinear[0],e=this.collinear[this.collinear.length-1],s=[i[2*t],i[2*t+1],i[2*e],i[2*e+1]],l=1e-8*Math.hypot(s[3]-s[1],s[2]-s[0]);for(let n=0,h=i.length/2;n<h;++n){const t=_(i[2*n],i[2*n+1],l);i[2*n]=t[0],i[2*n+1]=t[1]}this._delaunator=new n["a"](i)}else delete this.collinear;const e=this.halfedges=this._delaunator.halfedges,s=this.hull=this._delaunator.hull,l=this.triangles=this._delaunator.triangles,h=this.inedges.fill(-1),r=this._hullIndex.fill(-1);for(let n=0,o=e.length;n<o;++n){const t=l[n%3===2?n-2:n+1];-1!==e[n]&&-1!==h[t]||(h[t]=n)}for(let n=0,o=s.length;n<o;++n)r[s[n]]=n;s.length<=2&&s.length>0&&(this.triangles=new Int32Array(3).fill(-1),this.halfedges=new Int32Array(3).fill(-1),this.triangles[0]=s[0],h[s[0]]=1,2===s.length&&(h[s[1]]=0,this.triangles[1]=s[1],this.triangles[2]=s[1]))}voronoi(t){return new r(this,t)}*neighbors(t){const{inedges:i,hull:e,_hullIndex:n,halfedges:s,triangles:l,collinear:h}=this;if(h){const i=h.indexOf(t);return i>0&&(yield h[i-1]),void(i<h.length-1&&(yield h[i+1]))}const r=i[t];if(-1===r)return;let o=r,a=-1;do{if(yield a=l[o],o=o%3===2?o-2:o+1,l[o]!==t)return;if(o=s[o],-1===o){const i=e[(n[t]+1)%e.length];return void(i!==a&&(yield i))}}while(o!==r)}find(t,i,e=0){if(t=+t,t!==t||(i=+i,i!==i))return-1;const n=e;let s;while((s=this._step(e,t,i))>=0&&s!==e&&s!==n)e=s;return s}_step(t,i,e){const{inedges:n,hull:s,_hullIndex:l,halfedges:h,triangles:r,points:o}=this;if(-1===n[t]||!o.length)return(t+1)%(o.length>>1);let c=t,u=a(i-o[2*t],2)+a(e-o[2*t+1],2);const f=n[t];let _=f;do{let n=r[_];const f=a(i-o[2*n],2)+a(e-o[2*n+1],2);if(f<u&&(u=f,c=n),_=_%3===2?_-2:_+1,r[_]!==t)break;if(_=h[_],-1===_){if(_=s[(l[t]+1)%s.length],_!==n&&a(i-o[2*_],2)+a(e-o[2*_+1],2)<u)return _;break}}while(_!==f);return c}render(t){const i=null==t?t=new l:void 0,{points:e,halfedges:n,triangles:s}=this;for(let l=0,h=n.length;l<h;++l){const i=n[l];if(i<l)continue;const h=2*s[l],r=2*s[i];t.moveTo(e[h],e[h+1]),t.lineTo(e[r],e[r+1])}return this.renderHull(t),i&&i.value()}renderPoints(t,i){void 0!==i||t&&"function"===typeof t.moveTo||(i=t,t=null),i=void 0==i?2:+i;const e=null==t?t=new l:void 0,{points:n}=this;for(let s=0,l=n.length;s<l;s+=2){const e=n[s],l=n[s+1];t.moveTo(e+i,l),t.arc(e,l,i,0,o)}return e&&e.value()}renderHull(t){const i=null==t?t=new l:void 0,{hull:e,points:n}=this,s=2*e[0],h=e.length;t.moveTo(n[s],n[s+1]);for(let l=1;l<h;++l){const i=2*e[l];t.lineTo(n[i],n[i+1])}return t.closePath(),i&&i.value()}hullPolygon(){const t=new h;return this.renderHull(t),t.value()}renderTriangle(t,i){const e=null==i?i=new l:void 0,{points:n,triangles:s}=this,h=2*s[t*=3],r=2*s[t+1],o=2*s[t+2];return i.moveTo(n[h],n[h+1]),i.lineTo(n[r],n[r+1]),i.lineTo(n[o],n[o+1]),i.closePath(),e&&e.value()}*trianglePolygons(){const{triangles:t}=this;for(let i=0,e=t.length/3;i<e;++i)yield this.trianglePolygon(i)}trianglePolygon(t){const i=new h;return this.renderTriangle(t,i),i.value()}}function d(t,i,e,n){const s=t.length,l=new Float64Array(2*s);for(let h=0;h<s;++h){const s=t[h];l[2*h]=i.call(n,s,h,t),l[2*h+1]=e.call(n,s,h,t)}return l}function*y(t,i,e,n){let s=0;for(const l of t)yield i.call(n,l,s,t),yield e.call(n,l,s,t),++s}}}]);