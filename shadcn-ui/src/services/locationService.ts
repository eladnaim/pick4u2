interface LocationCoordinates {
  lat: number;
  lng: number;
}

interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface GeocodeResult {
  address_components: AddressComponent[];
  formatted_address: string;
  geometry: {
    location: LocationCoordinates;
  };
}

class LocationService {
  private static instance: LocationService;
  private isGoogleMapsLoaded = false;

  constructor() {
    // Initialize Google Maps if API key is available
    this.initializeGoogleMaps();
  }

  static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  private async initializeGoogleMaps(): Promise<void> {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey || apiKey === 'demo-key') {
      console.log('Google Maps API key not provided, using mock functions');
      return;
    }

    try {
      // Dynamically load Google Maps
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        this.isGoogleMapsLoaded = true;
        console.log('Google Maps loaded successfully');
      };
      
      script.onerror = () => {
        console.error('Failed to load Google Maps');
      };
      
      document.head.appendChild(script);
    } catch (error) {
      console.error('Error initializing Google Maps:', error);
    }
  }

  // Get current position using browser geolocation
  async getCurrentPosition(): Promise<LocationCoordinates> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    });
  }

  // Geocode address to coordinates
  async geocodeAddress(address: string): Promise<LocationCoordinates | null> {
    if (!this.isGoogleMapsLoaded) {
      return this.mockGeocodeAddress(address);
    }

    try {
      // Use Google Maps Geocoding API
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
      );
      
      const data = await response.json();
      
      if (data.status === 'OK' && data.results && data.results[0]) {
        const location = data.results[0].geometry.location;
        return {
          lat: location.lat,
          lng: location.lng
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error geocoding address:', error);
      return this.mockGeocodeAddress(address);
    }
  }

  // Reverse geocode coordinates to address
  async reverseGeocode(coordinates: LocationCoordinates): Promise<string | null> {
    if (!this.isGoogleMapsLoaded) {
      return this.mockReverseGeocode(coordinates);
    }

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinates.lat},${coordinates.lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
      );
      
      const data = await response.json();
      
      if (data.status === 'OK' && data.results && data.results[0]) {
        return data.results[0].formatted_address;
      }
      
      return null;
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return this.mockReverseGeocode(coordinates);
    }
  }

  // Calculate distance between two points
  async calculateDistance(
    origin: LocationCoordinates,
    destination: LocationCoordinates
  ): Promise<number | null> {
    if (!this.isGoogleMapsLoaded) {
      return this.mockCalculateDistance(origin, destination);
    }

    try {
      // Use Distance Matrix API
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.lat},${origin.lng}&destinations=${destination.lat},${destination.lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
      );
      
      const data = await response.json();
      
      if (data.status === 'OK' && data.rows[0].elements[0].status === 'OK') {
        const distance = data.rows[0].elements[0].distance.value; // in meters
        return distance / 1000; // convert to kilometers
      }
      
      return null;
    } catch (error) {
      console.error('Error calculating distance:', error);
      return this.mockCalculateDistance(origin, destination);
    }
  }

  // Mock functions for when Google Maps is not available
  async mockGetCurrentPosition(): Promise<LocationCoordinates> {
    // Return Tel Aviv coordinates as default
    return {
      lat: 32.0853,
      lng: 34.7818
    };
  }

  async mockGeocodeAddress(address: string): Promise<LocationCoordinates | null> {
    // Mock geocoding - return coordinates based on Israeli cities
    const israelBounds = {
      north: 33.3,
      south: 29.5,
      east: 35.9,
      west: 34.2
    };

    // Simple mapping for major cities
    const cityCoordinates: { [key: string]: LocationCoordinates } = {
      'תל אביב': { lat: 32.0853, lng: 34.7818 },
      'ירושלים': { lat: 31.7683, lng: 35.2137 },
      'חיפה': { lat: 32.7940, lng: 34.9896 },
      'באר שבע': { lat: 31.2518, lng: 34.7913 },
      'נתניה': { lat: 32.3215, lng: 34.8532 },
      'אשדוד': { lat: 31.8044, lng: 34.6553 },
      'פתח תקווה': { lat: 32.0879, lng: 34.8878 },
      'ראשון לציון': { lat: 31.9730, lng: 34.8066 }
    };

    // Check if address contains a known city
    for (const [city, coords] of Object.entries(cityCoordinates)) {
      if (address.includes(city)) {
        return coords;
      }
    }

    // Return random coordinates in Israel if no match
    return {
      lat: Math.random() * (israelBounds.north - israelBounds.south) + israelBounds.south,
      lng: Math.random() * (israelBounds.east - israelBounds.west) + israelBounds.west
    };
  }

  async mockReverseGeocode(coordinates: LocationCoordinates): Promise<string> {
    // Simple mock reverse geocoding
    return `כתובת מוערכת ליד ${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(4)}`;
  }

  async mockCalculateDistance(
    origin: LocationCoordinates,
    destination: LocationCoordinates
  ): Promise<number> {
    // Simple distance calculation using Haversine formula
    const R = 6371; // Earth's radius in kilometers
    const dLat = (destination.lat - origin.lat) * Math.PI / 180;
    const dLng = (destination.lng - origin.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(origin.lat * Math.PI / 180) * Math.cos(destination.lat * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // Get nearby places (mock implementation)
  async searchNearbyPlaces(
    location: LocationCoordinates,
    radius: number = 5000,
    type: string = 'establishment'
  ): Promise<any[] | null> {
    // Mock nearby places
    return [
      {
        name: 'דואר ישראל - סניף מרכז',
        vicinity: 'רחוב הרצל 123',
        rating: 4.2,
        types: ['post_office']
      },
      {
        name: 'סופר פארם',
        vicinity: 'רחוב דיזנגוף 45',
        rating: 4.5,
        types: ['pharmacy']
      },
      {
        name: 'בנק הפועלים',
        vicinity: 'רחוב אלנבי 78',
        rating: 3.8,
        types: ['bank']
      }
    ];
  }

  // Check if Google Maps is loaded
  isGoogleMapsAvailable(): boolean {
    return this.isGoogleMapsLoaded;
  }
}

export default LocationService;