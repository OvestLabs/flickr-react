import React from 'react';
import ReactDOM from 'react-dom';
import ImageGrid from './components/ImageGrid';
import HistoryList from './components/HistoryList';

import '../css/style.css';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            photos: [],
            history: [],
            query: 'kittens',
            showHistory: false
        };

        this.handleQueryChange = this.handleQueryChange.bind(this);
        this.handleSearchKeyUp = this.handleSearchKeyUp.bind(this);
        this.handleHistoryClick = this.handleHistoryClick.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
        this.handleHistorySelected = this.handleHistorySelected.bind(this);
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

    handleSearchKeyUp(e) {
        if (e.key !== 'Enter') {
            return;
        }

        e.currentTarget.blur();

        this.setState({
            photos: [],
            showHistory: false
        });

        const query = this.state.query.trim();

        if (query.length < 2) {
            return;
        }

        this.fetchPhotos(query, 1);
        this.addToHistory(query);
    }

    handleHistoryClick() {
        this.setState({
            showHistory: !this.state.showHistory
        })
    }

    handleLoadMore() {
        if (!this.isFetching) {
            this.fetchPhotos(this.state.query, this.currentPage + 1);
        }
    }

    handleHistorySelected(query) {
        if (this.state.query === query) {
            this.setState({
                showHistory: false
            });
            return;
        }

        this.setState({
            photos: [],
            query: query,
            showHistory: false
        });

        this.fetchPhotos(query, 1);
    }

    render() {
        const history = this.state.showHistory
            ? (<HistoryList items={this.state.history} onSelected={this.handleHistorySelected} />)
            : null;

        const noHistory = this.state.history.length === 0;

        return (
            <div>
                <header>
                    <div className='search centered-content'>
                        <input type="text" value={this.state.query} onChange={this.handleQueryChange} onKeyUp={this.handleSearchKeyUp}/>
                        <button onClick={this.handleHistoryClick} disabled={noHistory}>History</button>
                    </div>
                </header>
                {history}
                <ImageGrid onLoadMore={this.handleLoadMore} photos={this.state.photos} spacing={5} maxRowHeight={200}/>
            </div>
        );
    }
};

ReactDOM.render(<App />, document.getElementById('app'));