import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigatewayv2';
import * as integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cr from 'aws-cdk-lib/custom-resources';
import { Construct } from 'constructs';

export class ProductApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB Table
    const table = new dynamodb.Table(this, 'ProductSpecifications120536', {
      tableName: 'ProductSpecifications120536',
      partitionKey: { name: 'productId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PROVISIONED,
      readCapacity: 5,
      writeCapacity: 5,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    // Enable auto scaling
    table.autoScaleReadCapacity({
      minCapacity: 1,
      maxCapacity: 10
    });
    
    table.autoScaleWriteCapacity({
      minCapacity: 1,
      maxCapacity: 10
    });

    // Lambda Functions
    const getProductsFunction = new lambda.Function(this, 'GetProductsFunction120536', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'getProducts.handler',
      code: lambda.Code.fromAsset('lambda'),
      environment: {
        TABLE_NAME: table.tableName
      }
    });

    const getProductByIdFunction = new lambda.Function(this, 'GetProductByIdFunction120536', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'getProductById.handler',
      code: lambda.Code.fromAsset('lambda'),
      environment: {
        TABLE_NAME: table.tableName
      }
    });

    const initSampleDataFunction = new lambda.Function(this, 'InitSampleDataFunction120536', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'initSampleData.handler',
      code: lambda.Code.fromAsset('lambda'),
      environment: {
        TABLE_NAME: table.tableName
      },
      timeout: cdk.Duration.minutes(5)
    });

    // Grant DynamoDB permissions
    table.grantReadData(getProductsFunction);
    table.grantReadData(getProductByIdFunction);
    table.grantWriteData(initSampleDataFunction);

    // API Gateway
    const api = new apigateway.HttpApi(this, 'ProductApi120536', {
      apiName: 'ProductSpecificationsAPI120536',
      corsPreflight: {
        allowOrigins: ['*'],
        allowMethods: [apigateway.CorsHttpMethod.GET, apigateway.CorsHttpMethod.OPTIONS],
        allowHeaders: ['Content-Type', 'Authorization']
      }
    });

    // API Routes
    api.addRoutes({
      path: '/products',
      methods: [apigateway.HttpMethod.GET],
      integration: new integrations.HttpLambdaIntegration('GetProductsIntegration120536', getProductsFunction)
    });

    api.addRoutes({
      path: '/products/{id}',
      methods: [apigateway.HttpMethod.GET],
      integration: new integrations.HttpLambdaIntegration('GetProductByIdIntegration120536', getProductByIdFunction)
    });

    // Custom Resource to initialize sample data
    const initDataProvider = new cr.Provider(this, 'InitDataProvider120536', {
      onEventHandler: initSampleDataFunction
    });

    new cdk.CustomResource(this, 'InitSampleDataResource120536', {
      serviceToken: initDataProvider.serviceToken
    });

    // Outputs
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url!,
      description: 'Product API URL'
    });

    new cdk.CfnOutput(this, 'TableName', {
      value: table.tableName,
      description: 'DynamoDB Table Name'
    });
  }
}
