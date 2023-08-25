import React from 'react';
import PrintButton from './PrintButton';
import DeleteButton from './DeleteButton';
import CalcButton from './CalcButton';
import SettingButton from './SettingButton';
import Print from "../../images/pages/common/print.png";
import Delete from "../../images/pages/common/delete.png";
import Calc from "../../images/pages/common/calc.png";
import Setting from "../../images/pages/common/setting.png";

const IconBtnWrap = () => {
    return (
        <div className="iconBtnWrap">
        <PrintButton imageSrc={Print} altText="프린트" />
        <DeleteButton imageSrc={Delete} altText="삭제" />
        <CalcButton imageSrc={Calc} altText="계산기" />
        <SettingButton imageSrc={Setting} altText="설정" />
        </div>
    );
};

export default IconBtnWrap;
