import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Dotdotdot from 'react-dotdotdot'
import classNames from 'classnames';

import CheckIcon from 'mdi-react/CheckIcon';
import PaperclipIcon from 'mdi-react/PaperclipIcon';
import StarIcon from 'mdi-react/StarIcon';

export default class EmailListItem extends PureComponent {
  static propTypes = {
    email: PropTypes.object.isRequired,
    onLetter: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      favorite: this.props.email.favorite
    };
  }

  onFavorite = (e) => {
    e.preventDefault();
    this.setState({favorite: !this.state.favorite});
  };

  render() {
    let {email, onLetter} = this.props;
    let itemClass = classNames({
      'inbox__email-list-item': true,
      'inbox__email-list-item--unread': email.unread,
    });

    return (
      <tr className={itemClass}>
        <td>
          <label
            className='checkbox-btn checkbox-btn--colored-click inbox__email-list-item-checkbox'>
            <input className='checkbox-btn__checkbox' type='checkbox'/>
            <span className='checkbox-btn__checkbox-custom'>
            <CheckIcon/>
          </span>
          </label>
        </td>
        <td onClick={this.onFavorite}>
          <StarIcon className={`inbox__favorite${this.state.favorite ? ' active' : ''}`}/>
        </td>
        <td className='inbox__email-table-name' onClick={onLetter}>{email.name}</td>
        <td onClick={onLetter} className='inbox__email-table-preview'>
          <Dotdotdot clamp={1}><b>{email.subject}</b> {email.preview}</Dotdotdot>
        </td>
        <td onClick={onLetter}>{email.attach ? <PaperclipIcon/> : ''}</td>
        <td onClick={onLetter} className='inbox__email-table-date'>{email.time}</td>
      </tr>
    )
  }
}