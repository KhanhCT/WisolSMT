import React, {PureComponent} from 'react';
import {Col, Container, Row} from 'reactstrap';
import InboxCard from './components/InboxCard';
import {translate} from 'react-i18next';

class Mail extends PureComponent {
  render() {
    const {t} = this.props;

    return (
      <Container>
        <Row>
          <Col md={12}>
            <h3 className='page-title'>{t('mail_application.page_title')}</h3>
            <h3 className='page-subhead subhead'>You can compose an email here</h3>
          </Col>
        </Row>
        <Row>
          <InboxCard/>
        </Row>
      </Container>
    )
  }
}

export default translate('common')(Mail);
