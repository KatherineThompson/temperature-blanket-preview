# Temperature Blanket Preview
[![Build Status](https://travis-ci.org/KatherineThompson/temperature-blanket-preview.svg?branch=master)](https://travis-ci.org/KatherineThompson/temperature-blanket-preview)

A webapp to aid in choosing colors for a knitted/crocheted blanket using weather data
from a specific location to plot out the colors. Each row of the blanket corresponds
to a maximum or minimum temperature for that location.

##Technologies Used
* CSS
    * [Autoprefixer](https://github.com/postcss/autoprefixer)
    * [Foundation for Apps](http://foundation.zurb.com/apps/docs/#!/)
    * [Sass](http://sass-lang.com/)

* HTML

* JavaScript ES2015
    * [Angular](https://angularjs.org/)
    * [Babel](http://babeljs.io/)
    * Canvas API
    * [ESLint](http://eslint.org/)
    * [Lodash](https://lodash.com/)
    * [Moment](http://momentjs.com/)
    * [tape](https://www.npmjs.com/package/tape)
    * [Webpack](https://webpack.github.io/)

##What I Learned
This webapp is an improvement upon one of my early projects. The easiest yet very crucial change was separating the
code into different files and adding tests. This was especially useful for the more math-oriented functions that are involved
in drawing on the canvas since it allowed me to rely on more than just looking at the canvas to see if it was mostly correct.
Similarly, creating a render pipeline rather than one big function made the drawing logic easier to reason about and test.
Adding angular was a total game changer for the form elements and drawing the canvas. The two way binding simplified
getting and using the input from the form elements. Being able to separate the canvas into a 
directive provided simplification of the html and keeps everything to do with the canvas nicely organized together.

Learning to use the Canvas API was a lot of fun and I'm excited that it opens up more options for visually striking
projects. Foundation and Sass continue to be awesome. Foundation's grid is system is phenomenally helpful
when creating the layout as are the utility classes. I did have some frustration with Foundation's lack of fixed
width elements when I was working on the sidebar, but otherwise it was great. The slide out panel element is a great place to add
extra information that doesn't need to be on the page at all times. For a primarily visual project, it was important to 
have the text off-screen and the panel helped me achieve that. Sass is always lovely. While I had less need for it on
this project due to the canvas taking up most of the page, having the ability to use variables and `@extend` rules
was extremely useful.

I tried ESLint on this project and found it easy to use and helpful. I like that it provides consistency and
helps to prevent errors. Having Babel lets me use ES2015 features like fat arrows, destructuring, and const/let, all of
which help me to write code that is easier to read and reason about. I love that webpack allows me to use multiple files
and provides inline source maps. Autoprefixer takes away some of the stress of cross browser issues. Tape along with
Travis CI makes it really easy to test my code.

##Areas for Future Development
* Adding a color picker or other workaround for browers that only provide a text box for `<input type="color">`
* Improving the layout, especially for mobile
* Fixing the canvas image to be sharper
* Adding the ability to use any location and any period of time
* Adding the ability to zoom on the canvas
* Adding information about which colors are used for which range of temperatures and what percentage of the total area
each color takes up.
* Adding more customization options for the blanket