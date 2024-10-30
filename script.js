function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

// Hàm xử lý sự kiện onChange, in ra dữ liệu người dùng nhập

function createInitials(name) {
    return name
        .split(" ")
        .map((word) => word[0].toLowerCase())
        .join("");
}

const fullName = "Lê đức tài";
const initials = createInitials(fullName);
function handleClick() {
    const inputElement = document.getElementById("userInput");
    inputElement.value = "";
    inputElement.focus()
    showData();
}

function handleInputChange(event) {
    document.querySelector(".loading").innerHTML = `<img width="100%" height="100%" src='./loading.gif' alt=''>`;
    setTimeout(() => {
        document.querySelector(".loading").innerHTML = '<button onclick="handleClick()" class="clear">X</button>';
    }, 1000);
    const value = event.target.value;
    const data = Object.values(MAIN_ROUTES).flat();
    console.log(value);
    const results = data.filter((item) => {
        if (value.length == 0) {
            return true;
        }
        if (/^[0-9]+\s.{0,}/.test(value)) {
            // Trường hợp vừa số vừa chữ
            const _value = value.split(" ").slice(1).join(" ");
            const _number = value.split(" ")[0];
            const result1 = item.streetName.match(new RegExp(_value, "i"));
            const result2 = createInitials(item.streetName).match(new RegExp(_value, "i"));
            if (item.streetName == "Hà Xuân 1") console.log("xuan hà 1", _value, result1, result2);
            if (!result1 && !result2) return false;
            if (_number < item.firstNumber || _number > item.lastNumber) return false;
            if (item.type == "Odd" && _number % 2 == 0) return false;
            if (item.type == "Even" && _number % 2 == 1) return false;
            return true;
        }
        // Trường hợp chỉ có số
        if (/^[0-9]+/.test(value)) {
            const number = Number(value.match(/^[0-9]+/)[0]);

            if (number < item.firstNumber || number > item.lastNumber) return false;
            if (item.type == "Odd" && number % 2 == 0) return false;
            if (item.type == "Even" && number % 2 == 1) return false;
            return true;
        }

        if (/^[^0-9]/.test(value)) {
            const result1 = item.streetName.match(new RegExp(value, "i"));
            const result2 = createInitials(item.streetName).match(new RegExp(value, "i"));
            if (result1 == null && result2 == null) return false;
            return true;
        }
        //Trường hợp tìm theo giỏ
        if (/^O[0-9]/.test(value)) {
        }
    });
    document.querySelector(".data-list").innerHTML = results
        .map((item) => {
            return `
            <div class="item">
            <div class="userImage">
                <img src="https://hrchannels.com/Upload/avatar/20230325/144310892_Logo.png" alt="Profile Image">
            </div>
            <div class="info">
            <p class="street-name">${item.streetName}</p>
                <p class="person-name">${CODS[item.route]?.name} - ${CODS[item.route]?.phone}</p>
            </div>
        </div>
       `;
        })
        .join("");
}

// Gán sự kiện onChange cho input với hàm debounce
const inputElement = document.getElementById("userInput");
inputElement.addEventListener("input", debounce(handleInputChange, 500)); // 500ms

function showData(){
    document.querySelector(".data-list").innerHTML = Object.values(MAIN_ROUTES)
        .flat()
        .map((item) => {
            return `
            <div class="item">
            <div class="userImage">
                <img src="https://hrchannels.com/Upload/avatar/20230325/144310892_Logo.png" alt="Profile Image">
            </div>
            <div class="info">
            <p class="street-name">${item.streetName}</p>
                <p class="person-name">${CODS[item.route]?.name} - ${CODS[item.route]?.phone}</p>
            </div>
        </div>
       `;
        })
        .join("");

}
showData()