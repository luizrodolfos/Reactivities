import React, { Component } from "react";
import axios from "axios";
import { Header, Icon, Image, List, Container } from "semantic-ui-react";

class App extends Component {
  state = {
    values: [],
  };

  componentDidMount() {
    axios.get("https://localhost:5051/api/values").then((res) => {
      this.setState({ values: res.data });
    });
  }

  avatarSrc(value: any) {
    let padded: string = value.id.toString();

    while (padded.length < 3) {
      padded = `0${padded}`;
    }

    return `images\\avatar\\${padded}.png`;
  }

  render() {
    return (
      <Container>
        <Header as="h2" icon textAlign="center">
          <Icon name="users" circular />
          <Header.Content>Reactivities</Header.Content>
        </Header>
        <List divided verticalAlign='middle'>
          {this.state.values.map((value: any) => (
            <List.Item key={value.id}>
              <Image avatar src={this.avatarSrc(value)} />
              <List.Content>
                <List.Header as="a">{value.name}</List.Header>
                <List.Description>
                  {" "}
                </List.Description>
              </List.Content>
            </List.Item>
          ))}
        </List>
      </Container>
    );
  }
}

export default App;
