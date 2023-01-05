# grocery-list

## Grocery List App Made With Node ExpressJS

### Landing page:
- Directs user to sign in with Google if not signed in.
- Directs user to Dashboard if signed in.

### Dashboard Page:
- Lists all lists where user is owner or user.
- Lists are editable and deletable
- Lists also linked to list items page

### List Items Page:
- Shows List Name
- Shows Owner Avatar & Sharing Link
- Shows list items, sorted alphabetically and by status ("to-do" or "done")
- Items are editable, and deletable
- If an item is selected, its status its toggled between ("to-do" and "done")

### List Sharing:
- Shows name of list to share
- Form to add users by email
- Registered users are automatically added to list users
- Unregistered users are added to db as invitations
- Shows list owner info
- Shows list users info
- Users are removable
- Shows list invitations
- Invitations are removable
- Upon invited user first registration, invitations are resolved into list users

### Made with:
- Node
- Express
- Javascript
- Pug View Engine
- MongoDB database
- Mongoose
- Passport with Google OAuth2 Strategy for authentication