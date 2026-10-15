export const AblyEvents = {
  messages: "messages",
  status: "status",
  readChat: "readChat",
  shiftStatus: "shiftStatus",
  radioCall: "radioCall",
  checkingActiveness: "checkingActiveness",
  activenessResponse: "activenessResponse",
  interCommunicationPlaySound: "interCommunicationPlaySound",
  interCommunicationCall: "interCommunicationCall",
  driverAssociation: "driverAssociation",
} as const;

export type AblyEvents = keyof typeof AblyEvents;

export const RadioCallTypeEvents = {
  calling: "CALLING",
  ended: "ENDED",
};

export type RadioCallTypeEvents = keyof typeof RadioCallTypeEvents;
