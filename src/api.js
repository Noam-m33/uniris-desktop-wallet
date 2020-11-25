import { getTransactionIndex, deriveAddress} from 'uniris'
import * as withAbsintheSocket from "@absinthe/socket";
import {Socket as PhoenixSocket} from "phoenix";


export async function lastAddress(seed) {
    const endpoint = localStorage.getItem("node_endpoint")
    const genesisAddress = deriveAddress(seed, 0)
    const index = await getTransactionIndex(genesisAddress, endpoint)
    const lastAddress = deriveAddress(seed, index)
    return lastAddress
}

export async function fetchBalance(address) {
    const endpoint = localStorage.getItem("node_endpoint")
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
    const endpoint = localStorage.getItem("node_endpoint")
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
    const endpoint = localStorage.getItem("node_endpoint")
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

export function notifyAddressReplication(address) {
    const endpoint = new URL(localStorage.getItem("node_endpoint")).host
    const absintheSocket = withAbsintheSocket.create(
        new PhoenixSocket(`ws://${endpoint}/socket`)
    );

    const operation = `
        subscription {
            acknowledgeStorage(address: "${address}") {
                address
            }
        }
    `;

    const notifier = withAbsintheSocket.send(absintheSocket, { operation });

    return new Promise((resolve, reject) => {
        withAbsintheSocket.observe(absintheSocket, notifier, {
            onAbort: console.log("abort"),
            onError: reject,
            onStart: console.log("open"),
            onResult: resolve
        })
    })
}