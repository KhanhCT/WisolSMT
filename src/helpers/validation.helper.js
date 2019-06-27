import $ from "jquery";
import "jquery-validation";
import { userHelper } from "./users.helper";

export const validationHelper = {
  validateForm,
  getFormData,
};

function validateForm(idForm) {
  $.validator.addMethod(
    "noSpace",
    function(value, element) {
      return value.indexOf(" ") < 0 && value !== "";
    },
    "No space please and don't leave it empty"
  );

  $.validator.addMethod(
    "phoneNumber",
    function(value, element) {
      return this.optional(element) || /^([0])(\d{9,10})$/.test(value);
    },
    "Please enter a valid phone number"
  );

  $(`#${idForm}`).validate({
    rules: {
      fullname: {
        required: true,
      },
      phone: {
        required: true,
        phoneNumber: true,
      },
      address: {
        required: true,
      },
      email: {
        required: true,
        email: true,
      },
      username: {
        noSpace: true,
        required: true,
      },
      password: {
        required: true,
      },
      password_confirm: {
        equalTo: "#signup-password",
        required: true,
        minlength: 6,
      },
      name: {
        required: true,
      },
      code: {
        required: true,
      },
      user_cod: {
        required: true,
        minlength: 10,
        maxlength: 10,
      },
      numberCard: {
        required: true,
        number: true,
        min: 1,
        max: 100,
      },
      total_time: {
        required: true,
      },
      number_session: {
        required: true,
      },
      number_student: {
        required: true,
      },
      start_date: {
        required: true,
      },
      end_date: {
        required: true,
      },
      capacity: {
        required: true,
      },
      course: {
        required: true,
      },
      study_method: {
        required: true,
      },
      class: {
        required: true,
      },
      room: {
        required: true,
      },
      weekday: {
        required: true,
      },
      start_time: {
        required: true,
      },
      end_time: {
        required: true,
      },
      amount_vnd: {
        required: true,
      },
      amount_usd: {
        required: true,
      },
      hours_payment: {
        required: true,
        number: true,
        min: 1,
        max: 100,
      },
      comment: {
        required: true,
      },
      select_contract: {
        required: true,
      },
    },
  });
}

function getFormData(idForm) {
  let formData = null;
  if ($(`#${idForm}`).valid()) {
    let formArrayData = $(`#${idForm}`).serializeArray();
    formData = {};
    for (const item of formArrayData) {
      formData[item["name"]] = item["value"];
      // if (item["name"] === "password")
      //   formData["password"] = userHelper.hasPasswordSHA(item["value"]);
    }
    // Delete confirm password
    delete formData["password_confirm"];
  }
  return formData;
}
