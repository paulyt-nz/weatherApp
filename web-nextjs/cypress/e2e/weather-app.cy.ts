import { WeatherNotificationSubscription } from "../../../common/weather";

describe('Weather App', () => {
  describe('/app', () => {

    beforeEach(() => {
      cy.visit('http://localhost:3000/app')

      cy.intercept('POST', 'http://localhost:8081/api/notificationSub', {
        statusCode: 200,
        body: 'it worked!'
      }).as('postSubscription')

      cy.intercept('GET', 'http://localhost:8081/api/coords*', {
        statusCode: 200,
        body: [-41.037, 174.885]
      }).as('getCoords')
    })

    it('should submit a valid form', () => {
        cy.get('#email').type('hello@paulyt')
        cy.get('#location').type('Pukerua Bay')

        cy.get('#N').check()
        cy.get('#S').check()
        cy.get('#windSpeedMin').type('10')
        cy.get('#windSpeedMax').type('20')
        cy.get('#tempMin').type('10')
        cy.get('#tempMax').type('20')
        cy.get('#humidityMin').type('10')
        cy.get('#humidityMax').type('20')

        cy.get('#submit').click()

        cy.get('.success-message').should('be.visible');
        
        cy.wait('@postSubscription')
          .then((interception) => {
            if (interception && interception.response) {
                assert.equal(interception.response.statusCode, 200);
            } 
            else {
                assert.fail("Interception or response was undefined");
            } 
          
            if (interception && interception.request) {

              const request = interception.request.body as WeatherNotificationSubscription;

              assert.equal(request.email, 'hello@paulyt');
              assert.equal(request.location, 'Pukerua Bay');
              assert.deepEqual(request.coords, [-41.037, 174.885]);
              assert.equal(request.notified_at, null);
              assert.equal(request._id, undefined);

              assert.deepEqual(request.constraints.windDir, ['N', 'S']);
              assert.deepEqual(request.constraints.windSpeed, { min: 10, max: 20 });
              assert.deepEqual(request.constraints.temperature, { min: 10, max: 20 });
              assert.deepEqual(request.constraints.humidity, { min: 10, max: 20 });

            } 
            else {
                assert.fail("Interception or request was undefined");
            }
        })
          
    })
  });

  describe('/', () => {
    it('should navigate to the main app page when enter is clicked', () => {
      cy.visit('http://localhost:3000/')
   
      cy.get('#enter').click()
  
      cy.url().should('include', '/app')

      cy.get('#constraint-legend').contains('Enter your constraints')
    })
  });
});
