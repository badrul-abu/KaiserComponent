import { html, fixture, expect } from '@open-wc/testing';
import '../src/components/asen-s3-uploader.js';

describe('AsenS3Uploader Component', () => {
  it('renders the compact upload form without a header or component title', async () => {
    const el = await fixture(html`<asen-s3-uploader component-title="Upload Video Post"></asen-s3-uploader>`);
    expect(el).to.exist;

    expect(el.shadowRoot.querySelector('.header-texts')).to.not.exist;
    expect(el.shadowRoot.querySelector('.asen-nav-bar')).to.not.exist;
    expect(el.componentTitle).to.be.undefined;

    const compactGrid = el.shadowRoot.querySelector('.compact-grid');
    expect(compactGrid).to.exist;
    expect(el.shadowRoot.querySelector('.card-top-header .btn-add-more-post')).to.exist;

    const steps = el.shadowRoot.querySelectorAll('.step-number-badge');
    expect(steps.length).to.equal(4);
  });

  it('does not render an empty multi-post toolbar when multiple posts are disabled', async () => {
    const el = await fixture(html`<asen-s3-uploader allow-multiple="no"></asen-s3-uploader>`);

    expect(el.shadowRoot.querySelector('.card-top-header')).to.not.exist;
    expect(el.shadowRoot.querySelector('.btn-add-more-post')).to.not.exist;
  });

  it('renders numbered steps: 1 Video File, 2 Basic Information, 3 Details, 4 Attachments', async () => {
    const el = await fixture(html`<asen-s3-uploader></asen-s3-uploader>`);
    const titles = Array.from(el.shadowRoot.querySelectorAll('.step-title-text')).map((t) =>
      t.textContent.trim()
    );

    expect(titles[0]).to.include('Video File');
    expect(titles[1]).to.include('Basic Information');
    expect(titles[2]).to.include('Details');
    expect(titles[3]).to.include('Attachments');
  });

  it('adds and manages multiple video posts via tabs', async () => {
    const el = await fixture(
      html`<asen-s3-uploader allow-multiple="yes"></asen-s3-uploader>`
    );

    const addBtn = el.shadowRoot.querySelector('.btn-add-more-post');
    expect(addBtn).to.exist;

    addBtn.click();
    await el.updateComplete;

    expect(el.videoPosts.length).to.equal(2);
    const tabs = el.shadowRoot.querySelectorAll('.post-tab-item');
    expect(tabs.length).to.equal(2);
    const toolbar = el.shadowRoot.querySelector('.card-top-header');
    expect(toolbar.querySelector('.posts-tabs-nav')).to.exist;
    expect(toolbar.querySelector('.posts-tabs-nav').compareDocumentPosition(
      toolbar.querySelector('.btn-add-more-post')
    ) & Node.DOCUMENT_POSITION_FOLLOWING).to.be.greaterThan(0);

    const removeBtn = el.shadowRoot.querySelector('.post-tab-remove');
    expect(removeBtn).to.exist;

    removeBtn.click();
    await el.updateComplete;

    expect(el.videoPosts.length).to.equal(1);
  });

  it('renders select file buttons and dropzones', async () => {
    const el = await fixture(html`<asen-s3-uploader></asen-s3-uploader>`);
    const selectBtns = el.shadowRoot.querySelectorAll('.btn-select-file');
    expect(selectBtns.length).to.be.at.least(2);
    expect(selectBtns[0].textContent).to.include('SELECT FILE');
  });

  it('renders notification dock component and dispatches notifications', async () => {
    const el = await fixture(html`<asen-s3-uploader></asen-s3-uploader>`);
    const notifDock = el.shadowRoot.querySelector('.notification-dock');
    expect(notifDock).to.exist;

    el.addNotification('info', 'Test Notification', 'This is a test notification.');
    await el.updateComplete;

    const notifCard = el.shadowRoot.querySelector('.notification-card.info');
    expect(notifCard).to.exist;
    expect(notifCard.textContent).to.include('Test Notification');
  });
});
