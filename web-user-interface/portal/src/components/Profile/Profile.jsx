import React from "react";

import SolidJsToReactWrapper from "../SolidJsToReactWrapper/SolidJsToReactWrapper";
import placeRegister from "manageusers/placeRegister";
import placeLogin from "manageusers/placeLogin";
import placeLogout from "manageusers/placeLogout";

export default function Profile() {
  return (
    <>
      {!sessionStorage.getItem("loggedUser") &&
        <>
          <SolidJsToReactWrapper placeSolidJsComponent={placeRegister} />
          <SolidJsToReactWrapper placeSolidJsComponent={placeLogin} />
        </>
      }
      {sessionStorage.getItem("loggedUser") &&
        <>
          <SolidJsToReactWrapper placeSolidJsComponent={placeLogout} />
        </>
      } 
    </>
  );
}
