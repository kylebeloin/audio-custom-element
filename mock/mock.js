import AudioDataModel from "../models/AudioDataModel.js";

export const mock = fetch("./mock/mock.json")
  .then((response) => response.json())
  .then((json) => {
    const value = Object.values(json)[0];
    const model = new AudioDataModel(value);
    return model;
  });
