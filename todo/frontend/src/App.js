import React, { Component } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./components/main";
import Signin from "./components/signin";
import Signup from "./components/signup";

export default class App extends Component {
	render() {
		return (
			<BrowserRouter>
				<Routes>
					<Route exact path="/" element={<Main />} />
					<Route exact path="/signin" element={<Signin />} />
					<Route exact path="/signup" element={<Signup />} />
				</Routes>
			</BrowserRouter>
		);
	};
}
