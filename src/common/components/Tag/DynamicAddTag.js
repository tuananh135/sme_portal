import { useEffect, useRef, useState } from "react";
import "antd/dist/antd.min.css";
import { Input, Row, Tag, Tooltip } from "antd";
import styled from "styled-components";
import { REGEX } from "common/constants/constants";

//#region Custom theme
const NewTagCustom = styled(Row)`
  background: #fff;
  border-style: dashed;
  border: 0px;
  font-size: 65%;
  left: 0px;
  right: 0px;
  width: fit-content;
  margin: 8px;
  align-self: center;
`;
const TagInputCustom = styled(Input)`
  width: 70vw;
  vertical-align: top;
  padding: 5px !important;
  border-color: ${({ status }) => (status === "error" ? "red" : "#d9d9d9")}; // Change the border color based on the status prop
`;

const TagInput = ({ status, errorMessage, ...rest }) => {
  return (
    <>
      <TagInputCustom status={status} {...rest} />
      {errorMessage && <span style={{ color: "red" }}>{errorMessage}</span>}
    </>
  );
};

const EditTagCustom = styled(Tag)`
  user-select: none;
  border-radius: 15;
  background-color: #fdedeb;
  border: 0;
  padding: 5px 10px;
  margin: 5px 5px;
  width: max-content;
  .ant-tag-close-icon {
    background-color: red;
    color: white;
    border-radius: 5px;
    svg {
      font: menu;
    }
  }
`;
//#endregion

export default function DynamicAddTag({
  employeeEmails,
  setEmployeeEmails,
  currentRank,
  condition,
  maxLength = 20,
}) {
  const [inputVisible, setInputVisible] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [inputErrorValue, setInputError] = useState("");
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState("");

  const showInput = () => {
    setInputVisible(true);
  };
  const handleClose = (removedTag) => {
    const newTags = employeeEmails.filter((tag) => tag !== removedTag);
    setEmployeeEmails(newTags);
  };

  const isValidEmail = (email) => {
    return REGEX.EMAIL.test(email);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (!isValidEmail(inputValue)) {
        setInputError("Please enter a valid email");
      }
      setInputError(""); 
  };

  const handleEditInputChange = (e) => {
    if (!isValidEmail(inputValue)) {
      setInputError("Please enter a valid ");
    }
    setInputError(""); 
  };
  
  const handleEditInputConfirm = (e) => {
    if (!inputValue) return;
    const emails = inputValue.split(';').map(email => email.trim());
    const invalidEmails = emails.filter(email => !isValidEmail(email));
    if (invalidEmails.length) {
      setInputError("Please enter valid email: " + invalidEmails.join(", "));
      return;
    }
    const existingEmails = employeeEmails.map(item => item.email);
    const newEmails = emails.filter(email => !existingEmails.includes(email)).map(email => ({ email, rank: currentRank }));
    setEmployeeEmails(prev => [...prev, ...newEmails]);
    setInputError("");
  };
  return (
    <div className="d-flex-c w-100">
      {!inputVisible && (
        <NewTagCustom onClick={showInput}>
          Type email here or copy and paste from the clipboard...
        </NewTagCustom>
      )}
      {inputVisible && (
        <TagInput
          status={inputErrorValue || !isValidEmail(inputValue) ? "error" : "success"}
          type="text"
          size="small"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={(e)=> handleEditInputConfirm(e)}
          onPressEnter={(e)=> handleEditInputConfirm(e)}
          className="w-100"
          errorMessage={inputErrorValue ? inputErrorValue : null} 
        />
      )}
      <div className="text-left">
        {employeeEmails.filter((item) => item.rank === currentRank)?.map((emp, index) => {
          if (editInputIndex === index) {
            return (
              <TagInput
                key={index}
                size="small"
                status={inputErrorValue || !isValidEmail(inputValue) ? "error" : "success"}
                value={editInputValue}
                onChange={handleEditInputChange}
                onBlur={handleEditInputConfirm}
                onPressEnter={handleEditInputConfirm}
                style={{ marginLeft: "8px" }}
                errorMessage={inputErrorValue ? inputErrorValue : null} 
              />
            );
          }
          const isLongTag = emp.length > maxLength;
          const tagElem = (
            <EditTagCustom
              style={{
                borderRadius: 15,
                backgroundColor: "#fdedeb",
                border: 0,
                padding: "5px 10px",
                margin: "5px 5px",
                width: "max-content",
              }}
              key={index}
              closable={true}
              onClose={() => handleClose(emp)}
            >
              <span
                onDoubleClick={(e) => {
                  setEditInputIndex(index);
                  setEditInputValue(emp);
                  e.preventDefault();
                }}
              >
                {isLongTag ? `${emp.slice(0, maxLength)}...` : emp?.email}
              </span>
            </EditTagCustom>
          );
          return isLongTag ? <Tooltip key={index}>{tagElem}</Tooltip> : tagElem;
        })}
      </div>
    </div>
  );
}
