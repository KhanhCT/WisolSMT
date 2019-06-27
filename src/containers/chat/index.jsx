import React, {PureComponent} from 'react';
import {Col, Container, Row} from 'reactstrap';
import ChatCard from './components/ChatCard';
import {translate} from 'react-i18next';

class Chat extends PureComponent {
  render() {
    const {t} = this.props;

    return (
      <Container>
        <Row>
          <Col md={12}>
            <h3 className='page-title'>{t('chat_application.page_title')}</h3>
          </Col>
        </Row>
        <Row>
          <ChatCard/>
        </Row>
      </Container>
    )
  }
}

export default translate('common')(Chat);
