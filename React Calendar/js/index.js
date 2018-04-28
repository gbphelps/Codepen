var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Date.prototype.endofMonth = function () {
  var date = new Date(this.valueOf());
  date.setMonth(date.getMonth() + 1);
  date.setDate(0);
  return date.getDate();
};

Date.prototype.firstWeekday = function () {
  var date = new Date(this.valueOf());
  date.setDate(1);
  return date.getDay();
};

// console.log(new Date().firstWeekday());


var Calendar = function (_React$Component) {
  _inherits(Calendar, _React$Component);

  function Calendar(props) {
    _classCallCheck(this, Calendar);

    var _this = _possibleConstructorReturn(this, (Calendar.__proto__ || Object.getPrototypeOf(Calendar)).call(this, props));

    _this.state = {
      date: new Date(),
      displayDate: new Date(),
      flip: false,
      reverse: true,
      stored: []
    };

    _this.dayHeaders = React.createElement(
      'div',
      { className: 'dayHeaders' },
      React.createElement(Hcal, { content: 'SUN' }),
      React.createElement(Hcal, { content: 'MON' }),
      React.createElement(Hcal, { content: 'TUE' }),
      React.createElement(Hcal, { content: 'WED' }),
      React.createElement(Hcal, { content: 'THU' }),
      React.createElement(Hcal, { content: 'FRI' }),
      React.createElement(Hcal, { content: 'SAT' })
    );

    _this.month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return _this;
  }

  _createClass(Calendar, [{
    key: 'animation',
    value: function animation() {
      var suffix = this.state.flip ? '2' : '';
      var name = this.state.reverse ? 'rotate-right' : 'rotate-left';
      return name + suffix;
    }
  }, {
    key: 'squareClickEvent',
    value: function squareClickEvent(i, range) {
      if (i < range[0] || i >= range[1]) return;
      var prev = Array.from(this.state.stored);
      if (prev.length === 1 && i > prev[0]) {
        prev.push(i);
        this.setState({ stored: prev });
      } else {
        this.setState({ stored: [i] });
      }
    }
  }, {
    key: 'options',
    value: function options(i) {
      var range = this.state.stored;
      var conditions = void 0;
      var result = { selected: '', delay: '0s' };
      if (range.length === 1 && range[0] === i) {
        result.selected = 'selected';
      } else if (range.length === 2 && i >= range[0] && i <= range[1]) {
        result.selected = 'selected';
        result.delay = (i - range[0]) * 40 + 'ms';
      }
      return result;
    }
  }, {
    key: 'createCal',
    value: function createCal(fwd, eom) {
      var _this2 = this;

      var holder = [];
      var week = [];

      var _loop = function _loop(i) {
        var type = 'nil';
        var content = '';
        if (i >= fwd && i < fwd + eom) {
          type = 'day';content = i - fwd + 1;
        }
        week.push(React.createElement(Square2, {
          display: type,
          key: i,
          content: content,
          animation: _this2.animation(),
          selected: _this2.options(i).selected,
          delay: _this2.options(i).delay,
          onClick: function onClick() {
            return _this2.squareClickEvent(i, [fwd, fwd + eom]);
          }
        }));

        if (week.length === 7) {
          holder.push(week);
          week = [];
        }
      };

      for (var i = 0; i < 42; i++) {
        _loop(i);
      }

      return holder.map(function (week) {
        return React.createElement(
          'div',
          { className: 'week' },
          week
        );
      });
    }
  }, {
    key: 'changeMonth',
    value: function changeMonth(inc) {
      var display = new Date(this.state.displayDate.valueOf());
      display.setMonth(display.getMonth() + inc);
      var direction = inc > 0 ? true : false;
      var rotation = this.state.rotation;
      var plus = inc < 0 ? -180 : 180;

      this.setState({ displayDate: display,
        flip: !this.state.flip,
        reverse: direction,
        rotation: rotation + plus,
        stored: [] });
    }
  }, {
    key: 'monthBar',
    value: function monthBar() {
      var _this3 = this;

      var month = this.month[this.state.displayDate.getMonth()];
      var year = this.state.displayDate.getFullYear();
      return React.createElement(
        'div',
        { className: 'monthBar' },
        React.createElement(
          'div',
          {
            className: 'button',
            onClick: function onClick() {
              return _this3.changeMonth(-1);
            } },
          '\u25C0\xA0'
        ),
        month + ' ' + year,
        React.createElement(
          'div',
          {
            className: 'button',
            onClick: function onClick() {
              return _this3.changeMonth(1);
            } },
          '\xA0\u25B6'
        )
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var fwd = this.state.displayDate.firstWeekday();
      var eom = this.state.displayDate.endofMonth();

      return React.createElement(
        'div',
        { className: 'calendar' },
        React.createElement(
          'div',
          { className: 'all' },
          React.createElement(
            'div',
            { className: 'wrapper' },
            React.createElement(Bar, { animation: 'rotate-down', content: this.monthBar() }),
            this.dayHeaders,
            this.createCal(fwd, eom)
          )
        )
      );
    }
  }]);

  return Calendar;
}(React.Component);

function Hcal(props) {
  return React.createElement(
    'div',
    { className: 'hcal' },
    props.content
  );
}

var forward = {
  front: { transform: 'translateZ(25px)' },
  left: { transform: 'rotateY(-90deg)translateZ(25px)' },
  right: { transform: 'rotateY(90deg)translateZ(25px)' },
  top: { transform: 'rotateX(90deg)translateZ(25px)' },
  bottom: { transform: 'rotateX(-90deg)translateZ(25px)' },
  back: { transform: 'rotateY(180deg)translateZ(25px)' },
  rot: { transform: '' }
};

function Square2(props) {

  return React.createElement(
    'div',
    { className: ['square', props.selected, props.display].join(' '),
      style: { animationName: props.animation },
      onClick: props.onClick },
    React.createElement(
      'div',
      { className: 'face one', style: forward.front },
      props.content
    ),
    React.createElement('div', { className: 'face two', style: forward.left }),
    React.createElement('div', { className: 'face three', style: forward.right }),
    React.createElement('div', { className: 'face five', style: forward.bottom }),
    React.createElement('div', { className: 'face six', style: forward.back })
  );
}

function Bar(props) {

  var side = {
    height: '50px',
    position: 'absolute',
    top: '0px',
    width: '100%'
  };

  var back = {
    transform: 'rotateY(180deg)translateZ(25px)'
  };

  var front = {
    background: 'red',
    transform: 'translateZ(25px)'
  };

  var top = {
    transform: 'rotateX(90deg)translateZ(25px)'
  };

  var bottom = {
    transform: 'rotateX(-90deg)translateZ(25px)'
  };

  return React.createElement(
    'div',
    { className: 'bar', style: { animationName: props.animation } },
    React.createElement(
      'div',
      { className: 'side', style: Object.assign(front, side) },
      props.content
    ),
    React.createElement('div', { className: 'side', style: Object.assign(back, side) }),
    React.createElement('div', { className: 'side', style: Object.assign(top, side) }),
    React.createElement('div', { className: 'side', style: Object.assign(bottom, side) })
  );
}

///////////////////////////////////////////////////////


ReactDOM.render(React.createElement(Calendar, null), document.getElementById('root'));