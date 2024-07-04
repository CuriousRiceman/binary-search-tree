class Node {
    constructor(data, left = null, right = null) {
        this.data = data;
        this.left = left;
        this.right = right;
    }
    setRight(value) {
        this.right = value;
    }
    setLeft(value) {
        this.left = value;
    }
    getRight() {
        return this.right;
    }
    getLeft() {
        return this.left;
    }
}

class Tree {
    constructor() {
        this.root = null;
    }
    sortArray(arrayFirstHalf, arraySecondHalf) {
        let sortedArray = [];
        while (arrayFirstHalf.length && arraySecondHalf.length) {
            if (arrayFirstHalf[0] > arraySecondHalf[0]) {
                sortedArray.push(arraySecondHalf.shift());
            } else {
                sortedArray.push(arrayFirstHalf.shift());
            }
        }
        return sortedArray.concat(arrayFirstHalf).concat(arraySecondHalf);
    }
    mergeSort(unorderedArray) {
        let arrayLength = unorderedArray.length;
        if (arrayLength <= 1) {
            return unorderedArray;
        }
        const midPoint = Math.floor(arrayLength / 2); // floor rounds down, round rounds up
        const firstHalf = unorderedArray.slice(0, midPoint);
        const secondHalf = unorderedArray.splice(midPoint);

        const sortFirstHalf = this.mergeSort(firstHalf);
        const sortSecondHalf = this.mergeSort(secondHalf);

        return this.sortArray(sortFirstHalf, sortSecondHalf);
    }
    buildTree(sorted, start, end) {
        if (start > end) {
            return null;
        }
        const midPoint = Math.round((start + end) / 2);
        const root = new Node(sorted[midPoint]);
        this.temp
        // [1, 3, 4, 5, 7,   8,   9, 23, 67, 324, 6345]
        root.setLeft(this.buildTree(sorted, start, midPoint - 1));
        root.setRight(this.buildTree(sorted, midPoint + 1, end));

        return root;
    }
    insert(value) {
        // Handle case where the tree is empty
        if (this.root === null) {
            this.root = new Node(value);
            return;
        }
        let tempNode = this.root;
        while (true) {
            if (value === tempNode.data) {
                // No duplicates allowed
                return "No duplicates";
            } else if (value < tempNode.data) {
                // Go left
                if (tempNode.getLeft() === null) {
                    tempNode.setLeft(new Node(value));
                    break;
                } else {
                    tempNode = tempNode.getLeft();
                }
            } else {
                // Go right
                if (tempNode.getRight() === null) {
                    tempNode.setRight(new Node(value));
                    break;
                } else {
                    tempNode = tempNode.getRight();
                }
            }
        }
    }
    deleteItem(value) {
        let priorNode = null;
        let tempNode = this.root;
        let direction = value > tempNode.data ? "right" : "left";
    
        while (tempNode !== null) {
            if (value > tempNode.data) { // Go right
                priorNode = tempNode;
                tempNode = tempNode.getRight();
                direction = "right";
            } else if (value < tempNode.data) { // Go left
                priorNode = tempNode;
                tempNode = tempNode.getLeft();
                direction = "left";
            } else {  // Node to delete found
                // Case 1: Node with no children (leaf node)
                if (tempNode.getLeft() === null && tempNode.getRight() === null) {
                        if (direction === "left") {
                            priorNode.setLeft(null); 
                        } else {
                            priorNode.setRight(null);
                
                        }
                } else if (tempNode.getLeft() === null) { // Case 2: Node with one child
                        if (direction === "left") { // Only right child exists
                            priorNode.setLeft(tempNode.getRight());
                        } else {
                            priorNode.setRight(tempNode.getRight()); 
                        }
                } else if (tempNode.getRight() === null) { // Only left child exists
                        if (direction === "left")  {
                            priorNode.setLeft(tempNode.getLeft());
                        } else { 
                            priorNode.setRight(tempNode.getLeft());
                        }
                } else { // Case 3: Node with two children
                    // Find the inorder successor (smallest in the right subtree)
                    let successor = this.getLeftBottom(tempNode.getRight());
                    let successorValue = successor.data;
                    // Recursively delete the inorder successor (no children so won't change anything)
                    this.deleteItem(successorValue);
                    // Replace tempNode's data with successor's data
                    tempNode.data = successorValue;
                }
                break; // Exit loop after deleting the node
            }
        }
    }
    // Helper method to find the leftmost node in a subtree
    getLeftBottom(node) {
        let minNode = node;
        while (minNode !== null && minNode.getLeft() !== null) {
            minNode = minNode.getLeft();
        }
        return minNode;
    }
    find(value) {
        let tempNode = this.root;
        while (true) {
            if (value > tempNode.data) {
                tempNode = tempNode.getRight();
            } else if (value < tempNode.data) {
                tempNode = tempNode.getLeft();
            } else {
                break;
            }
        }
        return tempNode;
    }
    levelOrder(callback) {
        if (!this.root) {
            return;
        }
        let queue = [this.root];
        let levelOrderArray = [];
        while (queue.length !== 0) {
            let tempNode = queue.shift(); // Dequeue
            if (tempNode.getLeft()) {
                queue.push(tempNode.getLeft());
            }
            if (tempNode.getRight()) {
                queue.push(tempNode.getRight());
            }

            if (callback) {
                callback(tempNode.data);
            } else {
                levelOrderArray.push(tempNode.data);
            }
        }
        if (!callback) {
            return levelOrderArray;
        }
    }
    inOrder(callback) {
        if (!this.root) {
            return;
        }
        let tempNode = this.root;
        let inOrderArray = [];
        let queue = [this.root];
        while (tempNode.getLeft()) { // Get left most nodes in left subtree
            queue.push(tempNode.getLeft());
            tempNode = tempNode.getLeft();
        }
        while (queue.length !== 0) { // Will look at each left most node, check if right node exist
            tempNode = queue.pop(); 
            if (callback) {
                callback(tempNode.data);
            }
            inOrderArray.push(tempNode.data);
            if (tempNode.getRight()) { // If right node exist, run through same process of checking for left most node
                tempNode = tempNode.getRight();
                queue.push(tempNode); // Push it into the queue
                while (tempNode !== null && tempNode.getLeft()) { // Check for left most nodes
                    queue.push(tempNode.getLeft());
                    tempNode = tempNode.getLeft();
                }
            }
        }
        return inOrderArray;
    }
    preOrder(callback) {
        let tempNode = this.root;
        let preOrderArray = [];
        let queue = [];
        while (tempNode !== undefined) { // Must check for "undefined" since I use pop as base statement
            if (callback) { // If array has 1 element and gets popped, its undefined, not null
                callback(tempNode.data);
            }
            preOrderArray.push(tempNode.data);
            if (tempNode.getRight()) { // If right node exists, put in queue
                queue.push(tempNode.getRight());
            }
            if (tempNode.getLeft()) { // Pass left node to the array
                tempNode = tempNode.getLeft();
            } else {
                tempNode = queue.pop(); // If no child nodes, we will take from the queue and go to right subtree
            }
        }
        if (!callback) {
            return preOrderArray;
        }
    }
    postOrder(callback) {
        if (!this.root) return [];
        let postOrderArray = [];
        let queue = [this.root];
        let tempNode = this.root;
        let previousNode = null;
        while (tempNode.getLeft()) { // Get all left nodes
            queue.push(tempNode.getLeft());
            tempNode = tempNode.getLeft();
        }
        while (queue.length !== 0) { 
            tempNode = queue[queue.length - 1]; // Peak at the queue for now
            if (tempNode.getRight() && tempNode.getRight() !== previousNode) { // The previous node comparison is intended for the right subtree of each subtree
                tempNode = tempNode.getRight(); // If it has right and is equal to previously visited node, then we know its completed so ignore it
                while (tempNode) { // Otherwise, we will traverse the left nodes and add to queue, similar process to above
                    queue.push(tempNode);
                    tempNode = tempNode.getLeft();
                }
                previousNode = null; // Set to null to reset
            } else { // Otherwise, we will push it onto array, and set it as the previousNode for comparison
                postOrderArray.push(tempNode.data);
                previousNode = queue.pop();
            }               
            
        }
        if (!callback) {
            return postOrderArray;
        }
    }
    depth(node) {
        let tempNode = this.root;
        let howTall = 0;
        while (node !== tempNode.data && tempNode !== null) {
            if (node > tempNode.data) {
                tempNode = tempNode.getRight();
            } else {
                tempNode = tempNode.getLeft();
            }
            howTall++;
        }
        return howTall;
        
    }
    height(nodeData) {
        let tempNode = this.root;
        while (tempNode !== null && tempNode.data !== nodeData) {
            if (nodeData > tempNode.data) {
                tempNode = tempNode.getRight();
            } else if (nodeData < tempNode.data) {
                tempNode = tempNode.getLeft();
            }
        }
        let queue = [tempNode];
        let height = -1;
        while (queue.length !== 0) {
            let levelSize = queue.length;
            height++;
            for (let i = 0; i < levelSize; i++) {
                let current = queue.shift();
                if (current.getLeft()) {
                    queue.push(current.getLeft());
                }
                if (current.getRight()) {
                    queue.push(current.getRight());
                }
            }
        }
        return height;
    }
    
    
    isBalanced() {
        let tempNode = null;
        let queue = [this.root];
        let balanced = true;
        let leftHeight;
        let rightHeight;
        while (queue.length !== 0 && balanced) {
            tempNode = queue.shift();
            leftHeight = 1;
            rightHeight = 1;
            if (tempNode.getRight() || tempNode.getLeft()) {
                if (tempNode.getRight()) {
                    queue.push(tempNode.getRight());
                    rightHeight += this.height(tempNode.getRight().data);
                }
                if (tempNode.getLeft()) {
                    queue.push(tempNode.getLeft());
                    leftHeight += this.height(tempNode.getLeft().data);
                }
            }
            if (Math.abs(leftHeight - rightHeight) <= 1) {
                continue;
            } else {
                balanced = false;
            }
        }
        if (balanced) {
            console.log("Balanced");
        } else {
            console.log("Not balanced");
        }
    }
    rebalance() {
        // use isBalanced function first and for checks
        // research rotations - left, right, left-right, right-left rotations
        // well simply done, I just need to use a traverse, and put that array in buildTree
        // 
    }
}

