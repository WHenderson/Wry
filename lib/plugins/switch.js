const R = require('ramda');

module.exports = {
  name: 'switch',
  func: function (...cases) {

    // normalize cases
    const $cases = [];
    for (const $case of cases) {
      if ($case && $case.resolve) {
        $cases.push({$then: $case});
        break;
      }

      const { $if, $then } = $case;
      if (!$then || !$then.resolve)
        throw new Exception('Unable to resolve $then in case statement');

      if (typeof $if === undefined) {
        $cases.push({$then: $then});
        break;
      }

      $cases.push($case);
    }

    // look for dead items
    if ($cases.length !== cases.length)
      throw new Exception('Unreachable items in switch');

    // add generic default if required
    if ($cases.length < 1 || $cases[$cases.length - 1].$if !== undefined)
      $cases.push({ $then: this.pass() });

    return {
      func: async function (files) {

        const items = $cases.map(($case) => ({ $case: $case, $inputs: [] }));

        for (const file of files) {
          for (const $case of $cases) {
            if ((item.$case.$if === undefined) || (item.$case.$if(file))) {
              item.$inputs.push(file);
              break;
            }
          }
        }

        let output = [];
        for (const item of items) {
          output = output.concat(await item.$case.$then.resolve(item.$inputs));
        }

        return output;
      },
      graph: {
        type: 'todo'
      }
    }
  }
};