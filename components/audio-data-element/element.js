// @ts-check
import { template, attributes } from "./index.js";
import { AlignmentItem } from "../alignment-item/element.js";

/**
 * @class AudioData
 * @extends HTMLElement
 * @property {string} data - The data attribute.
 */
export class AudioDataElement extends HTMLElement {
  /**
   * @returns {Array<string>} The observed attributes.
   */
  static observedAttributes = Object.values(attributes);

  /**
   * @type {import('../../models/AudioDataModel.js').AudioData|null} - data
   */
  _data = null;

  /**
   * @type {HTMLAudioElement|null}
   */
  _audioElement = null;

  /**
   * @type {HTMLSlotElement|null}
   */
  _alignmentSlot = null;

  /**
   *
   * @param {import('../../models/AudioDataModel.js').AudioData|string} data
   */
  constructor(data) {
    super();
    // Attach a shadow root to the element.
    const shadowRoot = this.attachShadow({ mode: "open" });
    // Clone the template and append it to the shadow root.
    shadowRoot.append(template.content.cloneNode(true));

    this._alignmentSlot = shadowRoot.querySelector("[name=alignment-items]");

    // Get the audio element from the template.
    this._audioElement = shadowRoot.querySelector("audio");
    if (this._audioElement !== null) {
      if (typeof data !== "string") {
        this._data = data;
        this._audioElement.src = this._data?.filename;
      } else {
        this._audioElement.src = data;
      }
    }
    if (this._data !== null) {
      this._data.alignment.forEach((alignment, i) => {
        const alignmentItem = new AlignmentItem(alignment);
        alignmentItem.addEventListener("click", (event) => {
          this._audioElement?.pause();
          if (
            this._audioElement?.currentTime !== undefined &&
            alignmentItem._data?.boundary.start &&
            alignmentItem._data?.boundary.idx !== undefined
          ) {
            // If i is not 0, take the previous boundary as the start.
            const start =
              i > 3
                ? this._data?.alignment[i - 3].boundary.end
                : alignmentItem._data?.boundary.start;
            if (start !== undefined) {
              this._audioElement.currentTime = start;
            }
          }

          this._audioElement?.play();
        });
        this._alignmentSlot?.append(alignmentItem);
      });
    }

    // Add event listeners.
    this._audioElement?.addEventListener("timeupdate", (event) => {
      // update the alignment items
      const currentTime = this._audioElement?.currentTime;
      if (currentTime !== undefined) {
        this._alignmentSlot?.childNodes.forEach((child) => {
          if (child instanceof AlignmentItem) {
            if (
              child._data?.boundary.start &&
              child._data?.boundary.end &&
              currentTime >= child._data?.boundary.start &&
              currentTime <= child._data?.boundary.end
            ) {
              child.playing = "true";
            } else {
              child.playing = "false";
            }
          }
        });
      }
    });
  }

  /**
   * @param {string} name - The name of the attribute.
   * @param {string} oldValue - The old value of the attribute.
   * @param {string} newValue - The new value of the attribute.
   */
  attributeChangedCallback(name, oldValue, newValue) {
    console.log(name, oldValue, newValue);
    if (oldValue === newValue) {
      return;
    }
  }

  connectedCallback() {}

  disconnectedCallback() {}
}

customElements.define("audio-data-element", AudioDataElement);
