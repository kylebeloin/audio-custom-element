const template = document.createElement("template");
template.innerHTML = `
    <style>
      :host {
        display: grid;
        align-items: center;
        gap: 0.25rem;
      }
      
      :host [name="dialog-content"] {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        padding: 1rem;
        background-color: white;
        border-radius: 0.25rem;
        box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.25);
      }

      :host [name="dialog-content"] a {
        color: var(--blue-4);
        font-size: 0.75rem;
        font-weight: 600;
      }
      
      :host [name="dialog"].hide {
        animation: fade-out 0.25s ease-out forwards;
        pointer-events: none;
      }
      
      :host [name="dialog"].show {
        animation: fade-in 0.25s ease-in;
        pointer-events: all;
      }

      :host .detected {
        color: var(--green-4);
      }

      :host .error {
        color: var(--red-4);
      }


      :host .container {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 1ch;
        text-align: center;
      }
      
      @keyframes fade-in {
        0% {
          opacity: 0;
        }
        100% {
          opacity: 1;
          display: block;
        }
      }
      
      @keyframes fade-out {
        0% {
          opacity: 1;
        }
        100% {
          opacity: 0;
          display: none;
        }
      }
    </style>
    <div name="container" class="dialog-container">
        <div name="dialog" class="dialog" style="position:absolute;margin:0;padding:0;">
            <div name="dialog-content">
            </div>
        </div>
    </div>
`;

export default template;
