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
            lastQuery: null,
            showHistory: false,
            currentPage: 0,
            totalPages: 0,
            isFetching: false
        };

        this.handleQueryChange = this.handleQueryChange.bind(this);
        this.handleSearchKeyUp = this.handleSearchKeyUp.bind(this);
        this.handleHistoryClick = this.handleHistoryClick.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
        this.handleHistorySelected = this.handleHistorySelected.bind(this);
    }

    fetchPhotos(query, page) {
        const url = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=3e7cc266ae2b0e0d78e279ce8e361736&format=json&nojsoncallback=1&safe_search=1&text=${query}&page=${page}`;

        this.setState({
            isFetching: true,
            lastQuery: query
        })

        fetch(url)
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                const photos = this.parseUrls(json.photos);

                this.setState({
                    photos: photos,
                    currentPage: page,
                    totalPages: json.photos.pages,
                    isFetching: false
                })
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

        return photos;
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
        if (!this.state.isFetching) {
            this.fetchPhotos(this.state.query, this.state.currentPage + 1);
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

    renderHistory() {
        return this.state.showHistory
            ? (<HistoryList items={this.state.history} onSelected={this.handleHistorySelected} />)
            : null;
    }

    renderLoader() {
        const state = this.state;

        if (state.isFetching || state.currentPage < state.totalPages) {
            return <div className='loader'></div>;
        }

        return null;
    }

    renderGrid() {
        const state = this.state;
        const photos = state.photos;
        
        if (photos.length > 0) {
            return <ImageGrid onLoadMore={this.handleLoadMore} photos={photos} spacing={5} maxRowHeight={200}/>;
        }

        if (state.isFetching) {
            return null;
        }

        if (state.lastQuery != null && state.totalPages <= 0) {
            return <div className='empty centered-content'>Oops! There are no matches for “{state.lastQuery}”.<br/>Please try broadening your search.</div>;
        }
        
        return null;
    }

    render() {
        const history = this.renderHistory();
        const loader = this.renderLoader();
        const grid = this.renderGrid();
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
                {grid}
                {loader}
            </div>
        );
    }
};

ReactDOM.render(<App />, document.getElementById('app'));