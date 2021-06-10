# AWS-Serverless-API-MongoDB-Pipeline

A serverless REST API implementation using AWS Lambda with MongoDB Atlas for persistent data. Mongoose is used as a MongoDB ORM for data handling.

Testing of the API server is also demonstrated with simple test cases using Mocha/Chai/SuperTest. A sample web app created with Vue is also used to show the API consumption.

## Demo
<div align="center">
<img src="https://raw.githubusercontent.com/Q-gabe/AWS-Serverless-API-MongoDB-Pipeline/main/preview/ui.png" width="600"/>
<br><b>The deployed demo has been decommissioned due to storage costs.</b>
</div>



* Frontend Vue Web App
* Currently active Lambda endpoints:
  ```
  endpoints:
    GET - https://g9sxbc8azf.execute-api.us-east-1.amazonaws.com/prod/
    POST - https://g9sxbc8azf.execute-api.us-east-1.amazonaws.com/prod/pet
    GET - https://g9sxbc8azf.execute-api.us-east-1.amazonaws.com/prod/pet/{id}
    GET - https://g9sxbc8azf.execute-api.us-east-1.amazonaws.com/prod/pet
    PUT - https://g9sxbc8azf.execute-api.us-east-1.amazonaws.com/prod/pet/{id}
    DELETE - https://g9sxbc8azf.execute-api.us-east-1.amazonaws.com/prod/pet/{id}
    DELETE - https://g9sxbc8azf.execute-api.us-east-1.amazonaws.com/prod/pet/purge
  ```
To see the code actually used to deploy these, check the `deployment` branch of this repository. (Currently monitored via GitHub webhooks to Netlify and AWS CodePipeline respectively.)

