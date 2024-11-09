// Define a function to check if Google API is loaded and create the Geocoder instance dynamically
export async function reverseGeoCode(lat: number, lng: number) {
    // Check if Google Maps API is loaded
    if (!window.google || !window.google.maps) {
        console.error("Google Maps API is not loaded.");
        return [];
    }

    // Dynamically create the geocoder instance
    const geocoder = new window.google.maps.Geocoder();
    const latLng = { lat, lng };

    // Wrap geocode in a Promise to handle the async nature of the callback
    return new Promise((resolve, reject) => {
        geocoder.geocode({ location: latLng }, (results, status) => {
            if (status === "OK" && results && results[0]) {
                resolve(results);
            } else {
                console.error("Geocode error:", status);
                resolve([]); // Resolve with an empty array on failure
            }
        });
    });
}
