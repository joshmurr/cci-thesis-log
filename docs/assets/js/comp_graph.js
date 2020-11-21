class TensorBox extends HTMLElement {
  constructor() {
    super();
    const scale = this.parentElement.getAttribute('scale') || 1;

    const width = this.getAttribute('width') * scale;
    const height = this.getAttribute('height') * scale;
    const depth = this.getAttribute('depth') * scale;
    const z = this.getAttribute('z');
    const img_url = this.getAttribute('img');

    const rot = -30;
    const offset = (this.parentElement.getAttribute('height') - height) / 2;
    const animate = this.parentElement.getAttribute('animate') === 'true';
    const translation = `translate3d(0px, ${offset}px, -${(256-depth)/2}px)`;

    const colour = Math.floor(1/width + 1/height + 1/depth * 360 * scale);

    const template = document.createElement('template');
    template.innerHTML = `
      <style>
        .box {
          position: relative;
          width: ${width}px;
          height: ${height}px;
          float: left;
          transform-style: preserve-3d;
          z-index: ${z};
          margin: 0 0.2px;
          transform: ${translation} rotate3d(1, 0, 0, ${rot}deg);
          ${(animate ? 'animation: oscillate 10s linear infinite' : '')};
        }
        @keyframes oscillate {
          0%   { ${translation} rotate3d(1, 0, 0, ${rot}deg); }
          25%  { transform: translate3d(0px, ${offset}px, -${(256-depth)/2}px) rotate3d(1, 0.1, 0, ${rot+5}deg); }
          75%  { transform: translate3d(0px, ${offset}px, -${(256-depth)/2}px) rotate3d(1, -0.1, 0, ${rot-5}deg); }
          100% { transform: translate3d(0px, ${offset}px, -${(256-depth)/2}px) rotate3d(1, 0, 0, ${rot}deg); }
        }
        .box-face{
          text-align: center;
          font-family: sans-serif;
          position: absolute;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          outline: 1px solid transparent; /* anti-aliasing workaround */
        }
				.box-face > p{
					margin: 0;
					padding: 0;
					font-size: ${8}px;
          color: black;
          line-height: ${width}px;
					margin-top: ${height}px;
          padding: 3px;
          writing-mode: vertical-rl; 
			  }
        .front {
          width: ${width}px;
          height: ${height}px;
        }

        .right, .left {
          width: ${depth}px;
          height: ${height}px;
          left: ${(width-depth) / 2}px;
        }

        .top {
          width: ${width}px;
          height: ${depth}px;
          top: ${(height - depth) / 2}px;
        }
        .front  { background: hsla(${colour}, 100%, 50%, 0.7); }
        .right  { background: hsla(${colour}, 100%, 50%, 0.7); }
        .left   { background: hsla(${colour}, 100%, 50%, 0.7); }
        .top    { background: hsla(${colour}, 100%, 50%, 0.7); }

        .front  { transform: rotateY(  0deg) translateZ(${depth/2}px); }
        .right  { transform: rotateY( 90deg) translateZ(${width/2}px); }
        .left   { transform: rotateY(-90deg) translateZ(${width/2}px); }
        .top    { transform: rotateX( 90deg) translateZ(${height/2}px); }

        .top {
          background-image: url(${img_url});
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;
        }

        .box:unresolved {
          opacity: 0;
        }
      </style>
      <div class="box">
        <div class="box-face front">
          <p><slot name="front-text">${depth}x${width}x${height}</slot></p>
        </div>
        <div class="box-face right"> </div>
        <div class="box-face left"> </div>
        <div class="box-face top">
          <p><slot name="top-text"></slot></p>
        </div>
      </div>
    `;

    const wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'box');

    const shadow = this.attachShadow({mode: 'open'})
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

class TensorGraph extends HTMLElement {
  constructor() {
    super();
    const height = this.getAttribute('height');
    const perspective = this.getAttribute('perspective');
    const animate = this.getAttribute('animate');

    const template = document.createElement('template');
    template.innerHTML = `
      <style>
				:host {
          display: block;
          position: relative;
          text-align: center;
          height: ${height}px;
          perspective: ${perspective}px;
				}
      </style>
			<slot>DEFAULT</slot>
    `;
    const shadow = this.attachShadow({mode: 'open'})
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('tensor-box', TensorBox);
customElements.define('tensor-graph', TensorGraph);
