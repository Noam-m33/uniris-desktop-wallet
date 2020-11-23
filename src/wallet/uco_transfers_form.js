import React from 'react'

import { newTransactionBuilder, getTransactionIndex, sendTransaction } from 'uniris'

import OriginSeedConfirmation from './originSeedConfirmation';
import TransferForm from './uco_transfer_form'

export default class UCOTransfersForm extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            transfers: []
        }
    }

    async handleConfirm(originPrivateKey) {
        const txIndex = await getTransactionIndex(this.props.address, this.props.endpoint)
        let builder = newTransactionBuilder("transfer")

        this.state.transfers.forEach((transfer) => {
            builder.addUCOTransfer(transfer.address, transfer.amount)
        })
        
        const tx = builder
            .build(sessionStorage.getItem("transaction_chain_seed"), txIndex)
            .originSign(originPrivateKey)
        
        const data = await sendTransaction(tx, this.props.endpoint)
        if (data.errors) {
                console.error(data.errors)
                alert("An error ocurred")
        }
        this.setState({ transfers: [] })
        this.props.onSubmit()
    }

    handleNewTransfer({ address, amount }) {
        let transfers = this.state.transfers
        const existing_transfer_index = transfers.findIndex((t) => t.address === address)
        if (existing_transfer_index !== -1) {
            transfers[existing_transfer_index].amount += amount;
        }
        else {
            transfers.push({ address: address, amount})
        }

        this.setState({ transfers: transfers})
    }

    handleRemoveTransfer(i) {
        let transfers = this.state.transfers;
        transfers.splice(i, 1);
        this.setState({ transfers:  transfers})
    }

    render() {
        return (
            <div>
                <div className="columns">
                    <div className="column is-4 is-flex is-align-items-center">
                        <p className="heading subtitle is-size-6">Transfers</p>
                    </div>
                    <div className="column">
                        { this.state.transfers.length > 0 && 
                            <button className="button is-outlined is-primary" onClick={this.handleConfirm.bind(this)}>Send transaction</button>
                        }
                    </div>
                </div>
                <div className="columns">
                    <div className="column">
                        <TransferForm onAdd={this.handleNewTransfer.bind(this)}/>
                    </div>
                </div>
                <div className="columns">
                    <div className="column">
                        { this.state.transfers.map((transfer, i) => {
                            return (
                                <div className="box" key={i}>
                                    <div className="columns">
                                        <div className="column">
                                            <p className="heading">To</p>
                                            {transfer.address.slice(0, 13)}...
                                        </div>
                                        <div className="column">
                                            <p className="heading">Amount</p>
                                            {transfer.amount.toPrecision(6)} UCO
                                        </div>
                                        <div className="column is-2">
                                            <p className="heading">&nbsp;</p>
                                            <button type="button" className="button is-danger is-light is-small" onClick={this.handleRemoveTransfer.bind(this, i)}>Delete</button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                { this.state.transfers.length > 0 &&
                    <OriginSeedConfirmation onSign={this.handleConfirm.bind(this)}/>
                }
            </div>
        )
    }
}