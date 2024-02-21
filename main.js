function Validator(formSelector) {
  // console.log(formSelector);
  var formRules = {};
  var _this = this;
  /** TODO:
   * Quy ước tạo rules:
   * - Có lỗi: return `error message`
   * - Không lỗi: return `undefined`
   * `value`: chuỗi người dùng nhập vào
   */
  var validatorRules = {
    required: function (value) {
      return value ? undefined : "Vui lòng nhập trường này";
    },
    email: function (value) {
      var regrex =
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b/;
      return regrex.test(value)
        ? undefined
        : "Vui lòng nhập chính xác email của bạn";
    },
    min: function (min) {
      return function (value) {
        return value.length >= min
          ? undefined
          : `Vui lòng nhập tối thiểu ${min} kí tự`;
      };
    },
    confirm: function (value) {
      return value === document.querySelector("#register-form #password").value
        ? undefined
        : "Mật khẩu nhập lại không chính xác!";
    },
  };
  var formElement = document.querySelector(formSelector);
  // console.log(formElement);

  if (formElement) {
    var inputs = formElement.querySelectorAll("input[name][rules]");
    // console.log(inputs);

    for (var input of inputs) {
      // console.log(input.getAttribute("rules"));
      var rules = input.getAttribute("rules").split("|");

      for (var rule of rules) {
        var isRuleHasValue = rule.includes(":");
        var ruleInfo;

        if (isRuleHasValue) {
          ruleInfo = rule.split(":");
          // console.log(ruleInfo);
          rule = ruleInfo[0];
          // console.log(validatorRules[rule](ruleInfo[1]));
        }
        // console.log(rule);

        var ruleFunc = validatorRules[rule];
        // console.log(ruleFunc);
        if (isRuleHasValue) {
          ruleFunc = ruleFunc(ruleInfo[1]);
        }
        // console.log(ruleFunc);
        if (Array.isArray(formRules[input.name])) {
          formRules[input.name].push(ruleFunc);
        } else {
          formRules[input.name] = [ruleFunc];
        }
        // console.log(validatorRules);
      }
      // formRules[input.name] = input.getAttribute("rules");

      /** Lắng nghe sự kiện */
      input.onblur = handleValidate;
      input.oninput = handleInput;
    }

    /** Xử lý sự kiện */

    function handleValidate(event) {
      // console.log(event.target);
      // console.log(formRules[event.target.name]);
      var rules = formRules[event.target.name];
      // console.log(rules);
      var errorMessage;

      // TODO: C1
      // rules.some(function (rule) {
      //   errorMessage = rule(event.target.value);
      //   console.log(errorMessage);
      //   return errorMessage;
      // });

      // TODO: C2
      for (rule of rules) {
        errorMessage = rule(event.target.value);
        // console.log(errorMessage);
        if (errorMessage) break;
      }

      if (errorMessage) {
        var formGroup = event.target.closest(".auth-form__group");
        // console.log(formGroup);
        if (formGroup) {
          formGroup.classList.add("invalid");
          var formMessage = formGroup.querySelector(".auth-form__message");
          if (formMessage) {
            formMessage.innerText = errorMessage;
          }
        }
      }
      return !errorMessage;
    }

    function handleInput(event) {
      var formGroup = event.target.closest(".auth-form__group");
      if (formGroup.classList.contains("invalid")) {
        formGroup.classList.remove("invalid");
        var formMessage = formGroup.querySelector(".auth-form__message");
        if (formMessage) {
          formMessage.innerText = "";
        }
      }
    }
  }
  // console.log(formRules);

  // Xử lí hành vi submit form
  formElement.onsubmit = function (event) {
    event.preventDefault();

    // console.log(_this);

    var inputs = formElement.querySelectorAll("input[name][rules]");
    var isValid = false;
    for (var input of inputs) {
      // console.log(input);
      if (handleValidate({ target: input })) {
        isValid = true;
      }
    }
    // console.log(isValid);
    if (isValid) {
      if (typeof _this.onSubmit === "function") {
        var enableInputs = formElement.querySelectorAll("input[name]");
        // console.log(enableInputs);
        var formValues = Array.from(enableInputs).reduce(function (
          values,
          input
        ) {
          switch (input.type) {
            case "radio":
              if (input.matches(":checked")) {
                values[input.name] = input.value; // input.value là giá trị ng dùng nhập vào còn values[input.name] là biến được gán của hàm
              }
              break;
            case "checkbox":
              if (!input.matches(":checked")) {
                values[input.name] = "";
                return values;
              }
              if (!Array.isArray(values[input.name])) {
                values[input.name] = [];
              }
              values[input.name].push(input.value);
              break;
            case "file":
              values[input.name] = input.files;
              break;
            default:
              values[input.name] = input.value; //Lấy giá trị thẻ input [input.value] gán vào values (biến được đặt trên hàm reduce) rồi cuối cùng onSubmit ra object ở dưới
            // console.log(values[input.name]);
          }
          return values;
        },
        {});

        _this.onSubmit(formValues);
      } else {
        formElement.submit();
      }
    }
  };
}

