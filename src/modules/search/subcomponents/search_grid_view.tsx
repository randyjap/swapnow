import React from 'react';
import { shortenString, timeFromNow } from 'helpers';
import { IPost } from 'common/interfaces';
import { Pagination } from './';
declare var $;

interface Props {
  searchResult: IPost [];
}

interface State {
  results: IPost[];
  title?: number;
  description?: number;
  price?: number;
  created_at?: number;
  condition?: number;
  maxPages?: number;
  currentPage?: number;
  views?: number;
  sortBy?: string;
}

class SearchGridView extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    let results = props.searchResult;
    let maxPages = props.searchResult.length > 0 ? Math.ceil(props.searchResult.length / 16) : 1;

    this.state = {
      title: -1,
      description: -1,
      price: -1,
      created_at: 1,
      condition: -1,
      views: -1,
      results,
      maxPages,
      currentPage: 1,
      sortBy: "Posting Date"
    };

    this.sortBy = this.sortBy.bind(this);
  }

  public componentWillReceiveProps(nextProps) {
    let results = nextProps.searchResult;
    let maxPages = Math.ceil(nextProps.searchResult.length / 16)
    this.setState({results, maxPages});
  }

  private buttonClass(condition: string) {
    if (condition === 'Brand New') {
      return 'info';
    } else if (condition === 'Like New') {
      return 'primary';
    } else {
      return 'success';
    }
  }

  public sortBy(key: string, polarity: number) {
    let sortBy;

    if (key == "views") {
      sortBy = "Popularity";
    } else if (key == "updated_at") {
      sortBy = "Posting Date"
    } else {
      if (polarity == 1) {
        sortBy = "Price: Low to High"
      } else {
        sortBy = "Price: High to Low"
      }
    }

    let newArray: IPost[] = this.state.results.sort(function(a:object, b:object) {
      if (a[key] < b[key]) return (-1 * polarity);
      if (a[key] > b[key]) return (1 * polarity);
      return 0;
    });
    let newPolarity: number = -1 * polarity;

    this.setState({
      results: newArray,
      [key]: newPolarity,
      sortBy
    });
  }

  renderGridItem(post: IPost) {
    let createdDate: number | string= Date.parse(post.created_at);
    createdDate = Date.now() - createdDate <= 86400000 ? timeFromNow(post.created_at) : ""
    return (
      <div className="col-sm-6 col-md-3" key={Math.random() * post.id}
           onClick={() => window.location.href = `#/posts/${post.id}`}>
        <div className="thumbnail col-md-12">
          <a id={post.id}>
            <img src={post.img_url1} alt={post.title} />
            <div className="thumbnail-caption-top-right">{createdDate}</div>
          </a>
          <div className="caption" id="grid-caption">
            <span id="grid-title">${Number(post.price).toLocaleString()}&nbsp; | &nbsp;{post.title}</span>

            <div className="grid-bottom">
              <span className={`label label-${this.buttonClass(post.condition)}`} id="label-micro">
                {post.condition}
              </span>
              <span className="red">
                <span className="glyphicon glyphicon-fire" id="condition-views-grid"></span>
                {post.views} Views
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    let pageStart: number = (this.state.currentPage - 1) * 16;
    let pageEnd: number = this.state.currentPage * 16;

    return (
      <div>
        <div className="row">
          <div className="sort-by-panel">
            <div className="btn-group">
              <button type="button" className="btn btn-default btn-md dropdown-toggle btn-special-size" id="margin-right" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                {this.state.sortBy}&nbsp;&nbsp;<span className="caret"></span>
              </button>
              <ul className="dropdown-menu dropdown-menu-right">
                <li><a onClick={() => this.sortBy("views", -1)}>Popularity</a></li>
                <li><a onClick={() => this.sortBy("updated_at", -1)}>Posting Date</a></li>
                <li><a onClick={() => this.sortBy("price", 1)}>Price: Low to High</a></li>
                <li><a onClick={() => this.sortBy("price", -1)}>Price: High to Low</a></li>
              </ul>
            </div>
          </div>
          { this.state.results ? this.state.results.slice(pageStart, pageEnd).map(post => this.renderGridItem(post)) : null}
        </div>
        <Pagination that={this} maxPages={this.state.maxPages} currentPage={this.state.currentPage} />
      </div>
    );
  }
}

export { SearchGridView };
