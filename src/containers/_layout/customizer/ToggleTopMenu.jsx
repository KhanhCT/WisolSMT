import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

class ToggleTopMenu extends PureComponent {

  static propTypes = {
    customizer: PropTypes.object.isRequired,
    toggleTopNavigation: PropTypes.func,
  };

  render() {
    let {toggleTopNavigation, customizer} = this.props;

    return (
      <label className='toggle-btn customizer__toggle'>
        <input className='toggle-btn__input' type='checkbox' name='top_menu_toggle'
               checked={customizer.topNavigation} onChange={() => {}}/>
        <label className='toggle-btn__input-label' htmlFor='top_menu_toggle'
               onClick={toggleTopNavigation}>Toggle</label>
        <span>Top Menu</span>
      </label>
    )
  }
}

export default ToggleTopMenu;