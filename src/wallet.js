import React from "react"
import { withRouter } from 'react-router-dom';

import logo from './logo_white.svg';

import { deriveAddress } from 'uniris';

import Dashboard from './wallet/dashboard';
import UCO from './wallet/uco';
import NFT from './wallet/nft';
import { lastAddress } from "./api";

class Wallet extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            address: deriveAddress(sessionStorage.getItem("transaction_chain_seed"), 0),
            endpoint: localStorage.getItem("node_endpoint"),
            section: 'dashboard'
        }
    }

    async componentDidMount() {
        const _last_address = await lastAddress(sessionStorage.getItem("transaction_chain_seed"))
        this.setState({ address: _last_address })
    }

    handleClick(section) {
        this.setState({ section: section })
    }

    menuClassNames(section) {
        let classNames = ["heading", "is-size-4", "subtitle", "has-text-right"]
        if (section === this.state.section) {
            classNames.push("is-active");
        }
        return classNames.join(" ")
    }

    render() {
        return (
            <div className="">
                <div className="columns">
                    <div className="column is-3 dark-background"></div>
                    <div className="column"><img src={logo} alt="logo" className="image logo"/></div>
                </div>
                <div className="columns full-height">
                    <div className="column is-3 sidebar pl-6 pr-6 dark-background">
                        <ul>
                            <li className={this.menuClassNames("dashboard")} onClick={this.handleClick.bind(this, "dashboard")}><a>Dashboard</a></li>
                            <li className={this.menuClassNames("UCO")} onClick={this.handleClick.bind(this, "UCO")}><a>UCO</a></li>
                            <li className={this.menuClassNames("NFT")} onClick={this.handleClick.bind(this, "NFT")}><a>NFT</a></li>
                        </ul>
                    </div>
                    <div className="column is-9 p-6">
                        <div className="container">
                            { this.state.section === "dashboard" &&
                                <Dashboard endpoint={this.state.endpoint} address={this.state.address} />
                            }

                            { this.state.section === "UCO" &&
                                <UCO endpoint={this.state.endpoint} address={this.state.address} />
                            }    

                            { this.state.section === "NFT" &&
                                <NFT endpoint={this.state.endpoint} address={this.state.address} />
                            }                               
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Wallet)