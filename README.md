# Reflexive Address Book

This is a VueJS application that communicates with a Node server to keep an address book.

## Installation

### Dependencies

- NPM
- Node
- VueCLI
- SQL Lite

### Backend

Navigate to the `backend` folder, then run these commands:

```
npm i
node server.js
```

From there, you should see a set of console logs like so:

```
listening on *:8080
Successful creation of the 'Contacts' table
```

A successful creation means the server is running and the table has been created.

The first line will be the port that the backend is broadcasting from, please remember this incase it needs to be changed.

Be careful when restarting the backend, it will clear out the data in the system.

### Frontend

Navigate to the root directory, then run these commands:

```
npm i
```

I recommend running the code in a serve environment:

```
npm run serve
```

However, if you have a LAMP/WAMP stack, you can run this (NOTE: you will have to move the files to the root of your directory to compile):

```
npm run build
```

## Features

### Main Page

The main page is your address book at whole. If it is empty, it is because no records have been added in. Once you add one in, then you will be able to see more features.

### Add Contact

There is a `CREATE` button in the top corner that will allow you to add a new contact.

### Edit/View/Delete Contact

Once a contact is made, you can select on them to edit, view or delete them.

NOTE: when deleting a user, you will never delete them from the system. As a percaution, a flag is just set to hide that user. The reason being, is that for future runnings, you can re enable contacts you deleted.

### Search

The search functionality will only show up when contacts are added. If there are no contacts, it will stay hidden. When searching, it looks for features in the contact from:

- First Name
- Last Name
- Email Address
- Phone Number

### Headers

Each header is collapsable to allow you to collapse them by last name.

There is also a running total per section and a total running that updates also when you are searching.
