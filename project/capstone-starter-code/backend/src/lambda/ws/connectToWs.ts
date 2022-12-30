import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import {createLogger} from "../../utils/logger";
const XAWS = AWSXRay.captureAWS(AWS)

const docClient = new XAWS.DynamoDB.DocumentClient()

const wsConnectionsTable = process.env.WS_CONNECTIONS_TABLE
const logger = createLogger('connectToWs')
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    logger.error("start connect process")

    const connectionId = event.requestContext.connectionId
    const timestamp = new Date().toISOString()

    logger.error("connectionId " + connectionId)

    const item = {
        connectionId: connectionId,
        timestamp
    }

    await docClient.put({
        TableName: wsConnectionsTable,
        Item: item
    }).promise()

    logger.error("Updated the Db")

    return {
        statusCode: 200,
        body: JSON.stringify({ msg: 'connected'})
    }
}