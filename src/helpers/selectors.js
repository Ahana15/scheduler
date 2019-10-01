export default function getAppointmentsForDay(state, day) {
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