export default custom_form = {
    fields: [
        {
          type: 'Switch',
          name: 'termsAndConditionsAccepted',
          label: 'Accept terms and conditions',
          validate: null,
          key: 12123,
          initial: false,
          enable: true,
        },
  
        {
          type: 'Switch',
          name: 'bogus',
          label: 'Test!',
          validate: JSON.stringify(["if", ["=", "value", true], 
                                      ["`", "This must be false"]]),
          key: 34245,
          initial: false,
          enable: true,
        },   
  
        {
          type: 'Switch',
          name: 'bogus2',
          label: 'Third time is a charm',
          validate: JSON.stringify(["if", ["=", "value", false], 
                                      ["`", "This must be true"]]),
          key: 3424,
          initial: true,
          enable: JSON.stringify(["let", 
                                    ["target", ["get", "values", ["`", "termsAndConditionsAccepted"]]],
                                    "target"]),
        },   

        {
          type: 'TextInput',
          name: 'some_text',
          label: 'Where we are going we need no labels!',
          validate: null,
          key: 342345,
          initial: 'Fill this!',
          enable: JSON.stringify(["let", 
                                    ["target", ["get", "values", ["`", "termsAndConditionsAccepted"]]],
                                    "target"]),
        },   

      ]
  }