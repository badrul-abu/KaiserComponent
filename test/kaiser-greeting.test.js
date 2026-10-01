import { html, fixture, expect } from '@open-wc/testing';
import '../src/components/kaiser-greeting.js';

describe('kaiser-greeting', () => {
  it('renders a default greeting for World', async () => {
    const el = await fixture(html`<kaiser-greeting></kaiser-greeting>`);
    expect(el.shadowRoot.textContent).to.contain('Hello, World!');
  });

  it('renders a greeting using the name attribute', async () => {
    const el = await fixture(html`<kaiser-greeting name="Kaiser"></kaiser-greeting>`);
    expect(el.shadowRoot.textContent).to.contain('Hello, Kaiser!');
  });
});
