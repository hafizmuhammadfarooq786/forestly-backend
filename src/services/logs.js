class LogService {
  /* 
    Show Logs ( IF TRUE )
  */
  display(data) {
    if (process.env.LOG_STATUS) {
      console.log("TCL: Response -> ", data);
    }
  }
}

module.exports = new LogService();
