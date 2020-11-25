import React from "react"

export default class Advanced extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            endpoint: localStorage.getItem("node_endpoint"),
            tab: "settings"
        }
    }

    handleChangeEndpoint(event) {
        const endpoint = event.target.value
        localStorage.setItem("node_endpoint", endpoint)
        this.setState({ endpoint });
    }

    handleChangeTab(tab) {
        this.setState({ tab: tab })
    }
    
    render() {
        return (
            <div className="box">
                <div class="tabs">
                    <ul>
                        <li class="is-active"><a>Settings</a></li>
                    </ul>
                </div>

                { this.state.tab == "settings" &&
                    <form>
                        <div className="field">
                            <label for="endpoint" className="label">Endpoint</label>
                            <div className="control">
                                <input className="input" type="text" value={this.state.endpoint} required id="endpoint" onChange={this.handleChangeEndpoint.bind(this)}/>
                            </div>
                        </div>
                    </form>
                }

            </div>
        )
    }
}