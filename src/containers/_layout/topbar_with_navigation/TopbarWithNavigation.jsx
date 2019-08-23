import React, {PureComponent} from 'react';
import {Link} from 'react-router-dom';
import TopbarSidebarButton from './TopbarSidebarButton';
import TopbarProfile from './TopbarProfile';
import TopbarMail from './TopbarMail';
import TopbarLanguage from './TopbarLanguage';
import TopbarNotification from './TopbarNotification';
import TopbarNav from './tobar_nav/TopbarNav';
import PropTypes from 'prop-types';

export default class TopbarWithNavigation extends PureComponent {
  static propTypes = {
    changeMobileSidebarVisibility: PropTypes.func,
  };

  render() {
    let {changeMobileSidebarVisibility} = this.props;

    return (
      <div className='topbar topbar--navigation'>
        <div className='topbar__wrapper'>
          <div className='topbar__left'>
            <TopbarSidebarButton changeMobileSidebarVisibility={changeMobileSidebarVisibility}/>
            <Link className='topbar__logo' to='/dashboard_default'/>
          </div>
          <TopbarNav/>
          <div className='topbar__right'>
            <TopbarNotification/>
            <TopbarMail new/>
            <TopbarProfile/>
            <TopbarLanguage/>
          </div>
        </div>
      </div>
    )
  }
}