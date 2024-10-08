// 密码校验
const regs = {
  email: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/,
  number: /^([0]|[1-9][0-9]*)$/,
  password: /^(?=.*\d)(?=.*[a-zA-Z])[\da-zA-Z~!@#$%^&*_]{8,}$/,
  version: /^[0-9\.]+$/,
  phone: /^1[3-9]\d{9}$/,
};
const verify = (rule, value, reg, callback) => {
  if (value) {
    if (reg.test(value)) {
      callback();
    } else {
      callback(new Error(rule.message));
    }
  } else {
    callback();
  }
};

export default {
  email: (rule, value, callback) => {
    return verify(rule, value, regs.email, callback);
  },
  number: (rule, value, callback) => {
    return verify(rule, value, regs.number, callback);
  },
  password: (rule, value, callback) => {
    return verify(rule, value, regs.password, callback);
  },
  version: (rule, value, callback) => {
    return verify(rule, value, regs.version, callback);
  },
  phone: (rule, value, callback) => {
    return verify(rule, value, regs.phone, callback);
  },
};
