import React from 'react';
import { shortenString, timeFromNow, IPost } from 'helpers';
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
  firstTime?: number;
}

class SearchGridView extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    let results: Post[] = props.searchResult;
    let maxPages = props.searchResult.length > 0 ? Math.ceil(props.searchResult.length / 15) : 1;

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
      firstTime: 1
    };

    this.sortBy = this.sortBy.bind(this);
    this.checkVerified = this.checkVerified.bind(this);
  }

  public componentWillReceiveProps(nextProps) {
    let results = nextProps.searchResult;
    let maxPages = Math.ceil(nextProps.searchResult.length / 15)
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

  public checkVerified(id) {
    FB.getLoginStatus(function(response) {
      if (response.status === "connected") {
        const accessToken = (FB as any).getAccessToken();
        $.ajax({
          method: "GET",
          url: `api/users/${accessToken}`
        }).then(obj => {
          if (obj.edu_email_confirmed) {
            window.location.href = `#/posts/${id}`
          } else if (obj.edu_email === null) {
            $('#emailInputModal').modal('show');
          } else {
            $('#emailVerificationModal').modal('show');
          }
        }).fail(() => FB.logout(res => console.log(res)))
      } else {
        $('#logInModal').modal('show');
      }
    });
  }

  public sortBy(key: string) {
    let polarity = this.state[key];
    let newArray: IPost[] = this.state.results.sort(function(a:object, b:object) {
      if (a[key] < b[key]) return (-1 * polarity);
      if (a[key] > b[key]) return (1 * polarity);
      return 0;
    });
    let newPolarity: number = -1 * polarity;

    this.setState({
      results: newArray,
      [key]: newPolarity
    });
  }

  renderGridItem(post: IPost) {
    let createdDate: number | string= Date.parse(post.created_at);
    createdDate = Date.now() - createdDate <= 86400000 ? timeFromNow(post.created_at) : ""
    return (
      <div className="col-sm-6 col-md-4" key={Math.random() * post.id}
           onClick={() => this.checkVerified(post.id)}>
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
    )
  }

  render() {
    let pageStart: number = (this.state.currentPage - 1) * 15;
    let pageEnd: number = this.state.currentPage * 15;

    return (
      <div>
        <div className="row">
          <div className="sort-by-panel">
            <div className="btn-group">
              <button type="button" className="btn btn-default btn-md dropdown-toggle btn-special-size" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Sort By <span className="caret"></span>
              </button>
              <ul className="dropdown-menu dropdown-menu-right">
                <li><a onClick={() => this.sortBy("title")} >Title</a></li>
                <li><a onClick={() => this.sortBy("description")} >Description</a></li>
                <li><a onClick={() => this.sortBy("price")} >Price</a></li>
                <li><a onClick={() => this.sortBy("created_at")} >Posting Date</a></li>
                <li><a onClick={() => this.sortBy("condition")} >Condition</a></li>
                <li><a onClick={() => this.sortBy("views")} >View Count</a></li>
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
