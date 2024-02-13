// Initialization for ES Users

import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'

const url = 'https://vue3-course-api.hexschool.io'; // 請加入站點
const path = 'colorgolden'; // 請加入個人 API Path


// #1 如何串接 API 資料


const app = createApp({
  data() {
    return { 
      temp:{},
      products:[],
     }
  },
  methods: {

    login() {
      const username = document.querySelector('#email').value;
      const password = document.querySelector('#password').value;
      console.log(username,password);
      const users = {
        username,
        password
      }
      
      
      // #2 發送 API 至遠端並登入（並儲存 Token）
      axios.post(`${url}/v2/admin/signin`, users)
        .then((res) => {
          console.log(res);
          console.log(username,password);
          window.location.href = 'admin_products.html'; //跳轉到products頁面
          const { token, expired } = res.data;
          document.cookie = `newToken=${token}; expires=${new Date(expired)};`;
        })
        .catch((error) => {
          console.log(username,password);
          console.dir(error);
        })
    },

    checkLogin() {
      // #3 取得 Token（Token 僅需要設定一次）
      
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)newToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
      axios.defaults.headers.common['Authorization'] = token;

      if (!window.location.href.includes('index.html')) {  //只要不是在index頁面，就執行大括號內的程式碼
        // #4  確認是否登入
        axios.post(`${url}/v2/api/user/check`, {}, { headers: { 'Authorization': token } })
          .then((res) => {
            console.log(res);
          })
          .catch((error) => {
            alert("尚未登入會員，請重新登入！");
            window.location.href = 'index.html'; //跳轉到login頁面
            console.dir(error);
            return;
          })
      } else {
        return;
      }
    },

    getProducts() {
      // #5 取得後台產品列表
      axios.get(`${url}/v2/api/${path}/admin/products`)
        .then((res) => {
          console.log(res.data.products);
          // 將res.data.products設定到Vue的products陣列中
          this.products = res.data.products;
        })
        .catch((error) => {
          console.dir(error);
        })
    },

  },
  created() {  
    this.checkLogin();
    this.getProducts(); 
  }
}).mount('#app')



