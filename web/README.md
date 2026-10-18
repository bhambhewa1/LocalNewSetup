## Steps to run Frontend(Task2)
cd web
npm install
npm run dev


## Steps for filters from the list
(1) A search variable take the input from inputfield
(2) Array of filters method shortout the each object which search is matching in name, email, role field
(3) With the help react useState hook set the filters results for listing.


## Each user card must have an Expand toggle 
(1) By using mui component for card creating
(2) By onClick property toggle that component state
(3) By using Collapse element of mui- these cards are expandable

## Connection for websocket in frontend to backend
(1) (socket-io-client) module is implemented on src/app/page.tsx (which is the root component)
(2) From that i set the no. of alerts as task-3 condition (only 5 elements should show and whch is newest)
(3) Live Alerts icon is toggle button to hide and show the live alerts
(4) And Alert component is responsible for showing the alerts