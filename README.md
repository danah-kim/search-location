# Search Location

![Demo GIF](demo.gif)

Search coordinates and a location title from GPT-3.5-turbo based on a user query, and then renders them as markers on a Leaflet map.

## Technologies

- Next.js
- OpenAI SDK
- React-Leaflet

## Installation

1. Clone the repository

```
git clone https://github.com/danah-kim/search-location
```

2. Navigate to the project folder and install dependencies

```
cd your-project-folder
npm install
```

3. Add your OpenAI API key to a `.env` file

```
OPENAI_API_KEY=your-api-key-here
```

4. Start the development server

```
npm run dev
```

## Usage

1. Open the application in a browser.
2. Enter a query in the input field.
3. Click Icon or press Enter to get the coordinates and title which will be displayed on the map.
