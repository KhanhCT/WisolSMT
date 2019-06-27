import React, { PureComponent } from "react";
import { Timeline, TimelineEvent } from "react-event-timeline";
import { translate } from "react-i18next";
import Footer from "./Footer";
import Header from "./Header";

class Updates extends PureComponent {
    responsive = {
        0: { items: 4 },
        600: { items: 5 },
        1024: { items: 6 },
    };
    render() {
        const { t } = this.props;
        return (
            <div>
                <Header />
                <div className="container-cust">
                    <h1
                        className="mb-3 mt-4 text-center"
                        style={{ fontWeight: "500" }}
                    >
                        {t("common.update")}
                    </h1>
                    <Timeline>
                        <TimelineEvent
                            title="Cập nhật phiên bản đầu tiên"
                            createdAt="01/10/2018 - v1.0"
                            icon={<i className="fal fa-cloud-upload" />}
                            bubbleStyle={{
                                border: "1px solid #70bbfd",
                                backgroundColor: "#fff",
                                color: "#70bbfd",
                            }}
                            contentStyle={{
                                border: "0px",
                                boxShadow: "none",
                                backgroundColor: "#f7f7f7",
                                borderRadius: "5px",
                                fontSize: "14px",
                                display: "table-cell",
                            }}
                            titleStyle={{
                                fontSize: "16px",
                                marginBottom: "15px",
                            }}
                        >
                            <p>- Ngôn ngữ hệ thống: Tiếng Anh, Tiếng Việt.</p>
                            <p>
                                - 5 Ngôn ngữ học tập: Tiếng Anh, Tiếng Việt,
                                Tiếng Hàn, Tiếng Nhật, Tiếng Trung.
                            </p>
                            <p>
                                - Flashcard gồm 36 chủ đề với nhiều hình ảnh và
                                âm thanh (Âm thanh do người bản địa ghi tại
                                Studio gồm cả nam và nữ).
                            </p>
                            <p>
                                - Theo dõi Attendance Record đối với học viên
                                học tại cơ sở đối tác.
                            </p>
                        </TimelineEvent>
                    </Timeline>
                </div>

                <Footer />
            </div>
        );
    }
}

const tUpdates = translate(["common", "landing_page"])(Updates);
export { tUpdates as Updates };
