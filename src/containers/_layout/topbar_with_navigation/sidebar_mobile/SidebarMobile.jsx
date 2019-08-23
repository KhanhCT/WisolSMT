import React, {Component} from 'react';
import Scrollbar from 'react-smooth-scrollbar';
import classNames from 'classnames';
import SidebarContent from './SidebarContent';
import PropTypes from 'prop-types';


class Sidebar extends Component {
  static propTypes = {
    sidebar: PropTypes.object.isRequired,
    changeToDark: PropTypes.func,
    changeToLight: PropTypes.func,
    changeMobileSidebarVisibility: PropTypes.func,
  };
  
  render() {
    let sidebarClass = classNames({
      'sidebar sidebar--no-desktop': true,
      'sidebar--show': this.props.sidebar.show
    });

    let {changeToDark, changeToLight, changeMobileSidebarVisibility} = this.props;

    return (
      <div className={sidebarClass}>
        <div className='sidebar__back' onClick={changeMobileSidebarVisibility}/>
        <Scrollbar className='sidebar__scroll scroll'>
          <div className='sidebar__wrapper sidebar__wrapper--mobile'>
            <SidebarContent onClick={changeMobileSidebarVisibility}
                            changeToDark={changeToDark} changeToLight={changeToLight}/>
          </div>
        </Scrollbar>
      </div>
    )
  }
}

export default Sidebar;