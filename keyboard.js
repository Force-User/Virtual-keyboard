"use strict";
const Keyboard = {
  elements: {
    main: null,
    keyboardKeys: null,
    keys: [],
    currentKey: null,
    pressButtons: [],
  },
  eventHandlers: {
    oninput: null,
  },
  properties: {
    value: "",
    capslock: false,
  },

  init() {
    this.elements.main = document.createElement("div");
    this.elements.main.classList.add("keyboard", "keyboard--hidden");

    this.elements.keyboardKeys = document.createElement("div");
    this.elements.keyboardKeys.classList.add("keyboard-keys");

    this.elements.keyboardKeys.append(this._createKeys());
    this.elements.main.append(this.elements.keyboardKeys);
    document.body.prepend(this.elements.main);

    this.elements.keys = this.elements.keyboardKeys.querySelectorAll(
      ".keyboard-keys__key"
    );
    this.pressButtonEffect();

    const inputArea = document.querySelectorAll(".use--keyboard");

    inputArea.forEach((elem) => {
      elem.addEventListener("focus", () => {
        this.open(elem.value, (currentValue) => {
          elem.value = currentValue;
        });
      });
    });
  },

  _createKeys() {
    const keys = [
      ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace"],
      ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
      ["capslock", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter"],
      ["check", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?"],
      ["space"],
    ];

    const createIcons = (iconName) => {
      return `<i class="material-icons">${iconName}</i>`;
    };
    const fragment = document.createDocumentFragment();

    keys.forEach((row) => {
      row.forEach((key, index) => {
        const keyButton = document.createElement("button");
        keyButton.classList.add("keyboard-keys__key");
        switch (key) {
          case "backspace":
            keyButton.setAttribute("data-key", `Backspace`);
            keyButton.innerHTML = createIcons("backspace");
            keyButton.classList.add("keyboard-keys__key--wide");

            this._triggerEvents("oninput");
            keyButton.addEventListener("click", () => {
              this.clearOneSymbol();
              this._triggerEvents("oninput");
            });
            break;

          case "capslock":
            keyButton.setAttribute("data-key", `CapsLock`);
            keyButton.classList.add("keyboard-keys__key--wide", "CapsLock");
            keyButton.innerHTML = createIcons("keyboard_capslock");
            keyButton.addEventListener("click", () => {
              keyButton.classList.toggle("CapsLock--active");
              this._triggerCapsLock();
            });

            break;

          case "enter":
            keyButton.setAttribute("data-key", `Enter`);
            keyButton.innerHTML = createIcons("keyboard_return");
            keyButton.classList.add("keyboard-keys__key--wide");
            keyButton.addEventListener("click", () => {
              this.properties.value += "\n";
              this._triggerEvents();
            });
            break;

          case "check":
            keyButton.innerHTML = createIcons("check_circle");
            keyButton.addEventListener("click", () => {
              this.close();
            });

            break;

          case "space":
            keyButton.setAttribute("data-key", `Space`);
            keyButton.innerHTML = createIcons("space_bar");
            keyButton.classList.add("space");
            keyButton.addEventListener("click", () => {
              this.properties.value += " ";
              this._triggerEvents("oninput");
            });
            break;
          default:
              if(Number(key) >=0) {
                keyButton.setAttribute("data-key", `Digit${key}`)
              } else if(key === ",") {
                keyButton.setAttribute("data-key", `Comma`);
              } else if(key === ".") {
                keyButton.setAttribute("data-key", `Period`);
              }
              else if(key === "?") {
                keyButton.setAttribute("data-key", `Slash`)
              } else {
                keyButton.setAttribute("data-key", `Key${key.toUpperCase()}`)
              }

            keyButton.addEventListener("click", () => {
               
              this.properties.value += this.properties.capslock
                ? key.toUpperCase()
                : key.toLowerCase();
              this._triggerEvents("oninput");
            });
            keyButton.textContent = key;

            break;
        }
        fragment.append(keyButton);
        if (index === row.length - 1 && row.length > 1) {
          fragment.append(document.createElement("br"));
        }
      });
    });
    return fragment;
  },

  _triggerEvents(handlerName) {
    if (typeof this.eventHandlers[handlerName] === "function") {
      this.eventHandlers[handlerName](this.properties.value);
    }
  },
  _triggerCapsLock() {
    this.properties.capslock = !this.properties.capslock;
    this.elements.keys.forEach((key) => {
      if (key.childElementCount === 0) {
        key.textContent = this.properties.capslock
          ? key.textContent.toUpperCase()
          : key.textContent.toLowerCase();
      }
    });
  },

  open(initial, oninput) {
    this.properties.value = initial;
    this.eventHandlers.oninput = oninput;
    this.elements.main.classList.remove("keyboard--hidden");
  },

  close() {
    this.elements.main.classList.add("keyboard--hidden");
  },

  addValueForDesctopKeyboard(key) {
    switch (key.dataset.key) {
      case "Enter":
        this.properties.value += "\n";
        break;
      case "Backspace":
        this.clearOneSymbol();
        break;
      case "Space":
        this.properties.value += " ";
        break;
      case "CapsLock":
        this.elements.currentKey.classList.toggle("CapsLock--active");
        this._triggerCapsLock();
        console.log(this.properties.capslock);
        break;
      default:
        this.properties.value += this.properties.capslock
          ? key.textContent.toUpperCase()
          : key.textContent.toLowerCase();
        break;
    }
  },

  clearOneSymbol() {
    const stringLength = this.properties.value.length;
    this.properties.value = this.properties.value.substring(
      0,
      stringLength - 1
    );
  },

  pressButtonEffect() {
    window.addEventListener("keydown", (e) => {
        
      this.elements.currentKey = this.elements.keyboardKeys.querySelector(
        `[data-key="${e.code}"]`
      );

      this.elements.currentKey.classList.add("key--press");
      this.elements.pressButtons.push(this.elements.currentKey);
      this.addValueForDesctopKeyboard(this.elements.currentKey);
    });

    window.addEventListener("keyup", (e) => {
      this.elements.pressButtons.forEach((key) =>
        key.classList.remove("key--press")
      );
    });
  },
};

window.addEventListener("DOMContentLoaded", () => {
  Keyboard.init();
});
