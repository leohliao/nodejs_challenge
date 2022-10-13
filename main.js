const axios = require('axios');
const endPoint = "https://nodes-on-nodes-challenge.herokuapp.com/nodes/";
const headId = "089ef556-dfff-4ff2-9733-654645be56fe";

const initialize = async (head) => {
    const unique = {};
    
    // Helper method to make API request 
    const getNodes = async(id) => {
        const url = `${endPoint}${id}`;
        const response = await axios({
            merhod: 'get',
            url
        })
        return response.data;
    }
    
    // Helper method for recursive call 
    const countNodes = async (id) => {
        let nodes  = await getNodes(id);
        await Promise.all(
            nodes.map(async (node) => {
                // Save the Node Id to the unique object or increment the count
                if (unique[node.id]) {
                    unique[node.id] += 1;
                } else {
                    unique[node.id] = 1;
                }
                // Run recursive call on each of the ids inside the child_node_ids
                if (node.child_node_ids.length > 0) {
                    for (let childNode of node.child_node_ids) {
                        await countNodes(childNode);
                    }
                }
            })
        )
        
    }
    await countNodes(head);
    
    console.log('Total Number of unique node id: ', Object.keys(unique).length);

    let mostCommonId = undefined;
    let mostCount = -1;
    for (let id in unique) {
        if (!mostCommonId) {
            mostCommonId = id;
            mostCount = unique[id];
        } else {
            let count = unique[id];
            if (count > mostCount) {
                mostCommonId = id;
                mostCount = unique[id];
            }
        }
    }
    console.log('ID with Most Count: ', mostCommonId, ', with total count of: ', mostCount);
    return unique;
}

initialize(headId);
