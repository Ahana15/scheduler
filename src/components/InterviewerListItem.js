import React from "react";
import "components/InterviewerListItem.scss";

// const classNames = require('classnames');

export default function InterviewerListItem(props) {
  const itemClass = `interviewers__item ${props.selected ?
    "interviewers__item--selected" : ""}`;



  return (
    <li className={itemClass} onClick={props.setInterviewer}>
      <img
        className="interviewers__item-image"
        src={props.avatar}
        alt={props.name}
      />
      {props.selected && props.name}
    </li>
  );

}