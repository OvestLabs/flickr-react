import React from 'react';
import ReactDOM from 'react-dom';

/**
 * Renders a collection of previously searched queries.
 */
class HistoryList extends React.Component {
    constructor(props) {
        super(props);        

        this.handleItemClick = this.handleItemClick.bind(this);
    }

    handleItemClick(index, e) {
        e.preventDefault();

        const query = this.props.items[index];
        const onSelected = this.props.onSelected;

        if (typeof onSelected === 'function') {
            onSelected(query);
        }
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
    onSelected: function() { /* left blank intentionally */ }
};

export default HistoryList;