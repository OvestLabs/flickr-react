import React from 'react';
import ReactDOM from 'react-dom';

class HistoryList extends React.Component {
    constructor(props) {
        super(props);        
    }

    render() {
        const listItems = this.props.items.map((query, index) => (
            <li key={index}>{query}</li>
        ));

        return (
            <div>
                <h1>History!</h1>
                <ul>{listItems}</ul>
            </div>
        );
    }
};

HistoryList.defaultProps = {
    items: []
};

export default HistoryList;