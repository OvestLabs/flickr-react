import React from 'react';
import ReactDOM from 'react-dom';
import ImageGrid from './components/ImageGrid';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            photos: [],
            query: 'kittens'
        };

        this.handleQueryChange = this.handleQueryChange.bind(this);
        this.handleSearchClick = this.handleSearchClick.bind(this);
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

        this.setState({
            photos: photos
        });
    }

    handleQueryChange(e) {
        this.setState({
            query: e.currentTarget.value
        });
    }

    handleSearchClick(e) {
        this.setState({
            photos: []
        });

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
                <input type="text" value={this.state.query} onChange={this.handleQueryChange}/>
                <button onClick={this.handleSearchClick}>Search</button>
                <ImageGrid photos={this.state.photos} spacing={5} maxRowHeight={200}/>
            </div>
        );
    }
};

ReactDOM.render(<App />, document.getElementById('app'));