const template = document.createElement("template");
template.innerHTML = `
    <style>
    :host [name] {
        display: none;
    }
    
    :host [name="data"] {
        display: inline-block;
    }
    
    :host [name="audio"] {
        display: inline-block;
    }
    
    :host :where([stopped], [paused]) + .controls [name="record"] {
        display: inline-block;
    }
    
    :host :where([recording]) + .controls [name="stop"] {
        display: inline-block;
    }
    
    :host .button {
        cursor: pointer;
    }
    
    :host .controls {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 1rem;
    }
    </style>
    <div class="audio-recorder-container">
        <slot name="audio">
        </slot>
        <slot name="state">
        </slot>
        <div class="controls">
            <slot class="button" name="record">
                <button>Record</button>
            </slot>
            <slot class="button" name="stop">
                <button>Stop</button>
            </slot>
        </div>
        <slot name="data">
        </slot>
    </div>
`;

export default template;