var formSignup = new Validator("#register-form");
formSignup.onSubmit = function (formData) {
  console.log(formData);
};

var formLogIn = new Validator("#login-form");
formLogIn.onSubmit = function (formData) {
  console.log(formData);
};

//
var signUpBtns = document.querySelectorAll(".btn__control-form-signup");
var logInBtns = document.querySelectorAll(".btn__control-form-login");
var closeBtns = document.querySelectorAll(".btn__close-form");

var modalSignUp = document.querySelector(".modal-signup__form");
var modalLogIn = document.querySelector(".modal-login__form");
var modalOverlays = document.querySelectorAll(".modal__overlay");

function showModalSignUp() {
  modalSignUp.classList.add("open");
}

function showModalLogIn() {
  modalLogIn.classList.add("open");
}

function hideModalLogIn() {
  modalLogIn.classList.remove("open");
}

function hideModalSignUp() {
  modalSignUp.classList.remove("open");
}

for (var signUpBtn of signUpBtns) {
  signUpBtn.addEventListener("click", showModalSignUp);
  signUpBtn.addEventListener("click", hideModalLogIn);
}

for (var logInBtn of logInBtns) {
  logInBtn.addEventListener("click", showModalLogIn);
  logInBtn.addEventListener("click", hideModalSignUp);
}

for (var closeBtn of closeBtns) {
  closeBtn.addEventListener("click", hideModalSignUp);
  closeBtn.addEventListener("click", hideModalLogIn);
}

for (var modalOverlay of modalOverlays) {
  modalOverlay.addEventListener("click", hideModalLogIn);
  modalOverlay.addEventListener("click", hideModalSignUp);
}

const hoverCart = document.querySelector(".header__cart-icon-wrap");
const cartList = document.querySelector(".header__cart-list");
hoverCart.addEventListener("click", function () {
  if (window.innerWidth <= 1023) {
    if (cartList.style.display === "block") {
      cartList.style.display = "none";
    } else {
      cartList.style.display = "block";
    }
  }
});

//
const heartBtns = document.querySelectorAll("#like-item");
heartBtns.forEach(function (heartBtn) {
  if (heartBtn.classList.contains("product-item__like")) {
    heartBtn.addEventListener("click", function () {
      heartBtn.classList.toggle("product-item__like--active");
    });
  }
});

//
const productRatings = document.querySelectorAll(".product-item__rating");
for (productRating of productRatings) {
  const starBtns = productRating.querySelectorAll("#star-item");
  starBtns.forEach((starBtn, index1) => {
    starBtn.addEventListener("click", () => {
      starBtns.forEach((starBtn, index2) => {
        index1 >= index2
          ? starBtn.classList.add("product-item__rating-gold-star")
          : starBtn.classList.remove("product-item__rating-gold-star");
      });
    });
  });
}
// starBtns.forEach(function (starBtn) {
//   if (starBtn.classList.contains("product-item__rating-point")) {
//     starBtn.addEventListener("click", function () {
//       starBtn.classList.toggle("product-item__rating-gold-star");
//     });
//   }
// });

//
const sideCategories = document.querySelectorAll(".category-item");
// console.log(sideCategories);
sideCategories.forEach((sideCategory) => {
  sideCategory.addEventListener("click", () => {
    document
      .querySelector(".category-item--active")
      ?.classList.remove("category-item--active");
    sideCategory.classList.add("category-item--active");
  });
});
