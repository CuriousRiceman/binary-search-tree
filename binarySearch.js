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
        // [1, 3, 4, 5, 7,   8,   9, 23, 67, 324, 6345]
        root.setLeft(this.buildTree(sorted, start, midPoint - 1));
        root.setRight(this.buildTree(sorted, midPoint + 1, end));

        return root;
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
console.log(arr);
tree.root = tree.buildTree(arr, 0, arrLength - 1);

prettyPrint(tree.root); // [1, 3, 4, 5, 7, 8, 9, 23, 67, 324, 6345]

// Notes:
// let array = [10, 20, 30, 40, 50];
// console.log(array.splice(1,3)); // (start inclusive - end inclusive) -> [20, 30, 40]
// console.log(array); // splice removes from original array
// console.log(array.slice(1, 3)); // (start inclusive - end exclusive) -> [20, 30]
// console.log(array); // slice DOESNT remove from original array


