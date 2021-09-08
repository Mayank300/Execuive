import React, { Component } from "react";
import { Text, View } from "react-native";

export class GoogleSignInForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_name: this.props.route.params.user_name,
      email_id: this.props.route.params.email_id,
      photo_url: this.props.route.params.photo_url,
      google_login: this.props.route.params.google_login,
    };
  }

  render() {
    const { user_name, email_id, photo_url, google_login } = this.state;

    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text> {user_name} </Text>
        <Text> {email_id} </Text>
        <Text> {google_login} </Text>
        {/* <Text> {photo_url} </Text> */}
      </View>
    );
  }
}

export default GoogleSignInForm;
