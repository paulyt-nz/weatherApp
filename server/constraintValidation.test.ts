import { describe, it, expect } from '@jest/globals';
import { areConstraintsValid } from './constraintValidation';
import { WeatherConstaint, WindDirection } from '../common/weatherTypes'

describe('areConstraintsValid()', () => {
    it('should return true for valid constraints', () => {
        const constraints : WeatherConstaint = {
            windDir: ["N", "NE", "E", "SE", "S", "SW", "W", "NW"],
            windSpeed: { min: 5, max: 10 },
            temperature: { min: 10, max: 20 },
            humidity: { min: 30, max: 40 }
        }
        const result = areConstraintsValid(constraints);
        expect(result).toEqual(true);
    });

    it('should return false for invalid wind direction (min > max)', () => {
        const constraints : WeatherConstaint = {
            windDir: ["N", "invalid"] as WindDirection[],
            windSpeed: { min: 5, max: 10 },
            temperature: { min: 10, max: 20 },
            humidity: { min: 30, max: 40 }
        }
        const result = areConstraintsValid(constraints);
        expect(result).toEqual(false);
    });

    it('should return false for invalid wind speed (min > max)', () => {
        const constraints : WeatherConstaint = {
            windDir: ["N", "NE"],
            windSpeed: { min: 10, max: 5 },
            temperature: { min: 10, max: 20 },
            humidity: { min: 30, max: 40 }
        }
        const result = areConstraintsValid(constraints);
        expect(result).toEqual(false);
    });

    it('should return false for invalid temperature (min > max)', () => {
        const constraints : WeatherConstaint = {
            windDir: ["N", "NE"],
            windSpeed: { min: 5, max: 10 },
            temperature: { min: 20, max: 10 },
            humidity: { min: 30, max: 40 }
        }
        const result = areConstraintsValid(constraints);
        expect(result).toEqual(false);
    });

    it('should return false for invalid humidity (min > max)', () => {
        const constraints : WeatherConstaint = {
            windDir: ["N", "NE"],
            windSpeed: { min: 5, max: 10 },
            temperature: { min: 10, max: 20 },
            humidity: { min: 40, max: 30 }
        }
        const result = areConstraintsValid(constraints);
        expect(result).toEqual(false);
    });
});