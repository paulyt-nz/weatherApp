import { describe, it, expect } from '@jest/globals';
import { areConstraintsValid } from './constraintValidation';
import { WeatherConstaint, WindDirection } from '../types/weatherTypes'

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

    it('should return false for invalid wind direction (not a compass bearing)', () => {
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

    it('should return true when just a valid wind direction is provided', () => {
        const constraints : WeatherConstaint = {
            windDir: ["N", "NE"],
            windSpeed: { min: undefined, max: undefined },
            temperature: { min: undefined, max: undefined },
            humidity: { min: undefined, max: undefined }
        }
        const result = areConstraintsValid(constraints);
        expect(result).toEqual(true);
    });

    it('should return true when just a valid wind speed is provided', () => {
        const constraints : WeatherConstaint = {
            windDir: undefined,
            windSpeed: { min: 1, max: 5},
            temperature: { min: undefined, max: undefined },
            humidity: { min: undefined, max: undefined }
        }
        const result = areConstraintsValid(constraints);
        expect(result).toEqual(true);
    });

    it('should return true when just a valid temperature is provided', () => {
        const constraints : WeatherConstaint = {
            windDir: undefined,
            windSpeed: { min: undefined, max: undefined },
            temperature: { min: 10, max: 20 },
            humidity: { min: undefined, max: undefined }
        }
        const result = areConstraintsValid(constraints);
        expect(result).toEqual(true);
    });

    it('should return true when just a valid humidity is provided', () => {
        const constraints : WeatherConstaint = {
            windDir: undefined,
            windSpeed: { min: undefined, max: undefined },
            temperature: { min: undefined, max: undefined },
            humidity: { min: 30, max: 60 }
        }
        const result = areConstraintsValid(constraints);
        expect(result).toEqual(true);
    });
});