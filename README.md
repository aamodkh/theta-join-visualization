# Visualizing Ranked Theta-Join Results

Link to GitHub pages website: https://aamodkh.github.io/theta-join-visualization

# Instructions
The project is live at the link provided above. If you are interested on running it locally, please run the setup steps below.

## Setup

1. Clone this repository to your local machine.
    E.g., in your terminal / command prompt `CD` to where you want this the folder for this activity to be. Then run `git clone https://github.com/ak53amod/theta-join-visualization`

1. `CD` or open a terminal / command prompt window into the cloned folder.

1. Start a simple python webserver. E.g., `python -m http.server`, `python3 -m http.server`, or `py -m http.server`. If you are using python 2 you will need to use `python -m SimpleHTTPServer` instead, but please switch to python 3 as [Python 2 was sunset on 2020-01-01](https://www.python.org/doc/sunset-python-2/).

1. Wait for the output: `Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/)`.

1. Now open your web browser (Firefox or Chrome) and navigate to the URL: http://localhost:8000

## Organization

Here is an overview of the files and folders in the repo.

### Root Files
* `README.md` is the explanatory file for the repo.

* `index.html` contains the main website content. It includes comments surrounded by `<!--` and `-->` to help and guide you through making the edits.

* `style.css` contains the CSS.

* `LICENCE` is the source code license for the template.

### Folders
Each folder has an explanatory `README.md` file.

* `data` contains the visualization data.


* `favicons` contains the favicons for the web page.

* `files` contains the slides (PDF), project report (PDF) and video (MP4).

* `img` contains the screenshots, diagrams, and photos.

* `js` contains all JavaScript files.

  * `visualization.js` is the main code that builds the visualizations. Each visualization is built following the [Reusable Chart model](https://bost.ocks.org/mike/chart/), ideally with a separate .js file for each one.

* `lib` contains JavaScript library used in the project. It currently includes D3.

* `preprocess` contains the MapReduce code and its dependencies to preprocess the original dataset and obtain the visualization dataset.
