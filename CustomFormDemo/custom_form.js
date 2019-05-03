const _ = JSON.stringify;

export default custom_form = {
    fields: [
        {
          type: 'Switch',
          name: 'termsAndConditionsAccepted',
          label: 'Accept terms and conditions',
          validate: _(null),
          initial: false,
          enable: _(true),
        },
  
        {
          type: 'Switch',
          name: 'bogus',
          label: 'Test!',
          validate: _(["if", ["=", "value", true], 
                        ["`", "This must be false"]]),
          initial: false,
          enable: _(true),
        },   
  
        {
          type: 'Switch',
          name: 'bogus2',
          label: 'Third time is a charm',
          validate: _(["if", ["=", "value", false], 
                        ["`", "This must be true"]]),
          initial: true,
          enable: _(["let", 
                      ["target", ["get", "values", ["`", "termsAndConditionsAccepted"]]],
                      "target"]),
        },   

        {
          type: 'TextInput',
          name: 'some_text',
          label: 'Where we are going we need no labels!',
          validate: _(null),
          initial: 'Fill this text!',
          enable: _(true)
          // enable: _(["get", "values", ["`", "termsAndConditionsAccepted"]]),
        },   

        {
          type: 'FieldArray',
          name: "Outer",
          label: "Manage your outer toggles",
          max: 2,    
          enable: _(true),
          fields:[
            {
              type: 'Switch',
              name: 'sa',
              label: 'Outer toggle',
              validate: _(["if", ["=", "value", false], 
                          ["`", "This must be true"]]),
              initial: true,
              enable: _(true),
            },

            {
              type: 'FieldArray',
              name: "Inner",
              label: "Manage your inner toggles",
              max: 5,    
              enable: _(true),
              fields:[
                {
                  type: 'Switch',
                  name: 'sa',
                  label: 'Inner toggle',
                  validate: _(["if", ["=", "value", false], 
                              ["`", "This must be true"]]),
                  initial: true,
                  enable: _(true),
                },
              ],
              empty: "No inner toggles"
            }
          ],
          empty: "No outer toggles"
        }
      ]
  }