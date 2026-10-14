/*! For license information please see asen-s3-uploader.js.LICENSE.txt */
(()=>{"use strict";const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),s=new WeakMap;class o{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const i=this.t;if(e&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=s.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&s.set(i,t))}return t}toString(){return this.cssText}}const r=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new o(s,t,i)},n=(i,s)=>{if(e)i.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of s){const s=document.createElement("style"),o=t.litNonce;void 0!==o&&s.setAttribute("nonce",o),s.textContent=e.cssText,i.appendChild(s)}},a=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:l,defineProperty:d,getOwnPropertyDescriptor:c,getOwnPropertyNames:p,getOwnPropertySymbols:h,getPrototypeOf:f}=Object,u=globalThis,g=u.trustedTypes,v=g?g.emptyScript:"",m=u.reactiveElementPolyfillSupport,x=(t,e)=>t,b={toAttribute(t,e){switch(e){case Boolean:t=t?v:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},y=(t,e)=>!l(t,e),w={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:y};Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;class $ extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=w){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&d(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:o}=c(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const r=s?.call(this);o?.call(this,e),this.requestUpdate(t,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??w}static _$Ei(){if(this.hasOwnProperty(x("elementProperties")))return;const t=f(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(x("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(x("properties"))){const t=this.properties,e=[...p(t),...h(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return n(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const o=(void 0!==i.converter?.toAttribute?i.converter:b).toAttribute(e,i.type);this._$Em=t,null==o?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:b;this._$Em=s;const r=o.fromAttribute(e,t.type);this[s]=r??this._$Ej?.get(s)??r,this._$Em=null}}requestUpdate(t,e,i,s=!1,o){if(void 0!==t){const r=this.constructor;if(!1===s&&(o=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??y)(o,e)||i.useDefault&&i.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:o},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),!0!==o||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}}$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[x("elementProperties")]=new Map,$[x("finalized")]=new Map,m?.({ReactiveElement:$}),(u.reactiveElementVersions??=[]).push("2.1.2");const _=globalThis,S=t=>t,A=_.trustedTypes,k=A?A.createPolicy("lit-html",{createHTML:t=>t}):void 0,P="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,z="?"+C,E=`<${z}>`,M=document,N=()=>M.createComment(""),T=t=>null===t||"object"!=typeof t&&"function"!=typeof t,R=Array.isArray,U="[ \t\n\f\r]",F=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,B=/-->/g,H=/>/g,O=RegExp(`>|${U}(?:([^\\s"'>=/]+)(${U}*=${U}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),I=/'/g,D=/"/g,L=/^(?:script|style|textarea|title)$/i,V=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),j=V(1),q=(V(2),V(3),Symbol.for("lit-noChange")),W=Symbol.for("lit-nothing"),G=new WeakMap,K=M.createTreeWalker(M,129);function J(t,e){if(!R(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==k?k.createHTML(e):e}const X=(t,e)=>{const i=t.length-1,s=[];let o,r=2===e?"<svg>":3===e?"<math>":"",n=F;for(let e=0;e<i;e++){const i=t[e];let a,l,d=-1,c=0;for(;c<i.length&&(n.lastIndex=c,l=n.exec(i),null!==l);)c=n.lastIndex,n===F?"!--"===l[1]?n=B:void 0!==l[1]?n=H:void 0!==l[2]?(L.test(l[2])&&(o=RegExp("</"+l[2],"g")),n=O):void 0!==l[3]&&(n=O):n===O?">"===l[0]?(n=o??F,d=-1):void 0===l[1]?d=-2:(d=n.lastIndex-l[2].length,a=l[1],n=void 0===l[3]?O:'"'===l[3]?D:I):n===D||n===I?n=O:n===B||n===H?n=F:(n=O,o=void 0);const p=n===O&&t[e+1].startsWith("/>")?" ":"";r+=n===F?i+E:d>=0?(s.push(a),i.slice(0,d)+P+i.slice(d)+C+p):i+C+(-2===d?e:p)}return[J(t,r+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class Y{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let o=0,r=0;const n=t.length-1,a=this.parts,[l,d]=X(t,e);if(this.el=Y.createElement(l,i),K.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=K.nextNode())&&a.length<n;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(P)){const e=d[r++],i=s.getAttribute(t).split(C),n=/([.?@])?(.*)/.exec(e);a.push({type:1,index:o,name:n[2],strings:i,ctor:"."===n[1]?it:"?"===n[1]?st:"@"===n[1]?ot:et}),s.removeAttribute(t)}else t.startsWith(C)&&(a.push({type:6,index:o}),s.removeAttribute(t));if(L.test(s.tagName)){const t=s.textContent.split(C),e=t.length-1;if(e>0){s.textContent=A?A.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],N()),K.nextNode(),a.push({type:2,index:++o});s.append(t[e],N())}}}else if(8===s.nodeType)if(s.data===z)a.push({type:2,index:o});else{let t=-1;for(;-1!==(t=s.data.indexOf(C,t+1));)a.push({type:7,index:o}),t+=C.length-1}o++}}static createElement(t,e){const i=M.createElement("template");return i.innerHTML=t,i}}function Z(t,e,i=t,s){if(e===q)return e;let o=void 0!==s?i._$Co?.[s]:i._$Cl;const r=T(e)?void 0:e._$litDirective$;return o?.constructor!==r&&(o?._$AO?.(!1),void 0===r?o=void 0:(o=new r(t),o._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=o:i._$Cl=o),void 0!==o&&(e=Z(t,o._$AS(t,e.values),o,s)),e}class Q{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??M).importNode(e,!0);K.currentNode=s;let o=K.nextNode(),r=0,n=0,a=i[0];for(;void 0!==a;){if(r===a.index){let e;2===a.type?e=new tt(o,o.nextSibling,this,t):1===a.type?e=new a.ctor(o,a.name,a.strings,this,t):6===a.type&&(e=new rt(o,this,t)),this._$AV.push(e),a=i[++n]}r!==a?.index&&(o=K.nextNode(),r++)}return K.currentNode=M,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class tt{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=W,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Z(this,t,e),T(t)?t===W||null==t||""===t?(this._$AH!==W&&this._$AR(),this._$AH=W):t!==this._$AH&&t!==q&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>R(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==W&&T(this._$AH)?this._$AA.nextSibling.data=t:this.T(M.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=Y.createElement(J(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new Q(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=G.get(t.strings);return void 0===e&&G.set(t.strings,e=new Y(t)),e}k(t){R(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const o of t)s===e.length?e.push(i=new tt(this.O(N()),this.O(N()),this,this.options)):i=e[s],i._$AI(o),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=S(t).nextSibling;S(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class et{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,o){this.type=1,this._$AH=W,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=o,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=W}_$AI(t,e=this,i,s){const o=this.strings;let r=!1;if(void 0===o)t=Z(this,t,e,0),r=!T(t)||t!==this._$AH&&t!==q,r&&(this._$AH=t);else{const s=t;let n,a;for(t=o[0],n=0;n<o.length-1;n++)a=Z(this,s[i+n],e,n),a===q&&(a=this._$AH[n]),r||=!T(a)||a!==this._$AH[n],a===W?t=W:t!==W&&(t+=(a??"")+o[n+1]),this._$AH[n]=a}r&&!s&&this.j(t)}j(t){t===W?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class it extends et{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===W?void 0:t}}class st extends et{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==W)}}class ot extends et{constructor(t,e,i,s,o){super(t,e,i,s,o),this.type=5}_$AI(t,e=this){if((t=Z(this,t,e,0)??W)===q)return;const i=this._$AH,s=t===W&&i!==W||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,o=t!==W&&(i===W||s);s&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class rt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Z(this,t)}}const nt=_.litHtmlPolyfillSupport;nt?.(Y,tt),(_.litHtmlVersions??=[]).push("3.3.3");const at=globalThis;class lt extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let o=s._$litPart$;if(void 0===o){const t=i?.renderBefore??null;s._$litPart$=o=new tt(e.insertBefore(N(),t),t,void 0,i??{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}}lt._$litElement$=!0,lt.finalized=!0,at.litElementHydrateSupport?.({LitElement:lt});const dt=at.litElementPolyfillSupport;dt?.({LitElement:lt}),(at.litElementVersions??=[]).push("4.2.2");class ct extends lt{static properties={allowMultiple:{type:String,attribute:"allow-multiple"},theme:{type:String},configured:{type:String},maxFileSize:{type:Number,attribute:"max-file-size"},chunkSize:{type:Number,attribute:"chunk-size"},videoPosts:{state:!0},activePostIndex:{state:!0},isUploading:{state:!0},overallProgress:{state:!0},uploadSpeed:{state:!0},timeRemaining:{state:!0},currentStatus:{state:!0},uploadSuccess:{state:!0},createdPosts:{state:!0},errorMessage:{state:!0},notifications:{state:!0},isNotificationMinimized:{state:!0}};static styles=r`
    :host {
      --primary: #4f46e5;
      --primary-hover: #4338ca;
      --primary-light: #eef2ff;
      --primary-border: #c7d2fe;
      --text-main: #1e293b;
      --text-muted: #64748b;
      --text-light: #94a3b8;
      --border-color: #e2e8f0;
      --border-focus: #818cf8;
      --bg-card: #ffffff;
      --bg-page: #f8fafc;
      --bg-dropzone: #fbfcfe;
      --danger: #ef4444;
      --danger-hover: #dc2626;
      --success: #10b981;
      --info-bg: #eff6ff;
      --info-border: #bfdbfe;
      --info-text: #1d4ed8;
      --radius: 8px;
      --radius-lg: 14px;
      --radius-full: 9999px;
      --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
      --shadow-card: 0 10px 25px -5px rgba(99, 102, 241, 0.07), 0 4px 10px -3px rgba(0, 0, 0, 0.04);
      --shadow-lg: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);

      display: block;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      color: var(--text-main);
      box-sizing: border-box;
      line-height: 1.45;
    }

    *, *::before, *::after {
      box-sizing: border-box;
    }

    /* Main Container Card */
    .main-card {
      background: var(--bg-card);
      padding: 1.75rem 0;
      max-width: 1920px;
      margin: 0 auto;
    }

    /* Card Top Header */
    .card-top-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 24px;
      padding-bottom: 18px;
      border-bottom: 1px solid var(--border-color);
      min-height: 54px;
    }

    /* Post switcher tabs if multiple posts exist */
    .posts-tabs-nav {
      display: flex;
      align-items: center;
      gap: 8px;
      overflow-x: auto;
      padding-bottom: 4px;
      margin-right: auto;
      min-width: 0;
    }

    .post-tab-item {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: var(--radius-full);
      font-size: 12.5px;
      font-weight: 600;
      background: #f1f5f9;
      color: var(--text-muted);
      cursor: pointer;
      border: 1px solid transparent;
      transition: all 0.15s ease;
    }

    .post-tab-item.active {
      background: var(--primary-light);
      color: var(--primary);
      border-color: var(--primary-border);
    }

    .post-tab-remove {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: none;
      border: none;
      cursor: pointer;
      color: var(--text-muted);
      padding: 0;
    }

    .post-tab-remove:hover {
      color: var(--danger);
      background: #fee2e2;
    }

    /* Two-Column Grid */
    .compact-grid {
      display: grid;
      grid-template-columns: 1.42fr 1fr;
      gap: 28px;
      align-items: start;
    }

    .col-left, .col-right {
      display: flex;
      flex-direction: column;
      gap: 22px;
    }

    /* Step Section */
    .step-section {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .step-header {
      display: flex;
      align-items: flex-start;
      gap: 10px;
    }

    .step-number-badge {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #4338ca;
      color: #ffffff;
      font-size: 12px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-top: 1px;
    }

    .step-titles {
      flex: 1;
    }

    .step-title-text {
      font-size: 14.5px;
      font-weight: 700;
      color: #0f172a;
      display: flex;
      align-items: center;
      gap: 3px;
    }

    .step-title-text .req {
      color: var(--danger);
    }

    .step-subtitle-text {
      font-size: 12px;
      color: var(--text-muted);
      margin-top: 1px;
    }

    /* Dropzones */
    .compact-dropzone {
      border: 1.5px dashed var(--primary-border);
      background: var(--bg-dropzone);
      border-radius: 10px;
      padding: 22px 16px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .compact-dropzone:hover, .compact-dropzone.dragover {
      border-color: var(--primary);
      background: #f5f7ff;
    }

    .dropzone-cloud-icon {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #eef2ff;
      color: var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 8px;
    }

    .dropzone-main-text {
      font-size: 13.5px;
      font-weight: 600;
      color: #334155;
      margin-bottom: 2px;
    }

    .dropzone-or-text {
      font-size: 12px;
      color: var(--text-light);
      margin-bottom: 8px;
    }

    .btn-select-file {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: var(--primary);
      color: #ffffff;
      padding: 7px 18px;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.3px;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      transition: all 0.15s ease;
      box-shadow: 0 1px 2px rgba(79, 70, 229, 0.25);
    }

    .btn-select-file:hover {
      background: var(--primary-hover);
      transform: translateY(-1px);
    }

    .dropzone-footer-hint {
      margin-top: 10px;
      font-size: 11px;
      color: var(--text-muted);
    }

    /* Compact File Badge (When selected) */
    .file-selected-badge {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      background: #f8fafc;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 9px 12px;
    }

    .file-selected-info {
      display: flex;
      align-items: center;
      gap: 9px;
      overflow: hidden;
    }

    .file-icon-square {
      width: 28px;
      height: 28px;
      border-radius: 6px;
      background: #e0e7ff;
      color: var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .file-selected-name {
      font-weight: 600;
      font-size: 12.5px;
      color: #1e293b;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 260px;
    }

    .file-selected-size {
      font-size: 11px;
      color: var(--text-muted);
    }

    .btn-file-remove {
      background: none;
      border: none;
      color: var(--text-light);
      cursor: pointer;
      padding: 2px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.15s;
    }

    .btn-file-remove:hover {
      color: var(--danger);
    }

    /* Form Inputs with Leading Icons */
    .field-row {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .field-label {
      font-size: 12.5px;
      font-weight: 600;
      color: #334155;
    }

    .field-label .req {
      color: var(--danger);
    }

    .input-with-icon {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
    }

    .input-leading-icon {
      position: absolute;
      left: 11px;
      color: #94a3b8;
      pointer-events: none;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .input-trailing-icon {
      position: absolute;
      right: 11px;
      color: #94a3b8;
      pointer-events: none;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .compact-input {
      width: 100%;
      padding: 8px 12px 8px 34px;
      border: 1px solid var(--border-color);
      border-radius: 6px;
      font-size: 13px;
      color: #1e293b;
      background: #ffffff;
      outline: none;
      font-family: inherit;
      transition: all 0.15s ease;
    }

    .compact-input:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.12);
    }

    .compact-textarea {
      width: 100%;
      padding: 8px 12px 8px 34px;
      border: 1px solid var(--border-color);
      border-radius: 6px;
      font-size: 13px;
      color: #1e293b;
      background: #ffffff;
      outline: none;
      font-family: inherit;
      min-height: 52px;
      resize: vertical;
      transition: all 0.15s ease;
    }

    .compact-textarea:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.12);
    }

    .textarea-leading-icon {
      position: absolute;
      left: 11px;
      top: 10px;
      color: #94a3b8;
      pointer-events: none;
    }

    /* Side-by-side 2 column fields */
    .two-col-fields {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    /* Right column Info Notice */
    .info-notice-box {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      background: var(--info-bg);
      border: 1px solid var(--info-border);
      border-radius: 8px;
      padding: 10px 12px;
      font-size: 12px;
      color: #1e40af;
      line-height: 1.4;
    }

    .info-notice-icon {
      color: var(--info-text);
      flex-shrink: 0;
      margin-top: 1px;
    }

    /* Attachments list */
    .attachments-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-top: 4px;
    }

    /* Bottom Action Bar */
    .card-footer-actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin-top: 28px;
      padding-top: 20px;
      border-top: 1px solid var(--border-color);
    }

    .btn-add-more-post {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #ffffff;
      color: var(--primary);
      border: 1px solid var(--primary);
      padding: 8px 16px;
      font-size: 13px;
      font-weight: 600;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .btn-add-more-post:hover {
      background: var(--primary-light);
    }

    .card-top-header .btn-add-more-post {
      flex-shrink: 0;
    }

    .right-action-btns {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .btn-cancel {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #ffffff;
      color: #475569;
      border: 1px solid var(--border-color);
      padding: 8px 18px;
      font-size: 13px;
      font-weight: 600;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .btn-cancel:hover {
      background: #f1f5f9;
      color: #1e293b;
    }

    .btn-create-post {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #4338ca;
      color: #ffffff;
      border: none;
      padding: 8px 22px;
      font-size: 13px;
      font-weight: 600;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.15s ease;
      box-shadow: 0 2px 4px rgba(67, 56, 202, 0.3);
    }

    .btn-create-post:hover:not(:disabled) {
      background: #3730a3;
      transform: translateY(-1px);
    }

    .btn-create-post:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    /* ------------------------------------------------------------- */
    /* REAL-TIME NOTIFICATION COMPONENT STYLES                       */
    /* ------------------------------------------------------------- */
    .notification-dock {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 999999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 420px;
      width: calc(100vw - 48px);
      pointer-events: none;
    }

    .notification-card {
      pointer-events: auto;
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
      border: 1px solid #cbd5e1;
      padding: 14px 16px;
      animation: slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      transition: all 0.2s ease;
      overflow: hidden;
      position: relative;
    }

    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    .notification-card.progress-active {
      border-left: 4px solid var(--primary);
    }

    .notification-card.success {
      border-left: 4px solid var(--success);
      background: #f0fdf4;
    }

    .notification-card.error {
      border-left: 4px solid var(--danger);
      background: #fef2f2;
    }

    .notif-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      margin-bottom: 8px;
    }

    .notif-title-area {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .notif-pulse-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--primary);
      box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.7);
      animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
      0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.7); }
      70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(79, 70, 229, 0); }
      100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(79, 70, 229, 0); }
    }

    .notif-title {
      font-size: 13.5px;
      font-weight: 700;
      color: #0f172a;
    }

    .notif-controls {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .notif-icon-btn {
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      padding: 2px 4px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .notif-icon-btn:hover {
      color: #0f172a;
      background: #f1f5f9;
    }

    .notif-message {
      font-size: 12.5px;
      color: var(--text-muted);
      margin-bottom: 8px;
    }

    .notif-progress-track {
      width: 100%;
      height: 6px;
      background: #e2e8f0;
      border-radius: var(--radius-full);
      overflow: hidden;
      margin-bottom: 6px;
    }

    .notif-progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #6366f1, #4f46e5);
      border-radius: var(--radius-full);
      transition: width 0.2s ease;
    }

    .notif-meta-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 11.5px;
      font-weight: 600;
      color: #475569;
    }

    /* Minimized pill widget */
    .notif-minimized-pill {
      pointer-events: auto;
      background: #1e1b4b;
      color: #ffffff;
      padding: 8px 14px;
      border-radius: var(--radius-full);
      box-shadow: var(--shadow-lg);
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      animation: slideInRight 0.2s ease;
    }

    .notif-minimized-pill:hover {
      background: #312e81;
    }

    /* Config notice */
    .config-alert {
      background: #fffbeb;
      border-left: 4px solid #f59e0b;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 13px;
      color: #92400e;
      margin-bottom: 20px;
    }

    /* Success Screen */
    .success-view {
      text-align: center;
      padding: 36px 20px;
    }

    .success-icon-badge {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: #dcfce7;
      color: var(--success);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 14px auto;
    }

    .success-title {
      font-size: 22px;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 6px 0;
    }

    .success-subtitle {
      font-size: 13.5px;
      color: var(--text-muted);
      margin: 0 0 20px 0;
    }

    .posts-published-list {
      background: #f8fafc;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 14px 18px;
      max-width: 480px;
      margin: 0 auto 24px auto;
      text-align: left;
    }

    @media (max-width: 860px) {
      .compact-grid {
        grid-template-columns: 1fr;
        gap: 20px;
      }
      .main-card {
        padding: 20px 18px;
      }
      .card-top-header {
        gap: 12px;
      }
      .two-col-fields {
        grid-template-columns: 1fr;
      }
      .posts-tabs-nav {
        flex: 1;
      }
    }

    @media (max-width: 480px) {
      .card-top-header {
        align-items: flex-start;
      }
      .card-top-header .btn-add-more-post {
        padding: 8px 10px;
        font-size: 12px;
      }
    }
  `;constructor(){super(),this.allowMultiple="yes",this.theme="light",this.configured="yes",this.maxFileSize=40,this.chunkSize=10,this.videoPosts=[this.createNewPostState(1)],this.activePostIndex=0,this.isUploading=!1,this.overallProgress=0,this.uploadSpeed="",this.timeRemaining="",this.currentStatus="",this.uploadSuccess=!1,this.createdPosts=[],this.errorMessage="",this.notifications=[],this.isNotificationMinimized=!1}createNewPostState(t){return{id:"post_"+Date.now()+"_"+Math.random().toString(36).substr(2,6),index:t,videoFile:null,title:"",location:"",reporter:"",categories:"",restriction:"",comments:"",contacts:"",script:"",attachments:[]}}getConfig(){return"undefined"!=typeof window&&window.asenS3Config?window.asenS3Config:{ajaxUrl:"/wp-admin/admin-ajax.php",nonce:"",isConfigured:!0,chunkSizeMb:this.chunkSize||10,maxFileSizeGb:this.maxFileSize||40,user:{isLoggedIn:!0,name:"Badrul",avatar:""}}}formatBytes(t,e=1){if(!t||0===t)return"0 B";const i=e<0?0:e,s=Math.floor(Math.log(t)/Math.log(1024));return parseFloat((t/Math.pow(1024,s)).toFixed(i))+" "+["B","KB","MB","GB","TB"][s]}addNotification(t,e,i){const s=Date.now()+Math.random(),o={id:s,type:t,title:e,message:i,time:new Date};this.notifications=[...this.notifications,o],"info"!==t&&"success"!==t||setTimeout(()=>{this.dismissNotification(s)},6e3)}dismissNotification(t){this.notifications=this.notifications.filter(e=>e.id!==t)}handleAddVideoPost(){const t=this.videoPosts.length+1,e=this.createNewPostState(t);this.videoPosts=[...this.videoPosts,e],this.activePostIndex=this.videoPosts.length-1,this.addNotification("info",`Video Post ${t} Added`,"A new video post form has been added.")}handleRemoveVideoPost(t,e){t.stopPropagation(),this.videoPosts.length<=1||(this.videoPosts=this.videoPosts.filter((t,i)=>i!==e).map((t,e)=>({...t,index:e+1})),this.activePostIndex>=this.videoPosts.length&&(this.activePostIndex=this.videoPosts.length-1))}handleFieldChange(t,e){const i=this.activePostIndex;this.videoPosts=this.videoPosts.map((s,o)=>o===i?{...s,[t]:e}:s)}handleVideoFileSelect(t){if(!t)return;const e=this.getConfig(),i=1024*(e.maxFileSizeGb||40)*1024*1024;if(t.size>i)return void this.addNotification("error","File Too Large",`Video exceeds maximum limit of ${e.maxFileSizeGb||40} GB.`);const s=this.activePostIndex;this.videoPosts=this.videoPosts.map((e,i)=>i===s?{...e,videoFile:t}:e),this.addNotification("info","Video Selected",`${t.name} (${this.formatBytes(t.size)}) ready for S3 upload.`)}handleRemoveVideoFile(){const t=this.activePostIndex;this.videoPosts=this.videoPosts.map((e,i)=>i===t?{...e,videoFile:null}:e)}handleAttachmentSelect(t){if(!t||!t.length)return;const e=this.activePostIndex,i=Array.from(t);this.videoPosts=this.videoPosts.map((t,s)=>s===e?{...t,attachments:[...t.attachments,...i]}:t),this.addNotification("info","Attachments Added",`Added ${i.length} file(s).`)}handleRemoveAttachment(t){const e=this.activePostIndex;this.videoPosts=this.videoPosts.map((i,s)=>s!==e?i:{...i,attachments:i.attachments.filter((e,i)=>i!==t)})}async uploadFileToS3(t,e){const i=this.getConfig(),s=i.ajaxUrl,o=i.nonce,r=new FormData;r.append("action","asen_s3_initiate_upload"),r.append("nonce",o),r.append("file_name",t.name),r.append("file_type",t.type||"application/octet-stream"),r.append("file_size",t.size);const n=await fetch(s,{method:"POST",body:r}),a=await n.json();if(!a.success)throw new Error(a.data?.message||"Failed to initiate S3 upload.");const{is_multipart:l,key:d,upload_id:c,put_url:p,file_url:h,chunk_size_bytes:f,bucket:u,region:g}=a.data;if(!l)return new Promise((i,s)=>{const o=new XMLHttpRequest;o.open("PUT",p,!0),t.type&&o.setRequestHeader("Content-Type",t.type),o.upload.onprogress=t=>{t.lengthComputable&&e(t.loaded,t.total)},o.onload=()=>{if(o.status>=200&&o.status<300){const e=(o.getResponseHeader("ETag")||"").replace(/"/g,"");i({key:d,url:h,bucket:u||"",region:g||"",filesize:t.size,filename:t.name,mime:t.type||"application/octet-stream",etag:e})}else s(new Error(`S3 PUT failed with HTTP status ${o.status}`))},o.onerror=()=>s(new Error("Network error during S3 upload.")),o.send(t)});const v=f||10485760,m=Math.ceil(t.size/v),x=[],b=new Array(m).fill(0),y=()=>{const i=b.reduce((t,e)=>t+e,0);e(i,t.size)};let w=1;const $=async e=>{const i=(e-1)*v,r=Math.min(i+v,t.size),n=t.slice(i,r),a=new FormData;a.append("action","asen_s3_sign_parts"),a.append("nonce",o),a.append("key",d),a.append("upload_id",c),a.append("parts[]",e);const l=await fetch(s,{method:"POST",body:a}),p=await l.json();if(!p.success||!p.data.urls?.[e])throw new Error(`Failed to sign S3 part ${e}`);const h=p.data.urls[e];return new Promise((t,i)=>{const s=new XMLHttpRequest;s.open("PUT",h,!0),s.upload.onprogress=t=>{t.lengthComputable&&(b[e-1]=t.loaded,y())},s.onload=()=>{if(s.status>=200&&s.status<300){const i=(s.getResponseHeader("ETag")||"").replace(/"/g,"");b[e-1]=n.size,y(),t({PartNumber:e,ETag:`"${i}"`})}else i(new Error(`S3 Part ${e} upload failed with HTTP ${s.status}`))},s.onerror=()=>i(new Error(`Network error uploading Part ${e}`)),s.send(n)})},_=Array.from({length:2},async()=>{for(;w<=m;){const t=w++;let e=0,i=!1;for(;!i&&e<3;)try{e++;const s=await $(t);x.push(s),i=!0}catch(t){if(e>=3)throw t;await new Promise(t=>setTimeout(t,1e3*e))}}});await Promise.all(_);const S=new FormData;S.append("action","asen_s3_complete_upload"),S.append("nonce",o),S.append("key",d),S.append("upload_id",c),S.append("parts",JSON.stringify(x));const A=await fetch(s,{method:"POST",body:S}),k=await A.json();if(!k.success)throw new Error(k.data?.message||"Failed to complete S3 multipart upload.");return{key:k.data.key,url:k.data.url||k.data.location,bucket:k.data.bucket||u,region:k.data.region||g,filesize:t.size,filename:t.name,mime:t.type||"video/mp4",etag:k.data.etag}}async handleCreatePosts(){this.errorMessage="";for(const t of this.videoPosts){if(!t.videoFile)return this.errorMessage=`Please select a video file for Video Post ${t.index}.`,void this.addNotification("error","Missing Video File",this.errorMessage);if(!t.title.trim())return this.errorMessage=`Title is required for Video Post ${t.index}.`,void this.addNotification("error","Missing Field",this.errorMessage);if(!t.location.trim())return this.errorMessage=`Location is required for Video Post ${t.index}.`,void this.addNotification("error","Missing Field",this.errorMessage);if(!t.reporter.trim())return this.errorMessage=`Reporter is required for Video Post ${t.index}.`,void this.addNotification("error","Missing Field",this.errorMessage);if(!t.categories.trim())return this.errorMessage=`Categories are required for Video Post ${t.index}.`,void this.addNotification("error","Missing Field",this.errorMessage)}this.isUploading=!0,this.overallProgress=0,this.currentStatus="Uploading directly to AWS S3...",this.isNotificationMinimized=!1;const t=Date.now();let e=0;for(const t of this.videoPosts){t.videoFile&&(e+=t.videoFile.size);for(const i of t.attachments)e+=i.size}const i=new Map,s=()=>{const s=Array.from(i.values()).reduce((t,e)=>t+e,0),o=Math.min(99,Math.round(s/e*100));this.overallProgress=isNaN(o)?0:o;const r=(Date.now()-t)/1e3;if(r>.5&&s>0){const t=s/r;this.uploadSpeed=`${this.formatBytes(t)}/s`;const i=Math.round((e-s)/t);this.timeRemaining=i>60?`${Math.round(i/60)}m left`:`${Math.max(1,i)}s left`}};try{const t=[];for(let e=0;e<this.videoPosts.length;e++){const o=this.videoPosts[e];this.currentStatus=`Uploading Video Post ${o.index} (${o.videoFile.name})...`;const r=await this.uploadFileToS3(o.videoFile,t=>{i.set(o.videoFile,t),s()}),n=[];for(let t=0;t<o.attachments.length;t++){const e=o.attachments[t];this.currentStatus=`Uploading attachment ${t+1}/${o.attachments.length} (${e.name})...`;const r=await this.uploadFileToS3(e,t=>{i.set(e,t),s()});n.push(r)}const a=o.categories.split(",").map(t=>t.trim()).filter(Boolean);t.push({title:o.title,location:o.location,reporter:o.reporter,categories:a,restriction:o.restriction,comments:o.comments,contacts:o.contacts,script:o.script,video_file:r,attachments:n})}this.currentStatus="Registering posts and WP Offload Media records...",this.overallProgress=100;const e=this.getConfig(),o=new FormData;o.append("action","asen_s3_create_post"),o.append("nonce",e.nonce),o.append("posts",JSON.stringify(t));const r=await fetch(e.ajaxUrl,{method:"POST",body:o}),n=await r.json();if(!n.success)throw new Error(n.data?.message||"Failed to save post records in WordPress.");this.createdPosts=n.data.posts||[],this.uploadSuccess=!0,this.isUploading=!1,this.addNotification("success","Upload Successful!",`${t.length} post(s) offloaded directly to AWS S3.`)}catch(t){console.error("Upload Error:",t),this.isUploading=!1,this.errorMessage=t.message||"An error occurred during upload.",this.addNotification("error","Upload Failed",this.errorMessage)}}handleCancel(){confirm("Are you sure you want to cancel and clear the form?")&&(this.videoPosts=[this.createNewPostState(1)],this.activePostIndex=0,this.errorMessage="",this.addNotification("info","Form Reset","Upload form was reset."))}handleResetSuccess(){this.videoPosts=[this.createNewPostState(1)],this.activePostIndex=0,this.uploadSuccess=!1,this.createdPosts=[],this.errorMessage=""}renderNotificationsDock(){return j`
      <div class="notification-dock">
        <!-- Live Upload Progress Card -->
        ${this.isUploading?this.isNotificationMinimized?j`
                <div
                  class="notif-minimized-pill"
                  @click="${()=>{this.isNotificationMinimized=!1}}"
                  title="Click to expand upload details"
                >
                  <span class="notif-pulse-dot" style="background:#818cf8;"></span>
                  <span>Uploading to AWS S3 &bull; ${this.overallProgress}%</span>
                  <span style="color:#94a3b8;font-size:11px;">${this.uploadSpeed}</span>
                </div>
              `:j`
                <div class="notification-card progress-active">
                  <div class="notif-header">
                    <div class="notif-title-area">
                      <span class="notif-pulse-dot"></span>
                      <span class="notif-title">Direct S3 Upload in Progress</span>
                    </div>
                    <div class="notif-controls">
                      <button
                        type="button"
                        class="notif-icon-btn"
                        @click="${()=>{this.isNotificationMinimized=!0}}"
                        title="Minimize"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div class="notif-message">${this.currentStatus}</div>

                  <div class="notif-progress-track">
                    <div class="notif-progress-fill" style="width: ${this.overallProgress}%;"></div>
                  </div>

                  <div class="notif-meta-bar">
                    <span>${this.overallProgress}% Completed</span>
                    <span>${this.uploadSpeed} ${this.timeRemaining?`&bull; ${this.timeRemaining}`:""}</span>
                  </div>
                </div>
              `:W}

        <!-- Toast Notifications (Errors, Info, Success) -->
        ${this.notifications.map(t=>j`
            <div class="notification-card ${t.type}">
              <div class="notif-header">
                <div class="notif-title-area">
                  ${"success"===t.type?j`
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      `:"error"===t.type?j`
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="8" x2="12" y2="12"></line>
                          <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                      `:j`
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2.5">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="16" x2="12" y2="12"></line>
                          <line x1="12" y1="8" x2="12.01" y2="8"></line>
                        </svg>
                      `}
                  <span class="notif-title">${t.title}</span>
                </div>
                <button
                  type="button"
                  class="notif-icon-btn"
                  @click="${()=>this.dismissNotification(t.id)}"
                  title="Dismiss"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              <div class="notif-message" style="margin-bottom:0;">${t.message}</div>
            </div>
          `)}
      </div>
    `}renderVideoDropzone(t){return t.videoFile?j`
        <div class="file-selected-badge">
          <div class="file-selected-info">
            <div class="file-icon-square">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14v-4z"></path>
                <rect x="1" y="5" width="14" height="14" rx="2" ry="2"></rect>
              </svg>
            </div>
            <div>
              <div class="file-selected-name" title="${t.videoFile.name}">${t.videoFile.name}</div>
              <div class="file-selected-size">${this.formatBytes(t.videoFile.size)} &bull; ${t.videoFile.type||"Video"}</div>
            </div>
          </div>
          <button
            type="button"
            class="btn-file-remove"
            @click="${()=>this.handleRemoveVideoFile()}"
            title="Remove file"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      `:j`
      <div
        class="compact-dropzone"
        @dragover="${t=>{t.preventDefault(),t.currentTarget.classList.add("dragover")}}"
        @dragleave="${t=>{t.preventDefault(),t.currentTarget.classList.remove("dragover")}}"
        @drop="${t=>{t.preventDefault(),t.currentTarget.classList.remove("dragover"),t.dataTransfer.files?.length&&this.handleVideoFileSelect(t.dataTransfer.files[0])}}"
      >
        <div class="dropzone-cloud-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
        </div>

        <div class="dropzone-main-text">Drag and drop your video file here</div>
        <div class="dropzone-or-text">or</div>

        <input
          type="file"
          id="main_video_input"
          style="display:none"
          accept="video/*,audio/*,.mxf,.mov,.mp4,.wav,.mkv,.avi"
          @change="${t=>{t.target.files?.length&&this.handleVideoFileSelect(t.target.files[0])}}"
        />

        <button
          type="button"
          class="btn-select-file"
          @click="${()=>this.renderRoot.getElementById("main_video_input").click()}"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          SELECT FILE
        </button>

        <div class="dropzone-footer-hint">
          Supports: .mp4, .m4v, .mov &bull; Maximum size: ${this.maxFileSize} GB
        </div>
      </div>
    `}renderAttachmentsDropzone(t){return j`
      <div class="step-section">
        <div class="step-header">
          <div class="step-number-badge">4</div>
          <div class="step-titles">
            <div class="step-title-text">Attachments (Optional)</div>
            <div class="step-subtitle-text">Upload related documents, images or other files.</div>
          </div>
        </div>

        <div
          class="compact-dropzone"
          style="padding:16px 12px;"
          @click="${()=>this.renderRoot.getElementById("attachments_file_input").click()}"
        >
          <div class="dropzone-cloud-icon" style="width:30px;height:30px;margin-bottom:6px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
          </div>

          <div class="dropzone-main-text" style="font-size:12.5px;margin-bottom:6px;">Add attachment files</div>

          <input
            type="file"
            id="attachments_file_input"
            multiple
            style="display:none"
            accept=".pdf,.doc,.docx,.csv,.xlsx,.txt"
            @change="${t=>this.handleAttachmentSelect(t.target.files)}"
          />

          <button type="button" class="btn-select-file" style="padding:6px 14px;font-size:11.5px;">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            SELECT FILE
          </button>

          <div class="dropzone-footer-hint" style="margin-top:8px;">
            Supports: .pdf, .doc, .csv, .xlsx, .txt &bull; Maximum size: 10 MB
          </div>
        </div>

        <!-- Info Notice Box -->
        <div class="info-notice-box">
          <svg class="info-notice-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          <div>
            You can upload multiple files. Common formats include PDF, Word, Excel and text files.
          </div>
        </div>

        <!-- Attached files list -->
        ${t.attachments.length>0?j`
              <div class="attachments-list">
                ${t.attachments.map((t,e)=>j`
                    <div class="file-selected-badge" style="padding:7px 10px;">
                      <div class="file-selected-info">
                        <div class="file-icon-square" style="width:24px;height:24px;">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                          </svg>
                        </div>
                        <div>
                          <div class="file-selected-name" style="font-size:12px;max-width:180px;">${t.name}</div>
                          <div class="file-selected-size">${this.formatBytes(t.size)}</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        class="btn-file-remove"
                        @click="${()=>this.handleRemoveAttachment(e)}"
                        title="Remove"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                  `)}
              </div>
            `:W}
      </div>
    `}renderSuccessState(){return j`
      <div class="main-card success-view">
        <div class="success-icon-badge">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h2 class="success-title">Upload Completed!</h2>
        <p class="success-subtitle">
          All video files and attachments were uploaded directly to Amazon AWS S3 and synced with WP Offload Media.
        </p>

        ${this.createdPosts.length>0?j`
              <div class="posts-published-list">
                <div style="font-weight:700;font-size:13.5px;color:#334155;margin-bottom:8px;">Created Video Posts:</div>
                <ul style="margin:0;padding-left:18px;font-size:13.5px;line-height:1.6;">
                  ${this.createdPosts.map(t=>j`
                      <li>
                        <a href="${t.permalink}" target="_blank" style="color:var(--primary);text-decoration:none;font-weight:600;">
                          ${t.title} &rarr;
                        </a>
                      </li>
                    `)}
                </ul>
              </div>
            `:W}

        <button type="button" class="btn-create-post" @click="${()=>this.handleResetSuccess()}">
          Upload More Video Posts
        </button>
      </div>
    `}render(){if(this.uploadSuccess)return j`
        ${this.renderSuccessState()}
        ${this.renderNotificationsDock()}
      `;const t=this.getConfig(),e="yes"===this.configured&&!1!==t.isConfigured,i=this.videoPosts[this.activePostIndex]||this.videoPosts[0];return j`
      <div class="main-card">
        ${"yes"===this.allowMultiple||this.videoPosts.length>1?j`
              <div class="card-top-header">
                ${this.videoPosts.length>1?j`
                      <div class="posts-tabs-nav">
                        ${this.videoPosts.map((t,e)=>j`
                            <div
                              class="post-tab-item ${this.activePostIndex===e?"active":""}"
                              @click="${()=>{this.activePostIndex=e}}"
                            >
                              <span>Post ${t.index}</span>
                              ${this.videoPosts.length>1?j`
                                    <button
                                      type="button"
                                      class="post-tab-remove"
                                      @click="${t=>this.handleRemoveVideoPost(t,e)}"
                                      title="Remove Post"
                                    >
                                      &times;
                                    </button>
                                  `:W}
                            </div>
                          `)}
                      </div>
                    `:W}

                ${"yes"===this.allowMultiple?j`
                      <button type="button" class="btn-add-more-post" @click="${()=>this.handleAddVideoPost()}">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Add More Post
                      </button>
                    `:W}
              </div>
            `:W}

        ${e?W:j`
              <div class="config-alert">
                <strong>AWS S3 Credentials Required:</strong> Please configure your AWS Access Key, Secret Key, and Bucket in
                <strong>WordPress Admin &rarr; ASEN S3 Media &rarr; AWS S3 Settings</strong>.
              </div>
            `}

        <!-- 2-Column Form Grid -->
        <div class="compact-grid">
          <!-- Left Column -->
          <div class="col-left">
            <!-- Step 1: Video File -->
            <div class="step-section">
              <div class="step-header">
                <div class="step-number-badge">1</div>
                <div class="step-titles">
                  <div class="step-title-text">Video File <span class="req">*</span></div>
                  <div class="step-subtitle-text">Upload the main video file for this post.</div>
                </div>
              </div>
              ${this.renderVideoDropzone(i)}
            </div>

            <!-- Step 2: Basic Information -->
            <div class="step-section">
              <div class="step-header">
                <div class="step-number-badge">2</div>
                <div class="step-titles">
                  <div class="step-title-text">Basic Information</div>
                </div>
              </div>

              <!-- Title Field -->
              <div class="field-row">
                <label class="field-label" for="field_title">Title <span class="req">*</span></label>
                <div class="input-with-icon">
                  <svg class="input-leading-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <input
                    type="text"
                    id="field_title"
                    class="compact-input"
                    placeholder="Enter the title of the post"
                    .value="${i.title}"
                    @input="${t=>this.handleFieldChange("title",t.target.value)}"
                  />
                </div>
              </div>

              <!-- Location & Reporter Side-by-side -->
              <div class="two-col-fields">
                <div class="field-row">
                  <label class="field-label" for="field_location">Location <span class="req">*</span></label>
                  <div class="input-with-icon">
                    <svg class="input-leading-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <input
                      type="text"
                      id="field_location"
                      class="compact-input"
                      placeholder="e.g. Kuala Lumpur"
                      .value="${i.location}"
                      @input="${t=>this.handleFieldChange("location",t.target.value)}"
                    />
                  </div>
                </div>

                <div class="field-row">
                  <label class="field-label" for="field_reporter">Reporter <span class="req">*</span></label>
                  <div class="input-with-icon">
                    <svg class="input-leading-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <input
                      type="text"
                      id="field_reporter"
                      class="compact-input"
                      placeholder="Reporter name"
                      .value="${i.reporter}"
                      @input="${t=>this.handleFieldChange("reporter",t.target.value)}"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 3: Details -->
            <div class="step-section">
              <div class="step-header">
                <div class="step-number-badge">3</div>
                <div class="step-titles">
                  <div class="step-title-text">Details</div>
                </div>
              </div>

              <!-- Categories & Restriction Side-by-Side -->
              <div class="two-col-fields">
                <div class="field-row">
                  <label class="field-label" for="field_categories">Categories <span class="req">*</span></label>
                  <div class="input-with-icon">
                    <svg class="input-leading-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                      <line x1="7" y1="7" x2="7.01" y2="7"></line>
                    </svg>
                    <input
                      type="text"
                      id="field_categories"
                      class="compact-input"
                      placeholder="Select categories"
                      .value="${i.categories}"
                      @input="${t=>this.handleFieldChange("categories",t.target.value)}"
                    />
                    <svg class="input-trailing-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                </div>

                <div class="field-row">
                  <label class="field-label" for="field_restriction">Restriction</label>
                  <div class="input-with-icon">
                    <svg class="input-leading-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    <input
                      type="text"
                      id="field_restriction"
                      class="compact-input"
                      placeholder="Select restriction"
                      .value="${i.restriction}"
                      @input="${t=>this.handleFieldChange("restriction",t.target.value)}"
                    />
                    <svg class="input-trailing-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Comments -->
              <div class="field-row">
                <label class="field-label" for="field_comments">Comments</label>
                <div class="input-with-icon">
                  <svg class="input-leading-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  <input
                    type="text"
                    id="field_comments"
                    class="compact-input"
                    placeholder="Additional comments (optional)"
                    .value="${i.comments}"
                    @input="${t=>this.handleFieldChange("comments",t.target.value)}"
                  />
                </div>
              </div>

              <!-- Contacts -->
              <div class="field-row">
                <label class="field-label" for="field_contacts">Contacts</label>
                <div class="input-with-icon">
                  <svg class="input-leading-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  <input
                    type="text"
                    id="field_contacts"
                    class="compact-input"
                    placeholder="Contact information (optional)"
                    .value="${i.contacts}"
                    @input="${t=>this.handleFieldChange("contacts",t.target.value)}"
                  />
                </div>
              </div>

              <!-- Script -->
              <div class="field-row">
                <label class="field-label" for="field_script">Script</label>
                <div class="input-with-icon" style="align-items:flex-start;">
                  <svg class="textarea-leading-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                  </svg>
                  <textarea
                    id="field_script"
                    class="compact-textarea"
                    placeholder="Enter script or description (optional)"
                    rows="2"
                    .value="${i.script}"
                    @input="${t=>this.handleFieldChange("script",t.target.value)}"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div class="col-right">
            ${this.renderAttachmentsDropzone(i)}
          </div>
        </div>

        <div class="card-footer-actions">
          <div class="right-action-btns">
            <button type="button" class="btn-cancel" @click="${()=>this.handleCancel()}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              Cancel
            </button>

            <button
              type="button"
              class="btn-create-post"
              ?disabled="${this.isUploading}"
              @click="${()=>this.handleCreatePosts()}"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
              </svg>
              Create Post
            </button>
          </div>
        </div>
      </div>

      <!-- Real-Time Notification Dock -->
      ${this.renderNotificationsDock()}
    `}}customElements.get("asen-s3-uploader")||customElements.define("asen-s3-uploader",ct)})();