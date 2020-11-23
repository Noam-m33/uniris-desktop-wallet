import React from 'react'

export default class NFTTransferForm extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            nft: "",
            address: "",
            amount: 0.0
        }
    }

    handleChangeNFT(e) {
        this.setState({ nft: e.target.value })
        console.log(this.state)
    }

    handleChangeAddress(e) {
        this.setState({ address: e.target.value})
    }

    handleChangeAmount(e) {
        this.setState({ amount: parseFloat(e.target.value) })
    }

    handleAddClick(e) {
        e.preventDefault()
        this.setState({ nft: "", address: "", amount: 0.0})
        this.props.onAdd(this.state)
    }

    render() {
        return (
            <div className="columns">
                <div className="column">
                    <p className="heading">NFT</p>
                    <div className="select">
                        <select required onChange={this.handleChangeNFT.bind(this)} value={this.state.nft}>
                            <option></option>
                            {this.props.nfts && this.props.nfts.map((nft, i) => {
                                return (
                                    <option key={i} value={nft.address}>{nft.name}</option>
                                )
                            })}
                        </select>
                    </div>
                </div>
                <div className="column">
                    <p className="heading">Address</p>
                    <input className="input" pattern="[a-fA-F\d]+" required type="text" placeholder="Recipient address" value={this.state.address} onChange={this.handleChangeAddress.bind(this)}/>
                </div>
                <div className="column is-3">
                    <p className="heading">Amount</p>
                    <input className="input" required type="number" min="0.0" step="0.00001" placeholder="Amount to send" value={this.state.amount} onChange={this.handleChangeAmount.bind(this)}/>
                </div>
                <div className="column is-2">
                    <p className="heading">&nbsp;</p>
                    <button className="button" type="button" onClick={this.handleAddClick.bind(this)}>Add</button>
                </div>
            </div>
        )
    }
}