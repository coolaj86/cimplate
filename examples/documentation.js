// TODO make seperate module
var Populate = function () {};
Populate.range = function (start, end) {
  // todo letters, numbers, alphanum
  var a = [];
  while (start <= end) {
    a.push(start);
    start += 1;
  }
  return a;
};
Populate.parentOf = function(collection, interests) {
  var a = [];
  interests.forEach(function (key) {
    var element = collection[key];
    element.keyname = key;
    a.push(element);
  });
  return a;
}

// TODO duck-types -> function
// * define a type by properties
// * map a function per type
// * how to handle custom (single-use) types?

(function () {
  // TODO find or create template pieces rather than create only
  var my_form_htpl = [
    "Top: {bizname}",
    {
      selector: "div.htpl_{keyname}",
      children: [
        "{bizname}:",
        {
          selector: "input.htpl_{keyname}[value='dummy data']"
        }
      ],
      input: true,
      output: false
    }
  ];

  // TODO How to add keyname?
  var MyModule = {};
  MyModule.documentation = {
      // Network
      ipaddr: {
          validation: function (item) {
            IPV4.ipv4_address(item);
          }.toString(),
          description: "A unique IP address in your network's static address range. Example: 192.168.1.15",
      },
      netmask: {
          validation: "IPV4.ipv4_netmask.apply(null, arguments)",
          description: "A base 256 description of the number of devices on your network. Example: 255.255.255.0",
          htpl: my_form_htpl
      },
      gateway: {
          suggested_values: ["192.168.0.1", "192.168.1.1", "10.0.0.1"],
          validation: "IPV4.ipv4_address.apply(null, arguments)",
          description: "The router through which all internet traffic goes. Example: 192.168.1.1",
      },
  };

  // Boiler Plate
  module.exports = MyModule;
  provide = ('undefined' !== typeof provide) ? provide : function() {};
  provide('MyModule');
}());
