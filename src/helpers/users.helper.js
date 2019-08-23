import io from "socket.io-client";
import { apiConfigs } from "../constants";
import common_en from "../translations/en/common.json";
import common_vi from "../translations/vi/common.json";
import { toast } from "react-toastify";
import { HmacSHA512 } from "crypto-js";

var jwtDecode = require("jwt-decode");

const messages = {
    en: common_en,
    vi: common_vi,
};

const correctSound = new Audio("/audio/correct_sound.mp3");
const inCorrectSound = new Audio("/audio/failed_sound.mp3");

export const userHelper = {
    getUserFromStorage,
    connectSocket,
    getUserLanguage,
    setUserLanguage,
    storeUserToken,
    showToastMessage,
    showErrorMessage,
    hasPasswordSHA,
    validateExpireToken,
    checkMemberType,
    playSound,
    concatUrl,
};

export const notificationSound = new Audio("/audios/notification.mp3");

function connectSocket() {
    let user = JSON.parse(localStorage.getItem("user")),
        query = "",
        socket = null;
    if (user && user.token) {
        query = "token=" + user.token;

        socket = io(apiConfigs.SOCKET_URL, {
            query: query,
        });
    }
    return socket;
}

function getUserFromStorage() {
    try {
        let user = JSON.parse(localStorage.getItem("user"));
        if (user && user.token) {
            let decoded = jwtDecode(user.token);
            if (decoded.exp * 1000 < Date.now()) {
                return null;
            }
            user = decoded;
        } else return null;
        return user;
    } catch (error) {
        return null;
    }
}

function getUserLanguage() {
    let userLanguage = null;
    try {
        let webName = "hanaspeak.com",
            userLanguageKey = `language_${webName}`;
        userLanguage = localStorage.getItem(userLanguageKey);
        if (!userLanguage) return navigator.language.split(/[-_]/)[0];
        return userLanguage;
    } catch (error) {
        return null;
    }
}

function setUserLanguage(language) {
    let webName = "hanaspeak.com",
        userLanguageKey = `language_${webName}`;
    localStorage.setItem(userLanguageKey, language);
}

function storeUserToken(data) {
    localStorage.setItem("user", JSON.stringify(data));
}

function showToastMessage(messageKey, status = "success") {
    // Get current language from localStorage
    let currLanguage = getUserLanguage();
    // Get Browser default language
    if (!currLanguage || currLanguage == undefined)
        currLanguage = navigator.language.split(/[-_]/)[0];
    currLanguage = currLanguage ? currLanguage : "en";
    switch (status) {
        case "success":
            toast.success(messages[currLanguage]["MESSAGES"][messageKey], {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 5000,
            });
            break;
        case "error":
            toast.error(messages[currLanguage]["MESSAGES"][messageKey], {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
            });
            break;
        default:
            break;
    }
}

function showErrorMessage(message) {
    toast.error(message, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000,
    });
}

function hasPasswordSHA(password) {
    let hashPw = HmacSHA512(password, apiConfigs.PASSWORD_ENCODE_SECRET);
    return hashPw.toString();
}

function validateExpireToken(token) {
    try {
        if (token) {
            let decoded = jwtDecode(token);
            if (decoded.exp * 1000 < Date.now()) {
                return false;
            }
        } else return false;
        return true;
    } catch (error) {
        return false;
    }
}

function checkMemberType() {
    try {
        let user = JSON.parse(localStorage.getItem("user"));
        if (user && user.token) {
            let decoded = jwtDecode(user.token);
            return decoded["member_vip"];
        } else return null;
    } catch (error) {
        return null;
    }
}

function playSound(type) {
    switch (type) {
        case "correct":
            correctSound.play();
            break;
        case "incorrect":
            inCorrectSound.play();
            break;
        default:
            break;
    }
}

function concatUrl(directory) {
    return `${apiConfigs.CMS_BASE_URL}/${directory}`;
}
