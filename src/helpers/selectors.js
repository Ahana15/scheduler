export function getAppointmentsForDay(state, day) {
  let filteredDays = [];
  for (let days of state.days) {
    if (days.name === day) {
      for (let appointment of days.appointments) {
        filteredDays.push(state.appointments[appointment]);
      }
    }
  }
  return filteredDays;
}

export function getInterview(state, interview) {
  if (!interview)
    return null;

  let interviewObject = {};
  for (let key in state.interviewers) {
    if (Number(key) === interview.interviewer) {
      interviewObject = {
        "student": interview.student,
        "interviewer": {
          "id": Number(key),
          "name": state.interviewers[key].name,
          "avatar": state.interviewers[key].avatar
        }
      }
    }
  }
  return interviewObject;
}

export default { getAppointmentsForDay, getInterview }