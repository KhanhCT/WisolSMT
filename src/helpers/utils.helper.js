import moment from "moment";
import axios from "axios";
import { apiConfigs } from "../constants";

const AvaMale = process.env.PUBLIC_URL + "/img/avatar-male.svg";
const AvaFemale = process.env.PUBLIC_URL + "/img/avatar-female.svg";

export const utilHelper = {
    addPadStartToBill,
    addPadStartToContract,
    resizeImage,
    b64toBlob,
    convertVietnamese,
    formatSecondToTime,
    youTubeGetID,
    numberWithCommasVND,
    isEmptyDate,
    isEmptyDateFormat,
    isEmpty,
    getRightIds,
    getAvatarUser,
    timeConvert,
    convertStringToJSON,
    downloadFileFromUrl,
};

function addPadStartToBill(billIdStr) {
    return billIdStr.padStart(8, "0");
}

function addPadStartToContract(contractIdStr) {
    return contractIdStr.padStart(8, "0");
}

function resizeImage(file, inputId, cb) {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        var filesToUploads = document.getElementById("avatar").files;
        var file = filesToUploads[0];
        if (file) {
            var reader = new FileReader();
            // Set the image once loaded into file reader
            reader.onload = function(e) {
                var img = document.createElement("img");
                var downloadingImage = new Image();
                downloadingImage.src = e.target.result;
                downloadingImage.onload = function() {
                    img.src = this.src;
                    var canvas = document.createElement("canvas");
                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0);

                    var MAX_WIDTH = 400;
                    var MAX_HEIGHT = 400;
                    var width = this.width;
                    var height = this.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }
                    canvas.width = width;
                    canvas.height = height;
                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, width, height);
                    let dataurl = canvas.toDataURL(file.type);
                    document.getElementById(inputId).src = dataurl;
                    cb();
                };
            };
            reader.readAsDataURL(file);
        }
    } else {
        alert("The File APIs are not fully supported in this browser.");
    }
}

function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || "";
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
}

function convertVietnamese(str) {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(
        /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\&|\#|\[|\]|~|$|_/g,
        "_"
    );
    str = str.replace(/-+-/g, "-");
    str = str.replace(/^\-+|\-+$/g, "");

    return str;
}

/**
 * Get YouTube ID from various YouTube URL
 * @author: takien
 * @url: http://takien.com
 * For PHP YouTube parser, go here http://takien.com/864
 */

function youTubeGetID(url) {
    var ID = "";
    url = url
        .replace(/(>|<)/gi, "")
        .split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    if (url[2] !== undefined) {
        ID = url[2].split(/[^0-9a-z_\-]/i);
        ID = ID[0];
    } else {
        ID = url;
    }
    return ID;
}

function formatSecondToTime(seconds) {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = pad(date.getUTCSeconds());
    if (hh) {
        return `${hh}:${pad(mm)}:${ss}`;
    }
    return `${mm}:${ss}`;
}

function pad(string) {
    return ("00" + string).slice(-2);
}

function numberWithCommasVND(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function isEmptyDate(val) {
    return val === undefined || val == null ? null : moment(val);
}

function isEmptyDateFormat(val) {
    return val === undefined || val == null
        ? null
        : moment(val).format("YYYY-MM-DD");
}

function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) return false;
    }
    return true;
}

function getRightIds(nodes) {
    let ids = [];
    if (nodes) {
        nodes.forEach(({ value, children }) => {
            ids = [...ids, value, ...getRightIds(children)];
        });
    }

    return ids;
}

function getAvatarUser(avatar, gender) {
    let avatarTmp = null;
    if (!avatar && gender == 1) {
        avatarTmp = AvaMale;
    } else if (!avatar && gender == 0) {
        avatarTmp = AvaFemale;
    } else if (!avatar && !gender) {
        avatarTmp = AvaMale;
    } else {
        avatarTmp = `${apiConfigs.BASE_IMAGE_URL}${avatar}`;
    }

    return avatarTmp;
}

function timeConvert(minute) {
    let num = minute;
    let hours = num / 60;
    let rhours = Math.floor(hours);
    let minutes = (hours - rhours) * 60;
    let rminutes = Math.round(minutes);
    let renderTime = null;
    if (rhours > 0) {
        renderTime = rhours + " giờ " + rminutes + " phút";
    } else {
        renderTime = rminutes + " phút";
    }
    return renderTime;
}

function convertStringToJSON(val) {
    return typeof val === "string" ? JSON.parse(val) : val;
}

function downloadFileFromUrl(url, contractName) {
    axios({
        url: url,
        method: "GET",
        responseType: "blob", // important
    }).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", contractName);
        document.body.appendChild(link);
        link.click();
    });
}
