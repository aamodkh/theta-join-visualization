# Assignment — D3 Event Handling

This repository is your starting point for the assignment and includes the instructions below.

Link to your GitHub pages website: `[insert your *clickable* hyperlink here]`

# Aim of the assignment

Using events is critical for implementing interactive visualizations using D3.
In this assignment you will learn how to handle and create new events with `d3-dispatch`. 
(This is particularly important for the upcoming brushing & linking assignment.)
You will not have to create any new chart, you will just demonstrate your understanding of how events work.

# Instructions
Please look through **all** the materials below so you understand the setup instructions; how to run, organize, and submit your code; and our requirements for the visualization.

## Setup

**Under no circumstances should you be editing files via the GitHub website user interface.** Do all your edits locally after cloning the repository. Commit major versions to your git repository.

1. Clone this repository to your local machine.
    E.g., in your terminal / command prompt `CD` to where you want this the folder for this activity to be. Then run `git clone <YOUR_REPO_URL>`

1. `CD` or open a terminal / command prompt window into the cloned folder.

1. Start a simple python webserver. E.g., `python -m http.server`, `python3 -m http.server`, or `py -m http.server`. If you are using python 2 you will need to use `python -m SimpleHTTPServer` instead, but please switch to python 3 as [Python 2 was sunset on 2020-01-01](https://www.python.org/doc/sunset-python-2/).

1. Wait for the output: `Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/)`.

1. Now open your web browser (Firefox or Chrome) and navigate to the URL: http://localhost:8000

## Update hyperlinks

1. Edit near the top of this `README.md` file to include a clickable hyperlink to the GitHub pages website for your repo., replacing the `` `[insert your *clickable* hyperlink here]` `` code with your markdown. (Detailed instructions for GitHub pages [here](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Using_Github_pages).)

1. In `index.html` update the GitHub repo URL with the URL of your repository. It is in the span with `id='forkongithub'`.

## Organization

Here is an overview of the files and folders we provide for you in your repo.

### Root Files
* `README.md` is this explanatory file for the repo.

* `index.html` contains the main website content.

* `style.css` contains the CSS.

* `LICENCE` is the source code license for the template. You can add your name or leave it as is.

### Folders
Each folder has an explanatory `README.md` file.

* `favicons` contains the favicons for the web page. You shouldn't change anything here.

* `.github` contains [GitHub Actions](https://github.com/features/actions) ([docs](https://docs.github.com/en/actions)) which will automatically validate your HTML, CSS, and hyperlinks when you push (see the [**validation last step** below](#validated)). **Do not edit files here** except to create new `.yml` files for any additional actions you choose to add (you are not required to make any).

* `img` contains a descriptive image for the `README.md`.

* `js` will contain all JavaScript files you write. E.g.,

  * `main.js` is the js code that you will have to fill in.

* `lib` will contain any JavaScript library you use. It currently includes D3. To ensure long-term survivability, **use the included D3 here rather than linking to [d3js.org](https://d3js.org) or some other CDN.** Likewise, put your other libraries here rather than loading them from elsewhere.

## Implement Custom Click Event

`js/main.js` creates an svg inside the `div` with id `#vis1` and draws a square and a circle for you.
You will be creating a new custom event type to handle clicking on a pre-existing **square** in an svg.
When the square is clicked, the **circle** should change color to **red**.

Implement the following functionality as part of `js/main.js`.

As you work, make your edits and commit major versions to your git repository.

1. Define a custom event `changeColor` using [d3-dispatch](https://github.com/d3/d3-dispatch).

1. Create an event listener that dispatches a `changeColor` event when the **square** is clicked.

    There are pre-existing DOM events for [`click`](https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event) and [`mousedown`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mousedown_event) which are part of the [standard DOM events](https://developer.mozilla.org/en-US/docs/Web/Events#Standard_events).
    You may listen for a `click` or `mousedown` event and use it to then dispatch the `changeColor` event using `d3-dispatch`.

1. Create an event listener using `d3-dispatch` that is triggered on a `changeColor` event and changes the **circle's** color to **red**.

    Do not simply have a listener on the **square** that changes the color directly, e.g., *`selection`*`.on('click', function(d, i){ // code that changes the color });`
    **You must use `d3-dispatch` to send and listen for a custom `changeColor` event.**

    We are aware that the same objective can be obtained by using standard predefined DOM events.
    However, learning how to use `d3-dispatch` correctly will be especially useful to you in the upcoming brushing and linking assignment.
    In that assignment you will create multiple modular yet linked visualizations and you will want your code to be more loosely coupled and easier to manage.
    The brushing and linking assignment will be impossible to do without first understanding `d3-dispatch`.

1. <a name='validated'></a> Ensure your code passes the 'Validate HTML, CSS, and Links' checks we run when you push to GitHub. I.e., you want to see a green check next to your commit
  (<svg width='16' height='16' role='img'><path stroke='#22863a' d='M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z'></path></svg>)
  and not a red X
  (<svg width='16' height='16' role='img'><path stroke='#cb2431' d='M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z'></path></svg>).
You can also see the results in the Actions tab of your repo:
![GitHub Actions tab](img/gh-actions.png)

## Bonus: Implement Custom Double-Click Event

To get a 1-point bonus on your grade, additionally implement the following functionality as part of `js/main.js`.

1. Similar to before, and continuing to use `d3-dispatch`, implement a custom `changeColor2` event.

1. Create an event listener that dispatches a `changeColor2` event when the **circle** is **double-clicked**.

    A double-click is two clicks in a very short period of time. In order to implement a double-click, you will need to use a timer, like this:

    ```
    setTimeout(function, milliseconds);
    ```
    Reference: [Javascript timing events.](https://www.w3schools.com/js/js_timing.asp)

    **Using the pre-existing [`dblclick` DOM event](https://developer.mozilla.org/en-US/docs/Web/API/Element/dblclick_event) is not allowed in this submission.**

1. Create an event listener using `d3-dispatch` that is triggered on a `changeColor2` event and changes the **square's** color to **green**.


Points will not be deducted for failing this bonus step, but make sure that the code in your GitHub repository works properly for the first step from the time of the deadline onwards.

# Academic integrity
You are welcome to use D3 tutorials or resources as a starting point for your code.
However, **you must cite and reference the resources or sample code you use and explain how you use them**.
***This includes anything from [bl.ocks.org](https://bl.ocks.org/), [Observable](https://observablehq.com/@d3/gallery), or [Stack Overflow](https://stackoverflow.com/)!***
Failure to properly cite and attribute code is a breach of academic honesty.
Also, per our syllabus, homework is an individual assessment and should be completed by you alone.
Simply copying existing examples without performing thoughtful edits is a breach of academic honesty.
You are welcome to ask fellow classmates and students for help and discuss the assignment, but **the submission should be your own work**.
***See [the syllabus](https://northeastern.instructure.com/courses/63405) for much more detail on our academic integrity policy and expectations.***

# Submission instructions

1. Ensure you added (1) the GitHub Pages URL at the top of this `README.md` file as a clickable hyperlink  and (2) the GitHub repository URL in `index.html` in the span with `id='forkongithub'`.

1. Commit all your local files and push them to the remote repository on GitHub which was generated by GitHub Classroom. We will grade based on what is visible on the GitHub Page.

1. Submit the URL of **your GitHub Classroom-generated repository** (not your GitHub Page) to [the associated assignment on Canvas](https://northeastern.instructure.com/courses/63405/assignments/874481). **Do not submit a link to a personal repository. It must be within our class GitHub organization.**

# Tips, tricks, and troubleshooting

See https://github.com/NEU-CS-7250-S21-Staff/General_Course_Information/.

There are [a ton of built-in browser DOM events](https://developer.mozilla.org/en-US/docs/Web/Events) that you can leverage in general!

# Assignment setup (for instructors only)

See https://github.com/NEU-CS-7250-S21-Staff/General_Course_Information/blob/master/assignment-setup.md
