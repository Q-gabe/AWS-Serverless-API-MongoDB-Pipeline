#! /bin/bash

yarn global add serverless
yarn global add serverless-offline
serverless deploy --stage prod --package $CODEBUILD_SRC_DIR/server/target/prod -v