import React, { PureComponent } from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import Collapsible from "react-collapsible";
import { translate } from "react-i18next";
import Footer from "./Footer";
import Header from "./Header";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../constants";

class Price extends PureComponent {
    responsive = {
        0: { items: 4 },
        600: { items: 5 },
        1024: { items: 6 },
    };
    render() {
        const handleOnDragStart = e => e.preventDefault();
        const { t } = this.props;
        return (
            <div>
                <Header />
                <div className="bg-white">
                    <div className="container">
                        <h1
                            className="mb-3 mt-4 text-center"
                            style={{ fontWeight: "500" }}
                        >
                            {t("common.membership")}
                        </h1>
                        <div className="pricing-table">
                            <div className="pricing-plan">
                                <h2 className="pricing-header position-relative sm-fontSize14">
                                    <span
                                        style={{
                                            background: "aquamarine",
                                            padding: "5px 8px",
                                            borderRadius: "5px",
                                        }}
                                    >
                                        Free
                                    </span>
                                </h2>
                                <ul className="pricing-features">
                                    <li className="pricing-features-item">
                                        + 5 ngôn ngữ
                                    </li>
                                    <li className="pricing-features-item">
                                        Flashcards (limited)
                                    </li>
                                    <li className="pricing-features-item">
                                        Học qua video (limited)
                                    </li>
                                    <li className="pricing-features-item">
                                        Trọn đời
                                    </li>
                                </ul>
                                <span className="pricing-price text-danger">
                                    Free
                                </span>
                                <a
                                    href="#/"
                                    className="btn btn-outline-primary rounded mt-3"
                                >
                                    {t("common.register")}
                                </a>
                            </div>

                            <div className="pricing-plan">
                                <h2 className="pricing-header sm-fontSize14">
                                    <i
                                        className="fas fa-crown bg-silver text-white mr-2"
                                        style={{
                                            padding: "5px",
                                            borderRadius: "5px",
                                        }}
                                    />
                                    {t("common.silver")}
                                </h2>
                                <ul className="pricing-features">
                                    <li className="pricing-features-item">
                                        + 5 ngôn ngữ
                                    </li>
                                    <li className="pricing-features-item">
                                        Flashcards
                                    </li>
                                    <li className="pricing-features-item">
                                        Học qua video
                                    </li>
                                    <li className="pricing-features-item">
                                        Duy trì 1 năm
                                    </li>
                                </ul>
                                <div className="no_style">
                                    <span className="fontSize14 text-secondary">
                                        498,000 VNĐ
                                    </span>
                                    <span className="badge badge-pill badge-primary">
                                        -40%
                                    </span>
                                </div>
                                <span className="pricing-price">
                                    299,000 VNĐ
                                </span>
                                <a
                                    href="#/"
                                    className="btn btn-outline-primary rounded mt-3"
                                >
                                    {t("common.register")}
                                </a>
                            </div>

                            <div className="pricing-plan">
                                <h2 className="pricing-header sm-fontSize14">
                                    <i
                                        className="fas fa-crown bg-gold text-white mr-2"
                                        style={{
                                            padding: "5px",
                                            borderRadius: "5px",
                                        }}
                                    />
                                    {t("common.gold")}
                                </h2>
                                <ul className="pricing-features">
                                    <li className="pricing-features-item">
                                        + 5 ngôn ngữ
                                    </li>
                                    <li className="pricing-features-item">
                                        Flashcards
                                    </li>
                                    <li className="pricing-features-item">
                                        Luyện ghi nhớ Flashcards
                                    </li>
                                    <li className="pricing-features-item">
                                        Học qua video
                                    </li>
                                    <li className="pricing-features-item">
                                        Duy trì 1 năm
                                    </li>
                                </ul>
                                <div className="no_style">
                                    <span className="fontSize14 text-secondary">
                                        832,000 VNĐ
                                    </span>
                                    <span className="badge badge-pill badge-primary">
                                        -40%
                                    </span>
                                </div>
                                <span className="pricing-price">
                                    499,000 VNĐ
                                </span>
                                <a
                                    href="#/"
                                    className="btn btn-primary rounded mt-3"
                                >
                                    {t("common.register")}
                                </a>
                            </div>

                            <div className="pricing-plan">
                                <h2 className="pricing-header sm-fontSize14">
                                    <i
                                        className="fas fa-crown bg-platinum text-white mr-2"
                                        style={{
                                            padding: "5px",
                                            borderRadius: "5px",
                                        }}
                                    />
                                    {t("common.platinum")}
                                </h2>
                                <ul className="pricing-features">
                                    <li className="pricing-features-item">
                                        + 5 ngôn ngữ
                                    </li>
                                    <li className="pricing-features-item">
                                        Flashcards
                                    </li>
                                    <li className="pricing-features-item">
                                        Luyện ghi nhớ Flashcards
                                    </li>
                                    <li className="pricing-features-item">
                                        Học qua video
                                    </li>
                                    <li className="pricing-features-item">
                                        Duy trì 3 năm
                                    </li>
                                </ul>
                                <div className="no_style">
                                    <span className="fontSize14 text-secondary">
                                        1,498,000 VNĐ
                                    </span>
                                    <span className="badge badge-pill badge-primary">
                                        -40%
                                    </span>
                                </div>

                                <span className="pricing-price">
                                    899,000 VNĐ
                                </span>
                                <a
                                    href="#/"
                                    className="btn btn-outline-primary rounded mt-3"
                                >
                                    {t("common.register")}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white">
                    <div className="contaner mw-960 pt-5 pb-5 pl-0 pr-0">
                        <h3 className="mb-4 text-center">
                            Phát triển toàn diện cùng với{" "}
                            <img
                                style={{
                                    height: "24px",
                                    width: "auto",
                                }}
                                src="images/main-logo.svg"
                            />
                        </h3>
                        <div className="list-icon">
                            <ul>
                                <li>
                                    <img
                                        className="width100 xs-width50"
                                        src="images/listen_icon.svg"
                                    />
                                    <h3 className="text-secondary mt-3">
                                        Nghe
                                    </h3>
                                </li>
                                <li>
                                    <img
                                        className="width100 xs-width50"
                                        src="images/talk_icon.svg"
                                    />
                                    <h3 className="text-secondary mt-3">Nói</h3>
                                </li>
                                <li>
                                    <img
                                        className="width100 xs-width50"
                                        src="images/read_icon.svg"
                                    />
                                    <h3 className="text-secondary mt-3">Đọc</h3>
                                </li>
                                <li>
                                    <img
                                        className="width100 xs-width50"
                                        src="images/write_icon.svg"
                                    />
                                    <h3 className="text-secondary mt-3">
                                        Viết
                                    </h3>
                                </li>
                                <li>
                                    <img
                                        className="width100 xs-width50"
                                        src="images/network_icon.svg"
                                    />
                                    <h3 className="text-secondary mt-3">
                                        Kết nối
                                    </h3>
                                </li>
                                <li>
                                    <img
                                        className="width100 xs-width50"
                                        src="images/change_icon.svg"
                                    />
                                    <h3 className="text-secondary mt-3">
                                        Trao đổi
                                    </h3>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="bg-lightgrey">
                    <div className="contaner mw-960 pt-5 pb-5">
                        <h1 className="text-center">
                            {t("common.payment_methods")}
                        </h1>
                        <h4 className="text-center mb-4">
                            {t("price.form_pay")}
                        </h4>
                        <div className="list-type5">
                            <ul>
                                <li>
                                    <h3>Thu tiền tận nơi</h3>
                                    <p>
                                        Giao thẻ và thu tiền tận nơi bạn đăng
                                        ký, không mất phí vận chuyển.
                                        <br />
                                        Chỉ áp dụng tại Việt Nam.
                                    </p>
                                </li>
                                <li>
                                    <h3>
                                        Chuyển khoản qua tài khoản ngân hàng.
                                    </h3>
                                    <p>
                                        Bạn sẽ nhận được mã kích hoạt và HDSD
                                        qua email ngay sau khi chúng tôi nhận
                                        được khoản thanh toán của bạn.
                                    </p>
                                    <p>
                                        <b>
                                            Ngân hàng thương mại cổ phần Ngoại
                                            thương Việt Nam
                                        </b>
                                        <br />
                                        Chủ tài khoản:{" "}
                                        <b>
                                            Công ty cổ phần đào tạo Hanaspeak
                                        </b>{" "}
                                        <br />
                                        Số tài khoản: <b>0991000032755</b>{" "}
                                        <br />
                                        Chi nhánh ngân hàng: Vietcombank chi
                                        nhánh Tây Hồ
                                        <br />
                                        Vui lòng chuyển khoản theo cú pháp:
                                        &#91;DK&#93;&lsaquo;Họ và
                                        tên&rsaquo;&lsaquo;Số điện
                                        thoại&rsaquo;&lsaquo;Gói học cần
                                        mua&rsaquo;
                                    </p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="bg-white">
                    <div className="contaner mw-960 text-center pt-5 pb-5">
                        <h1 className="mb-4">5 ngôn ngữ trong 1 ứng dụng</h1>
                        <AliceCarousel
                            mouseDragEnabled
                            buttonsDisabled
                            dotsDisabled
                            responsive={this.responsive}
                        >
                            <img
                                src="images/lang-vi.png"
                                onDragStart={handleOnDragStart}
                                className="yours-custom-class"
                            />
                            <img
                                src="images/lang-en.png"
                                onDragStart={handleOnDragStart}
                                className="yours-custom-class"
                            />
                            <img
                                src="images/lang-kr.png"
                                onDragStart={handleOnDragStart}
                                className="yours-custom-class"
                            />
                            <img
                                src="images/lang-jp.png"
                                onDragStart={handleOnDragStart}
                                className="yours-custom-class"
                            />
                            <img
                                src="images/lang-cn.png"
                                onDragStart={handleOnDragStart}
                                className="yours-custom-class"
                            />
                        </AliceCarousel>
                    </div>
                </div>
                <div className="bg-lightgrey">
                    <div className="contaner mw-960 pt-5 pb-5">
                        <h1 className="text-center">
                            <i className="fas fa-question-circle text-warning" />
                        </h1>
                        <h3 className="text-center mb-4">
                            Các câu hỏi thường gặp về vấn đề thanh toán
                        </h3>
                        <Collapsible trigger="Sau khi đăng ký thành viên tôi sẽ nhận được gì?">
                            <p>
                                Sau khi việc thanh toán hoàn tất, chúng tôi sẽ
                                gửi bạn mã kích hoạt thành viên cùng với hướng
                                dẫn sử dụng mã. Mỗi mã kích hoạt này sẽ cho phép
                                bạn sử dụng trên 2 thiết bị.
                            </p>

                            <p>
                                Về chi tiết cách thức cài đặt Lingo trên thiết
                                bị của bạn, xin vui lòng xem hướng dẫn dưới đây:
                            </p>

                            <p>
                                <a href="#">
                                    <i className="fas fa-plus-circle text-primary" />{" "}
                                    Hướng dẫn tải và cài đặt chương trình với
                                    các máy chạy Android
                                </a>
                            </p>

                            <p>
                                <a href="#">
                                    <i className="fas fa-plus-circle text-primary" />{" "}
                                    Hướng dẫn tải và cài đặt chương trình với
                                    các máy chạy iOS
                                </a>
                            </p>

                            <p>
                                Nếu bạn gặp khó khăn trong việc cài đặt hay kích
                                hoạt sản phẩm xin vui lòng liên lạc với chúng
                                tôi để được trợ giúp.{" "}
                            </p>
                        </Collapsible>
                        <Collapsible trigger="Tôi có thể dùng chương trình trong bao lâu sau khi đăng ký?">
                            <p>
                                Thời gian sử dụng của chương trình là: tùy thuộc
                                gói thành viên bạn đã đăng ký với chương trình.
                            </p>
                        </Collapsible>
                        <Collapsible trigger="Mỗi mã kích hoạt cho phép bao nhiêu thiết bị sử dụng nội dung đăng ký?">
                            <p>
                                Mỗi mã kích hoạt cho phép sử dụng nội dung mua
                                trên 2 thiết bị khác nhau (máy tính bảng, điện
                                thoại…) và không nhất thiết phải cùng hệ điều
                                hành (có thể là iOS hoặc Android).
                            </p>
                        </Collapsible>
                        <Collapsible trigger="Nếu tôi đổi máy thì máy mới của tôi có thể sử dụng chương trình được không?">
                            <p>
                                Được. Nếu bạn đã kích hoạt đủ 2 máy và muốn sử
                                dụng chương trình trên máy mới, phiền bạn liên
                                lạc với chúng tôi để chúng tôi hổ trợ bạn chuyển
                                mã kích hoạt từ máy cũ sang máy mới.
                            </p>
                            <p>
                                Tương ứng với 02 máy ban đầu, bạn có thể đổi
                                sang thêm 02 máy khác. Tổng cộng được sử dụng
                                trên 04 thiết bị.
                            </p>
                        </Collapsible>
                        <Collapsible trigger="Có những hình thức thanh toán nào?">
                            <p>
                                Để tiến hành thanh toán, bạn chọn gói đăng ký
                                thành viên <a href="#bang-gia">ở trên</a> và
                                chọn một trong năm hình thức thanh toán sau:
                            </p>
                            <p>
                                <b>
                                    Chuyển phát thẻ thành viên và thu tiền tận
                                    nơi
                                </b>
                            </p>
                            <p>
                                Bạn điền thông tin cá nhân để đăng ký thẻ thành
                                viên, sẽ có tư vấn viên liên hệ và thiết lập đơn
                                hàng cho bạn. Thẻ thành viên sẽ được chuyển tới
                                tận địa chỉ của bạn trong giờ hành chính bằng
                                dịch vụ chuyển phát của bên giao nhận thứ 3. Bạn
                                thanh toán tiền mặt cho người giao hàng và nhận
                                thẻ (miễn phí phí giao nhận). Trên thẻ thành
                                viên có mã kích hoạt cho phép bạn dùng nội dung
                                đăng ký trên 2 thiết bị.
                            </p>
                            <p>
                                <b>Chuyển khoản qua tài khoản ngân hàng</b>
                            </p>
                            <p>
                                Bạn điền số điện thoại, email (nếu được) và gói
                                thành viên vào nội dung chuyển khoản. Khi nhận
                                được thông báo xác thực việc chuyển khoản thành
                                công, phía công ty sẽ ngay lập tức gửi mã kích
                                hoạt (kèm theo hướng dẫn kích hoạt) vào email
                                của bạn. Mỗi mã kích hoạt cho phép bạn dùng nội
                                dung đăng ký trên 2 thiết bị.
                            </p>
                            <div className="border p-3 rounded mt-2">
                                <p>Thông tin chuyển khoản:</p>
                                <p>
                                    <b>
                                        Ngân hàng thương mại cổ phần Ngoại
                                        thương Việt Nam
                                    </b>
                                    <br />
                                    Chủ tài khoản:{" "}
                                    <b>{t("common.company_name")}</b> <br />
                                    Số tài khoản: <b>0991000032755</b> <br />
                                    Chi nhánh ngân hàng: Vietcombank chi nhánh
                                    Tây Hồ
                                    <br />
                                    Vui lòng chuyển khoản theo cú pháp:
                                    &#91;DK&#93;&lsaquo;Họ và
                                    tên&rsaquo;&lsaquo;Số điện
                                    thoại&rsaquo;&lsaquo;Gói học cần mua&rsaquo;
                                </p>
                            </div>
                        </Collapsible>
                        <Collapsible trigger="Tôi có đăng ký thành viên Lingo qua các kênh giao dịch nào?">
                            <p>
                                Bạn có thể đăng ký thành viên Lingo qua các kênh
                                giao dịch như sau:
                            </p>
                            <ol>
                                <li>
                                    <p>
                                        Đăng ký online qua website lingo.page
                                        hoặc qua ứng dụng{" "}
                                        <a href="https://lingo.page/">Lingo</a>.
                                        Sẽ có các chuyên viên tư vấn liên hệ với
                                        bạn để hỗ trợ bạn nhận thẻ thành viên
                                        ngay tại địa chỉ của mình
                                    </p>
                                </li>
                                <li>
                                    <p>
                                        Trực tiếp đến đăng ký tại VPGD{" "}
                                        {t("common.company_name")},{" "}
                                        {t("common.hana_add")}.
                                    </p>
                                </li>
                            </ol>
                        </Collapsible>
                    </div>
                </div>
                <div id="get-starter" className="bg-lightblue">
                    <div className="contaner mw-960 pt-5 pb-5">
                        <h1 className="text-center text-white mb-4 text-uppercase">
                            {t("landing_page:home.become_membership")}
                        </h1>
                        <center>
                            <div
                                className="hrMin"
                                style={{ borderColor: "#fff" }}
                            />
                        </center>
                        <h3 className="mb-4 text-center text-white">
                            {t("landing_page:home.create_free")}
                        </h3>
                        <center>
                            <Link
                                to={ROUTES.SIGNUP}
                                className="btn btn-warning rounded text-uppercase"
                            >
                                {t("common.sign_up")}
                            </Link>
                        </center>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

const tPrice = translate(["common", "landing_page"])(Price);
export { tPrice as Price };