## Prerequisites
* Access to [AWS Lambda](https://aws.amazon.com/lambda/)
* Access to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
* [Node.js](https://nodejs.org/en/) installed on your machine.
* [Serverless](https://www.serverless.com/framework/docs/providers/aws/guide/installation/) is installed on your machine.
  ```sh
  yarn global add serverless
  ```

## Setup
Clone the repository and install all dependencies
   ```sh
   git https://github.com/Q-gabe/AWS-Serverless-API-MongoDB-Pipeline.git
   cd AWS-Serverless-API-MongoDB-Pipeline/ui && yarn install && cd ../server && yarn install
   ```
### Setting up the API Server
#### AWS Serverless
1. Get programmatic access to AWS by adding a new IAM Role in AWS. Download the .csv with the Access Key ID and Secret Access Key.
2. `yarn serverless config credentials --provider aws --key ACCESS_KEY --secret SECRET_KEY` Replace ACCESS_KEY and SECRET_KEY with the values you saved from the .csv.

#### MongoDB Atlas
3. Login to the MongoDB Atlas website and create a sandbox MongoDB database cluster.
4. Get programmatic access to the cluster by adding a MongoDB user.
   * Create the user by going to Database Access.
   * Whitelist the `0.0.0.0/0` CIDR block under Network Access to allow access from anywhere.
   * From the Clusters page, click 'Connect' on your designated cluster. Choose `Connect your application > Node.js 3.6 or later`.
   * Copy the connection string and append "&authSource=admin" to it and fill in the `DATABASE` variable accordingly in `.env`.
     * It should look like: `mongodb+srv://<username>:<password>@CLUSTER_NAME.abcde.mongodb.net/<dbname>?retryWrites=true&w=majority`
     * You can use any dbname.
     * Add `.env` to `.gitignore` if you are using version control for your own purposes.

## Deploying locally
### Server
1. To deploy the functions on your loopback address, simply run:
   ```sh
   serverless offline
   ```
2. The output should display a list of URLs where your functions are deployed locally, similar to this:
   ```sh
   ┌─────────────────────────────────────────────────────────────────────────────────┐
   │   GET    | http://localhost:3000/dev                                            │
   │   POST   | http://localhost:3000/dev/pet                                        │
   │   GET    | http://localhost:3000/dev/pet/{id}                                   │
   │   GET    | http://localhost:3000/dev/pet                                        │
   │   PUT    | http://localhost:3000/dev/pet/{id}                                   │
   │   DELETE | http://localhost:3000/dev/pet/{id}                                   │
   └─────────────────────────────────────────────────────────────────────────────────┘
   ```
3. You can proceed to test your endpoints using Postman or curl commands:
   ```
   # e.g. Testing a POST request with curl to post a new Pet
   curl -X POST http://localhost:3000/dev/pet  --data '{"name": "Minmo", "species": "cat", "age": 1, "status": "Sleeping"}'
   ```
   **Running tests will purge the test database that `serverless offline` uses. Please ensure no critical data is stored on the test database that `serverless offline`-run local endpoints interact with.**

### UI
The Vue webapp UI is only used to demonstrate the API consumption.
1. To deploy the UI app locally, simply run:
   ```
   yarn serve
   ```
2. Access [localhost on port 8080](http://localhost:8080) to access the UI.

If you want to point all API requests towards your Lambda deployment, update the `VUE_APP_PROD_ADDRESS` and `VUE_APP_PROD_PORT` in `ui/.env` file with the address and port of your deployed routes. Also, change the value of `VUE_APP_NODE_ENV` to `production`.

## Tests
To run tests locally, ensure that the API server is currently running and that `DATABASE_TEST` and `TEST_ADDRESS` are filled in accordingly in the `.env` file. e.g.:
```yaml
...
DATABASE_TEST=mongodb+srv://<username>:<password>@CLUSTER_NAME.abcde.mongodb.net/<testdbname>?retryWrites=true&w=majority
TEST_ADDRESS=http://localhost:3000/dev
```
where `testdbname` is an empty or non-existent collection in your MongoDB Atlas cluster (It is critical that the test DB is empty for tests to pass). `TEST_ADDRESS` can be seen by running the server locally with the `serverless offline` command.

Run the actual tests by running:
```sh
yarn test
```
**Running tests will purge the test database that `serverless offline` uses. Please ensure no critical data is stored on the test database that `serverless offline`-run local endpoints interact with.**

Note that besides error handling unit tests, the actual API behavior testing are written as integration tests rather than mocking the persistent MongoDB.

## API Routes
|Route Name |URL   	        |HTTP Verb   	|Description   	                        |Expected inputs                                |
|---	    |---	        |---	        |---	                                |---                                            |
|healthcheck|/	            |GET	        |Returns a "Hello" on invocation.	    |N/A                                            |
|list   	|/pet   	    |GET   	        |Shows all pets information.   	        |N/A                                            |
|create   	|/pet   	    |POST  	        |Creates a pet information entry.       |JSON specifying the whole Pet data schema and values in HTTP body.     |
|show   	|/pet/:id   	|GET   	        |Shows a specific pet's information.    |`_id` of specific pet as URL parameter `:id`   |
|update   	|/pet/:id   	|PUT   	        |Updates a pet's information.   	    |`_id` of specific pet as URL parameter `:id` + JSON specifying fields and updated values according to the Pet data schema in HTTP body. |
|remove   	|/pet/:id   	|DELETE         |Remove a pet's information.   	        |`_id` of specific pet as URL parameter `:id`   |

## Scenario and Data Schema
This demo uses an example of a Pet Day Boarding Center as a client, wishing to track the pets that are currently in their care. The representation of each pet is captured in the schema as follows:
|Field      |Type   	    |
|---	    |---	        |
|name       |String         |
|species   	|String   	    |
|age       	|Number   	    |
|status   	|String        	|

The default unique ObjectID `_id` is used in identifying individual data entries.

## AWS Full Pipeline Deployment
For a rundown on how to deploy the full CI/CD pipeline of the application on AWS, please refer to the [Deployment Guide](https://github.com/Q-gabe/AWS-Serverless-API-MongoDB-Pipeline/blob/main/DeployGuide.md).

It is highly recommended to refer to the code in the `deployment` branch.

## Deploying API functions directly to AWS Lambda from local
If you are not interested in deploying CI/CD, you can alternatively just use Serverless's deploy which handles the resource orchestration on AWS and simply returns the endpoints ready-to-go.

To deploy the API functions to AWS Lambda directly, simply run this command in the server folder:
   ```
   serverless deploy
   ```
   The output will show a list of URLs where your functions can be accessed.

## Acknowledgements
* Logo used in the sample UI app was generated from [FreeLogoDesign](https://www.freelogodesign.org/).
* The Vue App was bootstrapped with [Vue CLI](https://cli.vuejs.org/).
* [UIkit](https://getuikit.com/) was used as a responsive design framework for the web app.
* [Serverless Offline](https://github.com/dherault/serverless-offline) was used to facilitate a simpler API for local testing of Lambda functions compared to alternatives.
* References:
  * AWS Deployment
    * [Serverless Framework Documentation](https://www.serverless.com/framework/docs/)
    * [AWS Documentation](https://docs.aws.amazon.com/index.html)
    * [Setting up CI/CD on AWS with Lambda and Serverless (Outdated but great reference)](https://medium.com/quantica/setup-ci-cd-pipeline-with-aws-lambda-and-serverless-framework-f624773f355e)
    * [Using SSM Variables in CodeBuild](http://www.piotrnowicki.com/2019/06/serverless-aws-using-ssm-variables-from-codebuild/)
  * Testing:
    * [Chai Testing Guide](https://www.chaijs.com/guide/)
    * [Testing in Node.js using Mocha and Chai](https://livecodestream.dev/post/2020-08-17-testing-in-nodejs-using-mocha-and-chai-part-1/)
