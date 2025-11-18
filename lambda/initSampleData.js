const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, BatchWriteCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const sampleProducts = [
    {
        productId: 'prod-001',
        productName: 'iPhone 15 Pro',
        category: 'Electronics',
        brand: 'Apple',
        price: 999.99,
        description: 'Latest iPhone with advanced camera system',
        specifications: {
            weight: '187g',
            dimensions: '146.6 x 70.6 x 8.25 mm',
            color: 'Titanium Blue',
            storage: '128GB'
        }
    },
    {
        productId: 'prod-002',
        productName: 'Nike Air Max 270',
        category: 'Footwear',
        brand: 'Nike',
        price: 150.00,
        description: 'Comfortable running shoes with air cushioning',
        specifications: {
            weight: '300g',
            material: 'Mesh and synthetic',
            color: 'Black/White',
            sizes: ['7', '8', '9', '10', '11']
        }
    },
    {
        productId: 'prod-003',
        productName: 'Samsung 55" QLED TV',
        category: 'Electronics',
        brand: 'Samsung',
        price: 799.99,
        description: '4K QLED Smart TV with HDR support',
        specifications: {
            weight: '17.6kg',
            dimensions: '1227 x 706 x 59 mm',
            resolution: '3840 x 2160',
            smartOS: 'Tizen'
        }
    },
    {
        productId: 'prod-004',
        productName: 'Levi\'s 501 Jeans',
        category: 'Clothing',
        brand: 'Levi\'s',
        price: 89.99,
        description: 'Classic straight-fit denim jeans',
        specifications: {
            material: '100% Cotton',
            fit: 'Straight',
            color: 'Dark Blue',
            sizes: ['28', '30', '32', '34', '36']
        }
    },
    {
        productId: 'prod-005',
        productName: 'KitchenAid Stand Mixer',
        category: 'Home & Kitchen',
        brand: 'KitchenAid',
        price: 349.99,
        description: 'Professional-grade stand mixer for baking',
        specifications: {
            weight: '10.9kg',
            capacity: '4.8L',
            color: 'Empire Red',
            power: '325W'
        }
    }
];

exports.handler = async (event) => {
    try {
        const putRequests = sampleProducts.map(product => ({
            PutRequest: {
                Item: product
            }
        }));

        const command = new BatchWriteCommand({
            RequestItems: {
                [process.env.TABLE_NAME]: putRequests
            }
        });

        await docClient.send(command);
        
        return {
            statusCode: 200,
            body: JSON.stringify({ 
                message: 'Sample data initialized successfully',
                count: sampleProducts.length 
            })
        };
    } catch (error) {
        console.error('Error initializing sample data:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to initialize sample data' })
        };
    }
};
