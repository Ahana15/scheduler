const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

const updateSpotsInDay = (array, action) => {
  return array.map((item, index) => {
    if (index !== action.index) {
      return item;
    }
    return {
      ...item,
      spots: action.item
    };
  });
};

const getDayIdAndSpotsRemaining = (interviewId, days, appointments) => {
  let updatedDay = { dayID: 0, spotsRemaining: 0 };
  for (let day of days) {
    let counterSpots = 0;
    let appointmentFound = false;
    for (let appointment of day.appointments) {
      if (interviewId === appointment) {
        updatedDay.dayID = day.id - 1;
        appointmentFound = true;
      }
      if (appointments[appointment].interview === null) {
        counterSpots++;
      }
    }
    if (appointmentFound) {
      updatedDay.spotsRemaining = counterSpots;
    }
  }
  return updatedDay;
};

const reducer = (state, action) => {
  switch (action.type) {
    case SET_DAY:
      return { ...state, day: action.value };
    case SET_APPLICATION_DATA:
      return {
        ...state,
        day: action.value.day,
        days: action.value.days,
        appointments: action.value.appointments,
        interviewers: action.value.interviewers
      };
    case SET_INTERVIEW: {
      const appointment = {
        ...state.appointments[action.data.id],
        interview: action.data.interview ? action.data.interview : null
      };
      const appointments = {
        ...state.appointments,
        [action.data.id]: appointment
      };
      let days = updateSpotsInDay(state.days, {
        index: getDayIdAndSpotsRemaining(
          action.data.id,
          state.days,
          appointments
        ).dayID,
        item: getDayIdAndSpotsRemaining(
          action.data.id,
          state.days,
          appointments
        ).spotsRemaining
      });

      return { ...state, appointments, days };
    }
    default:
      throw new Error(
        `tried to reduce with unsupported action type: ${action.type}`
      );
  }
};

export { reducer, SET_DAY, SET_INTERVIEW, SET_APPLICATION_DATA };
