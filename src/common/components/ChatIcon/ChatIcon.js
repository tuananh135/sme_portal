import { Image } from "antd";
import React, { useState } from "react";
import chatImage from "assets/images/icon-nena-vid.png";
import chatImageBig from "assets/images/nina-big.png";
import SubmitQuestionModal from "../Modal/SubmitQuestionModal";

function ChatIcon({ pageName="",width=50, showContactModal = true, smallIcon = true, style, ...rest }) {
  const [showModal, setShowModal] = useState(false)
  return (
    <>
      <Image
        preview={false}
        style={style}
        src={smallIcon ? chatImage:chatImageBig}
        width={width}
        onClick={()=> setShowModal(true)}
        {...rest}
      />
      {showContactModal && <SubmitQuestionModal show={showModal} setShow={setShowModal} pageName={pageName}/>}
    </>
  );
}

export default ChatIcon;
