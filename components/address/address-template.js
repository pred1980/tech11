import { html } from "lit-html";

export const addressTemplate = ({
  zipCode,
  cities,
  hasDistricts,
  streets,
  houseNumber,
  country,
  noResults,
  handleInfoClick,
}) => html`
  <div class="address-form">
    <h3 class="address-form__title">Adresse</h3>

    <div class="address-form__group">
      <label for="zipCode" class="address-form__label">PLZ</label>
      <input
        type="text"
        id="zipCode"
        name="zipCode"
        value="${zipCode}"
        class="address-form__input address-form__input--zipcode"
        maxlength="5"
        type="number"
        placeholder="PLZ eingeben"
      />
      <label for="city" class="address-form__label">
        ${hasDistricts ? "Stadt- Ortsteil" : "Stadt"}
      </label>
      <select
        id="city"
        name="city"
        class="address-form__input address-form__input--city"
        ?disabled="${cities.length === 0}"
      >
        ${cities.length > 0
          ? html`<option value="" disabled selected>Bitte wählen</option>`
          : ""}
        ${cities.map((city) =>
          hasDistricts
            ? html`<option value="${city.city}-${city.district}">
                ${city.city} - ${city.district}
              </option>`
            : html`<option value="${city}">${city}</option>`
        )}
      </select>
    </div>

    <div class="address-form__group">
      <label for="street" class="address-form__label">Straße</label>
      <select
        id="street"
        name="street"
        class="address-form__input address-form__input--street"
        ?disabled="${streets.length === 0}"
      >
        ${streets.length > 0
          ? html`<option value="" disabled selected>Bitte wählen</option>`
          : ""}
        ${streets.map(
          (street) => html`<option value="${street}">${street}</option>`
        )}
      </select>
      <label for="houseNumber" class="address-form__label">Hausnummer</label>
      <input
        type="text"
        id="houseNumber"
        name="houseNumber"
        value="${houseNumber}"
        class="address-form__input address-form__input--house-number"
      />
    </div>

    <div class="address-form__group">
      <label for="country" class="address-form__label">Land</label>
      <input
        type="text"
        id="country"
        name="country"
        value="${country}"
        class="address-form__input address-form__input--country"
        disabled
      />
    </div>

    ${noResults
      ? html`<h2 class="address-form__no-results">
          Es gibt keine Ergebnisse zu der Postleitzahl ${zipCode}
        </h2>`
      : ""}

    <div class="address-form__group">
      <button @click=${handleInfoClick} class="info-button">&#x2139;</button>
    </div>
  </div>
`;
