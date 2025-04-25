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
- GET /user/feed?page=1&limit=10 - Gets you the profiles of other users on platform