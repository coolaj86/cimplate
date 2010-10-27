(function (undefined) {
  var MyModule = require('./lib/documentation');
  var $ = require('./vendor/jQuery'),
    Slick = require('./vendor/Slick.Parser').Slick;

  require('./vendor/remedial');

  // auto-write the html
  // manually modify the html
  // template the html
  // collect the data

  var form_htpl = [
    {
      selector: "form#template_{keyname}[method='put'][action='#form_{keyname}']",
      children: [
        {
          selector: "h2.title",
          children: ["Title: {bizname}"]
        },
        {
          selector: "span.template_data_{keyname}"
        },
        {
          selector: "input.template_{keyname}[type='submit'][value='Save']"
        }
      ],
      input: true,
      output: true
    }
  ];

  var option_htpl = [
    {
      selector: "div.htpl_{keyname}",
      children: [
        "{bizname}: ",
        {
          selector: "option.htpl_{keyname}[value='dummy data']"
        },
        " seconds"
      ],
      input: true,
      output: false
    }
  ];

  // TODO classname to scrape or not to scrape
  // TODO don't allow text fields -> must have at least span
  var field_htpl = [
    { 
      selector: "div.htpl_{keyname}",
      children: [ 
        "{bizname}: ",
        { 
          selector: "input.htpl_{keyname}[value='dummy data']"
        }
      ],
      input: true,
      output: false
    } 
  ];

  var htpl = function() {};
  htpl.select = {
    selector: "select.htpl_{keyname}[value='{keyname}']",
    children: [
      //function (item)
    ]
  }

  function populateFields(interests) {
    var values = [];
    interests.forEach(function (key) {
      var value = MyModule.documentation[key];
      value.keyname = key;
      value.htpl = value.htpl || value.suggested_values && option_htpl || field_htpl;
      values.push(value);
    });
    return values;
  }

  // TODO make 'populateFields' a 'parentOf' function
  // that gets called, which closes over the parent
  // this way the form stays in the linear space
  // rather than in a heirarchy. Map/Reduce like
  var form_directive = [
    {
      keyname: "network",
      bizname: "Network",
      values: populateFields(["ipaddr","netmask","gateway"]),
      htpl: form_htpl
    },
    {
      keyname: "ignoreme",
      bizname: "Ignore Me",
      values: populateFields([]),
    }
  ];
  // TODO simple way to get a list of all
  // keys in copy/paste fashion

  function normalizeExpression(exp) {
    return exp;
  }

  function createSelectBox(values) {
    // TODO handle arrays and maps of values also
    var sel = $('<select>');
    values.forEach(function (value) {
      var opt = $('<option>');
      opt.text(value);
      opt.attr('value', value);
      sel.append(opt);
    });
    return sel;
  }

  function createTemplate(item, element, parentSelector) {
    var css3;
    parentSelector = parentSelector || 'body';
    if ('string' === typeof element) {
      $(parentSelector).append(element.supplant(item));
      return;
    }

    if ('function' === typeof element) {
      // do something custom
      return;
    }

    css3 = Slick.parse(element.selector.supplant(item));
    //console.log(JSON.stringify(css3, null, '  '));
    css3.expressions.forEach(function (expression) {
      expression = normalizeExpression(expression);
      expression.forEach(function (subexp) {
        var el;
        el = $('<'+subexp.tag+'>');
        el.attr('id', subexp.id);
        (subexp.attributes||[]).forEach(function (attr) {
          el.attr(attr.key, attr.value);
        });
        (subexp.classList||[]).forEach(function (className) {
          el.addClass(className);
        });
        if (item.suggested_values) {
          // TODO adjust scope such that access to item selector is more sane.
          if ('option' === subexp.tag) {
            el.append(createSelectBox(item.suggested_values));
          }
        }

        $(parentSelector).append(el);
        if (element.children) {
          element.children.forEach(function (child) {
            createTemplate(item, child, parentSelector + ' > ' + element.selector.supplant(item));
          });
        }
      });
    });
  }

  form_directive.forEach(function (item) {
    item.htpl = item.htpl || form_htpl;
    if (item.values.length < 1) {
      return;
    }
    item.htpl.forEach(function (element) {
      createTemplate(item, element);
    });
    item.values.forEach(function (directive) {
      directive.htpl = directive.htpl || field_htpl;
      directive.bizname = directive.bizname || directive.keyname.toUpperCase();
      directive.htpl.forEach(function (element) {
        createTemplate(directive, element, item.htpl[0].children[1].selector.supplant(item));
      });
    });
  });
  console.log($("body").html());
}());
