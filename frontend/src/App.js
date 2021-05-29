import React, { Component } from "react";
import CustomModal from "./components/modal";
import axios from "axios";

export default class App extends Component {
	state = {
		modal: false,
		viewCompleted: false,
		todoList: [],
		activeItem: {
			title: "",
			description: "",
			completed: false,
		},
	};

	refreshList = () => {
		axios
			.get("http://localhost:8000/api/todos/")
			.then(res => this.setState({ todoList: res.data }))
			.catch(err => console.log(err));
	};
	
	componentDidMount() {
		this.refreshList();
	};

	toggle = () => {
		this.setState({ modal: !this.state.modal });
	};

	handleSubmit = item => {
		if(item.title !== "" && item.description !== "") {
			if(item.id) {
				axios
					.put(`http://localhost:8000/api/todos/${item.id}/`, item)
					.then(res => this.refreshList());
			}
			else {
				axios
					.post("http://localhost:8000/api/todos/", item)
					.then(res => this.refreshList());
			}
			this.toggle();
		}
		else {
			alert("Error! Empty title or description fields.");
		}
	};

	handleDelete = item => {
		axios
			.delete(`http://localhost:8000/api/todos/${item.id}/`)
			.then(res => this.refreshList());
	};

	createItem = () => {
		const item = { title: "", description: "", completed: false };
		this.setState({	activeItem: item, modal: !this.state.modal });
	};

	editItem = item => {
		this.setState({	activeItem: item, modal: !this.state.modal });
	};

	renderTabList = () => {
		return (
			<div align="center" className="my-5 tab-list">
				<span onClick={() => this.setState({ viewCompleted: true })} className={this.state.viewCompleted ? "active" : ""}>
					Completed Task(s)
				</span>
				<span onClick={() => this.setState({ viewCompleted: false })} className={this.state.viewCompleted ? "" : "active"}>
					Pending Task(s)
				</span>
			</div>
		);
	};

	renderItems = () => {
		const { viewCompleted } = this.state;
		const newItems = this.state.todoList.filter(item => item.completed === viewCompleted);
		return newItems.map(item => (
			<li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
				<span className={`todo-title mr-2 ${this.state.viewCompleted ? "completed-todo" : ""}`} title={item.description}>
					{item.title}
				</span>
				<span>
					<button onClick={() => this.editItem(item)}  className="btn btn-secondary mr-2">{this.state.modal & this.state.activeItem.id===item.id ? "Editing" : "Edit"}</button>
					<button onClick={() => this.handleDelete(item)} className="btn btn-danger">Delete</button>
				</span>
			</li>
		));
	};

	render() {
		return (
			<main className="content">
				{document.title = "ToDo App"}
				<h1 className="text-white text-uppercase text-center my-4">ToDo List</h1>
				<div className="row">
					<div className="col-md-6 col-sm-10 mx-auto p-0">
						<div className="card p-3">
							<div className="">
								<button onClick={() => this.createItem()} className="btn btn-primary">Add Task</button>
							</div>
							{this.renderTabList()}
							<ul className="list-group list-group-flush">
								{this.renderItems()}
							</ul>
						</div>
					</div>
				</div>
				{this.state.modal ? (
				<CustomModal
					activeItem={this.state.activeItem}
					toggle={this.toggle}
					onSave={this.handleSubmit}
					modal={this.state.modal}
				/>
				) : null}
			</main>
		);
	};
}
