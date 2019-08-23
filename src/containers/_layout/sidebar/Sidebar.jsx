import React, { Component } from "react";
import Scrollbar from "react-smooth-scrollbar";
import classNames from "classnames";
import PropTypes from "prop-types";
import SidebarContent from "./SidebarContent";

class Sidebar extends Component {
    static propTypes = {
        sidebar: PropTypes.object.isRequired,
        changeToDark: PropTypes.func,
        changeToLight: PropTypes.func,
        changeMobileSidebarVisibility: PropTypes.func,
    };

    render() {
        let sidebarClass = classNames({
            sidebar: true,
            "sidebar--show": this.props.sidebar.show,
            "sidebar--collapse": this.props.sidebar.collapse,
        });

        let {
            changeToDark,
            changeToLight,
            changeMobileSidebarVisibility,
        } = this.props;

        return (
            <div className={sidebarClass}>
                <div
                    className="sidebar__back"
                    onClick={changeMobileSidebarVisibility}
                />
                <Scrollbar className="sidebar__scroll scroll">
                    <div className="sidebar__wrapper sidebar__wrapper--desktop">
                        <SidebarContent
                            onClick={() => {}}
                            changeToDark={changeToDark}
                            changeToLight={changeToLight}
                        />
                    </div>
                    <div className="sidebar__wrapper sidebar__wrapper--mobile">
                        <SidebarContent
                            onClick={changeMobileSidebarVisibility}
                            changeToDark={changeToDark}
                            changeToLight={changeToLight}
                        />
                    </div>
                </Scrollbar>
            </div>
        );
    }
}

export default Sidebar;
