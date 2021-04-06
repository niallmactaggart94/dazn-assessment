# DAZN Assessment Frontend

Angular front end built for the DAZN assessment.

## Overview
The front end has two routes:
- Home Page: Landing page that will have a basic form to handle User ID, it will also have the ability to show the current streams
  being viewed by a user.
- Watch: Will show the video stored on the backend if there are enough streams left  

The application uses bootstrap, which helps with mobile design.

## Running the application
To start the application you will need to run
```
npm install
npm run start
```
This will start the application on port 4200. You will then be able to view this on your browser via https://localhost:4200.


## Testing
The following commands can be run to test the application. Unit tests are run in Jest, and the code styling is done using ESLint.
```
Code stying - npm run lint
Unit testing - npm run test
```

## Potential Improvements
If I had more time I would look to fix/improve the following:

- **Add login route** - Route to handle all logins which would give the user a Cognito session / JWT which would improve how to handle passing the user/stream ID to the backend
  
- **Error handling on HTML5 Video/Source** - I can view the error event and see the 429 error in the console, however gaining access to the status code/body proved difficult, so for 
  time I ensured that there is a generic error on failure of the video.