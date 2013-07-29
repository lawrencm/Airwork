Alfresco.forms.validation.mergeDocs = function mergeDocs(field, args, event, form, silent, message) {
  var ok = (field.value=="") || field.value.match("^\\d{4}\\/\\d{4}$");

  var valid = ok != null && ok;

  if (!valid) {
     YAHOO.util.Dom.setStyle(field.id, "border", "2px solid red");     
  }
  else {
     YAHOO.util.Dom.setStyle(field.id, "border", "");
  }

  // Inform the user if invalid
  if (!valid && !silent && form)
  {
     var msg = "The number must match the pattern 1234/5678.";
     form.addError(form.getFieldLabel(field.id) + " " + msg, field);
  }  

  return valid; 
};