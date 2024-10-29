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

function handleInputChange(event) {
    const inputValue = event.target.value.split(" ");
    const houseNumer = inputValue[0];
    const streetName = inputValue.slice(1).join(" ");
    console.log("Dữ liệu nhập:", createInitials(streetName));
    const data = Object.values(MAIN_ROUTES).flat();
    console.log(data);

    const results = data.filter((item) => {
        const str = item.streetName;
        const result1 = str.match(new RegExp(streetName, "i"));
        const result2 = createInitials(str).match(new RegExp(streetName, "i"));
        if (result1 == null && result2 == null) return false;
        if (houseNumer < item.firstNumber || houseNumer > item.lastNumber) return false;
        if (item.type == "Odd" && houseNumer % 2 == 0) return false;
        if (item.type == "Even" && houseNumer % 2 == 1) return false;
        return true
    });
    document.querySelector(".data-list").innerHTML = results
        .map((item) => { console.log(CODS['O10']); console.log(item.route) ; console.log(CODS.O10);
            return `
            <div class="item">
            <div class="userImage">
                <img src="https://via.placeholder.com/50" alt="Profile Image">
            </div>
            <div class="info">
            <p class="street-name">${item.streetName}</p>
                <p class="person-name">${CODS[item.route].name} - ${CODS[item.route].phone}</p>
            </div>
        </div>
       `;
        })
        .join("");
}

// Gán sự kiện onChange cho input với hàm debounce
const inputElement = document.getElementById("userInput");
inputElement.addEventListener("input", debounce(handleInputChange, 500)); // 500ms
