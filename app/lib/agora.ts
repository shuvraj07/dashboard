import AgoraRTC, { IAgoraRTCClient, ILocalAudioTrack } from "agora-rtc-sdk-ng";

export const createAgoraClient = (): IAgoraRTCClient => {
  return AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
};

export type AgoraContextType = {
  client: IAgoraRTCClient;
  localAudioTrack?: ILocalAudioTrack;
};
