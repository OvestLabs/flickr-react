import React from 'react';
import ReactDOM from 'react-dom';
import ImageGrid from './components/ImageGrid';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            photos: [],
            history: [],
            query: 'kittens'
        };

        this.handleQueryChange = this.handleQueryChange.bind(this);
        this.handleSearchClick = this.handleSearchClick.bind(this);
        this.handleHistoryClick = this.handleHistoryClick.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
    }

    fetchPhotos(query, page) {
        const url = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=3e7cc266ae2b0e0d78e279ce8e361736&format=json&nojsoncallback=1&safe_search=1&text=${query}&page=${page}`;

        this.isFetching = true;

        fetch(url)
            .then((response) => {
                return response.json();
            }).then((json) => {
                this.parseUrls(json.photos);
                this.isFetching = false;
                this.currentPage = page;
            });
    }
    
    parseUrls(data) {
        const results = data.photo;
        const photos = this.state.photos.slice();

        for (var i = 0; i < results.length; i++) {
            const item = results[i];
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

    addToHistory(query) {
        const newHistory = this.state.history.slice();
        const existingIndex = newHistory.indexOf(query);

        if (existingIndex >= 0) {
            newHistory.splice(existingIndex, 1);
        }
        
        newHistory.push(query);

        this.setState({
            history: newHistory
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

        const query = this.state.query.trim();

        if (query.length < 2) {
            return;
        }

        this.fetchPhotos(query, 1);
        this.addToHistory(query);
    }

    handleHistoryClick() {
        const history = this.state.history;

        console.log(history);
    }

    handleLoadMore() {
        if (!this.isFetching) {
            this.fetchPhotos(this.state.query, this.currentPage + 1);
        }
    }

    render() {
        return (
            <div>
                <input type="text" value={this.state.query} onChange={this.handleQueryChange}/>
                <button onClick={this.handleSearchClick}>Search</button>
                <button onClick={this.handleHistoryClick}>History</button>
                <ImageGrid onLoadMore={this.handleLoadMore} photos={this.state.photos} spacing={5} maxRowHeight={200}/>
            </div>
        );
    }
};

ReactDOM.render(<App />, document.getElementById('app'));