class TensorBox extends HTMLElement {
  constructor() {
    super();
    const width = this.getAttribute('width');
    const height = this.getAttribute('height');
    const depth = this.getAttribute('depth');
    const z = this.getAttribute('z');

    const yRotation = 30;
    const offset = (this.parentElement.getAttribute('height') - height) / 2;

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
          margin: 0.5px;
          transform: translate3d(${-150}px, ${offset}px, -${500+(256-depth)/2}px) rotateX(${yRotation}deg);
        }
        @keyframes spinning {
          0%   { transform: translateZ(-${depth/2}px) rotateX(  0deg); }
          20%  { transform: translateZ(-${depth/2}px) rotateX( 10deg); }
          80%  { transform: translateZ(-${depth/2}px) rotateX(-10deg); }
          100% { transform: translateZ(-${depth/2}px) rotateX(  0deg); }
        }
        .box-face{
          text-align: center;
          line-height: 200px;
          font-family: sans-serif;
          color: white;
          position: absolute;
          backface-visibility: hidden;
        }
        .front, .back {
          width: ${width}px;
          height: ${height}px;
        }

        .right, .left {
          width: ${depth}px;
          height: ${height}px;
          left: ${(width-depth) / 2}px;
        }

        .top, .bottom {
          width: ${width}px;
          height: ${depth}px;
          top: ${(height - depth) / 2}px;
        }
        .front  { background: hsla(  0, 100%, 50%, 0.7); }
        .back   { background: hsla( 60, 100%, 50%, 0.7); }
        .right  { background: hsla(120, 100%, 50%, 0.7); }
        .left   { background: hsla(180, 100%, 50%, 0.7); }
        .top    { background: hsla(240, 100%, 50%, 0.7); }
        .bottom { background: hsla(300, 100%, 50%, 0.7); }

        .front  { transform: rotateY(  0deg) translateZ(${depth/2}px); }
        .back   { transform: rotateY(180deg) translateZ(${depth/2}px); }

        .right  { transform: rotateY( 90deg) translateZ(${width/2}px); }
        .left   { transform: rotateY(-90deg) translateZ(${width/2}px); }

        .top    { transform: rotateX( 90deg) translateZ(${height/2}px); }
        .bottom { transform: rotateX(-90deg) translateZ(${height/2}px); }

        .box:unresolved {
          opacity: 0;
        }
      </style>
      <div class="box">
        <div class="box-face front"><slot name="front-text"></slot></div>
        <div class="box-face back"><slot name="back-text"></slot></div>
        <div class="box-face right"><slot name="right-text"></slot></div>
        <div class="box-face left"><slot name="left-text"></slot></div>
        <div class="box-face top"><slot name="top-text"></slot></div>
        <div class="box-face bottom"><slot name="bottom-text"></slot></div>
      </div>
    `;

    const wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'box');

    const shadow = this.attachShadow({mode: 'open'})
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

class CompGraph extends HTMLElement {
  constructor() {
    super();
    const width = this.getAttribute('width');
    const height = this.getAttribute('height');
    const perspective = this.getAttribute('perspective');

    const template = document.createElement('template');
    template.innerHTML = `
      <style>
				:host {
          display: block;
          position: relative;
          text-align: center;
          border: 1px solid black;
          height: ${height}px;
          perspective: ${perspective}px;

				}
      </style>
			<slot>DEAFULT</slot>
    `;
    const shadow = this.attachShadow({mode: 'open'})
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('tensor-box', TensorBox);
customElements.define('comp-graph', CompGraph);
