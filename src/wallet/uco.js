import React from "react"
import { fetchBalance, getTransactions } from '../api'

import UCOTransfersForm from './uco_transfers_form'
import Modal from '../modal'

class UCO extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            balance: 0.0,
            transactions: [],
            transferForm: false
        }
    }

    async componentDidMount() {
        const balance  = await fetchBalance(this.props.address)
        const transactions = await getTransactions(this.props.address)

        this.setState({ balance: balance.uco, transactions: transactions.filter(x => x.type === "transfer" && x.data.ledger.uco.transfers.length > 0) })
    }

    closeTransferForm(transfer) {
        if (transfer !== undefined) {
            let transactions = this.state.transactions
            transactions.push(transfer)
            this.setState({ transactions: transactions, transferForm: false })
        }
        else {
            this.setState({transferForm: false})
        }
    }

    handleOpenTransferForm() {
        this.setState({ transferForm: true })
    }

    render() {
        const endpoint = localStorage.getItem("node_endpoint")
        return (
            <div className="box">
                <div className="columns">
                    <div className="column is-8-tablet">
                        <p className="heading">Address</p>
                        <a className="link" target="_blank" rel="noreferrer" href={`${endpoint}/explorer/transaction/${this.props.address}`}>
                            <span className="is-hidden-mobile is-hidden-desktop-only">{this.props.address}</span>
                            <span className="is-hidden-widescreen">{this.props.address.slice(0, 40)}...</span>
                        </a>
                    </div>
                    <div className="column">
                        <p className="heading">Balance</p>
                        <p>{ this.state.balance.toPrecision(6)} UCO</p>
                    </div>
                </div>
                <div className="columns">
                    <div className="column is-3">
                        <button className="button is-outlined is-primary" onClick={this.handleOpenTransferForm.bind(this)}>Transfer UCO</button>
                    </div>
                </div>
                <div className="columns">
                    <div className="column">
                        <p className="heading subtitle is-size-6">UCO Transactions ({this.state.transactions.length})</p>
                        { this.state.transactions.map((tx, i) => {
                            return (
                                <div className="container box" key={i}>
                                    <div className="columns">
                                        <div className="column is-5">
                                            <p className="heading">To</p>
                                            <a className="link" rel="noreferrer" target="_blank" href={`${endpoint}/explorer/transaction/${tx.address}`}>
                                                <span className="is-hidden-mobile is-hidden-desktop-only">{tx.address.slice(0, 35)}...</span>
                                                <span className="is-hidden-widescreen">{tx.address.slice(0, 20)}...</span>
                                            </a>
                                        </div>
                                        <div className="column is-3">
                                            <p className="heading">Date</p>
                                            <p>{new Date(tx.timestamp * 1000).toLocaleDateString()} - {new Date(tx.timestamp).toLocaleTimeString()}</p>
                                        </div>
                                        <div className="column is-2">
                                            <p className="heading">Transfers</p>
                                            <p>{tx.data.ledger.uco.transfers.length} transfers</p>
                                        </div>
                                        <div className="column is-2">
                                            <p className="heading">Amount transferred</p>
                                            <p className="">{tx.data.ledger.uco.transfers.reduce((acc, transfer) => acc + transfer.amount, 0.0).toPrecision(6)}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <Modal active={this.state.transferForm} close={this.closeTransferForm.bind(this)} >
                    <UCOTransfersForm address={this.props.address} />
                </Modal>
            </div>
        )
    }
}

export default UCO