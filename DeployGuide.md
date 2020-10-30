# AWS Full Pipeline Deployment
For the deployment of the application, the following pipeline can be used since the server is AWS-centric:

```
Code  --Push-->  GitHub  --Webhook-->  AWS CodePipeline  -Build Stage->  AWS Cloudbuild (CI / Automated Build and Tests)  -Deploy to Prod->  AWS Cloudbuild (CD / Serverless Deploy) --> AWS Lambda 
```

## Managing Secrets on AWS using AWS System Manager Parameter Store
> :bangbang: **Important**: As the `DATABASE` and the `DATABASE_TEST` attributes in your env contain your MongoDB Atlas credentials, they should be treated as secrets. Thus, if you are deploying it, **please remove the two fields from your .env** and ensure it was not compromised by committing it previously.
1. Search for "Systems Manager" on your AWS Console.
2. Navigate to Application Management > Parameter Store and click "Create Parameter"
3. Enter the parameter name as "pet-dashboard-database-connection-uri".
4. Choose the "SecureString" type. Leave KMS key source as "My current account"
5. Paste the `DATABASE` URI string into the value field. Click "Create Parameter".
6. Repeat this for the `DATABASE_TEST` value, naming it "pet-dashboard-test-database-connection-uri" instead.

The `buildspec.yml` we use for the build step later references the names of these parameters, which can be safely committed to version control and securely resolved during the actual build itself.

## Setting up CI/CD Pipeline
7. Create an S3 bucket to store the build artifacts, you can name it whatever you wish.
8. Create a CodePipeline, you can name it whatever you wish.
   
### Pipeline Settings
9. Select a new service role for the pipeline for permissions to interact with other AWS services.
10. Select the S3 bucket you created as the artifact store.
   
### Source Stage
11. Select GitHub (Version 2) as your source provider. (Alternatively, point the source to wherever you have deployed your source code)
12. Fill in the details to create a GitHub App for AWS to establish a connection scoped for your repository. Leave the output artifact format as default.

### Build Stage - CI
13. As per the deployment diagram, AWS CodeBuild is specified as the build provider, spinning up a docker container to run the `mocha` tests everytime code changes are fetched from the repository.
14. Create a CodeBuild project choosing the following settings:
    * Managed Image, Ubuntu, Standard runtime, aws/codebuild/standard:4.0 image. Leave the rest as default.
    * Create a new service role for CodeBuild to interact with the other AWS services.
    * Choose to use a buildspec file with the path as `server/buildspec.yml`

### Deploy Stage - CD
15. For the deploy stage, choose AWS CodeBuild as the action provider. This will serve as a different service where we can add more configurations for deployment. But for this demo, this CodeBuild instance will simply just use the Serverless framework to deploy the packaged serverless build to AWS Lambda.
16. Create a CodeBuild project choosing the following settings:
    * Managed Image, Ubuntu, Standard runtime, aws/codebuild/standard:4.0 image. Leave the rest as default.
    * Choose an existing service role. For the role ARN, pick the service role that was configured by the CodeBuild stage (Should show from autocomplete by clicking on the input box).
    * Insert the environment variables for `DATABASE` and `DATABASE_TEST` under "Environment variables".
    * For the buildspec, select "Insert build commands" and paste the following command in "Build commands":
      ```
      cd server && bash deploy.sh
      ```
17. Ensure that Input artifacts is filled (e.g. BuildArtifact) to ensure input is taken in from the previous build stage.
18. Enter a name for the output artifacts.

### Assigning Proper permissions to the Pipeline service account
19. Navigate to CodeBuild > Build Projects > Build Project > Build Details > Environment. Click on the service role being used by CodeBuild.
20. Click "Add inline policy". For service, search and click on "S3".
21. Grant the following Actions:
    * Read > GetObject
    * Write > PutObject and DeleteObject 
22. For simplicity, just choose "All resources" for Resources. You can alternatively specify the build artifacts bucket's ARN (e.g. `arn:aws:s3:::BUCKET_NAME/PIPELINE NAME/**/*`).
23. Click "Add additional permissions".
24. Search for the service "Systems Manager" this time.
25. Grant the following Actions:
    * Read > GetParameters
26. Specify "All resources" for Resources for simplicity again.
27. Click "Review Policy", give it an appropriate policy name and hit "Create Policy".
28. Attach the created policy to the service account under IAM > Roles.
29. Lastly, we need full access to AWS Cloud Formation which Serverless uses to orchestrate the deployment of the Lambda functions. Select "Attach policies" and search for "AdministratorAccess".
30. Tick the box of "AWSCloudFormationFullAccess" and click "Attach Policy".

### Running the pipeline
31. Navigate to CodePipeline and click on your created pipeline.
32. Click on Release change to activate the pipeline flow. The entire pipeline should take a couple of minutes.
33. You should see that all 3 stages in the pipeline has succeeded. Click "Details" for the last AWS CodeBuild stage.
34. Scroll down the logs until you see something similar to this:
    ```sh
    ...
    endpoints:
      GET - https://g9sxbc8azf.execute-api.us-east-1.amazonaws.com/prod/
      POST - https://g9sxbc8azf.execute-api.us-east-1.amazonaws.com/prod/pet
      GET - https://g9sxbc8azf.execute-api.us-east-1.amazonaws.com/prod/pet/{id}
      GET - https://g9sxbc8azf.execute-api.us-east-1.amazonaws.com/prod/pet
      PUT - https://g9sxbc8azf.execute-api.us-east-1.amazonaws.com/prod/pet/{id}
      DELETE - https://g9sxbc8azf.execute-api.us-east-1.amazonaws.com/prod/pet/{id}
      DELETE - https://g9sxbc8azf.execute-api.us-east-1.amazonaws.com/prod/pet/purge
    ...
    ```
    These are the deployed endpoints for our Lambda functions! You can proceed to test these endpoints directly, or using the UI. 

    (For the UI, set the `.env` values `VUE_APP_NODE_ENV` and `VUE_APP_PROD_ADDRESS` to `production` and `https://g9sxbc8azf.execute-api.us-east-1.amazonaws.com` (for this example) respectively).

## Monitoring the Serverless AWS Deployment
AWS splits resources via regions and thus, you will only see resources if your console is at the correct region. By default, Serverless will deploy all resources to the `us-east-1` region. Hence, it is entirely possible that your pipeline and Serverless deployment are on two different regions.