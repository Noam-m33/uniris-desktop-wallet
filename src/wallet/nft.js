import React from "react"
import { fetchBalance, getTransactionContent, getTransactions } from '../api'

import NFTIssueForm from './nft_issue_form'
import NFTTransfersForm from './nft_transfers_form'
import Modal from '../modal'

class NFT extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            balances: [],
            transactions: [],
            issueFormActive: false,
            transferFormActive: false
        }
    }

    async componentDidMount() {
        await this.loadTokens()
        await this.loadTransactions()
    }

    async loadTokens() {
        console.log(this.props.address)
        let { nft: balances} = await fetchBalance(this.props.address)
        const nft_promises = await balances.map(async (nft) => {
            const content = await getTransactionContent(nft.address)
            const string = Buffer.from(content, "hex").toString()
            const tokenName = this.regexName(string) || nft.address
            return { name: tokenName, amount: nft.amount, address: nft.address }
        })

        balances = await Promise.all(nft_promises)

        this.setState({ balances: balances })
    }

    async loadTransactions() {
        const transactions = await getTransactions(this.props.address)
        this.setState({ transactions: transactions.filter(t => t.type === "transfer" && t.data.ledger.nft.transfers.length > 0)})
    }

    regexName(content) {
        const regex = /(?<=name: ).*/g
        const match = content.match(regex)
        if (match) {
            return match[0]
        }
        else {
            return undefined
        }
    }

    openIssueForm() {
        this.setState({ issueFormActive: true })
    }

    openTransferForm() {
        this.setState({ transferFormActive: true })
    }

    closeTransformForm(transfer) {
        if (transfer !== undefined) {
            let transactions = this.state.transactions
            transactions.push(transfer)
            this.setState({ transactions: transactions, transferFormActive: false })
        }
        else {
            this.setState({transferFormActive: false})
        }
    }
    
    async closeIssueForm(nft) {
        if (nft !== undefined) {
            let balances = this.state.balances
            balances.push(nft)
            this.setState({ balances: balances, issueFormActive: false })
        }
        else {
            this.setState({issueFormActive: false})
        }
    }

    render() {
        const endpoint = localStorage.getItem("node_endpoint")
        return (
            <div className="box">
                <div className="columns">
                    <div className="column is-3">
                        <button type="button" className="button is-primary is-outlined" onClick={this.openIssueForm.bind(this)}>Issue a new token</button>
                    </div>
                    <div className="column is-3">
                        <button type="button" className="button is-dark is-outlined" onClick={this.openTransferForm.bind(this)}>Transfers tokens</button>
                    </div>
                     <div className="column"></div>
                </div>
                <div className="columns">
                    <div className="column">
                        <p className="heading subtitle is-size-6">NFT List({this.state.balances.length})</p>
                        { this.state.balances.map((nft, i) => {
                            return (
                                <div className="box columns mt-2 mr-2 ml-2" key={i}>
                                   <div className="column is-10">
                                       <p className="heading">{nft.name}</p>
                                       <a className="link" rel="noreferrer" target="_blank" href={`${endpoint}/explorer/transaction/${nft.address}`}>
                                            <span className="is-hidden-mobile is-hidden-desktop-only">{nft.address}</span>
                                            <span className="is-hidden-widescreen">{nft.address.slice(0, 40)}...</span>
                                       </a>
                                   </div>
                                   <div className="column is-2">
                                        <p className="heading">Amount</p>
                                        <span className="tag is-medium is-success is-light">{nft.amount.toPrecision(6)}</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className="columns mt-6">
                    <div className="column">
                        <p className="heading subtitle is-size-6">NFT Transactions ({this.state.transactions.length})</p>
                        { this.state.transactions.map((tx, i) => {
                            return (
                                <div className="container box" key={i}>
                                    <div className="columns">
                                        <div className="column is-5">
                                            <p className="heading">To</p>
                                            <a className="link" rel="noreferrer" target="_blank" href={`${endpoint}/explorer/transaction/${tx.address}`}>
                                                <span className="is-hidden-mobile is-hidden-desktop-only">{tx.address.slice(0, 30)}...</span>
                                                <span className="is-hidden-widescreen">{tx.address.slice(0, 20)}...</span>
                                            </a>
                                        </div>
                                        <div className="column is-3">
                                            <p className="heading">Date</p>
                                            <p>{new Date(tx.timestamp * 1000).toLocaleDateString()} - {new Date(tx.timestamp).toLocaleTimeString()}</p>
                                        </div>
                                        <div className="column is-2">
                                            <p className="heading">Transfers</p>
                                            <p className="">
                                                {tx.data.ledger.nft.transfers.map(transfer => {
                                                    const nft = this.state.balances.find((nft) => nft.address === transfer.nft)
                                                    const nft_name = nft ? nft.name || nft.address : transfer.nft
                                                    return (
                                                        <div className="tag">{transfer.amount.toPrecision(6)} {nft_name}</div>
                                                    )
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <Modal active={this.state.issueFormActive} close={this.closeIssueForm.bind(this)} >
                    <NFTIssueForm onSubmit={this.closeIssueForm.bind(this)} address={this.props.address}/>
                </Modal>

                <Modal active={this.state.transferFormActive} close={this.closeTransformForm.bind(this)} >
                    <NFTTransfersForm onSubmit={this.closeTransformForm.bind(this)} address={this.props.address} nfts={this.state.balances} />
                </Modal>
            </div>
        )
    }
}

export default NFT