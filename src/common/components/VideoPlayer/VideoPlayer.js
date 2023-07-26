import { Modal } from "antd";
import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { CloseOutlined } from "@ant-design/icons";

function VideoPlayerModal({ show, setShow, url, title, description, footer }) {
    const [play, setPlay] = useState(true);

  const hideModal = () => {
    console.log("hi")
    setPlay(false);
    //setShow(false);
  };

  useEffect(() => {
    !play && setShow(false);
    return setPlay(true);
  }, [play])

  return (
    <Modal
      open={show}
      className="video-modal text-white d-flex flex-start"
      onCancel={hideModal}
      footer={null}
    >
      <div className="justify-content-between d-flex w-100">
        <div>
          <h2 className="text-bold mb-0 text-white">{title}</h2>
          <p className="text-bold mb-0 text-white">{description}</p>
        </div>
        <div>
          <CloseOutlined
            style={{ fontSize: 30, verticalAlign: "middle" }}
            onClick={hideModal}
          />
        </div>
      </div>

      <ReactPlayer
        url={url}
        playing={play}
        width="100%"
        height="100%"
        controls={true}
        className="react-player"
      />
      <p className="text-small text-white">{footer}</p>
    </Modal>
  );
}

export default VideoPlayerModal;
