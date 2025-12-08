const BASE_URL = "http://localhost:8000";

export const getLocations = async () => {
  try {
    const response = await fetch(`${BASE_URL}/locations`);
    if (!response.ok) {
      throw new Error("Failed to fetch locations");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching locations:", error);
    throw error;
  }
};

export const getPredictions = async (siteId, nodeId, date) => {
  try {
    const url = new URL(`${BASE_URL}/predict/slots`);
    url.searchParams.append("site_id", siteId);
    url.searchParams.append("node_id", nodeId);
    if (date) {
      url.searchParams.append("date", date);
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch predictions");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching predictions:", error);
    throw error;
  }
};
