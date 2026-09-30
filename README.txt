ROTATING SHUTTER SLIDESHOW
Plain HTML + CSS. No React, no build step, no npm, no outside connections.


WHAT TO DO WITH THESE FILES
---------------------------
Upload the whole folder to your PHP server, anywhere you like, and open it in
a browser. That is the entire install. It works from the site root or from a
subfolder (every path in the files is relative), and it does not need PHP at
all, so you can also rename index.html to index.php if that suits your setup
better.


THE FILES
---------
index.html      the page. The four photos are listed here, one line each.
animation.css   the whole effect: shutters, tilt, hue cycle, tint. Commented.
overlays.css    OPTIONAL. Fullscreen button, live counter, QR code.
overlays.js     OPTIONAL. Makes the fullscreen button work. Nothing else.
photos/         photo-1.jpg ... photo-4.jpg
fonts/          the two webfonts, served from your server, not from Google
qr.png          placeholder QR code
README.txt      this file


THE CHANGE YOU ASKED FOR
------------------------
In the original effect the rust tint sits on the photo the whole time. Here
the tint lifts off while each photo's rotation is paused, so you see the
photo in its true colours, and then the tint comes back as the photo swings
away again.

The same photo is painted twice, one copy on top of the other: a plain
untouched copy, and a tinted copy above it. Fading the tinted copy out during
the pause reveals the untouched one. That is all there is to it.

To turn it off and get the original constant tint back, open animation.css,
find .slide__tint, and delete this one line:

    tintOffAtPause var(--slide-time) ease-in-out infinite,

To change how long the true colours are on screen, edit the @keyframes
tintOffAtPause block right underneath. The numbers are percentages of one
photo's 5 seconds; 44% to 62% is the window where the tint is fully off.


SWAPPING IN YOUR OWN PHOTOS
---------------------------
Drop your files into photos/ and edit the four --photo lines in index.html:

    <div class="slide" style="--photo: url('photos/photo-1.jpg')">

Also update the four matching <link rel="preload"> lines in the <head> so the
first cycle stays smooth. Nothing in the CSS needs touching.

Landscape photos around 1600-2000px wide look best. They are drawn with
"background-size: cover", so they fill the screen and crop rather than
stretch, whatever shape they are.


ADDING OR REMOVING PHOTOS
-------------------------
There is nothing hard-coded to four, but three things have to agree:

1. the number of .slide blocks in index.html
2. the matching nth-child lines in animation.css, under "PHOTO LIST"
3. --cycle at the top of animation.css, which must be --slide-time times the
   number of photos

For five photos: add a fifth .slide, add
.slide:nth-child(5) { animation-delay: calc(var(--slide-time) * 4); }
and set --cycle to calc(var(--slide-time) * 5). If you use the counter
overlay, add a fifth <span class="counter__n">05</span> and a fifth
nth-of-type line in overlays.css, and change "/ 04" to "/ 05".


THINGS YOU MIGHT WANT TO CHANGE
-------------------------------
All at the top of animation.css:

  --slide-time   seconds per photo (default 5s). Change --cycle to match.
  --tint         the rust colour of the shutters and the tint (#b3401a)
  --hue-offset   nudges the colour change into the moment the shutters are
                 shut, so you never catch the colour sliding. Leave alone.

Captions: remove class="has-captions" from the <body> tag to hide the big
text on every photo, without deleting anything.

Overlays: delete the overlays.css and overlays.js lines from index.html plus
the three .overlay blocks near the bottom of index.html, and you are left
with nothing but the animation. The live counter is pure CSS and keeps
working without overlays.js; only the fullscreen button needs it.

QR code: replace qr.png with your own image and put the same address in the
href of the surrounding <a> in index.html, so a mouse click goes to the same
place a phone camera does. Tell me the address and I will generate the code
for you.


NO OUTSIDE CONNECTIONS
----------------------
Checked with the browser's own network log: loading this page makes requests
for these files only, and nothing else. There is no CDN, no Google Fonts, no
analytics, no tracking, no fonts.googleapis.com, and the photos are local
rather than pulled from unsplash.it the way the original CodePen did it.

The fonts are Abril Fatface and Roboto Mono, the two faces the original
design uses. They are included here as .woff2 files and served from fonts/.


BROWSER SUPPORT
---------------
Chrome, Edge, Firefox and Safari, desktop and mobile. The effect is all CSS
animation, hard-light background blending and hue-rotate, which have been
supported everywhere since about 2016. There is no JavaScript in the
animation at all, so nothing can fall out of sync: the counter and the photos
run off the same timeline and stay locked together indefinitely.


CREDIT
------
The shutter effect is a port of the pure-CSS pen "Untitled Slider" by Nathan
Taylor (codepen.io/nathantaylor/pen/PJGqdE), which you pointed me at, with
the pause-state tint removal added and the assets brought in-house.

While porting it I kept two small bugs out of the new version:
  - the original loaded photos 2, 3 and 4 only when their turn came, so the
    first cycle showed empty frames. They are preloaded here.
  - two keyframes in the original stylesheet spelt the property
    "animation-timing-functon", so the browser ignored them. They are written
    out correctly here as the value the browser actually used, which means
    the motion is unchanged.
