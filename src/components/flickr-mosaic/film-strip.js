import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('film-strip')
export class FilmStrip extends LitElement {
	static properties = {
		images: { type: Array },
		index: { type: Number },
	};

	static styles = css`
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
	`;

	constructor() {
		super();
		this.images = [];
		this.index = 0;
	}

	render() {
		if (!this.images?.length) {
			return html`<div class="window" aria-hidden="true"></div>`;
		}

		const startIndex = ((this.index % this.images.length) + this.images.length) % this.images.length;
		const sequence = [
			...this.images.slice(startIndex),
			...this.images.slice(0, startIndex),
		].slice(0, 16 + Math.floor(Math.random() * 5));
		const duration = 25 + (startIndex % 5) * 3 + 2*Math.random();

		return html`
			<div class="window" aria-label="Moving vertical photo strip">
				<div class="track" style="--drift-duration: ${duration}s">
					${[0, 1].map(() => html`
						<div class="sequence" aria-hidden="true">
							${sequence.map((imageUrl) => html`<img src=${imageUrl} alt="" loading="lazy" />`)}
						</div>
					`)}
				</div>
			</div>
		`;
	}
}
