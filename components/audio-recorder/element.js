import { template, state, attributes } from "./index.js";
import { AudioList } from "../audio-data-list/element.js";
import { AudioDataElement } from "../audio-data-element/element.js";
import { DataService } from "../../api/DataService.js";

/**
 * @class AudioRecorder
 * @extends HTMLElement
 * @property {string} state
 */
export class AudioRecorder extends HTMLElement {
  /**
   * @returns {Array<string>} The observed attributes.
   */
  static get observedAttributes() {
    return Object.values(attributes);
  }

  /**
   * @type {import('../audio-data-element/index.js').AudioDataElement|null}
   * @private
   */
  _audioElement = null;

  /**
   * @type {HTMLButtonElement|null}
   * @private
   */
  _recordButton = null;

  /**
   * @type {HTMLButtonElement|null}
   * @private
   * */
  _stopButton = null;

  /**
   * @type {import('../audio-data-list/index.js').AudioList|null}
   * @private
   */
  _audioList = null;

  /**
   * @type {HTMLSlotElement|null}
   */
  _audioSlot = null;

  /**
   * @type {HTMLSlotElement|null}
   */
  _stateSlot = null;

  /**
   * @type {Array<Blob>}
   * @private
   */
  _chunks = [];

  /**
   * @type {Array<BlobEvent>}
   * @private
   */
  _events = [];

  /**
   *
   */

  constructor() {
    super();
    // Attach a shadow root to the element.
    const shadowRoot = this.attachShadow({ mode: "open" });
    // Clone the template and append it to the shadow root.
    shadowRoot.append(template.content.cloneNode(true));
    // Get the audio element from the template.
    if (this.shadowRoot === null) {
      throw new Error("Shadow root is null");
    }

    this._audioSlot = this.shadowRoot.querySelector("[name=audio]");
    /**
     * These are taken from the template to allow for custom stop/recording buttons.
     */
    this._recordButton = this.shadowRoot.querySelector("[name=record]");
    this._stopButton = this.shadowRoot.querySelector("[name=stop]");

    /**
     * Custom element for displaying a list of audio data.
     */
    this._audioList = new AudioList();
    this._stateSlot = this.shadowRoot.querySelector("[name=state]");

    this.shadowRoot.append(this._audioList);
  }

  /**
   * @param {(import("./props/attributes.js").attribute)} name - The name of the attribute.
   * @param {string} oldValue - The old value of the attribute.
   * @param {string} newValue - The new value of the attribute.
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue || !Object.values(attributes).includes(name)) {
      return;
    }

    switch (name) {
      case attributes.STATE:
        if (this._stateSlot && newValue) {
          this._stateSlot.removeAttribute(oldValue);
          this._stateSlot.setAttribute(newValue, "");
        }
        break;
      default:
        break;
    }
  }

  get state() {
    return this.getAttribute(attributes.STATE);
  }

  set state(value) {
    if (value) this.setAttribute(attributes.STATE, value);
  }

  /**
   *
   * @param {MediaStream} stream
   * @returns {void}
   */
  onSuccess = (stream) => {
    {
      const mediaRecorder = new MediaRecorder(stream);

      if (this._recordButton && this._stopButton) {
        this._recordButton.addEventListener("click", (e) => {
          mediaRecorder.start();
        });

        this._stopButton.addEventListener("click", () => {
          mediaRecorder.stop();
        });
      }
      mediaRecorder.addEventListener("start", () => {
        this.state = state.RECORDING;
        this._chunks = [];
        this._events = [];
      });

      mediaRecorder.addEventListener("stop", () => {
        this.state = state.STOPPED;
      });

      mediaRecorder.onstop = async (e) => {
        const blob = new Blob(this._chunks, { type: "audio/mp3" });
        const audioURL = window.URL.createObjectURL(blob);
        this.src = audioURL;
        await this.handleAudioRecorded();
      };

      mediaRecorder.ondataavailable = (e) => {
        this._chunks.push(e.data);
        this._events.push(e);
      };

      this.state = state.STOPPED;
    }
  };

  onError = (err) => {
    console.log("The following error occured: " + err);
  };

  connectedCallback() {
    if (navigator.mediaDevices) {
      const constraints = {
        audio: {
          autoGainControl: true, // chrome likes true -- safari like false
          echoCancellation: true, // chrome likes false -- safari likes true
          noiseSuppression: false,
        },
      };

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(this.onSuccess, this.onError);
    }
  }

  onStateChange = (e) => {
    const state = e.target.state;
    switch (state) {
      case "playing":
        this.state = state.PLAYING;
        break;
      case "paused":
        this.state = state.PAUSED;
        break;
      case "error":
        this.state = state.ERROR;
        break;
      default:
        break;
    }
  };

  /**
   * When the audio is recorded, this method is called to add a new audio element to the list.
   * @returns {Promise<void>}
   */
  handleAudioRecorded = async () => {
    if (this._audioList && this._chunks) {
      let audio = await DataService.processAudio(this._chunks);
      let audioElement = new AudioDataElement(audio);
      if (this._audioElement && this._audioElement._data) {
        this._audioList.addAudioDataToList(
          new AudioDataElement(this._audioElement._data)
        );
        this._audioSlot?.removeChild(this._audioElement);
        this._audioElement = null;
      }
      this._audioElement = audioElement;
      this._audioSlot?.appendChild(this._audioElement);
    }
  };

  disconnectedCallback() {
    if (this._recordButton && this._stopButton) {
    }
  }
}

customElements.define("audio-recorder", AudioRecorder);
