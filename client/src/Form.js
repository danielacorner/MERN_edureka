import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';

export default class Form extends Component {
  state = {
    text: ''
  };

  handleChange = e => {
    const newText = e.target.value;
    this.setState({
      text: newText
    });
  };
  handleKeyDown = e => {
    if (e.key === 'Enter') {
      this.props.onSubmit(this.state.text);
      this.setState({
        text: ''
      });
    }
  };
  render() {
    const { text } = this.state;
    return (
      <TextField
        id="name"
        label="artwork..."
        value={text}
        onChange={this.handleChange}
        onKeyDown={this.handleKeyDown}
        margin="normal"
        fullWidth
      />
    );
  }
}
