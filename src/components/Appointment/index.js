import React, { Fragment } from 'react';
import "./styles.scss";

import Header from "../Appointment/Header";
import Show from "../Appointment/Show";
import Empty from "../Appointment/Empty";
import useVisualMode from "../../hooks/useVisualMode";
import Form from "../Appointment/Form";
import Status from "../Appointment/Status";
import Confirm from "../Appointment/Confirm";
const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";


export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );
  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    props.bookInterview(props.id, interview).then(() => transition(SHOW));
  }
  function deleteInterview() {
    transition(DELETING);
    props.cancelInterview(props.id).then(() => transition(EMPTY));
  }
  function confirmDeleteInterview() {
    transition(CONFIRM);
  }
  function editThisInterview() {
    transition(EDIT);
  }

  return (<article className="appointment">
    <Header time={props.time} />
    {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
    {mode === SHOW && (
      <Show
        student={props.interview.student}
        interviewer={props.interview.interviewer}
        onDelete={confirmDeleteInterview}
        onEdit={editThisInterview}
      />
    )}
    {mode === CREATE && (
      <Form
        name={props.student}
        interviewers={props.interviewers}
        interviewer={props.interviewer}
        onSave={save}
        onCancel={() => back()}
      />
    )}
    {mode === SAVING && <Status message="SAVING" />}
    {mode === DELETING && <Status message="DELETING" />}
    {mode === CONFIRM && (
      <Confirm
        message="Are you sure you would like to delete?"
        onCancel={() => back()}
        onConfirm={deleteInterview}
      />
    )}
    {mode === EDIT && (
      <Form
        name={props.interview.student}
        interviewers={props.interviewers}
        interviewer={props.interview ? props.interview.interviewer.id : props.interviewer}
        onSave={save}
        onCancel={() => back()}
      />)}

  </article>);

}