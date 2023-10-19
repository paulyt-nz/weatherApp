process.env.MAILGUN = 'test-api-key';
process.env.MAILGUN_DOMAIN = 'test-domain';

import { checkNotifiedToday, createNotification, sendNotification } from './notificationFunctions'
import { expect, jest, test, it, describe, beforeAll, afterEach } from '@jest/globals';
import { WeatherNotificationSubscription, Weather } from '../common/weatherTypes'

jest.mock('mailgun.js');

describe('notificationFunctions', () => {
    describe('checkNotifiedToday()', () => {
        it("should be true if time notified_at is within the last 24 hours", () =>{
            
            const request : WeatherNotificationSubscription = {
                location: 'alskdjflkajsdf',
                email: 'alskdjflkajsdf',
                coords: [0,0],
                constraints: {
                    windDir: ['N'],
                    windSpeed: { min: 10, max: 20 },
                    temperature: { min: 10, max: 20 },
                    humidity: { min: 10, max: 20 },
                },
                notified_at: new Date(1989, 6, 7),
                _id: undefined
            };
            
            jest.useFakeTimers();
            jest.setSystemTime(new Date(615812400000))          // 23 hours after the date in request.notified_at
            
            const result = checkNotifiedToday(request)

            expect(result).toBe(true)
        })

        it("should be false if time notified_at is outside the last 24 hours", () =>{
            
            const request : WeatherNotificationSubscription = {
                location: 'alskdjflkajsdf',
                email: 'alskdjflkajsdf',
                coords: [0,0],
                constraints: {
                    windDir: ['N'],
                    windSpeed: { min: 10, max: 20 },
                    temperature: { min: 10, max: 20 },
                    humidity: { min: 10, max: 20 },
                },
                notified_at: new Date(1989, 6, 7),
                _id: undefined
            };

            jest.useFakeTimers();
            jest.setSystemTime(new Date(615819600000))          // 25 hours after the date in request.notified_at 
            
            const result = checkNotifiedToday(request)
            
            expect(result).toBe(false)
        })
    });

    describe('createNotification()', () => {
        test("should return the correct notification for a given weather and request", () =>{
            const testWeather: Weather= {
                windSpeed: 5,
                temperature: 20,
                humidity: 33,
                windDir: 'N'
            }

            const testRequest: WeatherNotificationSubscription = {
                location: 'Mollys House',
                coords: [123, 456],
                constraints:{
                    windDir: ['N'],
                    windSpeed: { min: 0, max: 10 },
                },
                email: 'molly@mollystuff.co.nz',
                notified_at: null,
                _id: undefined,
            };

            const result = createNotification(testWeather, testRequest);

            expect(result).toBe("Looks like the weather at Mollys House is just what you were after!")
        })    
    });

    describe('sendNotification()', () => {
        it.todo('should call the mailgun client with the correct parameters')
    });
});