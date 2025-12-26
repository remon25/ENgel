export async function getAddressAutocomplete(query) {
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=65cb07d07721438bb8516dfa12653d6c`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.results && data.results.length > 0) {
    // Map results to include both the formatted address and country
    return data.results.map(result => ({
      formatted: result.formatted,
      country: result.components.country, // Extract the country
    }));
  }
  return [];
}
