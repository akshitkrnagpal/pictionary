import { Router, useParams } from '@reach/router';
import React, { useEffect, useRef } from 'react';
import { DOMAIN } from '../../constants/config';

import * as JitsiMeetExternalAPI from '../../external_api';

const Room = () => {
  const container = useRef();
  const { roomName } = useParams();

  useEffect(() => {
    const api = new JitsiMeetExternalAPI(DOMAIN, {
      parentNode: container.current,
      roomName,
      configOverwrite: {
        startWithAudioMuted: true,
        startWithVideoMuted: true,
      },
      interfaceConfigOverwrite: {
        DEFAULT_LOGO_URL: '',
        DISABLE_DOMINANT_SPEAKER_INDICATOR: true,
        DISABLE_FOCUS_INDICATOR: true,
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        TOOLBAR_ALWAYS_VISIBLE: true,
        VERTICAL_FILMSTRIP: false,
        filmStripOnly: true,
        REMOTE_THUMBNAIL_RATIO: 16 / 9,
        HIDE_INVITE_MORE_HEADER: true,
      },
    });

    api.on('videoConferenceJoined', console.log);
    api.on('readyToClose', console.log);
    api.on('suspendDetected', console.log);
  }, [roomName]);

  return (
    <div className='flex flex-col h-screen w-screen bg-conference'>
      <div className='flex-1 px-8 py-8'>
        <canvas className='w-full h-full bg-white rounded'></canvas>
      </div>
      <div className='overflow-hidden' style={{ height: 175 }}>
        <div
          ref={container}
          style={{ transform: 'translateY(-95px)', height: 175 + 95 }}
        />
      </div>
    </div>
  );
};

const App = () => (
  <Router>
    <Room path=':roomName' />
  </Router>
);

export default App;
