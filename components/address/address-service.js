const fetchData = async (params) => {
  const url = `https://cors-anywhere.herokuapp.com/https://www.postdirekt.de/plzserver/PlzAjaxServlet`;

  try {
    const response = await fetch(`${url}?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error during the request:", error);
    return null;
  }
};

// Function to map the rows from the API response based on the type (city or streets)
const mapRows = (data, type) => {
  if (!data || !data.rows || data.rows.length === 0) {
    if (type === "city") {
      return { cities: [], hasDistricts: false };
    } else if (type === "streets") {
      return [];
    }
  }

  if (type === "city") {
    const hasDistricts = data.rows.some((row) => row.district !== "");
    const cities = data.rows.map((row) => ({
      city: row.city,
      district: row.district || null,
    }));

    return { cities, hasDistricts };
  } else if (type === "streets") {
    const streets = data.rows.map((row) => row.street);
    return streets;
  }

  return [];
};

// Fetch cities based on the zip code
export const fetchCityByZipCode = async (zipCode) => {
  const params = new URLSearchParams({
    finda: "city",
    city: zipCode,
    lang: "de_DE",
  });

  const data = await fetchData(params);

  return mapRows(data, "city");
};

export const fetchStreetsByCity = async (zipCode, city, district) => {
  const params = new URLSearchParams({
    finda: "streets",
    plz_plz: zipCode,
    plz_city: city,
    plz_district: district,
    lang: "de_DE",
  });

  const data = await fetchData(params);
  return mapRows(data, "streets");
};
