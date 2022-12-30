# OPTION 2

# Endpoints: 
## ServiceEndpoint: https://lfp8u5bdfi.execute-api.us-east-1.amazonaws.com/dev

1. GET - https://lfp8u5bdfi.execute-api.us-east-1.amazonaws.com/dev/todos
2. POST - https://lfp8u5bdfi.execute-api.us-east-1.amazonaws.com/dev/todos
3. PATCH - https://lfp8u5bdfi.execute-api.us-east-1.amazonaws.com/dev/todos/{todoId}
4. DELETE - https://lfp8u5bdfi.execute-api.us-east-1.amazonaws.com/dev/todos/{todoId}
5. POST - https://lfp8u5bdfi.execute-api.us-east-1.amazonaws.com/dev/todos/{todoId}/attachment
6. POST - https://lfp8u5bdfi.execute-api.us-east-1.amazonaws.com/dev/todos/{todoId}/resize

# New Features
1. The S3 object will be deleted when delete the todo item
2. Resize the todo image as requested sizing