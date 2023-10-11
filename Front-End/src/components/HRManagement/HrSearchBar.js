import React, { useState, useEffect } from "react";
import SearchBarBox from "../SearchBar/SearchBarBox";
import SearchSubmitButton from "../SearchBar/SearchSubmitButton";
import useApiRequest from "../Services/ApiRequest";
import SweetAlert from "../Contents/SweetAlert";
const HrSearchBar = ({
  //conditions,
  //setConditions,
  empList,
  setEmpList,
  setClickEmpCode,
  setEmpStats,
  setCheckedRows,
}) => {
  const apiRequest = useApiRequest();

  const [conditions, setConditions] = useState({
    category: 0,
    sort: 0,
  }); // 검색 조건을 저장하는 상태

  // 알림창 표시 상태 관리
  const [showAlert, setShowAlert] = useState(false);
  useEffect(() => {
    console.log("상태가 업데이트된 후~~~~~~");
    console.log(conditions);
    handleSearchBtnClick();
  }, [conditions]);

  const handleSelectChange = (e, name) => {
    console.log("변경전~~~~~~");
    console.log(conditions);
    setConditions((prevState) => ({ ...prevState, [name]: e.target.value }));
  };
  const handleSearchBtnClick = async () => {
    console.log("클릭 시점");
    console.log(conditions);

    setEmpList([]);
    try {
      const responseData = await apiRequest({
        method: "GET",
        url: `/api2/hr/getConditionalEmpList?category=${conditions.category}&sort=${conditions.sort}`,
      });
      console.log(responseData);
      setEmpList(responseData.result);
      setEmpStats({
        total: responseData.total,
        working: responseData.working,
        resigned: responseData.resigned,
      });
      console.log(responseData.result[responseData.result.length - 1].cdEmp);
      setClickEmpCode(
        responseData.result[responseData.result.length - 1].cdEmp,
      );
      console.log("********************************");
      console.log(responseData.result);
      console.log("********************************");
      if (responseData.result.length === 0) {
        setShowAlert(true);
        return;
      }
    } catch (error) {
      console.error("api 요청 실패:", error);
    }
    setCheckedRows([]);
  };
  const handleCloseAlert = () => {
    setShowAlert(false); // 알림창 표시 상태를 false로 설정
  };

  return (
    <div className="searchBar">
      {showAlert && (
        <SweetAlert
          text="조건에 맞는 사원이 존재하지 않습니다."
          //type="question"
          type="error"
          onConfirm={() => {
            handleCloseAlert();
          }}
        />
      )}
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
