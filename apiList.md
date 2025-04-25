# DevTinder APIs

## authRouter
- POST /signup
- POST /login
- POST /logout

## profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## connectionsRequestRouter
- POST /request/send/:status/:userId //"ignored", "interested"
- POST /request/review/:status/:requestId // "accepted", "rejected"

## userRouter
- GET /user/connections
- GET /user/requests/received
- GET /user/requests/send
- GET /user/feed - Gets you the profiles of other users on platform