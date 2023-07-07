# Emissions Dashboard App

The Emissions Dashboard app is a React-based web application for visualizing emissions data. It allows you to view emissions data on either a weekly or monthly basis, with or without interpolation of missing data.

## Installation

Before installing the app, please ensure you have [Node.js](https://nodejs.org/) installed on your system.

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/RomanBromidge/CarbonDataVisualisation.git
   ```

2. Navigate into the project directory:

   ```bash
   cd CarbonDataVisualisation
   ```

3. Install the required dependencies:

   ```bash
   npm install
   ```

## Running the App

To start the application, use the command:

```bash
npm run dev
```

The app will then be served at `http://localhost:3000`.

## Using the App

Once the app is running, you will see a graph showing the emissions data over a certain period. You can interact with the data visualization using the provided buttons:

1. **View Type**: Use the buttons "View by Weeks" and "View by Months" to switch between displaying weekly and monthly data.

2. **Interpolation**: Use the buttons "No Interpolation", "Best Fit Interpolation", and "Pro Rata Interpolation" to decide whether to fill missing data points and which method to use for data interpolation.

The graph will automatically update based on your selections. The y-axis represents the amount of emissions (tCO2e), while the x-axis represents the period (either weeks or months, depending on the chosen view type).

Enjoy exploring the emissions data!
