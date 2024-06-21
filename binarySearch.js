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
        while (tempNode !== null && tempNode.getLeft()) { // Get left most nodes in left subtree
            queue.push(tempNode.getLeft());
            tempNode = tempNode.getLeft();
        }
        while (queue.length !== 0) { // Will look at each left most node, check if right node exist
            tempNode = queue.pop(); 
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
        if (!callback) {
            return inOrderArray;
        }
    }
    preOrder(callback) {

    }
    postOrder(callback) {

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

// tree.insert(10);
// tree.deleteItem(5);
// console.log(tree.find(6345));
// console.log(tree.levelOrder());

prettyPrint(tree.root); // [1, 3, 4, 5, 7, 8, 9, 23, 67, 324, 6345]
console.log(tree.inOrder());

// Notes:
// let array = [10, 20, 30, 40, 50];
// console.log(array.splice(1,3)); // (start inclusive - end inclusive) -> [20, 30, 40]
// console.log(array); // splice removes from original array
// console.log(array.slice(1, 3)); // (start inclusive - end exclusive) -> [20, 30]
// console.log(array); // slice DOESNT remove from original array


