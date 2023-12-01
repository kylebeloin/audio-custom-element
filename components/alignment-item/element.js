// @ts-check
import { template, attributes } from "./index.js";
import AudioDataModel from "../../models/AudioDataModel.js";
import { AlignmentDialog } from "../alignment-dialog/index.js";

/**
 * @class Alignment Item
 * @extends HTMLElement
 * @property {string} data - The data attribute.
 */
export class AlignmentItem extends HTMLElement {
  /**
   * @returns {Array<string>} The observed attributes.
   */
  static get observedAttributes() {
    return Object.values(attributes);
  }

  /**
   * @type {import('../../models/AudioDataModel.js').AudioDataAlignment|null} - data
   */
  _data = null;

  /**
   * @type {HTMLAudioElement|null}
   */
  _audioElement = null;

  /**
   * @type {AlignmentDialog|null}
   */
  _dialogElement = null;

  /**
   * @type {HTMLSlotElement|null}
   * @private
   * */
  _itemSlot = null;

  /**
   * Variable that tracks the timeout interval for a hover event
   * @type {number|null}
   */
  _hoverTimeout = null;

  /**
   * Variable that tracks the timeout interval for a hover out event
   * @type {number|null}
   */
  _hoverOutTimeout = null;

  /**
   *
   * @param {import('../../models/AudioDataModel.js').AudioDataAlignment} data
   */
  constructor(data) {
    super();
    // Attach a shadow root to the element.
    const shadowRoot = this.attachShadow({ mode: "open" });
    // Clone the template and append it to the shadow root.
    shadowRoot.append(template.content.cloneNode(true));

    this._itemSlot = shadowRoot.querySelector("[name=item]");
    this._data = data;
    this.createWordElement(this._data);
    this.setStyleProperties(this._data);
    this._itemSlot?.addEventListener("mouseenter", this.handleDialogOpen);
    this._itemSlot?.addEventListener("mouseleave", this.handleDialogClose);
    // OnFocus, add a listener that closes the dialog when the mouse leaves the dialog.
    this._itemSlot?.addEventListener("focus", this.handleDialogOpen);
    this._itemSlot?.addEventListener("blur", this.handleDialogClose);
  }

  /**
   * @param {string} name - The name of the attribute.
   * @param {string} oldValue - The old value of the attribute.
   * @param {string} newValue - The new value of the attribute.
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) {
      return;
    }

    if (name === attributes.PLAYING && this._data) {
      this.playing = newValue;
      if (this.playing === "true") {
        this._itemSlot?.style.setProperty("--border-color", `var(--blue-4)`);
      } else {
        this._itemSlot?.style.setProperty("--border-color", `transparent`);
      }
    }
  }

  get playing() {
    return this.getAttribute(attributes.PLAYING);
  }

  set playing(value) {
    if (value) this.setAttribute(attributes.PLAYING, value);
  }

  connectedCallback() {
    if (this._data === null) {
      throw new Error("Data is null");
    }
  }

  /**
   * @param {import('../../models/AudioDataModel.js').AudioDataAlignment} data
   * @returns {void}
   */
  setStyleProperties(data) {
    if (AudioDataModel.isPause(data) || AudioDataModel.isWord(data)) {
      this.style.setProperty(
        "--height",
        `${AudioDataModel.isWord(data) ? data.prominence ** 2 : 0.01}`.slice(
          0,
          4
        )
      );

      this.style.setProperty(
        "--width",
        `${1.5 + (data.boundary.end - data.boundary.start)}`.slice(0, 4)
      );
      this.style.setProperty("--color", `var(${this.getColor(data)})`);
    }
  }

  /**
   * @param {import('../../models/AudioDataModel.js').AudioDataAlignment} data
   * @returns {string} - The color
   */
  getColor(data) {
    switch (true) {
      case AudioDataModel.isPause(data):
        return "--blue-4";
      case data.phoneme && data?.phoneme?.numErrors === 1:
        return "--yellow-4";
      case data.phoneme && data?.phoneme?.numErrors > 1:
        return "--red-4";
      case !AudioDataModel.isWord(data):
        return "--blue-1";
      default:
        return "--green-4";
    }
  }

  /**
   * @param {import('../../models/AudioDataModel.js').AudioDataAlignment} data
   * @returns {void}
   */
  createWordElement(data) {
    const wordElement = document.createElement("word");
    if (AudioDataModel.isWord(data)) {
      wordElement.textContent = data.word;
    } else {
      wordElement.textContent = " ";
      wordElement.style.setProperty(
        "width",
        `max(${data.boundary.end - data.boundary.start}ch, 1ch)`
      );
    }

    this._itemSlot?.append(wordElement);
  }

  /**
   * @returns {void}
   */
  handleDialogOpen = () => {
    if (!this._dialogElement && this._data && this._data.phoneme) {
      this.createDialogElement(this._data);
    }
    if (this._hoverOutTimeout) {
      clearTimeout(this._hoverOutTimeout);
    }
    this._hoverTimeout = setTimeout(() => {
      this._dialogElement?.showModal();
    }, 100);
  };

  /**
   * @returns {void}
   */
  handleDialogClose = () => {
    this._hoverOutTimeout = setTimeout(() => {
      if (
        this._hoverTimeout &&
        this._dialogElement &&
        !this._dialogElement._hovered
      ) {
        clearTimeout(this._hoverTimeout);
        this._dialogElement.closeModal();
      }
    }, 100);
  };

  /**
   * @param {import('../../models/AudioDataModel.js').AudioDataAlignment} data
   * @returns {void}
   */
  createDialogElement(data) {
    const { offsetLeft, offsetTop, offsetHeight } = this;
    const dialogElement = new AlignmentDialog(
      data,
      offsetLeft,
      offsetTop + offsetHeight
    );
    this._dialogElement = dialogElement;
    this._itemSlot?.append(dialogElement);
  }

  disconnectedCallback() {}
}

customElements.define("alignment-item", AlignmentItem);
