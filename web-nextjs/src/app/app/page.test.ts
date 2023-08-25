import { sendSubscriptionRequest, getCoordsFromLocation, checkUserData } from './page';
import { WeatherNotificationSubscription } from '../../../../common/weather';
import { expect, it } from '@jest/globals';

describe("app/app page.tsx", () => {
  describe('sendRequest', () => {
    let mockFetch : jest.Mock;
    let mockAlert : jest.Mock;

    beforeEach(() => {
      mockFetch = jest.fn();
      global.fetch = mockFetch;

      mockAlert = jest.fn();
      global.window.alert = mockAlert;
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should send a POST request and alert success message when response is ok', async () => {
      const mockRequest : WeatherNotificationSubscription = { 
        email: "test",
        notified_at: null,
        _id: undefined,
        location: "test",
        coords: [1, 2],
        constraints: {
            windDir: ["N"],
            windSpeed: {
                min: 1,
                max: 2
            },
            temperature: {
                min: 1,
                max: 2
            },
            humidity: {
                min: 1,
                max: 2
            },
        },  
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({})
      });

      await sendSubscriptionRequest(mockRequest);

      expect(mockFetch).toHaveBeenCalledWith("http://localhost:8081/api/notificationSub", {
        body: JSON.stringify(mockRequest),
        method: "POST",
        headers: {
          "content-type": "application/JSON"
        }
      });

      expect(mockAlert).toHaveBeenCalledWith("Congrats you are now subscribed!");
    });


    it('should send a POST request and alert error message when response is not ok', async () => {
      const mockRequest : WeatherNotificationSubscription = { 
        email: "test",
        notified_at: null,
        _id: undefined,
        location: "test",
        coords: [1, 2],
        constraints: {
            windDir: ["N"],
            windSpeed: {
                min: 1,
                max: 2
            },
            temperature: {
                min: 1,
                max: 2
            },
            humidity: {
                min: 1,
                max: 2
            },
        },  
        
      };

      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: jest.fn().mockResolvedValue({}) 
      });

      await sendSubscriptionRequest(mockRequest);

      expect(mockFetch).toHaveBeenCalledWith("http://localhost:8081/api/notificationSub", {
        body: JSON.stringify(mockRequest),
        method: "POST",
        headers: {
          "content-type": "application/JSON"
        }
      });

      expect(mockAlert).toHaveBeenCalledWith('404 Not Found');
    });
  });

  describe('getCoordsFromLocation', () => {
    it('should return the correct coordinates', async () => {

      const mockJsonPromise = Promise.resolve([-41.037, 174.885]);
      const mockFetchPromise = Promise.resolve({
        ok: true,
        json: () => mockJsonPromise,  
      });
  
      (global.fetch as jest.Mock) = jest.fn().mockImplementation(() => mockFetchPromise);

      const testLocation = 'Pukerua Bay';

      const result = await getCoordsFromLocation(testLocation);

      expect(result).toEqual([-41.037, 174.885]);
    });

    it('should error correctly when the location is not found', () => {

      const mockErrorFetchPromise = Promise.resolve({
        ok: false, 
        json: () => Promise.reject(), 
      });
      (global.fetch as jest.Mock) = jest.fn().mockImplementation(() => mockErrorFetchPromise);
  
      const testLocation = 'Not a real place';

      expect(getCoordsFromLocation(testLocation)).rejects.toThrow('Could not find location!');
    });

  });

  describe('checkUserData', () => {
    
    let mockAlert : jest.Mock;
    
    beforeEach(() => {
      mockAlert = jest.fn();
      global.window.alert = mockAlert;
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return an alert when the email is empty', () => {
      const mockRequest : WeatherNotificationSubscription = { 
        email: "",
        notified_at: null,
        _id: undefined,
        location: "test",
        coords: [1, 2],
        constraints: {
            windDir: ["N"],
            windSpeed: {
                min: 1,
                max: 2
            },
            temperature: {
                min: 1,
                max: 2
            },
            humidity: {
                min: 1,
                max: 2
            },
        },  
        
      };

      checkUserData(mockRequest);

      expect(mockAlert).toHaveBeenCalledWith('Missing email address!');
    });

    it('should return an alert when the location is empty', () => {
      const mockRequest : WeatherNotificationSubscription = { 
        email: "pt@hi",
        notified_at: null,
        _id: undefined,
        location: "",
        coords: [1, 2],
        constraints: {
            windDir: ["N"],
            windSpeed: {
                min: 1,
                max: 2
            },
            temperature: {
                min: 1,
                max: 2
            },
            humidity: {
                min: 1,
                max: 2
            },
        },  
      };

      checkUserData(mockRequest);

      expect(mockAlert).toHaveBeenCalledWith('Missing location!');
    });

    it('should return an alert when the coordinates are incorrect', () => {
      const mockRequest : WeatherNotificationSubscription = { 
        email: "pt@hi",
        notified_at: null,
        _id: undefined,
        location: "Wellington",
        coords: [1],
        constraints: {
            windDir: ["N"],
            windSpeed: {
                min: 1,
                max: 2
            },
            temperature: {
                min: 1,
                max: 2
            },
            humidity: {
                min: 1,
                max: 2
            },
        },  
      };

      checkUserData(mockRequest);

      expect(mockAlert).toHaveBeenCalledWith('Location not found!');
    });

    describe('checkConstraints', () => {
      it.todo('should check there is at least one constraint');
      it.todo('should check if selected windDir is valid');
      it.todo('should check if selected windSpeed is valid');
      it.todo('should check if selected temperature is valid');
      it.todo('should check if selected humidity is valid');
    });
  })
});