import React, {PureComponent} from 'react';
import {Button, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown} from 'reactstrap';
import PropTypes from 'prop-types';

import CheckIcon from 'mdi-react/CheckIcon';
import MenuDownIcon from 'mdi-react/MenuDownIcon';
import ReloadIcon from 'mdi-react/ReloadIcon';
import MagnifyIcon from 'mdi-react/MagnifyIcon';
import Pagination from '../../../components/pagination/PaginationSmall';


export default class EmailsControls extends PureComponent {
  static propTypes = {
    emails: PropTypes.array,
    onChangePage: PropTypes.func
  };

  render() {
    let {emails, onChangePage} = this.props;

    return (
      <div className='inbox__emails-controls-wrap'>
        <div className='inbox__emails-controls'>
          <label
            className='checkbox-btn checkbox-btn--colored-click inbox__emails-control-checkbox'>
            <input className='checkbox-btn__checkbox' type='checkbox'/>
            <span className='checkbox-btn__checkbox-custom'>
                    <CheckIcon/>
                  </span>
          </label>
          <UncontrolledDropdown>
            <DropdownToggle className='icon icon--right' outline size='sm'>
              <p>Filter By <MenuDownIcon/></p>
            </DropdownToggle>
            <DropdownMenu className='dropdown__menu'>
              <DropdownItem>Name</DropdownItem>
              <DropdownItem>Date</DropdownItem>
              <DropdownItem>Favorite</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          <Button outline className='icon inbox__emails-control-reload' size='sm' onClick={(e) => e.preventDefault()}>
            <ReloadIcon/>
          </Button>
        </div>
        <div className='inbox__emails-controls-right'>
          <div className='inbox__emails-control-search'>
            <input placeholder='Search'/>
            <div className='inbox__emails-control-search-icon'><MagnifyIcon/></div>
          </div>
          <Pagination items={emails} onChangePage={onChangePage}/>
        </div>
      </div>
    )
  }
}