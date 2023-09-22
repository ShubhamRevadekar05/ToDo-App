import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

export default class Signin extends Component {
	state = {
        redirect: false
    }
	
	handleLoginSubmit = e => {
		e.preventDefault();
		let form = new FormData(e.target);
		axios
            .post("/api/token/", {username: form.get("username"), password: form.get("password")})
            .then(res => {
				localStorage.setItem("access", res.data.access);
				localStorage.setItem("refresh", res.data.refresh);
				this.setState({redirect: true});
			})
            .catch(err => {
				alert("Invalid Login Credentials!");
				console.error(err);
			});
	};

	render() {
		return (
			this.state.redirect ? <Navigate to="/" /> : 
			<>
				<main className="container">
					<h1 className="text-white text-uppercase text-center my-4">ToDo List</h1>
					<div className="row">
						<div className="col-md-6 col-sm-10 mx-auto p-0">
							<div className="card p-3 text-center">
								<form className="form-control" onSubmit={this.handleLoginSubmit}>
									<div class="mb-3">
										<label class="form-label">Username</label>
										<input type="text" class="form-control" name="username" placeholder="Username" />
									</div>
									<div class="mb-3">
										<label class="form-label">Password</label>
										<input type="password" class="form-control" name="password" placeholder="Password" />
									</div>
									<div class="mb-3">
										<button type="submit" class="btn btn-primary mb-3">Submit</button>
									</div>
								</form>
							</div>
						</div>
					</div>

				</main>
			</>
		);
	};
}
