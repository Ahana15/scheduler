
import React, { useState, useEffect, useReducer } from "react";
import axios from "axios";

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";
const SET_DAYS = "SET_DAYS";

function reducer(state, action) {
  switch (action.type) {
    case SET_DAY:
      return { ...state, day: action.value }
    case SET_APPLICATION_DATA:
      return { ...state, day: action.value.day, days: action.value.days, appointments: action.value.appointments, interviewers: action.value.interviewers }
    case SET_INTERVIEW: {
      return { ...state, appointments: action.appointments }
    }
    case SET_DAYS: {
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
      .then(() => axios.get("/api/days"))
      .then((res) => dispatch({ type: SET_DAYS, days: res.data }));
  }

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: { interview: null }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios({
      method: 'DELETE',
      url: `/api/appointments/${appointment.id}`,
    }).then(() => dispatch({ type: SET_INTERVIEW, appointments }))
      .then(() => axios.get("/api/days"))
      .then((res) => dispatch({ type: SET_DAYS, days: res.data }));

  }
  console.log(state.days);
  return { state, setDay, bookInterview, cancelInterview };
}