/*! For license information please see flickr-mosaic.js.LICENSE.txt */
(()=>{"use strict";const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),s=new WeakMap;class r{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const i=this.t;if(e&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=s.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&s.set(i,t))}return t}toString(){return this.cssText}}const o=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new r(s,t,i)},n=(i,s)=>{if(e)i.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of s){const s=document.createElement("style"),r=t.litNonce;void 0!==r&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}},a=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new r("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:l,defineProperty:h,getOwnPropertyDescriptor:c,getOwnPropertyNames:d,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,f=globalThis,m=f.trustedTypes,g=m?m.emptyScript:"",$=f.reactiveElementPolyfillSupport,y=(t,e)=>t,_={toAttribute(t,e){switch(e){case Boolean:t=t?g:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},b=(t,e)=>!l(t,e),A={attribute:!0,type:String,converter:_,reflect:!1,useDefault:!1,hasChanged:b};Symbol.metadata??=Symbol("metadata"),f.litPropertyMetadata??=new WeakMap;class v extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=A){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&h(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:r}=c(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const o=s?.call(this);r?.call(this,e),this.requestUpdate(t,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??A}static _$Ei(){if(this.hasOwnProperty(y("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(y("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(y("properties"))){const t=this.properties,e=[...d(t),...p(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return n(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const r=(void 0!==i.converter?.toAttribute?i.converter:_).toAttribute(e,i.type);this._$Em=t,null==r?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:_;this._$Em=s;const o=r.fromAttribute(e,t.type);this[s]=o??this._$Ej?.get(s)??o,this._$Em=null}}requestUpdate(t,e,i,s=!1,r){if(void 0!==t){const o=this.constructor;if(!1===s&&(r=this[t]),i??=o.getPropertyOptions(t),!((i.hasChanged??b)(r,e)||i.useDefault&&i.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:r},o){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),!0!==r||void 0!==o)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}}v.elementStyles=[],v.shadowRootOptions={mode:"open"},v[y("elementProperties")]=new Map,v[y("finalized")]=new Map,$?.({ReactiveElement:v}),(f.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,x=t=>t,k=w.trustedTypes,E=k?k.createPolicy("lit-html",{createHTML:t=>t}):void 0,S="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,P="?"+C,U=`<${P}>`,M=document,H=()=>M.createComment(""),O=t=>null===t||"object"!=typeof t&&"function"!=typeof t,N=Array.isArray,R="[ \t\n\f\r]",T=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,z=/-->/g,I=/>/g,j=RegExp(`>|${R}(?:([^\\s"'>=/]+)(${R}*=${R}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),L=/'/g,D=/"/g,B=/^(?:script|style|textarea|title)$/i,q=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),V=q(1),W=(q(2),q(3),Symbol.for("lit-noChange")),F=Symbol.for("lit-nothing"),J=new WeakMap,Z=M.createTreeWalker(M,129);function K(t,e){if(!N(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==E?E.createHTML(e):e}const Y=(t,e)=>{const i=t.length-1,s=[];let r,o=2===e?"<svg>":3===e?"<math>":"",n=T;for(let e=0;e<i;e++){const i=t[e];let a,l,h=-1,c=0;for(;c<i.length&&(n.lastIndex=c,l=n.exec(i),null!==l);)c=n.lastIndex,n===T?"!--"===l[1]?n=z:void 0!==l[1]?n=I:void 0!==l[2]?(B.test(l[2])&&(r=RegExp("</"+l[2],"g")),n=j):void 0!==l[3]&&(n=j):n===j?">"===l[0]?(n=r??T,h=-1):void 0===l[1]?h=-2:(h=n.lastIndex-l[2].length,a=l[1],n=void 0===l[3]?j:'"'===l[3]?D:L):n===D||n===L?n=j:n===z||n===I?n=T:(n=j,r=void 0);const d=n===j&&t[e+1].startsWith("/>")?" ":"";o+=n===T?i+U:h>=0?(s.push(a),i.slice(0,h)+S+i.slice(h)+C+d):i+C+(-2===h?e:d)}return[K(t,o+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class G{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let r=0,o=0;const n=t.length-1,a=this.parts,[l,h]=Y(t,e);if(this.el=G.createElement(l,i),Z.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=Z.nextNode())&&a.length<n;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(S)){const e=h[o++],i=s.getAttribute(t).split(C),n=/([.?@])?(.*)/.exec(e);a.push({type:1,index:r,name:n[2],strings:i,ctor:"."===n[1]?it:"?"===n[1]?st:"@"===n[1]?rt:et}),s.removeAttribute(t)}else t.startsWith(C)&&(a.push({type:6,index:r}),s.removeAttribute(t));if(B.test(s.tagName)){const t=s.textContent.split(C),e=t.length-1;if(e>0){s.textContent=k?k.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],H()),Z.nextNode(),a.push({type:2,index:++r});s.append(t[e],H())}}}else if(8===s.nodeType)if(s.data===P)a.push({type:2,index:r});else{let t=-1;for(;-1!==(t=s.data.indexOf(C,t+1));)a.push({type:7,index:r}),t+=C.length-1}r++}}static createElement(t,e){const i=M.createElement("template");return i.innerHTML=t,i}}function Q(t,e,i=t,s){if(e===W)return e;let r=void 0!==s?i._$Co?.[s]:i._$Cl;const o=O(e)?void 0:e._$litDirective$;return r?.constructor!==o&&(r?._$AO?.(!1),void 0===o?r=void 0:(r=new o(t),r._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=r:i._$Cl=r),void 0!==r&&(e=Q(t,r._$AS(t,e.values),r,s)),e}class X{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??M).importNode(e,!0);Z.currentNode=s;let r=Z.nextNode(),o=0,n=0,a=i[0];for(;void 0!==a;){if(o===a.index){let e;2===a.type?e=new tt(r,r.nextSibling,this,t):1===a.type?e=new a.ctor(r,a.name,a.strings,this,t):6===a.type&&(e=new ot(r,this,t)),this._$AV.push(e),a=i[++n]}o!==a?.index&&(r=Z.nextNode(),o++)}return Z.currentNode=M,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class tt{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=F,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Q(this,t,e),O(t)?t===F||null==t||""===t?(this._$AH!==F&&this._$AR(),this._$AH=F):t!==this._$AH&&t!==W&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>N(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==F&&O(this._$AH)?this._$AA.nextSibling.data=t:this.T(M.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=G.createElement(K(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new X(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=J.get(t.strings);return void 0===e&&J.set(t.strings,e=new G(t)),e}k(t){N(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const r of t)s===e.length?e.push(i=new tt(this.O(H()),this.O(H()),this,this.options)):i=e[s],i._$AI(r),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=x(t).nextSibling;x(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class et{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,r){this.type=1,this._$AH=F,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=F}_$AI(t,e=this,i,s){const r=this.strings;let o=!1;if(void 0===r)t=Q(this,t,e,0),o=!O(t)||t!==this._$AH&&t!==W,o&&(this._$AH=t);else{const s=t;let n,a;for(t=r[0],n=0;n<r.length-1;n++)a=Q(this,s[i+n],e,n),a===W&&(a=this._$AH[n]),o||=!O(a)||a!==this._$AH[n],a===F?t=F:t!==F&&(t+=(a??"")+r[n+1]),this._$AH[n]=a}o&&!s&&this.j(t)}j(t){t===F?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class it extends et{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===F?void 0:t}}class st extends et{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==F)}}class rt extends et{constructor(t,e,i,s,r){super(t,e,i,s,r),this.type=5}_$AI(t,e=this){if((t=Q(this,t,e,0)??F)===W)return;const i=this._$AH,s=t===F&&i!==F||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==F&&(i===F||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class ot{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Q(this,t)}}const nt=w.litHtmlPolyfillSupport;nt?.(G,tt),(w.litHtmlVersions??=[]).push("3.3.3");const at=globalThis;class lt extends v{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let r=s._$litPart$;if(void 0===r){const t=i?.renderBefore??null;s._$litPart$=r=new tt(e.insertBefore(H(),t),t,void 0,i??{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return W}}lt._$litElement$=!0,lt.finalized=!0,at.litElementHydrateSupport?.({LitElement:lt});const ht=at.litElementPolyfillSupport;ht?.({LitElement:lt}),(at.litElementVersions??=[]).push("4.2.2");const ct=t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)};ct("film-strip")(class extends lt{static properties={images:{type:Array},index:{type:Number}};static styles=o`
		:host {
			display: block;
			height: 100%;
			min-width: 0;
			overflow: hidden;
		}

		.window {
			height: 100%;
			overflow: hidden;
			position: relative;
		}

		.track {
			animation: drift var(--drift-duration, 34s) ease-in-out infinite alternate;
			will-change: transform;
		}

		.track:hover {
			animation-play-state: paused;
		}

		.sequence {
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			gap: 8px;
			padding-bottom: 8px;
		}

		img {
			aspect-ratio: 4 / 3;
			background: #262626;
			border-radius: 2px;
			display: block;
			flex: 0 0 auto;
			object-fit: cover;
			position: relative;
			transition: transform 180ms ease, filter 180ms ease, opacity 180ms ease;
			width: 100%;
		}

		.track:has(img:hover) img:not(:hover) {
			filter: blur(3px);
			opacity: 0.55;
		}

		img:hover {
			filter: drop-shadow(0 8px 10px rgba(0, 0, 0, 0.55));
			transform: scale(1.25);
			z-index: 1;
		}

		@keyframes drift {
			to {
				transform: translateY(-50%);
			}
		}

		@media (prefers-reduced-motion: reduce) {
			.track {
				animation: none;
			}
		}
	`;constructor(){super(),this.images=[],this.index=0}render(){if(!this.images?.length)return V`<div class="window" aria-hidden="true"></div>`;const t=(this.index%this.images.length+this.images.length)%this.images.length,e=[...this.images.slice(t),...this.images.slice(0,t)].slice(0,16+Math.floor(5*Math.random())),i=25+t%5*3+2*Math.random();return V`
			<div class="window" aria-label="Moving vertical photo strip">
				<div class="track" style="--drift-duration: ${i}s">
					${[0,1].map(()=>V`
						<div class="sequence" aria-hidden="true">
							${e.map(t=>V`<img src=${t} alt="" loading="lazy" />`)}
						</div>
					`)}
				</div>
			</div>
		`}}),ct("flickr-mosaic")(class extends lt{static styles=o`
    :host {
      display: block;
      box-sizing: border-box;
      --container-width: 100%;
      --container-height: 500px;
      --background-color: #1d1d1f;
      --border-color: #1d1d1f;
      --columns: 5;
      --gap: 10px;
      user-select: none;
      overflow: hidden;
    }

    .container {
      width: var(--container-width);
      height: var(--container-height);
      border: var(--gap) solid var(--border-color);
      background-color: var(--background-color);
      display: grid;
      grid-template-columns: repeat(var(--columns), 1fr);
      gap: var(--gap);
      position: relative;
    }

    .gallery-panel {
      position: absolute;
      left: clamp(0.75rem, 2vw, 1.5rem);
      bottom: clamp(0.75rem, 2vw, 1.5rem);
      width: min(25rem, calc(100% - 1.5rem));
      box-sizing: border-box;
      padding: 1rem 1.15rem 1.15rem;
      z-index: 1;
      isolation: isolate;
      display: grid;
      gap: 0.7rem;
      overflow: hidden;
      border: 1px solid rgba(224, 240, 246, 0.28);
      border-left: 3px solid #67ddff;
      border-radius: 6px;
      background: linear-gradient(135deg, rgba(11, 26, 33, 0.96), rgba(15, 20, 24, 0.88));
      box-shadow: 0 14px 36px rgba(0, 0, 0, 0.36);
      backdrop-filter: blur(12px);
      color: #f7fbfc;

      & .orbit {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        overflow: visible;
        opacity: 0;
        pointer-events: none;
        filter: drop-shadow(0 0 4px rgba(88, 218, 255, 0.85));
        transition: opacity 180ms ease;
        z-index: -1;
      }

      & .orbit .tail,
      & .orbit .head {
        fill: none;
        stroke-linecap: round;
        animation: orbit-border 4s linear infinite;
        animation-play-state: paused;
      }

      & .orbit .tail {
        stroke: #67ddff;
        stroke-width: 2.5;
        stroke-opacity: 0.5;
        stroke-dasharray: 72 1554;
      }

      & .orbit .head {
        stroke: #fff;
        stroke-width: 3;
        stroke-dasharray: 6 1620;
        animation-delay: -80ms;
      }

      & .brand-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
      }

      & .brand-logo {
        display: block;
        width: 8.5rem;
        max-height: 2.5rem;
        object-fit: contain;
        object-position: left center;
      }

      & .eyebrow {
        margin: 0;
        font-family: 'Montserrat', sans-serif;
        font-size: 0.68rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #9ddced;
      }

      & .gallery-title {
        margin: 0;
        max-width: 14ch;
        color: #fff;
        font-family: 'Montserrat', sans-serif;
        font-size: 2rem;
        font-weight: 600;
        line-height: 1.08;
      }

      & .description {
        max-width: 36ch;
        margin: 0;
        color: rgba(242, 248, 250, 0.82);
        font-family: 'Montserrat', sans-serif;
        font-size: 0.92rem;
        line-height: 1.5;
      }

      & .gallery-link {
        display: inline-flex;
        align-items: center;
        justify-self: start;
        gap: 0.65rem;
        min-height: 2.75rem;
        box-sizing: border-box;
        padding: 0.55rem 0.75rem;
        border: 1px solid rgba(255, 255, 255, 0.72);
        border-radius: 4px;
        background: #f5fafc;
        color: #102832;
        font-family: 'Montserrat', sans-serif;
        font-size: 0.84rem;
        font-weight: 700;
        line-height: 1.2;
        text-decoration: none;
        transition: background-color 160ms ease, transform 160ms ease;
      }

      & .gallery-link:hover {
        transform: translateY(-2px);
        background: #fff;
      }

      & .gallery-link:focus-visible {
        outline: 2px solid #67ddff;
        outline-offset: 3px;
      }

      & .flickr-mark {
        display: block;
        width: auto;
        max-width: 3.5rem;
        max-height: 1rem;
        padding: 0.2rem 0.3rem;
        border-radius: 2px;
        background: #fff;
      }

      & .external-arrow {
        font-size: 1.1rem;
        line-height: 1;
      }
    }

    .gallery-panel:is(:hover, :focus-within) {
      & .orbit {
        opacity: 1;
      }

      & .orbit .tail,
      & .orbit .head {
        animation-play-state: running;
      }

    }

    @keyframes orbit-border {
      from {
        stroke-dashoffset: 0;
      }

      to {
        stroke-dashoffset: -1626px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .gallery-panel .orbit {
        opacity: 0;
      }

      .gallery-panel .orbit .tail,
      .gallery-panel .orbit .head {
        animation: none;
      }

      .gallery-panel .gallery-link {
        transition: none;
      }
    }

    @media (max-width: 600px) {
      .gallery-panel {
        left: 0.65rem;
        bottom: 0.65rem;
        width: calc(100% - 1.3rem);
        gap: 0.55rem;
        padding: 0.85rem 0.9rem 0.9rem;
      }

      .gallery-panel .brand-logo {
        width: 7.25rem;
        max-height: 2rem;
      }

      .gallery-panel .gallery-title {
        font-size: 1.65rem;
      }

      .gallery-panel .description {
        font-size: 0.84rem;
      }
    }
  `;static properties={width:{type:String},height:{type:String},backgroundColor:{type:String,attribute:"background-color"},borderColor:{type:String,attribute:"border-color"},columns:{type:Number},gap:{type:String},flickrLogoUrl:{type:String,attribute:"flickr-logo-url"},flickrImageUrls:{type:Array},flickrImageIndex:{type:Number}};constructor(){super(),this.width="100%",this.height="500px",this.backgroundColor="#1d1d1f",this.borderColor="#1d1d1f",this.columns=5,this.gap="10px",this.flickrLogoUrl="assets/flickr-logo.png",this.flickrImageUrls=[]}connectedCallback(){super.connectedCallback(),this.flickrJson()}willUpdate(t){t.has("width")&&this.style.setProperty("--container-width",`${this.width}`),t.has("height")&&this.style.setProperty("--container-height",`${this.height}`),t.has("backgroundColor")&&this.style.setProperty("--background-color",this.backgroundColor),t.has("borderColor")&&this.style.setProperty("--border-color",this.borderColor),t.has("columns")&&this.style.setProperty("--columns",`${this.columns}`),t.has("gap")&&this.style.setProperty("--gap",this.gap)}async flickrJson(){try{const t=new URLSearchParams({api_key:"afb50c566b96ad82afd6517569db973f",user_id:"144302542@N04",format:"json",nojsoncallback:"1",method:"flickr.people.getPhotos",privacy_filter:"1",extras:"url_sq,url_t,url_s,url_q,url_m,url_n,url_z,url_c,url_l,url_o",per_page:"200"}),e=await fetch(`https://www.flickr.com/services/rest/?${t}`),i=await e.json();this.flickrImageUrls=i.photos.photo.map(t=>t.url_q).slice(0,200)}catch(t){return console.error("Error fetching Flickr JSON:",t),null}}getRandomIndex(){return Math.floor(Math.random()*(this.flickrImageUrls.length||1))}repeatFlickrImage(){return Array.from({length:this.columns},()=>{const t=this.flickrImageUrls.sort(()=>Math.random()-.5);return V`
      <film-strip
        .images=${t}
        .index=${this.getRandomIndex()}
      ></film-strip>
    `})}render(){return V`<div class="container">
      <aside class="gallery-panel" aria-labelledby="gallery-title">
        <svg class="orbit" viewBox="0 0 720 100" preserveAspectRatio="none" aria-hidden="true">
          <path class="tail" d="M 7 1 H 713 A 6 6 0 0 1 719 7 V 93 A 6 6 0 0 1 713 99 H 7 A 6 6 0 0 1 1 93 V 7 A 6 6 0 0 1 7 1 Z"></path>
          <path class="head" d="M 7 1 H 713 A 6 6 0 0 1 719 7 V 93 A 6 6 0 0 1 713 99 H 7 A 6 6 0 0 1 1 93 V 7 A 6 6 0 0 1 7 1 Z"></path>
        </svg>
        <div class="brand-row">
          <img class="brand-logo" src="https://abu-prod-wp-media.s3.ap-southeast-1.amazonaws.com/uploads/2026/04/ABU-Logo-white-2026-lines-semibold-768x227.png" alt="ABU">
          <p class="eyebrow">Photo journal</p>
        </div>
        <h2 class="gallery-title" id="gallery-title">Our world, in focus.</h2>
        <p class="description">Moments, places, and people behind the work.</p>
        <a class="gallery-link" href="https://www.flickr.com/photos/144302542@N04/" target="_blank" rel="noopener noreferrer">
          <span>Explore on Flickr</span>
          <img class="flickr-mark" src=${this.flickrLogoUrl} alt="">
          <span class="external-arrow" aria-hidden="true">↗</span>
        </a>
      </aside>
      ${this.repeatFlickrImage()}
    </div>`}})})();