var my_news = [
  {
    author: 'Евгений Подгаецкий',
    text: 'Современная веб-разработка',
    bigText: 'Учитывая тенденции лучше всего записаться на курсы'
  },
  {
    author: 'Гия Григолия',
    text: 'jQuery это круто',
    bigText: 'Рекомендую всем изучать эту замечательную библитотеку'
  }
];

window.ee = new EventEmitter();

var Article = React.createClass({
  propTypes: {
    data: React.PropTypes.shape({
      author: React.PropTypes.string.isRequired,
      text: React.PropTypes.string.isRequired,
      bigText: React.PropTypes.string.isRequired
    })
  },
  getInitialState: function() {
    return {
      visible: false
    };
  },
  readmoreClick: function(e) {
    e.preventDefault();
    this.setState({visible: true});
  },
  render: function() {
    var author = this.props.data.author,
        text = this.props.data.text,
        bigText = this.props.data.bigText,
        visible = this.state.visible;

    return (
      <div className='article'>
        <p className='news__author'>{author}:</p>
        <p className='news__text'>{text}</p>
        <a href="#"
          onClick={this.readmoreClick}
          className={'news__readmore ' + (visible ? 'none': '')}>
          Подробнее
        </a>
        <p className={'news__big-text ' + (visible ? '': 'none')}>{bigText}</p>
      </div>
    )
  }
});

var News = React.createClass({
  propTypes: {
    data: React.PropTypes.array.isRequired
  },

  render: function() {
    var data = this.props.data;
    var newsTemplate;

    if (data.length > 0) {
      newsTemplate = data.map(function(item, index) {
        return (
          <div key={index}>
            <Article data={item} />
          </div>
        )
      })
    } else {
      newsTemplate = <p>К сожалению новостей нет</p>
    }

    return (
      <div className='news'>
        {newsTemplate}
        <strong
          className={'news__count ' + (data.length > 0 ? '':'none') }>
          Всего новостей: {data.length}
        </strong>
      </div>
    );
  }
});

var Add = React.createClass({

  getInitialState: function() {
    return {
      agreeNotChecked: true,
      authorIsEmpty: true,
      textIsEmpty: true
    }
  },

  componentDidMount: function() { //ставим фокус в input
    ReactDOM.findDOMNode(this.refs.author).focus();
  },

  onFieldChange: function (fieldName, e) {
    if (e.target.value.trim().length > 0 ) {
      this.setState({[''+fieldName]: false})
    } else {
      this.setState({[''+fieldName]: true})
    }
  },

  onBtnClickHandler: function(e) {
  	e.preventDefault();

    var textEl = ReactDOM.findDOMNode(this.refs.text);

    var author = ReactDOM.findDOMNode(this.refs.author).value;
    var text = textEl.value;

    var item = [{
      author: author,
      text: text,
      bigText: '...'
    }];

    window.ee.emit('News.add', item);

    textEl.value = '';
    this.setState({textIsEmpty: true});
  },

  onCheckRuleClick: function(e) {
    this.setState({agreeNotChecked: !this.state.agreeNotChecked});
  },

  render: function() {
    var agreeNotChecked = this.state.agreeNotChecked,
        authorIsEmpty = this.state.authorIsEmpty,
        textIsEmpty = this.state.textIsEmpty;

    return (
      <form className='add cf'>
        <input 
          type='text'
          className='add__author'
          defaultValue=''
          placeholder='Ваше имя'
          ref='author'
          onChange={this.onFieldChange.bind(this, 'authorIsEmpty')}
        />
        <textarea
          className='add__text'
          defaultValue=''
          placeholder='текст новости'
          ref='text'
          onChange={this.onFieldChange.bind(this, 'textIsEmpty')}
        ></textarea>
        <label className='add__checkrule'>
          <input type='checkbox' onChange={this.onCheckRuleClick} ref='checkrule' />
          Я согласен с правилами
        </label>
        <button 
          className='add__btn'
          onClick={this.onBtnClickHandler}
          ref='alert_button'
          disabled={agreeNotChecked || authorIsEmpty || textIsEmpty}>
          Добавить новость 
        </button>
      </form>
    );
  }
});

var App = React.createClass({
  getInitialState: function() {
    return {
      news: my_news
    }
  },
  
  componentDidMount: function() {
    var self = this;
    window.ee.addListener('News.add', function(item) {
      var nextNews = item.concat(self.state.news);
      self.setState({news: nextNews});
    });
  },

  componentWillUnmount: function() {
    window.ee.removeListener('News.add');
  },

  render: function() {
    return (
      <div className='app'>
        <Add />
        <h3>Новости</h3>
        <News data={this.state.news} />
      </div>
    );
  }
});

ReactDOM.render(
  <App />,
  document.getElementById('root')
);