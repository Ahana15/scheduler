
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}
  });

  const setDay = day => setState({ ...state, day });

  useEffect(() => {
    Promise.all([
      (axios.get("/api/days")),
      (axios.get("/api/appointments")),
      (axios.get("/api/interviewers"))
    ]).then((all) => {
      setState(prev => ({ days: all[0].data, appointments: all[1].data, interviewers: all[2].data, day: "Monday" }));
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
    }).then(() => setState({ ...state, appointments }));
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
    })
      .then(() => setState({ ...state, appointments }));
    // .catch((error) => console.log('meep', error));
  }

  return { state, setDay, bookInterview, cancelInterview };
}