const template = document.createElement("template");
template.innerHTML = `
    <style>
        @import "./components/audio-data-element/styles.css";
    </style>
    <div class="audio-player-container">
        <audio controls></audio>
        <slot name="alignment-items">
        </slot>
    </div>
`;

export default template;
