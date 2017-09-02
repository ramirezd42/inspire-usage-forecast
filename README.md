# inspire-usage-forecast
[![Code Climate](https://codeclimate.com/github/ramirezd42/inspire-usage-forecast/badges/gpa.svg)](https://codeclimate.com/github/ramirezd42/inspire-usage-forecast) 

Currently hosted with Heroku: https://inspire-usage-forecast.herokuapp.com
 
---
## 🔧 Setup 🔧
### Yarn
This project uses yarn as its package manager and script-runner. So please install yarn if it is not already installed.

`npm install -g yarn`

### Zillow Credentials (ZWSID)
The application requires a valid Zillow ZSID to be available in the   `ZWSID`    environment variable. It can also be placed in a *.env* file in the root of the project.

For example: `ZWSID=X1-ZWz1wzeyoee01v_8l132`

## 🚀 Deploy 🚀
### Heroku
This application is configured to be easily deployable with Heroku:

```
heroku login
heroku git:remote -a [YOUR_APP]
git push heroku master
```

### Locally
To serve the api locally run `yarn start` from the root of the project. This will serve the api on `localhost:5000` or a different port if the `PORT` environment variable is set.

You can also run `yarn run start:watch` which will restart the server when file changes are detected.

## 🔬Test 🔬
Running `yarn test` will run all automated tests
Running `yarn run test:watch` will run all the tests in watch mode, which re-runs the tests whenever file changes are detected. Convenient for TDD.

---

## Available Routes
```
/api/forecast
```
### Required Query Params:
* *address*: Street address (e.g. 215 Street rd )
* *city*: City name (e.g. Philadelphia)
* *state*: Two letter state code (e.g. PA)

### Response Format (JSON):
```
{
  "zid": "9901059",
  "forecasted_usage": 1250,
}
```
### Example:
```
GET /api/forecast?address=2833%20Miriam%20Ave&city=Roslyn&state=PA&zip=19001 HTTP/1.1
```

---

## Design Considerations and Potential Improvements
### Validation
All query string parameters are required (address, city, state, zip). If any parameters are not provided, the server will respond with an HTTP status code of 400 (Bad Request) and a message indicating which parameter was not provided.

### Error Handling
I found it is often the case that a valid address is provided, but property details were either not entered for that property or could not be released for legal reasons. It is also possible that Zillow could not locate a property even though a valid address was provided.

I wanted to give meaningful feedback to consumers of this api rather than just responding with a 500 error every time I got an error from the Zillow api. So I introduced business logic in the model layer that maps response codes from Zillow’s api to distinct error types that the `fetchPropertyDetails` middleware can then use to determine the appropriate response. 

The only example I’ve built out is a *NOT_FOUND* error type that the `fetchPropertyDetails` model function will throw if specified error codes are found in either api call. The middleware then checks for that error type in the `catch` block and responds with an HTTP status code of 404 (not found) as well as the original error message from Zillow’s api

This could easily be expanded to handle different types of error codes. For example, an error code of 3 and 4 in Zillow’s *GetUpdatedPropertyDetails* translates to /“Web services are currently unavailable”/ and /“The API call is currently unavailable”/ respectively.   A response of 503 (service unavailable) might make more sense in these cases, so a new *SERVICE_UNAVAILABLE* error type could be added in the model layer

### Tests
All tests are what I would classify as integration tests, in that they test the interaction middleware and model layers. Currently requests out to the Zillow api are not mocked so tests are run against real-life data. This is very convenient for development right now, but as a result each test is relatively slow and depends on an internet connection and use of a valid Zillow ZSID. 

If the application were to get much more complex I would suggest pulling these integration tests out into a separate suite that could be run manually or as part of a CI/CD pipeline and building out the additional functionality against a mock Zillow client library. In the past I’ve used tools like [sinon](http://sinonjs.org/) for test spies and stubs and [proxyquire](https://github.com/thlorenz/proxyquire) to inject mock dependencies.

### Linting
This codebase use an eslint configuration based off Airbnb's published configuration. It's fairly strict but I find that a lot of the rules lead to more-readable and diff-friendly code.