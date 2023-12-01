// @ts-check
import { template, attributes } from "./index.js";
import AudioDataModel from "../../models/AudioDataModel.js";

/**
 * @class AlignmentDialog
 * @extends HTMLElement
 * @property {string} data - The data attribute.
 */
export class AlignmentDialog extends HTMLElement {
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
   * @type {HTMLDivElement|null}
   */
  _dialogElement = null;

  /**
   * Hovered
   * @type {boolean} - Whether the element is hovered.
   */
  _hovered = false;

  /**
   *
   * @param {import('../../models/AudioDataModel.js').AudioDataAlignment} data
   * @param {number} offsetLeft
   * @param {number} offsetTop
   */
  constructor(data, offsetLeft, offsetTop) {
    super();
    // Attach a shadow root to the element.
    const shadowRoot = this.attachShadow({ mode: "open" });
    // Clone the template and append it to the shadow root.
    shadowRoot.append(template.content.cloneNode(true));

    this._data = data;

    this._dialogElement = shadowRoot.querySelector(".dialog");
    if (this._dialogElement !== null) {
      this._dialogElement.style.left = `${offsetLeft}px`;
      this._dialogElement.style.top = `${offsetTop}px`;
    }
    /**
     * @type {HTMLDivElement|null}
     */
    this._dialogContent = shadowRoot.querySelector("[name=dialog-content]");
    if (this._data.phoneme) {
      this.setAlignmentContent(this._data.phoneme);
      this.showModal();
    }

    // OnHover, add a listener that closes the dialog when the mouse leaves the dialog.
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
  }

  showModal() {
    if (
      this._dialogElement &&
      !this._dialogElement.classList.contains("show") &&
      this._data?.phoneme
    ) {
      this._dialogElement.classList.add("show");
    }
  }

  closeModal() {
    if (this._dialogElement) {
      this._dialogElement.classList.remove("show");
      this._dialogElement.classList.add("hide");
    }
    this._hovered = false;
    this.removeEventListener("mouseleave", this.closeModal);
  }

  /**
   * @param {Event} e
   */
  onHoverIntent = (e) => {
    this._hovered = true;
    this._dialogContent?.addEventListener("mouseleave", () => {
      this.closeModal();
    });
  };

  /**
   * @param {import('../../models/AudioDataModel.js').AudioDataPhoneme} data
   */
  setAlignmentContent(data) {
    const targetContent = document.createElement("div");
    const detectedContent = document.createElement("div");

    targetContent.classList.add("container");
    detectedContent.classList.add("container");

    const target = data.target.split(" ");
    const detected = data.detected.split(" ");

    if (target.length !== detected.length) {
      throw new Error("Target and detected lengths do not match");
    }

    // For each word, create a span element.
    for (let i = 0; i < target.length; i++) {
      // which word has more characters?
      const maxWordLength = Math.max(target[i].length, detected[i].length);

      const targetSpan = document.createElement("span");
      targetSpan.classList.add("target");
      targetSpan.style.width = `${maxWordLength}ch`;
      targetSpan.innerHTML = target[i];

      const detectedSpan = document.createElement("span");
      detectedSpan.classList.add("detected");
      detectedSpan.style.width = `${maxWordLength}ch`;
      detectedSpan.innerHTML = detected[i];

      if (target[i] !== detected[i]) {
        detectedSpan.classList.add("error");
      }
      targetContent.appendChild(targetSpan);
      detectedContent?.appendChild(detectedSpan);
    }

    this._dialogContent?.appendChild(targetContent);
    this._dialogContent?.appendChild(detectedContent);

    const link = document.createElement("a");
    link.href = this._data?.link ?? "";
    link.target = "_blank";
    link.textContent = "Hear the word";
    link.onclick = (e) => {
      e.stopPropagation();
    };
    this._dialogContent?.appendChild(link);

    if (this._dialogContent) {
      this._dialogContent.onmouseover = this.onHoverIntent;
    }
  }

  connectedCallback() {
    if (this._data === null) {
      throw new Error("Data is null");
    }
  }

  disconnectedCallback() {}
}

customElements.define("alignment-dialog", AlignmentDialog);
