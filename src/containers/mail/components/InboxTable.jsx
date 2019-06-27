import React, {PureComponent} from 'react';
import PropTypes from "prop-types";
import EmailListItem from './EmailListItem';
import Table from '../../../components/table/Table';
import Pagination from '../../../components/pagination/Pagination';
import EmailsControls from './EmailsControls';

export default class InboxTable extends PureComponent {
  static propTypes = {
    emails: PropTypes.array
  };
  
  onChangePage = (pageOfItems) => {
    this.setState({pageOfItems: pageOfItems});
  };
  
  render() {
    let {emails} = this.props;

    return (
      <div className='inbox__content'>
        <EmailsControls emails={emails} onChangePage={this.onChangePage}/>
        <Table className='table--bordered inbox__emails-table' responsive>
          <tbody>
          {emails.slice(0, 15).map((e, i) =>
            <EmailListItem email={e} key={i} onLetter={this.props.onLetter}/>
          )}
          </tbody>
        </Table>
        <Pagination items={emails} pageSize={15} onChangePage={this.onChangePage}/>
      </div>
    )
  }
}