const prettyPrint = (node, prefix = "", isLeft = true) => {
    if (node === null) {
      return;
    }
    if (node.right !== null) {
      prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
    if (node.left !== null) {
      prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
  };

const tree = new Tree();
let arr = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];
// Remove duplicates
arr = [...new Set(arr)];
let arrLength = arr.length; // 11
arr = tree.mergeSort(arr);
tree.root = tree.buildTree(arr, 0, arrLength - 1);

tree.insert(10);
// tree.deleteItem(5);
// console.log(tree.find(6345));
// console.log(tree.levelOrder());
// tree.insert(0.5);
prettyPrint(tree.root); // [1, 3, 4, 5, 7, 8, 9, 23, 67, 324, 6345]
// console.log(tree.inOrder());
// console.log(tree.preOrder());
// console.log(tree.postOrder());
// console.log(tree.depth(8));
// console.log(tree.height(8));

// tree.isBalanced();

// Notes:
// let array = [10, 20, 30, 40, 50];
// console.log(array.splice(1,3)); // (start inclusive - end inclusive) -> [20, 30, 40]
// console.log(array); // splice removes from original array
// console.log(array.slice(1, 3)); // (start inclusive - end exclusive) -> [20, 30]
// console.log(array); // slice DOESNT remove from original array


