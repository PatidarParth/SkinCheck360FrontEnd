# duke-dermatology

To run,
```
npm start
```

Install expo client on phone and run the app by scanning the qr code.


Add to the mutation for visit entry 
$util.qr($context.args.input.put("owner", $context.identity.username))
delete owner from CreateVisitEntryInput schema

https://read.acloud.guru/build-your-own-multi-user-photo-album-app-with-react-graphql-and-aws-amplify-bcaeba942159