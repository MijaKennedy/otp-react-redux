

const CARBON_INTENSITY_DEFAULTS = {
    walk: 0.026,
    bicycle: 0.017,
    car: 0.162,
    tram: 0.066,
    subway: 0.066,
    rail: 0.066,
    bus: 0.09,
    ferry: 0.082,
    cable_car: 0.021,
    gondola: 0.021,
    funicular: 0.066,
    transit: 0.066,
    leg_switch: 0,
    airplane: 0.382,
    micromobility: 0.095,
  };
  
/**
 * @param {Object} itinerary OTP trip itinerary, only legs is required.
 * @param {Object} carbonIntensity carbon intensity by mode in grams/meter
 * @param {string} units units to be used in return value
 * @returns {number}  Amount of carbon in chosen unit
 */
  export function calculateEmissions(
    itinerary,
    carbonIntensity = {},
    units
  ) { // Apply defaults for any values that we don't have.
        const carbonIntensityWithDefaults = {
        ...CARBON_INTENSITY_DEFAULTS,
        ...carbonIntensity,
    };
  
    // Distance is in meters, totalCarbon is in grams
    const totalCarbon =
      (itinerary?.legs?.reduce((total, leg) => {
        // console.log("leg " + leg.mode + "  distance: "  +leg.distance);
        // console.log("carbon Intensity " + carbonIntensityWithDefaults[leg.mode.toLowerCase()]);
        return (
          (leg.distance * carbonIntensityWithDefaults[leg.mode.toLowerCase()] ||
            0) + total
        );
      }, 0) || 0);
    const carCarbon = 
      (itinerary?.legs?.reduce((total, leg) => {
        // console.log("leg " + leg.mode + "  distance: "  +leg.distance);
        return (
          (leg.distance * 0.162 ||
            0) + total
        );
      }, 0) || 0);
    const relCarbon = 
      carCarbon-totalCarbon; // amount of carbon less than having driven a car by self
      // totalCarbon; // total amount of carbon produced
    console.log(relCarbon);
    switch (units) {
      case 'ounce':
        return relCarbon / 28.35;
      case 'kilogram':
        return relCarbon / 1000;
      case 'pound':
        return relCarbon / 454;
      case 'gram':
      default:
        return relCarbon;
    }
  }
