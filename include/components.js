


class CategoryIcon extends HTMLElement {
  static get observedAttributes() {
    return ['category', 'color'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  /**
   * @param {boolean} expand
   */
  expand(expand) {
    // console.log(`This should expand`);
    if (this.shadowRoot != null) {
      const label = this.shadowRoot.querySelector('.label-text');
      // console.log(`html: ${label?.innerHTML}`);
      if(label instanceof HTMLElement) {
        if(expand) {
          label.style.display = 'block';
        } else {
          label.style.display = 'none';
        }
        
      }
    }
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
    if (label != '') {
      label = '&nbsp;' + label + '&nbsp;&nbsp;';
    }

    switch (category) {
      case "toilet":
        category = "\u{1F6BB}"; // 🚻
        break;
      case "landmark":
        category = "\u{1F3DB}"
        break;
      case "restaurant":
        category = "\u{1F374}";
        break;
      case "church":
        category ="\u{271D}";
        break;
      case "museum":
        category ="\u{1F3FA}";
        break;
      default:
        category = "i";
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
        <!-- <div id="picture-container">
          <img src="bus.jpg">
        </div> -->
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


class MultiSelect2 extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const options = JSON.parse(this.getAttribute('options') || '[]');
    const name = this.getAttribute('name') || 'Select Items';

    if (this.rendered) return;
    this.rendered = true;

    this.innerHTML = `
      <h3>${name}</h3>
      <label>
        <input type="checkbox" data-role="select-all" checked> Select All
      </label>
      <div class="options"></div>
    `;

    const optionsContainer = this.querySelector('.options');
    options.forEach(opt => {
      const label = document.createElement('label');
      label.style.display = 'block';
      label.innerHTML = `<input type="checkbox" checked value="${opt}"> ${opt}`;
      optionsContainer.appendChild(label);
    });

    const checkboxes = this.querySelectorAll('input[type="checkbox"]:not([data-role="select-all"])');
    const selectAll = this.querySelector('[data-role="select-all"]');

    let suppressDispatch = false;

    const updateAll = () => {
      suppressDispatch = true;
      checkboxes.forEach(cb => cb.checked = selectAll.checked);
      suppressDispatch = false;
      this.dispatchSelection();
    };

    const updateSelectAll = () => {
      if (!suppressDispatch) {
        const allChecked = [...checkboxes].every(cb => cb.checked);
        selectAll.checked = allChecked;
        this.dispatchSelection();
      }
    };

    checkboxes.forEach(cb => cb.addEventListener('change', updateSelectAll));
    selectAll.addEventListener('change', updateAll);
  }

  dispatchSelection() {
    this.dispatchEvent(new CustomEvent('selection-change', {
      bubbles: true,
      detail: this.value
    }));
  }

  get value() {
    const checkboxes = this.querySelectorAll('input[type="checkbox"]:not([data-role="select-all"])');
    return [...checkboxes]
      .filter(cb => cb.checked)
      .map(cb => cb.value);
  }
}

customElements.define('multi-select', MultiSelect2);


