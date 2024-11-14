import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import {
    child,
    getDatabase,
    ref,
    set,
    onValue,
    get,
    push,
    remove,
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js";

// Cấu hình Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCSQHteBT5i3xRzh3uMup-_nxBt8MY0eRM",
    authDomain: "transport-logistics-837f3.firebaseapp.com",
    databaseURL: "https://transport-logistics-837f3-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "transport-logistics-837f3",
    storageBucket: "transport-logistics-837f3.appspot.com",
    messagingSenderId: "793510659799",
    appId: "1:793510659799:web:501bb6121f0dcee9fb9292",
};
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
//-----------------------------------------------------

function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

function createInitials(name) {
    return name
        .split(" ")
        .map((word) => word[0].toLowerCase())
        .join("");
}

function removeAccents(str) {
    str = str.replace(/đ/g, "d").replace(/Đ/g, "D");
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function isMatching(text, keyWord) {
    const result1 = text.match(new RegExp(keyWord, "i"));
    const result2 = removeAccents(text).match(new RegExp(keyWord, "i"));
    const result3 = createInitials(text).match(new RegExp(keyWord, "i"));
    const result4 = removeAccents(createInitials(text)).match(new RegExp(keyWord, "i"));

    if (!result1 && !result2 && !result3 && !result4) return false;
    return true;
}
let ROUTES_DATA = null;
let filterType = null;

function handleInputChange(event) {
    if (!ROUTES_DATA) return;
    document.querySelector(".loading").innerHTML = `<img width="100%" height="100%" src='./loading.gif' alt=''>`;
    setTimeout(() => {
        document.querySelector(".loading").innerHTML = '<i  class="fa-solid fa-x"></i>';
        document.querySelector(".fa-x").addEventListener("click", function () {
            const inputElement = document.getElementById("userInput");
            inputElement.value = "";
            inputElement.focus();
            filterType = null;
            showData();
            document.querySelector(".loading").innerHTML = ' <i class="fa-solid fa-magnifying-glass"></i>';
        });
    }, 1000);
    filterType = null;
    showData();
}
function searchFilter(value) {
    return ROUTES_DATA.filter((route) => {
        if (filterType == true && route.type == false) return false;
        if (filterType == false && route.type == true) return false;

        if (value.length == 0) {
            return true;
        }
        if (/^[0-9]+\s.{0,}/.test(value)) {
            // Trường hợp vừa số vừa chữ
            const _value = value.split(" ").slice(1).join(" ");
            const _number = value.split(" ")?.[0];
            if (!isMatching(route.streetName, _value)) return false;
            if (_number < route.firstNumber || _number > route.lastNumber) return false;
            if (route.lane == "both") return true;
            if (route.lane == "even" && _number % 2 == 1) return false;
            if (route.lane == "odd" && _number % 2 == 0) return false;
            return true;
        }
        // Trường hợp chỉ có số
        if (/^[0-9]+/.test(value)) {
            const _number = Number(value.match(/^[0-9]+/)[0]);
            if (_number < route.firstNumber || number > route.lastNumber) return false;
            if (route.lane == "both") return true;
            if (route.lane == "even" && _number % 2 == 1) return false;
            if (route.lane == "odd" && _number % 2 == 0) return false;
            return true;
        }
        //Trường hợp tìm theo giỏ
        if (/^o[0-9]+/.test(value) || /^O[0-9]+/.test(value)) {
            if (value.toLowerCase() != route.route.toLowerCase()) {
                console.log("sai");
                return false;
            }
            return true;
        }
        // Trường hợp chỉ có chữ
        if (/^[^0-9]/.test(value)) {
            if (!isMatching(route.streetName, value)) return false;
            return true;
        }
    });
}

// Gán sự kiện onChange cho input với hàm debounce
const inputElement = document.getElementById("userInput");
inputElement.addEventListener("input", debounce(handleInputChange, 500)); // 500ms

function showData() {
    const inputElement = document.getElementById("userInput");
    const value = inputElement.value;
    let data = searchFilter(value);
    document.querySelector(".data-list").innerHTML =
        data.length > 0
            ? data
                  .map((route, index) => {
                      let spacing = ` (${route.firstNumber} - ${route.lastNumber == 10000 ? "Hết" : route.lastNumber})`;
                      if (route.firstNumber == 0 && route.lastNumber == 10000) spacing = "";
                      if (route.lane == "odd" && route.firstNumber == 0 && route.lastNumber == 10000)
                          spacing = " (Số lẻ)";
                      if (route.lane == "even" && route.firstNumber == 0 && route.lastNumber == 10000)
                          spacing = " (Số chẵn)";
                      if (route.lane == "both" && route.firstNumber == 0 && route.lastNumber == 10000) spacing = "";
                      const randomId = Math.floor(1000000 + Math.random() * 900000000);
                      return `
             <div class='data-item' id='item-${randomId}'>
                <div class="form-item"></div>
                <div class="item" data-src='${CODS[route.route]?.phone}'>
                   
                    <div class="userImage">
                        <img src="https://hrchannels.com/Upload/avatar/20230325/144310892_Logo.png" alt="Profile Image">
                    </div>
                    <div class="info">
                        <p class="street-name">${route.streetName}${spacing}</p>
                        <p class="person-name"><span>${CODS[route.route]?.name} - ${CODS[route.route]?.phone.slice(
                          -4
                      )}</span> <span class='route-label ${route.type == true ? "main" : "sub"}'>${
                          route.type == true ? "Chính" : "Xoay"
                      }</span>

                        </p>
                    </div>
                     <div class="item-options">
                        <div class="item-option">
                            <button class="btn-edit" data-id='item-${randomId}' data-index='${index}'>
                                <i class="fa-regular fa-pen-to-square"></i>
                            </button>
                        </div>
                        <div class="item-option">
                            <a href="tel:${
                                CODS[route.route]?.phone
                            }" class="call-button"><img class='option-ico' src='./call.png' alt=''>
                                </i></a>
                        </div>
                    </div>
                </div>
            </div>
       `;
                  })
                  .join("")
            : '<p class="">Tuyến đường không có sẵn!</p>';
    listener(data);
}

function showNotification(notification) {
    const icon = {
        success: '<i class="fa-solid fa-check"></i>',
        warning: '<i class="fa-solid fa-circle-info"></i>',
        failed: '<i class="fa-solid fa-circle-xmark"></i>',
    };
    const style = {
        success: "notification-success",
        warning: "notification-warning",
        failed: "notification-failed",
    };
    const notifyIcon = icon[notification.type];
    const notifyStyle = style[notification.type];
    const notifyElement = document.querySelector(".notification");
    notifyElement.classList.add(notifyStyle);
    notifyElement.innerHTML = `
    ${notifyIcon}
    <span>${notification.message}</span>
    `;
    notifyElement.classList.add("slideDown");
    setTimeout(() => {
        document.querySelector(".notification").classList.remove("slideDown");
    }, notification.timing || 1000);
}

function listener(data) {
    document.querySelectorAll(".info").forEach((item) => {
        item.addEventListener("click", (e) => {
            const text = e.target.closest(".item").getAttribute("data-src");
            navigator.clipboard
                .writeText(text)
                .then(() => showNotification({ type: "success", message: "Copied",timing: 1000 }))
                .catch((error) => {
                    console.error("Lỗi khi sao chép:", error);
                    alert("Có lỗi xảy ra khi sao chép.");
                });
        });
    });

    document.querySelectorAll(".item-option > button.btn-edit").forEach((item) => {
        item.addEventListener("click", (e) => {
            const dataRouteId = e?.target?.closest("button")?.getAttribute("data-id");
            const index = e?.target?.closest("button")?.getAttribute("data-index");
            if (!dataRouteId || !index) return;
            showForm(dataRouteId, data[index]);
        });
    });
}

function handleSelectCod(value) {
    document.querySelector(".filter-element").value = value; // Đặt giá trị của input
    const box = document.querySelector(".select-box");
    box.classList.remove("visible");
}

function renderCods(cods) {
    if (!cods) return;
    return cods
        .map((cod) => {
            const value = `${cod.route} - ${cod.name} - ${cod.phone.slice(-4)}`;
            return `<div data-value='${value}' onclick="handleSelectCod('${value}')" class='select-item'>${value}</div>`;
        })
        .join("");
}

let cacheId = null;
function showForm(formId, route) {
    if (!formId) return;
    //remove old form if exits
    if (cacheId) {
        const element = document.getElementById(cacheId);
        if (element) {
            element.querySelector(".form-item").innerHTML = "";
            element.querySelector(".item").style.display = "flex";
        }
    }
    // update new cache
    cacheId = formId;
    const formItem = document.getElementById(formId);
    formItem.querySelector(".item").style.display = "none";
    const _route = route
        ? `${CODS[route.route].route} - ${CODS[route.route]?.name} - ${CODS[route.route]?.phone.slice(-4)}`
        : "";
    formItem.querySelector(".form-item").innerHTML = `
    <div class='form'>
        <div class="form-title">${!route ? "Cập nhật tuyến đường mới" : "Chỉnh sửa tuyến đường"}</div>
            <div class="form-field">
                <div class="form-label">Tuyến đường</div>
                <div class="form-data">
                    <input data-key=${route ? route.key : null} value='${
        !route ? "" : route.streetName
    }' id="streetName" class="form-address" type="text">
                </div>
            </div>
            <div class="form-double">
                <div class="form-field">
                    <div class="form-label">Tuyến</div>
                    <div class="form-data">
                        <select class="form-address" name="cars" id="type">
                        <option  ${route?.type == true ? "selected" : ""}  value=true>Chính</option>
                        <option ${route?.type == false ? "selected" : ""}  value=false>Phụ</option>
                        </select>
                    </div>
                </div>
                <div class="form-field">
                    <div class="form-label">Loại tuyến</div>
                    <div class="form-data">
                        <select id="lane" class="form-address">
                            <option ${route?.lane === "both" ? "selected" : ""} value="both">Cả 2</option>
                            <option ${route?.lane === "even" ? "selected" : ""} value="even">Tuyến chẵn</option>
                            <option ${route?.lane === "odd" ? "selected" : ""} value="odd">Tuyến lẻ</option>

                        </select>
                    </div>
                </div>
            </div>
            <div class="form-double">
                <div class="form-field">
                    <div class="form-label">Bắt đầu</div>
                    <div class="form-data">
                        <input id="firstNumber" value="${
                            route ? route.firstNumber : ""
                        }" placeholder="0" type="number" class="form-address" type="text">
                    </div>
                </div>
                <div class="form-field">
                    <div class="form-label">Kết thúc</div>
                    <div class="form-data">
                        <input id="lastNumber" type="number"  value="${
                            route ? (route.lastNumber == 10000 ? "" : route.lastNumber) : ""
                        }" placeholder="Infinity" class="form-address"
                            type="text">
                    </div>
                </div>
            </div>
            <div class="form-field">
                <div class="form-label">Giỏ</div>
                <div class="form-data">
                    <div class="form-filter">
                        <input id="myInput" value='${_route}' autocomplete="off" class="form-address filter-element" type="text">
                        <div class="select-box">
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-submit">
                 ${
                     route
                         ? `<button class="btn-action btn-delete" data-src=${route.key}><i class="fa-solid fa-trash"></i> Xóa
                </button>`
                         : ""
                 }
                <button class="btn-action btn-cancel"><i class="fa-solid fa-ban"></i></i> Hủy
                    bỏ</button>
                <button class="btn-action btn-save"><i class="fa-solid fa-floppy-disk"></i> ${
                    !route ? "Cập nhật" : "Lưu lại"
                }</button>
            </div>
    </div>
       `;

    document.querySelector(".btn-save").addEventListener("click", async () => {
        const route_key = document.getElementById("streetName").getAttribute("data-key");
        const streetName = document.getElementById("streetName").value;
        const type = document.getElementById("type").value == "true" ? true : false;
        const lane = document.getElementById("lane").value;
        const firstNumber = Number(document.getElementById("firstNumber").value) || 0;
        const lastNumber = Number(document.getElementById("lastNumber").value) || 10000;
        const route = document.getElementById("myInput").value?.split(" - ")[0];
        if (streetName.length == 0) {
            alert("Vui lòng nhập tên tuyến đường!");
            return;
        }
        if (streetName.length < 5) {
            alert("Tuyến đường không xác định. Quá ngắn!");
            return;
        }
        if (route.length == 0) {
            alert("Vui lòng chọn giỏ!");
            return;
        }
        if (
            lane == "odd" &&
            (firstNumber != 0 || lastNumber != 10000) &&
            (firstNumber % 2 == 0 || lastNumber % 2 == 0)
        ) {
            alert("Tuyến phải là số lẻ!");
            return;
        }
        if (lane == "even" && (firstNumber % 2 == 1 || lastNumber % 2 == 1)) {
            alert("Tuyến phải là số chẳn!");
            return;
        }
        console.log(route_key);
        const key = route_key == "null" ? Math.floor(1000000 + Math.random() * 900000000) : route_key;
        console.log(key);
        const data = { streetName, type, lane, firstNumber, lastNumber, route, key };
        console.log(data);
        const recordRef = ref(database, `/routes/${key}`);
        try {
            await set(recordRef, data);
            console.log(route_key);
            if (route_key != "null") {
                ROUTES_DATA = ROUTES_DATA.map((_route) => {
                    if (_route.key == route_key) {
                        return { ...data };
                    }
                    return _route;
                });
                showData();
            } else {
                ROUTES_DATA.unshift(data);
                alert("Tạo mới tuyến thành công! Giỏ " + route);
                showData();
                document.getElementById("streetName").value = "";
                document.getElementById("lane").value = "both";
                document.getElementById("firstNumber").value = "";
                document.getElementById("lastNumber").value = "";
                document.getElementById("streetName").focus();
            }
        } catch (err) {
            console.log(err);
            alert("Thêm thất bại!");
        }
    });

    if (route) {
        document.querySelector("button.btn-delete").addEventListener("click", (e) => {
            const key = document.getElementById("streetName").getAttribute("data-key");
            if (!key) return;
            const recordRef = ref(database, `routes/${key}`);
            const isConfirmed = confirm("Xác nhận xóa tuyến này?");
            if (isConfirmed) {
                remove(recordRef)
                    .then(() => {
                        ROUTES_DATA = ROUTES_DATA.filter((route) => route.key != key);
                        showData();
                        alert("Xóa thành công!");
                    })
                    .catch((error) => {
                        alert("Có lỗi xảy ra trong quá trình xóa!");
                    });
            } else {
                console.log("Người dùng đã hủy.");
            }
        });
    }

    formItem.querySelector("#streetName").focus();
    formItem.querySelector(".btn-cancel").addEventListener("click", function () {
        formItem.querySelector(".item").style.display = "flex";
        formItem.querySelector(".form-item").innerHTML = "";
        cacheId = null;
    });

    document.getElementById("myInput")?.addEventListener("change", function (event) {
        const search = event.target.value;
        if (search.length == 0) return;
        if (!isValidRoute(search)) {
            alert("Giỏ không hợp lệ. Vui lòng chọn trong danh sách!");
            const box = document.querySelector(".select-box");
            const codList = Object.values(CODS);
            box.innerHTML = renderCods(codList);
        }
    });

    document.getElementById("myInput").addEventListener("input", function (event) {
        const search = event.target.value;
        const box = document.querySelector(".select-box");
        const codList = Object.values(CODS).filter((cod) => {
            const regex = new RegExp(search, "i");
            const str = `${cod.route} - ${cod.name} - ${cod.phone.slice(-4)}`;
            return regex.test(str);
        });
        box.innerHTML = renderCods(codList);
    });

    document.addEventListener("mousedown", (event) => {
        const clickedElement = event.target;
        const box = document.querySelector(".select-box");
        if (clickedElement.hasAttribute("data-value")) {
            handleSelectCod(clickedElement.getAttribute("data-value"));
            box.classList.remove("visible");
        }
        const value = document.getElementById("myInput")?.value;
        if (value?.length == 0) {
            box.classList.remove("visible");
            return;
        }
        if (isValidRoute(value)) {
            box.classList.remove("visible");
        }
    });

    document.querySelector(".filter-element").addEventListener("click", function () {
        console.log("111");
        const box = document.querySelector(".select-box");
        const codList = Object.values(CODS);
        box.innerHTML = renderCods(codList);
        box.classList.add("visible");
    });
}

document.getElementById("btn-all").addEventListener("click", function (event) {
    filterType = null;
    showData();
});
document.getElementById("btn-main").addEventListener("click", function (event) {
    filterType = true;
    showData();
});
document.getElementById("btn-sub").addEventListener("click", function (event) {
    filterType = false;
    showData();
});
function isValidRoute(route) {
    const codList = Object.values(CODS).filter((cod) => {
        const str = `${cod.route} - ${cod.name} - ${cod.phone.slice(-4)}`;
        const regex = new RegExp(str);
        return regex.test(route);
    });
    if (codList.length == 0) return false;
    return true;
}

document.addEventListener("DOMContentLoaded", function () {
    const dbRef = ref(database);
    get(child(dbRef, "routes"))
        .then((snapshot) => {
            if (snapshot.exists()) {
                ROUTES_DATA = Object.values(snapshot.val());
                showData();
            } else {
                console.log("Dữ liệu không tồn tại");
            }
        })
        .catch((error) => {
            console.error("Lỗi khi lấy dữ liệu:", error);
        });
    document.querySelector(".add-route").addEventListener("click", function () {
        showForm("form-container", null);
    });
});
