const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

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
      const getDayIdAndSpotsRemaining = (interviewId, appointments) => {
        let updatedDay = { dayID: null, spotsRemaining: 0 };
        for (let day of state.days) {
          for (let appointment of day.appointments) {
            if (interviewId === appointment) {
              updatedDay.dayID = day.id - 1;
              let dayKey = updatedDay.dayID;
              for (let appointment of state.days[dayKey].appointments) {
                if (appointments[appointment].interview === null) {
                  updatedDay.spotsRemaining++;
                }
              }
            }
          }
        }
        return updatedDay;
      };
      const appointment = {
        ...state.appointments[action.data.id],
        interview: action.data.interview ? action.data.interview : null
      };
      const appointments = {
        ...state.appointments,
        [action.data.id]: appointment
      };
      let days = updateObjectInArray(state.days, {
        index: getDayIdAndSpotsRemaining(action.data.id, appointments).dayID,
        item: getDayIdAndSpotsRemaining(action.data.id, appointments)
          .spotsRemaining
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
