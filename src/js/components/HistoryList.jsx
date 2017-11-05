import React from 'react';
import ReactDOM from 'react-dom';

/**
 * Renders a collection of previously searched queries.
 */
class HistoryList extends React.Component {
    constructor(props) {
        super(props);        

        this.handleItemClick = this.handleItemClick.bind(this);
        this.handleDocumentClick = this.handleDocumentClick.bind(this);
    }

    componentDidMount() {
        document.addEventListener('click', this.handleDocumentClick);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleDocumentClick);
    }

    handleItemClick(index, e) {
        const query = this.props.items[index];
        const onSelected = this.props.onSelected;

        if (typeof onSelected === 'function') {
            onSelected(query);
        }
    }

    handleDocumentClick(e) {
        const onExit = this.props.onExit;

        if (typeof onExit !== 'function') {
            return;
        }

        const node = ReactDOM.findDOMNode(this).children[0];
        let target = e.target;

        while (target != null) {
            if (target.parentElement == node) {
                return;
            }

            target = target.parentElement;
        }

        onExit();
    }

    render() {
        const listItems = this.props.items.map((query, index) => (
            <li key={index} onClick={this.handleItemClick.bind(this, index)}>{query}</li>
        ));

        return (
            <div className='history'>
                <div className='container centered-content'>
                    <ul>{listItems}</ul>
                </div>
            </div>
        );
    }
};

HistoryList.defaultProps = {
    items: [],
    onSelected: function() { /* left blank intentionally */ },
    onExit: function() { /* left blank intentionally */ },
};

export default HistoryList;