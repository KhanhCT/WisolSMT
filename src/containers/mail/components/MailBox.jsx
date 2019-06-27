import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Badge} from 'reactstrap';

export default class MailBox extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    amount: PropTypes.number,
    selected: PropTypes.bool
  };
  
  render() {
    let {title, amount, selected} = this.props;

    return (
      <div className={`inbox__mailbox${selected ? ' active' : ''}`}>
        {this.props.children}
        <p className='inbox__mailbox-title'>{title}</p>
        {amount ? <Badge className='inbox__mailbox-label'>{amount}</Badge> : ''}
      </div>
    )
  }
}