# grocery-list

Grocery List App Made With Node ExpressJS

Landing page:
Directs user to sign in with Google if not signed in.
Directs user to Dashboard if signed in.

Dashboard Page:
Lists all lists where user is owner or user.
Lists are editable and deletable
Lists also linked to list items page

List Items Page:
Shows List Name
Shows Owner Avatar & Users Avatars
(Sharing logic to be implemented)
Shows list items, sorted alphabetically and by status ("to-do" or "done")
Items are editable, and deletable
If an item is selected, its status its toggled between ("to-do" and "done")

Create with:
Node
Express
Javascript
Pug View Engine
MongoDB database
Mongoose
Passport with Google OAuth2 Strategy for authentication