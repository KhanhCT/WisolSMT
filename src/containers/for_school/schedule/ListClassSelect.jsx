import React, { Component } from "react";
import { Input } from "reactstrap";

export default class ListClassSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleChangeClass = e => {
        const { setSelectedClass } = this.props;
        let classIndex = e.target.value;
        setSelectedClass(classIndex);
    };

    render() {
        const { selectedClass, name, listClass } = this.props;
        let defautlClassIndex = null;
        let renderListClass = null;
        if (listClass.length > 0) {
            renderListClass = listClass.map((classes, index) => {
                if (selectedClass)
                    if (selectedClass.id == classes.id)
                        defautlClassIndex = index;
                return (
                    <option key={index} value={index}>
                        {classes.name}
                    </option>
                );
            });
        }
        return (
            <Input
                type="select"
                name={name}
                value={defautlClassIndex}
                onChange={this.handleChangeClass}
            >
                <option value="">-Chọn lớp học-</option>
                {renderListClass}
            </Input>
        );
    }
}
