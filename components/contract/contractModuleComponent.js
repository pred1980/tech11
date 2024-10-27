import { html } from "lit-html";

class ContractModuleComponent {
  constructor(module, onCommentsChange) {
    this.module = module;
    this.onCommentsChange = onCommentsChange;
  }

  render() {
    const handleCommentsInput = (e) => {
      this.module.comments = e.target.value;
      this.onCommentsChange();
    };

    return html`
      <div class="contract-form__group">
        <h3 class="contract-form__subtitle">${this.module.name}</h3>
        <textarea
          @input="${handleCommentsInput}"
          class="contract-form__textarea contract-form__textarea--${this.module.key.toLowerCase()}"
        >
${this.module.comments}</textarea
        >
      </div>
    `;
  }
}

export default ContractModuleComponent;
