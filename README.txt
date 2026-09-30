KINETIC SHUTTER SLIDESHOW
Plain HTML + CSS. No React, no TypeScript, no Vite, no Tailwind, no Bun, no
npm install, no build step, no outside connections.


WHAT TO DO WITH THESE FILES
---------------------------
Upload the whole folder to your PHP server, anywhere you like, and open it in
a browser. That is the entire install. It works from the site root or from a
subfolder, because every path in these files is relative. It does not need
PHP at all, so you can rename index.html to index.php if that suits your
setup better.

Compare that with the original: npm install, a Vite build, a Bun lockfile and
a node_modules folder, just to serve one page that never talks to a server.


THE FILES
---------
index.html      the page. Photos and captions are listed here, one block each.
animation.css   the whole effect: shutters, tilt, hue cycle, tint, pause.
overlays.css    OPTIONAL. Counter, tint-state readout, QR, control buttons.
overlays.js     OPTIONAL. Pause and fullscreen buttons plus Space and F.
photos/         photo-1.jpg ... photo-4.jpg (your four, in your order)
fonts/          Abril Fatface, Roboto Mono and Hind, served from your server
qr.png          placeholder QR code
README.txt      this file

Seventeen files, about 3 MB, and 3 MB of that is your four photographs.


HOW FAITHFUL IS IT
------------------
It is a port of the animation out of your AI Studio build, taken from
src/index.css and the markup in src/App.tsx. Same keyframes, same
percentages, same cubic-beziers, same colours, same 20s and 5s timings.

I checked it rather than assuming. I rebuilt your React component as a static
page, put it side by side with this one, froze both at the same instant and
compared them pixel by pixel at twelve points across the 20 second cycle,
with the captions in and again with them out. Every frame came back
byte-for-byte identical, zero differing pixels. So the look is not "close",
it is the same.


THE TINT
--------
A flat sheet of rust laid over each photo in hard-light, exactly as your build
did it, and it is a child of the photo so it tilts with it and can never
drift out of register.

It fades out across 33% to 66% of each photo's 5 seconds, which is the same
window the photo holds still in, so the tint is full while the photo moves,
gone while it rests, and back before it moves again.

There is also the manual pause, which is the other half of "pause-state
natural tint removal": hit Space or the pause button and every animation
freezes where it stands, the tint lifts off completely and the hue filter is
cleared, so what is left on screen is your photograph and nothing else.

To go back to a constant tint like the original CodePen, delete this line
from .slide__tint in animation.css:

    animation: tintInOut var(--slide-time) infinite;


SWAPPING IN PHOTOS
------------------
Drop your files into photos/ and edit the four --photo lines in index.html:

    <div class="slide" style="--photo: url('photos/photo-1.jpg')">

Also update the four matching <link rel="preload"> lines in the <head> so the
first cycle stays smooth, and edit the caption text in the same .slide block.
Nothing in the CSS needs touching.

Photos are drawn with background-size: cover, so they fill the screen and
crop rather than stretch, whatever shape they are. Yours are 1376x768.


ADDING OR REMOVING PHOTOS
-------------------------
Nothing is hard-coded to four, but three things have to agree:

1. the number of .slide blocks in index.html
2. the matching nth-child lines in animation.css, under "PHOTO LIST"
3. --cycle at the top of animation.css, which must be --slide-time times the
   number of photos

For five photos: add a fifth .slide, add
.slide:nth-child(5) { animation-delay: calc(var(--slide-time) * 4); }
and set --cycle to calc(var(--slide-time) * 5). If you keep the counter
overlay, add a fifth <span class="counter__n">05</span>, a fifth nth-of-type
line in overlays.css, and change "/ 04" to "/ 05".


THINGS YOU MIGHT WANT TO CHANGE
-------------------------------
At the top of animation.css:

  --slide-time   seconds per photo (5s). Set --cycle to four times it.
  --tint         the rust of the shutters and the tint (#b3401a)
  --hue-offset   nudges the colour step into the moment the shutters are
                 shut, so you never catch the colour sliding. Leave it alone.

On the <body> tag in index.html:

  has-captions   remove it to hide the big title on every photo
  has-pause      remove it to stop the page being pausable at all

Keyboard: Space pauses and resumes, F toggles fullscreen, double-click also
toggles fullscreen. The control buttons fade out after 3.5 idle seconds and
come back on any mouse movement, except while paused, when they stay put so
you can find the resume button.


WHAT IS NOT HERE YET
--------------------
Your build had more chrome than this one. Still to do, if you want it rather
than recoding it yourself:

  - previous / next buttons and the thumbnail dot navigation
  - the details modal with the curatorial text and the EXIF specs
  - the expanded QR modal with the Copy URL button
  - the keyboard shortcuts modal
  - the close-window button

The QR here is a static image rather than generated from the page address the
way yours was, because generating one in the browser means shipping a QR
library and this page has no other JavaScript worth speaking of. Tell me the
final address and I will generate the code and drop it in, or replace qr.png
yourself and point the surrounding <a href> at the same address so a mouse
click goes where a phone camera goes.


NO OUTSIDE CONNECTIONS
----------------------
Checked in the browser network log on the deployed page, not just locally:
loading this page requests these files and nothing else. No CDN, no Google
Fonts, no analytics, no tracking.

Worth knowing about the original, since your brief asked for no outside data
connections: index.html in your ZIP pulled four font families from
fonts.googleapis.com on every page load, so it did make outside connections.
Those fonts are now .woff2 files in fonts/ and come off your own server.

Two other things in the ZIP that are not in here, because nothing used them:
package.json depended on @google/genai and the project carried a
GEMINI_API_KEY entry in .env.example, but nothing in src/ ever imported or
referenced either one. The .env.example held only placeholder text, no real
key, so nothing was exposed.


BROWSER SUPPORT
---------------
Chrome, Edge, Firefox and Safari, desktop and mobile, tested at 390, 820,
1280, 1440 and 1920 pixels wide. The effect is CSS animation, hard-light
blending and hue-rotate, all supported everywhere since about 2016.

There is no JavaScript in the animation, which is the one place this is
genuinely better than the original rather than just simpler. Your React
version kept its own clock with Date.now() and requestAnimationFrame to drive
the counter and the progress bar, and fed negative animation-delays back into
the CSS to resync after a pause. Two clocks that have to agree can stop
agreeing. Here the counter is CSS running off the same timeline as the
photos, so it cannot drift, and pausing is one class on the <body> that lets
the browser freeze its own animations.


CREDIT
------
The shutter effect began as the pure-CSS pen "Untitled Slider" by Nathan
Taylor (codepen.io/nathantaylor/pen/PJGqdE), which you pointed me at. This
port follows your AI Studio version of it, including the two places your
version had already improved on the pen: the tint that lifts at the pause,
and two keyframe timing functions the pen had misspelt as
"animation-timing-functon" so the browser silently ignored them.
