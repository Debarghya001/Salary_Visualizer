# Salary Visualizer

## Project Overview

The Salary Visualizer project analyzes and visualizes Machine Learning Engineer salaries from 2020 to 2024. It provides insights into job counts and average salaries, allowing users to explore and interact with the data effectively.

## Features

1. **Main Table**:
   - Displays the following columns:
     - **Year**
     - **Number of Total Jobs** for that year
     - **Average Salary** in USD
   - Users can sort the table by any column.

2. **Analytics**:
   - A line graph that shows how the number of jobs has changed from 2020 to 2024.
   - Interactive functionality: Clicking on a row in the main table displays a second table with:
     - Aggregated job titles for the selected year.
     - The count of how many times each job title appeared in that year.

## Technologies Used

- **Frontend**: 
  - React
  - CSS
  - Axios (for data fetching, if using an API)
  - Papa Parse (for CSV parsing, if using a file)
  - **Recharts** (for creating the line graph)

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/Debarghya001/Salary_Visualizer.git

2. Navigate to the project directory:

   ```bash
    cd Salary_Visualizer

3. Install the required dependencies:

   ```bash
    npm install

4. Place your CSV file in the public directory for easy access.

5. Start the development server:

   ```bash
    npm start

6. Open your browser and go to http://localhost:3000 to see the application in action.