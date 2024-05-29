# Adventure Alarm

Adventure Alarm is a simple weather alarm app that sends you an email when the weather hits the contraints that you set in a particular location.

We set it up as a fun project to practise what I had learned so far and had the help of a mentor to do code reviews and provide feedback. You can look through the comments of the old PRs to see the feedback and how I implemented it if you wish.

The app is up and running at [www.adventurealarm.com](www.adventurealarm.com).

## Frontend

The front end uses the following technologies:

-   Next.js (React)
-   Tailwind CSS for styles
-   Jest for unit testing
-   Cypress for end to end testing

This is deployed at [www.adventurealarm.com](www.adventurealarm.com) and you can see the code in the `web-nextjs` folder.

## Backend

The server is a light api that handle the submission of the form to the database. It use the following technologies:

-   Node.js
-   Express
-   MongoDB
-   Jest for unit testing
-   Winston for logging
-   MAPBOX API to get the coordinates of the location that the user inputs

This api is deployed using Render and you can see the code in the `server` folder.

## Notification Service

The notification server polls through the submissions in the database and checks them against the current weather from the weather API. If the weather is as the user set it up, it sends an email to the user.

It uses the following technologies:

-   Node.js
-   MongoDB
-   Jest for unit testing
-   Winston for logging
-   OpenWeatherMap API to get the weather
-   Mailgun API to send the emails

This service is deployed on an old laptop I have turned into a home server and you can see the code in the `notification-service` folder.
