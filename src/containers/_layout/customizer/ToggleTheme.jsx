import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

class ToggleTheme extends PureComponent {
  static propTypes = {
    theme: PropTypes.object.isRequired,
    changeToDark: PropTypes.func,
    changeToLight: PropTypes.func,
  };

  render() {
    let {theme, changeToLight, changeToDark} = this.props;

    return (
      <label className='toggle-btn customizer__toggle'>
        <input className='toggle-btn__input' type='checkbox' name='theme_toggle'
               checked={theme.className === 'theme-dark'} onChange={() => {}}/>
        <label className='toggle-btn__input-label' htmlFor='theme_toggle'
               onClick={theme.className === 'theme-dark' ? changeToLight : changeToDark}>Toggle</label>
        <span>Dark Theme</span>
      </label>
    )
  }
}

export default ToggleTheme;