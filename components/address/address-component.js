import { render } from "lit-html";
import { addressTemplate } from "./address-template.js";
import { fetchCityByZipCode, fetchStreetsByCity } from "./address-service.js";
import styles from "./address-styles.css?inline";

class AddressComponent extends HTMLElement {
  #zipCode = "";
  #cities = [];
  #hasDistricts = false;
  #streets = [];
  #houseNumber = "";
  #selectedStreet = "";
  #selectedCity = "";
  #selectedDistrict = "";
  #country = "Deutschland";

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `<style>${styles}</style>`;
    this.#updateForm();
  }

  // Handle input changes for zip code, city, street, and house number
  async #handleInput(event) {
    if (event.target.id === "zipCode") {
      this.#zipCode = event.target.value;

      if (this.#zipCode.length < 5) {
        // Clear data if zip code is invalid && < 5 digits
        this.#clearData();
        this.#updateForm();
        return;
      }

      if (this.#zipCode.length === 5) {
        // Fetch cities and districts by zip code
        const { cities, hasDistricts } = await fetchCityByZipCode(
          this.#zipCode
        );

        // Removes duplicates and creates a unique list of city-district combinations
        const uniqueCities = [
          ...new Map(
            cities.map((city) => [`${city.city}-${city.district}`, city])
          ).values(),
        ];

        this.#cities = uniqueCities;
        this.#hasDistricts = hasDistricts;

        // Clear streets and reset selection
        this.#clearStreetData();
        this.#updateForm();
      }
    }

    if (event.target.id === "city") {
      const [city, district = ""] = event.target.value.split("-");
      this.#selectedCity = city;
      this.#selectedDistrict = district;

      // Fetch streets by selected city and district
      this.#streets = await fetchStreetsByCity(this.#zipCode, city, district);

      // No automatic street selection
      this.#selectedStreet = "";
      this.#updateForm();
    }

    if (event.target.id === "street") {
      this.#selectedStreet = event.target.value;
    }

    if (event.target.id === "houseNumber") {
      this.#houseNumber = event.target.value;
    }
  }

  // Handle info button click to display current form data as JSON
  #handleInfoClick() {
    const data = {
      zipCode: this.#zipCode,
      cities: this.#cities,
      selectedStreet: this.#selectedStreet,
      selectedCity: this.#selectedCity,
      selectedDistrict: this.#selectedDistrict,
      houseNumber: this.#houseNumber,
      country: this.#country,
      streets: this.#streets,
    };

    alert(JSON.stringify(data, null, 2));
  }

  // Update the form by re-rendering the template
  #updateForm() {
    render(
      addressTemplate({
        zipCode: this.#zipCode,
        cities: this.#cities,
        hasDistricts: this.#hasDistricts,
        streets: this.#streets,
        street: this.#selectedStreet,
        houseNumber: this.#houseNumber,
        country: this.#country,
        noResults: this.#cities.length === 0 && this.#zipCode.length === 5,
        handleInfoClick: this.#handleInfoClick.bind(this),
      }),
      this.shadowRoot
    );
  }

  // Lifecycle hooks for attaching/removing event listeners
  connectedCallback() {
    this.shadowRoot.addEventListener("input", this.#handleInput.bind(this));
  }

  disconnectedCallback() {
    this.shadowRoot.removeEventListener("input", this.#handleInput.bind(this));
  }

  // Clear all data when zip code is invalid
  #clearData() {
    this.#cities = [];
    this.#streets = [];
    this.#houseNumber = "";
    this.#selectedStreet = "";
    this.#selectedCity = "";
    this.#selectedDistrict = "";
  }

  // Clear street-related data
  #clearStreetData() {
    this.#streets = [];
    this.#houseNumber = "";
    this.#selectedStreet = "";
  }
}

customElements.define("address-component", AddressComponent);

export default AddressComponent;
