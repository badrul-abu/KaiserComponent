/*! For license information please see flickr-mosaic.js.LICENSE.txt */
(()=>{"use strict";const e=globalThis,t=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),s=new WeakMap;class r{constructor(e,t,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const i=this.t;if(t&&void 0===e){const t=void 0!==i&&1===i.length;t&&(e=s.get(i)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),t&&s.set(i,e))}return e}toString(){return this.cssText}}const o=(e,...t)=>{const s=1===e.length?e[0]:t.reduce((t,i,s)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[s+1],e[0]);return new r(s,e,i)},a=(i,s)=>{if(t)i.adoptedStyleSheets=s.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const t of s){const s=document.createElement("style"),r=e.litNonce;void 0!==r&&s.setAttribute("nonce",r),s.textContent=t.cssText,i.appendChild(s)}},n=t?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new r("string"==typeof e?e:e+"",void 0,i))(t)})(e):e,{is:l,defineProperty:d,getOwnPropertyDescriptor:c,getOwnPropertyNames:p,getOwnPropertySymbols:h,getPrototypeOf:g}=Object,u=globalThis,f=u.trustedTypes,m=f?f.emptyScript:"",b=u.reactiveElementPolyfillSupport,v=(e,t)=>e,x={toAttribute(e,t){switch(t){case Boolean:e=e?m:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},y=(e,t)=>!l(e,t),_={attribute:!0,type:String,converter:x,reflect:!1,useDefault:!1,hasChanged:y};Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;class w extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=_){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(e,i,t);void 0!==s&&d(this.prototype,e,s)}}static getPropertyDescriptor(e,t,i){const{get:s,set:r}=c(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:s,set(t){const o=s?.call(this);r?.call(this,t),this.requestUpdate(e,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??_}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const e=g(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const e=this.properties,t=[...p(e),...h(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(n(e))}else void 0!==e&&t.push(n(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return a(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,i);if(void 0!==s&&!0===i.reflect){const r=(void 0!==i.converter?.toAttribute?i.converter:x).toAttribute(t,i.type);this._$Em=e,null==r?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(e,t){const i=this.constructor,s=i._$Eh.get(e);if(void 0!==s&&this._$Em!==s){const e=i.getPropertyOptions(s),r="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:x;this._$Em=s;const o=r.fromAttribute(t,e.type);this[s]=o??this._$Ej?.get(s)??o,this._$Em=null}}requestUpdate(e,t,i,s=!1,r){if(void 0!==e){const o=this.constructor;if(!1===s&&(r=this[e]),i??=o.getPropertyOptions(e),!((i.hasChanged??y)(r,t)||i.useDefault&&i.reflect&&r===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:s,wrapped:r},o){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),!0!==r||void 0!==o)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===s&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,s=this[t];!0!==e||this._$AL.has(t)||void 0===s||this.C(t,void 0,i,s)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}}w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[v("elementProperties")]=new Map,w[v("finalized")]=new Map,b?.({ReactiveElement:w}),(u.reactiveElementVersions??=[]).push("2.1.2");const $=globalThis,k=e=>e,P=$.trustedTypes,S=P?P.createPolicy("lit-html",{createHTML:e=>e}):void 0,A="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,E="?"+C,z=`<${E}>`,M=document,U=()=>M.createComment(""),R=e=>null===e||"object"!=typeof e&&"function"!=typeof e,T=Array.isArray,j="[ \t\n\f\r]",F=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,N=/-->/g,O=/>/g,H=RegExp(`>|${j}(?:([^\\s"'>=/]+)(${j}*=${j}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),B=/'/g,V=/"/g,D=/^(?:script|style|textarea|title)$/i,L=e=>(t,...i)=>({_$litType$:e,strings:t,values:i}),q=L(1),I=(L(2),L(3),Symbol.for("lit-noChange")),W=Symbol.for("lit-nothing"),G=new WeakMap,J=M.createTreeWalker(M,129);function K(e,t){if(!T(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(t):t}const Y=(e,t)=>{const i=e.length-1,s=[];let r,o=2===t?"<svg>":3===t?"<math>":"",a=F;for(let t=0;t<i;t++){const i=e[t];let n,l,d=-1,c=0;for(;c<i.length&&(a.lastIndex=c,l=a.exec(i),null!==l);)c=a.lastIndex,a===F?"!--"===l[1]?a=N:void 0!==l[1]?a=O:void 0!==l[2]?(D.test(l[2])&&(r=RegExp("</"+l[2],"g")),a=H):void 0!==l[3]&&(a=H):a===H?">"===l[0]?(a=r??F,d=-1):void 0===l[1]?d=-2:(d=a.lastIndex-l[2].length,n=l[1],a=void 0===l[3]?H:'"'===l[3]?V:B):a===V||a===B?a=H:a===N||a===O?a=F:(a=H,r=void 0);const p=a===H&&e[t+1].startsWith("/>")?" ":"";o+=a===F?i+z:d>=0?(s.push(n),i.slice(0,d)+A+i.slice(d)+C+p):i+C+(-2===d?t:p)}return[K(e,o+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),s]};class Z{constructor({strings:e,_$litType$:t},i){let s;this.parts=[];let r=0,o=0;const a=e.length-1,n=this.parts,[l,d]=Y(e,t);if(this.el=Z.createElement(l,i),J.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(s=J.nextNode())&&n.length<a;){if(1===s.nodeType){if(s.hasAttributes())for(const e of s.getAttributeNames())if(e.endsWith(A)){const t=d[o++],i=s.getAttribute(e).split(C),a=/([.?@])?(.*)/.exec(t);n.push({type:1,index:r,name:a[2],strings:i,ctor:"."===a[1]?ie:"?"===a[1]?se:"@"===a[1]?re:te}),s.removeAttribute(e)}else e.startsWith(C)&&(n.push({type:6,index:r}),s.removeAttribute(e));if(D.test(s.tagName)){const e=s.textContent.split(C),t=e.length-1;if(t>0){s.textContent=P?P.emptyScript:"";for(let i=0;i<t;i++)s.append(e[i],U()),J.nextNode(),n.push({type:2,index:++r});s.append(e[t],U())}}}else if(8===s.nodeType)if(s.data===E)n.push({type:2,index:r});else{let e=-1;for(;-1!==(e=s.data.indexOf(C,e+1));)n.push({type:7,index:r}),e+=C.length-1}r++}}static createElement(e,t){const i=M.createElement("template");return i.innerHTML=e,i}}function X(e,t,i=e,s){if(t===I)return t;let r=void 0!==s?i._$Co?.[s]:i._$Cl;const o=R(t)?void 0:t._$litDirective$;return r?.constructor!==o&&(r?._$AO?.(!1),void 0===o?r=void 0:(r=new o(e),r._$AT(e,i,s)),void 0!==s?(i._$Co??=[])[s]=r:i._$Cl=r),void 0!==r&&(t=X(e,r._$AS(e,t.values),r,s)),t}class Q{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,s=(e?.creationScope??M).importNode(t,!0);J.currentNode=s;let r=J.nextNode(),o=0,a=0,n=i[0];for(;void 0!==n;){if(o===n.index){let t;2===n.type?t=new ee(r,r.nextSibling,this,e):1===n.type?t=new n.ctor(r,n.name,n.strings,this,e):6===n.type&&(t=new oe(r,this,e)),this._$AV.push(t),n=i[++a]}o!==n?.index&&(r=J.nextNode(),o++)}return J.currentNode=M,s}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class ee{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,s){this.type=2,this._$AH=W,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=X(this,e,t),R(e)?e===W||null==e||""===e?(this._$AH!==W&&this._$AR(),this._$AH=W):e!==this._$AH&&e!==I&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>T(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==W&&R(this._$AH)?this._$AA.nextSibling.data=e:this.T(M.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,s="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=Z.createElement(K(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(t);else{const e=new Q(s,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=G.get(e.strings);return void 0===t&&G.set(e.strings,t=new Z(e)),t}k(e){T(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,s=0;for(const r of e)s===t.length?t.push(i=new ee(this.O(U()),this.O(U()),this,this.options)):i=t[s],i._$AI(r),s++;s<t.length&&(this._$AR(i&&i._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=k(e).nextSibling;k(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class te{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,s,r){this.type=1,this._$AH=W,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=W}_$AI(e,t=this,i,s){const r=this.strings;let o=!1;if(void 0===r)e=X(this,e,t,0),o=!R(e)||e!==this._$AH&&e!==I,o&&(this._$AH=e);else{const s=e;let a,n;for(e=r[0],a=0;a<r.length-1;a++)n=X(this,s[i+a],t,a),n===I&&(n=this._$AH[a]),o||=!R(n)||n!==this._$AH[a],n===W?e=W:e!==W&&(e+=(n??"")+r[a+1]),this._$AH[a]=n}o&&!s&&this.j(e)}j(e){e===W?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class ie extends te{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===W?void 0:e}}class se extends te{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==W)}}class re extends te{constructor(e,t,i,s,r){super(e,t,i,s,r),this.type=5}_$AI(e,t=this){if((e=X(this,e,t,0)??W)===I)return;const i=this._$AH,s=e===W&&i!==W||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,r=e!==W&&(i===W||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class oe{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){X(this,e)}}const ae=$.litHtmlPolyfillSupport;ae?.(Z,ee),($.litHtmlVersions??=[]).push("3.3.3");const ne=globalThis;class le extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const s=i?.renderBefore??t;let r=s._$litPart$;if(void 0===r){const e=i?.renderBefore??null;s._$litPart$=r=new ee(t.insertBefore(U(),e),e,void 0,i??{})}return r._$AI(e),r})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return I}}le._$litElement$=!0,le.finalized=!0,ne.litElementHydrateSupport?.({LitElement:le});const de=ne.litElementPolyfillSupport;de?.({LitElement:le}),(ne.litElementVersions??=[]).push("4.2.2");const ce=e=>(t,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)};class pe{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,i){this._$Ct=e,this._$AM=t,this._$Ci=i}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}}const he=(e=>(...t)=>({_$litDirective$:e,values:t}))(class extends pe{constructor(e){if(super(e),1!==e.type||"class"!==e.name||e.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return" "+Object.keys(e).filter(t=>e[t]).join(" ")+" "}update(e,[t]){if(void 0===this.st){this.st=new Set,void 0!==e.strings&&(this.nt=new Set(e.strings.join(" ").split(/\s/).filter(e=>""!==e)));for(const e in t)t[e]&&!this.nt?.has(e)&&this.st.add(e);return this.render(t)}const i=e.element.classList;for(const e of this.st)e in t||(i.remove(e),this.st.delete(e));for(const e in t){const s=!!t[e];s===this.st.has(e)||this.nt?.has(e)||(s?(i.add(e),this.st.add(e)):(i.remove(e),this.st.delete(e)))}return I}});ce("film-strip")(class extends le{static properties={images:{type:Array},index:{type:Number},gap:{type:String}};static styles=o`
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
	`;constructor(){super(),this.images=[],this.index=0,this.gap="8px"}willUpdate(e){e.has("gap")&&this.style.setProperty("--gap",this.gap)}render(){if(!this.images?.length)return q`<div class="window" aria-hidden="true"></div>`;const e=(this.index%this.images.length+this.images.length)%this.images.length,t=[...this.images.slice(e),...this.images.slice(0,e)].slice(0,16+Math.floor(5*Math.random())),i=25+e%5*3+2*Math.random();return q`
			<div class="window" aria-label="Moving vertical photo strip">
				<div class="track" style="--drift-duration: ${i}s">
					${[0,1].map(()=>q`
						<div class="sequence" aria-hidden="true">
							${t.map(e=>q`<img src=${e.url} alt="" style="aspect-ratio: ${e.width} / ${e.height}" loading="lazy" />`)}
						</div>
					`)}
				</div>
			</div>
		`}}),ce("flickr-mosaic")(class extends le{static styles=o`
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
  `;static properties={width:{type:String},height:{type:String},backgroundColor:{type:String,attribute:"background-color"},borderColor:{type:String,attribute:"border-color"},columns:{type:Number},gap:{type:String},flickrLogoUrl:{type:String,attribute:"flickr-logo-url"},flickrImageUrls:{type:Array,state:!0},flickrImageIndex:{type:Number,state:!0},colorRevealed:{state:!0}};constructor(){super(),this.width="100%",this.height="500px",this.backgroundColor="#1d1d1f",this.borderColor="#1d1d1f",this.columns=5,this.gap="10px",this.flickrLogoUrl="assets/flickr-logo.png",this.flickrImageUrls=[],this.colorRevealed=!1,this.photoStrip=[]}connectedCallback(){super.connectedCallback()}willUpdate(e){e.has("width")&&this.style.setProperty("--container-width",`${this.width}`),e.has("height")&&this.style.setProperty("--container-height",`${this.height}`),e.has("backgroundColor")&&this.style.setProperty("--background-color",this.backgroundColor),e.has("borderColor")&&this.style.setProperty("--border-color",this.borderColor),e.has("columns")&&this.style.setProperty("--columns",`${this.columns}`),e.has("gap")&&this.style.setProperty("--gap",this.gap),e.has("flickrImageUrls")&&(this.photoStrip=this.repeatFlickrImage())}firstUpdated(){this.flickrJson()}async flickrJson(){try{const e=new URLSearchParams({api_key:"afb50c566b96ad82afd6517569db973f",user_id:"144302542@N04",format:"json",nojsoncallback:"1",method:"flickr.people.getPhotos",privacy_filter:"1",extras:"url_n",per_page:"200"}),t=await fetch(`https://www.flickr.com/services/rest/?${e}`),i=await t.json();this.flickrImageUrls=i.photos.photo.map(e=>({url:e.url_n,height:e.height_n,width:e.width_n})).slice(0,200)}catch(e){return console.error("Error fetching Flickr JSON:",e),null}}getRandomIndex(){return Math.floor(Math.random()*(this.flickrImageUrls.length||1))}togglePanelColor(e){e.target.closest("a")||(this.colorRevealed=!this.colorRevealed)}repeatFlickrImage(){return Array.from({length:this.columns},()=>{const e=this.flickrImageUrls.sort(()=>Math.random()-.5);return q`
      <film-strip
        .images=${e}
        .index=${this.getRandomIndex()}
        .gap=${this.gap}
      ></film-strip>
    `})}render(){return q`<div class="container">
      <aside class="gallery-panel ${he({"is-revealed":this.colorRevealed})}" aria-labelledby="gallery-title" @click=${this.togglePanelColor}>
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
      ${this.photoStrip.map(e=>e)}
    </div>`}});const ge="https://cdnjs.cloudflare.com/ajax/libs/pdf.js";let ue;ce("custom-pdf-reader")(class extends le{static styles=o`
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
  `;static properties={pdfUrl:{type:String,attribute:"pdf-url"},width:{type:String},height:{type:String},pdfjsVersion:{type:String,attribute:"pdfjs-version"},pdfjsUrl:{type:String,attribute:"pdfjs-url"},pdfjsWorkerUrl:{type:String,attribute:"pdfjs-worker-url"},continuous:{type:Boolean},_status:{state:!0},_pageNumber:{state:!0},_numPages:{state:!0},_scale:{state:!0},_fitMode:{state:!0},_rotation:{state:!0},_layout:{state:!0},_panelOpen:{state:!0}};constructor(){super(),this.pdfUrl="",this.width="600px",this.height="849px",this.pdfjsVersion="3.11.174",this.pdfjsUrl="",this.pdfjsWorkerUrl="",this.continuous=!1,this._status="Loading PDF...",this._pageNumber=1,this._numPages=0,this._scale=1,this._fitMode="width",this._rotation=0,this._layout="single",this._panelOpen=!1,this._pdf=null,this._rendering=!1,this._pendingRender=!1,this._thumbs=new Set,this._loadToken=0,this._resizeObserver=null,this._pageObserver=null}_$(e){return this.renderRoot?.querySelector(e)}get _pdfjsScriptUrl(){return this.pdfjsUrl||`${ge}/${encodeURIComponent(this.pdfjsVersion)}/pdf.min.js`}get _pdfjsWorkerUrl(){return this.pdfjsWorkerUrl||`${ge}/${encodeURIComponent(this.pdfjsVersion)}/pdf.worker.min.js`}render(){const e=this.continuous,t=!e&&"spread"===this._layout,i=Math.min(this._numPages,this._pageNumber+(t?1:0)),s=this._numPages?e?`${this._numPages} pages`:t&&i>this._pageNumber?`${this._pageNumber}-${i} / ${this._numPages}`:`${this._pageNumber} / ${this._numPages}`:this._status;return q`
      <div class="viewer" style="width:${this.width}; height:${this.height}; max-width:100%">
        <div class="toolbar">
          ${e?W:q`<button type="button" aria-label="Previous page" title="Previous page" @click=${()=>this._go(-1)}>&#x2039;</button>`}
          <span aria-live="polite">${s}</span>
          ${e?W:q`<button type="button" aria-label="Next page" title="Next page" @click=${()=>this._go(1)}>&#x203A;</button>`}
          <button type="button" aria-pressed=${"width"===this._fitMode} @click=${()=>this._setFit("width")}>Fit width</button>
          <button type="button" aria-pressed=${"page"===this._fitMode} @click=${()=>this._setFit("page")}>Fit page</button>
          <button type="button" title="Rotate clockwise" @click=${this._rotate}>Rotate</button>
          ${e?W:q`
                <button type="button" aria-pressed=${!t} @click=${()=>this._setLayout("single")}>1 page</button>
                <button type="button" aria-pressed=${t} @click=${()=>this._setLayout("spread")}>2 pages</button>
                <button type="button" aria-expanded=${this._panelOpen} @click=${this._togglePanel}>Pages</button>
              `}
          <button type="button" aria-label="Zoom out" title="Zoom out" @click=${()=>this._zoom(-.2)}>&minus;</button>
          <span>${Math.round(100*this._scale)}%</span>
          <button type="button" aria-label="Zoom in" title="Zoom in" @click=${()=>this._zoom(.2)}>&plus;</button>
          ${this.pdfUrl?q`<a href=${this.pdfUrl} target="_blank" rel="noopener">Open PDF</a>`:W}
        </div>
        <div class="body">
          <aside class="panel" ?hidden=${e||!this._panelOpen} @scroll=${this._renderVisibleThumbs}>
            <div style="display:flex;flex-direction:column">
              ${Array.from({length:e?0:this._numPages},(e,t)=>t+1).map(e=>q`
                  <button
                    type="button"
                    class="thumb"
                    data-page=${e}
                    aria-label="Go to page ${e}"
                    aria-current=${e>=this._pageNumber&&e<=i?"page":W}
                    @click=${()=>this._goTo(e)}
                  >
                    <canvas width="100" height="132"></canvas>
                    <span>Page ${e}</span>
                  </button>
                `)}
            </div>
          </aside>
          <div class="page-area"><div class="pages ${e?"continuous":""}"></div></div>
        </div>
      </div>
    `}firstUpdated(){this._resizeObserver=new ResizeObserver(()=>this._requestRender()),this._resizeObserver.observe(this._$(".page-area"))}connectedCallback(){super.connectedCallback(),this.hasUpdated&&this._resizeObserver?.observe(this._$(".page-area"))}disconnectedCallback(){super.disconnectedCallback(),this._resizeObserver?.disconnect(),this._pageObserver?.disconnect()}updated(e){e.has("continuous")&&void 0!==e.get("continuous")&&this._requestRender(),["pdfUrl","pdfjsVersion","pdfjsUrl","pdfjsWorkerUrl"].some(t=>e.has(t))&&this._load(),e.has("_numPages")&&this._numPages&&(this._thumbs.clear(),this._renderVisibleThumbs())}async _load(){const e=++this._loadToken;if(this._pdf=null,this._numPages=0,this._pageNumber=1,this._$(".pages")?.replaceChildren(),this.pdfUrl){this._status="Loading PDF...";try{const s=await(t=this._pdfjsScriptUrl,i=this._pdfjsWorkerUrl,window.pdfjsLib?(window.pdfjsLib.GlobalWorkerOptions.workerSrc||=i,Promise.resolve(window.pdfjsLib)):(ue||=new Promise((e,s)=>{const r=document.createElement("script");r.src=t,r.async=!0,r.onload=()=>{window.pdfjsLib.GlobalWorkerOptions.workerSrc=i,e(window.pdfjsLib)},r.onerror=()=>{ue=void 0,s(new Error("Unable to load PDF.js"))},document.head.append(r)}),ue)),r=await s.getDocument(this.pdfUrl).promise;if(e!==this._loadToken)return;this._pdf=r,this._numPages=r.numPages,await this.updateComplete,this._requestRender()}catch(t){if(e!==this._loadToken)return;this._status="Unable to load PDF",console.error("PDF.js could not load the PDF.",t)}var t,i}else this._status="No PDF specified"}_step(){return"spread"===this._layout?2:1}_go(e){this._goTo(this._pageNumber+e*this._step())}_goTo(e){this._numPages&&!this.continuous&&(this._pageNumber=Math.min(this._numPages,Math.max(1,e)),this._requestRender())}_zoom(e){this._scale=Math.min(2,Math.max(.4,Math.round(10*(this._scale+e))/10)),this._requestRender()}_setFit(e){this._fitMode=e,this._requestRender()}_setLayout(e){this._layout=e,this._requestRender()}_rotate(){this._rotation=(this._rotation+90)%360,this._thumbs.clear(),this._requestRender(),this._renderVisibleThumbs()}_togglePanel(){this._panelOpen=!this._panelOpen,this.updateComplete.then(()=>{this._requestRender(),this._renderVisibleThumbs()})}_requestRender(){this._renderPages().catch(e=>{this._status="Unable to render PDF page",console.error("PDF.js could not render the PDF.",e)})}async _renderPages(){const e=this._$(".page-area");if(!this._pdf||!e)return;const t=!this.continuous&&"spread"===this._layout;if(!(e.clientWidth<=(t?36:24)||e.clientHeight<=24))if(this._rendering)this._pendingRender=!0;else{this._rendering=!0;try{if(this.continuous)return void await this._renderContinuous(e);const i=t?2:1,s=e.clientWidth-24,r=e.clientHeight-24,o=2===i?(s-12)/2:s,a=window.devicePixelRatio||1,n=Math.min(this._pdf.numPages,this._pageNumber+i-1),l=[],d=[];for(let e=this._pageNumber;e<=n;e+=1){const t=await this._pdf.getPage(e),i=t.getViewport({scale:1,rotation:this._rotation}),s=o/i.width,n="page"===this._fitMode?Math.min(s,r/i.height):s,c=t.getViewport({scale:n*this._scale,rotation:this._rotation}),p=document.createElement("canvas"),h=p.getContext("2d");p.width=Math.floor(c.width*a),p.height=Math.floor(c.height*a),p.style.width=`${c.width}px`,p.style.height=`${c.height}px`,h.setTransform(a,0,0,a,0,0),l.push(p),d.push(t.render({canvasContext:h,viewport:c}).promise)}this._$(".pages").replaceChildren(...l),await Promise.all(d)}finally{this._rendering=!1,this._pendingRender&&(this._pendingRender=!1,requestAnimationFrame(()=>this._requestRender()))}}}async _renderContinuous(e){const t=e.clientWidth-24,i=e.clientHeight-24,s=window.devicePixelRatio||1,r=e.scrollHeight?e.scrollTop/e.scrollHeight:0,o=this._pdf,a=this._rotation,n=[];for(let e=1;e<=o.numPages;e+=1){const r=await o.getPage(e),l=r.getViewport({scale:1,rotation:a}),d=t/l.width,c="page"===this._fitMode?Math.min(d,i/l.height):d,p=r.getViewport({scale:c*this._scale,rotation:a}),h=document.createElement("canvas");h.style.width=`${p.width}px`,h.style.height=`${p.height}px`,h._draw=()=>{h.width=Math.floor(p.width*s),h.height=Math.floor(p.height*s);const e=h.getContext("2d");return e.setTransform(s,0,0,s,0,0),r.render({canvasContext:e,viewport:p}).promise},n.push(h)}o===this._pdf&&this.continuous&&(this._pageObserver?.disconnect(),this._$(".pages").replaceChildren(...n),e.scrollTop=r*e.scrollHeight,this._pageObserver=new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting&&(this._pageObserver.unobserve(e.target),e.target._draw().catch(e=>console.error("PDF.js could not render a page.",e)))})},{root:e,rootMargin:"800px 0px"}),n.forEach(e=>this._pageObserver.observe(e)))}_renderVisibleThumbs=()=>{if(!this._pdf||!this._panelOpen)return;const e=this._$(".panel"),t=e.getBoundingClientRect();e.querySelectorAll(".thumb").forEach(e=>{const i=e.getBoundingClientRect();i.bottom>=t.top-120&&i.top<=t.bottom+120&&this._renderThumb(e)})};async _renderThumb(e){const t=Number(e.dataset.page);if(!this._thumbs.has(t)){this._thumbs.add(t);try{const i=await this._pdf.getPage(t),s=i.getViewport({scale:1,rotation:this._rotation}),r=Math.min(100/s.width,132/s.height),o=i.getViewport({scale:r,rotation:this._rotation}),a=e.querySelector("canvas"),n=a.getContext("2d"),l=Math.min(window.devicePixelRatio||1,2);a.width=Math.ceil(o.width*l),a.height=Math.ceil(o.height*l),a.style.width=`${o.width}px`,a.style.height=`${o.height}px`,n.setTransform(l,0,0,l,0,0),await i.render({canvasContext:n,viewport:o}).promise}catch(e){console.error("PDF.js could not render a page thumbnail.",e)}}}});class fe extends le{static properties={title:{type:String},showHeader:{type:String,attribute:"show-header"},allowMultiple:{type:String,attribute:"allow-multiple"},theme:{type:String},configured:{type:String},maxFileSize:{type:Number,attribute:"max-file-size"},chunkSize:{type:Number,attribute:"chunk-size"},videoPosts:{state:!0},isUploading:{state:!0},overallProgress:{state:!0},uploadSpeed:{state:!0},timeRemaining:{state:!0},currentStatus:{state:!0},uploadSuccess:{state:!0},createdPosts:{state:!0},errorMessage:{state:!0}};static styles=o`
    :host {
      --primary: #5850ec;
      --primary-hover: #4338ca;
      --primary-light: #eef2ff;
      --primary-focus: rgba(88, 80, 236, 0.25);
      --text-main: #1e293b;
      --text-muted: #64748b;
      --border-color: #cbd5e1;
      --border-light: #e2e8f0;
      --bg-card: #ffffff;
      --bg-page: #f8fafc;
      --danger: #ef4444;
      --danger-hover: #dc2626;
      --success: #10b981;
      --radius: 8px;
      --radius-lg: 12px;
      --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
      --shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
      --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);

      display: block;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: var(--text-main);
      background-color: transparent;
      box-sizing: border-box;
      line-height: 1.5;
    }

    *, *::before, *::after {
      box-sizing: border-box;
    }

    /* Top ASEN Header Banner */
    .asen-header-banner {
      background: linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 70%, #6366f1 100%);
      padding: 14px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      border-radius: var(--radius-lg);
      margin-bottom: 24px;
      color: #ffffff;
      box-shadow: var(--shadow);
    }

    .brand-area {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      color: #ffffff;
    }

    .brand-logo-badge {
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(8px);
      padding: 6px 14px;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.25);
      font-weight: 800;
      font-size: 20px;
      letter-spacing: 1.5px;
      color: #ffffff;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    }

    .header-search {
      flex: 1;
      max-width: 480px;
      position: relative;
    }

    .header-search input {
      width: 100%;
      padding: 9px 16px 9px 38px;
      border-radius: 9999px;
      border: 1px solid rgba(255, 255, 255, 0.3);
      background: rgba(255, 255, 255, 0.95);
      font-size: 13px;
      color: var(--text-main);
      outline: none;
      transition: all 0.2s ease;
    }

    .header-search input:focus {
      background: #ffffff;
      box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.4);
    }

    .search-icon {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      color: #64748b;
      pointer-events: none;
    }

    .header-nav {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .nav-link {
      color: rgba(255, 255, 255, 0.85);
      text-decoration: none;
      font-weight: 500;
      font-size: 14px;
      transition: color 0.2s;
    }

    .nav-link:hover, .nav-link.active {
      color: #ffffff;
      font-weight: 700;
    }

    .user-avatar-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.15);
      padding: 4px 10px 4px 6px;
      border-radius: 9999px;
      font-size: 13px;
    }

    .avatar-circle {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #818cf8;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 12px;
      color: #ffffff;
    }

    /* Main Container */
    .upload-container {
      background: var(--bg-card);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-light);
      box-shadow: var(--shadow-sm);
      padding: 32px 36px;
      max-width: 960px;
      margin: 0 auto;
    }

    .page-title {
      font-size: 28px;
      font-weight: 700;
      margin: 0 0 12px 0;
      color: #0f172a;
    }

    .divider {
      height: 1px;
      background: var(--border-light);
      margin-bottom: 28px;
    }

    /* Configuration Warning Banner */
    .config-warning {
      background: #fffbeb;
      border-left: 4px solid #f59e0b;
      padding: 16px 20px;
      border-radius: var(--radius);
      margin-bottom: 24px;
      font-size: 14px;
      color: #92400e;
    }

    .config-warning strong {
      display: block;
      margin-bottom: 4px;
    }

    /* Video Post Card */
    .video-card {
      background: #ffffff;
      border: 1px solid var(--border-light);
      border-radius: var(--radius-lg);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      margin-bottom: 24px;
      overflow: hidden;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }

    .video-card:focus-within {
      border-color: #cbd5e1;
    }

    .card-header {
      background: #fafafa;
      padding: 14px 20px;
      border-bottom: 1px solid var(--border-light);
      display: flex;
      align-items: center;
      justify-content: space-between;
      user-select: none;
    }

    .card-title-group {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      flex: 1;
    }

    .card-title-text {
      font-weight: 600;
      font-size: 16px;
      color: #1e293b;
    }

    .collapse-chevron {
      color: var(--text-muted);
      transition: transform 0.2s ease;
    }

    .collapse-chevron.collapsed {
      transform: rotate(-90deg);
    }

    .card-header-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .delete-post-btn {
      background: none;
      border: none;
      color: #ef4444;
      cursor: pointer;
      padding: 4px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s;
    }

    .delete-post-btn:hover {
      background: #fee2e2;
    }

    .card-body {
      padding: 24px 28px;
    }

    /* Dropzone */
    .dropzone {
      border: 2px dashed #c7d2fe;
      background: #f8faff;
      border-radius: var(--radius-lg);
      padding: 36px 20px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
    }

    .dropzone:hover, .dropzone.dragover {
      border-color: var(--primary);
      background: #eef2ff;
      transform: translateY(-1px);
    }

    .dropzone-icon {
      color: var(--primary);
      margin-bottom: 12px;
    }

    .dropzone-text {
      font-size: 15px;
      font-weight: 500;
      color: #334155;
      margin-bottom: 16px;
    }

    .select-file-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: var(--primary);
      color: #ffffff;
      padding: 10px 22px;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.5px;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      transition: background 0.15s ease, transform 0.1s ease;
      box-shadow: 0 1px 2px rgba(88, 80, 236, 0.3);
    }

    .select-file-btn:hover {
      background: var(--primary-hover);
      transform: translateY(-1px);
    }

    .dropzone-hint {
      margin-top: 14px;
      font-size: 12px;
      color: var(--text-muted);
    }

    /* File Attached Badge */
    .file-badge {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      border-radius: var(--radius);
      padding: 12px 16px;
      margin-top: 12px;
    }

    .file-badge-info {
      display: flex;
      align-items: center;
      gap: 12px;
      overflow: hidden;
    }

    .file-badge-icon {
      color: var(--primary);
      flex-shrink: 0;
    }

    .file-badge-name {
      font-weight: 600;
      font-size: 14px;
      color: #0f172a;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 450px;
    }

    .file-badge-size {
      font-size: 12px;
      color: var(--text-muted);
    }

    .remove-file-btn {
      background: none;
      border: none;
      color: #64748b;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: color 0.15s;
    }

    .remove-file-btn:hover {
      color: var(--danger);
    }

    /* Form Fields */
    .form-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 20px;
      margin-top: 24px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-label {
      font-size: 14px;
      font-weight: 600;
      color: #334155;
    }

    .form-label .required {
      color: var(--danger);
      margin-left: 2px;
    }

    .form-input, .form-textarea {
      width: 100%;
      padding: 10px 14px;
      border: 1px solid var(--border-color);
      border-radius: 6px;
      font-size: 14px;
      color: #1e293b;
      background: #ffffff;
      outline: none;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
      font-family: inherit;
    }

    .form-input:focus, .form-textarea:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px var(--primary-focus);
    }

    .form-textarea {
      min-height: 80px;
      resize: vertical;
    }

    /* Attachments Section */
    .attachments-section {
      margin-top: 28px;
      border-top: 1px dashed var(--border-light);
      padding-top: 20px;
    }

    .attachment-dropzone {
      border: 2px dashed #cbd5e1;
      background: #f8fafc;
      border-radius: var(--radius);
      padding: 24px 16px;
      text-align: center;
      cursor: pointer;
      margin-top: 8px;
      transition: all 0.2s ease;
    }

    .attachment-dropzone:hover {
      border-color: var(--primary);
      background: #f1f5f9;
    }

    /* New Post Button */
    .add-post-box {
      margin-bottom: 28px;
    }

    .add-post-btn {
      width: 100%;
      padding: 14px;
      border: 2px dashed #cbd5e1;
      background: #ffffff;
      border-radius: var(--radius-lg);
      font-size: 14px;
      font-weight: 600;
      color: #475569;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.2s ease;
    }

    .add-post-btn:hover {
      border-color: var(--primary);
      color: var(--primary);
      background: var(--primary-light);
    }

    /* Submit Area */
    .submit-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin-top: 16px;
    }

    .create-post-btn {
      background: var(--primary);
      color: #ffffff;
      font-size: 15px;
      font-weight: 700;
      letter-spacing: 0.5px;
      padding: 14px 32px;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      box-shadow: 0 4px 6px -1px rgba(88, 80, 236, 0.4);
      transition: all 0.15s ease;
    }

    .create-post-btn:hover:not(:disabled) {
      background: var(--primary-hover);
      transform: translateY(-1px);
      box-shadow: 0 6px 10px -2px rgba(88, 80, 236, 0.5);
    }

    .create-post-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    /* Modal / Progress Overlay */
    .upload-modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999999;
      padding: 20px;
    }

    .upload-modal-content {
      background: #ffffff;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      width: 100%;
      max-width: 560px;
      padding: 32px 36px;
      text-align: center;
      animation: modalFadeIn 0.25s ease;
    }

    @keyframes modalFadeIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }

    .modal-spinner {
      width: 54px;
      height: 54px;
      border: 4px solid #e0e7ff;
      border-top-color: var(--primary);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 20px auto;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .modal-title {
      font-size: 20px;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 8px 0;
    }

    .modal-subtitle {
      font-size: 14px;
      color: var(--text-muted);
      margin: 0 0 20px 0;
    }

    .progress-bar-container {
      width: 100%;
      height: 12px;
      background: #e2e8f0;
      border-radius: 9999px;
      overflow: hidden;
      margin-bottom: 12px;
    }

    .progress-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #6366f1, #4f46e5);
      border-radius: 9999px;
      transition: width 0.2s ease;
    }

    .progress-stats {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      color: #475569;
      font-weight: 500;
    }

    /* Success Card */
    .success-icon-badge {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: #dcfce7;
      color: var(--success);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px auto;
    }

    /* Footer */
    .page-footer {
      text-align: center;
      padding: 24px 0 12px 0;
      color: #94a3b8;
      font-size: 13px;
      font-weight: 500;
    }

    @media (max-width: 640px) {
      .upload-container {
        padding: 20px 16px;
      }
      .asen-header-banner {
        flex-direction: column;
        align-items: stretch;
      }
      .header-search {
        max-width: 100%;
      }
    }
  `;constructor(){super(),this.title="Upload",this.showHeader="yes",this.allowMultiple="yes",this.theme="light",this.configured="yes",this.maxFileSize=50,this.chunkSize=10,this.videoPosts=[this.createNewPostState(1)],this.isUploading=!1,this.overallProgress=0,this.uploadSpeed="",this.timeRemaining="",this.currentStatus="",this.uploadSuccess=!1,this.createdPosts=[],this.errorMessage=""}createNewPostState(e){return{id:"post_"+Date.now()+"_"+Math.random().toString(36).substr(2,6),index:e,collapsed:!1,videoFile:null,title:"",location:"",reporter:"",categories:"",restriction:"",comments:"",contacts:"",script:"",attachments:[]}}getConfig(){return"undefined"!=typeof window&&window.asenS3Config?window.asenS3Config:{ajaxUrl:"/wp-admin/admin-ajax.php",nonce:"",isConfigured:!0,chunkSizeMb:this.chunkSize||10,maxFileSizeGb:this.maxFileSize||50,user:{isLoggedIn:!0,name:"Badrul",avatar:""}}}formatBytes(e,t=2){if(!e||0===e)return"0 Bytes";const i=t<0?0:t,s=Math.floor(Math.log(e)/Math.log(1024));return parseFloat((e/Math.pow(1024,s)).toFixed(i))+" "+["Bytes","KB","MB","GB","TB"][s]}handleAddVideoPost(){const e=this.videoPosts.length+1;this.videoPosts=[...this.videoPosts,this.createNewPostState(e)]}handleRemoveVideoPost(e){this.videoPosts.length<=1||(this.videoPosts=this.videoPosts.filter(t=>t.id!==e).map((e,t)=>({...e,index:t+1})))}toggleCollapse(e){this.videoPosts=this.videoPosts.map(t=>t.id===e?{...t,collapsed:!t.collapsed}:t)}handleFieldChange(e,t,i){this.videoPosts=this.videoPosts.map(s=>s.id===e?{...s,[t]:i}:s)}handleVideoFileSelect(e,t){if(!t)return;const i=this.getConfig(),s=1024*(i.maxFileSizeGb||50)*1024*1024;t.size>s?alert(`File size exceeds maximum limit of ${i.maxFileSizeGb||50} GB.`):this.videoPosts=this.videoPosts.map((i,s)=>s===e?{...i,videoFile:t}:i)}handleRemoveVideoFile(e){this.videoPosts=this.videoPosts.map((t,i)=>i===e?{...t,videoFile:null}:t)}handleAttachmentSelect(e,t){if(!t||!t.length)return;const i=Array.from(t);this.videoPosts=this.videoPosts.map((t,s)=>s===e?{...t,attachments:[...t.attachments,...i]}:t)}handleRemoveAttachment(e,t){this.videoPosts=this.videoPosts.map((i,s)=>{if(s!==e)return i;const r=i.attachments.filter((e,i)=>i!==t);return{...i,attachments:r}})}async uploadFileToS3(e,t){const i=this.getConfig(),s=i.ajaxUrl,r=i.nonce,o=new FormData;o.append("action","asen_s3_initiate_upload"),o.append("nonce",r),o.append("file_name",e.name),o.append("file_type",e.type||"application/octet-stream"),o.append("file_size",e.size);const a=await fetch(s,{method:"POST",body:o}),n=await a.json();if(!n.success)throw new Error(n.data?.message||"Failed to initiate S3 upload.");const{is_multipart:l,key:d,upload_id:c,put_url:p,file_url:h,chunk_size_bytes:g,bucket:u,region:f}=n.data;if(!l)return new Promise((i,s)=>{const r=new XMLHttpRequest;r.open("PUT",p,!0),e.type&&r.setRequestHeader("Content-Type",e.type),r.upload.onprogress=e=>{e.lengthComputable&&t(e.loaded,e.total)},r.onload=()=>{if(r.status>=200&&r.status<300){const t=(r.getResponseHeader("ETag")||"").replace(/"/g,"");i({key:d,url:h,bucket:u||"",region:f||"",filesize:e.size,filename:e.name,mime:e.type||"application/octet-stream",etag:t})}else s(new Error(`S3 PUT failed with HTTP status ${r.status}`))},r.onerror=()=>s(new Error("Network error during S3 PUT upload.")),r.send(e)});const m=g||10485760,b=Math.ceil(e.size/m),v=[],x=new Array(b).fill(0),y=()=>{const i=x.reduce((e,t)=>e+t,0);t(i,e.size)};let _=1;const w=async t=>{const i=(t-1)*m,o=Math.min(i+m,e.size),a=e.slice(i,o),n=new FormData;n.append("action","asen_s3_sign_parts"),n.append("nonce",r),n.append("key",d),n.append("upload_id",c),n.append("parts[]",t);const l=await fetch(s,{method:"POST",body:n}),p=await l.json();if(!p.success||!p.data.urls?.[t])throw new Error(`Failed to sign S3 part ${t}`);const h=p.data.urls[t];return new Promise((e,i)=>{const s=new XMLHttpRequest;s.open("PUT",h,!0),s.upload.onprogress=e=>{e.lengthComputable&&(x[t-1]=e.loaded,y())},s.onload=()=>{if(s.status>=200&&s.status<300){const i=(s.getResponseHeader("ETag")||"").replace(/"/g,"");x[t-1]=a.size,y(),e({PartNumber:t,ETag:`"${i}"`})}else i(new Error(`S3 Part ${t} upload failed with HTTP ${s.status}`))},s.onerror=()=>i(new Error(`Network error uploading Part ${t}`)),s.send(a)})},$=Array.from({length:2},async()=>{for(;_<=b;){const e=_++;let t=0,i=!1;for(;!i&&t<3;)try{t++;const s=await w(e);v.push(s),i=!0}catch(e){if(t>=3)throw e;await new Promise(e=>setTimeout(e,1e3*t))}}});await Promise.all($);const k=new FormData;k.append("action","asen_s3_complete_upload"),k.append("nonce",r),k.append("key",d),k.append("upload_id",c),k.append("parts",JSON.stringify(v));const P=await fetch(s,{method:"POST",body:k}),S=await P.json();if(!S.success)throw new Error(S.data?.message||"Failed to complete S3 multipart upload.");return{key:S.data.key,url:S.data.url||S.data.location,bucket:S.data.bucket||u,region:S.data.region||f,filesize:e.size,filename:e.name,mime:e.type||"video/mp4",etag:S.data.etag}}async handleCreatePosts(){this.errorMessage="";for(const e of this.videoPosts){if(!e.videoFile)return void(this.errorMessage=`Please select a video/audio file for Video Post ${e.index}.`);if(!e.title.trim())return void(this.errorMessage=`Title is required for Video Post ${e.index}.`);if(!e.location.trim())return void(this.errorMessage=`Location is required for Video Post ${e.index}.`);if(!e.reporter.trim())return void(this.errorMessage=`Reporter is required for Video Post ${e.index}.`);if(!e.categories.trim())return void(this.errorMessage=`Categories are required for Video Post ${e.index}.`)}this.isUploading=!0,this.overallProgress=0,this.currentStatus="Preparing upload directly to AWS S3...";const e=Date.now();let t=0,i=0;for(const e of this.videoPosts){e.videoFile&&(t+=e.videoFile.size);for(const i of e.attachments)t+=i.size}const s=new Map,r=()=>{i=Array.from(s.values()).reduce((e,t)=>e+t,0);const r=Math.min(99,Math.round(i/t*100));this.overallProgress=isNaN(r)?0:r;const o=(Date.now()-e)/1e3;if(o>.5&&i>0){const e=i/o;this.uploadSpeed=`${this.formatBytes(e)}/s`;const s=t-i,r=Math.round(s/e);this.timeRemaining=r>60?`${Math.round(r/60)} min left`:`${Math.max(1,r)}s left`}};try{const e=[];for(let t=0;t<this.videoPosts.length;t++){const i=this.videoPosts[t];this.currentStatus=`Uploading Video Post ${i.index} video directly to S3...`;const o=await this.uploadFileToS3(i.videoFile,e=>{s.set(i.videoFile,e),r()}),a=[];for(let e=0;e<i.attachments.length;e++){const t=i.attachments[e];this.currentStatus=`Uploading attachment ${e+1} of ${i.attachments.length} to S3...`;const o=await this.uploadFileToS3(t,e=>{s.set(t,e),r()});a.push(o)}const n=i.categories.split(",").map(e=>e.trim()).filter(Boolean);e.push({title:i.title,location:i.location,reporter:i.reporter,categories:n,restriction:i.restriction,comments:i.comments,contacts:i.contacts,script:i.script,video_file:o,attachments:a})}this.currentStatus="Registering posts and WP Offload Media records...",this.overallProgress=100;const t=this.getConfig(),i=new FormData;i.append("action","asen_s3_create_post"),i.append("nonce",t.nonce),i.append("posts",JSON.stringify(e));const o=await fetch(t.ajaxUrl,{method:"POST",body:i}),a=await o.json();if(!a.success)throw new Error(a.data?.message||"Failed to save post records in WordPress.");this.createdPosts=a.data.posts||[],this.uploadSuccess=!0,this.isUploading=!1}catch(e){console.error("Upload Error:",e),this.isUploading=!1,this.errorMessage=e.message||"An error occurred during upload."}}handleReset(){this.videoPosts=[this.createNewPostState(1)],this.uploadSuccess=!1,this.createdPosts=[],this.errorMessage=""}renderHeaderBanner(){if("yes"!==this.showHeader)return W;const e=this.getConfig(),t=e.user?.name||"Badrul";return q`
      <div class="asen-header-banner">
        <a href="${e.homeUrl||"/"}" class="brand-area">
          <div class="brand-logo-badge">ASEN</div>
        </a>

        <div class="header-search">
          <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" placeholder="Search by Title, Description, Tags, and More..." />
        </div>

        <div class="header-nav">
          <a href="${e.homeUrl||"/"}" class="nav-link">Home</a>
          <a href="#" class="nav-link active">Upload</a>
          <div class="user-avatar-badge">
            <div class="avatar-circle">${t.charAt(0).toUpperCase()}</div>
            <span>Howdy, ${t}</span>
          </div>
        </div>
      </div>
    `}renderVideoDropzone(e,t){return e.videoFile?q`
        <div class="file-badge">
          <div class="file-badge-info">
            <svg class="file-badge-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14v-4z"></path>
              <rect x="1" y="5" width="14" height="14" rx="2" ry="2"></rect>
            </svg>
            <div>
              <div class="file-badge-name" title="${e.videoFile.name}">${e.videoFile.name}</div>
              <div class="file-badge-size">${this.formatBytes(e.videoFile.size)} &bull; ${e.videoFile.type||"Video"}</div>
            </div>
          </div>
          <button type="button" class="remove-file-btn" @click="${()=>this.handleRemoveVideoFile(t)}" title="Remove file">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      `:q`
      <div
        class="dropzone"
        @dragover="${e=>{e.preventDefault(),e.currentTarget.classList.add("dragover")}}"
        @dragleave="${e=>{e.preventDefault(),e.currentTarget.classList.remove("dragover")}}"
        @drop="${e=>{e.preventDefault(),e.currentTarget.classList.remove("dragover"),e.dataTransfer.files?.length&&this.handleVideoFileSelect(t,e.dataTransfer.files[0])}}"
      >
        <svg class="dropzone-icon" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>
        <div class="dropzone-text">Drag and drop video/audio file to upload</div>
        <input
          type="file"
          id="video_input_${t}"
          style="display:none"
          accept="video/*,audio/*,.mxf,.mov,.mp4,.wav,.mkv,.avi"
          @change="${e=>{e.target.files?.length&&this.handleVideoFileSelect(t,e.target.files[0])}}"
        />
        <button
          type="button"
          class="select-file-btn"
          @click="${()=>this.renderRoot.getElementById(`video_input_${t}`).click()}"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          SELECT FILE
        </button>
        <div class="dropzone-hint">
          Supports: *.mp4, *.mov, *.mxf, *.wav. Direct S3 upload supports files up to ${this.maxFileSize} Gigabytes.
        </div>
      </div>
    `}renderAttachments(e,t){return q`
      <div class="attachments-section">
        <label class="form-label">Attachments</label>
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">
          Supports: *.pdf, *.doc, *.docx, *.csv, *.xlsx, *.txt. Maximum upload file size: 50 Megabyte
        </div>

        ${e.attachments.map((e,i)=>q`
            <div class="file-badge" style="margin-bottom:8px;padding:8px 12px;">
              <div class="file-badge-info">
                <svg class="file-badge-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                <div class="file-badge-name" style="font-size:13px;">${e.name}</div>
                <div class="file-badge-size">(${this.formatBytes(e.size)})</div>
              </div>
              <button
                type="button"
                class="remove-file-btn"
                @click="${()=>this.handleRemoveAttachment(t,i)}"
                title="Remove attachment"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          `)}

        <div
          class="attachment-dropzone"
          @click="${()=>this.renderRoot.getElementById(`att_input_${t}`).click()}"
        >
          <input
            type="file"
            id="att_input_${t}"
            multiple
            style="display:none"
            accept=".pdf,.doc,.docx,.csv,.xlsx,.txt"
            @change="${e=>this.handleAttachmentSelect(t,e.target.files)}"
          />
          <div style="font-size:13px;font-weight:600;color:#475569;margin-bottom:6px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:4px;">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            Add Optional Attachment
          </div>
          <button type="button" class="select-file-btn" style="padding:6px 14px;font-size:12px;">
            SELECT FILE
          </button>
        </div>
      </div>
    `}renderVideoPostCard(e,t){return q`
      <div class="video-card">
        <div class="card-header">
          <div class="card-title-group" @click="${()=>this.toggleCollapse(e.id)}">
            <svg
              class="collapse-chevron ${e.collapsed?"collapsed":""}"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
            <span class="card-title-text">Video Post ${e.index}</span>
          </div>

          <div class="card-header-actions">
            ${this.videoPosts.length>1?q`
                  <button
                    type="button"
                    class="delete-post-btn"
                    title="Remove Video Post"
                    @click="${()=>this.handleRemoveVideoPost(e.id)}"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="15" y1="9" x2="9" y2="15"></line>
                      <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                  </button>
                `:W}
          </div>
        </div>

        ${e.collapsed?W:q`
              <div class="card-body">
                ${this.renderVideoDropzone(e,t)}

                <div class="form-grid">
                  <div class="form-group">
                    <label class="form-label" for="title_${e.id}">
                      Title<span class="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="title_${e.id}"
                      class="form-input"
                      placeholder="Enter the title of the post"
                      .value="${e.title}"
                      @input="${t=>this.handleFieldChange(e.id,"title",t.target.value)}"
                    />
                  </div>

                  <div class="form-group">
                    <label class="form-label" for="loc_${e.id}">
                      Location<span class="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="loc_${e.id}"
                      class="form-input"
                      placeholder="e.g. Kuala Lumpur, Malaysia"
                      .value="${e.location}"
                      @input="${t=>this.handleFieldChange(e.id,"location",t.target.value)}"
                    />
                  </div>

                  <div class="form-group">
                    <label class="form-label" for="rep_${e.id}">
                      Reporter<span class="required">*</span>
                    </label>
                    <textarea
                      id="rep_${e.id}"
                      class="form-textarea"
                      placeholder="Reporter name or bureau details"
                      rows="2"
                      .value="${e.reporter}"
                      @input="${t=>this.handleFieldChange(e.id,"reporter",t.target.value)}"
                    ></textarea>
                  </div>

                  <div class="form-group">
                    <label class="form-label" for="cat_${e.id}">
                      Categories<span class="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="cat_${e.id}"
                      class="form-input"
                      placeholder="e.g. News, Technology, Climate (comma separated)"
                      .value="${e.categories}"
                      @input="${t=>this.handleFieldChange(e.id,"categories",t.target.value)}"
                    />
                  </div>

                  <div class="form-group">
                    <label class="form-label" for="rest_${e.id}">Restriction</label>
                    <input
                      type="text"
                      id="rest_${e.id}"
                      class="form-input"
                      placeholder="e.g. Free for ASEN Members, Embargo until..."
                      .value="${e.restriction}"
                      @input="${t=>this.handleFieldChange(e.id,"restriction",t.target.value)}"
                    />
                  </div>

                  <div class="form-group">
                    <label class="form-label" for="comm_${e.id}">Comments</label>
                    <input
                      type="text"
                      id="comm_${e.id}"
                      class="form-input"
                      placeholder="Additional remarks or notes"
                      .value="${e.comments}"
                      @input="${t=>this.handleFieldChange(e.id,"comments",t.target.value)}"
                    />
                  </div>

                  <div class="form-group">
                    <label class="form-label" for="cont_${e.id}">Contacts</label>
                    <input
                      type="text"
                      id="cont_${e.id}"
                      class="form-input"
                      placeholder="Contact email or phone number"
                      .value="${e.contacts}"
                      @input="${t=>this.handleFieldChange(e.id,"contacts",t.target.value)}"
                    />
                  </div>

                  <div class="form-group">
                    <label class="form-label" for="script_${e.id}">Script</label>
                    <textarea
                      id="script_${e.id}"
                      class="form-textarea"
                      rows="4"
                      placeholder="Paste news script, transcript, or rundown text here..."
                      .value="${e.script}"
                      @input="${t=>this.handleFieldChange(e.id,"script",t.target.value)}"
                    ></textarea>
                  </div>
                </div>

                ${this.renderAttachments(e,t)}
              </div>
            `}
      </div>
    `}renderProgressModal(){return this.isUploading?q`
      <div class="upload-modal-backdrop">
        <div class="upload-modal-content">
          <div class="modal-spinner"></div>
          <h3 class="modal-title">Uploading Directly to AWS S3</h3>
          <p class="modal-subtitle">${this.currentStatus}</p>

          <div class="progress-bar-container">
            <div class="progress-bar-fill" style="width: ${this.overallProgress}%;"></div>
          </div>

          <div class="progress-stats">
            <span>${this.overallProgress}% Completed</span>
            <span>${this.uploadSpeed} ${this.timeRemaining?`&bull; ${this.timeRemaining}`:""}</span>
          </div>
        </div>
      </div>
    `:W}renderSuccessState(){return q`
      <div class="upload-container" style="text-align:center;padding:48px 32px;">
        <div class="success-icon-badge">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h2 style="font-size:24px;margin:0 0 8px 0;color:#0f172a;">Upload Complete!</h2>
        <p style="color:var(--text-muted);margin:0 0 24px 0;">
          All files have been uploaded directly to Amazon AWS S3 and registered with WP Offload Media metadata.
        </p>

        ${this.createdPosts.length>0?q`
              <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px;max-width:500px;margin:0 auto 24px auto;text-align:left;">
                <div style="font-weight:600;font-size:14px;margin-bottom:8px;color:#334155;">Created Posts:</div>
                <ul style="margin:0;padding-left:20px;font-size:14px;">
                  ${this.createdPosts.map(e=>q`
                      <li style="margin-bottom:6px;">
                        <a href="${e.permalink}" target="_blank" style="color:var(--primary);text-decoration:none;font-weight:500;">
                          ${e.title} &rarr;
                        </a>
                      </li>
                    `)}
                </ul>
              </div>
            `:W}

        <button type="button" class="create-post-btn" @click="${()=>this.handleReset()}">
          Upload More Video Posts
        </button>
      </div>
    `}render(){if(this.uploadSuccess)return q`
        ${this.renderHeaderBanner()}
        ${this.renderSuccessState()}
        <div class="page-footer">Powered by ABU-ASEN</div>
      `;const e=this.getConfig(),t="yes"===this.configured&&!1!==e.isConfigured;return q`
      ${this.renderHeaderBanner()}

      <div class="upload-container">
        <h1 class="page-title">${this.title||"Upload"}</h1>
        <div class="divider"></div>

        ${t?W:q`
              <div class="config-warning">
                <strong>AWS S3 Credentials Required</strong>
                Amazon AWS S3 credentials are not yet configured. Please configure your Access Key, Secret Key, and Bucket in
                <strong>WordPress Admin &rarr; ASEN S3 Media &rarr; AWS S3 Settings</strong>.
              </div>
            `}

        ${this.errorMessage?q`
              <div style="background:#fef2f2;border-left:4px solid #ef4444;color:#991b1b;padding:14px 18px;border-radius:6px;margin-bottom:20px;font-size:14px;">
                <strong>Error:</strong> ${this.errorMessage}
              </div>
            `:W}

        <!-- Video Post Cards -->
        ${this.videoPosts.map((e,t)=>this.renderVideoPostCard(e,t))}

        <!-- New Video Post Button -->
        ${"yes"===this.allowMultiple?q`
              <div class="add-post-box">
                <button type="button" class="add-post-btn" @click="${()=>this.handleAddVideoPost()}">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  New Video Post
                </button>
              </div>
            `:W}

        <!-- Submit Button -->
        <div class="submit-bar">
          <button
            type="button"
            class="create-post-btn"
            ?disabled="${this.isUploading}"
            @click="${()=>this.handleCreatePosts()}"
          >
            CREATE POST
          </button>
        </div>
      </div>

      ${this.renderProgressModal()}

      <div class="page-footer">Powered by ABU-ASEN</div>
    `}}customElements.get("asen-s3-uploader")||customElements.define("asen-s3-uploader",fe)})();