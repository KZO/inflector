/**
 * Simple javascript inflector for node and the browser
 *
 * (c) 2015 KZO Innovations
 * License: MIT
 */
function Inflector () {
  this._rules = {
    plurals: [
      [/$/, 's'],
      [/s$/i, 's'],
      [/^(ax|test)is$/i, '$1es'],
      [/(octop|vir)us$/i, '$1i'],
      [/(octop|vir)i$/i, '$1i'],
      [/(alias|status)$/i, '$1es'],
      [/(bu)s$/i, '$1ses'],
      [/(buffal|tomat)o$/i, '$1oes'],
      [/([ti])um$/i, '$1a'],
      [/([ti])a$/i, '$1a'],
      [/sis$/i, 'ses'],
      [/(?:([^f])fe|([lr])f)$/i, '$1$2ves'],
      [/(hive)$/i, '$1s'],
      [/([^aeiouy]|qu)y$/i, '$1ies'],
      [/(x|ch|ss|sh)$/i, '$1es'],
      [/(matr|vert|ind)(?:ix|ex)$/i, '$1ices'],
      [/^(m|l)ouse$/i, '$1ice'],
      [/^(m|l)ice$/i, '$1ice'],
      [/^(ox)$/i, '$1en'],
      [/^(oxen)$/i, '$1'],
      [/(quiz)$/i, '$1zes']
    ],
    singular: [
      [/s$/i, ''],
      [/(ss)$/i, '$1'],
      [/(n)ews$/i, '$1ews'],
      [/([ti])a$/i, '$1um'],
      [/((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)(sis|ses)$/i, '$1sis'],
      [/(^analy)(sis|ses)$/i, '$1sis'],
      [/([^f])ves$/i, '$1fe'],
      [/(hive)s$/i, '$1'],
      [/(tive)s$/i, '$1'],
      [/([lr])ves$/i, '$1f'],
      [/([^aeiouy]|qu)ies$/i, '$1y'],
      [/(s)eries$/i, '$1eries'],
      [/(m)ovies$/i, '$1ovie'],
      [/(x|ch|ss|sh)es$/i, '$1'],
      [/^(m|l)ice$/i, '$1ouse'],
      [/(bus)(es)?$/i, '$1'],
      [/(o)es$/i, '$1'],
      [/(shoe)s$/i, '$1'],
      [/(cris|test)(is|es)$/i, '$1is'],
      [/^(a)x[ie]s$/i, '$1xis'],
      [/(octop|vir)(us|i)$/i, '$1us'],
      [/(alias|status)(es)?$/i, '$1'],
      [/^(ox)en/i, '$1'],
      [/(vert|ind)ices$/i, '$1ex'],
      [/(matr)ices$/i, '$1ix'],
      [/(quiz)zes$/i, '$1'],
      [/(database)s$/i, '$1']
    ],
    irregular: {
      person: 'people',
      man: 'men',
      child: 'children',
      sex: 'sexes',
      move: 'moves',
      cow: 'kine',
      zombie: 'zombies'
    },
    uncountable: {
      equipment   : true,
      information : true,
      rice        : true,
      money       : true,
      species     : true,
      series      : true,
      fish        : true,
      sheep       : true,
      jeans       : true,
      police      : true
    },
    irregularInverse: {}
  };

  for (var irregularKey in this._rules.irregular) {
    if (this._rules.irregular.hasOwnProperty(irregularKey)) {
      this._rules.irregularInverse[this._rules.irregular[irregularKey]] = irregularKey;
    }
  }
}

/**
 * @method plural
 * @param {RegExp} regex
 * @param {String} string
 */
Inflector.prototype.plural = function (regex, string) {
  this._rules.plurals.push([regex, string.toLowerCase()]);
}

/**
 * @method singular
 * @param {RegExp} regex
 * @param {String} string
 */
Inflector.prototype.singular = function (regex, string) {
  this._rules.singular.push([regex, string.toLowerCase()]);
}

/**
 * @method uncountable
 * @param {String} string
 */
Inflector.prototype.uncountable = function (string) {
  this._rules.uncountable[string.toLowerCase()] = true;
}

/**
 * @method irregular
 * @param {String} singular
 * @param {String} plural
 */
Inflector.prototype.irregular = function (singular, plural) {
  this._rules.irregular[singular.toLowerCase()] = plural;
  this._rules.irregularInverse[plural.toLowerCase()] = singular;
}

/**
 * @method pluralize
 * @param {String} word
 */
Inflector.prototype.pluralize = function (word) {
  return this.inflect(word, this._rules.plurals, this._rules.irregular);
}

/**
 * @method singularize
 * @param {String} word
 */
Inflector.prototype.singularize = function (word) {
  return this.inflect(word, this._rules.singular,  this._rules.irregularInverse);
}


/**
 * @protected
 *
 * @method inflect
 * @param {String} word
 * @param {Object} typeRules
 * @param {Object} irregular
 */
Inflector.prototype.inflect = function (word, typeRules, irregular) {
  var inflection, substitution, result, lowercase,
    isUncountable, isIrregular, rule;

  if (/^\s*$/.test(word)) {
    return word;
  }

  lowercase = word.toLowerCase();

  isUncountable = this._rules.uncountable[lowercase];
  if (isUncountable) {
    return word;
  }

  isIrregular = irregular && irregular[lowercase];
  if (isIrregular) {
    return isIrregular;
  }

  for (var i = typeRules.length, min = 0; i > min; i--) {
    inflection = typeRules[i - 1];
    rule = inflection[0];

    if (rule.test(word)) {
      break;
    }
  }

  inflection = inflection || [];

  rule = inflection[0];
  substitution = inflection[1];

  result = word.replace(rule, substitution);

  return result;

}

/**
 * Changes a word from camelCase to snake_case
 *
 * @param {String} string
 * @param {String} sep Change the seperator from '-'
 * @return {String} The snake_cased string
 */
Inflector.prototype.parameterize = function (string, sep) {
  if (typeof string !== 'string') {
    return string;
  }

  return string.replace(/(?:[A-Z]+|[0-9]+)/g, function (match, index) {
    return index === 0 ? match : (sep || '-') + match;
  }).toLowerCase();
}

/**
 * CamelCase a string.  Replaces spaces and dashes
 *
 * @param {String} string
 * @param {Boolean} upperFirst whether to capitalize the first character
 * @return {String} The camelCased string
 */
Inflector.prototype.camelize = function (string, upperFirst) {
  if (typeof string !== 'string') {
    return string;
  }

  return string.replace(/(?:^[-_\s]*|[-_\s]+)([A-Z\d])/gi, function (match, first, index) {
    return (!upperFirst && index === 0) ? first : first.toUpperCase();
  });
}



if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' && module.exports) {
    exports = module.exports = Inflector;
  }
  exports.Inflector = Inflector;
}
