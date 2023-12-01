/**
 * @typedef WhisperAlignment - Used in WhisperData 
 * @property {string} word - Text of the word
 * @property {number} start - Start time of the word
 * @property {number} end - End time of the word
 * @property {number} prominence_strength - Strength of the prominence
 * @property {number} boundary_strength - Strength of the boundary
 * @property {number} [score] - Score of the word
 * @property {number} [start_ind] - Start index of the word
 * @property {number} [end_ind] - End index of the word
 * @property {string} [g2p_word] - Grapheme to phoneme word
 * @property {string} [canonical_phns_align] - Canonical phonemes alignment
 * @property {string} [recognized_phns_align] - Recognized phonemes alignment
 * @property {number} [n_err_phns] - Number of error phonemes
 * @property {number} [phn_error_rate] - Recognized phonemes
 * /

/**
 * @typedef WhisperData - A generic object 
 * @property {string} wav - The sound file.
 * @property {string} whisperx_text - The text of the sound file.
 * @property {Array<WhisperAlignment>} whisperx_alignment - The alignment of the sound file.
 * @property {Array<string>} g2p_norm_no_blank - The g2p norm no blank of the sound file.
 */

/**
 * @typedef AudioDataBoundary
 * @property {number} start - The start time.
 * @property {number} end - The end time.
 * @property {number} strength - The strength.
 * @property {[number, number]} idx - The index of the boundary, if applicable.
 */

/**
 * @typedef AudioDataPhoneme
 * @property {string} g2p - The grapheme to phoneme.
 * @property {string} target - The canonical phoneme.
 * @property {string} detected - The recognized phoneme.
 * @property {number} error - The error rate.
 * @property {number} numErrors - The number of errors.
 */

/**
 * @typedef AudioDataAlignment
 * @property {string} word - The word.
 * @property {AudioDataBoundary} boundary - The boundary.
 * @property {number} prominence - The prominence.
 * @property {string} link - The link to the wordreference dictionary.
 * @property {number} [score] - The score.
 * @property {AudioDataPhoneme} [phoneme] - The phoneme.
 */

/**
 * @typedef AudioData
 * @property {string} filename - The filename.
 * @property {string} text - The text.
 * @property {Array<AudioDataAlignment>} alignment - The alignment.
 */

/**
 * @extends AudioData
 */
class AudioDataModel {
  /**
   * @type {string} - The filename.
   */
  filename = "";

  /**
   * @type {string} - The text.
   */
  text = "";

  /**
   * @type {Array<AudioDataAlignment>} - The alignment.
   */
  alignment = [];

  /**
   * @param {WhisperData} data - The audio data.
   */
  constructor(data) {
    this.filename = data.wav;
    this.text = data.whisperx_text;
    this.alignment = data.whisperx_alignment.map(
      AudioDataModel.createAlignment
    );
    if (this.alignment.length > 0) {
      // Check if first or last alignment is a pause.
      if (!AudioDataModel.isWord(this.alignment[0])) {
        this.alignment.shift();
      }
      if (!AudioDataModel.isWord(this.alignment[this.alignment.length - 1])) {
        this.alignment.pop();
      }
    }
  }

  /**
   * @param {AudioDataAlignment} alignment - The alignment.
   * @returns {boolean} - Whether the audio data is a pause.
   */
  static isPause(alignment) {
    return alignment.word === "pau";
  }

  /**
   * @param {AudioDataAlignment} alignment - The alignment.
   * @returns {boolean} - Whether the audio data is a word.
   */
  static isWord(alignment) {
    return !AudioDataModel.isPause(alignment) && alignment.word !== "sil";
  }

  /**
   * @static
   * @param {WhisperAlignment} data - The audio data.
   * @returns {AudioDataAlignment} - The audio data alignment.
   */
  static createAlignment(data) {
    /**
     * @type {AudioDataBoundary} - The boundary.
     */
    let boundary;

    /**
     * @type {AudioDataPhoneme|undefined} - The phoneme.
     */
    let phoneme;

    boundary = {
      start: data.start,
      end: data.end,
      strength: data.boundary_strength,
      idx: [data?.start_ind ?? -1, data?.end_ind ?? -1],
    };

    if (
      data.g2p_word !== undefined &&
      data.canonical_phns_align !== undefined &&
      data.recognized_phns_align !== undefined &&
      data.phn_error_rate !== undefined &&
      data.n_err_phns !== undefined
    ) {
      phoneme = {
        g2p: data.g2p_word,
        target: data.canonical_phns_align,
        detected: data.recognized_phns_align,
        error: data.phn_error_rate,
        numErrors: data.n_err_phns,
      };
    }
    // replace any punctuation with an empty string
    const link = `https://www.wordreference.com/definition/${data.word.replace(
      /[^a-zA-Z ]/g,
      ""
    )}`;

    return {
      word: data.word,
      link,
      boundary,
      prominence: data.prominence_strength,
      score: data.score,
      phoneme,
    };
  }
}

export default AudioDataModel;
