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
        this.handleDocumentScroll = this.handleDocumentScroll.bind(this);
    }

    componentDidMount() {
        document.addEventListener('click', this.handleDocumentClick);
        document.addEventListener('scroll', this.handleDocumentScroll);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleDocumentClick);
        document.removeEventListener('scroll', this.handleDocumentScroll);
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

    handleDocumentScroll() {
        const onExit = this.props.onExit;

        if (typeof onExit !== 'function') {
            return;
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