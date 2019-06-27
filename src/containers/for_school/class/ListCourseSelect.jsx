import React, { Component } from "react";
import { Input } from "reactstrap";
import { callApi } from "../../../helpers";

export default class ListCourseSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listCourse: [],
        };
    }
    componentDidMount = () => {
        this.getListCourse();
    };

    getListCourse = () => {
        const { location } = this.props;

        // Call API get List Course
        callApi("for_school/courses", "GET", {
            limit: 1000,
            department_id: location.state.idDepartment,
        })
            .then(res => {
                this.setState({
                    listCourse: res.data.data.rows,
                });
            })
            .catch(error => {
                console.log(error);
            });
    };

    handleChangeCourse = e => {
        const { setSelectedCourse } = this.props;
        let courseIndex = e.target.value;
        let selectedCourse = this.state.listCourse[courseIndex];
        setSelectedCourse(selectedCourse);
    };

    render() {
        const { listCourse } = this.state;
        const { selectedCourse, name } = this.props;
        let defautlCourseIndex = null;
        let renderListCourse = null;
        if (listCourse.length > 0) {
            renderListCourse = listCourse.map((course, index) => {
                if (selectedCourse)
                    if (selectedCourse.id == course.id)
                        defautlCourseIndex = index;
                return (
                    <option key={index} value={index}>
                        {course.name}
                    </option>
                );
            });
        }
        return (
            <Input
                type="select"
                name={name}
                value={defautlCourseIndex}
                onChange={this.handleChangeCourse}
            >
                <option value="">-Chọn-</option>
                {renderListCourse}
            </Input>
        );
    }
}
