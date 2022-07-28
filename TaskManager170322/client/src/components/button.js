import React from "react";

function Button(props) {
  return (
    <>
      <div className={"button " + props.color}></div>
    </>
  );
}
export default Button;
