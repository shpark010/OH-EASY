import axios from "axios";

export const handleSearchBarSubmit = async (url, categoryId, orderId) => {
  try {
    const categoryValue = document.getElementById(categoryId).value;
    const orderValue = document.getElementById(orderId).value;
    alert("클릭이벤트실행");
    console.log(categoryValue, orderValue);
    // const response = await axios.post(url, {
    //   category: categoryValue,
    //   order: orderValue,
    // });
    // const data = response.data;
    // console.log(data);
    //return data;
  } catch (error) {
    console.error("API 호출 중 오류 발생:", error);
    throw error;
  }
};
