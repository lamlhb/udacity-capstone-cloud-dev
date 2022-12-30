import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getUserId } from '../utils';
import { resizeTodoImg } from '../../business/todos'
import {ResizeImageRequest} from "../../requests/ResizeImageRequest";
import {createLogger} from "../../utils/logger";

const logger = createLogger('resizeImageCtl')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    try {
      const todoId = event.pathParameters.todoId;
      const resizeImage: ResizeImageRequest = JSON.parse(event.body);

      if (!resizeImage) throw new Error("Body must not be empty")

      const userId = getUserId(event);

      await resizeTodoImg(todoId, userId, resizeImage);

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
          "message": "Resize the image for the todo item successfully"
        })
      }
    } catch (err) {
      logger.error(err.stack)
      return {
        statusCode: 500,
        body: JSON.stringify({
          "message": "Internal Error " + err.message
        })
      }
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
