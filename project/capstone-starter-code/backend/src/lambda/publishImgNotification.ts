import { S3Handler, S3Event } from 'aws-lambda'
import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
const XAWS = AWSXRay.captureAWS(AWS)

const docClient = new XAWS.DynamoDB.DocumentClient()

const connectionsTable = process.env.WS_CONNECTIONS_TABLE
const stage = process.env.STAGE
const apiId = process.env.API_ID
const apiVer = "2018-11-29"
const endpoint = `${apiId}.execute-api.us-east-1.amazonaws.com/${stage}`

const apiGateway = new AWS.ApiGatewayManagementApi({
    apiVersion: apiVer,
    endpoint: endpoint
})

export const handler: S3Handler = async (s3Event: S3Event) => {
    for (const record of s3Event.Records) {
        const key = record.s3.object.key

        if (!key) continue

        const connections = await docClient.scan({
            TableName: connectionsTable
        }).promise()

        if (!connections) continue

        const keyArr = key.split('/');

        const message = {
            todoId: keyArr[0],
            attachmentId: keyArr[1],
            action: record.eventName
        }

        await publishMessageToClient(connections, message)

    }
}

async function publishMessageToClient(connections, msg) {

    for (const con of connections.Items) {
        try {
            await apiGateway.postToConnection({
                ConnectionId: con.connectionId,
                Data: JSON.stringify(msg),
            }).promise()
        } catch (e) {
            if (e.statusCode === 410) {
                // No longer listens, should close it by delete in db
                await docClient.delete({
                    TableName: connectionsTable,
                    Key: {
                        connectionId: con.connectionId
                    }
                }).promise()

            }
        }
    }
}