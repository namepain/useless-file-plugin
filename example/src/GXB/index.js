import React, { Component } from "react";
import './ss/index.less'

export default class GXB extends Component {
	constructor (props) {
		super(props)
		this.state = {
			count: 0
		}
	}

	add () {
		this.setState(prev => ({
			count: prev.count + 1
		}))
	}

	render () {
		return (
			<span onClick={this.add.bind(this)}>GXB: { this.state.count }</span>
		)
	}
}