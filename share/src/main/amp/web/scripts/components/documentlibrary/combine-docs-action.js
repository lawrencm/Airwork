/**
 * Document Browse and Details page email actions
 *
 * @author ecmstuff.blogspot.com
 */
(function() {
    /**
     * Send email with document as attachment by calling Web Script
     *
     * @method onActionSendEmail
     * @param file the file to be sent with email (Object Literal)
     */
    // YAHOO.Bubbling.fire("registerAction", {
    //     actionName: "onActionCombineAllDocs",
    //     fn: function mycompany_onActionSendAsEmail(file) {

    //         console.log("testme2");
    //         console.log(file);

    //         var templateUrl = YAHOO.lang.substitute(Alfresco.constants.URL_SERVICECONTEXT + "components/form?itemKind={itemKind}&itemId={itemId}&destination={destination}&mode={mode}&submitType={submitType}&showCancelButton=true&formId={formId}", {
    //             itemKind: "type",
    //             itemId: "md:compoundDocScaffold",
    //             mode: "edit",
    //             destination: file.nodeRef,
    //             submitType: "json",
    //             formId: "mergedocxformall"
    //         });

    //         var actionUrl = YAHOO.lang.substitute("{stem}slingshot/doclib/action/mergedocx?nodeRef={nodeRef}&AllDocs=1", {
    //             stem: Alfresco.constants.PROXY_URI,
    //             nodeRef: file.nodeRef
    //         });



    //         var editDetails = new Alfresco.module.SimpleDialog(this.id + "-editDetails-" + Alfresco.util.generateDomId());

    //         editDetails.setOptions({
    //             width: "40em",
    //             templateUrl: templateUrl,
    //             actionUrl: actionUrl,
    //             destroyOnHide: true,
    //             doBeforeDialogShow: {
    //                 fn: function xxx(p_form, p_dialog) {
    //                     //console.log(p_form,p_dialog);
    //                     var fileSpan = '<span class="light">Combine all files (*.docx)</span>';

    //                     // console.log(p_form);
    //                     // Alfresco.util.populateHTML(["template_x002e_folder-actions_x002e_folder-details_x0023_default-editDetails-alf-id4-form-container_h","xxxxx"]);
    //                     console.log(p_dialog.id + "-form-container_h");

    //                     // "template_x002e_folder-actions_x002e_folder-details_x0023_default-editDetails-alf-id4"
    //                     // "template_x002e_folder-actions_x002e_folder-details_x0023_default-editDetails-alf-id4-form-container_h
    //                     Alfresco.util.populateHTML([p_dialog.id + "-form-container_h", fileSpan]);
    //                 },
    //                 scope: this
    //             },

    //             method: Alfresco.util.Ajax.POST,
    //             onSuccess: {
    //                 fn: function dlA_onActionDetails_success(response) {
    //                     console.log(response);
    //                     Alfresco.util.PopupManager.displayMessage({
    //                         text: this.msg("message.details.success")
    //                     });

    //                 },
    //                 scope: this
    //             },
    //             onFailure: {
    //                 fn: function dLA_onActionDetails_failure(response) {
    //                     Alfresco.util.PopupManager.displayMessage({
    //                         text: this.msg("message.details.failure")
    //                     });
    //                 },
    //                 scope: this
    //             }
    //         });

    //         // console.log("got here");
    //         editDetails.show();

    //     }
    // });



    YAHOO.Bubbling.fire("registerAction", {
        actionName: "onActionCombineSelectedDocs",
        fn: function mycompany_onActionSendAsEmail(file) {

            // console.log("testme2");
            // console.log(file);

            var templateUrl = YAHOO.lang.substitute(Alfresco.constants.URL_SERVICECONTEXT + "components/form?itemKind={itemKind}&itemId={itemId}&destination={destination}&mode={mode}&submitType={submitType}&showCancelButton=true", {
                itemKind: "type",
                itemId: "md:compoundDocScaffold",
                mode: "edit",
                destination: file.nodeRef,
                submitType: "json"

                // formId: "mergedocxform" 
            });

            var actionUrl = YAHOO.lang.substitute("{stem}slingshot/doclib/action/mergedocx?nodeRef={nodeRef}", {
                stem: Alfresco.constants.PROXY_URI,
                nodeRef: file.nodeRef
            });



            var rest_endpoint = "";
            if (file.node.type !== "CM:folder"){
                rest_endpoint = file.parent.nodeRef.replace("://","/");
            }else{
                rest_endpoint = file.jsNode.nodeRef.uri;
            };

            

            var docsUrls = YAHOO.lang.substitute("{stem}slingshot/doclib/doclist/cm:content/node/{nodeUri}", {
                stem: Alfresco.constants.PROXY_URI,
                nodeUri: rest_endpoint
            });

            //console.log(file.jsNode.nodeRef.uri);



            //console.log("testme3");

            var editDetails = new Alfresco.module.SimpleDialog(this.id + "-editDetails-" + Alfresco.util.generateDomId());

            editDetails.setOptions({
                width: "40em",
                templateUrl: templateUrl,
                actionUrl: actionUrl,
                destroyOnHide: true,
                title: "Select the Docx files to combine",
                method: Alfresco.util.Ajax.POST,
                doBeforeDialogShow: {
                    fn: function xxx(p_form, p_dialog) {
                        //console.log(p_form,p_dialog);
                        var fileSpan = '<span class="light">Combine all files (*.docx)</span>';

                        // console.log(p_form);
                        // Alfresco.util.populateHTML(["template_x002e_folder-actions_x002e_folder-details_x0023_default-editDetails-alf-id4-form-container_h","xxxxx"]);
                        // console.log(p_dialog.id + "-form-container_h");

                        // console.log(docsUrls);
                        var widget = Alfresco.util.ComponentManager.get(p_dialog.id + "_assoc_md_generateFrom-cntrl");
                        Alfresco.util.Ajax.jsonGet({
                            url: docsUrls,
                            successCallback: {
                                fn: function ajax_success(response) {
                                    console.log(response);

                                    console.log(file);

                                    var items = response.json.items;
                                    var nodes = [];

                                    for (var i = 0; i < items.length; i++) {
                                        if (items[i].mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                                            nodes.push(items[i].nodeRef);

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


                        // "template_x002e_folder-actions_x002e_folder-details_x0023_default-editDetails-alf-id4"
                        // "template_x002e_folder-actions_x002e_folder-details_x0023_default-editDetails-alf-id4-form-container_h
                        Alfresco.util.populateHTML([p_dialog.id + "-form-container_h", fileSpan]);

                        // template_x002e_folder-actions_x002e_folder-details_x0023_default-editDetails-alf-id6_assoc_md_generateFrom-cntrl



                        // _assoc_md_generateFrom-cntrl

                    },
                    scope: this
                },
                onSuccess: {
                    fn: function dlA_onActionDetails_success(response) {
                        // console.log(response);
                        // console.log("worked");
                        Alfresco.util.PopupManager.displayMessage({
                            text: this.msg("message.details.success")
                        });

                    },
                    scope: this
                },
                onFailure: {
                    fn: function dLA_onActionDetails_failure(response) {
                        // console.log("failed");
                        Alfresco.util.PopupManager.displayMessage({
                            text: this.msg("message.details.failure")
                        });
                    },
                    scope: this
                }
            });

            // console.log("test final");
            editDetails.show();

        }
    });

})();