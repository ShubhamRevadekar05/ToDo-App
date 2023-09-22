import React, { Component } from "react";
import { Link } from "react-router-dom";
import CustomModal from "./modal";
import axios from "axios";

export default class Main extends Component {
    state = {
        logged: false,
        username: "",
        modal: false,
        viewCompleted: false,
        todoList: [],
        displayList: [],
        activeItem: {
            title: "",
            description: "",
            completed: false,
        },
    };

    userDetails = () => {
        if (localStorage.getItem("access")) {
            axios
                .get("/user/", {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("access")}`
                    }
                })
                .then(res => {
                    this.setState({ logged: true, username: res.data.username });
                })
                .catch(err => {
                    this.setState({logged: false});
                    localStorage.removeItem("access");
                    localStorage.removeItem("refresh");
                    console.error(err);
                    window.location.href = "/";
                });
        }
        else {
            this.setState({ logged: false, todoList: [], displayList: [] });
        }
    };
    
    refreshList = () => {
        if (localStorage.getItem("access")) {
            axios
                .get("/api/todos/", {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("access")}`
                    }
                })
                .then(res => {
                    this.setState({ logged: true, todoList: res.data, displayList: res.data });
                })
                .catch(err => {
                    this.setState({logged: false});
                    localStorage.removeItem("access");
                    localStorage.removeItem("refresh");
                    console.error(err);
                    window.location.href = "/";
                });
        }
        else {
            this.setState({ logged: false, todoList: [], displayList: [] });
        }
    };

    componentDidMount() {
        this.userDetails();
        this.refreshList();
    };

    toggle = () => {
        this.setState({ modal: !this.state.modal });
    };

    handleSubmit = item => {
        if (item.title !== "" && item.description !== "") {
            if (item.id) {
                axios
                    .put(`/api/todos/${item.id}/`, item, {
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem("access")}`
                        }
                    })
                    .then(res => this.refreshList())
                    .catch(err => {
                        this.setState({logged: false});
                        localStorage.removeItem("access");
                        localStorage.removeItem("refresh");
                        console.error(err);
                        window.location.href = "/";
                    });
            }
            else {
                axios
                    .post("/api/todos/", item, {
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem("access")}`
                        }
                    })
                    .then(res => this.refreshList())
                    .catch(err => {
                        this.setState({logged: false});
                        localStorage.removeItem("access");
                        localStorage.removeItem("refresh");
                        console.error(err);
                        window.location.href = "/";
                    });
            }
            this.toggle();
        }
        else {
            alert("Error! Empty title or description fields.");
        }
    };

    handleDelete = item => {
        axios
            .delete(`/api/todos/${item.id}/`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("access")}`
                }
            })
            .then(res => this.refreshList())
            .catch(err => {
                this.setState({logged: false});
                localStorage.removeItem("access");
                localStorage.removeItem("refresh");
                console.error(err);
                window.location.href = "/";
            });
    };

    createItem = () => {
        const item = { title: "", description: "", completed: false };
        this.setState({ activeItem: item, modal: !this.state.modal });
    };

    editItem = item => {
        this.setState({ activeItem: item, modal: !this.state.modal });
    };

    searchItems = () => {
        let keyword = document.getElementById("search").value.toLowerCase();
        if (keyword) this.setState({ displayList: this.state.todoList.filter(item => item.title.toLowerCase().includes(keyword)) });
        else this.setState({ displayList: this.state.todoList });
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
        const newItems = this.state.displayList.filter(item => item.completed === viewCompleted);
        return newItems.map(item => (
            <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                <span className={`todo-title mr-2 ${this.state.viewCompleted ? "completed-todo" : ""}`} title={item.description}>
                    {item.title}
                </span>
                <span>
                    <button onClick={() => this.editItem(item)} className="btn btn-secondary mr-2">{this.state.modal & this.state.activeItem.id === item.id ? "Editing" : "Edit"}</button>
                    <button onClick={() => this.handleDelete(item)} className="btn btn-danger">Delete</button>
                </span>
            </li>
        ));
    };

    render() {
        return (
            <>
                <nav class="navbar" data-bs-theme="dark" style={{ backgroundColor: "#282c34" }} >
                    <div class="container-fluid">
                        <div className="navbar-text"></div>
                        <div className="navbar-text">
                            {this.state.logged ?
                                <>
                                    <span style={{ margin: "10px" }} >
                                        <Link style={{textDecoration: "None"}}>{this.state.username}</Link>
                                    </span>
                                    <span style={{ margin: "10px" }} >
                                        <Link onClick={() => { this.setState({logged: false}); localStorage.removeItem("access"); localStorage.removeItem("refresh"); window.location.href = "/"; }}>Logout</Link>
                                    </span>
                                </> :
                                <>
                                    <span style={{ margin: "10px" }} >
                                        <Link to="/signin">Login</Link>
                                    </span>
                                    <span style={{ margin: "10px" }} >
                                        <Link to="/signup">Register</Link>
                                    </span>
                                </>}
                        </div>
                    </div>
                </nav>
                <main className="container">
                    <h1 className="text-white text-uppercase text-center my-4">ToDo List</h1>
                    <div className="row">
                        <div className="col-md-6 col-sm-10 mx-auto p-0">
                            <div className="card p-3">
                                {this.state.logged ?
                                    <>
                                        <div className="row">
                                            <div className="col">
                                                <div className="row">
                                                    <div className="col"><input type="text" className="form-control" id="search" placeholder="Search" onChange={() => this.searchItems()} /></div>
                                                </div>
                                            </div>
                                            <div className="col text-end">
                                                <button onClick={() => this.createItem()} className="btn btn-primary">Add Task</button>
                                            </div>
                                        </div>
                                        {this.renderTabList()}
                                        <ul className="list-group list-group-flush">
                                            {this.renderItems()}
                                        </ul>
                                    </> :
                                    <>
                                        <p className="text-center">Please Sign in or Sign up!</p>
                                    </>
                                }
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
            </>
        );
    };
}
