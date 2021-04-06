# DAZN Assessment Backend API

A REST API built for the DAZN assessment.

## Modules used
This project uses the following modules:

- **Development:**
    - Uses Express as its framework for NodeJS, to handle all routing
    - Uses fs to create a read stream for the client to consume the video
    - Stores user sessions in app memory
- **Testing:** 
    - Unit tests are written in Jest, making use of node-mocks-http to mock the request and response. 
    - Code styling is checked via eslint 
  
## Starting the API
To use the api you will firstly need to run the following commands
```
npm install
npm run start
```
This will start the application on port 2020. You will then be able to call certain routes via Postman **(SSL Certificate Verification needs set to OFF)** or cURL.

Examples:

#### GET
Below is how to call the endpoint to view the streams for an existing user:

```
curl --location --request GET 'https://localhost:2020/video/streams?userID=123456' -vk
```
#### POST
Below is how to call the endpoint to remove a stream for an existing user:

```
curl --location --request POST 'https://localhost:2020/video/remove' \
--header 'Content-Type: text/plain' \
--data-raw '{"userID":"123456","streamID":"4dec5354-a30f-4fde-9a89-0960e38f9d67"}' -vk
```


## Testing
The following commands can be run to test the application
```
Code stying - npm run test:lint
Unit testing - npm run test:unit
```

## Approach
The API has 3 endpoints, the main one will create a read stream which will let the client view the video stored within the controller folder, this will
check that for a specific userID there aren't 3 existing streams viewing this video, and if so will return it, otherwise a 429 will be returned to the client.
The other 2 are for viewing and removing streams for a specified user.

## Scalability / Logging
To do this at scale, I would want to host this within an EC2 instance within AWS, ensuring that it could be assigned an ASG and have load balancers sit behind them to
deal with any demand. Logging could be monitored on Cloudwatch, but this would require adding a module such like Winston to handle what to log and what level.

## Potential Improvements / Issues Encountered

- **Handling large files** - I understand that a better solution needs to be in place than pushing the video to Git, as the file size is large, and it is
  something I would look into as one of the first improvements
  
- **CI/CD** - An improvement would be to add the project to a Gitlab project, which would run the relevant assurance steps
  as part of its pipeline i.e. Lint/Unit/Integration/Audit testing. This could then publish to AWS to be hosted.
  
- **Authentication** - An improvement would be to add authentication via a JWT or Cognito meaning that you would receive all the information
  on a user rather than relying on the client sending a userID
  
- **User database** - Similar to above, but having a DynamoDB/MongoDB to store users and their sessions would be easier in the long run

- **Handling sessions** - I opted to let the client terminate sessions, after I found it increasingly difficult with my approach to find a means
  to know when the video had either stopped, or the client had disconnected. More information on this is found within the UI's README.
  
