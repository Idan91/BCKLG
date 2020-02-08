import React from "react";
import { NavLink } from "react-router-dom";

function NavItem(props) {
  return (
    <React.Fragment>
      <li className="nav-item" key={props.value} onClick={props.handleClick}>
        <NavLink
          to={props.link}
          className={props.defaultClasses}
          activeClassName={props.selectedClasses}
        >
          {props.value}
        </NavLink>
      </li>
    </React.Fragment>
  );
}

export default NavItem;
