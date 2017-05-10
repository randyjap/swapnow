import React from 'react';

import { SearchGridView, SearchListView, SearchNavbar, SearchSidebar } from './subcomponents';

interface Props {
  user: object
}

interface State {
  viewType: string
}

class Search extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);

    this.state = {
      viewType: 'grid'
    };
  }

  public componentDidMount() {

  }

  private changeView(viewType: string) {
    return () => this.setState({ viewType })
  }

  private renderView() {
    if (this.state.viewType === 'grid') {
      return <SearchGridView />;
    } else {
      return <SearchListView />;
    }
  }

  public render() {
    return (
      <div>
        <SearchNavbar />

        <div className="container">
          <div className="row">
            <SearchSidebar />
            <div className="col-md-10">
              <div className="search-icons">
                <button className="btn btn-link" onClick={this.changeView('grid')}>
                  <span className="glyphicon glyphicon-th-large"></span> Grid View
                </button>
                <button className="btn btn-link" onClick={this.changeView('list')}>
                  <span className="glyphicon glyphicon-th-list"></span> List View
                </button>
              </div>    
              { this.renderView() }
            </div>
   
          </div>
        </div>
      </div>
    );
  }
}

export default Search;
