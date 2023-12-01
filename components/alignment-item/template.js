const template = document.createElement("template");
template.innerHTML = `
    <style>
        @import "./components/alignment-item/styles.css";
    </style>
    <div tabindex="0" name="item" class="alignment-item-container">
    </div>
`;

export default template;
