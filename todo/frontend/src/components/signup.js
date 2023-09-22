import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

export default class Signup extends Component {
	state = {
        redirect: false
    }
    handleRegisterSubmit = e => {
		e.preventDefault();
		let form = new FormData(e.target);
        if(form.get("password") === form.get("confirm-password")) {
            axios
                .post("/register/", {username: form.get("username"), email: form.get("email"), password: form.get("password")})
                .then(res => {
                    this.setState({redirect: true});
                })
                .catch(err => {
                    alert("Something went wrong!");
                    console.error(err);
                });
        }
        else {
            alert("Password and Confirm Password are not same!");
        }
	};

	render() {
		return (
			this.state.redirect ? <Navigate to="/signin" /> : 
            <>
				<main className="container">
					<h1 className="text-white text-uppercase text-center my-4">ToDo List</h1>
					<div className="row">
						<div className="col-md-6 col-sm-10 mx-auto p-0">
							<div className="card p-3 text-center">
								<form className="form-control" onSubmit={this.handleRegisterSubmit}>
									<div class="mb-3">
										<label class="form-label">Username</label>
										<input type="text" class="form-control" name="username" placeholder="Username" />
									</div>
                                    <div class="mb-3">
										<label class="form-label">Email</label>
										<input type="email" class="form-control" name="email" placeholder="Email" />
									</div>
									<div class="mb-3">
										<label class="form-label">Password</label>
										<input type="password" class="form-control" name="password" placeholder="Password" />
									</div>
                                    <div class="mb-3">
										<label class="form-label">Confirm Password</label>
										<input type="password" class="form-control" name="confirm-password" placeholder="Confirm Password" />
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
