import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            query: 'kittens'
        };
    }

    parseUrls(data) {
        const photoList = data.photo;
        const photos = [];

        for (var i = 0; i < photoList.length; i++) {
            const item = photoList[i];
            const url = `https://farm${item.farm}.static.flickr.com/${item.server}/${item.id}_${item.secret}.jpg`;

            photos.push({
                title: item.title,
                url: url
            });
        }

        console.log(photos);
    }

    handleQueryChange(e) {
        this.state({
            query: e.currentTarget.value
        });
    }

    handleSearchClick(e) {
        const query = this.state.query;

        if (query.length < 2) {
            return;
        }

        const url = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=3e7cc266ae2b0e0d78e279ce8e361736&format=json&nojsoncallback=1&safe_search=1&text=${query}`;

        fetch(url)
            .then((response) => {
                return response.json();
            }).then((json) => {
                this.parseUrls(json.photos);
            });
    }

    render() {
        return (
            <div>
                <input type="text" value={this.state.query} onChange={this.handleQueryChange.bind(this)}/>
                <button onClick={this.handleSearchClick.bind(this)}>Search</button>
            </div>
        );
    }
};

ReactDOM.render(<App />, document.getElementById('app'));