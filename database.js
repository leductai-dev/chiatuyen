// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { getDatabase, ref, set, onValue , get} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js";

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
// Khởi tạo ứng dụng Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo Realtime Database
export const database = getDatabase(app);


