# Product Specifications API

A serverless Product Specifications API built on AWS using CDK, providing access to product data stored in DynamoDB with flexible JSON schema support.

## Architecture

This project implements a serverless architecture using:
- **API Gateway**: HTTP API for RESTful endpoints
- **AWS Lambda**: Serverless compute for business logic
- **DynamoDB**: NoSQL database for product data storage
- **CDK**: Infrastructure as Code for AWS resource management

## API Endpoints

### Base URL
```
https://36h8gk7jra.execute-api.us-east-1.amazonaws.com/
```

### Endpoints

#### GET /products
Returns all products in the database.

**Response Example:**
```json
[
  {
    "productId": "prod-001",
    "productName": "iPhone 15 Pro",
    "category": "Electronics",
    "brand": "Apple",
    "price": 999.99,
    "description": "Latest iPhone with advanced camera system",
    "specifications": {
      "storage": "128GB",
      "color": "Natural Titanium",
      "display": "6.1-inch Super Retina XDR"
    }
  }
]
```

#### GET /products/{id}
Returns a specific product by ID.

**Parameters:**
- `id` (path parameter): Product ID

**Response Example:**
```json
{
  "productId": "prod-001",
  "productName": "iPhone 15 Pro",
  "category": "Electronics",
  "brand": "Apple",
  "price": 999.99,
  "description": "Latest iPhone with advanced camera system",
  "specifications": {
    "storage": "128GB",
    "color": "Natural Titanium",
    "display": "6.1-inch Super Retina XDR"
  }
}
```

**Error Response (404):**
```json
{
  "error": "Product not found"
}
```

## Sample Data

The API comes pre-populated with 5 sample products across different categories:
1. iPhone 15 Pro (Electronics)
2. Nike Air Max 270 (Footwear)
3. Samsung 55" QLED TV (Electronics)
4. Levi's 501 Jeans (Clothing)
5. KitchenAid Stand Mixer (Home & Kitchen)

## Project Structure

```
├── app.ts                    # CDK app entry point
├── lib/
│   └── product-api-stack.ts  # CDK stack definition
├── lambda/
│   ├── getProducts.js        # Get all products function
│   ├── getProductById.js     # Get product by ID function
│   └── initSampleData.js     # Sample data population function
├── specs/                    # Project specifications
├── generated-diagrams/       # Architecture diagrams
├── pricing/                  # Cost analysis
└── cdk.out/                  # CDK build output
```

## Deployment

### Prerequisites
- AWS CLI configured
- Node.js 18+ installed
- AWS CDK CLI installed

### Deploy
```bash
npm install
cdk deploy
```

### Destroy
```bash
cdk destroy
```

## Development

### Install Dependencies
```bash
npm install
```

### Build
```bash
npm run build
```

### Test Locally
```bash
npm test
```

## Features

- **Serverless Architecture**: Pay-per-use pricing model
- **Auto-scaling**: DynamoDB with on-demand scaling
- **CORS Enabled**: Cross-origin resource sharing configured
- **Error Handling**: Comprehensive error responses
- **Flexible Schema**: JSON-based product specifications
- **Infrastructure as Code**: Fully defined using AWS CDK

## Cost Optimization

- Uses provisioned capacity for DynamoDB with auto-scaling
- Lambda functions with optimized memory allocation
- API Gateway HTTP API (lower cost than REST API)
- Efficient data access patterns

## Security

- IAM roles with least-privilege access
- API Gateway with built-in throttling
- DynamoDB encryption at rest
- Lambda function isolation

## Monitoring

The stack includes CloudWatch integration for:
- Lambda function metrics and logs
- DynamoDB performance metrics
- API Gateway request/response metrics

## License

This project is licensed under the MIT License.
