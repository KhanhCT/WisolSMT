import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

class ToggleSquared extends PureComponent {
  static propTypes = {
    customizer: PropTypes.object.isRequired,
    changeBorderRadius: PropTypes.func,
  };
  
  render() {
    let {changeBorderRadius, customizer} = this.props;

    return (
      <label className='toggle-btn customizer__toggle'>
        <input className='toggle-btn__input' type='checkbox' name='square_toggle'
               checked={customizer.squaredCorners} onChange={() => {}}/>
        <label className='toggle-btn__input-label' htmlFor='square_toggle'
               onClick={changeBorderRadius}>Toggle</label>
        <span>Squared borders</span>
      </label>
    )
  }
}

export default ToggleSquared;