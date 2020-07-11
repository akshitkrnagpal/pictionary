const throttle = (callback, delay) => {
  let previousCall = new Date().getTime();
  return (...args) => {
    let time = new Date().getTime();
    if (time - previousCall >= delay) {
      previousCall = time;
      callback.apply(null, args);
    }
  };
};

export default throttle;
