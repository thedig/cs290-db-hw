To get working:

Front-end only changes:
 - delete public folder on flip
 - replace with local public folder

Node changes:
 - Copy changes to flip
 - edit app.js to listen to hard-coded port #
 - call ./node_modules/forever/bin/forever start app.js [same-port-#]

Remaining reqs:
 - [check] form to add individual workout
 - delete row
 - edit row (can be separate route)
 - need to use use hidden fields for edit/delete?
