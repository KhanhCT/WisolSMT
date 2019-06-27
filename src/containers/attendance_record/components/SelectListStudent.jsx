import React, { Component } from "react";
import classNames from "classnames";
import { FormGroup, Label, Input } from "reactstrap";
import { callApi, userHelper } from "../../../helpers";
import { translate } from "react-i18next";
import { apiConfigs } from "../../../constants";

const AvaMale = process.env.PUBLIC_URL + "/img/avatar-male.svg";
const AvaFemale = process.env.PUBLIC_URL + "/img/avatar-female.svg";

class SelectListStudent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lstStudent: [],
            indexCheckActive: 0,
        };
    }

    componentDidMount = () => {
        this.getLstStudentByTeacher();
    };

    getLstStudentByTeacher = () => {
        // Get teacher id from storage
        let teacher = userHelper.getUserFromStorage();
        const { setCurrStudent } = this.props;
        if (teacher) {
            callApi("teacher_students/get-list-student-by-teacher-id", "GET", {
                teacher_id: teacher.user_id,
                active_teacher: 1,
            })
                .then(res => {
                    if (res.data.data.rows[0].Student.length > 0) {
                        this.setState({
                            lstStudent: res.data.data.rows[0].Student,
                        });
                        setCurrStudent(res.data.data.rows[0].Student[0]);
                    }
                })
                .catch(error => {
                    this.setState({ error: error });
                });
        }
    };

    handleChangeStudent = index => {
        const { setCurrStudent } = this.props;
        this.setState({ indexCheckActive: index });
        setCurrStudent(this.state.lstStudent[index]);
    };

    render() {
        const { lstStudent, indexCheckActive } = this.state;
        const { t } = this.props;
        let renderLstStudent = null;
        let avatar = null;

        renderLstStudent = lstStudent.map((item, index) => {
            if (!item.avatar && item.gender == 1) {
                avatar = AvaMale;
            } else if (!item.avatar && item.gender == 0) {
                avatar = AvaFemale;
            } else if (!item.avatar && !item.gender) {
                avatar = AvaMale;
            } else {
                avatar = `${apiConfigs.BASE_IMAGE_URL}${item.avatar}`;
            }
            return (
                <li key={index} value={index}>
                    <a
                        href="javascrit:;"
                        className={classNames({
                            active: indexCheckActive === index,
                        })}
                        onClick={() => {
                            this.handleChangeStudent(index);
                        }}
                    >
                        <img src={avatar} style={{ width: "80%" }} />
                        <span>{item.fullname}</span>
                    </a>
                </li>
            );
        });

        return (
            <FormGroup>
                {/* <Label for="choose-student">
                    {t("attendance_record.select_student")}
                </Label> */}
                <ul className="overflowNav">{renderLstStudent}</ul>
            </FormGroup>
        );
    }
}

export default translate("common")(SelectListStudent);
