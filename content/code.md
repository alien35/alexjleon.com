Some stuff I've written in my free time.

## Toneco (Work in progress)

Toneco is an open-source digital audio workstation. So far supports MIDI.

Tools used include Electron, React, Redux, Web Audio API.

https://github.com/Toneco/daw

## Mail Pigeons (Alpha, last change September 2017)

Mail Pigeons is a free mailing list service that offers a variety of features to gain new subscribers, manage them,
and send out good-looking emails.

Tools used include Mongo, Meteor, React.

https://mailpigeons.com

## Sound Globe 3D

Part of the official Ionic Showcase, Sound Globe 3D makes it easy to discover and enjoy natural sounds from every
continent. Intelligent algorithms distribute sounds around your head to create a realistic listening experience. An
innovative interface lets you choose your next destination with an interactive 3D globe.

Tools used include Ionic 2, Three.js, Howler.js.

https://itunes.apple.com/us/app/sound-globe-3d/id1231838120?mt=8
https://play.google.com/store/apps/details?id=com.ionicframework.soundscapeapp721860&hl=en
http://showcase.ionicframework.com/app/ff04f95cd3f36c0e273b

## Flashchat

This is a traceless secure messaging app.
Upon hitting the 'create a room for two' button, you will be redirected to an unused chatroom. Messages and images are
routed to that chatroom using sockets. By sending traffic directly to the room, we bypass the need to direct messages
through a database, and we lose the need to have registered users. This app consequently has no database and the only
information collected is the server’s memory usage. Images use the base64 encoding scheme. All traffic is encrypted
using SHA-2. Chatrooms are limited to two people, and any consequent person trying to enter the chatroom will neither
be able to view messages in the UI nor access the socket stream (that user's socket will be disconnected upon attempt).

Tools used include Node.js, Express, HTML5, CSS3, JQuery.

https://www.flashchat.us
