import React, { Component } from "react";
import { Input } from "reactstrap";
import { callApi } from "../../../helpers";

export default class ListStudyMethodSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listStudyMethod: [],
        };
    }
    componentDidMount = () => {
        this.getListStudyMethod();
    };

    getListStudyMethod = () => {
        const { location } = this.props;

        // Call API get List Course
        callApi("for_school/study_methods", "GET", {
            limit: 1000,
            department_id: location.state.idDepartment,
        })
            .then(res => {
                this.setState({
                    listStudyMethod: res.data.data.rows,
                });
            })
            .catch(error => {
                console.log(error);
            });
    };

    handleChangeStudyMethod = e => {
        const { setSelectedStudyMethod } = this.props;
        let studyMethodIndex = e.target.value;
        let selectedStudyMethod = this.state.listStudyMethod[studyMethodIndex];
        setSelectedStudyMethod(selectedStudyMethod);
    };

    render() {
        const { listStudyMethod } = this.state;
        const { selectedStudyMethod, name } = this.props;
        let defautlStudyMethodIndex = null;
        let renderListStudyMethod = null;
        if (listStudyMethod.length > 0) {
            renderListStudyMethod = listStudyMethod.map(
                (studyMethod, index) => {
                    if (selectedStudyMethod)
                        if (selectedStudyMethod.id == studyMethod.id)
                            defautlStudyMethodIndex = index;
                    return (
                        <option key={index} value={index}>
                            {studyMethod.name}
                        </option>
                    );
                }
            );
        }
        return (
            <Input
                type="select"
                name={name}
                value={defautlStudyMethodIndex}
                onChange={this.handleChangeStudyMethod}
            >
                <option value="">-Chọn-</option>
                {renderListStudyMethod}
            </Input>
        );
    }
}
