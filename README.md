# duke-dermatology

To run,
```
npm start
```

Install expo client on phone and run the app by scanning the qr code.


Add to the mutation for visit entry 
$util.qr($context.args.input.put("owner", $context.identity.username))
delete owner from CreateVisitEntryInput schema