import axios from "axios";

export const handlePageHeaderSearchSubmit = async (url) => {
  try {
    alert("클릭이벤트실행");
    const response = await axios.get(url);

    const data = response.data;
    console.log(data);

    return data;
  } catch (error) {
    console.error("API 호출 중 오류 발생:", error);
    throw error;
  }
};
