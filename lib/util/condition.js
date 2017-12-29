class ConditionException extends TypeError {
  constructor(value, message = 'Condition is not a function', ...args) {
    super(message, ...args);
    this.value = value;
  }
}

class Condition {
  static isCondition(condition) {
    return (typeof condition === 'function');
  }
  static assertCondition(condition) {
    if (!Condition.isCondition(condition))
      throw new ConditionException(condition);
  }
  static getName(condition) {
    Condition.assertCondition(condition);
    return condition.name;
  }
  static getDescription(condition) {
    Condition.assertCondition(condition);
    return condition.description || (((condition.toString()?.length || 0) < 80) && condition.toString());
  }
}

module.exports = Condition;