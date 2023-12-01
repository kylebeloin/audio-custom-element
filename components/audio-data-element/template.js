const template = document.createElement("template");
template.innerHTML = `
    <style>
    :host [name="alignment-items"] {
        display: flex;
        flex-wrap: wrap;
        max-width: 100vw;
    }
    
    :host .audio-player-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 1rem;
    }
    </style>
    <div class="audio-player-container">
        <audio controls></audio>
        <slot name="alignment-items">
        </slot>
    </div>
`;

export default template;
