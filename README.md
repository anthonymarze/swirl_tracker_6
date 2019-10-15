# Swirl Tracker 6

## Background and Overview
I've been interested in unusual tropical storm tracks ever since seeing the comprehensive wikipedia articles on each years storm tracks.  However, I felt that the data could be represented much better in an interactive way.  With Swirl Tracker 6, you can select past storms by name, intensity, damage, or location.  The quick responsiveness will make it easier to compare different storms in a visual manner.

## Functionality
Swirl Tracker 6 will allow users to visualize historical, named tropical storm paths.  Paths can be selected by a multitude of attributes, or with a manual click.

### MVPs
* Accurate, georeferenced background map with zooming and panning
* North American tropical storm and hurricane paths since NOAA started recording loction data of storms
* A user interface that allows for selecting paths based on intensity, monetary damage, fatalities, year, and month.
* Quick stats showing the basic summary of information for one storm when selected
* A storm name search bar that can select storms by name
* A click mechanism that allows the user to select a radius around a click in which all storms which passed through that area will be highlighted

### BONUS
* Storm Routes color-coded temporaly by when intensity changed throughout the lifecylce of the storm
* Comparsion line/bar charts between selected storms
* Adding Pacific storm data
* Adding selectable map projections

## Architecture and Technologies
* JavaScript makes up all parts of the structure of the application.
* NOAA API for the raw storm data to be visualized.
* Webpack for bundling the project together to be properly displayed online
* mapbox.js for displaying the basemap to place the data over

## Implementation Timeline

* Monday
Write project proposal, identify data sources, and create visual mockup

* Tuesday
Create basemap and incorporate any backend necessary.  Learn the basics to node.js and the NOAA api.  Setup the webpack config file.

* Wednesday
Specify the parts of the dataset needed for my application.  Try and draw routes on map using the coordinate data from NOAA.

* Thursday
Incorporate all the buttons the user can use to specify different attribute values for the dataset, and allow the data to display properly on the viewer.  Show individual views of the details for each storm.

* Friday
Implement the name search feature and radius click feature.  If extra time, try adding Pacific storm data and temporal coloring.

* Weekend
Enusre the user interface works smoothly.  Design a better logo, and try working on the before mentioned bonus features if there is time.