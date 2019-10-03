import React, { Fragment } from 'react';
import "./styles.scss";

import Header from "../Appointment/Header";
import Show from "../Appointment/Show";
import Empty from "../Appointment/Empty";
import useVisualMode from "../../hooks/useVisualMode";
import Form from "../Appointment/Form";
import Status from "../Appointment/Status";
import Confirm from "../Appointment/Confirm";
import Error from "../Appointment/Error";
const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const EDIT = "EDIT";
const CONFIRM = "CONFIRM";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";


export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY,
    props.id,
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    props.bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(error => transition(ERROR_SAVE, true));
  }

  function deleteInterview() {
    transition(DELETING, true);

    props.cancelInterview(props.id)
      .then((response) => transition(EMPTY))
      .catch(error => transition(ERROR_DELETE, true));
  }

  return (<article className="appointment">
    <Header time={props.time} />
    {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
    {mode === SHOW && (
      <Show
        student={props.interview.student}
        interviewer={props.interview.interviewer}
        onDelete={() => transition(CONFIRM)}
        onEdit={() => transition(EDIT)}
      />
    )}
    {mode === CREATE && (
      <Form
        name={props.student}
        interviewers={props.interviewers}
        interviewer={props.interviewer}
        onSave={save}
        onCancel={back}
      />
    )}
    {mode === SAVING && <Status message="SAVING" />}
    {mode === DELETING && <Status message="DELETING" />}
    {mode === CONFIRM && (
      <Confirm
        message="Are you sure you would like to delete?"
        onCancel={back}
        onConfirm={deleteInterview}
      />
    )}
    {mode === EDIT && (
      <Form
        name={props.interview ? props.interview.student : props.student}
        interviewers={props.interviewers}
        interviewer={props.interview ? props.interview.interviewer.id : props.interviewer}
        onSave={save}
        onCancel={back}
      />
    )}
    {mode === ERROR_DELETE && (<Error
      message="Could not delete Appointment"
      onClose={back} />)}
    {mode === ERROR_SAVE && (<Error
      message="Could not save Appointment"
      onClose={back} />)}

  </article>);

}