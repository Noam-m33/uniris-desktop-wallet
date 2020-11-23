import React from 'react'

export default class Modal extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            active: false
        }
    }

    handleClose() {
        this.props.close()
    }
    
    handleSubmit() {
        this.props.close()
    }

    render() {

        const childrenWithProps = React.Children.map(this.props.children, child => {
            const props = { onSubmit: this.handleClose.bind(this) };
            if (React.isValidElement(child)) {
                return React.cloneElement(child, props);
            }
            return child;
        });

        return (
            <div className={`modal ${this.props.active ? "is-active" : ""}`}>
                <div className="modal-background"></div>
                <div className="modal-content">
                    <div className="box">
                        {childrenWithProps}
                    </div>
                </div>
                <button className="modal-close is-large" aria-label="close" onClick={this.handleClose.bind(this)}></button>
            </div>
        )
    }
}