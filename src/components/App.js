import { Router, useParams, Redirect } from '@reach/router';
import React, { useEffect, useRef } from 'react';
import { v4 as uuid } from 'uuid';
import { DOMAIN } from '../constants/config';
import Canvas from './Canvas';

let api = null;

const Room = () => {
  const container = useRef();
  const canvas = useRef();
  const { roomName } = useParams();

  useEffect(() => {
    const init = async () => {
      const module = await import('../external_api');
      const JitsiMeetExternalAPI =
        module.default || window.JitsiMeetExternalAPI;
      api = new JitsiMeetExternalAPI(DOMAIN, {
        parentNode: container.current,
        roomName,
        configOverwrite: {
          startWithAudioMuted: true,
          startWithVideoMuted: true,
          prejoinPageEnabled: false,
          openBridgeChannel: 'datachannel',
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
          MOBILE_APP_PROMO: false,
        },
      });

      api.on('videoConferenceJoined', console.log);
      api.on('readyToClose', console.log);
      api.on('suspendDetected', console.log);

      api.on('endpointTextMessageReceived', handleRecieveEvent);
      api.on('participantJoined', handleParticipantJoined);
    };

    init();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomName]);

  const handleParticipantJoined = ({ id }) => {
    if (!api._myUserID) return;

    // TODO find a better way.
    setTimeout(() => {
      sendEventData(id, {
        type: 'put',
        data: canvas.current.get(),
      });
    }, 5000);
  };

  const handleDraw = (lX, lY, cX, cY) => {
    const participants = Object.keys(api._participants);
    const myId = api._myUserID;

    participants.forEach(participant => {
      if (participant === myId) return;

      sendEventData(participant, {
        type: 'draw',
        data: { lX, lY, cX, cY },
      });
    });
  };

  const handleRecieveEvent = ({ data }) => {
    if (
      data &&
      data.eventData &&
      data.eventData.name === 'endpoint-text-message'
    ) {
      const event = JSON.parse(data.eventData.text);

      switch (event.type) {
        case 'draw':
          const { lX, lY, cX, cY } = event.data;
          canvas.current.draw(lX, lY, cX, cY);
          break;
        case 'put':
          canvas.current.put(event.data);
          break;
        default:
          console.warn('Received event that has no handler.');
      }
    }
  };

  const sendEventData = (id, event) => {
    api.executeCommand('sendEndpointTextMessage', id, JSON.stringify(event));
  };

  return (
    <div className='flex flex-col h-full w-full bg-conference'>
      <div className='flex-1 px-8 py-8 flex justify-center items-center'>
        <Canvas
          ref={canvas}
          className='bg-white rounded'
          onDraw={handleDraw}
          color='#000'
          width={4}
        />
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

const App = () => {
  const id = uuid();
  return (
    <Router>
      <Room path=':roomName' />
      <Redirect noThrow from='*' to={id} />
    </Router>
  );
};

export default App;
