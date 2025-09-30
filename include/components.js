
// Score Element
class ScoreElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = `
      <div>
        <span id="currentScore">0</span> of <span id="scoreTotal">10</span>
        <audio id="myAudio" src="sound/exercise_finished.wav">Play</audio>
      </div>
    `;

    this.currentScore = 0;
    this.scoreTotal = 10;

    this.$currentScore = this.shadowRoot.getElementById('currentScore');
    this.$scoreTotal = this.shadowRoot.getElementById('scoreTotal');

  }

  increaseScore() {
    this.currentScore++;
    this.$currentScore.innerHTML = this.currentScore;
    if(this.currentScore%this.scoreTotal==0) {
      this.shadowRoot.getElementById('myAudio').play();
      return true;
    }
    return false;
  }

  resetScore() {
    this.currentScore = 0;
    this.$currentScore.innerHTML = this.currentScore;
  }

  setTotal(scoreTotal) {
    this.scoreTotal = scoreTotal;
    this.$scoreTotal.innerHTML = this.scoreTotal;
  }

 
}

customElements.define('score-element', ScoreElement);

// MultiSelect
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
      <b>${name}</b>
      <label>
        <input type="checkbox" data-role="select-all"> <label>Select All</label>
      </label>
      <div class="options"></div>
    `;

    const optionsContainer = this.querySelector('.options');
    options.forEach(opt => {
      const label = document.createElement('label');
      // label.style.display = 'block';
      label.innerHTML = `<input type="checkbox" value="${opt}"> <label>${opt}</label>`;
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

// customElements.define('multi-select', MultiSelect2);


// MultiSelect
class MultiSelect extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const options = JSON.parse(this.getAttribute('options') || '[]');
    const name = this.getAttribute('name') || 'Select Items';

    if (this.rendered) return;
    this.rendered = true;

    this.innerHTML = `
      <div class='title'>${name}</div>
      <div class='option-container'></div>
    `;

    let optionsHtml = `<div class='option'><input type='checkbox' data-role='select-all'> <label>Select All</label></div>`;
    options.forEach(opt => {
      optionsHtml += `<div class='option'><input type='checkbox' value='${opt}'> <label>${opt}</label></div>`;
    }) 
    this.querySelector('.option-container').innerHTML = optionsHtml;

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

customElements.define('multi-select', MultiSelect);


class StopWatch extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = `
          <style>
            

            .stopwatch {
              width: 120px;
              height: 30px;
              background:rgb(12, 71, 150);
              border-radius: 10px;
              display: flex;
              align-items: center;
              justify-content: space-evenly;
              position: relative;
              overflow: hidden;
              font-family: 'Orbitron', sans-serif;
              box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
            }

            .time {
              font-size: 1.4em;
              font-weight: bold;
              color: #ffffff;
              text-shadow: 0 0 6px #ffffffaa;
              transition: transform 0.3s ease, text-shadow 0.3s;
              width: 40px;
              text-align: center;
            }

            .time.glow {
              transform: scale(1.0);
              text-shadow: 0 0 10px #fff, 0 0 20px #fff;
            }

            .colon {
              display: flex;
              flex-direction: column;
              justify-content: center;
              gap: 4px;
              margin: 0 1px;
            }

            .dot {
              width: 6px;
              height: 6px;
              border-radius: 50%;
              background: #fff;
            //   box-shadow: 0 0 6px #ffffff99;
            //   animation: blink 1s infinite;
            }

            @keyframes blink {
              0%, 100% { opacity: 0.3; transform: scale(1); }
              50% { opacity: 1; transform: scale(1.2); }
            }
          </style>

          <div class="stopwatch">
            <div class="time" id="minute">00</div>
            <div class="colon">
              <div class="dot"></div>
              <div class="dot"></div>
            </div>
            <div class="time" id="second">00</div>
          </div>
        `;

    this.seconds = 0;
    this.minutes = 0;
    this.timer = null;

    this.$minute = this.shadowRoot.getElementById('minute');
    this.$second = this.shadowRoot.getElementById('second');
  }

  animateTick(el) {
    el.classList.add('glow');
    setTimeout(() => el.classList.remove('glow'), 300);
  }

  updateTime() {
    this.seconds++;
    if (this.seconds === 60) {
      this.seconds = 0;
      this.minutes++;
      this.animateTick(this.$minute);
    }

    this.$second.textContent = String(this.seconds).padStart(2, '0');
    this.$minute.textContent = String(this.minutes).padStart(2, '0');
    this.animateTick(this.$second);
  }

  start() {
    if (!this.timer) {
      this.timer = setInterval(() => this.updateTime(), 1000);
    }
  }

  stop() {
    clearInterval(this.timer);
    this.timer = null;
  }

  reset() {
    this.stop();
    this.seconds = 0;
    this.minutes = 0;
    this.$second.textContent = '00';
    this.$minute.textContent = '00';
  }
}

customElements.define('fancy-stopwatch', StopWatch);


// class TestPhrase extends HTMLElement {
//   constructor() {
//     super();
//     this.attachShadow({ mode: 'open' });
//     this.translated = "Hi";

//     this.shadowRoot.innerHTML = `
//       <style>
//         input {
//           font-size: 25px;
//         }

//         .spanish-word {
//           padding: 3px;
//           margin: 3px;
//           background-color: lightgray;
//           border-radius: 5px;
//           width: fit-content;
//           color: lightgray;
//           font-size: 30px;
//         }

