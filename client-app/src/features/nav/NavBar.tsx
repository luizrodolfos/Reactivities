import React from "react";
import { Menu, Container, Button } from "semantic-ui-react";
import { NavLink } from "react-router-dom";

export const NavBar = () => {
  return (
    <Menu fixed="top" inverted>
      <Container>
        <Menu.Item header as={NavLink} exact to="/">
          <img
            src="/assets/images/logo.png"
            alt="logo"
            style={{ marginRight: 10 }}
          />
          Reactivities
        </Menu.Item>
        <Menu.Item name="Activities" as={NavLink} to="/activities" />
        <Menu.Item>
          <Button
            positive
            as={NavLink}
            to="/createActivity"
            content="Create Activity"
          />
        </Menu.Item>
      </Container>
    </Menu>
  );
};
