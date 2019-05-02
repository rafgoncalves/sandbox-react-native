const _ = JSON.stringify;

export default custom_form = {
    fields: [
        // {
        //   type: 'Switch',
        //   name: 'termsAndConditionsAccepted',
        //   label: 'Accept terms and conditions',
        //   validate: _(null),
        //   key: 1,
        //   initial: false,
        //   enable: _(true),
        // },
  
        // {
        //   type: 'Switch',
        //   name: 'bogus',
        //   label: 'Test!',
        //   validate: _(["if", ["=", "value", true], 
        //                 ["`", "This must be false"]]),
        //   key: 2,
        //   initial: false,
        //   enable: _(true),
        // },   
  
        // {
        //   type: 'Switch',
        //   name: 'bogus2',
        //   label: 'Third time is a charm',
        //   validate: _(["if", ["=", "value", false], 
        //                 ["`", "This must be true"]]),
        //   key: 3,
        //   initial: true,
        //   enable: _(["let", 
        //               ["target", ["get", "values", ["`", "termsAndConditionsAccepted"]]],
        //               "target"]),
        // },   

        // {
        //   type: 'TextInput',
        //   name: 'some_text',
        //   label: 'Where we are going we need no labels!',
        //   validate: _(null),
        //   key: 4,
        //   initial: 'Fill this!',
        //   enable: _(["get", "values", ["`", "termsAndConditionsAccepted"]]),
        // },   

        {
          type: 'FieldArray',
          name: "Toggles!",
          label: "Manage your toggles",
          key: 5,
          max: 5,    
          enable: _(true),
          fields:[
            {
              type: 'Switch',
              name: 'sa',
              label: 'My repeated toggle',
              validate: _(["if", ["=", "value", false], 
                          ["`", "This must be true"]]),
              initial: true,
              enable: _(true),
              key: 51
            },

            {
              type: 'FieldArray',
              name: "TogglesInner!",
              label: "Manage your toggles inner",
              key: 5,
              max: 5,    
              enable: _(true),
              fields:[
                {
                  type: 'Switch',
                  name: 'sa',
                  label: 'My repeated toggle inner',
                  validate: _(["if", ["=", "value", false], 
                              ["`", "This must be true"]]),
                  initial: true,
                  enable: _(true),
                  key: 51
                },
              ],
              empty: "No inner toggles yet"
            }
          ],
          empty: "No toggles yet"
        }
      ]
  }