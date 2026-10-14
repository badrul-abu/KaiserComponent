import { LitElement, html, css, nothing } from 'lit';

/**
 * `<asen-s3-uploader>` is a modern, compact Web Component for uploading
 * broadcast media (videos, audios, and attachments) directly from client browser
 * to Amazon AWS S3, bypassing server size limits and supporting files up to 5 TB.
 *
 * Redesigned with a compact 2-column layout and real-time notification component.
 *
 * @element asen-s3-uploader
 */
export class AsenS3Uploader extends LitElement {
  static properties = {
    allowMultiple: { type: String, attribute: 'allow-multiple' },
    theme: { type: String },
    configured: { type: String },
    maxFileSize: { type: Number, attribute: 'max-file-size' },
    chunkSize: { type: Number, attribute: 'chunk-size' },
    videoPosts: { state: true },
    activePostIndex: { state: true },
    isUploading: { state: true },
    overallProgress: { state: true },
    uploadSpeed: { state: true },
    timeRemaining: { state: true },
    currentStatus: { state: true },
    uploadSuccess: { state: true },
    createdPosts: { state: true },
    errorMessage: { state: true },
    notifications: { state: true },
    isNotificationMinimized: { state: true },
  };

  static styles = css`
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
  `;

  constructor() {
    super();
    this.allowMultiple = 'yes';
    this.theme = 'light';
    this.configured = 'yes';
    this.maxFileSize = 40;
    this.chunkSize = 10;

    this.videoPosts = [this.createNewPostState(1)];
    this.activePostIndex = 0;
    this.isUploading = false;
    this.overallProgress = 0;
    this.uploadSpeed = '';
    this.timeRemaining = '';
    this.currentStatus = '';
    this.uploadSuccess = false;
    this.createdPosts = [];
    this.errorMessage = '';
    this.notifications = [];
    this.isNotificationMinimized = false;
  }

  createNewPostState(index) {
    return {
      id: 'post_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      index: index,
      videoFile: null,
      title: '',
      location: '',
      reporter: '',
      categories: '',
      restriction: '',
      comments: '',
      contacts: '',
      script: '',
      attachments: [],
    };
  }

  getConfig() {
    if (typeof window !== 'undefined' && window.asenS3Config) {
      return window.asenS3Config;
    }
    return {
      ajaxUrl: '/wp-admin/admin-ajax.php',
      nonce: '',
      isConfigured: true,
      chunkSizeMb: this.chunkSize || 10,
      maxFileSizeGb: this.maxFileSize || 40,
      user: { isLoggedIn: true, name: 'Badrul', avatar: '' },
    };
  }

