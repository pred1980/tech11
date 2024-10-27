import { html, render } from "lit-html";
import ContractModuleComponent from "./contractModuleComponent.js";

class ContractUI {
  #dataModel;

  constructor() {
    this.#dataModel = {
      contract: {
        administrativeData: {
          validFrom: "2021-01-01",
        },
        contractModules: {
          HOUSEHOLD: {
            key: "HOUSEHOLD",
            name: "Household Contents",
            comments: "The flat of the policy holder is 100 square meters",
          },
          BICYCLE: {
            key: "BICYCLE",
            name: "Bicycle",
            comments:
              "The policyholder is happy to insure his new E-Bike also within the contract",
          },
        },
      },
    };

    this.#updateUI();
  }

  #updateUI() {
    const modules = Object.values(this.#dataModel.contract.contractModules).map(
      (module) => {
        const component = new ContractModuleComponent(
          module,
          this.#updateUI.bind(this)
        );
        return component.render();
      }
    );

    const template = html`
      <div class="contract-form">
        <div>
          <h2 class="contract-form__title">Administrative Data</h2>
          <div class="contract-form__group">
            <label class="contract-form__label">
              Valid From:
              <input
                type="date"
                .value="${this.#dataModel.contract.administrativeData
                  .validFrom}"
                @input="${this.#handleValidFromInput}"
                class="contract-form__input contract-form__input--valid-from"
              />
            </label>
          </div>

          <h2 class="contract-form__title">Contract Modules</h2>
          ${modules}
        </div>
        <div>
          <h2 class="contract-form__title">Debug</h2>
          <pre class="contract-form__debug">
              ${JSON.stringify(this.#dataModel, null, 2)}
          </pre
          >
        </div>
      </div>
    `;

    render(template, document.body);
  }

  #handleValidFromInput = (e) => {
    this.#dataModel.contract.administrativeData.validFrom = e.target.value;
    this.#updateUI();
  };
}

export default ContractUI;
