import React from "react";

function Message(props) {
  if (props.on) {
    setTimeout(() => {
      props.timer();
    }, 10000);
  }

  const clear = () => {
    clearTimeout();
    props.timer();
  };

  return props.on ? (
    <div className="message flex-center flex-col">
      <div className={"response flex-col flex-center " + props.type}>
        <p className="message_text">{props.text}</p>
        <button className="button-clear" onClick={clear}>
          OK
        </button>
      </div>
    </div>
  ) : null;
}

export default Message;
