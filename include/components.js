


class CategoryIcon extends HTMLElement {
  static get observedAttributes() {
    return ['category', 'color'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    let category = this.getAttribute('category') || 'i';
    const color = this.getAttribute('color') || 'red';
    let label = this.getAttribute('label') || '';
    // if (label != '') {
    //   label = '&nbsp;' + label + '&nbsp;&nbsp;';
    // }

    switch (category) {
      case "toilet":
        category = "🚻";
    }

    if (this.shadowRoot == null) {
      console.log(`CategoryIcon  this.shadowRoot is null`);
      return;
    }

    this.shadowRoot.innerHTML = `
      <style>

        .pin {
          // position: relative;
          // width: 25px;
          // height: 25px;
          // background: ${color};
          // border-radius: 50%;
          // display: flex;
          // align-items: center;
          // justify-content: center;
          position: relative;
          width: max-content;
          height: 15px;
          background: ${color};
          border-radius: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-left: 0px;
          padding-top: 3px;
          padding-right: 0px;
          padding-bottom: 3px;
        }

        /* Adjusted pointer */
        .pin::after {
          // content: "";
          // position: absolute;
          // bottom: -3px;                 /* raise it closer */
          // left: 50%;
          // transform: translateX(-50%) rotate(45deg);
          // width: 12px;                   /* slightly smaller */
          // height: 12px;
          // background: ${color};
          content: "";
          position: absolute;
          bottom: -7px;                 /* raise it closer */
          left: 14px;
          transform: translateX(-50%) rotate(45deg);
          width: 14px;                   /* slightly smaller */
          height: 14px;
          background: ${color};

        }

        /* White inner circle */
        .inner {
          // width: 16px;
          // height: 16px;
          // background: white;
          // border-radius: 50%;
          // display: flex;
          // align-items: center;
          // justify-content: center;
          // font-size: 12px;
          // font-weight: bold;
          // color: black;
          // // color: ${color};
          // z-index: 1;

          width: 20px;
          height: 20px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: bold;
          color: black;
          border: 4px solid ${color};
          z-index: 1;
          overflow: hidden;

        }
        .label-text {
          color: white;
          font-size: 14px;
        }
      </style>
      <div class="pin">
        <div class="inner">${category}</div>
        <div class="label-text">${label}</div>
      </div>
    `;
  }
}

customElements.define('category-icon', CategoryIcon);

// ------------------------------

class InfoBox extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="info-box">
        <span class="close">✖</span>
        <div class="info-title"></div>
        <p class="info-desc"></p>
        <div id="picture-container">
          <img src="bus.jpg">
      </div>
    `;

    if (this.querySelector(".close") == null) {
      console.log(`InfoBox this.querySelector is null`);
      return;
    }

    const closeButton = this.querySelector(".close");

    if (closeButton) {
      closeButton.addEventListener("click", () => this.hideInfo());
    }


  }

  hideInfo() {
    this.style.display = "none";
  }

  showInfo() {
    this.style.display = "block";
  }

  // @ts-ignore
  setTitle(text) {
    const titleEl = this.querySelector(".info-title");
    if (titleEl) titleEl.textContent = text;
  }

  // @ts-ignore
  setDescription(text) {
    const descEl = this.querySelector(".info-desc");
    if (descEl) descEl.innerHTML = text;
  }
}

customElements.define("info-box", InfoBox);





