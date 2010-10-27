Cimplate
====

HTML Templates written with CSS selectors.

  * Scaffolds
  * Templates
  * Data-binds

I'm working on this for the next 2 to 3 weeks.

What I don't get done in that time should be finished by the end of the year.

Example
====

This is just a rough sketch of where the current implemantion is headed. It's slightly different right now.

    var myCimplateForm, myCimplateField, myDocument, myDb;

    myCimplateForm = [
      {"form#register.person.float": [
        {"span.person_form": "Delete Me"},
        {"input.person_[type=submit]": "Save"}
      ]}
    ];

    myCimplateField = [
      {"#register > div.person_form": [
        {"span.person_cimpl": "{value}"},
        {"label.person_meta[for={keyname}]": "{bizname}: "},
        {"input.person_data[name={keyname}]": "Ex: {example}"},
        {"div.person_meta.hidden.hint": "{hint}"}
      ]},
    ];

    // Document used to describe data
    myDocument = [
      personType: {
        parentOf: ['person'],
        duckType: function (item, key, collection) {
          return item.first && item.last;
        }
      }
      person: {
        bizname: "Person",
        parentOf: ['first','last'],
        cimpl: myCimplateForm, 
        bind: function (collection) {
          $.post('/path/to/couch', collection, function() {/* do stuff*/})
        }
      },
      first: {
        bizname: "First",
        example: "John",
        hint: "You know; what your mom calls you. Try typing that in."
        cimpl: [
          myCimplateField[0],
          {"div#other_random_div_on_other_side_of_page": "{first}"}
        ]
      },
      last: {
        bizname: "Last",
        example: "Doe",
        cimpl: myCimplateField
      }
    ];

    myDb = [
      {
        // these are the {value} referred to above
        first: "Jack",
        last: "Daniels"
      },
      {
        first: "Sarah",
        last: "Lee"
      },
      {
        first: "Spot",
        specialAbility: "bark"
      },
    ];


Scaffolding:

This is automatically produced only when the scaffold directive is issued.

Your designer can start with this and then you can edit the cimplate to reflect the changes.

The data is automatically entered from random objects in your db.

    <form id="register" class="person">
      <div class="person_form">
        <span class="person_cimpl">Jack</span>
        <label for="first" class="person_meta">First: </label>
        <input name="first" class="person_data" value="Ex: John"/>
        <div class="person_meta hidden hint">You know; what your mom calls you. Try typing that in.</div>

        <span class="person_cimpl">Lee</span>
        <label for="last" class="person_meta">Last: </label>
        <input name="last" class="person_data" value="Ex: Doe"/>
      </div>  
    </form>
    <div id="other_random_div_on_other_side_of_page"><span>Jack</span></div>

Templating:

Cimplate knows to treat arrays as arrays and omit empty fields when appropriate.

It's up to you, of course, to make sure that your input field are hidden and displayed as appropriate.

    <form id="register" class="person">
      <div class="person_form">
        <span class="person_cimpl">Jack</span>
        <label for="first" class="person_meta">First: </label>
        <input name="first" class="person_data" value="Ex: John"/>
        <div class="person_meta hidden hint">You know; what your mom calls you. Try typing that in.</div>

        <span class="person_cimpl">Daniels</span>
        <label for="last" class="person_meta">Last: </label>
        <input name="last" class="person_data" value="Ex: Doe"/>
      </div>  

      <div class="person_form">
        <span class="person_cimpl">Sarah</span>
        <label for="first" class="person_meta">First: </label>
        <input name="first" class="person_data" value="Ex: John"/>
        <div class="person_meta hidden hint">You know; what your mom calls you. Try typing that in.</div>

        <span class="person_cimpl">Lee</span>
        <label for="last" class="person_meta">Last: </label>
        <input name="last" class="person_data" value="Ex: Doe"/>
      </div>  
    </form>
    <div id="other_random_div_on_other_side_of_page">Jack</div>

Data Binding:

Since we already have the css selector and know some of the semantics
(an input changes on keyup, a form changes on submit)
we bind appropriatly to any structure that implements both `cimpl` and `bind` 


Caveats
----

You cannot have a plain text node. You must at least have a `span`. Otherwise the code looks like this:

This implementation is not finished yet, but it is started and the concept works.

Resources
====

  * Douglas Crockford's supplant
  * MooTools' Slick.Parser used as CSS3 parser
  * jQuery + Node / Browser for scaffolding DOM
  * CouchDB as Document/Map/Reduce inspiration (not actually used)
