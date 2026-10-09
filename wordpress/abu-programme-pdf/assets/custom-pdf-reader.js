/*! For license information please see custom-pdf-reader.js.LICENSE.txt */
(()=>{"use strict";const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),i=new WeakMap;class r{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const s=this.t;if(e&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=i.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&i.set(s,t))}return t}toString(){return this.cssText}}const n=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]);return new r(i,t,s)},o=(s,i)=>{if(e)s.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of i){const i=document.createElement("style"),r=t.litNonce;void 0!==r&&i.setAttribute("nonce",r),i.textContent=e.cssText,s.appendChild(i)}},a=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new r("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:h,defineProperty:l,getOwnPropertyDescriptor:d,getOwnPropertyNames:c,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,_=globalThis,g=_.trustedTypes,f=g?g.emptyScript:"",$=_.reactiveElementPolyfillSupport,m=(t,e)=>t,b={toAttribute(t,e){switch(e){case Boolean:t=t?f:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},y=(t,e)=>!h(t,e),v={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:y};Symbol.metadata??=Symbol("metadata"),_.litPropertyMetadata??=new WeakMap;class w extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=v){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&l(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:r}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const n=i?.call(this);r?.call(this,e),this.requestUpdate(t,n,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??v}static _$Ei(){if(this.hasOwnProperty(m("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(m("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(m("properties"))){const t=this.properties,e=[...c(t),...p(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return o(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const r=(void 0!==s.converter?.toAttribute?s.converter:b).toAttribute(e,s.type);this._$Em=t,null==r?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:b;this._$Em=i;const n=r.fromAttribute(e,t.type);this[i]=n??this._$Ej?.get(i)??n,this._$Em=null}}requestUpdate(t,e,s,i=!1,r){if(void 0!==t){const n=this.constructor;if(!1===i&&(r=this[t]),s??=n.getPropertyOptions(t),!((s.hasChanged??y)(r,e)||s.useDefault&&s.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:r},n){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),!0!==r||void 0!==n)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,s,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}}w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[m("elementProperties")]=new Map,w[m("finalized")]=new Map,$?.({ReactiveElement:w}),(_.reactiveElementVersions??=[]).push("2.1.2");const A=globalThis,x=t=>t,P=A.trustedTypes,E=P?P.createPolicy("lit-html",{createHTML:t=>t}):void 0,S="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,U="?"+C,k=`<${U}>`,O=document,M=()=>O.createComment(""),R=t=>null===t||"object"!=typeof t&&"function"!=typeof t,T=Array.isArray,j="[ \t\n\f\r]",N=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,H=/-->/g,D=/>/g,z=RegExp(`>|${j}(?:([^\\s"'>=/]+)(${j}*=${j}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),L=/'/g,V=/"/g,q=/^(?:script|style|textarea|title)$/i,F=t=>(e,...s)=>({_$litType$:t,strings:e,values:s}),W=F(1),I=(F(2),F(3),Symbol.for("lit-noChange")),B=Symbol.for("lit-nothing"),Z=new WeakMap,G=O.createTreeWalker(O,129);function J(t,e){if(!T(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==E?E.createHTML(e):e}const K=(t,e)=>{const s=t.length-1,i=[];let r,n=2===e?"<svg>":3===e?"<math>":"",o=N;for(let e=0;e<s;e++){const s=t[e];let a,h,l=-1,d=0;for(;d<s.length&&(o.lastIndex=d,h=o.exec(s),null!==h);)d=o.lastIndex,o===N?"!--"===h[1]?o=H:void 0!==h[1]?o=D:void 0!==h[2]?(q.test(h[2])&&(r=RegExp("</"+h[2],"g")),o=z):void 0!==h[3]&&(o=z):o===z?">"===h[0]?(o=r??N,l=-1):void 0===h[1]?l=-2:(l=o.lastIndex-h[2].length,a=h[1],o=void 0===h[3]?z:'"'===h[3]?V:L):o===V||o===L?o=z:o===H||o===D?o=N:(o=z,r=void 0);const c=o===z&&t[e+1].startsWith("/>")?" ":"";n+=o===N?s+k:l>=0?(i.push(a),s.slice(0,l)+S+s.slice(l)+C+c):s+C+(-2===l?e:c)}return[J(t,n+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class Q{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let r=0,n=0;const o=t.length-1,a=this.parts,[h,l]=K(t,e);if(this.el=Q.createElement(h,s),G.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=G.nextNode())&&a.length<o;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(S)){const e=l[n++],s=i.getAttribute(t).split(C),o=/([.?@])?(.*)/.exec(e);a.push({type:1,index:r,name:o[2],strings:s,ctor:"."===o[1]?st:"?"===o[1]?it:"@"===o[1]?rt:et}),i.removeAttribute(t)}else t.startsWith(C)&&(a.push({type:6,index:r}),i.removeAttribute(t));if(q.test(i.tagName)){const t=i.textContent.split(C),e=t.length-1;if(e>0){i.textContent=P?P.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],M()),G.nextNode(),a.push({type:2,index:++r});i.append(t[e],M())}}}else if(8===i.nodeType)if(i.data===U)a.push({type:2,index:r});else{let t=-1;for(;-1!==(t=i.data.indexOf(C,t+1));)a.push({type:7,index:r}),t+=C.length-1}r++}}static createElement(t,e){const s=O.createElement("template");return s.innerHTML=t,s}}function X(t,e,s=t,i){if(e===I)return e;let r=void 0!==i?s._$Co?.[i]:s._$Cl;const n=R(e)?void 0:e._$litDirective$;return r?.constructor!==n&&(r?._$AO?.(!1),void 0===n?r=void 0:(r=new n(t),r._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=r:s._$Cl=r),void 0!==r&&(e=X(t,r._$AS(t,e.values),r,i)),e}class Y{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??O).importNode(e,!0);G.currentNode=i;let r=G.nextNode(),n=0,o=0,a=s[0];for(;void 0!==a;){if(n===a.index){let e;2===a.type?e=new tt(r,r.nextSibling,this,t):1===a.type?e=new a.ctor(r,a.name,a.strings,this,t):6===a.type&&(e=new nt(r,this,t)),this._$AV.push(e),a=s[++o]}n!==a?.index&&(r=G.nextNode(),n++)}return G.currentNode=O,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class tt{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=B,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=X(this,t,e),R(t)?t===B||null==t||""===t?(this._$AH!==B&&this._$AR(),this._$AH=B):t!==this._$AH&&t!==I&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>T(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==B&&R(this._$AH)?this._$AA.nextSibling.data=t:this.T(O.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=Q.createElement(J(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new Y(i,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=Z.get(t.strings);return void 0===e&&Z.set(t.strings,e=new Q(t)),e}k(t){T(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const r of t)i===e.length?e.push(s=new tt(this.O(M()),this.O(M()),this,this.options)):s=e[i],s._$AI(r),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=x(t).nextSibling;x(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class et{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,r){this.type=1,this._$AH=B,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=r,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=B}_$AI(t,e=this,s,i){const r=this.strings;let n=!1;if(void 0===r)t=X(this,t,e,0),n=!R(t)||t!==this._$AH&&t!==I,n&&(this._$AH=t);else{const i=t;let o,a;for(t=r[0],o=0;o<r.length-1;o++)a=X(this,i[s+o],e,o),a===I&&(a=this._$AH[o]),n||=!R(a)||a!==this._$AH[o],a===B?t=B:t!==B&&(t+=(a??"")+r[o+1]),this._$AH[o]=a}n&&!i&&this.j(t)}j(t){t===B?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class st extends et{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===B?void 0:t}}class it extends et{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==B)}}class rt extends et{constructor(t,e,s,i,r){super(t,e,s,i,r),this.type=5}_$AI(t,e=this){if((t=X(this,t,e,0)??B)===I)return;const s=this._$AH,i=t===B&&s!==B||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,r=t!==B&&(s===B||i);i&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class nt{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){X(this,t)}}const ot=A.litHtmlPolyfillSupport;ot?.(Q,tt),(A.litHtmlVersions??=[]).push("3.3.3");const at=globalThis;class ht extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const i=s?.renderBefore??e;let r=i._$litPart$;if(void 0===r){const t=s?.renderBefore??null;i._$litPart$=r=new tt(e.insertBefore(M(),t),t,void 0,s??{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return I}}ht._$litElement$=!0,ht.finalized=!0,at.litElementHydrateSupport?.({LitElement:ht});const lt=at.litElementPolyfillSupport;var dt;lt?.({LitElement:ht}),(at.litElementVersions??=[]).push("4.2.2");const ct="https://cdnjs.cloudflare.com/ajax/libs/pdf.js";let pt;dt=(t=>(e,s)=>{void 0!==s?s.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)})("custom-pdf-reader"),dt(class extends ht{static styles=n`
    :host {
      display: block;
      max-width: 100%;
    }
    .viewer {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      overflow: hidden;
      box-sizing: border-box;
      border: 1px solid #cbd5e1;
      background: #f1f5f9;
    }
    .toolbar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 5px;
      min-height: 42px;
      padding: 5px 8px;
      box-sizing: border-box;
      background: #1f2937;
      color: #fff;
      font: 13px sans-serif;
    }
    .toolbar a {
      color: #fff;
      margin-left: auto;
    }
    .toolbar button[aria-pressed='true'] {
      background: #2563eb;
      color: #fff;
    }
    .body {
      display: flex;
      flex: 1;
      min-height: 0;
    }
    .panel {
      flex: 0 0 150px;
      max-width: 45%;
      overflow: auto;
      padding: 8px;
      background: #fff;
      border-right: 1px solid #cbd5e1;
      font: 13px sans-serif;
    }
    .panel[hidden] {
      display: none;
    }
    .thumb {
      display: flex;
      width: 100%;
      min-height: 160px;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 8px 4px;
      border: 2px solid transparent;
      background: transparent;
      cursor: pointer;
    }
    .thumb[aria-current='page'] {
      border-color: #2563eb;
    }
    .thumb canvas {
      max-width: 100px;
      max-height: 132px;
      background: #fff;
      box-shadow: 0 1px 4px #0003;
    }
    .page-area {
      flex: 1;
      min-width: 0;
      min-height: 0;
      overflow: auto;
      padding: 12px;
      text-align: center;
    }
    .pages {
      display: flex;
      width: max-content;
      min-width: 100%;
      align-items: flex-start;
      justify-content: center;
      gap: 12px;
    }
    .pages.continuous {
      flex-direction: column;
      align-items: center;
      width: 100%;
    }
    .pages canvas {
      flex: 0 0 auto;
      max-width: none;
      background: #fff;
      box-shadow: 0 1px 4px #0003;
    }
  `;static properties={pdfUrl:{type:String,attribute:"pdf-url"},width:{type:String},height:{type:String},pdfjsVersion:{type:String,attribute:"pdfjs-version"},pdfjsUrl:{type:String,attribute:"pdfjs-url"},pdfjsWorkerUrl:{type:String,attribute:"pdfjs-worker-url"},continuous:{type:Boolean},_status:{state:!0},_pageNumber:{state:!0},_numPages:{state:!0},_scale:{state:!0},_fitMode:{state:!0},_rotation:{state:!0},_layout:{state:!0},_panelOpen:{state:!0}};constructor(){super(),this.pdfUrl="",this.width="600px",this.height="849px",this.pdfjsVersion="3.11.174",this.pdfjsUrl="",this.pdfjsWorkerUrl="",this.continuous=!1,this._status="Loading PDF...",this._pageNumber=1,this._numPages=0,this._scale=1,this._fitMode="width",this._rotation=0,this._layout="single",this._panelOpen=!1,this._pdf=null,this._rendering=!1,this._pendingRender=!1,this._thumbs=new Set,this._loadToken=0,this._resizeObserver=null,this._pageObserver=null}_$(t){return this.renderRoot?.querySelector(t)}get _pdfjsScriptUrl(){return this.pdfjsUrl||`${ct}/${encodeURIComponent(this.pdfjsVersion)}/pdf.min.js`}get _pdfjsWorkerUrl(){return this.pdfjsWorkerUrl||`${ct}/${encodeURIComponent(this.pdfjsVersion)}/pdf.worker.min.js`}render(){const t=this.continuous,e=!t&&"spread"===this._layout,s=Math.min(this._numPages,this._pageNumber+(e?1:0)),i=this._numPages?t?`${this._numPages} pages`:e&&s>this._pageNumber?`${this._pageNumber}-${s} / ${this._numPages}`:`${this._pageNumber} / ${this._numPages}`:this._status;return W`
      <div class="viewer" style="width:${this.width}; height:${this.height}; max-width:100%">
        <div class="toolbar">
          ${t?B:W`<button type="button" aria-label="Previous page" title="Previous page" @click=${()=>this._go(-1)}>&#x2039;</button>`}
          <span aria-live="polite">${i}</span>
          ${t?B:W`<button type="button" aria-label="Next page" title="Next page" @click=${()=>this._go(1)}>&#x203A;</button>`}
          <button type="button" aria-pressed=${"width"===this._fitMode} @click=${()=>this._setFit("width")}>Fit width</button>
          <button type="button" aria-pressed=${"page"===this._fitMode} @click=${()=>this._setFit("page")}>Fit page</button>
          <button type="button" title="Rotate clockwise" @click=${this._rotate}>Rotate</button>
          ${t?B:W`
                <button type="button" aria-pressed=${!e} @click=${()=>this._setLayout("single")}>1 page</button>
                <button type="button" aria-pressed=${e} @click=${()=>this._setLayout("spread")}>2 pages</button>
                <button type="button" aria-expanded=${this._panelOpen} @click=${this._togglePanel}>Pages</button>
              `}
          <button type="button" aria-label="Zoom out" title="Zoom out" @click=${()=>this._zoom(-.2)}>&minus;</button>
          <span>${Math.round(100*this._scale)}%</span>
          <button type="button" aria-label="Zoom in" title="Zoom in" @click=${()=>this._zoom(.2)}>&plus;</button>
          ${this.pdfUrl?W`<a href=${this.pdfUrl} target="_blank" rel="noopener">Open PDF</a>`:B}
        </div>
        <div class="body">
          <aside class="panel" ?hidden=${t||!this._panelOpen} @scroll=${this._renderVisibleThumbs}>
            <div style="display:flex;flex-direction:column">
              ${Array.from({length:t?0:this._numPages},(t,e)=>e+1).map(t=>W`
                  <button
                    type="button"
                    class="thumb"
                    data-page=${t}
                    aria-label="Go to page ${t}"
                    aria-current=${t>=this._pageNumber&&t<=s?"page":B}
                    @click=${()=>this._goTo(t)}
                  >
                    <canvas width="100" height="132"></canvas>
                    <span>Page ${t}</span>
                  </button>
                `)}
            </div>
          </aside>
          <div class="page-area"><div class="pages ${t?"continuous":""}"></div></div>
        </div>
      </div>
    `}firstUpdated(){this._resizeObserver=new ResizeObserver(()=>this._requestRender()),this._resizeObserver.observe(this._$(".page-area"))}connectedCallback(){super.connectedCallback(),this.hasUpdated&&this._resizeObserver?.observe(this._$(".page-area"))}disconnectedCallback(){super.disconnectedCallback(),this._resizeObserver?.disconnect(),this._pageObserver?.disconnect()}updated(t){t.has("continuous")&&void 0!==t.get("continuous")&&this._requestRender(),["pdfUrl","pdfjsVersion","pdfjsUrl","pdfjsWorkerUrl"].some(e=>t.has(e))&&this._load(),t.has("_numPages")&&this._numPages&&(this._thumbs.clear(),this._renderVisibleThumbs())}async _load(){const t=++this._loadToken;if(this._pdf=null,this._numPages=0,this._pageNumber=1,this._$(".pages")?.replaceChildren(),this.pdfUrl){this._status="Loading PDF...";try{const i=await(e=this._pdfjsScriptUrl,s=this._pdfjsWorkerUrl,window.pdfjsLib?(window.pdfjsLib.GlobalWorkerOptions.workerSrc||=s,Promise.resolve(window.pdfjsLib)):(pt||=new Promise((t,i)=>{const r=document.createElement("script");r.src=e,r.async=!0,r.onload=()=>{window.pdfjsLib.GlobalWorkerOptions.workerSrc=s,t(window.pdfjsLib)},r.onerror=()=>{pt=void 0,i(new Error("Unable to load PDF.js"))},document.head.append(r)}),pt)),r=await i.getDocument(this.pdfUrl).promise;if(t!==this._loadToken)return;this._pdf=r,this._numPages=r.numPages,await this.updateComplete,this._requestRender()}catch(e){if(t!==this._loadToken)return;this._status="Unable to load PDF",console.error("PDF.js could not load the PDF.",e)}var e,s}else this._status="No PDF specified"}_step(){return"spread"===this._layout?2:1}_go(t){this._goTo(this._pageNumber+t*this._step())}_goTo(t){this._numPages&&!this.continuous&&(this._pageNumber=Math.min(this._numPages,Math.max(1,t)),this._requestRender())}_zoom(t){this._scale=Math.min(2,Math.max(.4,Math.round(10*(this._scale+t))/10)),this._requestRender()}_setFit(t){this._fitMode=t,this._requestRender()}_setLayout(t){this._layout=t,this._requestRender()}_rotate(){this._rotation=(this._rotation+90)%360,this._thumbs.clear(),this._requestRender(),this._renderVisibleThumbs()}_togglePanel(){this._panelOpen=!this._panelOpen,this.updateComplete.then(()=>{this._requestRender(),this._renderVisibleThumbs()})}_requestRender(){this._renderPages().catch(t=>{this._status="Unable to render PDF page",console.error("PDF.js could not render the PDF.",t)})}async _renderPages(){const t=this._$(".page-area");if(!this._pdf||!t)return;const e=!this.continuous&&"spread"===this._layout;if(!(t.clientWidth<=(e?36:24)||t.clientHeight<=24))if(this._rendering)this._pendingRender=!0;else{this._rendering=!0;try{if(this.continuous)return void await this._renderContinuous(t);const s=e?2:1,i=t.clientWidth-24,r=t.clientHeight-24,n=2===s?(i-12)/2:i,o=window.devicePixelRatio||1,a=Math.min(this._pdf.numPages,this._pageNumber+s-1),h=[],l=[];for(let t=this._pageNumber;t<=a;t+=1){const e=await this._pdf.getPage(t),s=e.getViewport({scale:1,rotation:this._rotation}),i=n/s.width,a="page"===this._fitMode?Math.min(i,r/s.height):i,d=e.getViewport({scale:a*this._scale,rotation:this._rotation}),c=document.createElement("canvas"),p=c.getContext("2d");c.width=Math.floor(d.width*o),c.height=Math.floor(d.height*o),c.style.width=`${d.width}px`,c.style.height=`${d.height}px`,p.setTransform(o,0,0,o,0,0),h.push(c),l.push(e.render({canvasContext:p,viewport:d}).promise)}this._$(".pages").replaceChildren(...h),await Promise.all(l)}finally{this._rendering=!1,this._pendingRender&&(this._pendingRender=!1,requestAnimationFrame(()=>this._requestRender()))}}}async _renderContinuous(t){const e=t.clientWidth-24,s=t.clientHeight-24,i=window.devicePixelRatio||1,r=t.scrollHeight?t.scrollTop/t.scrollHeight:0,n=this._pdf,o=this._rotation,a=[];for(let t=1;t<=n.numPages;t+=1){const r=await n.getPage(t),h=r.getViewport({scale:1,rotation:o}),l=e/h.width,d="page"===this._fitMode?Math.min(l,s/h.height):l,c=r.getViewport({scale:d*this._scale,rotation:o}),p=document.createElement("canvas");p.style.width=`${c.width}px`,p.style.height=`${c.height}px`,p._draw=()=>{p.width=Math.floor(c.width*i),p.height=Math.floor(c.height*i);const t=p.getContext("2d");return t.setTransform(i,0,0,i,0,0),r.render({canvasContext:t,viewport:c}).promise},a.push(p)}n===this._pdf&&this.continuous&&(this._pageObserver?.disconnect(),this._$(".pages").replaceChildren(...a),t.scrollTop=r*t.scrollHeight,this._pageObserver=new IntersectionObserver(t=>{t.forEach(t=>{t.isIntersecting&&(this._pageObserver.unobserve(t.target),t.target._draw().catch(t=>console.error("PDF.js could not render a page.",t)))})},{root:t,rootMargin:"800px 0px"}),a.forEach(t=>this._pageObserver.observe(t)))}_renderVisibleThumbs=()=>{if(!this._pdf||!this._panelOpen)return;const t=this._$(".panel"),e=t.getBoundingClientRect();t.querySelectorAll(".thumb").forEach(t=>{const s=t.getBoundingClientRect();s.bottom>=e.top-120&&s.top<=e.bottom+120&&this._renderThumb(t)})};async _renderThumb(t){const e=Number(t.dataset.page);if(!this._thumbs.has(e)){this._thumbs.add(e);try{const s=await this._pdf.getPage(e),i=s.getViewport({scale:1,rotation:this._rotation}),r=Math.min(100/i.width,132/i.height),n=s.getViewport({scale:r,rotation:this._rotation}),o=t.querySelector("canvas"),a=o.getContext("2d"),h=Math.min(window.devicePixelRatio||1,2);o.width=Math.ceil(n.width*h),o.height=Math.ceil(n.height*h),o.style.width=`${n.width}px`,o.style.height=`${n.height}px`,a.setTransform(h,0,0,h,0,0),await s.render({canvasContext:a,viewport:n}).promise}catch(t){console.error("PDF.js could not render a page thumbnail.",t)}}}})})();