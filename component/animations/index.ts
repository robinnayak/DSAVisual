import ArrayAnimation from "./ArrayAnimation";
import AVLTree from "./AVLTree";
import BinaryTreeAnimation from "./BinaryTreeAnimation";
import CircularLinkedListAnimation from "./CircularLinkedListAnimation";
import CircularQueueAnimation from "./CircularQueueAnimation";
import DoublyLinkedListAnimation from "./DoublyLinkedListAnimation";
import GraphAnimation from "./GraphAnimation";
import HashTableAnimation from "./HashTableAnimation";
import HeapsAnimation from "./HeapsAnimation";
import LinkedListAnimation from "./LinkedListAnimation";
import QueueAnimation from "./QueueAnimation";
import StackAnimation from "./StackAnimation";
import TreesAnimation from "./TreesAnimation";

export const animationComponents: Record<string, React.FC> = {
    array: ArrayAnimation,
    linkedlist: LinkedListAnimation,
    doublylinkedlist: DoublyLinkedListAnimation,
    circularlinkedlist: CircularLinkedListAnimation,
    stack: StackAnimation,
    queue: QueueAnimation,
    circularqueue: CircularQueueAnimation,
    hashtables: HashTableAnimation,
    binarytrees: BinaryTreeAnimation,
    avltree: AVLTree,
    heaps: HeapsAnimation,
    graphs: GraphAnimation,
    trees: TreesAnimation
};