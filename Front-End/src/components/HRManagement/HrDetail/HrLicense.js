import React, { useRef, useState, useEffect } from "react";
import Table from "../../TablesLib/Table";
import useApiRequest from "../../Services/ApiRequest";
import Input from "../../Contents/Input";
import CustomSelect from "../../Contents/CustomSelect";
import PageHeaderName from "../../PageHeader/PageHeaderName";
import CustomButton from "../../Contents/CustomButton";
import CustomModal from "../../Contents/CustomModal";
import CustomCalender from "../../Contents/CustomCalendar";
const HrLicense = ({ cdEmp }) => {
  const apiRequest = useApiRequest();
  const [licenseList, setLicenseList] = useState([]);
  const [showInsertRow, setShowInsertRow] = useState(false);

  const [modalLicenseList, setModalLicenseList] = useState([]); // 모달창 자격증 정보
  const [modalIsOpen, setModalIsOpen] = useState(false); // 모달창 관리

  const [clickSeqLicense, setClickSeqLicense] = useState();
  const [clickModalNmLicense, setClickModalNmLicense] = useState(); // 현재 클릭한 자격증이름

  console.log("현재 클릭중인 자격증 고유번호 : ");
  console.log(clickSeqLicense);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  // 모달창 닫으면서 api 요청
  const okModalBtn = async () => {
    closeModal();
    if (clickSeqLicense === undefined) {
      console.log("인서트 요청~~~~~");
      handleSendEmpCodeInsertLicenseData(
        cdEmp,
        "nmLicense",
        clickModalNmLicense,
      );
    } else {
      console.log("업데이트 요청~~~~~");
      handleSendEmpCodeUpdateLicenseData(
        clickSeqLicense,
        "nmLicense",
        clickModalNmLicense,
      );
    }
    // 이 부분에서 API 호출이 끝나고 나면
    if (clickSeqLicense !== undefined) {
      // update 경우만 해당됩니다.
      const updatedLicense = {
        seqLicense: clickSeqLicense,
        nmLicense: clickModalNmLicense,
        // 여기에 필요한 다른 정보들도 추가해야 합니다.
      };

      setLicenseList((prevLicenseList) => {
        const newLicenseList = [...prevLicenseList]; // 배열 복사
        const index = newLicenseList.findIndex(
          (license) => license.seqLicense === updatedLicense.seqLicense,
        );
        if (index !== -1) {
          newLicenseList[index] = updatedLicense; // 해당 위치에 업데이트된 데이터 할당
        }
        return newLicenseList;
      });
    }
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
    if (cdEmp == null || cdEmp === "" || cdEmp === undefined) {
      return;
    }
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
  const handleDateChange = async (value, name, seqLicense) => {
    console.log("handleDateChange ******************");

    if (cdEmp == null || cdEmp === "" || cdEmp === undefined) {
      return;
    }
    value = value.replace(/-/g, "");

    if (seqLicense === null || seqLicense === undefined || seqLicense === "") {
      // 학력고유 번호가 없을땐 insert
      try {
        const responseData = await apiRequest({
          method: "GET",
          url: `/api2/hr/insertLicenseData?cdEmp=${cdEmp}&${name}=${value}`,
        });
        console.log("요청성공!!!!!!!!!!!!!!!!");
      } catch (error) {
        console.error("api 요청 실패:", error);
      }
      handleSendEmpCodeGetLicenseData(cdEmp);
    } else {
      // 학력고유 번호가 있을땐 update
      console.log("요청 전!!!!!!!!!!!!!!!!!!!!!!");
      try {
        const responseData = await apiRequest({
          method: "GET",
          url: `/api2/hr/updateLicenseData?seqLicense=${seqLicense}&${name}=${value}`,
        });
        console.log("요청성공!!!!!!!!!!!!!!!!");
      } catch (error) {
        console.error("Failed to fetch emp data:", error);
      }
      updateLicenseListItem(seqLicense, name, value);
    }
  };

  const updateLicenseListItem = (seqLicense, name, value) => {
    const updatedLicenseList = licenseList.map((license) => {
      if (license.seqLicense === seqLicense) {
        return {
          ...license,
          [name]: value,
        };
      }
      return license;
    });
    setLicenseList(updatedLicenseList);
  };

  // 테이블에 보내야할 데이터
  const data = React.useMemo(
    () =>
      licenseList.map((license) => ({
        seqLicense: license.seqLicense, // 자격테이블 고유번호
        cdEmp: license.cdEmp, //  사원번호
        fgLicense: license.fgLicense, // 자격구분
        nmLicense: license.nmLicense, // 자격증 이름
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
        accessor: "nmLicense",
        id: "nmLicense",
        Cell: ({ cell: { value }, row: { original } }) => {
          const [inputValue, setInputValue] = React.useState(value || ""); // value가 null일 경우 빈 문자열로 초기화

          const handleModalOnclick = (e) => {
            if (!original) {
              setClickSeqLicense();
            } else {
              setClickSeqLicense(original.seqLicense);
            }
            handleGetLicenseList();
            openModal(e);
          };

          return (
            <Input
              value={inputValue || ""}
              className={"doubleLine"}
              onClick={(e) => handleModalOnclick(e)}
            />
          );
        },
      },
      {
        Header: "급수(구사력)",
        accessor: "noRating",
        id: "noRating",
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
                "noRating",
                e.target.value,
              );
              handleSendEmpCodeGetLicenseData(cdEmp);
              setInputValue(e.target.value);
            } else {
              // update
              handleSendEmpCodeUpdateLicenseData(
                original.seqLicense,
                "noRating",
                e.target.value,
              );
              setInputValue(e.target.value);
            }
          };

          return (
            <Input
              value={inputValue || ""}
              onChange={handleInputChange}
              isDoubleClick={true}
              onBlur={handleInputOnBlur}
              className={"doubleLine"}
            />
          );
        },
      },
      {
        Header: "취득일",
        accessor: "dtCertified",
        id: "dtCertified",
        Cell: ({ cell: { value }, row: { original } }) => {
          const handleInputChange = (e) => {
            const seqseqLicenseValue = original ? original.seqLicense : null;
            handleDateChange(e, "dtCertified", seqseqLicenseValue);
          };
          return (
            <CustomCalender
              className="hrInfoBaseInput"
              value={value || ""}
              name="dtCertified"
              onChange={handleInputChange}
            />
          );
        },
      },
      {
        Header: "자격증번호",
        accessor: "noLicense",
        id: "noLicense",
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
                "noLicense",
                e.target.value,
              );
              handleSendEmpCodeGetLicenseData(cdEmp);
              setInputValue(e.target.value);
            } else {
              // update
              handleSendEmpCodeUpdateLicenseData(
                original.seqLicense,
                "noLicense",
                e.target.value,
              );
              setInputValue(e.target.value);
            }
          };

          return (
            <Input
              value={inputValue || ""}
              onChange={handleInputChange}
              isDoubleClick={true}
              onBlur={handleInputOnBlur}
              className={"doubleLine"}
            />
          );
        },
      },
      {
        Header: "발행기관",
        accessor: "nmIssuing",
        id: "nmIssuing",
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
                "nmIssuing",
                e.target.value,
              );
              handleSendEmpCodeGetLicenseData(cdEmp);
              setInputValue(e.target.value);
            } else {
              // update
              handleSendEmpCodeUpdateLicenseData(
                original.seqLicense,
                "nmIssuing",
                e.target.value,
              );
              setInputValue(e.target.value);
            }
          };

          return (
            <Input
              value={inputValue || ""}
              onChange={handleInputChange}
              isDoubleClick={true}
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
            setClickModalNmLicense(original.nmLicense);
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
            setClickModalNmLicense(original.nmLicense);
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
            onClick={okModalBtn}
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
