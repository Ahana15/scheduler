# Interview Scheduler

Interviews can be booked between Monday and Friday. A user can book an interview in an empty appointment slot. Interviews are booked by typing in a student name and clicking on an interviewer from a list of available interviewers. A user can cancel an existing interview and can edit the details of an existing interview. The client application communicates with a WebSocket server as well. When a user books, cancels or edits an interview, all connected users see the update in their browser.

### Application in Action

![Application in action](https://github.com/Ahana15/scheduler/blob/master/interviewSchduler.gif?raw=true)

## Setup

Install dependencies with `npm install`.

- axios
- classname
- normalize.css
- react
- react-dom
- react-scripts

## Running Webpack Development Server

```sh
npm start
```

## Running Jest Test Framework

```sh
npm test
```

## Running Storybook Visual Testbed

```sh
npm run storybook
```
