import React from "react"
import { fetchBalance, getTransactionContent } from '../api'

class Dashboard extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            balance: { uco: 0.0, nft: [] }
        }
    }

    async componentDidMount() {
        const balance  = await fetchBalance(this.props.address)
        if (balance.nft.length > 0) {
            const nft_promises = await balance.nft.map(async (nft) => {
                const content = await getTransactionContent(nft.address)
                const string = Buffer.from(content, "hex").toString()
                const tokenName = this.regexName(string)
                return { name: tokenName, amount: nft.amount, address: nft.address }
            })

            balance.nft = await Promise.all(nft_promises)
            this.setState({ balance: balance})
        }
        else {
            this.setState({ balance: balance})
        }
    }

    async componentDidUpdate(prevProps) {
        if (prevProps.address !== this.props.address) {
            const balance  = await fetchBalance(this.props.address)
            if (balance.nft.length > 0) {
                const nft_promises = await balance.nft.map(async (nft) => {
                    const content = await getTransactionContent(nft.address)
                    const string = Buffer.from(content, "hex").toString()
                    const tokenName = this.regexName(string)
                    return { name: tokenName, amount: nft.amount, address: nft.address }
                })

                balance.nft = await Promise.all(nft_promises)
                this.setState({ balance: balance})
            }
            else {
                this.setState({ balance: balance})
            }
        }
    }

    regexName(content) {
        const regex = /(?<=name: ).*/g
        const match = content.match(regex)
        return match[0]
    }

    render() {
        return (
            <div className="columns is-flex-wrap-wrap">
                <div className="column is-7-tablet is-4-desktop is-2-widescreen">
                    <div className="box is-primary is-light ">
                        <p className="title heading has-text-primary is-size-4">UCO</p>
                        <p>{this.state.balance.uco.toPrecision(6)}</p>
                    </div>
                </div>    
                { this.state.balance.nft.map((nft, i) => {
                    return (
                        <div className="column is-7-tablet is-4-desktop is-4-widescreen" key={i}>
                            <div className="box is-warning is-light">
                                <p className="title heading has-text-black is-size-4">{ nft.name.slice(0, 7)} {nft.name.length > 7 ? "..." : ""} (NFT)</p>
                                <p>{nft.amount.toPrecision(6)}</p>
                                <small><em>
                                <a className="link" rel="noreferrer" target="_blank" href={`${this.props.endpoint}/explorer/transaction/${nft.address}`}>{nft.address.slice(0, 18)}...</a></em></small>
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }
}

export default Dashboard