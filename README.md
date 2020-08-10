# Skin Check 360
>React Native frontend for skin check 360 using AWS Amplify

### Run locally
* npm start
* Install expo client on phone and run the app by scanning the qr code.

### How to build new release
* Run this 
```
expo build:ios --clear-provisioning-profile
```
* Use trajsporter to upload the new image and release using TestFlight on apple store connect

### To update Amplify
* First add this line of code to the mutation for visit entry 
```
$util.qr($context.args.input.put("owner", $context.identity.username))
```
* Then delete owner field from CreateVisitEntryInput schema
* [Good documentation on how to update/change the dynamo key](https://read.acloud.guru/build-your-own-multi-user-photo-album-app-with-react-graphql-and-aws-amplify-bcaeba942159) (Go to dyanmo and look at the Key for the visitPictures Table)

### Resources
* [How to set up amplify](https://read.acloud.guru/build-your-own-multi-user-photo-album-app-with-react-graphql-and-aws-amplify-bcaeba942159)
* [Focus box around camera](https://forums.expo.io/t/help-cropping-square-at-the-center-of-image-using-expo-imagemanipulator/10294/2)