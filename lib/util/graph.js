class Node {
  constructor({type, name, description}) {
    this.type = type;
    this.name = name;
    this.description = description;
  }
}

class StartNode extends Node {
  constructor({type = 'start', name, description}) {
    super(type, name, description);
  }
}

class DiscardNode extends Node {
  constructor({type = 'start', name, description}) {
    super(type, name, description);
  }
}

class SourceNode extends Node {
  constructor({type = 'start', name, description}) {
    super(type, name, description);
  }
}

class TargetNode extends Node {
  constructor({type = 'start', name, description}) {
    super(type, name, description);
  }
}

class FilterNode extends Node {
  constructor({type = 'start', name, description}) {
    super(type, name, description);
  }
}

class ConditionNode extends Node {
  constructor({type = 'start', name, description}) {
    super(type, name, description);
  }
}

class IfNode extends ConditionNode {
  constructor({type = 'start', name, description}) {
    super(type, name, description);
  }
}


module.exports = {
  Node: Node
};