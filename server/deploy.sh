#! /bin/bash

yarn global add serverless
serverless deploy --stage prod --package $CODEBUILD_SRC_DIR/target/prod -v