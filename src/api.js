import { getTransactionIndex, deriveAddress} from 'uniris'

const endpoint = "http://localhost:4000"

export async function lastAddress(seed) {
    const genesisAddress = deriveAddress(seed, 0)
    const index = await getTransactionIndex(genesisAddress, endpoint)
    const lastAddress = deriveAddress(seed, index)
    return lastAddress
}

export async function fetchBalance(address) {
    return fetch(endpoint + "/api", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query: `query {
                balance(address: "${address}") {
                    uco,
                    nft {
                        address,
                        amount
                    }
                }
            }`
        })
    })
    .then(r => r.json())
    .then((res) => {
        return res.data.balance
    })
}

export async function getTransactionContent(address) {
    return fetch(endpoint + "/api", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query: `query {
                transaction(address: "${address}") {
                    data {
                        content
                    }
                }
            }`
        })
    })
    .then(r => r.json())
    .then((res) => {
        return res.data.transaction.data.content
    })
}

export async function getTransactions(address) {
    return fetch(endpoint + "/api", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query: `query {
                transactionChain(address: "${address}") {
                    address,
                    timestamp,
                    type,
                    data {
                        ledger {
                            uco {
                                transfers {
                                    amount,
                                    to
                                }
                            },
                            nft {
                                transfers {
                                    amount,
                                    to,
                                    nft
                                }
                            }
                        }
                    }
                }
            }`
        })
    })
    .then(r => r.json())
    .then((res) => {
        return res.data.transactionChain
    })
}