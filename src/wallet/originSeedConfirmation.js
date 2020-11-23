import React from 'react'

import { deriveKeyPair } from 'uniris'

export default class OriginSeedConfirmation extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            seed: ""
        }
    }

    handleConfirm() {
        const { privateKey } = deriveKeyPair(this.state.seed, 0)
        this.setState({seed: ""})
        this.props.onSign(privateKey)
    }

    handleSeedChange(event) {
        const seed = event.target.value;
        this.setState({ seed: seed})
    }

    render() {
        return (
            <div>
                <p className="heading subtitle is-size-7">Transaction confirmation.</p>
                <p>Please to sign with the origin private key</p>
                <br />
                <div className="field">
                    <p className="control">
                        <input 
                            type="password" 
                            className="input" 
                            onChange={this.handleSeedChange.bind(this)} 
                            placeholder="Enter the origin seed" 
                            value={this.state.seed} />
                    </p>
                </div>
                <div className="field">
                    <p className="control">
                        <button 
                            type="button" 
                            className="button is-primary is-outlined is-fullwidth" 
                            onClick={this.handleConfirm.bind(this)} 
                            disabled={!this.state.seed}>
                            Confirm
                        </button>
                    </p>
                </div>
            </div>
        )
    }
}