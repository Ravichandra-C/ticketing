const natsWrapper = {
  client: {
    publish: jest
      .fn()
      .mockImplementation(
        (subject: string, clientId: string, callbackFn: any) => {
          callbackFn();
        }
      ),
    on: jest.fn(),
  },
};
export default natsWrapper;
