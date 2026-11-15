# Climate Poet

Climate Poet is a website that turns real NASA climate data into sound and poetry.

## The problem

Climate data is everywhere, but it is usually just charts and tables. Most people look at it and move on. They know climate change is happening, but they do not feel it.

## What it does

You pick a place and a year. The site loads daily temperature and rainfall records from NASA POWER and groups them by month.

You can hear the data. The Earth Jukebox plays the twelve monthly values as notes, so a year of rainfall or heat becomes a melody. Higher numbers make higher notes. January plays first, then February, and so on.

You can also write about it. The Poetry Studio lets you write a poem inspired by what you saw or heard. You can save drafts, record yourself reading, have the browser read the poem out loud, or download it. A button can also ask an AI to write a poem using the data you loaded, so the poem stays tied to the actual numbers.

The community page shows poems people submitted and that got approved.

## How it works

The site is built with plain HTML, CSS, and JavaScript. When you pick a place and year, the page asks a small server function to fetch the daily records from NASA POWER. That function sends back monthly averages for temperature and monthly totals for rainfall, and the page draws the chart and table from that.

The Jukebox takes those twelve monthly numbers and maps each one to a note. Higher values land higher on a scale, lower values land lower. A timer plays the notes in order from January to December, and the bars on screen light up with each month.

The Poetry Studio keeps drafts in your browser, so they stay on your device until you submit them. The AI buttons send only the loaded numbers and your poem text to the server, which calls the AI model and sends the result back. The community page reads approved poems from a database, and new submissions wait for review before they appear.