//         .tick {
//           padding: 3px;
//           margin: 3px;
//           color: white;
//           font-weight: bold;
//           background-color: darkgreen;
//           border-radius: 3px;
//           font-size: 30px;
//         }

//         .darkgreen {
//           color: darkgreen;
//         }

//         .red {
//           color: red;
//         }

//         #translated {
//           display: flex;
//         }
//       </style>
//       <div>
//         <div class="original">A</div>
//         <div class="user-input"><input id="user-input"></div>
//         <div id="translated" class="translated">B</div>
//       </div>
//     `;

//     const input = this.shadowRoot.querySelector('#user-input');

//     input.addEventListener("keydown", async (event) => {
//       // Capture input so far + the new key
//       const inputValue = input.value.trim();
//       const predictedValue = event.key.length === 1 ? inputValue + event.key : inputValue;

//       let output = this.compareSentances(predictedValue, this.translated).response;
//       this.shadowRoot.querySelector('#translated').innerHTML = output;

//       if (event.key === "Enter" || event.key === "Tab") {
//         event.preventDefault();
//         this.dispatchEvent(new CustomEvent('match', {
//           detail: { value: false },
//           bubbles: true,
//           composed: true
//         }));
//       } else if (predictedValue === this.translated) {
//         this.shadowRoot.querySelector('#translated').innerHTML = output + `<span class='tick'>&checkmark;</span>`;
//         await new Promise(resolve => setTimeout(resolve, 5000)); // 500ms sleep
//         // Match found – emit and clear
//         event.preventDefault(); // prevent the key from being inserted
//         this.dispatchEvent(new CustomEvent('match', {
//           detail: { value: true },
//           bubbles: true,
//           composed: true
//         }));
//         input.value = ""; // clear input
//       }
//     });
//   }

//   loadData(original, translated) {
//     this.shadowRoot.querySelector('.original').textContent = original;
//     this.translated = translated;
//     this.shadowRoot.querySelector('.translated').innerHTML = `<div class='spanish-word'>${translated}</div>`;
//     this.shadowRoot.querySelector('#user-input').value = "";
//   }



//   compareSentances(sentance1, sentance2) {
//     let response = '';
//     let words1 = sentance1.split(' ');
//     let words2 = sentance2.split(' ');
//     let maxWords = Math.max(words1.length, words2.length);
//     let success = true;
//     for (let i = 0; i < maxWords; i++) {
//       if (words1[i] == undefined) {
//         response += `<div class='spanish-word'>${words2[i]}</div>`;
//         success = false;
//         continue;
//       }
//       if (words2[i] == undefined) {
//         response += `<div class='spanish-word'><span class='red bold'>${words1[i]}</span></div>`;
//         success = false;
//         continue;
//       }
//       response += this.compareWords(words1[i], words2[i]).response;
//       let result = this.compareWords(words1[i], words2[i]).success;
//       if (!result) {
//         success = false;
//       }
//     }
//     return { "response": response, "success": success };
//   }

//   compareWords(word1, word2) {
//     // console.log(`word1: ${word1}  word2: ${word2}`);
//     let maxLetters = Math.max(word1.length, word2.length);
//     // console.log(`max letters: ${maxLetters}`);
//     let response = `<div class='spanish-word'>`;
//     let success = true;
//     for (let i = 0; i < maxLetters; i++) {
//       let letter1 = word1[i];
//       let letter2 = word2[i];
//       if (letter1 == undefined) {
//         response += letter2;
//         success = false;
//         continue;
//       }
//       if (letter2 == undefined) {
//         response += `<span class='red bold'>${letter1}</span>`;
//         success = false;
//         continue;
//       }
//       let letter1A = this.removeAccent(letter1);
//       let letter2A = this.removeAccent(letter2);
//       // console.log(`${letter1A}  ${letter2A}`);
//       if (letter1A.toLowerCase() == letter2A.toLowerCase()) {
//         response += `<span class='darkgreen'>${letter2}</span>`;
//       } else {
//         response += `<span class='red bold'>${letter1}</span>`;
//         success = false;
//       }

//     }
//     response += '</div>';
//     // console.log(`response: ${response}`);
//     return { "response": response, "success": success };
//   }

//   removeAccent(letter) {
//     switch (letter) {
//       case 'á':
//         return 'a';
//       case 'é':
//         return 'e';
//       case 'í':
//         return 'i';
//       case 'ó':
//         return 'o';
//       case 'ú':
//         return 'u';
//     }
//     return letter
//   }
// }


// customElements.define('test-phrase', TestPhrase);

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
    const category = this.getAttribute('category') || '❓';
    const color = this.getAttribute('color') || '#3498db';

    this.shadowRoot.innerHTML = `
      <style>
        .pin {
          position: relative;
          width: 25px;
          height: 25px;
          background: ${color};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Adjusted pointer */
        .pin::after {
          content: "";
          position: absolute;
          bottom: -3px;                 /* raise it closer */
          left: 50%;
          transform: translateX(-50%) rotate(45deg);
          width: 12px;                   /* slightly smaller */
          height: 12px;
          background: ${color};
        }

        /* White inner circle */
        .inner {
          width: 16px;
          height: 16px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
          color: black;
          // color: ${color};
          z-index: 1;
        }
      </style>
      <div class="pin">
        <div class="inner">${category}</div>
      </div>
    `;
  }
}

customElements.define('category-icon', CategoryIcon);