  formatBytes(bytes, decimals = 1) {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  addNotification(type, title, message) {
    const id = Date.now() + Math.random();
    const newNotif = { id, type, title, message, time: new Date() };
    this.notifications = [...this.notifications, newNotif];

    if (type === 'info' || type === 'success') {
      setTimeout(() => {
        this.dismissNotification(id);
      }, 6000);
    }
  }

  dismissNotification(id) {
    this.notifications = this.notifications.filter((n) => n.id !== id);
  }

  handleAddVideoPost() {
    const nextIndex = this.videoPosts.length + 1;
    const newPost = this.createNewPostState(nextIndex);
    this.videoPosts = [...this.videoPosts, newPost];
    this.activePostIndex = this.videoPosts.length - 1;
    this.addNotification('info', `Video Post ${nextIndex} Added`, 'A new video post form has been added.');
  }

  handleRemoveVideoPost(e, index) {
    e.stopPropagation();
    if (this.videoPosts.length <= 1) return;
    this.videoPosts = this.videoPosts
      .filter((_, i) => i !== index)
      .map((p, idx) => ({ ...p, index: idx + 1 }));

    if (this.activePostIndex >= this.videoPosts.length) {
      this.activePostIndex = this.videoPosts.length - 1;
    }
  }

  handleFieldChange(field, value) {
    const active = this.activePostIndex;
    this.videoPosts = this.videoPosts.map((p, idx) =>
      idx === active ? { ...p, [field]: value } : p
    );
  }

  handleVideoFileSelect(file) {
    if (!file) return;
    const config = this.getConfig();
    const maxBytes = (config.maxFileSizeGb || 40) * 1024 * 1024 * 1024;
    if (file.size > maxBytes) {
      this.addNotification('error', 'File Too Large', `Video exceeds maximum limit of ${config.maxFileSizeGb || 40} GB.`);
      return;
    }
    const active = this.activePostIndex;
    this.videoPosts = this.videoPosts.map((p, idx) =>
      idx === active ? { ...p, videoFile: file } : p
    );
    this.addNotification('info', 'Video Selected', `${file.name} (${this.formatBytes(file.size)}) ready for S3 upload.`);
  }

  handleRemoveVideoFile() {
    const active = this.activePostIndex;
    this.videoPosts = this.videoPosts.map((p, idx) =>
      idx === active ? { ...p, videoFile: null } : p
    );
  }

  handleAttachmentSelect(files) {
    if (!files || !files.length) return;
    const active = this.activePostIndex;
    const newFiles = Array.from(files);
    this.videoPosts = this.videoPosts.map((p, idx) =>
      idx === active ? { ...p, attachments: [...p.attachments, ...newFiles] } : p
    );
    this.addNotification('info', 'Attachments Added', `Added ${newFiles.length} file(s).`);
  }

  handleRemoveAttachment(attIndex) {
    const active = this.activePostIndex;
    this.videoPosts = this.videoPosts.map((p, idx) => {
      if (idx !== active) return p;
      return { ...p, attachments: p.attachments.filter((_, i) => i !== attIndex) };
    });
  }

  /**
   * Direct S3 Client Upload with Multipart chunking and progress reporting.
   */
  async uploadFileToS3(file, onProgress) {
    const config = this.getConfig();
    const ajaxUrl = config.ajaxUrl;
    const nonce = config.nonce;

    // 1. Initiate upload
    const initData = new FormData();
    initData.append('action', 'asen_s3_initiate_upload');
    initData.append('nonce', nonce);
    initData.append('file_name', file.name);
    initData.append('file_type', file.type || 'application/octet-stream');
    initData.append('file_size', file.size);

    const initRes = await fetch(ajaxUrl, { method: 'POST', body: initData });
    const initJson = await initRes.json();
    if (!initJson.success) {
      throw new Error(initJson.data?.message || 'Failed to initiate S3 upload.');
    }

    const { is_multipart, key, upload_id, put_url, file_url, chunk_size_bytes, bucket, region } = initJson.data;

    // Single PUT for small files (<5MB)
    if (!is_multipart) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', put_url, true);
        if (file.type) {
          xhr.setRequestHeader('Content-Type', file.type);
        }
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            onProgress(e.loaded, e.total);
          }
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const etag = (xhr.getResponseHeader('ETag') || '').replace(/"/g, '');
            resolve({
              key,
              url: file_url,
              bucket: bucket || '',
              region: region || '',
              filesize: file.size,
              filename: file.name,
              mime: file.type || 'application/octet-stream',
              etag,
            });
          } else {
            reject(new Error(`S3 PUT failed with HTTP status ${xhr.status}`));
          }
        };
        xhr.onerror = () => reject(new Error('Network error during S3 upload.'));
        xhr.send(file);
      });
    }

    // Multipart Upload (>5MB up to 5TB)
    const chunkSize = chunk_size_bytes || 10 * 1024 * 1024;
    const totalParts = Math.ceil(file.size / chunkSize);
    const completedParts = [];
    const partProgress = new Array(totalParts).fill(0);

    const updateAggregateProgress = () => {
      const uploadedBytes = partProgress.reduce((a, b) => a + b, 0);
      onProgress(uploadedBytes, file.size);
    };

    const concurrency = 2;
    let currentPart = 1;

    const uploadSinglePart = async (partNum) => {
      const start = (partNum - 1) * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunkBlob = file.slice(start, end);

      const signData = new FormData();
      signData.append('action', 'asen_s3_sign_parts');
      signData.append('nonce', nonce);
      signData.append('key', key);
      signData.append('upload_id', upload_id);
      signData.append('parts[]', partNum);

      const signRes = await fetch(ajaxUrl, { method: 'POST', body: signData });
      const signJson = await signRes.json();
      if (!signJson.success || !signJson.data.urls?.[partNum]) {
        throw new Error(`Failed to sign S3 part ${partNum}`);
      }

      const presignedPartUrl = signJson.data.urls[partNum];

      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', presignedPartUrl, true);
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            partProgress[partNum - 1] = e.loaded;
            updateAggregateProgress();
          }
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const rawEtag = xhr.getResponseHeader('ETag') || '';
            const etag = rawEtag.replace(/"/g, '');
            partProgress[partNum - 1] = chunkBlob.size;
            updateAggregateProgress();
            resolve({ PartNumber: partNum, ETag: `"${etag}"` });
          } else {
            reject(new Error(`S3 Part ${partNum} upload failed with HTTP ${xhr.status}`));
          }
        };
        xhr.onerror = () => reject(new Error(`Network error uploading Part ${partNum}`));
        xhr.send(chunkBlob);
      });
    };

    const workers = Array.from({ length: concurrency }, async () => {
      while (currentPart <= totalParts) {
        const p = currentPart++;
        let attempts = 0;
        let success = false;
        while (!success && attempts < 3) {
          try {
            attempts++;
            const partResult = await uploadSinglePart(p);
            completedParts.push(partResult);
            success = true;
          } catch (err) {
            if (attempts >= 3) throw err;
            await new Promise((res) => setTimeout(res, 1000 * attempts));
          }
        }
      }
    });

    await Promise.all(workers);

    // Complete Multipart Upload
    const completeData = new FormData();
    completeData.append('action', 'asen_s3_complete_upload');
    completeData.append('nonce', nonce);
    completeData.append('key', key);
    completeData.append('upload_id', upload_id);
    completeData.append('parts', JSON.stringify(completedParts));

    const compRes = await fetch(ajaxUrl, { method: 'POST', body: completeData });
    const compJson = await compRes.json();
    if (!compJson.success) {
      throw new Error(compJson.data?.message || 'Failed to complete S3 multipart upload.');
    }

    return {
      key: compJson.data.key,
      url: compJson.data.url || compJson.data.location,
      bucket: compJson.data.bucket || bucket,
      region: compJson.data.region || region,
      filesize: file.size,
      filename: file.name,
      mime: file.type || 'video/mp4',
      etag: compJson.data.etag,
    };
  }

  async handleCreatePosts() {
    this.errorMessage = '';

    // Validation
    for (const post of this.videoPosts) {
      if (!post.videoFile) {
        this.errorMessage = `Please select a video file for Video Post ${post.index}.`;
        this.addNotification('error', 'Missing Video File', this.errorMessage);
        return;
      }
      if (!post.title.trim()) {
        this.errorMessage = `Title is required for Video Post ${post.index}.`;
        this.addNotification('error', 'Missing Field', this.errorMessage);
        return;
      }
      if (!post.location.trim()) {
        this.errorMessage = `Location is required for Video Post ${post.index}.`;
        this.addNotification('error', 'Missing Field', this.errorMessage);
        return;
      }
      if (!post.reporter.trim()) {
        this.errorMessage = `Reporter is required for Video Post ${post.index}.`;
        this.addNotification('error', 'Missing Field', this.errorMessage);
        return;
      }
      if (!post.categories.trim()) {
        this.errorMessage = `Categories are required for Video Post ${post.index}.`;
        this.addNotification('error', 'Missing Field', this.errorMessage);
        return;
      }
    }

    this.isUploading = true;
    this.overallProgress = 0;
    this.currentStatus = 'Uploading directly to AWS S3...';
    this.isNotificationMinimized = false;

    const startTime = Date.now();
    let totalBytes = 0;
    for (const p of this.videoPosts) {
      if (p.videoFile) totalBytes += p.videoFile.size;
      for (const att of p.attachments) totalBytes += att.size;
    }

    const fileLoadedMap = new Map();

    const updateMetrics = () => {
      const uploadedBytes = Array.from(fileLoadedMap.values()).reduce((a, b) => a + b, 0);
      const pct = Math.min(99, Math.round((uploadedBytes / totalBytes) * 100));
      this.overallProgress = isNaN(pct) ? 0 : pct;

      const elapsedSec = (Date.now() - startTime) / 1000;
      if (elapsedSec > 0.5 && uploadedBytes > 0) {
        const speed = uploadedBytes / elapsedSec;
        this.uploadSpeed = `${this.formatBytes(speed)}/s`;
        const remainingSec = Math.round((totalBytes - uploadedBytes) / speed);
        this.timeRemaining = remainingSec > 60 ? `${Math.round(remainingSec / 60)}m left` : `${Math.max(1, remainingSec)}s left`;
      }
    };

    try {
      const postsPayload = [];

      for (let i = 0; i < this.videoPosts.length; i++) {
        const p = this.videoPosts[i];
        this.currentStatus = `Uploading Video Post ${p.index} (${p.videoFile.name})...`;

        const videoS3Result = await this.uploadFileToS3(p.videoFile, (loaded) => {
          fileLoadedMap.set(p.videoFile, loaded);
          updateMetrics();
        });

        const attachmentsS3Results = [];
        for (let j = 0; j < p.attachments.length; j++) {
          const att = p.attachments[j];
          this.currentStatus = `Uploading attachment ${j + 1}/${p.attachments.length} (${att.name})...`;
          const attResult = await this.uploadFileToS3(att, (loaded) => {
            fileLoadedMap.set(att, loaded);
            updateMetrics();
          });
          attachmentsS3Results.push(attResult);
        }

        const catArray = p.categories.split(',').map((c) => c.trim()).filter(Boolean);

        postsPayload.push({
          title: p.title,
          location: p.location,
          reporter: p.reporter,
          categories: catArray,
          restriction: p.restriction,
          comments: p.comments,
          contacts: p.contacts,
          script: p.script,
          video_file: videoS3Result,
          attachments: attachmentsS3Results,
        });
      }

      this.currentStatus = 'Registering posts and WP Offload Media records...';
      this.overallProgress = 100;

      const config = this.getConfig();
      const saveFormData = new FormData();
      saveFormData.append('action', 'asen_s3_create_post');
      saveFormData.append('nonce', config.nonce);
      saveFormData.append('posts', JSON.stringify(postsPayload));

      const saveRes = await fetch(config.ajaxUrl, { method: 'POST', body: saveFormData });
      const saveJson = await saveRes.json();

      if (!saveJson.success) {
        throw new Error(saveJson.data?.message || 'Failed to save post records in WordPress.');
      }

      this.createdPosts = saveJson.data.posts || [];
      this.uploadSuccess = true;
      this.isUploading = false;

      this.addNotification('success', 'Upload Successful!', `${postsPayload.length} post(s) offloaded directly to AWS S3.`);
    } catch (err) {
      console.error('Upload Error:', err);
      this.isUploading = false;
      this.errorMessage = err.message || 'An error occurred during upload.';
      this.addNotification('error', 'Upload Failed', this.errorMessage);
    }
  }

  handleCancel() {
    if (confirm('Are you sure you want to cancel and clear the form?')) {
      this.videoPosts = [this.createNewPostState(1)];
      this.activePostIndex = 0;
      this.errorMessage = '';
      this.addNotification('info', 'Form Reset', 'Upload form was reset.');
    }
  }

  handleResetSuccess() {
    this.videoPosts = [this.createNewPostState(1)];
    this.activePostIndex = 0;
    this.uploadSuccess = false;
    this.createdPosts = [];
    this.errorMessage = '';
  }

  renderNotificationsDock() {
    return html`
      <div class="notification-dock">
        <!-- Live Upload Progress Card -->
        ${this.isUploading
          ? this.isNotificationMinimized
            ? html`
                <div
                  class="notif-minimized-pill"
                  @click="${() => { this.isNotificationMinimized = false; }}"
                  title="Click to expand upload details"
                >
                  <span class="notif-pulse-dot" style="background:#818cf8;"></span>
                  <span>Uploading to AWS S3 &bull; ${this.overallProgress}%</span>
                  <span style="color:#94a3b8;font-size:11px;">${this.uploadSpeed}</span>
                </div>
              `
            : html`
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
                        @click="${() => { this.isNotificationMinimized = true; }}"
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
                    <span>${this.uploadSpeed} ${this.timeRemaining ? `&bull; ${this.timeRemaining}` : ''}</span>
                  </div>
                </div>
              `
          : nothing}

        <!-- Toast Notifications (Errors, Info, Success) -->
        ${this.notifications.map(
          (notif) => html`
            <div class="notification-card ${notif.type}">
              <div class="notif-header">
                <div class="notif-title-area">
                  ${notif.type === 'success'
                    ? html`
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      `
                    : notif.type === 'error'
                    ? html`
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="8" x2="12" y2="12"></line>
                          <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                      `
                    : html`
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2.5">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="16" x2="12" y2="12"></line>
                          <line x1="12" y1="8" x2="12.01" y2="8"></line>
                        </svg>
                      `}
                  <span class="notif-title">${notif.title}</span>
                </div>
                <button
                  type="button"
                  class="notif-icon-btn"
                  @click="${() => this.dismissNotification(notif.id)}"
                  title="Dismiss"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              <div class="notif-message" style="margin-bottom:0;">${notif.message}</div>
            </div>
          `
        )}
      </div>
    `;
  }

  renderVideoDropzone(post) {
    if (post.videoFile) {
      return html`
        <div class="file-selected-badge">
          <div class="file-selected-info">
            <div class="file-icon-square">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14v-4z"></path>
                <rect x="1" y="5" width="14" height="14" rx="2" ry="2"></rect>
              </svg>
            </div>
            <div>
              <div class="file-selected-name" title="${post.videoFile.name}">${post.videoFile.name}</div>
              <div class="file-selected-size">${this.formatBytes(post.videoFile.size)} &bull; ${post.videoFile.type || 'Video'}</div>
            </div>
          </div>
          <button
            type="button"
            class="btn-file-remove"
            @click="${() => this.handleRemoveVideoFile()}"
            title="Remove file"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      `;
    }

    return html`
      <div
        class="compact-dropzone"
        @dragover="${(e) => { e.preventDefault(); e.currentTarget.classList.add('dragover'); }}"
        @dragleave="${(e) => { e.preventDefault(); e.currentTarget.classList.remove('dragover'); }}"
        @drop="${(e) => {
          e.preventDefault();
          e.currentTarget.classList.remove('dragover');
          if (e.dataTransfer.files?.length) {
            this.handleVideoFileSelect(e.dataTransfer.files[0]);
          }
        }}"
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
          @change="${(e) => {
            if (e.target.files?.length) {
              this.handleVideoFileSelect(e.target.files[0]);
            }
          }}"
        />

        <button
          type="button"
          class="btn-select-file"
          @click="${() => this.renderRoot.getElementById('main_video_input').click()}"
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
    `;
  }

  renderAttachmentsDropzone(post) {
    return html`
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
          @click="${() => this.renderRoot.getElementById('attachments_file_input').click()}"
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
            @change="${(e) => this.handleAttachmentSelect(e.target.files)}"
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
        ${post.attachments.length > 0
          ? html`
              <div class="attachments-list">
                ${post.attachments.map(
                  (att, idx) => html`
                    <div class="file-selected-badge" style="padding:7px 10px;">
                      <div class="file-selected-info">
                        <div class="file-icon-square" style="width:24px;height:24px;">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                          </svg>
                        </div>
                        <div>
                          <div class="file-selected-name" style="font-size:12px;max-width:180px;">${att.name}</div>
                          <div class="file-selected-size">${this.formatBytes(att.size)}</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        class="btn-file-remove"
                        @click="${() => this.handleRemoveAttachment(idx)}"
                        title="Remove"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                  `
                )}
              </div>
            `
          : nothing}
      </div>
    `;
  }

  renderSuccessState() {
    return html`
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

        ${this.createdPosts.length > 0
          ? html`
              <div class="posts-published-list">
                <div style="font-weight:700;font-size:13.5px;color:#334155;margin-bottom:8px;">Created Video Posts:</div>
                <ul style="margin:0;padding-left:18px;font-size:13.5px;line-height:1.6;">
                  ${this.createdPosts.map(
                    (p) => html`
                      <li>
                        <a href="${p.permalink}" target="_blank" style="color:var(--primary);text-decoration:none;font-weight:600;">
                          ${p.title} &rarr;
                        </a>
                      </li>
                    `
                  )}
                </ul>
              </div>
            `
          : nothing}

        <button type="button" class="btn-create-post" @click="${() => this.handleResetSuccess()}">
          Upload More Video Posts
        </button>
      </div>
    `;
  }

  render() {
    if (this.uploadSuccess) {
      return html`
        ${this.renderSuccessState()}
        ${this.renderNotificationsDock()}
      `;
    }

    const config = this.getConfig();
    const isConfigured = this.configured === 'yes' && config.isConfigured !== false;
    const post = this.videoPosts[this.activePostIndex] || this.videoPosts[0];

    return html`
      <div class="main-card">
        ${this.allowMultiple === 'yes' || this.videoPosts.length > 1
          ? html`
              <div class="card-top-header">
                ${this.videoPosts.length > 1
                  ? html`
                      <div class="posts-tabs-nav">
                        ${this.videoPosts.map(
                          (p, idx) => html`
                            <div
                              class="post-tab-item ${this.activePostIndex === idx ? 'active' : ''}"
                              @click="${() => { this.activePostIndex = idx; }}"
                            >
                              <span>Post ${p.index}</span>
                              ${this.videoPosts.length > 1
                                ? html`
                                    <button
                                      type="button"
                                      class="post-tab-remove"
                                      @click="${(e) => this.handleRemoveVideoPost(e, idx)}"
                                      title="Remove Post"
                                    >
                                      &times;
                                    </button>
                                  `
                                : nothing}
                            </div>
                          `
                        )}
                      </div>
                    `
                  : nothing}

                ${this.allowMultiple === 'yes'
                  ? html`
                      <button type="button" class="btn-add-more-post" @click="${() => this.handleAddVideoPost()}">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Add More Post
                      </button>
                    `
                  : nothing}
              </div>
            `
          : nothing}

        ${!isConfigured
          ? html`
              <div class="config-alert">
                <strong>AWS S3 Credentials Required:</strong> Please configure your AWS Access Key, Secret Key, and Bucket in
                <strong>WordPress Admin &rarr; ASEN S3 Media &rarr; AWS S3 Settings</strong>.
              </div>
            `
          : nothing}

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
              ${this.renderVideoDropzone(post)}
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
                    .value="${post.title}"
                    @input="${(e) => this.handleFieldChange('title', e.target.value)}"
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
                      .value="${post.location}"
                      @input="${(e) => this.handleFieldChange('location', e.target.value)}"
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
                      .value="${post.reporter}"
                      @input="${(e) => this.handleFieldChange('reporter', e.target.value)}"
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
                      .value="${post.categories}"
                      @input="${(e) => this.handleFieldChange('categories', e.target.value)}"
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
                      .value="${post.restriction}"
                      @input="${(e) => this.handleFieldChange('restriction', e.target.value)}"
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
                    .value="${post.comments}"
                    @input="${(e) => this.handleFieldChange('comments', e.target.value)}"
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
                    .value="${post.contacts}"
                    @input="${(e) => this.handleFieldChange('contacts', e.target.value)}"
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
                    .value="${post.script}"
                    @input="${(e) => this.handleFieldChange('script', e.target.value)}"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div class="col-right">
            ${this.renderAttachmentsDropzone(post)}
          </div>
        </div>

        <div class="card-footer-actions">
          <div class="right-action-btns">
            <button type="button" class="btn-cancel" @click="${() => this.handleCancel()}">
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
              @click="${() => this.handleCreatePosts()}"
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
    `;
  }
}

if (!customElements.get('asen-s3-uploader')) {
  customElements.define('asen-s3-uploader', AsenS3Uploader);
}
