import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

/**
 * `<kaiser-greeting>` is a small, self-contained web component built with
 * Lit 3. It is designed to be bundled with Webpack and embedded directly
 * into any website via a single `<script>` tag.
 *
 * @element kaiser-greeting
 * @attr {string} name - The name to greet.
 */
@customElement('kaiser-greeting')
export class KaiserGreeting extends LitElement {
  static properties = {
    name: { type: String },
  };

  static styles = css`
    :host {
      display: inline-block;
      font-family: system-ui, sans-serif;
      padding: 0.75rem 1.25rem;
      border-radius: 0.5rem;
      background: #1f2933;
      color: #fff;
    }
  `;

  constructor() {
    super();
    this.name = 'World';
  }

  render() {
    return html`<p>Hello, ${this.name}! 👋 This component came from KaiserComponent.</p>`;
  }
}