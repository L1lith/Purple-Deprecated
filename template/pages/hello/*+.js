class Hello extends React.Component {
  render() {
    return <p>Hello {this.props.path.split('/').slice(-1)[0].trim()}!</p>
  }
}

export default Hello
