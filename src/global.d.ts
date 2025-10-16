declare global {
    interface Window {
      Telegram: {
        WebApp: any;
      };
      ethereum?: any;
    }
  }
  export {};