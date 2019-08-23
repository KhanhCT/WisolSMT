import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

class ToggleShadow extends PureComponent {

  static propTypes = {
    customizer: PropTypes.object.isRequired,
    toggleBoxShadow: PropTypes.func,
  };

  render() {
    let {toggleBoxShadow, customizer} = this.props;

    return (
      <label className='toggle-btn customizer__toggle'>
        <input className='toggle-btn__input' type='checkbox' name='shadow_toggle'
               checked={customizer.withBoxShadow} onChange={() => {}}/>
        <label className='toggle-btn__input-label' htmlFor='shadow_toggle'
               onClick={toggleBoxShadow}>Toggle</label>
        <span>Block's Shadows</span>
      </label>
    )
  }
}

export default ToggleShadow;