import React from "react"
import { withRouter } from 'react-router-dom';

import logo from './logo_black_center.svg'

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            seed: ''
        }
    }

    handleChange(event) {
        const seed = event.target.value
        sessionStorage.setItem("transaction_chain_seed", seed)
        this.setState({seed});
    }
    
    handleSubmit(event) {
        event.preventDefault();
        this.props.history.push('/wallet');
    }

    render() {
        return (
            <div className="home hero is-medium is-bold is-large">
                <div className="hero-body">
                    <div className="columns">
                        <div className="column is-half is-offset-one-quarter">
                            <div className="columns box">
                                <div className="column">
                                    <div className="columns">
                                        <div className="column has-text-centered is-flex is-justify-content-center	">
                                            <img src={logo} alt="logo" className="image is-128x128"/>
                                        </div>
                                    </div>
                                    <form onSubmit={this.handleSubmit.bind(this)}>
                                        <div className="columns">
                                            <div className="column">
                                                <div className="field">
                                                    <div className="control">
                                                        <input 
                                                            className="input has-text-centered" 
                                                            type="password" 
                                                            placeholder="Enter your transaction chain seed" 
                                                            onChange={this.handleChange.bind(this)} 
                                                            value={this.state.seed} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="columns">
                                            <div className="column">
                                                <button className="button is-fullwidth is-primary is-outlined">Enter</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Home);