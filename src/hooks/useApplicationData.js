
import React, { useEffect, useReducer } from "react";
import axios from "axios";

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";
const SET_REMAININGSPOTS = "SET_REMAININGSPOTS";

const updateObjectInArray = (array, action) => {
  return array.map((item, index) => {
    if (index !== action.index) {
      return item;
    }
    return {
      ...item,
      spots: action.item
    };
  });
}

function reducer(state, action) {
  switch (action.type) {
    case SET_DAY:
      return { ...state, day: action.value }
    case SET_APPLICATION_DATA:
      return { ...state, day: action.value.day, days: action.value.days, appointments: action.value.appointments, interviewers: action.value.interviewers }
    case SET_INTERVIEW: {
      return { ...state, appointments: action.appointments }
    }
    case SET_REMAININGSPOTS: {
      return { ...state, days: action.days }
    }
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}

export default function useApplicationData() {
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const getDayIdAndSpots = (interviewId, appointments) => {
    let ans = { dayID: null, spotsRemaining: 0 };
    for (let day of state.days) {
      for (let appointment of day.appointments) {
        if (interviewId === appointment) {
          ans.dayID = day.id - 1;
          let dayKey = ans.dayID;
          for (let appointment of state.days[dayKey].appointments) {
            if (appointments[appointment].interview === null) {
              ans.spotsRemaining++;
            }
          }
        }
      }
    }
    return ans;
  }


  const setDay = day => dispatch({ type: SET_DAY, value: day })

  useEffect(() => {
    Promise.all([
      (axios.get("/api/days")),
      (axios.get("/api/appointments")),
      (axios.get("/api/interviewers"))
    ]).then((all) => {
      dispatch({ type: SET_APPLICATION_DATA, value: { days: all[0].data, appointments: all[1].data, interviewers: all[2].data, day: "Monday" } });
    });

  }, []);

  useEffect(() => {
    const exampleSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
    exampleSocket.onopen = function (event) {
      exampleSocket.onmessage = function (event) {
        if (state.days.length > 0) {
          console.log(state);
          let data = JSON.parse(event.data)
          if (data.type === "SET_INTERVIEW") {
            if (data.interview === null) {
              const appointment = {
                ...state.appointments[data.id],
                interview: null
              };
              const appointments = {
                ...state.appointments,
                [data.id]: appointment
              };
              dispatch({ type: SET_INTERVIEW, appointments });
              let days = updateObjectInArray(state.days, {
                index: getDayIdAndSpots(data.id, appointments).dayID,
                item: getDayIdAndSpots(data.id, appointments).spotsRemaining
              });
              dispatch({ type: SET_REMAININGSPOTS, days })
            } else {
              const appointment = {
                ...state.appointments[data.id],
                interview: { ...data.interview }
              };
              const appointments = {
                ...state.appointments,
                [data.id]: appointment
              };
              dispatch({ type: SET_INTERVIEW, appointments });
              let days = updateObjectInArray(state.days, {
                index: getDayIdAndSpots(data.id, appointments).dayID,
                item: getDayIdAndSpots(data.id, appointments).spotsRemaining
              });
              dispatch({ type: SET_REMAININGSPOTS, days })
            }
          }
        }
      }
    };
    return () => {
      exampleSocket.close();
    }
  });

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };


    return axios({
      method: 'PUT',
      url: `/api/appointments/${appointment.id}`,
      data: { interview }
    }).then(() => dispatch({ type: SET_INTERVIEW, appointments }))
      .then(() => {
        let days = updateObjectInArray(state.days, {
          index: getDayIdAndSpots(id, appointments).dayID,
          item: getDayIdAndSpots(id, appointments).spotsRemaining
        });
        dispatch({ type: SET_REMAININGSPOTS, days });
      });
  }

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios({
      method: 'DELETE',
      url: `/api/appointments/${appointment.id}`,
    }).then(() => dispatch({ type: SET_INTERVIEW, appointments }))
      .then(() => {
        let days = updateObjectInArray(state.days, {
          index: getDayIdAndSpots(id, appointments).dayID,
          item: getDayIdAndSpots(id, appointments).spotsRemaining
        });
        dispatch({ type: SET_REMAININGSPOTS, days });
      });
  }
  return { state, setDay, bookInterview, cancelInterview };
}