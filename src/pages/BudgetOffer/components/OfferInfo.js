import { Avatar, Col, Image, Progress, Row, Space, Tooltip } from "antd";
import React, { useState } from "react";
import styled from "styled-components";
import { ReactComponent as EditIcon } from "assets/images/icon-edit.svg";
import { ReactComponent as PlanExpandIcon } from "assets/images/icon-plan-collaps.svg";
import { ReactComponent as PlanCollapseIcon } from "assets/images/icon-plan-expand.svg";
import { ReactComponent as InfoIcon } from "assets/images/icon-info-white.svg";
import { ReactComponent as RedInfoIcon } from "assets/images/icon-info.svg";
import { GetMedicalFixedValue, ghs_GetAnnualLimitValue,sp_GetAnnualLimitValue,gp_GetAnnualLimitValue,gtl_GetAnnualLimitValue, GetDailyRoomAndBoard } from "common/constants/budgetConstant";
import { addThousandSeparator } from "common/utils/stringUtils";

const Header = styled(Row)`
  min-height: 70px;
  overflow: hidden;
  justify-content: space-between;
  padding: 16px;
`;

const Wrapper = styled.div`
  width: 100%;
  padding: 1.5rem;
  color: white;
`;

const MainDataWrapper = styled(Col)`
  width: 100%;
  background-color: #4e4f57;
  border-radius: 1rem;
  box-shadow: 0 0 0 4px rgb(0 0 0 / 5%);
`

const ProgressText = styled.span`
  z-index: 999;
  font-size: 10px;
  top: 50%;
  transform: translateY(-50%);
`;
const DescriptionText = styled.div`
  z-index: 999;
  float: right;
`;
const StyledEditButton = styled.div`
  background-color: rgba(0, 0, 0, 0.2);
  padding: 4px;
  height: 100%;
  border-radius: 4px;
`;

const ExpandCollapseWrapper = styled.div`
    margin: 0px auto;
    position: absolute;
    bottom: -18px;
    left:45%;
`

