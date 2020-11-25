import React from 'react'

import { newTransactionBuilder, getTransactionIndex, sendTransaction } from 'uniris'
import { notifyAddressReplication } from '../api'
import OriginSeedConfirmation from './originSeedConfirmation';

export default class NFTIssueForm extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            supply: 0,
            endpoint: localStorage.getItem("node_endpoint"),
        }
    }

    handleChangeSupply(event) {
        const supply = event.target.value;
        this.setState({ supply: supply})
    }

    handleChangeName(event) {
        const name = event.target.value;
        this.setState({ name: name})
    }

    handleClose() {
        this.setState({supply: 0, name: ""})
    }

    async handleSign(originPrivateKey) {
        const txIndex = await getTransactionIndex(this.props.address, this.state.endpoint)

        const tx = newTransactionBuilder("nft")
            .setContent(`initial supply: ${this.state.supply}\nname: ${this.state.name}`)
            .build(sessionStorage.getItem("transaction_chain_seed"), txIndex)
            .originSign(originPrivateKey)

        const nft = { address: tx.address.toString('hex'), name: this.state.name, amount: parseFloat(this.state.supply) }
        notifyAddressReplication(tx.address.toString('hex')).then(() => {
            this.setState({supply: 0, name: ""})
            this.props.onSubmit(nft)
        })

        const data = await sendTransaction(tx, this.state.endpoint)
        if (data.errors) {
            console.error(data.errors)
            alert("An error ocurred")
        }
    }

    render() {
        return (
            <div>
                <p className="heading subtitle is-size-7">NFT creation</p>
                <form>
                    <div className="field">
                        <p className="control">
                            <input type="number" className="input" min="0" onChange={this.handleChangeSupply.bind(this)} placeholder="Enter the initial supply" value={this.state.supply}/>
                        </p>
                    </div>
                    <div className="field">
                        <p className="control">
                            <input type="text" className="input"onChange={this.handleChangeName.bind(this)} placeholder="Enter the token name" value={this.state.name}/>
                        </p>
                    </div>
                    <hr />
                    <OriginSeedConfirmation onSign={this.handleSign.bind(this)} onSubmit={this.props.onSubmit}/>
                </form>
            </div>
        )
    }
}