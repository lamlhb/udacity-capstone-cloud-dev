import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
const XAWS = AWSXRay.captureAWS(AWS)

const docClient = new XAWS.DynamoDB.DocumentClient()

const connectionsTable = process.env.WS_CONNECTIONS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const connectionId = event.requestContext.connectionId
    const key = {
        connectionId: connectionId
    }

    await docClient.delete({
        TableName: connectionsTable,
        Key: key
    }).promise()

    return {
        statusCode: 200,
        body: JSON.stringify({ msg: 'disconnected'})
    }
}