import React from "react";
import render from 'react-dom'
import './index.less'

function App () {

	async function load () {
		const res = await import('./GXB')
		console.log(res.default)
	}

	return (
		<button onClick={load}>
			click load GXB
		</button>
	)

}

render(<App />, document.getElementById('app'))