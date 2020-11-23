import React from 'react'

export default class UCOTransferForm extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            address: "",
            amount: 0.0
        }
    }

    handleChangeAddress(e) {
        this.setState({ address: e.target.value})
    }

    handleChangeAmount(e) {
        this.setState({ amount: parseFloat(e.target.value) })
    }

    handleAddClick(e) {
        e.preventDefault()
        this.props.onAdd(this.state)
    }

    render() {
        return (
            <form onSubmit={this.handleAddClick.bind(this)}>
                <div className="columns">
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
                        <button className="button">Add</button>
                    </div>
                </div>
            </form>
        )
    }
}