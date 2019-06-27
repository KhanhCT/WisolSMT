import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Button, ButtonToolbar} from 'reactstrap';

import ArrowLeftIcon from 'mdi-react/ArrowLeftIcon';
import StarIcon from 'mdi-react/StarIcon';
import ReplyIcon from 'mdi-react/ReplyIcon';
import DeleteIcon from 'mdi-react/DeleteIcon';
import PrinterIcon from 'mdi-react/PrinterIcon';
import PaperclipIcon from 'mdi-react/PaperclipIcon';
import CloseIcon from 'mdi-react/CloseIcon';

export default class Email extends PureComponent {
  static propTypes = {
    email: PropTypes.object,
    onReply: PropTypes.func,
    onBack: PropTypes.func
  };
  
  constructor() {
    super();
    this.state = {
      quickReply: false,
    };
  }

  onQuickReply = () => {
    this.setState({quickReply: true})
  };
  
  onQuickReplyClose = () => {
    this.setState({quickReply: false})
  };
  
  render() {
    let {email, onReply, onBack} = this.props;

    return (
      <div className='inbox__email inbox__content'>
        <div className='inbox__email-header'>
          <div className='inbox__email-left'>
          <button className='inbox__email-back' onClick={onBack}><ArrowLeftIcon/></button>
          <div className='inbox__email-ava'>
            <img src={email.ava} alt=''/>
          </div>
          <div className='inbox__email-info'>
            <h5 className='inbox__email-name'>{email.name}
              <StarIcon className={`inbox__favorite${email.favorite ? ' active' : ''}`}/>
            </h5>
            <p className='inbox__email-email'>{email.email}</p>
          </div>
          </div>
          <div className='inbox__email-right'>
            <p className='inbox__email-time'>{email.time}</p>
            <button className='inbox__email-btn' onClick={onReply}><ReplyIcon/></button>
            <button className='inbox__email-btn'><DeleteIcon/></button>
            <button className='inbox__email-btn'><PrinterIcon/></button>
          </div>
        </div>
        <div className='inbox__email-body'>
          {email.body}
        </div>
        {email.attachment ?
          <div className='inbox__email-attachment'>
            <h5 className='inbox__email-attachment-title'>Attachment (2 file 12Mb):</h5>
            {email.attachment.map((a, i) =>
              <div key={i} className='inbox__email-attachment-link'>
                <PaperclipIcon/><a href={a.link} download>{a.name} ({a.size})</a>
              </div>
            )}
          </div> : ''
        }
        <div className='inbox__email-reply'>
          <textarea className='inbox__email-reply-textarea' onFocus={this.onQuickReply}/>
          {!this.state.quickReply ?
            <p className='inbox__email-reply-placeholder'>Click here to <span>reply</span></p>
            :
            <div>
              <button className='inbox__email-reply-close' onClick={this.onQuickReplyClose}>
                <CloseIcon/>
              </button>
              <ButtonToolbar className='inbox__email-reply-btns'>
                <Button size='sm' color='primary'>Send</Button>
                <button className='inbox__email-reply-btn-full' onClick={onReply}>
                  Go to full answer form
                </button>
              </ButtonToolbar>
            </div>
          }
        </div>
      </div>
    )
  }
}