# OPTION 2

# Functions - Endpoints: 
## ServiceEndpoint: https://lfp8u5bdfi.execute-api.us-east-1.amazonaws.com/dev

1. GET - https://7sku160si5.execute-api.us-east-1.amazonaws.com/dev/todos
2. POST - https://7sku160si5.execute-api.us-east-1.amazonaws.com/dev/todos
3. PATCH - https://7sku160si5.execute-api.us-east-1.amazonaws.com/dev/todos/{todoId}
4. DELETE - https://7sku160si5.execute-api.us-east-1.amazonaws.com/dev/todos/{todoId}
5. POST - https://7sku160si5.execute-api.us-east-1.amazonaws.com/dev/todos/{todoId}/attachment
6. POST - https://7sku160si5.execute-api.us-east-1.amazonaws.com/dev/todos/{todoId}/resize
7. wss://1mhty33t6j.execute-api.us-east-1.amazonaws.com/dev

# New Features
1. The S3 object will be deleted when delete the todo item
2. Resize the todo image as requested sizing
3. Publish the message to the connected user to notify the created s3 object.

Use: wscat -c wss://1mhty33t6j.execute-api.us-east-1.amazonaws.com/dev to create a new connection

If there are have a incoming s3 object, the connected ws will receive the message have the format below:

{"todoId":"3d8f1deb-a825-496d-bf3a-c7248af380f4","attachmentId":"b4692ab1-16cd-4ad5-a2bb-052cc1b89c7b","action":"ObjectCreated:Put"}
