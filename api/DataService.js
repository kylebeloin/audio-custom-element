import { mock } from "../mock/mock.js";
import AudioDataModel from "../models/AudioDataModel.js";

export class DataService {
  /**
   *
   * @param {Array<Blob>} audio
   * @returns {Promise<AudioDataModel>}
   */
  static async processAudio(audio) {
    let data = await mock.then((data) => {
      return data;
    });
    return data;

    // const formData = new FormData();
    // audio.forEach((blob) => formData.append("audio", blob));
    // const response = await fetch("http://localhost:5000/align", {
    //   method: "POST",
    //   body: formData,
    // });
    // const json = await response.json();
    // const value = Object.values(json)[0];
    // const model = new AudioDataModel(value);
    // return model;
  }
}
