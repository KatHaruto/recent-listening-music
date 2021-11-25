import axios from "axios";

// 共通のヘッダーを設定したaxiosのインスタンス作成
const gasApi = axios.create({
  headers: { "content-type": "application/json" },
});

// response共通処理
// errorが含まれていたらrejectする
gasApi.interceptors.response.use(
  (res) => {
    if (res.data.error) {
      return Promise.reject(res.data.error);
    }
    return Promise.resolve(res);
  },
  (err) => {
    return Promise.reject(err);
  }
);

/**
 * APIのURLを設定します
 * @param {String} url
 */
const setUrl = (url) => {
  gasApi.defaults.baseURL = url;
};

/**
 * authTokenを設定します
 * @param {String} token
 */
let authToken = "";
const setAuthToken = (token) => {
  authToken = token;
};

/**
 * 指定年月のデータを取得します
 * @param {String} yearMonth
 * @returns {Promise}
 */
const fetch = (yearMonth) => {
  console.log(yearMonth);
  return gasApi.get("", {
    method: "GET",
    authToken,
    params: {
      yearMonth: yearMonth,
      crossDomain: true,
    },
  });
};

export default {
  setUrl,
  setAuthToken,
  fetch,
};
