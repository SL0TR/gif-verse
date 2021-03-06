import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Slider, Col, Typography, Row } from 'antd';
import { FormattedMessage } from 'react-intl';

function VideoPlayback({
  video,
  videoEndDuration,
  setVideoEndDuration,
  videoStartDuration,
  setVideoStartDuration,
}) {
  const [vidContainerWidth, setVideContainerWidth] = useState();
  const [vidContainerHeight, setVideContainerHeight] = useState();
  const vidContainerRef = useRef(null);
  const [videoDuration, setVideoDuration] = useState();

  console.log({ videoStartDuration, videoEndDuration, videoDuration });

  function handleVideoMetaLoad(e) {
    setVideoDuration(Math.round(e.target.duration));
  }

  function handleSlideChange([start, end]) {
    setVideoStartDuration(start);
    setVideoEndDuration(end);
  }

  useEffect(() => {
    const videoEl = document.querySelector('video');

    if (vidContainerRef.current) {
      setVideContainerWidth(vidContainerRef.current?.offsetWidth - 10);
      setVideContainerHeight(vidContainerRef.current?.offsetWidth / 1.78);
      videoEl.addEventListener('loadedmetadata', handleVideoMetaLoad);
    }

    return () =>
      videoEl.removeEventListener('loadedmetadata', handleVideoMetaLoad);
  }, [vidContainerRef, video]);

  return (
    <>
      <Col
        ref={vidContainerRef}
        xl={{ span: 15 }}
        xs={{ span: 24 }}
        align="middle"
      >
        <video
          controls
          height={vidContainerHeight}
          width={vidContainerWidth}
          src={URL.createObjectURL(video)}
        />
      </Col>
      {videoDuration && (
        <Col xl={{ span: 15 }} xs={{ span: 24 }} align="middle">
          <Typography.Title level={4}>
            <FormattedMessage id="Crop GIF" />
          </Typography.Title>
          <Slider
            value={[videoStartDuration, videoEndDuration || videoDuration]}
            onChange={handleSlideChange}
            range={{ draggableTrack: true }}
            defaultValue={[videoStartDuration, videoDuration]}
            min={0}
            max={videoDuration <= 10 ? videoDuration : 10}
          />
          <Row justify="space-between">
            <Col>
              <Typography.Paragraph>
                <FormattedMessage id="Gif start" />
                {`: ${videoStartDuration || '0'}s`}
              </Typography.Paragraph>
            </Col>
            <Col>
              <Typography.Paragraph>
                <FormattedMessage id="Gif end" />
                {`: ${
                  videoEndDuration || (videoDuration <= 10 ? videoDuration : 10)
                }s `}
                <FormattedMessage id="(Max 10s)" />
              </Typography.Paragraph>
            </Col>
          </Row>
        </Col>
      )}
    </>
  );
}

VideoPlayback.propTypes = {
  video: PropTypes.object,
  videoEndDuration: PropTypes.number,
  setVideoEndDuration: PropTypes.func,
  videoStartDuration: PropTypes.number,
  setVideoStartDuration: PropTypes.func,
};

export default VideoPlayback;
