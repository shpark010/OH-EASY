import React from "react";
import SearchBarBox from "../SearchBar/SearchBarBox";
import SearchSubmitButton from "../SearchBar/SearchSubmitButton";
import useApiRequest from "../Services/ApiRequest";
const HrSearchBar = ({ conditions, setConditions, setEmpList }) => {
  const apiRequest = useApiRequest();

  const handleSelectChange = (e, name) => {
    setConditions((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const handleSearchBtnClick = async () => {
    console.log("클릭 시점");
    try {
      const responseData = await apiRequest({
        method: "GET",
        url: `/api2/hr/getConditionalEmpList?category=${conditions.category}&sort=${conditions.sort}`,
      });
      console.log(responseData);
      setEmpList(responseData);
    } catch (error) {
      console.error("api 요청 실패:", error);
    }
  };

  return (
    <div className="searchBar">
      <div className="innerBox fxSpace">
        <div className="selectWrapper">
          <SearchBarBox
            label="조회구분"
            id="hr-category"
            options={[
              { value: 0, label: "0. 재직자" },
              { value: 1, label: "1. 퇴사자" },
              { value: 2, label: "2. 재직자+당해년도 퇴사자" },
              { value: 3, label: "3. 작년 퇴사자+당해년도 퇴사자" },
            ]}
            value={conditions.category}
            placeholder="선택"
            onChange={(e) => handleSelectChange(e, "category")}
          />
          <SearchBarBox
            label="정렬"
            id="hr-order"
            options={[
              { value: 0, label: "0. 코드순" },
              { value: 1, label: "1. 이름순" },
              { value: 2, label: "2. 입사순" },
            ]}
            value={conditions.sort}
            onChange={(e) => handleSelectChange(e, "sort")}
          />
        </div>
        <div className="btnWrapper">
          <SearchSubmitButton text="조회" onClick={handleSearchBtnClick} />
        </div>
      </div>
    </div>
  );
};

export default HrSearchBar;
