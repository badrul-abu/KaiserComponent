/*! For license information please see flickr-mosaic.js.LICENSE.txt */
(()=>{"use strict";const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),i=new WeakMap;class r{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const s=this.t;if(e&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=i.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&i.set(s,t))}return t}toString(){return this.cssText}}const o=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]);return new r(i,t,s)},n=(s,i)=>{if(e)s.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of i){const i=document.createElement("style"),r=t.litNonce;void 0!==r&&i.setAttribute("nonce",r),i.textContent=e.cssText,s.appendChild(i)}},a=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new r("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:l,defineProperty:h,getOwnPropertyDescriptor:c,getOwnPropertyNames:d,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,g=globalThis,f=g.trustedTypes,m=f?f.emptyScript:"",$=g.reactiveElementPolyfillSupport,y=(t,e)=>t,_={toAttribute(t,e){switch(e){case Boolean:t=t?m:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},b=(t,e)=>!l(t,e),v={attribute:!0,type:String,converter:_,reflect:!1,useDefault:!1,hasChanged:b};Symbol.metadata??=Symbol("metadata"),g.litPropertyMetadata??=new WeakMap;class A extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=v){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&h(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:r}=c(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const o=i?.call(this);r?.call(this,e),this.requestUpdate(t,o,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??v}static _$Ei(){if(this.hasOwnProperty(y("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(y("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(y("properties"))){const t=this.properties,e=[...d(t),...p(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return n(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const r=(void 0!==s.converter?.toAttribute?s.converter:_).toAttribute(e,s.type);this._$Em=t,null==r?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:_;this._$Em=i;const o=r.fromAttribute(e,t.type);this[i]=o??this._$Ej?.get(i)??o,this._$Em=null}}requestUpdate(t,e,s,i=!1,r){if(void 0!==t){const o=this.constructor;if(!1===i&&(r=this[t]),s??=o.getPropertyOptions(t),!((s.hasChanged??b)(r,e)||s.useDefault&&s.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:r},o){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),!0!==r||void 0!==o)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,s,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}}A.elementStyles=[],A.shadowRootOptions={mode:"open"},A[y("elementProperties")]=new Map,A[y("finalized")]=new Map,$?.({ReactiveElement:A}),(g.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,x=t=>t,S=w.trustedTypes,E=S?S.createPolicy("lit-html",{createHTML:t=>t}):void 0,k="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,P="?"+C,U=`<${P}>`,M=document,O=()=>M.createComment(""),R=t=>null===t||"object"!=typeof t&&"function"!=typeof t,N=Array.isArray,H="[ \t\n\f\r]",T=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,z=/-->/g,j=/>/g,I=RegExp(`>|${H}(?:([^\\s"'>=/]+)(${H}*=${H}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),L=/'/g,D=/"/g,B=/^(?:script|style|textarea|title)$/i,q=t=>(e,...s)=>({_$litType$:t,strings:e,values:s}),W=q(1),V=(q(2),q(3),Symbol.for("lit-noChange")),J=Symbol.for("lit-nothing"),F=new WeakMap,K=M.createTreeWalker(M,129);function Y(t,e){if(!N(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==E?E.createHTML(e):e}const Z=(t,e)=>{const s=t.length-1,i=[];let r,o=2===e?"<svg>":3===e?"<math>":"",n=T;for(let e=0;e<s;e++){const s=t[e];let a,l,h=-1,c=0;for(;c<s.length&&(n.lastIndex=c,l=n.exec(s),null!==l);)c=n.lastIndex,n===T?"!--"===l[1]?n=z:void 0!==l[1]?n=j:void 0!==l[2]?(B.test(l[2])&&(r=RegExp("</"+l[2],"g")),n=I):void 0!==l[3]&&(n=I):n===I?">"===l[0]?(n=r??T,h=-1):void 0===l[1]?h=-2:(h=n.lastIndex-l[2].length,a=l[1],n=void 0===l[3]?I:'"'===l[3]?D:L):n===D||n===L?n=I:n===z||n===j?n=T:(n=I,r=void 0);const d=n===I&&t[e+1].startsWith("/>")?" ":"";o+=n===T?s+U:h>=0?(i.push(a),s.slice(0,h)+k+s.slice(h)+C+d):s+C+(-2===h?e:d)}return[Y(t,o+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class G{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let r=0,o=0;const n=t.length-1,a=this.parts,[l,h]=Z(t,e);if(this.el=G.createElement(l,s),K.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=K.nextNode())&&a.length<n;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(k)){const e=h[o++],s=i.getAttribute(t).split(C),n=/([.?@])?(.*)/.exec(e);a.push({type:1,index:r,name:n[2],strings:s,ctor:"."===n[1]?st:"?"===n[1]?it:"@"===n[1]?rt:et}),i.removeAttribute(t)}else t.startsWith(C)&&(a.push({type:6,index:r}),i.removeAttribute(t));if(B.test(i.tagName)){const t=i.textContent.split(C),e=t.length-1;if(e>0){i.textContent=S?S.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],O()),K.nextNode(),a.push({type:2,index:++r});i.append(t[e],O())}}}else if(8===i.nodeType)if(i.data===P)a.push({type:2,index:r});else{let t=-1;for(;-1!==(t=i.data.indexOf(C,t+1));)a.push({type:7,index:r}),t+=C.length-1}r++}}static createElement(t,e){const s=M.createElement("template");return s.innerHTML=t,s}}function Q(t,e,s=t,i){if(e===V)return e;let r=void 0!==i?s._$Co?.[i]:s._$Cl;const o=R(e)?void 0:e._$litDirective$;return r?.constructor!==o&&(r?._$AO?.(!1),void 0===o?r=void 0:(r=new o(t),r._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=r:s._$Cl=r),void 0!==r&&(e=Q(t,r._$AS(t,e.values),r,i)),e}class X{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??M).importNode(e,!0);K.currentNode=i;let r=K.nextNode(),o=0,n=0,a=s[0];for(;void 0!==a;){if(o===a.index){let e;2===a.type?e=new tt(r,r.nextSibling,this,t):1===a.type?e=new a.ctor(r,a.name,a.strings,this,t):6===a.type&&(e=new ot(r,this,t)),this._$AV.push(e),a=s[++n]}o!==a?.index&&(r=K.nextNode(),o++)}return K.currentNode=M,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class tt{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=J,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Q(this,t,e),R(t)?t===J||null==t||""===t?(this._$AH!==J&&this._$AR(),this._$AH=J):t!==this._$AH&&t!==V&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>N(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==J&&R(this._$AH)?this._$AA.nextSibling.data=t:this.T(M.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=G.createElement(Y(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new X(i,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=F.get(t.strings);return void 0===e&&F.set(t.strings,e=new G(t)),e}k(t){N(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const r of t)i===e.length?e.push(s=new tt(this.O(O()),this.O(O()),this,this.options)):s=e[i],s._$AI(r),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=x(t).nextSibling;x(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class et{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,r){this.type=1,this._$AH=J,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=r,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=J}_$AI(t,e=this,s,i){const r=this.strings;let o=!1;if(void 0===r)t=Q(this,t,e,0),o=!R(t)||t!==this._$AH&&t!==V,o&&(this._$AH=t);else{const i=t;let n,a;for(t=r[0],n=0;n<r.length-1;n++)a=Q(this,i[s+n],e,n),a===V&&(a=this._$AH[n]),o||=!R(a)||a!==this._$AH[n],a===J?t=J:t!==J&&(t+=(a??"")+r[n+1]),this._$AH[n]=a}o&&!i&&this.j(t)}j(t){t===J?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class st extends et{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===J?void 0:t}}class it extends et{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==J)}}class rt extends et{constructor(t,e,s,i,r){super(t,e,s,i,r),this.type=5}_$AI(t,e=this){if((t=Q(this,t,e,0)??J)===V)return;const s=this._$AH,i=t===J&&s!==J||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,r=t!==J&&(s===J||i);i&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class ot{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){Q(this,t)}}const nt=w.litHtmlPolyfillSupport;nt?.(G,tt),(w.litHtmlVersions??=[]).push("3.3.3");const at=globalThis;class lt extends A{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const i=s?.renderBefore??e;let r=i._$litPart$;if(void 0===r){const t=s?.renderBefore??null;i._$litPart$=r=new tt(e.insertBefore(O(),t),t,void 0,s??{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return V}}lt._$litElement$=!0,lt.finalized=!0,at.litElementHydrateSupport?.({LitElement:lt});const ht=at.litElementPolyfillSupport;ht?.({LitElement:lt}),(at.litElementVersions??=[]).push("4.2.2");const ct=t=>(e,s)=>{void 0!==s?s.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)};class dt{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,s){this._$Ct=t,this._$AM=e,this._$Ci=s}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}const pt=(t=>(...e)=>({_$litDirective$:t,values:e}))(class extends dt{constructor(t){if(super(t),1!==t.type||"class"!==t.name||t.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter(e=>t[e]).join(" ")+" "}update(t,[e]){if(void 0===this.st){this.st=new Set,void 0!==t.strings&&(this.nt=new Set(t.strings.join(" ").split(/\s/).filter(t=>""!==t)));for(const t in e)e[t]&&!this.nt?.has(t)&&this.st.add(t);return this.render(e)}const s=t.element.classList;for(const t of this.st)t in e||(s.remove(t),this.st.delete(t));for(const t in e){const i=!!e[t];i===this.st.has(t)||this.nt?.has(t)||(i?(s.add(t),this.st.add(t)):(s.remove(t),this.st.delete(t)))}return V}});ct("film-strip")(class extends lt{static properties={images:{type:Array},index:{type:Number},gap:{type:String}};static styles=o`
		:host {
			display: block;
			height: 100%;
			min-width: 0;
			overflow: hidden;
			--gap: 8px;
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
			gap: var(--gap);
		}

		img {
			aspect-ratio: auto;
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
	`;constructor(){super(),this.images=[],this.index=0,this.gap="8px"}willUpdate(t){t.has("gap")&&this.style.setProperty("--gap",this.gap)}render(){if(!this.images?.length)return W`<div class="window" aria-hidden="true"></div>`;const t=(this.index%this.images.length+this.images.length)%this.images.length,e=[...this.images.slice(t),...this.images.slice(0,t)].slice(0,16+Math.floor(5*Math.random())),s=25+t%5*3+2*Math.random();return W`
			<div class="window" aria-label="Moving vertical photo strip">
				<div class="track" style="--drift-duration: ${s}s">
					${[0,1].map(()=>W`
						<div class="sequence" aria-hidden="true">
							${e.map(t=>W`<img src=${t.url} alt="" style="aspect-ratio: ${t.width} / ${t.height}" loading="lazy" />`)}
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
      width: calc(var(--container-width) - 2 * var(--gap));
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
      cursor: default;
      border: 1px solid rgba(224, 240, 246, 0.28);
      border-left: 3px solid #67ddff;
      border-radius: 6px;
      background: linear-gradient(135deg, rgba(11, 26, 33, 0.96), rgba(15, 20, 24, 0.88));
      box-shadow: 0 14px 36px rgba(0, 0, 0, 0.36);
      backdrop-filter: blur(12px);
      color: #f7fbfc;

      &::before {
        position: absolute;
        inset: 0;
        content: '';
        background: linear-gradient(135deg, #1389a0, #0d596f 72%);
        clip-path: circle(0 at 0 100%);
        pointer-events: none;
        transition: clip-path 650ms cubic-bezier(0.2, 0.75, 0.25, 1);
        z-index: -1;
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

    .gallery-panel:focus-within {
      &::before {
        clip-path: circle(150% at 0 100%);
      }
    }

    @media (hover: hover) {
      .gallery-panel:hover::before {
        clip-path: circle(150% at 0 100%);
      }
    }

    .gallery-panel.is-revealed::before {
      clip-path: circle(150% at 0 100%);
    }

    @media (hover: none) {
      .gallery-panel:active::before {
        clip-path: circle(150% at 0 100%);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .gallery-panel::before {
        transition: none;
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
  `;static properties={width:{type:String},height:{type:String},backgroundColor:{type:String,attribute:"background-color"},borderColor:{type:String,attribute:"border-color"},columns:{type:Number},gap:{type:String},flickrLogoUrl:{type:String,attribute:"flickr-logo-url"},flickrImageUrls:{type:Array,state:!0},flickrImageIndex:{type:Number,state:!0},colorRevealed:{state:!0}};constructor(){super(),this.width="100%",this.height="500px",this.backgroundColor="#1d1d1f",this.borderColor="#1d1d1f",this.columns=5,this.gap="10px",this.flickrLogoUrl="assets/flickr-logo.png",this.flickrImageUrls=[],this.colorRevealed=!1,this.photoStrip=[]}connectedCallback(){super.connectedCallback()}willUpdate(t){t.has("width")&&this.style.setProperty("--container-width",`${this.width}`),t.has("height")&&this.style.setProperty("--container-height",`${this.height}`),t.has("backgroundColor")&&this.style.setProperty("--background-color",this.backgroundColor),t.has("borderColor")&&this.style.setProperty("--border-color",this.borderColor),t.has("columns")&&this.style.setProperty("--columns",`${this.columns}`),t.has("gap")&&this.style.setProperty("--gap",this.gap),t.has("flickrImageUrls")&&(this.photoStrip=this.repeatFlickrImage())}firstUpdated(){this.flickrJson()}async flickrJson(){try{const t=new URLSearchParams({api_key:"afb50c566b96ad82afd6517569db973f",user_id:"144302542@N04",format:"json",nojsoncallback:"1",method:"flickr.people.getPhotos",privacy_filter:"1",extras:"url_n",per_page:"200"}),e=await fetch(`https://www.flickr.com/services/rest/?${t}`),s=await e.json();this.flickrImageUrls=s.photos.photo.map(t=>({url:t.url_n,height:t.height_n,width:t.width_n})).slice(0,200)}catch(t){return console.error("Error fetching Flickr JSON:",t),null}}getRandomIndex(){return Math.floor(Math.random()*(this.flickrImageUrls.length||1))}togglePanelColor(t){t.target.closest("a")||(this.colorRevealed=!this.colorRevealed)}repeatFlickrImage(){return Array.from({length:this.columns},()=>{const t=this.flickrImageUrls.sort(()=>Math.random()-.5);return W`
      <film-strip
        .images=${t}
        .index=${this.getRandomIndex()}
        .gap=${this.gap}
      ></film-strip>
    `})}render(){return W`<div class="container">
      <aside class="gallery-panel ${pt({"is-revealed":this.colorRevealed})}" aria-labelledby="gallery-title" @click=${this.togglePanelColor}>
        <div class="brand-row">
          <img class="brand-logo" src="https://abu-prod-wp-media.s3.ap-southeast-1.amazonaws.com/uploads/2026/04/ABU-Logo-white-2026-lines-semibold-768x227.png" alt="ABU">
          <p class="eyebrow">Photo journal</p>
        </div>
        <h2 class="gallery-title" id="gallery-title">Our world,<br>in focus.</h2>
        <p class="description">Moments, places, and people behind the work.</p>
        <a class="gallery-link" href="https://www.flickr.com/photos/abu_hq/" target="_blank" rel="noopener noreferrer">
          <span>Explore on</span>
          <img class="flickr-mark" src=${this.flickrLogoUrl} alt="">
          <span class="external-arrow" aria-hidden="true">↗</span>
        </a>
      </aside>
      ${this.photoStrip.map(t=>t)}
    </div>`}})})();