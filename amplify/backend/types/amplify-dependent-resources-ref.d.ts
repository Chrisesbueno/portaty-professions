export type AmplifyDependentResourcesAttributes = {
  "api": {
    "professionGraphql": {
      "GraphQLAPIEndpointOutput": "string",
      "GraphQLAPIIdOutput": "string"
    }
  },
  "auth": {
    "professions": {
      "AppClientID": "string",
      "AppClientIDWeb": "string",
      "IdentityPoolId": "string",
      "IdentityPoolName": "string",
      "UserPoolArn": "string",
      "UserPoolId": "string",
      "UserPoolName": "string"
    }
  },
  "storage": {
    "s3Professions": {
      "BucketName": "string",
      "Region": "string"
    }
  }
}