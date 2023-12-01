// @ts-check
import { template, attributes } from "./index.js";
import { mock } from "../../mock/mock.js";

/**
 * The audio list should:
 * - display a list of audio data
 * - add audio data to the list
 */

/**
 * @class AudioDataList
 * @extends HTMLElement
 * @property {string} data - The data attribute.
 */
export class AudioList extends HTMLElement {
  /**
   * @returns {Array<string>} The observed attributes.
   */
  static get observedAttributes() {
    return Object.values(attributes);
  }

  /**
   * @type {HTMLElement|null}
   * @private
   * */
  _container = null;

  constructor() {
    super();
    // Attach a shadow root to the element.
    const shadowRoot = this.attachShadow({ mode: "open" });
    // Clone the template and append it to the shadow root.
    shadowRoot.append(template.content.cloneNode(true));
    // Get the audio element from the template.
    this._container = shadowRoot.querySelector(".container");
  }

  /**
   * @type {string|null} - data
   */
  get data() {
    return this.getAttribute("data");
  }

  set data(value) {
    if (value === null) {
      this.removeAttribute("data");
    } else {
      this.setAttribute("data", value);
    }
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

  connectedCallback() {
    console.log("connectedCallback");
    mock.then((data) => {
      this.data = data.filename;
    });
  }

  /**
   * @param {import('../audio-data-element/element.js').AudioDataElement} element - The name of the attribute.
   */
  addAudioDataToList(element) {
    if (this._container === null) {
      throw new Error("Container is null");
    }
    this._container.appendChild(element);
  }

  disconnectedCallback() {}
}

customElements.define("audio-list", AudioList);
