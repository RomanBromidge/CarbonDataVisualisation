# Developer Technical Exercise

The purpose of this exercise is to assess candidates on equal parts data handling, visualisation, and knowledge of appropriate tooling.

## Brief
Our client, "Logo Text Here" has supplied cumulative weekly carbon emissions data in csv format (anon_carbon_data.csv). The data is missing some weeks. We want to display the weekly emissions back to them in a graph that is easy to interpret and interrogate.

### Requirements
1. Transform the data so that it shows weekly carbon emissions, not cumulative.
1. Display the data on a graph with the x axis being months and the y axis being carbon emitted that month in tCO2e (a standard unit).
1. The user will want to "drill down" into the data, by being able to change the x axis into weeks.
1. The user will want to be able to initially view the data "as is", with gaps, i.e. no estimation technique applied to fill the gaps where there is data missing.
1. The user will want to be able to optionally view the data with estimated data where the gaps are, using a line of best fit (using the data before and after gaps to create estimated values).
1. The user will want to be able to optionally view the data with estimated data where the gaps are, using pro rata (using the whole data set to create a weekly average value).
1. Consider animations, tooltips and any other "nice to have" functionality, leaning on your data visualisation library of choice.
 
### Considerations
- Weekly data can be considered missing if the data point doesn't exist, or if the value is 0.0
- Data transformation should be done programmatically, leaving the raw csv file untouched, therefore no excel or similar tools are to be used.
- Any reasonable programming language may be used. Use something comfortable, but capable.
- Once the program has run, the csv file should remain unchanged, and no new csv file created.
- The quality of the visualisation should be such that you would feel comfortable presenting it to a paid client.
- The type and style of the graph should be such that it conveys meaning to the client.
- It is desired that the client eventually access the data through the web, meaning that it must be displayed in the browser.
- The client would like their logo displayed in the top centre, with appropriate padding.
- While the browser aspect is important, please do not create a full user experience, with authentications etc. Just a graph (and associated features/functionality) and logo on a page is sufficient.
- The client will be viewing on a desktop. No need to make it responsive.
- Please prepare a short walkthrough of your code, demonstrating your thought process, tools used, any challenges, and any other relevant information. This should be no more than 5 minutes. No slide deck required.
- Please do not spend more than two hours completing this task. It is not our intention that candidates lose valuable free time completing this exercise. If in doubt, call a halt to the work and present what you have.
- Should you have any questions regarding this brief then email owain at energise dot com

### Best of luck!