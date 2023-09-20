import React, { useRef, useState, useEffect } from "react";
import Table from "../../TablesLib/Table";
import useApiRequest from "../../Services/ApiRequest";
import Input from "../../Contents/Input";
import CustomSelect from "../../Contents/CustomSelect";
import PageHeaderName from "../../PageHeader/PageHeaderName";
import CustomButton from "../../Contents/CustomButton";
import CustomModal from "../../Contents/CustomModal";

const HrLicense = ({ cdEmp }) => {
  const apiRequest = useApiRequest();
  const [licenseList, setLicenseList] = useState([]);
  const [showInsertRow, setShowInsertRow] = useState(false);

  const [modalLicenseList, setModalLicenseList] = useState([]); // 모달창 자격증 정보
  const [modalIsOpen, setModalIsOpen] = useState(false); // 모달창 관리
  const [clickModalLicenseCode, setClickModalLicenseCode] = useState(null); // 현재 클릭한 cdEmp 저장하는 상태

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const isFirstRender = useRef(true);

  useEffect(() => {
    // 첫 렌더링인지 체크
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    // cdEmp가 undefined일 때는 아무것도 하지 않고 리턴
    if (cdEmp === undefined) {
      return;
    }

    setShowInsertRow(false);
    handleSendEmpCodeGetLicenseData(cdEmp); // 함수 호출시 인자로 empCode 전달
  }, [cdEmp]);

  const handleSendEmpCodeGetLicenseData = async (cdEmp) => {
    if (cdEmp == null || cdEmp === "" || cdEmp === undefined) {
      return;
    }
    try {
      const responseData = await apiRequest({
        method: "GET",
        url: `/api2/hr/getLicenseDataList?cdEmp=${cdEmp}`,
      });
      setLicenseList(Array.isArray(responseData) ? responseData : []); // 배열 확인
      setShowInsertRow(false);
    } catch (error) {
      console.error("api 요청 실패:", error);
    }
  };

  const handleSendEmpCodeInsertLicenseData = async (
    cdEmp,
    accessor,
    inputValue,
  ) => {
    try {
      const responseData = await apiRequest({
        method: "GET",
        url: `/api2/hr/insertLicenseData?cdEmp=${cdEmp}&${accessor}=${inputValue}`,
      });
    } catch (error) {
      console.error("api 요청 실패:", error);
    }
    handleSendEmpCodeGetLicenseData(cdEmp);
  };
  const handleSendEmpCodeUpdateLicenseData = async (
    seqLicense,
    accessor,
    inputValue,
  ) => {
    if (cdEmp == null || cdEmp === "" || cdEmp === undefined) {
      return;
    }
    console.log("현재 inputValue : " + inputValue);
    if (inputValue == null || inputValue === "" || inputValue === undefined) {
      console.log("값의 변화가 없음 api요청 안감");
      return;
    }

    try {
      const responseData = await apiRequest({
        method: "GET",
        url: `/api2/hr/updateLicenseData?seqLicense=${seqLicense}&${accessor}=${inputValue}`,
      });
    } catch (error) {
      console.error("api 요청 실패:", error);
    }
  };

  // 모달창 닫으면 바로 사원 인서트
  const closeModalAndEmpInsert = async () => {
    closeModal();
    try {
    } catch (error) {
      console.error("Failed to fetch emp data:", error);
    }
  };

  // 모달창에서 자격증리스트 API 요청 후 자격증리스트 set
  const handleGetLicenseList = async () => {
    try {
      const responseData = await apiRequest({
        method: "GET",
        url: "/api2/hr/getLicenseList",
      });
      console.log("디비에서 가져온 **************");
      console.log(responseData);
      setModalLicenseList(responseData);
      console.log(modalLicenseList);
    } catch (error) {
      console.error("Failed to fetch emp data:", error);
    }
  };

  // 테이블에 보내야할 데이터
  const data = React.useMemo(
    () =>
      licenseList.map((license) => ({
        seqLicense: license.seqLicense, // 자격테이블 고유번호
        cdEmp: license.cdEmp, //  사원번호
        fgLicense: license.fgLicense, // 자격구분
        cdLicense: license.cdLicense, // 자격증 코드번호
        noRating: license.noRating, // 급수
        dtCertified: license.dtCertified, // 취득일
        noLicense: license.noLicense, // 자격증 번호
        nmIssuing: license.nmIssuing, // 발행기관
      })),
    [licenseList],
  );
  const columns = React.useMemo(
    () => [
      {
        Header: "구분",
        accessor: "fgLicense",
        id: "fgLicense",
        width: "8%",
        Cell: ({ cell: { value }, row: { original } }) => {
          const [inputValue, setInputValue] = React.useState(value || ""); // value가 null일 경우 빈 문자열로 초기화
          const handleInputChange = (e) => {
            if (original == null) {
              // insert
              console.log("****************");
              handleSendEmpCodeInsertLicenseData(
                cdEmp,
                "fgLicense",
                e.target.value,
              );
              console.log("수정요청");
              handleSendEmpCodeGetLicenseData(cdEmp);
              setInputValue(e.target.value);
            } else {
              // update
              handleSendEmpCodeUpdateLicenseData(
                original.seqLicense,
                "fgLicense",
                e.target.value,
              );
              console.log("수정요청");
              setInputValue(e.target.value);
            }
          };
          return (
            <CustomSelect
              className={"hrDetailSelect"}
              options={[
                { value: "0", label: "미선택" },
                { value: "1", label: "자격증" },
                { value: "2", label: "외국어" },
              ]}
              placeholder="선택"
              value={inputValue || "0"}
              onChange={handleInputChange}
            />
          );
        },
      },
      {
        Header: "자격증(외국어명)",
        accessor: "cdLicense",
        id: "cdLicense",
        Cell: ({ cell: { value }, row: { original } }) => {
          const [inputValue, setInputValue] = React.useState(value || ""); // value가 null일 경우 빈 문자열로 초기화

          const handleInputChange = (e) => {
            setInputValue(e.target.value);
          };

          const handleInputOnBlur = (e) => {
            if (original == null) {
              // insert
              handleSendEmpCodeInsertLicenseData(
                cdEmp,
                "cdLicense",
                e.target.value,
              );
              handleSendEmpCodeGetLicenseData(cdEmp);
              setInputValue(e.target.value);
            } else {
              // update
              handleSendEmpCodeUpdateLicenseData(
                original.seqLicense,
                "cdLicense",
                e.target.value,
              );
              setInputValue(e.target.value);
            }
          };
          const handleModalOnclick = (e) => {
            handleGetLicenseList();
            openModal(e);
          };
          return (
            <Input
              value={inputValue || ""}
              onChange={handleInputChange}
              onClick={handleModalOnclick}
              onBlur={handleInputOnBlur}
              className={"doubleLine"}
            />
          );
        },
      },
    ],
    [licenseList],
  );

  const dataModalLicenscList = React.useMemo(
    () =>
      modalLicenseList.map((license) => ({
        cdLicense: license.cdLicense, // 자격증 코드번호
        nmLicense: license.nmLicense, // 자격증 명
      })),
    [modalLicenseList],
  );
  const columnsModal = React.useMemo(
    () => [
      {
        Header: "자격증 코드번호",
        accessor: "cdLicense",
        id: "cdLicense",
        width: "50%",
        Cell: ({ cell: { value }, row: { original } }) => {
          const handleInputClick = (e) => {
            console.log("code클릭이벤발생");
            console.log(original);
            setClickModalLicenseCode(original.cdLicense);
          };
          return (
            <Input
              value={original.cdLicense || ""}
              className={"doubleLine"}
              onClick={handleInputClick}
            />
          );
        },
      },
      {
        Header: "자격증(외국어명)",
        accessor: "nmLicense",
        id: "nmLicense",
        Cell: ({ cell: { value }, row: { original } }) => {
          const handleInputClick = (e) => {
            console.log("code클릭이벤발생");
            console.log(original);
            setClickModalLicenseCode(original.nmLicense);
          };
          return (
            <Input
              value={original.nmLicense || ""}
              className={"doubleLine"}
              onClick={handleInputClick}
            />
          );
        },
      },
    ],
    [modalLicenseList],
  );

  return (
    <>
      <Table
        data={data}
        columns={columns}
        insertRow={true}
        showInsertRow={showInsertRow}
        setShowInsertRow={setShowInsertRow}
        //scrollHeight={"700"}
      />
      <CustomModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        overlayStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        contentStyle={{
          backgroundColor: "white",
          border: "1px solid gray",
        }}
      >
        <PageHeaderName text="추가목록" />
        <div className="test2">
          <Table columns={columnsModal} data={dataModalLicenscList} />
        </div>
        <div className="test">
          <CustomButton
            backgroundColor={"var(--color-primary-blue)"}
            color={"var(--color-primary-white)"}
            onClick={closeModalAndEmpInsert}
            text={"확인"}
          />
          <CustomButton
            backgroundColor={"var(--color-primary-gray)"}
            color={"var(--color-primary-white)"}
            onClick={closeModal}
            text={"취소"}
          />
        </div>
      </CustomModal>
    </>
  );
};

export default HrLicense;
