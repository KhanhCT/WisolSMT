import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

class ToggleCollapsedMenu extends PureComponent {
  static propTypes = {
    sidebar: PropTypes.object.isRequired,
    changeSidebarVisibility: PropTypes.func,
  };

  render() {
    let {changeSidebarVisibility, sidebar} = this.props;

    return (
      <label className='toggle-btn customizer__toggle'>
        <input className='toggle-btn__input' type='checkbox' name='collapse_toggle'
               checked={sidebar.collapse} onChange={() => {}}/>
        <label className='toggle-btn__input-label' htmlFor='collapse_toggle'
               onClick={changeSidebarVisibility}>Toggle</label>
        <span>Collapsed Menu</span>
      </label>
    )
  }
}

export default ToggleCollapsedMenu;