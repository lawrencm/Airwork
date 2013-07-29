// <import resource="classpath:/alfresco/templates/webscripts/org/alfresco/slingshot/documentlibrary/action/action.lib.js" />

function runAction(p_params) {
	return [];
};

// function runAction(p_params) {
// 	//check we have a node ref
// 	var nr_string = args.nodeRef,
// 		space;
// 	if (!nr_string || nr_string == "0"){ 
// 	   status.setCode(status.STATUS_BAD_REQUEST, "No NodeRef has been supplied");
// 	   return;
// 	}else{
// 		//dummy space for now
// 		space = utils.getNodeFromString(nr_string);
// 	};

// 	//initialise variables
// 	var results = []; 

// 	//get the space object
	

// 	//create the action
// 	var merge = actions.create("mergedocs");
// 	var DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"; 

// 	var nodesToMerge = [];

// 	// var space = args.nodeRef;

// 	for each(var node in space.children) {
// 		nodesToMerge.push(node.nodeRef);
// 		results.push({"name":node.name,"success":true});
// 	}

// 	// results.push({"x":p_params});
// 	// merge.parameters['testString'] = "hello one";
// 	merge.parameters['nodesToMerge'] = nodesToMerge;
// 	merge.execute(space);

// 	return results;

// }

// main()
runAction();