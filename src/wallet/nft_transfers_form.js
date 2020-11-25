import React from 'react'

import { newTransactionBuilder, getTransactionIndex, sendTransaction } from 'uniris'
import { notifyAddressReplication } from '../api'

import OriginSeedConfirmation from './originSeedConfirmation';
import TransferForm from './nft_transfer_form'

export default class NFTTransfersForm extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            transfers: [],
            endpoint: localStorage.getItem("node_endpoint"),
        }
    }

    handleChange(event) {
        const supply = event.target.value;
        this.setState({ supply: supply})
    }

    handleClose() {
        this.setState({transfers: []})
    }

    async handleSign(originPrivateKey) {
        const txIndex = await getTransactionIndex(this.props.address, this.state.endpoint)

        const txBuilder = newTransactionBuilder("transfer")

        this.state.transfers.forEach((transfer) => {
            txBuilder.addNFTTransfer(transfer.address, transfer.amount, transfer.nft)
        })

        const tx = txBuilder
            .build(sessionStorage.getItem("transaction_chain_seed"), txIndex)
            .originSign(originPrivateKey)

        const transfer = { address: tx.address.toString('hex'), timestamp: tx.timestamp, data: { ledger: { nft: { transfers: this.state.transfers }}}}
        notifyAddressReplication(tx.address.toString('hex')).then(() => {
            this.props.onSubmit(transfer)
        })

        const data = await sendTransaction(tx, this.state.endpoint)
        if (data.errors) {
            console.error(data.errors)
            alert("An error ocurred")
        }
    }

    handleNewTransfer({ address, amount, nft }) {
        let transfers = this.state.transfers
        const existing_transfer_index = transfers.findIndex((t) => t.address === address && t.nft === nft)
        if (existing_transfer_index !== -1) {
            transfers[existing_transfer_index].amount += amount;
        }
        else {
            transfers.push({ address: address, amount, nft: nft})
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
                <p className="heading subtitle is-size-7">Transfer NFT</p>
                <form>
                    <div className="columns">
                        <div className="column">
                            <TransferForm onAdd={this.handleNewTransfer.bind(this)} nfts={this.props.nfts} />
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column">
                            { this.state.transfers.map((transfer, i) => {

                                const { name: nft_name} = this.props.nfts.find((nft) => nft.address === transfer.nft)

                                return (
                                    <div className="box" key={i}>
                                        <div className="columns">
                                            <div className="column">
                                                <p className="heading">To</p>
                                                {transfer.address.slice(0, 13)}...
                                            </div>
                                            <div className="column">
                                                <p className="heading">Amount</p>
                                                {transfer.amount.toPrecision(6)} {nft_name}
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
                        <OriginSeedConfirmation onSign={this.handleSign.bind(this)}/>
                    }
                </form>
            </div>
        )
    }
}