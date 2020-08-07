# Skin Check 360
>React Native frontend for skin check 360 using AWS Amplify

### Run locally
* npm start
* Install expo client on phone and run the app by scanning the qr code.

### To update Amplify
* Add to the mutation for visit entry - $util.qr($context.args.input.put("owner", $context.identity.username))
* Delete owner from CreateVisitEntryInput schema
* Change the dynamo key - https://read.acloud.guru/build-your-own-multi-user-photo-album-app-with-react-graphql-and-aws-amplify-bcaeba942159

### Resources
* https://read.acloud.guru/build-your-own-multi-user-photo-album-app-with-react-graphql-and-aws-amplify-bcaeba942159
