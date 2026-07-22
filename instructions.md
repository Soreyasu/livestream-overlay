# How to install the overlay in OBS

- add a browser source to your sources.
- enter in the URL section: C:/ "insert your path here" /overlay.html
- then click docks > custom browser docks > and add the controller.html path in the url.
- you should see a new dock with stream info that you can edit.
- here you can edit all the information you need for the overlay as it is.
- from here on out, you can edit any text in the info section and start/stop or reset the timer as you wish.
- put a filter on the overlay for magenta (or the color you choose yourself(later in documentation)) via the Filters > Effect Filters > Chroma Key option. 

# Twitch integration

-  to use twitch with the overlay, it is as simple as adding your username in the twitch connection part of the dock and click connect.
-  to check if you are connected, just type something in your chat and it should show up on your stream chat section
-  if you want, you can allow your friends in your chat to edit your stuff for you, if you make a mistake or forget something.
to achieve this, you go to the app.js file > (around) Line 11 const ALLOWED_EDITORS = ['soreyasu', 'dretda', 'saarion'];
replace the names with the names of the people you want to be able to edit your info. *(all need to be lower capsulation)*
