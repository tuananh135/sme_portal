import { Modal } from "antd";
import React from "react";

import { ReactComponent as Activ8Icon } from "assets/images/icon-3years-white.svg";
import { ReactComponent as VideoIcon } from "assets/images/icon-video.svg";
function Active8InfoModal({show, setShow}) {

    const hideModal = () => {
        setShow(false);
      };

  return (
    <Modal
      open={show}
      onOk={hideModal}
      onCancel={hideModal}
      // centered={true}
      okText="Ok"
      cancelText="Cancel"
      className="activ8-info w-90 d-flex max-width-input text-white"
      footer={null}
    >
     <Activ8Icon style={{marginTop:"48px", marginBottom:"48px"}}/>
      <div className="text-center text-x-large text-bold w-90 mb-5">
        Get into our wellness programme <br />and enjoy the same premium for 3 years!
      </div>
      <div className="text-center text-small w-90">
        Activ8 is a health-based rewards programme designed to motivate
        employees to stay healthy and be the best version of themselves to
        achieve more in life. Business owners can also use this opportunity as
        an engagement programme to encourage an active lifestyle among
        employees.
      </div>
      <VideoIcon className="mt-5 mb-2" style={{ height: 20, display : "none" }} />
      <div className="text-center text-small" style={{ display : "none" }}>
        Learn More about ACTIV8
      </div>
    </Modal>
  );
}

export default Active8InfoModal;
