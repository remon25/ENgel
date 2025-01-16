export async function getAddressAutocomplete(query) {
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=a886a320d38547b3b677c82d611d0ca1`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.results && data.results.length > 0) {
    return data.results.map(result => result.formatted);  // Return formatted addresses
  }
  return [];
}
