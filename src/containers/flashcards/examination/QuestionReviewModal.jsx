import React, { Component } from "react";
import { ModalCustom } from "../../../components/common";
import Template1 from "./Template1";
import Template2 from "./Template2";
import Template3 from "./Template3";
import Template4 from "./Template4";
import Template5 from "./Template5";

export default class QuestionReviewModal extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const {
            modalIsOpen,
            toggle,
            data,
            lang,
            level,
            questionData,
            updateExaminationData,
        } = this.props;
        let renderReviewTemplate = null;
        if (questionData) {
            const { templateNumber } = questionData;
            switch (templateNumber) {
                case 1:
                    renderReviewTemplate = (
                        <Template1
                            data={data}
                            lang={lang}
                            level={level}
                            questionData={questionData}
                            updateExaminationData={updateExaminationData}
                            preview={true}
                        />
                    );
                    break;
                case 2:
                    renderReviewTemplate = (
                        <Template2
                            data={data}
                            lang={lang}
                            level={level}
                            questionData={questionData}
                            updateExaminationData={updateExaminationData}
                            preview={true}
                        />
                    );
                    break;
                case 3:
                    renderReviewTemplate = (
                        <Template3
                            data={data}
                            lang={lang}
                            level={level}
                            questionData={questionData}
                            updateExaminationData={updateExaminationData}
                            preview={true}
                        />
                    );
                    break;
                case 4:
                    renderReviewTemplate = (
                        <Template4
                            data={data}
                            lang={lang}
                            level={level}
                            questionData={questionData}
                            updateExaminationData={updateExaminationData}
                            preview={true}
                        />
                    );
                    break;
                case 5:
                    renderReviewTemplate = (
                        <Template5
                            data={data}
                            lang={lang}
                            level={level}
                            questionData={questionData}
                            updateExaminationData={updateExaminationData}
                            preview={true}
                        />
                    );
                    break;
                default:
                    break;
            }
        }

        return (
            <ModalCustom
                color="primary"
                title={`Question Review`}
                btn="Default"
                modalIsOpen={modalIsOpen}
                btnOkHanlder={toggle}
                toggleHeader={true}
                toggle={toggle}
                size="lg"
            >
                <div className="bg-white">{renderReviewTemplate}</div>
            </ModalCustom>
        );
    }
}
