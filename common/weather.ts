import type {ObjectId} from 'mongodb';

export type WindDirection = "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW";

export type WeatherConstaint = {
    windDir: WindDirection[];

    windSpeed?: { min?: number; max?: number };

    temperature?: { min?: number; max?: number };

    humidity?: { min?: number; max?: number };
};

export type WeatherNotificationSubscription = {
    location: string;

    coords: number[] | null;

    constraints: WeatherConstaint;

    email: string;

    notified_at: Date | null;

    _id: ObjectId | undefined;
};

export type Weather = {
    windSpeed: number;
    temperature: number;
    humidity: number;
    windDir: WindDirection;
};