const isValidTime = (time: string) => {
  const AmPmReg = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9] [APap][mM]$/;
  const timeReg = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
  return time.match(AmPmReg) || time.match(timeReg);
};

const isValidDate = (date: Date | '' | null | undefined) => {
  return date && Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date.getTime());
};

export { isValidDate, isValidTime };
