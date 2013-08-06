(function() {


/**
 * register a client side action call
 */
  YAHOO.Bubbling.fire("registerAction", {
    //name the action
    actionName: "onActionCombineSelectedDocs",
    fn: function mycompany_onActionSendAsEmail(file) {
      /**
       * STATIC MIMETYPE of docx files
       * @type {String}
       */
      var MIME_TYPE = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

      /**
       * form service url
       * @type {[type]}
       */
      var templateUrl = YAHOO.lang.substitute(Alfresco.constants.URL_SERVICECONTEXT + "components/form?itemKind={itemKind}&itemId={itemId}&destination={destination}&mode={mode}&submitType={submitType}&showCancelButton=true", {
        itemKind: "type",
        itemId: "md:compoundDocScaffold",
        mode: "edit",
        destination: file.nodeRef,
        submitType: "json"
      });

      /**
       * noderef from context
       * @type {[type]}
       */
      var nr = file.nodeRef || "";
      // if coming from the select ,menu files will be an array
      // get the parent of the first item in the array
      if (typeof file.length != "undefined"){
          nr = file[0].parent.nodeRef || "";
      }


      /**
       * url to the webservice
       * @type {[type]}
       */
      var actionUrl = YAHOO.lang.substitute("{stem}slingshot/doclib/action/mergedocx?nodeRef={nodeRef}", {
        stem: Alfresco.constants.PROXY_URI,
        nodeRef: nr
      });

      /**
       * check to see if the file if the correct mimetype
       * @param  {nodeRef} file the file to check
       * @return {boolean}  
       */
      var checkFile = function(file) {
        if (file.node.mimetype == MIME_TYPE) {
          return true;
        } else {
          // console.log("is not ok");
          alert("The file \"" + file.displayName + "\" is not a valid *.docx file and will be removed from the list");
          return false;
        }
      };


      /**
       * the simple modal form
       * @type {SimpleDialogue}
       */
      var editDetails = new Alfresco.module.SimpleDialog(this.id + "-editDetails-" + Alfresco.util.generateDomId());

      editDetails.setOptions({
        width: "40em",
        templateUrl: templateUrl,
        actionUrl: actionUrl,
        destroyOnHide: true,
        title: "Select the Docx files to combine",
        method: Alfresco.util.Ajax.POST,
        // do a before show event to populate form data
        doBeforeDialogShow: {
          fn: function on_doBeforeDialogShow(p_form, p_dialog) {
            // set the form title
            var fileSpan = '<span class="light">Combine all files (*.docx)</span>';
            Alfresco.util.populateHTML([p_dialog.id + "-form-container_h", fileSpan]);

            
            // get a handle to the associations widget
            var widget = Alfresco.util.ComponentManager.get(p_dialog.id + "_assoc_md_generateFrom-cntrl");
            
            // if file is not an array it is a node
            // lookup the children or siblibgs of the node
            if (typeof file.length === "undefined") {
             var rest_endpoint = "";
              if (file.node.type !== "CM:folder") {
                rest_endpoint = file.parent.nodeRef.replace("://", "/");
              } else {
                rest_endpoint = file.jsNode.nodeRef.uri;
              };


              // forumlate the webservice url to get a list of children
              var docsUrls = YAHOO.lang.substitute("{stem}slingshot/doclib/doclist/cm:content/node/{nodeUri}", {
                stem: Alfresco.constants.PROXY_URI,
                nodeUri: rest_endpoint
              });


              // perform the service call
              Alfresco.util.Ajax.jsonGet({
                url: docsUrls,
                successCallback: {
                  fn: function ajax_success(response) {
                    var items = response.json.items;
                    var nodes = [];

                    for (var i = 0; i < items.length; i++) {
                      if (checkFile(items[i])) {
                        nodes.push(items[i]);
                      }
                    };

                    widget.selectItems(nodes.join(","));
                  },
                  scope: this
                },
                failureCallback: {
                  fn: function ajax_failure(response) {
                    console.log(response);
                  },
                  scope: this
                }
              });

            } else {
              // file is a list of noderefs
              var nodes = [];
              for (var i = 0; i < file.length; i++) {
                if (checkFile(file[i])) {
                  nodes.push(file[i].nodeRef);
                }
              };
              widget.selectItems(nodes.join(","));
            }

          },
          scope: this
        },


        //////////////////////////////////
        //  on call service is suuccess //
        //////////////////////////////////
        onSuccess: {
          fn: function dlA_onActionDetails_success(response) {
            console.log(response);
            // console.log("worked");
            Alfresco.util.PopupManager.displayMessage({
              text: response.json.message
            });

            YAHOO.Bubbling.fire("nodeCreated",
                     {
                        // name: response.json.name,
                        parentNodeRef: nr
                        // highlightFile: response.json.name
                     });

          },
          scope: this
        },

        ///////////////////////////////
        //on call service if failure //
        ///////////////////////////////


        onFailure: {
          fn: function dLA_onActionDetails_failure(response) {
            console.log(response);
            Alfresco.util.PopupManager.displayMessage({
              text: response.json.message
            });
          },
          scope: this
        }



      });

      // cshow the dialogue
      editDetails.show();

    }
  });

})();