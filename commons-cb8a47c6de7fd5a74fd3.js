"use strict";(self.webpackChunkcode_cactu_website=self.webpackChunkcode_cactu_website||[]).push([[351],{72:function(e){var t=function(e,t){if("string"!=typeof e&&!Array.isArray(e))throw new TypeError("Expected the input to be `string | string[]`");t=Object.assign({pascalCase:!1},t);var n;return e=Array.isArray(e)?e.map((function(e){return e.trim()})).filter((function(e){return e.length})).join("-"):e.trim(),0===e.length?"":1===e.length?t.pascalCase?e.toUpperCase():e.toLowerCase():(e!==e.toLowerCase()&&(e=function(e){for(var t=!1,n=!1,r=!1,a=0;a<e.length;a++){var i=e[a];t&&/[a-zA-Z]/.test(i)&&i.toUpperCase()===i?(e=e.slice(0,a)+"-"+e.slice(a),t=!1,r=n,n=!0,a++):n&&r&&/[a-zA-Z]/.test(i)&&i.toLowerCase()===i?(e=e.slice(0,a-1)+"-"+e.slice(a-1),r=n,n=!1,t=!0):(t=i.toLowerCase()===i&&i.toUpperCase()!==i,r=n,n=i.toUpperCase()===i&&i.toLowerCase()!==i)}return e}(e)),e=e.replace(/^[_.\- ]+/,"").toLowerCase().replace(/[_.\- ]+(\w|$)/g,(function(e,t){return t.toUpperCase()})).replace(/\d+(\w|$)/g,(function(e){return e.toUpperCase()})),n=e,t.pascalCase?n.charAt(0).toUpperCase()+n.slice(1):n)};e.exports=t,e.exports.default=t},3723:function(e,t,n){n.d(t,{L:function(){return g},M:function(){return x},P:function(){return w},S:function(){return q},_:function(){return s},a:function(){return o},b:function(){return l},g:function(){return u},h:function(){return c}});var r=n(7294),a=(n(72),n(5697)),i=n.n(a);function o(){return o=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},o.apply(this,arguments)}function s(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)t.indexOf(n=i[r])>=0||(a[n]=e[n]);return a}var c=function(){return"undefined"!=typeof HTMLImageElement&&"loading"in HTMLImageElement.prototype};function l(e,t,n,r,a){return void 0===a&&(a={}),o({},n,{loading:r,shouldLoad:e,"data-main-image":"",style:o({},a,{opacity:t?1:0})})}function u(e,t,n,r,a,i,s,c){var l={};i&&(l.backgroundColor=i,"fixed"===n?(l.width=r,l.height=a,l.backgroundColor=i,l.position="relative"):("constrained"===n||"fullWidth"===n)&&(l.position="absolute",l.top=0,l.left=0,l.bottom=0,l.right=0)),s&&(l.objectFit=s),c&&(l.objectPosition=c);var u=o({},e,{"aria-hidden":!0,"data-placeholder-image":"",style:o({opacity:t?0:1,transition:"opacity 500ms linear"},l)});return u}var d,f=["children"],p=function(e){var t=e.layout,n=e.width,a=e.height;return"fullWidth"===t?r.createElement("div",{"aria-hidden":!0,style:{paddingTop:a/n*100+"%"}}):"constrained"===t?r.createElement("div",{style:{maxWidth:n,display:"block"}},r.createElement("img",{alt:"",role:"presentation","aria-hidden":"true",src:"data:image/svg+xml;charset=utf-8,%3Csvg height='"+a+"' width='"+n+"' xmlns='http://www.w3.org/2000/svg' version='1.1'%3E%3C/svg%3E",style:{maxWidth:"100%",display:"block",position:"static"}})):null},g=function(e){var t=e.children,n=s(e,f);return r.createElement(r.Fragment,null,r.createElement(p,o({},n)),t,null)},h=["src","srcSet","loading","alt","shouldLoad"],m=["fallback","sources","shouldLoad"],v=function(e){var t=e.src,n=e.srcSet,a=e.loading,i=e.alt,c=void 0===i?"":i,l=e.shouldLoad,u=s(e,h);return r.createElement("img",o({},u,{decoding:"async",loading:a,src:l?t:void 0,"data-src":l?void 0:t,srcSet:l?n:void 0,"data-srcset":l?void 0:n,alt:c}))},y=function(e){var t=e.fallback,n=e.sources,a=void 0===n?[]:n,i=e.shouldLoad,c=void 0===i||i,l=s(e,m),u=l.sizes||(null==t?void 0:t.sizes),d=r.createElement(v,o({},l,t,{sizes:u,shouldLoad:c}));return a.length?r.createElement("picture",null,a.map((function(e){var t=e.media,n=e.srcSet,a=e.type;return r.createElement("source",{key:t+"-"+a+"-"+n,type:a,media:t,srcSet:c?n:void 0,"data-srcset":c?void 0:n,sizes:u})})),d):d};v.propTypes={src:a.string.isRequired,alt:a.string.isRequired,sizes:a.string,srcSet:a.string,shouldLoad:a.bool},y.displayName="Picture",y.propTypes={alt:a.string.isRequired,shouldLoad:a.bool,fallback:a.exact({src:a.string.isRequired,srcSet:a.string,sizes:a.string}),sources:a.arrayOf(a.oneOfType([a.exact({media:a.string.isRequired,type:a.string,sizes:a.string,srcSet:a.string.isRequired}),a.exact({media:a.string,type:a.string.isRequired,sizes:a.string,srcSet:a.string.isRequired})]))};var b=["fallback"],w=function(e){var t=e.fallback,n=s(e,b);return t?r.createElement(y,o({},n,{fallback:{src:t},"aria-hidden":!0,alt:""})):r.createElement("div",o({},n))};w.displayName="Placeholder",w.propTypes={fallback:a.string,sources:null==(d=y.propTypes)?void 0:d.sources,alt:function(e,t,n){return e[t]?new Error("Invalid prop `"+t+"` supplied to `"+n+"`. Validation failed."):null}};var x=function(e){return r.createElement(r.Fragment,null,r.createElement(y,o({},e)),r.createElement("noscript",null,r.createElement(y,o({},e,{shouldLoad:!0}))))};x.displayName="MainImage",x.propTypes=y.propTypes;var j,C,k=function(e,t,n){for(var r=arguments.length,a=new Array(r>3?r-3:0),o=3;o<r;o++)a[o-3]=arguments[o];return e.alt||""===e.alt?i().string.apply(i(),[e,t,n].concat(a)):new Error('The "alt" prop is required in '+n+'. If the image is purely presentational then pass an empty string: e.g. alt="". Learn more: https://a11y-style-guide.com/style-guide/section-media.html')},S={image:i().object.isRequired,alt:k},E=["as","image","style","backgroundColor","className","class","onStartLoad","onLoad","onError"],L=["style","className"],A=new Set,O=function(e){var t=e.as,a=void 0===t?"div":t,i=e.image,l=e.style,u=e.backgroundColor,d=e.className,f=e.class,p=e.onStartLoad,g=e.onLoad,h=e.onError,m=s(e,E),v=i.width,y=i.height,b=i.layout,w=function(e,t,n){var r={},a="gatsby-image-wrapper";return"fixed"===n?(r.width=e,r.height=t):"constrained"===n&&(a="gatsby-image-wrapper gatsby-image-wrapper-constrained"),{className:a,"data-gatsby-image-wrapper":"",style:r}}(v,y,b),x=w.style,k=w.className,S=s(w,L),O=(0,r.useRef)(),R=(0,r.useMemo)((function(){return JSON.stringify(i.images)}),[i.images]);f&&(d=f);var T=function(e,t,n){var r="";return"fullWidth"===e&&(r='<div aria-hidden="true" style="padding-top: '+n/t*100+'%;"></div>'),"constrained"===e&&(r='<div style="max-width: '+t+'px; display: block;"><img alt="" role="presentation" aria-hidden="true" src="data:image/svg+xml;charset=utf-8,%3Csvg height=\''+n+"' width='"+t+"' xmlns='http://www.w3.org/2000/svg' version='1.1'%3E%3C/svg%3E\" style=\"max-width: 100%; display: block; position: static;\"></div>"),r}(b,v,y);return(0,r.useEffect)((function(){j||(j=Promise.all([n.e(774),n.e(217)]).then(n.bind(n,9217)).then((function(e){var t=e.renderImageToString,n=e.swapPlaceholderImage;return C=t,{renderImageToString:t,swapPlaceholderImage:n}})));var e,t,r=O.current.querySelector("[data-gatsby-image-ssr]");return r&&c()?(r.complete?(null==p||p({wasCached:!0}),null==g||g({wasCached:!0}),setTimeout((function(){r.removeAttribute("data-gatsby-image-ssr")}),0)):(null==p||p({wasCached:!0}),r.addEventListener("load",(function e(){r.removeEventListener("load",e),null==g||g({wasCached:!0}),setTimeout((function(){r.removeAttribute("data-gatsby-image-ssr")}),0)}))),void A.add(R)):C&&A.has(R)?void 0:(j.then((function(n){var r=n.renderImageToString,a=n.swapPlaceholderImage;O.current&&(O.current.innerHTML=r(o({isLoading:!0,isLoaded:A.has(R),image:i},m)),A.has(R)||(e=requestAnimationFrame((function(){O.current&&(t=a(O.current,R,A,l,p,g,h))}))))})),function(){e&&cancelAnimationFrame(e),t&&t()})}),[i]),(0,r.useLayoutEffect)((function(){A.has(R)&&C&&(O.current.innerHTML=C(o({isLoading:A.has(R),isLoaded:A.has(R),image:i},m)),null==p||p({wasCached:!0}),null==g||g({wasCached:!0}))}),[i]),(0,r.createElement)(a,o({},S,{style:o({},x,l,{backgroundColor:u}),className:k+(d?" "+d:""),ref:O,dangerouslySetInnerHTML:{__html:T},suppressHydrationWarning:!0}))},R=(0,r.memo)((function(e){return e.image?(0,r.createElement)(O,e):null}));R.propTypes=S,R.displayName="GatsbyImage";var T,N=["src","__imageData","__error","width","height","aspectRatio","tracedSVGOptions","placeholder","formats","quality","transformOptions","jpgOptions","pngOptions","webpOptions","avifOptions","blurredOptions","breakpoints","outputPixelDensities"],z=function(e,t){for(var n=arguments.length,r=new Array(n>2?n-2:0),a=2;a<n;a++)r[a-2]=arguments[a];return"fullWidth"!==e.layout||"width"!==t&&"height"!==t||!e[t]?i().number.apply(i(),[e,t].concat(r)):new Error('"'+t+'" '+e[t]+" may not be passed when layout is fullWidth.")},I=new Set(["fixed","fullWidth","constrained"]),_={src:i().string.isRequired,alt:k,width:z,height:z,sizes:i().string,layout:function(e){if(void 0!==e.layout&&!I.has(e.layout))return new Error("Invalid value "+e.layout+'" provided for prop "layout". Defaulting to "constrained". Valid values are "fixed", "fullWidth" or "constrained".')}},q=(T=R,function(e){var t=e.src,n=e.__imageData,a=e.__error,i=s(e,N);return a&&console.warn(a),n?r.createElement(T,o({image:n},i)):(console.warn("Image not loaded",t),null)});q.displayName="StaticImage",q.propTypes=_},9256:function(e,t,n){n.d(t,{Z:function(){return N}});var r=n(6018),a=n(7294),i=n(7866),o=n(7326),s=n(1721);function c(e,t){var n="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(n)return(n=n.call(e)).next.bind(n);if(Array.isArray(e)||(n=function(e,t){if(!e)return;if("string"==typeof e)return l(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return l(e,t)}(e))||t&&e&&"number"==typeof e.length){n&&(e=n);var r=0;return function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function l(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}var u=function(e,t,n,r,a,i,o){void 0===o&&(o=0),this.showing=!0,this.x=e,this.y=t,this.width=n,this.length=r,this.showingSpeed=a,this.speed=i,this.opacity=o},d=function(e){function t(){for(var t,n=arguments.length,r=new Array(n),a=0;a<n;a++)r[a]=arguments[a];return(t=e.call.apply(e,[this].concat(r))||this).lines=[],t.animate=function(){var e=(0,o.Z)(t),n=e.ctx,r=e.lines,a=n.canvas,i=a.width,s=a.height;n.clearRect(0,0,i,s),r.forEach((function(e){var r=e.x,a=e.y,o=e.width,s=e.length,c=e.showing,l=e.opacity,u=e.showingSpeed,d=e.speed;n.fillStyle="#444444"+l.toString(16).padStart(2,"0"),n.fillRect(r,a-o/2,s,o),e.opacity+=u*(c?1:-1),e.opacity<=0?(e.opacity=0,e.showing=!0):e.opacity>=255&&(e.opacity=255,e.showing=!1),r>i?t.createLine(e,!0):e.x+=d})),requestAnimationFrame(t.animate)},t}(0,s.Z)(t,e);var n=t.prototype;return n.generateObjects=function(){var e,t,n,r,a,i,o=this.lines;o.splice(0);for(var s=0;s<100;){for(var l,u=this.createLine(),d=!0,f=c(o);!(l=f()).done;){var p=l.value,g=p.x,h=p.y;if(t={x:g,y:h},n=void 0,r=void 0,a=void 0,i=void 0,n=(e=u).x,r=e.y,a=t.x,i=t.y,Math.sqrt(Math.pow(n-a,2)+Math.pow(r-i,2))<50){d=!1;break}}d?o.push(u):s++}},n.createLine=function(e,t){void 0===t&&(t=!1);var n=window.innerWidth,r=window.innerHeight,a=function(e,t){return Math.floor(Math.random()*(t-e+1))+e},i=t?0:a(0,n),o=a(0,r),s=a(1,3),c=a(10,50),l=a(1,3),d=a(2,10)/10,f=a(0,255);return e?(e.x=i,e.y=o,e.width=s,e.length=c,e.showingSpeed=l,e.speed=d,e):new u(i,o,s,c,l,d,f)},t}(function(){function e(e){var t=this;this.onResize=function(){var e=t.ctx.canvas;e.width=window.innerWidth,e.height=window.innerHeight,t.generateObjects()},this.ctx=e.getContext("2d")}var t=e.prototype;return t.enable=function(){window.addEventListener("resize",this.onResize),this.onResize(),this.generateObjects(),requestAnimationFrame(this.animate)},t.disable=function(){window.removeEventListener("resize",this.onResize)},t.generateObjects=function(){throw new Error("You should override that method")},t.animate=function(){throw new Error("You should override that method")},e}()),f=n(5893);function p(){var e=(0,a.useRef)(null),t=(0,a.useRef)(),n=g()[0];return(0,a.useEffect)((function(){if(e.current)return t.current=new d(e.current),t.current.enable(),function(){var e;return null===(e=t.current)||void 0===e?void 0:e.disable()}}),[e.current]),(0,f.jsx)("canvas",{className:n.blinkingLinesBgr,ref:e})}var g=(0,i.Z)({blinkingLinesBgr:{position:"absolute",left:0,top:0,width:"100%",height:"100%"}}),h=n(3723);function m(){var e=v()[0];return(0,f.jsx)("hr",{className:e.navSeparator})}var v=(0,r.R)({navSeparator:{width:"50%"}});function y(e){var t=e.children,n=e.body;t||(t=n);var r=b()[0];return(0,f.jsx)("div",{className:r.navLinkExtension,children:t})}var b=(0,r.R)((function(e){var t=e.atoms;return{navLinkExtension:{position:"absolute",left:"100%",top:10,bottom:10,display:"flex",alignItems:"center",padding:10,backgroundColor:t.colors.surface.main,color:t.colors.surface.text}}})),w=n(3476);function x(){return"undefined"==typeof window?null:window}function j(e){var t,n=e.children,r=e.href,i=C()[0],o=(0,a.useState)(!1),s=o[0],c=o[1];(0,a.useEffect)((function(){var e;[r,r+"/"].includes(null===(e=x())||void 0===e?void 0:e.location.pathname)&&c(!0)}),[]);var l=(0,w.Z)(i.navLink,s&&i.isActive);return console.log(null===(t=x())||void 0===t?void 0:t.location.pathname,r,r+"/",{isCurrentHref:s,className:l}),(0,f.jsx)("a",{className:l,href:r,children:(0,f.jsx)("div",{className:i.content,children:n})})}var C=(0,r.R)({navLink:{position:"relative",display:"block",padding:10,"&::after":{content:'""',position:"absolute",left:-5,top:"50%",translate:"0 -50%",display:"block",width:4,height:4,backgroundColor:"#fff",borderRadius:"15px",transition:"left 0.05s"},"&:hover::after, &$isActive::after":{left:2},"&$isActive::after":{height:20},"&:not( $isActive ):hover $content":{borderRadius:20}},content:{borderRadius:"50%",overflow:"hidden",transition:"border-radius 0.1s"},isActive:{"& $content":{borderRadius:10}}}),k="../../../../images";function S(){var e=E()[0];return(0,f.jsxs)("nav",{className:e.nav,children:[(0,f.jsx)(j,{href:"/",children:(0,f.jsx)(h.S,{src:k+"/cactu-logo.png",alt:"Cactu logo",__imageData:n(7587)})}),(0,f.jsx)(m,{}),(0,f.jsxs)(j,{href:"/jam",children:[(0,f.jsx)(h.S,{src:k+"/cactu-jam.png",alt:"CactuJam temporary icon",__imageData:n(1232)}),(0,f.jsx)(y,{body:"CactuJam"})]})]})}var E=(0,r.R)((function(e){return{nav:{width:75,backgroundColor:e.atoms.colors.surface.main,backdropFilter:"blur( 2px )"}}})),L=n(8427),A=function(e){var t=(0,a.useState)(void 0!==e?"function"==typeof e?e():e:{}),n=t[0],r=t[1];return[n,function(e,t){return"function"==typeof e?r((function(t){return e(t)})):"object"!=typeof e||Array.isArray(e)?"string"==typeof e&&t?r((function(n){var r,a;return n?Object.assign({},n,((r={})[e]=t,r)):((a={})[e]=t,a)})):void 0:r((function(t){return t?Object.assign({},t,e):Object.assign({},e)}))}]};function O(e){var t=e.children,n=e.themeConfig,r=(0,a.useMemo)((function(){var e;return null!==(e=n.state)&&void 0!==e?e:{}}),[n]),i=A(r),o=i[0],s=i[1],c=(0,a.useMemo)((function(){return e=Object.assign({},n,{state:o}),l=null!==(t=e.state)&&void 0!==t?t:{},u=null!==(r=null===(a=e.atoms)||void 0===a?void 0:a.call(e,{state:l}))&&void 0!==r?r:{},d=null===(i=e.mixins)||void 0===i?void 0:i.call(e,{state:l,atoms:u}),{state:l,atoms:u,mixins:d,components:null!==(s=null===(c=e.components)||void 0===c?void 0:c.call(e,{state:l,atoms:u,mixins:d}))&&void 0!==s?s:{}};var e,t,r,a,i,s,c,l,u,d}),[n,o]);return(0,a.useEffect)((function(){var e;null===(e=n.onStateChange)||void 0===e||e.call(n,o)}),[o]),(0,f.jsx)(L.f6,{theme:Object.assign({},c,{state:o,setState:function(e,t){return s(e,t)}}),children:t})}function R(e){var t=e.children;return(0,f.jsx)(O,{themeConfig:r.c,children:t})}function T(e){var t=e.children,n=z()[0];return(0,f.jsxs)("div",{className:n.mainLayout,children:[(0,f.jsx)(p,{}),(0,f.jsx)(S,{}),(0,f.jsx)("div",{className:n.content,children:t})]})}function N(e){var t=e.children;return(0,f.jsx)(R,{children:(0,f.jsx)(T,{children:t})})}var z=(0,r.R)((function(e){var t=e.atoms;return{"@global":{"@font-face":{fontFamily:"Coconut",src:"url( /fonts/Coconut.ttf )"},body:{margin:0,backgroundColor:t.colors.background.main,backgroundImage:"linear-gradient( 135deg, "+t.colors.background.dark+", "+t.colors.background.light+" )",fontFamily:"sans-serif"}},mainLayout:{display:"flex",minHeight:"100vh"},content:{flexGrow:1}}}))},6018:function(e,t,n){n.d(t,{R:function(){return o},c:function(){return s}});var r=n(8427),a=n(7866);var i=function(e){return{themeConfig:e,createStylesHook:function(e){return(0,a.Z)(e)},useTheme:r.Fg}}({atoms:function(){return{colors:{rest:{green:"#5da234"},background:{dark:"#202022",light:"#22232a",main:"#212226",text:"#eaeaea"},surface:{main:"#05051055",text:"#eaeaea"}}}}}),o=i.createStylesHook,s=i.themeConfig},3476:function(e,t,n){function r(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return t.reduce((function(e,t){return t&&"string"==typeof t?e+" "+t.trim():e}),"").trim()}function a(){return r.apply(void 0,arguments)}n.d(t,{Z:function(){return a}})},7866:function(e,t,n){n.d(t,{Z:function(){return i}});var r=n(7542),a=n(8427);function i(e){var t=(0,r.QM)(e);return function(){var e=(0,a.Fg)();if(!e)throw new Error("You are trying to use theming functionality outside theming context");return[t(),e]}}},7587:function(e){e.exports=JSON.parse('{"layout":"constrained","backgroundColor":"#282828","images":{"fallback":{"src":"/static/e44cfc1ce7bb6e54c34597a12bded7e4/6c9d4/cactu-logo.png","srcSet":"/static/e44cfc1ce7bb6e54c34597a12bded7e4/a2c25/cactu-logo.png 180w,\\n/static/e44cfc1ce7bb6e54c34597a12bded7e4/257af/cactu-logo.png 360w,\\n/static/e44cfc1ce7bb6e54c34597a12bded7e4/6c9d4/cactu-logo.png 720w","sizes":"(min-width: 720px) 720px, 100vw"},"sources":[{"srcSet":"/static/e44cfc1ce7bb6e54c34597a12bded7e4/52f83/cactu-logo.webp 180w,\\n/static/e44cfc1ce7bb6e54c34597a12bded7e4/27ab5/cactu-logo.webp 360w,\\n/static/e44cfc1ce7bb6e54c34597a12bded7e4/88c6b/cactu-logo.webp 720w","type":"image/webp","sizes":"(min-width: 720px) 720px, 100vw"}]},"width":720,"height":720}')},1232:function(e){e.exports=JSON.parse('{"layout":"constrained","backgroundColor":"#282828","images":{"fallback":{"src":"/static/76537406242ce3c98903ba83c2ac1a11/6c9d4/cactu-jam.png","srcSet":"/static/76537406242ce3c98903ba83c2ac1a11/a2c25/cactu-jam.png 180w,\\n/static/76537406242ce3c98903ba83c2ac1a11/257af/cactu-jam.png 360w,\\n/static/76537406242ce3c98903ba83c2ac1a11/6c9d4/cactu-jam.png 720w","sizes":"(min-width: 720px) 720px, 100vw"},"sources":[{"srcSet":"/static/76537406242ce3c98903ba83c2ac1a11/52f83/cactu-jam.webp 180w,\\n/static/76537406242ce3c98903ba83c2ac1a11/27ab5/cactu-jam.webp 360w,\\n/static/76537406242ce3c98903ba83c2ac1a11/88c6b/cactu-jam.webp 720w","type":"image/webp","sizes":"(min-width: 720px) 720px, 100vw"}]},"width":720,"height":720}')}}]);
//# sourceMappingURL=commons-cb8a47c6de7fd5a74fd3.js.map