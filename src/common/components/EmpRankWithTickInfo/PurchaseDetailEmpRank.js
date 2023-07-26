import { Col, Image, Row } from "antd";
import React from "react";
import { ReactComponent as IconPeople } from "assets/images/icon-people.svg";
import checklist from "assets/images/checklist.png";
import { gtl_GetAnnualLimitValue,ghs_GetAnnualLimitValue, sp_GetAnnualLimitValue} from "common/constants/budgetConstant";

function PurchaseDetailEmpRank({ item, employee}) {
  return (
    <Row className="mb-5">
      <Col span={4}>
        <IconPeople /> X {employee?.length}
      </Col>
      <Col span={20} className="text-left px-3">
        <Row  className="mb-2">Employee Rank # {item?.rank}</Row>
        {item.budgetBasedData?.ghsPlan !== 'Plan0' && (
        <div className="text-x-small d-flex mb-2">
          <Col span={4}>
            <Image preview={false} src={checklist} width={20} />
          </Col>
          <Col span={20}>
            <div>
              e-Medical card with Overall Annual Limit of {ghs_GetAnnualLimitValue(item.budgetBasedData?.ghsPlan)} (Cashless
              Admission)
            </div>
          </Col>
        </div>
        )}
        {item.budgetBasedData?.gpspPlan !== 'Plan0' && (
        <div className="text-x-small d-flex mb-2">
          <Col span={4}>
            <Image src={checklist} width={20} />
          </Col>
          <Col span={20}>
            <div>Outpatient Clinical Visit, GP Overall Annual Limit is Unlimited</div>
            <div>and Specialist Practitioner Overall Annual Limit {sp_GetAnnualLimitValue(item.budgetBasedData?.gpspPlan)}</div>
          </Col>
        </div>
        )}
        {item.budgetBasedData?.gtl !== 'D0' && (
        <div className="text-x-small d-flex">
          <Col span={4}>
            <Image src={checklist} width={20} />
          </Col>
          <Col span={20}>
            <div>Death & disability with sum insured {gtl_GetAnnualLimitValue(item.budgetBasedData?.gtl)}</div>
          </Col>
        </div>
        )}
      </Col>
    </Row>
  );
}

export default PurchaseDetailEmpRank;
