import React from "react";
import CustomButton from "../../Contents/CustomButton";
import CustomInput from "../../Contents/CustomInput";
import CustomCalender from "../../Contents/CustomCalendar";
import CustomRadio from "../../Contents/CustomRadio";

const HrBasic = () => {
  return (
    <div className="hrInfoBaseWrap">
      <ul className="pageTab">
        <li className="on">기초정보</li>
      </ul>
      <div className="hrInfoBase borderTopBold borderbottomBold">
        <div className="hrInfoBaseProfileImg">
          <img
            src="https://picsum.photos/180/180"
            alt="이미지 샘플"
            width="180px"
            height="180px"
          />
          <div className="hrInfoBaseProfileImgBtnBox">
            <CustomButton
              text="등록"
              color="black"
              backgroundColor="white"
              className="hrInfoBaseProfileImgBtn"
            />
            <CustomButton
              text="삭제"
              color="black"
              backgroundColor="white"
              className="hrInfoBaseProfileImgBtn"
            />
          </div>
        </div>
        <table className="table">
          <tbody>
            <tr>
              <th>영문성명</th>
              <td>
                <CustomInput width={322} className="hrInfoBaseInput" />
              </td>
            </tr>
            <tr>
              <th>주민등록번호</th>
              <td>
                <CustomInput width={322} className="hrInfoBaseInput" />
              </td>
            </tr>
            <tr>
              <th>생년월일</th>
              <td>
                <CustomCalender className="hrInfoBaseInput" />
              </td>
            </tr>
            <tr>
              <th>부서</th>
              <td>
                <CustomInput width={322} className="hrInfoBaseInput" />
              </td>
            </tr>
            <tr>
              <th>직무</th>
              <td>
                <CustomInput width={322} className="hrInfoBaseInput" />
              </td>
            </tr>
            <tr>
              <th>입사연월일</th>
              <td>
                <CustomCalender className="hrInfoBaseInput" />
              </td>
            </tr>
          </tbody>
          <tbody>
            <tr>
              <th>한자성명</th>
              <td>
                <CustomInput width={322} className="hrInfoBaseInput" />
              </td>
            </tr>
            <tr>
              <th>성별</th>
              <td>
                <CustomRadio
                  classNameBox="hrInfoBaseBox"
                  classNameRadio="classNameRadio"
                  name="gender"
                  options={[
                    ["남", "male"],
                    ["여", "female"],
                  ]}
                />
              </td>
            </tr>
            <tr>
              <th>결혼여부</th>
              <td>
                <CustomRadio
                  classNameBox="hrInfoBaseBox"
                  classNameRadio="classNameRadio"
                  name="married"
                  options={[
                    ["미혼", "0"],
                    ["기혼", "1"],
                  ]}
                />
              </td>
            </tr>
            <tr>
              <th>직급</th>
              <td>
                <CustomInput width={322} className="hrInfoBaseInput" />
              </td>
            </tr>
            <tr>
              <th>근로계약서</th>
              <td>
                <CustomRadio
                  classNameBox="hrInfoBaseBox"
                  classNameRadio="classNameRadio"
                  name="married"
                  options={[
                    ["작성", "0"],
                    ["미작성", "1"],
                  ]}
                />
              </td>
            </tr>
            <tr>
              <th>퇴사년연월일</th>
              <td>
                <CustomCalender className="hrInfoBaseInput" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HrBasic;
