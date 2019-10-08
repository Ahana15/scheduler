import { useEffect, useReducer } from "react";
import axios from "axios";

import {
  reducer,
  SET_DAY,
  SET_INTERVIEW,
  SET_APPLICATION_DATA
} from "../reducers/application";

export default function useApplicationData() {
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => dispatch({ type: SET_DAY, value: day });

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ]).then(all => {
      dispatch({
        type: SET_APPLICATION_DATA,
        value: {
          days: all[0].data,
          appointments: all[1].data,
          interviewers: all[2].data,
          day: "Monday"
        }
      });
    });
  }, []);

  useEffect(() => {
    const newSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
    newSocket.onopen = function(event) {
      newSocket.onmessage = function(event) {
        let data = JSON.parse(event.data);
        if (data.type === "SET_INTERVIEW") {
          dispatch({ type: SET_INTERVIEW, data });
        }
      };
    };
    return () => {
      newSocket.close();
    };
  }, []);

  function bookInterview(id, interview) {
    let data = { id: id, interview: interview };
    return axios
      .put(`/api/appointments/${id}`, { interview })
      .then(() => dispatch({ type: SET_INTERVIEW, data }));
  }

  function cancelInterview(id) {
    let data = { id: id, interview: null };
    return axios
      .delete(`/api/appointments/${id}`)
      .then(() => dispatch({ type: SET_INTERVIEW, data }));
  }
  return { state, setDay, bookInterview, cancelInterview };
}
