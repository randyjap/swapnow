import React from 'react';
import { merge } from 'lodash';
import autoBind from 'react-autobind';
import { withRouter, hashHistory, Link } from 'react-router';

import { LoadingSpinner } from 'common/components';
import { IUser, IPost, IChat, 
         ISearchResult, ICurrentQuery } from 'common/interfaces';
import { shortenString,
         capitalize,
         searchParams,
         getCategory } from 'helpers';
import { SearchGridView,
         SearchListView,
         SearchNavbar,
         Pagination } from './subcomponents';

interface State {
  categories: any;
  isLoading: boolean;
}

interface Props {
  user: IUser;
  chat: IChat;
  searchResult: any;
  search: (query: object) => JQueryXHR;
  location: any;
  post: IPost;
  currentQuery: ICurrentQuery;
  saveQuery: any;
  fetchFirebaseConversations: any;
}

class Search extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      categories: [
        "All", "Course Material", "Furniture", "Clothing",
        "Electronics", "Housing", "Bikes", "Games", "Others",
        "Lost & Found", "My Course Material"
      ],
      isLoading: true
    };

    autoBind(this);
  }

  public componentWillMount() {
    hashHistory.push(this.props.location.pathname);

    let category = getCategory(this.props.location);    
    const currentQuery = this.props.currentQuery;
    let nextQuery = merge({}, currentQuery, { category, page_idx: 1 });

    if (this.props.user) {
      const access_token = this.props.user.auth.accessToken;
      nextQuery = merge({}, nextQuery, { access_token });
    }

    this.props.search(nextQuery).then(
      res => this.setState({ isLoading: false })
    );
    this.props.saveQuery(nextQuery);
  }

  public componentWillReceiveProps(nextProps: any){
    let category = getCategory(nextProps.location);
    
    if (this.state.categories.includes(category) &&
        nextProps.location !== this.props.location) {
      const currentQuery = this.props.currentQuery;
      this.props.saveQuery({category});
      let nextQuery = merge({}, currentQuery, {category});
      if ((this.props.currentQuery.category === "My Course Material" && this.props.user) || 
        (nextProps.location.pathname === "/mycoursematerial" && nextProps.user)) {      
        const access_token = this.props.user.auth.accessToken;
        nextQuery = merge({}, nextQuery, {access_token});
      }

      this.props.search(nextQuery);
    }
  }

  private changeView(viewType: string) {
    const currentQuery = this.props.currentQuery;

    this.props.saveQuery({viewType});

    let nextQuery = merge({}, currentQuery, {viewType})
    if (this.props.currentQuery.category === "My Course Material" && this.props.user) {
      const access_token = this.props.user.auth.accessToken;
      nextQuery = merge({}, nextQuery, {access_token});
      this.props.search(nextQuery);
    } else {
      this.props.search(nextQuery);
    }
  }

  private renderView() {
    let { user, chat, searchResult, search, currentQuery, 
          saveQuery, fetchFirebaseConversations } = this.props;

    let props = { user, chat, searchResult, search, currentQuery, 
                  saveQuery, fetchFirebaseConversations };

    if (this.props.currentQuery.viewType === 'grid') {
      return <SearchGridView {...props} />;
    } else {
      return <SearchListView {...props} />;
    }
  }

  private renderCategoryMenu(label) {
    const currentQuery = this.props.currentQuery;
    const nextQuery = merge({}, currentQuery, {category: label, page_idx: 1, query: ""});

    this.props.saveQuery(nextQuery);
    this.props.search(nextQuery);

    $('#search-query').focus();
  }

  public render() {
    if (this.state.isLoading) return <LoadingSpinner />;

    let path = this.props.location.pathname.slice(1);
    let category = this.props.currentQuery.category;
    let label = category;

    if (category === "All") {
      label = null;
    }
    
    if (category === "/mycoursematerial") {
      label = 'My Course Material';
      category = 'My Course Material';
    }

    let minResult = (this.props.currentQuery.page_idx - 1) * 16 + 1;
    let maxResult = (this.props.currentQuery.page_idx * 16);
    let totalResults = this.props.searchResult.result_count;

    minResult = totalResults === 0 ? 0 : minResult;
    maxResult = maxResult <= totalResults ? maxResult : totalResults;

    return (
      <div>
        <div className="container">
          <div className="row">
            <SearchNavbar
              currentQuery={this.props.currentQuery}
              home={false}
              search={this.props.search}
              searchResult={this.props.searchResult}
              saveQuery={this.props.saveQuery}
              user={this.props.user}
            />
            <div className="col-md-12">
              <div id="nav-tools">
                <nav className="breadcrumb" id="breadcrumb-container">
                  <Link 
                    onClick={() => this.renderCategoryMenu("All")} 
                    className="breadcrumb-item" 
                    to="recent"
                  >
                    All
                  </Link>
                  {label && 
                    <Link 
                      onClick={() => this.renderCategoryMenu(category)} 
                      className="breadcrumb-item" 
                      to={`${path}`}
                    >
                      {label}
                    </Link>
                  }
                  <span className="breadcrumb-item active" id="result-count">
                    {minResult} - {maxResult} of {totalResults} result(s)
                  </span>
                  <span className="breadcrumb-item active" id="result-count-2" />
                </nav>

                <div className="search-icons">
                  <button 
                    className="btn btn-link btn-special-size btn-special-margin" 
                    id="grid-type" 
                    onClick={() => this.changeView('grid')}
                  >
                    <span className="glyphicon glyphicon-th-large"></span>
                  </button>
                  <button 
                    className="btn btn-link btn-special-size btn-special-margin" 
                    id="list-type" 
                    onClick={() => this.changeView('list')}
                  >
                    <span className="glyphicon glyphicon-th-list"></span>
                  </button>
                </div>
              </div>
              { this.renderView() }
              <Pagination
                user={this.props.user}
                search={this.props.search}
                saveQuery={this.props.saveQuery}
                maxPages={this.props.searchResult.max_pages}
                currentPage={this.props.currentQuery.page_idx}
                currentQuery={this.props.currentQuery}
                fetchFirebaseConversations={this.props.fetchFirebaseConversations}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Search);
