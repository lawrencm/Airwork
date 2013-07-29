
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
    YAHOO.Bubbling.fire("registerAction",
 {
        actionName: "onActionCombineAllDocs",
        fn: function mycompany_onActionSendAsEmail(file) {

            console.log("testme2");
            console.log(file);

            var templateUrl = YAHOO.lang.substitute(Alfresco.constants.URL_SERVICECONTEXT + "components/form?itemKind={itemKind}&itemId={itemId}&destination={destination}&mode={mode}&submitType={submitType}&showCancelButton=true&formId={formId}", {
                itemKind: "type",
                itemId: "md:compoundDocScaffold",
                mode: "edit",
                destination:file.nodeRef,
                submitType: "json",
                formId: "mergedocxformall" 
            });

            var actionUrl = YAHOO.lang.substitute("{stem}slingshot/doclib/action/mergedocx?nodeRef={nodeRef}&AllDocs=1",{
                stem:Alfresco.constants.PROXY_URI,
                nodeRef:file.nodeRef
            });




            var editDetails = new Alfresco.module.SimpleDialog(this.id + "-editDetails-" + Alfresco.util.generateDomId());

            editDetails.setOptions({
                width: "40em",
                templateUrl: templateUrl,
                actionUrl: actionUrl,
                destroyOnHide: true,
                method: Alfresco.util.Ajax.POST,
                onSuccess: {
                    fn: function dlA_onActionDetails_success(response) {
                        console.log(response);
                        Alfresco.util.PopupManager.displayMessage({
                            text: this.msg("message.details.success")
                        });

                    },
                    scope: this
                },
                onFailure: {
                    fn: function dLA_onActionDetails_failure(response) {
                        Alfresco.util.PopupManager.displayMessage({
                            text: this.msg("message.details.failure")
                        });
                    },
                    scope: this
                }
            });

            // console.log("got here");
            editDetails.show();

        }
    });



    YAHOO.Bubbling.fire("registerAction",
    {
        actionName: "onActionCombineSelectedDocs",
        fn: function mycompany_onActionSendAsEmail(file) {

            console.log("testme2");
            console.log(file);

            var templateUrl = YAHOO.lang.substitute(Alfresco.constants.URL_SERVICECONTEXT + "components/form?itemKind={itemKind}&itemId={itemId}&destination={destination}&mode={mode}&submitType={submitType}&showCancelButton=true", {
                itemKind: "type",
                itemId: "md:compoundDocScaffold",
                mode: "edit",
                destination:file.nodeRef,
                submitType: "json"

                // formId: "mergedocxform" 
            });

            var actionUrl = YAHOO.lang.substitute("{stem}slingshot/doclib/action/mergedocx?nodeRef={nodeRef}",{
                stem:Alfresco.constants.PROXY_URI,
                nodeRef:file.nodeRef
            });


            console.log("testme3");

            var editDetails = new Alfresco.module.SimpleDialog(this.id + "-editDetails-" + Alfresco.util.generateDomId());

            editDetails.setOptions({
                width: "40em",
                templateUrl: templateUrl,
                actionUrl: actionUrl,
                destroyOnHide: true,
                method: Alfresco.util.Ajax.POST,
                onSuccess: {
                    fn: function dlA_onActionDetails_success(response) {
                        console.log(response);
                        console.log("worked");
                        Alfresco.util.PopupManager.displayMessage({
                            text: this.msg("message.details.success")
                        });

                    },
                    scope: this
                },
                onFailure: {
                    fn: function dLA_onActionDetails_failure(response) {
                        console.log("failed");
                        Alfresco.util.PopupManager.displayMessage({
                            text: this.msg("message.details.failure")
                        });
                    },
                    scope: this
                }
            });

            console.log("test final");
            editDetails.show();

        }
    });

})();