function OfferInfo({
  employeeRank,
  setShowModifyModal,
  index,
  setCurrentIndex,
  productInfo,
}) {
  const [options, setOptions] = useState([]);
  const [isExpand, setIsExpand] = useState(false);
  const ghsPlan = productInfo?.filter((item) => item.optionType === "GHS_PLAN");
  const gpspPlan = productInfo?.filter(
    (item) => item.optionType === "GPSP_PLAN"
  );
  const gtlPlan = productInfo?.filter((item) => item.optionType === "GTL_PLAN");
  const currentGHSIndex = ghsPlan.findIndex(
    (item) => item.optionName === employeeRank.ghsPlan
  );
  const currentGPSPIndex = gpspPlan.findIndex(
    (item) => item.optionName === employeeRank.gpspPlan
  );
  const currentGTLIndex = gtlPlan.findIndex(
    (item) => item.optionName === employeeRank.gtl
  );

  const convertToThousandSeperator = (data)=>{
    const parsedData = parseFloat(data);
    if (isNaN(parsedData)) {
      return 0; // or any other desired behavior for invalid data
    }
    return addThousandSeparator(parsedData.toFixed(2));
  }

  const getOfferDescriptions = (data) => [
    {
      name: "Medical Card Annual Limit",
      desc: ghs_GetAnnualLimitValue(data?.ghsPlan),
      percentage: (100 * currentGHSIndex) / (ghsPlan.length - 1),
      state: "Collapse",
      child: [
        {
          name: "Daily Room & Board",
          desc: GetDailyRoomAndBoard(data?.ghsPlan),
          state: "Collapse",
        },
        // {
        //   name: "Government Hospital Daily Cash Allowance",
        //   desc: GetMedicalFixedValue(data?.ghsPlan)[1],
        //   state: "Expand",
        // },
        {
          name: "3 Years premium Guarantee with Activ8",
          desc: data?.ghsType === "3YR" ? "Yes" : "No",
          state: "Expand",
        },
      ],
    },
    {
      name: "Outpatient Clinical Annual Limit (GP)",
      desc: gp_GetAnnualLimitValue(data.gpspPlan),
      percentage: data.gpspPlan !== "Plan0" ? 100 : 0,
      state: "Collapse",
      child: [
        {
          name: "Specialist Care (SP) Overall Annual Limit",
          desc:sp_GetAnnualLimitValue(data.gpspPlan),
          state: "Collapse",
        },
        {
          name: "Clinic Visit Approach",
          desc: data?.gpspType,
          state: "Expand",
        },
      ],
    },
    {
      name: "Death & Disability Sum Insured",
      desc: gtl_GetAnnualLimitValue(data?.gtl),
      percentage: (100 * currentGTLIndex) / (gtlPlan.length - 1),
      state: "Collapse",
    },
  ];

  const getClassNameFromIndex = (rank) => {
    if (rank % 3 === 1) {
      return {
        name: `Employee rank #${rank}`,
        labelClass: "tune-card-label-text-1",
        order: `#${rank}`,
        headerClass: "tune-card-1",
        orderClass: "text-primary",
        progressClass: "tune-e-rank-1",
      };
    } else if (rank % 3 === 2) {
      return {
        name: `Employee rank #${rank}`,
        order: `#${rank}`,
        labelClass: "tune-card-label-text-2",
        headerClass: "tune-card-2",
        orderClass: "text-rank-2",
        progressClass: "tune-e-rank-2",
      };
    } else if (rank % 3 === 0) {
      return {
        name: `Employee rank #${rank}`,
        order: `#${rank}`,
        labelClass: "tune-card-label-text-3",
        headerClass: "tune-card-3",
        orderClass: "text-rank-3",
        progressClass: "tune-e-rank-3",
      };
    }
  };

  const currentRankOptions = getClassNameFromIndex(index + 1);
  return (
    <Wrapper className="max-width-input">
      <div
        className={`pb-3 text-center text-bold text-xx-large ${currentRankOptions.labelClass}`}
      >
        <span>{currentRankOptions?.name}</span>
      </div>
      <MainDataWrapper
        span={24}
      >
        <Header
          className={`${currentRankOptions?.headerClass} px-2 py-2 ww-100`}
        >
        <div className="text-bold d-flex-c mr-3" >
        <div className="d-flex" style={{ fontSize: "14px", textDecoration: 'line-through' }}>
          RM {convertToThousandSeperator(employeeRank?.totalPremiumPayable)}
        </div>
          <div className="d-flex" style={{ fontSize: "28px" }}>
            RM {convertToThousandSeperator(employeeRank?.totalPremiumPayableNett)} <br />
              <Tooltip
                placement="topRight"
                title={
                  <div><RedInfoIcon height={10} width={10} /> The Premium shown is<br/>Annual Premium + MCO Fees* + Wellness Fees* <br/>(*If applicable)</div>
                }
                color={"#fff"}
                showArrow={false}
                overlayClassName="text-x-small budget-offer-tooltip"
                overlayInnerStyle={{color:"black"}}
              >
                <InfoIcon height={15} width={15} />
              </Tooltip>
            </div>
            <span className="text-x-small text-light">Per Employee</span>
          </div>
          <StyledEditButton
            className="cursor-pointer d-flex text-small"
            onClick={() => {
              setCurrentIndex(index);
              setShowModifyModal(true);
            }}
          >
            Customise
            <EditIcon height={15} width={15} className="mx-1" />
          </StyledEditButton>
        </Header>
        <Row className="px-3 py-3">
          {getOfferDescriptions(employeeRank)
            ?.filter((item) => {
              if (isExpand) {
                return item;
              }
              return item.state === "Collapse";
            })
            .map((item, index) => (
              <>
                <div
                  key={`${item.name}_index`}
                  className="progress-wrapper d-flex my-1"
                >
                  <Col span={18}>
                    <ProgressText className="px-2">{item.name}</ProgressText>
                    <Progress
                      percent={item.percentage}
                      showInfo={false}
                      className={currentRankOptions?.progressClass}
                    />
                  </Col>
                  <Col span={6}>
                    <DescriptionText className="text-x-small">
                      {item.desc}
                    </DescriptionText>
                  </Col>
                </div>
                {item.child
                  ?.filter((item) => {
                    if (isExpand) {
                      return item;
                    }
                    return item.state === "Collapse";
                  })
                  .map((child) => (
                    <Row className="w-100 text-gray">
                      <Col span={18}>
                        <ProgressText className="px-2">
                          {child.name}
                        </ProgressText>
                      </Col>
                      <Col span={6}>
                        <DescriptionText className="text-x-small">
                          {child.desc}
                        </DescriptionText>
                      </Col>
                    </Row>
                  ))}
              </>
            ))}
          <ExpandCollapseWrapper>
            {isExpand ? (
              <PlanExpandIcon
                style={{ height: "1.5rem", width: "1.5rem" }}
                onClick={() => setIsExpand(!isExpand)}
              ></PlanExpandIcon>
            ) : (
              <PlanCollapseIcon
                style={{ height: "1.5rem", width: "1.5rem" }}
                onClick={() => setIsExpand(!isExpand)}
              ></PlanCollapseIcon>
            )}
          </ExpandCollapseWrapper>
        </Row>
      </MainDataWrapper>
    </Wrapper>
  );
}

export default OfferInfo;
