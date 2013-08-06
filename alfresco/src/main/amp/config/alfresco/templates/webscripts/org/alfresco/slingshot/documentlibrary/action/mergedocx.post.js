<import resource="classpath:alfresco/templates/webscripts/org/alfresco/repository/requestutils.lib.js">
<import resource="classpath:/alfresco/templates/webscripts/org/alfresco/slingshot/documentlibrary/action/action.lib.js">
/**
 * processes data sent from share and formulates an action call
 * @param  {object} p_params 
 * @return {object} - to be processed by the ftl
 */
function runAction(p_params) {
    
    /*
    Convert the POST paramsa to json data
     */
    var jsonData = jsonUtils.toObject(requestbody.content),
        results = [];
    
    // results.push(jsonData);

    /**
     * the string that will become the new node name
     * @type {String}
     */
    var nodeName = jsonData.prop_md_name || "";
    

    

    /**
     * the noderef as a string - will be the final destination of the new doc
     * @type {String}
     */
    var nr_string = args.nodeRef;


    //////////////////////////////////////////////////////////
    //Get a reference to the space to put the document into //
    //////////////////////////////////////////////////////////

    var space;
    if (!nr_string || nr_string == "0") {
        status.setCode(status.STATUS_BAD_REQUEST, "No NodeRef has been supplied");
        return;
    } else {
        space = utils.getNodeFromString(nr_string); 
    };    


    ///////////////////////////////////////////
    //make sure a node name has been entered //
    ///////////////////////////////////////////
    if (!nodeName || nodeName == "") {
        status.setCode(status.STATUS_BAD_REQUEST, "No Name has been supplied");
        return;
    };

    // var DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    /**
     * an array of the nodes to merge
     * @type {Array} of nodes
     */
    var nodesToMerge = [];

    /**
     * the comma separated string of noderef strings
     * @type {String}
     */
    var nodesToMerge_String = jsonData.assoc_md_generateFrom_added || "";

    
    //Convert the comma separated string into array of strings //
    var nodesToMerge_StringArray = nodesToMerge_String.split(",");
    //loop through the arary and append
    for each(var n_str in nodesToMerge_StringArray) {
        nodesToMerge.push(utils.getNodeFromString(n_str));
    }

    //also apend to results array for response
    for each(var node in nodesToMerge) {
        results.push({
            "name": node.name,
            "success": true
        });
    }

    //create a valid filename from nodename  - will create a name like "my_file_name.docx"
    var replaceChar = "_";
    var regEx = new RegExp('[,/\:* ?""<>|]', 'g');
    var filename = nodeName.replace(regEx, replaceChar); 
    filename += ".docx";

    /////////////////////////////////////////////////////////
    //chek the filername doesnt already exist in the space //
    /////////////////////////////////////////////////////////
    // logger.log(space.children);

    for each(node in space.children){
        // logger.log(node.name);
        if (node.name == filename){
            status.setCode(status.STATUS_BAD_REQUEST, "A document with this filename already exists in this folder. Please select a different name.");
            return;
        }
    }



    ///////////////////////
    //perform the action //
    ///////////////////////
    var merge = actions.create("mergedocs");
    merge.parameters['documentName'] = filename;
    merge.parameters['documentTitle'] = nodeName;    
    merge.parameters['nodesToMerge'] = nodesToMerge;
    merge.execute(space);

    
    status.setCode(status.STATUS_CREATED, "A new compound document has been created.");
    results.push({"status":status});
    // 
	// results.push({"message":"A new compound document has been created."});
 //    results.push({"name":filename});
 //    results.push({"destination":nr_string});
    
    return results;

}

main()